<!-- canonical: efficientnewlanguage.org/ai/examples/579-the-timeout-was-longer-than-the-caller-patience | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 579 — The timeout was longer than the caller patience

`the_timeout_was_longer_than_the_caller_patience.eml` - The service times out a request after 30 seconds. The client library gives up after 5. What the server is doing between those two numbers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The service
# times out a request after 30 seconds. The client library gives up after 5.
# What the server is doing between those two numbers is computed below.
#
# 30 seconds was chosen carefully and for a reason that is still true. The
# report generator legitimately takes 20 to 25 seconds on a large account, and
# a shorter server timeout would kill those reports halfway through, leaving a
# partial file and a customer with nothing. The number came from measuring the
# slowest legitimate request and adding headroom, which is the correct method.
#
# The client timeout is 5 seconds. It is the library default, it was never
# changed, and there is nothing wrong with it either - 5 seconds is a
# reasonable thing to wait for an API call.
#
# Neither number is wrong on its own. What nobody owns is the relationship
# between them: for 25 seconds the server holds a connection, a worker and a
# database transaction for a request whose caller has already gone.

100 => requests_per_second
8 => slow_percent
30 => server_timeout_s
5 => client_timeout_s
256 => connection_pool

int(requests_per_second * slow_percent / 100) => slow_per_second
server_timeout_s - client_timeout_s => ownerless_seconds

"request rate       : " + str(requests_per_second) + " per second" ^0
"slow requests      : " + str(slow_percent) + " percent = " + str(slow_per_second) + " per second" ^0
"server timeout     : " + str(server_timeout_s) + " seconds" ^0
"client timeout     : " + str(client_timeout_s) + " seconds" ^0
"connection pool    : " + str(connection_pool) ^0
"" ^0

# ---- the window nobody owns ----

slow_per_second * ownerless_seconds => ownerless_in_flight

"each slow request keeps working for " + str(ownerless_seconds) + " seconds after its caller gave up" ^0
"" ^0
"  slow requests entering per second        : " + str(slow_per_second) ^0
"  seconds each spends unowned              : " + str(ownerless_seconds) ^0
"  unowned requests in flight at any moment : " + str(ownerless_in_flight) ^0
"" ^0

"  connections held by unowned work : " + str(ownerless_in_flight) + " of " + str(connection_pool) ^0
"  that is " + str(int(ownerless_in_flight * 100 / connection_pool)) + " percent of the pool" ^0
"" ^0

# ---- what the pool has left ----

connection_pool - ownerless_in_flight => pool_available

"  connections available to callers still waiting : " + str(pool_available) ^0
"  requests per second those can serve at " + str(client_timeout_s) + "s each : " + str(int(pool_available / client_timeout_s)) ^0
"  offered load                                   : " + str(requests_per_second) ^0
"" ^0

# ---- the loop this closes ----
#
# A caller that times out retries. The retry needs a connection. The pool is
# full of work for callers who already left. So the retry waits, times out,
# and retries again, and each attempt adds another 25 unowned seconds.

"what a client does at " + str(client_timeout_s) + " seconds" ^0
"  it gives up and retries" ^0
"  the original request keeps running for another " + str(ownerless_seconds) + " seconds" ^0
"  the retry is a NEW request that also needs a connection" ^0
"" ^0
"attempt   unowned seconds added   cumulative unowned per slow request" ^0
0 => cumulative
for a in [1:4]:
    cumulative + ownerless_seconds => cumulative
    "  " + str(a) + "         " + str(ownerless_seconds) + "                      " + str(cumulative) ^0
"" ^0
"  three attempts by one caller occupy " + str(cumulative) + " connection-seconds" ^0
"  and the caller has been gone for " + str(cumulative - ownerless_seconds) + " of them" ^0
"" ^0

# ---- which number to change ----
#
# Raising the client timeout to the server's would keep the caller present for
# the whole 30 seconds, which is what the 30 was designed for. Lowering the
# server timeout to the client's would kill the legitimate 25-second reports.
# The third option costs nothing on either axis.

"three options" ^0
"  raise the client timeout to " + str(server_timeout_s) + "s" ^0
"    unowned seconds per slow request : 0" ^0
"    cost : a caller may wait " + str(server_timeout_s) + "s, which the " + str(server_timeout_s) + "s was chosen for" ^0
"  lower the server timeout to " + str(client_timeout_s) + "s" ^0
"    unowned seconds per slow request : 0" ^0
"    cost : every legitimate 25-second report is killed" ^0
"  cancel server work when the connection closes" ^0
"    unowned seconds per slow request : 0" ^0
"    cost : none on either axis; the server stops when nobody is listening" ^0
"" ^0

# ---- the control ----
#
# Both timeouts are individually correct and both were chosen by measurement.
# Reviewing either one alone finds nothing, because neither one is wrong.

"control - is either number wrong on its own" ^0
"  slowest legitimate request     : 25 seconds" ^0
"  server timeout                 : " + str(server_timeout_s) + " seconds, which is above it" ^0
"  is the server timeout too long : no, it is measured plus headroom" ^0
"  is the client timeout too short: no, 5 seconds is a reasonable API wait" ^0
"  both reviews pass, and the defect is in neither number" ^0
"" ^0
"  it is in the difference, and a difference has no owner" ^0
"" ^0

# ---- the null control ----
#
# The same two numbers with no slow requests. Everything finishes inside the
# client timeout, the gap is never entered, and the configuration is exactly
# right. The pair only misbehaves on the requests that reach into the gap.

0 => nc_slow_per_second

"null control - the same timeouts when nothing is slow" ^0
"  slow requests per second      : " + str(nc_slow_per_second) ^0
"  unowned requests in flight    : " + str(nc_slow_per_second * ownerless_seconds) ^0
"  pool used by unowned work     : 0 of " + str(connection_pool) ^0
"  same 30 and same 5, and the gap costs nothing" ^0
"  the gap is only entered by requests that outlive the client timeout," ^0
"  which is " + str(slow_percent) + " percent of them here and 0 percent in a healthy hour" ^0
"" ^0

# ---- the rule ----

"a timeout pair, read as a pair" ^0
"  client shorter than server   the server works for nobody in the gap" ^0
"  client longer than server    the caller waits for an answer already killed" ^0
"  equal                        neither, and no headroom for the network" ^0
"  the only stable arrangement is one where the server notices the caller left" ^0
"  every review that reads one number at a time approves all three" ^0
"" ^0

"The " + str(server_timeout_s) + " seconds came from measuring the slowest legitimate request and adding" ^0
"headroom, and the " + str(client_timeout_s) + " is a sensible default nobody should have to justify. Between" ^0
"them sits a " + str(ownerless_seconds) + "-second window in which the server holds a connection, a worker" ^0
"and a transaction for a caller who has gone: " + str(ownerless_in_flight) + " of the " + str(connection_pool) + " pool, " + str(int(ownerless_in_flight * 100 / connection_pool)) + " percent," ^0
"spent on work whose result nobody will read." ^0
```

## Python (deterministic transpilation)

```python
requests_per_second = 100
slow_percent = 8
server_timeout_s = 30
client_timeout_s = 5
connection_pool = 256
slow_per_second = int(requests_per_second * slow_percent / 100)
ownerless_seconds = server_timeout_s - client_timeout_s
print("request rate       : " + str(requests_per_second) + " per second")
print("slow requests      : " + str(slow_percent) + " percent = " + str(slow_per_second) + " per second")
print("server timeout     : " + str(server_timeout_s) + " seconds")
print("client timeout     : " + str(client_timeout_s) + " seconds")
print("connection pool    : " + str(connection_pool))
print("")
ownerless_in_flight = slow_per_second * ownerless_seconds
print("each slow request keeps working for " + str(ownerless_seconds) + " seconds after its caller gave up")
print("")
print("  slow requests entering per second        : " + str(slow_per_second))
print("  seconds each spends unowned              : " + str(ownerless_seconds))
print("  unowned requests in flight at any moment : " + str(ownerless_in_flight))
print("")
print("  connections held by unowned work : " + str(ownerless_in_flight) + " of " + str(connection_pool))
print("  that is " + str(int(ownerless_in_flight * 100 / connection_pool)) + " percent of the pool")
print("")
pool_available = connection_pool - ownerless_in_flight
print("  connections available to callers still waiting : " + str(pool_available))
print("  requests per second those can serve at " + str(client_timeout_s) + "s each : " + str(int(pool_available / client_timeout_s)))
print("  offered load                                   : " + str(requests_per_second))
print("")
print("what a client does at " + str(client_timeout_s) + " seconds")
print("  it gives up and retries")
print("  the original request keeps running for another " + str(ownerless_seconds) + " seconds")
print("  the retry is a NEW request that also needs a connection")
print("")
print("attempt   unowned seconds added   cumulative unowned per slow request")
cumulative = 0
for a in range(1, 5):
    cumulative = cumulative + ownerless_seconds
    print("  " + str(a) + "         " + str(ownerless_seconds) + "                      " + str(cumulative))
print("")
print("  three attempts by one caller occupy " + str(cumulative) + " connection-seconds")
print("  and the caller has been gone for " + str(cumulative - ownerless_seconds) + " of them")
print("")
print("three options")
print("  raise the client timeout to " + str(server_timeout_s) + "s")
print("    unowned seconds per slow request : 0")
print("    cost : a caller may wait " + str(server_timeout_s) + "s, which the " + str(server_timeout_s) + "s was chosen for")
print("  lower the server timeout to " + str(client_timeout_s) + "s")
print("    unowned seconds per slow request : 0")
print("    cost : every legitimate 25-second report is killed")
print("  cancel server work when the connection closes")
print("    unowned seconds per slow request : 0")
print("    cost : none on either axis; the server stops when nobody is listening")
print("")
print("control - is either number wrong on its own")
print("  slowest legitimate request     : 25 seconds")
print("  server timeout                 : " + str(server_timeout_s) + " seconds, which is above it")
print("  is the server timeout too long : no, it is measured plus headroom")
print("  is the client timeout too short: no, 5 seconds is a reasonable API wait")
print("  both reviews pass, and the defect is in neither number")
print("")
print("  it is in the difference, and a difference has no owner")
print("")
nc_slow_per_second = 0
print("null control - the same timeouts when nothing is slow")
print("  slow requests per second      : " + str(nc_slow_per_second))
print("  unowned requests in flight    : " + str(nc_slow_per_second * ownerless_seconds))
print("  pool used by unowned work     : 0 of " + str(connection_pool))
print("  same 30 and same 5, and the gap costs nothing")
print("  the gap is only entered by requests that outlive the client timeout,")
print("  which is " + str(slow_percent) + " percent of them here and 0 percent in a healthy hour")
print("")
print("a timeout pair, read as a pair")
print("  client shorter than server   the server works for nobody in the gap")
print("  client longer than server    the caller waits for an answer already killed")
print("  equal                        neither, and no headroom for the network")
print("  the only stable arrangement is one where the server notices the caller left")
print("  every review that reads one number at a time approves all three")
print("")
print("The " + str(server_timeout_s) + " seconds came from measuring the slowest legitimate request and adding")
print("headroom, and the " + str(client_timeout_s) + " is a sensible default nobody should have to justify. Between")
print("them sits a " + str(ownerless_seconds) + "-second window in which the server holds a connection, a worker")
print("and a transaction for a caller who has gone: " + str(ownerless_in_flight) + " of the " + str(connection_pool) + " pool, " + str(int(ownerless_in_flight * 100 / connection_pool)) + " percent,")
print("spent on work whose result nobody will read.")
```

## stdout (executed)

```text
request rate       : 100 per second
slow requests      : 8 percent = 8 per second
server timeout     : 30 seconds
client timeout     : 5 seconds
connection pool    : 256

each slow request keeps working for 25 seconds after its caller gave up

  slow requests entering per second        : 8
  seconds each spends unowned              : 25
  unowned requests in flight at any moment : 200

  connections held by unowned work : 200 of 256
  that is 78 percent of the pool

  connections available to callers still waiting : 56
  requests per second those can serve at 5s each : 11
  offered load                                   : 100

what a client does at 5 seconds
  it gives up and retries
  the original request keeps running for another 25 seconds
  the retry is a NEW request that also needs a connection

attempt   unowned seconds added   cumulative unowned per slow request
  1         25                      25
  2         25                      50
  3         25                      75
  4         25                      100

  three attempts by one caller occupy 100 connection-seconds
  and the caller has been gone for 75 of them

three options
  raise the client timeout to 30s
    unowned seconds per slow request : 0
    cost : a caller may wait 30s, which the 30s was chosen for
  lower the server timeout to 5s
    unowned seconds per slow request : 0
    cost : every legitimate 25-second report is killed
  cancel server work when the connection closes
    unowned seconds per slow request : 0
    cost : none on either axis; the server stops when nobody is listening

control - is either number wrong on its own
  slowest legitimate request     : 25 seconds
  server timeout                 : 30 seconds, which is above it
  is the server timeout too long : no, it is measured plus headroom
  is the client timeout too short: no, 5 seconds is a reasonable API wait
  both reviews pass, and the defect is in neither number

  it is in the difference, and a difference has no owner

null control - the same timeouts when nothing is slow
  slow requests per second      : 0
  unowned requests in flight    : 0
  pool used by unowned work     : 0 of 256
  same 30 and same 5, and the gap costs nothing
  the gap is only entered by requests that outlive the client timeout,
  which is 8 percent of them here and 0 percent in a healthy hour

a timeout pair, read as a pair
  client shorter than server   the server works for nobody in the gap
  client longer than server    the caller waits for an answer already killed
  equal                        neither, and no headroom for the network
  the only stable arrangement is one where the server notices the caller left
  every review that reads one number at a time approves all three

The 30 seconds came from measuring the slowest legitimate request and adding
headroom, and the 5 is a sensible default nobody should have to justify. Between
them sits a 25-second window in which the server holds a connection, a worker
and a transaction for a caller who has gone: 200 of the 256 pool, 78 percent,
spent on work whose result nobody will read.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
