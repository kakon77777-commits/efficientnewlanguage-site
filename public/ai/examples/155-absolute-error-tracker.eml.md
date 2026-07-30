<!-- canonical: efficientnewlanguage.org/ai/examples/155-absolute-error-tracker | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 155 — Absolute error tracker

`absolute_error_tracker.eml` compares five readings against a target and reports which ones fall outside a tolerance band.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Comparing a
# measurement against a target is one of the few places where the SIGN of the
# difference is noise and the MAGNITUDE is the whole point - so this is really
# a program about abs().
#
# Worth stating plainly: `abs` was called by ZERO of the 149 corpus programs
# before this one. It had been implemented since the first interpreter and
# never once executed by a case. That is not an accident of this particular
# builtin - measuring the corpus by BUILTIN rather than by syntax construct
# found five such functions at zero, and probing their untested argument shapes
# against CPython turned up twelve real divergences.
#
# abs() has one genuinely surprising rule, exercised below: bool is a subclass
# of int in Python, so abs(True) is 1 - an int, not a bool. It is the same
# reason True + True is 2.

def deviation(reading, target):
    return abs(reading - target)

def within_tolerance(reading, target, tol):
    if deviation(reading, target) <= tol:
        return 1
    return 0

[9.8, 10.4, 10.0, 11.7, 8.1] => readings
10.0 => target
1.0 => tolerance

"Target: " + str(target) + ", tolerance +/-" + str(tolerance) => header
header^0
"" ^0

0 => passing
0 => worst_index
0.0 => worst
0 => i
for r in readings:
    deviation(r, target) => d
    if within_tolerance(r, target, tolerance) == 1:
        "  reading " + str(i) + ": " + str(r) + "  off by " + str(d) + "  ok" => line
    else:
        "  reading " + str(i) + ": " + str(r) + "  off by " + str(d) + "  OUT" => line
    line^0
    passing + within_tolerance(r, target, tolerance) => passing
    if d > worst:
        d => worst
        i => worst_index
    i + 1 => i

""^0
("Passing: " + str(passing) + " of " + str(len(readings)))^0
("Worst deviation: " + str(worst) + " at index " + str(worst_index))^0

# The magnitude is symmetric: a reading 1.7 high and one 1.7 low are equally
# wrong, and abs() is what makes that true in one expression instead of two.
(0.0 - 1.7) => low
1.7 => high
("Symmetry: abs(" + str(low) + ") == abs(" + str(high) + ") is " + str(abs(low) == abs(high)))^0

# bool is an int subtype, so abs() of a bool is an int. This is the same rule
# that makes True + True == 2, and it is easy to forget until a total comes
# out as an integer where a boolean was expected.
("abs(True) is " + repr(abs(True)) + ", not a bool")^0
```

## Python (deterministic transpilation)

```python
def deviation(reading, target):
    return abs(reading - target)

def within_tolerance(reading, target, tol):
    if deviation(reading, target) <= tol:
        return 1
    return 0

readings = [9.8, 10.4, 10.0, 11.7, 8.1]
target = 10.0
tolerance = 1.0
header = "Target: " + str(target) + ", tolerance +/-" + str(tolerance)
print(header)
print("")
passing = 0
worst_index = 0
worst = 0.0
i = 0
for r in readings:
    d = deviation(r, target)
    if within_tolerance(r, target, tolerance) == 1:
        line = "  reading " + str(i) + ": " + str(r) + "  off by " + str(d) + "  ok"
    else:
        line = "  reading " + str(i) + ": " + str(r) + "  off by " + str(d) + "  OUT"
    print(line)
    passing = passing + within_tolerance(r, target, tolerance)
    if d > worst:
        worst = d
        worst_index = i
    i = i + 1
print("")
print("Passing: " + str(passing) + " of " + str(len(readings)))
print("Worst deviation: " + str(worst) + " at index " + str(worst_index))
low = 0.0 - 1.7
high = 1.7
print("Symmetry: abs(" + str(low) + ") == abs(" + str(high) + ") is " + str(abs(low) == abs(high)))
print("abs(True) is " + repr(abs(True)) + ", not a bool")
```

## stdout (executed)

```text
Target: 10.0, tolerance +/-1.0

  reading 0: 9.8  off by 0.1999999999999993  ok
  reading 1: 10.4  off by 0.40000000000000036  ok
  reading 2: 10.0  off by 0.0  ok
  reading 3: 11.7  off by 1.6999999999999993  OUT
  reading 4: 8.1  off by 1.9000000000000004  OUT

Passing: 3 of 5
Worst deviation: 1.9000000000000004 at index 4
Symmetry: abs(-1.7) == abs(1.7) is True
abs(True) is 1, not a bool
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
