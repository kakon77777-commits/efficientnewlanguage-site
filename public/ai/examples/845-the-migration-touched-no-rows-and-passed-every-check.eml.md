<!-- canonical: efficientnewlanguage.org/ai/examples/845-the-migration-touched-no-rows-and-passed-every-check | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 845 — The migration touched no rows and passed every check

`the_migration_touched_no_rows_and_passed_every_check.eml` - The data migration passed every post-migration check, and each check is real. How many rows the migration touched is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The data migration
# passed every post-migration check, and each check is real. How many rows the
# migration touched is computed below.
#
# The checks are careful. Each is a per-row assertion over the migrated rows, not
# a spot check; every migrated row is verified, not a sample; a single failing
# row fails the migration; and the checks run in the same transaction as the
# migration.
#
# The migration's WHERE clause matched no rows, and a per-row check over no rows
# passes trivially.

2000000 => rows_in_the_table
0 => rows_the_migration_matched
0 => rows_that_failed_a_check
100 => reported_checks_passed_per_hundred
740000 => rows_that_needed_migrating

rows_the_migration_matched => rows_the_checks_ran_over
rows_that_needed_migrating - rows_the_migration_matched => rows_left_unmigrated
int(rows_left_unmigrated * 10000 / rows_that_needed_migrating) => unmigrated_share_per_myriad

"rows in the table               : " + str(rows_in_the_table) ^0
"rows the migration matched      : " + str(rows_the_migration_matched) ^0
"rows the checks ran over        : " + str(rows_the_checks_ran_over) ^0
"rows that failed a check        : " + str(rows_that_failed_a_check) ^0
"reported checks passed          : " + str(reported_checks_passed_per_hundred) + " per hundred" ^0
"" ^0
"rows that needed migrating      : " + str(rows_that_needed_migrating) ^0
"  left unmigrated               : " + str(rows_left_unmigrated) ^0
"unmigrated share                : " + str(unmigrated_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the checks verified ----

"the post-migration checks" ^0
"  each : a per-row assertion, not a spot check" ^0
"  over : every migrated row, not a sample" ^0
"  a failing row : fails the whole migration" ^0
"  run : in the migration's own transaction" ^0
"  rows that failed a check : " + str(rows_that_failed_a_check) ^0
"  verdict : ALL CHECKS PASSED" ^0
"" ^0
"  per-row assertions in the same transaction is the part" ^0
"  done right here, and it is why a genuinely bad migrated" ^0
"  row would fail the run" ^0
"" ^0

# ---- what the checks ran over ----

"the migrated rows" ^0
"  the migration's WHERE matched : " + str(rows_the_migration_matched) ^0
"  so rows the checks assert over : " + str(rows_the_checks_ran_over) ^0
"  a per-row check over zero rows : passes, every one of" ^0
"    none satisfied" ^0
"  what 'all checks passed' means here : nothing was" ^0
"    checked" ^0
"  what it does not mean : that the migration ran" ^0
"" ^0

# ---- why the migration was empty ----

"the migration's WHERE clause" ^0
"  what it matched : " + str(rows_the_migration_matched) ^0
"  why : it filters on a status value the rows no longer" ^0
"    use after an earlier migration renamed it" ^0
"  rows that actually needed the change : " ^0
"    " + str(rows_that_needed_migrating) ^0
"  did the checks notice they were untouched : no; they" ^0
"    were never in scope" ^0
"  is the pass false : no; it is vacuously true" ^0
"" ^0

# ---- null control ----

# The same run, with the migration asserting a minimum expected row count and the
# checks refusing to pass over an empty change set.
100 => nc_checks_pass_over_empty
0 => nc_checks_pass_when_empty_is_an_error
740000 => nc_rows_a_count_assertion_would_flag

"null control - assert an expected row count" ^0
"  checks pass over empty : " + str(nc_checks_pass_over_empty) + " per hundred" ^0
"  checks pass when empty is an error : " ^0
"    " + str(nc_checks_pass_when_empty_is_an_error) ^0
"  rows a count assertion would flag as unmigrated : " ^0
"    " + str(nc_rows_a_count_assertion_would_flag) ^0
"  no row changed; an empty change set stopped counting as" ^0
"  a passed migration" ^0
"" ^0

# ---- the rule ----

"what all-checks-passed guarantees" ^0
"  every migrated row satisfies every check : exactly," ^0
"    per row, in one transaction, none failing" ^0
"  the migration ran : not addressed; the WHERE matched no" ^0
"    rows, and a per-row check over no rows passes trivially" ^0
"    - " + str(rows_that_needed_migrating) + " rows that needed migrating were untouched, and" ^0
"    every check was green over the empty set" ^0
"" ^0

"a per-row guarantee is quantified over the rows in scope, and an empty scope" ^0
"satisfies it completely; 'every migrated row is correct' is most true when no" ^0
"row was migrated, which is when the migration did nothing" ^0
"" ^0

"Each check is a per-row assertion over every migrated row in one transaction -" ^0
"all green. The WHERE matched " + str(rows_the_migration_matched) + " rows, so the checks passed vacuously over" ^0
"none, while " + str(rows_that_needed_migrating) + " rows that needed the change went untouched, " + str(unmigrated_share_per_myriad) + " per ten" ^0
"thousand of them." ^0
```

## Python (deterministic transpilation)

```python
rows_in_the_table = 2000000
rows_the_migration_matched = 0
rows_that_failed_a_check = 0
reported_checks_passed_per_hundred = 100
rows_that_needed_migrating = 740000
rows_the_checks_ran_over = rows_the_migration_matched
rows_left_unmigrated = rows_that_needed_migrating - rows_the_migration_matched
unmigrated_share_per_myriad = int(rows_left_unmigrated * 10000 / rows_that_needed_migrating)
print("rows in the table               : " + str(rows_in_the_table))
print("rows the migration matched      : " + str(rows_the_migration_matched))
print("rows the checks ran over        : " + str(rows_the_checks_ran_over))
print("rows that failed a check        : " + str(rows_that_failed_a_check))
print("reported checks passed          : " + str(reported_checks_passed_per_hundred) + " per hundred")
print("")
print("rows that needed migrating      : " + str(rows_that_needed_migrating))
print("  left unmigrated               : " + str(rows_left_unmigrated))
print("unmigrated share                : " + str(unmigrated_share_per_myriad) + " per ten thousand")
print("")
print("the post-migration checks")
print("  each : a per-row assertion, not a spot check")
print("  over : every migrated row, not a sample")
print("  a failing row : fails the whole migration")
print("  run : in the migration's own transaction")
print("  rows that failed a check : " + str(rows_that_failed_a_check))
print("  verdict : ALL CHECKS PASSED")
print("")
print("  per-row assertions in the same transaction is the part")
print("  done right here, and it is why a genuinely bad migrated")
print("  row would fail the run")
print("")
print("the migrated rows")
print("  the migration's WHERE matched : " + str(rows_the_migration_matched))
print("  so rows the checks assert over : " + str(rows_the_checks_ran_over))
print("  a per-row check over zero rows : passes, every one of")
print("    none satisfied")
print("  what 'all checks passed' means here : nothing was")
print("    checked")
print("  what it does not mean : that the migration ran")
print("")
print("the migration's WHERE clause")
print("  what it matched : " + str(rows_the_migration_matched))
print("  why : it filters on a status value the rows no longer")
print("    use after an earlier migration renamed it")
print("  rows that actually needed the change : ")
print("    " + str(rows_that_needed_migrating))
print("  did the checks notice they were untouched : no; they")
print("    were never in scope")
print("  is the pass false : no; it is vacuously true")
print("")
nc_checks_pass_over_empty = 100
nc_checks_pass_when_empty_is_an_error = 0
nc_rows_a_count_assertion_would_flag = 740000
print("null control - assert an expected row count")
print("  checks pass over empty : " + str(nc_checks_pass_over_empty) + " per hundred")
print("  checks pass when empty is an error : ")
print("    " + str(nc_checks_pass_when_empty_is_an_error))
print("  rows a count assertion would flag as unmigrated : ")
print("    " + str(nc_rows_a_count_assertion_would_flag))
print("  no row changed; an empty change set stopped counting as")
print("  a passed migration")
print("")
print("what all-checks-passed guarantees")
print("  every migrated row satisfies every check : exactly,")
print("    per row, in one transaction, none failing")
print("  the migration ran : not addressed; the WHERE matched no")
print("    rows, and a per-row check over no rows passes trivially")
print("    - " + str(rows_that_needed_migrating) + " rows that needed migrating were untouched, and")
print("    every check was green over the empty set")
print("")
print("a per-row guarantee is quantified over the rows in scope, and an empty scope")
print("satisfies it completely; 'every migrated row is correct' is most true when no")
print("row was migrated, which is when the migration did nothing")
print("")
print("Each check is a per-row assertion over every migrated row in one transaction -")
print("all green. The WHERE matched " + str(rows_the_migration_matched) + " rows, so the checks passed vacuously over")
print("none, while " + str(rows_that_needed_migrating) + " rows that needed the change went untouched, " + str(unmigrated_share_per_myriad) + " per ten")
print("thousand of them.")
```

## stdout (executed)

```text
rows in the table               : 2000000
rows the migration matched      : 0
rows the checks ran over        : 0
rows that failed a check        : 0
reported checks passed          : 100 per hundred

rows that needed migrating      : 740000
  left unmigrated               : 740000
unmigrated share                : 10000 per ten thousand

the post-migration checks
  each : a per-row assertion, not a spot check
  over : every migrated row, not a sample
  a failing row : fails the whole migration
  run : in the migration's own transaction
  rows that failed a check : 0
  verdict : ALL CHECKS PASSED

  per-row assertions in the same transaction is the part
  done right here, and it is why a genuinely bad migrated
  row would fail the run

the migrated rows
  the migration's WHERE matched : 0
  so rows the checks assert over : 0
  a per-row check over zero rows : passes, every one of
    none satisfied
  what 'all checks passed' means here : nothing was
    checked
  what it does not mean : that the migration ran

the migration's WHERE clause
  what it matched : 0
  why : it filters on a status value the rows no longer
    use after an earlier migration renamed it
  rows that actually needed the change : 
    740000
  did the checks notice they were untouched : no; they
    were never in scope
  is the pass false : no; it is vacuously true

null control - assert an expected row count
  checks pass over empty : 100 per hundred
  checks pass when empty is an error : 
    0
  rows a count assertion would flag as unmigrated : 
    740000
  no row changed; an empty change set stopped counting as
  a passed migration

what all-checks-passed guarantees
  every migrated row satisfies every check : exactly,
    per row, in one transaction, none failing
  the migration ran : not addressed; the WHERE matched no
    rows, and a per-row check over no rows passes trivially
    - 740000 rows that needed migrating were untouched, and
    every check was green over the empty set

a per-row guarantee is quantified over the rows in scope, and an empty scope
satisfies it completely; 'every migrated row is correct' is most true when no
row was migrated, which is when the migration did nothing

Each check is a per-row assertion over every migrated row in one transaction -
all green. The WHERE matched 0 rows, so the checks passed vacuously over
none, while 740000 rows that needed the change went untouched, 10000 per ten
thousand of them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
