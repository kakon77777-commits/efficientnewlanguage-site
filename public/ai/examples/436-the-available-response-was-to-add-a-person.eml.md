<!-- canonical: efficientnewlanguage.org/ai/examples/436-the-available-response-was-to-add-a-person | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 436 — The available response was to add a person

`the_available_response_was_to_add_a_person.eml` - The system cannot be changed this quarter, so a person checks the output. What that catches is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The system cannot
# be changed this quarter, so a person checks the output. What that catches is
# computed below.
#
# The manual check is a good answer to the question that was asked. It shipped
# in a day, it needs no deploy, it catches real errors that were reaching
# customers, and the person doing it is better at the judgement calls than any
# rule anyone could write down in a day.
#
# A person is also a fixed amount of throughput applied to a queue that is not
# fixed. The check's coverage is the ratio between those two, so it is highest
# on the day it is introduced and falls with every unit of growth, without
# anybody deciding that it should.
#
# Coverage is computed per month rather than stated once.

# items arriving per day, by month
[200, 240, 300, 380, 470, 600] => volume
40 => checked_per_day
25 => defect_rate_per_1000
30 => days

len(volume) => months

def reviewed(items):
    if items < checked_per_day:
        return items
    return checked_per_day

def coverage(items):
    return int(reviewed(items) * 100 / items)

def defects(items):
    return int(items * days * defect_rate_per_1000 / 1000)

def caught(items):
    return int(defects(items) * reviewed(items) / items)

"one reviewer checks " + str(checked_per_day) + " items a day" ^0
"defect rate : " + str(defect_rate_per_1000) + " per 1000 items" ^0
"each month is " + str(days) + " days" ^0
"" ^0

"month   items/day   coverage   defects/month   caught   reaching customers" ^0
for i in [0:months - 1]:
    volume[i] => v
    "  " + str(i + 1) + "       " + str(v) + "        " + str(coverage(v)) + "%        " + str(defects(v)) + "            " + str(caught(v)) + "      " + str(defects(v) - caught(v)) ^0
"" ^0

coverage(volume[0]) => cov_first
coverage(volume[months - 1]) => cov_last
"coverage, first month against last" ^0
"  month 1 : " + str(cov_first) + "%" ^0
"  month " + str(months) + " : " + str(cov_last) + "%" ^0
if cov_last < cov_first:
    "  down " + str(cov_first - cov_last) + " points, with the same person doing the same work" ^0
"" ^0

# ---- what got worse while nothing got worse ----

defects(volume[0]) - caught(volume[0]) => escaped_first
defects(volume[months - 1]) - caught(volume[months - 1]) => escaped_last
"defects reaching customers, per month" ^0
"  month 1 : " + str(escaped_first) ^0
"  month " + str(months) + " : " + str(escaped_last) ^0
if escaped_last > escaped_first:
    "  up by " + str(escaped_last - escaped_first) + ", and the defect rate never moved" ^0
"  the check did not degrade; the denominator under it grew" ^0
"" ^0

# ---- what the check is worth ----
#
# It is not nothing. Every caught defect is a real one, and this is the honest
# credit side of the ledger.

0 => total_caught
0 => total_defects
for i in [0:months - 1]:
    total_caught + caught(volume[i]) => total_caught
    total_defects + defects(volume[i]) => total_defects
"over the " + str(months) + " months" ^0
"  defects produced : " + str(total_defects) ^0
"  defects caught   : " + str(total_caught) ^0
if total_caught > 0:
    "  which is " + str(int(total_caught * 100 / total_defects)) + "% of them, all real, all found by reading" ^0
"" ^0

# ---- what keeping the coverage flat would take ----

int(volume[months - 1] * cov_first / 100) => needed_capacity
"holding month 1 coverage through month " + str(months) ^0
"  items to check per day : " + str(needed_capacity) ^0
"  reviewers needed       : " + str(int(needed_capacity / checked_per_day)) + " and a remainder, against 1 today" ^0
"  the headcount tracks the volume, because that is what a fixed-rate check" ^0
"  costs when the volume is not fixed" ^0
"" ^0

# ---- the same problem given to the thing that was blocked ----

70 => rule_share
int(defects(volume[months - 1]) * rule_share / 100) => rule_caught
"a rule that catches the two commonest defect shapes" ^0
"  share of defects it would catch : " + str(rule_share) + "%" ^0
"  items it can check              : every one of them, so coverage is 100%" ^0
"  at month " + str(months) + " it catches " + str(rule_caught) + " a month" ^0
if rule_caught > caught(volume[months - 1]):
    "  against " + str(caught(volume[months - 1])) + " for the reviewer, and the gap widens with every month" ^0
"  it is worse per item than a person and it does not have a queue" ^0
"" ^0

# ---- the control: a queue that does not grow ----
#
# Where the volume is fixed by something outside the business, a fixed-rate
# check keeps the coverage it started with, and this failure mode never
# appears.

[30, 30, 30, 30, 30, 30] => fixed_volume
coverage(fixed_volume[0]) => f_first
coverage(fixed_volume[months - 1]) => f_last
"control - a queue capped at " + str(fixed_volume[0]) + " items a day" ^0
"  reviewer capacity is " + str(checked_per_day) + ", above the queue, so coverage clamps at" ^0
"  month 1 : " + str(f_first) + "%, month " + str(months) + " : " + str(f_last) + "%" ^0
if f_first == f_last:
    "  unchanged, so a reviewer here is a permanent answer rather than a" ^0
    "  temporary one, and this queue cannot show the decay" ^0
"" ^0

"The reviewer catches real defects and was the only thing that could ship" ^0
"that week. Coverage is capacity over volume, and only one of those two was" ^0
"chosen by anybody." ^0
```

## Python (deterministic transpilation)

```python
volume = [200, 240, 300, 380, 470, 600]
checked_per_day = 40
defect_rate_per_1000 = 25
days = 30
months = len(volume)

def reviewed(items):
    if items < checked_per_day:
        return items
    return checked_per_day

def coverage(items):
    return int(reviewed(items) * 100 / items)

def defects(items):
    return int(items * days * defect_rate_per_1000 / 1000)

def caught(items):
    return int(defects(items) * reviewed(items) / items)

print("one reviewer checks " + str(checked_per_day) + " items a day")
print("defect rate : " + str(defect_rate_per_1000) + " per 1000 items")
print("each month is " + str(days) + " days")
print("")
print("month   items/day   coverage   defects/month   caught   reaching customers")
for i in range(0, months):
    v = volume[i]
    print("  " + str(i + 1) + "       " + str(v) + "        " + str(coverage(v)) + "%        " + str(defects(v)) + "            " + str(caught(v)) + "      " + str(defects(v) - caught(v)))
print("")
cov_first = coverage(volume[0])
cov_last = coverage(volume[months - 1])
print("coverage, first month against last")
print("  month 1 : " + str(cov_first) + "%")
print("  month " + str(months) + " : " + str(cov_last) + "%")
if cov_last < cov_first:
    print("  down " + str(cov_first - cov_last) + " points, with the same person doing the same work")
print("")
escaped_first = defects(volume[0]) - caught(volume[0])
escaped_last = defects(volume[months - 1]) - caught(volume[months - 1])
print("defects reaching customers, per month")
print("  month 1 : " + str(escaped_first))
print("  month " + str(months) + " : " + str(escaped_last))
if escaped_last > escaped_first:
    print("  up by " + str(escaped_last - escaped_first) + ", and the defect rate never moved")
print("  the check did not degrade; the denominator under it grew")
print("")
total_caught = 0
total_defects = 0
for i in range(0, months):
    total_caught = total_caught + caught(volume[i])
    total_defects = total_defects + defects(volume[i])
print("over the " + str(months) + " months")
print("  defects produced : " + str(total_defects))
print("  defects caught   : " + str(total_caught))
if total_caught > 0:
    print("  which is " + str(int(total_caught * 100 / total_defects)) + "% of them, all real, all found by reading")
print("")
needed_capacity = int(volume[months - 1] * cov_first / 100)
print("holding month 1 coverage through month " + str(months))
print("  items to check per day : " + str(needed_capacity))
print("  reviewers needed       : " + str(int(needed_capacity / checked_per_day)) + " and a remainder, against 1 today")
print("  the headcount tracks the volume, because that is what a fixed-rate check")
print("  costs when the volume is not fixed")
print("")
rule_share = 70
rule_caught = int(defects(volume[months - 1]) * rule_share / 100)
print("a rule that catches the two commonest defect shapes")
print("  share of defects it would catch : " + str(rule_share) + "%")
print("  items it can check              : every one of them, so coverage is 100%")
print("  at month " + str(months) + " it catches " + str(rule_caught) + " a month")
if rule_caught > caught(volume[months - 1]):
    print("  against " + str(caught(volume[months - 1])) + " for the reviewer, and the gap widens with every month")
print("  it is worse per item than a person and it does not have a queue")
print("")
fixed_volume = [30, 30, 30, 30, 30, 30]
f_first = coverage(fixed_volume[0])
f_last = coverage(fixed_volume[months - 1])
print("control - a queue capped at " + str(fixed_volume[0]) + " items a day")
print("  reviewer capacity is " + str(checked_per_day) + ", above the queue, so coverage clamps at")
print("  month 1 : " + str(f_first) + "%, month " + str(months) + " : " + str(f_last) + "%")
if f_first == f_last:
    print("  unchanged, so a reviewer here is a permanent answer rather than a")
    print("  temporary one, and this queue cannot show the decay")
print("")
print("The reviewer catches real defects and was the only thing that could ship")
print("that week. Coverage is capacity over volume, and only one of those two was")
print("chosen by anybody.")
```

## stdout (executed)

```text
one reviewer checks 40 items a day
defect rate : 25 per 1000 items
each month is 30 days

month   items/day   coverage   defects/month   caught   reaching customers
  1       200        20%        150            30      120
  2       240        16%        180            30      150
  3       300        13%        225            30      195
  4       380        10%        285            30      255
  5       470        8%        352            29      323
  6       600        6%        450            30      420

coverage, first month against last
  month 1 : 20%
  month 6 : 6%
  down 14 points, with the same person doing the same work

defects reaching customers, per month
  month 1 : 120
  month 6 : 420
  up by 300, and the defect rate never moved
  the check did not degrade; the denominator under it grew

over the 6 months
  defects produced : 1642
  defects caught   : 179
  which is 10% of them, all real, all found by reading

holding month 1 coverage through month 6
  items to check per day : 120
  reviewers needed       : 3 and a remainder, against 1 today
  the headcount tracks the volume, because that is what a fixed-rate check
  costs when the volume is not fixed

a rule that catches the two commonest defect shapes
  share of defects it would catch : 70%
  items it can check              : every one of them, so coverage is 100%
  at month 6 it catches 315 a month
  against 30 for the reviewer, and the gap widens with every month
  it is worse per item than a person and it does not have a queue

control - a queue capped at 30 items a day
  reviewer capacity is 40, above the queue, so coverage clamps at
  month 1 : 100%, month 6 : 100%
  unchanged, so a reviewer here is a permanent answer rather than a
  temporary one, and this queue cannot show the decay

The reviewer catches real defects and was the only thing that could ship
that week. Coverage is capacity over volume, and only one of those two was
chosen by anybody.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
