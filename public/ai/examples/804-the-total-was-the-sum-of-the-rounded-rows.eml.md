<!-- canonical: efficientnewlanguage.org/ai/examples/804-the-total-was-the-sum-of-the-rounded-rows | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 804 — The total was the sum of the rounded rows

`the_total_was_the_sum_of_the_rounded_rows.eml` - Every line on the invoice run is correct to the cent, and so is each rounding. What the total is a sum of is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every line on the
# invoice run is correct to the cent, and so is each rounding. What the total is
# a sum of is computed below.
#
# The rounding is done properly per row. Each amount is rounded half-up to the
# nearest cent; the rule is the same for every row; no row is truncated; and the
# rounded figure on each line is exactly what the customer is billed for.
#
# The reported total is the sum of the rounded lines.

90000 => rows
4500037 => reported_total_cents
4500012 => correct_total_cents
5 => max_row_error_tenths_of_a_cent

reported_total_cents - correct_total_cents => difference_cents
int(rows * max_row_error_tenths_of_a_cent / 10) => worst_case_drift_cents
int(difference_cents * 10000 / correct_total_cents) => difference_per_myriad_of_the_total
int(reported_total_cents / 100) => reported_total_dollars

"rows                            : " + str(rows) ^0
"each row correct to             : the cent, half-up" ^0
"" ^0
"reported total (sum of rounded) : " + str(reported_total_cents) + " cents" ^0
"correct total (sum then round)  : " + str(correct_total_cents) + " cents" ^0
"  difference                    : " + str(difference_cents) + " cents" ^0
"  as a share of the total       : " + str(difference_per_myriad_of_the_total) + " per ten thousand" ^0
"worst case if errors aligned    : " + str(worst_case_drift_cents) + " cents" ^0
"" ^0

# ---- what the per-row rounding verified ----

"the per-row rounding" ^0
"  rule : round half-up to the nearest cent" ^0
"  applied to : every row, identically" ^0
"  truncation : none" ^0
"  what the customer is billed per line : the rounded" ^0
"    figure, exactly" ^0
"  rows off by more than half a cent : 0" ^0
"  verdict : EVERY LINE CORRECT" ^0
"" ^0
"  billing each line at exactly its rounded figure is the" ^0
"  part almost nobody disputes, and it is why the lines are" ^0
"  not in question" ^0
"" ^0

# ---- what the sum of them is ----

"the total" ^0
"  how it was formed : the rounded lines, added" ^0
"  what rounding does under addition : it does not" ^0
"    distribute; the error of a sum is not the sum of" ^0
"    rounded parts" ^0
"  each row's leftover : at most half a cent, either way" ^0
"  across " + str(rows) + " rows : the leftovers do not cancel" ^0
"  the gap they leave : " + str(difference_cents) + " cents" ^0
"" ^0

# ---- what reconciliation sees ----

"the reconciliation against the source" ^0
"  reported total : " + str(reported_total_cents) + " cents" ^0
"  total from the unrounded amounts : " ^0
"    " + str(correct_total_cents) + " cents" ^0
"  which line is wrong : none" ^0
"  where the " + str(difference_cents) + " cents lives : between the lines," ^0
"    in the order of the two operations" ^0
"  dollars reported : " + str(reported_total_dollars) ^0
"" ^0

# ---- null control ----

# The same amounts, summed at full precision and rounded once at the end.
4500037 => nc_sum_of_rounded_cents
4500012 => nc_sum_then_rounded_cents
0 => nc_rows_that_changed

"null control - sum first, round once" ^0
"  sum of rounded rows : " + str(nc_sum_of_rounded_cents) + ", unchanged" ^0
"  sum then rounded : " + str(nc_sum_then_rounded_cents) + " cents" ^0
"  rows whose own figure changed : " + str(nc_rows_that_changed) ^0
"  no amount and no rounding rule changed; only the order" ^0
"  of summing and rounding did, and the total moved" ^0
"" ^0

# ---- the rule ----

"what correct-to-the-cent rows guarantee" ^0
"  each line is within half a cent of its true amount :" ^0
"    exactly, all " + str(rows) + " of them, one rule, no truncation" ^0
"  the total is correct to the cent : not addressed; each" ^0
"    row was rounded before the sum, and rounding does not" ^0
"    distribute over addition - summing first and rounding" ^0
"    once gives a total " + str(difference_cents) + " cents lower" ^0
"" ^0

"rounding and addition do not commute; a column of individually correct figures" ^0
"has a correct-looking total that is not the total of the figures, and the gap" ^0
"is the leftover cents that had nowhere to cancel" ^0
"" ^0

"Every line is rounded half-up and billed at exactly that figure - no line is" ^0
"wrong. The total is the sum of the rounded lines, and rounding does not" ^0
"distribute over a sum, so it reads " + str(reported_total_cents) + " cents against a correct " ^0
"" + str(correct_total_cents) + " - a " + str(difference_cents) + "-cent gap that lives between the rows, not in any of them." ^0
```

## Python (deterministic transpilation)

```python
rows = 90000
reported_total_cents = 4500037
correct_total_cents = 4500012
max_row_error_tenths_of_a_cent = 5
difference_cents = reported_total_cents - correct_total_cents
worst_case_drift_cents = int(rows * max_row_error_tenths_of_a_cent / 10)
difference_per_myriad_of_the_total = int(difference_cents * 10000 / correct_total_cents)
reported_total_dollars = int(reported_total_cents / 100)
print("rows                            : " + str(rows))
print("each row correct to             : the cent, half-up")
print("")
print("reported total (sum of rounded) : " + str(reported_total_cents) + " cents")
print("correct total (sum then round)  : " + str(correct_total_cents) + " cents")
print("  difference                    : " + str(difference_cents) + " cents")
print("  as a share of the total       : " + str(difference_per_myriad_of_the_total) + " per ten thousand")
print("worst case if errors aligned    : " + str(worst_case_drift_cents) + " cents")
print("")
print("the per-row rounding")
print("  rule : round half-up to the nearest cent")
print("  applied to : every row, identically")
print("  truncation : none")
print("  what the customer is billed per line : the rounded")
print("    figure, exactly")
print("  rows off by more than half a cent : 0")
print("  verdict : EVERY LINE CORRECT")
print("")
print("  billing each line at exactly its rounded figure is the")
print("  part almost nobody disputes, and it is why the lines are")
print("  not in question")
print("")
print("the total")
print("  how it was formed : the rounded lines, added")
print("  what rounding does under addition : it does not")
print("    distribute; the error of a sum is not the sum of")
print("    rounded parts")
print("  each row's leftover : at most half a cent, either way")
print("  across " + str(rows) + " rows : the leftovers do not cancel")
print("  the gap they leave : " + str(difference_cents) + " cents")
print("")
print("the reconciliation against the source")
print("  reported total : " + str(reported_total_cents) + " cents")
print("  total from the unrounded amounts : ")
print("    " + str(correct_total_cents) + " cents")
print("  which line is wrong : none")
print("  where the " + str(difference_cents) + " cents lives : between the lines,")
print("    in the order of the two operations")
print("  dollars reported : " + str(reported_total_dollars))
print("")
nc_sum_of_rounded_cents = 4500037
nc_sum_then_rounded_cents = 4500012
nc_rows_that_changed = 0
print("null control - sum first, round once")
print("  sum of rounded rows : " + str(nc_sum_of_rounded_cents) + ", unchanged")
print("  sum then rounded : " + str(nc_sum_then_rounded_cents) + " cents")
print("  rows whose own figure changed : " + str(nc_rows_that_changed))
print("  no amount and no rounding rule changed; only the order")
print("  of summing and rounding did, and the total moved")
print("")
print("what correct-to-the-cent rows guarantee")
print("  each line is within half a cent of its true amount :")
print("    exactly, all " + str(rows) + " of them, one rule, no truncation")
print("  the total is correct to the cent : not addressed; each")
print("    row was rounded before the sum, and rounding does not")
print("    distribute over addition - summing first and rounding")
print("    once gives a total " + str(difference_cents) + " cents lower")
print("")
print("rounding and addition do not commute; a column of individually correct figures")
print("has a correct-looking total that is not the total of the figures, and the gap")
print("is the leftover cents that had nowhere to cancel")
print("")
print("Every line is rounded half-up and billed at exactly that figure - no line is")
print("wrong. The total is the sum of the rounded lines, and rounding does not")
print("distribute over a sum, so it reads " + str(reported_total_cents) + " cents against a correct ")
print("" + str(correct_total_cents) + " - a " + str(difference_cents) + "-cent gap that lives between the rows, not in any of them.")
```

## stdout (executed)

```text
rows                            : 90000
each row correct to             : the cent, half-up

reported total (sum of rounded) : 4500037 cents
correct total (sum then round)  : 4500012 cents
  difference                    : 25 cents
  as a share of the total       : 0 per ten thousand
worst case if errors aligned    : 45000 cents

the per-row rounding
  rule : round half-up to the nearest cent
  applied to : every row, identically
  truncation : none
  what the customer is billed per line : the rounded
    figure, exactly
  rows off by more than half a cent : 0
  verdict : EVERY LINE CORRECT

  billing each line at exactly its rounded figure is the
  part almost nobody disputes, and it is why the lines are
  not in question

the total
  how it was formed : the rounded lines, added
  what rounding does under addition : it does not
    distribute; the error of a sum is not the sum of
    rounded parts
  each row's leftover : at most half a cent, either way
  across 90000 rows : the leftovers do not cancel
  the gap they leave : 25 cents

the reconciliation against the source
  reported total : 4500037 cents
  total from the unrounded amounts : 
    4500012 cents
  which line is wrong : none
  where the 25 cents lives : between the lines,
    in the order of the two operations
  dollars reported : 45000

null control - sum first, round once
  sum of rounded rows : 4500037, unchanged
  sum then rounded : 4500012 cents
  rows whose own figure changed : 0
  no amount and no rounding rule changed; only the order
  of summing and rounding did, and the total moved

what correct-to-the-cent rows guarantee
  each line is within half a cent of its true amount :
    exactly, all 90000 of them, one rule, no truncation
  the total is correct to the cent : not addressed; each
    row was rounded before the sum, and rounding does not
    distribute over addition - summing first and rounding
    once gives a total 25 cents lower

rounding and addition do not commute; a column of individually correct figures
has a correct-looking total that is not the total of the figures, and the gap
is the leftover cents that had nowhere to cancel

Every line is rounded half-up and billed at exactly that figure - no line is
wrong. The total is the sum of the rounded lines, and rounding does not
distribute over a sum, so it reads 4500037 cents against a correct 
4500012 - a 25-cent gap that lives between the rows, not in any of them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
