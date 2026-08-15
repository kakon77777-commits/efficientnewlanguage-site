<!-- canonical: efficientnewlanguage.org/ai/examples/401-the-work-moved-to-where-nobody-measures | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 401 — The work moved to where nobody measures - chart says 66% better, system is 9 worse

`the_work_moved_to_where_nobody_measures.eml` runs the same job list under both routings, so the comparison is between two policies rather than two measurements.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Stage A got
# faster. The dashboard has a chart for stage A.
#
# Instrumenting A first was the right order. A is the stage users wait on, it
# was the one people complained about, and building one good chart beats
# building six mediocre ones. Nothing about the instrumentation is wrong.
#
# The repair that follows is also reasonable: work that does not have to happen
# while the user waits is deferred to B. That is a real technique and it really
# does help - when B has slack. Whether B has slack is a fact about B, and B is
# the stage with no chart.
#
# Every number below is computed from the same job list under both routings, so
# the comparison is between two policies, not two measurements.

# [job, cost_in_A, cost_if_deferred_to_B]
[["j1", 6, 7], ["j2", 4, 5], ["j3", 9, 11], ["j4", 3, 3], ["j5", 8, 10], ["j6", 5, 6], ["j7", 7, 9], ["j8", 2, 2], ["j9", 6, 8], ["j10", 4, 5]] => jobs

# Deferrable work is the part that does not block the reply.
["j1", "j3", "j5", "j7", "j9"] => deferrable

def is_deferred(name, policy):
    if policy == 0:
        return 0
    for d in deferrable:
        if d == name:
            return 1
    return 0

def stage_a(policy):
    0 => t
    for j in jobs:
        if is_deferred(j[0], policy) == 0:
            t + j[1] => t
    return t

def stage_b(policy):
    0 => t
    for j in jobs:
        if is_deferred(j[0], policy) == 1:
            t + j[2] => t
    return t

def total(policy):
    return stage_a(policy) + stage_b(policy)

"before - everything runs in A" ^0
"  stage A : " + str(stage_a(0)) ^0
"  stage B : " + str(stage_b(0)) ^0
"  total   : " + str(total(0)) ^0
"" ^0

"after - deferrable work moved to B" ^0
"  stage A : " + str(stage_a(1)) ^0
"  stage B : " + str(stage_b(1)) ^0
"  total   : " + str(total(1)) ^0
"" ^0

"what the dashboard shows, which is stage A" ^0
"  before : " + str(stage_a(0)) ^0
"  after  : " + str(stage_a(1)) ^0
"  improvement : " + str(int((stage_a(0) - stage_a(1)) * 100 / stage_a(0))) + "%" ^0
"" ^0

"what the system does" ^0
"  before : " + str(total(0)) ^0
"  after  : " + str(total(1)) ^0
if total(1) > total(0):
    "  worse by : " + str(total(1) - total(0)) ^0
    "  the work costs more where it landed, and B has no chart" ^0
"" ^0

# ---- the cost of the move, job by job ----

"deferred jobs, and what the move cost each" ^0
0 => extra
for j in jobs:
    if is_deferred(j[0], 1) == 1:
        j[2] - j[1] => d
        extra + d => extra
        "  " + j[0] + " : " + str(j[1]) + " in A -> " + str(j[2]) + " in B  (+" + str(d) + ")" ^0
"  total added : " + str(extra) ^0
if extra == total(1) - total(0):
    "  and that is exactly the whole regression" ^0
"" ^0

# ---- how much of the improvement is real ----

stage_a(0) - stage_a(1) => shown
total(0) - total(1) => real
"  improvement the chart reports : " + str(shown) ^0
"  improvement the system got    : " + str(real) ^0
"  difference                    : " + str(shown - real) ^0
"" ^0

# ---- the control: deferring work that is CHEAPER in B ----
#
# Moving work is not the defect. Moving it somewhere it costs more is, and the
# chart cannot tell those two apart because it only sees the origin.

[["k1", 6, 4], ["k2", 9, 6], ["k3", 3, 3], ["k4", 8, 5]] => cheap_jobs
def cheap_a(policy):
    0 => t
    for j in cheap_jobs:
        if policy == 0:
            t + j[1] => t
    return t
def cheap_b(policy):
    0 => t
    for j in cheap_jobs:
        if policy == 1:
            t + j[2] => t
    return t

"control - the same move, where B is genuinely cheaper" ^0
"  before total : " + str(cheap_a(0) + cheap_b(0)) ^0
"  after total  : " + str(cheap_a(1) + cheap_b(1)) ^0
if cheap_a(1) + cheap_b(1) < cheap_a(0) + cheap_b(0):
    "  here the chart and the system agree, and both improved" ^0
"" ^0

"The chart measures a stage. The improvement was measured on the stage and" ^0
"paid for somewhere the measurement does not reach." ^0
```

## Python (deterministic transpilation)

```python
jobs = [["j1", 6, 7], ["j2", 4, 5], ["j3", 9, 11], ["j4", 3, 3], ["j5", 8, 10], ["j6", 5, 6], ["j7", 7, 9], ["j8", 2, 2], ["j9", 6, 8], ["j10", 4, 5]]
deferrable = ["j1", "j3", "j5", "j7", "j9"]

def is_deferred(name, policy):
    if policy == 0:
        return 0
    for d in deferrable:
        if d == name:
            return 1
    return 0

def stage_a(policy):
    t = 0
    for j in jobs:
        if is_deferred(j[0], policy) == 0:
            t = t + j[1]
    return t

def stage_b(policy):
    t = 0
    for j in jobs:
        if is_deferred(j[0], policy) == 1:
            t = t + j[2]
    return t

def total(policy):
    return stage_a(policy) + stage_b(policy)

print("before - everything runs in A")
print("  stage A : " + str(stage_a(0)))
print("  stage B : " + str(stage_b(0)))
print("  total   : " + str(total(0)))
print("")
print("after - deferrable work moved to B")
print("  stage A : " + str(stage_a(1)))
print("  stage B : " + str(stage_b(1)))
print("  total   : " + str(total(1)))
print("")
print("what the dashboard shows, which is stage A")
print("  before : " + str(stage_a(0)))
print("  after  : " + str(stage_a(1)))
print("  improvement : " + str(int((stage_a(0) - stage_a(1)) * 100 / stage_a(0))) + "%")
print("")
print("what the system does")
print("  before : " + str(total(0)))
print("  after  : " + str(total(1)))
if total(1) > total(0):
    print("  worse by : " + str(total(1) - total(0)))
    print("  the work costs more where it landed, and B has no chart")
print("")
print("deferred jobs, and what the move cost each")
extra = 0
for j in jobs:
    if is_deferred(j[0], 1) == 1:
        d = j[2] - j[1]
        extra = extra + d
        print("  " + j[0] + " : " + str(j[1]) + " in A -> " + str(j[2]) + " in B  (+" + str(d) + ")")
print("  total added : " + str(extra))
if extra == total(1) - total(0):
    print("  and that is exactly the whole regression")
print("")
shown = stage_a(0) - stage_a(1)
real = total(0) - total(1)
print("  improvement the chart reports : " + str(shown))
print("  improvement the system got    : " + str(real))
print("  difference                    : " + str(shown - real))
print("")
cheap_jobs = [["k1", 6, 4], ["k2", 9, 6], ["k3", 3, 3], ["k4", 8, 5]]

def cheap_a(policy):
    t = 0
    for j in cheap_jobs:
        if policy == 0:
            t = t + j[1]
    return t

def cheap_b(policy):
    t = 0
    for j in cheap_jobs:
        if policy == 1:
            t = t + j[2]
    return t

print("control - the same move, where B is genuinely cheaper")
print("  before total : " + str(cheap_a(0) + cheap_b(0)))
print("  after total  : " + str(cheap_a(1) + cheap_b(1)))
if cheap_a(1) + cheap_b(1) < cheap_a(0) + cheap_b(0):
    print("  here the chart and the system agree, and both improved")
print("")
print("The chart measures a stage. The improvement was measured on the stage and")
print("paid for somewhere the measurement does not reach.")
```

## stdout (executed)

```text
before - everything runs in A
  stage A : 54
  stage B : 0
  total   : 54

after - deferrable work moved to B
  stage A : 18
  stage B : 45
  total   : 63

what the dashboard shows, which is stage A
  before : 54
  after  : 18
  improvement : 66%

what the system does
  before : 54
  after  : 63
  worse by : 9
  the work costs more where it landed, and B has no chart

deferred jobs, and what the move cost each
  j1 : 6 in A -> 7 in B  (+1)
  j3 : 9 in A -> 11 in B  (+2)
  j5 : 8 in A -> 10 in B  (+2)
  j7 : 7 in A -> 9 in B  (+2)
  j9 : 6 in A -> 8 in B  (+2)
  total added : 9
  and that is exactly the whole regression

  improvement the chart reports : 36
  improvement the system got    : -9
  difference                    : 45

control - the same move, where B is genuinely cheaper
  before total : 26
  after total  : 18
  here the chart and the system agree, and both improved

The chart measures a stage. The improvement was measured on the stage and
paid for somewhere the measurement does not reach.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
