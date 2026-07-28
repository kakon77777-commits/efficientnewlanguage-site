<!-- canonical: efficientnewlanguage.org/ai/examples/130-cold-vs-hot-fibonacci | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 130 — @cold vs @hot: same answers, different costs

`cold_vs_hot_fibonacci.eml` writes the same recursive Fibonacci twice — once `@cold`, once `@hot` — to separate two things the temperature model does not confuse.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The same recursive
# Fibonacci written twice - once @cold, once @hot - to separate two things the
# temperature model does NOT confuse:
#
#   @cold and @hot give the SAME ANSWERS for a pure function.
#   @cold and @hot give VERY different COSTS.
#
# Both definitions below are the textbook two-call recursion. @cold transpiles
# to @functools.cache, so each distinct n is computed once and the recursion
# collapses from exponential to linear. @hot transpiles to a plain function with
# a marker comment, so every call re-descends the whole tree.
#
# The first section counts the cold computations directly, with a print inside
# the cached body (which is why W_COLD_SIDE_EFFECT is reported - see
# examples/cold-memoization-visible for why that instrument is deliberate).
# Eleven [computing] lines appear for fib(10): one per distinct argument, 0
# through 10.
#
# The second section measures what @hot costs, WITHOUT running it at large n -
# `naive_calls` is a pure recurrence for the number of calls the uncached
# version makes: T(0) = T(1) = 1, T(n) = 1 + T(n-1) + T(n-2). It is itself
# @cold, so counting the cost of exponential recursion is cheap and side-effect
# free. Nothing here is a hardcoded figure; the program derives every number.
#
# The third section runs the @hot version for real at a small n and checks it
# agrees with the @cold one, which is the claim that matters: the annotation is
# a performance contract, not a semantic one - for pure logic.

@cold
def fib_cold(n):
    ("    [computing fib_cold(" + str(n) + ")]")^0
    if n < 2:
        return n
    return fib_cold(n - 1) + fib_cold(n - 2)

@hot
def fib_hot(n):
    if n < 2:
        return n
    return fib_hot(n - 1) + fib_hot(n - 2)

@cold
def naive_calls(n):
    if n < 2:
        return 1
    return 1 + naive_calls(n - 1) + naive_calls(n - 2)

"fib_cold(10), with every distinct computation printed:" => h1
h1^0
fib_cold(10) => value
("  fib_cold(10) = " + str(value))^0
"  -> 11 [computing] lines above, one for each of n = 0..10." => n1
n1^0

""^0
"What the same recursion costs WITHOUT the cache:" => h2
h2^0
sizes^+[10, 20, 30, 40]
for n in sizes:
    naive_calls(n) => calls
    ("  n = " + str(n) + ": cached does " + str(n + 1) + " computations, uncached makes " + str(calls) + " calls")^0

""^0
"Same answers either way (this is the part the annotation must not change):" => h3
h3^0
0 => agree
0 => checked
for n in [0:12]:
    fib_hot(n) => hot_value
    fib_cold(n) => cold_value
    checked + 1 => checked
    if hot_value == cold_value:
        agree + 1 => agree
("  " + str(agree) + " of " + str(checked) + " values agree between @hot and @cold")^0
"  Note which [computing] lines appeared during that check: only 11 and 12." => n3
n3^0
"  n = 0..10 were already cached from the first section, so 11 of the 13" => n4
n4^0
"  @cold calls cost nothing. The cache outlives the call that filled it." => n5
n5^0
```

## Python (deterministic transpilation)

```python
import functools

@functools.cache
def fib_cold(n):
    print("    [computing fib_cold(" + str(n) + ")]")
    if n < 2:
        return n
    return fib_cold(n - 1) + fib_cold(n - 2)

# @hot: dynamic state — not cached
def fib_hot(n):
    if n < 2:
        return n
    return fib_hot(n - 1) + fib_hot(n - 2)

@functools.cache
def naive_calls(n):
    if n < 2:
        return 1
    return 1 + naive_calls(n - 1) + naive_calls(n - 2)

h1 = "fib_cold(10), with every distinct computation printed:"
print(h1)
value = fib_cold(10)
print("  fib_cold(10) = " + str(value))
n1 = "  -> 11 [computing] lines above, one for each of n = 0..10."
print(n1)
print("")
h2 = "What the same recursion costs WITHOUT the cache:"
print(h2)
sizes = [10, 20, 30, 40]
for n in sizes:
    calls = naive_calls(n)
    print("  n = " + str(n) + ": cached does " + str(n + 1) + " computations, uncached makes " + str(calls) + " calls")
print("")
h3 = "Same answers either way (this is the part the annotation must not change):"
print(h3)
agree = 0
checked = 0
for n in range(0, 13):
    hot_value = fib_hot(n)
    cold_value = fib_cold(n)
    checked = checked + 1
    if hot_value == cold_value:
        agree = agree + 1
print("  " + str(agree) + " of " + str(checked) + " values agree between @hot and @cold")
n3 = "  Note which [computing] lines appeared during that check: only 11 and 12."
print(n3)
n4 = "  n = 0..10 were already cached from the first section, so 11 of the 13"
print(n4)
n5 = "  @cold calls cost nothing. The cache outlives the call that filled it."
print(n5)
```

## stdout (executed)

```text
fib_cold(10), with every distinct computation printed:
    [computing fib_cold(10)]
    [computing fib_cold(9)]
    [computing fib_cold(8)]
    [computing fib_cold(7)]
    [computing fib_cold(6)]
    [computing fib_cold(5)]
    [computing fib_cold(4)]
    [computing fib_cold(3)]
    [computing fib_cold(2)]
    [computing fib_cold(1)]
    [computing fib_cold(0)]
  fib_cold(10) = 55
  -> 11 [computing] lines above, one for each of n = 0..10.

What the same recursion costs WITHOUT the cache:
  n = 10: cached does 11 computations, uncached makes 177 calls
  n = 20: cached does 21 computations, uncached makes 21891 calls
  n = 30: cached does 31 computations, uncached makes 2692537 calls
  n = 40: cached does 41 computations, uncached makes 331160281 calls

Same answers either way (this is the part the annotation must not change):
    [computing fib_cold(11)]
    [computing fib_cold(12)]
  13 of 13 values agree between @hot and @cold
  Note which [computing] lines appeared during that check: only 11 and 12.
  n = 0..10 were already cached from the first section, so 11 of the 13
  @cold calls cost nothing. The cache outlives the call that filled it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:cache:miss · eml:return · eml:cache:hit · eml:run:done
