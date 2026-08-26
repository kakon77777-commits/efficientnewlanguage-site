<!-- canonical: efficientnewlanguage.org/ai/examples/564-the-throughput-doubled-and-the-tail-got-worse | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 564 — The throughput doubled and the tail got worse

`the_throughput_doubled_and_the_tail_got_worse.eml` - The batch size was raised from 10 to 100. Throughput went from 166 to 416 items a second. What a single request experiences is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The batch size was
# raised from 10 to 100. Throughput went from 166 to 416 items a second. What a
# single request experiences is computed below.
#
# Batching is correct and the change was made for good reasons, with a
# before-and-after measurement to back it. Each batch carries a fixed 40 ms of
# overhead - one round trip, one transaction, one index update - and that cost
# is paid once whether the batch holds 10 rows or 100. Amortising a fixed cost
# over more work is the oldest optimisation there is, the benchmark confirmed
# it, and the confirmation was honest: throughput really did go up 2.5 times.
#
# Throughput is items per second, measured across the batch. Latency is a
# property of one request, measured from when it arrived. Batching moves cost
# from the first quantity to the second: it makes the shared overhead smaller
# per item and makes every item wait for the whole batch.
#
# Both numbers are real. Only one of them was on the dashboard.

40 => fixed_ms_per_batch
2 => ms_per_item
200 => arrivals_per_second

# [label, batch size]
[["no batching", 1], ["before", 10], ["after", 100]] => configs

"each batch costs " + str(fixed_ms_per_batch) + " ms fixed plus " + str(ms_per_item) + " ms per item" ^0
"requests arrive at " + str(arrivals_per_second) + " per second" ^0
"" ^0

# ---- what the benchmark measured: a saturated queue ----
#
# Under saturation there is always a full batch waiting, so nothing waits to be
# filled. This is the regime the benchmark ran in and every number it produced
# is correct for that regime.

"saturated benchmark - a full batch is always ready" ^0
"config          batch   ms per batch   items/sec   ms per item   request latency" ^0
for c in configs:
    fixed_ms_per_batch + (ms_per_item * c[1]) => batch_ms
    int(c[1] * 1000 / batch_ms) => throughput
    int(batch_ms * 100 / c[1]) => per_item_centims
    "  " + c[0] + "    " + str(c[1]) + "        " + str(batch_ms) + "            " + str(throughput) + "         " + str(per_item_centims) + " centims        " + str(batch_ms) ^0
"" ^0
"  throughput and cost per item both improve with batch size" ^0
"  request latency gets worse with batch size, in the same table" ^0
"" ^0

# ---- what production runs at ----
#
# 200 arrivals a second. A batch of 100 takes half a second to fill. The first
# request into a batch waits for the other 99 to show up, then waits for the
# batch to run.

"production at " + str(arrivals_per_second) + " arrivals per second" ^0
"config          batch   fill time   first-in waits   last-in waits   mean wait" ^0
for c in configs:
    fixed_ms_per_batch + (ms_per_item * c[1]) => batch_ms
    int(c[1] * 1000 / arrivals_per_second) => fill_ms
    fill_ms + batch_ms => first_in
    batch_ms => last_in
    int(fill_ms / 2) + batch_ms => mean_wait
    "  " + c[0] + "    " + str(c[1]) + "       " + str(fill_ms) + "          " + str(first_in) + "             " + str(last_in) + "            " + str(mean_wait) ^0
"" ^0

# ---- the two numbers side by side ----

fixed_ms_per_batch + (ms_per_item * 10) => before_batch_ms
fixed_ms_per_batch + (ms_per_item * 100) => after_batch_ms
int(10 * 1000 / before_batch_ms) => before_throughput
int(100 * 1000 / after_batch_ms) => after_throughput
int(10 * 1000 / arrivals_per_second) + before_batch_ms => before_first_in
int(100 * 1000 / arrivals_per_second) + after_batch_ms => after_first_in

"throughput  : " + str(before_throughput) + " -> " + str(after_throughput) + " items/sec, better by " + str(int(after_throughput * 100 / before_throughput)) + " hundredths" ^0
"worst wait  : " + str(before_first_in) + " -> " + str(after_first_in) + " ms, worse by " + str(int(after_first_in * 100 / before_first_in)) + " hundredths" ^0
"" ^0
"at " + str(arrivals_per_second) + " arrivals a second, " + str(before_throughput) + " items/sec was already enough" ^0
"the capacity that was bought was not short, and the wait that was sold was real" ^0
"" ^0

# ---- which quantity was instrumented ----
#
# Service time is how long the work took. Sojourn time is how long the
# requester waited. They are the same number only when nothing queues.

"service time vs sojourn time" ^0
"  service time  : time inside the batch call            -> " + str(after_batch_ms) + " ms" ^0
"  fill time     : time waiting for the batch to fill    -> " + str(int(100 * 1000 / arrivals_per_second)) + " ms" ^0
"  sojourn time  : what the caller experiences           -> " + str(after_first_in) + " ms" ^0
"  the timer was started when the batch call began" ^0
"  so it measured " + str(after_batch_ms) + " of the " + str(after_first_in) + " ms the caller waited" ^0
"  it was not reporting a wrong number, it was reporting a different one" ^0
"" ^0

# ---- the control ----
#
# If batching were simply a mistake, throughput would not have improved. It did,
# by exactly what the benchmark said. The change bought real capacity; the
# question is only whether capacity was the scarce thing.

"control - the quantity the change genuinely improved" ^0
0 => configs_measured
for c in configs:
    fixed_ms_per_batch + (ms_per_item * c[1]) => batch_ms
    int(c[1] * 1000 / batch_ms) => throughput
    configs_measured + 1 => configs_measured
    "  batch " + str(c[1]) + ": " + str(throughput) + " items/sec sustained" ^0
"  configs measured: " + str(configs_measured) + ", and throughput rises in every step" ^0
"  the benchmark was right, repeatable, and about the wrong axis" ^0
"" ^0

# ---- the null control ----
#
# Arrivals fast enough to fill a batch of 100 instantly. Fill time goes to
# zero and the sojourn time collapses onto the service time. The defect is not
# batching; it is a batch size chosen without reference to the arrival rate.

10000 => fast_arrivals
"null control - the same batch of 100 at " + str(fast_arrivals) + " arrivals per second" ^0
int(100 * 1000 / fast_arrivals) => fast_fill
"  fill time     : " + str(fast_fill) + " ms" ^0
"  first-in waits: " + str(fast_fill + after_batch_ms) + " ms" ^0
"  at " + str(arrivals_per_second) + " arrivals it was " + str(after_first_in) + " ms" ^0
"  same batch size, same code, same overhead constants" ^0
"  what changed is only how long 100 requests take to exist" ^0
"" ^0

# ---- the rule ----

"batch size trades one axis against the other, always in the same direction" ^0
"  items per second   rises with batch size" ^0
"  cost per item      falls with batch size" ^0
"  service time       rises with batch size" ^0
"  fill time          rises with batch size, and falls with arrival rate" ^0
"  sojourn time       rises with both" ^0
"  a benchmark run at saturation cannot see the fill term at all" ^0
"" ^0

"Amortising a fixed 40 ms over 100 items instead of 10 is correct, and the" ^0
"benchmark that confirmed it was honest: " + str(before_throughput) + " to " + str(after_throughput) + " items per second," ^0
"repeatable. It ran against a saturated queue, where a batch is always full." ^0
"Production arrives at " + str(arrivals_per_second) + " a second, where a batch of 100 takes " + str(int(100 * 1000 / arrivals_per_second)) + " ms to exist," ^0
"and the first request into each one waits " + str(after_first_in) + " ms for a capacity increase" ^0
"it did not need." ^0
```

## Python (deterministic transpilation)

```python
fixed_ms_per_batch = 40
ms_per_item = 2
arrivals_per_second = 200
configs = [["no batching", 1], ["before", 10], ["after", 100]]
print("each batch costs " + str(fixed_ms_per_batch) + " ms fixed plus " + str(ms_per_item) + " ms per item")
print("requests arrive at " + str(arrivals_per_second) + " per second")
print("")
print("saturated benchmark - a full batch is always ready")
print("config          batch   ms per batch   items/sec   ms per item   request latency")
for c in configs:
    batch_ms = fixed_ms_per_batch + ms_per_item * c[1]
    throughput = int(c[1] * 1000 / batch_ms)
    per_item_centims = int(batch_ms * 100 / c[1])
    print("  " + c[0] + "    " + str(c[1]) + "        " + str(batch_ms) + "            " + str(throughput) + "         " + str(per_item_centims) + " centims        " + str(batch_ms))
print("")
print("  throughput and cost per item both improve with batch size")
print("  request latency gets worse with batch size, in the same table")
print("")
print("production at " + str(arrivals_per_second) + " arrivals per second")
print("config          batch   fill time   first-in waits   last-in waits   mean wait")
for c in configs:
    batch_ms = fixed_ms_per_batch + ms_per_item * c[1]
    fill_ms = int(c[1] * 1000 / arrivals_per_second)
    first_in = fill_ms + batch_ms
    last_in = batch_ms
    mean_wait = int(fill_ms / 2) + batch_ms
    print("  " + c[0] + "    " + str(c[1]) + "       " + str(fill_ms) + "          " + str(first_in) + "             " + str(last_in) + "            " + str(mean_wait))
print("")
before_batch_ms = fixed_ms_per_batch + ms_per_item * 10
after_batch_ms = fixed_ms_per_batch + ms_per_item * 100
before_throughput = int(10 * 1000 / before_batch_ms)
after_throughput = int(100 * 1000 / after_batch_ms)
before_first_in = int(10 * 1000 / arrivals_per_second) + before_batch_ms
after_first_in = int(100 * 1000 / arrivals_per_second) + after_batch_ms
print("throughput  : " + str(before_throughput) + " -> " + str(after_throughput) + " items/sec, better by " + str(int(after_throughput * 100 / before_throughput)) + " hundredths")
print("worst wait  : " + str(before_first_in) + " -> " + str(after_first_in) + " ms, worse by " + str(int(after_first_in * 100 / before_first_in)) + " hundredths")
print("")
print("at " + str(arrivals_per_second) + " arrivals a second, " + str(before_throughput) + " items/sec was already enough")
print("the capacity that was bought was not short, and the wait that was sold was real")
print("")
print("service time vs sojourn time")
print("  service time  : time inside the batch call            -> " + str(after_batch_ms) + " ms")
print("  fill time     : time waiting for the batch to fill    -> " + str(int(100 * 1000 / arrivals_per_second)) + " ms")
print("  sojourn time  : what the caller experiences           -> " + str(after_first_in) + " ms")
print("  the timer was started when the batch call began")
print("  so it measured " + str(after_batch_ms) + " of the " + str(after_first_in) + " ms the caller waited")
print("  it was not reporting a wrong number, it was reporting a different one")
print("")
print("control - the quantity the change genuinely improved")
configs_measured = 0
for c in configs:
    batch_ms = fixed_ms_per_batch + ms_per_item * c[1]
    throughput = int(c[1] * 1000 / batch_ms)
    configs_measured = configs_measured + 1
    print("  batch " + str(c[1]) + ": " + str(throughput) + " items/sec sustained")
print("  configs measured: " + str(configs_measured) + ", and throughput rises in every step")
print("  the benchmark was right, repeatable, and about the wrong axis")
print("")
fast_arrivals = 10000
print("null control - the same batch of 100 at " + str(fast_arrivals) + " arrivals per second")
fast_fill = int(100 * 1000 / fast_arrivals)
print("  fill time     : " + str(fast_fill) + " ms")
print("  first-in waits: " + str(fast_fill + after_batch_ms) + " ms")
print("  at " + str(arrivals_per_second) + " arrivals it was " + str(after_first_in) + " ms")
print("  same batch size, same code, same overhead constants")
print("  what changed is only how long 100 requests take to exist")
print("")
print("batch size trades one axis against the other, always in the same direction")
print("  items per second   rises with batch size")
print("  cost per item      falls with batch size")
print("  service time       rises with batch size")
print("  fill time          rises with batch size, and falls with arrival rate")
print("  sojourn time       rises with both")
print("  a benchmark run at saturation cannot see the fill term at all")
print("")
print("Amortising a fixed 40 ms over 100 items instead of 10 is correct, and the")
print("benchmark that confirmed it was honest: " + str(before_throughput) + " to " + str(after_throughput) + " items per second,")
print("repeatable. It ran against a saturated queue, where a batch is always full.")
print("Production arrives at " + str(arrivals_per_second) + " a second, where a batch of 100 takes " + str(int(100 * 1000 / arrivals_per_second)) + " ms to exist,")
print("and the first request into each one waits " + str(after_first_in) + " ms for a capacity increase")
print("it did not need.")
```

## stdout (executed)

```text
each batch costs 40 ms fixed plus 2 ms per item
requests arrive at 200 per second

saturated benchmark - a full batch is always ready
config          batch   ms per batch   items/sec   ms per item   request latency
  no batching    1        42            23         4200 centims        42
  before    10        60            166         600 centims        60
  after    100        240            416         240 centims        240

  throughput and cost per item both improve with batch size
  request latency gets worse with batch size, in the same table

production at 200 arrivals per second
config          batch   fill time   first-in waits   last-in waits   mean wait
  no batching    1       5          47             42            44
  before    10       50          110             60            85
  after    100       500          740             240            490

throughput  : 166 -> 416 items/sec, better by 250 hundredths
worst wait  : 110 -> 740 ms, worse by 672 hundredths

at 200 arrivals a second, 166 items/sec was already enough
the capacity that was bought was not short, and the wait that was sold was real

service time vs sojourn time
  service time  : time inside the batch call            -> 240 ms
  fill time     : time waiting for the batch to fill    -> 500 ms
  sojourn time  : what the caller experiences           -> 740 ms
  the timer was started when the batch call began
  so it measured 240 of the 740 ms the caller waited
  it was not reporting a wrong number, it was reporting a different one

control - the quantity the change genuinely improved
  batch 1: 23 items/sec sustained
  batch 10: 166 items/sec sustained
  batch 100: 416 items/sec sustained
  configs measured: 3, and throughput rises in every step
  the benchmark was right, repeatable, and about the wrong axis

null control - the same batch of 100 at 10000 arrivals per second
  fill time     : 10 ms
  first-in waits: 250 ms
  at 200 arrivals it was 740 ms
  same batch size, same code, same overhead constants
  what changed is only how long 100 requests take to exist

batch size trades one axis against the other, always in the same direction
  items per second   rises with batch size
  cost per item      falls with batch size
  service time       rises with batch size
  fill time          rises with batch size, and falls with arrival rate
  sojourn time       rises with both
  a benchmark run at saturation cannot see the fill term at all

Amortising a fixed 40 ms over 100 items instead of 10 is correct, and the
benchmark that confirmed it was honest: 166 to 416 items per second,
repeatable. It ran against a saturated queue, where a batch is always full.
Production arrives at 200 a second, where a batch of 100 takes 500 ms to exist,
and the first request into each one waits 740 ms for a capacity increase
it did not need.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
