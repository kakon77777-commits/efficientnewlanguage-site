<!-- canonical: efficientnewlanguage.org/ai/examples/463-the-compensated-sum-and-the-loop-disagree | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 463 — The compensated sum and the loop disagree

`the_compensated_sum_and_the_loop_disagree.eml` - The same numbers added two ways give two answers. Which addition each way performs is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The same numbers
# added two ways give two answers. Which addition each way performs is computed
# below.
#
# Both are correct additions. `sum()` carries a compensation term so the
# rounding error of each step is folded back in, which is the better algorithm
# and is why it is the builtin. A loop with `+` does exactly what `+` is
# specified to do at each step, and every one of those steps is right.
#
# The difference is not in any step. It is in what is kept between steps: the
# builtin keeps the part that would have been lost, the loop does not, and
# after ten additions the two totals are different numbers.
#
# Both are run over the same list and compared at every prefix.

[0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1] => tenths
len(tenths) => n

0.0 => running
for v in tenths:
    running + v => running

"adding " + str(n) + " values of 0.1" ^0
"  a loop with +   : " + str(running) ^0
"  sum()           : " + str(sum(tenths)) ^0
if running == sum(tenths):
    "  the two agree" ^0
else:
    "  the two disagree" ^0
if running == 1.0:
    "  the loop total equals 1.0" ^0
else:
    "  the loop total does not equal 1.0" ^0
if sum(tenths) == 1.0:
    "  the builtin total equals 1.0" ^0
"" ^0

# ---- where the two part company ----

"prefix   loop total            sum() of the same prefix   equal" ^0
0.0 => acc
[] => prefix
0 => first_gap
for i in [0:n - 1]:
    acc + tenths[i] => acc
    prefix + [tenths[i]] => prefix
    "" => same
    if acc == sum(prefix):
        same + "yes" => same
    else:
        same + "no " => same
        if first_gap == 0:
            i + 1 => first_gap
    "  " + str(i + 1) + "        " + str(acc) + "        " + str(sum(prefix)) + "        " + same ^0
"" ^0
if first_gap > 0:
    "they first differ at " + str(first_gap) + " values" ^0
    "  before that the two agree - neither is exact at 3 values, they are wrong" ^0
    "  together - so a check on a short list cannot separate them" ^0
"" ^0

# ---- what a per-step check sees ----
#
# Each addition is correct to the precision available. There is no step at
# which the loop does something a reviewer would call wrong.

0.0 => a
0 => bad_steps
for i in [0:n - 1]:
    a => before
    a + tenths[i] => a
    a - before => actual_step
    if actual_step > 0.1:
        bad_steps + 1 => bad_steps
    if actual_step < 0.1:
        bad_steps + 1 => bad_steps
"steps whose own increment was not exactly 0.1 : " + str(bad_steps) + " of " + str(n) ^0
if bad_steps > 0:
    "  so the error is visible per step after all, and it is tiny at each one" ^0
    "  what accumulates is the sum of those, which no single step reports" ^0
"" ^0

# ---- what it costs a test ----

"a test asserting the total is 1.0" ^0
if sum(tenths) == 1.0:
    "  written with sum()   : passes" ^0
if not (running == 1.0):
    "  written with a loop  : fails" ^0
"  the same data, the same assertion, and the choice of accumulator decides it" ^0
"" ^0

"the difference between the two totals" ^0
sum(tenths) - running => gap
"  " + str(gap) ^0
"  small enough that no tolerance anyone sets would reject either total," ^0
"  and large enough that == rejects one of them" ^0
"" ^0

# ---- where it matters and where it does not ----

"the same list scaled to money, in whole cents" ^0
[10, 10, 10, 10, 10, 10, 10, 10, 10, 10] => cents
0 => cent_total
for v in cents:
    cent_total + v => cent_total
"  a loop over integers : " + str(cent_total) ^0
"  sum() over integers  : " + str(sum(cents)) ^0
if cent_total == sum(cents):
    "  identical, because integer addition has nothing to lose between steps" ^0
    "  the unit is what removed the problem, not the algorithm" ^0
"" ^0

# ---- the control: values that are exact in binary ----
#
# Where each value is representable, both accumulators are exact and the two
# routes agree, so a comparison on this list proves nothing about either.

[0.5, 0.25, 0.125, 0.5, 0.25] => exact
0.0 => e_acc
for v in exact:
    e_acc + v => e_acc
"control - values that are exact in binary" ^0
"  loop  : " + str(e_acc) ^0
"  sum() : " + str(sum(exact)) ^0
if e_acc == sum(exact):
    "  the same, so this list cannot separate the two accumulators" ^0
"" ^0

"Both routes perform correct additions and one of them keeps what the other" ^0
"discards. The choice shows up in no step and in the total, so a program is" ^0
"tested on the steps and used for the total." ^0
```

## Python (deterministic transpilation)

```python
tenths = [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1]
n = len(tenths)
running = 0.0
for v in tenths:
    running = running + v
print("adding " + str(n) + " values of 0.1")
print("  a loop with +   : " + str(running))
print("  sum()           : " + str(sum(tenths)))
if running == sum(tenths):
    print("  the two agree")
else:
    print("  the two disagree")
if running == 1.0:
    print("  the loop total equals 1.0")
else:
    print("  the loop total does not equal 1.0")
if sum(tenths) == 1.0:
    print("  the builtin total equals 1.0")
print("")
print("prefix   loop total            sum() of the same prefix   equal")
acc = 0.0
prefix = []
first_gap = 0
for i in range(0, n):
    acc = acc + tenths[i]
    prefix = prefix + [tenths[i]]
    same = ""
    if acc == sum(prefix):
        same = same + "yes"
    else:
        same = same + "no "
        if first_gap == 0:
            first_gap = i + 1
    print("  " + str(i + 1) + "        " + str(acc) + "        " + str(sum(prefix)) + "        " + same)
print("")
if first_gap > 0:
    print("they first differ at " + str(first_gap) + " values")
    print("  before that the two agree - neither is exact at 3 values, they are wrong")
    print("  together - so a check on a short list cannot separate them")
print("")
a = 0.0
bad_steps = 0
for i in range(0, n):
    before = a
    a = a + tenths[i]
    actual_step = a - before
    if actual_step > 0.1:
        bad_steps = bad_steps + 1
    if actual_step < 0.1:
        bad_steps = bad_steps + 1
print("steps whose own increment was not exactly 0.1 : " + str(bad_steps) + " of " + str(n))
if bad_steps > 0:
    print("  so the error is visible per step after all, and it is tiny at each one")
    print("  what accumulates is the sum of those, which no single step reports")
print("")
print("a test asserting the total is 1.0")
if sum(tenths) == 1.0:
    print("  written with sum()   : passes")
if not running == 1.0:
    print("  written with a loop  : fails")
print("  the same data, the same assertion, and the choice of accumulator decides it")
print("")
print("the difference between the two totals")
gap = sum(tenths) - running
print("  " + str(gap))
print("  small enough that no tolerance anyone sets would reject either total,")
print("  and large enough that == rejects one of them")
print("")
print("the same list scaled to money, in whole cents")
cents = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10]
cent_total = 0
for v in cents:
    cent_total = cent_total + v
print("  a loop over integers : " + str(cent_total))
print("  sum() over integers  : " + str(sum(cents)))
if cent_total == sum(cents):
    print("  identical, because integer addition has nothing to lose between steps")
    print("  the unit is what removed the problem, not the algorithm")
print("")
exact = [0.5, 0.25, 0.125, 0.5, 0.25]
e_acc = 0.0
for v in exact:
    e_acc = e_acc + v
print("control - values that are exact in binary")
print("  loop  : " + str(e_acc))
print("  sum() : " + str(sum(exact)))
if e_acc == sum(exact):
    print("  the same, so this list cannot separate the two accumulators")
print("")
print("Both routes perform correct additions and one of them keeps what the other")
print("discards. The choice shows up in no step and in the total, so a program is")
print("tested on the steps and used for the total.")
```

## stdout (executed)

```text
adding 10 values of 0.1
  a loop with +   : 0.9999999999999999
  sum()           : 1.0
  the two disagree
  the loop total does not equal 1.0
  the builtin total equals 1.0

prefix   loop total            sum() of the same prefix   equal
  1        0.1        0.1        yes
  2        0.2        0.2        yes
  3        0.30000000000000004        0.30000000000000004        yes
  4        0.4        0.4        yes
  5        0.5        0.5        yes
  6        0.6        0.6000000000000001        no 
  7        0.7        0.7000000000000001        no 
  8        0.7999999999999999        0.8        no 
  9        0.8999999999999999        0.9        no 
  10        0.9999999999999999        1.0        no 

they first differ at 6 values
  before that the two agree - neither is exact at 3 values, they are wrong
  together - so a check on a short list cannot separate them

steps whose own increment was not exactly 0.1 : 8 of 10
  so the error is visible per step after all, and it is tiny at each one
  what accumulates is the sum of those, which no single step reports

a test asserting the total is 1.0
  written with sum()   : passes
  written with a loop  : fails
  the same data, the same assertion, and the choice of accumulator decides it

the difference between the two totals
  1.1102230246251565e-16
  small enough that no tolerance anyone sets would reject either total,
  and large enough that == rejects one of them

the same list scaled to money, in whole cents
  a loop over integers : 100
  sum() over integers  : 100
  identical, because integer addition has nothing to lose between steps
  the unit is what removed the problem, not the algorithm

control - values that are exact in binary
  loop  : 1.625
  sum() : 1.625
  the same, so this list cannot separate the two accumulators

Both routes perform correct additions and one of them keeps what the other
discards. The choice shows up in no step and in the total, so a program is
tested on the steps and used for the total.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
