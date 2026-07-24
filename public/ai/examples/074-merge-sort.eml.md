<!-- canonical: efficientnewlanguage.org/ai/examples/074-merge-sort | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 074 — Merge sort

`merge_sort.eml` sorts a fixed sample list `[8, 3, 5, 1, 9, 2, 7, 4, 6]` via classic recursive divide-and-conquer merge sort — no `sorted()` builtin.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Recursive
# divide-and-conquer merge sort over a fixed sample list — splits the list in
# half via slice syntax (`items[0:mid]`/`items[mid:n]`), no `sorted()`
# builtin; the merge step reuses the same two-pointer idea as
# examples/merge-two-sorted-lists/, this time called from within recursion.

def merge(list_a, list_b):
    merged^+[]
    0 => i
    0 => j
    len(list_a) => len_a
    len(list_b) => len_b
    while i < len_a and j < len_b:
        if list_a[i] <= list_b[j]:
            merged + [list_a[i]] => merged
            i + 1 => i
        else:
            merged + [list_b[j]] => merged
            j + 1 => j
    while i < len_a:
        merged + [list_a[i]] => merged
        i + 1 => i
    while j < len_b:
        merged + [list_b[j]] => merged
        j + 1 => j
    return merged

def merge_sort(items):
    len(items) => n
    if n <= 1:
        return items
    int(n / 2) => mid
    items[0:mid] => left
    items[mid:n] => right
    merge_sort(left) => sorted_left
    merge_sort(right) => sorted_right
    merge(sorted_left, sorted_right) => result
    return result

numbers^+[8, 3, 5, 1, 9, 2, 7, 4, 6]
merge_sort(numbers) => sorted_numbers

"Before: " + str(numbers) => msg1
msg1^0
"After:  " + str(sorted_numbers) => msg2
msg2^0
```

## Python (deterministic transpilation)

```python
def merge(list_a, list_b):
    merged = []
    i = 0
    j = 0
    len_a = len(list_a)
    len_b = len(list_b)
    while i < len_a and j < len_b:
        if list_a[i] <= list_b[j]:
            merged = merged + [list_a[i]]
            i = i + 1
        else:
            merged = merged + [list_b[j]]
            j = j + 1
    while i < len_a:
        merged = merged + [list_a[i]]
        i = i + 1
    while j < len_b:
        merged = merged + [list_b[j]]
        j = j + 1
    return merged

def merge_sort(items):
    n = len(items)
    if n <= 1:
        return items
    mid = int(n / 2)
    left = items[0:mid]
    right = items[mid:n]
    sorted_left = merge_sort(left)
    sorted_right = merge_sort(right)
    result = merge(sorted_left, sorted_right)
    return result

numbers = [8, 3, 5, 1, 9, 2, 7, 4, 6]
sorted_numbers = merge_sort(numbers)
msg1 = "Before: " + str(numbers)
print(msg1)
msg2 = "After:  " + str(sorted_numbers)
print(msg2)
```

## stdout (executed)

```text
Before: [8, 3, 5, 1, 9, 2, 7, 4, 6]
After:  [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
