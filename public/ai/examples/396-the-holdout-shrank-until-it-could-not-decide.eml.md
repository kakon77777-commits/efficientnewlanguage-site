<!-- canonical: efficientnewlanguage.org/ai/examples/396-the-holdout-shrank-until-it-could-not-decide | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 396 — The holdout shrank until it could not decide - and at an effect of 6 it still could

`the_holdout_shrank_until_it_could_not_decide.eml` enumerates every possible contiguous holdout of each size - nothing is sampled - and prints the range of measured effects.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The holdout was
# cut from a fifth to a twentieth. It still produces a number.
#
# Shrinking the holdout is the reasonable compromise. Somebody points out that
# holding back a fifth of users from a change everyone believes in is expensive,
# and the answer - hold back fewer - keeps the machinery, keeps the dashboard,
# and keeps the word "controlled" in the writeup.
#
# What it removes is the holdout's ability to tell the effect from which units
# happened to land in it. Every unit here has its own seasonal lift, so the
# comparison does not cancel, and the measurement is what varies.
#
# Nothing below is sampled: every possible contiguous holdout of each size is
# enumerated and the range printed.
#
# The case was written expecting small holdouts to report zero or less. At an
# effect of 6 they never do - the effect is simply larger than the variation.
# That result is kept, and a second effect size is added beside it, because
# whether a holdout can decide is a property of the effect RELATIVE to what
# would have happened anyway, and neither number alone says which regime you
# are in.

# [unit, before, its own seasonal lift]
[["u1", 20, 8], ["u2", 24, 16], ["u3", 18, 9], ["u4", 30, 15], ["u5", 22, 11], ["u6", 26, 13], ["u7", 19, 8], ["u8", 28, 16], ["u9", 21, 10], ["u10", 25, 14], ["u11", 23, 9], ["u12", 27, 15], ["u13", 20, 12], ["u14", 29, 12], ["u15", 22, 10], ["u16", 24, 14], ["u17", 26, 11], ["u18", 21, 13], ["u19", 25, 8], ["u20", 23, 16]] => units

def in_window(i, start, k):
    if i < start:
        return 0
    if i > start + k - 1:
        return 0
    return 1

# Difference in differences for one choice of holdout, in tenths.
def measured(start, k, true_effect):
    0 => t_lift
    0 => t_n
    0 => c_lift
    0 => c_n
    0 => i
    for u in units:
        if in_window(i, start, k) == 1:
            c_lift + u[2] => c_lift
            c_n + 1 => c_n
        else:
            t_lift + u[2] => t_lift
            t_n + 1 => t_n
        i + 1 => i
    return true_effect * 10 + int(t_lift * 10 / t_n) - int(c_lift * 10 / c_n)

def show(x):
    if x < 0:
        return "-" + str(int((0 - x) / 10)) + "." + str((0 - x) % 10)
    return str(int(x / 10)) + "." + str(x % 10)

"units : " + str(len(units)) ^0
"" ^0

for eff in [6, 1]:
    "TRUE EFFECT " + show(eff * 10) ^0
    "  holdout size   lowest   highest   spread" ^0
    for k in [1, 2, 4, 8, 12, 16]:
        999 => lo
        -999 => hi
        for s in [0:len(units) - k]:
            measured(s, k, eff) => m
            if m < lo:
                m => lo
            if m > hi:
                m => hi
        "    " + str(k) + "            " + show(lo) + "     " + show(hi) + "      " + show(hi - lo) ^0
    "  can it rule out 'the change did nothing'" ^0
    for k in [1, 2, 4, 8, 12, 16]:
        999 => lo
        for s in [0:len(units) - k]:
            measured(s, k, eff) => m
            if m < lo:
                m => lo
        if lo > 0:
            "    size " + str(k) + " : yes" ^0
        else:
            "    size " + str(k) + " : NO  - some choice reports " + show(lo) ^0
    0 => smallest
    for k in [1:len(units) - 1]:
        999 => lo
        for s in [0:len(units) - k]:
            measured(s, k, eff) => m
            if m < lo:
                m => lo
        if lo > 0:
            if smallest == 0:
                k => smallest
    if smallest == 0:
        "  no holdout size up to " + str(len(units) - 1) + " always answers" ^0
    else:
        "  smallest holdout that always answers : " + str(smallest) + "  (" + str(int(smallest * 100 / len(units))) + "%)" ^0
    "" ^0

# ---- the control: units that all share one lift ----
#
# The holdout is not fragile by nature. It is fragile in proportion to how much
# the units differ in what would have happened to them anyway.

[["v1", 20, 12], ["v2", 24, 12], ["v3", 18, 12], ["v4", 30, 12], ["v5", 22, 12], ["v6", 26, 12], ["v7", 19, 12], ["v8", 28, 12]] => same

def measured_same(start, k, true_effect):
    0 => t_lift
    0 => t_n
    0 => c_lift
    0 => c_n
    0 => i
    for u in same:
        if in_window(i, start, k) == 1:
            c_lift + u[2] => c_lift
            c_n + 1 => c_n
        else:
            t_lift + u[2] => t_lift
            t_n + 1 => t_n
        i + 1 => i
    return true_effect * 10 + int(t_lift * 10 / t_n) - int(c_lift * 10 / c_n)

999 => lo2
-999 => hi2
for s in [0:len(same) - 1]:
    measured_same(s, 1, 6) => m
    if m < lo2:
        m => lo2
    if m > hi2:
        m => hi2
"control - every unit has the same seasonal lift" ^0
"  holdout of 1, across every choice : " + show(lo2) + " to " + show(hi2) + ", spread " + show(hi2 - lo2) ^0
if hi2 == lo2:
    "  one unit is enough, because there is nothing for the choice to vary" ^0
"" ^0

"A holdout of one still returns a number, on time, in the same units. What" ^0
"shrinks is the set of conclusions it can support, and that is not printed" ^0
"next to it. Which regime you are in is not visible from the number either:" ^0
"at an effect of 6 every size answers, at an effect of 1 the small ones cannot," ^0
"and the two tables were produced by the same code over the same units." ^0
```

## Python (deterministic transpilation)

```python
units = [["u1", 20, 8], ["u2", 24, 16], ["u3", 18, 9], ["u4", 30, 15], ["u5", 22, 11], ["u6", 26, 13], ["u7", 19, 8], ["u8", 28, 16], ["u9", 21, 10], ["u10", 25, 14], ["u11", 23, 9], ["u12", 27, 15], ["u13", 20, 12], ["u14", 29, 12], ["u15", 22, 10], ["u16", 24, 14], ["u17", 26, 11], ["u18", 21, 13], ["u19", 25, 8], ["u20", 23, 16]]

def in_window(i, start, k):
    if i < start:
        return 0
    if i > start + k - 1:
        return 0
    return 1

def measured(start, k, true_effect):
    t_lift = 0
    t_n = 0
    c_lift = 0
    c_n = 0
    i = 0
    for u in units:
        if in_window(i, start, k) == 1:
            c_lift = c_lift + u[2]
            c_n = c_n + 1
        else:
            t_lift = t_lift + u[2]
            t_n = t_n + 1
        i = i + 1
    return true_effect * 10 + int(t_lift * 10 / t_n) - int(c_lift * 10 / c_n)

def show(x):
    if x < 0:
        return "-" + str(int((0 - x) / 10)) + "." + str((0 - x) % 10)
    return str(int(x / 10)) + "." + str(x % 10)

print("units : " + str(len(units)))
print("")
for eff in [6, 1]:
    print("TRUE EFFECT " + show(eff * 10))
    print("  holdout size   lowest   highest   spread")
    for k in [1, 2, 4, 8, 12, 16]:
        lo = 999
        hi = -999
        for s in range(0, len(units) - k+1):
            m = measured(s, k, eff)
            if m < lo:
                lo = m
            if m > hi:
                hi = m
        print("    " + str(k) + "            " + show(lo) + "     " + show(hi) + "      " + show(hi - lo))
    print("  can it rule out 'the change did nothing'")
    for k in [1, 2, 4, 8, 12, 16]:
        lo = 999
        for s in range(0, len(units) - k+1):
            m = measured(s, k, eff)
            if m < lo:
                lo = m
        if lo > 0:
            print("    size " + str(k) + " : yes")
        else:
            print("    size " + str(k) + " : NO  - some choice reports " + show(lo))
    smallest = 0
    for k in range(1, len(units)):
        lo = 999
        for s in range(0, len(units) - k+1):
            m = measured(s, k, eff)
            if m < lo:
                lo = m
        if lo > 0:
            if smallest == 0:
                smallest = k
    if smallest == 0:
        print("  no holdout size up to " + str(len(units) - 1) + " always answers")
    else:
        print("  smallest holdout that always answers : " + str(smallest) + "  (" + str(int(smallest * 100 / len(units))) + "%)")
    print("")
same = [["v1", 20, 12], ["v2", 24, 12], ["v3", 18, 12], ["v4", 30, 12], ["v5", 22, 12], ["v6", 26, 12], ["v7", 19, 12], ["v8", 28, 12]]

def measured_same(start, k, true_effect):
    t_lift = 0
    t_n = 0
    c_lift = 0
    c_n = 0
    i = 0
    for u in same:
        if in_window(i, start, k) == 1:
            c_lift = c_lift + u[2]
            c_n = c_n + 1
        else:
            t_lift = t_lift + u[2]
            t_n = t_n + 1
        i = i + 1
    return true_effect * 10 + int(t_lift * 10 / t_n) - int(c_lift * 10 / c_n)

lo2 = 999
hi2 = -999
for s in range(0, len(same)):
    m = measured_same(s, 1, 6)
    if m < lo2:
        lo2 = m
    if m > hi2:
        hi2 = m
print("control - every unit has the same seasonal lift")
print("  holdout of 1, across every choice : " + show(lo2) + " to " + show(hi2) + ", spread " + show(hi2 - lo2))
if hi2 == lo2:
    print("  one unit is enough, because there is nothing for the choice to vary")
print("")
print("A holdout of one still returns a number, on time, in the same units. What")
print("shrinks is the set of conclusions it can support, and that is not printed")
print("next to it. Which regime you are in is not visible from the number either:")
print("at an effect of 6 every size answers, at an effect of 1 the small ones cannot,")
print("and the two tables were produced by the same code over the same units.")
```

## stdout (executed)

```text
units : 20

TRUE EFFECT 6.0
  holdout size   lowest   highest   spread
    1            1.7     10.2      8.5
    2            4.3     7.6      3.3
    4            5.1     6.6      1.5
    8            5.6     6.2      0.6
    12            5.2     6.0      0.8
    16            5.1     6.3      1.2
  can it rule out 'the change did nothing'
    size 1 : yes
    size 2 : yes
    size 4 : yes
    size 8 : yes
    size 12 : yes
    size 16 : yes
  smallest holdout that always answers : 1  (5%)

TRUE EFFECT 1.0
  holdout size   lowest   highest   spread
    1            -3.3     5.2      8.5
    2            -0.7     2.6      3.3
    4            0.1     1.6      1.5
    8            0.6     1.2      0.6
    12            0.2     1.0      0.8
    16            0.1     1.3      1.2
  can it rule out 'the change did nothing'
    size 1 : NO  - some choice reports -3.3
    size 2 : NO  - some choice reports -0.7
    size 4 : yes
    size 8 : yes
    size 12 : yes
    size 16 : yes
  smallest holdout that always answers : 4  (20%)

control - every unit has the same seasonal lift
  holdout of 1, across every choice : 6.0 to 6.0, spread 0.0
  one unit is enough, because there is nothing for the choice to vary

A holdout of one still returns a number, on time, in the same units. What
shrinks is the set of conclusions it can support, and that is not printed
next to it. Which regime you are in is not visible from the number either:
at an effect of 6 every size answers, at an effect of 1 the small ones cannot,
and the two tables were produced by the same code over the same units.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
