import { useEffect, useRef, useState } from 'react';
import { Download, RotateCcw } from 'lucide-react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Section, Kicker, cn } from '../components/ui';
import { useContent } from '../lib/useContent';
import { loadCaseSource } from '../lib/cases';
import { defaultVfs, loadVfs, saveVfs, vfsList, buildSnapshot, downloadJson, DEFAULT_ENTRY, type Vfs } from '../lib/vfs';
import { runCommand, type TerminalContext } from '../lib/terminal-commands';
import type { CommandResult } from '../lib/eml-runtime';

const CWD = '/workspace';

interface HistoryEntry {
  command: string;
  result: CommandResult;
}

function basename(path: string): string {
  return path.slice(path.lastIndexOf('/') + 1);
}

export default function Terminal() {
  const c = useContent().terminal;
  const [vfs, setVfs] = useState<Vfs>(defaultVfs);
  const [activeFile, setActiveFile] = useState(DEFAULT_ENTRY);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [input, setInput] = useState('');
  const [outputTab, setOutputTab] = useState<'stdout' | 'diagnostics' | 'trace'>('stdout');
  const [loadedCaseId, setLoadedCaseId] = useState<string | null>(null);
  const [caseLoadError, setCaseLoadError] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore the saved workspace, then apply a ?case= deep link on top of it
  // (deep link wins over whatever was previously saved — matches Playground's
  // existing ?case= priority behavior).
  useEffect(() => {
    const stored = loadVfs();
    const base = stored ?? defaultVfs();
    const caseId = new URLSearchParams(window.location.search).get('case');
    if (!caseId) {
      setVfs(base);
      return;
    }
    let cancelled = false;
    loadCaseSource(caseId)
      .then(({ id, source }) => {
        if (cancelled) return;
        const next = { ...base, [DEFAULT_ENTRY]: source };
        setVfs(next);
        setLoadedCaseId(id);
        setHistory([{ command: `cases open ${id}`, result: { ok: true, code: 0, stdout: `loaded ${id} into main.eml`, stderr: '' } }]);
      })
      .catch(() => {
        if (!cancelled) {
          setVfs(base);
          setCaseLoadError(true);
        }
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history]);

  function updateVfs(next: Vfs) {
    setVfs(next);
    saveVfs(next);
  }

  function resetWorkspace() {
    const fresh = defaultVfs();
    updateVfs(fresh);
    setActiveFile(DEFAULT_ENTRY);
    setLoadedCaseId(null);
    setHistory([]);
  }

  function exportWorkspace() {
    const snapshot = buildSnapshot(vfs, activeFile);
    downloadJson(`${snapshot.id}.json`, snapshot);
  }

  async function submitCommand(e: React.FormEvent) {
    e.preventDefault();
    const line = input;
    setInput('');
    if (!line.trim()) return;
    const ctx: TerminalContext = { vfs, cwd: CWD, entry: activeFile, setVfs: updateVfs, reset: resetWorkspace };
    const result = await runCommand(line, ctx);
    if (result.metadata?.clear) {
      setHistory([]);
      return;
    }
    setHistory((h) => [...h, { command: line, result }]);
    if (result.diagnostics?.length) setOutputTab('diagnostics');
    else if (result.trace?.length) setOutputTab(outputTab === 'diagnostics' ? 'stdout' : outputTab);
  }

  const last = history.length > 0 ? history[history.length - 1].result : null;
  const files = vfsList(vfs);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <Nav />
      <main>
        <Section className="pt-32 pb-16 sm:pt-36">
          <Kicker>{c.kicker}</Kicker>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{c.title}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">{c.lead}</p>

          <div className="mt-8 overflow-hidden rounded-2xl border border-line bg-surface/70">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3 border-b border-line px-4 py-3">
              {loadedCaseId && (
                <span className="rounded-full border border-symbol/30 bg-symbol/10 px-2.5 py-1 font-mono text-[11px] text-symbol">
                  {c.loadedCase} {loadedCaseId}
                </span>
              )}
              <button
                type="button"
                onClick={resetWorkspace}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-line bg-panel/60 px-2.5 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-symbol/50 hover:text-symbol"
              >
                <RotateCcw size={13} />
                {c.reset}
              </button>
              <button
                type="button"
                onClick={exportWorkspace}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-line bg-panel/60 px-2.5 py-1.5 text-xs text-muted transition-colors duration-200 hover:border-symbol/50 hover:text-symbol"
              >
                <Download size={13} />
                {c.exportWorkspace}
              </button>
              <span className="ml-auto font-mono text-[11px] text-faint">{c.helpHint}</span>
            </div>

            {caseLoadError && (
              <div className="border-b border-line bg-amber/10 px-4 py-2 text-xs text-amber">{c.caseLoadFailed}</div>
            )}

            {/* Files / Editor / Output */}
            <div className="grid lg:grid-cols-[140px_1fr_1fr]">
              <div className="border-b border-line lg:border-b-0 lg:border-r">
                <div className="border-b border-line px-3 py-2 font-mono text-[11px] uppercase tracking-wider text-faint">
                  {c.filesLabel}
                </div>
                {files.map((path) => (
                  <button
                    key={path}
                    type="button"
                    onClick={() => setActiveFile(path)}
                    className={cn(
                      'block w-full cursor-pointer truncate px-3 py-1.5 text-left font-mono text-xs transition-colors duration-200',
                      path === activeFile ? 'bg-symbol/10 text-symbol' : 'text-muted hover:text-fg',
                    )}
                  >
                    {basename(path)}
                  </button>
                ))}
              </div>

              <div className="flex min-h-[300px] flex-col border-b border-line lg:border-b-0 lg:border-r">
                <div className="border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-faint">
                  {c.editorLabel} · {basename(activeFile)}
                </div>
                <textarea
                  value={vfs[activeFile] ?? ''}
                  onChange={(e) => updateVfs({ ...vfs, [activeFile]: e.target.value })}
                  spellCheck={false}
                  className="scroll-thin flex-1 resize-none bg-sunken p-4 font-mono text-[13.5px] leading-relaxed text-fg outline-none"
                />
              </div>

              <div className="flex min-h-[300px] flex-col">
                <div className="flex items-center gap-1 border-b border-line px-2 py-1.5">
                  {(['stdout', 'diagnostics', 'trace'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setOutputTab(t)}
                      className={cn(
                        'cursor-pointer rounded-md px-3 py-1.5 text-xs transition-colors duration-200',
                        outputTab === t ? 'bg-panel text-fg' : 'text-muted hover:text-fg',
                      )}
                    >
                      {c.tabs[t]}
                    </button>
                  ))}
                </div>
                <div className="scroll-thin flex-1 overflow-auto p-4 font-mono text-[13px] leading-relaxed">
                  {outputTab === 'stdout' &&
                    (last ? (
                      <pre className={cn(last.ok ? 'text-fg' : 'text-error')}>{last.stdout || last.stderr || '(empty)'}</pre>
                    ) : (
                      <p className="text-faint">{c.noOutputYet}</p>
                    ))}
                  {outputTab === 'diagnostics' &&
                    (last?.diagnostics?.length ? (
                      <div className="space-y-1">
                        {last.diagnostics.map((d, i) => (
                          <div key={i} className={d.severity === 'error' ? 'text-error' : 'text-amber'}>
                            {d.severity}: {d.code} — {d.message}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-faint">{c.noDiagnostics}</p>
                    ))}
                  {outputTab === 'trace' &&
                    (last?.trace?.length ? (
                      <div className="space-y-1">
                        {last.trace.map((e, i) => (
                          <div key={i} className="truncate text-muted">
                            <span className="text-faint">{i + 1}.</span> {e.type.replace(/^eml:/, '')} —{' '}
                            {JSON.stringify(e)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-faint">{c.noTrace}</p>
                    ))}
                </div>
              </div>
            </div>

            {/* Terminal command bar */}
            <div className="border-t border-line">
              <div ref={scrollRef} className="scroll-thin max-h-56 overflow-auto p-3 font-mono text-xs">
                {history.map((h, i) => (
                  <div key={i} className="mb-2">
                    <div className="text-symbol">&gt; {h.command}</div>
                    {(h.result.stdout || h.result.stderr) && (
                      <pre className={cn('whitespace-pre-wrap', h.result.ok ? 'text-muted' : 'text-error')}>
                        {h.result.stdout || h.result.stderr}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
              <form onSubmit={submitCommand} className="flex items-center gap-2 border-t border-line px-3 py-2">
                <span className="font-mono text-sm text-symbol">&gt;</span>
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={c.commandPlaceholder}
                  spellCheck={false}
                  className="flex-1 bg-transparent font-mono text-sm text-fg outline-none placeholder:text-faint"
                />
              </form>
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </div>
  );
}
