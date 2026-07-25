<!-- canonical: efficientnewlanguage.org/ai/examples/091-max-subarray-kadane | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 091 — Maximum subarray (Kadane's algorithm)

`max_subarray_kadane.eml` finds the largest sum obtainable from any contiguous run of a list, for five samples — including the classic `[-2, 1, -3, 4, -1, 2, 1, -5, 4] -> 6`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Kadane's
# algorithm: the largest sum obtainable from any contiguous run of a list.
# Dynamic programming with NO table at all — the whole "previous
# subproblem" state collapses into a single running variable, which is what
# makes this a useful contrast with the corpus's table-based DP cases
# (examples/edit-distance/, examples/longest-common-subsequence/,
# examples/coin-change-dp/).
#
# The all-negative sample matters: a version that seeds `best` at 0 instead
# of at the first element would wrongly answer 0 there, since it would
# silently allow the empty subarray.

def max_subarray(numbers):
    len(numbers) => n
    numbers[0] => best
    numbers[0] => current
    1 => i
    while i < n:
        numbers[i] => x
        current + x => extended
        if x > extended:
            x => current
        else:
            extended => current
        if current > best:
            current => best
        i + 1 => i
    return best

samples^+[[-2, 1, -3, 4, -1, 2, 1, -5, 4], [1, 2, 3, 4], [-5, -2, -8], [5], [2, -1, 2, -1, 2]]

for numbers in samples:
    max_subarray(numbers) => best
    str(numbers) + " -> " + str(best) => line
    line^0
```

## Python (deterministic transpilation)

```python
def max_subarray(numbers):
    n = len(numbers)
    best = numbers[0]
    current = numbers[0]
    i = 1
    while i < n:
        x = numbers[i]
        extended = current + x
        if x > extended:
            current = x
        else:
            current = extended
        if current > best:
            best = current
        i = i + 1
    return best

samples = [[-2, 1, -3, 4, -1, 2, 1, -5, 4], [1, 2, 3, 4], [-5, -2, -8], [5], [2, -1, 2, -1, 2]]
for numbers in samples:
    best = max_subarray(numbers)
    line = str(numbers) + " -> " + str(best)
    print(line)
```

## stdout (executed)

```text
[-2, 1, -3, 4, -1, 2, 1, -5, 4] -> 6
[1, 2, 3, 4] -> 10
[-5, -2, -8] -> -2
[5] -> 5
[2, -1, 2, -1, 2] -> 4
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
