<!-- canonical: efficientnewlanguage.org/ai/examples/659-the-clock-was-monotonic-and-the-process-restarted | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 659 — The clock was monotonic and the process restarted

`the_clock_was_monotonic_and_the_process_restarted.eml` - Durations use a monotonic clock, which is the correct choice and immune to every wall-clock hazard. How long a thirty-second lease lasts is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Durations use a
# monotonic clock, which is the correct choice and immune to every wall-clock
# hazard. How long a thirty-second lease lasts is computed below.
#
# The choice is right and it was made deliberately. A wall clock can step
# backwards when time is corrected, jump an hour at a transition, and produce
# negative durations; the code was moved off it after exactly that bug. The
# monotonic clock never goes backwards and is not affected by any of it.
#
# A monotonic clock has no fixed origin. Its zero is whenever the counter it
# reads started, and comparing two readings is only meaningful if they came from
# the same one. Persisting a reading writes a number whose origin is not stored
# beside it.
#
# The lease deadline is written to shared storage so other instances can honour
# it, and the process that wrote it has since restarted.

30 => lease_seconds
804000 => uptime_at_write_seconds
62 => restarts_per_week
2400000 => leases_persisted
0 => negative_durations_observed

# After a restart the reader's monotonic clock starts near zero, so a deadline
# written as (old uptime + lease) is far in its future.
uptime_at_write_seconds + lease_seconds => stored_deadline
int(stored_deadline / lease_seconds) => times_longer_than_intended

"lease, seconds                : " + str(lease_seconds) ^0
"uptime when the deadline was written : " + str(uptime_at_write_seconds) ^0
"stored deadline value         : " + str(stored_deadline) ^0
"" ^0
"after a restart the reader's clock starts near : 0" ^0
"so the lease appears to last, seconds : " + str(stored_deadline) ^0
"which is longer than intended by : " + str(times_longer_than_intended) + " times" ^0
"" ^0

# ---- what the monotonic clock guarantees ----

"the clock" ^0
"  goes backwards      : never" ^0
"  affected by time correction : no" ^0
"  affected by a daylight transition : no" ^0
"  negative durations observed : " + str(negative_durations_observed) ^0
"  verdict             : MONOTONIC" ^0
"" ^0
"  the move to it fixed a real bug and none of the wall" ^0
"  clock's hazards can recur" ^0
"" ^0

# ---- what it does not have ----

"comparing two readings" ^0
"  same process, same boot : meaningful" ^0
"  different process       : the origins differ" ^0
"  origin stored beside the value : no" ^0
"  a way to detect the mismatch   : none, both are just" ^0
"    numbers of seconds" ^0
"" ^0
"  the reading is not wrong and the comparison is not" ^0
"  detectable as invalid; it is arithmetic on two scales" ^0
"" ^0

# ---- what it costs ----

restarts_per_week * 52 => restarts_per_year
int(leases_persisted / 52 / 7) => leases_per_day

"the exposure" ^0
"  leases persisted        : " + str(leases_persisted) ^0
"  leases per day          : " + str(leases_per_day) ^0
"  restarts per week       : " + str(restarts_per_week) ^0
"  restarts per year       : " + str(restarts_per_year) ^0
"  every lease written before a restart and read after it" ^0
"    is held for " + str(stored_deadline) + " seconds instead of " + str(lease_seconds) ^0
"" ^0

# ---- why it looks like a leak rather than a clock ----

# The symptom is a resource nobody releases. Every investigation looks at the
# release path, which is correct, and at the deadline arithmetic, which is also
# correct within one process.
"what the investigation finds" ^0
"  release path        : correct" ^0
"  deadline arithmetic within one process : correct" ^0
"  negative durations  : " + str(negative_durations_observed) ^0
"  clock hazards       : none, it is monotonic" ^0
"  the reading that is wrong : neither of them" ^0
"" ^0

# ---- null control ----

# The same clock for measuring, with the persisted deadline written as a wall
# clock instant instead.
lease_seconds => nc_effective_lease_seconds
0 => nc_leases_outliving_their_deadline

"null control - persist a wall-clock instant, measure with monotonic" ^0
"  negative durations   : " + str(negative_durations_observed) + ", unchanged" ^0
"  effective lease, seconds : " + str(nc_effective_lease_seconds) ^0
"  leases outliving their deadline : " + str(nc_leases_outliving_their_deadline) ^0
"  the monotonic clock is still used for every duration;" ^0
"  the value that crosses a process boundary stopped being" ^0
"  one of its readings" ^0
"" ^0

# ---- the rule ----

"what a monotonic clock guarantees" ^0
"  the difference of two readings is a true elapsed time : exactly," ^0
"    within one origin" ^0
"  a reading means anything elsewhere                    : not" ^0
"    addressed; the origin is not part of the value and" ^0
"    cannot be recovered from it" ^0
"" ^0
"monotonic readings are for measuring and wall-clock instants" ^0
"are for communicating; a value that outlives its process has" ^0
"crossed from the first use to the second" ^0
"" ^0

"The clock is monotonic, " + str(negative_durations_observed) + " negative durations have been seen, and moving to it" ^0
"fixed a real wall-clock bug. Its readings have no stored origin, so a " + str(lease_seconds) ^0
"second lease written at uptime " + str(uptime_at_write_seconds) + " and read after a restart lasts " + str(stored_deadline) ^0
"seconds - " + str(times_longer_than_intended) + " times its length - across " + str(restarts_per_year) + " restarts a year," ^0
"and no reading is wrong." ^0
```

## Python (deterministic transpilation)

```python
lease_seconds = 30
uptime_at_write_seconds = 804000
restarts_per_week = 62
leases_persisted = 2400000
negative_durations_observed = 0
stored_deadline = uptime_at_write_seconds + lease_seconds
times_longer_than_intended = int(stored_deadline / lease_seconds)
print("lease, seconds                : " + str(lease_seconds))
print("uptime when the deadline was written : " + str(uptime_at_write_seconds))
print("stored deadline value         : " + str(stored_deadline))
print("")
print("after a restart the reader's clock starts near : 0")
print("so the lease appears to last, seconds : " + str(stored_deadline))
print("which is longer than intended by : " + str(times_longer_than_intended) + " times")
print("")
print("the clock")
print("  goes backwards      : never")
print("  affected by time correction : no")
print("  affected by a daylight transition : no")
print("  negative durations observed : " + str(negative_durations_observed))
print("  verdict             : MONOTONIC")
print("")
print("  the move to it fixed a real bug and none of the wall")
print("  clock's hazards can recur")
print("")
print("comparing two readings")
print("  same process, same boot : meaningful")
print("  different process       : the origins differ")
print("  origin stored beside the value : no")
print("  a way to detect the mismatch   : none, both are just")
print("    numbers of seconds")
print("")
print("  the reading is not wrong and the comparison is not")
print("  detectable as invalid; it is arithmetic on two scales")
print("")
restarts_per_year = restarts_per_week * 52
leases_per_day = int(leases_persisted / 52 / 7)
print("the exposure")
print("  leases persisted        : " + str(leases_persisted))
print("  leases per day          : " + str(leases_per_day))
print("  restarts per week       : " + str(restarts_per_week))
print("  restarts per year       : " + str(restarts_per_year))
print("  every lease written before a restart and read after it")
print("    is held for " + str(stored_deadline) + " seconds instead of " + str(lease_seconds))
print("")
print("what the investigation finds")
print("  release path        : correct")
print("  deadline arithmetic within one process : correct")
print("  negative durations  : " + str(negative_durations_observed))
print("  clock hazards       : none, it is monotonic")
print("  the reading that is wrong : neither of them")
print("")
nc_effective_lease_seconds = lease_seconds
nc_leases_outliving_their_deadline = 0
print("null control - persist a wall-clock instant, measure with monotonic")
print("  negative durations   : " + str(negative_durations_observed) + ", unchanged")
print("  effective lease, seconds : " + str(nc_effective_lease_seconds))
print("  leases outliving their deadline : " + str(nc_leases_outliving_their_deadline))
print("  the monotonic clock is still used for every duration;")
print("  the value that crosses a process boundary stopped being")
print("  one of its readings")
print("")
print("what a monotonic clock guarantees")
print("  the difference of two readings is a true elapsed time : exactly,")
print("    within one origin")
print("  a reading means anything elsewhere                    : not")
print("    addressed; the origin is not part of the value and")
print("    cannot be recovered from it")
print("")
print("monotonic readings are for measuring and wall-clock instants")
print("are for communicating; a value that outlives its process has")
print("crossed from the first use to the second")
print("")
print("The clock is monotonic, " + str(negative_durations_observed) + " negative durations have been seen, and moving to it")
print("fixed a real wall-clock bug. Its readings have no stored origin, so a " + str(lease_seconds))
print("second lease written at uptime " + str(uptime_at_write_seconds) + " and read after a restart lasts " + str(stored_deadline))
print("seconds - " + str(times_longer_than_intended) + " times its length - across " + str(restarts_per_year) + " restarts a year,")
print("and no reading is wrong.")
```

## stdout (executed)

```text
lease, seconds                : 30
uptime when the deadline was written : 804000
stored deadline value         : 804030

after a restart the reader's clock starts near : 0
so the lease appears to last, seconds : 804030
which is longer than intended by : 26801 times

the clock
  goes backwards      : never
  affected by time correction : no
  affected by a daylight transition : no
  negative durations observed : 0
  verdict             : MONOTONIC

  the move to it fixed a real bug and none of the wall
  clock's hazards can recur

comparing two readings
  same process, same boot : meaningful
  different process       : the origins differ
  origin stored beside the value : no
  a way to detect the mismatch   : none, both are just
    numbers of seconds

  the reading is not wrong and the comparison is not
  detectable as invalid; it is arithmetic on two scales

the exposure
  leases persisted        : 2400000
  leases per day          : 6593
  restarts per week       : 62
  restarts per year       : 3224
  every lease written before a restart and read after it
    is held for 804030 seconds instead of 30

what the investigation finds
  release path        : correct
  deadline arithmetic within one process : correct
  negative durations  : 0
  clock hazards       : none, it is monotonic
  the reading that is wrong : neither of them

null control - persist a wall-clock instant, measure with monotonic
  negative durations   : 0, unchanged
  effective lease, seconds : 30
  leases outliving their deadline : 0
  the monotonic clock is still used for every duration;
  the value that crosses a process boundary stopped being
  one of its readings

what a monotonic clock guarantees
  the difference of two readings is a true elapsed time : exactly,
    within one origin
  a reading means anything elsewhere                    : not
    addressed; the origin is not part of the value and
    cannot be recovered from it

monotonic readings are for measuring and wall-clock instants
are for communicating; a value that outlives its process has
crossed from the first use to the second

The clock is monotonic, 0 negative durations have been seen, and moving to it
fixed a real wall-clock bug. Its readings have no stored origin, so a 30
second lease written at uptime 804000 and read after a restart lasts 804030
seconds - 26801 times its length - across 3224 restarts a year,
and no reading is wrong.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
