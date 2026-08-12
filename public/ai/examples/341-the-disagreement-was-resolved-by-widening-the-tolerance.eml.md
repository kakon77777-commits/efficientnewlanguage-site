<!-- canonical: efficientnewlanguage.org/ai/examples/341-the-disagreement-was-resolved-by-widening-the-tolerance | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 341 — The disagreement was resolved by widening the tolerance

`the_disagreement_was_resolved_by_widening_the_tolerance.eml` sweeps a reconciliation tolerance and measures what it admits besides the difference it was chosen for.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A reconciliation
# that failed by three, and a tolerance of five.
#
# Setting the tolerance was not a cover-up. The difference was small, the
# release was due, and a check that fails on a rounding-sized amount every few
# days is a check nobody reads. Every step of that reasoning is sound and the
# conclusion is still wrong, for two reasons the program measures.
#
# First: a tolerance does not admit only the discrepancy that motivated it. It
# admits everything smaller, including discrepancies with entirely different
# causes, and those causes are not rounding.
#
# Second: the discrepancy that motivated it is SYSTEMATIC - one ledger drops
# fees - so it scales with volume. A tolerance sized to today's volume is
# already too small for next year's, and the same argument will be made again
# with a bigger number.
#
# Nothing is declared. The discrepancy is computed by running both ledgers, and
# its decomposition is computed by running the fee-only cause on its own.

def ledger_complete(day, scale):
    0 => total
    for t in day:
        for _c in [1:scale]:
            total + t[0] + t[1] => total
    return total

def ledger_missing_fees(day, scale):
    0 => total
    for t in day:
        for _c in [1:scale]:
            total + t[0] => total
    return total

def one_off_error(day):
    # a single transaction posted at the wrong amount. Marker 1 is posted too
    # HIGH, which pushes the second ledger toward the first and shrinks the
    # observed gap. Marker 2 is posted too LOW and widens it. Both are the same
    # size of mistake; only one of them is visible as a bigger number.
    0 => e
    for t in day:
        if t[2] == 1:
            e + 4 => e
        if t[2] == 2:
            e - 2 => e
    return e

def discrepancy(day, scale):
    ledger_complete(day, scale) => a
    ledger_missing_fees(day, scale) + one_off_error(day) => b
    if a > b:
        return a - b
    return b - a

def fee_only_discrepancy(day, scale):
    ledger_complete(day, scale) => a
    ledger_missing_fees(day, scale) => b
    if a > b:
        return a - b
    return b - a

[[[50, 1, 0], [30, 1, 0], [20, 1, 0]], [[60, 1, 0], [40, 1, 0], [10, 1, 1]], [[70, 1, 0], [25, 1, 0], [15, 1, 2]], [[80, 1, 0], [35, 1, 0], [45, 1, 1]], [[90, 1, 0], [55, 1, 0], [5, 1, 0]], [[65, 1, 0], [20, 1, 0], [35, 1, 2]]] => days
["mon", "tue", "wed", "thu", "fri", "sat"] => labels

# ---- the day that started it ----

"daily discrepancy at today's volume" ^0
0 => di
for d in days:
    discrepancy(d, 1) => total_gap
    fee_only_discrepancy(d, 1) => fee_gap
    "  " + labels[di] + " : gap " + str(total_gap) + "  (fees alone would give " + str(fee_gap) + ")" ^0
    di + 1 => di
"" ^0

# ---- the tolerance sweep ----

"days that pass, by tolerance" ^0
for tol in [0, 1, 2, 3, 4, 5, 10]:
    0 => passing
    for d in days:
        if discrepancy(d, 1) <= tol:
            passing + 1 => passing
    "  tolerance " + str(tol) + " : " + str(passing) + " of " + str(len(days)) + " pass" ^0
"" ^0

# ---- what the tolerance admits besides the thing it was chosen for ----

"days whose gap has a cause OTHER than the missing fees" ^0
0 => other_cause
0 => hidden_at_5
0 => shrank_the_gap
for di in [0:5]:
    days[di] => d
    discrepancy(d, 1) => total_gap
    fee_only_discrepancy(d, 1) => fee_gap
    if total_gap != fee_gap:
        other_cause + 1 => other_cause
        if total_gap < fee_gap:
            shrank_the_gap + 1 => shrank_the_gap
        if total_gap <= 5:
            hidden_at_5 + 1 => hidden_at_5
            "  " + labels[di] + " : gap " + str(total_gap) + ", fees explain " + str(fee_gap) + " - hidden at tolerance 5" ^0
        else:
            "  " + labels[di] + " : gap " + str(total_gap) + ", fees explain " + str(fee_gap) + " - still visible" ^0
"  days with a second cause : " + str(other_cause) ^0
"  of those, hidden at tolerance 5 : " + str(hidden_at_5) ^0
"  of those, where the second cause made the gap SMALLER : " + str(shrank_the_gap) ^0
if shrank_the_gap > 0:
    "  a day with two defects can report the cleanest number on the board" ^0
"" ^0

# ---- the systematic cause scales ----

"the same tolerance of 5, as volume grows" ^0
for scale in [1, 2, 3, 4]:
    0 => failing
    0 => worst
    for d in days:
        discrepancy(d, scale) => g
        if g > 5:
            failing + 1 => failing
        if g > worst:
            g => worst
    "  volume x" + str(scale) + " : " + str(failing) + " of " + str(len(days)) + " days exceed the tolerance, worst gap " + str(worst) ^0
"" ^0

# ---- the tolerance that would be needed at each volume ----

"smallest tolerance that would silence every day, by volume" ^0
for scale in [1, 2, 3, 4]:
    0 => needed
    for d in days:
        discrepancy(d, scale) => g
        if g > needed:
            g => needed
    "  volume x" + str(scale) + " : " + str(needed) ^0
"" ^0

"A tolerance is a claim that differences below it do not matter. The" ^0
"difference that prompted this one was not too small to matter - it was" ^0
"too small to investigate, and those are different sentences." ^0
```

## Python (deterministic transpilation)

```python
def ledger_complete(day, scale):
    total = 0
    for t in day:
        for _c in range(1, scale+1):
            total = total + t[0] + t[1]
    return total

def ledger_missing_fees(day, scale):
    total = 0
    for t in day:
        for _c in range(1, scale+1):
            total = total + t[0]
    return total

def one_off_error(day):
    e = 0
    for t in day:
        if t[2] == 1:
            e = e + 4
        if t[2] == 2:
            e = e - 2
    return e

def discrepancy(day, scale):
    a = ledger_complete(day, scale)
    b = ledger_missing_fees(day, scale) + one_off_error(day)
    if a > b:
        return a - b
    return b - a

def fee_only_discrepancy(day, scale):
    a = ledger_complete(day, scale)
    b = ledger_missing_fees(day, scale)
    if a > b:
        return a - b
    return b - a

days = [[[50, 1, 0], [30, 1, 0], [20, 1, 0]], [[60, 1, 0], [40, 1, 0], [10, 1, 1]], [[70, 1, 0], [25, 1, 0], [15, 1, 2]], [[80, 1, 0], [35, 1, 0], [45, 1, 1]], [[90, 1, 0], [55, 1, 0], [5, 1, 0]], [[65, 1, 0], [20, 1, 0], [35, 1, 2]]]
labels = ["mon", "tue", "wed", "thu", "fri", "sat"]
print("daily discrepancy at today's volume")
di = 0
for d in days:
    total_gap = discrepancy(d, 1)
    fee_gap = fee_only_discrepancy(d, 1)
    print("  " + labels[di] + " : gap " + str(total_gap) + "  (fees alone would give " + str(fee_gap) + ")")
    di = di + 1
print("")
print("days that pass, by tolerance")
for tol in [0, 1, 2, 3, 4, 5, 10]:
    passing = 0
    for d in days:
        if discrepancy(d, 1) <= tol:
            passing = passing + 1
    print("  tolerance " + str(tol) + " : " + str(passing) + " of " + str(len(days)) + " pass")
print("")
print("days whose gap has a cause OTHER than the missing fees")
other_cause = 0
hidden_at_5 = 0
shrank_the_gap = 0
for di in range(0, 6):
    d = days[di]
    total_gap = discrepancy(d, 1)
    fee_gap = fee_only_discrepancy(d, 1)
    if total_gap != fee_gap:
        other_cause = other_cause + 1
        if total_gap < fee_gap:
            shrank_the_gap = shrank_the_gap + 1
        if total_gap <= 5:
            hidden_at_5 = hidden_at_5 + 1
            print("  " + labels[di] + " : gap " + str(total_gap) + ", fees explain " + str(fee_gap) + " - hidden at tolerance 5")
        else:
            print("  " + labels[di] + " : gap " + str(total_gap) + ", fees explain " + str(fee_gap) + " - still visible")
print("  days with a second cause : " + str(other_cause))
print("  of those, hidden at tolerance 5 : " + str(hidden_at_5))
print("  of those, where the second cause made the gap SMALLER : " + str(shrank_the_gap))
if shrank_the_gap > 0:
    print("  a day with two defects can report the cleanest number on the board")
print("")
print("the same tolerance of 5, as volume grows")
for scale in [1, 2, 3, 4]:
    failing = 0
    worst = 0
    for d in days:
        g = discrepancy(d, scale)
        if g > 5:
            failing = failing + 1
        if g > worst:
            worst = g
    print("  volume x" + str(scale) + " : " + str(failing) + " of " + str(len(days)) + " days exceed the tolerance, worst gap " + str(worst))
print("")
print("smallest tolerance that would silence every day, by volume")
for scale in [1, 2, 3, 4]:
    needed = 0
    for d in days:
        g = discrepancy(d, scale)
        if g > needed:
            needed = g
    print("  volume x" + str(scale) + " : " + str(needed))
print("")
print("A tolerance is a claim that differences below it do not matter. The")
print("difference that prompted this one was not too small to matter - it was")
print("too small to investigate, and those are different sentences.")
```

## stdout (executed)

```text
daily discrepancy at today's volume
  mon : gap 3  (fees alone would give 3)
  tue : gap 1  (fees alone would give 3)
  wed : gap 5  (fees alone would give 3)
  thu : gap 1  (fees alone would give 3)
  fri : gap 3  (fees alone would give 3)
  sat : gap 5  (fees alone would give 3)

days that pass, by tolerance
  tolerance 0 : 0 of 6 pass
  tolerance 1 : 2 of 6 pass
  tolerance 2 : 2 of 6 pass
  tolerance 3 : 4 of 6 pass
  tolerance 4 : 4 of 6 pass
  tolerance 5 : 6 of 6 pass
  tolerance 10 : 6 of 6 pass

days whose gap has a cause OTHER than the missing fees
  tue : gap 1, fees explain 3 - hidden at tolerance 5
  wed : gap 5, fees explain 3 - hidden at tolerance 5
  thu : gap 1, fees explain 3 - hidden at tolerance 5
  sat : gap 5, fees explain 3 - hidden at tolerance 5
  days with a second cause : 4
  of those, hidden at tolerance 5 : 4
  of those, where the second cause made the gap SMALLER : 2
  a day with two defects can report the cleanest number on the board

the same tolerance of 5, as volume grows
  volume x1 : 0 of 6 days exceed the tolerance, worst gap 5
  volume x2 : 4 of 6 days exceed the tolerance, worst gap 8
  volume x3 : 4 of 6 days exceed the tolerance, worst gap 11
  volume x4 : 6 of 6 days exceed the tolerance, worst gap 14

smallest tolerance that would silence every day, by volume
  volume x1 : 5
  volume x2 : 8
  volume x3 : 11
  volume x4 : 14

A tolerance is a claim that differences below it do not matter. The
difference that prompted this one was not too small to matter - it was
too small to investigate, and those are different sentences.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
