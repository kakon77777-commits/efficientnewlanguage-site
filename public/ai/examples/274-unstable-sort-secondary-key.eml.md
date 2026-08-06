<!-- canonical: efficientnewlanguage.org/ai/examples/274-unstable-sort-secondary-key | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 274 — Unstable sort, secondary key — sorted by department, names out of order

`unstable_sort_secondary_key.eml` runs the two-pass sorting idiom — sort by name, then sort by department — with a stable and an unstable second pass, and counts how many departments kept their names in order.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Sort by name,
# then sort by department, and the names are no longer in order.
#
# "Sort by department, then by name within each department" is very often
# written as two sorts: sort by name, then sort by department. That idiom is
# correct if and only if the second sort is STABLE - if it preserves the
# relative order of records it considers equal. Stability is not part of what
# "sorted" means, and a sort that is not stable is not wrong; it simply makes
# no promise about ties, and the whole idiom lives on that promise.
#
# The failure has an unpleasant shape: the output IS sorted by department, so
# the check anybody writes passes. Only the secondary order is gone, and it is
# gone for some inputs and not others, which is how it survives review and a
# test suite with three rows of fixture data.
#
# The measurement runs the two-pass idiom with a stable and an unstable second
# pass and counts, for each department, whether its names came out ordered.

def by_name(rows):
    # Insertion sort on the name field. Stable, and used for pass one in both
    # arms so the two arms differ in exactly one thing.
    [] => out
    for r in rows:
        out + [r] => out
    1 => i
    while i < len(out):
        out[i] => cur
        i - 1 => j
        while j >= 0 and out[j][1] > cur[1]:
            out[j] => out[j + 1]
            j - 1 => j
        cur => out[j + 1]
        i + 1 => i
    return out

def by_dept_stable(rows):
    # Insertion sort moves an element past a predecessor only when it is
    # strictly greater, so equal keys never cross. That is stability.
    [] => out
    for r in rows:
        out + [r] => out
    1 => i
    while i < len(out):
        out[i] => cur
        i - 1 => j
        while j >= 0 and out[j][0] > cur[0]:
            out[j] => out[j + 1]
            j - 1 => j
        cur => out[j + 1]
        i + 1 => i
    return out

def by_dept_unstable(rows):
    # Selection sort. It swaps the minimum into place from wherever it was,
    # which throws whatever was at that position to the far end of the list.
    # Perfectly correct as a sort, and it makes no promise about equal keys.
    [] => out
    for r in rows:
        out + [r] => out
    for i in [0:len(out) - 1]:
        i => best
        for j in [i + 1:len(out) - 1]:
            if out[j][0] < out[best][0]:
                j => best
        out[i] => t
        out[best] => out[i]
        t => out[best]
    return out

def depts_in_order(rows):
    # How many departments have their names in ascending order.
    {} => seen
    for r in rows:
        1 => seen[r[0]]
    0 => good
    0 => total
    for d in ["eng", "ops", "sales"]:
        if d in seen:
            total + 1 => total
            1 => ok
            "" => prev
            for r in rows:
                if r[0] == d:
                    if len(prev) > 0 and prev > r[1]:
                        0 => ok
                    r[1] => prev
            if ok == 1:
                good + 1 => good
    return [good, total]

def sorted_by_dept(rows):
    for i in [0:len(rows) - 2]:
        if rows[i][0] > rows[i + 1][0]:
            return False
    return True

def render(rows):
    "" => s
    for r in rows:
        if len(s) > 0:
            s + " " => s
        s + r[0] + "/" + r[1] => s
    return s


[
    ["ops", "rhea"], ["eng", "mira"], ["sales", "dana"], ["eng", "aki"],
    ["ops", "cleo"], ["sales", "bo"], ["eng", "zoe"], ["ops", "ali"],
    ["sales", "nia"]
] => staff

by_name(staff) => pass1
"after pass one, sorted by name:"^0
("  " + render(pass1))^0

""^0
by_dept_stable(pass1) => stable_out
by_dept_unstable(pass1) => unstable_out
"after pass two, sorted by department:"^0
("  stable:   " + render(stable_out))^0
("  unstable: " + render(unstable_out))^0

depts_in_order(stable_out) => st
depts_in_order(unstable_out) => un
""^0
("departments whose names came out ordered:")^0
("  stable second pass:   " + str(st[0]) + "/" + str(st[1]))^0
("  unstable second pass: " + str(un[0]) + "/" + str(un[1]))^0

# ------------------------------- the check everybody writes still passes
""^0
"is the output sorted by department?"^0
("  stable:   " + str(sorted_by_dept(stable_out)))^0
("  unstable: " + str(sorted_by_dept(unstable_out)))^0
"...both, which is why the defect gets shipped."^0

# ------------------------- both outputs contain the same nine records
""^0
0 => same_multiset
for r in staff:
    0 => a
    0 => b
    for x in stable_out:
        if x[0] == r[0] and x[1] == r[1]:
            a + 1 => a
    for x in unstable_out:
        if x[0] == r[0] and x[1] == r[1]:
            b + 1 => b
    if a == b and a == 1:
        same_multiset + 1 => same_multiset
("records present exactly once in both outputs: " + str(same_multiset) + "/" + str(len(staff)))^0

# --------------------------- how often a small fixture would catch it
""^0
"the same two passes over the first k records only:"^0
0 => caught
0 => sizes
for k in [2:len(staff)]:
    sizes + 1 => sizes
    [] => small
    for i in [0:k - 1]:
        small + [staff[i]] => small
    by_name(small) => p1
    depts_in_order(by_dept_unstable(p1)) => u
    if u[0] < u[1]:
        caught + 1 => caught
("fixture sizes tried: " + str(sizes) + ", sizes where the defect is visible: " + str(caught))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The stable pass must preserve the name order in EVERY department.
checked + 1 => checked
if st[0] == st[1]:
    passed + 1 => passed

# The unstable pass must lose it in at least one.
checked + 1 => checked
if un[0] < un[1]:
    passed + 1 => passed

# Both outputs must be sorted by department. The primary key is correct in
# both arms - that is what makes the failure invisible to the obvious check.
checked + 1 => checked
if sorted_by_dept(stable_out) and sorted_by_dept(unstable_out):
    passed + 1 => passed

# Both must contain exactly the same records. Nothing was lost or duplicated;
# only the order within a group changed.
checked + 1 => checked
if same_multiset == len(staff):
    passed + 1 => passed

# And the defect must be invisible at some fixture sizes and visible at
# others - if every size caught it, the survival story would be wrong.
checked + 1 => checked
if caught > 0 and caught < sizes:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Sorted by department in both arms, and only one kept the names in order." => verdict
else:
    "FAILED - a sort did not behave as the checks describe." => verdict
verdict^0

""^0
"Stability is a promise about the records a sort considers EQUAL, which is" => n1
n1^0
"exactly the set of records the sort was not asked about. That is why it" => n2
n2^0
"reads as an implementation detail and why the two-pass idiom depends on" => n3
n3^0
"it entirely: the second sort is being asked to preserve an order it was" => n4
n4^0
"never told about." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def by_name(rows):
    out = []
    for r in rows:
        out = out + [r]
    i = 1
    while i < len(out):
        cur = out[i]
        j = i - 1
        while j >= 0 and out[j][1] > cur[1]:
            out[j + 1] = out[j]
            j = j - 1
        out[j + 1] = cur
        i = i + 1
    return out

def by_dept_stable(rows):
    out = []
    for r in rows:
        out = out + [r]
    i = 1
    while i < len(out):
        cur = out[i]
        j = i - 1
        while j >= 0 and out[j][0] > cur[0]:
            out[j + 1] = out[j]
            j = j - 1
        out[j + 1] = cur
        i = i + 1
    return out

def by_dept_unstable(rows):
    out = []
    for r in rows:
        out = out + [r]
    for i in range(0, len(out)):
        best = i
        for j in range(i + 1, len(out)):
            if out[j][0] < out[best][0]:
                best = j
        t = out[i]
        out[i] = out[best]
        out[best] = t
    return out

def depts_in_order(rows):
    seen = {}
    for r in rows:
        seen[r[0]] = 1
    good = 0
    total = 0
    for d in ["eng", "ops", "sales"]:
        if d in seen:
            total = total + 1
            ok = 1
            prev = ""
            for r in rows:
                if r[0] == d:
                    if len(prev) > 0 and prev > r[1]:
                        ok = 0
                    prev = r[1]
            if ok == 1:
                good = good + 1
    return [good, total]

def sorted_by_dept(rows):
    for i in range(0, len(rows) - 2+1):
        if rows[i][0] > rows[i + 1][0]:
            return False
    return True

def render(rows):
    s = ""
    for r in rows:
        if len(s) > 0:
            s = s + " "
        s = s + r[0] + "/" + r[1]
    return s

staff = [["ops", "rhea"], ["eng", "mira"], ["sales", "dana"], ["eng", "aki"], ["ops", "cleo"], ["sales", "bo"], ["eng", "zoe"], ["ops", "ali"], ["sales", "nia"]]
pass1 = by_name(staff)
print("after pass one, sorted by name:")
print("  " + render(pass1))
print("")
stable_out = by_dept_stable(pass1)
unstable_out = by_dept_unstable(pass1)
print("after pass two, sorted by department:")
print("  stable:   " + render(stable_out))
print("  unstable: " + render(unstable_out))
st = depts_in_order(stable_out)
un = depts_in_order(unstable_out)
print("")
print("departments whose names came out ordered:")
print("  stable second pass:   " + str(st[0]) + "/" + str(st[1]))
print("  unstable second pass: " + str(un[0]) + "/" + str(un[1]))
print("")
print("is the output sorted by department?")
print("  stable:   " + str(sorted_by_dept(stable_out)))
print("  unstable: " + str(sorted_by_dept(unstable_out)))
print("...both, which is why the defect gets shipped.")
print("")
same_multiset = 0
for r in staff:
    a = 0
    b = 0
    for x in stable_out:
        if x[0] == r[0] and x[1] == r[1]:
            a = a + 1
    for x in unstable_out:
        if x[0] == r[0] and x[1] == r[1]:
            b = b + 1
    if a == b and a == 1:
        same_multiset = same_multiset + 1
print("records present exactly once in both outputs: " + str(same_multiset) + "/" + str(len(staff)))
print("")
print("the same two passes over the first k records only:")
caught = 0
sizes = 0
for k in range(2, len(staff)+1):
    sizes = sizes + 1
    small = []
    for i in range(0, k):
        small = small + [staff[i]]
    p1 = by_name(small)
    u = depts_in_order(by_dept_unstable(p1))
    if u[0] < u[1]:
        caught = caught + 1
print("fixture sizes tried: " + str(sizes) + ", sizes where the defect is visible: " + str(caught))
passed = 0
checked = 0
checked = checked + 1
if st[0] == st[1]:
    passed = passed + 1
checked = checked + 1
if un[0] < un[1]:
    passed = passed + 1
checked = checked + 1
if sorted_by_dept(stable_out) and sorted_by_dept(unstable_out):
    passed = passed + 1
checked = checked + 1
if same_multiset == len(staff):
    passed = passed + 1
checked = checked + 1
if caught > 0 and caught < sizes:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Sorted by department in both arms, and only one kept the names in order."
else:
    verdict = "FAILED - a sort did not behave as the checks describe."
print(verdict)
print("")
n1 = "Stability is a promise about the records a sort considers EQUAL, which is"
print(n1)
n2 = "exactly the set of records the sort was not asked about. That is why it"
print(n2)
n3 = "reads as an implementation detail and why the two-pass idiom depends on"
print(n3)
n4 = "it entirely: the second sort is being asked to preserve an order it was"
print(n4)
n5 = "never told about."
print(n5)
```

## stdout (executed)

```text
after pass one, sorted by name:
  eng/aki ops/ali sales/bo ops/cleo sales/dana eng/mira sales/nia ops/rhea eng/zoe

after pass two, sorted by department:
  stable:   eng/aki eng/mira eng/zoe ops/ali ops/cleo ops/rhea sales/bo sales/dana sales/nia
  unstable: eng/aki eng/mira eng/zoe ops/cleo ops/ali ops/rhea sales/nia sales/dana sales/bo

departments whose names came out ordered:
  stable second pass:   3/3
  unstable second pass: 1/3

is the output sorted by department?
  stable:   True
  unstable: True
...both, which is why the defect gets shipped.

records present exactly once in both outputs: 9/9

the same two passes over the first k records only:
fixture sizes tried: 8, sizes where the defect is visible: 3

checks passed: 5/5
Sorted by department in both arms, and only one kept the names in order.

Stability is a promise about the records a sort considers EQUAL, which is
exactly the set of records the sort was not asked about. That is why it
reads as an implementation detail and why the two-pass idiom depends on
it entirely: the second sort is being asked to preserve an order it was
never told about.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
