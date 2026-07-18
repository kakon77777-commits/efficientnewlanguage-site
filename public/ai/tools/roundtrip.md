<!-- canonical: efficientnewlanguage.org/ai/tools/roundtrip | ai_layer_version: 0.1.0 -->

# eml.roundtrip — `POST /ai/tools/roundtrip`

Run `EML → Python → EML → Python` and report whether a **byte-identical fixpoint** is reached
(`python1 == python2`). This is the strongest validation that "the transpiler actually transpiles".

## Request

```json
{ "source": "N^+100\nΣ(i^2, i in [1:N]) => r\nr^0" }
```

## Result (`result`)

| Field | Type | Notes |
| --- | --- | --- |
| `ok` | boolean | true when the fixpoint is reached |
| `steps` | object | intermediate artifacts (`python1`, `eml2`, `python2`, …) |
| `message` | string | human-readable outcome |

## Examples

- **Fixpoint** — `{"source":"N^+100\nΣ(i^2, i in [1:N]) => r\nr^0"}` → `result.ok: true`,
  `message: "round-trip fixpoint reached (python1 == python2)"`.
- **Forward-only** — a program using `@hot`, `@temporal_loop`, or `async`/`await` returns
  `result.ok: false` with a message naming the inexpressible construct. **This is expected**, not a
  failure of the tool: those constructs are forward-only by design (spec §10). Plain `def`,
  `@cold`, `class`, and matrices round-trip normally.

The top-level envelope `ok` mirrors `result.ok`.
