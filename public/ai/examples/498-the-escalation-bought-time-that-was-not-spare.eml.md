<!-- canonical: efficientnewlanguage.org/ai/examples/498-the-escalation-bought-time-that-was-not-spare | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 498 — The escalation bought time that was not spare

`the_escalation_bought_time_that_was_not_spare.eml` - Seven requests were escalated this quarter and all seven were served first. Where the time came from is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Seven requests
# were escalated this quarter and all seven were served first. Where the time
# came from is computed below.
#
# Serving an escalation first is right. Somebody senior has looked at it and
# judged it urgent, the requester has spent their own credibility on it, and a
# team that ignores escalations is a team that has to be escalated past. The
# mechanism works because it is honoured.
#
# The engineering week does not grow when something is escalated. Serving one
# thing first is deferring everything behind it, and what gets deferred is
# whatever had no escalation - which is not the same as whatever mattered
# least.
#
# Both sides of the ledger are computed.

# [item, days of work, escalated, real value 1-10, days it was delayed]
[["e1", 3, 1, 4, 0], ["e2", 5, 1, 3, 0], ["e3", 2, 1, 7, 0], ["e4", 8, 1, 2, 0], ["e5", 4, 1, 5, 0], ["e6", 1, 1, 6, 0], ["e7", 6, 1, 3, 0], ["q1", 4, 0, 9, 29], ["q2", 3, 0, 8, 29], ["q3", 6, 0, 9, 29], ["q4", 2, 0, 6, 29], ["q5", 5, 0, 7, 29]] => items

len(items) => n
0 => esc
0 => esc_days
0 => esc_value
0 => q_days
0 => q_value
0 => queued
for i in items:
    if i[2] == 1:
        esc + 1 => esc
        esc_days + i[1] => esc_days
        esc_value + i[3] => esc_value
    else:
        queued + 1 => queued
        q_days + i[1] => q_days
        q_value + i[3] => q_value

"items in the quarter : " + str(n) ^0
"  escalated : " + str(esc) + ", " + str(esc_days) + " days of work" ^0
"  queued    : " + str(queued) + ", " + str(q_days) + " days of work" ^0
"" ^0

"item   days   escalated   value   days delayed" ^0
for i in items:
    "" => e
    if i[2] == 1:
        e + "yes" => e
    else:
        e + "no " => e
    "  " + i[0] + "     " + str(i[1]) + "      " + e + "         " + str(i[3]) + "       " + str(i[4]) ^0
"" ^0

# ---- value on each side ----

if esc > 0:
    "mean value of the escalated items : " + str(int(esc_value * 10 / esc)) + " tenths" ^0
if queued > 0:
    "mean value of the queued items    : " + str(int(q_value * 10 / queued)) + " tenths" ^0
if q_value * esc > esc_value * queued:
    "  the queued items are the more valuable group" ^0
    "  escalation is a claim about urgency and it is being used to order by" ^0
    "  something that is not value" ^0
"" ^0

# ---- what the delay cost ----

0 => delay_total
for i in items:
    delay_total + i[4] * i[3] => delay_total
"value-days lost to delay : " + str(delay_total) ^0
"  (days delayed times the value of what was delayed)" ^0
0 => worst_loss
"" => worst_item
for i in items:
    if i[4] * i[3] > worst_loss:
        i[4] * i[3] => worst_loss
        i[0] => worst_item
"  worst single item : " + worst_item + ", " + str(worst_loss) + " value-days" ^0
"" ^0

# ---- who escalates ----

"what escalating requires" ^0
"  knowing the escalation path exists : yes" ^0
"  having a senior sponsor            : yes" ^0
"  being willing to spend the credit  : yes" ^0
"  none of the three is the value of the work, and all three are properties" ^0
"  of the requester rather than the request" ^0
"" ^0

# ---- what the team's record shows ----

"the delivery record, as it reads at the end of the quarter" ^0
"  escalations served on time : " + str(esc) + " of " + str(esc) + ", 100%" ^0
"  queued items delivered     : 0 of " + str(queued) ^0
"  the first line is what gets reported and it is true" ^0
"" ^0

# ---- what ordering by value would have delivered ----

29 => capacity
0 => spent
0 => value_got
0 => shipped
for v in [10:1]:
    for i in items:
        if i[3] == v:
            if spent + i[1] <= capacity:
                spent + i[1] => spent
                value_got + i[3] => value_got
                shipped + 1 => shipped
"the same " + str(capacity) + " days, ordered by value" ^0
"  items shipped : " + str(shipped) ^0
"  value shipped : " + str(value_got) ^0
if value_got > esc_value:
    "  against " + str(esc_value) + " under the escalation order, a difference of " + str(value_got - esc_value) ^0
"" ^0

# ---- the control: escalations that track value ----
#
# Where the people who escalate are the people with the most valuable work,
# the two orders coincide and honouring escalations is simply correct.

[["a", 3, 1, 9, 0], ["b", 4, 1, 8, 0], ["c", 5, 0, 3, 12]] => aligned
0 => a_esc_v
0 => a_q_v
0 => a_esc
0 => a_q
for i in aligned:
    if i[2] == 1:
        a_esc + 1 => a_esc
        a_esc_v + i[3] => a_esc_v
    else:
        a_q + 1 => a_q
        a_q_v + i[3] => a_q_v
"control - a quarter where the escalated items are the valuable ones" ^0
"  mean value escalated : " + str(int(a_esc_v * 10 / a_esc)) + " tenths, queued : " + str(int(a_q_v * 10 / a_q)) + " tenths" ^0
if a_esc_v * a_q > a_q_v * a_esc:
    "  the escalations are the more valuable group, so serving them first is" ^0
    "  both responsive and correct, and nothing has to be traded" ^0
"" ^0

"Honouring escalations is what keeps the mechanism working and every one of" ^0
"these was judged urgent by somebody senior. The week did not grow, so the" ^0
"order was decided by who had a sponsor." ^0
```

## Python (deterministic transpilation)

```python
items = [["e1", 3, 1, 4, 0], ["e2", 5, 1, 3, 0], ["e3", 2, 1, 7, 0], ["e4", 8, 1, 2, 0], ["e5", 4, 1, 5, 0], ["e6", 1, 1, 6, 0], ["e7", 6, 1, 3, 0], ["q1", 4, 0, 9, 29], ["q2", 3, 0, 8, 29], ["q3", 6, 0, 9, 29], ["q4", 2, 0, 6, 29], ["q5", 5, 0, 7, 29]]
n = len(items)
esc = 0
esc_days = 0
esc_value = 0
q_days = 0
q_value = 0
queued = 0
for i in items:
    if i[2] == 1:
        esc = esc + 1
        esc_days = esc_days + i[1]
        esc_value = esc_value + i[3]
    else:
        queued = queued + 1
        q_days = q_days + i[1]
        q_value = q_value + i[3]
print("items in the quarter : " + str(n))
print("  escalated : " + str(esc) + ", " + str(esc_days) + " days of work")
print("  queued    : " + str(queued) + ", " + str(q_days) + " days of work")
print("")
print("item   days   escalated   value   days delayed")
for i in items:
    e = ""
    if i[2] == 1:
        e = e + "yes"
    else:
        e = e + "no "
    print("  " + i[0] + "     " + str(i[1]) + "      " + e + "         " + str(i[3]) + "       " + str(i[4]))
print("")
if esc > 0:
    print("mean value of the escalated items : " + str(int(esc_value * 10 / esc)) + " tenths")
if queued > 0:
    print("mean value of the queued items    : " + str(int(q_value * 10 / queued)) + " tenths")
if q_value * esc > esc_value * queued:
    print("  the queued items are the more valuable group")
    print("  escalation is a claim about urgency and it is being used to order by")
    print("  something that is not value")
print("")
delay_total = 0
for i in items:
    delay_total = delay_total + i[4] * i[3]
print("value-days lost to delay : " + str(delay_total))
print("  (days delayed times the value of what was delayed)")
worst_loss = 0
worst_item = ""
for i in items:
    if i[4] * i[3] > worst_loss:
        worst_loss = i[4] * i[3]
        worst_item = i[0]
print("  worst single item : " + worst_item + ", " + str(worst_loss) + " value-days")
print("")
print("what escalating requires")
print("  knowing the escalation path exists : yes")
print("  having a senior sponsor            : yes")
print("  being willing to spend the credit  : yes")
print("  none of the three is the value of the work, and all three are properties")
print("  of the requester rather than the request")
print("")
print("the delivery record, as it reads at the end of the quarter")
print("  escalations served on time : " + str(esc) + " of " + str(esc) + ", 100%")
print("  queued items delivered     : 0 of " + str(queued))
print("  the first line is what gets reported and it is true")
print("")
capacity = 29
spent = 0
value_got = 0
shipped = 0
for v in range(10, 2):
    for i in items:
        if i[3] == v:
            if spent + i[1] <= capacity:
                spent = spent + i[1]
                value_got = value_got + i[3]
                shipped = shipped + 1
print("the same " + str(capacity) + " days, ordered by value")
print("  items shipped : " + str(shipped))
print("  value shipped : " + str(value_got))
if value_got > esc_value:
    print("  against " + str(esc_value) + " under the escalation order, a difference of " + str(value_got - esc_value))
print("")
aligned = [["a", 3, 1, 9, 0], ["b", 4, 1, 8, 0], ["c", 5, 0, 3, 12]]
a_esc_v = 0
a_q_v = 0
a_esc = 0
a_q = 0
for i in aligned:
    if i[2] == 1:
        a_esc = a_esc + 1
        a_esc_v = a_esc_v + i[3]
    else:
        a_q = a_q + 1
        a_q_v = a_q_v + i[3]
print("control - a quarter where the escalated items are the valuable ones")
print("  mean value escalated : " + str(int(a_esc_v * 10 / a_esc)) + " tenths, queued : " + str(int(a_q_v * 10 / a_q)) + " tenths")
if a_esc_v * a_q > a_q_v * a_esc:
    print("  the escalations are the more valuable group, so serving them first is")
    print("  both responsive and correct, and nothing has to be traded")
print("")
print("Honouring escalations is what keeps the mechanism working and every one of")
print("these was judged urgent by somebody senior. The week did not grow, so the")
print("order was decided by who had a sponsor.")
```

## stdout (executed)

```text
items in the quarter : 12
  escalated : 7, 29 days of work
  queued    : 5, 20 days of work

item   days   escalated   value   days delayed
  e1     3      yes         4       0
  e2     5      yes         3       0
  e3     2      yes         7       0
  e4     8      yes         2       0
  e5     4      yes         5       0
  e6     1      yes         6       0
  e7     6      yes         3       0
  q1     4      no          9       29
  q2     3      no          8       29
  q3     6      no          9       29
  q4     2      no          6       29
  q5     5      no          7       29

mean value of the escalated items : 42 tenths
mean value of the queued items    : 78 tenths
  the queued items are the more valuable group
  escalation is a claim about urgency and it is being used to order by
  something that is not value

value-days lost to delay : 1131
  (days delayed times the value of what was delayed)
  worst single item : q1, 261 value-days

what escalating requires
  knowing the escalation path exists : yes
  having a senior sponsor            : yes
  being willing to spend the credit  : yes
  none of the three is the value of the work, and all three are properties
  of the requester rather than the request

the delivery record, as it reads at the end of the quarter
  escalations served on time : 7 of 7, 100%
  queued items delivered     : 0 of 5
  the first line is what gets reported and it is true

the same 29 days, ordered by value
  items shipped : 0
  value shipped : 0

control - a quarter where the escalated items are the valuable ones
  mean value escalated : 85 tenths, queued : 30 tenths
  the escalations are the more valuable group, so serving them first is
  both responsive and correct, and nothing has to be traded

Honouring escalations is what keeps the mechanism working and every one of
these was judged urgent by somebody senior. The week did not grow, so the
order was decided by who had a sponsor.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
