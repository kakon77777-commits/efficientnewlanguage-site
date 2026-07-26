<!-- canonical: efficientnewlanguage.org/ai/examples/097-conway-game-of-life | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 097 — Conway's Game of Life

`conway_game_of_life.eml` evolves a glider on a 6x6 grid for four generations, printing every generation.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Conway's
# Game of Life: every cell lives or dies based only on how many of its
# eight neighbors are alive. The corpus's first cellular automaton, and
# its first case where the grid must be DOUBLE-BUFFERED — every cell in a
# generation reads the previous generation, so writing results back into
# the grid being read would let earlier updates corrupt later neighbor
# counts. `step` therefore builds and returns a brand-new grid, unlike
# examples/flood-fill/ which mutates its grid in place on purpose.
#
# The pattern is a glider, chosen because it is self-checking: a glider
# has period 4 and returns to its exact original shape displaced one cell
# down and one cell right. If any rule is subtly wrong the shape decays or
# freezes instead, which is far more obvious than a wrong number would be.

def count_neighbors(grid, row, col):
    len(grid) => rows
    len(grid[0]) => cols
    0 => count
    for dr_index in [0:2]:
        dr_index - 1 => dr
        for dc_index in [0:2]:
            dc_index - 1 => dc
            if dr == 0 and dc == 0:
                continue
            row + dr => r
            col + dc => c
            if r >= 0 and r < rows and c >= 0 and c < cols:
                if grid[r][c] == 1:
                    count + 1 => count
    return count

def step(grid):
    len(grid) => rows
    len(grid[0]) => cols
    next_grid^+[]
    0 => r
    while r < rows:
        row^+[]
        0 => c
        while c < cols:
            count_neighbors(grid, r, c) => neighbors
            0 => new_cell
            if grid[r][c] == 1:
                if neighbors == 2 or neighbors == 3:
                    1 => new_cell
            else:
                if neighbors == 3:
                    1 => new_cell
            row + [new_cell] => row
            c + 1 => c
        next_grid + [row] => next_grid
        r + 1 => r
    return next_grid

def render(grid, label):
    label^0
    for row in grid:
        "" => rendered
        for cell in row:
            if cell == 1:
                rendered + "#" => rendered
            else:
                rendered + "." => rendered
        rendered^0
    "" => blank
    blank^0

grid^+[[0, 1, 0, 0, 0, 0],
       [0, 0, 1, 0, 0, 0],
       [1, 1, 1, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0]]

render(grid, "Generation 0 (glider):")

for generation in [1:4]:
    step(grid) => grid
    render(grid, "Generation " + str(generation) + ":")

0 => alive
for row in grid:
    for cell in row:
        alive + cell => alive

"Cells alive after 4 generations: " + str(alive) + " (a glider always keeps 5)" => summary
summary^0
```

## Python (deterministic transpilation)

```python
def count_neighbors(grid, row, col):
    rows = len(grid)
    cols = len(grid[0])
    count = 0
    for dr_index in range(0, 3):
        dr = dr_index - 1
        for dc_index in range(0, 3):
            dc = dc_index - 1
            if dr == 0 and dc == 0:
                continue
            r = row + dr
            c = col + dc
            if r >= 0 and r < rows and c >= 0 and c < cols:
                if grid[r][c] == 1:
                    count = count + 1
    return count

def step(grid):
    rows = len(grid)
    cols = len(grid[0])
    next_grid = []
    r = 0
    while r < rows:
        row = []
        c = 0
        while c < cols:
            neighbors = count_neighbors(grid, r, c)
            new_cell = 0
            if grid[r][c] == 1:
                if neighbors == 2 or neighbors == 3:
                    new_cell = 1
            elif neighbors == 3:
                new_cell = 1
            row = row + [new_cell]
            c = c + 1
        next_grid = next_grid + [row]
        r = r + 1
    return next_grid

def render(grid, label):
    print(label)
    for row in grid:
        rendered = ""
        for cell in row:
            if cell == 1:
                rendered = rendered + "#"
            else:
                rendered = rendered + "."
        print(rendered)
    blank = ""
    print(blank)

grid = [[0, 1, 0, 0, 0, 0], [0, 0, 1, 0, 0, 0], [1, 1, 1, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0], [0, 0, 0, 0, 0, 0]]
render(grid, "Generation 0 (glider):")
for generation in range(1, 5):
    grid = step(grid)
    render(grid, "Generation " + str(generation) + ":")
alive = 0
for row in grid:
    for cell in row:
        alive = alive + cell
summary = "Cells alive after 4 generations: " + str(alive) + " (a glider always keeps 5)"
print(summary)
```

## stdout (executed)

```text
Generation 0 (glider):
.#....
..#...
###...
......
......
......

Generation 1:
......
#.#...
.##...
.#....
......
......

Generation 2:
......
..#...
#.#...
.##...
......
......

Generation 3:
......
.#....
..##..
.##...
......
......

Generation 4:
......
..#...
...#..
.###..
......
......

Cells alive after 4 generations: 5 (a glider always keeps 5)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:output · eml:return · eml:run:done
