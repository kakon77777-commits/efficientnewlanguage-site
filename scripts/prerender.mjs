// Prerenders every crawlable page of the site to real static HTML after the
// normal `vite build` has produced dist/index.html (the client template +
// hashed asset tags) and dist/ai/manifest.json (the case data):
//
//   /                      showcase
//   /docs  /origins        reference pages
//   /related  /related/*   the related-projects hub and one page per project
//   /cases                 case index, page 1
//   /cases/page/<n>        case index, pages 2..N — one static document each
//   /cases/<id>            one page per corpus case (762 of them)
//
// /app (Engineering) and /terminal are never prerendered — they stay pure
// client React apps.
//
// Approach: build src/entry-server.tsx as a separate SSR bundle via Vite's
// own build() API (so it gets the same `define`/`resolve.alias` config as
// the client build — critically, __BUILD_ID__ etc. get substituted, which a
// plain Node `import` of that file could never do), import the result, call
// renderToString() per route, and splice the output into a copy of
// dist/index.html's <div id="root"> — with that copy's <head> rewritten to
// describe THIS page.
//
// The head rewrite is not cosmetic. Until 2026-09-08 every prerendered page
// shipped the template's head verbatim, which means every page on the site
// carried `<link rel="canonical" href="https://efficientnewlanguage.org/">`
// and the same <title>: each page told Google it was the homepage. Search
// Console showed the consequence directly — 11 URLs filed under "alternate
// page with proper canonical tag" — and adding 762 more pages under a
// site-wide self-negating canonical would have produced 762 more of them.
import { build as viteBuild } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');
const ssrOutDir = resolve(root, 'dist-ssr');
const ORIGIN = 'https://efficientnewlanguage.org';

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
const { renderRoute, RELATED_SLUGS, parseCaseDoc, metaDescription, CASES_PAGE_SIZE, pageHref } =
  await import(pathToFileURL(entryPath).href);
if (!Array.isArray(RELATED_SLUGS) || RELATED_SLUGS.length === 0) {
  throw new Error('[prerender] entry-server exported no RELATED_SLUGS — content/related.ts registry empty?');
}
if (typeof parseCaseDoc !== 'function' || typeof metaDescription !== 'function') {
  throw new Error('[prerender] entry-server did not export the case-doc parser');
}
if (!Number.isInteger(CASES_PAGE_SIZE) || CASES_PAGE_SIZE < 1) {
  throw new Error(`[prerender] entry-server exported a bad CASES_PAGE_SIZE: ${CASES_PAGE_SIZE}`);
}

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
if (!ROOT_DIV_RE.test(indexHtml)) {
  throw new Error('[prerender] could not locate <div id="root"> in dist/index.html — template changed?');
}

const escAttr = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const escText = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Every head field this script rewrites, as [name, regex, replacement].
 *  Each one is asserted below: a pattern that stops matching must fail the
 *  build, not silently leave the homepage's value on 800 pages. */
function headEdits({ url, title, description }) {
  const t = escAttr(title);
  const d = escAttr(description);
  return [
    ['title', /<title>[\s\S]*?<\/title>/, `<title>${escText(title)}</title>`],
    [
      'meta description',
      /<meta\s+name="description"[\s\S]*?\/>/,
      `<meta name="description" content="${d}" />`,
    ],
    ['canonical', /<link rel="canonical"[^>]*\/>/, `<link rel="canonical" href="${escAttr(url)}" />`],
    ['og:url', /<meta property="og:url"[^>]*\/>/, `<meta property="og:url" content="${escAttr(url)}" />`],
    ['og:title', /<meta property="og:title"[^>]*\/>/, `<meta property="og:title" content="${t}" />`],
    [
      'og:description',
      /<meta\s+property="og:description"[\s\S]*?\/>/,
      `<meta property="og:description" content="${d}" />`,
    ],
    ['twitter:title', /<meta name="twitter:title"[^>]*\/>/, `<meta name="twitter:title" content="${t}" />`],
    [
      'twitter:description',
      /<meta\s+name="twitter:description"[\s\S]*?\/>/,
      `<meta name="twitter:description" content="${d}" />`,
    ],
  ];
}

// Assert the whole set matches the template ONCE, up front, rather than per
// page: 800 identical warnings would be noise, and one silent miss would not
// be visible at all.
for (const [name, re] of headEdits({ url: ORIGIN, title: 'x', description: 'x' })) {
  if (!re.test(indexHtml)) {
    throw new Error(`[prerender] head field "${name}" not found in dist/index.html — template changed?`);
  }
}

/** JSON safe to embed in `<script type="application/json">`: a `</script>` or
 *  `<!--` inside the data would otherwise end the element early. */
function jsonScript(id, value) {
  const json = JSON.stringify(value).replace(/</g, '\\u003c');
  return `<script id="${id}" type="application/json">${json}</script>`;
}

function pageHtml({ path, title, description, bodyHtml, extraBody = '' }) {
  let html = indexHtml;
  for (const [, re, replacement] of headEdits({ url: ORIGIN + path, title, description })) {
    html = html.replace(re, replacement);
  }
  html = html.replace(ROOT_DIV_RE, `<div id="root">${bodyHtml}</div>\n  `);
  return extraBody ? html.replace('</body>', `${extraBody}</body>`) : html;
}

let written = 0;
function writeRoute(relDir, html) {
  const outDir = relDir ? join(dist, relDir) : dist;
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  written += 1;
}

function log(msg) {
  console.log(`[prerender] ${msg}`);
}

// ---------------------------------------------------------------- static pages

const SITE_DESC =
  'EML (Efficient New Language) is a deterministic semantic-overlay programming layer: it compresses high-frequency program intent into symbols and transpiles, rule-based and reversibly, to standard languages.';

writeRoute('', pageHtml({
  path: '/',
  title: 'EML 2026 — Efficient New Language',
  description: SITE_DESC + ' Try it in the browser.',
  bodyHtml: renderRoute('showcase'),
}));
writeRoute('docs', pageHtml({
  path: '/docs/',
  title: 'Docs — symbols, architecture and open source · EML',
  description:
    'The EML reference: the symbol set and what each one compiles to, the transpiler architecture, and how the open-source packages fit together.',
  bodyHtml: renderRoute('docs'),
}));
writeRoute('origins', pageHtml({
  path: '/origins/',
  title: 'Origins — where EML came from · EML',
  description: 'How EML started, the problem it was built for, and the decisions that shaped the language.',
  bodyHtml: renderRoute('origins'),
}));
writeRoute('related', pageHtml({
  path: '/related/',
  title: 'Related projects · EML',
  description: 'Other EveMissLab projects that share EML’s deterministic, verifiable-by-construction approach.',
  bodyHtml: renderRoute('related'),
}));
for (const slug of RELATED_SLUGS) {
  writeRoute(`related/${slug}`, pageHtml({
    path: `/related/${slug}/`,
    title: `${slug.toUpperCase()} — related project · EML`,
    description: `${slug.toUpperCase()}, a related EveMissLab project alongside EML (Efficient New Language).`,
    bodyHtml: renderRoute('related-project', { slug }),
  }));
}
log(`static pages: ${written} written`);

// ------------------------------------------------------------- the case index

const cases = manifest.examples ?? [];
if (cases.length === 0) throw new Error('[prerender] ai/manifest.json has no examples — nothing to prerender');
const totalPages = Math.max(1, Math.ceil(cases.length / CASES_PAGE_SIZE));

// The island carries THIS page's twelve cards, not all 762 entries. The whole
// manifest is 314KB of JSON; embedding it in every one of the 64 index pages
// would have shipped 20MB of the same payload repeated, to render twelve cards
// each time. The client renders exactly what was prerendered, so it needs
// exactly what was prerendered.
for (let n = 1; n <= totalPages; n += 1) {
  const path = pageHref(n); // '/cases/' or '/cases/page/<n>/'
  const items = cases.slice((n - 1) * CASES_PAGE_SIZE, n * CASES_PAGE_SIZE);
  const data = { cases: items, page: n, totalPages, total: cases.length };
  writeRoute(path.replace(/^\/|\/$/g, ''), pageHtml({
    path,
    title:
      n === 1
        ? `Case corpus — ${cases.length} verified EML programs`
        : `Case corpus — page ${n} of ${totalPages} · EML`,
    description:
      n === 1
        ? `Every one of the ${cases.length} EML cases: real programs, each transpiled to Python, executed, and checked against CPython before it lands here.`
        : `Page ${n} of the EML case corpus — ${cases.length} verified programs, each transpiled, executed and checked against real Python.`,
    bodyHtml: renderRoute('cases', data),
    extraBody: jsonScript('eml-cases-data', {
      items,
      page: n,
      totalPages,
      total: cases.length,
    }),
  }));
}
log(`case index: ${totalPages} page(s) (/cases + /cases/page/2..${totalPages})`);

// ------------------------------------------------------------ one page per case

const examplesDir = join(dist, 'ai/examples');
let caseCount = 0;
for (let i = 0; i < cases.length; i += 1) {
  const entry = cases[i];
  const file = join(examplesDir, `${entry.id}.eml.md`);
  if (!existsSync(file)) {
    // A manifest entry with no document is a corpus generation failure, not a
    // page to skip: skipping would publish an index linking to a 404.
    throw new Error(`[prerender] manifest lists ${entry.id} but ${file} does not exist`);
  }
  const doc = parseCaseDoc(entry.id, readFileSync(file, 'utf8'));
  const prev = i > 0 ? { id: cases[i - 1].id, title: cases[i - 1].title ?? cases[i - 1].id } : null;
  const next =
    i < cases.length - 1 ? { id: cases[i + 1].id, title: cases[i + 1].title ?? cases[i + 1].id } : null;
  const indexPage = Math.floor(i / CASES_PAGE_SIZE) + 1;

  writeRoute(`cases/${entry.id}`, pageHtml({
    path: `/cases/${entry.id}/`,
    title: `${doc.title} — EML case ${doc.number}`,
    description: metaDescription(doc),
    bodyHtml: renderRoute('case-detail', { doc, prev, next, indexPage }),
    extraBody: jsonScript('eml-case-data', { doc, prev, next, indexPage }),
  }));
  caseCount += 1;
}
log(`case pages: ${caseCount} written (/cases/<id>)`);
log(`total: ${written} HTML file(s)`);

rmSync(ssrOutDir, { recursive: true, force: true });
