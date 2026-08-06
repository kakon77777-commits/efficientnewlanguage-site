<!-- canonical: efficientnewlanguage.org/ai/examples/266-percent-composition | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 266 — Percent composition — a positive average quarter and a losing year

`percent_composition.eml` composes sequences of percentage changes and compares the arithmetic mean of the periods against the actual total.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three positive
# quarters and a negative year.
#
# A percentage is a RATIO, and ratios compose by multiplication. Almost every
# mistake with percentages is the same mistake: adding them.
#
#     -50% then +50%          is not zero, it is -25%
#     -50% off then -25% off  is not -75% off, it is -62.5% off
#     the average of the periods is not the return over the periods
#
# The last one is the expensive one, because it is a summary statistic that
# people compute on purpose. A fund whose quarterly returns average +8% can
# have lost a quarter of its value over the year, and both numbers are correct.
#
# Every percentage in this file is a half or a quarter, chosen so that all the
# arithmetic is EXACT in binary floating point. That is deliberate: this case
# is about the composition rule, and float representation error is a separate
# problem measured separately in examples/money-float-accumulation/. Mixing
# them would let either one explain the other's result.

def apply_pct(v, pct):
    # pct is a percentage change: 50 means +50%, -50 means down by half.
    return v * (100 + pct) / 100

def compose(v, changes):
    v => cur
    for p in changes:
        apply_pct(cur, p) => cur
    return cur

def total_pct(changes):
    compose(100.0, changes) => end
    return end - 100

def mean_pct(changes):
    0 => s
    for p in changes:
        s + p => s
    return s / len(changes)

def recovery_needed(loss_pct):
    # After losing loss_pct, the gain that returns to the start.
    (100 - loss_pct) / 100 => remaining
    return 100 / remaining - 100


[
    ["down half, up half", [0 - 50, 50]],
    ["up half, down half", [50, 0 - 50]],
    ["double, halve", [100, 0 - 50]],
    ["three good quarters, one bad", [100, 0 - 50, 0 - 25]],
    ["four flat", [0, 0, 0, 0]],
    ["two discounts", [0 - 50, 0 - 25]]
] => series

"series                          mean of periods   actual total"^0
{} => res
for row in series:
    row[0] => nm
    row[1] => ch
    mean_pct(ch) => m
    total_pct(ch) => t
    [m, t] => res[nm]
    ("%-31s %-17s %s" % (nm, ("%.2f" % m) + "%", ("%.2f" % t) + "%"))^0

""^0
("series measured: " + str(len(series)))^0

# ------------------------------- where the mean and the total disagree
""^0
"series where the mean and the total have DIFFERENT signs:"^0
0 => sign_flips
for row in series:
    row[0] => nm
    res[nm] => r
    if (r[0] > 0 and r[1] < 0) or (r[0] < 0 and r[1] > 0):
        sign_flips + 1 => sign_flips
        ("  " + nm + ": mean " + ("%.2f" % r[0]) + "%, total " + ("%.2f" % r[1]) + "%")^0
("series where a positive average hides a loss (or the reverse): " + str(sign_flips))^0

# ------------------------------------- order does not matter, but sums do
""^0
"the same two changes in both orders:"^0
("  down half then up half: " + ("%.2f" % total_pct([0 - 50, 50])) + "%")^0
("  up half then down half: " + ("%.2f" % total_pct([50, 0 - 50])) + "%")^0
"...multiplication commutes, so the order is not the problem. Adding is."^0
("  what adding them would say: " + str(0 - 50 + 50) + "%")^0

# ------------------------------------------- discounts do not add either
""^0
"two discounts applied in sequence:"^0
("  50% off then 25% off leaves: " + ("%.1f" % compose(100.0, [0 - 50, 0 - 25])) + " of 100")^0
("  75% off would leave:         " + ("%.1f" % compose(100.0, [0 - 75])) + " of 100")^0

# --------------------------------------- recovering costs more than losing
""^0
"the gain needed to undo a loss:"^0
0 => asymmetric
0 => losses
for loss in [25, 50, 75]:
    losses + 1 => losses
    recovery_needed(loss) => need
    if need > loss:
        asymmetric + 1 => asymmetric
    ("  lose " + str(loss) + "% -> need +" + ("%.1f" % need) + "% to get back")^0
("losses where the recovery is LARGER than the loss: " + str(asymmetric) + "/" + str(losses))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Down a half and back up a half must land at -25%, exactly. This is the whole
# case in one number, and it is exact because 0.5 and 1.5 are exact.
checked + 1 => checked
if total_pct([0 - 50, 50]) == 0 - 25:
    passed + 1 => passed

# Order must not matter - if it did, the story would be about ordering rather
# than about composition.
checked + 1 => checked
if total_pct([0 - 50, 50]) == total_pct([50, 0 - 50]):
    passed + 1 => passed

# At least one series must have a positive average and a negative total. That
# is the summary statistic that lies without being wrong.
checked + 1 => checked
if sign_flips > 0:
    passed + 1 => passed

# The recovery must exceed the loss for every loss - the asymmetry is not an
# artefact of one badly chosen number.
checked + 1 => checked
if asymmetric == losses:
    passed + 1 => passed

# And a series of zeroes must compose to exactly zero, or the arithmetic
# itself is drifting and none of the above measures what it claims to.
checked + 1 => checked
if total_pct([0, 0, 0, 0]) == 0 and compose(100.0, [0, 0, 0, 0]) == 100.0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "A positive average quarter and a losing year are the same year." => verdict
else:
    "FAILED - a percentage did not compose as the checks describe." => verdict
verdict^0

""^0
"Percentages are ratios, and the only thing you can do with a sequence of" => n1
n1^0
"ratios is multiply them. Adding them produces a number that is easy to" => n2
n2^0
"compute, easy to report, and not the answer to any question anyone asked." => n3
n3^0
"The average of the periods is a real quantity - it just is not the return," => n4
n4^0
"and nothing in the units or the sign says which one is on the slide." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def apply_pct(v, pct):
    return v * (100 + pct) / 100

def compose(v, changes):
    cur = v
    for p in changes:
        cur = apply_pct(cur, p)
    return cur

def total_pct(changes):
    end = compose(100.0, changes)
    return end - 100

def mean_pct(changes):
    s = 0
    for p in changes:
        s = s + p
    return s / len(changes)

def recovery_needed(loss_pct):
    remaining = (100 - loss_pct) / 100
    return 100 / remaining - 100

series = [["down half, up half", [0 - 50, 50]], ["up half, down half", [50, 0 - 50]], ["double, halve", [100, 0 - 50]], ["three good quarters, one bad", [100, 0 - 50, 0 - 25]], ["four flat", [0, 0, 0, 0]], ["two discounts", [0 - 50, 0 - 25]]]
print("series                          mean of periods   actual total")
res = {}
for row in series:
    nm = row[0]
    ch = row[1]
    m = mean_pct(ch)
    t = total_pct(ch)
    res[nm] = [m, t]
    print("%-31s %-17s %s" % (nm, "%.2f" % m + "%", "%.2f" % t + "%"))
print("")
print("series measured: " + str(len(series)))
print("")
print("series where the mean and the total have DIFFERENT signs:")
sign_flips = 0
for row in series:
    nm = row[0]
    r = res[nm]
    if r[0] > 0 and r[1] < 0 or r[0] < 0 and r[1] > 0:
        sign_flips = sign_flips + 1
        print("  " + nm + ": mean " + "%.2f" % r[0] + "%, total " + "%.2f" % r[1] + "%")
print("series where a positive average hides a loss (or the reverse): " + str(sign_flips))
print("")
print("the same two changes in both orders:")
print("  down half then up half: " + "%.2f" % total_pct([0 - 50, 50]) + "%")
print("  up half then down half: " + "%.2f" % total_pct([50, 0 - 50]) + "%")
print("...multiplication commutes, so the order is not the problem. Adding is.")
print("  what adding them would say: " + str(0 - 50 + 50) + "%")
print("")
print("two discounts applied in sequence:")
print("  50% off then 25% off leaves: " + "%.1f" % compose(100.0, [0 - 50, 0 - 25]) + " of 100")
print("  75% off would leave:         " + "%.1f" % compose(100.0, [0 - 75]) + " of 100")
print("")
print("the gain needed to undo a loss:")
asymmetric = 0
losses = 0
for loss in [25, 50, 75]:
    losses = losses + 1
    need = recovery_needed(loss)
    if need > loss:
        asymmetric = asymmetric + 1
    print("  lose " + str(loss) + "% -> need +" + "%.1f" % need + "% to get back")
print("losses where the recovery is LARGER than the loss: " + str(asymmetric) + "/" + str(losses))
passed = 0
checked = 0
checked = checked + 1
if total_pct([0 - 50, 50]) == 0 - 25:
    passed = passed + 1
checked = checked + 1
if total_pct([0 - 50, 50]) == total_pct([50, 0 - 50]):
    passed = passed + 1
checked = checked + 1
if sign_flips > 0:
    passed = passed + 1
checked = checked + 1
if asymmetric == losses:
    passed = passed + 1
checked = checked + 1
if total_pct([0, 0, 0, 0]) == 0 and compose(100.0, [0, 0, 0, 0]) == 100.0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "A positive average quarter and a losing year are the same year."
else:
    verdict = "FAILED - a percentage did not compose as the checks describe."
print(verdict)
print("")
n1 = "Percentages are ratios, and the only thing you can do with a sequence of"
print(n1)
n2 = "ratios is multiply them. Adding them produces a number that is easy to"
print(n2)
n3 = "compute, easy to report, and not the answer to any question anyone asked."
print(n3)
n4 = "The average of the periods is a real quantity - it just is not the return,"
print(n4)
n5 = "and nothing in the units or the sign says which one is on the slide."
print(n5)
```

## stdout (executed)

```text
series                          mean of periods   actual total
down half, up half              0.00%             -25.00%
up half, down half              0.00%             -25.00%
double, halve                   25.00%            0.00%
three good quarters, one bad    8.33%             -25.00%
four flat                       0.00%             0.00%
two discounts                   -37.50%           -62.50%

series measured: 6

series where the mean and the total have DIFFERENT signs:
  three good quarters, one bad: mean 8.33%, total -25.00%
series where a positive average hides a loss (or the reverse): 1

the same two changes in both orders:
  down half then up half: -25.00%
  up half then down half: -25.00%
...multiplication commutes, so the order is not the problem. Adding is.
  what adding them would say: 0%

two discounts applied in sequence:
  50% off then 25% off leaves: 37.5 of 100
  75% off would leave:         25.0 of 100

the gain needed to undo a loss:
  lose 25% -> need +33.3% to get back
  lose 50% -> need +100.0% to get back
  lose 75% -> need +300.0% to get back
losses where the recovery is LARGER than the loss: 3/3

checks passed: 5/5
A positive average quarter and a losing year are the same year.

Percentages are ratios, and the only thing you can do with a sequence of
ratios is multiply them. Adding them produces a number that is easy to
compute, easy to report, and not the answer to any question anyone asked.
The average of the periods is a real quantity - it just is not the return,
and nothing in the units or the sign says which one is on the slide.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
