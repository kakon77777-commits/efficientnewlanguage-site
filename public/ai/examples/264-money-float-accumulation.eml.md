<!-- canonical: efficientnewlanguage.org/ai/examples/264-money-float-accumulation | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 264 — Money in floats — a difference that prints as -0.00

`money_float_accumulation.eml` adds the same money two ways — as floats and as integer cents — over runs of 10 to 2000 items, and reports equality, the direction of the gap, and what a reconciliation report would print.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A ledger that
# balances, and a difference that prints as -0.00.
#
# 0.01 is not representable in binary floating point. The usual story about
# this is that the error accumulates over a long ledger - that a thousand line
# items drift somewhere a handful of items do not. This file was written to
# demonstrate that story and the measurement disagreed with it twice:
#
#     TEN items already differ.  0.01 added ten times is not 0.1, and the
#     shortest run measured here is already wrong. There is no safe length.
#
#     The direction is not stable. Over 10, 100, 500, 1000 and 2000 items the
#     float total comes out low, high, low, low, high. It is not a drift in a
#     known direction that a correction factor could absorb - two teams
#     sampling different batch sizes will reach opposite conclusions about
#     which side the money is on.
#
# A third premise also failed, and it is stated here as a check rather than
# quietly dropped: converting a float price back to cents with the obvious
# `int(x * 100 + 0.5)` is SAFE for every price from one cent to twenty
# dollars. The danger is not representing a price. It is adding prices up.
#
# The measurement adds the same money two ways - as floats and as integer
# cents - over runs of increasing length, and reports equality, the direction
# of the gap, and what a reconciliation report would print.

def add_float(n, cent):
    0.0 => total
    for k in [1:n]:
        total + cent => total
    return total

def add_int(n, cent_i):
    0 => total
    for k in [1:n]:
        total + cent_i => total
    return total

def cents_of(f):
    # The conversion every system does at the boundary, written the obvious way.
    return int(f * 100 + 0.5)


[10, 100, 500, 1000, 2000] => RUNS

"items    float total          exact total   equal"^0
0 => agreed
{} => res
for n in RUNS:
    add_float(n, 0.01) => f
    add_int(n, 1) / 100 => exact
    f == exact => same
    [f, exact, same] => res[str(n)]
    if same:
        agreed + 1 => agreed
    ("%-8d %-20s %-13s %s" % (n, str(f), str(exact), str(same)))^0

""^0
("run lengths tested: " + str(len(RUNS)))^0
("  run lengths where the two totals are equal: " + str(agreed))^0
"...including the shortest, which is ten cents."^0

# ------------------------------------------- the direction of the error
""^0
"which side of the exact total the float lands on:"^0
0 => low
0 => high
"" => pattern
for n in RUNS:
    res[str(n)] => r
    "same" => side
    if r[0] < r[1]:
        low + 1 => low
        "low" => side
    if r[0] > r[1]:
        high + 1 => high
        "high" => side
    if len(pattern) > 0:
        pattern + " " => pattern
    pattern + side => pattern
    ("  n=%-6d %s" % (n, side))^0
("  pattern across increasing n: " + pattern)^0
("  runs low: " + str(low) + ", runs high: " + str(high))^0

# ---------------------------------- the comparison that still looks right
""^0
"what a reconciliation report prints for a thousand items:"^0
add_float(1000, 0.01) => f1000
add_int(1000, 1) / 100 => e1000
("  float total:      " + ("%.2f" % f1000))^0
("  expected total:   " + ("%.2f" % e1000))^0
("  difference:       " + ("%.2f" % (f1000 - e1000)))^0
"...and the same two numbers compared before formatting:"^0
("  equal: " + str(f1000 == e1000))^0

# ------------------------------- the part that turned out to be fine
""^0
"converting a float price back to cents, every price from 1 to 2000:"^0
0 => convert_bad
0 => convert_n
for cents in [1:2000]:
    convert_n + 1 => convert_n
    cents / 100 => as_float
    if not (cents_of(as_float) == cents):
        convert_bad + 1 => convert_bad
("  prices tested: " + str(convert_n) + ", failed to round trip: " + str(convert_bad))^0
"...so representing a single price is not the problem this case is about."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# No run length may agree, including the shortest. The premise this file was
# written to show - that short ledgers are safe - is the one the measurement
# killed, and this check is what keeps it dead.
checked + 1 => checked
if agreed == 0:
    passed + 1 => passed

# The error must go BOTH ways across the run lengths. A one-directional error
# would be a drift, and a drift can be corrected for; this cannot.
checked + 1 => checked
if low > 0 and high > 0:
    passed + 1 => passed

# The integer path must be exact at every length - it is the reference, and a
# reference that drifts is not one.
checked + 1 => checked
0 => int_exact
for n in RUNS:
    if add_int(n, 1) == n:
        int_exact + 1 => int_exact
if int_exact == len(RUNS):
    passed + 1 => passed

# Formatted to two decimal places the difference must read as a zero - and
# because the float came out LOW at a thousand items, it reads as "-0.00",
# which is what the report actually shows.
checked + 1 => checked
if ("%.2f" % (f1000 - e1000)) == "-0.00" and not (f1000 == e1000):
    passed + 1 => passed

# And the boundary conversion must survive every price. This check asserts
# that something is FINE: it holds the scope of the case honest, and if a
# future change breaks it, the case is wrong rather than merely incomplete.
checked + 1 => checked
if convert_bad == 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Ten cents is already wrong, and the difference prints as -0.00." => verdict
else:
    "FAILED - the arithmetic did not behave as the checks describe." => verdict
verdict^0

""^0
"Money is a count of the smallest coin, not a measurement of a quantity." => n1
n1^0
"What the measurement corrected is the shape of the danger: it is not a" => n2
n2^0
"slow drift that appears at scale and leans one way. It is present at ten" => n3
n3^0
"items, it leans whichever way the bit pattern happens to fall, and every" => n4
n4^0
"check that formats before comparing will pass on both sides." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def add_float(n, cent):
    total = 0.0
    for k in range(1, n+1):
        total = total + cent
    return total

def add_int(n, cent_i):
    total = 0
    for k in range(1, n+1):
        total = total + cent_i
    return total

def cents_of(f):
    return int(f * 100 + 0.5)

RUNS = [10, 100, 500, 1000, 2000]
print("items    float total          exact total   equal")
agreed = 0
res = {}
for n in RUNS:
    f = add_float(n, 0.01)
    exact = add_int(n, 1) / 100
    same = f == exact
    res[str(n)] = [f, exact, same]
    if same:
        agreed = agreed + 1
    print("%-8d %-20s %-13s %s" % (n, str(f), str(exact), str(same)))
print("")
print("run lengths tested: " + str(len(RUNS)))
print("  run lengths where the two totals are equal: " + str(agreed))
print("...including the shortest, which is ten cents.")
print("")
print("which side of the exact total the float lands on:")
low = 0
high = 0
pattern = ""
for n in RUNS:
    r = res[str(n)]
    side = "same"
    if r[0] < r[1]:
        low = low + 1
        side = "low"
    if r[0] > r[1]:
        high = high + 1
        side = "high"
    if len(pattern) > 0:
        pattern = pattern + " "
    pattern = pattern + side
    print("  n=%-6d %s" % (n, side))
print("  pattern across increasing n: " + pattern)
print("  runs low: " + str(low) + ", runs high: " + str(high))
print("")
print("what a reconciliation report prints for a thousand items:")
f1000 = add_float(1000, 0.01)
e1000 = add_int(1000, 1) / 100
print("  float total:      " + "%.2f" % f1000)
print("  expected total:   " + "%.2f" % e1000)
print("  difference:       " + "%.2f" % (f1000 - e1000))
print("...and the same two numbers compared before formatting:")
print("  equal: " + str(f1000 == e1000))
print("")
print("converting a float price back to cents, every price from 1 to 2000:")
convert_bad = 0
convert_n = 0
for cents in range(1, 2001):
    convert_n = convert_n + 1
    as_float = cents / 100
    if not cents_of(as_float) == cents:
        convert_bad = convert_bad + 1
print("  prices tested: " + str(convert_n) + ", failed to round trip: " + str(convert_bad))
print("...so representing a single price is not the problem this case is about.")
passed = 0
checked = 0
checked = checked + 1
if agreed == 0:
    passed = passed + 1
checked = checked + 1
if low > 0 and high > 0:
    passed = passed + 1
checked = checked + 1
int_exact = 0
for n in RUNS:
    if add_int(n, 1) == n:
        int_exact = int_exact + 1
if int_exact == len(RUNS):
    passed = passed + 1
checked = checked + 1
if "%.2f" % (f1000 - e1000) == "-0.00" and not f1000 == e1000:
    passed = passed + 1
checked = checked + 1
if convert_bad == 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Ten cents is already wrong, and the difference prints as -0.00."
else:
    verdict = "FAILED - the arithmetic did not behave as the checks describe."
print(verdict)
print("")
n1 = "Money is a count of the smallest coin, not a measurement of a quantity."
print(n1)
n2 = "What the measurement corrected is the shape of the danger: it is not a"
print(n2)
n3 = "slow drift that appears at scale and leans one way. It is present at ten"
print(n3)
n4 = "items, it leans whichever way the bit pattern happens to fall, and every"
print(n4)
n5 = "check that formats before comparing will pass on both sides."
print(n5)
```

## stdout (executed)

```text
items    float total          exact total   equal
10       0.09999999999999999  0.1           False
100      1.0000000000000007   1.0           False
500      4.999999999999938    5.0           False
1000     9.999999999999831    10.0          False
2000     20.000000000000327   20.0          False

run lengths tested: 5
  run lengths where the two totals are equal: 0
...including the shortest, which is ten cents.

which side of the exact total the float lands on:
  n=10     low
  n=100    high
  n=500    low
  n=1000   low
  n=2000   high
  pattern across increasing n: low high low low high
  runs low: 3, runs high: 2

what a reconciliation report prints for a thousand items:
  float total:      10.00
  expected total:   10.00
  difference:       -0.00
...and the same two numbers compared before formatting:
  equal: False

converting a float price back to cents, every price from 1 to 2000:
  prices tested: 2000, failed to round trip: 0
...so representing a single price is not the problem this case is about.

checks passed: 5/5
Ten cents is already wrong, and the difference prints as -0.00.

Money is a count of the smallest coin, not a measurement of a quantity.
What the measurement corrected is the shape of the danger: it is not a
slow drift that appears at scale and leans one way. It is present at ten
items, it leans whichever way the bit pattern happens to fall, and every
check that formats before comparing will pass on both sides.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
