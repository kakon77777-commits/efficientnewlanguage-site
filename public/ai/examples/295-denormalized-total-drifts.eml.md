<!-- canonical: efficientnewlanguage.org/ai/examples/295-denormalized-total-drifts | ai_layer_version: 0.1.0 | updated: 2026-08-08 -->

# Example 295 — Denormalized total drifts — the reconciliation compared a number with itself

`denormalized_total_drifts.eml` applies one ordinary edit to each of four orders, compares the stored total against a total recomputed from the line items, and then runs both the reconciliation the system has and one that re-derives.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The stored total
# and the items disagree, and the job that reconciles them adds up the stored
# totals.
#
# An order's total is kept as a column because computing it from the line items
# on every read is expensive. Every write path that changes an item is supposed
# to recompute it. There are more write paths than anybody listed: add item,
# remove item, edit quantity, apply a discount, void a line during a partial
# refund, a support tool that fixes a price. Each was written by someone who
# knew about totals, except the ones written by someone who did not.
#
# What keeps it alive is the reconciliation. "Do our totals add up" is answered
# by summing the total column and comparing against the ledger, which also
# derives from the total column. That check compares a number with itself. It
# is green during every hour of the drift, and it is the check that would have
# been pointed at if anyone had asked whether the totals were right.
#
# The measurement applies a sequence of operations to each order, then compares
# the stored total against a total recomputed from the items - and separately
# runs the reconciliation that the system actually has.

def recompute(items):
    0 => t
    for it in items:
        t + it[1] * it[2] => t
    return t

def apply(order, op):
    # order is [id, items, stored_total]. Returns a new order.
    order[0] => oid
    [] => items
    for it in order[1]:
        items + [[it[0], it[1], it[2]]] => items
    order[2] => stored

    op[0] => kind
    if kind == "add":
        items + [[op[1], op[2], op[3]]] => items
        stored + op[2] * op[3] => stored
    elif kind == "remove":
        [] => kept
        for it in items:
            if not (it[0] == op[1]):
                kept + [it] => kept
        kept => items
        # This path was added later, for the returns flow. It removes the line
        # and does not touch the total.
    elif kind == "reprice":
        [] => kept
        for it in items:
            if it[0] == op[1]:
                kept + [[it[0], op[2], it[2]]] => kept
            else:
                kept + [it] => kept
        kept => items
        # Support tooling. Same omission, different quarter.
    elif kind == "qty":
        [] => kept
        for it in items:
            if it[0] == op[1]:
                kept + [[it[0], it[1], op[2]]] => kept
            else:
                kept + [it] => kept
        kept => items
        recompute(kept) => stored
    return [oid, items, stored]

# id, items [sku, price, qty], stored total
[["o-1", [["sku-a", 100, 1], ["sku-b", 50, 2]], 200],
 ["o-2", [["sku-c", 30, 3]], 90],
 ["o-3", [["sku-d", 25, 4], ["sku-e", 10, 1]], 110],
 ["o-4", [["sku-f", 200, 1]], 200]] => ORDERS

# One ordinary edit each. Two of the four go through a path that was written
# without the recompute.
[[["qty", "sku-b", 3]],
 [["remove", "sku-c"], ["add", "sku-g", 40, 2]],
 [["reprice", "sku-d", 20]],
 []] => PLAN

"order  stored  recomputed  drift  path"^0
"-----  ------  ----------  -----  --------------------"^0

[] => finals
0 => drifted
0 => total_drift
0 => i
while i < len(ORDERS):
    ORDERS[i] => o
    "" => path
    for op in PLAN[i]:
        apply(o, op) => o
        path + op[0] + " " => path
    finals + [o] => finals
    recompute(o[1]) => real
    o[2] - real => d
    if not (d == 0):
        drifted + 1 => drifted
        total_drift + abs(d) => total_drift
    ((o[0] + "     ")[0:7] + (str(o[2]) + "       ")[0:8] + (str(real) + "           ")[0:12] + (str(d) + "      ")[0:7] + path)^0
    i + 1 => i

""^0
("orders: " + str(len(finals)) + ", drifted: " + str(drifted) + ", total absolute drift: " + str(total_drift))^0

""^0
"the reconciliation the system actually has"^0

# "Do the order totals match the ledger?" The ledger is posted from the same
# stored column, so both sides of this comparison come from the same number.
0 => sum_stored
for o in finals:
    sum_stored + o[2] => sum_stored
0 => ledger
for o in finals:
    ledger + o[2] => ledger
("sum of order.total: " + str(sum_stored))^0
("ledger total:       " + str(ledger))^0
if sum_stored == ledger:
    "reconciliation: PASS" => rec1
else:
    "reconciliation: FAIL" => rec1
rec1^0

""^0
"the reconciliation that re-derives"^0
0 => sum_real
for o in finals:
    sum_real + recompute(o[1]) => sum_real
("sum of order.total:        " + str(sum_stored))^0
("sum recomputed from items: " + str(sum_real))^0
if sum_stored == sum_real:
    "reconciliation: PASS" => rec2
else:
    "reconciliation: FAIL" => rec2
rec2^0

""^0
"which write paths recompute"^0
for kind in ["add", "remove", "reprice", "qty"]:
    # Probe each path in isolation against a fixed order and see whether the
    # stored total still equals the items. Read out, not looked up.
    ["probe", [["sku-x", 10, 2], ["sku-y", 5, 4]], 40] => probe
    if kind == "add":
        apply(probe, ["add", "sku-z", 7, 1]) => after
    elif kind == "remove":
        apply(probe, ["remove", "sku-y"]) => after
    elif kind == "reprice":
        apply(probe, ["reprice", "sku-x", 12]) => after
    else:
        apply(probe, ["qty", "sku-x", 5]) => after
    if after[2] == recompute(after[1]):
        "keeps the total correct" => note
    else:
        "leaves the total stale" => note
    ((kind + "        ")[0:9] + " " + note)^0

""^0
0 => checked
0 => passed

# Some orders must drift, or there is nothing to see.
checked + 1 => checked
if drifted > 0:
    passed + 1 => passed

# Not all of them - a system where everything is wrong gets noticed.
checked + 1 => checked
if drifted < len(finals):
    passed + 1 => passed

# The reconciliation the system has must PASS while the data is wrong. This is
# the whole point: the check is green throughout.
checked + 1 => checked
if sum_stored == ledger:
    passed + 1 => passed

# The reconciliation that re-derives must FAIL on the same data at the same
# instant.
checked + 1 => checked
if not (sum_stored == sum_real):
    passed + 1 => passed

# At least two distinct write paths must leave the total stale, so this is a
# class of omission rather than one forgotten line.
checked + 1 => checked
0 => stale_paths
for kind in ["add", "remove", "reprice", "qty"]:
    ["probe", [["sku-x", 10, 2], ["sku-y", 5, 4]], 40] => probe
    if kind == "add":
        apply(probe, ["add", "sku-z", 7, 1]) => after
    elif kind == "remove":
        apply(probe, ["remove", "sku-y"]) => after
    elif kind == "reprice":
        apply(probe, ["reprice", "sku-x", 12]) => after
    else:
        apply(probe, ["qty", "sku-x", 5]) => after
    if not (after[2] == recompute(after[1])):
        stale_paths + 1 => stale_paths
if stale_paths >= 2:
    passed + 1 => passed

# And at least one path must be correct, so "just recompute everywhere" is
# visibly not the state of the code - the correct paths are why nobody
# suspects the column.
checked + 1 => checked
if stale_paths < 4:
    passed + 1 => passed

# The drift must be BIASED, not symmetric. This check first asserted the
# opposite - that drift would go both ways, so no operator could learn a rule
# of thumb - and the measurement said otherwise: every drift is positive.
#
# The reason is worth more than the guess was. The path that was written first
# is `add`, because the first version of the feature was "put things in a
# cart", and it recomputes. The paths written later are the ones that make an
# order SMALLER - remove a line, drop a price - because refunds, returns and
# support tooling arrive after launch. So the stale paths are exactly the
# shrinking ones, and the stored total is systematically too HIGH. Revenue is
# overstated, in the direction nobody files a ticket about.
checked + 1 => checked
0 => high
0 => low
0 => i
while i < len(finals):
    finals[i][2] - recompute(finals[i][1]) => d
    if d > 0:
        high + 1 => high
    if d < 0:
        low + 1 => low
    i + 1 => i
if high > 0:
    if low == 0:
        passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The totals were wrong, always high, and the check compared a number with itself." => verdict
else:
    "FAILED - the orders did not behave as the checks describe." => verdict
verdict^0

""^0
"A denormalised column has one invariant - it equals the thing it"^0
"summarises - and no place to enforce it, because it is maintained by"^0
"every write path separately. The check that would enforce it has to"^0
"RE-DERIVE, and re-deriving is exactly the cost the column existed to"^0
"avoid, so the check that gets built is the cheap one, and the cheap one"^0
"reads the column on both sides."^0
```

## Python (deterministic transpilation)

```python
def recompute(items):
    t = 0
    for it in items:
        t = t + it[1] * it[2]
    return t

def apply(order, op):
    oid = order[0]
    items = []
    for it in order[1]:
        items = items + [[it[0], it[1], it[2]]]
    stored = order[2]
    kind = op[0]
    if kind == "add":
        items = items + [[op[1], op[2], op[3]]]
        stored = stored + op[2] * op[3]
    elif kind == "remove":
        kept = []
        for it in items:
            if not it[0] == op[1]:
                kept = kept + [it]
        items = kept
    elif kind == "reprice":
        kept = []
        for it in items:
            if it[0] == op[1]:
                kept = kept + [[it[0], op[2], it[2]]]
            else:
                kept = kept + [it]
        items = kept
    elif kind == "qty":
        kept = []
        for it in items:
            if it[0] == op[1]:
                kept = kept + [[it[0], it[1], op[2]]]
            else:
                kept = kept + [it]
        items = kept
        stored = recompute(kept)
    return [oid, items, stored]

ORDERS = [["o-1", [["sku-a", 100, 1], ["sku-b", 50, 2]], 200], ["o-2", [["sku-c", 30, 3]], 90], ["o-3", [["sku-d", 25, 4], ["sku-e", 10, 1]], 110], ["o-4", [["sku-f", 200, 1]], 200]]
PLAN = [[["qty", "sku-b", 3]], [["remove", "sku-c"], ["add", "sku-g", 40, 2]], [["reprice", "sku-d", 20]], []]
print("order  stored  recomputed  drift  path")
print("-----  ------  ----------  -----  --------------------")
finals = []
drifted = 0
total_drift = 0
i = 0
while i < len(ORDERS):
    o = ORDERS[i]
    path = ""
    for op in PLAN[i]:
        o = apply(o, op)
        path = path + op[0] + " "
    finals = finals + [o]
    real = recompute(o[1])
    d = o[2] - real
    if not d == 0:
        drifted = drifted + 1
        total_drift = total_drift + abs(d)
    print((o[0] + "     ")[0:7] + (str(o[2]) + "       ")[0:8] + (str(real) + "           ")[0:12] + (str(d) + "      ")[0:7] + path)
    i = i + 1
print("")
print("orders: " + str(len(finals)) + ", drifted: " + str(drifted) + ", total absolute drift: " + str(total_drift))
print("")
print("the reconciliation the system actually has")
sum_stored = 0
for o in finals:
    sum_stored = sum_stored + o[2]
ledger = 0
for o in finals:
    ledger = ledger + o[2]
print("sum of order.total: " + str(sum_stored))
print("ledger total:       " + str(ledger))
if sum_stored == ledger:
    rec1 = "reconciliation: PASS"
else:
    rec1 = "reconciliation: FAIL"
print(rec1)
print("")
print("the reconciliation that re-derives")
sum_real = 0
for o in finals:
    sum_real = sum_real + recompute(o[1])
print("sum of order.total:        " + str(sum_stored))
print("sum recomputed from items: " + str(sum_real))
if sum_stored == sum_real:
    rec2 = "reconciliation: PASS"
else:
    rec2 = "reconciliation: FAIL"
print(rec2)
print("")
print("which write paths recompute")
for kind in ["add", "remove", "reprice", "qty"]:
    probe = ["probe", [["sku-x", 10, 2], ["sku-y", 5, 4]], 40]
    if kind == "add":
        after = apply(probe, ["add", "sku-z", 7, 1])
    elif kind == "remove":
        after = apply(probe, ["remove", "sku-y"])
    elif kind == "reprice":
        after = apply(probe, ["reprice", "sku-x", 12])
    else:
        after = apply(probe, ["qty", "sku-x", 5])
    if after[2] == recompute(after[1]):
        note = "keeps the total correct"
    else:
        note = "leaves the total stale"
    print((kind + "        ")[0:9] + " " + note)
print("")
checked = 0
passed = 0
checked = checked + 1
if drifted > 0:
    passed = passed + 1
checked = checked + 1
if drifted < len(finals):
    passed = passed + 1
checked = checked + 1
if sum_stored == ledger:
    passed = passed + 1
checked = checked + 1
if not sum_stored == sum_real:
    passed = passed + 1
checked = checked + 1
stale_paths = 0
for kind in ["add", "remove", "reprice", "qty"]:
    probe = ["probe", [["sku-x", 10, 2], ["sku-y", 5, 4]], 40]
    if kind == "add":
        after = apply(probe, ["add", "sku-z", 7, 1])
    elif kind == "remove":
        after = apply(probe, ["remove", "sku-y"])
    elif kind == "reprice":
        after = apply(probe, ["reprice", "sku-x", 12])
    else:
        after = apply(probe, ["qty", "sku-x", 5])
    if not after[2] == recompute(after[1]):
        stale_paths = stale_paths + 1
if stale_paths >= 2:
    passed = passed + 1
checked = checked + 1
if stale_paths < 4:
    passed = passed + 1
checked = checked + 1
high = 0
low = 0
i = 0
while i < len(finals):
    d = finals[i][2] - recompute(finals[i][1])
    if d > 0:
        high = high + 1
    if d < 0:
        low = low + 1
    i = i + 1
if high > 0:
    if low == 0:
        passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The totals were wrong, always high, and the check compared a number with itself."
else:
    verdict = "FAILED - the orders did not behave as the checks describe."
print(verdict)
print("")
print("A denormalised column has one invariant - it equals the thing it")
print("summarises - and no place to enforce it, because it is maintained by")
print("every write path separately. The check that would enforce it has to")
print("RE-DERIVE, and re-deriving is exactly the cost the column existed to")
print("avoid, so the check that gets built is the cheap one, and the cheap one")
print("reads the column on both sides.")
```

## stdout (executed)

```text
order  stored  recomputed  drift  path
-----  ------  ----------  -----  --------------------
o-1    250     250         0      qty 
o-2    170     80          90     remove add 
o-3    110     90          20     reprice 
o-4    200     200         0      

orders: 4, drifted: 2, total absolute drift: 110

the reconciliation the system actually has
sum of order.total: 730
ledger total:       730
reconciliation: PASS

the reconciliation that re-derives
sum of order.total:        730
sum recomputed from items: 620
reconciliation: FAIL

which write paths recompute
add       keeps the total correct
remove    leaves the total stale
reprice   leaves the total stale
qty       keeps the total correct

checks passed: 7/7
The totals were wrong, always high, and the check compared a number with itself.

A denormalised column has one invariant - it equals the thing it
summarises - and no place to enforce it, because it is maintained by
every write path separately. The check that would enforce it has to
RE-DERIVE, and re-deriving is exactly the cost the column existed to
avoid, so the check that gets built is the cheap one, and the cheap one
reads the column on both sides.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
