<!-- canonical: efficientnewlanguage.org/ai/examples/685-the-shutdown-was-graceful-and-the-signal-went-to-the-wrapper | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 685 — The shutdown was graceful and the signal went to the wrapper

`the_shutdown_was_graceful_and_the_signal_went_to_the_wrapper.eml` - The process handles the termination signal, drains in six seconds, and fourteen tests cover it. How many requests are killed per deploy is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The process
# handles the termination signal, drains in six seconds, and fourteen tests
# cover it. How many requests are killed per deploy is computed below.
#
# The shutdown handler is well built and well tested. It stops accepting new
# connections, lets in-flight requests finish, closes the pool, flushes the
# metrics buffer and exits zero — in six seconds against a grace period of
# thirty. Fourteen tests send the signal and assert each step, and they pass.
#
# The signal is sent to process one in the container. The image's entry point is
# a shell script that sets two variables and runs the application, so process
# one is the shell, and a shell waiting on a child does not pass the signal to
# it unless it was written to.
#
# The application never receives the signal it handles correctly.

30 => grace_period_seconds
6 => drain_seconds_when_it_arrives
14 => shutdown_tests
41 => deploys_per_week
24 => pods_per_deploy
118 => in_flight_requests_per_pod
0 => shutdown_test_failures

deploys_per_week * pods_per_deploy => pods_replaced_per_week
pods_replaced_per_week * in_flight_requests_per_pod => requests_killed_per_week
grace_period_seconds - drain_seconds_when_it_arrives => seconds_spent_waiting_for_nothing
pods_replaced_per_week * seconds_spent_waiting_for_nothing => pod_seconds_waiting_per_week

"grace period, seconds        : " + str(grace_period_seconds) ^0
"drain when the signal arrives: " + str(drain_seconds_when_it_arrives) + " seconds" ^0
"shutdown tests               : " + str(shutdown_tests) ^0
"shutdown test failures       : " + str(shutdown_test_failures) ^0
"" ^0
"deploys per week             : " + str(deploys_per_week) ^0
"pods replaced per week       : " + str(pods_replaced_per_week) ^0
"in-flight requests per pod   : " + str(in_flight_requests_per_pod) ^0
"requests killed per week     : " + str(requests_killed_per_week) ^0
"pod-seconds spent waiting for nothing : " + str(pod_seconds_waiting_per_week) ^0
"" ^0

# ---- what the tests verified ----

"the shutdown handler" ^0
"  stops accepting new connections : yes" ^0
"  lets in-flight requests finish  : yes" ^0
"  closes the pool                 : yes" ^0
"  flushes the metrics buffer      : yes" ^0
"  exits zero in                   : " + str(drain_seconds_when_it_arrives) + " seconds" ^0
"  tests asserting each step       : " + str(shutdown_tests) ^0
"  failures                        : " + str(shutdown_test_failures) ^0
"  verdict                         : GRACEFUL" ^0
"" ^0
"  the handler is correct and the tests are not decorative;" ^0
"  they send the real signal and assert the real steps" ^0
"" ^0

# ---- how the tests deliver it ----

"where the signal is sent, in each context" ^0
"  in the tests    : to the application process, directly" ^0
"  in production   : to process one in the container" ^0
"  process one is  : the entry-point shell script" ^0
"  what a waiting shell does with it : nothing, unless it" ^0
"    was written to forward" ^0
"  was it          : no" ^0
"" ^0
"  the test and production differ in one thing, and it is" ^0
"  the delivery rather than the handling" ^0
"" ^0

# ---- what the orchestrator sees ----

# It sends the signal, waits the grace period, sees a process that has not
# exited, and sends the one that cannot be handled. From its side this is a
# well-behaved sequence with a slow application at the end of it.
"the termination sequence" ^0
"  signal sent          : yes" ^0
"  grace period         : " + str(grace_period_seconds) + " seconds" ^0
"  process exits within it : no" ^0
"  what follows         : the signal that cannot be caught" ^0
"  what the event log says : terminated after the grace" ^0
"    period, which reads as a slow application" ^0
"" ^0

int(seconds_spent_waiting_for_nothing * 10000 / grace_period_seconds) => wasted_grace_per_myriad
"share of the grace period spent waiting for nothing : " + str(wasted_grace_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same handler, with the entry point replaced by the binary directly, or
# the script ending in exec so the application becomes process one.
0 => nc_requests_killed_per_week
drain_seconds_when_it_arrives => nc_drain_seconds

"null control - the script ends in exec, so the app is process one" ^0
"  shutdown tests       : " + str(shutdown_tests) + ", unchanged, still passing" ^0
"  drain, seconds       : " + str(nc_drain_seconds) ^0
"  requests killed per week : " + str(nc_requests_killed_per_week) ^0
"  the handler did not change; the signal started arriving" ^0
"  at the process that handles it" ^0
"" ^0

# ---- the rule ----

"what a tested shutdown handler guarantees" ^0
"  the process shuts down gracefully when signalled : exactly" ^0
"  the process is signalled                          : not" ^0
"    addressed, and it is the half the tests cannot cover," ^0
"    because a test delivers the signal itself" ^0
"" ^0
"a handler test supplies its own trigger; the delivery path is" ^0
"the part of the mechanism that only exists in production, and" ^0
"the failure it produces is indistinguishable from slowness" ^0
"" ^0

"The handler drains in " + str(drain_seconds_when_it_arrives) + " seconds against a " + str(grace_period_seconds) + " second grace period, and " + str(shutdown_tests) ^0
"tests send the real signal and assert every step with " + str(shutdown_test_failures) + " failures. In production" ^0
"the signal goes to an entry-point shell that does not forward it, so " + str(pods_replaced_per_week) ^0
"pods a week are killed after waiting " + str(seconds_spent_waiting_for_nothing) + " seconds for nothing, taking" ^0
str(requests_killed_per_week) + " in-flight requests with them, logged as an application that shuts down slowly." ^0
```

## Python (deterministic transpilation)

```python
grace_period_seconds = 30
drain_seconds_when_it_arrives = 6
shutdown_tests = 14
deploys_per_week = 41
pods_per_deploy = 24
in_flight_requests_per_pod = 118
shutdown_test_failures = 0
pods_replaced_per_week = deploys_per_week * pods_per_deploy
requests_killed_per_week = pods_replaced_per_week * in_flight_requests_per_pod
seconds_spent_waiting_for_nothing = grace_period_seconds - drain_seconds_when_it_arrives
pod_seconds_waiting_per_week = pods_replaced_per_week * seconds_spent_waiting_for_nothing
print("grace period, seconds        : " + str(grace_period_seconds))
print("drain when the signal arrives: " + str(drain_seconds_when_it_arrives) + " seconds")
print("shutdown tests               : " + str(shutdown_tests))
print("shutdown test failures       : " + str(shutdown_test_failures))
print("")
print("deploys per week             : " + str(deploys_per_week))
print("pods replaced per week       : " + str(pods_replaced_per_week))
print("in-flight requests per pod   : " + str(in_flight_requests_per_pod))
print("requests killed per week     : " + str(requests_killed_per_week))
print("pod-seconds spent waiting for nothing : " + str(pod_seconds_waiting_per_week))
print("")
print("the shutdown handler")
print("  stops accepting new connections : yes")
print("  lets in-flight requests finish  : yes")
print("  closes the pool                 : yes")
print("  flushes the metrics buffer      : yes")
print("  exits zero in                   : " + str(drain_seconds_when_it_arrives) + " seconds")
print("  tests asserting each step       : " + str(shutdown_tests))
print("  failures                        : " + str(shutdown_test_failures))
print("  verdict                         : GRACEFUL")
print("")
print("  the handler is correct and the tests are not decorative;")
print("  they send the real signal and assert the real steps")
print("")
print("where the signal is sent, in each context")
print("  in the tests    : to the application process, directly")
print("  in production   : to process one in the container")
print("  process one is  : the entry-point shell script")
print("  what a waiting shell does with it : nothing, unless it")
print("    was written to forward")
print("  was it          : no")
print("")
print("  the test and production differ in one thing, and it is")
print("  the delivery rather than the handling")
print("")
print("the termination sequence")
print("  signal sent          : yes")
print("  grace period         : " + str(grace_period_seconds) + " seconds")
print("  process exits within it : no")
print("  what follows         : the signal that cannot be caught")
print("  what the event log says : terminated after the grace")
print("    period, which reads as a slow application")
print("")
wasted_grace_per_myriad = int(seconds_spent_waiting_for_nothing * 10000 / grace_period_seconds)
print("share of the grace period spent waiting for nothing : " + str(wasted_grace_per_myriad) + " per ten thousand")
print("")
nc_requests_killed_per_week = 0
nc_drain_seconds = drain_seconds_when_it_arrives
print("null control - the script ends in exec, so the app is process one")
print("  shutdown tests       : " + str(shutdown_tests) + ", unchanged, still passing")
print("  drain, seconds       : " + str(nc_drain_seconds))
print("  requests killed per week : " + str(nc_requests_killed_per_week))
print("  the handler did not change; the signal started arriving")
print("  at the process that handles it")
print("")
print("what a tested shutdown handler guarantees")
print("  the process shuts down gracefully when signalled : exactly")
print("  the process is signalled                          : not")
print("    addressed, and it is the half the tests cannot cover,")
print("    because a test delivers the signal itself")
print("")
print("a handler test supplies its own trigger; the delivery path is")
print("the part of the mechanism that only exists in production, and")
print("the failure it produces is indistinguishable from slowness")
print("")
print("The handler drains in " + str(drain_seconds_when_it_arrives) + " seconds against a " + str(grace_period_seconds) + " second grace period, and " + str(shutdown_tests))
print("tests send the real signal and assert every step with " + str(shutdown_test_failures) + " failures. In production")
print("the signal goes to an entry-point shell that does not forward it, so " + str(pods_replaced_per_week))
print("pods a week are killed after waiting " + str(seconds_spent_waiting_for_nothing) + " seconds for nothing, taking")
print(str(requests_killed_per_week) + " in-flight requests with them, logged as an application that shuts down slowly.")
```

## stdout (executed)

```text
grace period, seconds        : 30
drain when the signal arrives: 6 seconds
shutdown tests               : 14
shutdown test failures       : 0

deploys per week             : 41
pods replaced per week       : 984
in-flight requests per pod   : 118
requests killed per week     : 116112
pod-seconds spent waiting for nothing : 23616

the shutdown handler
  stops accepting new connections : yes
  lets in-flight requests finish  : yes
  closes the pool                 : yes
  flushes the metrics buffer      : yes
  exits zero in                   : 6 seconds
  tests asserting each step       : 14
  failures                        : 0
  verdict                         : GRACEFUL

  the handler is correct and the tests are not decorative;
  they send the real signal and assert the real steps

where the signal is sent, in each context
  in the tests    : to the application process, directly
  in production   : to process one in the container
  process one is  : the entry-point shell script
  what a waiting shell does with it : nothing, unless it
    was written to forward
  was it          : no

  the test and production differ in one thing, and it is
  the delivery rather than the handling

the termination sequence
  signal sent          : yes
  grace period         : 30 seconds
  process exits within it : no
  what follows         : the signal that cannot be caught
  what the event log says : terminated after the grace
    period, which reads as a slow application

share of the grace period spent waiting for nothing : 8000 per ten thousand

null control - the script ends in exec, so the app is process one
  shutdown tests       : 14, unchanged, still passing
  drain, seconds       : 6
  requests killed per week : 0
  the handler did not change; the signal started arriving
  at the process that handles it

what a tested shutdown handler guarantees
  the process shuts down gracefully when signalled : exactly
  the process is signalled                          : not
    addressed, and it is the half the tests cannot cover,
    because a test delivers the signal itself

a handler test supplies its own trigger; the delivery path is
the part of the mechanism that only exists in production, and
the failure it produces is indistinguishable from slowness

The handler drains in 6 seconds against a 30 second grace period, and 14
tests send the real signal and assert every step with 0 failures. In production
the signal goes to an entry-point shell that does not forward it, so 984
pods a week are killed after waiting 24 seconds for nothing, taking
116112 in-flight requests with them, logged as an application that shuts down slowly.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
