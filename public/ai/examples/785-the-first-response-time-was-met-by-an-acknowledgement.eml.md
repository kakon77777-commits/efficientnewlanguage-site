<!-- canonical: efficientnewlanguage.org/ai/examples/785-the-first-response-time-was-met-by-an-acknowledgement | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 785 — The first response time was met by an acknowledgement

`the_first_response_time_was_met_by_an_acknowledgement.eml` - Every ticket gets a first response within fifteen minutes, and the target has been met every month for fourteen months. What counts as a response is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every ticket gets
# a first response within fifteen minutes, and the target has been met every
# month for fourteen months. What counts as a response is computed below.
#
# The measurement is honest. The clock starts when the customer sends, not when
# the ticket is triaged; it runs in the customer's own time zone; tickets that
# arrive out of hours are measured against the out-of-hours target rather than
# excluded; and the number is computed from the message log rather than from a
# field anybody can edit.
#
# A response is a message on the ticket. An automatic acknowledgement is a
# message on the ticket.

24000 => tickets_a_month
15 => first_response_target_minutes
23640 => tickets_meeting_the_target
14 => months_the_target_has_been_met
21100 => tickets_whose_first_response_was_automatic
1 => median_minutes_to_the_acknowledgement
190 => median_minutes_to_a_person
24 => resolution_target_hours
17800 => tickets_meeting_the_resolution_target
0 => dashboards_showing_time_to_a_person

tickets_a_month - tickets_whose_first_response_was_automatic => tickets_a_person_answered_first
tickets_a_month - tickets_meeting_the_target => tickets_missing_the_target
median_minutes_to_a_person - first_response_target_minutes => minutes_past_the_target_a_person_takes
int(tickets_meeting_the_target * 10000 / tickets_a_month) => first_response_met_per_myriad
int(tickets_whose_first_response_was_automatic * 10000 / tickets_a_month) => answered_by_a_machine_per_myriad
int(tickets_meeting_the_resolution_target * 10000 / tickets_a_month) => resolution_met_per_myriad

"tickets a month                 : " + str(tickets_a_month) ^0
"first response target, minutes  : " + str(first_response_target_minutes) ^0
"  tickets meeting it            : " + str(tickets_meeting_the_target) ^0
"  missing it                    : " + str(tickets_missing_the_target) ^0
"  met                           : " + str(first_response_met_per_myriad) + " per ten thousand" ^0
"months the target has been met  : " + str(months_the_target_has_been_met) ^0
"" ^0
"first response was automatic    : " + str(tickets_whose_first_response_was_automatic) ^0
"  a person answered first       : " + str(tickets_a_person_answered_first) ^0
"  answered by a machine         : " + str(answered_by_a_machine_per_myriad) + " per ten thousand" ^0
"median minutes to the acknowledgement : " + str(median_minutes_to_the_acknowledgement) ^0
"median minutes to a person      : " + str(median_minutes_to_a_person) ^0
"  past the target by            : " + str(minutes_past_the_target_a_person_takes) + " minutes" ^0
"dashboards showing time to a person : " + str(dashboards_showing_time_to_a_person) ^0
"" ^0
"resolution target, hours        : " + str(resolution_target_hours) ^0
"  tickets meeting it            : " + str(tickets_meeting_the_resolution_target) ^0
"  met                           : " + str(resolution_met_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the first-response measurement" ^0
"  the clock starts : when the customer sends, not when" ^0
"    the ticket is triaged" ^0
"  the time zone : the customer's" ^0
"  out of hours : measured against the out-of-hours" ^0
"    target, not excluded" ^0
"  the source : the message log, not an editable field" ^0
"  months met : " + str(months_the_target_has_been_met) ^0
"  verdict : RESPONSIVE" ^0
"" ^0
"  computing it from the message log rather than a field" ^0
"  is the part almost nobody does, and it is why the " ^0
"  " + str(first_response_met_per_myriad) + " per ten thousand cannot be typed in" ^0
"" ^0

# ---- what satisfies the predicate ----

"what the target asks for" ^0
"  the predicate : a message on the ticket within " ^0
"    " + str(first_response_target_minutes) + " minutes" ^0
"  the cheapest thing that satisfies it : an automatic" ^0
"    acknowledgement, median " + str(median_minutes_to_the_acknowledgement) + " minute" ^0
"  tickets where that is what happened : " ^0
"    " + str(tickets_whose_first_response_was_automatic) ^0
"  median minutes until a person writes : " ^0
"    " + str(median_minutes_to_a_person) ^0
"  so the target is met by " + str(minutes_past_the_target_a_person_takes) + " minutes before" ^0
"    anybody reads the ticket" ^0
"" ^0
"  a predicate a machine can satisfy will be satisfied by" ^0
"  a machine, and that is not a failure of the machine" ^0
"" ^0

# ---- what the customer experiences ----

"a ticket that met the target" ^0
"  minute 1 : an acknowledgement, and the target is met" ^0
"  minute " + str(median_minutes_to_a_person) + " : a person, at the median" ^0
"  what the dashboard showed at minute 2 : green" ^0
"  what it showed at minute 100 : green" ^0
"  dashboards that would have shown otherwise : " ^0
"    " + str(dashboards_showing_time_to_a_person) ^0
"  resolution within " + str(resolution_target_hours) + " hours : " + str(resolution_met_per_myriad) + " per ten" ^0
"    thousand, which is the number nobody quotes" ^0
"" ^0

# ---- null control ----

# The same measurement, with the clock stopping at the first message written by
# a person rather than at the first message.
2900 => nc_tickets_meeting_fifteen_minutes_to_a_person
24000 => nc_tickets_measured
14 => nc_months_measured

"null control - stop the clock at the first person" ^0
"  tickets measured : " + str(nc_tickets_measured) + ", unchanged" ^0
"  months measured : " + str(nc_months_measured) + ", unchanged" ^0
"  meeting " + str(first_response_target_minutes) + " minutes to a person : " ^0
"    " + str(nc_tickets_meeting_fifteen_minutes_to_a_person) ^0
"  nobody answered any slower; the predicate stopped being" ^0
"  satisfiable without them" ^0
"" ^0

# ---- the rule ----

"what a met first-response target guarantees" ^0
"  every ticket received a message within " ^0
"    " + str(first_response_target_minutes) + " minutes : exactly, from the message log," ^0
"    in the customer's time zone, " + str(months_the_target_has_been_met) + " months" ^0
"  every customer heard from somebody : not addressed;" ^0
"    " + str(tickets_whose_first_response_was_automatic) + " of " + str(tickets_a_month) + " first responses were sent by a rule" ^0
"" ^0
"a target names a predicate, and a population under a" ^0
"target moves to the cheapest thing that satisfies it; what" ^0
"the predicate stood for is the quantity nothing now" ^0
"measures" ^0
"" ^0

"The clock starts when the customer sends, runs in their time zone, includes" ^0
"out-of-hours tickets and is computed from the message log - " + str(first_response_met_per_myriad) + " per ten thousand" ^0
"met, " + str(months_the_target_has_been_met) + " months running. A message satisfies it, so " + str(tickets_whose_first_response_was_automatic) + " of " + str(tickets_a_month) + " were answered" ^0
"first by a rule at " + str(median_minutes_to_the_acknowledgement) + " minute while a person takes " + str(median_minutes_to_a_person) + " - " + str(minutes_past_the_target_a_person_takes) + " minutes past" ^0
"the target - across " + str(dashboards_showing_time_to_a_person) + " dashboards that show it." ^0
```

## Python (deterministic transpilation)

```python
tickets_a_month = 24000
first_response_target_minutes = 15
tickets_meeting_the_target = 23640
months_the_target_has_been_met = 14
tickets_whose_first_response_was_automatic = 21100
median_minutes_to_the_acknowledgement = 1
median_minutes_to_a_person = 190
resolution_target_hours = 24
tickets_meeting_the_resolution_target = 17800
dashboards_showing_time_to_a_person = 0
tickets_a_person_answered_first = tickets_a_month - tickets_whose_first_response_was_automatic
tickets_missing_the_target = tickets_a_month - tickets_meeting_the_target
minutes_past_the_target_a_person_takes = median_minutes_to_a_person - first_response_target_minutes
first_response_met_per_myriad = int(tickets_meeting_the_target * 10000 / tickets_a_month)
answered_by_a_machine_per_myriad = int(tickets_whose_first_response_was_automatic * 10000 / tickets_a_month)
resolution_met_per_myriad = int(tickets_meeting_the_resolution_target * 10000 / tickets_a_month)
print("tickets a month                 : " + str(tickets_a_month))
print("first response target, minutes  : " + str(first_response_target_minutes))
print("  tickets meeting it            : " + str(tickets_meeting_the_target))
print("  missing it                    : " + str(tickets_missing_the_target))
print("  met                           : " + str(first_response_met_per_myriad) + " per ten thousand")
print("months the target has been met  : " + str(months_the_target_has_been_met))
print("")
print("first response was automatic    : " + str(tickets_whose_first_response_was_automatic))
print("  a person answered first       : " + str(tickets_a_person_answered_first))
print("  answered by a machine         : " + str(answered_by_a_machine_per_myriad) + " per ten thousand")
print("median minutes to the acknowledgement : " + str(median_minutes_to_the_acknowledgement))
print("median minutes to a person      : " + str(median_minutes_to_a_person))
print("  past the target by            : " + str(minutes_past_the_target_a_person_takes) + " minutes")
print("dashboards showing time to a person : " + str(dashboards_showing_time_to_a_person))
print("")
print("resolution target, hours        : " + str(resolution_target_hours))
print("  tickets meeting it            : " + str(tickets_meeting_the_resolution_target))
print("  met                           : " + str(resolution_met_per_myriad) + " per ten thousand")
print("")
print("the first-response measurement")
print("  the clock starts : when the customer sends, not when")
print("    the ticket is triaged")
print("  the time zone : the customer's")
print("  out of hours : measured against the out-of-hours")
print("    target, not excluded")
print("  the source : the message log, not an editable field")
print("  months met : " + str(months_the_target_has_been_met))
print("  verdict : RESPONSIVE")
print("")
print("  computing it from the message log rather than a field")
print("  is the part almost nobody does, and it is why the ")
print("  " + str(first_response_met_per_myriad) + " per ten thousand cannot be typed in")
print("")
print("what the target asks for")
print("  the predicate : a message on the ticket within ")
print("    " + str(first_response_target_minutes) + " minutes")
print("  the cheapest thing that satisfies it : an automatic")
print("    acknowledgement, median " + str(median_minutes_to_the_acknowledgement) + " minute")
print("  tickets where that is what happened : ")
print("    " + str(tickets_whose_first_response_was_automatic))
print("  median minutes until a person writes : ")
print("    " + str(median_minutes_to_a_person))
print("  so the target is met by " + str(minutes_past_the_target_a_person_takes) + " minutes before")
print("    anybody reads the ticket")
print("")
print("  a predicate a machine can satisfy will be satisfied by")
print("  a machine, and that is not a failure of the machine")
print("")
print("a ticket that met the target")
print("  minute 1 : an acknowledgement, and the target is met")
print("  minute " + str(median_minutes_to_a_person) + " : a person, at the median")
print("  what the dashboard showed at minute 2 : green")
print("  what it showed at minute 100 : green")
print("  dashboards that would have shown otherwise : ")
print("    " + str(dashboards_showing_time_to_a_person))
print("  resolution within " + str(resolution_target_hours) + " hours : " + str(resolution_met_per_myriad) + " per ten")
print("    thousand, which is the number nobody quotes")
print("")
nc_tickets_meeting_fifteen_minutes_to_a_person = 2900
nc_tickets_measured = 24000
nc_months_measured = 14
print("null control - stop the clock at the first person")
print("  tickets measured : " + str(nc_tickets_measured) + ", unchanged")
print("  months measured : " + str(nc_months_measured) + ", unchanged")
print("  meeting " + str(first_response_target_minutes) + " minutes to a person : ")
print("    " + str(nc_tickets_meeting_fifteen_minutes_to_a_person))
print("  nobody answered any slower; the predicate stopped being")
print("  satisfiable without them")
print("")
print("what a met first-response target guarantees")
print("  every ticket received a message within ")
print("    " + str(first_response_target_minutes) + " minutes : exactly, from the message log,")
print("    in the customer's time zone, " + str(months_the_target_has_been_met) + " months")
print("  every customer heard from somebody : not addressed;")
print("    " + str(tickets_whose_first_response_was_automatic) + " of " + str(tickets_a_month) + " first responses were sent by a rule")
print("")
print("a target names a predicate, and a population under a")
print("target moves to the cheapest thing that satisfies it; what")
print("the predicate stood for is the quantity nothing now")
print("measures")
print("")
print("The clock starts when the customer sends, runs in their time zone, includes")
print("out-of-hours tickets and is computed from the message log - " + str(first_response_met_per_myriad) + " per ten thousand")
print("met, " + str(months_the_target_has_been_met) + " months running. A message satisfies it, so " + str(tickets_whose_first_response_was_automatic) + " of " + str(tickets_a_month) + " were answered")
print("first by a rule at " + str(median_minutes_to_the_acknowledgement) + " minute while a person takes " + str(median_minutes_to_a_person) + " - " + str(minutes_past_the_target_a_person_takes) + " minutes past")
print("the target - across " + str(dashboards_showing_time_to_a_person) + " dashboards that show it.")
```

## stdout (executed)

```text
tickets a month                 : 24000
first response target, minutes  : 15
  tickets meeting it            : 23640
  missing it                    : 360
  met                           : 9850 per ten thousand
months the target has been met  : 14

first response was automatic    : 21100
  a person answered first       : 2900
  answered by a machine         : 8791 per ten thousand
median minutes to the acknowledgement : 1
median minutes to a person      : 190
  past the target by            : 175 minutes
dashboards showing time to a person : 0

resolution target, hours        : 24
  tickets meeting it            : 17800
  met                           : 7416 per ten thousand

the first-response measurement
  the clock starts : when the customer sends, not when
    the ticket is triaged
  the time zone : the customer's
  out of hours : measured against the out-of-hours
    target, not excluded
  the source : the message log, not an editable field
  months met : 14
  verdict : RESPONSIVE

  computing it from the message log rather than a field
  is the part almost nobody does, and it is why the 
  9850 per ten thousand cannot be typed in

what the target asks for
  the predicate : a message on the ticket within 
    15 minutes
  the cheapest thing that satisfies it : an automatic
    acknowledgement, median 1 minute
  tickets where that is what happened : 
    21100
  median minutes until a person writes : 
    190
  so the target is met by 175 minutes before
    anybody reads the ticket

  a predicate a machine can satisfy will be satisfied by
  a machine, and that is not a failure of the machine

a ticket that met the target
  minute 1 : an acknowledgement, and the target is met
  minute 190 : a person, at the median
  what the dashboard showed at minute 2 : green
  what it showed at minute 100 : green
  dashboards that would have shown otherwise : 
    0
  resolution within 24 hours : 7416 per ten
    thousand, which is the number nobody quotes

null control - stop the clock at the first person
  tickets measured : 24000, unchanged
  months measured : 14, unchanged
  meeting 15 minutes to a person : 
    2900
  nobody answered any slower; the predicate stopped being
  satisfiable without them

what a met first-response target guarantees
  every ticket received a message within 
    15 minutes : exactly, from the message log,
    in the customer's time zone, 14 months
  every customer heard from somebody : not addressed;
    21100 of 24000 first responses were sent by a rule

a target names a predicate, and a population under a
target moves to the cheapest thing that satisfies it; what
the predicate stood for is the quantity nothing now
measures

The clock starts when the customer sends, runs in their time zone, includes
out-of-hours tickets and is computed from the message log - 9850 per ten thousand
met, 14 months running. A message satisfies it, so 21100 of 24000 were answered
first by a rule at 1 minute while a person takes 190 - 175 minutes past
the target - across 0 dashboards that show it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
