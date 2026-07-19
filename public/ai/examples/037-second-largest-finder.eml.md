<!-- canonical: efficientnewlanguage.org/ai/examples/037-second-largest-finder | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 037 — Second-largest finder

`second_largest_finder.eml` finds the largest and second-largest *distinct* values in a sample list of exam scores (with repeats) via a manual single-pass loop tracking two running maxima — one of a seven-case self-authored batch of list/collection utilities for the EML case corpus (see [`examples/list-statistics/`](../list-statistics/), [`examples/duplicate-remover/`](../duplicate-remover/), [`examples/list-rotator/`](../list-rotator/), [`examples/matrix-transpose-manual/`](../matrix-transpose-manual/), [`examples/intersection-union-finder/`](../intersection-union-finder/), and [`examples/shopping-cart-total/`](../shopping-cart-total/) for the other six).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finds the
# largest and second-largest *distinct* values in a sample list of numbers
# (with repeats) via a single-pass loop tracking two running maxima —
# `largest` and `second` — updating both correctly when a new largest is
# found, and skipping equal-to-largest values so a repeated maximum never
# gets counted as its own second place.

scores^+[88, 95, 72, 95, 61, 90, 84]

scores[0] => largest
second^+-1
found_second^+False

for score in scores:
    if score > largest:
        largest => second
        score => largest
        True => found_second
    elif score < largest:
        if score > second:
            score => second
            True => found_second

"Scores: " + str(scores) => msg1
msg1^0
"Largest: " + str(largest) => msg2
msg2^0
if found_second:
    "Second-largest: " + str(second) => msg3
    msg3^0
else:
    "No distinct second-largest value found"^0
```

## Python (deterministic transpilation)

```python
scores = [88, 95, 72, 95, 61, 90, 84]
largest = scores[0]
second = -1
found_second = False
for score in scores:
    if score > largest:
        second = largest
        largest = score
        found_second = True
    elif score < largest:
        if score > second:
            second = score
            found_second = True
msg1 = "Scores: " + str(scores)
print(msg1)
msg2 = "Largest: " + str(largest)
print(msg2)
if found_second:
    msg3 = "Second-largest: " + str(second)
    print(msg3)
else:
    print("No distinct second-largest value found")
```

## stdout (executed)

```text
Scores: [88, 95, 72, 95, 61, 90, 84]
Largest: 95
Second-largest: 90
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
