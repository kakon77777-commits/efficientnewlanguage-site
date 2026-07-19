<!--
canonical_domain: efficientnewlanguage.org
canonical_layer: ai-native-interface
project: Efficient New Language
project_alias: EML
document: corpus/eml-current
maintainer: Neo.K / EveMissLab
status: active-experimental
ai_layer_version: 0.1.0
updated: 2026-07-19
-->

# EML Current Implementation Layer

This document describes the **current** engineering state of EML. The normative language
reference is [`/ai/specs/eml-v1.md`](../specs/eml-v1.md) (digest of `EML-LANG-2026-v1.0`, the
single source of truth). The self-contained AI-semantic spec (status vocabulary, twelve-loop
taxonomy, bug/repair/criticality models) is
[`/ai/specs/eml-semantic-model-v1.5.md`](../specs/eml-semantic-model-v1.5.md). For origin see
[`eml-origin.md`](./eml-origin.md).

## Current definition

> EML is a deterministic **semantic-overlay** layer. It does **not** replace general-purpose
> programming languages. It compresses repeated, high-density program intent into compact
> symbolic forms and maps them — rule-based and reversibly — into executable representations.

The canonical execution target is **Python 3.10+**. A C++20 back end exists as a prototype.

## Implemented components

EML is a TypeScript monorepo. The browser-safe packages are the ones that power both the
public playground and the live tools in this `/ai/` layer:

| Package | Role |
| --- | --- |
| `@eml/types` | AST, CTS, tokens, diagnostics, symbol-table types |
| `@eml/parser` | normalize → lex → parse → AST |
| `@eml/transpiler-python` | semantic analysis + Python emitter + formatter (cold/hot, crystallization, importance, loopKind) |
| `@eml/transpiler-eml` | reverse Python→EML + round-trip fixpoint validators |
| `@eml/transpiler-cpp` | C++20 prototype back end (non-normative) |
| `@eml/interp` | execution-truth interpreter (faithful to CPython, test-gated) + trace producer |
| `@eml/trace` | `phosphor-jsonl-v1` emitter/parser (browser-safe; node sink isolated) |
| `@eml/bug-classifier` | 5-level error classifier (CRITICAL · MAJOR · MINOR · TRIVIAL · COSMETIC) |
| `@eml/cts-generator`, `@eml/symbols`, `@eml/cli`, `@eml/workbench` | CTS, symbol table, the `eml` command, the EML Workbench editor |

Feature surface, by phase (each shipped with tests, not promises):

- **Phase 0 — Py⁺ transpiler.** The hard closed loop: EML → Python, deterministic, golden-tested,
  really executes.
- **Phase 1 — Bidirectional + round-trip.** Deterministic Python → EML inverse with a fixpoint
  validator. AI-assisted compression is suggestion-only and execution-gated (not in the core).
- **Phase 2 — Cold/hot + crystallization.** `@cold` pure logic → `@functools.cache`;
  interprocedural purity analysis; structural AST-hash caching; importance scoring.
- **Phase 3 — Temporal loops + BUG classifier.** `@temporal_loop`: a no-busy-wait asyncio runtime
  with a hard deadline. Errors classify into 5 levels, mapped back to EML source.
- **Phase 4 — loopKind + C⁺⁺⁺.** Static loop-classification metadata; a C++20 prototype from the
  same resolved AST (one overlay → multiple back ends).
- **Phase 5 — Execution truth + trace.** A browser-safe interpreter computes exactly what
  Python would (gated by tests) and emits a `phosphor-jsonl-v1` trace.

The reference test suite enforces these behaviors (300+ cases, including an `interp ≡ python`
stdout-equivalence gate).

## Human interface

The human interface is the public website (`/`), the engineering workbench (`/app`), the docs
(`/docs`), and the in-browser playground. Demos run the **real** toolchain in the browser — no
backend and no local Python required.

## Machine interface

The machine interface is this `/ai/` layer and the bounded tool endpoints under
[`/ai/tools/`](../tools/tools.md):

- Corpus, specs, examples, schemas as plain text / JSON (no UI required).
- Live, bounded tools: `parse`, `transpile-python`, `transpile-eml`, `interpret`, `trace`,
  `roundtrip` — see [`/ai/tools/tool-catalog.json`](../tools/tool-catalog.json) and
  [`/ai/tools/openapi.json`](../tools/openapi.json).
