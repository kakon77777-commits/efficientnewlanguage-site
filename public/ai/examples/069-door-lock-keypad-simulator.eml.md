<!-- canonical: efficientnewlanguage.org/ai/examples/069-door-lock-keypad-simulator | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 069 — Door lock keypad simulator

`door_lock_keypad_simulator.eml` simulates a keypad door lock through a fixed sequence of 6 PIN attempts, ending in a lockout.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Simulates a
# keypad door lock — 3 states (locked/unlocked/alarm) driven by a fixed
# sequence of PIN attempts, locking out into an alarm state after 3
# consecutive wrong attempts (streak resets on any correct entry) — a
# richer state machine than the corpus's 2-state
# examples/turnstile-simulator/. Once in alarm, further input is ignored
# (a deliberately simplified toy model: no separate reset/unlock-the-alarm
# event is modeled).

"4821" => correct_pin
attempts^+["1234", "4821", "0000", "9999", "1111", "4821"]

"locked" => state
0 => wrong_streak

for attempt in attempts:
    if state == "alarm":
        "ALARM: ignoring further input (" + attempt + ")" => line
        line^0
    elif attempt == correct_pin:
        "unlocked" => state
        0 => wrong_streak
        "Correct PIN " + attempt + " -> unlocked" => line
        line^0
    else:
        wrong_streak + 1 => wrong_streak
        if wrong_streak >= 3:
            "alarm" => state
            "Wrong PIN " + attempt + " -> ALARM triggered (3 failures)" => line
            line^0
        else:
            "Wrong PIN " + attempt + " (" + str(wrong_streak) + " failed attempt(s))" => line
            line^0
```

## Python (deterministic transpilation)

```python
correct_pin = "4821"
attempts = ["1234", "4821", "0000", "9999", "1111", "4821"]
state = "locked"
wrong_streak = 0
for attempt in attempts:
    if state == "alarm":
        line = "ALARM: ignoring further input (" + attempt + ")"
        print(line)
    elif attempt == correct_pin:
        state = "unlocked"
        wrong_streak = 0
        line = "Correct PIN " + attempt + " -> unlocked"
        print(line)
    else:
        wrong_streak = wrong_streak + 1
        if wrong_streak >= 3:
            state = "alarm"
            line = "Wrong PIN " + attempt + " -> ALARM triggered (3 failures)"
            print(line)
        else:
            line = "Wrong PIN " + attempt + " (" + str(wrong_streak) + " failed attempt(s))"
            print(line)
```

## stdout (executed)

```text
Wrong PIN 1234 (1 failed attempt(s))
Correct PIN 4821 -> unlocked
Wrong PIN 0000 (1 failed attempt(s))
Wrong PIN 9999 (2 failed attempt(s))
Wrong PIN 1111 -> ALARM triggered (3 failures)
ALARM: ignoring further input (4821)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
