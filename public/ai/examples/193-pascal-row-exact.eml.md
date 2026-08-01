<!-- canonical: efficientnewlanguage.org/ai/examples/193-pascal-row-exact | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 193 — Row 80 of Pascal’s triangle, exactly

`pascal_row_exact.eml` builds row 80 of Pascal's triangle by addition and checks it against three global properties.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Row 80 of
# Pascal's triangle, built by addition and checked against three properties
# that a rounded row cannot satisfy.
#
# The middle of row 80 is C(80, 40) = 107507208733336176461620, a 24-digit
# number - well past the 16 digits a 64-bit float holds exactly. Building the
# row by addition is what makes this a good test: each entry is the sum of two
# above it, so an error introduced anywhere propagates down and sideways, and
# the checks below are all global.
#
#   symmetry     C(n, k) = C(n, n-k) for every k. A rounding error at one
#                position breaks its mirror, so this catches damage that a spot
#                check of the middle would miss.
#
#   row sum      the row sums to exactly 2^n. This is the strongest single
#                check: 2^80 is a specific 25-digit integer, and any lost bit
#                anywhere in the row moves the total off it.
#
#   hockey stick sum of C(i, k) for i = k..n equals C(n+1, k+1). It ties the
#                row to a DIFFERENT row, so a triangle that is internally
#                consistent but globally shifted still fails.
#
# The multiplicative formula C(n,k) = C(n,k-1) * (n-k+1) / k is deliberately
# NOT used to build the row, because it needs exact division - which EML-P
# cannot do on big integers (there is no `//`, and int(a/b) goes through a
# float). Addition needs no division at all, which is why the triangle is the
# right construction here. See the long-division-exact case for that gap.

def pascal_triangle(n):
    # Every row 0..n, built once and kept. The first draft of this program
    # rebuilt the triangle from scratch inside the hockey-stick loop, which is
    # O(n^3) and produced a 229 MB execution trace for a program whose output
    # is 25 lines. Same answers, same checks - the difference is entirely in
    # how many times the same rows were recomputed.
    [[1]] => rows
    [1] => row
    for i in [1:n]:
        [1] => next_row
        for k in [1:i - 1]:
            next_row + [row[k - 1] + row[k]] => next_row
        next_row + [1] => next_row
        next_row => row
        rows + [row] => rows
    return rows

def power_of_two(k):
    1 => p
    for i in [1:k]:
        p * 2 => p
    return p


80 => n
pascal_triangle(n + 1) => triangle
triangle[n] => row

("row " + str(n) + " has " + str(len(row)) + " entries")^0
("first three: " + str(row[0]) + ", " + str(row[1]) + ", " + str(row[2]))^0
("middle C(80,40): " + str(row[40]))^0
("digits in the middle entry: " + str(len(str(row[40]))))^0

# ----------------------------------------------------------------- symmetry
0 => symmetric
0 => symmetry_checked
for k in [0:n]:
    symmetry_checked + 1 => symmetry_checked
    if row[k] == row[n - k]:
        symmetric + 1 => symmetric

# ------------------------------------------------------------------ row sum
0 => total
for value in row:
    total + value => total
power_of_two(n) => expected_total

""^0
("row sum:      " + str(total))^0
("2^80:         " + str(expected_total))^0
("they match:   " + str(total == expected_total))^0
("symmetric:    " + str(symmetric) + "/" + str(symmetry_checked))^0

# -------------------------------------------------------------- hockey stick
# sum over i of C(i, k) for i = k..n  equals  C(n+1, k+1). Needs the row below,
# so it cannot be satisfied by a self-consistent but wrong triangle.
triangle[n + 1] => row_below
[0, 1, 2, 5, 13, 40] => ks
0 => stick_ok
""^0
"Hockey-stick identity:"^0
for k in ks:
    0 => acc
    for i in [k:n]:
        acc + triangle[i][k] => acc
    row_below[k + 1] => want
    if acc == want:
        stick_ok + 1 => stick_ok
    ("  k=" + str(k) + " -> sum " + str(acc) + " vs C(81," + str(k + 1) + ") " + str(want) + " : " + str(acc == want))^0

""^0
("hockey stick: " + str(stick_ok) + "/" + str(len(ks)))^0

""^0
if total == expected_total and symmetric == symmetry_checked and stick_ok == len(ks):
    "Row 80 is exact: symmetric, sums to 2^80, and agrees with row 81." => verdict
else:
    "FAILED - a value in the row is wrong." => verdict
verdict^0

""^0
"The row sum is the sharpest of the three. 2^80 is one specific integer;" => n1
n1^0
"an implementation that rounds anywhere in eighty rows of addition lands" => n2
n2^0
"near it and not on it, and 'near' is not a value this check accepts." => n3
n3^0
```

## Python (deterministic transpilation)

```python
def pascal_triangle(n):
    rows = [[1]]
    row = [1]
    for i in range(1, n+1):
        next_row = [1]
        for k in range(1, i):
            next_row = next_row + [row[k - 1] + row[k]]
        next_row = next_row + [1]
        row = next_row
        rows = rows + [row]
    return rows

def power_of_two(k):
    p = 1
    for i in range(1, k+1):
        p = p * 2
    return p

n = 80
triangle = pascal_triangle(n + 1)
row = triangle[n]
print("row " + str(n) + " has " + str(len(row)) + " entries")
print("first three: " + str(row[0]) + ", " + str(row[1]) + ", " + str(row[2]))
print("middle C(80,40): " + str(row[40]))
print("digits in the middle entry: " + str(len(str(row[40]))))
symmetric = 0
symmetry_checked = 0
for k in range(0, n+1):
    symmetry_checked = symmetry_checked + 1
    if row[k] == row[n - k]:
        symmetric = symmetric + 1
total = 0
for value in row:
    total = total + value
expected_total = power_of_two(n)
print("")
print("row sum:      " + str(total))
print("2^80:         " + str(expected_total))
print("they match:   " + str(total == expected_total))
print("symmetric:    " + str(symmetric) + "/" + str(symmetry_checked))
row_below = triangle[n + 1]
ks = [0, 1, 2, 5, 13, 40]
stick_ok = 0
print("")
print("Hockey-stick identity:")
for k in ks:
    acc = 0
    for i in range(k, n+1):
        acc = acc + triangle[i][k]
    want = row_below[k + 1]
    if acc == want:
        stick_ok = stick_ok + 1
    print("  k=" + str(k) + " -> sum " + str(acc) + " vs C(81," + str(k + 1) + ") " + str(want) + " : " + str(acc == want))
print("")
print("hockey stick: " + str(stick_ok) + "/" + str(len(ks)))
print("")
if total == expected_total and symmetric == symmetry_checked and stick_ok == len(ks):
    verdict = "Row 80 is exact: symmetric, sums to 2^80, and agrees with row 81."
else:
    verdict = "FAILED - a value in the row is wrong."
print(verdict)
print("")
n1 = "The row sum is the sharpest of the three. 2^80 is one specific integer;"
print(n1)
n2 = "an implementation that rounds anywhere in eighty rows of addition lands"
print(n2)
n3 = "near it and not on it, and 'near' is not a value this check accepts."
print(n3)
```

## stdout (executed)

```text
row 80 has 81 entries
first three: 1, 80, 3160
middle C(80,40): 107507208733336176461620
digits in the middle entry: 24

row sum:      1208925819614629174706176
2^80:         1208925819614629174706176
they match:   True
symmetric:    81/81

Hockey-stick identity:
  k=0 -> sum 81 vs C(81,1) 81 : True
  k=1 -> sum 3240 vs C(81,2) 3240 : True
  k=2 -> sum 85320 vs C(81,3) 85320 : True
  k=5 -> sum 324540216 vs C(81,6) 324540216 : True
  k=13 -> sum 1823288518168200 vs C(81,14) 1823288518168200 : True
  k=40 -> sum 212392290424395860814420 vs C(81,41) 212392290424395860814420 : True

hockey stick: 6/6

Row 80 is exact: symmetric, sums to 2^80, and agrees with row 81.

The row sum is the sharpest of the three. 2^80 is one specific integer;
an implementation that rounds anywhere in eighty rows of addition lands
near it and not on it, and 'near' is not a value this check accepts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
