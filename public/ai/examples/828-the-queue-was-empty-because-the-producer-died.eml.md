<!-- canonical: efficientnewlanguage.org/ai/examples/828-the-queue-was-empty-because-the-producer-died | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 828 — The queue was empty because the producer died

`the_queue_was_empty_because_the_producer_died.eml` - The consumer autoscaler scaled down to its floor when the queue drained, and its rule read the depth correctly. What a depth of zero means is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The consumer
# autoscaler scaled down to its floor when the queue drained, and its rule read
# the depth correctly. What a depth of zero means is computed below.
#
# The autoscaler is well built. It reads the true queue depth, not a proxy; it
# scales on a sustained reading, not a single dip; it keeps a floor of one
# consumer; and it logs every scaling decision with the depth that triggered it.
#
# A depth of zero can mean the consumers are caught up, or that nothing is
# arriving. The rule treats it as caught up.

0 => queue_depth
12 => consumers_before
1 => consumers_after_scaledown
25 => minutes_the_producer_was_dead
800 => messages_that_would_have_arrived_per_minute
1 => meanings_a_zero_depth_actually_has_beyond_one

minutes_the_producer_was_dead * messages_that_would_have_arrived_per_minute => backlog_waiting_when_the_producer_recovers
consumers_before - consumers_after_scaledown => consumers_removed

"queue depth                     : " + str(queue_depth) ^0
"consumers before                : " + str(consumers_before) ^0
"consumers after scaledown       : " + str(consumers_after_scaledown) ^0
"  removed                       : " + str(consumers_removed) ^0
"minutes the producer was dead   : " + str(minutes_the_producer_was_dead) ^0
"messages per minute that stopped: " + str(messages_that_would_have_arrived_per_minute) ^0
"backlog waiting on recovery     : " + str(backlog_waiting_when_the_producer_recovers) ^0
"" ^0

# ---- what the autoscaler verified ----

"the autoscaler" ^0
"  reads : the true queue depth, not a proxy" ^0
"  scales on : a sustained reading, not one dip" ^0
"  floor : one consumer" ^0
"  logs : every decision with its trigger depth" ^0
"  the depth it read : " + str(queue_depth) ^0
"  verdict : CAUGHT UP, SCALE DOWN" ^0
"" ^0
"  scaling on a sustained reading rather than a single dip" ^0
"  is the part done right here, and it is why a brief lull" ^0
"  does not thrash the fleet" ^0
"" ^0

# ---- what a zero depth means ----

"the reading of zero" ^0
"  meaning one : the consumers cleared the backlog" ^0
"  meaning two : nothing is arriving to clear" ^0
"  which one held here : two; the producer was dead" ^0
"  what distinguishes them : the arrival rate, which the" ^0
"    depth does not carry" ^0
"  what the rule assumed : meaning one" ^0
"" ^0

# ---- what the scaledown set up ----

"the recovery that is coming" ^0
"  minutes the producer was dead : " + str(minutes_the_producer_was_dead) ^0
"  messages that will arrive at once : " ^0
"    " + str(backlog_waiting_when_the_producer_recovers) ^0
"  consumers left to take them : " + str(consumers_after_scaledown) ^0
"  did the autoscaler misread the depth : no; it was zero" ^0
"  did it misread what zero meant : yes" ^0
"" ^0

# ---- null control ----

# The same lull, with the autoscaler reading arrival rate alongside depth and
# holding capacity when arrivals stop rather than when the backlog clears.
1 => nc_consumers_after_when_rate_is_read
25 => nc_minutes_it_would_have_held_capacity
0 => nc_depth_still_zero

"null control - read arrival rate, not depth alone" ^0
"  depth still zero : " + str(nc_depth_still_zero) ^0
"  consumers held when arrivals stop : " ^0
"    " + str(consumers_before) ^0
"  minutes it would have held capacity : " ^0
"    " + str(nc_minutes_it_would_have_held_capacity) ^0
"  no message and no depth changed; the rule stopped" ^0
"  reading an empty queue as finished work" ^0
"" ^0

# ---- the rule ----

"what an empty queue guarantees" ^0
"  the depth is zero : exactly, read truly, sustained, not" ^0
"    a single dip" ^0
"  there is no work to do : not addressed; a depth of zero" ^0
"    is 'caught up' or 'nothing is arriving', and here the" ^0
"    producer was dead " + str(minutes_the_producer_was_dead) + " minutes - the autoscaler read" ^0
"    starvation as completion and scaled " + str(consumers_before) + " to " + str(consumers_after_scaledown) ^0
"" ^0

"a depth measures the gap between what arrived and what was consumed, and zero" ^0
"is that gap closed from either side; without the arrival rate beside it, an" ^0
"idle queue and a starved one are the same number" ^0
"" ^0

"It reads the true depth on a sustained signal with a floor of one - a correct" ^0
"read of zero. Zero meant the producer was dead " + str(minutes_the_producer_was_dead) + " minutes, not caught up, so" ^0
"it cut " + str(consumers_before) + " consumers to " + str(consumers_after_scaledown) + " with " + str(backlog_waiting_when_the_producer_recovers) + " messages about to arrive at once." ^0
```

## Python (deterministic transpilation)

```python
queue_depth = 0
consumers_before = 12
consumers_after_scaledown = 1
minutes_the_producer_was_dead = 25
messages_that_would_have_arrived_per_minute = 800
meanings_a_zero_depth_actually_has_beyond_one = 1
backlog_waiting_when_the_producer_recovers = minutes_the_producer_was_dead * messages_that_would_have_arrived_per_minute
consumers_removed = consumers_before - consumers_after_scaledown
print("queue depth                     : " + str(queue_depth))
print("consumers before                : " + str(consumers_before))
print("consumers after scaledown       : " + str(consumers_after_scaledown))
print("  removed                       : " + str(consumers_removed))
print("minutes the producer was dead   : " + str(minutes_the_producer_was_dead))
print("messages per minute that stopped: " + str(messages_that_would_have_arrived_per_minute))
print("backlog waiting on recovery     : " + str(backlog_waiting_when_the_producer_recovers))
print("")
print("the autoscaler")
print("  reads : the true queue depth, not a proxy")
print("  scales on : a sustained reading, not one dip")
print("  floor : one consumer")
print("  logs : every decision with its trigger depth")
print("  the depth it read : " + str(queue_depth))
print("  verdict : CAUGHT UP, SCALE DOWN")
print("")
print("  scaling on a sustained reading rather than a single dip")
print("  is the part done right here, and it is why a brief lull")
print("  does not thrash the fleet")
print("")
print("the reading of zero")
print("  meaning one : the consumers cleared the backlog")
print("  meaning two : nothing is arriving to clear")
print("  which one held here : two; the producer was dead")
print("  what distinguishes them : the arrival rate, which the")
print("    depth does not carry")
print("  what the rule assumed : meaning one")
print("")
print("the recovery that is coming")
print("  minutes the producer was dead : " + str(minutes_the_producer_was_dead))
print("  messages that will arrive at once : ")
print("    " + str(backlog_waiting_when_the_producer_recovers))
print("  consumers left to take them : " + str(consumers_after_scaledown))
print("  did the autoscaler misread the depth : no; it was zero")
print("  did it misread what zero meant : yes")
print("")
nc_consumers_after_when_rate_is_read = 1
nc_minutes_it_would_have_held_capacity = 25
nc_depth_still_zero = 0
print("null control - read arrival rate, not depth alone")
print("  depth still zero : " + str(nc_depth_still_zero))
print("  consumers held when arrivals stop : ")
print("    " + str(consumers_before))
print("  minutes it would have held capacity : ")
print("    " + str(nc_minutes_it_would_have_held_capacity))
print("  no message and no depth changed; the rule stopped")
print("  reading an empty queue as finished work")
print("")
print("what an empty queue guarantees")
print("  the depth is zero : exactly, read truly, sustained, not")
print("    a single dip")
print("  there is no work to do : not addressed; a depth of zero")
print("    is 'caught up' or 'nothing is arriving', and here the")
print("    producer was dead " + str(minutes_the_producer_was_dead) + " minutes - the autoscaler read")
print("    starvation as completion and scaled " + str(consumers_before) + " to " + str(consumers_after_scaledown))
print("")
print("a depth measures the gap between what arrived and what was consumed, and zero")
print("is that gap closed from either side; without the arrival rate beside it, an")
print("idle queue and a starved one are the same number")
print("")
print("It reads the true depth on a sustained signal with a floor of one - a correct")
print("read of zero. Zero meant the producer was dead " + str(minutes_the_producer_was_dead) + " minutes, not caught up, so")
print("it cut " + str(consumers_before) + " consumers to " + str(consumers_after_scaledown) + " with " + str(backlog_waiting_when_the_producer_recovers) + " messages about to arrive at once.")
```

## stdout (executed)

```text
queue depth                     : 0
consumers before                : 12
consumers after scaledown       : 1
  removed                       : 11
minutes the producer was dead   : 25
messages per minute that stopped: 800
backlog waiting on recovery     : 20000

the autoscaler
  reads : the true queue depth, not a proxy
  scales on : a sustained reading, not one dip
  floor : one consumer
  logs : every decision with its trigger depth
  the depth it read : 0
  verdict : CAUGHT UP, SCALE DOWN

  scaling on a sustained reading rather than a single dip
  is the part done right here, and it is why a brief lull
  does not thrash the fleet

the reading of zero
  meaning one : the consumers cleared the backlog
  meaning two : nothing is arriving to clear
  which one held here : two; the producer was dead
  what distinguishes them : the arrival rate, which the
    depth does not carry
  what the rule assumed : meaning one

the recovery that is coming
  minutes the producer was dead : 25
  messages that will arrive at once : 
    20000
  consumers left to take them : 1
  did the autoscaler misread the depth : no; it was zero
  did it misread what zero meant : yes

null control - read arrival rate, not depth alone
  depth still zero : 0
  consumers held when arrivals stop : 
    12
  minutes it would have held capacity : 
    25
  no message and no depth changed; the rule stopped
  reading an empty queue as finished work

what an empty queue guarantees
  the depth is zero : exactly, read truly, sustained, not
    a single dip
  there is no work to do : not addressed; a depth of zero
    is 'caught up' or 'nothing is arriving', and here the
    producer was dead 25 minutes - the autoscaler read
    starvation as completion and scaled 12 to 1

a depth measures the gap between what arrived and what was consumed, and zero
is that gap closed from either side; without the arrival rate beside it, an
idle queue and a starved one are the same number

It reads the true depth on a sustained signal with a floor of one - a correct
read of zero. Zero meant the producer was dead 25 minutes, not caught up, so
it cut 12 consumers to 1 with 20000 messages about to arrive at once.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
