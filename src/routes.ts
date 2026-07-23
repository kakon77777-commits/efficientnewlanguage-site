export type Route = 'showcase' | 'engineering' | 'docs' | 'cases' | 'terminal' | 'origins';

/** Shared by the client (App.tsx, main.tsx) and the SSR prerender entry
 *  (entry-server.tsx) so the two never drift on what path renders what. */
export function matchRoute(pathname: string): Route {
  const p = pathname.replace(/\/+$/, '') || '/';
  if (p === '/app' || p.startsWith('/app/')) return 'engineering';
  if (p === '/docs' || p.startsWith('/docs/')) return 'docs';
  if (p === '/cases' || p.startsWith('/cases/')) return 'cases';
  if (p === '/terminal' || p.startsWith('/terminal/')) return 'terminal';
  if (p === '/origins' || p.startsWith('/origins/')) return 'origins';
  return 'showcase';
}
