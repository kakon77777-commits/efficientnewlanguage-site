<!-- canonical: efficientnewlanguage.org/ai/examples/582-the-aggregate-was-cached-and-the-parts-were-live | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 582 — The aggregate was cached and the parts were live

`the_aggregate_was_cached_and_the_parts_were_live.eml` - One page shows a total at the top and the rows it totals underneath. The total is cached for five minutes; the rows are queried live. What the two disagree by is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One page shows a
# total at the top and the rows it totals underneath. The total is cached for
# five minutes; the rows are queried live. What the two disagree by is computed
# below.
#
# Caching only the total is the right optimisation and it was chosen by
# measurement. The total is a full scan of eleven seconds; the row list is an
# indexed range of forty milliseconds. Caching the cheap query would save
# nothing and cost staleness, so it was left live. Caching the expensive one
# takes the page from eleven seconds to forty milliseconds, which is the
# difference between a page people use and a page they do not.
#
# Caching is applied per query, by cost. Consistency is a property of a PAIR of
# queries, and no per-query decision can hold it. The two are cached
# differently precisely because they cost differently, and cost is unrelated to
# whether they are read together.
#
# Both numbers on the page are correct. They are correct as of two different
# moments, and the page presents them as one moment.

300 => cache_ttl_seconds
40 => changes_per_minute
11000 => total_query_ms
40 => list_query_ms

int(changes_per_minute * cache_ttl_seconds / 60) => drift_at_expiry

"total query  : " + str(total_query_ms) + " ms, cached for " + str(cache_ttl_seconds) + " seconds" ^0
"row list     : " + str(list_query_ms) + " ms, live" ^0
"change rate  : " + str(changes_per_minute) + " per minute" ^0
"" ^0

"  rows added while one cached total is served : " + str(drift_at_expiry) ^0
"  the header is behind the list by 0 at the start of a cache window" ^0
"  and by " + str(drift_at_expiry) + " at the end of it" ^0
"" ^0

# ---- the page through one cache window ----

"seconds into window   header says   list contains   difference" ^0
1200 => header_value
for s in [0:300]:
    if s % 60 == 0:
        int(changes_per_minute * s / 60) => added
        "  " + str(s) + "                  " + str(header_value) + "         " + str(header_value + added) + "          " + str(added) ^0
"" ^0
"  the header is a constant for the whole window, by design" ^0
"  the list grows continuously, by design" ^0
"  a user who counts the list disagrees with the header " + str(int(drift_at_expiry * 100 / 300)) + " percent of" ^0
"  the way through, on average" ^0
"" ^0

# ---- what the user does about it ----
#
# The disagreement is visible, small, and reproducible, so it reads as a bug in
# whichever number the user trusts less. Support tickets name the total, because
# the list is the thing they can see and count.

"how the disagreement is reported" ^0
"  tickets naming the total as wrong : most of them" ^0
"  tickets naming the list as wrong  : almost none" ^0
"  reason : the list can be counted and the total cannot" ^0
"  investigations that find a bug in the total query : 0" ^0
"  the total query is correct, and it is answering a question about a" ^0
"  moment that has passed" ^0
"" ^0

# ---- what each cache policy would cost ----

"policy                         page load   maximum disagreement" ^0
"  neither cached                 " + str(total_query_ms + list_query_ms) + " ms     0" ^0
"  total cached, list live        " + str(list_query_ms) + " ms        " + str(drift_at_expiry) ^0
"  both cached, same key          " + str(list_query_ms) + " ms        0" ^0
"  both cached, separate keys     " + str(list_query_ms) + " ms        " + str(drift_at_expiry) + ", and now both are stale" ^0
"" ^0
"  the third row costs the same as the second and disagrees by nothing" ^0
"  it needs the two queries to share one cache entry, which means treating" ^0
"  them as one answer rather than two" ^0
"" ^0

# ---- the control ----
#
# Each query on its own. Run either one twice and it is stable, correct, and
# reproduces the same value. Neither has a defect to find.

"control - is either query wrong" ^0
"  total query, run directly : correct for the moment it ran" ^0
"  list query, run directly  : correct for the moment it ran" ^0
"  queries with a defect     : 0 of 2" ^0
"  cache implementation bugs : 0, it expires exactly on schedule" ^0
"" ^0
"  and a page is not a query; it is two of them, presented as one" ^0
"" ^0

# ---- the null control ----
#
# The same page over a dataset that changes once a day. The cache window
# contains no changes, the header and the list agree in every window, and the
# optimisation is free. The policy is not wrong; it is wrong in proportion to
# the change rate.

1 => nc_changes_per_day
int(nc_changes_per_day * cache_ttl_seconds / 86400) => nc_drift

"null control - the same caching over a dataset that changes daily" ^0
"  changes per day            : " + str(nc_changes_per_day) ^0
"  drift within a cache window: " + str(nc_drift) ^0
"  page load                  : " + str(list_query_ms) + " ms, same saving" ^0
"  disagreement               : none, on almost every window" ^0
"  same TTL, same policy, same code" ^0
"  the cost is the change rate times the TTL, and the caching decision" ^0
"  looked at neither" ^0
"" ^0

# ---- the rule ----

"caching decisions are made per query" ^0
"  cost of the query            visible at the call site" ^0
"  staleness the user tolerates visible at the call site" ^0
"  whether it is read beside another query   NOT visible at the call site" ^0
"  and consistency is a property of that pair, not of either one" ^0
"" ^0
"the two queries here were cached differently BECAUSE they cost differently," ^0
"and cost has nothing to do with whether they appear on the same screen" ^0
"" ^0

"Caching the eleven-second total and leaving the forty-millisecond list live is" ^0
"the correct decision on every per-query axis: it is where the saving is, and" ^0
"caching the cheap one would buy nothing. Both queries are right. By the end of" ^0
"a " + str(cache_ttl_seconds) + "-second window the header is " + str(drift_at_expiry) + " behind the rows it claims to total, and" ^0
"every support ticket about it names the number that cannot be counted." ^0
```

## Python (deterministic transpilation)

```python
cache_ttl_seconds = 300
changes_per_minute = 40
total_query_ms = 11000
list_query_ms = 40
drift_at_expiry = int(changes_per_minute * cache_ttl_seconds / 60)
print("total query  : " + str(total_query_ms) + " ms, cached for " + str(cache_ttl_seconds) + " seconds")
print("row list     : " + str(list_query_ms) + " ms, live")
print("change rate  : " + str(changes_per_minute) + " per minute")
print("")
print("  rows added while one cached total is served : " + str(drift_at_expiry))
print("  the header is behind the list by 0 at the start of a cache window")
print("  and by " + str(drift_at_expiry) + " at the end of it")
print("")
print("seconds into window   header says   list contains   difference")
header_value = 1200
for s in range(0, 301):
    if s % 60 == 0:
        added = int(changes_per_minute * s / 60)
        print("  " + str(s) + "                  " + str(header_value) + "         " + str(header_value + added) + "          " + str(added))
print("")
print("  the header is a constant for the whole window, by design")
print("  the list grows continuously, by design")
print("  a user who counts the list disagrees with the header " + str(int(drift_at_expiry * 100 / 300)) + " percent of")
print("  the way through, on average")
print("")
print("how the disagreement is reported")
print("  tickets naming the total as wrong : most of them")
print("  tickets naming the list as wrong  : almost none")
print("  reason : the list can be counted and the total cannot")
print("  investigations that find a bug in the total query : 0")
print("  the total query is correct, and it is answering a question about a")
print("  moment that has passed")
print("")
print("policy                         page load   maximum disagreement")
print("  neither cached                 " + str(total_query_ms + list_query_ms) + " ms     0")
print("  total cached, list live        " + str(list_query_ms) + " ms        " + str(drift_at_expiry))
print("  both cached, same key          " + str(list_query_ms) + " ms        0")
print("  both cached, separate keys     " + str(list_query_ms) + " ms        " + str(drift_at_expiry) + ", and now both are stale")
print("")
print("  the third row costs the same as the second and disagrees by nothing")
print("  it needs the two queries to share one cache entry, which means treating")
print("  them as one answer rather than two")
print("")
print("control - is either query wrong")
print("  total query, run directly : correct for the moment it ran")
print("  list query, run directly  : correct for the moment it ran")
print("  queries with a defect     : 0 of 2")
print("  cache implementation bugs : 0, it expires exactly on schedule")
print("")
print("  and a page is not a query; it is two of them, presented as one")
print("")
nc_changes_per_day = 1
nc_drift = int(nc_changes_per_day * cache_ttl_seconds / 86400)
print("null control - the same caching over a dataset that changes daily")
print("  changes per day            : " + str(nc_changes_per_day))
print("  drift within a cache window: " + str(nc_drift))
print("  page load                  : " + str(list_query_ms) + " ms, same saving")
print("  disagreement               : none, on almost every window")
print("  same TTL, same policy, same code")
print("  the cost is the change rate times the TTL, and the caching decision")
print("  looked at neither")
print("")
print("caching decisions are made per query")
print("  cost of the query            visible at the call site")
print("  staleness the user tolerates visible at the call site")
print("  whether it is read beside another query   NOT visible at the call site")
print("  and consistency is a property of that pair, not of either one")
print("")
print("the two queries here were cached differently BECAUSE they cost differently,")
print("and cost has nothing to do with whether they appear on the same screen")
print("")
print("Caching the eleven-second total and leaving the forty-millisecond list live is")
print("the correct decision on every per-query axis: it is where the saving is, and")
print("caching the cheap one would buy nothing. Both queries are right. By the end of")
print("a " + str(cache_ttl_seconds) + "-second window the header is " + str(drift_at_expiry) + " behind the rows it claims to total, and")
print("every support ticket about it names the number that cannot be counted.")
```

## stdout (executed)

```text
total query  : 11000 ms, cached for 300 seconds
row list     : 40 ms, live
change rate  : 40 per minute

  rows added while one cached total is served : 200
  the header is behind the list by 0 at the start of a cache window
  and by 200 at the end of it

seconds into window   header says   list contains   difference
  0                  1200         1200          0
  60                  1200         1240          40
  120                  1200         1280          80
  180                  1200         1320          120
  240                  1200         1360          160
  300                  1200         1400          200

  the header is a constant for the whole window, by design
  the list grows continuously, by design
  a user who counts the list disagrees with the header 66 percent of
  the way through, on average

how the disagreement is reported
  tickets naming the total as wrong : most of them
  tickets naming the list as wrong  : almost none
  reason : the list can be counted and the total cannot
  investigations that find a bug in the total query : 0
  the total query is correct, and it is answering a question about a
  moment that has passed

policy                         page load   maximum disagreement
  neither cached                 11040 ms     0
  total cached, list live        40 ms        200
  both cached, same key          40 ms        0
  both cached, separate keys     40 ms        200, and now both are stale

  the third row costs the same as the second and disagrees by nothing
  it needs the two queries to share one cache entry, which means treating
  them as one answer rather than two

control - is either query wrong
  total query, run directly : correct for the moment it ran
  list query, run directly  : correct for the moment it ran
  queries with a defect     : 0 of 2
  cache implementation bugs : 0, it expires exactly on schedule

  and a page is not a query; it is two of them, presented as one

null control - the same caching over a dataset that changes daily
  changes per day            : 1
  drift within a cache window: 0
  page load                  : 40 ms, same saving
  disagreement               : none, on almost every window
  same TTL, same policy, same code
  the cost is the change rate times the TTL, and the caching decision
  looked at neither

caching decisions are made per query
  cost of the query            visible at the call site
  staleness the user tolerates visible at the call site
  whether it is read beside another query   NOT visible at the call site
  and consistency is a property of that pair, not of either one

the two queries here were cached differently BECAUSE they cost differently,
and cost has nothing to do with whether they appear on the same screen

Caching the eleven-second total and leaving the forty-millisecond list live is
the correct decision on every per-query axis: it is where the saving is, and
caching the cheap one would buy nothing. Both queries are right. By the end of
a 300-second window the header is 200 behind the rows it claims to total, and
every support ticket about it names the number that cannot be counted.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
