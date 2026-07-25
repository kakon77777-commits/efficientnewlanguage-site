<!-- canonical: efficientnewlanguage.org/ai/examples/094-sieve-of-eratosthenes | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 094 — Sieve of Eratosthenes

`sieve_of_eratosthenes.eml` lists every prime up to 50 (15 of them) via the classic sieve.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finds every
# prime up to a limit via the Sieve of Eratosthenes — build a flag list,
# then repeatedly cross off multiples of each surviving prime. A different
# strategy from the corpus's existing examples/prime-checker/ (which tests
# one number at a time by trial division) and
# examples/prime-factorization/: the sieve computes the whole range at
# once, trading memory for far fewer divisions.

def sieve(limit):
    is_prime^+[]
    0 => i
    while i <= limit:
        is_prime + [True] => is_prime
        i + 1 => i
    False => is_prime[0]
    False => is_prime[1]
    2 => p
    while p * p <= limit:
        if is_prime[p]:
            p * p => multiple
            while multiple <= limit:
                False => is_prime[multiple]
                multiple + p => multiple
        p + 1 => p
    primes^+[]
    2 => n
    while n <= limit:
        if is_prime[n]:
            primes + [n] => primes
        n + 1 => n
    return primes

50 => limit
sieve(limit) => primes

"Primes up to " + str(limit) + ":" => header
header^0
str(primes) => listing
listing^0
"Count: " + str(len(primes)) => summary
summary^0
```

## Python (deterministic transpilation)

```python
def sieve(limit):
    is_prime = []
    i = 0
    while i <= limit:
        is_prime = is_prime + [True]
        i = i + 1
    is_prime[0] = False
    is_prime[1] = False
    p = 2
    while p * p <= limit:
        if is_prime[p]:
            multiple = p * p
            while multiple <= limit:
                is_prime[multiple] = False
                multiple = multiple + p
        p = p + 1
    primes = []
    n = 2
    while n <= limit:
        if is_prime[n]:
            primes = primes + [n]
        n = n + 1
    return primes

limit = 50
primes = sieve(limit)
header = "Primes up to " + str(limit) + ":"
print(header)
listing = str(primes)
print(listing)
summary = "Count: " + str(len(primes))
print(summary)
```

## stdout (executed)

```text
Primes up to 50:
[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47]
Count: 15
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
