<!-- canonical: efficientnewlanguage.org/ai/examples/270-sort-key-mismatch-binary-search | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 270 — Sort key mismatch — the list is sorted, the item is in it, the search says no

`sort_key_mismatch_binary_search.eml` searches a case-insensitively sorted list with a case-sensitive comparison and counts how many present items come back "not found".

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The list is
# sorted, the item is in it, and the binary search says no.
#
# Binary search does not require a sorted list. It requires a list sorted BY
# THE SAME COMPARISON the search uses. Those are two different requirements and
# only the first one is ever stated, so when a list arrives sorted by a
# database collation and is searched with the application's own `<`, the
# precondition is violated in a way that no assertion checks and no type
# expresses.
#
# The mismatch used here is case: the list is ordered case-insensitively, which
# is what almost every database and file system does by default, and searched
# with an ordinary case-sensitive comparison, which is what almost every
# programming language does by default. Both orderings are correct. Neither
# knows about the other.
#
# The failure is not a crash and not a wrong item - it is a MISS. The search
# reports "not found" for an item that is present, so the calling code takes
# the create-if-absent branch and inserts a duplicate.
#
# The measurement searches for every element of the list, with both search
# comparisons, and counts misses. A correct pairing must find all of them.

def lower_char(c):
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ" => up
    "abcdefghijklmnopqrstuvwxyz" => lo
    for i in [0:25]:
        if up[i] == c:
            return lo[i]
    return c

def fold(s):
    "" => out
    for i in [0:len(s) - 1]:
        out + lower_char(s[i]) => out
    return out

def cmp_str(a, b):
    len(a) => la
    len(b) => lb
    la => m
    if lb < m:
        lb => m
    for i in [0:m - 1]:
        if a[i] < b[i]:
            return 0 - 1
        if a[i] > b[i]:
            return 1
    if la < lb:
        return 0 - 1
    if la > lb:
        return 1
    return 0

def cmp_folded(a, b):
    return cmp_str(fold(a), fold(b))

def sort_by(xs, folded):
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
                0 => c
                if folded == 1:
                    cmp_folded(out[j], cur) => c
                else:
                    cmp_str(out[j], cur) => c
                if c > 0:
                    out[j] => out[j + 1]
                    j - 1 => j
                    1 => moving
        cur => out[j + 1]
        i + 1 => i
    return out

def bsearch(xs, target, folded):
    0 => lo
    len(xs) - 1 => hi
    while lo <= hi:
        int((lo + hi) / 2) => mid
        0 => c
        if folded == 1:
            cmp_folded(xs[mid], target) => c
        else:
            cmp_str(xs[mid], target) => c
        if c == 0:
            return mid
        if c < 0:
            mid + 1 => lo
        else:
            mid - 1 => hi
    return 0 - 1

def linear(xs, target):
    for i in [0:len(xs) - 1]:
        if xs[i] == target:
            return i
    return 0 - 1

def join(xs):
    "" => s
    for x in xs:
        if len(s) > 0:
            s + " " => s
        s + x => s
    return s


["apple", "Banana", "cherry", "Date", "elder", "Fig", "grape"] => names

sort_by(names, 1) => folded_list
sort_by(names, 0) => exact_list
"the same names, ordered two correct ways:"^0
("  case-insensitive: " + join(folded_list))^0
("  case-sensitive:   " + join(exact_list))^0

""^0
"searching a case-insensitively sorted list:"^0
0 => miss_mismatch
0 => miss_matched
for t in names:
    if bsearch(folded_list, t, 0) < 0:
        miss_mismatch + 1 => miss_mismatch
    if bsearch(folded_list, t, 1) < 0:
        miss_matched + 1 => miss_matched
("  with a case-SENSITIVE comparison:   " + str(miss_mismatch) + " of " + str(len(names)) + " present items not found")^0
("  with the MATCHING comparison:       " + str(miss_matched) + " of " + str(len(names)) + " present items not found")^0

# ------------------------------------------- which ones went missing
""^0
"items present in the list and reported absent:"^0
for t in names:
    if bsearch(folded_list, t, 0) < 0:
        ("  " + t + "  (linear scan finds it at index " + str(linear(folded_list, t)) + ")")^0

# ---------------------------------- the list really is sorted, by its rule
""^0
0 => folded_ok
for i in [0:len(folded_list) - 2]:
    if cmp_folded(folded_list[i], folded_list[i + 1]) <= 0:
        folded_ok + 1 => folded_ok
("the list is in order under its own comparison: " + str(folded_ok) + "/" + str(len(folded_list) - 1) + " adjacent pairs")^0
0 => exact_ok
for i in [0:len(folded_list) - 2]:
    if cmp_str(folded_list[i], folded_list[i + 1]) <= 0:
        exact_ok + 1 => exact_ok
("...and under the SEARCH's comparison: " + str(exact_ok) + "/" + str(len(folded_list) - 1))^0

# ------------------------- what happens next, in the calling code
""^0
"a get-or-create that trusts the search:"^0
0 => duplicates
[] => store
for x in folded_list:
    store + [x] => store
for t in names:
    if bsearch(store, t, 0) < 0:
        store + [t] => store
        duplicates + 1 => duplicates
("  records inserted for names already present: " + str(duplicates))^0
("  store size: " + str(len(names)) + " -> " + str(len(store)))^0

# ------------------------- an all-lowercase list cannot show any of this
""^0
["apple", "banana", "cherry", "date", "elder", "fig", "grape"] => plain
sort_by(plain, 1) => plain_sorted
0 => plain_miss
for t in plain:
    if bsearch(plain_sorted, t, 0) < 0:
        plain_miss + 1 => plain_miss
("with no mixed case anywhere, misses: " + str(plain_miss) + "/" + str(len(plain)))^0
"...which is what a fixture written by hand almost always looks like."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The mismatched search must miss at least one present item.
checked + 1 => checked
if miss_mismatch > 0:
    passed + 1 => passed

# The matching search must find every one - the list and the algorithm are
# both fine, so the defect is the pairing.
checked + 1 => checked
if miss_matched == 0:
    passed + 1 => passed

# The list must be fully ordered under its own comparison and NOT under the
# search's. That is the precondition, stated as two counts.
checked + 1 => checked
if folded_ok == len(folded_list) - 1 and exact_ok < len(folded_list) - 1:
    passed + 1 => passed

# Every missed item must be findable by a linear scan, so nothing is actually
# absent - the search is answering a different question.
checked + 1 => checked
0 => findable
0 => missed
for t in names:
    if bsearch(folded_list, t, 0) < 0:
        missed + 1 => missed
        if linear(folded_list, t) >= 0:
            findable + 1 => findable
if findable == missed and missed > 0:
    passed + 1 => passed

# And an all-lowercase list must show nothing at all, which is why a
# hand-written fixture never reproduces this.
checked + 1 => checked
if plain_miss == 0:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Both orderings are correct, and pairing them loses records." => verdict
else:
    "FAILED - a search did not behave as the checks describe." => verdict
verdict^0

""^0
"Sorted is not a property of a list. It is a relation between a list and a" => n1
n1^0
"comparison, and a function that takes only the list has been handed half" => n2
n2^0
"of its own precondition. The half that is missing usually comes from" => n3
n3^0
"somewhere with its own opinion - a database collation, a file system, a" => n4
n4^0
"locale - and that opinion is never wrong, only different." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def lower_char(c):
    up = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    lo = "abcdefghijklmnopqrstuvwxyz"
    for i in range(0, 26):
        if up[i] == c:
            return lo[i]
    return c

def fold(s):
    out = ""
    for i in range(0, len(s)):
        out = out + lower_char(s[i])
    return out

def cmp_str(a, b):
    la = len(a)
    lb = len(b)
    m = la
    if lb < m:
        m = lb
    for i in range(0, m):
        if a[i] < b[i]:
            return 0 - 1
        if a[i] > b[i]:
            return 1
    if la < lb:
        return 0 - 1
    if la > lb:
        return 1
    return 0

def cmp_folded(a, b):
    return cmp_str(fold(a), fold(b))

def sort_by(xs, folded):
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
                c = 0
                if folded == 1:
                    c = cmp_folded(out[j], cur)
                else:
                    c = cmp_str(out[j], cur)
                if c > 0:
                    out[j + 1] = out[j]
                    j = j - 1
                    moving = 1
        out[j + 1] = cur
        i = i + 1
    return out

def bsearch(xs, target, folded):
    lo = 0
    hi = len(xs) - 1
    while lo <= hi:
        mid = int((lo + hi) / 2)
        c = 0
        if folded == 1:
            c = cmp_folded(xs[mid], target)
        else:
            c = cmp_str(xs[mid], target)
        if c == 0:
            return mid
        if c < 0:
            lo = mid + 1
        else:
            hi = mid - 1
    return 0 - 1

def linear(xs, target):
    for i in range(0, len(xs)):
        if xs[i] == target:
            return i
    return 0 - 1

def join(xs):
    s = ""
    for x in xs:
        if len(s) > 0:
            s = s + " "
        s = s + x
    return s

names = ["apple", "Banana", "cherry", "Date", "elder", "Fig", "grape"]
folded_list = sort_by(names, 1)
exact_list = sort_by(names, 0)
print("the same names, ordered two correct ways:")
print("  case-insensitive: " + join(folded_list))
print("  case-sensitive:   " + join(exact_list))
print("")
print("searching a case-insensitively sorted list:")
miss_mismatch = 0
miss_matched = 0
for t in names:
    if bsearch(folded_list, t, 0) < 0:
        miss_mismatch = miss_mismatch + 1
    if bsearch(folded_list, t, 1) < 0:
        miss_matched = miss_matched + 1
print("  with a case-SENSITIVE comparison:   " + str(miss_mismatch) + " of " + str(len(names)) + " present items not found")
print("  with the MATCHING comparison:       " + str(miss_matched) + " of " + str(len(names)) + " present items not found")
print("")
print("items present in the list and reported absent:")
for t in names:
    if bsearch(folded_list, t, 0) < 0:
        print("  " + t + "  (linear scan finds it at index " + str(linear(folded_list, t)) + ")")
print("")
folded_ok = 0
for i in range(0, len(folded_list) - 2+1):
    if cmp_folded(folded_list[i], folded_list[i + 1]) <= 0:
        folded_ok = folded_ok + 1
print("the list is in order under its own comparison: " + str(folded_ok) + "/" + str(len(folded_list) - 1) + " adjacent pairs")
exact_ok = 0
for i in range(0, len(folded_list) - 2+1):
    if cmp_str(folded_list[i], folded_list[i + 1]) <= 0:
        exact_ok = exact_ok + 1
print("...and under the SEARCH's comparison: " + str(exact_ok) + "/" + str(len(folded_list) - 1))
print("")
print("a get-or-create that trusts the search:")
duplicates = 0
store = []
for x in folded_list:
    store = store + [x]
for t in names:
    if bsearch(store, t, 0) < 0:
        store = store + [t]
        duplicates = duplicates + 1
print("  records inserted for names already present: " + str(duplicates))
print("  store size: " + str(len(names)) + " -> " + str(len(store)))
print("")
plain = ["apple", "banana", "cherry", "date", "elder", "fig", "grape"]
plain_sorted = sort_by(plain, 1)
plain_miss = 0
for t in plain:
    if bsearch(plain_sorted, t, 0) < 0:
        plain_miss = plain_miss + 1
print("with no mixed case anywhere, misses: " + str(plain_miss) + "/" + str(len(plain)))
print("...which is what a fixture written by hand almost always looks like.")
passed = 0
checked = 0
checked = checked + 1
if miss_mismatch > 0:
    passed = passed + 1
checked = checked + 1
if miss_matched == 0:
    passed = passed + 1
checked = checked + 1
if folded_ok == len(folded_list) - 1 and exact_ok < len(folded_list) - 1:
    passed = passed + 1
checked = checked + 1
findable = 0
missed = 0
for t in names:
    if bsearch(folded_list, t, 0) < 0:
        missed = missed + 1
        if linear(folded_list, t) >= 0:
            findable = findable + 1
if findable == missed and missed > 0:
    passed = passed + 1
checked = checked + 1
if plain_miss == 0:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Both orderings are correct, and pairing them loses records."
else:
    verdict = "FAILED - a search did not behave as the checks describe."
print(verdict)
print("")
n1 = "Sorted is not a property of a list. It is a relation between a list and a"
print(n1)
n2 = "comparison, and a function that takes only the list has been handed half"
print(n2)
n3 = "of its own precondition. The half that is missing usually comes from"
print(n3)
n4 = "somewhere with its own opinion - a database collation, a file system, a"
print(n4)
n5 = "locale - and that opinion is never wrong, only different."
print(n5)
```

## stdout (executed)

```text
the same names, ordered two correct ways:
  case-insensitive: apple Banana cherry Date elder Fig grape
  case-sensitive:   Banana Date Fig apple cherry elder grape

searching a case-insensitively sorted list:
  with a case-SENSITIVE comparison:   3 of 7 present items not found
  with the MATCHING comparison:       0 of 7 present items not found

items present in the list and reported absent:
  apple  (linear scan finds it at index 0)
  cherry  (linear scan finds it at index 2)
  elder  (linear scan finds it at index 4)

the list is in order under its own comparison: 6/6 adjacent pairs
...and under the SEARCH's comparison: 3/6

a get-or-create that trusts the search:
  records inserted for names already present: 5
  store size: 7 -> 12

with no mixed case anywhere, misses: 0/7
...which is what a fixture written by hand almost always looks like.

checks passed: 5/5
Both orderings are correct, and pairing them loses records.

Sorted is not a property of a list. It is a relation between a list and a
comparison, and a function that takes only the list has been handed half
of its own precondition. The half that is missing usually comes from
somewhere with its own opinion - a database collation, a file system, a
locale - and that opinion is never wrong, only different.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
