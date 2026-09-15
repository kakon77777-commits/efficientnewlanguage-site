<!-- canonical: efficientnewlanguage.org/ai/examples/866-the-worst-performers-improved-on-their-own | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 866 — The worst performers improved on their own

`the_worst_performers_improved_on_their_own.eml` - A coaching program was given to the 100 worst-performing stores, and the next quarter they improved. The improvement is real and correctly measured. Whether the coaching caused it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A coaching program
# was given to the 100 worst-performing stores, and the next quarter they
# improved. The improvement is real and correctly measured. Whether the coaching
# caused it is computed below.
#
# The measurement is careful. It reads the real post-quarter sales, not a
# forecast; it covers every store that got the coaching; the improvement is the
# honest after-minus-before; and the intent is exactly 'did coaching lift the
# worst stores'.
#
# The stores were chosen for being the worst, and an extreme group drifts back
# toward the average on its own next period; a control of equally-bad untreated
# stores rose almost as much.

100 => stores_coached
40 => avg_score_before
58 => avg_score_after
40 => control_worst_before
55 => control_worst_after
70 => population_average

avg_score_after - avg_score_before => improvement_claimed
control_worst_after - control_worst_before => improvement_without_coaching
improvement_claimed - improvement_without_coaching => improvement_left_for_coaching
int(improvement_without_coaching * 10000 / improvement_claimed) => regression_share_per_myriad

"stores coached                  : " + str(stores_coached) ^0
"average score before            : " + str(avg_score_before) ^0
"average score after             : " + str(avg_score_after) ^0
"population average               : " + str(population_average) ^0
"" ^0
"improvement claimed             : " + str(improvement_claimed) + " points" ^0
"same-worst stores, no coaching  : " + str(improvement_without_coaching) + " points" ^0
"left for the coaching           : " + str(improvement_left_for_coaching) + " points" ^0
"regression share of the claim   : " + str(regression_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the coaching measurement" ^0
"  reads : the real post-quarter sales, not a forecast" ^0
"  covers : every one of the coached stores" ^0
"  improvement : the honest after minus before" ^0
"  intent : did coaching lift the worst stores" ^0
"  stores mismeasured : 0" ^0
"  verdict : THE COACHED STORES ROSE 18 POINTS" ^0
"" ^0
"  reading the real after-sales rather than a projection is" ^0
"  the part done right here, and it is why the 18-point rise" ^0
"  is a true number about those stores" ^0
"" ^0

# ---- what regression to the mean does ----

"picking the extreme, then measuring again" ^0
"  why they were picked : they were the lowest last" ^0
"    quarter" ^0
"  what a low quarter contains : the real level plus a bad" ^0
"    draw of luck" ^0
"  what luck does next quarter : it does not repeat, so the" ^0
"    score rises toward the average" ^0
"  the untreated equally-bad stores : rose from 40 to 55 on" ^0
"    their own" ^0
"  so most of the 18 : would have happened with no coaching" ^0
"" ^0

# ---- what the program claimed ----

"the credit the program took" ^0
"  claimed lift : " + str(improvement_claimed) + " points, all of it" ^0
"  the control's lift with no coaching : " + str(improvement_without_coaching) + " points" ^0
"  actually attributable to coaching : " + str(improvement_left_for_coaching) + " points" ^0
"  is the 18 measured wrong : no; the stores really rose 18" ^0
"  is 18 the effect of coaching : no; " + str(regression_share_per_myriad) + " per ten" ^0
"    thousand of it is regression to the mean" ^0
"" ^0

# ---- null control ----

# The same coaching, measured against a randomly-chosen control drawn from the
# same worst group (or against the stores' own long-run mean, not last quarter).
15 => nc_control_rise_no_coaching
3 => nc_effect_over_the_control
100 => nc_stores_the_control_isolates

"null control - compare with a same-worst untreated control" ^0
"  the control rose, with no coaching : " + str(nc_control_rise_no_coaching) + " points" ^0
"  effect measured over the control : " + str(nc_effect_over_the_control) + " points" ^0
"  stores the control isolates the effect for : " + str(nc_stores_the_control_isolates) ^0
"  no store and no score changed; the 18 stopped being read" ^0
"  as an effect and started being read against what would" ^0
"  have happened anyway" ^0
"" ^0

# ---- the rule ----

"what an after-minus-before on the worst group guarantees" ^0
"  the chosen stores rose by the measured amount : exactly," ^0
"    real sales, every store, honest subtraction" ^0
"  the coaching caused the rise : not addressed; the stores" ^0
"    were picked for being extreme, and an extreme group" ^0
"    regresses toward the mean on its own, so an untreated" ^0
"    same-worst control rose " + str(improvement_without_coaching) + " of the " + str(improvement_claimed) + " points" ^0
"" ^0

"a group selected for being extreme is selected partly for its luck, and luck" ^0
"does not persist; the next measurement moves toward the average whether or not" ^0
"anything was done, so the rise of the worst is not the proof that it was fixed" ^0
"" ^0

"It reads the real after-sales over every coached store with an honest before-" ^0
"and-after - the 18-point rise is true. The stores were the worst last quarter, so" ^0
"they regress toward the mean regardless; an untreated same-worst control rose " + str(improvement_without_coaching) + "," ^0
"leaving " + str(improvement_left_for_coaching) + " points for the coaching, " + str(regression_share_per_myriad) + " per ten thousand of the claim being regression." ^0
```

## Python (deterministic transpilation)

```python
stores_coached = 100
avg_score_before = 40
avg_score_after = 58
control_worst_before = 40
control_worst_after = 55
population_average = 70
improvement_claimed = avg_score_after - avg_score_before
improvement_without_coaching = control_worst_after - control_worst_before
improvement_left_for_coaching = improvement_claimed - improvement_without_coaching
regression_share_per_myriad = int(improvement_without_coaching * 10000 / improvement_claimed)
print("stores coached                  : " + str(stores_coached))
print("average score before            : " + str(avg_score_before))
print("average score after             : " + str(avg_score_after))
print("population average               : " + str(population_average))
print("")
print("improvement claimed             : " + str(improvement_claimed) + " points")
print("same-worst stores, no coaching  : " + str(improvement_without_coaching) + " points")
print("left for the coaching           : " + str(improvement_left_for_coaching) + " points")
print("regression share of the claim   : " + str(regression_share_per_myriad) + " per ten thousand")
print("")
print("the coaching measurement")
print("  reads : the real post-quarter sales, not a forecast")
print("  covers : every one of the coached stores")
print("  improvement : the honest after minus before")
print("  intent : did coaching lift the worst stores")
print("  stores mismeasured : 0")
print("  verdict : THE COACHED STORES ROSE 18 POINTS")
print("")
print("  reading the real after-sales rather than a projection is")
print("  the part done right here, and it is why the 18-point rise")
print("  is a true number about those stores")
print("")
print("picking the extreme, then measuring again")
print("  why they were picked : they were the lowest last")
print("    quarter")
print("  what a low quarter contains : the real level plus a bad")
print("    draw of luck")
print("  what luck does next quarter : it does not repeat, so the")
print("    score rises toward the average")
print("  the untreated equally-bad stores : rose from 40 to 55 on")
print("    their own")
print("  so most of the 18 : would have happened with no coaching")
print("")
print("the credit the program took")
print("  claimed lift : " + str(improvement_claimed) + " points, all of it")
print("  the control's lift with no coaching : " + str(improvement_without_coaching) + " points")
print("  actually attributable to coaching : " + str(improvement_left_for_coaching) + " points")
print("  is the 18 measured wrong : no; the stores really rose 18")
print("  is 18 the effect of coaching : no; " + str(regression_share_per_myriad) + " per ten")
print("    thousand of it is regression to the mean")
print("")
nc_control_rise_no_coaching = 15
nc_effect_over_the_control = 3
nc_stores_the_control_isolates = 100
print("null control - compare with a same-worst untreated control")
print("  the control rose, with no coaching : " + str(nc_control_rise_no_coaching) + " points")
print("  effect measured over the control : " + str(nc_effect_over_the_control) + " points")
print("  stores the control isolates the effect for : " + str(nc_stores_the_control_isolates))
print("  no store and no score changed; the 18 stopped being read")
print("  as an effect and started being read against what would")
print("  have happened anyway")
print("")
print("what an after-minus-before on the worst group guarantees")
print("  the chosen stores rose by the measured amount : exactly,")
print("    real sales, every store, honest subtraction")
print("  the coaching caused the rise : not addressed; the stores")
print("    were picked for being extreme, and an extreme group")
print("    regresses toward the mean on its own, so an untreated")
print("    same-worst control rose " + str(improvement_without_coaching) + " of the " + str(improvement_claimed) + " points")
print("")
print("a group selected for being extreme is selected partly for its luck, and luck")
print("does not persist; the next measurement moves toward the average whether or not")
print("anything was done, so the rise of the worst is not the proof that it was fixed")
print("")
print("It reads the real after-sales over every coached store with an honest before-")
print("and-after - the 18-point rise is true. The stores were the worst last quarter, so")
print("they regress toward the mean regardless; an untreated same-worst control rose " + str(improvement_without_coaching) + ",")
print("leaving " + str(improvement_left_for_coaching) + " points for the coaching, " + str(regression_share_per_myriad) + " per ten thousand of the claim being regression.")
```

## stdout (executed)

```text
stores coached                  : 100
average score before            : 40
average score after             : 58
population average               : 70

improvement claimed             : 18 points
same-worst stores, no coaching  : 15 points
left for the coaching           : 3 points
regression share of the claim   : 8333 per ten thousand

the coaching measurement
  reads : the real post-quarter sales, not a forecast
  covers : every one of the coached stores
  improvement : the honest after minus before
  intent : did coaching lift the worst stores
  stores mismeasured : 0
  verdict : THE COACHED STORES ROSE 18 POINTS

  reading the real after-sales rather than a projection is
  the part done right here, and it is why the 18-point rise
  is a true number about those stores

picking the extreme, then measuring again
  why they were picked : they were the lowest last
    quarter
  what a low quarter contains : the real level plus a bad
    draw of luck
  what luck does next quarter : it does not repeat, so the
    score rises toward the average
  the untreated equally-bad stores : rose from 40 to 55 on
    their own
  so most of the 18 : would have happened with no coaching

the credit the program took
  claimed lift : 18 points, all of it
  the control's lift with no coaching : 15 points
  actually attributable to coaching : 3 points
  is the 18 measured wrong : no; the stores really rose 18
  is 18 the effect of coaching : no; 8333 per ten
    thousand of it is regression to the mean

null control - compare with a same-worst untreated control
  the control rose, with no coaching : 15 points
  effect measured over the control : 3 points
  stores the control isolates the effect for : 100
  no store and no score changed; the 18 stopped being read
  as an effect and started being read against what would
  have happened anyway

what an after-minus-before on the worst group guarantees
  the chosen stores rose by the measured amount : exactly,
    real sales, every store, honest subtraction
  the coaching caused the rise : not addressed; the stores
    were picked for being extreme, and an extreme group
    regresses toward the mean on its own, so an untreated
    same-worst control rose 15 of the 18 points

a group selected for being extreme is selected partly for its luck, and luck
does not persist; the next measurement moves toward the average whether or not
anything was done, so the rise of the worst is not the proof that it was fixed

It reads the real after-sales over every coached store with an honest before-
and-after - the 18-point rise is true. The stores were the worst last quarter, so
they regress toward the mean regardless; an untreated same-worst control rose 15,
leaving 3 points for the coaching, 8333 per ten thousand of the claim being regression.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
