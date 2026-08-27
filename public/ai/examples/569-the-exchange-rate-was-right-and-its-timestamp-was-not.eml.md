<!-- canonical: efficientnewlanguage.org/ai/examples/569-the-exchange-rate-was-right-and-its-timestamp-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 569 — The exchange rate was right and its timestamp was not

`the_exchange_rate_was_right_and_its_timestamp_was_not.eml` - A payment is quoted in the customer's currency at authorization and settled three days later at capture. Both conversions use the published rate. The difference is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A payment is
# quoted in the customer's currency at authorization and settled three days
# later at capture. Both conversions use the published rate. The difference is
# computed below.
#
# Converting at capture is the defensible choice and it was argued for by the
# finance team, correctly. Capture is when money actually moves, so the rate at
# capture is the rate the bank will use, and booking at any other rate leaves a
# reconciliation difference that somebody has to chase every month. It also
# means the ledger and the settlement file agree to the cent, which is a real
# operational property and not a nicety.
#
# The customer was shown a number at authorization. That number is the quote,
# it is what they agreed to, and it is what appears in the confirmation email.
#
# No wrong rate is used anywhere. Two correct rates are used, from two correct
# moments, and the contract names only one of them. The difference between the
# two moments is not an error in the rate; it is an error about which moment
# the promise was made in.

12000 => transactions_per_day
8500 => average_amount_hundredths
10850 => quote_rate_ten_thousandths
11045 => capture_rate_ten_thousandths
365 => days_per_year

capture_rate_ten_thousandths - quote_rate_ten_thousandths => rate_move

"transactions per day     : " + str(transactions_per_day) ^0
"average amount           : " + str(int(average_amount_hundredths / 100)) + " units" ^0
"rate at authorization    : " + str(quote_rate_ten_thousandths) + " ten-thousandths" ^0
"rate at capture, 3 days later : " + str(capture_rate_ten_thousandths) + " ten-thousandths" ^0
"move over the three days : " + str(rate_move) + " ten-thousandths, which is " + str(int(rate_move * 10000 / quote_rate_ten_thousandths)) + " per ten thousand" ^0
"" ^0

# ---- per transaction ----

int(average_amount_hundredths * quote_rate_ten_thousandths / 10000) => quoted_hundredths
int(average_amount_hundredths * capture_rate_ten_thousandths / 10000) => charged_hundredths
charged_hundredths - quoted_hundredths => difference_hundredths

"one transaction of " + str(int(average_amount_hundredths / 100)) + " units" ^0
"  quoted to the customer : " + str(quoted_hundredths) + " hundredths" ^0
"  charged at capture     : " + str(charged_hundredths) + " hundredths" ^0
"  difference             : " + str(difference_hundredths) + " hundredths" ^0
"" ^0

# ---- per day and per year ----

difference_hundredths * transactions_per_day => daily_hundredths
daily_hundredths * days_per_year => yearly_hundredths

"  per day  : " + str(int(daily_hundredths / 100)) + " units across " + str(transactions_per_day) + " transactions" ^0
"  per year : " + str(int(yearly_hundredths / 100)) + " units" ^0
"" ^0
"  every one of which is the difference between two correct numbers" ^0
"" ^0

# ---- the direction is not symmetric ----
#
# A rate that moves the other way produces a charge BELOW the quote, and that
# one nobody reports, because a customer who is charged less does not write in.
# So the complaints are a one-sided sample of a two-sided error.

quote_rate_ten_thousandths - rate_move => favourable_rate
int(average_amount_hundredths * favourable_rate / 10000) => favourable_hundredths

"the same mechanism when the rate moves the other way" ^0
"  rate at capture        : " + str(favourable_rate) + " ten-thousandths" ^0
"  charged                : " + str(favourable_hundredths) + " hundredths" ^0
"  difference             : " + str(favourable_hundredths - quoted_hundredths) + " hundredths, in the customer's favour" ^0
"  complaints generated   : 0" ^0
"" ^0
"  the error is symmetric and the reporting is not" ^0
"  so the ticket volume measures the rate's direction, not the defect's size" ^0
"" ^0

# ---- how long the window is ----
#
# The gap is the authorization-to-capture delay, and it is a business choice:
# capture happens when the goods ship. The longer the fulfilment, the larger
# the exposure, and nobody set the fulfilment time with this in mind.

"exposure by fulfilment time, at " + str(int(rate_move / 3)) + " ten-thousandths of drift per day" ^0
[1, 3, 7, 14, 30] => delay_days
for d in delay_days:
    int(rate_move * d / 3) => drift
    int(average_amount_hundredths * drift / 10000) => per_tx
    "  " + str(d) + " days : rate moves " + str(drift) + ", per transaction " + str(per_tx) + " hundredths, per day " + str(int(per_tx * transactions_per_day / 100)) + " units" ^0
"" ^0
"  a warehouse decision moves a currency exposure, and neither team knows it" ^0
"" ^0

# ---- the control ----
#
# Is the rate wrong. It is not, at either moment: both are the published rate
# at the timestamp they carry, and an auditor checking either one against the
# published series finds an exact match.

"control - is either rate incorrect for its own timestamp" ^0
"  rate used at authorization vs published rate that day : exact match" ^0
"  rate used at capture vs published rate that day       : exact match" ^0
"  incorrect rates found : 0 of 2" ^0
"  the reconciliation the finance team wanted also holds exactly" ^0
"" ^0
"  every check that reads a rate and a timestamp together passes" ^0
"  the defect needs two records compared, and they live in two systems" ^0
"" ^0

# ---- the null control ----
#
# The same design when authorization and capture happen in the same instant -
# a card payment taken at the till. One rate, one moment, no difference. The
# design is not wrong; it is wrong exactly as far as the two moments are apart.

0 => instant_delay
int(rate_move * instant_delay / 3) => instant_drift

"null control - the same rule when capture is immediate" ^0
"  delay between quote and capture : " + str(instant_delay) + " days" ^0
"  rate movement in that window    : " + str(instant_drift) + " ten-thousandths" ^0
"  difference per transaction      : " + str(int(average_amount_hundredths * instant_drift / 10000)) + " hundredths" ^0
"  same code, same rate source, same rounding" ^0
"  the whole error is the width of the window" ^0
"" ^0

# ---- the rule ----

"a value with a timestamp, used across two moments" ^0
"  is the value correct         yes, at its own timestamp" ^0
"  is the timestamp correct     yes, it is the moment it was taken" ^0
"  is it the RIGHT moment       this is the question, and it is not about the rate" ^0
"  the promise was made at one moment and settled at another" ^0
"  whichever is chosen, the other one is the one the customer read" ^0
"" ^0

"Booking at capture makes the ledger and the settlement file agree to the cent," ^0
"which is why finance asked for it, and both rates match the published series" ^0
"exactly. Over the three days between the promise and the settlement the rate" ^0
"moved " + str(rate_move) + " ten-thousandths, which is " + str(difference_hundredths) + " hundredths on an average transaction," ^0
str(int(daily_hundredths / 100)) + " units a day, and " + str(int(yearly_hundredths / 100)) + " units a year of difference between two numbers" ^0
"that are both right." ^0
```

## Python (deterministic transpilation)

```python
transactions_per_day = 12000
average_amount_hundredths = 8500
quote_rate_ten_thousandths = 10850
capture_rate_ten_thousandths = 11045
days_per_year = 365
rate_move = capture_rate_ten_thousandths - quote_rate_ten_thousandths
print("transactions per day     : " + str(transactions_per_day))
print("average amount           : " + str(int(average_amount_hundredths / 100)) + " units")
print("rate at authorization    : " + str(quote_rate_ten_thousandths) + " ten-thousandths")
print("rate at capture, 3 days later : " + str(capture_rate_ten_thousandths) + " ten-thousandths")
print("move over the three days : " + str(rate_move) + " ten-thousandths, which is " + str(int(rate_move * 10000 / quote_rate_ten_thousandths)) + " per ten thousand")
print("")
quoted_hundredths = int(average_amount_hundredths * quote_rate_ten_thousandths / 10000)
charged_hundredths = int(average_amount_hundredths * capture_rate_ten_thousandths / 10000)
difference_hundredths = charged_hundredths - quoted_hundredths
print("one transaction of " + str(int(average_amount_hundredths / 100)) + " units")
print("  quoted to the customer : " + str(quoted_hundredths) + " hundredths")
print("  charged at capture     : " + str(charged_hundredths) + " hundredths")
print("  difference             : " + str(difference_hundredths) + " hundredths")
print("")
daily_hundredths = difference_hundredths * transactions_per_day
yearly_hundredths = daily_hundredths * days_per_year
print("  per day  : " + str(int(daily_hundredths / 100)) + " units across " + str(transactions_per_day) + " transactions")
print("  per year : " + str(int(yearly_hundredths / 100)) + " units")
print("")
print("  every one of which is the difference between two correct numbers")
print("")
favourable_rate = quote_rate_ten_thousandths - rate_move
favourable_hundredths = int(average_amount_hundredths * favourable_rate / 10000)
print("the same mechanism when the rate moves the other way")
print("  rate at capture        : " + str(favourable_rate) + " ten-thousandths")
print("  charged                : " + str(favourable_hundredths) + " hundredths")
print("  difference             : " + str(favourable_hundredths - quoted_hundredths) + " hundredths, in the customer's favour")
print("  complaints generated   : 0")
print("")
print("  the error is symmetric and the reporting is not")
print("  so the ticket volume measures the rate's direction, not the defect's size")
print("")
print("exposure by fulfilment time, at " + str(int(rate_move / 3)) + " ten-thousandths of drift per day")
delay_days = [1, 3, 7, 14, 30]
for d in delay_days:
    drift = int(rate_move * d / 3)
    per_tx = int(average_amount_hundredths * drift / 10000)
    print("  " + str(d) + " days : rate moves " + str(drift) + ", per transaction " + str(per_tx) + " hundredths, per day " + str(int(per_tx * transactions_per_day / 100)) + " units")
print("")
print("  a warehouse decision moves a currency exposure, and neither team knows it")
print("")
print("control - is either rate incorrect for its own timestamp")
print("  rate used at authorization vs published rate that day : exact match")
print("  rate used at capture vs published rate that day       : exact match")
print("  incorrect rates found : 0 of 2")
print("  the reconciliation the finance team wanted also holds exactly")
print("")
print("  every check that reads a rate and a timestamp together passes")
print("  the defect needs two records compared, and they live in two systems")
print("")
instant_delay = 0
instant_drift = int(rate_move * instant_delay / 3)
print("null control - the same rule when capture is immediate")
print("  delay between quote and capture : " + str(instant_delay) + " days")
print("  rate movement in that window    : " + str(instant_drift) + " ten-thousandths")
print("  difference per transaction      : " + str(int(average_amount_hundredths * instant_drift / 10000)) + " hundredths")
print("  same code, same rate source, same rounding")
print("  the whole error is the width of the window")
print("")
print("a value with a timestamp, used across two moments")
print("  is the value correct         yes, at its own timestamp")
print("  is the timestamp correct     yes, it is the moment it was taken")
print("  is it the RIGHT moment       this is the question, and it is not about the rate")
print("  the promise was made at one moment and settled at another")
print("  whichever is chosen, the other one is the one the customer read")
print("")
print("Booking at capture makes the ledger and the settlement file agree to the cent,")
print("which is why finance asked for it, and both rates match the published series")
print("exactly. Over the three days between the promise and the settlement the rate")
print("moved " + str(rate_move) + " ten-thousandths, which is " + str(difference_hundredths) + " hundredths on an average transaction,")
print(str(int(daily_hundredths / 100)) + " units a day, and " + str(int(yearly_hundredths / 100)) + " units a year of difference between two numbers")
print("that are both right.")
```

## stdout (executed)

```text
transactions per day     : 12000
average amount           : 85 units
rate at authorization    : 10850 ten-thousandths
rate at capture, 3 days later : 11045 ten-thousandths
move over the three days : 195 ten-thousandths, which is 179 per ten thousand

one transaction of 85 units
  quoted to the customer : 9222 hundredths
  charged at capture     : 9388 hundredths
  difference             : 166 hundredths

  per day  : 19920 units across 12000 transactions
  per year : 7270800 units

  every one of which is the difference between two correct numbers

the same mechanism when the rate moves the other way
  rate at capture        : 10655 ten-thousandths
  charged                : 9056 hundredths
  difference             : -166 hundredths, in the customer's favour
  complaints generated   : 0

  the error is symmetric and the reporting is not
  so the ticket volume measures the rate's direction, not the defect's size

exposure by fulfilment time, at 65 ten-thousandths of drift per day
  1 days : rate moves 65, per transaction 55 hundredths, per day 6600 units
  3 days : rate moves 195, per transaction 165 hundredths, per day 19800 units
  7 days : rate moves 455, per transaction 386 hundredths, per day 46320 units
  14 days : rate moves 910, per transaction 773 hundredths, per day 92760 units
  30 days : rate moves 1950, per transaction 1657 hundredths, per day 198840 units

  a warehouse decision moves a currency exposure, and neither team knows it

control - is either rate incorrect for its own timestamp
  rate used at authorization vs published rate that day : exact match
  rate used at capture vs published rate that day       : exact match
  incorrect rates found : 0 of 2
  the reconciliation the finance team wanted also holds exactly

  every check that reads a rate and a timestamp together passes
  the defect needs two records compared, and they live in two systems

null control - the same rule when capture is immediate
  delay between quote and capture : 0 days
  rate movement in that window    : 0 ten-thousandths
  difference per transaction      : 0 hundredths
  same code, same rate source, same rounding
  the whole error is the width of the window

a value with a timestamp, used across two moments
  is the value correct         yes, at its own timestamp
  is the timestamp correct     yes, it is the moment it was taken
  is it the RIGHT moment       this is the question, and it is not about the rate
  the promise was made at one moment and settled at another
  whichever is chosen, the other one is the one the customer read

Booking at capture makes the ledger and the settlement file agree to the cent,
which is why finance asked for it, and both rates match the published series
exactly. Over the three days between the promise and the settlement the rate
moved 195 ten-thousandths, which is 166 hundredths on an average transaction,
19920 units a day, and 7270800 units a year of difference between two numbers
that are both right.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
