import { lazy, Suspense, useEffect } from 'react';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './theme';

// Code-split per route so the showcase landing doesn't bundle the engineering
// app / docs (and vice versa). Cross-route navigation uses plain links (full
// loads), which is ideal for these independent heavy chunks.
const Showcase = lazy(() => import('./pages/Showcase'));
const Engineering = lazy(() => import('./pages/Engineering'));
const Docs = lazy(() => import('./pages/Docs'));

function currentPage() {
  const p = window.location.pathname.replace(/\/+$/, '') || '/';
  if (p === '/app' || p.startsWith('/app/')) return <Engineering />;
  if (p === '/docs' || p.startsWith('/docs/')) return <Docs />;
  return <Showcase />;
}

export default function App() {
  // Deep links like /docs#symbols: the target renders after the lazy chunk loads,
  // so retry scrolling to the hash until the element exists.
  useEffect(() => {
    const h = window.location.hash;
    if (!h) return;
    let tries = 0;
    const tryScroll = () => {
      const el = document.querySelector(h);
      if (el) el.scrollIntoView();
      else if (tries++ < 25) window.setTimeout(tryScroll, 80);
    };
    window.setTimeout(tryScroll, 60);
  }, []);

  return (
    <ThemeProvider>
      <I18nProvider>
        <Suspense fallback={<div className="min-h-screen bg-base" />}>{currentPage()}</Suspense>
      </I18nProvider>
    </ThemeProvider>
  );
}
