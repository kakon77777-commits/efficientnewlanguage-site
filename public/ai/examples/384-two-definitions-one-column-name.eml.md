<!-- canonical: efficientnewlanguage.org/ai/examples/384-two-definitions-one-column-name | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 384 — Two definitions, one column name — the roll-up says 11 and only 10 people exist

`two_definitions_one_column_name.eml` derives both teams' numbers and the true pooled numbers from one event log.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two teams report
# "active users". Both are right. The roll-up adds them.
#
# Neither definition is wrong and neither team is careless. One counts anyone
# who opened the app, the other counts anyone who completed an action, and both
# published the definition next to the number when they built the dashboard.
# The roll-up reads a column named "active" from each and sums it.
#
# Every quantity here is computed from one event log, so the two teams' numbers
# and the true pooled number are all derived from the same rows.

# [user, team, opened, acted]
[["u1", "a", 1, 1], ["u2", "a", 1, 0], ["u3", "a", 1, 0], ["u4", "a", 1, 1], ["u5", "a", 0, 0], ["u6", "b", 1, 1], ["u7", "b", 1, 0], ["u8", "b", 1, 1], ["u9", "b", 1, 1], ["u10", "b", 0, 0], ["u3", "b", 1, 1], ["u4", "b", 1, 0], ["u1", "b", 1, 1], ["u2", "b", 1, 1], ["u5", "b", 1, 1]] => events

def count(team, rule):
    0 => c
    for e in events:
        if e[1] == team:
            if rule == "opened":
                c + e[2] => c
            else:
                c + e[3] => c
    return c

def distinct_users(rule):
    [] => seen
    for e in events:
        0 => hit
        if rule == "opened":
            e[2] => hit
        else:
            e[3] => hit
        if hit == 1:
            0 => have
            for s in seen:
                if s == e[0]:
                    1 => have
            if have == 0:
                seen + [e[0]] => seen
    return len(seen)

count("a", "opened") => a_num
count("b", "acted") => b_num

"what each team publishes" ^0
"  team A, active = opened the app  : " + str(a_num) ^0
"  team B, active = completed an action : " + str(b_num) ^0
"" ^0

"the roll-up, which reads a column called active" ^0
"  A + B : " + str(a_num + b_num) ^0
"" ^0

"the same population, counted once under each definition" ^0
distinct_users("opened") => open_all
distinct_users("acted") => act_all
"  distinct users who opened  : " + str(open_all) ^0
"  distinct users who acted   : " + str(act_all) ^0
"" ^0

[] => everyone
for e in events:
    0 => have
    for s in everyone:
        if s == e[0]:
            1 => have
    if have == 0:
        everyone + [e[0]] => everyone

"  roll-up says      : " + str(a_num + b_num) ^0
"  opened, pooled    : " + str(open_all) ^0
"  acted, pooled     : " + str(act_all) ^0
"  people who exist  : " + str(len(everyone)) ^0
if a_num + b_num > open_all:
    "  the roll-up exceeds the larger of the two real numbers" ^0
if a_num + b_num > len(everyone):
    "  and exceeds the number of people, so it counts no set at all" ^0
"" ^0

# ---- where the excess comes from, split into two causes ----

0 => cross_team
[] => seen
for e in events:
    0 => c
    for f in events:
        if f[0] == e[0]:
            c + 1 => c
    if c > 1:
        0 => have
        for s in seen:
            if s == e[0]:
                1 => have
        if have == 0:
            seen + [e[0]] => seen
            cross_team + 1 => cross_team

"causes of the excess" ^0
"  users appearing under both teams : " + str(cross_team) ^0
"  the two definitions count different things, so the sum is of no single set" ^0
"" ^0

# ---- what happens if both teams use one definition ----

count("a", "opened") + count("b", "opened") => both_opened
"if both teams reported openers" ^0
"  A + B : " + str(both_opened) ^0
"  pooled distinct : " + str(open_all) ^0
"  gap : " + str(both_opened - open_all) ^0
if both_opened > open_all:
    "  agreeing on the definition removes one cause and not the other" ^0
"" ^0

# ---- the control: teams with no shared users, one definition ----
#
# Without this the reader concludes that summing team numbers is always wrong.
# It is exactly right when the sets are disjoint and the rule is shared.

[["v1", "a", 1, 1], ["v2", "a", 1, 0], ["v3", "b", 1, 1], ["v4", "b", 1, 1]] => clean
def count_clean(team):
    0 => c
    for e in clean:
        if e[1] == team:
            c + e[2] => c
    return c
def distinct_clean():
    [] => seen
    for e in clean:
        if e[2] == 1:
            0 => have
            for s in seen:
                if s == e[0]:
                    1 => have
            if have == 0:
                seen + [e[0]] => seen
    return len(seen)

"control - disjoint teams, one shared definition" ^0
"  A + B : " + str(count_clean("a") + count_clean("b")) ^0
"  pooled distinct : " + str(distinct_clean()) ^0
if count_clean("a") + count_clean("b") == distinct_clean():
    "  here the sum is exact" ^0
"" ^0

"Both numbers are correct and the column name is the only thing they share." ^0
"Addition needs the parts to be pieces of one set, and a shared name is not" ^0
"evidence of that." ^0
```

## Python (deterministic transpilation)

```python
events = [["u1", "a", 1, 1], ["u2", "a", 1, 0], ["u3", "a", 1, 0], ["u4", "a", 1, 1], ["u5", "a", 0, 0], ["u6", "b", 1, 1], ["u7", "b", 1, 0], ["u8", "b", 1, 1], ["u9", "b", 1, 1], ["u10", "b", 0, 0], ["u3", "b", 1, 1], ["u4", "b", 1, 0], ["u1", "b", 1, 1], ["u2", "b", 1, 1], ["u5", "b", 1, 1]]

def count(team, rule):
    c = 0
    for e in events:
        if e[1] == team:
            if rule == "opened":
                c = c + e[2]
            else:
                c = c + e[3]
    return c

def distinct_users(rule):
    seen = []
    for e in events:
        hit = 0
        if rule == "opened":
            hit = e[2]
        else:
            hit = e[3]
        if hit == 1:
            have = 0
            for s in seen:
                if s == e[0]:
                    have = 1
            if have == 0:
                seen = seen + [e[0]]
    return len(seen)

a_num = count("a", "opened")
b_num = count("b", "acted")
print("what each team publishes")
print("  team A, active = opened the app  : " + str(a_num))
print("  team B, active = completed an action : " + str(b_num))
print("")
print("the roll-up, which reads a column called active")
print("  A + B : " + str(a_num + b_num))
print("")
print("the same population, counted once under each definition")
open_all = distinct_users("opened")
act_all = distinct_users("acted")
print("  distinct users who opened  : " + str(open_all))
print("  distinct users who acted   : " + str(act_all))
print("")
everyone = []
for e in events:
    have = 0
    for s in everyone:
        if s == e[0]:
            have = 1
    if have == 0:
        everyone = everyone + [e[0]]
print("  roll-up says      : " + str(a_num + b_num))
print("  opened, pooled    : " + str(open_all))
print("  acted, pooled     : " + str(act_all))
print("  people who exist  : " + str(len(everyone)))
if a_num + b_num > open_all:
    print("  the roll-up exceeds the larger of the two real numbers")
if a_num + b_num > len(everyone):
    print("  and exceeds the number of people, so it counts no set at all")
print("")
cross_team = 0
seen = []
for e in events:
    c = 0
    for f in events:
        if f[0] == e[0]:
            c = c + 1
    if c > 1:
        have = 0
        for s in seen:
            if s == e[0]:
                have = 1
        if have == 0:
            seen = seen + [e[0]]
            cross_team = cross_team + 1
print("causes of the excess")
print("  users appearing under both teams : " + str(cross_team))
print("  the two definitions count different things, so the sum is of no single set")
print("")
both_opened = count("a", "opened") + count("b", "opened")
print("if both teams reported openers")
print("  A + B : " + str(both_opened))
print("  pooled distinct : " + str(open_all))
print("  gap : " + str(both_opened - open_all))
if both_opened > open_all:
    print("  agreeing on the definition removes one cause and not the other")
print("")
clean = [["v1", "a", 1, 1], ["v2", "a", 1, 0], ["v3", "b", 1, 1], ["v4", "b", 1, 1]]

def count_clean(team):
    c = 0
    for e in clean:
        if e[1] == team:
            c = c + e[2]
    return c

def distinct_clean():
    seen = []
    for e in clean:
        if e[2] == 1:
            have = 0
            for s in seen:
                if s == e[0]:
                    have = 1
            if have == 0:
                seen = seen + [e[0]]
    return len(seen)

print("control - disjoint teams, one shared definition")
print("  A + B : " + str(count_clean("a") + count_clean("b")))
print("  pooled distinct : " + str(distinct_clean()))
if count_clean("a") + count_clean("b") == distinct_clean():
    print("  here the sum is exact")
print("")
print("Both numbers are correct and the column name is the only thing they share.")
print("Addition needs the parts to be pieces of one set, and a shared name is not")
print("evidence of that.")
```

## stdout (executed)

```text
what each team publishes
  team A, active = opened the app  : 4
  team B, active = completed an action : 7

the roll-up, which reads a column called active
  A + B : 11

the same population, counted once under each definition
  distinct users who opened  : 9
  distinct users who acted   : 8

  roll-up says      : 11
  opened, pooled    : 9
  acted, pooled     : 8
  people who exist  : 10
  the roll-up exceeds the larger of the two real numbers
  and exceeds the number of people, so it counts no set at all

causes of the excess
  users appearing under both teams : 5
  the two definitions count different things, so the sum is of no single set

if both teams reported openers
  A + B : 13
  pooled distinct : 9
  gap : 4
  agreeing on the definition removes one cause and not the other

control - disjoint teams, one shared definition
  A + B : 4
  pooled distinct : 4
  here the sum is exact

Both numbers are correct and the column name is the only thing they share.
Addition needs the parts to be pieces of one set, and a shared name is not
evidence of that.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
