import { useEffect, useState } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Section, Kicker } from '../components/ui';
import { useLang } from '../i18n';

interface CaseEntry {
  id: string;
  path: string;
  title?: string;
  description?: string;
}

/** The case-index (/cases) — a simple, generated list of every verified EML
 *  case in the corpus, human-browsable. Deliberately simple (no search/
 *  filter/pagination) — those are additions for once volume justifies them.
 *  Data comes from /ai/manifest.json, the same manifest the machine/agent
 *  layer reads, so this page and the crawler-facing corpus never drift. */
export default function Cases() {
  const { lang } = useLang();
  const t = (en: string, zh: string) => (lang === 'zh' ? zh : en);
  const [cases, setCases] = useState<CaseEntry[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/ai/manifest.json')
      .then((r) => r.json())
      .then((m) => setCases(m.examples ?? []))
      .catch(() => setError(true));
  }, []);

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
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cases.map((c) => (
                <a
                  key={c.id}
                  href={c.path}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex flex-col rounded-xl border border-line bg-surface/60 p-5 transition-colors duration-200 hover:border-symbol/40"
                >
                  <span className="font-mono text-xs text-symbol">{c.id}</span>
                  <h3 className="mt-2 text-base font-semibold text-fg">{c.title ?? c.id}</h3>
                  {c.description && (
                    <p className="mt-1.5 line-clamp-3 text-sm leading-6 text-muted">{c.description}</p>
                  )}
                </a>
              ))}
            </div>
          )}
        </Section>
      </main>
      <Footer />
    </div>
  );
}
