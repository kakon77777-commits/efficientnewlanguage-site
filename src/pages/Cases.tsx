import { useEffect, useMemo, useState } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Section, Kicker, cn } from '../components/ui';
import { useLang } from '../i18n';

interface CaseEntry {
  id: string;
  path: string;
  title?: string;
  description?: string;
}

const PAGE_SIZE = 12;

function readPageFromUrl(): number {
  const n = Number(new URLSearchParams(window.location.search).get('page'));
  return Number.isInteger(n) && n > 0 ? n : 1;
}

/** The case-index (/cases) — a simple, generated list of every verified EML
 *  case in the corpus, human-browsable, paginated 12-per-page once the corpus
 *  outgrows a single screen. Data comes from /ai/manifest.json, the same
 *  manifest the machine/agent layer reads, so this page and the
 *  crawler-facing corpus never drift. */
export default function Cases() {
  const { lang } = useLang();
  const t = (en: string, zh: string) => (lang === 'zh' ? zh : en);
  const [cases, setCases] = useState<CaseEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(() => readPageFromUrl());

  useEffect(() => {
    fetch('/ai/manifest.json')
      .then((r) => r.json())
      .then((m) => setCases(m.examples ?? []))
      .catch(() => setError(true));
  }, []);

  const totalPages = cases ? Math.max(1, Math.ceil(cases.length / PAGE_SIZE)) : 1;

  // Clamp once the real case count is known (e.g. a stale ?page=99 link).
  useEffect(() => {
    if (cases && page > totalPages) setPage(totalPages);
  }, [cases, page, totalPages]);

  const pageCases = useMemo(
    () => (cases ? cases.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) : []),
    [cases, page],
  );

  function goToPage(n: number): void {
    const clamped = Math.min(Math.max(1, n), totalPages);
    setPage(clamped);
    const url = clamped === 1 ? '/cases' : `/cases?page=${clamped}`;
    window.history.replaceState(null, '', url);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

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
              'Real, runnable programs — each one transpiled, executed, and checked against real Python before it lands here. Generated directly from the source repository, so this list and the machine-readable corpus never drift apart.',
              '真實、可執行的程式——每一個都經過轉譯、執行，並對照真實 Python 驗證過才會出現在這裡。直接從原始碼版本庫產生，所以這份清單跟給機器讀的語料永遠不會脫節。',
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
                    <a href={c.path} target="_blank" rel="noreferrer" className="flex-1">
                      <span className="font-mono text-xs text-symbol">{c.id}</span>
                      <h3 className="mt-2 text-base font-semibold text-fg">{c.title ?? c.id}</h3>
                      {c.description && (
                        <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-muted">{c.description}</p>
                      )}
                    </a>
                    <a
                      href={`/app?case=${c.id}`}
                      className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-md border border-symbol/30 bg-symbol/10 px-3 py-1.5 text-xs font-medium text-symbol transition-colors duration-200 hover:border-symbol/50 hover:bg-symbol/20"
                    >
                      {t('Run in Playground →', '在示範區執行 →')}
                    </a>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <nav
                  aria-label={t('Case pages', '案例分頁')}
                  className="mt-10 flex flex-wrap items-center justify-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="rounded-md border border-line bg-surface/60 px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t('Previous', '上一頁')}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => goToPage(n)}
                      aria-current={n === page ? 'page' : undefined}
                      className={cn(
                        'h-9 min-w-9 rounded-md border px-2.5 text-sm font-mono transition-colors duration-200',
                        n === page
                          ? 'border-symbol/40 bg-symbol/10 text-symbol'
                          : 'border-line bg-surface/60 text-muted hover:border-symbol/40 hover:text-fg',
                      )}
                    >
                      {n}
                    </button>
                  ))}

                  <button
                    type="button"
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="rounded-md border border-line bg-surface/60 px-3 py-1.5 text-sm text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {t('Next', '下一頁')}
                  </button>

                  <span className="ml-2 font-mono text-xs text-faint">
                    {t(`Page ${page} of ${totalPages}`, `第 ${page} / ${totalPages} 頁`)}
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
