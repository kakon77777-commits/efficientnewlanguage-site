<!-- canonical: efficientnewlanguage.org/ai/examples/285-pool-reentrancy-deadlock | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 285 — Pool reentrancy deadlock — at capacity means deadlocked

`pool_reentrancy_deadlock.eml` sweeps concurrency against pool size for requests holding one, two and three connections, and reports the first concurrency at which progress becomes impossible.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Ten concurrent
# requests against a pool of ten, and none of them can run.
#
# A request that takes one connection from a pool of N runs N at a time and
# queues the rest. A request that takes a SECOND connection while holding the
# first cannot: at N concurrent requests every connection is held by a request
# waiting for another one, and none of them can finish. The pool is fully
# utilised, nothing is running, and no error is raised - every request is
# simply blocked in `acquire`.
#
# The number that breaks it is
#
#     concurrency >= ceil(pool_size / (connections_held - 1))
#
# and the first version of this file asserted that for a two-connection request
# and a pool of ten that number is FIVE. It is TEN. The measurement corrected
# it, and the corrected number is the more uncomfortable one: the cliff sits
# at EXACTLY the pool size, not above it. Ten concurrent requests against ten
# connections is the configuration everyone would call "at capacity", and for a
# request that holds two connections it is the configuration that cannot make
# progress at all. Three connections per request moves the cliff to five - half
# the pool - so the fraction depends on a number that is not in the pool's
# configuration.
#
# The measurement sweeps concurrency against pool size for requests holding
# one, two and three connections, and reports the first concurrency at which
# progress becomes impossible. The prediction is computed from the formula and
# compared against a simulation that acquires greedily, so neither side is
# taken on trust.

def deadlocks(pool, concurrency, hold):
    # Every request acquires one connection at a time, and all of them acquire
    # their first before any acquires its second - the worst interleaving, and
    # the one a busy system produces.
    pool => free
    [] => held
    for r in [1:concurrency]:
        held + [0] => held
    # Round-robin acquisition until nothing more can be taken.
    1 => progress
    while progress == 1:
        0 => progress
        for i in [0:concurrency - 1]:
            if held[i] < hold and free > 0:
                held[i] + 1 => held[i]
                free - 1 => free
                1 => progress
    # A request can finish only when it holds all `hold` connections.
    0 => runnable
    for h in held:
        if h == hold:
            runnable + 1 => runnable
    if runnable == 0:
        return 1
    return 0

def first_deadlock(pool, hold):
    for c in [1:pool + 4]:
        if deadlocks(pool, c, hold) == 1:
            return c
    return 0

def predicted(pool, hold):
    # Progress is impossible once every connection can be held by a request
    # that still needs another: pool // (hold - 1) requests can each stall one
    # short. One connection per request never stalls.
    if hold <= 1:
        return 0
    int(pool / (hold - 1)) => c
    if c * (hold - 1) < pool:
        c + 1 => c
    return c


10 => POOL

"connections held   first deadlocking concurrency   predicted   pool size"^0
{} => res
0 => agree
0 => holds_n
for hold in [1, 2, 3]:
    holds_n + 1 => holds_n
    first_deadlock(POOL, hold) => f
    predicted(POOL, hold) => p
    [f, p] => res[str(hold)]
    if f == p:
        agree + 1 => agree
    "none" => shown
    if f > 0:
        str(f) => shown
    "none" => pshown
    if p > 0:
        str(p) => pshown
    ("%-18s %-31s %-11s %d" % (str(hold), shown, pshown, POOL))^0

""^0
("pool size: " + str(POOL))^0
("simulation and formula agree on: " + str(agree) + "/" + str(holds_n) + " cases")^0

# --------------------------- the pool looks perfectly healthy at the point
""^0
"at the deadlocking concurrency, for a two-connection request:"^0
res["2"][0] => c2
("  concurrent requests: " + str(c2))^0
("  connections in use:  " + str(POOL) + "/" + str(POOL) + "  (100% utilised)")^0
("  requests able to run: 0")^0
"...a utilisation gauge cannot distinguish this from a busy, healthy pool."^0

# ------------------------------ one connection per request never deadlocks
""^0
0 => safe
0 => tried
for c in [1:POOL + 4]:
    tried + 1 => tried
    if deadlocks(POOL, c, 1) == 0:
        safe + 1 => safe
("concurrency levels tried with ONE connection per request: " + str(tried))^0
("  of which deadlock: " + str(tried - safe))^0
"...so the defect is not the pool being too small. It is a request holding"^0
"one resource while asking for another, which is the only way to deadlock."^0

# --------------------------------- growing the pool moves the cliff, only
""^0
"where the cliff sits for a two-connection request, by pool size:"^0
0 => monotone
0 => steps
[4, 10, 20, 50] => POOLS
for i in [0:len(POOLS) - 1]:
    POOLS[i] => p
    first_deadlock(p, 2) => f
    ("  pool %-4d deadlocks at %d concurrent" % (p, f))^0
    if i > 0:
        steps + 1 => steps
        if f > first_deadlock(POOLS[i - 1], 2):
            monotone + 1 => monotone
("the cliff moves with the pool and never goes away: " + str(monotone) + "/" + str(steps) + " steps rise")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# A one-connection request must never deadlock at any concurrency.
checked + 1 => checked
if res["1"][0] == 0:
    passed + 1 => passed

# A two-connection request must deadlock at exactly the pool size - AT the
# number everyone calls capacity, not beyond it.
checked + 1 => checked
if res["2"][0] == POOL:
    passed + 1 => passed

# Holding more connections must deadlock sooner.
checked + 1 => checked
if res["3"][0] > 0 and res["3"][0] < res["2"][0]:
    passed + 1 => passed

# The simulation and the closed form must agree on every case. Two derivations
# of the same number, so neither is taken on trust.
checked + 1 => checked
if agree == holds_n:
    passed + 1 => passed

# And enlarging the pool must move the cliff every time without removing it -
# capacity is not the fix.
checked + 1 => checked
if monotone == steps and steps > 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "At capacity means deadlocked, for any request holding two connections." => verdict
else:
    "FAILED - the pool did not behave as the checks describe." => verdict
verdict^0

""^0
"The capacity of a pool is not the number of connections, it is the number" => n1
n1^0
"of connections divided by how many one request holds at once - and the" => n2
n2^0
"second number is not in the pool's configuration, it is scattered across" => n3
n3^0
"the call sites. Which is why enlarging the pool always helps a little and" => n4
n4^0
"never fixes it." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def deadlocks(pool, concurrency, hold):
    free = pool
    held = []
    for r in range(1, concurrency+1):
        held = held + [0]
    progress = 1
    while progress == 1:
        progress = 0
        for i in range(0, concurrency):
            if held[i] < hold and free > 0:
                held[i] = held[i] + 1
                free = free - 1
                progress = 1
    runnable = 0
    for h in held:
        if h == hold:
            runnable = runnable + 1
    if runnable == 0:
        return 1
    return 0

def first_deadlock(pool, hold):
    for c in range(1, pool + 4+1):
        if deadlocks(pool, c, hold) == 1:
            return c
    return 0

def predicted(pool, hold):
    if hold <= 1:
        return 0
    c = int(pool / (hold - 1))
    if c * (hold - 1) < pool:
        c = c + 1
    return c

POOL = 10
print("connections held   first deadlocking concurrency   predicted   pool size")
res = {}
agree = 0
holds_n = 0
for hold in [1, 2, 3]:
    holds_n = holds_n + 1
    f = first_deadlock(POOL, hold)
    p = predicted(POOL, hold)
    res[str(hold)] = [f, p]
    if f == p:
        agree = agree + 1
    shown = "none"
    if f > 0:
        shown = str(f)
    pshown = "none"
    if p > 0:
        pshown = str(p)
    print("%-18s %-31s %-11s %d" % (str(hold), shown, pshown, POOL))
print("")
print("pool size: " + str(POOL))
print("simulation and formula agree on: " + str(agree) + "/" + str(holds_n) + " cases")
print("")
print("at the deadlocking concurrency, for a two-connection request:")
c2 = res["2"][0]
print("  concurrent requests: " + str(c2))
print("  connections in use:  " + str(POOL) + "/" + str(POOL) + "  (100% utilised)")
print("  requests able to run: 0")
print("...a utilisation gauge cannot distinguish this from a busy, healthy pool.")
print("")
safe = 0
tried = 0
for c in range(1, POOL + 4+1):
    tried = tried + 1
    if deadlocks(POOL, c, 1) == 0:
        safe = safe + 1
print("concurrency levels tried with ONE connection per request: " + str(tried))
print("  of which deadlock: " + str(tried - safe))
print("...so the defect is not the pool being too small. It is a request holding")
print("one resource while asking for another, which is the only way to deadlock.")
print("")
print("where the cliff sits for a two-connection request, by pool size:")
monotone = 0
steps = 0
POOLS = [4, 10, 20, 50]
for i in range(0, len(POOLS)):
    p = POOLS[i]
    f = first_deadlock(p, 2)
    print("  pool %-4d deadlocks at %d concurrent" % (p, f))
    if i > 0:
        steps = steps + 1
        if f > first_deadlock(POOLS[i - 1], 2):
            monotone = monotone + 1
print("the cliff moves with the pool and never goes away: " + str(monotone) + "/" + str(steps) + " steps rise")
passed = 0
checked = 0
checked = checked + 1
if res["1"][0] == 0:
    passed = passed + 1
checked = checked + 1
if res["2"][0] == POOL:
    passed = passed + 1
checked = checked + 1
if res["3"][0] > 0 and res["3"][0] < res["2"][0]:
    passed = passed + 1
checked = checked + 1
if agree == holds_n:
    passed = passed + 1
checked = checked + 1
if monotone == steps and steps > 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "At capacity means deadlocked, for any request holding two connections."
else:
    verdict = "FAILED - the pool did not behave as the checks describe."
print(verdict)
print("")
n1 = "The capacity of a pool is not the number of connections, it is the number"
print(n1)
n2 = "of connections divided by how many one request holds at once - and the"
print(n2)
n3 = "second number is not in the pool's configuration, it is scattered across"
print(n3)
n4 = "the call sites. Which is why enlarging the pool always helps a little and"
print(n4)
n5 = "never fixes it."
print(n5)
```

## stdout (executed)

```text
connections held   first deadlocking concurrency   predicted   pool size
1                  none                            none        10
2                  10                              10          10
3                  5                               5           10

pool size: 10
simulation and formula agree on: 3/3 cases

at the deadlocking concurrency, for a two-connection request:
  concurrent requests: 10
  connections in use:  10/10  (100% utilised)
  requests able to run: 0
...a utilisation gauge cannot distinguish this from a busy, healthy pool.

concurrency levels tried with ONE connection per request: 14
  of which deadlock: 0
...so the defect is not the pool being too small. It is a request holding
one resource while asking for another, which is the only way to deadlock.

where the cliff sits for a two-connection request, by pool size:
  pool 4    deadlocks at 4 concurrent
  pool 10   deadlocks at 10 concurrent
  pool 20   deadlocks at 20 concurrent
  pool 50   deadlocks at 50 concurrent
the cliff moves with the pool and never goes away: 3/3 steps rise

checks passed: 5/5
At capacity means deadlocked, for any request holding two connections.

The capacity of a pool is not the number of connections, it is the number
of connections divided by how many one request holds at once - and the
second number is not in the pool's configuration, it is scattered across
the call sites. Which is why enlarging the pool always helps a little and
never fixes it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
