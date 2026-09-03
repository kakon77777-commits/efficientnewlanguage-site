<!-- canonical: efficientnewlanguage.org/ai/examples/672-the-average-was-weighted-and-the-weights-were-stale | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 672 — The average was weighted and the weights were stale

`the_average_was_weighted_and_the_weights_were_stale.eml` - The fleet latency is a weighted average, which is the right shape, and the arithmetic is exact. What it reports is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The fleet latency
# is a weighted average, which is the right shape, and the arithmetic is exact.
# What it reports is computed below.
#
# Weighting is the correct choice and someone argued for it. An unweighted mean
# over five regions treats a region serving two percent of traffic as equal to
# one serving a third, which is how a small region's noise moves a headline
# number. The weighted form fixes that, the weights sum to one, and the
# computation has no rounding error worth naming.
#
# The weights are a config file. They were correct when written; traffic moved,
# and nothing recomputes them, because a weight is an input and inputs do not
# have freshness checks.
#
# The region carrying a third of the traffic is weighted at nine percent.

900 => weight_of_the_heavy_region_per_myriad
3400 => actual_share_of_the_heavy_region_per_myriad
890 => latency_of_the_heavy_region_ms
120 => latency_of_the_others_ms
96 => days_since_the_weights_were_updated
5 => regions

10000 - weight_of_the_heavy_region_per_myriad => weight_of_the_others_per_myriad
10000 - actual_share_of_the_heavy_region_per_myriad => actual_share_of_the_others_per_myriad

int((weight_of_the_heavy_region_per_myriad * latency_of_the_heavy_region_ms + weight_of_the_others_per_myriad * latency_of_the_others_ms) / 10000) => reported_ms
int((actual_share_of_the_heavy_region_per_myriad * latency_of_the_heavy_region_ms + actual_share_of_the_others_per_myriad * latency_of_the_others_ms) / 10000) => experienced_ms
experienced_ms - reported_ms => understated_by_ms

"regions                        : " + str(regions) ^0
"weight of the heavy region     : " + str(weight_of_the_heavy_region_per_myriad) + " per ten thousand" ^0
"its actual share of traffic    : " + str(actual_share_of_the_heavy_region_per_myriad) + " per ten thousand" ^0
"days since the weights changed : " + str(days_since_the_weights_were_updated) ^0
"" ^0
"latency there, ms              : " + str(latency_of_the_heavy_region_ms) ^0
"latency elsewhere, ms          : " + str(latency_of_the_others_ms) ^0
"reported average, ms           : " + str(reported_ms) ^0
"experienced average, ms        : " + str(experienced_ms) ^0
"understated by, ms             : " + str(understated_by_ms) ^0
"" ^0

# ---- what the weighting fixed ----

"why the average is weighted" ^0
"  unweighted mean over " + str(regions) + " regions : treats a two" ^0
"    percent region as equal to a third" ^0
"  weights sum to one   : yes" ^0
"  rounding error       : none worth naming" ^0
"  argued for by        : someone who had watched a small" ^0
"    region's noise move the headline" ^0
"  verdict              : CORRECTLY WEIGHTED" ^0
"" ^0
"  the shape is right and switching back would be worse" ^0
"" ^0

# ---- what a weight is ----

"the two kinds of input" ^0
"  latency per region : measured, continuously" ^0
"  weight per region  : written, once, in a file" ^0
"  freshness check on the first  : yes, it alerts on gaps" ^0
"  freshness check on the second : none, because a config" ^0
"    value is not a measurement and nothing watches it age" ^0
"" ^0

int(actual_share_of_the_heavy_region_per_myriad / weight_of_the_heavy_region_per_myriad) => share_over_weight
"the heavy region's share is its weight times : " + str(share_over_weight) ^0
"" ^0

# ---- what the error looks like ----

# The reported number is stable, plausible, and moves in the right direction
# when latency moves. Nothing about it looks like a stale input; it looks like
# a fleet that is faster than the one people are using.
"reading the dashboard" ^0
"  the number is stable            : yes" ^0
"  it moves when latency moves     : yes" ^0
"  it is within the range of the per-region numbers : yes" ^0
"  it equals what any user experiences : no, and nothing" ^0
"    on the page is the number that would" ^0
"" ^0

# ---- null control ----

# The same weighted average, with the weights recomputed from the traffic the
# same pipeline already measures.
actual_share_of_the_heavy_region_per_myriad => nc_weight_of_the_heavy_region
experienced_ms => nc_reported_ms

"null control - the weights recomputed from measured traffic" ^0
"  weights sum to one : yes, unchanged" ^0
"  weight of the heavy region : " + str(nc_weight_of_the_heavy_region) + " per ten thousand" ^0
"  reported average, ms : " + str(nc_reported_ms) ^0
"  the average did not become better shaped; its second" ^0
"  input started being measured like its first" ^0
"" ^0

# ---- the rule ----

"what a weighted average guarantees" ^0
"  each part counts in proportion to its weight : exactly" ^0
"  each part counts in proportion to its size   : not" ^0
"    addressed; the weight is an assertion about the size," ^0
"    made once, and the size is free to move" ^0
"" ^0
"a formula's correctness is a claim about its arithmetic; every" ^0
"input it names is a separate claim, and the ones written by" ^0
"hand are the ones with no clock on them" ^0
"" ^0

"The average is correctly weighted and the arithmetic is exact: the weights sum" ^0
"to one, the shape was chosen over an unweighted mean for a real reason. The" ^0
"weights were written " + str(days_since_the_weights_were_updated) + " days ago and the heavy region now carries " + str(share_over_weight) + " times" ^0
"its weight, so the dashboard reports " + str(reported_ms) + " ms where the traffic experiences " + str(experienced_ms) + " -" ^0
"understated by " + str(understated_by_ms) + " ms - and every number on the page is individually correct." ^0
```

## Python (deterministic transpilation)

```python
weight_of_the_heavy_region_per_myriad = 900
actual_share_of_the_heavy_region_per_myriad = 3400
latency_of_the_heavy_region_ms = 890
latency_of_the_others_ms = 120
days_since_the_weights_were_updated = 96
regions = 5
weight_of_the_others_per_myriad = 10000 - weight_of_the_heavy_region_per_myriad
actual_share_of_the_others_per_myriad = 10000 - actual_share_of_the_heavy_region_per_myriad
reported_ms = int((weight_of_the_heavy_region_per_myriad * latency_of_the_heavy_region_ms + weight_of_the_others_per_myriad * latency_of_the_others_ms) / 10000)
experienced_ms = int((actual_share_of_the_heavy_region_per_myriad * latency_of_the_heavy_region_ms + actual_share_of_the_others_per_myriad * latency_of_the_others_ms) / 10000)
understated_by_ms = experienced_ms - reported_ms
print("regions                        : " + str(regions))
print("weight of the heavy region     : " + str(weight_of_the_heavy_region_per_myriad) + " per ten thousand")
print("its actual share of traffic    : " + str(actual_share_of_the_heavy_region_per_myriad) + " per ten thousand")
print("days since the weights changed : " + str(days_since_the_weights_were_updated))
print("")
print("latency there, ms              : " + str(latency_of_the_heavy_region_ms))
print("latency elsewhere, ms          : " + str(latency_of_the_others_ms))
print("reported average, ms           : " + str(reported_ms))
print("experienced average, ms        : " + str(experienced_ms))
print("understated by, ms             : " + str(understated_by_ms))
print("")
print("why the average is weighted")
print("  unweighted mean over " + str(regions) + " regions : treats a two")
print("    percent region as equal to a third")
print("  weights sum to one   : yes")
print("  rounding error       : none worth naming")
print("  argued for by        : someone who had watched a small")
print("    region's noise move the headline")
print("  verdict              : CORRECTLY WEIGHTED")
print("")
print("  the shape is right and switching back would be worse")
print("")
print("the two kinds of input")
print("  latency per region : measured, continuously")
print("  weight per region  : written, once, in a file")
print("  freshness check on the first  : yes, it alerts on gaps")
print("  freshness check on the second : none, because a config")
print("    value is not a measurement and nothing watches it age")
print("")
share_over_weight = int(actual_share_of_the_heavy_region_per_myriad / weight_of_the_heavy_region_per_myriad)
print("the heavy region's share is its weight times : " + str(share_over_weight))
print("")
print("reading the dashboard")
print("  the number is stable            : yes")
print("  it moves when latency moves     : yes")
print("  it is within the range of the per-region numbers : yes")
print("  it equals what any user experiences : no, and nothing")
print("    on the page is the number that would")
print("")
nc_weight_of_the_heavy_region = actual_share_of_the_heavy_region_per_myriad
nc_reported_ms = experienced_ms
print("null control - the weights recomputed from measured traffic")
print("  weights sum to one : yes, unchanged")
print("  weight of the heavy region : " + str(nc_weight_of_the_heavy_region) + " per ten thousand")
print("  reported average, ms : " + str(nc_reported_ms))
print("  the average did not become better shaped; its second")
print("  input started being measured like its first")
print("")
print("what a weighted average guarantees")
print("  each part counts in proportion to its weight : exactly")
print("  each part counts in proportion to its size   : not")
print("    addressed; the weight is an assertion about the size,")
print("    made once, and the size is free to move")
print("")
print("a formula's correctness is a claim about its arithmetic; every")
print("input it names is a separate claim, and the ones written by")
print("hand are the ones with no clock on them")
print("")
print("The average is correctly weighted and the arithmetic is exact: the weights sum")
print("to one, the shape was chosen over an unweighted mean for a real reason. The")
print("weights were written " + str(days_since_the_weights_were_updated) + " days ago and the heavy region now carries " + str(share_over_weight) + " times")
print("its weight, so the dashboard reports " + str(reported_ms) + " ms where the traffic experiences " + str(experienced_ms) + " -")
print("understated by " + str(understated_by_ms) + " ms - and every number on the page is individually correct.")
```

## stdout (executed)

```text
regions                        : 5
weight of the heavy region     : 900 per ten thousand
its actual share of traffic    : 3400 per ten thousand
days since the weights changed : 96

latency there, ms              : 890
latency elsewhere, ms          : 120
reported average, ms           : 189
experienced average, ms        : 381
understated by, ms             : 192

why the average is weighted
  unweighted mean over 5 regions : treats a two
    percent region as equal to a third
  weights sum to one   : yes
  rounding error       : none worth naming
  argued for by        : someone who had watched a small
    region's noise move the headline
  verdict              : CORRECTLY WEIGHTED

  the shape is right and switching back would be worse

the two kinds of input
  latency per region : measured, continuously
  weight per region  : written, once, in a file
  freshness check on the first  : yes, it alerts on gaps
  freshness check on the second : none, because a config
    value is not a measurement and nothing watches it age

the heavy region's share is its weight times : 3

reading the dashboard
  the number is stable            : yes
  it moves when latency moves     : yes
  it is within the range of the per-region numbers : yes
  it equals what any user experiences : no, and nothing
    on the page is the number that would

null control - the weights recomputed from measured traffic
  weights sum to one : yes, unchanged
  weight of the heavy region : 3400 per ten thousand
  reported average, ms : 381
  the average did not become better shaped; its second
  input started being measured like its first

what a weighted average guarantees
  each part counts in proportion to its weight : exactly
  each part counts in proportion to its size   : not
    addressed; the weight is an assertion about the size,
    made once, and the size is free to move

a formula's correctness is a claim about its arithmetic; every
input it names is a separate claim, and the ones written by
hand are the ones with no clock on them

The average is correctly weighted and the arithmetic is exact: the weights sum
to one, the shape was chosen over an unweighted mean for a real reason. The
weights were written 96 days ago and the heavy region now carries 3 times
its weight, so the dashboard reports 189 ms where the traffic experiences 381 -
understated by 192 ms - and every number on the page is individually correct.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
