<!-- canonical: efficientnewlanguage.org/ai/examples/434-nobody-can-prove-any-of-them-is-removable | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 434 — Nobody can prove any of them is removable

`nobody_can_prove_any_of_them_is_removable.eml` - Eleven workarounds, each added for a condition that was real. How many can be shown to be dead is computed below, and it is not the same as how many are dead.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Eleven
# workarounds, each added for a condition that was real. How many can be shown
# to be dead is computed below, and it is not the same as how many are dead.
#
# Keeping them is the cautious choice and cautious is right here. Removing a
# workaround that is still load-bearing breaks production for a reason nobody
# will connect to the change, and the person who would have to defend that is
# not the person who wrote it.
#
# Caution needs something to be cautious about. A workaround is removable when
# its condition is gone, and knowable-as-removable when somebody can still tell
# whether the condition is gone. Those are different properties and they decay
# at different rates, which is why the list only ever grows.
#
# Both are counted per workaround.

# [id, the condition still occurs, a check exists that would say so, the author is still reachable]
[["w1", 1, 1, 1], ["w2", 0, 1, 1], ["w3", 0, 0, 1], ["w4", 1, 0, 0], ["w5", 0, 0, 0], ["w6", 1, 1, 0], ["w7", 0, 1, 0], ["w8", 0, 0, 0], ["w9", 1, 0, 1], ["w10", 0, 0, 0], ["w11", 0, 1, 1]] => works

len(works) => n

def dead(w):
    if w[1] == 0:
        return 1
    return 0

def knowable(w):
    if w[2] == 1:
        return 1
    if w[3] == 1:
        return 1
    return 0

"workarounds : " + str(n) ^0
"" ^0

0 => really_dead
0 => can_tell
0 => provably_removable
for w in works:
    really_dead + dead(w) => really_dead
    can_tell + knowable(w) => can_tell
    if dead(w) == 1:
        if knowable(w) == 1:
            provably_removable + 1 => provably_removable

"  conditions that no longer occur   : " + str(really_dead) ^0
"  somebody or something can still tell : " + str(can_tell) ^0
"  both, so removal is defensible    : " + str(provably_removable) ^0
if really_dead > provably_removable:
    "  dead but unprovable : " + str(really_dead - provably_removable) ^0
    "  those stay, and they are the ones caution is protecting nothing from" ^0
"" ^0

"id    condition   evidence available   verdict" ^0
for w in works:
    "" => c
    if w[1] == 1:
        c + "live" => c
    else:
        c + "gone" => c
    "" => e
    if w[2] == 1:
        e + "a check" => e
    elif w[3] == 1:
        e + "the author" => e
    else:
        e + "none   " => e
    "" => v
    if dead(w) == 1:
        if knowable(w) == 1:
            v + "removable" => v
        else:
            v + "stays, unprovable" => v
    else:
        v + "keep" => v
    "  " + w[0] + "    " + c + "        " + e + "              " + v ^0
"" ^0

# ---- what the two properties do over time ----
#
# The chance a condition is gone rises with age. The chance anybody can still
# tell falls with it. The list is the set where the second has overtaken the
# first.

0 => live_with_evidence
0 => live_without
for w in works:
    if w[1] == 1:
        if knowable(w) == 1:
            live_with_evidence + 1 => live_with_evidence
        else:
            live_without + 1 => live_without
"conditions that still occur : " + str(n - really_dead) ^0
"  with evidence saying so   : " + str(live_with_evidence) ^0
"  without                   : " + str(live_without) ^0
if live_without > 0:
    "  kept for the right reason by accident : " + str(live_without) ^0
"" ^0

# ---- what one cheap action changes ----
#
# Adding a check that reports whether the condition fires does not remove
# anything. It moves workarounds out of the unprovable column, which is the
# column that never empties on its own.

0 => after_checks
for w in works:
    if dead(w) == 1:
        after_checks + 1 => after_checks
"if every workaround logged whether its condition fired" ^0
"  provably removable becomes : " + str(after_checks) ^0
if after_checks > provably_removable:
    "  up " + str(after_checks - provably_removable) + " from " + str(provably_removable) + ", with no workaround removed yet" ^0
"  and the ones that stay, stay on evidence rather than on nobody knowing" ^0
"" ^0

# ---- the cost of the ones that stay ----

3 => lines_each
"what the unprovable ones cost while they wait" ^0
"  count       : " + str(really_dead - provably_removable) ^0
"  lines       : " + str((really_dead - provably_removable) * lines_each) + ", at " + str(lines_each) + " lines each" ^0
"  the real cost is that each one is read by everybody who touches this file" ^0
"  and cannot be understood without the incident that produced it" ^0
"" ^0

# ---- the control: a workaround with an expiry ----
#
# One that names the condition and fails the build when the condition stops
# occurring cannot enter the unprovable column, because the evidence is part
# of the workaround.

[["x1", 0, 1, 0], ["x2", 0, 1, 0]] => expiring
0 => x_prov
for w in expiring:
    if dead(w) == 1:
        if knowable(w) == 1:
            x_prov + 1 => x_prov
"control - workarounds that carry their own condition check" ^0
"  count : " + str(len(expiring)) + ", provably removable : " + str(x_prov) ^0
if x_prov == len(expiring):
    "  all of them, with no author reachable and no archaeology" ^0
"" ^0

"Keeping a workaround whose condition might still occur is correct. The list" ^0
"grows because the evidence that would end an entry expires faster than the" ^0
"condition it was about." ^0
```

## Python (deterministic transpilation)

```python
works = [["w1", 1, 1, 1], ["w2", 0, 1, 1], ["w3", 0, 0, 1], ["w4", 1, 0, 0], ["w5", 0, 0, 0], ["w6", 1, 1, 0], ["w7", 0, 1, 0], ["w8", 0, 0, 0], ["w9", 1, 0, 1], ["w10", 0, 0, 0], ["w11", 0, 1, 1]]
n = len(works)

def dead(w):
    if w[1] == 0:
        return 1
    return 0

def knowable(w):
    if w[2] == 1:
        return 1
    if w[3] == 1:
        return 1
    return 0

print("workarounds : " + str(n))
print("")
really_dead = 0
can_tell = 0
provably_removable = 0
for w in works:
    really_dead = really_dead + dead(w)
    can_tell = can_tell + knowable(w)
    if dead(w) == 1:
        if knowable(w) == 1:
            provably_removable = provably_removable + 1
print("  conditions that no longer occur   : " + str(really_dead))
print("  somebody or something can still tell : " + str(can_tell))
print("  both, so removal is defensible    : " + str(provably_removable))
if really_dead > provably_removable:
    print("  dead but unprovable : " + str(really_dead - provably_removable))
    print("  those stay, and they are the ones caution is protecting nothing from")
print("")
print("id    condition   evidence available   verdict")
for w in works:
    c = ""
    if w[1] == 1:
        c = c + "live"
    else:
        c = c + "gone"
    e = ""
    if w[2] == 1:
        e = e + "a check"
    elif w[3] == 1:
        e = e + "the author"
    else:
        e = e + "none   "
    v = ""
    if dead(w) == 1:
        if knowable(w) == 1:
            v = v + "removable"
        else:
            v = v + "stays, unprovable"
    else:
        v = v + "keep"
    print("  " + w[0] + "    " + c + "        " + e + "              " + v)
print("")
live_with_evidence = 0
live_without = 0
for w in works:
    if w[1] == 1:
        if knowable(w) == 1:
            live_with_evidence = live_with_evidence + 1
        else:
            live_without = live_without + 1
print("conditions that still occur : " + str(n - really_dead))
print("  with evidence saying so   : " + str(live_with_evidence))
print("  without                   : " + str(live_without))
if live_without > 0:
    print("  kept for the right reason by accident : " + str(live_without))
print("")
after_checks = 0
for w in works:
    if dead(w) == 1:
        after_checks = after_checks + 1
print("if every workaround logged whether its condition fired")
print("  provably removable becomes : " + str(after_checks))
if after_checks > provably_removable:
    print("  up " + str(after_checks - provably_removable) + " from " + str(provably_removable) + ", with no workaround removed yet")
print("  and the ones that stay, stay on evidence rather than on nobody knowing")
print("")
lines_each = 3
print("what the unprovable ones cost while they wait")
print("  count       : " + str(really_dead - provably_removable))
print("  lines       : " + str((really_dead - provably_removable) * lines_each) + ", at " + str(lines_each) + " lines each")
print("  the real cost is that each one is read by everybody who touches this file")
print("  and cannot be understood without the incident that produced it")
print("")
expiring = [["x1", 0, 1, 0], ["x2", 0, 1, 0]]
x_prov = 0
for w in expiring:
    if dead(w) == 1:
        if knowable(w) == 1:
            x_prov = x_prov + 1
print("control - workarounds that carry their own condition check")
print("  count : " + str(len(expiring)) + ", provably removable : " + str(x_prov))
if x_prov == len(expiring):
    print("  all of them, with no author reachable and no archaeology")
print("")
print("Keeping a workaround whose condition might still occur is correct. The list")
print("grows because the evidence that would end an entry expires faster than the")
print("condition it was about.")
```

## stdout (executed)

```text
workarounds : 11

  conditions that no longer occur   : 7
  somebody or something can still tell : 7
  both, so removal is defensible    : 4
  dead but unprovable : 3
  those stay, and they are the ones caution is protecting nothing from

id    condition   evidence available   verdict
  w1    live        a check              keep
  w2    gone        a check              removable
  w3    gone        the author              removable
  w4    live        none                 keep
  w5    gone        none                 stays, unprovable
  w6    live        a check              keep
  w7    gone        a check              removable
  w8    gone        none                 stays, unprovable
  w9    live        the author              keep
  w10    gone        none                 stays, unprovable
  w11    gone        a check              removable

conditions that still occur : 4
  with evidence saying so   : 3
  without                   : 1
  kept for the right reason by accident : 1

if every workaround logged whether its condition fired
  provably removable becomes : 7
  up 3 from 4, with no workaround removed yet
  and the ones that stay, stay on evidence rather than on nobody knowing

what the unprovable ones cost while they wait
  count       : 3
  lines       : 9, at 3 lines each
  the real cost is that each one is read by everybody who touches this file
  and cannot be understood without the incident that produced it

control - workarounds that carry their own condition check
  count : 2, provably removable : 2
  all of them, with no author reachable and no archaeology

Keeping a workaround whose condition might still occur is correct. The list
grows because the evidence that would end an entry expires faster than the
condition it was about.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
