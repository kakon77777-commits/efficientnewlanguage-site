<!-- canonical: efficientnewlanguage.org/ai/examples/841-the-filter-was-not-equal-and-the-nulls-vanished | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 841 — The filter was not equal and the nulls vanished

`the_filter_was_not_equal_and_the_nulls_vanished.eml` - The query for rows that are not closed returns exactly the rows whose status differs from 'closed', and the SQL is correct. What a NULL status does to that test is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The query for rows
# that are not closed returns exactly the rows whose status differs from
# 'closed', and the SQL is correct. What a NULL status does to that test is
# computed below.
#
# The query is careful. It filters on the real status column; it uses the
# database's own comparison, not a string it built; it runs over every row; and
# 'not closed' is exactly what the ticket-triage report asks for.
#
# status <> 'closed' is UNKNOWN when status IS NULL, and UNKNOWN is not TRUE, so
# those rows are excluded.

40000 => rows
26000 => rows_status_active
9000 => rows_status_closed
5000 => rows_status_null

rows_status_active + rows_status_null => rows_that_are_not_closed
rows_status_active => rows_the_query_returned
rows_that_are_not_closed - rows_the_query_returned => rows_silently_dropped
int(rows_silently_dropped * 10000 / rows_that_are_not_closed) => dropped_share_per_myriad

"rows                            : " + str(rows) ^0
"  status = active               : " + str(rows_status_active) ^0
"  status = closed               : " + str(rows_status_closed) ^0
"  status IS NULL                : " + str(rows_status_null) ^0
"" ^0
"rows that are not closed        : " + str(rows_that_are_not_closed) ^0
"rows the query returned         : " + str(rows_the_query_returned) ^0
"  silently dropped              : " + str(rows_silently_dropped) ^0
"dropped share                   : " + str(dropped_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the query verified ----

"the not-closed query" ^0
"  filters on : the real status column" ^0
"  comparison : the database's own, not a built string" ^0
"  over : every row" ^0
"  what triage asked for : the rows that are not closed" ^0
"  rows returned : " + str(rows_the_query_returned) + ", every one status = active" ^0
"  verdict : NOT CLOSED" ^0
"" ^0
"  using the engine's comparison rather than a hand-built" ^0
"  predicate is the part done right here, and it is why no" ^0
"  active row is missed" ^0
"" ^0

# ---- what happens to a NULL ----

"status <> 'closed' on a NULL status" ^0
"  what the comparison yields : UNKNOWN, not TRUE" ^0
"  what WHERE keeps : rows where the predicate is TRUE" ^0
"  so a NULL-status row : is neither closed nor kept" ^0
"  rows with no status : " + str(rows_status_null) ^0
"  a three-valued logic : where 'not closed' excludes" ^0
"    'unknown whether closed'" ^0
"" ^0

# ---- what triage never saw ----

"the tickets with no status set" ^0
"  count : " + str(rows_status_null) ^0
"  are they closed : no" ^0
"  did the not-closed report include them : no" ^0
"  is the query wrong : no; it is exactly status <> 'closed'" ^0
"  is 'status <> closed' the same as 'not closed' : not" ^0
"    when the status can be NULL" ^0
"" ^0

# ---- null control ----

# The same rows, with the filter written status IS DISTINCT FROM 'closed' (or
# status <> 'closed' OR status IS NULL) so a NULL counts as not-closed.
26000 => nc_returned_with_plain_not_equal
31000 => nc_returned_with_null_safe_predicate
5000 => nc_rows_it_recovers

"null control - a null-safe not-closed predicate" ^0
"  returned, plain <> 'closed' : " + str(nc_returned_with_plain_not_equal) ^0
"  returned, null-safe : " + str(nc_returned_with_null_safe_predicate) ^0
"  rows it recovers : " + str(nc_rows_it_recovers) ^0
"  no row and no status changed; the predicate stopped" ^0
"  treating an unknown status as a failed comparison" ^0
"" ^0

# ---- the rule ----

"what status <> 'closed' guarantees" ^0
"  every returned row has a status that is not closed :" ^0
"    exactly, the engine's own comparison" ^0
"  every row that is not closed is returned : not" ^0
"    addressed; status <> 'closed' is UNKNOWN for a NULL" ^0
"    status, and UNKNOWN is not TRUE, so the " + str(rows_status_null) + " rows with" ^0
"    no status are dropped from a query that asked for 'not" ^0
"    closed'" ^0
"" ^0

"a comparison against NULL is neither true nor false but unknown, and a WHERE" ^0
"keeps only the true; 'not equal to closed' and 'not closed' diverge exactly on" ^0
"the rows whose status is not known to be anything" ^0
"" ^0

"It filters on the real column with the engine's comparison over every row - the" ^0
"returned rows are exactly status <> 'closed'. That excludes the " + str(rows_status_null) + " NULL-status" ^0
"rows, which are not closed either, so a 'not closed' report dropped " + str(rows_silently_dropped) + " of" ^0
"" + str(rows_that_are_not_closed) + ", " + str(dropped_share_per_myriad) + " per ten thousand." ^0
```

## Python (deterministic transpilation)

```python
rows = 40000
rows_status_active = 26000
rows_status_closed = 9000
rows_status_null = 5000
rows_that_are_not_closed = rows_status_active + rows_status_null
rows_the_query_returned = rows_status_active
rows_silently_dropped = rows_that_are_not_closed - rows_the_query_returned
dropped_share_per_myriad = int(rows_silently_dropped * 10000 / rows_that_are_not_closed)
print("rows                            : " + str(rows))
print("  status = active               : " + str(rows_status_active))
print("  status = closed               : " + str(rows_status_closed))
print("  status IS NULL                : " + str(rows_status_null))
print("")
print("rows that are not closed        : " + str(rows_that_are_not_closed))
print("rows the query returned         : " + str(rows_the_query_returned))
print("  silently dropped              : " + str(rows_silently_dropped))
print("dropped share                   : " + str(dropped_share_per_myriad) + " per ten thousand")
print("")
print("the not-closed query")
print("  filters on : the real status column")
print("  comparison : the database's own, not a built string")
print("  over : every row")
print("  what triage asked for : the rows that are not closed")
print("  rows returned : " + str(rows_the_query_returned) + ", every one status = active")
print("  verdict : NOT CLOSED")
print("")
print("  using the engine's comparison rather than a hand-built")
print("  predicate is the part done right here, and it is why no")
print("  active row is missed")
print("")
print("status <> 'closed' on a NULL status")
print("  what the comparison yields : UNKNOWN, not TRUE")
print("  what WHERE keeps : rows where the predicate is TRUE")
print("  so a NULL-status row : is neither closed nor kept")
print("  rows with no status : " + str(rows_status_null))
print("  a three-valued logic : where 'not closed' excludes")
print("    'unknown whether closed'")
print("")
print("the tickets with no status set")
print("  count : " + str(rows_status_null))
print("  are they closed : no")
print("  did the not-closed report include them : no")
print("  is the query wrong : no; it is exactly status <> 'closed'")
print("  is 'status <> closed' the same as 'not closed' : not")
print("    when the status can be NULL")
print("")
nc_returned_with_plain_not_equal = 26000
nc_returned_with_null_safe_predicate = 31000
nc_rows_it_recovers = 5000
print("null control - a null-safe not-closed predicate")
print("  returned, plain <> 'closed' : " + str(nc_returned_with_plain_not_equal))
print("  returned, null-safe : " + str(nc_returned_with_null_safe_predicate))
print("  rows it recovers : " + str(nc_rows_it_recovers))
print("  no row and no status changed; the predicate stopped")
print("  treating an unknown status as a failed comparison")
print("")
print("what status <> 'closed' guarantees")
print("  every returned row has a status that is not closed :")
print("    exactly, the engine's own comparison")
print("  every row that is not closed is returned : not")
print("    addressed; status <> 'closed' is UNKNOWN for a NULL")
print("    status, and UNKNOWN is not TRUE, so the " + str(rows_status_null) + " rows with")
print("    no status are dropped from a query that asked for 'not")
print("    closed'")
print("")
print("a comparison against NULL is neither true nor false but unknown, and a WHERE")
print("keeps only the true; 'not equal to closed' and 'not closed' diverge exactly on")
print("the rows whose status is not known to be anything")
print("")
print("It filters on the real column with the engine's comparison over every row - the")
print("returned rows are exactly status <> 'closed'. That excludes the " + str(rows_status_null) + " NULL-status")
print("rows, which are not closed either, so a 'not closed' report dropped " + str(rows_silently_dropped) + " of")
print("" + str(rows_that_are_not_closed) + ", " + str(dropped_share_per_myriad) + " per ten thousand.")
```

## stdout (executed)

```text
rows                            : 40000
  status = active               : 26000
  status = closed               : 9000
  status IS NULL                : 5000

rows that are not closed        : 31000
rows the query returned         : 26000
  silently dropped              : 5000
dropped share                   : 1612 per ten thousand

the not-closed query
  filters on : the real status column
  comparison : the database's own, not a built string
  over : every row
  what triage asked for : the rows that are not closed
  rows returned : 26000, every one status = active
  verdict : NOT CLOSED

  using the engine's comparison rather than a hand-built
  predicate is the part done right here, and it is why no
  active row is missed

status <> 'closed' on a NULL status
  what the comparison yields : UNKNOWN, not TRUE
  what WHERE keeps : rows where the predicate is TRUE
  so a NULL-status row : is neither closed nor kept
  rows with no status : 5000
  a three-valued logic : where 'not closed' excludes
    'unknown whether closed'

the tickets with no status set
  count : 5000
  are they closed : no
  did the not-closed report include them : no
  is the query wrong : no; it is exactly status <> 'closed'
  is 'status <> closed' the same as 'not closed' : not
    when the status can be NULL

null control - a null-safe not-closed predicate
  returned, plain <> 'closed' : 26000
  returned, null-safe : 31000
  rows it recovers : 5000
  no row and no status changed; the predicate stopped
  treating an unknown status as a failed comparison

what status <> 'closed' guarantees
  every returned row has a status that is not closed :
    exactly, the engine's own comparison
  every row that is not closed is returned : not
    addressed; status <> 'closed' is UNKNOWN for a NULL
    status, and UNKNOWN is not TRUE, so the 5000 rows with
    no status are dropped from a query that asked for 'not
    closed'

a comparison against NULL is neither true nor false but unknown, and a WHERE
keeps only the true; 'not equal to closed' and 'not closed' diverge exactly on
the rows whose status is not known to be anything

It filters on the real column with the engine's comparison over every row - the
returned rows are exactly status <> 'closed'. That excludes the 5000 NULL-status
rows, which are not closed either, so a 'not closed' report dropped 5000 of
31000, 1612 per ten thousand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
