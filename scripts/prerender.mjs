// Prerenders Showcase (/), Docs (/docs), Cases (/cases), and Origins
// (/origins) to real static HTML after the normal `vite build` has already
// produced dist/index.html
// (the client template + hashed asset tags) and dist/ai/manifest.json (the
// case data). /app (Engineering) is never prerendered — it stays a pure
// client React app.
//
// Approach: build src/entry-server.tsx as a separate SSR bundle via Vite's
// own build() API (so it gets the same `define`/`resolve.alias` config as
// the client build — critically, __BUILD_ID__ etc. get substituted, which a
// plain Node `import` of that file could never do), import the result, call
// renderToString() per route, and splice the output into a copy of
// dist/index.html's <div id="root">.
import { build as viteBuild } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');
const ssrOutDir = resolve(root, 'dist-ssr');

const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8');
const manifest = JSON.parse(readFileSync(join(dist, 'ai/manifest.json'), 'utf8'));

await viteBuild({
  configFile: resolve(root, 'vite.config.ts'),
  build: {
    ssr: resolve(root, 'src/entry-server.tsx'),
    outDir: 'dist-ssr',
    emptyOutDir: true,
  },
  logLevel: 'warn',
});

const entryPath = resolve(ssrOutDir, 'entry-server.js');
if (!existsSync(entryPath)) {
  throw new Error(`[prerender] expected SSR bundle at ${entryPath}, not found`);
}
const { renderRoute } = await import(pathToFileURL(entryPath).href);

// dist/index.html's #root div isn't empty — it holds the Phase 0 static
// boot-fallback markup (nested divs), which React's render() replaces the
// instant it mounts. Vite's production build also hoists the real
// `<script type="module">` entry into <head> (unlike the dev-mode source
// index.html, where it trails the div) — so `</body>` is the reliable anchor
// in the BUILT output, not the script tag. Match up to it rather than assume
// an empty `<div id="root"></div>` — a literal-string match against that
// assumption silently no-ops (no error, just an unmodified copy) if the
// template ever changes.
const ROOT_DIV_RE = /<div id="root">[\s\S]*?(?=<\/body>)/;

function pageHtml(bodyHtml) {
  if (!ROOT_DIV_RE.test(indexHtml)) {
    throw new Error('[prerender] could not locate <div id="root"> in dist/index.html — template changed?');
  }
  return indexHtml.replace(ROOT_DIV_RE, `<div id="root">${bodyHtml}</div>\n  `);
}

function writeRoute(relDir, html) {
  const outDir = relDir ? join(dist, relDir) : dist;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`[prerender] wrote ${relDir ? relDir + '/' : ''}index.html`);
}

writeRoute('', pageHtml(renderRoute('showcase')));
writeRoute('docs', pageHtml(renderRoute('docs')));
writeRoute('origins', pageHtml(renderRoute('origins')));

const casesDataScript = `<script id="eml-cases-data" type="application/json">${JSON.stringify(manifest.examples ?? [])}</script>`;
const casesHtml = pageHtml(renderRoute('cases', { cases: manifest.examples ?? [] }));
writeRoute('cases', casesHtml.replace('</body>', `${casesDataScript}</body>`));

rmSync(ssrOutDir, { recursive: true, force: true });
