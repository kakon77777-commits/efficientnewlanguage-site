<!--
canonical_domain: efficientnewlanguage.org
canonical_layer: ai-native-interface
project: Efficient New Language
project_alias: EML
document: corpus/eml-design-history
maintainer: Neo.K / EveMissLab
status: active-experimental
ai_layer_version: 0.1.0
updated: 2026-06-30
-->

# EML Design History

How EML evolved from an idea into a test-gated toolchain and, now, a machine-callable interface.
Each stage shipped real behavior. See also [`eml-current.md`](./eml-current.md) and
[`eml-engineering-notes.md`](./eml-engineering-notes.md).

## Stage 0 — Conceptual language

EML existed as an idea: a high-density semantic notation for programming intent. The decision
that shaped everything after: **ASCII canonical form is normative**, Unicode (`Σ`, `∈`, `⇒`, `²`)
is an *informative projection* the lexer normalizes away before tokenizing.

## Stage 1 — Symbolic syntax

A small, stable set of overlays was drafted: `^+` (init/add-assign), `^-` `^*` `^/`, `^0`
(output), `=>` (bind), `?:` (conditional), `Σ` (summation), `[a:b]` (inclusive range), `∈`/`in`
(membership), `<M>`/`^T` (matrix), `def`, `@cold`/`@hot`. The canonical table lives in
`eml-symbols.json` and is frozen by v1.0.

## Stage 2 — Parser and AST

The language became parseable: `normalize → lex → parse` into a **normalized AST**. A two-stage
design separates syntax from meaning — the parser emits `OverlayAssign` nodes; the semantic
analyzer resolves each into a declare (`=`) or augment (`+=`) using a per-program symbol table
(the two-stage `^+` rule).

## Stage 3 — Transpilation

EML mapped deterministically into Python, and a deterministic reverse path (Python subset → EML)
was added with a **round-trip fixpoint** validator: `Python → EML → Python` is byte-identical for
the supported subset. The reverse path **fails loudly** on inexpressible constructs rather than
guessing.

## Stage 4 — Browser execution & observability

An execution-truth **interpreter** (`@eml/interp`) made EML runnable in the browser with no Python
runtime, computing exactly what CPython would (gated by an `interp ≡ python` test). It emits a
**`phosphor-jsonl-v1`** trace as it runs — a frozen compatibility wire-format id; EML has no
runtime or theoretical dependency on any external project. Cold/hot temperature, crystallization,
`@temporal_loop`, loop classification, and a 5-level bug classifier were layered on — and a C++20
prototype proved the *same resolved AST* can target a second back end.

## Stage 5 — Frozen v1.0 surface

`EML-LANG-2026-v1.0` froze the normative surface: the symbol catalog, overlay semantics + Python
expansions, the two-stage `^+` rule, the `phosphor-jsonl-v1` envelope and event vocabulary, the
diagnostic codes, and the round-trip guarantee. Additive changes are minor; changing an existing
meaning or breaking round-trip is a major version bump.

## Stage 6 — AI-Native Interface Layer

The current stage (this `/ai/` directory). The new-version site upgraded from static text to a
React/Vite app whose meaning lives inside JavaScript and runtime behavior — which *reduced* static
semantic exposure to crawlers and agents. The AI-Native Interface Layer restores and extends it:
a public, non-visual, versioned, machine-readable surface (corpus + specs + examples + schemas)
**plus** bounded, machine-callable tools (`parse`, `transpile-python`, `transpile-eml`,
`interpret`, `trace`, `roundtrip`). Engineering completeness does not regress; semantic
readability is re-released and becomes an agent-callable interface.
