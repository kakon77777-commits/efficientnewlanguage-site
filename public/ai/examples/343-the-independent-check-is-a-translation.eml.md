<!-- canonical: efficientnewlanguage.org/ai/examples/343-the-independent-check-is-a-translation | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 343 — The independent check is a translation — measured by where it agrees

`the_independent_check_is_a_translation.eml` compares three implementations and finds the measurement that separates a second opinion from a transcription.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two
# implementations that agree on everything, and a reason that is not
# correctness.
#
# The second implementation was commissioned as a cross-check. It was written
# by reading the first one. Everybody involved knows this and nobody thinks it
# is a problem, because it was re-derived rather than copied - a different
# person, a different file, the same understanding.
#
# There is a measurement that separates a genuine second opinion from a
# translation, and it is not the agreement rate on ordinary inputs. It is the
# agreement rate on inputs the SPECIFICATION DOES NOT DETERMINE. Two
# independent implementations must each invent an answer there, and inventions
# rarely match. Two implementations with one lineage inherit the same
# invention.
#
# A third implementation, written from the specification text, is here as the
# actual second opinion. Nothing is declared - every dataset is classified by
# the specification and every pair is compared.

def late_count_spec(orders):
    0 => n
    for o in orders:
        if o[1] > o[0]:
            n + 1 => n
    return n

def late_count_loose(orders):
    0 => n
    for o in orders:
        if o[1] >= o[0]:
            n + 1 => n
    return n

def pct_half_up(late, total):
    if total == 0:
        return 0
    return int((late * 200 + total) / (total * 2))

def pct_truncate(late, total):
    if total == 0:
        return 0 - 1
    return int(late * 100 / total)

# the shipped implementation
def impl_a(orders):
    return pct_half_up(late_count_loose(orders), len(orders))

# the cross-check, written by reading impl_a
def impl_b(orders):
    len(orders) => total
    late_count_loose(orders) => late
    if total == 0:
        return 0
    return pct_half_up(late, total)

# written from the specification text alone
def impl_c(orders):
    return pct_truncate(late_count_spec(orders), len(orders))

def has_tie(orders):
    len(orders) => total
    if total == 0:
        return 0
    late_count_spec(orders) * 100 => num
    if (num % total) * 2 == total:
        return 1
    return 0

def is_determined(orders):
    if len(orders) == 0:
        return 0
    if has_tie(orders) == 1:
        return 0
    return 1

[["quiet week", [[3, 3], [4, 2], [5, 5], [6, 1]]], ["one clear miss", [[3, 9], [4, 2], [5, 1], [6, 1]]], ["eight orders, one late", [[2, 9], [3, 1], [4, 1], [5, 1], [6, 2], [7, 3], [8, 4], [9, 5]]], ["all on the line", [[5, 5], [5, 5], [5, 5]]], ["nothing shipped at all", []], ["mixed", [[1, 2], [2, 2], [3, 1], [4, 9], [5, 5], [6, 7]]]] => datasets

# ---- the three implementations, side by side ----

"dataset                  A    B    C   determined" ^0
for d in datasets:
    d[1] => orders
    impl_a(orders) => a
    impl_b(orders) => b
    impl_c(orders) => c
    "  " + d[0] + " : " + str(a) + "  " + str(b) + "  " + str(c) + "   " + str(is_determined(orders)) ^0
"" ^0

# ---- agreement rates ----

0 => ab
0 => ac
0 => bc
for d in datasets:
    d[1] => orders
    if impl_a(orders) == impl_b(orders):
        ab + 1 => ab
    if impl_a(orders) == impl_c(orders):
        ac + 1 => ac
    if impl_b(orders) == impl_c(orders):
        bc + 1 => bc
"agreement over all " + str(len(datasets)) + " datasets" ^0
"  A and B : " + str(ab) ^0
"  A and C : " + str(ac) ^0
"  B and C : " + str(bc) ^0
if ab == len(datasets):
    "  A and B never disagree, which is what a cross-check is supposed to show" ^0
"" ^0

# ---- split by whether the specification decides the answer ----

0 => det_total
0 => det_ab
0 => det_ac
0 => und_total
0 => und_ab
0 => und_ac
for d in datasets:
    d[1] => orders
    if is_determined(orders) == 1:
        det_total + 1 => det_total
        if impl_a(orders) == impl_b(orders):
            det_ab + 1 => det_ab
        if impl_a(orders) == impl_c(orders):
            det_ac + 1 => det_ac
    else:
        und_total + 1 => und_total
        if impl_a(orders) == impl_b(orders):
            und_ab + 1 => und_ab
        if impl_a(orders) == impl_c(orders):
            und_ac + 1 => und_ac

"datasets the specification DOES determine : " + str(det_total) ^0
"  A and B agree : " + str(det_ab) + " of " + str(det_total) ^0
"  A and C agree : " + str(det_ac) + " of " + str(det_total) ^0
"" ^0
"datasets the specification does NOT determine : " + str(und_total) ^0
"  A and B agree : " + str(und_ab) + " of " + str(und_total) ^0
"  A and C agree : " + str(und_ac) + " of " + str(und_total) ^0
"" ^0

if und_total > 0:
    if und_ab == und_total:
        "On every input where the specification says nothing, the two" ^0
        "cross-checking implementations invented the same answer." ^0
        "" ^0

# ---- what the disagreement with C is actually about ----

"datasets where A and C differ, and why" ^0
0 => shown
for d in datasets:
    d[1] => orders
    if impl_a(orders) != impl_c(orders):
        shown + 1 => shown
        late_count_spec(orders) => ls
        late_count_loose(orders) => ll
        if ls != ll:
            "  " + d[0] + " : late count " + str(ls) + " by the spec, " + str(ll) + " by A" ^0
        else:
            "  " + d[0] + " : same late count, different reporting rule" ^0
"  total: " + str(shown) ^0
"" ^0

"A cross-check earns its name by being able to disagree. The number that" ^0
"shows whether it can is not how often it agrees - it is whether it agrees" ^0
"in the places where there was nothing to agree with." ^0
```

## Python (deterministic transpilation)

```python
def late_count_spec(orders):
    n = 0
    for o in orders:
        if o[1] > o[0]:
            n = n + 1
    return n

def late_count_loose(orders):
    n = 0
    for o in orders:
        if o[1] >= o[0]:
            n = n + 1
    return n

def pct_half_up(late, total):
    if total == 0:
        return 0
    return int((late * 200 + total) / (total * 2))

def pct_truncate(late, total):
    if total == 0:
        return 0 - 1
    return int(late * 100 / total)

def impl_a(orders):
    return pct_half_up(late_count_loose(orders), len(orders))

def impl_b(orders):
    total = len(orders)
    late = late_count_loose(orders)
    if total == 0:
        return 0
    return pct_half_up(late, total)

def impl_c(orders):
    return pct_truncate(late_count_spec(orders), len(orders))

def has_tie(orders):
    total = len(orders)
    if total == 0:
        return 0
    num = late_count_spec(orders) * 100
    if num % total * 2 == total:
        return 1
    return 0

def is_determined(orders):
    if len(orders) == 0:
        return 0
    if has_tie(orders) == 1:
        return 0
    return 1

datasets = [["quiet week", [[3, 3], [4, 2], [5, 5], [6, 1]]], ["one clear miss", [[3, 9], [4, 2], [5, 1], [6, 1]]], ["eight orders, one late", [[2, 9], [3, 1], [4, 1], [5, 1], [6, 2], [7, 3], [8, 4], [9, 5]]], ["all on the line", [[5, 5], [5, 5], [5, 5]]], ["nothing shipped at all", []], ["mixed", [[1, 2], [2, 2], [3, 1], [4, 9], [5, 5], [6, 7]]]]
print("dataset                  A    B    C   determined")
for d in datasets:
    orders = d[1]
    a = impl_a(orders)
    b = impl_b(orders)
    c = impl_c(orders)
    print("  " + d[0] + " : " + str(a) + "  " + str(b) + "  " + str(c) + "   " + str(is_determined(orders)))
print("")
ab = 0
ac = 0
bc = 0
for d in datasets:
    orders = d[1]
    if impl_a(orders) == impl_b(orders):
        ab = ab + 1
    if impl_a(orders) == impl_c(orders):
        ac = ac + 1
    if impl_b(orders) == impl_c(orders):
        bc = bc + 1
print("agreement over all " + str(len(datasets)) + " datasets")
print("  A and B : " + str(ab))
print("  A and C : " + str(ac))
print("  B and C : " + str(bc))
if ab == len(datasets):
    print("  A and B never disagree, which is what a cross-check is supposed to show")
print("")
det_total = 0
det_ab = 0
det_ac = 0
und_total = 0
und_ab = 0
und_ac = 0
for d in datasets:
    orders = d[1]
    if is_determined(orders) == 1:
        det_total = det_total + 1
        if impl_a(orders) == impl_b(orders):
            det_ab = det_ab + 1
        if impl_a(orders) == impl_c(orders):
            det_ac = det_ac + 1
    else:
        und_total = und_total + 1
        if impl_a(orders) == impl_b(orders):
            und_ab = und_ab + 1
        if impl_a(orders) == impl_c(orders):
            und_ac = und_ac + 1
print("datasets the specification DOES determine : " + str(det_total))
print("  A and B agree : " + str(det_ab) + " of " + str(det_total))
print("  A and C agree : " + str(det_ac) + " of " + str(det_total))
print("")
print("datasets the specification does NOT determine : " + str(und_total))
print("  A and B agree : " + str(und_ab) + " of " + str(und_total))
print("  A and C agree : " + str(und_ac) + " of " + str(und_total))
print("")
if und_total > 0:
    if und_ab == und_total:
        print("On every input where the specification says nothing, the two")
        print("cross-checking implementations invented the same answer.")
        print("")
print("datasets where A and C differ, and why")
shown = 0
for d in datasets:
    orders = d[1]
    if impl_a(orders) != impl_c(orders):
        shown = shown + 1
        ls = late_count_spec(orders)
        ll = late_count_loose(orders)
        if ls != ll:
            print("  " + d[0] + " : late count " + str(ls) + " by the spec, " + str(ll) + " by A")
        else:
            print("  " + d[0] + " : same late count, different reporting rule")
print("  total: " + str(shown))
print("")
print("A cross-check earns its name by being able to disagree. The number that")
print("shows whether it can is not how often it agrees - it is whether it agrees")
print("in the places where there was nothing to agree with.")
```

## stdout (executed)

```text
dataset                  A    B    C   determined
  quiet week : 50  50  0   1
  one clear miss : 25  25  25   1
  eight orders, one late : 13  13  12   0
  all on the line : 100  100  0   1
  nothing shipped at all : 0  0  -1   0
  mixed : 83  83  50   1

agreement over all 6 datasets
  A and B : 6
  A and C : 1
  B and C : 1
  A and B never disagree, which is what a cross-check is supposed to show

datasets the specification DOES determine : 4
  A and B agree : 4 of 4
  A and C agree : 1 of 4

datasets the specification does NOT determine : 2
  A and B agree : 2 of 2
  A and C agree : 0 of 2

On every input where the specification says nothing, the two
cross-checking implementations invented the same answer.

datasets where A and C differ, and why
  quiet week : late count 0 by the spec, 2 by A
  eight orders, one late : same late count, different reporting rule
  all on the line : late count 0 by the spec, 3 by A
  nothing shipped at all : same late count, different reporting rule
  mixed : late count 3 by the spec, 5 by A
  total: 5

A cross-check earns its name by being able to disagree. The number that
shows whether it can is not how often it agrees - it is whether it agrees
in the places where there was nothing to agree with.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
