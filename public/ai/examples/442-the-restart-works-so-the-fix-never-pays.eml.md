<!-- canonical: efficientnewlanguage.org/ai/examples/442-the-restart-works-so-the-fix-never-pays | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 442 — The restart works so the fix never pays

`the_restart_works_so_the_fix_never_pays.eml` - The process leaks and gets restarted. Whether fixing it pays is computed below rather than assumed either way.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The process leaks
# and gets restarted. Whether fixing it pays is computed below rather than
# assumed either way.
#
# Restarting is a real fix for the thing it is aimed at. It takes four minutes,
# it always works, it needs no review, and it can be done at three in the
# morning by whoever is on call. Against that, a proper repair is three weeks
# of somebody's time in a part of the code nobody has read this year.
#
# The comparison people reach for is "a hack versus a real fix", and on the
# numbers that is not the comparison at all. What the restart does not cover is
# a different quantity from the time it costs, and that is the part the hours
# calculation cannot see.
#
# Both columns are computed from the same incident record.

4 => restart_minutes
2 => restarts_per_week
120 => fix_hours
60 => minutes_per_hour
40 => in_flight_requests_lost_per_restart

def restart_minutes_over(weeks):
    return restart_minutes * restarts_per_week * weeks

def fix_minutes():
    return fix_hours * minutes_per_hour

"one restart          : " + str(restart_minutes) + " minutes" ^0
"restarts per week    : " + str(restarts_per_week) ^0
"the repair           : " + str(fix_hours) + " hours, which is " + str(fix_minutes()) + " minutes" ^0
"" ^0

"weeks    restart minutes so far    repair minutes" ^0
[4, 26, 52, 104, 260] => horizons
for w in horizons:
    "  " + str(w) + "        " + str(restart_minutes_over(w)) + "                      " + str(fix_minutes()) ^0
"" ^0

# ---- when the two lines cross ----

0 => crossover
for w in [1:520]:
    if crossover == 0:
        if restart_minutes_over(w) > fix_minutes():
            w => crossover
if crossover > 0:
    "restarting costs more minutes than repairing after week " + str(crossover) ^0
    "  which is " + str(int(crossover / 52)) + " years and " + str(crossover - int(crossover / 52) * 52) + " weeks" ^0
else:
    "restarting never overtakes the repair inside the window searched" ^0
"" ^0

"at a five-year horizon" ^0
"  restart minutes : " + str(restart_minutes_over(260)) ^0
"  repair minutes  : " + str(fix_minutes()) ^0
if restart_minutes_over(260) < fix_minutes():
    "  the restart is still cheaper, by " + str(fix_minutes() - restart_minutes_over(260)) + " minutes" ^0
    "  so on time alone, not repairing is the correct decision for five years" ^0
else:
    "  the repair has overtaken it by " + str(restart_minutes_over(260) - fix_minutes()) + " minutes" ^0
"" ^0

# ---- the quantity the minutes do not contain ----
#
# A restart drops whatever was in flight. That is not slower, it is different,
# and no amount of the restart being quick makes it stop happening.

"requests dropped, at " + str(in_flight_requests_lost_per_restart) + " per restart" ^0
for w in horizons:
    "  by week " + str(w) + " : " + str(in_flight_requests_lost_per_restart * restarts_per_week * w) ^0
"" ^0

in_flight_requests_lost_per_restart * restarts_per_week * 260 => lost_5y
"over five years : " + str(lost_5y) + " dropped requests" ^0
if lost_5y > 0:
    "  the repair sets this to 0 and the restart cannot, at any speed" ^0
"" ^0

# ---- what the two decisions are actually about ----

"the choice, stated in the units each side is measured in" ^0
"  restart : " + str(restart_minutes_over(260)) + " minutes of on-call time, " + str(lost_5y) + " dropped requests" ^0
"  repair  : " + str(fix_minutes()) + " minutes of engineering time, 0 dropped requests" ^0
"  the two costs are paid by different people out of different budgets, which" ^0
"  is why the comparison keeps being made in minutes" ^0
"" ^0

# ---- what a cheaper partial repair would have to beat ----
#
# The question is not the full repair. It is whether some smaller change
# removes the dropped requests, since that is the column the restart cannot
# touch.

8 => drain_hours
"adding a drain before the restart" ^0
"  cost : " + str(drain_hours) + " hours" ^0
"  dropped requests after : 0" ^0
"  restart minutes after  : " + str(restart_minutes_over(260)) + ", unchanged" ^0
if drain_hours * minutes_per_hour < fix_minutes():
    "  it is " + str(int(fix_minutes() / (drain_hours * minutes_per_hour))) + " times cheaper than the repair and removes the same column" ^0
"" ^0

# ---- the control: an incident where the restart does not work ----
#
# Where restarting does not clear the condition, there is no cheap column and
# the comparison never arises.

0 => stubborn_cleared
3 => stubborn_incidents
"control - an incident the restart does not clear" ^0
"  incidents : " + str(stubborn_incidents) + ", cleared by restarting : " + str(stubborn_cleared) ^0
if stubborn_cleared == 0:
    "  here the repair is the only option, so its cost is not being compared to" ^0
    "  anything and gets approved on the first reading" ^0
"" ^0

"Restarting is quick, reliable and correctly chosen on the minutes. The" ^0
"minutes are not the only column, and the other one does not shrink when the" ^0
"restart gets faster." ^0
```

## Python (deterministic transpilation)

```python
restart_minutes = 4
restarts_per_week = 2
fix_hours = 120
minutes_per_hour = 60
in_flight_requests_lost_per_restart = 40

def restart_minutes_over(weeks):
    return restart_minutes * restarts_per_week * weeks

def fix_minutes():
    return fix_hours * minutes_per_hour

print("one restart          : " + str(restart_minutes) + " minutes")
print("restarts per week    : " + str(restarts_per_week))
print("the repair           : " + str(fix_hours) + " hours, which is " + str(fix_minutes()) + " minutes")
print("")
print("weeks    restart minutes so far    repair minutes")
horizons = [4, 26, 52, 104, 260]
for w in horizons:
    print("  " + str(w) + "        " + str(restart_minutes_over(w)) + "                      " + str(fix_minutes()))
print("")
crossover = 0
for w in range(1, 521):
    if crossover == 0:
        if restart_minutes_over(w) > fix_minutes():
            crossover = w
if crossover > 0:
    print("restarting costs more minutes than repairing after week " + str(crossover))
    print("  which is " + str(int(crossover / 52)) + " years and " + str(crossover - int(crossover / 52) * 52) + " weeks")
else:
    print("restarting never overtakes the repair inside the window searched")
print("")
print("at a five-year horizon")
print("  restart minutes : " + str(restart_minutes_over(260)))
print("  repair minutes  : " + str(fix_minutes()))
if restart_minutes_over(260) < fix_minutes():
    print("  the restart is still cheaper, by " + str(fix_minutes() - restart_minutes_over(260)) + " minutes")
    print("  so on time alone, not repairing is the correct decision for five years")
else:
    print("  the repair has overtaken it by " + str(restart_minutes_over(260) - fix_minutes()) + " minutes")
print("")
print("requests dropped, at " + str(in_flight_requests_lost_per_restart) + " per restart")
for w in horizons:
    print("  by week " + str(w) + " : " + str(in_flight_requests_lost_per_restart * restarts_per_week * w))
print("")
lost_5y = in_flight_requests_lost_per_restart * restarts_per_week * 260
print("over five years : " + str(lost_5y) + " dropped requests")
if lost_5y > 0:
    print("  the repair sets this to 0 and the restart cannot, at any speed")
print("")
print("the choice, stated in the units each side is measured in")
print("  restart : " + str(restart_minutes_over(260)) + " minutes of on-call time, " + str(lost_5y) + " dropped requests")
print("  repair  : " + str(fix_minutes()) + " minutes of engineering time, 0 dropped requests")
print("  the two costs are paid by different people out of different budgets, which")
print("  is why the comparison keeps being made in minutes")
print("")
drain_hours = 8
print("adding a drain before the restart")
print("  cost : " + str(drain_hours) + " hours")
print("  dropped requests after : 0")
print("  restart minutes after  : " + str(restart_minutes_over(260)) + ", unchanged")
if drain_hours * minutes_per_hour < fix_minutes():
    print("  it is " + str(int(fix_minutes() / (drain_hours * minutes_per_hour))) + " times cheaper than the repair and removes the same column")
print("")
stubborn_cleared = 0
stubborn_incidents = 3
print("control - an incident the restart does not clear")
print("  incidents : " + str(stubborn_incidents) + ", cleared by restarting : " + str(stubborn_cleared))
if stubborn_cleared == 0:
    print("  here the repair is the only option, so its cost is not being compared to")
    print("  anything and gets approved on the first reading")
print("")
print("Restarting is quick, reliable and correctly chosen on the minutes. The")
print("minutes are not the only column, and the other one does not shrink when the")
print("restart gets faster.")
```

## stdout (executed)

```text
one restart          : 4 minutes
restarts per week    : 2
the repair           : 120 hours, which is 7200 minutes

weeks    restart minutes so far    repair minutes
  4        32                      7200
  26        208                      7200
  52        416                      7200
  104        832                      7200
  260        2080                      7200

restarting never overtakes the repair inside the window searched

at a five-year horizon
  restart minutes : 2080
  repair minutes  : 7200
  the restart is still cheaper, by 5120 minutes
  so on time alone, not repairing is the correct decision for five years

requests dropped, at 40 per restart
  by week 4 : 320
  by week 26 : 2080
  by week 52 : 4160
  by week 104 : 8320
  by week 260 : 20800

over five years : 20800 dropped requests
  the repair sets this to 0 and the restart cannot, at any speed

the choice, stated in the units each side is measured in
  restart : 2080 minutes of on-call time, 20800 dropped requests
  repair  : 7200 minutes of engineering time, 0 dropped requests
  the two costs are paid by different people out of different budgets, which
  is why the comparison keeps being made in minutes

adding a drain before the restart
  cost : 8 hours
  dropped requests after : 0
  restart minutes after  : 2080, unchanged
  it is 15 times cheaper than the repair and removes the same column

control - an incident the restart does not clear
  incidents : 3, cleared by restarting : 0
  here the repair is the only option, so its cost is not being compared to
  anything and gets approved on the first reading

Restarting is quick, reliable and correctly chosen on the minutes. The
minutes are not the only column, and the other one does not shrink when the
restart gets faster.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
