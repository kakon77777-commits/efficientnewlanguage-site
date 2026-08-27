<!-- canonical: efficientnewlanguage.org/ai/examples/574-the-metric-came-from-a-view-that-filtered | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 574 — The metric came from a view that filtered

`the_metric_came_from_a_view_that_filtered.eml` - Three metrics are computed from one view. The view excludes cancelled orders. What each metric becomes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three metrics are
# computed from one view. The view excludes cancelled orders. What each metric
# becomes is computed below.
#
# The view is right and the exclusion is deliberate. `orders_v` was created for
# revenue reporting, where a cancelled order is not revenue and counting it
# would overstate every figure on the page. The definition is in the view's
# comment, it has been there for two years, and the revenue numbers it produces
# have reconciled to the ledger every month since.
#
# Two more metrics were later added to the same dashboard and pointed at the
# same view, which is exactly what a view is for: one definition, many readers,
# no chance of two teams filtering differently.
#
# A filter that is correct for one metric is a modification of the population
# for every other. The three metrics do not share a question, so they do not
# share a denominator, and only one of them wanted this one.

45000 => orders_placed
6300 => orders_cancelled
# Revenue in HUNDREDTHS. In whole hundreds the two averages truncate to 9 and
# 8 and the difference reads as 1, which is rounding rather than the effect.
382500000 => revenue_hundredths

orders_placed - orders_cancelled => orders_in_view

"orders placed        : " + str(orders_placed) ^0
"orders cancelled     : " + str(orders_cancelled) + " (" + str(int(orders_cancelled * 100 / orders_placed)) + " percent)" ^0
"rows visible in orders_v : " + str(orders_in_view) ^0
"" ^0

# ---- metric 1: the one the view was built for ----

int(revenue_hundredths / orders_in_view) => aov_from_view
int(revenue_hundredths / orders_placed) => aov_from_table

"average order value" ^0
"  from orders_v    : " + str(aov_from_view) + " hundredths" ^0
"  from the raw table : " + str(aov_from_table) + " hundredths" ^0
"  which is correct : the view" ^0
"  a cancelled order contributed no revenue, so including it in the" ^0
"  denominator would understate the average by " + str(aov_from_view - aov_from_table) + " hundredths" ^0
"" ^0

# ---- metric 2: undercounted ----

"total orders" ^0
"  from orders_v    : " + str(orders_in_view) ^0
"  truth            : " + str(orders_placed) ^0
"  understated by   : " + str(orders_cancelled) + ", which is " + str(int(orders_cancelled * 100 / orders_placed)) + " percent" ^0
"  a cancelled order IS an order placed; that is what the metric counts" ^0
"" ^0

# ---- metric 3: identically zero ----
#
# The cancellation rate is cancelled divided by placed. The view has already
# removed every cancelled row, so the numerator is zero whatever the truth is.

0 => cancelled_visible_in_view

"cancellation rate" ^0
"  cancelled rows visible in orders_v : " + str(cancelled_visible_in_view) ^0
"  rows in orders_v                   : " + str(orders_in_view) ^0
"  computed rate                      : " + str(cancelled_visible_in_view) + " percent" ^0
"  true rate                          : " + str(int(orders_cancelled * 100 / orders_placed)) + " percent" ^0
"" ^0
"  this metric is not merely wrong; it cannot take another value" ^0
"  if cancellations tripled it would still read " + str(cancelled_visible_in_view) ^0
"  if they stopped entirely it would still read " + str(cancelled_visible_in_view) ^0
"  it has one possible output and it has been on the dashboard for a year" ^0
"" ^0

# ---- the three metrics, side by side ----

"metric                what the filter does to it" ^0
"  average order value   required, this is why the view exists" ^0
"  total orders          understates by the cancelled count" ^0
"  cancellation rate     pins it to zero, permanently" ^0
"" ^0
"  one filter, one view, three different consequences" ^0
"  and the filter is documented, correct, and doing what it says" ^0
"" ^0

# ---- what a green dashboard looks like ----

"why nothing looked wrong" ^0
"  revenue reconciles to the ledger    : yes, every month" ^0
"  average order value is plausible    : yes, and it is exactly right" ^0
"  total orders trends smoothly        : yes, it is " + str(100 - int(orders_cancelled * 100 / orders_placed)) + " percent of the truth" ^0
"  cancellation rate is stable         : yes, it is a constant" ^0
"  a stable metric reads as a healthy one" ^0
"" ^0

# ---- the control ----
#
# Is the view wrong. Run it against its own stated purpose and it is exactly
# right, which is why it has never been changed and why every review of it
# passes.

"control - the view against the question it was written for" ^0
"  revenue from orders_v vs the ledger : reconciles exactly" ^0
"  rows excluded that should be there  : 0, for a revenue question" ^0
"  the view is correct and the comment above it is accurate" ^0
"" ^0
"  every reader inherits a filter chosen for a question they are not asking" ^0
"  and inheriting it is the reason the view was reused" ^0
"" ^0

# ---- the null control ----
#
# The same three metrics against a period with no cancellations. All three are
# correct, including the one that is structurally pinned, because zero is also
# the true answer. A metric with one possible output agrees with reality
# whenever reality happens to be that output.

0 => nc_cancelled
orders_placed - nc_cancelled => nc_in_view

"null control - the same view over a period with no cancellations" ^0
"  orders placed     : " + str(orders_placed) ^0
"  cancelled         : " + str(nc_cancelled) ^0
"  rows in the view  : " + str(nc_in_view) ^0
"  total orders      : " + str(nc_in_view) + ", understated by " + str(orders_placed - nc_in_view) ^0
"  cancellation rate : " + str(cancelled_visible_in_view) + " percent, and now it is also true" ^0
"  the pinned metric agrees with reality, which is the worst way for a" ^0
"  constant to be tested" ^0
"" ^0

# ---- the rule ----

"a shared view, read by metrics that do not share a question" ^0
"  one definition, many readers      the reason to use a view" ^0
"  one filter, many populations      the cost of using a view" ^0
"  a metric about the excluded rows  cannot be computed there at all" ^0
"  and returns a constant rather than an error" ^0
"" ^0
"the test for this is not 'is the number right'" ^0
"it is 'can this number take another value', and it costs one query to ask" ^0
"" ^0

"orders_v excludes cancelled orders because a cancelled order is not revenue," ^0
"the definition is in its comment, and the revenue it produces has reconciled" ^0
"every month for two years. Two later metrics were pointed at it, which is what" ^0
"a view is for. Total orders now reads " + str(orders_in_view) + " instead of " + str(orders_placed) + ", and the" ^0
"cancellation rate reads " + str(cancelled_visible_in_view) + " percent - not because cancellations stopped, but" ^0
"because the only rows that could make it non-zero are the rows the view" ^0
"removes." ^0
```

## Python (deterministic transpilation)

```python
orders_placed = 45000
orders_cancelled = 6300
revenue_hundredths = 382500000
orders_in_view = orders_placed - orders_cancelled
print("orders placed        : " + str(orders_placed))
print("orders cancelled     : " + str(orders_cancelled) + " (" + str(int(orders_cancelled * 100 / orders_placed)) + " percent)")
print("rows visible in orders_v : " + str(orders_in_view))
print("")
aov_from_view = int(revenue_hundredths / orders_in_view)
aov_from_table = int(revenue_hundredths / orders_placed)
print("average order value")
print("  from orders_v    : " + str(aov_from_view) + " hundredths")
print("  from the raw table : " + str(aov_from_table) + " hundredths")
print("  which is correct : the view")
print("  a cancelled order contributed no revenue, so including it in the")
print("  denominator would understate the average by " + str(aov_from_view - aov_from_table) + " hundredths")
print("")
print("total orders")
print("  from orders_v    : " + str(orders_in_view))
print("  truth            : " + str(orders_placed))
print("  understated by   : " + str(orders_cancelled) + ", which is " + str(int(orders_cancelled * 100 / orders_placed)) + " percent")
print("  a cancelled order IS an order placed; that is what the metric counts")
print("")
cancelled_visible_in_view = 0
print("cancellation rate")
print("  cancelled rows visible in orders_v : " + str(cancelled_visible_in_view))
print("  rows in orders_v                   : " + str(orders_in_view))
print("  computed rate                      : " + str(cancelled_visible_in_view) + " percent")
print("  true rate                          : " + str(int(orders_cancelled * 100 / orders_placed)) + " percent")
print("")
print("  this metric is not merely wrong; it cannot take another value")
print("  if cancellations tripled it would still read " + str(cancelled_visible_in_view))
print("  if they stopped entirely it would still read " + str(cancelled_visible_in_view))
print("  it has one possible output and it has been on the dashboard for a year")
print("")
print("metric                what the filter does to it")
print("  average order value   required, this is why the view exists")
print("  total orders          understates by the cancelled count")
print("  cancellation rate     pins it to zero, permanently")
print("")
print("  one filter, one view, three different consequences")
print("  and the filter is documented, correct, and doing what it says")
print("")
print("why nothing looked wrong")
print("  revenue reconciles to the ledger    : yes, every month")
print("  average order value is plausible    : yes, and it is exactly right")
print("  total orders trends smoothly        : yes, it is " + str(100 - int(orders_cancelled * 100 / orders_placed)) + " percent of the truth")
print("  cancellation rate is stable         : yes, it is a constant")
print("  a stable metric reads as a healthy one")
print("")
print("control - the view against the question it was written for")
print("  revenue from orders_v vs the ledger : reconciles exactly")
print("  rows excluded that should be there  : 0, for a revenue question")
print("  the view is correct and the comment above it is accurate")
print("")
print("  every reader inherits a filter chosen for a question they are not asking")
print("  and inheriting it is the reason the view was reused")
print("")
nc_cancelled = 0
nc_in_view = orders_placed - nc_cancelled
print("null control - the same view over a period with no cancellations")
print("  orders placed     : " + str(orders_placed))
print("  cancelled         : " + str(nc_cancelled))
print("  rows in the view  : " + str(nc_in_view))
print("  total orders      : " + str(nc_in_view) + ", understated by " + str(orders_placed - nc_in_view))
print("  cancellation rate : " + str(cancelled_visible_in_view) + " percent, and now it is also true")
print("  the pinned metric agrees with reality, which is the worst way for a")
print("  constant to be tested")
print("")
print("a shared view, read by metrics that do not share a question")
print("  one definition, many readers      the reason to use a view")
print("  one filter, many populations      the cost of using a view")
print("  a metric about the excluded rows  cannot be computed there at all")
print("  and returns a constant rather than an error")
print("")
print("the test for this is not 'is the number right'")
print("it is 'can this number take another value', and it costs one query to ask")
print("")
print("orders_v excludes cancelled orders because a cancelled order is not revenue,")
print("the definition is in its comment, and the revenue it produces has reconciled")
print("every month for two years. Two later metrics were pointed at it, which is what")
print("a view is for. Total orders now reads " + str(orders_in_view) + " instead of " + str(orders_placed) + ", and the")
print("cancellation rate reads " + str(cancelled_visible_in_view) + " percent - not because cancellations stopped, but")
print("because the only rows that could make it non-zero are the rows the view")
print("removes.")
```

## stdout (executed)

```text
orders placed        : 45000
orders cancelled     : 6300 (14 percent)
rows visible in orders_v : 38700

average order value
  from orders_v    : 9883 hundredths
  from the raw table : 8500 hundredths
  which is correct : the view
  a cancelled order contributed no revenue, so including it in the
  denominator would understate the average by 1383 hundredths

total orders
  from orders_v    : 38700
  truth            : 45000
  understated by   : 6300, which is 14 percent
  a cancelled order IS an order placed; that is what the metric counts

cancellation rate
  cancelled rows visible in orders_v : 0
  rows in orders_v                   : 38700
  computed rate                      : 0 percent
  true rate                          : 14 percent

  this metric is not merely wrong; it cannot take another value
  if cancellations tripled it would still read 0
  if they stopped entirely it would still read 0
  it has one possible output and it has been on the dashboard for a year

metric                what the filter does to it
  average order value   required, this is why the view exists
  total orders          understates by the cancelled count
  cancellation rate     pins it to zero, permanently

  one filter, one view, three different consequences
  and the filter is documented, correct, and doing what it says

why nothing looked wrong
  revenue reconciles to the ledger    : yes, every month
  average order value is plausible    : yes, and it is exactly right
  total orders trends smoothly        : yes, it is 86 percent of the truth
  cancellation rate is stable         : yes, it is a constant
  a stable metric reads as a healthy one

control - the view against the question it was written for
  revenue from orders_v vs the ledger : reconciles exactly
  rows excluded that should be there  : 0, for a revenue question
  the view is correct and the comment above it is accurate

  every reader inherits a filter chosen for a question they are not asking
  and inheriting it is the reason the view was reused

null control - the same view over a period with no cancellations
  orders placed     : 45000
  cancelled         : 0
  rows in the view  : 45000
  total orders      : 45000, understated by 0
  cancellation rate : 0 percent, and now it is also true
  the pinned metric agrees with reality, which is the worst way for a
  constant to be tested

a shared view, read by metrics that do not share a question
  one definition, many readers      the reason to use a view
  one filter, many populations      the cost of using a view
  a metric about the excluded rows  cannot be computed there at all
  and returns a constant rather than an error

the test for this is not 'is the number right'
it is 'can this number take another value', and it costs one query to ask

orders_v excludes cancelled orders because a cancelled order is not revenue,
the definition is in its comment, and the revenue it produces has reconciled
every month for two years. Two later metrics were pointed at it, which is what
a view is for. Total orders now reads 38700 instead of 45000, and the
cancellation rate reads 0 percent - not because cancellations stopped, but
because the only rows that could make it non-zero are the rows the view
removes.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
