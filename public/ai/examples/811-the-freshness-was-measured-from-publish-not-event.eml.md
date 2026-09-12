<!-- canonical: efficientnewlanguage.org/ai/examples/811-the-freshness-was-measured-from-publish-not-event | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 811 — The freshness was measured from publish not event

`the_freshness_was_measured_from_publish_not_event.eml` - The dashboard data has been under its three-second freshness SLA all quarter, and the number is real. What instant freshness is measured from is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The dashboard data
# has been under its three-second freshness SLA all quarter, and the number is
# real. What instant freshness is measured from is computed below.
#
# The freshness metric is honest about the pipeline. It times from when the
# record was published to when it is read; it uses a monotonic clock so the
# figure cannot go negative; it is measured on every read, not sampled; and the
# SLA is enforced with an alert.
#
# Freshness is measured from publish time, and the source lags publish.

3 => publish_to_read_seconds
60 => freshness_sla_seconds
1800 => event_to_publish_lag_seconds

publish_to_read_seconds + event_to_publish_lag_seconds => event_to_read_seconds
event_to_read_seconds - publish_to_read_seconds => age_the_metric_cannot_see_seconds
freshness_sla_seconds - publish_to_read_seconds => headroom_the_metric_shows_seconds
event_to_read_seconds - freshness_sla_seconds => amount_the_true_age_is_over_sla_seconds

"publish-to-read                 : " + str(publish_to_read_seconds) + " seconds" ^0
"freshness SLA                   : " + str(freshness_sla_seconds) + " seconds" ^0
"  headroom the metric shows     : " + str(headroom_the_metric_shows_seconds) + " seconds" ^0
"" ^0
"event-to-publish lag            : " + str(event_to_publish_lag_seconds) + " seconds" ^0
"event-to-read (true age)        : " + str(event_to_read_seconds) + " seconds" ^0
"  age the metric cannot see     : " + str(age_the_metric_cannot_see_seconds) + " seconds" ^0
"  true age over the SLA by      : " + str(amount_the_true_age_is_over_sla_seconds) + " seconds" ^0
"" ^0

# ---- what the freshness metric verified ----

"the freshness metric" ^0
"  times from : publish to read" ^0
"  clock : monotonic, cannot go negative" ^0
"  measured on : every read, not sampled" ^0
"  enforced by : an alert on the SLA" ^0
"  reads inside the SLA : all of them" ^0
"  verdict : FRESH" ^0
"" ^0
"  measuring on every read rather than sampling is the" ^0
"  part done right here, and it is why the three seconds is" ^0
"  not a lucky sample" ^0
"" ^0

# ---- what instant it starts from ----

"the clock's start point" ^0
"  when the timer starts : at publish" ^0
"  when the event happened : " + str(event_to_publish_lag_seconds) + " seconds before publish" ^0
"  what the pipeline's own speed measures : the pipeline," ^0
"    not the world" ^0
"  so a fast pipeline on stale input : reads as fresh" ^0
"  the age nobody is timing : " + str(age_the_metric_cannot_see_seconds) + " seconds" ^0
"" ^0

# ---- what a decision on the data sees ----

"the action taken on the dashboard" ^0
"  what it assumes : the data is " + str(publish_to_read_seconds) + " seconds old" ^0
"  what it is acting on : a " + str(event_to_read_seconds) + "-second-old world" ^0
"  over the SLA the action trusts by : " ^0
"    " + str(amount_the_true_age_is_over_sla_seconds) + " seconds" ^0
"  is the freshness figure wrong : no; publish-to-read is" ^0
"    exactly three seconds" ^0
"  is it the age the decision needs : no" ^0
"" ^0

# ---- null control ----

# The same reads, with freshness timed from the event timestamp carried on each
# record rather than from publish time.
3 => nc_publish_based_seconds
1803 => nc_event_based_seconds
1 => nc_sla_breaches_it_would_show

"null control - time from the event, not from publish" ^0
"  publish-based freshness : " + str(nc_publish_based_seconds) + " seconds, unchanged" ^0
"  event-based freshness : " + str(nc_event_based_seconds) + " seconds" ^0
"  SLA breaches it would show : " + str(nc_sla_breaches_it_would_show) ^0
"  no record and no clock changed; the start point moved" ^0
"  from when the pipeline emitted to when the world acted" ^0
"" ^0

# ---- the rule ----

"what a met freshness SLA guarantees" ^0
"  the record is read soon after it is published : exactly," ^0
"    " + str(publish_to_read_seconds) + " seconds, monotonic, every read, alerted" ^0
"  the data reflects a recent world : not addressed; age is" ^0
"    measured from publish, and the source lags publish by" ^0
"    " + str(event_to_publish_lag_seconds) + " seconds, so an event is " + str(event_to_read_seconds) + " seconds old when" ^0
"    it looks " + str(publish_to_read_seconds) ^0
"" ^0

"freshness is an interval, and an interval is only as good as the instant it" ^0
"starts from; timing from publish measures how fast the pipeline forgets, not" ^0
"how recently the world was seen" ^0
"" ^0

"It times publish-to-read on a monotonic clock, every read, alerted - " + str(publish_to_read_seconds) + " seconds," ^0
"under SLA. The clock starts at publish, which lags the event by " + str(event_to_publish_lag_seconds) + " seconds, so" ^0
"the data acted on is " + str(event_to_read_seconds) + " seconds old - " + str(amount_the_true_age_is_over_sla_seconds) + " over the SLA - while the metric" ^0
"reads " + str(publish_to_read_seconds) + "." ^0
```

## Python (deterministic transpilation)

```python
publish_to_read_seconds = 3
freshness_sla_seconds = 60
event_to_publish_lag_seconds = 1800
event_to_read_seconds = publish_to_read_seconds + event_to_publish_lag_seconds
age_the_metric_cannot_see_seconds = event_to_read_seconds - publish_to_read_seconds
headroom_the_metric_shows_seconds = freshness_sla_seconds - publish_to_read_seconds
amount_the_true_age_is_over_sla_seconds = event_to_read_seconds - freshness_sla_seconds
print("publish-to-read                 : " + str(publish_to_read_seconds) + " seconds")
print("freshness SLA                   : " + str(freshness_sla_seconds) + " seconds")
print("  headroom the metric shows     : " + str(headroom_the_metric_shows_seconds) + " seconds")
print("")
print("event-to-publish lag            : " + str(event_to_publish_lag_seconds) + " seconds")
print("event-to-read (true age)        : " + str(event_to_read_seconds) + " seconds")
print("  age the metric cannot see     : " + str(age_the_metric_cannot_see_seconds) + " seconds")
print("  true age over the SLA by      : " + str(amount_the_true_age_is_over_sla_seconds) + " seconds")
print("")
print("the freshness metric")
print("  times from : publish to read")
print("  clock : monotonic, cannot go negative")
print("  measured on : every read, not sampled")
print("  enforced by : an alert on the SLA")
print("  reads inside the SLA : all of them")
print("  verdict : FRESH")
print("")
print("  measuring on every read rather than sampling is the")
print("  part done right here, and it is why the three seconds is")
print("  not a lucky sample")
print("")
print("the clock's start point")
print("  when the timer starts : at publish")
print("  when the event happened : " + str(event_to_publish_lag_seconds) + " seconds before publish")
print("  what the pipeline's own speed measures : the pipeline,")
print("    not the world")
print("  so a fast pipeline on stale input : reads as fresh")
print("  the age nobody is timing : " + str(age_the_metric_cannot_see_seconds) + " seconds")
print("")
print("the action taken on the dashboard")
print("  what it assumes : the data is " + str(publish_to_read_seconds) + " seconds old")
print("  what it is acting on : a " + str(event_to_read_seconds) + "-second-old world")
print("  over the SLA the action trusts by : ")
print("    " + str(amount_the_true_age_is_over_sla_seconds) + " seconds")
print("  is the freshness figure wrong : no; publish-to-read is")
print("    exactly three seconds")
print("  is it the age the decision needs : no")
print("")
nc_publish_based_seconds = 3
nc_event_based_seconds = 1803
nc_sla_breaches_it_would_show = 1
print("null control - time from the event, not from publish")
print("  publish-based freshness : " + str(nc_publish_based_seconds) + " seconds, unchanged")
print("  event-based freshness : " + str(nc_event_based_seconds) + " seconds")
print("  SLA breaches it would show : " + str(nc_sla_breaches_it_would_show))
print("  no record and no clock changed; the start point moved")
print("  from when the pipeline emitted to when the world acted")
print("")
print("what a met freshness SLA guarantees")
print("  the record is read soon after it is published : exactly,")
print("    " + str(publish_to_read_seconds) + " seconds, monotonic, every read, alerted")
print("  the data reflects a recent world : not addressed; age is")
print("    measured from publish, and the source lags publish by")
print("    " + str(event_to_publish_lag_seconds) + " seconds, so an event is " + str(event_to_read_seconds) + " seconds old when")
print("    it looks " + str(publish_to_read_seconds))
print("")
print("freshness is an interval, and an interval is only as good as the instant it")
print("starts from; timing from publish measures how fast the pipeline forgets, not")
print("how recently the world was seen")
print("")
print("It times publish-to-read on a monotonic clock, every read, alerted - " + str(publish_to_read_seconds) + " seconds,")
print("under SLA. The clock starts at publish, which lags the event by " + str(event_to_publish_lag_seconds) + " seconds, so")
print("the data acted on is " + str(event_to_read_seconds) + " seconds old - " + str(amount_the_true_age_is_over_sla_seconds) + " over the SLA - while the metric")
print("reads " + str(publish_to_read_seconds) + ".")
```

## stdout (executed)

```text
publish-to-read                 : 3 seconds
freshness SLA                   : 60 seconds
  headroom the metric shows     : 57 seconds

event-to-publish lag            : 1800 seconds
event-to-read (true age)        : 1803 seconds
  age the metric cannot see     : 1800 seconds
  true age over the SLA by      : 1743 seconds

the freshness metric
  times from : publish to read
  clock : monotonic, cannot go negative
  measured on : every read, not sampled
  enforced by : an alert on the SLA
  reads inside the SLA : all of them
  verdict : FRESH

  measuring on every read rather than sampling is the
  part done right here, and it is why the three seconds is
  not a lucky sample

the clock's start point
  when the timer starts : at publish
  when the event happened : 1800 seconds before publish
  what the pipeline's own speed measures : the pipeline,
    not the world
  so a fast pipeline on stale input : reads as fresh
  the age nobody is timing : 1800 seconds

the action taken on the dashboard
  what it assumes : the data is 3 seconds old
  what it is acting on : a 1803-second-old world
  over the SLA the action trusts by : 
    1743 seconds
  is the freshness figure wrong : no; publish-to-read is
    exactly three seconds
  is it the age the decision needs : no

null control - time from the event, not from publish
  publish-based freshness : 3 seconds, unchanged
  event-based freshness : 1803 seconds
  SLA breaches it would show : 1
  no record and no clock changed; the start point moved
  from when the pipeline emitted to when the world acted

what a met freshness SLA guarantees
  the record is read soon after it is published : exactly,
    3 seconds, monotonic, every read, alerted
  the data reflects a recent world : not addressed; age is
    measured from publish, and the source lags publish by
    1800 seconds, so an event is 1803 seconds old when
    it looks 3

freshness is an interval, and an interval is only as good as the instant it
starts from; timing from publish measures how fast the pipeline forgets, not
how recently the world was seen

It times publish-to-read on a monotonic clock, every read, alerted - 3 seconds,
under SLA. The clock starts at publish, which lags the event by 1800 seconds, so
the data acted on is 1803 seconds old - 1743 over the SLA - while the metric
reads 3.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
