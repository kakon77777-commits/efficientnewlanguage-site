<!-- canonical: efficientnewlanguage.org/ai/examples/428-the-last-point-is-the-whole-trend | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 428 — The last point is the whole trend

`the_last_point_is_the_whole_trend.eml` - The last month is down. The year is up. Both are read off the same twelve numbers.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The last month is
# down. The year is up. Both are read off the same twelve numbers.
#
# Reading the latest point first is not a mistake. It is the newest information,
# it is the only one that could still be acted on, and every other point is
# already spent. A reviewer who ignored it would be ignoring the only month
# anyone can still change.
#
# What it cannot do is say which way things are going, because one step is not
# a direction. How often the newest step agrees with the direction is a
# property of the series, and it is enumerated here rather than assumed.

# The series ends on a down step on purpose: that is the situation the case
# is about, and without it the comparison below has nothing to compare.
[100, 104, 101, 108, 106, 112, 110, 117, 115, 121, 124, 119] => months

def last_step():
    return months[len(months) - 1] - months[len(months) - 2]

def whole_change():
    return months[len(months) - 1] - months[0]

"months : " + str(len(months)) ^0
"" => row
for m in months:
    row + str(m) + " " => row
"  " + row ^0
"" ^0

"two readings of the same series" ^0
"  latest step : " + str(last_step()) ^0
"  first to last : " + str(whole_change()) ^0
if last_step() < 0:
    if whole_change() > 0:
        "  the newest step is down and the year is up" ^0
"" ^0

# ---- how often the newest step agrees with the direction ----
#
# Taken at every point in the series, not just this one.

0 => agree
0 => disagree
for i in [2:len(months) - 1]:
    months[i] - months[i - 1] => step
    months[i] - months[0] => sofar
    if step > 0:
        if sofar > 0:
            agree + 1 => agree
        else:
            disagree + 1 => disagree
    else:
        if sofar > 0:
            disagree + 1 => disagree
        else:
            agree + 1 => agree

"reading the direction from the latest step alone" ^0
"  points where it agrees with the run so far : " + str(agree) ^0
"  points where it disagrees                  : " + str(disagree) ^0
"  agreement rate : " + str(int(agree * 100 / (agree + disagree))) + "%" ^0
"" ^0

# ---- what a two-point window buys ----

0 => agree2
0 => disagree2
for i in [3:len(months) - 1]:
    months[i] - months[i - 2] => step2
    months[i] - months[0] => sofar
    if step2 > 0:
        if sofar > 0:
            agree2 + 1 => agree2
        else:
            disagree2 + 1 => disagree2
    else:
        if sofar > 0:
            disagree2 + 1 => disagree2
        else:
            agree2 + 1 => agree2
"reading it from a two-month window" ^0
"  agrees : " + str(agree2) + ", disagrees : " + str(disagree2) ^0
"  agreement rate : " + str(int(agree2 * 100 / (agree2 + disagree2))) + "%" ^0
"" ^0

# ---- the shape the series actually has ----

0 => ups
0 => downs
for i in [1:len(months) - 1]:
    if months[i] > months[i - 1]:
        ups + 1 => ups
    else:
        downs + 1 => downs
"the steps themselves" ^0
"  up   : " + str(ups) ^0
"  down : " + str(downs) ^0
"  net  : " + str(whole_change()) ^0
if downs > 0:
    if whole_change() > 0:
        "  a series can go up while " + str(downs) + " of its " + str(ups + downs) + " steps go down" ^0
"" ^0

# ---- the decision each reading supports ----

"what each reading supports" ^0
if last_step() < 0:
    "  latest step : something broke last month, investigate it" ^0
else:
    "  latest step : last month was up, carry on" ^0
if whole_change() > 0:
    "  whole series : the thing is working, keep going" ^0
else:
    "  whole series : the thing is not working" ^0
"  both are true statements about the same twelve numbers" ^0
"" ^0

# ---- the control: a series that really turned ----
#
# The latest point is not always noise. Where the series has actually reversed,
# the newest step is the first and only evidence of it, and the long view is
# the reading that is wrong.

[100, 108, 116, 124, 132, 128, 120, 110] => turned
"control - a series that really reversed" ^0
"  latest step   : " + str(turned[len(turned) - 1] - turned[len(turned) - 2]) ^0
"  first to last : " + str(turned[len(turned) - 1] - turned[0]) ^0
0 => recent_down
for i in [5:7]:
    if turned[i] < turned[i - 1]:
        recent_down + 1 => recent_down
"  consecutive down steps at the end : " + str(recent_down) ^0
if recent_down > 1:
    "  here the newest points are the evidence and the total is the stale read" ^0
"" ^0

"The latest number is the only one still actionable, and it is one step. Which" ^0
"of the two readings is right is a fact about the series, not about which" ^0
"number arrived most recently." ^0
```

## Python (deterministic transpilation)

```python
months = [100, 104, 101, 108, 106, 112, 110, 117, 115, 121, 124, 119]

def last_step():
    return months[len(months) - 1] - months[len(months) - 2]

def whole_change():
    return months[len(months) - 1] - months[0]

print("months : " + str(len(months)))
row = ""
for m in months:
    row = row + str(m) + " "
print("  " + row)
print("")
print("two readings of the same series")
print("  latest step : " + str(last_step()))
print("  first to last : " + str(whole_change()))
if last_step() < 0:
    if whole_change() > 0:
        print("  the newest step is down and the year is up")
print("")
agree = 0
disagree = 0
for i in range(2, len(months)):
    step = months[i] - months[i - 1]
    sofar = months[i] - months[0]
    if step > 0:
        if sofar > 0:
            agree = agree + 1
        else:
            disagree = disagree + 1
    elif sofar > 0:
        disagree = disagree + 1
    else:
        agree = agree + 1
print("reading the direction from the latest step alone")
print("  points where it agrees with the run so far : " + str(agree))
print("  points where it disagrees                  : " + str(disagree))
print("  agreement rate : " + str(int(agree * 100 / (agree + disagree))) + "%")
print("")
agree2 = 0
disagree2 = 0
for i in range(3, len(months)):
    step2 = months[i] - months[i - 2]
    sofar = months[i] - months[0]
    if step2 > 0:
        if sofar > 0:
            agree2 = agree2 + 1
        else:
            disagree2 = disagree2 + 1
    elif sofar > 0:
        disagree2 = disagree2 + 1
    else:
        agree2 = agree2 + 1
print("reading it from a two-month window")
print("  agrees : " + str(agree2) + ", disagrees : " + str(disagree2))
print("  agreement rate : " + str(int(agree2 * 100 / (agree2 + disagree2))) + "%")
print("")
ups = 0
downs = 0
for i in range(1, len(months)):
    if months[i] > months[i - 1]:
        ups = ups + 1
    else:
        downs = downs + 1
print("the steps themselves")
print("  up   : " + str(ups))
print("  down : " + str(downs))
print("  net  : " + str(whole_change()))
if downs > 0:
    if whole_change() > 0:
        print("  a series can go up while " + str(downs) + " of its " + str(ups + downs) + " steps go down")
print("")
print("what each reading supports")
if last_step() < 0:
    print("  latest step : something broke last month, investigate it")
else:
    print("  latest step : last month was up, carry on")
if whole_change() > 0:
    print("  whole series : the thing is working, keep going")
else:
    print("  whole series : the thing is not working")
print("  both are true statements about the same twelve numbers")
print("")
turned = [100, 108, 116, 124, 132, 128, 120, 110]
print("control - a series that really reversed")
print("  latest step   : " + str(turned[len(turned) - 1] - turned[len(turned) - 2]))
print("  first to last : " + str(turned[len(turned) - 1] - turned[0]))
recent_down = 0
for i in range(5, 8):
    if turned[i] < turned[i - 1]:
        recent_down = recent_down + 1
print("  consecutive down steps at the end : " + str(recent_down))
if recent_down > 1:
    print("  here the newest points are the evidence and the total is the stale read")
print("")
print("The latest number is the only one still actionable, and it is one step. Which")
print("of the two readings is right is a fact about the series, not about which")
print("number arrived most recently.")
```

## stdout (executed)

```text
months : 12
  100 104 101 108 106 112 110 117 115 121 124 119 

two readings of the same series
  latest step : -5
  first to last : 19
  the newest step is down and the year is up

reading the direction from the latest step alone
  points where it agrees with the run so far : 5
  points where it disagrees                  : 5
  agreement rate : 50%

reading it from a two-month window
  agrees : 8, disagrees : 1
  agreement rate : 88%

the steps themselves
  up   : 6
  down : 5
  net  : 19
  a series can go up while 5 of its 11 steps go down

what each reading supports
  latest step : something broke last month, investigate it
  whole series : the thing is working, keep going
  both are true statements about the same twelve numbers

control - a series that really reversed
  latest step   : -10
  first to last : 10
  consecutive down steps at the end : 3
  here the newest points are the evidence and the total is the stale read

The latest number is the only one still actionable, and it is one step. Which
of the two readings is right is a fact about the series, not about which
number arrived most recently.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
