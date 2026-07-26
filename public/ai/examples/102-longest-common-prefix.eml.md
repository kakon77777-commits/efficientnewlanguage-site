<!-- canonical: efficientnewlanguage.org/ai/examples/102-longest-common-prefix | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 102 — Longest common prefix

`longest_common_prefix.eml` finds the longest starting string every word in a list shares, e.g. `['flower', 'flow', 'flight'] -> 'fl'`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finds the
# longest starting string every word in a list shares. Takes the first
# word as a candidate prefix and shrinks it against each remaining word,
# stopping early the moment it becomes empty — nothing can grow it back,
# so there is no reason to look at the rest of the list.
#
# Worth contrasting with examples/longest-common-subsequence/: that one
# allows gaps and needs a full 2D table, this one requires an unbroken run
# from position 0 and needs no table at all. "Common" is doing very
# different work in the two names.

def longest_common_prefix(words):
    len(words) => count
    if count == 0:
        return ""
    words[0] => prefix
    1 => i
    while i < count:
        words[i] => word
        len(prefix) => limit
        if len(word) < limit:
            len(word) => limit
        0 => j
        while j < limit:
            if prefix[j] != word[j]:
                break
            j + 1 => j
        prefix[0:j] => prefix
        if len(prefix) == 0:
            break
        i + 1 => i
    return prefix

groups^+[["flower", "flow", "flight"],
         ["interspecies", "interstellar", "interstate"],
         ["dog", "racecar", "car"],
         ["single"],
         ["same", "same", "same"]]

for words in groups:
    longest_common_prefix(words) => prefix
    str(words) + " -> '" + prefix + "'" => line
    line^0
```

## Python (deterministic transpilation)

```python
def longest_common_prefix(words):
    count = len(words)
    if count == 0:
        return ""
    prefix = words[0]
    i = 1
    while i < count:
        word = words[i]
        limit = len(prefix)
        if len(word) < limit:
            limit = len(word)
        j = 0
        while j < limit:
            if prefix[j] != word[j]:
                break
            j = j + 1
        prefix = prefix[0:j]
        if len(prefix) == 0:
            break
        i = i + 1
    return prefix

groups = [["flower", "flow", "flight"], ["interspecies", "interstellar", "interstate"], ["dog", "racecar", "car"], ["single"], ["same", "same", "same"]]
for words in groups:
    prefix = longest_common_prefix(words)
    line = str(words) + " -> '" + prefix + "'"
    print(line)
```

## stdout (executed)

```text
['flower', 'flow', 'flight'] -> 'fl'
['interspecies', 'interstellar', 'interstate'] -> 'inters'
['dog', 'racecar', 'car'] -> ''
['single'] -> 'single'
['same', 'same', 'same'] -> 'same'
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
