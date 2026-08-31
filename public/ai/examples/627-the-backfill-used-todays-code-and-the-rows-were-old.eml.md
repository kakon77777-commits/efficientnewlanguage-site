<!-- canonical: efficientnewlanguage.org/ai/examples/627-the-backfill-used-todays-code-and-the-rows-were-old | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 627 — The backfill used todays code and the rows were old

`the_backfill_used_todays_code_and_the_rows_were_old.eml` - Three years of events are reprocessed through the current pipeline, which is correct. How many recomputed values disagree with what was actually done is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three years of
# events are reprocessed through the current pipeline, which is correct. How
# many recomputed values disagree with what was actually done is computed below.
#
# The pipeline is right. It was reviewed, it is covered, and every value it
# produces today matches what the business rules say today. Running history
# through it is the obvious way to rebuild a derived table, and the rebuild
# itself has no bug in it.
#
# Correctness is dated. The pipeline implements the rules IN FORCE NOW, and each
# historical event was decided under the rules in force then. Reprocessing does
# not recover the old decision; it replaces it with the decision today's rules
# would have made.
#
# Four rules changed in the window. The recomputed table is internally
# consistent, disagrees with the ledger on twenty-three percent of rows, and the
# reconciliation report attributes every disagreement to the ledger.

41300000 => events_reprocessed
4 => rule_changes_in_the_window
28900000 => events_predating_the_latest_change
9640000 => recomputed_differs_from_recorded
# Found by a separate audit that read the rule in force on each event's date.
12400 => genuinely_wrong_when_recorded

recomputed_differs_from_recorded - genuinely_wrong_when_recorded => differ_only_because_the_rule_changed

"events reprocessed              : " + str(events_reprocessed) ^0
"rule changes in the window      : " + str(rule_changes_in_the_window) ^0
"events predating the last change: " + str(events_predating_the_latest_change) ^0
"recomputed differs from recorded: " + str(recomputed_differs_from_recorded) ^0
"  wrong when it was recorded    : " + str(genuinely_wrong_when_recorded) ^0
"  differs because a rule changed: " + str(differ_only_because_the_rule_changed) ^0
"" ^0

# ---- what the backfill verified ----

"the backfill's own checks" ^0
"  events read           : " + str(events_reprocessed) ^0
"  events dropped        : 0" ^0
"  pipeline exceptions   : 0" ^0
"  output self-consistent: yes" ^0
"  verdict               : SUCCESS" ^0
"" ^0
"  all true; the pipeline applied one rule set uniformly and" ^0
"  did not fail on a single row" ^0
"" ^0

# ---- what uniformity cost ----

"applying one rule set to three years" ^0
"  rule set applied     : the one in force today" ^0
"  rule set that decided: whichever was in force that day" ^0
"  events where those are the same : " + str(events_reprocessed - events_predating_the_latest_change) ^0
"  events where they are not       : " + str(events_predating_the_latest_change) ^0
"" ^0
"  the pipeline has no input for the second one; a rule set" ^0
"  is not a column on the event" ^0
"" ^0

int(recomputed_differs_from_recorded * 10000 / events_reprocessed) => differs_per_myriad
"share disagreeing with the ledger : " + str(differs_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the reconciliation concluded ----

# The report has one column for "expected" and one for "actual", and the
# recomputed value is in the expected column because it came from the code.
"the reconciliation report" ^0
"  expected : the recomputed value" ^0
"  actual   : the ledger" ^0
"  rows flagged as ledger errors : " + str(recomputed_differs_from_recorded) ^0
"  rows that are ledger errors   : " + str(genuinely_wrong_when_recorded) ^0
"" ^0
"  the two are not distinguishable from inside the report," ^0
"  because both sides are values and the thing that separates" ^0
"  them is a date the report does not carry" ^0
"" ^0

# ---- null control ----

# The same backfill with the rule set selected per event by its date.
genuinely_wrong_when_recorded => nc_differs_from_recorded

"null control - the rule set chosen by the event's date" ^0
"  pipeline exceptions   : 0, unchanged" ^0
"  differs from recorded : " + str(nc_differs_from_recorded) ^0
"  the pipeline did not get more correct; it stopped being" ^0
"  asked a question about today" ^0
"" ^0

# ---- the rule ----

"what a correct pipeline guarantees" ^0
"  every output follows from the rules it implements : exactly" ^0
"  every output matches the decision that was made   : not" ^0
"    addressed, and reprocessing is precisely the operation" ^0
"    that discards the second one" ^0
"" ^0
"a backfill recomputes; it does not recover. If the rules ever" ^0
"changed, the recomputed value answers a question nobody asked" ^0
"on that date, and the ledger is the only record that they did" ^0
"" ^0

"The pipeline is correct and the backfill is right to report success: " + str(events_reprocessed) ^0
"events read, 0 dropped, 0 exceptions, output self-consistent. It disagrees with" ^0
"the ledger on " + str(recomputed_differs_from_recorded) + " rows - " + str(differs_per_myriad) + " per ten thousand - of which " + str(genuinely_wrong_when_recorded) ^0
"were wrong when they were written and " + str(differ_only_because_the_rule_changed) + " differ because one of " + str(rule_changes_in_the_window) ^0
"rules changed afterwards, and the report files all of them under ledger error." ^0
```

## Python (deterministic transpilation)

```python
events_reprocessed = 41300000
rule_changes_in_the_window = 4
events_predating_the_latest_change = 28900000
recomputed_differs_from_recorded = 9640000
genuinely_wrong_when_recorded = 12400
differ_only_because_the_rule_changed = recomputed_differs_from_recorded - genuinely_wrong_when_recorded
print("events reprocessed              : " + str(events_reprocessed))
print("rule changes in the window      : " + str(rule_changes_in_the_window))
print("events predating the last change: " + str(events_predating_the_latest_change))
print("recomputed differs from recorded: " + str(recomputed_differs_from_recorded))
print("  wrong when it was recorded    : " + str(genuinely_wrong_when_recorded))
print("  differs because a rule changed: " + str(differ_only_because_the_rule_changed))
print("")
print("the backfill's own checks")
print("  events read           : " + str(events_reprocessed))
print("  events dropped        : 0")
print("  pipeline exceptions   : 0")
print("  output self-consistent: yes")
print("  verdict               : SUCCESS")
print("")
print("  all true; the pipeline applied one rule set uniformly and")
print("  did not fail on a single row")
print("")
print("applying one rule set to three years")
print("  rule set applied     : the one in force today")
print("  rule set that decided: whichever was in force that day")
print("  events where those are the same : " + str(events_reprocessed - events_predating_the_latest_change))
print("  events where they are not       : " + str(events_predating_the_latest_change))
print("")
print("  the pipeline has no input for the second one; a rule set")
print("  is not a column on the event")
print("")
differs_per_myriad = int(recomputed_differs_from_recorded * 10000 / events_reprocessed)
print("share disagreeing with the ledger : " + str(differs_per_myriad) + " per ten thousand")
print("")
print("the reconciliation report")
print("  expected : the recomputed value")
print("  actual   : the ledger")
print("  rows flagged as ledger errors : " + str(recomputed_differs_from_recorded))
print("  rows that are ledger errors   : " + str(genuinely_wrong_when_recorded))
print("")
print("  the two are not distinguishable from inside the report,")
print("  because both sides are values and the thing that separates")
print("  them is a date the report does not carry")
print("")
nc_differs_from_recorded = genuinely_wrong_when_recorded
print("null control - the rule set chosen by the event's date")
print("  pipeline exceptions   : 0, unchanged")
print("  differs from recorded : " + str(nc_differs_from_recorded))
print("  the pipeline did not get more correct; it stopped being")
print("  asked a question about today")
print("")
print("what a correct pipeline guarantees")
print("  every output follows from the rules it implements : exactly")
print("  every output matches the decision that was made   : not")
print("    addressed, and reprocessing is precisely the operation")
print("    that discards the second one")
print("")
print("a backfill recomputes; it does not recover. If the rules ever")
print("changed, the recomputed value answers a question nobody asked")
print("on that date, and the ledger is the only record that they did")
print("")
print("The pipeline is correct and the backfill is right to report success: " + str(events_reprocessed))
print("events read, 0 dropped, 0 exceptions, output self-consistent. It disagrees with")
print("the ledger on " + str(recomputed_differs_from_recorded) + " rows - " + str(differs_per_myriad) + " per ten thousand - of which " + str(genuinely_wrong_when_recorded))
print("were wrong when they were written and " + str(differ_only_because_the_rule_changed) + " differ because one of " + str(rule_changes_in_the_window))
print("rules changed afterwards, and the report files all of them under ledger error.")
```

## stdout (executed)

```text
events reprocessed              : 41300000
rule changes in the window      : 4
events predating the last change: 28900000
recomputed differs from recorded: 9640000
  wrong when it was recorded    : 12400
  differs because a rule changed: 9627600

the backfill's own checks
  events read           : 41300000
  events dropped        : 0
  pipeline exceptions   : 0
  output self-consistent: yes
  verdict               : SUCCESS

  all true; the pipeline applied one rule set uniformly and
  did not fail on a single row

applying one rule set to three years
  rule set applied     : the one in force today
  rule set that decided: whichever was in force that day
  events where those are the same : 12400000
  events where they are not       : 28900000

  the pipeline has no input for the second one; a rule set
  is not a column on the event

share disagreeing with the ledger : 2334 per ten thousand

the reconciliation report
  expected : the recomputed value
  actual   : the ledger
  rows flagged as ledger errors : 9640000
  rows that are ledger errors   : 12400

  the two are not distinguishable from inside the report,
  because both sides are values and the thing that separates
  them is a date the report does not carry

null control - the rule set chosen by the event's date
  pipeline exceptions   : 0, unchanged
  differs from recorded : 12400
  the pipeline did not get more correct; it stopped being
  asked a question about today

what a correct pipeline guarantees
  every output follows from the rules it implements : exactly
  every output matches the decision that was made   : not
    addressed, and reprocessing is precisely the operation
    that discards the second one

a backfill recomputes; it does not recover. If the rules ever
changed, the recomputed value answers a question nobody asked
on that date, and the ledger is the only record that they did

The pipeline is correct and the backfill is right to report success: 41300000
events read, 0 dropped, 0 exceptions, output self-consistent. It disagrees with
the ledger on 9640000 rows - 2334 per ten thousand - of which 12400
were wrong when they were written and 9627600 differ because one of 4
rules changed afterwards, and the report files all of them under ledger error.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
