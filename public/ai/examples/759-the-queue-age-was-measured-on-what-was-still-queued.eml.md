<!-- canonical: efficientnewlanguage.org/ai/examples/759-the-queue-age-was-measured-on-what-was-still-queued | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 759 — The queue age was measured on what was still queued

`the_queue_age_was_measured_on_what_was_still_queued.eml` - The queue's oldest message is sampled every ten seconds and pages above five minutes, and it has caught eleven real stalls. What it can report is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The queue's oldest
# message is sampled every ten seconds and pages above five minutes, and it has
# caught eleven real stalls. What it can report is computed below.
#
# The metric is the right one to have. It is not queue depth, which says nothing
# about whether anything is moving; it is the age of the oldest message, which
# is the quantity a consumer's latency actually depends on. It is sampled
# frequently enough to see a short stall, it pages rather than logging, and it
# has caught eleven stalls that would otherwise have been found by a customer.
#
# Messages carry a fifteen minute time to live and the broker deletes them when
# it expires. The oldest message in the queue therefore cannot be older than
# fifteen minutes, and once a stall passes that, the metric stops rising.
#
# The longest stall this year ran six hours.

10 => sample_interval_seconds
300 => alert_threshold_seconds
900 => message_ttl_seconds
11 => stalls_the_metric_caught
21600 => longest_stall_seconds
84000000 => messages_per_month
2400000 => messages_expired_unprocessed_last_month
0 => alerts_on_the_expiry_counter

longest_stall_seconds - message_ttl_seconds => seconds_the_metric_could_not_rise
int(message_ttl_seconds * 10000 / longest_stall_seconds) => rising_share_per_myriad
int(messages_expired_unprocessed_last_month * 10000 / messages_per_month) => expired_per_myriad
messages_per_month - messages_expired_unprocessed_last_month => messages_that_were_processed

"sample interval, seconds        : " + str(sample_interval_seconds) ^0
"alert threshold, seconds        : " + str(alert_threshold_seconds) ^0
"stalls the metric caught        : " + str(stalls_the_metric_caught) ^0
"" ^0
"message time to live, seconds   : " + str(message_ttl_seconds) ^0
"longest stall, seconds          : " + str(longest_stall_seconds) ^0
"  of which the metric could rise: " + str(message_ttl_seconds) ^0
"  of which it could not         : " + str(seconds_the_metric_could_not_rise) ^0
"  share of the stall it tracked : " + str(rising_share_per_myriad) + " per ten thousand" ^0
"" ^0
"messages per month              : " + str(messages_per_month) ^0
"  processed                     : " + str(messages_that_were_processed) ^0
"  expired unprocessed           : " + str(messages_expired_unprocessed_last_month) ^0
"  share                         : " + str(expired_per_myriad) + " per ten thousand" ^0
"alerts on the expiry counter    : " + str(alerts_on_the_expiry_counter) ^0
"" ^0

# ---- what the metric verified ----

"the oldest-message age" ^0
"  what it is not : queue depth, which says nothing about" ^0
"    whether anything is moving" ^0
"  what it is     : the quantity a consumer's latency" ^0
"    depends on" ^0
"  sampled every  : " + str(sample_interval_seconds) + " seconds, often enough for a short stall" ^0
"  on breach      : pages, does not log" ^0
"  stalls caught  : " + str(stalls_the_metric_caught) ^0
"  verdict : THE RIGHT QUANTITY" ^0
"" ^0
"  choosing age over depth is the decision that makes this" ^0
"  metric worth having, and it was made deliberately" ^0
"" ^0

# ---- what it is the age of ----

"the measured population" ^0
"  what it reads : the oldest message IN the queue" ^0
"  what leaves the queue without being read : anything" ^0
"    past " + str(message_ttl_seconds) + " seconds, deleted by the broker" ^0
"  so the maximum the metric can report : " + str(message_ttl_seconds) ^0
"  what happens after that in a stall : the oldest" ^0
"    messages expire and the metric FALLS" ^0
"  is the metric wrong : no; it reports the oldest thing" ^0
"    that is there" ^0
"" ^0
"  the quantity is right and the population it ranges over" ^0
"  is emptied by the same condition it is measuring" ^0
"" ^0

# ---- the shape of the six-hour stall ----

# For the first fifteen minutes the graph is exactly what it should be: a line
# climbing toward the threshold, an alert, a page. For the next five and three
# quarter hours it is a flat line at fifteen minutes, then a sawtooth.
"the graph during the longest stall" ^0
"  first " + str(message_ttl_seconds) + " seconds : climbs, alerts, pages" ^0
"  the remaining " + str(seconds_the_metric_could_not_rise) + " seconds : flat, then a sawtooth" ^0
"    as the oldest expire" ^0
"  what a responder reads from a flat line : it stopped" ^0
"    getting worse" ^0
"  what was happening : messages were being deleted at the" ^0
"    rate they arrived" ^0
"  share of the stall the metric could track : " ^0
"    " + str(rising_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- the number that was moving ----

"the expiry counter" ^0
"  does it exist : yes, the broker exports it" ^0
"  did it move during the stall : it was the only thing" ^0
"    that did" ^0
"  messages it counted last month : " + str(messages_expired_unprocessed_last_month) ^0
"  share of all messages : " + str(expired_per_myriad) + " per ten thousand" ^0
"  alerts on it : " + str(alerts_on_the_expiry_counter) ^0
"  which dashboard it is on : the broker's, not the" ^0
"    service's" ^0
"" ^0

# ---- null control ----

# The same age metric, plus an alert on the expiry counter, which measures the
# messages the age metric can no longer see.
1 => nc_alerts_on_the_expiry_counter
longest_stall_seconds => nc_seconds_of_the_stall_with_a_moving_signal

"null control - alert on what left the queue unread" ^0
"  oldest-message age : unchanged, still the right quantity" ^0
"  alerts on the expiry counter : " + str(nc_alerts_on_the_expiry_counter) ^0
"  seconds of the stall with a moving signal : " ^0
"    " + str(nc_seconds_of_the_stall_with_a_moving_signal) ^0
"  the age metric did not improve; a second one appeared" ^0
"  for the population the first one loses" ^0
"" ^0

# ---- the rule ----

"what an oldest-message age guarantees" ^0
"  the oldest message present is this old : exactly, every" ^0
"    " + str(sample_interval_seconds) + " seconds, and it caught " + str(stalls_the_metric_caught) + " real stalls" ^0
"  the backlog is this old : not addressed; the metric" ^0
"    ranges over what is still there, and a time to live" ^0
"    removes the evidence at a fixed age" ^0
"" ^0
"a maximum over a population is bounded by whatever bounds" ^0
"the population; where the same condition that raises the" ^0
"measurement also empties the set, the measurement stops at" ^0
"the ceiling and then reports improvement" ^0
"" ^0

"The metric is the right quantity - age rather than depth, sampled every " + str(sample_interval_seconds) ^0
"seconds, paging rather than logging, " + str(stalls_the_metric_caught) + " real stalls caught. It reads the oldest" ^0
"message still in the queue, and a " + str(message_ttl_seconds) + " second time to live deletes them, so of a" ^0
str(longest_stall_seconds) + " second stall it could track " + str(message_ttl_seconds) + " - " + str(rising_share_per_myriad) + " per ten thousand - while" ^0
str(messages_expired_unprocessed_last_month) + " messages a month leave unread under " + str(alerts_on_the_expiry_counter) + " alerts." ^0
```

## Python (deterministic transpilation)

```python
sample_interval_seconds = 10
alert_threshold_seconds = 300
message_ttl_seconds = 900
stalls_the_metric_caught = 11
longest_stall_seconds = 21600
messages_per_month = 84000000
messages_expired_unprocessed_last_month = 2400000
alerts_on_the_expiry_counter = 0
seconds_the_metric_could_not_rise = longest_stall_seconds - message_ttl_seconds
rising_share_per_myriad = int(message_ttl_seconds * 10000 / longest_stall_seconds)
expired_per_myriad = int(messages_expired_unprocessed_last_month * 10000 / messages_per_month)
messages_that_were_processed = messages_per_month - messages_expired_unprocessed_last_month
print("sample interval, seconds        : " + str(sample_interval_seconds))
print("alert threshold, seconds        : " + str(alert_threshold_seconds))
print("stalls the metric caught        : " + str(stalls_the_metric_caught))
print("")
print("message time to live, seconds   : " + str(message_ttl_seconds))
print("longest stall, seconds          : " + str(longest_stall_seconds))
print("  of which the metric could rise: " + str(message_ttl_seconds))
print("  of which it could not         : " + str(seconds_the_metric_could_not_rise))
print("  share of the stall it tracked : " + str(rising_share_per_myriad) + " per ten thousand")
print("")
print("messages per month              : " + str(messages_per_month))
print("  processed                     : " + str(messages_that_were_processed))
print("  expired unprocessed           : " + str(messages_expired_unprocessed_last_month))
print("  share                         : " + str(expired_per_myriad) + " per ten thousand")
print("alerts on the expiry counter    : " + str(alerts_on_the_expiry_counter))
print("")
print("the oldest-message age")
print("  what it is not : queue depth, which says nothing about")
print("    whether anything is moving")
print("  what it is     : the quantity a consumer's latency")
print("    depends on")
print("  sampled every  : " + str(sample_interval_seconds) + " seconds, often enough for a short stall")
print("  on breach      : pages, does not log")
print("  stalls caught  : " + str(stalls_the_metric_caught))
print("  verdict : THE RIGHT QUANTITY")
print("")
print("  choosing age over depth is the decision that makes this")
print("  metric worth having, and it was made deliberately")
print("")
print("the measured population")
print("  what it reads : the oldest message IN the queue")
print("  what leaves the queue without being read : anything")
print("    past " + str(message_ttl_seconds) + " seconds, deleted by the broker")
print("  so the maximum the metric can report : " + str(message_ttl_seconds))
print("  what happens after that in a stall : the oldest")
print("    messages expire and the metric FALLS")
print("  is the metric wrong : no; it reports the oldest thing")
print("    that is there")
print("")
print("  the quantity is right and the population it ranges over")
print("  is emptied by the same condition it is measuring")
print("")
print("the graph during the longest stall")
print("  first " + str(message_ttl_seconds) + " seconds : climbs, alerts, pages")
print("  the remaining " + str(seconds_the_metric_could_not_rise) + " seconds : flat, then a sawtooth")
print("    as the oldest expire")
print("  what a responder reads from a flat line : it stopped")
print("    getting worse")
print("  what was happening : messages were being deleted at the")
print("    rate they arrived")
print("  share of the stall the metric could track : ")
print("    " + str(rising_share_per_myriad) + " per ten thousand")
print("")
print("the expiry counter")
print("  does it exist : yes, the broker exports it")
print("  did it move during the stall : it was the only thing")
print("    that did")
print("  messages it counted last month : " + str(messages_expired_unprocessed_last_month))
print("  share of all messages : " + str(expired_per_myriad) + " per ten thousand")
print("  alerts on it : " + str(alerts_on_the_expiry_counter))
print("  which dashboard it is on : the broker's, not the")
print("    service's")
print("")
nc_alerts_on_the_expiry_counter = 1
nc_seconds_of_the_stall_with_a_moving_signal = longest_stall_seconds
print("null control - alert on what left the queue unread")
print("  oldest-message age : unchanged, still the right quantity")
print("  alerts on the expiry counter : " + str(nc_alerts_on_the_expiry_counter))
print("  seconds of the stall with a moving signal : ")
print("    " + str(nc_seconds_of_the_stall_with_a_moving_signal))
print("  the age metric did not improve; a second one appeared")
print("  for the population the first one loses")
print("")
print("what an oldest-message age guarantees")
print("  the oldest message present is this old : exactly, every")
print("    " + str(sample_interval_seconds) + " seconds, and it caught " + str(stalls_the_metric_caught) + " real stalls")
print("  the backlog is this old : not addressed; the metric")
print("    ranges over what is still there, and a time to live")
print("    removes the evidence at a fixed age")
print("")
print("a maximum over a population is bounded by whatever bounds")
print("the population; where the same condition that raises the")
print("measurement also empties the set, the measurement stops at")
print("the ceiling and then reports improvement")
print("")
print("The metric is the right quantity - age rather than depth, sampled every " + str(sample_interval_seconds))
print("seconds, paging rather than logging, " + str(stalls_the_metric_caught) + " real stalls caught. It reads the oldest")
print("message still in the queue, and a " + str(message_ttl_seconds) + " second time to live deletes them, so of a")
print(str(longest_stall_seconds) + " second stall it could track " + str(message_ttl_seconds) + " - " + str(rising_share_per_myriad) + " per ten thousand - while")
print(str(messages_expired_unprocessed_last_month) + " messages a month leave unread under " + str(alerts_on_the_expiry_counter) + " alerts.")
```

## stdout (executed)

```text
sample interval, seconds        : 10
alert threshold, seconds        : 300
stalls the metric caught        : 11

message time to live, seconds   : 900
longest stall, seconds          : 21600
  of which the metric could rise: 900
  of which it could not         : 20700
  share of the stall it tracked : 416 per ten thousand

messages per month              : 84000000
  processed                     : 81600000
  expired unprocessed           : 2400000
  share                         : 285 per ten thousand
alerts on the expiry counter    : 0

the oldest-message age
  what it is not : queue depth, which says nothing about
    whether anything is moving
  what it is     : the quantity a consumer's latency
    depends on
  sampled every  : 10 seconds, often enough for a short stall
  on breach      : pages, does not log
  stalls caught  : 11
  verdict : THE RIGHT QUANTITY

  choosing age over depth is the decision that makes this
  metric worth having, and it was made deliberately

the measured population
  what it reads : the oldest message IN the queue
  what leaves the queue without being read : anything
    past 900 seconds, deleted by the broker
  so the maximum the metric can report : 900
  what happens after that in a stall : the oldest
    messages expire and the metric FALLS
  is the metric wrong : no; it reports the oldest thing
    that is there

  the quantity is right and the population it ranges over
  is emptied by the same condition it is measuring

the graph during the longest stall
  first 900 seconds : climbs, alerts, pages
  the remaining 20700 seconds : flat, then a sawtooth
    as the oldest expire
  what a responder reads from a flat line : it stopped
    getting worse
  what was happening : messages were being deleted at the
    rate they arrived
  share of the stall the metric could track : 
    416 per ten thousand

the expiry counter
  does it exist : yes, the broker exports it
  did it move during the stall : it was the only thing
    that did
  messages it counted last month : 2400000
  share of all messages : 285 per ten thousand
  alerts on it : 0
  which dashboard it is on : the broker's, not the
    service's

null control - alert on what left the queue unread
  oldest-message age : unchanged, still the right quantity
  alerts on the expiry counter : 1
  seconds of the stall with a moving signal : 
    21600
  the age metric did not improve; a second one appeared
  for the population the first one loses

what an oldest-message age guarantees
  the oldest message present is this old : exactly, every
    10 seconds, and it caught 11 real stalls
  the backlog is this old : not addressed; the metric
    ranges over what is still there, and a time to live
    removes the evidence at a fixed age

a maximum over a population is bounded by whatever bounds
the population; where the same condition that raises the
measurement also empties the set, the measurement stops at
the ceiling and then reports improvement

The metric is the right quantity - age rather than depth, sampled every 10
seconds, paging rather than logging, 11 real stalls caught. It reads the oldest
message still in the queue, and a 900 second time to live deletes them, so of a
21600 second stall it could track 900 - 416 per ten thousand - while
2400000 messages a month leave unread under 0 alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
