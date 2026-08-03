<!-- canonical: efficientnewlanguage.org/ai/examples/229-top-n-undefined-tiebreak | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 229 — The top three is not a set

`top_n_undefined_tiebreak.eml` computes "the top three" four ways over every permutation of a leaderboard with a three-way tie.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). "The top three",
# which is not a set until you say what happens at the boundary.
#
# Take a leaderboard, sort it, take the first three. Everyone has written it;
# it is two lines. The question it does not answer is what to do when the
# third and fourth entries are tied:
#
#     alice 90    bob 85    carol 85    dave 80
#
# The top three is alice, bob and one of {carol}, or alice, bob, carol AND
# whoever else has 85. Those are different answers, both defensible, and the
# code picks one by accident - whichever the sort happened to leave in
# position 2.
#
# The failure is not that the answer is wrong. It is that the answer is
# UNSTABLE: add an unrelated row at the bottom of the input, change nothing
# about the scores, and the membership of the top three can change, because
# the sort's tie order changed. A leaderboard that reshuffles when nothing
# happened is the visible symptom; a "top 3 customers" report that names a
# different customer each week is the invisible one.
#
# Four policies, all defensible, and the measurement is how each behaves under
# input reordering:
#
#     first-three         take three, whatever they are
#     dense               take every row whose score ties the third
#     strict              take only rows strictly above the cut, so fewer than
#                         three when the boundary is tied - on this board that
#                         collapses to ONE row, which is how a policy can be
#                         perfectly stable and useless
#     tiebroken           sort by (score, name), which makes the answer unique
#
# The property is the one nobody states and everybody assumes:
#
#     the result must not depend on the order the rows arrived in
#
# checked over every permutation of the input, which is the only way to see it.

def sort_by(rows, key_fn_name):
    # Insertion sort, stable. `rows => out` aliases in EML-P, so the copy is
    # explicit - a lesson this corpus paid for once already.
    [] => out
    for r in rows:
        out + [r] => out
    1 => i
    while i < len(out):
        out[i] => cur
        i - 1 => j
        while j >= 0 and key_greater(key_fn_name, out[j], cur):
            out[j] => out[j + 1]
            j - 1 => j
        cur => out[j + 1]
        i + 1 => i
    return out

def key_greater(which, a, b):
    # Descending by score. The tiebroken variant adds the name, which makes
    # the ordering total.
    if which == "score":
        return a["score"] < b["score"]
    if a["score"] < b["score"]:
        return True
    if a["score"] > b["score"]:
        return False
    return a["name"] > b["name"]

def names(rows):
    "" => s
    for r in rows:
        if len(s) > 0:
            s + "," => s
        s + r["name"] => s
    return s

def top_first_three(rows):
    sort_by(rows, "score") => s
    return s[:3]

def top_dense(rows):
    # Everyone whose score ties the third place score.
    sort_by(rows, "score") => s
    if len(s) <= 3:
        return s
    s[2]["score"] => cut
    [] => out
    for r in s:
        if r["score"] >= cut:
            out + [r] => out
    return out

def top_strict(rows):
    # Only rows strictly above the third place score, so a tied boundary
    # yields FEWER than three rather than more.
    sort_by(rows, "score") => s
    if len(s) <= 3:
        return s
    s[2]["score"] => cut
    [] => out
    for r in s:
        if r["score"] > cut:
            out + [r] => out
    return out

def top_tiebroken(rows):
    sort_by(rows, "tiebroken") => s
    return s[:3]


def board(pairs):
    [] => out
    for p in pairs:
        out + [{"name": p[0], "score": p[1]}] => out
    return out

# Four rows, not five. 120 permutations produce a 23 MB execution trace; the
# three-way tie at 85 that makes "the top three" ambiguous needs only four.
board([["alice", 90], ["bob", 85], ["carol", 85], ["erin", 85]]) => rows

"policy         result"^0
("%-14s %s" % ("first-three", names(top_first_three(rows))))^0
("%-14s %s" % ("dense", names(top_dense(rows))))^0
("%-14s %s" % ("strict", names(top_strict(rows))))^0
("%-14s %s" % ("tiebroken", names(top_tiebroken(rows))))^0

# --------------------------------------------------- every input ordering
def permutations(xs):
    if len(xs) <= 1:
        return [xs]
    [] => out
    for i in [0:len(xs) - 1]:
        xs[i] => head
        xs[:i] + xs[i + 1:] => rest
        for p in permutations(rest):
            out + [[head] + p] => out
    return out

permutations(rows) => perms

def distinct_under_reordering(policy):
    {} => seen
    for p in perms:
        if policy == "first":
            names(top_first_three(p)) => k
        elif policy == "dense":
            names(top_dense(p)) => k
        elif policy == "strict":
            names(top_strict(p)) => k
        else:
            names(top_tiebroken(p)) => k
        1 => seen[k]
    return len(seen)

def distinct_membership(policy):
    # The same question, ignoring ORDER within the result. A policy can be
    # unstable in membership (someone is in or out) or merely in presentation
    # (the same people, listed differently). Only the first is a defect.
    {} => seen
    for p in perms:
        if policy == "first":
            top_first_three(p) => r
        elif policy == "dense":
            top_dense(p) => r
        elif policy == "strict":
            top_strict(p) => r
        else:
            top_tiebroken(p) => r
        [] => ns
        for x in r:
            ns + [x["name"]] => ns
        "" => k
        for n in ["alice", "bob", "carol", "erin"]:
            0 => there
            for m in ns:
                if m == n:
                    1 => there
            k + str(there) => k
        1 => seen[k]
    return len(seen)

""^0
("input orderings swept: " + str(len(perms)))^0
"policy         distinct results  distinct memberships"^0
for policy in ["first", "dense", "strict", "tiebroken"]:
    ("%-14s %-17d %d" % (policy, distinct_under_reordering(policy), distinct_membership(policy)))^0

# -------------------------------------------- what each policy returns, sized
""^0
"sizes returned (the part a caller usually assumes is 3):"^0
("  first-three: " + str(len(top_first_three(rows))))^0
("  dense:       " + str(len(top_dense(rows))))^0
("  strict:      " + str(len(top_strict(rows))))^0
("  tiebroken:   " + str(len(top_tiebroken(rows))))^0

# ---------------------------------------- adding an unrelated row at the end
# The row is last and lowest. It cannot be in the top three by any policy, and
# under a stable sort it does not move anyone. That is the point: if a result
# changes here, the instability was already there and this only revealed it.
board([["alice", 90], ["bob", 85], ["carol", 85], ["erin", 85], ["zoe", 10]]) => rows2
""^0
"after appending an irrelevant last-place row:"^0
("  first-three: " + names(top_first_three(rows2)))^0
("  dense:       " + names(top_dense(rows2)))^0
("  strict:      " + names(top_strict(rows2)))^0
("  tiebroken:   " + names(top_tiebroken(rows2)))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Only the tiebroken policy may be stable in ORDER under reordering.
checked + 1 => checked
if distinct_under_reordering("tiebroken") == 1:
    passed + 1 => passed

# first-three must be unstable in MEMBERSHIP - that is the defect.
checked + 1 => checked
if distinct_membership("first") > 1:
    passed + 1 => passed

# dense and strict must be stable in membership even though their listing
# order varies. They answer the boundary question; they just do not fix the
# presentation.
checked + 1 => checked
if distinct_membership("dense") == 1 and distinct_membership("strict") == 1:
    passed + 1 => passed

# `dense` must still be unstable in ORDER, which is what separates "membership
# is defined" from "the answer is reproducible".
#
# `strict` is stable in BOTH, and not for a good reason: on this board it
# returns a single row, and one row cannot be in the wrong order. This file
# originally asserted that strict would be order-unstable too. It is stable
# because it threw almost everything away - which is the failure mode of the
# conservative policy, not evidence for it.
checked + 1 => checked
if distinct_under_reordering("dense") > 1 and distinct_under_reordering("strict") == 1:
    if len(top_strict(rows)) == 1:
        passed + 1 => passed

# The three policies must genuinely disagree on the size of the answer, or
# there is no boundary question to be answering.
checked + 1 => checked
if len(top_dense(rows)) > 3 and len(top_strict(rows)) < 3:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Only a total order makes 'the top three' a single answer." => verdict
else:
    "FAILED - a policy did not behave as the checks describe." => verdict
verdict^0

""^0
"Membership stability and order stability are different properties and the" => n1
n1^0
"usual fix addresses one of them. Deciding the boundary rule makes WHO is in" => n2
n2^0
"the list well defined, and dense still comes back in a different order every" => n3
n3^0
"time. Strict is stable on both counts and returns one name out of five," => n4
n4^0
"which is worth noticing: a policy can be perfectly reproducible by virtue of" => n5
n5^0
"answering a smaller question. Only extending the sort key to something" => n6
n6^0
"unique settles both without shrinking the answer." => n7
n7^0
```

## Python (deterministic transpilation)

```python
def sort_by(rows, key_fn_name):
    out = []
    for r in rows:
        out = out + [r]
    i = 1
    while i < len(out):
        cur = out[i]
        j = i - 1
        while j >= 0 and key_greater(key_fn_name, out[j], cur):
            out[j + 1] = out[j]
            j = j - 1
        out[j + 1] = cur
        i = i + 1
    return out

def key_greater(which, a, b):
    if which == "score":
        return a["score"] < b["score"]
    if a["score"] < b["score"]:
        return True
    if a["score"] > b["score"]:
        return False
    return a["name"] > b["name"]

def names(rows):
    s = ""
    for r in rows:
        if len(s) > 0:
            s = s + ","
        s = s + r["name"]
    return s

def top_first_three(rows):
    s = sort_by(rows, "score")
    return s[:3]

def top_dense(rows):
    s = sort_by(rows, "score")
    if len(s) <= 3:
        return s
    cut = s[2]["score"]
    out = []
    for r in s:
        if r["score"] >= cut:
            out = out + [r]
    return out

def top_strict(rows):
    s = sort_by(rows, "score")
    if len(s) <= 3:
        return s
    cut = s[2]["score"]
    out = []
    for r in s:
        if r["score"] > cut:
            out = out + [r]
    return out

def top_tiebroken(rows):
    s = sort_by(rows, "tiebroken")
    return s[:3]

def board(pairs):
    out = []
    for p in pairs:
        out = out + [{"name": p[0], "score": p[1]}]
    return out

rows = board([["alice", 90], ["bob", 85], ["carol", 85], ["erin", 85]])
print("policy         result")
print("%-14s %s" % ("first-three", names(top_first_three(rows))))
print("%-14s %s" % ("dense", names(top_dense(rows))))
print("%-14s %s" % ("strict", names(top_strict(rows))))
print("%-14s %s" % ("tiebroken", names(top_tiebroken(rows))))

def permutations(xs):
    if len(xs) <= 1:
        return [xs]
    out = []
    for i in range(0, len(xs)):
        head = xs[i]
        rest = xs[:i] + xs[i + 1:]
        for p in permutations(rest):
            out = out + [[head] + p]
    return out

perms = permutations(rows)

def distinct_under_reordering(policy):
    seen = {}
    for p in perms:
        if policy == "first":
            k = names(top_first_three(p))
        elif policy == "dense":
            k = names(top_dense(p))
        elif policy == "strict":
            k = names(top_strict(p))
        else:
            k = names(top_tiebroken(p))
        seen[k] = 1
    return len(seen)

def distinct_membership(policy):
    seen = {}
    for p in perms:
        if policy == "first":
            r = top_first_three(p)
        elif policy == "dense":
            r = top_dense(p)
        elif policy == "strict":
            r = top_strict(p)
        else:
            r = top_tiebroken(p)
        ns = []
        for x in r:
            ns = ns + [x["name"]]
        k = ""
        for n in ["alice", "bob", "carol", "erin"]:
            there = 0
            for m in ns:
                if m == n:
                    there = 1
            k = k + str(there)
        seen[k] = 1
    return len(seen)

print("")
print("input orderings swept: " + str(len(perms)))
print("policy         distinct results  distinct memberships")
for policy in ["first", "dense", "strict", "tiebroken"]:
    print("%-14s %-17d %d" % (policy, distinct_under_reordering(policy), distinct_membership(policy)))
print("")
print("sizes returned (the part a caller usually assumes is 3):")
print("  first-three: " + str(len(top_first_three(rows))))
print("  dense:       " + str(len(top_dense(rows))))
print("  strict:      " + str(len(top_strict(rows))))
print("  tiebroken:   " + str(len(top_tiebroken(rows))))
rows2 = board([["alice", 90], ["bob", 85], ["carol", 85], ["erin", 85], ["zoe", 10]])
print("")
print("after appending an irrelevant last-place row:")
print("  first-three: " + names(top_first_three(rows2)))
print("  dense:       " + names(top_dense(rows2)))
print("  strict:      " + names(top_strict(rows2)))
print("  tiebroken:   " + names(top_tiebroken(rows2)))
passed = 0
checked = 0
checked = checked + 1
if distinct_under_reordering("tiebroken") == 1:
    passed = passed + 1
checked = checked + 1
if distinct_membership("first") > 1:
    passed = passed + 1
checked = checked + 1
if distinct_membership("dense") == 1 and distinct_membership("strict") == 1:
    passed = passed + 1
checked = checked + 1
if distinct_under_reordering("dense") > 1 and distinct_under_reordering("strict") == 1:
    if len(top_strict(rows)) == 1:
        passed = passed + 1
checked = checked + 1
if len(top_dense(rows)) > 3 and len(top_strict(rows)) < 3:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Only a total order makes 'the top three' a single answer."
else:
    verdict = "FAILED - a policy did not behave as the checks describe."
print(verdict)
print("")
n1 = "Membership stability and order stability are different properties and the"
print(n1)
n2 = "usual fix addresses one of them. Deciding the boundary rule makes WHO is in"
print(n2)
n3 = "the list well defined, and dense still comes back in a different order every"
print(n3)
n4 = "time. Strict is stable on both counts and returns one name out of five,"
print(n4)
n5 = "which is worth noticing: a policy can be perfectly reproducible by virtue of"
print(n5)
n6 = "answering a smaller question. Only extending the sort key to something"
print(n6)
n7 = "unique settles both without shrinking the answer."
print(n7)
```

## stdout (executed)

```text
policy         result
first-three    alice,bob,carol
dense          alice,bob,carol,erin
strict         alice
tiebroken      alice,bob,carol

input orderings swept: 24
policy         distinct results  distinct memberships
first          6                 3
dense          6                 1
strict         1                 1
tiebroken      1                 1

sizes returned (the part a caller usually assumes is 3):
  first-three: 3
  dense:       4
  strict:      1
  tiebroken:   3

after appending an irrelevant last-place row:
  first-three: alice,bob,carol
  dense:       alice,bob,carol,erin
  strict:      alice
  tiebroken:   alice,bob,carol

checks passed: 5/5
Only a total order makes 'the top three' a single answer.

Membership stability and order stability are different properties and the
usual fix addresses one of them. Deciding the boundary rule makes WHO is in
the list well defined, and dense still comes back in a different order every
time. Strict is stable on both counts and returns one name out of five,
which is worth noticing: a policy can be perfectly reproducible by virtue of
answering a smaller question. Only extending the sort key to something
unique settles both without shrinking the answer.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:call · eml:assign · eml:return · eml:output · eml:run:done
