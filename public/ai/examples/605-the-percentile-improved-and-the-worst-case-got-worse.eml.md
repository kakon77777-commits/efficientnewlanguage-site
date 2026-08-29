<!-- canonical: efficientnewlanguage.org/ai/examples/605-the-percentile-improved-and-the-worst-case-got-worse | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 605 — The percentile improved and the worst case got worse

`the_percentile_improved_and_the_worst_case_got_worse.eml` - A hedged request was added: if the first attempt has not answered in a hundred milliseconds, send a second one and take whichever returns first. The p99 improved. What happened above the p99 is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A hedged request
# was added: if the first attempt has not answered in a hundred milliseconds,
# send a second one and take whichever returns first. The p99 improved. What
# happened above the p99 is computed below.
#
# Hedging is correct and it is the right tool for this shape of tail. Most slow
# responses here are slow for a reason that does not recur - a cold connection,
# an unlucky scheduling slot, a node mid-compaction - so a second attempt
# usually lands on a healthy path and returns while the first is still waiting.
# The hedge threshold was set from the measured distribution, not guessed, and
# it costs one extra request only on the slice that was already slow.
#
# A percentile is a position in a sorted list. It is defined by what sits at
# that position and is unaffected by everything above it. The slowest requests
# are above every percentile that is published.
#
# The hedge is a second request. On the requests that are slow because the
# backend is saturated, that is one more request into a saturated backend.

1000 => sample
900 => fast_count
95 => middle_count
4 => slow_count
1 => worst_count

40 => fast_ms
120 => before_middle_ms
800 => before_slow_ms
1500 => before_worst_ms

"sample                  : " + str(sample) + " requests" ^0
"  " + str(fast_count) + " at " + str(fast_ms) + " ms" ^0
"  " + str(middle_count) + " at " + str(before_middle_ms) + " ms" ^0
"  " + str(slow_count) + " at " + str(before_slow_ms) + " ms" ^0
"  " + str(worst_count) + " at " + str(before_worst_ms) + " ms" ^0
"" ^0

# ---- where the percentiles land ----

int(sample * 99 / 100) => p99_position
fast_count + middle_count => cumulative_at_middle

"the p99 sits at position " + str(p99_position) + " of " + str(sample) ^0
"  requests at or below " + str(before_middle_ms) + " ms : " + str(cumulative_at_middle) ^0
"  so position " + str(p99_position) + " holds a " + str(before_middle_ms) + " ms request" ^0
"  requests above it : " + str(sample - p99_position) ^0
"" ^0

# ---- after the hedge ----

105 => after_middle_ms
860 => after_slow_ms
2300 => after_worst_ms

"metric        before      after     change" ^0
"  p50         " + str(fast_ms) + " ms       " + str(fast_ms) + " ms      none" ^0
"  p99         " + str(before_middle_ms) + " ms      " + str(after_middle_ms) + " ms     " + str(before_middle_ms - after_middle_ms) + " ms better" ^0
"  max         " + str(before_worst_ms) + " ms     " + str(after_worst_ms) + " ms    " + str(after_worst_ms - before_worst_ms) + " ms worse" ^0
"" ^0

int((before_middle_ms - after_middle_ms) * 100 / before_middle_ms) => p99_better_pct
int((after_worst_ms - before_worst_ms) * 100 / before_worst_ms) => max_worse_pct

"  p99 improved by : " + str(p99_better_pct) + " percent" ^0
"  max degraded by : " + str(max_worse_pct) + " percent" ^0
"" ^0

# ---- who moved which way ----

slow_count + worst_count => requests_worse
sample - requests_worse => requests_same_or_better

"group           count   before   after   direction" ^0
"  fast            " + str(fast_count) + "     " + str(fast_ms) + " ms    " + str(fast_ms) + " ms   unchanged, below the hedge" ^0
"  middle          " + str(middle_count) + "     " + str(before_middle_ms) + " ms   " + str(after_middle_ms) + " ms   better" ^0
"  slow            " + str(slow_count) + "      " + str(before_slow_ms) + " ms   " + str(after_slow_ms) + " ms   worse" ^0
"  worst           " + str(worst_count) + "      " + str(before_worst_ms) + " ms  " + str(after_worst_ms) + " ms  worse" ^0
"" ^0
"  requests better or unchanged : " + str(requests_same_or_better) ^0
"  requests worse               : " + str(requests_worse) ^0
"  requests worse, as a share   : " + str(int(requests_worse * 10000 / sample)) + " per ten thousand" ^0
"" ^0
"  every request that got worse is above the p99, by construction:" ^0
"  the hedge only fires on requests slower than " + str(100) + " ms" ^0
"" ^0

# ---- the extra load, and where it lands ----

middle_count + slow_count + worst_count => hedges_fired

"hedges fired       : " + str(hedges_fired) + " of " + str(sample) ^0
"  on the middle group : " + str(middle_count) + ", second attempt wins, this is the win" ^0
"  on the slow group   : " + str(slow_count + worst_count) + ", second attempt queues behind the first" ^0
"" ^0
int(hedges_fired * 100 / sample) => extra_load_pct
"  extra backend requests : " + str(extra_load_pct) + " percent" ^0
"  the group that is slow because the backend is busy receives" ^0
"  the extra request the hedge sends" ^0
"" ^0

# ---- the total, both directions ----

middle_count * (before_middle_ms - after_middle_ms) => ms_saved
slow_count * (after_slow_ms - before_slow_ms) => ms_added_slow
worst_count * (after_worst_ms - before_worst_ms) => ms_added_worst
ms_added_slow + ms_added_worst => ms_added

"milliseconds saved on the middle group : " + str(ms_saved) ^0
"milliseconds added to the slow groups  : " + str(ms_added) ^0
"net across the sample                  : " + str(ms_saved - ms_added) + " ms saved" ^0
"" ^0
"  the net is favourable and the percentile is favourable" ^0
"  and " + str(requests_worse) + " users wait longer than anyone waited before" ^0
"" ^0

# ---- the control ----
#
# The hedge, against what it was added to do. It was added to cut the tail
# above a hundred milliseconds without doubling load, and it did both.

"control - is the hedge working" ^0
"  p99 before : " + str(before_middle_ms) + " ms" ^0
"  p99 after  : " + str(after_middle_ms) + " ms" ^0
"  extra load : " + str(extra_load_pct) + " percent, not 100" ^0
"  requests helped : " + str(middle_count) ^0
"  defects in the hedge : 0" ^0
"" ^0
"  removing it returns " + str(middle_count) + " requests to " + str(before_middle_ms) + " ms to spare " + str(requests_worse) ^0
"" ^0

# ---- the null control ----
#
# The same hedge, same threshold, same distribution, on a backend with spare
# capacity. The second attempt lands on an idle path even for the slowest
# requests, so the group that got worse above does not exist.

before_worst_ms => nc_after_worst_ms

"null control - the same hedge with capacity to absorb it" ^0
"  p99 : " + str(before_middle_ms) + " to " + str(after_middle_ms) + " ms" ^0
"  max : " + str(before_worst_ms) + " to " + str(nc_after_worst_ms) + " ms" ^0
"  requests worse : 0" ^0
"  same hedge, same threshold, same percentile improvement" ^0
"  what changed is whether the extra request had somewhere to go" ^0
"" ^0

# ---- the rule ----

"what a percentile can and cannot report" ^0
"  the value at its position   : exactly" ^0
"  the values above it         : nothing, that is its definition" ^0
"  whether a change moved them : nothing" ^0
"  and a tail fix acts precisely on the region it cannot see" ^0
"" ^0
"publish the maximum next to the percentile, not because the" ^0
"maximum is a good statistic, but because it is the only one" ^0
"positioned where a tail intervention does its work" ^0
"" ^0

"The hedge cut the p99 from " + str(before_middle_ms) + " to " + str(after_middle_ms) + " ms, " + str(p99_better_pct) + " percent, for " + str(extra_load_pct) + " percent" ^0
"extra load rather than double, helping " + str(middle_count) + " requests and saving " + str(ms_saved - ms_added) + " ms net" ^0
"across the sample. The " + str(requests_worse) + " requests that were slow because the backend was" ^0
"busy each received an extra request into that backend, taking the maximum from" ^0
str(before_worst_ms) + " to " + str(after_worst_ms) + " ms - " + str(max_worse_pct) + " percent worse, entirely above the p99." ^0
```

## Python (deterministic transpilation)

```python
sample = 1000
fast_count = 900
middle_count = 95
slow_count = 4
worst_count = 1
fast_ms = 40
before_middle_ms = 120
before_slow_ms = 800
before_worst_ms = 1500
print("sample                  : " + str(sample) + " requests")
print("  " + str(fast_count) + " at " + str(fast_ms) + " ms")
print("  " + str(middle_count) + " at " + str(before_middle_ms) + " ms")
print("  " + str(slow_count) + " at " + str(before_slow_ms) + " ms")
print("  " + str(worst_count) + " at " + str(before_worst_ms) + " ms")
print("")
p99_position = int(sample * 99 / 100)
cumulative_at_middle = fast_count + middle_count
print("the p99 sits at position " + str(p99_position) + " of " + str(sample))
print("  requests at or below " + str(before_middle_ms) + " ms : " + str(cumulative_at_middle))
print("  so position " + str(p99_position) + " holds a " + str(before_middle_ms) + " ms request")
print("  requests above it : " + str(sample - p99_position))
print("")
after_middle_ms = 105
after_slow_ms = 860
after_worst_ms = 2300
print("metric        before      after     change")
print("  p50         " + str(fast_ms) + " ms       " + str(fast_ms) + " ms      none")
print("  p99         " + str(before_middle_ms) + " ms      " + str(after_middle_ms) + " ms     " + str(before_middle_ms - after_middle_ms) + " ms better")
print("  max         " + str(before_worst_ms) + " ms     " + str(after_worst_ms) + " ms    " + str(after_worst_ms - before_worst_ms) + " ms worse")
print("")
p99_better_pct = int((before_middle_ms - after_middle_ms) * 100 / before_middle_ms)
max_worse_pct = int((after_worst_ms - before_worst_ms) * 100 / before_worst_ms)
print("  p99 improved by : " + str(p99_better_pct) + " percent")
print("  max degraded by : " + str(max_worse_pct) + " percent")
print("")
requests_worse = slow_count + worst_count
requests_same_or_better = sample - requests_worse
print("group           count   before   after   direction")
print("  fast            " + str(fast_count) + "     " + str(fast_ms) + " ms    " + str(fast_ms) + " ms   unchanged, below the hedge")
print("  middle          " + str(middle_count) + "     " + str(before_middle_ms) + " ms   " + str(after_middle_ms) + " ms   better")
print("  slow            " + str(slow_count) + "      " + str(before_slow_ms) + " ms   " + str(after_slow_ms) + " ms   worse")
print("  worst           " + str(worst_count) + "      " + str(before_worst_ms) + " ms  " + str(after_worst_ms) + " ms  worse")
print("")
print("  requests better or unchanged : " + str(requests_same_or_better))
print("  requests worse               : " + str(requests_worse))
print("  requests worse, as a share   : " + str(int(requests_worse * 10000 / sample)) + " per ten thousand")
print("")
print("  every request that got worse is above the p99, by construction:")
print("  the hedge only fires on requests slower than " + str(100) + " ms")
print("")
hedges_fired = middle_count + slow_count + worst_count
print("hedges fired       : " + str(hedges_fired) + " of " + str(sample))
print("  on the middle group : " + str(middle_count) + ", second attempt wins, this is the win")
print("  on the slow group   : " + str(slow_count + worst_count) + ", second attempt queues behind the first")
print("")
extra_load_pct = int(hedges_fired * 100 / sample)
print("  extra backend requests : " + str(extra_load_pct) + " percent")
print("  the group that is slow because the backend is busy receives")
print("  the extra request the hedge sends")
print("")
ms_saved = middle_count * (before_middle_ms - after_middle_ms)
ms_added_slow = slow_count * (after_slow_ms - before_slow_ms)
ms_added_worst = worst_count * (after_worst_ms - before_worst_ms)
ms_added = ms_added_slow + ms_added_worst
print("milliseconds saved on the middle group : " + str(ms_saved))
print("milliseconds added to the slow groups  : " + str(ms_added))
print("net across the sample                  : " + str(ms_saved - ms_added) + " ms saved")
print("")
print("  the net is favourable and the percentile is favourable")
print("  and " + str(requests_worse) + " users wait longer than anyone waited before")
print("")
print("control - is the hedge working")
print("  p99 before : " + str(before_middle_ms) + " ms")
print("  p99 after  : " + str(after_middle_ms) + " ms")
print("  extra load : " + str(extra_load_pct) + " percent, not 100")
print("  requests helped : " + str(middle_count))
print("  defects in the hedge : 0")
print("")
print("  removing it returns " + str(middle_count) + " requests to " + str(before_middle_ms) + " ms to spare " + str(requests_worse))
print("")
nc_after_worst_ms = before_worst_ms
print("null control - the same hedge with capacity to absorb it")
print("  p99 : " + str(before_middle_ms) + " to " + str(after_middle_ms) + " ms")
print("  max : " + str(before_worst_ms) + " to " + str(nc_after_worst_ms) + " ms")
print("  requests worse : 0")
print("  same hedge, same threshold, same percentile improvement")
print("  what changed is whether the extra request had somewhere to go")
print("")
print("what a percentile can and cannot report")
print("  the value at its position   : exactly")
print("  the values above it         : nothing, that is its definition")
print("  whether a change moved them : nothing")
print("  and a tail fix acts precisely on the region it cannot see")
print("")
print("publish the maximum next to the percentile, not because the")
print("maximum is a good statistic, but because it is the only one")
print("positioned where a tail intervention does its work")
print("")
print("The hedge cut the p99 from " + str(before_middle_ms) + " to " + str(after_middle_ms) + " ms, " + str(p99_better_pct) + " percent, for " + str(extra_load_pct) + " percent")
print("extra load rather than double, helping " + str(middle_count) + " requests and saving " + str(ms_saved - ms_added) + " ms net")
print("across the sample. The " + str(requests_worse) + " requests that were slow because the backend was")
print("busy each received an extra request into that backend, taking the maximum from")
print(str(before_worst_ms) + " to " + str(after_worst_ms) + " ms - " + str(max_worse_pct) + " percent worse, entirely above the p99.")
```

## stdout (executed)

```text
sample                  : 1000 requests
  900 at 40 ms
  95 at 120 ms
  4 at 800 ms
  1 at 1500 ms

the p99 sits at position 990 of 1000
  requests at or below 120 ms : 995
  so position 990 holds a 120 ms request
  requests above it : 10

metric        before      after     change
  p50         40 ms       40 ms      none
  p99         120 ms      105 ms     15 ms better
  max         1500 ms     2300 ms    800 ms worse

  p99 improved by : 12 percent
  max degraded by : 53 percent

group           count   before   after   direction
  fast            900     40 ms    40 ms   unchanged, below the hedge
  middle          95     120 ms   105 ms   better
  slow            4      800 ms   860 ms   worse
  worst           1      1500 ms  2300 ms  worse

  requests better or unchanged : 995
  requests worse               : 5
  requests worse, as a share   : 50 per ten thousand

  every request that got worse is above the p99, by construction:
  the hedge only fires on requests slower than 100 ms

hedges fired       : 100 of 1000
  on the middle group : 95, second attempt wins, this is the win
  on the slow group   : 5, second attempt queues behind the first

  extra backend requests : 10 percent
  the group that is slow because the backend is busy receives
  the extra request the hedge sends

milliseconds saved on the middle group : 1425
milliseconds added to the slow groups  : 1040
net across the sample                  : 385 ms saved

  the net is favourable and the percentile is favourable
  and 5 users wait longer than anyone waited before

control - is the hedge working
  p99 before : 120 ms
  p99 after  : 105 ms
  extra load : 10 percent, not 100
  requests helped : 95
  defects in the hedge : 0

  removing it returns 95 requests to 120 ms to spare 5

null control - the same hedge with capacity to absorb it
  p99 : 120 to 105 ms
  max : 1500 to 1500 ms
  requests worse : 0
  same hedge, same threshold, same percentile improvement
  what changed is whether the extra request had somewhere to go

what a percentile can and cannot report
  the value at its position   : exactly
  the values above it         : nothing, that is its definition
  whether a change moved them : nothing
  and a tail fix acts precisely on the region it cannot see

publish the maximum next to the percentile, not because the
maximum is a good statistic, but because it is the only one
positioned where a tail intervention does its work

The hedge cut the p99 from 120 to 105 ms, 12 percent, for 10 percent
extra load rather than double, helping 95 requests and saving 385 ms net
across the sample. The 5 requests that were slow because the backend was
busy each received an extra request into that backend, taking the maximum from
1500 to 2300 ms - 53 percent worse, entirely above the p99.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
