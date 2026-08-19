<!-- canonical: efficientnewlanguage.org/ai/examples/460-the-static-split-was-the-one-that-diverged | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 460 — The static split was the one that diverged

`the_static_split_was_the_one_that_diverged.eml` - The scaler moves workers towards whichever queue is deeper, and it acts on numbers that are already stale. Whether that makes it unstable is simulated rather than argued.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The scaler moves
# workers towards whichever queue is deeper, and it acts on numbers that are
# already stale. Whether that makes it unstable is simulated rather than
# argued.
#
# The worry is a real one and it has a name. A controller that reacts to a
# measurement taken before its last action landed can chase its own tail, and
# the usual advice is to damp it, to widen the interval, or to pin the
# allocation and stop reacting at all.
#
# Pinning it is also a policy, and it is the one with no feedback. What each
# policy does is a property of the arrival rates and the delay, so both are
# run over the same arrivals here and the backlog is integrated over time.

20 => workers
30 => intervals
24 => start_a
4 => start_b

# Returns [backlog integrated over time, largest single-interval backlog,
# final depth of queue A, allocation swing over the last third]
def run(chasing, lag, arr_a, arr_b):
    start_a => qa
    start_b => qb
    int(workers / 2) => alloc
    [] => decided
    0 => total
    0 => peak
    0 => lo
    0 => hi
    0 => t
    while t < intervals:
        alloc => applied
        if t >= lag:
            decided[t - lag] => applied
        applied => used_a
        if qa < applied:
            qa => used_a
        workers - applied => rest
        rest => used_b
        if qb < rest:
            qb => used_b
        qa - used_a + arr_a => qa
        qb - used_b + arr_b => qb
        total + qa + qb => total
        if qa + qb > peak:
            qa + qb => peak
        if t >= intervals - 10:
            if lo == 0:
                applied => lo
                applied => hi
            if applied < lo:
                applied => lo
            if applied > hi:
                applied => hi
        int(workers / 2) => target
        if qa + qb > 0:
            int(workers * qa / (qa + qb)) => target
        applied => nxt
        if chasing == 1:
            target => nxt
        decided + [nxt] => decided
        t + 1 => t
    return [total, peak, qa, hi - lo]

# ---- at saturation, where the two policies part company ----

12 => sat_a
8 => sat_b
run(1, 3, sat_a, sat_b) => chase
run(0, 3, sat_a, sat_b) => pinned

"workers : " + str(workers) + ", intervals : " + str(intervals) ^0
"arrivals per interval : " + str(sat_a) + " and " + str(sat_b) + ", total " + str(sat_a + sat_b) ^0
"spare capacity : " + str(workers - sat_a - sat_b) ^0
"the scaler acts on depths measured 3 intervals earlier" ^0
"" ^0

"policy                 backlog over time   worst interval   queue A at the end" ^0
"  chases the deeper    " + str(chase[0]) + "                " + str(chase[1]) + "              " + str(chase[2]) ^0
"  pinned at half each  " + str(pinned[0]) + "                " + str(pinned[1]) + "             " + str(pinned[2]) ^0
"" ^0

if pinned[0] > chase[0]:
    "the pinned split carries " + str(pinned[0] - chase[0]) + " more backlog-intervals, which is " + str(int(pinned[0] * 100 / chase[0]) - 100) + "% more" ^0
if pinned[2] > chase[2]:
    "and it ends with queue A " + str(pinned[2] - chase[2]) + " deeper, still climbing" ^0
"  the policy with no feedback is the one that runs away, because half the" ^0
"  workers is less than queue A's arrival rate and nothing corrects it" ^0
"" ^0

# ---- what the stale measurement actually costs ----
#
# The delay is not free. Its price is a share of the backlog, and that share
# depends on how much spare capacity there is to absorb it.

"lag cost, at three levels of spare capacity" ^0
"spare   lag 1     lag 3     penalty" ^0
[[10, 6], [12, 7], [12, 8]] => rates
0 => worst_pen
0 => worst_spare
for r in rates:
    run(1, 1, r[0], r[1]) => fast
    run(1, 3, r[0], r[1]) => slow
    workers - r[0] - r[1] => spare
    int(slow[0] * 100 / fast[0]) - 100 => pen
    "  " + str(spare) + "      " + str(fast[0]) + "      " + str(slow[0]) + "      " + str(pen) + "%" ^0
    if pen > worst_pen:
        pen => worst_pen
        spare => worst_spare
"" ^0
"  worst penalty : " + str(worst_pen) + "%, at spare capacity " + str(worst_spare) ^0
if worst_spare > 0:
    "  it is not the tightest setting that suffers most. At spare 0 both" ^0
    "  policies are already saturated, so a misallocation costs less as a" ^0
    "  share of a backlog that was going to be large anyway. The delay hurts" ^0
    "  most where the capacity was nearly enough" ^0
else:
    "  the penalty is worst at the tightest setting" ^0
"" ^0

# ---- where the wobble is, and where it is not ----
#
# The chasing that was supposed to oscillate mostly settles. A swing in the
# allocation appears only when the delay is long and the spare capacity is
# nearly gone.

"allocation swing over the last 10 intervals" ^0
"spare   lag 1   lag 3" ^0
for r in rates:
    run(1, 1, r[0], r[1]) => fast
    run(1, 3, r[0], r[1]) => slow
    workers - r[0] - r[1] => spare
    "  " + str(spare) + "      " + str(fast[3]) + "       " + str(slow[3]) ^0
"" ^0
run(1, 3, 12, 7) => edge
if edge[3] > 0:
    "  the largest swing here is " + str(edge[3]) + " workers, at spare capacity 1 and lag 3" ^0
run(1, 1, 12, 7) => edge_fast
if edge_fast[3] == 0:
    "  and the same rates with lag 1 hold a steady allocation" ^0
"  so the instability is a property of the pair, not of reacting at all" ^0
"" ^0

# ---- the control: plenty of spare capacity ----
#
# Where the workers comfortably outnumber the arrivals, both policies drain the
# backlog and a comparison between them decides nothing.

run(1, 3, 8, 4) => c_chase
run(0, 3, 8, 4) => c_pinned
"control - arrivals 8 and 4 against " + str(workers) + " workers" ^0
"  chasing : backlog " + str(c_chase[0]) + ", queue A at the end " + str(c_chase[2]) ^0
"  pinned  : backlog " + str(c_pinned[0]) + ", queue A at the end " + str(c_pinned[2]) ^0
if c_pinned[2] == c_chase[2]:
    "  both end at the same depth, so this workload cannot separate them" ^0
"" ^0

"Reacting to a stale measurement is a real hazard and the delay has a price" ^0
"that grows as the slack runs out. The policy that diverged here is the one" ^0
"that stopped reacting." ^0
```

## Python (deterministic transpilation)

```python
workers = 20
intervals = 30
start_a = 24
start_b = 4

def run(chasing, lag, arr_a, arr_b):
    qa = start_a
    qb = start_b
    alloc = int(workers / 2)
    decided = []
    total = 0
    peak = 0
    lo = 0
    hi = 0
    t = 0
    while t < intervals:
        applied = alloc
        if t >= lag:
            applied = decided[t - lag]
        used_a = applied
        if qa < applied:
            used_a = qa
        rest = workers - applied
        used_b = rest
        if qb < rest:
            used_b = qb
        qa = qa - used_a + arr_a
        qb = qb - used_b + arr_b
        total = total + qa + qb
        if qa + qb > peak:
            peak = qa + qb
        if t >= intervals - 10:
            if lo == 0:
                lo = applied
                hi = applied
            if applied < lo:
                lo = applied
            if applied > hi:
                hi = applied
        target = int(workers / 2)
        if qa + qb > 0:
            target = int(workers * qa / (qa + qb))
        nxt = applied
        if chasing == 1:
            nxt = target
        decided = decided + [nxt]
        t = t + 1
    return [total, peak, qa, hi - lo]

sat_a = 12
sat_b = 8
chase = run(1, 3, sat_a, sat_b)
pinned = run(0, 3, sat_a, sat_b)
print("workers : " + str(workers) + ", intervals : " + str(intervals))
print("arrivals per interval : " + str(sat_a) + " and " + str(sat_b) + ", total " + str(sat_a + sat_b))
print("spare capacity : " + str(workers - sat_a - sat_b))
print("the scaler acts on depths measured 3 intervals earlier")
print("")
print("policy                 backlog over time   worst interval   queue A at the end")
print("  chases the deeper    " + str(chase[0]) + "                " + str(chase[1]) + "              " + str(chase[2]))
print("  pinned at half each  " + str(pinned[0]) + "                " + str(pinned[1]) + "             " + str(pinned[2]))
print("")
if pinned[0] > chase[0]:
    print("the pinned split carries " + str(pinned[0] - chase[0]) + " more backlog-intervals, which is " + str(int(pinned[0] * 100 / chase[0]) - 100) + "% more")
if pinned[2] > chase[2]:
    print("and it ends with queue A " + str(pinned[2] - chase[2]) + " deeper, still climbing")
print("  the policy with no feedback is the one that runs away, because half the")
print("  workers is less than queue A's arrival rate and nothing corrects it")
print("")
print("lag cost, at three levels of spare capacity")
print("spare   lag 1     lag 3     penalty")
rates = [[10, 6], [12, 7], [12, 8]]
worst_pen = 0
worst_spare = 0
for r in rates:
    fast = run(1, 1, r[0], r[1])
    slow = run(1, 3, r[0], r[1])
    spare = workers - r[0] - r[1]
    pen = int(slow[0] * 100 / fast[0]) - 100
    print("  " + str(spare) + "      " + str(fast[0]) + "      " + str(slow[0]) + "      " + str(pen) + "%")
    if pen > worst_pen:
        worst_pen = pen
        worst_spare = spare
print("")
print("  worst penalty : " + str(worst_pen) + "%, at spare capacity " + str(worst_spare))
if worst_spare > 0:
    print("  it is not the tightest setting that suffers most. At spare 0 both")
    print("  policies are already saturated, so a misallocation costs less as a")
    print("  share of a backlog that was going to be large anyway. The delay hurts")
    print("  most where the capacity was nearly enough")
else:
    print("  the penalty is worst at the tightest setting")
print("")
print("allocation swing over the last 10 intervals")
print("spare   lag 1   lag 3")
for r in rates:
    fast = run(1, 1, r[0], r[1])
    slow = run(1, 3, r[0], r[1])
    spare = workers - r[0] - r[1]
    print("  " + str(spare) + "      " + str(fast[3]) + "       " + str(slow[3]))
print("")
edge = run(1, 3, 12, 7)
if edge[3] > 0:
    print("  the largest swing here is " + str(edge[3]) + " workers, at spare capacity 1 and lag 3")
edge_fast = run(1, 1, 12, 7)
if edge_fast[3] == 0:
    print("  and the same rates with lag 1 hold a steady allocation")
print("  so the instability is a property of the pair, not of reacting at all")
print("")
c_chase = run(1, 3, 8, 4)
c_pinned = run(0, 3, 8, 4)
print("control - arrivals 8 and 4 against " + str(workers) + " workers")
print("  chasing : backlog " + str(c_chase[0]) + ", queue A at the end " + str(c_chase[2]))
print("  pinned  : backlog " + str(c_pinned[0]) + ", queue A at the end " + str(c_pinned[2]))
if c_pinned[2] == c_chase[2]:
    print("  both end at the same depth, so this workload cannot separate them")
print("")
print("Reacting to a stale measurement is a real hazard and the delay has a price")
print("that grows as the slack runs out. The policy that diverged here is the one")
print("that stopped reacting.")
```

## stdout (executed)

```text
workers : 20, intervals : 30
arrivals per interval : 12 and 8, total 20
spare capacity : 0
the scaler acts on depths measured 3 intervals earlier

policy                 backlog over time   worst interval   queue A at the end
  chases the deeper    1134                38              22
  pinned at half each  1890                92             84

the pinned split carries 756 more backlog-intervals, which is 66% more
and it ends with queue A 62 deeper, still climbing
  the policy with no feedback is the one that runs away, because half the
  workers is less than queue A's arrival rate and nothing corrects it

lag cost, at three levels of spare capacity
spare   lag 1     lag 3     penalty
  4      512      554      8%
  1      675      857      26%
  0      1020      1134      11%

  worst penalty : 26%, at spare capacity 1
  it is not the tightest setting that suffers most. At spare 0 both
  policies are already saturated, so a misallocation costs less as a
  share of a backlog that was going to be large anyway. The delay hurts
  most where the capacity was nearly enough

allocation swing over the last 10 intervals
spare   lag 1   lag 3
  4      0       0
  1      0       4
  0      0       2

  the largest swing here is 4 workers, at spare capacity 1 and lag 3
  and the same rates with lag 1 hold a steady allocation
  so the instability is a property of the pair, not of reacting at all

control - arrivals 8 and 4 against 20 workers
  chasing : backlog 398, queue A at the end 8
  pinned  : backlog 416, queue A at the end 8
  both end at the same depth, so this workload cannot separate them

Reacting to a stale measurement is a real hazard and the delay has a price
that grows as the slack runs out. The policy that diverged here is the one
that stopped reacting.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
