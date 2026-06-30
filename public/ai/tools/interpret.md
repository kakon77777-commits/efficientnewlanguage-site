<!-- canonical: efficientnewlanguage.org/ai/tools/interpret | ai_layer_version: 0.1.0 -->

# eml.interpret — `POST /ai/tools/interpret`

Execute supported EML in a bounded, browser-safe interpreter whose stdout is **gated to equal
CPython's** (test-enforced). No real Python runs; no arbitrary code executes.

## Request

```json
{ "source": "N^+100\nΣ(i^2, i in [1:N]) => r\nr^0" }
```

## Result (`result`)

| Field | Type | Notes |
| --- | --- | --- |
| `output` | string | concatenated stdout (with trailing newline, as `print()` produces) |
| `outputLines` | string[] | stdout split into lines |
| `unsupported` | string[] | constructs that prevented full execution (numpy / temporal) |
| `eventCount` | integer | number of trace events produced |

## Example

Request `{"source":"N^+100\nΣ(i^2, i in [1:N]) => r\nr^0"}` →

```json
{ "ok": true, "tool": "eml.interpret",
  "result": { "output": "338350\n", "outputLines": ["338350"], "unsupported": [], "eventCount": 6 },
  "warnings": [], "errors": [] }
```

## Notes

- Runtime faults (e.g. a Python exception) return `ok:false` with the exception class + message in
  `errors`.
- `numpy` (`<M>`, `^T`) and temporal/async (`@temporal_loop`, `await`) are **deferred**: they appear
  in `unsupported` and the interpreter stops cleanly (use real Python for those).
