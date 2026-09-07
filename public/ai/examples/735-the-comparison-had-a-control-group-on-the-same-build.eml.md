<!-- canonical: efficientnewlanguage.org/ai/examples/735-the-comparison-had-a-control-group-on-the-same-build | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 735 — The comparison had a control group on the same build

`the_comparison_had_a_control_group_on_the_same_build.eml` - Every deploy runs a canary analysis against a control group across forty-one metrics and it has rolled back seven real regressions. What the two groups differ in is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every deploy runs
# a canary analysis against a control group across forty-one metrics and it has
# rolled back seven real regressions. What the two groups differ in is computed
# below.
#
# The canary analysis is the good kind. It is automated rather than a person
# squinting at a graph; it compares against a concurrent control group rather
# than against yesterday, so a traffic shift affects both; it covers forty-one
# metrics rather than error rate alone; it fails closed, rolling back on a
# regression rather than asking; and seven rollbacks this year were each a real
# regression that would have reached everybody.
#
# The two groups differ in the deploy ARTIFACT. A change delivered by the
# configuration service reaches both groups at once, so for that class the
# canary and its control are the same software.
#
# Three thousand one hundred changes a year arrive that way.

7 => rollbacks_the_canary_caught
41 => metrics_compared
20 => canary_minutes
2 => groups_the_analysis_compares
1240 => changes_delivered_as_a_deploy_artifact_per_year
3100 => changes_delivered_by_the_config_service_per_year
0 => config_changes_the_canary_can_separate
1 => builds_running_during_a_config_change
# A count of GROUPS, which cannot be obtained by subtracting a count of
# builds. One build across both arms means neither arm distinguishes the
# other, so the number of groups that differ is zero, not one.
0 => groups_that_differ_during_a_config_change

changes_delivered_as_a_deploy_artifact_per_year + changes_delivered_by_the_config_service_per_year => changes_per_year
int(changes_delivered_by_the_config_service_per_year * 10000 / changes_per_year) => outside_the_comparison_per_myriad

"rollbacks the canary caught     : " + str(rollbacks_the_canary_caught) ^0
"metrics compared                : " + str(metrics_compared) ^0
"canary duration, minutes        : " + str(canary_minutes) ^0
"groups compared                 : " + str(groups_the_analysis_compares) ^0
"" ^0
"changes per year                : " + str(changes_per_year) ^0
"  delivered as a deploy artifact: " + str(changes_delivered_as_a_deploy_artifact_per_year) ^0
"  delivered by the config service: " + str(changes_delivered_by_the_config_service_per_year) ^0
"  share outside the comparison  : " + str(outside_the_comparison_per_myriad) + " per ten thousand" ^0
"" ^0
"builds running during a config change : " + str(builds_running_during_a_config_change) ^0
"  groups that differ then       : " + str(groups_that_differ_during_a_config_change) ^0
"config changes the canary can separate : " + str(config_changes_the_canary_can_separate) ^0
"" ^0

# ---- what the analysis verified ----

"the canary analysis" ^0
"  automated or a person squinting : automated" ^0
"  compared against : a concurrent control group, not" ^0
"    yesterday, so a traffic shift moves both" ^0
"  metrics : " + str(metrics_compared) + ", not error rate alone" ^0
"  on a regression : rolls back, without asking" ^0
"  rollbacks this year : " + str(rollbacks_the_canary_caught) + ", each a real regression" ^0
"  verdict : DISCRIMINATES" ^0
"" ^0
"  a concurrent control rather than a historical baseline" ^0
"  is the choice that makes this robust, and it was made" ^0
"" ^0

# ---- what the two groups differ in ----

"the treatment" ^0
"  what the deploy tool varies : the artifact one group" ^0
"    runs" ^0
"  what a config change varies : a value both groups read" ^0
"  when a config value changes, builds running : " ^0
"    " + str(builds_running_during_a_config_change) ^0
"  groups that differ then : " + str(groups_that_differ_during_a_config_change) ^0
"  what the analysis then measures : two samples of one" ^0
"    population" ^0
"" ^0
"  the comparison is sound and its treatment is defined by" ^0
"  the tool that delivers it" ^0
"" ^0
# ---- what a green canary means for a config change ----

# The analysis still runs, still compares forty-one metrics, and still passes.
# It passes because the two groups are drawn from one population, so any
# regression the change caused is present in both and cancels out of every
# difference the analysis computes.
"a config change during a canary" ^0
"  analysis runs : yes" ^0
"  metrics compared : " + str(metrics_compared) ^0
"  a regression caused by the change : present in both" ^0
"    groups" ^0
"  difference between the groups : none, because the" ^0
"    regression is common to them" ^0
"  verdict returned : pass" ^0
"  is the verdict wrong : no; the groups genuinely do not" ^0
"    differ" ^0
"" ^0

# ---- why config is the larger stream ----

# Config changes outnumber deploys because that is what config is for: a value
# that can be changed without a build is changed more often than a build. The
# safer-feeling delivery path carries most of the change.
"the two streams" ^0
"  deploy artifacts a year : " + str(changes_delivered_as_a_deploy_artifact_per_year) ^0
"  config changes a year   : " + str(changes_delivered_by_the_config_service_per_year) ^0
"  why config is larger : it is the path that does not" ^0
"    require a build, which is what it is for" ^0
"  which path feels riskier to a person : the deploy" ^0
"  which path the canary covers : the deploy" ^0
"  share of changes outside it : " + str(outside_the_comparison_per_myriad) + " per ten" ^0
"    thousand" ^0
"" ^0

# ---- the seven were real ----

"the rollbacks" ^0
"  count : " + str(rollbacks_the_canary_caught) ^0
"  each a real regression : yes" ^0
"  each would have reached everybody : yes" ^0
"  what they establish : the analysis can discriminate" ^0
"  what they do not establish : that it was ever asked" ^0
"    about the " + str(changes_delivered_by_the_config_service_per_year) ^0
"" ^0

# ---- null control ----

# The same analysis, with the config service delivering a value to the canary
# group first and the control holding the old value for the canary window.
changes_per_year => nc_changes_the_canary_can_separate
groups_the_analysis_compares => nc_groups_that_differ_during_a_config_change

"null control - config is delivered to one group first" ^0
"  metrics compared : " + str(metrics_compared) + ", unchanged" ^0
"  groups that differ during a config change : " + str(nc_groups_that_differ_during_a_config_change) ^0
"  changes the canary can separate : " + str(nc_changes_the_canary_can_separate) ^0
"  the analysis did not improve; the treatment started" ^0
"  being applied to one group instead of to the world" ^0
"" ^0

# ---- the rule ----

"what a passing canary analysis guarantees" ^0
"  the canary group does not differ from the control :" ^0
"    exactly, over " + str(metrics_compared) + " metrics, concurrently, failing closed" ^0
"  the change is safe : not addressed; a comparison can" ^0
"    only see what distinguishes its two arms, and this" ^0
"    one is defined by the deploy tool" ^0
"" ^0
"an experiment measures a treatment, so its power is bounded" ^0
"by what actually differs between the arms; a change that" ^0
"reaches both arms is not weakly detected but perfectly" ^0
"invisible, and it passes rather than failing to run" ^0
"" ^0

"The analysis is automated, concurrent rather than historical, covers " + str(metrics_compared) ^0
"metrics, fails closed, and rolled back " + str(rollbacks_the_canary_caught) + " real regressions this year. Its two" ^0
"groups differ in the deploy artifact, so of " + str(changes_per_year) + " changes a year the " + str(changes_delivered_by_the_config_service_per_year) ^0
"delivered by the config service - " + str(outside_the_comparison_per_myriad) + " per ten thousand - reach " + str(builds_running_during_a_config_change) + " build across" ^0
"both arms, leaving " + str(groups_that_differ_during_a_config_change) + " differences for the comparison to find." ^0
```

## Python (deterministic transpilation)

```python
rollbacks_the_canary_caught = 7
metrics_compared = 41
canary_minutes = 20
groups_the_analysis_compares = 2
changes_delivered_as_a_deploy_artifact_per_year = 1240
changes_delivered_by_the_config_service_per_year = 3100
config_changes_the_canary_can_separate = 0
builds_running_during_a_config_change = 1
groups_that_differ_during_a_config_change = 0
changes_per_year = changes_delivered_as_a_deploy_artifact_per_year + changes_delivered_by_the_config_service_per_year
outside_the_comparison_per_myriad = int(changes_delivered_by_the_config_service_per_year * 10000 / changes_per_year)
print("rollbacks the canary caught     : " + str(rollbacks_the_canary_caught))
print("metrics compared                : " + str(metrics_compared))
print("canary duration, minutes        : " + str(canary_minutes))
print("groups compared                 : " + str(groups_the_analysis_compares))
print("")
print("changes per year                : " + str(changes_per_year))
print("  delivered as a deploy artifact: " + str(changes_delivered_as_a_deploy_artifact_per_year))
print("  delivered by the config service: " + str(changes_delivered_by_the_config_service_per_year))
print("  share outside the comparison  : " + str(outside_the_comparison_per_myriad) + " per ten thousand")
print("")
print("builds running during a config change : " + str(builds_running_during_a_config_change))
print("  groups that differ then       : " + str(groups_that_differ_during_a_config_change))
print("config changes the canary can separate : " + str(config_changes_the_canary_can_separate))
print("")
print("the canary analysis")
print("  automated or a person squinting : automated")
print("  compared against : a concurrent control group, not")
print("    yesterday, so a traffic shift moves both")
print("  metrics : " + str(metrics_compared) + ", not error rate alone")
print("  on a regression : rolls back, without asking")
print("  rollbacks this year : " + str(rollbacks_the_canary_caught) + ", each a real regression")
print("  verdict : DISCRIMINATES")
print("")
print("  a concurrent control rather than a historical baseline")
print("  is the choice that makes this robust, and it was made")
print("")
print("the treatment")
print("  what the deploy tool varies : the artifact one group")
print("    runs")
print("  what a config change varies : a value both groups read")
print("  when a config value changes, builds running : ")
print("    " + str(builds_running_during_a_config_change))
print("  groups that differ then : " + str(groups_that_differ_during_a_config_change))
print("  what the analysis then measures : two samples of one")
print("    population")
print("")
print("  the comparison is sound and its treatment is defined by")
print("  the tool that delivers it")
print("")
print("a config change during a canary")
print("  analysis runs : yes")
print("  metrics compared : " + str(metrics_compared))
print("  a regression caused by the change : present in both")
print("    groups")
print("  difference between the groups : none, because the")
print("    regression is common to them")
print("  verdict returned : pass")
print("  is the verdict wrong : no; the groups genuinely do not")
print("    differ")
print("")
print("the two streams")
print("  deploy artifacts a year : " + str(changes_delivered_as_a_deploy_artifact_per_year))
print("  config changes a year   : " + str(changes_delivered_by_the_config_service_per_year))
print("  why config is larger : it is the path that does not")
print("    require a build, which is what it is for")
print("  which path feels riskier to a person : the deploy")
print("  which path the canary covers : the deploy")
print("  share of changes outside it : " + str(outside_the_comparison_per_myriad) + " per ten")
print("    thousand")
print("")
print("the rollbacks")
print("  count : " + str(rollbacks_the_canary_caught))
print("  each a real regression : yes")
print("  each would have reached everybody : yes")
print("  what they establish : the analysis can discriminate")
print("  what they do not establish : that it was ever asked")
print("    about the " + str(changes_delivered_by_the_config_service_per_year))
print("")
nc_changes_the_canary_can_separate = changes_per_year
nc_groups_that_differ_during_a_config_change = groups_the_analysis_compares
print("null control - config is delivered to one group first")
print("  metrics compared : " + str(metrics_compared) + ", unchanged")
print("  groups that differ during a config change : " + str(nc_groups_that_differ_during_a_config_change))
print("  changes the canary can separate : " + str(nc_changes_the_canary_can_separate))
print("  the analysis did not improve; the treatment started")
print("  being applied to one group instead of to the world")
print("")
print("what a passing canary analysis guarantees")
print("  the canary group does not differ from the control :")
print("    exactly, over " + str(metrics_compared) + " metrics, concurrently, failing closed")
print("  the change is safe : not addressed; a comparison can")
print("    only see what distinguishes its two arms, and this")
print("    one is defined by the deploy tool")
print("")
print("an experiment measures a treatment, so its power is bounded")
print("by what actually differs between the arms; a change that")
print("reaches both arms is not weakly detected but perfectly")
print("invisible, and it passes rather than failing to run")
print("")
print("The analysis is automated, concurrent rather than historical, covers " + str(metrics_compared))
print("metrics, fails closed, and rolled back " + str(rollbacks_the_canary_caught) + " real regressions this year. Its two")
print("groups differ in the deploy artifact, so of " + str(changes_per_year) + " changes a year the " + str(changes_delivered_by_the_config_service_per_year))
print("delivered by the config service - " + str(outside_the_comparison_per_myriad) + " per ten thousand - reach " + str(builds_running_during_a_config_change) + " build across")
print("both arms, leaving " + str(groups_that_differ_during_a_config_change) + " differences for the comparison to find.")
```

## stdout (executed)

```text
rollbacks the canary caught     : 7
metrics compared                : 41
canary duration, minutes        : 20
groups compared                 : 2

changes per year                : 4340
  delivered as a deploy artifact: 1240
  delivered by the config service: 3100
  share outside the comparison  : 7142 per ten thousand

builds running during a config change : 1
  groups that differ then       : 0
config changes the canary can separate : 0

the canary analysis
  automated or a person squinting : automated
  compared against : a concurrent control group, not
    yesterday, so a traffic shift moves both
  metrics : 41, not error rate alone
  on a regression : rolls back, without asking
  rollbacks this year : 7, each a real regression
  verdict : DISCRIMINATES

  a concurrent control rather than a historical baseline
  is the choice that makes this robust, and it was made

the treatment
  what the deploy tool varies : the artifact one group
    runs
  what a config change varies : a value both groups read
  when a config value changes, builds running : 
    1
  groups that differ then : 0
  what the analysis then measures : two samples of one
    population

  the comparison is sound and its treatment is defined by
  the tool that delivers it

a config change during a canary
  analysis runs : yes
  metrics compared : 41
  a regression caused by the change : present in both
    groups
  difference between the groups : none, because the
    regression is common to them
  verdict returned : pass
  is the verdict wrong : no; the groups genuinely do not
    differ

the two streams
  deploy artifacts a year : 1240
  config changes a year   : 3100
  why config is larger : it is the path that does not
    require a build, which is what it is for
  which path feels riskier to a person : the deploy
  which path the canary covers : the deploy
  share of changes outside it : 7142 per ten
    thousand

the rollbacks
  count : 7
  each a real regression : yes
  each would have reached everybody : yes
  what they establish : the analysis can discriminate
  what they do not establish : that it was ever asked
    about the 3100

null control - config is delivered to one group first
  metrics compared : 41, unchanged
  groups that differ during a config change : 2
  changes the canary can separate : 4340
  the analysis did not improve; the treatment started
  being applied to one group instead of to the world

what a passing canary analysis guarantees
  the canary group does not differ from the control :
    exactly, over 41 metrics, concurrently, failing closed
  the change is safe : not addressed; a comparison can
    only see what distinguishes its two arms, and this
    one is defined by the deploy tool

an experiment measures a treatment, so its power is bounded
by what actually differs between the arms; a change that
reaches both arms is not weakly detected but perfectly
invisible, and it passes rather than failing to run

The analysis is automated, concurrent rather than historical, covers 41
metrics, fails closed, and rolled back 7 real regressions this year. Its two
groups differ in the deploy artifact, so of 4340 changes a year the 3100
delivered by the config service - 7142 per ten thousand - reach 1 build across
both arms, leaving 0 differences for the comparison to find.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
