<!-- canonical: efficientnewlanguage.org/ai/examples/018-dice-roll-tally | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 018 — Case corpus: a self-authored dice roll tally

`dice_roll_tally.eml` is one of a six-case self-authored batch of deterministic simulations and pattern generators (see [`examples/fizzbuzz/`](../fizzbuzz/), [`examples/multiplication-table-generator/`](../multiplication-table-generator/), [`examples/triangle-pattern-printer/`](../triangle-pattern-printer/), [`examples/simple-calculator/`](../simple-calculator/), and [`examples/rock-paper-scissors-simulator/`](../rock-paper-scissors-simulator/) for the other five) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project. EML's interpreter models no random-number generation, so the dice rolls here are a fixed, hardcoded 20-value list, not real randomness.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Tallies a
# fixed, hardcoded sequence of dice-roll values (EML's interpreter models
# no RNG, so no real randomness is used) into a dict keyed by face 1-6 via
# subscript read/write, then finds the most-frequent face with a manual
# comparison loop (deliberately avoiding a sorted()/max()-of-tuples builtin
# the interpreter doesn't model).

rolls^+[3, 5, 1, 6, 6, 2, 4, 6, 1, 5, 3, 6, 2, 4, 6, 1, 5, 3, 6, 2]

tally^+{1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}

for roll in rolls:
    tally[roll] + 1 => tally[roll]

"Dice roll tally:"^0
for face in [1:6]:
    face^0(": ")
    tally[face]^0("\n")

best_face^+0
best_count^+0
for face in [1:6]:
    if tally[face] > best_count:
        tally[face] => best_count
        face => best_face

"Face " + str(best_face) + " appeared most often (" + str(best_count) + " times)" => message
message^0
```

## Python (deterministic transpilation)

```python
rolls = [3, 5, 1, 6, 6, 2, 4, 6, 1, 5, 3, 6, 2, 4, 6, 1, 5, 3, 6, 2]
tally = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
for roll in rolls:
    tally[roll] = tally[roll] + 1
print("Dice roll tally:")
for face in range(1, 7):
    print(face, end=": ")
    print(tally[face], end="\n")
best_face = 0
best_count = 0
for face in range(1, 7):
    if tally[face] > best_count:
        best_count = tally[face]
        best_face = face
message = "Face " + str(best_face) + " appeared most often (" + str(best_count) + " times)"
print(message)
```

## stdout (executed)

```text
Dice roll tally:
1: 3
2: 3
3: 3
4: 2
5: 3
6: 6
Face 6 appeared most often (6 times)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
