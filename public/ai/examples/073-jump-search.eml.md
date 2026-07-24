<!-- canonical: efficientnewlanguage.org/ai/examples/073-jump-search | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 073 — Jump search

`jump_search.eml` searches for five sample targets (`34, 100, 3, 91, 999`) in the fixed pre-sorted list `[3, 8, 15, 22, 34, 41, 56, 63, 79, 91, 100, 108, 121]` via jump search.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Searches a
# fixed pre-sorted list via jump search — jump ahead in fixed-size blocks
# (`sqrt(n)` sized, via EML's native fractional-exponent power operator
# `n^0.5`, same idiom as examples/quadratic-solver/), then linear-scan the
# one block that could contain the target — a distinct search strategy from
# the corpus's existing examples/binary-search/ and examples/linear-search/.
# No `min()` builtin (interpreter-deferred): block bounds are clamped by
# hand instead.

def jump_search(items, target):
    len(items) => n
    n^0.5 => step_f
    int(step_f) => step
    step => block_end
    0 => block_start
    while block_end < n and items[block_end - 1] < target:
        block_end => block_start
        block_start + step => block_end
    if block_end > n:
        n => block_end
    block_start => i
    while i < block_end:
        if items[i] == target:
            return i
        i + 1 => i
    return -1

items^+[3, 8, 15, 22, 34, 41, 56, 63, 79, 91, 100, 108, 121]
targets^+[34, 100, 3, 91, 999]

for target in targets:
    jump_search(items, target) => idx
    if idx >= 0:
        "Found " + str(target) + " at index " + str(idx) => line
    else:
        "Not found: " + str(target) => line
    line^0
```

## Python (deterministic transpilation)

```python
def jump_search(items, target):
    n = len(items)
    step_f = n**0.5
    step = int(step_f)
    block_end = step
    block_start = 0
    while block_end < n and items[block_end - 1] < target:
        block_start = block_end
        block_end = block_start + step
    if block_end > n:
        block_end = n
    i = block_start
    while i < block_end:
        if items[i] == target:
            return i
        i = i + 1
    return -1

items = [3, 8, 15, 22, 34, 41, 56, 63, 79, 91, 100, 108, 121]
targets = [34, 100, 3, 91, 999]
for target in targets:
    idx = jump_search(items, target)
    if idx >= 0:
        line = "Found " + str(target) + " at index " + str(idx)
    else:
        line = "Not found: " + str(target)
    print(line)
```

## stdout (executed)

```text
Found 34 at index 4
Found 100 at index 10
Found 3 at index 0
Found 91 at index 9
Not found: 999
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
