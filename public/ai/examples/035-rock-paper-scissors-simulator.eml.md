<!-- canonical: efficientnewlanguage.org/ai/examples/035-rock-paper-scissors-simulator | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 035 — Case corpus: a self-authored rock-paper-scissors simulator

`rock_paper_scissors_simulator.eml` is one of a six-case self-authored batch of deterministic simulations and pattern generators (see [`examples/fizzbuzz/`](../fizzbuzz/), [`examples/multiplication-table-generator/`](../multiplication-table-generator/), [`examples/triangle-pattern-printer/`](../triangle-pattern-printer/), [`examples/simple-calculator/`](../simple-calculator/), and [`examples/dice-roll-tally/`](../dice-roll-tally/) for the other five) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project. EML's interpreter models no random-number generation, so the "simulation" here is a fixed, hardcoded sequence of six rounds, not real randomness.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Simulates a
# fixed, hardcoded sequence of rock-paper-scissors rounds (EML's interpreter
# models no RNG, so no real randomness is used) and determines each round's
# winner via if/elif/else, plus a running score tally for both players via
# the declare-or-augment `^+` sigil (declares once before the loop, then
# augments inside it).

rounds^+[("rock", "scissors"), ("paper", "paper"), ("scissors", "rock"),
         ("rock", "rock"), ("paper", "rock"), ("scissors", "paper")]

player_one_score^+0
player_two_score^+0

for round in rounds:
    round[0] => p1
    round[1] => p2
    if p1 == p2:
        "Tie" => outcome
    elif (p1 == "rock" and p2 == "scissors") or (p1 == "paper" and p2 == "rock") or (p1 == "scissors" and p2 == "paper"):
        "Player 1 wins" => outcome
        player_one_score^+1
    else:
        "Player 2 wins" => outcome
        player_two_score^+1
    "P1: " + p1 + " vs P2: " + p2 + " -> " + outcome => line
    line^0

"Final score - Player 1: " + str(player_one_score) + ", Player 2: " + str(player_two_score) => summary
summary^0
```

## Python (deterministic transpilation)

```python
rounds = [("rock", "scissors"), ("paper", "paper"), ("scissors", "rock"), ("rock", "rock"), ("paper", "rock"), ("scissors", "paper")]
player_one_score = 0
player_two_score = 0
for round in rounds:
    p1 = round[0]
    p2 = round[1]
    if p1 == p2:
        outcome = "Tie"
    elif p1 == "rock" and p2 == "scissors" or p1 == "paper" and p2 == "rock" or p1 == "scissors" and p2 == "paper":
        outcome = "Player 1 wins"
        player_one_score += 1
    else:
        outcome = "Player 2 wins"
        player_two_score += 1
    line = "P1: " + p1 + " vs P2: " + p2 + " -> " + outcome
    print(line)
summary = "Final score - Player 1: " + str(player_one_score) + ", Player 2: " + str(player_two_score)
print(summary)
```

## stdout (executed)

```text
P1: rock vs P2: scissors -> Player 1 wins
P1: paper vs P2: paper -> Tie
P1: scissors vs P2: rock -> Player 2 wins
P1: rock vs P2: rock -> Tie
P1: paper vs P2: rock -> Player 1 wins
P1: scissors vs P2: paper -> Player 1 wins
Final score - Player 1: 3, Player 2: 1
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
