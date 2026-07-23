<!-- canonical: efficientnewlanguage.org/ai/examples/060-prime-factorization | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 060 — Prime factorization

`prime_factorization.eml` finds the prime factorization (with multiplicity) of five sample numbers (`60, 97, 360, 1000000, 17`) via trial division — a manual nested `while` loop — no external number-theory library.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finds the
# prime factorization (with multiplicity) of sample numbers via trial
# division — a manual nested `while` loop building the factor list via
# `list + [item] => list` growth (no `.append()`, not modeled) — no external
# number-theory library.

def prime_factors(number):
    number => remaining
    factors^+[]
    2 => divisor
    while divisor * divisor <= remaining:
        while remaining % divisor == 0:
            factors + [divisor] => factors
            int(remaining / divisor) => remaining
        divisor + 1 => divisor
    if remaining > 1:
        factors + [remaining] => factors
    return factors

samples^+[60, 97, 360, 1000000, 17]
for sample in samples:
    prime_factors(sample) => result
    str(sample) + " = " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def prime_factors(number):
    remaining = number
    factors = []
    divisor = 2
    while divisor * divisor <= remaining:
        while remaining % divisor == 0:
            factors = factors + [divisor]
            remaining = int(remaining / divisor)
        divisor = divisor + 1
    if remaining > 1:
        factors = factors + [remaining]
    return factors

samples = [60, 97, 360, 1000000, 17]
for sample in samples:
    result = prime_factors(sample)
    line = str(sample) + " = " + str(result)
    print(line)
```

## stdout (executed)

```text
60 = [2, 2, 3, 5]
97 = [97]
360 = [2, 2, 2, 3, 3, 5]
1000000 = [2, 2, 2, 2, 2, 2, 5, 5, 5, 5, 5, 5]
17 = [17]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
