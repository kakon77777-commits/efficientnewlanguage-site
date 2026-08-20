<!-- canonical: efficientnewlanguage.org/ai/examples/469-the-order-the-workers-finished-changed-the-total | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 469 — The order the workers finished changed the total

`the_order_the_workers_finished_changed_the_total.eml` - Three workers return partial sums and the reducer adds them as they arrive. What the total depends on is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three workers
# return partial sums and the reducer adds them as they arrive. What the total
# depends on is computed below.
#
# Adding partials in completion order is the right way to write a reducer. It
# holds nothing, it starts as soon as the first result lands, and addition is
# associative, so the order the results arrive in does not matter.
#
# Addition of floating-point numbers is not associative. Where the partials
# differ greatly in magnitude, a small one added to a large one is discarded,
# and whether that happens depends on which two arrive first. The reducer is
# correct and its answer is a function of the scheduling.
#
# Every ordering of the same three partials is enumerated here.

10000000000000000.0 => credit
0.0 - 10000000000000000.0 => debit
1.0 => fee

[credit, debit, fee] => partials
["credit", "debit", "fee"] => names
len(partials) => n

def add3(a, b, c):
    a + b => t
    t + c => t
    return t

"three partial sums" ^0
"  credit : " + str(credit) ^0
"  debit  : " + str(debit) ^0
"  fee    : " + str(fee) ^0
"the true total is the fee, because the credit and the debit cancel" ^0
"" ^0

"arrival order            total" ^0
add3(partials[0], partials[1], partials[2]) => t012
add3(partials[0], partials[2], partials[1]) => t021
add3(partials[1], partials[0], partials[2]) => t102
add3(partials[1], partials[2], partials[0]) => t120
add3(partials[2], partials[0], partials[1]) => t201
add3(partials[2], partials[1], partials[0]) => t210
"  credit debit fee        " + str(t012) ^0
"  credit fee debit        " + str(t021) ^0
"  debit credit fee        " + str(t102) ^0
"  debit fee credit        " + str(t120) ^0
"  fee credit debit        " + str(t201) ^0
"  fee debit credit        " + str(t210) ^0
"" ^0

[] => totals
totals + [t012] => totals
totals + [t021] => totals
totals + [t102] => totals
totals + [t120] => totals
totals + [t201] => totals
totals + [t210] => totals

[] => distinct
for v in totals:
    if not (v in distinct):
        distinct + [v] => distinct
"distinct totals across the six orderings : " + str(len(distinct)) ^0
"" ^0

0 => right
for v in totals:
    if v == fee:
        right + 1 => right
"orderings that produce the true total of " + str(fee) + " : " + str(right) + " of " + str(len(totals)) ^0
if right < len(totals):
    "orderings that lose it entirely           : " + str(len(totals) - right) ^0
"" ^0

# ---- what decides which one happens ----

"what selects the ordering in production" ^0
"  which worker finishes first, which is scheduling" ^0
"  nothing in the reducer, the data, or the request" ^0
"  so the same job run twice can return two different totals with no code" ^0
"  change and no input change" ^0
"" ^0

# ---- what the reducer would have to do ----
#
# Not hold everything. Adding the two that cancel before the one that does not
# is enough, and sorting by magnitude achieves it without knowing which is
# which.

"adding smallest magnitude first" ^0
add3(fee, credit, debit) => small_first
"  fee, then credit, then debit : " + str(small_first) ^0
"adding largest magnitude first" ^0
add3(credit, debit, fee) => large_first
"  credit, then debit, then fee : " + str(large_first) ^0
if large_first == fee:
    "  the large-first order recovers the true total here" ^0
if not (small_first == fee):
    "  the small-first order does not, on this input" ^0
"  neither order is right in general; what is right is a function of the" ^0
"  values, which is why the answer is not a property of the reducer" ^0
"" ^0

# ---- what the compensated builtin does with the same partials ----

"sum() over the same three, in each of two orders" ^0
[credit, debit, fee] => order_a
[fee, credit, debit] => order_b
"  credit debit fee : " + str(sum(order_a)) ^0
"  fee credit debit : " + str(sum(order_b)) ^0
if sum(order_a) == sum(order_b):
    "  the builtin gives the same answer for both, because it carries the" ^0
    "  part a plain + would drop" ^0
else:
    "  the builtin also differs between the two orders" ^0
"" ^0

# ---- the control: partials of similar magnitude ----
#
# Where no partial is large enough to swallow another, every ordering gives
# the same total and the reducer is order-independent in fact.

[120.5, 88.25, 34.75] => similar
add3(similar[0], similar[1], similar[2]) => s012
add3(similar[2], similar[1], similar[0]) => s210
add3(similar[1], similar[0], similar[2]) => s102
"control - three partials of similar size" ^0
"  three orderings : " + str(s012) + ", " + str(s210) + ", " + str(s102) ^0
if s012 == s210:
    if s012 == s102:
        "  identical, so a job like this one can never show the dependence" ^0
"" ^0

"The reducer adds what it is given in the order it is given, and every one" ^0
"of those additions is correct. Which additions happen is chosen by the" ^0
"scheduler, and one of the choices keeps the fee." ^0
```

## Python (deterministic transpilation)

```python
credit = 10000000000000000.0
debit = 0.0 - 10000000000000000.0
fee = 1.0
partials = [credit, debit, fee]
names = ["credit", "debit", "fee"]
n = len(partials)

def add3(a, b, c):
    t = a + b
    t = t + c
    return t

print("three partial sums")
print("  credit : " + str(credit))
print("  debit  : " + str(debit))
print("  fee    : " + str(fee))
print("the true total is the fee, because the credit and the debit cancel")
print("")
print("arrival order            total")
t012 = add3(partials[0], partials[1], partials[2])
t021 = add3(partials[0], partials[2], partials[1])
t102 = add3(partials[1], partials[0], partials[2])
t120 = add3(partials[1], partials[2], partials[0])
t201 = add3(partials[2], partials[0], partials[1])
t210 = add3(partials[2], partials[1], partials[0])
print("  credit debit fee        " + str(t012))
print("  credit fee debit        " + str(t021))
print("  debit credit fee        " + str(t102))
print("  debit fee credit        " + str(t120))
print("  fee credit debit        " + str(t201))
print("  fee debit credit        " + str(t210))
print("")
totals = []
totals = totals + [t012]
totals = totals + [t021]
totals = totals + [t102]
totals = totals + [t120]
totals = totals + [t201]
totals = totals + [t210]
distinct = []
for v in totals:
    if not v in distinct:
        distinct = distinct + [v]
print("distinct totals across the six orderings : " + str(len(distinct)))
print("")
right = 0
for v in totals:
    if v == fee:
        right = right + 1
print("orderings that produce the true total of " + str(fee) + " : " + str(right) + " of " + str(len(totals)))
if right < len(totals):
    print("orderings that lose it entirely           : " + str(len(totals) - right))
print("")
print("what selects the ordering in production")
print("  which worker finishes first, which is scheduling")
print("  nothing in the reducer, the data, or the request")
print("  so the same job run twice can return two different totals with no code")
print("  change and no input change")
print("")
print("adding smallest magnitude first")
small_first = add3(fee, credit, debit)
print("  fee, then credit, then debit : " + str(small_first))
print("adding largest magnitude first")
large_first = add3(credit, debit, fee)
print("  credit, then debit, then fee : " + str(large_first))
if large_first == fee:
    print("  the large-first order recovers the true total here")
if not small_first == fee:
    print("  the small-first order does not, on this input")
print("  neither order is right in general; what is right is a function of the")
print("  values, which is why the answer is not a property of the reducer")
print("")
print("sum() over the same three, in each of two orders")
order_a = [credit, debit, fee]
order_b = [fee, credit, debit]
print("  credit debit fee : " + str(sum(order_a)))
print("  fee credit debit : " + str(sum(order_b)))
if sum(order_a) == sum(order_b):
    print("  the builtin gives the same answer for both, because it carries the")
    print("  part a plain + would drop")
else:
    print("  the builtin also differs between the two orders")
print("")
similar = [120.5, 88.25, 34.75]
s012 = add3(similar[0], similar[1], similar[2])
s210 = add3(similar[2], similar[1], similar[0])
s102 = add3(similar[1], similar[0], similar[2])
print("control - three partials of similar size")
print("  three orderings : " + str(s012) + ", " + str(s210) + ", " + str(s102))
if s012 == s210:
    if s012 == s102:
        print("  identical, so a job like this one can never show the dependence")
print("")
print("The reducer adds what it is given in the order it is given, and every one")
print("of those additions is correct. Which additions happen is chosen by the")
print("scheduler, and one of the choices keeps the fee.")
```

## stdout (executed)

```text
three partial sums
  credit : 1e+16
  debit  : -1e+16
  fee    : 1.0
the true total is the fee, because the credit and the debit cancel

arrival order            total
  credit debit fee        1.0
  credit fee debit        0.0
  debit credit fee        1.0
  debit fee credit        0.0
  fee credit debit        0.0
  fee debit credit        0.0

distinct totals across the six orderings : 2

orderings that produce the true total of 1.0 : 2 of 6
orderings that lose it entirely           : 4

what selects the ordering in production
  which worker finishes first, which is scheduling
  nothing in the reducer, the data, or the request
  so the same job run twice can return two different totals with no code
  change and no input change

adding smallest magnitude first
  fee, then credit, then debit : 0.0
adding largest magnitude first
  credit, then debit, then fee : 1.0
  the large-first order recovers the true total here
  the small-first order does not, on this input
  neither order is right in general; what is right is a function of the
  values, which is why the answer is not a property of the reducer

sum() over the same three, in each of two orders
  credit debit fee : 1.0
  fee credit debit : 1.0
  the builtin gives the same answer for both, because it carries the
  part a plain + would drop

control - three partials of similar size
  three orderings : 243.5, 243.5, 243.5
  identical, so a job like this one can never show the dependence

The reducer adds what it is given in the order it is given, and every one
of those additions is correct. Which additions happen is chosen by the
scheduler, and one of the choices keeps the fee.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
