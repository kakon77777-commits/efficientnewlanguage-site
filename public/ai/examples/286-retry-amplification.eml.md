<!-- canonical: efficientnewlanguage.org/ai/examples/286-retry-amplification | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 286 — Retry amplification — three retries at three layers is twenty-seven

`retry_amplification.eml` computes the bottom-layer request count for every combination of depth and per-layer attempts, and compares retrying at every layer against retrying at the edge only.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three retries at
# three layers is twenty-seven, and it arrives during the outage.
#
# Every layer of a call chain adds its own retry policy, and each one was
# reviewed on its own and looked reasonable. They do not add. A retry at the
# edge re-runs everything below it, including that layer's retries, so the load
# multiplier is the PRODUCT of the per-layer attempt counts:
#
#     3 layers x 3 attempts = 27 requests at the bottom for one at the top
#
# Which would be tolerable if it happened at random times. It does not: retries
# fire when something is failing, so the multiplier applies exactly when the
# system has the least capacity. A backend at 90% utilisation that starts
# failing receives 27x its normal load a second later.
#
# The measurement computes the bottom-layer request count for every combination
# of depth and per-layer attempts, and compares two policies: retry at every
# layer, and retry at the edge only. It also reports the depth at which a
# modest per-layer policy exceeds any plausible headroom, which is the number
# worth knowing.

def amplification(depth, attempts):
    1 => total
    for d in [1:depth]:
        total * attempts => total
    return total

def edge_only(depth, attempts):
    # Only the outermost layer retries; the rest pass failures through.
    return attempts


"depth   attempts   retry every layer   retry at the edge only"^0
{} => res
for depth in [1, 2, 3, 4, 5]:
    3 => a
    amplification(depth, a) => every
    edge_only(depth, a) => edge
    [every, edge] => res[str(depth)]
    ("%-7d %-10d %-19d %d" % (depth, a, every, edge))^0

""^0
"per-layer attempts held at 3."^0

# ------------------------------- where it exceeds ordinary headroom
""^0
# A backend running at 25% utilisation has 4x headroom. That is deliberately
# generous: at 2x headroom even a SINGLE retrying layer breaches it, so the
# comparison would say nothing about composition, which is the subject. The
# first version used 2x and reported a breach at depth 1 - a true number
# answering a different question.
4 => HEADROOM
("a backend at 25% utilisation has " + str(HEADROOM) + "x headroom.")^0
0 => breach_depth
0 => edge_breach
for depth in [1, 2, 3, 4, 5]:
    if breach_depth == 0 and res[str(depth)][0] > HEADROOM:
        depth => breach_depth
    if res[str(depth)][1] > HEADROOM:
        edge_breach + 1 => edge_breach
("depth at which retrying every layer exceeds it: " + str(breach_depth))^0
("  multiplier there: " + str(res[str(breach_depth)][0]) + "x")^0
("  edge-only multiplier at the same depth: " + str(res[str(breach_depth)][1]) + "x")^0
("depths at which edge-only exceeds it: " + str(edge_breach) + "/5")^0

# ---------------------------------- the multiplier by per-layer attempts
""^0
"at depth 3, by per-layer attempt count:"^0
0 => rising
0 => steps
[1, 2, 3, 4] => ATTEMPTS
for i in [0:len(ATTEMPTS) - 1]:
    ATTEMPTS[i] => a
    amplification(3, a) => m
    ("  %d attempts per layer -> %dx at the bottom" % (a, m))^0
    if i > 0:
        steps + 1 => steps
        if m > amplification(3, ATTEMPTS[i - 1]):
            rising + 1 => rising
("strictly rising: " + str(rising) + "/" + str(steps))^0
"...and 1 attempt per layer means no retries anywhere, which is why the"^0
"multiplier is 1 and not 0."^0

# --------------------------- what each layer's own review would conclude
""^0
"reviewed one layer at a time, at depth 3 with 3 attempts:"^0
("  this layer sends at most 3 requests for each one it receives.")^0
("  worst case load increase from THIS change: 3x")^0
("  actual load at the bottom: " + str(amplification(3, 3)) + "x")^0
"...every reviewer saw a true statement about their own layer."^0

# ---------------------------- a budget makes the product a sum
""^0
"with a shared retry BUDGET of 3 total attempts for the whole request:"^0
3 => budget
0 => budget_ok
for depth in [1, 2, 3, 4, 5]:
    if budget <= res[str(depth)][0]:
        budget_ok + 1 => budget_ok
("  depths where the budget is at or below the every-layer multiplier: " + str(budget_ok) + "/5")^0
("  the budget's multiplier is " + str(budget) + "x at every depth, because it is carried")^0
("  down the call rather than re-decided at each hop.")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# At depth 1 the two policies must be identical - a single layer cannot
# amplify, so the difference is entirely about composition.
checked + 1 => checked
if res["1"][0] == res["1"][1]:
    passed + 1 => passed

# The every-layer multiplier must be the product: 27 at depth 3.
checked + 1 => checked
if res["3"][0] == 27:
    passed + 1 => passed

# Edge-only must stay flat at the per-layer attempt count regardless of depth.
checked + 1 => checked
0 => flat
for depth in [1, 2, 3, 4, 5]:
    if res[str(depth)][1] == 3:
        flat + 1 => flat
if flat == 5:
    passed + 1 => passed

# Retrying at every layer must exceed the headroom at a depth of 2 - shallower
# than any real service - while edge-only never does at any depth. That
# contrast is the finding; a headroom small enough for one layer to breach
# would have hidden it.
checked + 1 => checked
if breach_depth == 2 and edge_breach == 0:
    passed + 1 => passed

# And the multiplier must rise strictly with per-layer attempts, so tuning the
# per-layer number down is a real lever and not a rounding change.
checked + 1 => checked
if rising == steps and steps > 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Every layer's retry policy was reasonable and the product is not." => verdict
else:
    "FAILED - the amplification did not behave as the checks describe." => verdict
verdict^0

""^0
"Retry policies compose by multiplication and are reviewed by addition." => n1
n1^0
"Each layer's author sees a true statement - at most three requests for" => n2
n2^0
"each one received - and no one is looking at the product, because the" => n3
n3^0
"product is not visible from inside any single layer. A budget carried down" => n4
n4^0
"the call is the same policy expressed where it can be read." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def amplification(depth, attempts):
    total = 1
    for d in range(1, depth+1):
        total = total * attempts
    return total

def edge_only(depth, attempts):
    return attempts

print("depth   attempts   retry every layer   retry at the edge only")
res = {}
for depth in [1, 2, 3, 4, 5]:
    a = 3
    every = amplification(depth, a)
    edge = edge_only(depth, a)
    res[str(depth)] = [every, edge]
    print("%-7d %-10d %-19d %d" % (depth, a, every, edge))
print("")
print("per-layer attempts held at 3.")
print("")
HEADROOM = 4
print("a backend at 25% utilisation has " + str(HEADROOM) + "x headroom.")
breach_depth = 0
edge_breach = 0
for depth in [1, 2, 3, 4, 5]:
    if breach_depth == 0 and res[str(depth)][0] > HEADROOM:
        breach_depth = depth
    if res[str(depth)][1] > HEADROOM:
        edge_breach = edge_breach + 1
print("depth at which retrying every layer exceeds it: " + str(breach_depth))
print("  multiplier there: " + str(res[str(breach_depth)][0]) + "x")
print("  edge-only multiplier at the same depth: " + str(res[str(breach_depth)][1]) + "x")
print("depths at which edge-only exceeds it: " + str(edge_breach) + "/5")
print("")
print("at depth 3, by per-layer attempt count:")
rising = 0
steps = 0
ATTEMPTS = [1, 2, 3, 4]
for i in range(0, len(ATTEMPTS)):
    a = ATTEMPTS[i]
    m = amplification(3, a)
    print("  %d attempts per layer -> %dx at the bottom" % (a, m))
    if i > 0:
        steps = steps + 1
        if m > amplification(3, ATTEMPTS[i - 1]):
            rising = rising + 1
print("strictly rising: " + str(rising) + "/" + str(steps))
print("...and 1 attempt per layer means no retries anywhere, which is why the")
print("multiplier is 1 and not 0.")
print("")
print("reviewed one layer at a time, at depth 3 with 3 attempts:")
print("  this layer sends at most 3 requests for each one it receives.")
print("  worst case load increase from THIS change: 3x")
print("  actual load at the bottom: " + str(amplification(3, 3)) + "x")
print("...every reviewer saw a true statement about their own layer.")
print("")
print("with a shared retry BUDGET of 3 total attempts for the whole request:")
budget = 3
budget_ok = 0
for depth in [1, 2, 3, 4, 5]:
    if budget <= res[str(depth)][0]:
        budget_ok = budget_ok + 1
print("  depths where the budget is at or below the every-layer multiplier: " + str(budget_ok) + "/5")
print("  the budget's multiplier is " + str(budget) + "x at every depth, because it is carried")
print("  down the call rather than re-decided at each hop.")
passed = 0
checked = 0
checked = checked + 1
if res["1"][0] == res["1"][1]:
    passed = passed + 1
checked = checked + 1
if res["3"][0] == 27:
    passed = passed + 1
checked = checked + 1
flat = 0
for depth in [1, 2, 3, 4, 5]:
    if res[str(depth)][1] == 3:
        flat = flat + 1
if flat == 5:
    passed = passed + 1
checked = checked + 1
if breach_depth == 2 and edge_breach == 0:
    passed = passed + 1
checked = checked + 1
if rising == steps and steps > 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Every layer's retry policy was reasonable and the product is not."
else:
    verdict = "FAILED - the amplification did not behave as the checks describe."
print(verdict)
print("")
n1 = "Retry policies compose by multiplication and are reviewed by addition."
print(n1)
n2 = "Each layer's author sees a true statement - at most three requests for"
print(n2)
n3 = "each one received - and no one is looking at the product, because the"
print(n3)
n4 = "product is not visible from inside any single layer. A budget carried down"
print(n4)
n5 = "the call is the same policy expressed where it can be read."
print(n5)
```

## stdout (executed)

```text
depth   attempts   retry every layer   retry at the edge only
1       3          3                   3
2       3          9                   3
3       3          27                  3
4       3          81                  3
5       3          243                 3

per-layer attempts held at 3.

a backend at 25% utilisation has 4x headroom.
depth at which retrying every layer exceeds it: 2
  multiplier there: 9x
  edge-only multiplier at the same depth: 3x
depths at which edge-only exceeds it: 0/5

at depth 3, by per-layer attempt count:
  1 attempts per layer -> 1x at the bottom
  2 attempts per layer -> 8x at the bottom
  3 attempts per layer -> 27x at the bottom
  4 attempts per layer -> 64x at the bottom
strictly rising: 3/3
...and 1 attempt per layer means no retries anywhere, which is why the
multiplier is 1 and not 0.

reviewed one layer at a time, at depth 3 with 3 attempts:
  this layer sends at most 3 requests for each one it receives.
  worst case load increase from THIS change: 3x
  actual load at the bottom: 27x
...every reviewer saw a true statement about their own layer.

with a shared retry BUDGET of 3 total attempts for the whole request:
  depths where the budget is at or below the every-layer multiplier: 5/5
  the budget's multiplier is 3x at every depth, because it is carried
  down the call rather than re-decided at each hop.

checks passed: 5/5
Every layer's retry policy was reasonable and the product is not.

Retry policies compose by multiplication and are reviewed by addition.
Each layer's author sees a true statement - at most three requests for
each one received - and no one is looking at the product, because the
product is not visible from inside any single layer. A budget carried down
the call is the same policy expressed where it can be read.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:output · eml:assign · eml:call · eml:return · eml:run:done
