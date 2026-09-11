<!-- canonical: efficientnewlanguage.org/ai/examples/803-the-percentile-was-averaged-across-the-shards | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 803 — The percentile was averaged across the shards

`the_percentile_was_averaged_across_the_shards.eml` - The dashboard p99 latency has been under the 300 ms SLO all quarter, and each per-shard number it combines is true. How the one figure is combined is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The dashboard p99
# latency has been under the 300 ms SLO all quarter, and each per-shard number
# it combines is true. How the one figure is combined is computed below.
#
# The measurement is careful per shard. Each shard computes its p99 from its own
# real request latencies, over the full window, not a sample; the histogram
# buckets are fine near the tail; and the SLO is checked every minute.
#
# The one number on the dashboard is the mean of the shards' p99s.

20 => shards
19 => typical_shards
180 => typical_shard_p99_ms
1 => hot_shards
950 => hot_shard_p99_ms
300 => slo_ms
940 => pooled_p99_ms
20000000 => requests_total
1000000 => hot_shard_requests

typical_shards * typical_shard_p99_ms + hot_shards * hot_shard_p99_ms => sum_of_the_shard_p99s
int(sum_of_the_shard_p99s / shards) => reported_p99_ms
slo_ms - reported_p99_ms => headroom_the_dashboard_shows_ms
pooled_p99_ms - slo_ms => amount_the_pool_is_over_the_slo_ms
int(hot_shard_requests * 10000 / requests_total) => hot_shard_share_of_traffic_per_myriad

"shards                          : " + str(shards) ^0
"  typical shard p99             : " + str(typical_shard_p99_ms) + " ms" ^0
"  hot shard p99                 : " + str(hot_shard_p99_ms) + " ms" ^0
"sum of the shard p99s           : " + str(sum_of_the_shard_p99s) + " ms" ^0
"reported p99 (mean of them)     : " + str(reported_p99_ms) + " ms" ^0
"SLO                             : " + str(slo_ms) + " ms" ^0
"  headroom the dashboard shows  : " + str(headroom_the_dashboard_shows_ms) + " ms" ^0
"" ^0
"pooled p99 (over all requests)  : " + str(pooled_p99_ms) + " ms" ^0
"  over the SLO by               : " + str(amount_the_pool_is_over_the_slo_ms) + " ms" ^0
"hot shard share of traffic      : " + str(hot_shard_share_of_traffic_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the per-shard measurement verified ----

"the per-shard p99" ^0
"  computed from : each shard's real latencies" ^0
"  over : the full window, not a sample" ^0
"  tail buckets : fine-grained" ^0
"  checked : every minute against the SLO" ^0
"  shards inside their own p99 budget : all " + str(shards) ^0
"  verdict : WITHIN SLO" ^0
"" ^0
"  fine tail buckets are the part almost nobody funds, and" ^0
"  they are why each shard's p99 is itself trustworthy" ^0
"" ^0

# ---- how the one figure was combined ----

"the mean of the p99s" ^0
"  what was averaged : twenty per-shard 99th percentiles" ^0
"  what a mean of quantiles is : not a quantile of the" ^0
"    pool; the 99th percentile is not additive" ^0
"  the hot shard in the mean : one term of twenty, so its" ^0
"    950 is diluted to " + str(reported_p99_ms) + " ms" ^0
"  the hot shard in the pool : " ^0
"    " + str(hot_shard_share_of_traffic_per_myriad) + " per ten thousand of requests, all slow" ^0
"  so the slowest one percent of the pool : lands inside" ^0
"    that shard, at " + str(pooled_p99_ms) + " ms" ^0
"" ^0

# ---- what a caller on the hot shard sees ----

"the callers of the hot shard" ^0
"  their p99 : " + str(hot_shard_p99_ms) + " ms" ^0
"  what the dashboard shows : " + str(reported_p99_ms) + " ms, within SLO" ^0
"  their share of all requests : " ^0
"    " + str(hot_shard_share_of_traffic_per_myriad) + " per ten thousand" ^0
"  is any single number wrong : no; each shard p99 is" ^0
"    correct, and the mean of them is correctly computed" ^0
"  the pooled p99 they are inside : " + str(pooled_p99_ms) + " ms" ^0
"" ^0

# ---- null control ----

# The same latencies, with the p99 taken over the merged set of all requests
# instead of over the per-shard summaries.
218 => nc_mean_of_the_shard_p99s_ms
940 => nc_pooled_p99_ms
1 => nc_shards_that_hold_the_pooled_tail

"null control - one p99 over the merged requests" ^0
"  mean of the shard p99s : " + str(nc_mean_of_the_shard_p99s_ms) + " ms, unchanged" ^0
"  pooled p99 : " + str(nc_pooled_p99_ms) + " ms" ^0
"  shards holding the pooled tail : " ^0
"    " + str(nc_shards_that_hold_the_pooled_tail) ^0
"  no latency changed; the combining step stopped averaging" ^0
"  summaries and started ranking the requests" ^0
"" ^0

# ---- the rule ----

"what a p99 under the SLO guarantees" ^0
"  each shard's own p99 is under budget : exactly, all " ^0
"    " + str(shards) + " of them, from real latencies over the full window" ^0
"  the 99th percentile request is under budget : not" ^0
"    addressed; the figure is the mean of twenty per-shard" ^0
"    p99s, and a quantile of a pool is not the mean of the" ^0
"    quantiles - pooled, it is " + str(pooled_p99_ms) + " ms" ^0
"" ^0
"a percentile is a rank over a set, and the mean of the ranks" ^0
"of subsets is a different number; when one subset holds the" ^0
"whole tail, averaging its rank away is what hides it" ^0
"" ^0

"Each shard's p99 is real, over the full window, with fine tail buckets -" ^0
"" + str(reported_p99_ms) + " ms against a " + str(slo_ms) + " ms SLO. The dashboard averages the twenty p99s, and a" ^0
"quantile is not additive, so the hot shard's " + str(hot_shard_p99_ms) + " ms - " + str(hot_shard_share_of_traffic_per_myriad) + " per ten" ^0
"thousand of traffic - puts the pooled p99 at " + str(pooled_p99_ms) + " ms, " + str(amount_the_pool_is_over_the_slo_ms) + " ms over." ^0
```

## Python (deterministic transpilation)

```python
shards = 20
typical_shards = 19
typical_shard_p99_ms = 180
hot_shards = 1
hot_shard_p99_ms = 950
slo_ms = 300
pooled_p99_ms = 940
requests_total = 20000000
hot_shard_requests = 1000000
sum_of_the_shard_p99s = typical_shards * typical_shard_p99_ms + hot_shards * hot_shard_p99_ms
reported_p99_ms = int(sum_of_the_shard_p99s / shards)
headroom_the_dashboard_shows_ms = slo_ms - reported_p99_ms
amount_the_pool_is_over_the_slo_ms = pooled_p99_ms - slo_ms
hot_shard_share_of_traffic_per_myriad = int(hot_shard_requests * 10000 / requests_total)
print("shards                          : " + str(shards))
print("  typical shard p99             : " + str(typical_shard_p99_ms) + " ms")
print("  hot shard p99                 : " + str(hot_shard_p99_ms) + " ms")
print("sum of the shard p99s           : " + str(sum_of_the_shard_p99s) + " ms")
print("reported p99 (mean of them)     : " + str(reported_p99_ms) + " ms")
print("SLO                             : " + str(slo_ms) + " ms")
print("  headroom the dashboard shows  : " + str(headroom_the_dashboard_shows_ms) + " ms")
print("")
print("pooled p99 (over all requests)  : " + str(pooled_p99_ms) + " ms")
print("  over the SLO by               : " + str(amount_the_pool_is_over_the_slo_ms) + " ms")
print("hot shard share of traffic      : " + str(hot_shard_share_of_traffic_per_myriad) + " per ten thousand")
print("")
print("the per-shard p99")
print("  computed from : each shard's real latencies")
print("  over : the full window, not a sample")
print("  tail buckets : fine-grained")
print("  checked : every minute against the SLO")
print("  shards inside their own p99 budget : all " + str(shards))
print("  verdict : WITHIN SLO")
print("")
print("  fine tail buckets are the part almost nobody funds, and")
print("  they are why each shard's p99 is itself trustworthy")
print("")
print("the mean of the p99s")
print("  what was averaged : twenty per-shard 99th percentiles")
print("  what a mean of quantiles is : not a quantile of the")
print("    pool; the 99th percentile is not additive")
print("  the hot shard in the mean : one term of twenty, so its")
print("    950 is diluted to " + str(reported_p99_ms) + " ms")
print("  the hot shard in the pool : ")
print("    " + str(hot_shard_share_of_traffic_per_myriad) + " per ten thousand of requests, all slow")
print("  so the slowest one percent of the pool : lands inside")
print("    that shard, at " + str(pooled_p99_ms) + " ms")
print("")
print("the callers of the hot shard")
print("  their p99 : " + str(hot_shard_p99_ms) + " ms")
print("  what the dashboard shows : " + str(reported_p99_ms) + " ms, within SLO")
print("  their share of all requests : ")
print("    " + str(hot_shard_share_of_traffic_per_myriad) + " per ten thousand")
print("  is any single number wrong : no; each shard p99 is")
print("    correct, and the mean of them is correctly computed")
print("  the pooled p99 they are inside : " + str(pooled_p99_ms) + " ms")
print("")
nc_mean_of_the_shard_p99s_ms = 218
nc_pooled_p99_ms = 940
nc_shards_that_hold_the_pooled_tail = 1
print("null control - one p99 over the merged requests")
print("  mean of the shard p99s : " + str(nc_mean_of_the_shard_p99s_ms) + " ms, unchanged")
print("  pooled p99 : " + str(nc_pooled_p99_ms) + " ms")
print("  shards holding the pooled tail : ")
print("    " + str(nc_shards_that_hold_the_pooled_tail))
print("  no latency changed; the combining step stopped averaging")
print("  summaries and started ranking the requests")
print("")
print("what a p99 under the SLO guarantees")
print("  each shard's own p99 is under budget : exactly, all ")
print("    " + str(shards) + " of them, from real latencies over the full window")
print("  the 99th percentile request is under budget : not")
print("    addressed; the figure is the mean of twenty per-shard")
print("    p99s, and a quantile of a pool is not the mean of the")
print("    quantiles - pooled, it is " + str(pooled_p99_ms) + " ms")
print("")
print("a percentile is a rank over a set, and the mean of the ranks")
print("of subsets is a different number; when one subset holds the")
print("whole tail, averaging its rank away is what hides it")
print("")
print("Each shard's p99 is real, over the full window, with fine tail buckets -")
print("" + str(reported_p99_ms) + " ms against a " + str(slo_ms) + " ms SLO. The dashboard averages the twenty p99s, and a")
print("quantile is not additive, so the hot shard's " + str(hot_shard_p99_ms) + " ms - " + str(hot_shard_share_of_traffic_per_myriad) + " per ten")
print("thousand of traffic - puts the pooled p99 at " + str(pooled_p99_ms) + " ms, " + str(amount_the_pool_is_over_the_slo_ms) + " ms over.")
```

## stdout (executed)

```text
shards                          : 20
  typical shard p99             : 180 ms
  hot shard p99                 : 950 ms
sum of the shard p99s           : 4370 ms
reported p99 (mean of them)     : 218 ms
SLO                             : 300 ms
  headroom the dashboard shows  : 82 ms

pooled p99 (over all requests)  : 940 ms
  over the SLO by               : 640 ms
hot shard share of traffic      : 500 per ten thousand

the per-shard p99
  computed from : each shard's real latencies
  over : the full window, not a sample
  tail buckets : fine-grained
  checked : every minute against the SLO
  shards inside their own p99 budget : all 20
  verdict : WITHIN SLO

  fine tail buckets are the part almost nobody funds, and
  they are why each shard's p99 is itself trustworthy

the mean of the p99s
  what was averaged : twenty per-shard 99th percentiles
  what a mean of quantiles is : not a quantile of the
    pool; the 99th percentile is not additive
  the hot shard in the mean : one term of twenty, so its
    950 is diluted to 218 ms
  the hot shard in the pool : 
    500 per ten thousand of requests, all slow
  so the slowest one percent of the pool : lands inside
    that shard, at 940 ms

the callers of the hot shard
  their p99 : 950 ms
  what the dashboard shows : 218 ms, within SLO
  their share of all requests : 
    500 per ten thousand
  is any single number wrong : no; each shard p99 is
    correct, and the mean of them is correctly computed
  the pooled p99 they are inside : 940 ms

null control - one p99 over the merged requests
  mean of the shard p99s : 218 ms, unchanged
  pooled p99 : 940 ms
  shards holding the pooled tail : 
    1
  no latency changed; the combining step stopped averaging
  summaries and started ranking the requests

what a p99 under the SLO guarantees
  each shard's own p99 is under budget : exactly, all 
    20 of them, from real latencies over the full window
  the 99th percentile request is under budget : not
    addressed; the figure is the mean of twenty per-shard
    p99s, and a quantile of a pool is not the mean of the
    quantiles - pooled, it is 940 ms

a percentile is a rank over a set, and the mean of the ranks
of subsets is a different number; when one subset holds the
whole tail, averaging its rank away is what hides it

Each shard's p99 is real, over the full window, with fine tail buckets -
218 ms against a 300 ms SLO. The dashboard averages the twenty p99s, and a
quantile is not additive, so the hot shard's 950 ms - 500 per ten
thousand of traffic - puts the pooled p99 at 940 ms, 640 ms over.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
