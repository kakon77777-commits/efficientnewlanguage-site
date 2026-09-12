<!-- canonical: efficientnewlanguage.org/ai/examples/809-the-day-boundary-was-the-servers-and-the-user-was-elsewhere | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 809 — The day boundary was the servers and the user was elsewhere

`the_day_boundary_was_the_servers_and_the_user_was_elsewhere.eml` - The daily active count is computed correctly every day, and no event is counted twice. What defines the day it lands in is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The daily active
# count is computed correctly every day, and no event is counted twice. What
# defines the day it lands in is computed below.
#
# The counting is careful. Each event is counted once; the boundaries are exactly
# 24 hours apart; the query is inclusive at the start and exclusive at the end,
# so no event falls in two days or none; and the total across days equals the
# total events.
#
# The day boundary is the server's midnight, and the users are nine hours ahead.

48000 => events_counted_today_server
5200 => late_evening_events_in_the_users_next_day
9 => hours_the_users_are_ahead
0 => events_double_counted

events_counted_today_server - late_evening_events_in_the_users_next_day => events_that_are_truly_today_for_the_user
events_that_are_truly_today_for_the_user + late_evening_events_in_the_users_next_day => events_total_unchanged
int(late_evening_events_in_the_users_next_day * 10000 / events_counted_today_server) => misassigned_per_myriad

"events counted today (server)   : " + str(events_counted_today_server) ^0
"  double counted                : " + str(events_double_counted) ^0
"users' hours ahead              : " + str(hours_the_users_are_ahead) ^0
"" ^0
"of today's count, truly the user's today : " + str(events_that_are_truly_today_for_the_user) ^0
"in the user's next day already  : " + str(late_evening_events_in_the_users_next_day) ^0
"  misassigned                   : " + str(misassigned_per_myriad) + " per ten thousand" ^0
"total events (either framing)   : " + str(events_total_unchanged) ^0
"" ^0

# ---- what the counting verified ----

"the daily count" ^0
"  each event : counted once" ^0
"  boundaries : exactly 24 hours apart" ^0
"  the window : inclusive start, exclusive end" ^0
"  total across days : equals total events" ^0
"  events double counted or dropped : " + str(events_double_counted) ^0
"  verdict : COUNTED CLEANLY" ^0
"" ^0
"  an inclusive-start exclusive-end window is the part" ^0
"  done right here, and it is why no event lands in two" ^0
"  days or in none" ^0
"" ^0

# ---- what defines the day ----

"the boundary the count uses" ^0
"  which midnight : the server's" ^0
"  where the users are : nine hours ahead" ^0
"  so a user's late evening : is already the next day for" ^0
"    them while it is still today on the server" ^0
"  events in that window : " + str(late_evening_events_in_the_users_next_day) ^0
"  what moved them : not a miscount, a different midnight" ^0
"" ^0

# ---- what a per-user report shows ----

"the day as the user lived it" ^0
"  events the server calls today : " + str(events_counted_today_server) ^0
"  events the user calls today : " ^0
"    " + str(events_that_are_truly_today_for_the_user) ^0
"  the difference : " + str(late_evening_events_in_the_users_next_day) + ", pushed a day forward" ^0
"  is any event lost : no; the total is the same either" ^0
"    way" ^0
"  is any event in the right day : only if the user keeps" ^0
"    the server's clock" ^0
"" ^0

# ---- null control ----

# The same events, bucketed by each user's local midnight rather than the
# server's.
48000 => nc_server_framed_today
42800 => nc_user_framed_today
5200 => nc_events_that_move_days

"null control - bucket by the user's local midnight" ^0
"  server-framed today : " + str(nc_server_framed_today) + ", unchanged in size" ^0
"  user-framed today : " + str(nc_user_framed_today) ^0
"  events that move to another day : " + str(nc_events_that_move_days) ^0
"  no event was added or dropped; the boundary moved from" ^0
"  the server's clock to the user's" ^0
"" ^0

# ---- the rule ----

"what a clean daily count guarantees" ^0
"  each event is counted once in exactly one day : exactly," ^0
"    24-hour boundaries, half-open window, totals reconcile" ^0
"  each event is in the day it happened : not addressed;" ^0
"    the boundary is server midnight and the users are nine" ^0
"    hours ahead, so " + str(late_evening_events_in_the_users_next_day) + " of their late-evening events land" ^0
"    in the next server day" ^0
"" ^0

"a count is clean when its buckets partition the events, and a day is a bucket" ^0
"defined by a midnight; whose midnight is a choice, and the wrong one puts an" ^0
"event in a real bucket that is not its own" ^0
"" ^0

"Each event is counted once in a half-open 24-hour window, totals reconcile - no" ^0
"miscount. The boundary is the server's midnight and the users are " + str(hours_the_users_are_ahead) + " hours" ^0
"ahead, so " + str(late_evening_events_in_the_users_next_day) + " late-evening events sit in the wrong calendar day, " ^0
"" + str(misassigned_per_myriad) + " per ten thousand, with " + str(events_double_counted) + " actually lost." ^0
```

## Python (deterministic transpilation)

```python
events_counted_today_server = 48000
late_evening_events_in_the_users_next_day = 5200
hours_the_users_are_ahead = 9
events_double_counted = 0
events_that_are_truly_today_for_the_user = events_counted_today_server - late_evening_events_in_the_users_next_day
events_total_unchanged = events_that_are_truly_today_for_the_user + late_evening_events_in_the_users_next_day
misassigned_per_myriad = int(late_evening_events_in_the_users_next_day * 10000 / events_counted_today_server)
print("events counted today (server)   : " + str(events_counted_today_server))
print("  double counted                : " + str(events_double_counted))
print("users' hours ahead              : " + str(hours_the_users_are_ahead))
print("")
print("of today's count, truly the user's today : " + str(events_that_are_truly_today_for_the_user))
print("in the user's next day already  : " + str(late_evening_events_in_the_users_next_day))
print("  misassigned                   : " + str(misassigned_per_myriad) + " per ten thousand")
print("total events (either framing)   : " + str(events_total_unchanged))
print("")
print("the daily count")
print("  each event : counted once")
print("  boundaries : exactly 24 hours apart")
print("  the window : inclusive start, exclusive end")
print("  total across days : equals total events")
print("  events double counted or dropped : " + str(events_double_counted))
print("  verdict : COUNTED CLEANLY")
print("")
print("  an inclusive-start exclusive-end window is the part")
print("  done right here, and it is why no event lands in two")
print("  days or in none")
print("")
print("the boundary the count uses")
print("  which midnight : the server's")
print("  where the users are : nine hours ahead")
print("  so a user's late evening : is already the next day for")
print("    them while it is still today on the server")
print("  events in that window : " + str(late_evening_events_in_the_users_next_day))
print("  what moved them : not a miscount, a different midnight")
print("")
print("the day as the user lived it")
print("  events the server calls today : " + str(events_counted_today_server))
print("  events the user calls today : ")
print("    " + str(events_that_are_truly_today_for_the_user))
print("  the difference : " + str(late_evening_events_in_the_users_next_day) + ", pushed a day forward")
print("  is any event lost : no; the total is the same either")
print("    way")
print("  is any event in the right day : only if the user keeps")
print("    the server's clock")
print("")
nc_server_framed_today = 48000
nc_user_framed_today = 42800
nc_events_that_move_days = 5200
print("null control - bucket by the user's local midnight")
print("  server-framed today : " + str(nc_server_framed_today) + ", unchanged in size")
print("  user-framed today : " + str(nc_user_framed_today))
print("  events that move to another day : " + str(nc_events_that_move_days))
print("  no event was added or dropped; the boundary moved from")
print("  the server's clock to the user's")
print("")
print("what a clean daily count guarantees")
print("  each event is counted once in exactly one day : exactly,")
print("    24-hour boundaries, half-open window, totals reconcile")
print("  each event is in the day it happened : not addressed;")
print("    the boundary is server midnight and the users are nine")
print("    hours ahead, so " + str(late_evening_events_in_the_users_next_day) + " of their late-evening events land")
print("    in the next server day")
print("")
print("a count is clean when its buckets partition the events, and a day is a bucket")
print("defined by a midnight; whose midnight is a choice, and the wrong one puts an")
print("event in a real bucket that is not its own")
print("")
print("Each event is counted once in a half-open 24-hour window, totals reconcile - no")
print("miscount. The boundary is the server's midnight and the users are " + str(hours_the_users_are_ahead) + " hours")
print("ahead, so " + str(late_evening_events_in_the_users_next_day) + " late-evening events sit in the wrong calendar day, ")
print("" + str(misassigned_per_myriad) + " per ten thousand, with " + str(events_double_counted) + " actually lost.")
```

## stdout (executed)

```text
events counted today (server)   : 48000
  double counted                : 0
users' hours ahead              : 9

of today's count, truly the user's today : 42800
in the user's next day already  : 5200
  misassigned                   : 1083 per ten thousand
total events (either framing)   : 48000

the daily count
  each event : counted once
  boundaries : exactly 24 hours apart
  the window : inclusive start, exclusive end
  total across days : equals total events
  events double counted or dropped : 0
  verdict : COUNTED CLEANLY

  an inclusive-start exclusive-end window is the part
  done right here, and it is why no event lands in two
  days or in none

the boundary the count uses
  which midnight : the server's
  where the users are : nine hours ahead
  so a user's late evening : is already the next day for
    them while it is still today on the server
  events in that window : 5200
  what moved them : not a miscount, a different midnight

the day as the user lived it
  events the server calls today : 48000
  events the user calls today : 
    42800
  the difference : 5200, pushed a day forward
  is any event lost : no; the total is the same either
    way
  is any event in the right day : only if the user keeps
    the server's clock

null control - bucket by the user's local midnight
  server-framed today : 48000, unchanged in size
  user-framed today : 42800
  events that move to another day : 5200
  no event was added or dropped; the boundary moved from
  the server's clock to the user's

what a clean daily count guarantees
  each event is counted once in exactly one day : exactly,
    24-hour boundaries, half-open window, totals reconcile
  each event is in the day it happened : not addressed;
    the boundary is server midnight and the users are nine
    hours ahead, so 5200 of their late-evening events land
    in the next server day

a count is clean when its buckets partition the events, and a day is a bucket
defined by a midnight; whose midnight is a choice, and the wrong one puts an
event in a real bucket that is not its own

Each event is counted once in a half-open 24-hour window, totals reconcile - no
miscount. The boundary is the server's midnight and the users are 9 hours
ahead, so 5200 late-evening events sit in the wrong calendar day, 
1083 per ten thousand, with 0 actually lost.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
