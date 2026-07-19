import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import type { IncomingMessage, ServerResponse } from 'node:http';

const here = dirname(fileURLToPath(import.meta.url));

// scripts/build-meta.mjs writes this before `vite build` runs; in dev (no build
// step) fall back to a clearly-labeled placeholder rather than failing.
const buildInfoPath = resolve(here, 'public/build-info.json');
const buildInfo = existsSync(buildInfoPath)
  ? JSON.parse(readFileSync(buildInfoPath, 'utf8'))
  : { build_id: 'dev', site_sha: 'unknown', eml_core_sha: 'unknown', built_at: new Date().toISOString() };

// Dev/preview only: serve text/markdown, text/plain, .ebnf, .jsonl, .json with an
// explicit `charset=utf-8`, matching the production Cloudflare worker. Vite's
// static server omits the charset, so on some OS locales the browser mis-detects
// the encoding and renders UTF-8 (e.g. any non-ASCII) as mojibake. Patches
// res.setHeader so it wins regardless of when the static handler sets the type.
function utf8TextHeaders(): Plugin {
  const mw = (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = (req.url || '').split('?')[0];
    const orig = res.setHeader.bind(res);
    res.setHeader = (name: string, value: number | string | readonly string[]) => {
      if (String(name).toLowerCase() === 'content-type') {
        if (typeof value === 'string' && /^(text\/|application\/(json|x-ndjson))/.test(value) && !/charset/i.test(value)) {
          value = `${value}; charset=utf-8`;
        } else if (url.endsWith('.ebnf') || url.endsWith('.jsonl')) {
          // Vite has no MIME for these; force UTF-8 text so they render, not download.
          value = url.endsWith('.jsonl') ? 'application/x-ndjson; charset=utf-8' : 'text/plain; charset=utf-8';
        }
      }
      return orig(name, value);
    };
    next();
  };
  return {
    name: 'utf8-text-headers',
    configureServer(server) {
      server.middlewares.use(mw);
    },
    configurePreviewServer(server) {
      server.middlewares.use(mw);
    },
  };
}

// The EML monorepo. Its browser-safe packages are imported run-from-source via
// aliases below (no build, single source of truth — the playground runs the real
// transpiler/interpreter in the browser). For an eventual standalone deploy these
// would be published packages instead; for now this points at the local repo.
// Override with the EML_REPO env var for a different machine/checkout layout.
const EML = process.env.EML_REPO || 'D:/Ai/work together/EML';
const emlPkg = (name: string) => `${EML}/packages/${name}/src/index.ts`;

export default defineConfig({
  define: {
    __BUILD_ID__: JSON.stringify(buildInfo.build_id),
    __SITE_SHA__: JSON.stringify(buildInfo.site_sha),
    __EML_CORE_SHA__: JSON.stringify(buildInfo.eml_core_sha),
    __BUILT_AT__: JSON.stringify(buildInfo.built_at),
  },
  plugins: [utf8TextHeaders(), react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(here, 'src'),
      '@eml/types': emlPkg('types'),
      '@eml/parser': emlPkg('parser'),
      '@eml/transpiler-python': emlPkg('transpiler-python'),
      '@eml/transpiler-eml': emlPkg('transpiler-eml'),
      '@eml/interp': emlPkg('interp'),
      '@eml/trace': emlPkg('trace'),
    },
  },
  server: {
    port: 5180,
    strictPort: true,
    // Allow Vite to serve the run-from-source EML packages from outside this dir.
    fs: { allow: [here, EML] },
  },
});
