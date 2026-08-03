<!-- canonical: efficientnewlanguage.org/ai/examples/231-apportionment-remainder | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 231 — Every part rounded correctly, and the total is wrong

`apportionment_remainder.eml` allocates a whole across shares three ways and checks that the parts sum back to the whole.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Splitting a whole
# into parts that add back up to the whole.
#
# Allocate 100 units across shares of 33.3%, 33.3% and 33.4%. Round each and
# the parts sum to 100. Change the shares slightly and they sum to 99, or 101,
# and the discrepancy appears in a place nobody is looking:
#
#     a total that does not match its own breakdown
#     a percentage column that adds to 99.9%
#     a payment split where one cent is missing every month
#
# Rounding each part independently is the mistake. Each rounding is correct in
# isolation, the sum of correct roundings is not a correct sum, and there is no
# rounding rule that fixes it - the constraint is global and each decision is
# local.
#
# What works is largest remainder: floor everything, then hand the leftover
# units one at a time to whoever lost the most in the flooring. It always sums
# to the total, by construction, because it distributes exactly the deficit.
#
# It also has a cost, and the cost is the interesting part: the answer depends
# on the ORDER of the ties. Two shares with identical remainders cannot both
# get the last unit, so the method has to break the tie somehow, and whatever
# it picks is arbitrary. Largest remainder converts "the parts do not add up"
# into "the parts add up and one of them is arbitrary", which is a strictly
# better problem and not the same as no problem.
#
# All three methods are swept over many share vectors and the sum is checked
# every time.

def round_half_up(x_num, x_den):
    # Round a rational to an integer without floats, so the rounding rule is
    # exact and cannot be blamed for the sums below.
    return int((2 * x_num + x_den) / (2 * x_den))

def alloc_round_each(total, shares):
    # Round each share independently. The obvious method.
    0 => denom
    for s in shares:
        denom + s => denom
    [] => out
    for s in shares:
        out + [round_half_up(total * s, denom)] => out
    return out

def alloc_floor(total, shares):
    0 => denom
    for s in shares:
        denom + s => denom
    [] => out
    for s in shares:
        out + [int(total * s / denom)] => out
    return out

def alloc_largest_remainder(total, shares):
    0 => denom
    for s in shares:
        denom + s => denom
    [] => base
    [] => rem
    0 => used
    for s in shares:
        int(total * s / denom) => q
        base + [q] => base
        rem + [total * s - q * denom] => rem
        used + q => used
    total - used => left
    # Hand out the remaining units to the largest remainders, ties going to
    # the earlier index. That tie rule is a DECISION, not a derivation.
    for k in [1:left]:
        0 => best
        0 - 1 => best_rem
        for i in [0:len(rem) - 1]:
            if rem[i] > best_rem:
                rem[i] => best_rem
                i => best
        base[best] + 1 => base[best]
        0 - 1 => rem[best]
    return base

def sum_of(xs):
    0 => t
    for x in xs:
        t + x => t
    return t

def render(xs):
    "" => s
    for x in xs:
        if len(s) > 0:
            s + "," => s
        s + str(x) => s
    return s


[
    [100, [1, 1, 1]],
    [100, [333, 333, 334]],
    [100, [1, 1, 1, 1, 1, 1]],
    [1000, [17, 41, 42]],
    [7, [1, 1, 1]],
    [10, [1, 2, 3, 4]],
    [99, [1, 1, 1, 1, 1, 1, 1]],
    [255, [3, 3, 3, 3, 3]]
] => cases

"total  shares              round-each     sum   floor          sum   largest-rem    sum"^0
0 => n
0 => round_ok
0 => floor_ok
0 => lr_ok
for c in cases:
    n + 1 => n
    c[0] => total
    c[1] => shares
    alloc_round_each(total, shares) => a
    alloc_floor(total, shares) => b
    alloc_largest_remainder(total, shares) => d
    if sum_of(a) == total:
        round_ok + 1 => round_ok
    if sum_of(b) == total:
        floor_ok + 1 => floor_ok
    if sum_of(d) == total:
        lr_ok + 1 => lr_ok
    ("%-6d %-19s %-14s %-5d %-14s %-5d %-14s %d" % (total, render(shares), render(a), sum_of(a), render(b), sum_of(b), render(d), sum_of(d)))^0

""^0
("share vectors checked:        " + str(n))^0
("  round-each summed right:    " + str(round_ok) + "/" + str(n))^0
("  floor summed right:         " + str(floor_ok) + "/" + str(n))^0
("  largest-remainder summed:   " + str(lr_ok) + "/" + str(n))^0

# ---------------------------------------------- how far off the naive one gets
0 => worst_over
0 => worst_under
for c in cases:
    sum_of(alloc_round_each(c[0], c[1])) - c[0] => d
    if d > worst_over:
        d => worst_over
    if d < worst_under:
        d => worst_under

""^0
("round-each overshoot, worst:  +" + str(worst_over))^0
("round-each shortfall, worst:  " + str(worst_under))^0

# --------------------------------------------- the arbitrariness it introduces
# Equal shares with a total that does not divide evenly: somebody gets more,
# and which one is decided by the tie rule rather than by the data.
alloc_largest_remainder(100, [1, 1, 1]) => three_way
0 => distinct_values
{} => seen_vals
for v in three_way:
    1 => seen_vals[v]

""^0
("100 split three equal ways: " + render(three_way))^0
("distinct amounts:           " + str(len(seen_vals)))^0
("...the sum is exact and the recipients are not equal.")^0
("Whoever is listed first gets the extra unit. That is the tie rule, not the data.")^0

# ------------------------------------ each individual rounding is still correct
# The naive method is not making a rounding error. Every one of its parts is
# the correctly rounded value of its own share - which is why reviewing the
# parts one at a time finds nothing.
0 => parts_correct
0 => parts_total
for c in cases:
    c[0] => total
    c[1] => shares
    0 => denom
    for s in shares:
        denom + s => denom
    alloc_round_each(total, shares) => a
    for i in [0:len(shares) - 1]:
        parts_total + 1 => parts_total
        if a[i] == round_half_up(total * shares[i], denom):
            parts_correct + 1 => parts_correct

""^0
("individually correct roundings: " + str(parts_correct) + "/" + str(parts_total))^0
("share vectors whose SUM is wrong: " + str(n - round_ok) + "/" + str(n))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Largest remainder must always sum to the total. This is the property.
checked + 1 => checked
if lr_ok == n:
    passed + 1 => passed

# Both naive methods must fail somewhere, in opposite directions - flooring
# undershoots, rounding can go either way.
checked + 1 => checked
if round_ok < n and floor_ok < n:
    passed + 1 => passed

# Every individual rounding in the naive method must be correct. That is what
# makes this a global problem rather than a local bug.
checked + 1 => checked
if parts_correct == parts_total:
    passed + 1 => passed

# Largest remainder must never give anyone less than the floor, or it would
# be taking units away rather than distributing the deficit.
checked + 1 => checked
0 => never_below
0 => compared
for c in cases:
    alloc_floor(c[0], c[1]) => f
    alloc_largest_remainder(c[0], c[1]) => l
    for i in [0:len(f) - 1]:
        compared + 1 => compared
        if l[i] >= f[i]:
            never_below + 1 => never_below
if never_below == compared:
    passed + 1 => passed

# And an even split must be exact, so the method is not adding arbitrariness
# where none exists.
checked + 1 => checked
alloc_largest_remainder(99, [1, 1, 1]) => even
if even[0] == 33 and even[1] == 33 and even[2] == 33:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Every part rounded correctly, and the total is wrong. The constraint is global." => verdict
else:
    "FAILED - a method did not behave as the checks describe." => verdict
verdict^0

""^0
"Reviewing the parts one at a time finds nothing, because every part IS" => n1
n1^0
"correctly rounded. The defect exists only in the sum, which is a property" => n2
n2^0
"no single decision owns - and largest remainder does not remove the" => n3
n3^0
"difficulty so much as move it somewhere a person can see it: the total is" => n4
n4^0
"now exact and one recipient was chosen by the tie rule." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def round_half_up(x_num, x_den):
    return int((2 * x_num + x_den) / (2 * x_den))

def alloc_round_each(total, shares):
    denom = 0
    for s in shares:
        denom = denom + s
    out = []
    for s in shares:
        out = out + [round_half_up(total * s, denom)]
    return out

def alloc_floor(total, shares):
    denom = 0
    for s in shares:
        denom = denom + s
    out = []
    for s in shares:
        out = out + [int(total * s / denom)]
    return out

def alloc_largest_remainder(total, shares):
    denom = 0
    for s in shares:
        denom = denom + s
    base = []
    rem = []
    used = 0
    for s in shares:
        q = int(total * s / denom)
        base = base + [q]
        rem = rem + [total * s - q * denom]
        used = used + q
    left = total - used
    for k in range(1, left+1):
        best = 0
        best_rem = 0 - 1
        for i in range(0, len(rem)):
            if rem[i] > best_rem:
                best_rem = rem[i]
                best = i
        base[best] = base[best] + 1
        rem[best] = 0 - 1
    return base

def sum_of(xs):
    t = 0
    for x in xs:
        t = t + x
    return t

def render(xs):
    s = ""
    for x in xs:
        if len(s) > 0:
            s = s + ","
        s = s + str(x)
    return s

cases = [[100, [1, 1, 1]], [100, [333, 333, 334]], [100, [1, 1, 1, 1, 1, 1]], [1000, [17, 41, 42]], [7, [1, 1, 1]], [10, [1, 2, 3, 4]], [99, [1, 1, 1, 1, 1, 1, 1]], [255, [3, 3, 3, 3, 3]]]
print("total  shares              round-each     sum   floor          sum   largest-rem    sum")
n = 0
round_ok = 0
floor_ok = 0
lr_ok = 0
for c in cases:
    n = n + 1
    total = c[0]
    shares = c[1]
    a = alloc_round_each(total, shares)
    b = alloc_floor(total, shares)
    d = alloc_largest_remainder(total, shares)
    if sum_of(a) == total:
        round_ok = round_ok + 1
    if sum_of(b) == total:
        floor_ok = floor_ok + 1
    if sum_of(d) == total:
        lr_ok = lr_ok + 1
    print("%-6d %-19s %-14s %-5d %-14s %-5d %-14s %d" % (total, render(shares), render(a), sum_of(a), render(b), sum_of(b), render(d), sum_of(d)))
print("")
print("share vectors checked:        " + str(n))
print("  round-each summed right:    " + str(round_ok) + "/" + str(n))
print("  floor summed right:         " + str(floor_ok) + "/" + str(n))
print("  largest-remainder summed:   " + str(lr_ok) + "/" + str(n))
worst_over = 0
worst_under = 0
for c in cases:
    d = sum_of(alloc_round_each(c[0], c[1])) - c[0]
    if d > worst_over:
        worst_over = d
    if d < worst_under:
        worst_under = d
print("")
print("round-each overshoot, worst:  +" + str(worst_over))
print("round-each shortfall, worst:  " + str(worst_under))
three_way = alloc_largest_remainder(100, [1, 1, 1])
distinct_values = 0
seen_vals = {}
for v in three_way:
    seen_vals[v] = 1
print("")
print("100 split three equal ways: " + render(three_way))
print("distinct amounts:           " + str(len(seen_vals)))
print("...the sum is exact and the recipients are not equal.")
print("Whoever is listed first gets the extra unit. That is the tie rule, not the data.")
parts_correct = 0
parts_total = 0
for c in cases:
    total = c[0]
    shares = c[1]
    denom = 0
    for s in shares:
        denom = denom + s
    a = alloc_round_each(total, shares)
    for i in range(0, len(shares)):
        parts_total = parts_total + 1
        if a[i] == round_half_up(total * shares[i], denom):
            parts_correct = parts_correct + 1
print("")
print("individually correct roundings: " + str(parts_correct) + "/" + str(parts_total))
print("share vectors whose SUM is wrong: " + str(n - round_ok) + "/" + str(n))
passed = 0
checked = 0
checked = checked + 1
if lr_ok == n:
    passed = passed + 1
checked = checked + 1
if round_ok < n and floor_ok < n:
    passed = passed + 1
checked = checked + 1
if parts_correct == parts_total:
    passed = passed + 1
checked = checked + 1
never_below = 0
compared = 0
for c in cases:
    f = alloc_floor(c[0], c[1])
    l = alloc_largest_remainder(c[0], c[1])
    for i in range(0, len(f)):
        compared = compared + 1
        if l[i] >= f[i]:
            never_below = never_below + 1
if never_below == compared:
    passed = passed + 1
checked = checked + 1
even = alloc_largest_remainder(99, [1, 1, 1])
if even[0] == 33 and even[1] == 33 and even[2] == 33:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Every part rounded correctly, and the total is wrong. The constraint is global."
else:
    verdict = "FAILED - a method did not behave as the checks describe."
print(verdict)
print("")
n1 = "Reviewing the parts one at a time finds nothing, because every part IS"
print(n1)
n2 = "correctly rounded. The defect exists only in the sum, which is a property"
print(n2)
n3 = "no single decision owns - and largest remainder does not remove the"
print(n3)
n4 = "difficulty so much as move it somewhere a person can see it: the total is"
print(n4)
n5 = "now exact and one recipient was chosen by the tie rule."
print(n5)
```

## stdout (executed)

```text
total  shares              round-each     sum   floor          sum   largest-rem    sum
100    1,1,1               33,33,33       99    33,33,33       99    34,33,33       100
100    333,333,334         33,33,33       99    33,33,33       99    33,33,34       100
100    1,1,1,1,1,1         17,17,17,17,17,17 102   16,16,16,16,16,16 96    17,17,17,17,16,16 100
1000   17,41,42            170,410,420    1000  170,410,420    1000  170,410,420    1000
7      1,1,1               2,2,2          6     2,2,2          6     3,2,2          7
10     1,2,3,4             1,2,3,4        10    1,2,3,4        10    1,2,3,4        10
99     1,1,1,1,1,1,1       14,14,14,14,14,14,14 98    14,14,14,14,14,14,14 98    15,14,14,14,14,14,14 99
255    3,3,3,3,3           51,51,51,51,51 255   51,51,51,51,51 255   51,51,51,51,51 255

share vectors checked:        8
  round-each summed right:    3/8
  floor summed right:         3/8
  largest-remainder summed:   8/8

round-each overshoot, worst:  +2
round-each shortfall, worst:  -1

100 split three equal ways: 34,33,33
distinct amounts:           2
...the sum is exact and the recipients are not equal.
Whoever is listed first gets the extra unit. That is the tie rule, not the data.

individually correct roundings: 34/34
share vectors whose SUM is wrong: 5/8

checks passed: 5/5
Every part rounded correctly, and the total is wrong. The constraint is global.

Reviewing the parts one at a time finds nothing, because every part IS
correctly rounded. The defect exists only in the sum, which is a property
no single decision owns - and largest remainder does not remove the
difficulty so much as move it somewhere a person can see it: the total is
now exact and one recipient was chosen by the tie rule.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
