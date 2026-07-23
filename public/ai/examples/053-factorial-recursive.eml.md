<!-- canonical: efficientnewlanguage.org/ai/examples/053-factorial-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 053 — Factorial (recursive)

`factorial_recursive.eml` computes `0!` through `10!` via genuine self-recursion — a `factorial` function that calls itself — rather than an iterative loop.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Computes
# factorials of 0 through 10 via genuine self-recursion (a function calling
# itself) rather than an iterative loop — the corpus's other recursion-shaped
# candidates (fibonacci-sequence, gcd-lcm-calculator, armstrong-number-checker's
# `power`) all turned out iterative on inspection, so this is the first case
# to actually exercise a function calling itself.

def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in [0:10]:
    factorial(i) => result
    str(i) + "! = " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)

for i in range(0, 11):
    result = factorial(i)
    line = str(i) + "! = " + str(result)
    print(line)
```

## stdout (executed)

```text
0! = 1
1! = 1
2! = 2
3! = 6
4! = 24
5! = 120
6! = 720
7! = 5040
8! = 40320
9! = 362880
10! = 3628800
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:call · eml:return · eml:assign · eml:output · eml:run:done
