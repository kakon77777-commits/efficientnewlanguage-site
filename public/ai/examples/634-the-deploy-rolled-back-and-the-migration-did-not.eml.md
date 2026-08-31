<!-- canonical: efficientnewlanguage.org/ai/examples/634-the-deploy-rolled-back-and-the-migration-did-not | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 634 — The deploy rolled back and the migration did not

`the_deploy_rolled_back_and_the_migration_did_not.eml` - The rollback completed in ninety seconds and every instance is running the previous release. What the table holds afterwards is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The rollback
# completed in ninety seconds and every instance is running the previous
# release. What the table holds afterwards is computed below.
#
# The rollback is correct and fast. Instances are immutable, the previous image
# is still in the registry, traffic shifted cleanly, and the release that caused
# the errors is gone from every node. This is the thing rollbacks are for and it
# worked.
#
# A rollback reverts the CODE. It does not revert the migration, and it should
# not: dropping the column would destroy the values the new release wrote, and
# no automated rollback is allowed to do that. So the schema stays forward and
# the code goes back.
#
# The old release does not know the column. For forty-seven minutes it was
# written; for the six days since, it has not been, and nothing distinguishes
# the two kinds of empty.

47 => minutes_the_new_release_was_live
812000 => rows_written_while_it_was_live
6340000 => rows_written_since_the_rollback
90 => rollback_seconds
0 => instances_still_on_the_new_release

rows_written_while_it_was_live + rows_written_since_the_rollback => rows_in_the_affected_range

"minutes the new release was live : " + str(minutes_the_new_release_was_live) ^0
"rollback took, seconds           : " + str(rollback_seconds) ^0
"instances still on it            : " + str(instances_still_on_the_new_release) ^0
"" ^0
"rows written while it was live   : " + str(rows_written_while_it_was_live) ^0
"rows written since the rollback  : " + str(rows_written_since_the_rollback) ^0
"rows in the affected range       : " + str(rows_in_the_affected_range) ^0
"" ^0

# ---- what the rollback verified ----

"the rollback's checks" ^0
"  instances on the previous image : all" ^0
"  health checks passing           : all" ^0
"  error rate                      : back to baseline" ^0
"  time to complete, seconds       : " + str(rollback_seconds) ^0
"  verdict                         : ROLLED BACK" ^0
"" ^0
"  every line is true and the incident was closed on them" ^0
"" ^0

# ---- what stayed forward ----

"the schema after the rollback" ^0
"  column added by the migration : still there" ^0
"  values written into it        : still there, " + str(rows_written_while_it_was_live) ^0
"  the old code's view of it     : it has none" ^0
"  reverting the migration       : would destroy those values" ^0
"" ^0
"  keeping it is the correct decision, and it is what makes" ^0
"  the range below ambiguous" ^0
"" ^0

int(rows_written_while_it_was_live * 10000 / rows_in_the_affected_range) => carried_a_value_per_myriad
"share of the range carrying a value : " + str(carried_a_value_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- the two kinds of empty ----

# The column is null on every row the old code wrote. It is also null on rows
# the new code wrote where the value genuinely was not set. Redeploying makes
# the code read both.
"when the release ships again" ^0
"  rows where null means 'not set'    : from the " + str(minutes_the_new_release_was_live) + " minutes" ^0
"  rows where null means 'never asked': " + str(rows_written_since_the_rollback) ^0
"  a column recording which           : does not exist" ^0
"  the code's reading of null         : one meaning, applied" ^0
"    to both" ^0
"" ^0

# ---- null control ----

# The same rollback, with the migration written so the old code populates the
# column too - a default at the database rather than in the new release.
0 => nc_rows_with_an_ambiguous_null
rows_in_the_affected_range => nc_rows_with_a_stated_value

"null control - the default set in the schema, not the code" ^0
"  rollback time, seconds       : " + str(rollback_seconds) + ", unchanged" ^0
"  rows with an ambiguous null  : " + str(nc_rows_with_an_ambiguous_null) ^0
"  rows carrying a stated value : " + str(nc_rows_with_a_stated_value) ^0
"  the rollback did not improve; the writer that survives" ^0
"  a rollback became the one that fills the column" ^0
"" ^0

# ---- the rule ----

"what a rollback guarantees" ^0
"  the code running is the previous code : exactly" ^0
"  the system is in its previous state   : not addressed;" ^0
"    anything the new code wrote is still written, and the" ^0
"    schema it needed is still applied" ^0
"" ^0
"deploys are reversible and migrations are not, so a release" ^0
"that pairs them can only be half undone; the half that stays" ^0
"is the half holding data" ^0
"" ^0

"The rollback is complete and the incident report is right to close on it:" ^0
"every instance on the previous image in " + str(rollback_seconds) + " seconds, " + str(instances_still_on_the_new_release) + " left behind, error rate" ^0
"at baseline. The column stays, correctly, holding values on " + str(rows_written_while_it_was_live) + " rows from " + str(minutes_the_new_release_was_live) ^0
"minutes - " + str(carried_a_value_per_myriad) + " per ten thousand of the affected range - and null on the" ^0
str(rows_written_since_the_rollback) + " written since, where null means the writer never had the field." ^0
```

## Python (deterministic transpilation)

```python
minutes_the_new_release_was_live = 47
rows_written_while_it_was_live = 812000
rows_written_since_the_rollback = 6340000
rollback_seconds = 90
instances_still_on_the_new_release = 0
rows_in_the_affected_range = rows_written_while_it_was_live + rows_written_since_the_rollback
print("minutes the new release was live : " + str(minutes_the_new_release_was_live))
print("rollback took, seconds           : " + str(rollback_seconds))
print("instances still on it            : " + str(instances_still_on_the_new_release))
print("")
print("rows written while it was live   : " + str(rows_written_while_it_was_live))
print("rows written since the rollback  : " + str(rows_written_since_the_rollback))
print("rows in the affected range       : " + str(rows_in_the_affected_range))
print("")
print("the rollback's checks")
print("  instances on the previous image : all")
print("  health checks passing           : all")
print("  error rate                      : back to baseline")
print("  time to complete, seconds       : " + str(rollback_seconds))
print("  verdict                         : ROLLED BACK")
print("")
print("  every line is true and the incident was closed on them")
print("")
print("the schema after the rollback")
print("  column added by the migration : still there")
print("  values written into it        : still there, " + str(rows_written_while_it_was_live))
print("  the old code's view of it     : it has none")
print("  reverting the migration       : would destroy those values")
print("")
print("  keeping it is the correct decision, and it is what makes")
print("  the range below ambiguous")
print("")
carried_a_value_per_myriad = int(rows_written_while_it_was_live * 10000 / rows_in_the_affected_range)
print("share of the range carrying a value : " + str(carried_a_value_per_myriad) + " per ten thousand")
print("")
print("when the release ships again")
print("  rows where null means 'not set'    : from the " + str(minutes_the_new_release_was_live) + " minutes")
print("  rows where null means 'never asked': " + str(rows_written_since_the_rollback))
print("  a column recording which           : does not exist")
print("  the code's reading of null         : one meaning, applied")
print("    to both")
print("")
nc_rows_with_an_ambiguous_null = 0
nc_rows_with_a_stated_value = rows_in_the_affected_range
print("null control - the default set in the schema, not the code")
print("  rollback time, seconds       : " + str(rollback_seconds) + ", unchanged")
print("  rows with an ambiguous null  : " + str(nc_rows_with_an_ambiguous_null))
print("  rows carrying a stated value : " + str(nc_rows_with_a_stated_value))
print("  the rollback did not improve; the writer that survives")
print("  a rollback became the one that fills the column")
print("")
print("what a rollback guarantees")
print("  the code running is the previous code : exactly")
print("  the system is in its previous state   : not addressed;")
print("    anything the new code wrote is still written, and the")
print("    schema it needed is still applied")
print("")
print("deploys are reversible and migrations are not, so a release")
print("that pairs them can only be half undone; the half that stays")
print("is the half holding data")
print("")
print("The rollback is complete and the incident report is right to close on it:")
print("every instance on the previous image in " + str(rollback_seconds) + " seconds, " + str(instances_still_on_the_new_release) + " left behind, error rate")
print("at baseline. The column stays, correctly, holding values on " + str(rows_written_while_it_was_live) + " rows from " + str(minutes_the_new_release_was_live))
print("minutes - " + str(carried_a_value_per_myriad) + " per ten thousand of the affected range - and null on the")
print(str(rows_written_since_the_rollback) + " written since, where null means the writer never had the field.")
```

## stdout (executed)

```text
minutes the new release was live : 47
rollback took, seconds           : 90
instances still on it            : 0

rows written while it was live   : 812000
rows written since the rollback  : 6340000
rows in the affected range       : 7152000

the rollback's checks
  instances on the previous image : all
  health checks passing           : all
  error rate                      : back to baseline
  time to complete, seconds       : 90
  verdict                         : ROLLED BACK

  every line is true and the incident was closed on them

the schema after the rollback
  column added by the migration : still there
  values written into it        : still there, 812000
  the old code's view of it     : it has none
  reverting the migration       : would destroy those values

  keeping it is the correct decision, and it is what makes
  the range below ambiguous

share of the range carrying a value : 1135 per ten thousand

when the release ships again
  rows where null means 'not set'    : from the 47 minutes
  rows where null means 'never asked': 6340000
  a column recording which           : does not exist
  the code's reading of null         : one meaning, applied
    to both

null control - the default set in the schema, not the code
  rollback time, seconds       : 90, unchanged
  rows with an ambiguous null  : 0
  rows carrying a stated value : 7152000
  the rollback did not improve; the writer that survives
  a rollback became the one that fills the column

what a rollback guarantees
  the code running is the previous code : exactly
  the system is in its previous state   : not addressed;
    anything the new code wrote is still written, and the
    schema it needed is still applied

deploys are reversible and migrations are not, so a release
that pairs them can only be half undone; the half that stays
is the half holding data

The rollback is complete and the incident report is right to close on it:
every instance on the previous image in 90 seconds, 0 left behind, error rate
at baseline. The column stays, correctly, holding values on 812000 rows from 47
minutes - 1135 per ten thousand of the affected range - and null on the
6340000 written since, where null means the writer never had the field.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
