<!-- canonical: efficientnewlanguage.org/ai/examples/256-partitioned-queue-ordering | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 256 — Partitioned queue ordering — the order you routed on, and no other

`partitioned_queue_ordering.eml` routes a stream of related events through 1 to 6 partitions and counts two different kinds of ordering violation: within a partition key, and across keys.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Splitting a
# queue into partitions, and the ordering you keep.
#
# One consumer processes messages in the order they were produced. Two
# consumers process them faster and in no particular order. The standard
# repair is partitioning: route by key, so all messages for a key land on the
# same consumer and are ordered relative to each other.
#
# That works, and the guarantee it delivers is narrower than "ordered":
#
#     global order      lost, and it was lost the moment there were two
#     per-key order     preserved, which is usually what the domain needs
#     cross-key order   NOT preserved, and this is the one people assume
#
# Cross-key order is the trap. "Create account, then create the order that
# references it" are two different keys, so partitioning says nothing about
# their relative order and a consumer can see the order before the account.
#
# The measurement replays a produced sequence through 1, 2 and 4 partitions
# and counts inversions of each kind. The consumers are round-robin over
# their own partitions rather than interleaved arbitrarily, which is what a
# real consumer group does; the point is not that a specific schedule is bad,
# it is which invariants survive ANY schedule.

def partition_of(key, n):
    # A deterministic hash of a short key: sum of character positions.
    "abcdefghijklmnopqrstuvwxyz" => alpha
    0 => h
    for ch in key:
        for i in [0:25]:
            if alpha[i] == ch:
                h * 31 + i + 1 => h
    return h % n

# [seq, key]. Produced in this order.
[
    [1, "acct"], [2, "order"], [3, "acct"], [4, "ship"],
    [5, "order"], [6, "acct"], [7, "ship"], [8, "order"],
    [9, "acct"], [10, "ship"], [11, "order"], [12, "acct"]
] => produced

def consume(n):
    # Route to partitions, then drain the partitions round-robin. The
    # resulting list is a plausible delivery order for n consumers.
    [] => parts
    for p in [0:n - 1]:
        parts + [[]] => parts
    for m in produced:
        partition_of(m[1], n) => p
        parts[p] + [m] => parts[p]
    [] => out
    0 => idx
    1 => more
    while more == 1:
        0 => more
        for p in [0:n - 1]:
            if idx < len(parts[p]):
                out + [parts[p][idx]] => out
                1 => more
        idx + 1 => idx
    return out

def global_inversions(order):
    0 => bad
    for i in [0:len(order) - 1]:
        for j in [0:len(order) - 1]:
            if i < j and order[i][0] > order[j][0]:
                bad + 1 => bad
    return bad

def perkey_inversions(order):
    0 => bad
    for i in [0:len(order) - 1]:
        for j in [0:len(order) - 1]:
            if i < j and order[i][1] == order[j][1] and order[i][0] > order[j][0]:
                bad + 1 => bad
    return bad

def crosskey_inversions(order):
    0 => bad
    for i in [0:len(order) - 1]:
        for j in [0:len(order) - 1]:
            if i < j and not (order[i][1] == order[j][1]) and order[i][0] > order[j][0]:
                bad + 1 => bad
    return bad

def render(order):
    "" => s
    for m in order:
        if len(s) > 0:
            s + " " => s
        s + str(m[0]) => s
    return s


"partitions  delivery order                      global inv  per-key inv  cross-key inv"^0
{} => res
for n in [1, 2, 4]:
    consume(n) => o
    [global_inversions(o), perkey_inversions(o), crosskey_inversions(o)] => res[n]
    ("%-11d %-35s %-11d %-12d %d" % (n, render(o), res[n][0], res[n][1], res[n][2]))^0

""^0
("messages: " + str(len(produced)))^0
("distinct keys: 3")^0

# ------------------------------------------ what partitioning actually keeps
""^0
"with 4 partitions:"^0
("  per-key order preserved:   " + str(res[4][1] == 0))^0
("  global order preserved:    " + str(res[4][0] == 0))^0
("  cross-key order preserved: " + str(res[4][2] == 0))^0

# --------------------------------------- the cross-key pair that reorders
""^0
"a pair delivered out of production order, across keys:"^0
consume(4) => o4
0 => shown
for i in [0:len(o4) - 1]:
    for j in [0:len(o4) - 1]:
        if i < j and shown == 0:
            if not (o4[i][1] == o4[j][1]) and o4[i][0] > o4[j][0]:
                1 => shown
                ("  " + o4[j][1] + " #" + str(o4[j][0]) + " was produced before " + o4[i][1] + " #" + str(o4[i][0]) + ", delivered after")^0

# ------------------------------------ adding partitions never breaks per-key
# The guarantee that survives is exactly the one the routing enforces, and it
# survives at every partition count - which is what makes it a guarantee
# rather than a coincidence of this schedule.
0 => perkey_ok
0 => counts
for n in [1, 2, 3, 4, 5, 6]:
    counts + 1 => counts
    consume(n) => o
    if perkey_inversions(o) == 0:
        perkey_ok + 1 => perkey_ok
    if len(o) < len(produced):
        perkey_ok - 100 => perkey_ok

""^0
("partition counts tried: " + str(counts))^0
("  per-key order held:   " + str(perkey_ok) + "/" + str(counts))^0

# --------------------------------------- one partition is the only total order
""^0
consume(1) => o1
("with a single partition: global inversions " + str(global_inversions(o1)) + ", and no parallelism at all")^0
"...the ordering everyone wants and the throughput nobody accepts."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Every partition count must deliver every message exactly once.
checked + 1 => checked
0 => complete
for n in [1, 2, 3, 4, 5, 6]:
    consume(n) => o
    {} => seen
    for m in o:
        1 => seen[m[0]]
    if len(o) == len(produced) and len(seen) == len(produced):
        complete + 1 => complete
if complete == 6:
    passed + 1 => passed

# Per-key order must hold at every partition count. This is the guarantee.
checked + 1 => checked
if perkey_ok == counts:
    passed + 1 => passed

# A single partition must be totally ordered, and more than one must not be.
checked + 1 => checked
if res[1][0] == 0 and res[4][0] > 0:
    passed + 1 => passed

# Cross-key order must break - it is the assumption that costs money.
checked + 1 => checked
if res[4][2] > 0:
    passed + 1 => passed

# And every global inversion must be a cross-key one, since per-key order
# holds. That decomposition is what makes the guarantee precise.
checked + 1 => checked
if res[4][0] == res[4][2] and res[4][1] == 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Partitioning keeps exactly the order it routes on, and no other." => verdict
else:
    "FAILED - a partitioning did not behave as the checks describe." => verdict
verdict^0

""^0
"Every global inversion here is a cross-key one, which is the precise" => n1
n1^0
"statement of what partitioning bought: order within a key, nothing between" => n2
n2^0
"keys. The assumption that breaks is never written down, because it is not a" => n3
n3^0
"belief about the queue - it is a belief about two events that happen to be" => n4
n4^0
"related in the domain and unrelated to the router." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def partition_of(key, n):
    alpha = "abcdefghijklmnopqrstuvwxyz"
    h = 0
    for ch in key:
        for i in range(0, 26):
            if alpha[i] == ch:
                h = h * 31 + i + 1
    return h % n

produced = [[1, "acct"], [2, "order"], [3, "acct"], [4, "ship"], [5, "order"], [6, "acct"], [7, "ship"], [8, "order"], [9, "acct"], [10, "ship"], [11, "order"], [12, "acct"]]

def consume(n):
    parts = []
    for p in range(0, n):
        parts = parts + [[]]
    for m in produced:
        p = partition_of(m[1], n)
        parts[p] = parts[p] + [m]
    out = []
    idx = 0
    more = 1
    while more == 1:
        more = 0
        for p in range(0, n):
            if idx < len(parts[p]):
                out = out + [parts[p][idx]]
                more = 1
        idx = idx + 1
    return out

def global_inversions(order):
    bad = 0
    for i in range(0, len(order)):
        for j in range(0, len(order)):
            if i < j and order[i][0] > order[j][0]:
                bad = bad + 1
    return bad

def perkey_inversions(order):
    bad = 0
    for i in range(0, len(order)):
        for j in range(0, len(order)):
            if i < j and order[i][1] == order[j][1] and order[i][0] > order[j][0]:
                bad = bad + 1
    return bad

def crosskey_inversions(order):
    bad = 0
    for i in range(0, len(order)):
        for j in range(0, len(order)):
            if i < j and not order[i][1] == order[j][1] and order[i][0] > order[j][0]:
                bad = bad + 1
    return bad

def render(order):
    s = ""
    for m in order:
        if len(s) > 0:
            s = s + " "
        s = s + str(m[0])
    return s

print("partitions  delivery order                      global inv  per-key inv  cross-key inv")
res = {}
for n in [1, 2, 4]:
    o = consume(n)
    res[n] = [global_inversions(o), perkey_inversions(o), crosskey_inversions(o)]
    print("%-11d %-35s %-11d %-12d %d" % (n, render(o), res[n][0], res[n][1], res[n][2]))
print("")
print("messages: " + str(len(produced)))
print("distinct keys: 3")
print("")
print("with 4 partitions:")
print("  per-key order preserved:   " + str(res[4][1] == 0))
print("  global order preserved:    " + str(res[4][0] == 0))
print("  cross-key order preserved: " + str(res[4][2] == 0))
print("")
print("a pair delivered out of production order, across keys:")
o4 = consume(4)
shown = 0
for i in range(0, len(o4)):
    for j in range(0, len(o4)):
        if i < j and shown == 0:
            if not o4[i][1] == o4[j][1] and o4[i][0] > o4[j][0]:
                shown = 1
                print("  " + o4[j][1] + " #" + str(o4[j][0]) + " was produced before " + o4[i][1] + " #" + str(o4[i][0]) + ", delivered after")
perkey_ok = 0
counts = 0
for n in [1, 2, 3, 4, 5, 6]:
    counts = counts + 1
    o = consume(n)
    if perkey_inversions(o) == 0:
        perkey_ok = perkey_ok + 1
    if len(o) < len(produced):
        perkey_ok = perkey_ok - 100
print("")
print("partition counts tried: " + str(counts))
print("  per-key order held:   " + str(perkey_ok) + "/" + str(counts))
print("")
o1 = consume(1)
print("with a single partition: global inversions " + str(global_inversions(o1)) + ", and no parallelism at all")
print("...the ordering everyone wants and the throughput nobody accepts.")
passed = 0
checked = 0
checked = checked + 1
complete = 0
for n in [1, 2, 3, 4, 5, 6]:
    o = consume(n)
    seen = {}
    for m in o:
        seen[m[0]] = 1
    if len(o) == len(produced) and len(seen) == len(produced):
        complete = complete + 1
if complete == 6:
    passed = passed + 1
checked = checked + 1
if perkey_ok == counts:
    passed = passed + 1
checked = checked + 1
if res[1][0] == 0 and res[4][0] > 0:
    passed = passed + 1
checked = checked + 1
if res[4][2] > 0:
    passed = passed + 1
checked = checked + 1
if res[4][0] == res[4][2] and res[4][1] == 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Partitioning keeps exactly the order it routes on, and no other."
else:
    verdict = "FAILED - a partitioning did not behave as the checks describe."
print(verdict)
print("")
n1 = "Every global inversion here is a cross-key one, which is the precise"
print(n1)
n2 = "statement of what partitioning bought: order within a key, nothing between"
print(n2)
n3 = "keys. The assumption that breaks is never written down, because it is not a"
print(n3)
n4 = "belief about the queue - it is a belief about two events that happen to be"
print(n4)
n5 = "related in the domain and unrelated to the router."
print(n5)
```

## stdout (executed)

```text
partitions  delivery order                      global inv  per-key inv  cross-key inv
1           1 2 3 4 5 6 7 8 9 10 11 12          0           0            0
2           2 1 4 3 5 6 7 9 8 12 10 11          5           0            5
4           4 2 1 7 5 3 10 8 6 11 9 12          13          0            13

messages: 12
distinct keys: 3

with 4 partitions:
  per-key order preserved:   True
  global order preserved:    False
  cross-key order preserved: False

a pair delivered out of production order, across keys:
  order #2 was produced before ship #4, delivered after

partition counts tried: 6
  per-key order held:   6/6

with a single partition: global inversions 0, and no parallelism at all
...the ordering everyone wants and the throughput nobody accepts.

checks passed: 5/5
Partitioning keeps exactly the order it routes on, and no other.

Every global inversion here is a cross-key one, which is the precise
statement of what partitioning bought: order within a key, nothing between
keys. The assumption that breaks is never written down, because it is not a
belief about the queue - it is a belief about two events that happen to be
related in the domain and unrelated to the router.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
