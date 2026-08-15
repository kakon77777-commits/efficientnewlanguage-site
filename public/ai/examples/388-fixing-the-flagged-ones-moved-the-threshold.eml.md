<!-- canonical: efficientnewlanguage.org/ai/examples/388-fixing-the-flagged-ones-moved-the-threshold | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 388 — Fixing the flagged ones moved the threshold - 3 flagged every round, forever

`fixing_the_flagged_ones_moved_the_threshold.eml` runs a relative and an absolute review rule over the same starting population for the same number of rounds.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The review queue
# flags the worst quarter. It will flag a quarter forever.
#
# A relative threshold is the sensible choice and it is chosen for good reasons:
# an absolute one has to be picked out of the air, it goes stale as the system
# changes, and it either floods the queue or empties it. "Review the worst 25%"
# needs no calibration and never produces a queue nobody can work through.
#
# It also recomputes itself from a distribution that the reviewing is changing.
# Every round the reviewers do their job, the distribution improves, the
# threshold follows it down, and the queue is the same size.
#
# Both policies are run over the same starting population for the same number
# of rounds, so the comparison is between two rules and not two histories.

[9, 8, 7, 6, 6, 5, 5, 4, 4, 3, 2, 1] => start
4 => rounds

def worst_n(items, n):
    [] => picked
    [] => rest
    for x in items:
        rest + [x] => rest
    for k in [1:n]:
        0 => best
        0 => at
        0 => i
        for x in rest:
            if x > best:
                x => best
                i => at
            i + 1 => i
        picked + [best] => picked
        [] => nr
        0 => j
        for x in rest:
            if not (j == at):
                nr + [x] => nr
            j + 1 => j
        nr => rest
    return picked

def repaired(x):
    return int(x / 2)

def run_relative(items, n):
    [] => out
    worst_n(items, n) => flagged
    [] => remaining
    for x in items:
        remaining + [x] => remaining
    for f in flagged:
        [] => nr
        0 => removed
        for x in remaining:
            if x == f:
                if removed == 0:
                    1 => removed
                    nr + [repaired(x)] => nr
                else:
                    nr + [x] => nr
            else:
                nr + [x] => nr
        nr => remaining
    return remaining

def run_absolute(items, limit):
    [] => out
    for x in items:
        if x > limit:
            out + [repaired(x)] => out
        else:
            out + [x] => out
    return out

def flagged_absolute(items, limit):
    0 => c
    for x in items:
        if x > limit:
            c + 1 => c
    return c

def total(items):
    0 => t
    for x in items:
        t + x => t
    return t

def worst(items):
    0 => w
    for x in items:
        if x > w:
            x => w
    return w

3 => quarter
5 => limit

"start : " + str(len(start)) + " items, total defects " + str(total(start)) + ", worst " + str(worst(start)) ^0
"" ^0

"policy A - flag the worst " + str(quarter) + " each round" ^0
start => a
for r in [1:rounds]:
    len(worst_n(a, quarter)) => flagged
    run_relative(a, quarter) => a
    "  round " + str(r) + " : flagged " + str(flagged) + ", total now " + str(total(a)) + ", worst now " + str(worst(a)) ^0
"" ^0

"policy B - flag anything above " + str(limit) ^0
start => b
for r in [1:rounds]:
    flagged_absolute(b, limit) => flagged
    run_absolute(b, limit) => b
    "  round " + str(r) + " : flagged " + str(flagged) + ", total now " + str(total(b)) + ", worst now " + str(worst(b)) ^0
"" ^0

"after " + str(rounds) + " rounds" ^0
"  policy A : total " + str(total(a)) + ", worst " + str(worst(a)) + ", still flagging " + str(len(worst_n(a, quarter))) + " per round" ^0
"  policy B : total " + str(total(b)) + ", worst " + str(worst(b)) + ", still flagging " + str(flagged_absolute(b, limit)) + " per round" ^0
"" ^0

if len(worst_n(a, quarter)) == quarter:
    "Policy A's queue size has not moved in " + str(rounds) + " rounds. It cannot move:" ^0
    "the rule names a share of the population, and the population is what the" ^0
    "reviewing changes." ^0
"" ^0

if flagged_absolute(b, limit) == 0:
    "Policy B's queue emptied, which is the observation that the work is done." ^0
    "It is also the observation that has to be re-picked when the system changes." ^0
"" ^0

# ---- what each policy can tell you about the world ----

"can the queue size answer 'is it getting better'" ^0
"  policy A : no  - " + str(quarter) + " every round, at every quality level" ^0
"  policy B : yes - " + str(flagged_absolute(start, limit)) + " at the start, " + str(flagged_absolute(b, limit)) + " now" ^0
"" ^0

# ---- and the trade the numbers make visible ----
#
# The relative rule is not simply worse. It kept finding work after the
# absolute one had stopped, and it ended with the better system. What it
# cannot do is say so.

"where each one ended" ^0
"  policy A total : " + str(total(a)) ^0
"  policy B total : " + str(total(b)) ^0
if total(a) < total(b):
    "  A ended with the better system and a number that never moved" ^0
    "  B ended with the worse system and a number that reported success" ^0
"" ^0

"Both policies improved the system, and by the same mechanism. One of them" ^0
"produces a number that changes when it works, and the other went further." ^0
"Neither the queue size nor the emptying is the quality; both are read as it." ^0
```

## Python (deterministic transpilation)

```python
start = [9, 8, 7, 6, 6, 5, 5, 4, 4, 3, 2, 1]
rounds = 4

def worst_n(items, n):
    picked = []
    rest = []
    for x in items:
        rest = rest + [x]
    for k in range(1, n+1):
        best = 0
        at = 0
        i = 0
        for x in rest:
            if x > best:
                best = x
                at = i
            i = i + 1
        picked = picked + [best]
        nr = []
        j = 0
        for x in rest:
            if not j == at:
                nr = nr + [x]
            j = j + 1
        rest = nr
    return picked

def repaired(x):
    return int(x / 2)

def run_relative(items, n):
    out = []
    flagged = worst_n(items, n)
    remaining = []
    for x in items:
        remaining = remaining + [x]
    for f in flagged:
        nr = []
        removed = 0
        for x in remaining:
            if x == f:
                if removed == 0:
                    removed = 1
                    nr = nr + [repaired(x)]
                else:
                    nr = nr + [x]
            else:
                nr = nr + [x]
        remaining = nr
    return remaining

def run_absolute(items, limit):
    out = []
    for x in items:
        if x > limit:
            out = out + [repaired(x)]
        else:
            out = out + [x]
    return out

def flagged_absolute(items, limit):
    c = 0
    for x in items:
        if x > limit:
            c = c + 1
    return c

def total(items):
    t = 0
    for x in items:
        t = t + x
    return t

def worst(items):
    w = 0
    for x in items:
        if x > w:
            w = x
    return w

quarter = 3
limit = 5
print("start : " + str(len(start)) + " items, total defects " + str(total(start)) + ", worst " + str(worst(start)))
print("")
print("policy A - flag the worst " + str(quarter) + " each round")
a = start
for r in range(1, rounds+1):
    flagged = len(worst_n(a, quarter))
    a = run_relative(a, quarter)
    print("  round " + str(r) + " : flagged " + str(flagged) + ", total now " + str(total(a)) + ", worst now " + str(worst(a)))
print("")
print("policy B - flag anything above " + str(limit))
b = start
for r in range(1, rounds+1):
    flagged = flagged_absolute(b, limit)
    b = run_absolute(b, limit)
    print("  round " + str(r) + " : flagged " + str(flagged) + ", total now " + str(total(b)) + ", worst now " + str(worst(b)))
print("")
print("after " + str(rounds) + " rounds")
print("  policy A : total " + str(total(a)) + ", worst " + str(worst(a)) + ", still flagging " + str(len(worst_n(a, quarter))) + " per round")
print("  policy B : total " + str(total(b)) + ", worst " + str(worst(b)) + ", still flagging " + str(flagged_absolute(b, limit)) + " per round")
print("")
if len(worst_n(a, quarter)) == quarter:
    print("Policy A's queue size has not moved in " + str(rounds) + " rounds. It cannot move:")
    print("the rule names a share of the population, and the population is what the")
    print("reviewing changes.")
print("")
if flagged_absolute(b, limit) == 0:
    print("Policy B's queue emptied, which is the observation that the work is done.")
    print("It is also the observation that has to be re-picked when the system changes.")
print("")
print("can the queue size answer 'is it getting better'")
print("  policy A : no  - " + str(quarter) + " every round, at every quality level")
print("  policy B : yes - " + str(flagged_absolute(start, limit)) + " at the start, " + str(flagged_absolute(b, limit)) + " now")
print("")
print("where each one ended")
print("  policy A total : " + str(total(a)))
print("  policy B total : " + str(total(b)))
if total(a) < total(b):
    print("  A ended with the better system and a number that never moved")
    print("  B ended with the worse system and a number that reported success")
print("")
print("Both policies improved the system, and by the same mechanism. One of them")
print("produces a number that changes when it works, and the other went further.")
print("Neither the queue size nor the emptying is the quality; both are read as it.")
```

## stdout (executed)

```text
start : 12 items, total defects 60, worst 9

policy A - flag the worst 3 each round
  round 1 : flagged 3, total now 47, worst now 6
  round 2 : flagged 3, total now 38, worst now 5
  round 3 : flagged 3, total now 31, worst now 4
  round 4 : flagged 3, total now 25, worst now 3

policy B - flag anything above 5
  round 1 : flagged 5, total now 41, worst now 5
  round 2 : flagged 0, total now 41, worst now 5
  round 3 : flagged 0, total now 41, worst now 5
  round 4 : flagged 0, total now 41, worst now 5

after 4 rounds
  policy A : total 25, worst 3, still flagging 3 per round
  policy B : total 41, worst 5, still flagging 0 per round

Policy A's queue size has not moved in 4 rounds. It cannot move:
the rule names a share of the population, and the population is what the
reviewing changes.

Policy B's queue emptied, which is the observation that the work is done.
It is also the observation that has to be re-picked when the system changes.

can the queue size answer 'is it getting better'
  policy A : no  - 3 every round, at every quality level
  policy B : yes - 5 at the start, 0 now

where each one ended
  policy A total : 25
  policy B total : 41
  A ended with the better system and a number that never moved
  B ended with the worse system and a number that reported success

Both policies improved the system, and by the same mechanism. One of them
produces a number that changes when it works, and the other went further.
Neither the queue size nor the emptying is the quality; both are read as it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
