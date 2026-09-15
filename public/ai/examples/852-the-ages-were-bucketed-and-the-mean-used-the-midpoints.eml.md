<!-- canonical: efficientnewlanguage.org/ai/examples/852-the-ages-were-bucketed-and-the-mean-used-the-midpoints | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 852 — The ages were bucketed and the mean used the midpoints

`the_ages_were_bucketed_and_the_mean_used_the_midpoints.eml` - A survey reports the average age, computed as the weighted mean of the age-bucket midpoints, and the arithmetic is correct over every respondent. What a bucket midpoint stands in for is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A survey reports the
# average age, computed as the weighted mean of the age-bucket midpoints, and the
# arithmetic is correct over every respondent. What a bucket midpoint stands in
# for is computed below.
#
# The measurement is careful. It reads the real recorded bucket for each
# respondent, not a guess; it covers every respondent; the weighted mean of the
# midpoints is honest; and the intent is exactly 'the average age'.
#
# Only the bucket is recorded, never the age, so each respondent is placed at the
# center of the bucket - which is the true average only if ages sit symmetrically
# in every bucket, and the top bucket is open-ended with a chosen midpoint.

100000 => respondents
42 => mean_from_bucket_midpoints
47 => mean_from_raw_ages

mean_from_raw_ages - mean_from_bucket_midpoints => years_the_bucketing_hid
int(years_the_bucketing_hid * 10000 / mean_from_raw_ages) => understated_share_per_myriad

"respondents                     : " + str(respondents) ^0
"mean from bucket midpoints      : " + str(mean_from_bucket_midpoints) ^0
"mean from the raw ages          : " + str(mean_from_raw_ages) ^0
"years the bucketing hid         : " + str(years_the_bucketing_hid) ^0
"understated share of the truth  : " + str(understated_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the average-age computation" ^0
"  reads : the real recorded bucket for each respondent" ^0
"  covers : every respondent" ^0
"  mean : the honest weighted mean of the midpoints" ^0
"  intent : the average age" ^0
"  respondents omitted : 0" ^0
"  verdict : MIDPOINT MEAN IS 42, COMPUTED CORRECTLY" ^0
"" ^0
"  taking the honest weighted mean of the midpoints over" ^0
"  every respondent is the part done right here, and it is" ^0
"  why 42 is the correct mean of the midpoints" ^0
"" ^0

# ---- what a midpoint stands in for ----

"the midpoint substitution" ^0
"  what is recorded : the bucket, never the age" ^0
"  what the midpoint assumes : the age sits at the bucket's" ^0
"    center" ^0
"  when that holds : only if ages are symmetric within each" ^0
"    bucket" ^0
"  the real distribution : skews old, and the top bucket is" ^0
"    open-ended with a guessed center" ^0
"  so the midpoint mean : is the mean of the assumption, not" ^0
"    of the ages" ^0
"" ^0

# ---- what the caller got ----

"the result of the survey" ^0
"  reported average age : " + str(mean_from_bucket_midpoints) ^0
"  average from the raw ages : " + str(mean_from_raw_ages) ^0
"  years hidden by the bucketing : " + str(years_the_bucketing_hid) ^0
"  is the midpoint mean miscomputed : no; 42 is exact for" ^0
"    the midpoints" ^0
"  is 42 the average age : no; interval censoring replaced" ^0
"    each age with a center it need not sit at" ^0
"" ^0

# ---- null control ----

# The same respondents, with the raw age recorded instead of only the bucket (or a
# within-bucket distribution estimated rather than assumed uniform).
42 => nc_mean_from_midpoints
47 => nc_mean_from_raw_ages
5 => nc_years_the_raw_value_recovers

"null control - record the raw age, not only the bucket" ^0
"  mean from midpoints : " + str(nc_mean_from_midpoints) ^0
"  mean from raw ages : " + str(nc_mean_from_raw_ages) ^0
"  years the raw value recovers : " + str(nc_years_the_raw_value_recovers) ^0
"  no respondent and no bucket boundary changed; each age" ^0
"  stopped being read as its bucket's center and started" ^0
"  being read as itself" ^0
"" ^0

# ---- the rule ----

"what a mean of bucket midpoints guarantees" ^0
"  it is the correct mean of the midpoints : exactly, real" ^0
"    buckets, every respondent, honest weighting" ^0
"  it is the mean of the ages : not addressed; only the" ^0
"    bucket is recorded, so each age becomes its bucket's" ^0
"    center, and a skewed distribution plus an open top" ^0
"    bucket moves the true mean to " + str(mean_from_raw_ages) ^0
"" ^0

"a bucket keeps which interval a value fell in and forgets where inside it; the" ^0
"midpoint puts it back at the center, which is a fact about the interval, not the" ^0
"value, and a skew within the bucket is invisible to a mean of centers" ^0
"" ^0

"It takes the honest weighted mean of the midpoints over every respondent - 42 is" ^0
"the exact midpoint mean. But only the bucket was recorded, so each age is read as" ^0
"its center; with a skewed distribution and an open top bucket the true mean is " + str(mean_from_raw_ages) + "," ^0
"" + str(understated_share_per_myriad) + " per ten thousand understated, until the raw age is recorded." ^0
```

## Python (deterministic transpilation)

```python
respondents = 100000
mean_from_bucket_midpoints = 42
mean_from_raw_ages = 47
years_the_bucketing_hid = mean_from_raw_ages - mean_from_bucket_midpoints
understated_share_per_myriad = int(years_the_bucketing_hid * 10000 / mean_from_raw_ages)
print("respondents                     : " + str(respondents))
print("mean from bucket midpoints      : " + str(mean_from_bucket_midpoints))
print("mean from the raw ages          : " + str(mean_from_raw_ages))
print("years the bucketing hid         : " + str(years_the_bucketing_hid))
print("understated share of the truth  : " + str(understated_share_per_myriad) + " per ten thousand")
print("")
print("the average-age computation")
print("  reads : the real recorded bucket for each respondent")
print("  covers : every respondent")
print("  mean : the honest weighted mean of the midpoints")
print("  intent : the average age")
print("  respondents omitted : 0")
print("  verdict : MIDPOINT MEAN IS 42, COMPUTED CORRECTLY")
print("")
print("  taking the honest weighted mean of the midpoints over")
print("  every respondent is the part done right here, and it is")
print("  why 42 is the correct mean of the midpoints")
print("")
print("the midpoint substitution")
print("  what is recorded : the bucket, never the age")
print("  what the midpoint assumes : the age sits at the bucket's")
print("    center")
print("  when that holds : only if ages are symmetric within each")
print("    bucket")
print("  the real distribution : skews old, and the top bucket is")
print("    open-ended with a guessed center")
print("  so the midpoint mean : is the mean of the assumption, not")
print("    of the ages")
print("")
print("the result of the survey")
print("  reported average age : " + str(mean_from_bucket_midpoints))
print("  average from the raw ages : " + str(mean_from_raw_ages))
print("  years hidden by the bucketing : " + str(years_the_bucketing_hid))
print("  is the midpoint mean miscomputed : no; 42 is exact for")
print("    the midpoints")
print("  is 42 the average age : no; interval censoring replaced")
print("    each age with a center it need not sit at")
print("")
nc_mean_from_midpoints = 42
nc_mean_from_raw_ages = 47
nc_years_the_raw_value_recovers = 5
print("null control - record the raw age, not only the bucket")
print("  mean from midpoints : " + str(nc_mean_from_midpoints))
print("  mean from raw ages : " + str(nc_mean_from_raw_ages))
print("  years the raw value recovers : " + str(nc_years_the_raw_value_recovers))
print("  no respondent and no bucket boundary changed; each age")
print("  stopped being read as its bucket's center and started")
print("  being read as itself")
print("")
print("what a mean of bucket midpoints guarantees")
print("  it is the correct mean of the midpoints : exactly, real")
print("    buckets, every respondent, honest weighting")
print("  it is the mean of the ages : not addressed; only the")
print("    bucket is recorded, so each age becomes its bucket's")
print("    center, and a skewed distribution plus an open top")
print("    bucket moves the true mean to " + str(mean_from_raw_ages))
print("")
print("a bucket keeps which interval a value fell in and forgets where inside it; the")
print("midpoint puts it back at the center, which is a fact about the interval, not the")
print("value, and a skew within the bucket is invisible to a mean of centers")
print("")
print("It takes the honest weighted mean of the midpoints over every respondent - 42 is")
print("the exact midpoint mean. But only the bucket was recorded, so each age is read as")
print("its center; with a skewed distribution and an open top bucket the true mean is " + str(mean_from_raw_ages) + ",")
print("" + str(understated_share_per_myriad) + " per ten thousand understated, until the raw age is recorded.")
```

## stdout (executed)

```text
respondents                     : 100000
mean from bucket midpoints      : 42
mean from the raw ages          : 47
years the bucketing hid         : 5
understated share of the truth  : 1063 per ten thousand

the average-age computation
  reads : the real recorded bucket for each respondent
  covers : every respondent
  mean : the honest weighted mean of the midpoints
  intent : the average age
  respondents omitted : 0
  verdict : MIDPOINT MEAN IS 42, COMPUTED CORRECTLY

  taking the honest weighted mean of the midpoints over
  every respondent is the part done right here, and it is
  why 42 is the correct mean of the midpoints

the midpoint substitution
  what is recorded : the bucket, never the age
  what the midpoint assumes : the age sits at the bucket's
    center
  when that holds : only if ages are symmetric within each
    bucket
  the real distribution : skews old, and the top bucket is
    open-ended with a guessed center
  so the midpoint mean : is the mean of the assumption, not
    of the ages

the result of the survey
  reported average age : 42
  average from the raw ages : 47
  years hidden by the bucketing : 5
  is the midpoint mean miscomputed : no; 42 is exact for
    the midpoints
  is 42 the average age : no; interval censoring replaced
    each age with a center it need not sit at

null control - record the raw age, not only the bucket
  mean from midpoints : 42
  mean from raw ages : 47
  years the raw value recovers : 5
  no respondent and no bucket boundary changed; each age
  stopped being read as its bucket's center and started
  being read as itself

what a mean of bucket midpoints guarantees
  it is the correct mean of the midpoints : exactly, real
    buckets, every respondent, honest weighting
  it is the mean of the ages : not addressed; only the
    bucket is recorded, so each age becomes its bucket's
    center, and a skewed distribution plus an open top
    bucket moves the true mean to 47

a bucket keeps which interval a value fell in and forgets where inside it; the
midpoint puts it back at the center, which is a fact about the interval, not the
value, and a skew within the bucket is invisible to a mean of centers

It takes the honest weighted mean of the midpoints over every respondent - 42 is
the exact midpoint mean. But only the bucket was recorded, so each age is read as
its center; with a skewed distribution and an open top bucket the true mean is 47,
1063 per ten thousand understated, until the raw age is recorded.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
