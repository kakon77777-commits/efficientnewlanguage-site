<!-- canonical: efficientnewlanguage.org/ai/examples/009-unit-temperature-converter | ai_layer_version: 0.1.0 | updated: 2026-07-18 -->

# Example 009 — Case corpus: a self-authored unit-conversion program

`temperature_converter.eml` is the first case in a self-authored batch (see [`examples/word-frequency-counter/`](../word-frequency-counter/) and [`examples/todo-list-manager/`](../todo-list-manager/) for the other two) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A small,
# genuinely useful temperature-unit converter exercising def/return, list
# literals, list comprehensions, for-loops, and the EXPR^0(END_EXPR) custom
# print terminator (suppressing the newline until we choose to emit one).

def celsius_to_fahrenheit(c):
    (c * 9 / 5) + 32 => f
    return f

def fahrenheit_to_celsius(f):
    (f - 32) * 5 / 9 => c
    return c

celsius_readings^+[0, 20, 37, 100, -40]
[celsius_to_fahrenheit(c) for c in celsius_readings] => fahrenheit_readings

for reading in celsius_readings:
    reading^0("C = ")
    celsius_to_fahrenheit(reading)^0("F\n")

fahrenheit_to_celsius(32) => freezing_c
"Freezing point (32F) in Celsius: " + str(freezing_c) => message
message^0
```

## Python (deterministic transpilation)

```python
def celsius_to_fahrenheit(c):
    f = c * 9 / 5 + 32
    return f

def fahrenheit_to_celsius(f):
    c = (f - 32) * 5 / 9
    return c

celsius_readings = [0, 20, 37, 100, -40]
fahrenheit_readings = [celsius_to_fahrenheit(c) for c in celsius_readings]
for reading in celsius_readings:
    print(reading, end="C = ")
    print(celsius_to_fahrenheit(reading), end="F\n")
freezing_c = fahrenheit_to_celsius(32)
message = "Freezing point (32F) in Celsius: " + str(freezing_c)
print(message)
```

## stdout (executed)

```text
0C = 32.0F
20C = 68.0F
37C = 98.6F
100C = 212.0F
-40C = -40.0F
Freezing point (32F) in Celsius: 0.0
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
