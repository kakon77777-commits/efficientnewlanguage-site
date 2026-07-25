<!-- canonical: efficientnewlanguage.org/ai/examples/083-edit-distance | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 083 — Edit distance (Levenshtein)

`edit_distance.eml` computes the fewest single-character insertions, deletions or substitutions needed to turn one string into another, for five sample pairs — including the canonical `'kitten' -> 'sitting' : 3`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Levenshtein
# edit distance: the fewest single-character insertions, deletions or
# substitutions that turn one string into another, computed with the
# classic 2D dynamic-programming table. The corpus's first bottom-up DP
# table (examples/fibonacci-memoized/ is top-down memoization instead).
#
# `min()` is interpreter-deferred, so the three-way minimum is picked by
# hand with two comparisons — the same reason examples/jump-search/ clamps
# its block bound manually.

def edit_distance(a, b):
    len(a) => n
    len(b) => m
    table^+[]
    0 => i
    while i <= n:
        row^+[]
        0 => j
        while j <= m:
            row + [0] => row
            j + 1 => j
        table + [row] => table
        i + 1 => i
    0 => i
    while i <= n:
        i => table[i][0]
        i + 1 => i
    0 => j
    while j <= m:
        j => table[0][j]
        j + 1 => j
    1 => i
    while i <= n:
        1 => j
        while j <= m:
            if a[i - 1] == b[j - 1]:
                table[i - 1][j - 1] => table[i][j]
            else:
                table[i - 1][j] => best
                if table[i][j - 1] < best:
                    table[i][j - 1] => best
                if table[i - 1][j - 1] < best:
                    table[i - 1][j - 1] => best
                best + 1 => table[i][j]
            j + 1 => j
        i + 1 => i
    return table[n][m]

pairs^+[["kitten", "sitting"], ["flaw", "lawn"], ["eml", "email"], ["same", "same"], ["", "abc"]]

for pair in pairs:
    pair[0] => a
    pair[1] => b
    edit_distance(a, b) => distance
    "'" + a + "' -> '" + b + "' : " + str(distance) => line
    line^0
```

## Python (deterministic transpilation)

```python
def edit_distance(a, b):
    n = len(a)
    m = len(b)
    table = []
    i = 0
    while i <= n:
        row = []
        j = 0
        while j <= m:
            row = row + [0]
            j = j + 1
        table = table + [row]
        i = i + 1
    i = 0
    while i <= n:
        table[i][0] = i
        i = i + 1
    j = 0
    while j <= m:
        table[0][j] = j
        j = j + 1
    i = 1
    while i <= n:
        j = 1
        while j <= m:
            if a[i - 1] == b[j - 1]:
                table[i][j] = table[i - 1][j - 1]
            else:
                best = table[i - 1][j]
                if table[i][j - 1] < best:
                    best = table[i][j - 1]
                if table[i - 1][j - 1] < best:
                    best = table[i - 1][j - 1]
                table[i][j] = best + 1
            j = j + 1
        i = i + 1
    return table[n][m]

pairs = [["kitten", "sitting"], ["flaw", "lawn"], ["eml", "email"], ["same", "same"], ["", "abc"]]
for pair in pairs:
    a = pair[0]
    b = pair[1]
    distance = edit_distance(a, b)
    line = "'" + a + "' -> '" + b + "' : " + str(distance)
    print(line)
```

## stdout (executed)

```text
'kitten' -> 'sitting' : 3
'flaw' -> 'lawn' : 2
'eml' -> 'email' : 2
'same' -> 'same' : 0
'' -> 'abc' : 3
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
