<!-- canonical: efficientnewlanguage.org/ai/examples/790-the-refund-rate-was-normal-and-one-cohort-was-all-of-it | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 790 — The refund rate was normal and one cohort was all of it

`the_refund_rate_was_normal_and_one_cohort_was_all_of_it.eml` - The refund rate has been at or below its historical level for nineteen months, and it is measured carefully. What it is an average over is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The refund rate
# has been at or below its historical level for nineteen months, and it is
# measured carefully. What it is an average over is computed below.
#
# The measurement is good. A refund counts against the month the order was
# placed rather than the month it was granted, so a slow refund cannot hide in
# the next period; partial refunds count in proportion rather than as a whole or
# not at all; goodwill credits are counted as refunds rather than filed
# elsewhere; and the historical level was computed over three years rather than
# from a convenient quarter.
#
# It is one ratio over every order.

168000 => orders_a_month
2100 => refunds_a_month
130 => historical_rate_per_myriad
19 => months_at_or_below_it
9400 => orders_through_the_new_checkout
1580 => refunds_from_those_orders
0 => dashboards_split_by_checkout_flow
5 => months_the_new_checkout_has_been_live

orders_a_month - orders_through_the_new_checkout => orders_through_the_old_checkout
refunds_a_month - refunds_from_those_orders => refunds_from_the_old_checkout
int(refunds_a_month * 10000 / orders_a_month) => refund_rate_per_myriad
int(refunds_from_those_orders * 10000 / orders_through_the_new_checkout) => new_checkout_rate_per_myriad
int(refunds_from_the_old_checkout * 10000 / orders_through_the_old_checkout) => old_checkout_rate_per_myriad
int(refunds_from_those_orders * 10000 / refunds_a_month) => new_checkouts_share_of_refunds_per_myriad
int(orders_through_the_new_checkout * 10000 / orders_a_month) => new_checkouts_share_of_orders_per_myriad
historical_rate_per_myriad - refund_rate_per_myriad => improvement_against_history_per_myriad

"orders a month                  : " + str(orders_a_month) ^0
"refunds a month                 : " + str(refunds_a_month) ^0
"  refund rate                   : " + str(refund_rate_per_myriad) + " per ten thousand" ^0
"historical rate                 : " + str(historical_rate_per_myriad) + " per ten thousand" ^0
"  better than history by        : " + str(improvement_against_history_per_myriad) + " per ten thousand" ^0
"months at or below it           : " + str(months_at_or_below_it) ^0
"" ^0
"orders through the new checkout : " + str(orders_through_the_new_checkout) ^0
"  share of orders               : " + str(new_checkouts_share_of_orders_per_myriad) + " per ten thousand" ^0
"  refunds from those orders     : " + str(refunds_from_those_orders) ^0
"  share of refunds              : " + str(new_checkouts_share_of_refunds_per_myriad) + " per ten thousand" ^0
"  their refund rate             : " + str(new_checkout_rate_per_myriad) + " per ten thousand" ^0
"" ^0
"orders through the old checkout : " + str(orders_through_the_old_checkout) ^0
"  refunds from those            : " + str(refunds_from_the_old_checkout) ^0
"  their refund rate             : " + str(old_checkout_rate_per_myriad) + " per ten thousand" ^0
"" ^0
"months the new checkout is live : " + str(months_the_new_checkout_has_been_live) ^0
"dashboards split by flow        : " + str(dashboards_split_by_checkout_flow) ^0
"" ^0

# ---- what the measurement verified ----

"the refund rate" ^0
"  a refund counts against : the month the order was" ^0
"    placed, so a slow one cannot hide in the next period" ^0
"  a partial refund : counts in proportion" ^0
"  a goodwill credit : counts as a refund" ^0
"  the historical level : three years, not a convenient" ^0
"    quarter" ^0
"  months at or below it : " + str(months_at_or_below_it) ^0
"  verdict : NORMAL" ^0
"" ^0
"  attributing a refund to the order's own month is the" ^0
"  part almost nobody does, and it is why " ^0
"  " + str(refund_rate_per_myriad) + " per ten thousand is comparable to history" ^0
"" ^0

# ---- the two flows inside the one ratio ----

"orders are not all the same kind of order" ^0
"  new checkout, share of orders : " ^0
"    " + str(new_checkouts_share_of_orders_per_myriad) + " per ten thousand" ^0
"  new checkout, share of refunds : " ^0
"    " + str(new_checkouts_share_of_refunds_per_myriad) + " per ten thousand" ^0
"  its own rate : " + str(new_checkout_rate_per_myriad) + " per ten thousand" ^0
"  the old flow's rate : " + str(old_checkout_rate_per_myriad) + " per ten thousand" ^0
"  the figure everyone reads : " ^0
"    " + str(refund_rate_per_myriad) + " per ten thousand, better than history" ^0
"" ^0
"  the aggregate improved while one cohort ran at many" ^0
"  times the other, because the cohort is small and the" ^0
"  denominator is not" ^0
"" ^0

# ---- what the improvement is made of ----

"how a figure improves while a part worsens" ^0
"  the old flow is the bulk : " + str(orders_through_the_old_checkout) + " orders" ^0
"  its rate is below history : " ^0
"    " + str(old_checkout_rate_per_myriad) + " per ten thousand" ^0
"  the new flow adds : " + str(refunds_from_those_orders) + " refunds on " ^0
"    " + str(orders_through_the_new_checkout) + " orders" ^0
"  the sum lands at : " + str(refund_rate_per_myriad) + " per ten thousand" ^0
"  months this has been true : " ^0
"    " + str(months_the_new_checkout_has_been_live) ^0
"  dashboards that would show it : " ^0
"    " + str(dashboards_split_by_checkout_flow) ^0
"" ^0

# ---- null control ----

# The same measurement, reported once per checkout flow rather than once for
# the shop.
125 => nc_refund_rate_for_the_shop_per_myriad
1680 => nc_new_checkout_rate_per_myriad
32 => nc_old_checkout_rate_per_myriad

"null control - one rate per flow" ^0
"  rate for the shop : " + str(nc_refund_rate_for_the_shop_per_myriad) + ", unchanged" ^0
"  new checkout : " + str(nc_new_checkout_rate_per_myriad) + " per ten thousand" ^0
"  old checkout : " + str(nc_old_checkout_rate_per_myriad) + " per ten thousand" ^0
"  no order changed and no refund was reclassified; the" ^0
"  question stopped being asked once for both flows" ^0
"" ^0

# ---- the rule ----

"what a normal refund rate guarantees" ^0
"  refunds across all orders are at or below the three-" ^0
"    year level : exactly, attributed to the order's own" ^0
"    month, partials in proportion, goodwill included," ^0
"    " + str(months_at_or_below_it) + " months" ^0
"  no part of the shop is going wrong : not addressed;" ^0
"    one flow with " + str(new_checkouts_share_of_orders_per_myriad) + " per ten thousand of orders" ^0
"    carries " + str(new_checkouts_share_of_refunds_per_myriad) + " per ten thousand of refunds" ^0
"" ^0
"an aggregate can improve while every part of it worsens," ^0
"and it can hold steady while one part is the whole story;" ^0
"the shape inside the ratio is a second measurement, and" ^0
"nothing here takes it" ^0
"" ^0

"Refunds are attributed to the order's own month, partials count in proportion," ^0
"goodwill counts, and history is three years - " + str(refund_rate_per_myriad) + " per ten thousand against " ^0
"" + str(historical_rate_per_myriad) + ", " + str(months_at_or_below_it) + " months. One flow with " + str(new_checkouts_share_of_orders_per_myriad) + " per ten thousand of orders holds " ^0
"" + str(new_checkouts_share_of_refunds_per_myriad) + " per ten thousand of the refunds, running at " + str(new_checkout_rate_per_myriad) + " against " + str(old_checkout_rate_per_myriad) + " for" ^0
"the rest, across " + str(dashboards_split_by_checkout_flow) + " dashboards that split them." ^0
```

## Python (deterministic transpilation)

```python
orders_a_month = 168000
refunds_a_month = 2100
historical_rate_per_myriad = 130
months_at_or_below_it = 19
orders_through_the_new_checkout = 9400
refunds_from_those_orders = 1580
dashboards_split_by_checkout_flow = 0
months_the_new_checkout_has_been_live = 5
orders_through_the_old_checkout = orders_a_month - orders_through_the_new_checkout
refunds_from_the_old_checkout = refunds_a_month - refunds_from_those_orders
refund_rate_per_myriad = int(refunds_a_month * 10000 / orders_a_month)
new_checkout_rate_per_myriad = int(refunds_from_those_orders * 10000 / orders_through_the_new_checkout)
old_checkout_rate_per_myriad = int(refunds_from_the_old_checkout * 10000 / orders_through_the_old_checkout)
new_checkouts_share_of_refunds_per_myriad = int(refunds_from_those_orders * 10000 / refunds_a_month)
new_checkouts_share_of_orders_per_myriad = int(orders_through_the_new_checkout * 10000 / orders_a_month)
improvement_against_history_per_myriad = historical_rate_per_myriad - refund_rate_per_myriad
print("orders a month                  : " + str(orders_a_month))
print("refunds a month                 : " + str(refunds_a_month))
print("  refund rate                   : " + str(refund_rate_per_myriad) + " per ten thousand")
print("historical rate                 : " + str(historical_rate_per_myriad) + " per ten thousand")
print("  better than history by        : " + str(improvement_against_history_per_myriad) + " per ten thousand")
print("months at or below it           : " + str(months_at_or_below_it))
print("")
print("orders through the new checkout : " + str(orders_through_the_new_checkout))
print("  share of orders               : " + str(new_checkouts_share_of_orders_per_myriad) + " per ten thousand")
print("  refunds from those orders     : " + str(refunds_from_those_orders))
print("  share of refunds              : " + str(new_checkouts_share_of_refunds_per_myriad) + " per ten thousand")
print("  their refund rate             : " + str(new_checkout_rate_per_myriad) + " per ten thousand")
print("")
print("orders through the old checkout : " + str(orders_through_the_old_checkout))
print("  refunds from those            : " + str(refunds_from_the_old_checkout))
print("  their refund rate             : " + str(old_checkout_rate_per_myriad) + " per ten thousand")
print("")
print("months the new checkout is live : " + str(months_the_new_checkout_has_been_live))
print("dashboards split by flow        : " + str(dashboards_split_by_checkout_flow))
print("")
print("the refund rate")
print("  a refund counts against : the month the order was")
print("    placed, so a slow one cannot hide in the next period")
print("  a partial refund : counts in proportion")
print("  a goodwill credit : counts as a refund")
print("  the historical level : three years, not a convenient")
print("    quarter")
print("  months at or below it : " + str(months_at_or_below_it))
print("  verdict : NORMAL")
print("")
print("  attributing a refund to the order's own month is the")
print("  part almost nobody does, and it is why ")
print("  " + str(refund_rate_per_myriad) + " per ten thousand is comparable to history")
print("")
print("orders are not all the same kind of order")
print("  new checkout, share of orders : ")
print("    " + str(new_checkouts_share_of_orders_per_myriad) + " per ten thousand")
print("  new checkout, share of refunds : ")
print("    " + str(new_checkouts_share_of_refunds_per_myriad) + " per ten thousand")
print("  its own rate : " + str(new_checkout_rate_per_myriad) + " per ten thousand")
print("  the old flow's rate : " + str(old_checkout_rate_per_myriad) + " per ten thousand")
print("  the figure everyone reads : ")
print("    " + str(refund_rate_per_myriad) + " per ten thousand, better than history")
print("")
print("  the aggregate improved while one cohort ran at many")
print("  times the other, because the cohort is small and the")
print("  denominator is not")
print("")
print("how a figure improves while a part worsens")
print("  the old flow is the bulk : " + str(orders_through_the_old_checkout) + " orders")
print("  its rate is below history : ")
print("    " + str(old_checkout_rate_per_myriad) + " per ten thousand")
print("  the new flow adds : " + str(refunds_from_those_orders) + " refunds on ")
print("    " + str(orders_through_the_new_checkout) + " orders")
print("  the sum lands at : " + str(refund_rate_per_myriad) + " per ten thousand")
print("  months this has been true : ")
print("    " + str(months_the_new_checkout_has_been_live))
print("  dashboards that would show it : ")
print("    " + str(dashboards_split_by_checkout_flow))
print("")
nc_refund_rate_for_the_shop_per_myriad = 125
nc_new_checkout_rate_per_myriad = 1680
nc_old_checkout_rate_per_myriad = 32
print("null control - one rate per flow")
print("  rate for the shop : " + str(nc_refund_rate_for_the_shop_per_myriad) + ", unchanged")
print("  new checkout : " + str(nc_new_checkout_rate_per_myriad) + " per ten thousand")
print("  old checkout : " + str(nc_old_checkout_rate_per_myriad) + " per ten thousand")
print("  no order changed and no refund was reclassified; the")
print("  question stopped being asked once for both flows")
print("")
print("what a normal refund rate guarantees")
print("  refunds across all orders are at or below the three-")
print("    year level : exactly, attributed to the order's own")
print("    month, partials in proportion, goodwill included,")
print("    " + str(months_at_or_below_it) + " months")
print("  no part of the shop is going wrong : not addressed;")
print("    one flow with " + str(new_checkouts_share_of_orders_per_myriad) + " per ten thousand of orders")
print("    carries " + str(new_checkouts_share_of_refunds_per_myriad) + " per ten thousand of refunds")
print("")
print("an aggregate can improve while every part of it worsens,")
print("and it can hold steady while one part is the whole story;")
print("the shape inside the ratio is a second measurement, and")
print("nothing here takes it")
print("")
print("Refunds are attributed to the order's own month, partials count in proportion,")
print("goodwill counts, and history is three years - " + str(refund_rate_per_myriad) + " per ten thousand against ")
print("" + str(historical_rate_per_myriad) + ", " + str(months_at_or_below_it) + " months. One flow with " + str(new_checkouts_share_of_orders_per_myriad) + " per ten thousand of orders holds ")
print("" + str(new_checkouts_share_of_refunds_per_myriad) + " per ten thousand of the refunds, running at " + str(new_checkout_rate_per_myriad) + " against " + str(old_checkout_rate_per_myriad) + " for")
print("the rest, across " + str(dashboards_split_by_checkout_flow) + " dashboards that split them.")
```

## stdout (executed)

```text
orders a month                  : 168000
refunds a month                 : 2100
  refund rate                   : 125 per ten thousand
historical rate                 : 130 per ten thousand
  better than history by        : 5 per ten thousand
months at or below it           : 19

orders through the new checkout : 9400
  share of orders               : 559 per ten thousand
  refunds from those orders     : 1580
  share of refunds              : 7523 per ten thousand
  their refund rate             : 1680 per ten thousand

orders through the old checkout : 158600
  refunds from those            : 520
  their refund rate             : 32 per ten thousand

months the new checkout is live : 5
dashboards split by flow        : 0

the refund rate
  a refund counts against : the month the order was
    placed, so a slow one cannot hide in the next period
  a partial refund : counts in proportion
  a goodwill credit : counts as a refund
  the historical level : three years, not a convenient
    quarter
  months at or below it : 19
  verdict : NORMAL

  attributing a refund to the order's own month is the
  part almost nobody does, and it is why 
  125 per ten thousand is comparable to history

orders are not all the same kind of order
  new checkout, share of orders : 
    559 per ten thousand
  new checkout, share of refunds : 
    7523 per ten thousand
  its own rate : 1680 per ten thousand
  the old flow's rate : 32 per ten thousand
  the figure everyone reads : 
    125 per ten thousand, better than history

  the aggregate improved while one cohort ran at many
  times the other, because the cohort is small and the
  denominator is not

how a figure improves while a part worsens
  the old flow is the bulk : 158600 orders
  its rate is below history : 
    32 per ten thousand
  the new flow adds : 1580 refunds on 
    9400 orders
  the sum lands at : 125 per ten thousand
  months this has been true : 
    5
  dashboards that would show it : 
    0

null control - one rate per flow
  rate for the shop : 125, unchanged
  new checkout : 1680 per ten thousand
  old checkout : 32 per ten thousand
  no order changed and no refund was reclassified; the
  question stopped being asked once for both flows

what a normal refund rate guarantees
  refunds across all orders are at or below the three-
    year level : exactly, attributed to the order's own
    month, partials in proportion, goodwill included,
    19 months
  no part of the shop is going wrong : not addressed;
    one flow with 559 per ten thousand of orders
    carries 7523 per ten thousand of refunds

an aggregate can improve while every part of it worsens,
and it can hold steady while one part is the whole story;
the shape inside the ratio is a second measurement, and
nothing here takes it

Refunds are attributed to the order's own month, partials count in proportion,
goodwill counts, and history is three years - 125 per ten thousand against 
130, 19 months. One flow with 559 per ten thousand of orders holds 
7523 per ten thousand of the refunds, running at 1680 against 32 for
the rest, across 0 dashboards that split them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
