<!-- canonical: efficientnewlanguage.org/ai/examples/166-running-total-sum | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 166 — `sum()` is less boring than it looks

`running_total_sum.eml` exercises the three behaviours of `sum()` that matter and are easy to get wrong.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). sum() looks like
# the most boring builtin there is. It has three behaviours worth knowing, and
# this program exercises all three.
#
#   1. The second argument is a START value, not a step or a limit. It is where
#      the accumulator begins, which makes `sum(xs, 100)` an opening balance
#      rather than an off-by-one hazard.
#   2. Floats are summed with COMPENSATION. CPython's sum() carries a running
#      correction term, so 0.1 + 0.2 + 0.3 through sum() is not the same double
#      as adding them left to right by hand. Both are printed below; they differ.
#   3. Strings are REFUSED on purpose. sum() raises rather than concatenating,
#      because repeated string concatenation is quadratic and the language would
#      rather point you at ''.join() than quietly let you write the slow version.
#
# All three were unexercised: `sum()` was called by ZERO of the 149 corpus
# programs before this one. (The Sigma operator routes through the same
# compensated addition, which is why the float behaviour was already correct -
# but the builtin's own argument shapes were not: a tuple raised TypeError, and
# summing strings happily returned "ab".)

[12, 7, 30, 51, 8] => daily
"Daily amounts: " + str(daily) => h
h^0
("  sum(daily)          = " + str(sum(daily)))^0
("  sum(daily, 100)     = " + str(sum(daily, 100)) + "   <- 100 is an OPENING BALANCE")^0
("  sum([])             = " + str(sum([])) + "     <- the empty sum is 0, not an error")^0
("  sum([], 100)        = " + str(sum([], 100)))^0

""^0
"Any iterable, not just a list" => h2
h2^0
("  sum((1, 2, 3))      = " + str(sum((1, 2, 3))) + "   <- tuple")^0
("  sum({1, 2, 3})      = " + str(sum({1, 2, 3})) + "   <- set (order cannot change a total)")^0
# bool is an int subtype, so summing flags counts the True ones.
("  sum([True, True, False]) = " + str(sum([True, True, False])) + " <- counts the True flags")^0

""^0
"Compensated addition is not left-to-right addition" => h3
h3^0
[0.1, 0.2, 0.3] => parts
0.0 => by_hand
for p in parts:
    by_hand + p => by_hand
("  0.1 + 0.2 + 0.3 by hand = " + repr(by_hand))^0
("  sum([0.1, 0.2, 0.3])    = " + repr(sum(parts)))^0
("  identical? " + str(by_hand == sum(parts)))^0

""^0
"Strings are refused, deliberately" => h4
h4^0
try:
    sum(["a", "b"], "") => joined
    ("  sum returned " + repr(joined) + " - this line should be unreachable")^0
except TypeError as e:
    ("  " + str(e))^0
```

## Python (deterministic transpilation)

```python
daily = [12, 7, 30, 51, 8]
h = "Daily amounts: " + str(daily)
print(h)
print("  sum(daily)          = " + str(sum(daily)))
print("  sum(daily, 100)     = " + str(sum(daily, 100)) + "   <- 100 is an OPENING BALANCE")
print("  sum([])             = " + str(sum([])) + "     <- the empty sum is 0, not an error")
print("  sum([], 100)        = " + str(sum([], 100)))
print("")
h2 = "Any iterable, not just a list"
print(h2)
print("  sum((1, 2, 3))      = " + str(sum((1, 2, 3))) + "   <- tuple")
print("  sum({1, 2, 3})      = " + str(sum({1, 2, 3})) + "   <- set (order cannot change a total)")
print("  sum([True, True, False]) = " + str(sum([True, True, False])) + " <- counts the True flags")
print("")
h3 = "Compensated addition is not left-to-right addition"
print(h3)
parts = [0.1, 0.2, 0.3]
by_hand = 0.0
for p in parts:
    by_hand = by_hand + p
print("  0.1 + 0.2 + 0.3 by hand = " + repr(by_hand))
print("  sum([0.1, 0.2, 0.3])    = " + repr(sum(parts)))
print("  identical? " + str(by_hand == sum(parts)))
print("")
h4 = "Strings are refused, deliberately"
print(h4)
try:
    joined = sum(["a", "b"], "")
    print("  sum returned " + repr(joined) + " - this line should be unreachable")
except TypeError as e:
    print("  " + str(e))
```

## stdout (executed)

```text
Daily amounts: [12, 7, 30, 51, 8]
  sum(daily)          = 108
  sum(daily, 100)     = 208   <- 100 is an OPENING BALANCE
  sum([])             = 0     <- the empty sum is 0, not an error
  sum([], 100)        = 100

Any iterable, not just a list
  sum((1, 2, 3))      = 6   <- tuple
  sum({1, 2, 3})      = 6   <- set (order cannot change a total)
  sum([True, True, False]) = 2 <- counts the True flags

Compensated addition is not left-to-right addition
  0.1 + 0.2 + 0.3 by hand = 0.6000000000000001
  sum([0.1, 0.2, 0.3])    = 0.6
  identical? False

Strings are refused, deliberately
  sum() can't sum strings [use ''.join(seq) instead]
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
