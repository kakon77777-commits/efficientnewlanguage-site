<!-- canonical: efficientnewlanguage.org/ai/examples/609-the-two-teams-fixed-it-and-the-fixes-cancelled-out | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 609 — The two teams fixed it and the fixes cancelled out

`the_two_teams_fixed_it_and_the_fixes_cancelled_out.eml` - An invoice total was off by the tax amount. Two teams found it and each shipped a correct fix. What the invoice does now is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An invoice total
# was off by the tax amount. Two teams found it and each shipped a correct fix.
# What the invoice does now is computed below.
#
# Both fixes are right and both were done properly. The billing team found that
# the line-item subtotal was being sent without tax and added the tax before
# sending, which is correct: the field is documented as tax-inclusive. The
# ledger team found that the field it received was documented as tax-inclusive
# but arrived without tax, and added the tax on receipt, which is also correct
# against the same document. Each team wrote a test that pins its own fix, and
# both tests pass.
#
# A correction is relative to a state. Two corrections applied to one value are
# only both right if each was written against the state the other leaves.
#
# Neither team was wrong about the defect. They were each right about a system
# that no longer existed by the time both changes had shipped.

10000 => subtotal_cents
875 => tax_rate_per_myriad

int(subtotal_cents * tax_rate_per_myriad / 10000) => tax_cents
subtotal_cents + tax_cents => correct_total

"subtotal      : " + str(subtotal_cents) + " cents" ^0
"tax rate      : " + str(tax_rate_per_myriad) + " per ten thousand" ^0
"tax           : " + str(tax_cents) + " cents" ^0
"correct total : " + str(correct_total) + " cents" ^0
"" ^0

# ---- the three states ----

subtotal_cents => original_sent
correct_total => after_billing_fix
after_billing_fix + tax_cents => after_both_fixes

"state                        value sent   value recorded" ^0
"  before either fix            " + str(original_sent) + "        " + str(original_sent) ^0
"  after the billing fix        " + str(after_billing_fix) + "        " + str(after_billing_fix) ^0
"  after the ledger fix too     " + str(after_billing_fix) + "        " + str(after_both_fixes) ^0
"" ^0
after_both_fixes - correct_total => overcharge_cents
"  correct value : " + str(correct_total) ^0
"  recorded now  : " + str(after_both_fixes) ^0
"  error         : " + str(overcharge_cents) + " cents over, which is exactly the tax" ^0
"" ^0

# ---- the size of the error, before and after ----

correct_total - original_sent => error_before
after_both_fixes - correct_total => error_after

"  error before any fix : " + str(error_before) + " cents, under" ^0
"  error after both     : " + str(error_after) + " cents, over" ^0
"  magnitude            : identical" ^0
"  sign                 : reversed" ^0
"" ^0
"  the same number of complaints, from the other direction," ^0
"  and now the ones complaining have been overcharged" ^0
"" ^0

# ---- what each team's test asserts ----

"the billing team's test" ^0
"  given a subtotal of " + str(subtotal_cents) + ", the message carries " + str(after_billing_fix) ^0
"  status : passes, and it is the right assertion" ^0
"" ^0
"the ledger team's test" ^0
"  given a message carrying " + str(subtotal_cents) + ", the ledger records " + str(correct_total) ^0
"  status : passes, and it is the right assertion" ^0
"" ^0
"  the two tests share no fixture" ^0
"  the second one's input is a value the first one no longer produces" ^0
"" ^0

# ---- the fixture that would have caught it ----

"an end-to-end fixture" ^0
"  input     : a subtotal of " + str(subtotal_cents) ^0
"  expected  : a ledger entry of " + str(correct_total) ^0
"  actual    : " + str(after_both_fixes) ^0
"  would fail : yes" ^0
"  exists    : no, the boundary is where the two teams meet" ^0
"" ^0

# ---- the invoices ----

24000 => invoices_per_day
9 => days_both_fixes_live

invoices_per_day * days_both_fixes_live => invoices_affected
invoices_affected * overcharge_cents => total_overcharged_cents

"invoices per day          : " + str(invoices_per_day) ^0
"days with both fixes live : " + str(days_both_fixes_live) ^0
"invoices affected         : " + str(invoices_affected) ^0
"overcharged, in cents     : " + str(total_overcharged_cents) ^0
"" ^0

"day   invoices   cents over that day   cumulative" ^0
0 => running
for d in [1:4]:
    running + (invoices_per_day * overcharge_cents) => running
    "  " + str(d) + "     " + str(invoices_per_day) + "      " + str(invoices_per_day * overcharge_cents) + "               " + str(running) ^0
"" ^0

# ---- what the monitoring saw ----

"the discrepancy alert on total mismatch" ^0
"  before either fix : firing, " + str(error_before) + " cents per invoice" ^0
"  after one fix     : silent" ^0
"  after both fixes  : firing, " + str(error_after) + " cents per invoice" ^0
"" ^0
"  the alert went quiet and then came back with the same" ^0
"  magnitude, and the second firing was read as a regression" ^0
"  of a fix that had shipped, rather than a second one" ^0
"" ^0

# ---- the control ----
#
# Each fix, against the defect it was written for. Applied on its own to the
# system as its author found it, each one produces the correct total.

"control - is either fix wrong" ^0
"  billing fix alone : " + str(after_billing_fix) + ", correct" ^0
"  ledger fix alone  : " + str(correct_total) + ", correct" ^0
"  tests passing     : both" ^0
"  reviews           : both approved, correctly" ^0
"  defects in either change : 0" ^0
"" ^0
"  reverting either one restores the correct total," ^0
"  which is why each team's first instinct is to defend theirs" ^0
"" ^0

# ---- the null control ----
#
# The same two teams finding the same defect and shipping the same two changes,
# where the field is documented as tax-exclusive. Now only one of the two is a
# fix, review catches the other, and one change ships.

"null control - the same two teams with an unambiguous contract" ^0
"  fixes proposed  : 2" ^0
"  fixes that match the contract : 1" ^0
"  fixes shipped   : 1" ^0
"  final total     : " + str(correct_total) ^0
"  same defect, same teams, same speed" ^0
"  what changed is that the document had one reading" ^0
"" ^0

# ---- the rule ----

"what a correct fix is correct relative to" ^0
"  the behaviour its author observed : yes, and that was measured" ^0
"  the behaviour after another change : not addressed" ^0
"  and a fix carries no record of the state it assumed" ^0
"" ^0
"two teams looking at one boundary from opposite sides will" ^0
"describe the same defect in opposite words, and the test that" ^0
"separates them is the one whose input and output are on" ^0
"different sides of the boundary" ^0
"" ^0

"Both fixes are correct against the document and against the system each team" ^0
"observed: applied alone they produce " + str(after_billing_fix) + " and " + str(correct_total) + " cents, both right, with 0" ^0
"defects in either change and both tests passing. Applied together they produce" ^0
str(after_both_fixes) + " against a correct total of " + str(correct_total) + " - " + str(overcharge_cents) + " cents over, the same" ^0
"magnitude as the original error with the sign reversed - across " + str(invoices_affected) + " invoices" ^0
"in " + str(days_both_fixes_live) + " days, and the alert that fired again was read as a regression." ^0
```

## Python (deterministic transpilation)

```python
subtotal_cents = 10000
tax_rate_per_myriad = 875
tax_cents = int(subtotal_cents * tax_rate_per_myriad / 10000)
correct_total = subtotal_cents + tax_cents
print("subtotal      : " + str(subtotal_cents) + " cents")
print("tax rate      : " + str(tax_rate_per_myriad) + " per ten thousand")
print("tax           : " + str(tax_cents) + " cents")
print("correct total : " + str(correct_total) + " cents")
print("")
original_sent = subtotal_cents
after_billing_fix = correct_total
after_both_fixes = after_billing_fix + tax_cents
print("state                        value sent   value recorded")
print("  before either fix            " + str(original_sent) + "        " + str(original_sent))
print("  after the billing fix        " + str(after_billing_fix) + "        " + str(after_billing_fix))
print("  after the ledger fix too     " + str(after_billing_fix) + "        " + str(after_both_fixes))
print("")
overcharge_cents = after_both_fixes - correct_total
print("  correct value : " + str(correct_total))
print("  recorded now  : " + str(after_both_fixes))
print("  error         : " + str(overcharge_cents) + " cents over, which is exactly the tax")
print("")
error_before = correct_total - original_sent
error_after = after_both_fixes - correct_total
print("  error before any fix : " + str(error_before) + " cents, under")
print("  error after both     : " + str(error_after) + " cents, over")
print("  magnitude            : identical")
print("  sign                 : reversed")
print("")
print("  the same number of complaints, from the other direction,")
print("  and now the ones complaining have been overcharged")
print("")
print("the billing team's test")
print("  given a subtotal of " + str(subtotal_cents) + ", the message carries " + str(after_billing_fix))
print("  status : passes, and it is the right assertion")
print("")
print("the ledger team's test")
print("  given a message carrying " + str(subtotal_cents) + ", the ledger records " + str(correct_total))
print("  status : passes, and it is the right assertion")
print("")
print("  the two tests share no fixture")
print("  the second one's input is a value the first one no longer produces")
print("")
print("an end-to-end fixture")
print("  input     : a subtotal of " + str(subtotal_cents))
print("  expected  : a ledger entry of " + str(correct_total))
print("  actual    : " + str(after_both_fixes))
print("  would fail : yes")
print("  exists    : no, the boundary is where the two teams meet")
print("")
invoices_per_day = 24000
days_both_fixes_live = 9
invoices_affected = invoices_per_day * days_both_fixes_live
total_overcharged_cents = invoices_affected * overcharge_cents
print("invoices per day          : " + str(invoices_per_day))
print("days with both fixes live : " + str(days_both_fixes_live))
print("invoices affected         : " + str(invoices_affected))
print("overcharged, in cents     : " + str(total_overcharged_cents))
print("")
print("day   invoices   cents over that day   cumulative")
running = 0
for d in range(1, 5):
    running = running + invoices_per_day * overcharge_cents
    print("  " + str(d) + "     " + str(invoices_per_day) + "      " + str(invoices_per_day * overcharge_cents) + "               " + str(running))
print("")
print("the discrepancy alert on total mismatch")
print("  before either fix : firing, " + str(error_before) + " cents per invoice")
print("  after one fix     : silent")
print("  after both fixes  : firing, " + str(error_after) + " cents per invoice")
print("")
print("  the alert went quiet and then came back with the same")
print("  magnitude, and the second firing was read as a regression")
print("  of a fix that had shipped, rather than a second one")
print("")
print("control - is either fix wrong")
print("  billing fix alone : " + str(after_billing_fix) + ", correct")
print("  ledger fix alone  : " + str(correct_total) + ", correct")
print("  tests passing     : both")
print("  reviews           : both approved, correctly")
print("  defects in either change : 0")
print("")
print("  reverting either one restores the correct total,")
print("  which is why each team's first instinct is to defend theirs")
print("")
print("null control - the same two teams with an unambiguous contract")
print("  fixes proposed  : 2")
print("  fixes that match the contract : 1")
print("  fixes shipped   : 1")
print("  final total     : " + str(correct_total))
print("  same defect, same teams, same speed")
print("  what changed is that the document had one reading")
print("")
print("what a correct fix is correct relative to")
print("  the behaviour its author observed : yes, and that was measured")
print("  the behaviour after another change : not addressed")
print("  and a fix carries no record of the state it assumed")
print("")
print("two teams looking at one boundary from opposite sides will")
print("describe the same defect in opposite words, and the test that")
print("separates them is the one whose input and output are on")
print("different sides of the boundary")
print("")
print("Both fixes are correct against the document and against the system each team")
print("observed: applied alone they produce " + str(after_billing_fix) + " and " + str(correct_total) + " cents, both right, with 0")
print("defects in either change and both tests passing. Applied together they produce")
print(str(after_both_fixes) + " against a correct total of " + str(correct_total) + " - " + str(overcharge_cents) + " cents over, the same")
print("magnitude as the original error with the sign reversed - across " + str(invoices_affected) + " invoices")
print("in " + str(days_both_fixes_live) + " days, and the alert that fired again was read as a regression.")
```

## stdout (executed)

```text
subtotal      : 10000 cents
tax rate      : 875 per ten thousand
tax           : 875 cents
correct total : 10875 cents

state                        value sent   value recorded
  before either fix            10000        10000
  after the billing fix        10875        10875
  after the ledger fix too     10875        11750

  correct value : 10875
  recorded now  : 11750
  error         : 875 cents over, which is exactly the tax

  error before any fix : 875 cents, under
  error after both     : 875 cents, over
  magnitude            : identical
  sign                 : reversed

  the same number of complaints, from the other direction,
  and now the ones complaining have been overcharged

the billing team's test
  given a subtotal of 10000, the message carries 10875
  status : passes, and it is the right assertion

the ledger team's test
  given a message carrying 10000, the ledger records 10875
  status : passes, and it is the right assertion

  the two tests share no fixture
  the second one's input is a value the first one no longer produces

an end-to-end fixture
  input     : a subtotal of 10000
  expected  : a ledger entry of 10875
  actual    : 11750
  would fail : yes
  exists    : no, the boundary is where the two teams meet

invoices per day          : 24000
days with both fixes live : 9
invoices affected         : 216000
overcharged, in cents     : 189000000

day   invoices   cents over that day   cumulative
  1     24000      21000000               21000000
  2     24000      21000000               42000000
  3     24000      21000000               63000000
  4     24000      21000000               84000000

the discrepancy alert on total mismatch
  before either fix : firing, 875 cents per invoice
  after one fix     : silent
  after both fixes  : firing, 875 cents per invoice

  the alert went quiet and then came back with the same
  magnitude, and the second firing was read as a regression
  of a fix that had shipped, rather than a second one

control - is either fix wrong
  billing fix alone : 10875, correct
  ledger fix alone  : 10875, correct
  tests passing     : both
  reviews           : both approved, correctly
  defects in either change : 0

  reverting either one restores the correct total,
  which is why each team's first instinct is to defend theirs

null control - the same two teams with an unambiguous contract
  fixes proposed  : 2
  fixes that match the contract : 1
  fixes shipped   : 1
  final total     : 10875
  same defect, same teams, same speed
  what changed is that the document had one reading

what a correct fix is correct relative to
  the behaviour its author observed : yes, and that was measured
  the behaviour after another change : not addressed
  and a fix carries no record of the state it assumed

two teams looking at one boundary from opposite sides will
describe the same defect in opposite words, and the test that
separates them is the one whose input and output are on
different sides of the boundary

Both fixes are correct against the document and against the system each team
observed: applied alone they produce 10875 and 10875 cents, both right, with 0
defects in either change and both tests passing. Applied together they produce
11750 against a correct total of 10875 - 875 cents over, the same
magnitude as the original error with the sign reversed - across 216000 invoices
in 9 days, and the alert that fired again was read as a regression.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
