<!-- canonical: efficientnewlanguage.org/ai/examples/481-the-fix-shipped-to-the-users-who-stayed | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 481 — The fix shipped to the users who stayed

`the_fix_shipped_to_the_users_who_stayed.eml` - The fix went out eleven months after the bug. How many of the affected users were still there to receive it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The fix went out
# eleven months after the bug. How many of the affected users were still there
# to receive it is computed below.
#
# Fixing it was right and shipping it was right. The bug was real, the fix is
# correct, and the users who have it now are better off than they were. Nothing
# about the work is wasted on the people it reached.
#
# Who it reached is a different set from who it was about. Eleven months is long
# enough for the affected population to have changed, and the users most hurt by
# the bug are the ones most likely to have left - so the fix arrives at the
# people who tolerated it.
#
# Both populations are counted from the same cohort.

# [severity for the user, users affected at the time, monthly churn per 1000 while affected]
[["blocked entirely", 400, 90], ["slow and annoying", 1800, 35], ["cosmetic", 3200, 8]] => cohorts

len(cohorts) => n
11 => months

def remaining(c):
    c[1] => left
    0 => m
    while m < months:
        int(left * c[2] / 1000) => gone
        left - gone => left
        m + 1 => m
    return left

0 => affected
0 => still_here
for c in cohorts:
    affected + c[1] => affected
    still_here + remaining(c) => still_here

"users affected when the bug was reported : " + str(affected) ^0
"months until the fix shipped : " + str(months) ^0
"still using the product when it shipped : " + str(still_here) ^0
if affected > 0:
    "  which is " + str(int(still_here * 100 / affected)) + "%" ^0
"" ^0

"severity            affected   churn/1000/mo   still here   retained" ^0
for c in cohorts:
    remaining(c) => r
    "  " + c[0] + "   " + str(c[1]) + "        " + str(c[2]) + "              " + str(r) + "        " + str(int(r * 100 / c[1])) + "%" ^0
"" ^0

# ---- the retention is inverse to the severity ----

"retention by severity" ^0
0 => worst_retained
"" => worst_name
0 => best_retained
"" => best_name
for c in cohorts:
    int(remaining(c) * 100 / c[1]) => pct
    if worst_retained == 0:
        pct => worst_retained
        c[0] => worst_name
    if pct < worst_retained:
        pct => worst_retained
        c[0] => worst_name
    if pct > best_retained:
        pct => best_retained
        c[0] => best_name
"  lowest retention  : " + worst_name + " at " + str(worst_retained) + "%" ^0
"  highest retention : " + best_name + " at " + str(best_retained) + "%" ^0
if worst_retained < best_retained:
    "  the users the bug hurt most are the ones least likely to be there" ^0
"" ^0

# ---- who the fix actually reaches ----

"composition of the affected group, then and now" ^0
for c in cohorts:
    int(c[1] * 100 / affected) => then_pct
    int(remaining(c) * 100 / still_here) => now_pct
    "  " + c[0] + " : " + str(then_pct) + "% of affected then, " + str(now_pct) + "% of the reached now" ^0
"  the fix is aimed at a group whose worst-hit part has thinned out" ^0
"" ^0

# ---- what the ticket count did over the same period ----
#
# Reports come from users who are present. As the worst-hit leave, the report
# rate falls, and the fall looks like the problem improving.

"reports per month, if 20 per 1000 present users report" ^0
0 => early
0 => late
for c in cohorts:
    early + int(c[1] * 20 / 1000) => early
    late + int(remaining(c) * 20 / 1000) => late
"  month 1  : " + str(early) ^0
"  month " + str(months) + " : " + str(late) ^0
if late < early:
    "  down " + str(int((early - late) * 100 / early)) + "%, with no change to the software" ^0
    "  a decline in reports is what a fix looks like and also what leaving" ^0
    "  looks like" ^0
"" ^0

# ---- what the fix is worth, honestly ----

"what shipping it achieves" ^0
"  users who stop hitting it : " + str(still_here) ^0
"  users it was reported for  : " + str(affected) ^0
"  users who left while it was open : " + str(affected - still_here) ^0
"  the first number is real and is the case for shipping it; the third is" ^0
"  the cost of the eleven months and is not recovered by shipping" ^0
"" ^0

# ---- the control: a bug fixed inside a week ----
#
# Where the fix is fast relative to the churn, the two populations are nearly
# the same set and the distinction does not arise.

"control - the same cohorts with a one-week fix" ^0
0 => week_left
for c in cohorts:
    int(c[1] * c[2] / 4000) => gone
    week_left + c[1] - gone => week_left
"  affected : " + str(affected) + ", still here after a week : " + str(week_left) ^0
if week_left * 100 / affected > 95:
    "  over 95% retained, so the fix reaches essentially the reported group" ^0
"" ^0

"The fix is correct and the users who have it are better off. Eleven months" ^0
"is long enough for the population to turn over, and it turns over fastest" ^0
"among the people the bug hurt most." ^0
```

## Python (deterministic transpilation)

```python
cohorts = [["blocked entirely", 400, 90], ["slow and annoying", 1800, 35], ["cosmetic", 3200, 8]]
n = len(cohorts)
months = 11

def remaining(c):
    left = c[1]
    m = 0
    while m < months:
        gone = int(left * c[2] / 1000)
        left = left - gone
        m = m + 1
    return left

affected = 0
still_here = 0
for c in cohorts:
    affected = affected + c[1]
    still_here = still_here + remaining(c)
print("users affected when the bug was reported : " + str(affected))
print("months until the fix shipped : " + str(months))
print("still using the product when it shipped : " + str(still_here))
if affected > 0:
    print("  which is " + str(int(still_here * 100 / affected)) + "%")
print("")
print("severity            affected   churn/1000/mo   still here   retained")
for c in cohorts:
    r = remaining(c)
    print("  " + c[0] + "   " + str(c[1]) + "        " + str(c[2]) + "              " + str(r) + "        " + str(int(r * 100 / c[1])) + "%")
print("")
print("retention by severity")
worst_retained = 0
worst_name = ""
best_retained = 0
best_name = ""
for c in cohorts:
    pct = int(remaining(c) * 100 / c[1])
    if worst_retained == 0:
        worst_retained = pct
        worst_name = c[0]
    if pct < worst_retained:
        worst_retained = pct
        worst_name = c[0]
    if pct > best_retained:
        best_retained = pct
        best_name = c[0]
print("  lowest retention  : " + worst_name + " at " + str(worst_retained) + "%")
print("  highest retention : " + best_name + " at " + str(best_retained) + "%")
if worst_retained < best_retained:
    print("  the users the bug hurt most are the ones least likely to be there")
print("")
print("composition of the affected group, then and now")
for c in cohorts:
    then_pct = int(c[1] * 100 / affected)
    now_pct = int(remaining(c) * 100 / still_here)
    print("  " + c[0] + " : " + str(then_pct) + "% of affected then, " + str(now_pct) + "% of the reached now")
print("  the fix is aimed at a group whose worst-hit part has thinned out")
print("")
print("reports per month, if 20 per 1000 present users report")
early = 0
late = 0
for c in cohorts:
    early = early + int(c[1] * 20 / 1000)
    late = late + int(remaining(c) * 20 / 1000)
print("  month 1  : " + str(early))
print("  month " + str(months) + " : " + str(late))
if late < early:
    print("  down " + str(int((early - late) * 100 / early)) + "%, with no change to the software")
    print("  a decline in reports is what a fix looks like and also what leaving")
    print("  looks like")
print("")
print("what shipping it achieves")
print("  users who stop hitting it : " + str(still_here))
print("  users it was reported for  : " + str(affected))
print("  users who left while it was open : " + str(affected - still_here))
print("  the first number is real and is the case for shipping it; the third is")
print("  the cost of the eleven months and is not recovered by shipping")
print("")
print("control - the same cohorts with a one-week fix")
week_left = 0
for c in cohorts:
    gone = int(c[1] * c[2] / 4000)
    week_left = week_left + c[1] - gone
print("  affected : " + str(affected) + ", still here after a week : " + str(week_left))
if week_left * 100 / affected > 95:
    print("  over 95% retained, so the fix reaches essentially the reported group")
print("")
print("The fix is correct and the users who have it are better off. Eleven months")
print("is long enough for the population to turn over, and it turns over fastest")
print("among the people the bug hurt most.")
```

## stdout (executed)

```text
users affected when the bug was reported : 5400
months until the fix shipped : 11
still using the product when it shipped : 4302
  which is 79%

severity            affected   churn/1000/mo   still here   retained
  blocked entirely   400        90              146        36%
  slow and annoying   1800        35              1222        67%
  cosmetic   3200        8              2934        91%

retention by severity
  lowest retention  : blocked entirely at 36%
  highest retention : cosmetic at 91%
  the users the bug hurt most are the ones least likely to be there

composition of the affected group, then and now
  blocked entirely : 7% of affected then, 3% of the reached now
  slow and annoying : 33% of affected then, 28% of the reached now
  cosmetic : 59% of affected then, 68% of the reached now
  the fix is aimed at a group whose worst-hit part has thinned out

reports per month, if 20 per 1000 present users report
  month 1  : 108
  month 11 : 84
  down 22%, with no change to the software
  a decline in reports is what a fix looks like and also what leaving
  looks like

what shipping it achieves
  users who stop hitting it : 4302
  users it was reported for  : 5400
  users who left while it was open : 1098
  the first number is real and is the case for shipping it; the third is
  the cost of the eleven months and is not recovered by shipping

control - the same cohorts with a one-week fix
  affected : 5400, still here after a week : 5370
  over 95% retained, so the fix reaches essentially the reported group

The fix is correct and the users who have it are better off. Eleven months
is long enough for the population to turn over, and it turns over fastest
among the people the bug hurt most.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
