import {
  Boxes,
  GitCompareArrows,
  Snowflake,
  Timer,
  Cpu,
  Activity,
  ChevronRight,
  Github,
  Bot,
  Layers,
  Terminal,
  FileJson,
  ArrowUpRight,
  type LucideIcon,
} from 'lucide-react';
import { useLang } from '../i18n';
import { useContent } from '../lib/useContent';
import { SYMBOLS } from '../lib/examples';
import { LINKS } from '../lib/links';
import { Section, SectionHead, Code, cn } from './ui';

export function WhatSection() {
  const c = useContent();
  return (
    <Section id="what" className="py-16 sm:py-24">
      <SectionHead kicker={c.what.kicker} title={c.what.title} lead={c.what.lead} />
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {c.what.principles.map((p, i) => (
          <div
            key={i}
            className="rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200 hover:border-symbol/40"
          >
            <div className="font-mono text-sm font-semibold text-symbol">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="mt-2 text-base font-semibold text-fg">{p.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{p.body}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function LoopSection() {
  const c = useContent();
  return (
    <Section className="py-16 sm:py-20">
      <SectionHead kicker={c.loop.kicker} title={c.loop.title} lead={c.loop.lead} />
      <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
        {c.loop.steps.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <span
              className={cn(
                'rounded-lg border px-3 py-2 font-mono text-[13px]',
                i === 0 || i === c.loop.steps.length - 1
                  ? 'border-symbol/40 bg-symbol/10 text-symbol'
                  : 'border-line bg-panel/50 text-muted',
              )}
            >
              {s}
            </span>
            {i < c.loop.steps.length - 1 && <ChevronRight size={15} className="text-faint" />}
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-6 text-faint">{c.loop.note}</p>
    </Section>
  );
}

const FEATURE_ICONS: LucideIcon[] = [Boxes, GitCompareArrows, Snowflake, Timer, Cpu, Activity];

export function FeaturesSection() {
  const c = useContent();
  return (
    <Section id="features" className="py-16 sm:py-24">
      <SectionHead kicker={c.features.kicker} title={c.features.title} lead={c.features.lead} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {c.features.items.map((it, i) => {
          const Icon = FEATURE_ICONS[i] ?? Boxes;
          const highlight = i === 5; // Phase 5 — the headline
          return (
            <div
              key={i}
              className={cn(
                'group rounded-xl border bg-surface/60 p-5 transition-colors duration-200',
                highlight ? 'border-run/40 bg-run/[0.04]' : 'border-line hover:border-symbol/40',
              )}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'grid h-9 w-9 place-items-center rounded-lg',
                    highlight ? 'bg-run/15 text-run' : 'bg-symbol/10 text-symbol',
                  )}
                >
                  <Icon size={18} />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-faint">{it.phase}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-fg">{it.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{it.body}</p>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

const AI_LAYER_ICONS: LucideIcon[] = [Layers, Boxes, Bot];

const AI_ENDPOINTS = [
  { method: 'POST', path: '/ai/tools/parse' },
  { method: 'POST', path: '/ai/tools/transpile-python' },
  { method: 'POST', path: '/ai/tools/transpile-eml' },
  { method: 'POST', path: '/ai/tools/interpret' },
  { method: 'POST', path: '/ai/tools/trace' },
  { method: 'POST', path: '/ai/tools/roundtrip' },
  { method: 'GET', path: '/ai/tools/health' },
];

const AI_LINKS = [
  { label: 'llms.txt', href: '/llms.txt', icon: FileJson },
  { label: '/ai/ index', href: '/ai/index.md', icon: FileJson },
  { label: 'manifest.json', href: '/ai/manifest.json', icon: FileJson },
  { label: 'OpenAPI 3.1', href: '/ai/tools/openapi.json', icon: FileJson },
];

const AI_CURL = `curl -s https://efficientnewlanguage.org/ai/tools/transpile-python \\
  -H 'content-type: application/json' \\
  -d '{"source":"N^+100\\nΣ(i^2, i in [1:N]) => r\\nr^0"}'`;

export function AiLayerSection() {
  const c = useContent();
  return (
    <Section id="ai" className="py-16 sm:py-24">
      <SectionHead kicker={c.ai.kicker} title={c.ai.title} lead={c.ai.lead} />

      {/* Three-layer model */}
      <div className="mt-10 grid gap-4 md:grid-cols-3">
        {c.ai.layers.map((l, i) => {
          const Icon = AI_LAYER_ICONS[i] ?? Layers;
          return (
            <div key={i} className="rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200 hover:border-symbol/40">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-symbol/10 text-symbol">
                  <Icon size={18} />
                </span>
                <span className="font-mono text-xs uppercase tracking-wider text-faint">{String(i + 1).padStart(2, '0')}</span>
              </div>
              <h3 className="mt-4 text-base font-semibold text-fg">{l.name}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{l.body}</p>
            </div>
          );
        })}
      </div>

      {/* Agent tools */}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <div className="rounded-xl border border-run/30 bg-run/[0.04] p-5">
          <div className="flex items-center gap-2 text-run">
            <Terminal size={16} />
            <h3 className="text-base font-semibold">{c.ai.toolsTitle}</h3>
          </div>
          <p className="mt-2 text-sm leading-6 text-muted">{c.ai.toolsLead}</p>
          <div className="mt-4 overflow-hidden rounded-lg border border-line bg-sunken">
            {AI_ENDPOINTS.map((e, i) => (
              <div key={e.path} className={cn('flex items-center gap-3 px-3 py-2 font-mono text-[12.5px]', i > 0 && 'border-t border-line')}>
                <span className={cn('w-10 shrink-0 font-semibold', e.method === 'GET' ? 'text-symbol' : 'text-run')}>{e.method}</span>
                <span className="text-code">{e.path}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col">
          <p className="text-sm leading-6 text-muted">{c.ai.curlNote}</p>
          <Code className="mt-3 text-[12px] text-code">{AI_CURL}</Code>
          <div className="mt-5">
            <div className="font-mono text-xs uppercase tracking-wider text-faint">{c.ai.linksTitle}</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {AI_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-line bg-panel/60 px-3 py-1.5 font-mono text-[12.5px] text-fg transition-colors duration-200 hover:border-symbol/50 hover:text-symbol"
                >
                  <l.icon size={13} />
                  {l.label}
                  <ArrowUpRight size={12} className="text-faint" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="mt-6 max-w-3xl rounded-lg border border-line bg-panel/30 px-4 py-3 text-sm leading-6 text-muted">
        {c.ai.note}
      </p>
    </Section>
  );
}

export function SymbolsSection() {
  const { lang } = useLang();
  const c = useContent();
  return (
    <Section id="symbols" className="py-16 sm:py-24">
      <SectionHead kicker={c.symbols.kicker} title={c.symbols.title} lead={c.symbols.lead} />
      <div className="mt-8 overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-panel/50 text-[11px] uppercase tracking-wider text-faint">
              <th className="px-4 py-3 font-medium">{c.symbols.colSym}</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">{c.symbols.colPy}</th>
              <th className="px-4 py-3 font-medium">{c.symbols.colDesc}</th>
            </tr>
          </thead>
          <tbody>
            {SYMBOLS.map((r, i) => (
              <tr key={i} className={cn('border-t border-line', i % 2 === 1 && 'bg-panel/20')}>
                <td className="px-4 py-3 font-mono text-[13px] text-symbol">{r.sym}</td>
                <td className="hidden px-4 py-3 font-mono text-[12.5px] text-code sm:table-cell">{r.py}</td>
                <td className="px-4 py-3 text-sm text-muted">{r.desc[lang]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export function CliSection() {
  const c = useContent();
  return (
    <Section className="py-16 sm:py-20">
      <SectionHead kicker={c.cli.kicker} title={c.cli.title} lead={c.cli.lead} />
      <div className="mt-8 overflow-hidden rounded-xl border border-line bg-sunken">
        {c.cli.commands.map((cmd, i) => (
          <div
            key={i}
            className={cn(
              'flex flex-col gap-1 px-4 py-3 sm:flex-row sm:items-center sm:gap-6',
              i > 0 && 'border-t border-line',
            )}
          >
            <code className="font-mono text-[13px] text-run sm:w-80 sm:shrink-0">
              <span className="text-faint">$ </span>
              {cmd.cmd}
            </code>
            <span className="text-sm text-muted">{cmd.desc}</span>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function ArchSection() {
  const c = useContent();
  return (
    <Section id="architecture" className="py-16 sm:py-24">
      <SectionHead kicker={c.arch.kicker} title={c.arch.title} lead={c.arch.lead} />
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {c.arch.packages.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-3 rounded-lg border border-line bg-surface/50 px-4 py-3"
          >
            <code className="font-mono text-[13px] text-symbol">{p.name}</code>
            <span className="ml-auto text-right text-xs text-muted">{p.role}</span>
          </div>
        ))}
      </div>
      <p className="mt-6 max-w-3xl rounded-lg border border-line bg-panel/30 px-4 py-3 text-sm leading-6 text-muted">
        {c.arch.principle}
      </p>
    </Section>
  );
}

export function OssSection() {
  const c = useContent();
  return (
    <Section id="opensource" className="py-16 sm:py-24">
      <SectionHead kicker={c.oss.kicker} title={c.oss.title} lead={c.oss.lead} />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {c.oss.points.map((p, i) => (
          <div key={i} className="rounded-xl border border-line bg-surface/60 p-5">
            <h3 className="text-base font-semibold text-fg">{p.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{p.body}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 rounded-lg border border-amber/30 bg-amber/[0.06] px-4 py-3 text-sm leading-6 text-amber">
        {c.oss.note}
      </p>
      <a
        href={LINKS.github}
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-lg border border-line bg-panel/60 px-5 py-2.5 text-sm font-medium text-fg transition-colors duration-200 hover:border-symbol/50 hover:text-symbol"
      >
        <Github size={16} />
        {c.oss.github}
      </a>
    </Section>
  );
}
