<!-- canonical: efficientnewlanguage.org/ai/examples/024-intersection-union-finder | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 024 — Intersection / union finder

`intersection_union_finder.eml` computes the intersection and union of two sample lists of team-roster names — one of a seven-case self-authored batch of list/collection utilities for the EML case corpus (see [`examples/list-statistics/`](../list-statistics/), [`examples/duplicate-remover/`](../duplicate-remover/), [`examples/list-rotator/`](../list-rotator/), [`examples/matrix-transpose-manual/`](../matrix-transpose-manual/), [`examples/second-largest-finder/`](../second-largest-finder/), and [`examples/shopping-cart-total/`](../shopping-cart-total/) for the other six).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Computes the
# intersection and union of two sample lists via manual loops with `in`
# membership checks. A real Python `set` was tried first (as the task
# implies with `{...}` literals): the `&`/`|` set operators aren't even
# lexable in EML (`E_LEX: Unexpected character: "&"`), the `.intersection()`
# /`.union()` methods work under real Python but are `eml:unsupported` under
# the interpreter (method calls on builtin types aren't modeled), and
# iterating a raw set directly (`for x in a_set:`) throws `TypeError: 'set'
# object is not iterable` inside the interpreter even though real Python
# handles it fine — plus real-Python set iteration order is hash-based and
# not guaranteed stable. Manual loops over plain lists sidestep all three
# problems and keep iteration order deterministic.

team_a^+["Alice", "Bob", "Carol", "Dave", "Erin"]
team_b^+["Carol", "Dave", "Frank", "Grace"]

intersection^+[]
for name in team_a:
    if name in team_b:
        intersection + [name] => intersection

union^+[]
for name in team_a:
    union + [name] => union
for name in team_b:
    if not name in union:
        union + [name] => union

"Team A: " + str(team_a) => msg1
msg1^0
"Team B: " + str(team_b) => msg2
msg2^0
"Intersection: " + str(intersection) => msg3
msg3^0
"Union: " + str(union) => msg4
msg4^0
```

## Python (deterministic transpilation)

```python
team_a = ["Alice", "Bob", "Carol", "Dave", "Erin"]
team_b = ["Carol", "Dave", "Frank", "Grace"]
intersection = []
for name in team_a:
    if name in team_b:
        intersection = intersection + [name]
union = []
for name in team_a:
    union = union + [name]
for name in team_b:
    if not name in union:
        union = union + [name]
msg1 = "Team A: " + str(team_a)
print(msg1)
msg2 = "Team B: " + str(team_b)
print(msg2)
msg3 = "Intersection: " + str(intersection)
print(msg3)
msg4 = "Union: " + str(union)
print(msg4)
```

## stdout (executed)

```text
Team A: ['Alice', 'Bob', 'Carol', 'Dave', 'Erin']
Team B: ['Carol', 'Dave', 'Frank', 'Grace']
Intersection: ['Carol', 'Dave']
Union: ['Alice', 'Bob', 'Carol', 'Dave', 'Erin', 'Frank', 'Grace']
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
