<!-- canonical: efficientnewlanguage.org/ai/examples/708-the-quota-was-checked-at-submit-and-spent-at-run | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 708 — The quota was checked at submit and spent at run

`the_quota_was_checked_at_submit_and_spent_at_run.eml` - Every job is checked against its tenant's remaining budget before it is accepted, and no submission has bypassed the check. What the check compares is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every job is
# checked against its tenant's remaining budget before it is accepted, and no
# submission has bypassed the check. What the check compares is computed below.
#
# The admission check is real enforcement, not advice. It runs in the submit
# path, it refuses rather than warns, there is no flag to skip it, and it has
# turned away nine thousand four hundred submissions this month. A tenant
# cannot submit a job whose declared cost exceeds what is left.
#
# The check reads the budget remaining, which is the quota minus what completed
# jobs have spent. A job that was accepted and has not run yet has spent
# nothing, so it appears in neither term, and it is going to run.
#
# The median job waits forty-one minutes in the queue before it starts.

340000 => submissions_per_month
9400 => submissions_refused_at_submit
0 => submissions_that_bypassed_the_check
41 => median_queue_minutes
1900 => tenants
210 => tenants_whose_spend_exceeded_quota_this_month
24 => accepted_and_not_yet_started_per_tenant_median
0 => reservations_taken_at_submit

tenants - tenants_whose_spend_exceeded_quota_this_month => tenants_within_quota_this_month
int(tenants_whose_spend_exceeded_quota_this_month * 10000 / tenants) => overrun_per_myriad
int(submissions_refused_at_submit * 10000 / submissions_per_month) => refused_per_myriad

"submissions per month           : " + str(submissions_per_month) ^0
"  refused at submit             : " + str(submissions_refused_at_submit) ^0
"  share refused                 : " + str(refused_per_myriad) + " per ten thousand" ^0
"  that bypassed the check       : " + str(submissions_that_bypassed_the_check) ^0
"" ^0
"median queue wait, minutes      : " + str(median_queue_minutes) ^0
"accepted and not yet started, per tenant : " + str(accepted_and_not_yet_started_per_tenant_median) ^0
"reservations taken at submit    : " + str(reservations_taken_at_submit) ^0
"" ^0
"tenants                         : " + str(tenants) ^0
"  within quota                  : " + str(tenants_within_quota_this_month) ^0
"  spend exceeded quota          : " + str(tenants_whose_spend_exceeded_quota_this_month) ^0
"  share                         : " + str(overrun_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the check enforces ----

"the admission check" ^0
"  where it runs : the submit path" ^0
"  on insufficient budget : refuses, does not warn" ^0
"  a flag to skip it : none" ^0
"  submissions refused this month : " + str(submissions_refused_at_submit) ^0
"  submissions that bypassed it   : " + str(submissions_that_bypassed_the_check) ^0
"  verdict : ENFORCED" ^0
"" ^0
"  refusing rather than warning is what makes this a limit," ^0
"  and it is enforced without exception" ^0
"" ^0

# ---- what the two operands are ----

"the comparison" ^0
"  left  : the declared cost of this job" ^0
"  right : quota minus what completed jobs have spent" ^0
"  jobs accepted and not yet run : counted in neither term" ^0
"  how many of those a tenant typically has : " + str(accepted_and_not_yet_started_per_tenant_median) ^0
"  reservations that would put them in the right operand : " ^0
"    " + str(reservations_taken_at_submit) ^0
"" ^0
"  the check is correct about one job against a number, and" ^0
"  the number omits the jobs the same check already accepted" ^0
"" ^0
# ---- how a tenant exceeds a limit nobody let them exceed ----

# No submission was ever accepted that exceeded the remaining budget. Each of
# the twenty-four queued jobs passed the check honestly, against a budget that
# was accurate at the moment it was read.
"one tenant near the limit" ^0
"  jobs submitted while near the limit : each passes" ^0
"  each check compares against : the budget at that instant" ^0
"  each of those checks is correct : yes" ^0
"  jobs queued and approved     : " + str(accepted_and_not_yet_started_per_tenant_median) ^0
"  what they collectively cost  : more than what is left" ^0
"  the moment the aggregate is evaluated : never; there is" ^0
"    no step that sums the approved queue" ^0
"" ^0

# ---- the two times ----

"submit and run" ^0
"  what happens at submit : the check, and acceptance" ^0
"  what happens at run    : the spend" ^0
"  minutes between them, median : " + str(median_queue_minutes) ^0
"  what changes in between : other jobs of the same tenant" ^0
"    start and finish" ^0
"  what the check knew about them : nothing; they had not" ^0
"    spent yet either" ^0
"" ^0

# ---- null control ----

# The same check, debiting a reservation at submit and releasing it when the
# job finishes, so the remaining budget counts committed future spend.
submissions_per_month => nc_submissions_still_checked
0 => nc_tenants_whose_spend_exceeded_quota_this_month
accepted_and_not_yet_started_per_tenant_median => nc_queued_jobs_visible_to_the_check

"null control - a reservation is taken at submit" ^0
"  submissions checked : " + str(nc_submissions_still_checked) + ", unchanged" ^0
"  queued jobs visible to the check : " + str(nc_queued_jobs_visible_to_the_check) ^0
"  tenants exceeding quota : " + str(nc_tenants_whose_spend_exceeded_quota_this_month) ^0
"  the check did not become stricter; the number it reads" ^0
"  started including the commitments the check itself made" ^0
"" ^0

# ---- the rule ----

"what an enforced admission check guarantees" ^0
"  no accepted job exceeded the budget at its own submit :" ^0
"    exactly, with no exception and no bypass" ^0
"  accepted jobs will not exceed the budget              : not" ^0
"    addressed; that is a property of a set, and the check" ^0
"    is a predicate on one element against a stale total" ^0
"" ^0
"a limit enforced per request bounds each request; bounding" ^0
"the sum requires the accounting to move at the moment of the" ^0
"decision rather than at the moment of the cost" ^0
"" ^0

"The check is real enforcement: it runs in the submit path, refuses rather than" ^0
"warns, has no bypass, and turned away " + str(submissions_refused_at_submit) + " of " + str(submissions_per_month) + " submissions - " + str(refused_per_myriad) ^0
"per ten thousand. It compares one job against quota minus completed spend, and" ^0
"a tenant holds " + str(accepted_and_not_yet_started_per_tenant_median) + " approved jobs waiting a median of " + str(median_queue_minutes) + " minutes with " + str(reservations_taken_at_submit) ^0
"reservations against them, so " + str(tenants_whose_spend_exceeded_quota_this_month) + " of " + str(tenants) + " tenants - " + str(overrun_per_myriad) + " per ten thousand -" ^0
"spent past a quota no single submission was ever allowed to exceed." ^0
```

## Python (deterministic transpilation)

```python
submissions_per_month = 340000
submissions_refused_at_submit = 9400
submissions_that_bypassed_the_check = 0
median_queue_minutes = 41
tenants = 1900
tenants_whose_spend_exceeded_quota_this_month = 210
accepted_and_not_yet_started_per_tenant_median = 24
reservations_taken_at_submit = 0
tenants_within_quota_this_month = tenants - tenants_whose_spend_exceeded_quota_this_month
overrun_per_myriad = int(tenants_whose_spend_exceeded_quota_this_month * 10000 / tenants)
refused_per_myriad = int(submissions_refused_at_submit * 10000 / submissions_per_month)
print("submissions per month           : " + str(submissions_per_month))
print("  refused at submit             : " + str(submissions_refused_at_submit))
print("  share refused                 : " + str(refused_per_myriad) + " per ten thousand")
print("  that bypassed the check       : " + str(submissions_that_bypassed_the_check))
print("")
print("median queue wait, minutes      : " + str(median_queue_minutes))
print("accepted and not yet started, per tenant : " + str(accepted_and_not_yet_started_per_tenant_median))
print("reservations taken at submit    : " + str(reservations_taken_at_submit))
print("")
print("tenants                         : " + str(tenants))
print("  within quota                  : " + str(tenants_within_quota_this_month))
print("  spend exceeded quota          : " + str(tenants_whose_spend_exceeded_quota_this_month))
print("  share                         : " + str(overrun_per_myriad) + " per ten thousand")
print("")
print("the admission check")
print("  where it runs : the submit path")
print("  on insufficient budget : refuses, does not warn")
print("  a flag to skip it : none")
print("  submissions refused this month : " + str(submissions_refused_at_submit))
print("  submissions that bypassed it   : " + str(submissions_that_bypassed_the_check))
print("  verdict : ENFORCED")
print("")
print("  refusing rather than warning is what makes this a limit,")
print("  and it is enforced without exception")
print("")
print("the comparison")
print("  left  : the declared cost of this job")
print("  right : quota minus what completed jobs have spent")
print("  jobs accepted and not yet run : counted in neither term")
print("  how many of those a tenant typically has : " + str(accepted_and_not_yet_started_per_tenant_median))
print("  reservations that would put them in the right operand : ")
print("    " + str(reservations_taken_at_submit))
print("")
print("  the check is correct about one job against a number, and")
print("  the number omits the jobs the same check already accepted")
print("")
print("one tenant near the limit")
print("  jobs submitted while near the limit : each passes")
print("  each check compares against : the budget at that instant")
print("  each of those checks is correct : yes")
print("  jobs queued and approved     : " + str(accepted_and_not_yet_started_per_tenant_median))
print("  what they collectively cost  : more than what is left")
print("  the moment the aggregate is evaluated : never; there is")
print("    no step that sums the approved queue")
print("")
print("submit and run")
print("  what happens at submit : the check, and acceptance")
print("  what happens at run    : the spend")
print("  minutes between them, median : " + str(median_queue_minutes))
print("  what changes in between : other jobs of the same tenant")
print("    start and finish")
print("  what the check knew about them : nothing; they had not")
print("    spent yet either")
print("")
nc_submissions_still_checked = submissions_per_month
nc_tenants_whose_spend_exceeded_quota_this_month = 0
nc_queued_jobs_visible_to_the_check = accepted_and_not_yet_started_per_tenant_median
print("null control - a reservation is taken at submit")
print("  submissions checked : " + str(nc_submissions_still_checked) + ", unchanged")
print("  queued jobs visible to the check : " + str(nc_queued_jobs_visible_to_the_check))
print("  tenants exceeding quota : " + str(nc_tenants_whose_spend_exceeded_quota_this_month))
print("  the check did not become stricter; the number it reads")
print("  started including the commitments the check itself made")
print("")
print("what an enforced admission check guarantees")
print("  no accepted job exceeded the budget at its own submit :")
print("    exactly, with no exception and no bypass")
print("  accepted jobs will not exceed the budget              : not")
print("    addressed; that is a property of a set, and the check")
print("    is a predicate on one element against a stale total")
print("")
print("a limit enforced per request bounds each request; bounding")
print("the sum requires the accounting to move at the moment of the")
print("decision rather than at the moment of the cost")
print("")
print("The check is real enforcement: it runs in the submit path, refuses rather than")
print("warns, has no bypass, and turned away " + str(submissions_refused_at_submit) + " of " + str(submissions_per_month) + " submissions - " + str(refused_per_myriad))
print("per ten thousand. It compares one job against quota minus completed spend, and")
print("a tenant holds " + str(accepted_and_not_yet_started_per_tenant_median) + " approved jobs waiting a median of " + str(median_queue_minutes) + " minutes with " + str(reservations_taken_at_submit))
print("reservations against them, so " + str(tenants_whose_spend_exceeded_quota_this_month) + " of " + str(tenants) + " tenants - " + str(overrun_per_myriad) + " per ten thousand -")
print("spent past a quota no single submission was ever allowed to exceed.")
```

## stdout (executed)

```text
submissions per month           : 340000
  refused at submit             : 9400
  share refused                 : 276 per ten thousand
  that bypassed the check       : 0

median queue wait, minutes      : 41
accepted and not yet started, per tenant : 24
reservations taken at submit    : 0

tenants                         : 1900
  within quota                  : 1690
  spend exceeded quota          : 210
  share                         : 1105 per ten thousand

the admission check
  where it runs : the submit path
  on insufficient budget : refuses, does not warn
  a flag to skip it : none
  submissions refused this month : 9400
  submissions that bypassed it   : 0
  verdict : ENFORCED

  refusing rather than warning is what makes this a limit,
  and it is enforced without exception

the comparison
  left  : the declared cost of this job
  right : quota minus what completed jobs have spent
  jobs accepted and not yet run : counted in neither term
  how many of those a tenant typically has : 24
  reservations that would put them in the right operand : 
    0

  the check is correct about one job against a number, and
  the number omits the jobs the same check already accepted

one tenant near the limit
  jobs submitted while near the limit : each passes
  each check compares against : the budget at that instant
  each of those checks is correct : yes
  jobs queued and approved     : 24
  what they collectively cost  : more than what is left
  the moment the aggregate is evaluated : never; there is
    no step that sums the approved queue

submit and run
  what happens at submit : the check, and acceptance
  what happens at run    : the spend
  minutes between them, median : 41
  what changes in between : other jobs of the same tenant
    start and finish
  what the check knew about them : nothing; they had not
    spent yet either

null control - a reservation is taken at submit
  submissions checked : 340000, unchanged
  queued jobs visible to the check : 24
  tenants exceeding quota : 0
  the check did not become stricter; the number it reads
  started including the commitments the check itself made

what an enforced admission check guarantees
  no accepted job exceeded the budget at its own submit :
    exactly, with no exception and no bypass
  accepted jobs will not exceed the budget              : not
    addressed; that is a property of a set, and the check
    is a predicate on one element against a stale total

a limit enforced per request bounds each request; bounding
the sum requires the accounting to move at the moment of the
decision rather than at the moment of the cost

The check is real enforcement: it runs in the submit path, refuses rather than
warns, has no bypass, and turned away 9400 of 340000 submissions - 276
per ten thousand. It compares one job against quota minus completed spend, and
a tenant holds 24 approved jobs waiting a median of 41 minutes with 0
reservations against them, so 210 of 1900 tenants - 1105 per ten thousand -
spent past a quota no single submission was ever allowed to exceed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
