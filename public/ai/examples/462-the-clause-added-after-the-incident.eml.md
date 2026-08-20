<!-- canonical: efficientnewlanguage.org/ai/examples/462-the-clause-added-after-the-incident | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 462 — The clause added after the incident

`the_clause_added_after_the_incident.eml` - A clause was added to the validator after an incident. What else it rejects is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A clause was
# added to the validator after an incident. What else it rejects is computed
# below.
#
# The clause is a correct response to a real incident. A payload of that shape
# reached production, caused damage, and would be stopped by this test. It was
# written from the actual payload, reviewed against the actual timeline, and
# it does what it says.
#
# The rejected shape was described by the one payload anybody had. A test
# written from one example matches that example and everything else that
# happens to share the feature it keyed on, and the feature it keyed on is
# whatever the author could see in a single record.
#
# Every payload is run against the validator with and without the new clause.

# [payload, is genuinely malformed, oversized field, has the incident's marker]
[["a", 1, 1, 1], ["b", 0, 1, 1], ["c", 0, 0, 0], ["d", 1, 1, 0], ["e", 0, 1, 0], ["f", 0, 0, 1], ["g", 1, 0, 1], ["h", 0, 1, 1], ["i", 0, 0, 0], ["j", 0, 1, 0]] => payloads

len(payloads) => n

# the old validator: rejects what is genuinely malformed
def old_rule(p):
    return p[1]

# the new clause: also reject anything with an oversized field
def new_rule(p):
    if p[1] == 1:
        return 1
    if p[2] == 1:
        return 1
    return 0

0 => bad
0 => old_rejects
0 => new_rejects
0 => newly_rejected
0 => wrongly_rejected
for p in payloads:
    bad + p[1] => bad
    old_rejects + old_rule(p) => old_rejects
    new_rejects + new_rule(p) => new_rejects
    if new_rule(p) == 1:
        if old_rule(p) == 0:
            newly_rejected + 1 => newly_rejected
            if p[1] == 0:
                wrongly_rejected + 1 => wrongly_rejected

"payloads : " + str(n) + ", genuinely malformed : " + str(bad) ^0
"" ^0
"  rejected before the clause : " + str(old_rejects) ^0
"  rejected after             : " + str(new_rejects) ^0
"  newly rejected             : " + str(newly_rejected) ^0
"  of those, actually valid   : " + str(wrongly_rejected) ^0
"" ^0

if wrongly_rejected > 0:
    "the clause rejects " + str(wrongly_rejected) + " valid payloads, which is " + str(int(wrongly_rejected * 100 / n)) + "% of the traffic" ^0
    "  each has the oversized field the incident payload had, and none of them" ^0
    "  is malformed" ^0
"" ^0

# ---- did it catch the incident ----

0 => incident_caught
for p in payloads:
    if p[3] == 1:
        if p[1] == 1:
            if new_rule(p) == 1:
                incident_caught + 1 => incident_caught
0 => incident_shaped
for p in payloads:
    if p[3] == 1:
        incident_shaped + 1 => incident_shaped
"payloads carrying the incident's marker : " + str(incident_shaped) ^0
"  of those, malformed and now caught : " + str(incident_caught) ^0
if incident_caught > 0:
    "  so the clause does what it was written for" ^0
"" ^0

# ---- what the old rule already caught ----

0 => already
for p in payloads:
    if p[1] == 1:
        if p[3] == 1:
            already + 1 => already
0 => already_old
for p in payloads:
    if p[1] == 1:
        if p[3] == 1:
            if old_rule(p) == 1:
                already_old + 1 => already_old
"malformed payloads with the marker : " + str(already) ^0
"  of those, already rejected by the old rule : " + str(already_old) ^0
if already_old == already:
    "  the old rule caught every one of them, so the new clause added" ^0
    "  rejections and not protection on this traffic" ^0
"" ^0

# ---- the clause that names the defect instead of the example ----
#
# The incident was a malformed payload. The size was a property of the one
# example, and testing the size tests the example.

"the two candidate clauses" ^0
"  reject if the field is oversized : rejects " + str(new_rejects - old_rejects) + " extra, " + str(wrongly_rejected) + " of them valid" ^0
0 => marker_rule_extra
0 => marker_rule_wrong
for p in payloads:
    if p[1] == 0:
        if p[3] == 1:
            marker_rule_extra + 1 => marker_rule_extra
            marker_rule_wrong + 1 => marker_rule_wrong
"  reject if the marker is present  : rejects " + str(marker_rule_extra) + " extra, " + str(marker_rule_wrong) + " of them valid" ^0
"  both are drawn from the same single payload and neither names the defect" ^0
"" ^0

# ---- what one more example would have shown ----

0 => valid_oversized
for p in payloads:
    if p[1] == 0:
        if p[2] == 1:
            valid_oversized + 1 => valid_oversized
"valid payloads with an oversized field, in this traffic : " + str(valid_oversized) ^0
if valid_oversized > 0:
    "  any one of them, held next to the incident payload, shows that the size" ^0
    "  is shared by both and so cannot be what separates them" ^0
"" ^0

# ---- the control: a clause whose feature only the bad payloads have ----
#
# Where the added test keys on something no valid payload carries, it rejects
# exactly the malformed ones and costs nothing.

"control - a clause keyed on a feature only malformed payloads have" ^0
"  valid payloads it would reject : 0, by construction of the feature" ^0
"  the difference from the shipped clause is not the care taken, it is" ^0
"  whether the feature is shared with the valid traffic" ^0
"" ^0

"The clause stops the payload that caused the incident and was written from" ^0
"that payload. What it keys on is a property that payload shares with valid" ^0
"traffic, and one example cannot show which properties those are." ^0
```

## Python (deterministic transpilation)

```python
payloads = [["a", 1, 1, 1], ["b", 0, 1, 1], ["c", 0, 0, 0], ["d", 1, 1, 0], ["e", 0, 1, 0], ["f", 0, 0, 1], ["g", 1, 0, 1], ["h", 0, 1, 1], ["i", 0, 0, 0], ["j", 0, 1, 0]]
n = len(payloads)

def old_rule(p):
    return p[1]

def new_rule(p):
    if p[1] == 1:
        return 1
    if p[2] == 1:
        return 1
    return 0

bad = 0
old_rejects = 0
new_rejects = 0
newly_rejected = 0
wrongly_rejected = 0
for p in payloads:
    bad = bad + p[1]
    old_rejects = old_rejects + old_rule(p)
    new_rejects = new_rejects + new_rule(p)
    if new_rule(p) == 1:
        if old_rule(p) == 0:
            newly_rejected = newly_rejected + 1
            if p[1] == 0:
                wrongly_rejected = wrongly_rejected + 1
print("payloads : " + str(n) + ", genuinely malformed : " + str(bad))
print("")
print("  rejected before the clause : " + str(old_rejects))
print("  rejected after             : " + str(new_rejects))
print("  newly rejected             : " + str(newly_rejected))
print("  of those, actually valid   : " + str(wrongly_rejected))
print("")
if wrongly_rejected > 0:
    print("the clause rejects " + str(wrongly_rejected) + " valid payloads, which is " + str(int(wrongly_rejected * 100 / n)) + "% of the traffic")
    print("  each has the oversized field the incident payload had, and none of them")
    print("  is malformed")
print("")
incident_caught = 0
for p in payloads:
    if p[3] == 1:
        if p[1] == 1:
            if new_rule(p) == 1:
                incident_caught = incident_caught + 1
incident_shaped = 0
for p in payloads:
    if p[3] == 1:
        incident_shaped = incident_shaped + 1
print("payloads carrying the incident's marker : " + str(incident_shaped))
print("  of those, malformed and now caught : " + str(incident_caught))
if incident_caught > 0:
    print("  so the clause does what it was written for")
print("")
already = 0
for p in payloads:
    if p[1] == 1:
        if p[3] == 1:
            already = already + 1
already_old = 0
for p in payloads:
    if p[1] == 1:
        if p[3] == 1:
            if old_rule(p) == 1:
                already_old = already_old + 1
print("malformed payloads with the marker : " + str(already))
print("  of those, already rejected by the old rule : " + str(already_old))
if already_old == already:
    print("  the old rule caught every one of them, so the new clause added")
    print("  rejections and not protection on this traffic")
print("")
print("the two candidate clauses")
print("  reject if the field is oversized : rejects " + str(new_rejects - old_rejects) + " extra, " + str(wrongly_rejected) + " of them valid")
marker_rule_extra = 0
marker_rule_wrong = 0
for p in payloads:
    if p[1] == 0:
        if p[3] == 1:
            marker_rule_extra = marker_rule_extra + 1
            marker_rule_wrong = marker_rule_wrong + 1
print("  reject if the marker is present  : rejects " + str(marker_rule_extra) + " extra, " + str(marker_rule_wrong) + " of them valid")
print("  both are drawn from the same single payload and neither names the defect")
print("")
valid_oversized = 0
for p in payloads:
    if p[1] == 0:
        if p[2] == 1:
            valid_oversized = valid_oversized + 1
print("valid payloads with an oversized field, in this traffic : " + str(valid_oversized))
if valid_oversized > 0:
    print("  any one of them, held next to the incident payload, shows that the size")
    print("  is shared by both and so cannot be what separates them")
print("")
print("control - a clause keyed on a feature only malformed payloads have")
print("  valid payloads it would reject : 0, by construction of the feature")
print("  the difference from the shipped clause is not the care taken, it is")
print("  whether the feature is shared with the valid traffic")
print("")
print("The clause stops the payload that caused the incident and was written from")
print("that payload. What it keys on is a property that payload shares with valid")
print("traffic, and one example cannot show which properties those are.")
```

## stdout (executed)

```text
payloads : 10, genuinely malformed : 3

  rejected before the clause : 3
  rejected after             : 7
  newly rejected             : 4
  of those, actually valid   : 4

the clause rejects 4 valid payloads, which is 40% of the traffic
  each has the oversized field the incident payload had, and none of them
  is malformed

payloads carrying the incident's marker : 5
  of those, malformed and now caught : 2
  so the clause does what it was written for

malformed payloads with the marker : 2
  of those, already rejected by the old rule : 2
  the old rule caught every one of them, so the new clause added
  rejections and not protection on this traffic

the two candidate clauses
  reject if the field is oversized : rejects 4 extra, 4 of them valid
  reject if the marker is present  : rejects 3 extra, 3 of them valid
  both are drawn from the same single payload and neither names the defect

valid payloads with an oversized field, in this traffic : 4
  any one of them, held next to the incident payload, shows that the size
  is shared by both and so cannot be what separates them

control - a clause keyed on a feature only malformed payloads have
  valid payloads it would reject : 0, by construction of the feature
  the difference from the shipped clause is not the care taken, it is
  whether the feature is shared with the valid traffic

The clause stops the payload that caused the incident and was written from
that payload. What it keys on is a property that payload shares with valid
traffic, and one example cannot show which properties those are.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
