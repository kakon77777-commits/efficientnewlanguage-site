<!-- canonical: efficientnewlanguage.org/ai/examples/707-the-index-was-unique-and-the-writes-were-in-two-regions | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 707 — The index was unique and the writes were in two regions

`the_index_was_unique_and_the_writes_were_in_two_regions.eml` - Uniqueness is a database constraint rather than an application check, and it has rejected every duplicate it saw. Where it is evaluated is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Uniqueness is a
# database constraint rather than an application check, and it has rejected
# every duplicate it saw. Where it is evaluated is computed below.
#
# Choosing the constraint over a read-then-write check was right and it is not
# a small difference. An application that selects and then inserts has a window
# between the two; the index has none, the database refuses the second write
# inside the same transaction that attempts it, and the caller gets a conflict
# it can act on. It has rejected two thousand one hundred duplicate signups
# this year, each one synchronously, each one visible to the person signing up.
#
# An index is a structure inside one database. Two regions run two writable
# primaries with asynchronous replication, so there are two indexes, and a
# uniqueness check is a statement about the rows one node can see.
#
# Replication lag at the ninety-ninth percentile is three hundred forty ms.

2 => regions_with_a_writable_primary
2 => unique_indexes
0 => unique_indexes_spanning_both_regions
2100 => duplicate_signups_the_constraint_rejected_this_year
0 => duplicates_from_a_read_then_write_race
340 => replication_lag_p99_ms
74000 => signups_per_day
61 => signups_whose_duplicate_lands_in_the_other_region_first
14900 => rows_accumulated_in_the_conflict_table
0 => alerts_on_the_conflict_table

signups_per_day - signups_whose_duplicate_lands_in_the_other_region_first => signups_the_constraint_can_decide
int(signups_whose_duplicate_lands_in_the_other_region_first * 10000 / signups_per_day) => undecidable_per_myriad

"regions with a writable primary : " + str(regions_with_a_writable_primary) ^0
"unique indexes                  : " + str(unique_indexes) ^0
"  spanning both regions         : " + str(unique_indexes_spanning_both_regions) ^0
"replication lag p99, ms         : " + str(replication_lag_p99_ms) ^0
"" ^0
"duplicates rejected this year   : " + str(duplicate_signups_the_constraint_rejected_this_year) ^0
"duplicates from a read-then-write race : " + str(duplicates_from_a_read_then_write_race) ^0
"" ^0
"signups per day                 : " + str(signups_per_day) ^0
"  the constraint can decide     : " + str(signups_the_constraint_can_decide) ^0
"  duplicate lands elsewhere first : " + str(signups_whose_duplicate_lands_in_the_other_region_first) ^0
"  share                         : " + str(undecidable_per_myriad) + " per ten thousand" ^0
"rows in the conflict table      : " + str(rows_accumulated_in_the_conflict_table) ^0
"alerts on it                    : " + str(alerts_on_the_conflict_table) ^0
"" ^0

# ---- what the constraint verified ----

"the unique index" ^0
"  enforced by  : the database, in the write transaction" ^0
"  window between check and write : none" ^0
"  what the caller gets : a conflict, synchronously" ^0
"  duplicates rejected this year : " + str(duplicate_signups_the_constraint_rejected_this_year) ^0
"  duplicates from a read-then-write race : " + str(duplicates_from_a_read_then_write_race) ^0
"  verdict : UNIQUE" ^0
"" ^0
"  the constraint is strictly stronger than the check it" ^0
"  replaced and the difference is the window it removed" ^0
"" ^0

# ---- what an index can see ----

"the evaluation" ^0
"  where it happens : inside one primary" ^0
"  the rows it compares against : the rows that primary has" ^0
"  rows written to the other primary " + str(replication_lag_p99_ms) + " ms ago : not yet" ^0
"    among them" ^0
"  indexes that span both : " + str(unique_indexes_spanning_both_regions) ^0
"  is that a defect in the index : no; an index is a" ^0
"    structure in a database, and there are two databases" ^0
"" ^0
"  each index is correct over its own rows and the property" ^0
"  the product needs is over the union" ^0
"" ^0
# ---- the two failures are different objects ----

# A rejected duplicate is a conflict returned to a person who can pick another
# address. A cross-region collision is a row appended to a conflict table by
# the replication stream, hours later, with nobody attached to it.
"the two outcomes compared" ^0
"  same region : refused in the transaction, the caller is" ^0
"    told, the caller retries with something else" ^0
"  across regions : both writes succeed, both are durable," ^0
"    replication notices later" ^0
"  where the second is recorded : the conflict table" ^0
"  rows there now : " + str(rows_accumulated_in_the_conflict_table) ^0
"  alerts on it   : " + str(alerts_on_the_conflict_table) ^0
"  who is told    : nobody; the writes already returned 201" ^0
"" ^0

# ---- why the metric looks perfect ----

# The dashboard counts constraint violations, and a constraint violation is
# exactly the event that does not happen here. Both writes are valid.
"what the dashboard counts" ^0
"  constraint violations : the successful rejections" ^0
"  and those are         : the system working" ^0
"  cross-region collisions : not violations of any index," ^0
"    because no index saw both rows" ^0
"  a query that would find them : one that groups the union" ^0
"    of both regions, which no job runs" ^0
"" ^0

# ---- null control ----

# The same index, with the key routed: an address hashes to one region, which
# owns every write for it, so both writes reach the same primary.
0 => nc_signups_whose_duplicate_lands_in_the_other_region_first
duplicate_signups_the_constraint_rejected_this_year => nc_duplicates_rejected_synchronously

"null control - the key routes to one owning region" ^0
"  regions with a writable primary : " + str(regions_with_a_writable_primary) + ", unchanged" ^0
"  duplicates rejected synchronously : " + str(nc_duplicates_rejected_synchronously) ^0
"  duplicates landing in two regions : " + str(nc_signups_whose_duplicate_lands_in_the_other_region_first) ^0
"  the index did not get stronger; both writes started" ^0
"  arriving where the index could compare them" ^0
"" ^0

# ---- the rule ----

"what a unique index guarantees" ^0
"  no two rows in this database share the key : exactly," ^0
"    with no window, enforced by the storage engine" ^0
"  no two rows exist with this key            : not" ^0
"    addressed; the guarantee is scoped to the rows one" ^0
"    node holds, and the deployment has two" ^0
"" ^0
"a constraint is enforced over the set the enforcing node can" ^0
"see; replicating that node replicates the constraint and not" ^0
"the set, so the strongest local guarantee available says" ^0
"nothing about the pair that matters" ^0
"" ^0

"Uniqueness is enforced by the database rather than by application code, with no" ^0
"window between check and write, rejecting " + str(duplicate_signups_the_constraint_rejected_this_year) + " duplicates this year, each one" ^0
"synchronously. There are " + str(unique_indexes) + " indexes and " + str(unique_indexes_spanning_both_regions) + " spanning both regions, so of " + str(signups_per_day) ^0
"signups a day the " + str(signups_whose_duplicate_lands_in_the_other_region_first) + " whose duplicate reaches the other primary within the " + str(replication_lag_p99_ms) + " ms" ^0
"lag - " + str(undecidable_per_myriad) + " per ten thousand - both succeed, into a conflict table with " + str(rows_accumulated_in_the_conflict_table) + " rows" ^0
"and " + str(alerts_on_the_conflict_table) + " alerts." ^0
```

## Python (deterministic transpilation)

```python
regions_with_a_writable_primary = 2
unique_indexes = 2
unique_indexes_spanning_both_regions = 0
duplicate_signups_the_constraint_rejected_this_year = 2100
duplicates_from_a_read_then_write_race = 0
replication_lag_p99_ms = 340
signups_per_day = 74000
signups_whose_duplicate_lands_in_the_other_region_first = 61
rows_accumulated_in_the_conflict_table = 14900
alerts_on_the_conflict_table = 0
signups_the_constraint_can_decide = signups_per_day - signups_whose_duplicate_lands_in_the_other_region_first
undecidable_per_myriad = int(signups_whose_duplicate_lands_in_the_other_region_first * 10000 / signups_per_day)
print("regions with a writable primary : " + str(regions_with_a_writable_primary))
print("unique indexes                  : " + str(unique_indexes))
print("  spanning both regions         : " + str(unique_indexes_spanning_both_regions))
print("replication lag p99, ms         : " + str(replication_lag_p99_ms))
print("")
print("duplicates rejected this year   : " + str(duplicate_signups_the_constraint_rejected_this_year))
print("duplicates from a read-then-write race : " + str(duplicates_from_a_read_then_write_race))
print("")
print("signups per day                 : " + str(signups_per_day))
print("  the constraint can decide     : " + str(signups_the_constraint_can_decide))
print("  duplicate lands elsewhere first : " + str(signups_whose_duplicate_lands_in_the_other_region_first))
print("  share                         : " + str(undecidable_per_myriad) + " per ten thousand")
print("rows in the conflict table      : " + str(rows_accumulated_in_the_conflict_table))
print("alerts on it                    : " + str(alerts_on_the_conflict_table))
print("")
print("the unique index")
print("  enforced by  : the database, in the write transaction")
print("  window between check and write : none")
print("  what the caller gets : a conflict, synchronously")
print("  duplicates rejected this year : " + str(duplicate_signups_the_constraint_rejected_this_year))
print("  duplicates from a read-then-write race : " + str(duplicates_from_a_read_then_write_race))
print("  verdict : UNIQUE")
print("")
print("  the constraint is strictly stronger than the check it")
print("  replaced and the difference is the window it removed")
print("")
print("the evaluation")
print("  where it happens : inside one primary")
print("  the rows it compares against : the rows that primary has")
print("  rows written to the other primary " + str(replication_lag_p99_ms) + " ms ago : not yet")
print("    among them")
print("  indexes that span both : " + str(unique_indexes_spanning_both_regions))
print("  is that a defect in the index : no; an index is a")
print("    structure in a database, and there are two databases")
print("")
print("  each index is correct over its own rows and the property")
print("  the product needs is over the union")
print("")
print("the two outcomes compared")
print("  same region : refused in the transaction, the caller is")
print("    told, the caller retries with something else")
print("  across regions : both writes succeed, both are durable,")
print("    replication notices later")
print("  where the second is recorded : the conflict table")
print("  rows there now : " + str(rows_accumulated_in_the_conflict_table))
print("  alerts on it   : " + str(alerts_on_the_conflict_table))
print("  who is told    : nobody; the writes already returned 201")
print("")
print("what the dashboard counts")
print("  constraint violations : the successful rejections")
print("  and those are         : the system working")
print("  cross-region collisions : not violations of any index,")
print("    because no index saw both rows")
print("  a query that would find them : one that groups the union")
print("    of both regions, which no job runs")
print("")
nc_signups_whose_duplicate_lands_in_the_other_region_first = 0
nc_duplicates_rejected_synchronously = duplicate_signups_the_constraint_rejected_this_year
print("null control - the key routes to one owning region")
print("  regions with a writable primary : " + str(regions_with_a_writable_primary) + ", unchanged")
print("  duplicates rejected synchronously : " + str(nc_duplicates_rejected_synchronously))
print("  duplicates landing in two regions : " + str(nc_signups_whose_duplicate_lands_in_the_other_region_first))
print("  the index did not get stronger; both writes started")
print("  arriving where the index could compare them")
print("")
print("what a unique index guarantees")
print("  no two rows in this database share the key : exactly,")
print("    with no window, enforced by the storage engine")
print("  no two rows exist with this key            : not")
print("    addressed; the guarantee is scoped to the rows one")
print("    node holds, and the deployment has two")
print("")
print("a constraint is enforced over the set the enforcing node can")
print("see; replicating that node replicates the constraint and not")
print("the set, so the strongest local guarantee available says")
print("nothing about the pair that matters")
print("")
print("Uniqueness is enforced by the database rather than by application code, with no")
print("window between check and write, rejecting " + str(duplicate_signups_the_constraint_rejected_this_year) + " duplicates this year, each one")
print("synchronously. There are " + str(unique_indexes) + " indexes and " + str(unique_indexes_spanning_both_regions) + " spanning both regions, so of " + str(signups_per_day))
print("signups a day the " + str(signups_whose_duplicate_lands_in_the_other_region_first) + " whose duplicate reaches the other primary within the " + str(replication_lag_p99_ms) + " ms")
print("lag - " + str(undecidable_per_myriad) + " per ten thousand - both succeed, into a conflict table with " + str(rows_accumulated_in_the_conflict_table) + " rows")
print("and " + str(alerts_on_the_conflict_table) + " alerts.")
```

## stdout (executed)

```text
regions with a writable primary : 2
unique indexes                  : 2
  spanning both regions         : 0
replication lag p99, ms         : 340

duplicates rejected this year   : 2100
duplicates from a read-then-write race : 0

signups per day                 : 74000
  the constraint can decide     : 73939
  duplicate lands elsewhere first : 61
  share                         : 8 per ten thousand
rows in the conflict table      : 14900
alerts on it                    : 0

the unique index
  enforced by  : the database, in the write transaction
  window between check and write : none
  what the caller gets : a conflict, synchronously
  duplicates rejected this year : 2100
  duplicates from a read-then-write race : 0
  verdict : UNIQUE

  the constraint is strictly stronger than the check it
  replaced and the difference is the window it removed

the evaluation
  where it happens : inside one primary
  the rows it compares against : the rows that primary has
  rows written to the other primary 340 ms ago : not yet
    among them
  indexes that span both : 0
  is that a defect in the index : no; an index is a
    structure in a database, and there are two databases

  each index is correct over its own rows and the property
  the product needs is over the union

the two outcomes compared
  same region : refused in the transaction, the caller is
    told, the caller retries with something else
  across regions : both writes succeed, both are durable,
    replication notices later
  where the second is recorded : the conflict table
  rows there now : 14900
  alerts on it   : 0
  who is told    : nobody; the writes already returned 201

what the dashboard counts
  constraint violations : the successful rejections
  and those are         : the system working
  cross-region collisions : not violations of any index,
    because no index saw both rows
  a query that would find them : one that groups the union
    of both regions, which no job runs

null control - the key routes to one owning region
  regions with a writable primary : 2, unchanged
  duplicates rejected synchronously : 2100
  duplicates landing in two regions : 0
  the index did not get stronger; both writes started
  arriving where the index could compare them

what a unique index guarantees
  no two rows in this database share the key : exactly,
    with no window, enforced by the storage engine
  no two rows exist with this key            : not
    addressed; the guarantee is scoped to the rows one
    node holds, and the deployment has two

a constraint is enforced over the set the enforcing node can
see; replicating that node replicates the constraint and not
the set, so the strongest local guarantee available says
nothing about the pair that matters

Uniqueness is enforced by the database rather than by application code, with no
window between check and write, rejecting 2100 duplicates this year, each one
synchronously. There are 2 indexes and 0 spanning both regions, so of 74000
signups a day the 61 whose duplicate reaches the other primary within the 340 ms
lag - 8 per ten thousand - both succeed, into a conflict table with 14900 rows
and 0 alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
