<!-- canonical: efficientnewlanguage.org/ai/examples/338-over-invalidation-hides-a-broken-cache-key | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 338 — Over-invalidation hides a broken cache key — and the cache never worked

`over_invalidation_hides_a_broken_cache_key.eml` sweeps a cache's flush interval and reports when a key that drops a field starts answering.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A cache key that
# drops a field, and a flush policy so aggressive that the key never gets to be
# wrong out loud.
#
# The key is the user id. The rendered page depends on the user AND the locale.
# Two requests from one user in two locales share a cache entry, so the second
# one can be served the first one's page. That is a defect and it has been
# there since the key was written.
#
# It has never produced a wrong answer, because the cache is flushed every
# request. Which also means the cache has never produced a HIT, so it has never
# done the one job it exists for. The day someone relaxes the flush interval -
# a pure performance change, touching nothing about keys - the defect starts
# answering.
#
# The program sweeps the flush interval, and runs the same sweep against a
# correct key so the policy and the defect can be told apart. Nothing is
# declared: every served page is compared against a freshly rendered one.

def render(user, locale):
    return user + "@" + locale

def key_broken(user, locale):
    return user

def key_correct(user, locale):
    return user + "|" + locale

def simulate(requests, flush_every, broken):
    {} => cache
    0 => since_flush
    0 => wrong
    0 => hits
    for r in requests:
        r[0] => user
        r[1] => locale
        if broken == 1:
            key_broken(user, locale) => k
        else:
            key_correct(user, locale) => k
        if k in cache:
            hits + 1 => hits
            cache[k] => served
        else:
            render(user, locale) => served
            served => cache[k]
        if served != render(user, locale):
            wrong + 1 => wrong
        since_flush + 1 => since_flush
        if since_flush >= flush_every:
            {} => cache
            0 => since_flush
    return [wrong, hits]

[["ana", "en"], ["ana", "fr"], ["bo", "en"], ["ana", "en"], ["bo", "de"], ["cy", "en"], ["ana", "fr"], ["bo", "en"], ["cy", "jp"], ["ana", "en"], ["bo", "de"], ["cy", "en"]] => requests

[1, 2, 3, 4, 6, 12] => policies

# ---- the shipped system, as the flush interval is relaxed ----

"broken key: wrong answers served, and cache hits, by flush interval" ^0
for f in policies:
    simulate(requests, f, 1) => r
    "  flush every " + str(f) + " : wrong " + str(r[0]) + ", hits " + str(r[1]) ^0
"" ^0

# ---- the same sweep with a key that keeps the locale ----

"correct key: the same sweep" ^0
for f in policies:
    simulate(requests, f, 0) => r
    "  flush every " + str(f) + " : wrong " + str(r[0]) + ", hits " + str(r[1]) ^0
"" ^0

# ---- what the shipped policy buys ----

simulate(requests, 1, 1) => shipped
"the shipped policy, flush every 1" ^0
"  wrong answers : " + str(shipped[0]) ^0
"  cache hits    : " + str(shipped[1]) ^0
if shipped[1] == 0:
    "  the cache has never returned anything it stored" ^0
"" ^0

# ---- the first policy at which the defect speaks ----

[] => first_wrong
0 => policies_clean
for f in policies:
    simulate(requests, f, 1) => r
    if r[0] == 0:
        policies_clean + 1 => policies_clean
    else:
        if len(first_wrong) == 0:
            [f, r[0], r[1]] => first_wrong
"flush intervals under which the broken key is silent: " + str(policies_clean) + " of " + str(len(policies)) ^0
if len(first_wrong) > 0:
    "  first interval that serves a wrong page: " + str(first_wrong[0]) ^0
    "  wrong answers there                    : " + str(first_wrong[1]) ^0
    "  cache hits there                       : " + str(first_wrong[2]) ^0
"" ^0

# ---- the metric that would defend the broken key ----
#
# A cache is justified by its hit rate. A key that collides produces EXTRA
# hits, because two different requests land on one entry. So the number
# anybody would quote to keep this key is inflated by the defect itself.

"cache hits, broken key minus correct key" ^0
0 => policies_where_broken_wins
0 => extra_equals_wrong
for f in policies:
    simulate(requests, f, 1) => b
    simulate(requests, f, 0) => c
    b[1] - c[1] => extra
    "  flush every " + str(f) + " : " + str(b[1]) + " vs " + str(c[1]) + ", extra " + str(extra) + ", wrong " + str(b[0]) ^0
    if extra > 0:
        policies_where_broken_wins + 1 => policies_where_broken_wins
    if extra == b[0]:
        extra_equals_wrong + 1 => extra_equals_wrong
"  intervals where the broken key looks like the better cache: " + str(policies_where_broken_wins) + " of " + str(len(policies)) ^0
"  intervals where every extra hit is exactly a wrong answer  : " + str(extra_equals_wrong) + " of " + str(len(policies)) ^0
"" ^0

# ---- the defect itself does not depend on the policy ----

"request pairs the broken key cannot tell apart" ^0
0 => pairs
0 => collide
0 => i
for a in requests:
    0 => j
    for b in requests:
        if j > i:
            pairs + 1 => pairs
            if key_broken(a[0], a[1]) == key_broken(b[0], b[1]):
                if render(a[0], a[1]) != render(b[0], b[1]):
                    collide + 1 => collide
        j + 1 => j
    i + 1 => i
"  pairs compared            : " + str(pairs) ^0
"  same key, different page  : " + str(collide) ^0
"" ^0

"The collisions are the same number at every flush interval. Only whether" ^0
"anyone is still holding the entry changes. The performance change did not" ^0
"introduce the defect - it withdrew the thing that was hiding it, and that" ^0
"thing was the cache not working." ^0
```

## Python (deterministic transpilation)

```python
def render(user, locale):
    return user + "@" + locale

def key_broken(user, locale):
    return user

def key_correct(user, locale):
    return user + "|" + locale

def simulate(requests, flush_every, broken):
    cache = {}
    since_flush = 0
    wrong = 0
    hits = 0
    for r in requests:
        user = r[0]
        locale = r[1]
        if broken == 1:
            k = key_broken(user, locale)
        else:
            k = key_correct(user, locale)
        if k in cache:
            hits = hits + 1
            served = cache[k]
        else:
            served = render(user, locale)
            cache[k] = served
        if served != render(user, locale):
            wrong = wrong + 1
        since_flush = since_flush + 1
        if since_flush >= flush_every:
            cache = {}
            since_flush = 0
    return [wrong, hits]

requests = [["ana", "en"], ["ana", "fr"], ["bo", "en"], ["ana", "en"], ["bo", "de"], ["cy", "en"], ["ana", "fr"], ["bo", "en"], ["cy", "jp"], ["ana", "en"], ["bo", "de"], ["cy", "en"]]
policies = [1, 2, 3, 4, 6, 12]
print("broken key: wrong answers served, and cache hits, by flush interval")
for f in policies:
    r = simulate(requests, f, 1)
    print("  flush every " + str(f) + " : wrong " + str(r[0]) + ", hits " + str(r[1]))
print("")
print("correct key: the same sweep")
for f in policies:
    r = simulate(requests, f, 0)
    print("  flush every " + str(f) + " : wrong " + str(r[0]) + ", hits " + str(r[1]))
print("")
shipped = simulate(requests, 1, 1)
print("the shipped policy, flush every 1")
print("  wrong answers : " + str(shipped[0]))
print("  cache hits    : " + str(shipped[1]))
if shipped[1] == 0:
    print("  the cache has never returned anything it stored")
print("")
first_wrong = []
policies_clean = 0
for f in policies:
    r = simulate(requests, f, 1)
    if r[0] == 0:
        policies_clean = policies_clean + 1
    elif len(first_wrong) == 0:
        first_wrong = [f, r[0], r[1]]
print("flush intervals under which the broken key is silent: " + str(policies_clean) + " of " + str(len(policies)))
if len(first_wrong) > 0:
    print("  first interval that serves a wrong page: " + str(first_wrong[0]))
    print("  wrong answers there                    : " + str(first_wrong[1]))
    print("  cache hits there                       : " + str(first_wrong[2]))
print("")
print("cache hits, broken key minus correct key")
policies_where_broken_wins = 0
extra_equals_wrong = 0
for f in policies:
    b = simulate(requests, f, 1)
    c = simulate(requests, f, 0)
    extra = b[1] - c[1]
    print("  flush every " + str(f) + " : " + str(b[1]) + " vs " + str(c[1]) + ", extra " + str(extra) + ", wrong " + str(b[0]))
    if extra > 0:
        policies_where_broken_wins = policies_where_broken_wins + 1
    if extra == b[0]:
        extra_equals_wrong = extra_equals_wrong + 1
print("  intervals where the broken key looks like the better cache: " + str(policies_where_broken_wins) + " of " + str(len(policies)))
print("  intervals where every extra hit is exactly a wrong answer  : " + str(extra_equals_wrong) + " of " + str(len(policies)))
print("")
print("request pairs the broken key cannot tell apart")
pairs = 0
collide = 0
i = 0
for a in requests:
    j = 0
    for b in requests:
        if j > i:
            pairs = pairs + 1
            if key_broken(a[0], a[1]) == key_broken(b[0], b[1]):
                if render(a[0], a[1]) != render(b[0], b[1]):
                    collide = collide + 1
        j = j + 1
    i = i + 1
print("  pairs compared            : " + str(pairs))
print("  same key, different page  : " + str(collide))
print("")
print("The collisions are the same number at every flush interval. Only whether")
print("anyone is still holding the entry changes. The performance change did not")
print("introduce the defect - it withdrew the thing that was hiding it, and that")
print("thing was the cache not working.")
```

## stdout (executed)

```text
broken key: wrong answers served, and cache hits, by flush interval
  flush every 1 : wrong 0, hits 0
  flush every 2 : wrong 1, hits 1
  flush every 3 : wrong 1, hits 1
  flush every 4 : wrong 3, hits 4
  flush every 6 : wrong 5, hits 6
  flush every 12 : wrong 5, hits 9

correct key: the same sweep
  flush every 1 : wrong 0, hits 0
  flush every 2 : wrong 0, hits 0
  flush every 3 : wrong 0, hits 0
  flush every 4 : wrong 0, hits 1
  flush every 6 : wrong 0, hits 1
  flush every 12 : wrong 0, hits 6

the shipped policy, flush every 1
  wrong answers : 0
  cache hits    : 0
  the cache has never returned anything it stored

flush intervals under which the broken key is silent: 1 of 6
  first interval that serves a wrong page: 2
  wrong answers there                    : 1
  cache hits there                       : 1

cache hits, broken key minus correct key
  flush every 1 : 0 vs 0, extra 0, wrong 0
  flush every 2 : 1 vs 0, extra 1, wrong 1
  flush every 3 : 1 vs 0, extra 1, wrong 1
  flush every 4 : 4 vs 1, extra 3, wrong 3
  flush every 6 : 6 vs 1, extra 5, wrong 5
  flush every 12 : 9 vs 6, extra 3, wrong 5
  intervals where the broken key looks like the better cache: 5 of 6
  intervals where every extra hit is exactly a wrong answer  : 5 of 6

request pairs the broken key cannot tell apart
  pairs compared            : 66
  same key, different page  : 12

The collisions are the same number at every flush interval. Only whether
anyone is still holding the entry changes. The performance change did not
introduce the defect - it withdrew the thing that was hiding it, and that
thing was the cache not working.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
