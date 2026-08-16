<!-- canonical: efficientnewlanguage.org/ai/examples/413-the-second-time-was-faster-and-that-is-all | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 413 — The second time was faster, and that is all - MTTR down 56%, hours down unchanged to the hour

`the_second_time_was_faster_and_that_is_all.eml` computes both quantities from the same incident list so the two kinds of progress can be told apart.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Time to recover
# fell by more than half. What users experienced is computed below, and it did
# not move at all - the two effects cancel to the hour.
#
# Getting faster at recovery is real progress and it is the progress a team can
# actually make: it depends on things they control - runbooks, alerting, access,
# practice - while preventing the incident depends on a cause that may sit in
# someone else's system.
#
# It is also the improvement that a chart of mean time to recover will show,
# and preventing incidents is the improvement that makes that chart shorter by
# having fewer points on it. Both quantities are computed here from the same
# incident list, so the two kinds of progress can be told apart.

# [year, incident, hours to recover]
[[1, "i1", 9], [1, "i2", 11], [1, "i3", 8], [2, "i4", 4], [2, "i5", 3], [2, "i6", 5], [2, "i7", 4], [2, "i8", 3], [2, "i9", 4], [2, "i10", 5]] => incidents

def count(y):
    0 => c
    for i in incidents:
        if i[0] == y:
            c + 1 => c
    return c

def total_hours(y):
    0 => t
    for i in incidents:
        if i[0] == y:
            t + i[2] => t
    return t

def mttr(y):
    return int(total_hours(y) * 10 / count(y))

def show(x):
    return str(int(x / 10)) + "." + str(x % 10)

"year   incidents   mean hours to recover   total hours down" ^0
for y in [1:2]:
    "  " + str(y) + "      " + str(count(y)) + "           " + show(mttr(y)) + "                   " + str(total_hours(y)) ^0
"" ^0

"the improvement the team reports" ^0
"  mean time to recover : " + show(mttr(1)) + " -> " + show(mttr(2)) ^0
"  improvement : " + str(int((mttr(1) - mttr(2)) * 100 / mttr(1))) + "%" ^0
"" ^0

"what the users experienced" ^0
"  total hours down : " + str(total_hours(1)) + " -> " + str(total_hours(2)) ^0
if total_hours(2) > total_hours(1):
    "  worse by " + str(total_hours(2) - total_hours(1)) + " hours" ^0
elif total_hours(2) == total_hours(1):
    "  unchanged - to the hour" ^0
else:
    "  better by " + str(total_hours(1) - total_hours(2)) + " hours" ^0
"" ^0

# ---- the two factors, separated ----

"decomposing the change in total hours" ^0
count(2) - count(1) => more_incidents
"  incidents : " + str(count(1)) + " -> " + str(count(2)) + "  (" + str(more_incidents) + " more)" ^0
"  if the count had stayed at " + str(count(1)) + " with the new recovery time : " + str(int(count(1) * mttr(2) / 10)) ^0
"  if the recovery time had stayed at " + show(mttr(1)) + " with the new count : " + str(int(count(2) * mttr(1) / 10)) ^0
"  actual : " + str(total_hours(2)) ^0
"" ^0

int(count(1) * mttr(2) / 10) => faster_only
int(count(2) * mttr(1) / 10) => more_only
"  recovering faster alone would have given : " + str(faster_only) + " hours" ^0
"  the extra incidents alone would have given : " + str(more_only) + " hours" ^0
if more_only > total_hours(1):
    if faster_only < total_hours(1):
        "  the two pull in opposite directions and the count wins" ^0
"" ^0

# ---- what each chart shows ----

"what each chart shows" ^0
"  mean time to recover : better by " + str(int((mttr(1) - mttr(2)) * 100 / mttr(1))) + "%" ^0
"  incident count       : worse by " + str(int(more_incidents * 100 / count(1))) + "%" ^0
"  hours down           : " + str(int((total_hours(2) - total_hours(1)) * 100 / total_hours(1))) + "% - unchanged" ^0
"  all three are correct, and only one of them is what users felt" ^0
"" ^0

# ---- the control: a year where recovery improved and the count held ----
#
# Faster recovery is not a false improvement. It is the whole improvement when
# the count does not move, and this is what that looks like.

[[3, "j1", 4], [3, "j2", 3], [3, "j3", 5]] => steady
0 => st
for i in steady:
    st + i[2] => st
"control - the same recovery time, the original incident count" ^0
"  incidents : " + str(len(steady)) ^0
"  total hours down : " + str(st) ^0
"  against year 1's " + str(total_hours(1)) ^0
if st < total_hours(1):
    "  here the faster recovery is the entire story, and it is a real one" ^0
"" ^0

"Recovering faster is progress and the chart that shows it is honest. It is" ^0
"an average over incidents, so it says nothing about how many there are, and" ^0
"the thing users experience is the product of both - which here comes out" ^0
"exactly where it started while one chart reports a 56% improvement." ^0
```

## Python (deterministic transpilation)

```python
incidents = [[1, "i1", 9], [1, "i2", 11], [1, "i3", 8], [2, "i4", 4], [2, "i5", 3], [2, "i6", 5], [2, "i7", 4], [2, "i8", 3], [2, "i9", 4], [2, "i10", 5]]

def count(y):
    c = 0
    for i in incidents:
        if i[0] == y:
            c = c + 1
    return c

def total_hours(y):
    t = 0
    for i in incidents:
        if i[0] == y:
            t = t + i[2]
    return t

def mttr(y):
    return int(total_hours(y) * 10 / count(y))

def show(x):
    return str(int(x / 10)) + "." + str(x % 10)

print("year   incidents   mean hours to recover   total hours down")
for y in range(1, 3):
    print("  " + str(y) + "      " + str(count(y)) + "           " + show(mttr(y)) + "                   " + str(total_hours(y)))
print("")
print("the improvement the team reports")
print("  mean time to recover : " + show(mttr(1)) + " -> " + show(mttr(2)))
print("  improvement : " + str(int((mttr(1) - mttr(2)) * 100 / mttr(1))) + "%")
print("")
print("what the users experienced")
print("  total hours down : " + str(total_hours(1)) + " -> " + str(total_hours(2)))
if total_hours(2) > total_hours(1):
    print("  worse by " + str(total_hours(2) - total_hours(1)) + " hours")
elif total_hours(2) == total_hours(1):
    print("  unchanged - to the hour")
else:
    print("  better by " + str(total_hours(1) - total_hours(2)) + " hours")
print("")
print("decomposing the change in total hours")
more_incidents = count(2) - count(1)
print("  incidents : " + str(count(1)) + " -> " + str(count(2)) + "  (" + str(more_incidents) + " more)")
print("  if the count had stayed at " + str(count(1)) + " with the new recovery time : " + str(int(count(1) * mttr(2) / 10)))
print("  if the recovery time had stayed at " + show(mttr(1)) + " with the new count : " + str(int(count(2) * mttr(1) / 10)))
print("  actual : " + str(total_hours(2)))
print("")
faster_only = int(count(1) * mttr(2) / 10)
more_only = int(count(2) * mttr(1) / 10)
print("  recovering faster alone would have given : " + str(faster_only) + " hours")
print("  the extra incidents alone would have given : " + str(more_only) + " hours")
if more_only > total_hours(1):
    if faster_only < total_hours(1):
        print("  the two pull in opposite directions and the count wins")
print("")
print("what each chart shows")
print("  mean time to recover : better by " + str(int((mttr(1) - mttr(2)) * 100 / mttr(1))) + "%")
print("  incident count       : worse by " + str(int(more_incidents * 100 / count(1))) + "%")
print("  hours down           : " + str(int((total_hours(2) - total_hours(1)) * 100 / total_hours(1))) + "% - unchanged")
print("  all three are correct, and only one of them is what users felt")
print("")
steady = [[3, "j1", 4], [3, "j2", 3], [3, "j3", 5]]
st = 0
for i in steady:
    st = st + i[2]
print("control - the same recovery time, the original incident count")
print("  incidents : " + str(len(steady)))
print("  total hours down : " + str(st))
print("  against year 1's " + str(total_hours(1)))
if st < total_hours(1):
    print("  here the faster recovery is the entire story, and it is a real one")
print("")
print("Recovering faster is progress and the chart that shows it is honest. It is")
print("an average over incidents, so it says nothing about how many there are, and")
print("the thing users experience is the product of both - which here comes out")
print("exactly where it started while one chart reports a 56% improvement.")
```

## stdout (executed)

```text
year   incidents   mean hours to recover   total hours down
  1      3           9.3                   28
  2      7           4.0                   28

the improvement the team reports
  mean time to recover : 9.3 -> 4.0
  improvement : 56%

what the users experienced
  total hours down : 28 -> 28
  unchanged - to the hour

decomposing the change in total hours
  incidents : 3 -> 7  (4 more)
  if the count had stayed at 3 with the new recovery time : 12
  if the recovery time had stayed at 9.3 with the new count : 65
  actual : 28

  recovering faster alone would have given : 12 hours
  the extra incidents alone would have given : 65 hours
  the two pull in opposite directions and the count wins

what each chart shows
  mean time to recover : better by 56%
  incident count       : worse by 133%
  hours down           : 0% - unchanged
  all three are correct, and only one of them is what users felt

control - the same recovery time, the original incident count
  incidents : 3
  total hours down : 12
  against year 1's 28
  here the faster recovery is the entire story, and it is a real one

Recovering faster is progress and the chart that shows it is honest. It is
an average over incidents, so it says nothing about how many there are, and
the thing users experience is the product of both - which here comes out
exactly where it started while one chart reports a 56% improvement.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
