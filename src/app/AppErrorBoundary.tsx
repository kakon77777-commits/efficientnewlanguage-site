import { Component, type ReactNode } from 'react';
import { BUILD_ID, SITE_SHA, EML_CORE_SHA } from './version';

const RETRY_KEY = 'eml.chunk-retry';

const CHUNK_ERROR_RE =
  /Failed to fetch dynamically imported module|Loading chunk|Importing a module script failed|MIME type.*is not executable/i;

function errorCode(err: unknown): 'EML-FE-CHUNK' | 'EML-FE-RENDER' {
  const msg = err instanceof Error ? err.message : String(err);
  return CHUNK_ERROR_RE.test(msg) ? 'EML-FE-CHUNK' : 'EML-FE-RENDER';
}

function storedLang(): 'en' | 'zh' {
  try {
    return localStorage.getItem('eml.lang') === 'zh' ? 'zh' : 'en';
  } catch {
    return 'en';
  }
}

function alreadyRetriedThisSession(): boolean {
  try {
    return sessionStorage.getItem(RETRY_KEY) === '1';
  } catch {
    return true; // no storage access -> don't loop, go straight to the error UI
  }
}

function markRetried(): void {
  try {
    sessionStorage.setItem(RETRY_KEY, '1');
  } catch {
    /* ignore */
  }
}

interface State {
  error: Error | null;
}

/** Root-level Error Boundary. A failed lazy() import (a chunk that 404s, or a
 *  stale HTML referencing an asset a newer deploy removed) surfaces here as a
 *  render error — without this, React unmounts silently and the last thing on
 *  screen is whatever static background color was already painted, which is
 *  exactly the "black screen with no diagnostic" failure mode this exists to
 *  prevent. A chunk-shaped error gets ONE automatic cache-busted reload
 *  (session-scoped, so it can't loop); anything else — or a chunk error that
 *  persists after that one retry — shows a real error screen instead. */
export class AppErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error): void {
    if (errorCode(error) === 'EML-FE-CHUNK' && !alreadyRetriedThisSession()) {
      markRetried();
      const url = new URL(window.location.href);
      url.searchParams.set('_retry', String(Date.now()));
      window.location.replace(url.toString());
    }
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    const code = errorCode(error);
    const zh = storedLang() === 'zh';
    const t = (en: string, zhStr: string) => (zh ? zhStr : en);
    const diagnostics = [
      `code: ${code}`,
      `build_id: ${BUILD_ID}`,
      `site_sha: ${SITE_SHA}`,
      `eml_core_sha: ${EML_CORE_SHA}`,
      `path: ${window.location.pathname}${window.location.search}`,
      `message: ${error.message}`,
    ].join('\n');

    return (
      <main className="grid min-h-screen place-items-center bg-base px-6 text-fg">
        <section className="max-w-md text-center">
          <div className="font-mono text-sm text-symbol">EML</div>
          <h1 className="mt-3 text-lg font-semibold">
            {t('The interface failed to load', '介面載入失敗')}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {t(
              'This is a client-side loading problem, not data loss — reloading usually fixes it.',
              '這是前端載入問題，不是資料遺失——通常重新載入就能解決。',
            )}
          </p>
          <p className="mt-3 font-mono text-xs text-faint">
            {code} · build {BUILD_ID}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="cursor-pointer rounded-lg bg-run px-4 py-2 text-sm font-semibold text-base transition-colors duration-200 hover:bg-run/90"
            >
              {t('Reload', '重新載入')}
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  sessionStorage.removeItem(RETRY_KEY);
                } catch {
                  /* ignore */
                }
                window.location.href = '/';
              }}
              className="cursor-pointer rounded-lg border border-line bg-panel/60 px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg"
            >
              {t('Go to homepage', '回到首頁')}
            </button>
            <a
              href="/docs"
              className="cursor-pointer rounded-lg border border-line bg-panel/60 px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg"
            >
              {t('Docs', '文件')}
            </a>
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(diagnostics).catch(() => undefined)}
              className="cursor-pointer rounded-lg border border-line bg-panel/60 px-4 py-2 text-sm text-muted transition-colors duration-200 hover:border-symbol/40 hover:text-fg"
            >
              {t('Copy diagnostics', '複製診斷資訊')}
            </button>
          </div>
        </section>
      </main>
    );
  }
}
