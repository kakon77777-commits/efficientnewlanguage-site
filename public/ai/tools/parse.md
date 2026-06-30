<!-- canonical: efficientnewlanguage.org/ai/tools/parse | ai_layer_version: 0.1.0 -->

# eml.parse — `POST /ai/tools/parse`

Parse EML source into the normalized AST. See [`eml-ast-schema.json`](../specs/eml-ast-schema.json).

## Request

```json
{ "source": "N^+100\nΣ(i^2, i in [1:N]) => r\nr^0" }
```

`source`: required string, ≤ 20000 chars.

## Result (`result`)

| Field | Type | Notes |
| --- | --- | --- |
| `ast` | `Program` | normalized AST (discriminant `type`) |
| `normalized` | string | ASCII-canonical source after Unicode normalization |
| `tokenCount` | integer | number of lexed tokens |

## Example response (abridged)

```json
{
  "ok": true,
  "tool": "eml.parse",
  "version": { "eml_lang": "EML-LANG-2026-v1.0", "eml_impl": "0.1.0", "ai_layer_version": "0.1.0", "tool_version": "0.1.0" },
  "input_hash": "sha256:…",
  "result": {
    "normalized": "N^+100\nΣ(i^2, i in [1:N]) => r\nr^0",
    "ast": { "type": "Program", "body": [ { "type": "Assignment", "target": { "type": "Identifier", "name": "N" }, "value": { "type": "NumberLiteral", "raw": "100", "value": 100 }, "declares": true } ] }
  },
  "warnings": [],
  "errors": [],
  "trace_id": "eml-trace-…"
}
```

## Errors

Lexer/parser failures appear in `errors` with stable codes (`E_LEX`, `E_PARSE`, …) and a
`position`; `ok` becomes `false`. The request still returns `200` (it was well-formed). See
[`eml-error-schema.json`](../specs/eml-error-schema.json).
