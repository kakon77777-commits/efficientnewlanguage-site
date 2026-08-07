<!-- canonical: efficientnewlanguage.org/ai/examples/280-flaky-quarantine-drift | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 280 — Flaky quarantine drift — a green pipeline and a third of the gate gone

`flaky_quarantine_drift.eml` runs the quarantine process week by week and records three quantities: the active suite's pass rate, the number of active tests, and the number of **defects the active suite would still catch**.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The suite gets
# greener every week and covers less every week, and one number is reported.
#
# A flaky test blocks the pipeline, so it gets quarantined: excluded from the
# gate, kept in a list, "to be fixed". The pipeline goes green. Nothing about
# the code changed, and the suite now checks less than it did - but the metric
# everyone watches is the pass rate of the ACTIVE suite, which quarantining
# improves by construction.
#
# The drift is monotone and slow, which is the worst combination: every
# individual decision is defensible and the aggregate is a suite that passes
# 100% while testing progressively less. The number that would show it - how
# many behaviours are still gated - is not the number on the dashboard.
#
# The measurement runs the process week by week: each week the flakiest active
# test is quarantined, and three quantities are recorded - the active pass
# rate, the number of active tests, and the number of DEFECTS the active suite
# would still catch. The third is the one that matters and the only one nobody
# computes.

# Each test: [name, flake_permille, defects_it_catches]
[
    ["auth", 0, 3],
    ["billing", 120, 4],
    ["search", 40, 2],
    ["upload", 300, 5],
    ["export", 10, 1],
    ["webhook", 200, 3]
] => TESTS

def active_after(weeks):
    # Quarantine the flakiest remaining test, once per week.
    [] => live
    for t in TESTS:
        live + [t] => live
    for w in [1:weeks]:
        0 - 1 => worst
        0 => idx
        for i in [0:len(live) - 1]:
            if live[i][1] > worst:
                live[i][1] => worst
                i => idx
        if worst > 0:
            [] => next_live
            for i in [0:len(live) - 1]:
                if not (i == idx):
                    next_live + [live[i]] => next_live
            next_live => live
    return live

def pass_permille(live):
    # Probability the whole active suite passes: product of (1 - flake).
    1000 => p
    for t in live:
        int(p * (1000 - t[1]) / 1000) => p
    return p

def defects_gated(live):
    0 => d
    for t in live:
        d + t[2] => d
    return d

def show(pm):
    return str(int(pm / 10)) + "." + str(pm % 10) + "%"


0 => total_defects
for t in TESTS:
    total_defects + t[2] => total_defects

"week   active tests   suite pass rate   defects still gated"^0
{} => hist
for w in [0:4]:
    active_after(w) => live
    pass_permille(live) => p
    defects_gated(live) => d
    [len(live), p, d] => hist[str(w)]
    ("%-6d %-14d %-17s %d/%d" % (w, len(live), show(p), d, total_defects))^0

""^0
("tests at the start: " + str(len(TESTS)) + ", defects they gate: " + str(total_defects))^0

# ------------------------------ both series are monotone, in opposite ways
""^0
0 => pass_rising
0 => gated_falling
0 => steps
for w in [0:3]:
    steps + 1 => steps
    if hist[str(w + 1)][1] >= hist[str(w)][1]:
        pass_rising + 1 => pass_rising
    if hist[str(w + 1)][2] < hist[str(w)][2]:
        gated_falling + 1 => gated_falling
("weeks where the pass rate rose or held: " + str(pass_rising) + "/" + str(steps))^0
("weeks where the defects gated fell:     " + str(gated_falling) + "/" + str(steps))^0
"...every week is an improvement by the reported number and a regression by"^0
"the unreported one."^0

# ---------------------------- the quarantined tests catch the most
""^0
"tests in quarantine order, with what each one was gating:"^0
0 => heavy_first
for w in [1:4]:
    active_after(w - 1) => before
    active_after(w) => after
    for t in before:
        0 => still
        for u in after:
            if u[0] == t[0]:
                1 => still
        if still == 0:
            ("  week %d: %-9s flake %-7s gated %d defects" % (w, t[0], show(t[1]), t[2]))^0
            if t[2] >= 3:
                heavy_first + 1 => heavy_first
("quarantined tests that gated 3 or more defects: " + str(heavy_first) + "/4")^0
"...a test is flaky because it touches something real, so the flakiest tests"^0
"are not a random sample of the suite."^0

# ------------------------------- what the honest metric would show
""^0
("after 4 weeks: pass rate " + show(hist["4"][1]) + ", defects gated " + str(hist["4"][2]) + "/" + str(total_defects))^0
hist["0"][2] - hist["4"][2] => lost
("  behaviours that stopped being checked: " + str(lost))^0
("  and the pass rate improved by " + show(hist["4"][1] - hist["0"][1]))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The pass rate must rise or hold every single week - the process cannot make
# the reported number worse, which is why it never stops.
checked + 1 => checked
if pass_rising == steps:
    passed + 1 => passed

# And the defects gated must fall every single week.
checked + 1 => checked
if gated_falling == steps:
    passed + 1 => passed

# The suite must end at or near a perfect pass rate while gating strictly less
# than it started with.
checked + 1 => checked
if hist["4"][1] >= 950 and hist["4"][2] < hist["0"][2]:
    passed + 1 => passed

# The quarantined tests must be the ones gating the most - flakiness
# correlates with touching something real, so this is not a random sample.
checked + 1 => checked
if heavy_first >= 3:
    passed + 1 => passed

# And at week 0 the pass rate must be visibly poor, so the starting point is a
# suite that genuinely could not be shipped as a gate.
checked + 1 => checked
if hist["0"][1] < 600:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Four defensible decisions, a green pipeline, and a third of the gate gone." => verdict
else:
    "FAILED - the quarantine process did not behave as the checks describe." => verdict
verdict^0

""^0
"Quarantining is the right call for any single flaky test and has no" => n1
n1^0
"stopping condition, because the metric it improves is computed over the" => n2
n2^0
"tests that remain. The quantity that would stop it - how much of the" => n3
n3^0
"system is still gated - is a property of the tests that LEFT, and nothing" => n4
n4^0
"in a green pipeline reports on those." => n5
n5^0
```

## Python (deterministic transpilation)

```python
TESTS = [["auth", 0, 3], ["billing", 120, 4], ["search", 40, 2], ["upload", 300, 5], ["export", 10, 1], ["webhook", 200, 3]]

def active_after(weeks):
    live = []
    for t in TESTS:
        live = live + [t]
    for w in range(1, weeks+1):
        worst = 0 - 1
        idx = 0
        for i in range(0, len(live)):
            if live[i][1] > worst:
                worst = live[i][1]
                idx = i
        if worst > 0:
            next_live = []
            for i in range(0, len(live)):
                if not i == idx:
                    next_live = next_live + [live[i]]
            live = next_live
    return live

def pass_permille(live):
    p = 1000
    for t in live:
        p = int(p * (1000 - t[1]) / 1000)
    return p

def defects_gated(live):
    d = 0
    for t in live:
        d = d + t[2]
    return d

def show(pm):
    return str(int(pm / 10)) + "." + str(pm % 10) + "%"

total_defects = 0
for t in TESTS:
    total_defects = total_defects + t[2]
print("week   active tests   suite pass rate   defects still gated")
hist = {}
for w in range(0, 5):
    live = active_after(w)
    p = pass_permille(live)
    d = defects_gated(live)
    hist[str(w)] = [len(live), p, d]
    print("%-6d %-14d %-17s %d/%d" % (w, len(live), show(p), d, total_defects))
print("")
print("tests at the start: " + str(len(TESTS)) + ", defects they gate: " + str(total_defects))
print("")
pass_rising = 0
gated_falling = 0
steps = 0
for w in range(0, 4):
    steps = steps + 1
    if hist[str(w + 1)][1] >= hist[str(w)][1]:
        pass_rising = pass_rising + 1
    if hist[str(w + 1)][2] < hist[str(w)][2]:
        gated_falling = gated_falling + 1
print("weeks where the pass rate rose or held: " + str(pass_rising) + "/" + str(steps))
print("weeks where the defects gated fell:     " + str(gated_falling) + "/" + str(steps))
print("...every week is an improvement by the reported number and a regression by")
print("the unreported one.")
print("")
print("tests in quarantine order, with what each one was gating:")
heavy_first = 0
for w in range(1, 5):
    before = active_after(w - 1)
    after = active_after(w)
    for t in before:
        still = 0
        for u in after:
            if u[0] == t[0]:
                still = 1
        if still == 0:
            print("  week %d: %-9s flake %-7s gated %d defects" % (w, t[0], show(t[1]), t[2]))
            if t[2] >= 3:
                heavy_first = heavy_first + 1
print("quarantined tests that gated 3 or more defects: " + str(heavy_first) + "/4")
print("...a test is flaky because it touches something real, so the flakiest tests")
print("are not a random sample of the suite.")
print("")
print("after 4 weeks: pass rate " + show(hist["4"][1]) + ", defects gated " + str(hist["4"][2]) + "/" + str(total_defects))
lost = hist["0"][2] - hist["4"][2]
print("  behaviours that stopped being checked: " + str(lost))
print("  and the pass rate improved by " + show(hist["4"][1] - hist["0"][1]))
passed = 0
checked = 0
checked = checked + 1
if pass_rising == steps:
    passed = passed + 1
checked = checked + 1
if gated_falling == steps:
    passed = passed + 1
checked = checked + 1
if hist["4"][1] >= 950 and hist["4"][2] < hist["0"][2]:
    passed = passed + 1
checked = checked + 1
if heavy_first >= 3:
    passed = passed + 1
checked = checked + 1
if hist["0"][1] < 600:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Four defensible decisions, a green pipeline, and a third of the gate gone."
else:
    verdict = "FAILED - the quarantine process did not behave as the checks describe."
print(verdict)
print("")
n1 = "Quarantining is the right call for any single flaky test and has no"
print(n1)
n2 = "stopping condition, because the metric it improves is computed over the"
print(n2)
n3 = "tests that remain. The quantity that would stop it - how much of the"
print(n3)
n4 = "system is still gated - is a property of the tests that LEFT, and nothing"
print(n4)
n5 = "in a green pipeline reports on those."
print(n5)
```

## stdout (executed)

```text
week   active tests   suite pass rate   defects still gated
0      6              46.7%             18/18
1      5              66.8%             13/18
2      4              83.5%             10/18
3      3              95.0%             6/18
4      2              99.0%             4/18

tests at the start: 6, defects they gate: 18

weeks where the pass rate rose or held: 4/4
weeks where the defects gated fell:     4/4
...every week is an improvement by the reported number and a regression by
the unreported one.

tests in quarantine order, with what each one was gating:
  week 1: upload    flake 30.0%   gated 5 defects
  week 2: webhook   flake 20.0%   gated 3 defects
  week 3: billing   flake 12.0%   gated 4 defects
  week 4: search    flake 4.0%    gated 2 defects
quarantined tests that gated 3 or more defects: 3/4
...a test is flaky because it touches something real, so the flakiest tests
are not a random sample of the suite.

after 4 weeks: pass rate 99.0%, defects gated 4/18
  behaviours that stopped being checked: 14
  and the pass rate improved by 52.3%

checks passed: 5/5
Four defensible decisions, a green pipeline, and a third of the gate gone.

Quarantining is the right call for any single flaky test and has no
stopping condition, because the metric it improves is computed over the
tests that remain. The quantity that would stop it - how much of the
system is still gated - is a property of the tests that LEFT, and nothing
in a green pipeline reports on those.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
