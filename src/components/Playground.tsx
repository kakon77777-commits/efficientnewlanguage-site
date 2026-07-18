import { useMemo, useState } from 'react';
import { Clipboard, Check, ArrowLeftRight } from 'lucide-react';
import {
  transpileEmlToPython,
  transpilePythonToEml,
  roundTripFromEml,
  roundTripFromPython,
  interpret,
  parse,
  findAnomalies,
  toJsonl,
  type PhosphorEvent,
} from '../lib/eml';
import { EML_EXAMPLES, PY_EXAMPLES } from '../lib/examples';
import { useLang } from '../i18n';
import { useContent } from '../lib/useContent';
import { Section, SectionHead, cn } from './ui';

type Dir = 'eml2py' | 'py2eml';
type Tab = 'python' | 'trace' | 'ast';

const EDITOR_MAX_STEPS = 500_000;

/**
 * `@hot` has no real Python equivalent, so the forward emitter renders it as
 * this exact bare comment for human readability. Comments aren't tokenized,
 * so the reverse leg can never recover it — a permanent, documented, purely
 * cosmetic gap (see docs/agent-handoff.md). Recognizing this ONE known line
 * keeps a `@hot` demo from reading as "broken" when it's actually a
 * deliberate, non-functional difference.
 */
const HOT_MARKER_LINE = '# @hot: dynamic state — not cached';

function isHotMarkerOnlyDiff(python1: string, python2: string): boolean {
  const strip = (s: string) => s.split('\n').filter((line) => line !== HOT_MARKER_LINE).join('\n');
  return python1 !== python2 && strip(python1) === strip(python2);
}

/** Compact, colour-coded presentation for one phosphor-jsonl-v1 event. */
function describe(e: PhosphorEvent): { label: string; detail: string; tone: string } {
  const f = e as Record<string, unknown>;
  const s = (k: string) => (f[k] === undefined ? '' : String(f[k]));
  const t = e.type.replace(/^eml:/, '');
  switch (e.type) {
    case 'eml:run:start':
      return { label: 'run:start', detail: `${s('statements')} stmt`, tone: 'text-faint' };
    case 'eml:def':
      return { label: `def ${s('fn')}`, detail: s('temperature'), tone: 'text-symbol' };
    case 'eml:assign':
      return { label: `${s('name')} =`, detail: s('value'), tone: 'text-fg' };
    case 'eml:augment':
      return { label: `${s('name')} ${s('op')}=`, detail: s('value'), tone: 'text-fg' };
    case 'eml:sum':
      return { label: `Σ ${s('iterator')} ×${s('count')}`, detail: `→ ${s('result')}`, tone: 'text-symbol' };
    case 'eml:call':
      return { label: `${s('fn')}(…)`, detail: s('temperature'), tone: 'text-violet' };
    case 'eml:return':
      return { label: `↩ ${s('fn')}`, detail: s('value'), tone: 'text-faint' };
    case 'eml:cache:hit':
      return { label: `cache hit · ${s('fn')}`, detail: s('result'), tone: 'text-symbol' };
    case 'eml:cache:miss':
      return { label: `cache miss · ${s('fn')}`, detail: '', tone: 'text-faint' };
    case 'eml:output':
      return { label: '» print', detail: s('text'), tone: 'text-run' };
    case 'eml:unsupported':
      return { label: `unsupported · ${s('construct')}`, detail: '', tone: 'text-amber' };
    case 'eml:run:incomplete':
      return { label: 'incomplete', detail: s('reason'), tone: 'text-amber' };
    case 'eml:run:error':
      return { label: s('error'), detail: s('message'), tone: 'text-error' };
    case 'eml:run:done':
      return { label: 'run:done', detail: `${s('outputs')} out`, tone: 'text-run' };
    default:
      return { label: t, detail: '', tone: 'text-muted' };
  }
}

export function Playground() {
  const { lang } = useLang();
  const c = useContent();
  const [dir, setDir] = useState<Dir>('eml2py');
  const [tab, setTab] = useState<Tab>('python');
  const [exId, setExId] = useState(EML_EXAMPLES[0].id);
  const [src, setSrc] = useState(EML_EXAMPLES[0].eml);
  const [copied, setCopied] = useState(false);

  const examples = dir === 'eml2py' ? EML_EXAMPLES : PY_EXAMPLES;

  const switchDir = (next: Dir) => {
    if (next === dir) return;
    const ex = (next === 'eml2py' ? EML_EXAMPLES : PY_EXAMPLES)[0];
    setDir(next);
    setExId(ex.id);
    setSrc(ex.eml);
    setTab(next === 'eml2py' ? 'python' : 'trace');
  };

  const pickExample = (id: string) => {
    const ex = examples.find((e) => e.id === id);
    if (ex) {
      setExId(id);
      setSrc(ex.eml);
    }
  };

  const fwd = useMemo(() => (dir === 'eml2py' ? transpileEmlToPython(src) : null), [src, dir]);
  const rev = useMemo(() => (dir === 'py2eml' ? transpilePythonToEml(src) : null), [src, dir]);
  const errors = fwd ? fwd.diagnostics.filter((d) => d.severity === 'error') : [];

  const run = useMemo(() => {
    if (dir !== 'eml2py' || tab !== 'trace' || !fwd?.ok) return null;
    return interpret(src, { maxSteps: EDITOR_MAX_STEPS });
  }, [src, dir, tab, fwd]);

  const ast = useMemo(() => {
    if (dir !== 'eml2py' || tab !== 'ast') return null;
    try {
      return JSON.stringify(parse(src), null, 2);
    } catch (e) {
      return `// parse error\n${e instanceof Error ? e.message : String(e)}`;
    }
  }, [src, dir, tab]);

  const roundTrip = useMemo<{ tone: string; label: string }>(() => {
    try {
      if (dir === 'eml2py' && !fwd) return { tone: 'muted', label: '⇄' };
      // A forward-only construct (functions, if/while/for, class, try/except,
      // dict/set/subscript, import, ...) makes the reverse Python->EML leg
      // decline by design, not by bug — its own error message always starts
      // with "reverse Python->EML failed". Recognizing that signal directly
      // (rather than pre-guessing which AST shapes are forward-only) means
      // the badge doesn't go stale every time the forward-only surface grows.
      const rt = dir === 'eml2py' ? roundTripFromEml(src) : roundTripFromPython(src);
      if (!rt.ok && rt.message.startsWith('reverse Python->EML failed')) {
        return { tone: 'muted', label: c.play.rtNa };
      }
      if (!rt.ok && rt.steps.python1 && rt.steps.python2 && isHotMarkerOnlyDiff(rt.steps.python1, rt.steps.python2)) {
        return { tone: 'muted', label: c.play.rtHot };
      }
      return rt.ok ? { tone: 'run', label: c.play.rtOk } : { tone: 'bad', label: c.play.rtBad };
    } catch {
      return { tone: 'muted', label: c.play.rtNa };
    }
  }, [src, dir, fwd, c]);

  const copyTrace = () => {
    if (!run) return;
    const text = toJsonl(run.events);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(
        () => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        },
        () => undefined,
      );
    }
  };

  const tabs: Tab[] = ['python', 'trace', 'ast'];

  return (
    <Section id="playground" className="py-16 sm:py-24">
      <SectionHead kicker={c.play.kicker} title={c.play.title} lead={c.play.lead} />

      <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface/70">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
          <div className="flex items-center rounded-lg border border-line bg-panel/60 p-0.5 text-xs font-medium">
            {(['eml2py', 'py2eml'] as const).map((d) => (
              <button
                key={d}
                onClick={() => switchDir(d)}
                className={cn(
                  'flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1.5 transition-colors duration-200',
                  dir === d ? 'bg-symbol/20 text-symbol' : 'text-muted hover:text-fg',
                )}
              >
                {d === 'eml2py' ? <ArrowLeftRight size={13} /> : <ArrowLeftRight size={13} className="rotate-180" />}
                {d === 'eml2py' ? c.play.dirEml : c.play.dirPy}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-muted">
            {c.play.example}
            <select
              value={exId}
              onChange={(e) => pickExample(e.target.value)}
              className="cursor-pointer rounded-md border border-line bg-panel px-2.5 py-1.5 text-xs text-fg outline-none focus:border-symbol/60"
            >
              {examples.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name[lang]}
                </option>
              ))}
            </select>
          </label>

          <span
            className={cn(
              'ml-auto rounded-full px-2.5 py-1 font-mono text-[11px]',
              roundTrip.tone === 'run' && 'text-run',
              roundTrip.tone === 'bad' && 'text-error',
              roundTrip.tone === 'muted' && 'text-faint',
            )}
          >
            {roundTrip.label}
          </span>
        </div>

        {/* Panes */}
        <div className="grid lg:grid-cols-2">
          {/* Editor */}
          <div className="flex min-h-[340px] flex-col border-b border-line lg:border-b-0 lg:border-r">
            <div className="border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-faint">
              {dir === 'eml2py' ? 'EML / Py⁺' : 'Python'}
            </div>
            <textarea
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              spellCheck={false}
              className="scroll-thin flex-1 resize-none bg-sunken p-4 font-mono text-[13.5px] leading-relaxed text-fg outline-none"
            />
          </div>

          {/* Output */}
          <div className="flex min-h-[340px] flex-col">
            {dir === 'eml2py' ? (
              <>
                <div className="flex items-center gap-1 border-b border-line px-2 py-1.5">
                  {tabs.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTab(t)}
                      className={cn(
                        'cursor-pointer rounded-md px-3 py-1.5 text-xs transition-colors duration-200',
                        tab === t ? 'bg-panel text-fg' : 'text-muted hover:text-fg',
                      )}
                    >
                      {t === 'python' ? c.play.tabs.python : t === 'trace' ? c.play.tabs.trace : c.play.tabs.ast}
                    </button>
                  ))}
                </div>
                <div className="scroll-thin flex-1 overflow-auto">
                  {tab === 'python' && (
                    <pre className="p-4 font-mono text-[13.5px] leading-relaxed text-code">
                      {fwd?.python.trim() || '# (empty)'}
                    </pre>
                  )}
                  {tab === 'ast' && <pre className="p-4 font-mono text-[12.5px] leading-relaxed text-muted">{ast}</pre>}
                  {tab === 'trace' && <TraceView run={run} c={c} copied={copied} onCopy={copyTrace} />}
                </div>
              </>
            ) : (
              <>
                <div className="border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-faint">
                  EML / Py⁺
                </div>
                <div className="scroll-thin flex-1 overflow-auto">
                  <pre
                    className={cn(
                      'p-4 font-mono text-[13.5px] leading-relaxed',
                      rev?.ok ? 'text-fg' : 'text-error',
                    )}
                  >
                    {rev?.ok ? rev.eml.trim() : `# reverse failed\n# ${rev?.error ?? ''}`}
                  </pre>
                  <p className="px-4 pb-4 text-xs leading-6 text-faint">{c.play.reverseNote}</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Diagnostics */}
        {dir === 'eml2py' && (
          <div className="border-t border-line px-4 py-2.5 font-mono text-xs">
            {errors.length > 0 ? (
              <span className="text-error">
                {errors.length} {c.play.errors}: {errors[0].code} — {errors[0].message}
              </span>
            ) : fwd && fwd.diagnostics.length > 0 ? (
              <span className="text-amber">
                {fwd.diagnostics[0].code} — {fwd.diagnostics[0].message}
              </span>
            ) : (
              <span className="text-run">✓ {c.play.transpiled} · {c.play.clean}</span>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}

function TraceView({
  run,
  c,
  copied,
  onCopy,
}: {
  run: ReturnType<typeof interpret> | null;
  c: ReturnType<typeof useContent>;
  copied: boolean;
  onCopy: () => void;
}) {
  if (!run) return <div className="p-4 text-xs text-faint">{c.play.fixErrors}</div>;
  const anomalies = new Set(findAnomalies(run.events));
  return (
    <div className="p-4">
      <div className="mb-3 flex items-center gap-3">
        <span className="font-mono text-[11px] uppercase tracking-wider text-faint">{c.play.stdout}</span>
        <button
          onClick={onCopy}
          className="ml-auto inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-line bg-panel/60 px-2.5 py-1 font-mono text-[11px] text-muted transition-colors duration-200 hover:border-symbol/50 hover:text-symbol"
        >
          {copied ? <Check size={12} /> : <Clipboard size={12} />}
          {copied ? c.play.copied : c.play.copy}
        </button>
      </div>
      <pre className="mb-4 rounded-lg border border-run/30 bg-run/5 p-3 font-mono text-base font-semibold text-run">
        {run.output.trim() || c.play.noOutput}
      </pre>
      {run.unsupported.length > 0 && <p className="mb-3 text-xs leading-6 text-amber">{c.play.deferNote}</p>}
      <div className="mb-2 font-mono text-[11px] uppercase tracking-wider text-faint">
        phosphor-jsonl-v1 · {run.events.length} {c.play.events} · {anomalies.size} {c.play.anomalies}
      </div>
      <div className="overflow-hidden rounded-lg border border-line">
        {run.events.map((e, i) => {
          const d = describe(e);
          return (
            <div
              key={i}
              className={cn(
                'flex items-baseline gap-3 px-3 py-1.5 font-mono text-[12px]',
                i % 2 === 1 && 'bg-panel/30',
                anomalies.has(e) && 'bg-error/10',
              )}
            >
              <span className="w-5 text-right text-faint/60">{i + 1}</span>
              <span className="w-44 shrink-0 text-faint">{e.type.replace(/^eml:/, '')}</span>
              <span className={cn('truncate', d.tone)}>{d.label}</span>
              <span className="ml-auto truncate text-muted">{d.detail}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
