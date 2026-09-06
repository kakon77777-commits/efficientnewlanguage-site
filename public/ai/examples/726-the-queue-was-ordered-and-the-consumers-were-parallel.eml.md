<!-- canonical: efficientnewlanguage.org/ai/examples/726-the-queue-was-ordered-and-the-consumers-were-parallel | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 726 — The queue was ordered and the consumers were parallel

`the_queue_was_ordered_and_the_consumers_were_parallel.eml` - The log is ordered per partition and the producer partitions by entity, so every event for one entity arrives in order. What happens after arrival is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The log is
# ordered per partition and the producer partitions by entity, so every event
# for one entity arrives in order. What happens after arrival is computed below.
#
# The partitioning was designed, not defaulted. A round-robin producer would
# spread one entity's events across forty-eight partitions and order would be
# meaningless; partitioning by entity id puts them all on one partition, where
# the log is a real ordered log. The broker's own out-of-order metric has read
# zero since the day it was turned on.
#
# Ordering is a property of DELIVERY. The consumer takes a batch of five
# hundred off its partition and hands each message to one of eight worker
# threads, and eight threads finish in the order their work finishes.
#
# Forty-one thousand entities a day have two events inside one batch.

48 => partitions
1 => partitions_a_given_entity_lands_on
0 => out_of_order_deliveries_measured
8 => consumer_threads_per_partition
500 => prefetch_batch_size
12000000 => events_per_day
41000 => entities_with_two_events_in_one_batch
8900 => pairs_applied_in_the_reverse_order
0 => metrics_on_the_order_events_are_applied_in
1 => threads_the_first_event_of_a_pair_occupies

consumer_threads_per_partition - threads_the_first_event_of_a_pair_occupies => threads_the_second_event_can_land_on
2 => events_in_one_such_pair
entities_with_two_events_in_one_batch => pairs_at_risk
pairs_at_risk * events_in_one_such_pair => events_in_those_pairs
int(events_in_those_pairs * 10000 / events_per_day) => at_risk_per_myriad
int(pairs_applied_in_the_reverse_order * 10000 / pairs_at_risk) => reversed_per_myriad_of_pairs

"partitions                      : " + str(partitions) ^0
"partitions one entity lands on  : " + str(partitions_a_given_entity_lands_on) ^0
"out-of-order deliveries measured: " + str(out_of_order_deliveries_measured) ^0
"" ^0
"consumer threads per partition  : " + str(consumer_threads_per_partition) ^0
"prefetch batch size             : " + str(prefetch_batch_size) ^0
"threads the second event can land on : " + str(threads_the_second_event_can_land_on) ^0
"" ^0
"events per day                  : " + str(events_per_day) ^0
"entities with two in one batch  : " + str(entities_with_two_events_in_one_batch) ^0
"  events in those pairs         : " + str(events_in_those_pairs) ^0
"  share of events               : " + str(at_risk_per_myriad) + " per ten thousand" ^0
"pairs applied in reverse order  : " + str(pairs_applied_in_the_reverse_order) ^0
"  share of those pairs          : " + str(reversed_per_myriad_of_pairs) + " per ten thousand" ^0
"metrics on application order    : " + str(metrics_on_the_order_events_are_applied_in) ^0
"" ^0

# ---- what the partitioning verified ----

"the ordering design" ^0
"  producer partitions by : entity id, deliberately" ^0
"  the alternative rejected : round robin, which would" ^0
"    spread one entity across " + str(partitions) + " partitions" ^0
"  partitions one entity lands on : " + str(partitions_a_given_entity_lands_on) ^0
"  the log within a partition : genuinely ordered" ^0
"  out-of-order deliveries : " + str(out_of_order_deliveries_measured) ^0
"  verdict : ORDERED" ^0
"" ^0
"  choosing the partition key for ordering rather than for" ^0
"  balance is the decision that makes any of this possible" ^0
"" ^0

# ---- where the guarantee ends ----

"the boundary" ^0
"  what the broker promises : the order you receive them in" ^0
"  where that promise ends  : the moment the consumer has" ^0
"    them" ^0
"  what the consumer does next : hands " + str(prefetch_batch_size) + " messages to" ^0
"    " + str(consumer_threads_per_partition) + " threads" ^0
"  what decides the order they finish in : how long each" ^0
"    one takes" ^0
"  is that a violation of the broker guarantee : no; the" ^0
"    guarantee was kept in full" ^0
"" ^0
"  delivery order and application order are two orders, and" ^0
"  the design bought the first one exactly" ^0
"" ^0
# ---- why the parallelism is there ----

# One thread per partition preserves application order and caps throughput at
# one message at a time per partition. The pool was added because that cap was
# real and the backlog was real. It is not a mistake; it is the second half of
# a decision whose first half was about order.
"the thread pool" ^0
"  why it exists : one thread per partition could not keep" ^0
"    up and the backlog was measured" ^0
"  what it bought : throughput" ^0
"  what it cost   : the order the partitioning bought" ^0
"  were the two decisions made together : no; the" ^0
"    partitioning predates the pool by a year" ^0
"" ^0

# ---- what a pair looks like ----

# The create and the update for one entity are delivered in order, milliseconds
# apart, into the same batch. One thread gets the create, another gets the
# update, and the update's handler is the shorter one.
"one reversed pair" ^0
"  delivered in order : yes" ^0
"  in the same batch  : yes" ^0
"  threads they land on : two different ones" ^0
"  what decides which finishes first : the handler, not" ^0
"    the log" ^0
"  what the entity ends up holding : the earlier state" ^0
"  what an error log shows : nothing; both handlers" ^0
"    succeeded" ^0
"" ^0

# ---- why nothing measures it ----

"the two metrics" ^0
"  out-of-order deliveries : measured, " + str(out_of_order_deliveries_measured) + ", and correct" ^0
"  out-of-order applications : " + str(metrics_on_the_order_events_are_applied_in) + " metrics exist" ^0
"  what the first one watches : the broker" ^0
"  where the reordering happens : after the broker" ^0
"  how the " + str(pairs_applied_in_the_reverse_order) + " were counted : a one-off audit against" ^0
"    each entity's own version column, run once" ^0
"" ^0

# ---- null control ----

# The same pool, with messages dispatched to a thread chosen by a hash of the
# entity id, so two events for one entity always take the same thread.
consumer_threads_per_partition => nc_consumer_threads_per_partition
0 => nc_pairs_applied_in_the_reverse_order

"null control - the thread is chosen by entity, not by turn" ^0
"  out-of-order deliveries : " + str(out_of_order_deliveries_measured) + ", unchanged" ^0
"  consumer threads : " + str(nc_consumer_threads_per_partition) + ", unchanged, so throughput is kept" ^0
"  pairs applied in reverse : " + str(nc_pairs_applied_in_the_reverse_order) ^0
"  the ordering guarantee did not get stronger; the same" ^0
"  key that chose the partition started choosing the thread" ^0
"" ^0

# ---- the rule ----

"what a per-partition ordering guarantee gives" ^0
"  events for one entity are delivered in order : exactly," ^0
"    and the partition key was chosen to make it true" ^0
"  events for one entity take effect in order   : not" ^0
"    addressed; the guarantee ends where the consumer" ^0
"    begins, and the consumer is a pool" ^0
"" ^0
"an ordering guarantee names a place where the order holds;" ^0
"it is inherited by whatever reads there in one thread, and" ^0
"any fan-out after that point re-decides the order using" ^0
"something that is not the log" ^0
"" ^0

"The partition key was chosen for ordering rather than balance, so one entity's" ^0
"events all land on " + str(partitions_a_given_entity_lands_on) + " of " + str(partitions) + " partitions and the broker has measured " + str(out_of_order_deliveries_measured) ^0
"out-of-order deliveries. The consumer hands each batch of " + str(prefetch_batch_size) + " to " + str(consumer_threads_per_partition) + " threads, so" ^0
"of " + str(entities_with_two_events_in_one_batch) + " entities a day with two events in one batch - " + str(at_risk_per_myriad) + " per ten thousand of" ^0
"events - " + str(pairs_applied_in_the_reverse_order) + ", or " + str(reversed_per_myriad_of_pairs) + " per ten thousand of them, take effect backwards," ^0
"watched by " + str(metrics_on_the_order_events_are_applied_in) + " metrics." ^0
```

## Python (deterministic transpilation)

```python
partitions = 48
partitions_a_given_entity_lands_on = 1
out_of_order_deliveries_measured = 0
consumer_threads_per_partition = 8
prefetch_batch_size = 500
events_per_day = 12000000
entities_with_two_events_in_one_batch = 41000
pairs_applied_in_the_reverse_order = 8900
metrics_on_the_order_events_are_applied_in = 0
threads_the_first_event_of_a_pair_occupies = 1
threads_the_second_event_can_land_on = consumer_threads_per_partition - threads_the_first_event_of_a_pair_occupies
events_in_one_such_pair = 2
pairs_at_risk = entities_with_two_events_in_one_batch
events_in_those_pairs = pairs_at_risk * events_in_one_such_pair
at_risk_per_myriad = int(events_in_those_pairs * 10000 / events_per_day)
reversed_per_myriad_of_pairs = int(pairs_applied_in_the_reverse_order * 10000 / pairs_at_risk)
print("partitions                      : " + str(partitions))
print("partitions one entity lands on  : " + str(partitions_a_given_entity_lands_on))
print("out-of-order deliveries measured: " + str(out_of_order_deliveries_measured))
print("")
print("consumer threads per partition  : " + str(consumer_threads_per_partition))
print("prefetch batch size             : " + str(prefetch_batch_size))
print("threads the second event can land on : " + str(threads_the_second_event_can_land_on))
print("")
print("events per day                  : " + str(events_per_day))
print("entities with two in one batch  : " + str(entities_with_two_events_in_one_batch))
print("  events in those pairs         : " + str(events_in_those_pairs))
print("  share of events               : " + str(at_risk_per_myriad) + " per ten thousand")
print("pairs applied in reverse order  : " + str(pairs_applied_in_the_reverse_order))
print("  share of those pairs          : " + str(reversed_per_myriad_of_pairs) + " per ten thousand")
print("metrics on application order    : " + str(metrics_on_the_order_events_are_applied_in))
print("")
print("the ordering design")
print("  producer partitions by : entity id, deliberately")
print("  the alternative rejected : round robin, which would")
print("    spread one entity across " + str(partitions) + " partitions")
print("  partitions one entity lands on : " + str(partitions_a_given_entity_lands_on))
print("  the log within a partition : genuinely ordered")
print("  out-of-order deliveries : " + str(out_of_order_deliveries_measured))
print("  verdict : ORDERED")
print("")
print("  choosing the partition key for ordering rather than for")
print("  balance is the decision that makes any of this possible")
print("")
print("the boundary")
print("  what the broker promises : the order you receive them in")
print("  where that promise ends  : the moment the consumer has")
print("    them")
print("  what the consumer does next : hands " + str(prefetch_batch_size) + " messages to")
print("    " + str(consumer_threads_per_partition) + " threads")
print("  what decides the order they finish in : how long each")
print("    one takes")
print("  is that a violation of the broker guarantee : no; the")
print("    guarantee was kept in full")
print("")
print("  delivery order and application order are two orders, and")
print("  the design bought the first one exactly")
print("")
print("the thread pool")
print("  why it exists : one thread per partition could not keep")
print("    up and the backlog was measured")
print("  what it bought : throughput")
print("  what it cost   : the order the partitioning bought")
print("  were the two decisions made together : no; the")
print("    partitioning predates the pool by a year")
print("")
print("one reversed pair")
print("  delivered in order : yes")
print("  in the same batch  : yes")
print("  threads they land on : two different ones")
print("  what decides which finishes first : the handler, not")
print("    the log")
print("  what the entity ends up holding : the earlier state")
print("  what an error log shows : nothing; both handlers")
print("    succeeded")
print("")
print("the two metrics")
print("  out-of-order deliveries : measured, " + str(out_of_order_deliveries_measured) + ", and correct")
print("  out-of-order applications : " + str(metrics_on_the_order_events_are_applied_in) + " metrics exist")
print("  what the first one watches : the broker")
print("  where the reordering happens : after the broker")
print("  how the " + str(pairs_applied_in_the_reverse_order) + " were counted : a one-off audit against")
print("    each entity's own version column, run once")
print("")
nc_consumer_threads_per_partition = consumer_threads_per_partition
nc_pairs_applied_in_the_reverse_order = 0
print("null control - the thread is chosen by entity, not by turn")
print("  out-of-order deliveries : " + str(out_of_order_deliveries_measured) + ", unchanged")
print("  consumer threads : " + str(nc_consumer_threads_per_partition) + ", unchanged, so throughput is kept")
print("  pairs applied in reverse : " + str(nc_pairs_applied_in_the_reverse_order))
print("  the ordering guarantee did not get stronger; the same")
print("  key that chose the partition started choosing the thread")
print("")
print("what a per-partition ordering guarantee gives")
print("  events for one entity are delivered in order : exactly,")
print("    and the partition key was chosen to make it true")
print("  events for one entity take effect in order   : not")
print("    addressed; the guarantee ends where the consumer")
print("    begins, and the consumer is a pool")
print("")
print("an ordering guarantee names a place where the order holds;")
print("it is inherited by whatever reads there in one thread, and")
print("any fan-out after that point re-decides the order using")
print("something that is not the log")
print("")
print("The partition key was chosen for ordering rather than balance, so one entity's")
print("events all land on " + str(partitions_a_given_entity_lands_on) + " of " + str(partitions) + " partitions and the broker has measured " + str(out_of_order_deliveries_measured))
print("out-of-order deliveries. The consumer hands each batch of " + str(prefetch_batch_size) + " to " + str(consumer_threads_per_partition) + " threads, so")
print("of " + str(entities_with_two_events_in_one_batch) + " entities a day with two events in one batch - " + str(at_risk_per_myriad) + " per ten thousand of")
print("events - " + str(pairs_applied_in_the_reverse_order) + ", or " + str(reversed_per_myriad_of_pairs) + " per ten thousand of them, take effect backwards,")
print("watched by " + str(metrics_on_the_order_events_are_applied_in) + " metrics.")
```

## stdout (executed)

```text
partitions                      : 48
partitions one entity lands on  : 1
out-of-order deliveries measured: 0

consumer threads per partition  : 8
prefetch batch size             : 500
threads the second event can land on : 7

events per day                  : 12000000
entities with two in one batch  : 41000
  events in those pairs         : 82000
  share of events               : 68 per ten thousand
pairs applied in reverse order  : 8900
  share of those pairs          : 2170 per ten thousand
metrics on application order    : 0

the ordering design
  producer partitions by : entity id, deliberately
  the alternative rejected : round robin, which would
    spread one entity across 48 partitions
  partitions one entity lands on : 1
  the log within a partition : genuinely ordered
  out-of-order deliveries : 0
  verdict : ORDERED

  choosing the partition key for ordering rather than for
  balance is the decision that makes any of this possible

the boundary
  what the broker promises : the order you receive them in
  where that promise ends  : the moment the consumer has
    them
  what the consumer does next : hands 500 messages to
    8 threads
  what decides the order they finish in : how long each
    one takes
  is that a violation of the broker guarantee : no; the
    guarantee was kept in full

  delivery order and application order are two orders, and
  the design bought the first one exactly

the thread pool
  why it exists : one thread per partition could not keep
    up and the backlog was measured
  what it bought : throughput
  what it cost   : the order the partitioning bought
  were the two decisions made together : no; the
    partitioning predates the pool by a year

one reversed pair
  delivered in order : yes
  in the same batch  : yes
  threads they land on : two different ones
  what decides which finishes first : the handler, not
    the log
  what the entity ends up holding : the earlier state
  what an error log shows : nothing; both handlers
    succeeded

the two metrics
  out-of-order deliveries : measured, 0, and correct
  out-of-order applications : 0 metrics exist
  what the first one watches : the broker
  where the reordering happens : after the broker
  how the 8900 were counted : a one-off audit against
    each entity's own version column, run once

null control - the thread is chosen by entity, not by turn
  out-of-order deliveries : 0, unchanged
  consumer threads : 8, unchanged, so throughput is kept
  pairs applied in reverse : 0
  the ordering guarantee did not get stronger; the same
  key that chose the partition started choosing the thread

what a per-partition ordering guarantee gives
  events for one entity are delivered in order : exactly,
    and the partition key was chosen to make it true
  events for one entity take effect in order   : not
    addressed; the guarantee ends where the consumer
    begins, and the consumer is a pool

an ordering guarantee names a place where the order holds;
it is inherited by whatever reads there in one thread, and
any fan-out after that point re-decides the order using
something that is not the log

The partition key was chosen for ordering rather than balance, so one entity's
events all land on 1 of 48 partitions and the broker has measured 0
out-of-order deliveries. The consumer hands each batch of 500 to 8 threads, so
of 41000 entities a day with two events in one batch - 68 per ten thousand of
events - 8900, or 2170 per ten thousand of them, take effect backwards,
watched by 0 metrics.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
