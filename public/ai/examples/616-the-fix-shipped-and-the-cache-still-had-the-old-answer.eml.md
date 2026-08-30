<!-- canonical: efficientnewlanguage.org/ai/examples/616-the-fix-shipped-and-the-cache-still-had-the-old-answer | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 616 — The fix shipped and the cache still had the old answer

`the_fix_shipped_and_the_cache_still_had_the_old_answer.eml` - A fix is deployed to every server in forty seconds. The incident is closed. How long users keep seeing the bug is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A fix is
# deployed to every server in forty seconds. The incident is closed. How long
# users keep seeing the bug is computed below.
#
# The deploy is correct and it is fast. The rollout is atomic per server,
# health-gated, and reversible; forty seconds after the button, every process
# serving this endpoint is running the corrected code, and a request that
# reaches one of them gets the corrected answer. Nothing about the deploy is
# slow, partial, or in doubt.
#
# A response cache holds an ANSWER, not a version. It has no way to know that
# the code which produced its stored copy has been replaced, because the thing
# it stores is the output and the output has no version in it.
#
# So the fix is live and the wrong answer is still being served, from a cache
# that is behaving exactly as configured.

3600 => ttl_seconds
40 => rollout_seconds
180000 => requests_per_hour
96 => cache_hit_per_hundred

"cache TTL           : " + str(ttl_seconds) + " seconds" ^0
"rollout             : " + str(rollout_seconds) + " seconds" ^0
"requests per hour   : " + str(requests_per_hour) ^0
"served from cache   : " + str(cache_hit_per_hundred) + " percent" ^0
"" ^0

# ---- what the deploy did ----

"the deploy, against what it promises" ^0
"  servers running the fix after " + str(rollout_seconds) + "s : all of them" ^0
"  failed instances                  : 0" ^0
"  rollbacks                         : 0" ^0
"  requests reaching a server running old code, after " + str(rollout_seconds) + "s : 0" ^0
"  defects in the deploy             : 0" ^0
"" ^0
"  every claim on that list is true, and every one of them is" ^0
"  about servers" ^0
"" ^0

# ---- what users get ----

ttl_seconds - rollout_seconds => stale_window_seconds
int(requests_per_hour * ttl_seconds / 3600) => requests_in_ttl
int(requests_in_ttl * cache_hit_per_hundred / 100) => served_stale

"after the deploy completes" ^0
"  window where an entry can still be old : " + str(stale_window_seconds) + " seconds" ^0
"  requests in that window                : " + str(requests_in_ttl) ^0
"  of those, answered from cache          : " + str(served_stale) ^0
"  of those, answered by the fixed code   : " + str(requests_in_ttl - served_stale) ^0
"" ^0
int(served_stale * 100 / requests_in_ttl) => stale_share
"  share still getting the bug : " + str(stale_share) + " percent" ^0
"" ^0

# ---- the two clocks ----

"event                                   at" ^0
"  fix merged                            T minus 12 minutes" ^0
"  deploy starts                         T" ^0
"  deploy completes, incident closed     T plus " + str(rollout_seconds) + "s" ^0
"  last stale entry expires              T plus " + str(ttl_seconds) + "s" ^0
"" ^0
int(stale_window_seconds / 60) => stale_minutes
"  the incident is closed " + str(stale_minutes) + " minutes before the last user stops" ^0
"  seeing what it was closed for" ^0
"" ^0

# ---- what each dashboard shows in that window ----

"instrument              reads" ^0
"  deploy status         green, completed" ^0
"  error rate on servers 0, the fix works" ^0
"  cache hit rate        " + str(cache_hit_per_hundred) + " percent, healthy" ^0
"  incident state        resolved" ^0
"  users seeing the bug  " + str(served_stale) ^0
"" ^0
"  the first four are the ones anybody is looking at, and the" ^0
"  cache hit rate being HIGH is what makes the fifth large" ^0
"" ^0

# ---- the report that comes back ----
#
# A user reports the bug after the fix. The engineer checks the deploy, checks
# the code, cannot reproduce, and closes it. Every step of that is correct.

"the reopened report" ^0
"  user is on a cached response : yes" ^0
"  engineer requests the endpoint directly : cache miss, sees the fix" ^0
"  reproduced : no" ^0
"  conclusion : cannot reproduce" ^0
"" ^0
"  the engineer's request differs from the user's in the one" ^0
"  dimension nobody is comparing" ^0
"" ^0

# ---- the control ----
#
# The cache, on what it was put there to do. It removes 96 percent of the load
# from the origin, and it did that during the incident too.

int(requests_per_hour * cache_hit_per_hundred / 100) => origin_saved_per_hour

"control - is the cache earning its place" ^0
"  origin requests avoided per hour : " + str(origin_saved_per_hour) ^0
"  stale entries beyond the TTL     : 0" ^0
"  incorrect cache keys             : 0" ^0
"  defects in the cache             : 0" ^0
"" ^0
"  the cache is not wrong; it is answering a question about" ^0
"  freshness that was asked in seconds, with a fix that arrived" ^0
"  in a unit the cache does not have" ^0
"" ^0

# ---- the null control ----
#
# The same deploy and the same cache, with a purge issued as part of the
# rollout. Same TTL, same hit rate, same code.

8 => nc_purge_seconds
int(requests_per_hour * nc_purge_seconds / 3600) => nc_stale

"null control - the same deploy with a purge in the rollout" ^0
"  purge completes at   : T plus " + str(nc_purge_seconds) + "s" ^0
"  requests still stale : " + str(nc_stale) ^0
"  cache hit rate after : recovers to " + str(cache_hit_per_hundred) + " percent" ^0
"  TTL unchanged, hit rate unchanged, deploy unchanged" ^0
"  one step was added to the thing that already knew a change" ^0
"  had happened" ^0
"" ^0

# ---- the rule ----

"what 'deployed' is a statement about" ^0
"  which code the servers are running : exactly" ^0
"  which answers are in flight        : nothing" ^0
"  and every layer holding a previous answer - CDN, response" ^0
"  cache, client store, an open page - is a copy the deploy" ^0
"  cannot reach" ^0
"" ^0
"the thing to enumerate before closing an incident is not the" ^0
"servers, it is the places the wrong answer was allowed to rest" ^0
"" ^0

"The rollout finishes in " + str(rollout_seconds) + " seconds with 0 failed instances and 0 rollbacks, and" ^0
"after it no request reaches old code. For the next " + str(stale_minutes) + " minutes " + str(served_stale) + " requests" ^0
"- " + str(stale_share) + " percent of the " + str(requests_in_ttl) + " in that window - are answered from a cache holding" ^0
"the old output, which has no version in it to invalidate against, while the" ^0
"incident has already been marked resolved." ^0
```

## Python (deterministic transpilation)

```python
ttl_seconds = 3600
rollout_seconds = 40
requests_per_hour = 180000
cache_hit_per_hundred = 96
print("cache TTL           : " + str(ttl_seconds) + " seconds")
print("rollout             : " + str(rollout_seconds) + " seconds")
print("requests per hour   : " + str(requests_per_hour))
print("served from cache   : " + str(cache_hit_per_hundred) + " percent")
print("")
print("the deploy, against what it promises")
print("  servers running the fix after " + str(rollout_seconds) + "s : all of them")
print("  failed instances                  : 0")
print("  rollbacks                         : 0")
print("  requests reaching a server running old code, after " + str(rollout_seconds) + "s : 0")
print("  defects in the deploy             : 0")
print("")
print("  every claim on that list is true, and every one of them is")
print("  about servers")
print("")
stale_window_seconds = ttl_seconds - rollout_seconds
requests_in_ttl = int(requests_per_hour * ttl_seconds / 3600)
served_stale = int(requests_in_ttl * cache_hit_per_hundred / 100)
print("after the deploy completes")
print("  window where an entry can still be old : " + str(stale_window_seconds) + " seconds")
print("  requests in that window                : " + str(requests_in_ttl))
print("  of those, answered from cache          : " + str(served_stale))
print("  of those, answered by the fixed code   : " + str(requests_in_ttl - served_stale))
print("")
stale_share = int(served_stale * 100 / requests_in_ttl)
print("  share still getting the bug : " + str(stale_share) + " percent")
print("")
print("event                                   at")
print("  fix merged                            T minus 12 minutes")
print("  deploy starts                         T")
print("  deploy completes, incident closed     T plus " + str(rollout_seconds) + "s")
print("  last stale entry expires              T plus " + str(ttl_seconds) + "s")
print("")
stale_minutes = int(stale_window_seconds / 60)
print("  the incident is closed " + str(stale_minutes) + " minutes before the last user stops")
print("  seeing what it was closed for")
print("")
print("instrument              reads")
print("  deploy status         green, completed")
print("  error rate on servers 0, the fix works")
print("  cache hit rate        " + str(cache_hit_per_hundred) + " percent, healthy")
print("  incident state        resolved")
print("  users seeing the bug  " + str(served_stale))
print("")
print("  the first four are the ones anybody is looking at, and the")
print("  cache hit rate being HIGH is what makes the fifth large")
print("")
print("the reopened report")
print("  user is on a cached response : yes")
print("  engineer requests the endpoint directly : cache miss, sees the fix")
print("  reproduced : no")
print("  conclusion : cannot reproduce")
print("")
print("  the engineer's request differs from the user's in the one")
print("  dimension nobody is comparing")
print("")
origin_saved_per_hour = int(requests_per_hour * cache_hit_per_hundred / 100)
print("control - is the cache earning its place")
print("  origin requests avoided per hour : " + str(origin_saved_per_hour))
print("  stale entries beyond the TTL     : 0")
print("  incorrect cache keys             : 0")
print("  defects in the cache             : 0")
print("")
print("  the cache is not wrong; it is answering a question about")
print("  freshness that was asked in seconds, with a fix that arrived")
print("  in a unit the cache does not have")
print("")
nc_purge_seconds = 8
nc_stale = int(requests_per_hour * nc_purge_seconds / 3600)
print("null control - the same deploy with a purge in the rollout")
print("  purge completes at   : T plus " + str(nc_purge_seconds) + "s")
print("  requests still stale : " + str(nc_stale))
print("  cache hit rate after : recovers to " + str(cache_hit_per_hundred) + " percent")
print("  TTL unchanged, hit rate unchanged, deploy unchanged")
print("  one step was added to the thing that already knew a change")
print("  had happened")
print("")
print("what 'deployed' is a statement about")
print("  which code the servers are running : exactly")
print("  which answers are in flight        : nothing")
print("  and every layer holding a previous answer - CDN, response")
print("  cache, client store, an open page - is a copy the deploy")
print("  cannot reach")
print("")
print("the thing to enumerate before closing an incident is not the")
print("servers, it is the places the wrong answer was allowed to rest")
print("")
print("The rollout finishes in " + str(rollout_seconds) + " seconds with 0 failed instances and 0 rollbacks, and")
print("after it no request reaches old code. For the next " + str(stale_minutes) + " minutes " + str(served_stale) + " requests")
print("- " + str(stale_share) + " percent of the " + str(requests_in_ttl) + " in that window - are answered from a cache holding")
print("the old output, which has no version in it to invalidate against, while the")
print("incident has already been marked resolved.")
```

## stdout (executed)

```text
cache TTL           : 3600 seconds
rollout             : 40 seconds
requests per hour   : 180000
served from cache   : 96 percent

the deploy, against what it promises
  servers running the fix after 40s : all of them
  failed instances                  : 0
  rollbacks                         : 0
  requests reaching a server running old code, after 40s : 0
  defects in the deploy             : 0

  every claim on that list is true, and every one of them is
  about servers

after the deploy completes
  window where an entry can still be old : 3560 seconds
  requests in that window                : 180000
  of those, answered from cache          : 172800
  of those, answered by the fixed code   : 7200

  share still getting the bug : 96 percent

event                                   at
  fix merged                            T minus 12 minutes
  deploy starts                         T
  deploy completes, incident closed     T plus 40s
  last stale entry expires              T plus 3600s

  the incident is closed 59 minutes before the last user stops
  seeing what it was closed for

instrument              reads
  deploy status         green, completed
  error rate on servers 0, the fix works
  cache hit rate        96 percent, healthy
  incident state        resolved
  users seeing the bug  172800

  the first four are the ones anybody is looking at, and the
  cache hit rate being HIGH is what makes the fifth large

the reopened report
  user is on a cached response : yes
  engineer requests the endpoint directly : cache miss, sees the fix
  reproduced : no
  conclusion : cannot reproduce

  the engineer's request differs from the user's in the one
  dimension nobody is comparing

control - is the cache earning its place
  origin requests avoided per hour : 172800
  stale entries beyond the TTL     : 0
  incorrect cache keys             : 0
  defects in the cache             : 0

  the cache is not wrong; it is answering a question about
  freshness that was asked in seconds, with a fix that arrived
  in a unit the cache does not have

null control - the same deploy with a purge in the rollout
  purge completes at   : T plus 8s
  requests still stale : 400
  cache hit rate after : recovers to 96 percent
  TTL unchanged, hit rate unchanged, deploy unchanged
  one step was added to the thing that already knew a change
  had happened

what 'deployed' is a statement about
  which code the servers are running : exactly
  which answers are in flight        : nothing
  and every layer holding a previous answer - CDN, response
  cache, client store, an open page - is a copy the deploy
  cannot reach

the thing to enumerate before closing an incident is not the
servers, it is the places the wrong answer was allowed to rest

The rollout finishes in 40 seconds with 0 failed instances and 0 rollbacks, and
after it no request reaches old code. For the next 59 minutes 172800 requests
- 96 percent of the 180000 in that window - are answered from a cache holding
the old output, which has no version in it to invalidate against, while the
incident has already been marked resolved.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
