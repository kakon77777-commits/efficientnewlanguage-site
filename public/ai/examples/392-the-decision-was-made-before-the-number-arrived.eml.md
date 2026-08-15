<!-- canonical: efficientnewlanguage.org/ai/examples/392-the-decision-was-made-before-the-number-arrived | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 392 — The decision was made before the number arrived - 1 distinct decision across 8 possible results, 4 distinct announcements

`the_decision_was_made_before_the_number_arrived.eml` runs the decision over every possible result and counts the distinct decisions, because that - not whether it was read - is the test of whether an analysis mattered.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The analysis was
# requested, funded, done honestly, and could not have changed anything.
#
# Nothing here is a sham. The number is computed correctly, the analyst has no
# thumb on the scale, and the meeting genuinely discusses it. What has already
# happened is that the contract is signed, the team is hired, and the launch
# date is announced - so the set of outcomes that lead to not shipping is
# empty before the first data point exists.
#
# The test for whether an analysis mattered is not whether it was read. It is
# whether any result would have produced a different action, and that is
# computable: run the decision over every possible result and count the
# distinct decisions.

[-40, -20, -5, 0, 5, 20, 40, 80] => possible_results

# The decision as actually taken: ship, and use the number for the wording.
def decision_committed(result):
    return "ship"

# The decision as it was described in the plan.
def decision_as_planned(result):
    if result > 0:
        return "ship"
    return "do not ship"

def distinct_decisions(mode):
    [] => seen
    for r in possible_results:
        if mode == 0:
            decision_committed(r) => d
        else:
            decision_as_planned(r) => d
        0 => have
        for s in seen:
            if s == d:
                1 => have
        if have == 0:
            seen + [d] => seen
    return len(seen)

"possible results : " + str(len(possible_results)) ^0
"" ^0

"result   decision as committed   decision as planned" ^0
for r in possible_results:
    "  " + str(r) + "       " + decision_committed(r) + "                   " + decision_as_planned(r) ^0
"" ^0

"distinct decisions the analysis can produce" ^0
"  as committed : " + str(distinct_decisions(0)) ^0
"  as planned   : " + str(distinct_decisions(1)) ^0
if distinct_decisions(0) == 1:
    "  one decision over every possible result - the analysis has no path to" ^0
    "  the outcome, whatever it says" ^0
"" ^0

# ---- what the analysis did change ----
#
# It is not that nothing depended on the number. The wording depended on it,
# and that is a real use - it is just not the use the plan named.

def wording(result):
    if result > 20:
        return "a clear win"
    if result > 0:
        return "a modest but real gain"
    if result == 0:
        return "neutral, as expected at this stage"
    return "early, with the gains still ahead"

"what the number did change" ^0
[] => phrasings
for r in possible_results:
    wording(r) => w
    0 => have
    for p in phrasings:
        if p == w:
            1 => have
    if have == 0:
        phrasings + [w] => phrasings
"  distinct announcements : " + str(len(phrasings)) ^0
for p in phrasings:
    "    " + p ^0
"" ^0

"  decisions the number can change : " + str(distinct_decisions(0)) ^0
"  announcements it can change     : " + str(len(phrasings)) ^0
if len(phrasings) > distinct_decisions(0):
    "  the number is doing work, and the work is not the work it was for" ^0
"" ^0

# ---- when the commitment happened ----

[["contract signed", 1], ["team hired", 2], ["date announced", 3], ["analysis requested", 4], ["result available", 7], ["decision meeting", 8]] => timeline
"timeline" ^0
for t in timeline:
    "  week " + str(t[1]) + " : " + t[0] ^0
0 => commit_week
for t in timeline:
    if t[0] == "date announced":
        t[1] => commit_week
0 => result_week
for t in timeline:
    if t[0] == "result available":
        t[1] => result_week
"  weeks between commitment and result : " + str(result_week - commit_week) ^0
"" ^0

# ---- the control: the same analysis, requested before the commitment ----
#
# The analysis is not weak. It is late. Moved earlier, the identical numbers
# produce two different actions.

"control - the same possible results, decided before anything was committed" ^0
"  distinct decisions : " + str(distinct_decisions(1)) ^0
if distinct_decisions(1) > 1:
    "  two outcomes, so the analysis can decide something" ^0
"" ^0

"An analysis that is read, discussed and correct can still have no path to" ^0
"the outcome. Whether it had one is a question about the calendar, not about" ^0
"the analysis." ^0
```

## Python (deterministic transpilation)

```python
possible_results = [-40, -20, -5, 0, 5, 20, 40, 80]

def decision_committed(result):
    return "ship"

def decision_as_planned(result):
    if result > 0:
        return "ship"
    return "do not ship"

def distinct_decisions(mode):
    seen = []
    for r in possible_results:
        if mode == 0:
            d = decision_committed(r)
        else:
            d = decision_as_planned(r)
        have = 0
        for s in seen:
            if s == d:
                have = 1
        if have == 0:
            seen = seen + [d]
    return len(seen)

print("possible results : " + str(len(possible_results)))
print("")
print("result   decision as committed   decision as planned")
for r in possible_results:
    print("  " + str(r) + "       " + decision_committed(r) + "                   " + decision_as_planned(r))
print("")
print("distinct decisions the analysis can produce")
print("  as committed : " + str(distinct_decisions(0)))
print("  as planned   : " + str(distinct_decisions(1)))
if distinct_decisions(0) == 1:
    print("  one decision over every possible result - the analysis has no path to")
    print("  the outcome, whatever it says")
print("")

def wording(result):
    if result > 20:
        return "a clear win"
    if result > 0:
        return "a modest but real gain"
    if result == 0:
        return "neutral, as expected at this stage"
    return "early, with the gains still ahead"

print("what the number did change")
phrasings = []
for r in possible_results:
    w = wording(r)
    have = 0
    for p in phrasings:
        if p == w:
            have = 1
    if have == 0:
        phrasings = phrasings + [w]
print("  distinct announcements : " + str(len(phrasings)))
for p in phrasings:
    print("    " + p)
print("")
print("  decisions the number can change : " + str(distinct_decisions(0)))
print("  announcements it can change     : " + str(len(phrasings)))
if len(phrasings) > distinct_decisions(0):
    print("  the number is doing work, and the work is not the work it was for")
print("")
timeline = [["contract signed", 1], ["team hired", 2], ["date announced", 3], ["analysis requested", 4], ["result available", 7], ["decision meeting", 8]]
print("timeline")
for t in timeline:
    print("  week " + str(t[1]) + " : " + t[0])
commit_week = 0
for t in timeline:
    if t[0] == "date announced":
        commit_week = t[1]
result_week = 0
for t in timeline:
    if t[0] == "result available":
        result_week = t[1]
print("  weeks between commitment and result : " + str(result_week - commit_week))
print("")
print("control - the same possible results, decided before anything was committed")
print("  distinct decisions : " + str(distinct_decisions(1)))
if distinct_decisions(1) > 1:
    print("  two outcomes, so the analysis can decide something")
print("")
print("An analysis that is read, discussed and correct can still have no path to")
print("the outcome. Whether it had one is a question about the calendar, not about")
print("the analysis.")
```

## stdout (executed)

```text
possible results : 8

result   decision as committed   decision as planned
  -40       ship                   do not ship
  -20       ship                   do not ship
  -5       ship                   do not ship
  0       ship                   do not ship
  5       ship                   ship
  20       ship                   ship
  40       ship                   ship
  80       ship                   ship

distinct decisions the analysis can produce
  as committed : 1
  as planned   : 2
  one decision over every possible result - the analysis has no path to
  the outcome, whatever it says

what the number did change
  distinct announcements : 4
    early, with the gains still ahead
    neutral, as expected at this stage
    a modest but real gain
    a clear win

  decisions the number can change : 1
  announcements it can change     : 4
  the number is doing work, and the work is not the work it was for

timeline
  week 1 : contract signed
  week 2 : team hired
  week 3 : date announced
  week 4 : analysis requested
  week 7 : result available
  week 8 : decision meeting
  weeks between commitment and result : 4

control - the same possible results, decided before anything was committed
  distinct decisions : 2
  two outcomes, so the analysis can decide something

An analysis that is read, discussed and correct can still have no path to
the outcome. Whether it had one is a question about the calendar, not about
the analysis.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
