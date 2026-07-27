<!-- canonical: efficientnewlanguage.org/ai/examples/121-permutations-generator | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 121 — Permutations generator

`permutations_generator.eml` produces every ordering of a list — all 6 of `["A","B","C"]`, then confirms 24 for a four-item list.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Generates
# every ordering of a list by recursive backtracking: pick an unused item,
# recurse on the rest, then release it so the next branch can use it.
#
# The two pieces of state are handled deliberately differently, and the
# contrast is the point of the case:
#
#   `used`    is a flag list mutated in place, so a write is visible to
#             every deeper call — which means it MUST be undone
#             (`0 => used[i]`) after the recursive call returns, or later
#             branches would see items still marked as taken.
#
#   `current` is rebuilt by `+` on the way down, so each call receives its
#             own prefix and nothing needs undoing at all.
#
# Same algorithm, two kinds of state, only one of which needs a manual
# "step back". Getting that asymmetry wrong is the classic backtracking
# bug, and here it would show up immediately as a short result list.

def permute(items, current, used, results):
    len(items) => n
    if len(current) == n:
        snapshot^+[]
        for c in current:
            snapshot + [c] => snapshot
        results + [snapshot] => results
        return results
    0 => i
    while i < n:
        if used[i] == 0:
            1 => used[i]
            permute(items, current + [items[i]], used, results) => results
            0 => used[i]
        i + 1 => i
    return results

def all_permutations(items):
    used^+[]
    for item in items:
        used + [0] => used
    results^+[]
    permute(items, [], used, results) => results
    return results

letters^+["A", "B", "C"]
all_permutations(letters) => perms

"Permutations of " + str(letters) + ":" => header
header^0
for perm in perms:
    "" => rendered
    for ch in perm:
        rendered + ch => rendered
    "  " + rendered => line
    line^0

"Count: " + str(len(perms)) + " (3! = 6)" => summary
summary^0

four^+["A", "B", "C", "D"]
all_permutations(four) => perms4
"Permutations of 4 items: " + str(len(perms4)) + " (4! = 24)" => summary4
summary4^0
```

## Python (deterministic transpilation)

```python
def permute(items, current, used, results):
    n = len(items)
    if len(current) == n:
        snapshot = []
        for c in current:
            snapshot = snapshot + [c]
        results = results + [snapshot]
        return results
    i = 0
    while i < n:
        if used[i] == 0:
            used[i] = 1
            results = permute(items, current + [items[i]], used, results)
            used[i] = 0
        i = i + 1
    return results

def all_permutations(items):
    used = []
    for item in items:
        used = used + [0]
    results = []
    results = permute(items, [], used, results)
    return results

letters = ["A", "B", "C"]
perms = all_permutations(letters)
header = "Permutations of " + str(letters) + ":"
print(header)
for perm in perms:
    rendered = ""
    for ch in perm:
        rendered = rendered + ch
    line = "  " + rendered
    print(line)
summary = "Count: " + str(len(perms)) + " (3! = 6)"
print(summary)
four = ["A", "B", "C", "D"]
perms4 = all_permutations(four)
summary4 = "Permutations of 4 items: " + str(len(perms4)) + " (4! = 24)"
print(summary4)
```

## stdout (executed)

```text
Permutations of ['A', 'B', 'C']:
  ABC
  ACB
  BAC
  BCA
  CAB
  CBA
Count: 6 (3! = 6)
Permutations of 4 items: 24 (4! = 24)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
