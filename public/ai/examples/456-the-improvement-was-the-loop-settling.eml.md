<!-- canonical: efficientnewlanguage.org/ai/examples/456-the-improvement-was-the-loop-settling | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 456 — The improvement was the loop settling

`the_improvement_was_the_loop_settling.eml` - A metric improved for six months after an initiative started. What else predicts that curve is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A metric improved
# for six months after an initiative started. What else predicts that curve is
# computed below.
#
# Crediting the initiative is reasonable. It started in month one, the metric
# moved from month one, it moved in the intended direction, and it kept moving.
# That is what a working intervention looks like and there is no sleight of
# hand in reading it that way.
#
# A control loop that was knocked off its resting point also produces a run of
# improving months, ending at a level the loop's own parameters fix. The two
# explanations agree on every month observed and disagree about where it stops.
#
# Both curves are generated and compared to the recorded months.

[62, 54, 48, 44, 41, 39] => observed
len(observed) => months
30 => resting_point
4 => gap_divisor

# a loop returning to its resting point: each month closes a fixed share of the gap
def loop_value(m):
    62 => v
    0 => k
    while k < m:
        v - int((v - resting_point) / gap_divisor) => v
        k + 1 => k
    return v

"month   observed   what a settling loop predicts" ^0
0 => worst_gap
for i in [0:months - 1]:
    loop_value(i) => pred
    observed[i] - pred => gap
    if gap < 0:
        0 - gap => gap
    if gap > worst_gap:
        gap => worst_gap
    "  " + str(i + 1) + "       " + str(observed[i]) + "         " + str(pred) ^0
"" ^0
"largest disagreement over the six months : " + str(worst_gap) ^0
if worst_gap <= 2:
    "  the two explanations are within " + str(worst_gap) + " on every month recorded," ^0
    "  so the six months do not choose between them" ^0
"" ^0

# ---- where they part ----

"what each explanation says about month 12 and month 24" ^0
loop_value(11) => l12
loop_value(23) => l24
observed[months - 1] => last
last - observed[months - 2] => last_step
last - last_step => t12
if t12 < 0:
    0 => t12
"  the loop      : month 12 " + str(l12) + ", month 24 " + str(l24) ^0
"  the initiative, continuing at the last observed rate of " + str(0 - last_step) + " a month:" ^0
last => proj
0 => k2
while k2 < 6:
    proj + last_step => proj
    k2 + 1 => k2
"    month 12 " + str(proj) ^0
if l12 > proj:
    "  they differ by " + str(l12 - proj) + " at month 12, which is " + str(int((l12 - proj) * 100 / l12)) + "% of the loop's figure" ^0
"  and the loop's floor is " + str(resting_point) + ", which the other reading has no term for" ^0
"" ^0

# ---- the observation that would have separated them ----
#
# Not a longer run of the same measurement. The loop's claim is about the
# resting point, so the test is to look at a period before the initiative.

[63, 61, 62, 62, 63, 62] => before
0 => before_swing
0 => bmin
0 => bmax
for v in before:
    if bmin == 0:
        v => bmin
        v => bmax
    if v < bmin:
        v => bmin
    if v > bmax:
        v => bmax
bmax - bmin => before_swing
0 => bsum
for v in before:
    bsum + v => bsum
int(bsum / len(before)) => before_mean
"the six months before the initiative" ^0
"  range : " + str(bmin) + " to " + str(bmax) + ", a swing of " + str(before_swing) ^0
if before_swing < 5:
    "  flat, so the system was AT a resting point of about " + str(before_mean) + " and not settling toward one" ^0
    "  that makes the loop reading weaker, and it is the cheapest thing to check" ^0
"" ^0

# ---- what it costs to be wrong either way ----

"if the initiative is the cause and it is stopped" ^0
"  the metric returns toward " + str(before_mean) + ", losing the " + str(before_mean - last) + " points gained" ^0
"if the loop is the cause and the initiative is scaled up" ^0
"  the metric stops at " + str(resting_point) + " however much is spent" ^0
"  and the spend is attributed to the months where the two agree" ^0
"" ^0

# ---- the control: a metric with no resting point ----
#
# A quantity that does not return anywhere has no settling explanation to
# compete with, and the same six months support only one reading.

[100, 92, 84, 76, 68, 60] => linear
0 => same_step
1 => steady
for i in [1:months - 1]:
    linear[i - 1] - linear[i] => step
    if i == 1:
        step => same_step
    if not (step == same_step):
        0 => steady
"control - a metric falling by a constant amount each month" ^0
"  step : " + str(same_step) + " every month" ^0
if steady == 1:
    "  a settling loop cannot produce a constant step, because its steps" ^0
    "  shrink with the gap; here the six months do choose" ^0
"" ^0

"The initiative started when the metric started moving and the metric moved" ^0
"the intended way. A loop returning to its resting point fits the same six" ^0
"points, and the two readings differ first at the month nobody has yet." ^0
```

## Python (deterministic transpilation)

```python
observed = [62, 54, 48, 44, 41, 39]
months = len(observed)
resting_point = 30
gap_divisor = 4

def loop_value(m):
    v = 62
    k = 0
    while k < m:
        v = v - int((v - resting_point) / gap_divisor)
        k = k + 1
    return v

print("month   observed   what a settling loop predicts")
worst_gap = 0
for i in range(0, months):
    pred = loop_value(i)
    gap = observed[i] - pred
    if gap < 0:
        gap = 0 - gap
    if gap > worst_gap:
        worst_gap = gap
    print("  " + str(i + 1) + "       " + str(observed[i]) + "         " + str(pred))
print("")
print("largest disagreement over the six months : " + str(worst_gap))
if worst_gap <= 2:
    print("  the two explanations are within " + str(worst_gap) + " on every month recorded,")
    print("  so the six months do not choose between them")
print("")
print("what each explanation says about month 12 and month 24")
l12 = loop_value(11)
l24 = loop_value(23)
last = observed[months - 1]
last_step = last - observed[months - 2]
t12 = last - last_step
if t12 < 0:
    t12 = 0
print("  the loop      : month 12 " + str(l12) + ", month 24 " + str(l24))
print("  the initiative, continuing at the last observed rate of " + str(0 - last_step) + " a month:")
proj = last
k2 = 0
while k2 < 6:
    proj = proj + last_step
    k2 = k2 + 1
print("    month 12 " + str(proj))
if l12 > proj:
    print("  they differ by " + str(l12 - proj) + " at month 12, which is " + str(int((l12 - proj) * 100 / l12)) + "% of the loop's figure")
print("  and the loop's floor is " + str(resting_point) + ", which the other reading has no term for")
print("")
before = [63, 61, 62, 62, 63, 62]
before_swing = 0
bmin = 0
bmax = 0
for v in before:
    if bmin == 0:
        bmin = v
        bmax = v
    if v < bmin:
        bmin = v
    if v > bmax:
        bmax = v
before_swing = bmax - bmin
bsum = 0
for v in before:
    bsum = bsum + v
before_mean = int(bsum / len(before))
print("the six months before the initiative")
print("  range : " + str(bmin) + " to " + str(bmax) + ", a swing of " + str(before_swing))
if before_swing < 5:
    print("  flat, so the system was AT a resting point of about " + str(before_mean) + " and not settling toward one")
    print("  that makes the loop reading weaker, and it is the cheapest thing to check")
print("")
print("if the initiative is the cause and it is stopped")
print("  the metric returns toward " + str(before_mean) + ", losing the " + str(before_mean - last) + " points gained")
print("if the loop is the cause and the initiative is scaled up")
print("  the metric stops at " + str(resting_point) + " however much is spent")
print("  and the spend is attributed to the months where the two agree")
print("")
linear = [100, 92, 84, 76, 68, 60]
same_step = 0
steady = 1
for i in range(1, months):
    step = linear[i - 1] - linear[i]
    if i == 1:
        same_step = step
    if not step == same_step:
        steady = 0
print("control - a metric falling by a constant amount each month")
print("  step : " + str(same_step) + " every month")
if steady == 1:
    print("  a settling loop cannot produce a constant step, because its steps")
    print("  shrink with the gap; here the six months do choose")
print("")
print("The initiative started when the metric started moving and the metric moved")
print("the intended way. A loop returning to its resting point fits the same six")
print("points, and the two readings differ first at the month nobody has yet.")
```

## stdout (executed)

```text
month   observed   what a settling loop predicts
  1       62         62
  2       54         54
  3       48         48
  4       44         44
  5       41         41
  6       39         39

largest disagreement over the six months : 0
  the two explanations are within 0 on every month recorded,
  so the six months do not choose between them

what each explanation says about month 12 and month 24
  the loop      : month 12 33, month 24 33
  the initiative, continuing at the last observed rate of 2 a month:
    month 12 27
  they differ by 6 at month 12, which is 18% of the loop's figure
  and the loop's floor is 30, which the other reading has no term for

the six months before the initiative
  range : 61 to 63, a swing of 2
  flat, so the system was AT a resting point of about 62 and not settling toward one
  that makes the loop reading weaker, and it is the cheapest thing to check

if the initiative is the cause and it is stopped
  the metric returns toward 62, losing the 23 points gained
if the loop is the cause and the initiative is scaled up
  the metric stops at 30 however much is spent
  and the spend is attributed to the months where the two agree

control - a metric falling by a constant amount each month
  step : 8 every month
  a settling loop cannot produce a constant step, because its steps
  shrink with the gap; here the six months do choose

The initiative started when the metric started moving and the metric moved
the intended way. A loop returning to its resting point fits the same six
points, and the two readings differ first at the month nobody has yet.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
