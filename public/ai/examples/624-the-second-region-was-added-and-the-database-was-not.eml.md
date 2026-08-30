<!-- canonical: efficientnewlanguage.org/ai/examples/624-the-second-region-was-added-and-the-database-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 624 — The second region was added and the database was not

`the_second_region_was_added_and_the_database_was_not.eml` - A second region was added and static content there is twenty-five times faster. Dynamic pages are slower than before. What moved and what did not is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A second region
# was added and static content there is twenty-five times faster. Dynamic pages
# are slower than before. What moved and what did not is computed below.
#
# Adding the region was correct and it delivered what it was justified on. TLS
# terminates near the user, static assets are served locally, and the
# application tier is no longer a single point of failure. Every number in the
# proposal was met. Nothing about the region is misconfigured.
#
# A page is not one round trip. The application tier moved; the data it needs
# did not, so each query that used to cross a rack now crosses an ocean, and a
# page issuing eighteen of them pays that distance eighteen times.
#
# The proposal measured the thing that moved.

18 => queries_per_page
2 => local_query_ms
140 => remote_query_ms
40 => static_before_ms
8 => static_after_ms

"queries per dynamic page   : " + str(queries_per_page) ^0
"query, same region         : " + str(local_query_ms) + " ms" ^0
"query, across the ocean    : " + str(remote_query_ms) + " ms" ^0
"" ^0

# ---- what the region delivered ----

int(static_before_ms * 10 / static_after_ms) => static_speedup_tenths

"static content, the thing the region was for" ^0
"  before : " + str(static_before_ms) + " ms" ^0
"  after  : " + str(static_after_ms) + " ms" ^0
"  faster by : " + str(int(static_speedup_tenths / 10)) + " point " + str(static_speedup_tenths % 10) + " times" ^0
"  application tier single point of failure : removed" ^0
"" ^0
"  the proposal promised both of those and delivered both" ^0
"" ^0

# ---- what a dynamic page costs ----

queries_per_page * local_query_ms => page_before_ms
queries_per_page * remote_query_ms => page_after_ms
page_after_ms - page_before_ms => page_added_ms

"a dynamic page, in query time" ^0
"  region one : " + str(queries_per_page) + " queries at " + str(local_query_ms) + " ms = " + str(page_before_ms) + " ms" ^0
"  region two : " + str(queries_per_page) + " queries at " + str(remote_query_ms) + " ms = " + str(page_after_ms) + " ms" ^0
"  added      : " + str(page_added_ms) + " ms" ^0
"" ^0
int(page_after_ms * 10 / page_before_ms) => page_slowdown_tenths
"  slower by : " + str(int(page_slowdown_tenths / 10)) + " point " + str(page_slowdown_tenths % 10) + " times" ^0
"" ^0

# ---- the two numbers side by side ----

static_before_ms - static_after_ms => static_saved_ms

"per page load in region two" ^0
"  saved on static content : " + str(static_saved_ms) + " ms" ^0
"  added on queries        : " + str(page_added_ms) + " ms" ^0
"  net                     : " + str(page_added_ms - static_saved_ms) + " ms slower" ^0
"" ^0
int(page_added_ms / static_saved_ms) => ratio
"  the cost is " + str(ratio) + " times the saving, and the saving is the" ^0
"  number the proposal was measured against" ^0
"" ^0

# ---- why the query count is the multiplier ----

"pages by query count, in region two" ^0
"queries   region one   region two   added" ^0
for q in [1:5]:
    q * 6 => n
    "  " + str(n) + "        " + str(n * local_query_ms) + " ms       " + str(n * remote_query_ms) + " ms      " + str(n * remote_query_ms - n * local_query_ms) + " ms" ^0
"" ^0
"  a distance is paid once per round trip, and nothing in the" ^0
"  region's own metrics counts round trips per page" ^0
"" ^0

# ---- what each dashboard shows ----

"instrument                      reads" ^0
"  region two edge latency       " + str(static_after_ms) + " ms, excellent" ^0
"  region two app CPU            healthy" ^0
"  database latency, as measured at the database  " + str(local_query_ms) + " ms" ^0
"  cross-region link             within budget" ^0
"  page time in region two       " + str(page_after_ms) + " ms" ^0
"" ^0
"  the database reports " + str(local_query_ms) + " ms and is right: it measures from" ^0
"  arrival to response, and the ocean is not inside that" ^0
"" ^0

# ---- the control ----
#
# The region, against the case that was made for it. Both of the things it was
# justified on happened, and neither is in dispute.

"control - did the second region deliver" ^0
"  static content faster            : yes, " + str(int(static_speedup_tenths / 10)) + " point " + str(static_speedup_tenths % 10) + " times" ^0
"  app tier no longer single-region : yes" ^0
"  failed deploys to region two     : 0" ^0
"  misconfigurations                : 0" ^0
"  defects in the region            : 0" ^0
"" ^0
"  removing the region gives back the " + str(static_saved_ms) + " ms and returns the" ^0
"  single point of failure" ^0
"" ^0

# ---- the null control ----
#
# The same second region with a read replica beside it. Same app tier, same
# static edge, same deploy. Only the data's distance changed.

queries_per_page * local_query_ms => nc_page_ms

"null control - the same region with a local read replica" ^0
"  query latency  : " + str(local_query_ms) + " ms" ^0
"  page time      : " + str(nc_page_ms) + " ms" ^0
"  static content : " + str(static_after_ms) + " ms, unchanged" ^0
"  net against region one : " + str(static_saved_ms) + " ms faster" ^0
"  the region was never the problem; the distance to the data was" ^0
"" ^0

# ---- the rule ----

"what adding a region moves" ^0
"  where the request is terminated : yes" ^0
"  where the computation happens   : yes" ^0
"  where the data is               : only if that was part of it" ^0
"  and a page's cost is the number of times it crosses whatever" ^0
"  distance is left" ^0
"" ^0
"the figure that predicts this is not latency, it is round" ^0
"trips per page multiplied by the distance not removed" ^0
"" ^0

"The region delivered what it was justified on: static content " + str(int(static_speedup_tenths / 10)) + " point " + str(static_speedup_tenths % 10) + " times" ^0
"faster, " + str(static_saved_ms) + " ms saved per load, the app tier no longer single-region, 0" ^0
"misconfigurations. A dynamic page issues " + str(queries_per_page) + " queries, and each one now crosses" ^0
"an ocean, so page query time goes from " + str(page_before_ms) + " to " + str(page_after_ms) + " ms - " + str(page_added_ms) + " ms added" ^0
"against " + str(static_saved_ms) + " saved, " + str(ratio) + " times the number the proposal was measured on." ^0
```

## Python (deterministic transpilation)

```python
queries_per_page = 18
local_query_ms = 2
remote_query_ms = 140
static_before_ms = 40
static_after_ms = 8
print("queries per dynamic page   : " + str(queries_per_page))
print("query, same region         : " + str(local_query_ms) + " ms")
print("query, across the ocean    : " + str(remote_query_ms) + " ms")
print("")
static_speedup_tenths = int(static_before_ms * 10 / static_after_ms)
print("static content, the thing the region was for")
print("  before : " + str(static_before_ms) + " ms")
print("  after  : " + str(static_after_ms) + " ms")
print("  faster by : " + str(int(static_speedup_tenths / 10)) + " point " + str(static_speedup_tenths % 10) + " times")
print("  application tier single point of failure : removed")
print("")
print("  the proposal promised both of those and delivered both")
print("")
page_before_ms = queries_per_page * local_query_ms
page_after_ms = queries_per_page * remote_query_ms
page_added_ms = page_after_ms - page_before_ms
print("a dynamic page, in query time")
print("  region one : " + str(queries_per_page) + " queries at " + str(local_query_ms) + " ms = " + str(page_before_ms) + " ms")
print("  region two : " + str(queries_per_page) + " queries at " + str(remote_query_ms) + " ms = " + str(page_after_ms) + " ms")
print("  added      : " + str(page_added_ms) + " ms")
print("")
page_slowdown_tenths = int(page_after_ms * 10 / page_before_ms)
print("  slower by : " + str(int(page_slowdown_tenths / 10)) + " point " + str(page_slowdown_tenths % 10) + " times")
print("")
static_saved_ms = static_before_ms - static_after_ms
print("per page load in region two")
print("  saved on static content : " + str(static_saved_ms) + " ms")
print("  added on queries        : " + str(page_added_ms) + " ms")
print("  net                     : " + str(page_added_ms - static_saved_ms) + " ms slower")
print("")
ratio = int(page_added_ms / static_saved_ms)
print("  the cost is " + str(ratio) + " times the saving, and the saving is the")
print("  number the proposal was measured against")
print("")
print("pages by query count, in region two")
print("queries   region one   region two   added")
for q in range(1, 6):
    n = q * 6
    print("  " + str(n) + "        " + str(n * local_query_ms) + " ms       " + str(n * remote_query_ms) + " ms      " + str(n * remote_query_ms - n * local_query_ms) + " ms")
print("")
print("  a distance is paid once per round trip, and nothing in the")
print("  region's own metrics counts round trips per page")
print("")
print("instrument                      reads")
print("  region two edge latency       " + str(static_after_ms) + " ms, excellent")
print("  region two app CPU            healthy")
print("  database latency, as measured at the database  " + str(local_query_ms) + " ms")
print("  cross-region link             within budget")
print("  page time in region two       " + str(page_after_ms) + " ms")
print("")
print("  the database reports " + str(local_query_ms) + " ms and is right: it measures from")
print("  arrival to response, and the ocean is not inside that")
print("")
print("control - did the second region deliver")
print("  static content faster            : yes, " + str(int(static_speedup_tenths / 10)) + " point " + str(static_speedup_tenths % 10) + " times")
print("  app tier no longer single-region : yes")
print("  failed deploys to region two     : 0")
print("  misconfigurations                : 0")
print("  defects in the region            : 0")
print("")
print("  removing the region gives back the " + str(static_saved_ms) + " ms and returns the")
print("  single point of failure")
print("")
nc_page_ms = queries_per_page * local_query_ms
print("null control - the same region with a local read replica")
print("  query latency  : " + str(local_query_ms) + " ms")
print("  page time      : " + str(nc_page_ms) + " ms")
print("  static content : " + str(static_after_ms) + " ms, unchanged")
print("  net against region one : " + str(static_saved_ms) + " ms faster")
print("  the region was never the problem; the distance to the data was")
print("")
print("what adding a region moves")
print("  where the request is terminated : yes")
print("  where the computation happens   : yes")
print("  where the data is               : only if that was part of it")
print("  and a page's cost is the number of times it crosses whatever")
print("  distance is left")
print("")
print("the figure that predicts this is not latency, it is round")
print("trips per page multiplied by the distance not removed")
print("")
print("The region delivered what it was justified on: static content " + str(int(static_speedup_tenths / 10)) + " point " + str(static_speedup_tenths % 10) + " times")
print("faster, " + str(static_saved_ms) + " ms saved per load, the app tier no longer single-region, 0")
print("misconfigurations. A dynamic page issues " + str(queries_per_page) + " queries, and each one now crosses")
print("an ocean, so page query time goes from " + str(page_before_ms) + " to " + str(page_after_ms) + " ms - " + str(page_added_ms) + " ms added")
print("against " + str(static_saved_ms) + " saved, " + str(ratio) + " times the number the proposal was measured on.")
```

## stdout (executed)

```text
queries per dynamic page   : 18
query, same region         : 2 ms
query, across the ocean    : 140 ms

static content, the thing the region was for
  before : 40 ms
  after  : 8 ms
  faster by : 5 point 0 times
  application tier single point of failure : removed

  the proposal promised both of those and delivered both

a dynamic page, in query time
  region one : 18 queries at 2 ms = 36 ms
  region two : 18 queries at 140 ms = 2520 ms
  added      : 2484 ms

  slower by : 70 point 0 times

per page load in region two
  saved on static content : 32 ms
  added on queries        : 2484 ms
  net                     : 2452 ms slower

  the cost is 77 times the saving, and the saving is the
  number the proposal was measured against

pages by query count, in region two
queries   region one   region two   added
  6        12 ms       840 ms      828 ms
  12        24 ms       1680 ms      1656 ms
  18        36 ms       2520 ms      2484 ms
  24        48 ms       3360 ms      3312 ms
  30        60 ms       4200 ms      4140 ms

  a distance is paid once per round trip, and nothing in the
  region's own metrics counts round trips per page

instrument                      reads
  region two edge latency       8 ms, excellent
  region two app CPU            healthy
  database latency, as measured at the database  2 ms
  cross-region link             within budget
  page time in region two       2520 ms

  the database reports 2 ms and is right: it measures from
  arrival to response, and the ocean is not inside that

control - did the second region deliver
  static content faster            : yes, 5 point 0 times
  app tier no longer single-region : yes
  failed deploys to region two     : 0
  misconfigurations                : 0
  defects in the region            : 0

  removing the region gives back the 32 ms and returns the
  single point of failure

null control - the same region with a local read replica
  query latency  : 2 ms
  page time      : 36 ms
  static content : 8 ms, unchanged
  net against region one : 32 ms faster
  the region was never the problem; the distance to the data was

what adding a region moves
  where the request is terminated : yes
  where the computation happens   : yes
  where the data is               : only if that was part of it
  and a page's cost is the number of times it crosses whatever
  distance is left

the figure that predicts this is not latency, it is round
trips per page multiplied by the distance not removed

The region delivered what it was justified on: static content 5 point 0 times
faster, 32 ms saved per load, the app tier no longer single-region, 0
misconfigurations. A dynamic page issues 18 queries, and each one now crosses
an ocean, so page query time goes from 36 to 2520 ms - 2484 ms added
against 32 saved, 77 times the number the proposal was measured on.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
