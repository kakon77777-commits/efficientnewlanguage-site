<!-- canonical: efficientnewlanguage.org/ai/examples/482-the-interface-was-shaped-by-a-caller-that-is-gone | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 482 — The interface was shaped by a caller that is gone

`the_interface_was_shaped_by_a_caller_that_is_gone.eml` - Six features of this interface exist because of one integration. That integration was retired two years ago. What still depends on each is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Six features of
# this interface exist because of one integration. That integration was retired
# two years ago. What still depends on each is computed below.
#
# Shaping the interface around the caller was right. There was one consumer, its
# needs were real and specific, and designing for a hypothetical second consumer
# instead of the actual first one is how interfaces end up serving nobody.
#
# When that consumer goes, its requirements do not leave with it. They are now
# properties of a published interface that other callers have arrived at and
# written against, so each one is either dead weight or has been picked up by
# somebody who never needed it in the first place.
#
# Each feature is checked against the callers that exist now.

# [feature, why it exists, current callers using it, cost to keep]
[["synchronous mode", "the retired integration could not poll", 0, 3], ["the flat response shape", "their parser was hand-written", 4, 1], ["the legacy date format", "their platform predated ISO", 1, 2], ["batch size capped at 50", "their gateway timed out", 0, 2], ["the duplicated id field", "they read one and wrote the other", 2, 1], ["the sync-only error code", "their retry logic keyed on it", 0, 1]] => features

len(features) => n
0 => orphaned
0 => adopted
0 => orphan_cost
0 => total_cost
for f in features:
    total_cost + f[3] => total_cost
    if f[2] == 0:
        orphaned + 1 => orphaned
        orphan_cost + f[3] => orphan_cost
    else:
        adopted + 1 => adopted

"features shaped by the retired integration : " + str(n) ^0
"  now used by nobody      : " + str(orphaned) ^0
"  picked up by other callers : " + str(adopted) ^0
"" ^0

"feature                    exists because                        callers   cost" ^0
for f in features:
    "  " + f[0] + "   " + f[1] + "   " + str(f[2]) + "         " + str(f[3]) ^0
"" ^0

"maintenance cost per release : " + str(total_cost) ^0
if orphan_cost > 0:
    "  spent on features with no caller : " + str(orphan_cost) + ", which is " + str(int(orphan_cost * 100 / total_cost)) + "%" ^0
"" ^0

# ---- the adopted ones are the harder half ----
#
# A feature nobody uses can be removed. A feature somebody uses is now a
# promise, and the promise was made to a caller that no longer exists.

0 => adopted_callers
for f in features:
    if f[2] > 0:
        adopted_callers + f[2] => adopted_callers
"features other callers now depend on : " + str(adopted) ^0
"  callers depending on them : " + str(adopted_callers) ^0
for f in features:
    if f[2] > 0:
        "  " + f[0] + " : " + str(f[2]) + " caller(s), and it exists because " + f[1] ^0
"  none of those callers asked for the shape; they wrote against what was" ^0
"  there, which is what every caller does" ^0
"" ^0

# ---- what a redesign would have to argue ----

"removing an adopted feature" ^0
"  callers broken : " + str(adopted_callers) ^0
"  the original reason : gone" ^0
"  the current reason  : " + str(adopted_callers) + " callers, which is a reason that did not" ^0
"  exist when the feature was designed and is now the only one" ^0
"" ^0

"removing an orphaned feature" ^0
"  callers broken : 0" ^0
"  cost recovered : " + str(orphan_cost) + " per release" ^0
"  what stops it  : it is published, so removal is a version bump, and a" ^0
"  version bump costs every caller including the " + str(adopted_callers) + " who use other parts" ^0
"" ^0

# ---- how the reasons decayed ----

"what is recorded about why each feature exists" ^0
"  in the interface itself : nothing; a shape has no reason attached" ^0
"  in the design doc       : the integration's name, which now resolves to" ^0
"  nothing" ^0
"  the reason survived exactly as long as the people who were in the room" ^0
"" ^0

# ---- the control: a feature with more than one original caller ----
#
# Where two independent consumers needed the same thing, the requirement is a
# property of the domain rather than of one integration, and it survives either
# of them leaving.

"control - a feature two independent consumers asked for" ^0
"  original callers : 2" ^0
"  if one retires : the requirement still has a caller and a reason" ^0
"  the difference is not the design work; it is whether the reason was ever" ^0
"  attached to more than one party" ^0
"" ^0

"Designing for the actual caller was right and designing for a hypothetical" ^0
"one is how interfaces serve nobody. The caller left and its requirements" ^0
"stayed, and other callers have since written against them." ^0
```

## Python (deterministic transpilation)

```python
features = [["synchronous mode", "the retired integration could not poll", 0, 3], ["the flat response shape", "their parser was hand-written", 4, 1], ["the legacy date format", "their platform predated ISO", 1, 2], ["batch size capped at 50", "their gateway timed out", 0, 2], ["the duplicated id field", "they read one and wrote the other", 2, 1], ["the sync-only error code", "their retry logic keyed on it", 0, 1]]
n = len(features)
orphaned = 0
adopted = 0
orphan_cost = 0
total_cost = 0
for f in features:
    total_cost = total_cost + f[3]
    if f[2] == 0:
        orphaned = orphaned + 1
        orphan_cost = orphan_cost + f[3]
    else:
        adopted = adopted + 1
print("features shaped by the retired integration : " + str(n))
print("  now used by nobody      : " + str(orphaned))
print("  picked up by other callers : " + str(adopted))
print("")
print("feature                    exists because                        callers   cost")
for f in features:
    print("  " + f[0] + "   " + f[1] + "   " + str(f[2]) + "         " + str(f[3]))
print("")
print("maintenance cost per release : " + str(total_cost))
if orphan_cost > 0:
    print("  spent on features with no caller : " + str(orphan_cost) + ", which is " + str(int(orphan_cost * 100 / total_cost)) + "%")
print("")
adopted_callers = 0
for f in features:
    if f[2] > 0:
        adopted_callers = adopted_callers + f[2]
print("features other callers now depend on : " + str(adopted))
print("  callers depending on them : " + str(adopted_callers))
for f in features:
    if f[2] > 0:
        print("  " + f[0] + " : " + str(f[2]) + " caller(s), and it exists because " + f[1])
print("  none of those callers asked for the shape; they wrote against what was")
print("  there, which is what every caller does")
print("")
print("removing an adopted feature")
print("  callers broken : " + str(adopted_callers))
print("  the original reason : gone")
print("  the current reason  : " + str(adopted_callers) + " callers, which is a reason that did not")
print("  exist when the feature was designed and is now the only one")
print("")
print("removing an orphaned feature")
print("  callers broken : 0")
print("  cost recovered : " + str(orphan_cost) + " per release")
print("  what stops it  : it is published, so removal is a version bump, and a")
print("  version bump costs every caller including the " + str(adopted_callers) + " who use other parts")
print("")
print("what is recorded about why each feature exists")
print("  in the interface itself : nothing; a shape has no reason attached")
print("  in the design doc       : the integration's name, which now resolves to")
print("  nothing")
print("  the reason survived exactly as long as the people who were in the room")
print("")
print("control - a feature two independent consumers asked for")
print("  original callers : 2")
print("  if one retires : the requirement still has a caller and a reason")
print("  the difference is not the design work; it is whether the reason was ever")
print("  attached to more than one party")
print("")
print("Designing for the actual caller was right and designing for a hypothetical")
print("one is how interfaces serve nobody. The caller left and its requirements")
print("stayed, and other callers have since written against them.")
```

## stdout (executed)

```text
features shaped by the retired integration : 6
  now used by nobody      : 3
  picked up by other callers : 3

feature                    exists because                        callers   cost
  synchronous mode   the retired integration could not poll   0         3
  the flat response shape   their parser was hand-written   4         1
  the legacy date format   their platform predated ISO   1         2
  batch size capped at 50   their gateway timed out   0         2
  the duplicated id field   they read one and wrote the other   2         1
  the sync-only error code   their retry logic keyed on it   0         1

maintenance cost per release : 10
  spent on features with no caller : 6, which is 60%

features other callers now depend on : 3
  callers depending on them : 7
  the flat response shape : 4 caller(s), and it exists because their parser was hand-written
  the legacy date format : 1 caller(s), and it exists because their platform predated ISO
  the duplicated id field : 2 caller(s), and it exists because they read one and wrote the other
  none of those callers asked for the shape; they wrote against what was
  there, which is what every caller does

removing an adopted feature
  callers broken : 7
  the original reason : gone
  the current reason  : 7 callers, which is a reason that did not
  exist when the feature was designed and is now the only one

removing an orphaned feature
  callers broken : 0
  cost recovered : 6 per release
  what stops it  : it is published, so removal is a version bump, and a
  version bump costs every caller including the 7 who use other parts

what is recorded about why each feature exists
  in the interface itself : nothing; a shape has no reason attached
  in the design doc       : the integration's name, which now resolves to
  nothing
  the reason survived exactly as long as the people who were in the room

control - a feature two independent consumers asked for
  original callers : 2
  if one retires : the requirement still has a caller and a reason
  the difference is not the design work; it is whether the reason was ever
  attached to more than one party

Designing for the actual caller was right and designing for a hypothetical
one is how interfaces serve nobody. The caller left and its requirements
stayed, and other callers have since written against them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
