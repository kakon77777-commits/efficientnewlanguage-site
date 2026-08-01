<!-- canonical: efficientnewlanguage.org/ai/examples/188-factorial-exact-digits | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 188 — 50! exactly, checked four ways

`factorial_exact_digits.eml` computes 50! and then checks it against facts known independently of the multiplication that produced it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). 50! computed
# exactly, then checked against facts known independently of the multiplication
# that produced it.
#
# 50! is 65 digits long. A language that stores it in a 64-bit float keeps
# about 16 significant digits and silently rounds the other 49 - and the
# rounded answer still LOOKS like a factorial: same magnitude, same leading
# digits, plausible in every way. Nothing errors. That is the failure mode this
# case exists to rule out, and it is why every check below refuses to use the
# product as its own witness.
#
#   trailing zeros   Legendre's formula: the exponent of 5 in n! is
#                    floor(n/5) + floor(n/25) + floor(n/125) + ...
#                    For 50 that is 10 + 2 = 12, and since factors of 2 are
#                    never scarcer than factors of 5, 50! ends in exactly 12
#                    zeros. A rounded 50! fails this on the first look: the
#                    zeros become whatever the rounding left behind.
#
#   digit count      obtained by multiplying 1 by 10 until it passes 50!, which
#                    touches the big value only through comparison.
#
#   divisibility     50! must be exactly divisible by every k in 1..50, and by
#                    every prime below 50 - but NOT by 53, the first prime
#                    above it. The negative half is the important half: a
#                    rounded value is divisible by small numbers roughly at
#                    random, so "divides by everything" is weak evidence and
#                    "divides by everything below and nothing above" is not.

def factorial(n):
    1 => acc
    for k in [1:n]:
        acc * k => acc
    return acc

def trailing_zeros_of_factorial(n):
    # Legendre. The divisions here are on SMALL numbers (n, 5, 25, 125), so
    # int(a / b) is exact - unlike the same expression on a 65-digit value.
    0 => total
    5 => power
    while power <= n:
        total + int(n / power) => total
        power * 5 => power
    return total

def count_trailing_zeros(text):
    0 => zeros
    len(text) - 1 => i
    True => scanning
    while scanning and i >= 0:
        if text[i] == "0":
            zeros + 1 => zeros
            i - 1 => i
        else:
            False => scanning
    return zeros

def digit_count(value):
    0 => digits
    1 => probe
    while probe <= value:
        probe * 10 => probe
        digits + 1 => digits
    return digits


50 => n
factorial(n) => f
str(f) => rendered

"50! ="^0
rendered^0
""^0

("digits, counted by multiplying up:  " + str(digit_count(f)))^0
("digits, from the rendered string:   " + str(len(rendered)))^0

trailing_zeros_of_factorial(n) => legendre
count_trailing_zeros(rendered) => observed_zeros
("trailing zeros observed:            " + str(observed_zeros))^0
("trailing zeros Legendre predicts:   " + str(legendre))^0

# Divisible by everything up to 50 ...
0 => divides
for k in [1:n]:
    if f % k == 0:
        divides + 1 => divides
("divides evenly by 1..50:            " + str(divides) + "/" + str(n))^0

# ... and NOT by the primes just above it. This is the half that a rounded
# value fails, because divisibility by a large prime is not something rounding
# preserves or destroys predictably.
[53, 59, 61, 67, 71] => primes_above
0 => indivisible
for p in primes_above:
    if not (f % p == 0):
        indivisible + 1 => indivisible
("NOT divisible by 53,59,61,67,71:    " + str(indivisible) + "/" + str(len(primes_above)))^0

""^0
if observed_zeros == legendre and digit_count(f) == len(rendered) and divides == n and indivisible == len(primes_above):
    "Exact. Four witnesses agree, and none of them trusted the product." => verdict
else:
    "FAILED - the factorial lost precision somewhere." => verdict
verdict^0

""^0
"For scale: 2^53, the last integer a 64-bit float represents exactly, is 16" => n1
n1^0
"digits. This number is 65. Every digit past the sixteenth is only there" => n2
n2^0
"because integers here are arbitrary-precision rather than doubles." => n3
n3^0
```

## Python (deterministic transpilation)

```python
def factorial(n):
    acc = 1
    for k in range(1, n+1):
        acc = acc * k
    return acc

def trailing_zeros_of_factorial(n):
    total = 0
    power = 5
    while power <= n:
        total = total + int(n / power)
        power = power * 5
    return total

def count_trailing_zeros(text):
    zeros = 0
    i = len(text) - 1
    scanning = True
    while scanning and i >= 0:
        if text[i] == "0":
            zeros = zeros + 1
            i = i - 1
        else:
            scanning = False
    return zeros

def digit_count(value):
    digits = 0
    probe = 1
    while probe <= value:
        probe = probe * 10
        digits = digits + 1
    return digits

n = 50
f = factorial(n)
rendered = str(f)
print("50! =")
print(rendered)
print("")
print("digits, counted by multiplying up:  " + str(digit_count(f)))
print("digits, from the rendered string:   " + str(len(rendered)))
legendre = trailing_zeros_of_factorial(n)
observed_zeros = count_trailing_zeros(rendered)
print("trailing zeros observed:            " + str(observed_zeros))
print("trailing zeros Legendre predicts:   " + str(legendre))
divides = 0
for k in range(1, n+1):
    if f % k == 0:
        divides = divides + 1
print("divides evenly by 1..50:            " + str(divides) + "/" + str(n))
primes_above = [53, 59, 61, 67, 71]
indivisible = 0
for p in primes_above:
    if not f % p == 0:
        indivisible = indivisible + 1
print("NOT divisible by 53,59,61,67,71:    " + str(indivisible) + "/" + str(len(primes_above)))
print("")
if observed_zeros == legendre and digit_count(f) == len(rendered) and divides == n and indivisible == len(primes_above):
    verdict = "Exact. Four witnesses agree, and none of them trusted the product."
else:
    verdict = "FAILED - the factorial lost precision somewhere."
print(verdict)
print("")
n1 = "For scale: 2^53, the last integer a 64-bit float represents exactly, is 16"
print(n1)
n2 = "digits. This number is 65. Every digit past the sixteenth is only there"
print(n2)
n3 = "because integers here are arbitrary-precision rather than doubles."
print(n3)
```

## stdout (executed)

```text
50! =
30414093201713378043612608166064768844377641568960512000000000000

digits, counted by multiplying up:  65
digits, from the rendered string:   65
trailing zeros observed:            12
trailing zeros Legendre predicts:   12
divides evenly by 1..50:            50/50
NOT divisible by 53,59,61,67,71:    5/5

Exact. Four witnesses agree, and none of them trusted the product.

For scale: 2^53, the last integer a 64-bit float represents exactly, is 16
digits. This number is 65. Every digit past the sixteenth is only there
because integers here are arbitrary-precision rather than doubles.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
