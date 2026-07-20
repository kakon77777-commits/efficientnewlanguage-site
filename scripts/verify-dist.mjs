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

if (failures.length > 0) {
  console.error(`[verify-dist] FAILED (${failures.length}):`);
  for (const f of failures) console.error(`  - ${f}`);
  process.exit(1);
}
console.log(`[verify-dist] OK — ${assetFiles.length} asset file(s), all referenced/imported assets present.`);
