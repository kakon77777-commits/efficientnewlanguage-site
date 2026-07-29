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
import { resolveEmlRepo } from './lib/eml-repo.mjs';

const EML_REPO = resolveEmlRepo();
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

/** slug -> the numbered id it was first published under. The id is STABLE:
 *  `/ai/examples/143-exception-suppressing-manager` is a canonical URL that
 *  agents may have already read, so regenerating must never renumber. */
function existingIds(): Map<string, string> {
  const ids = new Map<string, string>();
  if (!existsSync(CORPUS_DIR)) return ids;
  for (const f of readdirSync(CORPUS_DIR)) {
    const m = f.match(/^(\d{3}-(.+))\.eml\.md$/);
    if (m) ids.set(m[2]!, m[1]!);
  }
  return ids;
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

/** Everything after the frontmatter comment — the part that carries meaning.
 *  Compared instead of the whole file so that the `updated:` date only moves
 *  when the CONTENT moved, rather than on every build. */
function bodyOf(doc: string): string {
  const nl = doc.indexOf('\n');
  return nl === -1 ? doc : doc.slice(nl + 1);
}

/**
 * Generate new cases AND refresh existing ones.
 *
 * This used to only ever ADD: any case whose slug was already published was
 * filtered out and never looked at again. So when a case's .eml or README was
 * edited in the language repo, the site kept serving the old doc forever, with
 * no diff and no warning — `143-exception-suppressing-manager` was publishing
 * Python that no longer matched its source, and a prose claim ("`exc_type ==
 * ValueError` cannot be written") that the language had since made false.
 *
 * Silent staleness in a doc that AI agents are invited to read as ground truth
 * is worse than a missing doc. So every case is now re-rendered every build and
 * compared; the file is only rewritten when its body actually differs.
 */
function generateCases(): void {
  const known = existingIds();
  const all = findCaseDirs();
  const fresh = all.filter((c) => !known.has(c.slug));
  let regenerated = 0;
  let id = nextId();
  for (const c of all) {
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

    const existing = known.get(c.slug);
    const paddedId = existing ?? `${String(id).padStart(3, '0')}-${c.slug}`;
    const path = join(CORPUS_DIR, `${paddedId}.eml.md`);
    const doc = renderCaseDoc(paddedId, title, description, emlSrc, fwd.python, runResult.output, rt.ok, rt.message, eventTypes);

    if (existing) {
      const prior = readFileSync(path, 'utf8');
      if (bodyOf(prior) === bodyOf(doc)) continue; // unchanged — leave its `updated:` date alone
      writeFileSync(path, doc);
      console.log(`[generate-corpus] REGENERATED ${paddedId}.eml.md (source changed)`);
      regenerated += 1;
      continue;
    }

    writeFileSync(path, doc);
    console.log(`[generate-corpus] wrote ${paddedId}.eml.md`);
    id += 1;
  }
  console.log(
    `[generate-corpus] ${all.length} case(s): ${fresh.length} new, ${regenerated} regenerated, ${all.length - fresh.length - regenerated} already current.`,
  );
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

generateCases();
regenerateManifestAndSitemap();
