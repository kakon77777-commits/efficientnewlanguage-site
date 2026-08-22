<!-- canonical: efficientnewlanguage.org/ai/examples/505-the-speedup-changed-a-race-that-had-always-won | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 505 — The speedup changed a race that had always won

`the_speedup_changed_a_race_that_had_always_won.eml` - Two writers have always raced and one has always won by a wide margin. What the margin was, and what a speedup on the other side does to it, are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two writers have
# always raced and one has always won by a wide margin. What the margin was, and
# what a speedup on the other side does to it, are computed below.
#
# The speedup is correct work. The slow path was profiled, the fix is sound, and
# nothing about it is careless. It also does not touch the ordering: neither
# writer takes a lock, because in the four years this has run the order has
# never once come out the other way.
#
# "Never once" is a measurement of the margin, not of the guarantee. A race with
# a 300 ms margin and a race with a 2 ms margin are the same race with the same
# absent lock, and only one of them has ever been observed to invert.
#
# The margin is computed at each version.

# [version, writer A finishes at ms, writer B finishes at ms, observed inversions in a year]
[["v1", 340, 40, 0], ["v2", 300, 40, 0], ["v3", 210, 40, 0], ["v4 after the speedup", 44, 40, 0]] => versions

len(versions) => n

"version                  A at   B at   margin   inversions seen" ^0
for v in versions:
    v[1] - v[2] => m
    "  " + v[0] + "   " + str(v[1]) + "ms   " + str(v[2]) + "ms   " + str(m) + "ms      " + str(v[3]) ^0
"" ^0

versions[0][1] - versions[0][2] => first_margin
versions[n - 1][1] - versions[n - 1][2] => last_margin
"the margin has gone from " + str(first_margin) + "ms to " + str(last_margin) + "ms" ^0
if first_margin > last_margin:
    "  a reduction of " + str(int((first_margin - last_margin) * 100 / first_margin)) + "%" ^0
"" ^0

0 => total_inv
for v in versions:
    total_inv + v[3] => total_inv
"inversions observed across every version : " + str(total_inv) ^0
if total_inv == 0:
    "  the evidence for the ordering is identical at every margin, because" ^0
    "  the evidence is an absence and an absence does not have a size" ^0
"" ^0

# ---- what the margin has to survive ----

# things that can delay writer A on any given run, in ms
[["a GC pause", 15], ["a slow disk flush", 30], ["a noisy neighbour", 25], ["a page fault storm", 60], ["a network retransmit", 200]] => jitters

"delays that can happen to A on any run" ^0
0 => survives_first
0 => survives_last
for j in jitters:
    "" => a
    if j[1] < first_margin:
        a + "no" => a
        survives_first + 1 => survives_first
    else:
        a + "YES" => a
    "" => b
    if j[1] < last_margin:
        b + "no" => b
        survives_last + 1 => survives_last
    else:
        b + "YES" => b
    "  " + j[0] + " : " + str(j[1]) + "ms, inverts at v1 " + a + ", inverts at v4 " + b ^0
"" ^0
"jitters the old margin absorbed : " + str(survives_first) + " of " + str(len(jitters)) ^0
"jitters the new margin absorbs  : " + str(survives_last) + " of " + str(len(jitters)) ^0
if survives_first > survives_last:
    "  the speedup moved " + str(survives_first - survives_last) + " of them from harmless to order-inverting" ^0
"" ^0

# ---- what the test suite says ----

"what a test run establishes" ^0
"  runs in CI per day : many" ^0
"  inversions seen    : " + str(total_inv) ^0
"  CI machines are quiet, so the jitters above are the ones CI does not have" ^0
"  the suite is measuring the margin under the conditions least likely to" ^0
"  close it" ^0
"" ^0

# ---- what the fix would be ----

"ordering the two writers explicitly" ^0
"  cost : one lock, held across two writes" ^0
"  what it removes : the dependence on the margin entirely" ^0
"  when it was cheapest to add : v1, when the margin was " + str(first_margin) + "ms and" ^0
"  the change would have been invisible in every measurement" ^0
"  when it becomes visible : now, when it is a regression against v4" ^0
"" ^0

# ---- the control: an order that is actually guaranteed ----
#
# Where the two writes go through one queue, the order is a property of the
# structure and the margin is not part of the argument.

"control - the same two writes through a single ordered queue" ^0
"  margin that the order depends on : none" ^0
"  effect of any speedup on the ordering : none" ^0
"  the difference is not how careful anyone was; it is whether the ordering" ^0
"  is a consequence of timing or of structure" ^0
"" ^0

"The speedup is correct and the order has never inverted in four years. The" ^0
"absence of an inversion is the same observation at every margin, and the" ^0
"margin is what the speedup changed." ^0
```

## Python (deterministic transpilation)

```python
versions = [["v1", 340, 40, 0], ["v2", 300, 40, 0], ["v3", 210, 40, 0], ["v4 after the speedup", 44, 40, 0]]
n = len(versions)
print("version                  A at   B at   margin   inversions seen")
for v in versions:
    m = v[1] - v[2]
    print("  " + v[0] + "   " + str(v[1]) + "ms   " + str(v[2]) + "ms   " + str(m) + "ms      " + str(v[3]))
print("")
first_margin = versions[0][1] - versions[0][2]
last_margin = versions[n - 1][1] - versions[n - 1][2]
print("the margin has gone from " + str(first_margin) + "ms to " + str(last_margin) + "ms")
if first_margin > last_margin:
    print("  a reduction of " + str(int((first_margin - last_margin) * 100 / first_margin)) + "%")
print("")
total_inv = 0
for v in versions:
    total_inv = total_inv + v[3]
print("inversions observed across every version : " + str(total_inv))
if total_inv == 0:
    print("  the evidence for the ordering is identical at every margin, because")
    print("  the evidence is an absence and an absence does not have a size")
print("")
jitters = [["a GC pause", 15], ["a slow disk flush", 30], ["a noisy neighbour", 25], ["a page fault storm", 60], ["a network retransmit", 200]]
print("delays that can happen to A on any run")
survives_first = 0
survives_last = 0
for j in jitters:
    a = ""
    if j[1] < first_margin:
        a = a + "no"
        survives_first = survives_first + 1
    else:
        a = a + "YES"
    b = ""
    if j[1] < last_margin:
        b = b + "no"
        survives_last = survives_last + 1
    else:
        b = b + "YES"
    print("  " + j[0] + " : " + str(j[1]) + "ms, inverts at v1 " + a + ", inverts at v4 " + b)
print("")
print("jitters the old margin absorbed : " + str(survives_first) + " of " + str(len(jitters)))
print("jitters the new margin absorbs  : " + str(survives_last) + " of " + str(len(jitters)))
if survives_first > survives_last:
    print("  the speedup moved " + str(survives_first - survives_last) + " of them from harmless to order-inverting")
print("")
print("what a test run establishes")
print("  runs in CI per day : many")
print("  inversions seen    : " + str(total_inv))
print("  CI machines are quiet, so the jitters above are the ones CI does not have")
print("  the suite is measuring the margin under the conditions least likely to")
print("  close it")
print("")
print("ordering the two writers explicitly")
print("  cost : one lock, held across two writes")
print("  what it removes : the dependence on the margin entirely")
print("  when it was cheapest to add : v1, when the margin was " + str(first_margin) + "ms and")
print("  the change would have been invisible in every measurement")
print("  when it becomes visible : now, when it is a regression against v4")
print("")
print("control - the same two writes through a single ordered queue")
print("  margin that the order depends on : none")
print("  effect of any speedup on the ordering : none")
print("  the difference is not how careful anyone was; it is whether the ordering")
print("  is a consequence of timing or of structure")
print("")
print("The speedup is correct and the order has never inverted in four years. The")
print("absence of an inversion is the same observation at every margin, and the")
print("margin is what the speedup changed.")
```

## stdout (executed)

```text
version                  A at   B at   margin   inversions seen
  v1   340ms   40ms   300ms      0
  v2   300ms   40ms   260ms      0
  v3   210ms   40ms   170ms      0
  v4 after the speedup   44ms   40ms   4ms      0

the margin has gone from 300ms to 4ms
  a reduction of 98%

inversions observed across every version : 0
  the evidence for the ordering is identical at every margin, because
  the evidence is an absence and an absence does not have a size

delays that can happen to A on any run
  a GC pause : 15ms, inverts at v1 no, inverts at v4 YES
  a slow disk flush : 30ms, inverts at v1 no, inverts at v4 YES
  a noisy neighbour : 25ms, inverts at v1 no, inverts at v4 YES
  a page fault storm : 60ms, inverts at v1 no, inverts at v4 YES
  a network retransmit : 200ms, inverts at v1 no, inverts at v4 YES

jitters the old margin absorbed : 5 of 5
jitters the new margin absorbs  : 0 of 5
  the speedup moved 5 of them from harmless to order-inverting

what a test run establishes
  runs in CI per day : many
  inversions seen    : 0
  CI machines are quiet, so the jitters above are the ones CI does not have
  the suite is measuring the margin under the conditions least likely to
  close it

ordering the two writers explicitly
  cost : one lock, held across two writes
  what it removes : the dependence on the margin entirely
  when it was cheapest to add : v1, when the margin was 300ms and
  the change would have been invisible in every measurement
  when it becomes visible : now, when it is a regression against v4

control - the same two writes through a single ordered queue
  margin that the order depends on : none
  effect of any speedup on the ordering : none
  the difference is not how careful anyone was; it is whether the ordering
  is a consequence of timing or of structure

The speedup is correct and the order has never inverted in four years. The
absence of an inversion is the same observation at every margin, and the
margin is what the speedup changed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
