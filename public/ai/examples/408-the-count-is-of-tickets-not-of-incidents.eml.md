<!-- canonical: efficientnewlanguage.org/ai/examples/408-the-count-is-of-tickets-not-of-incidents | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 408 — The count is of tickets, not of incidents - reports fell 54% and events did not move

`the_count_is_of_tickets_not_of_incidents.eml` builds both quarters from the same underlying events so the two counts can be separated.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Reports fell. The
# thing being reported did not move. Both figures are computed below rather
# than stated here - a number written into a comment is checked by nothing.
#
# Counting tickets is the only thing a ticket system can do, and it is the
# right count for the questions the ticket system was built for: how much
# support load, how many things are open, who is assigned what. Every ticket is
# real and every one was filed by someone who hit something.
#
# The number of tickets an event produces depends on how many people notice it
# and whether they check for an existing one first. Adding a search box before
# the file button changes that ratio and nothing else.
#
# Both quarters are built from the same underlying events here, so the two
# counts can be separated.

# [event, tickets it produced in Q1, tickets in Q2 after the search box]
[["e1", 4, 1], ["e2", 3, 1], ["e3", 2, 1], ["e4", 5, 2], ["e5", 1, 1], ["e6", 3, 2], ["e7", 2, 1], ["e8", 4, 2]] => events

def tickets(q):
    0 => t
    for e in events:
        if q == 1:
            t + e[1] => t
        else:
            t + e[2] => t
    return t

def event_count():
    return len(events)

"underlying events : " + str(event_count()) + " in both quarters" ^0
"" ^0

"tickets" ^0
"  Q1 : " + str(tickets(1)) ^0
"  Q2 : " + str(tickets(2)) ^0
"  change : " + str(int((tickets(1) - tickets(2)) * 100 / tickets(1))) + "% fewer" ^0
"" ^0

"events" ^0
"  Q1 : " + str(event_count()) ^0
"  Q2 : " + str(event_count()) ^0
"  change : 0%" ^0
"" ^0

"tickets per event" ^0
"  Q1 : " + str(int(tickets(1) * 10 / event_count())) ^0
"  Q2 : " + str(int(tickets(2) * 10 / event_count())) ^0
"  (in tenths)" ^0
"" ^0

# ---- what moved, per event ----

"per event" ^0
for e in events:
    "  " + e[0] + " : " + str(e[1]) + " -> " + str(e[2]) ^0
0 => still_reported
for e in events:
    if e[2] > 0:
        still_reported + 1 => still_reported
"  events that still produced at least one ticket : " + str(still_reported) + " of " + str(event_count()) ^0
if still_reported == event_count():
    "  every event is still visible - nothing was hidden, only deduplicated" ^0
"" ^0

# ---- the two readings ----

"the two readings of the same drop" ^0
"  'we fixed " + str(int((tickets(1) - tickets(2)) * 100 / tickets(1))) + "% of our problems'" ^0
"  'the same problems now produce fewer duplicate tickets'" ^0
"  events that stopped happening : " + str(event_count() - still_reported) ^0
"" ^0

# ---- what would distinguish them ----
#
# Not the ticket count, which is identical under both stories. The distinct
# events behind the tickets, which the ticket system can produce only if
# something links tickets to events.

"what would tell the two apart" ^0
"  ticket count       : same under both stories" ^0
"  distinct events    : " + str(event_count()) + " - unchanged, and this is the discriminating number" ^0
"  and it exists only if tickets are linked to an event" ^0
"" ^0

# ---- the control: a quarter where events really fell ----
#
# The ticket count is not a bad measure. It tracks the events exactly when the
# tickets-per-event ratio holds still, and this is that quarter.

[["f1", 2, 2], ["f2", 2, 2], ["f3", 2, 0], ["f4", 2, 0], ["f5", 2, 2]] => q3
0 => q3a
0 => q3b
0 => q3_events_before
0 => q3_events_after
for e in q3:
    q3a + e[1] => q3a
    q3b + e[2] => q3b
    if e[1] > 0:
        q3_events_before + 1 => q3_events_before
    if e[2] > 0:
        q3_events_after + 1 => q3_events_after
"control - a quarter where the ratio held and events actually fell" ^0
"  tickets : " + str(q3a) + " -> " + str(q3b) + "  (" + str(int((q3a - q3b) * 100 / q3a)) + "% fewer)" ^0
"  events  : " + str(q3_events_before) + " -> " + str(q3_events_after) + "  (" + str(int((q3_events_before - q3_events_after) * 100 / q3_events_before)) + "% fewer)" ^0
if int((q3a - q3b) * 100 / q3a) == int((q3_events_before - q3_events_after) * 100 / q3_events_before):
    "  here the ticket count tracks the events exactly" ^0
"" ^0

"Every ticket is real and the count is correct. It counts reports, and the" ^0
"number of reports an event produces is a property of how people file, not of" ^0
"how often the event happens." ^0
```

## Python (deterministic transpilation)

```python
events = [["e1", 4, 1], ["e2", 3, 1], ["e3", 2, 1], ["e4", 5, 2], ["e5", 1, 1], ["e6", 3, 2], ["e7", 2, 1], ["e8", 4, 2]]

def tickets(q):
    t = 0
    for e in events:
        if q == 1:
            t = t + e[1]
        else:
            t = t + e[2]
    return t

def event_count():
    return len(events)

print("underlying events : " + str(event_count()) + " in both quarters")
print("")
print("tickets")
print("  Q1 : " + str(tickets(1)))
print("  Q2 : " + str(tickets(2)))
print("  change : " + str(int((tickets(1) - tickets(2)) * 100 / tickets(1))) + "% fewer")
print("")
print("events")
print("  Q1 : " + str(event_count()))
print("  Q2 : " + str(event_count()))
print("  change : 0%")
print("")
print("tickets per event")
print("  Q1 : " + str(int(tickets(1) * 10 / event_count())))
print("  Q2 : " + str(int(tickets(2) * 10 / event_count())))
print("  (in tenths)")
print("")
print("per event")
for e in events:
    print("  " + e[0] + " : " + str(e[1]) + " -> " + str(e[2]))
still_reported = 0
for e in events:
    if e[2] > 0:
        still_reported = still_reported + 1
print("  events that still produced at least one ticket : " + str(still_reported) + " of " + str(event_count()))
if still_reported == event_count():
    print("  every event is still visible - nothing was hidden, only deduplicated")
print("")
print("the two readings of the same drop")
print("  'we fixed " + str(int((tickets(1) - tickets(2)) * 100 / tickets(1))) + "% of our problems'")
print("  'the same problems now produce fewer duplicate tickets'")
print("  events that stopped happening : " + str(event_count() - still_reported))
print("")
print("what would tell the two apart")
print("  ticket count       : same under both stories")
print("  distinct events    : " + str(event_count()) + " - unchanged, and this is the discriminating number")
print("  and it exists only if tickets are linked to an event")
print("")
q3 = [["f1", 2, 2], ["f2", 2, 2], ["f3", 2, 0], ["f4", 2, 0], ["f5", 2, 2]]
q3a = 0
q3b = 0
q3_events_before = 0
q3_events_after = 0
for e in q3:
    q3a = q3a + e[1]
    q3b = q3b + e[2]
    if e[1] > 0:
        q3_events_before = q3_events_before + 1
    if e[2] > 0:
        q3_events_after = q3_events_after + 1
print("control - a quarter where the ratio held and events actually fell")
print("  tickets : " + str(q3a) + " -> " + str(q3b) + "  (" + str(int((q3a - q3b) * 100 / q3a)) + "% fewer)")
print("  events  : " + str(q3_events_before) + " -> " + str(q3_events_after) + "  (" + str(int((q3_events_before - q3_events_after) * 100 / q3_events_before)) + "% fewer)")
if int((q3a - q3b) * 100 / q3a) == int((q3_events_before - q3_events_after) * 100 / q3_events_before):
    print("  here the ticket count tracks the events exactly")
print("")
print("Every ticket is real and the count is correct. It counts reports, and the")
print("number of reports an event produces is a property of how people file, not of")
print("how often the event happens.")
```

## stdout (executed)

```text
underlying events : 8 in both quarters

tickets
  Q1 : 24
  Q2 : 11
  change : 54% fewer

events
  Q1 : 8
  Q2 : 8
  change : 0%

tickets per event
  Q1 : 30
  Q2 : 13
  (in tenths)

per event
  e1 : 4 -> 1
  e2 : 3 -> 1
  e3 : 2 -> 1
  e4 : 5 -> 2
  e5 : 1 -> 1
  e6 : 3 -> 2
  e7 : 2 -> 1
  e8 : 4 -> 2
  events that still produced at least one ticket : 8 of 8
  every event is still visible - nothing was hidden, only deduplicated

the two readings of the same drop
  'we fixed 54% of our problems'
  'the same problems now produce fewer duplicate tickets'
  events that stopped happening : 0

what would tell the two apart
  ticket count       : same under both stories
  distinct events    : 8 - unchanged, and this is the discriminating number
  and it exists only if tickets are linked to an event

control - a quarter where the ratio held and events actually fell
  tickets : 10 -> 6  (40% fewer)
  events  : 5 -> 3  (40% fewer)
  here the ticket count tracks the events exactly

Every ticket is real and the count is correct. It counts reports, and the
number of reports an event produces is a property of how people file, not of
how often the event happens.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
