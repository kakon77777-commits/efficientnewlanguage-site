<!-- canonical: efficientnewlanguage.org/ai/examples/765-the-drill-was-run-on-a-tuesday-afternoon | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 765 — The drill was run on a tuesday afternoon

`the_drill_was_run_on_a_tuesday_afternoon.eml` - The regional failover is drilled every quarter with real traffic, timed end to end, and the recovery time has been under half an hour every time. When the drills happen is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The regional
# failover is drilled every quarter with real traffic, timed end to end, and the
# recovery time has been under half an hour every time. When the drills happen
# is computed below.
#
# The drill is not a tabletop. Traffic is actually shifted to the secondary
# region and served from it for an hour; the primary is actually made
# unreachable rather than politely drained; the clock runs from the moment the
# first alert fires to the moment error rates return to baseline; and a drill
# that misses the target is a finding rather than a rounding.
#
# Every drill so far has begun on a weekday afternoon with the team assembled.
# The event it stands in for does not choose its hour.

16 => drills_run
4 => years_of_drills
22 => mean_drill_recovery_minutes
9 => engineers_in_the_room_during_a_drill
2 => engineers_reachable_at_0340_on_a_holiday
31 => steps_in_the_failover_runbook
6 => steps_that_require_a_second_approver
2 => approvers_a_two_approver_step_needs
1 => approvers_on_the_rota_at_night
4 => decisions_the_runbook_leaves_to_judgement
1 => real_failovers
96 => real_failover_minutes
0 => drills_begun_outside_working_hours

engineers_in_the_room_during_a_drill - engineers_reachable_at_0340_on_a_holiday => engineers_the_drill_had_and_the_night_does_not
steps_in_the_failover_runbook - steps_that_require_a_second_approver => steps_one_person_can_take
# Approvers minus approvers. The earlier form here subtracted approvers from
# steps, which is not a quantity: a step needing two people does not become
# fractionally unblocked by one of them being awake. Every such step waits, and
# what is short is a person.
approvers_a_two_approver_step_needs - approvers_on_the_rota_at_night => approvers_short_at_night
steps_that_require_a_second_approver => steps_that_wait_at_night
real_failover_minutes - mean_drill_recovery_minutes => minutes_the_real_one_took_beyond_the_drill
int(real_failover_minutes * 10000 / mean_drill_recovery_minutes) => real_against_drill_per_myriad
int(engineers_reachable_at_0340_on_a_holiday * 10000 / engineers_in_the_room_during_a_drill) => roster_present_at_night_per_myriad
int(steps_that_require_a_second_approver * 10000 / steps_in_the_failover_runbook) => steps_needing_two_per_myriad

"drills run                      : " + str(drills_run) ^0
"  years of drills               : " + str(years_of_drills) ^0
"  begun outside working hours   : " + str(drills_begun_outside_working_hours) ^0
"  mean recovery, minutes        : " + str(mean_drill_recovery_minutes) ^0
"" ^0
"engineers in the room, a drill  : " + str(engineers_in_the_room_during_a_drill) ^0
"  reachable at 0340 on a holiday: " + str(engineers_reachable_at_0340_on_a_holiday) ^0
"  the difference                : " + str(engineers_the_drill_had_and_the_night_does_not) ^0
"  roster present at night       : " + str(roster_present_at_night_per_myriad) + " per ten thousand" ^0
"" ^0
"steps in the failover runbook   : " + str(steps_in_the_failover_runbook) ^0
"  needing a second approver     : " + str(steps_that_require_a_second_approver) ^0
"  share needing two             : " + str(steps_needing_two_per_myriad) + " per ten thousand" ^0
"  approvers on the night rota   : " + str(approvers_on_the_rota_at_night) ^0
"  approvers such a step needs   : " + str(approvers_a_two_approver_step_needs) ^0
"  approvers short at night      : " + str(approvers_short_at_night) ^0
"  steps that wait at night      : " + str(steps_that_wait_at_night) ^0
"  one person can take           : " + str(steps_one_person_can_take) ^0
"decisions left to judgement     : " + str(decisions_the_runbook_leaves_to_judgement) ^0
"" ^0
"real failovers                  : " + str(real_failovers) ^0
"  minutes                       : " + str(real_failover_minutes) ^0
"  beyond the drill mean         : " + str(minutes_the_real_one_took_beyond_the_drill) ^0
"  against the drill             : " + str(real_against_drill_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the drill verified ----

"the failover drill" ^0
"  traffic : actually shifted and served from the" ^0
"    secondary for an hour" ^0
"  the primary : actually made unreachable, not drained" ^0
"  the clock : from the first alert to error rates back" ^0
"    at baseline" ^0
"  a miss : recorded as a finding, not rounded" ^0
"  runs : " + str(drills_run) + " over " + str(years_of_drills) + " years, mean " + str(mean_drill_recovery_minutes) + " minutes" ^0
"  verdict : RECOVERS" ^0
"" ^0
"  making the primary genuinely unreachable rather than" ^0
"  draining it is the part almost nobody does, and it is" ^0
"  why the " + str(mean_drill_recovery_minutes) + " minutes are a measurement" ^0
"" ^0

# ---- what the drill held constant ----

"the conditions every drill shared" ^0
"  the hour : a weekday afternoon, " + str(drills_run) + " times out of " + str(drills_run) ^0
"  who was present : " + str(engineers_in_the_room_during_a_drill) + ", in one room" ^0
"  approvals : available immediately, in person" ^0
"  the " + str(decisions_the_runbook_leaves_to_judgement) + " judgement calls : made by whoever knew" ^0
"    most, without waiting" ^0
"  drills begun outside those conditions : " ^0
"    " + str(drills_begun_outside_working_hours) ^0
"" ^0
"  the system was varied and the people were not; the" ^0
"  runbook's slowest steps are the ones with a person in" ^0
"  them" ^0
"" ^0

# ---- what the night has instead ----

"the same runbook at 0340 on a holiday" ^0
"  engineers reachable : " + str(engineers_reachable_at_0340_on_a_holiday) ^0
"  steps needing a second approver : " ^0
"    " + str(steps_that_require_a_second_approver) ^0
"  approvers on the rota : " + str(approvers_on_the_rota_at_night) ^0
"  approvers short of what a step needs : " ^0
"    " + str(approvers_short_at_night) ^0
"  so steps that wait for somebody to wake : " ^0
"    " + str(steps_that_wait_at_night) + ", all of them" ^0
"  judgement calls, with the person who knew most asleep :" ^0
"    " + str(decisions_the_runbook_leaves_to_judgement) ^0
"  what the one real event took : " + str(real_failover_minutes) + " minutes" ^0
"" ^0

# ---- null control ----

# The same drill, one of the sixteen begun unannounced at 0300 on a holiday.
1 => nc_drills_begun_outside_working_hours
96 => nc_minutes_that_drill_took
16 => nc_drills_run

"null control - begin one drill unannounced, at night" ^0
"  drills run : " + str(nc_drills_run) + ", unchanged" ^0
"  begun outside working hours : " + str(nc_drills_begun_outside_working_hours) ^0
"  minutes that one took : " + str(nc_minutes_that_drill_took) ^0
"  the failover did not get slower; the condition the" ^0
"  drills had all shared was allowed to vary" ^0
"" ^0

# ---- the rule ----

"what sixteen clean drills guarantee" ^0
"  the failover completes with the team assembled :" ^0
"    exactly, real traffic, real unreachability, mean" ^0
"    " + str(mean_drill_recovery_minutes) + " minutes, " + str(years_of_drills) + " years" ^0
"  the failover completes : not addressed; " + str(steps_that_wait_at_night) + " steps wait" ^0
"    for an approver who is not on the rota and " ^0
"    " + str(decisions_the_runbook_leaves_to_judgement) + " decisions wait for a person" ^0
"" ^0
"a rehearsal varies what it was built to vary; holding the" ^0
"hour and the room constant across every run makes them one" ^0
"observation repeated, and the untested variable is the one" ^0
"the real event chooses" ^0
"" ^0

"Traffic is really shifted, the primary is really made unreachable, the clock" ^0
"runs to baseline, and " + str(drills_run) + " drills over " + str(years_of_drills) + " years average " + str(mean_drill_recovery_minutes) + " minutes. All " + str(drills_run) ^0
"began on a weekday afternoon with " + str(engineers_in_the_room_during_a_drill) + " people in a room, against " + str(engineers_reachable_at_0340_on_a_holiday) + " reachable at" ^0
"0340 on a holiday, " + str(steps_that_wait_at_night) + " steps waiting for an absent approver - and the one real" ^0
"failover took " + str(real_failover_minutes) + " minutes, " + str(real_against_drill_per_myriad) + " per ten thousand of the drill mean." ^0
```

## Python (deterministic transpilation)

```python
drills_run = 16
years_of_drills = 4
mean_drill_recovery_minutes = 22
engineers_in_the_room_during_a_drill = 9
engineers_reachable_at_0340_on_a_holiday = 2
steps_in_the_failover_runbook = 31
steps_that_require_a_second_approver = 6
approvers_a_two_approver_step_needs = 2
approvers_on_the_rota_at_night = 1
decisions_the_runbook_leaves_to_judgement = 4
real_failovers = 1
real_failover_minutes = 96
drills_begun_outside_working_hours = 0
engineers_the_drill_had_and_the_night_does_not = engineers_in_the_room_during_a_drill - engineers_reachable_at_0340_on_a_holiday
steps_one_person_can_take = steps_in_the_failover_runbook - steps_that_require_a_second_approver
approvers_short_at_night = approvers_a_two_approver_step_needs - approvers_on_the_rota_at_night
steps_that_wait_at_night = steps_that_require_a_second_approver
minutes_the_real_one_took_beyond_the_drill = real_failover_minutes - mean_drill_recovery_minutes
real_against_drill_per_myriad = int(real_failover_minutes * 10000 / mean_drill_recovery_minutes)
roster_present_at_night_per_myriad = int(engineers_reachable_at_0340_on_a_holiday * 10000 / engineers_in_the_room_during_a_drill)
steps_needing_two_per_myriad = int(steps_that_require_a_second_approver * 10000 / steps_in_the_failover_runbook)
print("drills run                      : " + str(drills_run))
print("  years of drills               : " + str(years_of_drills))
print("  begun outside working hours   : " + str(drills_begun_outside_working_hours))
print("  mean recovery, minutes        : " + str(mean_drill_recovery_minutes))
print("")
print("engineers in the room, a drill  : " + str(engineers_in_the_room_during_a_drill))
print("  reachable at 0340 on a holiday: " + str(engineers_reachable_at_0340_on_a_holiday))
print("  the difference                : " + str(engineers_the_drill_had_and_the_night_does_not))
print("  roster present at night       : " + str(roster_present_at_night_per_myriad) + " per ten thousand")
print("")
print("steps in the failover runbook   : " + str(steps_in_the_failover_runbook))
print("  needing a second approver     : " + str(steps_that_require_a_second_approver))
print("  share needing two             : " + str(steps_needing_two_per_myriad) + " per ten thousand")
print("  approvers on the night rota   : " + str(approvers_on_the_rota_at_night))
print("  approvers such a step needs   : " + str(approvers_a_two_approver_step_needs))
print("  approvers short at night      : " + str(approvers_short_at_night))
print("  steps that wait at night      : " + str(steps_that_wait_at_night))
print("  one person can take           : " + str(steps_one_person_can_take))
print("decisions left to judgement     : " + str(decisions_the_runbook_leaves_to_judgement))
print("")
print("real failovers                  : " + str(real_failovers))
print("  minutes                       : " + str(real_failover_minutes))
print("  beyond the drill mean         : " + str(minutes_the_real_one_took_beyond_the_drill))
print("  against the drill             : " + str(real_against_drill_per_myriad) + " per ten thousand")
print("")
print("the failover drill")
print("  traffic : actually shifted and served from the")
print("    secondary for an hour")
print("  the primary : actually made unreachable, not drained")
print("  the clock : from the first alert to error rates back")
print("    at baseline")
print("  a miss : recorded as a finding, not rounded")
print("  runs : " + str(drills_run) + " over " + str(years_of_drills) + " years, mean " + str(mean_drill_recovery_minutes) + " minutes")
print("  verdict : RECOVERS")
print("")
print("  making the primary genuinely unreachable rather than")
print("  draining it is the part almost nobody does, and it is")
print("  why the " + str(mean_drill_recovery_minutes) + " minutes are a measurement")
print("")
print("the conditions every drill shared")
print("  the hour : a weekday afternoon, " + str(drills_run) + " times out of " + str(drills_run))
print("  who was present : " + str(engineers_in_the_room_during_a_drill) + ", in one room")
print("  approvals : available immediately, in person")
print("  the " + str(decisions_the_runbook_leaves_to_judgement) + " judgement calls : made by whoever knew")
print("    most, without waiting")
print("  drills begun outside those conditions : ")
print("    " + str(drills_begun_outside_working_hours))
print("")
print("  the system was varied and the people were not; the")
print("  runbook's slowest steps are the ones with a person in")
print("  them")
print("")
print("the same runbook at 0340 on a holiday")
print("  engineers reachable : " + str(engineers_reachable_at_0340_on_a_holiday))
print("  steps needing a second approver : ")
print("    " + str(steps_that_require_a_second_approver))
print("  approvers on the rota : " + str(approvers_on_the_rota_at_night))
print("  approvers short of what a step needs : ")
print("    " + str(approvers_short_at_night))
print("  so steps that wait for somebody to wake : ")
print("    " + str(steps_that_wait_at_night) + ", all of them")
print("  judgement calls, with the person who knew most asleep :")
print("    " + str(decisions_the_runbook_leaves_to_judgement))
print("  what the one real event took : " + str(real_failover_minutes) + " minutes")
print("")
nc_drills_begun_outside_working_hours = 1
nc_minutes_that_drill_took = 96
nc_drills_run = 16
print("null control - begin one drill unannounced, at night")
print("  drills run : " + str(nc_drills_run) + ", unchanged")
print("  begun outside working hours : " + str(nc_drills_begun_outside_working_hours))
print("  minutes that one took : " + str(nc_minutes_that_drill_took))
print("  the failover did not get slower; the condition the")
print("  drills had all shared was allowed to vary")
print("")
print("what sixteen clean drills guarantee")
print("  the failover completes with the team assembled :")
print("    exactly, real traffic, real unreachability, mean")
print("    " + str(mean_drill_recovery_minutes) + " minutes, " + str(years_of_drills) + " years")
print("  the failover completes : not addressed; " + str(steps_that_wait_at_night) + " steps wait")
print("    for an approver who is not on the rota and ")
print("    " + str(decisions_the_runbook_leaves_to_judgement) + " decisions wait for a person")
print("")
print("a rehearsal varies what it was built to vary; holding the")
print("hour and the room constant across every run makes them one")
print("observation repeated, and the untested variable is the one")
print("the real event chooses")
print("")
print("Traffic is really shifted, the primary is really made unreachable, the clock")
print("runs to baseline, and " + str(drills_run) + " drills over " + str(years_of_drills) + " years average " + str(mean_drill_recovery_minutes) + " minutes. All " + str(drills_run))
print("began on a weekday afternoon with " + str(engineers_in_the_room_during_a_drill) + " people in a room, against " + str(engineers_reachable_at_0340_on_a_holiday) + " reachable at")
print("0340 on a holiday, " + str(steps_that_wait_at_night) + " steps waiting for an absent approver - and the one real")
print("failover took " + str(real_failover_minutes) + " minutes, " + str(real_against_drill_per_myriad) + " per ten thousand of the drill mean.")
```

## stdout (executed)

```text
drills run                      : 16
  years of drills               : 4
  begun outside working hours   : 0
  mean recovery, minutes        : 22

engineers in the room, a drill  : 9
  reachable at 0340 on a holiday: 2
  the difference                : 7
  roster present at night       : 2222 per ten thousand

steps in the failover runbook   : 31
  needing a second approver     : 6
  share needing two             : 1935 per ten thousand
  approvers on the night rota   : 1
  approvers such a step needs   : 2
  approvers short at night      : 1
  steps that wait at night      : 6
  one person can take           : 25
decisions left to judgement     : 4

real failovers                  : 1
  minutes                       : 96
  beyond the drill mean         : 74
  against the drill             : 43636 per ten thousand

the failover drill
  traffic : actually shifted and served from the
    secondary for an hour
  the primary : actually made unreachable, not drained
  the clock : from the first alert to error rates back
    at baseline
  a miss : recorded as a finding, not rounded
  runs : 16 over 4 years, mean 22 minutes
  verdict : RECOVERS

  making the primary genuinely unreachable rather than
  draining it is the part almost nobody does, and it is
  why the 22 minutes are a measurement

the conditions every drill shared
  the hour : a weekday afternoon, 16 times out of 16
  who was present : 9, in one room
  approvals : available immediately, in person
  the 4 judgement calls : made by whoever knew
    most, without waiting
  drills begun outside those conditions : 
    0

  the system was varied and the people were not; the
  runbook's slowest steps are the ones with a person in
  them

the same runbook at 0340 on a holiday
  engineers reachable : 2
  steps needing a second approver : 
    6
  approvers on the rota : 1
  approvers short of what a step needs : 
    1
  so steps that wait for somebody to wake : 
    6, all of them
  judgement calls, with the person who knew most asleep :
    4
  what the one real event took : 96 minutes

null control - begin one drill unannounced, at night
  drills run : 16, unchanged
  begun outside working hours : 1
  minutes that one took : 96
  the failover did not get slower; the condition the
  drills had all shared was allowed to vary

what sixteen clean drills guarantee
  the failover completes with the team assembled :
    exactly, real traffic, real unreachability, mean
    22 minutes, 4 years
  the failover completes : not addressed; 6 steps wait
    for an approver who is not on the rota and 
    4 decisions wait for a person

a rehearsal varies what it was built to vary; holding the
hour and the room constant across every run makes them one
observation repeated, and the untested variable is the one
the real event chooses

Traffic is really shifted, the primary is really made unreachable, the clock
runs to baseline, and 16 drills over 4 years average 22 minutes. All 16
began on a weekday afternoon with 9 people in a room, against 2 reachable at
0340 on a holiday, 6 steps waiting for an absent approver - and the one real
failover took 96 minutes, 43636 per ten thousand of the drill mean.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
