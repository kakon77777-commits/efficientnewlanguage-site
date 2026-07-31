<!-- canonical: efficientnewlanguage.org/ai/examples/174-inventory-diff-report | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 174 — Difference is directional

`inventory_diff_report.eml` — reconciles two stock snapshots.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Comparing two
# stock snapshots. Difference in BOTH directions answers two different
# questions, and reporting only one of them is a classic reconciliation bug:
#
#   now - before   arrived since the last count
#   before - now   disappeared since the last count
#
# Difference is NOT symmetric, so a single call cannot tell you both.
#
# The report never prints a set directly, and that restraint is the second
# lesson. CPython renders a set in HASH order; this interpreter stores
# insertion order, so `str(a_set)` would produce a different line here than in
# the program's own Python projection - silently, for sets of strings. Printing
# a multi-element set therefore defers rather than guessing. To report one, ask
# it questions in an order the PROGRAM chooses: iterate a list you control and
# test membership.

def added(before, now):
    return now - before

def removed(before, now):
    return before - now

def report(label, members, subject):
    "" => shown
    0 => n
    for m in members:
        if m in subject:
            n + 1 => n
            if shown == "":
                m => shown
            else:
                shown + ", " + m => shown
    if shown == "":
        "(none)" => shown
    return label + " (" + str(n) + "): " + shown

# The canonical order the report is written in - chosen here, not by any hash.
["bolts", "clips", "nuts", "rivets", "screws", "washers"] => catalogue

{"bolts", "washers", "nuts", "rivets"} => monday
{"bolts", "nuts", "screws", "clips"} => friday

("Monday: " + str(len(monday)) + " lines, Friday: " + str(len(friday)) + " lines")^0
""^0

report("Arrived ", catalogue, added(monday, friday))^0
report("Departed", catalogue, removed(monday, friday))^0
report("Retained", catalogue, monday - removed(monday, friday))^0
""^0

"Difference is directional - two different questions" => h
h^0
("  in friday but not monday: " + str(len(friday - monday)))^0
("  in monday but not friday: " + str(len(monday - friday)))^0
("  same operator, opposite operands, unrelated answers")^0
""^0

"Sanity checks the report must satisfy" => h2
h2^0
monday - removed(monday, friday) => kept
("  retained + departed == monday's count: " + str(len(kept) + len(removed(monday, friday)) == len(monday)))^0
("  retained + arrived  == friday's count: " + str(len(kept) + len(added(monday, friday)) == len(friday)))^0
("  nothing is both arrived and departed: " + str(len(added(monday, friday) - friday) == 0))^0
""^0

# An empty difference is safe to print: there is only one way to render it.
("monday - monday = " + str(monday - monday) + "   (an empty set prints as set(), not {})")^0
("Is monday a subset of itself? " + str(monday <= monday))^0
("Is it a PROPER subset of itself? " + str(monday < monday))^0
```

## Python (deterministic transpilation)

```python
def added(before, now):
    return now - before

def removed(before, now):
    return before - now

def report(label, members, subject):
    shown = ""
    n = 0
    for m in members:
        if m in subject:
            n = n + 1
            if shown == "":
                shown = m
            else:
                shown = shown + ", " + m
    if shown == "":
        shown = "(none)"
    return label + " (" + str(n) + "): " + shown

catalogue = ["bolts", "clips", "nuts", "rivets", "screws", "washers"]
monday = {"bolts", "washers", "nuts", "rivets"}
friday = {"bolts", "nuts", "screws", "clips"}
print("Monday: " + str(len(monday)) + " lines, Friday: " + str(len(friday)) + " lines")
print("")
print(report("Arrived ", catalogue, added(monday, friday)))
print(report("Departed", catalogue, removed(monday, friday)))
print(report("Retained", catalogue, monday - removed(monday, friday)))
print("")
h = "Difference is directional - two different questions"
print(h)
print("  in friday but not monday: " + str(len(friday - monday)))
print("  in monday but not friday: " + str(len(monday - friday)))
print("  same operator, opposite operands, unrelated answers")
print("")
h2 = "Sanity checks the report must satisfy"
print(h2)
kept = monday - removed(monday, friday)
print("  retained + departed == monday's count: " + str(len(kept) + len(removed(monday, friday)) == len(monday)))
print("  retained + arrived  == friday's count: " + str(len(kept) + len(added(monday, friday)) == len(friday)))
print("  nothing is both arrived and departed: " + str(len(added(monday, friday) - friday) == 0))
print("")
print("monday - monday = " + str(monday - monday) + "   (an empty set prints as set(), not {})")
print("Is monday a subset of itself? " + str(monday <= monday))
print("Is it a PROPER subset of itself? " + str(monday < monday))
```

## stdout (executed)

```text
Monday: 4 lines, Friday: 4 lines

Arrived  (2): clips, screws
Departed (2): rivets, washers
Retained (2): bolts, nuts

Difference is directional - two different questions
  in friday but not monday: 2
  in monday but not friday: 2
  same operator, opposite operands, unrelated answers

Sanity checks the report must satisfy
  retained + departed == monday's count: True
  retained + arrived  == friday's count: True
  nothing is both arrived and departed: True

monday - monday = set()   (an empty set prints as set(), not {})
Is monday a subset of itself? True
Is it a PROPER subset of itself? False
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
