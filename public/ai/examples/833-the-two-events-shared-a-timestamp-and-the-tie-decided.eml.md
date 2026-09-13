<!-- canonical: efficientnewlanguage.org/ai/examples/833-the-two-events-shared-a-timestamp-and-the-tie-decided | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 833 — The two events shared a timestamp and the tie decided

`the_two_events_shared_a_timestamp_and_the_tie_decided.eml` - Conflicts are resolved last-write-wins by timestamp, and the timestamps are real and correct. What resolution the timestamp has, against how close the events were, is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Conflicts are
# resolved last-write-wins by timestamp, and the timestamps are real and
# correct. What resolution the timestamp has, against how close the events were,
# is computed below.
#
# The resolution rule is sound. Every event carries a server timestamp from one
# clock, not many; the clock is monotonic and correct; last-write-wins is applied
# consistently; and the resolved value is logged with the timestamp that won.
#
# The timestamp has millisecond resolution, and the cause and its effect landed
# in the same millisecond.

5000000 => events_in_the_day
1 => timestamp_resolution_milliseconds
2 => events_that_shared_a_tick
1 => the_pair_where_effect_beat_cause
0 => clocks_in_play_beyond_one

events_that_shared_a_tick - the_pair_where_effect_beat_cause => pairs_the_tie_broke_correctly
the_pair_where_effect_beat_cause => last_write_wins_kept_the_earlier_value

"events in the day               : " + str(events_in_the_day) ^0
"timestamp resolution            : " + str(timestamp_resolution_milliseconds) + " millisecond" ^0
"clocks in play                  : 1" ^0
"events that shared a tick       : " + str(events_that_shared_a_tick) ^0
"  the tie broke correctly for   : " + str(pairs_the_tie_broke_correctly) ^0
"  it kept the earlier value in  : " + str(last_write_wins_kept_the_earlier_value) ^0
"" ^0

# ---- what the resolution rule verified ----

"the last-write-wins rule" ^0
"  timestamp source : one server clock, not many" ^0
"  the clock : monotonic and correct" ^0
"  applied : consistently, every conflict" ^0
"  logged : the resolved value with the winning timestamp" ^0
"  conflicts resolved by a wrong clock : 0" ^0
"  verdict : LATER WRITE KEPT" ^0
"" ^0
"  one clock rather than comparing timestamps across hosts" ^0
"  is the part done right here, and it is why skew is not" ^0
"  the problem" ^0
"" ^0

# ---- what the resolution cannot see ----

"the two events in one tick" ^0
"  the cause : written first" ^0
"  the effect : written microseconds later" ^0
"  their timestamps : identical, to the millisecond" ^0
"  what last-write-wins needs : which came later" ^0
"  what the timestamp provides : that they are the same" ^0
"    time" ^0
"  how the tie is broken : by arrival order at the store," ^0
"    which is not causal order" ^0
"" ^0

# ---- what the tie decided ----

"the pair the tie broke wrongly" ^0
"  what should have won : the effect, the later write" ^0
"  what won : the cause, because the tie-break put it last" ^0
"  the value kept : the earlier one" ^0
"  is any timestamp wrong : no; both are the real time," ^0
"    to the millisecond" ^0
"  is the millisecond fine enough to order them : no" ^0
"" ^0

# ---- null control ----

# The same events, ordered by a per-event sequence number the store assigns on
# arrival rather than by a shared-resolution timestamp.
1 => nc_pairs_the_timestamp_could_not_order
0 => nc_pairs_the_sequence_cannot_order
1 => nc_resolutions_that_flip

"null control - order by an assigned sequence number" ^0
"  pairs the timestamp could not order : " ^0
"    " + str(nc_pairs_the_timestamp_could_not_order) ^0
"  pairs the sequence cannot order : " ^0
"    " + str(nc_pairs_the_sequence_cannot_order) ^0
"  resolutions that flip : " + str(nc_resolutions_that_flip) ^0
"  no event and no clock changed; ordering stopped relying" ^0
"  on a timestamp too coarse to separate them" ^0
"" ^0

# ---- the rule ----

"what last-write-wins guarantees" ^0
"  the write with the later timestamp is kept : exactly," ^0
"    one correct clock, applied consistently" ^0
"  the later event is the one kept : not addressed;" ^0
"    timestamps have 1ms resolution and the two events" ^0
"    shared a tick - the tie broke by arrival order and kept" ^0
"    the earlier value in " + str(last_write_wins_kept_the_earlier_value) + " pair" ^0
"" ^0

"a timestamp orders events only as finely as it resolves them, and two events" ^0
"inside one tick are simultaneous to it; last-write-wins then chooses by" ^0
"whatever breaks the tie, and a tie-break is not a clock" ^0
"" ^0

"It resolves conflicts by one correct monotonic clock, applied consistently -" ^0
"the later timestamp kept. Resolution is 1ms and a cause and its effect shared a" ^0
"tick, so the tie broke by arrival order and kept the earlier value in " ^0
"" + str(last_write_wins_kept_the_earlier_value) + " of " + str(events_that_shared_a_tick) + ", under " + str(clocks_in_play_beyond_one) + " extra clocks to blame." ^0
```

## Python (deterministic transpilation)

```python
events_in_the_day = 5000000
timestamp_resolution_milliseconds = 1
events_that_shared_a_tick = 2
the_pair_where_effect_beat_cause = 1
clocks_in_play_beyond_one = 0
pairs_the_tie_broke_correctly = events_that_shared_a_tick - the_pair_where_effect_beat_cause
last_write_wins_kept_the_earlier_value = the_pair_where_effect_beat_cause
print("events in the day               : " + str(events_in_the_day))
print("timestamp resolution            : " + str(timestamp_resolution_milliseconds) + " millisecond")
print("clocks in play                  : 1")
print("events that shared a tick       : " + str(events_that_shared_a_tick))
print("  the tie broke correctly for   : " + str(pairs_the_tie_broke_correctly))
print("  it kept the earlier value in  : " + str(last_write_wins_kept_the_earlier_value))
print("")
print("the last-write-wins rule")
print("  timestamp source : one server clock, not many")
print("  the clock : monotonic and correct")
print("  applied : consistently, every conflict")
print("  logged : the resolved value with the winning timestamp")
print("  conflicts resolved by a wrong clock : 0")
print("  verdict : LATER WRITE KEPT")
print("")
print("  one clock rather than comparing timestamps across hosts")
print("  is the part done right here, and it is why skew is not")
print("  the problem")
print("")
print("the two events in one tick")
print("  the cause : written first")
print("  the effect : written microseconds later")
print("  their timestamps : identical, to the millisecond")
print("  what last-write-wins needs : which came later")
print("  what the timestamp provides : that they are the same")
print("    time")
print("  how the tie is broken : by arrival order at the store,")
print("    which is not causal order")
print("")
print("the pair the tie broke wrongly")
print("  what should have won : the effect, the later write")
print("  what won : the cause, because the tie-break put it last")
print("  the value kept : the earlier one")
print("  is any timestamp wrong : no; both are the real time,")
print("    to the millisecond")
print("  is the millisecond fine enough to order them : no")
print("")
nc_pairs_the_timestamp_could_not_order = 1
nc_pairs_the_sequence_cannot_order = 0
nc_resolutions_that_flip = 1
print("null control - order by an assigned sequence number")
print("  pairs the timestamp could not order : ")
print("    " + str(nc_pairs_the_timestamp_could_not_order))
print("  pairs the sequence cannot order : ")
print("    " + str(nc_pairs_the_sequence_cannot_order))
print("  resolutions that flip : " + str(nc_resolutions_that_flip))
print("  no event and no clock changed; ordering stopped relying")
print("  on a timestamp too coarse to separate them")
print("")
print("what last-write-wins guarantees")
print("  the write with the later timestamp is kept : exactly,")
print("    one correct clock, applied consistently")
print("  the later event is the one kept : not addressed;")
print("    timestamps have 1ms resolution and the two events")
print("    shared a tick - the tie broke by arrival order and kept")
print("    the earlier value in " + str(last_write_wins_kept_the_earlier_value) + " pair")
print("")
print("a timestamp orders events only as finely as it resolves them, and two events")
print("inside one tick are simultaneous to it; last-write-wins then chooses by")
print("whatever breaks the tie, and a tie-break is not a clock")
print("")
print("It resolves conflicts by one correct monotonic clock, applied consistently -")
print("the later timestamp kept. Resolution is 1ms and a cause and its effect shared a")
print("tick, so the tie broke by arrival order and kept the earlier value in ")
print("" + str(last_write_wins_kept_the_earlier_value) + " of " + str(events_that_shared_a_tick) + ", under " + str(clocks_in_play_beyond_one) + " extra clocks to blame.")
```

## stdout (executed)

```text
events in the day               : 5000000
timestamp resolution            : 1 millisecond
clocks in play                  : 1
events that shared a tick       : 2
  the tie broke correctly for   : 1
  it kept the earlier value in  : 1

the last-write-wins rule
  timestamp source : one server clock, not many
  the clock : monotonic and correct
  applied : consistently, every conflict
  logged : the resolved value with the winning timestamp
  conflicts resolved by a wrong clock : 0
  verdict : LATER WRITE KEPT

  one clock rather than comparing timestamps across hosts
  is the part done right here, and it is why skew is not
  the problem

the two events in one tick
  the cause : written first
  the effect : written microseconds later
  their timestamps : identical, to the millisecond
  what last-write-wins needs : which came later
  what the timestamp provides : that they are the same
    time
  how the tie is broken : by arrival order at the store,
    which is not causal order

the pair the tie broke wrongly
  what should have won : the effect, the later write
  what won : the cause, because the tie-break put it last
  the value kept : the earlier one
  is any timestamp wrong : no; both are the real time,
    to the millisecond
  is the millisecond fine enough to order them : no

null control - order by an assigned sequence number
  pairs the timestamp could not order : 
    1
  pairs the sequence cannot order : 
    0
  resolutions that flip : 1
  no event and no clock changed; ordering stopped relying
  on a timestamp too coarse to separate them

what last-write-wins guarantees
  the write with the later timestamp is kept : exactly,
    one correct clock, applied consistently
  the later event is the one kept : not addressed;
    timestamps have 1ms resolution and the two events
    shared a tick - the tie broke by arrival order and kept
    the earlier value in 1 pair

a timestamp orders events only as finely as it resolves them, and two events
inside one tick are simultaneous to it; last-write-wins then chooses by
whatever breaks the tie, and a tie-break is not a clock

It resolves conflicts by one correct monotonic clock, applied consistently -
the later timestamp kept. Resolution is 1ms and a cause and its effect shared a
tick, so the tie broke by arrival order and kept the earlier value in 
1 of 2, under 0 extra clocks to blame.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
