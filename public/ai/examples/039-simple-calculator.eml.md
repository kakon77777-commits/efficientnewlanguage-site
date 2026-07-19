<!-- canonical: efficientnewlanguage.org/ai/examples/039-simple-calculator | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 039 — Case corpus: a self-authored simple calculator

`simple_calculator.eml` is one of a six-case self-authored batch of deterministic simulations and pattern generators (see [`examples/fizzbuzz/`](../fizzbuzz/), [`examples/multiplication-table-generator/`](../multiplication-table-generator/), [`examples/triangle-pattern-printer/`](../triangle-pattern-printer/), [`examples/rock-paper-scissors-simulator/`](../rock-paper-scissors-simulator/), and [`examples/dice-roll-tally/`](../dice-roll-tally/) for the other five) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A basic
# calculator dispatching on an operator string via if/elif/else for a
# fixed list of (a, operator, b) sample tuples, with try/except guarding
# division by zero.

calculations^+[(6, "+", 4), (10, "-", 3), (7, "*", 8), (9, "/", 3), (5, "/", 0)]

for calc in calculations:
    calc[0] => a
    calc[1] => op
    calc[2] => b
    try:
        if op == "+":
            a + b => result
        elif op == "-":
            a - b => result
        elif op == "*":
            a * b => result
        elif op == "/":
            a / b => result
        else:
            "unknown operator" => result
        str(a) + " " + op + " " + str(b) + " = " + str(result) => line
    except ZeroDivisionError:
        str(a) + " " + op + " " + str(b) + " = undefined (division by zero)" => line
    line^0
```

## Python (deterministic transpilation)

```python
calculations = [(6, "+", 4), (10, "-", 3), (7, "*", 8), (9, "/", 3), (5, "/", 0)]
for calc in calculations:
    a = calc[0]
    op = calc[1]
    b = calc[2]
    try:
        if op == "+":
            result = a + b
        elif op == "-":
            result = a - b
        elif op == "*":
            result = a * b
        elif op == "/":
            result = a / b
        else:
            result = "unknown operator"
        line = str(a) + " " + op + " " + str(b) + " = " + str(result)
    except ZeroDivisionError:
        line = str(a) + " " + op + " " + str(b) + " = undefined (division by zero)"
    print(line)
```

## stdout (executed)

```text
6 + 4 = 10
10 - 3 = 7
7 * 8 = 56
9 / 3 = 3.0
5 / 0 = undefined (division by zero)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
