<!-- canonical: efficientnewlanguage.org/ai/examples/536-the-tool-is-slow-and-the-only-user-is-fast | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 536 — The tool is slow and the only user is fast

`the_tool_is_slow_and_the_only_user_is_fast.eml` - An internal tool takes many steps to do anything. Its recorded task time is good. Who produced that number is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An internal tool
# takes many steps to do anything. Its recorded task time is good. Who produced
# that number is computed below.
#
# The tool works. It has never lost data, it does things no other tool here can
# do, and the person who uses it most has genuinely mastered it - she knows the
# keystroke order, she knows which two screens can be skipped, and she is fast.
# Her speed is real skill and not a trick.
#
# Time-per-task is measured over the people who do the task. One person does
# 94% of them. So the tool's ergonomics are recorded through the one operator
# who has adapted to them completely, and the measurement that would show the
# tool is hard is taken almost entirely from the person it is no longer hard
# for.
#
# Tasks are counted by operator, with the time each one takes.

# [operator, tasks per month, seconds per task, months of practice]
[["the expert", 470, 40, 38], ["second operator", 18, 220, 7], ["occasional a", 6, 480, 2], ["occasional b", 4, 520, 1], ["new starter", 2, 900, 0]] => operators

len(operators) => n
120 => review_threshold_seconds

"operator            tasks/month   seconds/task   months of practice" ^0
for o in operators:
    "  " + o[0] + "   " + str(o[1]) + "           " + str(o[2]) + "             " + str(o[3]) ^0
"" ^0

0 => tasks
0 => seconds
for o in operators:
    tasks + o[1] => tasks
    seconds + o[1] * o[2] => seconds
"tasks a month        : " + str(tasks) ^0
"mean seconds per task, weighted by who does them : " + str(int(seconds / tasks)) ^0
operators[0] => expert
"the expert's share   : " + str(int(expert[1] * 100 / tasks)) + "%" ^0
"" ^0

# ---- the same number computed two ways ----

0 => unweighted
for o in operators:
    unweighted + o[2] => unweighted
"mean seconds per task" ^0
"  weighted by task volume : " + str(int(seconds / tasks)) ^0
"  unweighted across operators : " + str(int(unweighted / n)) ^0
"  ratio : " + str(int(unweighted * tasks / (n * seconds))) + " to 1" ^0
"  the first is what the dashboard shows and the second is closer to what a" ^0
"  person newly asked to do this would experience" ^0
"" ^0

# ---- the rule that would fund the rewrite ----

"the tool is queued for rework when mean task time exceeds " + str(review_threshold_seconds) + " seconds" ^0
0 => over_weighted
if int(seconds / tasks) > review_threshold_seconds:
    1 => over_weighted
0 => operators_over
for o in operators:
    if o[2] > review_threshold_seconds:
        operators_over + 1 => operators_over
"  on the weighted mean (" + str(int(seconds / tasks)) + "s) : " + str(over_weighted) ^0
"  operators for whom a single task exceeds the bar : " + str(operators_over) + " of " + str(n) ^0
if over_weighted == 0:
    "  the rule does not fire, and " + str(operators_over) + " of " + str(n) + " people are over the bar every" ^0
    "  time they touch it" ^0
"" ^0

# ---- practice against speed ----

"seconds per task against months of practice" ^0
for o in operators:
    "  " + str(o[3]) + " months : " + str(o[2]) + "s" ^0
operators[n - 1] => newest
"  from " + str(newest[3]) + " months to " + str(expert[3]) + " months : " + str(newest[2]) + "s to " + str(expert[2]) + "s" ^0
"  a factor of " + str(int(newest[2] / expert[2])) ^0
"  that gradient is the tool's difficulty, expressed as how long it takes to" ^0
"  stop being slowed by it" ^0
"" ^0

# ---- what the tool costs in aggregate ----

int(seconds / 3600) => hours_now
expert[2] * tasks => if_all_expert
int(if_all_expert / 3600) => hours_if_all_expert
"hours a month spent in this tool" ^0
"  as it is                       : " + str(hours_now) ^0
"  if everyone were as fast as her : " + str(hours_if_all_expert) ^0
"  the gap is " + str(hours_now - hours_if_all_expert) + " hours, carried by the " + str(tasks - expert[1]) + " tasks she does not do" ^0
"" ^0

# ---- the concentration is a consequence, not a coincidence ----

"why she does 94% of them" ^0
"  a task takes her " + str(expert[2]) + "s and the second operator " + str(operators[1][2]) + "s" ^0
"  so routing a task to her is " + str(int(operators[1][2] / expert[2])) + " times cheaper, every single time" ^0
"  each individual routing decision is correct" ^0
"  and each one adds to her practice and to nobody else's" ^0
"" ^0

# ---- the control: a tool with no learning curve ----
#
# Where the tool is simple, practice buys almost nothing and the recorded mean
# is the mean anybody would produce.

[["export wizard", 300, 22, 30], ["export wizard", 260, 26, 1]] => flat
"control - a second tool, an experienced and a new operator" ^0
for f in flat:
    "  " + str(f[3]) + " months of practice : " + str(f[2]) + "s per task" ^0
"  spread : " + str(flat[1][2] - flat[0][2]) + "s, against " + str(newest[2] - expert[2]) + "s for the tool above" ^0
"  here who is holding the mouse barely moves the number, so the number is" ^0
"  a measurement of the tool" ^0
"" ^0

"Her speed is real skill and the tool has never lost data. Task time is" ^0
"averaged over whoever does the task, she does " + str(int(expert[1] * 100 / tasks)) + "% of them, and the bar" ^0
"is " + str(review_threshold_seconds) + " seconds against her " + str(expert[2]) + "." ^0
```

## Python (deterministic transpilation)

```python
operators = [["the expert", 470, 40, 38], ["second operator", 18, 220, 7], ["occasional a", 6, 480, 2], ["occasional b", 4, 520, 1], ["new starter", 2, 900, 0]]
n = len(operators)
review_threshold_seconds = 120
print("operator            tasks/month   seconds/task   months of practice")
for o in operators:
    print("  " + o[0] + "   " + str(o[1]) + "           " + str(o[2]) + "             " + str(o[3]))
print("")
tasks = 0
seconds = 0
for o in operators:
    tasks = tasks + o[1]
    seconds = seconds + o[1] * o[2]
print("tasks a month        : " + str(tasks))
print("mean seconds per task, weighted by who does them : " + str(int(seconds / tasks)))
expert = operators[0]
print("the expert's share   : " + str(int(expert[1] * 100 / tasks)) + "%")
print("")
unweighted = 0
for o in operators:
    unweighted = unweighted + o[2]
print("mean seconds per task")
print("  weighted by task volume : " + str(int(seconds / tasks)))
print("  unweighted across operators : " + str(int(unweighted / n)))
print("  ratio : " + str(int(unweighted * tasks / (n * seconds))) + " to 1")
print("  the first is what the dashboard shows and the second is closer to what a")
print("  person newly asked to do this would experience")
print("")
print("the tool is queued for rework when mean task time exceeds " + str(review_threshold_seconds) + " seconds")
over_weighted = 0
if int(seconds / tasks) > review_threshold_seconds:
    over_weighted = 1
operators_over = 0
for o in operators:
    if o[2] > review_threshold_seconds:
        operators_over = operators_over + 1
print("  on the weighted mean (" + str(int(seconds / tasks)) + "s) : " + str(over_weighted))
print("  operators for whom a single task exceeds the bar : " + str(operators_over) + " of " + str(n))
if over_weighted == 0:
    print("  the rule does not fire, and " + str(operators_over) + " of " + str(n) + " people are over the bar every")
    print("  time they touch it")
print("")
print("seconds per task against months of practice")
for o in operators:
    print("  " + str(o[3]) + " months : " + str(o[2]) + "s")
newest = operators[n - 1]
print("  from " + str(newest[3]) + " months to " + str(expert[3]) + " months : " + str(newest[2]) + "s to " + str(expert[2]) + "s")
print("  a factor of " + str(int(newest[2] / expert[2])))
print("  that gradient is the tool's difficulty, expressed as how long it takes to")
print("  stop being slowed by it")
print("")
hours_now = int(seconds / 3600)
if_all_expert = expert[2] * tasks
hours_if_all_expert = int(if_all_expert / 3600)
print("hours a month spent in this tool")
print("  as it is                       : " + str(hours_now))
print("  if everyone were as fast as her : " + str(hours_if_all_expert))
print("  the gap is " + str(hours_now - hours_if_all_expert) + " hours, carried by the " + str(tasks - expert[1]) + " tasks she does not do")
print("")
print("why she does 94% of them")
print("  a task takes her " + str(expert[2]) + "s and the second operator " + str(operators[1][2]) + "s")
print("  so routing a task to her is " + str(int(operators[1][2] / expert[2])) + " times cheaper, every single time")
print("  each individual routing decision is correct")
print("  and each one adds to her practice and to nobody else's")
print("")
flat = [["export wizard", 300, 22, 30], ["export wizard", 260, 26, 1]]
print("control - a second tool, an experienced and a new operator")
for f in flat:
    print("  " + str(f[3]) + " months of practice : " + str(f[2]) + "s per task")
print("  spread : " + str(flat[1][2] - flat[0][2]) + "s, against " + str(newest[2] - expert[2]) + "s for the tool above")
print("  here who is holding the mouse barely moves the number, so the number is")
print("  a measurement of the tool")
print("")
print("Her speed is real skill and the tool has never lost data. Task time is")
print("averaged over whoever does the task, she does " + str(int(expert[1] * 100 / tasks)) + "% of them, and the bar")
print("is " + str(review_threshold_seconds) + " seconds against her " + str(expert[2]) + ".")
```

## stdout (executed)

```text
operator            tasks/month   seconds/task   months of practice
  the expert   470           40             38
  second operator   18           220             7
  occasional a   6           480             2
  occasional b   4           520             1
  new starter   2           900             0

tasks a month        : 500
mean seconds per task, weighted by who does them : 59
the expert's share   : 94%

mean seconds per task
  weighted by task volume : 59
  unweighted across operators : 432
  ratio : 7 to 1
  the first is what the dashboard shows and the second is closer to what a
  person newly asked to do this would experience

the tool is queued for rework when mean task time exceeds 120 seconds
  on the weighted mean (59s) : 0
  operators for whom a single task exceeds the bar : 4 of 5
  the rule does not fire, and 4 of 5 people are over the bar every
  time they touch it

seconds per task against months of practice
  38 months : 40s
  7 months : 220s
  2 months : 480s
  1 months : 520s
  0 months : 900s
  from 0 months to 38 months : 900s to 40s
  a factor of 22
  that gradient is the tool's difficulty, expressed as how long it takes to
  stop being slowed by it

hours a month spent in this tool
  as it is                       : 8
  if everyone were as fast as her : 5
  the gap is 3 hours, carried by the 30 tasks she does not do

why she does 94% of them
  a task takes her 40s and the second operator 220s
  so routing a task to her is 5 times cheaper, every single time
  each individual routing decision is correct
  and each one adds to her practice and to nobody else's

control - a second tool, an experienced and a new operator
  30 months of practice : 22s per task
  1 months of practice : 26s per task
  spread : 4s, against 860s for the tool above
  here who is holding the mouse barely moves the number, so the number is
  a measurement of the tool

Her speed is real skill and the tool has never lost data. Task time is
averaged over whoever does the task, she does 94% of them, and the bar
is 120 seconds against her 40.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
