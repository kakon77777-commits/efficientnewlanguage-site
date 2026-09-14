<!-- canonical: efficientnewlanguage.org/ai/examples/849-the-timestamps-were-ordered-as-text | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 849 — The timestamps were ordered as text

`the_timestamps_were_ordered_as_text.eml` - The audit log is ordered by timestamp and the sort is correct. What kind of order it is is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The audit log is
# ordered by timestamp and the sort is correct. What kind of order it is is
# computed below.
#
# The ordering is careful. It sorts on the real timestamp field, not the row
# insertion order; it uses the database's own sort; it covers every event; and
# ordering the log by time is exactly what the investigator needs to read cause
# before effect.
#
# The timestamp is stored as text, and text order equals time order only while
# every timestamp has the same shape.

600000 => events_in_the_log
590000 => events_with_a_zulu_offset
10000 => events_with_a_plus_two_offset
0 => events_the_sort_reordered_by_true_instant_reported

events_with_a_zulu_offset + events_with_a_plus_two_offset => events_total_check
int(events_with_a_plus_two_offset * 10000 / events_in_the_log) => differently_shaped_share_per_myriad

"events in the log               : " + str(events_in_the_log) ^0
"  timestamp ends in Z (UTC)     : " + str(events_with_a_zulu_offset) ^0
"  timestamp ends in +02:00      : " + str(events_with_a_plus_two_offset) ^0
"total (check)                   : " + str(events_total_check) ^0
"events out of true-time order   : " + str(events_the_sort_reordered_by_true_instant_reported) ^0
"differently-shaped share        : " + str(differently_shaped_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the ordering verified ----

"the log ordering" ^0
"  sorts on : the real timestamp field, not insertion order" ^0
"  operator : the database's own sort" ^0
"  covers : every event" ^0
"  intent : time order, so cause reads before effect" ^0
"  events omitted : 0" ^0
"  verdict : ORDERED BY TIMESTAMP" ^0
"" ^0
"  sorting on the timestamp rather than insertion order is" ^0
"  the part done right here, and it is why a delayed insert" ^0
"  does not misplace an event by arrival" ^0
"" ^0

# ---- what kind of order ----

"sorting timestamps as text" ^0
"  when it equals time order : while every string has the" ^0
"    same shape and zone" ^0
"  the two shapes present : '...T10:00:00Z' and" ^0
"    '...T11:30:00+02:00'" ^0
"  the +02:00 event's true instant : 09:30 UTC, earlier" ^0
"    than the Z event's 10:00" ^0
"  text order : puts '11:30:00+02:00' after '10:00:00Z'," ^0
"    by the leading digits" ^0
"  so text order and instant order : disagree once zones" ^0
"    differ" ^0
"" ^0

# ---- what the investigator reads ----

"the log as ordered" ^0
"  an effect at 09:30 UTC written +02:00 : sorts after its" ^0
"    cause at 10:00 UTC written Z" ^0
"  so effect appears : after cause, though it happened" ^0
"    before" ^0
"  is the sort wrong : no; it is the correct text order" ^0
"  is text order the instant order : only while all zones" ^0
"    and widths match" ^0
"  events with the differing shape : " ^0
"    " + str(events_with_a_plus_two_offset) ^0
"" ^0

# ---- null control ----

# The same events, normalized to UTC (or compared as parsed instants) before
# ordering.
0 => nc_text_order_equals_instant_order
1 => nc_instant_order_is_correct
10000 => nc_events_that_move_to_their_true_place

"null control - normalize to UTC before ordering" ^0
"  text order equals instant order : " ^0
"    " + str(nc_text_order_equals_instant_order) ^0
"  instant order is correct : " + str(nc_instant_order_is_correct) ^0
"  events that move to their true place : " ^0
"    " + str(nc_events_that_move_to_their_true_place) ^0
"  no event changed; the order stopped being taken over the" ^0
"  characters and started being taken over the instants" ^0
"" ^0

# ---- the rule ----

"what ORDER BY timestamp guarantees" ^0
"  the rows are in ascending order of the stored string :" ^0
"    exactly, the engine's own sort over every event" ^0
"  the rows are in time order : not addressed; the" ^0
"    timestamp is text and the events carry two zone shapes," ^0
"    so a +02:00 event at 09:30 UTC sorts after a Z event at" ^0
"    10:00 UTC - cause and effect swap for the " ^0
"    " + str(events_with_a_plus_two_offset) + " differently-shaped rows" ^0
"" ^0

"a timestamp is an instant, but stored as text it sorts as characters, and" ^0
"characters order by shape before meaning; two encodings of the same instant" ^0
"compare by their digits, not their moment" ^0
"" ^0

"It sorts the real timestamp field with the engine's sort over every event - a" ^0
"correct text order. The timestamps carry two zone shapes, so a +02:00 event" ^0
"sorts after an earlier Z event by its leading digits, swapping cause and effect" ^0
"for " + str(events_with_a_plus_two_offset) + " rows, " + str(differently_shaped_share_per_myriad) + " per ten thousand of the log." ^0
```

## Python (deterministic transpilation)

```python
events_in_the_log = 600000
events_with_a_zulu_offset = 590000
events_with_a_plus_two_offset = 10000
events_the_sort_reordered_by_true_instant_reported = 0
events_total_check = events_with_a_zulu_offset + events_with_a_plus_two_offset
differently_shaped_share_per_myriad = int(events_with_a_plus_two_offset * 10000 / events_in_the_log)
print("events in the log               : " + str(events_in_the_log))
print("  timestamp ends in Z (UTC)     : " + str(events_with_a_zulu_offset))
print("  timestamp ends in +02:00      : " + str(events_with_a_plus_two_offset))
print("total (check)                   : " + str(events_total_check))
print("events out of true-time order   : " + str(events_the_sort_reordered_by_true_instant_reported))
print("differently-shaped share        : " + str(differently_shaped_share_per_myriad) + " per ten thousand")
print("")
print("the log ordering")
print("  sorts on : the real timestamp field, not insertion order")
print("  operator : the database's own sort")
print("  covers : every event")
print("  intent : time order, so cause reads before effect")
print("  events omitted : 0")
print("  verdict : ORDERED BY TIMESTAMP")
print("")
print("  sorting on the timestamp rather than insertion order is")
print("  the part done right here, and it is why a delayed insert")
print("  does not misplace an event by arrival")
print("")
print("sorting timestamps as text")
print("  when it equals time order : while every string has the")
print("    same shape and zone")
print("  the two shapes present : '...T10:00:00Z' and")
print("    '...T11:30:00+02:00'")
print("  the +02:00 event's true instant : 09:30 UTC, earlier")
print("    than the Z event's 10:00")
print("  text order : puts '11:30:00+02:00' after '10:00:00Z',")
print("    by the leading digits")
print("  so text order and instant order : disagree once zones")
print("    differ")
print("")
print("the log as ordered")
print("  an effect at 09:30 UTC written +02:00 : sorts after its")
print("    cause at 10:00 UTC written Z")
print("  so effect appears : after cause, though it happened")
print("    before")
print("  is the sort wrong : no; it is the correct text order")
print("  is text order the instant order : only while all zones")
print("    and widths match")
print("  events with the differing shape : ")
print("    " + str(events_with_a_plus_two_offset))
print("")
nc_text_order_equals_instant_order = 0
nc_instant_order_is_correct = 1
nc_events_that_move_to_their_true_place = 10000
print("null control - normalize to UTC before ordering")
print("  text order equals instant order : ")
print("    " + str(nc_text_order_equals_instant_order))
print("  instant order is correct : " + str(nc_instant_order_is_correct))
print("  events that move to their true place : ")
print("    " + str(nc_events_that_move_to_their_true_place))
print("  no event changed; the order stopped being taken over the")
print("  characters and started being taken over the instants")
print("")
print("what ORDER BY timestamp guarantees")
print("  the rows are in ascending order of the stored string :")
print("    exactly, the engine's own sort over every event")
print("  the rows are in time order : not addressed; the")
print("    timestamp is text and the events carry two zone shapes,")
print("    so a +02:00 event at 09:30 UTC sorts after a Z event at")
print("    10:00 UTC - cause and effect swap for the ")
print("    " + str(events_with_a_plus_two_offset) + " differently-shaped rows")
print("")
print("a timestamp is an instant, but stored as text it sorts as characters, and")
print("characters order by shape before meaning; two encodings of the same instant")
print("compare by their digits, not their moment")
print("")
print("It sorts the real timestamp field with the engine's sort over every event - a")
print("correct text order. The timestamps carry two zone shapes, so a +02:00 event")
print("sorts after an earlier Z event by its leading digits, swapping cause and effect")
print("for " + str(events_with_a_plus_two_offset) + " rows, " + str(differently_shaped_share_per_myriad) + " per ten thousand of the log.")
```

## stdout (executed)

```text
events in the log               : 600000
  timestamp ends in Z (UTC)     : 590000
  timestamp ends in +02:00      : 10000
total (check)                   : 600000
events out of true-time order   : 0
differently-shaped share        : 166 per ten thousand

the log ordering
  sorts on : the real timestamp field, not insertion order
  operator : the database's own sort
  covers : every event
  intent : time order, so cause reads before effect
  events omitted : 0
  verdict : ORDERED BY TIMESTAMP

  sorting on the timestamp rather than insertion order is
  the part done right here, and it is why a delayed insert
  does not misplace an event by arrival

sorting timestamps as text
  when it equals time order : while every string has the
    same shape and zone
  the two shapes present : '...T10:00:00Z' and
    '...T11:30:00+02:00'
  the +02:00 event's true instant : 09:30 UTC, earlier
    than the Z event's 10:00
  text order : puts '11:30:00+02:00' after '10:00:00Z',
    by the leading digits
  so text order and instant order : disagree once zones
    differ

the log as ordered
  an effect at 09:30 UTC written +02:00 : sorts after its
    cause at 10:00 UTC written Z
  so effect appears : after cause, though it happened
    before
  is the sort wrong : no; it is the correct text order
  is text order the instant order : only while all zones
    and widths match
  events with the differing shape : 
    10000

null control - normalize to UTC before ordering
  text order equals instant order : 
    0
  instant order is correct : 1
  events that move to their true place : 
    10000
  no event changed; the order stopped being taken over the
  characters and started being taken over the instants

what ORDER BY timestamp guarantees
  the rows are in ascending order of the stored string :
    exactly, the engine's own sort over every event
  the rows are in time order : not addressed; the
    timestamp is text and the events carry two zone shapes,
    so a +02:00 event at 09:30 UTC sorts after a Z event at
    10:00 UTC - cause and effect swap for the 
    10000 differently-shaped rows

a timestamp is an instant, but stored as text it sorts as characters, and
characters order by shape before meaning; two encodings of the same instant
compare by their digits, not their moment

It sorts the real timestamp field with the engine's sort over every event - a
correct text order. The timestamps carry two zone shapes, so a +02:00 event
sorts after an earlier Z event by its leading digits, swapping cause and effect
for 10000 rows, 166 per ten thousand of the log.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
