<!-- canonical: efficientnewlanguage.org/ai/examples/608-the-retry-succeeded-and-the-first-attempt-also-landed | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 608 — The retry succeeded and the first attempt also landed

`the_retry_succeeded_and_the_first_attempt_also_landed.eml` - A client times out at two seconds and retries. The server is slower than that for a small share of requests, and it finishes them. What each party records is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A client times
# out at two seconds and retries. The server is slower than that for a small
# share of requests, and it finishes them. What each party records is computed
# below.
#
# The retry is correct and it is why the client-visible error rate is zero. A
# request that has not answered in two seconds is, from the caller's side,
# indistinguishable from one that never will, and waiting longer converts a
# recoverable blip into a user-visible failure. The timeout was set from a
# measured latency distribution and the retry count is one, not five.
#
# A timeout tells the caller that no answer arrived. It does not tell the
# caller whether the work happened. Those are different facts and only one of
# them crosses the wire.
#
# So the first attempt completes, the retry completes, and every party's own
# numbers are correct. The defect is not in either party's record; it is that
# nobody holds both.

1200000 => requests_per_day
2000 => client_timeout_ms
31 => slower_than_timeout_per_thousand
1 => retries_per_timeout

int(requests_per_day * slower_than_timeout_per_thousand / 1000) => timed_out
timed_out * retries_per_timeout => retries_sent

"requests per day            : " + str(requests_per_day) ^0
"client timeout              : " + str(client_timeout_ms) + " ms" ^0
"slower than the timeout     : " + str(slower_than_timeout_per_thousand) + " per thousand" ^0
"requests that timed out     : " + str(timed_out) ^0
"retries sent                : " + str(retries_sent) ^0
"" ^0

# ---- what each side records ----

timed_out + retries_sent => attempts_for_those_requests
timed_out => duplicate_effects

"the client's record" ^0
"  requests issued        : " + str(requests_per_day) ^0
"  errors returned to user: 0" ^0
"  success rate           : 100 percent" ^0
"  retries, all successful: " + str(retries_sent) ^0
"" ^0
"the server's record" ^0
"  attempts received for those requests : " + str(attempts_for_those_requests) ^0
"  attempts that failed                 : 0" ^0
"  success rate                         : 100 percent" ^0
"" ^0
"the ledger" ^0
"  intended effects : " + str(timed_out) ^0
"  recorded effects : " + str(attempts_for_those_requests) ^0
"  duplicates       : " + str(duplicate_effects) ^0
"" ^0
"  both parties report 100 percent and neither is wrong" ^0
"" ^0

# ---- the timeline of one request ----

2400 => this_request_ms

"one request, in milliseconds" ^0
"  0     client sends" ^0
"  " + str(client_timeout_ms) + "  client gives up, records a timeout" ^0
"  " + str(client_timeout_ms) + "  client sends the retry" ^0
"  " + str(this_request_ms) + "  first attempt COMMITS" ^0
"  " + str(this_request_ms + 900) + "  retry COMMITS" ^0
"" ^0
"  the client saw one failure and one success" ^0
"  the server saw two successes" ^0
"  the account was debited " + str(1 + retries_per_timeout) + " times" ^0
"" ^0

# ---- where the timeout sits relative to the work ----

"what the two-second mark separates" ^0
"  answers that arrived in time  : left of the line" ^0
"  answers that arrived late     : right of the line" ^0
"  work that did not happen      : right of the line" ^0
"  work that did happen          : right of the line" ^0
"" ^0
"  the last two are the same side, and the status code is the same" ^0
"" ^0

# ---- the cost, at the same rate, over a month ----

"day    timed out   duplicates   cumulative" ^0
0 => cumulative
for d in [1:5]:
    cumulative + duplicate_effects => cumulative
    "  " + str(d) + "      " + str(timed_out) + "        " + str(duplicate_effects) + "        " + str(cumulative) ^0
"" ^0
"  nothing in that table is an error condition anywhere" ^0
"" ^0

# ---- the control ----
#
# The retry policy, against what it was chosen to do. Without it those
# requests are user-visible failures; with it they are not, and it does not
# amplify - one retry, not a cascade.

"control - is the retry doing its job" ^0
"  user-visible failures without it : " + str(timed_out) ^0
"  user-visible failures with it    : 0" ^0
"  retry storms                     : 0, the count is " + str(retries_per_timeout) ^0
"  defects in the retry policy      : 0" ^0
"" ^0
"  removing the retry removes the duplicates and returns " + str(timed_out) ^0
"  failures to users, which is a worse trade, not a better one" ^0
"" ^0

# ---- the null control ----
#
# The same timeout, the same retry, the same slow tail, on a read. Every one of
# the duplicates still happens and none of them costs anything, because the
# second execution of a read leaves the same world behind as the first.

"null control - the identical retry on an idempotent call" ^0
"  requests that timed out : " + str(timed_out) ^0
"  retries sent            : " + str(retries_sent) ^0
"  duplicate executions    : " + str(duplicate_effects) ^0
"  duplicate EFFECTS       : 0" ^0
"  the retry did not change; what it was retrying did" ^0
"" ^0

# ---- the rule ----

"what a timeout is evidence of" ^0
"  no answer arrived within the window : yes, that is measured" ^0
"  the work did not run                : not measured, not implied" ^0
"  the work will not run               : not measured, not implied" ^0
"  and the caller must decide using only the first" ^0
"" ^0
"the fix is not a longer timeout, which moves the line without" ^0
"removing it; it is a key the second attempt can present so the" ^0
"server can recognise it as the same intent" ^0
"" ^0

"The timeout is correctly set and the retry is why " + str(timed_out) + " users saw a" ^0
"success instead of an error. Both parties report a 100 percent success rate" ^0
"and both are telling the truth: the client counts " + str(requests_per_day) + " requests with 0" ^0
"errors, the server counts " + str(attempts_for_those_requests) + " attempts with 0 failures, and the " + str(duplicate_effects) ^0
"duplicate effects appear in neither record because neither party holds both." ^0
```

## Python (deterministic transpilation)

```python
requests_per_day = 1200000
client_timeout_ms = 2000
slower_than_timeout_per_thousand = 31
retries_per_timeout = 1
timed_out = int(requests_per_day * slower_than_timeout_per_thousand / 1000)
retries_sent = timed_out * retries_per_timeout
print("requests per day            : " + str(requests_per_day))
print("client timeout              : " + str(client_timeout_ms) + " ms")
print("slower than the timeout     : " + str(slower_than_timeout_per_thousand) + " per thousand")
print("requests that timed out     : " + str(timed_out))
print("retries sent                : " + str(retries_sent))
print("")
attempts_for_those_requests = timed_out + retries_sent
duplicate_effects = timed_out
print("the client's record")
print("  requests issued        : " + str(requests_per_day))
print("  errors returned to user: 0")
print("  success rate           : 100 percent")
print("  retries, all successful: " + str(retries_sent))
print("")
print("the server's record")
print("  attempts received for those requests : " + str(attempts_for_those_requests))
print("  attempts that failed                 : 0")
print("  success rate                         : 100 percent")
print("")
print("the ledger")
print("  intended effects : " + str(timed_out))
print("  recorded effects : " + str(attempts_for_those_requests))
print("  duplicates       : " + str(duplicate_effects))
print("")
print("  both parties report 100 percent and neither is wrong")
print("")
this_request_ms = 2400
print("one request, in milliseconds")
print("  0     client sends")
print("  " + str(client_timeout_ms) + "  client gives up, records a timeout")
print("  " + str(client_timeout_ms) + "  client sends the retry")
print("  " + str(this_request_ms) + "  first attempt COMMITS")
print("  " + str(this_request_ms + 900) + "  retry COMMITS")
print("")
print("  the client saw one failure and one success")
print("  the server saw two successes")
print("  the account was debited " + str(1 + retries_per_timeout) + " times")
print("")
print("what the two-second mark separates")
print("  answers that arrived in time  : left of the line")
print("  answers that arrived late     : right of the line")
print("  work that did not happen      : right of the line")
print("  work that did happen          : right of the line")
print("")
print("  the last two are the same side, and the status code is the same")
print("")
print("day    timed out   duplicates   cumulative")
cumulative = 0
for d in range(1, 6):
    cumulative = cumulative + duplicate_effects
    print("  " + str(d) + "      " + str(timed_out) + "        " + str(duplicate_effects) + "        " + str(cumulative))
print("")
print("  nothing in that table is an error condition anywhere")
print("")
print("control - is the retry doing its job")
print("  user-visible failures without it : " + str(timed_out))
print("  user-visible failures with it    : 0")
print("  retry storms                     : 0, the count is " + str(retries_per_timeout))
print("  defects in the retry policy      : 0")
print("")
print("  removing the retry removes the duplicates and returns " + str(timed_out))
print("  failures to users, which is a worse trade, not a better one")
print("")
print("null control - the identical retry on an idempotent call")
print("  requests that timed out : " + str(timed_out))
print("  retries sent            : " + str(retries_sent))
print("  duplicate executions    : " + str(duplicate_effects))
print("  duplicate EFFECTS       : 0")
print("  the retry did not change; what it was retrying did")
print("")
print("what a timeout is evidence of")
print("  no answer arrived within the window : yes, that is measured")
print("  the work did not run                : not measured, not implied")
print("  the work will not run               : not measured, not implied")
print("  and the caller must decide using only the first")
print("")
print("the fix is not a longer timeout, which moves the line without")
print("removing it; it is a key the second attempt can present so the")
print("server can recognise it as the same intent")
print("")
print("The timeout is correctly set and the retry is why " + str(timed_out) + " users saw a")
print("success instead of an error. Both parties report a 100 percent success rate")
print("and both are telling the truth: the client counts " + str(requests_per_day) + " requests with 0")
print("errors, the server counts " + str(attempts_for_those_requests) + " attempts with 0 failures, and the " + str(duplicate_effects))
print("duplicate effects appear in neither record because neither party holds both.")
```

## stdout (executed)

```text
requests per day            : 1200000
client timeout              : 2000 ms
slower than the timeout     : 31 per thousand
requests that timed out     : 37200
retries sent                : 37200

the client's record
  requests issued        : 1200000
  errors returned to user: 0
  success rate           : 100 percent
  retries, all successful: 37200

the server's record
  attempts received for those requests : 74400
  attempts that failed                 : 0
  success rate                         : 100 percent

the ledger
  intended effects : 37200
  recorded effects : 74400
  duplicates       : 37200

  both parties report 100 percent and neither is wrong

one request, in milliseconds
  0     client sends
  2000  client gives up, records a timeout
  2000  client sends the retry
  2400  first attempt COMMITS
  3300  retry COMMITS

  the client saw one failure and one success
  the server saw two successes
  the account was debited 2 times

what the two-second mark separates
  answers that arrived in time  : left of the line
  answers that arrived late     : right of the line
  work that did not happen      : right of the line
  work that did happen          : right of the line

  the last two are the same side, and the status code is the same

day    timed out   duplicates   cumulative
  1      37200        37200        37200
  2      37200        37200        74400
  3      37200        37200        111600
  4      37200        37200        148800
  5      37200        37200        186000

  nothing in that table is an error condition anywhere

control - is the retry doing its job
  user-visible failures without it : 37200
  user-visible failures with it    : 0
  retry storms                     : 0, the count is 1
  defects in the retry policy      : 0

  removing the retry removes the duplicates and returns 37200
  failures to users, which is a worse trade, not a better one

null control - the identical retry on an idempotent call
  requests that timed out : 37200
  retries sent            : 37200
  duplicate executions    : 37200
  duplicate EFFECTS       : 0
  the retry did not change; what it was retrying did

what a timeout is evidence of
  no answer arrived within the window : yes, that is measured
  the work did not run                : not measured, not implied
  the work will not run               : not measured, not implied
  and the caller must decide using only the first

the fix is not a longer timeout, which moves the line without
removing it; it is a key the second attempt can present so the
server can recognise it as the same intent

The timeout is correctly set and the retry is why 37200 users saw a
success instead of an error. Both parties report a 100 percent success rate
and both are telling the truth: the client counts 1200000 requests with 0
errors, the server counts 74400 attempts with 0 failures, and the 37200
duplicate effects appear in neither record because neither party holds both.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
