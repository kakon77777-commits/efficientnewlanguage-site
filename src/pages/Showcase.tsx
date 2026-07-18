import { useEffect, useRef, useState, type ReactNode } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { useGSAP } from '@gsap/react';
import { ArrowRight, Play, Github, Terminal, BookText, Sun, Moon, ArrowUpRight } from 'lucide-react';
import { useLang } from '../i18n';
import { useTheme } from '../theme';
import { LINKS } from '../lib/links';
import { cn } from '../components/ui';

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrambleTextPlugin, DrawSVGPlugin);

const DEMO = 'N^+100\nΣ(i^2, i in [1:N]) => r\nr^0';
const PY = 'N = 100\nr = sum(i**2 for i in range(1, N+1))\nprint(r)';
const CURL = `curl -s https://efficientnewlanguage.org/ai/tools/transpile-python \\
  -H 'content-type: application/json' \\
  -d '{"source":"N^+100\\nΣ(i^2, i in [1:N]) => r\\nr^0"}'`;
const AI_LINKS: [string, string][] = [
  ['llms.txt', '/llms.txt'],
  ['/ai/', '/ai/index.md'],
  ['manifest.json', '/ai/manifest.json'],
  ['OpenAPI', '/ai/tools/openapi.json'],
];

/** 華麗版 — the "magic in one second" showcase. Cinematic + trace terminal.
 * Content renders without JS (SEO/reduced-motion safe); GSAP only enhances. */
export default function Showcase() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const t = (en: string, zh: string) => (lang === 'zh' ? zh : en);
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Animate only when the user is OK with motion. Reduced-motion users keep
      // the (already visible) content with no animation.
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        // Hero: title stays visible (first screen shows text first); the giant Σ
        // and the sub-row get a quick, tasteful entrance.
        gsap.from('[data-hero-glyph]', { opacity: 0, scale: 0.8, duration: 1, ease: 'power3.out' });
        gsap.from('[data-hero-line]', {
          opacity: 0,
          y: 18,
          duration: 0.7,
          stagger: 0.12,
          delay: 0.15,
          ease: 'power2.out',
        });
        // Below-fold scroll reveals. gsap.from keeps the natural (visible) state
        // as the fallback, so content is never stuck hidden if JS/ScrollTrigger
        // doesn't run; reduced-motion users skip this block entirely.
        gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
          gsap.from(el, {
            opacity: 0,
            y: 24,
            duration: 0.7,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 88%' },
          });
        });

        // Act 2 — the EML symbols materialize out of scramble when the card enters,
        // while the Python lines subtly collapse. (The EML text is already in the
        // DOM, so this is pure enhancement — it re-scrambles into itself.)
        const emlLines = gsap.utils.toArray<HTMLElement>('.eml-line');
        if (emlLines.length) {
          ScrollTrigger.create({
            trigger: '.eml-card',
            start: 'top 78%',
            once: true,
            onEnter: () =>
              emlLines.forEach((line, i) =>
                gsap.to(line, {
                  duration: 1.1,
                  delay: i * 0.18,
                  scrambleText: { text: line.dataset.eml || line.textContent || '', chars: 'Σ∈⇒λ∂01{}[]^', speed: 0.5 },
                }),
              ),
          });
          gsap.from('.py-line', {
            opacity: 0.25,
            x: -10,
            duration: 0.6,
            stagger: 0.08,
            scrollTrigger: { trigger: '.eml-card', start: 'top 80%' },
          });
        }
      });

      // Act 3 — pinned pipeline that draws (DrawSVG) and lights its nodes as you
      // scrub through it. Desktop + motion only; mobile/reduced-motion get the
      // static pipeline (the line is fully drawn and nodes active by default CSS).
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const wrap = root.current?.querySelector('.pipe-wrap');
        if (!wrap) return;
        // No pin/scrub (that made scrolling feel slow) — play once when it enters.
        const tl = gsap.timeline({ scrollTrigger: { trigger: wrap, start: 'top 72%', once: true } });
        tl.fromTo('.pipe-line', { drawSVG: '0%' }, { drawSVG: '100%', duration: 1.1, ease: 'power1.inOut' }, 0).fromTo(
          '.pipe-node',
          { '--on': 0 },
          { '--on': 1, duration: 0.35, stagger: 0.1, ease: 'none' },
          0.15,
        );
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="relative min-h-screen overflow-x-hidden bg-base text-fg">
      {/* Ambient depth */}
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            'radial-gradient(70% 50% at 50% -5%, rgba(56,189,248,0.12), transparent 60%), radial-gradient(50% 40% at 50% 105%, rgba(34,197,94,0.10), transparent 60%)',
        }}
      />

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4">
        <nav className="mx-auto flex h-13 w-full max-w-6xl items-center gap-4 rounded-xl border border-line/70 bg-base/70 px-4 py-2.5 backdrop-blur-md">
          <a href="/" className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-symbol/15 font-mono text-sm font-bold text-symbol">
              Σ
            </span>
            <span className="font-display text-sm font-semibold tracking-tight">EML</span>
          </a>
          <div className="ml-auto flex items-center gap-2 text-sm">
            <a href="/app" className="hidden cursor-pointer rounded-md px-3 py-1.5 text-muted transition-colors duration-200 hover:text-fg sm:inline">
              {t('Playground', '示範區')}
            </a>
            <a href="/docs" className="hidden cursor-pointer rounded-md px-3 py-1.5 text-muted transition-colors duration-200 hover:text-fg sm:inline">
              {t('Docs', '文件')}
            </a>
            <div className="flex items-center rounded-lg border border-line bg-panel/60 p-0.5">
              {([['light', Sun], ['dark', Moon]] as const).map(([th, Icon]) => (
                <button
                  key={th}
                  onClick={() => setTheme(th)}
                  aria-label={th === 'light' ? 'Light' : 'Dark'}
                  className={cn('grid h-7 w-7 cursor-pointer place-items-center rounded-md transition-colors duration-200', theme === th ? 'bg-symbol/20 text-symbol' : 'text-muted hover:text-fg')}
                >
                  <Icon size={14} />
                </button>
              ))}
            </div>
            <div className="flex items-center rounded-lg border border-line bg-panel/60 p-0.5 font-mono text-xs">
              {(['en', 'zh'] as const).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={cn('cursor-pointer rounded-md px-2 py-1 transition-colors duration-200', lang === l ? 'bg-symbol/20 text-symbol' : 'text-muted hover:text-fg')}
                >
                  {l === 'en' ? 'EN' : '繁中'}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 sm:px-8">
        {/* ── Act 1 — Σ descends ───────────────────────────────────────── */}
        <section className="flex min-h-screen flex-col items-center justify-center py-28 text-center">
          <div data-hero-glyph className="glow-cyan font-display text-[34vw] leading-none text-symbol sm:text-[22vw] lg:text-[260px]">
            Σ
          </div>
          <h1 data-hero-line className="-mt-4 font-display text-4xl font-bold tracking-tight sm:text-6xl">
            {t('Symbolic in.', '輸入符號，')} <span className="text-run glow-run">{t('Real result out.', '輸出真實結果。')}</span>
          </h1>
          <p data-hero-line className="mt-5 max-w-xl text-balance text-base leading-7 text-muted sm:text-lg">
            {t(
              'Watch a program collapse into meaning — then come alive and run. EML is a semantic overlay for humans and AI agents.',
              '看一段程式塌縮成意義——然後活過來、真的執行。EML 是給人類與 AI 代理的語意疊加層。',
            )}
          </p>
          <div data-hero-line className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href="#run" className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-run px-6 py-3 text-sm font-semibold text-base transition-colors duration-200 hover:bg-run/90">
              <Play size={16} /> {t('See it run', '看它執行')}
            </a>
            <a href="/app" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-panel/40 px-6 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-symbol/50 hover:text-symbol">
              <Terminal size={16} /> {t('Open Playground', '打開示範區')}
            </a>
          </div>
          <div data-hero-line className="mt-16 font-mono text-xs text-faint">{t('scroll', '向下捲動')} ↓</div>
        </section>

        {/* ── Act 2 — Collapse: Python → EML ───────────────────────────── */}
        <Act
          kicker={t('The compression', '壓縮')}
          title={t('A loop collapses into three symbols', '一段迴圈塌縮成三個符號')}
          lead={t(
            'The same computation, written twice. EML keeps the meaning and drops the ceremony — and it transpiles back, deterministically.',
            '同一個運算，寫兩次。EML 留住意義、丟掉繁文縟節——而且能確定性地轉譯回去。',
          )}
        >
          <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="reveal rounded-xl border border-line bg-sunken">
              <div className="border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-faint">Python</div>
              <pre className="p-4 font-mono text-[13.5px] leading-relaxed text-code">
                {PY.split('\n').map((l, i) => (
                  <div key={i} className="py-line">{l}</div>
                ))}
              </pre>
            </div>
            <div className="flex items-center justify-center text-faint reveal">
              <ArrowRight className="hidden md:block" />
              <span className="font-mono text-xs md:hidden">↓</span>
            </div>
            <div className="eml-card reveal rounded-xl border border-symbol/30 bg-sunken">
              <div className="border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-symbol">EML</div>
              <pre className="p-4 font-mono text-[15px] leading-relaxed text-fg">
                {DEMO.split('\n').map((l, i) => (
                  <div key={i} className="eml-line" data-eml={l}>{l}</div>
                ))}
              </pre>
            </div>
          </div>
        </Act>

        {/* ── Act 3 — The pipeline ─────────────────────────────────────── */}
        <Act
          kicker={t('Not magic — a toolchain', '不是魔法，是工具鏈')}
          title={t('One deterministic pass', '一趟確定性流程')}
          lead={t(
            'Symbols become runnable, observable Python through a rule-based pipeline. No LLM in the core.',
            '符號經過規則化流程，變成可執行、可觀測的 Python。核心不放任何 LLM。',
          )}
        >
          <div className="pipe-wrap relative py-6">
            {/* DrawSVG connector — desktop only; draws as you scrub the pinned section. */}
            <svg
              className="pipe-svg pointer-events-none absolute inset-x-0 top-1/2 hidden h-0.5 w-full -translate-y-1/2 md:block"
              viewBox="0 0 1000 2"
              preserveAspectRatio="none"
              aria-hidden
            >
              <line className="pipe-line" x1="2" y1="1" x2="998" y2="1" />
            </svg>
            <div className="relative flex flex-wrap items-center justify-center gap-x-2 gap-y-3 md:justify-between">
              {['EML', 'normalize', 'lex', 'parse → AST', 'semantic', 'emit', 'Python', 'run / trace'].map((s, i, a) => (
                <div key={s} className="flex items-center gap-2">
                  <span className="pipe-node rounded-lg border bg-base px-3 py-2 font-mono text-[13px]">{s}</span>
                  {i < a.length - 1 && <span className="text-faint md:hidden">→</span>}
                </div>
              ))}
            </div>
          </div>
        </Act>

        {/* ── Act 4 — Real execution (trace) ────────────────────────────── */}
        <LiveExecution t={t} />

        {/* ── Act 5 — Human × Agent ────────────────────────────────────── */}
        <Act
          kicker={t('Human × Agent', '人 × 代理')}
          title={t('One artifact, two readers', '同一份製品，兩種讀者')}
          lead={t(
            'Humans read the projection. Agents read the structure — AST, semantics, trace. EML is a shared language between them.',
            '人讀投影，代理讀結構——AST、語意、trace。EML 是兩者之間的共同語言。',
          )}
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="reveal rounded-xl border border-line bg-surface/60 p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-symbol">{t('Human view', '人類視角')}</div>
              <pre className="mt-3 font-mono text-lg text-fg">Σ(i², i∈[1:N])</pre>
              <p className="mt-3 text-sm leading-6 text-muted">{t('A dense, readable projection.', '高密度、好讀的投影。')}</p>
            </div>
            <div className="reveal rounded-xl border border-line bg-sunken p-6">
              <div className="font-mono text-xs uppercase tracking-wider text-run">{t('Agent view', '代理視角')}</div>
              <pre className="mt-3 font-mono text-[12px] leading-relaxed text-code">{'{ Sum: { expr: Power(i,2),\n  range: [1, N] } }\n→ eml:sum · eml:assign · eml:output'}</pre>
              <p className="mt-3 text-sm leading-6 text-muted">{t('Structured AST + execution trace.', '結構化 AST + 執行 trace。')}</p>
            </div>
          </div>
        </Act>

        {/* ── Act 5.5 — AI-native interface ────────────────────────────── */}
        <Act
          kicker={t('AI-native interface', 'AI 原生接口')}
          title={t('Not just a website — a semantic node', '不只是網站，而是語義節點')}
          lead={t(
            'The page you read is for people. The /ai/ surface you can call is for agents — same EML, two readers. A public, non-visual, machine-readable layer plus bounded tools any agent can invoke.',
            '你讀的頁面是給人的；你能調用的 /ai/ 表面是給代理的——同一個 EML，兩種讀者。一個公開、非視覺化、機器可讀的層，外加任何代理都能調用的受限工具。',
          )}
        >
          <div className="grid gap-4 md:grid-cols-3">
            {([
              [t('Human UI Layer', 'Human UI（人類層）'), t('Landing, workbench, and the in-browser playground.', '首頁、工作台、瀏覽器內示範區。')],
              [t('Machine Corpus Layer', 'Machine Corpus（機器語料層）'), t('/ai/ — the v1.0 spec, EBNF, AST / trace / error schemas, verified examples.', '/ai/ — v1.0 規格、EBNF、AST／trace／error schema、已驗證範例。')],
              [t('Agent Tool Layer', 'Agent Tool（代理工具層）'), t('/ai/tools/* — parse, transpile both ways, interpret, trace, round-trip.', '/ai/tools/* — 解析、雙向轉譯、直譯、trace、往返。')],
            ] as [string, string][]).map(([name, body], i) => (
              <div key={i} className="reveal rounded-xl border border-line bg-surface/60 p-5">
                <div className="font-mono text-sm font-semibold text-symbol">{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-2 text-base font-semibold text-fg">{name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
              </div>
            ))}
          </div>
          <div className="reveal mt-4 overflow-hidden rounded-xl border border-run/30 bg-sunken">
            <div className="flex items-center gap-2 border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-run">
              <Terminal size={13} /> {t('Call it from a terminal — live, deterministic', '從終端機調用——即時、確定性')}
            </div>
            <pre className="scroll-thin overflow-auto p-4 font-mono text-[12px] leading-relaxed text-code">{CURL}</pre>
          </div>
          <div className="reveal mt-4 flex flex-wrap gap-2">
            {AI_LINKS.map(([label, href]) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-panel/40 px-3 py-1.5 font-mono text-xs text-fg transition-colors duration-200 hover:border-symbol/50 hover:text-symbol"
              >
                {label} <ArrowUpRight size={12} className="text-faint" />
              </a>
            ))}
          </div>
        </Act>

        {/* ── Act 6 — CTA ──────────────────────────────────────────────── */}
        <section className="py-28 text-center">
          <h2 className="reveal font-display text-3xl font-bold tracking-tight sm:text-5xl">
            {t('Try EML in the browser.', '在瀏覽器試一次。')}
          </h2>
          <div className="reveal mt-10 flex flex-wrap items-center justify-center gap-3">
            <a href="/app" className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-run px-6 py-3 text-sm font-semibold text-base transition-colors duration-200 hover:bg-run/90">
              <Terminal size={16} /> {t('Open Playground', '打開示範區')}
            </a>
            <a href="/docs" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-panel/40 px-6 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-symbol/50 hover:text-symbol">
              <BookText size={16} /> {t('Read the spec', '閱讀規格')}
            </a>
            <a href={LINKS.github} target="_blank" rel="noreferrer" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-panel/40 px-6 py-3 text-sm font-medium text-fg transition-colors duration-200 hover:border-symbol/50 hover:text-symbol">
              <Github size={16} /> GitHub
            </a>
          </div>
          <p className="reveal mt-12 font-mono text-xs text-faint">
            © 2026 EveMissLab（一言諾科技有限公司）/ Neo.K · Apache-2.0
          </p>
        </section>
      </main>
    </div>
  );
}

/** A standard scroll act: kicker + title + lead + body. */
function Act({
  kicker,
  title,
  lead,
  children,
}: {
  kicker: string;
  title: string;
  lead: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line/50 py-24">
      <div className="reveal mb-10 max-w-3xl">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-symbol">{kicker}</div>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">{title}</h2>
        <p className="mt-3 text-[15px] leading-7 text-muted">{lead}</p>
      </div>
      {children}
    </section>
  );
}

function CodeCard({ label, tone, children }: { label: string; tone: 'muted' | 'symbol'; children: string }) {
  return (
    <div className="reveal rounded-xl border border-line bg-sunken">
      <div className={cn('border-b border-line px-4 py-2 font-mono text-[11px] uppercase tracking-wider', tone === 'symbol' ? 'text-symbol' : 'text-faint')}>{label}</div>
      <pre className={cn('p-4 font-mono text-[13.5px] leading-relaxed', tone === 'symbol' ? 'text-fg' : 'text-code')}>{children}</pre>
    </div>
  );
}

/** Act 4 — runs the REAL @eml/interp in-browser when scrolled into view. */
function LiveExecution({ t }: { t: (en: string, zh: string) => string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<string[]>([]);
  const [num, setNum] = useState(0);
  const [done, setDone] = useState(false);
  const ranRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Run once when the section scrolls into view. A scroll listener + rect check
    // is more reliable across environments than IntersectionObserver, and also
    // fires if the section is already visible on load.
    const trigger = () => {
      if (ranRef.current) return;
      ranRef.current = true;
      void run();
    };
    const check = () => {
      if (ranRef.current) return;
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.85 && r.bottom > 0) trigger();
    };
    const onHash = () => {
      if (window.location.hash === '#run') trigger();
    };
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('hashchange', onHash);
    check();
    onHash();
    return () => {
      window.removeEventListener('scroll', check);
      window.removeEventListener('hashchange', onHash);
    };

    async function run() {
      try {
        // Lazy-load the interpreter so it stays out of the showcase's initial bundle.
        const { interpret } = await import('@eml/interp');
        const r = interpret(DEMO);
        const out = parseInt(r.output.trim(), 10) || 0;
        const streamed = r.events
          .map((e) => {
            const f = e as Record<string, unknown>;
            if (e.type === 'eml:assign') return `${f.name} = ${f.value}`;
            if (e.type === 'eml:sum') return `Σ ${f.iterator} ×${f.count} → ${f.result}`;
            if (e.type === 'eml:output') return `» print ${f.text}`;
            if (e.type === 'eml:run:done') return '✓ executed';
            return null;
          })
          .filter((x): x is string => x !== null);

        const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (reduce) {
          setLines(streamed);
          setNum(out);
          setDone(true);
          return;
        }
        // Stream the trace lines, then count the result up. Timer-based (not rAF)
        // so it advances even when the tab is throttled, with a guaranteed final.
        streamed.forEach((_, i) => setTimeout(() => setLines(streamed.slice(0, i + 1)), 220 * (i + 1)));
        const begin = (streamed.length + 1) * 220;
        const dur = 1200;
        let startAt = 0;
        const step = () => {
          const p = Math.min(1, (Date.now() - startAt) / dur);
          setNum(Math.round(out * (1 - Math.pow(1 - p, 3)))); // easeOutCubic
          if (p < 1) window.setTimeout(step, 40);
          else setDone(true);
        };
        window.setTimeout(() => {
          startAt = Date.now();
          step();
        }, begin);
        window.setTimeout(() => {
          setNum(out);
          setDone(true);
        }, begin + dur + 800); // safety: guarantee the final value
      } catch (err) {
        setLines(['⚠ ' + (err instanceof Error ? err.message : String(err))]);
        setDone(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section id="run" ref={ref} className="border-t border-line/50 py-24">
      <div className="reveal mb-10 max-w-3xl">
        <div className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-run">{t('Execution is the interface', '執行即是介面')}</div>
        <h2 className="font-display text-2xl font-bold tracking-tight sm:text-4xl">{t('It actually runs. Right here.', '它真的會跑。就在這裡。')}</h2>
        <p className="mt-3 text-[15px] leading-7 text-muted">
          {t(
            'No video, no mockup. The program below executes in your browser via EML’s execution-truth interpreter, emitting a phosphor-jsonl-v1 trace.',
            '不是影片，不是假圖。下面這段程式由 EML 的「執行真相」直譯器在你的瀏覽器裡執行，並送出 phosphor-jsonl-v1 trace。',
          )}
        </p>
      </div>

      <div className="reveal scanlines overflow-hidden rounded-2xl border border-run/30 bg-sunken">
        <div className="flex items-center gap-2 border-b border-line px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-run/80" />
          <span className="font-mono text-xs text-faint">eml://run · phosphor-jsonl-v1</span>
          <span className={cn('ml-auto font-mono text-[11px]', done ? 'text-run' : 'text-faint')}>{done ? t('done', '完成') : t('running…', '執行中…')}</span>
        </div>
        <div className="grid gap-0 md:grid-cols-2">
          <pre className="border-b border-line p-5 font-mono text-[13.5px] leading-relaxed text-fg md:border-b-0 md:border-r">{DEMO}</pre>
          <div className="p-5 font-mono text-[13px]">
            <div className="min-h-[120px] space-y-1">
              {lines.length === 0 && <div className="text-faint">{t('// scroll in to execute', '// 捲到這裡就會執行')}</div>}
              {lines.map((l, i) => (
                <div key={i} className={cn(l.startsWith('»') && 'text-run', l.startsWith('✓') && 'text-run', l.startsWith('Σ') && 'text-symbol')}>
                  {l}
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-line pt-4">
              <div className="text-xs uppercase tracking-wider text-faint">stdout</div>
              <div className="text-4xl font-bold text-run glow-run">{num}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="reveal mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-faint">
          {t('Not a video. Not a mockup. Executed in your browser.', '不是影片，不是假圖。這是在你的瀏覽器中執行。')}
          {' · '}
          {t('No backend, no local Python for this demo.', '這個 demo 不需要後端，也不需要本機 Python。')}
        </p>
        <a href="/app" className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-panel/40 px-4 py-2 text-sm font-medium text-fg transition-colors duration-200 hover:border-symbol/50 hover:text-symbol">
          {t('Open full Playground', '打開完整示範區')} <ArrowRight size={15} />
        </a>
      </div>
    </section>
  );
}
