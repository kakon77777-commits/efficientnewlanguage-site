<!-- canonical: efficientnewlanguage.org/ai/examples/104-spiral-matrix-traversal | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 104 — Spiral matrix traversal

`spiral_matrix_traversal.eml` reads a matrix in a clockwise inward spiral, e.g. the 3x4 grid `1..12` comes out as `[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Reads a
# matrix in a clockwise inward spiral by tracking four shrinking
# boundaries — top, bottom, left, right — and peeling off one edge at a
# time. The corpus's third 2D-matrix case, after
# examples/matrix-transpose-manual/ and examples/matrix-multiplication/,
# and the first whose difficulty is entirely in the traversal ORDER rather
# than the arithmetic.
#
# The two `if` guards before the bottom row and left column are the part
# that is easy to get wrong: without them, a single remaining row would be
# emitted twice — once left-to-right on the way in, then again
# right-to-left as a "bottom row" that is the same row. The 1xN and Nx1
# samples below exist to catch exactly that.

def spiral_order(matrix):
    len(matrix) => rows
    len(matrix[0]) => cols
    out^+[]
    0 => top
    rows - 1 => bottom
    0 => left
    cols - 1 => right
    while top <= bottom and left <= right:
        left => c
        while c <= right:
            out + [matrix[top][c]] => out
            c + 1 => c
        top + 1 => top
        top => r
        while r <= bottom:
            out + [matrix[r][right]] => out
            r + 1 => r
        right - 1 => right
        if top <= bottom:
            right => c
            while c >= left:
                out + [matrix[bottom][c]] => out
                c - 1 => c
            bottom - 1 => bottom
        if left <= right:
            bottom => r
            while r >= top:
                out + [matrix[r][left]] => out
                r - 1 => r
            left + 1 => left
    return out

grid^+[[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
spiral_order(grid) => order
"3x4 grid " + str(grid) => msg1
msg1^0
"spiral -> " + str(order) => msg2
msg2^0

square^+[[1, 2, 3], [4, 5, 6], [7, 8, 9]]
spiral_order(square) => square_order
"3x3 spiral -> " + str(square_order) => msg3
msg3^0

single_row^+[[1, 2, 3, 4, 5]]
spiral_order(single_row) => row_order
"1x5 spiral -> " + str(row_order) => msg4
msg4^0

single_col^+[[1], [2], [3]]
spiral_order(single_col) => col_order
"3x1 spiral -> " + str(col_order) => msg5
msg5^0
```

## Python (deterministic transpilation)

```python
def spiral_order(matrix):
    rows = len(matrix)
    cols = len(matrix[0])
    out = []
    top = 0
    bottom = rows - 1
    left = 0
    right = cols - 1
    while top <= bottom and left <= right:
        c = left
        while c <= right:
            out = out + [matrix[top][c]]
            c = c + 1
        top = top + 1
        r = top
        while r <= bottom:
            out = out + [matrix[r][right]]
            r = r + 1
        right = right - 1
        if top <= bottom:
            c = right
            while c >= left:
                out = out + [matrix[bottom][c]]
                c = c - 1
            bottom = bottom - 1
        if left <= right:
            r = bottom
            while r >= top:
                out = out + [matrix[r][left]]
                r = r - 1
            left = left + 1
    return out

grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
order = spiral_order(grid)
msg1 = "3x4 grid " + str(grid)
print(msg1)
msg2 = "spiral -> " + str(order)
print(msg2)
square = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
square_order = spiral_order(square)
msg3 = "3x3 spiral -> " + str(square_order)
print(msg3)
single_row = [[1, 2, 3, 4, 5]]
row_order = spiral_order(single_row)
msg4 = "1x5 spiral -> " + str(row_order)
print(msg4)
single_col = [[1], [2], [3]]
col_order = spiral_order(single_col)
msg5 = "3x1 spiral -> " + str(col_order)
print(msg5)
```

## stdout (executed)

```text
3x4 grid [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12]]
spiral -> [1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]
3x3 spiral -> [1, 2, 3, 6, 9, 8, 7, 4, 5]
1x5 spiral -> [1, 2, 3, 4, 5]
3x1 spiral -> [1, 2, 3]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
