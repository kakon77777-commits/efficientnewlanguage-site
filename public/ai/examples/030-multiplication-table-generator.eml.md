<!-- canonical: efficientnewlanguage.org/ai/examples/030-multiplication-table-generator | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 030 — Case corpus: a self-authored multiplication table generator

`multiplication_table_generator.eml` is one of a six-case self-authored batch of deterministic simulations and pattern generators (see [`examples/fizzbuzz/`](../fizzbuzz/), [`examples/triangle-pattern-printer/`](../triangle-pattern-printer/), [`examples/simple-calculator/`](../simple-calculator/), [`examples/rock-paper-scissors-simulator/`](../rock-paper-scissors-simulator/), and [`examples/dice-roll-tally/`](../dice-roll-tally/) for the other five) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Prints a
# 1-10 multiplication table via nested for-loops over EML's native [a:b]
# range literal, %-string-formatting (`%d`) to render each product, and a
# manual left-pad (a while loop plus string concatenation — the
# interpreter's `%` operator deliberately supports no width/flags, only
# `%s`/`%d`/`%f`/`%%`, so a fixed-width `%4d` is not usable here) to keep
# columns aligned.

def pad_left(text, width):
    while len(text) < width:
        " " + text => text
    return text

for row in [1:10]:
    "" => line
    for col in [1:10]:
        row * col => product
        "%d" % (product,) => digits
        line + pad_left(digits, 4) => line
    line^0
```

## Python (deterministic transpilation)

```python
def pad_left(text, width):
    while len(text) < width:
        text = " " + text
    return text

for row in range(1, 11):
    line = ""
    for col in range(1, 11):
        product = row * col
        digits = "%d" % (product,)
        line = line + pad_left(digits, 4)
    print(line)
```

## stdout (executed)

```text
   1   2   3   4   5   6   7   8   9  10
   2   4   6   8  10  12  14  16  18  20
   3   6   9  12  15  18  21  24  27  30
   4   8  12  16  20  24  28  32  36  40
   5  10  15  20  25  30  35  40  45  50
   6  12  18  24  30  36  42  48  54  60
   7  14  21  28  35  42  49  56  63  70
   8  16  24  32  40  48  56  64  72  80
   9  18  27  36  45  54  63  72  81  90
  10  20  30  40  50  60  70  80  90 100
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
