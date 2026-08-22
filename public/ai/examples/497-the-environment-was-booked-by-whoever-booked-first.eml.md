<!-- canonical: efficientnewlanguage.org/ai/examples/497-the-environment-was-booked-by-whoever-booked-first | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 497 — The environment was booked by whoever booked first

`the_environment_was_booked_by_whoever_booked_first.eml` - One staging environment, booked first-come. Who gets it and who needs it are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One staging
# environment, booked first-come. Who gets it and who needs it are computed
# below.
#
# First-come is the right default for a shared resource. It needs no judge, it
# cannot be gamed by arguing, everybody understands it, and any scheme that
# ranks bookings by importance needs somebody to rank them and somebody to
# appeal to. Nobody was treated unfairly by the calendar.
#
# First-come ranks by when you look at the calendar. That is a fact about
# working hours, planning habits and how far ahead a team knows its schedule,
# and none of those is how much the booking is worth.
#
# Bookings and blocked work are counted per team.

# [team, bookings won, hours held, plans this far ahead in days, value of what needed the environment]
[["release eng", 14, 56, 10, 3], ["platform", 11, 44, 8, 4], ["payments", 3, 12, 2, 9], ["mobile", 2, 8, 1, 8], ["data", 5, 20, 5, 5], ["security", 1, 4, 1, 10]] => teams

len(teams) => n
0 => total_hours
0 => total_bookings
for t in teams:
    total_hours + t[2] => total_hours
    total_bookings + t[1] => total_bookings

"teams : " + str(n) ^0
"bookings this quarter : " + str(total_bookings) + ", hours : " + str(total_hours) ^0
"" ^0
"team           bookings   hours   plans ahead   value of the work" ^0
for t in teams:
    "  " + t[0] + "   " + str(t[1]) + "         " + str(t[2]) + "      " + str(t[3]) + " days       " + str(t[4]) ^0
"" ^0

# ---- hours against planning horizon, and against value ----

"hours held, by planning horizon" ^0
0 => far_hours
0 => near_hours
for t in teams:
    if t[3] >= 5:
        far_hours + t[2] => far_hours
    else:
        near_hours + t[2] => near_hours
"  teams that plan 5+ days ahead : " + str(far_hours) + " hours" ^0
"  teams that plan under 5 days  : " + str(near_hours) + " hours" ^0
if far_hours > near_hours:
    "  the long-horizon teams hold " + str(int(far_hours * 100 / total_hours)) + "% of the environment" ^0
"" ^0

"hours held, by the value of the work" ^0
0 => high_hours
0 => low_hours
0 => high_v
0 => low_v
for t in teams:
    if t[4] >= 7:
        high_hours + t[2] => high_hours
        high_v + 1 => high_v
    else:
        low_hours + t[2] => low_hours
        low_v + 1 => low_v
"  teams whose work scores 7 or above : " + str(high_v) + " team(s), " + str(high_hours) + " hours" ^0
"  teams below 7                      : " + str(low_v) + " team(s), " + str(low_hours) + " hours" ^0
if low_hours > high_hours:
    "  the lower-value work holds " + str(int(low_hours * 100 / total_hours)) + "% of the hours" ^0
"" ^0

# ---- the correlation that produces it ----

"what predicts hours held" ^0
"  planning horizon : long horizon, more hours" ^0
"  value of the work: no relationship visible in this quarter" ^0
"  a team that knows next week's schedule books next week; a team responding" ^0
"  to something books today, and today is taken" ^0
"" ^0

# ---- who cannot plan ahead ----

"why the short-horizon teams are short-horizon" ^0
for t in teams:
    if t[3] <= 2:
        "  " + t[0] + " : " + str(t[3]) + " day(s), work value " + str(t[4]) ^0
"  security and incident-driven work cannot be scheduled ten days out, and" ^0
"  that is a property of the work rather than of the team" ^0
"" ^0

# ---- what a small reservation would change ----

8 => reserved
"holding back " + str(reserved) + " hours a quarter for same-week booking" ^0
"  hours removed from open booking : " + str(reserved) + " of " + str(total_hours) ^0
"  which is " + str(int(reserved * 100 / total_hours)) + "%" ^0
0 => short_teams
for t in teams:
    if t[3] <= 2:
        short_teams + 1 => short_teams
"  teams it would serve : " + str(short_teams) ^0
"  first-come still applies inside the reserved block, so no judge is added" ^0
"  and nobody has to rank anybody" ^0
"" ^0

# ---- the control: an environment nobody contends for ----
#
# Where supply exceeds demand, first-come allocates nothing, because nobody is
# ever refused.

"control - a second environment with spare capacity" ^0
"  bookings refused : 0" ^0
"  hours contended  : 0" ^0
"  first-come and any other scheme give the same result here, so the policy" ^0
"  is only doing work when the thing is scarce" ^0
"" ^0

"First-come needs no judge and cannot be argued with, which is why it is the" ^0
"right default. It orders by when a team looks at the calendar, and the teams" ^0
"that cannot look early are the ones whose work arrives without warning." ^0
```

## Python (deterministic transpilation)

```python
teams = [["release eng", 14, 56, 10, 3], ["platform", 11, 44, 8, 4], ["payments", 3, 12, 2, 9], ["mobile", 2, 8, 1, 8], ["data", 5, 20, 5, 5], ["security", 1, 4, 1, 10]]
n = len(teams)
total_hours = 0
total_bookings = 0
for t in teams:
    total_hours = total_hours + t[2]
    total_bookings = total_bookings + t[1]
print("teams : " + str(n))
print("bookings this quarter : " + str(total_bookings) + ", hours : " + str(total_hours))
print("")
print("team           bookings   hours   plans ahead   value of the work")
for t in teams:
    print("  " + t[0] + "   " + str(t[1]) + "         " + str(t[2]) + "      " + str(t[3]) + " days       " + str(t[4]))
print("")
print("hours held, by planning horizon")
far_hours = 0
near_hours = 0
for t in teams:
    if t[3] >= 5:
        far_hours = far_hours + t[2]
    else:
        near_hours = near_hours + t[2]
print("  teams that plan 5+ days ahead : " + str(far_hours) + " hours")
print("  teams that plan under 5 days  : " + str(near_hours) + " hours")
if far_hours > near_hours:
    print("  the long-horizon teams hold " + str(int(far_hours * 100 / total_hours)) + "% of the environment")
print("")
print("hours held, by the value of the work")
high_hours = 0
low_hours = 0
high_v = 0
low_v = 0
for t in teams:
    if t[4] >= 7:
        high_hours = high_hours + t[2]
        high_v = high_v + 1
    else:
        low_hours = low_hours + t[2]
        low_v = low_v + 1
print("  teams whose work scores 7 or above : " + str(high_v) + " team(s), " + str(high_hours) + " hours")
print("  teams below 7                      : " + str(low_v) + " team(s), " + str(low_hours) + " hours")
if low_hours > high_hours:
    print("  the lower-value work holds " + str(int(low_hours * 100 / total_hours)) + "% of the hours")
print("")
print("what predicts hours held")
print("  planning horizon : long horizon, more hours")
print("  value of the work: no relationship visible in this quarter")
print("  a team that knows next week's schedule books next week; a team responding")
print("  to something books today, and today is taken")
print("")
print("why the short-horizon teams are short-horizon")
for t in teams:
    if t[3] <= 2:
        print("  " + t[0] + " : " + str(t[3]) + " day(s), work value " + str(t[4]))
print("  security and incident-driven work cannot be scheduled ten days out, and")
print("  that is a property of the work rather than of the team")
print("")
reserved = 8
print("holding back " + str(reserved) + " hours a quarter for same-week booking")
print("  hours removed from open booking : " + str(reserved) + " of " + str(total_hours))
print("  which is " + str(int(reserved * 100 / total_hours)) + "%")
short_teams = 0
for t in teams:
    if t[3] <= 2:
        short_teams = short_teams + 1
print("  teams it would serve : " + str(short_teams))
print("  first-come still applies inside the reserved block, so no judge is added")
print("  and nobody has to rank anybody")
print("")
print("control - a second environment with spare capacity")
print("  bookings refused : 0")
print("  hours contended  : 0")
print("  first-come and any other scheme give the same result here, so the policy")
print("  is only doing work when the thing is scarce")
print("")
print("First-come needs no judge and cannot be argued with, which is why it is the")
print("right default. It orders by when a team looks at the calendar, and the teams")
print("that cannot look early are the ones whose work arrives without warning.")
```

## stdout (executed)

```text
teams : 6
bookings this quarter : 36, hours : 144

team           bookings   hours   plans ahead   value of the work
  release eng   14         56      10 days       3
  platform   11         44      8 days       4
  payments   3         12      2 days       9
  mobile   2         8      1 days       8
  data   5         20      5 days       5
  security   1         4      1 days       10

hours held, by planning horizon
  teams that plan 5+ days ahead : 120 hours
  teams that plan under 5 days  : 24 hours
  the long-horizon teams hold 83% of the environment

hours held, by the value of the work
  teams whose work scores 7 or above : 3 team(s), 24 hours
  teams below 7                      : 3 team(s), 120 hours
  the lower-value work holds 83% of the hours

what predicts hours held
  planning horizon : long horizon, more hours
  value of the work: no relationship visible in this quarter
  a team that knows next week's schedule books next week; a team responding
  to something books today, and today is taken

why the short-horizon teams are short-horizon
  payments : 2 day(s), work value 9
  mobile : 1 day(s), work value 8
  security : 1 day(s), work value 10
  security and incident-driven work cannot be scheduled ten days out, and
  that is a property of the work rather than of the team

holding back 8 hours a quarter for same-week booking
  hours removed from open booking : 8 of 144
  which is 5%
  teams it would serve : 3
  first-come still applies inside the reserved block, so no judge is added
  and nobody has to rank anybody

control - a second environment with spare capacity
  bookings refused : 0
  hours contended  : 0
  first-come and any other scheme give the same result here, so the policy
  is only doing work when the thing is scarce

First-come needs no judge and cannot be argued with, which is why it is the
right default. It orders by when a team looks at the calendar, and the teams
that cannot look early are the ones whose work arrives without warning.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
