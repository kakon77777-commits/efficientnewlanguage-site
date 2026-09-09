<!-- canonical: efficientnewlanguage.org/ai/examples/770-the-on-time-rate-was-over-the-parcels-that-arrived | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 770 — The on time rate was over the parcels that arrived

`the_on_time_rate_was_over_the_parcels_that_arrived.eml` - On-time delivery has been measured the same way for five years, from a scan taken at the customer's door, against a promise the customers themselves agreed. What a delivery is is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). On-time delivery
# has been measured the same way for five years, from a scan taken at the
# customer's door, against a promise the customers themselves agreed. What a
# delivery is is computed below.
#
# The measurement is honest. The timestamp comes from the handheld scanned at
# the door rather than the driver's phone at the kerb; the promise is in the
# customer's local time, not the depot's; the definition was written with the
# customers and has not been changed to flatter a quarter; and it is audited
# quarterly against the carrier's own records.
#
# A delivery exists when a parcel is scanned as delivered. A parcel that is lost
# is not a late delivery; it is not a delivery.

2460000 => parcels_accepted_a_month
2431000 => parcels_scanned_as_delivered
2392000 => deliveries_inside_the_promise
4100 => parcels_lost_or_destroyed
18600 => parcels_returned_to_sender
6300 => parcels_still_in_the_network_past_the_promise
5 => years_measured_the_same_way
20 => quarterly_audits_passed
0 => parcels_without_a_delivery_scan_in_the_denominator

parcels_scanned_as_delivered - deliveries_inside_the_promise => deliveries_outside_the_promise
parcels_accepted_a_month - parcels_scanned_as_delivered => parcels_that_never_became_a_delivery
parcels_lost_or_destroyed + parcels_returned_to_sender => parcels_accounted_for_without_arriving
parcels_accounted_for_without_arriving + parcels_still_in_the_network_past_the_promise => parcels_absent_from_the_denominator
int(deliveries_inside_the_promise * 10000 / parcels_scanned_as_delivered) => on_time_over_deliveries_myriad
int(deliveries_inside_the_promise * 10000 / parcels_accepted_a_month) => on_time_over_acceptances_myriad
on_time_over_deliveries_myriad - on_time_over_acceptances_myriad => the_distance_between_the_two_myriad

"parcels accepted a month        : " + str(parcels_accepted_a_month) ^0
"  scanned as delivered          : " + str(parcels_scanned_as_delivered) ^0
"  inside the promise            : " + str(deliveries_inside_the_promise) ^0
"  outside it                    : " + str(deliveries_outside_the_promise) ^0
"years measured the same way     : " + str(years_measured_the_same_way) ^0
"quarterly audits passed         : " + str(quarterly_audits_passed) ^0
"" ^0
"on time, over deliveries        : " + str(on_time_over_deliveries_myriad) + " per ten thousand" ^0
"on time, over acceptances       : " + str(on_time_over_acceptances_myriad) + " per ten thousand" ^0
"  distance between the two      : " + str(the_distance_between_the_two_myriad) + " per ten thousand" ^0
"" ^0
"parcels that never became a delivery : " + str(parcels_that_never_became_a_delivery) ^0
"  lost or destroyed             : " + str(parcels_lost_or_destroyed) ^0
"  returned to sender            : " + str(parcels_returned_to_sender) ^0
"  still in the network          : " + str(parcels_still_in_the_network_past_the_promise) ^0
"  in the denominator            : " + str(parcels_without_a_delivery_scan_in_the_denominator) ^0
"" ^0

# ---- what the measurement verified ----

"the on-time measurement" ^0
"  timestamp : the handheld scanned at the door, not the" ^0
"    driver's phone at the kerb" ^0
"  clock : the customer's local time, not the depot's" ^0
"  definition : written with the customers, unchanged for" ^0
"    " + str(years_measured_the_same_way) + " years" ^0
"  audits against the carrier's records : " + str(quarterly_audits_passed) + ", all passed" ^0
"  verdict : ON TIME" ^0
"" ^0
"  scanning at the door rather than the kerb is the part" ^0
"  almost nobody does, and it is why the " + str(deliveries_outside_the_promise) ^0
"  late deliveries are counted at all" ^0
"" ^0

# ---- why the ratio has a floor ----

"what can appear in each place" ^0
"  numerator : parcels scanned as delivered, inside the" ^0
"    promise" ^0
"  denominator : parcels scanned as delivered" ^0
"  what creates a row : the delivery scan" ^0
"  what a lost parcel contributes : nothing; it is not a" ^0
"    late delivery, it is not a delivery" ^0
"  parcels in that state : " + str(parcels_absent_from_the_denominator) ^0
"" ^0
"  the worst outcome the operation has is the one outcome" ^0
"  the ratio cannot express" ^0
"" ^0

# ---- what the customer of a lost parcel sees ----

"a parcel that never arrived" ^0
"  was it accepted : yes, and paid for" ^0
"  was it late : the question does not apply; there is no" ^0
"    delivery to be late" ^0
"  does it appear in the on-time figure : no" ^0
"  does it appear anywhere : in claims, " + str(parcels_lost_or_destroyed) + " of them" ^0
"  do the two numbers meet on a page : no" ^0
"" ^0

# ---- null control ----

# The same operation, with the denominator changed to parcels accepted and every
# undelivered parcel counted as outside the promise.
2460000 => nc_denominator_parcels
2392000 => nc_deliveries_inside_the_promise
20 => nc_quarterly_audits_passed

"null control - measure against what was accepted" ^0
"  audits passed : " + str(nc_quarterly_audits_passed) + ", unchanged" ^0
"  denominator : " + str(nc_denominator_parcels) + " parcels accepted" ^0
"  inside the promise : " + str(nc_deliveries_inside_the_promise) ^0
"  on time : " + str(on_time_over_acceptances_myriad) + " per ten thousand" ^0
"  nothing about the deliveries changed; the parcels that" ^0
"  were never delivered were given a place to appear" ^0
"" ^0

# ---- the rule ----

"what a high on-time rate guarantees" ^0
"  a parcel that arrived, arrived on time : exactly," ^0
"    " + str(on_time_over_deliveries_myriad) + " per ten thousand of them, scanned at the door" ^0
"  a parcel arrived : not addressed; a parcel that did" ^0
"    not arrive never enters the ratio, in either place" ^0
"" ^0
"a rate whose denominator is created by the event in its" ^0
"numerator has a floor built into it; the failures that" ^0
"matter most are the ones that never make a row" ^0
"" ^0

"The timestamp is a door scan on the customer's clock, the definition was" ^0
"agreed with them and has stood for " + str(years_measured_the_same_way) + " years, and " + str(quarterly_audits_passed) + " audits have passed." ^0
"A delivery exists when a parcel is scanned, so " + str(parcels_absent_from_the_denominator) + " parcels a month are in" ^0
"neither place and the figure reads " + str(on_time_over_deliveries_myriad) + " per ten thousand against " + str(on_time_over_acceptances_myriad) ^0
"over what was accepted - " + str(the_distance_between_the_two_myriad) + " apart." ^0
```

## Python (deterministic transpilation)

```python
parcels_accepted_a_month = 2460000
parcels_scanned_as_delivered = 2431000
deliveries_inside_the_promise = 2392000
parcels_lost_or_destroyed = 4100
parcels_returned_to_sender = 18600
parcels_still_in_the_network_past_the_promise = 6300
years_measured_the_same_way = 5
quarterly_audits_passed = 20
parcels_without_a_delivery_scan_in_the_denominator = 0
deliveries_outside_the_promise = parcels_scanned_as_delivered - deliveries_inside_the_promise
parcels_that_never_became_a_delivery = parcels_accepted_a_month - parcels_scanned_as_delivered
parcels_accounted_for_without_arriving = parcels_lost_or_destroyed + parcels_returned_to_sender
parcels_absent_from_the_denominator = parcels_accounted_for_without_arriving + parcels_still_in_the_network_past_the_promise
on_time_over_deliveries_myriad = int(deliveries_inside_the_promise * 10000 / parcels_scanned_as_delivered)
on_time_over_acceptances_myriad = int(deliveries_inside_the_promise * 10000 / parcels_accepted_a_month)
the_distance_between_the_two_myriad = on_time_over_deliveries_myriad - on_time_over_acceptances_myriad
print("parcels accepted a month        : " + str(parcels_accepted_a_month))
print("  scanned as delivered          : " + str(parcels_scanned_as_delivered))
print("  inside the promise            : " + str(deliveries_inside_the_promise))
print("  outside it                    : " + str(deliveries_outside_the_promise))
print("years measured the same way     : " + str(years_measured_the_same_way))
print("quarterly audits passed         : " + str(quarterly_audits_passed))
print("")
print("on time, over deliveries        : " + str(on_time_over_deliveries_myriad) + " per ten thousand")
print("on time, over acceptances       : " + str(on_time_over_acceptances_myriad) + " per ten thousand")
print("  distance between the two      : " + str(the_distance_between_the_two_myriad) + " per ten thousand")
print("")
print("parcels that never became a delivery : " + str(parcels_that_never_became_a_delivery))
print("  lost or destroyed             : " + str(parcels_lost_or_destroyed))
print("  returned to sender            : " + str(parcels_returned_to_sender))
print("  still in the network          : " + str(parcels_still_in_the_network_past_the_promise))
print("  in the denominator            : " + str(parcels_without_a_delivery_scan_in_the_denominator))
print("")
print("the on-time measurement")
print("  timestamp : the handheld scanned at the door, not the")
print("    driver's phone at the kerb")
print("  clock : the customer's local time, not the depot's")
print("  definition : written with the customers, unchanged for")
print("    " + str(years_measured_the_same_way) + " years")
print("  audits against the carrier's records : " + str(quarterly_audits_passed) + ", all passed")
print("  verdict : ON TIME")
print("")
print("  scanning at the door rather than the kerb is the part")
print("  almost nobody does, and it is why the " + str(deliveries_outside_the_promise))
print("  late deliveries are counted at all")
print("")
print("what can appear in each place")
print("  numerator : parcels scanned as delivered, inside the")
print("    promise")
print("  denominator : parcels scanned as delivered")
print("  what creates a row : the delivery scan")
print("  what a lost parcel contributes : nothing; it is not a")
print("    late delivery, it is not a delivery")
print("  parcels in that state : " + str(parcels_absent_from_the_denominator))
print("")
print("  the worst outcome the operation has is the one outcome")
print("  the ratio cannot express")
print("")
print("a parcel that never arrived")
print("  was it accepted : yes, and paid for")
print("  was it late : the question does not apply; there is no")
print("    delivery to be late")
print("  does it appear in the on-time figure : no")
print("  does it appear anywhere : in claims, " + str(parcels_lost_or_destroyed) + " of them")
print("  do the two numbers meet on a page : no")
print("")
nc_denominator_parcels = 2460000
nc_deliveries_inside_the_promise = 2392000
nc_quarterly_audits_passed = 20
print("null control - measure against what was accepted")
print("  audits passed : " + str(nc_quarterly_audits_passed) + ", unchanged")
print("  denominator : " + str(nc_denominator_parcels) + " parcels accepted")
print("  inside the promise : " + str(nc_deliveries_inside_the_promise))
print("  on time : " + str(on_time_over_acceptances_myriad) + " per ten thousand")
print("  nothing about the deliveries changed; the parcels that")
print("  were never delivered were given a place to appear")
print("")
print("what a high on-time rate guarantees")
print("  a parcel that arrived, arrived on time : exactly,")
print("    " + str(on_time_over_deliveries_myriad) + " per ten thousand of them, scanned at the door")
print("  a parcel arrived : not addressed; a parcel that did")
print("    not arrive never enters the ratio, in either place")
print("")
print("a rate whose denominator is created by the event in its")
print("numerator has a floor built into it; the failures that")
print("matter most are the ones that never make a row")
print("")
print("The timestamp is a door scan on the customer's clock, the definition was")
print("agreed with them and has stood for " + str(years_measured_the_same_way) + " years, and " + str(quarterly_audits_passed) + " audits have passed.")
print("A delivery exists when a parcel is scanned, so " + str(parcels_absent_from_the_denominator) + " parcels a month are in")
print("neither place and the figure reads " + str(on_time_over_deliveries_myriad) + " per ten thousand against " + str(on_time_over_acceptances_myriad))
print("over what was accepted - " + str(the_distance_between_the_two_myriad) + " apart.")
```

## stdout (executed)

```text
parcels accepted a month        : 2460000
  scanned as delivered          : 2431000
  inside the promise            : 2392000
  outside it                    : 39000
years measured the same way     : 5
quarterly audits passed         : 20

on time, over deliveries        : 9839 per ten thousand
on time, over acceptances       : 9723 per ten thousand
  distance between the two      : 116 per ten thousand

parcels that never became a delivery : 29000
  lost or destroyed             : 4100
  returned to sender            : 18600
  still in the network          : 6300
  in the denominator            : 0

the on-time measurement
  timestamp : the handheld scanned at the door, not the
    driver's phone at the kerb
  clock : the customer's local time, not the depot's
  definition : written with the customers, unchanged for
    5 years
  audits against the carrier's records : 20, all passed
  verdict : ON TIME

  scanning at the door rather than the kerb is the part
  almost nobody does, and it is why the 39000
  late deliveries are counted at all

what can appear in each place
  numerator : parcels scanned as delivered, inside the
    promise
  denominator : parcels scanned as delivered
  what creates a row : the delivery scan
  what a lost parcel contributes : nothing; it is not a
    late delivery, it is not a delivery
  parcels in that state : 29000

  the worst outcome the operation has is the one outcome
  the ratio cannot express

a parcel that never arrived
  was it accepted : yes, and paid for
  was it late : the question does not apply; there is no
    delivery to be late
  does it appear in the on-time figure : no
  does it appear anywhere : in claims, 4100 of them
  do the two numbers meet on a page : no

null control - measure against what was accepted
  audits passed : 20, unchanged
  denominator : 2460000 parcels accepted
  inside the promise : 2392000
  on time : 9723 per ten thousand
  nothing about the deliveries changed; the parcels that
  were never delivered were given a place to appear

what a high on-time rate guarantees
  a parcel that arrived, arrived on time : exactly,
    9839 per ten thousand of them, scanned at the door
  a parcel arrived : not addressed; a parcel that did
    not arrive never enters the ratio, in either place

a rate whose denominator is created by the event in its
numerator has a floor built into it; the failures that
matter most are the ones that never make a row

The timestamp is a door scan on the customer's clock, the definition was
agreed with them and has stood for 5 years, and 20 audits have passed.
A delivery exists when a parcel is scanned, so 29000 parcels a month are in
neither place and the figure reads 9839 per ten thousand against 9723
over what was accepted - 116 apart.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
