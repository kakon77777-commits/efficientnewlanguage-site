<!-- canonical: efficientnewlanguage.org/ai/examples/353-the-exception-outlived-its-reason | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 353 — The exception outlived its reason — 5 of 6 rows removed for a condition that is false

`the_exception_outlived_its_reason.eml` evaluates the stated reason for an exclusion against the rows the exclusion currently removes.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An exclusion with
# a reason, and the reason stopped being true.
#
# Supplier 7's rows were excluded from the report because a migration had
# corrupted them. That was correct, it was documented, and the documentation
# even names the condition: rows whose checksum does not match. What it does
# not do is CHECK that condition at read time - the exclusion is by supplier id,
# because that was the cheap way to express it on the day.
#
# The condition can still be evaluated. The program evaluates it, on the rows
# the exclusion currently removes, and reports how many of them the stated
# reason still covers.
#
# Nothing is declared: the exclusion, the reason, and the report all run over
# the same rows.

def checksum_ok(row):
    # row = [supplier, amount, recorded_checksum]
    row[1] % 7 => computed
    if computed == row[2]:
        return 1
    return 0

def excluded_by_rule(row):
    if row[0] == 7:
        return 1
    return 0

def excluded_by_reason(row):
    if checksum_ok(row) == 0:
        return 1
    return 0

[[7, 14, 0], [3, 20, 6], [7, 22, 1], [9, 15, 1], [7, 30, 2], [4, 11, 4], [7, 40, 5], [3, 18, 4], [7, 8, 1], [2, 25, 4], [5, 13, 2], [7, 9, 3]] => rows

# ---- what the rule removes, and what the reason would ----

0 => by_rule
0 => by_reason
0 => both
0 => rule_only
0 => reason_only
for r in rows:
    excluded_by_rule(r) => a
    excluded_by_reason(r) => b
    if a == 1:
        by_rule + 1 => by_rule
    if b == 1:
        by_reason + 1 => by_reason
    if a == 1:
        if b == 1:
            both + 1 => both
        else:
            rule_only + 1 => rule_only
    else:
        if b == 1:
            reason_only + 1 => reason_only

"rows in the source            : " + str(len(rows)) ^0
"excluded by the rule as written : " + str(by_rule) ^0
"excluded by the stated reason   : " + str(by_reason) ^0
"  both agree on                 : " + str(both) ^0
"  rule removes, reason does not : " + str(rule_only) ^0
"  reason removes, rule does not : " + str(reason_only) ^0
"" ^0

# ---- the rows the rule removes, one by one ----

"rows removed by supplier id" ^0
for r in rows:
    if excluded_by_rule(r) == 1:
        if excluded_by_reason(r) == 1:
            "  supplier " + str(r[0]) + " amount " + str(r[1]) + " : checksum bad - the reason still holds" ^0
        else:
            "  supplier " + str(r[0]) + " amount " + str(r[1]) + " : checksum fine - removed for a reason that expired" ^0
"" ^0

"rows the reason would remove and the rule keeps" ^0
0 => missed
for r in rows:
    if excluded_by_rule(r) == 0:
        if excluded_by_reason(r) == 1:
            missed + 1 => missed
            "  supplier " + str(r[0]) + " amount " + str(r[1]) + " : checksum bad, still in the report" ^0
"  total: " + str(missed) ^0
"" ^0

# ---- what the report says under each ----

def total_under(rows, mode):
    0 => t
    for r in rows:
        0 => drop
        if mode == "rule":
            excluded_by_rule(r) => drop
        if mode == "reason":
            excluded_by_reason(r) => drop
        if drop == 0:
            t + r[1] => t
    return t

0 => everything
for r in rows:
    everything + r[1] => everything

"reported total" ^0
"  with no exclusion at all : " + str(everything) ^0
"  under the rule as written : " + str(total_under(rows, "rule")) ^0
"  under the stated reason   : " + str(total_under(rows, "reason")) ^0
"" ^0

# ---- the rule is not merely wrong, it is wrong in both directions ----

if rule_only > 0:
    if reason_only > 0:
        "The rule both removes rows the reason does not cover and keeps rows it" ^0
        "does. It is not a conservative approximation of the reason - it is a" ^0
        "different rule that happened to agree on the day it was written." ^0
        "" ^0

"An exclusion whose reason is stated but not EVALUATED cannot expire. It has" ^0
"no condition to become false, only a note explaining why somebody once" ^0
"thought it was a good idea." ^0
```

## Python (deterministic transpilation)

```python
def checksum_ok(row):
    computed = row[1] % 7
    if computed == row[2]:
        return 1
    return 0

def excluded_by_rule(row):
    if row[0] == 7:
        return 1
    return 0

def excluded_by_reason(row):
    if checksum_ok(row) == 0:
        return 1
    return 0

rows = [[7, 14, 0], [3, 20, 6], [7, 22, 1], [9, 15, 1], [7, 30, 2], [4, 11, 4], [7, 40, 5], [3, 18, 4], [7, 8, 1], [2, 25, 4], [5, 13, 2], [7, 9, 3]]
by_rule = 0
by_reason = 0
both = 0
rule_only = 0
reason_only = 0
for r in rows:
    a = excluded_by_rule(r)
    b = excluded_by_reason(r)
    if a == 1:
        by_rule = by_rule + 1
    if b == 1:
        by_reason = by_reason + 1
    if a == 1:
        if b == 1:
            both = both + 1
        else:
            rule_only = rule_only + 1
    elif b == 1:
        reason_only = reason_only + 1
print("rows in the source            : " + str(len(rows)))
print("excluded by the rule as written : " + str(by_rule))
print("excluded by the stated reason   : " + str(by_reason))
print("  both agree on                 : " + str(both))
print("  rule removes, reason does not : " + str(rule_only))
print("  reason removes, rule does not : " + str(reason_only))
print("")
print("rows removed by supplier id")
for r in rows:
    if excluded_by_rule(r) == 1:
        if excluded_by_reason(r) == 1:
            print("  supplier " + str(r[0]) + " amount " + str(r[1]) + " : checksum bad - the reason still holds")
        else:
            print("  supplier " + str(r[0]) + " amount " + str(r[1]) + " : checksum fine - removed for a reason that expired")
print("")
print("rows the reason would remove and the rule keeps")
missed = 0
for r in rows:
    if excluded_by_rule(r) == 0:
        if excluded_by_reason(r) == 1:
            missed = missed + 1
            print("  supplier " + str(r[0]) + " amount " + str(r[1]) + " : checksum bad, still in the report")
print("  total: " + str(missed))
print("")

def total_under(rows, mode):
    t = 0
    for r in rows:
        drop = 0
        if mode == "rule":
            drop = excluded_by_rule(r)
        if mode == "reason":
            drop = excluded_by_reason(r)
        if drop == 0:
            t = t + r[1]
    return t

everything = 0
for r in rows:
    everything = everything + r[1]
print("reported total")
print("  with no exclusion at all : " + str(everything))
print("  under the rule as written : " + str(total_under(rows, "rule")))
print("  under the stated reason   : " + str(total_under(rows, "reason")))
print("")
if rule_only > 0:
    if reason_only > 0:
        print("The rule both removes rows the reason does not cover and keeps rows it")
        print("does. It is not a conservative approximation of the reason - it is a")
        print("different rule that happened to agree on the day it was written.")
        print("")
print("An exclusion whose reason is stated but not EVALUATED cannot expire. It has")
print("no condition to become false, only a note explaining why somebody once")
print("thought it was a good idea.")
```

## stdout (executed)

```text
rows in the source            : 12
excluded by the rule as written : 6
excluded by the stated reason   : 2
  both agree on                 : 1
  rule removes, reason does not : 5
  reason removes, rule does not : 1

rows removed by supplier id
  supplier 7 amount 14 : checksum fine - removed for a reason that expired
  supplier 7 amount 22 : checksum fine - removed for a reason that expired
  supplier 7 amount 30 : checksum fine - removed for a reason that expired
  supplier 7 amount 40 : checksum fine - removed for a reason that expired
  supplier 7 amount 8 : checksum fine - removed for a reason that expired
  supplier 7 amount 9 : checksum bad - the reason still holds

rows the reason would remove and the rule keeps
  supplier 5 amount 13 : checksum bad, still in the report
  total: 1

reported total
  with no exclusion at all : 225
  under the rule as written : 102
  under the stated reason   : 203

The rule both removes rows the reason does not cover and keeps rows it
does. It is not a conservative approximation of the reason - it is a
different rule that happened to agree on the day it was written.

An exclusion whose reason is stated but not EVALUATED cannot expire. It has
no condition to become false, only a note explaining why somebody once
thought it was a good idea.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
