<!-- canonical: efficientnewlanguage.org/ai/examples/056-merge-two-sorted-lists | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 056 — Merge two sorted lists

`merge_two_sorted_lists.eml` merges two already-sorted sample lists (`[1, 4, 6, 9, 15]` and `[2, 3, 5, 8, 10, 20]`) into one sorted list via the classic two-pointer merge — the building block behind merge sort.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Merges two
# already-sorted sample lists into one sorted list via the classic
# two-pointer merge (the building block behind merge sort) — no `sorted()`
# builtin.

def merge_sorted(list_a, list_b):
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

first^+[1, 4, 6, 9, 15]
second^+[2, 3, 5, 8, 10, 20]
merge_sorted(first, second) => result

"First:  " + str(first) => msg1
msg1^0
"Second: " + str(second) => msg2
msg2^0
"Merged: " + str(result) => msg3
msg3^0
```

## Python (deterministic transpilation)

```python
def merge_sorted(list_a, list_b):
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

first = [1, 4, 6, 9, 15]
second = [2, 3, 5, 8, 10, 20]
result = merge_sorted(first, second)
msg1 = "First:  " + str(first)
print(msg1)
msg2 = "Second: " + str(second)
print(msg2)
msg3 = "Merged: " + str(result)
print(msg3)
```

## stdout (executed)

```text
First:  [1, 4, 6, 9, 15]
Second: [2, 3, 5, 8, 10, 20]
Merged: [1, 2, 3, 4, 5, 6, 8, 9, 10, 15, 20]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
