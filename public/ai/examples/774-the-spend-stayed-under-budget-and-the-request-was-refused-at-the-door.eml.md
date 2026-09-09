<!-- canonical: efficientnewlanguage.org/ai/examples/774-the-spend-stayed-under-budget-and-the-request-was-refused-at-the-door | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 774 — The spend stayed under budget and the request was refused at the door

`the_spend_stayed_under_budget_and_the_request_was_refused_at_the_door.eml` - The research cluster has not exceeded its monthly budget once in three years, and the control that holds it there is a real one. How it holds is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The research
# cluster has not exceeded its monthly budget once in three years, and the
# control that holds it there is a real one. How it holds is computed below.
#
# The control is admission. A job carries an estimated cost, the estimate is
# checked against what the team has left, and a job that would take the team
# past it is refused at submission rather than killed halfway through. Nothing
# is reclaimed retroactively, no run is lost to a mid-flight cancellation, and
# the estimate is calibrated against measured cost every month.
#
# So the spend cannot exceed the budget. The quantity that can vary is what was
# turned away.

480000 => monthly_budget_core_hours
471200 => core_hours_spent_last_month
36 => months_never_over_budget
15400 => jobs_submitted_a_month
1870 => jobs_refused_at_admission
96300 => core_hours_inside_the_refused_jobs
1290 => refused_jobs_resubmitted_smaller
74 => teams_on_the_cluster
41 => teams_that_reached_the_gate
0 => reports_that_carry_the_refused_hours

monthly_budget_core_hours - core_hours_spent_last_month => core_hours_of_headroom
jobs_refused_at_admission - refused_jobs_resubmitted_smaller => refused_jobs_never_seen_again
teams_on_the_cluster - teams_that_reached_the_gate => teams_that_never_reached_it
int(core_hours_spent_last_month * 10000 / monthly_budget_core_hours) => budget_used_per_myriad
int(jobs_refused_at_admission * 10000 / jobs_submitted_a_month) => jobs_refused_per_myriad
int(core_hours_inside_the_refused_jobs * 10000 / monthly_budget_core_hours) => refused_hours_against_budget_myriad

"monthly budget, core hours      : " + str(monthly_budget_core_hours) ^0
"  spent last month              : " + str(core_hours_spent_last_month) ^0
"  headroom                      : " + str(core_hours_of_headroom) ^0
"  budget used                   : " + str(budget_used_per_myriad) + " per ten thousand" ^0
"months never over budget        : " + str(months_never_over_budget) ^0
"" ^0
"jobs submitted a month          : " + str(jobs_submitted_a_month) ^0
"  refused at admission          : " + str(jobs_refused_at_admission) ^0
"  refused share                 : " + str(jobs_refused_per_myriad) + " per ten thousand" ^0
"  resubmitted smaller           : " + str(refused_jobs_resubmitted_smaller) ^0
"  never seen again              : " + str(refused_jobs_never_seen_again) ^0
"" ^0
"core hours inside refused jobs  : " + str(core_hours_inside_the_refused_jobs) ^0
"  against the budget            : " + str(refused_hours_against_budget_myriad) + " per ten thousand" ^0
"teams on the cluster            : " + str(teams_on_the_cluster) ^0
"  that reached the gate         : " + str(teams_that_reached_the_gate) ^0
"  that never reached it         : " + str(teams_that_never_reached_it) ^0
"reports carrying refused hours  : " + str(reports_that_carry_the_refused_hours) ^0
"" ^0

# ---- what the control verified ----

"the admission control" ^0
"  when it acts : at submission, against the team's" ^0
"    remaining budget" ^0
"  what it does not do : kill a run halfway or reclaim" ^0
"    hours after the fact" ^0
"  the estimate : calibrated against measured cost every" ^0
"    month, so a refusal is not guesswork" ^0
"  months without an overspend : " + str(months_never_over_budget) ^0
"  verdict : WITHIN BUDGET" ^0
"" ^0
"  refusing at the door rather than killing mid-flight is" ^0
"  the part almost nobody does, and it is why the " + str(months_never_over_budget) ^0
"  months cost nobody a lost run" ^0
"" ^0

# ---- why the ratio has a ceiling ----

"what could put spend above budget" ^0
"  a job admitted that takes the team past it : refused" ^0
"  a job that grows past its estimate : the estimate is" ^0
"    calibrated, and overruns are charged to the next" ^0
"    month" ^0
"  so the only path to an overspend : admitting one" ^0
"  admissions of that kind : none, by construction" ^0
"  budget used : " + str(budget_used_per_myriad) + " per ten thousand, and it could not" ^0
"    have been more" ^0
"" ^0
"  a number that is prevented from rising is not evidence" ^0
"  that it would have" ^0
"" ^0

# ---- what a refusal looks like from the other side ----

"a job that was turned away" ^0
"  did it run : no" ^0
"  did it appear in the spend : no" ^0
"  did it appear in the overspend count : no; there was" ^0
"    no overspend" ^0
"  was it resubmitted smaller : " + str(refused_jobs_resubmitted_smaller) + " were" ^0
"  and the rest : " + str(refused_jobs_never_seen_again) + " were not" ^0
"  hours behind them : " + str(core_hours_inside_the_refused_jobs) + ", or " + str(refused_hours_against_budget_myriad) + " per ten" ^0
"    thousand of a monthly budget" ^0
"" ^0

# ---- null control ----

# The same cluster, with refused hours reported next to spent hours every month.
471200 => nc_core_hours_spent_last_month
96300 => nc_core_hours_reported_as_refused
36 => nc_months_never_over_budget

"null control - report the refused hours beside the spent" ^0
"  months never over budget : " + str(nc_months_never_over_budget) + ", unchanged" ^0
"  core hours spent : " + str(nc_core_hours_spent_last_month) + ", unchanged" ^0
"  core hours reported as refused : " + str(nc_core_hours_reported_as_refused) ^0
"  the control did not change and neither did the spend;" ^0
"  the quantity that was free to vary was written down" ^0
"" ^0

# ---- the rule ----

"what three years under budget guarantees" ^0
"  spend did not exceed the budget : exactly, and it" ^0
"    could not have, " + str(months_never_over_budget) + " months running" ^0
"  the budget was enough : not addressed; the demand that" ^0
"    would have shown otherwise was refused before it" ^0
"    could be spent" ^0
"" ^0
"a limit that is enforced by refusing the excess reports" ^0
"only its own enforcement; what it cost is in the refusals," ^0
"and nothing here puts the two on one page" ^0
"" ^0

"Admission refuses a job at submission rather than killing it mid-flight, the" ^0
"estimate is recalibrated monthly, and " + str(months_never_over_budget) + " months have passed without an" ^0
"overspend. Spend read " + str(budget_used_per_myriad) + " per ten thousand of budget and could not have read" ^0
"more, while " + str(jobs_refused_at_admission) + " jobs a month carrying " + str(core_hours_inside_the_refused_jobs) + " core hours were turned away -" ^0
"" + str(refused_hours_against_budget_myriad) + " per ten thousand of a budget - across " + str(reports_that_carry_the_refused_hours) + " reports." ^0
```

## Python (deterministic transpilation)

```python
monthly_budget_core_hours = 480000
core_hours_spent_last_month = 471200
months_never_over_budget = 36
jobs_submitted_a_month = 15400
jobs_refused_at_admission = 1870
core_hours_inside_the_refused_jobs = 96300
refused_jobs_resubmitted_smaller = 1290
teams_on_the_cluster = 74
teams_that_reached_the_gate = 41
reports_that_carry_the_refused_hours = 0
core_hours_of_headroom = monthly_budget_core_hours - core_hours_spent_last_month
refused_jobs_never_seen_again = jobs_refused_at_admission - refused_jobs_resubmitted_smaller
teams_that_never_reached_it = teams_on_the_cluster - teams_that_reached_the_gate
budget_used_per_myriad = int(core_hours_spent_last_month * 10000 / monthly_budget_core_hours)
jobs_refused_per_myriad = int(jobs_refused_at_admission * 10000 / jobs_submitted_a_month)
refused_hours_against_budget_myriad = int(core_hours_inside_the_refused_jobs * 10000 / monthly_budget_core_hours)
print("monthly budget, core hours      : " + str(monthly_budget_core_hours))
print("  spent last month              : " + str(core_hours_spent_last_month))
print("  headroom                      : " + str(core_hours_of_headroom))
print("  budget used                   : " + str(budget_used_per_myriad) + " per ten thousand")
print("months never over budget        : " + str(months_never_over_budget))
print("")
print("jobs submitted a month          : " + str(jobs_submitted_a_month))
print("  refused at admission          : " + str(jobs_refused_at_admission))
print("  refused share                 : " + str(jobs_refused_per_myriad) + " per ten thousand")
print("  resubmitted smaller           : " + str(refused_jobs_resubmitted_smaller))
print("  never seen again              : " + str(refused_jobs_never_seen_again))
print("")
print("core hours inside refused jobs  : " + str(core_hours_inside_the_refused_jobs))
print("  against the budget            : " + str(refused_hours_against_budget_myriad) + " per ten thousand")
print("teams on the cluster            : " + str(teams_on_the_cluster))
print("  that reached the gate         : " + str(teams_that_reached_the_gate))
print("  that never reached it         : " + str(teams_that_never_reached_it))
print("reports carrying refused hours  : " + str(reports_that_carry_the_refused_hours))
print("")
print("the admission control")
print("  when it acts : at submission, against the team's")
print("    remaining budget")
print("  what it does not do : kill a run halfway or reclaim")
print("    hours after the fact")
print("  the estimate : calibrated against measured cost every")
print("    month, so a refusal is not guesswork")
print("  months without an overspend : " + str(months_never_over_budget))
print("  verdict : WITHIN BUDGET")
print("")
print("  refusing at the door rather than killing mid-flight is")
print("  the part almost nobody does, and it is why the " + str(months_never_over_budget))
print("  months cost nobody a lost run")
print("")
print("what could put spend above budget")
print("  a job admitted that takes the team past it : refused")
print("  a job that grows past its estimate : the estimate is")
print("    calibrated, and overruns are charged to the next")
print("    month")
print("  so the only path to an overspend : admitting one")
print("  admissions of that kind : none, by construction")
print("  budget used : " + str(budget_used_per_myriad) + " per ten thousand, and it could not")
print("    have been more")
print("")
print("  a number that is prevented from rising is not evidence")
print("  that it would have")
print("")
print("a job that was turned away")
print("  did it run : no")
print("  did it appear in the spend : no")
print("  did it appear in the overspend count : no; there was")
print("    no overspend")
print("  was it resubmitted smaller : " + str(refused_jobs_resubmitted_smaller) + " were")
print("  and the rest : " + str(refused_jobs_never_seen_again) + " were not")
print("  hours behind them : " + str(core_hours_inside_the_refused_jobs) + ", or " + str(refused_hours_against_budget_myriad) + " per ten")
print("    thousand of a monthly budget")
print("")
nc_core_hours_spent_last_month = 471200
nc_core_hours_reported_as_refused = 96300
nc_months_never_over_budget = 36
print("null control - report the refused hours beside the spent")
print("  months never over budget : " + str(nc_months_never_over_budget) + ", unchanged")
print("  core hours spent : " + str(nc_core_hours_spent_last_month) + ", unchanged")
print("  core hours reported as refused : " + str(nc_core_hours_reported_as_refused))
print("  the control did not change and neither did the spend;")
print("  the quantity that was free to vary was written down")
print("")
print("what three years under budget guarantees")
print("  spend did not exceed the budget : exactly, and it")
print("    could not have, " + str(months_never_over_budget) + " months running")
print("  the budget was enough : not addressed; the demand that")
print("    would have shown otherwise was refused before it")
print("    could be spent")
print("")
print("a limit that is enforced by refusing the excess reports")
print("only its own enforcement; what it cost is in the refusals,")
print("and nothing here puts the two on one page")
print("")
print("Admission refuses a job at submission rather than killing it mid-flight, the")
print("estimate is recalibrated monthly, and " + str(months_never_over_budget) + " months have passed without an")
print("overspend. Spend read " + str(budget_used_per_myriad) + " per ten thousand of budget and could not have read")
print("more, while " + str(jobs_refused_at_admission) + " jobs a month carrying " + str(core_hours_inside_the_refused_jobs) + " core hours were turned away -")
print("" + str(refused_hours_against_budget_myriad) + " per ten thousand of a budget - across " + str(reports_that_carry_the_refused_hours) + " reports.")
```

## stdout (executed)

```text
monthly budget, core hours      : 480000
  spent last month              : 471200
  headroom                      : 8800
  budget used                   : 9816 per ten thousand
months never over budget        : 36

jobs submitted a month          : 15400
  refused at admission          : 1870
  refused share                 : 1214 per ten thousand
  resubmitted smaller           : 1290
  never seen again              : 580

core hours inside refused jobs  : 96300
  against the budget            : 2006 per ten thousand
teams on the cluster            : 74
  that reached the gate         : 41
  that never reached it         : 33
reports carrying refused hours  : 0

the admission control
  when it acts : at submission, against the team's
    remaining budget
  what it does not do : kill a run halfway or reclaim
    hours after the fact
  the estimate : calibrated against measured cost every
    month, so a refusal is not guesswork
  months without an overspend : 36
  verdict : WITHIN BUDGET

  refusing at the door rather than killing mid-flight is
  the part almost nobody does, and it is why the 36
  months cost nobody a lost run

what could put spend above budget
  a job admitted that takes the team past it : refused
  a job that grows past its estimate : the estimate is
    calibrated, and overruns are charged to the next
    month
  so the only path to an overspend : admitting one
  admissions of that kind : none, by construction
  budget used : 9816 per ten thousand, and it could not
    have been more

  a number that is prevented from rising is not evidence
  that it would have

a job that was turned away
  did it run : no
  did it appear in the spend : no
  did it appear in the overspend count : no; there was
    no overspend
  was it resubmitted smaller : 1290 were
  and the rest : 580 were not
  hours behind them : 96300, or 2006 per ten
    thousand of a monthly budget

null control - report the refused hours beside the spent
  months never over budget : 36, unchanged
  core hours spent : 471200, unchanged
  core hours reported as refused : 96300
  the control did not change and neither did the spend;
  the quantity that was free to vary was written down

what three years under budget guarantees
  spend did not exceed the budget : exactly, and it
    could not have, 36 months running
  the budget was enough : not addressed; the demand that
    would have shown otherwise was refused before it
    could be spent

a limit that is enforced by refusing the excess reports
only its own enforcement; what it cost is in the refusals,
and nothing here puts the two on one page

Admission refuses a job at submission rather than killing it mid-flight, the
estimate is recalibrated monthly, and 36 months have passed without an
overspend. Spend read 9816 per ten thousand of budget and could not have read
more, while 1870 jobs a month carrying 96300 core hours were turned away -
2006 per ten thousand of a budget - across 0 reports.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
