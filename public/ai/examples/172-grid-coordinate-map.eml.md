<!-- canonical: efficientnewlanguage.org/ai/examples/172-grid-coordinate-map | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 172 — A grid keyed by (row, col)

`grid_coordinate_map.eml` — a sparse grid whose keys are coordinate tuples.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A sparse grid
# keyed by (row, col) tuples - which is the single most common reason anyone
# reaches for a tuple in the first place, and which did not work here until
# this case was written.
#
# `canonicalKey` rejected tuples outright, so `grid[(2, 3)]` raised
# "unhashable type: 'tuple'". The workaround people fall back on is a string
# key like "2,3", and that workaround is worse than it looks: it stringifies,
# so (2, 3) and ("2", 3) collide, and you cannot get the coordinates back
# without parsing. A tuple key keeps the parts as values.
#
# Hashability is RECURSIVE in Python: a tuple is hashable exactly when all of
# its elements are. `(1, [2])` is not hashable, and this now raises here too
# rather than silently computing some key.

def neighbours(cell):
    cell[0] => r
    cell[1] => c
    return [(r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)]

def occupied(grid, cell):
    if cell in grid:
        return 1
    return 0

{(0, 0): "start", (1, 0): "wall", (2, 2): "goal", (1, 2): "wall"} => grid

("Cells recorded: " + str(len(grid)))^0
""^0

"cell     contents" => header
header^0
"-------  --------" => rule
rule^0
for cell in grid:
    str(cell) => shown
    9 - len(shown) => pad
    if pad < 1:
        1 => pad
    (shown + " " * pad + grid[cell])^0

""^0
(1, 1) => probe
("Neighbours of " + str(probe) + ": " + str(neighbours(probe)))^0
0 => blocked
for n in neighbours(probe):
    blocked + occupied(grid, n) => blocked
("  of those, " + str(blocked) + " are recorded in the grid")^0
""^0

# The coordinates survive as values - no parsing needed to get them back.
(2, 2) => goal
("Goal " + str(goal) + " is at row " + str(goal[0]) + ", col " + str(goal[1]))^0
("Lookup by an equal tuple works: " + grid[(2, 2)])^0
""^0

# Recursive hashability: a tuple holding a list cannot be a key.
try:
    {(1, [2]): "nope"} => bad
    "  built a dict keyed by (1, [2]) - unreachable" => oops
    oops^0
except TypeError as e:
    ("A tuple containing a list is not hashable: " + str(e))^0
```

## Python (deterministic transpilation)

```python
def neighbours(cell):
    r = cell[0]
    c = cell[1]
    return [(r - 1, c), (r + 1, c), (r, c - 1), (r, c + 1)]

def occupied(grid, cell):
    if cell in grid:
        return 1
    return 0

grid = {(0, 0): "start", (1, 0): "wall", (2, 2): "goal", (1, 2): "wall"}
print("Cells recorded: " + str(len(grid)))
print("")
header = "cell     contents"
print(header)
rule = "-------  --------"
print(rule)
for cell in grid:
    shown = str(cell)
    pad = 9 - len(shown)
    if pad < 1:
        pad = 1
    print(shown + " " * pad + grid[cell])
print("")
probe = (1, 1)
print("Neighbours of " + str(probe) + ": " + str(neighbours(probe)))
blocked = 0
for n in neighbours(probe):
    blocked = blocked + occupied(grid, n)
print("  of those, " + str(blocked) + " are recorded in the grid")
print("")
goal = (2, 2)
print("Goal " + str(goal) + " is at row " + str(goal[0]) + ", col " + str(goal[1]))
print("Lookup by an equal tuple works: " + grid[(2, 2)])
print("")
try:
    bad = {(1, [2]): "nope"}
    oops = "  built a dict keyed by (1, [2]) - unreachable"
    print(oops)
except TypeError as e:
    print("A tuple containing a list is not hashable: " + str(e))
```

## stdout (executed)

```text
Cells recorded: 4

cell     contents
-------  --------
(0, 0)   start
(1, 0)   wall
(2, 2)   goal
(1, 2)   wall

Neighbours of (1, 1): [(0, 1), (2, 1), (1, 0), (1, 2)]
  of those, 2 are recorded in the grid

Goal (2, 2) is at row 2, col 2
Lookup by an equal tuple works: goal

A tuple containing a list is not hashable: cannot use 'tuple' as a dict key (unhashable type: 'list')
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
