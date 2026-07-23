import { lazy, Suspense, useEffect } from 'react';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './theme';
import { AppErrorBoundary } from './app/AppErrorBoundary';
import { AppLoading } from './app/AppLoading';
import { matchRoute } from './routes';

// Code-split per route so the showcase landing doesn't bundle the engineering
// app / docs (and vice versa). Cross-route navigation uses plain links (full
// loads), which is ideal for these independent heavy chunks.
const Showcase = lazy(() => import('./pages/Showcase'));
const Engineering = lazy(() => import('./pages/Engineering'));
const Docs = lazy(() => import('./pages/Docs'));
const Cases = lazy(() => import('./pages/Cases'));
const Terminal = lazy(() => import('./pages/Terminal'));
const Origins = lazy(() => import('./pages/Origins'));

function currentPage(pathname: string = window.location.pathname) {
  switch (matchRoute(pathname)) {
    case 'engineering':
      return <Engineering />;
    case 'docs':
      return <Docs />;
    case 'cases':
      return <Cases />;
    case 'terminal':
      return <Terminal />;
    case 'origins':
      return <Origins />;
    default:
      return <Showcase />;
  }
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
        <AppErrorBoundary>
          <Suspense fallback={<AppLoading />}>{currentPage()}</Suspense>
        </AppErrorBoundary>
      </I18nProvider>
    </ThemeProvider>
  );
}
