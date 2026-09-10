<!-- canonical: efficientnewlanguage.org/ai/examples/779-the-audit-sampled-by-row-and-the-money-was-in-a-few | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 779 — The audit sampled by row and the money was in a few

`the_audit_sampled_by_row_and_the_money_was_in_a_few.eml` - The expense audit draws a genuine random sample every quarter, and the sampling is the part it gets right. What the sample is a sample of is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The expense audit
# draws a genuine random sample every quarter, and the sampling is the part it
# gets right. What the sample is a sample of is computed below.
#
# The sampling is honest. The draw is from a seeded generator whose seed is
# published afterwards, so nobody can choose the rows; it is a simple random
# sample rather than whoever the auditor happens to know; the sample size was
# derived from a stated confidence rather than picked round; and every drawn row
# is examined, with no substitutions when one is inconvenient.
#
# It samples rows. The money is not distributed the way the rows are.

184000 => expense_rows_a_quarter
1200 => rows_drawn
94 => rows_with_a_finding
14 => quarters_the_method_has_run
0 => rows_substituted_for_being_inconvenient
41000000 => total_value_a_quarter
34200000 => value_in_the_largest_two_hundred_rows
760000 => value_covered_by_the_sample
200 => the_largest_rows
3 => of_those_largest_rows_that_the_sample_happened_to_draw

expense_rows_a_quarter - rows_drawn => rows_not_drawn
total_value_a_quarter - value_in_the_largest_two_hundred_rows => value_in_everything_else
the_largest_rows - of_those_largest_rows_that_the_sample_happened_to_draw => largest_rows_the_sample_missed
int(rows_drawn * 10000 / expense_rows_a_quarter) => rows_sampled_per_myriad
int(value_covered_by_the_sample * 10000 / total_value_a_quarter) => value_sampled_per_myriad
int(value_in_the_largest_two_hundred_rows * 10000 / total_value_a_quarter) => value_in_the_largest_rows_per_myriad
int(rows_with_a_finding * 10000 / rows_drawn) => finding_rate_per_myriad

"expense rows a quarter          : " + str(expense_rows_a_quarter) ^0
"  drawn                         : " + str(rows_drawn) ^0
"  not drawn                     : " + str(rows_not_drawn) ^0
"  rows sampled                  : " + str(rows_sampled_per_myriad) + " per ten thousand" ^0
"  rows substituted              : " + str(rows_substituted_for_being_inconvenient) ^0
"rows with a finding             : " + str(rows_with_a_finding) ^0
"  finding rate                  : " + str(finding_rate_per_myriad) + " per ten thousand" ^0
"quarters the method has run     : " + str(quarters_the_method_has_run) ^0
"" ^0
"total value a quarter           : " + str(total_value_a_quarter) ^0
"  in the largest " + str(the_largest_rows) + " rows          : " + str(value_in_the_largest_two_hundred_rows) ^0
"  in everything else            : " + str(value_in_everything_else) ^0
"  concentrated in the largest   : " + str(value_in_the_largest_rows_per_myriad) + " per ten thousand" ^0
"" ^0
"value covered by the sample     : " + str(value_covered_by_the_sample) ^0
"  value sampled                 : " + str(value_sampled_per_myriad) + " per ten thousand" ^0
"largest rows the sample drew    : " + str(of_those_largest_rows_that_the_sample_happened_to_draw) ^0
"  that it missed                : " + str(largest_rows_the_sample_missed) ^0
"" ^0

# ---- what the sampling verified ----

"the expense audit's sample" ^0
"  the draw : a seeded generator whose seed is published" ^0
"    afterwards, so nobody chooses the rows" ^0
"  the method : simple random, not whoever the auditor" ^0
"    knows" ^0
"  the size : derived from a stated confidence, not" ^0
"    picked round" ^0
"  substitutions when a row is inconvenient : " ^0
"    " + str(rows_substituted_for_being_inconvenient) ^0
"  quarters run this way : " + str(quarters_the_method_has_run) ^0
"  verdict : SAMPLED" ^0
"" ^0
"  publishing the seed afterwards is the part almost" ^0
"  nobody does, and it is why the " + str(rows_drawn) + " are not a" ^0
"  selection" ^0
"" ^0

# ---- the two populations ----

"rows and money are not the same population" ^0
"  rows sampled : " + str(rows_sampled_per_myriad) + " per ten thousand" ^0
"  value sampled : " + str(value_sampled_per_myriad) + " per ten thousand" ^0
"  value sitting in " + str(the_largest_rows) + " rows : " ^0
"    " + str(value_in_the_largest_rows_per_myriad) + " per ten thousand of the quarter" ^0
"  chance a uniform draw of " + str(rows_drawn) + " catches a given" ^0
"    one of them : the same as for any other row" ^0
"  of those " + str(the_largest_rows) + ", drawn : " + str(of_those_largest_rows_that_the_sample_happened_to_draw) ^0
"  missed : " + str(largest_rows_the_sample_missed) ^0
"" ^0
"  a sample that is uniform over rows is by construction" ^0
"  not uniform over value, and the value is what the audit" ^0
"  is for" ^0
"" ^0

# ---- what the finding rate is a rate of ----

"the number the report leads with" ^0
"  rows with a finding : " + str(rows_with_a_finding) + " of " + str(rows_drawn) ^0
"  so the finding rate : " + str(finding_rate_per_myriad) + " per ten thousand" ^0
"  what it estimates : the share of ROWS with a problem" ^0
"  what the reader takes it for : the share of MONEY at" ^0
"    risk" ^0
"  what would estimate that : a draw weighted by value," ^0
"    which is not this one" ^0
"" ^0

# ---- null control ----

# The same audit, with the sample drawn with probability proportional to value
# and the largest rows examined outright.
1200 => nc_rows_drawn
200 => nc_largest_rows_examined_outright
9100 => nc_value_sampled_per_myriad

"null control - draw proportional to value, take the top outright" ^0
"  rows drawn : " + str(nc_rows_drawn) + ", unchanged" ^0
"  largest rows examined outright : " ^0
"    " + str(nc_largest_rows_examined_outright) ^0
"  value sampled : " + str(nc_value_sampled_per_myriad) + " per ten thousand" ^0
"  the draw did not become less random; it stopped being" ^0
"  uniform over the wrong thing" ^0
"" ^0

# ---- the rule ----

"what a clean random sample guarantees" ^0
"  an unbiased estimate of the share of rows with a" ^0
"    problem : exactly, seeded, published, " ^0
"    " + str(rows_substituted_for_being_inconvenient) + " substitutions, " + str(quarters_the_method_has_run) + " quarters" ^0
"  an estimate of the money at risk : not addressed; the" ^0
"    draw is uniform over rows and " ^0
"    " + str(value_in_the_largest_rows_per_myriad) + " per ten thousand of the value is in " ^0
"    " + str(the_largest_rows) + " of them" ^0
"" ^0
"a sample is unbiased with respect to the thing it was" ^0
"drawn over; a quantity distributed differently from that" ^0
"thing is estimated by the sample only by coincidence" ^0
"" ^0

"The seed is published afterwards, the draw is simple random, the size comes" ^0
"from a stated confidence and " + str(rows_substituted_for_being_inconvenient) + " rows were substituted in " + str(quarters_the_method_has_run) + " quarters. It" ^0
"is uniform over rows - " + str(rows_sampled_per_myriad) + " per ten thousand of them - which is " + str(value_sampled_per_myriad) + " per ten" ^0
"thousand of the value, because " + str(value_in_the_largest_rows_per_myriad) + " per ten thousand of it sits in " + str(the_largest_rows) ^0
"rows of which the sample drew " + str(of_those_largest_rows_that_the_sample_happened_to_draw) + "." ^0
```

## Python (deterministic transpilation)

```python
expense_rows_a_quarter = 184000
rows_drawn = 1200
rows_with_a_finding = 94
quarters_the_method_has_run = 14
rows_substituted_for_being_inconvenient = 0
total_value_a_quarter = 41000000
value_in_the_largest_two_hundred_rows = 34200000
value_covered_by_the_sample = 760000
the_largest_rows = 200
of_those_largest_rows_that_the_sample_happened_to_draw = 3
rows_not_drawn = expense_rows_a_quarter - rows_drawn
value_in_everything_else = total_value_a_quarter - value_in_the_largest_two_hundred_rows
largest_rows_the_sample_missed = the_largest_rows - of_those_largest_rows_that_the_sample_happened_to_draw
rows_sampled_per_myriad = int(rows_drawn * 10000 / expense_rows_a_quarter)
value_sampled_per_myriad = int(value_covered_by_the_sample * 10000 / total_value_a_quarter)
value_in_the_largest_rows_per_myriad = int(value_in_the_largest_two_hundred_rows * 10000 / total_value_a_quarter)
finding_rate_per_myriad = int(rows_with_a_finding * 10000 / rows_drawn)
print("expense rows a quarter          : " + str(expense_rows_a_quarter))
print("  drawn                         : " + str(rows_drawn))
print("  not drawn                     : " + str(rows_not_drawn))
print("  rows sampled                  : " + str(rows_sampled_per_myriad) + " per ten thousand")
print("  rows substituted              : " + str(rows_substituted_for_being_inconvenient))
print("rows with a finding             : " + str(rows_with_a_finding))
print("  finding rate                  : " + str(finding_rate_per_myriad) + " per ten thousand")
print("quarters the method has run     : " + str(quarters_the_method_has_run))
print("")
print("total value a quarter           : " + str(total_value_a_quarter))
print("  in the largest " + str(the_largest_rows) + " rows          : " + str(value_in_the_largest_two_hundred_rows))
print("  in everything else            : " + str(value_in_everything_else))
print("  concentrated in the largest   : " + str(value_in_the_largest_rows_per_myriad) + " per ten thousand")
print("")
print("value covered by the sample     : " + str(value_covered_by_the_sample))
print("  value sampled                 : " + str(value_sampled_per_myriad) + " per ten thousand")
print("largest rows the sample drew    : " + str(of_those_largest_rows_that_the_sample_happened_to_draw))
print("  that it missed                : " + str(largest_rows_the_sample_missed))
print("")
print("the expense audit's sample")
print("  the draw : a seeded generator whose seed is published")
print("    afterwards, so nobody chooses the rows")
print("  the method : simple random, not whoever the auditor")
print("    knows")
print("  the size : derived from a stated confidence, not")
print("    picked round")
print("  substitutions when a row is inconvenient : ")
print("    " + str(rows_substituted_for_being_inconvenient))
print("  quarters run this way : " + str(quarters_the_method_has_run))
print("  verdict : SAMPLED")
print("")
print("  publishing the seed afterwards is the part almost")
print("  nobody does, and it is why the " + str(rows_drawn) + " are not a")
print("  selection")
print("")
print("rows and money are not the same population")
print("  rows sampled : " + str(rows_sampled_per_myriad) + " per ten thousand")
print("  value sampled : " + str(value_sampled_per_myriad) + " per ten thousand")
print("  value sitting in " + str(the_largest_rows) + " rows : ")
print("    " + str(value_in_the_largest_rows_per_myriad) + " per ten thousand of the quarter")
print("  chance a uniform draw of " + str(rows_drawn) + " catches a given")
print("    one of them : the same as for any other row")
print("  of those " + str(the_largest_rows) + ", drawn : " + str(of_those_largest_rows_that_the_sample_happened_to_draw))
print("  missed : " + str(largest_rows_the_sample_missed))
print("")
print("  a sample that is uniform over rows is by construction")
print("  not uniform over value, and the value is what the audit")
print("  is for")
print("")
print("the number the report leads with")
print("  rows with a finding : " + str(rows_with_a_finding) + " of " + str(rows_drawn))
print("  so the finding rate : " + str(finding_rate_per_myriad) + " per ten thousand")
print("  what it estimates : the share of ROWS with a problem")
print("  what the reader takes it for : the share of MONEY at")
print("    risk")
print("  what would estimate that : a draw weighted by value,")
print("    which is not this one")
print("")
nc_rows_drawn = 1200
nc_largest_rows_examined_outright = 200
nc_value_sampled_per_myriad = 9100
print("null control - draw proportional to value, take the top outright")
print("  rows drawn : " + str(nc_rows_drawn) + ", unchanged")
print("  largest rows examined outright : ")
print("    " + str(nc_largest_rows_examined_outright))
print("  value sampled : " + str(nc_value_sampled_per_myriad) + " per ten thousand")
print("  the draw did not become less random; it stopped being")
print("  uniform over the wrong thing")
print("")
print("what a clean random sample guarantees")
print("  an unbiased estimate of the share of rows with a")
print("    problem : exactly, seeded, published, ")
print("    " + str(rows_substituted_for_being_inconvenient) + " substitutions, " + str(quarters_the_method_has_run) + " quarters")
print("  an estimate of the money at risk : not addressed; the")
print("    draw is uniform over rows and ")
print("    " + str(value_in_the_largest_rows_per_myriad) + " per ten thousand of the value is in ")
print("    " + str(the_largest_rows) + " of them")
print("")
print("a sample is unbiased with respect to the thing it was")
print("drawn over; a quantity distributed differently from that")
print("thing is estimated by the sample only by coincidence")
print("")
print("The seed is published afterwards, the draw is simple random, the size comes")
print("from a stated confidence and " + str(rows_substituted_for_being_inconvenient) + " rows were substituted in " + str(quarters_the_method_has_run) + " quarters. It")
print("is uniform over rows - " + str(rows_sampled_per_myriad) + " per ten thousand of them - which is " + str(value_sampled_per_myriad) + " per ten")
print("thousand of the value, because " + str(value_in_the_largest_rows_per_myriad) + " per ten thousand of it sits in " + str(the_largest_rows))
print("rows of which the sample drew " + str(of_those_largest_rows_that_the_sample_happened_to_draw) + ".")
```

## stdout (executed)

```text
expense rows a quarter          : 184000
  drawn                         : 1200
  not drawn                     : 182800
  rows sampled                  : 65 per ten thousand
  rows substituted              : 0
rows with a finding             : 94
  finding rate                  : 783 per ten thousand
quarters the method has run     : 14

total value a quarter           : 41000000
  in the largest 200 rows          : 34200000
  in everything else            : 6800000
  concentrated in the largest   : 8341 per ten thousand

value covered by the sample     : 760000
  value sampled                 : 185 per ten thousand
largest rows the sample drew    : 3
  that it missed                : 197

the expense audit's sample
  the draw : a seeded generator whose seed is published
    afterwards, so nobody chooses the rows
  the method : simple random, not whoever the auditor
    knows
  the size : derived from a stated confidence, not
    picked round
  substitutions when a row is inconvenient : 
    0
  quarters run this way : 14
  verdict : SAMPLED

  publishing the seed afterwards is the part almost
  nobody does, and it is why the 1200 are not a
  selection

rows and money are not the same population
  rows sampled : 65 per ten thousand
  value sampled : 185 per ten thousand
  value sitting in 200 rows : 
    8341 per ten thousand of the quarter
  chance a uniform draw of 1200 catches a given
    one of them : the same as for any other row
  of those 200, drawn : 3
  missed : 197

  a sample that is uniform over rows is by construction
  not uniform over value, and the value is what the audit
  is for

the number the report leads with
  rows with a finding : 94 of 1200
  so the finding rate : 783 per ten thousand
  what it estimates : the share of ROWS with a problem
  what the reader takes it for : the share of MONEY at
    risk
  what would estimate that : a draw weighted by value,
    which is not this one

null control - draw proportional to value, take the top outright
  rows drawn : 1200, unchanged
  largest rows examined outright : 
    200
  value sampled : 9100 per ten thousand
  the draw did not become less random; it stopped being
  uniform over the wrong thing

what a clean random sample guarantees
  an unbiased estimate of the share of rows with a
    problem : exactly, seeded, published, 
    0 substitutions, 14 quarters
  an estimate of the money at risk : not addressed; the
    draw is uniform over rows and 
    8341 per ten thousand of the value is in 
    200 of them

a sample is unbiased with respect to the thing it was
drawn over; a quantity distributed differently from that
thing is estimated by the sample only by coincidence

The seed is published afterwards, the draw is simple random, the size comes
from a stated confidence and 0 rows were substituted in 14 quarters. It
is uniform over rows - 65 per ten thousand of them - which is 185 per ten
thousand of the value, because 8341 per ten thousand of it sits in 200
rows of which the sample drew 3.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
