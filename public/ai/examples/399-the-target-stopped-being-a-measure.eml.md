<!-- canonical: efficientnewlanguage.org/ai/examples/399-the-target-stopped-being-a-measure | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 399 — The target stopped being a measure - 100% concordance before, no decidable pairs after

`the_target_stopped_being_a_measure.eml` computes the proxy and the goal from the same ticket log in both periods, and measures how well the proxy can still rank tickets by the goal.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The proxy tracked
# the goal for two years. Then it became the target.
#
# Choosing the proxy was not a mistake. Response time was measurable, cheap,
# available daily, and over the observed period it moved with the thing anyone
# actually cared about - tickets that ended with the customer's problem solved.
# A team asked to improve the goal directly has nothing to act on; a team asked
# to improve the proxy does.
#
# What the correlation was made of is the part nobody wrote down: it held
# because the fastest way to answer quickly WAS to answer well. Once the proxy
# is the target, cheaper ways of moving it become worth finding, and those ways
# have no reason to move the goal.
#
# Both quantities are computed from the same ticket log in both periods, so
# nothing here depends on how the numbers were reported.

# [hours_to_first_reply, resolved]
[[2, 1], [3, 1], [8, 0], [2, 1], [9, 0], [3, 1], [12, 0], [2, 1], [4, 1], [10, 0], [3, 1], [2, 1], [11, 0], [3, 1], [2, 1], [9, 0], [2, 1], [3, 1], [14, 0], [2, 1]] => before

# Same team, after the proxy became the number they are judged on. The new
# habit is an instant holding reply, which stops the clock and resolves nothing.
[[1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 0]] => after

def mean_hours(rows):
    0 => t
    for r in rows:
        t + r[0] => t
    return int(t * 10 / len(rows))

def resolved(rows):
    0 => c
    for r in rows:
        c + r[1] => c
    return c

def show(x):
    return str(int(x / 10)) + "." + str(x % 10)

# ---- how well the proxy tracked the goal, before ----
#
# Measured as agreement on pairs: for two tickets, does the faster one also end
# resolved more often. That is the property a proxy needs, and it is computed
# rather than asserted.

def show_conc(x):
    if x == -1:
        return "n/a - no decidable pairs"
    return str(x) + "%"

def concordant(rows):
    0 => agree
    0 => pairs
    0 => i
    for a in rows:
        0 => j
        for b in rows:
            if j > i:
                if not (a[0] == b[0]):
                    if not (a[1] == b[1]):
                        pairs + 1 => pairs
                        if a[0] < b[0]:
                            if a[1] > b[1]:
                                agree + 1 => agree
                        else:
                            if a[1] < b[1]:
                                agree + 1 => agree
            j + 1 => j
        i + 1 => i
    if pairs == 0:
        return -1
    return int(agree * 100 / pairs)

"before the proxy became the target" ^0
"  tickets            : " + str(len(before)) ^0
"  mean hours to reply: " + show(mean_hours(before)) ^0
"  resolved           : " + str(resolved(before)) + " of " + str(len(before)) ^0
"  faster ticket also resolved, on decidable pairs : " + show_conc(concordant(before)) ^0
"" ^0

"after" ^0
"  tickets            : " + str(len(after)) ^0
"  mean hours to reply: " + show(mean_hours(after)) ^0
"  resolved           : " + str(resolved(after)) + " of " + str(len(after)) ^0
"  faster ticket also resolved, on decidable pairs : " + show_conc(concordant(after)) ^0
"" ^0

# ---- the two numbers moved in opposite directions ----

"the change" ^0
"  proxy improved by : " + show(mean_hours(before) - mean_hours(after)) + " hours" ^0
"  goal moved by     : " + str(resolved(after) - resolved(before)) + " resolutions" ^0
if mean_hours(after) < mean_hours(before):
    if resolved(after) < resolved(before):
        "  the proxy got better and the goal got worse" ^0
"" ^0

# ---- and the link between them is gone, not merely weaker ----

concordant(before) => cb
concordant(after) => ca
"the proxy's ability to rank tickets by the goal" ^0
"  before : " + show_conc(cb) ^0
"  after  : " + show_conc(ca) ^0
if ca == -1:
    "  after: no decidable pairs remain - every reply takes the same time," ^0
    "  so the proxy can no longer order anything at all" ^0
"" ^0

# ---- the control: a period where the proxy was watched but not targeted ----
#
# Watching a number does not break it. What breaks it is making it the thing
# being optimised, and this period separates the two.

[[2, 1], [3, 1], [9, 0], [2, 1], [11, 0], [3, 1], [2, 1], [10, 0]] => watched
"control - the proxy reported weekly, nobody judged on it" ^0
"  mean hours : " + show(mean_hours(watched)) ^0
"  resolved   : " + str(resolved(watched)) + " of " + str(len(watched)) ^0
"  ranking ability : " + show_conc(concordant(watched)) ^0
if concordant(watched) == concordant(before):
    "  unchanged from the before period" ^0
"" ^0

"The proxy was chosen because it moved with the goal, and it did, because the" ^0
"cheapest way to move it was to move the goal. Making it the target made a" ^0
"cheaper way worth finding." ^0
```

## Python (deterministic transpilation)

```python
before = [[2, 1], [3, 1], [8, 0], [2, 1], [9, 0], [3, 1], [12, 0], [2, 1], [4, 1], [10, 0], [3, 1], [2, 1], [11, 0], [3, 1], [2, 1], [9, 0], [2, 1], [3, 1], [14, 0], [2, 1]]
after = [[1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 0], [1, 1], [1, 0], [1, 0]]

def mean_hours(rows):
    t = 0
    for r in rows:
        t = t + r[0]
    return int(t * 10 / len(rows))

def resolved(rows):
    c = 0
    for r in rows:
        c = c + r[1]
    return c

def show(x):
    return str(int(x / 10)) + "." + str(x % 10)

def show_conc(x):
    if x == -1:
        return "n/a - no decidable pairs"
    return str(x) + "%"

def concordant(rows):
    agree = 0
    pairs = 0
    i = 0
    for a in rows:
        j = 0
        for b in rows:
            if j > i:
                if not a[0] == b[0]:
                    if not a[1] == b[1]:
                        pairs = pairs + 1
                        if a[0] < b[0]:
                            if a[1] > b[1]:
                                agree = agree + 1
                        elif a[1] < b[1]:
                            agree = agree + 1
            j = j + 1
        i = i + 1
    if pairs == 0:
        return -1
    return int(agree * 100 / pairs)

print("before the proxy became the target")
print("  tickets            : " + str(len(before)))
print("  mean hours to reply: " + show(mean_hours(before)))
print("  resolved           : " + str(resolved(before)) + " of " + str(len(before)))
print("  faster ticket also resolved, on decidable pairs : " + show_conc(concordant(before)))
print("")
print("after")
print("  tickets            : " + str(len(after)))
print("  mean hours to reply: " + show(mean_hours(after)))
print("  resolved           : " + str(resolved(after)) + " of " + str(len(after)))
print("  faster ticket also resolved, on decidable pairs : " + show_conc(concordant(after)))
print("")
print("the change")
print("  proxy improved by : " + show(mean_hours(before) - mean_hours(after)) + " hours")
print("  goal moved by     : " + str(resolved(after) - resolved(before)) + " resolutions")
if mean_hours(after) < mean_hours(before):
    if resolved(after) < resolved(before):
        print("  the proxy got better and the goal got worse")
print("")
cb = concordant(before)
ca = concordant(after)
print("the proxy's ability to rank tickets by the goal")
print("  before : " + show_conc(cb))
print("  after  : " + show_conc(ca))
if ca == -1:
    print("  after: no decidable pairs remain - every reply takes the same time,")
    print("  so the proxy can no longer order anything at all")
print("")
watched = [[2, 1], [3, 1], [9, 0], [2, 1], [11, 0], [3, 1], [2, 1], [10, 0]]
print("control - the proxy reported weekly, nobody judged on it")
print("  mean hours : " + show(mean_hours(watched)))
print("  resolved   : " + str(resolved(watched)) + " of " + str(len(watched)))
print("  ranking ability : " + show_conc(concordant(watched)))
if concordant(watched) == concordant(before):
    print("  unchanged from the before period")
print("")
print("The proxy was chosen because it moved with the goal, and it did, because the")
print("cheapest way to move it was to move the goal. Making it the target made a")
print("cheaper way worth finding.")
```

## stdout (executed)

```text
before the proxy became the target
  tickets            : 20
  mean hours to reply: 5.3
  resolved           : 13 of 20
  faster ticket also resolved, on decidable pairs : 100%

after
  tickets            : 20
  mean hours to reply: 1.0
  resolved           : 7 of 20
  faster ticket also resolved, on decidable pairs : n/a - no decidable pairs

the change
  proxy improved by : 4.3 hours
  goal moved by     : -6 resolutions
  the proxy got better and the goal got worse

the proxy's ability to rank tickets by the goal
  before : 100%
  after  : n/a - no decidable pairs
  after: no decidable pairs remain - every reply takes the same time,
  so the proxy can no longer order anything at all

control - the proxy reported weekly, nobody judged on it
  mean hours : 5.2
  resolved   : 5 of 8
  ranking ability : 100%
  unchanged from the before period

The proxy was chosen because it moved with the goal, and it did, because the
cheapest way to move it was to move the goal. Making it the target made a
cheaper way worth finding.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
