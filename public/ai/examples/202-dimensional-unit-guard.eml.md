<!-- canonical: efficientnewlanguage.org/ai/examples/202-dimensional-unit-guard | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 202 — A factor table will convert metres to seconds

`dimensional_unit_guard.eml` converts between units and refuses to convert between dimensions - which is the part a factor table cannot do.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Unit conversion
# that refuses incompatible dimensions instead of returning a plausible number.
#
# A conversion table maps a unit to a factor. That is enough to convert metres
# to feet, and it is also enough to convert metres to SECONDS - the arithmetic
# works fine, the answer is a number, and nothing about it looks wrong.
#
# This is not hypothetical. The Mars Climate Orbiter was lost in 1999 because
# one system produced pound-seconds and another consumed newton-seconds; both
# numbers were correct in their own units and the interface carried no
# dimension. The failure mode is always the same: a number that is right
# except for what it means.
#
# The fix is to carry the DIMENSION alongside the factor, and to make
# conversion a partial function - defined between units of the same dimension
# and undefined otherwise, loudly:
#
#     convert(1, "m", "ft")   ->  3.28084
#     convert(1, "m", "s")    ->  raises, and says why
#
# The properties checked, over every legal pair of units:
#
#   1. round trip: converting there and back returns the original
#   2. identity: converting a unit to itself changes nothing
#   3. transitivity: a -> b -> c equals a -> c directly
#   4. every cross-dimension pair is REFUSED, and the count of refusals is
#      exactly what the dimension table predicts

# unit -> [dimension, factor to the dimension's base unit]
{
    "m": ["length", 1.0],
    "km": ["length", 1000.0],
    "ft": ["length", 0.3048],
    "mi": ["length", 1609.344],
    "s": ["time", 1.0],
    "min": ["time", 60.0],
    "h": ["time", 3600.0],
    "kg": ["mass", 1.0],
    "g": ["mass", 0.001],
    "lb": ["mass", 0.45359237],
} => units

def dimension_of(u):
    if u in units:
        return units[u][0]
    raise ValueError("unknown unit: " + u)

def factor_of(u):
    if u in units:
        return units[u][1]
    raise ValueError("unknown unit: " + u)

def convert(value, frm, to):
    dimension_of(frm) => d1
    dimension_of(to) => d2
    if not (d1 == d2):
        raise TypeError("cannot convert " + frm + " (" + d1 + ") to " + to + " (" + d2 + ")")
    return value * factor_of(frm) / factor_of(to)

def convert_unsafe(value, frm, to):
    # The version without the dimension check - the one a factor table alone
    # gives you. Kept so the program can show the number it invents.
    return value * factor_of(frm) / factor_of(to)

def close(a, b):
    # Conversions go through floats, so exact equality is the wrong test.
    a - b => diff
    if diff < 0:
        0 - diff => diff
    1.0 => scale
    if a > 1.0:
        a => scale
    return diff / scale < 0.000000001


[] => names
for u in units:
    names + [u] => names

"units:"^0
for u in names:
    ("  %-4s %-7s x %s" % (u, dimension_of(u), str(factor_of(u))))^0

""^0
"legal conversions:"^0
[["m", "ft"], ["km", "mi"], ["h", "s"], ["kg", "lb"], ["g", "kg"]] => demos
for d in demos:
    convert(1.0, d[0], d[1]) => v
    ("  1 %-4s = %-22s %s" % (d[0], str(v), d[1]))^0

""^0
"refused conversions, and the number the unchecked version would have given:"^0
[["m", "s"], ["kg", "m"], ["h", "lb"]] => bad
for d in bad:
    try:
        convert(1.0, d[0], d[1]) => v
        ("  1 " + d[0] + " -> " + d[1] + " = " + str(v) + "  (SHOULD HAVE RAISED)")^0
    except TypeError as e:
        convert_unsafe(1.0, d[0], d[1]) => plausible
        ("  " + str(e))^0
        ("      unchecked would have returned " + str(plausible))^0

# ------------------------------------------------------------------ checks
0 => round_trips
0 => identities
0 => legal_pairs
0 => refusals
0 => cross_pairs
0 => transitive
0 => transitive_checked

for a in names:
    for b in names:
        if dimension_of(a) == dimension_of(b):
            legal_pairs + 1 => legal_pairs
            convert(7.5, a, b) => there
            convert(there, b, a) => back
            if close(back, 7.5):
                round_trips + 1 => round_trips
            if a == b:
                if close(there, 7.5):
                    identities + 1 => identities
        else:
            cross_pairs + 1 => cross_pairs
            try:
                convert(7.5, a, b) => v
            except TypeError as e:
                refusals + 1 => refusals

# transitivity, over every triple within a dimension
for a in names:
    for b in names:
        for c in names:
            if dimension_of(a) == dimension_of(b) and dimension_of(b) == dimension_of(c):
                transitive_checked + 1 => transitive_checked
                convert(convert(3.25, a, b), b, c) => stepwise
                convert(3.25, a, c) => direct
                if close(stepwise, direct):
                    transitive + 1 => transitive

# The dimension table predicts the refusal count exactly.
0 => predicted_cross
for a in names:
    for b in names:
        if not (dimension_of(a) == dimension_of(b)):
            predicted_cross + 1 => predicted_cross

# An unknown unit is a different failure and must also be refused.
0 => unknown_refused
for u in ["furlong", "", "M"]:
    try:
        convert(1.0, "m", u) => v
    except ValueError as e:
        unknown_refused + 1 => unknown_refused

""^0
("units:                        " + str(len(names)))^0
("same-dimension pairs:         " + str(legal_pairs))^0
("  round trips exact:          " + str(round_trips) + "/" + str(legal_pairs))^0
("  identities unchanged:       " + str(identities) + "/" + str(len(names)))^0
("triples within a dimension:   " + str(transitive_checked))^0
("  a->b->c equals a->c:        " + str(transitive) + "/" + str(transitive_checked))^0
("cross-dimension pairs:        " + str(cross_pairs) + " (table predicts " + str(predicted_cross) + ")")^0
("  refused:                    " + str(refusals) + "/" + str(cross_pairs))^0
("unknown units refused:        " + str(unknown_refused) + "/3")^0

""^0
if round_trips == legal_pairs and identities == len(names) and transitive == transitive_checked and refusals == cross_pairs and refusals == predicted_cross and unknown_refused == 3:
    "Every legal conversion round-trips; every illegal one was refused." => verdict
else:
    "FAILED - a conversion was wrong, or an illegal one went through." => verdict
verdict^0

""^0
"A factor table alone will happily tell you that one metre is 3.28 seconds." => n1
n1^0
"The arithmetic is correct and the answer is a number. What is missing is" => n2
n2^0
"not precision - it is that the operation was never defined, and the only" => n3
n3^0
"place that can be said is at the boundary, before the multiply." => n4
n4^0
```

## Python (deterministic transpilation)

```python
units = {"m": ["length", 1.0], "km": ["length", 1000.0], "ft": ["length", 0.3048], "mi": ["length", 1609.344], "s": ["time", 1.0], "min": ["time", 60.0], "h": ["time", 3600.0], "kg": ["mass", 1.0], "g": ["mass", 0.001], "lb": ["mass", 0.45359237]}

def dimension_of(u):
    if u in units:
        return units[u][0]
    raise ValueError("unknown unit: " + u)

def factor_of(u):
    if u in units:
        return units[u][1]
    raise ValueError("unknown unit: " + u)

def convert(value, frm, to):
    d1 = dimension_of(frm)
    d2 = dimension_of(to)
    if not d1 == d2:
        raise TypeError("cannot convert " + frm + " (" + d1 + ") to " + to + " (" + d2 + ")")
    return value * factor_of(frm) / factor_of(to)

def convert_unsafe(value, frm, to):
    return value * factor_of(frm) / factor_of(to)

def close(a, b):
    diff = a - b
    if diff < 0:
        diff = 0 - diff
    scale = 1.0
    if a > 1.0:
        scale = a
    return diff / scale < 0.000000001

names = []
for u in units:
    names = names + [u]
print("units:")
for u in names:
    print("  %-4s %-7s x %s" % (u, dimension_of(u), str(factor_of(u))))
print("")
print("legal conversions:")
demos = [["m", "ft"], ["km", "mi"], ["h", "s"], ["kg", "lb"], ["g", "kg"]]
for d in demos:
    v = convert(1.0, d[0], d[1])
    print("  1 %-4s = %-22s %s" % (d[0], str(v), d[1]))
print("")
print("refused conversions, and the number the unchecked version would have given:")
bad = [["m", "s"], ["kg", "m"], ["h", "lb"]]
for d in bad:
    try:
        v = convert(1.0, d[0], d[1])
        print("  1 " + d[0] + " -> " + d[1] + " = " + str(v) + "  (SHOULD HAVE RAISED)")
    except TypeError as e:
        plausible = convert_unsafe(1.0, d[0], d[1])
        print("  " + str(e))
        print("      unchecked would have returned " + str(plausible))
round_trips = 0
identities = 0
legal_pairs = 0
refusals = 0
cross_pairs = 0
transitive = 0
transitive_checked = 0
for a in names:
    for b in names:
        if dimension_of(a) == dimension_of(b):
            legal_pairs = legal_pairs + 1
            there = convert(7.5, a, b)
            back = convert(there, b, a)
            if close(back, 7.5):
                round_trips = round_trips + 1
            if a == b:
                if close(there, 7.5):
                    identities = identities + 1
        else:
            cross_pairs = cross_pairs + 1
            try:
                v = convert(7.5, a, b)
            except TypeError as e:
                refusals = refusals + 1
for a in names:
    for b in names:
        for c in names:
            if dimension_of(a) == dimension_of(b) and dimension_of(b) == dimension_of(c):
                transitive_checked = transitive_checked + 1
                stepwise = convert(convert(3.25, a, b), b, c)
                direct = convert(3.25, a, c)
                if close(stepwise, direct):
                    transitive = transitive + 1
predicted_cross = 0
for a in names:
    for b in names:
        if not dimension_of(a) == dimension_of(b):
            predicted_cross = predicted_cross + 1
unknown_refused = 0
for u in ["furlong", "", "M"]:
    try:
        v = convert(1.0, "m", u)
    except ValueError as e:
        unknown_refused = unknown_refused + 1
print("")
print("units:                        " + str(len(names)))
print("same-dimension pairs:         " + str(legal_pairs))
print("  round trips exact:          " + str(round_trips) + "/" + str(legal_pairs))
print("  identities unchanged:       " + str(identities) + "/" + str(len(names)))
print("triples within a dimension:   " + str(transitive_checked))
print("  a->b->c equals a->c:        " + str(transitive) + "/" + str(transitive_checked))
print("cross-dimension pairs:        " + str(cross_pairs) + " (table predicts " + str(predicted_cross) + ")")
print("  refused:                    " + str(refusals) + "/" + str(cross_pairs))
print("unknown units refused:        " + str(unknown_refused) + "/3")
print("")
if round_trips == legal_pairs and identities == len(names) and transitive == transitive_checked and refusals == cross_pairs and refusals == predicted_cross and unknown_refused == 3:
    verdict = "Every legal conversion round-trips; every illegal one was refused."
else:
    verdict = "FAILED - a conversion was wrong, or an illegal one went through."
print(verdict)
print("")
n1 = "A factor table alone will happily tell you that one metre is 3.28 seconds."
print(n1)
n2 = "The arithmetic is correct and the answer is a number. What is missing is"
print(n2)
n3 = "not precision - it is that the operation was never defined, and the only"
print(n3)
n4 = "place that can be said is at the boundary, before the multiply."
print(n4)
```

## stdout (executed)

```text
units:
  m    length  x 1.0
  km   length  x 1000.0
  ft   length  x 0.3048
  mi   length  x 1609.344
  s    time    x 1.0
  min  time    x 60.0
  h    time    x 3600.0
  kg   mass    x 1.0
  g    mass    x 0.001
  lb   mass    x 0.45359237

legal conversions:
  1 m    = 3.280839895013123      ft
  1 km   = 0.621371192237334      mi
  1 h    = 3600.0                 s
  1 kg   = 2.2046226218487757     lb
  1 g    = 0.001                  kg

refused conversions, and the number the unchecked version would have given:
  cannot convert m (length) to s (time)
      unchecked would have returned 1.0
  cannot convert kg (mass) to m (length)
      unchecked would have returned 1.0
  cannot convert h (time) to lb (mass)
      unchecked would have returned 7936.6414386555925

units:                        10
same-dimension pairs:         34
  round trips exact:          34/34
  identities unchanged:       10/10
triples within a dimension:   118
  a->b->c equals a->c:        118/118
cross-dimension pairs:        66 (table predicts 66)
  refused:                    66/66
unknown units refused:        3/3

Every legal conversion round-trips; every illegal one was refused.

A factor table alone will happily tell you that one metre is 3.28 seconds.
The arithmetic is correct and the answer is a number. What is missing is
not precision - it is that the operation was never defined, and the only
place that can be said is at the boundary, before the multiply.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
