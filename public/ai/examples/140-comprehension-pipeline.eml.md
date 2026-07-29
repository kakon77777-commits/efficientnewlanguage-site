<!-- canonical: efficientnewlanguage.org/ai/examples/140-comprehension-pipeline | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 140 — List comprehensions, and what they do differently

`comprehension_pipeline.eml` examines list comprehensions — four corpus programs had used one, none had looked at it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). List
# comprehensions, which four corpus programs had used and none had examined.
#
# A comprehension is a loop that produces a list, and the useful question is
# what it does DIFFERENTLY from the loop you would otherwise write. Three
# things, each shown below against its hand-written equivalent so the claim is
# checked rather than stated:
#
#   the filter runs BEFORE the expression, so `[10 / n for n in xs if n != 0]`
#   is safe on a list containing zero - the division never sees it
#
#   the iteration variable does NOT leak, unlike a `for` loop's, which is
#   still bound after the loop ends
#
#   an empty input gives an empty list, with no special case needed
#
# The last section is the honest part: EML supports exactly one `for` clause
# and one optional `if`. Nested comprehensions and multiple filters are not in
# the grammar, so a nested transform is written as a loop over comprehensions -
# which is what the equivalent Python would do anyway once it got wide enough
# to need a name.

readings^+[12, 0, 45, 7, 0, 33, 91, 4]
("readings: " + str(readings))^0
""^0

"1. Filter runs before the expression:" => h1
h1^0
[100 / n for n in readings if n != 0] => safe
("  [100 / n for n in readings if n != 0]")^0
("  -> " + str(len(safe)) + " values, no ZeroDivisionError")^0

[] => by_hand
for n in readings:
    if n != 0:
        by_hand + [100 / n] => by_hand
if safe == by_hand:
    "  identical to the hand-written loop" => v1
else:
    "  DIFFERS from the hand-written loop" => v1
v1^0

""^0
"2. The iteration variable does not leak:" => h2
h2^0
0 => n
[x * 2 for x in readings] => doubled
("  after the comprehension, n is still " + str(n))^0
for n in readings:
    0 => ignored
("  after the for loop,       n is now  " + str(n))^0
"  The comprehension's `x` was never visible out here at all." => n2
n2^0

""^0
"3. Empty input needs no special case:" => h3
h3^0
[] => nothing
("  [v * 2 for v in []] -> " + str([v * 2 for v in nothing]))^0
("  [v for v in readings if v > 1000] -> " + str([v for v in readings if v > 1000]))^0

""^0
"4. Composing them:" => h4
h4^0
[n for n in readings if n != 0] => nonzero
[n for n in nonzero if n % 2 == 1] => odd
[n * n for n in odd] => squared
("  nonzero: " + str(nonzero))^0
("  odd:     " + str(odd))^0
("  squared: " + str(squared))^0
Σ(squared[i], i in [0:len(squared) - 1]) => total
("  sum of squares of the odd nonzero readings: " + str(total))^0

""^0
"5. What EML does NOT have, and what to write instead:" => h5
h5^0
"  one `for` and one optional `if` per comprehension - no nesting," => n5
n5^0
"  no second filter. A nested transform becomes a loop over comprehensions:" => n5b
n5b^0

grid^+[[1, 2, 3], [4, 5, 6], [7, 8, 9]]
[] => scaled
for row in grid:
    scaled + [[cell * 10 for cell in row]] => scaled
("  " + str(grid))^0
("  -> " + str(scaled))^0
"  which is what the wide Python version would end up as anyway." => n5c
n5c^0
```

## Python (deterministic transpilation)

```python
readings = [12, 0, 45, 7, 0, 33, 91, 4]
print("readings: " + str(readings))
print("")
h1 = "1. Filter runs before the expression:"
print(h1)
safe = [100 / n for n in readings if n != 0]
print("  [100 / n for n in readings if n != 0]")
print("  -> " + str(len(safe)) + " values, no ZeroDivisionError")
by_hand = []
for n in readings:
    if n != 0:
        by_hand = by_hand + [100 / n]
if safe == by_hand:
    v1 = "  identical to the hand-written loop"
else:
    v1 = "  DIFFERS from the hand-written loop"
print(v1)
print("")
h2 = "2. The iteration variable does not leak:"
print(h2)
n = 0
doubled = [x * 2 for x in readings]
print("  after the comprehension, n is still " + str(n))
for n in readings:
    ignored = 0
print("  after the for loop,       n is now  " + str(n))
n2 = "  The comprehension's `x` was never visible out here at all."
print(n2)
print("")
h3 = "3. Empty input needs no special case:"
print(h3)
nothing = []
print("  [v * 2 for v in []] -> " + str([v * 2 for v in nothing]))
print("  [v for v in readings if v > 1000] -> " + str([v for v in readings if v > 1000]))
print("")
h4 = "4. Composing them:"
print(h4)
nonzero = [n for n in readings if n != 0]
odd = [n for n in nonzero if n % 2 == 1]
squared = [n * n for n in odd]
print("  nonzero: " + str(nonzero))
print("  odd:     " + str(odd))
print("  squared: " + str(squared))
total = sum(squared[i] for i in range(0, len(squared)))
print("  sum of squares of the odd nonzero readings: " + str(total))
print("")
h5 = "5. What EML does NOT have, and what to write instead:"
print(h5)
n5 = "  one `for` and one optional `if` per comprehension - no nesting,"
print(n5)
n5b = "  no second filter. A nested transform becomes a loop over comprehensions:"
print(n5b)
grid = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
scaled = []
for row in grid:
    scaled = scaled + [[cell * 10 for cell in row]]
print("  " + str(grid))
print("  -> " + str(scaled))
n5c = "  which is what the wide Python version would end up as anyway."
print(n5c)
```

## stdout (executed)

```text
readings: [12, 0, 45, 7, 0, 33, 91, 4]

1. Filter runs before the expression:
  [100 / n for n in readings if n != 0]
  -> 6 values, no ZeroDivisionError
  identical to the hand-written loop

2. The iteration variable does not leak:
  after the comprehension, n is still 0
  after the for loop,       n is now  4
  The comprehension's `x` was never visible out here at all.

3. Empty input needs no special case:
  [v * 2 for v in []] -> []
  [v for v in readings if v > 1000] -> []

4. Composing them:
  nonzero: [12, 45, 7, 33, 91, 4]
  odd:     [45, 7, 33, 91]
  squared: [2025, 49, 1089, 8281]
  sum of squares of the odd nonzero readings: 11444

5. What EML does NOT have, and what to write instead:
  one `for` and one optional `if` per comprehension - no nesting,
  no second filter. A nested transform becomes a loop over comprehensions:
  [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
  -> [[10, 20, 30], [40, 50, 60], [70, 80, 90]]
  which is what the wide Python version would end up as anyway.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:sum · eml:run:done
