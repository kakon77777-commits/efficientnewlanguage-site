<!-- canonical: efficientnewlanguage.org/ai/examples/648-the-fallback-was-tested-and-the-failover-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 648 — The fallback was tested and the failover was not

`the_fallback_was_tested_and_the_failover_was_not.eml` - The fallback path is tested on every release and has never failed. How long an outage lasts is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The fallback path
# is tested on every release and has never failed. How long an outage lasts is
# computed below.
#
# The fallback works. A test in every release forces the primary to error,
# asserts the secondary answers, and checks the answer is correct rather than
# merely present. Sixty-two releases, three hundred and forty assertions each,
# no failure. When the request reaches the fallback, the fallback serves it.
#
# "When the request reaches the fallback" is the whole of what is untested. The
# test injects the failure at the client, one layer above everything that has to
# happen in production before a request is routed anywhere else.
#
# Detection, then a DNS record whose time to live nobody chose for this purpose,
# then a connection pool that holds established sockets until they error.

62 => releases
340 => fallback_assertions_per_release
0 => fallback_failures
12000 => requests_per_second

45 => detection_seconds
300 => dns_ttl_seconds
90 => pool_drain_seconds

releases * fallback_assertions_per_release => fallback_assertions_run
detection_seconds + dns_ttl_seconds + pool_drain_seconds => seconds_to_reach_the_fallback
seconds_to_reach_the_fallback * requests_per_second => requests_failed_before_it_was_reached

"releases                       : " + str(releases) ^0
"fallback assertions run        : " + str(fallback_assertions_run) ^0
"fallback failures              : " + str(fallback_failures) ^0
"" ^0
"detection, seconds             : " + str(detection_seconds) ^0
"dns ttl, seconds               : " + str(dns_ttl_seconds) ^0
"pool drain, seconds            : " + str(pool_drain_seconds) ^0
"seconds to reach the fallback  : " + str(seconds_to_reach_the_fallback) ^0
"requests failed before then    : " + str(requests_failed_before_it_was_reached) ^0
"" ^0

# ---- what the test verified ----

"the fallback test" ^0
"  primary forced to error : yes" ^0
"  secondary answered      : yes" ^0
"  answer checked correct  : yes, not merely present" ^0
"  runs per release        : " + str(fallback_assertions_per_release) ^0
"  failures in " + str(releases) + " releases   : " + str(fallback_failures) ^0
"  verdict                 : FALLBACK WORKS" ^0
"" ^0
"  every line is true, and the fallback does serve" ^0
"  correctly the moment a request arrives at it" ^0
"" ^0

# ---- where the test injects the failure ----

"the layers between a failure and the fallback" ^0
"  1. the primary fails" ^0
"  2. something notices          : " + str(detection_seconds) + " s" ^0
"  3. the record is republished  : " + str(dns_ttl_seconds) + " s of cached answers" ^0
"  4. sockets already open error : " + str(pool_drain_seconds) + " s" ^0
"  5. a request reaches the fallback" ^0
"" ^0
"  the test injects at step 5, which is where it is easy to" ^0
"  inject and where nothing it measures lives" ^0
"" ^0

int(dns_ttl_seconds * 10000 / seconds_to_reach_the_fallback) => ttl_share_per_myriad
"the ttl alone is : " + str(ttl_share_per_myriad) + " per ten thousand of the outage" ^0
"" ^0

# ---- what the ttl was chosen for ----

# 300 seconds is the platform default, set when the record was created for a
# static marketing page. Nothing since has revisited it, because nothing since
# has asked what it costs.
"the number that dominates" ^0
"  dns ttl, seconds       : " + str(dns_ttl_seconds) ^0
"  chosen for             : the platform default" ^0
"  chosen by              : whoever created the record" ^0
"  reviewed as a failover parameter : never" ^0
"" ^0

# ---- null control ----

# The same fallback, exercised by failing the primary in production during a
# scheduled drill rather than at the client in a test.
30 => nc_dns_ttl_seconds
detection_seconds + nc_dns_ttl_seconds + pool_drain_seconds => nc_seconds_to_reach_the_fallback
nc_seconds_to_reach_the_fallback * requests_per_second => nc_requests_failed

"null control - the drill runs in production, ttl revisited" ^0
"  fallback failures       : " + str(fallback_failures) + ", unchanged" ^0
"  seconds to reach it     : " + str(nc_seconds_to_reach_the_fallback) ^0
"  requests failed before  : " + str(nc_requests_failed) ^0
"  the fallback did not improve; the path to it was" ^0
"  measured for the first time" ^0
"" ^0

# ---- the rule ----

"what a passing fallback test guarantees" ^0
"  the secondary serves correctly : exactly" ^0
"  an outage is short             : not addressed; the test" ^0
"    starts where the outage ends, so its duration is the" ^0
"    one quantity it cannot contain" ^0
"" ^0
"testing the destination is not testing the journey; a drill" ^0
"that injects at the client measures the half nobody was" ^0
"worried about" ^0
"" ^0

"The fallback works and " + str(fallback_assertions_run) + " assertions across " + str(releases) + " releases say so, with" ^0
str(fallback_failures) + " failures and answers checked correct rather than merely present. Reaching it" ^0
"takes " + str(seconds_to_reach_the_fallback) + " seconds - detection, then a " + str(dns_ttl_seconds) + "-second ttl that is " + str(ttl_share_per_myriad) + " per ten" ^0
"thousand of the outage and was never chosen as a failover parameter, then the" ^0
"pool - during which " + str(requests_failed_before_it_was_reached) + " requests fail at a service whose fallback is tested." ^0
```

## Python (deterministic transpilation)

```python
releases = 62
fallback_assertions_per_release = 340
fallback_failures = 0
requests_per_second = 12000
detection_seconds = 45
dns_ttl_seconds = 300
pool_drain_seconds = 90
fallback_assertions_run = releases * fallback_assertions_per_release
seconds_to_reach_the_fallback = detection_seconds + dns_ttl_seconds + pool_drain_seconds
requests_failed_before_it_was_reached = seconds_to_reach_the_fallback * requests_per_second
print("releases                       : " + str(releases))
print("fallback assertions run        : " + str(fallback_assertions_run))
print("fallback failures              : " + str(fallback_failures))
print("")
print("detection, seconds             : " + str(detection_seconds))
print("dns ttl, seconds               : " + str(dns_ttl_seconds))
print("pool drain, seconds            : " + str(pool_drain_seconds))
print("seconds to reach the fallback  : " + str(seconds_to_reach_the_fallback))
print("requests failed before then    : " + str(requests_failed_before_it_was_reached))
print("")
print("the fallback test")
print("  primary forced to error : yes")
print("  secondary answered      : yes")
print("  answer checked correct  : yes, not merely present")
print("  runs per release        : " + str(fallback_assertions_per_release))
print("  failures in " + str(releases) + " releases   : " + str(fallback_failures))
print("  verdict                 : FALLBACK WORKS")
print("")
print("  every line is true, and the fallback does serve")
print("  correctly the moment a request arrives at it")
print("")
print("the layers between a failure and the fallback")
print("  1. the primary fails")
print("  2. something notices          : " + str(detection_seconds) + " s")
print("  3. the record is republished  : " + str(dns_ttl_seconds) + " s of cached answers")
print("  4. sockets already open error : " + str(pool_drain_seconds) + " s")
print("  5. a request reaches the fallback")
print("")
print("  the test injects at step 5, which is where it is easy to")
print("  inject and where nothing it measures lives")
print("")
ttl_share_per_myriad = int(dns_ttl_seconds * 10000 / seconds_to_reach_the_fallback)
print("the ttl alone is : " + str(ttl_share_per_myriad) + " per ten thousand of the outage")
print("")
print("the number that dominates")
print("  dns ttl, seconds       : " + str(dns_ttl_seconds))
print("  chosen for             : the platform default")
print("  chosen by              : whoever created the record")
print("  reviewed as a failover parameter : never")
print("")
nc_dns_ttl_seconds = 30
nc_seconds_to_reach_the_fallback = detection_seconds + nc_dns_ttl_seconds + pool_drain_seconds
nc_requests_failed = nc_seconds_to_reach_the_fallback * requests_per_second
print("null control - the drill runs in production, ttl revisited")
print("  fallback failures       : " + str(fallback_failures) + ", unchanged")
print("  seconds to reach it     : " + str(nc_seconds_to_reach_the_fallback))
print("  requests failed before  : " + str(nc_requests_failed))
print("  the fallback did not improve; the path to it was")
print("  measured for the first time")
print("")
print("what a passing fallback test guarantees")
print("  the secondary serves correctly : exactly")
print("  an outage is short             : not addressed; the test")
print("    starts where the outage ends, so its duration is the")
print("    one quantity it cannot contain")
print("")
print("testing the destination is not testing the journey; a drill")
print("that injects at the client measures the half nobody was")
print("worried about")
print("")
print("The fallback works and " + str(fallback_assertions_run) + " assertions across " + str(releases) + " releases say so, with")
print(str(fallback_failures) + " failures and answers checked correct rather than merely present. Reaching it")
print("takes " + str(seconds_to_reach_the_fallback) + " seconds - detection, then a " + str(dns_ttl_seconds) + "-second ttl that is " + str(ttl_share_per_myriad) + " per ten")
print("thousand of the outage and was never chosen as a failover parameter, then the")
print("pool - during which " + str(requests_failed_before_it_was_reached) + " requests fail at a service whose fallback is tested.")
```

## stdout (executed)

```text
releases                       : 62
fallback assertions run        : 21080
fallback failures              : 0

detection, seconds             : 45
dns ttl, seconds               : 300
pool drain, seconds            : 90
seconds to reach the fallback  : 435
requests failed before then    : 5220000

the fallback test
  primary forced to error : yes
  secondary answered      : yes
  answer checked correct  : yes, not merely present
  runs per release        : 340
  failures in 62 releases   : 0
  verdict                 : FALLBACK WORKS

  every line is true, and the fallback does serve
  correctly the moment a request arrives at it

the layers between a failure and the fallback
  1. the primary fails
  2. something notices          : 45 s
  3. the record is republished  : 300 s of cached answers
  4. sockets already open error : 90 s
  5. a request reaches the fallback

  the test injects at step 5, which is where it is easy to
  inject and where nothing it measures lives

the ttl alone is : 6896 per ten thousand of the outage

the number that dominates
  dns ttl, seconds       : 300
  chosen for             : the platform default
  chosen by              : whoever created the record
  reviewed as a failover parameter : never

null control - the drill runs in production, ttl revisited
  fallback failures       : 0, unchanged
  seconds to reach it     : 165
  requests failed before  : 1980000
  the fallback did not improve; the path to it was
  measured for the first time

what a passing fallback test guarantees
  the secondary serves correctly : exactly
  an outage is short             : not addressed; the test
    starts where the outage ends, so its duration is the
    one quantity it cannot contain

testing the destination is not testing the journey; a drill
that injects at the client measures the half nobody was
worried about

The fallback works and 21080 assertions across 62 releases say so, with
0 failures and answers checked correct rather than merely present. Reaching it
takes 435 seconds - detection, then a 300-second ttl that is 6896 per ten
thousand of the outage and was never chosen as a failover parameter, then the
pool - during which 5220000 requests fail at a service whose fallback is tested.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
