<!-- canonical: efficientnewlanguage.org/ai/examples/741-the-query-was-under-the-threshold-and-the-page-made-three-hundred | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 741 — The query was under the threshold and the page made three hundred

`the_query_was_under_the_threshold_and_the_page_made_three_hundred.eml` - The slow-query log has a fifty millisecond threshold and has not recorded an entry in a month. What one page render costs is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The slow-query log
# has a fifty millisecond threshold and has not recorded an entry in a month.
# What one page render costs is computed below.
#
# The threshold is well chosen and the logging is real. Fifty milliseconds is
# not a placeholder; it was set from the distribution rather than picked round,
# every query the application issues goes through the instrumented client so
# there is no path that avoids the log, the log is read, and three genuine
# missing indexes were found and fixed with it last year.
#
# The threshold is applied to a QUERY. A page render issues three hundred and
# one of them, each one honestly fast, and nothing measures the row that a
# reader actually waits for.
#
# The budget for a page is two hundred milliseconds.

50 => slow_query_threshold_ms
0 => queries_over_the_threshold_last_month
3 => missing_indexes_found_with_the_log_last_year
4 => mean_query_ms
301 => queries_per_page_render
200 => page_budget_ms
0 => metrics_on_queries_per_render
12 => pages_of_this_shape

queries_per_page_render * mean_query_ms => database_ms_per_page
database_ms_per_page - page_budget_ms => ms_over_the_page_budget
int(mean_query_ms * 10000 / slow_query_threshold_ms) => each_query_per_myriad_of_the_threshold
int(page_budget_ms * 10000 / database_ms_per_page) => budget_per_myriad_of_the_cost

"slow-query threshold, ms        : " + str(slow_query_threshold_ms) ^0
"queries over it last month      : " + str(queries_over_the_threshold_last_month) ^0
"missing indexes found with it   : " + str(missing_indexes_found_with_the_log_last_year) ^0
"" ^0
"mean query, ms                  : " + str(mean_query_ms) ^0
"  as a share of the threshold   : " + str(each_query_per_myriad_of_the_threshold) + " per ten thousand" ^0
"queries per page render         : " + str(queries_per_page_render) ^0
"database time per page, ms      : " + str(database_ms_per_page) ^0
"" ^0
"page budget, ms                 : " + str(page_budget_ms) ^0
"  over it by                    : " + str(ms_over_the_page_budget) ^0
"  budget as a share of the cost : " + str(budget_per_myriad_of_the_cost) + " per ten thousand" ^0
"metrics on queries per render   : " + str(metrics_on_queries_per_render) ^0
"pages of this shape             : " + str(pages_of_this_shape) ^0
"" ^0

# ---- what the threshold verified ----

"the slow-query log" ^0
"  threshold : " + str(slow_query_threshold_ms) + " ms, set from the distribution" ^0
"  paths that avoid it : none; every query goes through" ^0
"    the instrumented client" ^0
"  is the log read : yes" ^0
"  missing indexes it found : " + str(missing_indexes_found_with_the_log_last_year) ^0
"  entries last month : " + str(queries_over_the_threshold_last_month) ^0
"  verdict : FAST" ^0
"" ^0
"  every query in this system is genuinely fast and the log" ^0
"  is why three of them stopped being slow" ^0
"" ^0

# ---- what the threshold is applied to ----

"the unit measured" ^0
"  what carries a duration : one query" ^0
"  what a reader waits for : one render" ^0
"  queries in one render   : " + str(queries_per_page_render) ^0
"  each of them under the threshold : yes, by " + str(each_query_per_myriad_of_the_threshold) ^0
"    per ten thousand of it" ^0
"  their sum against the page budget : " + str(database_ms_per_page) + " against " + str(page_budget_ms) ^0
"" ^0
"  no query is slow and the page is, and both statements" ^0
"  are about the same milliseconds" ^0
"" ^0
# ---- why lowering the threshold does not help ----

# A four millisecond query is not a defect and a threshold that flags it would
# flag every query in the system. The quantity that is wrong is not any query's
# duration; it is how many of them one render issues.
"lowering the threshold" ^0
"  to catch a " + str(mean_query_ms) + " ms query it must be below " + str(mean_query_ms) + " ms" ^0
"  queries it would then flag : all of them" ^0
"  defects it would identify  : none; the query is fine" ^0
"  what is actually wrong : the count, which is " + str(queries_per_page_render) ^0
"  a threshold on a count : " + str(metrics_on_queries_per_render) + " exist" ^0
"" ^0

# ---- how the count gets there ----

# The list renders a row per item and each row asks for its own related record.
# Every one of those calls is a correct call, written by someone who could not
# see the loop from inside the row.
"where " + str(queries_per_page_render) + " comes from" ^0
"  the list query           : 1" ^0
"  a related record per row : one call each" ^0
"  is any of those calls wrong : no" ^0
"  is the loop visible from the row : no; the row is a" ^0
"    component and it asks for what it needs" ^0
"  pages with this shape : " + str(pages_of_this_shape) ^0
"" ^0

# ---- what the database sees ----

"from the database side" ^0
"  queries per second : high, and all of them cheap" ^0
"  slow queries       : " + str(queries_over_the_threshold_last_month) ^0
"  connection pool    : busy, which reads as healthy" ^0
"  what a database dashboard shows : a well-tuned system" ^0
"  what it is asked   : how long each query takes" ^0
"  what it is not asked : how many arrived for one render" ^0
"" ^0

# ---- null control ----

# The same threshold, plus a per-request counter that fails the build when a
# render issues more queries than a stated bound.
1 => nc_metrics_on_queries_per_render
2 => nc_queries_per_page_render

"null control - a bound on queries per render" ^0
"  slow-query threshold : " + str(slow_query_threshold_ms) + " ms, unchanged" ^0
"  metrics on queries per render : " + str(nc_metrics_on_queries_per_render) ^0
"  queries per render after the fix : " + str(nc_queries_per_page_render) ^0
"  no query got faster; the number of them became a" ^0
"  quantity something is allowed to complain about" ^0
"" ^0

# ---- the rule ----

"what an empty slow-query log guarantees" ^0
"  no single query is slow : exactly, over every query the" ^0
"    application issues, with no unlogged path" ^0
"  the application is fast : not addressed; the threshold" ^0
"    is applied per query and the wait is per request" ^0
"" ^0
"a per-item bound bounds each item and says nothing about" ^0
"how many items there are; the composition is where the cost" ^0
"lives, and it is exactly the quantity a per-item instrument" ^0
"cannot represent" ^0
"" ^0

"The threshold is set from the distribution rather than picked, no query path" ^0
"avoids the log, and it found " + str(missing_indexes_found_with_the_log_last_year) + " missing indexes and has been empty for a month." ^0
"It is applied to one query, each of which runs in " + str(mean_query_ms) + " ms - " + str(each_query_per_myriad_of_the_threshold) + " per ten" ^0
"thousand of the threshold - while a render issues " + str(queries_per_page_render) + " of them for " + str(database_ms_per_page) + " ms against" ^0
"a " + str(page_budget_ms) + " ms budget, " + str(budget_per_myriad_of_the_cost) + " per ten thousand of the cost, on " + str(pages_of_this_shape) + " pages." ^0
```

## Python (deterministic transpilation)

```python
slow_query_threshold_ms = 50
queries_over_the_threshold_last_month = 0
missing_indexes_found_with_the_log_last_year = 3
mean_query_ms = 4
queries_per_page_render = 301
page_budget_ms = 200
metrics_on_queries_per_render = 0
pages_of_this_shape = 12
database_ms_per_page = queries_per_page_render * mean_query_ms
ms_over_the_page_budget = database_ms_per_page - page_budget_ms
each_query_per_myriad_of_the_threshold = int(mean_query_ms * 10000 / slow_query_threshold_ms)
budget_per_myriad_of_the_cost = int(page_budget_ms * 10000 / database_ms_per_page)
print("slow-query threshold, ms        : " + str(slow_query_threshold_ms))
print("queries over it last month      : " + str(queries_over_the_threshold_last_month))
print("missing indexes found with it   : " + str(missing_indexes_found_with_the_log_last_year))
print("")
print("mean query, ms                  : " + str(mean_query_ms))
print("  as a share of the threshold   : " + str(each_query_per_myriad_of_the_threshold) + " per ten thousand")
print("queries per page render         : " + str(queries_per_page_render))
print("database time per page, ms      : " + str(database_ms_per_page))
print("")
print("page budget, ms                 : " + str(page_budget_ms))
print("  over it by                    : " + str(ms_over_the_page_budget))
print("  budget as a share of the cost : " + str(budget_per_myriad_of_the_cost) + " per ten thousand")
print("metrics on queries per render   : " + str(metrics_on_queries_per_render))
print("pages of this shape             : " + str(pages_of_this_shape))
print("")
print("the slow-query log")
print("  threshold : " + str(slow_query_threshold_ms) + " ms, set from the distribution")
print("  paths that avoid it : none; every query goes through")
print("    the instrumented client")
print("  is the log read : yes")
print("  missing indexes it found : " + str(missing_indexes_found_with_the_log_last_year))
print("  entries last month : " + str(queries_over_the_threshold_last_month))
print("  verdict : FAST")
print("")
print("  every query in this system is genuinely fast and the log")
print("  is why three of them stopped being slow")
print("")
print("the unit measured")
print("  what carries a duration : one query")
print("  what a reader waits for : one render")
print("  queries in one render   : " + str(queries_per_page_render))
print("  each of them under the threshold : yes, by " + str(each_query_per_myriad_of_the_threshold))
print("    per ten thousand of it")
print("  their sum against the page budget : " + str(database_ms_per_page) + " against " + str(page_budget_ms))
print("")
print("  no query is slow and the page is, and both statements")
print("  are about the same milliseconds")
print("")
print("lowering the threshold")
print("  to catch a " + str(mean_query_ms) + " ms query it must be below " + str(mean_query_ms) + " ms")
print("  queries it would then flag : all of them")
print("  defects it would identify  : none; the query is fine")
print("  what is actually wrong : the count, which is " + str(queries_per_page_render))
print("  a threshold on a count : " + str(metrics_on_queries_per_render) + " exist")
print("")
print("where " + str(queries_per_page_render) + " comes from")
print("  the list query           : 1")
print("  a related record per row : one call each")
print("  is any of those calls wrong : no")
print("  is the loop visible from the row : no; the row is a")
print("    component and it asks for what it needs")
print("  pages with this shape : " + str(pages_of_this_shape))
print("")
print("from the database side")
print("  queries per second : high, and all of them cheap")
print("  slow queries       : " + str(queries_over_the_threshold_last_month))
print("  connection pool    : busy, which reads as healthy")
print("  what a database dashboard shows : a well-tuned system")
print("  what it is asked   : how long each query takes")
print("  what it is not asked : how many arrived for one render")
print("")
nc_metrics_on_queries_per_render = 1
nc_queries_per_page_render = 2
print("null control - a bound on queries per render")
print("  slow-query threshold : " + str(slow_query_threshold_ms) + " ms, unchanged")
print("  metrics on queries per render : " + str(nc_metrics_on_queries_per_render))
print("  queries per render after the fix : " + str(nc_queries_per_page_render))
print("  no query got faster; the number of them became a")
print("  quantity something is allowed to complain about")
print("")
print("what an empty slow-query log guarantees")
print("  no single query is slow : exactly, over every query the")
print("    application issues, with no unlogged path")
print("  the application is fast : not addressed; the threshold")
print("    is applied per query and the wait is per request")
print("")
print("a per-item bound bounds each item and says nothing about")
print("how many items there are; the composition is where the cost")
print("lives, and it is exactly the quantity a per-item instrument")
print("cannot represent")
print("")
print("The threshold is set from the distribution rather than picked, no query path")
print("avoids the log, and it found " + str(missing_indexes_found_with_the_log_last_year) + " missing indexes and has been empty for a month.")
print("It is applied to one query, each of which runs in " + str(mean_query_ms) + " ms - " + str(each_query_per_myriad_of_the_threshold) + " per ten")
print("thousand of the threshold - while a render issues " + str(queries_per_page_render) + " of them for " + str(database_ms_per_page) + " ms against")
print("a " + str(page_budget_ms) + " ms budget, " + str(budget_per_myriad_of_the_cost) + " per ten thousand of the cost, on " + str(pages_of_this_shape) + " pages.")
```

## stdout (executed)

```text
slow-query threshold, ms        : 50
queries over it last month      : 0
missing indexes found with it   : 3

mean query, ms                  : 4
  as a share of the threshold   : 800 per ten thousand
queries per page render         : 301
database time per page, ms      : 1204

page budget, ms                 : 200
  over it by                    : 1004
  budget as a share of the cost : 1661 per ten thousand
metrics on queries per render   : 0
pages of this shape             : 12

the slow-query log
  threshold : 50 ms, set from the distribution
  paths that avoid it : none; every query goes through
    the instrumented client
  is the log read : yes
  missing indexes it found : 3
  entries last month : 0
  verdict : FAST

  every query in this system is genuinely fast and the log
  is why three of them stopped being slow

the unit measured
  what carries a duration : one query
  what a reader waits for : one render
  queries in one render   : 301
  each of them under the threshold : yes, by 800
    per ten thousand of it
  their sum against the page budget : 1204 against 200

  no query is slow and the page is, and both statements
  are about the same milliseconds

lowering the threshold
  to catch a 4 ms query it must be below 4 ms
  queries it would then flag : all of them
  defects it would identify  : none; the query is fine
  what is actually wrong : the count, which is 301
  a threshold on a count : 0 exist

where 301 comes from
  the list query           : 1
  a related record per row : one call each
  is any of those calls wrong : no
  is the loop visible from the row : no; the row is a
    component and it asks for what it needs
  pages with this shape : 12

from the database side
  queries per second : high, and all of them cheap
  slow queries       : 0
  connection pool    : busy, which reads as healthy
  what a database dashboard shows : a well-tuned system
  what it is asked   : how long each query takes
  what it is not asked : how many arrived for one render

null control - a bound on queries per render
  slow-query threshold : 50 ms, unchanged
  metrics on queries per render : 1
  queries per render after the fix : 2
  no query got faster; the number of them became a
  quantity something is allowed to complain about

what an empty slow-query log guarantees
  no single query is slow : exactly, over every query the
    application issues, with no unlogged path
  the application is fast : not addressed; the threshold
    is applied per query and the wait is per request

a per-item bound bounds each item and says nothing about
how many items there are; the composition is where the cost
lives, and it is exactly the quantity a per-item instrument
cannot represent

The threshold is set from the distribution rather than picked, no query path
avoids the log, and it found 3 missing indexes and has been empty for a month.
It is applied to one query, each of which runs in 4 ms - 800 per ten
thousand of the threshold - while a render issues 301 of them for 1204 ms against
a 200 ms budget, 1661 per ten thousand of the cost, on 12 pages.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
