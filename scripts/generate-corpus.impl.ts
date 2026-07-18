// Derives public/ai/examples/*.eml.md (the "Machine Corpus Layer") from the
// EML monorepo's own `examples/<slug>/` directories, instead of hand-typing
// content twice. Single source of truth = the language repo; this script is
// the ONLY writer of GENERATED corpus docs. Existing hand-written docs
// (000-005) are never touched or renumbered — see docs/roadmap.md's A-3/
// case-corpus plan for the "no retroactive migration" scope decision.
//
// A language-repo example directory qualifies as a "case" iff it has a
// README.md sitting next to exactly one `.eml` file (the same convention
// mvp-tic-tac-toe / mvp-number-guessing-game already use) — this naturally
// excludes the phaseN-* regression-fixture directories, which have neither.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { transpileEmlToPython } from '@eml/transpiler-python';
import { roundTripFromEml } from '@eml/transpiler-eml';
import { interpret } from '@eml/interp';

const EML_REPO = 'D:/Ai/work together/EML';
const EXAMPLES_DIR = join(EML_REPO, 'examples');
const SITE_ROOT = process.cwd();
const CORPUS_DIR = join(SITE_ROOT, 'public/ai/examples');
const MANIFEST_PATH = join(SITE_ROOT, 'public/ai/manifest.json');
const SITEMAP_PATH = join(SITE_ROOT, 'public/sitemap.xml');

interface CaseDir {
  slug: string;
  emlPath: string;
  readmePath: string;
}

function findCaseDirs(): CaseDir[] {
  const entries = readdirSync(EXAMPLES_DIR, { withFileTypes: true }).filter((e) => e.isDirectory());
  const cases: CaseDir[] = [];
  for (const entry of entries) {
    const dir = join(EXAMPLES_DIR, entry.name);
    const readmePath = join(dir, 'README.md');
    if (!existsSync(readmePath)) continue;
    const emlFiles = readdirSync(dir).filter((f) => f.endsWith('.eml'));
    if (emlFiles.length !== 1) {
      console.warn(`[generate-corpus] skipping ${entry.name}: expected exactly 1 .eml file, found ${emlFiles.length}`);
      continue;
    }
    cases.push({ slug: entry.name, emlPath: join(dir, emlFiles[0]), readmePath });
  }
  cases.sort((a, b) => a.slug.localeCompare(b.slug));
  return cases;
}

/** Title = first `# ` line; description = the paragraph right after it. Works
 *  identically for a case's language-repo README.md and for a previously
 *  generated `.eml.md` doc (both start with an H1 then a prose paragraph). */
function extractTitleAndDescription(markdown: string): { title: string; description: string } {
  const lines = markdown.split('\n');
  const titleIdx = lines.findIndex((l) => l.startsWith('# '));
  const title = titleIdx >= 0 ? lines[titleIdx]!.slice(2).replace(/^Example \d+ — /, '').trim() : '(untitled)';
  const rest = titleIdx >= 0 ? lines.slice(titleIdx + 1) : lines;
  const para: string[] = [];
  let started = false;
  for (const line of rest) {
    if (!started) {
      if (line.trim() === '') continue;
      started = true;
    }
    if (started && line.trim() === '') break;
    para.push(line);
  }
  return { title, description: para.join(' ').trim() };
}

function existingSlugs(): Set<string> {
  if (!existsSync(CORPUS_DIR)) return new Set();
  const slugs = new Set<string>();
  for (const f of readdirSync(CORPUS_DIR)) {
    const m = f.match(/^\d{3}-(.+)\.eml\.md$/);
    if (m) slugs.add(m[1]!);
  }
  return slugs;
}

function nextId(): number {
  if (!existsSync(CORPUS_DIR)) return 0;
  let max = -1;
  for (const f of readdirSync(CORPUS_DIR)) {
    const m = f.match(/^(\d{3})-/);
    if (m) max = Math.max(max, parseInt(m[1]!, 10));
  }
  return max + 1;
}

function renderCaseDoc(id: string, title: string, description: string, emlSrc: string, pySrc: string, stdout: string, roundtripOk: boolean, roundtripMessage: string, eventTypes: string[]): string {
  const today = new Date().toISOString().slice(0, 10);
  const num = id.split('-')[0];
  return `<!-- canonical: efficientnewlanguage.org/ai/examples/${id} | ai_layer_version: 0.1.0 | updated: ${today} -->

# Example ${num} — ${title}

${description}

## EML

\`\`\`eml
${emlSrc.trimEnd()}
\`\`\`

## Python (deterministic transpilation)

\`\`\`python
${pySrc.trimEnd()}
\`\`\`

## stdout (executed)

\`\`\`text
${stdout.trimEnd()}
\`\`\`

## Round-trip

\`ok: ${roundtripOk}\` — ${roundtripMessage}

## Trace event types

${eventTypes.join(' · ')}
`;
}

function generateNewCases(): void {
  const known = existingSlugs();
  const cases = findCaseDirs().filter((c) => !known.has(c.slug));
  if (cases.length === 0) {
    console.log('[generate-corpus] no new case directories to generate.');
    return;
  }
  let id = nextId();
  for (const c of cases) {
    const emlSrc = readFileSync(c.emlPath, 'utf8');
    const readmeSrc = readFileSync(c.readmePath, 'utf8');
    const { title, description } = extractTitleAndDescription(readmeSrc);

    const fwd = transpileEmlToPython(emlSrc);
    if (!fwd.ok) {
      console.warn(`[generate-corpus] skipping ${c.slug}: forward transpile failed`);
      continue;
    }
    const runResult = interpret(emlSrc);
    const rt = roundTripFromEml(emlSrc);
    const eventTypes: string[] = [];
    for (const e of runResult.events) {
      if (!eventTypes.includes(e.type)) eventTypes.push(e.type);
    }

    const paddedId = `${String(id).padStart(3, '0')}-${c.slug}`;
    const doc = renderCaseDoc(paddedId, title, description, emlSrc, fwd.python, runResult.output, rt.ok, rt.message, eventTypes);
    writeFileSync(join(CORPUS_DIR, `${paddedId}.eml.md`), doc);
    console.log(`[generate-corpus] wrote ${paddedId}.eml.md`);
    id += 1;
  }
}

function regenerateManifestAndSitemap(): void {
  const files = readdirSync(CORPUS_DIR)
    .filter((f) => f.endsWith('.eml.md'))
    .sort();

  const examples = files.map((f) => {
    const id = f.replace(/\.eml\.md$/, '');
    const markdown = readFileSync(join(CORPUS_DIR, f), 'utf8');
    const { title, description } = extractTitleAndDescription(markdown);
    return { id, path: `/ai/examples/${f}`, title, description };
  });

  const manifest = JSON.parse(readFileSync(MANIFEST_PATH, 'utf8'));
  manifest.examples = examples;
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`[generate-corpus] manifest.json examples array: ${examples.length} entries`);

  const sitemap = readFileSync(SITEMAP_PATH, 'utf8');
  const nonExampleLines = sitemap
    .split('\n')
    .filter((line) => !line.includes('/ai/examples/'));
  const closeTagIdx = nonExampleLines.findIndex((l) => l.trim() === '</urlset>');
  const today = new Date().toISOString().slice(0, 10);
  const exampleLines = examples.map(
    (e) =>
      `  <url><loc>https://efficientnewlanguage.org${e.path}</loc><lastmod>${today}</lastmod><changefreq>monthly</changefreq><priority>0.4</priority></url>`,
  );
  const newSitemap = [
    ...nonExampleLines.slice(0, closeTagIdx),
    ...exampleLines,
    ...nonExampleLines.slice(closeTagIdx),
  ].join('\n');
  writeFileSync(SITEMAP_PATH, newSitemap);
  console.log(`[generate-corpus] sitemap.xml: ${examples.length} example entries`);
}

generateNewCases();
regenerateManifestAndSitemap();
