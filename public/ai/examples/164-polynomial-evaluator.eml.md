<!-- canonical: efficientnewlanguage.org/ai/examples/164-polynomial-evaluator | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 164 — A polynomial as (coefficient, exponent) pairs

`polynomial_evaluator.eml` evaluates `2x^3 - 4x^2 + 7x + 5` at four points by summing its terms explicitly.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A polynomial as
# a list of (coefficient, exponent) tuples, evaluated by Horner-free direct
# summation so that each term is visible.
#
# This is the shape where a tuple earns its keep over a two-element list: a
# term has exactly two parts forever, and swapping them would be a bug rather
# than a resize. Printing the terms alongside their contributions makes the
# arithmetic auditable rather than asserted.

def power(base, exp):
    1 => result
    0 => i
    while i < exp:
        result * base => result
        i + 1 => i
    return result

def term_value(term, x):
    return term[0] * power(x, term[1])

def evaluate(poly, x):
    [] => parts
    for term in poly:
        parts + [term_value(term, x)] => parts
    return sum(parts)

def describe(term):
    term[0] => c
    term[1] => e
    if e == 0:
        return str(c)
    if e == 1:
        return str(c) + "x"
    return str(c) + "x^" + str(e)

[(2, 3), (0 - 4, 2), (7, 1), (5, 0)] => poly

"" => shown
for term in poly:
    if shown == "":
        describe(term) => shown
    else:
        shown + " + " + describe(term) => shown
("p(x) = " + shown)^0
("Terms: " + str(len(poly)) + ", degree " + str(max([3, 2, 1, 0])))^0
""^0

"x    term values                    p(x)" => header
header^0
"---  -----------------------------  ------" => rule
rule^0
for x in [0, 1, 2, 0 - 1]:
    [] => vals
    for term in poly:
        vals + [term_value(term, x)] => vals
    str(x) => xs
    5 - len(xs) => pad1
    if pad1 < 1:
        1 => pad1
    str(vals) => vs
    31 - len(vs) => pad2
    if pad2 < 1:
        1 => pad2
    (xs + " " * pad1 + vs + " " * pad2 + str(evaluate(poly, x)))^0

""^0
# The constant term is p(0), which is a good self-check on the whole scheme.
("p(0) = " + str(evaluate(poly, 0)) + ", and the constant term is " + str(poly[3][0]) + " -> " + str(evaluate(poly, 0) == poly[3][0]))^0
("Each term is a " + str(len(poly[0])) + "-tuple: (coefficient, exponent), in that order, always.")^0
```

## Python (deterministic transpilation)

```python
def power(base, exp):
    result = 1
    i = 0
    while i < exp:
        result = result * base
        i = i + 1
    return result

def term_value(term, x):
    return term[0] * power(x, term[1])

def evaluate(poly, x):
    parts = []
    for term in poly:
        parts = parts + [term_value(term, x)]
    return sum(parts)

def describe(term):
    c = term[0]
    e = term[1]
    if e == 0:
        return str(c)
    if e == 1:
        return str(c) + "x"
    return str(c) + "x^" + str(e)

poly = [(2, 3), (0 - 4, 2), (7, 1), (5, 0)]
shown = ""
for term in poly:
    if shown == "":
        shown = describe(term)
    else:
        shown = shown + " + " + describe(term)
print("p(x) = " + shown)
print("Terms: " + str(len(poly)) + ", degree " + str(max([3, 2, 1, 0])))
print("")
header = "x    term values                    p(x)"
print(header)
rule = "---  -----------------------------  ------"
print(rule)
for x in [0, 1, 2, 0 - 1]:
    vals = []
    for term in poly:
        vals = vals + [term_value(term, x)]
    xs = str(x)
    pad1 = 5 - len(xs)
    if pad1 < 1:
        pad1 = 1
    vs = str(vals)
    pad2 = 31 - len(vs)
    if pad2 < 1:
        pad2 = 1
    print(xs + " " * pad1 + vs + " " * pad2 + str(evaluate(poly, x)))
print("")
print("p(0) = " + str(evaluate(poly, 0)) + ", and the constant term is " + str(poly[3][0]) + " -> " + str(evaluate(poly, 0) == poly[3][0]))
print("Each term is a " + str(len(poly[0])) + "-tuple: (coefficient, exponent), in that order, always.")
```

## stdout (executed)

```text
p(x) = 2x^3 + -4x^2 + 7x + 5
Terms: 4, degree 3

x    term values                    p(x)
---  -----------------------------  ------
0    [0, 0, 0, 5]                   5
1    [2, -4, 7, 5]                  10
2    [16, -16, 14, 5]               19
-1   [-2, -4, -7, 5]                -8

p(0) = 5, and the constant term is 5 -> True
Each term is a 2-tuple: (coefficient, exponent), in that order, always.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
