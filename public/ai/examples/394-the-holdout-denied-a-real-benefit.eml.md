<!-- canonical: efficientnewlanguage.org/ai/examples/394-the-holdout-denied-a-real-benefit | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 394 — The holdout denied a real benefit - 320 in the good world, 2200 saved in the bad one

`the_holdout_denied_a_real_benefit.eml` runs both worlds to completion and prints them side by side. No probability is assumed anywhere.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The holdout was
# right, and it was paid for in the thing it was protecting. The amount is
# computed below rather than stated here, because a number in a comment is a
# number nothing checks.
#
# The four cases before this one all end with the same recommendation, so this
# one measures what that recommendation costs. A holdout is not free and its
# price is not overhead: it is paid in exactly the currency the change was
# supposed to produce, by real users who were kept away from something good.
#
# Two worlds are run to completion: one where the change helps, one where it
# harms. The cost lands in the first and the saving in the second, and the
# whole difficulty is that they are the same decision made before either is
# known.
#
# No probability is assumed anywhere. Both worlds are computed in full and
# printed side by side, because weighing them is the reader's judgement and
# not a fact this program has.

100 => population
20 => holdout_size
6 => periods
2 => periods_to_decide

8 => effect_if_good
-5 => effect_if_bad

def effect(world):
    if world == 1:
        return effect_if_good
    return effect_if_bad

# Roll out to everyone from period 1, no holdout, never revisited.
def value_no_holdout(world):
    return population * effect(world) * periods

# Hold back `holdout_size` for `periods_to_decide`, then act on the answer.
def value_with_holdout(world):
    (population - holdout_size) * effect(world) * periods_to_decide => v
    if world == 1:
        v + population * effect(world) * (periods - periods_to_decide) => v
    return v

"population " + str(population) + ", holdout " + str(holdout_size) + ", " + str(periods) + " periods, decision after " + str(periods_to_decide) ^0
"" ^0

for w in [1, 0]:
    if w == 1:
        "WORLD GOOD - the change is worth " + str(effect_if_good) + " per unit per period" ^0
    else:
        "WORLD BAD - the change costs " + str(0 - effect_if_bad) + " per unit per period" ^0
    "  rolled out to everyone : " + str(value_no_holdout(w)) ^0
    "  with the holdout       : " + str(value_with_holdout(w)) ^0
    "  difference             : " + str(value_with_holdout(w) - value_no_holdout(w)) ^0
    "" ^0

value_with_holdout(1) - value_no_holdout(1) => cost_good
value_with_holdout(0) - value_no_holdout(0) => saved_bad
"  the holdout costs  " + str(0 - cost_good) + " in the world where the change is good" ^0
"  the holdout saves  " + str(saved_bad) + " in the world where it is bad" ^0
if saved_bad > 0 - cost_good:
    "  the saving is larger than the cost, and which world you are in is the" ^0
    "  thing nobody knows at the moment of choosing" ^0
"" ^0

# ---- where the cost comes from ----

"the cost in the good world, decomposed" ^0
holdout_size * effect_if_good * periods_to_decide => denied
"  units held back        : " + str(holdout_size) ^0
"  periods held back      : " + str(periods_to_decide) ^0
"  benefit denied to them : " + str(denied) ^0
if denied == 0 - cost_good:
    "  and that is the entire cost - the holdout delays nothing for anyone else" ^0
"" ^0

# ---- the two knobs, and what each does to the cost ----

def cost_for(size, decide):
    return size * effect_if_good * decide

"cost in the good world, by holdout size (deciding after " + str(periods_to_decide) + ")" ^0
for s in [5, 10, 20, 40]:
    "  size " + str(s) + " : " + str(cost_for(s, periods_to_decide)) ^0
"" ^0
"cost in the good world, by how long you wait (holdout " + str(holdout_size) + ")" ^0
for d in [1, 2, 3, 4]:
    "  " + str(d) + " periods : " + str(cost_for(holdout_size, d)) ^0
"" ^0

# ---- and the cost of deciding on a holdout too small to decide ----
#
# Cutting the holdout to cut the cost only works if the smaller one still
# answers. A holdout that cannot answer costs its price and buys nothing, so
# it is strictly worse than both alternatives.

"a holdout of 5 that cannot separate the two worlds" ^0
"  its cost in the good world : " + str(cost_for(5, periods_to_decide)) ^0
"  what it buys               : nothing, because it does not decide" ^0
"  full rollout would cost    : 0 in the good world, " + str(0 - value_no_holdout(0)) + " in the bad one" ^0
"  so it is worse than rolling out AND worse than a holdout that works" ^0
"" ^0

"Every case before this one recommends a holdout. This is the bill: it is" ^0
"paid in the currency the change was meant to produce, by the people it was" ^0
"meant to help, and it is paid in exactly the world where the decision turns" ^0
"out not to have needed making." ^0
```

## Python (deterministic transpilation)

```python
population = 100
holdout_size = 20
periods = 6
periods_to_decide = 2
effect_if_good = 8
effect_if_bad = -5

def effect(world):
    if world == 1:
        return effect_if_good
    return effect_if_bad

def value_no_holdout(world):
    return population * effect(world) * periods

def value_with_holdout(world):
    v = (population - holdout_size) * effect(world) * periods_to_decide
    if world == 1:
        v = v + population * effect(world) * (periods - periods_to_decide)
    return v

print("population " + str(population) + ", holdout " + str(holdout_size) + ", " + str(periods) + " periods, decision after " + str(periods_to_decide))
print("")
for w in [1, 0]:
    if w == 1:
        print("WORLD GOOD - the change is worth " + str(effect_if_good) + " per unit per period")
    else:
        print("WORLD BAD - the change costs " + str(0 - effect_if_bad) + " per unit per period")
    print("  rolled out to everyone : " + str(value_no_holdout(w)))
    print("  with the holdout       : " + str(value_with_holdout(w)))
    print("  difference             : " + str(value_with_holdout(w) - value_no_holdout(w)))
    print("")
cost_good = value_with_holdout(1) - value_no_holdout(1)
saved_bad = value_with_holdout(0) - value_no_holdout(0)
print("  the holdout costs  " + str(0 - cost_good) + " in the world where the change is good")
print("  the holdout saves  " + str(saved_bad) + " in the world where it is bad")
if saved_bad > 0 - cost_good:
    print("  the saving is larger than the cost, and which world you are in is the")
    print("  thing nobody knows at the moment of choosing")
print("")
print("the cost in the good world, decomposed")
denied = holdout_size * effect_if_good * periods_to_decide
print("  units held back        : " + str(holdout_size))
print("  periods held back      : " + str(periods_to_decide))
print("  benefit denied to them : " + str(denied))
if denied == 0 - cost_good:
    print("  and that is the entire cost - the holdout delays nothing for anyone else")
print("")

def cost_for(size, decide):
    return size * effect_if_good * decide

print("cost in the good world, by holdout size (deciding after " + str(periods_to_decide) + ")")
for s in [5, 10, 20, 40]:
    print("  size " + str(s) + " : " + str(cost_for(s, periods_to_decide)))
print("")
print("cost in the good world, by how long you wait (holdout " + str(holdout_size) + ")")
for d in [1, 2, 3, 4]:
    print("  " + str(d) + " periods : " + str(cost_for(holdout_size, d)))
print("")
print("a holdout of 5 that cannot separate the two worlds")
print("  its cost in the good world : " + str(cost_for(5, periods_to_decide)))
print("  what it buys               : nothing, because it does not decide")
print("  full rollout would cost    : 0 in the good world, " + str(0 - value_no_holdout(0)) + " in the bad one")
print("  so it is worse than rolling out AND worse than a holdout that works")
print("")
print("Every case before this one recommends a holdout. This is the bill: it is")
print("paid in the currency the change was meant to produce, by the people it was")
print("meant to help, and it is paid in exactly the world where the decision turns")
print("out not to have needed making.")
```

## stdout (executed)

```text
population 100, holdout 20, 6 periods, decision after 2

WORLD GOOD - the change is worth 8 per unit per period
  rolled out to everyone : 4800
  with the holdout       : 4480
  difference             : -320

WORLD BAD - the change costs 5 per unit per period
  rolled out to everyone : -3000
  with the holdout       : -800
  difference             : 2200

  the holdout costs  320 in the world where the change is good
  the holdout saves  2200 in the world where it is bad
  the saving is larger than the cost, and which world you are in is the
  thing nobody knows at the moment of choosing

the cost in the good world, decomposed
  units held back        : 20
  periods held back      : 2
  benefit denied to them : 320
  and that is the entire cost - the holdout delays nothing for anyone else

cost in the good world, by holdout size (deciding after 2)
  size 5 : 80
  size 10 : 160
  size 20 : 320
  size 40 : 640

cost in the good world, by how long you wait (holdout 20)
  1 periods : 160
  2 periods : 320
  3 periods : 480
  4 periods : 640

a holdout of 5 that cannot separate the two worlds
  its cost in the good world : 80
  what it buys               : nothing, because it does not decide
  full rollout would cost    : 0 in the good world, 3000 in the bad one
  so it is worse than rolling out AND worse than a holdout that works

Every case before this one recommends a holdout. This is the bill: it is
paid in the currency the change was meant to produce, by the people it was
meant to help, and it is paid in exactly the world where the decision turns
out not to have needed making.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
