<!-- canonical: efficientnewlanguage.org/ai/examples/602-the-column-was-indexed-and-the-query-cast-it-first | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 602 — The column was indexed and the query cast it first

`the_column_was_indexed_and_the_query_cast_it_first.eml` - A lookup column is indexed, the index is healthy, and the query filters on exactly that column. The query reads the whole table. What the index can be used for is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A lookup column
# is indexed, the index is healthy, and the query filters on exactly that
# column. The query reads the whole table. What the index can be used for is
# computed below.
#
# The index is right and it was added for this query. The column is highly
# selective, the index is small enough to stay resident, it has no bloat, its
# statistics are current, and the planner is doing exactly what a planner
# should. Nobody made a mistake choosing it.
#
# An index orders the values of a column. A predicate that applies a function
# to the column asks about the values of that function, and no ordering of the
# inputs is an ordering of the outputs.
#
# The column here is a bigint and the parameter arrives as text. The comparison
# needs one type, so one side is converted, and the side that gets converted is
# the one the planner cannot leave alone.

48000000 => table_rows
900 => queries_per_hour
1200000 => writes_per_day
1 => rows_matching

"table rows            : " + str(table_rows) ^0
"queries per hour      : " + str(queries_per_hour) ^0
"rows matching a query : " + str(rows_matching) ^0
"" ^0

# ---- the index, on its own terms ----

"the index" ^0
"  exists              : yes" ^0
"  on the filtered column : yes" ^0
"  bloat               : none" ^0
"  statistics          : current" ^0
"  selectivity         : " + str(rows_matching) + " row in " + str(table_rows) ^0
"  health checks failing : 0" ^0
"" ^0

# ---- the plan ----

table_rows => rows_read_per_query
queries_per_hour * rows_read_per_query => rows_read_per_hour

"the plan chosen" ^0
"  access method      : sequential scan" ^0
"  index used         : no" ^0
"  rows read per query : " + str(rows_read_per_query) ^0
"  rows returned      : " + str(rows_matching) ^0
"  rows read per hour : " + str(rows_read_per_hour) ^0
"" ^0
int(rows_read_per_query / rows_matching) => waste_ratio
"  rows read per row returned : " + str(waste_ratio) ^0
"" ^0

# ---- the predicate, both sides ----

"what the comparison actually asks" ^0
"  written    : the column equals the parameter" ^0
"  column type: bigint" ^0
"  parameter  : text" ^0
"  resolved   : text(column) equals the parameter" ^0
"" ^0
"  the index orders the column" ^0
"  the predicate orders text(column)" ^0
"  and text of a bigint does not sort like the bigint:" ^0
"  100 sorts before 99, and 1000 before 2" ^0
"" ^0
"  so the planner is not declining to use the index," ^0
"  it is answering that no index on this table can serve" ^0
"  that predicate, which is true" ^0
"" ^0

# ---- what the index still costs ----

writes_per_day => index_updates_per_day

"the index is not used by this query and is still maintained" ^0
"  writes per day        : " + str(writes_per_day) ^0
"  index updates per day : " + str(index_updates_per_day) ^0
"  pages kept resident   : yes" ^0
"  benefit to this query : none" ^0
"" ^0
"  the cost side of the index is unconditional" ^0
"  the benefit side is conditional on a predicate shape" ^0
"" ^0

# ---- what each dashboard says ----

"where this would show up" ^0
"  index health check    : green, the index is fine" ^0
"  missing index advisor : silent, the index exists" ^0
"  slow query log        : the query, with no reason attached" ^0
"  unused index report   : this index, flagged as unused" ^0
"" ^0
"  the last two are the same fact seen from two ends," ^0
"  and they are on different dashboards owned by different people" ^0
"" ^0

# ---- the cost, per hour ----

"hour   queries   rows read       returned" ^0
0 => running
for h in [1:4]:
    running + rows_read_per_hour => running
    "  " + str(h) + "      " + str(queries_per_hour) + "       " + str(running) + "   " + str(h * queries_per_hour * rows_matching) ^0
"" ^0

# ---- the control ----
#
# The index, against a query that compares the column to a bigint. Same index,
# same table, same planner, same statistics.

"control - the same index with a matching parameter type" ^0
"  access method       : index scan" ^0
"  rows read per query : " + str(rows_matching) ^0
"  rows returned       : " + str(rows_matching) ^0
"  rows read per hour  : " + str(queries_per_hour * rows_matching) ^0
"  defects in the index : 0" ^0
"" ^0
"  the index was correct the whole time and is doing here" ^0
"  exactly what it was added to do" ^0
"" ^0

# ---- the null control ----
#
# The same cast on a table small enough that a scan is the right plan anyway.
# The predicate is identical, the index is still unusable, and nothing is lost,
# because there was nothing for the index to save.

400 => nc_table_rows

"null control - the identical predicate on a " + str(nc_table_rows) + " row table" ^0
"  index used     : no, same reason" ^0
"  rows read      : " + str(nc_table_rows) ^0
"  rows returned  : " + str(rows_matching) ^0
"  plan the planner would choose anyway : sequential scan" ^0
"  cost of the cast : none" ^0
"  the defect is unchanged; what changed is what it was hiding" ^0
"" ^0

# ---- the rule ----

"what an index being present is evidence of" ^0
"  the column has an ordered structure : yes" ^0
"  a predicate on that column can use it : only if the predicate" ^0
"    compares the column itself" ^0
"  and a type mismatch inserts a function without appearing in" ^0
"  the query text at all" ^0
"" ^0
"the thing to read is not the index list, it is the plan:" ^0
"rows read against rows returned, which here is " + str(waste_ratio) + " to 1" ^0
"" ^0

"The index is healthy, current, selective to " + str(rows_matching) + " row in " + str(table_rows) + ", and was added" ^0
"for this query. Because the parameter arrives as text the comparison becomes" ^0
"one about text of the column, which no index on this table orders, so each of" ^0
"the " + str(queries_per_hour) + " queries an hour reads " + str(rows_read_per_query) + " rows to return " + str(rows_matching) + " - " + str(waste_ratio) + " to 1 -" ^0
"while the index is still updated on all " + str(index_updates_per_day) + " writes a day." ^0
```

## Python (deterministic transpilation)

```python
table_rows = 48000000
queries_per_hour = 900
writes_per_day = 1200000
rows_matching = 1
print("table rows            : " + str(table_rows))
print("queries per hour      : " + str(queries_per_hour))
print("rows matching a query : " + str(rows_matching))
print("")
print("the index")
print("  exists              : yes")
print("  on the filtered column : yes")
print("  bloat               : none")
print("  statistics          : current")
print("  selectivity         : " + str(rows_matching) + " row in " + str(table_rows))
print("  health checks failing : 0")
print("")
rows_read_per_query = table_rows
rows_read_per_hour = queries_per_hour * rows_read_per_query
print("the plan chosen")
print("  access method      : sequential scan")
print("  index used         : no")
print("  rows read per query : " + str(rows_read_per_query))
print("  rows returned      : " + str(rows_matching))
print("  rows read per hour : " + str(rows_read_per_hour))
print("")
waste_ratio = int(rows_read_per_query / rows_matching)
print("  rows read per row returned : " + str(waste_ratio))
print("")
print("what the comparison actually asks")
print("  written    : the column equals the parameter")
print("  column type: bigint")
print("  parameter  : text")
print("  resolved   : text(column) equals the parameter")
print("")
print("  the index orders the column")
print("  the predicate orders text(column)")
print("  and text of a bigint does not sort like the bigint:")
print("  100 sorts before 99, and 1000 before 2")
print("")
print("  so the planner is not declining to use the index,")
print("  it is answering that no index on this table can serve")
print("  that predicate, which is true")
print("")
index_updates_per_day = writes_per_day
print("the index is not used by this query and is still maintained")
print("  writes per day        : " + str(writes_per_day))
print("  index updates per day : " + str(index_updates_per_day))
print("  pages kept resident   : yes")
print("  benefit to this query : none")
print("")
print("  the cost side of the index is unconditional")
print("  the benefit side is conditional on a predicate shape")
print("")
print("where this would show up")
print("  index health check    : green, the index is fine")
print("  missing index advisor : silent, the index exists")
print("  slow query log        : the query, with no reason attached")
print("  unused index report   : this index, flagged as unused")
print("")
print("  the last two are the same fact seen from two ends,")
print("  and they are on different dashboards owned by different people")
print("")
print("hour   queries   rows read       returned")
running = 0
for h in range(1, 5):
    running = running + rows_read_per_hour
    print("  " + str(h) + "      " + str(queries_per_hour) + "       " + str(running) + "   " + str(h * queries_per_hour * rows_matching))
print("")
print("control - the same index with a matching parameter type")
print("  access method       : index scan")
print("  rows read per query : " + str(rows_matching))
print("  rows returned       : " + str(rows_matching))
print("  rows read per hour  : " + str(queries_per_hour * rows_matching))
print("  defects in the index : 0")
print("")
print("  the index was correct the whole time and is doing here")
print("  exactly what it was added to do")
print("")
nc_table_rows = 400
print("null control - the identical predicate on a " + str(nc_table_rows) + " row table")
print("  index used     : no, same reason")
print("  rows read      : " + str(nc_table_rows))
print("  rows returned  : " + str(rows_matching))
print("  plan the planner would choose anyway : sequential scan")
print("  cost of the cast : none")
print("  the defect is unchanged; what changed is what it was hiding")
print("")
print("what an index being present is evidence of")
print("  the column has an ordered structure : yes")
print("  a predicate on that column can use it : only if the predicate")
print("    compares the column itself")
print("  and a type mismatch inserts a function without appearing in")
print("  the query text at all")
print("")
print("the thing to read is not the index list, it is the plan:")
print("rows read against rows returned, which here is " + str(waste_ratio) + " to 1")
print("")
print("The index is healthy, current, selective to " + str(rows_matching) + " row in " + str(table_rows) + ", and was added")
print("for this query. Because the parameter arrives as text the comparison becomes")
print("one about text of the column, which no index on this table orders, so each of")
print("the " + str(queries_per_hour) + " queries an hour reads " + str(rows_read_per_query) + " rows to return " + str(rows_matching) + " - " + str(waste_ratio) + " to 1 -")
print("while the index is still updated on all " + str(index_updates_per_day) + " writes a day.")
```

## stdout (executed)

```text
table rows            : 48000000
queries per hour      : 900
rows matching a query : 1

the index
  exists              : yes
  on the filtered column : yes
  bloat               : none
  statistics          : current
  selectivity         : 1 row in 48000000
  health checks failing : 0

the plan chosen
  access method      : sequential scan
  index used         : no
  rows read per query : 48000000
  rows returned      : 1
  rows read per hour : 43200000000

  rows read per row returned : 48000000

what the comparison actually asks
  written    : the column equals the parameter
  column type: bigint
  parameter  : text
  resolved   : text(column) equals the parameter

  the index orders the column
  the predicate orders text(column)
  and text of a bigint does not sort like the bigint:
  100 sorts before 99, and 1000 before 2

  so the planner is not declining to use the index,
  it is answering that no index on this table can serve
  that predicate, which is true

the index is not used by this query and is still maintained
  writes per day        : 1200000
  index updates per day : 1200000
  pages kept resident   : yes
  benefit to this query : none

  the cost side of the index is unconditional
  the benefit side is conditional on a predicate shape

where this would show up
  index health check    : green, the index is fine
  missing index advisor : silent, the index exists
  slow query log        : the query, with no reason attached
  unused index report   : this index, flagged as unused

  the last two are the same fact seen from two ends,
  and they are on different dashboards owned by different people

hour   queries   rows read       returned
  1      900       43200000000   900
  2      900       86400000000   1800
  3      900       129600000000   2700
  4      900       172800000000   3600

control - the same index with a matching parameter type
  access method       : index scan
  rows read per query : 1
  rows returned       : 1
  rows read per hour  : 900
  defects in the index : 0

  the index was correct the whole time and is doing here
  exactly what it was added to do

null control - the identical predicate on a 400 row table
  index used     : no, same reason
  rows read      : 400
  rows returned  : 1
  plan the planner would choose anyway : sequential scan
  cost of the cast : none
  the defect is unchanged; what changed is what it was hiding

what an index being present is evidence of
  the column has an ordered structure : yes
  a predicate on that column can use it : only if the predicate
    compares the column itself
  and a type mismatch inserts a function without appearing in
  the query text at all

the thing to read is not the index list, it is the plan:
rows read against rows returned, which here is 48000000 to 1

The index is healthy, current, selective to 1 row in 48000000, and was added
for this query. Because the parameter arrives as text the comparison becomes
one about text of the column, which no index on this table orders, so each of
the 900 queries an hour reads 48000000 rows to return 1 - 48000000 to 1 -
while the index is still updated on all 1200000 writes a day.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
