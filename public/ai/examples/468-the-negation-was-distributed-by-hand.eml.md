<!-- canonical: efficientnewlanguage.org/ai/examples/468-the-negation-was-distributed-by-hand | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 468 — The negation was distributed by hand

`the_negation_was_distributed_by_hand.eml` - A condition was inverted to turn a skip into a keep. Which inputs the inverted form treats differently is enumerated below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A condition was
# inverted to turn a skip into a keep. Which inputs the inverted form treats
# differently is enumerated below.
#
# Rewriting `if not (a and b): skip` as `if not a and not b: skip` is the kind
# of edit that gets made while cleaning up a nested block, and the new form is
# shorter and reads as the same sentence in English. On the inputs anybody
# tries by hand it usually agrees.
#
# The negation of an `and` is an `or` of the negations. Distributing it as an
# `and` produces a strictly narrower condition, so it skips fewer things - and
# the cases it stops skipping are the ones where exactly one clause failed.
#
# All four combinations are enumerated, and then counted over real records.

[[1, 1], [1, 0], [0, 1], [0, 0]] => rows

def is_true(v):
    if v == 1:
        return 1
    return 0

"a   b   not (a and b)   (not a) and (not b)   agree" ^0
0 => agree
0 => total
for r in rows:
    r[0] => a
    r[1] => b
    0 => correct
    if a == 1:
        if b == 1:
            0 => correct
        else:
            1 => correct
    else:
        1 => correct
    0 => distributed
    if a == 0:
        if b == 0:
            1 => distributed
    total + 1 => total
    "" => mark
    if correct == distributed:
        agree + 1 => agree
        mark + "yes" => mark
    else:
        mark + "NO " => mark
    "  " + str(a) + "   " + str(b) + "   " + str(correct) + "               " + str(distributed) + "                     " + mark ^0
"" ^0
"combinations where they agree : " + str(agree) + " of " + str(total) ^0
if agree < total:
    "  they part company exactly where one clause holds and the other does not" ^0
"" ^0

# ---- over real records ----
#
# The four combinations are not equally common. What the edit costs depends on
# how often exactly one clause fails, which is a property of the data.

# [record, has a signature, is within the window]
[["r1", 1, 1], ["r2", 1, 0], ["r3", 1, 1], ["r4", 0, 1], ["r5", 1, 1], ["r6", 1, 0], ["r7", 0, 0], ["r8", 1, 1], ["r9", 0, 1], ["r10", 1, 0]] => records

len(records) => n
0 => skip_correct
0 => skip_distributed
for r in records:
    0 => c
    if r[1] == 1:
        if r[2] == 1:
            0 => c
        else:
            1 => c
    else:
        1 => c
    0 => d
    if r[1] == 0:
        if r[2] == 0:
            1 => d
    skip_correct + c => skip_correct
    skip_distributed + d => skip_distributed

"records : " + str(n) ^0
"  skipped by the correct form     : " + str(skip_correct) ^0
"  skipped by the distributed form : " + str(skip_distributed) ^0
if skip_correct > skip_distributed:
    "  the edit lets " + str(skip_correct - skip_distributed) + " records through that should have been skipped" ^0
"" ^0

"the records that changed" ^0
for r in records:
    0 => c
    if r[1] == 1:
        if r[2] == 1:
            0 => c
        else:
            1 => c
    else:
        1 => c
    0 => d
    if r[1] == 0:
        if r[2] == 0:
            1 => d
    if not (c == d):
        "" => why
        if r[1] == 1:
            "signed but outside the window" => why
        else:
            "unsigned but inside the window" => why
        "  " + r[0] + " : " + why ^0
"  each is a record failing exactly one of the two requirements" ^0
"" ^0

# ---- why it survives review ----

0 => both_fail
for r in records:
    if r[1] == 0:
        if r[2] == 0:
            both_fail + 1 => both_fail
0 => both_pass
for r in records:
    if r[1] == 1:
        if r[2] == 1:
            both_pass + 1 => both_pass
"records where both clauses agree with each other : " + str(both_pass + both_fail) + " of " + str(n) ^0
if both_pass + both_fail > 0:
    "  on every one of those the two forms return the same answer, so a" ^0
    "  spot check that happens to pick them confirms the edit" ^0
"" ^0

# ---- the form that is actually equivalent ----

"the correct distribution" ^0
"  not (a and b) is (not a) OR (not b)" ^0
0 => or_form
for r in records:
    0 => d
    if r[1] == 0:
        1 => d
    if r[2] == 0:
        1 => d
    or_form + d => or_form
"  records skipped by the or form : " + str(or_form) ^0
if or_form == skip_correct:
    "  the same " + str(skip_correct) + " as the original, on every record" ^0
"" ^0

# ---- the control: data where the clauses never disagree ----
#
# Where every record either satisfies both requirements or neither, the two
# forms are the same function on that data.

[["s1", 1, 1], ["s2", 0, 0], ["s3", 1, 1]] => aligned
0 => a_correct
0 => a_dist
for r in aligned:
    0 => c
    if r[1] == 1:
        if r[2] == 1:
            0 => c
        else:
            1 => c
    else:
        1 => c
    0 => d
    if r[1] == 0:
        if r[2] == 0:
            1 => d
    a_correct + c => a_correct
    a_dist + d => a_dist
"control - records that satisfy both requirements or neither" ^0
"  correct form skips " + str(a_correct) + ", distributed form skips " + str(a_dist) ^0
if a_correct == a_dist:
    "  identical, so a suite built from data like this cannot catch the edit" ^0
"" ^0

"The rewritten condition is shorter and reads as the same sentence. It is a" ^0
"narrower condition, and the records it stops skipping are the ones that" ^0
"failed one requirement rather than both." ^0
```

## Python (deterministic transpilation)

```python
rows = [[1, 1], [1, 0], [0, 1], [0, 0]]

def is_true(v):
    if v == 1:
        return 1
    return 0

print("a   b   not (a and b)   (not a) and (not b)   agree")
agree = 0
total = 0
for r in rows:
    a = r[0]
    b = r[1]
    correct = 0
    if a == 1:
        if b == 1:
            correct = 0
        else:
            correct = 1
    else:
        correct = 1
    distributed = 0
    if a == 0:
        if b == 0:
            distributed = 1
    total = total + 1
    mark = ""
    if correct == distributed:
        agree = agree + 1
        mark = mark + "yes"
    else:
        mark = mark + "NO "
    print("  " + str(a) + "   " + str(b) + "   " + str(correct) + "               " + str(distributed) + "                     " + mark)
print("")
print("combinations where they agree : " + str(agree) + " of " + str(total))
if agree < total:
    print("  they part company exactly where one clause holds and the other does not")
print("")
records = [["r1", 1, 1], ["r2", 1, 0], ["r3", 1, 1], ["r4", 0, 1], ["r5", 1, 1], ["r6", 1, 0], ["r7", 0, 0], ["r8", 1, 1], ["r9", 0, 1], ["r10", 1, 0]]
n = len(records)
skip_correct = 0
skip_distributed = 0
for r in records:
    c = 0
    if r[1] == 1:
        if r[2] == 1:
            c = 0
        else:
            c = 1
    else:
        c = 1
    d = 0
    if r[1] == 0:
        if r[2] == 0:
            d = 1
    skip_correct = skip_correct + c
    skip_distributed = skip_distributed + d
print("records : " + str(n))
print("  skipped by the correct form     : " + str(skip_correct))
print("  skipped by the distributed form : " + str(skip_distributed))
if skip_correct > skip_distributed:
    print("  the edit lets " + str(skip_correct - skip_distributed) + " records through that should have been skipped")
print("")
print("the records that changed")
for r in records:
    c = 0
    if r[1] == 1:
        if r[2] == 1:
            c = 0
        else:
            c = 1
    else:
        c = 1
    d = 0
    if r[1] == 0:
        if r[2] == 0:
            d = 1
    if not c == d:
        why = ""
        if r[1] == 1:
            why = "signed but outside the window"
        else:
            why = "unsigned but inside the window"
        print("  " + r[0] + " : " + why)
print("  each is a record failing exactly one of the two requirements")
print("")
both_fail = 0
for r in records:
    if r[1] == 0:
        if r[2] == 0:
            both_fail = both_fail + 1
both_pass = 0
for r in records:
    if r[1] == 1:
        if r[2] == 1:
            both_pass = both_pass + 1
print("records where both clauses agree with each other : " + str(both_pass + both_fail) + " of " + str(n))
if both_pass + both_fail > 0:
    print("  on every one of those the two forms return the same answer, so a")
    print("  spot check that happens to pick them confirms the edit")
print("")
print("the correct distribution")
print("  not (a and b) is (not a) OR (not b)")
or_form = 0
for r in records:
    d = 0
    if r[1] == 0:
        d = 1
    if r[2] == 0:
        d = 1
    or_form = or_form + d
print("  records skipped by the or form : " + str(or_form))
if or_form == skip_correct:
    print("  the same " + str(skip_correct) + " as the original, on every record")
print("")
aligned = [["s1", 1, 1], ["s2", 0, 0], ["s3", 1, 1]]
a_correct = 0
a_dist = 0
for r in aligned:
    c = 0
    if r[1] == 1:
        if r[2] == 1:
            c = 0
        else:
            c = 1
    else:
        c = 1
    d = 0
    if r[1] == 0:
        if r[2] == 0:
            d = 1
    a_correct = a_correct + c
    a_dist = a_dist + d
print("control - records that satisfy both requirements or neither")
print("  correct form skips " + str(a_correct) + ", distributed form skips " + str(a_dist))
if a_correct == a_dist:
    print("  identical, so a suite built from data like this cannot catch the edit")
print("")
print("The rewritten condition is shorter and reads as the same sentence. It is a")
print("narrower condition, and the records it stops skipping are the ones that")
print("failed one requirement rather than both.")
```

## stdout (executed)

```text
a   b   not (a and b)   (not a) and (not b)   agree
  1   1   0               0                     yes
  1   0   1               0                     NO 
  0   1   1               0                     NO 
  0   0   1               1                     yes

combinations where they agree : 2 of 4
  they part company exactly where one clause holds and the other does not

records : 10
  skipped by the correct form     : 6
  skipped by the distributed form : 1
  the edit lets 5 records through that should have been skipped

the records that changed
  r2 : signed but outside the window
  r4 : unsigned but inside the window
  r6 : signed but outside the window
  r9 : unsigned but inside the window
  r10 : signed but outside the window
  each is a record failing exactly one of the two requirements

records where both clauses agree with each other : 5 of 10
  on every one of those the two forms return the same answer, so a
  spot check that happens to pick them confirms the edit

the correct distribution
  not (a and b) is (not a) OR (not b)
  records skipped by the or form : 6
  the same 6 as the original, on every record

control - records that satisfy both requirements or neither
  correct form skips 1, distributed form skips 1
  identical, so a suite built from data like this cannot catch the edit

The rewritten condition is shorter and reads as the same sentence. It is a
narrower condition, and the records it stops skipping are the ones that
failed one requirement rather than both.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:run:done
