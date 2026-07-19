<!-- canonical: efficientnewlanguage.org/ai/examples/020-duplicate-remover | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 020 — Duplicate remover

`duplicate_remover.eml` removes duplicates from a sample grocery-basket list while preserving first-seen order — one of a seven-case self-authored batch of list/collection utilities for the EML case corpus (see [`examples/list-statistics/`](../list-statistics/), [`examples/list-rotator/`](../list-rotator/), [`examples/matrix-transpose-manual/`](../matrix-transpose-manual/), [`examples/intersection-union-finder/`](../intersection-union-finder/), [`examples/second-largest-finder/`](../second-largest-finder/), and [`examples/shopping-cart-total/`](../shopping-cart-total/) for the other six).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Removes
# duplicates from a sample list while preserving first-seen order, using a
# dict as a hash-based "seen" tracker (`item => True` on first sight, `in`
# membership check thereafter) plus list growth via `+` (no `.append()`).
# A real Python `set` was tried first for "seen" tracking, but every way to
# grow one — `set(existing_list)` conversion or the `.add()` method — is an
# `eml:unsupported` construct the interpreter defers on entirely, which
# skips the `eml:equiv` equivalence check rather than just flagging an
# anomaly; a dict-as-set (a common pre-`set()` Python idiom) gives the same
# O(1) membership behavior while staying fully interpreter-modeled.

items^+["apple", "banana", "apple", "cherry", "banana", "date", "apple",
        "elderberry", "cherry", "fig"]

seen^+{}
result^+[]

for item in items:
    if not item in seen:
        True => seen[item]
        result + [item] => result

"Original: " + str(items) => msg1
msg1^0
"De-duplicated (order preserved): " + str(result) => msg2
msg2^0
```

## Python (deterministic transpilation)

```python
items = ["apple", "banana", "apple", "cherry", "banana", "date", "apple", "elderberry", "cherry", "fig"]
seen = {}
result = []
for item in items:
    if not item in seen:
        seen[item] = True
        result = result + [item]
msg1 = "Original: " + str(items)
print(msg1)
msg2 = "De-duplicated (order preserved): " + str(result)
print(msg2)
```

## stdout (executed)

```text
Original: ['apple', 'banana', 'apple', 'cherry', 'banana', 'date', 'apple', 'elderberry', 'cherry', 'fig']
De-duplicated (order preserved): ['apple', 'banana', 'cherry', 'date', 'elderberry', 'fig']
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
