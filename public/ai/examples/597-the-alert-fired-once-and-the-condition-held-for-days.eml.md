<!-- canonical: efficientnewlanguage.org/ai/examples/597-the-alert-fired-once-and-the-condition-held-for-days | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 597 — The alert fired once and the condition held for days

`the_alert_fired_once_and_the_condition_held_for_days.eml` - A disk alert fires when free space crosses below fifteen percent. It fired once. What the condition did afterwards is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A disk alert
# fires when free space crosses below fifteen percent. It fired once. What the
# condition did afterwards is computed below.
#
# Firing on the crossing rather than on the state is correct and it is what the
# rule was written to do. An alert that re-fires while a condition holds
# produces one page per evaluation interval, which for a five minute interval
# and a three day condition is a wall of identical pages, and the reliable
# outcome of that is a mute rule that outlives the incident. The team chose
# edge-triggered deliberately, after exactly that happened with a different
# rule.
#
# An edge is a moment. A condition is a duration. The rule reports the first
# and the runbook asks about the second.
#
# So the page arrived, correctly, once. Everything after that moment is
# recorded nowhere, because nothing crossed anything again.

15 => threshold_pct
5 => eval_interval_minutes
72 => hours_condition_held
1 => alerts_fired

hours_condition_held * 60 => minutes_held
int(minutes_held / eval_interval_minutes) => evaluations_while_true

"threshold                  : " + str(threshold_pct) + " percent free" ^0
"evaluation interval        : every " + str(eval_interval_minutes) + " minutes" ^0
"hours the condition held   : " + str(hours_condition_held) ^0
"evaluations while true     : " + str(evaluations_while_true) ^0
"alerts fired               : " + str(alerts_fired) ^0
"" ^0

# ---- the free space over those days ----

14 => free_at_first_crossing
3 => free_at_end

"hour   free percent   below threshold   crossings   alerts" ^0
free_at_first_crossing => free_pct
for h in [0:3]:
    h * 24 => hour_mark
    free_at_first_crossing - int(h * (free_at_first_crossing - free_at_end) / 3) => free_pct
    "  " + str(hour_mark) + "     " + str(free_pct) + "             yes               0          0" ^0
"" ^0
"  the free space fell from " + str(free_at_first_crossing) + " percent to " + str(free_at_end) + " percent" ^0
"  the number of threshold crossings in that period is 0" ^0
"  because it was already below when the period began" ^0
"" ^0

# ---- what each question can be answered from ----

"question                                  answerable from the alert" ^0
"  did free space go below " + str(threshold_pct) + " percent          yes" ^0
"  when                                        yes" ^0
"  is it still below now                       no" ^0
"  how far below has it gone                   no" ^0
"  how long has it been below                  no" ^0
"  answerable  : 2 of 6" ^0
"" ^0
"  the four it cannot answer are the four the runbook opens with" ^0
"" ^0

# ---- the acknowledgement ----
#
# Someone acknowledged the page, looked, and found the disk at eleven percent
# with a cleanup already running. That was a correct read of a real state, and
# it closed the page.

11 => free_at_ack

"the acknowledgement" ^0
"  free space when acknowledged : " + str(free_at_ack) + " percent" ^0
"  cleanup running              : yes" ^0
"  correct decision at that moment : yes" ^0
"  alerts remaining open        : 0" ^0
"" ^0
"  after the acknowledgement the condition continued for " + str(hours_condition_held) + " hours" ^0
"  and produced " + str(alerts_fired - 1) + " further signals of any kind" ^0
"" ^0

# ---- the state that was never reported ----

free_at_first_crossing - free_at_end => percent_fallen_after_the_page

"between the page and the outage" ^0
"  free space at the page   : " + str(free_at_first_crossing) + " percent" ^0
"  free space at the outage : " + str(free_at_end) + " percent" ^0
"  further decline          : " + str(percent_fallen_after_the_page) + " points" ^0
"  evaluations that observed it : " + str(evaluations_while_true) ^0
"  evaluations that reported it : 0" ^0
"" ^0
"  the rule looked " + str(evaluations_while_true) + " times and said nothing " + str(evaluations_while_true) + " times," ^0
"  correctly, because nothing crossed" ^0
"" ^0

# ---- the control ----
#
# The rule, against what it was written to do. It was written to page once on
# entry into a bad state rather than once per interval, and it did exactly
# that, on time, with no duplicate and no miss.

"control - did the alert rule work" ^0
"  crossings that occurred    : " + str(alerts_fired) ^0
"  crossings that paged       : " + str(alerts_fired) ^0
"  duplicate pages            : 0" ^0
"  missed crossings           : 0" ^0
"  false pages                : 0" ^0
"  defects in the rule        : 0" ^0
"" ^0
"  re-firing every " + str(eval_interval_minutes) + " minutes would have sent " + str(evaluations_while_true) + " pages, which is" ^0
"  how the previous rule got muted" ^0
"" ^0

# ---- the null control ----
#
# The same rule, same threshold, same interval, on a condition that clears by
# itself in twenty minutes. Edge-triggered is exactly right here: one page, the
# state resolves, and there is nothing the alert failed to say.

20 => nc_minutes_held
int(nc_minutes_held / eval_interval_minutes) => nc_evaluations

"null control - the same rule on a short-lived condition" ^0
"  minutes the condition held : " + str(nc_minutes_held) ^0
"  evaluations while true     : " + str(nc_evaluations) ^0
"  alerts fired               : " + str(alerts_fired) ^0
"  state at acknowledgement   : already recovered" ^0
"  same rule, same threshold, same edge" ^0
"  what changed is the ratio of the duration to the response time" ^0
"" ^0

# ---- the rule ----

"what an edge-triggered alert records" ^0
"  that a transition happened : yes, exactly once, and that is the point" ^0
"  the state after it         : not represented" ^0
"  the duration               : not represented" ^0
"  the depth                  : not represented" ^0
"" ^0
"the answer is not to re-fire, which is the failure it was" ^0
"designed away from; it is to carry the current state alongside" ^0
"the transition, so the page ages instead of expiring" ^0
"" ^0

"The rule paged on the crossing, once, on time, with 0 duplicates, 0 misses and" ^0
"0 false pages, avoiding the " + str(evaluations_while_true) + " pages a level-triggered version would have" ^0
"sent over " + str(hours_condition_held) + " hours. Across those same " + str(evaluations_while_true) + " evaluations the free space fell a" ^0
"further " + str(percent_fallen_after_the_page) + " points to " + str(free_at_end) + " percent, and the number of signals emitted about" ^0
"that decline was 0, because a threshold can only be crossed from above." ^0
```

## Python (deterministic transpilation)

```python
threshold_pct = 15
eval_interval_minutes = 5
hours_condition_held = 72
alerts_fired = 1
minutes_held = hours_condition_held * 60
evaluations_while_true = int(minutes_held / eval_interval_minutes)
print("threshold                  : " + str(threshold_pct) + " percent free")
print("evaluation interval        : every " + str(eval_interval_minutes) + " minutes")
print("hours the condition held   : " + str(hours_condition_held))
print("evaluations while true     : " + str(evaluations_while_true))
print("alerts fired               : " + str(alerts_fired))
print("")
free_at_first_crossing = 14
free_at_end = 3
print("hour   free percent   below threshold   crossings   alerts")
free_pct = free_at_first_crossing
for h in range(0, 4):
    hour_mark = h * 24
    free_pct = free_at_first_crossing - int(h * (free_at_first_crossing - free_at_end) / 3)
    print("  " + str(hour_mark) + "     " + str(free_pct) + "             yes               0          0")
print("")
print("  the free space fell from " + str(free_at_first_crossing) + " percent to " + str(free_at_end) + " percent")
print("  the number of threshold crossings in that period is 0")
print("  because it was already below when the period began")
print("")
print("question                                  answerable from the alert")
print("  did free space go below " + str(threshold_pct) + " percent          yes")
print("  when                                        yes")
print("  is it still below now                       no")
print("  how far below has it gone                   no")
print("  how long has it been below                  no")
print("  answerable  : 2 of 6")
print("")
print("  the four it cannot answer are the four the runbook opens with")
print("")
free_at_ack = 11
print("the acknowledgement")
print("  free space when acknowledged : " + str(free_at_ack) + " percent")
print("  cleanup running              : yes")
print("  correct decision at that moment : yes")
print("  alerts remaining open        : 0")
print("")
print("  after the acknowledgement the condition continued for " + str(hours_condition_held) + " hours")
print("  and produced " + str(alerts_fired - 1) + " further signals of any kind")
print("")
percent_fallen_after_the_page = free_at_first_crossing - free_at_end
print("between the page and the outage")
print("  free space at the page   : " + str(free_at_first_crossing) + " percent")
print("  free space at the outage : " + str(free_at_end) + " percent")
print("  further decline          : " + str(percent_fallen_after_the_page) + " points")
print("  evaluations that observed it : " + str(evaluations_while_true))
print("  evaluations that reported it : 0")
print("")
print("  the rule looked " + str(evaluations_while_true) + " times and said nothing " + str(evaluations_while_true) + " times,")
print("  correctly, because nothing crossed")
print("")
print("control - did the alert rule work")
print("  crossings that occurred    : " + str(alerts_fired))
print("  crossings that paged       : " + str(alerts_fired))
print("  duplicate pages            : 0")
print("  missed crossings           : 0")
print("  false pages                : 0")
print("  defects in the rule        : 0")
print("")
print("  re-firing every " + str(eval_interval_minutes) + " minutes would have sent " + str(evaluations_while_true) + " pages, which is")
print("  how the previous rule got muted")
print("")
nc_minutes_held = 20
nc_evaluations = int(nc_minutes_held / eval_interval_minutes)
print("null control - the same rule on a short-lived condition")
print("  minutes the condition held : " + str(nc_minutes_held))
print("  evaluations while true     : " + str(nc_evaluations))
print("  alerts fired               : " + str(alerts_fired))
print("  state at acknowledgement   : already recovered")
print("  same rule, same threshold, same edge")
print("  what changed is the ratio of the duration to the response time")
print("")
print("what an edge-triggered alert records")
print("  that a transition happened : yes, exactly once, and that is the point")
print("  the state after it         : not represented")
print("  the duration               : not represented")
print("  the depth                  : not represented")
print("")
print("the answer is not to re-fire, which is the failure it was")
print("designed away from; it is to carry the current state alongside")
print("the transition, so the page ages instead of expiring")
print("")
print("The rule paged on the crossing, once, on time, with 0 duplicates, 0 misses and")
print("0 false pages, avoiding the " + str(evaluations_while_true) + " pages a level-triggered version would have")
print("sent over " + str(hours_condition_held) + " hours. Across those same " + str(evaluations_while_true) + " evaluations the free space fell a")
print("further " + str(percent_fallen_after_the_page) + " points to " + str(free_at_end) + " percent, and the number of signals emitted about")
print("that decline was 0, because a threshold can only be crossed from above.")
```

## stdout (executed)

```text
threshold                  : 15 percent free
evaluation interval        : every 5 minutes
hours the condition held   : 72
evaluations while true     : 864
alerts fired               : 1

hour   free percent   below threshold   crossings   alerts
  0     14             yes               0          0
  24     11             yes               0          0
  48     7             yes               0          0
  72     3             yes               0          0

  the free space fell from 14 percent to 3 percent
  the number of threshold crossings in that period is 0
  because it was already below when the period began

question                                  answerable from the alert
  did free space go below 15 percent          yes
  when                                        yes
  is it still below now                       no
  how far below has it gone                   no
  how long has it been below                  no
  answerable  : 2 of 6

  the four it cannot answer are the four the runbook opens with

the acknowledgement
  free space when acknowledged : 11 percent
  cleanup running              : yes
  correct decision at that moment : yes
  alerts remaining open        : 0

  after the acknowledgement the condition continued for 72 hours
  and produced 0 further signals of any kind

between the page and the outage
  free space at the page   : 14 percent
  free space at the outage : 3 percent
  further decline          : 11 points
  evaluations that observed it : 864
  evaluations that reported it : 0

  the rule looked 864 times and said nothing 864 times,
  correctly, because nothing crossed

control - did the alert rule work
  crossings that occurred    : 1
  crossings that paged       : 1
  duplicate pages            : 0
  missed crossings           : 0
  false pages                : 0
  defects in the rule        : 0

  re-firing every 5 minutes would have sent 864 pages, which is
  how the previous rule got muted

null control - the same rule on a short-lived condition
  minutes the condition held : 20
  evaluations while true     : 4
  alerts fired               : 1
  state at acknowledgement   : already recovered
  same rule, same threshold, same edge
  what changed is the ratio of the duration to the response time

what an edge-triggered alert records
  that a transition happened : yes, exactly once, and that is the point
  the state after it         : not represented
  the duration               : not represented
  the depth                  : not represented

the answer is not to re-fire, which is the failure it was
designed away from; it is to carry the current state alongside
the transition, so the page ages instead of expiring

The rule paged on the crossing, once, on time, with 0 duplicates, 0 misses and
0 false pages, avoiding the 864 pages a level-triggered version would have
sent over 72 hours. Across those same 864 evaluations the free space fell a
further 11 points to 3 percent, and the number of signals emitted about
that decline was 0, because a threshold can only be crossed from above.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
