<!-- canonical: efficientnewlanguage.org/ai/examples/730-the-timeout-was-set-and-the-pool-had-its-own | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 730 — The timeout was set and the pool had its own

`the_timeout_was_set_and_the_pool_had_its_own.eml` - Every outbound call has an explicit timeout and a lint rule fails the build without one. What that timeout bounds is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every outbound
# call has an explicit timeout and a lint rule fails the build without one.
# What that timeout bounds is computed below.
#
# The timeout discipline is real and it is enforced by a machine. There is no
# unbounded wait anywhere in the service; the value was chosen from the
# dependency's measured p99 plus headroom rather than picked round; it is set
# per call site rather than globally, so a slow endpoint does not raise the
# bound for a fast one; and a lint rule fails the build on any client
# constructed without one. Two hundred fourteen call sites, all covered.
#
# The timeout starts when the request is handed to the transport. Before that
# the transport waits for a free connection, and the wait for a pool slot is
# governed by the pool's own limit, which nobody set.
#
# The library's default acquire timeout is thirty seconds.

214 => call_sites
214 => call_sites_with_an_explicit_timeout
0 => call_sites_without_one
250 => request_timeout_ms
30000 => pool_acquire_timeout_ms
0 => call_sites_with_an_explicit_acquire_timeout
20 => pool_size
6200000 => calls_per_day
74000 => calls_whose_pool_wait_exceeded_the_request_timeout
8400 => observed_p99_ms_under_saturation

request_timeout_ms + pool_acquire_timeout_ms => worst_case_wait_ms
int(request_timeout_ms * 10000 / worst_case_wait_ms) => bounded_by_the_chosen_value_per_myriad
int(calls_whose_pool_wait_exceeded_the_request_timeout * 10000 / calls_per_day) => affected_per_myriad
calls_per_day - calls_whose_pool_wait_exceeded_the_request_timeout => calls_the_timeout_describes

"call sites                      : " + str(call_sites) ^0
"  with an explicit timeout      : " + str(call_sites_with_an_explicit_timeout) ^0
"  without one                   : " + str(call_sites_without_one) ^0
"  with an explicit acquire timeout : " + str(call_sites_with_an_explicit_acquire_timeout) ^0
"" ^0
"request timeout, ms             : " + str(request_timeout_ms) ^0
"pool acquire timeout, ms        : " + str(pool_acquire_timeout_ms) ^0
"worst case wait, ms             : " + str(worst_case_wait_ms) ^0
"  bounded by the chosen value   : " + str(bounded_by_the_chosen_value_per_myriad) + " per ten thousand" ^0
"observed p99 under saturation, ms : " + str(observed_p99_ms_under_saturation) ^0
"" ^0
"pool size                       : " + str(pool_size) ^0
"calls per day                   : " + str(calls_per_day) ^0
"  the timeout describes         : " + str(calls_the_timeout_describes) ^0
"  pool wait exceeded it         : " + str(calls_whose_pool_wait_exceeded_the_request_timeout) ^0
"  share                         : " + str(affected_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the discipline verified ----

"the timeout rule" ^0
"  unbounded waits in the service : " + str(call_sites_without_one) ^0
"  where the value came from : the dependency p99 plus" ^0
"    headroom, measured" ^0
"  set per call site or globally : per call site" ^0
"  enforced by : a lint rule that fails the build" ^0
"  call sites covered : " + str(call_sites_with_an_explicit_timeout) + " of " + str(call_sites) ^0
"  verdict : BOUNDED" ^0
"" ^0
"  a machine-enforced rule beats a convention, and choosing" ^0
"  per call site beats one global number" ^0
"" ^0

# ---- what the clock is started on ----

"the timer" ^0
"  starts when : the request is handed to the transport" ^0
"  what happens before that : the transport waits for a" ^0
"    free connection from the pool" ^0
"  who bounds that wait : the pool, from its own setting" ^0
"  what that setting is : " + str(pool_acquire_timeout_ms) + " ms, the library default" ^0
"  call sites that set it : " + str(call_sites_with_an_explicit_acquire_timeout) ^0
"  what the lint rule checks : the request timeout" ^0
"" ^0
"  the covered quantity is real and it is the second of the" ^0
"  two waits, and the multiple between them is below" ^0
"" ^0
int(pool_acquire_timeout_ms / request_timeout_ms) => acquire_is_this_many_times_the_request_timeout

"the two waits compared" ^0
"  request timeout, ms : " + str(request_timeout_ms) + ", chosen" ^0
"  acquire timeout, ms : " + str(pool_acquire_timeout_ms) + ", inherited" ^0
"  multiple            : " + str(acquire_is_this_many_times_the_request_timeout) ^0
"" ^0

# ---- when the two waits are actually different ----

# With a free connection the pool wait is zero and the timeout is the whole
# story, which is every call in a normal hour. The pool only matters when it is
# full, and it is full exactly when the dependency is slow - the case the
# timeout was chosen for.
"when the pool wait is nonzero" ^0
"  connections free : the wait is zero and the chosen" ^0
"    timeout is the whole bound" ^0
"  pool full        : the wait is the queue for a slot" ^0
"  when the pool fills : when calls stop returning quickly" ^0
"  which is           : the condition the timeout exists for" ^0
"  so the two are     : correlated, not independent" ^0
"" ^0

# ---- what a caller upstream sees ----

# The service's own timeout dashboard is green: requests that get a connection
# either finish or are cut at the chosen value. The requests waiting for a
# connection are not requests yet.
"what the timeout metric counts" ^0
"  requests cut at the chosen value : counted, and correct" ^0
"  requests waiting for a slot      : not yet issued, so" ^0
"    not in the metric" ^0
"  where they appear instead : the caller's own latency," ^0
"    as " + str(observed_p99_ms_under_saturation) + " ms at p99 under saturation" ^0
"  calls a day in that state : " + str(calls_whose_pool_wait_exceeded_the_request_timeout) ^0
"" ^0

# ---- null control ----

# The same call sites, with one deadline set for the whole operation and passed
# to both the acquire and the request.
request_timeout_ms => nc_worst_case_wait_ms
0 => nc_calls_whose_wait_exceeded_the_deadline

"null control - one deadline covers acquire and request" ^0
"  call sites covered : " + str(call_sites_with_an_explicit_timeout) + ", unchanged" ^0
"  worst case wait, ms : " + str(nc_worst_case_wait_ms) ^0
"  calls exceeding the deadline : " + str(nc_calls_whose_wait_exceeded_the_deadline) ^0
"  the timeout did not get shorter; it started covering the" ^0
"  whole interval the caller is waiting through" ^0
"" ^0

# ---- the rule ----

"what an explicit timeout guarantees" ^0
"  this request will not run longer than the value : exactly," ^0
"    at every one of " + str(call_sites) + " call sites" ^0
"  the caller will not wait longer than the value  : not" ^0
"    addressed; the value bounds an operation that has not" ^0
"    started, and getting to the start is also waiting" ^0
"" ^0
"a timeout is a bound on an interval, so it is only as good" ^0
"as the interval it is attached to; a lint rule that finds" ^0
"every missing timeout finds every missing one of the kind it" ^0
"knows to look for" ^0
"" ^0

"Every one of " + str(call_sites) + " call sites has an explicit timeout, chosen from a measured p99" ^0
"and enforced by a lint rule that fails the build - " + str(call_sites_without_one) + " unbounded waits. It starts" ^0
"when the request reaches the transport, after a pool wait bounded by an" ^0
"inherited " + str(pool_acquire_timeout_ms) + " ms that " + str(call_sites_with_an_explicit_acquire_timeout) + " call sites set, so the chosen value bounds" ^0
str(bounded_by_the_chosen_value_per_myriad) + " per ten thousand of a " + str(worst_case_wait_ms) + " ms worst case, and " + str(calls_whose_pool_wait_exceeded_the_request_timeout) + " calls a day -" ^0
str(affected_per_myriad) + " per ten thousand - wait longer to start than they were allowed to run." ^0
```

## Python (deterministic transpilation)

```python
call_sites = 214
call_sites_with_an_explicit_timeout = 214
call_sites_without_one = 0
request_timeout_ms = 250
pool_acquire_timeout_ms = 30000
call_sites_with_an_explicit_acquire_timeout = 0
pool_size = 20
calls_per_day = 6200000
calls_whose_pool_wait_exceeded_the_request_timeout = 74000
observed_p99_ms_under_saturation = 8400
worst_case_wait_ms = request_timeout_ms + pool_acquire_timeout_ms
bounded_by_the_chosen_value_per_myriad = int(request_timeout_ms * 10000 / worst_case_wait_ms)
affected_per_myriad = int(calls_whose_pool_wait_exceeded_the_request_timeout * 10000 / calls_per_day)
calls_the_timeout_describes = calls_per_day - calls_whose_pool_wait_exceeded_the_request_timeout
print("call sites                      : " + str(call_sites))
print("  with an explicit timeout      : " + str(call_sites_with_an_explicit_timeout))
print("  without one                   : " + str(call_sites_without_one))
print("  with an explicit acquire timeout : " + str(call_sites_with_an_explicit_acquire_timeout))
print("")
print("request timeout, ms             : " + str(request_timeout_ms))
print("pool acquire timeout, ms        : " + str(pool_acquire_timeout_ms))
print("worst case wait, ms             : " + str(worst_case_wait_ms))
print("  bounded by the chosen value   : " + str(bounded_by_the_chosen_value_per_myriad) + " per ten thousand")
print("observed p99 under saturation, ms : " + str(observed_p99_ms_under_saturation))
print("")
print("pool size                       : " + str(pool_size))
print("calls per day                   : " + str(calls_per_day))
print("  the timeout describes         : " + str(calls_the_timeout_describes))
print("  pool wait exceeded it         : " + str(calls_whose_pool_wait_exceeded_the_request_timeout))
print("  share                         : " + str(affected_per_myriad) + " per ten thousand")
print("")
print("the timeout rule")
print("  unbounded waits in the service : " + str(call_sites_without_one))
print("  where the value came from : the dependency p99 plus")
print("    headroom, measured")
print("  set per call site or globally : per call site")
print("  enforced by : a lint rule that fails the build")
print("  call sites covered : " + str(call_sites_with_an_explicit_timeout) + " of " + str(call_sites))
print("  verdict : BOUNDED")
print("")
print("  a machine-enforced rule beats a convention, and choosing")
print("  per call site beats one global number")
print("")
print("the timer")
print("  starts when : the request is handed to the transport")
print("  what happens before that : the transport waits for a")
print("    free connection from the pool")
print("  who bounds that wait : the pool, from its own setting")
print("  what that setting is : " + str(pool_acquire_timeout_ms) + " ms, the library default")
print("  call sites that set it : " + str(call_sites_with_an_explicit_acquire_timeout))
print("  what the lint rule checks : the request timeout")
print("")
print("  the covered quantity is real and it is the second of the")
print("  two waits, and the multiple between them is below")
print("")
acquire_is_this_many_times_the_request_timeout = int(pool_acquire_timeout_ms / request_timeout_ms)
print("the two waits compared")
print("  request timeout, ms : " + str(request_timeout_ms) + ", chosen")
print("  acquire timeout, ms : " + str(pool_acquire_timeout_ms) + ", inherited")
print("  multiple            : " + str(acquire_is_this_many_times_the_request_timeout))
print("")
print("when the pool wait is nonzero")
print("  connections free : the wait is zero and the chosen")
print("    timeout is the whole bound")
print("  pool full        : the wait is the queue for a slot")
print("  when the pool fills : when calls stop returning quickly")
print("  which is           : the condition the timeout exists for")
print("  so the two are     : correlated, not independent")
print("")
print("what the timeout metric counts")
print("  requests cut at the chosen value : counted, and correct")
print("  requests waiting for a slot      : not yet issued, so")
print("    not in the metric")
print("  where they appear instead : the caller's own latency,")
print("    as " + str(observed_p99_ms_under_saturation) + " ms at p99 under saturation")
print("  calls a day in that state : " + str(calls_whose_pool_wait_exceeded_the_request_timeout))
print("")
nc_worst_case_wait_ms = request_timeout_ms
nc_calls_whose_wait_exceeded_the_deadline = 0
print("null control - one deadline covers acquire and request")
print("  call sites covered : " + str(call_sites_with_an_explicit_timeout) + ", unchanged")
print("  worst case wait, ms : " + str(nc_worst_case_wait_ms))
print("  calls exceeding the deadline : " + str(nc_calls_whose_wait_exceeded_the_deadline))
print("  the timeout did not get shorter; it started covering the")
print("  whole interval the caller is waiting through")
print("")
print("what an explicit timeout guarantees")
print("  this request will not run longer than the value : exactly,")
print("    at every one of " + str(call_sites) + " call sites")
print("  the caller will not wait longer than the value  : not")
print("    addressed; the value bounds an operation that has not")
print("    started, and getting to the start is also waiting")
print("")
print("a timeout is a bound on an interval, so it is only as good")
print("as the interval it is attached to; a lint rule that finds")
print("every missing timeout finds every missing one of the kind it")
print("knows to look for")
print("")
print("Every one of " + str(call_sites) + " call sites has an explicit timeout, chosen from a measured p99")
print("and enforced by a lint rule that fails the build - " + str(call_sites_without_one) + " unbounded waits. It starts")
print("when the request reaches the transport, after a pool wait bounded by an")
print("inherited " + str(pool_acquire_timeout_ms) + " ms that " + str(call_sites_with_an_explicit_acquire_timeout) + " call sites set, so the chosen value bounds")
print(str(bounded_by_the_chosen_value_per_myriad) + " per ten thousand of a " + str(worst_case_wait_ms) + " ms worst case, and " + str(calls_whose_pool_wait_exceeded_the_request_timeout) + " calls a day -")
print(str(affected_per_myriad) + " per ten thousand - wait longer to start than they were allowed to run.")
```

## stdout (executed)

```text
call sites                      : 214
  with an explicit timeout      : 214
  without one                   : 0
  with an explicit acquire timeout : 0

request timeout, ms             : 250
pool acquire timeout, ms        : 30000
worst case wait, ms             : 30250
  bounded by the chosen value   : 82 per ten thousand
observed p99 under saturation, ms : 8400

pool size                       : 20
calls per day                   : 6200000
  the timeout describes         : 6126000
  pool wait exceeded it         : 74000
  share                         : 119 per ten thousand

the timeout rule
  unbounded waits in the service : 0
  where the value came from : the dependency p99 plus
    headroom, measured
  set per call site or globally : per call site
  enforced by : a lint rule that fails the build
  call sites covered : 214 of 214
  verdict : BOUNDED

  a machine-enforced rule beats a convention, and choosing
  per call site beats one global number

the timer
  starts when : the request is handed to the transport
  what happens before that : the transport waits for a
    free connection from the pool
  who bounds that wait : the pool, from its own setting
  what that setting is : 30000 ms, the library default
  call sites that set it : 0
  what the lint rule checks : the request timeout

  the covered quantity is real and it is the second of the
  two waits, and the multiple between them is below

the two waits compared
  request timeout, ms : 250, chosen
  acquire timeout, ms : 30000, inherited
  multiple            : 120

when the pool wait is nonzero
  connections free : the wait is zero and the chosen
    timeout is the whole bound
  pool full        : the wait is the queue for a slot
  when the pool fills : when calls stop returning quickly
  which is           : the condition the timeout exists for
  so the two are     : correlated, not independent

what the timeout metric counts
  requests cut at the chosen value : counted, and correct
  requests waiting for a slot      : not yet issued, so
    not in the metric
  where they appear instead : the caller's own latency,
    as 8400 ms at p99 under saturation
  calls a day in that state : 74000

null control - one deadline covers acquire and request
  call sites covered : 214, unchanged
  worst case wait, ms : 250
  calls exceeding the deadline : 0
  the timeout did not get shorter; it started covering the
  whole interval the caller is waiting through

what an explicit timeout guarantees
  this request will not run longer than the value : exactly,
    at every one of 214 call sites
  the caller will not wait longer than the value  : not
    addressed; the value bounds an operation that has not
    started, and getting to the start is also waiting

a timeout is a bound on an interval, so it is only as good
as the interval it is attached to; a lint rule that finds
every missing timeout finds every missing one of the kind it
knows to look for

Every one of 214 call sites has an explicit timeout, chosen from a measured p99
and enforced by a lint rule that fails the build - 0 unbounded waits. It starts
when the request reaches the transport, after a pool wait bounded by an
inherited 30000 ms that 0 call sites set, so the chosen value bounds
82 per ten thousand of a 30250 ms worst case, and 74000 calls a day -
119 per ten thousand - wait longer to start than they were allowed to run.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
