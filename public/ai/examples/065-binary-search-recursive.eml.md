<!-- canonical: efficientnewlanguage.org/ai/examples/065-binary-search-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 065 — Binary search (recursive)

`binary_search_recursive.eml` searches for the exact same five targets (`34, 100, 3, 91, 50`) in the exact same fixed pre-sorted list as [`examples/binary-search/`](../binary-search/) — same algorithm, same inputs, expressed via self-recursion instead of a `while` loop.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Recursive
# version of binary search over the same fixed pre-sorted list and targets
# as examples/binary-search/ — same algorithm and same inputs, expressed
# via self-recursion instead of a `while` loop, so the two cases are
# directly comparable.

def binary_search(items, target, low, high):
    if low > high:
        return -1
    int((low + high) / 2) => mid
    if items[mid] == target:
        return mid
    elif items[mid] < target:
        return binary_search(items, target, mid + 1, high)
    else:
        return binary_search(items, target, low, mid - 1)

items^+[3, 8, 15, 22, 34, 41, 56, 63, 79, 91]
targets^+[34, 100, 3, 91, 50]
len(items) => n

for target in targets:
    binary_search(items, target, 0, n - 1) => idx
    if idx >= 0:
        "Found " + str(target) + " at index " + str(idx) => line
    else:
        "Not found: " + str(target) => line
    line^0
```

## Python (deterministic transpilation)

```python
def binary_search(items, target, low, high):
    if low > high:
        return -1
    mid = int((low + high) / 2)
    if items[mid] == target:
        return mid
    elif items[mid] < target:
        return binary_search(items, target, mid + 1, high)
    else:
        return binary_search(items, target, low, mid - 1)

items = [3, 8, 15, 22, 34, 41, 56, 63, 79, 91]
targets = [34, 100, 3, 91, 50]
n = len(items)
for target in targets:
    idx = binary_search(items, target, 0, n - 1)
    if idx >= 0:
        line = "Found " + str(target) + " at index " + str(idx)
    else:
        line = "Not found: " + str(target)
    print(line)
```

## stdout (executed)

```text
Found 34 at index 4
Not found: 100
Found 3 at index 0
Found 91 at index 9
Not found: 50
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
