<!-- canonical: efficientnewlanguage.org/ai/examples/675-the-cache-was-invalidated-and-the-cdn-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 675 — The cache was invalidated and the cdn was not

`the_cache_was_invalidated_and_the_cdn_was_not.eml` - The application purges its cache on every write and the purge is verified within the request. What a user sees is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The application
# purges its cache on every write and the purge is verified within the request.
# What a user sees is computed below.
#
# The invalidation is correct and it is the hard kind. The write and the purge
# are in the same transaction boundary, the purge is confirmed before the
# response returns rather than fired and forgotten, a read immediately after a
# write is verified to return the new value, and there is a test that fails if
# anyone makes the purge asynchronous.
#
# It invalidates the cache the application OWNS. The rendered page is also held
# at the edge, by a system with its own expiry, which the application does not
# call and would need a credential to.
#
# The edge holds a page for an hour.

18400 => writes_per_day
3600 => cdn_ttl_seconds
24000000 => requests_per_day
1940000 => requests_served_a_version_older_than_the_origin
0 => origin_staleness_incidents

int(cdn_ttl_seconds / 2) => mean_stale_seconds
int(requests_served_a_version_older_than_the_origin * 10000 / requests_per_day) => stale_per_myriad

"writes per day                  : " + str(writes_per_day) ^0
"requests per day                : " + str(requests_per_day) ^0
"edge ttl, seconds               : " + str(cdn_ttl_seconds) ^0
"mean staleness after a write, s : " + str(mean_stale_seconds) ^0
"" ^0
"served older than the origin    : " + str(requests_served_a_version_older_than_the_origin) ^0
"share                           : " + str(stale_per_myriad) + " per ten thousand" ^0
"origin staleness incidents      : " + str(origin_staleness_incidents) ^0
"" ^0

# ---- what the purge verified ----

"the application cache" ^0
"  purge and write in one boundary : yes" ^0
"  confirmed before the response returns : yes, not fired" ^0
"    and forgotten" ^0
"  read after write returns the new value : verified" ^0
"  a test fails if the purge becomes asynchronous : yes" ^0
"  staleness incidents at the origin : " + str(origin_staleness_incidents) ^0
"  verdict           : INVALIDATED" ^0
"" ^0
"  this is the careful version; the easy version is a fire-" ^0
"  and-forget purge and somebody deliberately did not write" ^0
"  that" ^0
"" ^0

# ---- the second copy ----

"where else the page lives" ^0
"  the edge          : holds the rendered page" ^0
"  its expiry        : " + str(cdn_ttl_seconds) + " seconds, its own setting" ^0
"  the application calls it : no" ^0
"  could it          : with a credential nobody has issued" ^0
"  does the origin know its content is cached there : no" ^0
"" ^0
"  the two caches are correct and neither is aware of the" ^0
"  other; only the request path knows both exist" ^0
"" ^0

# ---- what the verification measured ----

# The read-after-write test runs against the origin, because that is what the
# test can reach. It is a true statement about the layer it queries.
"the read-after-write test" ^0
"  queries        : the origin" ^0
"  passes         : always" ^0
"  what it proves : the origin is fresh" ^0
"  what a user reaches : the edge" ^0
"  a test that queries the edge : would need to run from" ^0
"    outside, and does not exist" ^0
"" ^0

# ---- null control ----

# The same purge, extended to call the edge's invalidation API with a
# credential issued for it.
0 => nc_requests_served_stale
origin_staleness_incidents => nc_origin_incidents

"null control - the purge also invalidates the edge" ^0
"  origin staleness incidents : " + str(nc_origin_incidents) + ", unchanged" ^0
"  served older than the origin : " + str(nc_requests_served_stale) ^0
"  the application cache did not improve; the purge reached" ^0
"  the copy the user actually reads" ^0
"" ^0

# ---- the rule ----

"what a verified cache purge guarantees" ^0
"  this cache no longer holds the old value : exactly" ^0
"  no cache holds the old value             : not addressed;" ^0
"    the purge names one store, and a request passes" ^0
"    through every store between the user and the origin" ^0
"" ^0
"invalidation is per-cache and freshness is per-path; a purge" ^0
"is only as complete as the list of caches somebody wrote" ^0
"down, and the one in front is usually owned by another team" ^0
"" ^0

"The purge is the careful kind: in the write's boundary, confirmed before the" ^0
"response, read-after-write verified, with a test that fails if it is made" ^0
"asynchronous, and " + str(origin_staleness_incidents) + " staleness incidents at the origin. The edge holds the" ^0
"same page for " + str(cdn_ttl_seconds) + " seconds and is never called, so " + str(requests_served_a_version_older_than_the_origin) + " requests a day -" ^0
str(stale_per_myriad) + " per ten thousand - are served a version the origin no longer has." ^0
```

## Python (deterministic transpilation)

```python
writes_per_day = 18400
cdn_ttl_seconds = 3600
requests_per_day = 24000000
requests_served_a_version_older_than_the_origin = 1940000
origin_staleness_incidents = 0
mean_stale_seconds = int(cdn_ttl_seconds / 2)
stale_per_myriad = int(requests_served_a_version_older_than_the_origin * 10000 / requests_per_day)
print("writes per day                  : " + str(writes_per_day))
print("requests per day                : " + str(requests_per_day))
print("edge ttl, seconds               : " + str(cdn_ttl_seconds))
print("mean staleness after a write, s : " + str(mean_stale_seconds))
print("")
print("served older than the origin    : " + str(requests_served_a_version_older_than_the_origin))
print("share                           : " + str(stale_per_myriad) + " per ten thousand")
print("origin staleness incidents      : " + str(origin_staleness_incidents))
print("")
print("the application cache")
print("  purge and write in one boundary : yes")
print("  confirmed before the response returns : yes, not fired")
print("    and forgotten")
print("  read after write returns the new value : verified")
print("  a test fails if the purge becomes asynchronous : yes")
print("  staleness incidents at the origin : " + str(origin_staleness_incidents))
print("  verdict           : INVALIDATED")
print("")
print("  this is the careful version; the easy version is a fire-")
print("  and-forget purge and somebody deliberately did not write")
print("  that")
print("")
print("where else the page lives")
print("  the edge          : holds the rendered page")
print("  its expiry        : " + str(cdn_ttl_seconds) + " seconds, its own setting")
print("  the application calls it : no")
print("  could it          : with a credential nobody has issued")
print("  does the origin know its content is cached there : no")
print("")
print("  the two caches are correct and neither is aware of the")
print("  other; only the request path knows both exist")
print("")
print("the read-after-write test")
print("  queries        : the origin")
print("  passes         : always")
print("  what it proves : the origin is fresh")
print("  what a user reaches : the edge")
print("  a test that queries the edge : would need to run from")
print("    outside, and does not exist")
print("")
nc_requests_served_stale = 0
nc_origin_incidents = origin_staleness_incidents
print("null control - the purge also invalidates the edge")
print("  origin staleness incidents : " + str(nc_origin_incidents) + ", unchanged")
print("  served older than the origin : " + str(nc_requests_served_stale))
print("  the application cache did not improve; the purge reached")
print("  the copy the user actually reads")
print("")
print("what a verified cache purge guarantees")
print("  this cache no longer holds the old value : exactly")
print("  no cache holds the old value             : not addressed;")
print("    the purge names one store, and a request passes")
print("    through every store between the user and the origin")
print("")
print("invalidation is per-cache and freshness is per-path; a purge")
print("is only as complete as the list of caches somebody wrote")
print("down, and the one in front is usually owned by another team")
print("")
print("The purge is the careful kind: in the write's boundary, confirmed before the")
print("response, read-after-write verified, with a test that fails if it is made")
print("asynchronous, and " + str(origin_staleness_incidents) + " staleness incidents at the origin. The edge holds the")
print("same page for " + str(cdn_ttl_seconds) + " seconds and is never called, so " + str(requests_served_a_version_older_than_the_origin) + " requests a day -")
print(str(stale_per_myriad) + " per ten thousand - are served a version the origin no longer has.")
```

## stdout (executed)

```text
writes per day                  : 18400
requests per day                : 24000000
edge ttl, seconds               : 3600
mean staleness after a write, s : 1800

served older than the origin    : 1940000
share                           : 808 per ten thousand
origin staleness incidents      : 0

the application cache
  purge and write in one boundary : yes
  confirmed before the response returns : yes, not fired
    and forgotten
  read after write returns the new value : verified
  a test fails if the purge becomes asynchronous : yes
  staleness incidents at the origin : 0
  verdict           : INVALIDATED

  this is the careful version; the easy version is a fire-
  and-forget purge and somebody deliberately did not write
  that

where else the page lives
  the edge          : holds the rendered page
  its expiry        : 3600 seconds, its own setting
  the application calls it : no
  could it          : with a credential nobody has issued
  does the origin know its content is cached there : no

  the two caches are correct and neither is aware of the
  other; only the request path knows both exist

the read-after-write test
  queries        : the origin
  passes         : always
  what it proves : the origin is fresh
  what a user reaches : the edge
  a test that queries the edge : would need to run from
    outside, and does not exist

null control - the purge also invalidates the edge
  origin staleness incidents : 0, unchanged
  served older than the origin : 0
  the application cache did not improve; the purge reached
  the copy the user actually reads

what a verified cache purge guarantees
  this cache no longer holds the old value : exactly
  no cache holds the old value             : not addressed;
    the purge names one store, and a request passes
    through every store between the user and the origin

invalidation is per-cache and freshness is per-path; a purge
is only as complete as the list of caches somebody wrote
down, and the one in front is usually owned by another team

The purge is the careful kind: in the write's boundary, confirmed before the
response, read-after-write verified, with a test that fails if it is made
asynchronous, and 0 staleness incidents at the origin. The edge holds the
same page for 3600 seconds and is never called, so 1940000 requests a day -
808 per ten thousand - are served a version the origin no longer has.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
