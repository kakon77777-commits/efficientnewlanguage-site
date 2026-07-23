<!-- canonical: efficientnewlanguage.org/ai/examples/050-binary-search | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 050 — Binary search

`binary_search.eml` searches for five sample targets (`34, 100, 3, 91, 50`) in the fixed pre-sorted list `[3, 8, 15, 22, 34, 41, 56, 63, 79, 91]` using a manual `while`-loop binary search — no `bisect` module.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Binary search
# over a fixed pre-sorted sample list via a manual `while` loop tracking
# low/high/mid indices — no `bisect` module. `int((low + high) / 2)` stands
# in for floor division (EML has no `//` token, same idiom used by
# examples/digit-sum-calculator/).

sorted_numbers^+[3, 8, 15, 22, 34, 41, 56, 63, 79, 91]

def binary_search(target):
    0 => low
    len(sorted_numbers) - 1 => high
    -1 => found_index
    while low <= high:
        int((low + high) / 2) => mid
        if sorted_numbers[mid] == target:
            mid => found_index
            break
        elif sorted_numbers[mid] < target:
            mid + 1 => low
        else:
            mid - 1 => high
    return found_index

targets^+[34, 100, 3, 91, 50]
for target in targets:
    binary_search(target) => idx
    if idx >= 0:
        "Found " + str(target) + " at index " + str(idx) => msg
    else:
        str(target) + " not found" => msg
    msg^0
```

## Python (deterministic transpilation)

```python
sorted_numbers = [3, 8, 15, 22, 34, 41, 56, 63, 79, 91]

def binary_search(target):
    low = 0
    high = len(sorted_numbers) - 1
    found_index = -1
    while low <= high:
        mid = int((low + high) / 2)
        if sorted_numbers[mid] == target:
            found_index = mid
            break
        elif sorted_numbers[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return found_index

targets = [34, 100, 3, 91, 50]
for target in targets:
    idx = binary_search(target)
    if idx >= 0:
        msg = "Found " + str(target) + " at index " + str(idx)
    else:
        msg = str(target) + " not found"
    print(msg)
```

## stdout (executed)

```text
Found 34 at index 4
100 not found
Found 3 at index 0
Found 91 at index 9
50 not found
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
