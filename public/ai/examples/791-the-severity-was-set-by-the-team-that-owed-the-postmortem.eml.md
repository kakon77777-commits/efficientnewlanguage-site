<!-- canonical: efficientnewlanguage.org/ai/examples/791-the-severity-was-set-by-the-team-that-owed-the-postmortem | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 791 — The severity was set by the team that owed the postmortem

`the_severity_was_set_by_the_team_that_owed_the_postmortem.eml` - Incident severity is written down, exemplified, and cannot be lowered after the fact without a second approver, and it has worked that way for four years. Who assigns it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Incident severity
# is written down, exemplified, and cannot be lowered after the fact without a
# second approver, and it has worked that way for four years. Who assigns it is
# computed below.
#
# The definitions are good. Each level has worked examples rather than adjectives;
# the level is set at declaration rather than argued about afterwards; lowering
# one later needs a second approver and six such changes were made and recorded;
# and a level-one incident really does get an executive review and a written
# postmortem within five days.
#
# The level is set by the team that owns the service, and the postmortem is owed
# by the team that owns the service.

1180 => incidents_last_year
34 => declared_level_one
210 => declared_level_two
936 => declared_level_three
5 => days_a_level_one_postmortem_is_due_in
20 => hours_a_postmortem_costs
6 => levels_lowered_after_the_fact
0 => levels_raised_after_the_fact
41 => level_twos_whose_customer_impact_exceeded_the_median_level_one
0 => postmortems_written_for_those

incidents_last_year - declared_level_one => incidents_that_owed_no_postmortem
declared_level_two + declared_level_three => incidents_below_level_one
declared_level_one * hours_a_postmortem_costs => postmortem_hours_owed
level_twos_whose_customer_impact_exceeded_the_median_level_one * hours_a_postmortem_costs => postmortem_hours_not_owed
levels_lowered_after_the_fact - levels_raised_after_the_fact => net_reclassifications_downward
int(declared_level_one * 10000 / incidents_last_year) => level_one_share_per_myriad
int(level_twos_whose_customer_impact_exceeded_the_median_level_one * 10000 / declared_level_two) => level_twos_above_the_bar_per_myriad

"incidents last year             : " + str(incidents_last_year) ^0
"  declared level one            : " + str(declared_level_one) ^0
"  declared level two            : " + str(declared_level_two) ^0
"  declared level three          : " + str(declared_level_three) ^0
"  below level one               : " + str(incidents_below_level_one) ^0
"  level-one share               : " + str(level_one_share_per_myriad) + " per ten thousand" ^0
"" ^0
"a level one owes                : a postmortem in " + str(days_a_level_one_postmortem_is_due_in) + " days" ^0
"  hours a postmortem costs      : " + str(hours_a_postmortem_costs) ^0
"  postmortem hours owed         : " + str(postmortem_hours_owed) ^0
"incidents that owed no postmortem : " + str(incidents_that_owed_no_postmortem) ^0
"" ^0
"level twos above the median level one, by customer impact" ^0
"  count                         : " + str(level_twos_whose_customer_impact_exceeded_the_median_level_one) ^0
"  share of level twos           : " + str(level_twos_above_the_bar_per_myriad) + " per ten thousand" ^0
"  postmortems written for them  : " + str(postmortems_written_for_those) ^0
"  hours that would have cost    : " + str(postmortem_hours_not_owed) ^0
"" ^0
"levels lowered after the fact   : " + str(levels_lowered_after_the_fact) ^0
"levels raised after the fact    : " + str(levels_raised_after_the_fact) ^0
"  net, downward                 : " + str(net_reclassifications_downward) ^0
"" ^0

# ---- what the definitions verified ----

"the severity scheme" ^0
"  each level : worked examples, not adjectives" ^0
"  when it is set : at declaration, not argued about" ^0
"    afterwards" ^0
"  lowering one later : needs a second approver, and " ^0
"    " + str(levels_lowered_after_the_fact) + " were changed and recorded" ^0
"  what a level one actually gets : an executive review" ^0
"    and a written postmortem within " + str(days_a_level_one_postmortem_is_due_in) + " days" ^0
"  verdict : DEFINED" ^0
"" ^0
"  requiring a second approver to LOWER a level is the" ^0
"  part almost nobody does, and it is why the " ^0
"  " + str(levels_lowered_after_the_fact) + " are visible" ^0
"" ^0

# ---- who decides, and what it costs them ----

"the declaration" ^0
"  who sets the level : the team that owns the service" ^0
"  who owes the postmortem : the team that owns the" ^0
"    service" ^0
"  who attends the executive review : the team that owns" ^0
"    the service" ^0
"  so the classification and its cost : land on the same" ^0
"    people, at the moment of classifying" ^0
"  hours at stake per level one : " + str(hours_a_postmortem_costs) ^0
"" ^0
"  the second approver guards the change of a level and" ^0
"  not the setting of one; the first number is the one" ^0
"  nobody countersigns" ^0
"" ^0

# ---- the level twos that were not smaller ----

"comparing on impact rather than on label" ^0
"  level twos above the median level one : " ^0
"    " + str(level_twos_whose_customer_impact_exceeded_the_median_level_one) ^0
"  as a share of level twos : " + str(level_twos_above_the_bar_per_myriad) + " per ten thousand" ^0
"  postmortems they produced : " + str(postmortems_written_for_those) ^0
"  executive reviews they produced : " + str(postmortems_written_for_those) ^0
"  hours not spent on them : " + str(postmortem_hours_not_owed) + ", against " ^0
"    " + str(postmortem_hours_owed) + " spent on the declared level ones" ^0
"  were any of them reclassified upward : " ^0
"    " + str(levels_raised_after_the_fact) ^0
"" ^0

# ---- null control ----

# The same definitions, with the level set by the on-call incident commander,
# who is rostered from a different team and owes none of the follow-up.
71 => nc_declared_level_one
1 => nc_levels_lowered_after_the_fact
1180 => nc_incidents_last_year

"null control - let someone who owes nothing set the level" ^0
"  incidents : " + str(nc_incidents_last_year) + ", unchanged" ^0
"  declared level one : " + str(nc_declared_level_one) ^0
"  levels lowered after the fact : " ^0
"    " + str(nc_levels_lowered_after_the_fact) ^0
"  the definitions did not change and neither did the" ^0
"  incidents; the person applying them stopped paying for" ^0
"  the answer" ^0
"" ^0

# ---- the rule ----

"what a well-defined severity scheme guarantees" ^0
"  every incident the owning team called level one got a" ^0
"    postmortem : exactly, " + str(declared_level_one) + " of them, in " + str(days_a_level_one_postmortem_is_due_in) + " days, with" ^0
"    an executive review" ^0
"  every severe incident got one : not addressed; the" ^0
"    level is chosen by the party that owes the work, and" ^0
"    " + str(level_twos_whose_customer_impact_exceeded_the_median_level_one) + " level twos were larger than the median level one" ^0
"" ^0
"definitions do not classify; people do, and a definition" ^0
"applied by whoever pays for the answer measures what they" ^0
"were willing to owe" ^0
"" ^0

"Each level has worked examples, the level is set at declaration, lowering one" ^0
"later needs a second approver and " + str(levels_lowered_after_the_fact) + " were recorded. The team that sets it is the" ^0
"team that owes the postmortem, so " + str(declared_level_one) + " of " + str(incidents_last_year) + " incidents were level one - " ^0
"" + str(level_one_share_per_myriad) + " per ten thousand - while " + str(level_twos_whose_customer_impact_exceeded_the_median_level_one) + " level twos exceeded the median level one on" ^0
"customer impact and produced " + str(postmortems_written_for_those) + " postmortems and " + str(levels_raised_after_the_fact) + " upward reclassifications." ^0
```

## Python (deterministic transpilation)

```python
incidents_last_year = 1180
declared_level_one = 34
declared_level_two = 210
declared_level_three = 936
days_a_level_one_postmortem_is_due_in = 5
hours_a_postmortem_costs = 20
levels_lowered_after_the_fact = 6
levels_raised_after_the_fact = 0
level_twos_whose_customer_impact_exceeded_the_median_level_one = 41
postmortems_written_for_those = 0
incidents_that_owed_no_postmortem = incidents_last_year - declared_level_one
incidents_below_level_one = declared_level_two + declared_level_three
postmortem_hours_owed = declared_level_one * hours_a_postmortem_costs
postmortem_hours_not_owed = level_twos_whose_customer_impact_exceeded_the_median_level_one * hours_a_postmortem_costs
net_reclassifications_downward = levels_lowered_after_the_fact - levels_raised_after_the_fact
level_one_share_per_myriad = int(declared_level_one * 10000 / incidents_last_year)
level_twos_above_the_bar_per_myriad = int(level_twos_whose_customer_impact_exceeded_the_median_level_one * 10000 / declared_level_two)
print("incidents last year             : " + str(incidents_last_year))
print("  declared level one            : " + str(declared_level_one))
print("  declared level two            : " + str(declared_level_two))
print("  declared level three          : " + str(declared_level_three))
print("  below level one               : " + str(incidents_below_level_one))
print("  level-one share               : " + str(level_one_share_per_myriad) + " per ten thousand")
print("")
print("a level one owes                : a postmortem in " + str(days_a_level_one_postmortem_is_due_in) + " days")
print("  hours a postmortem costs      : " + str(hours_a_postmortem_costs))
print("  postmortem hours owed         : " + str(postmortem_hours_owed))
print("incidents that owed no postmortem : " + str(incidents_that_owed_no_postmortem))
print("")
print("level twos above the median level one, by customer impact")
print("  count                         : " + str(level_twos_whose_customer_impact_exceeded_the_median_level_one))
print("  share of level twos           : " + str(level_twos_above_the_bar_per_myriad) + " per ten thousand")
print("  postmortems written for them  : " + str(postmortems_written_for_those))
print("  hours that would have cost    : " + str(postmortem_hours_not_owed))
print("")
print("levels lowered after the fact   : " + str(levels_lowered_after_the_fact))
print("levels raised after the fact    : " + str(levels_raised_after_the_fact))
print("  net, downward                 : " + str(net_reclassifications_downward))
print("")
print("the severity scheme")
print("  each level : worked examples, not adjectives")
print("  when it is set : at declaration, not argued about")
print("    afterwards")
print("  lowering one later : needs a second approver, and ")
print("    " + str(levels_lowered_after_the_fact) + " were changed and recorded")
print("  what a level one actually gets : an executive review")
print("    and a written postmortem within " + str(days_a_level_one_postmortem_is_due_in) + " days")
print("  verdict : DEFINED")
print("")
print("  requiring a second approver to LOWER a level is the")
print("  part almost nobody does, and it is why the ")
print("  " + str(levels_lowered_after_the_fact) + " are visible")
print("")
print("the declaration")
print("  who sets the level : the team that owns the service")
print("  who owes the postmortem : the team that owns the")
print("    service")
print("  who attends the executive review : the team that owns")
print("    the service")
print("  so the classification and its cost : land on the same")
print("    people, at the moment of classifying")
print("  hours at stake per level one : " + str(hours_a_postmortem_costs))
print("")
print("  the second approver guards the change of a level and")
print("  not the setting of one; the first number is the one")
print("  nobody countersigns")
print("")
print("comparing on impact rather than on label")
print("  level twos above the median level one : ")
print("    " + str(level_twos_whose_customer_impact_exceeded_the_median_level_one))
print("  as a share of level twos : " + str(level_twos_above_the_bar_per_myriad) + " per ten thousand")
print("  postmortems they produced : " + str(postmortems_written_for_those))
print("  executive reviews they produced : " + str(postmortems_written_for_those))
print("  hours not spent on them : " + str(postmortem_hours_not_owed) + ", against ")
print("    " + str(postmortem_hours_owed) + " spent on the declared level ones")
print("  were any of them reclassified upward : ")
print("    " + str(levels_raised_after_the_fact))
print("")
nc_declared_level_one = 71
nc_levels_lowered_after_the_fact = 1
nc_incidents_last_year = 1180
print("null control - let someone who owes nothing set the level")
print("  incidents : " + str(nc_incidents_last_year) + ", unchanged")
print("  declared level one : " + str(nc_declared_level_one))
print("  levels lowered after the fact : ")
print("    " + str(nc_levels_lowered_after_the_fact))
print("  the definitions did not change and neither did the")
print("  incidents; the person applying them stopped paying for")
print("  the answer")
print("")
print("what a well-defined severity scheme guarantees")
print("  every incident the owning team called level one got a")
print("    postmortem : exactly, " + str(declared_level_one) + " of them, in " + str(days_a_level_one_postmortem_is_due_in) + " days, with")
print("    an executive review")
print("  every severe incident got one : not addressed; the")
print("    level is chosen by the party that owes the work, and")
print("    " + str(level_twos_whose_customer_impact_exceeded_the_median_level_one) + " level twos were larger than the median level one")
print("")
print("definitions do not classify; people do, and a definition")
print("applied by whoever pays for the answer measures what they")
print("were willing to owe")
print("")
print("Each level has worked examples, the level is set at declaration, lowering one")
print("later needs a second approver and " + str(levels_lowered_after_the_fact) + " were recorded. The team that sets it is the")
print("team that owes the postmortem, so " + str(declared_level_one) + " of " + str(incidents_last_year) + " incidents were level one - ")
print("" + str(level_one_share_per_myriad) + " per ten thousand - while " + str(level_twos_whose_customer_impact_exceeded_the_median_level_one) + " level twos exceeded the median level one on")
print("customer impact and produced " + str(postmortems_written_for_those) + " postmortems and " + str(levels_raised_after_the_fact) + " upward reclassifications.")
```

## stdout (executed)

```text
incidents last year             : 1180
  declared level one            : 34
  declared level two            : 210
  declared level three          : 936
  below level one               : 1146
  level-one share               : 288 per ten thousand

a level one owes                : a postmortem in 5 days
  hours a postmortem costs      : 20
  postmortem hours owed         : 680
incidents that owed no postmortem : 1146

level twos above the median level one, by customer impact
  count                         : 41
  share of level twos           : 1952 per ten thousand
  postmortems written for them  : 0
  hours that would have cost    : 820

levels lowered after the fact   : 6
levels raised after the fact    : 0
  net, downward                 : 6

the severity scheme
  each level : worked examples, not adjectives
  when it is set : at declaration, not argued about
    afterwards
  lowering one later : needs a second approver, and 
    6 were changed and recorded
  what a level one actually gets : an executive review
    and a written postmortem within 5 days
  verdict : DEFINED

  requiring a second approver to LOWER a level is the
  part almost nobody does, and it is why the 
  6 are visible

the declaration
  who sets the level : the team that owns the service
  who owes the postmortem : the team that owns the
    service
  who attends the executive review : the team that owns
    the service
  so the classification and its cost : land on the same
    people, at the moment of classifying
  hours at stake per level one : 20

  the second approver guards the change of a level and
  not the setting of one; the first number is the one
  nobody countersigns

comparing on impact rather than on label
  level twos above the median level one : 
    41
  as a share of level twos : 1952 per ten thousand
  postmortems they produced : 0
  executive reviews they produced : 0
  hours not spent on them : 820, against 
    680 spent on the declared level ones
  were any of them reclassified upward : 
    0

null control - let someone who owes nothing set the level
  incidents : 1180, unchanged
  declared level one : 71
  levels lowered after the fact : 
    1
  the definitions did not change and neither did the
  incidents; the person applying them stopped paying for
  the answer

what a well-defined severity scheme guarantees
  every incident the owning team called level one got a
    postmortem : exactly, 34 of them, in 5 days, with
    an executive review
  every severe incident got one : not addressed; the
    level is chosen by the party that owes the work, and
    41 level twos were larger than the median level one

definitions do not classify; people do, and a definition
applied by whoever pays for the answer measures what they
were willing to owe

Each level has worked examples, the level is set at declaration, lowering one
later needs a second approver and 6 were recorded. The team that sets it is the
team that owes the postmortem, so 34 of 1180 incidents were level one - 
288 per ten thousand - while 41 level twos exceeded the median level one on
customer impact and produced 0 postmortems and 0 upward reclassifications.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
