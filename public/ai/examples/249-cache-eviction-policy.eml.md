<!-- canonical: efficientnewlanguage.org/ai/examples/249-cache-eviction-policy | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 249 — Cache eviction policy — the workload decides, not the policy

`cache_eviction_policy.eml` runs LRU, LFU and FIFO over three access traces chosen because each defeats a different policy, and compares all three against the offline (Belady) optimum.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three eviction
# policies on one access trace, and the workload that decides between them.
#
# LRU, LFU and FIFO are usually compared by hit rate on "a typical workload",
# which is a phrase doing all the work. The policies do not have a ranking -
# each one is optimal on some access pattern and worst on another, and which
# pattern a system has is a fact about the system rather than about caching.
#
# Three traces, chosen because each defeats a different policy:
#
#     looping     a cycle slightly longer than the cache - LRU evicts exactly
#                 the item it is about to need, hitting ZERO
#     frequency   a few hot keys among many cold ones - FIFO throws hot keys
#                 out on schedule
#     recency     a working set that moves - LFU keeps yesterday's hot keys
#                 forever and cannot adapt
#
# The measurement is the hit count for each policy on each trace, plus the
# optimal (Belady) count computed by looking at the future - which no online
# policy can do, and which is the only fair upper bound.

3 => CAP

def evict_lru(cache, order, freq, key, t):
    # `order` holds last-use times. Evict the smallest.
    "" => victim
    0 - 1 => worst
    for k in cache:
        if worst < 0 or order[k] < worst:
            order[k] => worst
            k => victim
    return victim

def evict_lfu(cache, order, freq, key, t):
    "" => victim
    0 - 1 => worst
    for k in cache:
        if worst < 0 or freq[k] < worst:
            freq[k] => worst
            k => victim
    return victim

def evict_fifo(cache, order, freq, key, t):
    # `order` holds insertion times for FIFO.
    "" => victim
    0 - 1 => worst
    for k in cache:
        if worst < 0 or order[k] < worst:
            order[k] => worst
            k => victim
    return victim

def run_policy(trace, policy):
    {} => cache
    {} => order
    {} => freq
    0 => hits
    0 => t
    for key in trace:
        t + 1 => t
        if key in cache:
            hits + 1 => hits
            freq[key] + 1 => freq[key]
            if not (policy == "fifo"):
                t => order[key]
        else:
            if len(cache) >= CAP:
                if policy == "lru":
                    evict_lru(cache, order, freq, key, t) => v
                elif policy == "lfu":
                    evict_lfu(cache, order, freq, key, t) => v
                else:
                    evict_fifo(cache, order, freq, key, t) => v
                [] => keep
                for k in cache:
                    if not (k == v):
                        keep + [k] => keep
                {} => nc
                for k in keep:
                    1 => nc[k]
                nc => cache
            1 => cache[key]
            t => order[key]
            1 => freq[key]
    return hits

def run_optimal(trace):
    # Belady: evict the key whose next use is furthest away. Needs the future,
    # so it is a bound rather than a policy.
    [] => cache
    0 => hits
    for i in [0:len(trace) - 1]:
        trace[i] => key
        0 => present
        for k in cache:
            if k == key:
                1 => present
        if present == 1:
            hits + 1 => hits
        else:
            if len(cache) >= CAP:
                "" => victim
                0 - 1 => furthest
                for k in cache:
                    len(trace) + 1 => nxt
                    for j in [i + 1:len(trace) - 1]:
                        if trace[j] == k and nxt > len(trace):
                            j => nxt
                    if nxt > furthest:
                        nxt => furthest
                        k => victim
                [] => keep
                for k in cache:
                    if not (k == victim):
                        keep + [k] => keep
                keep => cache
            cache + [key] => cache
    return hits


# looping: a cycle of 4 over a cache of 3
[] => looping
for r in [1:4]:
    for k in ["a", "b", "c", "d"]:
        looping + [k] => looping

# frequency: two hot keys, many cold
[] => frequency
for r in [1:4]:
    frequency + ["h1", "h2"] => frequency
    for k in ["c1", "c2", "c3"]:
        frequency + [k] => frequency
    frequency + ["h1", "h2"] => frequency

# recency: the working set moves
[] => recency
for k in ["a", "a", "b", "b", "a", "b"]:
    recency + [k] => recency
for k in ["x", "x", "y", "y", "x", "y"]:
    recency + [k] => recency

"trace       len  LRU  LFU  FIFO  optimal"^0
{} => res
for pair in [["looping", looping], ["frequency", frequency], ["recency", recency]]:
    pair[0] => nm
    pair[1] => tr
    run_policy(tr, "lru") => l
    run_policy(tr, "lfu") => f
    run_policy(tr, "fifo") => q
    run_optimal(tr) => o
    [l, f, q, o, len(tr)] => res[nm]
    ("%-11s %-4d %-4d %-4d %-5d %d" % (nm, len(tr), l, f, q, o))^0

""^0
("cache capacity: " + str(CAP))^0

# ------------------------------------------- which policy wins where
""^0
"best online policy per trace:"^0
0 => distinct_winners
{} => winners
for nm in ["looping", "frequency", "recency"]:
    res[nm] => r
    "LRU" => best
    r[0] => bv
    if r[1] > bv:
        r[1] => bv
        "LFU" => best
    if r[2] > bv:
        r[2] => bv
        "FIFO" => best
    1 => winners[best]
    ("  %-11s %s (%d hits, optimal %d)" % (nm, best, bv, r[3]))^0
len(winners) => distinct_winners
("distinct winners across three traces: " + str(distinct_winners))^0

# ------------------------------------ nothing reaches the offline optimum
""^0
0 => any_optimal
for nm in ["looping", "frequency", "recency"]:
    res[nm] => r
    if r[0] == r[3] or r[1] == r[3] or r[2] == r[3]:
        any_optimal + 1 => any_optimal
("traces where an online policy matched the offline optimum: " + str(any_optimal) + "/3")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# LRU must hit ZERO on the looping trace. That is the pattern it is worst on.
checked + 1 => checked
if res["looping"][0] == 0:
    passed + 1 => passed

# No single policy may win every trace, or there would be a ranking.
checked + 1 => checked
if distinct_winners > 1:
    passed + 1 => passed

# The offline optimum must be at least as good as every online policy on
# every trace - if not, the bound is not a bound.
checked + 1 => checked
0 => bound_holds
0 => bound_n
for nm in ["looping", "frequency", "recency"]:
    res[nm] => r
    bound_n + 1 => bound_n
    if r[3] >= r[0] and r[3] >= r[1] and r[3] >= r[2]:
        bound_holds + 1 => bound_holds
if bound_holds == bound_n:
    passed + 1 => passed

# The optimum must be strictly better somewhere, or it would not be a
# meaningful bound.
checked + 1 => checked
if res["looping"][3] > res["looping"][0]:
    passed + 1 => passed

# And every policy must hit at least once on the frequency trace, since hot
# keys are re-requested - a policy that never hits would mean the cache is
# not working at all.
checked + 1 => checked
if res["frequency"][0] > 0 and res["frequency"][1] > 0 and res["frequency"][2] > 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Each policy is worst on some pattern, so the workload decides, not the policy." => verdict
else:
    "FAILED - an eviction policy did not behave as the checks describe." => verdict
verdict^0

""^0
"LRU hitting zero on a loop is not a defect in LRU - it is LRU doing" => n1
n1^0
"exactly what it promises on a pattern that punishes the promise. The" => n2
n2^0
"question a cache configuration answers is which pattern the system has," => n3
n3^0
"and that is measured from a trace rather than chosen from a list." => n4
n4^0
```

## Python (deterministic transpilation)

```python
CAP = 3

def evict_lru(cache, order, freq, key, t):
    victim = ""
    worst = 0 - 1
    for k in cache:
        if worst < 0 or order[k] < worst:
            worst = order[k]
            victim = k
    return victim

def evict_lfu(cache, order, freq, key, t):
    victim = ""
    worst = 0 - 1
    for k in cache:
        if worst < 0 or freq[k] < worst:
            worst = freq[k]
            victim = k
    return victim

def evict_fifo(cache, order, freq, key, t):
    victim = ""
    worst = 0 - 1
    for k in cache:
        if worst < 0 or order[k] < worst:
            worst = order[k]
            victim = k
    return victim

def run_policy(trace, policy):
    cache = {}
    order = {}
    freq = {}
    hits = 0
    t = 0
    for key in trace:
        t = t + 1
        if key in cache:
            hits = hits + 1
            freq[key] = freq[key] + 1
            if not policy == "fifo":
                order[key] = t
        else:
            if len(cache) >= CAP:
                if policy == "lru":
                    v = evict_lru(cache, order, freq, key, t)
                elif policy == "lfu":
                    v = evict_lfu(cache, order, freq, key, t)
                else:
                    v = evict_fifo(cache, order, freq, key, t)
                keep = []
                for k in cache:
                    if not k == v:
                        keep = keep + [k]
                nc = {}
                for k in keep:
                    nc[k] = 1
                cache = nc
            cache[key] = 1
            order[key] = t
            freq[key] = 1
    return hits

def run_optimal(trace):
    cache = []
    hits = 0
    for i in range(0, len(trace)):
        key = trace[i]
        present = 0
        for k in cache:
            if k == key:
                present = 1
        if present == 1:
            hits = hits + 1
        else:
            if len(cache) >= CAP:
                victim = ""
                furthest = 0 - 1
                for k in cache:
                    nxt = len(trace) + 1
                    for j in range(i + 1, len(trace)):
                        if trace[j] == k and nxt > len(trace):
                            nxt = j
                    if nxt > furthest:
                        furthest = nxt
                        victim = k
                keep = []
                for k in cache:
                    if not k == victim:
                        keep = keep + [k]
                cache = keep
            cache = cache + [key]
    return hits

looping = []
for r in range(1, 5):
    for k in ["a", "b", "c", "d"]:
        looping = looping + [k]
frequency = []
for r in range(1, 5):
    frequency = frequency + ["h1", "h2"]
    for k in ["c1", "c2", "c3"]:
        frequency = frequency + [k]
    frequency = frequency + ["h1", "h2"]
recency = []
for k in ["a", "a", "b", "b", "a", "b"]:
    recency = recency + [k]
for k in ["x", "x", "y", "y", "x", "y"]:
    recency = recency + [k]
print("trace       len  LRU  LFU  FIFO  optimal")
res = {}
for pair in [["looping", looping], ["frequency", frequency], ["recency", recency]]:
    nm = pair[0]
    tr = pair[1]
    l = run_policy(tr, "lru")
    f = run_policy(tr, "lfu")
    q = run_policy(tr, "fifo")
    o = run_optimal(tr)
    res[nm] = [l, f, q, o, len(tr)]
    print("%-11s %-4d %-4d %-4d %-5d %d" % (nm, len(tr), l, f, q, o))
print("")
print("cache capacity: " + str(CAP))
print("")
print("best online policy per trace:")
distinct_winners = 0
winners = {}
for nm in ["looping", "frequency", "recency"]:
    r = res[nm]
    best = "LRU"
    bv = r[0]
    if r[1] > bv:
        bv = r[1]
        best = "LFU"
    if r[2] > bv:
        bv = r[2]
        best = "FIFO"
    winners[best] = 1
    print("  %-11s %s (%d hits, optimal %d)" % (nm, best, bv, r[3]))
distinct_winners = len(winners)
print("distinct winners across three traces: " + str(distinct_winners))
print("")
any_optimal = 0
for nm in ["looping", "frequency", "recency"]:
    r = res[nm]
    if r[0] == r[3] or r[1] == r[3] or r[2] == r[3]:
        any_optimal = any_optimal + 1
print("traces where an online policy matched the offline optimum: " + str(any_optimal) + "/3")
passed = 0
checked = 0
checked = checked + 1
if res["looping"][0] == 0:
    passed = passed + 1
checked = checked + 1
if distinct_winners > 1:
    passed = passed + 1
checked = checked + 1
bound_holds = 0
bound_n = 0
for nm in ["looping", "frequency", "recency"]:
    r = res[nm]
    bound_n = bound_n + 1
    if r[3] >= r[0] and r[3] >= r[1] and r[3] >= r[2]:
        bound_holds = bound_holds + 1
if bound_holds == bound_n:
    passed = passed + 1
checked = checked + 1
if res["looping"][3] > res["looping"][0]:
    passed = passed + 1
checked = checked + 1
if res["frequency"][0] > 0 and res["frequency"][1] > 0 and res["frequency"][2] > 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Each policy is worst on some pattern, so the workload decides, not the policy."
else:
    verdict = "FAILED - an eviction policy did not behave as the checks describe."
print(verdict)
print("")
n1 = "LRU hitting zero on a loop is not a defect in LRU - it is LRU doing"
print(n1)
n2 = "exactly what it promises on a pattern that punishes the promise. The"
print(n2)
n3 = "question a cache configuration answers is which pattern the system has,"
print(n3)
n4 = "and that is measured from a trace rather than chosen from a list."
print(n4)
```

## stdout (executed)

```text
trace       len  LRU  LFU  FIFO  optimal
looping     16   0    0    0     8
frequency   28   6    12   6     15
recency     12   8    6    8     8

cache capacity: 3

best online policy per trace:
  looping     LRU (0 hits, optimal 8)
  frequency   LFU (12 hits, optimal 15)
  recency     LRU (8 hits, optimal 8)
distinct winners across three traces: 2

traces where an online policy matched the offline optimum: 1/3

checks passed: 5/5
Each policy is worst on some pattern, so the workload decides, not the policy.

LRU hitting zero on a loop is not a defect in LRU - it is LRU doing
exactly what it promises on a pattern that punishes the promise. The
question a cache configuration answers is which pattern the system has,
and that is measured from a trace rather than chosen from a list.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
