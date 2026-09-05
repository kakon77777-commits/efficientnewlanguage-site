<!-- canonical: efficientnewlanguage.org/ai/examples/714-the-two-writers-used-the-same-key-and-different-clocks | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 714 — The two writers used the same key and different clocks

`the_two_writers_used_the_same_key_and_different_clocks.eml` - Conflicts resolve deterministically by last-write-wins and both hosts run a disciplined clock. How often the later write loses is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Conflicts resolve
# deterministically by last-write-wins and both hosts run a disciplined clock.
# How often the later write loses is computed below.
#
# The resolution rule is deterministic and that matters. Every replica applies
# the same comparison and converges on the same value, so there is no split
# brain and no operator has to choose; the alternative considered was a merge
# function, which the data model cannot support. Clocks are disciplined and the
# monitored offset stays under forty milliseconds.
#
# Last-write-wins compares TIMESTAMPS. Two writes are ordered by whichever
# host's clock read higher, and for two writes closer together than the offset
# between those clocks that is not the order they happened in.
#
# Conflicting writes are a median of twelve milliseconds apart.

8400000 => writes_per_day
24000 => conflicting_pairs_per_day
12 => median_gap_ms
40 => monitored_clock_offset_ms
19600 => pairs_closer_together_than_the_offset
0 => divergent_replicas

int(pairs_closer_together_than_the_offset / 2) => pairs_resolved_backwards
int(pairs_resolved_backwards * 10000 / conflicting_pairs_per_day) => backwards_per_myriad
conflicting_pairs_per_day - pairs_closer_together_than_the_offset => pairs_the_clocks_can_order

"writes per day                   : " + str(writes_per_day) ^0
"conflicting pairs per day        : " + str(conflicting_pairs_per_day) ^0
"median gap between them, ms      : " + str(median_gap_ms) ^0
"monitored clock offset, ms       : " + str(monitored_clock_offset_ms) ^0
"" ^0
"pairs the clocks can order       : " + str(pairs_the_clocks_can_order) ^0
"pairs closer than the offset     : " + str(pairs_closer_together_than_the_offset) ^0
"of those, resolved backwards     : " + str(pairs_resolved_backwards) ^0
"share of conflicts resolved backwards : " + str(backwards_per_myriad) + " per ten thousand" ^0
"divergent replicas               : " + str(divergent_replicas) ^0
"" ^0

# ---- what the rule guarantees ----

"last-write-wins" ^0
"  every replica applies the same comparison : yes" ^0
"  replicas converge on the same value       : yes" ^0
"  divergent replicas observed               : " + str(divergent_replicas) ^0
"  an operator has to choose                 : never" ^0
"  the alternative considered : a merge function the data" ^0
"    model cannot support" ^0
"  verdict : CONVERGENT" ^0
"" ^0
"  determinism is real and it is what makes this operable" ^0
"" ^0

# ---- what it compares ----

"the two operands" ^0
"  a timestamp from host A : A's clock" ^0
"  a timestamp from host B : B's clock" ^0
"  what makes them comparable : an assumption that the" ^0
"    offset between the clocks is smaller than the gap" ^0
"    between the writes" ^0
"  is that assumption monitored : the offset is; the gap" ^0
"    is not" ^0
"" ^0
"  the clock discipline is good and the quantity it is" ^0
"  good enough for is the one nobody measured" ^0
"" ^0

# ---- what convergence means here ----

# Every replica agrees, and what they agree on is the write whose host's clock
# was ahead. Consistency is total and the surviving value is the earlier edit
# about half the time.
"the outcome for one backwards pair" ^0
"  replicas agreeing on the value : all" ^0
"  the value they agree on        : the earlier write" ^0
"  a log line saying so           : none, both writes" ^0
"    succeeded and neither is an error" ^0
"  how a user notices             : their edit is gone" ^0
"" ^0

# ---- null control ----

# The same rule with a logical clock - a version vector - so ordering comes
# from causality rather than from two wall clocks.
0 => nc_pairs_resolved_backwards
pairs_closer_together_than_the_offset => nc_pairs_detected_as_concurrent

"null control - a version vector instead of a wall clock" ^0
"  divergent replicas      : " + str(divergent_replicas) + ", unchanged" ^0
"  pairs resolved backwards: " + str(nc_pairs_resolved_backwards) ^0
"  pairs reported concurrent : " + str(nc_pairs_detected_as_concurrent) + ", which is what they are" ^0
"  the rule did not become more deterministic; the ordering" ^0
"  stopped coming from two unrelated clocks" ^0
"" ^0

# ---- the rule ----

"what last-write-wins guarantees" ^0
"  every replica converges on one value : exactly" ^0
"  that value is the last write         : not addressed;" ^0
"    the comparison is between two clocks, and two clocks" ^0
"    order two events only when they are further apart" ^0
"    than the clocks are" ^0
"" ^0
"a conflict rule can be perfectly deterministic and still be" ^0
"deciding on the wrong quantity; clock discipline bounds the" ^0
"error and the writes have to be further apart than the bound" ^0
"" ^0

"The rule is deterministic and every replica converges - " + str(divergent_replicas) + " divergences, no" ^0
"operator ever chooses. It compares two hosts' clocks, monitored to within" ^0
str(monitored_clock_offset_ms) + " ms, against conflicting writes a median of " + str(median_gap_ms) + " ms apart, so " + str(pairs_closer_together_than_the_offset) ^0
"pairs a day are closer together than the clocks are and about " + str(pairs_resolved_backwards) + " of them -" ^0
str(backwards_per_myriad) + " per ten thousand of conflicts - converge on the earlier edit." ^0
```

## Python (deterministic transpilation)

```python
writes_per_day = 8400000
conflicting_pairs_per_day = 24000
median_gap_ms = 12
monitored_clock_offset_ms = 40
pairs_closer_together_than_the_offset = 19600
divergent_replicas = 0
pairs_resolved_backwards = int(pairs_closer_together_than_the_offset / 2)
backwards_per_myriad = int(pairs_resolved_backwards * 10000 / conflicting_pairs_per_day)
pairs_the_clocks_can_order = conflicting_pairs_per_day - pairs_closer_together_than_the_offset
print("writes per day                   : " + str(writes_per_day))
print("conflicting pairs per day        : " + str(conflicting_pairs_per_day))
print("median gap between them, ms      : " + str(median_gap_ms))
print("monitored clock offset, ms       : " + str(monitored_clock_offset_ms))
print("")
print("pairs the clocks can order       : " + str(pairs_the_clocks_can_order))
print("pairs closer than the offset     : " + str(pairs_closer_together_than_the_offset))
print("of those, resolved backwards     : " + str(pairs_resolved_backwards))
print("share of conflicts resolved backwards : " + str(backwards_per_myriad) + " per ten thousand")
print("divergent replicas               : " + str(divergent_replicas))
print("")
print("last-write-wins")
print("  every replica applies the same comparison : yes")
print("  replicas converge on the same value       : yes")
print("  divergent replicas observed               : " + str(divergent_replicas))
print("  an operator has to choose                 : never")
print("  the alternative considered : a merge function the data")
print("    model cannot support")
print("  verdict : CONVERGENT")
print("")
print("  determinism is real and it is what makes this operable")
print("")
print("the two operands")
print("  a timestamp from host A : A's clock")
print("  a timestamp from host B : B's clock")
print("  what makes them comparable : an assumption that the")
print("    offset between the clocks is smaller than the gap")
print("    between the writes")
print("  is that assumption monitored : the offset is; the gap")
print("    is not")
print("")
print("  the clock discipline is good and the quantity it is")
print("  good enough for is the one nobody measured")
print("")
print("the outcome for one backwards pair")
print("  replicas agreeing on the value : all")
print("  the value they agree on        : the earlier write")
print("  a log line saying so           : none, both writes")
print("    succeeded and neither is an error")
print("  how a user notices             : their edit is gone")
print("")
nc_pairs_resolved_backwards = 0
nc_pairs_detected_as_concurrent = pairs_closer_together_than_the_offset
print("null control - a version vector instead of a wall clock")
print("  divergent replicas      : " + str(divergent_replicas) + ", unchanged")
print("  pairs resolved backwards: " + str(nc_pairs_resolved_backwards))
print("  pairs reported concurrent : " + str(nc_pairs_detected_as_concurrent) + ", which is what they are")
print("  the rule did not become more deterministic; the ordering")
print("  stopped coming from two unrelated clocks")
print("")
print("what last-write-wins guarantees")
print("  every replica converges on one value : exactly")
print("  that value is the last write         : not addressed;")
print("    the comparison is between two clocks, and two clocks")
print("    order two events only when they are further apart")
print("    than the clocks are")
print("")
print("a conflict rule can be perfectly deterministic and still be")
print("deciding on the wrong quantity; clock discipline bounds the")
print("error and the writes have to be further apart than the bound")
print("")
print("The rule is deterministic and every replica converges - " + str(divergent_replicas) + " divergences, no")
print("operator ever chooses. It compares two hosts' clocks, monitored to within")
print(str(monitored_clock_offset_ms) + " ms, against conflicting writes a median of " + str(median_gap_ms) + " ms apart, so " + str(pairs_closer_together_than_the_offset))
print("pairs a day are closer together than the clocks are and about " + str(pairs_resolved_backwards) + " of them -")
print(str(backwards_per_myriad) + " per ten thousand of conflicts - converge on the earlier edit.")
```

## stdout (executed)

```text
writes per day                   : 8400000
conflicting pairs per day        : 24000
median gap between them, ms      : 12
monitored clock offset, ms       : 40

pairs the clocks can order       : 4400
pairs closer than the offset     : 19600
of those, resolved backwards     : 9800
share of conflicts resolved backwards : 4083 per ten thousand
divergent replicas               : 0

last-write-wins
  every replica applies the same comparison : yes
  replicas converge on the same value       : yes
  divergent replicas observed               : 0
  an operator has to choose                 : never
  the alternative considered : a merge function the data
    model cannot support
  verdict : CONVERGENT

  determinism is real and it is what makes this operable

the two operands
  a timestamp from host A : A's clock
  a timestamp from host B : B's clock
  what makes them comparable : an assumption that the
    offset between the clocks is smaller than the gap
    between the writes
  is that assumption monitored : the offset is; the gap
    is not

  the clock discipline is good and the quantity it is
  good enough for is the one nobody measured

the outcome for one backwards pair
  replicas agreeing on the value : all
  the value they agree on        : the earlier write
  a log line saying so           : none, both writes
    succeeded and neither is an error
  how a user notices             : their edit is gone

null control - a version vector instead of a wall clock
  divergent replicas      : 0, unchanged
  pairs resolved backwards: 0
  pairs reported concurrent : 19600, which is what they are
  the rule did not become more deterministic; the ordering
  stopped coming from two unrelated clocks

what last-write-wins guarantees
  every replica converges on one value : exactly
  that value is the last write         : not addressed;
    the comparison is between two clocks, and two clocks
    order two events only when they are further apart
    than the clocks are

a conflict rule can be perfectly deterministic and still be
deciding on the wrong quantity; clock discipline bounds the
error and the writes have to be further apart than the bound

The rule is deterministic and every replica converges - 0 divergences, no
operator ever chooses. It compares two hosts' clocks, monitored to within
40 ms, against conflicting writes a median of 12 ms apart, so 19600
pairs a day are closer together than the clocks are and about 9800 of them -
4083 per ten thousand of conflicts - converge on the earlier edit.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
