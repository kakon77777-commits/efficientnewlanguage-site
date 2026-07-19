<!-- canonical: efficientnewlanguage.org/ai/examples/029-matrix-transpose-manual | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 029 — Matrix transpose (manual)

`matrix_transpose_manual.eml` transposes a small 2x3 matrix, represented as a plain list of lists, via nested loops and manual index bookkeeping — one of a seven-case self-authored batch of list/collection utilities for the EML case corpus (see [`examples/list-statistics/`](../list-statistics/), [`examples/duplicate-remover/`](../duplicate-remover/), [`examples/list-rotator/`](../list-rotator/), [`examples/intersection-union-finder/`](../intersection-union-finder/), [`examples/second-largest-finder/`](../second-largest-finder/), and [`examples/shopping-cart-total/`](../shopping-cart-total/) for the other six).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Transposes a
# small 2x3 matrix (a plain Python-style list of lists, not EML's `<M>`/`^T`
# matrix overlay) via nested loops and manual index bookkeeping: the outer
# loop walks destination rows (source columns), the inner loop walks source
# rows, and each destination row is built with list growth via `+` (no
# `.append()`). Loop bounds use EML's native `[a:b]` counted-range literal
# rather than a `range(...)` call, so the program stays round-trip stable.

matrix^+[[2, 7, 1], [9, 4, 6]]

len(matrix) => rows
len(matrix[0]) => cols

transposed^+[]
for j in [0:cols - 1]:
    new_row^+[]
    for i in [0:rows - 1]:
        new_row + [matrix[i][j]] => new_row
    transposed + [new_row] => transposed

"Original matrix:"^0
for row in matrix:
    row^0

"Transposed matrix:"^0
for row in transposed:
    row^0
```

## Python (deterministic transpilation)

```python
matrix = [[2, 7, 1], [9, 4, 6]]
rows = len(matrix)
cols = len(matrix[0])
transposed = []
for j in range(0, cols):
    new_row = []
    for i in range(0, rows):
        new_row = new_row + [matrix[i][j]]
    transposed = transposed + [new_row]
print("Original matrix:")
for row in matrix:
    print(row)
print("Transposed matrix:")
for row in transposed:
    print(row)
```

## stdout (executed)

```text
Original matrix:
[2, 7, 1]
[9, 4, 6]
Transposed matrix:
[2, 9]
[7, 4]
[1, 6]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
