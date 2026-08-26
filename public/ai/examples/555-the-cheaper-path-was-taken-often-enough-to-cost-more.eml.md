<!-- canonical: efficientnewlanguage.org/ai/examples/555-the-cheaper-path-was-taken-often-enough-to-cost-more | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 555 — The cheaper path was taken often enough to cost more

`the_cheaper_path_was_taken_often_enough_to_cost_more.eml` - A request handler calls five things. The code review flagged the slowest of them. Which one that is depends on a sort order, and both orders are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A request handler
# calls five things. The code review flagged the slowest of them. Which one that
# is depends on a sort order, and both orders are computed below.
#
# Reviewing by cost per call is the right instinct and is what a reviewer can
# actually do. Per-call cost is a property of the function: it can be read off
# the code, reasoned about at the diff, and measured by a microbenchmark that
# runs in a second. Call count is a property of the caller, and of the caller's
# caller, and of the data - none of which is in the diff. So the reviewer sorted
# by the number the review could see, which is the honest thing to do with the
# information available.
#
# Total cost is per-call cost times call count. Neither factor dominates in
# general, and a per-call sort is a total-cost sort only when the counts happen
# to be similar. Here they span four orders of magnitude.
#
# The function with the lowest per-call cost in the table has the highest total
# cost in the table, and the two orderings are close to exact reverses.

# [function, microseconds per call, calls per request]
[["audit_log", 5000, 2], ["render_template", 800, 12], ["db_query", 300, 40], ["checksum", 5, 20000], ["debug_log", 20, 50000]] => calls

"function            us per call   calls   total us" ^0
0 => grand_total
for c in calls:
    c[1] * c[2] => total
    grand_total + total => grand_total
    "  " + c[0] + "        " + str(c[1]) + "         " + str(c[2]) + "     " + str(total) ^0
"" ^0
"  request total: " + str(grand_total) + " us = " + str(int(grand_total / 1000)) + " ms" ^0
"" ^0

# ---- the two orderings ----

"sorted by cost per call, which is what the review saw" ^0
"  1  audit_log         5000 us per call" ^0
"  2  render_template    800" ^0
"  3  db_query           300" ^0
"  4  debug_log           20" ^0
"  5  checksum             5" ^0
"" ^0
"sorted by total cost, which is what the request pays" ^0
"  1  debug_log        " + str(20 * 50000) + " us total" ^0
"  2  checksum         " + str(5 * 20000) ^0
"  3  db_query         " + str(300 * 40) ^0
"  4  audit_log        " + str(5000 * 2) ^0
"  5  render_template  " + str(800 * 12) ^0
"" ^0
"  audit_log is first by per-call and fourth by total" ^0
"  debug_log is fourth by per-call and first by total" ^0
"" ^0

# ---- share of the request ----

"function            share of request time" ^0
for c in calls:
    c[1] * c[2] => total
    "  " + c[0] + "        " + str(int(total * 1000 / grand_total)) + " per mille" ^0
"" ^0

# ---- what removing each one saves ----
#
# The review's recommendation was to make audit_log asynchronous, which is real
# work and does remove its cost. It removes the amount computed here.

"if the flagged function were removed entirely" ^0
5000 * 2 => audit_total
20 * 50000 => debug_total
"  audit_log removed : saves " + str(audit_total) + " us, " + str(int(audit_total * 1000 / grand_total)) + " per mille of the request" ^0
"  debug_log removed : saves " + str(debug_total) + " us, " + str(int(debug_total * 1000 / grand_total)) + " per mille of the request" ^0
"  the review recommended the first" ^0
"" ^0

# ---- the ratio between the two factors ----

"per-call ratio  : audit_log is " + str(int(5000 / 20)) + " times debug_log" ^0
"call count ratio: debug_log is " + str(int(50000 / 2)) + " times audit_log" ^0
"total ratio     : debug_log is " + str(int(debug_total / audit_total)) + " times audit_log" ^0
"" ^0
"  the per-call sort is correct about a 250x difference" ^0
"  it is silent about a 25000x difference in the other factor" ^0
"  and the second factor is 100 times larger than the first" ^0
"" ^0

# ---- the control ----
#
# Per-call cost is not a wrong measurement. Every per-call number in the table
# is exactly right, and a microbenchmark would reproduce each one. The product
# is the thing nobody computed, and the product needs a number that is not in
# the function.

"control - are the per-call numbers themselves wrong" ^0
0 => rows
0 => rows_consistent
for c in calls:
    c[1] * c[2] => total
    rows + 1 => rows
    if int(total / c[2]) == c[1]:
        rows_consistent + 1 => rows_consistent
"  rows checked                 : " + str(rows) ^0
"  per-call cost reproduces total: " + str(rows_consistent) + " of " + str(rows) ^0
"  every per-call figure is correct and the review used them correctly" ^0
"  what is missing is a column, not a correction" ^0
"" ^0

# ---- the null control ----
#
# The same five functions, called the same number of times as each other. Now
# the per-call sort and the total sort agree exactly, and reviewing by per-call
# cost finds the right target. The defect is not "per-call cost is the wrong
# metric" - it is "per-call cost ranks correctly only when counts are level".

10 => level_calls
"null control - the same functions, all called " + str(level_calls) + " times" ^0
"function            total us   rank by total" ^0
"  audit_log        " + str(5000 * level_calls) + "      1" ^0
"  render_template  " + str(800 * level_calls) + "       2" ^0
"  db_query         " + str(300 * level_calls) + "       3" ^0
"  debug_log        " + str(20 * level_calls) + "        4" ^0
"  checksum         " + str(5 * level_calls) + "         5" ^0
"  this is the per-call order, unchanged" ^0
"  same functions, same per-call costs, and now the review's sort is right" ^0
"" ^0

# ---- the rule ----

"what a diff shows and what it does not" ^0
"  cost of the line added        visible" ^0
"  how often the line runs       not visible" ^0
"  where the loop around it is   not visible, it may be three frames up" ^0
"  what the data volume is       not visible, it is a production fact" ^0
"  a reviewer sorting by what a diff shows will sort by per-call cost" ^0
"" ^0

"Per-call cost is what a reviewer can read off a diff and confirm with a" ^0
"one-second microbenchmark, and every per-call figure here is correct. Total" ^0
"cost needs the call count, which lives in the caller and in the data. Sorted" ^0
"by per-call, debug_log is fourth of five. It is " + str(int(debug_total * 1000 / grand_total)) + " per mille of the request," ^0
"and the function the review flagged is " + str(int(audit_total * 1000 / grand_total)) + " per mille." ^0
```

## Python (deterministic transpilation)

```python
calls = [["audit_log", 5000, 2], ["render_template", 800, 12], ["db_query", 300, 40], ["checksum", 5, 20000], ["debug_log", 20, 50000]]
print("function            us per call   calls   total us")
grand_total = 0
for c in calls:
    total = c[1] * c[2]
    grand_total = grand_total + total
    print("  " + c[0] + "        " + str(c[1]) + "         " + str(c[2]) + "     " + str(total))
print("")
print("  request total: " + str(grand_total) + " us = " + str(int(grand_total / 1000)) + " ms")
print("")
print("sorted by cost per call, which is what the review saw")
print("  1  audit_log         5000 us per call")
print("  2  render_template    800")
print("  3  db_query           300")
print("  4  debug_log           20")
print("  5  checksum             5")
print("")
print("sorted by total cost, which is what the request pays")
print("  1  debug_log        " + str(20 * 50000) + " us total")
print("  2  checksum         " + str(5 * 20000))
print("  3  db_query         " + str(300 * 40))
print("  4  audit_log        " + str(5000 * 2))
print("  5  render_template  " + str(800 * 12))
print("")
print("  audit_log is first by per-call and fourth by total")
print("  debug_log is fourth by per-call and first by total")
print("")
print("function            share of request time")
for c in calls:
    total = c[1] * c[2]
    print("  " + c[0] + "        " + str(int(total * 1000 / grand_total)) + " per mille")
print("")
print("if the flagged function were removed entirely")
audit_total = 5000 * 2
debug_total = 20 * 50000
print("  audit_log removed : saves " + str(audit_total) + " us, " + str(int(audit_total * 1000 / grand_total)) + " per mille of the request")
print("  debug_log removed : saves " + str(debug_total) + " us, " + str(int(debug_total * 1000 / grand_total)) + " per mille of the request")
print("  the review recommended the first")
print("")
print("per-call ratio  : audit_log is " + str(int(5000 / 20)) + " times debug_log")
print("call count ratio: debug_log is " + str(int(50000 / 2)) + " times audit_log")
print("total ratio     : debug_log is " + str(int(debug_total / audit_total)) + " times audit_log")
print("")
print("  the per-call sort is correct about a 250x difference")
print("  it is silent about a 25000x difference in the other factor")
print("  and the second factor is 100 times larger than the first")
print("")
print("control - are the per-call numbers themselves wrong")
rows = 0
rows_consistent = 0
for c in calls:
    total = c[1] * c[2]
    rows = rows + 1
    if int(total / c[2]) == c[1]:
        rows_consistent = rows_consistent + 1
print("  rows checked                 : " + str(rows))
print("  per-call cost reproduces total: " + str(rows_consistent) + " of " + str(rows))
print("  every per-call figure is correct and the review used them correctly")
print("  what is missing is a column, not a correction")
print("")
level_calls = 10
print("null control - the same functions, all called " + str(level_calls) + " times")
print("function            total us   rank by total")
print("  audit_log        " + str(5000 * level_calls) + "      1")
print("  render_template  " + str(800 * level_calls) + "       2")
print("  db_query         " + str(300 * level_calls) + "       3")
print("  debug_log        " + str(20 * level_calls) + "        4")
print("  checksum         " + str(5 * level_calls) + "         5")
print("  this is the per-call order, unchanged")
print("  same functions, same per-call costs, and now the review's sort is right")
print("")
print("what a diff shows and what it does not")
print("  cost of the line added        visible")
print("  how often the line runs       not visible")
print("  where the loop around it is   not visible, it may be three frames up")
print("  what the data volume is       not visible, it is a production fact")
print("  a reviewer sorting by what a diff shows will sort by per-call cost")
print("")
print("Per-call cost is what a reviewer can read off a diff and confirm with a")
print("one-second microbenchmark, and every per-call figure here is correct. Total")
print("cost needs the call count, which lives in the caller and in the data. Sorted")
print("by per-call, debug_log is fourth of five. It is " + str(int(debug_total * 1000 / grand_total)) + " per mille of the request,")
print("and the function the review flagged is " + str(int(audit_total * 1000 / grand_total)) + " per mille.")
```

## stdout (executed)

```text
function            us per call   calls   total us
  audit_log        5000         2     10000
  render_template        800         12     9600
  db_query        300         40     12000
  checksum        5         20000     100000
  debug_log        20         50000     1000000

  request total: 1131600 us = 1131 ms

sorted by cost per call, which is what the review saw
  1  audit_log         5000 us per call
  2  render_template    800
  3  db_query           300
  4  debug_log           20
  5  checksum             5

sorted by total cost, which is what the request pays
  1  debug_log        1000000 us total
  2  checksum         100000
  3  db_query         12000
  4  audit_log        10000
  5  render_template  9600

  audit_log is first by per-call and fourth by total
  debug_log is fourth by per-call and first by total

function            share of request time
  audit_log        8 per mille
  render_template        8 per mille
  db_query        10 per mille
  checksum        88 per mille
  debug_log        883 per mille

if the flagged function were removed entirely
  audit_log removed : saves 10000 us, 8 per mille of the request
  debug_log removed : saves 1000000 us, 883 per mille of the request
  the review recommended the first

per-call ratio  : audit_log is 250 times debug_log
call count ratio: debug_log is 25000 times audit_log
total ratio     : debug_log is 100 times audit_log

  the per-call sort is correct about a 250x difference
  it is silent about a 25000x difference in the other factor
  and the second factor is 100 times larger than the first

control - are the per-call numbers themselves wrong
  rows checked                 : 5
  per-call cost reproduces total: 5 of 5
  every per-call figure is correct and the review used them correctly
  what is missing is a column, not a correction

null control - the same functions, all called 10 times
function            total us   rank by total
  audit_log        50000      1
  render_template  8000       2
  db_query         3000       3
  debug_log        200        4
  checksum         50         5
  this is the per-call order, unchanged
  same functions, same per-call costs, and now the review's sort is right

what a diff shows and what it does not
  cost of the line added        visible
  how often the line runs       not visible
  where the loop around it is   not visible, it may be three frames up
  what the data volume is       not visible, it is a production fact
  a reviewer sorting by what a diff shows will sort by per-call cost

Per-call cost is what a reviewer can read off a diff and confirm with a
one-second microbenchmark, and every per-call figure here is correct. Total
cost needs the call count, which lives in the caller and in the data. Sorted
by per-call, debug_log is fourth of five. It is 883 per mille of the request,
and the function the review flagged is 8 per mille.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
