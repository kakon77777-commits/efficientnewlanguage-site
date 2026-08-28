<!-- canonical: efficientnewlanguage.org/ai/examples/234-catastrophic-cancellation | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 234 — Same algebra, and one arrangement keeps its digits

`catastrophic_cancellation.eml` computes variance, a quadratic root and a difference of squares two ways each, against an exact reference.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Subtracting two
# numbers that are almost equal.
#
# Floating point loses precision gradually everywhere and catastrophically in
# one place: subtracting values that agree in their leading digits. The
# agreeing digits cancel, and what is left is the part that was already noise:
#
#     1000000.1 - 1000000.0   the answer has ONE significant digit left
#
# The result is not slightly wrong. It can have no correct digits at all, and
# it is a perfectly ordinary float that carries no mark of what happened.
#
# Three formulas that are algebraically identical and numerically are not:
#
#     variance    E[x^2] - E[x]^2      cancels when the mean is large
#                 sum (x - mean)^2     two passes, no cancellation
#     quadratic   (-b + sqrt(D)) / 2a  cancels when b^2 >> 4ac
#                 the Vieta form       computes the small root from the large,
#                                      using x1 * x2 = c/a
#     difference  (a*a - b*b)          cancels when a is near b
#                 (a + b) * (a - b)    the subtraction happens once, on the
#                                      inputs, where they still have digits
#
# In each pair the second is the same mathematics rearranged so the
# subtraction happens on values that still have significant digits to lose.
#
# The measurement is an exact reference: the same computations are done in
# integers, where EML-P has arbitrary precision and there is no rounding at
# all. That is the oracle - not a hand-typed expected value, and not the other
# float formula.

def sqrt_of(x):
    # Newton's method. Converges to the float square root; used by both
    # quadratic formulas so it is not the variable under test.
    if x <= 0.0:
        return 0.0
    x => g
    for i in [1:40]:
        (g + x / g) / 2.0 => g
    return g

def abs_of(x):
    if x < 0:
        return 0 - x
    return x

def rel_error(got, exact):
    # Relative error in parts per million, computed against an exact integer
    # reference converted at the last moment.
    if exact == 0.0:
        return int(abs_of(got) * 1000000)
    return int(abs_of(got - exact) * 1000000.0 / abs_of(exact))


# ---------------------------------------------------------------- variance
# Values are integers, so the exact variance is a rational computed in
# integers with no rounding anywhere.
def variance_naive(xs):
    0.0 => s
    0.0 => s2
    for x in xs:
        s + float(x) => s
        s2 + float(x) * float(x) => s2
    float(len(xs)) => n
    return s2 / n - (s / n) * (s / n)

def variance_two_pass(xs):
    0.0 => s
    for x in xs:
        s + float(x) => s
    s / float(len(xs)) => mean
    0.0 => acc
    for x in xs:
        (float(x) - mean) * (float(x) - mean) => d
        acc + d => acc
    return acc / float(len(xs))

def variance_exact_scaled(xs):
    # n^2 * variance, exactly, in integers: n*sum(x^2) - sum(x)^2.
    0 => s
    0 => s2
    for x in xs:
        s + x => s
        s2 + x * x => s2
    len(xs) => n
    return n * s2 - s * s

def variance_exact(xs):
    len(xs) => n
    return float(variance_exact_scaled(xs)) / float(n * n)


"offset      naive variance   two-pass         exact        naive err(ppm)  two-pass err"^0
for off in [0, 1000, 100000, 10000000, 1000000000]:
    [] => xs
    for k in [0:8]:
        xs + [off + k] => xs
    variance_exact(xs) => ex
    variance_naive(xs) => vn
    variance_two_pass(xs) => vt
    ("%-11d %-16s %-16s %-12s %-15d %d" % (off, str(vn), str(vt), str(ex), rel_error(vn, ex), rel_error(vt, ex)))^0

# --------------------------------------------------------------- quadratic
# x^2 + bx + 1. The roots multiply to 1, so one is huge and one is tiny, and
# the naive formula computes the tiny one by subtracting two nearly equal
# large numbers.
#
# The oracle here is not the other formula and not a typed-in constant: it is
# the RESIDUAL. A root is a value where the polynomial vanishes, so evaluating
# x^2 + bx + 1 at each candidate says which one is actually a root, without
# reference to how it was produced.
def roots_naive(b):
    float(b) * float(b) - 4.0 => d
    sqrt_of(d) => r
    return [(0.0 - float(b) + r) / 2.0, (0.0 - float(b) - r) / 2.0]

def roots_stable(b):
    # Compute the root that does NOT cancel - for positive b that is the
    # negative branch - then get the other from the product of roots, which
    # is 1. No subtraction of near-equal values anywhere.
    float(b) * float(b) - 4.0 => d
    sqrt_of(d) => r
    (0.0 - float(b) - r) / 2.0 => big
    if big == 0.0:
        return [0.0, 0.0]
    return [1.0 / big, big]

def residual(x, b):
    return abs_of(x * x + float(b) * x + 1.0)

def smaller(pair):
    if abs_of(pair[1]) < abs_of(pair[0]):
        return pair[1]
    return pair[0]

""^0
"x^2 + bx + 1, the small root, judged by its residual:"^0
"b              naive small          stable small         naive resid   stable resid"^0
0 => stable_better
0 => tried_q
for b in [100, 10000, 1000000, 100000000]:
    tried_q + 1 => tried_q
    smaller(roots_naive(b)) => qn
    smaller(roots_stable(b)) => qs
    residual(qn, b) => rn
    residual(qs, b) => rs
    if rs <= rn:
        stable_better + 1 => stable_better
    ("%-14d %-20s %-20s %-13s %s" % (b, str(qn), str(qs), str(rn), str(rs)))^0

# ------------------------------------------------------ difference of squares
""^0
"a*a - b*b versus (a+b)*(a-b), against the exact integer answer:"^0
"a              naive             factored          exact"^0
0 => factored_wins
0 => tried_d
for pair in [[3, 2], [100000, 99999], [10000000, 9999999], [100000000, 99999999]]:
    pair[0] => a
    pair[1] => b
    tried_d + 1 => tried_d
    a * a - b * b => exact
    float(a) * float(a) - float(b) * float(b) => naive
    (float(a) + float(b)) * (float(a) - float(b)) => factored
    if rel_error(factored, float(exact)) <= rel_error(naive, float(exact)):
        factored_wins + 1 => factored_wins
    ("%-14d %-17s %-17s %d" % (a, str(naive), str(factored), exact))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The two-pass variance must beat the naive one, and by a lot, at large offset.
checked + 1 => checked
[] => big_xs
for k in [0:8]:
    big_xs + [1000000000 + k] => big_xs
variance_exact(big_xs) => ex_big
if rel_error(variance_two_pass(big_xs), ex_big) < rel_error(variance_naive(big_xs), ex_big):
    if rel_error(variance_naive(big_xs), ex_big) > 1000:
        passed + 1 => passed

# At offset 0 the two must AGREE - cancellation is not a property of the
# formula, it is a property of the data, and a case that showed the naive
# form always losing would be describing something else.
checked + 1 => checked
[] => small_xs
for k in [0:8]:
    small_xs + [k] => small_xs
if rel_error(variance_naive(small_xs), variance_exact(small_xs)) == 0:
    passed + 1 => passed

# The stable quadratic must never have a worse residual, and at large b the
# naive one must be visibly worse - judged by the polynomial itself rather
# than by comparing the two formulas to each other.
checked + 1 => checked
if stable_better == tried_q:
    if residual(smaller(roots_naive(100000000)), 100000000) > residual(smaller(roots_stable(100000000)), 100000000):
        passed + 1 => passed

# The factored difference of squares must never be worse.
checked + 1 => checked
if factored_wins == tried_d:
    passed + 1 => passed

# And the exact reference must really be exact: the integer variance must
# divide out to the value everyone agrees on when the numbers are small.
checked + 1 => checked
if variance_exact_scaled([1, 2, 3]) == 3 * 14 - 36:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Same algebra, same data, and one arrangement keeps its digits." => verdict
else:
    "FAILED - a formula did not behave as the checks describe." => verdict
verdict^0

""^0
"Cancellation is a property of the DATA, not of the formula - at offset zero" => n1
n1^0
"both variance formulas are exact. That is why it survives testing: the" => n2
n2^0
"fixtures are small numbers, the formula is correct on them, and the loss" => n3
n3^0
"appears only in production where the values have a large common part." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def sqrt_of(x):
    if x <= 0.0:
        return 0.0
    g = x
    for i in range(1, 41):
        g = (g + x / g) / 2.0
    return g

def abs_of(x):
    if x < 0:
        return 0 - x
    return x

def rel_error(got, exact):
    if exact == 0.0:
        return int(abs_of(got) * 1000000)
    return int(abs_of(got - exact) * 1000000.0 / abs_of(exact))

def variance_naive(xs):
    s = 0.0
    s2 = 0.0
    for x in xs:
        s = s + float(x)
        s2 = s2 + float(x) * float(x)
    n = float(len(xs))
    return s2 / n - s / n * (s / n)

def variance_two_pass(xs):
    s = 0.0
    for x in xs:
        s = s + float(x)
    mean = s / float(len(xs))
    acc = 0.0
    for x in xs:
        d = (float(x) - mean) * (float(x) - mean)
        acc = acc + d
    return acc / float(len(xs))

def variance_exact_scaled(xs):
    s = 0
    s2 = 0
    for x in xs:
        s = s + x
        s2 = s2 + x * x
    n = len(xs)
    return n * s2 - s * s

def variance_exact(xs):
    n = len(xs)
    return float(variance_exact_scaled(xs)) / float(n * n)

print("offset      naive variance   two-pass         exact        naive err(ppm)  two-pass err")
for off in [0, 1000, 100000, 10000000, 1000000000]:
    xs = []
    for k in range(0, 9):
        xs = xs + [off + k]
    ex = variance_exact(xs)
    vn = variance_naive(xs)
    vt = variance_two_pass(xs)
    print("%-11d %-16s %-16s %-12s %-15d %d" % (off, str(vn), str(vt), str(ex), rel_error(vn, ex), rel_error(vt, ex)))

def roots_naive(b):
    d = float(b) * float(b) - 4.0
    r = sqrt_of(d)
    return [(0.0 - float(b) + r) / 2.0, (0.0 - float(b) - r) / 2.0]

def roots_stable(b):
    d = float(b) * float(b) - 4.0
    r = sqrt_of(d)
    big = (0.0 - float(b) - r) / 2.0
    if big == 0.0:
        return [0.0, 0.0]
    return [1.0 / big, big]

def residual(x, b):
    return abs_of(x * x + float(b) * x + 1.0)

def smaller(pair):
    if abs_of(pair[1]) < abs_of(pair[0]):
        return pair[1]
    return pair[0]

print("")
print("x^2 + bx + 1, the small root, judged by its residual:")
print("b              naive small          stable small         naive resid   stable resid")
stable_better = 0
tried_q = 0
for b in [100, 10000, 1000000, 100000000]:
    tried_q = tried_q + 1
    qn = smaller(roots_naive(b))
    qs = smaller(roots_stable(b))
    rn = residual(qn, b)
    rs = residual(qs, b)
    if rs <= rn:
        stable_better = stable_better + 1
    print("%-14d %-20s %-20s %-13s %s" % (b, str(qn), str(qs), str(rn), str(rs)))
print("")
print("a*a - b*b versus (a+b)*(a-b), against the exact integer answer:")
print("a              naive             factored          exact")
factored_wins = 0
tried_d = 0
for pair in [[3, 2], [100000, 99999], [10000000, 9999999], [100000000, 99999999]]:
    a = pair[0]
    b = pair[1]
    tried_d = tried_d + 1
    exact = a * a - b * b
    naive = float(a) * float(a) - float(b) * float(b)
    factored = (float(a) + float(b)) * (float(a) - float(b))
    if rel_error(factored, float(exact)) <= rel_error(naive, float(exact)):
        factored_wins = factored_wins + 1
    print("%-14d %-17s %-17s %d" % (a, str(naive), str(factored), exact))
passed = 0
checked = 0
checked = checked + 1
big_xs = []
for k in range(0, 9):
    big_xs = big_xs + [1000000000 + k]
ex_big = variance_exact(big_xs)
if rel_error(variance_two_pass(big_xs), ex_big) < rel_error(variance_naive(big_xs), ex_big):
    if rel_error(variance_naive(big_xs), ex_big) > 1000:
        passed = passed + 1
checked = checked + 1
small_xs = []
for k in range(0, 9):
    small_xs = small_xs + [k]
if rel_error(variance_naive(small_xs), variance_exact(small_xs)) == 0:
    passed = passed + 1
checked = checked + 1
if stable_better == tried_q:
    if residual(smaller(roots_naive(100000000)), 100000000) > residual(smaller(roots_stable(100000000)), 100000000):
        passed = passed + 1
checked = checked + 1
if factored_wins == tried_d:
    passed = passed + 1
checked = checked + 1
if variance_exact_scaled([1, 2, 3]) == 3 * 14 - 36:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Same algebra, same data, and one arrangement keeps its digits."
else:
    verdict = "FAILED - a formula did not behave as the checks describe."
print(verdict)
print("")
n1 = "Cancellation is a property of the DATA, not of the formula - at offset zero"
print(n1)
n2 = "both variance formulas are exact. That is why it survives testing: the"
print(n2)
n3 = "fixtures are small numbers, the formula is correct on them, and the loss"
print(n3)
n4 = "appears only in production where the values have a large common part."
print(n4)
```

## stdout (executed)

```text
offset      naive variance   two-pass         exact        naive err(ppm)  two-pass err
0           6.666666666666668 6.666666666666667 6.666666666666667 0               0
1000        6.666666666627862 6.666666666666667 6.666666666666667 0               0
100000      6.666666030883789 6.666666666666667 6.666666666666667 0               0
10000000    6.671875         6.666666666666667 6.666666666666667 781             0
1000000000  0.0              6.666666666666667 6.666666666666667 1000000         0

x^2 + bx + 1, the small root, judged by its residual:
b              naive small          stable small         naive resid   stable resid
100            -0.010001000200048793 -0.010001000200050014 1.2212453270876722e-13 0.0
10000          -0.00010000000111176632 -0.00010000000100000001 1.1176630732023796e-09 0.0
1000000        -1.00000761449337e-06 -1.000000000001e-06  7.614492369967252e-06 0.0
100000000      -1.4901161193847656e-08 -1.0000000000000002e-08 0.4901161193847654 2.220446049250313e-16

a*a - b*b versus (a+b)*(a-b), against the exact integer answer:
a              naive             factored          exact
3              5.0               5.0               5
100000         199999.0          199999.0          199999
10000000       19999999.0        19999999.0        19999999
100000000      200000000.0       199999999.0       199999999

checks passed: 5/5
Same algebra, same data, and one arrangement keeps its digits.

Cancellation is a property of the DATA, not of the formula - at offset zero
both variance formulas are exact. That is why it survives testing: the
fixtures are small numbers, the formula is correct on them, and the loss
appears only in production where the values have a large common part.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:output · eml:assign · eml:call · eml:return · eml:run:done
