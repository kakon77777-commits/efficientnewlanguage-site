<!-- canonical: efficientnewlanguage.org/ai/examples/792-the-average-speed-was-the-mean-of-the-legs | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 792 — The average speed was the mean of the legs

`the_average_speed_was_the_mean_of_the_legs.eml` - The trip was 30 km/h out and 60 km/h back over the same road, and both speeds are measured correctly. What the average over the whole trip is is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The trip was 30
# km/h out and 60 km/h back over the same road, and both speeds are measured
# correctly. What the average over the whole trip is is computed below.
#
# Each leg's speed is honest. The distance is the same both ways; each speed is
# distance over the time that leg actually took; neither leg is estimated; and
# the odometer and clock agree at both ends.
#
# The reported average is the mean of the two leg speeds.

60 => leg_distance_km
30 => speed_out_kmh
60 => speed_back_kmh

int((speed_out_kmh + speed_back_kmh) / 2) => reported_average_kmh
int(leg_distance_km * 60 / speed_out_kmh) => time_out_minutes
int(leg_distance_km * 60 / speed_back_kmh) => time_back_minutes
time_out_minutes + time_back_minutes => total_minutes
leg_distance_km + leg_distance_km => total_distance_km
int(total_distance_km * 60 / total_minutes) => true_average_kmh
reported_average_kmh - true_average_kmh => overstatement_kmh

"leg distance                    : " + str(leg_distance_km) + " km each way" ^0
"speed out                       : " + str(speed_out_kmh) + " km/h" ^0
"speed back                      : " + str(speed_back_kmh) + " km/h" ^0
"reported average (mean of legs) : " + str(reported_average_kmh) + " km/h" ^0
"" ^0
"time out                        : " + str(time_out_minutes) + " minutes" ^0
"time back                       : " + str(time_back_minutes) + " minutes" ^0
"total time                      : " + str(total_minutes) + " minutes" ^0
"total distance                  : " + str(total_distance_km) + " km" ^0
"true average                    : " + str(true_average_kmh) + " km/h" ^0
"  overstatement                 : " + str(overstatement_kmh) + " km/h" ^0
"" ^0

# ---- what each leg verified ----

"the two leg speeds" ^0
"  distance : the same road, both ways" ^0
"  each speed : distance over the time that leg took" ^0
"  either leg estimated : no" ^0
"  odometer and clock : agree at both ends" ^0
"  legs measured correctly : both" ^0
"  verdict : EACH LEG CORRECT" ^0
"" ^0
"  timing each leg from the same clock at both ends is the" ^0
"  part done right here, and it is why neither speed is in" ^0
"  question" ^0
"" ^0

# ---- how the average was combined ----

"the mean of the two speeds" ^0
"  what it averages over : trips, one weight each" ^0
"  what speed averages over : time, and the legs took" ^0
"    unequal time" ^0
"  time on the slow leg : " + str(time_out_minutes) + " minutes" ^0
"  time on the fast leg : " + str(time_back_minutes) + " minutes" ^0
"  so the slow speed should count : twice as much, not" ^0
"    equally" ^0
"  the mean gives them : equal weight, and overstates" ^0
"" ^0

# ---- what the trip actually was ----

"the trip end to end" ^0
"  distance covered : " + str(total_distance_km) + " km" ^0
"  time taken : " + str(total_minutes) + " minutes" ^0
"  distance over time : " + str(true_average_kmh) + " km/h" ^0
"  the reported figure : " + str(reported_average_kmh) + " km/h" ^0
"  is either leg speed wrong : no; the combining is" ^0
"" ^0

# ---- null control ----

# The same two legs, with the average taken as total distance over total time
# rather than as the mean of the speeds.
45 => nc_mean_of_speeds_kmh
40 => nc_distance_over_time_kmh
0 => nc_leg_speeds_changed

"null control - total distance over total time" ^0
"  mean of the speeds : " + str(nc_mean_of_speeds_kmh) + ", unchanged" ^0
"  distance over time : " + str(nc_distance_over_time_kmh) + " km/h" ^0
"  leg speeds changed : " + str(nc_leg_speeds_changed) ^0
"  no distance and no time changed; the average stopped" ^0
"  being taken over trips and started being taken over the" ^0
"  minutes actually spent" ^0
"" ^0

# ---- the rule ----

"what two correct leg speeds guarantee" ^0
"  each leg's speed is distance over its own time :" ^0
"    exactly, same road, clock agreed at both ends" ^0
"  the average speed is their mean : not addressed; speed" ^0
"    averages over time not over trips, and equal distances" ^0
"    at 30 and 60 spend twice as long on the slow leg - the" ^0
"    true average over " + str(total_distance_km) + " km in " + str(total_minutes) + " minutes is " + str(true_average_kmh) ^0
"" ^0

"an average is weighted by whatever it ranges over, and speed ranges over time;" ^0
"giving two legs equal weight when one took twice as long counts the fast leg as" ^0
"if it lasted as long as the slow one" ^0
"" ^0

"Both leg speeds are exact, same road, clock agreed at both ends. The average is" ^0
"their mean, but speed averages over time - the slow leg took " + str(time_out_minutes) + " minutes to" ^0
"the fast leg's " + str(time_back_minutes) + " - so " + str(total_distance_km) + " km in " + str(total_minutes) + " minutes is " + str(true_average_kmh) + " km/h, not the" ^0
"reported " + str(reported_average_kmh) + "." ^0
```

## Python (deterministic transpilation)

```python
leg_distance_km = 60
speed_out_kmh = 30
speed_back_kmh = 60
reported_average_kmh = int((speed_out_kmh + speed_back_kmh) / 2)
time_out_minutes = int(leg_distance_km * 60 / speed_out_kmh)
time_back_minutes = int(leg_distance_km * 60 / speed_back_kmh)
total_minutes = time_out_minutes + time_back_minutes
total_distance_km = leg_distance_km + leg_distance_km
true_average_kmh = int(total_distance_km * 60 / total_minutes)
overstatement_kmh = reported_average_kmh - true_average_kmh
print("leg distance                    : " + str(leg_distance_km) + " km each way")
print("speed out                       : " + str(speed_out_kmh) + " km/h")
print("speed back                      : " + str(speed_back_kmh) + " km/h")
print("reported average (mean of legs) : " + str(reported_average_kmh) + " km/h")
print("")
print("time out                        : " + str(time_out_minutes) + " minutes")
print("time back                       : " + str(time_back_minutes) + " minutes")
print("total time                      : " + str(total_minutes) + " minutes")
print("total distance                  : " + str(total_distance_km) + " km")
print("true average                    : " + str(true_average_kmh) + " km/h")
print("  overstatement                 : " + str(overstatement_kmh) + " km/h")
print("")
print("the two leg speeds")
print("  distance : the same road, both ways")
print("  each speed : distance over the time that leg took")
print("  either leg estimated : no")
print("  odometer and clock : agree at both ends")
print("  legs measured correctly : both")
print("  verdict : EACH LEG CORRECT")
print("")
print("  timing each leg from the same clock at both ends is the")
print("  part done right here, and it is why neither speed is in")
print("  question")
print("")
print("the mean of the two speeds")
print("  what it averages over : trips, one weight each")
print("  what speed averages over : time, and the legs took")
print("    unequal time")
print("  time on the slow leg : " + str(time_out_minutes) + " minutes")
print("  time on the fast leg : " + str(time_back_minutes) + " minutes")
print("  so the slow speed should count : twice as much, not")
print("    equally")
print("  the mean gives them : equal weight, and overstates")
print("")
print("the trip end to end")
print("  distance covered : " + str(total_distance_km) + " km")
print("  time taken : " + str(total_minutes) + " minutes")
print("  distance over time : " + str(true_average_kmh) + " km/h")
print("  the reported figure : " + str(reported_average_kmh) + " km/h")
print("  is either leg speed wrong : no; the combining is")
print("")
nc_mean_of_speeds_kmh = 45
nc_distance_over_time_kmh = 40
nc_leg_speeds_changed = 0
print("null control - total distance over total time")
print("  mean of the speeds : " + str(nc_mean_of_speeds_kmh) + ", unchanged")
print("  distance over time : " + str(nc_distance_over_time_kmh) + " km/h")
print("  leg speeds changed : " + str(nc_leg_speeds_changed))
print("  no distance and no time changed; the average stopped")
print("  being taken over trips and started being taken over the")
print("  minutes actually spent")
print("")
print("what two correct leg speeds guarantee")
print("  each leg's speed is distance over its own time :")
print("    exactly, same road, clock agreed at both ends")
print("  the average speed is their mean : not addressed; speed")
print("    averages over time not over trips, and equal distances")
print("    at 30 and 60 spend twice as long on the slow leg - the")
print("    true average over " + str(total_distance_km) + " km in " + str(total_minutes) + " minutes is " + str(true_average_kmh))
print("")
print("an average is weighted by whatever it ranges over, and speed ranges over time;")
print("giving two legs equal weight when one took twice as long counts the fast leg as")
print("if it lasted as long as the slow one")
print("")
print("Both leg speeds are exact, same road, clock agreed at both ends. The average is")
print("their mean, but speed averages over time - the slow leg took " + str(time_out_minutes) + " minutes to")
print("the fast leg's " + str(time_back_minutes) + " - so " + str(total_distance_km) + " km in " + str(total_minutes) + " minutes is " + str(true_average_kmh) + " km/h, not the")
print("reported " + str(reported_average_kmh) + ".")
```

## stdout (executed)

```text
leg distance                    : 60 km each way
speed out                       : 30 km/h
speed back                      : 60 km/h
reported average (mean of legs) : 45 km/h

time out                        : 120 minutes
time back                       : 60 minutes
total time                      : 180 minutes
total distance                  : 120 km
true average                    : 40 km/h
  overstatement                 : 5 km/h

the two leg speeds
  distance : the same road, both ways
  each speed : distance over the time that leg took
  either leg estimated : no
  odometer and clock : agree at both ends
  legs measured correctly : both
  verdict : EACH LEG CORRECT

  timing each leg from the same clock at both ends is the
  part done right here, and it is why neither speed is in
  question

the mean of the two speeds
  what it averages over : trips, one weight each
  what speed averages over : time, and the legs took
    unequal time
  time on the slow leg : 120 minutes
  time on the fast leg : 60 minutes
  so the slow speed should count : twice as much, not
    equally
  the mean gives them : equal weight, and overstates

the trip end to end
  distance covered : 120 km
  time taken : 180 minutes
  distance over time : 40 km/h
  the reported figure : 45 km/h
  is either leg speed wrong : no; the combining is

null control - total distance over total time
  mean of the speeds : 45, unchanged
  distance over time : 40 km/h
  leg speeds changed : 0
  no distance and no time changed; the average stopped
  being taken over trips and started being taken over the
  minutes actually spent

what two correct leg speeds guarantee
  each leg's speed is distance over its own time :
    exactly, same road, clock agreed at both ends
  the average speed is their mean : not addressed; speed
    averages over time not over trips, and equal distances
    at 30 and 60 spend twice as long on the slow leg - the
    true average over 120 km in 180 minutes is 40

an average is weighted by whatever it ranges over, and speed ranges over time;
giving two legs equal weight when one took twice as long counts the fast leg as
if it lasted as long as the slow one

Both leg speeds are exact, same road, clock agreed at both ends. The average is
their mean, but speed averages over time - the slow leg took 120 minutes to
the fast leg's 60 - so 120 km in 180 minutes is 40 km/h, not the
reported 45.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
