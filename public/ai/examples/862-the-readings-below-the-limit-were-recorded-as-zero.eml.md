<!-- canonical: efficientnewlanguage.org/ai/examples/862-the-readings-below-the-limit-were-recorded-as-zero | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 862 — The readings below the limit were recorded as zero

`the_readings_below_the_limit_were_recorded_as_zero.eml` - A water-quality report gives the average contaminant level, and it averages the real recorded readings of every sample correctly. What a recorded zero means is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A water-quality
# report gives the average contaminant level, and it averages the real recorded
# readings of every sample correctly. What a recorded zero means is computed
# below.
#
# The measurement is careful. It reads the real assay values, not estimates; it
# covers every sample; the mean is the honest average of the recorded levels; and
# the intent is exactly 'the average contaminant concentration'.
#
# The assay cannot quantify below 5 units, so every below-limit reading is stored
# as 0 - and a stored 0 means 'below the limit', not 'none present'.

40000 => samples
10000 => readings_above_the_limit
30000 => readings_below_the_limit_stored_zero
8 => mean_with_below_limit_as_zero
10 => mean_with_below_limit_at_half_the_limit

mean_with_below_limit_at_half_the_limit - mean_with_below_limit_as_zero => level_the_floor_hid
int(level_the_floor_hid * 10000 / mean_with_below_limit_at_half_the_limit) => understated_share_per_myriad

"samples                         : " + str(samples) ^0
"  above the detection limit     : " + str(readings_above_the_limit) ^0
"  below the limit, stored as 0  : " + str(readings_below_the_limit_stored_zero) ^0
"" ^0
"mean, below-limit read as zero  : " + str(mean_with_below_limit_as_zero) ^0
"mean, below-limit at half-limit : " + str(mean_with_below_limit_at_half_the_limit) ^0
"level the floor hid             : " + str(level_the_floor_hid) ^0
"understated share of the truth  : " + str(understated_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the contaminant average" ^0
"  reads : the real assay values, not estimates" ^0
"  covers : every sample" ^0
"  mean : the honest average of the recorded levels" ^0
"  intent : the average contaminant concentration" ^0
"  samples omitted : 0" ^0
"  verdict : RECORDED MEAN IS 8, COMPUTED CORRECTLY" ^0
"" ^0
"  averaging the real recorded values over every sample is" ^0
"  the part done right here, and it is why 8 is the correct" ^0
"  mean of what was stored" ^0
"" ^0

# ---- what a recorded zero means ----

"the stored zero" ^0
"  the assay's limit : it cannot quantify below 5 units" ^0
"  what a below-limit reading becomes : 0" ^0
"  what that 0 means : below the limit, somewhere in 0 to 5" ^0
"  what it is read as : none present, exactly zero" ^0
"  so the mean : treats a floor as a true absence, on 30000" ^0
"    of the 40000 samples" ^0
"" ^0

# ---- what the caller got ----

"the result of the report" ^0
"  reported average : " + str(mean_with_below_limit_as_zero) ^0
"  average if below-limit is half the limit : " + str(mean_with_below_limit_at_half_the_limit) ^0
"  concentration hidden by the floor : " + str(level_the_floor_hid) ^0
"  is the recorded mean wrong : no; 8 is exact for the" ^0
"    stored values" ^0
"  is a stored 0 an absence : no; it is a value censored at" ^0
"    the detection limit and read as zero" ^0
"" ^0

# ---- null control ----

# The same samples, with below-limit readings set to half the detection limit (or
# a censored-data estimator), instead of a hard zero.
8 => nc_mean_with_hard_zero
10 => nc_mean_with_half_limit_substitution
30000 => nc_readings_no_longer_read_as_absent

"null control - substitute half the limit for below-limit readings" ^0
"  mean with a hard zero : " + str(nc_mean_with_hard_zero) ^0
"  mean with half-limit substitution : " + str(nc_mean_with_half_limit_substitution) ^0
"  readings no longer read as absent : " + str(nc_readings_no_longer_read_as_absent) ^0
"  no sample and no assay reading changed; the below-limit" ^0
"  values stopped being read as zero and started being read" ^0
"  as somewhere under the limit" ^0
"" ^0

# ---- the rule ----

"what an average of the recorded readings guarantees" ^0
"  it is the correct mean of what was stored : exactly, real" ^0
"    values, every sample, honest average" ^0
"  it is the average concentration present : not addressed;" ^0
"    the assay floors sub-limit readings to 0 and a 0 is read" ^0
"    as absence, so the " + str(readings_below_the_limit_stored_zero) + " censored samples pull the mean to 8" ^0
"" ^0

"a detection limit is a floor on what can be seen, not on what is there; storing" ^0
"the unseen as zero turns 'too small to measure' into 'measured as nothing', and" ^0
"an average built on that reads a limit of the instrument as a value of the world" ^0
"" ^0

"It averages the real recorded values over every sample - 8 is the exact recorded" ^0
"mean. But the assay stores every below-limit reading as 0 and a 0 is read as" ^0
"absent; the " + str(readings_below_the_limit_stored_zero) + " censored samples give a true mean nearer " + str(mean_with_below_limit_at_half_the_limit) + ", " + str(understated_share_per_myriad) ^0
"per ten thousand understated, until the floor is estimated instead of zeroed." ^0
```

## Python (deterministic transpilation)

```python
samples = 40000
readings_above_the_limit = 10000
readings_below_the_limit_stored_zero = 30000
mean_with_below_limit_as_zero = 8
mean_with_below_limit_at_half_the_limit = 10
level_the_floor_hid = mean_with_below_limit_at_half_the_limit - mean_with_below_limit_as_zero
understated_share_per_myriad = int(level_the_floor_hid * 10000 / mean_with_below_limit_at_half_the_limit)
print("samples                         : " + str(samples))
print("  above the detection limit     : " + str(readings_above_the_limit))
print("  below the limit, stored as 0  : " + str(readings_below_the_limit_stored_zero))
print("")
print("mean, below-limit read as zero  : " + str(mean_with_below_limit_as_zero))
print("mean, below-limit at half-limit : " + str(mean_with_below_limit_at_half_the_limit))
print("level the floor hid             : " + str(level_the_floor_hid))
print("understated share of the truth  : " + str(understated_share_per_myriad) + " per ten thousand")
print("")
print("the contaminant average")
print("  reads : the real assay values, not estimates")
print("  covers : every sample")
print("  mean : the honest average of the recorded levels")
print("  intent : the average contaminant concentration")
print("  samples omitted : 0")
print("  verdict : RECORDED MEAN IS 8, COMPUTED CORRECTLY")
print("")
print("  averaging the real recorded values over every sample is")
print("  the part done right here, and it is why 8 is the correct")
print("  mean of what was stored")
print("")
print("the stored zero")
print("  the assay's limit : it cannot quantify below 5 units")
print("  what a below-limit reading becomes : 0")
print("  what that 0 means : below the limit, somewhere in 0 to 5")
print("  what it is read as : none present, exactly zero")
print("  so the mean : treats a floor as a true absence, on 30000")
print("    of the 40000 samples")
print("")
print("the result of the report")
print("  reported average : " + str(mean_with_below_limit_as_zero))
print("  average if below-limit is half the limit : " + str(mean_with_below_limit_at_half_the_limit))
print("  concentration hidden by the floor : " + str(level_the_floor_hid))
print("  is the recorded mean wrong : no; 8 is exact for the")
print("    stored values")
print("  is a stored 0 an absence : no; it is a value censored at")
print("    the detection limit and read as zero")
print("")
nc_mean_with_hard_zero = 8
nc_mean_with_half_limit_substitution = 10
nc_readings_no_longer_read_as_absent = 30000
print("null control - substitute half the limit for below-limit readings")
print("  mean with a hard zero : " + str(nc_mean_with_hard_zero))
print("  mean with half-limit substitution : " + str(nc_mean_with_half_limit_substitution))
print("  readings no longer read as absent : " + str(nc_readings_no_longer_read_as_absent))
print("  no sample and no assay reading changed; the below-limit")
print("  values stopped being read as zero and started being read")
print("  as somewhere under the limit")
print("")
print("what an average of the recorded readings guarantees")
print("  it is the correct mean of what was stored : exactly, real")
print("    values, every sample, honest average")
print("  it is the average concentration present : not addressed;")
print("    the assay floors sub-limit readings to 0 and a 0 is read")
print("    as absence, so the " + str(readings_below_the_limit_stored_zero) + " censored samples pull the mean to 8")
print("")
print("a detection limit is a floor on what can be seen, not on what is there; storing")
print("the unseen as zero turns 'too small to measure' into 'measured as nothing', and")
print("an average built on that reads a limit of the instrument as a value of the world")
print("")
print("It averages the real recorded values over every sample - 8 is the exact recorded")
print("mean. But the assay stores every below-limit reading as 0 and a 0 is read as")
print("absent; the " + str(readings_below_the_limit_stored_zero) + " censored samples give a true mean nearer " + str(mean_with_below_limit_at_half_the_limit) + ", " + str(understated_share_per_myriad))
print("per ten thousand understated, until the floor is estimated instead of zeroed.")
```

## stdout (executed)

```text
samples                         : 40000
  above the detection limit     : 10000
  below the limit, stored as 0  : 30000

mean, below-limit read as zero  : 8
mean, below-limit at half-limit : 10
level the floor hid             : 2
understated share of the truth  : 2000 per ten thousand

the contaminant average
  reads : the real assay values, not estimates
  covers : every sample
  mean : the honest average of the recorded levels
  intent : the average contaminant concentration
  samples omitted : 0
  verdict : RECORDED MEAN IS 8, COMPUTED CORRECTLY

  averaging the real recorded values over every sample is
  the part done right here, and it is why 8 is the correct
  mean of what was stored

the stored zero
  the assay's limit : it cannot quantify below 5 units
  what a below-limit reading becomes : 0
  what that 0 means : below the limit, somewhere in 0 to 5
  what it is read as : none present, exactly zero
  so the mean : treats a floor as a true absence, on 30000
    of the 40000 samples

the result of the report
  reported average : 8
  average if below-limit is half the limit : 10
  concentration hidden by the floor : 2
  is the recorded mean wrong : no; 8 is exact for the
    stored values
  is a stored 0 an absence : no; it is a value censored at
    the detection limit and read as zero

null control - substitute half the limit for below-limit readings
  mean with a hard zero : 8
  mean with half-limit substitution : 10
  readings no longer read as absent : 30000
  no sample and no assay reading changed; the below-limit
  values stopped being read as zero and started being read
  as somewhere under the limit

what an average of the recorded readings guarantees
  it is the correct mean of what was stored : exactly, real
    values, every sample, honest average
  it is the average concentration present : not addressed;
    the assay floors sub-limit readings to 0 and a 0 is read
    as absence, so the 30000 censored samples pull the mean to 8

a detection limit is a floor on what can be seen, not on what is there; storing
the unseen as zero turns 'too small to measure' into 'measured as nothing', and
an average built on that reads a limit of the instrument as a value of the world

It averages the real recorded values over every sample - 8 is the exact recorded
mean. But the assay stores every below-limit reading as 0 and a 0 is read as
absent; the 30000 censored samples give a true mean nearer 10, 2000
per ten thousand understated, until the floor is estimated instead of zeroed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
