<!-- canonical: efficientnewlanguage.org/ai/examples/734-the-budget-alert-was-on-spend-and-the-commitment-was-on-capacity | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 734 — The budget alert was on spend and the commitment was on capacity

`the_budget_alert_was_on_spend_and_the_commitment_was_on_capacity.eml` - Budget alerts are configured at two thresholds, tested with a real charge, and routed to a person who acknowledges them. What they can move with is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Budget alerts are
# configured at two thresholds, tested with a real charge, and routed to a
# person who acknowledges them. What they can move with is computed below.
#
# The alerting is set up properly. There are two thresholds rather than one, so
# there is a warning before the wall; the configuration was tested by pushing a
# synthetic charge through and watching the alert arrive, rather than trusting
# the console; it is routed to a named person rather than a distribution list;
# and that person acknowledges. Nobody here was careless.
#
# The alert fires on SPEND. The account is on a three-year committed-use
# agreement, so the invoice is the commitment whether the capacity is used or
# not, and spend is constant by construction.
#
# Utilisation went from eighty-two percent to thirty-one after a migration.

2 => alert_thresholds_configured
1 => synthetic_charge_tests
1 => named_people_who_acknowledge
36 => commitment_months
420000 => monthly_commitment_dollars
82 => utilisation_percent_before
31 => utilisation_percent_after
100 => a_whole_percent
7 => months_since_the_migration
0 => alerts_that_fired
0 => alerts_configured_on_utilisation
0 => month_over_month_spend_variance_dollars

a_whole_percent - utilisation_percent_after => unused_percent_after
utilisation_percent_before - utilisation_percent_after => utilisation_percentage_points_lost
int(monthly_commitment_dollars * unused_percent_after / a_whole_percent) => monthly_dollars_for_unused_capacity
monthly_dollars_for_unused_capacity * months_since_the_migration => dollars_for_unused_capacity_since

"alert thresholds configured     : " + str(alert_thresholds_configured) ^0
"synthetic charge tests          : " + str(synthetic_charge_tests) ^0
"named people who acknowledge    : " + str(named_people_who_acknowledge) ^0
"alerts that fired               : " + str(alerts_that_fired) ^0
"" ^0
"commitment months               : " + str(commitment_months) ^0
"monthly commitment, dollars     : " + str(monthly_commitment_dollars) ^0
"month over month spend variance : " + str(month_over_month_spend_variance_dollars) ^0
"" ^0
"utilisation before, percent     : " + str(utilisation_percent_before) ^0
"utilisation after, percent      : " + str(utilisation_percent_after) ^0
"  points lost                   : " + str(utilisation_percentage_points_lost) ^0
"  unused after, percent         : " + str(unused_percent_after) ^0
"" ^0
"monthly dollars for unused capacity : " + str(monthly_dollars_for_unused_capacity) ^0
"months since the migration          : " + str(months_since_the_migration) ^0
"  dollars since                     : " + str(dollars_for_unused_capacity_since) ^0
"alerts configured on utilisation    : " + str(alerts_configured_on_utilisation) ^0
"" ^0

# ---- what the alerting verified ----

"the budget alerts" ^0
"  thresholds : " + str(alert_thresholds_configured) + ", so there is a warning before the" ^0
"    wall rather than only a wall" ^0
"  tested by : pushing a synthetic charge and watching it" ^0
"    arrive, not by reading the console" ^0
"  routed to : a named person, not a list" ^0
"  acknowledged : yes" ^0
"  verdict : CONFIGURED AND WORKING" ^0
"" ^0
"  testing the alert with a real charge is the step that" ^0
"  separates this from a checkbox, and it was done" ^0
"" ^0

# ---- what the alert watches ----

"the monitored quantity" ^0
"  what fires the alert : spend crossing a threshold" ^0
"  what determines spend : the commitment, for " + str(commitment_months) ^0
"    months" ^0
"  what changes when capacity goes unused : nothing on the" ^0
"    invoice" ^0
"  month over month variance : " + str(month_over_month_spend_variance_dollars) ^0
"  so the number the alert watches : cannot move" ^0
"" ^0
"  the alert is correctly wired to a quantity that this" ^0
"  contract holds constant" ^0
"" ^0
# ---- the commitment was a good decision ----

# The three-year agreement was taken deliberately and it saved real money
# against on-demand pricing. It is not the mistake here. It is the reason the
# instrument stopped being able to move.
"the commitment" ^0
"  taken deliberately : yes, against on-demand pricing" ^0
"  did it save money at the time : yes" ^0
"  is it the mistake : no" ^0
"  what it does to spend : fixes it for " + str(commitment_months) + " months" ^0
"  what it does to the alert : leaves it correctly wired" ^0
"    to a constant" ^0
"" ^0

# ---- what the migration changed ----

# The migration was also right: the workload moved to a service that suits it
# better and runs faster. It reduced the capacity needed and could not reduce
# the capacity bought.
"the migration" ^0
"  moved the workload to : something that suits it better" ^0
"  was that right : yes, on its own terms" ^0
"  capacity needed after : lower" ^0
"  capacity bought after : the same" ^0
"  utilisation, before and after : " + str(utilisation_percent_before) + " and " + str(utilisation_percent_after) ^0
"  what appeared on the invoice : nothing" ^0
"" ^0

# ---- the number that would have moved ----

"utilisation" ^0
"  is it measured : yes, the provider reports it" ^0
"  is it on a dashboard : yes" ^0
"  alerts configured on it : " + str(alerts_configured_on_utilisation) ^0
"  what it would have shown : " + str(utilisation_percentage_points_lost) + " points, in one month" ^0
"  what nobody was watching for : a number going down" ^0
"  dollars behind those points, so far : " + str(dollars_for_unused_capacity_since) ^0
"" ^0

# ---- null control ----

# The same alerting, with a threshold on utilisation as well as on spend, and
# the commitment renewal gated on the utilisation trend.
2 => nc_alerts_configured_on_utilisation
1 => nc_alerts_that_would_have_fired

"null control - a threshold on utilisation too" ^0
"  spend thresholds : " + str(alert_thresholds_configured) + ", unchanged" ^0
"  utilisation thresholds : " + str(nc_alerts_configured_on_utilisation) ^0
"  alerts that fire in the migration month : " + str(nc_alerts_that_would_have_fired) ^0
"  the alerting did not get better; it acquired a threshold" ^0
"  on a quantity this contract lets move" ^0
"" ^0

# ---- the rule ----

"what a working budget alert guarantees" ^0
"  spend crossing a threshold is noticed : exactly, tested" ^0
"    with a real charge and acknowledged by a person" ^0
"  waste is noticed : not addressed; the alert is" ^0
"    denominated in spend, and this contract decouples" ^0
"    spend from consumption" ^0
"" ^0
"an alert can only report on a quantity that varies; a" ^0
"contract that fixes the monitored quantity does not break" ^0
"the alert, it removes the alert's subject, and a silent" ^0
"alert is what correct configuration looks like" ^0
"" ^0

"The alerting is done properly: " + str(alert_thresholds_configured) + " thresholds rather than one, tested by pushing a" ^0
"real charge through, routed to " + str(named_people_who_acknowledge) + " named person who acknowledges. It fires on" ^0
"spend, which a " + str(commitment_months) + "-month commitment holds at " + str(month_over_month_spend_variance_dollars) + " variance, so utilisation" ^0
"falling from " + str(utilisation_percent_before) + " to " + str(utilisation_percent_after) + " percent produced " + str(alerts_that_fired) + " alerts while " + str(monthly_dollars_for_unused_capacity) ^0
"dollars a month bought nothing - " + str(dollars_for_unused_capacity_since) + " over " + str(months_since_the_migration) + " months." ^0
```

## Python (deterministic transpilation)

```python
alert_thresholds_configured = 2
synthetic_charge_tests = 1
named_people_who_acknowledge = 1
commitment_months = 36
monthly_commitment_dollars = 420000
utilisation_percent_before = 82
utilisation_percent_after = 31
a_whole_percent = 100
months_since_the_migration = 7
alerts_that_fired = 0
alerts_configured_on_utilisation = 0
month_over_month_spend_variance_dollars = 0
unused_percent_after = a_whole_percent - utilisation_percent_after
utilisation_percentage_points_lost = utilisation_percent_before - utilisation_percent_after
monthly_dollars_for_unused_capacity = int(monthly_commitment_dollars * unused_percent_after / a_whole_percent)
dollars_for_unused_capacity_since = monthly_dollars_for_unused_capacity * months_since_the_migration
print("alert thresholds configured     : " + str(alert_thresholds_configured))
print("synthetic charge tests          : " + str(synthetic_charge_tests))
print("named people who acknowledge    : " + str(named_people_who_acknowledge))
print("alerts that fired               : " + str(alerts_that_fired))
print("")
print("commitment months               : " + str(commitment_months))
print("monthly commitment, dollars     : " + str(monthly_commitment_dollars))
print("month over month spend variance : " + str(month_over_month_spend_variance_dollars))
print("")
print("utilisation before, percent     : " + str(utilisation_percent_before))
print("utilisation after, percent      : " + str(utilisation_percent_after))
print("  points lost                   : " + str(utilisation_percentage_points_lost))
print("  unused after, percent         : " + str(unused_percent_after))
print("")
print("monthly dollars for unused capacity : " + str(monthly_dollars_for_unused_capacity))
print("months since the migration          : " + str(months_since_the_migration))
print("  dollars since                     : " + str(dollars_for_unused_capacity_since))
print("alerts configured on utilisation    : " + str(alerts_configured_on_utilisation))
print("")
print("the budget alerts")
print("  thresholds : " + str(alert_thresholds_configured) + ", so there is a warning before the")
print("    wall rather than only a wall")
print("  tested by : pushing a synthetic charge and watching it")
print("    arrive, not by reading the console")
print("  routed to : a named person, not a list")
print("  acknowledged : yes")
print("  verdict : CONFIGURED AND WORKING")
print("")
print("  testing the alert with a real charge is the step that")
print("  separates this from a checkbox, and it was done")
print("")
print("the monitored quantity")
print("  what fires the alert : spend crossing a threshold")
print("  what determines spend : the commitment, for " + str(commitment_months))
print("    months")
print("  what changes when capacity goes unused : nothing on the")
print("    invoice")
print("  month over month variance : " + str(month_over_month_spend_variance_dollars))
print("  so the number the alert watches : cannot move")
print("")
print("  the alert is correctly wired to a quantity that this")
print("  contract holds constant")
print("")
print("the commitment")
print("  taken deliberately : yes, against on-demand pricing")
print("  did it save money at the time : yes")
print("  is it the mistake : no")
print("  what it does to spend : fixes it for " + str(commitment_months) + " months")
print("  what it does to the alert : leaves it correctly wired")
print("    to a constant")
print("")
print("the migration")
print("  moved the workload to : something that suits it better")
print("  was that right : yes, on its own terms")
print("  capacity needed after : lower")
print("  capacity bought after : the same")
print("  utilisation, before and after : " + str(utilisation_percent_before) + " and " + str(utilisation_percent_after))
print("  what appeared on the invoice : nothing")
print("")
print("utilisation")
print("  is it measured : yes, the provider reports it")
print("  is it on a dashboard : yes")
print("  alerts configured on it : " + str(alerts_configured_on_utilisation))
print("  what it would have shown : " + str(utilisation_percentage_points_lost) + " points, in one month")
print("  what nobody was watching for : a number going down")
print("  dollars behind those points, so far : " + str(dollars_for_unused_capacity_since))
print("")
nc_alerts_configured_on_utilisation = 2
nc_alerts_that_would_have_fired = 1
print("null control - a threshold on utilisation too")
print("  spend thresholds : " + str(alert_thresholds_configured) + ", unchanged")
print("  utilisation thresholds : " + str(nc_alerts_configured_on_utilisation))
print("  alerts that fire in the migration month : " + str(nc_alerts_that_would_have_fired))
print("  the alerting did not get better; it acquired a threshold")
print("  on a quantity this contract lets move")
print("")
print("what a working budget alert guarantees")
print("  spend crossing a threshold is noticed : exactly, tested")
print("    with a real charge and acknowledged by a person")
print("  waste is noticed : not addressed; the alert is")
print("    denominated in spend, and this contract decouples")
print("    spend from consumption")
print("")
print("an alert can only report on a quantity that varies; a")
print("contract that fixes the monitored quantity does not break")
print("the alert, it removes the alert's subject, and a silent")
print("alert is what correct configuration looks like")
print("")
print("The alerting is done properly: " + str(alert_thresholds_configured) + " thresholds rather than one, tested by pushing a")
print("real charge through, routed to " + str(named_people_who_acknowledge) + " named person who acknowledges. It fires on")
print("spend, which a " + str(commitment_months) + "-month commitment holds at " + str(month_over_month_spend_variance_dollars) + " variance, so utilisation")
print("falling from " + str(utilisation_percent_before) + " to " + str(utilisation_percent_after) + " percent produced " + str(alerts_that_fired) + " alerts while " + str(monthly_dollars_for_unused_capacity))
print("dollars a month bought nothing - " + str(dollars_for_unused_capacity_since) + " over " + str(months_since_the_migration) + " months.")
```

## stdout (executed)

```text
alert thresholds configured     : 2
synthetic charge tests          : 1
named people who acknowledge    : 1
alerts that fired               : 0

commitment months               : 36
monthly commitment, dollars     : 420000
month over month spend variance : 0

utilisation before, percent     : 82
utilisation after, percent      : 31
  points lost                   : 51
  unused after, percent         : 69

monthly dollars for unused capacity : 289800
months since the migration          : 7
  dollars since                     : 2028600
alerts configured on utilisation    : 0

the budget alerts
  thresholds : 2, so there is a warning before the
    wall rather than only a wall
  tested by : pushing a synthetic charge and watching it
    arrive, not by reading the console
  routed to : a named person, not a list
  acknowledged : yes
  verdict : CONFIGURED AND WORKING

  testing the alert with a real charge is the step that
  separates this from a checkbox, and it was done

the monitored quantity
  what fires the alert : spend crossing a threshold
  what determines spend : the commitment, for 36
    months
  what changes when capacity goes unused : nothing on the
    invoice
  month over month variance : 0
  so the number the alert watches : cannot move

  the alert is correctly wired to a quantity that this
  contract holds constant

the commitment
  taken deliberately : yes, against on-demand pricing
  did it save money at the time : yes
  is it the mistake : no
  what it does to spend : fixes it for 36 months
  what it does to the alert : leaves it correctly wired
    to a constant

the migration
  moved the workload to : something that suits it better
  was that right : yes, on its own terms
  capacity needed after : lower
  capacity bought after : the same
  utilisation, before and after : 82 and 31
  what appeared on the invoice : nothing

utilisation
  is it measured : yes, the provider reports it
  is it on a dashboard : yes
  alerts configured on it : 0
  what it would have shown : 51 points, in one month
  what nobody was watching for : a number going down
  dollars behind those points, so far : 2028600

null control - a threshold on utilisation too
  spend thresholds : 2, unchanged
  utilisation thresholds : 2
  alerts that fire in the migration month : 1
  the alerting did not get better; it acquired a threshold
  on a quantity this contract lets move

what a working budget alert guarantees
  spend crossing a threshold is noticed : exactly, tested
    with a real charge and acknowledged by a person
  waste is noticed : not addressed; the alert is
    denominated in spend, and this contract decouples
    spend from consumption

an alert can only report on a quantity that varies; a
contract that fixes the monitored quantity does not break
the alert, it removes the alert's subject, and a silent
alert is what correct configuration looks like

The alerting is done properly: 2 thresholds rather than one, tested by pushing a
real charge through, routed to 1 named person who acknowledges. It fires on
spend, which a 36-month commitment holds at 0 variance, so utilisation
falling from 82 to 31 percent produced 0 alerts while 289800
dollars a month bought nothing - 2028600 over 7 months.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
