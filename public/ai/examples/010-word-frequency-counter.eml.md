<!-- canonical: efficientnewlanguage.org/ai/examples/010-word-frequency-counter | ai_layer_version: 0.1.0 | updated: 2026-07-18 -->

# Example 010 — Case corpus: a self-authored word-frequency counter

`word_frequency_counter.eml` is the second case in a self-authored batch (see [`examples/unit-temperature-converter/`](../unit-temperature-converter/) and [`examples/todo-list-manager/`](../todo-list-manager/) for the other two) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Counts word
# frequency in a small pre-tokenized word list (no string method calls used —
# every operation is directly expressible EML) via a dict literal, subscript
# get/set, and `in` membership on both a list and a dict; then finds the most
# frequent word with a manual comparison loop (kept to bare comparisons,
# rather than relying on a sort/max-of-tuples builtin).

words^+["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy",
        "dog", "the", "fox", "runs"]

counts^+{}
unique_words^+[]

for word in words:
    if word in counts:
        counts[word] + 1 => counts[word]
    else:
        1 => counts[word]
        unique_words + [word] => unique_words

"Word frequencies:"^0
for word in unique_words:
    word^0(": ")
    counts[word]^0("\n")

best_word^+""
best_count^+0
for word in unique_words:
    if counts[word] > best_count:
        counts[word] => best_count
        word => best_word

"Most frequent word: " + best_word + " (" + str(best_count) + " times)" => message
message^0
```

## Python (deterministic transpilation)

```python
words = ["the", "quick", "brown", "fox", "jumps", "over", "the", "lazy", "dog", "the", "fox", "runs"]
counts = {}
unique_words = []
for word in words:
    if word in counts:
        counts[word] = counts[word] + 1
    else:
        counts[word] = 1
        unique_words = unique_words + [word]
print("Word frequencies:")
for word in unique_words:
    print(word, end=": ")
    print(counts[word], end="\n")
best_word = ""
best_count = 0
for word in unique_words:
    if counts[word] > best_count:
        best_count = counts[word]
        best_word = word
message = "Most frequent word: " + best_word + " (" + str(best_count) + " times)"
print(message)
```

## stdout (executed)

```text
Word frequencies:
the: 3
quick: 1
brown: 1
fox: 2
jumps: 1
over: 1
lazy: 1
dog: 1
runs: 1
Most frequent word: the (3 times)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
