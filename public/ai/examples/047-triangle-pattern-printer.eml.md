<!-- canonical: efficientnewlanguage.org/ai/examples/047-triangle-pattern-printer | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 047 — Case corpus: a self-authored triangle pattern printer

`triangle_pattern_printer.eml` is one of a six-case self-authored batch of deterministic simulations and pattern generators (see [`examples/fizzbuzz/`](../fizzbuzz/), [`examples/multiplication-table-generator/`](../multiplication-table-generator/), [`examples/simple-calculator/`](../simple-calculator/), [`examples/rock-paper-scissors-simulator/`](../rock-paper-scissors-simulator/), and [`examples/dice-roll-tally/`](../dice-roll-tally/) for the other five) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Prints a
# 5-row triangular pattern of asterisks using nested for-loops over EML's
# native [a:b] range literal (the inner loop's upper bound is the outer
# loop variable itself) and string concatenation to build each row.

for row in [1:5]:
    "" => line
    for col in [1:row]:
        line + "*" => line
    line^0
```

## Python (deterministic transpilation)

```python
for row in range(1, 6):
    line = ""
    for col in range(1, row+1):
        line = line + "*"
    print(line)
```

## stdout (executed)

```text
*
**
***
****
*****
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
