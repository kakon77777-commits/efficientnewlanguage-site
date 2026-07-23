<!-- canonical: efficientnewlanguage.org/ai/examples/052-elevator-simulator | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 052 — Elevator simulator

`elevator_simulator.eml` simulates a single elevator serving a fixed queue of floor requests (`5, 1, 8, 3`), starting at floor 0 and moving one floor per step toward its current target.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Simulates a
# single elevator serving a fixed queue of floor requests, moving one floor
# per step toward its current target — a state machine tracking only the
# current floor, no external scheduler/GUI.

requests^+[5, 1, 8, 3]
0 => current_floor

for request in requests:
    "Request: go to floor " + str(request) => header
    header^0
    while current_floor != request:
        if current_floor < request:
            current_floor + 1 => current_floor
            "Moving up to floor " + str(current_floor) => line
        else:
            current_floor - 1 => current_floor
            "Moving down to floor " + str(current_floor) => line
        line^0
    "Arrived at floor " + str(current_floor) => arrived
    arrived^0
```

## Python (deterministic transpilation)

```python
requests = [5, 1, 8, 3]
current_floor = 0
for request in requests:
    header = "Request: go to floor " + str(request)
    print(header)
    while current_floor != request:
        if current_floor < request:
            current_floor = current_floor + 1
            line = "Moving up to floor " + str(current_floor)
        else:
            current_floor = current_floor - 1
            line = "Moving down to floor " + str(current_floor)
        print(line)
    arrived = "Arrived at floor " + str(current_floor)
    print(arrived)
```

## stdout (executed)

```text
Request: go to floor 5
Moving up to floor 1
Moving up to floor 2
Moving up to floor 3
Moving up to floor 4
Moving up to floor 5
Arrived at floor 5
Request: go to floor 1
Moving down to floor 4
Moving down to floor 3
Moving down to floor 2
Moving down to floor 1
Arrived at floor 1
Request: go to floor 8
Moving up to floor 2
Moving up to floor 3
Moving up to floor 4
Moving up to floor 5
Moving up to floor 6
Moving up to floor 7
Moving up to floor 8
Arrived at floor 8
Request: go to floor 3
Moving down to floor 7
Moving down to floor 6
Moving down to floor 5
Moving down to floor 4
Moving down to floor 3
Arrived at floor 3
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
