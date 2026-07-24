<!-- canonical: efficientnewlanguage.org/ai/examples/067-counting-sort | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 067 — Counting sort

`counting_sort.eml` sorts a fixed sample list `[4, 2, 2, 8, 3, 3, 1, 0, 5]` (values known to be in `0..8`) via counting sort.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Non-
# comparison sort: counts occurrences of each value over a small known
# range, then reconstructs the sorted list from the counts — a genuinely
# different algorithmic family from the corpus's existing comparison-based
# sorts (bubble/selection/insertion/merge/quicksort).

def counting_sort(items, max_value):
    counts^+[]
    0 => i
    while i <= max_value:
        counts + [0] => counts
        i + 1 => i
    for value in items:
        counts[value] + 1 => counts[value]
    result^+[]
    0 => v
    while v <= max_value:
        0 => copies
        while copies < counts[v]:
            result + [v] => result
            copies + 1 => copies
        v + 1 => v
    return result

numbers^+[4, 2, 2, 8, 3, 3, 1, 0, 5]
"Before: " + str(numbers) => msg1
msg1^0
counting_sort(numbers, 8) => sorted_numbers
"After:  " + str(sorted_numbers) => msg2
msg2^0
```

## Python (deterministic transpilation)

```python
def counting_sort(items, max_value):
    counts = []
    i = 0
    while i <= max_value:
        counts = counts + [0]
        i = i + 1
    for value in items:
        counts[value] = counts[value] + 1
    result = []
    v = 0
    while v <= max_value:
        copies = 0
        while copies < counts[v]:
            result = result + [v]
            copies = copies + 1
        v = v + 1
    return result

numbers = [4, 2, 2, 8, 3, 3, 1, 0, 5]
msg1 = "Before: " + str(numbers)
print(msg1)
sorted_numbers = counting_sort(numbers, 8)
msg2 = "After:  " + str(sorted_numbers)
print(msg2)
```

## stdout (executed)

```text
Before: [4, 2, 2, 8, 3, 3, 1, 0, 5]
After:  [0, 1, 2, 2, 3, 3, 4, 5, 8]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
