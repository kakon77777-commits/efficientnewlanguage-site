<!-- canonical: efficientnewlanguage.org/ai/examples/071-fibonacci-recursive | ai_layer_version: 0.1.0 | updated: 2026-07-24 -->

# Example 071 — Fibonacci (recursive)

`fibonacci_recursive.eml` prints `fib(0)` through `fib(10)` via genuine double-call self-recursion.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Computes
# Fibonacci numbers via genuine double-call self-recursion
# (`fib(n) = fib(n-1) + fib(n-2)`) — a deliberate contrast with the corpus's
# existing examples/fibonacci-sequence/, which is iterative by design; a
# small N keeps the exponential call count fast.

def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

for i in [0:10]:
    fib(i) => result
    "fib(" + str(i) + ") = " + str(result) => line
    line^0
```

## Python (deterministic transpilation)

```python
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)

for i in range(0, 11):
    result = fib(i)
    line = "fib(" + str(i) + ") = " + str(result)
    print(line)
```

## stdout (executed)

```text
fib(0) = 0
fib(1) = 1
fib(2) = 1
fib(3) = 2
fib(4) = 3
fib(5) = 5
fib(6) = 8
fib(7) = 13
fib(8) = 21
fib(9) = 34
fib(10) = 55
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:call · eml:return · eml:assign · eml:output · eml:run:done
