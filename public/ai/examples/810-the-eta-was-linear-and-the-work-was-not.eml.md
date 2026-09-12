<!-- canonical: efficientnewlanguage.org/ai/examples/810-the-eta-was-linear-and-the-work-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 810 — The eta was linear and the work was not

`the_eta_was_linear_and_the_work_was_not.eml` - The job is 90 per hundred done and the ETA says ten minutes, and the arithmetic is right. What the ETA assumes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The job is 90 per
# hundred done and the ETA says ten minutes, and the arithmetic is right. What
# the ETA assumes is computed below.
#
# The progress bar is honest about what it counts. It counts real completed work
# units, not a fabricated percentage; it updates from the actual count each tick;
# the rate is the true average so far; and the ETA is remaining over that rate.
#
# The ETA assumes the remaining work runs at the average rate.

1000 => total_units
900 => done_units
90 => elapsed_minutes
1 => rate_on_the_remaining_units_per_minute

total_units - done_units => remaining_units
int(done_units / elapsed_minutes) => average_rate_so_far_per_minute
int(remaining_units / average_rate_so_far_per_minute) => reported_eta_minutes
int(remaining_units / rate_on_the_remaining_units_per_minute) => true_remaining_minutes
true_remaining_minutes - reported_eta_minutes => underestimate_minutes

"total units                     : " + str(total_units) ^0
"done units                      : " + str(done_units) ^0
"  remaining                     : " + str(remaining_units) ^0
"elapsed                         : " + str(elapsed_minutes) + " minutes" ^0
"average rate so far             : " + str(average_rate_so_far_per_minute) + " units per minute" ^0
"reported ETA                    : " + str(reported_eta_minutes) + " minutes" ^0
"" ^0
"rate on the remaining units     : " + str(rate_on_the_remaining_units_per_minute) + " per minute" ^0
"true remaining time             : " + str(true_remaining_minutes) + " minutes" ^0
"  underestimate                 : " + str(underestimate_minutes) + " minutes" ^0
"" ^0

# ---- what the progress bar verified ----

"the progress bar" ^0
"  counts : real completed units" ^0
"  updates : from the actual count each tick" ^0
"  rate : the true average so far" ^0
"  ETA : remaining over that rate" ^0
"  units genuinely done : " + str(done_units) ^0
"  verdict : 90 PERCENT DONE, ETA TEN MINUTES" ^0
"" ^0
"  counting real units rather than a fabricated percentage" ^0
"  is the part done right here, and it is why 90 percent" ^0
"  is true" ^0
"" ^0

# ---- what the ETA assumes ----

"the extrapolation" ^0
"  what it projects : the average rate onto the remainder" ^0
"  what inflated that average : the first 900 units were" ^0
"    the easy ones" ^0
"  what the remainder is : the 100 hard ones, at " ^0
"    " + str(rate_on_the_remaining_units_per_minute) + " per minute" ^0
"  so remaining time is : " + str(true_remaining_minutes) + " minutes, not " + str(reported_eta_minutes) ^0
"  the average is a fact about the past : projected as a" ^0
"    fact about the future" ^0
"" ^0

# ---- what the caller waiting sees ----

"the caller watching the bar" ^0
"  what the ETA promised : " + str(reported_eta_minutes) + " minutes" ^0
"  what the tail actually takes : " + str(true_remaining_minutes) + " minutes" ^0
"  the underestimate : " + str(underestimate_minutes) + " minutes" ^0
"  is the percentage wrong : no; 900 of 1000 are done" ^0
"  is the ETA wrong : the arithmetic is right and the" ^0
"    assumption behind it is not" ^0
"" ^0

# ---- null control ----

# The same job, with the ETA computed from the rate over a trailing window of
# recent units rather than the average since the start.
10 => nc_eta_from_the_lifetime_average_minutes
100 => nc_eta_from_the_recent_rate_minutes
1 => nc_estimates_that_change

"null control - ETA from the recent rate, not the lifetime average" ^0
"  ETA from the lifetime average : " ^0
"    " + str(nc_eta_from_the_lifetime_average_minutes) + " minutes, unchanged" ^0
"  ETA from the recent rate : " ^0
"    " + str(nc_eta_from_the_recent_rate_minutes) + " minutes" ^0
"  estimates that change : " + str(nc_estimates_that_change) ^0
"  no unit and no count changed; the rate used stopped" ^0
"  being the one the easy units inflated" ^0
"" ^0

# ---- the rule ----

"what a 90-percent bar with a ten-minute ETA guarantees" ^0
"  900 of 1000 units are done : exactly, real units," ^0
"    updated each tick, true average rate" ^0
"  the job finishes in the ETA : not addressed; the ETA" ^0
"    extrapolates the average rate, and the remaining 100" ^0
"    are the slow ones the average was inflated by the fast" ^0
"    ones - they take " + str(true_remaining_minutes) + " minutes" ^0
"" ^0

"an average rate is a summary of the work already done, and the work left is" ^0
"exactly the work not in that summary; projecting the past rate onto a remainder" ^0
"of a different kind is the assumption, not the measurement" ^0
"" ^0

"It counts real units and divides remaining by the true average - 90 percent," ^0
"ETA " + str(reported_eta_minutes) + " minutes. The average was inflated by the easy first 900, and the" ^0
"remaining 100 run at " + str(rate_on_the_remaining_units_per_minute) + " per minute, so the tail takes " + str(true_remaining_minutes) + " minutes, " ^0
"" + str(underestimate_minutes) + " past the ETA." ^0
```

## Python (deterministic transpilation)

```python
total_units = 1000
done_units = 900
elapsed_minutes = 90
rate_on_the_remaining_units_per_minute = 1
remaining_units = total_units - done_units
average_rate_so_far_per_minute = int(done_units / elapsed_minutes)
reported_eta_minutes = int(remaining_units / average_rate_so_far_per_minute)
true_remaining_minutes = int(remaining_units / rate_on_the_remaining_units_per_minute)
underestimate_minutes = true_remaining_minutes - reported_eta_minutes
print("total units                     : " + str(total_units))
print("done units                      : " + str(done_units))
print("  remaining                     : " + str(remaining_units))
print("elapsed                         : " + str(elapsed_minutes) + " minutes")
print("average rate so far             : " + str(average_rate_so_far_per_minute) + " units per minute")
print("reported ETA                    : " + str(reported_eta_minutes) + " minutes")
print("")
print("rate on the remaining units     : " + str(rate_on_the_remaining_units_per_minute) + " per minute")
print("true remaining time             : " + str(true_remaining_minutes) + " minutes")
print("  underestimate                 : " + str(underestimate_minutes) + " minutes")
print("")
print("the progress bar")
print("  counts : real completed units")
print("  updates : from the actual count each tick")
print("  rate : the true average so far")
print("  ETA : remaining over that rate")
print("  units genuinely done : " + str(done_units))
print("  verdict : 90 PERCENT DONE, ETA TEN MINUTES")
print("")
print("  counting real units rather than a fabricated percentage")
print("  is the part done right here, and it is why 90 percent")
print("  is true")
print("")
print("the extrapolation")
print("  what it projects : the average rate onto the remainder")
print("  what inflated that average : the first 900 units were")
print("    the easy ones")
print("  what the remainder is : the 100 hard ones, at ")
print("    " + str(rate_on_the_remaining_units_per_minute) + " per minute")
print("  so remaining time is : " + str(true_remaining_minutes) + " minutes, not " + str(reported_eta_minutes))
print("  the average is a fact about the past : projected as a")
print("    fact about the future")
print("")
print("the caller watching the bar")
print("  what the ETA promised : " + str(reported_eta_minutes) + " minutes")
print("  what the tail actually takes : " + str(true_remaining_minutes) + " minutes")
print("  the underestimate : " + str(underestimate_minutes) + " minutes")
print("  is the percentage wrong : no; 900 of 1000 are done")
print("  is the ETA wrong : the arithmetic is right and the")
print("    assumption behind it is not")
print("")
nc_eta_from_the_lifetime_average_minutes = 10
nc_eta_from_the_recent_rate_minutes = 100
nc_estimates_that_change = 1
print("null control - ETA from the recent rate, not the lifetime average")
print("  ETA from the lifetime average : ")
print("    " + str(nc_eta_from_the_lifetime_average_minutes) + " minutes, unchanged")
print("  ETA from the recent rate : ")
print("    " + str(nc_eta_from_the_recent_rate_minutes) + " minutes")
print("  estimates that change : " + str(nc_estimates_that_change))
print("  no unit and no count changed; the rate used stopped")
print("  being the one the easy units inflated")
print("")
print("what a 90-percent bar with a ten-minute ETA guarantees")
print("  900 of 1000 units are done : exactly, real units,")
print("    updated each tick, true average rate")
print("  the job finishes in the ETA : not addressed; the ETA")
print("    extrapolates the average rate, and the remaining 100")
print("    are the slow ones the average was inflated by the fast")
print("    ones - they take " + str(true_remaining_minutes) + " minutes")
print("")
print("an average rate is a summary of the work already done, and the work left is")
print("exactly the work not in that summary; projecting the past rate onto a remainder")
print("of a different kind is the assumption, not the measurement")
print("")
print("It counts real units and divides remaining by the true average - 90 percent,")
print("ETA " + str(reported_eta_minutes) + " minutes. The average was inflated by the easy first 900, and the")
print("remaining 100 run at " + str(rate_on_the_remaining_units_per_minute) + " per minute, so the tail takes " + str(true_remaining_minutes) + " minutes, ")
print("" + str(underestimate_minutes) + " past the ETA.")
```

## stdout (executed)

```text
total units                     : 1000
done units                      : 900
  remaining                     : 100
elapsed                         : 90 minutes
average rate so far             : 10 units per minute
reported ETA                    : 10 minutes

rate on the remaining units     : 1 per minute
true remaining time             : 100 minutes
  underestimate                 : 90 minutes

the progress bar
  counts : real completed units
  updates : from the actual count each tick
  rate : the true average so far
  ETA : remaining over that rate
  units genuinely done : 900
  verdict : 90 PERCENT DONE, ETA TEN MINUTES

  counting real units rather than a fabricated percentage
  is the part done right here, and it is why 90 percent
  is true

the extrapolation
  what it projects : the average rate onto the remainder
  what inflated that average : the first 900 units were
    the easy ones
  what the remainder is : the 100 hard ones, at 
    1 per minute
  so remaining time is : 100 minutes, not 10
  the average is a fact about the past : projected as a
    fact about the future

the caller watching the bar
  what the ETA promised : 10 minutes
  what the tail actually takes : 100 minutes
  the underestimate : 90 minutes
  is the percentage wrong : no; 900 of 1000 are done
  is the ETA wrong : the arithmetic is right and the
    assumption behind it is not

null control - ETA from the recent rate, not the lifetime average
  ETA from the lifetime average : 
    10 minutes, unchanged
  ETA from the recent rate : 
    100 minutes
  estimates that change : 1
  no unit and no count changed; the rate used stopped
  being the one the easy units inflated

what a 90-percent bar with a ten-minute ETA guarantees
  900 of 1000 units are done : exactly, real units,
    updated each tick, true average rate
  the job finishes in the ETA : not addressed; the ETA
    extrapolates the average rate, and the remaining 100
    are the slow ones the average was inflated by the fast
    ones - they take 100 minutes

an average rate is a summary of the work already done, and the work left is
exactly the work not in that summary; projecting the past rate onto a remainder
of a different kind is the assumption, not the measurement

It counts real units and divides remaining by the true average - 90 percent,
ETA 10 minutes. The average was inflated by the easy first 900, and the
remaining 100 run at 1 per minute, so the tail takes 100 minutes, 
90 past the ETA.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
