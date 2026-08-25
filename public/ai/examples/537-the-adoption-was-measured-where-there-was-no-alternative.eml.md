<!-- canonical: efficientnewlanguage.org/ai/examples/537-the-adoption-was-measured-where-there-was-no-alternative | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 537 — The adoption was measured where there was no alternative

`the_adoption_was_measured_where_there_was_no_alternative.eml` - The new internal tool reports 96 percent adoption in its fourth quarter. What the number is measuring is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The new internal
# tool reports 96 percent adoption in its fourth quarter. What the number is
# measuring is computed below.
#
# Measuring adoption is the right thing to do and this team did it honestly.
# The number is not inflated, nobody is counting a login as usage, and the
# denominator is every employee rather than a flattering subset. It rose every
# quarter, which is what a tool that is working should do, and it was reported
# without adjustment.
#
# It was also the quarter in which the old tool was switched off for the last
# large group of users. Adoption counts the people using the tool, and a person
# with no alternative is counted the same as a person who chose it. The two are
# not distinguishable inside the number, and only one of them is evidence.
#
# The population that can produce evidence is the population that still has a
# choice, and switching the old tool off is the act of shrinking it. The better
# the rollout goes, the fewer people remain who could tell you anything, so the
# number becomes most confident exactly as it becomes least informative.

1200 => employees
50 => still_have_a_choice
6 => choosers_who_adopted

employees - still_have_a_choice => no_alternative
no_alternative + choosers_who_adopted => users

"the reported number" ^0
("  employees                    : %s" % str(employees))^0
("  using the new tool           : %s" % str(users))^0
("  adoption                     : %s percent" % str(int(users * 100 / employees)))^0
"" ^0

"the same people, split by whether they had a choice" ^0
("  no alternative               : %s, of whom %s use it, %s percent" % (str(no_alternative), str(no_alternative), str(100)))^0
("  still have the old tool      : %s, of whom %s use it, %s percent" % (str(still_have_a_choice), str(choosers_who_adopted), str(int(choosers_who_adopted * 100 / still_have_a_choice))))^0
("  population that can disagree : %s, which is %s percent of the company" % (str(still_have_a_choice), str(int(still_have_a_choice * 100 / employees))))^0
"" ^0

# ---- the curve, against a model with one parameter ----
#
# If everyone without a choice is counted and everyone with a choice adopts at
# the rate the choosers actually show, adoption is determined by the switch-off
# schedule alone.

int(choosers_who_adopted * 100 / still_have_a_choice) => chooser_rate

# [quarter, percent of employees cut off from the old tool, reported adoption]
[["Q1", 0, 9], ["Q2", 60, 62], ["Q3", 90, 91], ["Q4", 96, 96]] => quarters

("model: adoption = cut off + (remainder x %s percent), one free parameter" % str(chooser_rate))^0
"" ^0
"quarter   cut off   predicted   reported   difference" ^0
0 => worst
for q in quarters:
    q[1] + int((100 - q[1]) * chooser_rate / 100) => predicted
    predicted - q[2] => diff
    if abs(diff) > worst:
        abs(diff) => worst
    ("  %-9s %-9s %-11s %-10s %s" % (q[0], str(q[1]), str(predicted), str(q[2]), str(diff)))^0
"" ^0
("  largest error across four quarters : %s points" % str(worst))^0
"  the switch-off schedule predicts the adoption curve, so the curve is" ^0
"  evidence about the schedule and not about the tool" ^0
"" ^0

# ---- the control ----
#
# A second internal tool shipped the same quarter by the same team, with the
# same survey and the same reporting. Nothing was switched off for it.

852 => optional_users
"control - an optional tool, same quarter, same team, same measurement" ^0
("  employees with a choice : %s" % str(employees))^0
("  adopted                 : %s, %s percent" % (str(optional_users), str(int(optional_users * 100 / employees))))^0
("  population that can disagree : %s, %s percent of the company" % (str(employees), str(100)))^0
"  a lower number carrying more information than the higher one" ^0
"  the measurement method is not the problem, it is the same method" ^0
"" ^0

# ---- what the number would be if everyone could choose ----

int(chooser_rate * employees / 100) => projected
"the two readings of the same quarter" ^0
("  adoption as reported                 : %s percent" % str(int(users * 100 / employees)))^0
("  adoption among people who could leave : %s percent" % str(chooser_rate))^0
("  employees that projects to            : %s of %s" % (str(projected), str(employees)))^0
("  the reported figure and the projection differ by %s points and are" % str(int(users * 100 / employees) - chooser_rate))^0
"  computed from the same four numbers" ^0
"" ^0

# ---- the survey ----

"the satisfaction survey attached to the rollout" ^0
"  sent to     : users of the new tool" ^0
("  that is     : %s people, %s of whom have no alternative" % (str(users), str(no_alternative)))^0
"  asks        : how well the tool meets your needs" ^0
"  cannot ask  : whether you would use it if the old one existed" ^0
"  the one group that can answer that is the group being switched off next" ^0
"" ^0

"Adoption was measured honestly, on the whole company, and it rose every" ^0
("quarter. It counts a person with no alternative the same as a person who" )^0
("chose: %s percent overall, %s percent among the %s who still have a choice," % (str(int(users * 100 / employees)), str(chooser_rate), str(still_have_a_choice)))^0
("and the switch-off schedule predicts all four quarters within %s points." % str(worst))^0
```

## Python (deterministic transpilation)

```python
employees = 1200
still_have_a_choice = 50
choosers_who_adopted = 6
no_alternative = employees - still_have_a_choice
users = no_alternative + choosers_who_adopted
print("the reported number")
print("  employees                    : %s" % str(employees))
print("  using the new tool           : %s" % str(users))
print("  adoption                     : %s percent" % str(int(users * 100 / employees)))
print("")
print("the same people, split by whether they had a choice")
print("  no alternative               : %s, of whom %s use it, %s percent" % (str(no_alternative), str(no_alternative), str(100)))
print("  still have the old tool      : %s, of whom %s use it, %s percent" % (str(still_have_a_choice), str(choosers_who_adopted), str(int(choosers_who_adopted * 100 / still_have_a_choice))))
print("  population that can disagree : %s, which is %s percent of the company" % (str(still_have_a_choice), str(int(still_have_a_choice * 100 / employees))))
print("")
chooser_rate = int(choosers_who_adopted * 100 / still_have_a_choice)
quarters = [["Q1", 0, 9], ["Q2", 60, 62], ["Q3", 90, 91], ["Q4", 96, 96]]
print("model: adoption = cut off + (remainder x %s percent), one free parameter" % str(chooser_rate))
print("")
print("quarter   cut off   predicted   reported   difference")
worst = 0
for q in quarters:
    predicted = q[1] + int((100 - q[1]) * chooser_rate / 100)
    diff = predicted - q[2]
    if abs(diff) > worst:
        worst = abs(diff)
    print("  %-9s %-9s %-11s %-10s %s" % (q[0], str(q[1]), str(predicted), str(q[2]), str(diff)))
print("")
print("  largest error across four quarters : %s points" % str(worst))
print("  the switch-off schedule predicts the adoption curve, so the curve is")
print("  evidence about the schedule and not about the tool")
print("")
optional_users = 852
print("control - an optional tool, same quarter, same team, same measurement")
print("  employees with a choice : %s" % str(employees))
print("  adopted                 : %s, %s percent" % (str(optional_users), str(int(optional_users * 100 / employees))))
print("  population that can disagree : %s, %s percent of the company" % (str(employees), str(100)))
print("  a lower number carrying more information than the higher one")
print("  the measurement method is not the problem, it is the same method")
print("")
projected = int(chooser_rate * employees / 100)
print("the two readings of the same quarter")
print("  adoption as reported                 : %s percent" % str(int(users * 100 / employees)))
print("  adoption among people who could leave : %s percent" % str(chooser_rate))
print("  employees that projects to            : %s of %s" % (str(projected), str(employees)))
print("  the reported figure and the projection differ by %s points and are" % str(int(users * 100 / employees) - chooser_rate))
print("  computed from the same four numbers")
print("")
print("the satisfaction survey attached to the rollout")
print("  sent to     : users of the new tool")
print("  that is     : %s people, %s of whom have no alternative" % (str(users), str(no_alternative)))
print("  asks        : how well the tool meets your needs")
print("  cannot ask  : whether you would use it if the old one existed")
print("  the one group that can answer that is the group being switched off next")
print("")
print("Adoption was measured honestly, on the whole company, and it rose every")
print("quarter. It counts a person with no alternative the same as a person who")
print("chose: %s percent overall, %s percent among the %s who still have a choice," % (str(int(users * 100 / employees)), str(chooser_rate), str(still_have_a_choice)))
print("and the switch-off schedule predicts all four quarters within %s points." % str(worst))
```

## stdout (executed)

```text
the reported number
  employees                    : 1200
  using the new tool           : 1156
  adoption                     : 96 percent

the same people, split by whether they had a choice
  no alternative               : 1150, of whom 1150 use it, 100 percent
  still have the old tool      : 50, of whom 6 use it, 12 percent
  population that can disagree : 50, which is 4 percent of the company

model: adoption = cut off + (remainder x 12 percent), one free parameter

quarter   cut off   predicted   reported   difference
  Q1        0         12          9          3
  Q2        60        64          62         2
  Q3        90        91          91         0
  Q4        96        96          96         0

  largest error across four quarters : 3 points
  the switch-off schedule predicts the adoption curve, so the curve is
  evidence about the schedule and not about the tool

control - an optional tool, same quarter, same team, same measurement
  employees with a choice : 1200
  adopted                 : 852, 71 percent
  population that can disagree : 1200, 100 percent of the company
  a lower number carrying more information than the higher one
  the measurement method is not the problem, it is the same method

the two readings of the same quarter
  adoption as reported                 : 96 percent
  adoption among people who could leave : 12 percent
  employees that projects to            : 144 of 1200
  the reported figure and the projection differ by 84 points and are
  computed from the same four numbers

the satisfaction survey attached to the rollout
  sent to     : users of the new tool
  that is     : 1156 people, 1150 of whom have no alternative
  asks        : how well the tool meets your needs
  cannot ask  : whether you would use it if the old one existed
  the one group that can answer that is the group being switched off next

Adoption was measured honestly, on the whole company, and it rose every
quarter. It counts a person with no alternative the same as a person who
chose: 96 percent overall, 12 percent among the 50 who still have a choice,
and the switch-off schedule predicts all four quarters within 3 points.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
