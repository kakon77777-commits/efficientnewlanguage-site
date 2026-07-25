<!-- canonical: efficientnewlanguage.org/ai/examples/084-fibonacci-memoized | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 084 — Fibonacci (memoized)

`fibonacci_memoized.eml` prints `fib(0)`..`fib(15)` and then `fib(50) = 12586269025`, using recursion with a dict cache.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The third and
# last member of this corpus's Fibonacci trio: iterative
# (examples/fibonacci-sequence/), naive double recursion
# (examples/fibonacci-recursive/), and now memoized recursion — the same
# recursive shape as the naive version plus a dict cache, which collapses
# it from exponential to linear.
#
# fib(50) is the point of this case: the naive version would need roughly
# 40 billion calls to reach it and is simply not runnable, while memoized
# it costs 49 cached entries. The result also exceeds 32 bits, exercising
# EML's arbitrary-precision integers.

def fib_memo(n, memo):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    fib_memo(n - 1, memo) + fib_memo(n - 2, memo) => value
    value => memo[n]
    return value

memo^+{}

for i in [0:15]:
    fib_memo(i, memo) => result
    "fib(" + str(i) + ") = " + str(result) => line
    line^0

fib_memo(50, memo) => big
"fib(50) = " + str(big) => big_line
big_line^0
"Memo holds " + str(len(memo)) + " cached entries" => summary
summary^0
```

## Python (deterministic transpilation)

```python
def fib_memo(n, memo):
    if n <= 1:
        return n
    if n in memo:
        return memo[n]
    value = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    memo[n] = value
    return value

memo = {}
for i in range(0, 16):
    result = fib_memo(i, memo)
    line = "fib(" + str(i) + ") = " + str(result)
    print(line)
big = fib_memo(50, memo)
big_line = "fib(50) = " + str(big)
print(big_line)
summary = "Memo holds " + str(len(memo)) + " cached entries"
print(summary)
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
fib(11) = 89
fib(12) = 144
fib(13) = 233
fib(14) = 377
fib(15) = 610
fib(50) = 12586269025
Memo holds 49 cached entries
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
