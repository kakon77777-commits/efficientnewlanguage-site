<!-- canonical: efficientnewlanguage.org/ai/examples/662-the-index-covered-the-query-and-the-sort-was-in-memory | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 662 — The index covered the query and the sort was in memory

`the_index_covered_the_query_and_the_sort_was_in_memory.eml` - The plan is an index-only scan with zero heap fetches, which is what the index was designed for. Where the time goes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The plan is an
# index-only scan with zero heap fetches, which is what the index was designed
# for. Where the time goes is computed below.
#
# The index is covering and the plan proves it. Every column the query reads is
# in the index, the planner chooses an index-only scan, the visibility map is
# current so no row needs a heap visit, and heap fetches are zero. This is the
# outcome the index was added to produce and it produces it.
#
# Covering describes which columns are READ. Ordering is a separate node in the
# plan, fed by the scan, and the index's key order is not the order the query
# asks for.
#
# Two hundred and forty thousand rows come out of the scan and are then sorted,
# and the sort does not fit in the memory it is allowed.

240000 => rows_returned
0 => heap_fetches
150 => index_scan_ms
1690 => sort_ms
4096 => work_mem_kb
68400 => sort_size_kb

index_scan_ms + sort_ms => query_ms
int(sort_ms * 10000 / query_ms) => sort_share_per_myriad
int(sort_size_kb / work_mem_kb) => times_over_the_memory_allowance

"rows returned            : " + str(rows_returned) ^0
"heap fetches             : " + str(heap_fetches) ^0
"index scan, ms           : " + str(index_scan_ms) ^0
"sort, ms                 : " + str(sort_ms) ^0
"query, ms                : " + str(query_ms) ^0
"" ^0
"sort working set, kb     : " + str(sort_size_kb) ^0
"memory allowed, kb       : " + str(work_mem_kb) ^0
"over the allowance by    : " + str(times_over_the_memory_allowance) + " times" ^0
"" ^0

# ---- what the plan verified ----

"the plan" ^0
"  access method     : index-only scan" ^0
"  columns read from the heap : none" ^0
"  heap fetches      : " + str(heap_fetches) ^0
"  visibility map    : current" ^0
"  verdict           : COVERING" ^0
"" ^0
"  this is the property the index was added for, it holds," ^0
"  and removing the index would make this far worse" ^0
"" ^0

# ---- what covering does not decide ----

"the two nodes" ^0
"  scan  : reads " + str(rows_returned) + " rows from the index, " + str(index_scan_ms) + " ms" ^0
"  sort  : orders them by a column that is not the index's" ^0
"    leading key, " + str(sort_ms) + " ms" ^0
"  the index's contribution to the second : none" ^0
"" ^0
"  an index can supply an order or supply the columns; this" ^0
"  one supplies the columns" ^0
"" ^0

"share of the query spent sorting : " + str(sort_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why it spills ----

# The sort needs sixteen times the memory it is allowed, so it writes and
# merges temporary files. That is the correct behaviour of a sort that does not
# fit, and it is where the milliseconds are.
"the sort" ^0
"  method            : external merge" ^0
"  temporary files written : yes" ^0
"  reason            : " + str(sort_size_kb) + " kb into " + str(work_mem_kb) + " kb" ^0
"  correct behaviour : yes, this is what a sort does when" ^0
"    it does not fit" ^0
"" ^0

# ---- null control ----

# The same index with the ordering column added to its key, so the scan emits
# rows already in order and the sort node disappears.
0 => nc_sort_ms
index_scan_ms => nc_query_ms

"null control - the ordering column added to the index key" ^0
"  heap fetches      : " + str(heap_fetches) + ", unchanged" ^0
"  sort, ms          : " + str(nc_sort_ms) ^0
"  query, ms         : " + str(nc_query_ms) ^0
"  the index did not become more covering; it started" ^0
"  supplying an order as well as the columns" ^0
"" ^0

# ---- the rule ----

"what a covering index guarantees" ^0
"  no row is read from the heap : exactly" ^0
"  the query is fast            : not addressed; the plan" ^0
"    has other nodes, and the one that dominates here is" ^0
"    fed by the scan rather than served by it" ^0
"" ^0
"'covering' is a claim about columns and a query plan is a" ^0
"tree; reading the property off the leaf and the time off the" ^0
"root is how a correct index sits under a slow query" ^0
"" ^0

"The scan is index-only with " + str(heap_fetches) + " heap fetches and a current visibility map, which" ^0
"is exactly what the index was added for. The ordering column is not in its key," ^0
"so " + str(rows_returned) + " rows go to an external merge sort needing " + str(sort_size_kb) + " kb in " + str(work_mem_kb) + " kb -" ^0
str(times_over_the_memory_allowance) + " times over - and " + str(sort_ms) + " of the query's " + str(query_ms) + " ms, " + str(sort_share_per_myriad) + " per ten thousand," ^0
"are spent in a node the index does not touch." ^0
```

## Python (deterministic transpilation)

```python
rows_returned = 240000
heap_fetches = 0
index_scan_ms = 150
sort_ms = 1690
work_mem_kb = 4096
sort_size_kb = 68400
query_ms = index_scan_ms + sort_ms
sort_share_per_myriad = int(sort_ms * 10000 / query_ms)
times_over_the_memory_allowance = int(sort_size_kb / work_mem_kb)
print("rows returned            : " + str(rows_returned))
print("heap fetches             : " + str(heap_fetches))
print("index scan, ms           : " + str(index_scan_ms))
print("sort, ms                 : " + str(sort_ms))
print("query, ms                : " + str(query_ms))
print("")
print("sort working set, kb     : " + str(sort_size_kb))
print("memory allowed, kb       : " + str(work_mem_kb))
print("over the allowance by    : " + str(times_over_the_memory_allowance) + " times")
print("")
print("the plan")
print("  access method     : index-only scan")
print("  columns read from the heap : none")
print("  heap fetches      : " + str(heap_fetches))
print("  visibility map    : current")
print("  verdict           : COVERING")
print("")
print("  this is the property the index was added for, it holds,")
print("  and removing the index would make this far worse")
print("")
print("the two nodes")
print("  scan  : reads " + str(rows_returned) + " rows from the index, " + str(index_scan_ms) + " ms")
print("  sort  : orders them by a column that is not the index's")
print("    leading key, " + str(sort_ms) + " ms")
print("  the index's contribution to the second : none")
print("")
print("  an index can supply an order or supply the columns; this")
print("  one supplies the columns")
print("")
print("share of the query spent sorting : " + str(sort_share_per_myriad) + " per ten thousand")
print("")
print("the sort")
print("  method            : external merge")
print("  temporary files written : yes")
print("  reason            : " + str(sort_size_kb) + " kb into " + str(work_mem_kb) + " kb")
print("  correct behaviour : yes, this is what a sort does when")
print("    it does not fit")
print("")
nc_sort_ms = 0
nc_query_ms = index_scan_ms
print("null control - the ordering column added to the index key")
print("  heap fetches      : " + str(heap_fetches) + ", unchanged")
print("  sort, ms          : " + str(nc_sort_ms))
print("  query, ms         : " + str(nc_query_ms))
print("  the index did not become more covering; it started")
print("  supplying an order as well as the columns")
print("")
print("what a covering index guarantees")
print("  no row is read from the heap : exactly")
print("  the query is fast            : not addressed; the plan")
print("    has other nodes, and the one that dominates here is")
print("    fed by the scan rather than served by it")
print("")
print("'covering' is a claim about columns and a query plan is a")
print("tree; reading the property off the leaf and the time off the")
print("root is how a correct index sits under a slow query")
print("")
print("The scan is index-only with " + str(heap_fetches) + " heap fetches and a current visibility map, which")
print("is exactly what the index was added for. The ordering column is not in its key,")
print("so " + str(rows_returned) + " rows go to an external merge sort needing " + str(sort_size_kb) + " kb in " + str(work_mem_kb) + " kb -")
print(str(times_over_the_memory_allowance) + " times over - and " + str(sort_ms) + " of the query's " + str(query_ms) + " ms, " + str(sort_share_per_myriad) + " per ten thousand,")
print("are spent in a node the index does not touch.")
```

## stdout (executed)

```text
rows returned            : 240000
heap fetches             : 0
index scan, ms           : 150
sort, ms                 : 1690
query, ms                : 1840

sort working set, kb     : 68400
memory allowed, kb       : 4096
over the allowance by    : 16 times

the plan
  access method     : index-only scan
  columns read from the heap : none
  heap fetches      : 0
  visibility map    : current
  verdict           : COVERING

  this is the property the index was added for, it holds,
  and removing the index would make this far worse

the two nodes
  scan  : reads 240000 rows from the index, 150 ms
  sort  : orders them by a column that is not the index's
    leading key, 1690 ms
  the index's contribution to the second : none

  an index can supply an order or supply the columns; this
  one supplies the columns

share of the query spent sorting : 9184 per ten thousand

the sort
  method            : external merge
  temporary files written : yes
  reason            : 68400 kb into 4096 kb
  correct behaviour : yes, this is what a sort does when
    it does not fit

null control - the ordering column added to the index key
  heap fetches      : 0, unchanged
  sort, ms          : 0
  query, ms         : 150
  the index did not become more covering; it started
  supplying an order as well as the columns

what a covering index guarantees
  no row is read from the heap : exactly
  the query is fast            : not addressed; the plan
    has other nodes, and the one that dominates here is
    fed by the scan rather than served by it

'covering' is a claim about columns and a query plan is a
tree; reading the property off the leaf and the time off the
root is how a correct index sits under a slow query

The scan is index-only with 0 heap fetches and a current visibility map, which
is exactly what the index was added for. The ordering column is not in its key,
so 240000 rows go to an external merge sort needing 68400 kb in 4096 kb -
16 times over - and 1690 of the query's 1840 ms, 9184 per ten thousand,
are spent in a node the index does not touch.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
