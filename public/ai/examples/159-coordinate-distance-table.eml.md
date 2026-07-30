<!-- canonical: efficientnewlanguage.org/ai/examples/159-coordinate-distance-table | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 159 — Points are tuples

`coordinate_distance_table.eml` measures four points against the origin, two ways.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Points are the
# canonical use of a tuple: a fixed-size record where position carries meaning
# and nothing should ever be appended. `(x, y)` is not a list of two numbers -
# it is one thing with two parts.
#
# The builtins now treat a tuple as an ordinary sequence, which they did not
# before this round. `len((1, 2, 3))` raised TypeError, and `sum((1, 2, 3))`
# raised TypeError, in both cases because the interpreter's list of "things
# with a length" and "things you can iterate" had been written out by hand in
# three places and tuple was missing from two of them. They now share one
# definition.

def squared_distance(a, b):
    a[0] - b[0] => dx
    a[1] - b[1] => dy
    return dx * dx + dy * dy

def manhattan(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

[(0, 0), (3, 4), (6, 8), (0 - 2, 1)] => points
(0, 0) => origin

("Points: " + str(len(points)) + ", each of arity " + str(len(points[0])))^0
""^0

"point       squared  manhattan" => header
header^0
"----------  -------  ---------" => rule
rule^0
for p in points:
    str(p) => shown
    12 - len(shown) => pad
    if pad < 1:
        1 => pad
    (shown + " " * pad + str(squared_distance(origin, p)) + "        " + str(manhattan(origin, p)))^0

""^0
# A tuple is iterable, so the builtins work on one directly.
(3, 4) => p
("For " + str(p) + ":  len=" + str(len(p)) + "  sum=" + str(sum(p)) + "  max=" + str(max(p)) + "  min=" + str(min(p)))^0
""^0

# Tuples compare element by element, left to right - so sorting points by
# tuple order is lexicographic, not by distance.
("(1, 5) < (2, 0) is " + str((1, 5) < (2, 0)) + "   <- first element decides")^0
("(2, 0) < (2, 9) is " + str((2, 0) < (2, 9)) + "   <- tie, so the second decides")^0
("(1, 2) == (1, 2) is " + str((1, 2) == (1, 2)) + "  <- equal by VALUE, not identity")^0
```

## Python (deterministic transpilation)

```python
def squared_distance(a, b):
    dx = a[0] - b[0]
    dy = a[1] - b[1]
    return dx * dx + dy * dy

def manhattan(a, b):
    return abs(a[0] - b[0]) + abs(a[1] - b[1])

points = [(0, 0), (3, 4), (6, 8), (0 - 2, 1)]
origin = (0, 0)
print("Points: " + str(len(points)) + ", each of arity " + str(len(points[0])))
print("")
header = "point       squared  manhattan"
print(header)
rule = "----------  -------  ---------"
print(rule)
for p in points:
    shown = str(p)
    pad = 12 - len(shown)
    if pad < 1:
        pad = 1
    print(shown + " " * pad + str(squared_distance(origin, p)) + "        " + str(manhattan(origin, p)))
print("")
p = (3, 4)
print("For " + str(p) + ":  len=" + str(len(p)) + "  sum=" + str(sum(p)) + "  max=" + str(max(p)) + "  min=" + str(min(p)))
print("")
print("(1, 5) < (2, 0) is " + str((1, 5) < (2, 0)) + "   <- first element decides")
print("(2, 0) < (2, 9) is " + str((2, 0) < (2, 9)) + "   <- tie, so the second decides")
print("(1, 2) == (1, 2) is " + str((1, 2) == (1, 2)) + "  <- equal by VALUE, not identity")
```

## stdout (executed)

```text
Points: 4, each of arity 2

point       squared  manhattan
----------  -------  ---------
(0, 0)      0        0
(3, 4)      25        7
(6, 8)      100        14
(-2, 1)     5        3

For (3, 4):  len=2  sum=7  max=4  min=3

(1, 5) < (2, 0) is True   <- first element decides
(2, 0) < (2, 9) is True   <- tie, so the second decides
(1, 2) == (1, 2) is True  <- equal by VALUE, not identity
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
