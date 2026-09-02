<!-- canonical: efficientnewlanguage.org/ai/examples/658-the-canary-was-healthy-and-it-served-the-easy-requests | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 658 — The canary was healthy and it served the easy requests

`the_canary_was_healthy_and_it_served_the_easy_requests.eml` - The canary took one percent of traffic for an hour and beat the baseline on every metric. What it was asked to do is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The canary took
# one percent of traffic for an hour and beat the baseline on every metric. What
# it was asked to do is computed below.
#
# The canary process is well built. One percent of traffic, an hour of soak,
# error rate and latency compared against the same window on the baseline pool,
# an automatic rollback if either regresses, and it has stopped two bad releases
# this quarter. The comparison is like-for-like on time, version and hardware.
#
# Which requests reach it is decided by routing. Sessions are sticky, so an
# established session keeps the pool it was assigned; only NEW sessions can land
# on the canary, and a new session is a person who has just arrived.
#
# An established session carries sixty-one items. A new one carries three.

100 => canary_share_per_myriad
60 => soak_minutes
240 => baseline_mean_ms
96 => canary_mean_ms
3 => items_in_a_new_session
61 => items_in_an_established_session
2 => bad_releases_stopped_this_quarter

int(items_in_an_established_session / items_in_a_new_session) => work_ratio
baseline_mean_ms - canary_mean_ms => apparent_improvement_ms

"canary share                  : " + str(canary_share_per_myriad) + " per ten thousand" ^0
"soak, minutes                 : " + str(soak_minutes) ^0
"baseline mean, ms             : " + str(baseline_mean_ms) ^0
"canary mean, ms               : " + str(canary_mean_ms) ^0
"apparent improvement, ms      : " + str(apparent_improvement_ms) ^0
"" ^0
"items in a new session        : " + str(items_in_a_new_session) ^0
"items in an established session : " + str(items_in_an_established_session) ^0
"work ratio                    : " + str(work_ratio) + " times" ^0
"" ^0

# ---- what the canary process verified ----

"the canary comparison" ^0
"  traffic share       : " + str(canary_share_per_myriad) + " per ten thousand" ^0
"  soak                : " + str(soak_minutes) + " minutes" ^0
"  compared against    : the same window, same hardware" ^0
"  automatic rollback on regression : yes" ^0
"  bad releases stopped this quarter : " + str(bad_releases_stopped_this_quarter) ^0
"  verdict             : HEALTHY, BETTER THAN BASELINE" ^0
"" ^0
"  it is a real gate and it has caught real regressions" ^0
"" ^0

# ---- what routing decided ----

"which requests can reach it" ^0
"  routing            : sticky by session" ^0
"  established sessions : stay on their existing pool" ^0
"  new sessions       : may land on the canary" ^0
"  so the canary's population is : arrivals" ^0
"" ^0
"  stickiness is there for a good reason and it is also" ^0
"  the sampling rule" ^0
"" ^0

int(items_in_a_new_session * 10000 / items_in_an_established_session) => canary_work_per_myriad
"work per request on the canary, against production : " + str(canary_work_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the improvement was ----

# The canary is not faster. It is doing a twentieth of the work per request,
# and the metric is per request.
int(canary_mean_ms * items_in_an_established_session / items_in_a_new_session) => canary_ms_at_production_mix

"the same canary, on the production mix" ^0
"  measured mean, ms          : " + str(canary_mean_ms) ^0
"  work ratio                 : " + str(work_ratio) ^0
"  implied mean at that mix, ms : " + str(canary_ms_at_production_mix) ^0
"  baseline mean, ms          : " + str(baseline_mean_ms) ^0
"" ^0
canary_ms_at_production_mix - baseline_mean_ms => implied_regression_ms
"  implied change, ms         : " + str(implied_regression_ms) ^0
"  which direction the gate reported : better" ^0
"" ^0

# ---- null control ----

# The same canary, with routing that assigns a percentage of ESTABLISHED
# sessions as well, accepting the reassignment cost.
items_in_an_established_session => nc_items_per_canary_request
canary_ms_at_production_mix => nc_canary_mean_ms

"null control - established sessions also sampled" ^0
"  soak, minutes         : " + str(soak_minutes) + ", unchanged" ^0
"  items per canary request : " + str(nc_items_per_canary_request) ^0
"  canary mean, ms       : " + str(nc_canary_mean_ms) ^0
"  the canary did not get slower; it was asked the" ^0
"  question the baseline is being asked" ^0
"" ^0

# ---- the rule ----

"what a healthy canary guarantees" ^0
"  this version is healthy on the traffic it received : exactly" ^0
"  this version is healthy in production               : not" ^0
"    addressed; the routing that selects the sample is" ^0
"    chosen for other reasons and is not a sampling design" ^0
"" ^0
"a canary is an experiment and its assignment rule is its" ^0
"randomisation; when the rule correlates with the workload," ^0
"the result is about the sample and reads as being about the" ^0
"population" ^0
"" ^0

"The canary is healthy and the gate is real: " + str(canary_share_per_myriad) + " per ten thousand of traffic," ^0
"a " + str(soak_minutes) + " minute soak, like-for-like comparison, automatic rollback, and " + str(bad_releases_stopped_this_quarter) ^0
"bad releases stopped this quarter. Sticky routing sends it only new sessions," ^0
"which carry " + str(items_in_a_new_session) + " items against " + str(items_in_an_established_session) + " - " + str(canary_work_per_myriad) + " per ten thousand of the work -" ^0
"so its " + str(canary_mean_ms) + " ms implies " + str(canary_ms_at_production_mix) + " ms at the production mix, against " + str(baseline_mean_ms) + "." ^0
```

## Python (deterministic transpilation)

```python
canary_share_per_myriad = 100
soak_minutes = 60
baseline_mean_ms = 240
canary_mean_ms = 96
items_in_a_new_session = 3
items_in_an_established_session = 61
bad_releases_stopped_this_quarter = 2
work_ratio = int(items_in_an_established_session / items_in_a_new_session)
apparent_improvement_ms = baseline_mean_ms - canary_mean_ms
print("canary share                  : " + str(canary_share_per_myriad) + " per ten thousand")
print("soak, minutes                 : " + str(soak_minutes))
print("baseline mean, ms             : " + str(baseline_mean_ms))
print("canary mean, ms               : " + str(canary_mean_ms))
print("apparent improvement, ms      : " + str(apparent_improvement_ms))
print("")
print("items in a new session        : " + str(items_in_a_new_session))
print("items in an established session : " + str(items_in_an_established_session))
print("work ratio                    : " + str(work_ratio) + " times")
print("")
print("the canary comparison")
print("  traffic share       : " + str(canary_share_per_myriad) + " per ten thousand")
print("  soak                : " + str(soak_minutes) + " minutes")
print("  compared against    : the same window, same hardware")
print("  automatic rollback on regression : yes")
print("  bad releases stopped this quarter : " + str(bad_releases_stopped_this_quarter))
print("  verdict             : HEALTHY, BETTER THAN BASELINE")
print("")
print("  it is a real gate and it has caught real regressions")
print("")
print("which requests can reach it")
print("  routing            : sticky by session")
print("  established sessions : stay on their existing pool")
print("  new sessions       : may land on the canary")
print("  so the canary's population is : arrivals")
print("")
print("  stickiness is there for a good reason and it is also")
print("  the sampling rule")
print("")
canary_work_per_myriad = int(items_in_a_new_session * 10000 / items_in_an_established_session)
print("work per request on the canary, against production : " + str(canary_work_per_myriad) + " per ten thousand")
print("")
canary_ms_at_production_mix = int(canary_mean_ms * items_in_an_established_session / items_in_a_new_session)
print("the same canary, on the production mix")
print("  measured mean, ms          : " + str(canary_mean_ms))
print("  work ratio                 : " + str(work_ratio))
print("  implied mean at that mix, ms : " + str(canary_ms_at_production_mix))
print("  baseline mean, ms          : " + str(baseline_mean_ms))
print("")
implied_regression_ms = canary_ms_at_production_mix - baseline_mean_ms
print("  implied change, ms         : " + str(implied_regression_ms))
print("  which direction the gate reported : better")
print("")
nc_items_per_canary_request = items_in_an_established_session
nc_canary_mean_ms = canary_ms_at_production_mix
print("null control - established sessions also sampled")
print("  soak, minutes         : " + str(soak_minutes) + ", unchanged")
print("  items per canary request : " + str(nc_items_per_canary_request))
print("  canary mean, ms       : " + str(nc_canary_mean_ms))
print("  the canary did not get slower; it was asked the")
print("  question the baseline is being asked")
print("")
print("what a healthy canary guarantees")
print("  this version is healthy on the traffic it received : exactly")
print("  this version is healthy in production               : not")
print("    addressed; the routing that selects the sample is")
print("    chosen for other reasons and is not a sampling design")
print("")
print("a canary is an experiment and its assignment rule is its")
print("randomisation; when the rule correlates with the workload,")
print("the result is about the sample and reads as being about the")
print("population")
print("")
print("The canary is healthy and the gate is real: " + str(canary_share_per_myriad) + " per ten thousand of traffic,")
print("a " + str(soak_minutes) + " minute soak, like-for-like comparison, automatic rollback, and " + str(bad_releases_stopped_this_quarter))
print("bad releases stopped this quarter. Sticky routing sends it only new sessions,")
print("which carry " + str(items_in_a_new_session) + " items against " + str(items_in_an_established_session) + " - " + str(canary_work_per_myriad) + " per ten thousand of the work -")
print("so its " + str(canary_mean_ms) + " ms implies " + str(canary_ms_at_production_mix) + " ms at the production mix, against " + str(baseline_mean_ms) + ".")
```

## stdout (executed)

```text
canary share                  : 100 per ten thousand
soak, minutes                 : 60
baseline mean, ms             : 240
canary mean, ms               : 96
apparent improvement, ms      : 144

items in a new session        : 3
items in an established session : 61
work ratio                    : 20 times

the canary comparison
  traffic share       : 100 per ten thousand
  soak                : 60 minutes
  compared against    : the same window, same hardware
  automatic rollback on regression : yes
  bad releases stopped this quarter : 2
  verdict             : HEALTHY, BETTER THAN BASELINE

  it is a real gate and it has caught real regressions

which requests can reach it
  routing            : sticky by session
  established sessions : stay on their existing pool
  new sessions       : may land on the canary
  so the canary's population is : arrivals

  stickiness is there for a good reason and it is also
  the sampling rule

work per request on the canary, against production : 491 per ten thousand

the same canary, on the production mix
  measured mean, ms          : 96
  work ratio                 : 20
  implied mean at that mix, ms : 1952
  baseline mean, ms          : 240

  implied change, ms         : 1712
  which direction the gate reported : better

null control - established sessions also sampled
  soak, minutes         : 60, unchanged
  items per canary request : 61
  canary mean, ms       : 1952
  the canary did not get slower; it was asked the
  question the baseline is being asked

what a healthy canary guarantees
  this version is healthy on the traffic it received : exactly
  this version is healthy in production               : not
    addressed; the routing that selects the sample is
    chosen for other reasons and is not a sampling design

a canary is an experiment and its assignment rule is its
randomisation; when the rule correlates with the workload,
the result is about the sample and reads as being about the
population

The canary is healthy and the gate is real: 100 per ten thousand of traffic,
a 60 minute soak, like-for-like comparison, automatic rollback, and 2
bad releases stopped this quarter. Sticky routing sends it only new sessions,
which carry 3 items against 61 - 491 per ten thousand of the work -
so its 96 ms implies 1952 ms at the production mix, against 240.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
