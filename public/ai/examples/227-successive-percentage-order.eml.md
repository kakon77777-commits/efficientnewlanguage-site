<!-- canonical: efficientnewlanguage.org/ai/examples/227-successive-percentage-order | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 227 — Three tiers of commuting, and only one is safe

`successive_percentage_order.eml` applies promotion stacks in every order over several prices and counts the distinct outcomes.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Percentages
# applied one after another, and the undo that does not undo.
#
# The premise this file started from was that percentages commute:
#
#     a 20% discount then a 10% discount   ==   a 10% then a 20%
#
# In exact arithmetic that is true - multiplication commutes. In money it is
# not, and the sweep below found it: on a 12.34 item, -10/-20/-25 gives 6.67
# and -10/-25/-20 gives 6.66. Rounding happens at every step, and rounding
# does not commute with anything. The clean algebraic fact survives only until
# the first int().
#
# What is true without qualification is that a percentage down and the same
# percentage up do not cancel: they are taken against different bases, so
# 100 -> 80 -> 96. The 20% increase is 20% of 80, not of 100.
#
# The error is 4% of the original at 20% and grows as
# the square of the rate - at 50% down and 50% up you land at 75, having lost a
# quarter. Nothing raises. The number is a plausible price.
#
# The third fact is the one that costs money in practice: percentage-off and
# a flat amount off DO NOT commute.
#
#     100, then -10 flat, then -20%   ->  72.00
#     100, then -20%, then -10 flat   ->  70.00
#
# Two pounds, decided entirely by the order the promotions were stored in.
# There is no correct answer to be computed here - it is a policy question -
# and the failure is that the code answers it accidentally.
#
# So there are three tiers, and only the middle one was where this file
# expected it to be:
#
#     flat amounts        commute exactly
#     percentages         commute in algebra, not after rounding (2 of 6 prices)
#     mixed               do not commute at all (6 distinct answers)
#
# Everything below is computed in integer cents, for the reason the
# float-key-instability case in this corpus measures: a price that has been
# through a percentage is not a number you can compare with ==.

def apply_pct_off(cents, pct):
    # Round half up at the boundary. Which way to round is also a policy
    # question; the point is that it must be decided ONCE and written down.
    return cents - int(cents * pct / 100 + 0.5)

def apply_flat_off(cents, off):
    if off > cents:
        return 0
    return cents - off

def apply_pct_up(cents, pct):
    return cents + int(cents * pct / 100 + 0.5)

def money(c):
    if c < 0:
        return "-" + money(0 - c)
    str(int(c / 100)) => w
    str(c % 100) => f
    if len(f) < 2:
        "0" + f => f
    return w + "." + f


10000 => price

"Two discounts, in both orders:"^0
apply_pct_off(apply_pct_off(price, 20), 10) => d_20_10
apply_pct_off(apply_pct_off(price, 10), 20) => d_10_20
("  -20% then -10%:  " + money(d_20_10))^0
("  -10% then -20%:  " + money(d_10_20))^0
("  same:            " + str(d_20_10 == d_10_20))^0

""^0
"Down then up by the same percentage:"^0
for p in [10, 20, 50, 90]:
    apply_pct_up(apply_pct_off(price, p), p) => back
    ("  -" + str(p) + "% then +" + str(p) + "%:  " + money(back) + "   lost " + money(price - back))^0

""^0
"A percentage and a flat amount, in both orders:"^0
apply_pct_off(apply_flat_off(price, 1000), 20) => f_then_p
apply_flat_off(apply_pct_off(price, 20), 1000) => p_then_f
("  -10.00 then -20%:  " + money(f_then_p))^0
("  -20% then -10.00:  " + money(p_then_f))^0
("  difference:        " + money(f_then_p - p_then_f))^0

# ---------------------------------------------------- exhaustive order sweep
# Every ordering of a promotion list, over several prices. The question the
# original version asked was "do all-percentage stacks land on one answer",
# with "they must" written next to it. They do not, on 2 of these 6 prices.
def permutations(xs):
    if len(xs) <= 1:
        return [xs]
    [] => out
    for i in [0:len(xs) - 1]:
        xs[i] => head
        xs[:i] + xs[i + 1:] => rest
        for p in permutations(rest):
            out + [[head] + p] => out
    return out

def apply_all(cents, promos):
    cents => c
    for p in promos:
        if p[0] == "pct":
            apply_pct_off(c, p[1]) => c
        else:
            apply_flat_off(c, p[1]) => c
    return c

[["pct", 10], ["pct", 20], ["pct", 25]] => all_pct
[["pct", 10], ["flat", 500], ["pct", 25]] => mixed
[["flat", 200], ["flat", 500], ["flat", 1000]] => all_flat

def distinct_outcomes(promos, prices):
    {} => seen
    for pr in prices:
        for order in permutations(promos):
            apply_all(pr, order) => v
            if pr in seen:
                seen[pr] + [v] => seen[pr]
            else:
                [v] => seen[pr]
    0 => worst
    for pr in seen:
        {} => vals
        for v in seen[pr]:
            1 => vals[v]
        if len(vals) > worst:
            len(vals) => worst
    return worst

[999, 1000, 1234, 10000, 4999, 33] => prices

""^0
("distinct outcomes across all 6 orderings, worst price:")^0
("  three percentages:      " + str(distinct_outcomes(all_pct, prices)))^0
("  three flat amounts:     " + str(distinct_outcomes(all_flat, prices)))^0
("  percentages and a flat: " + str(distinct_outcomes(mixed, prices)))^0

# ------------------------------------------ the spread on a mixed stack
{} => spread
0 => worst_spread
0 => worst_price
for pr in prices:
    [] => outs
    for order in permutations(mixed):
        outs + [apply_all(pr, order)] => outs
    max(outs) - min(outs) => sp
    if sp > worst_spread:
        sp => worst_spread
        pr => worst_price

""^0
("largest spread on a mixed stack: " + money(worst_spread) + " on a " + money(worst_price) + " item")^0

# --------------------------------------------- rounding is a policy too
# Rounding half up and truncating differ, and the difference accumulates over
# a stack rather than cancelling.
def apply_pct_off_trunc(cents, pct):
    return cents - int(cents * pct / 100)

0 => rounding_differs
0 => rounding_total
for pr in prices:
    pr => a
    pr => b
    for p in [10, 20, 25]:
        apply_pct_off(a, p) => a
        apply_pct_off_trunc(b, p) => b
    if not (a == b):
        rounding_differs + 1 => rounding_differs
        rounding_total + (b - a) => rounding_total

""^0
("prices where rounding policy changes the answer: " + str(rounding_differs) + "/" + str(len(prices)))^0
("total difference across them:                    " + money(rounding_total))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Flat amounts commute exactly. This is the only tier that is unconditionally
# safe, and it is safe because no rounding happens.
checked + 1 => checked
if distinct_outcomes(all_flat, prices) == 1:
    passed + 1 => passed

# Percentages commute on the demo price and NOT on every price. This file
# originally asserted the first half and would have shipped the claim; the
# sweep found the second. Both halves are now checked.
checked + 1 => checked
if d_20_10 == d_10_20 and distinct_outcomes(all_pct, prices) > 1:
    passed + 1 => passed

# Mixing them does not.
checked + 1 => checked
if distinct_outcomes(mixed, prices) > 1:
    passed + 1 => passed

# Down-then-up must not return to the original, and the loss must grow with
# the rate - it is not a rounding artefact.
checked + 1 => checked
apply_pct_up(apply_pct_off(price, 10), 10) => back10
apply_pct_up(apply_pct_off(price, 50), 50) => back50
if back10 < price and back50 < back10:
    passed + 1 => passed

# The rounding policy must be shown to matter, since it is chosen silently.
checked + 1 => checked
if rounding_differs > 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Flats commute exactly, percentages only until rounding, mixtures not at all." => verdict
else:
    "FAILED - a promotion stack did not behave as the checks describe." => verdict
verdict^0

""^0
"There is no right answer to the mixed stack - it is a pricing policy, not" => n1
n1^0
"arithmetic. The defect is that a list and a loop answer it silently, so the" => n2
n2^0
"policy ends up being whatever order the rows came back from the database." => n3
n3^0
"And the tier above it is the one this file got wrong: percentages commute" => n4
n4^0
"in algebra and stop commuting the moment money forces a rounding step, on" => n5
n5^0
"2 of the 6 prices swept. An algebraic identity is not an implementation." => n6
n6^0
```

## Python (deterministic transpilation)

```python
def apply_pct_off(cents, pct):
    return cents - int(cents * pct / 100 + 0.5)

def apply_flat_off(cents, off):
    if off > cents:
        return 0
    return cents - off

def apply_pct_up(cents, pct):
    return cents + int(cents * pct / 100 + 0.5)

def money(c):
    if c < 0:
        return "-" + money(0 - c)
    w = str(int(c / 100))
    f = str(c % 100)
    if len(f) < 2:
        f = "0" + f
    return w + "." + f

price = 10000
print("Two discounts, in both orders:")
d_20_10 = apply_pct_off(apply_pct_off(price, 20), 10)
d_10_20 = apply_pct_off(apply_pct_off(price, 10), 20)
print("  -20% then -10%:  " + money(d_20_10))
print("  -10% then -20%:  " + money(d_10_20))
print("  same:            " + str(d_20_10 == d_10_20))
print("")
print("Down then up by the same percentage:")
for p in [10, 20, 50, 90]:
    back = apply_pct_up(apply_pct_off(price, p), p)
    print("  -" + str(p) + "% then +" + str(p) + "%:  " + money(back) + "   lost " + money(price - back))
print("")
print("A percentage and a flat amount, in both orders:")
f_then_p = apply_pct_off(apply_flat_off(price, 1000), 20)
p_then_f = apply_flat_off(apply_pct_off(price, 20), 1000)
print("  -10.00 then -20%:  " + money(f_then_p))
print("  -20% then -10.00:  " + money(p_then_f))
print("  difference:        " + money(f_then_p - p_then_f))

def permutations(xs):
    if len(xs) <= 1:
        return [xs]
    out = []
    for i in range(0, len(xs)):
        head = xs[i]
        rest = xs[:i] + xs[i + 1:]
        for p in permutations(rest):
            out = out + [[head] + p]
    return out

def apply_all(cents, promos):
    c = cents
    for p in promos:
        if p[0] == "pct":
            c = apply_pct_off(c, p[1])
        else:
            c = apply_flat_off(c, p[1])
    return c

all_pct = [["pct", 10], ["pct", 20], ["pct", 25]]
mixed = [["pct", 10], ["flat", 500], ["pct", 25]]
all_flat = [["flat", 200], ["flat", 500], ["flat", 1000]]

def distinct_outcomes(promos, prices):
    seen = {}
    for pr in prices:
        for order in permutations(promos):
            v = apply_all(pr, order)
            if pr in seen:
                seen[pr] = seen[pr] + [v]
            else:
                seen[pr] = [v]
    worst = 0
    for pr in seen:
        vals = {}
        for v in seen[pr]:
            vals[v] = 1
        if len(vals) > worst:
            worst = len(vals)
    return worst

prices = [999, 1000, 1234, 10000, 4999, 33]
print("")
print("distinct outcomes across all 6 orderings, worst price:")
print("  three percentages:      " + str(distinct_outcomes(all_pct, prices)))
print("  three flat amounts:     " + str(distinct_outcomes(all_flat, prices)))
print("  percentages and a flat: " + str(distinct_outcomes(mixed, prices)))
spread = {}
worst_spread = 0
worst_price = 0
for pr in prices:
    outs = []
    for order in permutations(mixed):
        outs = outs + [apply_all(pr, order)]
    sp = max(outs) - min(outs)
    if sp > worst_spread:
        worst_spread = sp
        worst_price = pr
print("")
print("largest spread on a mixed stack: " + money(worst_spread) + " on a " + money(worst_price) + " item")

def apply_pct_off_trunc(cents, pct):
    return cents - int(cents * pct / 100)

rounding_differs = 0
rounding_total = 0
for pr in prices:
    a = pr
    b = pr
    for p in [10, 20, 25]:
        a = apply_pct_off(a, p)
        b = apply_pct_off_trunc(b, p)
    if not a == b:
        rounding_differs = rounding_differs + 1
        rounding_total = rounding_total + (b - a)
print("")
print("prices where rounding policy changes the answer: " + str(rounding_differs) + "/" + str(len(prices)))
print("total difference across them:                    " + money(rounding_total))
passed = 0
checked = 0
checked = checked + 1
if distinct_outcomes(all_flat, prices) == 1:
    passed = passed + 1
checked = checked + 1
if d_20_10 == d_10_20 and distinct_outcomes(all_pct, prices) > 1:
    passed = passed + 1
checked = checked + 1
if distinct_outcomes(mixed, prices) > 1:
    passed = passed + 1
checked = checked + 1
back10 = apply_pct_up(apply_pct_off(price, 10), 10)
back50 = apply_pct_up(apply_pct_off(price, 50), 50)
if back10 < price and back50 < back10:
    passed = passed + 1
checked = checked + 1
if rounding_differs > 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Flats commute exactly, percentages only until rounding, mixtures not at all."
else:
    verdict = "FAILED - a promotion stack did not behave as the checks describe."
print(verdict)
print("")
n1 = "There is no right answer to the mixed stack - it is a pricing policy, not"
print(n1)
n2 = "arithmetic. The defect is that a list and a loop answer it silently, so the"
print(n2)
n3 = "policy ends up being whatever order the rows came back from the database."
print(n3)
n4 = "And the tier above it is the one this file got wrong: percentages commute"
print(n4)
n5 = "in algebra and stop commuting the moment money forces a rounding step, on"
print(n5)
n6 = "2 of the 6 prices swept. An algebraic identity is not an implementation."
print(n6)
```

## stdout (executed)

```text
Two discounts, in both orders:
  -20% then -10%:  72.00
  -10% then -20%:  72.00
  same:            True

Down then up by the same percentage:
  -10% then +10%:  99.00   lost 1.00
  -20% then +20%:  96.00   lost 4.00
  -50% then +50%:  75.00   lost 25.00
  -90% then +90%:  19.00   lost 81.00

A percentage and a flat amount, in both orders:
  -10.00 then -20%:  72.00
  -20% then -10.00:  70.00
  difference:        2.00

distinct outcomes across all 6 orderings, worst price:
  three percentages:      2
  three flat amounts:     1
  percentages and a flat: 6

largest spread on a mixed stack: 1.64 on a 12.34 item

prices where rounding policy changes the answer: 2/6
total difference across them:                    0.02

checks passed: 5/5
Flats commute exactly, percentages only until rounding, mixtures not at all.

There is no right answer to the mixed stack - it is a pricing policy, not
arithmetic. The defect is that a list and a loop answer it silently, so the
policy ends up being whatever order the rows came back from the database.
And the tier above it is the one this file got wrong: percentages commute
in algebra and stop commuting the moment money forces a rounding step, on
2 of the 6 prices swept. An algebraic identity is not an implementation.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
