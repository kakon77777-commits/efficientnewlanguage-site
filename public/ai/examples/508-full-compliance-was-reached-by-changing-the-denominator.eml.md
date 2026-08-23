<!-- canonical: efficientnewlanguage.org/ai/examples/508-full-compliance-was-reached-by-changing-the-denominator | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 508 — Full compliance was reached by changing the denominator

`full_compliance_was_reached_by_changing_the_denominator.eml` - A security standard reached 100% compliance. How many repositories changed and how many left the denominator are counted separately below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A security
# standard reached 100% compliance. How many repositories changed and how many
# left the denominator are counted separately below.
#
# Archiving those repositories was correct. They had no owning team, no commits
# in over a year, and carrying them in every audit was costing real review time
# on code nobody was going to touch. Somebody made a clean decision about dead
# weight and the audit got faster.
#
# Compliance is a ratio, and a ratio moves when either half moves. Archiving
# changes the denominator without touching the code, so the same repositories
# in the same state produce a different percentage. Whether the archived ones
# still run is a separate fact from whether they are counted.
#
# Both halves are counted below.

# [repo, compliant, commits in the last year, archived, still deployed, requests per day]
[["gateway", "yes", 412, "no", "yes", 9000000], ["billing", "yes", 380, "no", "yes", 900000], ["catalog", "yes", 250, "no", "yes", 4000000], ["notifier", "yes", 90, "no", "yes", 120000], ["reporting", "yes", 66, "no", "yes", 40000], ["legacy-import", "no", 0, "yes", "yes", 22000], ["partner-sync", "no", 0, "yes", "yes", 8000], ["old-admin", "no", 0, "yes", "yes", 300], ["batch-tools", "no", 2, "yes", "no", 0], ["scratch-etl", "no", 0, "yes", "no", 0]] => repos

len(repos) => n

"repo             compliant   commits/yr   archived   deployed   requests/day" ^0
for r in repos:
    "  " + r[0] + "   " + r[1] + "         " + str(r[2]) + "          " + r[3] + "        " + r[4] + "        " + str(r[5]) ^0
"" ^0

0 => compliant
0 => archived
0 => in_scope
0 => in_scope_compliant
for r in repos:
    if r[1] == "yes":
        compliant + 1 => compliant
    if r[3] == "yes":
        archived + 1 => archived
    else:
        in_scope + 1 => in_scope
        if r[1] == "yes":
            in_scope_compliant + 1 => in_scope_compliant

"repositories               : " + str(n) ^0
"compliant                  : " + str(compliant) ^0
"archived                   : " + str(archived) ^0
"in scope after archiving   : " + str(in_scope) ^0
"" ^0

"the ratio, both ways" ^0
"  over every repository : " + str(compliant) + " of " + str(n) + " = " + str(int(compliant * 100 / n)) + "%" ^0
"  over in-scope only    : " + str(in_scope_compliant) + " of " + str(in_scope) + " = " + str(int(in_scope_compliant * 100 / in_scope)) + "%" ^0
"  repositories whose code changed : 0" ^0
"  the metric moved " + str(int(in_scope_compliant * 100 / in_scope) - int(compliant * 100 / n)) + " points on a change to the denominator" ^0
"" ^0

# ---- what is behind the archive flag ----

0 => arch_deployed
0 => arch_traffic
for r in repos:
    if r[3] == "yes":
        if r[4] == "yes":
            arch_deployed + 1 => arch_deployed
            arch_traffic + r[5] => arch_traffic
"the " + str(archived) + " archived repositories" ^0
"  still deployed        : " + str(arch_deployed) ^0
"  requests they serve   : " + str(arch_traffic) + " a day" ^0
"  compliant             : 0" ^0
for r in repos:
    if r[3] == "yes":
        if r[4] == "yes":
            "    " + r[0] + " : " + str(r[5]) + " requests a day, not compliant, not counted" ^0
"  archiving a repository stops it being audited and does not stop it" ^0
"  receiving requests" ^0
"" ^0

# ---- traffic inside and outside the denominator ----

0 => scope_traffic
for r in repos:
    if r[3] == "no":
        scope_traffic + r[5] => scope_traffic
0 => all_traffic
for r in repos:
    all_traffic + r[5] => all_traffic
"requests per day, by whether the repository is audited" ^0
"  audited     : " + str(scope_traffic) ^0
"  not audited : " + str(arch_traffic) ^0
"  total       : " + str(all_traffic) ^0
"  the unaudited share is " + str(int(arch_traffic * 1000000 / all_traffic)) + " requests per million," ^0
"  a unit fine enough not to floor to zero the way a percentage does here" ^0
"  a small share of traffic, and it is the whole of the non-compliant code" ^0
"" ^0

# ---- the two repositories that really are dead ----

0 => truly_dead
for r in repos:
    if r[3] == "yes":
        if r[4] == "no":
            truly_dead + 1 => truly_dead
            "  " + r[0] + " : archived, not deployed, " + str(r[5]) + " requests" ^0
"repositories where archiving matched reality : " + str(truly_dead) + " of " + str(archived) ^0
"  for these the archive flag and the facts agree, and removing them from" ^0
"  the audit removes nothing" ^0
"  for the other " + str(archived - truly_dead) + " it removes " + str(arch_traffic) + " requests a day from view" ^0
"" ^0

# ---- what a traffic-weighted metric would say ----

"the same standard, weighted by requests served" ^0
0 => compliant_traffic
for r in repos:
    if r[1] == "yes":
        compliant_traffic + r[5] => compliant_traffic
"  requests served by compliant code : " + str(compliant_traffic) ^0
"  requests served by all code       : " + str(all_traffic) ^0
"  compliance by traffic             : " + str(int(compliant_traffic * 100 / all_traffic)) + "%" ^0
"  by repository count, in scope     : " + str(int(in_scope_compliant * 100 / in_scope)) + "%" ^0
"  by repository count, everything   : " + str(int(compliant * 100 / n)) + "%" ^0
"  three defensible numbers for one standard, and the reporting picked one" ^0
"" ^0

# ---- the control: a repository that was actually fixed ----
#
# Where a repository moves from non-compliant to compliant by changing, the
# ratio moves for the reason the ratio is supposed to move.

[["reporting", "no", "yes", 66, 40000]] => fixed
for f in fixed:
    "control - " + f[0] + " before and after the work" ^0
    "  before : compliant " + f[1] + ", after : compliant " + f[2] ^0
    "  commits in the year : " + str(f[3]) + ", requests a day : " + str(f[4]) ^0
    "  denominator before and after : " + str(in_scope) + " and " + str(in_scope) ^0
    "  here one repository changed and the ratio moved by one repository," ^0
    "  which is the only movement that survives asking what changed" ^0
"" ^0

"Archiving unowned code with no commits in a year was the right call and the" ^0
"audit really is faster. " + str(arch_deployed) + " of the " + str(archived) + " archived repositories still serve" ^0
str(arch_traffic) + " requests a day, and none of them are in the 100%." ^0
```

## Python (deterministic transpilation)

```python
repos = [["gateway", "yes", 412, "no", "yes", 9000000], ["billing", "yes", 380, "no", "yes", 900000], ["catalog", "yes", 250, "no", "yes", 4000000], ["notifier", "yes", 90, "no", "yes", 120000], ["reporting", "yes", 66, "no", "yes", 40000], ["legacy-import", "no", 0, "yes", "yes", 22000], ["partner-sync", "no", 0, "yes", "yes", 8000], ["old-admin", "no", 0, "yes", "yes", 300], ["batch-tools", "no", 2, "yes", "no", 0], ["scratch-etl", "no", 0, "yes", "no", 0]]
n = len(repos)
print("repo             compliant   commits/yr   archived   deployed   requests/day")
for r in repos:
    print("  " + r[0] + "   " + r[1] + "         " + str(r[2]) + "          " + r[3] + "        " + r[4] + "        " + str(r[5]))
print("")
compliant = 0
archived = 0
in_scope = 0
in_scope_compliant = 0
for r in repos:
    if r[1] == "yes":
        compliant = compliant + 1
    if r[3] == "yes":
        archived = archived + 1
    else:
        in_scope = in_scope + 1
        if r[1] == "yes":
            in_scope_compliant = in_scope_compliant + 1
print("repositories               : " + str(n))
print("compliant                  : " + str(compliant))
print("archived                   : " + str(archived))
print("in scope after archiving   : " + str(in_scope))
print("")
print("the ratio, both ways")
print("  over every repository : " + str(compliant) + " of " + str(n) + " = " + str(int(compliant * 100 / n)) + "%")
print("  over in-scope only    : " + str(in_scope_compliant) + " of " + str(in_scope) + " = " + str(int(in_scope_compliant * 100 / in_scope)) + "%")
print("  repositories whose code changed : 0")
print("  the metric moved " + str(int(in_scope_compliant * 100 / in_scope) - int(compliant * 100 / n)) + " points on a change to the denominator")
print("")
arch_deployed = 0
arch_traffic = 0
for r in repos:
    if r[3] == "yes":
        if r[4] == "yes":
            arch_deployed = arch_deployed + 1
            arch_traffic = arch_traffic + r[5]
print("the " + str(archived) + " archived repositories")
print("  still deployed        : " + str(arch_deployed))
print("  requests they serve   : " + str(arch_traffic) + " a day")
print("  compliant             : 0")
for r in repos:
    if r[3] == "yes":
        if r[4] == "yes":
            print("    " + r[0] + " : " + str(r[5]) + " requests a day, not compliant, not counted")
print("  archiving a repository stops it being audited and does not stop it")
print("  receiving requests")
print("")
scope_traffic = 0
for r in repos:
    if r[3] == "no":
        scope_traffic = scope_traffic + r[5]
all_traffic = 0
for r in repos:
    all_traffic = all_traffic + r[5]
print("requests per day, by whether the repository is audited")
print("  audited     : " + str(scope_traffic))
print("  not audited : " + str(arch_traffic))
print("  total       : " + str(all_traffic))
print("  the unaudited share is " + str(int(arch_traffic * 1000000 / all_traffic)) + " requests per million,")
print("  a unit fine enough not to floor to zero the way a percentage does here")
print("  a small share of traffic, and it is the whole of the non-compliant code")
print("")
truly_dead = 0
for r in repos:
    if r[3] == "yes":
        if r[4] == "no":
            truly_dead = truly_dead + 1
            print("  " + r[0] + " : archived, not deployed, " + str(r[5]) + " requests")
print("repositories where archiving matched reality : " + str(truly_dead) + " of " + str(archived))
print("  for these the archive flag and the facts agree, and removing them from")
print("  the audit removes nothing")
print("  for the other " + str(archived - truly_dead) + " it removes " + str(arch_traffic) + " requests a day from view")
print("")
print("the same standard, weighted by requests served")
compliant_traffic = 0
for r in repos:
    if r[1] == "yes":
        compliant_traffic = compliant_traffic + r[5]
print("  requests served by compliant code : " + str(compliant_traffic))
print("  requests served by all code       : " + str(all_traffic))
print("  compliance by traffic             : " + str(int(compliant_traffic * 100 / all_traffic)) + "%")
print("  by repository count, in scope     : " + str(int(in_scope_compliant * 100 / in_scope)) + "%")
print("  by repository count, everything   : " + str(int(compliant * 100 / n)) + "%")
print("  three defensible numbers for one standard, and the reporting picked one")
print("")
fixed = [["reporting", "no", "yes", 66, 40000]]
for f in fixed:
    print("control - " + f[0] + " before and after the work")
    print("  before : compliant " + f[1] + ", after : compliant " + f[2])
    print("  commits in the year : " + str(f[3]) + ", requests a day : " + str(f[4]))
    print("  denominator before and after : " + str(in_scope) + " and " + str(in_scope))
    print("  here one repository changed and the ratio moved by one repository,")
    print("  which is the only movement that survives asking what changed")
print("")
print("Archiving unowned code with no commits in a year was the right call and the")
print("audit really is faster. " + str(arch_deployed) + " of the " + str(archived) + " archived repositories still serve")
print(str(arch_traffic) + " requests a day, and none of them are in the 100%.")
```

## stdout (executed)

```text
repo             compliant   commits/yr   archived   deployed   requests/day
  gateway   yes         412          no        yes        9000000
  billing   yes         380          no        yes        900000
  catalog   yes         250          no        yes        4000000
  notifier   yes         90          no        yes        120000
  reporting   yes         66          no        yes        40000
  legacy-import   no         0          yes        yes        22000
  partner-sync   no         0          yes        yes        8000
  old-admin   no         0          yes        yes        300
  batch-tools   no         2          yes        no        0
  scratch-etl   no         0          yes        no        0

repositories               : 10
compliant                  : 5
archived                   : 5
in scope after archiving   : 5

the ratio, both ways
  over every repository : 5 of 10 = 50%
  over in-scope only    : 5 of 5 = 100%
  repositories whose code changed : 0
  the metric moved 50 points on a change to the denominator

the 5 archived repositories
  still deployed        : 3
  requests they serve   : 30300 a day
  compliant             : 0
    legacy-import : 22000 requests a day, not compliant, not counted
    partner-sync : 8000 requests a day, not compliant, not counted
    old-admin : 300 requests a day, not compliant, not counted
  archiving a repository stops it being audited and does not stop it
  receiving requests

requests per day, by whether the repository is audited
  audited     : 14060000
  not audited : 30300
  total       : 14090300
  the unaudited share is 2150 requests per million,
  a unit fine enough not to floor to zero the way a percentage does here
  a small share of traffic, and it is the whole of the non-compliant code

  batch-tools : archived, not deployed, 0 requests
  scratch-etl : archived, not deployed, 0 requests
repositories where archiving matched reality : 2 of 5
  for these the archive flag and the facts agree, and removing them from
  the audit removes nothing
  for the other 3 it removes 30300 requests a day from view

the same standard, weighted by requests served
  requests served by compliant code : 14060000
  requests served by all code       : 14090300
  compliance by traffic             : 99%
  by repository count, in scope     : 100%
  by repository count, everything   : 50%
  three defensible numbers for one standard, and the reporting picked one

control - reporting before and after the work
  before : compliant no, after : compliant yes
  commits in the year : 66, requests a day : 40000
  denominator before and after : 5 and 5
  here one repository changed and the ratio moved by one repository,
  which is the only movement that survives asking what changed

Archiving unowned code with no commits in a year was the right call and the
audit really is faster. 3 of the 5 archived repositories still serve
30300 requests a day, and none of them are in the 100%.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
