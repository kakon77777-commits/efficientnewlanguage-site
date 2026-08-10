<!-- canonical: efficientnewlanguage.org/ai/examples/330-order-decides-which-defect-you-find | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 330 — Order decides which defect you find — two real bugs, one ticket

`order_decides_which_defect_you_find.eml` runs seven batches through two validation stages in both orders and counts what gets reported.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two stages, two
# real defects, and a bug tracker whose contents are decided by pipeline order.
#
# The first stage rejects batches longer than five. The second rejects batches
# containing a negative. Both limits are real and both are wrong in the same
# way - they were meant to be warnings and they reject. Which one gets reported
# for a given batch is not a property of the batch. It is a property of which
# stage sees it first.
#
# So the defect that gets filed, discussed and fixed is the one upstream, and
# the downstream one accumulates witnesses it never receives. Fix the first and
# a wave of "new" failures appears that were always there.
#
# The measurement runs the same batches through both orders and counts where
# the reported cause differs, then counts how many reports would appear if the
# first defect were fixed.

def stage_length(batch):
    if len(batch) > 5:
        return "LENGTH"
    return "ok"

def stage_negative(batch):
    for v in batch:
        if v < 0:
            return "NEGATIVE"
    return "ok"

def run_order(batch, first):
    if first == "length":
        stage_length(batch) => a
        if a != "ok":
            return a
        return stage_negative(batch)
    stage_negative(batch) => b
    if b != "ok":
        return b
    return stage_length(batch)

[[1, 2, 3], [1, 2, 3, 4, 5, 6], [1, 0 - 2, 3], [1, 2, 0 - 3, 4, 5, 6], [4, 5], [0 - 1, 2, 3, 4, 5, 6, 7], [9, 9, 9, 9, 9, 9]] => batches

"the same batches, both pipeline orders" ^0
0 => differ
0 => both_faults
for b in batches:
    run_order(b, "length") => r1
    run_order(b, "negative") => r2
    if r1 != r2:
        differ + 1 => differ
    if stage_length(b) != "ok":
        if stage_negative(b) != "ok":
            both_faults + 1 => both_faults
    "  " + repr(b) + "  length-first " + r1 + "  negative-first " + r2 ^0
"" ^0
"batches whose reported cause depends on order : " + str(differ) + " of " + str(len(batches)) ^0
"batches that violate BOTH rules               : " + str(both_faults) ^0
"" ^0

# ---- what the tracker holds, per order ----

def tally(order, tag):
    0 => n
    for b in batches:
        if run_order(b, order) == tag:
            n + 1 => n
    return n

"reports filed, by order" ^0
"  length-first   : LENGTH " + str(tally("length", "LENGTH")) + "  NEGATIVE " + str(tally("length", "NEGATIVE")) ^0
"  negative-first : LENGTH " + str(tally("negative", "LENGTH")) + "  NEGATIVE " + str(tally("negative", "NEGATIVE")) ^0
"" ^0

# ---- fix the upstream one and count what surfaces ----

0 => before
0 => after
for b in batches:
    if run_order(b, "length") == "NEGATIVE":
        before + 1 => before
    if stage_negative(b) != "ok":
        after + 1 => after
"NEGATIVE reports visible while the length rule runs first : " + str(before) ^0
"NEGATIVE reports once the length rule is fixed            : " + str(after) ^0
"batches that were always failing and never reported       : " + str(after - before) ^0
"" ^0

# ---- neither stage is wrong about its own subject ----

0 => len_correct
0 => neg_correct
for b in batches:
    if len(b) > 5:
        if stage_length(b) == "LENGTH":
            len_correct + 1 => len_correct
    else:
        if stage_length(b) == "ok":
            len_correct + 1 => len_correct
    0 => has_neg
    for v in b:
        if v < 0:
            1 => has_neg
    if has_neg == 1:
        if stage_negative(b) == "NEGATIVE":
            neg_correct + 1 => neg_correct
    else:
        if stage_negative(b) == "ok":
            neg_correct + 1 => neg_correct
"each stage, judged only on its own rule" ^0
"  length rule correct on   : " + str(len_correct) + " of " + str(len(batches)) ^0
"  negative rule correct on : " + str(neg_correct) + " of " + str(len(batches)) ^0
"" ^0
"Both stages are right about their own subject on every batch. What order" ^0
"decides is not correctness - it is which failure is observable, and an" ^0
"unobservable failure produces no ticket, no owner and no fix." ^0
```

## Python (deterministic transpilation)

```python
def stage_length(batch):
    if len(batch) > 5:
        return "LENGTH"
    return "ok"

def stage_negative(batch):
    for v in batch:
        if v < 0:
            return "NEGATIVE"
    return "ok"

def run_order(batch, first):
    if first == "length":
        a = stage_length(batch)
        if a != "ok":
            return a
        return stage_negative(batch)
    b = stage_negative(batch)
    if b != "ok":
        return b
    return stage_length(batch)

batches = [[1, 2, 3], [1, 2, 3, 4, 5, 6], [1, 0 - 2, 3], [1, 2, 0 - 3, 4, 5, 6], [4, 5], [0 - 1, 2, 3, 4, 5, 6, 7], [9, 9, 9, 9, 9, 9]]
print("the same batches, both pipeline orders")
differ = 0
both_faults = 0
for b in batches:
    r1 = run_order(b, "length")
    r2 = run_order(b, "negative")
    if r1 != r2:
        differ = differ + 1
    if stage_length(b) != "ok":
        if stage_negative(b) != "ok":
            both_faults = both_faults + 1
    print("  " + repr(b) + "  length-first " + r1 + "  negative-first " + r2)
print("")
print("batches whose reported cause depends on order : " + str(differ) + " of " + str(len(batches)))
print("batches that violate BOTH rules               : " + str(both_faults))
print("")

def tally(order, tag):
    n = 0
    for b in batches:
        if run_order(b, order) == tag:
            n = n + 1
    return n

print("reports filed, by order")
print("  length-first   : LENGTH " + str(tally("length", "LENGTH")) + "  NEGATIVE " + str(tally("length", "NEGATIVE")))
print("  negative-first : LENGTH " + str(tally("negative", "LENGTH")) + "  NEGATIVE " + str(tally("negative", "NEGATIVE")))
print("")
before = 0
after = 0
for b in batches:
    if run_order(b, "length") == "NEGATIVE":
        before = before + 1
    if stage_negative(b) != "ok":
        after = after + 1
print("NEGATIVE reports visible while the length rule runs first : " + str(before))
print("NEGATIVE reports once the length rule is fixed            : " + str(after))
print("batches that were always failing and never reported       : " + str(after - before))
print("")
len_correct = 0
neg_correct = 0
for b in batches:
    if len(b) > 5:
        if stage_length(b) == "LENGTH":
            len_correct = len_correct + 1
    elif stage_length(b) == "ok":
        len_correct = len_correct + 1
    has_neg = 0
    for v in b:
        if v < 0:
            has_neg = 1
    if has_neg == 1:
        if stage_negative(b) == "NEGATIVE":
            neg_correct = neg_correct + 1
    elif stage_negative(b) == "ok":
        neg_correct = neg_correct + 1
print("each stage, judged only on its own rule")
print("  length rule correct on   : " + str(len_correct) + " of " + str(len(batches)))
print("  negative rule correct on : " + str(neg_correct) + " of " + str(len(batches)))
print("")
print("Both stages are right about their own subject on every batch. What order")
print("decides is not correctness - it is which failure is observable, and an")
print("unobservable failure produces no ticket, no owner and no fix.")
```

## stdout (executed)

```text
the same batches, both pipeline orders
  [1, 2, 3]  length-first ok  negative-first ok
  [1, 2, 3, 4, 5, 6]  length-first LENGTH  negative-first LENGTH
  [1, -2, 3]  length-first NEGATIVE  negative-first NEGATIVE
  [1, 2, -3, 4, 5, 6]  length-first LENGTH  negative-first NEGATIVE
  [4, 5]  length-first ok  negative-first ok
  [-1, 2, 3, 4, 5, 6, 7]  length-first LENGTH  negative-first NEGATIVE
  [9, 9, 9, 9, 9, 9]  length-first LENGTH  negative-first LENGTH

batches whose reported cause depends on order : 2 of 7
batches that violate BOTH rules               : 2

reports filed, by order
  length-first   : LENGTH 4  NEGATIVE 1
  negative-first : LENGTH 2  NEGATIVE 3

NEGATIVE reports visible while the length rule runs first : 1
NEGATIVE reports once the length rule is fixed            : 3
batches that were always failing and never reported       : 2

each stage, judged only on its own rule
  length rule correct on   : 7 of 7
  negative rule correct on : 7 of 7

Both stages are right about their own subject on every batch. What order
decides is not correctness - it is which failure is observable, and an
unobservable failure produces no ticket, no owner and no fix.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
