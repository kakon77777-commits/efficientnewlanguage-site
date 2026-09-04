<!-- canonical: efficientnewlanguage.org/ai/examples/697-the-limit-was-on-concurrency-and-the-work-was-queued | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 697 — The limit was on concurrency and the work was queued

`the_limit_was_on_concurrency_and_the_work_was_queued.eml` - The downstream never sees more than thirty-two concurrent requests and it never has. What a caller waits is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The downstream
# never sees more than thirty-two concurrent requests and it never has. What a
# caller waits is computed below.
#
# The concurrency limit is correct and it saved the downstream. Thirty-two was
# measured, not guessed: above it the downstream's latency rose superlinearly
# and at forty it fell over. The semaphore is acquired and released in a finally,
# so a panic cannot leak a permit, and a soak test confirmed the count never
# exceeds the limit over eight hours.
#
# A request over the limit does not fail. It waits, in an unbounded queue, with
# no deadline — which is what makes the protection perfect and is the whole of
# the problem.
#
# Arrivals are four hundred and eighty a second and the limit serves two
# hundred and sixty-six.

32 => concurrency_limit
120 => downstream_service_ms
480 => arrivals_per_second
60 => burst_seconds
0 => times_the_limit_was_exceeded
0 => queue_bound

int(concurrency_limit * 1000 / downstream_service_ms) => served_per_second
arrivals_per_second - served_per_second => overflow_per_second
overflow_per_second * burst_seconds => queued_after_the_burst
int(queued_after_the_burst / served_per_second) => wait_seconds_at_the_back

"concurrency limit          : " + str(concurrency_limit) ^0
"downstream service time, ms: " + str(downstream_service_ms) ^0
"served per second          : " + str(served_per_second) ^0
"arrivals per second        : " + str(arrivals_per_second) ^0
"overflow per second        : " + str(overflow_per_second) ^0
"" ^0
"after a " + str(burst_seconds) + " second burst" ^0
"  queued                   : " + str(queued_after_the_burst) ^0
"  wait at the back, seconds: " + str(wait_seconds_at_the_back) ^0
"  queue bound              : " + str(queue_bound) + ", meaning none" ^0
"  times the limit was exceeded : " + str(times_the_limit_was_exceeded) ^0
"" ^0

# ---- what the limit verified ----

"the semaphore" ^0
"  limit measured, not guessed : yes, the downstream falls" ^0
"    over at 40 and degrades above 32" ^0
"  acquired and released in a finally : yes, a panic cannot" ^0
"    leak a permit" ^0
"  soak test over eight hours  : never exceeded" ^0
"  times exceeded in production: " + str(times_the_limit_was_exceeded) ^0
"  verdict                     : LIMITED" ^0
"" ^0
"  the downstream is genuinely protected and removing this" ^0
"  would take it down" ^0
"" ^0

# ---- what happens to the rest ----

"a request that cannot get a permit" ^0
"  rejected            : no" ^0
"  given a deadline    : no" ^0
"  counted             : no, the queue has no metric" ^0
"  what it does        : waits" ^0
"  what the caller sees: a request in flight" ^0
"" ^0
"  the protection is perfect because nothing is refused," ^0
"  and nothing is refused because the queue is unbounded" ^0
"" ^0

int(overflow_per_second * 10000 / arrivals_per_second) => overflow_per_myriad
"share of arrivals that must wait : " + str(overflow_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the dashboards show ----

# The downstream's dashboard is the healthiest it has ever been: latency flat,
# error rate zero, concurrency pinned at exactly the limit. The caller's
# dashboard is the one on fire, and they are different teams.
"the two dashboards" ^0
"  downstream : latency flat, errors zero, concurrency at" ^0
"    exactly " + str(concurrency_limit) ^0
"  caller     : latency climbing without bound" ^0
"  a panel showing the queue : none exists" ^0
"  which team owns which : different teams" ^0
"" ^0

# ---- null control ----

# The same limit, with a bounded queue and a deadline, so overflow is refused
# quickly instead of accepted slowly.
2 => nc_queue_seconds
nc_queue_seconds * served_per_second => nc_queue_bound
overflow_per_second => nc_refused_per_second

"null control - a bounded queue with a deadline" ^0
"  times the limit was exceeded : " + str(times_the_limit_was_exceeded) + ", unchanged" ^0
"  queue bound                  : " + str(nc_queue_bound) ^0
"  refused per second           : " + str(nc_refused_per_second) ^0
"  wait at the back, seconds    : " + str(nc_queue_seconds) ^0
"  the downstream is no better protected; the overflow" ^0
"  became visible and answerable instead of pending" ^0
"" ^0

# ---- the rule ----

"what a concurrency limit guarantees" ^0
"  the downstream sees at most N at once : exactly" ^0
"  the system degrades gracefully        : not addressed;" ^0
"    where the excess goes is a separate decision, and an" ^0
"    unbounded queue is the default nobody chose" ^0
"" ^0
"limiting is half a policy; the other half is what happens to" ^0
"what is over the limit, and a queue with no bound and no" ^0
"deadline converts a rejection into a latency nobody has a" ^0
"metric for" ^0
"" ^0

"The limit holds and the downstream is protected: " + str(concurrency_limit) + " measured rather than guessed," ^0
"released in a finally, " + str(times_the_limit_was_exceeded) + " exceedances in production or in an eight-hour soak." ^0
"It serves " + str(served_per_second) + " a second against " + str(arrivals_per_second) + " arriving, so " + str(overflow_per_myriad) + " per ten thousand" ^0
"must wait, and after " + str(burst_seconds) + " seconds " + str(queued_after_the_burst) + " requests are queued with nothing bounding" ^0
"them and " + str(wait_seconds_at_the_back) + " seconds of wait at the back, on a queue that has no panel." ^0
```

## Python (deterministic transpilation)

```python
concurrency_limit = 32
downstream_service_ms = 120
arrivals_per_second = 480
burst_seconds = 60
times_the_limit_was_exceeded = 0
queue_bound = 0
served_per_second = int(concurrency_limit * 1000 / downstream_service_ms)
overflow_per_second = arrivals_per_second - served_per_second
queued_after_the_burst = overflow_per_second * burst_seconds
wait_seconds_at_the_back = int(queued_after_the_burst / served_per_second)
print("concurrency limit          : " + str(concurrency_limit))
print("downstream service time, ms: " + str(downstream_service_ms))
print("served per second          : " + str(served_per_second))
print("arrivals per second        : " + str(arrivals_per_second))
print("overflow per second        : " + str(overflow_per_second))
print("")
print("after a " + str(burst_seconds) + " second burst")
print("  queued                   : " + str(queued_after_the_burst))
print("  wait at the back, seconds: " + str(wait_seconds_at_the_back))
print("  queue bound              : " + str(queue_bound) + ", meaning none")
print("  times the limit was exceeded : " + str(times_the_limit_was_exceeded))
print("")
print("the semaphore")
print("  limit measured, not guessed : yes, the downstream falls")
print("    over at 40 and degrades above 32")
print("  acquired and released in a finally : yes, a panic cannot")
print("    leak a permit")
print("  soak test over eight hours  : never exceeded")
print("  times exceeded in production: " + str(times_the_limit_was_exceeded))
print("  verdict                     : LIMITED")
print("")
print("  the downstream is genuinely protected and removing this")
print("  would take it down")
print("")
print("a request that cannot get a permit")
print("  rejected            : no")
print("  given a deadline    : no")
print("  counted             : no, the queue has no metric")
print("  what it does        : waits")
print("  what the caller sees: a request in flight")
print("")
print("  the protection is perfect because nothing is refused,")
print("  and nothing is refused because the queue is unbounded")
print("")
overflow_per_myriad = int(overflow_per_second * 10000 / arrivals_per_second)
print("share of arrivals that must wait : " + str(overflow_per_myriad) + " per ten thousand")
print("")
print("the two dashboards")
print("  downstream : latency flat, errors zero, concurrency at")
print("    exactly " + str(concurrency_limit))
print("  caller     : latency climbing without bound")
print("  a panel showing the queue : none exists")
print("  which team owns which : different teams")
print("")
nc_queue_seconds = 2
nc_queue_bound = nc_queue_seconds * served_per_second
nc_refused_per_second = overflow_per_second
print("null control - a bounded queue with a deadline")
print("  times the limit was exceeded : " + str(times_the_limit_was_exceeded) + ", unchanged")
print("  queue bound                  : " + str(nc_queue_bound))
print("  refused per second           : " + str(nc_refused_per_second))
print("  wait at the back, seconds    : " + str(nc_queue_seconds))
print("  the downstream is no better protected; the overflow")
print("  became visible and answerable instead of pending")
print("")
print("what a concurrency limit guarantees")
print("  the downstream sees at most N at once : exactly")
print("  the system degrades gracefully        : not addressed;")
print("    where the excess goes is a separate decision, and an")
print("    unbounded queue is the default nobody chose")
print("")
print("limiting is half a policy; the other half is what happens to")
print("what is over the limit, and a queue with no bound and no")
print("deadline converts a rejection into a latency nobody has a")
print("metric for")
print("")
print("The limit holds and the downstream is protected: " + str(concurrency_limit) + " measured rather than guessed,")
print("released in a finally, " + str(times_the_limit_was_exceeded) + " exceedances in production or in an eight-hour soak.")
print("It serves " + str(served_per_second) + " a second against " + str(arrivals_per_second) + " arriving, so " + str(overflow_per_myriad) + " per ten thousand")
print("must wait, and after " + str(burst_seconds) + " seconds " + str(queued_after_the_burst) + " requests are queued with nothing bounding")
print("them and " + str(wait_seconds_at_the_back) + " seconds of wait at the back, on a queue that has no panel.")
```

## stdout (executed)

```text
concurrency limit          : 32
downstream service time, ms: 120
served per second          : 266
arrivals per second        : 480
overflow per second        : 214

after a 60 second burst
  queued                   : 12840
  wait at the back, seconds: 48
  queue bound              : 0, meaning none
  times the limit was exceeded : 0

the semaphore
  limit measured, not guessed : yes, the downstream falls
    over at 40 and degrades above 32
  acquired and released in a finally : yes, a panic cannot
    leak a permit
  soak test over eight hours  : never exceeded
  times exceeded in production: 0
  verdict                     : LIMITED

  the downstream is genuinely protected and removing this
  would take it down

a request that cannot get a permit
  rejected            : no
  given a deadline    : no
  counted             : no, the queue has no metric
  what it does        : waits
  what the caller sees: a request in flight

  the protection is perfect because nothing is refused,
  and nothing is refused because the queue is unbounded

share of arrivals that must wait : 4458 per ten thousand

the two dashboards
  downstream : latency flat, errors zero, concurrency at
    exactly 32
  caller     : latency climbing without bound
  a panel showing the queue : none exists
  which team owns which : different teams

null control - a bounded queue with a deadline
  times the limit was exceeded : 0, unchanged
  queue bound                  : 532
  refused per second           : 214
  wait at the back, seconds    : 2
  the downstream is no better protected; the overflow
  became visible and answerable instead of pending

what a concurrency limit guarantees
  the downstream sees at most N at once : exactly
  the system degrades gracefully        : not addressed;
    where the excess goes is a separate decision, and an
    unbounded queue is the default nobody chose

limiting is half a policy; the other half is what happens to
what is over the limit, and a queue with no bound and no
deadline converts a rejection into a latency nobody has a
metric for

The limit holds and the downstream is protected: 32 measured rather than guessed,
released in a finally, 0 exceedances in production or in an eight-hour soak.
It serves 266 a second against 480 arriving, so 4458 per ten thousand
must wait, and after 60 seconds 12840 requests are queued with nothing bounding
them and 48 seconds of wait at the back, on a queue that has no panel.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
