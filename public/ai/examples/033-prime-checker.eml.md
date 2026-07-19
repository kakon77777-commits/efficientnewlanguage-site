<!-- canonical: efficientnewlanguage.org/ai/examples/033-prime-checker | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 033 — Prime checker

`prime_checker.eml` checks primality by trial division (dividing up to `sqrt(n)`, computed without a square-root call by comparing `divisor * divisor <= n`) for a handful of sample numbers, then separately builds the full list of primes up to 30 by looping over an inclusive range and growing a list.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Checks
# primality by trial division for a handful of sample numbers, then builds
# the full list of primes up to 30 via a loop + list-literal growth (the
# `list + [item] => list` idiom — no `.append()`, which is not modeled).

def is_prime(n):
    if n < 2:
        return False
    2 => divisor
    True => verdict
    while divisor * divisor <= n:
        if n % divisor == 0:
            False => verdict
            break
        divisor + 1 => divisor
    return verdict

samples^+[7, 12, 29, 91, 97]

for sample in samples:
    is_prime(sample) => result
    sample^0(": ")
    result^0("\n")

primes^+[]
for candidate in [2:30]:
    is_prime(candidate) => flag
    if flag:
        primes + [candidate] => primes

"Primes up to 30: " + str(primes) => summary
summary^0
```

## Python (deterministic transpilation)

```python
def is_prime(n):
    if n < 2:
        return False
    divisor = 2
    verdict = True
    while divisor * divisor <= n:
        if n % divisor == 0:
            verdict = False
            break
        divisor = divisor + 1
    return verdict

samples = [7, 12, 29, 91, 97]
for sample in samples:
    result = is_prime(sample)
    print(sample, end=": ")
    print(result, end="\n")
primes = []
for candidate in range(2, 31):
    flag = is_prime(candidate)
    if flag:
        primes = primes + [candidate]
summary = "Primes up to 30: " + str(primes)
print(summary)
```

## stdout (executed)

```text
7: True
12: False
29: True
91: False
97: True
Primes up to 30: [2, 3, 5, 7, 11, 13, 17, 19, 23, 29]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
