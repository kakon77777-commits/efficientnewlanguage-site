<!-- canonical: efficientnewlanguage.org/ai/examples/357-both-parties-assumed-the-other-checked-it | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 357 — Both parties assumed the other checked it — 3 unchecked, all 3 seams

`both_parties_assumed_the_other_checked_it.eml` offers every item to both parties' ownership rules and computes the four regions.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two parties, a
# clear division of labour, and a set that belongs to neither.
#
# The builder checks what is theirs. The checker checks what is theirs. Both
# lists were written by asking "what do I own", which is the right question for
# deciding what to DO and the wrong one for deciding what is COVERED - because
# an item nobody owns produces the same answer from both: not mine.
#
# Adding the second party did not create this. It moved it. Before the checker
# existed there was one list and its gaps were visible as gaps. Now there are
# two lists and the gap is the space between them, which neither list shows.
#
# Nothing is declared. Each item is offered to both parties' ownership rules and
# the four regions are computed.

# [item, touches the builder's module, is visible in behaviour, is a seam]
[["parse numbers", 1, 1, 0], ["render totals", 1, 1, 0], ["cache keys", 1, 0, 0], ["retry policy", 0, 1, 0], ["error text", 0, 1, 0], ["module boundary A", 0, 0, 1], ["module boundary B", 0, 0, 1], ["shared clock", 0, 0, 1], ["config defaults", 1, 0, 0], ["export format", 0, 1, 0]] => items

def builder_owns(it):
    # the builder checks their own module
    if it[1] == 1:
        return 1
    return 0

def checker_owns(it):
    # the checker checks what behaviour shows
    if it[2] == 1:
        return 1
    return 0

# ---- the four regions ----

[] => both_check
[] => builder_only
[] => checker_only
[] => nobody
for it in items:
    builder_owns(it) => b
    checker_owns(it) => c
    if b == 1:
        if c == 1:
            both_check + [it[0]] => both_check
        else:
            builder_only + [it[0]] => builder_only
    else:
        if c == 1:
            checker_only + [it[0]] => checker_only
        else:
            nobody + [it[0]] => nobody

"items : " + str(len(items)) ^0
"  checked by both    : " + str(len(both_check)) ^0
"  builder only       : " + str(len(builder_only)) ^0
"  checker only       : " + str(len(checker_only)) ^0
"  checked by NEITHER : " + str(len(nobody)) ^0
for n in nobody:
    "    " + n ^0
"" ^0

# ---- what the unchecked set has in common ----

0 => seams
0 => non_seams
for it in items:
    if builder_owns(it) == 0:
        if checker_owns(it) == 0:
            if it[3] == 1:
                seams + 1 => seams
            else:
                non_seams + 1 => non_seams
"the unchecked set" ^0
"  items that are seams between components : " + str(seams) ^0
"  items that are not                      : " + str(non_seams) ^0
"" ^0

0 => total_seams
for it in items:
    if it[3] == 1:
        total_seams + 1 => total_seams
"seams in the system : " + str(total_seams) ^0
"seams checked by somebody : " + str(total_seams - seams) ^0
"" ^0

# ---- the same items with only one party ----
#
# Before the checker existed the builder's list was the whole coverage claim,
# and everything outside it was visibly outside it.

0 => solo_covered
0 => solo_uncovered
for it in items:
    if builder_owns(it) == 1:
        solo_covered + 1 => solo_covered
    else:
        solo_uncovered + 1 => solo_uncovered
"with the builder alone" ^0
"  covered   : " + str(solo_covered) ^0
"  uncovered : " + str(solo_uncovered) + "  - and visibly so, because there was one list" ^0
"" ^0
"with both parties" ^0
"  covered   : " + str(len(both_check) + len(builder_only) + len(checker_only)) ^0
"  uncovered : " + str(len(nobody)) + "  - and each party's own list looks complete" ^0
"" ^0

# ---- what each party would answer if asked about an unchecked item ----

"asked about each unchecked item, both parties answer the same way" ^0
0 => consistent
for it in items:
    if builder_owns(it) == 0:
        if checker_owns(it) == 0:
            consistent + 1 => consistent
            "  " + it[0] + " : builder says not mine, checker says not mine" ^0
"  items where both answers agree, and agreement means nobody looked : " + str(consistent) ^0
"" ^0

# ---- a rule that assigns every item ----
#
# Not a better party - a rule with no gap. Measure what it changes.

def assigned(it):
    if builder_owns(it) == 1:
        return "builder"
    if checker_owns(it) == 1:
        return "checker"
    return "builder"

0 => assigned_all
0 => builder_load
0 => checker_load
for it in items:
    assigned_all + 1 => assigned_all
    if assigned(it) == "builder":
        builder_load + 1 => builder_load
    else:
        checker_load + 1 => checker_load
"under a rule where unowned items default to the builder" ^0
"  items assigned : " + str(assigned_all) + " of " + str(len(items)) ^0
"  builder load   : " + str(builder_load) ^0
"  checker load   : " + str(checker_load) ^0
"  items with no owner : " + str(len(items) - assigned_all) ^0
"" ^0

"Two parties who each answer 'is this mine' cover the union of what they own." ^0
"Nobody in that arrangement is asked 'is this covered', and the difference" ^0
"between those two questions is exactly the set neither of them names." ^0
```

## Python (deterministic transpilation)

```python
items = [["parse numbers", 1, 1, 0], ["render totals", 1, 1, 0], ["cache keys", 1, 0, 0], ["retry policy", 0, 1, 0], ["error text", 0, 1, 0], ["module boundary A", 0, 0, 1], ["module boundary B", 0, 0, 1], ["shared clock", 0, 0, 1], ["config defaults", 1, 0, 0], ["export format", 0, 1, 0]]

def builder_owns(it):
    if it[1] == 1:
        return 1
    return 0

def checker_owns(it):
    if it[2] == 1:
        return 1
    return 0

both_check = []
builder_only = []
checker_only = []
nobody = []
for it in items:
    b = builder_owns(it)
    c = checker_owns(it)
    if b == 1:
        if c == 1:
            both_check = both_check + [it[0]]
        else:
            builder_only = builder_only + [it[0]]
    elif c == 1:
        checker_only = checker_only + [it[0]]
    else:
        nobody = nobody + [it[0]]
print("items : " + str(len(items)))
print("  checked by both    : " + str(len(both_check)))
print("  builder only       : " + str(len(builder_only)))
print("  checker only       : " + str(len(checker_only)))
print("  checked by NEITHER : " + str(len(nobody)))
for n in nobody:
    print("    " + n)
print("")
seams = 0
non_seams = 0
for it in items:
    if builder_owns(it) == 0:
        if checker_owns(it) == 0:
            if it[3] == 1:
                seams = seams + 1
            else:
                non_seams = non_seams + 1
print("the unchecked set")
print("  items that are seams between components : " + str(seams))
print("  items that are not                      : " + str(non_seams))
print("")
total_seams = 0
for it in items:
    if it[3] == 1:
        total_seams = total_seams + 1
print("seams in the system : " + str(total_seams))
print("seams checked by somebody : " + str(total_seams - seams))
print("")
solo_covered = 0
solo_uncovered = 0
for it in items:
    if builder_owns(it) == 1:
        solo_covered = solo_covered + 1
    else:
        solo_uncovered = solo_uncovered + 1
print("with the builder alone")
print("  covered   : " + str(solo_covered))
print("  uncovered : " + str(solo_uncovered) + "  - and visibly so, because there was one list")
print("")
print("with both parties")
print("  covered   : " + str(len(both_check) + len(builder_only) + len(checker_only)))
print("  uncovered : " + str(len(nobody)) + "  - and each party's own list looks complete")
print("")
print("asked about each unchecked item, both parties answer the same way")
consistent = 0
for it in items:
    if builder_owns(it) == 0:
        if checker_owns(it) == 0:
            consistent = consistent + 1
            print("  " + it[0] + " : builder says not mine, checker says not mine")
print("  items where both answers agree, and agreement means nobody looked : " + str(consistent))
print("")

def assigned(it):
    if builder_owns(it) == 1:
        return "builder"
    if checker_owns(it) == 1:
        return "checker"
    return "builder"

assigned_all = 0
builder_load = 0
checker_load = 0
for it in items:
    assigned_all = assigned_all + 1
    if assigned(it) == "builder":
        builder_load = builder_load + 1
    else:
        checker_load = checker_load + 1
print("under a rule where unowned items default to the builder")
print("  items assigned : " + str(assigned_all) + " of " + str(len(items)))
print("  builder load   : " + str(builder_load))
print("  checker load   : " + str(checker_load))
print("  items with no owner : " + str(len(items) - assigned_all))
print("")
print("Two parties who each answer 'is this mine' cover the union of what they own.")
print("Nobody in that arrangement is asked 'is this covered', and the difference")
print("between those two questions is exactly the set neither of them names.")
```

## stdout (executed)

```text
items : 10
  checked by both    : 2
  builder only       : 2
  checker only       : 3
  checked by NEITHER : 3
    module boundary A
    module boundary B
    shared clock

the unchecked set
  items that are seams between components : 3
  items that are not                      : 0

seams in the system : 3
seams checked by somebody : 0

with the builder alone
  covered   : 4
  uncovered : 6  - and visibly so, because there was one list

with both parties
  covered   : 7
  uncovered : 3  - and each party's own list looks complete

asked about each unchecked item, both parties answer the same way
  module boundary A : builder says not mine, checker says not mine
  module boundary B : builder says not mine, checker says not mine
  shared clock : builder says not mine, checker says not mine
  items where both answers agree, and agreement means nobody looked : 3

under a rule where unowned items default to the builder
  items assigned : 10 of 10
  builder load   : 7
  checker load   : 3
  items with no owner : 0

Two parties who each answer 'is this mine' cover the union of what they own.
Nobody in that arrangement is asked 'is this covered', and the difference
between those two questions is exactly the set neither of them names.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
