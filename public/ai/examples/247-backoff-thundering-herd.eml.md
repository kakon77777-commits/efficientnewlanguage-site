<!-- canonical: efficientnewlanguage.org/ai/examples/247-backoff-thundering-herd | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 247 — Backoff and the thundering herd — a policy that synchronises load

`backoff_thundering_herd.eml` retries 100 clients after a shared outage under four policies — fixed, exponential, jittered, decorrelated — and reports the **peak** concurrent retry count, not the average.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Retrying politely
# and all at the same moment.
#
# A service fails; a hundred clients retry. Exponential backoff spaces the
# retries out over time, which is the whole point - and it does not space them
# out from EACH OTHER, because every client computes the same delay from the
# same attempt number:
#
#     attempt 1 -> wait 1     all hundred wake at t+1
#     attempt 2 -> wait 2     all hundred wake at t+3
#     attempt 3 -> wait 4     all hundred wake at t+7
#
# The load is no longer continuous; it is a series of spikes, and each spike
# is the full population. Backoff reduced the AVERAGE rate and left the peak
# untouched, which is the wrong half - a service falls over on peak.
#
# Jitter fixes it by making the delay depend on the client as well as the
# attempt. There is no random() in EML-P, and that turns out to be honest
# rather than limiting: the jitter here is a deterministic function of the
# client id, which is what a real implementation should do anyway if it wants
# reproducible behaviour under test.
#
# The measurement is the peak: the largest number of clients arriving in any
# single tick, over the whole retry storm. Also reported is the total number
# of retries, so it is visible that jitter changes the SHAPE of the load and
# not its volume.
#
# Two things the sweep corrected in this file. Jitter's benefit depends
# entirely on the BASE delay - with a base of 1 the first window is two ticks
# wide and a hundred clients still collide, so the peak falls from 100 to 93
# and the fix looks useless. And the improvement is NOT monotonic in the base:
# a wider window can alias with the population and undo itself. Both are
# measured below rather than reasoned about.

100 => CLIENTS
6 => ATTEMPTS

def delay_fixed(attempt, client):
    return attempt

5 => BASE

def delay_exponential(attempt, client):
    BASE => d
    for k in [1:attempt - 1]:
        d * 2 => d
    return d

def delay_jittered(attempt, client):
    # Full jitter: a value in [0, exponential], derived from the client id.
    # Deterministic, reproducible, and different per client - which is all
    # random() was ever providing here.
    delay_exponential(attempt, client) => cap
    return client % (cap + 1)

def delay_decorrelated(attempt, client):
    # Spread across the whole window rather than clustering at the start,
    # which is what plain modulo does when the cap is small.
    delay_exponential(attempt, client) => cap
    return (client * 7 + attempt * 13) % (cap + 1)

def arrivals(which):
    # tick -> how many clients arrive. Returns [peak, total, distinct_ticks].
    {} => hits
    0 => total
    for c in [0:CLIENTS - 1]:
        0 => t
        for a in [1:ATTEMPTS]:
            if which == "fixed":
                delay_fixed(a, c) => d
            elif which == "exponential":
                delay_exponential(a, c) => d
            elif which == "jittered":
                delay_jittered(a, c) => d
            else:
                delay_decorrelated(a, c) => d
            t + d => t
            total + 1 => total
            if t in hits:
                hits[t] + 1 => hits[t]
            else:
                1 => hits[t]
    0 => peak
    for k in hits:
        if hits[k] > peak:
            hits[k] => peak
    return [peak, total, len(hits)]


["fixed", "exponential", "jittered", "decorrelated"] => strategies

"strategy       peak arrivals  total retries  ticks used"^0
{} => res
for st in strategies:
    arrivals(st) => r
    r => res[st]
    ("%-14s %-14d %-14d %d" % (st, r[0], r[1], r[2]))^0

""^0
("clients: " + str(CLIENTS) + ", attempts each: " + str(ATTEMPTS))^0
("every strategy issues the same number of retries: " + str(res["fixed"][1] == res["decorrelated"][1]))^0
"...so what changes is the shape of the load, not its volume."^0

# ------------------------------------------- where the spikes land
""^0
"exponential backoff, arrivals per tick (first 20 ticks):"^0
{} => exp_hits
for c in [0:CLIENTS - 1]:
    0 => t
    for a in [1:ATTEMPTS]:
        t + delay_exponential(a, c) => t
        if t in exp_hits:
            exp_hits[t] + 1 => exp_hits[t]
        else:
            1 => exp_hits[t]
"" => line
for t in [1:20]:
    0 => n
    if t in exp_hits:
        exp_hits[t] => n
    if n > 0:
        line + str(t) + ":" + str(n) + " " => line
("  " + line)^0

""^0
"decorrelated jitter, arrivals per tick (first 20 ticks):"^0
{} => jit_hits
for c in [0:CLIENTS - 1]:
    0 => t
    for a in [1:ATTEMPTS]:
        t + delay_decorrelated(a, c) => t
        if t in jit_hits:
            jit_hits[t] + 1 => jit_hits[t]
        else:
            1 => jit_hits[t]
"" => line2
for t in [1:20]:
    0 => n
    if t in jit_hits:
        jit_hits[t] => n
    if n > 0:
        line2 + str(t) + ":" + str(n) + " " => line2
("  " + line2)^0

# --------------------------------- how much room the jitter needs
# The same jitter function against different base delays. The window has to be
# wide relative to the population before the collisions stop, and past a point
# the arithmetic aliases with the client count and the peak climbs again.
""^0
"peak arrivals by base delay, decorrelated jitter:"^0
"base   peak  ticks used"^0
0 => best_base
1000 => best_peak
for b in [1, 2, 5, 10, 20]:
    {} => h
    for c in [0:CLIENTS - 1]:
        0 => t
        for a in [1:ATTEMPTS]:
            b => cap
            for k in [1:a - 1]:
                cap * 2 => cap
            t + (c * 7 + a * 13) % (cap + 1) => t
            if t in h:
                h[t] + 1 => h[t]
            else:
                1 => h[t]
    0 => pk
    for k in h:
        if h[k] > pk:
            h[k] => pk
    if pk < best_peak:
        pk => best_peak
        b => best_base
    ("%-6d %-5d %d" % (b, pk, len(h)))^0
("  lowest peak at base " + str(best_base) + ": " + str(best_peak))^0
"...and a larger base is not uniformly better - the window can alias."^0

# ------------------------------------ what backoff alone actually buys
# Against a fixed retry interval, exponential backoff DOES reduce the peak -
# but only because the retries drift apart over attempts, not because the
# clients differ. With one attempt each, they are identical.
""^0
"with a single attempt, every strategy that ignores the client is the same:"^0
{} => single
for st in strategies:
    {} => h
    for c in [0:CLIENTS - 1]:
        if st == "fixed":
            delay_fixed(1, c) => d
        elif st == "exponential":
            delay_exponential(1, c) => d
        elif st == "jittered":
            delay_jittered(1, c) => d
        else:
            delay_decorrelated(1, c) => d
        if d in h:
            h[d] + 1 => h[d]
        else:
            1 => h[d]
    0 => pk
    for k in h:
        if h[k] > pk:
            h[k] => pk
    pk => single[st]
    ("  %-14s peak %d" % (st, pk))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Every strategy must issue exactly the same number of retries.
checked + 1 => checked
0 => same_total
for st in strategies:
    if res[st][1] == CLIENTS * ATTEMPTS:
        same_total + 1 => same_total
if same_total == 4:
    passed + 1 => passed

# Jitter must reduce the peak substantially against undithered backoff. How
# substantially depends on the base, which is why BASE is 5 here and why the
# sweep above exists - at base 1 the reduction is 100 -> 93 and would not
# support this claim.
checked + 1 => checked
if res["decorrelated"][0] * 2 < res["exponential"][0]:
    passed + 1 => passed

# Undithered backoff must have a peak equal to the whole population - every
# client arriving together is the failure being demonstrated.
checked + 1 => checked
if res["exponential"][0] == CLIENTS and res["fixed"][0] == CLIENTS:
    passed + 1 => passed

# Jitter must SPREAD the load over more ticks, not merely delay it.
checked + 1 => checked
if res["decorrelated"][2] > res["exponential"][2]:
    passed + 1 => passed

# And with a single attempt, the client-independent strategies must still
# spike - which is the proof that backoff alone never addressed this.
checked + 1 => checked
if single["fixed"] == CLIENTS and single["exponential"] == CLIENTS:
    if single["decorrelated"] < CLIENTS:
        passed + 1 => passed

# The base sweep must show a non-monotonic peak: the widest window must not
# be the best one. This file assumed more room was always better.
checked + 1 => checked
if best_base < 20:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Backoff lowers the average and leaves the peak at the full population." => verdict
else:
    "FAILED - a backoff strategy did not behave as the checks describe." => verdict
verdict^0

""^0
"Every client computes the same delay from the same attempt number, so a" => n1
n1^0
"policy that looks like spreading load is synchronising it. The fix is not a" => n2
n2^0
"longer wait - it is a delay that depends on WHICH client is waiting. And" => n3
n3^0
"the sweep added the part this file did not expect: how much that buys" => n4
n4^0
"depends on the base delay, and a wider window is not uniformly better," => n5
n5^0
"because the jitter arithmetic can alias with the population size." => n6
n6^0
```

## Python (deterministic transpilation)

```python
CLIENTS = 100
ATTEMPTS = 6

def delay_fixed(attempt, client):
    return attempt

BASE = 5

def delay_exponential(attempt, client):
    d = BASE
    for k in range(1, attempt):
        d = d * 2
    return d

def delay_jittered(attempt, client):
    cap = delay_exponential(attempt, client)
    return client % (cap + 1)

def delay_decorrelated(attempt, client):
    cap = delay_exponential(attempt, client)
    return (client * 7 + attempt * 13) % (cap + 1)

def arrivals(which):
    hits = {}
    total = 0
    for c in range(0, CLIENTS):
        t = 0
        for a in range(1, ATTEMPTS+1):
            if which == "fixed":
                d = delay_fixed(a, c)
            elif which == "exponential":
                d = delay_exponential(a, c)
            elif which == "jittered":
                d = delay_jittered(a, c)
            else:
                d = delay_decorrelated(a, c)
            t = t + d
            total = total + 1
            if t in hits:
                hits[t] = hits[t] + 1
            else:
                hits[t] = 1
    peak = 0
    for k in hits:
        if hits[k] > peak:
            peak = hits[k]
    return [peak, total, len(hits)]

strategies = ["fixed", "exponential", "jittered", "decorrelated"]
print("strategy       peak arrivals  total retries  ticks used")
res = {}
for st in strategies:
    r = arrivals(st)
    res[st] = r
    print("%-14s %-14d %-14d %d" % (st, r[0], r[1], r[2]))
print("")
print("clients: " + str(CLIENTS) + ", attempts each: " + str(ATTEMPTS))
print("every strategy issues the same number of retries: " + str(res["fixed"][1] == res["decorrelated"][1]))
print("...so what changes is the shape of the load, not its volume.")
print("")
print("exponential backoff, arrivals per tick (first 20 ticks):")
exp_hits = {}
for c in range(0, CLIENTS):
    t = 0
    for a in range(1, ATTEMPTS+1):
        t = t + delay_exponential(a, c)
        if t in exp_hits:
            exp_hits[t] = exp_hits[t] + 1
        else:
            exp_hits[t] = 1
line = ""
for t in range(1, 21):
    n = 0
    if t in exp_hits:
        n = exp_hits[t]
    if n > 0:
        line = line + str(t) + ":" + str(n) + " "
print("  " + line)
print("")
print("decorrelated jitter, arrivals per tick (first 20 ticks):")
jit_hits = {}
for c in range(0, CLIENTS):
    t = 0
    for a in range(1, ATTEMPTS+1):
        t = t + delay_decorrelated(a, c)
        if t in jit_hits:
            jit_hits[t] = jit_hits[t] + 1
        else:
            jit_hits[t] = 1
line2 = ""
for t in range(1, 21):
    n = 0
    if t in jit_hits:
        n = jit_hits[t]
    if n > 0:
        line2 = line2 + str(t) + ":" + str(n) + " "
print("  " + line2)
print("")
print("peak arrivals by base delay, decorrelated jitter:")
print("base   peak  ticks used")
best_base = 0
best_peak = 1000
for b in [1, 2, 5, 10, 20]:
    h = {}
    for c in range(0, CLIENTS):
        t = 0
        for a in range(1, ATTEMPTS+1):
            cap = b
            for k in range(1, a):
                cap = cap * 2
            t = t + (c * 7 + a * 13) % (cap + 1)
            if t in h:
                h[t] = h[t] + 1
            else:
                h[t] = 1
    pk = 0
    for k in h:
        if h[k] > pk:
            pk = h[k]
    if pk < best_peak:
        best_peak = pk
        best_base = b
    print("%-6d %-5d %d" % (b, pk, len(h)))
print("  lowest peak at base " + str(best_base) + ": " + str(best_peak))
print("...and a larger base is not uniformly better - the window can alias.")
print("")
print("with a single attempt, every strategy that ignores the client is the same:")
single = {}
for st in strategies:
    h = {}
    for c in range(0, CLIENTS):
        if st == "fixed":
            d = delay_fixed(1, c)
        elif st == "exponential":
            d = delay_exponential(1, c)
        elif st == "jittered":
            d = delay_jittered(1, c)
        else:
            d = delay_decorrelated(1, c)
        if d in h:
            h[d] = h[d] + 1
        else:
            h[d] = 1
    pk = 0
    for k in h:
        if h[k] > pk:
            pk = h[k]
    single[st] = pk
    print("  %-14s peak %d" % (st, pk))
passed = 0
checked = 0
checked = checked + 1
same_total = 0
for st in strategies:
    if res[st][1] == CLIENTS * ATTEMPTS:
        same_total = same_total + 1
if same_total == 4:
    passed = passed + 1
checked = checked + 1
if res["decorrelated"][0] * 2 < res["exponential"][0]:
    passed = passed + 1
checked = checked + 1
if res["exponential"][0] == CLIENTS and res["fixed"][0] == CLIENTS:
    passed = passed + 1
checked = checked + 1
if res["decorrelated"][2] > res["exponential"][2]:
    passed = passed + 1
checked = checked + 1
if single["fixed"] == CLIENTS and single["exponential"] == CLIENTS:
    if single["decorrelated"] < CLIENTS:
        passed = passed + 1
checked = checked + 1
if best_base < 20:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Backoff lowers the average and leaves the peak at the full population."
else:
    verdict = "FAILED - a backoff strategy did not behave as the checks describe."
print(verdict)
print("")
n1 = "Every client computes the same delay from the same attempt number, so a"
print(n1)
n2 = "policy that looks like spreading load is synchronising it. The fix is not a"
print(n2)
n3 = "longer wait - it is a delay that depends on WHICH client is waiting. And"
print(n3)
n4 = "the sweep added the part this file did not expect: how much that buys"
print(n4)
n5 = "depends on the base delay, and a wider window is not uniformly better,"
print(n5)
n6 = "because the jitter arithmetic can alias with the population size."
print(n6)
```

## stdout (executed)

```text
strategy       peak arrivals  total retries  ticks used
fixed          100            600            6
exponential    100            600            6
jittered       27             600            155
decorrelated   25             600            166

clients: 100, attempts each: 6
every strategy issues the same number of retries: True
...so what changes is the shape of the load, not its volume.

exponential backoff, arrivals per tick (first 20 ticks):
  5:100 15:100 

decorrelated jitter, arrivals per tick (first 20 ticks):
  1:20 2:22 3:23 4:24 5:25 6:11 7:11 8:10 9:12 10:11 11:14 12:9 13:12 14:8 15:11 16:4 17:6 18:4 19:9 20:6 

peak arrivals by base delay, decorrelated jitter:
base   peak  ticks used
1      93    53
2      58    85
5      25    166
10     13    237
20     37    310
  lowest peak at base 10: 13
...and a larger base is not uniformly better - the window can alias.

with a single attempt, every strategy that ignores the client is the same:
  fixed          peak 100
  exponential    peak 100
  jittered       peak 17
  decorrelated   peak 17

checks passed: 6/6
Backoff lowers the average and leaves the peak at the full population.

Every client computes the same delay from the same attempt number, so a
policy that looks like spreading load is synchronising it. The fix is not a
longer wait - it is a delay that depends on WHICH client is waiting. And
the sweep added the part this file did not expect: how much that buys
depends on the base delay, and a wider window is not uniformly better,
because the jitter arithmetic can alias with the population size.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
