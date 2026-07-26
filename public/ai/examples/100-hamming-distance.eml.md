<!-- canonical: efficientnewlanguage.org/ai/examples/100-hamming-distance | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 100 — Hamming distance

`hamming_distance.eml` counts how many positions two equal-length strings differ in, for five sample pairs — including the classic `'karolin' vs 'kathrin' : 3`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Hamming
# distance: how many positions two EQUAL-LENGTH strings differ in. A
# deliberate counterpart to examples/edit-distance/ — same question shape,
# far stricter rules. Hamming only counts substitutions and refuses
# unequal lengths outright; Levenshtein also allows insertions and
# deletions, which is why the two disagree on 'flaw'/'lawn' below: Hamming
# says 4 (every position differs), Levenshtein says 2 (delete 'f', insert
# 'n'). Same pair, same file over there, different answer.
#
# Cost is also the point of the contrast: this is one pass and a counter,
# where edit-distance needs a full (n+1)x(m+1) table.

def hamming_distance(a, b):
    len(a) => n
    len(b) => m
    if n != m:
        return 0 - 1
    0 => distance
    0 => i
    while i < n:
        if a[i] != b[i]:
            distance + 1 => distance
        i + 1 => i
    return distance

pairs^+[["karolin", "kathrin"], ["1011101", "1001001"], ["flaw", "lawn"], ["same", "same"], ["abc", "abcd"]]

for pair in pairs:
    pair[0] => a
    pair[1] => b
    hamming_distance(a, b) => distance
    if distance < 0:
        "'" + a + "' vs '" + b + "' : undefined (lengths differ)" => line
    else:
        "'" + a + "' vs '" + b + "' : " + str(distance) => line
    line^0
```

## Python (deterministic transpilation)

```python
def hamming_distance(a, b):
    n = len(a)
    m = len(b)
    if n != m:
        return 0 - 1
    distance = 0
    i = 0
    while i < n:
        if a[i] != b[i]:
            distance = distance + 1
        i = i + 1
    return distance

pairs = [["karolin", "kathrin"], ["1011101", "1001001"], ["flaw", "lawn"], ["same", "same"], ["abc", "abcd"]]
for pair in pairs:
    a = pair[0]
    b = pair[1]
    distance = hamming_distance(a, b)
    if distance < 0:
        line = "'" + a + "' vs '" + b + "' : undefined (lengths differ)"
    else:
        line = "'" + a + "' vs '" + b + "' : " + str(distance)
    print(line)
```

## stdout (executed)

```text
'karolin' vs 'kathrin' : 3
'1011101' vs '1001001' : 2
'flaw' vs 'lawn' : 4
'same' vs 'same' : 0
'abc' vs 'abcd' : undefined (lengths differ)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
