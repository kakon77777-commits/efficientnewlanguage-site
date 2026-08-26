<!-- canonical: efficientnewlanguage.org/ai/examples/554-the-buffer-was-sized-for-the-average-and-the-burst-was-the-point | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 554 — The buffer was sized for the average and the burst was the point

`the_buffer_was_sized_for_the_average_and_the_burst_was_the_point.eml` - Events arrive at 100 a second on average. The buffer holds 200, which is twice the average, and the consumer drains 120 a second. What happens during the burst is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Events arrive at
# 100 a second on average. The buffer holds 200, which is twice the average, and
# the consumer drains 120 a second. What happens during the burst is computed
# below.
#
# Sizing at twice the average is a real rule, applied deliberately, and it was
# defended in review with two correct arguments. Memory is not free and a buffer
# is memory held permanently against an event that may not come. And an
# oversized buffer is worse than a small one under sustained overload: it
# absorbs the backlog silently, so the producer never sees backpressure and the
# consumer serves data that is minutes stale. Both of these are true.
#
# Both arguments are about SUSTAINED load, where the buffer's job is to be
# small. A buffer's other job is to absorb a burst, where its job is to be
# large enough for the burst. The two jobs are sized by different numbers, and
# the average is not one of them.
#
# What a burst costs is the burst size minus what drains during it. Neither term
# is the average arrival rate. The average appears nowhere in the calculation
# that decides whether events are lost.

100 => mean_rate
200 => buffer
120 => drain_rate
800 => burst_rate
3 => burst_seconds

"average arrival : " + str(mean_rate) + " per second" ^0
"buffer          : " + str(buffer) + ", which is " + str(int(buffer / mean_rate)) + " times the average" ^0
"consumer drains : " + str(drain_rate) + " per second" ^0
"" ^0

# ---- steady state ----
#
# At the average rate the consumer is faster than the producer, so the buffer
# is empty. Every graph of buffer depth reads zero.

"steady state at " + str(mean_rate) + " per second" ^0
"  arrivals per second : " + str(mean_rate) ^0
"  drained per second  : " + str(drain_rate) ^0
"  buffer depth        : 0, the consumer is " + str(drain_rate - mean_rate) + " per second faster" ^0
"  headroom used       : 0 of " + str(buffer) ^0
"" ^0

# ---- the burst ----

burst_rate * burst_seconds => arrived
drain_rate * burst_seconds => drained_during
buffer + drained_during => absorbed
arrived - absorbed => dropped

"a burst of " + str(burst_rate) + " per second for " + str(burst_seconds) + " seconds" ^0
"  events arriving      : " + str(arrived) ^0
"  drained during it    : " + str(drained_during) ^0
"  held by the buffer   : " + str(buffer) ^0
"  absorbed in total    : " + str(absorbed) ^0
"  dropped              : " + str(dropped) + ", which is " + str(int(dropped * 100 / arrived)) + " percent of the burst" ^0
"" ^0

"second   arriving   drained   in buffer   dropped this second" ^0
0 => depth
0 => running_dropped
for t in [1:5]:
    if t <= burst_seconds:
        burst_rate => arriving
    else:
        mean_rate => arriving
    depth + arriving => depth
    if depth > drain_rate:
        drain_rate => drained
    else:
        depth => drained
    depth - drained => depth
    if depth > buffer:
        depth - buffer => lost
        buffer => depth
    else:
        0 => lost
    running_dropped + lost => running_dropped
    "  " + str(t) + "        " + str(arriving) + "        " + str(drained) + "       " + str(depth) + "         " + str(lost) ^0
"  total dropped: " + str(running_dropped) ^0
"" ^0

# ---- what size would have held it ----

arrived - drained_during => needed

"to lose nothing" ^0
"  buffer needed : " + str(needed) ^0
"  buffer sized  : " + str(buffer) ^0
"  short by      : " + str(needed - buffer) + ", a factor of " + str(int(needed / buffer)) ^0
"  expressed against the average, that is " + str(int(needed / mean_rate)) + " times the mean" ^0
"  the rule that was applied said 2 times the mean" ^0
"" ^0

# ---- the two sizing questions ----

"what each sizing rule is answering" ^0
"  2x the average        : how much do I hold when the consumer keeps up" ^0
"  burst minus drain     : how much do I hold when it does not" ^0
"  the first is about memory cost, and its answer is 'as little as possible'" ^0
"  the second is about loss, and its answer has no upper bound in the average" ^0
"  a buffer that never fills in steady state tells you nothing about either" ^0
"" ^0

# ---- the control ----
#
# The two arguments made in review are both correct, and this is the case they
# were correct about: sustained overload. Here a large buffer really is worse -
# it hides the overload and serves stale data. The review was right about the
# case it considered.

180 => sustained_rate
60 => sustained_seconds
"control - sustained overload at " + str(sustained_rate) + " per second, which the review was arguing about" ^0
(sustained_rate - drain_rate) * sustained_seconds => sustained_backlog
"  excess per second      : " + str(sustained_rate - drain_rate) ^0
"  backlog after " + str(sustained_seconds) + " seconds: " + str(sustained_backlog) + " if nothing is dropped" ^0
"  with a buffer of " + str(buffer) + "  : fills in " + str(int(buffer / (sustained_rate - drain_rate))) + " seconds, then drops, and the producer learns" ^0
"  with a buffer of " + str(needed) + " : fills in " + str(int(needed / (sustained_rate - drain_rate))) + " seconds, serving data that old before anyone hears" ^0
"  the small buffer is genuinely better here, exactly as argued" ^0
"" ^0

# ---- the null control ----
#
# The same 200-event buffer against a burst it is actually sized for. Nothing is
# lost. The buffer is not too small in general; it is too small for this burst,
# and the sizing rule never looked at any burst.

300 => small_burst_rate
1 => small_burst_seconds
small_burst_rate * small_burst_seconds => small_arrived
drain_rate * small_burst_seconds => small_drained
"null control - a burst of " + str(small_burst_rate) + " per second for " + str(small_burst_seconds) + " second" ^0
"  arrived        : " + str(small_arrived) ^0
"  drained        : " + str(small_drained) ^0
"  buffer holds   : " + str(small_arrived - small_drained) + " of " + str(buffer) ^0
"  dropped        : 0" ^0
"  same buffer, same rule, same consumer, and nothing is lost" ^0
"  the rule is not wrong in size, it is wrong in what it consulted" ^0
"" ^0

"Twice the average is a real rule with two correct arguments behind it: memory" ^0
"is held permanently, and an oversized buffer hides sustained overload until the" ^0
"data is stale. Both are about sustained load. The other thing a buffer does is" ^0
"absorb a burst, and that is sized by the burst and the drain rate, neither of" ^0
"which is an average. " + str(arrived) + " events arrived in " + str(burst_seconds) + " seconds, " + str(absorbed) + " were absorbed," ^0
"and " + str(dropped) + " were dropped by a buffer whose depth graph had never left zero." ^0
```

## Python (deterministic transpilation)

```python
mean_rate = 100
buffer = 200
drain_rate = 120
burst_rate = 800
burst_seconds = 3
print("average arrival : " + str(mean_rate) + " per second")
print("buffer          : " + str(buffer) + ", which is " + str(int(buffer / mean_rate)) + " times the average")
print("consumer drains : " + str(drain_rate) + " per second")
print("")
print("steady state at " + str(mean_rate) + " per second")
print("  arrivals per second : " + str(mean_rate))
print("  drained per second  : " + str(drain_rate))
print("  buffer depth        : 0, the consumer is " + str(drain_rate - mean_rate) + " per second faster")
print("  headroom used       : 0 of " + str(buffer))
print("")
arrived = burst_rate * burst_seconds
drained_during = drain_rate * burst_seconds
absorbed = buffer + drained_during
dropped = arrived - absorbed
print("a burst of " + str(burst_rate) + " per second for " + str(burst_seconds) + " seconds")
print("  events arriving      : " + str(arrived))
print("  drained during it    : " + str(drained_during))
print("  held by the buffer   : " + str(buffer))
print("  absorbed in total    : " + str(absorbed))
print("  dropped              : " + str(dropped) + ", which is " + str(int(dropped * 100 / arrived)) + " percent of the burst")
print("")
print("second   arriving   drained   in buffer   dropped this second")
depth = 0
running_dropped = 0
for t in range(1, 6):
    if t <= burst_seconds:
        arriving = burst_rate
    else:
        arriving = mean_rate
    depth = depth + arriving
    if depth > drain_rate:
        drained = drain_rate
    else:
        drained = depth
    depth = depth - drained
    if depth > buffer:
        lost = depth - buffer
        depth = buffer
    else:
        lost = 0
    running_dropped = running_dropped + lost
    print("  " + str(t) + "        " + str(arriving) + "        " + str(drained) + "       " + str(depth) + "         " + str(lost))
print("  total dropped: " + str(running_dropped))
print("")
needed = arrived - drained_during
print("to lose nothing")
print("  buffer needed : " + str(needed))
print("  buffer sized  : " + str(buffer))
print("  short by      : " + str(needed - buffer) + ", a factor of " + str(int(needed / buffer)))
print("  expressed against the average, that is " + str(int(needed / mean_rate)) + " times the mean")
print("  the rule that was applied said 2 times the mean")
print("")
print("what each sizing rule is answering")
print("  2x the average        : how much do I hold when the consumer keeps up")
print("  burst minus drain     : how much do I hold when it does not")
print("  the first is about memory cost, and its answer is 'as little as possible'")
print("  the second is about loss, and its answer has no upper bound in the average")
print("  a buffer that never fills in steady state tells you nothing about either")
print("")
sustained_rate = 180
sustained_seconds = 60
print("control - sustained overload at " + str(sustained_rate) + " per second, which the review was arguing about")
sustained_backlog = (sustained_rate - drain_rate) * sustained_seconds
print("  excess per second      : " + str(sustained_rate - drain_rate))
print("  backlog after " + str(sustained_seconds) + " seconds: " + str(sustained_backlog) + " if nothing is dropped")
print("  with a buffer of " + str(buffer) + "  : fills in " + str(int(buffer / (sustained_rate - drain_rate))) + " seconds, then drops, and the producer learns")
print("  with a buffer of " + str(needed) + " : fills in " + str(int(needed / (sustained_rate - drain_rate))) + " seconds, serving data that old before anyone hears")
print("  the small buffer is genuinely better here, exactly as argued")
print("")
small_burst_rate = 300
small_burst_seconds = 1
small_arrived = small_burst_rate * small_burst_seconds
small_drained = drain_rate * small_burst_seconds
print("null control - a burst of " + str(small_burst_rate) + " per second for " + str(small_burst_seconds) + " second")
print("  arrived        : " + str(small_arrived))
print("  drained        : " + str(small_drained))
print("  buffer holds   : " + str(small_arrived - small_drained) + " of " + str(buffer))
print("  dropped        : 0")
print("  same buffer, same rule, same consumer, and nothing is lost")
print("  the rule is not wrong in size, it is wrong in what it consulted")
print("")
print("Twice the average is a real rule with two correct arguments behind it: memory")
print("is held permanently, and an oversized buffer hides sustained overload until the")
print("data is stale. Both are about sustained load. The other thing a buffer does is")
print("absorb a burst, and that is sized by the burst and the drain rate, neither of")
print("which is an average. " + str(arrived) + " events arrived in " + str(burst_seconds) + " seconds, " + str(absorbed) + " were absorbed,")
print("and " + str(dropped) + " were dropped by a buffer whose depth graph had never left zero.")
```

## stdout (executed)

```text
average arrival : 100 per second
buffer          : 200, which is 2 times the average
consumer drains : 120 per second

steady state at 100 per second
  arrivals per second : 100
  drained per second  : 120
  buffer depth        : 0, the consumer is 20 per second faster
  headroom used       : 0 of 200

a burst of 800 per second for 3 seconds
  events arriving      : 2400
  drained during it    : 360
  held by the buffer   : 200
  absorbed in total    : 560
  dropped              : 1840, which is 76 percent of the burst

second   arriving   drained   in buffer   dropped this second
  1        800        120       200         480
  2        800        120       200         680
  3        800        120       200         680
  4        100        120       180         0
  5        100        120       160         0
  total dropped: 1840

to lose nothing
  buffer needed : 2040
  buffer sized  : 200
  short by      : 1840, a factor of 10
  expressed against the average, that is 20 times the mean
  the rule that was applied said 2 times the mean

what each sizing rule is answering
  2x the average        : how much do I hold when the consumer keeps up
  burst minus drain     : how much do I hold when it does not
  the first is about memory cost, and its answer is 'as little as possible'
  the second is about loss, and its answer has no upper bound in the average
  a buffer that never fills in steady state tells you nothing about either

control - sustained overload at 180 per second, which the review was arguing about
  excess per second      : 60
  backlog after 60 seconds: 3600 if nothing is dropped
  with a buffer of 200  : fills in 3 seconds, then drops, and the producer learns
  with a buffer of 2040 : fills in 34 seconds, serving data that old before anyone hears
  the small buffer is genuinely better here, exactly as argued

null control - a burst of 300 per second for 1 second
  arrived        : 300
  drained        : 120
  buffer holds   : 180 of 200
  dropped        : 0
  same buffer, same rule, same consumer, and nothing is lost
  the rule is not wrong in size, it is wrong in what it consulted

Twice the average is a real rule with two correct arguments behind it: memory
is held permanently, and an oversized buffer hides sustained overload until the
data is stale. Both are about sustained load. The other thing a buffer does is
absorb a burst, and that is sized by the burst and the drain rate, neither of
which is an average. 2400 events arrived in 3 seconds, 560 were absorbed,
and 1840 were dropped by a buffer whose depth graph had never left zero.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
