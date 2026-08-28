<!-- canonical: efficientnewlanguage.org/ai/examples/588-the-queue-had-no-maximum-and-the-memory-did | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 588 — The queue had no maximum and the memory did

`the_queue_had_no_maximum_and_the_memory_did.eml` - The in-process queue has never rejected a message. How long that can continue is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The in-process
# queue has never rejected a message. How long that can continue is computed
# below.
#
# An unbounded queue was chosen on purpose and the argument for it is a real
# one. A bounded queue must decide what to do when it is full, and every answer
# is bad: dropping loses a message the producer believed was accepted, blocking
# turns a fast producer into a slow one and pushes the stall upstream, and
# returning an error means every caller needs a retry path for a condition that
# is not their fault. Removing the bound removes all three problems at once, and
# the rejection rate has been zero for the whole life of the service.
#
# A queue in memory has a bound whether or not the code names one. Not naming it
# does not remove it; it moves it from a number the program can read to a number
# only the operating system can see, and it changes the failure from a rejected
# message to a terminated process.

800 => produced_per_second
600 => consumed_per_second
4 => bytes_per_item_kb
6 => memory_gb

produced_per_second - consumed_per_second => backlog_per_second
backlog_per_second * bytes_per_item_kb => growth_kb_per_second
memory_gb * 1024 * 1024 => memory_kb
int(memory_kb / growth_kb_per_second) => seconds_to_exhaustion

"produced   : " + str(produced_per_second) + " per second" ^0
"consumed   : " + str(consumed_per_second) + " per second" ^0
"backlog    : " + str(backlog_per_second) + " per second" ^0
"item size  : " + str(bytes_per_item_kb) + " KB" ^0
"memory     : " + str(memory_gb) + " GB" ^0
"" ^0

"  queue growth        : " + str(growth_kb_per_second) + " KB per second" ^0
"  seconds to exhaustion: " + str(seconds_to_exhaustion) ^0
"  hours to exhaustion  : " + str(int(seconds_to_exhaustion / 3600)) ^0
"" ^0

# ---- what the queue reports on the way there ----

"minutes in   items queued   memory used MB   rejections" ^0
for m in [10:120]:
    if m % 20 == 0:
        m * 60 => secs
        secs * backlog_per_second => items
        int(items * bytes_per_item_kb / 1024) => used_mb
        "  " + str(m) + "          " + str(items) + "        " + str(used_mb) + "             0" ^0
"" ^0
"  the rejection column is the one the dashboard shows" ^0
"  it is zero at every point above, including the last one before the" ^0
"  process is killed" ^0
"" ^0

# ---- what a bounded queue would report ----

100000 => bound

int(bound / backlog_per_second) => seconds_to_full

"the same load against a queue bounded at " + str(bound) ^0
"  seconds until full     : " + str(seconds_to_full) ^0
"  what happens then      : the producer is told, on the call that would" ^0
"                           have been the first one to overflow" ^0
"  memory used at that point : " + str(int(bound * bytes_per_item_kb / 1024)) + " MB of " + str(memory_gb * 1024) ^0
"  process terminated     : no" ^0
"  messages lost          : the ones refused, and the producer knows which" ^0
"" ^0
"  unbounded: " + str(seconds_to_exhaustion) + " seconds of silence, then every in-flight message is lost" ^0
"  bounded  : " + str(seconds_to_full) + " seconds, then a refusal the producer can act on" ^0
"" ^0

# ---- what is lost in each case ----

seconds_to_exhaustion * backlog_per_second => queued_at_oom

"messages at the moment of failure" ^0
"  unbounded : " + str(queued_at_oom) + " in the queue, all lost with the process" ^0
"  bounded   : 0 in memory beyond the bound, refusals counted individually" ^0
"  the unbounded queue converts a per-message refusal into one bulk loss" ^0
"  and it does it at the moment the operator is least prepared" ^0
"" ^0

# ---- the argument that was made, re-examined ----

"the three problems a bound creates, and where they went" ^0
"  dropping loses a message the producer thinks was accepted" ^0
"      unbounded: " + str(queued_at_oom) + " messages, and the producer thinks all were accepted" ^0
"  blocking pushes the stall upstream" ^0
"      unbounded: the stall arrives anyway, as a restart" ^0
"  an error needs a retry path in every caller" ^0
"      unbounded: every caller needs a reconnect path instead" ^0
"" ^0
"  each problem was moved, not removed, and each one got larger in transit" ^0
"" ^0

# ---- the control ----
#
# The rejection rate. It is zero, it has always been zero, and it is a true
# measurement of the thing it names. No message has ever been refused.

"control - has the queue ever refused a message" ^0
"  rejections, lifetime : 0" ^0
"  is that number correct : yes" ^0
"  can it be non-zero     : no, there is no branch that rejects" ^0
"  a metric with one reachable value, on the dashboard for two years" ^0
"" ^0
"  it reports the absence of a code path, and is read as the absence of" ^0
"  a problem" ^0
"" ^0

# ---- the null control ----
#
# The same unbounded queue with a consumer faster than the producer. The
# backlog is zero, memory is flat, and unbounded is exactly the right choice:
# nothing accumulates and no bound is needed. The design is correct for as long
# as the inequality holds.

900 => nc_consumed_per_second

"null control - the same queue when the consumer is faster" ^0
"  produced  : " + str(produced_per_second) + " per second" ^0
"  consumed  : " + str(nc_consumed_per_second) + " per second" ^0
"  backlog   : 0 per second" ^0
"  memory    : flat" ^0
"  rejections: 0, and now that zero means something" ^0
"  same queue, same code, same absence of a bound" ^0
"  the whole finding is the sign of one subtraction" ^0
"" ^0

# ---- the rule ----

"a queue with no declared bound" ^0
"  has no bound in the code      true" ^0
"  has no bound                  false" ^0
"  the bound is the machine's, and it is not readable from inside" ^0
"  crossing it does not produce a rejection, it produces a termination" ^0
"  and the rejection counter stays at zero through the whole approach" ^0
"" ^0
"the measurement that would have found this is not the queue's own metric" ^0
"it is produced minus consumed, which no queue reports because neither" ^0
"number belongs to it" ^0
"" ^0

"Removing the bound removed three real problems: a drop the producer cannot" ^0
"see, a stall pushed upstream, and a retry path in every caller. At " + str(produced_per_second) + " in and" ^0
str(consumed_per_second) + " out the queue grows " + str(growth_kb_per_second) + " KB a second and reaches " + str(memory_gb) + " GB in " + str(int(seconds_to_exhaustion / 3600)) + " hours," ^0
"taking " + str(queued_at_oom) + " messages with the process. The rejection counter reads zero for" ^0
"every one of those seconds, correctly, because nothing in the code can" ^0
"make it read anything else." ^0
```

## Python (deterministic transpilation)

```python
produced_per_second = 800
consumed_per_second = 600
bytes_per_item_kb = 4
memory_gb = 6
backlog_per_second = produced_per_second - consumed_per_second
growth_kb_per_second = backlog_per_second * bytes_per_item_kb
memory_kb = memory_gb * 1024 * 1024
seconds_to_exhaustion = int(memory_kb / growth_kb_per_second)
print("produced   : " + str(produced_per_second) + " per second")
print("consumed   : " + str(consumed_per_second) + " per second")
print("backlog    : " + str(backlog_per_second) + " per second")
print("item size  : " + str(bytes_per_item_kb) + " KB")
print("memory     : " + str(memory_gb) + " GB")
print("")
print("  queue growth        : " + str(growth_kb_per_second) + " KB per second")
print("  seconds to exhaustion: " + str(seconds_to_exhaustion))
print("  hours to exhaustion  : " + str(int(seconds_to_exhaustion / 3600)))
print("")
print("minutes in   items queued   memory used MB   rejections")
for m in range(10, 121):
    if m % 20 == 0:
        secs = m * 60
        items = secs * backlog_per_second
        used_mb = int(items * bytes_per_item_kb / 1024)
        print("  " + str(m) + "          " + str(items) + "        " + str(used_mb) + "             0")
print("")
print("  the rejection column is the one the dashboard shows")
print("  it is zero at every point above, including the last one before the")
print("  process is killed")
print("")
bound = 100000
seconds_to_full = int(bound / backlog_per_second)
print("the same load against a queue bounded at " + str(bound))
print("  seconds until full     : " + str(seconds_to_full))
print("  what happens then      : the producer is told, on the call that would")
print("                           have been the first one to overflow")
print("  memory used at that point : " + str(int(bound * bytes_per_item_kb / 1024)) + " MB of " + str(memory_gb * 1024))
print("  process terminated     : no")
print("  messages lost          : the ones refused, and the producer knows which")
print("")
print("  unbounded: " + str(seconds_to_exhaustion) + " seconds of silence, then every in-flight message is lost")
print("  bounded  : " + str(seconds_to_full) + " seconds, then a refusal the producer can act on")
print("")
queued_at_oom = seconds_to_exhaustion * backlog_per_second
print("messages at the moment of failure")
print("  unbounded : " + str(queued_at_oom) + " in the queue, all lost with the process")
print("  bounded   : 0 in memory beyond the bound, refusals counted individually")
print("  the unbounded queue converts a per-message refusal into one bulk loss")
print("  and it does it at the moment the operator is least prepared")
print("")
print("the three problems a bound creates, and where they went")
print("  dropping loses a message the producer thinks was accepted")
print("      unbounded: " + str(queued_at_oom) + " messages, and the producer thinks all were accepted")
print("  blocking pushes the stall upstream")
print("      unbounded: the stall arrives anyway, as a restart")
print("  an error needs a retry path in every caller")
print("      unbounded: every caller needs a reconnect path instead")
print("")
print("  each problem was moved, not removed, and each one got larger in transit")
print("")
print("control - has the queue ever refused a message")
print("  rejections, lifetime : 0")
print("  is that number correct : yes")
print("  can it be non-zero     : no, there is no branch that rejects")
print("  a metric with one reachable value, on the dashboard for two years")
print("")
print("  it reports the absence of a code path, and is read as the absence of")
print("  a problem")
print("")
nc_consumed_per_second = 900
print("null control - the same queue when the consumer is faster")
print("  produced  : " + str(produced_per_second) + " per second")
print("  consumed  : " + str(nc_consumed_per_second) + " per second")
print("  backlog   : 0 per second")
print("  memory    : flat")
print("  rejections: 0, and now that zero means something")
print("  same queue, same code, same absence of a bound")
print("  the whole finding is the sign of one subtraction")
print("")
print("a queue with no declared bound")
print("  has no bound in the code      true")
print("  has no bound                  false")
print("  the bound is the machine's, and it is not readable from inside")
print("  crossing it does not produce a rejection, it produces a termination")
print("  and the rejection counter stays at zero through the whole approach")
print("")
print("the measurement that would have found this is not the queue's own metric")
print("it is produced minus consumed, which no queue reports because neither")
print("number belongs to it")
print("")
print("Removing the bound removed three real problems: a drop the producer cannot")
print("see, a stall pushed upstream, and a retry path in every caller. At " + str(produced_per_second) + " in and")
print(str(consumed_per_second) + " out the queue grows " + str(growth_kb_per_second) + " KB a second and reaches " + str(memory_gb) + " GB in " + str(int(seconds_to_exhaustion / 3600)) + " hours,")
print("taking " + str(queued_at_oom) + " messages with the process. The rejection counter reads zero for")
print("every one of those seconds, correctly, because nothing in the code can")
print("make it read anything else.")
```

## stdout (executed)

```text
produced   : 800 per second
consumed   : 600 per second
backlog    : 200 per second
item size  : 4 KB
memory     : 6 GB

  queue growth        : 800 KB per second
  seconds to exhaustion: 7864
  hours to exhaustion  : 2

minutes in   items queued   memory used MB   rejections
  20          240000        937             0
  40          480000        1875             0
  60          720000        2812             0
  80          960000        3750             0
  100          1200000        4687             0
  120          1440000        5625             0

  the rejection column is the one the dashboard shows
  it is zero at every point above, including the last one before the
  process is killed

the same load against a queue bounded at 100000
  seconds until full     : 500
  what happens then      : the producer is told, on the call that would
                           have been the first one to overflow
  memory used at that point : 390 MB of 6144
  process terminated     : no
  messages lost          : the ones refused, and the producer knows which

  unbounded: 7864 seconds of silence, then every in-flight message is lost
  bounded  : 500 seconds, then a refusal the producer can act on

messages at the moment of failure
  unbounded : 1572800 in the queue, all lost with the process
  bounded   : 0 in memory beyond the bound, refusals counted individually
  the unbounded queue converts a per-message refusal into one bulk loss
  and it does it at the moment the operator is least prepared

the three problems a bound creates, and where they went
  dropping loses a message the producer thinks was accepted
      unbounded: 1572800 messages, and the producer thinks all were accepted
  blocking pushes the stall upstream
      unbounded: the stall arrives anyway, as a restart
  an error needs a retry path in every caller
      unbounded: every caller needs a reconnect path instead

  each problem was moved, not removed, and each one got larger in transit

control - has the queue ever refused a message
  rejections, lifetime : 0
  is that number correct : yes
  can it be non-zero     : no, there is no branch that rejects
  a metric with one reachable value, on the dashboard for two years

  it reports the absence of a code path, and is read as the absence of
  a problem

null control - the same queue when the consumer is faster
  produced  : 800 per second
  consumed  : 900 per second
  backlog   : 0 per second
  memory    : flat
  rejections: 0, and now that zero means something
  same queue, same code, same absence of a bound
  the whole finding is the sign of one subtraction

a queue with no declared bound
  has no bound in the code      true
  has no bound                  false
  the bound is the machine's, and it is not readable from inside
  crossing it does not produce a rejection, it produces a termination
  and the rejection counter stays at zero through the whole approach

the measurement that would have found this is not the queue's own metric
it is produced minus consumed, which no queue reports because neither
number belongs to it

Removing the bound removed three real problems: a drop the producer cannot
see, a stall pushed upstream, and a retry path in every caller. At 800 in and
600 out the queue grows 800 KB a second and reaches 6 GB in 2 hours,
taking 1572800 messages with the process. The rejection counter reads zero for
every one of those seconds, correctly, because nothing in the code can
make it read anything else.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
