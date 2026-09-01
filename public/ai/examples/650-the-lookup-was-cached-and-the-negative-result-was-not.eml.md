<!-- canonical: efficientnewlanguage.org/ai/examples/650-the-lookup-was-cached-and-the-negative-result-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 650 — The lookup was cached and the negative result was not

`the_lookup_was_cached_and_the_negative_result_was_not.eml` - The cache reports a ninety-nine point four percent hit rate and the number is correct. Where the database load comes from is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The cache reports
# a ninety-nine point four percent hit rate and the number is correct. Where the
# database load comes from is computed below.
#
# The cache is doing its job. Forty-one thousand three hundred and fifty lookups
# a second are answered without touching the database, the eviction policy was
# tuned against real traces, and removing the cache would take the database down
# in seconds. The hit rate is not inflated and it is not a vanity metric.
#
# A hit rate is computed over lookups that CAN hit. A key that does not exist
# produces no entry to store, so it is not a miss the cache could have avoided —
# it is a lookup the cache is structurally unable to serve, and it is not in the
# denominator.
#
# Something is enumerating identifiers. All of that traffic is absent keys.

48000 => lookups_per_second
41600 => lookups_for_existing_keys
41350 => cache_hits
0 => cache_correctness_incidents

lookups_per_second - lookups_for_existing_keys => lookups_for_absent_keys
lookups_for_existing_keys - cache_hits => misses_on_existing_keys
misses_on_existing_keys + lookups_for_absent_keys => database_queries_per_second
int(cache_hits * 10000 / lookups_for_existing_keys) => reported_hit_rate_per_myriad

"lookups per second           : " + str(lookups_per_second) ^0
"  for keys that exist        : " + str(lookups_for_existing_keys) ^0
"  for keys that do not       : " + str(lookups_for_absent_keys) ^0
"" ^0
"cache hits                   : " + str(cache_hits) ^0
"misses on existing keys      : " + str(misses_on_existing_keys) ^0
"database queries per second  : " + str(database_queries_per_second) ^0
"" ^0

# ---- what the hit rate measures ----

"the reported hit rate" ^0
"  numerator   : " + str(cache_hits) ^0
"  denominator : " + str(lookups_for_existing_keys) ^0
"  rate        : " + str(reported_hit_rate_per_myriad) + " per ten thousand" ^0
"  correctness incidents : " + str(cache_correctness_incidents) ^0
"  verdict     : HEALTHY" ^0
"" ^0
"  both operands are right and the ratio is right; the" ^0
"  denominator is the set of lookups a cache could serve" ^0
"" ^0

# ---- where the database load is ----

int(lookups_for_absent_keys * 10000 / database_queries_per_second) => absent_share_of_db_per_myriad
"database load, by cause" ^0
"  misses on existing keys : " + str(misses_on_existing_keys) ^0
"  lookups for absent keys : " + str(lookups_for_absent_keys) ^0
"  share from absent keys  : " + str(absent_share_of_db_per_myriad) + " per ten thousand" ^0
"" ^0
"  the cache is at " + str(reported_hit_rate_per_myriad) + " per ten thousand and " + str(absent_share_of_db_per_myriad) + " per ten" ^0
"  thousand of what reaches the database is traffic it was" ^0
"  never asked about" ^0
"" ^0

# ---- why raising the cache size does nothing ----

# The obvious response to database load under a cache is a bigger cache. Every
# absent key is a distinct identifier that will never be requested again, so
# there is nothing to retain.
"the usual remedy" ^0
"  double the cache size          : possible" ^0
"  additional absent keys served  : 0" ^0
"  additional existing keys served: at most " + str(misses_on_existing_keys) ^0
"  ceiling on the improvement     : " + str(misses_on_existing_keys) + " of " + str(database_queries_per_second) ^0
"" ^0

# ---- null control ----

# The same cache, storing a short-lived marker for keys that were looked up and
# not found.
60 => nc_negative_ttl_seconds
0 => nc_repeat_lookups_for_the_same_absent_key
misses_on_existing_keys => nc_database_queries_per_second

"null control - absence cached for 60 seconds" ^0
"  hit rate on existing keys : " + str(reported_hit_rate_per_myriad) + " per ten thousand, unchanged" ^0
"  repeat lookups for one absent key reaching the database : " ^0
"    " + str(nc_repeat_lookups_for_the_same_absent_key) + " after the first" ^0
"  database queries per second : " + str(nc_database_queries_per_second) + ", for an enumerator" ^0
"    that never repeats a key this is the wrong control and" ^0
"    it is stated as such: negative caching helps repeats," ^0
"    and enumeration has none" ^0
"" ^0

# ---- the rule ----

"what a high hit rate guarantees" ^0
"  cacheable lookups are being cached : exactly" ^0
"  the database is protected            : not addressed;" ^0
"    the ratio's denominator excludes precisely the traffic" ^0
"    the cache cannot absorb" ^0
"" ^0
"a rate is a claim about its denominator; when the denominator" ^0
"is 'the work this component can do', the rate cannot report" ^0
"the work it cannot" ^0
"" ^0

"The cache is at " + str(reported_hit_rate_per_myriad) + " per ten thousand with " + str(cache_correctness_incidents) + " correctness incidents, and both" ^0
"operands of that ratio are right. Of the " + str(database_queries_per_second) + " queries a second reaching the" ^0
"database, " + str(lookups_for_absent_keys) + " are lookups for keys that do not exist - " + str(absent_share_of_db_per_myriad) + " per ten thousand -" ^0
"which are not misses, are not in the denominator, and are not reduced by any" ^0
"cache size, because each identifier is asked for once and never again." ^0
```

## Python (deterministic transpilation)

```python
lookups_per_second = 48000
lookups_for_existing_keys = 41600
cache_hits = 41350
cache_correctness_incidents = 0
lookups_for_absent_keys = lookups_per_second - lookups_for_existing_keys
misses_on_existing_keys = lookups_for_existing_keys - cache_hits
database_queries_per_second = misses_on_existing_keys + lookups_for_absent_keys
reported_hit_rate_per_myriad = int(cache_hits * 10000 / lookups_for_existing_keys)
print("lookups per second           : " + str(lookups_per_second))
print("  for keys that exist        : " + str(lookups_for_existing_keys))
print("  for keys that do not       : " + str(lookups_for_absent_keys))
print("")
print("cache hits                   : " + str(cache_hits))
print("misses on existing keys      : " + str(misses_on_existing_keys))
print("database queries per second  : " + str(database_queries_per_second))
print("")
print("the reported hit rate")
print("  numerator   : " + str(cache_hits))
print("  denominator : " + str(lookups_for_existing_keys))
print("  rate        : " + str(reported_hit_rate_per_myriad) + " per ten thousand")
print("  correctness incidents : " + str(cache_correctness_incidents))
print("  verdict     : HEALTHY")
print("")
print("  both operands are right and the ratio is right; the")
print("  denominator is the set of lookups a cache could serve")
print("")
absent_share_of_db_per_myriad = int(lookups_for_absent_keys * 10000 / database_queries_per_second)
print("database load, by cause")
print("  misses on existing keys : " + str(misses_on_existing_keys))
print("  lookups for absent keys : " + str(lookups_for_absent_keys))
print("  share from absent keys  : " + str(absent_share_of_db_per_myriad) + " per ten thousand")
print("")
print("  the cache is at " + str(reported_hit_rate_per_myriad) + " per ten thousand and " + str(absent_share_of_db_per_myriad) + " per ten")
print("  thousand of what reaches the database is traffic it was")
print("  never asked about")
print("")
print("the usual remedy")
print("  double the cache size          : possible")
print("  additional absent keys served  : 0")
print("  additional existing keys served: at most " + str(misses_on_existing_keys))
print("  ceiling on the improvement     : " + str(misses_on_existing_keys) + " of " + str(database_queries_per_second))
print("")
nc_negative_ttl_seconds = 60
nc_repeat_lookups_for_the_same_absent_key = 0
nc_database_queries_per_second = misses_on_existing_keys
print("null control - absence cached for 60 seconds")
print("  hit rate on existing keys : " + str(reported_hit_rate_per_myriad) + " per ten thousand, unchanged")
print("  repeat lookups for one absent key reaching the database : ")
print("    " + str(nc_repeat_lookups_for_the_same_absent_key) + " after the first")
print("  database queries per second : " + str(nc_database_queries_per_second) + ", for an enumerator")
print("    that never repeats a key this is the wrong control and")
print("    it is stated as such: negative caching helps repeats,")
print("    and enumeration has none")
print("")
print("what a high hit rate guarantees")
print("  cacheable lookups are being cached : exactly")
print("  the database is protected            : not addressed;")
print("    the ratio's denominator excludes precisely the traffic")
print("    the cache cannot absorb")
print("")
print("a rate is a claim about its denominator; when the denominator")
print("is 'the work this component can do', the rate cannot report")
print("the work it cannot")
print("")
print("The cache is at " + str(reported_hit_rate_per_myriad) + " per ten thousand with " + str(cache_correctness_incidents) + " correctness incidents, and both")
print("operands of that ratio are right. Of the " + str(database_queries_per_second) + " queries a second reaching the")
print("database, " + str(lookups_for_absent_keys) + " are lookups for keys that do not exist - " + str(absent_share_of_db_per_myriad) + " per ten thousand -")
print("which are not misses, are not in the denominator, and are not reduced by any")
print("cache size, because each identifier is asked for once and never again.")
```

## stdout (executed)

```text
lookups per second           : 48000
  for keys that exist        : 41600
  for keys that do not       : 6400

cache hits                   : 41350
misses on existing keys      : 250
database queries per second  : 6650

the reported hit rate
  numerator   : 41350
  denominator : 41600
  rate        : 9939 per ten thousand
  correctness incidents : 0
  verdict     : HEALTHY

  both operands are right and the ratio is right; the
  denominator is the set of lookups a cache could serve

database load, by cause
  misses on existing keys : 250
  lookups for absent keys : 6400
  share from absent keys  : 9624 per ten thousand

  the cache is at 9939 per ten thousand and 9624 per ten
  thousand of what reaches the database is traffic it was
  never asked about

the usual remedy
  double the cache size          : possible
  additional absent keys served  : 0
  additional existing keys served: at most 250
  ceiling on the improvement     : 250 of 6650

null control - absence cached for 60 seconds
  hit rate on existing keys : 9939 per ten thousand, unchanged
  repeat lookups for one absent key reaching the database : 
    0 after the first
  database queries per second : 250, for an enumerator
    that never repeats a key this is the wrong control and
    it is stated as such: negative caching helps repeats,
    and enumeration has none

what a high hit rate guarantees
  cacheable lookups are being cached : exactly
  the database is protected            : not addressed;
    the ratio's denominator excludes precisely the traffic
    the cache cannot absorb

a rate is a claim about its denominator; when the denominator
is 'the work this component can do', the rate cannot report
the work it cannot

The cache is at 9939 per ten thousand with 0 correctness incidents, and both
operands of that ratio are right. Of the 6650 queries a second reaching the
database, 6400 are lookups for keys that do not exist - 9624 per ten thousand -
which are not misses, are not in the denominator, and are not reduced by any
cache size, because each identifier is asked for once and never again.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
