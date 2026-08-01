import { ArrowUpRight, ChevronRight, FileText, ShieldAlert } from 'lucide-react';
import { useLang, type Lang } from '../i18n';
import type { RelatedProject, RelatedSection, RelatedStatus } from '../content/related';
import { RELATED_PAGE, RELATED_PROJECTS } from '../content/related';
import { Section, SectionHead, Code, Kicker, cn } from './ui';

/** Sibling projects get their own accent so they never read as EML's own cyan.
 *  Every class is a full literal — Tailwind scans source text, so a runtime
 *  concatenation like 'hover:' + border would never be generated. */
const ACCENT: Record<
  RelatedProject['accent'],
  { text: string; bg: string; border: string; dot: string; hover: string }
> = {
  violet: {
    text: 'text-violet',
    bg: 'bg-violet/10',
    border: 'border-violet/40',
    dot: 'bg-violet/60',
    hover: 'hover:border-violet/40',
  },
  run: {
    text: 'text-run',
    bg: 'bg-run/10',
    border: 'border-run/40',
    dot: 'bg-run/60',
    hover: 'hover:border-run/40',
  },
  amber: {
    text: 'text-amber',
    bg: 'bg-amber/10',
    border: 'border-amber/40',
    dot: 'bg-amber/60',
    hover: 'hover:border-amber/40',
  },
};

/** Header for the auto-appended status column (see the `table` renderer). */
const STATUS_HEADER: Record<Lang, string> = { en: 'Status', zh: '狀態' };

const ROW_STATUS_STYLE: Record<RelatedStatus, string> = {
  stable: 'border-run/40 bg-run/10 text-run',
  partial: 'border-amber/40 bg-amber/10 text-amber',
  draft: 'border-amber/40 bg-amber/10 text-amber',
  planned: 'border-line bg-panel/50 text-faint',
};

function RowStatus({ status }: { status: RelatedStatus }) {
  return (
    <span
      className={cn(
        'inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider',
        ROW_STATUS_STYLE[status],
      )}
    >
      {status}
    </span>
  );
}

/** The mono code badge used on hub cards and project headers. */
export function ProjectBadge({
  project,
  size = 'md',
}: {
  project: RelatedProject;
  size?: 'md' | 'lg';
}) {
  const a = ACCENT[project.accent];
  return (
    <span
      className={cn(
        'grid place-items-center rounded-lg font-mono font-bold',
        a.bg,
        a.text,
        size === 'lg' ? 'h-12 w-12 text-[13px]' : 'h-10 w-10 text-[11px]',
      )}
    >
      {project.code}
    </span>
  );
}

/** The hub grid at /related — one card per registry entry. */
export function RelatedHubGrid() {
  const { lang } = useLang();
  return (
    <div className="mt-10 grid gap-5 lg:grid-cols-2">
      {RELATED_PROJECTS.map((p) => {
        const a = ACCENT[p.accent];
        return (
          <a
            key={p.slug}
            href={`/related/${p.slug}`}
            className={cn(
              'group flex cursor-pointer flex-col rounded-xl border border-line bg-surface/60 p-6 transition-colors duration-200',
              a.hover,
            )}
          >
            <div className="flex items-start gap-4">
              <ProjectBadge project={p} size="lg" />
              <div className="min-w-0">
                <h3 className="text-lg font-semibold tracking-tight text-fg">{p.name[lang]}</h3>
                <p className={cn('mt-0.5 font-mono text-xs', a.text)}>{p.expansion}</p>
              </div>
              <ArrowUpRight size={18} className="ml-auto shrink-0 text-faint transition-colors duration-200 group-hover:text-fg" />
            </div>

            <p className="mt-5 text-sm leading-7 text-muted">{p.tagline[lang]}</p>

            <div className="mt-5 border-t border-line pt-4">
              <div className="font-mono text-[11px] uppercase tracking-[0.15em] text-faint">
                {RELATED_PAGE.cardLead[lang]}
              </div>
              <ul className="mt-3 space-y-2">
                {p.hubPoints[lang].map((point, i) => (
                  <li key={i} className="flex gap-2.5 text-[13.5px] leading-6 text-muted">
                    <span className={cn('mt-2 h-1 w-1 shrink-0 rounded-full', a.dot)} />
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 font-mono text-[11px] text-faint">
              {p.facts.slice(0, 3).map((f) => (
                <span key={f.label.en}>
                  {f.label[lang]} <span className="text-muted">{f.value}</span>
                </span>
              ))}
            </div>

            <span className={cn('mt-5 inline-flex items-center gap-1 text-sm font-medium', a.text)}>
              {RELATED_PAGE.cta[lang]}
              <ChevronRight size={15} />
            </span>
          </a>
        );
      })}
    </div>
  );
}

/** Version / contract facts under a project page's title. */
export function ProjectFacts({ project }: { project: RelatedProject }) {
  const { lang } = useLang();
  const a = ACCENT[project.accent];
  return (
    <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-4 rounded-xl border border-line bg-surface/60 p-5 sm:grid-cols-3 lg:grid-cols-5">
      {project.facts.map((f) => (
        <div key={f.label.en}>
          <dt className="font-mono text-[10.5px] uppercase tracking-[0.12em] text-faint">{f.label[lang]}</dt>
          <dd className={cn('mt-1 break-words font-mono text-[13px]', a.text)}>{f.value}</dd>
        </div>
      ))}
    </dl>
  );
}

function Note({ text }: { text: string }) {
  return <p className="mt-6 max-w-3xl text-sm leading-6 text-faint">{text}</p>;
}

function SectionBody({ section, lang, accent }: { section: RelatedSection; lang: Lang; accent: RelatedProject['accent'] }) {
  const a = ACCENT[accent];

  switch (section.kind) {
    case 'prose':
      return (
        <>
          {section.paras && (
            <div className="mt-6 max-w-3xl space-y-4">
              {section.paras[lang].map((p, i) => (
                <p key={i} className="text-[15px] leading-7 text-muted">
                  {p}
                </p>
              ))}
            </div>
          )}
          {section.callout && (
            <p className={cn('mt-6 max-w-3xl rounded-lg border px-4 py-3 text-sm leading-7', a.border, a.bg, a.text)}>
              {section.callout[lang]}
            </p>
          )}
        </>
      );

    case 'cards':
      return (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {section.cards.map((card, i) => (
              <div
                key={i}
                className={cn('rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200', a.hover)}
              >
                <div className={cn('font-mono text-sm font-semibold', a.text)}>{String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-2 text-base font-semibold text-fg">{card.title[lang]}</h3>
                <p className="mt-2 text-sm leading-6 text-muted">{card.body[lang]}</p>
              </div>
            ))}
          </div>
          {section.note && <Note text={section.note[lang]} />}
        </>
      );

    case 'pipeline': {
      const steps = section.steps[lang];
      return (
        <>
          <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
            {steps.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span
                  className={cn(
                    'rounded-lg border px-3 py-2 font-mono text-[13px]',
                    i === 0 || i === steps.length - 1 ? cn(a.border, a.bg, a.text) : 'border-line bg-panel/50 text-muted',
                  )}
                >
                  {s}
                </span>
                {i < steps.length - 1 && <ChevronRight size={15} className="text-faint" />}
              </div>
            ))}
          </div>
          {section.note && <Note text={section.note[lang]} />}
        </>
      );
    }

    case 'code':
      return (
        <>
          <Code className="mt-8 max-w-3xl text-[12.5px] text-code">{section.code}</Code>
          {section.note && <Note text={section.note[lang]} />}
        </>
      );

    case 'groups':
      return (
        <>
          <div className="mt-10 grid gap-4 lg:grid-cols-2">
            {section.groups.map((g, i) => (
              <div key={i} className="rounded-xl border border-line bg-surface/60 p-5">
                <h3 className="text-base font-semibold text-fg">{g.title[lang]}</h3>
                <ul className="mt-4 space-y-2.5">
                  {g.items[lang].map((item, j) => (
                    <li key={j} className="flex gap-2.5 text-sm leading-6 text-muted">
                      <span className={cn('mt-2 h-1 w-1 shrink-0 rounded-full', a.dot)} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {section.note && <Note text={section.note[lang]} />}
        </>
      );

    case 'table': {
      // `cols` describes exactly the id column + row.cells — the status column's
      // header is generated here, so an author cannot desync header count from
      // cell count by forgetting (or adding) a "Status" entry. cols at index >= 2
      // collapse on small screens; the status column always shows.
      const hasStatus = section.rows.some((r) => r.status);
      const bodyCols = section.cols.length;
      return (
        <>
          <div className="mt-8 overflow-hidden rounded-xl border border-line">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-panel/50 text-[11px] uppercase tracking-wider text-faint">
                  {section.cols.map((col, i) => (
                    <th
                      key={i}
                      className={cn('px-4 py-3 font-medium', i >= 2 && 'hidden sm:table-cell')}
                    >
                      {col[lang]}
                    </th>
                  ))}
                  {hasStatus && <th className="px-4 py-3 font-medium">{STATUS_HEADER[lang]}</th>}
                </tr>
              </thead>
              <tbody>
                {section.rows.map((row, i) => (
                  <tr key={row.id} className={cn('border-t border-line', i % 2 === 1 && 'bg-panel/20')}>
                    <td className={cn('px-4 py-3 align-top font-mono text-[13px] whitespace-nowrap', a.text)}>{row.id}</td>
                    {row.cells.map((cell, j) => (
                      <td
                        key={j}
                        className={cn(
                          'px-4 py-3 align-top',
                          j === 0 ? 'text-sm text-fg' : 'text-sm text-muted',
                          j + 1 >= 2 && j + 1 < bodyCols && 'hidden sm:table-cell',
                        )}
                      >
                        {cell[lang]}
                      </td>
                    ))}
                    {hasStatus && (
                      <td className="px-4 py-3 align-top">{row.status && <RowStatus status={row.status} />}</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {section.note && <Note text={section.note[lang]} />}
        </>
      );
    }

    case 'limits':
      return (
        <>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {section.items.map((item, i) => (
              <div key={i} className="rounded-xl border border-amber/25 bg-amber/[0.05] p-5">
                <div className="flex items-center gap-2.5">
                  <ShieldAlert size={16} className="shrink-0 text-amber" />
                  <h3 className="text-base font-semibold text-fg">{item.title[lang]}</h3>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body[lang]}</p>
              </div>
            ))}
          </div>
          {section.note && <Note text={section.note[lang]} />}
        </>
      );

    case 'docs':
      return (
        <>
          <div className="mt-8 divide-y divide-line overflow-hidden rounded-xl border border-line">
            {section.docs.map((d) => (
              <div key={d.title} className="flex gap-4 p-5">
                <FileText size={18} className={cn('mt-0.5 shrink-0', a.text)} />
                <div className="min-w-0">
                  <h3 className="break-words text-[15px] font-semibold text-fg">{d.title}</h3>
                  <p className="mt-1 font-mono text-[11px] text-faint">{d.meta}</p>
                  <p className="mt-2 text-sm leading-6 text-muted">{d.desc[lang]}</p>
                </div>
              </div>
            ))}
          </div>
          {section.note && <Note text={section.note[lang]} />}
        </>
      );
  }
}

/** Renders one project's whole body from its registry entry. */
export function ProjectSections({ project }: { project: RelatedProject }) {
  const { lang } = useLang();
  return (
    <>
      {project.sections.map((section, i) => (
        <Section key={section.id ?? i} id={section.id} className={i === 0 ? 'py-14 sm:py-20' : 'py-14 sm:py-16'}>
          <SectionHead kicker={section.kicker[lang]} title={section.title[lang]} lead={section.lead?.[lang]} />
          <SectionBody section={section} lang={lang} accent={project.accent} />
        </Section>
      ))}
    </>
  );
}

/** Cross-links to the other sibling projects, at the bottom of a project page. */
export function RelatedOtherProjects({ current }: { current: string }) {
  const { lang } = useLang();
  const others = RELATED_PROJECTS.filter((p) => p.slug !== current);
  if (others.length === 0) return null;
  return (
    <Section className="py-14 sm:py-20">
      <Kicker>{RELATED_PAGE.kicker[lang]}</Kicker>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {others.map((p) => {
          const a = ACCENT[p.accent];
          return (
            <a
              key={p.slug}
              href={`/related/${p.slug}`}
              className={cn(
                'group flex cursor-pointer items-start gap-4 rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200',
                a.hover,
              )}
            >
              <ProjectBadge project={p} />
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-fg">{p.name[lang]}</h3>
                <p className="mt-1.5 text-sm leading-6 text-muted">{p.tagline[lang]}</p>
              </div>
              <ArrowUpRight size={16} className="ml-auto shrink-0 text-faint transition-colors duration-200 group-hover:text-fg" />
            </a>
          );
        })}
      </div>
      <p className="mt-6">
        <a href="/related" className="cursor-pointer text-sm text-symbol underline decoration-symbol/30 underline-offset-2 hover:decoration-symbol">
          {RELATED_PAGE.backToHub[lang]}
        </a>
      </p>
    </Section>
  );
}
