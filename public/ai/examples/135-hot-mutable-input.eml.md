<!-- canonical: efficientnewlanguage.org/ai/examples/135-hot-mutable-input | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 135 — Why @hot exists

`hot_mutable_input.eml` argues that `@hot` is a **correctness** annotation that happens to disable an optimisation — not an optimisation annotation that happens to be a no-op.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Why @hot exists.
#
# @cold means "pure, cacheable". @hot means "dynamic state - do not cache". It
# is tempting to read @hot as the absence of an optimisation, i.e. as nothing.
# It is not: it is the annotation that keeps a function CORRECT, and there are
# two independent reasons a function may need it.
#
# Reason 1 - the argument cannot be a cache key at all. @cold becomes
# @functools.cache, which stores arguments in a dict, so every argument must be
# hashable. A list is not. This is not a style objection; it is a TypeError at
# the first call, and the try/except below proves it by running it rather than
# asserting it.
#
# Reason 2 - and this is the deeper one - even if lists WERE hashable, caching
# would be wrong here. The whole point of the function is that the same list
# gives different answers as its contents change over time. A cache keyed on
# "the same argument" would hand back the first answer forever. The second
# section demonstrates that by mutating the readings between calls.
#
# So @hot is a correctness annotation that happens to also disable an
# optimisation, not an optimisation annotation that happens to be a no-op.

@cold
def average_cold(xs):
    len(xs) => n
    Σ(xs[i], i in [0:n - 1]) => total
    return total / n

@hot
def average_hot(xs):
    len(xs) => n
    Σ(xs[i], i in [0:n - 1]) => total
    return total / n

readings^+[10, 20, 30]

"Reason 1: a list cannot be a cache key." => h1
h1^0
try:
    average_cold(readings) => v
    ("  average_cold(readings) = " + str(v) + "  <- unexpected, this should not be reachable")^0
except TypeError:
    "  average_cold(readings) raised TypeError - a list is unhashable," => e1
    e1^0
    "  so @functools.cache cannot store it. @cold is simply not available here." => e2
    e2^0

""^0
"  The same call with @hot works, because nothing is being stored:" => h1b
h1b^0
average_hot(readings) => v1
("  average_hot([10, 20, 30]) = " + str(v1))^0

""^0
"Reason 2: the answer is supposed to change." => h2
h2^0
"  Same list object, mutated between calls - a cache would freeze the first answer." => h2b
h2b^0

40 => readings[0]
average_hot(readings) => v2
("  after readings[0] = 40  -> " + str(v2))^0

50 => readings[1]
average_hot(readings) => v3
("  after readings[1] = 50  -> " + str(v3))^0

60 => readings[2]
average_hot(readings) => v4
("  after readings[2] = 60  -> " + str(v4))^0

""^0
0 => distinct
if v1 != v2:
    distinct + 1 => distinct
if v2 != v3:
    distinct + 1 => distinct
if v3 != v4:
    distinct + 1 => distinct
("Four calls, " + str(distinct) + " of the 3 consecutive pairs differ.")^0
"A cache would have returned " + str(v1) + " every time." => note
note^0
```

## Python (deterministic transpilation)

```python
import functools

@functools.cache
def average_cold(xs):
    n = len(xs)
    total = sum(xs[i] for i in range(0, n))
    return total / n

# @hot: dynamic state — not cached
def average_hot(xs):
    n = len(xs)
    total = sum(xs[i] for i in range(0, n))
    return total / n

readings = [10, 20, 30]
h1 = "Reason 1: a list cannot be a cache key."
print(h1)
try:
    v = average_cold(readings)
    print("  average_cold(readings) = " + str(v) + "  <- unexpected, this should not be reachable")
except TypeError:
    e1 = "  average_cold(readings) raised TypeError - a list is unhashable,"
    print(e1)
    e2 = "  so @functools.cache cannot store it. @cold is simply not available here."
    print(e2)
print("")
h1b = "  The same call with @hot works, because nothing is being stored:"
print(h1b)
v1 = average_hot(readings)
print("  average_hot([10, 20, 30]) = " + str(v1))
print("")
h2 = "Reason 2: the answer is supposed to change."
print(h2)
h2b = "  Same list object, mutated between calls - a cache would freeze the first answer."
print(h2b)
readings[0] = 40
v2 = average_hot(readings)
print("  after readings[0] = 40  -> " + str(v2))
readings[1] = 50
v3 = average_hot(readings)
print("  after readings[1] = 50  -> " + str(v3))
readings[2] = 60
v4 = average_hot(readings)
print("  after readings[2] = 60  -> " + str(v4))
print("")
distinct = 0
if v1 != v2:
    distinct = distinct + 1
if v2 != v3:
    distinct = distinct + 1
if v3 != v4:
    distinct = distinct + 1
print("Four calls, " + str(distinct) + " of the 3 consecutive pairs differ.")
note = "A cache would have returned " + str(v1) + " every time."
print(note)
```

## stdout (executed)

```text
Reason 1: a list cannot be a cache key.
  average_cold(readings) raised TypeError - a list is unhashable,
  so @functools.cache cannot store it. @cold is simply not available here.

  The same call with @hot works, because nothing is being stored:
  average_hot([10, 20, 30]) = 20.0

Reason 2: the answer is supposed to change.
  Same list object, mutated between calls - a cache would freeze the first answer.
  after readings[0] = 40  -> 30.0
  after readings[1] = 50  -> 40.0
  after readings[2] = 60  -> 50.0

Four calls, 3 of the 3 consecutive pairs differ.
A cache would have returned 20.0 every time.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:sum · eml:return · eml:run:done
