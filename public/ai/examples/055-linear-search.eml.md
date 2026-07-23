<!-- canonical: efficientnewlanguage.org/ai/examples/055-linear-search | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 055 — Linear search

`linear_search.eml` searches for five sample targets (`56, 100, 47, 89, 71`) in the fixed unsorted list `[47, 12, 89, 3, 56, 23, 89, 71]` via a single scanning loop with `break` on the first match — the natural counterpart to [`examples/binary-search/`](../binary-search/)'s pre-sorted, divide-and-conquer approach. The value `89` is deliberately repeated to demonstrate that linear search returns the *first* occurrence (index 2, not 6).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Linear search
# over a fixed unsorted sample list — a single scanning loop with `break` on
# the first match — the natural counterpart to examples/binary-search/'s
# pre-sorted, divide-and-conquer approach. The sample list deliberately
# repeats one value (89) to demonstrate that linear search returns the
# *first* occurrence.

numbers^+[47, 12, 89, 3, 56, 23, 89, 71]

def linear_search(target):
    -1 => found_index
    for i in [0 : len(numbers) - 1]:
        if numbers[i] == target:
            i => found_index
            break
    return found_index

targets^+[56, 100, 47, 89, 71]
for target in targets:
    linear_search(target) => idx
    if idx >= 0:
        "Found " + str(target) + " at index " + str(idx) => msg
    else:
        str(target) + " not found" => msg
    msg^0
```

## Python (deterministic transpilation)

```python
numbers = [47, 12, 89, 3, 56, 23, 89, 71]

def linear_search(target):
    found_index = -1
    for i in range(0, len(numbers)):
        if numbers[i] == target:
            found_index = i
            break
    return found_index

targets = [56, 100, 47, 89, 71]
for target in targets:
    idx = linear_search(target)
    if idx >= 0:
        msg = "Found " + str(target) + " at index " + str(idx)
    else:
        msg = str(target) + " not found"
    print(msg)
```

## stdout (executed)

```text
Found 56 at index 4
100 not found
Found 47 at index 0
Found 89 at index 2
Found 71 at index 7
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
