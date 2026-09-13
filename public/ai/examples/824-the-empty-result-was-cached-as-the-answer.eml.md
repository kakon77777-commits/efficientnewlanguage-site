<!-- canonical: efficientnewlanguage.org/ai/examples/824-the-empty-result-was-cached-as-the-answer | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 824 — The empty result was cached as the answer

`the_empty_result_was_cached_as_the_answer.eml` - The lookup service served every request from cache with a 300-second freshness window, and every value it served was within that window. What a failed fetch stored is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The lookup service
# served every request from cache with a 300-second freshness window, and every
# value it served was within that window. What a failed fetch stored is computed
# below.
#
# The cache is disciplined. It stores only what a fetch returned, never a
# fabricated value; every entry carries a TTL and is refetched on expiry; the
# hit rate and latency are on a dashboard; and a stored value is exactly the
# bytes the backend sent.
#
# One backend fetch timed out and returned an empty list, and the empty list was
# cached like any other answer.

300 => cache_ttl_seconds
40000 => reads_in_the_window
1 => backend_fetches_that_timed_out
1200 => rows_that_actually_existed
0 => errors_surfaced_to_callers

reads_in_the_window - backend_fetches_that_timed_out => reads_served_from_the_cached_empty
int(reads_served_from_the_cached_empty * 10000 / reads_in_the_window) => reads_given_a_false_none_per_myriad

"cache TTL                       : " + str(cache_ttl_seconds) + " seconds" ^0
"reads in the window             : " + str(reads_in_the_window) ^0
"  backend fetches that timed out: " + str(backend_fetches_that_timed_out) ^0
"  served from the cached empty  : " + str(reads_served_from_the_cached_empty) ^0
"rows that actually existed      : " + str(rows_that_actually_existed) ^0
"errors surfaced to callers      : " + str(errors_surfaced_to_callers) ^0
"reads given a false 'none'      : " + str(reads_given_a_false_none_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the cache verified ----

"the cache" ^0
"  stores : only what a fetch returned" ^0
"  TTL : on every entry, refetched on expiry" ^0
"  hit rate and latency : on a dashboard" ^0
"  a stored value : exactly the backend's bytes" ^0
"  fabricated values stored : 0" ^0
"  verdict : SERVING FRESH" ^0
"" ^0
"  never storing a fabricated value is the part done right" ^0
"  here, and it is why a cached answer is trusted to be a" ^0
"  real answer" ^0
"" ^0

# ---- what a failed fetch returned ----

"the timed-out fetch" ^0
"  what the backend sent on timeout : an empty list" ^0
"  what an empty list is, to the cache : a value, like" ^0
"    any other" ^0
"  stored with : the normal 300-second TTL" ^0
"  what it means : 'no rows', authoritatively, for five" ^0
"    minutes" ^0
"  what it should have meant : the fetch failed, do not" ^0
"    cache" ^0
"" ^0

# ---- what the callers got ----

"the callers during the window" ^0
"  reads served the cached empty : " ^0
"    " + str(reads_served_from_the_cached_empty) ^0
"  rows they should have seen : " + str(rows_that_actually_existed) ^0
"  what they got : none, and no error" ^0
"  is the cache serving stale data : no; the empty is" ^0
"    inside its TTL" ^0
"  is empty the answer : no; it is the shape of a failure" ^0
"    that looks like an answer" ^0
"" ^0

# ---- null control ----

# The same window, with a failed fetch left uncached so the next read retries
# the backend instead of being served a stored emptiness.
40000 => nc_reads_in_the_window
0 => nc_false_none_when_failures_are_not_cached
39999 => nc_reads_that_would_have_retried

"null control - do not cache a failed fetch" ^0
"  reads in the window : " + str(nc_reads_in_the_window) + ", unchanged" ^0
"  false 'none' served : " + str(nc_false_none_when_failures_are_not_cached) ^0
"  reads that would have retried the backend : " ^0
"    " + str(nc_reads_that_would_have_retried) ^0
"  no row and no TTL changed; a failure stopped being" ^0
"  stored as though it were a result" ^0
"" ^0

# ---- the rule ----

"what a fresh cache guarantees" ^0
"  every value served is within its TTL and is what a" ^0
"    fetch returned : exactly, no fabricated values" ^0
"  the result set is current : not addressed; a failed" ^0
"    fetch returned empty and the empty was cached like any" ^0
"    answer - " + str(reads_served_from_the_cached_empty) + " reads got an authoritative 'none'" ^0
"    while " + str(rows_that_actually_existed) + " rows existed, and " + str(errors_surfaced_to_callers) + " errors surfaced" ^0
"" ^0

"an empty result and a failed fetch have the same shape and opposite meanings;" ^0
"a cache that cannot tell them apart preserves a failure as fact and serves it," ^0
"fresh and wrong, until it expires" ^0
"" ^0

"It caches only real fetch bytes with a TTL and never fabricates - every value" ^0
"fresh. A timed-out fetch returned empty and the empty was cached, so " ^0
"" + str(reads_served_from_the_cached_empty) + " reads got an authoritative none over " + str(rows_that_actually_existed) + " real rows, " ^0
"" + str(reads_given_a_false_none_per_myriad) + " per ten thousand of the window, under " + str(errors_surfaced_to_callers) + " errors." ^0
```

## Python (deterministic transpilation)

```python
cache_ttl_seconds = 300
reads_in_the_window = 40000
backend_fetches_that_timed_out = 1
rows_that_actually_existed = 1200
errors_surfaced_to_callers = 0
reads_served_from_the_cached_empty = reads_in_the_window - backend_fetches_that_timed_out
reads_given_a_false_none_per_myriad = int(reads_served_from_the_cached_empty * 10000 / reads_in_the_window)
print("cache TTL                       : " + str(cache_ttl_seconds) + " seconds")
print("reads in the window             : " + str(reads_in_the_window))
print("  backend fetches that timed out: " + str(backend_fetches_that_timed_out))
print("  served from the cached empty  : " + str(reads_served_from_the_cached_empty))
print("rows that actually existed      : " + str(rows_that_actually_existed))
print("errors surfaced to callers      : " + str(errors_surfaced_to_callers))
print("reads given a false 'none'      : " + str(reads_given_a_false_none_per_myriad) + " per ten thousand")
print("")
print("the cache")
print("  stores : only what a fetch returned")
print("  TTL : on every entry, refetched on expiry")
print("  hit rate and latency : on a dashboard")
print("  a stored value : exactly the backend's bytes")
print("  fabricated values stored : 0")
print("  verdict : SERVING FRESH")
print("")
print("  never storing a fabricated value is the part done right")
print("  here, and it is why a cached answer is trusted to be a")
print("  real answer")
print("")
print("the timed-out fetch")
print("  what the backend sent on timeout : an empty list")
print("  what an empty list is, to the cache : a value, like")
print("    any other")
print("  stored with : the normal 300-second TTL")
print("  what it means : 'no rows', authoritatively, for five")
print("    minutes")
print("  what it should have meant : the fetch failed, do not")
print("    cache")
print("")
print("the callers during the window")
print("  reads served the cached empty : ")
print("    " + str(reads_served_from_the_cached_empty))
print("  rows they should have seen : " + str(rows_that_actually_existed))
print("  what they got : none, and no error")
print("  is the cache serving stale data : no; the empty is")
print("    inside its TTL")
print("  is empty the answer : no; it is the shape of a failure")
print("    that looks like an answer")
print("")
nc_reads_in_the_window = 40000
nc_false_none_when_failures_are_not_cached = 0
nc_reads_that_would_have_retried = 39999
print("null control - do not cache a failed fetch")
print("  reads in the window : " + str(nc_reads_in_the_window) + ", unchanged")
print("  false 'none' served : " + str(nc_false_none_when_failures_are_not_cached))
print("  reads that would have retried the backend : ")
print("    " + str(nc_reads_that_would_have_retried))
print("  no row and no TTL changed; a failure stopped being")
print("  stored as though it were a result")
print("")
print("what a fresh cache guarantees")
print("  every value served is within its TTL and is what a")
print("    fetch returned : exactly, no fabricated values")
print("  the result set is current : not addressed; a failed")
print("    fetch returned empty and the empty was cached like any")
print("    answer - " + str(reads_served_from_the_cached_empty) + " reads got an authoritative 'none'")
print("    while " + str(rows_that_actually_existed) + " rows existed, and " + str(errors_surfaced_to_callers) + " errors surfaced")
print("")
print("an empty result and a failed fetch have the same shape and opposite meanings;")
print("a cache that cannot tell them apart preserves a failure as fact and serves it,")
print("fresh and wrong, until it expires")
print("")
print("It caches only real fetch bytes with a TTL and never fabricates - every value")
print("fresh. A timed-out fetch returned empty and the empty was cached, so ")
print("" + str(reads_served_from_the_cached_empty) + " reads got an authoritative none over " + str(rows_that_actually_existed) + " real rows, ")
print("" + str(reads_given_a_false_none_per_myriad) + " per ten thousand of the window, under " + str(errors_surfaced_to_callers) + " errors.")
```

## stdout (executed)

```text
cache TTL                       : 300 seconds
reads in the window             : 40000
  backend fetches that timed out: 1
  served from the cached empty  : 39999
rows that actually existed      : 1200
errors surfaced to callers      : 0
reads given a false 'none'      : 9999 per ten thousand

the cache
  stores : only what a fetch returned
  TTL : on every entry, refetched on expiry
  hit rate and latency : on a dashboard
  a stored value : exactly the backend's bytes
  fabricated values stored : 0
  verdict : SERVING FRESH

  never storing a fabricated value is the part done right
  here, and it is why a cached answer is trusted to be a
  real answer

the timed-out fetch
  what the backend sent on timeout : an empty list
  what an empty list is, to the cache : a value, like
    any other
  stored with : the normal 300-second TTL
  what it means : 'no rows', authoritatively, for five
    minutes
  what it should have meant : the fetch failed, do not
    cache

the callers during the window
  reads served the cached empty : 
    39999
  rows they should have seen : 1200
  what they got : none, and no error
  is the cache serving stale data : no; the empty is
    inside its TTL
  is empty the answer : no; it is the shape of a failure
    that looks like an answer

null control - do not cache a failed fetch
  reads in the window : 40000, unchanged
  false 'none' served : 0
  reads that would have retried the backend : 
    39999
  no row and no TTL changed; a failure stopped being
  stored as though it were a result

what a fresh cache guarantees
  every value served is within its TTL and is what a
    fetch returned : exactly, no fabricated values
  the result set is current : not addressed; a failed
    fetch returned empty and the empty was cached like any
    answer - 39999 reads got an authoritative 'none'
    while 1200 rows existed, and 0 errors surfaced

an empty result and a failed fetch have the same shape and opposite meanings;
a cache that cannot tell them apart preserves a failure as fact and serves it,
fresh and wrong, until it expires

It caches only real fetch bytes with a TTL and never fabricates - every value
fresh. A timed-out fetch returned empty and the empty was cached, so 
39999 reads got an authoritative none over 1200 real rows, 
9999 per ten thousand of the window, under 0 errors.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
