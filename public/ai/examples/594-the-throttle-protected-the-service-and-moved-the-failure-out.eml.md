<!-- canonical: efficientnewlanguage.org/ai/examples/594-the-throttle-protected-the-service-and-moved-the-failure-out | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 594 — The throttle protected the service and moved the failure out

`the_throttle_protected_the_service_and_moved_the_failure_out.eml` - A rate limiter holds the service at its measured capacity. The service's error rate is zero and its latency is flat. What the system as a whole delivers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A rate limiter
# holds the service at its measured capacity. The service's error rate is zero
# and its latency is flat. What the system as a whole delivers is computed
# below.
#
# Shedding load at the edge is correct and it is the standard answer, for good
# reasons. A service that accepts more than it can serve does not serve more; it
# serves everything slowly, then times out, and a timeout costs the work already
# done plus the retry. Refusing early returns a clear signal to the caller while
# it can still act on it, and it keeps the accepted requests fast. The limit was
# set from a measured capacity, not a guess.
#
# A rejection is a failure that has been moved rather than removed. The service
# stops recording it because the service is no longer where it happens. The
# caller records it, and the caller's response to it is a retry, which arrives
# as new offered load.
#
# The limiter has no term for what the caller does next, so the loop it closes
# is not visible from either side alone.

2000 => capacity_rps
2600 => offered_rps
3 => retries_per_rejection

offered_rps - capacity_rps => rejected_rps

"capacity      : " + str(capacity_rps) + " rps, measured" ^0
"offered       : " + str(offered_rps) + " rps" ^0
"rejected      : " + str(rejected_rps) + " rps" ^0
"" ^0

"the service's own numbers" ^0
"  requests served     : " + str(capacity_rps) + " rps" ^0
"  latency             : flat, it is never overloaded" ^0
"  server error rate   : 0, a 429 is not a server error" ^0
"  SLO                 : met" ^0
"" ^0
"the caller's numbers" ^0
"  requests refused    : " + str(rejected_rps) + " rps" ^0
"  share refused       : " + str(int(rejected_rps * 100 / offered_rps)) + " percent" ^0
"" ^0

# ---- what the caller does with a 429 ----

rejected_rps * retries_per_rejection => retry_rps
offered_rps + retry_rps => offered_round_two
offered_round_two - capacity_rps => rejected_round_two

"each rejection is retried " + str(retries_per_rejection) + " times" ^0
"  retry traffic added : " + str(retry_rps) + " rps" ^0
"  offered, round two  : " + str(offered_round_two) + " rps" ^0
"  rejected, round two : " + str(rejected_round_two) + " rps" ^0
"  rejections grew by  : " + str(int((rejected_round_two - rejected_rps) * 100 / rejected_rps)) + " percent" ^0
"" ^0

"  served, round one : " + str(capacity_rps) ^0
"  served, round two : " + str(capacity_rps) ^0
"  the served column does not move, which is the limiter working" ^0
"" ^0

# ---- the loop ----

"round   offered   served   rejected" ^0
offered_rps => current_offered
for r in [1:4]:
    current_offered - capacity_rps => rej
    "  " + str(r) + "       " + str(current_offered) + "      " + str(capacity_rps) + "     " + str(rej) ^0
    offered_rps + (rej * retries_per_rejection) => current_offered
"" ^0
"  the limiter is doing exactly what it promised at every row" ^0
"  and the rejected column is the input to the next row" ^0
"" ^0

# ---- where the work goes ----

int(offered_round_two * 100 / offered_rps) => load_multiplier_pct

"  original demand        : " + str(offered_rps) + " rps of real work" ^0
"  load reaching the limiter : " + str(offered_round_two) + " rps" ^0
"  of that, retries       : " + str(retry_rps) + " rps, none of it new work" ^0
"  load multiplier        : " + str(load_multiplier_pct) + " percent of the original" ^0
"  every retry consumes a connection, a TLS handshake and a limiter" ^0
"  decision, and none of them reach a worker" ^0
"" ^0

# ---- what a caller-side answer would do ----
#
# The retry is the caller's correct response to a transient failure. It is the
# wrong response to a capacity signal, and the two are not distinguishable from
# the status code alone unless the response says how long to wait.

"the same rejection, with a retry-after the caller honours" ^0
"  retries within the second : 0" ^0
"  offered                   : " + str(offered_rps) + " rps, unchanged" ^0
"  rejected                  : " + str(rejected_rps) + " rps" ^0
"  the demand is the same and the amplification is gone" ^0
"  the limiter's job was to tell the caller something, and the number it" ^0
"  needed to say is not in the status code" ^0
"" ^0

# ---- the control ----
#
# The limiter, against everything it promised. It holds the service at capacity,
# it never lets latency rise, it never returns a server error, and it was tuned
# from a real measurement. Every claim it makes is true.

"control - is the limiter doing its job" ^0
"  requests admitted beyond capacity : 0" ^0
"  latency excursions                : 0" ^0
"  server errors                     : 0" ^0
"  the service protected              : yes, completely" ^0
"  defects in the limiter             : 0" ^0
"" ^0
"  it protects the service, which is the thing it was asked to protect" ^0
"  and nothing measures the pair" ^0
"" ^0

# ---- the null control ----
#
# The same limiter when offered load is under capacity. Nothing is rejected,
# nothing is retried, no loop forms, and the limiter is pure insurance. It is
# not the limiter that closes the loop; it is a rejection meeting a retry.

1800 => nc_offered_rps

"null control - the same limiter under capacity" ^0
"  offered   : " + str(nc_offered_rps) + " rps" ^0
"  capacity  : " + str(capacity_rps) + " rps" ^0
"  rejected  : 0" ^0
"  retries   : 0" ^0
"  amplification : none" ^0
"  same limiter, same threshold, same callers" ^0
"  the loop needs a rejection to exist before it can begin" ^0
"" ^0

# ---- the rule ----

"a failure that is moved rather than removed" ^0
"  disappears from the mover's metrics    yes, immediately" ^0
"  appears in the receiver's metrics      yes, and the receiver is elsewhere" ^0
"  changes the receiver's behaviour       yes, and that behaviour returns" ^0
"  the return path is what nobody owns" ^0
"" ^0
"the measurement that closes it is not on either side" ^0
"it is offered load against original demand, and neither party can" ^0
"compute it alone" ^0
"" ^0

"Shedding at the edge is the right answer and this limiter implements it" ^0
"correctly: the service never exceeds its measured capacity, latency never" ^0
"moves, and its error rate is zero because a 429 is not a server error. Each" ^0
"rejection is retried " + str(retries_per_rejection) + " times, so offered load reaches " + str(offered_round_two) + " rps and" ^0
"rejections reach " + str(rejected_round_two) + " - " + str(int((rejected_round_two - rejected_rps) * 100 / rejected_rps)) + " percent more than before - while the served" ^0
"column holds at " + str(capacity_rps) + " and every SLO stays green." ^0
```

## Python (deterministic transpilation)

```python
capacity_rps = 2000
offered_rps = 2600
retries_per_rejection = 3
rejected_rps = offered_rps - capacity_rps
print("capacity      : " + str(capacity_rps) + " rps, measured")
print("offered       : " + str(offered_rps) + " rps")
print("rejected      : " + str(rejected_rps) + " rps")
print("")
print("the service's own numbers")
print("  requests served     : " + str(capacity_rps) + " rps")
print("  latency             : flat, it is never overloaded")
print("  server error rate   : 0, a 429 is not a server error")
print("  SLO                 : met")
print("")
print("the caller's numbers")
print("  requests refused    : " + str(rejected_rps) + " rps")
print("  share refused       : " + str(int(rejected_rps * 100 / offered_rps)) + " percent")
print("")
retry_rps = rejected_rps * retries_per_rejection
offered_round_two = offered_rps + retry_rps
rejected_round_two = offered_round_two - capacity_rps
print("each rejection is retried " + str(retries_per_rejection) + " times")
print("  retry traffic added : " + str(retry_rps) + " rps")
print("  offered, round two  : " + str(offered_round_two) + " rps")
print("  rejected, round two : " + str(rejected_round_two) + " rps")
print("  rejections grew by  : " + str(int((rejected_round_two - rejected_rps) * 100 / rejected_rps)) + " percent")
print("")
print("  served, round one : " + str(capacity_rps))
print("  served, round two : " + str(capacity_rps))
print("  the served column does not move, which is the limiter working")
print("")
print("round   offered   served   rejected")
current_offered = offered_rps
for r in range(1, 5):
    rej = current_offered - capacity_rps
    print("  " + str(r) + "       " + str(current_offered) + "      " + str(capacity_rps) + "     " + str(rej))
    current_offered = offered_rps + rej * retries_per_rejection
print("")
print("  the limiter is doing exactly what it promised at every row")
print("  and the rejected column is the input to the next row")
print("")
load_multiplier_pct = int(offered_round_two * 100 / offered_rps)
print("  original demand        : " + str(offered_rps) + " rps of real work")
print("  load reaching the limiter : " + str(offered_round_two) + " rps")
print("  of that, retries       : " + str(retry_rps) + " rps, none of it new work")
print("  load multiplier        : " + str(load_multiplier_pct) + " percent of the original")
print("  every retry consumes a connection, a TLS handshake and a limiter")
print("  decision, and none of them reach a worker")
print("")
print("the same rejection, with a retry-after the caller honours")
print("  retries within the second : 0")
print("  offered                   : " + str(offered_rps) + " rps, unchanged")
print("  rejected                  : " + str(rejected_rps) + " rps")
print("  the demand is the same and the amplification is gone")
print("  the limiter's job was to tell the caller something, and the number it")
print("  needed to say is not in the status code")
print("")
print("control - is the limiter doing its job")
print("  requests admitted beyond capacity : 0")
print("  latency excursions                : 0")
print("  server errors                     : 0")
print("  the service protected              : yes, completely")
print("  defects in the limiter             : 0")
print("")
print("  it protects the service, which is the thing it was asked to protect")
print("  and nothing measures the pair")
print("")
nc_offered_rps = 1800
print("null control - the same limiter under capacity")
print("  offered   : " + str(nc_offered_rps) + " rps")
print("  capacity  : " + str(capacity_rps) + " rps")
print("  rejected  : 0")
print("  retries   : 0")
print("  amplification : none")
print("  same limiter, same threshold, same callers")
print("  the loop needs a rejection to exist before it can begin")
print("")
print("a failure that is moved rather than removed")
print("  disappears from the mover's metrics    yes, immediately")
print("  appears in the receiver's metrics      yes, and the receiver is elsewhere")
print("  changes the receiver's behaviour       yes, and that behaviour returns")
print("  the return path is what nobody owns")
print("")
print("the measurement that closes it is not on either side")
print("it is offered load against original demand, and neither party can")
print("compute it alone")
print("")
print("Shedding at the edge is the right answer and this limiter implements it")
print("correctly: the service never exceeds its measured capacity, latency never")
print("moves, and its error rate is zero because a 429 is not a server error. Each")
print("rejection is retried " + str(retries_per_rejection) + " times, so offered load reaches " + str(offered_round_two) + " rps and")
print("rejections reach " + str(rejected_round_two) + " - " + str(int((rejected_round_two - rejected_rps) * 100 / rejected_rps)) + " percent more than before - while the served")
print("column holds at " + str(capacity_rps) + " and every SLO stays green.")
```

## stdout (executed)

```text
capacity      : 2000 rps, measured
offered       : 2600 rps
rejected      : 600 rps

the service's own numbers
  requests served     : 2000 rps
  latency             : flat, it is never overloaded
  server error rate   : 0, a 429 is not a server error
  SLO                 : met

the caller's numbers
  requests refused    : 600 rps
  share refused       : 23 percent

each rejection is retried 3 times
  retry traffic added : 1800 rps
  offered, round two  : 4400 rps
  rejected, round two : 2400 rps
  rejections grew by  : 300 percent

  served, round one : 2000
  served, round two : 2000
  the served column does not move, which is the limiter working

round   offered   served   rejected
  1       2600      2000     600
  2       4400      2000     2400
  3       9800      2000     7800
  4       26000      2000     24000

  the limiter is doing exactly what it promised at every row
  and the rejected column is the input to the next row

  original demand        : 2600 rps of real work
  load reaching the limiter : 4400 rps
  of that, retries       : 1800 rps, none of it new work
  load multiplier        : 169 percent of the original
  every retry consumes a connection, a TLS handshake and a limiter
  decision, and none of them reach a worker

the same rejection, with a retry-after the caller honours
  retries within the second : 0
  offered                   : 2600 rps, unchanged
  rejected                  : 600 rps
  the demand is the same and the amplification is gone
  the limiter's job was to tell the caller something, and the number it
  needed to say is not in the status code

control - is the limiter doing its job
  requests admitted beyond capacity : 0
  latency excursions                : 0
  server errors                     : 0
  the service protected              : yes, completely
  defects in the limiter             : 0

  it protects the service, which is the thing it was asked to protect
  and nothing measures the pair

null control - the same limiter under capacity
  offered   : 1800 rps
  capacity  : 2000 rps
  rejected  : 0
  retries   : 0
  amplification : none
  same limiter, same threshold, same callers
  the loop needs a rejection to exist before it can begin

a failure that is moved rather than removed
  disappears from the mover's metrics    yes, immediately
  appears in the receiver's metrics      yes, and the receiver is elsewhere
  changes the receiver's behaviour       yes, and that behaviour returns
  the return path is what nobody owns

the measurement that closes it is not on either side
it is offered load against original demand, and neither party can
compute it alone

Shedding at the edge is the right answer and this limiter implements it
correctly: the service never exceeds its measured capacity, latency never
moves, and its error rate is zero because a 429 is not a server error. Each
rejection is retried 3 times, so offered load reaches 4400 rps and
rejections reach 2400 - 300 percent more than before - while the served
column holds at 2000 and every SLO stays green.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
