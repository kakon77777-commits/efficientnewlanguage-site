<!-- canonical: efficientnewlanguage.org/ai/examples/377-the-clarification-arrives-after-the-decision | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 377 — The clarification arrives after the decision — 3 wrong reviews, and waiting 3 days fixes all of them

`the_clarification_arrives_after_the_decision.eml` replays every decision at its own time and again with everything that eventually arrived.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The disambiguating
# fact is not missing. It lands three days after the decision it would change.
#
# This is the version of the problem that survives every fix aimed at content.
# The basis is written down, the schema has a field for it, the consumer reads
# that field - and the field is filled in by a reconciliation job that runs on a
# slower clock than the thing making decisions.
#
# So the decision maker is never wrong about what it knew; it is wrong about
# what was knowable. Both are computed here by replaying each decision at its
# own time and again with everything that eventually arrived.

# [day, order, provisional_amount, final_amount, final_known_on_day]
[[1, "o1", 100, 100, 1], [1, "o2", 400, 250, 4], [2, "o3", 120, 120, 2], [2, "o4", 500, 500, 2], [3, "o5", 300, 90, 6], [3, "o6", 150, 150, 3], [4, "o7", 700, 700, 4], [5, "o8", 260, 80, 8], [5, "o9", 110, 110, 5], [6, "o10", 900, 900, 6]] => orders

250 => threshold

def amount_known_on(o, d):
    if d >= o[4]:
        return o[3]
    return o[2]

def flagged_on(o, d):
    if amount_known_on(o, d) > threshold:
        return 1
    return 0

def flagged_final(o):
    if o[3] > threshold:
        return 1
    return 0

"orders : " + str(len(orders)) + ", review threshold : " + str(threshold) ^0
0 => revised
for o in orders:
    if not (o[2] == o[3]):
        revised + 1 => revised
"  orders whose amount was later revised : " + str(revised) ^0
"" ^0

# ---- the decision, made on the day the order arrives ----

"decisions made at arrival time" ^0
0 => flagged_then
for o in orders:
    flagged_on(o, o[0]) => f
    flagged_then + f => flagged_then
    if f == 1:
        "  " + o[1] + " day " + str(o[0]) + " : amount " + str(amount_known_on(o, o[0])) + " -> review" ^0
"  flagged : " + str(flagged_then) ^0
"" ^0

"the same rule, on the amounts that turned out to be true" ^0
0 => flagged_now
for o in orders:
    flagged_final(o) => f
    flagged_now + f => flagged_now
"  flagged : " + str(flagged_now) ^0
"" ^0

# ---- where the two disagree, split by direction ----

0 => wrongly_flagged
0 => wrongly_cleared
for o in orders:
    flagged_on(o, o[0]) => a
    flagged_final(o) => b
    if a == 1:
        if b == 0:
            wrongly_flagged + 1 => wrongly_flagged
            "  " + o[1] + " : reviewed on " + str(o[2]) + ", actually " + str(o[3]) ^0
    else:
        if b == 1:
            wrongly_cleared + 1 => wrongly_cleared
            "  " + o[1] + " : cleared on " + str(o[2]) + ", actually " + str(o[3]) ^0
"  reviewed and should not have been : " + str(wrongly_flagged) ^0
"  cleared and should not have been  : " + str(wrongly_cleared) ^0
"" ^0

# ---- how long the answer was unavailable ----

"lag between arrival and the final amount" ^0
0 => total_lag
0 => worst
for o in orders:
    o[4] - o[0] => lag
    total_lag + lag => total_lag
    if lag > worst:
        lag => worst
"  total order-days of lag : " + str(total_lag) ^0
"  longest lag             : " + str(worst) ^0
"" ^0

# ---- waiting is not free either ----
#
# Deciding later is the obvious repair. It is measured rather than assumed:
# how many decisions are right if every order waits d days before being judged.

"if every decision waited d days" ^0
for d in [0:4]:
    0 => correct
    for o in orders:
        if flagged_on(o, o[0] + d) == flagged_final(o):
            correct + 1 => correct
    "  wait " + str(d) + " days : " + str(correct) + " of " + str(len(orders)) + " decisions match the final answer" ^0
"" ^0

# ---- the control: orders whose amount never moved ----
#
# For those, arrival-time and final-time decisions agree by construction, so the
# disagreement above is not an artifact of the rule or the threshold.

0 => stable
0 => stable_agree
for o in orders:
    if o[2] == o[3]:
        stable + 1 => stable
        if flagged_on(o, o[0]) == flagged_final(o):
            stable_agree + 1 => stable_agree
"control - orders that were never revised" ^0
"  orders : " + str(stable) ^0
"  where the two decisions agree : " + str(stable_agree) ^0
if stable_agree == stable:
    "  the rule is not the problem" ^0
"" ^0

"The clarifying fact exists, has a field, and is read. It is simply not there" ^0
"yet at the moment something has to be decided, and no amount of writing the" ^0
"definition down moves it earlier." ^0
```

## Python (deterministic transpilation)

```python
orders = [[1, "o1", 100, 100, 1], [1, "o2", 400, 250, 4], [2, "o3", 120, 120, 2], [2, "o4", 500, 500, 2], [3, "o5", 300, 90, 6], [3, "o6", 150, 150, 3], [4, "o7", 700, 700, 4], [5, "o8", 260, 80, 8], [5, "o9", 110, 110, 5], [6, "o10", 900, 900, 6]]
threshold = 250

def amount_known_on(o, d):
    if d >= o[4]:
        return o[3]
    return o[2]

def flagged_on(o, d):
    if amount_known_on(o, d) > threshold:
        return 1
    return 0

def flagged_final(o):
    if o[3] > threshold:
        return 1
    return 0

print("orders : " + str(len(orders)) + ", review threshold : " + str(threshold))
revised = 0
for o in orders:
    if not o[2] == o[3]:
        revised = revised + 1
print("  orders whose amount was later revised : " + str(revised))
print("")
print("decisions made at arrival time")
flagged_then = 0
for o in orders:
    f = flagged_on(o, o[0])
    flagged_then = flagged_then + f
    if f == 1:
        print("  " + o[1] + " day " + str(o[0]) + " : amount " + str(amount_known_on(o, o[0])) + " -> review")
print("  flagged : " + str(flagged_then))
print("")
print("the same rule, on the amounts that turned out to be true")
flagged_now = 0
for o in orders:
    f = flagged_final(o)
    flagged_now = flagged_now + f
print("  flagged : " + str(flagged_now))
print("")
wrongly_flagged = 0
wrongly_cleared = 0
for o in orders:
    a = flagged_on(o, o[0])
    b = flagged_final(o)
    if a == 1:
        if b == 0:
            wrongly_flagged = wrongly_flagged + 1
            print("  " + o[1] + " : reviewed on " + str(o[2]) + ", actually " + str(o[3]))
    elif b == 1:
        wrongly_cleared = wrongly_cleared + 1
        print("  " + o[1] + " : cleared on " + str(o[2]) + ", actually " + str(o[3]))
print("  reviewed and should not have been : " + str(wrongly_flagged))
print("  cleared and should not have been  : " + str(wrongly_cleared))
print("")
print("lag between arrival and the final amount")
total_lag = 0
worst = 0
for o in orders:
    lag = o[4] - o[0]
    total_lag = total_lag + lag
    if lag > worst:
        worst = lag
print("  total order-days of lag : " + str(total_lag))
print("  longest lag             : " + str(worst))
print("")
print("if every decision waited d days")
for d in range(0, 5):
    correct = 0
    for o in orders:
        if flagged_on(o, o[0] + d) == flagged_final(o):
            correct = correct + 1
    print("  wait " + str(d) + " days : " + str(correct) + " of " + str(len(orders)) + " decisions match the final answer")
print("")
stable = 0
stable_agree = 0
for o in orders:
    if o[2] == o[3]:
        stable = stable + 1
        if flagged_on(o, o[0]) == flagged_final(o):
            stable_agree = stable_agree + 1
print("control - orders that were never revised")
print("  orders : " + str(stable))
print("  where the two decisions agree : " + str(stable_agree))
if stable_agree == stable:
    print("  the rule is not the problem")
print("")
print("The clarifying fact exists, has a field, and is read. It is simply not there")
print("yet at the moment something has to be decided, and no amount of writing the")
print("definition down moves it earlier.")
```

## stdout (executed)

```text
orders : 10, review threshold : 250
  orders whose amount was later revised : 3

decisions made at arrival time
  o2 day 1 : amount 400 -> review
  o4 day 2 : amount 500 -> review
  o5 day 3 : amount 300 -> review
  o7 day 4 : amount 700 -> review
  o8 day 5 : amount 260 -> review
  o10 day 6 : amount 900 -> review
  flagged : 6

the same rule, on the amounts that turned out to be true
  flagged : 3

  o2 : reviewed on 400, actually 250
  o5 : reviewed on 300, actually 90
  o8 : reviewed on 260, actually 80
  reviewed and should not have been : 3
  cleared and should not have been  : 0

lag between arrival and the final amount
  total order-days of lag : 9
  longest lag             : 3

if every decision waited d days
  wait 0 days : 7 of 10 decisions match the final answer
  wait 1 days : 7 of 10 decisions match the final answer
  wait 2 days : 7 of 10 decisions match the final answer
  wait 3 days : 10 of 10 decisions match the final answer
  wait 4 days : 10 of 10 decisions match the final answer

control - orders that were never revised
  orders : 7
  where the two decisions agree : 7
  the rule is not the problem

The clarifying fact exists, has a field, and is read. It is simply not there
yet at the moment something has to be decided, and no amount of writing the
definition down moves it earlier.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
