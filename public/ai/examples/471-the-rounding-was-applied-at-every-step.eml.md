<!-- canonical: efficientnewlanguage.org/ai/examples/471-the-rounding-was-applied-at-every-step | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 471 — The rounding was applied at every step

`the_rounding_was_applied_at_every_step.eml` - Each line is rounded to the cent as it is computed, because a cent is what money is. What that costs over a run is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each line is
# rounded to the cent as it is computed, because a cent is what money is. What
# that costs over a run is computed below.
#
# Rounding each line is right and is usually required. A line item that prints
# has to be a real amount, an invoice with three decimal places is not an
# invoice, and downstream systems reject fractional cents. The rule is not an
# approximation anybody chose casually.
#
# Rounding is applied per line and the total is a sum of the results, so the
# per-line errors are added along with the amounts. The same figures rounded
# once at the end carry one rounding rather than N.
#
# Everything is in tenths of a cent, as integers, so no float is involved.

# amounts in tenths of a cent
[1234, 5677, 892, 3345, 7778, 456, 2223, 9995, 1116, 6664, 3338, 887] => amounts
len(amounts) => n

def round_to_cent(tenths):
    tenths + 5 => shifted
    int(shifted / 10) * 10 => r
    return r

0 => rounded_each
for a in amounts:
    rounded_each + round_to_cent(a) => rounded_each

0 => exact_total
for a in amounts:
    exact_total + a => exact_total
round_to_cent(exact_total) => rounded_once

"lines : " + str(n) ^0
"exact total, in tenths of a cent : " + str(exact_total) ^0
"" ^0
"  rounding each line, then adding : " + str(rounded_each) ^0
"  adding, then rounding once      : " + str(rounded_once) ^0
if not (rounded_each == rounded_once):
    "  they differ by " + str(rounded_each - rounded_once) + " tenths of a cent" ^0
else:
    "  they agree on this input" ^0
"" ^0

"line   amount   rounded   error introduced" ^0
0 => worst
for i in [0:n - 1]:
    amounts[i] => a
    round_to_cent(a) - a => err
    err => mag
    if mag < 0:
        0 - err => mag
    if mag > worst:
        mag => worst
    "  " + str(i + 1) + "      " + str(a) + "     " + str(round_to_cent(a)) + "      " + str(err) ^0
"" ^0
"largest single-line error, either direction : " + str(worst) + " tenths" ^0
"sum of the per-line errors: " + str(rounded_each - exact_total) + " tenths" ^0
if worst < 10:
    "  every line is correct to the cent and the total is not" ^0
"" ^0

# ---- how the gap grows ----
#
# The per-line errors do not cancel unless the amounts happen to be symmetric
# about the rounding boundary. Over more lines the walk continues.

"the same rule over prefixes of the list" ^0
0 => acc_each
0 => acc_exact
for i in [0:n - 1]:
    acc_each + round_to_cent(amounts[i]) => acc_each
    acc_exact + amounts[i] => acc_exact
    if i == 2:
        "  after 3 lines  : per-line " + str(acc_each) + ", once " + str(round_to_cent(acc_exact)) + ", gap " + str(acc_each - round_to_cent(acc_exact)) ^0
    if i == 6:
        "  after 7 lines  : per-line " + str(acc_each) + ", once " + str(round_to_cent(acc_exact)) + ", gap " + str(acc_each - round_to_cent(acc_exact)) ^0
    if i == n - 1:
        "  after " + str(n) + " lines : per-line " + str(acc_each) + ", once " + str(round_to_cent(acc_exact)) + ", gap " + str(acc_each - round_to_cent(acc_exact)) ^0
"" ^0

# ---- what each rule is right about ----

"what each answer is correct for" ^0
"  rounding per line : every printed line matches what was charged" ^0
"  rounding once     : the total matches the sum of the true amounts" ^0
"  a document that shows lines AND a total cannot have both, and the" ^0
"  difference has to appear somewhere or the document does not add up" ^0
"" ^0

# ---- the usual resolution, and what it costs ----
#
# Round the lines, then make the last line absorb the difference. The total is
# then right and one line is off by the accumulated amount.

rounded_once - rounded_each => adjustment
"putting the difference on the last line" ^0
"  adjustment : " + str(adjustment) + " tenths" ^0
round_to_cent(amounts[n - 1]) + adjustment => last_line
"  last line becomes : " + str(last_line) + " instead of " + str(round_to_cent(amounts[n - 1])) ^0
"  the document now adds up, and one line is not what that line cost" ^0
"" ^0

# ---- the control: amounts already on the cent ----
#
# Where nothing is rounded, the two routes are the same route and no rule has
# to be chosen.

[1000, 2500, 3000, 4500] => whole
0 => w_each
0 => w_exact
for a in whole:
    w_each + round_to_cent(a) => w_each
    w_exact + a => w_exact
"control - amounts that are already whole cents" ^0
"  per line : " + str(w_each) + ", once : " + str(round_to_cent(w_exact)) ^0
if w_each == round_to_cent(w_exact):
    "  identical, so this invoice cannot show which rule is in use" ^0
"" ^0

"Every line is rounded correctly and every line prints a real amount. The" ^0
"total is a sum of results rather than a result of the sum, and those are" ^0
"two different numbers whenever a line was not already on the cent." ^0
```

## Python (deterministic transpilation)

```python
amounts = [1234, 5677, 892, 3345, 7778, 456, 2223, 9995, 1116, 6664, 3338, 887]
n = len(amounts)

def round_to_cent(tenths):
    shifted = tenths + 5
    r = int(shifted / 10) * 10
    return r

rounded_each = 0
for a in amounts:
    rounded_each = rounded_each + round_to_cent(a)
exact_total = 0
for a in amounts:
    exact_total = exact_total + a
rounded_once = round_to_cent(exact_total)
print("lines : " + str(n))
print("exact total, in tenths of a cent : " + str(exact_total))
print("")
print("  rounding each line, then adding : " + str(rounded_each))
print("  adding, then rounding once      : " + str(rounded_once))
if not rounded_each == rounded_once:
    print("  they differ by " + str(rounded_each - rounded_once) + " tenths of a cent")
else:
    print("  they agree on this input")
print("")
print("line   amount   rounded   error introduced")
worst = 0
for i in range(0, n):
    a = amounts[i]
    err = round_to_cent(a) - a
    mag = err
    if mag < 0:
        mag = 0 - err
    if mag > worst:
        worst = mag
    print("  " + str(i + 1) + "      " + str(a) + "     " + str(round_to_cent(a)) + "      " + str(err))
print("")
print("largest single-line error, either direction : " + str(worst) + " tenths")
print("sum of the per-line errors: " + str(rounded_each - exact_total) + " tenths")
if worst < 10:
    print("  every line is correct to the cent and the total is not")
print("")
print("the same rule over prefixes of the list")
acc_each = 0
acc_exact = 0
for i in range(0, n):
    acc_each = acc_each + round_to_cent(amounts[i])
    acc_exact = acc_exact + amounts[i]
    if i == 2:
        print("  after 3 lines  : per-line " + str(acc_each) + ", once " + str(round_to_cent(acc_exact)) + ", gap " + str(acc_each - round_to_cent(acc_exact)))
    if i == 6:
        print("  after 7 lines  : per-line " + str(acc_each) + ", once " + str(round_to_cent(acc_exact)) + ", gap " + str(acc_each - round_to_cent(acc_exact)))
    if i == n - 1:
        print("  after " + str(n) + " lines : per-line " + str(acc_each) + ", once " + str(round_to_cent(acc_exact)) + ", gap " + str(acc_each - round_to_cent(acc_exact)))
print("")
print("what each answer is correct for")
print("  rounding per line : every printed line matches what was charged")
print("  rounding once     : the total matches the sum of the true amounts")
print("  a document that shows lines AND a total cannot have both, and the")
print("  difference has to appear somewhere or the document does not add up")
print("")
adjustment = rounded_once - rounded_each
print("putting the difference on the last line")
print("  adjustment : " + str(adjustment) + " tenths")
last_line = round_to_cent(amounts[n - 1]) + adjustment
print("  last line becomes : " + str(last_line) + " instead of " + str(round_to_cent(amounts[n - 1])))
print("  the document now adds up, and one line is not what that line cost")
print("")
whole = [1000, 2500, 3000, 4500]
w_each = 0
w_exact = 0
for a in whole:
    w_each = w_each + round_to_cent(a)
    w_exact = w_exact + a
print("control - amounts that are already whole cents")
print("  per line : " + str(w_each) + ", once : " + str(round_to_cent(w_exact)))
if w_each == round_to_cent(w_exact):
    print("  identical, so this invoice cannot show which rule is in use")
print("")
print("Every line is rounded correctly and every line prints a real amount. The")
print("total is a sum of results rather than a result of the sum, and those are")
print("two different numbers whenever a line was not already on the cent.")
```

## stdout (executed)

```text
lines : 12
exact total, in tenths of a cent : 43605

  rounding each line, then adding : 43620
  adding, then rounding once      : 43610
  they differ by 10 tenths of a cent

line   amount   rounded   error introduced
  1      1234     1230      -4
  2      5677     5680      3
  3      892     890      -2
  4      3345     3350      5
  5      7778     7780      2
  6      456     460      4
  7      2223     2220      -3
  8      9995     10000      5
  9      1116     1120      4
  10      6664     6660      -4
  11      3338     3340      2
  12      887     890      3

largest single-line error, either direction : 5 tenths
sum of the per-line errors: 15 tenths
  every line is correct to the cent and the total is not

the same rule over prefixes of the list
  after 3 lines  : per-line 7800, once 7800, gap 0
  after 7 lines  : per-line 21610, once 21610, gap 0
  after 12 lines : per-line 43620, once 43610, gap 10

what each answer is correct for
  rounding per line : every printed line matches what was charged
  rounding once     : the total matches the sum of the true amounts
  a document that shows lines AND a total cannot have both, and the
  difference has to appear somewhere or the document does not add up

putting the difference on the last line
  adjustment : -10 tenths
  last line becomes : 880 instead of 890
  the document now adds up, and one line is not what that line cost

control - amounts that are already whole cents
  per line : 11000, once : 11000
  identical, so this invoice cannot show which rule is in use

Every line is rounded correctly and every line prints a real amount. The
total is a sum of results rather than a result of the sum, and those are
two different numbers whenever a line was not already on the cent.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
