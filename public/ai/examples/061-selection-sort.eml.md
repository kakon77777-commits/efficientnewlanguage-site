<!-- canonical: efficientnewlanguage.org/ai/examples/061-selection-sort | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 061 — Selection sort

`selection_sort.eml` sorts the sample list `[64, 25, 12, 22, 11, 90, 34]` into ascending order using selection sort: for each position, scan the remainder for the minimum and swap it into place once — a different strategy from [`examples/bubble-sort/`](../bubble-sort/)'s repeated adjacent-element swap.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Selection sort
# over a fixed sample list: for each position, scans the remainder for the
# minimum and swaps it into place once — a different strategy from
# examples/bubble-sort/'s repeated adjacent-element swap. No `sorted()`/
# `.sort()` builtin, both interpreter-deferred.

numbers^+[64, 25, 12, 22, 11, 90, 34]
len(numbers) => n

for i in [0 : n - 2]:
    i => min_index
    for j in [i + 1 : n - 1]:
        if numbers[j] < numbers[min_index]:
            j => min_index
    if min_index != i:
        numbers[i] => temp
        numbers[min_index] => numbers[i]
        temp => numbers[min_index]

"Original: [64, 25, 12, 22, 11, 90, 34]" => msg1
msg1^0
"Sorted:   " + str(numbers) => msg2
msg2^0
```

## Python (deterministic transpilation)

```python
numbers = [64, 25, 12, 22, 11, 90, 34]
n = len(numbers)
for i in range(0, n - 2+1):
    min_index = i
    for j in range(i + 1, n):
        if numbers[j] < numbers[min_index]:
            min_index = j
    if min_index != i:
        temp = numbers[i]
        numbers[i] = numbers[min_index]
        numbers[min_index] = temp
msg1 = "Original: [64, 25, 12, 22, 11, 90, 34]"
print(msg1)
msg2 = "Sorted:   " + str(numbers)
print(msg2)
```

## stdout (executed)

```text
Original: [64, 25, 12, 22, 11, 90, 34]
Sorted:   [11, 12, 22, 25, 34, 64, 90]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
