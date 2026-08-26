<!-- canonical: efficientnewlanguage.org/ai/examples/563-the-sample-size-was-the-thing-that-changed | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 563 — The sample size was the thing that changed

`the_sample_size_was_the_thing_that_changed.eml` - Three quarters of latency review. Each quarter the team sampled transactions and reported the worst one they saw. The worst got worse every quarter. What else changed is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three quarters of
# latency review. Each quarter the team sampled transactions and reported the
# worst one they saw. The worst got worse every quarter. What else changed is
# computed below.
#
# Reporting the observed maximum is the right instinct and was chosen on
# purpose. A mean hides the customer who waited nine seconds, and that customer
# is the one who writes in. The worst case is what a support commitment is
# written against, it needs no distributional assumption, and it is the one
# number an engineer can go and reproduce. Everything about reporting it is
# defensible.
#
# The sample grew each quarter, from 200 to 2000 to 20000, because the sampling
# job was made cheaper twice. Nobody reported that, because sampling more is not
# a change to the system - it is a change to how hard you looked.
#
# A maximum is not a property of a population. It is a property of a population
# AND a sample size, and it only goes up. A rate is a property of the population
# alone. Below, the rate is identical in all three quarters, to the digit.

# The population rule never changed across the three quarters. Delay in ms:
#   every 10000th transaction  2000
#   every 1000th               500
#   every 100th                120
#   everything else            20 + (i mod 30), which is 20..49

[["Q1", 200], ["Q2", 2000], ["Q3", 20000]] => quarters

"the sampling job was made cheaper twice; the system was not touched" ^0
"" ^0

"quarter   sampled   worst seen   over 100ms   rate" ^0

for q in quarters:
    q[1] => n

    # closed form: how many of 1..n fall in each rarity class
    int(n / 100) => c_over
    int(n / 1000) => c_500_or_worse
    int(n / 10000) => c_2000

    c_500_or_worse - c_2000 => c_500
    c_over - c_500_or_worse => c_120

    # the worst value present is decided by which rarity n has reached
    if c_2000 > 0:
        2000 => worst
    elif c_500 > 0:
        500 => worst
    elif c_120 > 0:
        120 => worst
    else:
        49 => worst

    int(c_over * 1000 / n) => rate_tenths

    "  " + q[0] + "       " + str(n) + "        " + str(worst) + "         " + str(c_over) + "          " + str(rate_tenths) + " per mille" ^0
"" ^0

"the worst seen went 120 -> 500 -> 2000, a 16x rise across three quarters" ^0
"the rate over 100ms was 10 per mille in every one of them" ^0
"" ^0

# ---- what actually crossed a line ----
#
# Nothing in the system. What changed is which rare classes the sample was
# large enough to contain at all.

"why the worst moved, class by class" ^0
"class          appears once every   first sample size that can contain it" ^0
"  120ms                      100                                     100" ^0
"  500ms                     1000                                    1000" ^0
"  2000ms                   10000                                   10000" ^0
"" ^0
"  Q1 sampled 200    -> could not contain a 500ms event. None was reported." ^0
"  Q2 sampled 2000   -> could not contain a 2000ms event. None was reported." ^0
"  Q3 sampled 20000  -> contained two. Both were reported." ^0
"" ^0
"  a 2000ms transaction occurred in Q1 and in Q2 as well" ^0
"  in Q1 the sample was 200 of every 10000, so it held 0.02 of one" ^0
"" ^0

# ---- which statistics grow when you only look harder ----

"statistic        behaviour as the sample grows, population fixed" ^0
"  maximum        rises, without bound if the tail is unbounded" ^0
"  minimum        falls, for the same reason" ^0
"  distinct count rises, it can only ever add" ^0
"  range          rises, it is a max minus a min" ^0
"  mean           stable" ^0
"  rate           stable" ^0
"  median         stable" ^0
"" ^0
"the quarterly report contained one maximum and no rates" ^0
"" ^0

# ---- the control ----
#
# If the system had genuinely degraded, the rate over 100ms would have moved,
# because a rate does not care how many you looked at. It is identical in all
# three quarters, which is the measurement that separates "got worse" from
# "looked harder".

"control - a statistic that does not grow with the sample" ^0
0 => rates_seen
0 => rates_equal
for q in quarters:
    q[1] => n
    int(n / 100) => c_over
    int(c_over * 1000 / n) => r
    rates_seen + 1 => rates_seen
    if r == 10:
        rates_equal + 1 => rates_equal
    "  " + q[0] + " rate over 100ms: " + str(r) + " per mille" ^0
"  quarters measured: " + str(rates_seen) + ", quarters at 10 per mille: " + str(rates_equal) ^0
"" ^0

"  a real degradation moves a rate" ^0
"  looking harder cannot move a rate, and cannot fail to move a maximum" ^0
"" ^0

# ---- the null control ----
#
# A quantity that would rise under BOTH explanations tells you nothing. The
# total delay summed over the sample is one: it grows with n whether or not
# anything degraded. It is here to show what an uninformative measurement
# looks like sitting next to an informative one.

"null control - a quantity that rises under either explanation" ^0
for q in quarters:
    q[1] => n
    int(n / 100) => c_over
    int(n / 1000) => c5
    int(n / 10000) => c2
    (c2 * 2000) + ((c5 - c2) * 500) + ((c_over - c5) * 120) => tail_ms
    "  " + q[0] + " total ms in the over-100 tail: " + str(tail_ms) ^0
"  this rises 16x too, and would rise 16x if the system were perfect" ^0
"  it cannot distinguish the two stories, so it is not evidence for either" ^0
"" ^0

"Reporting the worst case is defensible: it is reproducible, it needs no" ^0
"distributional assumption, and it is what the support commitment is written" ^0
"against. It is also the one statistic that a cheaper sampling job is" ^0
"guaranteed to move. The rate held at 10 per mille across all three quarters," ^0
"from a population that was never touched." ^0
```

## Python (deterministic transpilation)

```python
quarters = [["Q1", 200], ["Q2", 2000], ["Q3", 20000]]
print("the sampling job was made cheaper twice; the system was not touched")
print("")
print("quarter   sampled   worst seen   over 100ms   rate")
for q in quarters:
    n = q[1]
    c_over = int(n / 100)
    c_500_or_worse = int(n / 1000)
    c_2000 = int(n / 10000)
    c_500 = c_500_or_worse - c_2000
    c_120 = c_over - c_500_or_worse
    if c_2000 > 0:
        worst = 2000
    elif c_500 > 0:
        worst = 500
    elif c_120 > 0:
        worst = 120
    else:
        worst = 49
    rate_tenths = int(c_over * 1000 / n)
    print("  " + q[0] + "       " + str(n) + "        " + str(worst) + "         " + str(c_over) + "          " + str(rate_tenths) + " per mille")
print("")
print("the worst seen went 120 -> 500 -> 2000, a 16x rise across three quarters")
print("the rate over 100ms was 10 per mille in every one of them")
print("")
print("why the worst moved, class by class")
print("class          appears once every   first sample size that can contain it")
print("  120ms                      100                                     100")
print("  500ms                     1000                                    1000")
print("  2000ms                   10000                                   10000")
print("")
print("  Q1 sampled 200    -> could not contain a 500ms event. None was reported.")
print("  Q2 sampled 2000   -> could not contain a 2000ms event. None was reported.")
print("  Q3 sampled 20000  -> contained two. Both were reported.")
print("")
print("  a 2000ms transaction occurred in Q1 and in Q2 as well")
print("  in Q1 the sample was 200 of every 10000, so it held 0.02 of one")
print("")
print("statistic        behaviour as the sample grows, population fixed")
print("  maximum        rises, without bound if the tail is unbounded")
print("  minimum        falls, for the same reason")
print("  distinct count rises, it can only ever add")
print("  range          rises, it is a max minus a min")
print("  mean           stable")
print("  rate           stable")
print("  median         stable")
print("")
print("the quarterly report contained one maximum and no rates")
print("")
print("control - a statistic that does not grow with the sample")
rates_seen = 0
rates_equal = 0
for q in quarters:
    n = q[1]
    c_over = int(n / 100)
    r = int(c_over * 1000 / n)
    rates_seen = rates_seen + 1
    if r == 10:
        rates_equal = rates_equal + 1
    print("  " + q[0] + " rate over 100ms: " + str(r) + " per mille")
print("  quarters measured: " + str(rates_seen) + ", quarters at 10 per mille: " + str(rates_equal))
print("")
print("  a real degradation moves a rate")
print("  looking harder cannot move a rate, and cannot fail to move a maximum")
print("")
print("null control - a quantity that rises under either explanation")
for q in quarters:
    n = q[1]
    c_over = int(n / 100)
    c5 = int(n / 1000)
    c2 = int(n / 10000)
    tail_ms = c2 * 2000 + (c5 - c2) * 500 + (c_over - c5) * 120
    print("  " + q[0] + " total ms in the over-100 tail: " + str(tail_ms))
print("  this rises 16x too, and would rise 16x if the system were perfect")
print("  it cannot distinguish the two stories, so it is not evidence for either")
print("")
print("Reporting the worst case is defensible: it is reproducible, it needs no")
print("distributional assumption, and it is what the support commitment is written")
print("against. It is also the one statistic that a cheaper sampling job is")
print("guaranteed to move. The rate held at 10 per mille across all three quarters,")
print("from a population that was never touched.")
```

## stdout (executed)

```text
the sampling job was made cheaper twice; the system was not touched

quarter   sampled   worst seen   over 100ms   rate
  Q1       200        120         2          10 per mille
  Q2       2000        500         20          10 per mille
  Q3       20000        2000         200          10 per mille

the worst seen went 120 -> 500 -> 2000, a 16x rise across three quarters
the rate over 100ms was 10 per mille in every one of them

why the worst moved, class by class
class          appears once every   first sample size that can contain it
  120ms                      100                                     100
  500ms                     1000                                    1000
  2000ms                   10000                                   10000

  Q1 sampled 200    -> could not contain a 500ms event. None was reported.
  Q2 sampled 2000   -> could not contain a 2000ms event. None was reported.
  Q3 sampled 20000  -> contained two. Both were reported.

  a 2000ms transaction occurred in Q1 and in Q2 as well
  in Q1 the sample was 200 of every 10000, so it held 0.02 of one

statistic        behaviour as the sample grows, population fixed
  maximum        rises, without bound if the tail is unbounded
  minimum        falls, for the same reason
  distinct count rises, it can only ever add
  range          rises, it is a max minus a min
  mean           stable
  rate           stable
  median         stable

the quarterly report contained one maximum and no rates

control - a statistic that does not grow with the sample
  Q1 rate over 100ms: 10 per mille
  Q2 rate over 100ms: 10 per mille
  Q3 rate over 100ms: 10 per mille
  quarters measured: 3, quarters at 10 per mille: 3

  a real degradation moves a rate
  looking harder cannot move a rate, and cannot fail to move a maximum

null control - a quantity that rises under either explanation
  Q1 total ms in the over-100 tail: 240
  Q2 total ms in the over-100 tail: 3160
  Q3 total ms in the over-100 tail: 34600
  this rises 16x too, and would rise 16x if the system were perfect
  it cannot distinguish the two stories, so it is not evidence for either

Reporting the worst case is defensible: it is reproducible, it needs no
distributional assumption, and it is what the support commitment is written
against. It is also the one statistic that a cheaper sampling job is
guaranteed to move. The rate held at 10 per mille across all three quarters,
from a population that was never touched.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
