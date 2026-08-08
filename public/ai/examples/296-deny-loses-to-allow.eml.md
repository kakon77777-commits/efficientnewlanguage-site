<!-- canonical: efficientnewlanguage.org/ai/examples/296-deny-loses-to-allow | ai_layer_version: 0.1.0 | updated: 2026-08-08 -->

# Example 296 — Deny loses to allow — the role that cannot take anything away

`deny_loses_to_allow.eml` computes each user's effective permissions two ways — as a **union of grants** and with **deny winning** — and then sweeps the structural question directly: can attaching a role ever remove a permission?

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A permission
# model built as a union of grants, and the role that cannot take anything
# away.
#
# Effective permissions are almost always assembled by walking a user's roles
# and collecting what each one grants. That shape is natural, cheap, and it
# has a property nobody writes down: a union only grows. A rule whose effect
# is "deny" contributes no elements to a union, so it changes nothing.
#
# The consequence is that the roles written specifically to REMOVE access -
# suspended, legal_hold, under_review - are inert. They read as restrictions
# in the admin UI, they are attached to the right users, and they are
# enforced by code that cannot express them.
#
# The measurement sweeps every (user, action) pair under two models: union of
# grants, and deny-wins. It then checks the structural property directly -
# whether adding a role to a user can ever remove a permission - by sweeping
# every user against every role rather than by asserting it.

def role_rules(role):
    # Each role is a list of [action, effect] pairs. "deny" rules are written
    # exactly the way a policy author would write them.
    if role == "reader":
        return [["read", "allow"]]
    if role == "editor":
        return [["read", "allow"], ["write", "allow"]]
    if role == "publisher":
        return [["read", "allow"], ["write", "allow"], ["publish", "allow"]]
    if role == "owner":
        return [["read", "allow"], ["write", "allow"], ["publish", "allow"], ["delete", "allow"]]
    if role == "suspended":
        return [["write", "deny"], ["publish", "deny"]]
    if role == "legal_hold":
        return [["write", "deny"], ["delete", "deny"]]
    return []

def allowed_union(roles, action):
    # Model A: effective = union of what the roles grant. The loop reads the
    # "deny" rules, recognises them, and has nowhere to put them.
    for r in roles:
        role_rules(r) => rules
        for rule in rules:
            if rule[0] == action:
                if rule[1] == "allow":
                    return 1
    return 0

def allowed_deny_wins(roles, action):
    # Model B: an explicit deny anywhere beats every allow, whatever order
    # the roles are in.
    0 => granted
    for r in roles:
        role_rules(r) => rules
        for rule in rules:
            if rule[0] == action:
                if rule[1] == "deny":
                    return 0
                1 => granted
    return granted

def has_role(roles, name):
    for r in roles:
        if r == name:
            return 1
    return 0

def with_role(roles, name):
    # roles + [name], without mutating the caller's list. `=>` aliases, so a
    # fresh list has to be built rather than appended to.
    [] => out
    for r in roles:
        out + [r] => out
    if has_role(roles, name) == 1:
        return out
    return out + [name]

["read", "write", "publish", "delete"] => ACTIONS
["reader", "editor", "publisher", "owner", "suspended", "legal_hold"] => ROLES

# name, roles. Three of the five carry a role whose entire purpose is to take
# something away.
[["ann", ["editor"]],
 ["bob", ["editor", "suspended"]],
 ["cho", ["publisher", "legal_hold"]],
 ["dee", ["owner", "suspended", "legal_hold"]],
 ["eli", ["reader"]]] => USERS

"user       action    union  deny-wins"^0
"---------- --------- -----  ---------"^0

0 => pairs
0 => disagreements
0 => union_allows_a_denied_action
for u in USERS:
    u[0] => name
    u[1] => roles
    for a in ACTIONS:
        allowed_union(roles, a) => x
        allowed_deny_wins(roles, a) => y
        pairs + 1 => pairs
        if x == y:
            "  " => flag
        else:
            " <" => flag
            disagreements + 1 => disagreements
            if x == 1:
                union_allows_a_denied_action + 1 => union_allows_a_denied_action
        (name + "        ")[0:10] + " " + (a + "        ")[0:9] + " " + str(x) + "      " + str(y) + flag => line
        line^0

""^0
("pairs swept: " + str(pairs))^0
("disagreements: " + str(disagreements))^0
("union allows an action an attached role explicitly denies: " + str(union_allows_a_denied_action))^0

# Every disagreement points the same way. That is not a coincidence and it is
# worth measuring rather than asserting: a union cannot be more restrictive
# than deny-wins, so there is no pair where deny-wins allows and union does
# not. If one ever appeared, one of the two models would not be what its name
# says.
0 => deny_wins_more_permissive
for u in USERS:
    u[1] => roles
    for a in ACTIONS:
        if allowed_deny_wins(roles, a) == 1:
            if allowed_union(roles, a) == 0:
                deny_wins_more_permissive + 1 => deny_wins_more_permissive
("pairs where deny-wins is the more permissive model: " + str(deny_wins_more_permissive))^0

""^0
"monotonicity - can attaching a role ever REMOVE a permission?"^0

# The structural claim, swept rather than stated: for every user and every
# role in the catalogue, compare the permission set before and after
# attaching it. A model where attaching a role can only add is a model where
# no role can restrict anything, no matter what the role is called.
0 => union_removals
0 => deny_wins_removals
0 => attachments
for u in USERS:
    u[1] => roles
    for r in ROLES:
        with_role(roles, r) => bigger
        attachments + 1 => attachments
        for a in ACTIONS:
            if allowed_union(roles, a) == 1:
                if allowed_union(bigger, a) == 0:
                    union_removals + 1 => union_removals
            if allowed_deny_wins(roles, a) == 1:
                if allowed_deny_wins(bigger, a) == 0:
                    deny_wins_removals + 1 => deny_wins_removals

("attachments tried: " + str(attachments))^0
("permissions removed by attaching a role, union model: " + str(union_removals))^0
("permissions removed by attaching a role, deny-wins model: " + str(deny_wins_removals))^0

""^0
"the two restricting roles, scored on their own terms"^0

# What a restricting role is FOR: attach it and something goes away. Score
# each one by how many permissions it actually removes across the users.
for r in ["suspended", "legal_hold"]:
    0 => removed_union
    0 => removed_deny
    for u in USERS:
        u[1] => roles
        with_role(roles, r) => bigger
        for a in ACTIONS:
            if allowed_union(roles, a) == 1:
                if allowed_union(bigger, a) == 0:
                    removed_union + 1 => removed_union
            if allowed_deny_wins(roles, a) == 1:
                if allowed_deny_wins(bigger, a) == 0:
                    removed_deny + 1 => removed_deny
    ((r + "            ")[0:12] + " union removes " + str(removed_union) + ", deny-wins removes " + str(removed_deny))^0

""^0
0 => checked
0 => passed

# The union model must let something through that an attached role denies -
# otherwise the corpus entry is describing a problem the data does not have.
checked + 1 => checked
if union_allows_a_denied_action > 0:
    passed + 1 => passed

# Under the union model, attaching a role must never remove anything. This is
# the whole defect stated as a measurement.
checked + 1 => checked
if union_removals == 0:
    passed + 1 => passed

# Under deny-wins, attaching a restricting role must actually remove
# something, or the two models would be indistinguishable on this data.
checked + 1 => checked
if deny_wins_removals > 0:
    passed + 1 => passed

# Deny-wins is never the more permissive of the two. The disagreements all
# point one way.
checked + 1 => checked
if deny_wins_more_permissive == 0:
    passed + 1 => passed

# More than one user must be affected, so this is not one crafted row.
checked + 1 => checked
if disagreements >= 3:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Every deny in the catalogue was read, recognised, and discarded." => verdict
else:
    "FAILED - the models did not behave as the checks describe." => verdict
verdict^0

""^0
"A union is a shape, not a policy. The moment effective permissions are"^0
"assembled by collecting grants, the language has no way to say 'not this'"^0
"- and the roles written to say it still exist, still get attached, and"^0
"still show up in the audit log as though they did something. The review"^0
"that would catch it is not of the deny rules, which are all correct; it"^0
"is of the operator that combines them."^0
```

## Python (deterministic transpilation)

```python
def role_rules(role):
    if role == "reader":
        return [["read", "allow"]]
    if role == "editor":
        return [["read", "allow"], ["write", "allow"]]
    if role == "publisher":
        return [["read", "allow"], ["write", "allow"], ["publish", "allow"]]
    if role == "owner":
        return [["read", "allow"], ["write", "allow"], ["publish", "allow"], ["delete", "allow"]]
    if role == "suspended":
        return [["write", "deny"], ["publish", "deny"]]
    if role == "legal_hold":
        return [["write", "deny"], ["delete", "deny"]]
    return []

def allowed_union(roles, action):
    for r in roles:
        rules = role_rules(r)
        for rule in rules:
            if rule[0] == action:
                if rule[1] == "allow":
                    return 1
    return 0

def allowed_deny_wins(roles, action):
    granted = 0
    for r in roles:
        rules = role_rules(r)
        for rule in rules:
            if rule[0] == action:
                if rule[1] == "deny":
                    return 0
                granted = 1
    return granted

def has_role(roles, name):
    for r in roles:
        if r == name:
            return 1
    return 0

def with_role(roles, name):
    out = []
    for r in roles:
        out = out + [r]
    if has_role(roles, name) == 1:
        return out
    return out + [name]

ACTIONS = ["read", "write", "publish", "delete"]
ROLES = ["reader", "editor", "publisher", "owner", "suspended", "legal_hold"]
USERS = [["ann", ["editor"]], ["bob", ["editor", "suspended"]], ["cho", ["publisher", "legal_hold"]], ["dee", ["owner", "suspended", "legal_hold"]], ["eli", ["reader"]]]
print("user       action    union  deny-wins")
print("---------- --------- -----  ---------")
pairs = 0
disagreements = 0
union_allows_a_denied_action = 0
for u in USERS:
    name = u[0]
    roles = u[1]
    for a in ACTIONS:
        x = allowed_union(roles, a)
        y = allowed_deny_wins(roles, a)
        pairs = pairs + 1
        if x == y:
            flag = "  "
        else:
            flag = " <"
            disagreements = disagreements + 1
            if x == 1:
                union_allows_a_denied_action = union_allows_a_denied_action + 1
        line = (name + "        ")[0:10] + " " + (a + "        ")[0:9] + " " + str(x) + "      " + str(y) + flag
        print(line)
print("")
print("pairs swept: " + str(pairs))
print("disagreements: " + str(disagreements))
print("union allows an action an attached role explicitly denies: " + str(union_allows_a_denied_action))
deny_wins_more_permissive = 0
for u in USERS:
    roles = u[1]
    for a in ACTIONS:
        if allowed_deny_wins(roles, a) == 1:
            if allowed_union(roles, a) == 0:
                deny_wins_more_permissive = deny_wins_more_permissive + 1
print("pairs where deny-wins is the more permissive model: " + str(deny_wins_more_permissive))
print("")
print("monotonicity - can attaching a role ever REMOVE a permission?")
union_removals = 0
deny_wins_removals = 0
attachments = 0
for u in USERS:
    roles = u[1]
    for r in ROLES:
        bigger = with_role(roles, r)
        attachments = attachments + 1
        for a in ACTIONS:
            if allowed_union(roles, a) == 1:
                if allowed_union(bigger, a) == 0:
                    union_removals = union_removals + 1
            if allowed_deny_wins(roles, a) == 1:
                if allowed_deny_wins(bigger, a) == 0:
                    deny_wins_removals = deny_wins_removals + 1
print("attachments tried: " + str(attachments))
print("permissions removed by attaching a role, union model: " + str(union_removals))
print("permissions removed by attaching a role, deny-wins model: " + str(deny_wins_removals))
print("")
print("the two restricting roles, scored on their own terms")
for r in ["suspended", "legal_hold"]:
    removed_union = 0
    removed_deny = 0
    for u in USERS:
        roles = u[1]
        bigger = with_role(roles, r)
        for a in ACTIONS:
            if allowed_union(roles, a) == 1:
                if allowed_union(bigger, a) == 0:
                    removed_union = removed_union + 1
            if allowed_deny_wins(roles, a) == 1:
                if allowed_deny_wins(bigger, a) == 0:
                    removed_deny = removed_deny + 1
    print((r + "            ")[0:12] + " union removes " + str(removed_union) + ", deny-wins removes " + str(removed_deny))
print("")
checked = 0
passed = 0
checked = checked + 1
if union_allows_a_denied_action > 0:
    passed = passed + 1
checked = checked + 1
if union_removals == 0:
    passed = passed + 1
checked = checked + 1
if deny_wins_removals > 0:
    passed = passed + 1
checked = checked + 1
if deny_wins_more_permissive == 0:
    passed = passed + 1
checked = checked + 1
if disagreements >= 3:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Every deny in the catalogue was read, recognised, and discarded."
else:
    verdict = "FAILED - the models did not behave as the checks describe."
print(verdict)
print("")
print("A union is a shape, not a policy. The moment effective permissions are")
print("assembled by collecting grants, the language has no way to say 'not this'")
print("- and the roles written to say it still exist, still get attached, and")
print("still show up in the audit log as though they did something. The review")
print("that would catch it is not of the deny rules, which are all correct; it")
print("is of the operator that combines them.")
```

## stdout (executed)

```text
user       action    union  deny-wins
---------- --------- -----  ---------
ann        read      1      1  
ann        write     1      1  
ann        publish   0      0  
ann        delete    0      0  
bob        read      1      1  
bob        write     1      0 <
bob        publish   0      0  
bob        delete    0      0  
cho        read      1      1  
cho        write     1      0 <
cho        publish   1      1  
cho        delete    0      0  
dee        read      1      1  
dee        write     1      0 <
dee        publish   1      0 <
dee        delete    1      0 <
eli        read      1      1  
eli        write     0      0  
eli        publish   0      0  
eli        delete    0      0  

pairs swept: 20
disagreements: 5
union allows an action an attached role explicitly denies: 5
pairs where deny-wins is the more permissive model: 0

monotonicity - can attaching a role ever REMOVE a permission?
attachments tried: 30
permissions removed by attaching a role, union model: 0
permissions removed by attaching a role, deny-wins model: 3

the two restricting roles, scored on their own terms
suspended    union removes 0, deny-wins removes 2
legal_hold   union removes 0, deny-wins removes 1

checks passed: 5/5
Every deny in the catalogue was read, recognised, and discarded.

A union is a shape, not a policy. The moment effective permissions are
assembled by collecting grants, the language has no way to say 'not this'
- and the roles written to say it still exist, still get attached, and
still show up in the audit log as though they did something. The review
that would catch it is not of the deny rules, which are all correct; it
is of the operator that combines them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
