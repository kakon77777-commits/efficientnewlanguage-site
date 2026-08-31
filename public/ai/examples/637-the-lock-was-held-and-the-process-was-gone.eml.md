<!-- canonical: efficientnewlanguage.org/ai/examples/637-the-lock-was-held-and-the-process-was-gone | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 637 — The lock was held and the process was gone

`the_lock_was_held_and_the_process_was_gone.eml` - The lock is held and the store is right about that. How long the work waits for a holder that no longer exists is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The lock is held
# and the store is right about that. How long the work waits for a holder that
# no longer exists is computed below.
#
# The lock is implemented correctly. Acquisition is a single conditional write,
# so two holders is impossible; the key carries a time to live, so a crash
# cannot wedge it forever; and the holder refreshes while it works. Every claim
# in that sentence is true and the implementation has no race in it.
#
# What the key records is that SOMETHING acquired it and the clock has not run
# out. Whether that something is still running is a different fact, held on a
# different machine, and the store has no way to observe it.
#
# The holder is killed for memory thirty-four times a week. The key survives it
# every time, and every waiter behaves correctly for the remainder of the lease.

900 => ttl_seconds
34 => holder_deaths_per_week
# Measured across those deaths: the lease time still on the clock when the
# process stopped refreshing it.
451 => mean_seconds_left_on_the_lease
0 => double_holder_events

holder_deaths_per_week * mean_seconds_left_on_the_lease => stalled_seconds_per_week
int(stalled_seconds_per_week / 60) => stalled_minutes_per_week

"lease, seconds                  : " + str(ttl_seconds) ^0
"holder deaths per week          : " + str(holder_deaths_per_week) ^0
"mean lease left when it died    : " + str(mean_seconds_left_on_the_lease) ^0
"stalled seconds per week        : " + str(stalled_seconds_per_week) ^0
"stalled minutes per week        : " + str(stalled_minutes_per_week) ^0
"" ^0

# ---- what the lock verified ----

"the lock's own guarantees" ^0
"  acquisition        : one conditional write" ^0
"  two holders at once: " + str(double_holder_events) + " ever observed" ^0
"  wedged forever     : impossible, the lease expires" ^0
"  refresh while working : implemented" ^0
"  verdict            : CORRECT" ^0
"" ^0
"  there is no race here and no amount of review will find" ^0
"  one; the mutual exclusion is sound" ^0
"" ^0

# ---- what it cannot observe ----

"the two facts" ^0
"  a holder acquired this key      : in the store" ^0
"  the holder is still running     : on another machine" ^0
"  the store's evidence for the second : the first, plus" ^0
"    a clock" ^0
"" ^0
"  a lease is a bet that a live holder refreshes faster than" ^0
"  the clock runs, and a dead one loses that bet slowly" ^0
"" ^0

int(mean_seconds_left_on_the_lease * 10000 / ttl_seconds) => wasted_per_myriad
"share of a lease spent waiting on nobody : " + str(wasted_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why shortening it is not the fix ----

# A shorter lease cuts the stall and moves the failure to the other side: a
# holder paused longer than the lease loses it while still working, and then
# two processes each believe they hold it.
60 => shorter_ttl_seconds
11 => pauses_longer_than_sixty_seconds_per_week

"the lease at sixty seconds instead" ^0
"  mean stall per death, seconds : 30" ^0
"  holder pauses exceeding it    : " + str(pauses_longer_than_sixty_seconds_per_week) + " per week" ^0
"  each of those is two holders  : yes" ^0
"" ^0
"  the lease length trades a stall against a violation and" ^0
"  cannot remove either" ^0
"" ^0

# ---- null control ----

# The same lock with a fencing token: the lease still expires, and a resumed
# holder's writes are rejected because its token is older than the current one.
0 => nc_double_holder_writes
holder_deaths_per_week => nc_deaths_unchanged

"null control - the same lease, plus a fencing token" ^0
"  lease behaviour        : unchanged" ^0
"  holder deaths per week : " + str(nc_deaths_unchanged) + ", unchanged" ^0
"  writes from a second believer : " + str(nc_double_holder_writes) ^0
"  the lock did not get better; the resource started" ^0
"  refusing writes that carry a stale token" ^0
"" ^0

# ---- the rule ----

"what a correct lock guarantees" ^0
"  at most one holder acquired this key : exactly" ^0
"  the holder is alive and working      : not addressed;" ^0
"    liveness is a property of a process, and the store" ^0
"    holds a key and a clock" ^0
"" ^0
"a lease converts an unanswerable question into a timer; the" ^0
"timer is always either too long to wait for or too short to" ^0
"survive a pause, and the way out is at the resource" ^0
"" ^0

"The lock is correct and there has never been a double holder: one conditional" ^0
"write, a lease that cannot wedge, refresh while working. Its holder dies " + str(holder_deaths_per_week) ^0
"times a week with a mean of " + str(mean_seconds_left_on_the_lease) + " seconds still on the clock - " + str(wasted_per_myriad) + " per ten" ^0
"thousand of a lease - so " + str(stalled_minutes_per_week) + " minutes a week are spent waiting for a process" ^0
"that no longer exists, and halving the lease buys that back with " + str(pauses_longer_than_sixty_seconds_per_week) + " violations." ^0
```

## Python (deterministic transpilation)

```python
ttl_seconds = 900
holder_deaths_per_week = 34
mean_seconds_left_on_the_lease = 451
double_holder_events = 0
stalled_seconds_per_week = holder_deaths_per_week * mean_seconds_left_on_the_lease
stalled_minutes_per_week = int(stalled_seconds_per_week / 60)
print("lease, seconds                  : " + str(ttl_seconds))
print("holder deaths per week          : " + str(holder_deaths_per_week))
print("mean lease left when it died    : " + str(mean_seconds_left_on_the_lease))
print("stalled seconds per week        : " + str(stalled_seconds_per_week))
print("stalled minutes per week        : " + str(stalled_minutes_per_week))
print("")
print("the lock's own guarantees")
print("  acquisition        : one conditional write")
print("  two holders at once: " + str(double_holder_events) + " ever observed")
print("  wedged forever     : impossible, the lease expires")
print("  refresh while working : implemented")
print("  verdict            : CORRECT")
print("")
print("  there is no race here and no amount of review will find")
print("  one; the mutual exclusion is sound")
print("")
print("the two facts")
print("  a holder acquired this key      : in the store")
print("  the holder is still running     : on another machine")
print("  the store's evidence for the second : the first, plus")
print("    a clock")
print("")
print("  a lease is a bet that a live holder refreshes faster than")
print("  the clock runs, and a dead one loses that bet slowly")
print("")
wasted_per_myriad = int(mean_seconds_left_on_the_lease * 10000 / ttl_seconds)
print("share of a lease spent waiting on nobody : " + str(wasted_per_myriad) + " per ten thousand")
print("")
shorter_ttl_seconds = 60
pauses_longer_than_sixty_seconds_per_week = 11
print("the lease at sixty seconds instead")
print("  mean stall per death, seconds : 30")
print("  holder pauses exceeding it    : " + str(pauses_longer_than_sixty_seconds_per_week) + " per week")
print("  each of those is two holders  : yes")
print("")
print("  the lease length trades a stall against a violation and")
print("  cannot remove either")
print("")
nc_double_holder_writes = 0
nc_deaths_unchanged = holder_deaths_per_week
print("null control - the same lease, plus a fencing token")
print("  lease behaviour        : unchanged")
print("  holder deaths per week : " + str(nc_deaths_unchanged) + ", unchanged")
print("  writes from a second believer : " + str(nc_double_holder_writes))
print("  the lock did not get better; the resource started")
print("  refusing writes that carry a stale token")
print("")
print("what a correct lock guarantees")
print("  at most one holder acquired this key : exactly")
print("  the holder is alive and working      : not addressed;")
print("    liveness is a property of a process, and the store")
print("    holds a key and a clock")
print("")
print("a lease converts an unanswerable question into a timer; the")
print("timer is always either too long to wait for or too short to")
print("survive a pause, and the way out is at the resource")
print("")
print("The lock is correct and there has never been a double holder: one conditional")
print("write, a lease that cannot wedge, refresh while working. Its holder dies " + str(holder_deaths_per_week))
print("times a week with a mean of " + str(mean_seconds_left_on_the_lease) + " seconds still on the clock - " + str(wasted_per_myriad) + " per ten")
print("thousand of a lease - so " + str(stalled_minutes_per_week) + " minutes a week are spent waiting for a process")
print("that no longer exists, and halving the lease buys that back with " + str(pauses_longer_than_sixty_seconds_per_week) + " violations.")
```

## stdout (executed)

```text
lease, seconds                  : 900
holder deaths per week          : 34
mean lease left when it died    : 451
stalled seconds per week        : 15334
stalled minutes per week        : 255

the lock's own guarantees
  acquisition        : one conditional write
  two holders at once: 0 ever observed
  wedged forever     : impossible, the lease expires
  refresh while working : implemented
  verdict            : CORRECT

  there is no race here and no amount of review will find
  one; the mutual exclusion is sound

the two facts
  a holder acquired this key      : in the store
  the holder is still running     : on another machine
  the store's evidence for the second : the first, plus
    a clock

  a lease is a bet that a live holder refreshes faster than
  the clock runs, and a dead one loses that bet slowly

share of a lease spent waiting on nobody : 5011 per ten thousand

the lease at sixty seconds instead
  mean stall per death, seconds : 30
  holder pauses exceeding it    : 11 per week
  each of those is two holders  : yes

  the lease length trades a stall against a violation and
  cannot remove either

null control - the same lease, plus a fencing token
  lease behaviour        : unchanged
  holder deaths per week : 34, unchanged
  writes from a second believer : 0
  the lock did not get better; the resource started
  refusing writes that carry a stale token

what a correct lock guarantees
  at most one holder acquired this key : exactly
  the holder is alive and working      : not addressed;
    liveness is a property of a process, and the store
    holds a key and a clock

a lease converts an unanswerable question into a timer; the
timer is always either too long to wait for or too short to
survive a pause, and the way out is at the resource

The lock is correct and there has never been a double holder: one conditional
write, a lease that cannot wedge, refresh while working. Its holder dies 34
times a week with a mean of 451 seconds still on the clock - 5011 per ten
thousand of a lease - so 255 minutes a week are spent waiting for a process
that no longer exists, and halving the lease buys that back with 11 violations.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
