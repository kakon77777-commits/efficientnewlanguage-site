<!-- canonical: efficientnewlanguage.org/ai/examples/575-the-number-was-right-and-the-label-came-from-another-query | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 575 — The number was right and the label came from another query

`the_number_was_right_and_the_label_came_from_another_query.eml` - A report shows four regions and their totals. The names come from one query and the totals from another, joined by row position. What each region is shown as is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A report shows
# four regions and their totals. The names come from one query and the totals
# from another, joined by row position. What each region is shown as is
# computed below.
#
# Splitting the two queries was reasonable and it was done for a reason. The
# names live in a reference table that changes once a quarter and is cached;
# the totals come from a warehouse scan that takes eleven seconds. Running them
# separately lets the page render the labels immediately and fill the numbers
# when they arrive, which is a real improvement a user can feel.
#
# Both queries are correct. Each returns exactly the rows it should, with
# exactly the right values, and each has an ORDER BY - which is more than most
# queries have. They order by different columns, because each was written to be
# read on its own: the names alphabetically, the totals largest first.
#
# Joining by position is joining on a column neither query returns.

# [region, true total]
[["north", 960], ["south", 175], ["east", 412], ["west", 388]] => truth

# query A: names, ORDER BY name
["east", "north", "south", "west"] => names_by_name

# query B: totals, ORDER BY total DESC
[960, 412, 388, 175] => totals_by_value

"query A returns names ordered by name  : east, north, south, west" ^0
"query B returns totals ordered by value: 960, 412, 388, 175" ^0
"the report pairs them by row position" ^0
"" ^0

"region   shown   true    correct" ^0
0 => mislabelled
0 => shown_sum
0 => true_sum
0 => idx
for n in names_by_name:
    totals_by_value[idx] => shown
    shown_sum + shown => shown_sum
    0 => actual
    for t in truth:
        if t[0] == n:
            t[1] => actual
    true_sum + actual => true_sum
    if shown == actual:
        "  " + n + "     " + str(shown) + "     " + str(actual) + "     yes" ^0
    else:
        mislabelled + 1 => mislabelled
        "  " + n + "     " + str(shown) + "     " + str(actual) + "     NO" ^0
    idx + 1 => idx
"" ^0

"  rows with the wrong label : " + str(mislabelled) + " of " + str(idx) ^0
"" ^0

# ---- what reconciles anyway ----
#
# Position-joining is a permutation. A permutation preserves every quantity
# that does not depend on which value sits beside which name.

"quantities that survive a permutation" ^0
"  sum of the totals, as shown : " + str(shown_sum) ^0
"  sum of the totals, true     : " + str(true_sum) ^0
"  difference                  : " + str(shown_sum - true_sum) ^0
"  row count, as shown         : " + str(idx) ^0
"  largest value on the page   : " + str(totals_by_value[0]) ^0
"  largest value in truth      : 960" ^0
"" ^0
"  the monthly reconciliation compares the total and the row count" ^0
"  both match exactly, and they would match under any permutation" ^0
"" ^0

# ---- what does not survive ----

"questions the report is now wrong about" ^0
"  what is the total across regions   right" ^0
"  how many regions are there         right" ^0
"  what is the largest regional total right" ^0
"  WHICH region is largest            wrong" ^0
"  is north above target              wrong" ^0
"  every question naming a region is wrong and every aggregate is right" ^0
"" ^0

# ---- when the two orderings coincide ----
#
# If the alphabetical order happens to match the descending-value order, the
# position join is correct by accident. That is one arrangement out of many,
# and a small test fixture is unusually likely to land on it.

"a fixture where the two orderings agree" ^0
[["alpha", 900], ["bravo", 600], ["charlie", 300], ["delta", 100]] => lucky
0 => lucky_wrong
0 => lidx
for lk in lucky:
    lucky[lidx][1] => shown
    if shown == lk[1]:
        "  " + lk[0] + " : shown " + str(shown) + ", true " + str(lk[1]) + ", correct" ^0
    else:
        lucky_wrong + 1 => lucky_wrong
        "  " + lk[0] + " : shown " + str(shown) + ", true " + str(lk[1]) + ", WRONG" ^0
    lidx + 1 => lidx
"  mislabelled rows : " + str(lucky_wrong) + " of " + str(lidx) ^0
"  names ascending and values descending happen to agree here" ^0
"  a fixture written alphabetically with decreasing values passes" ^0
"" ^0

# ---- the control ----
#
# Each query on its own. Both return the right rows with the right values in a
# defined order, and running either one by hand reproduces the report's data
# exactly.

"control - each query judged alone" ^0
"  query A: returns 4 region names, ordered by name   : correct" ^0
"  query B: returns 4 totals, ordered by value desc   : correct" ^0
"  incorrect queries : 0 of 2" ^0
"  and each has an explicit ORDER BY, which is more than most queries have" ^0
"" ^0
"  the defect is in the join, and the join is a line of presentation code" ^0
"  that reads neither query's ORDER BY" ^0
"" ^0

# ---- the null control ----
#
# The same two queries, both ordered by the same column. Position becomes a
# valid join key because both sides are the same permutation. Nothing else
# changes.

["north", "east", "west", "south"] => names_by_value

"null control - the same position join with both sides ordered by value" ^0
0 => nc_wrong
0 => nidx
for n in names_by_value:
    totals_by_value[nidx] => shown
    0 => actual
    for t in truth:
        if t[0] == n:
            t[1] => actual
    if shown == actual:
        "  " + n + " : " + str(shown) + ", correct" ^0
    else:
        nc_wrong + 1 => nc_wrong
        "  " + n + " : " + str(shown) + ", wrong, true is " + str(actual) ^0
    nidx + 1 => nidx
"  mislabelled rows : " + str(nc_wrong) + " of " + str(nidx) ^0
"  same join, same code, same two queries" ^0
"  position is a valid key exactly when both sides share an ordering" ^0
"" ^0

# ---- the rule ----

"joining two result sets by position" ^0
"  each query correct on its own       necessary, not sufficient" ^0
"  each query has an ORDER BY          necessary, not sufficient" ^0
"  the two ORDER BY clauses agree      this is the condition" ^0
"  and it is not stated in either query, or in the join" ^0
"" ^0
"the aggregate checks cannot find it, because a permutation preserves them" ^0
"the check that finds it is joining on a key, which removes the question" ^0
"" ^0

"Splitting the queries lets the page render labels in milliseconds instead of" ^0
"eleven seconds, and both queries are correct with an explicit ORDER BY each." ^0
"They order by different columns because each was written to be read alone." ^0
"Pairing them by row position mislabels " + str(mislabelled) + " of " + str(idx) + " rows while the total, " + str(shown_sum) + "," ^0
"and the row count both reconcile exactly - as they would under any" ^0
"permutation." ^0
```

## Python (deterministic transpilation)

```python
truth = [["north", 960], ["south", 175], ["east", 412], ["west", 388]]
names_by_name = ["east", "north", "south", "west"]
totals_by_value = [960, 412, 388, 175]
print("query A returns names ordered by name  : east, north, south, west")
print("query B returns totals ordered by value: 960, 412, 388, 175")
print("the report pairs them by row position")
print("")
print("region   shown   true    correct")
mislabelled = 0
shown_sum = 0
true_sum = 0
idx = 0
for n in names_by_name:
    shown = totals_by_value[idx]
    shown_sum = shown_sum + shown
    actual = 0
    for t in truth:
        if t[0] == n:
            actual = t[1]
    true_sum = true_sum + actual
    if shown == actual:
        print("  " + n + "     " + str(shown) + "     " + str(actual) + "     yes")
    else:
        mislabelled = mislabelled + 1
        print("  " + n + "     " + str(shown) + "     " + str(actual) + "     NO")
    idx = idx + 1
print("")
print("  rows with the wrong label : " + str(mislabelled) + " of " + str(idx))
print("")
print("quantities that survive a permutation")
print("  sum of the totals, as shown : " + str(shown_sum))
print("  sum of the totals, true     : " + str(true_sum))
print("  difference                  : " + str(shown_sum - true_sum))
print("  row count, as shown         : " + str(idx))
print("  largest value on the page   : " + str(totals_by_value[0]))
print("  largest value in truth      : 960")
print("")
print("  the monthly reconciliation compares the total and the row count")
print("  both match exactly, and they would match under any permutation")
print("")
print("questions the report is now wrong about")
print("  what is the total across regions   right")
print("  how many regions are there         right")
print("  what is the largest regional total right")
print("  WHICH region is largest            wrong")
print("  is north above target              wrong")
print("  every question naming a region is wrong and every aggregate is right")
print("")
print("a fixture where the two orderings agree")
lucky = [["alpha", 900], ["bravo", 600], ["charlie", 300], ["delta", 100]]
lucky_wrong = 0
lidx = 0
for lk in lucky:
    shown = lucky[lidx][1]
    if shown == lk[1]:
        print("  " + lk[0] + " : shown " + str(shown) + ", true " + str(lk[1]) + ", correct")
    else:
        lucky_wrong = lucky_wrong + 1
        print("  " + lk[0] + " : shown " + str(shown) + ", true " + str(lk[1]) + ", WRONG")
    lidx = lidx + 1
print("  mislabelled rows : " + str(lucky_wrong) + " of " + str(lidx))
print("  names ascending and values descending happen to agree here")
print("  a fixture written alphabetically with decreasing values passes")
print("")
print("control - each query judged alone")
print("  query A: returns 4 region names, ordered by name   : correct")
print("  query B: returns 4 totals, ordered by value desc   : correct")
print("  incorrect queries : 0 of 2")
print("  and each has an explicit ORDER BY, which is more than most queries have")
print("")
print("  the defect is in the join, and the join is a line of presentation code")
print("  that reads neither query's ORDER BY")
print("")
names_by_value = ["north", "east", "west", "south"]
print("null control - the same position join with both sides ordered by value")
nc_wrong = 0
nidx = 0
for n in names_by_value:
    shown = totals_by_value[nidx]
    actual = 0
    for t in truth:
        if t[0] == n:
            actual = t[1]
    if shown == actual:
        print("  " + n + " : " + str(shown) + ", correct")
    else:
        nc_wrong = nc_wrong + 1
        print("  " + n + " : " + str(shown) + ", wrong, true is " + str(actual))
    nidx = nidx + 1
print("  mislabelled rows : " + str(nc_wrong) + " of " + str(nidx))
print("  same join, same code, same two queries")
print("  position is a valid key exactly when both sides share an ordering")
print("")
print("joining two result sets by position")
print("  each query correct on its own       necessary, not sufficient")
print("  each query has an ORDER BY          necessary, not sufficient")
print("  the two ORDER BY clauses agree      this is the condition")
print("  and it is not stated in either query, or in the join")
print("")
print("the aggregate checks cannot find it, because a permutation preserves them")
print("the check that finds it is joining on a key, which removes the question")
print("")
print("Splitting the queries lets the page render labels in milliseconds instead of")
print("eleven seconds, and both queries are correct with an explicit ORDER BY each.")
print("They order by different columns because each was written to be read alone.")
print("Pairing them by row position mislabels " + str(mislabelled) + " of " + str(idx) + " rows while the total, " + str(shown_sum) + ",")
print("and the row count both reconcile exactly - as they would under any")
print("permutation.")
```

## stdout (executed)

```text
query A returns names ordered by name  : east, north, south, west
query B returns totals ordered by value: 960, 412, 388, 175
the report pairs them by row position

region   shown   true    correct
  east     960     412     NO
  north     412     960     NO
  south     388     175     NO
  west     175     388     NO

  rows with the wrong label : 4 of 4

quantities that survive a permutation
  sum of the totals, as shown : 1935
  sum of the totals, true     : 1935
  difference                  : 0
  row count, as shown         : 4
  largest value on the page   : 960
  largest value in truth      : 960

  the monthly reconciliation compares the total and the row count
  both match exactly, and they would match under any permutation

questions the report is now wrong about
  what is the total across regions   right
  how many regions are there         right
  what is the largest regional total right
  WHICH region is largest            wrong
  is north above target              wrong
  every question naming a region is wrong and every aggregate is right

a fixture where the two orderings agree
  alpha : shown 900, true 900, correct
  bravo : shown 600, true 600, correct
  charlie : shown 300, true 300, correct
  delta : shown 100, true 100, correct
  mislabelled rows : 0 of 4
  names ascending and values descending happen to agree here
  a fixture written alphabetically with decreasing values passes

control - each query judged alone
  query A: returns 4 region names, ordered by name   : correct
  query B: returns 4 totals, ordered by value desc   : correct
  incorrect queries : 0 of 2
  and each has an explicit ORDER BY, which is more than most queries have

  the defect is in the join, and the join is a line of presentation code
  that reads neither query's ORDER BY

null control - the same position join with both sides ordered by value
  north : 960, correct
  east : 412, correct
  west : 388, correct
  south : 175, correct
  mislabelled rows : 0 of 4
  same join, same code, same two queries
  position is a valid key exactly when both sides share an ordering

joining two result sets by position
  each query correct on its own       necessary, not sufficient
  each query has an ORDER BY          necessary, not sufficient
  the two ORDER BY clauses agree      this is the condition
  and it is not stated in either query, or in the join

the aggregate checks cannot find it, because a permutation preserves them
the check that finds it is joining on a key, which removes the question

Splitting the queries lets the page render labels in milliseconds instead of
eleven seconds, and both queries are correct with an explicit ORDER BY each.
They order by different columns because each was written to be read alone.
Pairing them by row position mislabels 4 of 4 rows while the total, 1935,
and the row count both reconcile exactly - as they would under any
permutation.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
