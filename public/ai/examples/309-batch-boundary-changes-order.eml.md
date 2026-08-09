<!-- canonical: efficientnewlanguage.org/ai/examples/309-batch-boundary-changes-order | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 309 — Batch boundary changes order — every batch was handled correctly and the answer was wrong

`batch_boundary_changes_order.eml` runs the same sort-and-dedup pipeline at seven batch sizes over twelve records and compares each result against the batch-free answer.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The batch size is
# a performance knob and it is also the width of the window every operation is
# allowed to look at.
#
# A pipeline reads records in batches because reading one at a time is slow.
# Inside the loop the batch is sorted, or deduplicated, or scanned for the
# largest item - operations written against "the records", by someone holding a
# variable that contains records. The variable contains SOME of the records.
#
# Nothing in the code says the batch is a partial view. It is a list, it is
# full, and every operation on it succeeds. What changes is which pairs of
# records are ever compared to each other: two records in different batches are
# never in the same list, so no within-batch operation can relate them.
#
# The measurement runs the same pipeline at several batch sizes and compares
# each result against the batch-free answer, then reports the property that
# makes this hard to notice: at batch size >= the input length the pipeline is
# correct, and that is the size every test fixture accidentally uses.

def sort_ints(xs):
    # Insertion sort - the language has no sorted().
    [] => out
    for x in xs:
        [] => nxt
        0 => placed
        for y in out:
            if placed == 0:
                if x < y:
                    nxt + [x] => nxt
                    1 => placed
            nxt + [y] => nxt
        if placed == 0:
            nxt + [x] => nxt
        nxt => out
    return out

def dedup(xs):
    [] => out
    for x in xs:
        0 => seen
        for y in out:
            if y == x:
                1 => seen
        if seen == 0:
            out + [x] => out
    return out

def batches(xs, size):
    [] => out
    0 => i
    while i < len(xs):
        out + [xs[i:i + size]] => out
        i + size => i
    return out

def pipeline(xs, size, op):
    # Read a batch, apply the operation to it, append. The shape of every
    # streaming job ever written.
    [] => out
    for b in batches(xs, size):
        if op == "sort":
            out + sort_ints(b) => out
        else:
            out + dedup(b) => out
    return out

def whole(xs, op):
    if op == "sort":
        return sort_ints(xs)
    return dedup(xs)

def is_sorted(xs):
    0 => i
    while i + 1 < len(xs):
        if xs[i + 1] < xs[i]:
            return 0
        i + 1 => i
    return 1

def same(a, b):
    if not (len(a) == len(b)):
        return 0
    0 => i
    while i < len(a):
        if not (a[i] == b[i]):
            return 0
        i + 1 => i
    return 1

[7, 3, 9, 1, 3, 8, 2, 9, 5, 4, 1, 6] => RECORDS
[1, 2, 3, 4, 6, 12, 20] => SIZES

("input: " + str(len(RECORDS)) + " records")^0
""^0
"op    batch  output                              matches the batch-free answer"^0
"----  -----  ----------------------------------  ----------------------------"^0

0 => runs
0 => wrong
{} => results
for op in ["sort", "dedup"]:
    whole(RECORDS, op) => truth
    for size in SIZES:
        pipeline(RECORDS, size, op) => got
        runs + 1 => runs
        same(got, truth) => ok
        if ok == 0:
            wrong + 1 => wrong
        [ok, len(got)] => results[op + "/" + str(size)]
        "" => shown
        for v in got:
            shown + str(v) + " " => shown
        ((op + "      ")[0:6] + (str(size) + "      ")[0:7] + (shown + "                                    ")[0:36] + str(ok == 1))^0

""^0
("runs: " + str(runs) + ", disagreeing with the batch-free answer: " + str(wrong))^0

""^0
"the size at which each operation becomes correct"^0
for op in ["sort", "dedup"]:
    0 => first_ok
    for size in SIZES:
        if results[op + "/" + str(size)][0] == 1:
            if first_ok == 0:
                size => first_ok
    ((op + "      ")[0:6] + " first correct at batch size " + str(first_ok) + " (input length is " + str(len(RECORDS)) + ")")^0

""^0
"what a within-batch operation cannot see"^0

# The mechanism, counted rather than described: how many PAIRS of records ever
# land in the same batch. Two records in different batches are never compared,
# whatever the operation is.
for size in SIZES:
    0 => pairs_together
    for b in batches(RECORDS, size):
        len(b) => n
        pairs_together + n * (n - 1) / 2 => pairs_together
    len(RECORDS) => m
    m * (m - 1) / 2 => all_pairs
    ((str(size) + "     ")[0:6] + " pairs in the same batch: " + str(int(pairs_together)) + " of " + str(int(all_pairs)))^0

""^0
"the sorted output is not sorted, and every batch is"^0
for size in [3, 4]:
    pipeline(RECORDS, size, "sort") => got
    0 => sorted_batches
    0 => total_batches
    for b in batches(RECORDS, size):
        total_batches + 1 => total_batches
        if is_sorted(sort_ints(b)) == 1:
            sorted_batches + 1 => sorted_batches
    ("batch " + str(size) + ": " + str(sorted_batches) + "/" + str(total_batches) + " batches internally sorted, whole output sorted: " + str(is_sorted(got) == 1))^0

""^0
0 => checked
0 => passed

# Small batches must give the wrong answer for both operations.
checked + 1 => checked
if results["sort/3"][0] == 0:
    if results["dedup/3"][0] == 0:
        passed + 1 => passed

# A batch at least as large as the input must give the right one - this is the
# configuration every fixture accidentally uses, and it is why the defect
# survives a test suite.
checked + 1 => checked
if results["sort/20"][0] == 1:
    if results["dedup/20"][0] == 1:
        passed + 1 => passed

# Every batch must be internally correct. The operation is not buggy; its
# input is partial.
checked + 1 => checked
0 => bad_batches
for b in batches(RECORDS, 3):
    if is_sorted(sort_ints(b)) == 0:
        bad_batches + 1 => bad_batches
if bad_batches == 0:
    passed + 1 => passed

# Dedup must lose duplicates that straddle a boundary, and the count must be
# derivable: the batched output is longer than the true one.
checked + 1 => checked
whole(RECORDS, "dedup") => truth_d
if results["dedup/3"][1] > len(truth_d):
    passed + 1 => passed

# Pair coverage must be strictly increasing in batch size and reach the total
# only when a batch holds everything - the mechanism, measured.
checked + 1 => checked
0 => monotone_breaks
0 => i
while i + 1 < len(SIZES):
    0 => a
    for b in batches(RECORDS, SIZES[i]):
        a + len(b) * (len(b) - 1) / 2 => a
    0 => c
    for b in batches(RECORDS, SIZES[i + 1]):
        c + len(b) * (len(b) - 1) / 2 => c
    if c < a:
        monotone_breaks + 1 => monotone_breaks
    i + 1 => i
if monotone_breaks == 0:
    passed + 1 => passed

# And the batch-free answer must itself be right, or the comparison is between
# two wrong things.
checked + 1 => checked
if is_sorted(whole(RECORDS, "sort")) == 1:
    if len(whole(RECORDS, "dedup")) == len(dedup(RECORDS)):
        passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Every batch was handled correctly and the answer was wrong." => verdict
else:
    "FAILED - the pipeline did not behave as the checks describe." => verdict
verdict^0

""^0
"Batch size is introduced as a performance parameter and it silently becomes"^0
"the width of every comparison the job is able to make. The operations inside"^0
"the loop are correct on the list they are given; nothing in a list says it is"^0
"a fragment. The fixture that would catch it has to be LONGER than the batch,"^0
"and fixtures are small on purpose."^0
```

## Python (deterministic transpilation)

```python
def sort_ints(xs):
    out = []
    for x in xs:
        nxt = []
        placed = 0
        for y in out:
            if placed == 0:
                if x < y:
                    nxt = nxt + [x]
                    placed = 1
            nxt = nxt + [y]
        if placed == 0:
            nxt = nxt + [x]
        out = nxt
    return out

def dedup(xs):
    out = []
    for x in xs:
        seen = 0
        for y in out:
            if y == x:
                seen = 1
        if seen == 0:
            out = out + [x]
    return out

def batches(xs, size):
    out = []
    i = 0
    while i < len(xs):
        out = out + [xs[i:i + size]]
        i = i + size
    return out

def pipeline(xs, size, op):
    out = []
    for b in batches(xs, size):
        if op == "sort":
            out = out + sort_ints(b)
        else:
            out = out + dedup(b)
    return out

def whole(xs, op):
    if op == "sort":
        return sort_ints(xs)
    return dedup(xs)

def is_sorted(xs):
    i = 0
    while i + 1 < len(xs):
        if xs[i + 1] < xs[i]:
            return 0
        i = i + 1
    return 1

def same(a, b):
    if not len(a) == len(b):
        return 0
    i = 0
    while i < len(a):
        if not a[i] == b[i]:
            return 0
        i = i + 1
    return 1

RECORDS = [7, 3, 9, 1, 3, 8, 2, 9, 5, 4, 1, 6]
SIZES = [1, 2, 3, 4, 6, 12, 20]
print("input: " + str(len(RECORDS)) + " records")
print("")
print("op    batch  output                              matches the batch-free answer")
print("----  -----  ----------------------------------  ----------------------------")
runs = 0
wrong = 0
results = {}
for op in ["sort", "dedup"]:
    truth = whole(RECORDS, op)
    for size in SIZES:
        got = pipeline(RECORDS, size, op)
        runs = runs + 1
        ok = same(got, truth)
        if ok == 0:
            wrong = wrong + 1
        results[op + "/" + str(size)] = [ok, len(got)]
        shown = ""
        for v in got:
            shown = shown + str(v) + " "
        print((op + "      ")[0:6] + (str(size) + "      ")[0:7] + (shown + "                                    ")[0:36] + str(ok == 1))
print("")
print("runs: " + str(runs) + ", disagreeing with the batch-free answer: " + str(wrong))
print("")
print("the size at which each operation becomes correct")
for op in ["sort", "dedup"]:
    first_ok = 0
    for size in SIZES:
        if results[op + "/" + str(size)][0] == 1:
            if first_ok == 0:
                first_ok = size
    print((op + "      ")[0:6] + " first correct at batch size " + str(first_ok) + " (input length is " + str(len(RECORDS)) + ")")
print("")
print("what a within-batch operation cannot see")
for size in SIZES:
    pairs_together = 0
    for b in batches(RECORDS, size):
        n = len(b)
        pairs_together = pairs_together + n * (n - 1) / 2
    m = len(RECORDS)
    all_pairs = m * (m - 1) / 2
    print((str(size) + "     ")[0:6] + " pairs in the same batch: " + str(int(pairs_together)) + " of " + str(int(all_pairs)))
print("")
print("the sorted output is not sorted, and every batch is")
for size in [3, 4]:
    got = pipeline(RECORDS, size, "sort")
    sorted_batches = 0
    total_batches = 0
    for b in batches(RECORDS, size):
        total_batches = total_batches + 1
        if is_sorted(sort_ints(b)) == 1:
            sorted_batches = sorted_batches + 1
    print("batch " + str(size) + ": " + str(sorted_batches) + "/" + str(total_batches) + " batches internally sorted, whole output sorted: " + str(is_sorted(got) == 1))
print("")
checked = 0
passed = 0
checked = checked + 1
if results["sort/3"][0] == 0:
    if results["dedup/3"][0] == 0:
        passed = passed + 1
checked = checked + 1
if results["sort/20"][0] == 1:
    if results["dedup/20"][0] == 1:
        passed = passed + 1
checked = checked + 1
bad_batches = 0
for b in batches(RECORDS, 3):
    if is_sorted(sort_ints(b)) == 0:
        bad_batches = bad_batches + 1
if bad_batches == 0:
    passed = passed + 1
checked = checked + 1
truth_d = whole(RECORDS, "dedup")
if results["dedup/3"][1] > len(truth_d):
    passed = passed + 1
checked = checked + 1
monotone_breaks = 0
i = 0
while i + 1 < len(SIZES):
    a = 0
    for b in batches(RECORDS, SIZES[i]):
        a = a + len(b) * (len(b) - 1) / 2
    c = 0
    for b in batches(RECORDS, SIZES[i + 1]):
        c = c + len(b) * (len(b) - 1) / 2
    if c < a:
        monotone_breaks = monotone_breaks + 1
    i = i + 1
if monotone_breaks == 0:
    passed = passed + 1
checked = checked + 1
if is_sorted(whole(RECORDS, "sort")) == 1:
    if len(whole(RECORDS, "dedup")) == len(dedup(RECORDS)):
        passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Every batch was handled correctly and the answer was wrong."
else:
    verdict = "FAILED - the pipeline did not behave as the checks describe."
print(verdict)
print("")
print("Batch size is introduced as a performance parameter and it silently becomes")
print("the width of every comparison the job is able to make. The operations inside")
print("the loop are correct on the list they are given; nothing in a list says it is")
print("a fragment. The fixture that would catch it has to be LONGER than the batch,")
print("and fixtures are small on purpose.")
```

## stdout (executed)

```text
input: 12 records

op    batch  output                              matches the batch-free answer
----  -----  ----------------------------------  ----------------------------
sort  1      7 3 9 1 3 8 2 9 5 4 1 6             False
sort  2      3 7 1 9 3 8 2 9 4 5 1 6             False
sort  3      3 7 9 1 3 8 2 5 9 1 4 6             False
sort  4      1 3 7 9 2 3 8 9 1 4 5 6             False
sort  6      1 3 3 7 8 9 1 2 4 5 6 9             False
sort  12     1 1 2 3 3 4 5 6 7 8 9 9             True
sort  20     1 1 2 3 3 4 5 6 7 8 9 9             True
dedup 1      7 3 9 1 3 8 2 9 5 4 1 6             False
dedup 2      7 3 9 1 3 8 2 9 5 4 1 6             False
dedup 3      7 3 9 1 3 8 2 9 5 4 1 6             False
dedup 4      7 3 9 1 3 8 2 9 5 4 1 6             False
dedup 6      7 3 9 1 8 2 9 5 4 1 6               False
dedup 12     7 3 9 1 8 2 5 4 6                   True
dedup 20     7 3 9 1 8 2 5 4 6                   True

runs: 14, disagreeing with the batch-free answer: 10

the size at which each operation becomes correct
sort   first correct at batch size 12 (input length is 12)
dedup  first correct at batch size 12 (input length is 12)

what a within-batch operation cannot see
1      pairs in the same batch: 0 of 66
2      pairs in the same batch: 6 of 66
3      pairs in the same batch: 12 of 66
4      pairs in the same batch: 18 of 66
6      pairs in the same batch: 30 of 66
12     pairs in the same batch: 66 of 66
20     pairs in the same batch: 66 of 66

the sorted output is not sorted, and every batch is
batch 3: 4/4 batches internally sorted, whole output sorted: False
batch 4: 3/3 batches internally sorted, whole output sorted: False

checks passed: 6/6
Every batch was handled correctly and the answer was wrong.

Batch size is introduced as a performance parameter and it silently becomes
the width of every comparison the job is able to make. The operations inside
the loop are correct on the list they are given; nothing in a list says it is
a fragment. The fixture that would catch it has to be LONGER than the batch,
and fixtures are small on purpose.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
