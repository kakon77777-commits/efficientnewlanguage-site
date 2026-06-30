import { ArrowRight, BookText, Play } from 'lucide-react';
import { transpileEmlToPython, interpret } from '../lib/eml';
import { useContent } from '../lib/useContent';
import { Section } from './ui';

const DEMO = 'N^+100\nΣ(i^2, i in [1:N]) => r\nr^0';

export function Hero() {
  const c = useContent();
  const { python } = transpileEmlToPython(DEMO);
  const out = interpret(DEMO).output.trim();

  return (
    <Section id="top" className="relative pt-32 pb-16 sm:pt-36">
      <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-panel/60 px-3 py-1 font-mono text-xs text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-run" />
            {c.hero.badge}
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
            <span className="text-fg">{c.hero.titleA}</span>
            <br />
            <span className="text-run">{c.hero.titleB}</span>
          </h1>
          <p className="mt-5 max-w-xl text-[15.5px] leading-7 text-muted">{c.hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#playground"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-run px-5 py-2.5 text-sm font-semibold text-base transition-colors duration-200 hover:bg-run/90"
            >
              <Play size={16} />
              {c.hero.ctaTry}
            </a>
            <a
              href="/docs#symbols"
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-panel/50 px-5 py-2.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-symbol/50 hover:text-symbol"
            >
              <BookText size={16} />
              {c.hero.ctaSpec}
            </a>
          </div>
        </div>

        {/* Live demo card — the result is computed by the real interpreter. */}
        <div className="rounded-2xl border border-line bg-surface/80 shadow-2xl shadow-black/40">
          <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
            <span className="ml-2 font-mono text-xs text-faint">sum_of_squares.eml</span>
          </div>
          <div className="space-y-4 p-5 font-mono text-[13.5px] leading-relaxed">
            <div>
              <div className="mb-1.5 text-xs uppercase tracking-wider text-symbol">{c.hero.inLabel}</div>
              <pre className="whitespace-pre-wrap text-fg">{DEMO}</pre>
            </div>
            <div className="flex items-center gap-2 text-faint">
              <ArrowRight size={14} />
              <span className="text-xs">transpile</span>
              <span className="h-px flex-1 bg-line" />
            </div>
            <div>
              <div className="mb-1.5 text-xs uppercase tracking-wider text-muted">{c.hero.pyLabel}</div>
              <pre className="whitespace-pre-wrap text-code">{python.trim()}</pre>
            </div>
            <div className="rounded-lg border border-run/30 bg-run/5 p-3">
              <div className="mb-1 text-xs uppercase tracking-wider text-run">{c.hero.runLabel}</div>
              <pre className="text-lg font-semibold text-run">{out}</pre>
            </div>
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-6 text-faint lg:text-left">{c.hero.note}</p>
    </Section>
  );
}
