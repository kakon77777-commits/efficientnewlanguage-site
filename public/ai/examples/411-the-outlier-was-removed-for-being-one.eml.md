<!-- canonical: efficientnewlanguage.org/ai/examples/411-the-outlier-was-removed-for-being-one | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 411 — The outlier was removed for being one - 0 instances of the investigated thing survive cleaning

`the_outlier_was_removed_for_being_one.eml` computes the statistics with and without the cleaning rule and counts how many genuine slow paths each dataset still contains.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The cleaning step
# removes points far from the mean. The investigation is into why some points
# are far from the mean.
#
# Removing outliers is standard and usually right: a sensor glitch, a test
# account, a duplicated import. Leaving them in lets one bad row dominate every
# statistic, and the rule that removes them is simple, documented and applied
# consistently.
#
# It is also defined by exactly the property being looked for. The rule does
# not know why a point is far out, and neither does anyone until they look at
# it - which the rule removes the opportunity to do.

# [request, latency, is it a genuine slow path]
[[1, 40, 0], [2, 45, 0], [3, 38, 0], [4, 42, 0], [5, 900, 1], [6, 41, 0], [7, 44, 0], [8, 39, 0], [9, 870, 1], [10, 43, 0], [11, 40, 0], [12, 910, 1]] => requests

def mean_of(keep_all):
    0 => t
    0 => n
    for r in requests:
        if keep_all == 1:
            t + r[1] => t
            n + 1 => n
        else:
            if r[1] < 200:
                t + r[1] => t
                n + 1 => n
    return int(t / n)

def kept(keep_all):
    0 => n
    for r in requests:
        if keep_all == 1:
            n + 1 => n
        else:
            if r[1] < 200:
                n + 1 => n
    return n

def worst(keep_all):
    0 => w
    for r in requests:
        if keep_all == 1:
            if r[1] > w:
                r[1] => w
        else:
            if r[1] < 200:
                if r[1] > w:
                    r[1] => w
    return w

"requests : " + str(len(requests)) ^0
"" ^0

"with everything" ^0
"  kept  : " + str(kept(1)) ^0
"  mean  : " + str(mean_of(1)) ^0
"  worst : " + str(worst(1)) ^0
"" ^0
"after the cleaning rule" ^0
"  kept  : " + str(kept(0)) ^0
"  mean  : " + str(mean_of(0)) ^0
"  worst : " + str(worst(0)) ^0
"" ^0

# ---- what was removed ----

0 => removed
0 => removed_genuine
for r in requests:
    if r[1] >= 200:
        removed + 1 => removed
        removed_genuine + r[2] => removed_genuine
"what the rule removed" ^0
"  points removed : " + str(removed) ^0
"  of those, genuine slow paths : " + str(removed_genuine) ^0
"  of those, glitches : " + str(removed - removed_genuine) ^0
if removed_genuine == removed:
    "  every removed point was real" ^0
"" ^0

# ---- the question being asked ----

0 => genuine_total
for r in requests:
    genuine_total + r[2] => genuine_total
"the investigation" ^0
"  question : why are some requests slow" ^0
"  genuine slow requests in the data : " + str(genuine_total) ^0
0 => survivors
for r in requests:
    if r[1] < 200:
        survivors + r[2] => survivors
"  genuine slow requests surviving the cleaning : " + str(survivors) ^0
if survivors == 0:
    "  the cleaned data contains no instance of the thing being investigated" ^0
"" ^0

# ---- what each dataset can answer ----

"what each dataset supports" ^0
"  typical latency, for capacity planning : cleaned, " + str(mean_of(0)) ^0
"  what the slowest users experience      : cleaned cannot say" ^0
"  how often the slow path is taken       : " + str(int(genuine_total * 100 / len(requests))) + "% - only in the raw data" ^0
"" ^0

# ---- the control: a dataset whose far points really are glitches ----

[[1, 40, 0], [2, 42, 0], [3, 99999, 0], [4, 41, 0]] => glitchy
0 => g_removed
0 => g_genuine
for r in glitchy:
    if r[1] >= 200:
        g_removed + 1 => g_removed
        g_genuine + r[2] => g_genuine
"control - a dataset whose far point is a sensor glitch" ^0
"  removed : " + str(g_removed) + ", of which genuine : " + str(g_genuine) ^0
if g_genuine == 0:
    "  here the rule removes only noise, and it is exactly the right thing to do" ^0
"" ^0

"The rule is correct, documented and consistently applied. It selects on" ^0
"distance from the mean, and so does the question." ^0
```

## Python (deterministic transpilation)

```python
requests = [[1, 40, 0], [2, 45, 0], [3, 38, 0], [4, 42, 0], [5, 900, 1], [6, 41, 0], [7, 44, 0], [8, 39, 0], [9, 870, 1], [10, 43, 0], [11, 40, 0], [12, 910, 1]]

def mean_of(keep_all):
    t = 0
    n = 0
    for r in requests:
        if keep_all == 1:
            t = t + r[1]
            n = n + 1
        elif r[1] < 200:
            t = t + r[1]
            n = n + 1
    return int(t / n)

def kept(keep_all):
    n = 0
    for r in requests:
        if keep_all == 1:
            n = n + 1
        elif r[1] < 200:
            n = n + 1
    return n

def worst(keep_all):
    w = 0
    for r in requests:
        if keep_all == 1:
            if r[1] > w:
                w = r[1]
        elif r[1] < 200:
            if r[1] > w:
                w = r[1]
    return w

print("requests : " + str(len(requests)))
print("")
print("with everything")
print("  kept  : " + str(kept(1)))
print("  mean  : " + str(mean_of(1)))
print("  worst : " + str(worst(1)))
print("")
print("after the cleaning rule")
print("  kept  : " + str(kept(0)))
print("  mean  : " + str(mean_of(0)))
print("  worst : " + str(worst(0)))
print("")
removed = 0
removed_genuine = 0
for r in requests:
    if r[1] >= 200:
        removed = removed + 1
        removed_genuine = removed_genuine + r[2]
print("what the rule removed")
print("  points removed : " + str(removed))
print("  of those, genuine slow paths : " + str(removed_genuine))
print("  of those, glitches : " + str(removed - removed_genuine))
if removed_genuine == removed:
    print("  every removed point was real")
print("")
genuine_total = 0
for r in requests:
    genuine_total = genuine_total + r[2]
print("the investigation")
print("  question : why are some requests slow")
print("  genuine slow requests in the data : " + str(genuine_total))
survivors = 0
for r in requests:
    if r[1] < 200:
        survivors = survivors + r[2]
print("  genuine slow requests surviving the cleaning : " + str(survivors))
if survivors == 0:
    print("  the cleaned data contains no instance of the thing being investigated")
print("")
print("what each dataset supports")
print("  typical latency, for capacity planning : cleaned, " + str(mean_of(0)))
print("  what the slowest users experience      : cleaned cannot say")
print("  how often the slow path is taken       : " + str(int(genuine_total * 100 / len(requests))) + "% - only in the raw data")
print("")
glitchy = [[1, 40, 0], [2, 42, 0], [3, 99999, 0], [4, 41, 0]]
g_removed = 0
g_genuine = 0
for r in glitchy:
    if r[1] >= 200:
        g_removed = g_removed + 1
        g_genuine = g_genuine + r[2]
print("control - a dataset whose far point is a sensor glitch")
print("  removed : " + str(g_removed) + ", of which genuine : " + str(g_genuine))
if g_genuine == 0:
    print("  here the rule removes only noise, and it is exactly the right thing to do")
print("")
print("The rule is correct, documented and consistently applied. It selects on")
print("distance from the mean, and so does the question.")
```

## stdout (executed)

```text
requests : 12

with everything
  kept  : 12
  mean  : 254
  worst : 910

after the cleaning rule
  kept  : 9
  mean  : 41
  worst : 45

what the rule removed
  points removed : 3
  of those, genuine slow paths : 3
  of those, glitches : 0
  every removed point was real

the investigation
  question : why are some requests slow
  genuine slow requests in the data : 3
  genuine slow requests surviving the cleaning : 0
  the cleaned data contains no instance of the thing being investigated

what each dataset supports
  typical latency, for capacity planning : cleaned, 41
  what the slowest users experience      : cleaned cannot say
  how often the slow path is taken       : 25% - only in the raw data

control - a dataset whose far point is a sensor glitch
  removed : 1, of which genuine : 0
  here the rule removes only noise, and it is exactly the right thing to do

The rule is correct, documented and consistently applied. It selects on
distance from the mean, and so does the question.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
