<!-- canonical: efficientnewlanguage.org/ai/examples/090-matrix-multiplication | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 090 — Matrix multiplication

`matrix_multiplication.eml` multiplies a 2x3 matrix by a 3x2 matrix, producing the 2x2 product `[[58, 64], [139, 154]]`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Multiplies
# two matrices by hand with the standard triple-nested loop over
# lists-of-lists — no numpy, no `<M>`/`^T` matrix overlays (which transpile
# to numpy calls the browser interpreter defers on). Pairs with
# examples/matrix-transpose-manual/ as the corpus's second hand-rolled
# 2D-array case, and is the first to chain two subscripts (`a[i][k]`).

def multiply(a, b):
    len(a) => rows_a
    len(b) => rows_b
    len(b[0]) => cols_b
    result^+[]
    0 => i
    while i < rows_a:
        row^+[]
        0 => j
        while j < cols_b:
            0 => total
            0 => k
            while k < rows_b:
                total + a[i][k] * b[k][j] => total
                k + 1 => k
            row + [total] => row
            j + 1 => j
        result + [row] => result
        i + 1 => i
    return result

matrix_a^+[[1, 2, 3], [4, 5, 6]]
matrix_b^+[[7, 8], [9, 10], [11, 12]]
multiply(matrix_a, matrix_b) => product

"A (2x3): " + str(matrix_a) => msg1
msg1^0
"B (3x2): " + str(matrix_b) => msg2
msg2^0
"A x B (2x2): " + str(product) => msg3
msg3^0
```

## Python (deterministic transpilation)

```python
def multiply(a, b):
    rows_a = len(a)
    rows_b = len(b)
    cols_b = len(b[0])
    result = []
    i = 0
    while i < rows_a:
        row = []
        j = 0
        while j < cols_b:
            total = 0
            k = 0
            while k < rows_b:
                total = total + a[i][k] * b[k][j]
                k = k + 1
            row = row + [total]
            j = j + 1
        result = result + [row]
        i = i + 1
    return result

matrix_a = [[1, 2, 3], [4, 5, 6]]
matrix_b = [[7, 8], [9, 10], [11, 12]]
product = multiply(matrix_a, matrix_b)
msg1 = "A (2x3): " + str(matrix_a)
print(msg1)
msg2 = "B (3x2): " + str(matrix_b)
print(msg2)
msg3 = "A x B (2x2): " + str(product)
print(msg3)
```

## stdout (executed)

```text
A (2x3): [[1, 2, 3], [4, 5, 6]]
B (3x2): [[7, 8], [9, 10], [11, 12]]
A x B (2x2): [[58, 64], [139, 154]]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
