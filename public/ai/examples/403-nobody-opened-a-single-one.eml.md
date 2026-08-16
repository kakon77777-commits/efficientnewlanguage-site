<!-- canonical: efficientnewlanguage.org/ai/examples/403-nobody-opened-a-single-one | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 403 — Nobody opened a single one - 2 records show what the summary has no column for

`nobody_opened_a_single_one.eml` computes the summary and a small sample from the same rows, and checks whether the extra field is redundant with the categories rather than assuming it.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The summary is
# accurate over every record it covers. Opening a handful of them says
# something the summary has no field for, and how few is computed below.
#
# Summarising is not laziness - nobody reads every record every week, and the
# summary was built so that the weekly review could happen at all. Every number
# in it is correct.
#
# A summary reports the columns it was given. The pattern here lives in a
# column the schema does not have, and the only place it is visible is in the
# records themselves, which the summary exists to avoid reading.
#
# Both the summary and a four-record sample are computed from the same rows.

# [id, category, minutes, note]
[["r1", "timeout", 12, "vendor A"], ["r2", "timeout", 9, "vendor A"], ["r3", "parse", 4, "self"], ["r4", "timeout", 15, "vendor A"], ["r5", "auth", 7, "self"], ["r6", "timeout", 11, "vendor A"], ["r7", "parse", 5, "self"], ["r8", "timeout", 13, "vendor A"], ["r9", "auth", 6, "self"], ["r10", "timeout", 10, "vendor A"], ["r11", "parse", 3, "self"], ["r12", "timeout", 14, "vendor A"]] => records

["timeout", "parse", "auth"] => categories

def count(c):
    0 => n
    for r in records:
        if r[1] == c:
            n + 1 => n
    return n

def minutes(c):
    0 => t
    for r in records:
        if r[1] == c:
            t + r[2] => t
    return t

"the weekly summary" ^0
"  records : " + str(len(records)) ^0
for c in categories:
    "  " + c + " : " + str(count(c)) + " records, " + str(minutes(c)) + " minutes" ^0
0 => total
for r in records:
    total + r[2] => total
"  total minutes : " + str(total) ^0
"" ^0

# ---- reading four records ----

"four records, opened" ^0
0 => shown
for r in records:
    if shown < 4:
        "  " + r[0] + " : " + r[1] + ", " + str(r[2]) + " min, note: " + r[3] ^0
        shown + 1 => shown
"" ^0

# ---- the pattern the summary cannot express ----

[] => notes
for r in records:
    0 => have
    for n in notes:
        if n == r[3]:
            1 => have
    if have == 0:
        notes + [r[3]] => notes

"grouping by the note field, which the summary does not carry" ^0
for n in notes:
    0 => c
    0 => m
    for r in records:
        if r[3] == n:
            c + 1 => c
            m + r[2] => m
    "  " + n + " : " + str(c) + " records, " + str(m) + " minutes  (" + str(int(m * 100 / total)) + "% of the total)" ^0
"" ^0

# ---- is the note field redundant with the category ----
#
# If every record with a given note has the same category, the summary already
# encodes it. That is checked rather than assumed.

0 => redundant
for n in notes:
    "" => first
    1 => same
    for r in records:
        if r[3] == n:
            if len(first) == 0:
                r[1] => first
            else:
                if not (r[1] == first):
                    0 => same
    if same == 1:
        redundant + 1 => redundant
"  notes whose records all share one category : " + str(redundant) + " of " + str(len(notes)) ^0
if redundant == len(notes):
    "  every note maps to one category, so the summary already encodes it" ^0
else:
    "  at least one note spans several categories, so its grouping is one the" ^0
    "  summary lists separately and cannot recombine" ^0
"" ^0

# ---- what each view supports ----

"what each view can answer" ^0
"  which category costs the most minutes : summary, " + str(minutes("timeout")) + " for timeout" ^0
"  who to call about it                  : not in the summary" ^0
0 => vendor_min
for r in records:
    if r[3] == "vendor A":
        vendor_min + r[2] => vendor_min
"  minutes attributable to one outside party    : " + str(vendor_min) + "  (" + str(int(vendor_min * 100 / total)) + "%)" ^0
"" ^0

# ---- how many records it takes ----

"how many records have to be opened before the pattern is visible" ^0
0 => seen_vendor
0 => opened
for r in records:
    if seen_vendor < 2:
        opened + 1 => opened
        if r[3] == "vendor A":
            seen_vendor + 1 => seen_vendor
"  records opened before the same note appears twice : " + str(opened) ^0
"  records in the summary : " + str(len(records)) ^0
"" ^0

# ---- the control: a week where the note adds nothing ----

[["s1", "timeout", 10, "vendor A"], ["s2", "parse", 4, "self"], ["s3", "auth", 6, "vendor B"], ["s4", "timeout", 9, "vendor C"]] => spread
0 => sp_total
for r in spread:
    sp_total + r[2] => sp_total
0 => biggest_note
for r in spread:
    0 => m
    for q in spread:
        if q[3] == r[3]:
            m + q[2] => m
    if m > biggest_note:
        m => biggest_note
"control - a week where no note repeats" ^0
"  largest share held by one note : " + str(int(biggest_note * 100 / sp_total)) + "%" ^0
if int(biggest_note * 100 / sp_total) < 50:
    "  here the records hold nothing the summary is hiding" ^0
"" ^0

"The summary is accurate and complete over the columns it has. Which columns" ^0
"it has was decided before anyone knew what this week would contain." ^0
```

## Python (deterministic transpilation)

```python
records = [["r1", "timeout", 12, "vendor A"], ["r2", "timeout", 9, "vendor A"], ["r3", "parse", 4, "self"], ["r4", "timeout", 15, "vendor A"], ["r5", "auth", 7, "self"], ["r6", "timeout", 11, "vendor A"], ["r7", "parse", 5, "self"], ["r8", "timeout", 13, "vendor A"], ["r9", "auth", 6, "self"], ["r10", "timeout", 10, "vendor A"], ["r11", "parse", 3, "self"], ["r12", "timeout", 14, "vendor A"]]
categories = ["timeout", "parse", "auth"]

def count(c):
    n = 0
    for r in records:
        if r[1] == c:
            n = n + 1
    return n

def minutes(c):
    t = 0
    for r in records:
        if r[1] == c:
            t = t + r[2]
    return t

print("the weekly summary")
print("  records : " + str(len(records)))
for c in categories:
    print("  " + c + " : " + str(count(c)) + " records, " + str(minutes(c)) + " minutes")
total = 0
for r in records:
    total = total + r[2]
print("  total minutes : " + str(total))
print("")
print("four records, opened")
shown = 0
for r in records:
    if shown < 4:
        print("  " + r[0] + " : " + r[1] + ", " + str(r[2]) + " min, note: " + r[3])
        shown = shown + 1
print("")
notes = []
for r in records:
    have = 0
    for n in notes:
        if n == r[3]:
            have = 1
    if have == 0:
        notes = notes + [r[3]]
print("grouping by the note field, which the summary does not carry")
for n in notes:
    c = 0
    m = 0
    for r in records:
        if r[3] == n:
            c = c + 1
            m = m + r[2]
    print("  " + n + " : " + str(c) + " records, " + str(m) + " minutes  (" + str(int(m * 100 / total)) + "% of the total)")
print("")
redundant = 0
for n in notes:
    first = ""
    same = 1
    for r in records:
        if r[3] == n:
            if len(first) == 0:
                first = r[1]
            elif not r[1] == first:
                same = 0
    if same == 1:
        redundant = redundant + 1
print("  notes whose records all share one category : " + str(redundant) + " of " + str(len(notes)))
if redundant == len(notes):
    print("  every note maps to one category, so the summary already encodes it")
else:
    print("  at least one note spans several categories, so its grouping is one the")
    print("  summary lists separately and cannot recombine")
print("")
print("what each view can answer")
print("  which category costs the most minutes : summary, " + str(minutes("timeout")) + " for timeout")
print("  who to call about it                  : not in the summary")
vendor_min = 0
for r in records:
    if r[3] == "vendor A":
        vendor_min = vendor_min + r[2]
print("  minutes attributable to one outside party    : " + str(vendor_min) + "  (" + str(int(vendor_min * 100 / total)) + "%)")
print("")
print("how many records have to be opened before the pattern is visible")
seen_vendor = 0
opened = 0
for r in records:
    if seen_vendor < 2:
        opened = opened + 1
        if r[3] == "vendor A":
            seen_vendor = seen_vendor + 1
print("  records opened before the same note appears twice : " + str(opened))
print("  records in the summary : " + str(len(records)))
print("")
spread = [["s1", "timeout", 10, "vendor A"], ["s2", "parse", 4, "self"], ["s3", "auth", 6, "vendor B"], ["s4", "timeout", 9, "vendor C"]]
sp_total = 0
for r in spread:
    sp_total = sp_total + r[2]
biggest_note = 0
for r in spread:
    m = 0
    for q in spread:
        if q[3] == r[3]:
            m = m + q[2]
    if m > biggest_note:
        biggest_note = m
print("control - a week where no note repeats")
print("  largest share held by one note : " + str(int(biggest_note * 100 / sp_total)) + "%")
if int(biggest_note * 100 / sp_total) < 50:
    print("  here the records hold nothing the summary is hiding")
print("")
print("The summary is accurate and complete over the columns it has. Which columns")
print("it has was decided before anyone knew what this week would contain.")
```

## stdout (executed)

```text
the weekly summary
  records : 12
  timeout : 7 records, 84 minutes
  parse : 3 records, 12 minutes
  auth : 2 records, 13 minutes
  total minutes : 109

four records, opened
  r1 : timeout, 12 min, note: vendor A
  r2 : timeout, 9 min, note: vendor A
  r3 : parse, 4 min, note: self
  r4 : timeout, 15 min, note: vendor A

grouping by the note field, which the summary does not carry
  vendor A : 7 records, 84 minutes  (77% of the total)
  self : 5 records, 25 minutes  (22% of the total)

  notes whose records all share one category : 1 of 2
  at least one note spans several categories, so its grouping is one the
  summary lists separately and cannot recombine

what each view can answer
  which category costs the most minutes : summary, 84 for timeout
  who to call about it                  : not in the summary
  minutes attributable to one outside party    : 84  (77%)

how many records have to be opened before the pattern is visible
  records opened before the same note appears twice : 2
  records in the summary : 12

control - a week where no note repeats
  largest share held by one note : 34%
  here the records hold nothing the summary is hiding

The summary is accurate and complete over the columns it has. Which columns
it has was decided before anyone knew what this week would contain.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
