<!-- canonical: efficientnewlanguage.org/ai/examples/054-insertion-sort | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 054 — Insertion sort

`insertion_sort.eml` sorts the sample list `[29, 10, 14, 37, 14, 5, 88]` (with a deliberate duplicate, `14`) into ascending order using insertion sort: builds the sorted prefix one element at a time by shifting larger elements right — the third simple sort in the corpus alongside [`examples/bubble-sort/`](../bubble-sort/) and [`examples/selection-sort/`](../selection-sort/).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Insertion sort
# over a fixed sample list — builds the sorted prefix one element at a time
# by shifting larger elements right — the third simple sort in the corpus
# alongside examples/bubble-sort/ and examples/selection-sort/. No
# `sorted()`/`.sort()` builtin, both interpreter-deferred.

numbers^+[29, 10, 14, 37, 14, 5, 88]
len(numbers) => n

for i in [1 : n - 1]:
    numbers[i] => key
    i - 1 => j
    while j >= 0 and numbers[j] > key:
        numbers[j] => numbers[j + 1]
        j - 1 => j
    key => numbers[j + 1]

"Original: [29, 10, 14, 37, 14, 5, 88]" => msg1
msg1^0
"Sorted:   " + str(numbers) => msg2
msg2^0
```

## Python (deterministic transpilation)

```python
numbers = [29, 10, 14, 37, 14, 5, 88]
n = len(numbers)
for i in range(1, n):
    key = numbers[i]
    j = i - 1
    while j >= 0 and numbers[j] > key:
        numbers[j + 1] = numbers[j]
        j = j - 1
    numbers[j + 1] = key
msg1 = "Original: [29, 10, 14, 37, 14, 5, 88]"
print(msg1)
msg2 = "Sorted:   " + str(numbers)
print(msg2)
```

## stdout (executed)

```text
Original: [29, 10, 14, 37, 14, 5, 88]
Sorted:   [5, 10, 14, 14, 29, 37, 88]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
