<!-- canonical: efficientnewlanguage.org/ai/examples/119-n-queens | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 119 — N-Queens

`n_queens.eml` places N queens on an NxN board so none attacks another, for N = 4, 5, 6 — then renders all four 6-queens solutions.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The N-Queens
# problem: place N queens on an NxN board so none attacks another. The
# corpus's first BACKTRACKING case — search that walks down a branch,
# discovers it cannot work, and steps back to try the next option.
#
# The board is one column index per row, which makes row conflicts
# impossible by construction; only columns and the two diagonals need
# checking. A queen at (r,c) and one at (row,col) share a diagonal exactly
# when the row gap equals the column gap in either direction.
#
# Solution counts for N = 4,5,6 are 2, 10, 4 — a known, published sequence,
# and a demanding check: the dip at N=6 (fewer solutions than N=5) is the
# kind of non-monotonic detail a subtly wrong safety test would smooth
# over. N=7 (40 solutions) is deliberately left out: it dominates the
# search cost and would push this case's committed execution trace to
# roughly eight megabytes, which every test run has to regenerate and
# compare byte for byte.

def is_safe(positions, row, col):
    0 => r
    while r < row:
        positions[r] => c
        if c == col:
            return 0
        if row - r == col - c:
            return 0
        if row - r == c - col:
            return 0
        r + 1 => r
    return 1

def solve(positions, row, n, solutions):
    if row == n:
        snapshot^+[]
        for p in positions:
            snapshot + [p] => snapshot
        solutions + [snapshot] => solutions
        return solutions
    0 => col
    while col < n:
        if is_safe(positions, row, col) == 1:
            col => positions[row]
            solve(positions, row + 1, n, solutions) => solutions
        col + 1 => col
    return solutions

def count_solutions(n):
    positions^+[]
    0 => i
    while i < n:
        positions + [0] => positions
        i + 1 => i
    solutions^+[]
    solve(positions, 0, n, solutions) => solutions
    return solutions

expected^+[2, 10, 4]
0 => matches
six^+[]
for n in [4:6]:
    count_solutions(n) => solutions
    if n == 6:
        solutions => six
    len(solutions) => found
    expected[n - 4] => known
    if found == known:
        matches + 1 => matches
        str(n) + "-queens: " + str(found) + " solutions (matches known count)" => line
    else:
        str(n) + "-queens: " + str(found) + " solutions (EXPECTED " + str(known) + ")" => line
    line^0

str(matches) + " of 3 board sizes match their published solution count" => summary
summary^0

"" => blank
blank^0
"The 4 solutions for 6-queens:" => header
header^0
for solution in six:
    for row in solution:
        "" => rendered
        for col in [0:5]:
            if col == row:
                rendered + "Q" => rendered
            else:
                rendered + "." => rendered
        rendered^0
    "" => gap
    gap^0
```

## Python (deterministic transpilation)

```python
def is_safe(positions, row, col):
    r = 0
    while r < row:
        c = positions[r]
        if c == col:
            return 0
        if row - r == col - c:
            return 0
        if row - r == c - col:
            return 0
        r = r + 1
    return 1

def solve(positions, row, n, solutions):
    if row == n:
        snapshot = []
        for p in positions:
            snapshot = snapshot + [p]
        solutions = solutions + [snapshot]
        return solutions
    col = 0
    while col < n:
        if is_safe(positions, row, col) == 1:
            positions[row] = col
            solutions = solve(positions, row + 1, n, solutions)
        col = col + 1
    return solutions

def count_solutions(n):
    positions = []
    i = 0
    while i < n:
        positions = positions + [0]
        i = i + 1
    solutions = []
    solutions = solve(positions, 0, n, solutions)
    return solutions

expected = [2, 10, 4]
matches = 0
six = []
for n in range(4, 7):
    solutions = count_solutions(n)
    if n == 6:
        six = solutions
    found = len(solutions)
    known = expected[n - 4]
    if found == known:
        matches = matches + 1
        line = str(n) + "-queens: " + str(found) + " solutions (matches known count)"
    else:
        line = str(n) + "-queens: " + str(found) + " solutions (EXPECTED " + str(known) + ")"
    print(line)
summary = str(matches) + " of 3 board sizes match their published solution count"
print(summary)
blank = ""
print(blank)
header = "The 4 solutions for 6-queens:"
print(header)
for solution in six:
    for row in solution:
        rendered = ""
        for col in range(0, 6):
            if col == row:
                rendered = rendered + "Q"
            else:
                rendered = rendered + "."
        print(rendered)
    gap = ""
    print(gap)
```

## stdout (executed)

```text
4-queens: 2 solutions (matches known count)
5-queens: 10 solutions (matches known count)
6-queens: 4 solutions (matches known count)
3 of 3 board sizes match their published solution count

The 4 solutions for 6-queens:
.Q....
...Q..
.....Q
Q.....
..Q...
....Q.

..Q...
.....Q
.Q....
....Q.
Q.....
...Q..

...Q..
Q.....
....Q.
.Q....
.....Q
..Q...

....Q.
..Q...
Q.....
.....Q
...Q..
.Q....
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
