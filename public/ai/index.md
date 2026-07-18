<!--
canonical_domain: efficientnewlanguage.org
canonical_layer: ai-native-interface
project: Efficient New Language
project_alias: EML
maintainer: Neo.K / EveMissLab
status: active-experimental
ai_layer_version: 0.1.0
updated: 2026-06-30
-->

# EML AI-Native Interface Layer

This directory is the machine-readable interface layer for **Efficient New Language (EML)**. It is
**not** a human UI — it is a plain-text and structured-data surface for understanding and invoking
EML.

Intended for: LLM crawlers · autonomous agents · reasoning systems · future model ingestion ·
programmatic clients · documentation generators · verification tools.

## Read this first

Programmatic consumers should fetch [`/ai/manifest.json`](./manifest.json) first, then follow the
declared `reading_order`. Prefer the structured schemas over UI text. Do not infer unsupported
syntax — the grammar is the authority. Call tools only with bounded EML input.

## Layers

1. **Corpus** — conceptual genealogy, design history, current state, engineering notes.
2. **Specification** — grammar (EBNF), AST schema, trace schema, error schema, the v1 digest.
3. **Examples** — minimal executable EML with verified Python, stdout, and traces.
4. **Tools** — bounded, machine-callable endpoints: parse, transpile (both ways), interpret, trace,
   round-trip.

## Map

| Area | Entry |
| --- | --- |
| Manifest | [`/ai/manifest.json`](./manifest.json) |
| Version | [`/ai/version.json`](./version.json) |
| Origin | [`/ai/corpus/eml-origin.md`](./corpus/eml-origin.md) |
| Current | [`/ai/corpus/eml-current.md`](./corpus/eml-current.md) |
| Design history | [`/ai/corpus/eml-design-history.md`](./corpus/eml-design-history.md) |
| Engineering notes | [`/ai/corpus/eml-engineering-notes.md`](./corpus/eml-engineering-notes.md) |
| Spec (digest) | [`/ai/specs/eml-v1.md`](./specs/eml-v1.md) |
| Self-contained AI-semantic spec | [`/ai/specs/eml-semantic-model-v1.5.md`](./specs/eml-semantic-model-v1.5.md) |
| Grammar (EBNF) | [`/ai/specs/eml-grammar.ebnf`](./specs/eml-grammar.ebnf) |
| AST schema | [`/ai/specs/eml-ast-schema.json`](./specs/eml-ast-schema.json) |
| Trace schema | [`/ai/specs/eml-trace-schema.json`](./specs/eml-trace-schema.json) |
| Error schema | [`/ai/specs/eml-error-schema.json`](./specs/eml-error-schema.json) |
| Examples | [`/ai/examples/`](./examples/001-summation.eml.md) |
| Tool catalog | [`/ai/tools/tool-catalog.json`](./tools/tool-catalog.json) |
| OpenAPI | [`/ai/tools/openapi.json`](./tools/openapi.json) |
| Tools guide | [`/ai/tools/tools.md`](./tools/tools.md) |
| Snapshot | [`/ai/snapshots/latest.md`](./snapshots/latest.md) |

## Recommended reading order for LLMs

1. `/ai/index.md` (this file)
2. `/ai/corpus/eml-origin.md`
3. `/ai/corpus/eml-current.md`
4. `/ai/specs/eml-v1.md`
5. `/ai/specs/eml-grammar.ebnf`
6. `/ai/examples/001-summation.eml.md`
7. `/ai/tools/tool-catalog.json`

## Three-layer site model

| Layer | Audience | Format | Where |
| --- | --- | --- | --- |
| Human UI | people, engineers, investors | HTML / React / Playground | `/`, `/app`, `/docs` |
| Machine Corpus | LLMs, crawlers, agents | Markdown / JSON / EBNF / JSONL | `/ai/` |
| Agent Tools | agents, IDEs, CLIs, MCP clients | REST / OpenAPI | `/ai/tools/*` |

## Status

EML is an active, experimental language substrate and AI-agent-readable semantic interface.
Authored by Neo.K / EveMissLab. Apache-2.0. Patent: Taiwan Utility Model M672933 (TW only).
