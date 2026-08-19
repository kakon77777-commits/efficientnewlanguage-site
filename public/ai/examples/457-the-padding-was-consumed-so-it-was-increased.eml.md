<!-- canonical: efficientnewlanguage.org/ai/examples/457-the-padding-was-consumed-so-it-was-increased | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 457 — The padding was consumed so it was increased

`the_padding_was_consumed_so_it_was_increased.eml` - Estimates kept being exceeded, so they were padded. What happened to the padding, and to the accuracy figure everyone watches, is simulated rather than assumed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Estimates kept
# being exceeded, so they were padded. What happened to the padding, and to the
# accuracy figure everyone watches, is simulated rather than assumed.
#
# Padding after an overrun is the correct response to the evidence. The team
# had been late repeatedly, the estimates were demonstrably too low, and a
# number that is too low is not a plan. Raising it is what the data says to do.
#
# The padding is then available to be spent, and a task with room in it takes
# the room. So an estimate that is comfortably above the work needed is never
# beaten - it is met exactly - and only the tasks that exceed even the padding
# produce a signal, each of which raises the padding again.
#
# The ratchet and the accuracy figure are computed over the same task list.

[8, 12, 9, 15, 10, 11, 20, 9, 10, 13, 9, 11] => work
len(work) => n
2 => pad_step
10 => start_estimate

def spent(estimate, true_days):
    if true_days > estimate:
        return true_days
    return estimate

"tasks : " + str(n) ^0
0 => true_total
for w in work:
    true_total + w => true_total
"days of work actually needed, in total : " + str(true_total) ^0
"starting estimate : " + str(start_estimate) + " days for every task" ^0
"" ^0

# ---- the ratchet ----

start_estimate => est
0 => days_spent
0 => overruns
0 => exact
"task   true   estimate   days spent   verdict" ^0
for i in [0:n - 1]:
    work[i] => w
    spent(est, w) => used
    days_spent + used => days_spent
    "" => verdict
    if w > est:
        overruns + 1 => overruns
        "over, estimate becomes " + str(est + pad_step) => verdict
    else:
        exact + 1 => exact
        "on time" => verdict
    "  " + str(i + 1) + "      " + str(w) + "     " + str(est) + "         " + str(used) + "           " + verdict ^0
    if w > est:
        est + pad_step => est
"" ^0

"estimate at the start : " + str(start_estimate) ^0
"estimate at the end   : " + str(est) ^0
if est > start_estimate:
    "  it rose " + str(est - start_estimate) + " days and never fell, because nothing ever comes in under" ^0
"" ^0

"tasks delivered on time : " + str(exact) + " of " + str(n) ^0
"tasks that overran      : " + str(overruns) + " of " + str(n) ^0
if exact > overruns:
    "  the on-time rate is " + str(int(exact * 100 / n)) + "%, and it is the number reported upward" ^0
"" ^0

# ---- what the days went into ----

"days spent : " + str(days_spent) ^0
"days needed: " + str(true_total) ^0
if days_spent > true_total:
    "  difference : " + str(days_spent - true_total) + " days, which is " + str(int((days_spent - true_total) * 100 / true_total)) + "% on top" ^0
    "  those days were inside estimates that were met exactly" ^0
"" ^0

# ---- the accuracy figure, computed the way it is reported ----
#
# Accuracy is measured as the share of tasks finishing within their estimate.
# That figure improves for the same reason the days grow.

start_estimate => e2
0 => early_ok
0 => late_ok
for i in [0:n - 1]:
    work[i] => w
    0 => ok
    if w <= e2:
        1 => ok
    if i < int(n / 2):
        early_ok + ok => early_ok
    else:
        late_ok + ok => late_ok
    if w > e2:
        e2 + pad_step => e2
"on-time rate, first half against second half" ^0
"  first " + str(int(n / 2)) + " tasks  : " + str(early_ok) + " on time" ^0
"  last " + str(n - int(n / 2)) + " tasks   : " + str(late_ok) + " on time" ^0
if late_ok > early_ok:
    "  reported accuracy improves, by " + str(late_ok - early_ok) + " on the same 6-task base" ^0
"  and the estimate it is accurate against is " + str(est - start_estimate) + " days larger" ^0
"" ^0

# ---- what a fixed estimate would have cost ----
#
# Not padding is not free either. The same tasks against the original estimate
# produce a worse-looking report and fewer wasted days.

start_estimate => fixed
0 => fixed_days
0 => fixed_overruns
for w in work:
    fixed_days + spent(fixed, w) => fixed_days
    if w > fixed:
        fixed_overruns + 1 => fixed_overruns
"the same tasks against a never-raised estimate of " + str(start_estimate) ^0
"  days spent : " + str(fixed_days) ^0
"  overruns   : " + str(fixed_overruns) + " of " + str(n) ^0
if fixed_days < days_spent:
    "  " + str(days_spent - fixed_days) + " fewer days than the ratcheting estimate" ^0
if fixed_overruns > overruns:
    "  and " + str(fixed_overruns - overruns) + " more overruns to report" ^0
"  the policy that looks worse on the report delivered the same work sooner" ^0
"" ^0

# ---- the control: work that cannot expand ----
#
# Where the task ends when it is done rather than when the estimate ends, the
# padding shows up as slack rather than being consumed, and the estimate can
# come down.

0 => hard_days
0 => hard_over
14 => hard_est
for w in work:
    hard_days + w => hard_days
    if w > hard_est:
        hard_over + 1 => hard_over
"control - tasks that stop when the work stops, estimate " + str(hard_est) ^0
"  days spent : " + str(hard_days) ^0
"  overruns   : " + str(hard_over) + " of " + str(n) ^0
if hard_days == true_total:
    "  exactly the work needed, with the estimate still above it" ^0
    "  here padding is visible as slack and can be argued back down" ^0
"" ^0

"Raising an estimate that was repeatedly beaten is the right reading of the" ^0
"evidence. The evidence is generated by tasks that had room in them, and the" ^0
"only ones that report back are the ones the room did not cover." ^0
```

## Python (deterministic transpilation)

```python
work = [8, 12, 9, 15, 10, 11, 20, 9, 10, 13, 9, 11]
n = len(work)
pad_step = 2
start_estimate = 10

def spent(estimate, true_days):
    if true_days > estimate:
        return true_days
    return estimate

print("tasks : " + str(n))
true_total = 0
for w in work:
    true_total = true_total + w
print("days of work actually needed, in total : " + str(true_total))
print("starting estimate : " + str(start_estimate) + " days for every task")
print("")
est = start_estimate
days_spent = 0
overruns = 0
exact = 0
print("task   true   estimate   days spent   verdict")
for i in range(0, n):
    w = work[i]
    used = spent(est, w)
    days_spent = days_spent + used
    verdict = ""
    if w > est:
        overruns = overruns + 1
        verdict = "over, estimate becomes " + str(est + pad_step)
    else:
        exact = exact + 1
        verdict = "on time"
    print("  " + str(i + 1) + "      " + str(w) + "     " + str(est) + "         " + str(used) + "           " + verdict)
    if w > est:
        est = est + pad_step
print("")
print("estimate at the start : " + str(start_estimate))
print("estimate at the end   : " + str(est))
if est > start_estimate:
    print("  it rose " + str(est - start_estimate) + " days and never fell, because nothing ever comes in under")
print("")
print("tasks delivered on time : " + str(exact) + " of " + str(n))
print("tasks that overran      : " + str(overruns) + " of " + str(n))
if exact > overruns:
    print("  the on-time rate is " + str(int(exact * 100 / n)) + "%, and it is the number reported upward")
print("")
print("days spent : " + str(days_spent))
print("days needed: " + str(true_total))
if days_spent > true_total:
    print("  difference : " + str(days_spent - true_total) + " days, which is " + str(int((days_spent - true_total) * 100 / true_total)) + "% on top")
    print("  those days were inside estimates that were met exactly")
print("")
e2 = start_estimate
early_ok = 0
late_ok = 0
for i in range(0, n):
    w = work[i]
    ok = 0
    if w <= e2:
        ok = 1
    if i < int(n / 2):
        early_ok = early_ok + ok
    else:
        late_ok = late_ok + ok
    if w > e2:
        e2 = e2 + pad_step
print("on-time rate, first half against second half")
print("  first " + str(int(n / 2)) + " tasks  : " + str(early_ok) + " on time")
print("  last " + str(n - int(n / 2)) + " tasks   : " + str(late_ok) + " on time")
if late_ok > early_ok:
    print("  reported accuracy improves, by " + str(late_ok - early_ok) + " on the same 6-task base")
print("  and the estimate it is accurate against is " + str(est - start_estimate) + " days larger")
print("")
fixed = start_estimate
fixed_days = 0
fixed_overruns = 0
for w in work:
    fixed_days = fixed_days + spent(fixed, w)
    if w > fixed:
        fixed_overruns = fixed_overruns + 1
print("the same tasks against a never-raised estimate of " + str(start_estimate))
print("  days spent : " + str(fixed_days))
print("  overruns   : " + str(fixed_overruns) + " of " + str(n))
if fixed_days < days_spent:
    print("  " + str(days_spent - fixed_days) + " fewer days than the ratcheting estimate")
if fixed_overruns > overruns:
    print("  and " + str(fixed_overruns - overruns) + " more overruns to report")
print("  the policy that looks worse on the report delivered the same work sooner")
print("")
hard_days = 0
hard_over = 0
hard_est = 14
for w in work:
    hard_days = hard_days + w
    if w > hard_est:
        hard_over = hard_over + 1
print("control - tasks that stop when the work stops, estimate " + str(hard_est))
print("  days spent : " + str(hard_days))
print("  overruns   : " + str(hard_over) + " of " + str(n))
if hard_days == true_total:
    print("  exactly the work needed, with the estimate still above it")
    print("  here padding is visible as slack and can be argued back down")
print("")
print("Raising an estimate that was repeatedly beaten is the right reading of the")
print("evidence. The evidence is generated by tasks that had room in them, and the")
print("only ones that report back are the ones the room did not cover.")
```

## stdout (executed)

```text
tasks : 12
days of work actually needed, in total : 137
starting estimate : 10 days for every task

task   true   estimate   days spent   verdict
  1      8     10         10           on time
  2      12     10         12           over, estimate becomes 12
  3      9     12         12           on time
  4      15     12         15           over, estimate becomes 14
  5      10     14         14           on time
  6      11     14         14           on time
  7      20     14         20           over, estimate becomes 16
  8      9     16         16           on time
  9      10     16         16           on time
  10      13     16         16           on time
  11      9     16         16           on time
  12      11     16         16           on time

estimate at the start : 10
estimate at the end   : 16
  it rose 6 days and never fell, because nothing ever comes in under

tasks delivered on time : 9 of 12
tasks that overran      : 3 of 12
  the on-time rate is 75%, and it is the number reported upward

days spent : 177
days needed: 137
  difference : 40 days, which is 29% on top
  those days were inside estimates that were met exactly

on-time rate, first half against second half
  first 6 tasks  : 4 on time
  last 6 tasks   : 5 on time
  reported accuracy improves, by 1 on the same 6-task base
  and the estimate it is accurate against is 6 days larger

the same tasks against a never-raised estimate of 10
  days spent : 142
  overruns   : 6 of 12
  35 fewer days than the ratcheting estimate
  and 3 more overruns to report
  the policy that looks worse on the report delivered the same work sooner

control - tasks that stop when the work stops, estimate 14
  days spent : 137
  overruns   : 2 of 12
  exactly the work needed, with the estimate still above it
  here padding is visible as slack and can be argued back down

Raising an estimate that was repeatedly beaten is the right reading of the
evidence. The evidence is generated by tasks that had room in them, and the
only ones that report back are the ones the room did not cover.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
