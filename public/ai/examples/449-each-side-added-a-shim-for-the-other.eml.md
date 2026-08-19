<!-- canonical: efficientnewlanguage.org/ai/examples/449-each-side-added-a-shim-for-the-other | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 449 — Each side added a shim for the other

`each_side_added_a_shim_for_the_other.eml` - Each team wrote a compatibility layer for the other team's changes. How many of them handle the same incompatibility is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each team wrote a
# compatibility layer for the other team's changes. How many of them handle the
# same incompatibility is computed below.
#
# A shim is the right response to a breaking change you do not control. It is
# local, it needs nobody's agreement, it ships the same day, and it keeps a
# caller working through a change the caller had no say in. Every one of these
# was written by somebody unblocking their own team.
#
# The other team is doing the same thing, in the other direction, against the
# same list of incompatibilities. Neither shim knows about the other, so the
# pair is maintained twice and removed never - removing one requires knowing
# the other exists, which is exactly the information the shims replaced.
#
# Both sides' layers are counted against the same list of changes.

# [release, incompatibility, side A shimmed it, side B shimmed it, still needed]
[["r1", "date format", 1, 1, 0], ["r2", "null in totals", 1, 0, 1], ["r3", "renamed field", 1, 1, 0], ["r4", "stricter enum", 0, 1, 1], ["r5", "pagination", 1, 1, 1], ["r6", "error shape", 1, 1, 0], ["r7", "id widening", 0, 1, 1], ["r8", "timezone", 1, 1, 0]] => changes

len(changes) => n

0 => a_shims
0 => b_shims
0 => doubled
0 => needed
0 => doubled_dead
for c in changes:
    a_shims + c[2] => a_shims
    b_shims + c[3] => b_shims
    if c[2] == 1:
        if c[3] == 1:
            doubled + 1 => doubled
            if c[4] == 0:
                doubled_dead + 1 => doubled_dead
    if c[4] == 1:
        needed + 1 => needed

"incompatibilities : " + str(n) ^0
"  shims written by side A : " + str(a_shims) ^0
"  shims written by side B : " + str(b_shims) ^0
"  shims in total          : " + str(a_shims + b_shims) ^0
if a_shims + b_shims > n:
    "  more shims than incompatibilities, by " + str(a_shims + b_shims - n) ^0
"" ^0

"handled on both sides at once : " + str(doubled) + " of " + str(n) ^0
if doubled > 0:
    "  each of those is one incompatibility with two independent fixes, and" ^0
    "  removing either one alone leaves the behaviour correct" ^0
"" ^0

"incompatibility     side A   side B   still needed" ^0
for c in changes:
    "" => a
    if c[2] == 1:
        a + "yes" => a
    else:
        a + "no " => a
    "" => b
    if c[3] == 1:
        b + "yes" => b
    else:
        b + "no " => b
    "" => s
    if c[4] == 1:
        s + "yes" => s
    else:
        s + "no " => s
    "  " + c[1] + "   " + a + "      " + b + "      " + s ^0
"" ^0

# ---- what is safe to delete, and what anybody can tell ----

0 => dead_shims
0 => live_shims
for c in changes:
    if c[4] == 0:
        dead_shims + c[2] + c[3] => dead_shims
    else:
        live_shims + c[2] + c[3] => live_shims
"underlying conditions that have gone away : " + str(n - needed) + " of " + str(n) ^0
"  shims defending nothing : " + str(dead_shims) ^0
"  shims still defending something : " + str(live_shims) ^0
if doubled_dead > 0:
    "  of those, " + str(doubled_dead) + " incompatibilities are double-covered AND dead," ^0
    "  so 2 shims each could go and neither team can see the other's" ^0
"" ^0

# ---- what a change costs now ----

3 => hours_per_shim
"touching a field that " + str(doubled) + " of the doubled shims read" ^0
"  layers to update : " + str(doubled * 2) ^0
"  hours            : " + str(doubled * 2 * hours_per_shim) + ", at " + str(hours_per_shim) + " hours each" ^0
"  hours if each incompatibility had one owner : " + str(doubled * hours_per_shim) ^0
if doubled * 2 * hours_per_shim > doubled * hours_per_shim:
    "  the duplication costs " + str(doubled * hours_per_shim) + " hours every time" ^0
"" ^0

# ---- what one shared list would change ----
#
# Not the shims. The information about which ones exist, which is the thing
# each team wrote a shim instead of obtaining.

"if both teams could see one list of incompatibilities" ^0
"  shims that could be retired immediately : " + str(dead_shims) ^0
"  duplicates that could be halved         : " + str(doubled - doubled_dead) ^0
"  shims that must stay                    : " + str(live_shims) ^0
"  and no code changes hands, because the missing thing was the list" ^0
"" ^0

# ---- the control: one side that owns both ends ----
#
# Where the same team owns caller and callee, a change and its compensation are
# written by the same person, and the second shim never gets written.

[["s1", "date format", 1, 0, 0], ["s2", "renamed field", 1, 0, 1]] => single
0 => s_doubled
for c in single:
    if c[2] == 1:
        if c[3] == 1:
            s_doubled + 1 => s_doubled
"control - one team owning both sides of the interface" ^0
"  incompatibilities : " + str(len(single)) + ", double-covered : " + str(s_doubled) ^0
if s_doubled == 0:
    "  nothing is handled twice, because one person decides where it is handled" ^0
"" ^0

"Every shim unblocked a real team against a real break, on the day it was" ^0
"needed. Two teams defending against the same list build two lists, and the" ^0
"only thing that reconciles them is the list neither has." ^0
```

## Python (deterministic transpilation)

```python
changes = [["r1", "date format", 1, 1, 0], ["r2", "null in totals", 1, 0, 1], ["r3", "renamed field", 1, 1, 0], ["r4", "stricter enum", 0, 1, 1], ["r5", "pagination", 1, 1, 1], ["r6", "error shape", 1, 1, 0], ["r7", "id widening", 0, 1, 1], ["r8", "timezone", 1, 1, 0]]
n = len(changes)
a_shims = 0
b_shims = 0
doubled = 0
needed = 0
doubled_dead = 0
for c in changes:
    a_shims = a_shims + c[2]
    b_shims = b_shims + c[3]
    if c[2] == 1:
        if c[3] == 1:
            doubled = doubled + 1
            if c[4] == 0:
                doubled_dead = doubled_dead + 1
    if c[4] == 1:
        needed = needed + 1
print("incompatibilities : " + str(n))
print("  shims written by side A : " + str(a_shims))
print("  shims written by side B : " + str(b_shims))
print("  shims in total          : " + str(a_shims + b_shims))
if a_shims + b_shims > n:
    print("  more shims than incompatibilities, by " + str(a_shims + b_shims - n))
print("")
print("handled on both sides at once : " + str(doubled) + " of " + str(n))
if doubled > 0:
    print("  each of those is one incompatibility with two independent fixes, and")
    print("  removing either one alone leaves the behaviour correct")
print("")
print("incompatibility     side A   side B   still needed")
for c in changes:
    a = ""
    if c[2] == 1:
        a = a + "yes"
    else:
        a = a + "no "
    b = ""
    if c[3] == 1:
        b = b + "yes"
    else:
        b = b + "no "
    s = ""
    if c[4] == 1:
        s = s + "yes"
    else:
        s = s + "no "
    print("  " + c[1] + "   " + a + "      " + b + "      " + s)
print("")
dead_shims = 0
live_shims = 0
for c in changes:
    if c[4] == 0:
        dead_shims = dead_shims + c[2] + c[3]
    else:
        live_shims = live_shims + c[2] + c[3]
print("underlying conditions that have gone away : " + str(n - needed) + " of " + str(n))
print("  shims defending nothing : " + str(dead_shims))
print("  shims still defending something : " + str(live_shims))
if doubled_dead > 0:
    print("  of those, " + str(doubled_dead) + " incompatibilities are double-covered AND dead,")
    print("  so 2 shims each could go and neither team can see the other's")
print("")
hours_per_shim = 3
print("touching a field that " + str(doubled) + " of the doubled shims read")
print("  layers to update : " + str(doubled * 2))
print("  hours            : " + str(doubled * 2 * hours_per_shim) + ", at " + str(hours_per_shim) + " hours each")
print("  hours if each incompatibility had one owner : " + str(doubled * hours_per_shim))
if doubled * 2 * hours_per_shim > doubled * hours_per_shim:
    print("  the duplication costs " + str(doubled * hours_per_shim) + " hours every time")
print("")
print("if both teams could see one list of incompatibilities")
print("  shims that could be retired immediately : " + str(dead_shims))
print("  duplicates that could be halved         : " + str(doubled - doubled_dead))
print("  shims that must stay                    : " + str(live_shims))
print("  and no code changes hands, because the missing thing was the list")
print("")
single = [["s1", "date format", 1, 0, 0], ["s2", "renamed field", 1, 0, 1]]
s_doubled = 0
for c in single:
    if c[2] == 1:
        if c[3] == 1:
            s_doubled = s_doubled + 1
print("control - one team owning both sides of the interface")
print("  incompatibilities : " + str(len(single)) + ", double-covered : " + str(s_doubled))
if s_doubled == 0:
    print("  nothing is handled twice, because one person decides where it is handled")
print("")
print("Every shim unblocked a real team against a real break, on the day it was")
print("needed. Two teams defending against the same list build two lists, and the")
print("only thing that reconciles them is the list neither has.")
```

## stdout (executed)

```text
incompatibilities : 8
  shims written by side A : 6
  shims written by side B : 7
  shims in total          : 13
  more shims than incompatibilities, by 5

handled on both sides at once : 5 of 8
  each of those is one incompatibility with two independent fixes, and
  removing either one alone leaves the behaviour correct

incompatibility     side A   side B   still needed
  date format   yes      yes      no 
  null in totals   yes      no       yes
  renamed field   yes      yes      no 
  stricter enum   no       yes      yes
  pagination   yes      yes      yes
  error shape   yes      yes      no 
  id widening   no       yes      yes
  timezone   yes      yes      no 

underlying conditions that have gone away : 4 of 8
  shims defending nothing : 8
  shims still defending something : 5
  of those, 4 incompatibilities are double-covered AND dead,
  so 2 shims each could go and neither team can see the other's

touching a field that 5 of the doubled shims read
  layers to update : 10
  hours            : 30, at 3 hours each
  hours if each incompatibility had one owner : 15
  the duplication costs 15 hours every time

if both teams could see one list of incompatibilities
  shims that could be retired immediately : 8
  duplicates that could be halved         : 1
  shims that must stay                    : 5
  and no code changes hands, because the missing thing was the list

control - one team owning both sides of the interface
  incompatibilities : 2, double-covered : 0
  nothing is handled twice, because one person decides where it is handled

Every shim unblocked a real team against a real break, on the day it was
needed. Two teams defending against the same list build two lists, and the
only thing that reconciles them is the list neither has.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
