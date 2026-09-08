import { useEffect, useMemo, useState } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Section, Kicker, cn } from '../components/ui';
import { useLang } from '../i18n';
import { casesPage, casesPageHref, caseHref, CASES_PAGE_SIZE } from '../routes';

export interface CaseEntry {
  id: string;
  path: string;
  title?: string;
  description?: string;
}

const PAGE_SIZE = CASES_PAGE_SIZE;
const pageHref = casesPageHref;

function readPageFromUrl(): number {
  if (typeof window === 'undefined') return 1;
  return casesPage(window.location.pathname, window.location.search);
}

/** Reads the slice of case data the prerender script embedded for THIS page
 *  (scripts/prerender.mjs) — present only on a real hydrating client page load
 *  of a prerendered /cases document, absent under SSR (no `document`) and
 *  absent in plain `vite dev`/non-prerendered builds.
 *
 *  It carries this page's twelve cards and the totals, not all 762 entries.
 *  Embedding the whole manifest made every index page 333KB; at one page that
 *  was merely wasteful, and at 64 pages it would have been 21MB of the same
 *  JSON repeated. The client only ever renders the twelve. */
interface CasesIsland {
  items: CaseEntry[];
  page: number;
  totalPages: number;
  total: number;
}

function readIslandFromDom(): CasesIsland | null {
  if (typeof document === 'undefined') return null;
  const el = document.getElementById('eml-cases-data');
  if (!el?.textContent) return null;
  try {
    const parsed = JSON.parse(el.textContent);
    return Array.isArray(parsed?.items) ? parsed : null;
  } catch {
    return null;
  }
}

interface CasesProps {
  /** This page's cards, plus the totals the pagination needs. Passed by
   *  entry-server.tsx under SSR (which has no `document` to read an island
   *  from) and by the island on the client, so the two first renders are
   *  identical and hydration keeps the prerendered markup. Absent in plain
   *  `vite dev`, where the manifest fetch below is the only data source. */
  initialItems?: CaseEntry[];
  initialPage?: number;
  initialTotalPages?: number;
  initialTotal?: number;
}

/** The case-index (/cases) — a simple, generated list of every verified EML
 *  case in the corpus, human-browsable, paginated 12-per-page once the corpus
 *  outgrows a single screen. Data comes from /ai/manifest.json, the same
 *  manifest the machine/agent layer reads, so this page and the
 *  crawler-facing corpus never drift.
 *
 *  Pagination is `<a href>`, not `<button onClick>`. It was buttons plus
 *  history.replaceState until 2026-09-08, which meant pages 2..N had no URL a
 *  crawler could follow: Search Console had discovered 23 of 762 cases and
 *  indexed none, and the entire link graph into the corpus was the 12 cards on
 *  this page. A control that changes what document you are reading is a link. */
export default function Cases({
  initialItems,
  initialPage,
  initialTotalPages,
  initialTotal,
}: CasesProps = {}) {
  const { lang } = useLang();
  const t = (en: string, zh: string) => (lang === 'zh' ? zh : en);
  const [island] = useState<CasesIsland | null>(readIslandFromDom);
  // Only used by the `vite dev` fallback path, where no page slice was handed in.
  const [fetched, setFetched] = useState<CaseEntry[] | null>(null);
  const [error, setError] = useState(false);

  const given = initialItems ?? island?.items ?? null;
  const shown = initialPage ?? island?.page ?? readPageFromUrl();

  // Pagination used to live in `?page=N`, so links and bookmarks to that form
  // exist. The prerendered document at /cases/ is page 1 whatever the query
  // says, so without this a bookmarked ?page=7 silently shows page 1. Sending
  // it to the path form fixes the reader's view AND leaves one canonical URL
  // per page rather than two spellings of it.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const q = new URLSearchParams(window.location.search).get('page');
    const n = Number(q);
    if (q !== null && Number.isInteger(n) && n > 0 && casesPageHref(n) !== window.location.pathname) {
      window.location.replace(casesPageHref(n));
    }
  }, []);

  useEffect(() => {
    if (given) return; // already have real data (SSR prop or hydrated data island)
    fetch('/ai/manifest.json')
      .then((r) => r.json())
      .then((m) => setFetched(m.examples ?? []))
      .catch(() => setError(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalPages =
    initialTotalPages ??
    island?.totalPages ??
    (fetched ? Math.max(1, Math.ceil(fetched.length / PAGE_SIZE)) : 1);
  const total = initialTotal ?? island?.total ?? fetched?.length ?? 0;

  // A stale /cases/page/99 asks for a page that does not exist; the fetched
  // fallback also has to slice for itself. Clamping rather than 404ing is
  // deliberate — the content is a generated list, not a promise about N.
  const pageCases = useMemo(() => {
    if (given) return given;
    if (!fetched) return [];
    const n = Math.min(Math.max(1, shown), Math.max(1, Math.ceil(fetched.length / PAGE_SIZE)));
    return fetched.slice((n - 1) * PAGE_SIZE, n * PAGE_SIZE);
  }, [given, fetched, shown]);

  const cases = given ?? fetched;

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div aria-hidden className="bg-grid pointer-events-none fixed inset-0 -z-10 opacity-40" />
      <Nav />
      <main>
        <Section className="pt-32 pb-16 sm:pt-36">
          <Kicker>{t('Case corpus', '案例庫')}</Kicker>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {t('Every verified EML case', '每一個經過驗證的 EML 案例')}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted">
            {t(
              `${total || ''} real, runnable programs — each one transpiled, executed, and checked against real Python before it lands here. Generated directly from the source repository, so this list and the machine-readable corpus never drift apart.`.trim(),
              `${total || ''} 個真實、可執行的程式——每一個都經過轉譯、執行，並對照真實 Python 驗證過才會出現在這裡。直接從原始碼版本庫產生，所以這份清單跟給機器讀的語料永遠不會脫節。`.trim(),
            )}
          </p>

          {error && (
            <p className="mt-8 text-sm text-muted">
              {t('Could not load the case list right now.', '目前無法載入案例清單。')}
            </p>
          )}

          {!error && !cases && (
            <p className="mt-8 text-sm text-muted">{t('Loading…', '載入中…')}</p>
          )}

          {cases && (
            <>
              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {pageCases.map((c) => (
                  <div
                    key={c.id}
                    className="group flex flex-col rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200 hover:border-symbol/40"
                  >
                    <a href={caseHref(c.id)} className="flex-1">
                      <span className="font-mono text-xs text-symbol">{c.id}</span>
                      <h2 className="mt-2 text-base font-semibold text-fg">{c.title ?? c.id}</h2>
                      {c.description && (
                        <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-muted">{c.description}</p>
                      )}
                    </a>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <a
                        href={`/app?case=${c.id}`}
                        className="inline-flex w-fit items-center gap-1.5 rounded-md border border-symbol/30 bg-symbol/10 px-3 py-1.5 text-xs font-medium text-symbol transition-colors duration-200 hover:border-symbol/50 hover:bg-symbol/20"
                      >
                        {t('Run in Playground →', '在示範區執行 →')}
                      </a>
                      <a
                        href={`/terminal?case=${c.id}`}
                        className="inline-flex w-fit items-center gap-1.5 rounded-md border border-line bg-panel/60 px-3 py-1.5 text-xs font-medium text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg"
                      >
                        {t('Open in Terminal →', '在終端機開啟 →')}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label={t('Case pages', '案例分頁')}
                  className="mt-10 flex flex-wrap items-center justify-center gap-2"
                >
                  {shown > 1 ? (
                    <a
                      href={pageHref(shown - 1)}
                      className="rounded-md border border-line bg-surface/60 px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg"
                    >
                      {t('Previous', '上一頁')}
                    </a>
                  ) : (
                    <span className="cursor-not-allowed rounded-md border border-line bg-surface/60 px-3 py-1.5 text-sm text-muted opacity-40">
                      {t('Previous', '上一頁')}
                    </span>
                  )}

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <a
                      key={n}
                      href={pageHref(n)}
                      aria-current={n === shown ? 'page' : undefined}
                      className={cn(
                        'h-9 min-w-9 rounded-md border px-2.5 text-sm font-mono leading-8 transition-colors duration-200',
                        n === shown
                          ? 'border-symbol/40 bg-symbol/10 text-symbol'
                          : 'border-line bg-surface/60 text-muted hover:border-symbol/40 hover:text-fg',
                      )}
                    >
                      {n}
                    </a>
                  ))}

                  {shown < totalPages ? (
                    <a
                      href={pageHref(shown + 1)}
                      className="rounded-md border border-line bg-surface/60 px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg"
                    >
                      {t('Next', '下一頁')}
                    </a>
                  ) : (
                    <span className="cursor-not-allowed rounded-md border border-line bg-surface/60 px-3 py-1.5 text-sm text-muted opacity-40">
                      {t('Next', '下一頁')}
                    </span>
                  )}

                  <span className="ml-2 font-mono text-xs text-faint">
                    {t(`Page ${shown} of ${totalPages}`, `第 ${shown} / ${totalPages} 頁`)}
                  </span>
                </nav>
              )}
            </>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
}
