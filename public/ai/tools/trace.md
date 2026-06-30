<!-- canonical: efficientnewlanguage.org/ai/tools/trace | ai_layer_version: 0.1.0 -->

# eml.trace — `POST /ai/tools/trace`

Run EML and return a **phosphor-jsonl-v1** trace (one JSON event per line), plus a summary and any
anomalies. See [`eml-trace-schema.json`](../specs/eml-trace-schema.json).

## Request

```json
{ "source": "N^+100\nΣ(i^2, i in [1:N]) => r\nr^0" }
```

## Result (`result`)

| Field | Type | Notes |
| --- | --- | --- |
| `jsonl` | string | the trace as NDJSON (one event per line) |
| `summary` | object | `{ total, byType, anomalies }` |
| `anomalies` | PhosphorEvent[] | events flagged by `findAnomalies` (empty when clean) |
| `eventCount` | integer | total events |

## Example (`result.summary`)

```json
{ "total": 6, "byType": { "eml:run:start": 1, "eml:assign": 2, "eml:sum": 1, "eml:output": 1, "eml:run:done": 1 }, "anomalies": 0 }
```

The `jsonl` field for this program is the six-line trace shown in
[`/ai/examples/001-summation.eml.md`](../examples/001-summation.eml.md).

## Anomalies

An anomaly is any event with `ok === false`, a `:error`/`:fail` type, or a non-zero `code`. A clean
run reports `anomalies: 0`.
