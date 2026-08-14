<!-- canonical: efficientnewlanguage.org/ai/examples/372-bucketed-by-when-it-arrived | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 372 — Bucketed by when it arrived — the totals reconcile and the shape does not

`bucketed_by_when_it_arrived.eml` builds a daily series two ways from the same 18 events.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The chart answers
# "how much did we receive each day". It is read as "how much happened".
#
# Bucketing by arrival is the choice that always works. Arrival time is stamped
# by the system doing the bucketing, it is never missing, never in the future,
# and never revised. Event time comes from the source and has all three
# problems. So the reliable field is the one that answers a question about the
# pipeline rather than about the world.
#
# The two bucketings agree exactly as long as nothing is delayed, and a backfill
# is a delay of several days at once. Both series are computed from the same
# rows here; neither is an estimate.

# [event_day, arrival_day]
[[1, 1], [1, 1], [1, 1], [2, 2], [2, 2], [3, 3], [3, 3], [3, 3], [3, 3], [4, 6], [4, 6], [4, 6], [4, 6], [5, 6], [5, 6], [5, 6], [6, 6], [6, 6]] => events

6 => days

def by_event(d):
    0 => c
    for e in events:
        if e[0] == d:
            c + 1 => c
    return c

def by_arrival(d):
    0 => c
    for e in events:
        if e[1] == d:
            c + 1 => c
    return c

def delayed():
    0 => c
    for e in events:
        if not (e[0] == e[1]):
            c + 1 => c
    return c

"events : " + str(len(events)) + ", of which delayed : " + str(delayed()) ^0
"" ^0

"day   by event   by arrival" ^0
for d in [1:days]:
    "  " + str(d) + "        " + str(by_event(d)) + "          " + str(by_arrival(d)) ^0
"" ^0

# ---- what each series says about the busiest day ----

0 => peak_e
0 => peak_e_day
0 => peak_a
0 => peak_a_day
for d in [1:days]:
    if by_event(d) > peak_e:
        by_event(d) => peak_e
        d => peak_e_day
    if by_arrival(d) > peak_a:
        by_arrival(d) => peak_a
        d => peak_a_day

"busiest day" ^0
"  by event   : day " + str(peak_e_day) + " with " + str(peak_e) ^0
"  by arrival : day " + str(peak_a_day) + " with " + str(peak_a) ^0
if not (peak_e_day == peak_a_day):
    "  the two series name different days" ^0
"" ^0

# ---- the days the arrival series reports as empty ----

0 => empty_arrival
for d in [1:days]:
    if by_arrival(d) == 0:
        if by_event(d) > 0:
            empty_arrival + 1 => empty_arrival
            "  day " + str(d) + " : arrival says 0, " + str(by_event(d)) + " things happened" ^0
"  days reported empty that were not : " + str(empty_arrival) ^0
"" ^0

# ---- both series have the same total ----
#
# This is why the discrepancy survives a reconciliation check. Nothing is lost
# and nothing is duplicated; only the assignment to days differs.

0 => total_e
0 => total_a
for d in [1:days]:
    total_e + by_event(d) => total_e
    total_a + by_arrival(d) => total_a
"totals" ^0
"  by event   : " + str(total_e) ^0
"  by arrival : " + str(total_a) ^0
if total_e == total_a:
    "  the totals reconcile, and the daily shape does not" ^0
"" ^0

# ---- the control: the same code over a stretch with no delay ----
#
# Days 1 to 3 have nothing delayed. There the two bucketings are identical, so
# arrival-time bucketing is not wrong in general.

0 => agree
0 => window
for d in [1:3]:
    window + 1 => window
    if by_event(d) == by_arrival(d):
        agree + 1 => agree
"control - days 1 to 3, nothing delayed" ^0
"  days where the two series agree : " + str(agree) + " of " + str(window) ^0
"" ^0

"Arrival time is the field that is always there. It answers a question about" ^0
"the pipeline, and the chart is captioned with a question about the world." ^0
```

## Python (deterministic transpilation)

```python
events = [[1, 1], [1, 1], [1, 1], [2, 2], [2, 2], [3, 3], [3, 3], [3, 3], [3, 3], [4, 6], [4, 6], [4, 6], [4, 6], [5, 6], [5, 6], [5, 6], [6, 6], [6, 6]]
days = 6

def by_event(d):
    c = 0
    for e in events:
        if e[0] == d:
            c = c + 1
    return c

def by_arrival(d):
    c = 0
    for e in events:
        if e[1] == d:
            c = c + 1
    return c

def delayed():
    c = 0
    for e in events:
        if not e[0] == e[1]:
            c = c + 1
    return c

print("events : " + str(len(events)) + ", of which delayed : " + str(delayed()))
print("")
print("day   by event   by arrival")
for d in range(1, days+1):
    print("  " + str(d) + "        " + str(by_event(d)) + "          " + str(by_arrival(d)))
print("")
peak_e = 0
peak_e_day = 0
peak_a = 0
peak_a_day = 0
for d in range(1, days+1):
    if by_event(d) > peak_e:
        peak_e = by_event(d)
        peak_e_day = d
    if by_arrival(d) > peak_a:
        peak_a = by_arrival(d)
        peak_a_day = d
print("busiest day")
print("  by event   : day " + str(peak_e_day) + " with " + str(peak_e))
print("  by arrival : day " + str(peak_a_day) + " with " + str(peak_a))
if not peak_e_day == peak_a_day:
    print("  the two series name different days")
print("")
empty_arrival = 0
for d in range(1, days+1):
    if by_arrival(d) == 0:
        if by_event(d) > 0:
            empty_arrival = empty_arrival + 1
            print("  day " + str(d) + " : arrival says 0, " + str(by_event(d)) + " things happened")
print("  days reported empty that were not : " + str(empty_arrival))
print("")
total_e = 0
total_a = 0
for d in range(1, days+1):
    total_e = total_e + by_event(d)
    total_a = total_a + by_arrival(d)
print("totals")
print("  by event   : " + str(total_e))
print("  by arrival : " + str(total_a))
if total_e == total_a:
    print("  the totals reconcile, and the daily shape does not")
print("")
agree = 0
window = 0
for d in range(1, 4):
    window = window + 1
    if by_event(d) == by_arrival(d):
        agree = agree + 1
print("control - days 1 to 3, nothing delayed")
print("  days where the two series agree : " + str(agree) + " of " + str(window))
print("")
print("Arrival time is the field that is always there. It answers a question about")
print("the pipeline, and the chart is captioned with a question about the world.")
```

## stdout (executed)

```text
events : 18, of which delayed : 7

day   by event   by arrival
  1        3          3
  2        2          2
  3        4          4
  4        4          0
  5        3          0
  6        2          9

busiest day
  by event   : day 3 with 4
  by arrival : day 6 with 9
  the two series name different days

  day 4 : arrival says 0, 4 things happened
  day 5 : arrival says 0, 3 things happened
  days reported empty that were not : 2

totals
  by event   : 18
  by arrival : 18
  the totals reconcile, and the daily shape does not

control - days 1 to 3, nothing delayed
  days where the two series agree : 3 of 3

Arrival time is the field that is always there. It answers a question about
the pipeline, and the chart is captioned with a question about the world.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
