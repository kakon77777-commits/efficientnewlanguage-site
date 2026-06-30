<!-- canonical: efficientnewlanguage.org/ai/tools/transpile-eml | ai_layer_version: 0.1.0 -->

# eml.transpile_eml — `POST /ai/tools/transpile-eml`

Reverse transpilation: a **supported subset** of Python back into EML. This is a deterministic
inverse of the Python emitter and **fails loudly** on inexpressible constructs rather than guessing.

> Forward-only constructs are **not** reversible: function definitions, `@cold`/`@hot`,
> `@temporal_loop`, `async`/`await`, and matrices. Reversing them returns `ok:false` with a reason.

## Request

`source` here is **Python**, ≤ 20000 chars.

```json
{ "source": "x = 100\nx += 10\nx *= 2\nprint(x)" }
```

## Result (`result`)

| Field | Type | Notes |
| --- | --- | --- |
| `eml` | string | EML source (empty when `ok:false`) |

## Example

Request `{"source":"x = 100\nx += 10\nx *= 2\nprint(x)"}` → `result.eml`:

```eml
x^+100
x^+10
x^*2
x^0
```

(The supported subset round-trips: re-running `eml.transpile_python` on this EML returns the
original Python — see [`eml.roundtrip`](./roundtrip.md).)

## Errors

On inexpressible Python, `ok:false` and `errors` carries a single entry whose `message` names the
offending construct.
