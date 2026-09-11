<!-- canonical: efficientnewlanguage.org/ai/examples/805-the-two-discounts-were-added | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 805 — The two discounts were added

`the_two_discounts_were_added.eml` - The promotion is "20% off, then 30% off", and each discount is applied correctly. What the two together come to is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The promotion is
# "20% off, then 30% off", and each discount is applied correctly. What the two
# together come to is computed below.
#
# Each discount is honest on its own. The 20% is 20% of the list price; the 30%
# is 30% of what it is applied to; both are applied, neither is skipped; and the
# register logs each step. The advertised headline adds them: 50% off.
#
# Discounts compose by multiplication, not by addition.

10000 => list_price_cents
2000 => first_discount_per_myriad
3000 => second_discount_per_myriad

first_discount_per_myriad + second_discount_per_myriad => advertised_discount_per_myriad
int(list_price_cents * (10000 - advertised_discount_per_myriad) / 10000) => promised_price_cents
int(list_price_cents * (10000 - first_discount_per_myriad) / 10000) => price_after_first_cents
int(price_after_first_cents * (10000 - second_discount_per_myriad) / 10000) => price_after_second_cents
int((list_price_cents - price_after_second_cents) * 10000 / list_price_cents) => true_discount_per_myriad
price_after_second_cents - promised_price_cents => overcharge_against_the_headline_cents

"list price                      : " + str(list_price_cents) + " cents" ^0
"first discount                  : " + str(first_discount_per_myriad) + " per ten thousand" ^0
"second discount                 : " + str(second_discount_per_myriad) + " per ten thousand" ^0
"advertised (added)              : " + str(advertised_discount_per_myriad) + " per ten thousand" ^0
"" ^0
"promised price (added)          : " + str(promised_price_cents) + " cents" ^0
"price after the first           : " + str(price_after_first_cents) + " cents" ^0
"price after the second          : " + str(price_after_second_cents) + " cents" ^0
"true discount                   : " + str(true_discount_per_myriad) + " per ten thousand" ^0
"overcharge against the headline : " + str(overcharge_against_the_headline_cents) + " cents" ^0
"" ^0

# ---- what each discount verified ----

"the two discounts, applied" ^0
"  the first : 20 percent of the list price" ^0
"  the second : 30 percent of what it is applied to" ^0
"  either one skipped : no" ^0
"  each step : logged by the register" ^0
"  discounts correctly applied : both" ^0
"  verdict : BOTH HONORED" ^0
"" ^0
"  applying the second to the already-reduced price is the" ^0
"  part done correctly here, and it is why neither discount" ^0
"  is in dispute" ^0
"" ^0

# ---- what the headline added ----

"the headline, 50 percent off" ^0
"  how it was formed : the two rates, added" ^0
"  what adding rates assumes : a common base for both" ^0
"  the second discount's actual base : the reduced price," ^0
"    not the list" ^0
"  so 20 then 30 : is " + str(true_discount_per_myriad) + " per ten thousand, not 5000" ^0
"  the gap : the 30 percent is taken on " + str(price_after_first_cents) + "," ^0
"    not on " + str(list_price_cents) ^0
"" ^0

# ---- what the customer pays ----

"the customer at the register" ^0
"  what the headline promised : " + str(promised_price_cents) + " cents" ^0
"  what the register charges : " + str(price_after_second_cents) + " cents" ^0
"  the difference : " + str(overcharge_against_the_headline_cents) + " cents" ^0
"  is either discount wrong : no; each is exact on its" ^0
"    own base" ^0
"  the true saving : " + str(true_discount_per_myriad) + " per ten thousand off" ^0
"" ^0

# ---- null control ----

# The same two discounts, expressed as the single multiplicative discount they
# compose to.
5000 => nc_added_headline_per_myriad
4400 => nc_composed_discount_per_myriad
0 => nc_prices_that_changed

"null control - compose the discounts, do not add them" ^0
"  added headline : " + str(nc_added_headline_per_myriad) + ", unchanged" ^0
"  composed discount : " + str(nc_composed_discount_per_myriad) + " per ten thousand" ^0
"  prices that changed : " + str(nc_prices_that_changed) ^0
"  no discount and no base changed; only the way the two" ^0
"  were combined into one headline did" ^0
"" ^0

# ---- the rule ----

"what two honored discounts guarantee" ^0
"  each was applied to its stated base : exactly, 20 on" ^0
"    the list and 30 on the reduced price, both logged" ^0
"  the customer got 50 percent off : not addressed;" ^0
"    discounts compose by multiplication not addition, so" ^0
"    20 then 30 is " + str(true_discount_per_myriad) + " per ten thousand off - the headline" ^0
"    promised " + str(promised_price_cents) + " and the register charged " + str(price_after_second_cents) ^0
"" ^0

"a percentage is taken of a base, and two percentages with different bases do" ^0
"not add; stacking them multiplies the remainders, so the second cut is smaller" ^0
"in dollars than its rate suggests" ^0
"" ^0

"Each discount is exact on its own base and both are applied - nothing is" ^0
"skipped. The headline adds them to 50 percent, but they compose to " ^0
"" + str(true_discount_per_myriad) + " per ten thousand: the register charges " + str(price_after_second_cents) + " cents where the" ^0
"headline promised " + str(promised_price_cents) + ", a gap of " + str(overcharge_against_the_headline_cents) + " cents." ^0
```

## Python (deterministic transpilation)

```python
list_price_cents = 10000
first_discount_per_myriad = 2000
second_discount_per_myriad = 3000
advertised_discount_per_myriad = first_discount_per_myriad + second_discount_per_myriad
promised_price_cents = int(list_price_cents * (10000 - advertised_discount_per_myriad) / 10000)
price_after_first_cents = int(list_price_cents * (10000 - first_discount_per_myriad) / 10000)
price_after_second_cents = int(price_after_first_cents * (10000 - second_discount_per_myriad) / 10000)
true_discount_per_myriad = int((list_price_cents - price_after_second_cents) * 10000 / list_price_cents)
overcharge_against_the_headline_cents = price_after_second_cents - promised_price_cents
print("list price                      : " + str(list_price_cents) + " cents")
print("first discount                  : " + str(first_discount_per_myriad) + " per ten thousand")
print("second discount                 : " + str(second_discount_per_myriad) + " per ten thousand")
print("advertised (added)              : " + str(advertised_discount_per_myriad) + " per ten thousand")
print("")
print("promised price (added)          : " + str(promised_price_cents) + " cents")
print("price after the first           : " + str(price_after_first_cents) + " cents")
print("price after the second          : " + str(price_after_second_cents) + " cents")
print("true discount                   : " + str(true_discount_per_myriad) + " per ten thousand")
print("overcharge against the headline : " + str(overcharge_against_the_headline_cents) + " cents")
print("")
print("the two discounts, applied")
print("  the first : 20 percent of the list price")
print("  the second : 30 percent of what it is applied to")
print("  either one skipped : no")
print("  each step : logged by the register")
print("  discounts correctly applied : both")
print("  verdict : BOTH HONORED")
print("")
print("  applying the second to the already-reduced price is the")
print("  part done correctly here, and it is why neither discount")
print("  is in dispute")
print("")
print("the headline, 50 percent off")
print("  how it was formed : the two rates, added")
print("  what adding rates assumes : a common base for both")
print("  the second discount's actual base : the reduced price,")
print("    not the list")
print("  so 20 then 30 : is " + str(true_discount_per_myriad) + " per ten thousand, not 5000")
print("  the gap : the 30 percent is taken on " + str(price_after_first_cents) + ",")
print("    not on " + str(list_price_cents))
print("")
print("the customer at the register")
print("  what the headline promised : " + str(promised_price_cents) + " cents")
print("  what the register charges : " + str(price_after_second_cents) + " cents")
print("  the difference : " + str(overcharge_against_the_headline_cents) + " cents")
print("  is either discount wrong : no; each is exact on its")
print("    own base")
print("  the true saving : " + str(true_discount_per_myriad) + " per ten thousand off")
print("")
nc_added_headline_per_myriad = 5000
nc_composed_discount_per_myriad = 4400
nc_prices_that_changed = 0
print("null control - compose the discounts, do not add them")
print("  added headline : " + str(nc_added_headline_per_myriad) + ", unchanged")
print("  composed discount : " + str(nc_composed_discount_per_myriad) + " per ten thousand")
print("  prices that changed : " + str(nc_prices_that_changed))
print("  no discount and no base changed; only the way the two")
print("  were combined into one headline did")
print("")
print("what two honored discounts guarantee")
print("  each was applied to its stated base : exactly, 20 on")
print("    the list and 30 on the reduced price, both logged")
print("  the customer got 50 percent off : not addressed;")
print("    discounts compose by multiplication not addition, so")
print("    20 then 30 is " + str(true_discount_per_myriad) + " per ten thousand off - the headline")
print("    promised " + str(promised_price_cents) + " and the register charged " + str(price_after_second_cents))
print("")
print("a percentage is taken of a base, and two percentages with different bases do")
print("not add; stacking them multiplies the remainders, so the second cut is smaller")
print("in dollars than its rate suggests")
print("")
print("Each discount is exact on its own base and both are applied - nothing is")
print("skipped. The headline adds them to 50 percent, but they compose to ")
print("" + str(true_discount_per_myriad) + " per ten thousand: the register charges " + str(price_after_second_cents) + " cents where the")
print("headline promised " + str(promised_price_cents) + ", a gap of " + str(overcharge_against_the_headline_cents) + " cents.")
```

## stdout (executed)

```text
list price                      : 10000 cents
first discount                  : 2000 per ten thousand
second discount                 : 3000 per ten thousand
advertised (added)              : 5000 per ten thousand

promised price (added)          : 5000 cents
price after the first           : 8000 cents
price after the second          : 5600 cents
true discount                   : 4400 per ten thousand
overcharge against the headline : 600 cents

the two discounts, applied
  the first : 20 percent of the list price
  the second : 30 percent of what it is applied to
  either one skipped : no
  each step : logged by the register
  discounts correctly applied : both
  verdict : BOTH HONORED

  applying the second to the already-reduced price is the
  part done correctly here, and it is why neither discount
  is in dispute

the headline, 50 percent off
  how it was formed : the two rates, added
  what adding rates assumes : a common base for both
  the second discount's actual base : the reduced price,
    not the list
  so 20 then 30 : is 4400 per ten thousand, not 5000
  the gap : the 30 percent is taken on 8000,
    not on 10000

the customer at the register
  what the headline promised : 5000 cents
  what the register charges : 5600 cents
  the difference : 600 cents
  is either discount wrong : no; each is exact on its
    own base
  the true saving : 4400 per ten thousand off

null control - compose the discounts, do not add them
  added headline : 5000, unchanged
  composed discount : 4400 per ten thousand
  prices that changed : 0
  no discount and no base changed; only the way the two
  were combined into one headline did

what two honored discounts guarantee
  each was applied to its stated base : exactly, 20 on
    the list and 30 on the reduced price, both logged
  the customer got 50 percent off : not addressed;
    discounts compose by multiplication not addition, so
    20 then 30 is 4400 per ten thousand off - the headline
    promised 5000 and the register charged 5600

a percentage is taken of a base, and two percentages with different bases do
not add; stacking them multiplies the remainders, so the second cut is smaller
in dollars than its rate suggests

Each discount is exact on its own base and both are applied - nothing is
skipped. The headline adds them to 50 percent, but they compose to 
4400 per ten thousand: the register charges 5600 cents where the
headline promised 5000, a gap of 600 cents.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
