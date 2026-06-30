<!-- canonical: efficientnewlanguage.org/ai/tools/transpile-python | ai_layer_version: 0.1.0 -->

# eml.transpile_python — `POST /ai/tools/transpile-python`

Deterministically transpile EML source into Python (no LLM). Never throws: lex/parse failures come
back as diagnostics.

## Request

```json
{ "source": "N^+100\nΣ(i^2, i in [1:N]) => r\nr^0" }
```

## Result (`result`)

| Field | Type | Notes |
| --- | --- | --- |
| `python` | string | formatted Python (imports prepended) |
| `imports` | string[] | collected imports, e.g. `["import functools"]` |
| `metadata` | object | `symbolsUsed`, `declaredNames`, `emlLines`, `pythonLines` |

## Example

Request `{"source":"N^+100\nΣ(i^2, i in [1:N]) => r\nr^0"}` →

```json
{
  "ok": true,
  "tool": "eml.transpile_python",
  "result": {
    "python": "N = 100\nr = sum(i**2 for i in range(1, N+1))\nprint(r)\n",
    "imports": [],
    "metadata": { "symbolsUsed": ["^+", "Σ", "∈", "[:]", "=>", "^0"], "declaredNames": ["N", "r"], "emlLines": 3, "pythonLines": 3 }
  },
  "warnings": [],
  "errors": []
}
```

`@cold` programs add `"import functools"` to `imports` and emit `@functools.cache`.

## Errors

Error-severity diagnostics set `ok:false` and populate `errors`; warnings (e.g.
`W_COLD_SIDE_EFFECT`) populate `warnings` without blocking.
