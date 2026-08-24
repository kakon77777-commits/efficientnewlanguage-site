<!-- canonical: efficientnewlanguage.org/ai/examples/522-every-request-went-through-her-so-no-form-was-built | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 522 — Every request went through her so no form was built

`every_request_went_through_her_so_no_form_was_built.eml` - A routing config is written in a format one person understands. What her turnaround does to the case for a self-serve form is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A routing config
# is written in a format one person understands. What her turnaround does to
# the case for a self-serve form is computed below.
#
# She is fast and she is generous with it. Median turnaround is under an hour,
# she has never refused a request, and she wrote the format because the
# alternative at the time was hand-edited JSON that broke production twice.
# The format is genuinely better than what it replaced.
#
# A self-serve form gets built when the queue hurts. The queue does not hurt,
# because she clears it. So the tool that would let anybody write the config is
# justified by a delay that her speed removes, and the faster she is, the
# weaker the case for not needing her.
#
# Requests are counted with what each one cost and who could have done it.

# [quarter, requests, median hours to turnaround, requests she handled, others who can write it]
[["Q1", 34, 1, 34, 0], ["Q2", 51, 1, 51, 0], ["Q3", 78, 2, 78, 0], ["Q4", 96, 2, 96, 0], ["Q5", 121, 3, 119, 1], ["Q6", 140, 3, 138, 1]] => quarters

len(quarters) => n
quarters[0] => first
quarters[n - 1] => last
24 => pain_threshold_hours

"quarter   requests   median hours   she handled   others who can" ^0
for q in quarters:
    "  " + q[0] + "        " + str(q[1]) + "         " + str(q[2]) + "              " + str(q[3]) + "            " + str(q[4]) ^0
"" ^0

0 => total_req
0 => total_hers
for q in quarters:
    total_req + q[1] => total_req
    total_hers + q[3] => total_hers
"requests across the period : " + str(total_req) ^0
"she handled                : " + str(total_hers) + ", " + str(int(total_hers * 1000 / total_req)) + " per 1000" ^0
"requests grew              : " + str(int((last[1] - first[1]) * 100 / first[1])) + "%" ^0
"median turnaround grew     : " + str(first[2]) + "h to " + str(last[2]) + "h" ^0
"" ^0

# ---- the rule that would fund the form ----

"a self-serve form is funded when median turnaround exceeds " + str(pain_threshold_hours) + " hours" ^0
0 => over
for q in quarters:
    if q[2] > pain_threshold_hours:
        over + 1 => over
"  quarters over the threshold : " + str(over) + " of " + str(n) ^0
"  highest median observed     : " + str(last[2]) + "h, which is " + str(int(pain_threshold_hours / last[2])) + " times below the bar" ^0
if over == 0:
    "  the rule has never fired, and every reading it used was correct" ^0
"" ^0

# ---- what her time is buying ----

15 => minutes_each
int(total_req * minutes_each / 60) => her_hours
"her side of it" ^0
"  minutes per request : " + str(minutes_each) ^0
"  hours across the period : " + str(her_hours) ^0
"  hours in the last quarter alone : " + str(int(last[1] * minutes_each / 60)) ^0
"  as a share of one quarter of full-time work : " + str(int(last[1] * minutes_each * 100 / (60 * 480))) + "%" ^0
"  none of that appears in the turnaround metric, which measures how long" ^0
"  the requester waited rather than what the answer cost" ^0
"" ^0

# ---- the growth that is not in the queue ----

"where the growth went" ^0
for q in quarters:
    "  " + q[0] + " : " + str(q[1]) + " requests, " + str(q[2]) + "h median, " + str(int(q[1] * minutes_each / 60)) + " of her hours" ^0
"  requests multiplied by " + str(int(last[1] / first[1])) + " and the median moved " + str(last[2] - first[2]) + " hours" ^0
"  the load landed on her calendar rather than in the queue, and the queue" ^0
"  is the only one of the two with a threshold attached" ^0
"" ^0

# ---- the second person ----

"the one other person who can write it" ^0
for q in quarters:
    if q[4] > 0:
        "  from " + q[0] + " : " + str(q[4]) + " other person, handling " + str(q[1] - q[3]) + " of " + str(q[1]) + " requests" ^0
"  share taken by the second person : " + str(int((last[1] - last[3]) * 1000 / last[1])) + " per 1000" ^0
"  learning it took him : four months of asking her" ^0
"  which is the only path there is, because the format's documentation is" ^0
"  her answering questions" ^0
"" ^0

# ---- what a form would cost and remove ----

20 => form_days
"the form" ^0
"  build cost      : " + str(form_days) + " days" ^0
"  her hours saved per quarter : " + str(int(last[1] * minutes_each / 60)) ^0
"  quarters to repay in her time alone : " + str(int(form_days * 8 / (last[1] * minutes_each / 60))) ^0
"  requesters who could then self-serve : everyone" ^0
"  none of those four numbers is an input to the rule that funds it" ^0
"" ^0

# ---- the control: a config anybody already edits ----
#
# Where the format is ordinary and many people write it, no single person's
# speed is standing between the load and the metric that would act on it.

[["feature flags", 210, 0, 14]] => open_format
for o in open_format:
    "control - " + o[0] + ", edited directly by anyone" ^0
    "  requests routed through a specialist : " + str(o[2]) ^0
    "  people who write it : " + str(o[3]) ^0
    "  turnaround : not measured, because there is no queue to measure" ^0
    "  the absence of a queue here is an absence of a bottleneck, and above" ^0
    "  it is the presence of a fast one" ^0
"" ^0

"She is fast, generous, and the format is better than what it replaced." ^0
"The form is funded by a queue that hurts, and she has absorbed " + str(int((last[1] - first[1]) * 100 / first[1])) + "% growth" ^0
"into a median of " + str(last[2]) + " hours against a " + str(pain_threshold_hours) + "-hour bar." ^0
```

## Python (deterministic transpilation)

```python
quarters = [["Q1", 34, 1, 34, 0], ["Q2", 51, 1, 51, 0], ["Q3", 78, 2, 78, 0], ["Q4", 96, 2, 96, 0], ["Q5", 121, 3, 119, 1], ["Q6", 140, 3, 138, 1]]
n = len(quarters)
first = quarters[0]
last = quarters[n - 1]
pain_threshold_hours = 24
print("quarter   requests   median hours   she handled   others who can")
for q in quarters:
    print("  " + q[0] + "        " + str(q[1]) + "         " + str(q[2]) + "              " + str(q[3]) + "            " + str(q[4]))
print("")
total_req = 0
total_hers = 0
for q in quarters:
    total_req = total_req + q[1]
    total_hers = total_hers + q[3]
print("requests across the period : " + str(total_req))
print("she handled                : " + str(total_hers) + ", " + str(int(total_hers * 1000 / total_req)) + " per 1000")
print("requests grew              : " + str(int((last[1] - first[1]) * 100 / first[1])) + "%")
print("median turnaround grew     : " + str(first[2]) + "h to " + str(last[2]) + "h")
print("")
print("a self-serve form is funded when median turnaround exceeds " + str(pain_threshold_hours) + " hours")
over = 0
for q in quarters:
    if q[2] > pain_threshold_hours:
        over = over + 1
print("  quarters over the threshold : " + str(over) + " of " + str(n))
print("  highest median observed     : " + str(last[2]) + "h, which is " + str(int(pain_threshold_hours / last[2])) + " times below the bar")
if over == 0:
    print("  the rule has never fired, and every reading it used was correct")
print("")
minutes_each = 15
her_hours = int(total_req * minutes_each / 60)
print("her side of it")
print("  minutes per request : " + str(minutes_each))
print("  hours across the period : " + str(her_hours))
print("  hours in the last quarter alone : " + str(int(last[1] * minutes_each / 60)))
print("  as a share of one quarter of full-time work : " + str(int(last[1] * minutes_each * 100 / (60 * 480))) + "%")
print("  none of that appears in the turnaround metric, which measures how long")
print("  the requester waited rather than what the answer cost")
print("")
print("where the growth went")
for q in quarters:
    print("  " + q[0] + " : " + str(q[1]) + " requests, " + str(q[2]) + "h median, " + str(int(q[1] * minutes_each / 60)) + " of her hours")
print("  requests multiplied by " + str(int(last[1] / first[1])) + " and the median moved " + str(last[2] - first[2]) + " hours")
print("  the load landed on her calendar rather than in the queue, and the queue")
print("  is the only one of the two with a threshold attached")
print("")
print("the one other person who can write it")
for q in quarters:
    if q[4] > 0:
        print("  from " + q[0] + " : " + str(q[4]) + " other person, handling " + str(q[1] - q[3]) + " of " + str(q[1]) + " requests")
print("  share taken by the second person : " + str(int((last[1] - last[3]) * 1000 / last[1])) + " per 1000")
print("  learning it took him : four months of asking her")
print("  which is the only path there is, because the format's documentation is")
print("  her answering questions")
print("")
form_days = 20
print("the form")
print("  build cost      : " + str(form_days) + " days")
print("  her hours saved per quarter : " + str(int(last[1] * minutes_each / 60)))
print("  quarters to repay in her time alone : " + str(int(form_days * 8 / (last[1] * minutes_each / 60))))
print("  requesters who could then self-serve : everyone")
print("  none of those four numbers is an input to the rule that funds it")
print("")
open_format = [["feature flags", 210, 0, 14]]
for o in open_format:
    print("control - " + o[0] + ", edited directly by anyone")
    print("  requests routed through a specialist : " + str(o[2]))
    print("  people who write it : " + str(o[3]))
    print("  turnaround : not measured, because there is no queue to measure")
    print("  the absence of a queue here is an absence of a bottleneck, and above")
    print("  it is the presence of a fast one")
print("")
print("She is fast, generous, and the format is better than what it replaced.")
print("The form is funded by a queue that hurts, and she has absorbed " + str(int((last[1] - first[1]) * 100 / first[1])) + "% growth")
print("into a median of " + str(last[2]) + " hours against a " + str(pain_threshold_hours) + "-hour bar.")
```

## stdout (executed)

```text
quarter   requests   median hours   she handled   others who can
  Q1        34         1              34            0
  Q2        51         1              51            0
  Q3        78         2              78            0
  Q4        96         2              96            0
  Q5        121         3              119            1
  Q6        140         3              138            1

requests across the period : 520
she handled                : 516, 992 per 1000
requests grew              : 311%
median turnaround grew     : 1h to 3h

a self-serve form is funded when median turnaround exceeds 24 hours
  quarters over the threshold : 0 of 6
  highest median observed     : 3h, which is 8 times below the bar
  the rule has never fired, and every reading it used was correct

her side of it
  minutes per request : 15
  hours across the period : 130
  hours in the last quarter alone : 35
  as a share of one quarter of full-time work : 7%
  none of that appears in the turnaround metric, which measures how long
  the requester waited rather than what the answer cost

where the growth went
  Q1 : 34 requests, 1h median, 8 of her hours
  Q2 : 51 requests, 1h median, 12 of her hours
  Q3 : 78 requests, 2h median, 19 of her hours
  Q4 : 96 requests, 2h median, 24 of her hours
  Q5 : 121 requests, 3h median, 30 of her hours
  Q6 : 140 requests, 3h median, 35 of her hours
  requests multiplied by 4 and the median moved 2 hours
  the load landed on her calendar rather than in the queue, and the queue
  is the only one of the two with a threshold attached

the one other person who can write it
  from Q5 : 1 other person, handling 2 of 121 requests
  from Q6 : 1 other person, handling 2 of 140 requests
  share taken by the second person : 14 per 1000
  learning it took him : four months of asking her
  which is the only path there is, because the format's documentation is
  her answering questions

the form
  build cost      : 20 days
  her hours saved per quarter : 35
  quarters to repay in her time alone : 4
  requesters who could then self-serve : everyone
  none of those four numbers is an input to the rule that funds it

control - feature flags, edited directly by anyone
  requests routed through a specialist : 0
  people who write it : 14
  turnaround : not measured, because there is no queue to measure
  the absence of a queue here is an absence of a bottleneck, and above
  it is the presence of a fast one

She is fast, generous, and the format is better than what it replaced.
The form is funded by a queue that hurts, and she has absorbed 311% growth
into a median of 3 hours against a 24-hour bar.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
