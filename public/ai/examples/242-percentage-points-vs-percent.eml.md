<!-- canonical: efficientnewlanguage.org/ai/examples/242-percentage-points-vs-percent | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 242 — Points add and reverse; relative changes do not

`percentage_points_vs_percent.eml` distinguishes the two units hiding behind "it went up 2%", in integer basis points so no float enters the comparison.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). "It went up 2%",
# which is two different numbers.
#
# A rate moves from 4% to 6%. Three sentences describe it, all true:
#
#     up 2 percentage points      6 - 4
#     up 50 percent               (6 - 4) / 4
#     now 6 percent               the level, not the change
#
# The unit is missing from all three in ordinary speech, and the two changes
# differ by a factor of 25 here. A report that mixes them is not rounding
# badly - it is answering a different question, and both answers are correct
# answers to questions nobody distinguished.
#
# The related trap is the base. "20% off, then 20% back on" does not return,
# because the second 20% is of a smaller number - a case this corpus already
# measures from the pricing side. Here the base is a rate rather than a price,
# and the same asymmetry produces a claim that is exactly backwards: a rate
# that falls 50% and rises 50% ends up LOWER than it started.
#
# The measurement is a round trip and an invariant. Percentage points compose
# by addition and are exactly reversible; relative changes compose by
# multiplication and are not. Both are swept over a grid, in integer basis
# points so no floating point enters the comparison.

# Rates are held in basis points: 400 = 4.00%.
def bp_to_text(bp):
    str(int(bp / 100)) => whole
    str(bp % 100) => frac
    if len(frac) < 2:
        "0" + frac => frac
    return whole + "." + frac + "%"

def change_in_points(before, after):
    return after - before

def change_in_percent(before, after):
    # Relative change, in basis points of the ORIGINAL. Integer arithmetic so
    # the comparison is exact.
    if before == 0:
        return 0
    return int((after - before) * 10000 / before)

def apply_points(bp, delta_points):
    return bp + delta_points

def apply_percent(bp, delta_bp):
    return int(bp * (10000 + delta_bp) / 10000)


"before   after    points   relative"^0
for pair in [[400, 600], [400, 200], [1000, 1100], [50, 100], [900, 800]]:
    pair[0] => a
    pair[1] => b
    ("%-8s %-8s %-8s %s" % (bp_to_text(a), bp_to_text(b), "+" + bp_to_text(change_in_points(a, b)), "+" + bp_to_text(change_in_percent(a, b))))^0

""^0
"4% to 6%, said three ways:"^0
("  up " + bp_to_text(change_in_points(400, 600)) + " points")^0
("  up " + bp_to_text(change_in_percent(400, 600)) + " relative")^0
("  now " + bp_to_text(600))^0
("  the two changes differ by a factor of " + str(int(change_in_percent(400, 600) / change_in_points(400, 600))))^0

# ---------------------------------------------------- reversibility
# Apply a change and undo it. Points undo exactly; relative changes do not,
# and the direction of the residual error is always the same.
[100, 400, 900, 2500, 5000] => rates
[500, 1000, 2500, 5000] => moves

0 => n
0 => points_exact
0 => percent_exact
0 => percent_low
[] => witness
for r in rates:
    for m in moves:
        n + 1 => n
        # points: up m basis points, then down m
        apply_points(apply_points(r, m), 0 - m) => p_back
        if p_back == r:
            points_exact + 1 => points_exact
        # relative: up m/100 percent, then down the same percentage
        apply_percent(apply_percent(r, m), 0 - m) => q_back
        if q_back == r:
            percent_exact + 1 => percent_exact
        elif q_back < r:
            percent_low + 1 => percent_low
            if len(witness) < 3:
                witness + [bp_to_text(r) + " +" + bp_to_text(m) + "rel then -" + bp_to_text(m) + "rel -> " + bp_to_text(q_back)] => witness

""^0
("round trips tried:               " + str(n))^0
("  percentage points exact:       " + str(points_exact) + "/" + str(n))^0
("  relative change exact:         " + str(percent_exact) + "/" + str(n))^0
("  relative change ended LOWER:   " + str(percent_low) + "/" + str(n))^0
for w in witness:
    ("  " + w)^0

# ------------------------------------------------------ composition
# Two successive changes. Points add; relative changes multiply, so reporting
# the sum of two relative changes is wrong by their product.
""^0
"two successive moves on a 4.00% rate:"^0
400 => start
apply_points(apply_points(start, 200), 100) => p_two
apply_percent(apply_percent(start, 5000), 2500) => q_two
("  +2.00 then +1.00 points  -> " + bp_to_text(p_two) + "   sum of the moves: " + bp_to_text(300))^0
("  +50% then +25% relative  -> " + bp_to_text(q_two) + "   sum of the moves: 75.00%")^0
("  actual relative change:     " + bp_to_text(change_in_percent(start, q_two)))^0
("  75% would have given:       " + bp_to_text(apply_percent(start, 7500)))^0

# ------------------------------------------------ where the base disappears
# A relative change with no base is not a number. Two rates with the same
# relative move end at completely different levels.
""^0
"a '+50%' with no base stated:"^0
0 => distinct_ends
{} => ends
for r in [100, 400, 2000]:
    apply_percent(r, 5000) => e
    1 => ends[e]
    ("  " + bp_to_text(r) + " +50% -> " + bp_to_text(e))^0
len(ends) => distinct_ends
("  distinct results from one sentence: " + str(distinct_ends))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Points must round-trip exactly, every time. That is what makes them a unit.
checked + 1 => checked
if points_exact == n:
    passed + 1 => passed

# Relative changes must fail to round-trip on most pairs, and must never end
# HIGHER - the error has a direction.
checked + 1 => checked
if percent_exact < n and percent_low + percent_exact == n:
    passed + 1 => passed

# Points must compose by addition exactly.
checked + 1 => checked
if p_two == start + 300:
    passed + 1 => passed

# Relative changes must NOT compose by addition - the two-step result must
# differ from applying the sum.
checked + 1 => checked
if not (q_two == apply_percent(start, 7500)):
    passed + 1 => passed

# One relative sentence must produce different levels from different bases,
# which is why the base is part of the statement rather than context.
checked + 1 => checked
if distinct_ends == 3:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Points add and reverse; relative changes multiply and do not." => verdict
else:
    "FAILED - a unit did not behave as the checks describe." => verdict
verdict^0

""^0
"Both numbers are correct and they answer different questions, so no" => n1
n1^0
"arithmetic check catches the mix-up - only a unit does. Percentage points" => n2
n2^0
"are a real unit with addition and an inverse; a relative change is a ratio" => n3
n3^0
"that means nothing without the base it was taken against, and the base is" => n4
n4^0
"exactly what the sentence leaves out." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def bp_to_text(bp):
    whole = str(int(bp / 100))
    frac = str(bp % 100)
    if len(frac) < 2:
        frac = "0" + frac
    return whole + "." + frac + "%"

def change_in_points(before, after):
    return after - before

def change_in_percent(before, after):
    if before == 0:
        return 0
    return int((after - before) * 10000 / before)

def apply_points(bp, delta_points):
    return bp + delta_points

def apply_percent(bp, delta_bp):
    return int(bp * (10000 + delta_bp) / 10000)

print("before   after    points   relative")
for pair in [[400, 600], [400, 200], [1000, 1100], [50, 100], [900, 800]]:
    a = pair[0]
    b = pair[1]
    print("%-8s %-8s %-8s %s" % (bp_to_text(a), bp_to_text(b), "+" + bp_to_text(change_in_points(a, b)), "+" + bp_to_text(change_in_percent(a, b))))
print("")
print("4% to 6%, said three ways:")
print("  up " + bp_to_text(change_in_points(400, 600)) + " points")
print("  up " + bp_to_text(change_in_percent(400, 600)) + " relative")
print("  now " + bp_to_text(600))
print("  the two changes differ by a factor of " + str(int(change_in_percent(400, 600) / change_in_points(400, 600))))
rates = [100, 400, 900, 2500, 5000]
moves = [500, 1000, 2500, 5000]
n = 0
points_exact = 0
percent_exact = 0
percent_low = 0
witness = []
for r in rates:
    for m in moves:
        n = n + 1
        p_back = apply_points(apply_points(r, m), 0 - m)
        if p_back == r:
            points_exact = points_exact + 1
        q_back = apply_percent(apply_percent(r, m), 0 - m)
        if q_back == r:
            percent_exact = percent_exact + 1
        elif q_back < r:
            percent_low = percent_low + 1
            if len(witness) < 3:
                witness = witness + [bp_to_text(r) + " +" + bp_to_text(m) + "rel then -" + bp_to_text(m) + "rel -> " + bp_to_text(q_back)]
print("")
print("round trips tried:               " + str(n))
print("  percentage points exact:       " + str(points_exact) + "/" + str(n))
print("  relative change exact:         " + str(percent_exact) + "/" + str(n))
print("  relative change ended LOWER:   " + str(percent_low) + "/" + str(n))
for w in witness:
    print("  " + w)
print("")
print("two successive moves on a 4.00% rate:")
start = 400
p_two = apply_points(apply_points(start, 200), 100)
q_two = apply_percent(apply_percent(start, 5000), 2500)
print("  +2.00 then +1.00 points  -> " + bp_to_text(p_two) + "   sum of the moves: " + bp_to_text(300))
print("  +50% then +25% relative  -> " + bp_to_text(q_two) + "   sum of the moves: 75.00%")
print("  actual relative change:     " + bp_to_text(change_in_percent(start, q_two)))
print("  75% would have given:       " + bp_to_text(apply_percent(start, 7500)))
print("")
print("a '+50%' with no base stated:")
distinct_ends = 0
ends = {}
for r in [100, 400, 2000]:
    e = apply_percent(r, 5000)
    ends[e] = 1
    print("  " + bp_to_text(r) + " +50% -> " + bp_to_text(e))
distinct_ends = len(ends)
print("  distinct results from one sentence: " + str(distinct_ends))
passed = 0
checked = 0
checked = checked + 1
if points_exact == n:
    passed = passed + 1
checked = checked + 1
if percent_exact < n and percent_low + percent_exact == n:
    passed = passed + 1
checked = checked + 1
if p_two == start + 300:
    passed = passed + 1
checked = checked + 1
if not q_two == apply_percent(start, 7500):
    passed = passed + 1
checked = checked + 1
if distinct_ends == 3:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Points add and reverse; relative changes multiply and do not."
else:
    verdict = "FAILED - a unit did not behave as the checks describe."
print(verdict)
print("")
n1 = "Both numbers are correct and they answer different questions, so no"
print(n1)
n2 = "arithmetic check catches the mix-up - only a unit does. Percentage points"
print(n2)
n3 = "are a real unit with addition and an inverse; a relative change is a ratio"
print(n3)
n4 = "that means nothing without the base it was taken against, and the base is"
print(n4)
n5 = "exactly what the sentence leaves out."
print(n5)
```

## stdout (executed)

```text
before   after    points   relative
4.00%    6.00%    +2.00%   +50.00%
4.00%    2.00%    +-2.00%  +-50.00%
10.00%   11.00%   +1.00%   +10.00%
0.50%    1.00%    +0.50%   +100.00%
9.00%    8.00%    +-1.00%  +-11.89%

4% to 6%, said three ways:
  up 2.00% points
  up 50.00% relative
  now 6.00%
  the two changes differ by a factor of 25

round trips tried:               20
  percentage points exact:       20/20
  relative change exact:         0/20
  relative change ended LOWER:   20/20
  1.00% +5.00%rel then -5.00%rel -> 0.99%
  1.00% +10.00%rel then -10.00%rel -> 0.99%
  1.00% +25.00%rel then -25.00%rel -> 0.93%

two successive moves on a 4.00% rate:
  +2.00 then +1.00 points  -> 7.00%   sum of the moves: 3.00%
  +50% then +25% relative  -> 7.50%   sum of the moves: 75.00%
  actual relative change:     87.50%
  75% would have given:       7.00%

a '+50%' with no base stated:
  1.00% +50% -> 1.50%
  4.00% +50% -> 6.00%
  20.00% +50% -> 30.00%
  distinct results from one sentence: 3

checks passed: 5/5
Points add and reverse; relative changes multiply and do not.

Both numbers are correct and they answer different questions, so no
arithmetic check catches the mix-up - only a unit does. Percentage points
are a real unit with addition and an inverse; a relative change is a ratio
that means nothing without the base it was taken against, and the base is
exactly what the sentence leaves out.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:output · eml:assign · eml:call · eml:return · eml:run:done
