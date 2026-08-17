<!-- canonical: efficientnewlanguage.org/ai/examples/421-the-defect-was-load-bearing | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 421 — The defect was load bearing

`the_defect_was_load_bearing.eml` - The bug was fixed and more callers broke than were ever helped.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The bug was fixed
# and more callers broke than were ever helped.
#
# The fix was correct. The function was documented to reject negative
# quantities and it accepted them, silently clamping to zero - a real defect,
# reported, reproduced and repaired exactly as it should have been.
#
# Between the defect being written and the defect being fixed, callers arrived.
# Some hit it and worked around it; some depended on the clamping because it
# was the only behaviour they had ever observed. Neither group read the doc,
# because the code was right there.
#
# Every caller is run against both behaviours here, so who breaks is counted
# rather than guessed.

# [caller, sends negatives, relies on clamping, has its own guard]
[["order intake", 1, 1, 0], ["refund flow", 1, 1, 0], ["bulk import", 1, 0, 1], ["admin tool", 0, 0, 0], ["mobile app", 1, 1, 0], ["partner api", 1, 0, 1], ["reconciler", 0, 0, 0], ["migration job", 1, 1, 0]] => callers

# Old behaviour: negatives are clamped to zero and accepted.
# New behaviour: negatives are rejected with an error.
def breaks_on_fix(c):
    if c[1] == 0:
        return 0
    if c[3] == 1:
        return 0
    return 1

def was_helped(c):
    if c[1] == 1:
        if c[3] == 1:
            return 1
    return 0

0 => broke
0 => helped
for c in callers:
    broke + breaks_on_fix(c) => broke
    helped + was_helped(c) => helped

"callers : " + str(len(callers)) ^0
"  break when the defect is fixed : " + str(broke) ^0
"  helped by the fix              : " + str(helped) ^0
"" ^0

"caller             sends negatives   own guard   after the fix" ^0
for c in callers:
    "" => n
    if c[1] == 1:
        n + "yes" => n
    else:
        n + "no " => n
    "" => g
    if c[3] == 1:
        g + "yes" => g
    else:
        g + "no " => g
    "" => r
    if breaks_on_fix(c) == 1:
        r + "BREAKS" => r
    else:
        r + "fine" => r
    "  " + c[0] + "   " + n + "               " + g + "         " + r ^0
"" ^0

# ---- what the broken callers were doing ----

"the callers that break" ^0
for c in callers:
    if breaks_on_fix(c) == 1:
        "  " + c[0] + " : sends negatives and expects them accepted" ^0
"  none of them is doing anything the code ever refused" ^0
"" ^0

# ---- what the fix bought ----

"what the fix bought" ^0
"  callers that already guarded, now guarded twice : " + str(helped) ^0
"  callers that will now see a real error instead of a silent zero : " + str(broke) ^0
"  the second group is the point of the fix and the cost of it" ^0
"" ^0

# ---- the shape that makes this hard ----

0 => silent_wrong
for c in callers:
    if c[1] == 1:
        if c[3] == 0:
            silent_wrong + 1 => silent_wrong
"before the fix" ^0
"  callers sending negatives with no guard : " + str(silent_wrong) ^0
"  each of them was getting a silent zero, which is the defect" ^0
"  each of them also shipped, tested and passed on that zero" ^0
"" ^0

# ---- a migration that costs one release ----
#
# Not a choice between fixing and not fixing. Warn first, so the same callers
# fail in a release where failing is expected.

"warn for one release, then reject" ^0
"  callers warned : " + str(broke) ^0
"  callers broken during the warning release : 0" ^0
"  callers broken after it : " + str(broke) + " - the same ones, at a time they chose" ^0
"" ^0

# ---- the control: a defect nobody built on ----

[["one caller", 1, 0, 1]] => quiet
0 => quiet_broke
for c in quiet:
    quiet_broke + breaks_on_fix(c) => quiet_broke
"control - the same fix where every caller already guards" ^0
"  callers broken : " + str(quiet_broke) ^0
if quiet_broke == 0:
    "  here the fix is free, which is what a fix is supposed to be" ^0
"" ^0

"The defect was real and the fix was right. Behaviour that shipped is" ^0
"behaviour somebody built on, and how many is a fact about the callers rather" ^0
"than about the bug." ^0
```

## Python (deterministic transpilation)

```python
callers = [["order intake", 1, 1, 0], ["refund flow", 1, 1, 0], ["bulk import", 1, 0, 1], ["admin tool", 0, 0, 0], ["mobile app", 1, 1, 0], ["partner api", 1, 0, 1], ["reconciler", 0, 0, 0], ["migration job", 1, 1, 0]]

def breaks_on_fix(c):
    if c[1] == 0:
        return 0
    if c[3] == 1:
        return 0
    return 1

def was_helped(c):
    if c[1] == 1:
        if c[3] == 1:
            return 1
    return 0

broke = 0
helped = 0
for c in callers:
    broke = broke + breaks_on_fix(c)
    helped = helped + was_helped(c)
print("callers : " + str(len(callers)))
print("  break when the defect is fixed : " + str(broke))
print("  helped by the fix              : " + str(helped))
print("")
print("caller             sends negatives   own guard   after the fix")
for c in callers:
    n = ""
    if c[1] == 1:
        n = n + "yes"
    else:
        n = n + "no "
    g = ""
    if c[3] == 1:
        g = g + "yes"
    else:
        g = g + "no "
    r = ""
    if breaks_on_fix(c) == 1:
        r = r + "BREAKS"
    else:
        r = r + "fine"
    print("  " + c[0] + "   " + n + "               " + g + "         " + r)
print("")
print("the callers that break")
for c in callers:
    if breaks_on_fix(c) == 1:
        print("  " + c[0] + " : sends negatives and expects them accepted")
print("  none of them is doing anything the code ever refused")
print("")
print("what the fix bought")
print("  callers that already guarded, now guarded twice : " + str(helped))
print("  callers that will now see a real error instead of a silent zero : " + str(broke))
print("  the second group is the point of the fix and the cost of it")
print("")
silent_wrong = 0
for c in callers:
    if c[1] == 1:
        if c[3] == 0:
            silent_wrong = silent_wrong + 1
print("before the fix")
print("  callers sending negatives with no guard : " + str(silent_wrong))
print("  each of them was getting a silent zero, which is the defect")
print("  each of them also shipped, tested and passed on that zero")
print("")
print("warn for one release, then reject")
print("  callers warned : " + str(broke))
print("  callers broken during the warning release : 0")
print("  callers broken after it : " + str(broke) + " - the same ones, at a time they chose")
print("")
quiet = [["one caller", 1, 0, 1]]
quiet_broke = 0
for c in quiet:
    quiet_broke = quiet_broke + breaks_on_fix(c)
print("control - the same fix where every caller already guards")
print("  callers broken : " + str(quiet_broke))
if quiet_broke == 0:
    print("  here the fix is free, which is what a fix is supposed to be")
print("")
print("The defect was real and the fix was right. Behaviour that shipped is")
print("behaviour somebody built on, and how many is a fact about the callers rather")
print("than about the bug.")
```

## stdout (executed)

```text
callers : 8
  break when the defect is fixed : 4
  helped by the fix              : 2

caller             sends negatives   own guard   after the fix
  order intake   yes               no          BREAKS
  refund flow   yes               no          BREAKS
  bulk import   yes               yes         fine
  admin tool   no                no          fine
  mobile app   yes               no          BREAKS
  partner api   yes               yes         fine
  reconciler   no                no          fine
  migration job   yes               no          BREAKS

the callers that break
  order intake : sends negatives and expects them accepted
  refund flow : sends negatives and expects them accepted
  mobile app : sends negatives and expects them accepted
  migration job : sends negatives and expects them accepted
  none of them is doing anything the code ever refused

what the fix bought
  callers that already guarded, now guarded twice : 2
  callers that will now see a real error instead of a silent zero : 4
  the second group is the point of the fix and the cost of it

before the fix
  callers sending negatives with no guard : 4
  each of them was getting a silent zero, which is the defect
  each of them also shipped, tested and passed on that zero

warn for one release, then reject
  callers warned : 4
  callers broken during the warning release : 0
  callers broken after it : 4 - the same ones, at a time they chose

control - the same fix where every caller already guards
  callers broken : 0
  here the fix is free, which is what a fix is supposed to be

The defect was real and the fix was right. Behaviour that shipped is
behaviour somebody built on, and how many is a fact about the callers rather
than about the bug.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
