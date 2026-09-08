import { useEffect, useState } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Section, Kicker, Code } from '../components/ui';
import { useLang } from '../i18n';
import { parseCaseDoc, type CaseDoc } from '../lib/case-doc';
import { casesPageHref, caseHref } from '../routes';

/** A neighbour in corpus order — the prev/next chain is what lets a crawler
 *  walk all 762 cases without ever loading the index. */
export interface CaseNeighbour {
  id: string;
  title: string;
}

export interface CaseDetailProps {
  /** Passed by entry-server.tsx under SSR; read from the JSON island on the
   *  client so hydration renders exactly what was prerendered. */
  initialDoc?: CaseDoc;
  caseId: string;
  prev?: CaseNeighbour | null;
  next?: CaseNeighbour | null;
  /** Which /cases page this case sits on, so "back to the list" returns to the
   *  page the reader would have come from rather than always to page 1. */
  indexPage?: number;
}

/** Everything the prerendered page rendered from, in one island.
 *
 *  doc alone is not enough: the prev/next chain and which index page this case
 *  sits on are also rendered into the HTML, so the client's first render has to
 *  know them too or hydration mismatches and React throws the prerendered
 *  markup away — which would quietly undo the entire point of prerendering. */
export interface CaseIsland {
  doc: CaseDoc;
  prev: CaseNeighbour | null;
  next: CaseNeighbour | null;
  indexPage: number;
}

function readIsland(): CaseIsland | null {
  if (typeof document === 'undefined') return null;
  const el = document.getElementById('eml-case-data');
  if (!el?.textContent) return null;
  try {
    return JSON.parse(el.textContent);
  } catch {
    return null;
  }
}

/** Renders `text with \`inline code\`` without dangerouslySetInnerHTML — the
 *  corpus descriptions are generated from the language repo's own READMEs and
 *  routinely name identifiers in backticks. */
function Prose({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`)/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith('`') && p.endsWith('`') && p.length > 2 ? (
          <code key={i} className="rounded bg-sunken px-1.5 py-0.5 font-mono text-[0.9em] text-symbol">
            {p.slice(1, -1)}
          </code>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

function Block({ label, lang, children }: { label: string; lang: string; children: string }) {
  return (
    <div className="mt-8">
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <h2 className="text-sm font-semibold tracking-tight text-fg">{label}</h2>
        <span className="font-mono text-xs text-faint">{lang}</span>
      </div>
      <Code>
        <code>{children}</code>
      </Code>
    </div>
  );
}

/** One corpus case as a real HTML page at /cases/<id>.
 *
 *  The 762 `.eml.md` files under /ai/examples are the machine layer and stay
 *  exactly as they are — they are served as `text/markdown`, which is not a
 *  document type Google indexes (measured 2026-09-08: 23 of them crawled
 *  successfully over three weeks, none indexed, and Search Console reporting
 *  "indexing allowed? N/A" for a page it had fetched fine). This page is the
 *  human/search-engine representation of the same case, linking to the raw file
 *  rather than replacing it. */
export default function CaseDetail({ initialDoc, caseId, prev, next, indexPage }: CaseDetailProps) {
  const { lang } = useLang();
  const t = (en: string, zh: string) => (lang === 'zh' ? zh : en);
  const [island] = useState<CaseIsland | null>(readIsland);
  const [doc, setDoc] = useState<CaseDoc | null>(() => initialDoc ?? island?.doc ?? null);
  const [error, setError] = useState(false);

  const prevCase = prev !== undefined ? prev : (island?.prev ?? null);
  const nextCase = next !== undefined ? next : (island?.next ?? null);
  const page = indexPage ?? island?.indexPage ?? 1;

  // Only reached in `vite dev` / any build without prerendered detail pages.
  useEffect(() => {
    if (doc) return;
    fetch(`/ai/examples/${caseId}.eml.md`)
      .then((r) => {
        if (!r.ok) throw new Error(String(r.status));
        return r.text();
      })
      .then((md) => setDoc(parseCaseDoc(caseId, md)))
      .catch(() => setError(true));
  }, [doc, caseId]);

  const backHref = casesPageHref(page);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <Nav />
      <main>
        <Section className="pt-32 pb-16 sm:pt-36">
          <nav aria-label={t('Breadcrumb', '麵包屑')} className="mb-4 font-mono text-xs text-faint">
            <a href="/cases/" className="transition-colors duration-200 hover:text-symbol">
              {t('Case corpus', '案例庫')}
            </a>
            <span className="px-2">/</span>
            <span className="text-muted">{caseId}</span>
          </nav>

          {error && !doc && (
            <p className="text-sm text-muted">{t('Could not load this case.', '無法載入這個案例。')}</p>
          )}
          {!error && !doc && <p className="text-sm text-muted">{t('Loading…', '載入中…')}</p>}

          {doc && (
            <>
              <Kicker>{t(`Case ${doc.number}`, `案例 ${doc.number}`)}</Kicker>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">{doc.title}</h1>
              <p className="mt-4 max-w-3xl text-[15px] leading-7 text-muted">
                <Prose text={doc.description} />
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-faint">
                <span>{doc.roundTrip}</span>
                {doc.updated && <span>{t('updated', '更新')} {doc.updated}</span>}
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                <a
                  href={`/app?case=${doc.id}`}
                  className="inline-flex w-fit items-center gap-1.5 rounded-md border border-symbol/30 bg-symbol/10 px-3 py-1.5 text-xs font-medium text-symbol transition-colors duration-200 hover:border-symbol/50 hover:bg-symbol/20"
                >
                  {t('Run in Playground →', '在示範區執行 →')}
                </a>
                <a
                  href={`/terminal?case=${doc.id}`}
                  className="inline-flex w-fit items-center gap-1.5 rounded-md border border-line bg-panel/60 px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg"
                >
                  {t('Open in Terminal →', '在終端機開啟 →')}
                </a>
                <a
                  href={`/ai/examples/${doc.id}.eml.md`}
                  className="inline-flex w-fit items-center gap-1.5 rounded-md border border-line bg-panel/60 px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg"
                >
                  {t('Raw markdown (agent layer) →', '原始 markdown（給 AI 的層）→')}
                </a>
              </div>

              <Block label={t('EML', 'EML')} lang="eml">
                {doc.eml}
              </Block>
              <Block label={t('Python (deterministic transpilation)', 'Python（確定性轉譯）')} lang="python">
                {doc.python}
              </Block>
              <Block label={t('stdout (executed)', 'stdout（實際執行）')} lang="text">
                {doc.stdout}
              </Block>

              {doc.traceEvents.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-2 text-sm font-semibold tracking-tight text-fg">
                    {t('Trace event types', 'Trace 事件型別')}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {doc.traceEvents.map((e) => (
                      <span
                        key={e}
                        className="rounded-md border border-line bg-sunken px-2 py-1 font-mono text-xs text-muted"
                      >
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <nav
                aria-label={t('Adjacent cases', '相鄰案例')}
                className="mt-14 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:items-stretch sm:justify-between"
              >
                {prevCase ? (
                  <a
                    href={caseHref(prevCase.id)}
                    className="group max-w-sm rounded-lg border border-line bg-surface/60 px-4 py-3 transition-colors duration-200 hover:border-symbol/40"
                  >
                    <span className="font-mono text-xs text-faint">← {t('Previous', '上一個')}</span>
                    <span className="mt-1 block text-sm text-muted group-hover:text-fg">{prevCase.title}</span>
                  </a>
                ) : (
                  <span />
                )}
                <a
                  href={backHref}
                  className="self-center font-mono text-xs text-faint transition-colors duration-200 hover:text-symbol"
                >
                  {t('All cases', '全部案例')}
                </a>
                {nextCase ? (
                  <a
                    href={caseHref(nextCase.id)}
                    className="group max-w-sm rounded-lg border border-line bg-surface/60 px-4 py-3 text-right transition-colors duration-200 hover:border-symbol/40"
                  >
                    <span className="font-mono text-xs text-faint">{t('Next', '下一個')} →</span>
                    <span className="mt-1 block text-sm text-muted group-hover:text-fg">{nextCase.title}</span>
                  </a>
                ) : (
                  <span />
                )}
              </nav>
            </>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
}
