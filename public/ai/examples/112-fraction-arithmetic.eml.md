<!-- canonical: efficientnewlanguage.org/ai/examples/112-fraction-arithmetic | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 112 — Fraction arithmetic (exact rationals)

`fraction_arithmetic.eml` adds and multiplies fractions held as `[numerator, denominator]` pairs, always reduced by their greatest common divisor.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Exact
# rational arithmetic: fractions as [numerator, denominator] pairs, always
# reduced by their greatest common divisor, with the sign kept on the
# numerator so that 1/-2 and -1/2 have one canonical form.
#
# The case exists to show what floats cannot do. The last section adds
# 1/10 + 2/10 both ways: as fractions the answer is exactly 3/10, while
# the float computation 0.1 + 0.2 gives 0.30000000000000004 and compares
# UNEQUAL to 0.3. Neither result is a bug — 0.1 and 0.2 have no exact
# binary representation, so the float answer is the correct rounding of
# the wrong inputs. Choosing a representation is choosing which errors are
# possible.
#
# Reduction runs after every operation rather than at the end, which is
# what stops denominators from growing without bound across a chain of
# additions.

def gcd(a, b):
    a => x
    b => y
    if x < 0:
        0 - x => x
    if y < 0:
        0 - y => y
    while y != 0:
        y => temp
        x % y => y
        temp => x
    return x

def make_fraction(numerator, denominator):
    gcd(numerator, denominator) => divisor
    if divisor == 0:
        return [0, 1]
    int(numerator / divisor) => reduced_n
    int(denominator / divisor) => reduced_d
    if reduced_d < 0:
        0 - reduced_n => reduced_n
        0 - reduced_d => reduced_d
    return [reduced_n, reduced_d]

def add_fractions(a, b):
    a[0] * b[1] + b[0] * a[1] => numerator
    a[1] * b[1] => denominator
    return make_fraction(numerator, denominator)

def multiply_fractions(a, b):
    a[0] * b[0] => numerator
    a[1] * b[1] => denominator
    return make_fraction(numerator, denominator)

def render(fraction):
    return str(fraction[0]) + "/" + str(fraction[1])

additions^+[[[1, 2], [1, 3]], [[2, 4], [1, 4]], [[1, 6], [1, 6]], [[1, 2], [0 - 1, 2]], [[3, 4], [1, 4]]]

"Addition:" => header1
header1^0
for pair in additions:
    pair[0] => a
    pair[1] => b
    add_fractions(a, b) => total
    "  " + render(a) + " + " + render(b) + " = " + render(total) => line
    line^0

"" => blank1
blank1^0
"Multiplication:" => header2
header2^0
products^+[[[1, 2], [2, 3]], [[3, 4], [4, 3]], [[2, 5], [5, 2]]]
for pair in products:
    pair[0] => a
    pair[1] => b
    multiply_fractions(a, b) => product
    "  " + render(a) + " * " + render(b) + " = " + render(product) => line
    line^0

"" => blank2
blank2^0
"The same sum, two representations:" => header3
header3^0

add_fractions([1, 10], [2, 10]) => exact
"  fractions: 1/10 + 2/10 = " + render(exact) => line1
line1^0

0.1 + 0.2 => approximate
"  floats:    0.1 + 0.2  = " + str(approximate) => line2
line2^0

if approximate == 0.3:
    "  the float sum compares equal to 0.3" => line3
else:
    "  the float sum compares UNEQUAL to 0.3" => line3
line3^0

3 => third_n
10 => third_d
if exact[0] == third_n and exact[1] == third_d:
    "  the fraction sum is exactly 3/10" => line4
else:
    "  the fraction sum is NOT 3/10" => line4
line4^0
```

## Python (deterministic transpilation)

```python
def gcd(a, b):
    x = a
    y = b
    if x < 0:
        x = 0 - x
    if y < 0:
        y = 0 - y
    while y != 0:
        temp = y
        y = x % y
        x = temp
    return x

def make_fraction(numerator, denominator):
    divisor = gcd(numerator, denominator)
    if divisor == 0:
        return [0, 1]
    reduced_n = int(numerator / divisor)
    reduced_d = int(denominator / divisor)
    if reduced_d < 0:
        reduced_n = 0 - reduced_n
        reduced_d = 0 - reduced_d
    return [reduced_n, reduced_d]

def add_fractions(a, b):
    numerator = a[0] * b[1] + b[0] * a[1]
    denominator = a[1] * b[1]
    return make_fraction(numerator, denominator)

def multiply_fractions(a, b):
    numerator = a[0] * b[0]
    denominator = a[1] * b[1]
    return make_fraction(numerator, denominator)

def render(fraction):
    return str(fraction[0]) + "/" + str(fraction[1])

additions = [[[1, 2], [1, 3]], [[2, 4], [1, 4]], [[1, 6], [1, 6]], [[1, 2], [0 - 1, 2]], [[3, 4], [1, 4]]]
header1 = "Addition:"
print(header1)
for pair in additions:
    a = pair[0]
    b = pair[1]
    total = add_fractions(a, b)
    line = "  " + render(a) + " + " + render(b) + " = " + render(total)
    print(line)
blank1 = ""
print(blank1)
header2 = "Multiplication:"
print(header2)
products = [[[1, 2], [2, 3]], [[3, 4], [4, 3]], [[2, 5], [5, 2]]]
for pair in products:
    a = pair[0]
    b = pair[1]
    product = multiply_fractions(a, b)
    line = "  " + render(a) + " * " + render(b) + " = " + render(product)
    print(line)
blank2 = ""
print(blank2)
header3 = "The same sum, two representations:"
print(header3)
exact = add_fractions([1, 10], [2, 10])
line1 = "  fractions: 1/10 + 2/10 = " + render(exact)
print(line1)
approximate = 0.1 + 0.2
line2 = "  floats:    0.1 + 0.2  = " + str(approximate)
print(line2)
if approximate == 0.3:
    line3 = "  the float sum compares equal to 0.3"
else:
    line3 = "  the float sum compares UNEQUAL to 0.3"
print(line3)
third_n = 3
third_d = 10
if exact[0] == third_n and exact[1] == third_d:
    line4 = "  the fraction sum is exactly 3/10"
else:
    line4 = "  the fraction sum is NOT 3/10"
print(line4)
```

## stdout (executed)

```text
Addition:
  1/2 + 1/3 = 5/6
  2/4 + 1/4 = 3/4
  1/6 + 1/6 = 1/3
  1/2 + -1/2 = 0/1
  3/4 + 1/4 = 1/1

Multiplication:
  1/2 * 2/3 = 1/3
  3/4 * 4/3 = 1/1
  2/5 * 5/2 = 1/1

The same sum, two representations:
  fractions: 1/10 + 2/10 = 3/10
  floats:    0.1 + 0.2  = 0.30000000000000004
  the float sum compares UNEQUAL to 0.3
  the fraction sum is exactly 3/10
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
