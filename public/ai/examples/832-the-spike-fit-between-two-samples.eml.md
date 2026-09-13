<!-- canonical: efficientnewlanguage.org/ai/examples/832-the-spike-fit-between-two-samples | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 832 — The spike fit between two samples

`the_spike_fit_between_two_samples.eml` - The utilisation gauge stayed under its ceiling for the whole hour, and every sample it took was real. How often it samples, against how long the spike lasted, is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The utilisation
# gauge stayed under its ceiling for the whole hour, and every sample it took was
# real. How often it samples, against how long the spike lasted, is computed
# below.
#
# The gauge is honest. It reads a real utilisation counter, not a model; every
# sample is kept, none discarded; the ceiling is checked against each sample;
# and the sixty samples an hour are on a chart anyone can read.
#
# It samples once every sixty seconds, and the spike lasted twenty.

60 => sample_interval_seconds
20 => spike_duration_seconds
15 => seconds_after_a_sample_the_spike_began
9000 => requests_dropped_during_the_spike
0 => samples_that_landed_during_the_spike
3600 => seconds_in_the_hour

int(seconds_in_the_hour / sample_interval_seconds) => samples_in_the_hour
seconds_after_a_sample_the_spike_began + spike_duration_seconds => second_within_the_minute_the_spike_ended
sample_interval_seconds - second_within_the_minute_the_spike_ended => seconds_of_quiet_after_it_before_the_next_sample

"sample interval                 : " + str(sample_interval_seconds) + " seconds" ^0
"samples in the hour             : " + str(samples_in_the_hour) ^0
"spike duration                  : " + str(spike_duration_seconds) + " seconds" ^0
"  began after a sample at       : " + str(seconds_after_a_sample_the_spike_began) + " seconds" ^0
"  ended at second               : " + str(second_within_the_minute_the_spike_ended) ^0
"  quiet before the next sample  : " + str(seconds_of_quiet_after_it_before_the_next_sample) + " seconds" ^0
"samples during the spike        : " + str(samples_that_landed_during_the_spike) ^0
"requests dropped in the spike   : " + str(requests_dropped_during_the_spike) ^0
"" ^0

# ---- what the gauge verified ----

"the utilisation gauge" ^0
"  reads : a real counter, not a model" ^0
"  samples kept : all of them" ^0
"  ceiling : checked against each sample" ^0
"  visibility : sixty samples an hour on a chart" ^0
"  samples over the ceiling : 0" ^0
"  verdict : UNDER THE CEILING" ^0
"" ^0
"  keeping every sample rather than pre-averaging is the" ^0
"  part done right here, and it is why a sustained climb" ^0
"  would show" ^0
"" ^0

# ---- what falls between samples ----

"the twenty seconds nobody sampled" ^0
"  the spike : began at second " + str(seconds_after_a_sample_the_spike_began) + ", ended at " ^0
"    " + str(second_within_the_minute_the_spike_ended) + ", inside one sample interval" ^0
"  the sample before it : taken at second 0, quiet" ^0
"  the sample after it : taken at second 60, quiet again" ^0
"  samples that saw it : " + str(samples_that_landed_during_the_spike) ^0
"  what the chart shows there : two calm readings and a" ^0
"    straight line between them" ^0
"" ^0

# ---- what the spike did, unseen ----

"the spike itself" ^0
"  requests dropped : " + str(requests_dropped_during_the_spike) ^0
"  the gauge's maximum for the hour : a calm sample" ^0
"  is any sample wrong : no; each was real and under the" ^0
"    ceiling" ^0
"  did the ceiling hold : unknown; the gauge never looked" ^0
"    when it mattered" ^0
"  is the peak the maximum sample : only if a sample" ^0
"    coincided with the peak" ^0
"" ^0

# ---- null control ----

# The same hour, with the counter reporting its own max-since-last-read at each
# sample instead of an instantaneous value.
0 => nc_samples_during_the_spike
1 => nc_samples_that_would_report_the_peak
9000 => nc_dropped_requests_it_would_reveal

"null control - report max-since-last-read, not instantaneous" ^0
"  samples during the spike : " + str(nc_samples_during_the_spike) + ", still zero" ^0
"  samples that would report the peak : " ^0
"    " + str(nc_samples_that_would_report_the_peak) ^0
"  dropped requests it would reveal : " ^0
"    " + str(nc_dropped_requests_it_would_reveal) ^0
"  no request and no interval changed; each sample stopped" ^0
"  being a single instant and started summarizing the gap" ^0
"" ^0

# ---- the rule ----

"what an hour under the ceiling guarantees" ^0
"  no sample the gauge took exceeded the ceiling : exactly," ^0
"    every sample kept and checked" ^0
"  the peak was within limits : not addressed; the gauge is" ^0
"    polled every 60s and the spike lasted 20s between two" ^0
"    polls - " + str(samples_that_landed_during_the_spike) + " samples saw it while " + str(requests_dropped_during_the_spike) + " requests" ^0
"    were dropped" ^0
"" ^0

"a sample is a fact about an instant, and a maximum over samples is a fact about" ^0
"those instants, not about the moments between them; an event shorter than the" ^0
"interval lives entirely in the gaps the gauge does not measure" ^0
"" ^0

"It reads a real counter, keeps every sample, and checks each against the" ^0
"ceiling - none over. It polls every 60s and the spike lasted 20s between two" ^0
"polls, so " + str(samples_that_landed_during_the_spike) + " samples caught it while " + str(requests_dropped_during_the_spike) + " requests were dropped in the" ^0
"gap the gauge never looked at." ^0
```

## Python (deterministic transpilation)

```python
sample_interval_seconds = 60
spike_duration_seconds = 20
seconds_after_a_sample_the_spike_began = 15
requests_dropped_during_the_spike = 9000
samples_that_landed_during_the_spike = 0
seconds_in_the_hour = 3600
samples_in_the_hour = int(seconds_in_the_hour / sample_interval_seconds)
second_within_the_minute_the_spike_ended = seconds_after_a_sample_the_spike_began + spike_duration_seconds
seconds_of_quiet_after_it_before_the_next_sample = sample_interval_seconds - second_within_the_minute_the_spike_ended
print("sample interval                 : " + str(sample_interval_seconds) + " seconds")
print("samples in the hour             : " + str(samples_in_the_hour))
print("spike duration                  : " + str(spike_duration_seconds) + " seconds")
print("  began after a sample at       : " + str(seconds_after_a_sample_the_spike_began) + " seconds")
print("  ended at second               : " + str(second_within_the_minute_the_spike_ended))
print("  quiet before the next sample  : " + str(seconds_of_quiet_after_it_before_the_next_sample) + " seconds")
print("samples during the spike        : " + str(samples_that_landed_during_the_spike))
print("requests dropped in the spike   : " + str(requests_dropped_during_the_spike))
print("")
print("the utilisation gauge")
print("  reads : a real counter, not a model")
print("  samples kept : all of them")
print("  ceiling : checked against each sample")
print("  visibility : sixty samples an hour on a chart")
print("  samples over the ceiling : 0")
print("  verdict : UNDER THE CEILING")
print("")
print("  keeping every sample rather than pre-averaging is the")
print("  part done right here, and it is why a sustained climb")
print("  would show")
print("")
print("the twenty seconds nobody sampled")
print("  the spike : began at second " + str(seconds_after_a_sample_the_spike_began) + ", ended at ")
print("    " + str(second_within_the_minute_the_spike_ended) + ", inside one sample interval")
print("  the sample before it : taken at second 0, quiet")
print("  the sample after it : taken at second 60, quiet again")
print("  samples that saw it : " + str(samples_that_landed_during_the_spike))
print("  what the chart shows there : two calm readings and a")
print("    straight line between them")
print("")
print("the spike itself")
print("  requests dropped : " + str(requests_dropped_during_the_spike))
print("  the gauge's maximum for the hour : a calm sample")
print("  is any sample wrong : no; each was real and under the")
print("    ceiling")
print("  did the ceiling hold : unknown; the gauge never looked")
print("    when it mattered")
print("  is the peak the maximum sample : only if a sample")
print("    coincided with the peak")
print("")
nc_samples_during_the_spike = 0
nc_samples_that_would_report_the_peak = 1
nc_dropped_requests_it_would_reveal = 9000
print("null control - report max-since-last-read, not instantaneous")
print("  samples during the spike : " + str(nc_samples_during_the_spike) + ", still zero")
print("  samples that would report the peak : ")
print("    " + str(nc_samples_that_would_report_the_peak))
print("  dropped requests it would reveal : ")
print("    " + str(nc_dropped_requests_it_would_reveal))
print("  no request and no interval changed; each sample stopped")
print("  being a single instant and started summarizing the gap")
print("")
print("what an hour under the ceiling guarantees")
print("  no sample the gauge took exceeded the ceiling : exactly,")
print("    every sample kept and checked")
print("  the peak was within limits : not addressed; the gauge is")
print("    polled every 60s and the spike lasted 20s between two")
print("    polls - " + str(samples_that_landed_during_the_spike) + " samples saw it while " + str(requests_dropped_during_the_spike) + " requests")
print("    were dropped")
print("")
print("a sample is a fact about an instant, and a maximum over samples is a fact about")
print("those instants, not about the moments between them; an event shorter than the")
print("interval lives entirely in the gaps the gauge does not measure")
print("")
print("It reads a real counter, keeps every sample, and checks each against the")
print("ceiling - none over. It polls every 60s and the spike lasted 20s between two")
print("polls, so " + str(samples_that_landed_during_the_spike) + " samples caught it while " + str(requests_dropped_during_the_spike) + " requests were dropped in the")
print("gap the gauge never looked at.")
```

## stdout (executed)

```text
sample interval                 : 60 seconds
samples in the hour             : 60
spike duration                  : 20 seconds
  began after a sample at       : 15 seconds
  ended at second               : 35
  quiet before the next sample  : 25 seconds
samples during the spike        : 0
requests dropped in the spike   : 9000

the utilisation gauge
  reads : a real counter, not a model
  samples kept : all of them
  ceiling : checked against each sample
  visibility : sixty samples an hour on a chart
  samples over the ceiling : 0
  verdict : UNDER THE CEILING

  keeping every sample rather than pre-averaging is the
  part done right here, and it is why a sustained climb
  would show

the twenty seconds nobody sampled
  the spike : began at second 15, ended at 
    35, inside one sample interval
  the sample before it : taken at second 0, quiet
  the sample after it : taken at second 60, quiet again
  samples that saw it : 0
  what the chart shows there : two calm readings and a
    straight line between them

the spike itself
  requests dropped : 9000
  the gauge's maximum for the hour : a calm sample
  is any sample wrong : no; each was real and under the
    ceiling
  did the ceiling hold : unknown; the gauge never looked
    when it mattered
  is the peak the maximum sample : only if a sample
    coincided with the peak

null control - report max-since-last-read, not instantaneous
  samples during the spike : 0, still zero
  samples that would report the peak : 
    1
  dropped requests it would reveal : 
    9000
  no request and no interval changed; each sample stopped
  being a single instant and started summarizing the gap

what an hour under the ceiling guarantees
  no sample the gauge took exceeded the ceiling : exactly,
    every sample kept and checked
  the peak was within limits : not addressed; the gauge is
    polled every 60s and the spike lasted 20s between two
    polls - 0 samples saw it while 9000 requests
    were dropped

a sample is a fact about an instant, and a maximum over samples is a fact about
those instants, not about the moments between them; an event shorter than the
interval lives entirely in the gaps the gauge does not measure

It reads a real counter, keeps every sample, and checks each against the
ceiling - none over. It polls every 60s and the spike lasted 20s between two
polls, so 0 samples caught it while 9000 requests were dropped in the
gap the gauge never looked at.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
