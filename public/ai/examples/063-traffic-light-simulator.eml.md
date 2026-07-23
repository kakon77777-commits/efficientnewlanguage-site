<!-- canonical: efficientnewlanguage.org/ai/examples/063-traffic-light-simulator | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 063 — Traffic light simulator

`traffic_light_simulator.eml` simulates a traffic light cycling Red -> Green -> Yellow -> Red over 20 steps, each state held for a fixed number of steps (Red: 3, Green: 4, Yellow: 1).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Simulates a
# traffic light cycling Red -> Green -> Yellow -> Red, each state held for a
# fixed number of steps (3/4/1), using two parallel lists (state names and
# per-state hold durations) indexed by a manual state counter — no
# enum/class, no external timer.

states^+["Red", "Green", "Yellow"]
hold_durations^+[3, 4, 1]

0 => state_index
0 => elapsed
20 => total_steps

for step in [1:total_steps]:
    states[state_index] => current_state
    "Step " + str(step) + ": " + current_state => line
    line^0
    elapsed + 1 => elapsed
    hold_durations[state_index] => needed
    if elapsed >= needed:
        0 => elapsed
        (state_index + 1) % 3 => state_index
```

## Python (deterministic transpilation)

```python
states = ["Red", "Green", "Yellow"]
hold_durations = [3, 4, 1]
state_index = 0
elapsed = 0
total_steps = 20
for step in range(1, total_steps+1):
    current_state = states[state_index]
    line = "Step " + str(step) + ": " + current_state
    print(line)
    elapsed = elapsed + 1
    needed = hold_durations[state_index]
    if elapsed >= needed:
        elapsed = 0
        state_index = (state_index + 1) % 3
```

## stdout (executed)

```text
Step 1: Red
Step 2: Red
Step 3: Red
Step 4: Green
Step 5: Green
Step 6: Green
Step 7: Green
Step 8: Yellow
Step 9: Red
Step 10: Red
Step 11: Red
Step 12: Green
Step 13: Green
Step 14: Green
Step 15: Green
Step 16: Yellow
Step 17: Red
Step 18: Red
Step 19: Red
Step 20: Green
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
