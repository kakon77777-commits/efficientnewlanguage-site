<!-- canonical: efficientnewlanguage.org/ai/examples/123-subset-sum-backtracking | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 123 — Subset sum (backtracking)

`subset_sum_backtracking.eml` finds every subset of `[3, 34, 4, 12, 5, 2]` adding up to 9 — `[3, 4, 2]` and `[4, 5]` — then shows that nothing reaches 100.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finds every
# subset of a list that adds up to a target, by branching twice at each
# item — once including it, once excluding it — and pruning any branch
# whose running total has already overshot.
#
# The pruning is what makes this backtracking rather than brute force. A
# plain exhaustive search would build all 2^n subsets and filter at the
# end; abandoning a branch the moment `total > target` cuts most of that
# tree away without ever visiting it. Because every number here is
# positive, overshooting is permanent — that assumption is exactly what
# licenses the prune, and it would be wrong if negatives were allowed.
#
# Contrast with examples/coin-change-dp/, which answers a related question
# (can these values reach an amount, and how cheaply) with a table instead
# of a search: DP returns one optimal count, this returns every witness.

def find_subsets(numbers, index, current, total, target, results):
    if total == target:
        snapshot^+[]
        for c in current:
            snapshot + [c] => snapshot
        results + [snapshot] => results
        return results
    if total > target:
        return results
    if index >= len(numbers):
        return results
    numbers[index] => value
    find_subsets(numbers, index + 1, current + [value], total + value, target, results) => results
    find_subsets(numbers, index + 1, current, total, target, results) => results
    return results

def subsets_summing_to(numbers, target):
    results^+[]
    find_subsets(numbers, 0, [], 0, target, results) => results
    return results

numbers^+[3, 34, 4, 12, 5, 2]
9 => target

subsets_summing_to(numbers, target) => found
"Numbers: " + str(numbers) => msg1
msg1^0
"Subsets summing to " + str(target) + ":" => msg2
msg2^0
for subset in found:
    "  " + str(subset) => line
    line^0
"Found " + str(len(found)) + " subsets" => msg3
msg3^0

subsets_summing_to(numbers, 100) => none_found
"Subsets summing to 100: " + str(len(none_found)) + " (nothing reaches it)" => msg4
msg4^0
```

## Python (deterministic transpilation)

```python
def find_subsets(numbers, index, current, total, target, results):
    if total == target:
        snapshot = []
        for c in current:
            snapshot = snapshot + [c]
        results = results + [snapshot]
        return results
    if total > target:
        return results
    if index >= len(numbers):
        return results
    value = numbers[index]
    results = find_subsets(numbers, index + 1, current + [value], total + value, target, results)
    results = find_subsets(numbers, index + 1, current, total, target, results)
    return results

def subsets_summing_to(numbers, target):
    results = []
    results = find_subsets(numbers, 0, [], 0, target, results)
    return results

numbers = [3, 34, 4, 12, 5, 2]
target = 9
found = subsets_summing_to(numbers, target)
msg1 = "Numbers: " + str(numbers)
print(msg1)
msg2 = "Subsets summing to " + str(target) + ":"
print(msg2)
for subset in found:
    line = "  " + str(subset)
    print(line)
msg3 = "Found " + str(len(found)) + " subsets"
print(msg3)
none_found = subsets_summing_to(numbers, 100)
msg4 = "Subsets summing to 100: " + str(len(none_found)) + " (nothing reaches it)"
print(msg4)
```

## stdout (executed)

```text
Numbers: [3, 34, 4, 12, 5, 2]
Subsets summing to 9:
  [3, 4, 2]
  [4, 5]
Found 2 subsets
Subsets summing to 100: 0 (nothing reaches it)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
