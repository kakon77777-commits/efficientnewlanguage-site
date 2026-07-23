<!-- canonical: efficientnewlanguage.org/ai/examples/059-power-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 059 — Power (recursive)

`power_recursive.eml` computes `base^exponent` for five sample pairs (`2^10, 3^4, 5^0, 7^3, 10^6`) via genuine recursion — a `power` function that calls itself, decrementing the exponent each time.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Computes
# base^exponent for a non-negative integer exponent via genuine recursion —
# the recursive counterpart to examples/armstrong-number-checker/'s iterative
# `power` helper (the `^` operator only accepts a literal exponent, not a
# variable one, so a variable exponent is hand-rolled here recursively
# instead).

def power(base, exponent):
    if exponent == 0:
        return 1
    return base * power(base, exponent - 1)

pairs^+[(2, 10), (3, 4), (5, 0), (7, 3), (10, 6)]
for pair in pairs:
    pair[0] => base
    pair[1] => exponent
    power(base, exponent) => result
    str(base) + "^" + str(exponent) + " = " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def power(base, exponent):
    if exponent == 0:
        return 1
    return base * power(base, exponent - 1)

pairs = [(2, 10), (3, 4), (5, 0), (7, 3), (10, 6)]
for pair in pairs:
    base = pair[0]
    exponent = pair[1]
    result = power(base, exponent)
    line = str(base) + "^" + str(exponent) + " = " + str(result)
    print(line)
```

## stdout (executed)

```text
2^10 = 1024
3^4 = 81
5^0 = 1
7^3 = 343
10^6 = 1000000
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
