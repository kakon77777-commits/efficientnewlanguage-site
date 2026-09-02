<!-- canonical: efficientnewlanguage.org/ai/examples/665-the-quota-renewed-monthly-and-the-billing-cycle-did-not | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 665 — The quota renewed monthly and the billing cycle did not

`the_quota_renewed_monthly_and_the_billing_cycle_did_not.eml` - The quota resets on the first of each month and the customer never exceeded it. What the invoice charges for is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The quota resets
# on the first of each month and the customer never exceeded it. What the
# invoice charges for is computed below.
#
# The quota is enforced correctly. Five million calls a month, counted in shared
# storage, reset atomically at midnight on the first, with a header on every
# response telling the customer how much remains. The customer watched that
# header, stayed under it in both months, and was never throttled.
#
# The invoice is computed over the BILLING CYCLE, which starts on the day the
# account was created. The two windows are both a month long and they are not
# the same month.
#
# The cycle runs the eighteenth to the seventeenth, so it contains one quota
# reset, and the customer receives two grants inside one invoice.

5000000 => quota_per_month
18 => cycle_start_day
1 => quota_reset_day
4800000 => used_before_the_reset
4900000 => used_after_the_reset
0 => quota_violations
0 => times_throttled

used_before_the_reset + used_after_the_reset => used_in_the_billing_cycle
quota_per_month => allowance_on_the_invoice
used_in_the_billing_cycle - allowance_on_the_invoice => overage_billed

"quota per month              : " + str(quota_per_month) ^0
"quota resets on day          : " + str(quota_reset_day) ^0
"billing cycle starts on day  : " + str(cycle_start_day) ^0
"" ^0
"used before the reset        : " + str(used_before_the_reset) ^0
"used after the reset         : " + str(used_after_the_reset) ^0
"used in the billing cycle    : " + str(used_in_the_billing_cycle) ^0
"allowance on the invoice     : " + str(allowance_on_the_invoice) ^0
"overage billed               : " + str(overage_billed) ^0
"" ^0

# ---- what the quota verified ----

"the quota enforcement" ^0
"  limit per month     : " + str(quota_per_month) ^0
"  counter storage     : shared, atomic reset" ^0
"  remaining sent on every response : yes" ^0
"  violations          : " + str(quota_violations) ^0
"  times throttled     : " + str(times_throttled) ^0
"  verdict             : WITHIN QUOTA" ^0
"" ^0
"  the customer read that header and managed to it; both" ^0
"  months are under the limit and neither is close" ^0
"" ^0

# ---- the two windows ----

"the two months" ^0
"  the quota's month  : the first to the last of the" ^0
"    calendar month" ^0
"  the invoice's month: day " + str(cycle_start_day) + " to day " + str(cycle_start_day - 1) ^0
"  quota resets inside one billing cycle : 1" ^0
"  grants the customer receives inside one invoice : 2" ^0
"  allowance the invoice subtracts : 1" ^0
"" ^0
"  each window is a month and neither is wrong; they" ^0
"  disagree about which days go together" ^0
"" ^0

int(overage_billed * 10000 / used_in_the_billing_cycle) => overage_share_per_myriad
"share of cycle usage billed as overage : " + str(overage_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what each side can prove ----

"the dispute" ^0
"  customer shows     : two months, each under " + str(quota_per_month) ^0
"  invoice shows      : " + str(used_in_the_billing_cycle) + " calls against " + str(allowance_on_the_invoice) ^0
"  both are computed correctly : yes" ^0
"  a document defining which month is the month : none" ^0
"" ^0
"  the support engineer can reproduce both numbers and" ^0
"  neither system has a defect to fix" ^0
"" ^0

# ---- null control ----

# The same quota, reset on the customer's cycle boundary rather than the
# calendar month.
used_after_the_reset => nc_used_in_the_billing_cycle
0 => nc_overage_billed

"null control - the quota resets on the cycle boundary" ^0
"  quota violations   : " + str(quota_violations) + ", unchanged" ^0
"  grants inside one invoice : 1" ^0
"  overage billed     : " + str(nc_overage_billed) ^0
"  neither the quota nor the invoice became more correct;" ^0
"  they started dividing the year at the same points" ^0
"" ^0

# ---- the rule ----

"what staying inside the quota guarantees" ^0
"  no request is throttled : exactly" ^0
"  no overage is charged   : not addressed; the charge is" ^0
"    computed over a different window, and a window is a" ^0
"    choice each system makes independently" ^0
"" ^0
"two correct counters over two correct periods produce two" ^0
"correct answers; the defect is the assumption that a limit" ^0
"and a price share a calendar" ^0
"" ^0

"The customer stayed inside the quota in both months - " + str(used_before_the_reset) + " and " + str(used_after_the_reset) ^0
"against " + str(quota_per_month) + " - with " + str(quota_violations) + " violations and " + str(times_throttled) + " throttled requests, managed" ^0
"against a header the API sends on every response. The billing cycle starts on" ^0
"day " + str(cycle_start_day) + " and contains one quota reset, so the invoice sees " + str(used_in_the_billing_cycle) + " calls against" ^0
"one allowance and bills " + str(overage_billed) + " as overage, " + str(overage_share_per_myriad) + " per ten thousand of the cycle." ^0
```

## Python (deterministic transpilation)

```python
quota_per_month = 5000000
cycle_start_day = 18
quota_reset_day = 1
used_before_the_reset = 4800000
used_after_the_reset = 4900000
quota_violations = 0
times_throttled = 0
used_in_the_billing_cycle = used_before_the_reset + used_after_the_reset
allowance_on_the_invoice = quota_per_month
overage_billed = used_in_the_billing_cycle - allowance_on_the_invoice
print("quota per month              : " + str(quota_per_month))
print("quota resets on day          : " + str(quota_reset_day))
print("billing cycle starts on day  : " + str(cycle_start_day))
print("")
print("used before the reset        : " + str(used_before_the_reset))
print("used after the reset         : " + str(used_after_the_reset))
print("used in the billing cycle    : " + str(used_in_the_billing_cycle))
print("allowance on the invoice     : " + str(allowance_on_the_invoice))
print("overage billed               : " + str(overage_billed))
print("")
print("the quota enforcement")
print("  limit per month     : " + str(quota_per_month))
print("  counter storage     : shared, atomic reset")
print("  remaining sent on every response : yes")
print("  violations          : " + str(quota_violations))
print("  times throttled     : " + str(times_throttled))
print("  verdict             : WITHIN QUOTA")
print("")
print("  the customer read that header and managed to it; both")
print("  months are under the limit and neither is close")
print("")
print("the two months")
print("  the quota's month  : the first to the last of the")
print("    calendar month")
print("  the invoice's month: day " + str(cycle_start_day) + " to day " + str(cycle_start_day - 1))
print("  quota resets inside one billing cycle : 1")
print("  grants the customer receives inside one invoice : 2")
print("  allowance the invoice subtracts : 1")
print("")
print("  each window is a month and neither is wrong; they")
print("  disagree about which days go together")
print("")
overage_share_per_myriad = int(overage_billed * 10000 / used_in_the_billing_cycle)
print("share of cycle usage billed as overage : " + str(overage_share_per_myriad) + " per ten thousand")
print("")
print("the dispute")
print("  customer shows     : two months, each under " + str(quota_per_month))
print("  invoice shows      : " + str(used_in_the_billing_cycle) + " calls against " + str(allowance_on_the_invoice))
print("  both are computed correctly : yes")
print("  a document defining which month is the month : none")
print("")
print("  the support engineer can reproduce both numbers and")
print("  neither system has a defect to fix")
print("")
nc_used_in_the_billing_cycle = used_after_the_reset
nc_overage_billed = 0
print("null control - the quota resets on the cycle boundary")
print("  quota violations   : " + str(quota_violations) + ", unchanged")
print("  grants inside one invoice : 1")
print("  overage billed     : " + str(nc_overage_billed))
print("  neither the quota nor the invoice became more correct;")
print("  they started dividing the year at the same points")
print("")
print("what staying inside the quota guarantees")
print("  no request is throttled : exactly")
print("  no overage is charged   : not addressed; the charge is")
print("    computed over a different window, and a window is a")
print("    choice each system makes independently")
print("")
print("two correct counters over two correct periods produce two")
print("correct answers; the defect is the assumption that a limit")
print("and a price share a calendar")
print("")
print("The customer stayed inside the quota in both months - " + str(used_before_the_reset) + " and " + str(used_after_the_reset))
print("against " + str(quota_per_month) + " - with " + str(quota_violations) + " violations and " + str(times_throttled) + " throttled requests, managed")
print("against a header the API sends on every response. The billing cycle starts on")
print("day " + str(cycle_start_day) + " and contains one quota reset, so the invoice sees " + str(used_in_the_billing_cycle) + " calls against")
print("one allowance and bills " + str(overage_billed) + " as overage, " + str(overage_share_per_myriad) + " per ten thousand of the cycle.")
```

## stdout (executed)

```text
quota per month              : 5000000
quota resets on day          : 1
billing cycle starts on day  : 18

used before the reset        : 4800000
used after the reset         : 4900000
used in the billing cycle    : 9700000
allowance on the invoice     : 5000000
overage billed               : 4700000

the quota enforcement
  limit per month     : 5000000
  counter storage     : shared, atomic reset
  remaining sent on every response : yes
  violations          : 0
  times throttled     : 0
  verdict             : WITHIN QUOTA

  the customer read that header and managed to it; both
  months are under the limit and neither is close

the two months
  the quota's month  : the first to the last of the
    calendar month
  the invoice's month: day 18 to day 17
  quota resets inside one billing cycle : 1
  grants the customer receives inside one invoice : 2
  allowance the invoice subtracts : 1

  each window is a month and neither is wrong; they
  disagree about which days go together

share of cycle usage billed as overage : 4845 per ten thousand

the dispute
  customer shows     : two months, each under 5000000
  invoice shows      : 9700000 calls against 5000000
  both are computed correctly : yes
  a document defining which month is the month : none

  the support engineer can reproduce both numbers and
  neither system has a defect to fix

null control - the quota resets on the cycle boundary
  quota violations   : 0, unchanged
  grants inside one invoice : 1
  overage billed     : 0
  neither the quota nor the invoice became more correct;
  they started dividing the year at the same points

what staying inside the quota guarantees
  no request is throttled : exactly
  no overage is charged   : not addressed; the charge is
    computed over a different window, and a window is a
    choice each system makes independently

two correct counters over two correct periods produce two
correct answers; the defect is the assumption that a limit
and a price share a calendar

The customer stayed inside the quota in both months - 4800000 and 4900000
against 5000000 - with 0 violations and 0 throttled requests, managed
against a header the API sends on every response. The billing cycle starts on
day 18 and contains one quota reset, so the invoice sees 9700000 calls against
one allowance and bills 4700000 as overage, 4845 per ten thousand of the cycle.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
