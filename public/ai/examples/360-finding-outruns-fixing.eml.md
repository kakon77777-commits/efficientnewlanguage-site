<!-- canonical: efficientnewlanguage.org/ai/examples/360-finding-outruns-fixing | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 360 — Finding outruns fixing — same capacity, same count fixed, 127 against 71

`finding_outruns_fixing.eml` simulates a defect queue under two work orders with identical throughput.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finding is
# cheaper than fixing, so the backlog grows, and the order it is worked in
# stops being a preference.
#
# While the queue is short, "work in the order received" is fair and costs
# nothing. Once arrivals outrun departures the queue never empties, and the
# order stops deciding when things are fixed - it decides which things are
# fixed at all, and for how long each unfixed one keeps costing.
#
# The two policies below clear the SAME number of findings per period. Nothing
# about capacity differs. Only the order.
#
# Nothing is declared. The queue is simulated period by period and the cost is
# accumulated as harm multiplied by the periods a finding spent unfixed.

# [id, arrival period, harm per period]
[["f1", 1, 1], ["f2", 1, 9], ["f3", 2, 2], ["f4", 2, 8], ["f5", 3, 1], ["f6", 3, 7], ["f7", 4, 3], ["f8", 4, 6], ["f9", 5, 1], ["f10", 5, 10]] => findings

1 => fix_capacity
6 => horizon

def arrived_by(period):
    [] => q
    for f in findings:
        if f[1] <= period:
            q + [f] => q
    return q

def pick_fifo(open_ids):
    # earliest arrival first; findings is already in arrival order
    [] => picked
    for f in findings:
        if len(picked) < fix_capacity:
            if f[0] in open_ids:
                picked + [f[0]] => picked
    return picked

def pick_by_harm(open_ids):
    [] => picked
    [] => taken
    for _slot in [1:fix_capacity]:
        0 => best_harm
        "" => best_id
        for f in findings:
            if f[0] in open_ids:
                if not (f[0] in taken):
                    if f[2] > best_harm:
                        f[2] => best_harm
                        f[0] => best_id
        if best_id != "":
            taken + [best_id] => taken
            picked + [best_id] => picked
    return picked

def simulate(policy):
    [] => open_ids
    0 => total_cost
    0 => fixed_count
    for p in [1:horizon]:
        # arrivals
        for f in findings:
            if f[1] == p:
                open_ids + [f[0]] => open_ids
        # cost accrues on everything still open at the start of the period
        for f in findings:
            if f[0] in open_ids:
                total_cost + f[2] => total_cost
        # capacity
        [] => picked
        if policy == "fifo":
            pick_fifo(open_ids) => picked
        else:
            pick_by_harm(open_ids) => picked
        [] => still_open
        for o in open_ids:
            if not (o in picked):
                still_open + [o] => still_open
        fixed_count + len(picked) => fixed_count
        still_open => open_ids
    return [total_cost, fixed_count, len(open_ids)]

# ---- arrivals against capacity ----

"findings arriving : " + str(len(findings)) + " over " + str(horizon) + " periods" ^0
"fix capacity      : " + str(fix_capacity) + " per period, " + str(fix_capacity * horizon) + " total" ^0
if len(findings) > fix_capacity * horizon:
    "  arrivals exceed capacity - the queue cannot empty" ^0
else:
    "  capacity is sufficient over the horizon" ^0
"" ^0

# ---- the two policies ----

simulate("fifo") => a
simulate("harm") => b
"in the order received" ^0
"  cost accrued  : " + str(a[0]) ^0
"  findings fixed : " + str(a[1]) ^0
"  still open     : " + str(a[2]) ^0
"" ^0
"worst first" ^0
"  cost accrued  : " + str(b[0]) ^0
"  findings fixed : " + str(b[1]) ^0
"  still open     : " + str(b[2]) ^0
"" ^0
"same capacity, same arrivals" ^0
if a[1] == b[1]:
    "  both policies fixed the same number : " + str(a[1]) ^0
"  cost difference : " + str(a[0] - b[0]) ^0
"" ^0

# ---- which findings are left open under each ----

def open_at_end(policy):
    [] => open_ids
    for p in [1:horizon]:
        for f in findings:
            if f[1] == p:
                open_ids + [f[0]] => open_ids
        [] => picked
        if policy == "fifo":
            pick_fifo(open_ids) => picked
        else:
            pick_by_harm(open_ids) => picked
        [] => still
        for o in open_ids:
            if not (o in picked):
                still + [o] => still
        still => open_ids
    return open_ids

open_at_end("fifo") => left_fifo
open_at_end("harm") => left_harm
"left open at the horizon" ^0
"  in the order received : " + repr(left_fifo) ^0
"  worst first           : " + repr(left_harm) ^0
"" ^0

0 => harm_left_fifo
0 => harm_left_harm
for f in findings:
    if f[0] in left_fifo:
        harm_left_fifo + f[2] => harm_left_fifo
    if f[0] in left_harm:
        harm_left_harm + f[2] => harm_left_harm
"  harm per period still accruing, order received : " + str(harm_left_fifo) ^0
"  harm per period still accruing, worst first    : " + str(harm_left_harm) ^0
"" ^0

# ---- when the order does not matter ----
#
# Run the same two policies with capacity large enough to clear every arrival.

def simulate_with(policy, cap):
    [] => open_ids
    0 => total_cost
    for p in [1:horizon]:
        for f in findings:
            if f[1] == p:
                open_ids + [f[0]] => open_ids
        for f in findings:
            if f[0] in open_ids:
                total_cost + f[2] => total_cost
        [] => picked
        0 => n
        if policy == "fifo":
            for f in findings:
                if n < cap:
                    if f[0] in open_ids:
                        picked + [f[0]] => picked
                        n + 1 => n
        else:
            [] => taken
            for _s in [1:cap]:
                0 => bh
                "" => bi
                for f in findings:
                    if f[0] in open_ids:
                        if not (f[0] in taken):
                            if f[2] > bh:
                                f[2] => bh
                                f[0] => bi
                if bi != "":
                    taken + [bi] => taken
                    picked + [bi] => picked
        [] => still
        for o in open_ids:
            if not (o in picked):
                still + [o] => still
        still => open_ids
    return total_cost

"the same two policies at capacity 10 per period" ^0
"  in the order received : " + str(simulate_with("fifo", 10)) ^0
"  worst first           : " + str(simulate_with("harm", 10)) ^0
if simulate_with("fifo", 10) == simulate_with("harm", 10):
    "  identical - with spare capacity the order is a preference" ^0
"" ^0

"A queue policy is free while the queue drains. The moment finding outruns" ^0
"fixing it becomes the thing that decides what the system is like to use, and" ^0
"nobody chose it for that job." ^0
```

## Python (deterministic transpilation)

```python
findings = [["f1", 1, 1], ["f2", 1, 9], ["f3", 2, 2], ["f4", 2, 8], ["f5", 3, 1], ["f6", 3, 7], ["f7", 4, 3], ["f8", 4, 6], ["f9", 5, 1], ["f10", 5, 10]]
fix_capacity = 1
horizon = 6

def arrived_by(period):
    q = []
    for f in findings:
        if f[1] <= period:
            q = q + [f]
    return q

def pick_fifo(open_ids):
    picked = []
    for f in findings:
        if len(picked) < fix_capacity:
            if f[0] in open_ids:
                picked = picked + [f[0]]
    return picked

def pick_by_harm(open_ids):
    picked = []
    taken = []
    for _slot in range(1, fix_capacity+1):
        best_harm = 0
        best_id = ""
        for f in findings:
            if f[0] in open_ids:
                if not f[0] in taken:
                    if f[2] > best_harm:
                        best_harm = f[2]
                        best_id = f[0]
        if best_id != "":
            taken = taken + [best_id]
            picked = picked + [best_id]
    return picked

def simulate(policy):
    open_ids = []
    total_cost = 0
    fixed_count = 0
    for p in range(1, horizon+1):
        for f in findings:
            if f[1] == p:
                open_ids = open_ids + [f[0]]
        for f in findings:
            if f[0] in open_ids:
                total_cost = total_cost + f[2]
        picked = []
        if policy == "fifo":
            picked = pick_fifo(open_ids)
        else:
            picked = pick_by_harm(open_ids)
        still_open = []
        for o in open_ids:
            if not o in picked:
                still_open = still_open + [o]
        fixed_count = fixed_count + len(picked)
        open_ids = still_open
    return [total_cost, fixed_count, len(open_ids)]

print("findings arriving : " + str(len(findings)) + " over " + str(horizon) + " periods")
print("fix capacity      : " + str(fix_capacity) + " per period, " + str(fix_capacity * horizon) + " total")
if len(findings) > fix_capacity * horizon:
    print("  arrivals exceed capacity - the queue cannot empty")
else:
    print("  capacity is sufficient over the horizon")
print("")
a = simulate("fifo")
b = simulate("harm")
print("in the order received")
print("  cost accrued  : " + str(a[0]))
print("  findings fixed : " + str(a[1]))
print("  still open     : " + str(a[2]))
print("")
print("worst first")
print("  cost accrued  : " + str(b[0]))
print("  findings fixed : " + str(b[1]))
print("  still open     : " + str(b[2]))
print("")
print("same capacity, same arrivals")
if a[1] == b[1]:
    print("  both policies fixed the same number : " + str(a[1]))
print("  cost difference : " + str(a[0] - b[0]))
print("")

def open_at_end(policy):
    open_ids = []
    for p in range(1, horizon+1):
        for f in findings:
            if f[1] == p:
                open_ids = open_ids + [f[0]]
        picked = []
        if policy == "fifo":
            picked = pick_fifo(open_ids)
        else:
            picked = pick_by_harm(open_ids)
        still = []
        for o in open_ids:
            if not o in picked:
                still = still + [o]
        open_ids = still
    return open_ids

left_fifo = open_at_end("fifo")
left_harm = open_at_end("harm")
print("left open at the horizon")
print("  in the order received : " + repr(left_fifo))
print("  worst first           : " + repr(left_harm))
print("")
harm_left_fifo = 0
harm_left_harm = 0
for f in findings:
    if f[0] in left_fifo:
        harm_left_fifo = harm_left_fifo + f[2]
    if f[0] in left_harm:
        harm_left_harm = harm_left_harm + f[2]
print("  harm per period still accruing, order received : " + str(harm_left_fifo))
print("  harm per period still accruing, worst first    : " + str(harm_left_harm))
print("")

def simulate_with(policy, cap):
    open_ids = []
    total_cost = 0
    for p in range(1, horizon+1):
        for f in findings:
            if f[1] == p:
                open_ids = open_ids + [f[0]]
        for f in findings:
            if f[0] in open_ids:
                total_cost = total_cost + f[2]
        picked = []
        n = 0
        if policy == "fifo":
            for f in findings:
                if n < cap:
                    if f[0] in open_ids:
                        picked = picked + [f[0]]
                        n = n + 1
        else:
            taken = []
            for _s in range(1, cap+1):
                bh = 0
                bi = ""
                for f in findings:
                    if f[0] in open_ids:
                        if not f[0] in taken:
                            if f[2] > bh:
                                bh = f[2]
                                bi = f[0]
                if bi != "":
                    taken = taken + [bi]
                    picked = picked + [bi]
        still = []
        for o in open_ids:
            if not o in picked:
                still = still + [o]
        open_ids = still
    return total_cost

print("the same two policies at capacity 10 per period")
print("  in the order received : " + str(simulate_with("fifo", 10)))
print("  worst first           : " + str(simulate_with("harm", 10)))
if simulate_with("fifo", 10) == simulate_with("harm", 10):
    print("  identical - with spare capacity the order is a preference")
print("")
print("A queue policy is free while the queue drains. The moment finding outruns")
print("fixing it becomes the thing that decides what the system is like to use, and")
print("nobody chose it for that job.")
```

## stdout (executed)

```text
findings arriving : 10 over 6 periods
fix capacity      : 1 per period, 6 total
  arrivals exceed capacity - the queue cannot empty

in the order received
  cost accrued  : 127
  findings fixed : 6
  still open     : 4

worst first
  cost accrued  : 71
  findings fixed : 6
  still open     : 4

same capacity, same arrivals
  both policies fixed the same number : 6
  cost difference : 56

left open at the horizon
  in the order received : ['f7', 'f8', 'f9', 'f10']
  worst first           : ['f1', 'f3', 'f5', 'f9']

  harm per period still accruing, order received : 20
  harm per period still accruing, worst first    : 5

the same two policies at capacity 10 per period
  in the order received : 48
  worst first           : 48
  identical - with spare capacity the order is a preference

A queue policy is free while the queue drains. The moment finding outruns
fixing it becomes the thing that decides what the system is like to use, and
nobody chose it for that job.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
