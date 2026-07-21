// EmlRuntime — a Web Terminal-facing wrapper over lib/eml.ts's re-exported
// packages (see EML_Web_Terminal_技術白皮書_v0.1.md §11.1). Deliberately NOT
// reusing Playground.tsx's inlined call sites: those are gated by Playground's
// own UI state (e.g. `interpret()` only runs when the Trace tab is selected),
// which is a Playground-specific optimization the Terminal shouldn't inherit —
// a terminal command should just execute immediately when the user runs it.
import {
  parse,
  transpileEmlToPython,
  interpret,
  roundTripFromEml,
  findAnomalies,
  toJsonl,
  type TraceEvent,
} from './eml';

export interface Diagnostic {
  severity: 'error' | 'warning' | 'info';
  code: string;
  message: string;
}

/** Matches the whitepaper's §7.3 CommandResult shape. */
export interface CommandResult {
  ok: boolean;
  code: number;
  stdout: string;
  stderr: string;
  diagnostics?: Diagnostic[];
  trace?: TraceEvent[];
  metadata?: Record<string, unknown>;
}

const RUN_MAX_STEPS = 500_000;

function diagnosticLines(diagnostics: Diagnostic[]): string {
  return diagnostics.map((d) => `${d.severity}: ${d.code} — ${d.message}`).join('\n');
}

export function checkSource(source: string): CommandResult {
  const fwd = transpileEmlToPython(source);
  const errors = fwd.diagnostics.filter((d) => d.severity === 'error');
  return {
    ok: errors.length === 0,
    code: errors.length === 0 ? 0 : 1,
    stdout: errors.length === 0 ? `OK — 0 errors, ${fwd.diagnostics.length} warning(s)` : '',
    stderr: diagnosticLines(errors),
    diagnostics: fwd.diagnostics,
  };
}

export function parseSource(source: string): CommandResult {
  try {
    const ast = parse(source);
    return { ok: true, code: 0, stdout: JSON.stringify(ast, null, 2), stderr: '' };
  } catch (e) {
    return { ok: false, code: 1, stdout: '', stderr: e instanceof Error ? e.message : String(e) };
  }
}

export function transpileToPython(source: string): CommandResult {
  const fwd = transpileEmlToPython(source);
  const errors = fwd.diagnostics.filter((d) => d.severity === 'error');
  return {
    ok: fwd.ok,
    code: fwd.ok ? 0 : 1,
    stdout: fwd.ok ? fwd.python : '',
    stderr: diagnosticLines(errors),
    diagnostics: fwd.diagnostics,
  };
}

export function runSource(source: string): CommandResult {
  const run = interpret(source, { maxSteps: RUN_MAX_STEPS });
  return {
    ok: run.ok,
    code: run.ok ? 0 : 1,
    stdout: run.output,
    stderr: run.error ? `${run.error.type}: ${run.error.message}` : diagnosticLines(run.diagnostics),
    diagnostics: run.diagnostics,
    trace: run.events,
    metadata: { unsupported: run.unsupported },
  };
}

export function traceSource(source: string): CommandResult {
  const run = interpret(source, { maxSteps: RUN_MAX_STEPS });
  const anomalies = findAnomalies(run.events);
  return {
    ok: run.ok,
    code: run.ok ? 0 : 1,
    stdout: toJsonl(run.events),
    stderr: run.error ? `${run.error.type}: ${run.error.message}` : '',
    trace: run.events,
    metadata: { events: run.events.length, anomalies: anomalies.length },
  };
}

export function roundtripSource(source: string): CommandResult {
  const rt = roundTripFromEml(source);
  return {
    ok: rt.ok,
    code: rt.ok ? 0 : 1,
    stdout: rt.message,
    stderr: rt.ok ? '' : rt.message,
    metadata: { steps: Object.keys(rt.steps) },
  };
}
