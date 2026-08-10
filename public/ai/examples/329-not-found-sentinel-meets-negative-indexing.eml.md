<!-- canonical: efficientnewlanguage.org/ai/examples/329-not-found-sentinel-meets-negative-indexing | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 329 — The not-found sentinel meets negative indexing — a miss returns the last row

`not_found_sentinel_meets_negative_indexing.eml` runs six lookups against a four-row table under a guarded and an unguarded call style.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A lookup that
# returns -1 for "not found", handed to a caller that indexes with it.
#
# The sentinel is a fine convention and the first caller uses it correctly: it
# checks the result before using it. The second caller does what looks like the
# same thing in one fewer line - `xs[find_index(xs, t)]` - and in Python that
# is not an error. Index -1 is the last element. The miss becomes a hit on
# whatever happens to be at the end of the list.
#
# What makes it durable is the shape of the wrong answer. It is a real element
# of the real list, of the right type, in range, and it passes every downstream
# check that asks "is this a valid record". There is nothing to notice.
#
# And the fixture most likely to be written - look up something that IS in the
# list - cannot fail. So can the fixture that looks up the LAST item, for a
# different reason: a miss and a hit on the final element return the same
# thing. The measurement counts both.

def find_index(xs, target):
    for i in [0:len(xs) - 1]:
        if xs[i] == target:
            return i
    return 0 - 1

def guarded_lookup(xs, target):
    find_index(xs, target) => i
    if i < 0:
        return "NOT-FOUND"
    return xs[i]

def unguarded_lookup(xs, target):
    return xs[find_index(xs, target)]

["alpha", "beta", "gamma", "delta"] => table
["alpha", "gamma", "epsilon", "zeta", "delta", "beta"] => queries

"the same table, the same queries, two call styles" ^0
"  table   : " + repr(table) ^0
0 => misses
0 => silent_wrong
0 => accidentally_right
for q in queries:
    guarded_lookup(table, q) => g
    unguarded_lookup(table, q) => u
    find_index(table, q) => idx
    if idx < 0:
        misses + 1 => misses
        if u == table[len(table) - 1]:
            silent_wrong + 1 => silent_wrong
    "  " + q + " -> guarded " + g + " | unguarded " + u ^0
"" ^0

"queries that miss                          : " + str(misses) + " of " + str(len(queries)) ^0
"misses that came back as the LAST element  : " + str(silent_wrong) ^0
"" ^0

# ---- every wrong answer is a legitimate row ----

"is the wrong answer detectable downstream?" ^0
0 => not_in_table
for q in queries:
    unguarded_lookup(table, q) => u
    if u in table:
        pass
    else:
        not_in_table + 1 => not_in_table
"  unguarded results that are NOT a member of the table: " + str(not_in_table) ^0
"  a validity check on the result cannot separate a hit from a miss" ^0
"" ^0

# ---- the two fixtures that cannot fail ----

"fixtures that cannot distinguish the two call styles" ^0
0 => same_answer
[] => indistinguishable
for q in queries:
    if guarded_lookup(table, q) == unguarded_lookup(table, q):
        same_answer + 1 => same_answer
        indistinguishable + [q] => indistinguishable
"  queries where guarded and unguarded agree: " + str(same_answer) + " of " + str(len(queries)) ^0
"  " + repr(indistinguishable) ^0
"" ^0

"  all four agree because the item is present:" ^0
for q in indistinguishable:
    "    " + q + " (present at index " + str(find_index(table, q)) + ")" ^0
"" ^0

# ---- the collision: different questions, one answer ----

table[len(table) - 1] => last
"queries whose unguarded answer is the last element, '" + last + "'" ^0
[] => present_here
[] => missing_here
for q in queries:
    if unguarded_lookup(table, q) == last:
        if find_index(table, q) < 0:
            missing_here + [q] => missing_here
        else:
            present_here + [q] => present_here
"  present : " + repr(present_here) ^0
"  missing : " + repr(missing_here) ^0
"  distinct queries collapsing to one answer: " + str(len(present_here) + len(missing_here)) ^0
"" ^0
"A fixture built from items that are present can never fail - all four of" ^0
"them agree above. And asserting that the LAST item looks up correctly is" ^0
"the one assertion a miss also satisfies, so it carries no information about" ^0
"misses at all." ^0
```

## Python (deterministic transpilation)

```python
def find_index(xs, target):
    for i in range(0, len(xs)):
        if xs[i] == target:
            return i
    return 0 - 1

def guarded_lookup(xs, target):
    i = find_index(xs, target)
    if i < 0:
        return "NOT-FOUND"
    return xs[i]

def unguarded_lookup(xs, target):
    return xs[find_index(xs, target)]

table = ["alpha", "beta", "gamma", "delta"]
queries = ["alpha", "gamma", "epsilon", "zeta", "delta", "beta"]
print("the same table, the same queries, two call styles")
print("  table   : " + repr(table))
misses = 0
silent_wrong = 0
accidentally_right = 0
for q in queries:
    g = guarded_lookup(table, q)
    u = unguarded_lookup(table, q)
    idx = find_index(table, q)
    if idx < 0:
        misses = misses + 1
        if u == table[len(table) - 1]:
            silent_wrong = silent_wrong + 1
    print("  " + q + " -> guarded " + g + " | unguarded " + u)
print("")
print("queries that miss                          : " + str(misses) + " of " + str(len(queries)))
print("misses that came back as the LAST element  : " + str(silent_wrong))
print("")
print("is the wrong answer detectable downstream?")
not_in_table = 0
for q in queries:
    u = unguarded_lookup(table, q)
    if u in table:
        pass
    else:
        not_in_table = not_in_table + 1
print("  unguarded results that are NOT a member of the table: " + str(not_in_table))
print("  a validity check on the result cannot separate a hit from a miss")
print("")
print("fixtures that cannot distinguish the two call styles")
same_answer = 0
indistinguishable = []
for q in queries:
    if guarded_lookup(table, q) == unguarded_lookup(table, q):
        same_answer = same_answer + 1
        indistinguishable = indistinguishable + [q]
print("  queries where guarded and unguarded agree: " + str(same_answer) + " of " + str(len(queries)))
print("  " + repr(indistinguishable))
print("")
print("  all four agree because the item is present:")
for q in indistinguishable:
    print("    " + q + " (present at index " + str(find_index(table, q)) + ")")
print("")
last = table[len(table) - 1]
print("queries whose unguarded answer is the last element, '" + last + "'")
present_here = []
missing_here = []
for q in queries:
    if unguarded_lookup(table, q) == last:
        if find_index(table, q) < 0:
            missing_here = missing_here + [q]
        else:
            present_here = present_here + [q]
print("  present : " + repr(present_here))
print("  missing : " + repr(missing_here))
print("  distinct queries collapsing to one answer: " + str(len(present_here) + len(missing_here)))
print("")
print("A fixture built from items that are present can never fail - all four of")
print("them agree above. And asserting that the LAST item looks up correctly is")
print("the one assertion a miss also satisfies, so it carries no information about")
print("misses at all.")
```

## stdout (executed)

```text
the same table, the same queries, two call styles
  table   : ['alpha', 'beta', 'gamma', 'delta']
  alpha -> guarded alpha | unguarded alpha
  gamma -> guarded gamma | unguarded gamma
  epsilon -> guarded NOT-FOUND | unguarded delta
  zeta -> guarded NOT-FOUND | unguarded delta
  delta -> guarded delta | unguarded delta
  beta -> guarded beta | unguarded beta

queries that miss                          : 2 of 6
misses that came back as the LAST element  : 2

is the wrong answer detectable downstream?
  unguarded results that are NOT a member of the table: 0
  a validity check on the result cannot separate a hit from a miss

fixtures that cannot distinguish the two call styles
  queries where guarded and unguarded agree: 4 of 6
  ['alpha', 'gamma', 'delta', 'beta']

  all four agree because the item is present:
    alpha (present at index 0)
    gamma (present at index 2)
    delta (present at index 3)
    beta (present at index 1)

queries whose unguarded answer is the last element, 'delta'
  present : ['delta']
  missing : ['epsilon', 'zeta']
  distinct queries collapsing to one answer: 3

A fixture built from items that are present can never fail - all four of
them agree above. And asserting that the LAST item looks up correctly is
the one assertion a miss also satisfies, so it carries no information about
misses at all.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
