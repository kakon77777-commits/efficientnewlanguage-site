<!-- canonical: efficientnewlanguage.org/ai/examples/364-the-fix-moved-the-boundary | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 364 — The fix moved the boundary — 0 disagreements on every integer tested

`the_fix_moved_the_boundary.eml` runs two repairs for the same boundary defect over two domains and measures where they come apart.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A boundary fix
# that is exactly correct on every value anyone tested.
#
# The rule is "orders of 100 or more need approval". The check says `> 100`, so
# an order of exactly 100 slips. The report names 100, and the fix lowers the
# threshold to 99.
#
# This program was first written to show that lowering the threshold leaves the
# defect class intact. Over integer amounts it does not: `> 99` and `>= 100`
# agree on every integer, so the shifted fix is not an approximation of the
# correct one, it IS the correct one. That result is kept, because the real
# finding is narrower and less comfortable.
#
# The two repairs come apart exactly on the values between the old threshold
# and the new one - and whether such values exist is a fact about the DOMAIN,
# not about the code. An integer test set cannot distinguish the two repairs at
# all, and the reviewer looking at that green suite has no signal to work with.
#
# Nothing is declared. Both repairs run over both domains and the failing sets
# are compared as sets.

def rule(amount):
    if amount >= 100:
        return "approve"
    return "auto"

def check(amount, threshold, use_ge):
    if use_ge == 1:
        if amount >= threshold:
            return "approve"
        return "auto"
    if amount > threshold:
        return "approve"
    return "auto"

[95, 97, 99, 100, 101, 150] => integers
[95, 97, 99, 99.5, 99.9, 100, 101, 150] => with_fractions
100 => reported

def failing_set(amounts, threshold, use_ge):
    [] => f
    for a in amounts:
        if check(a, threshold, use_ge) != rule(a):
            f + [a] => f
    return f

# ---- as shipped, on both domains ----

"as shipped: the check is `> 100`" ^0
"  integer amounts   : failing " + repr(failing_set(integers, 100, 0)) ^0
"  with fractions    : failing " + repr(failing_set(with_fractions, 100, 0)) ^0
"  the reported input is " + str(reported) ^0
"" ^0

# ---- the two repairs, on the domain that was tested ----

"repair A (lower the threshold to 99) and repair B (use >=), integer amounts" ^0
failing_set(integers, 99, 0) => a_int
failing_set(integers, 100, 1) => b_int
"  A failing : " + repr(a_int) ^0
"  B failing : " + repr(b_int) ^0
0 => disagree_int
for x in integers:
    if check(x, 99, 0) != check(x, 100, 1):
        disagree_int + 1 => disagree_int
"  integer amounts where A and B disagree : " + str(disagree_int) + " of " + str(len(integers)) ^0
"" ^0

# ---- the same two repairs, on the domain that exists ----

"the same two repairs, with fractional amounts" ^0
failing_set(with_fractions, 99, 0) => a_frac
failing_set(with_fractions, 100, 1) => b_frac
"  A failing : " + repr(a_frac) ^0
"  B failing : " + repr(b_frac) ^0
0 => disagree_frac
for x in with_fractions:
    if check(x, 99, 0) != check(x, 100, 1):
        disagree_frac + 1 => disagree_frac
        "    " + str(x) + " : A says " + check(x, 99, 0) + ", B says " + check(x, 100, 1) + ", rule says " + rule(x) ^0
"  amounts where A and B disagree : " + str(disagree_frac) + " of " + str(len(with_fractions)) ^0
"" ^0

# ---- what any test over the tested domain can conclude ----

"what an integer-only suite can establish" ^0
if disagree_int == 0:
    "  A and B are indistinguishable on every integer amount" ^0
    "  so no integer test, however thorough, can prefer one over the other" ^0
"  A is wrong on : " + str(len(a_frac)) + " of the " + str(len(with_fractions)) + " real amounts" ^0
"  B is wrong on : " + str(len(b_frac)) ^0
"" ^0

# ---- how far apart the two repairs are ----
#
# The gap between the two thresholds is where they differ. Measure it by
# probing values inside it.

"probing the gap between the old and new thresholds" ^0
[99.1, 99.25, 99.5, 99.75, 99.99] => gap
0 => gap_wrong
for g in gap:
    if check(g, 99, 0) != rule(g):
        gap_wrong + 1 => gap_wrong
"  probes inside the gap : " + str(len(gap)) ^0
"  of those, repair A gets wrong : " + str(gap_wrong) ^0
0 => gap_wrong_b
for g in gap:
    if check(g, 100, 1) != rule(g):
        gap_wrong_b + 1 => gap_wrong_b
"  of those, repair B gets wrong : " + str(gap_wrong_b) ^0
"" ^0

"The two repairs are not near-equivalent and then wrong at the edges. They" ^0
"are EXACTLY equivalent on the values anyone tried, and one of them is wrong" ^0
"on a region that the test set does not contain. A green suite is the only" ^0
"thing the reviewer sees, and it is the same green either way." ^0
```

## Python (deterministic transpilation)

```python
def rule(amount):
    if amount >= 100:
        return "approve"
    return "auto"

def check(amount, threshold, use_ge):
    if use_ge == 1:
        if amount >= threshold:
            return "approve"
        return "auto"
    if amount > threshold:
        return "approve"
    return "auto"

integers = [95, 97, 99, 100, 101, 150]
with_fractions = [95, 97, 99, 99.5, 99.9, 100, 101, 150]
reported = 100

def failing_set(amounts, threshold, use_ge):
    f = []
    for a in amounts:
        if check(a, threshold, use_ge) != rule(a):
            f = f + [a]
    return f

print("as shipped: the check is `> 100`")
print("  integer amounts   : failing " + repr(failing_set(integers, 100, 0)))
print("  with fractions    : failing " + repr(failing_set(with_fractions, 100, 0)))
print("  the reported input is " + str(reported))
print("")
print("repair A (lower the threshold to 99) and repair B (use >=), integer amounts")
a_int = failing_set(integers, 99, 0)
b_int = failing_set(integers, 100, 1)
print("  A failing : " + repr(a_int))
print("  B failing : " + repr(b_int))
disagree_int = 0
for x in integers:
    if check(x, 99, 0) != check(x, 100, 1):
        disagree_int = disagree_int + 1
print("  integer amounts where A and B disagree : " + str(disagree_int) + " of " + str(len(integers)))
print("")
print("the same two repairs, with fractional amounts")
a_frac = failing_set(with_fractions, 99, 0)
b_frac = failing_set(with_fractions, 100, 1)
print("  A failing : " + repr(a_frac))
print("  B failing : " + repr(b_frac))
disagree_frac = 0
for x in with_fractions:
    if check(x, 99, 0) != check(x, 100, 1):
        disagree_frac = disagree_frac + 1
        print("    " + str(x) + " : A says " + check(x, 99, 0) + ", B says " + check(x, 100, 1) + ", rule says " + rule(x))
print("  amounts where A and B disagree : " + str(disagree_frac) + " of " + str(len(with_fractions)))
print("")
print("what an integer-only suite can establish")
if disagree_int == 0:
    print("  A and B are indistinguishable on every integer amount")
    print("  so no integer test, however thorough, can prefer one over the other")
print("  A is wrong on : " + str(len(a_frac)) + " of the " + str(len(with_fractions)) + " real amounts")
print("  B is wrong on : " + str(len(b_frac)))
print("")
print("probing the gap between the old and new thresholds")
gap = [99.1, 99.25, 99.5, 99.75, 99.99]
gap_wrong = 0
for g in gap:
    if check(g, 99, 0) != rule(g):
        gap_wrong = gap_wrong + 1
print("  probes inside the gap : " + str(len(gap)))
print("  of those, repair A gets wrong : " + str(gap_wrong))
gap_wrong_b = 0
for g in gap:
    if check(g, 100, 1) != rule(g):
        gap_wrong_b = gap_wrong_b + 1
print("  of those, repair B gets wrong : " + str(gap_wrong_b))
print("")
print("The two repairs are not near-equivalent and then wrong at the edges. They")
print("are EXACTLY equivalent on the values anyone tried, and one of them is wrong")
print("on a region that the test set does not contain. A green suite is the only")
print("thing the reviewer sees, and it is the same green either way.")
```

## stdout (executed)

```text
as shipped: the check is `> 100`
  integer amounts   : failing [100]
  with fractions    : failing [100]
  the reported input is 100

repair A (lower the threshold to 99) and repair B (use >=), integer amounts
  A failing : []
  B failing : []
  integer amounts where A and B disagree : 0 of 6

the same two repairs, with fractional amounts
  A failing : [99.5, 99.9]
  B failing : []
    99.5 : A says approve, B says auto, rule says auto
    99.9 : A says approve, B says auto, rule says auto
  amounts where A and B disagree : 2 of 8

what an integer-only suite can establish
  A and B are indistinguishable on every integer amount
  so no integer test, however thorough, can prefer one over the other
  A is wrong on : 2 of the 8 real amounts
  B is wrong on : 0

probing the gap between the old and new thresholds
  probes inside the gap : 5
  of those, repair A gets wrong : 5
  of those, repair B gets wrong : 0

The two repairs are not near-equivalent and then wrong at the edges. They
are EXACTLY equivalent on the values anyone tried, and one of them is wrong
on a region that the test set does not contain. A green suite is the only
thing the reviewer sees, and it is the same green either way.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
