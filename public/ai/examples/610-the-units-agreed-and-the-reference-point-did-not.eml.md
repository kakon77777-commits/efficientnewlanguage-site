<!-- canonical: efficientnewlanguage.org/ai/examples/610-the-units-agreed-and-the-reference-point-did-not | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 610 — The units agreed and the reference point did not

`the_units_agreed_and_the_reference_point_did_not.eml` - Two services report a timestamp in seconds. The units match, the types match, and a comparison between them type-checks. What the two numbers are counted from is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two services
# report a timestamp in seconds. The units match, the types match, and a
# comparison between them type-checks. What the two numbers are counted from is
# computed below.
#
# Agreeing on the unit is the hard part of an interface and both sides did it.
# The field is documented as seconds, both sides are integers, neither is
# milliseconds pretending to be seconds, and there is no floating point in the
# path. A whole class of interface bug is absent here, deliberately, because
# somebody thought about it.
#
# A measurement is a magnitude and an origin. The unit fixes the magnitude. The
# origin is the other half, and nothing in the field name, the type, or the
# schema records it.
#
# One side counts from the epoch. The other counts from when its process
# started. Both are seconds, and subtracting one from the other produces a
# number in seconds that means nothing.

1756425600 => wall_seconds_now
4830 => process_uptime_seconds
300 => alert_threshold_seconds

"service A reports : " + str(wall_seconds_now) + " seconds" ^0
"service B reports : " + str(process_uptime_seconds) + " seconds" ^0
"both fields typed : integer seconds" ^0
"" ^0

# ---- what agrees ----

"the interface, checked" ^0
"  unit on both sides       : seconds" ^0
"  type on both sides       : integer" ^0
"  schema validation        : passes" ^0
"  millisecond confusion    : none" ^0
"  floating point in path   : none" ^0
"  unit mismatches found    : 0" ^0
"" ^0

# ---- what the comparison computes ----

wall_seconds_now - process_uptime_seconds => difference

"the freshness check" ^0
"  written  : A minus B, compared against " + str(alert_threshold_seconds) ^0
"  computes : " + str(wall_seconds_now) + " minus " + str(process_uptime_seconds) ^0
"  result   : " + str(difference) + " seconds" ^0
"  verdict  : stale, by a very large margin" ^0
"" ^0
int(difference / 31536000) => difference_years
"  the result in years : about " + str(difference_years) ^0
"" ^0

# ---- what the number would have to be to pass ----

wall_seconds_now - alert_threshold_seconds => passing_floor

"for the check to pass, B would have to report" ^0
"  at least : " + str(passing_floor) ^0
"  B's largest possible value is its uptime, which after a year" ^0
"    of running would be about " + str(31536000) ^0
"  so the check cannot pass, ever, for any uptime" ^0
"" ^0
"  a comparison that cannot return true is not obviously broken;" ^0
"  it is a comparison that is always firing, and an always-firing" ^0
"  alert is indistinguishable from a real problem the first time" ^0
"" ^0

# ---- the same two numbers, converted correctly ----
#
# B's origin is its process start. Given the start time on the wall clock, B
# becomes comparable, and the units were never the obstacle.

# B's start is a fact about B, not one derived from A. Deriving it from A
# would make b_as_wall_seconds equal wall_seconds_now by construction and the
# answer would be 0 for arithmetic reasons rather than measured ones - a
# conversion that cannot come out any other way demonstrates nothing.

12 => b_reading_age_seconds
wall_seconds_now - b_reading_age_seconds - process_uptime_seconds => b_process_start_wall
b_process_start_wall + process_uptime_seconds => b_as_wall_seconds
wall_seconds_now - b_as_wall_seconds => correct_difference

"B, expressed against the same origin" ^0
"  B's process started at   : " + str(b_process_start_wall) + " on the wall clock" ^0
"  B's reading, as wall time: " + str(b_as_wall_seconds) ^0
"  A minus B                : " + str(correct_difference) + " seconds" ^0
"  verdict                  : fresh" ^0
"" ^0
"  the conversion is one addition, and the number it needs" ^0
"  is not in either message" ^0
"" ^0

# ---- how far the wrong value travels ----

"where the units are checked" ^0
"  the schema           : units match, accepted" ^0
"  the type system      : both integers, accepted" ^0
"  the linter           : nothing to say about it" ^0
"  a unit-aware library : would accept, both are seconds" ^0
"  the subtraction      : well typed, seconds minus seconds" ^0
"" ^0
"  every layer that could object is asking about the unit," ^0
"  and the unit is correct at every one of them" ^0
"" ^0

# ---- the control ----
#
# The unit agreement, against what it prevents. It prevents the whole family of
# errors where one side sends milliseconds and the other reads seconds, and
# that family does not occur here.

"control - did the unit agreement do its job" ^0
"  fields where units disagree      : 0" ^0
"  values off by a factor of 1000   : 0" ^0
"  values off by a factor of 60     : 0" ^0
"  schema rejections                : 0" ^0
"  defects in the unit contract     : 0" ^0
"" ^0
"  the contract is exactly as strong as it was written to be" ^0
"" ^0

# ---- the null control ----
#
# The same two services when both report wall-clock seconds. Same unit, same
# type, same subtraction, same threshold. Now the origins coincide and the
# check answers the question it was written to ask.

wall_seconds_now - b_reading_age_seconds => nc_b_reading
wall_seconds_now - nc_b_reading => nc_difference

"null control - the same check when both count from the epoch" ^0
"  A reports  : " + str(wall_seconds_now) ^0
"  B reports  : " + str(nc_b_reading) ^0
"  difference : " + str(nc_difference) + " seconds" ^0
"  threshold  : " + str(alert_threshold_seconds) ^0
"  verdict    : fresh" ^0
"  same unit, same type, same arithmetic" ^0
"  what changed is a fact neither message carries" ^0
"" ^0

# ---- the rule ----

"what a shared unit establishes" ^0
"  the two magnitudes are on the same scale : yes" ^0
"  they are measured from the same point    : not addressed" ^0
"  their difference is meaningful           : only given both" ^0
"  and a subtraction requires the second one to be true" ^0
"" ^0
"the field name says what is being counted; the thing to write" ^0
"down beside it is what it is counted from, because a comparison" ^0
"of two magnitudes is really a comparison of two origins" ^0
"" ^0

"Both services report integer seconds, 0 fields disagree on units, 0 values are" ^0
"off by a factor of 1000, and the subtraction is well typed on both sides. A" ^0
"reports " + str(wall_seconds_now) + " counted from the epoch and B reports " + str(process_uptime_seconds) + " counted from its" ^0
"own start, so the freshness check computes " + str(difference) + " seconds - roughly " + str(difference_years) ^0
"years - where the answer is " + str(correct_difference) + ", and no layer in the path has a place to" ^0
"record which point either number is counted from." ^0
```

## Python (deterministic transpilation)

```python
wall_seconds_now = 1756425600
process_uptime_seconds = 4830
alert_threshold_seconds = 300
print("service A reports : " + str(wall_seconds_now) + " seconds")
print("service B reports : " + str(process_uptime_seconds) + " seconds")
print("both fields typed : integer seconds")
print("")
print("the interface, checked")
print("  unit on both sides       : seconds")
print("  type on both sides       : integer")
print("  schema validation        : passes")
print("  millisecond confusion    : none")
print("  floating point in path   : none")
print("  unit mismatches found    : 0")
print("")
difference = wall_seconds_now - process_uptime_seconds
print("the freshness check")
print("  written  : A minus B, compared against " + str(alert_threshold_seconds))
print("  computes : " + str(wall_seconds_now) + " minus " + str(process_uptime_seconds))
print("  result   : " + str(difference) + " seconds")
print("  verdict  : stale, by a very large margin")
print("")
difference_years = int(difference / 31536000)
print("  the result in years : about " + str(difference_years))
print("")
passing_floor = wall_seconds_now - alert_threshold_seconds
print("for the check to pass, B would have to report")
print("  at least : " + str(passing_floor))
print("  B's largest possible value is its uptime, which after a year")
print("    of running would be about " + str(31536000))
print("  so the check cannot pass, ever, for any uptime")
print("")
print("  a comparison that cannot return true is not obviously broken;")
print("  it is a comparison that is always firing, and an always-firing")
print("  alert is indistinguishable from a real problem the first time")
print("")
b_reading_age_seconds = 12
b_process_start_wall = wall_seconds_now - b_reading_age_seconds - process_uptime_seconds
b_as_wall_seconds = b_process_start_wall + process_uptime_seconds
correct_difference = wall_seconds_now - b_as_wall_seconds
print("B, expressed against the same origin")
print("  B's process started at   : " + str(b_process_start_wall) + " on the wall clock")
print("  B's reading, as wall time: " + str(b_as_wall_seconds))
print("  A minus B                : " + str(correct_difference) + " seconds")
print("  verdict                  : fresh")
print("")
print("  the conversion is one addition, and the number it needs")
print("  is not in either message")
print("")
print("where the units are checked")
print("  the schema           : units match, accepted")
print("  the type system      : both integers, accepted")
print("  the linter           : nothing to say about it")
print("  a unit-aware library : would accept, both are seconds")
print("  the subtraction      : well typed, seconds minus seconds")
print("")
print("  every layer that could object is asking about the unit,")
print("  and the unit is correct at every one of them")
print("")
print("control - did the unit agreement do its job")
print("  fields where units disagree      : 0")
print("  values off by a factor of 1000   : 0")
print("  values off by a factor of 60     : 0")
print("  schema rejections                : 0")
print("  defects in the unit contract     : 0")
print("")
print("  the contract is exactly as strong as it was written to be")
print("")
nc_b_reading = wall_seconds_now - b_reading_age_seconds
nc_difference = wall_seconds_now - nc_b_reading
print("null control - the same check when both count from the epoch")
print("  A reports  : " + str(wall_seconds_now))
print("  B reports  : " + str(nc_b_reading))
print("  difference : " + str(nc_difference) + " seconds")
print("  threshold  : " + str(alert_threshold_seconds))
print("  verdict    : fresh")
print("  same unit, same type, same arithmetic")
print("  what changed is a fact neither message carries")
print("")
print("what a shared unit establishes")
print("  the two magnitudes are on the same scale : yes")
print("  they are measured from the same point    : not addressed")
print("  their difference is meaningful           : only given both")
print("  and a subtraction requires the second one to be true")
print("")
print("the field name says what is being counted; the thing to write")
print("down beside it is what it is counted from, because a comparison")
print("of two magnitudes is really a comparison of two origins")
print("")
print("Both services report integer seconds, 0 fields disagree on units, 0 values are")
print("off by a factor of 1000, and the subtraction is well typed on both sides. A")
print("reports " + str(wall_seconds_now) + " counted from the epoch and B reports " + str(process_uptime_seconds) + " counted from its")
print("own start, so the freshness check computes " + str(difference) + " seconds - roughly " + str(difference_years))
print("years - where the answer is " + str(correct_difference) + ", and no layer in the path has a place to")
print("record which point either number is counted from.")
```

## stdout (executed)

```text
service A reports : 1756425600 seconds
service B reports : 4830 seconds
both fields typed : integer seconds

the interface, checked
  unit on both sides       : seconds
  type on both sides       : integer
  schema validation        : passes
  millisecond confusion    : none
  floating point in path   : none
  unit mismatches found    : 0

the freshness check
  written  : A minus B, compared against 300
  computes : 1756425600 minus 4830
  result   : 1756420770 seconds
  verdict  : stale, by a very large margin

  the result in years : about 55

for the check to pass, B would have to report
  at least : 1756425300
  B's largest possible value is its uptime, which after a year
    of running would be about 31536000
  so the check cannot pass, ever, for any uptime

  a comparison that cannot return true is not obviously broken;
  it is a comparison that is always firing, and an always-firing
  alert is indistinguishable from a real problem the first time

B, expressed against the same origin
  B's process started at   : 1756420758 on the wall clock
  B's reading, as wall time: 1756425588
  A minus B                : 12 seconds
  verdict                  : fresh

  the conversion is one addition, and the number it needs
  is not in either message

where the units are checked
  the schema           : units match, accepted
  the type system      : both integers, accepted
  the linter           : nothing to say about it
  a unit-aware library : would accept, both are seconds
  the subtraction      : well typed, seconds minus seconds

  every layer that could object is asking about the unit,
  and the unit is correct at every one of them

control - did the unit agreement do its job
  fields where units disagree      : 0
  values off by a factor of 1000   : 0
  values off by a factor of 60     : 0
  schema rejections                : 0
  defects in the unit contract     : 0

  the contract is exactly as strong as it was written to be

null control - the same check when both count from the epoch
  A reports  : 1756425600
  B reports  : 1756425588
  difference : 12 seconds
  threshold  : 300
  verdict    : fresh
  same unit, same type, same arithmetic
  what changed is a fact neither message carries

what a shared unit establishes
  the two magnitudes are on the same scale : yes
  they are measured from the same point    : not addressed
  their difference is meaningful           : only given both
  and a subtraction requires the second one to be true

the field name says what is being counted; the thing to write
down beside it is what it is counted from, because a comparison
of two magnitudes is really a comparison of two origins

Both services report integer seconds, 0 fields disagree on units, 0 values are
off by a factor of 1000, and the subtraction is well typed on both sides. A
reports 1756425600 counted from the epoch and B reports 4830 counted from its
own start, so the freshness check computes 1756420770 seconds - roughly 55
years - where the answer is 12, and no layer in the path has a place to
record which point either number is counted from.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
