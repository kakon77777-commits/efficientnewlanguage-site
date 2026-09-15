<!-- canonical: efficientnewlanguage.org/ai/examples/858-the-long-runs-were-oversampled-by-the-sampler | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 858 — The long runs were oversampled by the sampler

`the_long_runs_were_oversampled_by_the_sampler.eml` - A profiler estimates the average request latency by sampling the currently-running request at random instants, and it averages the samples correctly. How a request comes to be sampled is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A profiler estimates
# the average request latency by sampling the currently-running request at random
# instants, and it averages the samples correctly. How a request comes to be
# sampled is computed below.
#
# The measurement is careful. It reads the real latency of each sampled request,
# not an estimate; it counts every sample; the mean is the honest average of the
# samples; and the intent is exactly 'the average request latency'.
#
# A request is sampled when the clock ticks while it is running, so a request is
# selected with probability proportional to its duration - the long ones span more
# ticks and are over-represented.

100000 => requests
20 => true_mean_latency_per_request
50 => sampled_mean_latency
200 => long_share_of_traffic_per_myriad
2000 => long_share_of_samples_per_myriad

sampled_mean_latency - true_mean_latency_per_request => ms_the_length_bias_added
int(ms_the_length_bias_added * 10000 / sampled_mean_latency) => overstated_share_per_myriad

"requests                        : " + str(requests) ^0
"true mean latency per request   : " + str(true_mean_latency_per_request) + " ms" ^0
"sampled mean latency            : " + str(sampled_mean_latency) + " ms" ^0
"long requests, share of traffic : " + str(long_share_of_traffic_per_myriad) + " per myriad" ^0
"long requests, share of samples : " + str(long_share_of_samples_per_myriad) + " per myriad" ^0
"ms the length-bias added        : " + str(ms_the_length_bias_added) ^0
"overstated share of the mean    : " + str(overstated_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the latency estimate" ^0
"  reads : the real latency of each sampled request" ^0
"  counts : every sample taken" ^0
"  mean : the honest average of the samples" ^0
"  intent : the average request latency" ^0
"  samples omitted : 0" ^0
"  verdict : SAMPLED MEAN IS 50 MS, COMPUTED CORRECTLY" ^0
"" ^0
"  averaging the real latency over every sample is the part" ^0
"  done right here, and it is why 50 ms is the correct mean" ^0
"  of the samples that were taken" ^0
"" ^0

# ---- how a request comes to be sampled ----

"the sampling rule" ^0
"  when a request is sampled : a clock tick lands while it" ^0
"    is running" ^0
"  so its chance of being sampled : is proportional to its" ^0
"    duration" ^0
"  a request twice as long : is twice as likely to be caught" ^0
"  long requests, 2 percent of traffic : are 20 percent of" ^0
"    the samples" ^0
"  so the sample : is weighted by length, not one-per-request" ^0
"" ^0

# ---- what the caller got ----

"the result of the profiler" ^0
"  reported average latency : " + str(sampled_mean_latency) + " ms" ^0
"  true per-request average : " + str(true_mean_latency_per_request) + " ms" ^0
"  milliseconds added by the length-bias : " + str(ms_the_length_bias_added) ^0
"  is the sample mean miscomputed : no; 50 is exact for the" ^0
"    samples" ^0
"  is 50 the per-request average : no; sampling by time" ^0
"    over-weights the long requests" ^0
"" ^0

# ---- null control ----

# The same requests, sampled once per completed request (weight one each) instead
# of by the clock (weight proportional to duration).
50 => nc_mean_sampled_by_time
20 => nc_mean_sampled_by_request
2000 => nc_long_over_representation_per_myriad_removed

"null control - sample once per request, not per clock tick" ^0
"  mean sampled by time : " + str(nc_mean_sampled_by_time) + " ms" ^0
"  mean sampled by request : " + str(nc_mean_sampled_by_request) + " ms" ^0
"  long-request over-weight removed : " + str(nc_long_over_representation_per_myriad_removed) + " per myriad" ^0
"  no request and no latency changed; each request stopped" ^0
"  being weighted by how long it ran and started counting" ^0
"  once" ^0
"" ^0

# ---- the rule ----

"what a mean of time-sampled latencies guarantees" ^0
"  it is the correct mean of the samples : exactly, real" ^0
"    latencies, every sample, honest average" ^0
"  it is the average request latency : not addressed;" ^0
"    sampling on a clock tick selects a request in proportion" ^0
"    to its duration, so the long ones are over-represented" ^0
"    and the mean rises from " + str(true_mean_latency_per_request) + " to " + str(sampled_mean_latency) ^0
"" ^0

"sampling by the moment favors whatever lasts longer, because a longer thing is in" ^0
"more moments; the average that results is weighted by duration, and a per-item" ^0
"question answered by a per-instant sample counts the big items more than once" ^0
"" ^0

"It averages the real latency over every sample - 50 ms is the exact sample mean." ^0
"But a request is sampled in proportion to how long it runs, so the long ones are" ^0
"over-represented; sampling once per request gives " + str(true_mean_latency_per_request) + " ms, the length-bias" ^0
"adding " + str(overstated_share_per_myriad) + " per ten thousand, until the sample is taken per request." ^0
```

## Python (deterministic transpilation)

```python
requests = 100000
true_mean_latency_per_request = 20
sampled_mean_latency = 50
long_share_of_traffic_per_myriad = 200
long_share_of_samples_per_myriad = 2000
ms_the_length_bias_added = sampled_mean_latency - true_mean_latency_per_request
overstated_share_per_myriad = int(ms_the_length_bias_added * 10000 / sampled_mean_latency)
print("requests                        : " + str(requests))
print("true mean latency per request   : " + str(true_mean_latency_per_request) + " ms")
print("sampled mean latency            : " + str(sampled_mean_latency) + " ms")
print("long requests, share of traffic : " + str(long_share_of_traffic_per_myriad) + " per myriad")
print("long requests, share of samples : " + str(long_share_of_samples_per_myriad) + " per myriad")
print("ms the length-bias added        : " + str(ms_the_length_bias_added))
print("overstated share of the mean    : " + str(overstated_share_per_myriad) + " per ten thousand")
print("")
print("the latency estimate")
print("  reads : the real latency of each sampled request")
print("  counts : every sample taken")
print("  mean : the honest average of the samples")
print("  intent : the average request latency")
print("  samples omitted : 0")
print("  verdict : SAMPLED MEAN IS 50 MS, COMPUTED CORRECTLY")
print("")
print("  averaging the real latency over every sample is the part")
print("  done right here, and it is why 50 ms is the correct mean")
print("  of the samples that were taken")
print("")
print("the sampling rule")
print("  when a request is sampled : a clock tick lands while it")
print("    is running")
print("  so its chance of being sampled : is proportional to its")
print("    duration")
print("  a request twice as long : is twice as likely to be caught")
print("  long requests, 2 percent of traffic : are 20 percent of")
print("    the samples")
print("  so the sample : is weighted by length, not one-per-request")
print("")
print("the result of the profiler")
print("  reported average latency : " + str(sampled_mean_latency) + " ms")
print("  true per-request average : " + str(true_mean_latency_per_request) + " ms")
print("  milliseconds added by the length-bias : " + str(ms_the_length_bias_added))
print("  is the sample mean miscomputed : no; 50 is exact for the")
print("    samples")
print("  is 50 the per-request average : no; sampling by time")
print("    over-weights the long requests")
print("")
nc_mean_sampled_by_time = 50
nc_mean_sampled_by_request = 20
nc_long_over_representation_per_myriad_removed = 2000
print("null control - sample once per request, not per clock tick")
print("  mean sampled by time : " + str(nc_mean_sampled_by_time) + " ms")
print("  mean sampled by request : " + str(nc_mean_sampled_by_request) + " ms")
print("  long-request over-weight removed : " + str(nc_long_over_representation_per_myriad_removed) + " per myriad")
print("  no request and no latency changed; each request stopped")
print("  being weighted by how long it ran and started counting")
print("  once")
print("")
print("what a mean of time-sampled latencies guarantees")
print("  it is the correct mean of the samples : exactly, real")
print("    latencies, every sample, honest average")
print("  it is the average request latency : not addressed;")
print("    sampling on a clock tick selects a request in proportion")
print("    to its duration, so the long ones are over-represented")
print("    and the mean rises from " + str(true_mean_latency_per_request) + " to " + str(sampled_mean_latency))
print("")
print("sampling by the moment favors whatever lasts longer, because a longer thing is in")
print("more moments; the average that results is weighted by duration, and a per-item")
print("question answered by a per-instant sample counts the big items more than once")
print("")
print("It averages the real latency over every sample - 50 ms is the exact sample mean.")
print("But a request is sampled in proportion to how long it runs, so the long ones are")
print("over-represented; sampling once per request gives " + str(true_mean_latency_per_request) + " ms, the length-bias")
print("adding " + str(overstated_share_per_myriad) + " per ten thousand, until the sample is taken per request.")
```

## stdout (executed)

```text
requests                        : 100000
true mean latency per request   : 20 ms
sampled mean latency            : 50 ms
long requests, share of traffic : 200 per myriad
long requests, share of samples : 2000 per myriad
ms the length-bias added        : 30
overstated share of the mean    : 6000 per ten thousand

the latency estimate
  reads : the real latency of each sampled request
  counts : every sample taken
  mean : the honest average of the samples
  intent : the average request latency
  samples omitted : 0
  verdict : SAMPLED MEAN IS 50 MS, COMPUTED CORRECTLY

  averaging the real latency over every sample is the part
  done right here, and it is why 50 ms is the correct mean
  of the samples that were taken

the sampling rule
  when a request is sampled : a clock tick lands while it
    is running
  so its chance of being sampled : is proportional to its
    duration
  a request twice as long : is twice as likely to be caught
  long requests, 2 percent of traffic : are 20 percent of
    the samples
  so the sample : is weighted by length, not one-per-request

the result of the profiler
  reported average latency : 50 ms
  true per-request average : 20 ms
  milliseconds added by the length-bias : 30
  is the sample mean miscomputed : no; 50 is exact for the
    samples
  is 50 the per-request average : no; sampling by time
    over-weights the long requests

null control - sample once per request, not per clock tick
  mean sampled by time : 50 ms
  mean sampled by request : 20 ms
  long-request over-weight removed : 2000 per myriad
  no request and no latency changed; each request stopped
  being weighted by how long it ran and started counting
  once

what a mean of time-sampled latencies guarantees
  it is the correct mean of the samples : exactly, real
    latencies, every sample, honest average
  it is the average request latency : not addressed;
    sampling on a clock tick selects a request in proportion
    to its duration, so the long ones are over-represented
    and the mean rises from 20 to 50

sampling by the moment favors whatever lasts longer, because a longer thing is in
more moments; the average that results is weighted by duration, and a per-item
question answered by a per-instant sample counts the big items more than once

It averages the real latency over every sample - 50 ms is the exact sample mean.
But a request is sampled in proportion to how long it runs, so the long ones are
over-represented; sampling once per request gives 20 ms, the length-bias
adding 6000 per ten thousand, until the sample is taken per request.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
