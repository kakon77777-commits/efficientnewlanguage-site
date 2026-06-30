<!-- canonical: efficientnewlanguage.org/ai/changelog/ | ai_layer_version: 0.1.0 | updated: 2026-06-30 -->

# EML AI-Native Interface Layer — Changelog

Additive changes (new symbols, event types, diagnostics, tools, corpus) are **minor**. Changing an
existing symbol/overlay/expansion/diagnostic meaning, or breaking the round-trip invariant, is
**major** (see [`/ai/specs/eml-v1.md`](../specs/eml-v1.md) §12).

## 0.1.0 — 2026-06-30

Initial public release of the AI-Native Interface Layer.

- **Corpus** — origin, current, design-history, engineering-notes.
- **Specs** — v1.0 digest, normative EBNF grammar, AST / trace (phosphor-jsonl-v1) / error JSON Schemas.
- **Examples** — 6 executable programs with toolchain-verified Python, stdout, round-trip, and traces.
- **Tools (live, bounded)** — `parse`, `transpile-python`, `transpile-eml`, `interpret`, `trace`,
  `roundtrip` + `health`, running the real EML toolchain at the edge. Static resource limits
  (`max_source_length`, `max_nesting_depth`, `max_exponent`, `max_eval_steps`); no arbitrary
  execution, filesystem, shell, or outbound network.
- **Discovery** — `/llms.txt`, `sitemap.xml`, AI-crawler-friendly `robots.txt`, `manifest.json`,
  `version.json`.

Tracks language spec `EML-LANG-2026-v1.0` and reference implementation `eml_impl 0.1.0`.
