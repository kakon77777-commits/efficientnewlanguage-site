<!-- canonical: efficientnewlanguage.org/ai/examples/110-bisection-root-finder | ai_layer_version: 0.1.0 | updated: 2026-07-27 -->

# Example 110 — Bisection root finder

`bisection_root_finder.eml` finds roots by halving an interval whose endpoints give the function opposite signs — a root must lie between them.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Bisection:
# given an interval whose endpoints give the function opposite signs, a
# root must lie between them, so halve the interval and keep whichever
# half still straddles zero. Repeat.
#
# The deliberate pairing is with examples/newton-sqrt/. One of the two
# functions here is x^2 - 2, whose positive root IS sqrt(2) — so the same
# number is computed twice by unrelated methods, and the difference in
# how they get there is the point:
#
#   Newton     uses the derivative, doubles correct digits per step, and
#              reaches full float precision in about 5 iterations.
#   Bisection  uses only the SIGN of the function, gains one bit per step,
#              and needs roughly 50 to match — but it cannot diverge, and
#              it never needs a derivative.
#
# EML has no function values to pass around, so the target function is
# selected by an integer rather than handed in as an argument.

def evaluate(which, x):
    if which == 0:
        return x * x * x - x - 2
    return x * x - 2

def bisect(which, low, high, iterations):
    low => a
    high => b
    0 => i
    while i < iterations:
        (a + b) / 2 => mid
        evaluate(which, a) => value_a
        evaluate(which, mid) => value_mid
        if value_a * value_mid <= 0:
            mid => b
        else:
            mid => a
        i + 1 => i
    return (a + b) / 2

def absolute(x):
    if x < 0:
        return 0 - x
    return x

"Root of x^3 - x - 2 on [1, 2], by iteration count:" => header1
header1^0
for steps in [10:60]:
    if steps % 10 == 0:
        bisect(0, 1, 2, steps) => root
        "  " + str(steps) + " iterations: " + str(root) => line
        line^0

"" => blank1
blank1^0

"Root of x^2 - 2 on [1, 2] - this one is sqrt(2):" => header2
header2^0
bisect(1, 1, 2, 50) => root2
"  bisection (50 iterations): " + str(root2) => line2
line2^0
2^0.5 => builtin
"  built-in ^0.5:             " + str(builtin) => line3
line3^0

absolute(root2 - builtin) => difference
if difference < 0.0000001:
    "Bisection agrees with the power operator to within 1e-7" => verdict
else:
    "Bisection DISAGREES: difference " + str(difference) => verdict
verdict^0

"" => blank2
blank2^0
bisect(1, 1, 2, 5) => rough
absolute(rough - builtin) => rough_error
"After only 5 iterations the error is still " + str(rough_error) => contrast
contrast^0
"Newton reaches full float precision in about that many steps" => note
note^0
```

## Python (deterministic transpilation)

```python
def evaluate(which, x):
    if which == 0:
        return x * x * x - x - 2
    return x * x - 2

def bisect(which, low, high, iterations):
    a = low
    b = high
    i = 0
    while i < iterations:
        mid = (a + b) / 2
        value_a = evaluate(which, a)
        value_mid = evaluate(which, mid)
        if value_a * value_mid <= 0:
            b = mid
        else:
            a = mid
        i = i + 1
    return (a + b) / 2

def absolute(x):
    if x < 0:
        return 0 - x
    return x

header1 = "Root of x^3 - x - 2 on [1, 2], by iteration count:"
print(header1)
for steps in range(10, 61):
    if steps % 10 == 0:
        root = bisect(0, 1, 2, steps)
        line = "  " + str(steps) + " iterations: " + str(root)
        print(line)
blank1 = ""
print(blank1)
header2 = "Root of x^2 - 2 on [1, 2] - this one is sqrt(2):"
print(header2)
root2 = bisect(1, 1, 2, 50)
line2 = "  bisection (50 iterations): " + str(root2)
print(line2)
builtin = 2**0.5
line3 = "  built-in ^0.5:             " + str(builtin)
print(line3)
difference = absolute(root2 - builtin)
if difference < 0.0000001:
    verdict = "Bisection agrees with the power operator to within 1e-7"
else:
    verdict = "Bisection DISAGREES: difference " + str(difference)
print(verdict)
blank2 = ""
print(blank2)
rough = bisect(1, 1, 2, 5)
rough_error = absolute(rough - builtin)
contrast = "After only 5 iterations the error is still " + str(rough_error)
print(contrast)
note = "Newton reaches full float precision in about that many steps"
print(note)
```

## stdout (executed)

```text
Root of x^3 - x - 2 on [1, 2], by iteration count:
  10 iterations: 1.52099609375
  20 iterations: 1.5213799476623535
  30 iterations: 1.521379706915468
  40 iterations: 1.5213797068049644
  50 iterations: 1.5213797068045678
  60 iterations: 1.5213797068045674

Root of x^2 - 2 on [1, 2] - this one is sqrt(2):
  bisection (50 iterations): 1.4142135623730954
  built-in ^0.5:             1.4142135623730951
Bisection agrees with the power operator to within 1e-7

After only 5 iterations the error is still 0.0076614376269048545
Newton reaches full float precision in about that many steps
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
