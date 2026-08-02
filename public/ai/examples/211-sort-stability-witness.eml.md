<!-- canonical: efficientnewlanguage.org/ai/examples/211-sort-stability-witness | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 211 — Sorted is not the same as stable

`sort_stability_witness.eml` runs two insertion sorts that differ by one character, verifies both sort correctly, and shows only one of them is usable.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Stable versus
# unstable sorting, and why "the output is sorted" is not enough of a check.
#
# A sort is STABLE if records comparing equal come out in the order they went
# in. Both a stable and an unstable sort produce output in the right order by
# the key - the difference is only visible in the ties, and only if you look
# at something the comparison did not.
#
# It matters because the standard way to sort by two fields is to sort twice:
#
#     sort by department, then sort by name    -> WRONG
#     sort by name, then sort by department    -> right, IF the sort is stable
#
# With an unstable sort the second pass scrambles the first, and the result is
# still perfectly ordered by department - so it passes every "is it sorted?"
# check while the names inside each department are arbitrary.
#
# So this program checks something an order check cannot see: it tags every
# record with its original index, sorts, and verifies that within each group
# of equal keys the tags are still ascending. That is the definition of
# stability, made observable.
#
# Insertion sort is stable when the guard is `>` and unstable when it is `>=`.
# One character. Both versions are here, both are verified to sort correctly,
# and only one is stable.

def copy_of(rows):
    # `rows => out` binds the SAME list, it does not copy - and insertion sort
    # writes through its indices, so a sort written that way mutates its own
    # input. The first version of this program did exactly that, and the
    # second sort silently received the output of the first.
    [] => out
    for r in rows:
        out + [r] => out
    return out

def insertion_sort_stable(rows, key):
    # `>` stops shifting as soon as it meets an EQUAL element, so equal
    # records keep their relative order.
    copy_of(rows) => out
    1 => i
    while i < len(out):
        out[i] => current
        i - 1 => j
        while j >= 0 and out[j][key] > current[key]:
            out[j] => out[j + 1]
            j - 1 => j
        current => out[j + 1]
        i + 1 => i
    return out

def insertion_sort_unstable(rows, key):
    # `>=` keeps shifting past equals, which reverses ties. One character.
    copy_of(rows) => out
    1 => i
    while i < len(out):
        out[i] => current
        i - 1 => j
        while j >= 0 and out[j][key] >= current[key]:
            out[j] => out[j + 1]
            j - 1 => j
        current => out[j + 1]
        i + 1 => i
    return out

def is_sorted_by(rows, key):
    for i in [1:len(rows) - 1]:
        if rows[i - 1][key] > rows[i][key]:
            return False
    return True

def is_stable(rows, key):
    # Within each run of equal keys, the original tags must ascend.
    for i in [1:len(rows) - 1]:
        if rows[i - 1][key] == rows[i][key]:
            if rows[i - 1]["tag"] > rows[i]["tag"]:
                return False
    return True

def tagged(names, depts):
    [] => out
    for i in [0:len(names) - 1]:
        out + [{"name": names[i], "dept": depts[i], "tag": i}] => out
    return out

def render(rows):
    "" => line
    for r in rows:
        if len(line) > 0:
            line + "  " => line
        line + r["dept"] + ":" + r["name"] => line
    return line


["Ada", "Bo", "Cy", "Dee", "Eli", "Fay"] => names
["eng", "ops", "eng", "eng", "ops", "eng"] => depts
tagged(names, depts) => rows

("input:            " + render(rows))^0

# Sort by name first, then by department - the two-pass idiom.
insertion_sort_stable(insertion_sort_stable(rows, "name"), "dept") => stable_two_pass
insertion_sort_unstable(insertion_sort_unstable(rows, "name"), "dept") => unstable_two_pass

""^0
("stable two-pass:   " + render(stable_two_pass))^0
("unstable two-pass: " + render(unstable_two_pass))^0

""^0
("both sorted by dept:      " + str(is_sorted_by(stable_two_pass, "dept")) + " / " + str(is_sorted_by(unstable_two_pass, "dept")))^0
("names ordered within dept: " + str(is_sorted_by(stable_two_pass, "name") == False))^0

# The real question: are the names still in order inside each department?
def names_ordered_within_dept(rows):
    for i in [1:len(rows) - 1]:
        if rows[i - 1]["dept"] == rows[i]["dept"]:
            if rows[i - 1]["name"] > rows[i]["name"]:
                return False
    return True

""^0
("stable keeps names ordered within dept:   " + str(names_ordered_within_dept(stable_two_pass)))^0
("unstable keeps names ordered within dept: " + str(names_ordered_within_dept(unstable_two_pass)))^0

# ---------------------------------------------------------- wider sweep
# Every arrangement of a small multiset with many ties, so stability has
# somewhere to show.
0 => cases
0 => stable_sorted
0 => stable_stable
0 => unstable_sorted
0 => unstable_stable

["a", "b", "c"] => pool
for i in [0:2]:
    for j in [0:2]:
        for k in [0:2]:
            for m in [0:2]:
                cases + 1 => cases
                [pool[i], pool[j], pool[k], pool[m]] => keys
                [] => rs
                for t in [0:3]:
                    rs + [{"name": str(t), "dept": keys[t], "tag": t}] => rs

                insertion_sort_stable(rs, "dept") => s
                insertion_sort_unstable(rs, "dept") => u

                if is_sorted_by(s, "dept"):
                    stable_sorted + 1 => stable_sorted
                if is_stable(s, "dept"):
                    stable_stable + 1 => stable_stable
                if is_sorted_by(u, "dept"):
                    unstable_sorted + 1 => unstable_sorted
                if is_stable(u, "dept"):
                    unstable_stable + 1 => unstable_stable

""^0
("arrangements swept:        " + str(cases))^0
("stable version   sorted:   " + str(stable_sorted) + "/" + str(cases))^0
("stable version   stable:   " + str(stable_stable) + "/" + str(cases))^0
("unstable version sorted:   " + str(unstable_sorted) + "/" + str(cases))^0
("unstable version stable:   " + str(unstable_stable) + "/" + str(cases))^0

cases - unstable_stable => instability_shown

""^0
if stable_sorted == cases and stable_stable == cases and unstable_sorted == cases and instability_shown > 0:
    "Both sort correctly on every arrangement; only one preserves ties." => verdict
else:
    "FAILED - a sort produced the wrong order, or stability was not observable." => verdict
verdict^0

""^0
("Both versions are sorted in " + str(unstable_sorted) + "/" + str(cases) + " arrangements - an order check")^0
"cannot tell them apart at all. The difference appears only in the original" => n2
n2^0
"tags, which the comparison never looked at, and that is the whole reason" => n3
n3^0
"the tag has to be carried through the sort rather than inferred after it." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def copy_of(rows):
    out = []
    for r in rows:
        out = out + [r]
    return out

def insertion_sort_stable(rows, key):
    out = copy_of(rows)
    i = 1
    while i < len(out):
        current = out[i]
        j = i - 1
        while j >= 0 and out[j][key] > current[key]:
            out[j + 1] = out[j]
            j = j - 1
        out[j + 1] = current
        i = i + 1
    return out

def insertion_sort_unstable(rows, key):
    out = copy_of(rows)
    i = 1
    while i < len(out):
        current = out[i]
        j = i - 1
        while j >= 0 and out[j][key] >= current[key]:
            out[j + 1] = out[j]
            j = j - 1
        out[j + 1] = current
        i = i + 1
    return out

def is_sorted_by(rows, key):
    for i in range(1, len(rows)):
        if rows[i - 1][key] > rows[i][key]:
            return False
    return True

def is_stable(rows, key):
    for i in range(1, len(rows)):
        if rows[i - 1][key] == rows[i][key]:
            if rows[i - 1]["tag"] > rows[i]["tag"]:
                return False
    return True

def tagged(names, depts):
    out = []
    for i in range(0, len(names)):
        out = out + [{"name": names[i], "dept": depts[i], "tag": i}]
    return out

def render(rows):
    line = ""
    for r in rows:
        if len(line) > 0:
            line = line + "  "
        line = line + r["dept"] + ":" + r["name"]
    return line

names = ["Ada", "Bo", "Cy", "Dee", "Eli", "Fay"]
depts = ["eng", "ops", "eng", "eng", "ops", "eng"]
rows = tagged(names, depts)
print("input:            " + render(rows))
stable_two_pass = insertion_sort_stable(insertion_sort_stable(rows, "name"), "dept")
unstable_two_pass = insertion_sort_unstable(insertion_sort_unstable(rows, "name"), "dept")
print("")
print("stable two-pass:   " + render(stable_two_pass))
print("unstable two-pass: " + render(unstable_two_pass))
print("")
print("both sorted by dept:      " + str(is_sorted_by(stable_two_pass, "dept")) + " / " + str(is_sorted_by(unstable_two_pass, "dept")))
print("names ordered within dept: " + str(is_sorted_by(stable_two_pass, "name") == False))

def names_ordered_within_dept(rows):
    for i in range(1, len(rows)):
        if rows[i - 1]["dept"] == rows[i]["dept"]:
            if rows[i - 1]["name"] > rows[i]["name"]:
                return False
    return True

print("")
print("stable keeps names ordered within dept:   " + str(names_ordered_within_dept(stable_two_pass)))
print("unstable keeps names ordered within dept: " + str(names_ordered_within_dept(unstable_two_pass)))
cases = 0
stable_sorted = 0
stable_stable = 0
unstable_sorted = 0
unstable_stable = 0
pool = ["a", "b", "c"]
for i in range(0, 3):
    for j in range(0, 3):
        for k in range(0, 3):
            for m in range(0, 3):
                cases = cases + 1
                keys = [pool[i], pool[j], pool[k], pool[m]]
                rs = []
                for t in range(0, 4):
                    rs = rs + [{"name": str(t), "dept": keys[t], "tag": t}]
                s = insertion_sort_stable(rs, "dept")
                u = insertion_sort_unstable(rs, "dept")
                if is_sorted_by(s, "dept"):
                    stable_sorted = stable_sorted + 1
                if is_stable(s, "dept"):
                    stable_stable = stable_stable + 1
                if is_sorted_by(u, "dept"):
                    unstable_sorted = unstable_sorted + 1
                if is_stable(u, "dept"):
                    unstable_stable = unstable_stable + 1
print("")
print("arrangements swept:        " + str(cases))
print("stable version   sorted:   " + str(stable_sorted) + "/" + str(cases))
print("stable version   stable:   " + str(stable_stable) + "/" + str(cases))
print("unstable version sorted:   " + str(unstable_sorted) + "/" + str(cases))
print("unstable version stable:   " + str(unstable_stable) + "/" + str(cases))
instability_shown = cases - unstable_stable
print("")
if stable_sorted == cases and stable_stable == cases and unstable_sorted == cases and instability_shown > 0:
    verdict = "Both sort correctly on every arrangement; only one preserves ties."
else:
    verdict = "FAILED - a sort produced the wrong order, or stability was not observable."
print(verdict)
print("")
print("Both versions are sorted in " + str(unstable_sorted) + "/" + str(cases) + " arrangements - an order check")
n2 = "cannot tell them apart at all. The difference appears only in the original"
print(n2)
n3 = "tags, which the comparison never looked at, and that is the whole reason"
print(n3)
n4 = "the tag has to be carried through the sort rather than inferred after it."
print(n4)
```

## stdout (executed)

```text
input:            eng:Ada  ops:Bo  eng:Cy  eng:Dee  ops:Eli  eng:Fay

stable two-pass:   eng:Ada  eng:Cy  eng:Dee  eng:Fay  ops:Bo  ops:Eli
unstable two-pass: eng:Fay  eng:Dee  eng:Cy  eng:Ada  ops:Eli  ops:Bo

both sorted by dept:      True / True
names ordered within dept: True

stable keeps names ordered within dept:   True
unstable keeps names ordered within dept: False

arrangements swept:        81
stable version   sorted:   81/81
stable version   stable:   81/81
unstable version sorted:   81/81
unstable version stable:   0/81

Both sort correctly on every arrangement; only one preserves ties.

Both versions are sorted in 81/81 arrangements - an order check
cannot tell them apart at all. The difference appears only in the original
tags, which the comparison never looked at, and that is the whole reason
the tag has to be carried through the sort rather than inferred after it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
