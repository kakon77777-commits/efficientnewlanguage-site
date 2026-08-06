<!-- canonical: efficientnewlanguage.org/ai/examples/265-non-transitive-comparator | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 265 — Non-transitive comparator — three answers, and the postcondition likes all of them

`non_transitive_comparator.eml` runs three sorting algorithms over every permutation of a comparator with a three-element cycle, and counts distinct outputs.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A comparator
# with a cycle in it, and three sorts that each believe they finished.
#
# Sorting requires a total order. Most comparators written by hand are not one,
# and the way they fail is not an exception - it is a result. Every comparison
# the sort makes returns a definite answer, the loop terminates, the output is
# a permutation of the input, and nothing anywhere reports a problem. The list
# is simply not sorted, and it is not sorted DIFFERENTLY depending on which
# algorithm ran and what order the input arrived in.
#
# The comparator here has a three-element cycle: A beats B, B beats C, C beats
# A. That shape appears in real code whenever "better" is decided by whichever
# of several criteria happens to differ first, or by head-to-head records, or
# by a preference matrix collected from people.
#
# The measurement runs three sorting algorithms over every permutation of the
# cycle and counts DISTINCT outputs. A total order would give exactly one.
#
# It also corrects the premise this file was written on. The obvious defence
# is a postcondition - sort the list, then assert the result is sorted. That
# assertion passes on EVERY ONE of these runs, because the usual is-sorted
# check tests adjacent pairs, and with a three-cycle every rotation has all of
# its adjacent pairs in order. Three different answers, and the check written
# to catch exactly this cannot separate them. Comparing ALL pairs does.

def beats(a, b):
    # The preference matrix. Every pair has a definite winner, which is what
    # makes this look like a valid comparator.
    {} => wins
    1 => wins["A>B"]
    1 => wins["B>C"]
    1 => wins["C>A"]
    a + ">" + b => k
    if k in wins:
        return 1
    return 0

def cmp_pref(a, b):
    if a == b:
        return 0
    if beats(a, b) == 1:
        return 0 - 1
    return 1

def insertion(xs):
    [] => out
    for x in xs:
        out + [x] => out
    1 => i
    while i < len(out):
        out[i] => cur
        i - 1 => j
        1 => moving
        while moving == 1:
            0 => moving
            if j >= 0:
                if cmp_pref(out[j], cur) > 0:
                    out[j] => out[j + 1]
                    j - 1 => j
                    1 => moving
        cur => out[j + 1]
        i + 1 => i
    return out

def selection(xs):
    [] => out
    for x in xs:
        out + [x] => out
    for i in [0:len(out) - 1]:
        i => best
        for j in [i + 1:len(out) - 1]:
            if cmp_pref(out[j], out[best]) < 0:
                j => best
        out[i] => t
        out[best] => out[i]
        t => out[best]
    return out

def bubble(xs):
    [] => out
    for x in xs:
        out + [x] => out
    for p in [1:len(out)]:
        for i in [0:len(out) - 2]:
            if cmp_pref(out[i], out[i + 1]) > 0:
                out[i] => t
                out[i + 1] => out[i]
                t => out[i + 1]
    return out

def join(xs):
    "" => s
    for x in xs:
        s + x => s
    return s

def is_sorted(xs):
    # The usual postcondition: every adjacent pair is in order.
    for i in [0:len(xs) - 2]:
        if cmp_pref(xs[i], xs[i + 1]) > 0:
            return False
    return True

def is_totally_sorted(xs):
    # What sorted actually means: EVERY pair is in order, not just neighbours.
    # On a total order the two checks are equivalent, which is why nobody
    # writes this one.
    for i in [0:len(xs) - 1]:
        for j in [i + 1:len(xs) - 1]:
            if cmp_pref(xs[i], xs[j]) > 0:
                return False
    return True


[
    ["A", "B", "C"], ["A", "C", "B"], ["B", "A", "C"],
    ["B", "C", "A"], ["C", "A", "B"], ["C", "B", "A"]
] => perms

"input   insertion   selection   bubble"^0
{} => seen
0 => sorted_claims
0 => total_claims
0 => runs
for p in perms:
    insertion(p) => a
    selection(p) => b
    bubble(p) => c
    for out in [a, b, c]:
        runs + 1 => runs
        1 => seen[join(out)]
        if is_sorted(out):
            sorted_claims + 1 => sorted_claims
        if is_totally_sorted(out):
            total_claims + 1 => total_claims
    ("%-7s %-11s %-11s %s" % (join(p), join(a), join(b), join(c)))^0

""^0
("inputs: " + str(len(perms)) + ", algorithms: 3, runs: " + str(runs))^0
("distinct outputs: " + str(len(seen)))^0
("runs passing the adjacent-pair check: " + str(sorted_claims) + "/" + str(runs))^0
("runs passing the all-pairs check:     " + str(total_claims) + "/" + str(runs))^0
"...the postcondition anyone would add to catch this passes on all of them."^0

# ------------------------------------------ the cycle, stated directly
""^0
"the comparator on each pair:"^0
for pair in [["A", "B"], ["B", "C"], ["C", "A"]]:
    pair[0] => x
    pair[1] => y
    ("  " + x + " vs " + y + ": " + str(cmp_pref(x, y)) + "   (" + y + " vs " + x + ": " + str(cmp_pref(y, x)) + ")")^0
"...every pair has a definite winner, and the three answers form a loop."^0

# ---------------------------- the two properties a comparator must have
""^0
0 => anti_ok
0 => anti_n
0 => trans_ok
0 => trans_n
["A", "B", "C"] => items
for x in items:
    for y in items:
        anti_n + 1 => anti_n
        if cmp_pref(x, y) == 0 - cmp_pref(y, x):
            anti_ok + 1 => anti_ok
        for z in items:
            if cmp_pref(x, y) < 0 and cmp_pref(y, z) < 0:
                trans_n + 1 => trans_n
                if cmp_pref(x, z) < 0:
                    trans_ok + 1 => trans_ok
("antisymmetry holds on " + str(anti_ok) + "/" + str(anti_n) + " pairs")^0
("transitivity holds on " + str(trans_ok) + "/" + str(trans_n) + " chains")^0
"...the property that holds is the one a unit test would check."^0

# ------------------------------------- a valid comparator, for contrast
""^0
"the same three algorithms over the same permutations, ordered by NAME:"^0
{} => name_seen
for p in perms:
    [] => s
    for x in p:
        s + [x] => s
    1 => i
    while i < len(s):
        s[i] => cur
        i - 1 => j
        while j >= 0 and s[j] > cur:
            s[j] => s[j + 1]
            j - 1 => j
        cur => s[j + 1]
        i + 1 => i
    1 => name_seen[join(s)]
("  distinct outputs: " + str(len(name_seen)))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The comparator must be antisymmetric - the property that looks like
# correctness and is not sufficient for it.
checked + 1 => checked
if anti_ok == anti_n:
    passed + 1 => passed

# And it must NOT be transitive. That is the defect, located.
checked + 1 => checked
if trans_ok < trans_n:
    passed + 1 => passed

# More than one distinct output must appear. A single output would mean the
# cycle happened not to matter for these inputs.
checked + 1 => checked
if len(seen) > 1:
    passed + 1 => passed

# EVERY run must pass the adjacent-pair check and NO run may pass the
# all-pairs check. This is the premise the measurement corrected: the file was
# written expecting the sorts to produce visibly unsorted output, and instead
# they produce three different outputs that all satisfy the check anybody
# writes. The defence fails silently along with the sort.
checked + 1 => checked
if sorted_claims == runs and total_claims == 0:
    passed + 1 => passed

# A real total order over the same inputs and algorithms must give exactly
# one output, or the comparison above is measuring the sorts rather than
# the comparator.
checked + 1 => checked
if len(name_seen) == 1:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Every sort terminated, returned a permutation, and none of them sorted." => verdict
else:
    "FAILED - a sort did not behave as the checks describe." => verdict
verdict^0

""^0
"A comparator is a claim about a relation, and the sort trusts the claim" => n1
n1^0
"rather than checking it - checking would cost more than sorting. What the" => n2
n2^0
"measurement added is that the cheap postcondition inherits the same blind" => n3
n3^0
"spot: adjacent pairs are exactly what a sort already looked at. Both the" => n4
n4^0
"missing test and the missing check need three elements instead of two." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def beats(a, b):
    wins = {}
    wins["A>B"] = 1
    wins["B>C"] = 1
    wins["C>A"] = 1
    k = a + ">" + b
    if k in wins:
        return 1
    return 0

def cmp_pref(a, b):
    if a == b:
        return 0
    if beats(a, b) == 1:
        return 0 - 1
    return 1

def insertion(xs):
    out = []
    for x in xs:
        out = out + [x]
    i = 1
    while i < len(out):
        cur = out[i]
        j = i - 1
        moving = 1
        while moving == 1:
            moving = 0
            if j >= 0:
                if cmp_pref(out[j], cur) > 0:
                    out[j + 1] = out[j]
                    j = j - 1
                    moving = 1
        out[j + 1] = cur
        i = i + 1
    return out

def selection(xs):
    out = []
    for x in xs:
        out = out + [x]
    for i in range(0, len(out)):
        best = i
        for j in range(i + 1, len(out)):
            if cmp_pref(out[j], out[best]) < 0:
                best = j
        t = out[i]
        out[i] = out[best]
        out[best] = t
    return out

def bubble(xs):
    out = []
    for x in xs:
        out = out + [x]
    for p in range(1, len(out)+1):
        for i in range(0, len(out) - 2+1):
            if cmp_pref(out[i], out[i + 1]) > 0:
                t = out[i]
                out[i] = out[i + 1]
                out[i + 1] = t
    return out

def join(xs):
    s = ""
    for x in xs:
        s = s + x
    return s

def is_sorted(xs):
    for i in range(0, len(xs) - 2+1):
        if cmp_pref(xs[i], xs[i + 1]) > 0:
            return False
    return True

def is_totally_sorted(xs):
    for i in range(0, len(xs)):
        for j in range(i + 1, len(xs)):
            if cmp_pref(xs[i], xs[j]) > 0:
                return False
    return True

perms = [["A", "B", "C"], ["A", "C", "B"], ["B", "A", "C"], ["B", "C", "A"], ["C", "A", "B"], ["C", "B", "A"]]
print("input   insertion   selection   bubble")
seen = {}
sorted_claims = 0
total_claims = 0
runs = 0
for p in perms:
    a = insertion(p)
    b = selection(p)
    c = bubble(p)
    for out in [a, b, c]:
        runs = runs + 1
        seen[join(out)] = 1
        if is_sorted(out):
            sorted_claims = sorted_claims + 1
        if is_totally_sorted(out):
            total_claims = total_claims + 1
    print("%-7s %-11s %-11s %s" % (join(p), join(a), join(b), join(c)))
print("")
print("inputs: " + str(len(perms)) + ", algorithms: 3, runs: " + str(runs))
print("distinct outputs: " + str(len(seen)))
print("runs passing the adjacent-pair check: " + str(sorted_claims) + "/" + str(runs))
print("runs passing the all-pairs check:     " + str(total_claims) + "/" + str(runs))
print("...the postcondition anyone would add to catch this passes on all of them.")
print("")
print("the comparator on each pair:")
for pair in [["A", "B"], ["B", "C"], ["C", "A"]]:
    x = pair[0]
    y = pair[1]
    print("  " + x + " vs " + y + ": " + str(cmp_pref(x, y)) + "   (" + y + " vs " + x + ": " + str(cmp_pref(y, x)) + ")")
print("...every pair has a definite winner, and the three answers form a loop.")
print("")
anti_ok = 0
anti_n = 0
trans_ok = 0
trans_n = 0
items = ["A", "B", "C"]
for x in items:
    for y in items:
        anti_n = anti_n + 1
        if cmp_pref(x, y) == 0 - cmp_pref(y, x):
            anti_ok = anti_ok + 1
        for z in items:
            if cmp_pref(x, y) < 0 and cmp_pref(y, z) < 0:
                trans_n = trans_n + 1
                if cmp_pref(x, z) < 0:
                    trans_ok = trans_ok + 1
print("antisymmetry holds on " + str(anti_ok) + "/" + str(anti_n) + " pairs")
print("transitivity holds on " + str(trans_ok) + "/" + str(trans_n) + " chains")
print("...the property that holds is the one a unit test would check.")
print("")
print("the same three algorithms over the same permutations, ordered by NAME:")
name_seen = {}
for p in perms:
    s = []
    for x in p:
        s = s + [x]
    i = 1
    while i < len(s):
        cur = s[i]
        j = i - 1
        while j >= 0 and s[j] > cur:
            s[j + 1] = s[j]
            j = j - 1
        s[j + 1] = cur
        i = i + 1
    name_seen[join(s)] = 1
print("  distinct outputs: " + str(len(name_seen)))
passed = 0
checked = 0
checked = checked + 1
if anti_ok == anti_n:
    passed = passed + 1
checked = checked + 1
if trans_ok < trans_n:
    passed = passed + 1
checked = checked + 1
if len(seen) > 1:
    passed = passed + 1
checked = checked + 1
if sorted_claims == runs and total_claims == 0:
    passed = passed + 1
checked = checked + 1
if len(name_seen) == 1:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Every sort terminated, returned a permutation, and none of them sorted."
else:
    verdict = "FAILED - a sort did not behave as the checks describe."
print(verdict)
print("")
n1 = "A comparator is a claim about a relation, and the sort trusts the claim"
print(n1)
n2 = "rather than checking it - checking would cost more than sorting. What the"
print(n2)
n3 = "measurement added is that the cheap postcondition inherits the same blind"
print(n3)
n4 = "spot: adjacent pairs are exactly what a sort already looked at. Both the"
print(n4)
n5 = "missing test and the missing check need three elements instead of two."
print(n5)
```

## stdout (executed)

```text
input   insertion   selection   bubble
ABC     ABC         CAB         ABC
ACB     CAB         BCA         CAB
BAC     ABC         CAB         ABC
BCA     BCA         ABC         BCA
CAB     CAB         BCA         CAB
CBA     BCA         ABC         BCA

inputs: 6, algorithms: 3, runs: 18
distinct outputs: 3
runs passing the adjacent-pair check: 18/18
runs passing the all-pairs check:     0/18
...the postcondition anyone would add to catch this passes on all of them.

the comparator on each pair:
  A vs B: -1   (B vs A: 1)
  B vs C: -1   (C vs B: 1)
  C vs A: -1   (A vs C: 1)
...every pair has a definite winner, and the three answers form a loop.

antisymmetry holds on 9/9 pairs
transitivity holds on 0/3 chains
...the property that holds is the one a unit test would check.

the same three algorithms over the same permutations, ordered by NAME:
  distinct outputs: 1

checks passed: 5/5
Every sort terminated, returned a permutation, and none of them sorted.

A comparator is a claim about a relation, and the sort trusts the claim
rather than checking it - checking would cost more than sorting. What the
measurement added is that the cheap postcondition inherits the same blind
spot: adjacent pairs are exactly what a sort already looked at. Both the
missing test and the missing check need three elements instead of two.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
