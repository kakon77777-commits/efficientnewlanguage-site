<!-- canonical: efficientnewlanguage.org/ai/examples/389-not-deciding-had-a-cost-and-no-owner | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 389 — Not deciding had a cost and no owner - waiting overtakes being wrong at week 17

`not_deciding_had_a_cost_and_no_owner.eml` computes both costs on the same scale, week by week, so the comparison nobody makes is available to make.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Waiting cost more
# than being wrong would have, and nobody's name is on it.
#
# Waiting for better evidence is the responsible instinct and it is usually
# right. A wrong decision has an owner, a postmortem and a number attached to
# it. Waiting has none of those, which is exactly why it is the safe option
# for the person choosing - and why its price is never compared with the price
# it is avoiding.
#
# Both costs are computed here on the same scale, week by week, so the
# comparison that nobody makes is available to make.

40 => weekly_cost_of_waiting
600 => cost_if_wrong
1 => weeks_before_a_wrong_call_is_caught

def cost_of_waiting(weeks):
    return weeks * weekly_cost_of_waiting

def cost_of_deciding_wrong():
    return cost_if_wrong + weeks_before_a_wrong_call_is_caught * weekly_cost_of_waiting

"weekly cost of not having decided : " + str(weekly_cost_of_waiting) ^0
"cost of a wrong decision, caught after " + str(weeks_before_a_wrong_call_is_caught) + " week(s) : " + str(cost_of_deciding_wrong()) ^0
"" ^0

"weeks waited   cost of waiting   cost of having been wrong" ^0
for w in [1:20]:
    if w % 4 == 0:
        "  " + str(w) + "             " + str(cost_of_waiting(w)) + "              " + str(cost_of_deciding_wrong()) ^0
"" ^0

0 => crossover
for w in [1:52]:
    if cost_of_waiting(w) > cost_of_deciding_wrong():
        if crossover == 0:
            w => crossover
"the week at which waiting has cost more than being wrong would have : " + str(crossover) ^0
"" ^0

# ---- who the cost is charged to ----

"attribution" ^0
"  a wrong decision : has an owner, a postmortem, and a number" ^0
"  waiting          : has none of those" ^0
"  and after " + str(crossover) + " weeks it is the larger number" ^0
"" ^0

# ---- what waiting has to buy to be worth it ----
#
# Waiting is not free and it is not worthless: it buys a lower chance of being
# wrong. What it has to buy is computed rather than assumed - the wrong-call
# cost it must remove to pay for itself.

"what each week of waiting must remove from the risk to pay for itself" ^0
for w in [4, 8, 12, 16, 20]:
    cost_of_waiting(w) => c
    "  " + str(w) + " weeks costs " + str(c) + " - worth it only if it removes at least " + str(int(c * 100 / cost_of_deciding_wrong())) + "% of the wrong-call cost" ^0
"" ^0

0 => impossible
for w in [1:52]:
    if cost_of_waiting(w) > cost_of_deciding_wrong():
        if impossible == 0:
            w => impossible
"  from week " + str(impossible) + " on, waiting costs more than the entire risk it is" ^0
"  reducing, so no amount of certainty makes it worth it" ^0
"" ^0

# ---- the control: a decision whose delay costs nothing ----
#
# Not every deferral is expensive. When the option stays open at no charge,
# waiting for better evidence is straightforwardly correct, and the difference
# is the weekly cost - not the size of the decision.

0 => free_weekly
def cost_of_waiting_free(weeks):
    return weeks * free_weekly

"control - a decision that costs nothing to defer" ^0
"  20 weeks of waiting : " + str(cost_of_waiting_free(20)) ^0
"  cost of being wrong : " + str(cost_of_deciding_wrong()) ^0
if cost_of_waiting_free(20) < cost_of_deciding_wrong():
    "  here waiting is free and the wrong call is not, so wait" ^0
"" ^0

"Both branches have a price. Only one of them produces a document with a name" ^0
"at the top, and that is a fact about the process rather than about the two" ^0
"numbers." ^0
```

## Python (deterministic transpilation)

```python
weekly_cost_of_waiting = 40
cost_if_wrong = 600
weeks_before_a_wrong_call_is_caught = 1

def cost_of_waiting(weeks):
    return weeks * weekly_cost_of_waiting

def cost_of_deciding_wrong():
    return cost_if_wrong + weeks_before_a_wrong_call_is_caught * weekly_cost_of_waiting

print("weekly cost of not having decided : " + str(weekly_cost_of_waiting))
print("cost of a wrong decision, caught after " + str(weeks_before_a_wrong_call_is_caught) + " week(s) : " + str(cost_of_deciding_wrong()))
print("")
print("weeks waited   cost of waiting   cost of having been wrong")
for w in range(1, 21):
    if w % 4 == 0:
        print("  " + str(w) + "             " + str(cost_of_waiting(w)) + "              " + str(cost_of_deciding_wrong()))
print("")
crossover = 0
for w in range(1, 53):
    if cost_of_waiting(w) > cost_of_deciding_wrong():
        if crossover == 0:
            crossover = w
print("the week at which waiting has cost more than being wrong would have : " + str(crossover))
print("")
print("attribution")
print("  a wrong decision : has an owner, a postmortem, and a number")
print("  waiting          : has none of those")
print("  and after " + str(crossover) + " weeks it is the larger number")
print("")
print("what each week of waiting must remove from the risk to pay for itself")
for w in [4, 8, 12, 16, 20]:
    c = cost_of_waiting(w)
    print("  " + str(w) + " weeks costs " + str(c) + " - worth it only if it removes at least " + str(int(c * 100 / cost_of_deciding_wrong())) + "% of the wrong-call cost")
print("")
impossible = 0
for w in range(1, 53):
    if cost_of_waiting(w) > cost_of_deciding_wrong():
        if impossible == 0:
            impossible = w
print("  from week " + str(impossible) + " on, waiting costs more than the entire risk it is")
print("  reducing, so no amount of certainty makes it worth it")
print("")
free_weekly = 0

def cost_of_waiting_free(weeks):
    return weeks * free_weekly

print("control - a decision that costs nothing to defer")
print("  20 weeks of waiting : " + str(cost_of_waiting_free(20)))
print("  cost of being wrong : " + str(cost_of_deciding_wrong()))
if cost_of_waiting_free(20) < cost_of_deciding_wrong():
    print("  here waiting is free and the wrong call is not, so wait")
print("")
print("Both branches have a price. Only one of them produces a document with a name")
print("at the top, and that is a fact about the process rather than about the two")
print("numbers.")
```

## stdout (executed)

```text
weekly cost of not having decided : 40
cost of a wrong decision, caught after 1 week(s) : 640

weeks waited   cost of waiting   cost of having been wrong
  4             160              640
  8             320              640
  12             480              640
  16             640              640
  20             800              640

the week at which waiting has cost more than being wrong would have : 17

attribution
  a wrong decision : has an owner, a postmortem, and a number
  waiting          : has none of those
  and after 17 weeks it is the larger number

what each week of waiting must remove from the risk to pay for itself
  4 weeks costs 160 - worth it only if it removes at least 25% of the wrong-call cost
  8 weeks costs 320 - worth it only if it removes at least 50% of the wrong-call cost
  12 weeks costs 480 - worth it only if it removes at least 75% of the wrong-call cost
  16 weeks costs 640 - worth it only if it removes at least 100% of the wrong-call cost
  20 weeks costs 800 - worth it only if it removes at least 125% of the wrong-call cost

  from week 17 on, waiting costs more than the entire risk it is
  reducing, so no amount of certainty makes it worth it

control - a decision that costs nothing to defer
  20 weeks of waiting : 0
  cost of being wrong : 640
  here waiting is free and the wrong call is not, so wait

Both branches have a price. Only one of them produces a document with a name
at the top, and that is a fact about the process rather than about the two
numbers.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
