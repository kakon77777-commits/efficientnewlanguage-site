<!-- canonical: efficientnewlanguage.org/ai/examples/368-the-repro-succeeds-for-another-reason | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 368 — The repro succeeds for another reason — 140 with the defect on, 140 with it off

`the_repro_succeeds_for_another_reason.eml` measures whether a reproduction script is sensitive to the defect it was filed against.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A reproduction
# that reproduces the symptom, through a different mechanism than the one it
# was filed against.
#
# The report says: the total comes out wrong, here is a script that shows it.
# The script does show it. Everything in the report is true. What nobody
# checked is whether the wrong total in the script comes from the defect the
# report names, or from something in the script itself.
#
# It comes from the script. The order builder used only by the reproduction
# duplicates a line. The reported defect - a discount applied twice - is real,
# and is not what the script demonstrates.
#
# The consequence is precise. "The repro now passes" carries no information
# about the reported defect, and "the repro still fails" is not evidence the
# fix did not land.
#
# Nothing is declared: the two mechanisms are switched independently and every
# outcome is measured.

def total(order, fix_discount):
    0 => sum_amounts
    0 => sum_discount
    for line in order:
        sum_amounts + line[1] => sum_amounts
        sum_discount + line[2] => sum_discount
    if fix_discount == 1:
        return sum_amounts - sum_discount
    # the reported defect: the discount is subtracted twice
    return sum_amounts - sum_discount - sum_discount

# the order builder used only by the reproduction script
def build_repro_order(fix_builder):
    [] => o
    o + [["widget", 60, 0]] => o
    o + [["cable", 40, 0]] => o
    if fix_builder == 0:
        # the defect in the script: the last line is appended twice
        o + [["cable", 40, 0]] => o
    return o

def expected_total(order):
    0 => a
    0 => d
    for line in order:
        a + line[1] => a
        d + line[2] => d
    return a - d

# real orders, which do carry discounts and do not come from the builder
[[["a", 100, 10]], [["b", 50, 0], ["c", 50, 5]], [["d", 20, 0]], [["e", 80, 30]]] => production

# ---- the report ----

build_repro_order(0) => repro_order
"the report" ^0
"  claim  : the total is wrong" ^0
"  filed against : the discount is applied twice" ^0
"  the script shows : total " + str(total(repro_order, 0)) + ", expected " + str(expected_total(build_repro_order(1))) ^0
"" ^0

# ---- the four states ----

"does the reproduction pass?" ^0
for fb in [0, 1]:
    for fd in [0, 1]:
        build_repro_order(fb) => o
        total(o, fd) => got
        expected_total(build_repro_order(1)) => want
        if got == want:
            "  builder fixed " + str(fb) + ", discount fixed " + str(fd) + " : total " + str(got) + " - PASSES" ^0
        else:
            "  builder fixed " + str(fb) + ", discount fixed " + str(fd) + " : total " + str(got) + " - fails" ^0
"" ^0

# ---- is the reproduction sensitive to the defect it names? ----

"the reproduction's order, run with the reported defect on and off" ^0
build_repro_order(0) => o
"  discount defect on  : " + str(total(o, 0)) ^0
"  discount defect off : " + str(total(o, 1)) ^0
if total(o, 0) == total(o, 1):
    "  identical - this script cannot distinguish the defect it was filed against" ^0
else:
    "  different - the script does exercise it" ^0
"" ^0

# ---- what the reported defect actually costs, measured elsewhere ----

"production orders, which the reproduction never touches" ^0
0 => wrong_with
0 => wrong_without
for ord in production:
    if total(ord, 0) != expected_total(ord):
        wrong_with + 1 => wrong_with
    if total(ord, 1) != expected_total(ord):
        wrong_without + 1 => wrong_without
"  wrong totals with the discount defect    : " + str(wrong_with) + " of " + str(len(production)) ^0
"  wrong totals after fixing it             : " + str(wrong_without) ^0
"" ^0
for ord in production:
    if total(ord, 0) != expected_total(ord):
        "    " + ord[0][0] + "... : got " + str(total(ord, 0)) + ", expected " + str(expected_total(ord)) ^0
"" ^0

# ---- what each signal is actually evidence about ----

build_repro_order(1) => fixed_builder_order
0 => repro_pass_states
0 => repro_pass_when_discount_fixed
0 => repro_pass_when_builder_fixed
0 => states
for fb in [0, 1]:
    for fd in [0, 1]:
        states + 1 => states
        build_repro_order(fb) => oo
        if total(oo, fd) == expected_total(build_repro_order(1)):
            repro_pass_states + 1 => repro_pass_states
            if fd == 1:
                repro_pass_when_discount_fixed + 1 => repro_pass_when_discount_fixed
            if fb == 1:
                repro_pass_when_builder_fixed + 1 => repro_pass_when_builder_fixed
"states in which the reproduction passes : " + str(repro_pass_states) + " of " + str(states) ^0
"  of those, states where the reported defect was fixed : " + str(repro_pass_when_discount_fixed) ^0
"  of those, states where the BUILDER was fixed         : " + str(repro_pass_when_builder_fixed) ^0
if repro_pass_when_builder_fixed == repro_pass_states:
    "  the reproduction passes exactly when the builder is fixed, and the" ^0
    "  reported defect makes no difference to it either way" ^0
"" ^0

"A reproduction is a claim that a symptom can be produced on demand. It is" ^0
"not a claim about which mechanism produced it, and the second claim is the" ^0
"one everybody reads it as." ^0
```

## Python (deterministic transpilation)

```python
def total(order, fix_discount):
    sum_amounts = 0
    sum_discount = 0
    for line in order:
        sum_amounts = sum_amounts + line[1]
        sum_discount = sum_discount + line[2]
    if fix_discount == 1:
        return sum_amounts - sum_discount
    return sum_amounts - sum_discount - sum_discount

def build_repro_order(fix_builder):
    o = []
    o = o + [["widget", 60, 0]]
    o = o + [["cable", 40, 0]]
    if fix_builder == 0:
        o = o + [["cable", 40, 0]]
    return o

def expected_total(order):
    a = 0
    d = 0
    for line in order:
        a = a + line[1]
        d = d + line[2]
    return a - d

production = [[["a", 100, 10]], [["b", 50, 0], ["c", 50, 5]], [["d", 20, 0]], [["e", 80, 30]]]
repro_order = build_repro_order(0)
print("the report")
print("  claim  : the total is wrong")
print("  filed against : the discount is applied twice")
print("  the script shows : total " + str(total(repro_order, 0)) + ", expected " + str(expected_total(build_repro_order(1))))
print("")
print("does the reproduction pass?")
for fb in [0, 1]:
    for fd in [0, 1]:
        o = build_repro_order(fb)
        got = total(o, fd)
        want = expected_total(build_repro_order(1))
        if got == want:
            print("  builder fixed " + str(fb) + ", discount fixed " + str(fd) + " : total " + str(got) + " - PASSES")
        else:
            print("  builder fixed " + str(fb) + ", discount fixed " + str(fd) + " : total " + str(got) + " - fails")
print("")
print("the reproduction's order, run with the reported defect on and off")
o = build_repro_order(0)
print("  discount defect on  : " + str(total(o, 0)))
print("  discount defect off : " + str(total(o, 1)))
if total(o, 0) == total(o, 1):
    print("  identical - this script cannot distinguish the defect it was filed against")
else:
    print("  different - the script does exercise it")
print("")
print("production orders, which the reproduction never touches")
wrong_with = 0
wrong_without = 0
for ord in production:
    if total(ord, 0) != expected_total(ord):
        wrong_with = wrong_with + 1
    if total(ord, 1) != expected_total(ord):
        wrong_without = wrong_without + 1
print("  wrong totals with the discount defect    : " + str(wrong_with) + " of " + str(len(production)))
print("  wrong totals after fixing it             : " + str(wrong_without))
print("")
for ord in production:
    if total(ord, 0) != expected_total(ord):
        print("    " + ord[0][0] + "... : got " + str(total(ord, 0)) + ", expected " + str(expected_total(ord)))
print("")
fixed_builder_order = build_repro_order(1)
repro_pass_states = 0
repro_pass_when_discount_fixed = 0
repro_pass_when_builder_fixed = 0
states = 0
for fb in [0, 1]:
    for fd in [0, 1]:
        states = states + 1
        oo = build_repro_order(fb)
        if total(oo, fd) == expected_total(build_repro_order(1)):
            repro_pass_states = repro_pass_states + 1
            if fd == 1:
                repro_pass_when_discount_fixed = repro_pass_when_discount_fixed + 1
            if fb == 1:
                repro_pass_when_builder_fixed = repro_pass_when_builder_fixed + 1
print("states in which the reproduction passes : " + str(repro_pass_states) + " of " + str(states))
print("  of those, states where the reported defect was fixed : " + str(repro_pass_when_discount_fixed))
print("  of those, states where the BUILDER was fixed         : " + str(repro_pass_when_builder_fixed))
if repro_pass_when_builder_fixed == repro_pass_states:
    print("  the reproduction passes exactly when the builder is fixed, and the")
    print("  reported defect makes no difference to it either way")
print("")
print("A reproduction is a claim that a symptom can be produced on demand. It is")
print("not a claim about which mechanism produced it, and the second claim is the")
print("one everybody reads it as.")
```

## stdout (executed)

```text
the report
  claim  : the total is wrong
  filed against : the discount is applied twice
  the script shows : total 140, expected 100

does the reproduction pass?
  builder fixed 0, discount fixed 0 : total 140 - fails
  builder fixed 0, discount fixed 1 : total 140 - fails
  builder fixed 1, discount fixed 0 : total 100 - PASSES
  builder fixed 1, discount fixed 1 : total 100 - PASSES

the reproduction's order, run with the reported defect on and off
  discount defect on  : 140
  discount defect off : 140
  identical - this script cannot distinguish the defect it was filed against

production orders, which the reproduction never touches
  wrong totals with the discount defect    : 3 of 4
  wrong totals after fixing it             : 0

    a... : got 80, expected 90
    b... : got 90, expected 95
    e... : got 20, expected 50

states in which the reproduction passes : 2 of 4
  of those, states where the reported defect was fixed : 1
  of those, states where the BUILDER was fixed         : 2
  the reproduction passes exactly when the builder is fixed, and the
  reported defect makes no difference to it either way

A reproduction is a claim that a symptom can be produced on demand. It is
not a claim about which mechanism produced it, and the second claim is the
one everybody reads it as.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
