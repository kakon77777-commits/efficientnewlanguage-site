<!-- canonical: efficientnewlanguage.org/ai/examples/467-the-loop-stopped-because-the-steps-got-small | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 467 — The loop stopped because the steps got small

`the_loop_stopped_because_the_steps_got_small.eml` - The solver stops when a step is smaller than the tolerance. How far it still is from the answer at that moment is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The solver stops
# when a step is smaller than the tolerance. How far it still is from the answer
# at that moment is computed below.
#
# Stopping on the step size is the standard rule and it is the only one
# available when the answer is not known. It is cheap, it needs nothing but the
# last two iterates, and on a sequence that is closing fast it stops within the
# tolerance it was given.
#
# The step is how far the last iteration moved, not how far there is left. On a
# sequence that closes a fixed fraction of the gap each time, the two are
# related by that fraction, and a rule that reads one and reports the other is
# out by a factor nobody chose.
#
# Everything here is in parts per million, as integers, so nothing is hidden in
# a rounding.

1000000 => target
10 => closes_one_part_in
1000 => tolerance

"target        : " + str(target) + " ppm" ^0
"each step closes 1 part in " + str(closes_one_part_in) + " of the remaining gap" ^0
"stop when a step is under " + str(tolerance) + " ppm" ^0
"" ^0

0 => x
0 => iterations
0 => last_step
0 => stopped
while stopped == 0:
    target - x => gap
    int(gap / closes_one_part_in) => step
    if step < 1:
        1 => step
    x + step => x
    step => last_step
    iterations + 1 => iterations
    if step < tolerance:
        1 => stopped
    if iterations > 200:
        1 => stopped

"the run" ^0
"  iterations : " + str(iterations) ^0
"  last step  : " + str(last_step) + " ppm, which is under the tolerance of " + str(tolerance) ^0
"  value      : " + str(x) ^0
"  distance still to go : " + str(target - x) ^0
"" ^0

if target - x > tolerance:
    "the rule stopped inside its tolerance on the step and " + str(target - x) + " ppm from" ^0
    "the answer, which is " + str(int((target - x) / tolerance)) + " times the tolerance it was given" ^0
"" ^0

# ---- why the two differ by that much ----
#
# If each step is one part in k of what is left, then what is left is k times
# the step that was just taken. The factor is a property of the sequence and
# it is knowable from two iterates.

"the relation between a step and the remainder" ^0
"  a step of " + str(last_step) + " means the gap before it was about " + str(last_step * closes_one_part_in) ^0
"  so after it the gap is about " + str(last_step * closes_one_part_in - last_step) ^0
"  measured : " + str(target - x) ^0
if last_step * closes_one_part_in - last_step > 0:
    "  the step understates the remaining distance by roughly the factor " + str(closes_one_part_in - 1) ^0
"" ^0

# ---- the same rule with the factor put back ----
#
# Nothing about the loop changes. The stopping test multiplies the step by the
# ratio the sequence is already showing.

0 => x2
0 => iter2
0 => stop2
0 => prev_step
0 => est_remaining
while stop2 == 0:
    target - x2 => gap
    int(gap / closes_one_part_in) => step
    if step < 1:
        1 => step
    x2 + step => x2
    iter2 + 1 => iter2
    step * (closes_one_part_in - 1) => est_remaining
    if est_remaining < tolerance:
        1 => stop2
    if iter2 > 400:
        1 => stop2

"stopping when the estimated remainder is under the tolerance" ^0
"  iterations : " + str(iter2) ^0
"  value      : " + str(x2) ^0
"  distance still to go : " + str(target - x2) ^0
if iter2 > iterations:
    "  it costs " + str(iter2 - iterations) + " more iterations" ^0
if target - x2 < target - x:
    "  and lands " + str((target - x) - (target - x2)) + " ppm closer" ^0
if target - x2 <= tolerance:
    "  inside the tolerance that was actually asked for" ^0
"" ^0

# ---- what each rule is a statement about ----

"what the two tests assert when they pass" ^0
"  step under tolerance      : the last iteration moved less than " + str(tolerance) ^0
"  remainder under tolerance : the answer is within " + str(tolerance) ^0
"  only the second one is the thing anybody wanted, and the first one is the" ^0
"  one that can be computed without knowing the answer" ^0
"" ^0

# ---- the control: a sequence that closes a fixed amount ----
#
# Where each step is the same size rather than a fraction of what is left, the
# last step and the remaining distance are the same number and the standard
# rule is exact.

0 => x3
0 => iter3
5000 => fixed_step
while x3 + fixed_step <= target:
    x3 + fixed_step => x3
    iter3 + 1 => iter3
"control - a sequence closing a fixed " + str(fixed_step) + " ppm each step" ^0
"  iterations : " + str(iter3) + ", value : " + str(x3) + ", remaining : " + str(target - x3) ^0
if target - x3 < fixed_step:
    "  the remaining distance is under one step, so the step size is a bound" ^0
    "  on it and stopping on the step is stopping on the answer" ^0
"" ^0

"The step size is the only quantity available and the rule that uses it is" ^0
"the standard one. It is a measurement of the last move, and the ratio" ^0
"between that and what is left is sitting in the two iterates already held." ^0
```

## Python (deterministic transpilation)

```python
target = 1000000
closes_one_part_in = 10
tolerance = 1000
print("target        : " + str(target) + " ppm")
print("each step closes 1 part in " + str(closes_one_part_in) + " of the remaining gap")
print("stop when a step is under " + str(tolerance) + " ppm")
print("")
x = 0
iterations = 0
last_step = 0
stopped = 0
while stopped == 0:
    gap = target - x
    step = int(gap / closes_one_part_in)
    if step < 1:
        step = 1
    x = x + step
    last_step = step
    iterations = iterations + 1
    if step < tolerance:
        stopped = 1
    if iterations > 200:
        stopped = 1
print("the run")
print("  iterations : " + str(iterations))
print("  last step  : " + str(last_step) + " ppm, which is under the tolerance of " + str(tolerance))
print("  value      : " + str(x))
print("  distance still to go : " + str(target - x))
print("")
if target - x > tolerance:
    print("the rule stopped inside its tolerance on the step and " + str(target - x) + " ppm from")
    print("the answer, which is " + str(int((target - x) / tolerance)) + " times the tolerance it was given")
print("")
print("the relation between a step and the remainder")
print("  a step of " + str(last_step) + " means the gap before it was about " + str(last_step * closes_one_part_in))
print("  so after it the gap is about " + str(last_step * closes_one_part_in - last_step))
print("  measured : " + str(target - x))
if last_step * closes_one_part_in - last_step > 0:
    print("  the step understates the remaining distance by roughly the factor " + str(closes_one_part_in - 1))
print("")
x2 = 0
iter2 = 0
stop2 = 0
prev_step = 0
est_remaining = 0
while stop2 == 0:
    gap = target - x2
    step = int(gap / closes_one_part_in)
    if step < 1:
        step = 1
    x2 = x2 + step
    iter2 = iter2 + 1
    est_remaining = step * (closes_one_part_in - 1)
    if est_remaining < tolerance:
        stop2 = 1
    if iter2 > 400:
        stop2 = 1
print("stopping when the estimated remainder is under the tolerance")
print("  iterations : " + str(iter2))
print("  value      : " + str(x2))
print("  distance still to go : " + str(target - x2))
if iter2 > iterations:
    print("  it costs " + str(iter2 - iterations) + " more iterations")
if target - x2 < target - x:
    print("  and lands " + str(target - x - (target - x2)) + " ppm closer")
if target - x2 <= tolerance:
    print("  inside the tolerance that was actually asked for")
print("")
print("what the two tests assert when they pass")
print("  step under tolerance      : the last iteration moved less than " + str(tolerance))
print("  remainder under tolerance : the answer is within " + str(tolerance))
print("  only the second one is the thing anybody wanted, and the first one is the")
print("  one that can be computed without knowing the answer")
print("")
x3 = 0
iter3 = 0
fixed_step = 5000
while x3 + fixed_step <= target:
    x3 = x3 + fixed_step
    iter3 = iter3 + 1
print("control - a sequence closing a fixed " + str(fixed_step) + " ppm each step")
print("  iterations : " + str(iter3) + ", value : " + str(x3) + ", remaining : " + str(target - x3))
if target - x3 < fixed_step:
    print("  the remaining distance is under one step, so the step size is a bound")
    print("  on it and stopping on the step is stopping on the answer")
print("")
print("The step size is the only quantity available and the rule that uses it is")
print("the standard one. It is a measurement of the last move, and the ratio")
print("between that and what is left is sitting in the two iterates already held.")
```

## stdout (executed)

```text
target        : 1000000 ppm
each step closes 1 part in 10 of the remaining gap
stop when a step is under 1000 ppm

the run
  iterations : 45
  last step  : 970 ppm, which is under the tolerance of 1000
  value      : 991268
  distance still to go : 8732

the rule stopped inside its tolerance on the step and 8732 ppm from
the answer, which is 8 times the tolerance it was given

the relation between a step and the remainder
  a step of 970 means the gap before it was about 9700
  so after it the gap is about 8730
  measured : 8732
  the step understates the remaining distance by roughly the factor 9

stopping when the estimated remainder is under the tolerance
  iterations : 66
  value      : 999041
  distance still to go : 959
  it costs 21 more iterations
  and lands 7773 ppm closer
  inside the tolerance that was actually asked for

what the two tests assert when they pass
  step under tolerance      : the last iteration moved less than 1000
  remainder under tolerance : the answer is within 1000
  only the second one is the thing anybody wanted, and the first one is the
  one that can be computed without knowing the answer

control - a sequence closing a fixed 5000 ppm each step
  iterations : 200, value : 1000000, remaining : 0
  the remaining distance is under one step, so the step size is a bound
  on it and stopping on the step is stopping on the answer

The step size is the only quantity available and the rule that uses it is
the standard one. It is a measurement of the last move, and the ratio
between that and what is left is sitting in the two iterates already held.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
