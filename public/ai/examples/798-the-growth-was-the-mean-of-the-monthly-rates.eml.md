<!-- canonical: efficientnewlanguage.org/ai/examples/798-the-growth-was-the-mean-of-the-monthly-rates | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 798 — The growth was the mean of the monthly rates

`the_growth_was_the_mean_of_the_monthly_rates.eml` - The average monthly growth rate is reported correctly, and each monthly figure is a true rate. What the annual number is a combination of is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The average monthly
# growth rate is reported correctly, and each monthly figure is a true rate. What
# the annual number is a combination of is computed below.
#
# The monthly rates are computed properly. Each month's growth is the close over
# the prior close minus one; the same denominator convention is used every month;
# no month is dropped; and the reporting is audited against the ledger.
#
# The annual figure is the mean of the monthly rates, times twelve.

12 => months
1000000 => value_start
1180000 => value_end
200 => reported_mean_monthly_per_myriad

reported_mean_monthly_per_myriad * months => annualized_naive_per_myriad
int((value_end - value_start) * 10000 / value_start) => true_twelve_month_return_per_myriad
annualized_naive_per_myriad - true_twelve_month_return_per_myriad => overstatement_per_myriad

# A two-month illustration of why: a 50% fall then a 50% rise.
5000 => a_down_month_per_myriad
5000 => an_up_month_per_myriad
int(10000 * (10000 - a_down_month_per_myriad) / 10000) => value_after_the_fall_per_myriad
int(value_after_the_fall_per_myriad * (10000 + an_up_month_per_myriad) / 10000) => value_after_the_rise_per_myriad
value_after_the_rise_per_myriad - 10000 => compounded_net_of_the_two_per_myriad

"months                          : " + str(months) ^0
"value start                     : " + str(value_start) ^0
"value end                       : " + str(value_end) ^0
"" ^0
"reported mean monthly growth    : " + str(reported_mean_monthly_per_myriad) + " per ten thousand" ^0
"annualized by times twelve      : " + str(annualized_naive_per_myriad) + " per ten thousand" ^0
"true twelve-month return        : " + str(true_twelve_month_return_per_myriad) + " per ten thousand" ^0
"  overstatement                 : " + str(overstatement_per_myriad) + " per ten thousand" ^0
"" ^0
"a 50 percent fall then rise" ^0
"  mean of the two months        : 0 per ten thousand" ^0
"  compounded net                : " + str(compounded_net_of_the_two_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the monthly figures verified ----

"the monthly growth rates" ^0
"  each month : close over prior close, minus one" ^0
"  denominator convention : the same every month" ^0
"  months dropped : none" ^0
"  audited against : the ledger" ^0
"  months with a correct rate : all " + str(months) ^0
"  verdict : EACH MONTH CORRECT" ^0
"" ^0
"  keeping one denominator convention across the year is" ^0
"  the part almost nobody holds to, and it is why the" ^0
"  monthly figures are comparable" ^0
"" ^0

# ---- how the year was combined ----

"the mean of the rates, times twelve" ^0
"  what it assumes : that growth adds" ^0
"  what growth does : compounds; each month multiplies" ^0
"    the last, it does not add to it" ^0
"  a down month and an up month of equal size : average" ^0
"    to zero and compound to a loss" ^0
"  that loss here : " + str(compounded_net_of_the_two_per_myriad) + " per ten thousand" ^0
"  so the mean times twelve : overstates by " ^0
"    " + str(overstatement_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the ledger shows ----

"the ledger, start to end" ^0
"  value at the start : " + str(value_start) ^0
"  value at the end : " + str(value_end) ^0
"  the only return that happened : " ^0
"    " + str(true_twelve_month_return_per_myriad) + " per ten thousand" ^0
"  the reported annual figure : " ^0
"    " + str(annualized_naive_per_myriad) + " per ten thousand" ^0
"  is any monthly rate wrong : no; the combining is" ^0
"" ^0

# ---- null control ----

# The same monthly rates, compounded into a twelve-month figure instead of
# averaged and scaled.
2400 => nc_mean_times_twelve_per_myriad
1800 => nc_compounded_return_per_myriad
0 => nc_monthly_rates_changed

"null control - compound the rates, do not average them" ^0
"  mean times twelve : " + str(nc_mean_times_twelve_per_myriad) + ", unchanged" ^0
"  compounded return : " + str(nc_compounded_return_per_myriad) + " per ten thousand" ^0
"  monthly rates changed : " + str(nc_monthly_rates_changed) ^0
"  no month's figure moved; the combining stopped adding" ^0
"  the rates and started multiplying them" ^0
"" ^0

# ---- the rule ----

"what a reported average monthly growth guarantees" ^0
"  each month grew by its stated rate : exactly, one" ^0
"    convention, no month dropped, audited" ^0
"  the year grew by twelve times the average : not" ^0
"    addressed; growth compounds, and the arithmetic mean of" ^0
"    the monthly rates times twelve is not the twelve-month" ^0
"    return - the value went " + str(value_start) + " to " + str(value_end) + ", which is" ^0
"    " + str(true_twelve_month_return_per_myriad) + " per ten thousand, not " + str(annualized_naive_per_myriad) ^0
"" ^0

"a rate is a ratio between two levels, and ratios chain by multiplication; the" ^0
"mean of a set of them scaled by their count is an answer to a question about" ^0
"sums, which growth is not" ^0
"" ^0

"Each monthly rate is correct, one convention, none dropped, audited. The year" ^0
"is the mean times twelve, and growth compounds - so the ledger's own " ^0
"" + str(value_start) + " to " + str(value_end) + " is " + str(true_twelve_month_return_per_myriad) + " per ten thousand, while the report says " ^0
"" + str(annualized_naive_per_myriad) + ", an overstatement of " + str(overstatement_per_myriad) + " per ten thousand." ^0
```

## Python (deterministic transpilation)

```python
months = 12
value_start = 1000000
value_end = 1180000
reported_mean_monthly_per_myriad = 200
annualized_naive_per_myriad = reported_mean_monthly_per_myriad * months
true_twelve_month_return_per_myriad = int((value_end - value_start) * 10000 / value_start)
overstatement_per_myriad = annualized_naive_per_myriad - true_twelve_month_return_per_myriad
a_down_month_per_myriad = 5000
an_up_month_per_myriad = 5000
value_after_the_fall_per_myriad = int(10000 * (10000 - a_down_month_per_myriad) / 10000)
value_after_the_rise_per_myriad = int(value_after_the_fall_per_myriad * (10000 + an_up_month_per_myriad) / 10000)
compounded_net_of_the_two_per_myriad = value_after_the_rise_per_myriad - 10000
print("months                          : " + str(months))
print("value start                     : " + str(value_start))
print("value end                       : " + str(value_end))
print("")
print("reported mean monthly growth    : " + str(reported_mean_monthly_per_myriad) + " per ten thousand")
print("annualized by times twelve      : " + str(annualized_naive_per_myriad) + " per ten thousand")
print("true twelve-month return        : " + str(true_twelve_month_return_per_myriad) + " per ten thousand")
print("  overstatement                 : " + str(overstatement_per_myriad) + " per ten thousand")
print("")
print("a 50 percent fall then rise")
print("  mean of the two months        : 0 per ten thousand")
print("  compounded net                : " + str(compounded_net_of_the_two_per_myriad) + " per ten thousand")
print("")
print("the monthly growth rates")
print("  each month : close over prior close, minus one")
print("  denominator convention : the same every month")
print("  months dropped : none")
print("  audited against : the ledger")
print("  months with a correct rate : all " + str(months))
print("  verdict : EACH MONTH CORRECT")
print("")
print("  keeping one denominator convention across the year is")
print("  the part almost nobody holds to, and it is why the")
print("  monthly figures are comparable")
print("")
print("the mean of the rates, times twelve")
print("  what it assumes : that growth adds")
print("  what growth does : compounds; each month multiplies")
print("    the last, it does not add to it")
print("  a down month and an up month of equal size : average")
print("    to zero and compound to a loss")
print("  that loss here : " + str(compounded_net_of_the_two_per_myriad) + " per ten thousand")
print("  so the mean times twelve : overstates by ")
print("    " + str(overstatement_per_myriad) + " per ten thousand")
print("")
print("the ledger, start to end")
print("  value at the start : " + str(value_start))
print("  value at the end : " + str(value_end))
print("  the only return that happened : ")
print("    " + str(true_twelve_month_return_per_myriad) + " per ten thousand")
print("  the reported annual figure : ")
print("    " + str(annualized_naive_per_myriad) + " per ten thousand")
print("  is any monthly rate wrong : no; the combining is")
print("")
nc_mean_times_twelve_per_myriad = 2400
nc_compounded_return_per_myriad = 1800
nc_monthly_rates_changed = 0
print("null control - compound the rates, do not average them")
print("  mean times twelve : " + str(nc_mean_times_twelve_per_myriad) + ", unchanged")
print("  compounded return : " + str(nc_compounded_return_per_myriad) + " per ten thousand")
print("  monthly rates changed : " + str(nc_monthly_rates_changed))
print("  no month's figure moved; the combining stopped adding")
print("  the rates and started multiplying them")
print("")
print("what a reported average monthly growth guarantees")
print("  each month grew by its stated rate : exactly, one")
print("    convention, no month dropped, audited")
print("  the year grew by twelve times the average : not")
print("    addressed; growth compounds, and the arithmetic mean of")
print("    the monthly rates times twelve is not the twelve-month")
print("    return - the value went " + str(value_start) + " to " + str(value_end) + ", which is")
print("    " + str(true_twelve_month_return_per_myriad) + " per ten thousand, not " + str(annualized_naive_per_myriad))
print("")
print("a rate is a ratio between two levels, and ratios chain by multiplication; the")
print("mean of a set of them scaled by their count is an answer to a question about")
print("sums, which growth is not")
print("")
print("Each monthly rate is correct, one convention, none dropped, audited. The year")
print("is the mean times twelve, and growth compounds - so the ledger's own ")
print("" + str(value_start) + " to " + str(value_end) + " is " + str(true_twelve_month_return_per_myriad) + " per ten thousand, while the report says ")
print("" + str(annualized_naive_per_myriad) + ", an overstatement of " + str(overstatement_per_myriad) + " per ten thousand.")
```

## stdout (executed)

```text
months                          : 12
value start                     : 1000000
value end                       : 1180000

reported mean monthly growth    : 200 per ten thousand
annualized by times twelve      : 2400 per ten thousand
true twelve-month return        : 1800 per ten thousand
  overstatement                 : 600 per ten thousand

a 50 percent fall then rise
  mean of the two months        : 0 per ten thousand
  compounded net                : -2500 per ten thousand

the monthly growth rates
  each month : close over prior close, minus one
  denominator convention : the same every month
  months dropped : none
  audited against : the ledger
  months with a correct rate : all 12
  verdict : EACH MONTH CORRECT

  keeping one denominator convention across the year is
  the part almost nobody holds to, and it is why the
  monthly figures are comparable

the mean of the rates, times twelve
  what it assumes : that growth adds
  what growth does : compounds; each month multiplies
    the last, it does not add to it
  a down month and an up month of equal size : average
    to zero and compound to a loss
  that loss here : -2500 per ten thousand
  so the mean times twelve : overstates by 
    600 per ten thousand

the ledger, start to end
  value at the start : 1000000
  value at the end : 1180000
  the only return that happened : 
    1800 per ten thousand
  the reported annual figure : 
    2400 per ten thousand
  is any monthly rate wrong : no; the combining is

null control - compound the rates, do not average them
  mean times twelve : 2400, unchanged
  compounded return : 1800 per ten thousand
  monthly rates changed : 0
  no month's figure moved; the combining stopped adding
  the rates and started multiplying them

what a reported average monthly growth guarantees
  each month grew by its stated rate : exactly, one
    convention, no month dropped, audited
  the year grew by twelve times the average : not
    addressed; growth compounds, and the arithmetic mean of
    the monthly rates times twelve is not the twelve-month
    return - the value went 1000000 to 1180000, which is
    1800 per ten thousand, not 2400

a rate is a ratio between two levels, and ratios chain by multiplication; the
mean of a set of them scaled by their count is an answer to a question about
sums, which growth is not

Each monthly rate is correct, one convention, none dropped, audited. The year
is the mean times twelve, and growth compounds - so the ledger's own 
1000000 to 1180000 is 1800 per ten thousand, while the report says 
2400, an overstatement of 600 per ten thousand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
