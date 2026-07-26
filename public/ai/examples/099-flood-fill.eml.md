<!-- canonical: efficientnewlanguage.org/ai/examples/099-flood-fill | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 099 — Flood fill

`flood_fill.eml` is the paint-bucket tool: starting from one cell, spread into the four orthogonal neighbors for as long as they still hold the original color. Prints the grid before and after, filling 13 cells from `(0,2)`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The paint-
# bucket tool: starting from one cell, recursively spread into the four
# orthogonal neighbors for as long as they still hold the original color.
# The corpus's first 2D grid traversal — the same recursive shape as
# examples/graph-dfs-recursive/, but the "graph" here is implicit in the
# grid coordinates rather than stored as an adjacency dict.
#
# Unlike that case, nothing needs returning: the grid is mutated in place
# through chained subscript assignment (`replacement => grid[row][col]`),
# so every recursive call's work is visible to its caller by reference.
# Repainting the cell BEFORE recursing is what keeps this terminating —
# it is what stops a neighbor from immediately painting back.

def flood_fill(grid, row, col, target, replacement):
    len(grid) => rows
    len(grid[0]) => cols
    if row < 0 or row >= rows:
        return 0
    if col < 0 or col >= cols:
        return 0
    if grid[row][col] != target:
        return 0
    replacement => grid[row][col]
    1 => filled
    filled + flood_fill(grid, row + 1, col, target, replacement) => filled
    filled + flood_fill(grid, row - 1, col, target, replacement) => filled
    filled + flood_fill(grid, row, col + 1, target, replacement) => filled
    filled + flood_fill(grid, row, col - 1, target, replacement) => filled
    return filled

# The bottom two rows are a pocket sealed off by a solid wall, so they must
# survive the fill untouched — that is what shows the fill respects
# boundaries rather than simply repainting every matching cell.
grid^+[["#", "#", ".", ".", "."],
       ["#", ".", ".", "#", "."],
       [".", ".", ".", "#", "."],
       [".", "#", "#", ".", "."],
       ["#", "#", "#", "#", "#"],
       ["#", ".", ".", ".", "#"]]

"Before:" => header1
header1^0
for row in grid:
    "" => rendered
    for cell in row:
        rendered + cell => rendered
    rendered^0

flood_fill(grid, 0, 2, ".", "*") => filled

"" => blank
blank^0
"Filled " + str(filled) + " cells from (0,2)" => count_line
count_line^0
"After:" => header2
header2^0
for row in grid:
    "" => rendered
    for cell in row:
        rendered + cell => rendered
    rendered^0
```

## Python (deterministic transpilation)

```python
def flood_fill(grid, row, col, target, replacement):
    rows = len(grid)
    cols = len(grid[0])
    if row < 0 or row >= rows:
        return 0
    if col < 0 or col >= cols:
        return 0
    if grid[row][col] != target:
        return 0
    grid[row][col] = replacement
    filled = 1
    filled = filled + flood_fill(grid, row + 1, col, target, replacement)
    filled = filled + flood_fill(grid, row - 1, col, target, replacement)
    filled = filled + flood_fill(grid, row, col + 1, target, replacement)
    filled = filled + flood_fill(grid, row, col - 1, target, replacement)
    return filled

grid = [["#", "#", ".", ".", "."], ["#", ".", ".", "#", "."], [".", ".", ".", "#", "."], [".", "#", "#", ".", "."], ["#", "#", "#", "#", "#"], ["#", ".", ".", ".", "#"]]
header1 = "Before:"
print(header1)
for row in grid:
    rendered = ""
    for cell in row:
        rendered = rendered + cell
    print(rendered)
filled = flood_fill(grid, 0, 2, ".", "*")
blank = ""
print(blank)
count_line = "Filled " + str(filled) + " cells from (0,2)"
print(count_line)
header2 = "After:"
print(header2)
for row in grid:
    rendered = ""
    for cell in row:
        rendered = rendered + cell
    print(rendered)
```

## stdout (executed)

```text
Before:
##...
#..#.
...#.
.##..
#####
#...#

Filled 13 cells from (0,2)
After:
##***
#**#*
***#*
*##**
#####
#...#
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
