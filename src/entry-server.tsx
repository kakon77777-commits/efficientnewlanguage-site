// SSR entry for scripts/prerender.mjs — built separately via `vite build --ssr`
// (so __BUILD_ID__ etc. get the same `define` substitution as the client
// bundle) and imported from plain Node. Deliberately does NOT go through
// App.tsx's lazy()/Suspense/ErrorBoundary wrapping: renderToString can't wait
// on a lazy import to resolve, so Showcase/Docs/Cases/Origins/Related are
// imported directly here. /app (Engineering) and /terminal are never
// prerendered — they stay pure client React apps, unaffected by any of this.
import { renderToString } from 'react-dom/server';
import { ThemeProvider } from './theme';
import { I18nProvider } from './i18n';
import Showcase from './pages/Showcase';
import Docs from './pages/Docs';
import Cases, { type CaseEntry } from './pages/Cases';
import CaseDetail, { type CaseNeighbour } from './pages/CaseDetail';
import Origins from './pages/Origins';
import Related from './pages/Related';
import RelatedProject from './pages/RelatedProject';
import type { CaseDoc } from './lib/case-doc';
import type { Route } from './routes';

export function renderRoute(
  route: Extract<Route, 'showcase' | 'docs' | 'cases' | 'case-detail' | 'origins' | 'related' | 'related-project'>,
  data?: {
    cases?: CaseEntry[];
    slug?: string;
    page?: number;
    totalPages?: number;
    total?: number;
    doc?: CaseDoc;
    prev?: CaseNeighbour | null;
    next?: CaseNeighbour | null;
    indexPage?: number;
  },
): string {
  const page =
    route === 'docs' ? (
      <Docs />
    ) : route === 'cases' ? (
      <Cases
        initialItems={data?.cases}
        initialPage={data?.page ?? 1}
        initialTotalPages={data?.totalPages ?? 1}
        initialTotal={data?.total ?? 0}
      />
    ) : route === 'case-detail' ? (
      <CaseDetail
        caseId={data?.doc?.id ?? ''}
        initialDoc={data?.doc}
        prev={data?.prev ?? null}
        next={data?.next ?? null}
        indexPage={data?.indexPage ?? 1}
      />
    ) : route === 'origins' ? (
      <Origins />
    ) : route === 'related' ? (
      <Related />
    ) : route === 'related-project' ? (
      <RelatedProject slug={data?.slug ?? ''} />
    ) : (
      <Showcase />
    );

  return renderToString(
    <ThemeProvider>
      <I18nProvider>{page}</I18nProvider>
    </ThemeProvider>,
  );
}

/** Slugs the prerenderer should emit a /related/<slug>/index.html for. Exported
 *  from the SSR bundle so prerender.mjs never hard-codes a list that can drift
 *  from the registry in content/related.ts. */
export { RELATED_SLUGS } from './content/related';

/** Re-exported for scripts/prerender.mjs, which is plain Node and cannot import
 *  TypeScript. Going through this bundle means the prerenderer parses corpus
 *  pages with the SAME parser the page component uses, and paginates with the
 *  same PAGE_SIZE the component paginates with — the two cannot drift into
 *  emitting a set of files that does not match the set of links. */
export { parseCaseDoc, metaDescription } from './lib/case-doc';
export { CASES_PAGE_SIZE, casesPageHref as pageHref, caseHref } from './routes';
