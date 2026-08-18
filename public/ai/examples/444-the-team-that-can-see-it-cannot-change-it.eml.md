<!-- canonical: efficientnewlanguage.org/ai/examples/444-the-team-that-can-see-it-cannot-change-it | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 444 — The team that can see it cannot change it

`the_team_that_can_see_it_cannot_change_it.eml` - The platform team can see every one of these findings. How many of them anyone can act on is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The platform team
# can see every one of these findings. How many of them anyone can act on is
# computed below.
#
# Centralising the view is right. One team watching every service spots the
# patterns no single service owner can see, applies one standard everywhere,
# and does not need eight teams to each build the same dashboard. The findings
# are real, reproducible and correctly attributed.
#
# Seeing and being able to change are two permissions, and centralising the
# first one moved it away from the second. A finding is acted on when one party
# holds both, and neither team here holds both for most of the list.
#
# The overlap is computed per finding.

# [finding, service, platform can change it, the service still has an owner, the owner was told]
[["f1", "shared-lib", 1, 1, 1], ["f2", "checkout", 0, 1, 1], ["f3", "search", 0, 1, 0], ["f4", "legacy-report", 0, 0, 0], ["f5", "auth", 0, 1, 1], ["f6", "billing", 0, 1, 0], ["f7", "ingest", 0, 1, 0], ["f8", "mailer", 0, 0, 0]] => findings

len(findings) => n

def actionable(f):
    if f[2] == 1:
        return 1
    if f[3] == 1:
        if f[4] == 1:
            return 1
    return 0

"findings : " + str(n) ^0
"" ^0

0 => platform_sees
0 => platform_can_change
0 => has_owner
0 => owner_told
0 => can_act
for f in findings:
    platform_sees + 1 => platform_sees
    if f[2] == 1:
        platform_can_change + 1 => platform_can_change
    if f[3] == 1:
        has_owner + 1 => has_owner
        if f[4] == 1:
            owner_told + 1 => owner_told
    can_act + actionable(f) => can_act

"the platform team" ^0
"  can see       : " + str(platform_sees) + " of " + str(n) ^0
"  can change    : " + str(platform_can_change) + " of " + str(n) ^0
"the service owners" ^0
"  can change    : " + str(has_owner) + " of " + str(n) ^0
"  were told     : " + str(owner_told) + " of " + str(n) ^0
"" ^0
"findings where one party holds both permissions : " + str(can_act) + " of " + str(n) ^0
if can_act < platform_sees:
    "  " + str(platform_sees - can_act) + " are visible to somebody and changeable by somebody else" ^0
"" ^0

"finding   service         who could act" ^0
for f in findings:
    "" => who
    if f[2] == 1:
        "the platform team" => who
    elif f[3] == 0:
        "nobody - the service has no owner" => who
    elif f[4] == 1:
        "the owning team" => who
    else:
        "the owning team, once told" => who
    "  " + f[0] + "      " + f[1] + "     " + who ^0
"" ^0

# ---- the residual splits into two different problems ----
#
# One is a routing problem and is solved by sending a message. The other is an
# ownership problem and is not.

0 => routing
0 => ownerless
for f in findings:
    if actionable(f) == 0:
        if f[3] == 1:
            routing + 1 => routing
        else:
            ownerless + 1 => ownerless
"what the remaining " + str(n - can_act) + " need" ^0
"  a message to the owner : " + str(routing) ^0
"  an owner at all        : " + str(ownerless) ^0
if routing + ownerless == n - can_act:
    "  and those two numbers account for all of them" ^0
"" ^0

# ---- what routing alone would buy ----

0 => if_routed
for f in findings:
    if f[2] == 1:
        if_routed + 1 => if_routed
    elif f[3] == 1:
        if_routed + 1 => if_routed
"if every finding were routed to its owner tomorrow" ^0
"  actionable : " + str(if_routed) + " of " + str(n) ^0
if if_routed > can_act:
    "  up " + str(if_routed - can_act) + " from " + str(can_act) + ", by sending messages and changing no code" ^0
if if_routed < n:
    "  the last " + str(n - if_routed) + " are unchanged, because routing needs a recipient" ^0
"" ^0

# ---- what the platform team can do without the other permission ----
#
# Not nothing. It can make the finding cheaper to act on for whoever does hold
# the second permission - which is a different job from fixing it.

"what the centralised view is still the right place for" ^0
"  finding the pattern across services : " + str(n) + " findings, one standard" ^0
"  proving the finding is real         : reproducible before it is sent" ^0
"  knowing whether it was fixed        : the same view sees the after state" ^0
"  none of those requires the change permission, and all of them are lost if" ^0
"  each team watches only itself" ^0
"" ^0

# ---- the control: a team that holds both ----
#
# Where the same team watches and owns, routing costs nothing and the residual
# is only the work itself.

[["g1", "own-svc-a", 1, 1, 1], ["g2", "own-svc-b", 1, 1, 1], ["g3", "own-svc-c", 1, 1, 1]] => selfowned
0 => s_act
for f in selfowned:
    s_act + actionable(f) => s_act
"control - a team watching services it owns" ^0
"  findings : " + str(len(selfowned)) + ", actionable : " + str(s_act) ^0
if s_act == len(selfowned):
    "  all of them, because seeing and changing are the same party here" ^0
"  so this team's fix rate says nothing about routing, which it never needed" ^0
"" ^0

"The central view is worth having and every finding in it is real. Acting" ^0
"needs the same party to hold the view and the write access, and centralising" ^0
"one of those two is what separated them." ^0
```

## Python (deterministic transpilation)

```python
findings = [["f1", "shared-lib", 1, 1, 1], ["f2", "checkout", 0, 1, 1], ["f3", "search", 0, 1, 0], ["f4", "legacy-report", 0, 0, 0], ["f5", "auth", 0, 1, 1], ["f6", "billing", 0, 1, 0], ["f7", "ingest", 0, 1, 0], ["f8", "mailer", 0, 0, 0]]
n = len(findings)

def actionable(f):
    if f[2] == 1:
        return 1
    if f[3] == 1:
        if f[4] == 1:
            return 1
    return 0

print("findings : " + str(n))
print("")
platform_sees = 0
platform_can_change = 0
has_owner = 0
owner_told = 0
can_act = 0
for f in findings:
    platform_sees = platform_sees + 1
    if f[2] == 1:
        platform_can_change = platform_can_change + 1
    if f[3] == 1:
        has_owner = has_owner + 1
        if f[4] == 1:
            owner_told = owner_told + 1
    can_act = can_act + actionable(f)
print("the platform team")
print("  can see       : " + str(platform_sees) + " of " + str(n))
print("  can change    : " + str(platform_can_change) + " of " + str(n))
print("the service owners")
print("  can change    : " + str(has_owner) + " of " + str(n))
print("  were told     : " + str(owner_told) + " of " + str(n))
print("")
print("findings where one party holds both permissions : " + str(can_act) + " of " + str(n))
if can_act < platform_sees:
    print("  " + str(platform_sees - can_act) + " are visible to somebody and changeable by somebody else")
print("")
print("finding   service         who could act")
for f in findings:
    who = ""
    if f[2] == 1:
        who = "the platform team"
    elif f[3] == 0:
        who = "nobody - the service has no owner"
    elif f[4] == 1:
        who = "the owning team"
    else:
        who = "the owning team, once told"
    print("  " + f[0] + "      " + f[1] + "     " + who)
print("")
routing = 0
ownerless = 0
for f in findings:
    if actionable(f) == 0:
        if f[3] == 1:
            routing = routing + 1
        else:
            ownerless = ownerless + 1
print("what the remaining " + str(n - can_act) + " need")
print("  a message to the owner : " + str(routing))
print("  an owner at all        : " + str(ownerless))
if routing + ownerless == n - can_act:
    print("  and those two numbers account for all of them")
print("")
if_routed = 0
for f in findings:
    if f[2] == 1:
        if_routed = if_routed + 1
    elif f[3] == 1:
        if_routed = if_routed + 1
print("if every finding were routed to its owner tomorrow")
print("  actionable : " + str(if_routed) + " of " + str(n))
if if_routed > can_act:
    print("  up " + str(if_routed - can_act) + " from " + str(can_act) + ", by sending messages and changing no code")
if if_routed < n:
    print("  the last " + str(n - if_routed) + " are unchanged, because routing needs a recipient")
print("")
print("what the centralised view is still the right place for")
print("  finding the pattern across services : " + str(n) + " findings, one standard")
print("  proving the finding is real         : reproducible before it is sent")
print("  knowing whether it was fixed        : the same view sees the after state")
print("  none of those requires the change permission, and all of them are lost if")
print("  each team watches only itself")
print("")
selfowned = [["g1", "own-svc-a", 1, 1, 1], ["g2", "own-svc-b", 1, 1, 1], ["g3", "own-svc-c", 1, 1, 1]]
s_act = 0
for f in selfowned:
    s_act = s_act + actionable(f)
print("control - a team watching services it owns")
print("  findings : " + str(len(selfowned)) + ", actionable : " + str(s_act))
if s_act == len(selfowned):
    print("  all of them, because seeing and changing are the same party here")
print("  so this team's fix rate says nothing about routing, which it never needed")
print("")
print("The central view is worth having and every finding in it is real. Acting")
print("needs the same party to hold the view and the write access, and centralising")
print("one of those two is what separated them.")
```

## stdout (executed)

```text
findings : 8

the platform team
  can see       : 8 of 8
  can change    : 1 of 8
the service owners
  can change    : 6 of 8
  were told     : 3 of 8

findings where one party holds both permissions : 3 of 8
  5 are visible to somebody and changeable by somebody else

finding   service         who could act
  f1      shared-lib     the platform team
  f2      checkout     the owning team
  f3      search     the owning team, once told
  f4      legacy-report     nobody - the service has no owner
  f5      auth     the owning team
  f6      billing     the owning team, once told
  f7      ingest     the owning team, once told
  f8      mailer     nobody - the service has no owner

what the remaining 5 need
  a message to the owner : 3
  an owner at all        : 2
  and those two numbers account for all of them

if every finding were routed to its owner tomorrow
  actionable : 6 of 8
  up 3 from 3, by sending messages and changing no code
  the last 2 are unchanged, because routing needs a recipient

what the centralised view is still the right place for
  finding the pattern across services : 8 findings, one standard
  proving the finding is real         : reproducible before it is sent
  knowing whether it was fixed        : the same view sees the after state
  none of those requires the change permission, and all of them are lost if
  each team watches only itself

control - a team watching services it owns
  findings : 3, actionable : 3
  all of them, because seeing and changing are the same party here
  so this team's fix rate says nothing about routing, which it never needed

The central view is worth having and every finding in it is real. Acting
needs the same party to hold the view and the write access, and centralising
one of those two is what separated them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
