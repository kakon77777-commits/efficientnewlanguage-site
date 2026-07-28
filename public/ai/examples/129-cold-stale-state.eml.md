<!-- canonical: efficientnewlanguage.org/ai/examples/129-cold-stale-state | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 129 — When @cold changes the answer

`cold_stale_state.eml` is the other half of [`examples/cold-vs-hot-fibonacci/`](../cold-vs-hot-fibonacci/). That case makes the reassuring point — for a genuinely pure function, `@cold` and `@hot` agree on every value and differ only in cost. This one makes the point that actually bites.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The case where
# @cold changes the ANSWER, not just the cost.
#
# examples/cold-vs-hot-fibonacci makes the reassuring half of the point: for a
# genuinely pure function, @cold and @hot agree on every value and differ only
# in how much work happens. This program makes the other half, which is the one
# that actually bites.
#
# `price` below reads a module-level rate. It takes `units` as its only
# argument, so as far as the cache is concerned price(10) is price(10) forever -
# but the rate is not part of the key, and when it changes the cached answer
# becomes silently wrong. Not slow. Wrong.
#
# Both versions are written out so the divergence is visible side by side:
# after the rate doubles, @hot reports the new price and @cold keeps reporting
# the old one. Nothing about the call site changed. Nothing raises. The only
# difference is one annotation, six lines apart.
#
# This is what EML's temperature model is FOR. "Does this depend on anything
# outside its arguments?" is a question the author has to answer, and @cold is
# the promise that the answer is no. The compiler cannot check the promise in
# general - it can only warn about the obvious cases - so the annotation carries
# real weight, which is why picking it carelessly is a bug and not a style
# choice.

5 => rate

@cold
def price_cold(units):
    return units * rate

@hot
def price_hot(units):
    return units * rate

("rate = " + str(rate))^0
price_cold(10) => c1
price_hot(10) => h1
("  price_cold(10) = " + str(c1) + "   price_hot(10) = " + str(h1))^0
"  (both correct - the cache is being filled here)" => n1
n1^0

""^0
10 => rate
("rate = " + str(rate) + "   <- the rate doubled")^0
price_cold(10) => c2
price_hot(10) => h2
("  price_cold(10) = " + str(c2) + "   price_hot(10) = " + str(h2))^0

""^0
if c2 == h2:
    "  The two agree." => verdict
else:
    "  They DISAGREE. @cold returned the rate-5 answer at rate 10." => verdict
verdict^0

""^0
"An argument the cache has not seen is computed fresh, so the staleness" => n2
n2^0
"is per-key, not global - which makes it harder to spot, not easier:" => n3
n3^0
price_cold(20) => c3
price_hot(20) => h3
("  price_cold(20) = " + str(c3) + "   price_hot(20) = " + str(h3) + "   (agree - 20 was never cached)")^0

""^0
"So the same function is correct for arguments it has not seen before and" => n4
n4^0
"wrong for the ones it has. That is the failure mode @hot prevents." => n5
n5^0
```

## Python (deterministic transpilation)

```python
import functools

rate = 5

@functools.cache
def price_cold(units):
    return units * rate

# @hot: dynamic state — not cached
def price_hot(units):
    return units * rate

print("rate = " + str(rate))
c1 = price_cold(10)
h1 = price_hot(10)
print("  price_cold(10) = " + str(c1) + "   price_hot(10) = " + str(h1))
n1 = "  (both correct - the cache is being filled here)"
print(n1)
print("")
rate = 10
print("rate = " + str(rate) + "   <- the rate doubled")
c2 = price_cold(10)
h2 = price_hot(10)
print("  price_cold(10) = " + str(c2) + "   price_hot(10) = " + str(h2))
print("")
if c2 == h2:
    verdict = "  The two agree."
else:
    verdict = "  They DISAGREE. @cold returned the rate-5 answer at rate 10."
print(verdict)
print("")
n2 = "An argument the cache has not seen is computed fresh, so the staleness"
print(n2)
n3 = "is per-key, not global - which makes it harder to spot, not easier:"
print(n3)
c3 = price_cold(20)
h3 = price_hot(20)
print("  price_cold(20) = " + str(c3) + "   price_hot(20) = " + str(h3) + "   (agree - 20 was never cached)")
print("")
n4 = "So the same function is correct for arguments it has not seen before and"
print(n4)
n5 = "wrong for the ones it has. That is the failure mode @hot prevents."
print(n5)
```

## stdout (executed)

```text
rate = 5
  price_cold(10) = 50   price_hot(10) = 50
  (both correct - the cache is being filled here)

rate = 10   <- the rate doubled
  price_cold(10) = 50   price_hot(10) = 100

  They DISAGREE. @cold returned the rate-5 answer at rate 10.

An argument the cache has not seen is computed fresh, so the staleness
is per-key, not global - which makes it harder to spot, not easier:
  price_cold(20) = 200   price_hot(20) = 200   (agree - 20 was never cached)

So the same function is correct for arguments it has not seen before and
wrong for the ones it has. That is the failure mode @hot prevents.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:cache:miss · eml:return · eml:cache:hit · eml:run:done
