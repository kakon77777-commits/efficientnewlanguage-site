<!-- canonical: efficientnewlanguage.org/ai/examples/205-interval-overlap-detector | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 205 — Back-to-back is not an overlap

`interval_overlap_detector.eml` decides whether two time intervals overlap, and the whole case is one comparison operator.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finding
# overlapping intervals in a booking schedule - and getting the boundary right,
# which is the only part that is hard.
#
# Two intervals [a1, a2) and [b1, b2) overlap iff
#
#     a1 < b2  and  b1 < a2
#
# Every wrong version of this uses <= somewhere, and the symptom is that
# back-to-back bookings - one ending exactly when the next begins - are
# reported as a conflict. That is not a rare edge case; in a real calendar it
# is the MOST common adjacency, so the bug shows up as "the system rejects
# every normal schedule" and gets patched by loosening something else.
#
# The other classic is comparing only one direction (`a1 < b2`), which is true
# for every pair where a starts before b ends - including pairs that do not
# overlap at all. It passes any test suite whose intervals happen to be sorted.
#
# So this program checks the predicate itself against an independently
# computed answer: two intervals overlap iff the number of MINUTES they share
# is greater than zero, counted one minute at a time. That brute-force count
# cannot share a bug with the comparison, and it settles the boundary
# question by construction - touching intervals share zero minutes.

def overlaps(a, b):
    # Half-open [start, end): touching is NOT overlapping.
    return a[0] < b[1] and b[0] < a[1]

def overlaps_wrong_le(a, b):
    # The <= version, kept so the difference can be shown.
    return a[0] <= b[1] and b[0] <= a[1]

def overlaps_wrong_oneway(a, b):
    # Only one direction checked.
    return a[0] < b[1]

def shared_minutes(a, b):
    # Independent answer: count the minutes present in both, one at a time.
    0 => shared
    for t in [a[0]:a[1] - 1]:
        if t >= b[0] and t < b[1]:
            shared + 1 => shared
    return shared


# (label, start minute, end minute) - minutes from midnight
[
    ["standup", 540, 555],
    ["design review", 555, 615],
    ["1:1 with Ana", 600, 630],
    ["lunch", 720, 780],
    ["retro", 780, 840],
    ["deploy window", 810, 900],
    ["all-hands", 540, 600],
] => bookings

def clock(m):
    int(m / 60) => h
    m % 60 => mins
    "" => hh
    if h < 10:
        "0" => hh
    "" => mm
    if mins < 10:
        "0" => mm
    return hh + str(h) + ":" + mm + str(mins)

"schedule:"^0
for b in bookings:
    ("  %-16s %s - %s" % (b[0], clock(b[1]), clock(b[2])))^0

# ------------------------------------------------------------- conflicts
""^0
"conflicts (half-open, touching is fine):"^0
[] => conflicts
0 => i
while i < len(bookings):
    i + 1 => j
    while j < len(bookings):
        bookings[i] => a
        bookings[j] => b
        if overlaps([a[1], a[2]], [b[1], b[2]]):
            conflicts + [[a[0], b[0], shared_minutes([a[1], a[2]], [b[1], b[2]])]] => conflicts
        j + 1 => j
    i + 1 => i

if len(conflicts) == 0:
    "  (none)"^0
for c in conflicts:
    ("  %-16s overlaps %-16s by %d minutes" % (c[0], c[1], c[2]))^0

# ------------------------------------------------- predicate vs brute force
""^0
0 => agrees
0 => pairs
0 => le_wrong
0 => oneway_wrong
0 => touching
0 => i
while i < len(bookings):
    i + 1 => j
    while j < len(bookings):
        pairs + 1 => pairs
        bookings[i] => a
        bookings[j] => b
        [a[1], a[2]] => ai
        [b[1], b[2]] => bi

        overlaps(ai, bi) => predicted
        shared_minutes(ai, bi) > 0 => actual
        if predicted == actual:
            agrees + 1 => agrees
        if not (overlaps_wrong_le(ai, bi) == actual):
            le_wrong + 1 => le_wrong
        if not (overlaps_wrong_oneway(ai, bi) == actual):
            oneway_wrong + 1 => oneway_wrong

        # count the back-to-back adjacencies specifically
        if ai[1] == bi[0] or bi[1] == ai[0]:
            touching + 1 => touching
        j + 1 => j
    i + 1 => i

("pairs compared:                    " + str(pairs))^0
("predicate matches shared-minutes:  " + str(agrees) + "/" + str(pairs))^0
("back-to-back adjacencies:          " + str(touching))^0
("the <= version got wrong:          " + str(le_wrong))^0
("the one-way version got wrong:     " + str(oneway_wrong))^0

# The specific pair that separates the correct predicate from the <= one.
""^0
"The pair that decides it - standup ends exactly when design review begins:"^0
[540, 555] => s
[555, 615] => d
("  correct  a[0] < b[1] and b[0] < a[1] : " + str(overlaps(s, d)))^0
("  <= form  a[0] <= b[1] and b[0] <= a[1]: " + str(overlaps_wrong_le(s, d)))^0
("  minutes actually shared:               " + str(shared_minutes(s, d)))^0

""^0
if agrees == pairs and touching > 0 and le_wrong > 0 and oneway_wrong > 0:
    "The predicate matches a minute-by-minute count on every pair." => verdict
else:
    "FAILED - the overlap predicate disagrees with the actual sharing." => verdict
verdict^0

""^0
"Back-to-back is the most common adjacency in a real calendar, not an edge" => n1
n1^0
"case. A <= in the predicate makes every normal schedule look like a" => n2
n2^0
"conflict, which is usually 'fixed' by weakening something else instead of" => n3
n3^0
"by correcting the comparison." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def overlaps(a, b):
    return a[0] < b[1] and b[0] < a[1]

def overlaps_wrong_le(a, b):
    return a[0] <= b[1] and b[0] <= a[1]

def overlaps_wrong_oneway(a, b):
    return a[0] < b[1]

def shared_minutes(a, b):
    shared = 0
    for t in range(a[0], a[1]):
        if t >= b[0] and t < b[1]:
            shared = shared + 1
    return shared

bookings = [["standup", 540, 555], ["design review", 555, 615], ["1:1 with Ana", 600, 630], ["lunch", 720, 780], ["retro", 780, 840], ["deploy window", 810, 900], ["all-hands", 540, 600]]

def clock(m):
    h = int(m / 60)
    mins = m % 60
    hh = ""
    if h < 10:
        hh = "0"
    mm = ""
    if mins < 10:
        mm = "0"
    return hh + str(h) + ":" + mm + str(mins)

print("schedule:")
for b in bookings:
    print("  %-16s %s - %s" % (b[0], clock(b[1]), clock(b[2])))
print("")
print("conflicts (half-open, touching is fine):")
conflicts = []
i = 0
while i < len(bookings):
    j = i + 1
    while j < len(bookings):
        a = bookings[i]
        b = bookings[j]
        if overlaps([a[1], a[2]], [b[1], b[2]]):
            conflicts = conflicts + [[a[0], b[0], shared_minutes([a[1], a[2]], [b[1], b[2]])]]
        j = j + 1
    i = i + 1
if len(conflicts) == 0:
    print("  (none)")
for c in conflicts:
    print("  %-16s overlaps %-16s by %d minutes" % (c[0], c[1], c[2]))
print("")
agrees = 0
pairs = 0
le_wrong = 0
oneway_wrong = 0
touching = 0
i = 0
while i < len(bookings):
    j = i + 1
    while j < len(bookings):
        pairs = pairs + 1
        a = bookings[i]
        b = bookings[j]
        ai = [a[1], a[2]]
        bi = [b[1], b[2]]
        predicted = overlaps(ai, bi)
        actual = shared_minutes(ai, bi) > 0
        if predicted == actual:
            agrees = agrees + 1
        if not overlaps_wrong_le(ai, bi) == actual:
            le_wrong = le_wrong + 1
        if not overlaps_wrong_oneway(ai, bi) == actual:
            oneway_wrong = oneway_wrong + 1
        if ai[1] == bi[0] or bi[1] == ai[0]:
            touching = touching + 1
        j = j + 1
    i = i + 1
print("pairs compared:                    " + str(pairs))
print("predicate matches shared-minutes:  " + str(agrees) + "/" + str(pairs))
print("back-to-back adjacencies:          " + str(touching))
print("the <= version got wrong:          " + str(le_wrong))
print("the one-way version got wrong:     " + str(oneway_wrong))
print("")
print("The pair that decides it - standup ends exactly when design review begins:")
s = [540, 555]
d = [555, 615]
print("  correct  a[0] < b[1] and b[0] < a[1] : " + str(overlaps(s, d)))
print("  <= form  a[0] <= b[1] and b[0] <= a[1]: " + str(overlaps_wrong_le(s, d)))
print("  minutes actually shared:               " + str(shared_minutes(s, d)))
print("")
if agrees == pairs and touching > 0 and le_wrong > 0 and oneway_wrong > 0:
    verdict = "The predicate matches a minute-by-minute count on every pair."
else:
    verdict = "FAILED - the overlap predicate disagrees with the actual sharing."
print(verdict)
print("")
n1 = "Back-to-back is the most common adjacency in a real calendar, not an edge"
print(n1)
n2 = "case. A <= in the predicate makes every normal schedule look like a"
print(n2)
n3 = "conflict, which is usually 'fixed' by weakening something else instead of"
print(n3)
n4 = "by correcting the comparison."
print(n4)
```

## stdout (executed)

```text
schedule:
  standup          09:00 - 09:15
  design review    09:15 - 10:15
  1:1 with Ana     10:00 - 10:30
  lunch            12:00 - 13:00
  retro            13:00 - 14:00
  deploy window    13:30 - 15:00
  all-hands        09:00 - 10:00

conflicts (half-open, touching is fine):
  standup          overlaps all-hands        by 15 minutes
  design review    overlaps 1:1 with Ana     by 15 minutes
  design review    overlaps all-hands        by 45 minutes
  retro            overlaps deploy window    by 30 minutes

pairs compared:                    21
predicate matches shared-minutes:  21/21
back-to-back adjacencies:          3
the <= version got wrong:          3
the one-way version got wrong:     13

The pair that decides it - standup ends exactly when design review begins:
  correct  a[0] < b[1] and b[0] < a[1] : False
  <= form  a[0] <= b[1] and b[0] <= a[1]: True
  minutes actually shared:               0

The predicate matches a minute-by-minute count on every pair.

Back-to-back is the most common adjacency in a real calendar, not an edge
case. A <= in the predicate makes every normal schedule look like a
conflict, which is usually 'fixed' by weakening something else instead of
by correcting the comparison.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
