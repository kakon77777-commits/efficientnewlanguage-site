<!-- canonical: efficientnewlanguage.org/ai/examples/747-each-region-had-headroom-and-the-failover-chose-one | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 747 — Each region had headroom and the failover chose one

`each_region_had_headroom_and_the_failover_chose_one.eml` - Every region runs at sixty percent and the capacity plan requires forty percent headroom in each, checked weekly. What a failover asks for is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every region runs
# at sixty percent and the capacity plan requires forty percent headroom in
# each, checked weekly. What a failover asks for is computed below.
#
# The headroom rule is real capacity planning. It is not a number somebody
# remembered; it is checked weekly against measured peak rather than average,
# it is enforced by refusing to schedule new load into a region above the line,
# it has forced two capacity purchases, and every one of the four regions is
# inside it today.
#
# The rule is per REGION. A regional failover moves one region's traffic onto
# the others, and the headroom that receives it is the headroom of the regions
# that are left, not of the fleet.
#
# The routing policy sends a failed region's traffic to its nearest neighbour.

4 => regions
60 => utilisation_percent_per_region
40 => required_headroom_percent
100 => a_whole_percent
4 => regions_inside_the_rule
2 => capacity_purchases_the_rule_forced
1 => regions_a_failover_sends_traffic_to
0 => checks_on_the_post_failover_figure

a_whole_percent - utilisation_percent_per_region => actual_headroom_percent
utilisation_percent_per_region * regions_a_failover_sends_traffic_to => percent_arriving_at_the_neighbour
utilisation_percent_per_region + percent_arriving_at_the_neighbour => neighbour_utilisation_after_failover
neighbour_utilisation_after_failover - a_whole_percent => percent_over_capacity
regions - regions_a_failover_sends_traffic_to => regions_not_receiving_the_traffic

"regions                         : " + str(regions) ^0
"utilisation per region, percent : " + str(utilisation_percent_per_region) ^0
"required headroom, percent      : " + str(required_headroom_percent) ^0
"actual headroom, percent        : " + str(actual_headroom_percent) ^0
"regions inside the rule         : " + str(regions_inside_the_rule) ^0
"capacity purchases it forced    : " + str(capacity_purchases_the_rule_forced) ^0
"" ^0
"regions a failover sends traffic to : " + str(regions_a_failover_sends_traffic_to) ^0
"  regions not receiving it      : " + str(regions_not_receiving_the_traffic) ^0
"  percent arriving there        : " + str(percent_arriving_at_the_neighbour) ^0
"  its utilisation after         : " + str(neighbour_utilisation_after_failover) ^0
"  over capacity by, percent     : " + str(percent_over_capacity) ^0
"checks on the post-failover figure : " + str(checks_on_the_post_failover_figure) ^0
"" ^0

# ---- what the rule verified ----

"the headroom rule" ^0
"  measured against : peak, not average" ^0
"  checked          : weekly" ^0
"  enforced by      : refusing to schedule new load into a" ^0
"    region above the line" ^0
"  capacity purchases it forced : " + str(capacity_purchases_the_rule_forced) ^0
"  regions inside it today : " + str(regions_inside_the_rule) + " of " + str(regions) ^0
"  verdict : HEADROOM EXISTS" ^0
"" ^0
"  measuring peak rather than average, and refusing new" ^0
"  load rather than warning, is what makes this a rule" ^0
"" ^0

# ---- what the rule is per ----

"the unit of the guarantee" ^0
"  what has " + str(actual_headroom_percent) + " percent spare : each region" ^0
"  what a failover needs spare : the regions that remain" ^0
"  how many receive the traffic : " + str(regions_a_failover_sends_traffic_to) + ", by routing policy" ^0
"  what arrives there : " + str(percent_arriving_at_the_neighbour) + " percent of a region" ^0
"  what it holds : " + str(actual_headroom_percent) + " percent" ^0
"  the difference : " + str(percent_over_capacity) + " percent" ^0
"" ^0
"  the headroom is real in every region and the arithmetic" ^0
"  that consumes it adds across regions" ^0
"" ^0

# ---- the fleet number looks fine ----

# Across four regions there is a hundred and sixty percent of a region spare
# against sixty percent needing a home. Stated as a fleet total the failover is
# comfortable, and no traffic is ever routed as a fleet total.
"the fleet arithmetic" ^0
"  regions : " + str(regions) ^0
"  spare per region, percent : " + str(actual_headroom_percent) ^0
"  traffic needing a home : " + str(utilisation_percent_per_region) + " percent of one region" ^0
"  is there enough spare in total : comfortably" ^0
"  is any of it where the traffic goes : " + str(regions_a_failover_sends_traffic_to) + " region's worth" ^0
"  what routes traffic : a policy, not a total" ^0
"" ^0

# ---- what the weekly check reads ----

"the weekly check" ^0
"  what it computes : utilisation and headroom, per region" ^0
"  is every figure correct : yes" ^0
"  does it model the loss of a region : " + str(checks_on_the_post_failover_figure) + " times" ^0
"  what such a model needs : the routing policy, which is" ^0
"    in a different system" ^0
"  so the two facts live : apart, and neither is wrong" ^0
"" ^0

# ---- null control ----

# The same rule, evaluated on the post-failover distribution: each region must
# hold its own load plus whatever the routing policy would send it.
regions => nc_regions_receiving_a_share
0 => nc_percent_over_capacity
1 => nc_checks_on_the_post_failover_figure

"null control - headroom is checked after the failover" ^0
"  measured against peak : unchanged" ^0
"  checks on the post-failover figure : " + str(nc_checks_on_the_post_failover_figure) ^0
"  regions sharing a failed region's load : " + str(nc_regions_receiving_a_share) ^0
"  over capacity by, percent : " + str(nc_percent_over_capacity) ^0
"  no region gained capacity; the rule started being" ^0
"  evaluated on the state it exists for" ^0
"" ^0

# ---- the rule ----

"what per-region headroom guarantees" ^0
"  each region can absorb its own growth : exactly," ^0
"    measured on peak and enforced by refusal" ^0
"  the fleet can absorb a region's loss : not addressed;" ^0
"    the rule is a predicate on one region and a failover" ^0
"    is a statement about a redistribution" ^0
"" ^0
"a per-element margin is consumed by an event that moves load" ^0
"between elements, so the guarantee holds exactly where it is" ^0
"stated and the quantity that matters is a sum the rule never" ^0
"forms" ^0
"" ^0

"The rule is real capacity planning: measured on peak, checked weekly, enforced" ^0
"by refusing new load, and it forced " + str(capacity_purchases_the_rule_forced) + " purchases - all " + str(regions_inside_the_rule) + " regions are inside" ^0
"it. It is stated per region, and the routing policy sends a failed region's" ^0
str(utilisation_percent_per_region) + " percent to " + str(regions_a_failover_sends_traffic_to) + " neighbour holding " + str(actual_headroom_percent) + " percent spare, which is " + str(percent_over_capacity) ^0
"percent over, checked " + str(checks_on_the_post_failover_figure) + " times by the weekly review." ^0
```

## Python (deterministic transpilation)

```python
regions = 4
utilisation_percent_per_region = 60
required_headroom_percent = 40
a_whole_percent = 100
regions_inside_the_rule = 4
capacity_purchases_the_rule_forced = 2
regions_a_failover_sends_traffic_to = 1
checks_on_the_post_failover_figure = 0
actual_headroom_percent = a_whole_percent - utilisation_percent_per_region
percent_arriving_at_the_neighbour = utilisation_percent_per_region * regions_a_failover_sends_traffic_to
neighbour_utilisation_after_failover = utilisation_percent_per_region + percent_arriving_at_the_neighbour
percent_over_capacity = neighbour_utilisation_after_failover - a_whole_percent
regions_not_receiving_the_traffic = regions - regions_a_failover_sends_traffic_to
print("regions                         : " + str(regions))
print("utilisation per region, percent : " + str(utilisation_percent_per_region))
print("required headroom, percent      : " + str(required_headroom_percent))
print("actual headroom, percent        : " + str(actual_headroom_percent))
print("regions inside the rule         : " + str(regions_inside_the_rule))
print("capacity purchases it forced    : " + str(capacity_purchases_the_rule_forced))
print("")
print("regions a failover sends traffic to : " + str(regions_a_failover_sends_traffic_to))
print("  regions not receiving it      : " + str(regions_not_receiving_the_traffic))
print("  percent arriving there        : " + str(percent_arriving_at_the_neighbour))
print("  its utilisation after         : " + str(neighbour_utilisation_after_failover))
print("  over capacity by, percent     : " + str(percent_over_capacity))
print("checks on the post-failover figure : " + str(checks_on_the_post_failover_figure))
print("")
print("the headroom rule")
print("  measured against : peak, not average")
print("  checked          : weekly")
print("  enforced by      : refusing to schedule new load into a")
print("    region above the line")
print("  capacity purchases it forced : " + str(capacity_purchases_the_rule_forced))
print("  regions inside it today : " + str(regions_inside_the_rule) + " of " + str(regions))
print("  verdict : HEADROOM EXISTS")
print("")
print("  measuring peak rather than average, and refusing new")
print("  load rather than warning, is what makes this a rule")
print("")
print("the unit of the guarantee")
print("  what has " + str(actual_headroom_percent) + " percent spare : each region")
print("  what a failover needs spare : the regions that remain")
print("  how many receive the traffic : " + str(regions_a_failover_sends_traffic_to) + ", by routing policy")
print("  what arrives there : " + str(percent_arriving_at_the_neighbour) + " percent of a region")
print("  what it holds : " + str(actual_headroom_percent) + " percent")
print("  the difference : " + str(percent_over_capacity) + " percent")
print("")
print("  the headroom is real in every region and the arithmetic")
print("  that consumes it adds across regions")
print("")
print("the fleet arithmetic")
print("  regions : " + str(regions))
print("  spare per region, percent : " + str(actual_headroom_percent))
print("  traffic needing a home : " + str(utilisation_percent_per_region) + " percent of one region")
print("  is there enough spare in total : comfortably")
print("  is any of it where the traffic goes : " + str(regions_a_failover_sends_traffic_to) + " region's worth")
print("  what routes traffic : a policy, not a total")
print("")
print("the weekly check")
print("  what it computes : utilisation and headroom, per region")
print("  is every figure correct : yes")
print("  does it model the loss of a region : " + str(checks_on_the_post_failover_figure) + " times")
print("  what such a model needs : the routing policy, which is")
print("    in a different system")
print("  so the two facts live : apart, and neither is wrong")
print("")
nc_regions_receiving_a_share = regions
nc_percent_over_capacity = 0
nc_checks_on_the_post_failover_figure = 1
print("null control - headroom is checked after the failover")
print("  measured against peak : unchanged")
print("  checks on the post-failover figure : " + str(nc_checks_on_the_post_failover_figure))
print("  regions sharing a failed region's load : " + str(nc_regions_receiving_a_share))
print("  over capacity by, percent : " + str(nc_percent_over_capacity))
print("  no region gained capacity; the rule started being")
print("  evaluated on the state it exists for")
print("")
print("what per-region headroom guarantees")
print("  each region can absorb its own growth : exactly,")
print("    measured on peak and enforced by refusal")
print("  the fleet can absorb a region's loss : not addressed;")
print("    the rule is a predicate on one region and a failover")
print("    is a statement about a redistribution")
print("")
print("a per-element margin is consumed by an event that moves load")
print("between elements, so the guarantee holds exactly where it is")
print("stated and the quantity that matters is a sum the rule never")
print("forms")
print("")
print("The rule is real capacity planning: measured on peak, checked weekly, enforced")
print("by refusing new load, and it forced " + str(capacity_purchases_the_rule_forced) + " purchases - all " + str(regions_inside_the_rule) + " regions are inside")
print("it. It is stated per region, and the routing policy sends a failed region's")
print(str(utilisation_percent_per_region) + " percent to " + str(regions_a_failover_sends_traffic_to) + " neighbour holding " + str(actual_headroom_percent) + " percent spare, which is " + str(percent_over_capacity))
print("percent over, checked " + str(checks_on_the_post_failover_figure) + " times by the weekly review.")
```

## stdout (executed)

```text
regions                         : 4
utilisation per region, percent : 60
required headroom, percent      : 40
actual headroom, percent        : 40
regions inside the rule         : 4
capacity purchases it forced    : 2

regions a failover sends traffic to : 1
  regions not receiving it      : 3
  percent arriving there        : 60
  its utilisation after         : 120
  over capacity by, percent     : 20
checks on the post-failover figure : 0

the headroom rule
  measured against : peak, not average
  checked          : weekly
  enforced by      : refusing to schedule new load into a
    region above the line
  capacity purchases it forced : 2
  regions inside it today : 4 of 4
  verdict : HEADROOM EXISTS

  measuring peak rather than average, and refusing new
  load rather than warning, is what makes this a rule

the unit of the guarantee
  what has 40 percent spare : each region
  what a failover needs spare : the regions that remain
  how many receive the traffic : 1, by routing policy
  what arrives there : 60 percent of a region
  what it holds : 40 percent
  the difference : 20 percent

  the headroom is real in every region and the arithmetic
  that consumes it adds across regions

the fleet arithmetic
  regions : 4
  spare per region, percent : 40
  traffic needing a home : 60 percent of one region
  is there enough spare in total : comfortably
  is any of it where the traffic goes : 1 region's worth
  what routes traffic : a policy, not a total

the weekly check
  what it computes : utilisation and headroom, per region
  is every figure correct : yes
  does it model the loss of a region : 0 times
  what such a model needs : the routing policy, which is
    in a different system
  so the two facts live : apart, and neither is wrong

null control - headroom is checked after the failover
  measured against peak : unchanged
  checks on the post-failover figure : 1
  regions sharing a failed region's load : 4
  over capacity by, percent : 0
  no region gained capacity; the rule started being
  evaluated on the state it exists for

what per-region headroom guarantees
  each region can absorb its own growth : exactly,
    measured on peak and enforced by refusal
  the fleet can absorb a region's loss : not addressed;
    the rule is a predicate on one region and a failover
    is a statement about a redistribution

a per-element margin is consumed by an event that moves load
between elements, so the guarantee holds exactly where it is
stated and the quantity that matters is a sum the rule never
forms

The rule is real capacity planning: measured on peak, checked weekly, enforced
by refusing new load, and it forced 2 purchases - all 4 regions are inside
it. It is stated per region, and the routing policy sends a failed region's
60 percent to 1 neighbour holding 40 percent spare, which is 20
percent over, checked 0 times by the weekly review.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
