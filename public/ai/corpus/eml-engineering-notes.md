<!--
canonical_domain: efficientnewlanguage.org
canonical_layer: ai-native-interface
project: Efficient New Language
project_alias: EML
document: corpus/eml-engineering-notes
maintainer: Neo.K / EveMissLab
status: active-experimental
ai_layer_version: 0.1.0
updated: 2026-06-30
-->

# EML Engineering Notes

Design decisions an agent should rely on when reasoning about or generating EML. These are
behavioral facts of the reference implementation, aligned with `EML-LANG-2026-v1.0`.

## Invariants (do not violate)

1. **No LLM in the core transpilation chain.** `EML → Python` is rule-based and reproducible.
   The AI-assisted compression of arbitrary Python is a separate, lossy, validator-gated,
   suggestion-only layer — never part of the deterministic core.
2. **Determinism.** Same input → same tokens, AST, Python, and trace (modulo trace timestamps).
3. **Round-trip fixpoint** for the supported statement subset: `Python → EML → Python` is
   byte-identical. The reverse path fails loudly; it does not guess.
4. **Execution truth.** The interpreter's stdout is *gated* to equal CPython's
   (`tests/interp.test.ts`); `eml trace --run` bakes the equivalence in as an `eml:equiv` event.

## Canonical vs. display form

- **ASCII canonical is normative.** Every program has an ASCII form; the lexer normalizes Unicode
  (`Σ`, `∈`, `⇒`, `²`, `⟨M⟩`) to ASCII *before* tokenizing. Generate ASCII canonical when in doubt.
- Display form is a UI projection (the EML Workbench / EML Symbol Palette), never required for
  correctness.

## The two-stage `^+` rule

`x^+100` is ambiguous by design and resolved by the per-program symbol table:

- first occurrence of `x` → **declare**: `x = 100`;
- later occurrence → **augment**: `x += 100`.

`^+=` is an *internal* symbol-table tag, **not** writable surface syntax. Augmented assign
(`-=`/`*=`/`/=`) on an undeclared variable warns `W_AUG_UNDECLARED`.

## Forward-only constructs (NOT round-trippable)

`@hot`, `@temporal_loop`, and `async`/`await` are **forward-only**: they transpile EML → Python but
are not part of the round-trip invariant. A roundtrip call on a program containing them will
report a mismatch with a clear reason — this is expected, not a bug. `@hot` is a *permanent*
exception (the forward emitter renders it as a bare comment marker, not a reconstructable
decorator); `@temporal_loop`/`async`/`await` are exceptions because the reverse transpiler does not
support them. Plain function definitions (`def`)/`return`, `@cold`, `class`, and matrices
(`<M>`/`np.array`) round-trip normally — do not assume otherwise. (See the `interpret`/`roundtrip`
examples under `/ai/examples/`.)

## Cold/hot, crystallization, importance

- `@cold` → `@functools.cache` and auto-collects `import functools`. Purity is checked
  **interprocedurally**; an impure `@cold` warns `W_COLD_SIDE_EFFECT` (non-blocking).
- `@hot` → a `# @hot` marker comment (not cached). `@cold`+`@hot` → `W_TEMP_CONFLICT` (cold wins).
- Crystallization keys a function by the structural hash of `(params + body)` (name-independent);
  repeated cold logic is a cache hit. Output Python is unaffected.
- `importance = w1·callFrequency + w2·riskLevel + w3·dependencyDepth`, surfaced in CTS.

## Temporal loops (Phase 3)

`@temporal_loop(max_wait=…, check_interval=…, timeout_action="raise"|"return")` + `async def` +
`await temporal_wait(...)`. Transpilation injects a self-contained asyncio runtime so `eml run`
stays directly executable. The interpreter does **not** execute temporal/async or numpy programs:
it records an `eml:unsupported` event and stops cleanly (the CLI defers those to a real Python run).

## Diagnostics (stable codes)

Errors block transpilation (`ok=false`): `E_LEX`, `E_PARSE`, `E_INTERNAL`, `E_RANGE_NONINT`,
`E_ALIAS_COLLISION`, `E_RETURN_OUTSIDE_FN`, `E_CPP_UNSUPPORTED`. Warnings do not block:
`W_AUG_UNDECLARED`, `W_COLD_SIDE_EFFECT`, `W_TEMP_CONFLICT`, `W_UNKNOWN_DECORATOR`,
`W_FN_REDECLARED`, `W_TEMPORAL_NOT_ASYNC`, `W_TEMPORAL_ARG`, `W_COLD_ASYNC`. **Codes are stable;
messages may improve.** See [`/ai/specs/eml-error-schema.json`](../specs/eml-error-schema.json).

## Observability

All events conform to `phosphor-jsonl-v1` (one JSON object per line) — a frozen compatibility
wire-format id; EML has no runtime or theoretical dependency on any external project. See
[`/ai/specs/eml-trace-schema.json`](../specs/eml-trace-schema.json).

## Build & distribution

TypeScript monorepo; the browser-safe packages run from source (single source of truth). The
live `/ai/tools/*` endpoints bundle exactly those packages (`@eml/parser`,
`@eml/transpiler-python`, `@eml/transpiler-eml`, `@eml/interp`, `@eml/trace`, `@eml/types`) into
the site's Cloudflare Worker — no Node-only APIs, no filesystem, no shell, no network.
