<!-- canonical: efficientnewlanguage.org/ai/examples/614-the-error-budget-was-monthly-and-the-outage-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 614 — The error budget was monthly and the outage was not

`the_error_budget_was_monthly_and_the_outage_was_not.eml` - Two months consume the same error budget to the tenth of a minute. What each one did to users is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two months
# consume the same error budget to the tenth of a minute. What each one did to
# users is computed below.
#
# A monthly error budget is the right instrument and it was chosen over the
# alternatives deliberately. It converts an availability target into a quantity
# that can be spent, which lets a team trade risk against velocity without
# arguing about it each time; it is comparable across services; and it cannot
# be gamed by moving a threshold, because the threshold IS the target.
#
# A budget is an integral. It sums unavailable time and discards when that time
# occurred, how it was distributed, and how many distinct people met it. Two
# very different months integrate to the same number.
#
# Both months below stay inside the budget. Neither triggers anything.

43200 => minutes_in_month
999 => target_per_thousand
12000 => active_users

int(minutes_in_month * (1000 - target_per_thousand) * 10 / 1000) => budget_tenths

"minutes in the month     : " + str(minutes_in_month) ^0
"availability target      : " + str(target_per_thousand) + " per thousand" ^0
"error budget             : " + str(int(budget_tenths / 10)) + " point " + str(budget_tenths % 10) + " minutes" ^0
"active users at any time : " + str(active_users) ^0
"" ^0

# ---- month A: one outage ----

# 420 rather than the full 432: the premise of this case is that the two
# months consume the SAME total to the tenth of a minute, and 432 does not
# divide by 30 incidents. Leaving it summed month B to 420 and made the
# closing sentence contradict the table directly above it.
420 => a_outage_tenths
1 => a_incidents

"month A - one incident" ^0
"  incidents           : " + str(a_incidents) ^0
"  downtime            : " + str(int(a_outage_tenths / 10)) + " point " + str(a_outage_tenths % 10) + " minutes" ^0
"  budget consumed     : " + str(int(a_outage_tenths * 1000 / budget_tenths)) + " per thousand" ^0
"" ^0

# ---- month B: the same total, spread ----

30 => b_incidents
int(a_outage_tenths / b_incidents) => b_each_tenths
b_each_tenths * b_incidents => b_outage_tenths

"month B - one incident a day" ^0
"  incidents           : " + str(b_incidents) ^0
"  each lasting        : " + str(int(b_each_tenths / 10)) + " point " + str(b_each_tenths % 10) + " minutes" ^0
"  downtime            : " + str(int(b_outage_tenths / 10)) + " point " + str(b_outage_tenths % 10) + " minutes" ^0
"  budget consumed     : " + str(int(b_outage_tenths * 1000 / budget_tenths)) + " per thousand" ^0
"" ^0
"  difference in budget consumed : " + str(a_outage_tenths - b_outage_tenths) + " tenths of a minute" ^0
"" ^0

# ---- what each month did to people ----
#
# One outage interrupts whoever is active in that window. Thirty outages
# interrupt whoever is active in thirty windows, and the sets barely overlap
# because the people online differ by day and by hour.

active_users => a_sessions_broken

35 => b_active_share_per_hundred
int(active_users * b_active_share_per_hundred / 100) => b_each_broken
b_each_broken * b_incidents => b_sessions_broken

"sessions interrupted" ^0
"  month A : " + str(a_sessions_broken) + " - everyone active during the one window" ^0
"  month B : " + str(b_sessions_broken) + " - " + str(b_each_broken) + " a day for " + str(b_incidents) + " days" ^0
int(b_sessions_broken * 10 / a_sessions_broken) => ratio_tenths
"  ratio   : " + str(int(ratio_tenths / 10)) + " point " + str(ratio_tenths % 10) + " times month A" ^0
"" ^0

# ---- the users who met it more than once ----

int(b_incidents * b_active_share_per_hundred / 100) => times_a_daily_user_is_hit

"a user who is active every day" ^0
"  interruptions in month A : 1, at most" ^0
"  interruptions in month B : about " + str(times_a_daily_user_is_hit) ^0
"  and the budget cannot express the difference, because it" ^0
"  sums minutes and a person is not a minute" ^0
"" ^0

# ---- what the SLO reports for each ----

"metric                     month A        month B" ^0
"  downtime, minutes        " + str(int(a_outage_tenths / 10)) + " point " + str(a_outage_tenths % 10) + "           " + str(int(b_outage_tenths / 10)) + " point " + str(b_outage_tenths % 10) ^0
"  budget consumed          " + str(int(a_outage_tenths * 1000 / budget_tenths)) + " per mille    " + str(int(b_outage_tenths * 1000 / budget_tenths)) + " per mille" ^0
"  budget exceeded          no             no" ^0
"  alerts fired             1              " + str(b_incidents) ^0
"  sessions interrupted     " + str(a_sessions_broken) + "          " + str(b_sessions_broken) ^0
"" ^0
"  the first four rows are what the SLO reports" ^0
"  the fifth is not one of them" ^0
"" ^0

# ---- the control ----
#
# The budget, against what it was defined to do. It was defined to bound total
# unavailability against a stated target, and it bounds it exactly, in both
# months, with no rounding and no room to argue.

"control - is the error budget correct" ^0
"  target                     : " + str(target_per_thousand) + " per thousand" ^0
"  budget, recomputed         : " + str(int(budget_tenths / 10)) + " point " + str(budget_tenths % 10) + " minutes" ^0
"  month A within budget      : yes" ^0
"  month B within budget      : yes" ^0
"  months misclassified       : 0" ^0
"  defects in the budget      : 0" ^0
"" ^0
"  every minute of downtime is in those totals exactly once" ^0
"" ^0

# ---- the null control ----
#
# The same budget over two months whose outages have the SAME shape and differ
# only in length. Now the budget ranks them, correctly, and by the same amount
# users would.

216 => nc_short_tenths

"null control - two months of the same shape" ^0
"  month C : 1 incident, " + str(int(nc_short_tenths / 10)) + " point " + str(nc_short_tenths % 10) + " minutes" ^0
"  month A : 1 incident, " + str(int(a_outage_tenths / 10)) + " point " + str(a_outage_tenths % 10) + " minutes" ^0
"  budget consumed : " + str(int(nc_short_tenths * 1000 / budget_tenths)) + " vs " + str(int(a_outage_tenths * 1000 / budget_tenths)) + " per mille" ^0
"  sessions        : " + str(int(active_users / 2)) + " vs " + str(a_sessions_broken) ^0
"  the budget and the users agree on the ordering" ^0
"  the statistic did not improve; the two months became comparable" ^0
"" ^0

# ---- the rule ----

"what a budget over a window measures" ^0
"  total unavailable time : exactly, and that is its definition" ^0
"  how it was distributed : discarded by the summation" ^0
"  how many people met it : never entered the arithmetic" ^0
"" ^0
"the missing number is not a tighter target, which would fail" ^0
"both months together; it is a second budget with a different" ^0
"denominator - distinct users interrupted, or incidents - so" ^0
"that a shape the sum cannot see has somewhere to show" ^0
"" ^0

"Both months consume " + str(int(a_outage_tenths * 1000 / budget_tenths)) + " per thousand of a " + str(int(budget_tenths / 10)) + " point " + str(budget_tenths % 10) + " minute budget, differ by" ^0
str(a_outage_tenths - b_outage_tenths) + " tenths of a minute, and neither exceeds anything. Month A interrupts" ^0
str(a_sessions_broken) + " sessions once; month B interrupts " + str(b_sessions_broken) + " - " + str(int(ratio_tenths / 10)) + " point " + str(ratio_tenths % 10) + " times - and a daily" ^0
"user meets it about " + str(times_a_daily_user_is_hit) + " times, which is a fact about people that a sum of" ^0
"minutes has no term for." ^0
```

## Python (deterministic transpilation)

```python
minutes_in_month = 43200
target_per_thousand = 999
active_users = 12000
budget_tenths = int(minutes_in_month * (1000 - target_per_thousand) * 10 / 1000)
print("minutes in the month     : " + str(minutes_in_month))
print("availability target      : " + str(target_per_thousand) + " per thousand")
print("error budget             : " + str(int(budget_tenths / 10)) + " point " + str(budget_tenths % 10) + " minutes")
print("active users at any time : " + str(active_users))
print("")
a_outage_tenths = 420
a_incidents = 1
print("month A - one incident")
print("  incidents           : " + str(a_incidents))
print("  downtime            : " + str(int(a_outage_tenths / 10)) + " point " + str(a_outage_tenths % 10) + " minutes")
print("  budget consumed     : " + str(int(a_outage_tenths * 1000 / budget_tenths)) + " per thousand")
print("")
b_incidents = 30
b_each_tenths = int(a_outage_tenths / b_incidents)
b_outage_tenths = b_each_tenths * b_incidents
print("month B - one incident a day")
print("  incidents           : " + str(b_incidents))
print("  each lasting        : " + str(int(b_each_tenths / 10)) + " point " + str(b_each_tenths % 10) + " minutes")
print("  downtime            : " + str(int(b_outage_tenths / 10)) + " point " + str(b_outage_tenths % 10) + " minutes")
print("  budget consumed     : " + str(int(b_outage_tenths * 1000 / budget_tenths)) + " per thousand")
print("")
print("  difference in budget consumed : " + str(a_outage_tenths - b_outage_tenths) + " tenths of a minute")
print("")
a_sessions_broken = active_users
b_active_share_per_hundred = 35
b_each_broken = int(active_users * b_active_share_per_hundred / 100)
b_sessions_broken = b_each_broken * b_incidents
print("sessions interrupted")
print("  month A : " + str(a_sessions_broken) + " - everyone active during the one window")
print("  month B : " + str(b_sessions_broken) + " - " + str(b_each_broken) + " a day for " + str(b_incidents) + " days")
ratio_tenths = int(b_sessions_broken * 10 / a_sessions_broken)
print("  ratio   : " + str(int(ratio_tenths / 10)) + " point " + str(ratio_tenths % 10) + " times month A")
print("")
times_a_daily_user_is_hit = int(b_incidents * b_active_share_per_hundred / 100)
print("a user who is active every day")
print("  interruptions in month A : 1, at most")
print("  interruptions in month B : about " + str(times_a_daily_user_is_hit))
print("  and the budget cannot express the difference, because it")
print("  sums minutes and a person is not a minute")
print("")
print("metric                     month A        month B")
print("  downtime, minutes        " + str(int(a_outage_tenths / 10)) + " point " + str(a_outage_tenths % 10) + "           " + str(int(b_outage_tenths / 10)) + " point " + str(b_outage_tenths % 10))
print("  budget consumed          " + str(int(a_outage_tenths * 1000 / budget_tenths)) + " per mille    " + str(int(b_outage_tenths * 1000 / budget_tenths)) + " per mille")
print("  budget exceeded          no             no")
print("  alerts fired             1              " + str(b_incidents))
print("  sessions interrupted     " + str(a_sessions_broken) + "          " + str(b_sessions_broken))
print("")
print("  the first four rows are what the SLO reports")
print("  the fifth is not one of them")
print("")
print("control - is the error budget correct")
print("  target                     : " + str(target_per_thousand) + " per thousand")
print("  budget, recomputed         : " + str(int(budget_tenths / 10)) + " point " + str(budget_tenths % 10) + " minutes")
print("  month A within budget      : yes")
print("  month B within budget      : yes")
print("  months misclassified       : 0")
print("  defects in the budget      : 0")
print("")
print("  every minute of downtime is in those totals exactly once")
print("")
nc_short_tenths = 216
print("null control - two months of the same shape")
print("  month C : 1 incident, " + str(int(nc_short_tenths / 10)) + " point " + str(nc_short_tenths % 10) + " minutes")
print("  month A : 1 incident, " + str(int(a_outage_tenths / 10)) + " point " + str(a_outage_tenths % 10) + " minutes")
print("  budget consumed : " + str(int(nc_short_tenths * 1000 / budget_tenths)) + " vs " + str(int(a_outage_tenths * 1000 / budget_tenths)) + " per mille")
print("  sessions        : " + str(int(active_users / 2)) + " vs " + str(a_sessions_broken))
print("  the budget and the users agree on the ordering")
print("  the statistic did not improve; the two months became comparable")
print("")
print("what a budget over a window measures")
print("  total unavailable time : exactly, and that is its definition")
print("  how it was distributed : discarded by the summation")
print("  how many people met it : never entered the arithmetic")
print("")
print("the missing number is not a tighter target, which would fail")
print("both months together; it is a second budget with a different")
print("denominator - distinct users interrupted, or incidents - so")
print("that a shape the sum cannot see has somewhere to show")
print("")
print("Both months consume " + str(int(a_outage_tenths * 1000 / budget_tenths)) + " per thousand of a " + str(int(budget_tenths / 10)) + " point " + str(budget_tenths % 10) + " minute budget, differ by")
print(str(a_outage_tenths - b_outage_tenths) + " tenths of a minute, and neither exceeds anything. Month A interrupts")
print(str(a_sessions_broken) + " sessions once; month B interrupts " + str(b_sessions_broken) + " - " + str(int(ratio_tenths / 10)) + " point " + str(ratio_tenths % 10) + " times - and a daily")
print("user meets it about " + str(times_a_daily_user_is_hit) + " times, which is a fact about people that a sum of")
print("minutes has no term for.")
```

## stdout (executed)

```text
minutes in the month     : 43200
availability target      : 999 per thousand
error budget             : 43 point 2 minutes
active users at any time : 12000

month A - one incident
  incidents           : 1
  downtime            : 42 point 0 minutes
  budget consumed     : 972 per thousand

month B - one incident a day
  incidents           : 30
  each lasting        : 1 point 4 minutes
  downtime            : 42 point 0 minutes
  budget consumed     : 972 per thousand

  difference in budget consumed : 0 tenths of a minute

sessions interrupted
  month A : 12000 - everyone active during the one window
  month B : 126000 - 4200 a day for 30 days
  ratio   : 10 point 5 times month A

a user who is active every day
  interruptions in month A : 1, at most
  interruptions in month B : about 10
  and the budget cannot express the difference, because it
  sums minutes and a person is not a minute

metric                     month A        month B
  downtime, minutes        42 point 0           42 point 0
  budget consumed          972 per mille    972 per mille
  budget exceeded          no             no
  alerts fired             1              30
  sessions interrupted     12000          126000

  the first four rows are what the SLO reports
  the fifth is not one of them

control - is the error budget correct
  target                     : 999 per thousand
  budget, recomputed         : 43 point 2 minutes
  month A within budget      : yes
  month B within budget      : yes
  months misclassified       : 0
  defects in the budget      : 0

  every minute of downtime is in those totals exactly once

null control - two months of the same shape
  month C : 1 incident, 21 point 6 minutes
  month A : 1 incident, 42 point 0 minutes
  budget consumed : 500 vs 972 per mille
  sessions        : 6000 vs 12000
  the budget and the users agree on the ordering
  the statistic did not improve; the two months became comparable

what a budget over a window measures
  total unavailable time : exactly, and that is its definition
  how it was distributed : discarded by the summation
  how many people met it : never entered the arithmetic

the missing number is not a tighter target, which would fail
both months together; it is a second budget with a different
denominator - distinct users interrupted, or incidents - so
that a shape the sum cannot see has somewhere to show

Both months consume 972 per thousand of a 43 point 2 minute budget, differ by
0 tenths of a minute, and neither exceeds anything. Month A interrupts
12000 sessions once; month B interrupts 126000 - 10 point 5 times - and a daily
user meets it about 10 times, which is a fact about people that a sum of
minutes has no term for.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
