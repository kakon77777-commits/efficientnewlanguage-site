<!-- canonical: efficientnewlanguage.org/ai/examples/239-integer-division-sign | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 239 — Two right answers to -7 / 2

`integer_division_sign.eml` implements truncating division alongside Python's floor division and checks both against the identity that defines them.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Dividing a
# negative number, which four languages do three different ways.
#
# There are two defensible answers to `-7 / 2` in integers:
#
#     floor      -4    round toward negative infinity   (Python, Ruby)
#     truncate   -3    round toward zero                (C, Java, Go, Rust)
#
# and the remainder follows from whichever you picked, because the identity
# that must hold is:
#
#     q * b + r == a
#
# So Python's `-7 % 2` is 1 and C's is -1. Both are correct; they are
# answers to different questions. What is never correct is mixing them, which
# is exactly what happens when an algorithm is prototyped in one and shipped
# in the other.
#
# The place this bites hardest is anything cyclic - a ring buffer index, a day
# of the week, a hue - because those are all `x % n` and the two conventions
# disagree on precisely the inputs that wrap backwards.
#
# EML-P follows Python. This program implements the truncating convention
# explicitly and checks BOTH against the identity, so neither is treated as
# the reference. Then it measures where they disagree, and shows the wrapping
# idiom that is correct under either.

def trunc_div(a, b):
    # Round toward zero. `int()` in Python truncates, which is the whole
    # mechanism - and the reason `int(a / b)` is not the same as `a // b`.
    if b == 0:
        raise ZeroDivisionError("integer division or modulo by zero")
    0 => neg
    a => x
    b => y
    if x < 0:
        1 - neg => neg
        0 - x => x
    if y < 0:
        1 - neg => neg
        0 - y => y
    int(x / y) => q
    if neg == 1:
        return 0 - q
    return q

def trunc_mod(a, b):
    return a - trunc_div(a, b) * b

def floor_div(a, b):
    if b == 0:
        raise ZeroDivisionError("integer division or modulo by zero")
    return int((a - a % b) / b)

def floor_mod(a, b):
    return a % b


"a     b     floor q  floor r   trunc q  trunc r   agree"^0
0 => cells
0 => agree
0 => floor_identity
0 => trunc_identity
[] => disagreements
for a in [7, 0 - 7, 8, 0 - 8, 1, 0 - 1, 0, 15, 0 - 15]:
    for b in [2, 0 - 2, 3, 0 - 3]:
        cells + 1 => cells
        floor_div(a, b) => fq
        floor_mod(a, b) => fr
        trunc_div(a, b) => tq
        trunc_mod(a, b) => tr
        if fq * b + fr == a:
            floor_identity + 1 => floor_identity
        if tq * b + tr == a:
            trunc_identity + 1 => trunc_identity
        "yes" => same
        if not (fq == tq):
            "NO" => same
            if len(disagreements) < 4:
                disagreements + [str(a) + "/" + str(b) + ": floor " + str(fq) + " rem " + str(fr) + ", trunc " + str(tq) + " rem " + str(tr)] => disagreements
        else:
            agree + 1 => agree
        if a == 7 or a == 0 - 7 or a == 0 - 8:
            ("%-5d %-5d %-8d %-9d %-8d %-9d %s" % (a, b, fq, fr, tq, tr, same))^0

""^0
("(a, b) pairs checked:            " + str(cells))^0
("  q * b + r == a, floor:         " + str(floor_identity) + "/" + str(cells))^0
("  q * b + r == a, truncate:      " + str(trunc_identity) + "/" + str(cells))^0
("  the two conventions agree on:  " + str(agree) + "/" + str(cells))^0
""^0
"where they part:"^0
for d in disagreements:
    ("  " + d)^0

# ------------------------------------------------- the sign of the remainder
0 => floor_sign_follows_divisor
0 => trunc_sign_follows_dividend
0 => nonzero
for a in [7, 0 - 7, 8, 0 - 8, 15, 0 - 15]:
    for b in [2, 0 - 2, 3, 0 - 3]:
        floor_mod(a, b) => fr
        trunc_mod(a, b) => tr
        if not (fr == 0):
            nonzero + 1 => nonzero
            if (fr > 0 and b > 0) or (fr < 0 and b < 0):
                floor_sign_follows_divisor + 1 => floor_sign_follows_divisor
            if (tr > 0 and a > 0) or (tr < 0 and a < 0):
                trunc_sign_follows_dividend + 1 => trunc_sign_follows_dividend

""^0
("non-zero remainders:                        " + str(nonzero))^0
("  floor: remainder has the DIVISOR's sign:  " + str(floor_sign_follows_divisor) + "/" + str(nonzero))^0
("  trunc: remainder has the DIVIDEND's sign: " + str(trunc_sign_follows_dividend) + "/" + str(nonzero))^0

# ------------------------------------------------------ the wrapping idiom
# A ring buffer index. `i % n` is correct under floor and wrong under
# truncation for negative i; `((i % n) + n) % n` is correct under both, which
# is why it is worth writing even in Python.
8 => RING
"index  i%n   trunc i%n   ((i%n)+n)%n   in range"^0
0 => naive_in_range
0 => safe_in_range
0 => probes
for i in [0 - 3:11]:
    probes + 1 => probes
    trunc_mod(i, RING) => t
    floor_mod(i, RING) => f
    floor_mod(floor_mod(i, RING) + RING, RING) => safe
    if t >= 0 and t < RING:
        naive_in_range + 1 => naive_in_range
    if safe >= 0 and safe < RING:
        safe_in_range + 1 => safe_in_range
    if i < 2 or i > 8:
        "yes" => ok
        if t < 0 or t >= RING:
            "NO" => ok
        ("%-6d %-5d %-11d %-13d %s" % (i, f, t, safe, ok))^0

""^0
("ring indices probed:                   " + str(probes))^0
("  truncating remainder in range:       " + str(naive_in_range) + "/" + str(probes))^0
("  ((i%n)+n)%n in range:                " + str(safe_in_range) + "/" + str(probes))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Both conventions must satisfy the identity on every pair. Neither is being
# treated as the reference - this is what makes them both correct.
checked + 1 => checked
if floor_identity == cells and trunc_identity == cells:
    passed + 1 => passed

# They must disagree somewhere, and agree somewhere, or there is no
# convention to choose.
checked + 1 => checked
if agree > 0 and agree < cells:
    passed + 1 => passed

# The remainder signs must follow the stated rule in every non-zero case.
checked + 1 => checked
if floor_sign_follows_divisor == nonzero and trunc_sign_follows_dividend == nonzero:
    passed + 1 => passed

# The truncating remainder must leave the ring range for negative indices,
# and the guarded idiom must not.
checked + 1 => checked
if naive_in_range < probes and safe_in_range == probes:
    passed + 1 => passed

# And division by zero must raise under both, with the same class.
checked + 1 => checked
0 => raised
try:
    floor_div(1, 0) => v
except ZeroDivisionError as e:
    raised + 1 => raised
try:
    trunc_div(1, 0) => v
except ZeroDivisionError as e:
    raised + 1 => raised
if raised == 2:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Both conventions satisfy the identity. Only one of them is the one you meant." => verdict
else:
    "FAILED - a convention did not behave as the checks describe." => verdict
verdict^0

""^0
"Neither answer is a bug. The bug is the assumption that there is only one," => n1
n1^0
"which survives because every test with non-negative inputs passes under" => n2
n2^0
"both - and non-negative inputs are what test fixtures are made of. The" => n3
n3^0
"guarded wrap costs one addition and removes the question entirely." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def trunc_div(a, b):
    if b == 0:
        raise ZeroDivisionError("integer division or modulo by zero")
    neg = 0
    x = a
    y = b
    if x < 0:
        neg = 1 - neg
        x = 0 - x
    if y < 0:
        neg = 1 - neg
        y = 0 - y
    q = int(x / y)
    if neg == 1:
        return 0 - q
    return q

def trunc_mod(a, b):
    return a - trunc_div(a, b) * b

def floor_div(a, b):
    if b == 0:
        raise ZeroDivisionError("integer division or modulo by zero")
    return int((a - a % b) / b)

def floor_mod(a, b):
    return a % b

print("a     b     floor q  floor r   trunc q  trunc r   agree")
cells = 0
agree = 0
floor_identity = 0
trunc_identity = 0
disagreements = []
for a in [7, 0 - 7, 8, 0 - 8, 1, 0 - 1, 0, 15, 0 - 15]:
    for b in [2, 0 - 2, 3, 0 - 3]:
        cells = cells + 1
        fq = floor_div(a, b)
        fr = floor_mod(a, b)
        tq = trunc_div(a, b)
        tr = trunc_mod(a, b)
        if fq * b + fr == a:
            floor_identity = floor_identity + 1
        if tq * b + tr == a:
            trunc_identity = trunc_identity + 1
        same = "yes"
        if not fq == tq:
            same = "NO"
            if len(disagreements) < 4:
                disagreements = disagreements + [str(a) + "/" + str(b) + ": floor " + str(fq) + " rem " + str(fr) + ", trunc " + str(tq) + " rem " + str(tr)]
        else:
            agree = agree + 1
        if a == 7 or a == 0 - 7 or a == 0 - 8:
            print("%-5d %-5d %-8d %-9d %-8d %-9d %s" % (a, b, fq, fr, tq, tr, same))
print("")
print("(a, b) pairs checked:            " + str(cells))
print("  q * b + r == a, floor:         " + str(floor_identity) + "/" + str(cells))
print("  q * b + r == a, truncate:      " + str(trunc_identity) + "/" + str(cells))
print("  the two conventions agree on:  " + str(agree) + "/" + str(cells))
print("")
print("where they part:")
for d in disagreements:
    print("  " + d)
floor_sign_follows_divisor = 0
trunc_sign_follows_dividend = 0
nonzero = 0
for a in [7, 0 - 7, 8, 0 - 8, 15, 0 - 15]:
    for b in [2, 0 - 2, 3, 0 - 3]:
        fr = floor_mod(a, b)
        tr = trunc_mod(a, b)
        if not fr == 0:
            nonzero = nonzero + 1
            if fr > 0 and b > 0 or fr < 0 and b < 0:
                floor_sign_follows_divisor = floor_sign_follows_divisor + 1
            if tr > 0 and a > 0 or tr < 0 and a < 0:
                trunc_sign_follows_dividend = trunc_sign_follows_dividend + 1
print("")
print("non-zero remainders:                        " + str(nonzero))
print("  floor: remainder has the DIVISOR's sign:  " + str(floor_sign_follows_divisor) + "/" + str(nonzero))
print("  trunc: remainder has the DIVIDEND's sign: " + str(trunc_sign_follows_dividend) + "/" + str(nonzero))
RING = 8
print("index  i%n   trunc i%n   ((i%n)+n)%n   in range")
naive_in_range = 0
safe_in_range = 0
probes = 0
for i in range(0 - 3, 12):
    probes = probes + 1
    t = trunc_mod(i, RING)
    f = floor_mod(i, RING)
    safe = floor_mod(floor_mod(i, RING) + RING, RING)
    if t >= 0 and t < RING:
        naive_in_range = naive_in_range + 1
    if safe >= 0 and safe < RING:
        safe_in_range = safe_in_range + 1
    if i < 2 or i > 8:
        ok = "yes"
        if t < 0 or t >= RING:
            ok = "NO"
        print("%-6d %-5d %-11d %-13d %s" % (i, f, t, safe, ok))
print("")
print("ring indices probed:                   " + str(probes))
print("  truncating remainder in range:       " + str(naive_in_range) + "/" + str(probes))
print("  ((i%n)+n)%n in range:                " + str(safe_in_range) + "/" + str(probes))
passed = 0
checked = 0
checked = checked + 1
if floor_identity == cells and trunc_identity == cells:
    passed = passed + 1
checked = checked + 1
if agree > 0 and agree < cells:
    passed = passed + 1
checked = checked + 1
if floor_sign_follows_divisor == nonzero and trunc_sign_follows_dividend == nonzero:
    passed = passed + 1
checked = checked + 1
if naive_in_range < probes and safe_in_range == probes:
    passed = passed + 1
checked = checked + 1
raised = 0
try:
    v = floor_div(1, 0)
except ZeroDivisionError as e:
    raised = raised + 1
try:
    v = trunc_div(1, 0)
except ZeroDivisionError as e:
    raised = raised + 1
if raised == 2:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Both conventions satisfy the identity. Only one of them is the one you meant."
else:
    verdict = "FAILED - a convention did not behave as the checks describe."
print(verdict)
print("")
n1 = "Neither answer is a bug. The bug is the assumption that there is only one,"
print(n1)
n2 = "which survives because every test with non-negative inputs passes under"
print(n2)
n3 = "both - and non-negative inputs are what test fixtures are made of. The"
print(n3)
n4 = "guarded wrap costs one addition and removes the question entirely."
print(n4)
```

## stdout (executed)

```text
a     b     floor q  floor r   trunc q  trunc r   agree
7     2     3        1         3        1         yes
7     -2    -4       -1        -3       1         NO
7     3     2        1         2        1         yes
7     -3    -3       -2        -2       1         NO
-7    2     -4       1         -3       -1        NO
-7    -2    3        -1        3        -1        yes
-7    3     -3       2         -2       -1        NO
-7    -3    2        -1        2        -1        yes
-8    2     -4       0         -4       0         yes
-8    -2    4        0         4        0         yes
-8    3     -3       1         -2       -2        NO
-8    -3    2        -2        2        -2        yes

(a, b) pairs checked:            36
  q * b + r == a, floor:         36/36
  q * b + r == a, truncate:      36/36
  the two conventions agree on:  24/36

where they part:
  7/-2: floor -4 rem -1, trunc -3 rem 1
  7/-3: floor -3 rem -2, trunc -2 rem 1
  -7/2: floor -4 rem 1, trunc -3 rem -1
  -7/3: floor -3 rem 2, trunc -2 rem -1

non-zero remainders:                        16
  floor: remainder has the DIVISOR's sign:  16/16
  trunc: remainder has the DIVIDEND's sign: 16/16
index  i%n   trunc i%n   ((i%n)+n)%n   in range
-3     5     -3          5             NO
-2     6     -2          6             NO
-1     7     -1          7             NO
0      0     0           0             yes
1      1     1           1             yes
9      1     1           1             yes
10     2     2           2             yes
11     3     3           3             yes

ring indices probed:                   15
  truncating remainder in range:       12/15
  ((i%n)+n)%n in range:                15/15

checks passed: 5/5
Both conventions satisfy the identity. Only one of them is the one you meant.

Neither answer is a bug. The bug is the assumption that there is only one,
which survives because every test with non-negative inputs passes under
both - and non-negative inputs are what test fixtures are made of. The
guarded wrap costs one addition and removes the question entirely.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:output · eml:assign · eml:call · eml:return · eml:run:done
