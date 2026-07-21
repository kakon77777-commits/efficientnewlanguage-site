// Command router for the Web Terminal (whitepaper §7). Every command is an
// explicit, named branch — no eval/new Function/raw string execution
// (whitepaper §7.2's hard requirement), so the surface is exactly the
// commands listed below, nothing more.
import {
  checkSource,
  parseSource,
  transpileToPython,
  runSource,
  traceSource,
  roundtripSource,
  type CommandResult,
} from './eml-runtime';
import { listCases, loadCaseSource } from './cases';
import { vfsList, buildSnapshot, downloadJson, type Vfs } from './vfs';
import { runPython } from './python-runtime';

export interface TerminalContext {
  vfs: Vfs;
  cwd: string;
  entry: string;
  setVfs: (next: Vfs) => void;
  reset: () => void;
}

function ok(stdout: string, extra?: Partial<CommandResult>): CommandResult {
  return { ok: true, code: 0, stdout, stderr: '', ...extra };
}
function fail(stderr: string, extra?: Partial<CommandResult>): CommandResult {
  return { ok: false, code: 1, stdout: '', stderr, ...extra };
}

function resolvePath(cwd: string, arg: string): string {
  if (!arg) return cwd;
  if (arg.startsWith('/')) return arg;
  return `${cwd}/${arg}`.replace(/\/+/g, '/');
}

function basename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

function toPyPath(emlPath: string): string {
  return emlPath.replace(/\.eml$/i, '') + '.py';
}

const HELP_TEXT = `Core commands:
  help                    this text
  clear                   clear the scrollback
  pwd                     print working directory
  ls                      list files
  cat <file>              print a file's content
  write <file> <text...>  write a file
  rm <file>               remove a file
  cases list              list every case in the corpus
  cases open <id>         load a case's source into the current file
  eml check <file>        transpile diagnostics only
  eml parse <file>        AST (JSON)
  eml transpile <file>    EML -> Python (also writes <file>.py into the VFS)
  eml run <file>          transpile + execute, show stdout
  eml trace <file>        run and show the phosphor-jsonl-v1 trace
  eml roundtrip <file>    EML -> Py -> EML -> Py fixpoint check
  eml equiv <file>        compare EML interpreter output against real Python
  python <file.py>        run a Python file in the browser (Pyodide, Web Worker)
  export workspace        download a WorkspaceSnapshot .json
  reset                   restore the default workspace`;

export async function runCommand(line: string, ctx: TerminalContext): Promise<CommandResult> {
  const trimmed = line.trim();
  if (!trimmed) return ok('');
  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd) {
    case 'help':
      return ok(HELP_TEXT);

    case 'clear':
      return ok('', { metadata: { clear: true } });

    case 'pwd':
      return ok(ctx.cwd);

    case 'ls':
      return ok(vfsList(ctx.vfs).join('\n') || '(empty)');

    case 'cat': {
      if (!args[0]) return fail('usage: cat <file>');
      const p = resolvePath(ctx.cwd, args[0]);
      if (!(p in ctx.vfs)) return fail(`cat: ${args[0]}: no such file`);
      return ok(ctx.vfs[p]);
    }

    case 'write': {
      if (!args[0]) return fail('usage: write <file> <text...>');
      const p = resolvePath(ctx.cwd, args[0]);
      const content = args.slice(1).join(' ');
      ctx.setVfs({ ...ctx.vfs, [p]: content });
      return ok(`wrote ${args[0]} (${content.length} bytes)`);
    }

    case 'rm': {
      if (!args[0]) return fail('usage: rm <file>');
      const p = resolvePath(ctx.cwd, args[0]);
      if (!(p in ctx.vfs)) return fail(`rm: ${args[0]}: no such file`);
      const next = { ...ctx.vfs };
      delete next[p];
      ctx.setVfs(next);
      return ok(`removed ${args[0]}`);
    }

    case 'cases': {
      if (args[0] === 'list') {
        try {
          const cases = await listCases();
          return ok(cases.map((c) => `${c.id}  ${c.title ?? ''}`).join('\n'));
        } catch (e) {
          return fail(e instanceof Error ? e.message : String(e));
        }
      }
      if (args[0] === 'open' && args[1]) {
        try {
          const { id, source } = await loadCaseSource(args[1]);
          ctx.setVfs({ ...ctx.vfs, [ctx.entry]: source });
          return ok(`loaded ${id} into ${basename(ctx.entry)}`);
        } catch (e) {
          return fail(e instanceof Error ? e.message : String(e));
        }
      }
      return fail('usage: cases list | cases open <id>');
    }

    case 'eml': {
      const sub = args[0];
      const fileArg = args[1] ?? basename(ctx.entry);
      const path = resolvePath(ctx.cwd, fileArg);
      const source = ctx.vfs[path];
      if (source === undefined) return fail(`eml ${sub ?? ''}: ${fileArg}: no such file`);
      switch (sub) {
        case 'check':
          return checkSource(source);
        case 'parse':
        case 'ast':
          return parseSource(source);
        case 'transpile': {
          const transpiled = transpileToPython(source);
          if (transpiled.ok) {
            ctx.setVfs({ ...ctx.vfs, [toPyPath(path)]: transpiled.stdout });
          }
          return transpiled;
        }
        case 'run':
          return runSource(source);
        case 'trace':
          return traceSource(source);
        case 'roundtrip':
          return roundtripSource(source);
        case 'equiv': {
          const interp = runSource(source);
          const transpiled = transpileToPython(source);
          if (!transpiled.ok) {
            return fail(`eml equiv: transpile failed\n${transpiled.stderr}`);
          }
          const py = await runPython(transpiled.stdout);
          const interpreterOutput = interp.stdout;
          const pythonOutput = py.stdout;
          const matches = interpreterOutput.trim() === pythonOutput.trim();
          const equivOk = interp.ok && py.ok && matches;
          return {
            ok: equivOk,
            code: equivOk ? 0 : 1,
            stdout: JSON.stringify({ type: 'eml:equiv', ok: equivOk, interpreterOutput, pythonOutput }, null, 2),
            stderr: equivOk ? '' : py.error ? `${py.error.type}: ${py.error.message}` : '',
            metadata: { interpreterOk: interp.ok, pythonOk: py.ok, matches },
          };
        }
        default:
          return fail(
            `eml: unknown subcommand "${sub ?? ''}" — try: check, parse, transpile, run, trace, roundtrip, equiv`,
          );
      }
    }

    case 'python': {
      if (!args[0]) return fail('usage: python <file.py>');
      const path = resolvePath(ctx.cwd, args[0]);
      const source = ctx.vfs[path];
      if (source === undefined) return fail(`python: ${args[0]}: no such file`);
      const result = await runPython(source);
      return {
        ok: result.ok,
        code: result.ok ? 0 : 1,
        stdout: result.stdout,
        stderr: result.error ? `${result.error.type}: ${result.error.message}` : result.stderr,
        metadata: { durationMs: result.durationMs },
      };
    }

    case 'export': {
      if (args[0] === 'workspace') {
        const snapshot = buildSnapshot(ctx.vfs, ctx.entry);
        downloadJson(`${snapshot.id}.json`, snapshot);
        return ok(`exported ${snapshot.id}.json`);
      }
      return fail('usage: export workspace');
    }

    case 'reset':
      ctx.reset();
      return ok('workspace reset');

    default:
      return fail(`command not found: ${cmd} — type "help" for the command list`);
  }
}
