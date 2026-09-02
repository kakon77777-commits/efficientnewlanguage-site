<!-- canonical: efficientnewlanguage.org/ai/examples/671-the-worker-scaled-with-the-queue-and-the-database-did-not | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 671 — The worker scaled with the queue and the database did not

`the_worker_scaled_with_the_queue_and_the_database_did_not.eml` - The autoscaler scales workers on queue depth, which is the right signal, and it responded within a minute. How many of them can work is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The autoscaler
# scales workers on queue depth, which is the right signal, and it responded
# within a minute. How many of them can work is computed below.
#
# The scaling policy is well chosen. Queue depth is the quantity that actually
# expresses unserved demand, it leads latency rather than lagging it, the
# cooldown is tuned so the fleet does not oscillate, and this policy has
# absorbed three genuine traffic spikes without anyone being paged.
#
# A worker is not a self-contained unit of capacity. Each one opens ten
# connections to a shared database, and that database has a connection limit
# which is not an input to the scaling policy and not an output of it.
#
# At two hundred and forty workers the fleet wants two thousand four hundred
# connections against a limit of five hundred.

10 => connections_per_worker
500 => database_connection_limit
20 => workers_at_rest
240 => workers_at_peak
0 => autoscaler_faults

workers_at_peak * connections_per_worker => connections_wanted
int(database_connection_limit / connections_per_worker) => workers_that_can_connect
workers_at_peak - workers_that_can_connect => workers_that_cannot

"connections per worker      : " + str(connections_per_worker) ^0
"database connection limit   : " + str(database_connection_limit) ^0
"workers at rest             : " + str(workers_at_rest) ^0
"workers at peak             : " + str(workers_at_peak) ^0
"" ^0
"connections wanted at peak  : " + str(connections_wanted) ^0
"workers that can connect    : " + str(workers_that_can_connect) ^0
"workers that cannot         : " + str(workers_that_cannot) ^0
"" ^0

# ---- what the policy verified ----

"the scaling policy" ^0
"  signal          : queue depth" ^0
"  leads latency rather than lagging it : yes" ^0
"  cooldown tuned so the fleet does not oscillate : yes" ^0
"  spikes absorbed without a page : 3" ^0
"  autoscaler faults : " + str(autoscaler_faults) ^0
"  response time     : under a minute" ^0
"  verdict           : SCALED" ^0
"" ^0
"  queue depth is the correct signal and choosing it over" ^0
"  cpu was the right call" ^0
"" ^0

# ---- what a worker costs ----

"one worker, in resources" ^0
"  compute       : provisioned by the autoscaler" ^0
"  memory        : provisioned by the autoscaler" ^0
"  database connections : " + str(connections_per_worker) + ", from a fixed pool the" ^0
"    autoscaler neither reads nor allocates" ^0
"" ^0
"  scaling a fleet multiplies every per-worker cost, and" ^0
"  one of them is drawn on a resource with a ceiling" ^0
"" ^0

int(workers_that_cannot * 10000 / workers_at_peak) => starved_per_myriad
"share of the peak fleet unable to connect : " + str(starved_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- the loop ----

# A worker that cannot connect fails its health check, is replaced, and the
# replacement cannot connect either. The queue does not drain, so the depth
# signal stays high, so the policy scales up further.
"what happens next" ^0
"  a worker that cannot connect : fails health, is replaced" ^0
"  the replacement              : also cannot connect" ^0
"  queue depth                  : does not fall" ^0
"  the policy reads that as     : still not enough workers" ^0
"  the policy's response        : more workers" ^0
"" ^0
"  every step is the designed behaviour of a component that" ^0
"  is working" ^0
"" ^0

# ---- null control ----

# The same policy, with the fleet size capped at what the connection pool
# supports and the queue depth alarm routed to a human above it.
workers_that_can_connect => nc_workers_at_peak
0 => nc_workers_that_cannot
nc_workers_at_peak * connections_per_worker => nc_connections_wanted

"null control - the fleet capped at the pool's capacity" ^0
"  autoscaler faults    : " + str(autoscaler_faults) + ", unchanged" ^0
"  workers at peak      : " + str(nc_workers_at_peak) ^0
"  connections wanted   : " + str(nc_connections_wanted) ^0
"  workers that cannot connect : " + str(nc_workers_that_cannot) ^0
"  the policy did not get smarter; its output range" ^0
"  stopped exceeding a resource it cannot see" ^0
"" ^0

# ---- the rule ----

"what a correct scaling signal guarantees" ^0
"  the fleet grows when demand is unserved : exactly" ^0
"  the work gets done                       : not addressed;" ^0
"    a worker is capacity only if every resource it needs" ^0
"    scales with it, and the shared ones do not" ^0
"" ^0
"an autoscaler multiplies a unit; the question is never" ^0
"whether the signal is right but whether the unit is" ^0
"self-contained, and a fixed pool makes it not" ^0
"" ^0

"The policy is right and the autoscaler is faultless: queue depth leads latency," ^0
"the cooldown is tuned, three real spikes absorbed, " + str(autoscaler_faults) + " faults. At " + str(workers_at_peak) + " workers" ^0
"the fleet wants " + str(connections_wanted) + " connections against a limit of " + str(database_connection_limit) + ", so " + str(workers_that_can_connect) + " can work" ^0
"and " + str(workers_that_cannot) + " cannot - " + str(starved_per_myriad) + " per ten thousand of the peak fleet - and the queue" ^0
"they were scaled to drain stays deep, which the policy reads as needing more." ^0
```

## Python (deterministic transpilation)

```python
connections_per_worker = 10
database_connection_limit = 500
workers_at_rest = 20
workers_at_peak = 240
autoscaler_faults = 0
connections_wanted = workers_at_peak * connections_per_worker
workers_that_can_connect = int(database_connection_limit / connections_per_worker)
workers_that_cannot = workers_at_peak - workers_that_can_connect
print("connections per worker      : " + str(connections_per_worker))
print("database connection limit   : " + str(database_connection_limit))
print("workers at rest             : " + str(workers_at_rest))
print("workers at peak             : " + str(workers_at_peak))
print("")
print("connections wanted at peak  : " + str(connections_wanted))
print("workers that can connect    : " + str(workers_that_can_connect))
print("workers that cannot         : " + str(workers_that_cannot))
print("")
print("the scaling policy")
print("  signal          : queue depth")
print("  leads latency rather than lagging it : yes")
print("  cooldown tuned so the fleet does not oscillate : yes")
print("  spikes absorbed without a page : 3")
print("  autoscaler faults : " + str(autoscaler_faults))
print("  response time     : under a minute")
print("  verdict           : SCALED")
print("")
print("  queue depth is the correct signal and choosing it over")
print("  cpu was the right call")
print("")
print("one worker, in resources")
print("  compute       : provisioned by the autoscaler")
print("  memory        : provisioned by the autoscaler")
print("  database connections : " + str(connections_per_worker) + ", from a fixed pool the")
print("    autoscaler neither reads nor allocates")
print("")
print("  scaling a fleet multiplies every per-worker cost, and")
print("  one of them is drawn on a resource with a ceiling")
print("")
starved_per_myriad = int(workers_that_cannot * 10000 / workers_at_peak)
print("share of the peak fleet unable to connect : " + str(starved_per_myriad) + " per ten thousand")
print("")
print("what happens next")
print("  a worker that cannot connect : fails health, is replaced")
print("  the replacement              : also cannot connect")
print("  queue depth                  : does not fall")
print("  the policy reads that as     : still not enough workers")
print("  the policy's response        : more workers")
print("")
print("  every step is the designed behaviour of a component that")
print("  is working")
print("")
nc_workers_at_peak = workers_that_can_connect
nc_workers_that_cannot = 0
nc_connections_wanted = nc_workers_at_peak * connections_per_worker
print("null control - the fleet capped at the pool's capacity")
print("  autoscaler faults    : " + str(autoscaler_faults) + ", unchanged")
print("  workers at peak      : " + str(nc_workers_at_peak))
print("  connections wanted   : " + str(nc_connections_wanted))
print("  workers that cannot connect : " + str(nc_workers_that_cannot))
print("  the policy did not get smarter; its output range")
print("  stopped exceeding a resource it cannot see")
print("")
print("what a correct scaling signal guarantees")
print("  the fleet grows when demand is unserved : exactly")
print("  the work gets done                       : not addressed;")
print("    a worker is capacity only if every resource it needs")
print("    scales with it, and the shared ones do not")
print("")
print("an autoscaler multiplies a unit; the question is never")
print("whether the signal is right but whether the unit is")
print("self-contained, and a fixed pool makes it not")
print("")
print("The policy is right and the autoscaler is faultless: queue depth leads latency,")
print("the cooldown is tuned, three real spikes absorbed, " + str(autoscaler_faults) + " faults. At " + str(workers_at_peak) + " workers")
print("the fleet wants " + str(connections_wanted) + " connections against a limit of " + str(database_connection_limit) + ", so " + str(workers_that_can_connect) + " can work")
print("and " + str(workers_that_cannot) + " cannot - " + str(starved_per_myriad) + " per ten thousand of the peak fleet - and the queue")
print("they were scaled to drain stays deep, which the policy reads as needing more.")
```

## stdout (executed)

```text
connections per worker      : 10
database connection limit   : 500
workers at rest             : 20
workers at peak             : 240

connections wanted at peak  : 2400
workers that can connect    : 50
workers that cannot         : 190

the scaling policy
  signal          : queue depth
  leads latency rather than lagging it : yes
  cooldown tuned so the fleet does not oscillate : yes
  spikes absorbed without a page : 3
  autoscaler faults : 0
  response time     : under a minute
  verdict           : SCALED

  queue depth is the correct signal and choosing it over
  cpu was the right call

one worker, in resources
  compute       : provisioned by the autoscaler
  memory        : provisioned by the autoscaler
  database connections : 10, from a fixed pool the
    autoscaler neither reads nor allocates

  scaling a fleet multiplies every per-worker cost, and
  one of them is drawn on a resource with a ceiling

share of the peak fleet unable to connect : 7916 per ten thousand

what happens next
  a worker that cannot connect : fails health, is replaced
  the replacement              : also cannot connect
  queue depth                  : does not fall
  the policy reads that as     : still not enough workers
  the policy's response        : more workers

  every step is the designed behaviour of a component that
  is working

null control - the fleet capped at the pool's capacity
  autoscaler faults    : 0, unchanged
  workers at peak      : 50
  connections wanted   : 500
  workers that cannot connect : 0
  the policy did not get smarter; its output range
  stopped exceeding a resource it cannot see

what a correct scaling signal guarantees
  the fleet grows when demand is unserved : exactly
  the work gets done                       : not addressed;
    a worker is capacity only if every resource it needs
    scales with it, and the shared ones do not

an autoscaler multiplies a unit; the question is never
whether the signal is right but whether the unit is
self-contained, and a fixed pool makes it not

The policy is right and the autoscaler is faultless: queue depth leads latency,
the cooldown is tuned, three real spikes absorbed, 0 faults. At 240 workers
the fleet wants 2400 connections against a limit of 500, so 50 can work
and 190 cannot - 7916 per ten thousand of the peak fleet - and the queue
they were scaled to drain stays deep, which the policy reads as needing more.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
