// Bundles generate-corpus.impl.ts (+ the browser-safe EML packages, run from
// source via the same aliases as vite.config.ts / build-worker.mjs) into a
// runnable Node script, then executes it. Regenerates public/ai/examples/*.md
// + manifest.json + sitemap.xml from the language repo's own examples/ dirs —
// run this BEFORE `vite build` so the corpus is always fresh before a deploy.
import { build } from 'esbuild';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const EML = 'D:/Ai/work together/EML';
const emlPkg = (name) => `${EML}/packages/${name}/src/index.ts`;

const bundleDir = resolve(root, 'node_modules/.cache/generate-corpus');
mkdirSync(bundleDir, { recursive: true });
const bundlePath = resolve(bundleDir, 'bundle.mjs');

await build({
  entryPoints: [resolve(root, 'scripts/generate-corpus.impl.ts')],
  outfile: bundlePath,
  bundle: true,
  format: 'esm',
  target: 'node20',
  platform: 'node',
  alias: {
    '@eml/types': emlPkg('types'),
    '@eml/parser': emlPkg('parser'),
    '@eml/transpiler-python': emlPkg('transpiler-python'),
    '@eml/transpiler-eml': emlPkg('transpiler-eml'),
    '@eml/interp': emlPkg('interp'),
    '@eml/trace': emlPkg('trace'),
  },
});

await import(pathToFileURL(bundlePath).href);
