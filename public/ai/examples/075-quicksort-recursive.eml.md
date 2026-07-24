<!-- canonical: efficientnewlanguage.org/ai/examples/075-quicksort-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 075 — Quicksort (recursive)

`quicksort_recursive.eml` sorts a fixed sample list `[5, 2, 9, 1, 5, 6, 3, 8, 4]` (with a repeated value) via recursive quicksort with Lomuto-style in-place partitioning.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Recursive
# quicksort over a fixed sample list via Lomuto-style in-place partitioning
# — a different recursive-sort strategy from examples/merge-sort/ (mutates
# the list in place through subscript assignment, rather than building new
# lists via `+`).

def partition(items, low, high):
    items[high] => pivot
    low - 1 => i
    low => j
    while j < high:
        if items[j] <= pivot:
            i + 1 => i
            items[i] => temp_i
            items[j] => temp_j
            temp_j => items[i]
            temp_i => items[j]
        j + 1 => j
    i + 1 => i
    items[i] => temp_i
    items[high] => temp_high
    temp_high => items[i]
    temp_i => items[high]
    return i

def quicksort(items, low, high):
    if low < high:
        partition(items, low, high) => pivot_index
        quicksort(items, low, pivot_index - 1)
        quicksort(items, pivot_index + 1, high)
    return items

numbers^+[5, 2, 9, 1, 5, 6, 3, 8, 4]
len(numbers) => n
"Before: " + str(numbers) => msg1
msg1^0
quicksort(numbers, 0, n - 1) => sorted_numbers
"After:  " + str(sorted_numbers) => msg2
msg2^0
```

## Python (deterministic transpilation)

```python
def partition(items, low, high):
    pivot = items[high]
    i = low - 1
    j = low
    while j < high:
        if items[j] <= pivot:
            i = i + 1
            temp_i = items[i]
            temp_j = items[j]
            items[i] = temp_j
            items[j] = temp_i
        j = j + 1
    i = i + 1
    temp_i = items[i]
    temp_high = items[high]
    items[i] = temp_high
    items[high] = temp_i
    return i

def quicksort(items, low, high):
    if low < high:
        pivot_index = partition(items, low, high)
        quicksort(items, low, pivot_index - 1)
        quicksort(items, pivot_index + 1, high)
    return items

numbers = [5, 2, 9, 1, 5, 6, 3, 8, 4]
n = len(numbers)
msg1 = "Before: " + str(numbers)
print(msg1)
sorted_numbers = quicksort(numbers, 0, n - 1)
msg2 = "After:  " + str(sorted_numbers)
print(msg2)
```

## stdout (executed)

```text
Before: [5, 2, 9, 1, 5, 6, 3, 8, 4]
After:  [1, 2, 3, 4, 5, 5, 6, 8, 9]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
