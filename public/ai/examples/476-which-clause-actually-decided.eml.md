<!-- canonical: efficientnewlanguage.org/ai/examples/476-which-clause-actually-decided | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 476 — Which clause actually decided

`which_clause_actually_decided.eml` - Access is granted if the caller is an administrator or owns the record. How often each of those was the reason is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Access is granted
# if the caller is an administrator or owns the record. How often each of those
# was the reason is computed below.
#
# The condition is correct and both clauses belong in it. Administrators need
# access to records they do not own, owners need access without being
# administrators, and writing both is the accurate statement of the policy.
#
# In the traffic the system actually sees, one clause may never be the
# deciding one. The condition still returns the right answer every time, and
# the other clause has never been exercised by anything - which is a fact
# about the population, not about the code.
#
# Each request is scored by which clause carried it.

# [request, caller is an administrator, caller owns the record]
[["q1", 1, 1], ["q2", 1, 1], ["q3", 1, 0], ["q4", 1, 1], ["q5", 0, 0], ["q6", 1, 1], ["q7", 1, 0], ["q8", 0, 0], ["q9", 1, 1], ["q10", 1, 0]] => requests

len(requests) => n

0 => granted
0 => admin_only
0 => owner_only
0 => both
0 => denied
for r in requests:
    if r[1] == 1:
        if r[2] == 1:
            both + 1 => both
            granted + 1 => granted
        else:
            admin_only + 1 => admin_only
            granted + 1 => granted
    else:
        if r[2] == 1:
            owner_only + 1 => owner_only
            granted + 1 => granted
        else:
            denied + 1 => denied

"requests : " + str(n) ^0
"  granted : " + str(granted) ^0
"  denied  : " + str(denied) ^0
"" ^0
"of the granted, which clause carried it" ^0
"  administrator only : " + str(admin_only) ^0
"  owner only         : " + str(owner_only) ^0
"  both were true     : " + str(both) ^0
"" ^0

if owner_only == 0:
    "the ownership clause has never been the deciding one" ^0
    "  it is correct, it is part of the policy, and removing it would change" ^0
    "  no answer in this traffic" ^0
"" ^0

# ---- what removing each clause would change ----

0 => without_owner
0 => without_admin
for r in requests:
    if r[1] == 1:
        without_owner + 1 => without_owner
    if r[2] == 1:
        without_admin + 1 => without_admin
"granted if the condition were only the administrator clause : " + str(without_owner) ^0
"granted if the condition were only the ownership clause     : " + str(without_admin) ^0
"granted by both together                                    : " + str(granted) ^0
if without_owner == granted:
    "  dropping the ownership clause changes nothing on this traffic" ^0
if without_admin < granted:
    "  dropping the administrator clause would change " + str(granted - without_admin) ^0
"" ^0

# ---- what a test suite built from this traffic proves ----

"what a suite drawn from these requests establishes" ^0
"  the administrator path works : yes, " + str(admin_only + both) + " requests" ^0
"  the ownership path works     : not exercised" ^0
if owner_only == 0:
    "  a defect in the ownership clause would pass every one of these" ^0
"" ^0

# ---- the input that would exercise it ----

"the request shape that has not appeared" ^0
"  a caller who owns the record and is not an administrator" ^0
0 => shape_count
for r in requests:
    if r[1] == 0:
        if r[2] == 1:
            shape_count + 1 => shape_count
"  requests of that shape in this traffic : " + str(shape_count) ^0
if shape_count == 0:
    "  it is one row of the truth table and it is the whole of one clause's" ^0
    "  coverage, so a single fixture would move it from untested to tested" ^0
"" ^0

# ---- the traffic where the other clause is the only one ----
#
# The same condition against a population of non-administrator owners. The
# ownership clause carries all of it, and the administrator clause is the
# untested one.

[["p1", 0, 1], ["p2", 0, 1], ["p3", 1, 1], ["p4", 0, 1]] => other_traffic
0 => o_admin_only
0 => o_owner_only
for r in other_traffic:
    if r[1] == 1:
        if r[2] == 0:
            o_admin_only + 1 => o_admin_only
    if r[1] == 0:
        if r[2] == 1:
            o_owner_only + 1 => o_owner_only
"the same condition against a different population" ^0
"  carried by ownership alone     : " + str(o_owner_only) ^0
"  carried by administrator alone : " + str(o_admin_only) ^0
if o_admin_only == 0:
    "  here it is the administrator clause that is never the reason" ^0
    "  which clause is dead is a property of who is calling" ^0
"" ^0

# ---- the control: a population that exercises both ----

[["m1", 1, 0], ["m2", 0, 1], ["m3", 1, 1], ["m4", 0, 0]] => mixed
0 => m_admin
0 => m_owner
for r in mixed:
    if r[1] == 1:
        if r[2] == 0:
            m_admin + 1 => m_admin
    if r[1] == 0:
        if r[2] == 1:
            m_owner + 1 => m_owner
"control - traffic containing every combination" ^0
"  administrator alone : " + str(m_admin) + ", owner alone : " + str(m_owner) ^0
if m_admin > 0:
    if m_owner > 0:
        "  both clauses are load-bearing here, and a defect in either one shows" ^0
"" ^0

"The condition is the accurate statement of the policy and it answers every" ^0
"request correctly. Which of its clauses has ever mattered is decided by who" ^0
"calls, and one of them has been carried by the other the whole time." ^0
```

## Python (deterministic transpilation)

```python
requests = [["q1", 1, 1], ["q2", 1, 1], ["q3", 1, 0], ["q4", 1, 1], ["q5", 0, 0], ["q6", 1, 1], ["q7", 1, 0], ["q8", 0, 0], ["q9", 1, 1], ["q10", 1, 0]]
n = len(requests)
granted = 0
admin_only = 0
owner_only = 0
both = 0
denied = 0
for r in requests:
    if r[1] == 1:
        if r[2] == 1:
            both = both + 1
            granted = granted + 1
        else:
            admin_only = admin_only + 1
            granted = granted + 1
    elif r[2] == 1:
        owner_only = owner_only + 1
        granted = granted + 1
    else:
        denied = denied + 1
print("requests : " + str(n))
print("  granted : " + str(granted))
print("  denied  : " + str(denied))
print("")
print("of the granted, which clause carried it")
print("  administrator only : " + str(admin_only))
print("  owner only         : " + str(owner_only))
print("  both were true     : " + str(both))
print("")
if owner_only == 0:
    print("the ownership clause has never been the deciding one")
    print("  it is correct, it is part of the policy, and removing it would change")
    print("  no answer in this traffic")
print("")
without_owner = 0
without_admin = 0
for r in requests:
    if r[1] == 1:
        without_owner = without_owner + 1
    if r[2] == 1:
        without_admin = without_admin + 1
print("granted if the condition were only the administrator clause : " + str(without_owner))
print("granted if the condition were only the ownership clause     : " + str(without_admin))
print("granted by both together                                    : " + str(granted))
if without_owner == granted:
    print("  dropping the ownership clause changes nothing on this traffic")
if without_admin < granted:
    print("  dropping the administrator clause would change " + str(granted - without_admin))
print("")
print("what a suite drawn from these requests establishes")
print("  the administrator path works : yes, " + str(admin_only + both) + " requests")
print("  the ownership path works     : not exercised")
if owner_only == 0:
    print("  a defect in the ownership clause would pass every one of these")
print("")
print("the request shape that has not appeared")
print("  a caller who owns the record and is not an administrator")
shape_count = 0
for r in requests:
    if r[1] == 0:
        if r[2] == 1:
            shape_count = shape_count + 1
print("  requests of that shape in this traffic : " + str(shape_count))
if shape_count == 0:
    print("  it is one row of the truth table and it is the whole of one clause's")
    print("  coverage, so a single fixture would move it from untested to tested")
print("")
other_traffic = [["p1", 0, 1], ["p2", 0, 1], ["p3", 1, 1], ["p4", 0, 1]]
o_admin_only = 0
o_owner_only = 0
for r in other_traffic:
    if r[1] == 1:
        if r[2] == 0:
            o_admin_only = o_admin_only + 1
    if r[1] == 0:
        if r[2] == 1:
            o_owner_only = o_owner_only + 1
print("the same condition against a different population")
print("  carried by ownership alone     : " + str(o_owner_only))
print("  carried by administrator alone : " + str(o_admin_only))
if o_admin_only == 0:
    print("  here it is the administrator clause that is never the reason")
    print("  which clause is dead is a property of who is calling")
print("")
mixed = [["m1", 1, 0], ["m2", 0, 1], ["m3", 1, 1], ["m4", 0, 0]]
m_admin = 0
m_owner = 0
for r in mixed:
    if r[1] == 1:
        if r[2] == 0:
            m_admin = m_admin + 1
    if r[1] == 0:
        if r[2] == 1:
            m_owner = m_owner + 1
print("control - traffic containing every combination")
print("  administrator alone : " + str(m_admin) + ", owner alone : " + str(m_owner))
if m_admin > 0:
    if m_owner > 0:
        print("  both clauses are load-bearing here, and a defect in either one shows")
print("")
print("The condition is the accurate statement of the policy and it answers every")
print("request correctly. Which of its clauses has ever mattered is decided by who")
print("calls, and one of them has been carried by the other the whole time.")
```

## stdout (executed)

```text
requests : 10
  granted : 8
  denied  : 2

of the granted, which clause carried it
  administrator only : 3
  owner only         : 0
  both were true     : 5

the ownership clause has never been the deciding one
  it is correct, it is part of the policy, and removing it would change
  no answer in this traffic

granted if the condition were only the administrator clause : 8
granted if the condition were only the ownership clause     : 5
granted by both together                                    : 8
  dropping the ownership clause changes nothing on this traffic
  dropping the administrator clause would change 3

what a suite drawn from these requests establishes
  the administrator path works : yes, 8 requests
  the ownership path works     : not exercised
  a defect in the ownership clause would pass every one of these

the request shape that has not appeared
  a caller who owns the record and is not an administrator
  requests of that shape in this traffic : 0
  it is one row of the truth table and it is the whole of one clause's
  coverage, so a single fixture would move it from untested to tested

the same condition against a different population
  carried by ownership alone     : 3
  carried by administrator alone : 0
  here it is the administrator clause that is never the reason
  which clause is dead is a property of who is calling

control - traffic containing every combination
  administrator alone : 1, owner alone : 1
  both clauses are load-bearing here, and a defect in either one shows

The condition is the accurate statement of the policy and it answers every
request correctly. Which of its clauses has ever mattered is decided by who
calls, and one of them has been carried by the other the whole time.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
