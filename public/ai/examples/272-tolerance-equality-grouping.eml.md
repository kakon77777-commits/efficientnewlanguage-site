<!-- canonical: efficientnewlanguage.org/ai/examples/272-tolerance-equality-grouping | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 272 — Tolerance equality — no implementation is wrong, because nothing is right

`tolerance_equality_grouping.eml` groups values under a "close enough to be the same" relation two ways, over several orderings of the same input.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). "Close enough to
# be the same" is not an equivalence, so there is no correct grouping.
#
# Deduplication by tolerance - two readings are the same if they differ by less
# than eps, two addresses match if they are within a hundred metres, two events
# are one event if they are within five seconds - is everywhere, and the
# relation it defines is reflexive and symmetric and NOT transitive. a can be
# close to b, b close to c, and a far from c.
#
# A relation that is not transitive does not partition anything. So "group the
# readings" has no answer, and every implementation produces some answer
# anyway, decided by iteration order:
#
#     first-match-wins   assign each item to the first group it is near
#     chaining           merge any two groups that have a near pair
#
# They give different group counts on the same input, and first-match-wins
# gives different answers on different orderings of the same input. Neither is
# a bug. There is nothing for them to be a bug relative to.
#
# One premise this file was written on turned out to be wrong, and the wrong
# version is the one that would have been reassuring: the group COUNT from
# first-match-wins is the same for every ordering tried here. Only the
# membership changes. A monitor watching "how many clusters did we find"
# would report a perfectly stable number while the clusters themselves were
# being reshuffled, so the count is measured here alongside the partition
# rather than instead of it.
#
# All values are integers so that nothing here is about floating point.

3 => EPS

def near(a, b):
    a - b => d
    if d < 0:
        0 - d => d
    return d <= EPS

def group_first_match(xs):
    # Each item joins the first existing group whose FIRST member it is near.
    # Returns [n_groups, sizes, owner] where owner[i] is the group index that
    # xs[i] landed in, so the partition itself can be compared and not only
    # its size.
    [] => reps
    [] => sizes
    [] => owner
    for x in xs:
        0 - 1 => found
        for i in [0:len(reps) - 1]:
            if found < 0 and near(reps[i], x):
                i => found
        if found < 0:
            owner + [len(reps)] => owner
            reps + [x] => reps
            sizes + [1] => sizes
        else:
            owner + [found] => owner
            sizes[found] + 1 => sizes[found]
    return [len(reps), sizes, owner]

def partition_signature(xs, owner):
    # A rendering of the partition that does not depend on input order: for
    # each value in ascending order, the SMALLEST value sharing its group.
    "" => sig
    for v in [10, 12, 14, 16, 18, 20]:
        0 - 1 => g
        for i in [0:len(xs) - 1]:
            if xs[i] == v:
                owner[i] => g
        9999 => lo
        for i in [0:len(xs) - 1]:
            if owner[i] == g and xs[i] < lo:
                xs[i] => lo
        if len(sig) > 0:
            sig + "|" => sig
        sig + str(lo) => sig
    return sig

def group_chaining(xs):
    # Union-find by repeated merging: any two items that are near end up in
    # the same group, however long the chain between them.
    [] => label
    for i in [0:len(xs) - 1]:
        label + [i] => label
    1 => changed
    while changed == 1:
        0 => changed
        for i in [0:len(xs) - 1]:
            for j in [0:len(xs) - 1]:
                if near(xs[i], xs[j]) and not (label[i] == label[j]):
                    label[i] => a
                    label[j] => b
                    a => small
                    if b < a:
                        b => small
                    for k in [0:len(xs) - 1]:
                        if label[k] == a or label[k] == b:
                            small => label[k]
                    1 => changed
    {} => seen
    for l in label:
        1 => seen[l]
    return len(seen)

def join(xs):
    "" => s
    for x in xs:
        if len(s) > 0:
            s + " " => s
        s + str(x) => s
    return s


# A chain: each value is within EPS of the next, and the ends are far apart.
[10, 12, 14, 16, 18, 20] => chain

"values: " + join(chain)^0
("tolerance: " + str(EPS))^0

""^0
"the relation on a few pairs:"^0
for pair in [[10, 12], [12, 14], [10, 14], [10, 20]]:
    ("  " + str(pair[0]) + " ~ " + str(pair[1]) + ": " + str(near(pair[0], pair[1])))^0

# --------------------------- the three properties an equivalence needs
""^0
0 => refl
0 => symm
0 => symm_n
0 => trans_ok
0 => trans_n
for a in chain:
    if near(a, a):
        refl + 1 => refl
    for b in chain:
        symm_n + 1 => symm_n
        if near(a, b) == near(b, a):
            symm + 1 => symm
        for c in chain:
            if near(a, b) and near(b, c):
                trans_n + 1 => trans_n
                if near(a, c):
                    trans_ok + 1 => trans_ok
("reflexive on " + str(refl) + "/" + str(len(chain)) + " values")^0
("symmetric on " + str(symm) + "/" + str(symm_n) + " pairs")^0
("transitive on " + str(trans_ok) + "/" + str(trans_n) + " chains")^0
"...two out of three, and the missing one is the one that makes groups exist."^0

# ------------------------------- two implementations, two answers
""^0
group_first_match(chain) => fm
group_chaining(chain) => ch
("groups by first-match-wins: " + str(fm[0]) + "  (sizes " + join(fm[1]) + ")")^0
("groups by chaining:         " + str(ch))^0

# ----------------------- and first-match-wins depends on the input order
""^0
"first-match-wins over different orderings of the SAME six values:"^0
[
    [10, 12, 14, 16, 18, 20],
    [20, 18, 16, 14, 12, 10],
    [14, 10, 18, 12, 20, 16],
    [12, 20, 10, 16, 14, 18]
] => orderings
{} => counts
{} => partitions
for o in orderings:
    group_first_match(o) => g
    1 => counts[str(g[0])]
    partition_signature(o, g[2]) => sig
    1 => partitions[sig]
    ("  " + join(o) + " -> " + str(g[0]) + " groups, partition " + sig)^0
("distinct group COUNTS from the same input:     " + str(len(counts)))^0
("distinct group MEMBERSHIPS from the same input: " + str(len(partitions)))^0
"...the count is stable and the answer is not, which is the worst of the two"^0
"for anyone watching a dashboard."^0

# ------------------------------- chaining is stable but collapses everything
""^0
{} => chain_counts
for o in orderings:
    1 => chain_counts[str(group_chaining(o))]
("chaining, over the same orderings: " + str(len(chain_counts)) + " distinct answer(s)")^0
("...and that answer is " + str(ch) + ", because the chain connects 10 to 20")^0
("through steps that are each within " + str(EPS) + ".")^0

# ------------------------ a well-separated input has no ambiguity at all
""^0
[10, 30, 50, 70] => separated
group_first_match(separated) => sep_fm
group_chaining(separated) => sep_ch
("well-separated values " + join(separated) + ":")^0
("  first-match-wins: " + str(sep_fm[0]) + " groups, chaining: " + str(sep_ch) + " groups")^0
"...which is the fixture everybody writes, and it agrees."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The relation must be reflexive and symmetric everywhere - it looks like an
# equivalence, and those are the properties a test would check.
checked + 1 => checked
if refl == len(chain) and symm == symm_n:
    passed + 1 => passed

# And it must fail transitivity somewhere. That is the whole defect.
checked + 1 => checked
if trans_ok < trans_n:
    passed + 1 => passed

# The two implementations must disagree on the chain input.
checked + 1 => checked
if not (fm[0] == ch):
    passed + 1 => passed

# First-match-wins must give more than one PARTITION across orderings of the
# same values while giving a single stable COUNT - the correction this file's
# measurement forced. Chaining must give exactly one of each.
checked + 1 => checked
if len(partitions) > 1 and len(counts) == 1 and len(chain_counts) == 1:
    passed + 1 => passed

# On well-separated values both must agree - the ambiguity needs a chain,
# and a fixture without one cannot show any of this.
checked + 1 => checked
if sep_fm[0] == sep_ch and sep_fm[0] == len(separated):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "No implementation is wrong, because there is nothing to be wrong about." => verdict
else:
    "FAILED - a grouping did not behave as the checks describe." => verdict
verdict^0

""^0
"Grouping needs an equivalence relation, and a tolerance is not one - it" => n1
n1^0
"is reflexive and symmetric, which is enough to pass every test anybody" => n2
n2^0
"writes for it. What is missing is transitivity, and without it the phrase" => n3
n3^0
"'the group containing x' does not name anything, so the question the code" => n4
n4^0
"is answering was never well posed." => n5
n5^0
```

## Python (deterministic transpilation)

```python
EPS = 3

def near(a, b):
    d = a - b
    if d < 0:
        d = 0 - d
    return d <= EPS

def group_first_match(xs):
    reps = []
    sizes = []
    owner = []
    for x in xs:
        found = 0 - 1
        for i in range(0, len(reps)):
            if found < 0 and near(reps[i], x):
                found = i
        if found < 0:
            owner = owner + [len(reps)]
            reps = reps + [x]
            sizes = sizes + [1]
        else:
            owner = owner + [found]
            sizes[found] = sizes[found] + 1
    return [len(reps), sizes, owner]

def partition_signature(xs, owner):
    sig = ""
    for v in [10, 12, 14, 16, 18, 20]:
        g = 0 - 1
        for i in range(0, len(xs)):
            if xs[i] == v:
                g = owner[i]
        lo = 9999
        for i in range(0, len(xs)):
            if owner[i] == g and xs[i] < lo:
                lo = xs[i]
        if len(sig) > 0:
            sig = sig + "|"
        sig = sig + str(lo)
    return sig

def group_chaining(xs):
    label = []
    for i in range(0, len(xs)):
        label = label + [i]
    changed = 1
    while changed == 1:
        changed = 0
        for i in range(0, len(xs)):
            for j in range(0, len(xs)):
                if near(xs[i], xs[j]) and not label[i] == label[j]:
                    a = label[i]
                    b = label[j]
                    small = a
                    if b < a:
                        small = b
                    for k in range(0, len(xs)):
                        if label[k] == a or label[k] == b:
                            label[k] = small
                    changed = 1
    seen = {}
    for l in label:
        seen[l] = 1
    return len(seen)

def join(xs):
    s = ""
    for x in xs:
        if len(s) > 0:
            s = s + " "
        s = s + str(x)
    return s

chain = [10, 12, 14, 16, 18, 20]
print("values: " + join(chain))
print("tolerance: " + str(EPS))
print("")
print("the relation on a few pairs:")
for pair in [[10, 12], [12, 14], [10, 14], [10, 20]]:
    print("  " + str(pair[0]) + " ~ " + str(pair[1]) + ": " + str(near(pair[0], pair[1])))
print("")
refl = 0
symm = 0
symm_n = 0
trans_ok = 0
trans_n = 0
for a in chain:
    if near(a, a):
        refl = refl + 1
    for b in chain:
        symm_n = symm_n + 1
        if near(a, b) == near(b, a):
            symm = symm + 1
        for c in chain:
            if near(a, b) and near(b, c):
                trans_n = trans_n + 1
                if near(a, c):
                    trans_ok = trans_ok + 1
print("reflexive on " + str(refl) + "/" + str(len(chain)) + " values")
print("symmetric on " + str(symm) + "/" + str(symm_n) + " pairs")
print("transitive on " + str(trans_ok) + "/" + str(trans_n) + " chains")
print("...two out of three, and the missing one is the one that makes groups exist.")
print("")
fm = group_first_match(chain)
ch = group_chaining(chain)
print("groups by first-match-wins: " + str(fm[0]) + "  (sizes " + join(fm[1]) + ")")
print("groups by chaining:         " + str(ch))
print("")
print("first-match-wins over different orderings of the SAME six values:")
orderings = [[10, 12, 14, 16, 18, 20], [20, 18, 16, 14, 12, 10], [14, 10, 18, 12, 20, 16], [12, 20, 10, 16, 14, 18]]
counts = {}
partitions = {}
for o in orderings:
    g = group_first_match(o)
    counts[str(g[0])] = 1
    sig = partition_signature(o, g[2])
    partitions[sig] = 1
    print("  " + join(o) + " -> " + str(g[0]) + " groups, partition " + sig)
print("distinct group COUNTS from the same input:     " + str(len(counts)))
print("distinct group MEMBERSHIPS from the same input: " + str(len(partitions)))
print("...the count is stable and the answer is not, which is the worst of the two")
print("for anyone watching a dashboard.")
print("")
chain_counts = {}
for o in orderings:
    chain_counts[str(group_chaining(o))] = 1
print("chaining, over the same orderings: " + str(len(chain_counts)) + " distinct answer(s)")
print("...and that answer is " + str(ch) + ", because the chain connects 10 to 20")
print("through steps that are each within " + str(EPS) + ".")
print("")
separated = [10, 30, 50, 70]
sep_fm = group_first_match(separated)
sep_ch = group_chaining(separated)
print("well-separated values " + join(separated) + ":")
print("  first-match-wins: " + str(sep_fm[0]) + " groups, chaining: " + str(sep_ch) + " groups")
print("...which is the fixture everybody writes, and it agrees.")
passed = 0
checked = 0
checked = checked + 1
if refl == len(chain) and symm == symm_n:
    passed = passed + 1
checked = checked + 1
if trans_ok < trans_n:
    passed = passed + 1
checked = checked + 1
if not fm[0] == ch:
    passed = passed + 1
checked = checked + 1
if len(partitions) > 1 and len(counts) == 1 and len(chain_counts) == 1:
    passed = passed + 1
checked = checked + 1
if sep_fm[0] == sep_ch and sep_fm[0] == len(separated):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "No implementation is wrong, because there is nothing to be wrong about."
else:
    verdict = "FAILED - a grouping did not behave as the checks describe."
print(verdict)
print("")
n1 = "Grouping needs an equivalence relation, and a tolerance is not one - it"
print(n1)
n2 = "is reflexive and symmetric, which is enough to pass every test anybody"
print(n2)
n3 = "writes for it. What is missing is transitivity, and without it the phrase"
print(n3)
n4 = "'the group containing x' does not name anything, so the question the code"
print(n4)
n5 = "is answering was never well posed."
print(n5)
```

## stdout (executed)

```text
values: 10 12 14 16 18 20
tolerance: 3

the relation on a few pairs:
  10 ~ 12: True
  12 ~ 14: True
  10 ~ 14: False
  10 ~ 20: False

reflexive on 6/6 values
symmetric on 36/36 pairs
transitive on 36/44 chains
...two out of three, and the missing one is the one that makes groups exist.

groups by first-match-wins: 3  (sizes 2 2 2)
groups by chaining:         1

first-match-wins over different orderings of the SAME six values:
  10 12 14 16 18 20 -> 3 groups, partition 10|10|14|14|18|18
  20 18 16 14 12 10 -> 3 groups, partition 10|10|14|14|18|18
  14 10 18 12 20 16 -> 3 groups, partition 10|12|12|12|18|18
  12 20 10 16 14 18 -> 3 groups, partition 10|10|10|16|18|18
distinct group COUNTS from the same input:     1
distinct group MEMBERSHIPS from the same input: 3
...the count is stable and the answer is not, which is the worst of the two
for anyone watching a dashboard.

chaining, over the same orderings: 1 distinct answer(s)
...and that answer is 1, because the chain connects 10 to 20
through steps that are each within 3.

well-separated values 10 30 50 70:
  first-match-wins: 4 groups, chaining: 4 groups
...which is the fixture everybody writes, and it agrees.

checks passed: 5/5
No implementation is wrong, because there is nothing to be wrong about.

Grouping needs an equivalence relation, and a tolerance is not one - it
is reflexive and symmetric, which is enough to pass every test anybody
writes for it. What is missing is transitivity, and without it the phrase
'the group containing x' does not name anything, so the question the code
is answering was never well posed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
