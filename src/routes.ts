export type Route =
  | 'showcase'
  | 'engineering'
  | 'docs'
  | 'cases'
  | 'case-detail'
  | 'terminal'
  | 'origins'
  | 'related'
  | 'related-project';

/** Shared by the client (App.tsx, main.tsx) and the SSR prerender entry
 *  (entry-server.tsx) so the two never drift on what path renders what. */
export function matchRoute(pathname: string): Route {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/app' || p.startsWith('/app/')) return 'engineering';
  if (p === '/docs' || p.startsWith('/docs/')) return 'docs';
  // /cases/page/<n> is the paginated index; anything else under /cases/ is a
  // single case. `page` can never collide with a case id — ids are `NNN-slug`
  // and always start with three digits — but the index is matched first anyway
  // so the two can never be ambiguous.
  if (p === '/cases' || p === '/cases/page' || p.startsWith('/cases/page/')) return 'cases';
  if (p.startsWith('/cases/')) return 'case-detail';
  if (p === '/terminal' || p.startsWith('/terminal/')) return 'terminal';
  if (p === '/origins' || p.startsWith('/origins/')) return 'origins';
  if (p === '/related') return 'related';
  if (p.startsWith('/related/')) return 'related-project';
  return 'showcase';
}

/** The `<slug>` in /related/<slug>, or '' for the hub. Trailing slashes and any
 *  deeper path segments are ignored, so /related/cair/ resolves like /related/cair. */
export function relatedSlug(pathname: string): string {
  const p = pathname.replace(/\/+$/, '');
  if (!p.startsWith('/related/')) return '';
  return p.slice('/related/'.length).split('/')[0] ?? '';
}

/** The `<id>` in /cases/<id>, or '' when the path is not a case page. */
export function caseSlug(pathname: string): string {
  const p = pathname.replace(/\/+$/, '');
  if (!p.startsWith('/cases/')) return '';
  const first = p.slice('/cases/'.length).split('/')[0] ?? '';
  return first === 'page' ? '' : first;
}

/** Which page of the case index a path/query asks for.
 *
 *  `/cases/page/<n>` is the canonical, crawlable form: it is a distinct static
 *  document, so a search engine can follow the chain and index each page.
 *  `?page=<n>` is still read, because links to it exist and because a query
 *  parameter costs nothing to keep working — but it is never generated, since
 *  a query variant of an already-prerendered path is exactly what Search
 *  Console reports as "alternate page with proper canonical tag" and drops. */
export function casesPage(pathname: string, search = ''): number {
  const p = pathname.replace(/\/+$/, '');
  if (p.startsWith('/cases/page/')) {
    const n = Number(p.slice('/cases/page/'.length).split('/')[0]);
    return Number.isInteger(n) && n > 0 ? n : 1;
  }
  const q = Number(new URLSearchParams(search).get('page'));
  return Number.isInteger(q) && q > 0 ? q : 1;
}

/** Cards per page of the case index. One definition, imported by the page
 *  component, the prerenderer and the sitemap generator alike: the set of files
 *  emitted, the set of links rendered and the set of URLs advertised have to be
 *  the same set, and three separate 12s is how they stop being. */
export const CASES_PAGE_SIZE = 12;

/** The URL of a page of the case index.
 *
 *  Trailing slash: Cloudflare Pages 308-redirects /cases to /cases/, so the
 *  slashed form is the one that answers 200 and therefore the only one worth
 *  linking or advertising. Page 1 is /cases/, never /cases/page/1/ — one page,
 *  one URL. */
export function casesPageHref(n: number): string {
  return n <= 1 ? '/cases/' : `/cases/page/${n}/`;
}

/** The URL of a single case page. */
export function caseHref(id: string): string {
  return `/cases/${id}/`;
}
