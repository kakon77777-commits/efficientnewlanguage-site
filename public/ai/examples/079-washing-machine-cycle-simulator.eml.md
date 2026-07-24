<!-- canonical: efficientnewlanguage.org/ai/examples/079-washing-machine-cycle-simulator | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 079 — Washing machine cycle simulator

`washing_machine_cycle_simulator.eml` steps a washing machine through its fixed cycle (`fill -> wash -> rinse -> spin -> done`), each stage with its own duration, accumulating a running total.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Simulates a
# washing machine cycling through fixed stages (fill -> wash -> rinse ->
# spin -> done), each stage running for its own fixed duration and
# accumulating a running total — a multi-stage cyclic state machine,
# distinct from the corpus's 2-state
# examples/turnstile-simulator/ and the position-tracking
# examples/elevator-simulator/.

stages^+["fill", "wash", "rinse", "spin", "done"]
durations^+[3, 8, 4, 5, 0]

0 => total_time

for i in [0:4]:
    stages[i] => stage
    durations[i] => duration
    if stage != "done":
        "Stage: " + stage + " (" + str(duration) + " min)" => line
        line^0
        total_time + duration => total_time
    else:
        "Cycle complete." => line
        line^0

"Total cycle time: " + str(total_time) + " minutes" => summary
summary^0
```

## Python (deterministic transpilation)

```python
stages = ["fill", "wash", "rinse", "spin", "done"]
durations = [3, 8, 4, 5, 0]
total_time = 0
for i in range(0, 5):
    stage = stages[i]
    duration = durations[i]
    if stage != "done":
        line = "Stage: " + stage + " (" + str(duration) + " min)"
        print(line)
        total_time = total_time + duration
    else:
        line = "Cycle complete."
        print(line)
summary = "Total cycle time: " + str(total_time) + " minutes"
print(summary)
```

## stdout (executed)

```text
Stage: fill (3 min)
Stage: wash (8 min)
Stage: rinse (4 min)
Stage: spin (5 min)
Cycle complete.
Total cycle time: 20 minutes
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
