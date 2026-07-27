<!-- canonical: efficientnewlanguage.org/ai/examples/116-maze-solver-backtracking | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 116 — Maze solver (backtracking)

`maze_solver_backtracking.eml` finds a route through a 6x6 maze from the top-left to the bottom-right, then renders the board with the path marked:

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finds a path
# through a maze by backtracking: step into a neighbor, mark it, recurse,
# and if that branch dead-ends, UNMARK it and try the next direction. The
# unmark is the whole difference between this and
# examples/flood-fill/, which marks cells and never takes a mark back
# because it wants to reach everything rather than find a route.
#
# It finds *a* path, not the shortest one. Breadth-first search
# (examples/graph-bfs-traversal/) would give the shortest, because it
# explores by distance; this commits to a direction and only reconsiders
# when stuck. The maze below is built so that difference is visible in the
# output: trying DOWN first sends it along the left edge and around the
# bottom for 13 cells, while an 11-cell route straight across the top row
# and down the right column was open the whole time — those unused cells
# are still printed as dots, so the shortcut it never took can be read off
# the rendered board.

# Returns the path as a list of [row, col] steps, or an empty list if this
# branch dead-ends. It deliberately does NOT write into a module-level
# result list: assigning to a name anywhere in a function body makes that
# name local for the whole body in Python, so `solution + [x] => solution`
# inside here would shadow the outer list and raise UnboundLocalError on
# the first read. Returning the path avoids the problem outright.
def solve(maze, path, row, col, goal_row, goal_col):
    len(maze) => rows
    len(maze[0]) => cols
    if row < 0 or row >= rows:
        return []
    if col < 0 or col >= cols:
        return []
    if maze[row][col] != 0:
        return []
    2 => maze[row][col]
    path + [[row, col]] => path2
    if row == goal_row and col == goal_col:
        return path2
    solve(maze, path2, row + 1, col, goal_row, goal_col) => down
    if len(down) > 0:
        return down
    solve(maze, path2, row, col + 1, goal_row, goal_col) => right
    if len(right) > 0:
        return right
    solve(maze, path2, row - 1, col, goal_row, goal_col) => up
    if len(up) > 0:
        return up
    solve(maze, path2, row, col - 1, goal_row, goal_col) => left
    if len(left) > 0:
        return left
    0 => maze[row][col]
    return []

maze^+[[0, 0, 0, 0, 0, 0],
       [0, 1, 1, 1, 1, 0],
       [0, 1, 0, 0, 1, 0],
       [0, 1, 0, 1, 1, 0],
       [0, 1, 0, 0, 0, 0],
       [0, 0, 0, 1, 1, 0]]

solve(maze, [], 0, 0, 5, 5) => solution

if len(solution) > 0:
    "Path found, " + str(len(solution)) + " cells:" => header
else:
    "No path exists" => header
header^0

for r in [0:5]:
    "" => rendered
    for c in [0:5]:
        0 => marker
        for step in solution:
            if step[0] == r and step[1] == c:
                1 => marker
        if marker == 1:
            rendered + "*" => rendered
        elif maze[r][c] == 1:
            rendered + "#" => rendered
        else:
            rendered + "." => rendered
    rendered^0
```

## Python (deterministic transpilation)

```python
def solve(maze, path, row, col, goal_row, goal_col):
    rows = len(maze)
    cols = len(maze[0])
    if row < 0 or row >= rows:
        return []
    if col < 0 or col >= cols:
        return []
    if maze[row][col] != 0:
        return []
    maze[row][col] = 2
    path2 = path + [[row, col]]
    if row == goal_row and col == goal_col:
        return path2
    down = solve(maze, path2, row + 1, col, goal_row, goal_col)
    if len(down) > 0:
        return down
    right = solve(maze, path2, row, col + 1, goal_row, goal_col)
    if len(right) > 0:
        return right
    up = solve(maze, path2, row - 1, col, goal_row, goal_col)
    if len(up) > 0:
        return up
    left = solve(maze, path2, row, col - 1, goal_row, goal_col)
    if len(left) > 0:
        return left
    maze[row][col] = 0
    return []

maze = [[0, 0, 0, 0, 0, 0], [0, 1, 1, 1, 1, 0], [0, 1, 0, 0, 1, 0], [0, 1, 0, 1, 1, 0], [0, 1, 0, 0, 0, 0], [0, 0, 0, 1, 1, 0]]
solution = solve(maze, [], 0, 0, 5, 5)
if len(solution) > 0:
    header = "Path found, " + str(len(solution)) + " cells:"
else:
    header = "No path exists"
print(header)
for r in range(0, 6):
    rendered = ""
    for c in range(0, 6):
        marker = 0
        for step in solution:
            if step[0] == r and step[1] == c:
                marker = 1
        if marker == 1:
            rendered = rendered + "*"
        elif maze[r][c] == 1:
            rendered = rendered + "#"
        else:
            rendered = rendered + "."
    print(rendered)
```

## stdout (executed)

```text
Path found, 13 cells:
*.....
*####.
*#..#.
*#.##.
*#****
***##*
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
