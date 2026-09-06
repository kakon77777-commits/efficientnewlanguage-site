<!-- canonical: efficientnewlanguage.org/ai/examples/725-the-plan-was-empty-and-the-state-file-was-the-comparison | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 725 — The plan was empty and the state file was the comparison

`the_plan_was_empty_and_the_state_file_was_the_comparison.eml` - Infrastructure is declarative, every change is reviewed as a plan, and a nightly job alerts on any plan that is not empty. What the plan compares is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Infrastructure is
# declarative, every change is reviewed as a plan, and a nightly job alerts on
# any plan that is not empty. What the plan compares is computed below.
#
# The practice is better than most. Nothing is changed by clicking; every
# change is a reviewed diff with the plan posted on the pull request; apply is
# gated on the plan that was reviewed rather than a fresh one; and a nightly
# job runs plan against production and alerts if it is not empty, which catches
# a resource someone edited by hand. Three hundred sixty-five nightly runs,
# three hundred sixty-five empty.
#
# A plan compares the configuration to the recorded state, refreshing the
# resources that state knows about. A resource created outside the tool is in
# neither, so it is not a difference; it is not in the comparison at all.
#
# The account holds three hundred seventy resources the state file has never
# heard of.

1240 => resources_in_the_state_file
1610 => resources_in_the_account
365 => nightly_plans_run
365 => nightly_plans_that_were_empty
214 => unmanaged_resources_created_in_the_console
96 => of_those_created_during_an_incident
0 => jobs_that_enumerate_the_account
0 => alerts_on_a_resource_absent_from_state

resources_in_the_account - resources_in_the_state_file => resources_the_plan_cannot_see
int(resources_the_plan_cannot_see * 10000 / resources_in_the_account) => invisible_per_myriad
unmanaged_resources_created_in_the_console - of_those_created_during_an_incident => console_resources_created_outside_an_incident

"resources in the state file     : " + str(resources_in_the_state_file) ^0
"resources in the account        : " + str(resources_in_the_account) ^0
"  the plan cannot see           : " + str(resources_the_plan_cannot_see) ^0
"  share                         : " + str(invisible_per_myriad) + " per ten thousand" ^0
"" ^0
"nightly plans run               : " + str(nightly_plans_run) ^0
"  that were empty               : " + str(nightly_plans_that_were_empty) ^0
"jobs that enumerate the account : " + str(jobs_that_enumerate_the_account) ^0
"alerts on a resource absent from state : " + str(alerts_on_a_resource_absent_from_state) ^0
"" ^0
"unmanaged resources made in the console : " + str(unmanaged_resources_created_in_the_console) ^0
"  during an incident            : " + str(of_those_created_during_an_incident) ^0
"  outside one                   : " + str(console_resources_created_outside_an_incident) ^0
"" ^0

# ---- what the practice verified ----

"the change process" ^0
"  changes made by clicking : none, by policy" ^0
"  every change reviewed as : a plan on the pull request" ^0
"  apply gated on : the reviewed plan, not a fresh one" ^0
"  drift check : nightly, alerting on a non-empty plan" ^0
"  nightly runs : " + str(nightly_plans_run) + ", empty " + str(nightly_plans_that_were_empty) ^0
"  verdict : DECLARED" ^0
"" ^0
"  gating apply on the plan that was actually reviewed is" ^0
"  the step most teams skip, and the nightly drift check is" ^0
"  a real control that does catch hand edits" ^0
"" ^0

# ---- what the plan compares ----

"the two operands" ^0
"  one : the configuration in the repository" ^0
"  the other : the recorded state, refreshed from the" ^0
"    provider for what it lists" ^0
"  a hand edit to a listed resource : caught, correctly" ^0
"  a resource that was never listed : in neither operand" ^0
"  what an empty plan therefore says : the resources I" ^0
"    manage match the configuration" ^0
"  what a reader hears : the account matches the" ^0
"    configuration" ^0
"" ^0
"  state is the tool's record of what it did, so it is the" ^0
"  set of things the tool can be wrong about" ^0
"" ^0
# ---- how a resource gets outside ----

# Ninety-six of them were created during an incident, by people doing exactly
# the right thing: the account was on fire and the pipeline takes eleven
# minutes. The rest are older than the policy.
"where the " + str(unmanaged_resources_created_in_the_console) + " came from" ^0
"  during an incident : " + str(of_those_created_during_an_incident) ^0
"  was that the right call at the time : yes; the" ^0
"    pipeline is slower than the outage" ^0
"  outside an incident : " + str(console_resources_created_outside_an_incident) ^0
"  mostly : older than the policy that forbids it" ^0
"  what would bring them back in : an import, which" ^0
"    somebody has to know to do" ^0
"  what tells them to : " + str(alerts_on_a_resource_absent_from_state) + " alerts" ^0
"" ^0

# ---- the empty plan after an incident ----

# The morning after, the nightly plan is empty. That is not a stale result or a
# broken job; it is the correct answer to the question the job asks.
"the morning after" ^0
"  resources created by hand overnight : some" ^0
"  nightly plan : empty" ^0
"  is the job broken : no" ^0
"  is the plan wrong : no" ^0
"  what the empty plan reports : the managed set is" ^0
"    unchanged, which is true" ^0
"  what the team concludes : nothing drifted" ^0
"" ^0

# ---- what would be visible and what would not ----

"two kinds of divergence" ^0
"  a managed resource edited by hand : the plan shows it," ^0
"    every night, and this has worked" ^0
"  a resource that exists and is not managed : no" ^0
"    operand contains it" ^0
"  the second kind, counted once by hand : " + str(resources_the_plan_cannot_see) ^0
"  jobs that would count it continuously : " + str(jobs_that_enumerate_the_account) ^0
"" ^0

# ---- null control ----

# A second nightly job that enumerates the account from the provider's own API
# and diffs it against the state file rather than against the configuration.
resources_in_the_account => nc_resources_the_check_can_see
0 => nc_resources_outside_the_comparison

"null control - enumerate the account, diff against state" ^0
"  nightly plans empty : " + str(nightly_plans_that_were_empty) + ", unchanged and still correct" ^0
"  resources the check can see : " + str(nc_resources_the_check_can_see) ^0
"  resources outside the comparison : " + str(nc_resources_outside_the_comparison) ^0
"  the plan did not get better; a second check started" ^0
"  taking its population from the account instead of from" ^0
"  the tool's own record" ^0
"" ^0

# ---- the rule ----

"what an empty plan guarantees" ^0
"  the managed resources match the configuration : exactly," ^0
"    refreshed from the provider, every night" ^0
"  the account matches the configuration : not addressed;" ^0
"    the comparison ranges over what the tool recorded" ^0
"    doing, and it did not do these" ^0
"" ^0
"a declarative tool reconciles a desired state with its own" ^0
"record of reality; the record is written by the tool, so" ^0
"anything that happened without it is not a difference but an" ^0
"absence, and an absence is what an empty diff looks like" ^0
"" ^0

"The practice is strong: nothing changed by clicking, every change reviewed as a" ^0
"plan, apply gated on the reviewed plan, and " + str(nightly_plans_run) + " nightly drift checks that do" ^0
"catch hand edits to managed resources. The plan compares the configuration to" ^0
"a state file listing " + str(resources_in_the_state_file) + " of the account's " + str(resources_in_the_account) + " resources, so " + str(resources_the_plan_cannot_see) ^0
"of them - " + str(invisible_per_myriad) + " per ten thousand - sit outside both operands, watched by" ^0
str(jobs_that_enumerate_the_account) + " jobs and " + str(alerts_on_a_resource_absent_from_state) + " alerts." ^0
```

## Python (deterministic transpilation)

```python
resources_in_the_state_file = 1240
resources_in_the_account = 1610
nightly_plans_run = 365
nightly_plans_that_were_empty = 365
unmanaged_resources_created_in_the_console = 214
of_those_created_during_an_incident = 96
jobs_that_enumerate_the_account = 0
alerts_on_a_resource_absent_from_state = 0
resources_the_plan_cannot_see = resources_in_the_account - resources_in_the_state_file
invisible_per_myriad = int(resources_the_plan_cannot_see * 10000 / resources_in_the_account)
console_resources_created_outside_an_incident = unmanaged_resources_created_in_the_console - of_those_created_during_an_incident
print("resources in the state file     : " + str(resources_in_the_state_file))
print("resources in the account        : " + str(resources_in_the_account))
print("  the plan cannot see           : " + str(resources_the_plan_cannot_see))
print("  share                         : " + str(invisible_per_myriad) + " per ten thousand")
print("")
print("nightly plans run               : " + str(nightly_plans_run))
print("  that were empty               : " + str(nightly_plans_that_were_empty))
print("jobs that enumerate the account : " + str(jobs_that_enumerate_the_account))
print("alerts on a resource absent from state : " + str(alerts_on_a_resource_absent_from_state))
print("")
print("unmanaged resources made in the console : " + str(unmanaged_resources_created_in_the_console))
print("  during an incident            : " + str(of_those_created_during_an_incident))
print("  outside one                   : " + str(console_resources_created_outside_an_incident))
print("")
print("the change process")
print("  changes made by clicking : none, by policy")
print("  every change reviewed as : a plan on the pull request")
print("  apply gated on : the reviewed plan, not a fresh one")
print("  drift check : nightly, alerting on a non-empty plan")
print("  nightly runs : " + str(nightly_plans_run) + ", empty " + str(nightly_plans_that_were_empty))
print("  verdict : DECLARED")
print("")
print("  gating apply on the plan that was actually reviewed is")
print("  the step most teams skip, and the nightly drift check is")
print("  a real control that does catch hand edits")
print("")
print("the two operands")
print("  one : the configuration in the repository")
print("  the other : the recorded state, refreshed from the")
print("    provider for what it lists")
print("  a hand edit to a listed resource : caught, correctly")
print("  a resource that was never listed : in neither operand")
print("  what an empty plan therefore says : the resources I")
print("    manage match the configuration")
print("  what a reader hears : the account matches the")
print("    configuration")
print("")
print("  state is the tool's record of what it did, so it is the")
print("  set of things the tool can be wrong about")
print("")
print("where the " + str(unmanaged_resources_created_in_the_console) + " came from")
print("  during an incident : " + str(of_those_created_during_an_incident))
print("  was that the right call at the time : yes; the")
print("    pipeline is slower than the outage")
print("  outside an incident : " + str(console_resources_created_outside_an_incident))
print("  mostly : older than the policy that forbids it")
print("  what would bring them back in : an import, which")
print("    somebody has to know to do")
print("  what tells them to : " + str(alerts_on_a_resource_absent_from_state) + " alerts")
print("")
print("the morning after")
print("  resources created by hand overnight : some")
print("  nightly plan : empty")
print("  is the job broken : no")
print("  is the plan wrong : no")
print("  what the empty plan reports : the managed set is")
print("    unchanged, which is true")
print("  what the team concludes : nothing drifted")
print("")
print("two kinds of divergence")
print("  a managed resource edited by hand : the plan shows it,")
print("    every night, and this has worked")
print("  a resource that exists and is not managed : no")
print("    operand contains it")
print("  the second kind, counted once by hand : " + str(resources_the_plan_cannot_see))
print("  jobs that would count it continuously : " + str(jobs_that_enumerate_the_account))
print("")
nc_resources_the_check_can_see = resources_in_the_account
nc_resources_outside_the_comparison = 0
print("null control - enumerate the account, diff against state")
print("  nightly plans empty : " + str(nightly_plans_that_were_empty) + ", unchanged and still correct")
print("  resources the check can see : " + str(nc_resources_the_check_can_see))
print("  resources outside the comparison : " + str(nc_resources_outside_the_comparison))
print("  the plan did not get better; a second check started")
print("  taking its population from the account instead of from")
print("  the tool's own record")
print("")
print("what an empty plan guarantees")
print("  the managed resources match the configuration : exactly,")
print("    refreshed from the provider, every night")
print("  the account matches the configuration : not addressed;")
print("    the comparison ranges over what the tool recorded")
print("    doing, and it did not do these")
print("")
print("a declarative tool reconciles a desired state with its own")
print("record of reality; the record is written by the tool, so")
print("anything that happened without it is not a difference but an")
print("absence, and an absence is what an empty diff looks like")
print("")
print("The practice is strong: nothing changed by clicking, every change reviewed as a")
print("plan, apply gated on the reviewed plan, and " + str(nightly_plans_run) + " nightly drift checks that do")
print("catch hand edits to managed resources. The plan compares the configuration to")
print("a state file listing " + str(resources_in_the_state_file) + " of the account's " + str(resources_in_the_account) + " resources, so " + str(resources_the_plan_cannot_see))
print("of them - " + str(invisible_per_myriad) + " per ten thousand - sit outside both operands, watched by")
print(str(jobs_that_enumerate_the_account) + " jobs and " + str(alerts_on_a_resource_absent_from_state) + " alerts.")
```

## stdout (executed)

```text
resources in the state file     : 1240
resources in the account        : 1610
  the plan cannot see           : 370
  share                         : 2298 per ten thousand

nightly plans run               : 365
  that were empty               : 365
jobs that enumerate the account : 0
alerts on a resource absent from state : 0

unmanaged resources made in the console : 214
  during an incident            : 96
  outside one                   : 118

the change process
  changes made by clicking : none, by policy
  every change reviewed as : a plan on the pull request
  apply gated on : the reviewed plan, not a fresh one
  drift check : nightly, alerting on a non-empty plan
  nightly runs : 365, empty 365
  verdict : DECLARED

  gating apply on the plan that was actually reviewed is
  the step most teams skip, and the nightly drift check is
  a real control that does catch hand edits

the two operands
  one : the configuration in the repository
  the other : the recorded state, refreshed from the
    provider for what it lists
  a hand edit to a listed resource : caught, correctly
  a resource that was never listed : in neither operand
  what an empty plan therefore says : the resources I
    manage match the configuration
  what a reader hears : the account matches the
    configuration

  state is the tool's record of what it did, so it is the
  set of things the tool can be wrong about

where the 214 came from
  during an incident : 96
  was that the right call at the time : yes; the
    pipeline is slower than the outage
  outside an incident : 118
  mostly : older than the policy that forbids it
  what would bring them back in : an import, which
    somebody has to know to do
  what tells them to : 0 alerts

the morning after
  resources created by hand overnight : some
  nightly plan : empty
  is the job broken : no
  is the plan wrong : no
  what the empty plan reports : the managed set is
    unchanged, which is true
  what the team concludes : nothing drifted

two kinds of divergence
  a managed resource edited by hand : the plan shows it,
    every night, and this has worked
  a resource that exists and is not managed : no
    operand contains it
  the second kind, counted once by hand : 370
  jobs that would count it continuously : 0

null control - enumerate the account, diff against state
  nightly plans empty : 365, unchanged and still correct
  resources the check can see : 1610
  resources outside the comparison : 0
  the plan did not get better; a second check started
  taking its population from the account instead of from
  the tool's own record

what an empty plan guarantees
  the managed resources match the configuration : exactly,
    refreshed from the provider, every night
  the account matches the configuration : not addressed;
    the comparison ranges over what the tool recorded
    doing, and it did not do these

a declarative tool reconciles a desired state with its own
record of reality; the record is written by the tool, so
anything that happened without it is not a difference but an
absence, and an absence is what an empty diff looks like

The practice is strong: nothing changed by clicking, every change reviewed as a
plan, apply gated on the reviewed plan, and 365 nightly drift checks that do
catch hand edits to managed resources. The plan compares the configuration to
a state file listing 1240 of the account's 1610 resources, so 370
of them - 2298 per ten thousand - sit outside both operands, watched by
0 jobs and 0 alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
