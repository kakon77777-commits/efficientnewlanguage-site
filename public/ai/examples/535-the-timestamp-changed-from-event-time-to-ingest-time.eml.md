<!-- canonical: efficientnewlanguage.org/ai/examples/535-the-timestamp-changed-from-event-time-to-ingest-time | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 535 — The timestamp changed from event time to ingest time

`the_timestamp_changed_from_event_time_to_ingest_time.eml` - A field called occurred_at changed from the time the event happened to the time the pipeline received it. Same name, same type, same format. What moved is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A field called
# occurred_at changed from the time the event happened to the time the pipeline
# received it. Same name, same type, same format. What moved is computed below.
#
# The change was made for a good reason. Producers were sending clock-skewed
# event times, some of them from user devices, and 3% of events arrived dated
# in the future. Stamping at ingest gives a monotonic, trustworthy value that
# nothing upstream can corrupt, and the team that did it wrote a design note.
#
# Ingest time and event time are the same number whenever the pipeline is
# keeping up. They diverge exactly when it is not. So the field agrees with
# its old meaning on every ordinary day, and stops agreeing precisely on the
# days anybody looks at it closely.
#
# Both quantities are carried, per hour of one backlog day.

# [hour, events, minutes of pipeline lag, events dated into the next hour by ingest stamping]
[["09", 41000, 0, 0], ["10", 44000, 0, 0], ["11", 46000, 4, 3000], ["12", 52000, 31, 26000], ["13", 58000, 74, 58000], ["14", 55000, 92, 55000], ["15", 47000, 40, 31000], ["16", 43000, 6, 4000]] => hours

len(hours) => n
0 => total
0 => misdated
for h in hours:
    total + h[1] => total
    misdated + h[3] => misdated

"hour   events   pipeline lag   events stamped into a later hour" ^0
for h in hours:
    "  " + h[0] + "     " + str(h[1]) + "    " + str(h[2]) + " min        " + str(h[3]) ^0
"" ^0
"events that day        : " + str(total) ^0
"stamped into the wrong hour : " + str(misdated) + ", " + str(int(misdated * 100 / total)) + "%" ^0
"" ^0

# ---- when the two meanings agree ----

0 => agree_hours
for h in hours:
    if h[2] == 0:
        agree_hours + 1 => agree_hours
"hours in which the two meanings coincide" ^0
"  lag zero : " + str(agree_hours) + " of " + str(n) ^0
"  on those hours the field is identical under either definition" ^0
"  on the other " + str(n - agree_hours) + " it is not, and those are the hours with a backlog" ^0
"" ^0

# ---- what each consumer computes ----

"the hourly volume chart, both ways" ^0
"hour   by event time   by ingest time   difference" ^0
0 => prev_spill
for h in hours:
    h[1] - h[3] + prev_spill => by_ingest
    "  " + h[0] + "     " + str(h[1]) + "         " + str(by_ingest) + "        " + str(by_ingest - h[1]) ^0
    h[3] => prev_spill
"  the chart is smooth under both definitions and it is a different chart" ^0
"" ^0

# ---- the alert that reads it ----

50000 => alert_threshold
"an alert fires when an hour exceeds " + str(alert_threshold) + " events" ^0
0 => fires_event
0 => fires_ingest
0 => spill
for h in hours:
    if h[1] > alert_threshold:
        fires_event + 1 => fires_event
    h[1] - h[3] + spill => by_ingest
    if by_ingest > alert_threshold:
        fires_ingest + 1 => fires_ingest
    h[3] => spill
"  hours over the bar by event time  : " + str(fires_event) ^0
"  hours over the bar by ingest time : " + str(fires_ingest) ^0
"  same data, same threshold, same field name" ^0
"" ^0

# ---- the retention rule ----

"records are deleted 90 days after occurred_at" ^0
"  under event time  : 90 days after the thing happened" ^0
"  under ingest time : 90 days after we received it" ^0
"  for an event delayed " + str(hours[4][2]) + " minutes the difference is negligible" ^0
"  for a replayed backfill the difference is the age of the backfill" ^0
"  so a re-ingest of two-year-old data resets its deletion clock, and the" ^0
"  retention rule has no way to notice" ^0
"" ^0

# ---- what the change did and did not do ----

"the problem it solved" ^0
"  events dated in the future : 3% before, 0 after" ^0
"  clock skew from user devices : no longer reaches any consumer" ^0
"  monotonic ordering : guaranteed, which it was not before" ^0
"  all three of those are real and none of them came back" ^0
"" ^0
"what a consumer would need to notice" ^0
"  field name change : none" ^0
"  type change       : none" ^0
"  new field carrying the old meaning : not added" ^0
"  design note : written, and read by the two people in the review" ^0
"  consumers of this field : 11" ^0
"" ^0

# ---- the fix that keeps both ----

"carrying both stamps" ^0
"  occurred_at : event time, as the name says, skew and all" ^0
"  ingested_at : pipeline time, monotonic and trustworthy" ^0
"  bytes added per record : 8" ^0
"  bytes a day : " + str(total * 8) ^0
"  consumers that would then be choosing rather than inheriting : 11" ^0
"  the skew problem is solved by which field the ordering uses, not by" ^0
"  redefining the one that was already named after the other thing" ^0
"" ^0

# ---- the control: a field renamed with its meaning ----
#
# Where the new meaning got a new name, every consumer had to say which one it
# wanted, and the ones that did nothing kept the old behaviour.

[["received_at", 11, 11, 0]] => renamed
for r in renamed:
    "control - the same change shipped as a new field " + r[0] ^0
    "  consumers : " + str(r[1]) ^0
    "  consumers that had to make a choice : " + str(r[2]) ^0
    "  consumers that silently changed behaviour : " + str(r[3]) ^0
    "  the identical semantic change, and the rename is what converts a" ^0
    "  silent shift into a decision somebody makes" ^0
"" ^0

"Stamping at ingest removed real clock skew and 3% future-dated events." ^0
"The two meanings agree whenever the pipeline keeps up, so the field only" ^0
"disagrees with its own name on the " + str(n - agree_hours) + " hours anybody would investigate." ^0
```

## Python (deterministic transpilation)

```python
hours = [["09", 41000, 0, 0], ["10", 44000, 0, 0], ["11", 46000, 4, 3000], ["12", 52000, 31, 26000], ["13", 58000, 74, 58000], ["14", 55000, 92, 55000], ["15", 47000, 40, 31000], ["16", 43000, 6, 4000]]
n = len(hours)
total = 0
misdated = 0
for h in hours:
    total = total + h[1]
    misdated = misdated + h[3]
print("hour   events   pipeline lag   events stamped into a later hour")
for h in hours:
    print("  " + h[0] + "     " + str(h[1]) + "    " + str(h[2]) + " min        " + str(h[3]))
print("")
print("events that day        : " + str(total))
print("stamped into the wrong hour : " + str(misdated) + ", " + str(int(misdated * 100 / total)) + "%")
print("")
agree_hours = 0
for h in hours:
    if h[2] == 0:
        agree_hours = agree_hours + 1
print("hours in which the two meanings coincide")
print("  lag zero : " + str(agree_hours) + " of " + str(n))
print("  on those hours the field is identical under either definition")
print("  on the other " + str(n - agree_hours) + " it is not, and those are the hours with a backlog")
print("")
print("the hourly volume chart, both ways")
print("hour   by event time   by ingest time   difference")
prev_spill = 0
for h in hours:
    by_ingest = h[1] - h[3] + prev_spill
    print("  " + h[0] + "     " + str(h[1]) + "         " + str(by_ingest) + "        " + str(by_ingest - h[1]))
    prev_spill = h[3]
print("  the chart is smooth under both definitions and it is a different chart")
print("")
alert_threshold = 50000
print("an alert fires when an hour exceeds " + str(alert_threshold) + " events")
fires_event = 0
fires_ingest = 0
spill = 0
for h in hours:
    if h[1] > alert_threshold:
        fires_event = fires_event + 1
    by_ingest = h[1] - h[3] + spill
    if by_ingest > alert_threshold:
        fires_ingest = fires_ingest + 1
    spill = h[3]
print("  hours over the bar by event time  : " + str(fires_event))
print("  hours over the bar by ingest time : " + str(fires_ingest))
print("  same data, same threshold, same field name")
print("")
print("records are deleted 90 days after occurred_at")
print("  under event time  : 90 days after the thing happened")
print("  under ingest time : 90 days after we received it")
print("  for an event delayed " + str(hours[4][2]) + " minutes the difference is negligible")
print("  for a replayed backfill the difference is the age of the backfill")
print("  so a re-ingest of two-year-old data resets its deletion clock, and the")
print("  retention rule has no way to notice")
print("")
print("the problem it solved")
print("  events dated in the future : 3% before, 0 after")
print("  clock skew from user devices : no longer reaches any consumer")
print("  monotonic ordering : guaranteed, which it was not before")
print("  all three of those are real and none of them came back")
print("")
print("what a consumer would need to notice")
print("  field name change : none")
print("  type change       : none")
print("  new field carrying the old meaning : not added")
print("  design note : written, and read by the two people in the review")
print("  consumers of this field : 11")
print("")
print("carrying both stamps")
print("  occurred_at : event time, as the name says, skew and all")
print("  ingested_at : pipeline time, monotonic and trustworthy")
print("  bytes added per record : 8")
print("  bytes a day : " + str(total * 8))
print("  consumers that would then be choosing rather than inheriting : 11")
print("  the skew problem is solved by which field the ordering uses, not by")
print("  redefining the one that was already named after the other thing")
print("")
renamed = [["received_at", 11, 11, 0]]
for r in renamed:
    print("control - the same change shipped as a new field " + r[0])
    print("  consumers : " + str(r[1]))
    print("  consumers that had to make a choice : " + str(r[2]))
    print("  consumers that silently changed behaviour : " + str(r[3]))
    print("  the identical semantic change, and the rename is what converts a")
    print("  silent shift into a decision somebody makes")
print("")
print("Stamping at ingest removed real clock skew and 3% future-dated events.")
print("The two meanings agree whenever the pipeline keeps up, so the field only")
print("disagrees with its own name on the " + str(n - agree_hours) + " hours anybody would investigate.")
```

## stdout (executed)

```text
hour   events   pipeline lag   events stamped into a later hour
  09     41000    0 min        0
  10     44000    0 min        0
  11     46000    4 min        3000
  12     52000    31 min        26000
  13     58000    74 min        58000
  14     55000    92 min        55000
  15     47000    40 min        31000
  16     43000    6 min        4000

events that day        : 386000
stamped into the wrong hour : 177000, 45%

hours in which the two meanings coincide
  lag zero : 2 of 8
  on those hours the field is identical under either definition
  on the other 6 it is not, and those are the hours with a backlog

the hourly volume chart, both ways
hour   by event time   by ingest time   difference
  09     41000         41000        0
  10     44000         44000        0
  11     46000         43000        -3000
  12     52000         29000        -23000
  13     58000         26000        -32000
  14     55000         58000        3000
  15     47000         71000        24000
  16     43000         70000        27000
  the chart is smooth under both definitions and it is a different chart

an alert fires when an hour exceeds 50000 events
  hours over the bar by event time  : 3
  hours over the bar by ingest time : 3
  same data, same threshold, same field name

records are deleted 90 days after occurred_at
  under event time  : 90 days after the thing happened
  under ingest time : 90 days after we received it
  for an event delayed 74 minutes the difference is negligible
  for a replayed backfill the difference is the age of the backfill
  so a re-ingest of two-year-old data resets its deletion clock, and the
  retention rule has no way to notice

the problem it solved
  events dated in the future : 3% before, 0 after
  clock skew from user devices : no longer reaches any consumer
  monotonic ordering : guaranteed, which it was not before
  all three of those are real and none of them came back

what a consumer would need to notice
  field name change : none
  type change       : none
  new field carrying the old meaning : not added
  design note : written, and read by the two people in the review
  consumers of this field : 11

carrying both stamps
  occurred_at : event time, as the name says, skew and all
  ingested_at : pipeline time, monotonic and trustworthy
  bytes added per record : 8
  bytes a day : 3088000
  consumers that would then be choosing rather than inheriting : 11
  the skew problem is solved by which field the ordering uses, not by
  redefining the one that was already named after the other thing

control - the same change shipped as a new field received_at
  consumers : 11
  consumers that had to make a choice : 11
  consumers that silently changed behaviour : 0
  the identical semantic change, and the rename is what converts a
  silent shift into a decision somebody makes

Stamping at ingest removed real clock skew and 3% future-dated events.
The two meanings agree whenever the pipeline keeps up, so the field only
disagrees with its own name on the 6 hours anybody would investigate.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
