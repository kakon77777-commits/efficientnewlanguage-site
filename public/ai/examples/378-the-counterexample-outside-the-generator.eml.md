<!-- canonical: efficientnewlanguage.org/ai/examples/378-the-counterexample-outside-the-generator | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 378 — The counterexample outside the generator — 2000 inputs found 0, 160 found 52

`the_counterexample_outside_the_generator.eml` checks two real implementations of integer division against each other and varies the sample count and the sample range separately.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A property check
# runs thousands of inputs, finds nothing, and could not have found anything.
#
# Two implementations of integer division: one truncates toward zero, the other
# floors. They agree on every non-negative numerator and disagree on negatives
# that do not divide evenly. That is a real divergence, not a contrived one.
#
# The generator draws numerators from 0 upward, because that is what the caller
# was documented to pass. So the check is sound, the implementations are as
# written, and the result is zero divergences - forever, at any sample size.
#
# The measurement that matters is not how many samples found nothing. It is how
# much of the domain the generator can reach at all. Raising the count moves
# one number; widening the range moves the other.

7 => d

def trunc_div(n):
    return int(n / d)

def floor_div(n):
    return int((n - n % d) / d)

def diverges(n):
    if trunc_div(n) == floor_div(n):
        return 0
    return 1

# ---- the generator as written: numerators 0 upward ----

def sweep(lo, hi):
    0 => found
    for n in [lo:hi]:
        found + diverges(n) => found
    return found

def size(lo, hi):
    0 => n
    for i in [lo:hi]:
        n + 1 => n
    return n

"generator as written - numerators from 0" ^0
"  100 inputs  : " + str(sweep(0, 99)) + " divergences" ^0
"  500 inputs  : " + str(sweep(0, 499)) + " divergences" ^0
"  2000 inputs : " + str(sweep(0, 1999)) + " divergences" ^0
"" ^0

# ---- the same check, a generator that can express negatives ----

"generator widened - numerators from -60" ^0
"  160 inputs  : " + str(sweep(-60, 99)) + " divergences" ^0
"" ^0

sweep(0, 1999) => big_narrow
sweep(-60, 99) => small_wide
size(0, 1999) => big_n
size(-60, 99) => small_n

"  " + str(big_n) + " inputs from the narrow generator : " + str(big_narrow) ^0
"  " + str(small_n) + " inputs from the wide generator   : " + str(small_wide) ^0
if big_narrow == 0:
    if small_wide > 0:
        "  the smaller sweep found more, and count was never the constraint" ^0
"" ^0

# ---- where the divergences actually live ----

0 => neg_total
0 => neg_diverging
for n in [-60:-1]:
    neg_total + 1 => neg_total
    neg_diverging + diverges(n) => neg_diverging

0 => pos_total
0 => pos_diverging
for n in [0:1999]:
    pos_total + 1 => pos_total
    pos_diverging + diverges(n) => pos_diverging

"divergences by sign of numerator" ^0
"  negative numerators tried : " + str(neg_total) + ", diverging : " + str(neg_diverging) ^0
"  positive numerators tried : " + str(pos_total) + ", diverging : " + str(pos_diverging) ^0
if pos_diverging == 0:
    "  every divergence is on the side the generator cannot produce" ^0
"" ^0

# ---- one witness, printed, so the divergence is not taken on trust ----

0 => witness
for n in [-60:-1]:
    if witness == 0:
        if diverges(n) == 1:
            n => witness

"witness" ^0
"  n            : " + str(witness) ^0
"  truncating   : " + str(trunc_div(witness)) ^0
"  flooring     : " + str(floor_div(witness)) ^0
"  n % d        : " + str(witness % d) ^0
"" ^0

# ---- and the control: a numerator the narrow generator DOES produce ----
#
# Without this the reader cannot tell whether the two implementations differ
# everywhere and the sweep is simply broken.

13 => ctrl
"control - a numerator inside the narrow range" ^0
"  n            : " + str(ctrl) ^0
"  truncating   : " + str(trunc_div(ctrl)) ^0
"  flooring     : " + str(floor_div(ctrl)) ^0
if trunc_div(ctrl) == floor_div(ctrl):
    "  they agree here, so the sweep's zero is a real observation" ^0
"" ^0

"A sweep reports two things and returns one: what it found, and the shape of" ^0
"the inputs it was able to build. When those inputs are drawn from a subspace," ^0
"the count of samples measures effort, not coverage." ^0
```

## Python (deterministic transpilation)

```python
d = 7

def trunc_div(n):
    return int(n / d)

def floor_div(n):
    return int((n - n % d) / d)

def diverges(n):
    if trunc_div(n) == floor_div(n):
        return 0
    return 1

def sweep(lo, hi):
    found = 0
    for n in range(lo, hi+1):
        found = found + diverges(n)
    return found

def size(lo, hi):
    n = 0
    for i in range(lo, hi+1):
        n = n + 1
    return n

print("generator as written - numerators from 0")
print("  100 inputs  : " + str(sweep(0, 99)) + " divergences")
print("  500 inputs  : " + str(sweep(0, 499)) + " divergences")
print("  2000 inputs : " + str(sweep(0, 1999)) + " divergences")
print("")
print("generator widened - numerators from -60")
print("  160 inputs  : " + str(sweep(-60, 99)) + " divergences")
print("")
big_narrow = sweep(0, 1999)
small_wide = sweep(-60, 99)
big_n = size(0, 1999)
small_n = size(-60, 99)
print("  " + str(big_n) + " inputs from the narrow generator : " + str(big_narrow))
print("  " + str(small_n) + " inputs from the wide generator   : " + str(small_wide))
if big_narrow == 0:
    if small_wide > 0:
        print("  the smaller sweep found more, and count was never the constraint")
print("")
neg_total = 0
neg_diverging = 0
for n in range(-60, 0):
    neg_total = neg_total + 1
    neg_diverging = neg_diverging + diverges(n)
pos_total = 0
pos_diverging = 0
for n in range(0, 2000):
    pos_total = pos_total + 1
    pos_diverging = pos_diverging + diverges(n)
print("divergences by sign of numerator")
print("  negative numerators tried : " + str(neg_total) + ", diverging : " + str(neg_diverging))
print("  positive numerators tried : " + str(pos_total) + ", diverging : " + str(pos_diverging))
if pos_diverging == 0:
    print("  every divergence is on the side the generator cannot produce")
print("")
witness = 0
for n in range(-60, 0):
    if witness == 0:
        if diverges(n) == 1:
            witness = n
print("witness")
print("  n            : " + str(witness))
print("  truncating   : " + str(trunc_div(witness)))
print("  flooring     : " + str(floor_div(witness)))
print("  n % d        : " + str(witness % d))
print("")
ctrl = 13
print("control - a numerator inside the narrow range")
print("  n            : " + str(ctrl))
print("  truncating   : " + str(trunc_div(ctrl)))
print("  flooring     : " + str(floor_div(ctrl)))
if trunc_div(ctrl) == floor_div(ctrl):
    print("  they agree here, so the sweep's zero is a real observation")
print("")
print("A sweep reports two things and returns one: what it found, and the shape of")
print("the inputs it was able to build. When those inputs are drawn from a subspace,")
print("the count of samples measures effort, not coverage.")
```

## stdout (executed)

```text
generator as written - numerators from 0
  100 inputs  : 0 divergences
  500 inputs  : 0 divergences
  2000 inputs : 0 divergences

generator widened - numerators from -60
  160 inputs  : 52 divergences

  2000 inputs from the narrow generator : 0
  160 inputs from the wide generator   : 52
  the smaller sweep found more, and count was never the constraint

divergences by sign of numerator
  negative numerators tried : 60, diverging : 52
  positive numerators tried : 2000, diverging : 0
  every divergence is on the side the generator cannot produce

witness
  n            : -60
  truncating   : -8
  flooring     : -9
  n % d        : 3

control - a numerator inside the narrow range
  n            : 13
  truncating   : 1
  flooring     : 1
  they agree here, so the sweep's zero is a real observation

A sweep reports two things and returns one: what it found, and the shape of
the inputs it was able to build. When those inputs are drawn from a subspace,
the count of samples measures effort, not coverage.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
