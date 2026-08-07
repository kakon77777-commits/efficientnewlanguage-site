<!-- canonical: efficientnewlanguage.org/ai/examples/276-cache-stampede-single-flight | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 276 — Cache stampede — the hotter the key, the bigger the crowd at expiry

`cache_stampede_single_flight.eml` replays one arrival pattern across expiry boundaries under four policies and counts three costs separately: recomputations, requests that **waited**, and requests served **stale**.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The cache expires
# and a thousand requests recompute the same value.
#
# A cached value with a TTL is fine until the instant it expires. At that
# instant every in-flight request misses, and every one of them starts the same
# expensive recomputation, because none of them can see the others. The backend
# receives the full concurrency of the service for one value it already had a
# moment ago - and the higher the hit rate, the worse it is, because a hot key
# is exactly the one with the most requests waiting on it.
#
# Three mitigations, each with a different shape of cost:
#
#     single-flight       one request recomputes, the rest wait for it -
#                         eliminates duplicate work and serialises on it
#     early refresh       refresh probabilistically BEFORE expiry, so the
#                         stampede is spread out and some work is wasted
#     serve-stale         return the expired value while one refresh runs -
#                         no waiting at all, and the answer is out of date
#
# The measurement replays one arrival pattern across an expiry boundary under
# all four policies and counts three things separately: recomputations, requests
# that had to WAIT, and requests served a stale value. No policy is zero on all
# three, and which one to accept is a product decision rather than a technical
# one.

def run(policy, arrivals, ttl, compute_time):
    # Returns [recomputes, waited, stale_served].
    0 => recomputes
    0 => waited
    0 => stale
    0 - 1 => fresh_until
    0 - 1 => refresh_done_at
    0 => refreshing
    for t in arrivals:
        if refreshing == 1 and t >= refresh_done_at:
            0 => refreshing
            t + ttl => fresh_until
        if t < fresh_until:
            # A hit. Early refresh may still start one near the end of the TTL.
            if policy == "early" and refreshing == 0 and t >= fresh_until - 2:
                1 => refreshing
                t + compute_time => refresh_done_at
                recomputes + 1 => recomputes
        else:
            if policy == "naive":
                # Every miss starts its OWN recompute. The value does not
                # become fresh until one lands, so every request arriving
                # during the compute window misses too - which is the
                # stampede. The first version of this file set freshness
                # immediately on the first miss, which is single-flight with
                # zero latency: it gave the naive policy the very behaviour
                # the case exists to say it lacks, and made it look BETTER
                # than single-flight.
                recomputes + 1 => recomputes
                waited + 1 => waited
                if refreshing == 0:
                    1 => refreshing
                    t + compute_time => refresh_done_at
            elif policy == "single-flight":
                if refreshing == 1:
                    waited + 1 => waited
                else:
                    1 => refreshing
                    t + compute_time => refresh_done_at
                    recomputes + 1 => recomputes
                    waited + 1 => waited
            elif policy == "early":
                if refreshing == 1:
                    waited + 1 => waited
                else:
                    1 => refreshing
                    t + compute_time => refresh_done_at
                    recomputes + 1 => recomputes
                    waited + 1 => waited
            else:
                if refreshing == 0:
                    1 => refreshing
                    t + compute_time => refresh_done_at
                    recomputes + 1 => recomputes
                stale + 1 => stale
    return [recomputes, waited, stale]


10 => TTL
4 => COMPUTE
# Steady arrivals, several per tick, across two expiries.
[] => arrivals
for t in [0:25]:
    for k in [1:4]:
        arrivals + [t] => arrivals

["naive", "single-flight", "early", "serve-stale"] => POLICIES

"policy          recomputes   requests that waited   served stale"^0
{} => res
for p in POLICIES:
    run(p, arrivals, TTL, COMPUTE) => r
    r => res[p]
    ("%-15s %-12d %-22d %d" % (p, r[0], r[1], r[2]))^0

""^0
("requests: " + str(len(arrivals)) + " over " + str(26) + " ticks, 4 per tick")^0
("TTL: " + str(TTL) + " ticks, recomputation takes " + str(COMPUTE) + " ticks")^0

# ------------------------------- what the naive policy costs at the boundary
""^0
("the naive policy recomputes " + str(res["naive"][0]) + " times for a value that changes " + str(int(26 / TTL) + 1) + " times")^0
res["naive"][0] => n_naive
res["single-flight"][0] => n_sf
("  duplicate recomputations eliminated by single-flight: " + str(n_naive - n_sf))^0

# --------------------------------- nobody escapes all three costs
""^0
"policies with zero on all three counters:"^0
0 => perfect
for p in POLICIES:
    res[p] => r
    if r[0] == 0 and r[1] == 0 and r[2] == 0:
        perfect + 1 => perfect
("  " + str(perfect))^0
"...the three counters are the three things that can be given up, and a"^0
"cache exists because at least one of them has to be."^0

# ------------------------------- serve-stale is the only one with no waiting
""^0
0 => no_wait
for p in POLICIES:
    if res[p][1] == 0:
        no_wait + 1 => no_wait
        ("policy with zero waiting: " + p + " (serves " + str(res[p][2]) + " stale)")^0
("policies with zero waiting: " + str(no_wait) + "/" + str(len(POLICIES)))^0

# ---------------------- the arrival rate at which the stampede disappears
""^0
# The first version of this section claimed one request per tick shows
# nothing. It shows plenty: the compute window is four ticks wide, so four
# requests arrive inside it and all four miss. What hides a stampede is not
# serial traffic, it is traffic SLOWER THAN THE RECOMPUTE - a gap wider than
# `compute_time` means the second request finds the value already fresh. That
# is a relationship between two numbers, not a property of load testing.
"naive vs single-flight recomputes, by seconds between arrivals:"^0
0 => converge_gap
for gap in [1, 2, 4, 5, 8]:
    [] => sparse
    for k in [0:12]:
        sparse + [k * gap] => sparse
    run("naive", sparse, TTL, COMPUTE) => rn
    run("single-flight", sparse, TTL, COMPUTE) => rs
    if converge_gap == 0 and rn[0] == rs[0]:
        gap => converge_gap
    ("  gap %-3d naive %-4d single-flight %d" % (gap, rn[0], rs[0]))^0
("the two agree once the gap reaches: " + str(converge_gap) + " ticks")^0
("recompute takes: " + str(COMPUTE) + " ticks")^0
"...so the stampede is present whenever requests arrive faster than the"^0
"recomputation finishes, which is the definition of a value worth caching."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The naive policy must recompute far more than the value actually changes.
checked + 1 => checked
if res["naive"][0] > int(26 / TTL) + 1:
    passed + 1 => passed

# Single-flight must strictly reduce recomputation.
checked + 1 => checked
if res["single-flight"][0] < res["naive"][0]:
    passed + 1 => passed

# Serve-stale must be the only policy where nobody waits, and it must pay for
# it with stale responses.
checked + 1 => checked
if res["serve-stale"][1] == 0 and res["serve-stale"][2] > 0 and no_wait == 1:
    passed + 1 => passed

# No policy may be zero on all three counters.
checked + 1 => checked
if perfect == 0:
    passed + 1 => passed

# And the two policies must converge once arrivals are spaced wider than the
# recompute takes - a relationship between two numbers, found by sweeping
# rather than assumed. The premise this replaced said serial traffic hides the
# stampede; it does not, and the corrected claim is sharper.
checked + 1 => checked
if converge_gap == COMPUTE:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The hotter the key, the bigger the stampede when it expires." => verdict
else:
    "FAILED - a cache policy did not behave as the checks describe." => verdict
verdict^0

""^0
"A TTL is a synchronisation point that nobody meant to create: it makes" => n1
n1^0
"every reader of a key miss at the same instant. The mitigations differ in" => n2
n2^0
"which of three things they give up - duplicated work, waiting, or freshness" => n3
n3^0
"- and a cache is already the decision to give up freshness, so the third" => n4
n4^0
"one is usually the cheapest and the least often chosen." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def run(policy, arrivals, ttl, compute_time):
    recomputes = 0
    waited = 0
    stale = 0
    fresh_until = 0 - 1
    refresh_done_at = 0 - 1
    refreshing = 0
    for t in arrivals:
        if refreshing == 1 and t >= refresh_done_at:
            refreshing = 0
            fresh_until = t + ttl
        if t < fresh_until:
            if policy == "early" and refreshing == 0 and t >= fresh_until - 2:
                refreshing = 1
                refresh_done_at = t + compute_time
                recomputes = recomputes + 1
        elif policy == "naive":
            recomputes = recomputes + 1
            waited = waited + 1
            if refreshing == 0:
                refreshing = 1
                refresh_done_at = t + compute_time
        elif policy == "single-flight":
            if refreshing == 1:
                waited = waited + 1
            else:
                refreshing = 1
                refresh_done_at = t + compute_time
                recomputes = recomputes + 1
                waited = waited + 1
        elif policy == "early":
            if refreshing == 1:
                waited = waited + 1
            else:
                refreshing = 1
                refresh_done_at = t + compute_time
                recomputes = recomputes + 1
                waited = waited + 1
        else:
            if refreshing == 0:
                refreshing = 1
                refresh_done_at = t + compute_time
                recomputes = recomputes + 1
            stale = stale + 1
    return [recomputes, waited, stale]

TTL = 10
COMPUTE = 4
arrivals = []
for t in range(0, 26):
    for k in range(1, 5):
        arrivals = arrivals + [t]
POLICIES = ["naive", "single-flight", "early", "serve-stale"]
print("policy          recomputes   requests that waited   served stale")
res = {}
for p in POLICIES:
    r = run(p, arrivals, TTL, COMPUTE)
    res[p] = r
    print("%-15s %-12d %-22d %d" % (p, r[0], r[1], r[2]))
print("")
print("requests: " + str(len(arrivals)) + " over " + str(26) + " ticks, 4 per tick")
print("TTL: " + str(TTL) + " ticks, recomputation takes " + str(COMPUTE) + " ticks")
print("")
print("the naive policy recomputes " + str(res["naive"][0]) + " times for a value that changes " + str(int(26 / TTL) + 1) + " times")
n_naive = res["naive"][0]
n_sf = res["single-flight"][0]
print("  duplicate recomputations eliminated by single-flight: " + str(n_naive - n_sf))
print("")
print("policies with zero on all three counters:")
perfect = 0
for p in POLICIES:
    r = res[p]
    if r[0] == 0 and r[1] == 0 and r[2] == 0:
        perfect = perfect + 1
print("  " + str(perfect))
print("...the three counters are the three things that can be given up, and a")
print("cache exists because at least one of them has to be.")
print("")
no_wait = 0
for p in POLICIES:
    if res[p][1] == 0:
        no_wait = no_wait + 1
        print("policy with zero waiting: " + p + " (serves " + str(res[p][2]) + " stale)")
print("policies with zero waiting: " + str(no_wait) + "/" + str(len(POLICIES)))
print("")
print("naive vs single-flight recomputes, by seconds between arrivals:")
converge_gap = 0
for gap in [1, 2, 4, 5, 8]:
    sparse = []
    for k in range(0, 13):
        sparse = sparse + [k * gap]
    rn = run("naive", sparse, TTL, COMPUTE)
    rs = run("single-flight", sparse, TTL, COMPUTE)
    if converge_gap == 0 and rn[0] == rs[0]:
        converge_gap = gap
    print("  gap %-3d naive %-4d single-flight %d" % (gap, rn[0], rs[0]))
print("the two agree once the gap reaches: " + str(converge_gap) + " ticks")
print("recompute takes: " + str(COMPUTE) + " ticks")
print("...so the stampede is present whenever requests arrive faster than the")
print("recomputation finishes, which is the definition of a value worth caching.")
passed = 0
checked = 0
checked = checked + 1
if res["naive"][0] > int(26 / TTL) + 1:
    passed = passed + 1
checked = checked + 1
if res["single-flight"][0] < res["naive"][0]:
    passed = passed + 1
checked = checked + 1
if res["serve-stale"][1] == 0 and res["serve-stale"][2] > 0 and no_wait == 1:
    passed = passed + 1
checked = checked + 1
if perfect == 0:
    passed = passed + 1
checked = checked + 1
if converge_gap == COMPUTE:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The hotter the key, the bigger the stampede when it expires."
else:
    verdict = "FAILED - a cache policy did not behave as the checks describe."
print(verdict)
print("")
n1 = "A TTL is a synchronisation point that nobody meant to create: it makes"
print(n1)
n2 = "every reader of a key miss at the same instant. The mitigations differ in"
print(n2)
n3 = "which of three things they give up - duplicated work, waiting, or freshness"
print(n3)
n4 = "- and a cache is already the decision to give up freshness, so the third"
print(n4)
n5 = "one is usually the cheapest and the least often chosen."
print(n5)
```

## stdout (executed)

```text
policy          recomputes   requests that waited   served stale
naive           32           32                     0
single-flight   2            32                     0
early           3            24                     0
serve-stale     2            0                      32

requests: 104 over 26 ticks, 4 per tick
TTL: 10 ticks, recomputation takes 4 ticks

the naive policy recomputes 32 times for a value that changes 3 times
  duplicate recomputations eliminated by single-flight: 30

policies with zero on all three counters:
  0
...the three counters are the three things that can be given up, and a
cache exists because at least one of them has to be.

policy with zero waiting: serve-stale (serves 32 stale)
policies with zero waiting: 1/4

naive vs single-flight recomputes, by seconds between arrivals:
  gap 1   naive 4    single-flight 1
  gap 2   naive 4    single-flight 2
  gap 4   naive 4    single-flight 4
  gap 5   naive 5    single-flight 5
  gap 8   naive 5    single-flight 5
the two agree once the gap reaches: 4 ticks
recompute takes: 4 ticks
...so the stampede is present whenever requests arrive faster than the
recomputation finishes, which is the definition of a value worth caching.

checks passed: 5/5
The hotter the key, the bigger the stampede when it expires.

A TTL is a synchronisation point that nobody meant to create: it makes
every reader of a key miss at the same instant. The mitigations differ in
which of three things they give up - duplicated work, waiting, or freshness
- and a cache is already the decision to give up freshness, so the third
one is usually the cheapest and the least often chosen.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
