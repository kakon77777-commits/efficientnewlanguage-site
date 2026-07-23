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
  LayoutGrid,
  Share2,
  Globe,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { useLang, type Lang } from '../i18n';
import { useContent } from '../lib/useContent';
import { SYMBOLS, LOOP_TAXONOMY, type SymbolStatus } from '../lib/examples';
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

const STATUS_STYLE: Record<SymbolStatus, string> = {
  implemented: 'border-symbol/40 bg-symbol/10 text-symbol',
  partial: 'border-amber-500/40 bg-amber-500/10 text-amber-500',
  conceptual: 'border-line bg-panel/50 text-faint',
  planned: 'border-line bg-panel/50 text-faint',
};

function StatusBadge({ status }: { status: SymbolStatus }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        STATUS_STYLE[status],
      )}
    >
      {status}
    </span>
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
              <th className="hidden px-4 py-3 font-medium md:table-cell">{c.symbols.colFamily}</th>
              <th className="px-4 py-3 font-medium">{c.symbols.colDesc}</th>
              <th className="px-4 py-3 font-medium">{c.symbols.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {SYMBOLS.map((r, i) => (
              <tr key={i} className={cn('border-t border-line', i % 2 === 1 && 'bg-panel/20')}>
                <td className="px-4 py-3 font-mono text-[13px] text-symbol">{r.sym}</td>
                <td className="hidden px-4 py-3 font-mono text-[12.5px] text-code sm:table-cell">{r.py}</td>
                <td className="hidden px-4 py-3 text-xs text-faint md:table-cell">{r.family}</td>
                <td className="px-4 py-3 text-sm text-muted">{r.desc[lang]}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-faint">
        {c.symbols.note}{' '}
        <a
          href="/ai/specs/eml-semantic-model-v1.5.md"
          className="text-symbol underline decoration-symbol/30 underline-offset-2 hover:decoration-symbol"
        >
          {c.symbols.fullSpec}
        </a>
      </p>

      <div className="mt-12">
        <h3 className="text-lg font-semibold text-fg">{c.symbols.loopTitle}</h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{c.symbols.loopLead}</p>
        <div className="mt-6 overflow-hidden rounded-xl border border-line">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-panel/50 text-[11px] uppercase tracking-wider text-faint">
                <th className="px-4 py-3 font-medium">{c.symbols.loopCol.id}</th>
                <th className="px-4 py-3 font-medium">{c.symbols.loopCol.name}</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">{c.symbols.loopCol.rule}</th>
                <th className="px-4 py-3 font-medium">{c.symbols.loopCol.status}</th>
              </tr>
            </thead>
            <tbody>
              {LOOP_TAXONOMY.map((r, i) => (
                <tr key={r.id} className={cn('border-t border-line', i % 2 === 1 && 'bg-panel/20')}>
                  <td className="px-4 py-3 font-mono text-[13px] text-symbol">{r.id}</td>
                  <td className="px-4 py-3 text-sm text-fg">{r.name[lang]}</td>
                  <td className="hidden px-4 py-3 text-sm text-muted sm:table-cell">{r.rule[lang]}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

// --- /origins (EML-U) ---------------------------------------------------
// EML-U is the theory-preservation profile: no engineering, no runtime, no
// tools to call. These sections are read-only prose/reference, unlike every
// other Sections.tsx export above which fronts something that actually runs.

export function EmlUDefinitionSection() {
  const c = useContent();
  return (
    <Section id="eml-u" className="py-16 sm:py-24">
      <SectionHead kicker={c.origins.definition.kicker} title={c.origins.definition.title} lead={c.origins.definition.lead} />
      <div className="mt-6 max-w-3xl rounded-xl border border-line bg-surface/60 p-5">
        <p className="text-sm leading-7 text-muted">{c.origins.definition.body}</p>
      </div>
      <p className="mt-6 max-w-3xl rounded-lg border border-amber/30 bg-amber/[0.06] px-4 py-3 text-sm leading-6 text-amber">
        {c.origins.definition.statusNote}
      </p>
    </Section>
  );
}

const CAPABILITY_ICONS: LucideIcon[] = [LayoutGrid, Share2, Globe, Bot];

export function EmlUCapabilitiesSection() {
  const c = useContent();
  return (
    <Section className="py-16 sm:py-20">
      <SectionHead kicker={c.origins.capabilities.kicker} title={c.origins.capabilities.title} lead={c.origins.capabilities.lead} />
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {c.origins.capabilities.clusters.map((cluster, i) => {
          const Icon = CAPABILITY_ICONS[i] ?? LayoutGrid;
          return (
            <div key={i} className="rounded-xl border border-line bg-surface/60 p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-symbol/10 text-symbol">
                  <Icon size={18} />
                </span>
                <h3 className="text-base font-semibold text-fg">{cluster.title}</h3>
              </div>
              <ul className="mt-4 space-y-2.5">
                {cluster.items.map((item, j) => (
                  <li key={j} className="flex gap-2.5 text-sm leading-6 text-muted">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-faint" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

export function EmlPEmlURelationSection() {
  const c = useContent();
  return (
    <Section className="py-16 sm:py-20">
      <SectionHead kicker={c.origins.relation.kicker} title={c.origins.relation.title} lead={c.origins.relation.lead} />
      <p className="mt-6 max-w-3xl font-mono text-sm text-symbol">{c.origins.relation.subsetNote}</p>
      <p className="mt-6 max-w-3xl text-sm leading-6 text-muted">{c.origins.relation.projectionLead}</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        {c.origins.relation.projectionSteps.map((step, i) => (
          <div
            key={i}
            className="rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200 hover:border-symbol/40"
          >
            <div className="font-mono text-sm font-semibold text-symbol">{String(i + 1).padStart(2, '0')}</div>
            <h3 className="mt-2 text-base font-semibold text-fg">{step.title}</h3>
            <p className="mt-2 text-sm leading-6 text-muted">{step.body}</p>
          </div>
        ))}
      </div>
      <Code className="mt-6 max-w-3xl text-[12px] text-code">
        {`{
  "status": "partial_projection",
  "preserved": ["core_operation"],
  "metadata": ["confidence", "authority"],
  "unsupported": ["two_dimensional_branch"]
}`}
      </Code>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-faint">{c.origins.relation.noLossNote}</p>
      <p className="mt-6 max-w-3xl rounded-lg border border-line bg-panel/30 px-4 py-3 text-sm leading-6 text-muted">
        {c.origins.relation.directionNote}
      </p>
    </Section>
  );
}

type RoadmapPhase = { id: string; name: Record<Lang, string>; desc: Record<Lang, string>; status: SymbolStatus };

const EMLU_ROADMAP: RoadmapPhase[] = [
  {
    id: 'U0',
    name: { en: 'Theory preservation', zh: '理論封存' },
    desc: {
      en: 'Archive the original documents, build a version timeline, mark what is implemented vs. not.',
      zh: '保存原始文件、建立版本時間線、標記哪些構想已實作、哪些尚未實作。',
    },
    status: 'partial',
  },
  {
    id: 'U1',
    name: { en: 'Semantic ontology', zh: '語意本體' },
    desc: {
      en: 'Semantic ID, Anchor Model, Overlay Node, Projection, Policy, Provenance, Semantic Graph.',
      zh: 'Semantic ID、Anchor Model、Overlay Node、Projection、Policy、Provenance、Semantic Graph。',
    },
    status: 'planned',
  },
  {
    id: 'U2',
    name: { en: '2D & multi-position syntax', zh: '二維與多位置語法' },
    desc: {
      en: 'Upper/lower semantic layers, two-dimensional flow, folding nodes, graph projection.',
      zh: '上下語意層、二維流程、折疊節點、圖形投影。',
    },
    status: 'planned',
  },
  {
    id: 'U3',
    name: { en: 'Cross-host', zh: '跨宿主' },
    desc: {
      en: 'Code, natural language, tables, JSON, workflow, image, audio, video, game worlds.',
      zh: '程式碼、自然語言、表格、JSON、工作流、圖像、音訊、影片、遊戲世界。',
    },
    status: 'planned',
  },
  {
    id: 'U4',
    name: { en: 'AI-native interface', zh: 'AI 原生介面' },
    desc: {
      en: 'Agent semantic graph, intent compression, adaptive projection, semantic negotiation, human/AI dual view.',
      zh: 'Agent 語意圖、意圖壓縮、自適應投影、語意協商、人類／AI 雙重視圖。',
    },
    status: 'planned',
  },
];

export function EmlURoadmapSection() {
  const { lang } = useLang();
  const c = useContent();
  return (
    <Section className="py-16 sm:py-20">
      <SectionHead kicker={c.origins.roadmap.kicker} title={c.origins.roadmap.title} lead={c.origins.roadmap.lead} />
      <div className="mt-8 overflow-hidden rounded-xl border border-line">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-panel/50 text-[11px] uppercase tracking-wider text-faint">
              <th className="px-4 py-3 font-medium">{c.origins.roadmap.colPhase}</th>
              <th className="px-4 py-3 font-medium">{c.origins.roadmap.colName}</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">{c.origins.roadmap.colDesc}</th>
              <th className="px-4 py-3 font-medium">{c.origins.roadmap.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {EMLU_ROADMAP.map((r, i) => (
              <tr key={r.id} className={cn('border-t border-line', i % 2 === 1 && 'bg-panel/20')}>
                <td className="px-4 py-3 font-mono text-[13px] text-symbol">{r.id}</td>
                <td className="px-4 py-3 text-sm text-fg">{r.name[lang]}</td>
                <td className="hidden px-4 py-3 text-sm text-muted sm:table-cell">{r.desc[lang]}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={r.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 max-w-3xl text-sm leading-6 text-faint">{c.origins.roadmap.note}</p>
    </Section>
  );
}

const REPO = LINKS.github;

export function EmlUSourcesSection() {
  const c = useContent();
  return (
    <Section className="py-16 sm:py-24">
      <SectionHead kicker={c.origins.sources.kicker} title={c.origins.sources.title} lead={c.origins.sources.lead} />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {c.origins.sources.links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            target="_blank"
            rel="noreferrer"
            className="group cursor-pointer rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200 hover:border-symbol/40"
          >
            <FileText size={20} className="text-symbol" />
            <h3 className="mt-3 text-base font-semibold text-fg">{l.title}</h3>
            <p className="mt-1.5 text-sm leading-6 text-muted">{l.desc}</p>
          </a>
        ))}
      </div>
      <p className="mt-6 max-w-3xl text-sm leading-6 text-faint">
        <a href={`${REPO}/blob/main/docs/EML_Dual_Profile_Architecture_EML-P_EML-U_v1.0.md`} target="_blank" rel="noreferrer" className="text-symbol underline decoration-symbol/30 underline-offset-2 hover:decoration-symbol">
          {c.origins.sources.deepLink}
        </a>
      </p>
    </Section>
  );
}
