<!-- canonical: efficientnewlanguage.org/ai/examples/495-the-breach-was-priced-by-who-found-it | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 495 — The breach was priced by who found it

`the_breach_was_priced_by_who_found_it.eml` - Eight incidents of the same rule being broken. What each one cost the team that broke it is computed below, alongside what it cost the company.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Eight incidents of
# the same rule being broken. What each one cost the team that broke it is
# computed below, alongside what it cost the company.
#
# Responding proportionately to who is affected is right. A breach a customer
# noticed needs a customer response; one an internal linter caught needs a
# commit. Scaling the response to the audience is not favouritism, it is how
# incident response is supposed to work.
#
# The consequence for the team, though, ends up scaled to the audience rather
# than to the breach. Two identical violations can differ by an order of
# magnitude in what happens next, and the difference is decided by who happened
# to notice.
#
# Severity and response are counted separately.

# [incident, real severity 1-5, who found it, hours of response, went to a review]
[["v1", 4, "a customer", 40, 1], ["v2", 4, "the linter", 1, 0], ["v3", 2, "a customer", 32, 1], ["v4", 5, "the linter", 2, 0], ["v5", 3, "an auditor", 24, 1], ["v6", 5, "an engineer", 3, 0], ["v7", 1, "a customer", 28, 1], ["v8", 4, "an engineer", 2, 0]] => breaches

len(breaches) => n

"incidents of the same rule : " + str(n) ^0
"" ^0
"incident   severity   found by      response hours   review" ^0
0 => total_hours
for b in breaches:
    total_hours + b[3] => total_hours
    "" => rev
    if b[4] == 1:
        rev + "yes" => rev
    else:
        rev + "no " => rev
    "  " + b[0] + "         " + str(b[1]) + "          " + b[2] + "   " + str(b[3]) + "                " + rev ^0
"" ^0

# ---- response against severity ----

"response hours, grouped by real severity" ^0
for s in [1:5]:
    0 => c
    0 => h
    for b in breaches:
        if b[1] == s:
            c + 1 => c
            h + b[3] => h
    if c > 0:
        "  severity " + str(s) + " : " + str(c) + " incident(s), " + str(h) + " hours" ^0
"" ^0

"response hours, grouped by who found it" ^0
[] => finders
for b in breaches:
    if not (b[2] in finders):
        finders + [b[2]] => finders
for f in finders:
    0 => c
    0 => h
    0 => sev
    for b in breaches:
        if b[2] == f:
            c + 1 => c
            h + b[3] => h
            sev + b[1] => sev
    "  " + f + " : " + str(c) + " incident(s), " + str(h) + " hours, mean severity " + str(int(sev * 10 / c)) + " tenths" ^0
"" ^0

# ---- the pair that makes it concrete ----

"the sharpest pair" ^0
for b in breaches:
    if b[1] == 5:
        "  " + b[0] + " : severity " + str(b[1]) + ", found by " + b[2] + ", " + str(b[3]) + " hours" ^0
for b in breaches:
    if b[1] == 1:
        "  " + b[0] + " : severity " + str(b[1]) + ", found by " + b[2] + ", " + str(b[3]) + " hours" ^0
0 => worst_sev_hours
0 => least_sev_hours
for b in breaches:
    if b[1] == 5:
        if b[3] > worst_sev_hours:
            b[3] => worst_sev_hours
    if b[1] == 1:
        least_sev_hours + b[3] => least_sev_hours
if least_sev_hours > worst_sev_hours:
    "  the least severe breach cost " + str(int(least_sev_hours / worst_sev_hours)) + " times the hours of the most severe one" ^0
"" ^0

# ---- what goes to a review ----

0 => reviewed
0 => reviewed_sev
0 => unreviewed_sev
0 => unreviewed
for b in breaches:
    if b[4] == 1:
        reviewed + 1 => reviewed
        reviewed_sev + b[1] => reviewed_sev
    else:
        unreviewed + 1 => unreviewed
        unreviewed_sev + b[1] => unreviewed_sev
"incidents that reached a review : " + str(reviewed) + " of " + str(n) ^0
if reviewed > 0:
    "  their mean severity   : " + str(int(reviewed_sev * 10 / reviewed)) + " tenths" ^0
if unreviewed > 0:
    "  mean severity of the rest : " + str(int(unreviewed_sev * 10 / unreviewed)) + " tenths" ^0
if unreviewed_sev * reviewed > reviewed_sev * unreviewed:
    "  the incidents that did NOT reach a review are the more severe group" ^0
"" ^0

# ---- what a team learns from this ----

"what the pattern teaches a team that broke the rule" ^0
"  severity of the breach     : does not predict the consequence" ^0
"  who noticed                : does" ^0
"  the available action that follows is to reduce who notices, which is not" ^0
"  the same as reducing breaches" ^0
"" ^0

# ---- what would make the two agree ----

"pricing the response on severity instead" ^0
0 => sev_total
for b in breaches:
    sev_total + b[1] => sev_total
"  total severity across all " + str(n) + " : " + str(sev_total) ^0
"  hours available           : " + str(total_hours) ^0
"  hours per severity point  : " + str(int(total_hours / sev_total)) ^0
"  the same total effort, allocated to the breaches rather than to the" ^0
"  audiences, and it needs no new budget" ^0
"" ^0

# ---- the control: a rule whose breaches are all found the same way ----
#
# Where every violation is caught by the same check, who found it is constant
# and cannot vary the response.

[["w1", 4, "the linter", 2, 0], ["w2", 2, "the linter", 1, 0], ["w3", 5, "the linter", 3, 0]] => uniform
"control - a rule where every breach is caught by the same check" ^0
"  distinct finders : 1" ^0
"  response hours, by severity : " ^0
for b in uniform:
    "    severity " + str(b[1]) + " : " + str(b[3]) + " hours" ^0
"  the ordering follows severity here, because the only thing left to vary" ^0
"  is the breach" ^0
"" ^0

"Matching the response to who is affected is how incident response works and" ^0
"none of these responses was wrong for its audience. The consequence a team" ^0
"faces is therefore a fact about who was watching." ^0
```

## Python (deterministic transpilation)

```python
breaches = [["v1", 4, "a customer", 40, 1], ["v2", 4, "the linter", 1, 0], ["v3", 2, "a customer", 32, 1], ["v4", 5, "the linter", 2, 0], ["v5", 3, "an auditor", 24, 1], ["v6", 5, "an engineer", 3, 0], ["v7", 1, "a customer", 28, 1], ["v8", 4, "an engineer", 2, 0]]
n = len(breaches)
print("incidents of the same rule : " + str(n))
print("")
print("incident   severity   found by      response hours   review")
total_hours = 0
for b in breaches:
    total_hours = total_hours + b[3]
    rev = ""
    if b[4] == 1:
        rev = rev + "yes"
    else:
        rev = rev + "no "
    print("  " + b[0] + "         " + str(b[1]) + "          " + b[2] + "   " + str(b[3]) + "                " + rev)
print("")
print("response hours, grouped by real severity")
for s in range(1, 6):
    c = 0
    h = 0
    for b in breaches:
        if b[1] == s:
            c = c + 1
            h = h + b[3]
    if c > 0:
        print("  severity " + str(s) + " : " + str(c) + " incident(s), " + str(h) + " hours")
print("")
print("response hours, grouped by who found it")
finders = []
for b in breaches:
    if not b[2] in finders:
        finders = finders + [b[2]]
for f in finders:
    c = 0
    h = 0
    sev = 0
    for b in breaches:
        if b[2] == f:
            c = c + 1
            h = h + b[3]
            sev = sev + b[1]
    print("  " + f + " : " + str(c) + " incident(s), " + str(h) + " hours, mean severity " + str(int(sev * 10 / c)) + " tenths")
print("")
print("the sharpest pair")
for b in breaches:
    if b[1] == 5:
        print("  " + b[0] + " : severity " + str(b[1]) + ", found by " + b[2] + ", " + str(b[3]) + " hours")
for b in breaches:
    if b[1] == 1:
        print("  " + b[0] + " : severity " + str(b[1]) + ", found by " + b[2] + ", " + str(b[3]) + " hours")
worst_sev_hours = 0
least_sev_hours = 0
for b in breaches:
    if b[1] == 5:
        if b[3] > worst_sev_hours:
            worst_sev_hours = b[3]
    if b[1] == 1:
        least_sev_hours = least_sev_hours + b[3]
if least_sev_hours > worst_sev_hours:
    print("  the least severe breach cost " + str(int(least_sev_hours / worst_sev_hours)) + " times the hours of the most severe one")
print("")
reviewed = 0
reviewed_sev = 0
unreviewed_sev = 0
unreviewed = 0
for b in breaches:
    if b[4] == 1:
        reviewed = reviewed + 1
        reviewed_sev = reviewed_sev + b[1]
    else:
        unreviewed = unreviewed + 1
        unreviewed_sev = unreviewed_sev + b[1]
print("incidents that reached a review : " + str(reviewed) + " of " + str(n))
if reviewed > 0:
    print("  their mean severity   : " + str(int(reviewed_sev * 10 / reviewed)) + " tenths")
if unreviewed > 0:
    print("  mean severity of the rest : " + str(int(unreviewed_sev * 10 / unreviewed)) + " tenths")
if unreviewed_sev * reviewed > reviewed_sev * unreviewed:
    print("  the incidents that did NOT reach a review are the more severe group")
print("")
print("what the pattern teaches a team that broke the rule")
print("  severity of the breach     : does not predict the consequence")
print("  who noticed                : does")
print("  the available action that follows is to reduce who notices, which is not")
print("  the same as reducing breaches")
print("")
print("pricing the response on severity instead")
sev_total = 0
for b in breaches:
    sev_total = sev_total + b[1]
print("  total severity across all " + str(n) + " : " + str(sev_total))
print("  hours available           : " + str(total_hours))
print("  hours per severity point  : " + str(int(total_hours / sev_total)))
print("  the same total effort, allocated to the breaches rather than to the")
print("  audiences, and it needs no new budget")
print("")
uniform = [["w1", 4, "the linter", 2, 0], ["w2", 2, "the linter", 1, 0], ["w3", 5, "the linter", 3, 0]]
print("control - a rule where every breach is caught by the same check")
print("  distinct finders : 1")
print("  response hours, by severity : ")
for b in uniform:
    print("    severity " + str(b[1]) + " : " + str(b[3]) + " hours")
print("  the ordering follows severity here, because the only thing left to vary")
print("  is the breach")
print("")
print("Matching the response to who is affected is how incident response works and")
print("none of these responses was wrong for its audience. The consequence a team")
print("faces is therefore a fact about who was watching.")
```

## stdout (executed)

```text
incidents of the same rule : 8

incident   severity   found by      response hours   review
  v1         4          a customer   40                yes
  v2         4          the linter   1                no 
  v3         2          a customer   32                yes
  v4         5          the linter   2                no 
  v5         3          an auditor   24                yes
  v6         5          an engineer   3                no 
  v7         1          a customer   28                yes
  v8         4          an engineer   2                no 

response hours, grouped by real severity
  severity 1 : 1 incident(s), 28 hours
  severity 2 : 1 incident(s), 32 hours
  severity 3 : 1 incident(s), 24 hours
  severity 4 : 3 incident(s), 43 hours
  severity 5 : 2 incident(s), 5 hours

response hours, grouped by who found it
  a customer : 3 incident(s), 100 hours, mean severity 23 tenths
  the linter : 2 incident(s), 3 hours, mean severity 45 tenths
  an auditor : 1 incident(s), 24 hours, mean severity 30 tenths
  an engineer : 2 incident(s), 5 hours, mean severity 45 tenths

the sharpest pair
  v4 : severity 5, found by the linter, 2 hours
  v6 : severity 5, found by an engineer, 3 hours
  v7 : severity 1, found by a customer, 28 hours
  the least severe breach cost 9 times the hours of the most severe one

incidents that reached a review : 4 of 8
  their mean severity   : 25 tenths
  mean severity of the rest : 45 tenths
  the incidents that did NOT reach a review are the more severe group

what the pattern teaches a team that broke the rule
  severity of the breach     : does not predict the consequence
  who noticed                : does
  the available action that follows is to reduce who notices, which is not
  the same as reducing breaches

pricing the response on severity instead
  total severity across all 8 : 28
  hours available           : 132
  hours per severity point  : 4
  the same total effort, allocated to the breaches rather than to the
  audiences, and it needs no new budget

control - a rule where every breach is caught by the same check
  distinct finders : 1
  response hours, by severity : 
    severity 4 : 2 hours
    severity 2 : 1 hours
    severity 5 : 3 hours
  the ordering follows severity here, because the only thing left to vary
  is the breach

Matching the response to who is affected is how incident response works and
none of these responses was wrong for its audience. The consequence a team
faces is therefore a fact about who was watching.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
