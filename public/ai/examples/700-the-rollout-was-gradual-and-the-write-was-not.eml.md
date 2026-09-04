<!-- canonical: efficientnewlanguage.org/ai/examples/700-the-rollout-was-gradual-and-the-write-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 700 — The rollout was gradual and the write was not

`the_rollout_was_gradual_and_the_write_was_not.eml` - The feature is on for five percent of users behind a kill switch that has been exercised. How many users are exposed to it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The feature is on
# for five percent of users behind a kill switch that has been exercised. How
# many users are exposed to it is computed below.
#
# The rollout is done properly. Five percent, bucketed by a stable hash of the
# user so the same people stay in the cohort rather than flickering; a kill
# switch tested in a game day and shown to take effect in eleven seconds; a
# dashboard split by cohort so a regression shows up as a difference rather than
# as noise. This is the careful version.
#
# A percentage rollout gates who RUNS the new code. The new code's first act is
# a write, and a write is read by everybody.
#
# The five percent are writing a new row shape into a shared table.

4200000 => users
500 => rollout_per_myriad
11 => kill_switch_seconds
84000 => new_shape_rows_written_per_day
0 => cohort_flicker_incidents

int(users * rollout_per_myriad / 10000) => users_running_the_new_code
users - users_running_the_new_code => users_not_running_it
users => users_reading_the_table

"users                        : " + str(users) ^0
"rollout                      : " + str(rollout_per_myriad) + " per ten thousand" ^0
"running the new code         : " + str(users_running_the_new_code) ^0
"not running it               : " + str(users_not_running_it) ^0
"reading the table it writes  : " + str(users_reading_the_table) ^0
"" ^0
"new-shape rows written per day : " + str(new_shape_rows_written_per_day) ^0
"kill switch, seconds         : " + str(kill_switch_seconds) ^0
"cohort flicker incidents     : " + str(cohort_flicker_incidents) ^0
"" ^0

# ---- what the rollout verified ----

"the rollout mechanism" ^0
"  bucketing         : a stable hash of the user" ^0
"  cohort flicker    : " + str(cohort_flicker_incidents) ^0
"  kill switch tested in a game day : yes" ^0
"  time to take effect, seconds : " + str(kill_switch_seconds) ^0
"  dashboard split by cohort : yes, so a regression is a" ^0
"    difference rather than noise" ^0
"  verdict           : GRADUAL" ^0
"" ^0
"  every one of those is a deliberate choice and each one" ^0
"  prevents a real failure mode" ^0
"" ^0

# ---- what the percentage gates ----

"the two populations" ^0
"  who executes the new branch : " + str(users_running_the_new_code) ^0
"  who reads what it produced  : " + str(users_reading_the_table) ^0
"  the flag is consulted on the write path : yes" ^0
"  on the read path                        : no, and it" ^0
"    could not be - a reader does not know which cohort" ^0
"    wrote the row it is reading" ^0
"" ^0

int(users_reading_the_table * 10000 / users) => exposed_per_myriad
"share of users exposed to the change : " + str(exposed_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the kill switch reverts ----

# Turning it off stops the writes in eleven seconds. The rows already written
# stay, and every reader keeps meeting them, so the switch bounds the
# accumulation and not the exposure.
"turning it off" ^0
"  new-shape writes after " + str(kill_switch_seconds) + " seconds : 0" ^0
"  rows already written    : still there" ^0
"  readers still meeting them : " + str(users_reading_the_table) ^0
"  what the switch bounds  : the accumulation" ^0
"  what it does not bound  : the exposure" ^0
"" ^0

# ---- null control ----

# The same rollout, with the reader taught the new shape first and shipped to
# everyone before the writer is enabled for anyone.
users => nc_readers_that_understand_the_shape
0 => nc_readers_meeting_an_unknown_shape

"null control - the reader ships first, to everyone" ^0
"  rollout of the writer : " + str(rollout_per_myriad) + " per ten thousand, unchanged" ^0
"  readers that understand the shape : " + str(nc_readers_that_understand_the_shape) ^0
"  readers meeting an unknown shape  : " + str(nc_readers_meeting_an_unknown_shape) ^0
"  the rollout did not get more gradual; the half that is" ^0
"  not gated stopped being the half that changed" ^0
"" ^0

# ---- the rule ----

"what a percentage rollout guarantees" ^0
"  a fraction of users runs the new code : exactly" ^0
"  a fraction of users is affected by it : not addressed;" ^0
"    the flag is a property of the caller, and a write" ^0
"    outlives the caller and belongs to everyone" ^0
"" ^0
"gradual is a property of execution, not of effect; a change" ^0
"whose output is shared has an exposure equal to the readership" ^0
"from the first user in the cohort" ^0
"" ^0

"The rollout is careful: stable bucketing with " + str(cohort_flicker_incidents) + " flicker incidents, a kill switch" ^0
"exercised in a game day and effective in " + str(kill_switch_seconds) + " seconds, a dashboard split by cohort." ^0
"It gates the write path, which " + str(users_running_the_new_code) + " users take, and the rows land in a table all" ^0
str(users_reading_the_table) + " read - " + str(exposed_per_myriad) + " per ten thousand exposed at " + str(rollout_per_myriad) + " per ten thousand rolled" ^0
"out - and the switch stops " + str(new_shape_rows_written_per_day) + " new rows a day without removing the ones there." ^0
```

## Python (deterministic transpilation)

```python
users = 4200000
rollout_per_myriad = 500
kill_switch_seconds = 11
new_shape_rows_written_per_day = 84000
cohort_flicker_incidents = 0
users_running_the_new_code = int(users * rollout_per_myriad / 10000)
users_not_running_it = users - users_running_the_new_code
users_reading_the_table = users
print("users                        : " + str(users))
print("rollout                      : " + str(rollout_per_myriad) + " per ten thousand")
print("running the new code         : " + str(users_running_the_new_code))
print("not running it               : " + str(users_not_running_it))
print("reading the table it writes  : " + str(users_reading_the_table))
print("")
print("new-shape rows written per day : " + str(new_shape_rows_written_per_day))
print("kill switch, seconds         : " + str(kill_switch_seconds))
print("cohort flicker incidents     : " + str(cohort_flicker_incidents))
print("")
print("the rollout mechanism")
print("  bucketing         : a stable hash of the user")
print("  cohort flicker    : " + str(cohort_flicker_incidents))
print("  kill switch tested in a game day : yes")
print("  time to take effect, seconds : " + str(kill_switch_seconds))
print("  dashboard split by cohort : yes, so a regression is a")
print("    difference rather than noise")
print("  verdict           : GRADUAL")
print("")
print("  every one of those is a deliberate choice and each one")
print("  prevents a real failure mode")
print("")
print("the two populations")
print("  who executes the new branch : " + str(users_running_the_new_code))
print("  who reads what it produced  : " + str(users_reading_the_table))
print("  the flag is consulted on the write path : yes")
print("  on the read path                        : no, and it")
print("    could not be - a reader does not know which cohort")
print("    wrote the row it is reading")
print("")
exposed_per_myriad = int(users_reading_the_table * 10000 / users)
print("share of users exposed to the change : " + str(exposed_per_myriad) + " per ten thousand")
print("")
print("turning it off")
print("  new-shape writes after " + str(kill_switch_seconds) + " seconds : 0")
print("  rows already written    : still there")
print("  readers still meeting them : " + str(users_reading_the_table))
print("  what the switch bounds  : the accumulation")
print("  what it does not bound  : the exposure")
print("")
nc_readers_that_understand_the_shape = users
nc_readers_meeting_an_unknown_shape = 0
print("null control - the reader ships first, to everyone")
print("  rollout of the writer : " + str(rollout_per_myriad) + " per ten thousand, unchanged")
print("  readers that understand the shape : " + str(nc_readers_that_understand_the_shape))
print("  readers meeting an unknown shape  : " + str(nc_readers_meeting_an_unknown_shape))
print("  the rollout did not get more gradual; the half that is")
print("  not gated stopped being the half that changed")
print("")
print("what a percentage rollout guarantees")
print("  a fraction of users runs the new code : exactly")
print("  a fraction of users is affected by it : not addressed;")
print("    the flag is a property of the caller, and a write")
print("    outlives the caller and belongs to everyone")
print("")
print("gradual is a property of execution, not of effect; a change")
print("whose output is shared has an exposure equal to the readership")
print("from the first user in the cohort")
print("")
print("The rollout is careful: stable bucketing with " + str(cohort_flicker_incidents) + " flicker incidents, a kill switch")
print("exercised in a game day and effective in " + str(kill_switch_seconds) + " seconds, a dashboard split by cohort.")
print("It gates the write path, which " + str(users_running_the_new_code) + " users take, and the rows land in a table all")
print(str(users_reading_the_table) + " read - " + str(exposed_per_myriad) + " per ten thousand exposed at " + str(rollout_per_myriad) + " per ten thousand rolled")
print("out - and the switch stops " + str(new_shape_rows_written_per_day) + " new rows a day without removing the ones there.")
```

## stdout (executed)

```text
users                        : 4200000
rollout                      : 500 per ten thousand
running the new code         : 210000
not running it               : 3990000
reading the table it writes  : 4200000

new-shape rows written per day : 84000
kill switch, seconds         : 11
cohort flicker incidents     : 0

the rollout mechanism
  bucketing         : a stable hash of the user
  cohort flicker    : 0
  kill switch tested in a game day : yes
  time to take effect, seconds : 11
  dashboard split by cohort : yes, so a regression is a
    difference rather than noise
  verdict           : GRADUAL

  every one of those is a deliberate choice and each one
  prevents a real failure mode

the two populations
  who executes the new branch : 210000
  who reads what it produced  : 4200000
  the flag is consulted on the write path : yes
  on the read path                        : no, and it
    could not be - a reader does not know which cohort
    wrote the row it is reading

share of users exposed to the change : 10000 per ten thousand

turning it off
  new-shape writes after 11 seconds : 0
  rows already written    : still there
  readers still meeting them : 4200000
  what the switch bounds  : the accumulation
  what it does not bound  : the exposure

null control - the reader ships first, to everyone
  rollout of the writer : 500 per ten thousand, unchanged
  readers that understand the shape : 4200000
  readers meeting an unknown shape  : 0
  the rollout did not get more gradual; the half that is
  not gated stopped being the half that changed

what a percentage rollout guarantees
  a fraction of users runs the new code : exactly
  a fraction of users is affected by it : not addressed;
    the flag is a property of the caller, and a write
    outlives the caller and belongs to everyone

gradual is a property of execution, not of effect; a change
whose output is shared has an exposure equal to the readership
from the first user in the cohort

The rollout is careful: stable bucketing with 0 flicker incidents, a kill switch
exercised in a game day and effective in 11 seconds, a dashboard split by cohort.
It gates the write path, which 210000 users take, and the rows land in a table all
4200000 read - 10000 per ten thousand exposed at 500 per ten thousand rolled
out - and the switch stops 84000 new rows a day without removing the ones there.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
