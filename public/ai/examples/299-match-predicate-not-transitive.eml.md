<!-- canonical: efficientnewlanguage.org/ai/examples/299-match-predicate-not-transitive | ai_layer_version: 0.1.0 | updated: 2026-08-08 -->

# Example 299 — Match predicate not transitive — there is no grouping to be right about

`match_predicate_not_transitive.eml` sweeps **all 24 orderings** of four records through a single-pass clusterer, counts how many distinct answers come out, then asks the transitive closure for its answer and checks it against the predicate that produced it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). "Is this the
# same person" is not an equivalence relation, so "group by sameness" has no
# answer - and every implementation quietly picks which wrong answer to give.
#
# Record matching is written as a predicate: same email, or same phone, or
# near-enough name. Each clause is defensible on its own. Together they make a
# relation that is reflexive and symmetric and NOT transitive, because two
# records can agree on the phone while a third agrees only on the email.
#
# Grouping requires an equivalence relation. Given one that is not, there are
# two things an implementation can do and both are wrong in a different way:
#   - single pass, first matching cluster wins: the answer depends on the
#     order the rows arrived in, which is a property of the export, not of
#     the people.
#   - transitive closure: order-independent, and it merges records that the
#     predicate explicitly says do not match.
# This is not the ordering defect the corpus already covers. A comparator that
# is not a total order breaks SORTING; a match predicate that is not an
# equivalence relation breaks the existence of the grouping itself.
#
# The measurement sweeps all 24 orderings of four records and counts how many
# distinct clusterings come out, then asks the closure for its answer and
# checks it against the predicate that produced it.

def field(rec, k):
    # rec is [id, name, email, phone].
    return rec[k]

def matches(a, b):
    # Three clauses, each one reasonable in isolation.
    if len(a[2]) > 0:
        if a[2] == b[2]:
            return 1
    if len(a[3]) > 0:
        if a[3] == b[3]:
            return 1
    if a[1] == b[1]:
        return 1
    return 0

# id, name, email, phone. p0 and p1 share a phone (a household line). p1 and
# p2 share an email (a shared mailbox). p0 and p2 share nothing at all.
[[0, "J Wu", "jwu@example.com", "5551234"],
 [1, "Jing Wu", "team@example.com", "5551234"],
 [2, "Ana Diaz", "team@example.com", "5559876"],
 [3, "Ana Diaz", "ana@example.com", "5550000"]] => PEOPLE

def rec_by_id(i):
    for r in PEOPLE:
        if r[0] == i:
            return r
    return [0 - 1, "", "", ""]

def sort_ints(xs):
    [] => out
    for x in xs:
        [] => next_out
        0 => placed
        for y in out:
            if placed == 0:
                if x < y:
                    next_out + [x] => next_out
                    1 => placed
            next_out + [y] => next_out
        if placed == 0:
            next_out + [x] => next_out
        next_out => out
    return out

def signature(clusters):
    # A canonical string for a clustering, so distinct answers can be counted
    # without depending on which order the clusters were built in.
    [] => rows
    for c in clusters:
        sort_ints(c) => sc
        "" => s
        for x in sc:
            s + str(x) + "," => s
        rows + [s] => rows
    # order the rows by their first member
    [] => keys
    for c in clusters:
        sort_ints(c) => sc
        keys + [sc[0]] => keys
    "" => out
    for k in sort_ints(keys):
        0 => idx
        for c in clusters:
            sort_ints(c) => sc
            if sc[0] == k:
                out + rows[idx] + "|" => out
            idx + 1 => idx
    return out

def cluster_single_pass(order):
    # The shape almost everyone writes: for each record, join the first
    # existing cluster it matches; otherwise start a new one.
    [] => clusters
    for i in order:
        rec_by_id(i) => r
        0 => placed
        [] => next_clusters
        for c in clusters:
            if placed == 0:
                0 => hit
                for j in c:
                    if matches(r, rec_by_id(j)) == 1:
                        1 => hit
                if hit == 1:
                    next_clusters + [c + [i]] => next_clusters
                    1 => placed
                else:
                    next_clusters + [c] => next_clusters
            else:
                next_clusters + [c] => next_clusters
        if placed == 0:
            next_clusters + [[i]] => next_clusters
        next_clusters => clusters
    return clusters

def cluster_closure(order):
    # Keep merging any two clusters that contain a matching pair until nothing
    # changes. Order-independent - and that is exactly what makes it merge
    # records the predicate says do not match.
    [] => clusters
    for i in order:
        clusters + [[i]] => clusters
    1 => changed
    while changed == 1:
        0 => changed
        [] => next_clusters
        [] => consumed
        0 => a
        while a < len(clusters):
            if a in consumed:
                a + 1 => a
            else:
                clusters[a] => merged
                a + 1 => b
                while b < len(clusters):
                    if b in consumed:
                        b + 1 => b
                    else:
                        0 => hit
                        for x in merged:
                            for y in clusters[b]:
                                if matches(rec_by_id(x), rec_by_id(y)) == 1:
                                    1 => hit
                        if hit == 1:
                            merged + clusters[b] => merged
                            consumed + [b] => consumed
                            1 => changed
                        b + 1 => b
                next_clusters + [merged] => next_clusters
                a + 1 => a
        next_clusters => clusters
    return clusters

def permutations(xs):
    if len(xs) == 0:
        return [[]]
    [] => out
    0 => i
    while i < len(xs):
        xs[i] => head
        xs[0:i] + xs[i + 1:len(xs)] => rest
        for p in permutations(rest):
            out + [[head] + p] => out
        i + 1 => i
    return out

permutations([0, 1, 2, 3]) => ORDERS

"the pairwise predicate, as written"^0
"     p0  p1  p2  p3"^0
for a in [0, 1, 2, 3]:
    "p" + str(a) + " " => row
    for c in [0, 1, 2, 3]:
        row + "  " + str(matches(rec_by_id(a), rec_by_id(c))) + " " => row
    row^0

""^0
("orderings swept: " + str(len(ORDERS)))^0

[] => sigs
[] => counts
for o in ORDERS:
    signature(cluster_single_pass(o)) => s
    0 => seen
    0 => i
    while i < len(sigs):
        if sigs[i] == s:
            1 => seen
            counts[i] + 1 => counts[i]
        i + 1 => i
    if seen == 0:
        sigs + [s] => sigs
        counts + [1] => counts

("distinct clusterings produced by single-pass, over those orderings: " + str(len(sigs)))^0
0 => i
while i < len(sigs):
    ("  " + sigs[i] + "   from " + str(counts[i]) + " orderings")^0
    i + 1 => i

""^0
[] => csigs
for o in ORDERS:
    signature(cluster_closure(o)) => s
    0 => seen
    for t in csigs:
        if t == s:
            1 => seen
    if seen == 0:
        csigs + [s] => csigs
("distinct clusterings produced by transitive closure: " + str(len(csigs)))^0
for s in csigs:
    ("  " + s)^0

""^0
"what the closure answer costs"^0

# The closure is stable, so it looks like the correct one. Check its groups
# against the predicate that defined them: how many pairs end up in the same
# group while the predicate says they are not the same person.
cluster_closure([0, 1, 2, 3]) => closed
0 => unmatched_pairs_grouped
0 => grouped_pairs
for c in closed:
    for x in c:
        for y in c:
            if x < y:
                grouped_pairs + 1 => grouped_pairs
                if matches(rec_by_id(x), rec_by_id(y)) == 0:
                    unmatched_pairs_grouped + 1 => unmatched_pairs_grouped
("pairs placed in the same group: " + str(grouped_pairs))^0
("of those, pairs the predicate says do NOT match: " + str(unmatched_pairs_grouped))^0

""^0
"the chain that does it"^0
("p0 ~ p1 : " + str(matches(rec_by_id(0), rec_by_id(1))) + "  (shared phone " + rec_by_id(0)[3] + ")")^0
("p1 ~ p2 : " + str(matches(rec_by_id(1), rec_by_id(2))) + "  (shared mailbox " + rec_by_id(1)[2] + ")")^0
("p0 ~ p2 : " + str(matches(rec_by_id(0), rec_by_id(2))) + "  (nothing in common)")^0

""^0
0 => checked
0 => passed

# The predicate must be reflexive and symmetric - so the failure is precisely
# transitivity and not sloppiness.
checked + 1 => checked
0 => refl_sym_ok
0 => refl_sym_checks
for a in [0, 1, 2, 3]:
    refl_sym_checks + 1 => refl_sym_checks
    if matches(rec_by_id(a), rec_by_id(a)) == 1:
        refl_sym_ok + 1 => refl_sym_ok
    for c in [0, 1, 2, 3]:
        refl_sym_checks + 1 => refl_sym_checks
        if matches(rec_by_id(a), rec_by_id(c)) == matches(rec_by_id(c), rec_by_id(a)):
            refl_sym_ok + 1 => refl_sym_ok
if refl_sym_ok == refl_sym_checks:
    passed + 1 => passed

# And it must NOT be transitive - measured by finding a real violating triple,
# not asserted.
checked + 1 => checked
0 => violations
for a in [0, 1, 2, 3]:
    for b2 in [0, 1, 2, 3]:
        for c in [0, 1, 2, 3]:
            if matches(rec_by_id(a), rec_by_id(b2)) == 1:
                if matches(rec_by_id(b2), rec_by_id(c)) == 1:
                    if matches(rec_by_id(a), rec_by_id(c)) == 0:
                        violations + 1 => violations
if violations > 0:
    passed + 1 => passed

# Single-pass must give more than one answer across orderings. One answer
# would mean the data does not exercise the problem.
checked + 1 => checked
if len(sigs) > 1:
    passed + 1 => passed

# Closure must give exactly one answer - it is the stable option, which is
# why it is the one that gets chosen.
checked + 1 => checked
if len(csigs) == 1:
    passed + 1 => passed

# And that one stable answer must group a pair the predicate rejects. Both
# available implementations are wrong; they are wrong about different things.
checked + 1 => checked
if unmatched_pairs_grouped > 0:
    passed + 1 => passed

# The orderings must not be a sample - all of them, computed.
checked + 1 => checked
if len(ORDERS) == 24:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Reflexive, symmetric, not transitive - so there is no grouping to be right about." => verdict
else:
    "FAILED - the predicate or the clusterers did not behave as the checks describe." => verdict
verdict^0

""^0
"Every clause of the predicate is defensible and the conjunction is not an"^0
"equivalence relation. Grouping needs one. So the deduplication job does"^0
"not have a correct output that it is failing to produce - it has no"^0
"correct output, and the choice between an order-dependent answer and an"^0
"over-merged one was made by whoever wrote the loop, silently, years ago."^0
```

## Python (deterministic transpilation)

```python
def field(rec, k):
    return rec[k]

def matches(a, b):
    if len(a[2]) > 0:
        if a[2] == b[2]:
            return 1
    if len(a[3]) > 0:
        if a[3] == b[3]:
            return 1
    if a[1] == b[1]:
        return 1
    return 0

PEOPLE = [[0, "J Wu", "jwu@example.com", "5551234"], [1, "Jing Wu", "team@example.com", "5551234"], [2, "Ana Diaz", "team@example.com", "5559876"], [3, "Ana Diaz", "ana@example.com", "5550000"]]

def rec_by_id(i):
    for r in PEOPLE:
        if r[0] == i:
            return r
    return [0 - 1, "", "", ""]

def sort_ints(xs):
    out = []
    for x in xs:
        next_out = []
        placed = 0
        for y in out:
            if placed == 0:
                if x < y:
                    next_out = next_out + [x]
                    placed = 1
            next_out = next_out + [y]
        if placed == 0:
            next_out = next_out + [x]
        out = next_out
    return out

def signature(clusters):
    rows = []
    for c in clusters:
        sc = sort_ints(c)
        s = ""
        for x in sc:
            s = s + str(x) + ","
        rows = rows + [s]
    keys = []
    for c in clusters:
        sc = sort_ints(c)
        keys = keys + [sc[0]]
    out = ""
    for k in sort_ints(keys):
        idx = 0
        for c in clusters:
            sc = sort_ints(c)
            if sc[0] == k:
                out = out + rows[idx] + "|"
            idx = idx + 1
    return out

def cluster_single_pass(order):
    clusters = []
    for i in order:
        r = rec_by_id(i)
        placed = 0
        next_clusters = []
        for c in clusters:
            if placed == 0:
                hit = 0
                for j in c:
                    if matches(r, rec_by_id(j)) == 1:
                        hit = 1
                if hit == 1:
                    next_clusters = next_clusters + [c + [i]]
                    placed = 1
                else:
                    next_clusters = next_clusters + [c]
            else:
                next_clusters = next_clusters + [c]
        if placed == 0:
            next_clusters = next_clusters + [[i]]
        clusters = next_clusters
    return clusters

def cluster_closure(order):
    clusters = []
    for i in order:
        clusters = clusters + [[i]]
    changed = 1
    while changed == 1:
        changed = 0
        next_clusters = []
        consumed = []
        a = 0
        while a < len(clusters):
            if a in consumed:
                a = a + 1
            else:
                merged = clusters[a]
                b = a + 1
                while b < len(clusters):
                    if b in consumed:
                        b = b + 1
                    else:
                        hit = 0
                        for x in merged:
                            for y in clusters[b]:
                                if matches(rec_by_id(x), rec_by_id(y)) == 1:
                                    hit = 1
                        if hit == 1:
                            merged = merged + clusters[b]
                            consumed = consumed + [b]
                            changed = 1
                        b = b + 1
                next_clusters = next_clusters + [merged]
                a = a + 1
        clusters = next_clusters
    return clusters

def permutations(xs):
    if len(xs) == 0:
        return [[]]
    out = []
    i = 0
    while i < len(xs):
        head = xs[i]
        rest = xs[0:i] + xs[i + 1:len(xs)]
        for p in permutations(rest):
            out = out + [[head] + p]
        i = i + 1
    return out

ORDERS = permutations([0, 1, 2, 3])
print("the pairwise predicate, as written")
print("     p0  p1  p2  p3")
for a in [0, 1, 2, 3]:
    row = "p" + str(a) + " "
    for c in [0, 1, 2, 3]:
        row = row + "  " + str(matches(rec_by_id(a), rec_by_id(c))) + " "
    print(row)
print("")
print("orderings swept: " + str(len(ORDERS)))
sigs = []
counts = []
for o in ORDERS:
    s = signature(cluster_single_pass(o))
    seen = 0
    i = 0
    while i < len(sigs):
        if sigs[i] == s:
            seen = 1
            counts[i] = counts[i] + 1
        i = i + 1
    if seen == 0:
        sigs = sigs + [s]
        counts = counts + [1]
print("distinct clusterings produced by single-pass, over those orderings: " + str(len(sigs)))
i = 0
while i < len(sigs):
    print("  " + sigs[i] + "   from " + str(counts[i]) + " orderings")
    i = i + 1
print("")
csigs = []
for o in ORDERS:
    s = signature(cluster_closure(o))
    seen = 0
    for t in csigs:
        if t == s:
            seen = 1
    if seen == 0:
        csigs = csigs + [s]
print("distinct clusterings produced by transitive closure: " + str(len(csigs)))
for s in csigs:
    print("  " + s)
print("")
print("what the closure answer costs")
closed = cluster_closure([0, 1, 2, 3])
unmatched_pairs_grouped = 0
grouped_pairs = 0
for c in closed:
    for x in c:
        for y in c:
            if x < y:
                grouped_pairs = grouped_pairs + 1
                if matches(rec_by_id(x), rec_by_id(y)) == 0:
                    unmatched_pairs_grouped = unmatched_pairs_grouped + 1
print("pairs placed in the same group: " + str(grouped_pairs))
print("of those, pairs the predicate says do NOT match: " + str(unmatched_pairs_grouped))
print("")
print("the chain that does it")
print("p0 ~ p1 : " + str(matches(rec_by_id(0), rec_by_id(1))) + "  (shared phone " + rec_by_id(0)[3] + ")")
print("p1 ~ p2 : " + str(matches(rec_by_id(1), rec_by_id(2))) + "  (shared mailbox " + rec_by_id(1)[2] + ")")
print("p0 ~ p2 : " + str(matches(rec_by_id(0), rec_by_id(2))) + "  (nothing in common)")
print("")
checked = 0
passed = 0
checked = checked + 1
refl_sym_ok = 0
refl_sym_checks = 0
for a in [0, 1, 2, 3]:
    refl_sym_checks = refl_sym_checks + 1
    if matches(rec_by_id(a), rec_by_id(a)) == 1:
        refl_sym_ok = refl_sym_ok + 1
    for c in [0, 1, 2, 3]:
        refl_sym_checks = refl_sym_checks + 1
        if matches(rec_by_id(a), rec_by_id(c)) == matches(rec_by_id(c), rec_by_id(a)):
            refl_sym_ok = refl_sym_ok + 1
if refl_sym_ok == refl_sym_checks:
    passed = passed + 1
checked = checked + 1
violations = 0
for a in [0, 1, 2, 3]:
    for b2 in [0, 1, 2, 3]:
        for c in [0, 1, 2, 3]:
            if matches(rec_by_id(a), rec_by_id(b2)) == 1:
                if matches(rec_by_id(b2), rec_by_id(c)) == 1:
                    if matches(rec_by_id(a), rec_by_id(c)) == 0:
                        violations = violations + 1
if violations > 0:
    passed = passed + 1
checked = checked + 1
if len(sigs) > 1:
    passed = passed + 1
checked = checked + 1
if len(csigs) == 1:
    passed = passed + 1
checked = checked + 1
if unmatched_pairs_grouped > 0:
    passed = passed + 1
checked = checked + 1
if len(ORDERS) == 24:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Reflexive, symmetric, not transitive - so there is no grouping to be right about."
else:
    verdict = "FAILED - the predicate or the clusterers did not behave as the checks describe."
print(verdict)
print("")
print("Every clause of the predicate is defensible and the conjunction is not an")
print("equivalence relation. Grouping needs one. So the deduplication job does")
print("not have a correct output that it is failing to produce - it has no")
print("correct output, and the choice between an order-dependent answer and an")
print("over-merged one was made by whoever wrote the loop, silently, years ago.")
```

## stdout (executed)

```text
the pairwise predicate, as written
     p0  p1  p2  p3
p0   1   1   0   0 
p1   1   1   1   0 
p2   0   1   1   1 
p3   0   0   1   1 

orderings swept: 24
distinct clusterings produced by single-pass, over those orderings: 4
  0,1,2,3,|   from 8 orderings
  0,1,2,|3,|   from 5 orderings
  0,1,|2,3,|   from 6 orderings
  0,|1,2,3,|   from 5 orderings

distinct clusterings produced by transitive closure: 1
  0,1,2,3,|

what the closure answer costs
pairs placed in the same group: 6
of those, pairs the predicate says do NOT match: 3

the chain that does it
p0 ~ p1 : 1  (shared phone 5551234)
p1 ~ p2 : 1  (shared mailbox team@example.com)
p0 ~ p2 : 0  (nothing in common)

checks passed: 6/6
Reflexive, symmetric, not transitive - so there is no grouping to be right about.

Every clause of the predicate is defensible and the conjunction is not an
equivalence relation. Grouping needs one. So the deduplication job does
not have a correct output that it is failing to produce - it has no
correct output, and the choice between an order-dependent answer and an
over-merged one was made by whoever wrote the loop, silently, years ago.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
