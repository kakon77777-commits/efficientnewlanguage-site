<!-- canonical: efficientnewlanguage.org/ai/examples/723-the-migration-ran-forward-and-the-code-deployed-first | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 723 — The migration ran forward and the code deployed first

`the_migration_ran_forward_and_the_code_deployed_first.eml` - Every migration is expand-contract, reviewed, run by CI against a copy of production, and none has needed downtime or a rollback. What runs during the deploy is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every migration is
# expand-contract, reviewed, run by CI against a copy of production, and none
# has needed downtime or a rollback. What runs during the deploy is computed
# below.
#
# The migration discipline is the good kind. Nothing is renamed or dropped in
# the same change that adds it; every migration is additive first and the
# contraction is a separate change weeks later; each one is reviewed by someone
# other than its author; and CI runs it against a restored copy of production
# rather than an empty schema. Three hundred forty this year, no downtime, no
# rollbacks.
#
# What CI tests is the NEW code against the NEW schema. A rolling deploy runs
# the old code against the new schema for as long as the roll takes, and that
# pair is not a pair anyone ran.
#
# A roll takes fourteen minutes and there are sixty deploys a week.

340 => migrations_this_year
0 => migrations_needing_downtime
0 => rollbacks
340 => migrations_tested_against_a_copy_of_production
3 => code_schema_combinations_that_occur
2 => combinations_the_pipeline_tests
60 => deploys_per_week
14 => rolling_deploy_minutes
2900 => requests_per_minute
7 => days_in_a_week
24 => hours_in_a_day
60 => minutes_in_an_hour

code_schema_combinations_that_occur - combinations_the_pipeline_tests => combinations_that_occur_untested
days_in_a_week * hours_in_a_day * minutes_in_an_hour => minutes_in_a_week
deploys_per_week * rolling_deploy_minutes => minutes_a_week_in_the_untested_combination
minutes_a_week_in_the_untested_combination * requests_per_minute => requests_served_by_the_untested_combination
int(minutes_a_week_in_the_untested_combination * 10000 / minutes_in_a_week) => untested_window_per_myriad

"migrations this year            : " + str(migrations_this_year) ^0
"  needing downtime              : " + str(migrations_needing_downtime) ^0
"  rolled back                   : " + str(rollbacks) ^0
"  tested against a copy of production : " + str(migrations_tested_against_a_copy_of_production) ^0
"" ^0
"code and schema combinations that occur : " + str(code_schema_combinations_that_occur) ^0
"  the pipeline tests            : " + str(combinations_the_pipeline_tests) ^0
"  occur untested                : " + str(combinations_that_occur_untested) ^0
"" ^0
"deploys per week                : " + str(deploys_per_week) ^0
"minutes per roll                : " + str(rolling_deploy_minutes) ^0
"minutes a week in that combination : " + str(minutes_a_week_in_the_untested_combination) ^0
"  out of a week of              : " + str(minutes_in_a_week) ^0
"  share                         : " + str(untested_window_per_myriad) + " per ten thousand" ^0
"requests served by it, per week : " + str(requests_served_by_the_untested_combination) ^0
"" ^0

# ---- what the discipline verified ----

"the migration practice" ^0
"  additive first, contraction separate : always" ^0
"  reviewed by someone other than the author : always" ^0
"  run by CI against : a restored copy of production" ^0
"  migrations this year : " + str(migrations_this_year) ^0
"  needing downtime     : " + str(migrations_needing_downtime) ^0
"  rolled back          : " + str(rollbacks) ^0
"  verdict : EXPAND-CONTRACT" ^0
"" ^0
"  testing against a restored copy rather than an empty" ^0
"  schema is the expensive half and it is why this holds" ^0
"" ^0

# ---- what the test pairs ----

"the tested pair" ^0
"  code   : the new build" ^0
"  schema : after the migration" ^0
"  what production ran before : old code, old schema" ^0
"  what production runs after  : new code, new schema" ^0
"  what production runs in between : old code, new schema" ^0
"  where that pair is exercised : nowhere in CI" ^0
"" ^0
"  the migration is compatible in the direction it was" ^0
"  written for, and the deploy visits a state on the way" ^0
"" ^0
# ---- why expand-contract does not close it ----

# Expand-contract is what makes the untested pair survivable most of the time,
# and it is why nothing has broken yet. It guarantees the old code's columns
# still exist. It says nothing about a new NOT NULL default, a new trigger, a
# changed index the old query planner did not expect, or a check constraint the
# old writer violates.
"what additive means" ^0
"  columns the old code reads : still there" ^0
"  and that is the reason this usually works : yes" ^0
"  a new constraint the old writer can violate : additive" ^0
"  a new trigger firing on the old write path  : additive" ^0
"  a new index changing the old plan           : additive" ^0
"  additive describes the schema, not the" ^0
"    behaviour of a writer that has not been told" ^0
"" ^0

# ---- what the green pipeline is a statement about ----

"the pipeline result" ^0
"  migrations run against a production copy : " + str(migrations_tested_against_a_copy_of_production) ^0
"  failures : " + str(rollbacks) ^0
"  what each run proves : this migration applies, and the" ^0
"    new code passes against the result" ^0
"  what a reader takes it for : this migration is safe to" ^0
"    deploy" ^0
"  the difference between those : " + str(combinations_that_occur_untested) + " combination, for" ^0
"    " + str(minutes_a_week_in_the_untested_combination) + " minutes a week" ^0
"" ^0

# ---- null control ----

# The same pipeline, running the PREVIOUS build's test suite against the
# migrated schema before the roll begins.
code_schema_combinations_that_occur => nc_combinations_the_pipeline_tests
0 => nc_combinations_that_occur_untested

"null control - the old suite runs against the new schema" ^0
"  migrations needing downtime : " + str(migrations_needing_downtime) + ", unchanged" ^0
"  combinations tested : " + str(nc_combinations_the_pipeline_tests) ^0
"  combinations occurring untested : " + str(nc_combinations_that_occur_untested) ^0
"  the migration did not get safer; the pipeline started" ^0
"  running the pair the deploy actually produces" ^0
"" ^0

# ---- the rule ----

"what a green migration pipeline guarantees" ^0
"  the new code works against the new schema : exactly," ^0
"    against real data rather than an empty schema" ^0
"  the deploy is safe                        : not" ^0
"    addressed; a deploy is a sequence of states and the" ^0
"    test covers its endpoint" ^0
"" ^0
"a change tested as a before and an after is tested at two" ^0
"points; a rolling deploy is the interval between them, and" ^0
"the interval is where both versions are live at once" ^0
"" ^0

"The migration practice is real: additive first with the contraction weeks" ^0
"later, independently reviewed, and run by CI against a restored copy of" ^0
"production - " + str(migrations_this_year) + " this year with " + str(migrations_needing_downtime) + " needing downtime and " + str(rollbacks) + " rolled back." ^0
"CI pairs the new code with the new schema, so of the " + str(code_schema_combinations_that_occur) + " combinations a rolling" ^0
"deploy produces it tests " + str(combinations_the_pipeline_tests) + ", and the remaining one runs for " + str(minutes_a_week_in_the_untested_combination) + " minutes a" ^0
"week - " + str(untested_window_per_myriad) + " per ten thousand - serving " + str(requests_served_by_the_untested_combination) + " requests." ^0
```

## Python (deterministic transpilation)

```python
migrations_this_year = 340
migrations_needing_downtime = 0
rollbacks = 0
migrations_tested_against_a_copy_of_production = 340
code_schema_combinations_that_occur = 3
combinations_the_pipeline_tests = 2
deploys_per_week = 60
rolling_deploy_minutes = 14
requests_per_minute = 2900
days_in_a_week = 7
hours_in_a_day = 24
minutes_in_an_hour = 60
combinations_that_occur_untested = code_schema_combinations_that_occur - combinations_the_pipeline_tests
minutes_in_a_week = days_in_a_week * hours_in_a_day * minutes_in_an_hour
minutes_a_week_in_the_untested_combination = deploys_per_week * rolling_deploy_minutes
requests_served_by_the_untested_combination = minutes_a_week_in_the_untested_combination * requests_per_minute
untested_window_per_myriad = int(minutes_a_week_in_the_untested_combination * 10000 / minutes_in_a_week)
print("migrations this year            : " + str(migrations_this_year))
print("  needing downtime              : " + str(migrations_needing_downtime))
print("  rolled back                   : " + str(rollbacks))
print("  tested against a copy of production : " + str(migrations_tested_against_a_copy_of_production))
print("")
print("code and schema combinations that occur : " + str(code_schema_combinations_that_occur))
print("  the pipeline tests            : " + str(combinations_the_pipeline_tests))
print("  occur untested                : " + str(combinations_that_occur_untested))
print("")
print("deploys per week                : " + str(deploys_per_week))
print("minutes per roll                : " + str(rolling_deploy_minutes))
print("minutes a week in that combination : " + str(minutes_a_week_in_the_untested_combination))
print("  out of a week of              : " + str(minutes_in_a_week))
print("  share                         : " + str(untested_window_per_myriad) + " per ten thousand")
print("requests served by it, per week : " + str(requests_served_by_the_untested_combination))
print("")
print("the migration practice")
print("  additive first, contraction separate : always")
print("  reviewed by someone other than the author : always")
print("  run by CI against : a restored copy of production")
print("  migrations this year : " + str(migrations_this_year))
print("  needing downtime     : " + str(migrations_needing_downtime))
print("  rolled back          : " + str(rollbacks))
print("  verdict : EXPAND-CONTRACT")
print("")
print("  testing against a restored copy rather than an empty")
print("  schema is the expensive half and it is why this holds")
print("")
print("the tested pair")
print("  code   : the new build")
print("  schema : after the migration")
print("  what production ran before : old code, old schema")
print("  what production runs after  : new code, new schema")
print("  what production runs in between : old code, new schema")
print("  where that pair is exercised : nowhere in CI")
print("")
print("  the migration is compatible in the direction it was")
print("  written for, and the deploy visits a state on the way")
print("")
print("what additive means")
print("  columns the old code reads : still there")
print("  and that is the reason this usually works : yes")
print("  a new constraint the old writer can violate : additive")
print("  a new trigger firing on the old write path  : additive")
print("  a new index changing the old plan           : additive")
print("  additive describes the schema, not the")
print("    behaviour of a writer that has not been told")
print("")
print("the pipeline result")
print("  migrations run against a production copy : " + str(migrations_tested_against_a_copy_of_production))
print("  failures : " + str(rollbacks))
print("  what each run proves : this migration applies, and the")
print("    new code passes against the result")
print("  what a reader takes it for : this migration is safe to")
print("    deploy")
print("  the difference between those : " + str(combinations_that_occur_untested) + " combination, for")
print("    " + str(minutes_a_week_in_the_untested_combination) + " minutes a week")
print("")
nc_combinations_the_pipeline_tests = code_schema_combinations_that_occur
nc_combinations_that_occur_untested = 0
print("null control - the old suite runs against the new schema")
print("  migrations needing downtime : " + str(migrations_needing_downtime) + ", unchanged")
print("  combinations tested : " + str(nc_combinations_the_pipeline_tests))
print("  combinations occurring untested : " + str(nc_combinations_that_occur_untested))
print("  the migration did not get safer; the pipeline started")
print("  running the pair the deploy actually produces")
print("")
print("what a green migration pipeline guarantees")
print("  the new code works against the new schema : exactly,")
print("    against real data rather than an empty schema")
print("  the deploy is safe                        : not")
print("    addressed; a deploy is a sequence of states and the")
print("    test covers its endpoint")
print("")
print("a change tested as a before and an after is tested at two")
print("points; a rolling deploy is the interval between them, and")
print("the interval is where both versions are live at once")
print("")
print("The migration practice is real: additive first with the contraction weeks")
print("later, independently reviewed, and run by CI against a restored copy of")
print("production - " + str(migrations_this_year) + " this year with " + str(migrations_needing_downtime) + " needing downtime and " + str(rollbacks) + " rolled back.")
print("CI pairs the new code with the new schema, so of the " + str(code_schema_combinations_that_occur) + " combinations a rolling")
print("deploy produces it tests " + str(combinations_the_pipeline_tests) + ", and the remaining one runs for " + str(minutes_a_week_in_the_untested_combination) + " minutes a")
print("week - " + str(untested_window_per_myriad) + " per ten thousand - serving " + str(requests_served_by_the_untested_combination) + " requests.")
```

## stdout (executed)

```text
migrations this year            : 340
  needing downtime              : 0
  rolled back                   : 0
  tested against a copy of production : 340

code and schema combinations that occur : 3
  the pipeline tests            : 2
  occur untested                : 1

deploys per week                : 60
minutes per roll                : 14
minutes a week in that combination : 840
  out of a week of              : 10080
  share                         : 833 per ten thousand
requests served by it, per week : 2436000

the migration practice
  additive first, contraction separate : always
  reviewed by someone other than the author : always
  run by CI against : a restored copy of production
  migrations this year : 340
  needing downtime     : 0
  rolled back          : 0
  verdict : EXPAND-CONTRACT

  testing against a restored copy rather than an empty
  schema is the expensive half and it is why this holds

the tested pair
  code   : the new build
  schema : after the migration
  what production ran before : old code, old schema
  what production runs after  : new code, new schema
  what production runs in between : old code, new schema
  where that pair is exercised : nowhere in CI

  the migration is compatible in the direction it was
  written for, and the deploy visits a state on the way

what additive means
  columns the old code reads : still there
  and that is the reason this usually works : yes
  a new constraint the old writer can violate : additive
  a new trigger firing on the old write path  : additive
  a new index changing the old plan           : additive
  additive describes the schema, not the
    behaviour of a writer that has not been told

the pipeline result
  migrations run against a production copy : 340
  failures : 0
  what each run proves : this migration applies, and the
    new code passes against the result
  what a reader takes it for : this migration is safe to
    deploy
  the difference between those : 1 combination, for
    840 minutes a week

null control - the old suite runs against the new schema
  migrations needing downtime : 0, unchanged
  combinations tested : 3
  combinations occurring untested : 0
  the migration did not get safer; the pipeline started
  running the pair the deploy actually produces

what a green migration pipeline guarantees
  the new code works against the new schema : exactly,
    against real data rather than an empty schema
  the deploy is safe                        : not
    addressed; a deploy is a sequence of states and the
    test covers its endpoint

a change tested as a before and an after is tested at two
points; a rolling deploy is the interval between them, and
the interval is where both versions are live at once

The migration practice is real: additive first with the contraction weeks
later, independently reviewed, and run by CI against a restored copy of
production - 340 this year with 0 needing downtime and 0 rolled back.
CI pairs the new code with the new schema, so of the 3 combinations a rolling
deploy produces it tests 2, and the remaining one runs for 840 minutes a
week - 833 per ten thousand - serving 2436000 requests.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
