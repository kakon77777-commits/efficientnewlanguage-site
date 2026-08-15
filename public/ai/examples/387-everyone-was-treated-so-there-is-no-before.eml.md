<!-- canonical: efficientnewlanguage.org/ai/examples/387-everyone-was-treated-so-there-is-no-before | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 387 — Everyone was treated, so there is no before - the mix shift hid 2.3 points of a 4.0 effect

`everyone_was_treated_so_there_is_no_before.eml` rebuilds month 3 from month 2's mix and month 2 from month 3's, so each cause can be measured separately.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The change went to
# everyone at once, so the only comparison left is with last month - and last
# month differs in more than one way.
#
# Shipping to everyone is often not a choice. A pricing change, a policy, a
# migration, a legal requirement: there is no version of them that applies to
# 90% of people. The experiment was not skipped; it was unavailable.
#
# What remains is before-and-after in time, and that comparison is sound exactly
# when nothing else moved. Here one other thing moved, and the program measures
# how much of the observed change each cause accounts for by rebuilding the
# months from their parts.

# [month, segment, users, base_rate, campaign_running, change_shipped]
[[1, "organic", 800, 20, 0, 0], [1, "paid", 200, 10, 0, 0], [2, "organic", 800, 20, 0, 0], [2, "paid", 200, 10, 0, 0], [3, "organic", 800, 20, 1, 1], [3, "paid", 600, 10, 1, 1]] => rows

4 => change_effect
0 => campaign_effect

def rate(r):
    r[3] => v
    if r[5] == 1:
        v + change_effect => v
    return v

def converted(r):
    return int(r[2] * rate(r) / 100)

def month_users(m):
    0 => t
    for r in rows:
        if r[0] == m:
            t + r[2] => t
    return t

def month_converted(m):
    0 => t
    for r in rows:
        if r[0] == m:
            t + converted(r) => t
    return t

def month_rate(m):
    return int(month_converted(m) * 1000 / month_users(m))

# Rendering tenths, including negative ones. int() truncates toward zero and
# % floors, so the two disagree below zero; the sign is taken out first.
def show(x):
    if x < 0:
        return "-" + str(int((0 - x) / 10)) + "." + str((0 - x) % 10) + "%"
    return str(int(x / 10)) + "." + str(x % 10) + "%"

"month   users   converted   rate" ^0
for m in [1:3]:
    "  " + str(m) + "      " + str(month_users(m)) + "     " + str(month_converted(m)) + "        " + show(month_rate(m)) ^0
"" ^0

"the before-and-after everyone will quote" ^0
"  month 2 : " + show(month_rate(2)) ^0
"  month 3 : " + show(month_rate(3)) ^0
"  change  : " + show(month_rate(3) - month_rate(2)) ^0
"" ^0

# ---- what else moved ----

"what differs between month 2 and month 3" ^0
for s in ["organic", "paid"]:
    0 => u2
    0 => u3
    for r in rows:
        if r[1] == s:
            if r[0] == 2:
                r[2] => u2
            if r[0] == 3:
                r[2] => u3
    "  " + s + " users : " + str(u2) + " -> " + str(u3) ^0
"  the change shipped in month 3, and the campaign ran in month 3" ^0
"" ^0

# ---- separating the two causes, by rebuilding month 3 twice ----

def rebuilt(mix_month, ship):
    0 => u
    0 => c
    for r in rows:
        if r[0] == mix_month:
            r[3] => v
            if ship == 1:
                v + change_effect => v
            u + r[2] => u
            c + int(r[2] * v / 100) => c
    return int(c * 1000 / u)

"month 3's mix, without the change" ^0
"  rate : " + show(rebuilt(3, 0)) ^0
"month 2's mix, with the change" ^0
"  rate : " + show(rebuilt(2, 1)) ^0
"" ^0

month_rate(3) - month_rate(2) => observed
rebuilt(3, 0) - month_rate(2) => from_mix
rebuilt(2, 1) - month_rate(2) => from_change
"decomposition" ^0
"  observed change     : " + show(observed) ^0
"  from the mix shift  : " + show(from_mix) ^0
"  from the change     : " + show(from_change) ^0
"  sum of the parts    : " + show(from_mix + from_change) ^0
"  left over           : " + show(observed - from_mix - from_change) ^0
if observed - from_mix - from_change == 0:
    "  the two parts account for the whole change, with nothing interacting" ^0
else:
    "  the parts do not account for the whole change - the remainder is" ^0
    "  the interaction between them" ^0
"" ^0

if from_mix < 0:
    "The mix shift alone would have made the number WORSE by " + show(0 - from_mix) + "." ^0
    "The reported improvement of " + show(observed) + " understates the change's own effect." ^0
"" ^0

# ---- the control: a month pair where only one thing moved ----
#
# Before-and-after is not broken. It is exactly right when the two periods
# differ in one way, and months 1 and 2 are that pair.

"control - months 1 and 2, where nothing moved" ^0
"  month 1 : " + show(month_rate(1)) ^0
"  month 2 : " + show(month_rate(2)) ^0
if month_rate(1) == month_rate(2):
    "  identical, so the comparison itself is sound" ^0
"" ^0

"Before and after is a controlled comparison with time as the control. It" ^0
"works when time held everything else still, and whether it did is a separate" ^0
"question that the two numbers cannot answer." ^0
```

## Python (deterministic transpilation)

```python
rows = [[1, "organic", 800, 20, 0, 0], [1, "paid", 200, 10, 0, 0], [2, "organic", 800, 20, 0, 0], [2, "paid", 200, 10, 0, 0], [3, "organic", 800, 20, 1, 1], [3, "paid", 600, 10, 1, 1]]
change_effect = 4
campaign_effect = 0

def rate(r):
    v = r[3]
    if r[5] == 1:
        v = v + change_effect
    return v

def converted(r):
    return int(r[2] * rate(r) / 100)

def month_users(m):
    t = 0
    for r in rows:
        if r[0] == m:
            t = t + r[2]
    return t

def month_converted(m):
    t = 0
    for r in rows:
        if r[0] == m:
            t = t + converted(r)
    return t

def month_rate(m):
    return int(month_converted(m) * 1000 / month_users(m))

def show(x):
    if x < 0:
        return "-" + str(int((0 - x) / 10)) + "." + str((0 - x) % 10) + "%"
    return str(int(x / 10)) + "." + str(x % 10) + "%"

print("month   users   converted   rate")
for m in range(1, 4):
    print("  " + str(m) + "      " + str(month_users(m)) + "     " + str(month_converted(m)) + "        " + show(month_rate(m)))
print("")
print("the before-and-after everyone will quote")
print("  month 2 : " + show(month_rate(2)))
print("  month 3 : " + show(month_rate(3)))
print("  change  : " + show(month_rate(3) - month_rate(2)))
print("")
print("what differs between month 2 and month 3")
for s in ["organic", "paid"]:
    u2 = 0
    u3 = 0
    for r in rows:
        if r[1] == s:
            if r[0] == 2:
                u2 = r[2]
            if r[0] == 3:
                u3 = r[2]
    print("  " + s + " users : " + str(u2) + " -> " + str(u3))
print("  the change shipped in month 3, and the campaign ran in month 3")
print("")

def rebuilt(mix_month, ship):
    u = 0
    c = 0
    for r in rows:
        if r[0] == mix_month:
            v = r[3]
            if ship == 1:
                v = v + change_effect
            u = u + r[2]
            c = c + int(r[2] * v / 100)
    return int(c * 1000 / u)

print("month 3's mix, without the change")
print("  rate : " + show(rebuilt(3, 0)))
print("month 2's mix, with the change")
print("  rate : " + show(rebuilt(2, 1)))
print("")
observed = month_rate(3) - month_rate(2)
from_mix = rebuilt(3, 0) - month_rate(2)
from_change = rebuilt(2, 1) - month_rate(2)
print("decomposition")
print("  observed change     : " + show(observed))
print("  from the mix shift  : " + show(from_mix))
print("  from the change     : " + show(from_change))
print("  sum of the parts    : " + show(from_mix + from_change))
print("  left over           : " + show(observed - from_mix - from_change))
if observed - from_mix - from_change == 0:
    print("  the two parts account for the whole change, with nothing interacting")
else:
    print("  the parts do not account for the whole change - the remainder is")
    print("  the interaction between them")
print("")
if from_mix < 0:
    print("The mix shift alone would have made the number WORSE by " + show(0 - from_mix) + ".")
    print("The reported improvement of " + show(observed) + " understates the change's own effect.")
print("")
print("control - months 1 and 2, where nothing moved")
print("  month 1 : " + show(month_rate(1)))
print("  month 2 : " + show(month_rate(2)))
if month_rate(1) == month_rate(2):
    print("  identical, so the comparison itself is sound")
print("")
print("Before and after is a controlled comparison with time as the control. It")
print("works when time held everything else still, and whether it did is a separate")
print("question that the two numbers cannot answer.")
```

## stdout (executed)

```text
month   users   converted   rate
  1      1000     180        18.0%
  2      1000     180        18.0%
  3      1400     276        19.7%

the before-and-after everyone will quote
  month 2 : 18.0%
  month 3 : 19.7%
  change  : 1.7%

what differs between month 2 and month 3
  organic users : 800 -> 800
  paid users : 200 -> 600
  the change shipped in month 3, and the campaign ran in month 3

month 3's mix, without the change
  rate : 15.7%
month 2's mix, with the change
  rate : 22.0%

decomposition
  observed change     : 1.7%
  from the mix shift  : -2.3%
  from the change     : 4.0%
  sum of the parts    : 1.7%
  left over           : 0.0%
  the two parts account for the whole change, with nothing interacting

The mix shift alone would have made the number WORSE by 2.3%.
The reported improvement of 1.7% understates the change's own effect.

control - months 1 and 2, where nothing moved
  month 1 : 18.0%
  month 2 : 18.0%
  identical, so the comparison itself is sound

Before and after is a controlled comparison with time as the control. It
works when time held everything else still, and whether it did is a separate
question that the two numbers cannot answer.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
