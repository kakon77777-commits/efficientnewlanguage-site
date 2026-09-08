// Post-build integrity check: a successful `vite build` exit code does not
// prove the site is servable. Run after build:worker, before the artifact is
// ever deployed — a failure here must stop the build script (`&&` chain).
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const dist = resolve(root, 'dist');

const failures = [];
const fail = (msg) => failures.push(msg);

function must(pathRel, minBytes = 1) {
  const p = join(dist, pathRel);
  if (!existsSync(p)) {
    fail(`missing: ${pathRel}`);
    return null;
  }
  const size = statSync(p).size;
  if (size < minBytes) fail(`too small (${size}B < ${minBytes}B): ${pathRel}`);
  return p;
}

// 1-2. Core entry points.
const indexPath = must('index.html', 200);
must('_worker.js', 500);

// 3. Assets directory not empty.
const assetsDir = join(dist, 'assets');
let assetFiles = [];
if (!existsSync(assetsDir)) {
  fail('missing: assets/ directory');
} else {
  assetFiles = readdirSync(assetsDir);
  if (assetFiles.length === 0) fail('assets/ directory is empty');
}

// 4-5. Every local asset index.html references (src=/href=) must exist, and
// every same-directory dynamic import() inside each JS chunk must resolve too
// (Vite doesn't emit a manifest.json here, so we scan the built JS directly).
if (indexPath) {
  const html = readFileSync(indexPath, 'utf8');
  const refs = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)].map((m) => m[1]);
  if (refs.length === 0) fail('index.html references no /assets/* files — build likely broken');
  for (const ref of refs) {
    const p = join(dist, ref.replace(/^\//, ''));
    if (!existsSync(p)) fail(`index.html references missing asset: ${ref}`);
    else if (statSync(p).size === 0) fail(`referenced asset is empty: ${ref}`);
  }
}
for (const file of assetFiles.filter((f) => f.endsWith('.js'))) {
  const text = readFileSync(join(assetsDir, file), 'utf8');
  const imports = [...text.matchAll(/import\([^)]*?["'`]\.\/([\w.-]+\.js)["'`]/g)].map((m) => m[1]);
  for (const chunk of imports) {
    if (!existsSync(join(assetsDir, chunk))) fail(`${file} dynamically imports missing chunk: ${chunk}`);
  }
}

// 6. build-info.json (Build ID / SHAs) made it into dist.
const buildInfoPath = must('build-info.json', 20);
if (buildInfoPath) {
  try {
    const info = JSON.parse(readFileSync(buildInfoPath, 'utf8'));
    if (!info.build_id || info.build_id === 'unknown') fail('build-info.json has no real build_id');
    console.log(`[verify-dist] build_id: ${info.build_id}`);
  } catch {
    fail('build-info.json is not valid JSON');
  }
}

// 7. The AI-native manifest (case corpus source of truth for /cases).
const manifestPath = must('ai/manifest.json', 20);
if (manifestPath) {
  try {
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
    const count = manifest.examples?.length ?? 0;
    console.log(`[verify-dist] ai/manifest.json: ${count} example(s)`);
    if (count === 0) fail('ai/manifest.json has zero examples');
  } catch {
    fail('ai/manifest.json is not valid JSON');
  }
}

// 8. Prerendered routes (scripts/prerender.mjs) — must contain real page
// content in #root, not just the static boot-fallback markup the source
// index.html ships with (~4KB). A silent no-op prerender (e.g. a template
// structure change breaking the script's regex match) would otherwise still
// produce a validly-sized, validly-linked index.html and pass every check
// above undetected.
function mustPrerendered(relPath, minBytes, mustContain) {
  const p = must(relPath, minBytes);
  if (!p) return;
  const html = readFileSync(p, 'utf8');
  if (!html.includes(mustContain)) {
    fail(`${relPath} doesn't look prerendered (missing "${mustContain}") — prerender.mjs may have no-op'd`);
  }
}
mustPrerendered('index.html', 10_000, 'Efficient New Language');
mustPrerendered('docs/index.html', 10_000, 'id="symbols"');
mustPrerendered('cases/index.html', 10_000, 'eml-cases-data');
mustPrerendered('origins/index.html', 10_000, 'id="eml-u"');

// 8b. Every homepage link into the workbench must name the section it promises.
// The playground sits ~3.3 screens below the top of /app, so a link labelled
// "Playground" pointing at bare /app lands the reader on a page whose own nav
// offers "Playground" again — which is exactly what it looked like from the
// homepage for weeks. This was FOUR separate instances (the homepage's own
// hand-written header plus three in-page CTAs), all invisible to the 2026-07-19
// fix because that one edited Nav.tsx and the homepage was not using Nav.tsx.
// Checking the built HTML gates the whole class rather than the four call sites.
{
  const home = resolve(root, 'dist/index.html');
  if (existsSync(home)) {
    const html = readFileSync(home, 'utf8');
    const bare = [...html.matchAll(/href="(\/app\/?)"/g)];
    if (bare.length > 0) {
      fail(
        `dist/index.html has ${bare.length} link(s) to bare /app. The playground is ~3.3 screens ` +
          'down that page, so a link into it must carry #playground (or another real anchor).',
      );
    }
    if (!html.includes('/app#playground')) {
      fail('dist/index.html has no /app#playground link — the homepage cannot reach the playground');
    }
  }
}

// 9. The /related hub plus one page per registry entry. The slug list comes from
// the registry source itself, not from what happens to exist in dist/ — a
// prerender loop that silently emitted nothing would otherwise pass.
mustPrerendered('related/index.html', 10_000, 'id="related"');
const relatedSrc = readFileSync(resolve(root, 'src/content/related.ts'), 'utf8');
const relatedSlugs = [...relatedSrc.matchAll(/^\s*slug:\s*'([a-z0-9-]+)'/gm)].map((m) => m[1]);
if (relatedSlugs.length === 0) {
  fail('src/content/related.ts yielded no project slugs — registry empty or its shape changed');
} else {
  console.log(`[verify-dist] related projects: ${relatedSlugs.join(', ')}`);
  for (const slug of relatedSlugs) {
    mustPrerendered(`related/${slug}/index.html`, 10_000, 'id="docs"');
  }
}

// 10. The case corpus is crawlable, and every page says which page it is.
//
// Written 2026-09-08 against a measured failure, not a hypothetical one. Search
// Console had 13 URLs indexed and 41 not, out of 784 in the sitemap, because:
//   - /cases paginated with <button onClick> + history.replaceState, so pages
//     2..64 had no URL a crawler could follow and 750 of 762 cases had no
//     inbound link anywhere on the site;
//   - every prerendered page carried the template's head verbatim, so all of
//     them declared <link rel="canonical" href="…org/"> — each page telling
//     Google it was the homepage — under one shared <title>.
// Both are the kind of defect that leaves the site looking completely fine.
{
  const manifestFile = join(dist, 'ai/manifest.json');
  const cases = existsSync(manifestFile)
    ? JSON.parse(readFileSync(manifestFile, 'utf8')).examples ?? []
    : [];
  const PAGE_SIZE = 12; // must match src/pages/Cases.tsx's PAGE_SIZE
  const totalPages = Math.max(1, Math.ceil(cases.length / PAGE_SIZE));

  // 10a. One static document per index page, and one per case.
  const indexPages = ['cases/index.html'];
  for (let n = 2; n <= totalPages; n += 1) indexPages.push(`cases/page/${n}/index.html`);
  let missingIndex = 0;
  for (const rel of indexPages) {
    if (!existsSync(join(dist, rel))) missingIndex += 1;
  }
  if (missingIndex > 0) fail(`${missingIndex} of ${indexPages.length} case-index page(s) not prerendered`);

  let missingCase = 0;
  let unrendered = 0;
  for (const c of cases) {
    const p = join(dist, `cases/${c.id}/index.html`);
    if (!existsSync(p)) {
      missingCase += 1;
      continue;
    }
    if (!readFileSync(p, 'utf8').includes('eml-case-data')) unrendered += 1;
  }
  if (missingCase > 0) fail(`${missingCase} of ${cases.length} case page(s) missing under dist/cases/<id>/`);
  if (unrendered > 0) fail(`${unrendered} case page(s) exist but were not prerendered (no eml-case-data island)`);

  // 10b. Reachability, walked rather than summed.
  //
  // The property that matters is not "these links exist somewhere" but "a
  // crawler starting at /cases/ arrives at all of them". Those differ: an
  // earlier version of this check unioned the links across all 64 index pages,
  // and a mutation that stripped every pagination link from page 1 alone still
  // passed, because pages 2..64 still linked to each other and nothing noticed
  // that no one could get to them. So this walks the graph from the one entry
  // point the site actually links to, and only counts what the walk reaches.
  const readIndex = (n) => {
    const rel = n === 1 ? 'cases/index.html' : `cases/page/${n}/index.html`;
    const p = join(dist, rel);
    return existsSync(p) ? readFileSync(p, 'utf8') : null;
  };

  const linked = new Set();
  const reached = new Set([1]);
  const queue = [1];
  let unslashed = 0;
  while (queue.length > 0) {
    const n = queue.shift();
    const html = readIndex(n);
    if (html === null) continue;
    for (const m of html.matchAll(/href="\/cases\/([^"/]+)\/"/g)) linked.add(m[1]);
    // The trailing slash is load-bearing: Cloudflare Pages 308-redirects
    // /cases/<id> to /cases/<id>/, so an unslashed link is a redirect on every
    // navigation and an unslashed sitemap entry lands in Search Console's
    // "page with redirect" bucket.
    unslashed += [...html.matchAll(/href="\/cases\/[^"]*[^/"]"/g)].length;
    for (const m of html.matchAll(/href="\/cases\/page\/(\d+)\/"/g)) {
      const next = Number(m[1]);
      if (!reached.has(next)) {
        reached.add(next);
        queue.push(next);
      }
    }
  }

  if (reached.size !== totalPages) {
    const missing = [];
    for (let n = 1; n <= totalPages; n += 1) if (!reached.has(n)) missing.push(n);
    fail(
      `${missing.length} of ${totalPages} index page(s) unreachable by following links from /cases/ ` +
        `(first: ${missing.slice(0, 8).join(', ')}) — pagination must be <a href>, not a click handler`,
    );
  }
  if (linked.size !== cases.length) {
    fail(
      `walking /cases/ reaches ${linked.size} of ${cases.length} cases — every case must be linked ` +
        'from the index page it belongs to',
    );
  }
  if (unslashed > 0) {
    fail(`${unslashed} case link(s) written without a trailing slash — each one is a 308 redirect`);
  }
  console.log(
    `[verify-dist] case corpus: ${cases.length} case page(s), ${indexPages.length} index page(s); ` +
      `walking from /cases/ reaches ${reached.size} index page(s) and ${linked.size} case(s)`,
  );
}

// 11. Every prerendered page describes ITSELF: its own canonical, its own
// title. Uniqueness is the check because the failure mode was sameness — 833
// pages sharing one canonical and one title looks identical to a working build
// from every other angle.
{
  const htmlFiles = [];
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'index.html') htmlFiles.push(p);
    }
  };
  walk(dist);

  const titles = new Map();
  const canonicals = new Map();
  let noCanonical = 0;
  for (const p of htmlFiles) {
    const html = readFileSync(p, 'utf8');
    const t = /<title>([\s\S]*?)<\/title>/.exec(html);
    const c = /<link rel="canonical" href="([^"]*)"/.exec(html);
    if (!c) {
      noCanonical += 1;
      continue;
    }
    titles.set(t ? t[1] : '(none)', (titles.get(t ? t[1] : '(none)') ?? 0) + 1);
    canonicals.set(c[1], (canonicals.get(c[1]) ?? 0) + 1);
  }
  if (noCanonical > 0) fail(`${noCanonical} prerendered page(s) have no <link rel="canonical">`);

  const dupTitles = [...titles].filter(([, n]) => n > 1);
  const dupCanonicals = [...canonicals].filter(([, n]) => n > 1);
  if (dupCanonicals.length > 0) {
    const [url, n] = dupCanonicals.sort((a, b) => b[1] - a[1])[0];
    fail(
      `${dupCanonicals.length} canonical URL(s) claimed by more than one page — worst: ${n} pages ` +
        `all declaring "${url}". A page whose canonical is not its own URL asks to be dropped.`,
    );
  }
  if (dupTitles.length > 0) {
    const [title, n] = dupTitles.sort((a, b) => b[1] - a[1])[0];
    fail(`${dupTitles.length} duplicated <title>(s) — worst: ${n} pages titled "${title}"`);
  }
  console.log(
    `[verify-dist] heads: ${htmlFiles.length} page(s), ${titles.size} distinct title(s), ` +
      `${canonicals.size} distinct canonical(s)`,
  );
}

if (failures.length > 0) {
  console.error(`[verify-dist] FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`[verify-dist] OK — ${assetFiles.length} asset file(s), all referenced/imported assets present.`);
