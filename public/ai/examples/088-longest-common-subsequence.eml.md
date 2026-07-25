<!-- canonical: efficientnewlanguage.org/ai/examples/088-longest-common-subsequence | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 088 — Longest common subsequence

`longest_common_subsequence.eml` finds the longest sequence of characters appearing in both strings in order (not necessarily adjacent), for four sample pairs — including the textbook `'AGGTAB' & 'GXTXAYB' -> 'GTAB'`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finds the
# longest common subsequence of two strings — characters appearing in both,
# in order, not necessarily adjacent. Fills the same style of 2D DP table
# as examples/edit-distance/, but then does something that case does not:
# walks the finished table BACKWARDS from the bottom-right corner to
# reconstruct the actual subsequence, not just its length. That backward
# walk is the part worth reading — the table alone only answers "how
# long", and recovering "which characters" needs a second pass.

def lcs(a, b):
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
    1 => i
    while i <= n:
        1 => j
        while j <= m:
            if a[i - 1] == b[j - 1]:
                table[i - 1][j - 1] + 1 => table[i][j]
            else:
                table[i - 1][j] => best
                if table[i][j - 1] > best:
                    table[i][j - 1] => best
                best => table[i][j]
            j + 1 => j
        i + 1 => i
    n => i
    m => j
    "" => result
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            a[i - 1] + result => result
            i - 1 => i
            j - 1 => j
        elif table[i - 1][j] >= table[i][j - 1]:
            i - 1 => i
        else:
            j - 1 => j
    return result

pairs^+[["AGGTAB", "GXTXAYB"], ["eml", "email"], ["abcdef", "abcdef"], ["abc", "xyz"]]

for pair in pairs:
    pair[0] => a
    pair[1] => b
    lcs(a, b) => subsequence
    "'" + a + "' & '" + b + "' -> '" + subsequence + "' (length " + str(len(subsequence)) + ")" => line
    line^0
```

## Python (deterministic transpilation)

```python
def lcs(a, b):
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
    i = 1
    while i <= n:
        j = 1
        while j <= m:
            if a[i - 1] == b[j - 1]:
                table[i][j] = table[i - 1][j - 1] + 1
            else:
                best = table[i - 1][j]
                if table[i][j - 1] > best:
                    best = table[i][j - 1]
                table[i][j] = best
            j = j + 1
        i = i + 1
    i = n
    j = m
    result = ""
    while i > 0 and j > 0:
        if a[i - 1] == b[j - 1]:
            result = a[i - 1] + result
            i = i - 1
            j = j - 1
        elif table[i - 1][j] >= table[i][j - 1]:
            i = i - 1
        else:
            j = j - 1
    return result

pairs = [["AGGTAB", "GXTXAYB"], ["eml", "email"], ["abcdef", "abcdef"], ["abc", "xyz"]]
for pair in pairs:
    a = pair[0]
    b = pair[1]
    subsequence = lcs(a, b)
    line = "'" + a + "' & '" + b + "' -> '" + subsequence + "' (length " + str(len(subsequence)) + ")"
    print(line)
```

## stdout (executed)

```text
'AGGTAB' & 'GXTXAYB' -> 'GTAB' (length 4)
'eml' & 'email' -> 'eml' (length 3)
'abcdef' & 'abcdef' -> 'abcdef' (length 6)
'abc' & 'xyz' -> '' (length 0)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
