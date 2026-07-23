<!-- canonical: efficientnewlanguage.org/ai/examples/057-pascals-triangle | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 057 — Pascal's triangle

`pascals_triangle.eml` generates the first 8 rows of Pascal's triangle, each row built from the previous one.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Generates the
# first 8 rows of Pascal's triangle — each row built from the previous one
# via a manual scan and list growth via `+` (no `.append()`, not modeled).

def next_row(previous):
    row^+[1]
    len(previous) => n
    for i in [1 : n - 1]:
        previous[i - 1] + previous[i] => value
        row + [value] => row
    row + [1] => row
    return row

triangle^+[[1]]
7 => rows_to_add
for step in [1 : rows_to_add]:
    triangle[len(triangle) - 1] => last_row
    next_row(last_row) => new_row
    triangle + [new_row] => triangle

for row in triangle:
    str(row) => line
    line^0
```

## Python (deterministic transpilation)

```python
def next_row(previous):
    row = [1]
    n = len(previous)
    for i in range(1, n):
        value = previous[i - 1] + previous[i]
        row = row + [value]
    row = row + [1]
    return row

triangle = [[1]]
rows_to_add = 7
for step in range(1, rows_to_add+1):
    last_row = triangle[len(triangle) - 1]
    new_row = next_row(last_row)
    triangle = triangle + [new_row]
for row in triangle:
    line = str(row)
    print(line)
```

## stdout (executed)

```text
[1]
[1, 1]
[1, 2, 1]
[1, 3, 3, 1]
[1, 4, 6, 4, 1]
[1, 5, 10, 10, 5, 1]
[1, 6, 15, 20, 15, 6, 1]
[1, 7, 21, 35, 35, 21, 7, 1]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
