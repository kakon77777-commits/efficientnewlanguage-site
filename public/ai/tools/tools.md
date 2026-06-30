<!-- canonical: efficientnewlanguage.org/ai/tools/ | ai_layer_version: 0.1.0 | updated: 2026-06-30 -->

# EML Agent Tool Layer

Bounded, machine-callable tools that run the **real** EML toolchain (the same browser-safe packages
that power the public playground), bundled into the site's edge worker. Machine-readable catalog:
[`tool-catalog.json`](./tool-catalog.json). OpenAPI 3.1: [`openapi.json`](./openapi.json).

## Contract

- **Request:** `POST application/json` with body `{ "source": "<EML or Python>", "options"?: {} }`.
  `GET /ai/tools/health` for liveness + version + limits. (The canonical machine version record is the static [`/ai/version.json`](../version.json).)
- **Response envelope:** `{ ok, tool, version, input_hash, result, warnings, errors, trace_id }`.
- **Status:** `200` for well-formed requests — *even when `ok:false`* because the EML had compile/
  runtime diagnostics (read the body). Request-level problems use `400` / `405` / `413` / `404` /
  `500`. Error format: [`/ai/specs/eml-error-schema.json`](../specs/eml-error-schema.json).
- **CORS:** `Access-Control-Allow-Origin: *` (GET, POST, OPTIONS).

## Safety limits (bounded tools)

| Limit | Value |
| --- | --- |
| `max_source_length` | 20000 chars (else `413 E_PAYLOAD_TOO_LARGE`) |
| `max_nesting_depth` | 256 (else `E_RESOURCE_LIMIT`) |
| `max_exponent` | 4096 (largest literal power exponent) |
| `max_eval_steps` | 2,000,000 (interpreter step budget) |
| arbitrary code execution | **no** |
| filesystem / shell / outbound network | **no** |
| LLM in the transpile/interpret core | **no** (deterministic) |

Integer arithmetic is exact (arbitrary-precision), so `interpret` / `trace` statically reject
programs whose computed integer magnitude, range span, or nesting would exceed the sandbox —
returning `E_RESOURCE_LIMIT` (HTTP 200, `ok:false`) **before** evaluating. The deterministic
toolchain has no wall-clock timeout; cost is bounded structurally by these limits.

The interpreter never executes `numpy` / temporal-async programs — it records `eml:unsupported`
and stops cleanly (real Python is the target for those).

## Endpoints

| Tool | Method | Path | Purpose |
| --- | --- | --- | --- |
| `eml.parse` | POST | [`/ai/tools/parse`](./parse.md) | EML → normalized AST |
| `eml.transpile_python` | POST | [`/ai/tools/transpile-python`](./transpile-python.md) | EML → Python |
| `eml.transpile_eml` | POST | [`/ai/tools/transpile-eml`](./transpile-eml.md) | Python (subset) → EML |
| `eml.interpret` | POST | [`/ai/tools/interpret`](./interpret.md) | run EML → stdout |
| `eml.trace` | POST | [`/ai/tools/trace`](./trace.md) | run EML → phosphor-jsonl-v1 |
| `eml.roundtrip` | POST | [`/ai/tools/roundtrip`](./roundtrip.md) | EML→Py→EML→Py fixpoint |
| `eml.health` | GET | `/ai/tools/health` | liveness + version + limits |

## Quick start

```bash
curl -s https://efficientnewlanguage.org/ai/tools/transpile-python \
  -H 'content-type: application/json' \
  -d '{"source":"N^+100\nΣ(i^2, i in [1:N]) => r\nr^0"}'
```

Recommended agent behavior: read [`/ai/manifest.json`](../manifest.json) first, prefer the
structured schemas over UI text, call tools only with bounded EML input, and do not infer
unsupported syntax (the grammar in [`/ai/specs/eml-grammar.ebnf`](../specs/eml-grammar.ebnf) is the
authority).
