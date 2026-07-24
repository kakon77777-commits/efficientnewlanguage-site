<!-- canonical: efficientnewlanguage.org/ai/examples/077-tower-of-hanoi | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 077 — Tower of Hanoi

`tower_of_hanoi.eml` solves the classic Tower of Hanoi puzzle for 3 disks, moving them from peg `A` to peg `C` using peg `B` as auxiliary.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Solves Tower
# of Hanoi for a fixed number of disks via genuine multi-call self-recursion
# (two recursive calls per invocation, each returning its own list of moves,
# combined by the caller via `+`) — a deeper recursion shape than the
# corpus's single-recursive-call cases (examples/factorial-recursive/,
# examples/euclidean-gcd-recursive/). No shared mutable move-list: EML has
# no `.append()`, and mutating a module-level list from inside a recursive
# function would shadow it locally anyway (same as real Python without
# `global`), so each call returns its own moves instead.

def hanoi(n, source, target, auxiliary):
    if n == 1:
        return [[source, target]]
    hanoi(n - 1, source, auxiliary, target) => left_moves
    [[source, target]] => middle_move
    hanoi(n - 1, auxiliary, target, source) => right_moves
    return left_moves + middle_move + right_moves

3 => disk_count
hanoi(disk_count, "A", "C", "B") => moves

for move in moves:
    move[0] => src
    move[1] => dst
    "Move disk from " + src + " to " + dst => line
    line^0

"Total moves: " + str(len(moves)) => summary
summary^0
```

## Python (deterministic transpilation)

```python
def hanoi(n, source, target, auxiliary):
    if n == 1:
        return [[source, target]]
    left_moves = hanoi(n - 1, source, auxiliary, target)
    middle_move = [[source, target]]
    right_moves = hanoi(n - 1, auxiliary, target, source)
    return left_moves + middle_move + right_moves

disk_count = 3
moves = hanoi(disk_count, "A", "C", "B")
for move in moves:
    src = move[0]
    dst = move[1]
    line = "Move disk from " + src + " to " + dst
    print(line)
summary = "Total moves: " + str(len(moves))
print(summary)
```

## stdout (executed)

```text
Move disk from A to C
Move disk from A to B
Move disk from C to B
Move disk from A to C
Move disk from B to A
Move disk from B to C
Move disk from A to C
Total moves: 7
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
