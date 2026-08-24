<!-- canonical: efficientnewlanguage.org/ai/examples/527-the-expert-keeps-the-recovery-time-below-the-threshold | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 527 — The expert keeps the recovery time below the threshold

`the_expert_keeps_the_recovery_time_below_the_threshold.eml` - A module is hard to debug and one engineer is very good at debugging it. What that does to the case for simplifying it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A module is hard
# to debug and one engineer is very good at debugging it. What that does to the
# case for simplifying it is computed below.
#
# She is not hoarding anything. She has written notes, she pairs willingly, she
# has asked twice for time to refactor it, and she answers at 02:00 without
# complaint. Nothing here is about a person behaving badly.
#
# The case for simplification is built from recovery time. Recovery time is
# measured with her in it, because she is always in it. So the module's cost is
# recorded at the level one expert can hold it down to, and the number that
# would justify the work is suppressed by the same thing that makes the work
# feel unnecessary.
#
# Incidents are timed with and without her.

# [incident class, per year, minutes with her, minutes without her, threshold]
[["parser state desync", 9, 22, 260, 120], ["cache key collision", 4, 15, 190, 120], ["retry storm in adapter", 6, 30, 340, 120], ["schema version skew", 3, 40, 400, 120], ["clock drift handling", 2, 25, 300, 120]] => classes

len(classes) => n
classes[0][4] => threshold

"incident class          per year   with her   without her   threshold" ^0
for c in classes:
    "  " + c[0] + "   " + str(c[1]) + "         " + str(c[2]) + " min     " + str(c[3]) + " min      " + str(c[4]) + " min" ^0
"" ^0

0 => events
0 => with_min
0 => without_min
for c in classes:
    events + c[1] => events
    with_min + c[1] * c[2] => with_min
    without_min + c[1] * c[3] => without_min

"incidents a year : " + str(events) ^0
"recovery minutes with her    : " + str(with_min) + ", mean " + str(int(with_min / events)) ^0
"recovery minutes without her : " + str(without_min) + ", mean " + str(int(without_min / events)) ^0
"ratio : " + str(int(without_min / with_min)) + " to 1" ^0
"" ^0

# ---- the rule that decides whether the work happens ----

"the refactor is funded when mean recovery exceeds " + str(threshold) + " minutes" ^0
0 => over_with
0 => over_without
for c in classes:
    if c[2] > threshold:
        over_with + 1 => over_with
    if c[3] > threshold:
        over_without + 1 => over_without
"  classes over the threshold, as measured : " + str(over_with) + " of " + str(n) ^0
"  classes over the threshold, without her : " + str(over_without) + " of " + str(n) ^0
if over_with == 0:
    "  so the rule never fires, and it is reading a real measurement" ^0
"" ^0

# ---- what the measurement contains ----

"what the recorded number is made of" ^0
"  the module's difficulty : unchanged across the whole period" ^0
"  the recorded recovery time : " + str(int(with_min / events)) + " minutes" ^0
"  the same difficulty measured through anyone else : " + str(int(without_min / events)) + " minutes" ^0
"  the metric is a property of the pair, and only one half of the pair is" ^0
"  a property of the system" ^0
"" ^0

# ---- her two requests ----

# [quarter, refactor days requested, granted, mean recovery cited in the decision]
[["Q1", 12, "no", 26], ["Q3", 8, "no", 26]] => asks
"the refactor requests" ^0
for a in asks:
    "  " + a[0] + " : " + str(a[1]) + " days requested, granted: " + a[2] + ", recovery time cited: " + str(a[3]) + " min" ^0
"  both decisions used the measured number and both were consistent with it" ^0
"  neither decision was careless and neither reviewer saw anything wrong" ^0
"" ^0

# ---- the exposure that is not on any dashboard ----

int(without_min / 60) => bad_hours
int(with_min / 60) => good_hours
"the year she is not available" ^0
"  recovery hours as recorded : " + str(good_hours) ^0
"  recovery hours without her : " + str(bad_hours) ^0
"  difference : " + str(bad_hours - good_hours) + " hours" ^0
"  probability she is unavailable in a given year : not estimated anywhere" ^0
"  the exposure is a product of a number nobody computes and a number" ^0
"  nobody has" ^0
"" ^0

# ---- what would measure the module instead of the pair ----

"measurements that do not include her" ^0
"  time for a second engineer to resolve, measured : never" ^0
"  incidents she was deliberately not paged for   : 0" ^0
"  runbook coverage of the five classes           : notes exist, untested" ^0
"  the experiment that would produce the other column is one incident" ^0
"  handled without her on purpose, and it has not been run" ^0
"" ^0

# ---- the control: a module of equal difficulty and two experts ----
#
# Where two people can each resolve it, the recorded time no longer depends on
# one person's availability, and the same rule reads the same system.

[["ledger reconciler", 11, 95, 110, 120]] => shared
for s in shared:
    "control - " + s[0] + ", also difficult, two people know it" ^0
    "  with the first  : " + str(s[2]) + " min" ^0
    "  with the second : " + str(s[3]) + " min" ^0
    "  spread : " + str(s[3] - s[2]) + " min, against " + str(classes[0][3] - classes[0][2]) + " for the first class above" ^0
    "  the recorded number is close to the number anybody would get, so" ^0
    "  when it crosses the threshold it crosses for a reason about the code" ^0
"" ^0

"She has asked twice, pairs willingly and answers at 02:00. The refactor is" ^0
"funded on recovery time, recovery time is measured with her in it, and she" ^0
"holds it at " + str(int(with_min / events)) + " minutes against a " + str(threshold) + "-minute bar." ^0
```

## Python (deterministic transpilation)

```python
classes = [["parser state desync", 9, 22, 260, 120], ["cache key collision", 4, 15, 190, 120], ["retry storm in adapter", 6, 30, 340, 120], ["schema version skew", 3, 40, 400, 120], ["clock drift handling", 2, 25, 300, 120]]
n = len(classes)
threshold = classes[0][4]
print("incident class          per year   with her   without her   threshold")
for c in classes:
    print("  " + c[0] + "   " + str(c[1]) + "         " + str(c[2]) + " min     " + str(c[3]) + " min      " + str(c[4]) + " min")
print("")
events = 0
with_min = 0
without_min = 0
for c in classes:
    events = events + c[1]
    with_min = with_min + c[1] * c[2]
    without_min = without_min + c[1] * c[3]
print("incidents a year : " + str(events))
print("recovery minutes with her    : " + str(with_min) + ", mean " + str(int(with_min / events)))
print("recovery minutes without her : " + str(without_min) + ", mean " + str(int(without_min / events)))
print("ratio : " + str(int(without_min / with_min)) + " to 1")
print("")
print("the refactor is funded when mean recovery exceeds " + str(threshold) + " minutes")
over_with = 0
over_without = 0
for c in classes:
    if c[2] > threshold:
        over_with = over_with + 1
    if c[3] > threshold:
        over_without = over_without + 1
print("  classes over the threshold, as measured : " + str(over_with) + " of " + str(n))
print("  classes over the threshold, without her : " + str(over_without) + " of " + str(n))
if over_with == 0:
    print("  so the rule never fires, and it is reading a real measurement")
print("")
print("what the recorded number is made of")
print("  the module's difficulty : unchanged across the whole period")
print("  the recorded recovery time : " + str(int(with_min / events)) + " minutes")
print("  the same difficulty measured through anyone else : " + str(int(without_min / events)) + " minutes")
print("  the metric is a property of the pair, and only one half of the pair is")
print("  a property of the system")
print("")
asks = [["Q1", 12, "no", 26], ["Q3", 8, "no", 26]]
print("the refactor requests")
for a in asks:
    print("  " + a[0] + " : " + str(a[1]) + " days requested, granted: " + a[2] + ", recovery time cited: " + str(a[3]) + " min")
print("  both decisions used the measured number and both were consistent with it")
print("  neither decision was careless and neither reviewer saw anything wrong")
print("")
bad_hours = int(without_min / 60)
good_hours = int(with_min / 60)
print("the year she is not available")
print("  recovery hours as recorded : " + str(good_hours))
print("  recovery hours without her : " + str(bad_hours))
print("  difference : " + str(bad_hours - good_hours) + " hours")
print("  probability she is unavailable in a given year : not estimated anywhere")
print("  the exposure is a product of a number nobody computes and a number")
print("  nobody has")
print("")
print("measurements that do not include her")
print("  time for a second engineer to resolve, measured : never")
print("  incidents she was deliberately not paged for   : 0")
print("  runbook coverage of the five classes           : notes exist, untested")
print("  the experiment that would produce the other column is one incident")
print("  handled without her on purpose, and it has not been run")
print("")
shared = [["ledger reconciler", 11, 95, 110, 120]]
for s in shared:
    print("control - " + s[0] + ", also difficult, two people know it")
    print("  with the first  : " + str(s[2]) + " min")
    print("  with the second : " + str(s[3]) + " min")
    print("  spread : " + str(s[3] - s[2]) + " min, against " + str(classes[0][3] - classes[0][2]) + " for the first class above")
    print("  the recorded number is close to the number anybody would get, so")
    print("  when it crosses the threshold it crosses for a reason about the code")
print("")
print("She has asked twice, pairs willingly and answers at 02:00. The refactor is")
print("funded on recovery time, recovery time is measured with her in it, and she")
print("holds it at " + str(int(with_min / events)) + " minutes against a " + str(threshold) + "-minute bar.")
```

## stdout (executed)

```text
incident class          per year   with her   without her   threshold
  parser state desync   9         22 min     260 min      120 min
  cache key collision   4         15 min     190 min      120 min
  retry storm in adapter   6         30 min     340 min      120 min
  schema version skew   3         40 min     400 min      120 min
  clock drift handling   2         25 min     300 min      120 min

incidents a year : 24
recovery minutes with her    : 608, mean 25
recovery minutes without her : 6940, mean 289
ratio : 11 to 1

the refactor is funded when mean recovery exceeds 120 minutes
  classes over the threshold, as measured : 0 of 5
  classes over the threshold, without her : 5 of 5
  so the rule never fires, and it is reading a real measurement

what the recorded number is made of
  the module's difficulty : unchanged across the whole period
  the recorded recovery time : 25 minutes
  the same difficulty measured through anyone else : 289 minutes
  the metric is a property of the pair, and only one half of the pair is
  a property of the system

the refactor requests
  Q1 : 12 days requested, granted: no, recovery time cited: 26 min
  Q3 : 8 days requested, granted: no, recovery time cited: 26 min
  both decisions used the measured number and both were consistent with it
  neither decision was careless and neither reviewer saw anything wrong

the year she is not available
  recovery hours as recorded : 10
  recovery hours without her : 115
  difference : 105 hours
  probability she is unavailable in a given year : not estimated anywhere
  the exposure is a product of a number nobody computes and a number
  nobody has

measurements that do not include her
  time for a second engineer to resolve, measured : never
  incidents she was deliberately not paged for   : 0
  runbook coverage of the five classes           : notes exist, untested
  the experiment that would produce the other column is one incident
  handled without her on purpose, and it has not been run

control - ledger reconciler, also difficult, two people know it
  with the first  : 95 min
  with the second : 110 min
  spread : 15 min, against 238 for the first class above
  the recorded number is close to the number anybody would get, so
  when it crosses the threshold it crosses for a reason about the code

She has asked twice, pairs willingly and answers at 02:00. The refactor is
funded on recovery time, recovery time is measured with her in it, and she
holds it at 25 minutes against a 120-minute bar.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
