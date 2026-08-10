<!-- canonical: efficientnewlanguage.org/ai/examples/333-the-safe-range-of-a-composition | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 333 — The safe range of a composition — neither the union nor the intersection

`the_safe_range_of_a_composition.eml` sweeps every integer input from 0 to 100 through two functions with documented safe ranges and reads the composition's safe set off the results.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two functions
# with documented safe ranges, and a composition whose safe range is neither
# their union nor their intersection.
#
# `scale` is documented safe for inputs 0 to 50 - outside that it overflows the
# fixed-point budget the system uses. `shift` is documented safe for 40 to 100.
# Both documents are accurate. Neither says anything about the composition,
# because a safe range is a statement about ONE function's inputs, and the
# composition's inputs are the first function's while its risk lives in the
# second's.
#
# Neither obvious guess is the answer, and - measured rather than assumed -
# they are not wrong in the same way. The union admits inputs that are not safe.
# The intersection admits none, but rejects most of the ones that are: it is
# sound and badly incomplete, which costs throughput instead of correctness and
# so is never investigated. The real safe set is whichever inputs make the
# first function's OUTPUT land where the second is safe - a set nobody wrote
# down, in units nobody stated.
#
# The measurement sweeps every integer input, evaluates the composition, and
# reads the safe set off the results. Then it compares that set against the
# intersection and the union. The two guesses fail differently: one admits
# unsafe inputs, the other rejects safe ones, and only measuring separates them.

def scale(x):
    return x * 2

def shift(y):
    return y - 30

def scale_is_safe(x):
    if x < 0:
        return 0
    if x > 50:
        return 0
    return 1

def shift_is_safe(y):
    if y < 40:
        return 0
    if y > 100:
        return 0
    return 1

def composition_is_safe(x):
    if scale_is_safe(x) == 0:
        return 0
    if shift_is_safe(scale(x)) == 0:
        return 0
    return 1

def bounds(pred_name):
    0 - 1 => lo
    0 - 1 => hi
    for x in [0:100]:
        1 => ok
        if pred_name == "scale":
            scale_is_safe(x) => ok
        if pred_name == "shift":
            shift_is_safe(x) => ok
        if pred_name == "both":
            composition_is_safe(x) => ok
        if ok == 1:
            if lo < 0:
                x => lo
            x => hi
    return [lo, hi]

def count_safe(pred_name):
    0 => n
    for x in [0:100]:
        1 => ok
        if pred_name == "scale":
            scale_is_safe(x) => ok
        if pred_name == "shift":
            shift_is_safe(x) => ok
        if pred_name == "both":
            composition_is_safe(x) => ok
        if ok == 1:
            n + 1 => n
    return n

"sweeping every integer input from 0 to 100" ^0
bounds("scale") => sb
bounds("shift") => hb
bounds("both") => cb
"  scale safe on inputs       : " + str(sb[0]) + " .. " + str(sb[1]) + "   (" + str(count_safe("scale")) + " values)" ^0
"  shift safe on ITS inputs   : " + str(hb[0]) + " .. " + str(hb[1]) + "  (" + str(count_safe("shift")) + " values)" ^0
"  composition safe on inputs : " + str(cb[0]) + " .. " + str(cb[1]) + "   (" + str(count_safe("both")) + " values)" ^0
"" ^0

# ---- the two natural guesses, and the two different ways they fail ----

"guess 1: the safe set is the intersection of the two documented ranges" ^0
0 => inter_lo
0 => inter_hi
max([sb[0], hb[0]]) => inter_lo
min([sb[1], hb[1]]) => inter_hi
"  intersection : " + str(inter_lo) + " .. " + str(inter_hi) ^0
0 => wrong_in_inter
for x in [0:100]:
    if x >= inter_lo:
        if x <= inter_hi:
            if composition_is_safe(x) == 0:
                wrong_in_inter + 1 => wrong_in_inter
"  inputs inside the intersection that are NOT safe: " + str(wrong_in_inter) ^0
0 => missed_by_inter
for x in [0:100]:
    if composition_is_safe(x) == 1:
        if x < inter_lo:
            missed_by_inter + 1 => missed_by_inter
        else:
            if x > inter_hi:
                missed_by_inter + 1 => missed_by_inter
"  safe inputs the intersection MISSES            : " + str(missed_by_inter) + " of " + str(count_safe("both")) ^0
"  so the intersection is sound but not complete - a different kind of" ^0
"  wrong from the union, and the one that quietly shrinks throughput" ^0
"" ^0

"guess 2: the safe set is the union of the two documented ranges" ^0
min([sb[0], hb[0]]) => uni_lo
max([sb[1], hb[1]]) => uni_hi
"  union : " + str(uni_lo) + " .. " + str(uni_hi) ^0
0 => wrong_in_uni
for x in [0:100]:
    if x >= uni_lo:
        if x <= uni_hi:
            if composition_is_safe(x) == 0:
                wrong_in_uni + 1 => wrong_in_uni
"  inputs inside the union that are NOT safe: " + str(wrong_in_uni) ^0
"" ^0

# ---- where the real boundary is, and why it is not in either document ----

"the composition's own boundary" ^0
"  smallest safe input : " + str(cb[0]) + "  -> scale gives " + str(scale(cb[0])) + ", shift gives " + str(shift(scale(cb[0]))) ^0
"  largest safe input  : " + str(cb[1]) + "  -> scale gives " + str(scale(cb[1])) + ", shift gives " + str(shift(scale(cb[1]))) ^0
"" ^0
"  one below : " + str(cb[0] - 1) + " -> scale gives " + str(scale(cb[0] - 1)) + ", which shift is not safe on" ^0
"  one above : " + str(cb[1] + 1) + " -> scale gives " + str(scale(cb[1] + 1)) + ", which scale is not safe on" ^0
"" ^0
"The lower bound is set by the SECOND function and the upper bound by the" ^0
"FIRST, and both are stated in units of their own input. Neither document is" ^0
"wrong and neither is enough." ^0
```

## Python (deterministic transpilation)

```python
def scale(x):
    return x * 2

def shift(y):
    return y - 30

def scale_is_safe(x):
    if x < 0:
        return 0
    if x > 50:
        return 0
    return 1

def shift_is_safe(y):
    if y < 40:
        return 0
    if y > 100:
        return 0
    return 1

def composition_is_safe(x):
    if scale_is_safe(x) == 0:
        return 0
    if shift_is_safe(scale(x)) == 0:
        return 0
    return 1

def bounds(pred_name):
    lo = 0 - 1
    hi = 0 - 1
    for x in range(0, 101):
        ok = 1
        if pred_name == "scale":
            ok = scale_is_safe(x)
        if pred_name == "shift":
            ok = shift_is_safe(x)
        if pred_name == "both":
            ok = composition_is_safe(x)
        if ok == 1:
            if lo < 0:
                lo = x
            hi = x
    return [lo, hi]

def count_safe(pred_name):
    n = 0
    for x in range(0, 101):
        ok = 1
        if pred_name == "scale":
            ok = scale_is_safe(x)
        if pred_name == "shift":
            ok = shift_is_safe(x)
        if pred_name == "both":
            ok = composition_is_safe(x)
        if ok == 1:
            n = n + 1
    return n

print("sweeping every integer input from 0 to 100")
sb = bounds("scale")
hb = bounds("shift")
cb = bounds("both")
print("  scale safe on inputs       : " + str(sb[0]) + " .. " + str(sb[1]) + "   (" + str(count_safe("scale")) + " values)")
print("  shift safe on ITS inputs   : " + str(hb[0]) + " .. " + str(hb[1]) + "  (" + str(count_safe("shift")) + " values)")
print("  composition safe on inputs : " + str(cb[0]) + " .. " + str(cb[1]) + "   (" + str(count_safe("both")) + " values)")
print("")
print("guess 1: the safe set is the intersection of the two documented ranges")
inter_lo = 0
inter_hi = 0
inter_lo = max([sb[0], hb[0]])
inter_hi = min([sb[1], hb[1]])
print("  intersection : " + str(inter_lo) + " .. " + str(inter_hi))
wrong_in_inter = 0
for x in range(0, 101):
    if x >= inter_lo:
        if x <= inter_hi:
            if composition_is_safe(x) == 0:
                wrong_in_inter = wrong_in_inter + 1
print("  inputs inside the intersection that are NOT safe: " + str(wrong_in_inter))
missed_by_inter = 0
for x in range(0, 101):
    if composition_is_safe(x) == 1:
        if x < inter_lo:
            missed_by_inter = missed_by_inter + 1
        elif x > inter_hi:
            missed_by_inter = missed_by_inter + 1
print("  safe inputs the intersection MISSES            : " + str(missed_by_inter) + " of " + str(count_safe("both")))
print("  so the intersection is sound but not complete - a different kind of")
print("  wrong from the union, and the one that quietly shrinks throughput")
print("")
print("guess 2: the safe set is the union of the two documented ranges")
uni_lo = min([sb[0], hb[0]])
uni_hi = max([sb[1], hb[1]])
print("  union : " + str(uni_lo) + " .. " + str(uni_hi))
wrong_in_uni = 0
for x in range(0, 101):
    if x >= uni_lo:
        if x <= uni_hi:
            if composition_is_safe(x) == 0:
                wrong_in_uni = wrong_in_uni + 1
print("  inputs inside the union that are NOT safe: " + str(wrong_in_uni))
print("")
print("the composition's own boundary")
print("  smallest safe input : " + str(cb[0]) + "  -> scale gives " + str(scale(cb[0])) + ", shift gives " + str(shift(scale(cb[0]))))
print("  largest safe input  : " + str(cb[1]) + "  -> scale gives " + str(scale(cb[1])) + ", shift gives " + str(shift(scale(cb[1]))))
print("")
print("  one below : " + str(cb[0] - 1) + " -> scale gives " + str(scale(cb[0] - 1)) + ", which shift is not safe on")
print("  one above : " + str(cb[1] + 1) + " -> scale gives " + str(scale(cb[1] + 1)) + ", which scale is not safe on")
print("")
print("The lower bound is set by the SECOND function and the upper bound by the")
print("FIRST, and both are stated in units of their own input. Neither document is")
print("wrong and neither is enough.")
```

## stdout (executed)

```text
sweeping every integer input from 0 to 100
  scale safe on inputs       : 0 .. 50   (51 values)
  shift safe on ITS inputs   : 40 .. 100  (61 values)
  composition safe on inputs : 20 .. 50   (31 values)

guess 1: the safe set is the intersection of the two documented ranges
  intersection : 40 .. 50
  inputs inside the intersection that are NOT safe: 0
  safe inputs the intersection MISSES            : 20 of 31
  so the intersection is sound but not complete - a different kind of
  wrong from the union, and the one that quietly shrinks throughput

guess 2: the safe set is the union of the two documented ranges
  union : 0 .. 100
  inputs inside the union that are NOT safe: 70

the composition's own boundary
  smallest safe input : 20  -> scale gives 40, shift gives 10
  largest safe input  : 50  -> scale gives 100, shift gives 70

  one below : 19 -> scale gives 38, which shift is not safe on
  one above : 51 -> scale gives 102, which scale is not safe on

The lower bound is set by the SECOND function and the upper bound by the
FIRST, and both are stated in units of their own input. Neither document is
wrong and neither is enough.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:output · eml:call · eml:assign · eml:return · eml:run:done
