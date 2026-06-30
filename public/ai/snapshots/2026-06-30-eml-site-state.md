<!-- canonical: efficientnewlanguage.org/ai/snapshots/2026-06-30-eml-site-state | ai_layer_version: 0.1.0 -->

# EML Site State Snapshot — 2026-06-30

A point-in-time snapshot of the EML public site and toolchain for AI consumers.

## Human site

The public site is a React/Vite app: a cinematic landing page (`/`), an engineering workbench
(`/app`) with an in-browser playground, and docs (`/docs`). Demos run the **real** EML toolchain in
the browser — no backend, no local Python.

## Engineering state

The site links to the actual EML parser, Python transpiler, reverse transpiler, execution-truth
interpreter, `phosphor-jsonl-v1` trace, and round-trip validator (TypeScript monorepo, 300+ tests,
Phase 0–5 complete, `EML-LANG-2026-v1.0` frozen surface).

## AI-native state

The `/ai/` layer exposes a machine-readable corpus, specs (grammar, AST/trace/error schemas),
verified examples, and tool declarations — **plus live, bounded tool endpoints** under
`/ai/tools/*` that run the real toolchain at the edge (parse, transpile both ways, interpret,
trace, roundtrip). Inputs are capped at 20000 chars; no arbitrary execution, filesystem, shell, or
outbound network.

## Resolved limitation

Previously, the new-version site moved meaningful content into JavaScript/runtime behavior, reducing
static semantic exposure for crawlers and agents. The AI-Native Interface Layer restores it as a
stable, versioned, non-visual surface and adds an agent-callable tool face.

## Verified facts (this snapshot)

- `N^+100 ; Σ(i^2, i in [1:N]) => r ; r^0` → Python `r = sum(i**2 for i in range(1, N+1))`,
  stdout `338350`, round-trip fixpoint OK.
- Function definitions / `@cold` / `@hot` / `@temporal_loop` / `async` / matrices are forward-only
  (transpile EML→Python but are not round-trippable).

## Next steps

- Phase 4 (optional): expose `/ai/corpus/*` as MCP Resources and the tools as MCP Tools.
- Add more examples and a changelog feed.
