<!-- canonical: efficientnewlanguage.org/ai/examples/465-the-guard-was-moved-for-readability | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 465 — The guard was moved for readability

`the_guard_was_moved_for_readability.eml` - The two clauses of a condition were swapped so the important one reads first. Which inputs that changes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The two clauses
# of a condition were swapped so the important one reads first. Which inputs
# that changes is computed below.
#
# Putting the meaningful test first is good style and reviewers ask for it. A
# reader wants to see what the condition is about before seeing the bookkeeping
# that makes it safe to evaluate, and on almost every input the two orders
# accept and reject exactly the same things.
#
# `and` stops at the first false clause, so the left clause decides whether the
# right one runs at all. When the right one is only defined given the left, the
# order is not presentation - it is the guard.
#
# Every input is run through both orders and the difference is counted.

# [label, batch size, total]
[["normal", 4, 100], ["single", 1, 25], ["empty batch", 0, 0], ["large", 50, 900], ["empty with total", 0, 40]] => inputs

len(inputs) => n

# guard first: size is checked before it is used as a divisor
def safe_order(size, total):
    if size > 0:
        if int(total / size) > 20:
            return 1
    return 0

# the meaningful test first: the average is computed before size is checked
def readable_order(size, total):
    if size == 0:
        return 0 - 1
    if int(total / size) > 20:
        if size > 0:
            return 1
    return 0

"inputs : " + str(n) ^0
"the condition : the average per item is over 20, and the batch is non-empty" ^0
"" ^0

"input              size   total   guard first   meaning first" ^0
0 => agree
0 => would_crash
for r in inputs:
    r[1] => size
    r[2] => total
    safe_order(size, total) => a
    readable_order(size, total) => b
    "" => bs
    if b == 0 - 1:
        bs + "DIVIDES BY ZERO" => bs
        would_crash + 1 => would_crash
    else:
        if b == 1:
            bs + "yes" => bs
        else:
            bs + "no " => bs
        if a == b:
            agree + 1 => agree
    "" => as_
    if a == 1:
        as_ + "yes" => as_
    else:
        as_ + "no " => as_
    "  " + r[0] + "   " + str(size) + "      " + str(total) + "     " + as_ + "           " + bs ^0
"" ^0

"inputs where the two orders give the same answer : " + str(agree) + " of " + str(n) ^0
if would_crash > 0:
    "inputs where the readable order divides by zero : " + str(would_crash) ^0
    "  on every other input the two are indistinguishable, which is why the" ^0
    "  swap passed review and passed the suite" ^0
"" ^0

# ---- what the suite contained ----

0 => with_empty
for r in inputs:
    if r[1] == 0:
        with_empty + 1 => with_empty
"inputs in this set with an empty batch : " + str(with_empty) + " of " + str(n) ^0
if with_empty > 0:
    "  a suite without one of these cannot tell the two orders apart, and an" ^0
    "  empty batch is the input least likely to be written down as a case" ^0
"" ^0

# ---- the shape that makes order load-bearing ----

"when does clause order matter" ^0
"  both clauses defined for every input : never" ^0
"  the right clause defined only when the left holds : always" ^0
"  here the right clause divides by size, so it is defined only when the" ^0
"  left clause is true, and that is what makes the order a guard" ^0
"" ^0

# ---- the form that reads well and is still safe ----
#
# The readability request is answerable. Naming the quantity separates the
# order of the reading from the order of the evaluation.

"the same condition with the meaning named first" ^0
"  is_worthwhile = average over 20, defined for non-empty batches" ^0
"  the check then reads: batch is non-empty AND is_worthwhile" ^0
"  the reader sees the meaning in the name and the machine sees the guard" ^0
"  in the order, and neither has to give way" ^0
"" ^0

# ---- the control: two clauses that are independently defined ----
#
# Where each clause is defined whatever the other says, the order is style and
# nothing else, and a reviewer asking for the swap is simply right.

[["a", 5, 200], ["b", 0, 0], ["c", 3, 30]] => indep
0 => same
for r in indep:
    0 => x
    if r[1] >= 0:
        if r[2] > 50:
            1 => x
    0 => y
    if r[2] > 50:
        if r[1] >= 0:
            1 => y
    if x == y:
        same + 1 => same
"control - two clauses that are defined for every input" ^0
"  inputs where the two orders agree : " + str(same) + " of " + str(len(indep)) ^0
if same == len(indep):
    "  identical under both orders, so here the swap costs nothing at all" ^0
"" ^0

"The swapped condition reads better and returns the same answer on every" ^0
"input the suite holds. One clause is defined only when the other is true," ^0
"and the order was carrying that." ^0
```

## Python (deterministic transpilation)

```python
inputs = [["normal", 4, 100], ["single", 1, 25], ["empty batch", 0, 0], ["large", 50, 900], ["empty with total", 0, 40]]
n = len(inputs)

def safe_order(size, total):
    if size > 0:
        if int(total / size) > 20:
            return 1
    return 0

def readable_order(size, total):
    if size == 0:
        return 0 - 1
    if int(total / size) > 20:
        if size > 0:
            return 1
    return 0

print("inputs : " + str(n))
print("the condition : the average per item is over 20, and the batch is non-empty")
print("")
print("input              size   total   guard first   meaning first")
agree = 0
would_crash = 0
for r in inputs:
    size = r[1]
    total = r[2]
    a = safe_order(size, total)
    b = readable_order(size, total)
    bs = ""
    if b == 0 - 1:
        bs = bs + "DIVIDES BY ZERO"
        would_crash = would_crash + 1
    else:
        if b == 1:
            bs = bs + "yes"
        else:
            bs = bs + "no "
        if a == b:
            agree = agree + 1
    as_ = ""
    if a == 1:
        as_ = as_ + "yes"
    else:
        as_ = as_ + "no "
    print("  " + r[0] + "   " + str(size) + "      " + str(total) + "     " + as_ + "           " + bs)
print("")
print("inputs where the two orders give the same answer : " + str(agree) + " of " + str(n))
if would_crash > 0:
    print("inputs where the readable order divides by zero : " + str(would_crash))
    print("  on every other input the two are indistinguishable, which is why the")
    print("  swap passed review and passed the suite")
print("")
with_empty = 0
for r in inputs:
    if r[1] == 0:
        with_empty = with_empty + 1
print("inputs in this set with an empty batch : " + str(with_empty) + " of " + str(n))
if with_empty > 0:
    print("  a suite without one of these cannot tell the two orders apart, and an")
    print("  empty batch is the input least likely to be written down as a case")
print("")
print("when does clause order matter")
print("  both clauses defined for every input : never")
print("  the right clause defined only when the left holds : always")
print("  here the right clause divides by size, so it is defined only when the")
print("  left clause is true, and that is what makes the order a guard")
print("")
print("the same condition with the meaning named first")
print("  is_worthwhile = average over 20, defined for non-empty batches")
print("  the check then reads: batch is non-empty AND is_worthwhile")
print("  the reader sees the meaning in the name and the machine sees the guard")
print("  in the order, and neither has to give way")
print("")
indep = [["a", 5, 200], ["b", 0, 0], ["c", 3, 30]]
same = 0
for r in indep:
    x = 0
    if r[1] >= 0:
        if r[2] > 50:
            x = 1
    y = 0
    if r[2] > 50:
        if r[1] >= 0:
            y = 1
    if x == y:
        same = same + 1
print("control - two clauses that are defined for every input")
print("  inputs where the two orders agree : " + str(same) + " of " + str(len(indep)))
if same == len(indep):
    print("  identical under both orders, so here the swap costs nothing at all")
print("")
print("The swapped condition reads better and returns the same answer on every")
print("input the suite holds. One clause is defined only when the other is true,")
print("and the order was carrying that.")
```

## stdout (executed)

```text
inputs : 5
the condition : the average per item is over 20, and the batch is non-empty

input              size   total   guard first   meaning first
  normal   4      100     yes           yes
  single   1      25     yes           yes
  empty batch   0      0     no            DIVIDES BY ZERO
  large   50      900     no            no 
  empty with total   0      40     no            DIVIDES BY ZERO

inputs where the two orders give the same answer : 3 of 5
inputs where the readable order divides by zero : 2
  on every other input the two are indistinguishable, which is why the
  swap passed review and passed the suite

inputs in this set with an empty batch : 2 of 5
  a suite without one of these cannot tell the two orders apart, and an
  empty batch is the input least likely to be written down as a case

when does clause order matter
  both clauses defined for every input : never
  the right clause defined only when the left holds : always
  here the right clause divides by size, so it is defined only when the
  left clause is true, and that is what makes the order a guard

the same condition with the meaning named first
  is_worthwhile = average over 20, defined for non-empty batches
  the check then reads: batch is non-empty AND is_worthwhile
  the reader sees the meaning in the name and the machine sees the guard
  in the order, and neither has to give way

control - two clauses that are defined for every input
  inputs where the two orders agree : 3 of 3
  identical under both orders, so here the swap costs nothing at all

The swapped condition reads better and returns the same answer on every
input the suite holds. One clause is defined only when the other is true,
and the order was carrying that.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
