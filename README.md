# Efficient New Language (EML) — Website

The official website, in-browser playground, and **AI-Native Interface Layer** for
**[Efficient New Language (EML)](https://github.com/kakon77777-commits/efficientnewlanguage)** —
a deterministic semantic-overlay programming layer that compresses high-frequency program intent
into symbols and transpiles, rule-based and reversibly, to Python.

🌐 Live: **https://efficientnewlanguage.org**

## What's here

- **Human site** — a cinematic landing (`/`), an engineering workbench with an in-browser
  playground (`/app`), and docs (`/docs`). The playground runs the **real** EML toolchain in the
  browser (parser, transpiler, execution-truth interpreter, PHOSPHOR trace) — no backend, no Python.
- **AI-Native Interface Layer** (`/ai/` + `/llms.txt`) — a public, non-visual, versioned,
  machine-readable surface for LLMs and agents: concept genealogy, the `EML-LANG-2026-v1.0` spec
  digest, EBNF grammar, AST / trace / error JSON Schemas, verified examples, and a manifest.
- **Live, bounded Agent Tools** (`/ai/tools/*`) — the real toolchain bundled into the edge worker:
  `parse`, `transpile-python`, `transpile-eml`, `interpret`, `trace`, `roundtrip` + `health`.
  No arbitrary execution, filesystem, shell, or outbound network; structured errors; resource
  limits. See [`public/ai/tools/tools.md`](public/ai/tools/tools.md) and
  [`public/ai/tools/openapi.json`](public/ai/tools/openapi.json).

## Stack

Vite 6 · React 18 · TypeScript · Tailwind v4 · GSAP. Deployed on Cloudflare Pages (advanced mode,
single `_worker.js`).

## Develop

```bash
npm install
npm run dev          # http://localhost:5180
npm run build        # vite build + bundles the edge worker into dist/_worker.js
npm run test:worker  # smoke-tests the bundled worker (incl. resource-limit guards)
```

## ⚠️ Build dependency on a local EML checkout

The browser-safe `@eml/*` packages are resolved **run-from-source** from a local checkout of the
EML monorepo (single source of truth). The path is currently hard-coded in
[`vite.config.ts`](vite.config.ts) and [`scripts/build-worker.mjs`](scripts/build-worker.mjs) as
`D:/Ai/work together/EML`. To build elsewhere, clone the
[EML repo](https://github.com/kakon77777-commits/efficientnewlanguage) and update those two paths
(or publish/vendor the `@eml/*` packages). The packages are zero-dependency, browser-safe TypeScript,
so they bundle cleanly at build time.

## Deploy

```bash
npm run build
npx wrangler pages deploy dist --project-name=neokpolaris --branch=main --commit-dirty=true
```

## License

[Apache-2.0](LICENSE) — © 2026 EveMissLab / Neo.K. See [`NOTICE`](NOTICE). EML aspects are covered by
Taiwan Utility Model M672933 (Taiwan only); Apache-2.0 includes a patent grant.
