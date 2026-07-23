// SSR entry for scripts/prerender.mjs — built separately via `vite build --ssr`
// (so __BUILD_ID__ etc. get the same `define` substitution as the client
// bundle) and imported from plain Node. Deliberately does NOT go through
// App.tsx's lazy()/Suspense/ErrorBoundary wrapping: renderToString can't wait
// on a lazy import to resolve, so Showcase/Docs/Cases/Origins are imported
// directly here. /app (Engineering) and /terminal are never prerendered —
// they stay pure client React apps, unaffected by any of this.
import { renderToString } from 'react-dom/server';
import { ThemeProvider } from './theme';
import { I18nProvider } from './i18n';
import Showcase from './pages/Showcase';
import Docs from './pages/Docs';
import Cases, { type CaseEntry } from './pages/Cases';
import Origins from './pages/Origins';
import type { Route } from './routes';

export function renderRoute(
  route: Extract<Route, 'showcase' | 'docs' | 'cases' | 'origins'>,
  data?: { cases?: CaseEntry[] },
): string {
  const page =
    route === 'docs' ? <Docs /> : route === 'cases' ? <Cases initialCases={data?.cases} /> : route === 'origins' ? <Origins /> : <Showcase />;

  return renderToString(
    <ThemeProvider>
      <I18nProvider>{page}</I18nProvider>
    </ThemeProvider>,
  );
}
