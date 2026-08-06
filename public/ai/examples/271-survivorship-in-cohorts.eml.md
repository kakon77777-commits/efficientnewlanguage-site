<!-- canonical: efficientnewlanguage.org/ai/examples/271-survivorship-in-cohorts | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 271 — Survivorship in cohorts — satisfaction rises as the product gets worse

`survivorship_in_cohorts.eml` tracks three quantities over eight periods of a steadily worsening product: how many users remain, their average tolerance, and their average headroom.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A satisfaction
# score that rises every quarter while the product gets worse.
#
# Metrics computed over the population that is still here are computed over a
# sample that the thing being measured selected. As a product degrades, the
# users who mind leave; the ones who remain are by definition the ones who mind
# least; so the average tolerance of the remaining users goes UP. The metric is
# not lying and is not miscomputed. It is measuring a different population
# every period, and the selection is done by the variable under study.
#
# Three quantities are tracked per period, all over the same population:
#
#     population       the number still active
#     mean tolerance   average over the SURVIVORS - rises, always
#     mean headroom    tolerance minus the current annoyance, which is what a
#                      satisfaction survey of active users actually measures
#
# The third is the interesting one, because whether it rises or falls is not
# obvious in advance: the annoyance rises for everyone, and the survivors are
# increasingly tolerant. Which effect wins is a measurement, not an argument,
# and this file reports which one did.
#
# Everything is integer. Users have a fixed integer tolerance; a user churns
# in the first period where the annoyance exceeds their tolerance. Nothing is
# random, so the result is a property of the shape rather than of a seed.

def build_users(n):
    # Tolerances spread from 1 to n. A user with tolerance t leaves as soon as
    # annoyance > t, so the population is a step function of annoyance.
    [] => us
    for i in [1:n]:
        us + [i] => us
    return us

def survivors(users, annoyance):
    [] => out
    for t in users:
        if t >= annoyance:
            out + [t] => out
    return out

def mean_x10(xs):
    if len(xs) == 0:
        return 0
    0 => s
    for x in xs:
        s + x => s
    return int(s * 10 / len(xs))

def show10(v):
    return str(int(v / 10)) + "." + str(v % 10)


40 => N
build_users(N) => users

"period  annoyance  population  mean tolerance  mean headroom"^0
{} => hist
[] => tol_series
[] => head_series
[] => pop_series
for p in [1:8]:
    p * 4 => annoy
    survivors(users, annoy) => alive
    mean_x10(alive) => tol
    tol - annoy * 10 => head
    [len(alive), tol, head] => hist[str(p)]
    tol_series + [tol] => tol_series
    head_series + [head] => head_series
    pop_series + [len(alive)] => pop_series
    ("%-7d %-10d %-11d %-15s %s" % (p, annoy, len(alive), show10(tol), show10(head)))^0

""^0
("users at the start: " + str(N))^0
("annoyance rises by 4 every period - the product only ever gets worse")^0

# ------------------------------------------ the three directions
""^0
"direction of each series from first period to last:"^0
0 => tol_rising
0 => pop_falling
0 => head_rising
0 => head_falling
for i in [0:len(tol_series) - 2]:
    if tol_series[i + 1] > tol_series[i]:
        tol_rising + 1 => tol_rising
    if pop_series[i + 1] < pop_series[i]:
        pop_falling + 1 => pop_falling
    if head_series[i + 1] > head_series[i]:
        head_rising + 1 => head_rising
    if head_series[i + 1] < head_series[i]:
        head_falling + 1 => head_falling
len(tol_series) - 1 => steps
("  mean tolerance rose on   " + str(tol_rising) + "/" + str(steps) + " steps")^0
("  population fell on       " + str(pop_falling) + "/" + str(steps) + " steps")^0
("  mean headroom rose on    " + str(head_rising) + "/" + str(steps) + " steps")^0
("  mean headroom fell on    " + str(head_falling) + "/" + str(steps) + " steps")^0

# --------------------------------- the same question asked of everyone
""^0
"the same metric over EVERYONE who ever signed up, not just survivors:"^0
mean_x10(users) => all_tol
("  mean tolerance of the full cohort: " + show10(all_tol) + " (constant - nobody's tolerance changed)")^0
for p in [1, 4, 8]:
    hist[str(p)] => h
    ("  period " + str(p) + ": survivors report " + show10(h[1]) + ", cohort is still " + show10(all_tol))^0
"...the cohort number cannot move, because tolerance is a fact about a user"^0
"and not about a period. Only the sample moved."^0

# -------------------------------- what the churned users would have said
""^0
"mean tolerance of the users who LEFT, by period:"^0
0 => leavers_lower
0 => leaver_periods
for p in [1:8]:
    p * 4 => annoy
    [] => gone
    for t in users:
        if t < annoy:
            gone + [t] => gone
    if len(gone) > 0:
        leaver_periods + 1 => leaver_periods
        mean_x10(gone) => g
        if g < hist[str(p)][1]:
            leavers_lower + 1 => leavers_lower
        ("  period %d: %d left, mean tolerance %s" % (p, len(gone), show10(g)))^0
("periods where the leavers were less tolerant than the stayers: " + str(leavers_lower) + "/" + str(leaver_periods))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Mean tolerance among survivors must rise on EVERY step. Not usually - every
# one, because the selection is deterministic.
checked + 1 => checked
if tol_rising == steps:
    passed + 1 => passed

# The population must fall on every step, so nothing about the rise can be
# explained by the cohort growing.
checked + 1 => checked
if pop_falling == steps:
    passed + 1 => passed

# The full-cohort figure must not move at all. If it did, tolerance would be
# changing and the selection story would have a competitor.
checked + 1 => checked
0 => cohort_stable
for p in [1:8]:
    if mean_x10(users) == all_tol:
        cohort_stable + 1 => cohort_stable
if cohort_stable == 8:
    passed + 1 => passed

# Mean headroom must FALL throughout - the measured answer to the question
# this file could not settle in advance. The survivor bias is real and it is
# not large enough to outrun the annoyance it selects on.
checked + 1 => checked
if head_falling == steps and head_rising == 0:
    passed + 1 => passed

# And the leavers must be less tolerant than the stayers in every period, or
# the mechanism is something other than selection.
checked + 1 => checked
if leavers_lower == leaver_periods and leaver_periods > 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Tolerance rises every period, and nobody became more tolerant." => verdict
else:
    "FAILED - a cohort metric did not behave as the checks describe." => verdict
verdict^0

""^0
"A metric over active users answers a question about a sample chosen by the" => n1
n1^0
"thing being measured, so it will improve as the product loses the people" => n2
n2^0
"who would have dragged it down. What separates the two readings is not a" => n3
n3^0
"better statistic - it is asking the question of the cohort instead of the" => n4
n4^0
"population, which requires having kept the people who left." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def build_users(n):
    us = []
    for i in range(1, n+1):
        us = us + [i]
    return us

def survivors(users, annoyance):
    out = []
    for t in users:
        if t >= annoyance:
            out = out + [t]
    return out

def mean_x10(xs):
    if len(xs) == 0:
        return 0
    s = 0
    for x in xs:
        s = s + x
    return int(s * 10 / len(xs))

def show10(v):
    return str(int(v / 10)) + "." + str(v % 10)

N = 40
users = build_users(N)
print("period  annoyance  population  mean tolerance  mean headroom")
hist = {}
tol_series = []
head_series = []
pop_series = []
for p in range(1, 9):
    annoy = p * 4
    alive = survivors(users, annoy)
    tol = mean_x10(alive)
    head = tol - annoy * 10
    hist[str(p)] = [len(alive), tol, head]
    tol_series = tol_series + [tol]
    head_series = head_series + [head]
    pop_series = pop_series + [len(alive)]
    print("%-7d %-10d %-11d %-15s %s" % (p, annoy, len(alive), show10(tol), show10(head)))
print("")
print("users at the start: " + str(N))
print("annoyance rises by 4 every period - the product only ever gets worse")
print("")
print("direction of each series from first period to last:")
tol_rising = 0
pop_falling = 0
head_rising = 0
head_falling = 0
for i in range(0, len(tol_series) - 2+1):
    if tol_series[i + 1] > tol_series[i]:
        tol_rising = tol_rising + 1
    if pop_series[i + 1] < pop_series[i]:
        pop_falling = pop_falling + 1
    if head_series[i + 1] > head_series[i]:
        head_rising = head_rising + 1
    if head_series[i + 1] < head_series[i]:
        head_falling = head_falling + 1
steps = len(tol_series) - 1
print("  mean tolerance rose on   " + str(tol_rising) + "/" + str(steps) + " steps")
print("  population fell on       " + str(pop_falling) + "/" + str(steps) + " steps")
print("  mean headroom rose on    " + str(head_rising) + "/" + str(steps) + " steps")
print("  mean headroom fell on    " + str(head_falling) + "/" + str(steps) + " steps")
print("")
print("the same metric over EVERYONE who ever signed up, not just survivors:")
all_tol = mean_x10(users)
print("  mean tolerance of the full cohort: " + show10(all_tol) + " (constant - nobody's tolerance changed)")
for p in [1, 4, 8]:
    h = hist[str(p)]
    print("  period " + str(p) + ": survivors report " + show10(h[1]) + ", cohort is still " + show10(all_tol))
print("...the cohort number cannot move, because tolerance is a fact about a user")
print("and not about a period. Only the sample moved.")
print("")
print("mean tolerance of the users who LEFT, by period:")
leavers_lower = 0
leaver_periods = 0
for p in range(1, 9):
    annoy = p * 4
    gone = []
    for t in users:
        if t < annoy:
            gone = gone + [t]
    if len(gone) > 0:
        leaver_periods = leaver_periods + 1
        g = mean_x10(gone)
        if g < hist[str(p)][1]:
            leavers_lower = leavers_lower + 1
        print("  period %d: %d left, mean tolerance %s" % (p, len(gone), show10(g)))
print("periods where the leavers were less tolerant than the stayers: " + str(leavers_lower) + "/" + str(leaver_periods))
passed = 0
checked = 0
checked = checked + 1
if tol_rising == steps:
    passed = passed + 1
checked = checked + 1
if pop_falling == steps:
    passed = passed + 1
checked = checked + 1
cohort_stable = 0
for p in range(1, 9):
    if mean_x10(users) == all_tol:
        cohort_stable = cohort_stable + 1
if cohort_stable == 8:
    passed = passed + 1
checked = checked + 1
if head_falling == steps and head_rising == 0:
    passed = passed + 1
checked = checked + 1
if leavers_lower == leaver_periods and leaver_periods > 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Tolerance rises every period, and nobody became more tolerant."
else:
    verdict = "FAILED - a cohort metric did not behave as the checks describe."
print(verdict)
print("")
n1 = "A metric over active users answers a question about a sample chosen by the"
print(n1)
n2 = "thing being measured, so it will improve as the product loses the people"
print(n2)
n3 = "who would have dragged it down. What separates the two readings is not a"
print(n3)
n4 = "better statistic - it is asking the question of the cohort instead of the"
print(n4)
n5 = "population, which requires having kept the people who left."
print(n5)
```

## stdout (executed)

```text
period  annoyance  population  mean tolerance  mean headroom
1       4          37          22.0            18.0
2       8          33          24.0            16.0
3       12         29          26.0            14.0
4       16         25          28.0            12.0
5       20         21          30.0            10.0
6       24         17          32.0            8.0
7       28         13          34.0            6.0
8       32         9           36.0            4.0

users at the start: 40
annoyance rises by 4 every period - the product only ever gets worse

direction of each series from first period to last:
  mean tolerance rose on   7/7 steps
  population fell on       7/7 steps
  mean headroom rose on    0/7 steps
  mean headroom fell on    7/7 steps

the same metric over EVERYONE who ever signed up, not just survivors:
  mean tolerance of the full cohort: 20.5 (constant - nobody's tolerance changed)
  period 1: survivors report 22.0, cohort is still 20.5
  period 4: survivors report 28.0, cohort is still 20.5
  period 8: survivors report 36.0, cohort is still 20.5
...the cohort number cannot move, because tolerance is a fact about a user
and not about a period. Only the sample moved.

mean tolerance of the users who LEFT, by period:
  period 1: 3 left, mean tolerance 2.0
  period 2: 7 left, mean tolerance 4.0
  period 3: 11 left, mean tolerance 6.0
  period 4: 15 left, mean tolerance 8.0
  period 5: 19 left, mean tolerance 10.0
  period 6: 23 left, mean tolerance 12.0
  period 7: 27 left, mean tolerance 14.0
  period 8: 31 left, mean tolerance 16.0
periods where the leavers were less tolerant than the stayers: 8/8

checks passed: 5/5
Tolerance rises every period, and nobody became more tolerant.

A metric over active users answers a question about a sample chosen by the
thing being measured, so it will improve as the product loses the people
who would have dragged it down. What separates the two readings is not a
better statistic - it is asking the question of the cohort instead of the
population, which requires having kept the people who left.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
