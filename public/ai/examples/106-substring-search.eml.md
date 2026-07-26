<!-- canonical: efficientnewlanguage.org/ai/examples/106-substring-search | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 106 — Substring search (all positions)

`substring_search.eml` slides a pattern along a text and collects **every** match position, not just the first — e.g. `'aba' in 'abababa' -> [0, 2, 4]`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Naive
# substring search: slide the pattern along the text one position at a
# time and compare character by character, collecting EVERY match position
# rather than just the first. The corpus's first pattern-matching case.
#
# Advancing by one position after a hit (not by the pattern length) is
# what makes overlapping matches findable: "aba" occurs three times in
# "abababa", at 0, 2 and 4, and a version that skipped ahead by the
# pattern length would report only two of them. Both overlapping samples
# below exist to pin that behavior down.

def find_all(text, pattern):
    positions^+[]
    len(text) => n
    len(pattern) => m
    if m == 0:
        return positions
    if m > n:
        return positions
    0 => i
    while i <= n - m:
        1 => matched
        0 => j
        while j < m:
            if text[i + j] != pattern[j]:
                0 => matched
                break
            j + 1 => j
        if matched == 1:
            positions + [i] => positions
        i + 1 => i
    return positions

searches^+[["abababa", "aba"], ["banana", "ana"], ["hello world", "o"], ["aaa", "b"], ["abc", "abcd"]]

for search in searches:
    search[0] => text
    search[1] => pattern
    find_all(text, pattern) => positions
    "'" + pattern + "' in '" + text + "' -> " + str(positions) => line
    line^0
```

## Python (deterministic transpilation)

```python
def find_all(text, pattern):
    positions = []
    n = len(text)
    m = len(pattern)
    if m == 0:
        return positions
    if m > n:
        return positions
    i = 0
    while i <= n - m:
        matched = 1
        j = 0
        while j < m:
            if text[i + j] != pattern[j]:
                matched = 0
                break
            j = j + 1
        if matched == 1:
            positions = positions + [i]
        i = i + 1
    return positions

searches = [["abababa", "aba"], ["banana", "ana"], ["hello world", "o"], ["aaa", "b"], ["abc", "abcd"]]
for search in searches:
    text = search[0]
    pattern = search[1]
    positions = find_all(text, pattern)
    line = "'" + pattern + "' in '" + text + "' -> " + str(positions)
    print(line)
```

## stdout (executed)

```text
'aba' in 'abababa' -> [0, 2, 4]
'ana' in 'banana' -> [1, 3]
'o' in 'hello world' -> [4, 7]
'b' in 'aaa' -> []
'abcd' in 'abc' -> []
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
