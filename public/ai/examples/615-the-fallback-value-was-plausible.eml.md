<!-- canonical: efficientnewlanguage.org/ai/examples/615-the-fallback-value-was-plausible | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 615 — The fallback value was plausible

`the_fallback_value_was_plausible.eml` - When a sensor does not answer, the reader returns the last known value. The dashboard shows a steady line. What a steady line means here is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). When a sensor
# does not answer, the reader returns the last known value. The dashboard shows
# a steady line. What a steady line means here is computed below.
#
# Returning the last value is correct and it was chosen against the
# alternatives. Returning an error propagates a transient network blip into a
# page that will not render; returning zero puts a number into the average that
# is not a temperature; returning null makes every consumer handle absence, and
# they will handle it differently. Last-known is the least wrong of four
# options and somebody thought about all four.
#
# A fallback is a value with a different provenance and the same type. The one
# thing this fallback lacks is any way to be recognised as one, because it is a
# reading that was true, only not now.
#
# So a dead sensor and a stable one produce the same output, and the more
# stable the process being measured, the less anybody can tell.

96 => sensors
2880 => readings_per_sensor_per_day
7 => dead_sensors
41 => hours_dead

sensors * readings_per_sensor_per_day => readings_per_day
# Two windows, kept apart. A dead sensor substitutes every one of its
# readings, so the DAILY figure is its full daily count; the 41-hour
# figure is the running total since they went silent. Dividing the second
# by a one-day denominator compares 41 hours against 24 and inflates the
# share by the ratio of the windows.
readings_per_sensor_per_day * dead_sensors => substituted_readings
int(readings_per_sensor_per_day * hours_dead / 24) * dead_sensors => substituted_since_silent

"sensors                    : " + str(sensors) ^0
"readings per sensor per day: " + str(readings_per_sensor_per_day) ^0
"readings per day           : " + str(readings_per_day) ^0
"sensors not responding     : " + str(dead_sensors) ^0
"hours they have been dead  : " + str(hours_dead) ^0
"" ^0

# ---- what is on the dashboard ----

"the readings" ^0
"  measured                 : " + str(readings_per_day - substituted_readings) ^0
"  substituted, per day     : " + str(substituted_readings) ^0
"  substituted since silent : " + str(substituted_since_silent) + " over " + str(hours_dead) + " hours" ^0
"  marked as substituted    : 0" ^0
"  distinguishable by type  : no, both are integers" ^0
"  distinguishable by range : no, the last value was in range" ^0
"" ^0
int(substituted_readings * 10000 / readings_per_day) => substituted_per_myriad
"  share substituted : " + str(substituted_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what a dead sensor looks like ----

"sensor state      what the dashboard shows" ^0
"  healthy, stable   a flat line" ^0
"  dead              a flat line" ^0
"  healthy, drifting a moving line" ^0
"" ^0
"  the first two rows are the same picture, and the difference" ^0
"  between them is the whole question" ^0
"" ^0

# ---- the alert that watches for a stuck sensor ----
#
# There is one, and it is the right idea: a reading that has not moved for a
# long time is suspicious. It compares consecutive values.

"the stuck-value alert" ^0
"  compares consecutive readings : yes" ^0
"  fires when they are identical for a threshold : yes" ^0
"  fired for these " + str(dead_sensors) + " sensors : 0" ^0
"" ^0
"  it did not fire because the fallback is the last value," ^0
"  so consecutive readings ARE identical - which is the" ^0
"  condition, and the alert is looking at the substitution" ^0
"  rather than through it" ^0
"" ^0

# ---- what the aggregate does with them ----

int(readings_per_day * 100 / (readings_per_day - substituted_readings)) => weight_shift

"the fleet average" ^0
"  readings entering it     : " + str(readings_per_day) ^0
"  that reflect a measurement now : " + str(readings_per_day - substituted_readings) ^0
"  the " + str(dead_sensors) + " dead sensors contribute a value each time" ^0
"  and contribute the SAME value each time" ^0
"" ^0
"  a stuck contributor does not widen the variance, it narrows" ^0
"  it, so the average looks more trustworthy the longer a" ^0
"  sensor has been dead" ^0
"" ^0

# ---- how long this can hold ----

"hour   dead sensors   substituted readings   alerts" ^0
for h in [1:4]:
    h * 12 => hr
    int(readings_per_sensor_per_day * hr / 24) * dead_sensors => sub
    "  " + str(hr) + "     " + str(dead_sensors) + "              " + str(sub) + "                  0" ^0
"" ^0

# ---- the control ----
#
# The fallback, against the alternatives it was chosen over. Each of those
# fails in a way this one does not, and the choice was correct.

"control - is last-known the right fallback" ^0
"  pages that fail to render : 0, an error would have broken them" ^0
"  non-temperatures in the average : 0, a zero would have been one" ^0
"  consumers handling absence inconsistently : 0" ^0
"  defects in the fallback choice : 0" ^0
"" ^0
"  every alternative is worse, and the problem is not which" ^0
"  value was chosen" ^0
"" ^0

# ---- the null control ----
#
# The same fallback, same value, returned alongside a flag that says where it
# came from. The number did not change and neither did the choice.

0 => nc_unmarked

"null control - the same value carrying its provenance" ^0
"  value returned        : the last known one, unchanged" ^0
"  substituted readings  : " + str(substituted_readings) + ", unchanged" ^0
"  unmarked              : " + str(nc_unmarked) ^0
"  excluded from the average : the caller can now decide" ^0
"  stuck-value alert     : fires, it has something to compare" ^0
"  the fallback did not become better; it became visible" ^0
"" ^0

# ---- the rule ----

"what makes a fallback dangerous" ^0
"  being wrong        : no, a wrong value gets noticed" ^0
"  being implausible  : no, that gets noticed fastest" ^0
"  being plausible    : yes, because nothing downstream has a" ^0
"    reason to look at it twice" ^0
"" ^0
"the fix is not a better value; there is no value that carries" ^0
"its own provenance. It is a second field, and the cost of" ^0
"omitting it is paid by whichever consumer needed to know" ^0
"" ^0

"Last-known is the least wrong of the four options and the other three each" ^0
"break something: 0 pages fail to render, 0 non-temperatures enter the average," ^0
"0 consumers handle absence inconsistently. " + str(dead_sensors) + " sensors have been silent for " + str(hours_dead) ^0
"hours, contributing " + str(substituted_readings) + " readings a day - " + str(substituted_per_myriad) + " per ten thousand - none" ^0
"marked, and the stuck-value alert that would catch it has fired 0 times," ^0
"because the substitution satisfies the condition it is watching for." ^0
```

## Python (deterministic transpilation)

```python
sensors = 96
readings_per_sensor_per_day = 2880
dead_sensors = 7
hours_dead = 41
readings_per_day = sensors * readings_per_sensor_per_day
substituted_readings = readings_per_sensor_per_day * dead_sensors
substituted_since_silent = int(readings_per_sensor_per_day * hours_dead / 24) * dead_sensors
print("sensors                    : " + str(sensors))
print("readings per sensor per day: " + str(readings_per_sensor_per_day))
print("readings per day           : " + str(readings_per_day))
print("sensors not responding     : " + str(dead_sensors))
print("hours they have been dead  : " + str(hours_dead))
print("")
print("the readings")
print("  measured                 : " + str(readings_per_day - substituted_readings))
print("  substituted, per day     : " + str(substituted_readings))
print("  substituted since silent : " + str(substituted_since_silent) + " over " + str(hours_dead) + " hours")
print("  marked as substituted    : 0")
print("  distinguishable by type  : no, both are integers")
print("  distinguishable by range : no, the last value was in range")
print("")
substituted_per_myriad = int(substituted_readings * 10000 / readings_per_day)
print("  share substituted : " + str(substituted_per_myriad) + " per ten thousand")
print("")
print("sensor state      what the dashboard shows")
print("  healthy, stable   a flat line")
print("  dead              a flat line")
print("  healthy, drifting a moving line")
print("")
print("  the first two rows are the same picture, and the difference")
print("  between them is the whole question")
print("")
print("the stuck-value alert")
print("  compares consecutive readings : yes")
print("  fires when they are identical for a threshold : yes")
print("  fired for these " + str(dead_sensors) + " sensors : 0")
print("")
print("  it did not fire because the fallback is the last value,")
print("  so consecutive readings ARE identical - which is the")
print("  condition, and the alert is looking at the substitution")
print("  rather than through it")
print("")
weight_shift = int(readings_per_day * 100 / (readings_per_day - substituted_readings))
print("the fleet average")
print("  readings entering it     : " + str(readings_per_day))
print("  that reflect a measurement now : " + str(readings_per_day - substituted_readings))
print("  the " + str(dead_sensors) + " dead sensors contribute a value each time")
print("  and contribute the SAME value each time")
print("")
print("  a stuck contributor does not widen the variance, it narrows")
print("  it, so the average looks more trustworthy the longer a")
print("  sensor has been dead")
print("")
print("hour   dead sensors   substituted readings   alerts")
for h in range(1, 5):
    hr = h * 12
    sub = int(readings_per_sensor_per_day * hr / 24) * dead_sensors
    print("  " + str(hr) + "     " + str(dead_sensors) + "              " + str(sub) + "                  0")
print("")
print("control - is last-known the right fallback")
print("  pages that fail to render : 0, an error would have broken them")
print("  non-temperatures in the average : 0, a zero would have been one")
print("  consumers handling absence inconsistently : 0")
print("  defects in the fallback choice : 0")
print("")
print("  every alternative is worse, and the problem is not which")
print("  value was chosen")
print("")
nc_unmarked = 0
print("null control - the same value carrying its provenance")
print("  value returned        : the last known one, unchanged")
print("  substituted readings  : " + str(substituted_readings) + ", unchanged")
print("  unmarked              : " + str(nc_unmarked))
print("  excluded from the average : the caller can now decide")
print("  stuck-value alert     : fires, it has something to compare")
print("  the fallback did not become better; it became visible")
print("")
print("what makes a fallback dangerous")
print("  being wrong        : no, a wrong value gets noticed")
print("  being implausible  : no, that gets noticed fastest")
print("  being plausible    : yes, because nothing downstream has a")
print("    reason to look at it twice")
print("")
print("the fix is not a better value; there is no value that carries")
print("its own provenance. It is a second field, and the cost of")
print("omitting it is paid by whichever consumer needed to know")
print("")
print("Last-known is the least wrong of the four options and the other three each")
print("break something: 0 pages fail to render, 0 non-temperatures enter the average,")
print("0 consumers handle absence inconsistently. " + str(dead_sensors) + " sensors have been silent for " + str(hours_dead))
print("hours, contributing " + str(substituted_readings) + " readings a day - " + str(substituted_per_myriad) + " per ten thousand - none")
print("marked, and the stuck-value alert that would catch it has fired 0 times,")
print("because the substitution satisfies the condition it is watching for.")
```

## stdout (executed)

```text
sensors                    : 96
readings per sensor per day: 2880
readings per day           : 276480
sensors not responding     : 7
hours they have been dead  : 41

the readings
  measured                 : 256320
  substituted, per day     : 20160
  substituted since silent : 34440 over 41 hours
  marked as substituted    : 0
  distinguishable by type  : no, both are integers
  distinguishable by range : no, the last value was in range

  share substituted : 729 per ten thousand

sensor state      what the dashboard shows
  healthy, stable   a flat line
  dead              a flat line
  healthy, drifting a moving line

  the first two rows are the same picture, and the difference
  between them is the whole question

the stuck-value alert
  compares consecutive readings : yes
  fires when they are identical for a threshold : yes
  fired for these 7 sensors : 0

  it did not fire because the fallback is the last value,
  so consecutive readings ARE identical - which is the
  condition, and the alert is looking at the substitution
  rather than through it

the fleet average
  readings entering it     : 276480
  that reflect a measurement now : 256320
  the 7 dead sensors contribute a value each time
  and contribute the SAME value each time

  a stuck contributor does not widen the variance, it narrows
  it, so the average looks more trustworthy the longer a
  sensor has been dead

hour   dead sensors   substituted readings   alerts
  12     7              10080                  0
  24     7              20160                  0
  36     7              30240                  0
  48     7              40320                  0

control - is last-known the right fallback
  pages that fail to render : 0, an error would have broken them
  non-temperatures in the average : 0, a zero would have been one
  consumers handling absence inconsistently : 0
  defects in the fallback choice : 0

  every alternative is worse, and the problem is not which
  value was chosen

null control - the same value carrying its provenance
  value returned        : the last known one, unchanged
  substituted readings  : 20160, unchanged
  unmarked              : 0
  excluded from the average : the caller can now decide
  stuck-value alert     : fires, it has something to compare
  the fallback did not become better; it became visible

what makes a fallback dangerous
  being wrong        : no, a wrong value gets noticed
  being implausible  : no, that gets noticed fastest
  being plausible    : yes, because nothing downstream has a
    reason to look at it twice

the fix is not a better value; there is no value that carries
its own provenance. It is a second field, and the cost of
omitting it is paid by whichever consumer needed to know

Last-known is the least wrong of the four options and the other three each
break something: 0 pages fail to render, 0 non-temperatures enter the average,
0 consumers handle absence inconsistently. 7 sensors have been silent for 41
hours, contributing 20160 readings a day - 729 per ten thousand - none
marked, and the stuck-value alert that would catch it has fired 0 times,
because the substitution satisfies the condition it is watching for.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
