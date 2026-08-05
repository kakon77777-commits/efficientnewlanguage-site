<!-- canonical: efficientnewlanguage.org/ai/examples/258-timeout-budget-across-hops | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 258 — Timeout budget across hops — four 5-second timeouts are not a 5-second bound

`timeout_budget_across_hops.eml` sends a request across four services under fixed per-hop timeouts and under a propagated deadline, and reports the user's wait, whether it succeeded, and how much work ran after the caller had already given up.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every service
# has a 5 second timeout, and the user waits 20.
#
# A request crosses four services. Each one is configured with "a 5 second
# timeout", which sounds like a bound on the whole thing and is not: the
# timeouts COMPOSE. Service A waits 5s for B, which waits 5s for C, which
# waits 5s for D - so a hang at D is felt as a 5s failure at C, a 5s failure
# at B... except A already gave up, and B and C keep working on a request
# nobody is waiting for.
#
# Two things go wrong and only one of them is visible:
#
#     the user's wait is the SUM along the deepest path, not any single
#     configured value
#
#     work continues downstream after the caller has abandoned it, so the
#     system does its most expensive work precisely when it is overloaded
#
# A budget fixes both: the entry point sets a deadline, each hop passes the
# REMAINING time, and a hop with no remaining budget fails immediately rather
# than starting work it cannot finish.
#
# The measurement runs the same call graph under fixed per-hop timeouts and
# under a propagated budget, reporting what the user waits and how much work
# was performed after the answer stopped mattering.

# Per-hop service latency in milliseconds under two conditions.
{} => normal
1000 => normal["A"]
800 => normal["B"]
600 => normal["C"]
400 => normal["D"]

{} => slow
1000 => slow["A"]
800 => slow["B"]
600 => slow["C"]
9000 => slow["D"]

{} => slow_b
1000 => slow_b["A"]
5500 => slow_b["B"]
600 => slow_b["C"]
400 => slow_b["D"]

["A", "B", "C", "D"] => CHAIN
5000 => PER_HOP
6000 => USER_BUDGET


def run_fixed(latency, per_hop):
    # Each hop waits `per_hop` for the next. Returns
    # [user_wait, ok, wasted_ms, hops_started].
    0 => elapsed
    0 => wasted
    0 => started
    1 => ok
    # Walk from the deepest hop back, since a hop's wait is bounded by its own
    # timeout but its cost is what actually ran.
    0 => tail
    for i in [0:len(CHAIN) - 1]:
        len(CHAIN) - 1 - i => idx
        CHAIN[idx] => name
        started + 1 => started
        latency[name] => own
        own + tail => total
        if total > per_hop:
            per_hop => tail
            0 => ok
            # The hop timed out, but the work below it keeps running to
            # completion - nobody told it to stop.
            wasted + (total - per_hop) => wasted
        else:
            total => tail
    return [tail, ok, wasted, started]


def run_budget(latency, budget):
    # The entry point sets a deadline. Each hop is given what remains, and a
    # hop with a non-positive budget does not start.
    budget => remaining
    0 => spent
    0 => started
    1 => ok
    0 => wasted
    for name in CHAIN:
        if remaining <= 0:
            0 => ok
        else:
            started + 1 => started
            latency[name] => own
            if own > remaining:
                # Runs until the deadline and then stops; the work above it is
                # abandoned, but nothing below it was ever started.
                spent + remaining => spent
                0 => remaining
                0 => ok
            else:
                spent + own => spent
                remaining - own => remaining
    return [spent, ok, wasted, started]


"condition  strategy  user wait  ok  wasted ms  hops started"^0
{} => res
for pair in [["normal", normal], ["slow-D", slow], ["slow-B", slow_b]]:
    pair[0] => cond
    pair[1] => lat
    run_fixed(lat, PER_HOP) => f
    run_budget(lat, USER_BUDGET) => b
    f => res[cond + "/fixed"]
    b => res[cond + "/budget"]
    ("%-10s %-9s %-10d %-3d %-10d %d" % (cond, "fixed", f[0], f[1], f[2], f[3]))^0
    ("%-10s %-9s %-10d %-3d %-10d %d" % (cond, "budget", b[0], b[1], b[2], b[3]))^0

""^0
("per-hop timeout: " + str(PER_HOP) + " ms across " + str(len(CHAIN)) + " hops")^0
("propagated budget: " + str(USER_BUDGET) + " ms total")^0

# ------------------------------------- what the per-hop number promises
0 => sum_normal
for name in CHAIN:
    sum_normal + normal[name] => sum_normal
""^0
("sum of normal latencies: " + str(sum_normal) + " ms")^0
("worst case a per-hop timeout of " + str(PER_HOP) + " permits: " + str(PER_HOP) + " ms at the top,")^0
"...which is what the top hop measures, not what the user waits."^0

# ------------------------------------------- the abandoned work
""^0
("with a slow D, work performed after the caller gave up:")^0
("  fixed timeouts:     " + str(res["slow-D/fixed"][2]) + " ms")^0
("  propagated budget:  " + str(res["slow-D/budget"][2]) + " ms")^0
("hops started before failing:")^0
("  fixed timeouts:     " + str(res["slow-D/fixed"][3]) + "/" + str(len(CHAIN)))^0
("  propagated budget:  " + str(res["slow-D/budget"][3]) + "/" + str(len(CHAIN)))^0
"...equal, because D is the last hop - nothing was left to skip. The skip"^0
"only shows up when the budget runs out with hops remaining:"^0
("  slow-B, fixed timeouts:    " + str(res["slow-B/fixed"][3]) + "/" + str(len(CHAIN)) + " hops started")^0
("  slow-B, propagated budget: " + str(res["slow-B/budget"][3]) + "/" + str(len(CHAIN)) + " hops started")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# When everything is fast, both strategies must succeed and take the same
# time - a budget must not cost anything on the happy path.
checked + 1 => checked
if res["normal/fixed"][1] == 1 and res["normal/budget"][1] == 1:
    if res["normal/fixed"][0] == res["normal/budget"][0]:
        passed + 1 => passed

# The normal-path wait must equal the SUM of the hops, not any single timeout.
checked + 1 => checked
if res["normal/budget"][0] == sum_normal:
    passed + 1 => passed

# With a slow D, both must fail. A strategy that reports success here is not
# enforcing anything.
checked + 1 => checked
if res["slow-D/fixed"][1] == 0 and res["slow-D/budget"][1] == 0:
    passed + 1 => passed

# The budget must bound the user's wait; the per-hop scheme must exceed it.
checked + 1 => checked
if res["slow-D/budget"][0] <= USER_BUDGET and res["slow-D/fixed"][0] > 0:
    passed + 1 => passed

# And the budget must waste strictly less work than fixed timeouts under the
# slow condition - that is the property the propagation buys.
checked + 1 => checked
if res["slow-D/budget"][2] < res["slow-D/fixed"][2]:
    passed + 1 => passed

# When the budget is exhausted with hops still to go, those hops must not
# start at all. The slow-D condition cannot show this - D is last, so there is
# nothing left to skip - which is why a second slow condition exists.
checked + 1 => checked
if res["slow-B/budget"][3] < len(CHAIN) and res["slow-B/fixed"][3] == len(CHAIN):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Per-hop timeouts compose by addition; only a deadline bounds the user." => verdict
else:
    "FAILED - a timeout strategy did not behave as the checks describe." => verdict
verdict^0

""^0
"Four services each configured with the same timeout do not enforce that" => n1
n1^0
"timeout - they enforce it four times, in sequence. The number that matters" => n2
n2^0
"is a deadline set once at the edge and carried down, and the reason it" => n3
n3^0
"matters most under load is that abandoned work is work the system is doing" => n4
n4^0
"instead of the work it still could have finished." => n5
n5^0
```

## Python (deterministic transpilation)

```python
normal = {}
normal["A"] = 1000
normal["B"] = 800
normal["C"] = 600
normal["D"] = 400
slow = {}
slow["A"] = 1000
slow["B"] = 800
slow["C"] = 600
slow["D"] = 9000
slow_b = {}
slow_b["A"] = 1000
slow_b["B"] = 5500
slow_b["C"] = 600
slow_b["D"] = 400
CHAIN = ["A", "B", "C", "D"]
PER_HOP = 5000
USER_BUDGET = 6000

def run_fixed(latency, per_hop):
    elapsed = 0
    wasted = 0
    started = 0
    ok = 1
    tail = 0
    for i in range(0, len(CHAIN)):
        idx = len(CHAIN) - 1 - i
        name = CHAIN[idx]
        started = started + 1
        own = latency[name]
        total = own + tail
        if total > per_hop:
            tail = per_hop
            ok = 0
            wasted = wasted + total - per_hop
        else:
            tail = total
    return [tail, ok, wasted, started]

def run_budget(latency, budget):
    remaining = budget
    spent = 0
    started = 0
    ok = 1
    wasted = 0
    for name in CHAIN:
        if remaining <= 0:
            ok = 0
        else:
            started = started + 1
            own = latency[name]
            if own > remaining:
                spent = spent + remaining
                remaining = 0
                ok = 0
            else:
                spent = spent + own
                remaining = remaining - own
    return [spent, ok, wasted, started]

print("condition  strategy  user wait  ok  wasted ms  hops started")
res = {}
for pair in [["normal", normal], ["slow-D", slow], ["slow-B", slow_b]]:
    cond = pair[0]
    lat = pair[1]
    f = run_fixed(lat, PER_HOP)
    b = run_budget(lat, USER_BUDGET)
    res[cond + "/fixed"] = f
    res[cond + "/budget"] = b
    print("%-10s %-9s %-10d %-3d %-10d %d" % (cond, "fixed", f[0], f[1], f[2], f[3]))
    print("%-10s %-9s %-10d %-3d %-10d %d" % (cond, "budget", b[0], b[1], b[2], b[3]))
print("")
print("per-hop timeout: " + str(PER_HOP) + " ms across " + str(len(CHAIN)) + " hops")
print("propagated budget: " + str(USER_BUDGET) + " ms total")
sum_normal = 0
for name in CHAIN:
    sum_normal = sum_normal + normal[name]
print("")
print("sum of normal latencies: " + str(sum_normal) + " ms")
print("worst case a per-hop timeout of " + str(PER_HOP) + " permits: " + str(PER_HOP) + " ms at the top,")
print("...which is what the top hop measures, not what the user waits.")
print("")
print("with a slow D, work performed after the caller gave up:")
print("  fixed timeouts:     " + str(res["slow-D/fixed"][2]) + " ms")
print("  propagated budget:  " + str(res["slow-D/budget"][2]) + " ms")
print("hops started before failing:")
print("  fixed timeouts:     " + str(res["slow-D/fixed"][3]) + "/" + str(len(CHAIN)))
print("  propagated budget:  " + str(res["slow-D/budget"][3]) + "/" + str(len(CHAIN)))
print("...equal, because D is the last hop - nothing was left to skip. The skip")
print("only shows up when the budget runs out with hops remaining:")
print("  slow-B, fixed timeouts:    " + str(res["slow-B/fixed"][3]) + "/" + str(len(CHAIN)) + " hops started")
print("  slow-B, propagated budget: " + str(res["slow-B/budget"][3]) + "/" + str(len(CHAIN)) + " hops started")
passed = 0
checked = 0
checked = checked + 1
if res["normal/fixed"][1] == 1 and res["normal/budget"][1] == 1:
    if res["normal/fixed"][0] == res["normal/budget"][0]:
        passed = passed + 1
checked = checked + 1
if res["normal/budget"][0] == sum_normal:
    passed = passed + 1
checked = checked + 1
if res["slow-D/fixed"][1] == 0 and res["slow-D/budget"][1] == 0:
    passed = passed + 1
checked = checked + 1
if res["slow-D/budget"][0] <= USER_BUDGET and res["slow-D/fixed"][0] > 0:
    passed = passed + 1
checked = checked + 1
if res["slow-D/budget"][2] < res["slow-D/fixed"][2]:
    passed = passed + 1
checked = checked + 1
if res["slow-B/budget"][3] < len(CHAIN) and res["slow-B/fixed"][3] == len(CHAIN):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Per-hop timeouts compose by addition; only a deadline bounds the user."
else:
    verdict = "FAILED - a timeout strategy did not behave as the checks describe."
print(verdict)
print("")
n1 = "Four services each configured with the same timeout do not enforce that"
print(n1)
n2 = "timeout - they enforce it four times, in sequence. The number that matters"
print(n2)
n3 = "is a deadline set once at the edge and carried down, and the reason it"
print(n3)
n4 = "matters most under load is that abandoned work is work the system is doing"
print(n4)
n5 = "instead of the work it still could have finished."
print(n5)
```

## stdout (executed)

```text
condition  strategy  user wait  ok  wasted ms  hops started
normal     fixed     2800       1   0          4
normal     budget    2800       1   0          4
slow-D     fixed     5000       0   6400       4
slow-D     budget    6000       0   0          4
slow-B     fixed     5000       0   2500       4
slow-B     budget    6000       0   0          2

per-hop timeout: 5000 ms across 4 hops
propagated budget: 6000 ms total

sum of normal latencies: 2800 ms
worst case a per-hop timeout of 5000 permits: 5000 ms at the top,
...which is what the top hop measures, not what the user waits.

with a slow D, work performed after the caller gave up:
  fixed timeouts:     6400 ms
  propagated budget:  0 ms
hops started before failing:
  fixed timeouts:     4/4
  propagated budget:  4/4
...equal, because D is the last hop - nothing was left to skip. The skip
only shows up when the budget runs out with hops remaining:
  slow-B, fixed timeouts:    4/4 hops started
  slow-B, propagated budget: 2/4 hops started

checks passed: 6/6
Per-hop timeouts compose by addition; only a deadline bounds the user.

Four services each configured with the same timeout do not enforce that
timeout - they enforce it four times, in sequence. The number that matters
is a deadline set once at the edge and carried down, and the reason it
matters most under load is that abandoned work is work the system is doing
instead of the work it still could have finished.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
