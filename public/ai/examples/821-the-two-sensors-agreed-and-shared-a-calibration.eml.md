<!-- canonical: efficientnewlanguage.org/ai/examples/821-the-two-sensors-agreed-and-shared-a-calibration | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 821 — The two sensors agreed and shared a calibration

`the_two_sensors_agreed_and_shared_a_calibration.eml` - The two pressure sensors have agreed within one unit all year, and the agreement is real. What they were zeroed against is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The two pressure
# sensors have agreed within one unit all year, and the agreement is real. What
# they were zeroed against is computed below.
#
# The redundancy is designed well. There are two independent sensors, not one;
# they are read on separate channels; a disagreement beyond a threshold raises
# an alarm; and the readings are logged side by side.
#
# Both were zeroed against the same reference block at install.

1012 => sensor_a_reading_mbar
1012 => sensor_b_reading_mbar
2 => disagreement_alarm_threshold_mbar
7 => the_shared_reference_drift_mbar
1 => independent_references

sensor_a_reading_mbar - sensor_b_reading_mbar => the_disagreement_mbar
sensor_a_reading_mbar - the_shared_reference_drift_mbar => true_pressure_mbar
sensor_a_reading_mbar - true_pressure_mbar => error_both_sensors_share_mbar

"sensor A                        : " + str(sensor_a_reading_mbar) + " mbar" ^0
"sensor B                        : " + str(sensor_b_reading_mbar) + " mbar" ^0
"  disagreement                  : " + str(the_disagreement_mbar) + " mbar" ^0
"  alarm threshold               : " + str(disagreement_alarm_threshold_mbar) + " mbar" ^0
"" ^0
"shared reference drift          : " + str(the_shared_reference_drift_mbar) + " mbar" ^0
"true pressure                   : " + str(true_pressure_mbar) + " mbar" ^0
"error both sensors share        : " + str(error_both_sensors_share_mbar) + " mbar" ^0
"independent references          : " + str(independent_references) ^0
"" ^0

# ---- what the redundancy verified ----

"the two-sensor check" ^0
"  sensors : two, not one" ^0
"  channels : separate" ^0
"  on a disagreement past two mbar : alarm" ^0
"  logging : side by side" ^0
"  the disagreement seen : " + str(the_disagreement_mbar) + " mbar" ^0
"  verdict : SENSORS AGREE" ^0
"" ^0
"  separate channels are the part done right here, and" ^0
"  they are why a single wiring fault cannot fake agreement" ^0
"" ^0

# ---- what they share ----

"the calibration behind both" ^0
"  what each was zeroed against : one reference block" ^0
"  when : at install, together" ^0
"  what the block has since done : drifted by seven mbar" ^0
"  so both sensors : carry the same seven-mbar offset" ^0
"  what their agreement proves : that they share it, not" ^0
"    that either is right" ^0
"" ^0

# ---- what the process actually saw ----

"the pressure in the vessel" ^0
"  what both sensors read : " + str(sensor_a_reading_mbar) + " mbar" ^0
"  what it truly was : " + str(true_pressure_mbar) + " mbar" ^0
"  the shared error : " + str(error_both_sensors_share_mbar) + " mbar, above the alarm" ^0
"    threshold, but identical so unalarmed" ^0
"  did a sensor fail : no; both are working and agree" ^0
"  what agreement could not catch : an error in the thing" ^0
"    both were measured against" ^0
"" ^0

# ---- null control ----

# The same two sensors, one re-zeroed against an independent reference so the
# two calibrations no longer share a drift.
0 => nc_disagreement_when_calibrations_shared
7 => nc_disagreement_when_one_is_independent
1 => nc_alarms_it_would_raise

"null control - one sensor on an independent reference" ^0
"  disagreement with a shared calibration : " ^0
"    " + str(nc_disagreement_when_calibrations_shared) + " mbar, unchanged" ^0
"  disagreement with an independent one : " ^0
"    " + str(nc_disagreement_when_one_is_independent) + " mbar" ^0
"  alarms it would raise : " + str(nc_alarms_it_would_raise) ^0
"  no sensor changed; one stopped sharing the reference" ^0
"  the other drifts with" ^0
"" ^0

# ---- the rule ----

"what two agreeing sensors guarantee" ^0
"  the two independent channels read the same value :" ^0
"    exactly, within one mbar, alarm armed past two" ^0
"  the reading is accurate : not addressed; both sensors" ^0
"    were zeroed against the same reference, so they share" ^0
"    its " + str(the_shared_reference_drift_mbar) + "-mbar drift and agree at the wrong value" ^0
"" ^0

"redundancy catches a fault that is independent between the copies; a fault in" ^0
"what they were both calibrated against is common to both, and agreement is" ^0
"exactly what it produces" ^0
"" ^0

"Two sensors, separate channels, alarm past two mbar - agreed within one all" ^0
"year. Both were zeroed against one reference block, which has drifted " + str(the_shared_reference_drift_mbar) + " mbar," ^0
"so they agree at " + str(sensor_a_reading_mbar) + " while the vessel is at " + str(true_pressure_mbar) + ", a shared error above the" ^0
"threshold under " + str(independent_references) + " independent reference." ^0
```

## Python (deterministic transpilation)

```python
sensor_a_reading_mbar = 1012
sensor_b_reading_mbar = 1012
disagreement_alarm_threshold_mbar = 2
the_shared_reference_drift_mbar = 7
independent_references = 1
the_disagreement_mbar = sensor_a_reading_mbar - sensor_b_reading_mbar
true_pressure_mbar = sensor_a_reading_mbar - the_shared_reference_drift_mbar
error_both_sensors_share_mbar = sensor_a_reading_mbar - true_pressure_mbar
print("sensor A                        : " + str(sensor_a_reading_mbar) + " mbar")
print("sensor B                        : " + str(sensor_b_reading_mbar) + " mbar")
print("  disagreement                  : " + str(the_disagreement_mbar) + " mbar")
print("  alarm threshold               : " + str(disagreement_alarm_threshold_mbar) + " mbar")
print("")
print("shared reference drift          : " + str(the_shared_reference_drift_mbar) + " mbar")
print("true pressure                   : " + str(true_pressure_mbar) + " mbar")
print("error both sensors share        : " + str(error_both_sensors_share_mbar) + " mbar")
print("independent references          : " + str(independent_references))
print("")
print("the two-sensor check")
print("  sensors : two, not one")
print("  channels : separate")
print("  on a disagreement past two mbar : alarm")
print("  logging : side by side")
print("  the disagreement seen : " + str(the_disagreement_mbar) + " mbar")
print("  verdict : SENSORS AGREE")
print("")
print("  separate channels are the part done right here, and")
print("  they are why a single wiring fault cannot fake agreement")
print("")
print("the calibration behind both")
print("  what each was zeroed against : one reference block")
print("  when : at install, together")
print("  what the block has since done : drifted by seven mbar")
print("  so both sensors : carry the same seven-mbar offset")
print("  what their agreement proves : that they share it, not")
print("    that either is right")
print("")
print("the pressure in the vessel")
print("  what both sensors read : " + str(sensor_a_reading_mbar) + " mbar")
print("  what it truly was : " + str(true_pressure_mbar) + " mbar")
print("  the shared error : " + str(error_both_sensors_share_mbar) + " mbar, above the alarm")
print("    threshold, but identical so unalarmed")
print("  did a sensor fail : no; both are working and agree")
print("  what agreement could not catch : an error in the thing")
print("    both were measured against")
print("")
nc_disagreement_when_calibrations_shared = 0
nc_disagreement_when_one_is_independent = 7
nc_alarms_it_would_raise = 1
print("null control - one sensor on an independent reference")
print("  disagreement with a shared calibration : ")
print("    " + str(nc_disagreement_when_calibrations_shared) + " mbar, unchanged")
print("  disagreement with an independent one : ")
print("    " + str(nc_disagreement_when_one_is_independent) + " mbar")
print("  alarms it would raise : " + str(nc_alarms_it_would_raise))
print("  no sensor changed; one stopped sharing the reference")
print("  the other drifts with")
print("")
print("what two agreeing sensors guarantee")
print("  the two independent channels read the same value :")
print("    exactly, within one mbar, alarm armed past two")
print("  the reading is accurate : not addressed; both sensors")
print("    were zeroed against the same reference, so they share")
print("    its " + str(the_shared_reference_drift_mbar) + "-mbar drift and agree at the wrong value")
print("")
print("redundancy catches a fault that is independent between the copies; a fault in")
print("what they were both calibrated against is common to both, and agreement is")
print("exactly what it produces")
print("")
print("Two sensors, separate channels, alarm past two mbar - agreed within one all")
print("year. Both were zeroed against one reference block, which has drifted " + str(the_shared_reference_drift_mbar) + " mbar,")
print("so they agree at " + str(sensor_a_reading_mbar) + " while the vessel is at " + str(true_pressure_mbar) + ", a shared error above the")
print("threshold under " + str(independent_references) + " independent reference.")
```

## stdout (executed)

```text
sensor A                        : 1012 mbar
sensor B                        : 1012 mbar
  disagreement                  : 0 mbar
  alarm threshold               : 2 mbar

shared reference drift          : 7 mbar
true pressure                   : 1005 mbar
error both sensors share        : 7 mbar
independent references          : 1

the two-sensor check
  sensors : two, not one
  channels : separate
  on a disagreement past two mbar : alarm
  logging : side by side
  the disagreement seen : 0 mbar
  verdict : SENSORS AGREE

  separate channels are the part done right here, and
  they are why a single wiring fault cannot fake agreement

the calibration behind both
  what each was zeroed against : one reference block
  when : at install, together
  what the block has since done : drifted by seven mbar
  so both sensors : carry the same seven-mbar offset
  what their agreement proves : that they share it, not
    that either is right

the pressure in the vessel
  what both sensors read : 1012 mbar
  what it truly was : 1005 mbar
  the shared error : 7 mbar, above the alarm
    threshold, but identical so unalarmed
  did a sensor fail : no; both are working and agree
  what agreement could not catch : an error in the thing
    both were measured against

null control - one sensor on an independent reference
  disagreement with a shared calibration : 
    0 mbar, unchanged
  disagreement with an independent one : 
    7 mbar
  alarms it would raise : 1
  no sensor changed; one stopped sharing the reference
  the other drifts with

what two agreeing sensors guarantee
  the two independent channels read the same value :
    exactly, within one mbar, alarm armed past two
  the reading is accurate : not addressed; both sensors
    were zeroed against the same reference, so they share
    its 7-mbar drift and agree at the wrong value

redundancy catches a fault that is independent between the copies; a fault in
what they were both calibrated against is common to both, and agreement is
exactly what it produces

Two sensors, separate channels, alarm past two mbar - agreed within one all
year. Both were zeroed against one reference block, which has drifted 7 mbar,
so they agree at 1012 while the vessel is at 1005, a shared error above the
threshold under 1 independent reference.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
