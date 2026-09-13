<!-- canonical: efficientnewlanguage.org/ai/examples/822-the-cache-served-through-the-origin-outage | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 822 — The cache served through the origin outage

`the_cache_served_through_the_origin_outage.eml` - The service stayed healthy through the forty minutes under review, and every health signal it read was real. What health is measured on is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The service stayed
# healthy through the forty minutes under review, and every health signal it
# read was real. What health is measured on is computed below.
#
# The health check is honest. It measures real served requests, not a synthetic
# ping; it reads end-to-end latency and error rate from actual traffic; it is
# evaluated every ten seconds; and it pages the moment either crosses its
# threshold.
#
# Health is measured on reads, and reads are served from a cache that was still
# fresh while the origin was unreachable.

10000 => cache_hit_rate_per_myriad
2000000 => reads_served_from_cache
40 => minutes_the_origin_was_unreachable
15000 => writes_attempted
0 => writes_that_succeeded
0 => alerts_on_origin_reachability

writes_attempted - writes_that_succeeded => writes_that_failed_unseen
int(writes_that_failed_unseen * 10000 / writes_attempted) => write_failure_per_myriad

"cache hit rate                  : " + str(cache_hit_rate_per_myriad) + " per ten thousand" ^0
"reads served from cache         : " + str(reads_served_from_cache) ^0
"minutes the origin was down     : " + str(minutes_the_origin_was_unreachable) ^0
"writes attempted                : " + str(writes_attempted) ^0
"  succeeded                     : " + str(writes_that_succeeded) ^0
"  failed unseen                 : " + str(writes_that_failed_unseen) ^0
"alerts on origin reachability   : " + str(alerts_on_origin_reachability) ^0
"write failure rate              : " + str(write_failure_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the health check verified ----

"the health check" ^0
"  measures : real served requests, not a synthetic ping" ^0
"  reads : end-to-end latency and error rate from traffic" ^0
"  evaluated : every ten seconds" ^0
"  pages when : latency or error rate crosses a threshold" ^0
"  thresholds crossed : none" ^0
"  verdict : HEALTHY" ^0
"" ^0
"  measuring real traffic rather than a synthetic ping is" ^0
"  the part done right here, and it is why the green is not" ^0
"  a fake-healthy prober" ^0
"" ^0

# ---- what health is measured on ----

"the reads the check reads" ^0
"  where they are served from : a cache, still within TTL" ^0
"  what the cache needs from the origin : nothing, while" ^0
"    its entries are fresh" ^0
"  so a read : succeeds, fast, correct, origin down or not" ^0
"  what the check therefore sees : health" ^0
"  what it does not touch : the write path to the origin" ^0
"" ^0

# ---- what the read-shaped view missed ----

"the write path, in the same window" ^0
"  writes attempted : " + str(writes_attempted) ^0
"  writes that reached the origin : " + str(writes_that_succeeded) ^0
"  what a failed write showed on the health board : nothing" ^0
"  is the health signal wrong : no; the reads it measured" ^0
"    really were healthy" ^0
"  is a read-shaped signal the whole of health : no; and" ^0
"    the cache will expire" ^0
"" ^0

# ---- null control ----

# The same outage, with a health check that also probes origin reachability and
# the write path, not only cached reads.
10000 => nc_read_health_per_myriad
0 => nc_write_health_per_myriad
1 => nc_alerts_it_would_raise

"null control - probe the write path too" ^0
"  read health : " + str(nc_read_health_per_myriad) + ", unchanged" ^0
"  write health : " + str(nc_write_health_per_myriad) + " per ten thousand" ^0
"  alerts it would raise : " + str(nc_alerts_it_would_raise) ^0
"  no read and no cache entry changed; health stopped being" ^0
"  measured only where the cache could answer" ^0
"" ^0

# ---- the rule ----

"what a healthy service guarantees" ^0
"  served reads are fast and correct : exactly, real" ^0
"    traffic, every ten seconds, thresholds armed" ^0
"  the system is healthy : not addressed; health is" ^0
"    measured on reads and the cache served every read" ^0
"    through a " + str(minutes_the_origin_was_unreachable) + "-minute origin outage - " + str(writes_that_failed_unseen) + " writes failed" ^0
"    unseen, and the outage surfaces only when the cache" ^0
"    expires" ^0
"" ^0

"a cache in front of an outage is a held breath, and health measured on the" ^0
"reads it answers is health measured on the breath, not the need for air; the" ^0
"outage is real the whole time and invisible until the cache lets go" ^0
"" ^0

"It measures real traffic every ten seconds and pages on a threshold - reads" ^0
"genuinely healthy. Those reads came from a still-fresh cache through a " ^0
"" + str(minutes_the_origin_was_unreachable) + "-minute origin outage, so " + str(writes_that_failed_unseen) + " writes failed unseen, " + str(write_failure_per_myriad) + " per ten" ^0
"thousand, under " + str(alerts_on_origin_reachability) + " reachability alerts." ^0
```

## Python (deterministic transpilation)

```python
cache_hit_rate_per_myriad = 10000
reads_served_from_cache = 2000000
minutes_the_origin_was_unreachable = 40
writes_attempted = 15000
writes_that_succeeded = 0
alerts_on_origin_reachability = 0
writes_that_failed_unseen = writes_attempted - writes_that_succeeded
write_failure_per_myriad = int(writes_that_failed_unseen * 10000 / writes_attempted)
print("cache hit rate                  : " + str(cache_hit_rate_per_myriad) + " per ten thousand")
print("reads served from cache         : " + str(reads_served_from_cache))
print("minutes the origin was down     : " + str(minutes_the_origin_was_unreachable))
print("writes attempted                : " + str(writes_attempted))
print("  succeeded                     : " + str(writes_that_succeeded))
print("  failed unseen                 : " + str(writes_that_failed_unseen))
print("alerts on origin reachability   : " + str(alerts_on_origin_reachability))
print("write failure rate              : " + str(write_failure_per_myriad) + " per ten thousand")
print("")
print("the health check")
print("  measures : real served requests, not a synthetic ping")
print("  reads : end-to-end latency and error rate from traffic")
print("  evaluated : every ten seconds")
print("  pages when : latency or error rate crosses a threshold")
print("  thresholds crossed : none")
print("  verdict : HEALTHY")
print("")
print("  measuring real traffic rather than a synthetic ping is")
print("  the part done right here, and it is why the green is not")
print("  a fake-healthy prober")
print("")
print("the reads the check reads")
print("  where they are served from : a cache, still within TTL")
print("  what the cache needs from the origin : nothing, while")
print("    its entries are fresh")
print("  so a read : succeeds, fast, correct, origin down or not")
print("  what the check therefore sees : health")
print("  what it does not touch : the write path to the origin")
print("")
print("the write path, in the same window")
print("  writes attempted : " + str(writes_attempted))
print("  writes that reached the origin : " + str(writes_that_succeeded))
print("  what a failed write showed on the health board : nothing")
print("  is the health signal wrong : no; the reads it measured")
print("    really were healthy")
print("  is a read-shaped signal the whole of health : no; and")
print("    the cache will expire")
print("")
nc_read_health_per_myriad = 10000
nc_write_health_per_myriad = 0
nc_alerts_it_would_raise = 1
print("null control - probe the write path too")
print("  read health : " + str(nc_read_health_per_myriad) + ", unchanged")
print("  write health : " + str(nc_write_health_per_myriad) + " per ten thousand")
print("  alerts it would raise : " + str(nc_alerts_it_would_raise))
print("  no read and no cache entry changed; health stopped being")
print("  measured only where the cache could answer")
print("")
print("what a healthy service guarantees")
print("  served reads are fast and correct : exactly, real")
print("    traffic, every ten seconds, thresholds armed")
print("  the system is healthy : not addressed; health is")
print("    measured on reads and the cache served every read")
print("    through a " + str(minutes_the_origin_was_unreachable) + "-minute origin outage - " + str(writes_that_failed_unseen) + " writes failed")
print("    unseen, and the outage surfaces only when the cache")
print("    expires")
print("")
print("a cache in front of an outage is a held breath, and health measured on the")
print("reads it answers is health measured on the breath, not the need for air; the")
print("outage is real the whole time and invisible until the cache lets go")
print("")
print("It measures real traffic every ten seconds and pages on a threshold - reads")
print("genuinely healthy. Those reads came from a still-fresh cache through a ")
print("" + str(minutes_the_origin_was_unreachable) + "-minute origin outage, so " + str(writes_that_failed_unseen) + " writes failed unseen, " + str(write_failure_per_myriad) + " per ten")
print("thousand, under " + str(alerts_on_origin_reachability) + " reachability alerts.")
```

## stdout (executed)

```text
cache hit rate                  : 10000 per ten thousand
reads served from cache         : 2000000
minutes the origin was down     : 40
writes attempted                : 15000
  succeeded                     : 0
  failed unseen                 : 15000
alerts on origin reachability   : 0
write failure rate              : 10000 per ten thousand

the health check
  measures : real served requests, not a synthetic ping
  reads : end-to-end latency and error rate from traffic
  evaluated : every ten seconds
  pages when : latency or error rate crosses a threshold
  thresholds crossed : none
  verdict : HEALTHY

  measuring real traffic rather than a synthetic ping is
  the part done right here, and it is why the green is not
  a fake-healthy prober

the reads the check reads
  where they are served from : a cache, still within TTL
  what the cache needs from the origin : nothing, while
    its entries are fresh
  so a read : succeeds, fast, correct, origin down or not
  what the check therefore sees : health
  what it does not touch : the write path to the origin

the write path, in the same window
  writes attempted : 15000
  writes that reached the origin : 0
  what a failed write showed on the health board : nothing
  is the health signal wrong : no; the reads it measured
    really were healthy
  is a read-shaped signal the whole of health : no; and
    the cache will expire

null control - probe the write path too
  read health : 10000, unchanged
  write health : 0 per ten thousand
  alerts it would raise : 1
  no read and no cache entry changed; health stopped being
  measured only where the cache could answer

what a healthy service guarantees
  served reads are fast and correct : exactly, real
    traffic, every ten seconds, thresholds armed
  the system is healthy : not addressed; health is
    measured on reads and the cache served every read
    through a 40-minute origin outage - 15000 writes failed
    unseen, and the outage surfaces only when the cache
    expires

a cache in front of an outage is a held breath, and health measured on the
reads it answers is health measured on the breath, not the need for air; the
outage is real the whole time and invisible until the cache lets go

It measures real traffic every ten seconds and pages on a threshold - reads
genuinely healthy. Those reads came from a still-fresh cache through a 
40-minute origin outage, so 15000 writes failed unseen, 10000 per ten
thousand, under 0 reachability alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
