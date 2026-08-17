<!-- canonical: efficientnewlanguage.org/ai/examples/420-one-customer-set-the-roadmap | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 420 — One customer set the roadmap

`one_customer_set_the_roadmap.eml` - One account is 4% of revenue and most of the roadmap.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One account is
# 4% of revenue and most of the roadmap.
#
# Listening to them is not a mistake. They are the customer who writes detailed,
# specific, actionable requests instead of churning silently, and every item
# they asked for is a real gap - a team that ignored them would be ignoring the
# best-articulated feedback it receives.
#
# What makes their requests visible is that they are written down. Everyone
# else's needs exist too; they arrive as silence, as a support ticket closed
# with a workaround, or as a renewal that does not happen.
#
# Both shares are computed from the same account list, so "how much of the
# roadmap" and "how much of the business" are measured on one scale.

# [account, revenue, feature requests filed, requests shipped]
[["a1", 40, 22, 9], ["a2", 120, 1, 0], ["a3", 200, 0, 0], ["a4", 150, 2, 1], ["a5", 90, 0, 0], ["a6", 180, 1, 0], ["a7", 110, 3, 1], ["a8", 60, 0, 0], ["a9", 50, 1, 0]] => accounts

def total(col):
    0 => t
    for a in accounts:
        t + a[col] => t
    return t

"accounts : " + str(len(accounts)) ^0
"  total revenue      : " + str(total(1)) ^0
"  requests filed     : " + str(total(2)) ^0
"  requests shipped   : " + str(total(3)) ^0
"" ^0

# ---- the loudest account ----

0 => loud
0 => loud_at
0 => i
for a in accounts:
    if a[2] > loud:
        a[2] => loud
        i => loud_at
    i + 1 => i

accounts[loud_at] => la
"the account that files the most" ^0
"  " + la[0] ^0
"  share of revenue : " + str(int(la[1] * 100 / total(1))) + "%" ^0
"  share of filed requests : " + str(int(la[2] * 100 / total(2))) + "%" ^0
"  share of shipped work   : " + str(int(la[3] * 100 / total(3))) + "%" ^0
"" ^0

# ---- how many accounts filed nothing ----

0 => silent
0 => silent_revenue
for a in accounts:
    if a[2] == 0:
        silent + 1 => silent
        silent_revenue + a[1] => silent_revenue
"the accounts that filed nothing" ^0
"  count   : " + str(silent) + " of " + str(len(accounts)) ^0
"  revenue : " + str(silent_revenue) + "  (" + str(int(silent_revenue * 100 / total(1))) + "% of the business)" ^0
"  shipped work attributable to them : 0" ^0
"" ^0

# ---- what the roadmap would look like weighted by revenue ----

def revenue_share_of_shipping(a):
    return int(a[1] * total(3) / total(1))

"shipped items, actual against revenue-weighted" ^0
for a in accounts:
    if a[2] > 0:
        "  " + a[0] + " : shipped " + str(a[3]) + ", revenue share would give " + str(revenue_share_of_shipping(a)) ^0
"" ^0

la[3] - revenue_share_of_shipping(la) => overweight
"  " + la[0] + " received " + str(overweight) + " more items than its revenue share" ^0
"" ^0

# ---- is the loud account actually unrepresentative ----
#
# The case would be much weaker if their requests were things everyone needs.
# Whether the requests are shared is a separate fact, stated as data.

# [request from the loud account, how many other accounts also need it]
[["custom SSO domain", 0], ["bulk CSV import", 4], ["audit log export", 1], ["per-seat billing split", 0], ["legacy API shim", 0]] => their_requests

0 => shared
0 => unique
for r in their_requests:
    if r[1] > 0:
        shared + 1 => shared
    else:
        unique + 1 => unique
"their requests, by how many other accounts need the same thing" ^0
for r in their_requests:
    "  " + r[0] + " : " + str(r[1]) + " others" ^0
"  needed by somebody else : " + str(shared) ^0
"  needed by them alone    : " + str(unique) ^0
if unique > shared:
    "  most of what they ask for is theirs alone" ^0
"" ^0

# ---- the control: a loud account whose requests are shared ----
#
# Volume of feedback is not the defect. A vocal account that happens to want
# what everyone wants is the cheapest research a team can get.

[["shared A", 6], ["shared B", 5], ["shared C", 4]] => other_requests
0 => other_shared
for r in other_requests:
    if r[1] > 0:
        other_shared + 1 => other_shared
"control - a vocal account asking for what others also need" ^0
"  requests : " + str(len(other_requests)) + ", needed by others : " + str(other_shared) ^0
if other_shared == len(other_requests):
    "  here following the loudest voice is following the population" ^0
"" ^0

"Every request was real and every one was a genuine gap. Which gaps get" ^0
"written down is a property of who writes, and the roadmap is built from" ^0
"what is written." ^0
```

## Python (deterministic transpilation)

```python
accounts = [["a1", 40, 22, 9], ["a2", 120, 1, 0], ["a3", 200, 0, 0], ["a4", 150, 2, 1], ["a5", 90, 0, 0], ["a6", 180, 1, 0], ["a7", 110, 3, 1], ["a8", 60, 0, 0], ["a9", 50, 1, 0]]

def total(col):
    t = 0
    for a in accounts:
        t = t + a[col]
    return t

print("accounts : " + str(len(accounts)))
print("  total revenue      : " + str(total(1)))
print("  requests filed     : " + str(total(2)))
print("  requests shipped   : " + str(total(3)))
print("")
loud = 0
loud_at = 0
i = 0
for a in accounts:
    if a[2] > loud:
        loud = a[2]
        loud_at = i
    i = i + 1
la = accounts[loud_at]
print("the account that files the most")
print("  " + la[0])
print("  share of revenue : " + str(int(la[1] * 100 / total(1))) + "%")
print("  share of filed requests : " + str(int(la[2] * 100 / total(2))) + "%")
print("  share of shipped work   : " + str(int(la[3] * 100 / total(3))) + "%")
print("")
silent = 0
silent_revenue = 0
for a in accounts:
    if a[2] == 0:
        silent = silent + 1
        silent_revenue = silent_revenue + a[1]
print("the accounts that filed nothing")
print("  count   : " + str(silent) + " of " + str(len(accounts)))
print("  revenue : " + str(silent_revenue) + "  (" + str(int(silent_revenue * 100 / total(1))) + "% of the business)")
print("  shipped work attributable to them : 0")
print("")

def revenue_share_of_shipping(a):
    return int(a[1] * total(3) / total(1))

print("shipped items, actual against revenue-weighted")
for a in accounts:
    if a[2] > 0:
        print("  " + a[0] + " : shipped " + str(a[3]) + ", revenue share would give " + str(revenue_share_of_shipping(a)))
print("")
overweight = la[3] - revenue_share_of_shipping(la)
print("  " + la[0] + " received " + str(overweight) + " more items than its revenue share")
print("")
their_requests = [["custom SSO domain", 0], ["bulk CSV import", 4], ["audit log export", 1], ["per-seat billing split", 0], ["legacy API shim", 0]]
shared = 0
unique = 0
for r in their_requests:
    if r[1] > 0:
        shared = shared + 1
    else:
        unique = unique + 1
print("their requests, by how many other accounts need the same thing")
for r in their_requests:
    print("  " + r[0] + " : " + str(r[1]) + " others")
print("  needed by somebody else : " + str(shared))
print("  needed by them alone    : " + str(unique))
if unique > shared:
    print("  most of what they ask for is theirs alone")
print("")
other_requests = [["shared A", 6], ["shared B", 5], ["shared C", 4]]
other_shared = 0
for r in other_requests:
    if r[1] > 0:
        other_shared = other_shared + 1
print("control - a vocal account asking for what others also need")
print("  requests : " + str(len(other_requests)) + ", needed by others : " + str(other_shared))
if other_shared == len(other_requests):
    print("  here following the loudest voice is following the population")
print("")
print("Every request was real and every one was a genuine gap. Which gaps get")
print("written down is a property of who writes, and the roadmap is built from")
print("what is written.")
```

## stdout (executed)

```text
accounts : 9
  total revenue      : 1000
  requests filed     : 30
  requests shipped   : 11

the account that files the most
  a1
  share of revenue : 4%
  share of filed requests : 73%
  share of shipped work   : 81%

the accounts that filed nothing
  count   : 3 of 9
  revenue : 350  (35% of the business)
  shipped work attributable to them : 0

shipped items, actual against revenue-weighted
  a1 : shipped 9, revenue share would give 0
  a2 : shipped 0, revenue share would give 1
  a4 : shipped 1, revenue share would give 1
  a6 : shipped 0, revenue share would give 1
  a7 : shipped 1, revenue share would give 1
  a9 : shipped 0, revenue share would give 0

  a1 received 9 more items than its revenue share

their requests, by how many other accounts need the same thing
  custom SSO domain : 0 others
  bulk CSV import : 4 others
  audit log export : 1 others
  per-seat billing split : 0 others
  legacy API shim : 0 others
  needed by somebody else : 2
  needed by them alone    : 3
  most of what they ask for is theirs alone

control - a vocal account asking for what others also need
  requests : 3, needed by others : 3
  here following the loudest voice is following the population

Every request was real and every one was a genuine gap. Which gaps get
written down is a property of who writes, and the roadmap is built from
what is written.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
