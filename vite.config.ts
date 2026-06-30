import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));

// Dev/preview only: serve text/markdown, text/plain, .ebnf, .jsonl, .json with an
// explicit `charset=utf-8`, matching the production Cloudflare worker. Vite's
// static server omits the charset, so on some OS locales the browser mis-detects
// the encoding and renders UTF-8 (e.g. any non-ASCII) as mojibake. Patches
// res.setHeader so it wins regardless of when the static handler sets the type.
function utf8TextHeaders(): Plugin {
  const mw = (req: { url?: string }, res: { setHeader: (n: string, v: unknown) => unknown }, next: () => void) => {
    const url = (req.url || '').split('?')[0];
    const orig = res.setHeader.bind(res);
    res.setHeader = (name: string, value: unknown) => {
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
const EML = 'D:/Ai/work together/EML';
const emlPkg = (name: string) => `${EML}/packages/${name}/src/index.ts`;

export default defineConfig({
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
