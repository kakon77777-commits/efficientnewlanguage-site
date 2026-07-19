<!-- canonical: efficientnewlanguage.org/ai/examples/011-anagram-checker | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 011 — Anagram checker

`anagram_checker.eml` checks five sample word pairs — `listen`/`silent`, `evil`/`vile`, `dormitory`/`dirtyroom`, `night`/`thing`, and `cat`/`dog` — for whether each pair is an anagram of the other.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Checks
# whether each of several sample word pairs are anagrams of each other by
# building a per-letter frequency dict for each word manually (loop + dict
# subscript get/set) and comparing the two dicts with `==`.

pairs^+[
    ("listen", "silent"),
    ("evil", "vile"),
    ("dormitory", "dirtyroom"),
    ("night", "thing"),
    ("cat", "dog"),
]

for pair in pairs:
    pair[0] => word1
    pair[1] => word2

    freq1^+{}
    for ch in word1:
        if ch in freq1:
            freq1[ch] + 1 => freq1[ch]
        else:
            1 => freq1[ch]

    freq2^+{}
    for ch in word2:
        if ch in freq2:
            freq2[ch] + 1 => freq2[ch]
        else:
            1 => freq2[ch]

    (freq1 == freq2) => is_anagram
    if is_anagram:
        word1^0(" & ")
        word2^0(" -> anagrams\n")
    else:
        word1^0(" & ")
        word2^0(" -> not anagrams\n")
```

## Python (deterministic transpilation)

```python
pairs = [("listen", "silent"), ("evil", "vile"), ("dormitory", "dirtyroom"), ("night", "thing"), ("cat", "dog")]
for pair in pairs:
    word1 = pair[0]
    word2 = pair[1]
    freq1 = {}
    for ch in word1:
        if ch in freq1:
            freq1[ch] = freq1[ch] + 1
        else:
            freq1[ch] = 1
    freq2 = {}
    for ch in word2:
        if ch in freq2:
            freq2[ch] = freq2[ch] + 1
        else:
            freq2[ch] = 1
    is_anagram = freq1 == freq2
    if is_anagram:
        print(word1, end=" & ")
        print(word2, end=" -> anagrams\n")
    else:
        print(word1, end=" & ")
        print(word2, end=" -> not anagrams\n")
```

## stdout (executed)

```text
listen & silent -> anagrams
evil & vile -> anagrams
dormitory & dirtyroom -> anagrams
night & thing -> anagrams
cat & dog -> not anagrams
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
