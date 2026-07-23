<!-- canonical: efficientnewlanguage.org/ai/examples/058-perfect-number-checker | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 058 — Perfect number checker

`perfect_number_checker.eml` checks whether six sample numbers (`6, 28, 12, 496, 100, 8128`) are perfect numbers — numbers whose proper divisors sum back to the number itself — via trial division. `6`, `28`, `496`, and `8128` are the first four perfect numbers; `12` and `100` are not.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Checks whether
# sample numbers are perfect numbers (the sum of their proper divisors
# equals the number itself) via trial division — no external number-theory
# library.

def is_perfect(n):
    0 => divisor_sum
    for i in [1 : n - 1]:
        if n % i == 0:
            divisor_sum + i => divisor_sum
    return divisor_sum == n

samples^+[6, 28, 12, 496, 100, 8128]
for sample in samples:
    is_perfect(sample) => result
    str(sample) + ": " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def is_perfect(n):
    divisor_sum = 0
    for i in range(1, n):
        if n % i == 0:
            divisor_sum = divisor_sum + i
    return divisor_sum == n

samples = [6, 28, 12, 496, 100, 8128]
for sample in samples:
    result = is_perfect(sample)
    line = str(sample) + ": " + str(result)
    print(line)
```

## stdout (executed)

```text
6: True
28: True
12: False
496: True
100: False
8128: True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
