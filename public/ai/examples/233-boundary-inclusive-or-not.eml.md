<!-- canonical: efficientnewlanguage.org/ai/examples/233-boundary-inclusive-or-not | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 233 — Four readings of one sentence, differing on two values

`boundary_inclusive_or_not.eml` compares the four interval conventions and checks the property consecutive ranges need.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). "Between", which
# is four different questions.
#
# A range filter is written from a sentence, and the sentence is ambiguous:
#
#     "orders between 100 and 200"
#
# means [100, 200], [100, 200), (100, 200] or (100, 200) depending on who is
# asking. Every one of the four is a defensible reading and they differ on
# exactly two inputs - the endpoints - which is why the disagreement survives
# every test whose fixtures are in the middle.
#
# The failure is worse than picking wrong, because ranges are usually written
# in SEQUENCES. Consecutive buckets built from the same ambiguous sentence
# either double-count the boundary or drop it:
#
#     0-100, 100-200, 200-300
#
# with closed intervals, 100 lands in two buckets; with open ones, it lands in
# none. Both produce a report that adds up to something other than the total,
# and the discrepancy is exactly the number of records sitting on a boundary.
#
# The measurement is a partition check, which is the property the buckets need
# and the individual predicates cannot express: every record must land in
# exactly one bucket. It is computed by counting, not asserted.

def in_closed(x, lo, hi):
    return x >= lo and x <= hi

def in_half_open(x, lo, hi):
    return x >= lo and x < hi

def in_open(x, lo, hi):
    return x > lo and x < hi

def in_left_open(x, lo, hi):
    return x > lo and x <= hi

def member(which, x, lo, hi):
    if which == "closed":
        return in_closed(x, lo, hi)
    elif which == "half-open":
        return in_half_open(x, lo, hi)
    elif which == "open":
        return in_open(x, lo, hi)
    return in_left_open(x, lo, hi)


[["closed", "[100, 200]"], ["half-open", "[100, 200)"], ["open", "(100, 200)"], ["left-open", "(100, 200]"]] => kinds

"value   closed  half-open  open   left-open"^0
for x in [99, 100, 150, 200, 201]:
    ("%-7d %-7s %-10s %-6s %s" % (x, str(in_closed(x, 100, 200)), str(in_half_open(x, 100, 200)), str(in_open(x, 100, 200)), str(in_left_open(x, 100, 200))))^0

# --------------------------------------------- where the four disagree
0 => probed
0 => all_agree
[] => disagree_at
for x in [0:300]:
    probed + 1 => probed
    in_closed(x, 100, 200) => a
    in_half_open(x, 100, 200) => b
    in_open(x, 100, 200) => c
    in_left_open(x, 100, 200) => d
    if a == b and b == c and c == d:
        all_agree + 1 => all_agree
    else:
        disagree_at + [x] => disagree_at

""^0
("values probed:            " + str(probed))^0
("  all four agree:         " + str(all_agree))^0
("  they disagree at:       " + str(disagree_at))^0
("...two values out of " + str(probed) + ", and both of them are round numbers a person would type as a test.")^0

# ------------------------------------------------- consecutive buckets
[0, 100, 200, 300] => EDGES

def bucket_of(which, x):
    # Returns the index of the first bucket that accepts x, or -1.
    for i in [0:len(EDGES) - 2]:
        if member(which, x, EDGES[i], EDGES[i + 1]):
            return i
    return 0 - 1

def buckets_accepting(which, x):
    0 => c
    for i in [0:len(EDGES) - 2]:
        if member(which, x, EDGES[i], EDGES[i + 1]):
            c + 1 => c
    return c

""^0
"buckets 0-100, 100-200, 200-300 - how many accept each value:"^0
"value   closed  half-open  open   left-open"^0
for x in [0, 50, 100, 150, 200, 250, 300]:
    ("%-7d %-7d %-10d %-6d %d" % (x, buckets_accepting("closed", x), buckets_accepting("half-open", x), buckets_accepting("open", x), buckets_accepting("left-open", x)))^0

# ------------------------------------------------------- the partition check
# Every value in the full span must land in exactly ONE bucket. That is the
# property the report needs; no single predicate can state it.
{} => exactly_one
{} => double
{} => dropped
for pair in kinds:
    pair[0] => w
    0 => exactly_one[w]
    0 => double[w]
    0 => dropped[w]
for x in [0:300]:
    for pair in kinds:
        pair[0] => w
        buckets_accepting(w, x) => c
        if c == 1:
            exactly_one[w] + 1 => exactly_one[w]
        elif c > 1:
            double[w] + 1 => double[w]
        else:
            dropped[w] + 1 => dropped[w]

""^0
("partition check over " + str(probed) + " values:")^0
"kind         exactly one  double-counted  dropped"^0
for pair in kinds:
    pair[0] => w
    ("%-12s %-12d %-15d %d" % (w, exactly_one[w], double[w], dropped[w]))^0

# ------------------------------------------------- what the totals look like
# A report built on each convention. The counts are what a person sees; the
# discrepancy against the true total is what they do not.
[0, 50, 100, 100, 150, 200, 200, 250, 300] => orders
""^0
"a report over " + str(len(orders)) + " orders:"^0
"kind         b0   b1   b2   total  matches"^0
for pair in kinds:
    pair[0] => w
    [0, 0, 0] => counts
    for x in orders:
        for i in [0:len(EDGES) - 2]:
            if member(w, x, EDGES[i], EDGES[i + 1]):
                counts[i] + 1 => counts[i]
    counts[0] + counts[1] + counts[2] => tot
    ("%-12s %-4d %-4d %-4d %-6d %s" % (w, counts[0], counts[1], counts[2], tot, str(tot == len(orders))))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The four predicates must agree everywhere except the two endpoints.
checked + 1 => checked
if len(disagree_at) == 2 and disagree_at[0] == 100 and disagree_at[1] == 200:
    passed + 1 => passed

# Half-open must be the only convention that partitions the interior cleanly -
# it double-counts nothing.
checked + 1 => checked
if double["half-open"] == 0:
    passed + 1 => passed

# Closed must double-count, and open must drop. Opposite failures from the
# same ambiguity.
checked + 1 => checked
if double["closed"] > 0 and dropped["open"] > 0:
    passed + 1 => passed

# Half-open must still drop the very last edge - it is a partition of
# [0, 300), not of [0, 300], and pretending otherwise is how the last bucket
# quietly loses its top value.
checked + 1 => checked
if dropped["half-open"] == 1 and buckets_accepting("half-open", 300) == 0:
    passed + 1 => passed

# And the report total must match only for the convention that partitions.
checked + 1 => checked
0 => closed_total
0 => half_total
for x in orders:
    closed_total + buckets_accepting("closed", x) => closed_total
    half_total + buckets_accepting("half-open", x) => half_total
if closed_total > len(orders) and half_total < len(orders):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Four readings of one sentence, differing on two values, both of them round." => verdict
else:
    "FAILED - a convention did not behave as the checks describe." => verdict
verdict^0

""^0
"Half-open is the convention that makes consecutive ranges partition, which" => n1
n1^0
"is why it is the right default - and it still drops the final endpoint," => n2
n2^0
"so the last bucket needs an explicit closed upper edge. The ambiguity is" => n3
n3^0
"not removed by picking a convention; it is removed by writing the bounds" => n4
n4^0
"down where a reader can see which one was picked." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def in_closed(x, lo, hi):
    return x >= lo and x <= hi

def in_half_open(x, lo, hi):
    return x >= lo and x < hi

def in_open(x, lo, hi):
    return x > lo and x < hi

def in_left_open(x, lo, hi):
    return x > lo and x <= hi

def member(which, x, lo, hi):
    if which == "closed":
        return in_closed(x, lo, hi)
    elif which == "half-open":
        return in_half_open(x, lo, hi)
    elif which == "open":
        return in_open(x, lo, hi)
    return in_left_open(x, lo, hi)

kinds = [["closed", "[100, 200]"], ["half-open", "[100, 200)"], ["open", "(100, 200)"], ["left-open", "(100, 200]"]]
print("value   closed  half-open  open   left-open")
for x in [99, 100, 150, 200, 201]:
    print("%-7d %-7s %-10s %-6s %s" % (x, str(in_closed(x, 100, 200)), str(in_half_open(x, 100, 200)), str(in_open(x, 100, 200)), str(in_left_open(x, 100, 200))))
probed = 0
all_agree = 0
disagree_at = []
for x in range(0, 301):
    probed = probed + 1
    a = in_closed(x, 100, 200)
    b = in_half_open(x, 100, 200)
    c = in_open(x, 100, 200)
    d = in_left_open(x, 100, 200)
    if a == b and b == c and c == d:
        all_agree = all_agree + 1
    else:
        disagree_at = disagree_at + [x]
print("")
print("values probed:            " + str(probed))
print("  all four agree:         " + str(all_agree))
print("  they disagree at:       " + str(disagree_at))
print("...two values out of " + str(probed) + ", and both of them are round numbers a person would type as a test.")
EDGES = [0, 100, 200, 300]

def bucket_of(which, x):
    for i in range(0, len(EDGES) - 2+1):
        if member(which, x, EDGES[i], EDGES[i + 1]):
            return i
    return 0 - 1

def buckets_accepting(which, x):
    c = 0
    for i in range(0, len(EDGES) - 2+1):
        if member(which, x, EDGES[i], EDGES[i + 1]):
            c = c + 1
    return c

print("")
print("buckets 0-100, 100-200, 200-300 - how many accept each value:")
print("value   closed  half-open  open   left-open")
for x in [0, 50, 100, 150, 200, 250, 300]:
    print("%-7d %-7d %-10d %-6d %d" % (x, buckets_accepting("closed", x), buckets_accepting("half-open", x), buckets_accepting("open", x), buckets_accepting("left-open", x)))
exactly_one = {}
double = {}
dropped = {}
for pair in kinds:
    w = pair[0]
    exactly_one[w] = 0
    double[w] = 0
    dropped[w] = 0
for x in range(0, 301):
    for pair in kinds:
        w = pair[0]
        c = buckets_accepting(w, x)
        if c == 1:
            exactly_one[w] = exactly_one[w] + 1
        elif c > 1:
            double[w] = double[w] + 1
        else:
            dropped[w] = dropped[w] + 1
print("")
print("partition check over " + str(probed) + " values:")
print("kind         exactly one  double-counted  dropped")
for pair in kinds:
    w = pair[0]
    print("%-12s %-12d %-15d %d" % (w, exactly_one[w], double[w], dropped[w]))
orders = [0, 50, 100, 100, 150, 200, 200, 250, 300]
print("")
print("a report over " + str(len(orders)) + " orders:")
print("kind         b0   b1   b2   total  matches")
for pair in kinds:
    w = pair[0]
    counts = [0, 0, 0]
    for x in orders:
        for i in range(0, len(EDGES) - 2+1):
            if member(w, x, EDGES[i], EDGES[i + 1]):
                counts[i] = counts[i] + 1
    tot = counts[0] + counts[1] + counts[2]
    print("%-12s %-4d %-4d %-4d %-6d %s" % (w, counts[0], counts[1], counts[2], tot, str(tot == len(orders))))
passed = 0
checked = 0
checked = checked + 1
if len(disagree_at) == 2 and disagree_at[0] == 100 and disagree_at[1] == 200:
    passed = passed + 1
checked = checked + 1
if double["half-open"] == 0:
    passed = passed + 1
checked = checked + 1
if double["closed"] > 0 and dropped["open"] > 0:
    passed = passed + 1
checked = checked + 1
if dropped["half-open"] == 1 and buckets_accepting("half-open", 300) == 0:
    passed = passed + 1
checked = checked + 1
closed_total = 0
half_total = 0
for x in orders:
    closed_total = closed_total + buckets_accepting("closed", x)
    half_total = half_total + buckets_accepting("half-open", x)
if closed_total > len(orders) and half_total < len(orders):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Four readings of one sentence, differing on two values, both of them round."
else:
    verdict = "FAILED - a convention did not behave as the checks describe."
print(verdict)
print("")
n1 = "Half-open is the convention that makes consecutive ranges partition, which"
print(n1)
n2 = "is why it is the right default - and it still drops the final endpoint,"
print(n2)
n3 = "so the last bucket needs an explicit closed upper edge. The ambiguity is"
print(n3)
n4 = "not removed by picking a convention; it is removed by writing the bounds"
print(n4)
n5 = "down where a reader can see which one was picked."
print(n5)
```

## stdout (executed)

```text
value   closed  half-open  open   left-open
99      False   False      False  False
100     True    True       False  False
150     True    True       True   True
200     True    False      False  True
201     False   False      False  False

values probed:            301
  all four agree:         299
  they disagree at:       [100, 200]
...two values out of 301, and both of them are round numbers a person would type as a test.

buckets 0-100, 100-200, 200-300 - how many accept each value:
value   closed  half-open  open   left-open
0       1       1          0      0
50      1       1          1      1
100     2       1          0      1
150     1       1          1      1
200     2       1          0      1
250     1       1          1      1
300     1       0          0      1

partition check over 301 values:
kind         exactly one  double-counted  dropped
closed       299          2               0
half-open    300          0               1
open         297          0               4
left-open    300          0               1

a report over 9 orders:
kind         b0   b1   b2   total  matches
closed       4    5    4    13     False
half-open    2    3    3    8      False
open         1    1    1    3      False
left-open    3    3    2    8      False

checks passed: 5/5
Four readings of one sentence, differing on two values, both of them round.

Half-open is the convention that makes consecutive ranges partition, which
is why it is the right default - and it still drops the final endpoint,
so the last bucket needs an explicit closed upper edge. The ambiguity is
not removed by picking a convention; it is removed by writing the bounds
down where a reader can see which one was picked.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
