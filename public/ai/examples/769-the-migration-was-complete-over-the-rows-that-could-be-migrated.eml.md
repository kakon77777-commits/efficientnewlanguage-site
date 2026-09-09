<!-- canonical: efficientnewlanguage.org/ai/examples/769-the-migration-was-complete-over-the-rows-that-could-be-migrated | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 769 — The migration was complete over the rows that could be migrated

`the_migration_was_complete_over_the_rows_that_could_be_migrated.eml` - The migration reported complete after eleven months, and the work behind that report was done properly. What complete was measured against is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The migration
# reported complete after eleven months, and the work behind that report was
# done properly. What complete was measured against is computed below.
#
# The migration was run well. Every batch was checksummed on both sides rather
# than counted; the application dual-wrote for forty-five days and the two
# stores were compared row by row during it; the rollback was rehearsed four
# times against a restored copy of production; and the cutover happened only
# after a week in which the new store served reads with the old one still
# authoritative.
#
# A row the target would not accept was routed to a review table and taken out
# of the total the report divides by.

41800000 => source_rows
41246000 => rows_migrated
554000 => rows_routed_to_needs_review
318000 => rows_with_a_null_in_a_now_required_column
173000 => rows_with_a_foreign_key_that_has_no_parent
63000 => rows_dated_before_the_target_allows
11 => months_of_work
8360 => batches_checksummed_on_both_sides
45 => days_of_dual_write
4 => rollback_rehearsals
0 => needs_review_rows_examined_since_cutover

source_rows - rows_routed_to_needs_review => rows_the_report_counted
rows_with_a_null_in_a_now_required_column + rows_with_a_foreign_key_that_has_no_parent => rows_refused_for_a_shape_reason
rows_refused_for_a_shape_reason + rows_dated_before_the_target_allows => rows_refused_in_total
int(rows_migrated * 10000 / rows_the_report_counted) => completeness_as_reported_myriad
int(rows_migrated * 10000 / source_rows) => completeness_against_source_myriad
completeness_as_reported_myriad - completeness_against_source_myriad => the_distance_between_them_myriad

"source rows                     : " + str(source_rows) ^0
"  migrated                      : " + str(rows_migrated) ^0
"  routed to needs_review        : " + str(rows_routed_to_needs_review) ^0
"  the report's denominator      : " + str(rows_the_report_counted) ^0
"" ^0
"completeness, as reported       : " + str(completeness_as_reported_myriad) + " per ten thousand" ^0
"completeness, against source    : " + str(completeness_against_source_myriad) + " per ten thousand" ^0
"  distance between them         : " + str(the_distance_between_them_myriad) + " per ten thousand" ^0
"" ^0
"rows refused in total           : " + str(rows_refused_in_total) ^0
"  null in a now-required column : " + str(rows_with_a_null_in_a_now_required_column) ^0
"  foreign key with no parent    : " + str(rows_with_a_foreign_key_that_has_no_parent) ^0
"  dated before the target allows: " + str(rows_dated_before_the_target_allows) ^0
"" ^0
"months of work                  : " + str(months_of_work) ^0
"batches checksummed both sides  : " + str(batches_checksummed_on_both_sides) ^0
"days of dual write              : " + str(days_of_dual_write) ^0
"rollback rehearsals             : " + str(rollback_rehearsals) ^0
"needs_review rows examined since: " + str(needs_review_rows_examined_since_cutover) ^0
"" ^0

# ---- what the migration verified ----

"the migration" ^0
"  per batch : a checksum on both sides, not a count," ^0
"    " + str(batches_checksummed_on_both_sides) + " times" ^0
"  dual write : " + str(days_of_dual_write) + " days, with the two stores compared row" ^0
"    by row throughout" ^0
"  rollback : rehearsed " + str(rollback_rehearsals) + " times against a restored copy of" ^0
"    production" ^0
"  cutover : after a week of the new store serving reads" ^0
"    with the old one still authoritative" ^0
"  verdict : COMPLETE" ^0
"" ^0
"  checksumming each batch rather than counting it is the" ^0
"  part almost nobody does, and it is why no migrated row" ^0
"  is in doubt" ^0
"" ^0

# ---- what the denominator was ----

"the two ways to divide" ^0
"  rows the report counted : " + str(rows_the_report_counted) + ", which is the source" ^0
"    minus the rows the target refused" ^0
"  rows migrated : " + str(rows_migrated) ^0
"  so the reported figure : " + str(completeness_as_reported_myriad) + " per ten thousand" ^0
"  could it have been lower : only if a row that passed" ^0
"    the target's constraints had been left behind, and" ^0
"    the checksums say none was" ^0
"  against the source instead : " + str(completeness_against_source_myriad) + " per ten thousand" ^0
"" ^0
"  a refused row leaves the denominator at the moment it" ^0
"  becomes the kind of row that would have lowered it" ^0
"" ^0

# ---- what is in the review table ----

"needs_review" ^0
"  rows : " + str(rows_routed_to_needs_review) ^0
"  are they lost : no; they are in a table, in the new" ^0
"    store, with their original values" ^0
"  is anything reading them : " + str(needs_review_rows_examined_since_cutover) + " rows examined since" ^0
"    cutover" ^0
"  does the old store still exist : no; it was" ^0
"    decommissioned when the report was accepted" ^0
"  what a customer whose row is there sees : an account" ^0
"    that predates the change and no longer resolves" ^0
"" ^0

# ---- null control ----

# The same migration, with completeness divided by the source row count and the
# review table given an owner.
41800000 => nc_denominator_rows
41246000 => nc_rows_migrated
554000 => nc_rows_with_an_owner

"null control - divide by the source, give the table an owner" ^0
"  batches checksummed : " + str(batches_checksummed_on_both_sides) + ", unchanged" ^0
"  denominator : " + str(nc_denominator_rows) ^0
"  rows migrated : " + str(nc_rows_migrated) ^0
"  completeness : " + str(completeness_against_source_myriad) + " per ten thousand" ^0
"  rows with somebody responsible for them : " + str(nc_rows_with_an_owner) ^0
"  no row moved; the total it was compared against" ^0
"  stopped being defined by what moved" ^0
"" ^0

# ---- the rule ----

"what a complete migration guarantees" ^0
"  every row the target would accept is in the target :" ^0
"    exactly, checksummed per batch, " + str(days_of_dual_write) + " days of dual" ^0
"    write, " + str(rollback_rehearsals) + " rehearsals" ^0
"  every row is in the target : not addressed; a row the" ^0
"    target refused was removed from the total before the" ^0
"    division" ^0
"" ^0
"a completion figure whose denominator excludes the" ^0
"failures reaches one hundred percent as a matter of" ^0
"arithmetic; the rows that were left are in a table nobody" ^0
"divides by" ^0
"" ^0

"Every batch was checksummed on both sides, the application dual-wrote for " + str(days_of_dual_write) ^0
"days with row-by-row comparison, and the rollback was rehearsed " + str(rollback_rehearsals) + " times. Rows the" ^0
"target refused were routed out of the denominator, so completeness reads " + str(completeness_as_reported_myriad) ^0
"per ten thousand against " + str(completeness_against_source_myriad) + " over the source - " + str(rows_routed_to_needs_review) + " rows apart - and " + str(needs_review_rows_examined_since_cutover) ^0
"of them have been looked at since the old store was decommissioned." ^0
```

## Python (deterministic transpilation)

```python
source_rows = 41800000
rows_migrated = 41246000
rows_routed_to_needs_review = 554000
rows_with_a_null_in_a_now_required_column = 318000
rows_with_a_foreign_key_that_has_no_parent = 173000
rows_dated_before_the_target_allows = 63000
months_of_work = 11
batches_checksummed_on_both_sides = 8360
days_of_dual_write = 45
rollback_rehearsals = 4
needs_review_rows_examined_since_cutover = 0
rows_the_report_counted = source_rows - rows_routed_to_needs_review
rows_refused_for_a_shape_reason = rows_with_a_null_in_a_now_required_column + rows_with_a_foreign_key_that_has_no_parent
rows_refused_in_total = rows_refused_for_a_shape_reason + rows_dated_before_the_target_allows
completeness_as_reported_myriad = int(rows_migrated * 10000 / rows_the_report_counted)
completeness_against_source_myriad = int(rows_migrated * 10000 / source_rows)
the_distance_between_them_myriad = completeness_as_reported_myriad - completeness_against_source_myriad
print("source rows                     : " + str(source_rows))
print("  migrated                      : " + str(rows_migrated))
print("  routed to needs_review        : " + str(rows_routed_to_needs_review))
print("  the report's denominator      : " + str(rows_the_report_counted))
print("")
print("completeness, as reported       : " + str(completeness_as_reported_myriad) + " per ten thousand")
print("completeness, against source    : " + str(completeness_against_source_myriad) + " per ten thousand")
print("  distance between them         : " + str(the_distance_between_them_myriad) + " per ten thousand")
print("")
print("rows refused in total           : " + str(rows_refused_in_total))
print("  null in a now-required column : " + str(rows_with_a_null_in_a_now_required_column))
print("  foreign key with no parent    : " + str(rows_with_a_foreign_key_that_has_no_parent))
print("  dated before the target allows: " + str(rows_dated_before_the_target_allows))
print("")
print("months of work                  : " + str(months_of_work))
print("batches checksummed both sides  : " + str(batches_checksummed_on_both_sides))
print("days of dual write              : " + str(days_of_dual_write))
print("rollback rehearsals             : " + str(rollback_rehearsals))
print("needs_review rows examined since: " + str(needs_review_rows_examined_since_cutover))
print("")
print("the migration")
print("  per batch : a checksum on both sides, not a count,")
print("    " + str(batches_checksummed_on_both_sides) + " times")
print("  dual write : " + str(days_of_dual_write) + " days, with the two stores compared row")
print("    by row throughout")
print("  rollback : rehearsed " + str(rollback_rehearsals) + " times against a restored copy of")
print("    production")
print("  cutover : after a week of the new store serving reads")
print("    with the old one still authoritative")
print("  verdict : COMPLETE")
print("")
print("  checksumming each batch rather than counting it is the")
print("  part almost nobody does, and it is why no migrated row")
print("  is in doubt")
print("")
print("the two ways to divide")
print("  rows the report counted : " + str(rows_the_report_counted) + ", which is the source")
print("    minus the rows the target refused")
print("  rows migrated : " + str(rows_migrated))
print("  so the reported figure : " + str(completeness_as_reported_myriad) + " per ten thousand")
print("  could it have been lower : only if a row that passed")
print("    the target's constraints had been left behind, and")
print("    the checksums say none was")
print("  against the source instead : " + str(completeness_against_source_myriad) + " per ten thousand")
print("")
print("  a refused row leaves the denominator at the moment it")
print("  becomes the kind of row that would have lowered it")
print("")
print("needs_review")
print("  rows : " + str(rows_routed_to_needs_review))
print("  are they lost : no; they are in a table, in the new")
print("    store, with their original values")
print("  is anything reading them : " + str(needs_review_rows_examined_since_cutover) + " rows examined since")
print("    cutover")
print("  does the old store still exist : no; it was")
print("    decommissioned when the report was accepted")
print("  what a customer whose row is there sees : an account")
print("    that predates the change and no longer resolves")
print("")
nc_denominator_rows = 41800000
nc_rows_migrated = 41246000
nc_rows_with_an_owner = 554000
print("null control - divide by the source, give the table an owner")
print("  batches checksummed : " + str(batches_checksummed_on_both_sides) + ", unchanged")
print("  denominator : " + str(nc_denominator_rows))
print("  rows migrated : " + str(nc_rows_migrated))
print("  completeness : " + str(completeness_against_source_myriad) + " per ten thousand")
print("  rows with somebody responsible for them : " + str(nc_rows_with_an_owner))
print("  no row moved; the total it was compared against")
print("  stopped being defined by what moved")
print("")
print("what a complete migration guarantees")
print("  every row the target would accept is in the target :")
print("    exactly, checksummed per batch, " + str(days_of_dual_write) + " days of dual")
print("    write, " + str(rollback_rehearsals) + " rehearsals")
print("  every row is in the target : not addressed; a row the")
print("    target refused was removed from the total before the")
print("    division")
print("")
print("a completion figure whose denominator excludes the")
print("failures reaches one hundred percent as a matter of")
print("arithmetic; the rows that were left are in a table nobody")
print("divides by")
print("")
print("Every batch was checksummed on both sides, the application dual-wrote for " + str(days_of_dual_write))
print("days with row-by-row comparison, and the rollback was rehearsed " + str(rollback_rehearsals) + " times. Rows the")
print("target refused were routed out of the denominator, so completeness reads " + str(completeness_as_reported_myriad))
print("per ten thousand against " + str(completeness_against_source_myriad) + " over the source - " + str(rows_routed_to_needs_review) + " rows apart - and " + str(needs_review_rows_examined_since_cutover))
print("of them have been looked at since the old store was decommissioned.")
```

## stdout (executed)

```text
source rows                     : 41800000
  migrated                      : 41246000
  routed to needs_review        : 554000
  the report's denominator      : 41246000

completeness, as reported       : 10000 per ten thousand
completeness, against source    : 9867 per ten thousand
  distance between them         : 133 per ten thousand

rows refused in total           : 554000
  null in a now-required column : 318000
  foreign key with no parent    : 173000
  dated before the target allows: 63000

months of work                  : 11
batches checksummed both sides  : 8360
days of dual write              : 45
rollback rehearsals             : 4
needs_review rows examined since: 0

the migration
  per batch : a checksum on both sides, not a count,
    8360 times
  dual write : 45 days, with the two stores compared row
    by row throughout
  rollback : rehearsed 4 times against a restored copy of
    production
  cutover : after a week of the new store serving reads
    with the old one still authoritative
  verdict : COMPLETE

  checksumming each batch rather than counting it is the
  part almost nobody does, and it is why no migrated row
  is in doubt

the two ways to divide
  rows the report counted : 41246000, which is the source
    minus the rows the target refused
  rows migrated : 41246000
  so the reported figure : 10000 per ten thousand
  could it have been lower : only if a row that passed
    the target's constraints had been left behind, and
    the checksums say none was
  against the source instead : 9867 per ten thousand

  a refused row leaves the denominator at the moment it
  becomes the kind of row that would have lowered it

needs_review
  rows : 554000
  are they lost : no; they are in a table, in the new
    store, with their original values
  is anything reading them : 0 rows examined since
    cutover
  does the old store still exist : no; it was
    decommissioned when the report was accepted
  what a customer whose row is there sees : an account
    that predates the change and no longer resolves

null control - divide by the source, give the table an owner
  batches checksummed : 8360, unchanged
  denominator : 41800000
  rows migrated : 41246000
  completeness : 9867 per ten thousand
  rows with somebody responsible for them : 554000
  no row moved; the total it was compared against
  stopped being defined by what moved

what a complete migration guarantees
  every row the target would accept is in the target :
    exactly, checksummed per batch, 45 days of dual
    write, 4 rehearsals
  every row is in the target : not addressed; a row the
    target refused was removed from the total before the
    division

a completion figure whose denominator excludes the
failures reaches one hundred percent as a matter of
arithmetic; the rows that were left are in a table nobody
divides by

Every batch was checksummed on both sides, the application dual-wrote for 45
days with row-by-row comparison, and the rollback was rehearsed 4 times. Rows the
target refused were routed out of the denominator, so completeness reads 10000
per ten thousand against 9867 over the source - 554000 rows apart - and 0
of them have been looked at since the old store was decommissioned.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
