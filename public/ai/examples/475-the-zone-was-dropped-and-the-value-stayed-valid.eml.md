<!-- canonical: efficientnewlanguage.org/ai/examples/475-the-zone-was-dropped-and-the-value-stayed-valid | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 475 — The zone was dropped and the value stayed valid

`the_zone_was_dropped_and_the_value_stayed_valid.eml` - The zone was dropped at one hop and every timestamp is still a well-formed timestamp. How many of them now mean a different moment is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The zone was
# dropped at one hop and every timestamp is still a well-formed timestamp. How
# many of them now mean a different moment is computed below.
#
# The hop that drops it is not careless. Its storage column is a naive
# timestamp, which is the right type for a value that is already normalised,
# and the team that owns it normalises everything to one zone on the way in.
# Within that system every value is correct and comparable.
#
# A timestamp with the zone removed is not malformed. It parses, it sorts, it
# renders, and it is wrong by exactly the offset that was removed. Nothing in
# the chain has a shape to reject, so the error arrives as data rather than as
# a failure.
#
# Every record is carried through the hop and the shift is counted.

# [record, hour recorded, offset from UTC in hours]
[["e1", 9, 0], ["e2", 14, 8], ["e3", 22, 8], ["e4", 3, 0 - 5], ["e5", 17, 8], ["e6", 11, 0 - 5], ["e7", 6, 0]] => events

len(events) => n

def utc_hour(e):
    e[1] - e[2] => h
    if h < 0:
        h + 24 => h
    if h >= 24:
        h - 24 => h
    return h

"records : " + str(n) ^0
"record   local hour   offset   true UTC hour   read as UTC after the hop" ^0
0 => shifted
0 => day_changed
for e in events:
    utc_hour(e) => t
    e[1] => naive
    "" => mark
    if not (t == naive):
        shifted + 1 => shifted
    if e[1] - e[2] < 0:
        day_changed + 1 => day_changed
    if e[1] - e[2] >= 24:
        day_changed + 1 => day_changed
    "  " + e[0] + "     " + str(e[1]) + "           " + str(e[2]) + "       " + str(t) + "            " + str(naive) ^0
"" ^0

"records whose meaning changed : " + str(shifted) + " of " + str(n) ^0
0 => already_utc
for e in events:
    if e[2] == 0:
        already_utc + 1 => already_utc
"records already in UTC, unaffected : " + str(already_utc) ^0
if already_utc > 0:
    "  those are correct before and after, and they are the ones a developer" ^0
    "  in that zone would have used as fixtures" ^0
"" ^0

# ---- what a validator can see ----

"what each value looks like to a validator after the hop" ^0
0 => in_range
for e in events:
    if e[1] >= 0:
        if e[1] < 24:
            in_range + 1 => in_range
"  values in the valid hour range : " + str(in_range) + " of " + str(n) ^0
if in_range == n:
    "  every one of them, so a schema check on the field passes for all" ^0
    "  the value is not out of range, it is the wrong moment in range" ^0
"" ^0

# ---- records that crossed a day ----

"records where the true UTC time is on a different calendar day" ^0
for e in events:
    e[1] - e[2] => raw
    if raw < 0:
        "  " + e[0] + " : local hour " + str(e[1]) + " at offset " + str(e[2]) + " is the previous day in UTC" ^0
    if raw >= 24:
        "  " + e[0] + " : local hour " + str(e[1]) + " at offset " + str(e[2]) + " is the next day in UTC" ^0
"  count : " + str(day_changed) ^0
if day_changed > 0:
    "  a daily report bucketing on the naive value puts these in the wrong day" ^0
"" ^0

# ---- the size of the error ----

0 => max_shift
for e in events:
    e[2] => o
    if o < 0:
        0 - o => o
    if o > max_shift:
        o => max_shift
"largest shift in the set : " + str(max_shift) + " hours" ^0
"  the error is a constant per record and not random, so an average over" ^0
"  many records is shifted rather than noisy, and looks like a real pattern" ^0
"" ^0

# ---- what would have failed loudly ----

"what a zone-carrying type would have done at the same hop" ^0
"  values it accepts : the ones with a zone" ^0
"  values it rejects : the ones without" ^0
"  the hop would have failed on the first record instead of the report" ^0
"  failing on the wrong day three weeks later" ^0
"" ^0

# ---- the control: a system whose records are all in one zone ----
#
# Where every record already carries the same offset, dropping it loses
# nothing that was not already constant, and the hop is genuinely safe.

[["u1", 9, 0], ["u2", 14, 0], ["u3", 22, 0]] => utc_only
0 => u_shifted
for e in utc_only:
    if not (utc_hour(e) == e[1]):
        u_shifted + 1 => u_shifted
"control - a source that emits UTC only" ^0
"  records whose meaning changed : " + str(u_shifted) + " of " + str(len(utc_only)) ^0
if u_shifted == 0:
    "  none, so this source cannot show that the hop drops anything" ^0
"" ^0

"The storage type is right for values that are already normalised and the" ^0
"team that owns it normalises on the way in. What arrives from elsewhere is" ^0
"still a valid timestamp afterwards, and that is why nothing objects." ^0
```

## Python (deterministic transpilation)

```python
events = [["e1", 9, 0], ["e2", 14, 8], ["e3", 22, 8], ["e4", 3, 0 - 5], ["e5", 17, 8], ["e6", 11, 0 - 5], ["e7", 6, 0]]
n = len(events)

def utc_hour(e):
    h = e[1] - e[2]
    if h < 0:
        h = h + 24
    if h >= 24:
        h = h - 24
    return h

print("records : " + str(n))
print("record   local hour   offset   true UTC hour   read as UTC after the hop")
shifted = 0
day_changed = 0
for e in events:
    t = utc_hour(e)
    naive = e[1]
    mark = ""
    if not t == naive:
        shifted = shifted + 1
    if e[1] - e[2] < 0:
        day_changed = day_changed + 1
    if e[1] - e[2] >= 24:
        day_changed = day_changed + 1
    print("  " + e[0] + "     " + str(e[1]) + "           " + str(e[2]) + "       " + str(t) + "            " + str(naive))
print("")
print("records whose meaning changed : " + str(shifted) + " of " + str(n))
already_utc = 0
for e in events:
    if e[2] == 0:
        already_utc = already_utc + 1
print("records already in UTC, unaffected : " + str(already_utc))
if already_utc > 0:
    print("  those are correct before and after, and they are the ones a developer")
    print("  in that zone would have used as fixtures")
print("")
print("what each value looks like to a validator after the hop")
in_range = 0
for e in events:
    if e[1] >= 0:
        if e[1] < 24:
            in_range = in_range + 1
print("  values in the valid hour range : " + str(in_range) + " of " + str(n))
if in_range == n:
    print("  every one of them, so a schema check on the field passes for all")
    print("  the value is not out of range, it is the wrong moment in range")
print("")
print("records where the true UTC time is on a different calendar day")
for e in events:
    raw = e[1] - e[2]
    if raw < 0:
        print("  " + e[0] + " : local hour " + str(e[1]) + " at offset " + str(e[2]) + " is the previous day in UTC")
    if raw >= 24:
        print("  " + e[0] + " : local hour " + str(e[1]) + " at offset " + str(e[2]) + " is the next day in UTC")
print("  count : " + str(day_changed))
if day_changed > 0:
    print("  a daily report bucketing on the naive value puts these in the wrong day")
print("")
max_shift = 0
for e in events:
    o = e[2]
    if o < 0:
        o = 0 - o
    if o > max_shift:
        max_shift = o
print("largest shift in the set : " + str(max_shift) + " hours")
print("  the error is a constant per record and not random, so an average over")
print("  many records is shifted rather than noisy, and looks like a real pattern")
print("")
print("what a zone-carrying type would have done at the same hop")
print("  values it accepts : the ones with a zone")
print("  values it rejects : the ones without")
print("  the hop would have failed on the first record instead of the report")
print("  failing on the wrong day three weeks later")
print("")
utc_only = [["u1", 9, 0], ["u2", 14, 0], ["u3", 22, 0]]
u_shifted = 0
for e in utc_only:
    if not utc_hour(e) == e[1]:
        u_shifted = u_shifted + 1
print("control - a source that emits UTC only")
print("  records whose meaning changed : " + str(u_shifted) + " of " + str(len(utc_only)))
if u_shifted == 0:
    print("  none, so this source cannot show that the hop drops anything")
print("")
print("The storage type is right for values that are already normalised and the")
print("team that owns it normalises on the way in. What arrives from elsewhere is")
print("still a valid timestamp afterwards, and that is why nothing objects.")
```

## stdout (executed)

```text
records : 7
record   local hour   offset   true UTC hour   read as UTC after the hop
  e1     9           0       9            9
  e2     14           8       6            14
  e3     22           8       14            22
  e4     3           -5       8            3
  e5     17           8       9            17
  e6     11           -5       16            11
  e7     6           0       6            6

records whose meaning changed : 5 of 7
records already in UTC, unaffected : 2
  those are correct before and after, and they are the ones a developer
  in that zone would have used as fixtures

what each value looks like to a validator after the hop
  values in the valid hour range : 7 of 7
  every one of them, so a schema check on the field passes for all
  the value is not out of range, it is the wrong moment in range

records where the true UTC time is on a different calendar day
  count : 0

largest shift in the set : 8 hours
  the error is a constant per record and not random, so an average over
  many records is shifted rather than noisy, and looks like a real pattern

what a zone-carrying type would have done at the same hop
  values it accepts : the ones with a zone
  values it rejects : the ones without
  the hop would have failed on the first record instead of the report
  failing on the wrong day three weeks later

control - a source that emits UTC only
  records whose meaning changed : 0 of 3
  none, so this source cannot show that the hop drops anything

The storage type is right for values that are already normalised and the
team that owns it normalises on the way in. What arrives from elsewhere is
still a valid timestamp afterwards, and that is why nothing objects.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
