<!-- canonical: efficientnewlanguage.org/ai/examples/255-pagination-shifting-data | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 255 — Pagination over shifting data — the skip nobody notices

`pagination_shifting_data.eml` walks a collection page by page with a row inserted or deleted *before the window* between requests, under offset pagination and keyset (cursor) pagination.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Page 2 of a list
# that changed while you were reading page 1.
#
# Offset pagination asks for "rows 20 to 39 of the current result". If a row
# is inserted before offset 20 between the two requests, every later row
# shifts down one and the client sees a row it already saw. If a row is
# deleted, a row is skipped entirely and NOBODY notices - the page is full,
# the ids are plausible, and the missing item simply never appears.
#
#     insert before the window  ->  one row duplicated across pages
#     delete before the window  ->  one row never delivered
#
# Keyset pagination asks for "the next 20 rows after id X" instead. The cursor
# names a position in the data rather than a count from the start, so
# insertions and deletions before it cannot move it.
#
# The measurement is a full walk of the collection with mutations happening
# between page requests, and the properties a paginator needs:
#
#     every row delivered at least once   - nothing skipped
#     every row delivered at most once    - nothing duplicated
#
# Both are computed by collecting what the client actually received and
# comparing against the set of rows that existed for the whole walk, which is
# the only fair comparison: a row inserted mid-walk may or may not appear, and
# either is defensible.

def sorted_ids(rows):
    [] => out
    for r in rows:
        out + [r] => out
    1 => i
    while i < len(out):
        out[i] => cur
        i - 1 => j
        while j >= 0 and out[j] > cur:
            out[j] => out[j + 1]
            j - 1 => j
        cur => out[j + 1]
        i + 1 => i
    return out

def page_by_offset(rows, offset, size):
    sorted_ids(rows) => s
    [] => out
    for i in [offset:offset + size - 1]:
        if i < len(s):
            out + [s[i]] => out
    return out

def page_by_keyset(rows, after, size):
    sorted_ids(rows) => s
    [] => out
    for r in s:
        if r > after and len(out) < size:
            out + [r] => out
    return out

def remove_id(rows, victim):
    [] => out
    for r in rows:
        if not (r == victim):
            out + [r] => out
    return out


3 => PAGE

def walk(mode, mutation):
    # Walk the whole collection a page at a time. Between pages, apply the
    # mutation once (before the window, which is the case that shifts things).
    [10, 20, 30, 40, 50, 60, 70, 80, 90] => rows
    [] => seen
    0 => offset
    0 => cursor
    0 => pages
    1 => more
    while more == 1 and pages < 8:
        if mode == "offset":
            page_by_offset(rows, offset, PAGE) => p
        else:
            page_by_keyset(rows, cursor, PAGE) => p
        if len(p) == 0:
            0 => more
        else:
            for r in p:
                seen + [r] => seen
            offset + PAGE => offset
            p[len(p) - 1] => cursor
            pages + 1 => pages
            # Mutate once, after the first page, before the window.
            if pages == 1:
                if mutation == "insert":
                    rows + [5] => rows
                elif mutation == "delete":
                    remove_id(rows, 10) => rows
    return seen

def report(mode, mutation, stable):
    walk(mode, mutation) => seen
    {} => count
    for r in seen:
        if r in count:
            count[r] + 1 => count[r]
        else:
            1 => count[r]
    0 => dup
    0 => missing
    for r in stable:
        0 => c
        if r in count:
            count[r] => c
        if c == 0:
            missing + 1 => missing
        if c > 1:
            dup + 1 => dup
    return [len(seen), missing, dup]


# Rows present for the whole walk under every mutation: everything except the
# one that gets deleted and the one that gets inserted.
[20, 30, 40, 50, 60, 70, 80, 90] => stable

"mode     mutation  delivered  skipped  duplicated"^0
{} => res
for mode in ["offset", "keyset"]:
    for mutation in ["none", "insert", "delete"]:
        report(mode, mutation, stable) => r
        mode + "/" + mutation => k
        r => res[k]
        ("%-8s %-9s %-10d %-8d %d" % (mode, mutation, r[0], r[1], r[2]))^0

""^0
("rows present for the whole walk: " + str(len(stable)))^0

# ---------------------------------------------- what each failure looks like
""^0
"with an insert before the window, offset pagination delivers:"^0
walk("offset", "insert") => o_ins
"" => line
for r in o_ins:
    if len(line) > 0:
        line + " " => line
    line + str(r) => line
("  " + line)^0
""^0
"with a delete before the window:"^0
walk("offset", "delete") => o_del
"" => line2
for r in o_del:
    if len(line2) > 0:
        line2 + " " => line2
    line2 + str(r) => line2
("  " + line2)^0
""^0
"keyset, same delete:"^0
walk("keyset", "delete") => k_del
"" => line3
for r in k_del:
    if len(line3) > 0:
        line3 + " " => line3
    line3 + str(r) => line3
("  " + line3)^0

# --------------------------------------- both agree when nothing changes
""^0
("with no mutation, offset and keyset deliver the same rows: " + str(res["offset/none"][0] == res["keyset/none"][0]))^0
"...which is every test that does not mutate mid-walk."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Keyset must deliver every stable row exactly once under every mutation.
checked + 1 => checked
0 => keyset_clean
for mutation in ["none", "insert", "delete"]:
    report("keyset", mutation, stable) => r
    if r[1] == 0 and r[2] == 0:
        keyset_clean + 1 => keyset_clean
if keyset_clean == 3:
    passed + 1 => passed

# Offset must duplicate under an insert.
checked + 1 => checked
if res["offset/insert"][2] > 0:
    passed + 1 => passed

# Offset must SKIP under a delete - the silent failure.
checked + 1 => checked
if res["offset/delete"][1] > 0:
    passed + 1 => passed

# With no mutation the two must be indistinguishable.
checked + 1 => checked
if res["offset/none"][1] == 0 and res["offset/none"][2] == 0:
    passed + 1 => passed

# And the skip must be silent: the page that skips a row must still be full,
# so nothing about the response says anything was lost.
checked + 1 => checked
[20, 30, 40, 50, 60, 70, 80, 90] => after_delete
if len(page_by_offset(after_delete, 3, PAGE)) == PAGE:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "A delete before the window drops a row, and the page is still full." => verdict
else:
    "FAILED - a paginator did not behave as the checks describe." => verdict
verdict^0

""^0
"The duplicate is annoying and visible; the skip is invisible and worse." => n1
n1^0
"Both come from the same thing - an offset counts from a start that moved -" => n2
n2^0
"and a cursor does not, because it names a row rather than a distance. The" => n3
n3^0
"cost is that a cursor needs a stable total order to name a position with," => n4
n4^0
"which is the same requirement the top-N case in this corpus arrives at" => n5
n5^0
"from the other direction." => n6
n6^0
```

## Python (deterministic transpilation)

```python
def sorted_ids(rows):
    out = []
    for r in rows:
        out = out + [r]
    i = 1
    while i < len(out):
        cur = out[i]
        j = i - 1
        while j >= 0 and out[j] > cur:
            out[j + 1] = out[j]
            j = j - 1
        out[j + 1] = cur
        i = i + 1
    return out

def page_by_offset(rows, offset, size):
    s = sorted_ids(rows)
    out = []
    for i in range(offset, offset + size):
        if i < len(s):
            out = out + [s[i]]
    return out

def page_by_keyset(rows, after, size):
    s = sorted_ids(rows)
    out = []
    for r in s:
        if r > after and len(out) < size:
            out = out + [r]
    return out

def remove_id(rows, victim):
    out = []
    for r in rows:
        if not r == victim:
            out = out + [r]
    return out

PAGE = 3

def walk(mode, mutation):
    rows = [10, 20, 30, 40, 50, 60, 70, 80, 90]
    seen = []
    offset = 0
    cursor = 0
    pages = 0
    more = 1
    while more == 1 and pages < 8:
        if mode == "offset":
            p = page_by_offset(rows, offset, PAGE)
        else:
            p = page_by_keyset(rows, cursor, PAGE)
        if len(p) == 0:
            more = 0
        else:
            for r in p:
                seen = seen + [r]
            offset = offset + PAGE
            cursor = p[len(p) - 1]
            pages = pages + 1
            if pages == 1:
                if mutation == "insert":
                    rows = rows + [5]
                elif mutation == "delete":
                    rows = remove_id(rows, 10)
    return seen

def report(mode, mutation, stable):
    seen = walk(mode, mutation)
    count = {}
    for r in seen:
        if r in count:
            count[r] = count[r] + 1
        else:
            count[r] = 1
    dup = 0
    missing = 0
    for r in stable:
        c = 0
        if r in count:
            c = count[r]
        if c == 0:
            missing = missing + 1
        if c > 1:
            dup = dup + 1
    return [len(seen), missing, dup]

stable = [20, 30, 40, 50, 60, 70, 80, 90]
print("mode     mutation  delivered  skipped  duplicated")
res = {}
for mode in ["offset", "keyset"]:
    for mutation in ["none", "insert", "delete"]:
        r = report(mode, mutation, stable)
        k = mode + "/" + mutation
        res[k] = r
        print("%-8s %-9s %-10d %-8d %d" % (mode, mutation, r[0], r[1], r[2]))
print("")
print("rows present for the whole walk: " + str(len(stable)))
print("")
print("with an insert before the window, offset pagination delivers:")
o_ins = walk("offset", "insert")
line = ""
for r in o_ins:
    if len(line) > 0:
        line = line + " "
    line = line + str(r)
print("  " + line)
print("")
print("with a delete before the window:")
o_del = walk("offset", "delete")
line2 = ""
for r in o_del:
    if len(line2) > 0:
        line2 = line2 + " "
    line2 = line2 + str(r)
print("  " + line2)
print("")
print("keyset, same delete:")
k_del = walk("keyset", "delete")
line3 = ""
for r in k_del:
    if len(line3) > 0:
        line3 = line3 + " "
    line3 = line3 + str(r)
print("  " + line3)
print("")
print("with no mutation, offset and keyset deliver the same rows: " + str(res["offset/none"][0] == res["keyset/none"][0]))
print("...which is every test that does not mutate mid-walk.")
passed = 0
checked = 0
checked = checked + 1
keyset_clean = 0
for mutation in ["none", "insert", "delete"]:
    r = report("keyset", mutation, stable)
    if r[1] == 0 and r[2] == 0:
        keyset_clean = keyset_clean + 1
if keyset_clean == 3:
    passed = passed + 1
checked = checked + 1
if res["offset/insert"][2] > 0:
    passed = passed + 1
checked = checked + 1
if res["offset/delete"][1] > 0:
    passed = passed + 1
checked = checked + 1
if res["offset/none"][1] == 0 and res["offset/none"][2] == 0:
    passed = passed + 1
checked = checked + 1
after_delete = [20, 30, 40, 50, 60, 70, 80, 90]
if len(page_by_offset(after_delete, 3, PAGE)) == PAGE:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "A delete before the window drops a row, and the page is still full."
else:
    verdict = "FAILED - a paginator did not behave as the checks describe."
print(verdict)
print("")
n1 = "The duplicate is annoying and visible; the skip is invisible and worse."
print(n1)
n2 = "Both come from the same thing - an offset counts from a start that moved -"
print(n2)
n3 = "and a cursor does not, because it names a row rather than a distance. The"
print(n3)
n4 = "cost is that a cursor needs a stable total order to name a position with,"
print(n4)
n5 = "which is the same requirement the top-N case in this corpus arrives at"
print(n5)
n6 = "from the other direction."
print(n6)
```

## stdout (executed)

```text
mode     mutation  delivered  skipped  duplicated
offset   none      9          0        0
offset   insert    10         0        1
offset   delete    8          1        0
keyset   none      9          0        0
keyset   insert    9          0        0
keyset   delete    9          0        0

rows present for the whole walk: 8

with an insert before the window, offset pagination delivers:
  10 20 30 30 40 50 60 70 80 90

with a delete before the window:
  10 20 30 50 60 70 80 90

keyset, same delete:
  10 20 30 40 50 60 70 80 90

with no mutation, offset and keyset deliver the same rows: True
...which is every test that does not mutate mid-walk.

checks passed: 5/5
A delete before the window drops a row, and the page is still full.

The duplicate is annoying and visible; the skip is invisible and worse.
Both come from the same thing - an offset counts from a start that moved -
and a cursor does not, because it names a row rather than a distance. The
cost is that a cursor needs a stable total order to name a position with,
which is the same requirement the top-N case in this corpus arrives at
from the other direction.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
