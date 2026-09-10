<!-- canonical: efficientnewlanguage.org/ai/examples/780-the-availability-was-four-nines-and-one-tenant-had-none | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 780 — The availability was four nines and one tenant had none

`the_availability_was_four_nines_and_one_tenant_had_none.eml` - Availability has been above its target for twenty-two months, measured from real requests rather than from a synthetic probe. What the number is an average over is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Availability has
# been above its target for twenty-two months, measured from real requests
# rather than from a synthetic probe. What the number is an average over is
# computed below.
#
# The measurement is sound. It counts real customer requests, not a prober
# hitting a health endpoint; a request that returns an error counts as failed
# even when the error is polite; the window is the calendar month the contract
# names rather than a rolling one chosen afterwards; and maintenance is not
# excluded.
#
# It is one ratio over every request from every tenant.

1400 => tenants
94000000 => requests_a_month
28200 => requests_that_failed
9990 => availability_target_per_myriad
22 => months_the_target_has_been_met
61 => tenants_with_any_failure_at_all
21000 => that_tenants_requests_that_failed
78000 => that_tenants_requests_in_the_month
540 => minutes_that_tenants_shard_was_down
0 => credits_paid_under_the_contract

requests_a_month - requests_that_failed => requests_that_succeeded
that_tenants_requests_in_the_month - that_tenants_requests_that_failed => that_tenants_requests_that_succeeded
tenants - tenants_with_any_failure_at_all => tenants_that_saw_nothing
int(requests_that_succeeded * 10000 / requests_a_month) => availability_across_everyone_per_myriad
int(that_tenants_requests_that_succeeded * 10000 / that_tenants_requests_in_the_month) => that_tenants_own_availability_per_myriad
int(that_tenants_requests_that_failed * 10000 / requests_that_failed) => share_of_all_failures_per_myriad

"tenants                         : " + str(tenants) ^0
"  with any failure at all       : " + str(tenants_with_any_failure_at_all) ^0
"  that saw nothing              : " + str(tenants_that_saw_nothing) ^0
"requests a month                : " + str(requests_a_month) ^0
"  that failed                   : " + str(requests_that_failed) ^0
"  that succeeded                : " + str(requests_that_succeeded) ^0
"" ^0
"availability target             : " + str(availability_target_per_myriad) + " per ten thousand" ^0
"availability across everyone    : " + str(availability_across_everyone_per_myriad) + " per ten thousand" ^0
"months the target has been met  : " + str(months_the_target_has_been_met) ^0
"" ^0
"one tenant" ^0
"  minutes their shard was down  : " + str(minutes_that_tenants_shard_was_down) ^0
"  their requests in the month   : " + str(that_tenants_requests_in_the_month) ^0
"  of those, failed              : " + str(that_tenants_requests_that_failed) ^0
"  their own availability        : " + str(that_tenants_own_availability_per_myriad) + " per ten thousand" ^0
"  their share of all failures   : " + str(share_of_all_failures_per_myriad) + " per ten thousand" ^0
"credits paid under the contract : " + str(credits_paid_under_the_contract) ^0
"" ^0

# ---- what the measurement verified ----

"the availability measurement" ^0
"  what it counts : real customer requests, not a prober" ^0
"    on a health endpoint" ^0
"  a polite error : counts as failed" ^0
"  the window : the calendar month the contract names," ^0
"    not a rolling one chosen afterwards" ^0
"  maintenance : not excluded" ^0
"  months met : " + str(months_the_target_has_been_met) ^0
"  verdict : AVAILABLE" ^0
"" ^0
"  refusing to exclude maintenance is the part almost" ^0
"  nobody does, and it is why " + str(availability_across_everyone_per_myriad) + " per ten thousand" ^0
"  is comparable month to month" ^0
"" ^0

# ---- what one ratio can hold ----

"the shape of the failures" ^0
"  tenants that saw any failure : " ^0
"    " + str(tenants_with_any_failure_at_all) + " of " + str(tenants) ^0
"  failures belonging to a single tenant : " ^0
"    " + str(that_tenants_requests_that_failed) + ", or " + str(share_of_all_failures_per_myriad) + " per ten thousand of them" ^0
"  that tenant's own availability : " ^0
"    " + str(that_tenants_own_availability_per_myriad) + " per ten thousand" ^0
"  the figure everyone reads : " ^0
"    " + str(availability_across_everyone_per_myriad) + " per ten thousand" ^0
"  both are correct, and they are ratios over different" ^0
"    populations of requests" ^0
"" ^0
"  a denominator of ninety-four million absorbs an outage" ^0
"  that was the whole month for the people in it" ^0
"" ^0

# ---- what that tenant saw ----

"nine hours on one shard" ^0
"  what their users got : errors, for " + str(minutes_that_tenants_shard_was_down) + " minutes" ^0
"  what the status page said : available" ^0
"  what the contract measures : the figure across" ^0
"    everyone" ^0
"  so credits owed : " + str(credits_paid_under_the_contract) ^0
"  was the measurement wrong : no. It is a correct ratio," ^0
"    and the tenant is inside its denominator" ^0
"" ^0

# ---- null control ----

# The same measurement, computed per tenant and then reported as the number of
# tenants below the target rather than as one ratio.
9997 => nc_availability_across_everyone_per_myriad
6 => nc_tenants_below_the_target
1400 => nc_tenants_measured

"null control - one figure per tenant, then count them" ^0
"  tenants measured : " + str(nc_tenants_measured) + ", unchanged" ^0
"  availability across everyone : " ^0
"    " + str(nc_availability_across_everyone_per_myriad) + ", unchanged" ^0
"  tenants below the target : " + str(nc_tenants_below_the_target) ^0
"  no request changed outcome; the question stopped being" ^0
"  asked once for everybody at the same time" ^0
"" ^0

# ---- the rule ----

"what a met availability target guarantees" ^0
"  " + str(availability_across_everyone_per_myriad) + " per ten thousand of all requests succeeded :" ^0
"    exactly, from real traffic, maintenance included," ^0
"    " + str(months_the_target_has_been_met) + " months" ^0
"  every customer was served : not addressed; one tenant" ^0
"    ran at " + str(that_tenants_own_availability_per_myriad) + " per ten thousand and carried " ^0
"    " + str(share_of_all_failures_per_myriad) + " per ten thousand of the month's failures" ^0
"" ^0
"an average is a true statement about a population and no" ^0
"statement about a member; when the failures are not spread" ^0
"the way the denominator is, the figure and the experience" ^0
"are about different things" ^0
"" ^0

"It counts real requests, calls a polite error a failure, uses the contract's" ^0
"calendar month and excludes no maintenance - " + str(availability_across_everyone_per_myriad) + " per ten thousand, " + str(months_the_target_has_been_met) ^0
"months running. It is one ratio over " + str(requests_a_month) + " requests, so one tenant's " ^0
"" + str(minutes_that_tenants_shard_was_down) + " minutes gave them " + str(that_tenants_own_availability_per_myriad) + " per ten thousand and " + str(share_of_all_failures_per_myriad) + " per ten thousand of" ^0
"every failure, against " + str(credits_paid_under_the_contract) + " credits." ^0
```

## Python (deterministic transpilation)

```python
tenants = 1400
requests_a_month = 94000000
requests_that_failed = 28200
availability_target_per_myriad = 9990
months_the_target_has_been_met = 22
tenants_with_any_failure_at_all = 61
that_tenants_requests_that_failed = 21000
that_tenants_requests_in_the_month = 78000
minutes_that_tenants_shard_was_down = 540
credits_paid_under_the_contract = 0
requests_that_succeeded = requests_a_month - requests_that_failed
that_tenants_requests_that_succeeded = that_tenants_requests_in_the_month - that_tenants_requests_that_failed
tenants_that_saw_nothing = tenants - tenants_with_any_failure_at_all
availability_across_everyone_per_myriad = int(requests_that_succeeded * 10000 / requests_a_month)
that_tenants_own_availability_per_myriad = int(that_tenants_requests_that_succeeded * 10000 / that_tenants_requests_in_the_month)
share_of_all_failures_per_myriad = int(that_tenants_requests_that_failed * 10000 / requests_that_failed)
print("tenants                         : " + str(tenants))
print("  with any failure at all       : " + str(tenants_with_any_failure_at_all))
print("  that saw nothing              : " + str(tenants_that_saw_nothing))
print("requests a month                : " + str(requests_a_month))
print("  that failed                   : " + str(requests_that_failed))
print("  that succeeded                : " + str(requests_that_succeeded))
print("")
print("availability target             : " + str(availability_target_per_myriad) + " per ten thousand")
print("availability across everyone    : " + str(availability_across_everyone_per_myriad) + " per ten thousand")
print("months the target has been met  : " + str(months_the_target_has_been_met))
print("")
print("one tenant")
print("  minutes their shard was down  : " + str(minutes_that_tenants_shard_was_down))
print("  their requests in the month   : " + str(that_tenants_requests_in_the_month))
print("  of those, failed              : " + str(that_tenants_requests_that_failed))
print("  their own availability        : " + str(that_tenants_own_availability_per_myriad) + " per ten thousand")
print("  their share of all failures   : " + str(share_of_all_failures_per_myriad) + " per ten thousand")
print("credits paid under the contract : " + str(credits_paid_under_the_contract))
print("")
print("the availability measurement")
print("  what it counts : real customer requests, not a prober")
print("    on a health endpoint")
print("  a polite error : counts as failed")
print("  the window : the calendar month the contract names,")
print("    not a rolling one chosen afterwards")
print("  maintenance : not excluded")
print("  months met : " + str(months_the_target_has_been_met))
print("  verdict : AVAILABLE")
print("")
print("  refusing to exclude maintenance is the part almost")
print("  nobody does, and it is why " + str(availability_across_everyone_per_myriad) + " per ten thousand")
print("  is comparable month to month")
print("")
print("the shape of the failures")
print("  tenants that saw any failure : ")
print("    " + str(tenants_with_any_failure_at_all) + " of " + str(tenants))
print("  failures belonging to a single tenant : ")
print("    " + str(that_tenants_requests_that_failed) + ", or " + str(share_of_all_failures_per_myriad) + " per ten thousand of them")
print("  that tenant's own availability : ")
print("    " + str(that_tenants_own_availability_per_myriad) + " per ten thousand")
print("  the figure everyone reads : ")
print("    " + str(availability_across_everyone_per_myriad) + " per ten thousand")
print("  both are correct, and they are ratios over different")
print("    populations of requests")
print("")
print("  a denominator of ninety-four million absorbs an outage")
print("  that was the whole month for the people in it")
print("")
print("nine hours on one shard")
print("  what their users got : errors, for " + str(minutes_that_tenants_shard_was_down) + " minutes")
print("  what the status page said : available")
print("  what the contract measures : the figure across")
print("    everyone")
print("  so credits owed : " + str(credits_paid_under_the_contract))
print("  was the measurement wrong : no. It is a correct ratio,")
print("    and the tenant is inside its denominator")
print("")
nc_availability_across_everyone_per_myriad = 9997
nc_tenants_below_the_target = 6
nc_tenants_measured = 1400
print("null control - one figure per tenant, then count them")
print("  tenants measured : " + str(nc_tenants_measured) + ", unchanged")
print("  availability across everyone : ")
print("    " + str(nc_availability_across_everyone_per_myriad) + ", unchanged")
print("  tenants below the target : " + str(nc_tenants_below_the_target))
print("  no request changed outcome; the question stopped being")
print("  asked once for everybody at the same time")
print("")
print("what a met availability target guarantees")
print("  " + str(availability_across_everyone_per_myriad) + " per ten thousand of all requests succeeded :")
print("    exactly, from real traffic, maintenance included,")
print("    " + str(months_the_target_has_been_met) + " months")
print("  every customer was served : not addressed; one tenant")
print("    ran at " + str(that_tenants_own_availability_per_myriad) + " per ten thousand and carried ")
print("    " + str(share_of_all_failures_per_myriad) + " per ten thousand of the month's failures")
print("")
print("an average is a true statement about a population and no")
print("statement about a member; when the failures are not spread")
print("the way the denominator is, the figure and the experience")
print("are about different things")
print("")
print("It counts real requests, calls a polite error a failure, uses the contract's")
print("calendar month and excludes no maintenance - " + str(availability_across_everyone_per_myriad) + " per ten thousand, " + str(months_the_target_has_been_met))
print("months running. It is one ratio over " + str(requests_a_month) + " requests, so one tenant's ")
print("" + str(minutes_that_tenants_shard_was_down) + " minutes gave them " + str(that_tenants_own_availability_per_myriad) + " per ten thousand and " + str(share_of_all_failures_per_myriad) + " per ten thousand of")
print("every failure, against " + str(credits_paid_under_the_contract) + " credits.")
```

## stdout (executed)

```text
tenants                         : 1400
  with any failure at all       : 61
  that saw nothing              : 1339
requests a month                : 94000000
  that failed                   : 28200
  that succeeded                : 93971800

availability target             : 9990 per ten thousand
availability across everyone    : 9997 per ten thousand
months the target has been met  : 22

one tenant
  minutes their shard was down  : 540
  their requests in the month   : 78000
  of those, failed              : 21000
  their own availability        : 7307 per ten thousand
  their share of all failures   : 7446 per ten thousand
credits paid under the contract : 0

the availability measurement
  what it counts : real customer requests, not a prober
    on a health endpoint
  a polite error : counts as failed
  the window : the calendar month the contract names,
    not a rolling one chosen afterwards
  maintenance : not excluded
  months met : 22
  verdict : AVAILABLE

  refusing to exclude maintenance is the part almost
  nobody does, and it is why 9997 per ten thousand
  is comparable month to month

the shape of the failures
  tenants that saw any failure : 
    61 of 1400
  failures belonging to a single tenant : 
    21000, or 7446 per ten thousand of them
  that tenant's own availability : 
    7307 per ten thousand
  the figure everyone reads : 
    9997 per ten thousand
  both are correct, and they are ratios over different
    populations of requests

  a denominator of ninety-four million absorbs an outage
  that was the whole month for the people in it

nine hours on one shard
  what their users got : errors, for 540 minutes
  what the status page said : available
  what the contract measures : the figure across
    everyone
  so credits owed : 0
  was the measurement wrong : no. It is a correct ratio,
    and the tenant is inside its denominator

null control - one figure per tenant, then count them
  tenants measured : 1400, unchanged
  availability across everyone : 
    9997, unchanged
  tenants below the target : 6
  no request changed outcome; the question stopped being
  asked once for everybody at the same time

what a met availability target guarantees
  9997 per ten thousand of all requests succeeded :
    exactly, from real traffic, maintenance included,
    22 months
  every customer was served : not addressed; one tenant
    ran at 7307 per ten thousand and carried 
    7446 per ten thousand of the month's failures

an average is a true statement about a population and no
statement about a member; when the failures are not spread
the way the denominator is, the figure and the experience
are about different things

It counts real requests, calls a polite error a failure, uses the contract's
calendar month and excludes no maintenance - 9997 per ten thousand, 22
months running. It is one ratio over 94000000 requests, so one tenant's 
540 minutes gave them 7307 per ten thousand and 7446 per ten thousand of
every failure, against 0 credits.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
