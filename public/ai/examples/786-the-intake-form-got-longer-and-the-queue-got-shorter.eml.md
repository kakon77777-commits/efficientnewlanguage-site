<!-- canonical: efficientnewlanguage.org/ai/examples/786-the-intake-form-got-longer-and-the-queue-got-shorter | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 786 — The intake form got longer and the queue got shorter

`the_intake_form_got_longer_and_the_queue_got_shorter.eml` - The platform team rewrote its request form to capture what it actually needed, and the queue wait fell from twenty-one days to five. What else changed is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The platform team
# rewrote its request form to capture what it actually needed, and the queue
# wait fell from twenty-one days to five. What else changed is computed below.
#
# The rewrite was sound. Every field was added because a real request had
# stalled for want of it; the form validates as you type rather than rejecting
# at the end; the fields are grouped so a requester can see what is left; and
# the wait is measured from submission to first action, on the platform team's
# own tracker, not estimated.
#
# The queue is the requests that were submitted.

3400 => requests_a_month_before
1250 => requests_a_month_now
6 => fields_on_the_form_before
23 => fields_on_the_form_now
2 => median_minutes_to_submit_before
19 => median_minutes_to_submit_now
21 => queue_wait_days_before
5 => queue_wait_days_now
8 => months_since_the_change
1900 => submissions_abandoned_part_way_a_month
74 => tools_found_in_the_last_estate_audit_that_nobody_requested

requests_a_month_before - requests_a_month_now => requests_a_month_that_stopped_arriving
fields_on_the_form_now - fields_on_the_form_before => fields_added
median_minutes_to_submit_now - median_minutes_to_submit_before => minutes_added_to_asking
queue_wait_days_before - queue_wait_days_now => days_taken_off_the_wait
# Both sides are form journeys: one finished, one did not. Naming the completed
# ones 'requests' hid that, so the alias says it.
requests_a_month_now => submissions_completed_a_month
submissions_abandoned_part_way_a_month - submissions_completed_a_month => abandonments_beyond_completions
int(requests_a_month_now * 10000 / requests_a_month_before) => volume_remaining_per_myriad
int(queue_wait_days_now * 10000 / queue_wait_days_before) => wait_remaining_per_myriad

"requests a month, before        : " + str(requests_a_month_before) ^0
"requests a month, now           : " + str(requests_a_month_now) ^0
"  that stopped arriving         : " + str(requests_a_month_that_stopped_arriving) ^0
"  volume remaining              : " + str(volume_remaining_per_myriad) + " per ten thousand" ^0
"months since the change         : " + str(months_since_the_change) ^0
"" ^0
"fields on the form, before      : " + str(fields_on_the_form_before) ^0
"fields on the form, now         : " + str(fields_on_the_form_now) ^0
"  added                         : " + str(fields_added) ^0
"median minutes to submit, before: " + str(median_minutes_to_submit_before) ^0
"median minutes to submit, now   : " + str(median_minutes_to_submit_now) ^0
"  added to asking               : " + str(minutes_added_to_asking) ^0
"" ^0
"queue wait, days, before        : " + str(queue_wait_days_before) ^0
"queue wait, days, now           : " + str(queue_wait_days_now) ^0
"  taken off the wait            : " + str(days_taken_off_the_wait) ^0
"  wait remaining                : " + str(wait_remaining_per_myriad) + " per ten thousand" ^0
"" ^0
"submissions abandoned part way  : " + str(submissions_abandoned_part_way_a_month) ^0
"  beyond completed submissions  : " + str(abandonments_beyond_completions) ^0
"unrequested tools in the estate : " + str(tools_found_in_the_last_estate_audit_that_nobody_requested) ^0
"" ^0

# ---- what the rewrite verified ----

"the new intake form" ^0
"  every field : added because a real request stalled for" ^0
"    want of it, not because somebody wanted a report" ^0
"  validation : as you type, not a rejection at the end" ^0
"  the fields : grouped, so a requester can see what is" ^0
"    left" ^0
"  the wait : measured submission to first action, on the" ^0
"    team's own tracker" ^0
"  days off the wait : " + str(days_taken_off_the_wait) ^0
"  verdict : FASTER" ^0
"" ^0
"  justifying each field from a stalled request is the" ^0
"  part almost nobody does, and it is why the form asks" ^0
"  for nothing decorative" ^0
"" ^0

# ---- which population the queue is ----

"what the wait is measured over" ^0
"  the population : requests that were submitted" ^0
"  what submitting now costs : " + str(median_minutes_to_submit_now) + " minutes, up " ^0
"    " + str(minutes_added_to_asking) ^0
"  requests a month that stopped arriving : " ^0
"    " + str(requests_a_month_that_stopped_arriving) ^0
"  submissions abandoned part way : " ^0
"    " + str(submissions_abandoned_part_way_a_month) + " a month" ^0
"  which is more than the completed ones by : " ^0
"    " + str(abandonments_beyond_completions) ^0
"" ^0
"  a queue got shorter and so did the line of people" ^0
"  willing to join it; the wait cannot tell those apart" ^0
"" ^0

# ---- where the demand went ----

"the work that stopped being requested" ^0
"  did the need go away : nothing here says so" ^0
"  tools found in the estate that nobody requested : " ^0
"    " + str(tools_found_in_the_last_estate_audit_that_nobody_requested) ^0
"  who supports those : whoever installed them" ^0
"  do they appear in the queue : no" ^0
"  do they appear in the wait : no" ^0
"  what the platform team sees of them : the audit, once" ^0
"    a year" ^0
"" ^0

# ---- null control ----

# The same form, with a two-field express path that a requester may use, and the
# rest of the fields asked afterwards by the person who picks the work up.
3300 => nc_requests_a_month
7 => nc_queue_wait_days
120 => nc_submissions_abandoned_part_way_a_month

"null control - two fields to ask, the rest asked later" ^0
"  requests a month : " + str(nc_requests_a_month) ^0
"  submissions abandoned part way : " ^0
"    " + str(nc_submissions_abandoned_part_way_a_month) ^0
"  queue wait, days : " + str(nc_queue_wait_days) ^0
"  the team did not get slower; the requests that had" ^0
"  stopped being made came back and joined the queue" ^0
"" ^0

# ---- the rule ----

"what a shorter queue guarantees" ^0
"  a submitted request is picked up in " + str(queue_wait_days_now) + " days :" ^0
"    exactly, measured to first action on the team's own" ^0
"    tracker, " + str(months_since_the_change) + " months" ^0
"  the organisation waits less for what it needs : not" ^0
"    addressed; " + str(requests_a_month_that_stopped_arriving) + " requests a month stopped being made" ^0
"    and " + str(submissions_abandoned_part_way_a_month) + " a month are abandoned mid-form" ^0
"" ^0
"raising the cost of joining a queue shortens it; the" ^0
"measurement is over the people who paid, and the people" ^0
"who did not are not slow, they are absent" ^0
"" ^0

"Every field was justified by a stalled request, validation is live, and the" ^0
"wait fell " + str(days_taken_off_the_wait) + " days to " + str(queue_wait_days_now) + " on the team's own tracker. Asking now costs " ^0
"" + str(median_minutes_to_submit_now) + " minutes instead of " + str(median_minutes_to_submit_before) + ", so volume fell to " + str(volume_remaining_per_myriad) + " per ten thousand of" ^0
"what it was, " + str(submissions_abandoned_part_way_a_month) + " submissions a month are abandoned part way - " + str(abandonments_beyond_completions) + " more than" ^0
"are completed - and the last audit found " + str(tools_found_in_the_last_estate_audit_that_nobody_requested) + " tools nobody asked for." ^0
```

## Python (deterministic transpilation)

```python
requests_a_month_before = 3400
requests_a_month_now = 1250
fields_on_the_form_before = 6
fields_on_the_form_now = 23
median_minutes_to_submit_before = 2
median_minutes_to_submit_now = 19
queue_wait_days_before = 21
queue_wait_days_now = 5
months_since_the_change = 8
submissions_abandoned_part_way_a_month = 1900
tools_found_in_the_last_estate_audit_that_nobody_requested = 74
requests_a_month_that_stopped_arriving = requests_a_month_before - requests_a_month_now
fields_added = fields_on_the_form_now - fields_on_the_form_before
minutes_added_to_asking = median_minutes_to_submit_now - median_minutes_to_submit_before
days_taken_off_the_wait = queue_wait_days_before - queue_wait_days_now
submissions_completed_a_month = requests_a_month_now
abandonments_beyond_completions = submissions_abandoned_part_way_a_month - submissions_completed_a_month
volume_remaining_per_myriad = int(requests_a_month_now * 10000 / requests_a_month_before)
wait_remaining_per_myriad = int(queue_wait_days_now * 10000 / queue_wait_days_before)
print("requests a month, before        : " + str(requests_a_month_before))
print("requests a month, now           : " + str(requests_a_month_now))
print("  that stopped arriving         : " + str(requests_a_month_that_stopped_arriving))
print("  volume remaining              : " + str(volume_remaining_per_myriad) + " per ten thousand")
print("months since the change         : " + str(months_since_the_change))
print("")
print("fields on the form, before      : " + str(fields_on_the_form_before))
print("fields on the form, now         : " + str(fields_on_the_form_now))
print("  added                         : " + str(fields_added))
print("median minutes to submit, before: " + str(median_minutes_to_submit_before))
print("median minutes to submit, now   : " + str(median_minutes_to_submit_now))
print("  added to asking               : " + str(minutes_added_to_asking))
print("")
print("queue wait, days, before        : " + str(queue_wait_days_before))
print("queue wait, days, now           : " + str(queue_wait_days_now))
print("  taken off the wait            : " + str(days_taken_off_the_wait))
print("  wait remaining                : " + str(wait_remaining_per_myriad) + " per ten thousand")
print("")
print("submissions abandoned part way  : " + str(submissions_abandoned_part_way_a_month))
print("  beyond completed submissions  : " + str(abandonments_beyond_completions))
print("unrequested tools in the estate : " + str(tools_found_in_the_last_estate_audit_that_nobody_requested))
print("")
print("the new intake form")
print("  every field : added because a real request stalled for")
print("    want of it, not because somebody wanted a report")
print("  validation : as you type, not a rejection at the end")
print("  the fields : grouped, so a requester can see what is")
print("    left")
print("  the wait : measured submission to first action, on the")
print("    team's own tracker")
print("  days off the wait : " + str(days_taken_off_the_wait))
print("  verdict : FASTER")
print("")
print("  justifying each field from a stalled request is the")
print("  part almost nobody does, and it is why the form asks")
print("  for nothing decorative")
print("")
print("what the wait is measured over")
print("  the population : requests that were submitted")
print("  what submitting now costs : " + str(median_minutes_to_submit_now) + " minutes, up ")
print("    " + str(minutes_added_to_asking))
print("  requests a month that stopped arriving : ")
print("    " + str(requests_a_month_that_stopped_arriving))
print("  submissions abandoned part way : ")
print("    " + str(submissions_abandoned_part_way_a_month) + " a month")
print("  which is more than the completed ones by : ")
print("    " + str(abandonments_beyond_completions))
print("")
print("  a queue got shorter and so did the line of people")
print("  willing to join it; the wait cannot tell those apart")
print("")
print("the work that stopped being requested")
print("  did the need go away : nothing here says so")
print("  tools found in the estate that nobody requested : ")
print("    " + str(tools_found_in_the_last_estate_audit_that_nobody_requested))
print("  who supports those : whoever installed them")
print("  do they appear in the queue : no")
print("  do they appear in the wait : no")
print("  what the platform team sees of them : the audit, once")
print("    a year")
print("")
nc_requests_a_month = 3300
nc_queue_wait_days = 7
nc_submissions_abandoned_part_way_a_month = 120
print("null control - two fields to ask, the rest asked later")
print("  requests a month : " + str(nc_requests_a_month))
print("  submissions abandoned part way : ")
print("    " + str(nc_submissions_abandoned_part_way_a_month))
print("  queue wait, days : " + str(nc_queue_wait_days))
print("  the team did not get slower; the requests that had")
print("  stopped being made came back and joined the queue")
print("")
print("what a shorter queue guarantees")
print("  a submitted request is picked up in " + str(queue_wait_days_now) + " days :")
print("    exactly, measured to first action on the team's own")
print("    tracker, " + str(months_since_the_change) + " months")
print("  the organisation waits less for what it needs : not")
print("    addressed; " + str(requests_a_month_that_stopped_arriving) + " requests a month stopped being made")
print("    and " + str(submissions_abandoned_part_way_a_month) + " a month are abandoned mid-form")
print("")
print("raising the cost of joining a queue shortens it; the")
print("measurement is over the people who paid, and the people")
print("who did not are not slow, they are absent")
print("")
print("Every field was justified by a stalled request, validation is live, and the")
print("wait fell " + str(days_taken_off_the_wait) + " days to " + str(queue_wait_days_now) + " on the team's own tracker. Asking now costs ")
print("" + str(median_minutes_to_submit_now) + " minutes instead of " + str(median_minutes_to_submit_before) + ", so volume fell to " + str(volume_remaining_per_myriad) + " per ten thousand of")
print("what it was, " + str(submissions_abandoned_part_way_a_month) + " submissions a month are abandoned part way - " + str(abandonments_beyond_completions) + " more than")
print("are completed - and the last audit found " + str(tools_found_in_the_last_estate_audit_that_nobody_requested) + " tools nobody asked for.")
```

## stdout (executed)

```text
requests a month, before        : 3400
requests a month, now           : 1250
  that stopped arriving         : 2150
  volume remaining              : 3676 per ten thousand
months since the change         : 8

fields on the form, before      : 6
fields on the form, now         : 23
  added                         : 17
median minutes to submit, before: 2
median minutes to submit, now   : 19
  added to asking               : 17

queue wait, days, before        : 21
queue wait, days, now           : 5
  taken off the wait            : 16
  wait remaining                : 2380 per ten thousand

submissions abandoned part way  : 1900
  beyond completed submissions  : 650
unrequested tools in the estate : 74

the new intake form
  every field : added because a real request stalled for
    want of it, not because somebody wanted a report
  validation : as you type, not a rejection at the end
  the fields : grouped, so a requester can see what is
    left
  the wait : measured submission to first action, on the
    team's own tracker
  days off the wait : 16
  verdict : FASTER

  justifying each field from a stalled request is the
  part almost nobody does, and it is why the form asks
  for nothing decorative

what the wait is measured over
  the population : requests that were submitted
  what submitting now costs : 19 minutes, up 
    17
  requests a month that stopped arriving : 
    2150
  submissions abandoned part way : 
    1900 a month
  which is more than the completed ones by : 
    650

  a queue got shorter and so did the line of people
  willing to join it; the wait cannot tell those apart

the work that stopped being requested
  did the need go away : nothing here says so
  tools found in the estate that nobody requested : 
    74
  who supports those : whoever installed them
  do they appear in the queue : no
  do they appear in the wait : no
  what the platform team sees of them : the audit, once
    a year

null control - two fields to ask, the rest asked later
  requests a month : 3300
  submissions abandoned part way : 
    120
  queue wait, days : 7
  the team did not get slower; the requests that had
  stopped being made came back and joined the queue

what a shorter queue guarantees
  a submitted request is picked up in 5 days :
    exactly, measured to first action on the team's own
    tracker, 8 months
  the organisation waits less for what it needs : not
    addressed; 2150 requests a month stopped being made
    and 1900 a month are abandoned mid-form

raising the cost of joining a queue shortens it; the
measurement is over the people who paid, and the people
who did not are not slow, they are absent

Every field was justified by a stalled request, validation is live, and the
wait fell 16 days to 5 on the team's own tracker. Asking now costs 
19 minutes instead of 2, so volume fell to 3676 per ten thousand of
what it was, 1900 submissions a month are abandoned part way - 650 more than
are completed - and the last audit found 74 tools nobody asked for.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
