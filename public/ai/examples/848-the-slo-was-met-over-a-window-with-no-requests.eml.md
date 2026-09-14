<!-- canonical: efficientnewlanguage.org/ai/examples/848-the-slo-was-met-over-a-window-with-no-requests | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 848 — The slo was met over a window with no requests

`the_slo_was_met_over_a_window_with_no_requests.eml` - The latency SLO reads 100 per hundred met for the hour under review, and the computation is honest. How many requests that hour is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The latency SLO
# reads 100 per hundred met for the hour under review, and the computation is
# honest. How many requests that hour is computed below.
#
# The SLO is measured well. It counts real requests against the threshold, not a
# synthetic probe; a request over the threshold counts as a miss; the window is
# the clock hour, not a rolling one chosen afterwards; and a miss rate above the
# budget pages on-call.
#
# The hour under review had no requests, and zero misses over zero requests is
# reported as fully met.

3600 => seconds_in_the_hour
0 => requests_in_the_hour
0 => requests_over_the_threshold
10000 => reported_slo_met_per_myriad
0 => alerts_that_fired
40 => minutes_the_service_was_unreachable

requests_in_the_hour - requests_over_the_threshold => requests_under_the_threshold
int(minutes_the_service_was_unreachable * 10000 / 60) => share_of_the_hour_unreachable_per_myriad

"requests in the hour            : " + str(requests_in_the_hour) ^0
"  over the threshold            : " + str(requests_over_the_threshold) ^0
"  under the threshold           : " + str(requests_under_the_threshold) ^0
"reported SLO met                : " + str(reported_slo_met_per_myriad) + " per ten thousand" ^0
"alerts that fired               : " + str(alerts_that_fired) ^0
"minutes the service was unreachable : " + str(minutes_the_service_was_unreachable) ^0
"share of the hour unreachable   : " + str(share_of_the_hour_unreachable_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the SLO verified ----

"the latency SLO" ^0
"  counts : real requests against the threshold" ^0
"  a slow request : counts as a miss" ^0
"  window : the clock hour, not a rolling one" ^0
"  pages when : the miss rate exceeds the budget" ^0
"  requests over the threshold : 0" ^0
"  verdict : 100 PER HUNDRED MET" ^0
"" ^0
"  counting real requests rather than a synthetic probe is" ^0
"  the part done right here, and it is why a real slow hour" ^0
"  would show" ^0
"" ^0

# ---- what the ratio is over ----

"met = (requests under threshold) / (requests)" ^0
"  requests this hour : " + str(requests_in_the_hour) ^0
"  misses this hour : " + str(requests_over_the_threshold) ^0
"  the ratio : zero over zero, reported as fully met" ^0
"  what '100 per hundred met' of no requests means : every" ^0
"    one of no requests was fast, trivially" ^0
"  what it does not mean : that the service served anyone" ^0
"" ^0

# ---- why there were no requests ----

"the empty hour" ^0
"  why no requests : the service was unreachable for " ^0
"    " + str(minutes_the_service_was_unreachable) + " minutes, and the load balancer shed the rest" ^0
"  what an outage looks like to a per-request SLO : an" ^0
"    hour with no misses" ^0
"  did availability enter this metric : no; it is over" ^0
"    served requests" ^0
"  is the SLO figure false : no; it is vacuously true" ^0
"" ^0

# ---- null control ----

# The same hour, with the SLO undefined when no requests are served and a
# separate availability check that fires on an empty window.
10000 => nc_slo_when_empty_reads_met
0 => nc_slo_when_empty_is_undefined
1 => nc_availability_alerts_on_empty

"null control - an empty window is not a met SLO" ^0
"  SLO when empty reads as met : " + str(nc_slo_when_empty_reads_met) ^0
"  SLO when empty is undefined : " + str(nc_slo_when_empty_is_undefined) ^0
"  availability alerts on an empty window : " ^0
"    " + str(nc_availability_alerts_on_empty) ^0
"  no request changed; an hour with no traffic stopped" ^0
"  counting as an hour that met its latency target" ^0
"" ^0

# ---- the rule ----

"what a met latency SLO guarantees" ^0
"  no served request exceeded the threshold : exactly," ^0
"    real requests, clock hour, budget armed" ^0
"  the service met its target : not addressed; the window" ^0
"    had no requests, and zero misses over zero requests is" ^0
"    vacuously 100 per hundred - the service was unreachable" ^0
"    " + str(minutes_the_service_was_unreachable) + " minutes and the metric fired no alert" ^0
"" ^0

"a per-request quality metric is silent when there are no requests, and silence" ^0
"reads as perfection; the hour a service serves no one is the hour its latency" ^0
"SLO looks best" ^0
"" ^0

"It counts real requests against the threshold over the clock hour and pages on" ^0
"a miss - 100 per hundred met. The hour had " + str(requests_in_the_hour) + " requests, so zero misses over" ^0
"zero is vacuously met while the service was unreachable " + str(minutes_the_service_was_unreachable) + " minutes, " ^0
"" + str(share_of_the_hour_unreachable_per_myriad) + " per ten thousand of it, under " + str(alerts_that_fired) + " alerts." ^0
```

## Python (deterministic transpilation)

```python
seconds_in_the_hour = 3600
requests_in_the_hour = 0
requests_over_the_threshold = 0
reported_slo_met_per_myriad = 10000
alerts_that_fired = 0
minutes_the_service_was_unreachable = 40
requests_under_the_threshold = requests_in_the_hour - requests_over_the_threshold
share_of_the_hour_unreachable_per_myriad = int(minutes_the_service_was_unreachable * 10000 / 60)
print("requests in the hour            : " + str(requests_in_the_hour))
print("  over the threshold            : " + str(requests_over_the_threshold))
print("  under the threshold           : " + str(requests_under_the_threshold))
print("reported SLO met                : " + str(reported_slo_met_per_myriad) + " per ten thousand")
print("alerts that fired               : " + str(alerts_that_fired))
print("minutes the service was unreachable : " + str(minutes_the_service_was_unreachable))
print("share of the hour unreachable   : " + str(share_of_the_hour_unreachable_per_myriad) + " per ten thousand")
print("")
print("the latency SLO")
print("  counts : real requests against the threshold")
print("  a slow request : counts as a miss")
print("  window : the clock hour, not a rolling one")
print("  pages when : the miss rate exceeds the budget")
print("  requests over the threshold : 0")
print("  verdict : 100 PER HUNDRED MET")
print("")
print("  counting real requests rather than a synthetic probe is")
print("  the part done right here, and it is why a real slow hour")
print("  would show")
print("")
print("met = (requests under threshold) / (requests)")
print("  requests this hour : " + str(requests_in_the_hour))
print("  misses this hour : " + str(requests_over_the_threshold))
print("  the ratio : zero over zero, reported as fully met")
print("  what '100 per hundred met' of no requests means : every")
print("    one of no requests was fast, trivially")
print("  what it does not mean : that the service served anyone")
print("")
print("the empty hour")
print("  why no requests : the service was unreachable for ")
print("    " + str(minutes_the_service_was_unreachable) + " minutes, and the load balancer shed the rest")
print("  what an outage looks like to a per-request SLO : an")
print("    hour with no misses")
print("  did availability enter this metric : no; it is over")
print("    served requests")
print("  is the SLO figure false : no; it is vacuously true")
print("")
nc_slo_when_empty_reads_met = 10000
nc_slo_when_empty_is_undefined = 0
nc_availability_alerts_on_empty = 1
print("null control - an empty window is not a met SLO")
print("  SLO when empty reads as met : " + str(nc_slo_when_empty_reads_met))
print("  SLO when empty is undefined : " + str(nc_slo_when_empty_is_undefined))
print("  availability alerts on an empty window : ")
print("    " + str(nc_availability_alerts_on_empty))
print("  no request changed; an hour with no traffic stopped")
print("  counting as an hour that met its latency target")
print("")
print("what a met latency SLO guarantees")
print("  no served request exceeded the threshold : exactly,")
print("    real requests, clock hour, budget armed")
print("  the service met its target : not addressed; the window")
print("    had no requests, and zero misses over zero requests is")
print("    vacuously 100 per hundred - the service was unreachable")
print("    " + str(minutes_the_service_was_unreachable) + " minutes and the metric fired no alert")
print("")
print("a per-request quality metric is silent when there are no requests, and silence")
print("reads as perfection; the hour a service serves no one is the hour its latency")
print("SLO looks best")
print("")
print("It counts real requests against the threshold over the clock hour and pages on")
print("a miss - 100 per hundred met. The hour had " + str(requests_in_the_hour) + " requests, so zero misses over")
print("zero is vacuously met while the service was unreachable " + str(minutes_the_service_was_unreachable) + " minutes, ")
print("" + str(share_of_the_hour_unreachable_per_myriad) + " per ten thousand of it, under " + str(alerts_that_fired) + " alerts.")
```

## stdout (executed)

```text
requests in the hour            : 0
  over the threshold            : 0
  under the threshold           : 0
reported SLO met                : 10000 per ten thousand
alerts that fired               : 0
minutes the service was unreachable : 40
share of the hour unreachable   : 6666 per ten thousand

the latency SLO
  counts : real requests against the threshold
  a slow request : counts as a miss
  window : the clock hour, not a rolling one
  pages when : the miss rate exceeds the budget
  requests over the threshold : 0
  verdict : 100 PER HUNDRED MET

  counting real requests rather than a synthetic probe is
  the part done right here, and it is why a real slow hour
  would show

met = (requests under threshold) / (requests)
  requests this hour : 0
  misses this hour : 0
  the ratio : zero over zero, reported as fully met
  what '100 per hundred met' of no requests means : every
    one of no requests was fast, trivially
  what it does not mean : that the service served anyone

the empty hour
  why no requests : the service was unreachable for 
    40 minutes, and the load balancer shed the rest
  what an outage looks like to a per-request SLO : an
    hour with no misses
  did availability enter this metric : no; it is over
    served requests
  is the SLO figure false : no; it is vacuously true

null control - an empty window is not a met SLO
  SLO when empty reads as met : 10000
  SLO when empty is undefined : 0
  availability alerts on an empty window : 
    1
  no request changed; an hour with no traffic stopped
  counting as an hour that met its latency target

what a met latency SLO guarantees
  no served request exceeded the threshold : exactly,
    real requests, clock hour, budget armed
  the service met its target : not addressed; the window
    had no requests, and zero misses over zero requests is
    vacuously 100 per hundred - the service was unreachable
    40 minutes and the metric fired no alert

a per-request quality metric is silent when there are no requests, and silence
reads as perfection; the hour a service serves no one is the hour its latency
SLO looks best

It counts real requests against the threshold over the clock hour and pages on
a miss - 100 per hundred met. The hour had 0 requests, so zero misses over
zero is vacuously met while the service was unreachable 40 minutes, 
6666 per ten thousand of it, under 0 alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
