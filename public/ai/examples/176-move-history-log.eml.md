<!-- canonical: efficientnewlanguage.org/ai/examples/176-move-history-log | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 176 — Tuples doing two jobs at once

`move_history_log.eml` — logs game moves as tuples inside a tuple.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A game log where
# each move is a (player, from, to) tuple and the history is a tuple of moves.
#
# Tuples do two different jobs here at once, which is worth seeing side by side:
#
#   each MOVE is a fixed-shape record  - three fields, forever
#   the HISTORY is a growing sequence  - extended by concatenation
#
# The history being a tuple rather than a list is a deliberate choice: it can
# be used as a dict key, so a whole game state can be memoised. That only works
# because tuple hashing is recursive - the outer tuple hashes its inner tuples.

def record(history, move):
    return history + (move,)

def moves_by(history, player):
    0 => n
    for m in history:
        if m[0] == player:
            n + 1 => n
    return n

() => history
[("W", "e2", "e4"), ("B", "e7", "e5"), ("W", "g1", "f3"), ("B", "b8", "c6"), ("W", "f1", "b5")] => played

for m in played:
    record(history, m) => history

("Moves played: " + str(len(history)))^0
""^0
"#   player  from  to" => header
header^0
"--  ------  ----  --" => rule
rule^0
0 => i
for m in history:
    (str(i) + "   " + m[0] + "       " + m[1] + "    " + m[2])^0
    i + 1 => i

""^0
("White moved " + str(moves_by(history, "W")) + " times, Black " + str(moves_by(history, "B")) + " times")^0
""^0

# A nested tuple is hashable because every element is, so a whole position can
# be a key. This is the payoff for the history being a tuple.
{} => seen
history => position
"first visit" => seen[position]
("Position recorded under a " + str(len(position)) + "-move history key")^0
("Looking it up with an equal history: " + seen[history])^0
""^0

# Slicing a tuple gives a tuple, so an earlier position is also a valid key.
history[0:2] => opening
("The opening alone: " + str(opening))^0
("Different key, so not yet recorded: " + str(opening in seen))^0
```

## Python (deterministic transpilation)

```python
def record(history, move):
    return history + (move,)

def moves_by(history, player):
    n = 0
    for m in history:
        if m[0] == player:
            n = n + 1
    return n

history = ()
played = [("W", "e2", "e4"), ("B", "e7", "e5"), ("W", "g1", "f3"), ("B", "b8", "c6"), ("W", "f1", "b5")]
for m in played:
    history = record(history, m)
print("Moves played: " + str(len(history)))
print("")
header = "#   player  from  to"
print(header)
rule = "--  ------  ----  --"
print(rule)
i = 0
for m in history:
    print(str(i) + "   " + m[0] + "       " + m[1] + "    " + m[2])
    i = i + 1
print("")
print("White moved " + str(moves_by(history, "W")) + " times, Black " + str(moves_by(history, "B")) + " times")
print("")
seen = {}
position = history
seen[position] = "first visit"
print("Position recorded under a " + str(len(position)) + "-move history key")
print("Looking it up with an equal history: " + seen[history])
print("")
opening = history[0:2]
print("The opening alone: " + str(opening))
print("Different key, so not yet recorded: " + str(opening in seen))
```

## stdout (executed)

```text
Moves played: 5

#   player  from  to
--  ------  ----  --
0   W       e2    e4
1   B       e7    e5
2   W       g1    f3
3   B       b8    c6
4   W       f1    b5

White moved 3 times, Black 2 times

Position recorded under a 5-move history key
Looking it up with an equal history: first visit

The opening alone: (('W', 'e2', 'e4'), ('B', 'e7', 'e5'))
Different key, so not yet recorded: False
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
