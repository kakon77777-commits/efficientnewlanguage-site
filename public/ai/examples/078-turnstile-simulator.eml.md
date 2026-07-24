<!-- canonical: efficientnewlanguage.org/ai/examples/078-turnstile-simulator | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 078 — Turnstile simulator

`turnstile_simulator.eml` simulates a subway turnstile through a fixed sequence of 8 `push`/`coin` events, tracking coins collected and rejected pushes.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Simulates a
# subway turnstile — a 2-state machine (locked/unlocked) driven by a fixed
# sequence of coin/push events, tracking coins collected and rejected
# pushes — a smaller, more textbook-flavored state machine than the
# corpus's existing examples/traffic-light-simulator/,
# examples/vending-machine-simulator/, and examples/elevator-simulator/.

events^+["push", "coin", "push", "push", "coin", "coin", "push", "push"]

"locked" => state
0 => coins_collected
0 => rejected_pushes

for event in events:
    if event == "coin":
        coins_collected + 1 => coins_collected
        "unlocked" => state
        "Coin inserted -> unlocked" => line
    elif state == "unlocked":
        "locked" => state
        "Push accepted -> passed through, now locked" => line
    else:
        rejected_pushes + 1 => rejected_pushes
        "Push rejected -> still locked" => line
    line^0

"Coins collected: " + str(coins_collected) => summary1
summary1^0
"Rejected pushes: " + str(rejected_pushes) => summary2
summary2^0
```

## Python (deterministic transpilation)

```python
events = ["push", "coin", "push", "push", "coin", "coin", "push", "push"]
state = "locked"
coins_collected = 0
rejected_pushes = 0
for event in events:
    if event == "coin":
        coins_collected = coins_collected + 1
        state = "unlocked"
        line = "Coin inserted -> unlocked"
    elif state == "unlocked":
        state = "locked"
        line = "Push accepted -> passed through, now locked"
    else:
        rejected_pushes = rejected_pushes + 1
        line = "Push rejected -> still locked"
    print(line)
summary1 = "Coins collected: " + str(coins_collected)
print(summary1)
summary2 = "Rejected pushes: " + str(rejected_pushes)
print(summary2)
```

## stdout (executed)

```text
Push rejected -> still locked
Coin inserted -> unlocked
Push accepted -> passed through, now locked
Push rejected -> still locked
Coin inserted -> unlocked
Coin inserted -> unlocked
Push accepted -> passed through, now locked
Push rejected -> still locked
Coins collected: 3
Rejected pushes: 3
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
