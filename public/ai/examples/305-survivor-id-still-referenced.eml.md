<!-- canonical: efficientnewlanguage.org/ai/examples/305-survivor-id-still-referenced | ai_layer_version: 0.1.0 | updated: 2026-08-08 -->

# Example 305 — Survivor id still referenced — the rows vanished from one report and stayed in the other

`survivor_id_still_referenced.eml` merges two customer records two ways — hard delete, and tombstone with a redirect — then runs two ordinary reports over each result and compares them against the pre-merge totals.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The merge picked
# a survivor and everything else in the system is still pointing at the loser.
#
# Deduplicating customers means choosing which of two rows lives. The choice is
# made in the customer table, by code that knows about customers. The loser's
# id is a foreign key in the order table, the invoice table, the support
# ledger, the export that finance reconciles against - and none of those are
# in the diff.
#
# What makes it hard to notice is that nothing errors. A report that joins
# orders to customers simply produces fewer rows, because an inner join's whole
# job is to drop rows with no match. A report that counts orders without
# joining still counts them. Both are correct implementations of their own
# query and they now disagree, which is a fact about the data that neither one
# is able to report.
#
# The measurement performs the merge two ways - hard delete, and tombstone
# with a redirect - and then runs two ordinary reports over each result,
# comparing them against the pre-merge totals.

def customers_after(mode):
    # mode "none":   before the merge - both rows present, no redirect.
    # mode "delete": the loser row is gone.
    # mode "alias":  the loser row remains, pointing at its survivor.
    [] => out
    for c in CUSTOMERS:
        if c[0] == LOSER:
            if mode == "alias":
                out + [[c[0], c[1], SURVIVOR]] => out
            elif mode == "none":
                out + [[c[0], c[1], ""]] => out
        else:
            out + [[c[0], c[1], ""]] => out
    return out

def resolve(customers, cid):
    # Follow one redirect if there is one. Returns "" when the id is unknown.
    for c in customers:
        if c[0] == cid:
            if len(c[2]) > 0:
                return c[2]
            return c[0]
    return ""

def report_join(customers, orders):
    # "Revenue by customer" - the query everybody writes. Orders whose customer
    # id does not resolve contribute nothing, silently.
    0 => total
    0 => rows
    for o in orders:
        resolve(customers, o[0]) => cid
        if len(cid) > 0:
            total + o[1] => total
            rows + 1 => rows
    return [total, rows]

def report_orders_only(orders):
    # "Total revenue" - straight off the order table, no join. Nothing to drop.
    0 => total
    for o in orders:
        total + o[1] => total
    return [total, len(orders)]

def dangling(customers, orders):
    0 => n
    for o in orders:
        if len(resolve(customers, o[0])) == 0:
            n + 1 => n
    return n

def attributed_to(customers, orders, cid):
    0 => total
    for o in orders:
        if resolve(customers, o[0]) == cid:
            total + o[1] => total
    return total

"c-102" => LOSER
"c-101" => SURVIVOR

# id, name, redirect
[["c-101", "Jing Wu", ""],
 ["c-102", "Jing Wu", ""],
 ["c-200", "Ana Diaz", ""]] => CUSTOMERS

# customer id, amount
[["c-101", 120],
 ["c-102", 80],
 ["c-102", 45],
 ["c-200", 300],
 ["c-101", 60]] => ORDERS

report_join(customers_after("none"), ORDERS) => before_join
report_orders_only(ORDERS) => before_flat

"                      revenue(join)  rows(join)  revenue(flat)  orders  dangling"^0
"--------------------- -------------  ----------  -------------  ------  --------"^0
("before merge          " + (str(before_join[0]) + "             ")[0:14] + (str(before_join[1]) + "           ")[0:12] + (str(before_flat[0]) + "              ")[0:15] + (str(before_flat[1]) + "       ")[0:8] + str(dangling(customers_after("none"), ORDERS)))^0

{} => after
for mode in ["delete", "alias"]:
    customers_after(mode) => cs
    report_join(cs, ORDERS) => j
    report_orders_only(ORDERS) => f
    dangling(cs, ORDERS) => d
    [j[0], j[1], f[0], f[1], d] => after[mode]
    (("merge by " + mode + "                 ")[0:22] + (str(j[0]) + "             ")[0:14] + (str(j[1]) + "           ")[0:12] + (str(f[0]) + "              ")[0:15] + (str(f[1]) + "       ")[0:8] + str(d))^0

""^0
"what the survivor is credited with"^0
for mode in ["none", "delete", "alias"]:
    customers_after(mode) => cs
    ((mode + "        ")[0:8] + " " + SURVIVOR + " is attributed " + str(attributed_to(cs, ORDERS, SURVIVOR)))^0

""^0
"the two reports, disagreeing"^0
for mode in ["delete", "alias"]:
    after[mode] => a
    a[0] - a[2] => gap
    ((mode + "        ")[0:8] + " join says " + str(a[0]) + ", flat says " + str(a[2]) + ", difference " + str(0 - gap))^0

""^0
"neither report is wrong about its own question"^0
"  the join reports revenue for customers that exist"^0
"  the flat report reports revenue for orders that exist"^0
"  after a hard delete those are different sets, and no query knows it"^0

""^0
0 => checked
0 => passed

# Before the merge the two reports must agree, so the disagreement is caused
# by the merge and not by the fixture.
checked + 1 => checked
if before_join[0] == before_flat[0]:
    passed + 1 => passed

# A hard delete must leave dangling references.
checked + 1 => checked
if after["delete"][4] > 0:
    passed + 1 => passed

# The alias must leave none.
checked + 1 => checked
if after["alias"][4] == 0:
    passed + 1 => passed

# Under a hard delete the two reports must disagree - that is the observable
# a human eventually notices, weeks later, as "revenue looks low".
checked + 1 => checked
if not (after["delete"][0] == after["delete"][2]):
    passed + 1 => passed

# Under the alias they must still agree.
checked + 1 => checked
if after["alias"][0] == after["alias"][2]:
    passed + 1 => passed

# The alias must credit the survivor with BOTH identities' revenue - which is
# the entire point of merging two records for one person.
checked + 1 => checked
customers_after("alias") => cs_alias
customers_after("none") => cs_none
attributed_to(cs_none, ORDERS, SURVIVOR) + attributed_to(cs_none, ORDERS, LOSER) => expected_total
if attributed_to(cs_alias, ORDERS, SURVIVOR) == expected_total:
    passed + 1 => passed

# And the hard delete must credit the survivor with LESS than that, so the
# merge that was supposed to combine two customers instead discarded one.
checked + 1 => checked
customers_after("delete") => cs_del
if attributed_to(cs_del, ORDERS, SURVIVOR) < expected_total:
    passed + 1 => passed

# Nothing raised an error in any of it.
checked + 1 => checked
if after["delete"][1] < before_join[1]:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The rows vanished from one report, stayed in the other, and raised nothing." => verdict
else:
    "FAILED - the merge modes did not behave as the checks describe." => verdict
verdict^0

""^0
"An id is not owned by the table it is defined in; it is owned by every"^0
"table that stores it. Deleting a row is a local edit with a non-local"^0
"meaning, and the only reason it looks local is that foreign keys point"^0
"INWARD - the customer table cannot see who is pointing at it. A merge"^0
"that leaves a redirect behind costs one column and makes the operation"^0
"survivable by everything downstream that was never consulted."^0
```

## Python (deterministic transpilation)

```python
def customers_after(mode):
    out = []
    for c in CUSTOMERS:
        if c[0] == LOSER:
            if mode == "alias":
                out = out + [[c[0], c[1], SURVIVOR]]
            elif mode == "none":
                out = out + [[c[0], c[1], ""]]
        else:
            out = out + [[c[0], c[1], ""]]
    return out

def resolve(customers, cid):
    for c in customers:
        if c[0] == cid:
            if len(c[2]) > 0:
                return c[2]
            return c[0]
    return ""

def report_join(customers, orders):
    total = 0
    rows = 0
    for o in orders:
        cid = resolve(customers, o[0])
        if len(cid) > 0:
            total = total + o[1]
            rows = rows + 1
    return [total, rows]

def report_orders_only(orders):
    total = 0
    for o in orders:
        total = total + o[1]
    return [total, len(orders)]

def dangling(customers, orders):
    n = 0
    for o in orders:
        if len(resolve(customers, o[0])) == 0:
            n = n + 1
    return n

def attributed_to(customers, orders, cid):
    total = 0
    for o in orders:
        if resolve(customers, o[0]) == cid:
            total = total + o[1]
    return total

LOSER = "c-102"
SURVIVOR = "c-101"
CUSTOMERS = [["c-101", "Jing Wu", ""], ["c-102", "Jing Wu", ""], ["c-200", "Ana Diaz", ""]]
ORDERS = [["c-101", 120], ["c-102", 80], ["c-102", 45], ["c-200", 300], ["c-101", 60]]
before_join = report_join(customers_after("none"), ORDERS)
before_flat = report_orders_only(ORDERS)
print("                      revenue(join)  rows(join)  revenue(flat)  orders  dangling")
print("--------------------- -------------  ----------  -------------  ------  --------")
print("before merge          " + (str(before_join[0]) + "             ")[0:14] + (str(before_join[1]) + "           ")[0:12] + (str(before_flat[0]) + "              ")[0:15] + (str(before_flat[1]) + "       ")[0:8] + str(dangling(customers_after("none"), ORDERS)))
after = {}
for mode in ["delete", "alias"]:
    cs = customers_after(mode)
    j = report_join(cs, ORDERS)
    f = report_orders_only(ORDERS)
    d = dangling(cs, ORDERS)
    after[mode] = [j[0], j[1], f[0], f[1], d]
    print(("merge by " + mode + "                 ")[0:22] + (str(j[0]) + "             ")[0:14] + (str(j[1]) + "           ")[0:12] + (str(f[0]) + "              ")[0:15] + (str(f[1]) + "       ")[0:8] + str(d))
print("")
print("what the survivor is credited with")
for mode in ["none", "delete", "alias"]:
    cs = customers_after(mode)
    print((mode + "        ")[0:8] + " " + SURVIVOR + " is attributed " + str(attributed_to(cs, ORDERS, SURVIVOR)))
print("")
print("the two reports, disagreeing")
for mode in ["delete", "alias"]:
    a = after[mode]
    gap = a[0] - a[2]
    print((mode + "        ")[0:8] + " join says " + str(a[0]) + ", flat says " + str(a[2]) + ", difference " + str(0 - gap))
print("")
print("neither report is wrong about its own question")
print("  the join reports revenue for customers that exist")
print("  the flat report reports revenue for orders that exist")
print("  after a hard delete those are different sets, and no query knows it")
print("")
checked = 0
passed = 0
checked = checked + 1
if before_join[0] == before_flat[0]:
    passed = passed + 1
checked = checked + 1
if after["delete"][4] > 0:
    passed = passed + 1
checked = checked + 1
if after["alias"][4] == 0:
    passed = passed + 1
checked = checked + 1
if not after["delete"][0] == after["delete"][2]:
    passed = passed + 1
checked = checked + 1
if after["alias"][0] == after["alias"][2]:
    passed = passed + 1
checked = checked + 1
cs_alias = customers_after("alias")
cs_none = customers_after("none")
expected_total = attributed_to(cs_none, ORDERS, SURVIVOR) + attributed_to(cs_none, ORDERS, LOSER)
if attributed_to(cs_alias, ORDERS, SURVIVOR) == expected_total:
    passed = passed + 1
checked = checked + 1
cs_del = customers_after("delete")
if attributed_to(cs_del, ORDERS, SURVIVOR) < expected_total:
    passed = passed + 1
checked = checked + 1
if after["delete"][1] < before_join[1]:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The rows vanished from one report, stayed in the other, and raised nothing."
else:
    verdict = "FAILED - the merge modes did not behave as the checks describe."
print(verdict)
print("")
print("An id is not owned by the table it is defined in; it is owned by every")
print("table that stores it. Deleting a row is a local edit with a non-local")
print("meaning, and the only reason it looks local is that foreign keys point")
print("INWARD - the customer table cannot see who is pointing at it. A merge")
print("that leaves a redirect behind costs one column and makes the operation")
print("survivable by everything downstream that was never consulted.")
```

## stdout (executed)

```text
                      revenue(join)  rows(join)  revenue(flat)  orders  dangling
--------------------- -------------  ----------  -------------  ------  --------
before merge          605           5           605            5       0
merge by delete       480           3           605            5       2
merge by alias        605           5           605            5       0

what the survivor is credited with
none     c-101 is attributed 180
delete   c-101 is attributed 180
alias    c-101 is attributed 305

the two reports, disagreeing
delete   join says 480, flat says 605, difference 125
alias    join says 605, flat says 605, difference 0

neither report is wrong about its own question
  the join reports revenue for customers that exist
  the flat report reports revenue for orders that exist
  after a hard delete those are different sets, and no query knows it

checks passed: 8/8
The rows vanished from one report, stayed in the other, and raised nothing.

An id is not owned by the table it is defined in; it is owned by every
table that stores it. Deleting a row is a local edit with a non-local
meaning, and the only reason it looks local is that foreign keys point
INWARD - the customer table cannot see who is pointing at it. A merge
that leaves a redirect behind costs one column and makes the operation
survivable by everything downstream that was never consulted.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
