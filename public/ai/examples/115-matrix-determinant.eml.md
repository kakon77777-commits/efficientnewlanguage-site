<!-- canonical: efficientnewlanguage.org/ai/examples/115-matrix-determinant | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 115 — Matrix determinant (cofactor expansion)

`matrix_determinant.eml` computes determinants by expanding along the top row and recursing on each minor, checked against five independently known answers.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Determinant
# by cofactor expansion: expand along the top row, and for each entry
# recurse on the minor left after deleting that entry's row and column,
# alternating sign as you go. The corpus's third hand-rolled matrix case
# after examples/matrix-transpose-manual/ and
# examples/matrix-multiplication/, and the first that is recursive —
# the minor of an NxN matrix is an (N-1)x(N-1) matrix, so the structure
# shrinks with the recursion.
#
# Every matrix below has an independently checkable determinant:
#
#   [[1,2],[3,4]]              -2   by the ad - bc rule directly
#   [[6,1,1],[4,-2,5],[2,8,7]] -306 the standard worked textbook example
#   identity                    1   by definition
#   [[1,2],[2,4]]               0   second row is twice the first (singular)
#   lower triangular            120 product of the diagonal, 2*3*4*5
#
# The triangular matrix is the strongest of these: its answer is fixed by
# a rule that has nothing to do with cofactor expansion, so agreement
# between the two is real evidence rather than the method confirming
# itself.

def minor(matrix, skip_row, skip_col):
    len(matrix) => n
    result^+[]
    0 => r
    while r < n:
        if r != skip_row:
            row^+[]
            0 => c
            while c < n:
                if c != skip_col:
                    row + [matrix[r][c]] => row
                c + 1 => c
            result + [row] => result
        r + 1 => r
    return result

def determinant(matrix):
    len(matrix) => n
    if n == 1:
        return matrix[0][0]
    if n == 2:
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    0 => total
    1 => sign
    0 => col
    while col < n:
        minor(matrix, 0, col) => sub
        determinant(sub) => sub_determinant
        total + sign * matrix[0][col] * sub_determinant => total
        0 - sign => sign
        col + 1 => col
    return total

matrices^+[[[1, 2], [3, 4]],
           [[6, 1, 1], [4, 0 - 2, 5], [2, 8, 7]],
           [[1, 0, 0], [0, 1, 0], [0, 0, 1]],
           [[1, 2], [2, 4]],
           [[2, 0, 0, 0], [1, 3, 0, 0], [4, 5, 4, 0], [6, 7, 8, 5]]]

expected^+[0 - 2, 0 - 306, 1, 0, 120]
labels^+["ad - bc directly",
         "standard textbook example",
         "identity, 1 by definition",
         "singular: row 2 is twice row 1",
         "lower triangular: 2*3*4*5"]

0 => matches
for i in [0:4]:
    matrices[i] => matrix
    determinant(matrix) => value
    expected[i] => known
    if value == known:
        matches + 1 => matches
        "det = " + str(value) + "  (" + labels[i] + ")" => line
    else:
        "det = " + str(value) + "  (EXPECTED " + str(known) + ")" => line
    line^0

str(matches) + " of " + str(len(matrices)) + " match their independently known determinant" => summary
summary^0
```

## Python (deterministic transpilation)

```python
def minor(matrix, skip_row, skip_col):
    n = len(matrix)
    result = []
    r = 0
    while r < n:
        if r != skip_row:
            row = []
            c = 0
            while c < n:
                if c != skip_col:
                    row = row + [matrix[r][c]]
                c = c + 1
            result = result + [row]
        r = r + 1
    return result

def determinant(matrix):
    n = len(matrix)
    if n == 1:
        return matrix[0][0]
    if n == 2:
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0]
    total = 0
    sign = 1
    col = 0
    while col < n:
        sub = minor(matrix, 0, col)
        sub_determinant = determinant(sub)
        total = total + sign * matrix[0][col] * sub_determinant
        sign = 0 - sign
        col = col + 1
    return total

matrices = [[[1, 2], [3, 4]], [[6, 1, 1], [4, 0 - 2, 5], [2, 8, 7]], [[1, 0, 0], [0, 1, 0], [0, 0, 1]], [[1, 2], [2, 4]], [[2, 0, 0, 0], [1, 3, 0, 0], [4, 5, 4, 0], [6, 7, 8, 5]]]
expected = [0 - 2, 0 - 306, 1, 0, 120]
labels = ["ad - bc directly", "standard textbook example", "identity, 1 by definition", "singular: row 2 is twice row 1", "lower triangular: 2*3*4*5"]
matches = 0
for i in range(0, 5):
    matrix = matrices[i]
    value = determinant(matrix)
    known = expected[i]
    if value == known:
        matches = matches + 1
        line = "det = " + str(value) + "  (" + labels[i] + ")"
    else:
        line = "det = " + str(value) + "  (EXPECTED " + str(known) + ")"
    print(line)
summary = str(matches) + " of " + str(len(matrices)) + " match their independently known determinant"
print(summary)
```

## stdout (executed)

```text
det = -2  (ad - bc directly)
det = -306  (standard textbook example)
det = 1  (identity, 1 by definition)
det = 0  (singular: row 2 is twice row 1)
det = 120  (lower triangular: 2*3*4*5)
5 of 5 match their independently known determinant
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
