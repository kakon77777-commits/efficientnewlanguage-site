<!-- canonical: efficientnewlanguage.org/ai/examples/781-the-capacity-was-sufficient-and-one-hour-a-week-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 781 — The capacity was sufficient and one hour a week was not

`the_capacity_was_sufficient_and_one_hour_a_week_was_not.eml` - Capacity planning has shown comfortable headroom for fourteen months, and the planning is careful. What the headroom is an average over is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Capacity planning
# has shown comfortable headroom for fourteen months, and the planning is
# careful. What the headroom is an average over is computed below.
#
# The planning is done properly. Utilisation is measured on the containers that
# actually run rather than on the nodes they sit on; the figure includes the
# sidecars, which are usually forgotten; growth is projected from the last four
# quarters rather than from the best one; and a review that finds headroom below
# the floor triggers a purchase rather than a conversation.
#
# Utilisation is the mean over the week.

4800 => cores_provisioned
4100 => mean_utilisation_per_myriad
9800 => peak_utilisation_per_myriad
5000 => headroom_floor_per_myriad
168 => hours_in_a_week
3 => hours_a_week_above_the_floor
14 => months_of_comfortable_headroom
42000000 => requests_a_week
1900000 => requests_in_those_three_hours
61000 => requests_shed_in_those_three_hours
4 => capacity_reviews_a_year_that_read_the_mean
0 => capacity_reviews_a_year_that_read_the_peak

hours_in_a_week - hours_a_week_above_the_floor => hours_a_week_below_the_floor
peak_utilisation_per_myriad - mean_utilisation_per_myriad => the_distance_between_peak_and_mean
capacity_reviews_a_year_that_read_the_mean - capacity_reviews_a_year_that_read_the_peak => reviews_that_read_only_the_mean
int(requests_shed_in_those_three_hours * 10000 / requests_a_week) => shed_over_the_week_per_myriad
int(requests_shed_in_those_three_hours * 10000 / requests_in_those_three_hours) => shed_inside_those_hours_per_myriad
int(requests_in_those_three_hours * 10000 / requests_a_week) => traffic_in_those_hours_per_myriad

"cores provisioned               : " + str(cores_provisioned) ^0
"mean utilisation                : " + str(mean_utilisation_per_myriad) + " per ten thousand" ^0
"headroom floor                  : " + str(headroom_floor_per_myriad) + " per ten thousand" ^0
"months of comfortable headroom  : " + str(months_of_comfortable_headroom) ^0
"" ^0
"hours in a week                 : " + str(hours_in_a_week) ^0
"  above the floor               : " + str(hours_a_week_above_the_floor) ^0
"  below it                      : " + str(hours_a_week_below_the_floor) ^0
"peak utilisation                : " + str(peak_utilisation_per_myriad) + " per ten thousand" ^0
"  distance from the mean        : " + str(the_distance_between_peak_and_mean) + " per ten thousand" ^0
"" ^0
"requests a week                 : " + str(requests_a_week) ^0
"  in those three hours          : " + str(requests_in_those_three_hours) ^0
"  traffic in those hours        : " + str(traffic_in_those_hours_per_myriad) + " per ten thousand" ^0
"requests shed in those hours    : " + str(requests_shed_in_those_three_hours) ^0
"  shed, over the week           : " + str(shed_over_the_week_per_myriad) + " per ten thousand" ^0
"  shed, inside those hours      : " + str(shed_inside_those_hours_per_myriad) + " per ten thousand" ^0
"" ^0
"capacity reviews a year" ^0
"  that read the mean            : " + str(capacity_reviews_a_year_that_read_the_mean) ^0
"  that read the peak            : " + str(capacity_reviews_a_year_that_read_the_peak) ^0
"  that read only the mean       : " + str(reviews_that_read_only_the_mean) ^0
"" ^0

# ---- what the planning verified ----

"the capacity review" ^0
"  what utilisation is measured on : the containers that" ^0
"    run, not the nodes they sit on" ^0
"  sidecars : included, which is the part usually" ^0
"    forgotten" ^0
"  growth : projected from four quarters, not the best" ^0
"    one" ^0
"  headroom below the floor : triggers a purchase, not a" ^0
"    conversation" ^0
"  months comfortable : " + str(months_of_comfortable_headroom) ^0
"  verdict : SUFFICIENT" ^0
"" ^0
"  counting the sidecars is the part almost nobody does," ^0
"  and it is why " + str(mean_utilisation_per_myriad) + " per ten thousand is not an" ^0
"  understatement" ^0
"" ^0

# ---- what a mean over a week holds ----

"the same week, two ways" ^0
"  as a mean : " + str(mean_utilisation_per_myriad) + " per ten thousand, comfortably" ^0
"    under the floor of " + str(headroom_floor_per_myriad) ^0
"  at its peak : " + str(peak_utilisation_per_myriad) + " per ten thousand" ^0
"  the distance : " + str(the_distance_between_peak_and_mean) + " per ten thousand" ^0
"  hours spent up there : " + str(hours_a_week_above_the_floor) + " of " + str(hours_in_a_week) ^0
"  hours spent below : " + str(hours_a_week_below_the_floor) ^0
"" ^0
"  a hundred and sixty-five quiet hours are enough to" ^0
"  average away three loud ones, and the three are when" ^0
"  the work arrives" ^0
"" ^0

# ---- what happens in the three hours ----

"inside the peak" ^0
"  traffic there : " + str(traffic_in_those_hours_per_myriad) + " per ten thousand of the week" ^0
"  requests shed there : " + str(requests_shed_in_those_three_hours) ^0
"  shed as a share of the week : " ^0
"    " + str(shed_over_the_week_per_myriad) + " per ten thousand" ^0
"  shed as a share of those hours : " ^0
"    " + str(shed_inside_those_hours_per_myriad) + " per ten thousand" ^0
"  which of those two the capacity review reads : " ^0
"    neither; it reads the mean utilisation" ^0
"  reviews that read the peak : " ^0
"    " + str(capacity_reviews_a_year_that_read_the_peak) ^0
"" ^0

# ---- null control ----

# The same planning, with the floor applied to the ninety-ninth percentile hour
# of the week instead of to the mean.
4100 => nc_mean_utilisation_per_myriad
9800 => nc_percentile_hour_utilisation_per_myriad
1 => nc_reviews_that_would_have_triggered_a_purchase

"null control - apply the floor to the busiest hour" ^0
"  mean utilisation : " + str(nc_mean_utilisation_per_myriad) + ", unchanged" ^0
"  the hour the floor now reads : " ^0
"    " + str(nc_percentile_hour_utilisation_per_myriad) + " per ten thousand" ^0
"  reviews that would have triggered a purchase : " ^0
"    " + str(nc_reviews_that_would_have_triggered_a_purchase) ^0
"  no container changed and no hour got busier; the" ^0
"  statistic the floor is applied to stopped being the one" ^0
"  the quiet hours dominate" ^0
"" ^0

# ---- the rule ----

"what comfortable headroom guarantees" ^0
"  mean utilisation is under the floor : exactly," ^0
"    measured on the containers, sidecars included," ^0
"    projected from four quarters, " + str(months_of_comfortable_headroom) + " months" ^0
"  the system has enough capacity : not addressed; the" ^0
"    mean is taken over " + str(hours_in_a_week) + " hours and the shedding" ^0
"    happens in " + str(hours_a_week_above_the_floor) + " of them" ^0
"" ^0
"a mean is a statement about a period and none about any" ^0
"moment in it; where demand is concentrated the average is" ^0
"lowest exactly because most of the period is idle" ^0
"" ^0

"Utilisation is measured on the containers with sidecars counted, growth comes" ^0
"from four quarters, and a breach buys hardware - " + str(mean_utilisation_per_myriad) + " per ten thousand against a" ^0
"floor of " + str(headroom_floor_per_myriad) + ", " + str(months_of_comfortable_headroom) + " months. It is a mean over " + str(hours_in_a_week) + " hours, so the " + str(hours_a_week_above_the_floor) + " that reach " ^0
"" + str(peak_utilisation_per_myriad) + " shed " + str(requests_shed_in_those_three_hours) + " requests - " + str(shed_inside_those_hours_per_myriad) + " per ten thousand of what arrives then and " ^0
"" + str(shed_over_the_week_per_myriad) + " per ten thousand of the week - across " + str(capacity_reviews_a_year_that_read_the_peak) + " reviews that read the peak." ^0
```

## Python (deterministic transpilation)

```python
cores_provisioned = 4800
mean_utilisation_per_myriad = 4100
peak_utilisation_per_myriad = 9800
headroom_floor_per_myriad = 5000
hours_in_a_week = 168
hours_a_week_above_the_floor = 3
months_of_comfortable_headroom = 14
requests_a_week = 42000000
requests_in_those_three_hours = 1900000
requests_shed_in_those_three_hours = 61000
capacity_reviews_a_year_that_read_the_mean = 4
capacity_reviews_a_year_that_read_the_peak = 0
hours_a_week_below_the_floor = hours_in_a_week - hours_a_week_above_the_floor
the_distance_between_peak_and_mean = peak_utilisation_per_myriad - mean_utilisation_per_myriad
reviews_that_read_only_the_mean = capacity_reviews_a_year_that_read_the_mean - capacity_reviews_a_year_that_read_the_peak
shed_over_the_week_per_myriad = int(requests_shed_in_those_three_hours * 10000 / requests_a_week)
shed_inside_those_hours_per_myriad = int(requests_shed_in_those_three_hours * 10000 / requests_in_those_three_hours)
traffic_in_those_hours_per_myriad = int(requests_in_those_three_hours * 10000 / requests_a_week)
print("cores provisioned               : " + str(cores_provisioned))
print("mean utilisation                : " + str(mean_utilisation_per_myriad) + " per ten thousand")
print("headroom floor                  : " + str(headroom_floor_per_myriad) + " per ten thousand")
print("months of comfortable headroom  : " + str(months_of_comfortable_headroom))
print("")
print("hours in a week                 : " + str(hours_in_a_week))
print("  above the floor               : " + str(hours_a_week_above_the_floor))
print("  below it                      : " + str(hours_a_week_below_the_floor))
print("peak utilisation                : " + str(peak_utilisation_per_myriad) + " per ten thousand")
print("  distance from the mean        : " + str(the_distance_between_peak_and_mean) + " per ten thousand")
print("")
print("requests a week                 : " + str(requests_a_week))
print("  in those three hours          : " + str(requests_in_those_three_hours))
print("  traffic in those hours        : " + str(traffic_in_those_hours_per_myriad) + " per ten thousand")
print("requests shed in those hours    : " + str(requests_shed_in_those_three_hours))
print("  shed, over the week           : " + str(shed_over_the_week_per_myriad) + " per ten thousand")
print("  shed, inside those hours      : " + str(shed_inside_those_hours_per_myriad) + " per ten thousand")
print("")
print("capacity reviews a year")
print("  that read the mean            : " + str(capacity_reviews_a_year_that_read_the_mean))
print("  that read the peak            : " + str(capacity_reviews_a_year_that_read_the_peak))
print("  that read only the mean       : " + str(reviews_that_read_only_the_mean))
print("")
print("the capacity review")
print("  what utilisation is measured on : the containers that")
print("    run, not the nodes they sit on")
print("  sidecars : included, which is the part usually")
print("    forgotten")
print("  growth : projected from four quarters, not the best")
print("    one")
print("  headroom below the floor : triggers a purchase, not a")
print("    conversation")
print("  months comfortable : " + str(months_of_comfortable_headroom))
print("  verdict : SUFFICIENT")
print("")
print("  counting the sidecars is the part almost nobody does,")
print("  and it is why " + str(mean_utilisation_per_myriad) + " per ten thousand is not an")
print("  understatement")
print("")
print("the same week, two ways")
print("  as a mean : " + str(mean_utilisation_per_myriad) + " per ten thousand, comfortably")
print("    under the floor of " + str(headroom_floor_per_myriad))
print("  at its peak : " + str(peak_utilisation_per_myriad) + " per ten thousand")
print("  the distance : " + str(the_distance_between_peak_and_mean) + " per ten thousand")
print("  hours spent up there : " + str(hours_a_week_above_the_floor) + " of " + str(hours_in_a_week))
print("  hours spent below : " + str(hours_a_week_below_the_floor))
print("")
print("  a hundred and sixty-five quiet hours are enough to")
print("  average away three loud ones, and the three are when")
print("  the work arrives")
print("")
print("inside the peak")
print("  traffic there : " + str(traffic_in_those_hours_per_myriad) + " per ten thousand of the week")
print("  requests shed there : " + str(requests_shed_in_those_three_hours))
print("  shed as a share of the week : ")
print("    " + str(shed_over_the_week_per_myriad) + " per ten thousand")
print("  shed as a share of those hours : ")
print("    " + str(shed_inside_those_hours_per_myriad) + " per ten thousand")
print("  which of those two the capacity review reads : ")
print("    neither; it reads the mean utilisation")
print("  reviews that read the peak : ")
print("    " + str(capacity_reviews_a_year_that_read_the_peak))
print("")
nc_mean_utilisation_per_myriad = 4100
nc_percentile_hour_utilisation_per_myriad = 9800
nc_reviews_that_would_have_triggered_a_purchase = 1
print("null control - apply the floor to the busiest hour")
print("  mean utilisation : " + str(nc_mean_utilisation_per_myriad) + ", unchanged")
print("  the hour the floor now reads : ")
print("    " + str(nc_percentile_hour_utilisation_per_myriad) + " per ten thousand")
print("  reviews that would have triggered a purchase : ")
print("    " + str(nc_reviews_that_would_have_triggered_a_purchase))
print("  no container changed and no hour got busier; the")
print("  statistic the floor is applied to stopped being the one")
print("  the quiet hours dominate")
print("")
print("what comfortable headroom guarantees")
print("  mean utilisation is under the floor : exactly,")
print("    measured on the containers, sidecars included,")
print("    projected from four quarters, " + str(months_of_comfortable_headroom) + " months")
print("  the system has enough capacity : not addressed; the")
print("    mean is taken over " + str(hours_in_a_week) + " hours and the shedding")
print("    happens in " + str(hours_a_week_above_the_floor) + " of them")
print("")
print("a mean is a statement about a period and none about any")
print("moment in it; where demand is concentrated the average is")
print("lowest exactly because most of the period is idle")
print("")
print("Utilisation is measured on the containers with sidecars counted, growth comes")
print("from four quarters, and a breach buys hardware - " + str(mean_utilisation_per_myriad) + " per ten thousand against a")
print("floor of " + str(headroom_floor_per_myriad) + ", " + str(months_of_comfortable_headroom) + " months. It is a mean over " + str(hours_in_a_week) + " hours, so the " + str(hours_a_week_above_the_floor) + " that reach ")
print("" + str(peak_utilisation_per_myriad) + " shed " + str(requests_shed_in_those_three_hours) + " requests - " + str(shed_inside_those_hours_per_myriad) + " per ten thousand of what arrives then and ")
print("" + str(shed_over_the_week_per_myriad) + " per ten thousand of the week - across " + str(capacity_reviews_a_year_that_read_the_peak) + " reviews that read the peak.")
```

## stdout (executed)

```text
cores provisioned               : 4800
mean utilisation                : 4100 per ten thousand
headroom floor                  : 5000 per ten thousand
months of comfortable headroom  : 14

hours in a week                 : 168
  above the floor               : 3
  below it                      : 165
peak utilisation                : 9800 per ten thousand
  distance from the mean        : 5700 per ten thousand

requests a week                 : 42000000
  in those three hours          : 1900000
  traffic in those hours        : 452 per ten thousand
requests shed in those hours    : 61000
  shed, over the week           : 14 per ten thousand
  shed, inside those hours      : 321 per ten thousand

capacity reviews a year
  that read the mean            : 4
  that read the peak            : 0
  that read only the mean       : 4

the capacity review
  what utilisation is measured on : the containers that
    run, not the nodes they sit on
  sidecars : included, which is the part usually
    forgotten
  growth : projected from four quarters, not the best
    one
  headroom below the floor : triggers a purchase, not a
    conversation
  months comfortable : 14
  verdict : SUFFICIENT

  counting the sidecars is the part almost nobody does,
  and it is why 4100 per ten thousand is not an
  understatement

the same week, two ways
  as a mean : 4100 per ten thousand, comfortably
    under the floor of 5000
  at its peak : 9800 per ten thousand
  the distance : 5700 per ten thousand
  hours spent up there : 3 of 168
  hours spent below : 165

  a hundred and sixty-five quiet hours are enough to
  average away three loud ones, and the three are when
  the work arrives

inside the peak
  traffic there : 452 per ten thousand of the week
  requests shed there : 61000
  shed as a share of the week : 
    14 per ten thousand
  shed as a share of those hours : 
    321 per ten thousand
  which of those two the capacity review reads : 
    neither; it reads the mean utilisation
  reviews that read the peak : 
    0

null control - apply the floor to the busiest hour
  mean utilisation : 4100, unchanged
  the hour the floor now reads : 
    9800 per ten thousand
  reviews that would have triggered a purchase : 
    1
  no container changed and no hour got busier; the
  statistic the floor is applied to stopped being the one
  the quiet hours dominate

what comfortable headroom guarantees
  mean utilisation is under the floor : exactly,
    measured on the containers, sidecars included,
    projected from four quarters, 14 months
  the system has enough capacity : not addressed; the
    mean is taken over 168 hours and the shedding
    happens in 3 of them

a mean is a statement about a period and none about any
moment in it; where demand is concentrated the average is
lowest exactly because most of the period is idle

Utilisation is measured on the containers with sidecars counted, growth comes
from four quarters, and a breach buys hardware - 4100 per ten thousand against a
floor of 5000, 14 months. It is a mean over 168 hours, so the 3 that reach 
9800 shed 61000 requests - 321 per ten thousand of what arrives then and 
14 per ten thousand of the week - across 0 reviews that read the peak.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
