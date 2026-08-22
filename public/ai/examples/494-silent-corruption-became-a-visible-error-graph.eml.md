<!-- canonical: efficientnewlanguage.org/ai/examples/494-silent-corruption-became-a-visible-error-graph | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 494 — Silent corruption became a visible error graph

`silent_corruption_became_a_visible_error_graph.eml` - Validation was added and the error rate went from near zero to four percent. What changed is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Validation was
# added and the error rate went from near zero to four percent. What changed is
# computed below.
#
# Adding the validation was right and the reviewers who asked for it were right.
# Malformed records were being written and read back wrong, quietly, for years.
# A record that fails loudly at the door is strictly better than one that is
# stored and misread later.
#
# The error graph is a count of what the system now refuses, and before the fix
# it was a count of nothing, because nothing was refused. The line going up is
# the same records, at the same rate, meeting a door that now exists.
#
# The records are counted before and after.

# per week: [week, records in, malformed, rejected at the door, corrupted rows written]
[[1, 50000, 2000, 0, 2000], [2, 51000, 2050, 0, 2050], [3, 49000, 1960, 0, 1960], [4, 52000, 2080, 2080, 0], [5, 50500, 2020, 2020, 0], [6, 51500, 2060, 2060, 0]] => weeks

len(weeks) => n
3 => fix_week

0 => before_in
0 => before_bad
0 => before_rej
0 => after_in
0 => after_bad
0 => after_rej
for w in weeks:
    if w[0] <= fix_week:
        before_in + w[1] => before_in
        before_bad + w[2] => before_bad
        before_rej + w[3] => before_rej
    else:
        after_in + w[1] => after_in
        after_bad + w[2] => after_bad
        after_rej + w[3] => after_rej

"week   records in   malformed   rejected   corrupted rows written" ^0
for w in weeks:
    "  " + str(w[0]) + "      " + str(w[1]) + "        " + str(w[2]) + "        " + str(w[3]) + "         " + str(w[4]) ^0
"" ^0
"validation shipped after week " + str(fix_week) ^0
"" ^0

"the error rate, as the dashboard shows it" ^0
"  weeks 1-" + str(fix_week) + " : " + str(int(before_rej * 1000 / before_in)) + " per 1000" ^0
"  weeks " + str(fix_week + 1) + "-" + str(n) + " : " + str(int(after_rej * 1000 / after_in)) + " per 1000" ^0
if after_rej > before_rej:
    "  a rise from nothing to " + str(int(after_rej * 100 / after_in)) + "%" ^0
"" ^0

"the malformed rate, which is the thing the error rate is about" ^0
"  weeks 1-" + str(fix_week) + " : " + str(int(before_bad * 1000 / before_in)) + " per 1000" ^0
"  weeks " + str(fix_week + 1) + "-" + str(n) + " : " + str(int(after_bad * 1000 / after_in)) + " per 1000" ^0
if int(before_bad * 1000 / before_in) == int(after_bad * 1000 / after_in):
    "  unchanged - the senders did not start sending worse data" ^0
"" ^0

# ---- what the fix actually removed ----

0 => before_corrupt
0 => after_corrupt
for w in weeks:
    if w[0] <= fix_week:
        before_corrupt + w[4] => before_corrupt
    else:
        after_corrupt + w[4] => after_corrupt
"corrupted rows written to the store" ^0
"  before : " + str(before_corrupt) ^0
"  after  : " + str(after_corrupt) ^0
if before_corrupt > after_corrupt:
    "  the fix removed " + str(before_corrupt - after_corrupt) + " bad rows over three weeks" ^0
    "  and that number appears on no graph, because a row that is not written" ^0
    "  leaves nothing to count" ^0
"" ^0

# ---- the two graphs, side by side ----

"what each graph does at the fix" ^0
"  errors           : 0 -> " + str(int(after_rej / (n - fix_week))) + " a week, a visible regression" ^0
"  corrupted rows   : " + str(int(before_corrupt / fix_week)) + " -> 0 a week, and nobody was plotting it" ^0
"  the improvement is the series that was never instrumented, because before" ^0
"  the fix there was no event to instrument" ^0
"" ^0

# ---- what the rollback conversation looks like ----

"the case for reverting, as it is made" ^0
"  error rate before the change : ~0" ^0
"  error rate after             : " + str(int(after_rej * 100 / after_in)) + "%" ^0
"  time to revert               : one deploy" ^0
"  every number in that case is correct" ^0
"the case against, which needs a number nobody has" ^0
"  bad rows currently in the store from the earlier weeks : " + str(before_corrupt) ^0
"  cost of each one : whatever reading it wrong costs, discovered later" ^0
"" ^0

# ---- what would have made it legible ----

"instrumenting the thing being prevented, not the prevention" ^0
"  count malformed records at the door BEFORE enforcing : possible for" ^0
"  weeks 1-" + str(fix_week) + ", by logging without rejecting" ^0
"  the graph would then already be at " + str(int(before_bad * 1000 / before_in)) + " per 1000 before the fix," ^0
"  and enforcing it would move a different line - the corrupted-rows one -" ^0
"  which is the line the change is about" ^0
"" ^0

# ---- the control: a validation that rejects nothing ----
#
# Where the incoming data is already clean, adding the same check moves no
# line at all, and the change is invisible in both directions.

[[7, 50000, 0, 0, 0], [8, 50000, 0, 0, 0]] => clean
0 => c_bad
for w in clean:
    c_bad + w[2] => c_bad
"control - the same validation on a clean feed" ^0
"  malformed records : " + str(c_bad) ^0
if c_bad == 0:
    "  the error graph does not move and neither does the corruption graph," ^0
    "  so this feed cannot show what the change does" ^0
"" ^0

"The validation is right and a record that fails at the door beats one that" ^0
"is stored and misread. The error graph counts what is now refused; before" ^0
"the fix it counted nothing, because nothing was." ^0
```

## Python (deterministic transpilation)

```python
weeks = [[1, 50000, 2000, 0, 2000], [2, 51000, 2050, 0, 2050], [3, 49000, 1960, 0, 1960], [4, 52000, 2080, 2080, 0], [5, 50500, 2020, 2020, 0], [6, 51500, 2060, 2060, 0]]
n = len(weeks)
fix_week = 3
before_in = 0
before_bad = 0
before_rej = 0
after_in = 0
after_bad = 0
after_rej = 0
for w in weeks:
    if w[0] <= fix_week:
        before_in = before_in + w[1]
        before_bad = before_bad + w[2]
        before_rej = before_rej + w[3]
    else:
        after_in = after_in + w[1]
        after_bad = after_bad + w[2]
        after_rej = after_rej + w[3]
print("week   records in   malformed   rejected   corrupted rows written")
for w in weeks:
    print("  " + str(w[0]) + "      " + str(w[1]) + "        " + str(w[2]) + "        " + str(w[3]) + "         " + str(w[4]))
print("")
print("validation shipped after week " + str(fix_week))
print("")
print("the error rate, as the dashboard shows it")
print("  weeks 1-" + str(fix_week) + " : " + str(int(before_rej * 1000 / before_in)) + " per 1000")
print("  weeks " + str(fix_week + 1) + "-" + str(n) + " : " + str(int(after_rej * 1000 / after_in)) + " per 1000")
if after_rej > before_rej:
    print("  a rise from nothing to " + str(int(after_rej * 100 / after_in)) + "%")
print("")
print("the malformed rate, which is the thing the error rate is about")
print("  weeks 1-" + str(fix_week) + " : " + str(int(before_bad * 1000 / before_in)) + " per 1000")
print("  weeks " + str(fix_week + 1) + "-" + str(n) + " : " + str(int(after_bad * 1000 / after_in)) + " per 1000")
if int(before_bad * 1000 / before_in) == int(after_bad * 1000 / after_in):
    print("  unchanged - the senders did not start sending worse data")
print("")
before_corrupt = 0
after_corrupt = 0
for w in weeks:
    if w[0] <= fix_week:
        before_corrupt = before_corrupt + w[4]
    else:
        after_corrupt = after_corrupt + w[4]
print("corrupted rows written to the store")
print("  before : " + str(before_corrupt))
print("  after  : " + str(after_corrupt))
if before_corrupt > after_corrupt:
    print("  the fix removed " + str(before_corrupt - after_corrupt) + " bad rows over three weeks")
    print("  and that number appears on no graph, because a row that is not written")
    print("  leaves nothing to count")
print("")
print("what each graph does at the fix")
print("  errors           : 0 -> " + str(int(after_rej / (n - fix_week))) + " a week, a visible regression")
print("  corrupted rows   : " + str(int(before_corrupt / fix_week)) + " -> 0 a week, and nobody was plotting it")
print("  the improvement is the series that was never instrumented, because before")
print("  the fix there was no event to instrument")
print("")
print("the case for reverting, as it is made")
print("  error rate before the change : ~0")
print("  error rate after             : " + str(int(after_rej * 100 / after_in)) + "%")
print("  time to revert               : one deploy")
print("  every number in that case is correct")
print("the case against, which needs a number nobody has")
print("  bad rows currently in the store from the earlier weeks : " + str(before_corrupt))
print("  cost of each one : whatever reading it wrong costs, discovered later")
print("")
print("instrumenting the thing being prevented, not the prevention")
print("  count malformed records at the door BEFORE enforcing : possible for")
print("  weeks 1-" + str(fix_week) + ", by logging without rejecting")
print("  the graph would then already be at " + str(int(before_bad * 1000 / before_in)) + " per 1000 before the fix,")
print("  and enforcing it would move a different line - the corrupted-rows one -")
print("  which is the line the change is about")
print("")
clean = [[7, 50000, 0, 0, 0], [8, 50000, 0, 0, 0]]
c_bad = 0
for w in clean:
    c_bad = c_bad + w[2]
print("control - the same validation on a clean feed")
print("  malformed records : " + str(c_bad))
if c_bad == 0:
    print("  the error graph does not move and neither does the corruption graph,")
    print("  so this feed cannot show what the change does")
print("")
print("The validation is right and a record that fails at the door beats one that")
print("is stored and misread. The error graph counts what is now refused; before")
print("the fix it counted nothing, because nothing was.")
```

## stdout (executed)

```text
week   records in   malformed   rejected   corrupted rows written
  1      50000        2000        0         2000
  2      51000        2050        0         2050
  3      49000        1960        0         1960
  4      52000        2080        2080         0
  5      50500        2020        2020         0
  6      51500        2060        2060         0

validation shipped after week 3

the error rate, as the dashboard shows it
  weeks 1-3 : 0 per 1000
  weeks 4-6 : 40 per 1000
  a rise from nothing to 4%

the malformed rate, which is the thing the error rate is about
  weeks 1-3 : 40 per 1000
  weeks 4-6 : 40 per 1000
  unchanged - the senders did not start sending worse data

corrupted rows written to the store
  before : 6010
  after  : 0
  the fix removed 6010 bad rows over three weeks
  and that number appears on no graph, because a row that is not written
  leaves nothing to count

what each graph does at the fix
  errors           : 0 -> 2053 a week, a visible regression
  corrupted rows   : 2003 -> 0 a week, and nobody was plotting it
  the improvement is the series that was never instrumented, because before
  the fix there was no event to instrument

the case for reverting, as it is made
  error rate before the change : ~0
  error rate after             : 4%
  time to revert               : one deploy
  every number in that case is correct
the case against, which needs a number nobody has
  bad rows currently in the store from the earlier weeks : 6010
  cost of each one : whatever reading it wrong costs, discovered later

instrumenting the thing being prevented, not the prevention
  count malformed records at the door BEFORE enforcing : possible for
  weeks 1-3, by logging without rejecting
  the graph would then already be at 40 per 1000 before the fix,
  and enforcing it would move a different line - the corrupted-rows one -
  which is the line the change is about

control - the same validation on a clean feed
  malformed records : 0
  the error graph does not move and neither does the corruption graph,
  so this feed cannot show what the change does

The validation is right and a record that fails at the door beats one that
is stored and misread. The error graph counts what is now refused; before
the fix it counted nothing, because nothing was.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
