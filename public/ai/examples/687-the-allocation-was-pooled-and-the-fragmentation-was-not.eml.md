<!-- canonical: efficientnewlanguage.org/ai/examples/687-the-allocation-was-pooled-and-the-fragmentation-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 687 — The allocation was pooled and the fragmentation was not

`the_allocation_was_pooled_and_the_fragmentation_was_not.eml` - The object pool cut allocations by ninety-eight percent and the measurement is right. What resident memory did is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The object pool
# cut allocations by ninety-eight percent and the measurement is right. What
# resident memory did is computed below.
#
# The pool was the correct response to a real problem. Allocation churn was
# dominating the profile, the collector ran often enough to show up in the
# latency tail, and pooling the hot object removed both: allocations per second
# fell from two hundred and forty thousand to four thousand eight hundred, and
# collector pauses fell with them. That is a real improvement and the profile
# says so.
#
# A pool holds a fixed slot and hands it out. The slot has to be big enough for
# the largest request it will serve, and every request smaller than that leaves
# the difference held and unusable.
#
# The slot is sixty-four kilobytes. The mean request is two point four.

240000 => allocations_before_per_second
4800 => allocations_after_per_second
8192 => pool_slots
65536 => slot_bytes
2400 => mean_requested_bytes
1240 => rss_before_mb
3180 => rss_after_mb

allocations_before_per_second - allocations_after_per_second => allocations_removed_per_second
int(allocations_removed_per_second * 10000 / allocations_before_per_second) => allocations_removed_per_myriad
pool_slots * slot_bytes => bytes_held_by_the_pool
pool_slots * mean_requested_bytes => bytes_actually_wanted
bytes_held_by_the_pool - bytes_actually_wanted => bytes_held_and_unusable
int(bytes_actually_wanted * 10000 / bytes_held_by_the_pool) => useful_per_myriad
rss_after_mb - rss_before_mb => rss_grew_by_mb

"allocations per second, before : " + str(allocations_before_per_second) ^0
"allocations per second, after  : " + str(allocations_after_per_second) ^0
"removed                        : " + str(allocations_removed_per_myriad) + " per ten thousand" ^0
"" ^0
"pool slots                     : " + str(pool_slots) ^0
"slot size, bytes               : " + str(slot_bytes) ^0
"mean request, bytes            : " + str(mean_requested_bytes) ^0
"bytes held by the pool         : " + str(bytes_held_by_the_pool) ^0
"bytes actually wanted          : " + str(bytes_actually_wanted) ^0
"held and unusable              : " + str(bytes_held_and_unusable) ^0
"useful share of the pool       : " + str(useful_per_myriad) + " per ten thousand" ^0
"" ^0
"resident memory before, MB     : " + str(rss_before_mb) ^0
"resident memory after, MB      : " + str(rss_after_mb) ^0
"grew by, MB                    : " + str(rss_grew_by_mb) ^0
"" ^0

# ---- what the pool verified ----

"the allocation profile" ^0
"  churn dominating the profile before : yes" ^0
"  collector pauses in the latency tail: yes" ^0
"  allocations per second after        : " + str(allocations_after_per_second) ^0
"  collector pauses after              : down with them" ^0
"  verdict                             : POOLED" ^0
"" ^0
"  the pool was the right response and reverting it would" ^0
"  bring back a measured problem" ^0
"" ^0

# ---- what a slot costs ----

"one slot" ^0
"  sized for  : the largest request it must serve" ^0
"  holds      : " + str(slot_bytes) + " bytes" ^0
"  typically carries : " + str(mean_requested_bytes) ^0
"  difference : held, resident, and not available to anything" ^0
"    else" ^0
"" ^0
"  a general allocator would have returned that difference;" ^0
"  a pool is the decision not to" ^0
"" ^0

# ---- why the win and the cost do not appear together ----

# Allocations per second is a rate on a profile. Resident memory is a level on
# a different dashboard, watched by a different alert, and it moved in the
# direction nobody was looking.
"the two measurements" ^0
"  allocations per second : the metric the change was made" ^0
"    for, and it improved" ^0
"  resident memory        : a level, on another dashboard" ^0
"  the change's write-up  : quotes the first" ^0
"  a number relating them : none, because they are units of" ^0
"    different things" ^0
"" ^0

# ---- null control ----

# The same pool, with slots sized by class - a small pool and a large one -
# rather than one slot sized for the maximum.
4096 => nc_small_slot_bytes
pool_slots * nc_small_slot_bytes => nc_bytes_held
int(bytes_actually_wanted * 10000 / nc_bytes_held) => nc_useful_per_myriad

"null control - slots sized by class" ^0
"  allocations per second : " + str(allocations_after_per_second) + ", unchanged" ^0
"  bytes held by the pool : " + str(nc_bytes_held) ^0
"  useful share           : " + str(nc_useful_per_myriad) + " per ten thousand" ^0
"  the pooling did not do less; the slot stopped being" ^0
"  sized for the request it almost never serves" ^0
"" ^0

# ---- the rule ----

"what pooling guarantees" ^0
"  the allocator is called less often : exactly" ^0
"  less memory is used                : not addressed, and" ^0
"    usually the reverse: a pool is memory retained on" ^0
"    purpose so that it does not have to be requested again" ^0
"" ^0
"an optimisation trades one resource for another; the" ^0
"write-up quotes the one it was made for, and the one it" ^0
"spends is on a dashboard with a different owner" ^0
"" ^0

"The pool removed " + str(allocations_removed_per_myriad) + " per ten thousand of the allocations - " + str(allocations_before_per_second) ^0
"a second down to " + str(allocations_after_per_second) + " - against a churn problem that was really dominating the" ^0
"profile. Each of its " + str(pool_slots) + " slots is sized at " + str(slot_bytes) + " bytes for a mean request of" ^0
str(mean_requested_bytes) + ", so " + str(bytes_held_and_unusable) + " bytes are held and unusable, " + str(useful_per_myriad) + " per ten thousand of the" ^0
"pool is doing work, and resident memory grew by " + str(rss_grew_by_mb) + " MB on a chart nobody quoted." ^0
```

## Python (deterministic transpilation)

```python
allocations_before_per_second = 240000
allocations_after_per_second = 4800
pool_slots = 8192
slot_bytes = 65536
mean_requested_bytes = 2400
rss_before_mb = 1240
rss_after_mb = 3180
allocations_removed_per_second = allocations_before_per_second - allocations_after_per_second
allocations_removed_per_myriad = int(allocations_removed_per_second * 10000 / allocations_before_per_second)
bytes_held_by_the_pool = pool_slots * slot_bytes
bytes_actually_wanted = pool_slots * mean_requested_bytes
bytes_held_and_unusable = bytes_held_by_the_pool - bytes_actually_wanted
useful_per_myriad = int(bytes_actually_wanted * 10000 / bytes_held_by_the_pool)
rss_grew_by_mb = rss_after_mb - rss_before_mb
print("allocations per second, before : " + str(allocations_before_per_second))
print("allocations per second, after  : " + str(allocations_after_per_second))
print("removed                        : " + str(allocations_removed_per_myriad) + " per ten thousand")
print("")
print("pool slots                     : " + str(pool_slots))
print("slot size, bytes               : " + str(slot_bytes))
print("mean request, bytes            : " + str(mean_requested_bytes))
print("bytes held by the pool         : " + str(bytes_held_by_the_pool))
print("bytes actually wanted          : " + str(bytes_actually_wanted))
print("held and unusable              : " + str(bytes_held_and_unusable))
print("useful share of the pool       : " + str(useful_per_myriad) + " per ten thousand")
print("")
print("resident memory before, MB     : " + str(rss_before_mb))
print("resident memory after, MB      : " + str(rss_after_mb))
print("grew by, MB                    : " + str(rss_grew_by_mb))
print("")
print("the allocation profile")
print("  churn dominating the profile before : yes")
print("  collector pauses in the latency tail: yes")
print("  allocations per second after        : " + str(allocations_after_per_second))
print("  collector pauses after              : down with them")
print("  verdict                             : POOLED")
print("")
print("  the pool was the right response and reverting it would")
print("  bring back a measured problem")
print("")
print("one slot")
print("  sized for  : the largest request it must serve")
print("  holds      : " + str(slot_bytes) + " bytes")
print("  typically carries : " + str(mean_requested_bytes))
print("  difference : held, resident, and not available to anything")
print("    else")
print("")
print("  a general allocator would have returned that difference;")
print("  a pool is the decision not to")
print("")
print("the two measurements")
print("  allocations per second : the metric the change was made")
print("    for, and it improved")
print("  resident memory        : a level, on another dashboard")
print("  the change's write-up  : quotes the first")
print("  a number relating them : none, because they are units of")
print("    different things")
print("")
nc_small_slot_bytes = 4096
nc_bytes_held = pool_slots * nc_small_slot_bytes
nc_useful_per_myriad = int(bytes_actually_wanted * 10000 / nc_bytes_held)
print("null control - slots sized by class")
print("  allocations per second : " + str(allocations_after_per_second) + ", unchanged")
print("  bytes held by the pool : " + str(nc_bytes_held))
print("  useful share           : " + str(nc_useful_per_myriad) + " per ten thousand")
print("  the pooling did not do less; the slot stopped being")
print("  sized for the request it almost never serves")
print("")
print("what pooling guarantees")
print("  the allocator is called less often : exactly")
print("  less memory is used                : not addressed, and")
print("    usually the reverse: a pool is memory retained on")
print("    purpose so that it does not have to be requested again")
print("")
print("an optimisation trades one resource for another; the")
print("write-up quotes the one it was made for, and the one it")
print("spends is on a dashboard with a different owner")
print("")
print("The pool removed " + str(allocations_removed_per_myriad) + " per ten thousand of the allocations - " + str(allocations_before_per_second))
print("a second down to " + str(allocations_after_per_second) + " - against a churn problem that was really dominating the")
print("profile. Each of its " + str(pool_slots) + " slots is sized at " + str(slot_bytes) + " bytes for a mean request of")
print(str(mean_requested_bytes) + ", so " + str(bytes_held_and_unusable) + " bytes are held and unusable, " + str(useful_per_myriad) + " per ten thousand of the")
print("pool is doing work, and resident memory grew by " + str(rss_grew_by_mb) + " MB on a chart nobody quoted.")
```

## stdout (executed)

```text
allocations per second, before : 240000
allocations per second, after  : 4800
removed                        : 9800 per ten thousand

pool slots                     : 8192
slot size, bytes               : 65536
mean request, bytes            : 2400
bytes held by the pool         : 536870912
bytes actually wanted          : 19660800
held and unusable              : 517210112
useful share of the pool       : 366 per ten thousand

resident memory before, MB     : 1240
resident memory after, MB      : 3180
grew by, MB                    : 1940

the allocation profile
  churn dominating the profile before : yes
  collector pauses in the latency tail: yes
  allocations per second after        : 4800
  collector pauses after              : down with them
  verdict                             : POOLED

  the pool was the right response and reverting it would
  bring back a measured problem

one slot
  sized for  : the largest request it must serve
  holds      : 65536 bytes
  typically carries : 2400
  difference : held, resident, and not available to anything
    else

  a general allocator would have returned that difference;
  a pool is the decision not to

the two measurements
  allocations per second : the metric the change was made
    for, and it improved
  resident memory        : a level, on another dashboard
  the change's write-up  : quotes the first
  a number relating them : none, because they are units of
    different things

null control - slots sized by class
  allocations per second : 4800, unchanged
  bytes held by the pool : 33554432
  useful share           : 5859 per ten thousand
  the pooling did not do less; the slot stopped being
  sized for the request it almost never serves

what pooling guarantees
  the allocator is called less often : exactly
  less memory is used                : not addressed, and
    usually the reverse: a pool is memory retained on
    purpose so that it does not have to be requested again

an optimisation trades one resource for another; the
write-up quotes the one it was made for, and the one it
spends is on a dashboard with a different owner

The pool removed 9800 per ten thousand of the allocations - 240000
a second down to 4800 - against a churn problem that was really dominating the
profile. Each of its 8192 slots is sized at 65536 bytes for a mean request of
2400, so 517210112 bytes are held and unusable, 366 per ten thousand of the
pool is doing work, and resident memory grew by 1940 MB on a chart nobody quoted.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
