<!-- canonical: efficientnewlanguage.org/ai/examples/237-event-order-without-clock | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 237 — Most pairs right, and the ones that matter inverted

`event_order_without_clock.eml` reconstructs an event order from timestamps written by two clocks that disagree, and checks it against causality.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Putting events
# back in order using the timestamps you wrote down.
#
# Two services log to the same store. To reconstruct what happened you sort by
# timestamp, and the sort is correct only if the timestamps are:
#
#     from one clock          they are not - each service stamps its own
#     finer than the events   they are not - two events share a millisecond
#     monotonic               they are not - clocks are corrected backwards
#
# Every one of those failures produces a plausible ordering. There is no error
# to catch: the sort completes, the log reads as a story, and the story is
# wrong in a way that only shows up when someone asks "how did the response
# arrive before the request?"
#
# Four orderings are compared against the ground truth - which exists here
# because the events are GENERATED with a known order and the timestamps are
# derived from it, not the other way round:
#
#     by timestamp          ties broken arbitrarily by the sort's stability
#     by (timestamp, node)  deterministic, still wrong across clock skew
#     by Lamport counter    causality preserved, wall-clock order lost
#     by (counter, node)    a total order that respects causality
#
# The measurement is how many ADJACENT PAIRS each ordering gets right, plus a
# stricter question that only matters here: how many causally dependent pairs
# it inverts. Getting 90% of pairs right while inverting a cause and its
# effect is worse than it sounds.

# Each event: [true_order, node, wall_clock, lamport, causes]
# `causes` is the true_order of the event that had to happen first (-1 if none).
# Node B's clock runs 5 ms behind A's, which is the skew.
[
    [0, "A", 100, 1, 0 - 1],
    [1, "B", 96, 2, 0],
    [2, "A", 102, 3, 1],
    [3, "B", 98, 4, 2],
    [4, "A", 102, 5, 3],
    [5, "B", 100, 6, 4],
    [6, "A", 105, 7, 5],
    [7, "B", 101, 8, 6]
] => events

def render(order):
    "" => s
    for e in order:
        if len(s) > 0:
            s + " " => s
        s + e[1] + str(e[0]) => s
    return s

def sort_by(rows, keyfn):
    [] => out
    for r in rows:
        out + [r] => out
    1 => i
    while i < len(out):
        out[i] => cur
        i - 1 => j
        while j >= 0 and keyfn(out[j]) > keyfn(cur):
            out[j] => out[j + 1]
            j - 1 => j
        cur => out[j + 1]
        i + 1 => i
    return out

def key_wall(e):
    return e[2]

def key_wall_node(e):
    # A composite key as a single comparable number: wall * 10 plus a node
    # rank. Building it arithmetically rather than as a tuple keeps the
    # comparison total without needing tuple ordering.
    0 => rank
    if e[1] == "B":
        1 => rank
    return e[2] * 10 + rank

def key_lamport(e):
    return e[3]

def key_lamport_node(e):
    0 => rank
    if e[1] == "B":
        1 => rank
    return e[3] * 10 + rank

def position_of(order, true_order):
    for i in [0:len(order) - 1]:
        if order[i][0] == true_order:
            return i
    return 0 - 1

def adjacent_correct(order):
    # How many adjacent pairs are in the true relative order.
    0 => ok
    for i in [1:len(order) - 1]:
        if order[i - 1][0] < order[i][0]:
            ok + 1 => ok
    return ok

def causal_violations(order):
    # A cause must appear before its effect. This is the question the wall
    # clock cannot answer.
    0 => bad
    for e in order:
        if e[4] >= 0:
            if position_of(order, e[4]) > position_of(order, e[0]):
                bad + 1 => bad
    return bad


sort_by(events, key_wall) => o_wall
sort_by(events, key_wall_node) => o_wall_node
sort_by(events, key_lamport) => o_lamport
sort_by(events, key_lamport_node) => o_lamport_node

"true order:        " + render(events)^0
""^0
"ordering           result                          adjacent  causal violations"^0
for pair in [["by wall clock", o_wall], ["by (wall, node)", o_wall_node], ["by lamport", o_lamport], ["by (lamport, node)", o_lamport_node]]:
    ("%-18s %-31s %-9s %d" % (pair[0], render(pair[1]), str(adjacent_correct(pair[1])) + "/" + str(len(events) - 1), causal_violations(pair[1])))^0

# ------------------------------------------------------- where the skew bites
""^0
"The pair that reads backwards:"^0
for e in events:
    if e[4] >= 0:
        events[e[4]] => cause
        if cause[2] > e[2]:
            ("  " + cause[1] + str(cause[0]) + " (t=" + str(cause[2]) + ") caused " + e[1] + str(e[0]) + " (t=" + str(e[2]) + ") - the effect is stamped EARLIER")^0

# -------------------------------------------------------------- ties
{} => stamps
0 => tied
for e in events:
    if e[2] in stamps:
        tied + 1 => tied
    else:
        1 => stamps[e[2]]

""^0
("events sharing a wall-clock value: " + str(tied))^0
("distinct wall-clock values:        " + str(len(stamps)) + " for " + str(len(events)) + " events")^0
("distinct lamport values:           " + str(len(events)))^0

# ------------------------------------------ what each ordering can be used for
""^0
"what survives:"^0
("  wall clock recovers real elapsed time:  True")^0
("  wall clock recovers causality:          " + str(causal_violations(o_wall) == 0))^0
("  lamport recovers causality:             " + str(causal_violations(o_lamport_node) == 0))^0
("  lamport recovers elapsed time:          False")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The Lamport ordering must be causally perfect. That is what it is for.
checked + 1 => checked
if causal_violations(o_lamport_node) == 0 and adjacent_correct(o_lamport_node) == len(events) - 1:
    passed + 1 => passed

# The wall-clock ordering must violate causality, or the skew is not doing
# anything and the case is vacuous.
checked + 1 => checked
if causal_violations(o_wall) > 0:
    passed + 1 => passed

# Adding the node as a tiebreak must NOT fix causality - it makes the order
# deterministic, which is a different property and the one people mistake it
# for.
checked + 1 => checked
if causal_violations(o_wall_node) > 0:
    passed + 1 => passed

# There must be real ties in the wall clock, since that is the second, quieter
# failure - two events in one millisecond.
checked + 1 => checked
if tied > 0 and len(stamps) < len(events):
    passed + 1 => passed

# And the wall-clock ordering must still get MOST adjacent pairs right. A
# reconstruction that were obviously scrambled would be caught by eye.
checked + 1 => checked
if adjacent_correct(o_wall) >= (len(events) - 1) / 2:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "A skewed clock orders most pairs correctly and inverts the ones that matter." => verdict
else:
    "FAILED - an ordering did not behave as the checks describe." => verdict
verdict^0

""^0
"Adding the node id as a tiebreak makes the ordering DETERMINISTIC, which" => n1
n1^0
"feels like progress and fixes nothing: the same wrong answer every time is" => n2
n2^0
"still the wrong answer. The two properties get conflated because both are" => n3
n3^0
"described as 'a stable ordering', and only one of them is about causality." => n4
n4^0
```

## Python (deterministic transpilation)

```python
events = [[0, "A", 100, 1, 0 - 1], [1, "B", 96, 2, 0], [2, "A", 102, 3, 1], [3, "B", 98, 4, 2], [4, "A", 102, 5, 3], [5, "B", 100, 6, 4], [6, "A", 105, 7, 5], [7, "B", 101, 8, 6]]

def render(order):
    s = ""
    for e in order:
        if len(s) > 0:
            s = s + " "
        s = s + e[1] + str(e[0])
    return s

def sort_by(rows, keyfn):
    out = []
    for r in rows:
        out = out + [r]
    i = 1
    while i < len(out):
        cur = out[i]
        j = i - 1
        while j >= 0 and keyfn(out[j]) > keyfn(cur):
            out[j + 1] = out[j]
            j = j - 1
        out[j + 1] = cur
        i = i + 1
    return out

def key_wall(e):
    return e[2]

def key_wall_node(e):
    rank = 0
    if e[1] == "B":
        rank = 1
    return e[2] * 10 + rank

def key_lamport(e):
    return e[3]

def key_lamport_node(e):
    rank = 0
    if e[1] == "B":
        rank = 1
    return e[3] * 10 + rank

def position_of(order, true_order):
    for i in range(0, len(order)):
        if order[i][0] == true_order:
            return i
    return 0 - 1

def adjacent_correct(order):
    ok = 0
    for i in range(1, len(order)):
        if order[i - 1][0] < order[i][0]:
            ok = ok + 1
    return ok

def causal_violations(order):
    bad = 0
    for e in order:
        if e[4] >= 0:
            if position_of(order, e[4]) > position_of(order, e[0]):
                bad = bad + 1
    return bad

o_wall = sort_by(events, key_wall)
o_wall_node = sort_by(events, key_wall_node)
o_lamport = sort_by(events, key_lamport)
o_lamport_node = sort_by(events, key_lamport_node)
print("true order:        " + render(events))
print("")
print("ordering           result                          adjacent  causal violations")
for pair in [["by wall clock", o_wall], ["by (wall, node)", o_wall_node], ["by lamport", o_lamport], ["by (lamport, node)", o_lamport_node]]:
    print("%-18s %-31s %-9s %d" % (pair[0], render(pair[1]), str(adjacent_correct(pair[1])) + "/" + str(len(events) - 1), causal_violations(pair[1])))
print("")
print("The pair that reads backwards:")
for e in events:
    if e[4] >= 0:
        cause = events[e[4]]
        if cause[2] > e[2]:
            print("  " + cause[1] + str(cause[0]) + " (t=" + str(cause[2]) + ") caused " + e[1] + str(e[0]) + " (t=" + str(e[2]) + ") - the effect is stamped EARLIER")
stamps = {}
tied = 0
for e in events:
    if e[2] in stamps:
        tied = tied + 1
    else:
        stamps[e[2]] = 1
print("")
print("events sharing a wall-clock value: " + str(tied))
print("distinct wall-clock values:        " + str(len(stamps)) + " for " + str(len(events)) + " events")
print("distinct lamport values:           " + str(len(events)))
print("")
print("what survives:")
print("  wall clock recovers real elapsed time:  True")
print("  wall clock recovers causality:          " + str(causal_violations(o_wall) == 0))
print("  lamport recovers causality:             " + str(causal_violations(o_lamport_node) == 0))
print("  lamport recovers elapsed time:          False")
passed = 0
checked = 0
checked = checked + 1
if causal_violations(o_lamport_node) == 0 and adjacent_correct(o_lamport_node) == len(events) - 1:
    passed = passed + 1
checked = checked + 1
if causal_violations(o_wall) > 0:
    passed = passed + 1
checked = checked + 1
if causal_violations(o_wall_node) > 0:
    passed = passed + 1
checked = checked + 1
if tied > 0 and len(stamps) < len(events):
    passed = passed + 1
checked = checked + 1
if adjacent_correct(o_wall) >= (len(events) - 1) / 2:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "A skewed clock orders most pairs correctly and inverts the ones that matter."
else:
    verdict = "FAILED - an ordering did not behave as the checks describe."
print(verdict)
print("")
n1 = "Adding the node id as a tiebreak makes the ordering DETERMINISTIC, which"
print(n1)
n2 = "feels like progress and fixes nothing: the same wrong answer every time is"
print(n2)
n3 = "still the wrong answer. The two properties get conflated because both are"
print(n3)
n4 = "described as 'a stable ordering', and only one of them is about causality."
print(n4)
```

## stdout (executed)

```text
true order:        A0 B1 A2 B3 A4 B5 A6 B7

ordering           result                          adjacent  causal violations
by wall clock      B1 B3 A0 B5 B7 A2 A4 A6         5/7       4
by (wall, node)    B1 B3 A0 B5 B7 A2 A4 A6         5/7       4
by lamport         A0 B1 A2 B3 A4 B5 A6 B7         7/7       0
by (lamport, node) A0 B1 A2 B3 A4 B5 A6 B7         7/7       0

The pair that reads backwards:
  A0 (t=100) caused B1 (t=96) - the effect is stamped EARLIER
  A2 (t=102) caused B3 (t=98) - the effect is stamped EARLIER
  A4 (t=102) caused B5 (t=100) - the effect is stamped EARLIER
  A6 (t=105) caused B7 (t=101) - the effect is stamped EARLIER

events sharing a wall-clock value: 2
distinct wall-clock values:        6 for 8 events
distinct lamport values:           8

what survives:
  wall clock recovers real elapsed time:  True
  wall clock recovers causality:          False
  lamport recovers causality:             True
  lamport recovers elapsed time:          False

checks passed: 5/5
A skewed clock orders most pairs correctly and inverts the ones that matter.

Adding the node id as a tiebreak makes the ordering DETERMINISTIC, which
feels like progress and fixes nothing: the same wrong answer every time is
still the wrong answer. The two properties get conflated because both are
described as 'a stable ordering', and only one of them is about causality.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
