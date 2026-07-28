<!-- canonical: efficientnewlanguage.org/ai/examples/131-dot-product-sigma | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 131 — Dot product (Σ)

`dot_product_sigma.eml` computes vector dot products as a summation over paired list positions.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Dot product
# as a summation over paired list positions:
#
#   Sigma(a[i] * b[i], i in [0:n-1])
#
# This is the summand shape the corpus had no example of: the operator
# indexing TWO collections at once. The other summation cases sum a
# function of the index itself; here the index is a cursor into data.
#
# Three properties are checked, each of which fails differently if the
# summation is wrong:
#
#   orthogonality   perpendicular vectors must give exactly 0 - a specific
#                   number a broken implementation is unlikely to produce
#                   by accident
#   self-product    a . a must equal the sum of squares, so the same data
#                   is summed two different ways and compared
#   commutativity   a . b must equal b . a
#
# None of these needs an external reference value, which is what makes
# them usable as checks rather than as decoration.

def dot(a, b):
    len(a) => n
    Σ(a[i] * b[i], i in [0:n - 1]) => total
    return total

def sum_of_squares(a):
    len(a) => n
    Σ(a[i]^2, i in [0:n - 1]) => total
    return total

pairs^+[[[1, 2, 3], [4, 5, 6]],
        [[1, 0], [0, 1]],
        [[3, 4], [4, 0 - 3]],
        [[2, 2, 2], [1, 1, 1]],
        [[0, 0, 0], [7, 8, 9]]]

notes^+["ordinary vectors: 4 + 10 + 18",
        "unit axes: perpendicular, so 0",
        "perpendicular pair: 12 - 12 = 0",
        "scaled ones: 2 + 2 + 2",
        "zero vector annihilates"]

"Dot products:" => header
header^0
0 => i
while i < len(pairs):
    pairs[i] => pair
    pair[0] => a
    pair[1] => b
    dot(a, b) => value
    "  " + str(a) + " . " + str(b) + " = " + str(value) + "   (" + notes[i] + ")" => line
    line^0
    i + 1 => i

"" => blank1
blank1^0
"Self-product must equal the sum of squares:" => header2
header2^0
0 => self_ok
vectors^+[[1, 2, 3], [3, 4], [0, 0, 0], [5]]
for v in vectors:
    dot(v, v) => d
    sum_of_squares(v) => s
    if d == s:
        self_ok + 1 => self_ok
        "  " + str(v) + ": " + str(d) + " both ways" => line
    else:
        "  " + str(v) + ": " + str(d) + " vs " + str(s) + " MISMATCH" => line
    line^0

"" => blank2
blank2^0
"Commutativity, a.b == b.a:" => header3
header3^0
0 => comm_ok
0 => j
while j < len(pairs):
    pairs[j] => pair
    dot(pair[0], pair[1]) => forward
    dot(pair[1], pair[0]) => backward
    if forward == backward:
        comm_ok + 1 => comm_ok
    j + 1 => j
"  " + str(comm_ok) + " of " + str(len(pairs)) + " pairs commute" => comm_line
comm_line^0
"  " + str(self_ok) + " of " + str(len(vectors)) + " self-products match the sum of squares" => self_line
self_line^0
```

## Python (deterministic transpilation)

```python
def dot(a, b):
    n = len(a)
    total = sum(a[i] * b[i] for i in range(0, n))
    return total

def sum_of_squares(a):
    n = len(a)
    total = sum(a[i]**2 for i in range(0, n))
    return total

pairs = [[[1, 2, 3], [4, 5, 6]], [[1, 0], [0, 1]], [[3, 4], [4, 0 - 3]], [[2, 2, 2], [1, 1, 1]], [[0, 0, 0], [7, 8, 9]]]
notes = ["ordinary vectors: 4 + 10 + 18", "unit axes: perpendicular, so 0", "perpendicular pair: 12 - 12 = 0", "scaled ones: 2 + 2 + 2", "zero vector annihilates"]
header = "Dot products:"
print(header)
i = 0
while i < len(pairs):
    pair = pairs[i]
    a = pair[0]
    b = pair[1]
    value = dot(a, b)
    line = "  " + str(a) + " . " + str(b) + " = " + str(value) + "   (" + notes[i] + ")"
    print(line)
    i = i + 1
blank1 = ""
print(blank1)
header2 = "Self-product must equal the sum of squares:"
print(header2)
self_ok = 0
vectors = [[1, 2, 3], [3, 4], [0, 0, 0], [5]]
for v in vectors:
    d = dot(v, v)
    s = sum_of_squares(v)
    if d == s:
        self_ok = self_ok + 1
        line = "  " + str(v) + ": " + str(d) + " both ways"
    else:
        line = "  " + str(v) + ": " + str(d) + " vs " + str(s) + " MISMATCH"
    print(line)
blank2 = ""
print(blank2)
header3 = "Commutativity, a.b == b.a:"
print(header3)
comm_ok = 0
j = 0
while j < len(pairs):
    pair = pairs[j]
    forward = dot(pair[0], pair[1])
    backward = dot(pair[1], pair[0])
    if forward == backward:
        comm_ok = comm_ok + 1
    j = j + 1
comm_line = "  " + str(comm_ok) + " of " + str(len(pairs)) + " pairs commute"
print(comm_line)
self_line = "  " + str(self_ok) + " of " + str(len(vectors)) + " self-products match the sum of squares"
print(self_line)
```

## stdout (executed)

```text
Dot products:
  [1, 2, 3] . [4, 5, 6] = 32   (ordinary vectors: 4 + 10 + 18)
  [1, 0] . [0, 1] = 0   (unit axes: perpendicular, so 0)
  [3, 4] . [4, -3] = 0   (perpendicular pair: 12 - 12 = 0)
  [2, 2, 2] . [1, 1, 1] = 6   (scaled ones: 2 + 2 + 2)
  [0, 0, 0] . [7, 8, 9] = 0   (zero vector annihilates)

Self-product must equal the sum of squares:
  [1, 2, 3]: 14 both ways
  [3, 4]: 25 both ways
  [0, 0, 0]: 0 both ways
  [5]: 25 both ways

Commutativity, a.b == b.a:
  5 of 5 pairs commute
  4 of 4 self-products match the sum of squares
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:sum · eml:return · eml:run:done
