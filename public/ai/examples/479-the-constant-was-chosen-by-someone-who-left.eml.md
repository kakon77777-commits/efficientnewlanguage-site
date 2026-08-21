<!-- canonical: efficientnewlanguage.org/ai/examples/479-the-constant-was-chosen-by-someone-who-left | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 479 — The constant was chosen by someone who left

`the_constant_was_chosen_by_someone_who_left.eml` - The constant is 4096 and nobody currently on the team knows why. What depends on it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The constant is
# 4096 and nobody currently on the team knows why. What depends on it is
# computed below.
#
# Leaving it alone is the correct default. It has worked for six years, the
# person who chose it was competent, and a number that has survived that long in
# production has been tested by more traffic than any experiment anybody could
# run this quarter.
#
# "It works" is evidence about the current value and not about the reasoning.
# Whether the constraint that produced it still exists is a separate question,
# and it is one the number cannot answer, because a constant that is right for
# a reason and a constant that is right by accident look identical.
#
# The dependents are enumerated and the original constraint is checked.

4096 => value
6 => years_in_place

# [what depends on it, would break if it changed, was it derived from the constant or the other way round]
[["buffer allocation", 1, "derived from it"], ["page size in the on-disk format", 1, "derived from it"], ["the batch size in the importer", 1, "copied it"], ["a test fixture", 0, "copied it"], ["the retry chunk size", 1, "copied it"], ["a comment in the protocol doc", 0, "describes it"]] => dependents

len(dependents) => n
0 => breaking
0 => copied
for d in dependents:
    breaking + d[1] => breaking
    if d[2] == "copied it":
        copied + 1 => copied

"the constant : " + str(value) + ", in place " + str(years_in_place) + " years" ^0
"places that reference it : " + str(n) ^0
"  would break if it changed : " + str(breaking) ^0
"  that copied the number rather than importing it : " + str(copied) ^0
"" ^0

"dependent                        breaks   relationship" ^0
for d in dependents:
    "" => b
    if d[1] == 1:
        b + "yes" => b
    else:
        b + "no " => b
    "  " + d[0] + "   " + b + "      " + d[2] ^0
"" ^0

# ---- the constraint it was chosen for ----
#
# The original reason is recoverable: a disk page was 4096 bytes on the
# hardware of the time. Whether that is still the binding constraint is a
# question about today's hardware, not about the number.

[["the disk page on the 2020 hardware", 4096, 0], ["the disk page on the current hardware", 16384, 1], ["the network MTU path", 1500, 1], ["the allocator bucket", 8192, 1]] => constraints

"candidate constraints, and whether they still hold" ^0
0 => still_true
0 => matching
for c in constraints:
    "" => mark
    if c[2] == 1:
        mark + "current" => mark
        still_true + 1 => still_true
    else:
        mark + "gone   " => mark
    if c[1] == value:
        matching + 1 => matching
    "  " + c[0] + " : " + str(c[1]) + "  " + mark ^0
"" ^0
"constraints that still hold : " + str(still_true) + " of " + str(len(constraints)) ^0
"constraints whose value equals the constant : " + str(matching) ^0
if matching > 0:
    if still_true > 0:
        0 => matching_and_current
        for c in constraints:
            if c[1] == value:
                if c[2] == 1:
                    matching_and_current + 1 => matching_and_current
        "constraints that both hold today AND equal the constant : " + str(matching_and_current) ^0
        if matching_and_current == 0:
            "  none - the only constraint the number matches is the one that is gone" ^0
"" ^0

# ---- what "it works" establishes ----

"what six years of working establishes" ^0
"  the value does not break anything today : yes" ^0
"  the value is optimal today              : not tested" ^0
"  the reason for the value still holds    : not tested" ^0
"  a number that is right by accident produces exactly this evidence" ^0
"" ^0

# ---- what it costs to find out ----

"measuring it instead of reasoning about it" ^0
"  candidates to try : the " + str(still_true) + " constraints that still hold" ^0
"  what a benchmark answers : which value is fastest on this hardware" ^0
"  what it does not answer  : which of the " + str(copied) + " copies would also have to move" ^0
"  the copies are the expensive part, and they are expensive because the" ^0
"  number was copied rather than imported" ^0
"" ^0

# ---- the control: a constant with its reason attached ----
#
# Where the constant is derived in the code from the thing that constrains it,
# the reason cannot be lost and the value follows the hardware.

"control - the same constant written as a derivation" ^0
"  page_size = query_the_filesystem()" ^0
"  places that would need updating when the hardware changes : 0" ^0
"  what is lost : nothing, on this dependent set" ^0
"  what is gained : the question this case is about cannot be asked, because" ^0
"  the reason is in the expression" ^0
"" ^0

"The number has survived six years of production and the person who chose it" ^0
"knew the hardware. Working is evidence about the value; the constraint it" ^0
"was derived from is a separate fact, and it is the one that expired." ^0
```

## Python (deterministic transpilation)

```python
value = 4096
years_in_place = 6
dependents = [["buffer allocation", 1, "derived from it"], ["page size in the on-disk format", 1, "derived from it"], ["the batch size in the importer", 1, "copied it"], ["a test fixture", 0, "copied it"], ["the retry chunk size", 1, "copied it"], ["a comment in the protocol doc", 0, "describes it"]]
n = len(dependents)
breaking = 0
copied = 0
for d in dependents:
    breaking = breaking + d[1]
    if d[2] == "copied it":
        copied = copied + 1
print("the constant : " + str(value) + ", in place " + str(years_in_place) + " years")
print("places that reference it : " + str(n))
print("  would break if it changed : " + str(breaking))
print("  that copied the number rather than importing it : " + str(copied))
print("")
print("dependent                        breaks   relationship")
for d in dependents:
    b = ""
    if d[1] == 1:
        b = b + "yes"
    else:
        b = b + "no "
    print("  " + d[0] + "   " + b + "      " + d[2])
print("")
constraints = [["the disk page on the 2020 hardware", 4096, 0], ["the disk page on the current hardware", 16384, 1], ["the network MTU path", 1500, 1], ["the allocator bucket", 8192, 1]]
print("candidate constraints, and whether they still hold")
still_true = 0
matching = 0
for c in constraints:
    mark = ""
    if c[2] == 1:
        mark = mark + "current"
        still_true = still_true + 1
    else:
        mark = mark + "gone   "
    if c[1] == value:
        matching = matching + 1
    print("  " + c[0] + " : " + str(c[1]) + "  " + mark)
print("")
print("constraints that still hold : " + str(still_true) + " of " + str(len(constraints)))
print("constraints whose value equals the constant : " + str(matching))
if matching > 0:
    if still_true > 0:
        matching_and_current = 0
        for c in constraints:
            if c[1] == value:
                if c[2] == 1:
                    matching_and_current = matching_and_current + 1
        print("constraints that both hold today AND equal the constant : " + str(matching_and_current))
        if matching_and_current == 0:
            print("  none - the only constraint the number matches is the one that is gone")
print("")
print("what six years of working establishes")
print("  the value does not break anything today : yes")
print("  the value is optimal today              : not tested")
print("  the reason for the value still holds    : not tested")
print("  a number that is right by accident produces exactly this evidence")
print("")
print("measuring it instead of reasoning about it")
print("  candidates to try : the " + str(still_true) + " constraints that still hold")
print("  what a benchmark answers : which value is fastest on this hardware")
print("  what it does not answer  : which of the " + str(copied) + " copies would also have to move")
print("  the copies are the expensive part, and they are expensive because the")
print("  number was copied rather than imported")
print("")
print("control - the same constant written as a derivation")
print("  page_size = query_the_filesystem()")
print("  places that would need updating when the hardware changes : 0")
print("  what is lost : nothing, on this dependent set")
print("  what is gained : the question this case is about cannot be asked, because")
print("  the reason is in the expression")
print("")
print("The number has survived six years of production and the person who chose it")
print("knew the hardware. Working is evidence about the value; the constraint it")
print("was derived from is a separate fact, and it is the one that expired.")
```

## stdout (executed)

```text
the constant : 4096, in place 6 years
places that reference it : 6
  would break if it changed : 4
  that copied the number rather than importing it : 3

dependent                        breaks   relationship
  buffer allocation   yes      derived from it
  page size in the on-disk format   yes      derived from it
  the batch size in the importer   yes      copied it
  a test fixture   no       copied it
  the retry chunk size   yes      copied it
  a comment in the protocol doc   no       describes it

candidate constraints, and whether they still hold
  the disk page on the 2020 hardware : 4096  gone   
  the disk page on the current hardware : 16384  current
  the network MTU path : 1500  current
  the allocator bucket : 8192  current

constraints that still hold : 3 of 4
constraints whose value equals the constant : 1
constraints that both hold today AND equal the constant : 0
  none - the only constraint the number matches is the one that is gone

what six years of working establishes
  the value does not break anything today : yes
  the value is optimal today              : not tested
  the reason for the value still holds    : not tested
  a number that is right by accident produces exactly this evidence

measuring it instead of reasoning about it
  candidates to try : the 3 constraints that still hold
  what a benchmark answers : which value is fastest on this hardware
  what it does not answer  : which of the 3 copies would also have to move
  the copies are the expensive part, and they are expensive because the
  number was copied rather than imported

control - the same constant written as a derivation
  page_size = query_the_filesystem()
  places that would need updating when the hardware changes : 0
  what is lost : nothing, on this dependent set
  what is gained : the question this case is about cannot be asked, because
  the reason is in the expression

The number has survived six years of production and the person who chose it
knew the hardware. Working is evidence about the value; the constraint it
was derived from is a separate fact, and it is the one that expired.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
