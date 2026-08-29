<!-- canonical: efficientnewlanguage.org/ai/examples/606-the-queue-drained-and-the-oldest-item-was-never-served | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 606 — The queue drained and the oldest item was never served

`the_queue_drained_and_the_oldest_item_was_never_served.eml` - A work queue is drained continuously, its depth is stable, and throughput matches arrivals. What happens to the item at the bottom is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A work queue is
# drained continuously, its depth is stable, and throughput matches arrivals.
# What happens to the item at the bottom is computed below.
#
# Serving the newest item first is correct here and it was chosen with a reason.
# These are interactive requests: a caller that has been waiting eight seconds
# has usually gone, and the response to it is thrown away, so spending a worker
# on the freshest item converts the same throughput into more answered callers.
# Under a burst it is measurably better than the alternative.
#
# A queue's depth is a level. It says how many are waiting, not which ones, and
# a level can hold perfectly still while its contents never turn over.
#
# The oldest item is the one every policy here agrees to postpone.

400 => arrivals_per_second
400 => service_per_second
1200 => queue_depth
8 => abandon_after_seconds

"arrivals per second : " + str(arrivals_per_second) ^0
"served per second   : " + str(service_per_second) ^0
"queue depth         : " + str(queue_depth) + ", stable" ^0
"abandon after       : " + str(abandon_after_seconds) + " seconds" ^0
"" ^0

# ---- the health of the queue ----

"the queue's own numbers" ^0
"  arrivals and departures balanced : yes, " + str(arrivals_per_second) + " each" ^0
"  depth trend                      : flat" ^0
"  overflow events                  : 0" ^0
"  items dropped by the queue       : 0" ^0
"  workers idle                     : 0" ^0
"" ^0
"  a queue that is not growing and not dropping" ^0
"" ^0

# ---- what the depth does not say ----

int(queue_depth / service_per_second) => nominal_wait_seconds

"if the queue were served oldest first" ^0
"  wait for any item : " + str(nominal_wait_seconds) + " seconds" ^0
"  items abandoned   : 0, since " + str(nominal_wait_seconds) + " is under " + str(abandon_after_seconds) ^0
"" ^0
"under newest-first, at the same depth and the same rates" ^0
"  wait for a newly arrived item : near zero" ^0
"  wait for the item at the bottom : it is passed over by every" ^0
"    arrival, and " + str(arrivals_per_second) + " arrive each second" ^0
"" ^0

# ---- the bottom of the queue over time ----

"second   arrivals since   served   position from the bottom" ^0
for s in [1:5]:
    s * arrivals_per_second => arrived
    s * service_per_second => served
    "  " + str(s) + "        " + str(arrived) + "             " + str(served) + "      " + str(queue_depth) ^0
"" ^0
"  the bottom item's position does not improve, because" ^0
"  arrivals and service are equal and service starts at the top" ^0
"" ^0

# ---- what it costs, per second ----

int(queue_depth * 100 / arrivals_per_second) => stuck_seconds_hundredths

"items that will never be served while the rate holds : " + str(queue_depth) ^0
"  that is " + str(int(stuck_seconds_hundredths / 100)) + " point " + str(stuck_seconds_hundredths % 100) + " seconds of arrivals" ^0
"  each of them a caller waiting past " + str(abandon_after_seconds) + " seconds" ^0
"" ^0

queue_depth => abandoned_total
int(abandoned_total * 10000 / (arrivals_per_second * 60)) => abandoned_per_myriad_per_minute

"  callers abandoned                : " + str(abandoned_total) ^0
"  arrivals per minute              : " + str(arrivals_per_second * 60) ^0
"  abandonment rate                 : " + str(abandoned_per_myriad_per_minute) + " per ten thousand" ^0
"" ^0

# ---- what each dashboard shows ----

"metric              value        reads as" ^0
"  queue depth         " + str(queue_depth) + "         stable, healthy" ^0
"  throughput          " + str(service_per_second) + "/s        matching demand" ^0
"  worker utilisation  100 percent  fully used" ^0
"  mean wait           near zero    excellent" ^0
"  oldest item age     not measured  -" ^0
"" ^0
"  the mean wait is near zero and it is the true mean:" ^0
"  almost every served item was served immediately" ^0
"" ^0

# ---- the control ----
#
# Newest-first, against what it was chosen for. Under a burst it answers more
# callers than oldest-first, because it does not spend workers on responses
# nobody is waiting for any more.

"control - is newest-first the better policy here" ^0
"  callers answered under newest-first, per second : " + str(service_per_second) ^0
"  callers answered under oldest-first during a burst : fewer," ^0
"    because some completions land after the caller left" ^0
"  wasted completions under newest-first : 0" ^0
"  defects in the policy : 0" ^0
"" ^0
"  the policy is right about the thing it optimises" ^0
"" ^0

# ---- the null control ----
#
# The same policy, same workers, same abandon threshold, when service exceeds
# arrivals. The queue empties, so the bottom is reached, and newest-first costs
# nothing at all.

520 => nc_service_per_second
nc_service_per_second - arrivals_per_second => nc_drain_per_second
int(queue_depth / nc_drain_per_second) => nc_seconds_to_empty

"null control - the same policy with spare service capacity" ^0
"  served per second : " + str(nc_service_per_second) ^0
"  net drain         : " + str(nc_drain_per_second) + " per second" ^0
"  seconds to empty  : " + str(nc_seconds_to_empty) ^0
"  items never served : 0" ^0
"  same policy, same queue, same threshold" ^0
"  the ordering only matters while the queue does not empty" ^0
"" ^0

# ---- the rule ----

"what a stable queue depth is evidence of" ^0
"  arrivals equal departures : yes, exactly" ^0
"  no item is stuck          : not implied, and here it is false" ^0
"  the level is a count, and a count has no identity in it" ^0
"" ^0
"the number that is missing is the age of the oldest item," ^0
"which under this policy is the only one a depth cannot bound" ^0
"" ^0

"The queue is balanced at " + str(arrivals_per_second) + " arrivals and " + str(service_per_second) + " completions a second, with 0" ^0
"overflows, 0 drops, 0 idle workers and a mean wait near zero, and newest-first" ^0
"is the policy that answers the most callers under a burst. At a steady depth of" ^0
str(queue_depth) + ", the items below the arrival point are passed over by all " + str(arrivals_per_second) + " arrivals" ^0
"each second, so " + str(abandoned_total) + " callers - " + str(abandoned_per_myriad_per_minute) + " per ten thousand a minute - wait past" ^0
str(abandon_after_seconds) + " seconds and leave, while every dashboard above reads healthy." ^0
```

## Python (deterministic transpilation)

```python
arrivals_per_second = 400
service_per_second = 400
queue_depth = 1200
abandon_after_seconds = 8
print("arrivals per second : " + str(arrivals_per_second))
print("served per second   : " + str(service_per_second))
print("queue depth         : " + str(queue_depth) + ", stable")
print("abandon after       : " + str(abandon_after_seconds) + " seconds")
print("")
print("the queue's own numbers")
print("  arrivals and departures balanced : yes, " + str(arrivals_per_second) + " each")
print("  depth trend                      : flat")
print("  overflow events                  : 0")
print("  items dropped by the queue       : 0")
print("  workers idle                     : 0")
print("")
print("  a queue that is not growing and not dropping")
print("")
nominal_wait_seconds = int(queue_depth / service_per_second)
print("if the queue were served oldest first")
print("  wait for any item : " + str(nominal_wait_seconds) + " seconds")
print("  items abandoned   : 0, since " + str(nominal_wait_seconds) + " is under " + str(abandon_after_seconds))
print("")
print("under newest-first, at the same depth and the same rates")
print("  wait for a newly arrived item : near zero")
print("  wait for the item at the bottom : it is passed over by every")
print("    arrival, and " + str(arrivals_per_second) + " arrive each second")
print("")
print("second   arrivals since   served   position from the bottom")
for s in range(1, 6):
    arrived = s * arrivals_per_second
    served = s * service_per_second
    print("  " + str(s) + "        " + str(arrived) + "             " + str(served) + "      " + str(queue_depth))
print("")
print("  the bottom item's position does not improve, because")
print("  arrivals and service are equal and service starts at the top")
print("")
stuck_seconds_hundredths = int(queue_depth * 100 / arrivals_per_second)
print("items that will never be served while the rate holds : " + str(queue_depth))
print("  that is " + str(int(stuck_seconds_hundredths / 100)) + " point " + str(stuck_seconds_hundredths % 100) + " seconds of arrivals")
print("  each of them a caller waiting past " + str(abandon_after_seconds) + " seconds")
print("")
abandoned_total = queue_depth
abandoned_per_myriad_per_minute = int(abandoned_total * 10000 / (arrivals_per_second * 60))
print("  callers abandoned                : " + str(abandoned_total))
print("  arrivals per minute              : " + str(arrivals_per_second * 60))
print("  abandonment rate                 : " + str(abandoned_per_myriad_per_minute) + " per ten thousand")
print("")
print("metric              value        reads as")
print("  queue depth         " + str(queue_depth) + "         stable, healthy")
print("  throughput          " + str(service_per_second) + "/s        matching demand")
print("  worker utilisation  100 percent  fully used")
print("  mean wait           near zero    excellent")
print("  oldest item age     not measured  -")
print("")
print("  the mean wait is near zero and it is the true mean:")
print("  almost every served item was served immediately")
print("")
print("control - is newest-first the better policy here")
print("  callers answered under newest-first, per second : " + str(service_per_second))
print("  callers answered under oldest-first during a burst : fewer,")
print("    because some completions land after the caller left")
print("  wasted completions under newest-first : 0")
print("  defects in the policy : 0")
print("")
print("  the policy is right about the thing it optimises")
print("")
nc_service_per_second = 520
nc_drain_per_second = nc_service_per_second - arrivals_per_second
nc_seconds_to_empty = int(queue_depth / nc_drain_per_second)
print("null control - the same policy with spare service capacity")
print("  served per second : " + str(nc_service_per_second))
print("  net drain         : " + str(nc_drain_per_second) + " per second")
print("  seconds to empty  : " + str(nc_seconds_to_empty))
print("  items never served : 0")
print("  same policy, same queue, same threshold")
print("  the ordering only matters while the queue does not empty")
print("")
print("what a stable queue depth is evidence of")
print("  arrivals equal departures : yes, exactly")
print("  no item is stuck          : not implied, and here it is false")
print("  the level is a count, and a count has no identity in it")
print("")
print("the number that is missing is the age of the oldest item,")
print("which under this policy is the only one a depth cannot bound")
print("")
print("The queue is balanced at " + str(arrivals_per_second) + " arrivals and " + str(service_per_second) + " completions a second, with 0")
print("overflows, 0 drops, 0 idle workers and a mean wait near zero, and newest-first")
print("is the policy that answers the most callers under a burst. At a steady depth of")
print(str(queue_depth) + ", the items below the arrival point are passed over by all " + str(arrivals_per_second) + " arrivals")
print("each second, so " + str(abandoned_total) + " callers - " + str(abandoned_per_myriad_per_minute) + " per ten thousand a minute - wait past")
print(str(abandon_after_seconds) + " seconds and leave, while every dashboard above reads healthy.")
```

## stdout (executed)

```text
arrivals per second : 400
served per second   : 400
queue depth         : 1200, stable
abandon after       : 8 seconds

the queue's own numbers
  arrivals and departures balanced : yes, 400 each
  depth trend                      : flat
  overflow events                  : 0
  items dropped by the queue       : 0
  workers idle                     : 0

  a queue that is not growing and not dropping

if the queue were served oldest first
  wait for any item : 3 seconds
  items abandoned   : 0, since 3 is under 8

under newest-first, at the same depth and the same rates
  wait for a newly arrived item : near zero
  wait for the item at the bottom : it is passed over by every
    arrival, and 400 arrive each second

second   arrivals since   served   position from the bottom
  1        400             400      1200
  2        800             800      1200
  3        1200             1200      1200
  4        1600             1600      1200
  5        2000             2000      1200

  the bottom item's position does not improve, because
  arrivals and service are equal and service starts at the top

items that will never be served while the rate holds : 1200
  that is 3 point 0 seconds of arrivals
  each of them a caller waiting past 8 seconds

  callers abandoned                : 1200
  arrivals per minute              : 24000
  abandonment rate                 : 500 per ten thousand

metric              value        reads as
  queue depth         1200         stable, healthy
  throughput          400/s        matching demand
  worker utilisation  100 percent  fully used
  mean wait           near zero    excellent
  oldest item age     not measured  -

  the mean wait is near zero and it is the true mean:
  almost every served item was served immediately

control - is newest-first the better policy here
  callers answered under newest-first, per second : 400
  callers answered under oldest-first during a burst : fewer,
    because some completions land after the caller left
  wasted completions under newest-first : 0
  defects in the policy : 0

  the policy is right about the thing it optimises

null control - the same policy with spare service capacity
  served per second : 520
  net drain         : 120 per second
  seconds to empty  : 10
  items never served : 0
  same policy, same queue, same threshold
  the ordering only matters while the queue does not empty

what a stable queue depth is evidence of
  arrivals equal departures : yes, exactly
  no item is stuck          : not implied, and here it is false
  the level is a count, and a count has no identity in it

the number that is missing is the age of the oldest item,
which under this policy is the only one a depth cannot bound

The queue is balanced at 400 arrivals and 400 completions a second, with 0
overflows, 0 drops, 0 idle workers and a mean wait near zero, and newest-first
is the policy that answers the most callers under a burst. At a steady depth of
1200, the items below the arrival point are passed over by all 400 arrivals
each second, so 1200 callers - 500 per ten thousand a minute - wait past
8 seconds and leave, while every dashboard above reads healthy.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
