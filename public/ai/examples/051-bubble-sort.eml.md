<!-- canonical: efficientnewlanguage.org/ai/examples/051-bubble-sort | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 051 — Bubble sort

`bubble_sort.eml` sorts the sample list `[64, 34, 25, 12, 22, 11, 90]` into ascending order using a classic bubble sort — a manual double loop with an index-based adjacent-element swap — instead of the `sorted()`/`.sort()` builtins.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Bubble sort
# over a fixed sample list via a manual double loop and an index-based swap
# (temp variable + subscript assignment on the list) — no `sorted()`/
# `.sort()` builtin, both of which are interpreter-deferred.

numbers^+[64, 34, 25, 12, 22, 11, 90]
len(numbers) => n

for i in [0 : n - 2]:
    for j in [0 : n - 2 - i]:
        if numbers[j] > numbers[j + 1]:
            numbers[j] => temp
            numbers[j + 1] => numbers[j]
            temp => numbers[j + 1]

"Original: [64, 34, 25, 12, 22, 11, 90]" => msg1
msg1^0
"Sorted:   " + str(numbers) => msg2
msg2^0
```

## Python (deterministic transpilation)

```python
numbers = [64, 34, 25, 12, 22, 11, 90]
n = len(numbers)
for i in range(0, n - 2+1):
    for j in range(0, n - 2 - i+1):
        if numbers[j] > numbers[j + 1]:
            temp = numbers[j]
            numbers[j] = numbers[j + 1]
            numbers[j + 1] = temp
msg1 = "Original: [64, 34, 25, 12, 22, 11, 90]"
print(msg1)
msg2 = "Sorted:   " + str(numbers)
print(msg2)
```

## stdout (executed)

```text
Original: [64, 34, 25, 12, 22, 11, 90]
Sorted:   [11, 12, 22, 25, 34, 64, 90]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
