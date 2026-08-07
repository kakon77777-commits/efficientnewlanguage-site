import { lazy, Suspense, useEffect } from 'react';
import { I18nProvider } from './i18n';
import { ThemeProvider } from './theme';
import { AppErrorBoundary } from './app/AppErrorBoundary';
import { AppLoading } from './app/AppLoading';
import { matchRoute, relatedSlug } from './routes';

// Code-split per route so the showcase landing doesn't bundle the engineering
// app / docs (and vice versa). Cross-route navigation uses plain links (full
// loads), which is ideal for these independent heavy chunks.
const Showcase = lazy(() => import('./pages/Showcase'));
const Engineering = lazy(() => import('./pages/Engineering'));
const Docs = lazy(() => import('./pages/Docs'));
const Cases = lazy(() => import('./pages/Cases'));
const Terminal = lazy(() => import('./pages/Terminal'));
const Origins = lazy(() => import('./pages/Origins'));
const Related = lazy(() => import('./pages/Related'));
const RelatedProject = lazy(() => import('./pages/RelatedProject'));

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
    case 'related':
      return <Related />;
    case 'related-project':
      return <RelatedProject slug={relatedSlug(pathname)} />;
    default:
      return <Showcase />;
  }
}

export default function App() {
  // Deep links like /docs#symbols and /app#playground: the browser performs its
  // own fragment scroll before React mounts, finds nothing, and gives up. This
  // re-asserts it once the lazy chunk has rendered the target.
  //
  // Three details matter here and none of them are visible from the call site:
  //   - getElementById, not querySelector(hash). A fragment is an id, not a CSS
  //     selector, and querySelector THROWS on any fragment that isn't also a
  //     valid selector — `#2026` raises SyntaxError, and a throw inside an
  //     effect takes the render down. getElementById just returns null.
  //   - behavior: 'auto', not the `scroll-behavior: smooth` this would
  //     otherwise inherit from index.css. The reader never scrolled, so there
  //     is no gesture to stay continuous with, and an animated jump of a
  //     screen or three has to survive the rest of the page mounting
  //     underneath it. index.css already accepts the instant version under
  //     prefers-reduced-motion.
  //   - it re-asserts until the target's absolute offset stops moving. A
  //     section's position is only final once everything above it has finished
  //     laying out; scrolling once, the instant the element first exists, aims
  //     at an offset that is still changing.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;

    let timer = 0;
    let tries = 0;
    let stableFor = 0;
    let lastTop: number | null = null;

    // Never fight a reader who has started scrolling on their own.
    const cancel = () => {
      tries = Infinity;
      window.clearTimeout(timer);
    };
    const once = { passive: true, once: true } as const;
    window.addEventListener('wheel', cancel, once);
    window.addEventListener('touchstart', cancel, once);
    window.addEventListener('keydown', cancel, once);

    const step = () => {
      const el = document.getElementById(id);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top, behavior: 'auto' });
        stableFor = lastTop !== null && Math.abs(top - lastTop) < 1 ? stableFor + 1 : 0;
        lastTop = top;
        if (stableFor >= 3) return; // three identical targets in a row = layout settled
      }
      if (tries++ < 40) timer = window.setTimeout(step, 80);
    };
    timer = window.setTimeout(step, 60);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
    };
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
