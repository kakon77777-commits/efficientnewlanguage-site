<!-- canonical: efficientnewlanguage.org/ai/examples/540-the-constraint-was-on-the-wrong-pair-of-columns | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 540 — The constraint was on the wrong pair of columns

`the_constraint_was_on_the_wrong_pair_of_columns.eml` - A unique constraint on room and start time, protecting a rule about rooms not being double booked. What it accepts and what it refuses is counted below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A unique
# constraint on room and start time, protecting a rule about rooms not being
# double booked. What it accepts and what it refuses is counted below.
#
# The constraint is the right instinct. The rule belongs in the database rather
# than in whichever service happens to be writing, it cannot be forgotten by a
# new caller, and it costs nothing to enforce. Putting it on room and start
# time is also the obvious reading: two bookings for the same room at the same
# moment are exactly the thing being prevented, and the constraint prevents
# them, every time, correctly.
#
# The rule is about overlap and the constraint is about equality. Equality is
# the special case of overlap in which two bookings begin at the same instant,
# and it is the whole of overlap only when every booking is the same length.
#
# Every booking was thirty minutes when the constraint was written. The
# fixtures are still thirty minutes. A constraint that is exactly right on the
# data it was designed against does not announce the day the data changes.

# [id, room, start minute, duration minutes, state]
[[1, "R4", 540, 60, "confirmed"], [2, "R4", 570, 60, "confirmed"], [3, "R4", 600, 30, "confirmed"], [4, "R7", 540, 30, "cancelled"], [5, "R7", 540, 30, "confirmed"], [6, "R9", 480, 120, "confirmed"], [7, "R9", 540, 30, "confirmed"], [8, "R2", 600, 30, "confirmed"], [9, "R2", 630, 30, "confirmed"]] => bookings

def overlaps(a, b):
    if a[1] != b[1]:
        return 0
    if a[2] + a[3] <= b[2]:
        return 0
    if b[2] + b[3] <= a[2]:
        return 0
    return 1

def constraint_collides(a, b):
    if a[1] != b[1]:
        return 0
    if a[2] != b[2]:
        return 0
    return 1

def live(b):
    if b[4] == "confirmed":
        return 1
    return 0

"bookings : " + str(len(bookings)) ^0
"the rule : no two live bookings for one room may overlap" ^0
"the constraint : (room, start) must be unique" ^0
"" ^0

# ---- every pair, judged twice ----

"pair    room   times                  overlaps   constraint   verdict" ^0
0 => false_accept
0 => false_reject
0 => agree
for a in bookings:
    for b in bookings:
        if a[0] < b[0]:
            overlaps(a, b) * live(a) * live(b) => real
            constraint_collides(a, b) => caught
            "agrees" => verdict
            if real == 1:
                if caught == 0:
                    "ADMITS a double booking" => verdict
                    false_accept + 1 => false_accept
            if real == 0:
                if caught == 1:
                    "REFUSES a legal booking" => verdict
                    false_reject + 1 => false_reject
            if verdict == "agrees":
                agree + 1 => agree
            if verdict != "agrees":
                ("  %s+%s   %-6s %s-%s and %s-%s   %-10s %-12s %s" % (str(a[0]), str(b[0]), a[1], str(a[2]), str(a[2] + a[3]), str(b[2]), str(b[2] + b[3]), str(real), str(caught), verdict))^0
"" ^0

("  pairs where the two agree      : %s" % str(agree))^0
("  overlaps the constraint admits : %s" % str(false_accept))^0
("  legal bookings it refuses      : %s" % str(false_reject))^0
"  one wrong pair of columns produces both errors, in opposite directions" ^0
"" ^0

# ---- the control ----
#
# The same nine bookings, every duration set to thirty minutes, which is the
# shape the constraint was written against and the shape the fixtures use.

[[b[0], b[1], b[2], 30, b[4]] for b in bookings] => uniform

0 => u_false_accept
0 => u_false_reject
for a in uniform:
    for b in uniform:
        if a[0] < b[0]:
            overlaps(a, b) * live(a) * live(b) => real
            constraint_collides(a, b) => caught
            if real == 1:
                if caught == 0:
                    u_false_accept + 1 => u_false_accept
            if real == 0:
                if caught == 1:
                    u_false_reject + 1 => u_false_reject

"control - the same bookings with every duration equal" ^0
("  overlaps the constraint admits : %s, was %s" % (str(u_false_accept), str(false_accept)))^0
("  legal bookings it refuses      : %s, was %s" % (str(u_false_reject), str(false_reject)))^0
"  on equal-length bookings equality of start IS overlap, so that half of" ^0
"  the constraint is not approximately right, it is exactly the rule, and" ^0
"  this is the data it was designed against and is still tested on" ^0
"" ^0
"  the refusal does not move, so it is a second defect and not this one" ^0
"  the control separates them: duration explains the admissions and" ^0
"  explains none of the refusal" ^0
"" ^0

# ---- the cancelled row ----

"the refusal, looked at on its own" ^0
for b in bookings:
    if b[4] == "cancelled":
        ("  booking %s in %s at %s is cancelled and still occupies (room, start)" % (str(b[0]), b[1], str(b[2])))^0
"  a cancelled row is not a live booking to the rule and is a row to the" ^0
"  constraint, and the constraint cannot read a state column it is not on" ^0
"" ^0

# ---- what each fix costs ----

"three ways to state the rule" ^0
"  unique (room, start)                : one line, admits overlaps of" ^0
"    unequal length and refuses cancelled-then-rebooked" ^0
"  unique (room, start) where confirmed : fixes the refusal, still admits" ^0
"    every overlap that does not start on the same minute" ^0
"  exclusion on room and time range     : states the rule itself" ^0
("  the first two are cheap and the third is the only one with %s and %s at zero" % (str(false_accept), str(false_reject)))^0
"" ^0

"The rule belongs in the database and two bookings at the same instant is" ^0
"the obvious reading of it. Equality is the whole of overlap only when every" ^0
("booking is the same length: on equal durations the constraint is exact, and" )^0
("on these nine it admits %s overlaps and refuses %s legal booking." % (str(false_accept), str(false_reject)))^0
```

## Python (deterministic transpilation)

```python
bookings = [[1, "R4", 540, 60, "confirmed"], [2, "R4", 570, 60, "confirmed"], [3, "R4", 600, 30, "confirmed"], [4, "R7", 540, 30, "cancelled"], [5, "R7", 540, 30, "confirmed"], [6, "R9", 480, 120, "confirmed"], [7, "R9", 540, 30, "confirmed"], [8, "R2", 600, 30, "confirmed"], [9, "R2", 630, 30, "confirmed"]]

def overlaps(a, b):
    if a[1] != b[1]:
        return 0
    if a[2] + a[3] <= b[2]:
        return 0
    if b[2] + b[3] <= a[2]:
        return 0
    return 1

def constraint_collides(a, b):
    if a[1] != b[1]:
        return 0
    if a[2] != b[2]:
        return 0
    return 1

def live(b):
    if b[4] == "confirmed":
        return 1
    return 0

print("bookings : " + str(len(bookings)))
print("the rule : no two live bookings for one room may overlap")
print("the constraint : (room, start) must be unique")
print("")
print("pair    room   times                  overlaps   constraint   verdict")
false_accept = 0
false_reject = 0
agree = 0
for a in bookings:
    for b in bookings:
        if a[0] < b[0]:
            real = overlaps(a, b) * live(a) * live(b)
            caught = constraint_collides(a, b)
            verdict = "agrees"
            if real == 1:
                if caught == 0:
                    verdict = "ADMITS a double booking"
                    false_accept = false_accept + 1
            if real == 0:
                if caught == 1:
                    verdict = "REFUSES a legal booking"
                    false_reject = false_reject + 1
            if verdict == "agrees":
                agree = agree + 1
            if verdict != "agrees":
                print("  %s+%s   %-6s %s-%s and %s-%s   %-10s %-12s %s" % (str(a[0]), str(b[0]), a[1], str(a[2]), str(a[2] + a[3]), str(b[2]), str(b[2] + b[3]), str(real), str(caught), verdict))
print("")
print("  pairs where the two agree      : %s" % str(agree))
print("  overlaps the constraint admits : %s" % str(false_accept))
print("  legal bookings it refuses      : %s" % str(false_reject))
print("  one wrong pair of columns produces both errors, in opposite directions")
print("")
uniform = [[b[0], b[1], b[2], 30, b[4]] for b in bookings]
u_false_accept = 0
u_false_reject = 0
for a in uniform:
    for b in uniform:
        if a[0] < b[0]:
            real = overlaps(a, b) * live(a) * live(b)
            caught = constraint_collides(a, b)
            if real == 1:
                if caught == 0:
                    u_false_accept = u_false_accept + 1
            if real == 0:
                if caught == 1:
                    u_false_reject = u_false_reject + 1
print("control - the same bookings with every duration equal")
print("  overlaps the constraint admits : %s, was %s" % (str(u_false_accept), str(false_accept)))
print("  legal bookings it refuses      : %s, was %s" % (str(u_false_reject), str(false_reject)))
print("  on equal-length bookings equality of start IS overlap, so that half of")
print("  the constraint is not approximately right, it is exactly the rule, and")
print("  this is the data it was designed against and is still tested on")
print("")
print("  the refusal does not move, so it is a second defect and not this one")
print("  the control separates them: duration explains the admissions and")
print("  explains none of the refusal")
print("")
print("the refusal, looked at on its own")
for b in bookings:
    if b[4] == "cancelled":
        print("  booking %s in %s at %s is cancelled and still occupies (room, start)" % (str(b[0]), b[1], str(b[2])))
print("  a cancelled row is not a live booking to the rule and is a row to the")
print("  constraint, and the constraint cannot read a state column it is not on")
print("")
print("three ways to state the rule")
print("  unique (room, start)                : one line, admits overlaps of")
print("    unequal length and refuses cancelled-then-rebooked")
print("  unique (room, start) where confirmed : fixes the refusal, still admits")
print("    every overlap that does not start on the same minute")
print("  exclusion on room and time range     : states the rule itself")
print("  the first two are cheap and the third is the only one with %s and %s at zero" % (str(false_accept), str(false_reject)))
print("")
print("The rule belongs in the database and two bookings at the same instant is")
print("the obvious reading of it. Equality is the whole of overlap only when every")
print("booking is the same length: on equal durations the constraint is exact, and")
print("on these nine it admits %s overlaps and refuses %s legal booking." % (str(false_accept), str(false_reject)))
```

## stdout (executed)

```text
bookings : 9
the rule : no two live bookings for one room may overlap
the constraint : (room, start) must be unique

pair    room   times                  overlaps   constraint   verdict
  1+2   R4     540-600 and 570-630   1          0            ADMITS a double booking
  2+3   R4     570-630 and 600-630   1          0            ADMITS a double booking
  4+5   R7     540-570 and 540-570   0          1            REFUSES a legal booking
  6+7   R9     480-600 and 540-570   1          0            ADMITS a double booking

  pairs where the two agree      : 32
  overlaps the constraint admits : 3
  legal bookings it refuses      : 1
  one wrong pair of columns produces both errors, in opposite directions

control - the same bookings with every duration equal
  overlaps the constraint admits : 0, was 3
  legal bookings it refuses      : 1, was 1
  on equal-length bookings equality of start IS overlap, so that half of
  the constraint is not approximately right, it is exactly the rule, and
  this is the data it was designed against and is still tested on

  the refusal does not move, so it is a second defect and not this one
  the control separates them: duration explains the admissions and
  explains none of the refusal

the refusal, looked at on its own
  booking 4 in R7 at 540 is cancelled and still occupies (room, start)
  a cancelled row is not a live booking to the rule and is a row to the
  constraint, and the constraint cannot read a state column it is not on

three ways to state the rule
  unique (room, start)                : one line, admits overlaps of
    unequal length and refuses cancelled-then-rebooked
  unique (room, start) where confirmed : fixes the refusal, still admits
    every overlap that does not start on the same minute
  exclusion on room and time range     : states the rule itself
  the first two are cheap and the third is the only one with 3 and 1 at zero

The rule belongs in the database and two bookings at the same instant is
the obvious reading of it. Equality is the whole of overlap only when every
booking is the same length: on equal durations the constraint is exact, and
on these nine it admits 3 overlaps and refuses 1 legal booking.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
