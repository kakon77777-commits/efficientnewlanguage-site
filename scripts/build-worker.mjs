// Bundles worker/index.ts (+ the browser-safe EML packages) into dist/_worker.js
// for Cloudflare Pages advanced mode. The EML packages are resolved run-from-source
// via the same aliases used by vite.config.ts (single source of truth = the local
// EML monorepo). Run AFTER `vite build`, so it overwrites/creates dist/_worker.js.
import { build } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

// The EML monorepo (same path as vite.config.ts). Its browser-safe packages have
// no node: imports in the chain we use (the node file sink is @eml/trace/node,
// which is never imported).
const EML = 'D:/Ai/work together/EML';
const emlPkg = (name) => `${EML}/packages/${name}/src/index.ts`;

await build({
  entryPoints: [resolve(root, 'worker/index.ts')],
  outfile: resolve(root, 'dist/_worker.js'),
  bundle: true,
  format: 'esm',
  target: 'es2022',
  platform: 'neutral',
  minify: true,
  legalComments: 'none',
  alias: {
    '@eml/types': emlPkg('types'),
    '@eml/parser': emlPkg('parser'),
    '@eml/transpiler-python': emlPkg('transpiler-python'),
    '@eml/transpiler-eml': emlPkg('transpiler-eml'),
    '@eml/interp': emlPkg('interp'),
    '@eml/trace': emlPkg('trace'),
  },
});

console.log('[build-worker] wrote dist/_worker.js');
