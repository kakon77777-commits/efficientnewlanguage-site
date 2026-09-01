<!-- canonical: efficientnewlanguage.org/ai/examples/652-the-queue-was-durable-and-the-consumer-acked-first | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 652 — The queue was durable and the consumer acked first

`the_queue_was_durable_and_the_consumer_acked_first.eml` - The broker has never lost a message and its durability report is correct. How much work is lost is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The broker has
# never lost a message and its durability report is correct. How much work is
# lost is computed below.
#
# The durability is real and expensive. Every publish is fsynced before the
# acknowledgement goes back, every message is replicated to two other brokers
# before it is considered committed, and a deliberate power-cut drill last
# quarter lost nothing. The broker's zero is a measured zero, not a default.
#
# What the broker guarantees is about the MESSAGE. It says the bytes survive
# until a consumer says it is done with them, and the consumer says that as the
# first thing it does rather than the last.
#
# The consumer acks on receipt, then processes. Between those two the message is
# no longer the broker's problem and not yet anybody's result.

8400000 => messages_per_day
47 => consumer_crashes_per_day
250 => prefetch
# Measured across those crashes: messages already acked and not yet processed.
118 => mean_acked_but_unprocessed
0 => messages_lost_by_the_broker

consumer_crashes_per_day * mean_acked_but_unprocessed => work_lost_per_day

"messages per day            : " + str(messages_per_day) ^0
"consumer crashes per day    : " + str(consumer_crashes_per_day) ^0
"prefetch                    : " + str(prefetch) ^0
"acked but unprocessed, mean : " + str(mean_acked_but_unprocessed) ^0
"work lost per day           : " + str(work_lost_per_day) ^0
"" ^0

# ---- what the broker verified ----

"the broker's durability" ^0
"  publish fsynced before ack : yes" ^0
"  replicas before commit     : 2" ^0
"  power-cut drill last quarter : lost nothing" ^0
"  messages lost by the broker  : " + str(messages_lost_by_the_broker) ^0
"  verdict                    : DURABLE" ^0
"" ^0
"  the zero is measured, and the drill that measured it is" ^0
"  the reason anyone trusts this queue" ^0
"" ^0

# ---- where the ack sits ----

"one message, in order" ^0
"  1. broker delivers   : durable up to here" ^0
"  2. consumer acks     : the broker forgets it" ^0
"  3. consumer processes: nothing is holding it" ^0
"  4. result written    : the first durable record since step 1" ^0
"" ^0
"  the guarantee ends at step 2 and the work starts at" ^0
"  step 3; the gap is where the crashes land" ^0
"" ^0

int(work_lost_per_day * 10000 / messages_per_day) => lost_per_myriad
"share of the day's work lost : " + str(lost_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why nobody sees it as loss ----

# Both sides report correctly and neither reports this. The broker delivered
# every message; the consumer processed every message it got to. The subtraction
# nobody performs is between two systems' counters.
"the two counters" ^0
"  delivered by the broker   : " + str(messages_per_day) ^0
"  results written           : " + str(messages_per_day - work_lost_per_day) ^0
"  either number alone       : correct and unremarkable" ^0
"  a report comparing them   : does not exist" ^0
"" ^0

# ---- null control ----

# The same broker, with the ack moved after the result is written.
0 => nc_work_lost_per_day
consumer_crashes_per_day * mean_acked_but_unprocessed => nc_redelivered

"null control - ack after the result, not on receipt" ^0
"  messages lost by the broker : " + str(messages_lost_by_the_broker) + ", unchanged" ^0
"  work lost per day           : " + str(nc_work_lost_per_day) ^0
"  redelivered instead         : " + str(nc_redelivered) ^0
"  the broker did not get more durable; the ack moved to" ^0
"  the far side of the work it was standing for" ^0
"" ^0

# ---- the rule ----

"what a durable queue guarantees" ^0
"  the message survives until it is acked : exactly" ^0
"  the work the message asked for happens : not addressed;" ^0
"    the queue cannot observe the work, only the ack, and" ^0
"    the consumer decides what the ack means" ^0
"" ^0
"durability is a property of a message and delivery is a" ^0
"property of a pair; an ack sent before the work is a promise" ^0
"the consumer makes on the queue's behalf without being asked" ^0
"" ^0

"The broker is durable and its zero is measured: fsync before ack, two replicas" ^0
"before commit, a power-cut drill that lost nothing, " + str(messages_lost_by_the_broker) + " messages lost. The" ^0
"consumer acks on receipt, so " + str(consumer_crashes_per_day) + " crashes a day take " + str(mean_acked_but_unprocessed) + " already-forgotten" ^0
"messages each - " + str(work_lost_per_day) + " pieces of work, " + str(lost_per_myriad) + " per ten thousand - and both sides'" ^0
"counters are correct because the only number that would show it is a difference." ^0
```

## Python (deterministic transpilation)

```python
messages_per_day = 8400000
consumer_crashes_per_day = 47
prefetch = 250
mean_acked_but_unprocessed = 118
messages_lost_by_the_broker = 0
work_lost_per_day = consumer_crashes_per_day * mean_acked_but_unprocessed
print("messages per day            : " + str(messages_per_day))
print("consumer crashes per day    : " + str(consumer_crashes_per_day))
print("prefetch                    : " + str(prefetch))
print("acked but unprocessed, mean : " + str(mean_acked_but_unprocessed))
print("work lost per day           : " + str(work_lost_per_day))
print("")
print("the broker's durability")
print("  publish fsynced before ack : yes")
print("  replicas before commit     : 2")
print("  power-cut drill last quarter : lost nothing")
print("  messages lost by the broker  : " + str(messages_lost_by_the_broker))
print("  verdict                    : DURABLE")
print("")
print("  the zero is measured, and the drill that measured it is")
print("  the reason anyone trusts this queue")
print("")
print("one message, in order")
print("  1. broker delivers   : durable up to here")
print("  2. consumer acks     : the broker forgets it")
print("  3. consumer processes: nothing is holding it")
print("  4. result written    : the first durable record since step 1")
print("")
print("  the guarantee ends at step 2 and the work starts at")
print("  step 3; the gap is where the crashes land")
print("")
lost_per_myriad = int(work_lost_per_day * 10000 / messages_per_day)
print("share of the day's work lost : " + str(lost_per_myriad) + " per ten thousand")
print("")
print("the two counters")
print("  delivered by the broker   : " + str(messages_per_day))
print("  results written           : " + str(messages_per_day - work_lost_per_day))
print("  either number alone       : correct and unremarkable")
print("  a report comparing them   : does not exist")
print("")
nc_work_lost_per_day = 0
nc_redelivered = consumer_crashes_per_day * mean_acked_but_unprocessed
print("null control - ack after the result, not on receipt")
print("  messages lost by the broker : " + str(messages_lost_by_the_broker) + ", unchanged")
print("  work lost per day           : " + str(nc_work_lost_per_day))
print("  redelivered instead         : " + str(nc_redelivered))
print("  the broker did not get more durable; the ack moved to")
print("  the far side of the work it was standing for")
print("")
print("what a durable queue guarantees")
print("  the message survives until it is acked : exactly")
print("  the work the message asked for happens : not addressed;")
print("    the queue cannot observe the work, only the ack, and")
print("    the consumer decides what the ack means")
print("")
print("durability is a property of a message and delivery is a")
print("property of a pair; an ack sent before the work is a promise")
print("the consumer makes on the queue's behalf without being asked")
print("")
print("The broker is durable and its zero is measured: fsync before ack, two replicas")
print("before commit, a power-cut drill that lost nothing, " + str(messages_lost_by_the_broker) + " messages lost. The")
print("consumer acks on receipt, so " + str(consumer_crashes_per_day) + " crashes a day take " + str(mean_acked_but_unprocessed) + " already-forgotten")
print("messages each - " + str(work_lost_per_day) + " pieces of work, " + str(lost_per_myriad) + " per ten thousand - and both sides'")
print("counters are correct because the only number that would show it is a difference.")
```

## stdout (executed)

```text
messages per day            : 8400000
consumer crashes per day    : 47
prefetch                    : 250
acked but unprocessed, mean : 118
work lost per day           : 5546

the broker's durability
  publish fsynced before ack : yes
  replicas before commit     : 2
  power-cut drill last quarter : lost nothing
  messages lost by the broker  : 0
  verdict                    : DURABLE

  the zero is measured, and the drill that measured it is
  the reason anyone trusts this queue

one message, in order
  1. broker delivers   : durable up to here
  2. consumer acks     : the broker forgets it
  3. consumer processes: nothing is holding it
  4. result written    : the first durable record since step 1

  the guarantee ends at step 2 and the work starts at
  step 3; the gap is where the crashes land

share of the day's work lost : 6 per ten thousand

the two counters
  delivered by the broker   : 8400000
  results written           : 8394454
  either number alone       : correct and unremarkable
  a report comparing them   : does not exist

null control - ack after the result, not on receipt
  messages lost by the broker : 0, unchanged
  work lost per day           : 0
  redelivered instead         : 5546
  the broker did not get more durable; the ack moved to
  the far side of the work it was standing for

what a durable queue guarantees
  the message survives until it is acked : exactly
  the work the message asked for happens : not addressed;
    the queue cannot observe the work, only the ack, and
    the consumer decides what the ack means

durability is a property of a message and delivery is a
property of a pair; an ack sent before the work is a promise
the consumer makes on the queue's behalf without being asked

The broker is durable and its zero is measured: fsync before ack, two replicas
before commit, a power-cut drill that lost nothing, 0 messages lost. The
consumer acks on receipt, so 47 crashes a day take 118 already-forgotten
messages each - 5546 pieces of work, 6 per ten thousand - and both sides'
counters are correct because the only number that would show it is a difference.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
