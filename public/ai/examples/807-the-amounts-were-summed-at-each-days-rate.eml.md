<!-- canonical: efficientnewlanguage.org/ai/examples/807-the-amounts-were-summed-at-each-days-rate | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 807 — The amounts were summed at each days rate

`the_amounts_were_summed_at_each_days_rate.eml` - The multi-currency balance is summed correctly to a single dollar figure, and each conversion is right. What rate each line was converted at is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The multi-currency
# balance is summed correctly to a single dollar figure, and each conversion is
# right. What rate each line was converted at is computed below.
#
# The conversion is done properly per line. Each amount is converted with the
# official rate for its own booking day; the rate source is the same for every
# currency; no line is dropped; and the arithmetic is exact to the cent.
#
# Each line keeps the rate of the day it was booked, and the sum mixes them.

12040000 => reported_total_usd_cents
11890000 => total_at_one_month_end_rate_usd_cents
3 => currencies
0 => lines_dropped

reported_total_usd_cents - total_at_one_month_end_rate_usd_cents => difference_from_mixing_rates_cents
int(difference_from_mixing_rates_cents * 10000 / total_at_one_month_end_rate_usd_cents) => difference_per_myriad
int(reported_total_usd_cents / 100) => reported_total_usd_dollars

"reported total (each day's rate): " + str(reported_total_usd_cents) + " cents" ^0
"total at one month-end rate     : " + str(total_at_one_month_end_rate_usd_cents) + " cents" ^0
"  difference from mixing rates  : " + str(difference_from_mixing_rates_cents) + " cents" ^0
"  as a share of the total       : " + str(difference_per_myriad) + " per ten thousand" ^0
"currencies                      : " + str(currencies) ^0
"lines dropped                   : " + str(lines_dropped) ^0
"reported total in dollars       : " + str(reported_total_usd_dollars) ^0
"" ^0

# ---- what the conversion verified ----

"the per-line conversion" ^0
"  rate used : the official rate for the line's booking" ^0
"    day" ^0
"  rate source : the same for every currency" ^0
"  lines dropped : " + str(lines_dropped) ^0
"  arithmetic : exact to the cent" ^0
"  lines converted correctly : all of them" ^0
"  verdict : EACH LINE CORRECT" ^0
"" ^0
"  one rate source across all currencies is the part done" ^0
"  right here, and it is why no line used a stray quote" ^0
"" ^0

# ---- what the sum mixes ----

"the total" ^0
"  how it was formed : the per-day conversions, added" ^0
"  what each conversion fixes : the value on its own day" ^0
"  what the market did across the month : moved" ^0
"  so the sum : mixes rates from different days into one" ^0
"    figure" ^0
"  what it is the value of : no single day's holdings" ^0
"" ^0

# ---- what a reader of the balance assumes ----

"the reader of the balance" ^0
"  what they take it to be : what the holdings are worth" ^0
"    now" ^0
"  what it is : a sum of what each line was worth on its" ^0
"    own day" ^0
"  the gap at one consistent rate : " ^0
"    " + str(difference_from_mixing_rates_cents) + " cents" ^0
"  is any line wrong : no; each is exact on its day" ^0
"  is the total a valuation : not at any one date" ^0
"" ^0

# ---- null control ----

# The same lines, all converted at a single month-end rate so the total is a
# valuation at one instant.
12040000 => nc_each_days_rate_cents
11890000 => nc_one_rate_cents
0 => nc_lines_changed

"null control - one rate for the whole balance" ^0
"  summed at each day's rate : " + str(nc_each_days_rate_cents) + ", unchanged" ^0
"  summed at one month-end rate : " + str(nc_one_rate_cents) + " cents" ^0
"  lines changed : " + str(nc_lines_changed) ^0
"  no amount and no booking date changed; the rates" ^0
"  stopped being mixed across a moving month" ^0
"" ^0

# ---- the rule ----

"what a correct multi-currency total guarantees" ^0
"  each line is converted at its own day's official rate :" ^0
"    exactly, one source, nothing dropped, to the cent" ^0
"  the total is what the holdings are worth now : not" ^0
"    addressed; each line was converted on its booking day," ^0
"    so the sum mixes rates across a moving month and is not" ^0
"    any single day's valuation - at one rate it is " ^0
"    " + str(total_at_one_month_end_rate_usd_cents) ^0
"" ^0

"a valuation is taken at an instant, and a sum of conversions taken at different" ^0
"instants belongs to no instant; each term is right on its day and the total is" ^0
"a date that never happened" ^0
"" ^0

"Each line uses its booking day's official rate, one source, exact to the cent -" ^0
"no line wrong. The sum mixes rates across a moving month, so it is not a" ^0
"valuation at any date: at one month-end rate it is " + str(total_at_one_month_end_rate_usd_cents) + " cents, " ^0
"" + str(difference_from_mixing_rates_cents) + " from the reported " + str(reported_total_usd_cents) + ", " + str(difference_per_myriad) + " per ten thousand." ^0
```

## Python (deterministic transpilation)

```python
reported_total_usd_cents = 12040000
total_at_one_month_end_rate_usd_cents = 11890000
currencies = 3
lines_dropped = 0
difference_from_mixing_rates_cents = reported_total_usd_cents - total_at_one_month_end_rate_usd_cents
difference_per_myriad = int(difference_from_mixing_rates_cents * 10000 / total_at_one_month_end_rate_usd_cents)
reported_total_usd_dollars = int(reported_total_usd_cents / 100)
print("reported total (each day's rate): " + str(reported_total_usd_cents) + " cents")
print("total at one month-end rate     : " + str(total_at_one_month_end_rate_usd_cents) + " cents")
print("  difference from mixing rates  : " + str(difference_from_mixing_rates_cents) + " cents")
print("  as a share of the total       : " + str(difference_per_myriad) + " per ten thousand")
print("currencies                      : " + str(currencies))
print("lines dropped                   : " + str(lines_dropped))
print("reported total in dollars       : " + str(reported_total_usd_dollars))
print("")
print("the per-line conversion")
print("  rate used : the official rate for the line's booking")
print("    day")
print("  rate source : the same for every currency")
print("  lines dropped : " + str(lines_dropped))
print("  arithmetic : exact to the cent")
print("  lines converted correctly : all of them")
print("  verdict : EACH LINE CORRECT")
print("")
print("  one rate source across all currencies is the part done")
print("  right here, and it is why no line used a stray quote")
print("")
print("the total")
print("  how it was formed : the per-day conversions, added")
print("  what each conversion fixes : the value on its own day")
print("  what the market did across the month : moved")
print("  so the sum : mixes rates from different days into one")
print("    figure")
print("  what it is the value of : no single day's holdings")
print("")
print("the reader of the balance")
print("  what they take it to be : what the holdings are worth")
print("    now")
print("  what it is : a sum of what each line was worth on its")
print("    own day")
print("  the gap at one consistent rate : ")
print("    " + str(difference_from_mixing_rates_cents) + " cents")
print("  is any line wrong : no; each is exact on its day")
print("  is the total a valuation : not at any one date")
print("")
nc_each_days_rate_cents = 12040000
nc_one_rate_cents = 11890000
nc_lines_changed = 0
print("null control - one rate for the whole balance")
print("  summed at each day's rate : " + str(nc_each_days_rate_cents) + ", unchanged")
print("  summed at one month-end rate : " + str(nc_one_rate_cents) + " cents")
print("  lines changed : " + str(nc_lines_changed))
print("  no amount and no booking date changed; the rates")
print("  stopped being mixed across a moving month")
print("")
print("what a correct multi-currency total guarantees")
print("  each line is converted at its own day's official rate :")
print("    exactly, one source, nothing dropped, to the cent")
print("  the total is what the holdings are worth now : not")
print("    addressed; each line was converted on its booking day,")
print("    so the sum mixes rates across a moving month and is not")
print("    any single day's valuation - at one rate it is ")
print("    " + str(total_at_one_month_end_rate_usd_cents))
print("")
print("a valuation is taken at an instant, and a sum of conversions taken at different")
print("instants belongs to no instant; each term is right on its day and the total is")
print("a date that never happened")
print("")
print("Each line uses its booking day's official rate, one source, exact to the cent -")
print("no line wrong. The sum mixes rates across a moving month, so it is not a")
print("valuation at any date: at one month-end rate it is " + str(total_at_one_month_end_rate_usd_cents) + " cents, ")
print("" + str(difference_from_mixing_rates_cents) + " from the reported " + str(reported_total_usd_cents) + ", " + str(difference_per_myriad) + " per ten thousand.")
```

## stdout (executed)

```text
reported total (each day's rate): 12040000 cents
total at one month-end rate     : 11890000 cents
  difference from mixing rates  : 150000 cents
  as a share of the total       : 126 per ten thousand
currencies                      : 3
lines dropped                   : 0
reported total in dollars       : 120400

the per-line conversion
  rate used : the official rate for the line's booking
    day
  rate source : the same for every currency
  lines dropped : 0
  arithmetic : exact to the cent
  lines converted correctly : all of them
  verdict : EACH LINE CORRECT

  one rate source across all currencies is the part done
  right here, and it is why no line used a stray quote

the total
  how it was formed : the per-day conversions, added
  what each conversion fixes : the value on its own day
  what the market did across the month : moved
  so the sum : mixes rates from different days into one
    figure
  what it is the value of : no single day's holdings

the reader of the balance
  what they take it to be : what the holdings are worth
    now
  what it is : a sum of what each line was worth on its
    own day
  the gap at one consistent rate : 
    150000 cents
  is any line wrong : no; each is exact on its day
  is the total a valuation : not at any one date

null control - one rate for the whole balance
  summed at each day's rate : 12040000, unchanged
  summed at one month-end rate : 11890000 cents
  lines changed : 0
  no amount and no booking date changed; the rates
  stopped being mixed across a moving month

what a correct multi-currency total guarantees
  each line is converted at its own day's official rate :
    exactly, one source, nothing dropped, to the cent
  the total is what the holdings are worth now : not
    addressed; each line was converted on its booking day,
    so the sum mixes rates across a moving month and is not
    any single day's valuation - at one rate it is 
    11890000

a valuation is taken at an instant, and a sum of conversions taken at different
instants belongs to no instant; each term is right on its day and the total is
a date that never happened

Each line uses its booking day's official rate, one source, exact to the cent -
no line wrong. The sum mixes rates across a moving month, so it is not a
valuation at any date: at one month-end rate it is 11890000 cents, 
150000 from the reported 12040000, 126 per ten thousand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
