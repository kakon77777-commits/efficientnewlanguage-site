<!-- canonical: efficientnewlanguage.org/ai/examples/417-dividing-in-place-changes-the-type | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 417 — Dividing in place changes the type

`dividing_in_place_changes_the_type.eml` - Four compound assignments look alike. One of them changes what the variable is.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Four compound
# assignments look alike. One of them changes what the variable is.
#
# `^+`, `^-` and `^*` on two integers give an integer. `^/` gives a float,
# always, even when the division is exact - which is the right rule, because
# the alternative is a division whose result type depends on the values.
#
# The consequence is that a counter updated with `^/` stops printing the way it
# did while still comparing the way it did, in code that changed by one
# character. Which of those two survives is measured below, not asserted here.

12 => a
12 => b
12 => c
12 => d

a ^+ 4
b ^- 4
c ^* 4
d ^/ 4

"starting from 12" ^0
"  ^+ 4 : " + str(a) ^0
"  ^- 4 : " + str(b) ^0
"  ^* 4 : " + str(c) ^0
"  ^/ 4 : " + str(d) ^0
"" ^0

# ---- the one that prints differently ----

"how each renders" ^0
"  the three integer results carry no point" ^0
"  the divided one renders as " + str(d) ^0
if d == int(d):
    "  and 12 divided by 4 leaves no remainder, so the point is the type" ^0
else:
    "  and the division was not exact, so the point carries information" ^0
"" ^0

# ---- what it does to a comparison ----

3 => want
if d == want:
    "  d == 3 is true, so equality still holds across the types" ^0
if str(d) == str(want):
    "  and the strings match too" ^0
else:
    "  but str(d) is '" + str(d) + "' and str(3) is '" + str(want) + "'" ^0
"" ^0

# ---- a counter that goes through a halving ----

100 => n
0 => steps
[] => fvals
[] => ftexts
"halving a counter until it is below 10" ^0
while n >= 10:
    n ^/ 2
    steps ^+ 1
    fvals + [n] => fvals
    ftexts + [str(n)] => ftexts
    "  step " + str(steps) + " : " + str(n) ^0
"  steps : " + str(steps) ^0
"" ^0

# ---- the integer-preserving way to write the same loop ----

100 => m
0 => msteps
[] => ivals
[] => itexts
"the same loop keeping an integer" ^0
while m >= 10:
    int(m / 2) => m
    msteps ^+ 1
    ivals + [m] => ivals
    itexts + [str(m)] => itexts
    "  step " + str(msteps) + " : " + str(m) ^0
"  steps : " + str(msteps) ^0
"" ^0

# ---- how far apart the two loops actually are ----
#
# "they print differently" and "they hold different numbers" are two different
# counts, and the second is smaller. Both are computed from the recorded steps.

"comparing the two loops step by step" ^0
if steps == msteps:
    "  both ran " + str(steps) + " steps" ^0
else:
    "  they ran different numbers of steps : " + str(steps) + " and " + str(msteps) ^0
0 => text_diff
0 => value_diff
for i in [0:steps - 1]:
    if not (ftexts[i] == itexts[i]):
        text_diff + 1 => text_diff
    if not (fvals[i] == ivals[i]):
        value_diff + 1 => value_diff
"  steps that print differently : " + str(text_diff) + " of " + str(steps) ^0
"  steps that hold a different number : " + str(value_diff) + " of " + str(steps) ^0
if text_diff > value_diff:
    "  so " + str(text_diff - value_diff) + " of them are the same number wearing a point" ^0
"" ^0

# ---- where the two actually diverge ----

25 => p
25 => q
p ^/ 2
int(q / 2) => q
"a division that is not exact" ^0
"  ^/ 2   : " + str(p) ^0
"  int(/2): " + str(q) ^0
if not (p == q):
    "  here the two disagree on the value, not only on the rendering" ^0
"" ^0

# ---- the control: the three that keep the type ----
#
# The rule is specific to division. The other three compound operators return
# what they were given.

7 => x
7 => y
7 => z
x ^+ 0
y ^- 0
z ^* 1
"control - the other three, applied as identities" ^0
"  ^+ 0 : " + str(x) + ", ^- 0 : " + str(y) + ", ^* 1 : " + str(z) ^0
if str(x) == "7":
    if str(y) == "7":
        if str(z) == "7":
            "  all three render exactly as they started" ^0
"" ^0

"One character separates the three that preserve the type from the one that" ^0
"does not, and the divided value is still equal to the integer it should be." ^0
```

## Python (deterministic transpilation)

```python
a = 12
b = 12
c = 12
d = 12
a += 4
b -= 4
c *= 4
d /= 4
print("starting from 12")
print("  ^+ 4 : " + str(a))
print("  ^- 4 : " + str(b))
print("  ^* 4 : " + str(c))
print("  ^/ 4 : " + str(d))
print("")
print("how each renders")
print("  the three integer results carry no point")
print("  the divided one renders as " + str(d))
if d == int(d):
    print("  and 12 divided by 4 leaves no remainder, so the point is the type")
else:
    print("  and the division was not exact, so the point carries information")
print("")
want = 3
if d == want:
    print("  d == 3 is true, so equality still holds across the types")
if str(d) == str(want):
    print("  and the strings match too")
else:
    print("  but str(d) is '" + str(d) + "' and str(3) is '" + str(want) + "'")
print("")
n = 100
steps = 0
fvals = []
ftexts = []
print("halving a counter until it is below 10")
while n >= 10:
    n /= 2
    steps += 1
    fvals = fvals + [n]
    ftexts = ftexts + [str(n)]
    print("  step " + str(steps) + " : " + str(n))
print("  steps : " + str(steps))
print("")
m = 100
msteps = 0
ivals = []
itexts = []
print("the same loop keeping an integer")
while m >= 10:
    m = int(m / 2)
    msteps += 1
    ivals = ivals + [m]
    itexts = itexts + [str(m)]
    print("  step " + str(msteps) + " : " + str(m))
print("  steps : " + str(msteps))
print("")
print("comparing the two loops step by step")
if steps == msteps:
    print("  both ran " + str(steps) + " steps")
else:
    print("  they ran different numbers of steps : " + str(steps) + " and " + str(msteps))
text_diff = 0
value_diff = 0
for i in range(0, steps):
    if not ftexts[i] == itexts[i]:
        text_diff = text_diff + 1
    if not fvals[i] == ivals[i]:
        value_diff = value_diff + 1
print("  steps that print differently : " + str(text_diff) + " of " + str(steps))
print("  steps that hold a different number : " + str(value_diff) + " of " + str(steps))
if text_diff > value_diff:
    print("  so " + str(text_diff - value_diff) + " of them are the same number wearing a point")
print("")
p = 25
q = 25
p /= 2
q = int(q / 2)
print("a division that is not exact")
print("  ^/ 2   : " + str(p))
print("  int(/2): " + str(q))
if not p == q:
    print("  here the two disagree on the value, not only on the rendering")
print("")
x = 7
y = 7
z = 7
x += 0
y -= 0
z *= 1
print("control - the other three, applied as identities")
print("  ^+ 0 : " + str(x) + ", ^- 0 : " + str(y) + ", ^* 1 : " + str(z))
if str(x) == "7":
    if str(y) == "7":
        if str(z) == "7":
            print("  all three render exactly as they started")
print("")
print("One character separates the three that preserve the type from the one that")
print("does not, and the divided value is still equal to the integer it should be.")
```

## stdout (executed)

```text
starting from 12
  ^+ 4 : 16
  ^- 4 : 8
  ^* 4 : 48
  ^/ 4 : 3.0

how each renders
  the three integer results carry no point
  the divided one renders as 3.0
  and 12 divided by 4 leaves no remainder, so the point is the type

  d == 3 is true, so equality still holds across the types
  but str(d) is '3.0' and str(3) is '3'

halving a counter until it is below 10
  step 1 : 50.0
  step 2 : 25.0
  step 3 : 12.5
  step 4 : 6.25
  steps : 4

the same loop keeping an integer
  step 1 : 50
  step 2 : 25
  step 3 : 12
  step 4 : 6
  steps : 4

comparing the two loops step by step
  both ran 4 steps
  steps that print differently : 4 of 4
  steps that hold a different number : 2 of 4
  so 2 of them are the same number wearing a point

a division that is not exact
  ^/ 2   : 12.5
  int(/2): 12
  here the two disagree on the value, not only on the rendering

control - the other three, applied as identities
  ^+ 0 : 7, ^- 0 : 7, ^* 1 : 7
  all three render exactly as they started

One character separates the three that preserve the type from the one that
does not, and the divided value is still equal to the integer it should be.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
