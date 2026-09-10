<!-- canonical: efficientnewlanguage.org/ai/examples/784-the-error-budget-was-spent-evenly-and-one-endpoint-ate-it | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 784 — The error budget was spent evenly and one endpoint ate it

`the_error_budget_was_spent_evenly_and_one_endpoint_ate_it.eml` - The service has stayed inside its quarterly error budget for eleven quarters, and the budget is a real constraint rather than a slogan. What it is a budget over is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The service has
# stayed inside its quarterly error budget for eleven quarters, and the budget
# is a real constraint rather than a slogan. What it is a budget over is
# computed below.
#
# The discipline is genuine. Exceeding the budget freezes feature work, and the
# freeze has actually happened; the budget is spent by real customer errors
# rather than by a synthetic check; it is set from what customers said they
# could tolerate rather than from what the service happens to achieve; and it is
# not reset early when a quarter goes badly.
#
# It is one budget over every request to every endpoint.

214 => endpoints
61000000 => requests_a_quarter
475800 => errors_a_quarter
100 => error_budget_per_myriad
11 => quarters_within_budget
391000 => errors_on_one_endpoint
900000 => that_endpoints_requests
96 => endpoints_with_no_errors_at_all
0 => alerts_that_fire_on_a_per_endpoint_budget

endpoints - endpoints_with_no_errors_at_all => endpoints_with_any_error
errors_a_quarter - errors_on_one_endpoint => errors_everywhere_else
int(errors_a_quarter * 10000 / requests_a_quarter) => budget_spent_per_myriad
int(errors_on_one_endpoint * 10000 / errors_a_quarter) => one_endpoints_share_of_the_spend_per_myriad
int(that_endpoints_requests * 10000 / requests_a_quarter) => one_endpoints_share_of_traffic_per_myriad
int(errors_on_one_endpoint * 10000 / that_endpoints_requests) => that_endpoints_own_error_rate_per_myriad

"endpoints                       : " + str(endpoints) ^0
"  with no errors at all         : " + str(endpoints_with_no_errors_at_all) ^0
"  with any error                : " + str(endpoints_with_any_error) ^0
"requests a quarter              : " + str(requests_a_quarter) ^0
"errors a quarter                : " + str(errors_a_quarter) ^0
"" ^0
"error budget                    : " + str(error_budget_per_myriad) + " per ten thousand" ^0
"budget spent                    : " + str(budget_spent_per_myriad) + " per ten thousand" ^0
"quarters within budget          : " + str(quarters_within_budget) ^0
"" ^0
"one endpoint" ^0
"  its requests                  : " + str(that_endpoints_requests) ^0
"  its share of traffic          : " + str(one_endpoints_share_of_traffic_per_myriad) + " per ten thousand" ^0
"  its errors                    : " + str(errors_on_one_endpoint) ^0
"  its share of the spend        : " + str(one_endpoints_share_of_the_spend_per_myriad) + " per ten thousand" ^0
"  its own error rate            : " + str(that_endpoints_own_error_rate_per_myriad) + " per ten thousand" ^0
"errors everywhere else          : " + str(errors_everywhere_else) ^0
"per-endpoint budget alerts      : " + str(alerts_that_fire_on_a_per_endpoint_budget) ^0
"" ^0

# ---- what the budget verified ----

"the error budget" ^0
"  what exceeding it costs : a feature freeze, and the" ^0
"    freeze has happened" ^0
"  what spends it : real customer errors, not a synthetic" ^0
"    check" ^0
"  where the number came from : what customers said they" ^0
"    could tolerate" ^0
"  resetting early in a bad quarter : not done" ^0
"  quarters inside it : " + str(quarters_within_budget) ^0
"  verdict : WITHIN BUDGET" ^0
"" ^0
"  making the freeze real is the part almost nobody does," ^0
"  and it is why " + str(budget_spent_per_myriad) + " per ten thousand is a constraint" ^0
"" ^0

# ---- what one budget can hold ----

"where the spend went" ^0
"  traffic on one endpoint : " ^0
"    " + str(one_endpoints_share_of_traffic_per_myriad) + " per ten thousand of requests" ^0
"  errors on that endpoint : " ^0
"    " + str(one_endpoints_share_of_the_spend_per_myriad) + " per ten thousand of the spend" ^0
"  its own error rate : " ^0
"    " + str(that_endpoints_own_error_rate_per_myriad) + " per ten thousand" ^0
"  the service-wide rate : " + str(budget_spent_per_myriad) + " per ten thousand" ^0
"  both correct, over different populations of requests" ^0
"" ^0
"  a denominator of sixty-one million dilutes an endpoint" ^0
"  that fails two times in five for everyone who calls it" ^0
"" ^0

# ---- who calls that endpoint ----

"the callers of the one endpoint" ^0
"  what they see : " + str(that_endpoints_own_error_rate_per_myriad) + " per ten thousand failing" ^0
"  what the budget page shows : inside budget" ^0
"  does the freeze trigger for them : no; the freeze is" ^0
"    keyed to the service figure" ^0
"  alerts that would have fired on their behalf : " ^0
"    " + str(alerts_that_fire_on_a_per_endpoint_budget) ^0
"  endpoints in the same position : unknown; the budget" ^0
"    is not computed per endpoint" ^0
"" ^0

# ---- null control ----

# The same budget, allocated per endpoint in proportion to traffic, with the
# freeze triggered by any endpoint exceeding its own share.
78 => nc_service_wide_spend_per_myriad
1 => nc_endpoints_over_their_own_budget
11 => nc_quarters_measured

"null control - one budget per endpoint" ^0
"  quarters measured : " + str(nc_quarters_measured) + ", unchanged" ^0
"  service-wide spend : " + str(nc_service_wide_spend_per_myriad) + ", unchanged" ^0
"  endpoints over their own budget : " ^0
"    " + str(nc_endpoints_over_their_own_budget) ^0
"  no request changed outcome; the budget stopped being" ^0
"  one pool that a large denominator can absorb an" ^0
"  endpoint into" ^0
"" ^0

# ---- the rule ----

"what eleven quarters inside budget guarantees" ^0
"  errors across all requests stayed under " ^0
"    " + str(error_budget_per_myriad) + " per ten thousand : exactly, real errors, a" ^0
"    real freeze, no early resets" ^0
"  every endpoint was reliable : not addressed; one" ^0
"    carried " + str(one_endpoints_share_of_the_spend_per_myriad) + " per ten thousand of the spend on " ^0
"    " + str(one_endpoints_share_of_traffic_per_myriad) + " per ten thousand of the traffic" ^0
"" ^0
"a budget pooled across a population is spent by whoever" ^0
"spends it, and a large denominator is what makes one" ^0
"member's whole failure fit inside a small figure" ^0
"" ^0

"Exceeding it freezes feature work and the freeze has happened, it is spent by" ^0
"real errors and never reset early - " + str(budget_spent_per_myriad) + " per ten thousand against " + str(error_budget_per_myriad) + ", " ^0
"" + str(quarters_within_budget) + " quarters. It is one pool, so an endpoint with " ^0
"" + str(one_endpoints_share_of_traffic_per_myriad) + " per ten thousand of traffic took " + str(one_endpoints_share_of_the_spend_per_myriad) + " per ten thousand of the" ^0
"spend at " + str(that_endpoints_own_error_rate_per_myriad) + " per ten thousand of its own calls, under " + str(alerts_that_fire_on_a_per_endpoint_budget) + " alerts." ^0
```

## Python (deterministic transpilation)

```python
endpoints = 214
requests_a_quarter = 61000000
errors_a_quarter = 475800
error_budget_per_myriad = 100
quarters_within_budget = 11
errors_on_one_endpoint = 391000
that_endpoints_requests = 900000
endpoints_with_no_errors_at_all = 96
alerts_that_fire_on_a_per_endpoint_budget = 0
endpoints_with_any_error = endpoints - endpoints_with_no_errors_at_all
errors_everywhere_else = errors_a_quarter - errors_on_one_endpoint
budget_spent_per_myriad = int(errors_a_quarter * 10000 / requests_a_quarter)
one_endpoints_share_of_the_spend_per_myriad = int(errors_on_one_endpoint * 10000 / errors_a_quarter)
one_endpoints_share_of_traffic_per_myriad = int(that_endpoints_requests * 10000 / requests_a_quarter)
that_endpoints_own_error_rate_per_myriad = int(errors_on_one_endpoint * 10000 / that_endpoints_requests)
print("endpoints                       : " + str(endpoints))
print("  with no errors at all         : " + str(endpoints_with_no_errors_at_all))
print("  with any error                : " + str(endpoints_with_any_error))
print("requests a quarter              : " + str(requests_a_quarter))
print("errors a quarter                : " + str(errors_a_quarter))
print("")
print("error budget                    : " + str(error_budget_per_myriad) + " per ten thousand")
print("budget spent                    : " + str(budget_spent_per_myriad) + " per ten thousand")
print("quarters within budget          : " + str(quarters_within_budget))
print("")
print("one endpoint")
print("  its requests                  : " + str(that_endpoints_requests))
print("  its share of traffic          : " + str(one_endpoints_share_of_traffic_per_myriad) + " per ten thousand")
print("  its errors                    : " + str(errors_on_one_endpoint))
print("  its share of the spend        : " + str(one_endpoints_share_of_the_spend_per_myriad) + " per ten thousand")
print("  its own error rate            : " + str(that_endpoints_own_error_rate_per_myriad) + " per ten thousand")
print("errors everywhere else          : " + str(errors_everywhere_else))
print("per-endpoint budget alerts      : " + str(alerts_that_fire_on_a_per_endpoint_budget))
print("")
print("the error budget")
print("  what exceeding it costs : a feature freeze, and the")
print("    freeze has happened")
print("  what spends it : real customer errors, not a synthetic")
print("    check")
print("  where the number came from : what customers said they")
print("    could tolerate")
print("  resetting early in a bad quarter : not done")
print("  quarters inside it : " + str(quarters_within_budget))
print("  verdict : WITHIN BUDGET")
print("")
print("  making the freeze real is the part almost nobody does,")
print("  and it is why " + str(budget_spent_per_myriad) + " per ten thousand is a constraint")
print("")
print("where the spend went")
print("  traffic on one endpoint : ")
print("    " + str(one_endpoints_share_of_traffic_per_myriad) + " per ten thousand of requests")
print("  errors on that endpoint : ")
print("    " + str(one_endpoints_share_of_the_spend_per_myriad) + " per ten thousand of the spend")
print("  its own error rate : ")
print("    " + str(that_endpoints_own_error_rate_per_myriad) + " per ten thousand")
print("  the service-wide rate : " + str(budget_spent_per_myriad) + " per ten thousand")
print("  both correct, over different populations of requests")
print("")
print("  a denominator of sixty-one million dilutes an endpoint")
print("  that fails two times in five for everyone who calls it")
print("")
print("the callers of the one endpoint")
print("  what they see : " + str(that_endpoints_own_error_rate_per_myriad) + " per ten thousand failing")
print("  what the budget page shows : inside budget")
print("  does the freeze trigger for them : no; the freeze is")
print("    keyed to the service figure")
print("  alerts that would have fired on their behalf : ")
print("    " + str(alerts_that_fire_on_a_per_endpoint_budget))
print("  endpoints in the same position : unknown; the budget")
print("    is not computed per endpoint")
print("")
nc_service_wide_spend_per_myriad = 78
nc_endpoints_over_their_own_budget = 1
nc_quarters_measured = 11
print("null control - one budget per endpoint")
print("  quarters measured : " + str(nc_quarters_measured) + ", unchanged")
print("  service-wide spend : " + str(nc_service_wide_spend_per_myriad) + ", unchanged")
print("  endpoints over their own budget : ")
print("    " + str(nc_endpoints_over_their_own_budget))
print("  no request changed outcome; the budget stopped being")
print("  one pool that a large denominator can absorb an")
print("  endpoint into")
print("")
print("what eleven quarters inside budget guarantees")
print("  errors across all requests stayed under ")
print("    " + str(error_budget_per_myriad) + " per ten thousand : exactly, real errors, a")
print("    real freeze, no early resets")
print("  every endpoint was reliable : not addressed; one")
print("    carried " + str(one_endpoints_share_of_the_spend_per_myriad) + " per ten thousand of the spend on ")
print("    " + str(one_endpoints_share_of_traffic_per_myriad) + " per ten thousand of the traffic")
print("")
print("a budget pooled across a population is spent by whoever")
print("spends it, and a large denominator is what makes one")
print("member's whole failure fit inside a small figure")
print("")
print("Exceeding it freezes feature work and the freeze has happened, it is spent by")
print("real errors and never reset early - " + str(budget_spent_per_myriad) + " per ten thousand against " + str(error_budget_per_myriad) + ", ")
print("" + str(quarters_within_budget) + " quarters. It is one pool, so an endpoint with ")
print("" + str(one_endpoints_share_of_traffic_per_myriad) + " per ten thousand of traffic took " + str(one_endpoints_share_of_the_spend_per_myriad) + " per ten thousand of the")
print("spend at " + str(that_endpoints_own_error_rate_per_myriad) + " per ten thousand of its own calls, under " + str(alerts_that_fire_on_a_per_endpoint_budget) + " alerts.")
```

## stdout (executed)

```text
endpoints                       : 214
  with no errors at all         : 96
  with any error                : 118
requests a quarter              : 61000000
errors a quarter                : 475800

error budget                    : 100 per ten thousand
budget spent                    : 78 per ten thousand
quarters within budget          : 11

one endpoint
  its requests                  : 900000
  its share of traffic          : 147 per ten thousand
  its errors                    : 391000
  its share of the spend        : 8217 per ten thousand
  its own error rate            : 4344 per ten thousand
errors everywhere else          : 84800
per-endpoint budget alerts      : 0

the error budget
  what exceeding it costs : a feature freeze, and the
    freeze has happened
  what spends it : real customer errors, not a synthetic
    check
  where the number came from : what customers said they
    could tolerate
  resetting early in a bad quarter : not done
  quarters inside it : 11
  verdict : WITHIN BUDGET

  making the freeze real is the part almost nobody does,
  and it is why 78 per ten thousand is a constraint

where the spend went
  traffic on one endpoint : 
    147 per ten thousand of requests
  errors on that endpoint : 
    8217 per ten thousand of the spend
  its own error rate : 
    4344 per ten thousand
  the service-wide rate : 78 per ten thousand
  both correct, over different populations of requests

  a denominator of sixty-one million dilutes an endpoint
  that fails two times in five for everyone who calls it

the callers of the one endpoint
  what they see : 4344 per ten thousand failing
  what the budget page shows : inside budget
  does the freeze trigger for them : no; the freeze is
    keyed to the service figure
  alerts that would have fired on their behalf : 
    0
  endpoints in the same position : unknown; the budget
    is not computed per endpoint

null control - one budget per endpoint
  quarters measured : 11, unchanged
  service-wide spend : 78, unchanged
  endpoints over their own budget : 
    1
  no request changed outcome; the budget stopped being
  one pool that a large denominator can absorb an
  endpoint into

what eleven quarters inside budget guarantees
  errors across all requests stayed under 
    100 per ten thousand : exactly, real errors, a
    real freeze, no early resets
  every endpoint was reliable : not addressed; one
    carried 8217 per ten thousand of the spend on 
    147 per ten thousand of the traffic

a budget pooled across a population is spent by whoever
spends it, and a large denominator is what makes one
member's whole failure fit inside a small figure

Exceeding it freezes feature work and the freeze has happened, it is spent by
real errors and never reset early - 78 per ten thousand against 100, 
11 quarters. It is one pool, so an endpoint with 
147 per ten thousand of traffic took 8217 per ten thousand of the
spend at 4344 per ten thousand of its own calls, under 0 alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
