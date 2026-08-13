<!-- canonical: efficientnewlanguage.org/ai/examples/358-closed-because-it-stopped-being-reported | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 358 — Closed because it stopped being reported — 485 occurrences after closure, 0 reports

`closed_because_it_stopped_being_reported.eml` evaluates a "no reports for three periods" closure rule against what the defect was actually doing.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A finding closed
# under the rule "no new reports for three periods".
#
# The rule is sensible and cheap. It also measures reporting, and reporting is
# a product of two things: how often the defect happens, and how many people
# are positioned to notice. The closure rule reads their product and attributes
# all of it to the first factor.
#
# Here the second factor collapses. The one team that ran the affected path
# migrated away, so their traffic - and their eyes - left. The defect rate is
# unchanged. The reports stop. The finding closes.
#
# Nothing is declared: occurrences are computed from the traffic and the defect
# condition, reports are computed from occurrences and who was watching, and
# the closure rule is evaluated on the reports exactly as written.

def occurrences(volume):
    # the defect fires on one request in four
    return int(volume / 4)

def reports(occ, watchers):
    if watchers == 0:
        return 0
    # a watching team files at most one report per period
    if occ > 0:
        return 1
    return 0

# [period, volume, watching teams]
[[1, 400, 1], [2, 440, 1], [3, 480, 1], [4, 520, 0], [5, 560, 0], [6, 600, 0], [7, 640, 0], [8, 700, 0]] => periods

3 => quiet_needed

# ---- what actually happened, period by period ----

"period   volume   occurrences   watchers   reports" ^0
[] => occ_series
[] => rep_series
for p in periods:
    occurrences(p[1]) => o
    reports(o, p[2]) => r
    occ_series + [o] => occ_series
    rep_series + [r] => rep_series
    "  " + str(p[0]) + "        " + str(p[1]) + "      " + str(o) + "           " + str(p[2]) + "          " + str(r) ^0
"" ^0

# ---- the closure rule, evaluated on reports ----

0 => quiet_run
0 => closed_at
0 => idx
for r in rep_series:
    if r == 0:
        quiet_run + 1 => quiet_run
    else:
        0 => quiet_run
    if quiet_run == quiet_needed:
        if closed_at == 0:
            periods[idx][0] => closed_at
    idx + 1 => idx
"the closure rule: no reports for " + str(quiet_needed) + " periods" ^0
if closed_at > 0:
    "  finding closed at period " + str(closed_at) ^0
else:
    "  finding still open" ^0
"" ^0

# ---- what the defect was doing at the moment of closure ----

0 => at_closure
0 => j
for p in periods:
    if p[0] == closed_at:
        occ_series[j] => at_closure
    j + 1 => j
"  occurrences in the period it was closed : " + str(at_closure) ^0
"  occurrences in the first period         : " + str(occ_series[0]) ^0
if at_closure >= occ_series[0]:
    "  the defect was firing at least as often as when it was reported" ^0
"" ^0

# ---- totals on each side of the closure ----

0 => before_occ
0 => after_occ
0 => before_rep
0 => after_rep
0 => k
for p in periods:
    if p[0] < closed_at:
        before_occ + occ_series[k] => before_occ
        before_rep + rep_series[k] => before_rep
    else:
        after_occ + occ_series[k] => after_occ
        after_rep + rep_series[k] => after_rep
    k + 1 => k
"before the closure : " + str(before_occ) + " occurrences, " + str(before_rep) + " reports" ^0
"after the closure  : " + str(after_occ) + " occurrences, " + str(after_rep) + " reports" ^0
"" ^0

# ---- the two factors, separated ----
#
# Run the same traffic with the watchers still in place, and with the watchers
# gone but the traffic halted. Only one of those changes the occurrence count.

"the same periods, with the watching team still present" ^0
0 => alt_rep
0 => alt_occ
for p in periods:
    occurrences(p[1]) => o
    alt_occ + o => alt_occ
    alt_rep + reports(o, 1) => alt_rep
"  occurrences : " + str(alt_occ) ^0
"  reports     : " + str(alt_rep) ^0
"" ^0

"the same periods, with the traffic actually stopped" ^0
0 => halt_rep
0 => halt_occ
for p in periods:
    occurrences(0) => o
    halt_occ + o => halt_occ
    halt_rep + reports(o, p[2]) => halt_rep
"  occurrences : " + str(halt_occ) ^0
"  reports     : " + str(halt_rep) ^0
"" ^0

0 => actual_occ
for o in occ_series:
    actual_occ + o => actual_occ
"what happened          : " + str(actual_occ) + " occurrences, " + str(before_rep + after_rep) + " reports" ^0
"what silence would mean if the defect had stopped : " + str(halt_occ) + " occurrences" ^0
if actual_occ > halt_occ:
    "  the two are distinguishable, and reports alone cannot distinguish them" ^0
"" ^0

# ---- the detection rate, which is what actually changed ----

"periods in which the defect occurred and nothing was filed" ^0
0 => m
0 => silent_periods
0 => silent_occ
for p in periods:
    if occ_series[m] > 0:
        if rep_series[m] == 0:
            silent_periods + 1 => silent_periods
            silent_occ + occ_series[m] => silent_occ
    m + 1 => m
"  silent periods : " + str(silent_periods) + " of " + str(len(periods)) ^0
"  occurrences inside them : " + str(silent_occ) ^0
0 => zero_periods
for o in occ_series:
    if o == 0:
        zero_periods + 1 => zero_periods
"  periods in which the defect did NOT occur : " + str(zero_periods) ^0
"" ^0

"An absence of reports has two explanations and the closure rule reads one." ^0
"Naming both before acting is the whole cost, and it is one sentence." ^0
```

## Python (deterministic transpilation)

```python
def occurrences(volume):
    return int(volume / 4)

def reports(occ, watchers):
    if watchers == 0:
        return 0
    if occ > 0:
        return 1
    return 0

periods = [[1, 400, 1], [2, 440, 1], [3, 480, 1], [4, 520, 0], [5, 560, 0], [6, 600, 0], [7, 640, 0], [8, 700, 0]]
quiet_needed = 3
print("period   volume   occurrences   watchers   reports")
occ_series = []
rep_series = []
for p in periods:
    o = occurrences(p[1])
    r = reports(o, p[2])
    occ_series = occ_series + [o]
    rep_series = rep_series + [r]
    print("  " + str(p[0]) + "        " + str(p[1]) + "      " + str(o) + "           " + str(p[2]) + "          " + str(r))
print("")
quiet_run = 0
closed_at = 0
idx = 0
for r in rep_series:
    if r == 0:
        quiet_run = quiet_run + 1
    else:
        quiet_run = 0
    if quiet_run == quiet_needed:
        if closed_at == 0:
            closed_at = periods[idx][0]
    idx = idx + 1
print("the closure rule: no reports for " + str(quiet_needed) + " periods")
if closed_at > 0:
    print("  finding closed at period " + str(closed_at))
else:
    print("  finding still open")
print("")
at_closure = 0
j = 0
for p in periods:
    if p[0] == closed_at:
        at_closure = occ_series[j]
    j = j + 1
print("  occurrences in the period it was closed : " + str(at_closure))
print("  occurrences in the first period         : " + str(occ_series[0]))
if at_closure >= occ_series[0]:
    print("  the defect was firing at least as often as when it was reported")
print("")
before_occ = 0
after_occ = 0
before_rep = 0
after_rep = 0
k = 0
for p in periods:
    if p[0] < closed_at:
        before_occ = before_occ + occ_series[k]
        before_rep = before_rep + rep_series[k]
    else:
        after_occ = after_occ + occ_series[k]
        after_rep = after_rep + rep_series[k]
    k = k + 1
print("before the closure : " + str(before_occ) + " occurrences, " + str(before_rep) + " reports")
print("after the closure  : " + str(after_occ) + " occurrences, " + str(after_rep) + " reports")
print("")
print("the same periods, with the watching team still present")
alt_rep = 0
alt_occ = 0
for p in periods:
    o = occurrences(p[1])
    alt_occ = alt_occ + o
    alt_rep = alt_rep + reports(o, 1)
print("  occurrences : " + str(alt_occ))
print("  reports     : " + str(alt_rep))
print("")
print("the same periods, with the traffic actually stopped")
halt_rep = 0
halt_occ = 0
for p in periods:
    o = occurrences(0)
    halt_occ = halt_occ + o
    halt_rep = halt_rep + reports(o, p[2])
print("  occurrences : " + str(halt_occ))
print("  reports     : " + str(halt_rep))
print("")
actual_occ = 0
for o in occ_series:
    actual_occ = actual_occ + o
print("what happened          : " + str(actual_occ) + " occurrences, " + str(before_rep + after_rep) + " reports")
print("what silence would mean if the defect had stopped : " + str(halt_occ) + " occurrences")
if actual_occ > halt_occ:
    print("  the two are distinguishable, and reports alone cannot distinguish them")
print("")
print("periods in which the defect occurred and nothing was filed")
m = 0
silent_periods = 0
silent_occ = 0
for p in periods:
    if occ_series[m] > 0:
        if rep_series[m] == 0:
            silent_periods = silent_periods + 1
            silent_occ = silent_occ + occ_series[m]
    m = m + 1
print("  silent periods : " + str(silent_periods) + " of " + str(len(periods)))
print("  occurrences inside them : " + str(silent_occ))
zero_periods = 0
for o in occ_series:
    if o == 0:
        zero_periods = zero_periods + 1
print("  periods in which the defect did NOT occur : " + str(zero_periods))
print("")
print("An absence of reports has two explanations and the closure rule reads one.")
print("Naming both before acting is the whole cost, and it is one sentence.")
```

## stdout (executed)

```text
period   volume   occurrences   watchers   reports
  1        400      100           1          1
  2        440      110           1          1
  3        480      120           1          1
  4        520      130           0          0
  5        560      140           0          0
  6        600      150           0          0
  7        640      160           0          0
  8        700      175           0          0

the closure rule: no reports for 3 periods
  finding closed at period 6

  occurrences in the period it was closed : 150
  occurrences in the first period         : 100
  the defect was firing at least as often as when it was reported

before the closure : 600 occurrences, 3 reports
after the closure  : 485 occurrences, 0 reports

the same periods, with the watching team still present
  occurrences : 1085
  reports     : 8

the same periods, with the traffic actually stopped
  occurrences : 0
  reports     : 0

what happened          : 1085 occurrences, 3 reports
what silence would mean if the defect had stopped : 0 occurrences
  the two are distinguishable, and reports alone cannot distinguish them

periods in which the defect occurred and nothing was filed
  silent periods : 5 of 8
  occurrences inside them : 755
  periods in which the defect did NOT occur : 0

An absence of reports has two explanations and the closure rule reads one.
Naming both before acting is the whole cost, and it is one sentence.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
