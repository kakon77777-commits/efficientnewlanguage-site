<!-- canonical: efficientnewlanguage.org/ai/examples/415-the-total-is-right-and-every-line-is-wrong | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 415 — The total is right and every line is wrong - net error zero, six lines off

`the_total_is_right_and_every_line_is_wrong.eml` compares each line against its true value and sums the errors, alongside the reconciliation that is actually run.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The total
# reconciles to the penny. Not one line item is correct.
#
# Reconciling the total is the check that exists, and it is a good check: it
# catches dropped rows, double-counted rows, and most arithmetic slips. It is
# also the only check anyone runs, because it is the one that can be run
# against an external number.
#
# What it cannot catch is an error that moves value between lines. Here a
# rounding rule pushes fractions of a cent from one account to the next, so
# every line is off and the errors sum to zero by construction.

# [account, true amount in cents, as posted]
[["a1", 1003, 1000], ["a2", 2007, 2010], ["a3", 505, 500], ["a4", 1495, 1500], ["a5", 802, 800], ["a6", 1198, 1200]] => lines

def true_total():
    0 => t
    for l in lines:
        t + l[1] => t
    return t

def posted_total():
    0 => t
    for l in lines:
        t + l[2] => t
    return t

"the check that is run" ^0
"  true total   : " + str(true_total()) ^0
"  posted total : " + str(posted_total()) ^0
if true_total() == posted_total():
    "  reconciles exactly" ^0
"" ^0

"the lines" ^0
0 => wrong
0 => abs_error
for l in lines:
    l[2] - l[1] => d
    if not (d == 0):
        wrong + 1 => wrong
        if d < 0:
            abs_error + (0 - d) => abs_error
        else:
            abs_error + d => abs_error
    if d < 0:
        "  " + l[0] + " : true " + str(l[1]) + ", posted " + str(l[2]) + "   (-" + str(0 - d) + ")" ^0
    else:
        "  " + l[0] + " : true " + str(l[1]) + ", posted " + str(l[2]) + "   (+" + str(d) + ")" ^0
"  lines wrong : " + str(wrong) + " of " + str(len(lines)) ^0
"  total absolute error : " + str(abs_error) ^0
"  net error : " + str(posted_total() - true_total()) ^0
"" ^0

if wrong == len(lines):
    if posted_total() == true_total():
        "Every line is wrong and the net error is zero, so the check that exists" ^0
        "passes and the check that would fail was never written." ^0
"" ^0

# ---- who is affected ----

0 => over
0 => under
for l in lines:
    if l[2] > l[1]:
        over + 1 => over
    else:
        under + 1 => under
"  accounts credited too much : " + str(over) ^0
"  accounts credited too little : " + str(under) ^0
"  a per-account complaint is the only signal left" ^0
"" ^0

# ---- the check that would catch it ----

0 => per_line_fail
for l in lines:
    if not (l[1] == l[2]):
        per_line_fail + 1 => per_line_fail
"a per-line check on the same data" ^0
"  lines it flags : " + str(per_line_fail) ^0
"  cost : one comparison per line, against a number that already exists" ^0
"" ^0

# ---- the control: an error the total DOES catch ----
#
# The total check is not weak in general. It catches anything that changes the
# sum, which is most kinds of mistake.

[["b1", 1000, 1000], ["b2", 2000, 2000], ["b3", 500, 0]] => dropped
0 => dt
0 => dp
for l in dropped:
    dt + l[1] => dt
    dp + l[2] => dp
"control - a dropped row, which changes the sum" ^0
"  true total   : " + str(dt) ^0
"  posted total : " + str(dp) ^0
if not (dt == dp):
    "  the total check catches this one immediately" ^0
"" ^0

"The reconciliation is a real check and it passes for a real reason. It" ^0
"constrains one number, and the report has " + str(len(lines)) + "." ^0
```

## Python (deterministic transpilation)

```python
lines = [["a1", 1003, 1000], ["a2", 2007, 2010], ["a3", 505, 500], ["a4", 1495, 1500], ["a5", 802, 800], ["a6", 1198, 1200]]

def true_total():
    t = 0
    for l in lines:
        t = t + l[1]
    return t

def posted_total():
    t = 0
    for l in lines:
        t = t + l[2]
    return t

print("the check that is run")
print("  true total   : " + str(true_total()))
print("  posted total : " + str(posted_total()))
if true_total() == posted_total():
    print("  reconciles exactly")
print("")
print("the lines")
wrong = 0
abs_error = 0
for l in lines:
    d = l[2] - l[1]
    if not d == 0:
        wrong = wrong + 1
        if d < 0:
            abs_error = abs_error + (0 - d)
        else:
            abs_error = abs_error + d
    if d < 0:
        print("  " + l[0] + " : true " + str(l[1]) + ", posted " + str(l[2]) + "   (-" + str(0 - d) + ")")
    else:
        print("  " + l[0] + " : true " + str(l[1]) + ", posted " + str(l[2]) + "   (+" + str(d) + ")")
print("  lines wrong : " + str(wrong) + " of " + str(len(lines)))
print("  total absolute error : " + str(abs_error))
print("  net error : " + str(posted_total() - true_total()))
print("")
if wrong == len(lines):
    if posted_total() == true_total():
        print("Every line is wrong and the net error is zero, so the check that exists")
        print("passes and the check that would fail was never written.")
print("")
over = 0
under = 0
for l in lines:
    if l[2] > l[1]:
        over = over + 1
    else:
        under = under + 1
print("  accounts credited too much : " + str(over))
print("  accounts credited too little : " + str(under))
print("  a per-account complaint is the only signal left")
print("")
per_line_fail = 0
for l in lines:
    if not l[1] == l[2]:
        per_line_fail = per_line_fail + 1
print("a per-line check on the same data")
print("  lines it flags : " + str(per_line_fail))
print("  cost : one comparison per line, against a number that already exists")
print("")
dropped = [["b1", 1000, 1000], ["b2", 2000, 2000], ["b3", 500, 0]]
dt = 0
dp = 0
for l in dropped:
    dt = dt + l[1]
    dp = dp + l[2]
print("control - a dropped row, which changes the sum")
print("  true total   : " + str(dt))
print("  posted total : " + str(dp))
if not dt == dp:
    print("  the total check catches this one immediately")
print("")
print("The reconciliation is a real check and it passes for a real reason. It")
print("constrains one number, and the report has " + str(len(lines)) + ".")
```

## stdout (executed)

```text
the check that is run
  true total   : 7010
  posted total : 7010
  reconciles exactly

the lines
  a1 : true 1003, posted 1000   (-3)
  a2 : true 2007, posted 2010   (+3)
  a3 : true 505, posted 500   (-5)
  a4 : true 1495, posted 1500   (+5)
  a5 : true 802, posted 800   (-2)
  a6 : true 1198, posted 1200   (+2)
  lines wrong : 6 of 6
  total absolute error : 20
  net error : 0

Every line is wrong and the net error is zero, so the check that exists
passes and the check that would fail was never written.

  accounts credited too much : 3
  accounts credited too little : 3
  a per-account complaint is the only signal left

a per-line check on the same data
  lines it flags : 6
  cost : one comparison per line, against a number that already exists

control - a dropped row, which changes the sum
  true total   : 3500
  posted total : 3000
  the total check catches this one immediately

The reconciliation is a real check and it passes for a real reason. It
constrains one number, and the report has 6.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
