<!-- canonical: efficientnewlanguage.org/ai/examples/189-fibonacci-cassini-exact | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 189 — Fibonacci to F(200), checked with Cassini

`fibonacci_cassini_exact.eml` builds Fibonacci numbers to F(200) and checks them with an identity a float implementation cannot pass and cannot fake.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Fibonacci numbers
# up to F(200), checked with Cassini's identity - a test that a float-based
# implementation cannot pass and cannot fake.
#
# Cassini (1680):
#
#     F(n-1) * F(n+1) - F(n)^2  =  (-1)^n
#
# The left side is a difference of two enormous, nearly equal numbers. At
# n = 200 both products are 84 digits long and they differ by exactly 1. In
# 64-bit floats they are the SAME number - the difference vanishes into the
# rounding - so the identity evaluates to 0 and fails for every n at once.
# There is no tolerance to loosen and no epsilon that helps: the answer is
# always +/-1 and floats always say 0.
#
# That makes it an unusually honest test of an integer model. Most numeric
# checks pass "close enough"; this one is exactly right or exactly wrong.
#
# The program also checks two other identities that stress different things:
#
#   sum of the first n         F(1) + ... + F(n) = F(n+2) - 1
#   greatest common divisor    gcd(F(m), F(n)) = F(gcd(m, n))
#
# The gcd identity is the interesting one, because Euclid's algorithm on
# 84-digit numbers uses `%` at full precision hundreds of times, and a single
# lost bit anywhere makes it return a wrong answer rather than a close one.

def fib_list(upto):
    [0, 1] => f
    for i in [2:upto]:
        f + [f[i - 1] + f[i - 2]] => f
    return f

def gcd(a, b):
    a => x
    b => y
    while y > 0:
        y => t
        x % y => y
        t => x
    return x


202 => upto
fib_list(upto) => F

("F(100) = " + str(F[100]))^0
("F(200) = " + str(F[200]))^0
("digits in F(200): " + str(len(str(F[200]))))^0

# ------------------------------------------------------------- Cassini
""^0
"Cassini's identity, F(n-1)*F(n+1) - F(n)^2 = (-1)^n:"^0
0 => cassini_ok
0 => cassini_checked
for n in [1:200]:
    cassini_checked + 1 => cassini_checked
    F[n - 1] * F[n + 1] - F[n] * F[n] => left
    1 => expected
    if n % 2 == 1:
        0 - 1 => expected
    if left == expected:
        cassini_ok + 1 => cassini_ok

("  holds for " + str(cassini_ok) + "/" + str(cassini_checked) + " values of n")^0
F[199] * F[201] - F[200] * F[200] => at200
("  at n=200 the two products are 84-digit numbers and differ by " + str(at200))^0

# ------------------------------------------------------------- partial sums
""^0
"Partial sums, F(1)+...+F(n) = F(n+2) - 1:"^0
0 => running
0 => sums_ok
0 => sums_checked
for n in [1:200]:
    running + F[n] => running
    sums_checked + 1 => sums_checked
    if running == F[n + 2] - 1:
        sums_ok + 1 => sums_ok
("  holds for " + str(sums_ok) + "/" + str(sums_checked))^0

# ------------------------------------------------------------- gcd identity
""^0
"gcd(F(m), F(n)) = F(gcd(m, n)):"^0
[[12, 18], [24, 36], [50, 75], [100, 150], [64, 96], [90, 200]] => pairs
0 => gcd_ok
for pair in pairs:
    pair[0] => m
    pair[1] => n
    gcd(F[m], F[n]) => left
    F[gcd(m, n)] => right
    if left == right:
        gcd_ok + 1 => gcd_ok
    ("  m=" + str(m) + " n=" + str(n) + " gcd(m,n)=" + str(gcd(m, n)) + " -> " + str(left == right))^0

""^0
("Cassini:      " + str(cassini_ok) + "/" + str(cassini_checked))^0
("partial sums: " + str(sums_ok) + "/" + str(sums_checked))^0
("gcd identity: " + str(gcd_ok) + "/" + str(len(pairs)))^0

""^0
if cassini_ok == cassini_checked and sums_ok == sums_checked and gcd_ok == len(pairs):
    "All three identities hold exactly, at every n up to 200." => verdict
else:
    "FAILED - an identity broke, which means a value is off by at least 1." => verdict
verdict^0

""^0
"Cassini is the one that cannot be faked. In doubles, F(199)*F(201) and" => n1
n1^0
"F(200)^2 round to the same value, the difference is 0, and the identity" => n2
n2^0
"fails for every n rather than drifting slowly - so a passing run is proof" => n3
n3^0
"the arithmetic never went through a float." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def fib_list(upto):
    f = [0, 1]
    for i in range(2, upto+1):
        f = f + [f[i - 1] + f[i - 2]]
    return f

def gcd(a, b):
    x = a
    y = b
    while y > 0:
        t = y
        y = x % y
        x = t
    return x

upto = 202
F = fib_list(upto)
print("F(100) = " + str(F[100]))
print("F(200) = " + str(F[200]))
print("digits in F(200): " + str(len(str(F[200]))))
print("")
print("Cassini's identity, F(n-1)*F(n+1) - F(n)^2 = (-1)^n:")
cassini_ok = 0
cassini_checked = 0
for n in range(1, 201):
    cassini_checked = cassini_checked + 1
    left = F[n - 1] * F[n + 1] - F[n] * F[n]
    expected = 1
    if n % 2 == 1:
        expected = 0 - 1
    if left == expected:
        cassini_ok = cassini_ok + 1
print("  holds for " + str(cassini_ok) + "/" + str(cassini_checked) + " values of n")
at200 = F[199] * F[201] - F[200] * F[200]
print("  at n=200 the two products are 84-digit numbers and differ by " + str(at200))
print("")
print("Partial sums, F(1)+...+F(n) = F(n+2) - 1:")
running = 0
sums_ok = 0
sums_checked = 0
for n in range(1, 201):
    running = running + F[n]
    sums_checked = sums_checked + 1
    if running == F[n + 2] - 1:
        sums_ok = sums_ok + 1
print("  holds for " + str(sums_ok) + "/" + str(sums_checked))
print("")
print("gcd(F(m), F(n)) = F(gcd(m, n)):")
pairs = [[12, 18], [24, 36], [50, 75], [100, 150], [64, 96], [90, 200]]
gcd_ok = 0
for pair in pairs:
    m = pair[0]
    n = pair[1]
    left = gcd(F[m], F[n])
    right = F[gcd(m, n)]
    if left == right:
        gcd_ok = gcd_ok + 1
    print("  m=" + str(m) + " n=" + str(n) + " gcd(m,n)=" + str(gcd(m, n)) + " -> " + str(left == right))
print("")
print("Cassini:      " + str(cassini_ok) + "/" + str(cassini_checked))
print("partial sums: " + str(sums_ok) + "/" + str(sums_checked))
print("gcd identity: " + str(gcd_ok) + "/" + str(len(pairs)))
print("")
if cassini_ok == cassini_checked and sums_ok == sums_checked and gcd_ok == len(pairs):
    verdict = "All three identities hold exactly, at every n up to 200."
else:
    verdict = "FAILED - an identity broke, which means a value is off by at least 1."
print(verdict)
print("")
n1 = "Cassini is the one that cannot be faked. In doubles, F(199)*F(201) and"
print(n1)
n2 = "F(200)^2 round to the same value, the difference is 0, and the identity"
print(n2)
n3 = "fails for every n rather than drifting slowly - so a passing run is proof"
print(n3)
n4 = "the arithmetic never went through a float."
print(n4)
```

## stdout (executed)

```text
F(100) = 354224848179261915075
F(200) = 280571172992510140037611932413038677189525
digits in F(200): 42

Cassini's identity, F(n-1)*F(n+1) - F(n)^2 = (-1)^n:
  holds for 200/200 values of n
  at n=200 the two products are 84-digit numbers and differ by 1

Partial sums, F(1)+...+F(n) = F(n+2) - 1:
  holds for 200/200

gcd(F(m), F(n)) = F(gcd(m, n)):
  m=12 n=18 gcd(m,n)=6 -> True
  m=24 n=36 gcd(m,n)=12 -> True
  m=50 n=75 gcd(m,n)=25 -> True
  m=100 n=150 gcd(m,n)=50 -> True
  m=64 n=96 gcd(m,n)=32 -> True
  m=90 n=200 gcd(m,n)=10 -> True

Cassini:      200/200
partial sums: 200/200
gcd identity: 6/6

All three identities hold exactly, at every n up to 200.

Cassini is the one that cannot be faked. In doubles, F(199)*F(201) and
F(200)^2 round to the same value, the difference is 0, and the identity
fails for every n rather than drifting slowly - so a passing run is proof
the arithmetic never went through a float.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
