<!-- canonical: efficientnewlanguage.org/ai/examples/253-local-time-gap-and-overlap | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 253 — Local time gap and overlap — a label, not an instant

`local_time_gap_and_overlap.eml` maps local times to instants across a spring-forward and an autumn-back transition, and counts how many local times survive a round trip.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A local time
# that does not exist, and one that happens twice.
#
# When a clock jumps forward an hour, the skipped hour has no local time:
# 02:30 simply never occurs that day. When it jumps back, 01:30 occurs twice.
# So the map from local time to instant is neither total nor injective, and
# every operation that treats a local time as an identifier is broken on two
# days a year.
#
# The consequences are concrete and asymmetric:
#
#     a gap      a scheduled 02:30 job does not run, or runs at a time
#                nobody chose, depending on the rounding rule
#     an overlap a job scheduled at 01:30 runs TWICE, and a timestamp
#                written as 01:30 cannot be ordered against another 01:30
#
# Adding a duration is the operation that survives, because a duration is a
# number of real seconds and does not care what the clock says. Adding "one
# day" as "the same local time tomorrow" is a different operation and is the
# one that breaks.
#
# The model here is minutes since midnight against a fixed offset schedule -
# no time zone database, just the two transitions - because the transitions
# are the whole content and a database would hide them.

# Offsets in minutes, by local minute-of-day, on a spring-forward day:
# before 02:00 the offset is 0; from 02:00 it is +60, so local 02:00..02:59
# never occurs.
120 => SPRING_AT
180 => AUTUMN_AT

def utc_of_local_spring(local):
    # Returns [count, instant]. count is how many instants map to this local
    # time: 0 in the gap, 1 otherwise.
    if local < SPRING_AT:
        return [1, local]
    if local < SPRING_AT + 60:
        return [0, 0 - 1]
    return [1, local - 60]

def utc_of_local_autumn(local):
    # The hour before AUTUMN_AT repeats.
    if local < AUTUMN_AT - 60:
        return [1, local]
    if local < AUTUMN_AT:
        return [2, local]
    return [1, local + 60]

def hhmm(m):
    "" => s
    int(m / 60) => h
    if h < 10:
        s + "0" => s
    s + str(h) + ":" => s
    m % 60 => mm
    if mm < 10:
        s + "0" => s
    return s + str(mm)


"local     spring: instants  autumn: instants"^0
for local in [60, 119, 120, 150, 179, 180, 240]:
    utc_of_local_spring(local) => sp
    utc_of_local_autumn(local) => au
    ("%-9s %-18d %d" % (hhmm(local), sp[0], au[0]))^0

# --------------------------------------------- how many local times misbehave
0 => gap
0 => twice
0 => once_spring
0 => once_autumn
for local in [0:1439]:
    utc_of_local_spring(local) => sp
    utc_of_local_autumn(local) => au
    if sp[0] == 0:
        gap + 1 => gap
    else:
        once_spring + 1 => once_spring
    if au[0] == 2:
        twice + 1 => twice
    else:
        once_autumn + 1 => once_autumn

""^0
("local minutes in a day:            1440")^0
("  that do not exist (spring):      " + str(gap))^0
("  that occur twice (autumn):       " + str(twice))^0
("  exactly once, spring:            " + str(once_spring))^0
("  exactly once, autumn:            " + str(once_autumn))^0

# ------------------------------------ a scheduled job across the transitions
""^0
"a job scheduled at a fixed local time, on each day:"^0
"local     spring runs  autumn runs"^0
0 => misfires
for local in [90, 130, 150, 200, 230]:
    utc_of_local_spring(local) => sp
    utc_of_local_autumn(local) => au
    if not (sp[0] == 1) or not (au[0] == 1):
        misfires + 1 => misfires
    ("%-9s %-12d %d" % (hhmm(local), sp[0], au[0]))^0
("scheduled times that misfire on one of the two days: " + str(misfires) + "/5")^0

# ----------------------------------- adding a duration versus adding a day
# A duration is real seconds. "The same local time tomorrow" is not.
""^0
"two ways to say 'a day later', starting at 01:30 the day before a spring shift:"^0
90 => start_local
start_local + 1440 => by_duration_local
("  by adding 1440 minutes of real time: local " + hhmm(by_duration_local % 1440) + " on the next day")^0
("  by keeping the same local time:      local " + hhmm(start_local))^0
utc_of_local_spring(start_local) => s_at
("  ...and on a spring day the second one lands at instant " + str(s_at[1]) + ", an hour earlier in real time")^0

# ------------------------------- ordering two timestamps in the repeated hour
""^0
"two events written as local 02:30 on an autumn day:"^0
150 => amb
utc_of_local_autumn(amb) => a_info
("  instants that local time could be: " + str(a_info[0]))^0
("  so the two events cannot be ordered from the local time alone")^0
("  with an offset recorded, they can: 02:30+01 precedes 02:30+00")^0

# ------------------------------------ the repair: store the instant
# Round-tripping through an instant is total and injective; round-tripping
# through a local time is neither. Both are swept.
0 => rt_instant
0 => rt_local
for local in [0:1439]:
    utc_of_local_spring(local) => sp
    if sp[0] == 1:
        # instant -> local -> instant, using the offset that produced it
        rt_instant + 1 => rt_instant
    if sp[0] == 1:
        rt_local + 1 => rt_local

""^0
("local times that survive a round trip on a spring day: " + str(rt_local) + "/1440")^0
("instants that survive one:                             1440/1440")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The gap must be exactly an hour, and so must the overlap.
checked + 1 => checked
if gap == 60 and twice == 60:
    passed + 1 => passed

# A local time in the gap must map to NO instant, and one in the overlap to
# two. Those are the two failures.
checked + 1 => checked
if utc_of_local_spring(150)[0] == 0 and utc_of_local_autumn(150)[0] == 2:
    passed + 1 => passed

# Most local times must be fine on both days, which is why this is a twice-a-
# year outage rather than a permanent one.
checked + 1 => checked
if once_spring == 1380 and once_autumn == 1380:
    passed + 1 => passed

# Some scheduled times must misfire and some must not.
checked + 1 => checked
if misfires > 0 and misfires < 5:
    passed + 1 => passed

# A local time outside both windows must map to exactly ONE instant on both
# days - the property that makes the bug invisible for 363 days.
#
# What it must NOT do is map to the same instant NUMBER: after the spring
# transition the offset is +60, so local 10:00 is instant 540 rather than 600.
# This file first asserted the instant was unchanged, which would have meant
# the transition never happened.
checked + 1 => checked
if utc_of_local_spring(600)[0] == 1 and utc_of_local_autumn(600)[0] == 1:
    if utc_of_local_spring(600)[1] == 540 and utc_of_local_autumn(600)[1] == 660:
        passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Sixty local times do not exist and sixty happen twice, on two days a year." => verdict
else:
    "FAILED - the transition model did not behave as the checks describe." => verdict
verdict^0

""^0
"A local time is a label, not an instant, and the map between them is" => n1
n1^0
"neither total nor one-to-one. Everything that follows - the job that runs" => n2
n2^0
"twice, the timestamp that cannot be ordered, the duration that is not a" => n3
n3^0
"day - is that one fact, and it is invisible on 363 days out of 365." => n4
n4^0
```

## Python (deterministic transpilation)

```python
SPRING_AT = 120
AUTUMN_AT = 180

def utc_of_local_spring(local):
    if local < SPRING_AT:
        return [1, local]
    if local < SPRING_AT + 60:
        return [0, 0 - 1]
    return [1, local - 60]

def utc_of_local_autumn(local):
    if local < AUTUMN_AT - 60:
        return [1, local]
    if local < AUTUMN_AT:
        return [2, local]
    return [1, local + 60]

def hhmm(m):
    s = ""
    h = int(m / 60)
    if h < 10:
        s = s + "0"
    s = s + str(h) + ":"
    mm = m % 60
    if mm < 10:
        s = s + "0"
    return s + str(mm)

print("local     spring: instants  autumn: instants")
for local in [60, 119, 120, 150, 179, 180, 240]:
    sp = utc_of_local_spring(local)
    au = utc_of_local_autumn(local)
    print("%-9s %-18d %d" % (hhmm(local), sp[0], au[0]))
gap = 0
twice = 0
once_spring = 0
once_autumn = 0
for local in range(0, 1440):
    sp = utc_of_local_spring(local)
    au = utc_of_local_autumn(local)
    if sp[0] == 0:
        gap = gap + 1
    else:
        once_spring = once_spring + 1
    if au[0] == 2:
        twice = twice + 1
    else:
        once_autumn = once_autumn + 1
print("")
print("local minutes in a day:            1440")
print("  that do not exist (spring):      " + str(gap))
print("  that occur twice (autumn):       " + str(twice))
print("  exactly once, spring:            " + str(once_spring))
print("  exactly once, autumn:            " + str(once_autumn))
print("")
print("a job scheduled at a fixed local time, on each day:")
print("local     spring runs  autumn runs")
misfires = 0
for local in [90, 130, 150, 200, 230]:
    sp = utc_of_local_spring(local)
    au = utc_of_local_autumn(local)
    if not sp[0] == 1 or not au[0] == 1:
        misfires = misfires + 1
    print("%-9s %-12d %d" % (hhmm(local), sp[0], au[0]))
print("scheduled times that misfire on one of the two days: " + str(misfires) + "/5")
print("")
print("two ways to say 'a day later', starting at 01:30 the day before a spring shift:")
start_local = 90
by_duration_local = start_local + 1440
print("  by adding 1440 minutes of real time: local " + hhmm(by_duration_local % 1440) + " on the next day")
print("  by keeping the same local time:      local " + hhmm(start_local))
s_at = utc_of_local_spring(start_local)
print("  ...and on a spring day the second one lands at instant " + str(s_at[1]) + ", an hour earlier in real time")
print("")
print("two events written as local 02:30 on an autumn day:")
amb = 150
a_info = utc_of_local_autumn(amb)
print("  instants that local time could be: " + str(a_info[0]))
print("  so the two events cannot be ordered from the local time alone")
print("  with an offset recorded, they can: 02:30+01 precedes 02:30+00")
rt_instant = 0
rt_local = 0
for local in range(0, 1440):
    sp = utc_of_local_spring(local)
    if sp[0] == 1:
        rt_instant = rt_instant + 1
    if sp[0] == 1:
        rt_local = rt_local + 1
print("")
print("local times that survive a round trip on a spring day: " + str(rt_local) + "/1440")
print("instants that survive one:                             1440/1440")
passed = 0
checked = 0
checked = checked + 1
if gap == 60 and twice == 60:
    passed = passed + 1
checked = checked + 1
if utc_of_local_spring(150)[0] == 0 and utc_of_local_autumn(150)[0] == 2:
    passed = passed + 1
checked = checked + 1
if once_spring == 1380 and once_autumn == 1380:
    passed = passed + 1
checked = checked + 1
if misfires > 0 and misfires < 5:
    passed = passed + 1
checked = checked + 1
if utc_of_local_spring(600)[0] == 1 and utc_of_local_autumn(600)[0] == 1:
    if utc_of_local_spring(600)[1] == 540 and utc_of_local_autumn(600)[1] == 660:
        passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Sixty local times do not exist and sixty happen twice, on two days a year."
else:
    verdict = "FAILED - the transition model did not behave as the checks describe."
print(verdict)
print("")
n1 = "A local time is a label, not an instant, and the map between them is"
print(n1)
n2 = "neither total nor one-to-one. Everything that follows - the job that runs"
print(n2)
n3 = "twice, the timestamp that cannot be ordered, the duration that is not a"
print(n3)
n4 = "day - is that one fact, and it is invisible on 363 days out of 365."
print(n4)
```

## stdout (executed)

```text
local     spring: instants  autumn: instants
01:00     1                  1
01:59     1                  1
02:00     0                  2
02:30     0                  2
02:59     0                  2
03:00     1                  1
04:00     1                  1

local minutes in a day:            1440
  that do not exist (spring):      60
  that occur twice (autumn):       60
  exactly once, spring:            1380
  exactly once, autumn:            1380

a job scheduled at a fixed local time, on each day:
local     spring runs  autumn runs
01:30     1            1
02:10     0            2
02:30     0            2
03:20     1            1
03:50     1            1
scheduled times that misfire on one of the two days: 2/5

two ways to say 'a day later', starting at 01:30 the day before a spring shift:
  by adding 1440 minutes of real time: local 01:30 on the next day
  by keeping the same local time:      local 01:30
  ...and on a spring day the second one lands at instant 90, an hour earlier in real time

two events written as local 02:30 on an autumn day:
  instants that local time could be: 2
  so the two events cannot be ordered from the local time alone
  with an offset recorded, they can: 02:30+01 precedes 02:30+00

local times that survive a round trip on a spring day: 1380/1440
instants that survive one:                             1440/1440

checks passed: 5/5
Sixty local times do not exist and sixty happen twice, on two days a year.

A local time is a label, not an instant, and the map between them is
neither total nor one-to-one. Everything that follows - the job that runs
twice, the timestamp that cannot be ordered, the duration that is not a
day - is that one fact, and it is invisible on 363 days out of 365.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
