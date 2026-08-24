<!-- canonical: efficientnewlanguage.org/ai/examples/530-the-id-stayed-a-string-and-stopped-being-unique | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 530 — The id stayed a string and stopped being unique

`the_id_stayed_a_string_and_stopped_being_unique.eml` - An order id was globally unique and became unique per tenant. Same field, same string type, same length. When that matters is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An order id was
# globally unique and became unique per tenant. Same field, same string type,
# same length. When that matters is computed below.
#
# The change was necessary. Tenants are being onboarded with their own existing
# order numbers, and forcing them to renumber their historical data was the
# blocker on three deals. Scoping the id to the tenant is the standard answer
# and it is what every comparable system does.
#
# A uniqueness guarantee is not visible in a value. Every id still looks like an
# id, every lookup still returns a row, and a join on order_id alone still
# produces output. It produces the wrong output only when two tenants have
# chosen the same number, which is rare at first and is a function of how many
# tenants there are rather than of anything the code does.
#
# Collisions are computed against the tenant count.

# [month, tenants, orders per tenant per month, distinct id values in use per tenant]
[["M1", 3, 4000, 4000], ["M3", 8, 4000, 4000], ["M6", 21, 4000, 4000], ["M9", 44, 4000, 4000], ["M12", 70, 4000, 4000]] => months

len(months) => n
100000 => id_space

def colliding_pairs(tenants):
    # pairs of tenants that share at least one id value, on a 1..100000 space
    # with 4000 ids each: expected overlap per pair is 4000*4000/100000 = 160
    return int(tenants * (tenants - 1) / 2)

"month   tenants   orders/tenant   tenant pairs   expected shared ids per pair" ^0
for m in months:
    "  " + m[0] + "     " + str(m[1]) + "        " + str(m[2]) + "           " + str(colliding_pairs(m[1])) + "            " + str(int(m[3] * m[3] / id_space)) ^0
"" ^0

months[0] => first
months[n - 1] => last
"tenants : " + str(first[1]) + " -> " + str(last[1]) ^0
"tenant pairs : " + str(colliding_pairs(first[1])) + " -> " + str(colliding_pairs(last[1])) ^0
"  pairs grow with the square, so the collision surface grows " + str(int(colliding_pairs(last[1]) / colliding_pairs(first[1]))) + " times" ^0
"  while the tenant count grows " + str(int(last[1] / first[1])) + " times" ^0
"" ^0

# ---- the joins ----

# [query, joins on, correct before, correct after]
[["order to shipment", "order_id", "yes", "no"], ["order to invoice", "order_id + tenant_id", "yes", "yes"], ["refund lookup", "order_id", "yes", "no"], ["support search", "order_id", "yes", "no"], ["nightly reconcile", "order_id + tenant_id", "yes", "yes"]] => queries

"query                joins on                  correct after the change" ^0
0 => broken
for q in queries:
    if q[3] == "no":
        broken + 1 => broken
    "  " + q[0] + "   " + q[1] + "     " + q[3] ^0
"  queries now incorrect : " + str(broken) + " of " + str(len(queries)) ^0
"  queries that changed  : 0" ^0
"  every one of those five is the same SQL it was before" ^0
"" ^0

# ---- what a wrong join returns ----

"what the broken joins do" ^0
"  they return a row" ^0
"  they return a row belonging to another tenant" ^0
"  rows returned per lookup, before : 1" ^0
"  rows returned per lookup, after  : 1 or more" ^0
"  errors raised : 0" ^0
"  the failure mode is a correct-looking answer about the wrong customer," ^0
"  which is also the worst one for a support search" ^0
"" ^0

# ---- when it starts happening ----

"first collision, by tenant count" ^0
for m in months:
    int(m[3] * m[3] / id_space) => per_pair
    colliding_pairs(m[1]) * per_pair => shared
    "  " + m[0] + " : " + str(m[1]) + " tenants, " + str(colliding_pairs(m[1])) + " pairs, about " + str(shared) + " shared id values in total" ^0
"  at " + first[0] + " with " + str(first[1]) + " tenants the number is small enough to look like zero" ^0
"  it is not zero, and it was never zero" ^0
"" ^0

# ---- what the type system saw ----

"the contract, before and after" ^0
"  field name  : order_id, unchanged" ^0
"  type        : string, unchanged" ^0
"  length      : unchanged" ^0
"  nullability : unchanged" ^0
"  uniqueness scope : global -> per tenant" ^0
"  the last line is not expressible in the schema, so it is in the design" ^0
"  note and in nobody's compiler" ^0
"" ^0

# ---- what would have made it visible ----

"changes that carry the guarantee in the value" ^0
"  prefix the id with the tenant : every old value becomes invalid, all" ^0
"    consumers break at parse time" ^0
"  add a composite key constraint : every unqualified join fails at the" ^0
"    database rather than at the customer" ^0
"  keep the field and document it : what happened" ^0
"  the first two cost a migration and the third costs " + str(broken) + " silently wrong" ^0
"  queries, and only the third one has no line item" ^0
"" ^0

# ---- the control: a query that was already qualified ----
#
# Where a join already carried the tenant, narrowing the uniqueness scope of
# the other column changed nothing about it.

for q in queries:
    if q[3] == "yes":
        "control - " + q[0] + ", joins on " + q[1] ^0
        "  correct before : " + q[2] + ", correct after : " + q[3] ^0
"  these two were written by someone who qualified the join without being" ^0
"  asked to, at a time when it made no difference" ^0
"  the guarantee they did not rely on is the one that later moved" ^0
"" ^0

"Scoping ids to the tenant unblocked three deals and is what comparable" ^0
"systems do. A uniqueness guarantee is not visible in a value, so " + str(broken) + " of " + str(len(queries)) ^0
"queries are wrong today and none of them were edited." ^0
```

## Python (deterministic transpilation)

```python
months = [["M1", 3, 4000, 4000], ["M3", 8, 4000, 4000], ["M6", 21, 4000, 4000], ["M9", 44, 4000, 4000], ["M12", 70, 4000, 4000]]
n = len(months)
id_space = 100000

def colliding_pairs(tenants):
    return int(tenants * (tenants - 1) / 2)

print("month   tenants   orders/tenant   tenant pairs   expected shared ids per pair")
for m in months:
    print("  " + m[0] + "     " + str(m[1]) + "        " + str(m[2]) + "           " + str(colliding_pairs(m[1])) + "            " + str(int(m[3] * m[3] / id_space)))
print("")
first = months[0]
last = months[n - 1]
print("tenants : " + str(first[1]) + " -> " + str(last[1]))
print("tenant pairs : " + str(colliding_pairs(first[1])) + " -> " + str(colliding_pairs(last[1])))
print("  pairs grow with the square, so the collision surface grows " + str(int(colliding_pairs(last[1]) / colliding_pairs(first[1]))) + " times")
print("  while the tenant count grows " + str(int(last[1] / first[1])) + " times")
print("")
queries = [["order to shipment", "order_id", "yes", "no"], ["order to invoice", "order_id + tenant_id", "yes", "yes"], ["refund lookup", "order_id", "yes", "no"], ["support search", "order_id", "yes", "no"], ["nightly reconcile", "order_id + tenant_id", "yes", "yes"]]
print("query                joins on                  correct after the change")
broken = 0
for q in queries:
    if q[3] == "no":
        broken = broken + 1
    print("  " + q[0] + "   " + q[1] + "     " + q[3])
print("  queries now incorrect : " + str(broken) + " of " + str(len(queries)))
print("  queries that changed  : 0")
print("  every one of those five is the same SQL it was before")
print("")
print("what the broken joins do")
print("  they return a row")
print("  they return a row belonging to another tenant")
print("  rows returned per lookup, before : 1")
print("  rows returned per lookup, after  : 1 or more")
print("  errors raised : 0")
print("  the failure mode is a correct-looking answer about the wrong customer,")
print("  which is also the worst one for a support search")
print("")
print("first collision, by tenant count")
for m in months:
    per_pair = int(m[3] * m[3] / id_space)
    shared = colliding_pairs(m[1]) * per_pair
    print("  " + m[0] + " : " + str(m[1]) + " tenants, " + str(colliding_pairs(m[1])) + " pairs, about " + str(shared) + " shared id values in total")
print("  at " + first[0] + " with " + str(first[1]) + " tenants the number is small enough to look like zero")
print("  it is not zero, and it was never zero")
print("")
print("the contract, before and after")
print("  field name  : order_id, unchanged")
print("  type        : string, unchanged")
print("  length      : unchanged")
print("  nullability : unchanged")
print("  uniqueness scope : global -> per tenant")
print("  the last line is not expressible in the schema, so it is in the design")
print("  note and in nobody's compiler")
print("")
print("changes that carry the guarantee in the value")
print("  prefix the id with the tenant : every old value becomes invalid, all")
print("    consumers break at parse time")
print("  add a composite key constraint : every unqualified join fails at the")
print("    database rather than at the customer")
print("  keep the field and document it : what happened")
print("  the first two cost a migration and the third costs " + str(broken) + " silently wrong")
print("  queries, and only the third one has no line item")
print("")
for q in queries:
    if q[3] == "yes":
        print("control - " + q[0] + ", joins on " + q[1])
        print("  correct before : " + q[2] + ", correct after : " + q[3])
print("  these two were written by someone who qualified the join without being")
print("  asked to, at a time when it made no difference")
print("  the guarantee they did not rely on is the one that later moved")
print("")
print("Scoping ids to the tenant unblocked three deals and is what comparable")
print("systems do. A uniqueness guarantee is not visible in a value, so " + str(broken) + " of " + str(len(queries)))
print("queries are wrong today and none of them were edited.")
```

## stdout (executed)

```text
month   tenants   orders/tenant   tenant pairs   expected shared ids per pair
  M1     3        4000           3            160
  M3     8        4000           28            160
  M6     21        4000           210            160
  M9     44        4000           946            160
  M12     70        4000           2415            160

tenants : 3 -> 70
tenant pairs : 3 -> 2415
  pairs grow with the square, so the collision surface grows 805 times
  while the tenant count grows 23 times

query                joins on                  correct after the change
  order to shipment   order_id     no
  order to invoice   order_id + tenant_id     yes
  refund lookup   order_id     no
  support search   order_id     no
  nightly reconcile   order_id + tenant_id     yes
  queries now incorrect : 3 of 5
  queries that changed  : 0
  every one of those five is the same SQL it was before

what the broken joins do
  they return a row
  they return a row belonging to another tenant
  rows returned per lookup, before : 1
  rows returned per lookup, after  : 1 or more
  errors raised : 0
  the failure mode is a correct-looking answer about the wrong customer,
  which is also the worst one for a support search

first collision, by tenant count
  M1 : 3 tenants, 3 pairs, about 480 shared id values in total
  M3 : 8 tenants, 28 pairs, about 4480 shared id values in total
  M6 : 21 tenants, 210 pairs, about 33600 shared id values in total
  M9 : 44 tenants, 946 pairs, about 151360 shared id values in total
  M12 : 70 tenants, 2415 pairs, about 386400 shared id values in total
  at M1 with 3 tenants the number is small enough to look like zero
  it is not zero, and it was never zero

the contract, before and after
  field name  : order_id, unchanged
  type        : string, unchanged
  length      : unchanged
  nullability : unchanged
  uniqueness scope : global -> per tenant
  the last line is not expressible in the schema, so it is in the design
  note and in nobody's compiler

changes that carry the guarantee in the value
  prefix the id with the tenant : every old value becomes invalid, all
    consumers break at parse time
  add a composite key constraint : every unqualified join fails at the
    database rather than at the customer
  keep the field and document it : what happened
  the first two cost a migration and the third costs 3 silently wrong
  queries, and only the third one has no line item

control - order to invoice, joins on order_id + tenant_id
  correct before : yes, correct after : yes
control - nightly reconcile, joins on order_id + tenant_id
  correct before : yes, correct after : yes
  these two were written by someone who qualified the join without being
  asked to, at a time when it made no difference
  the guarantee they did not rely on is the one that later moved

Scoping ids to the tenant unblocked three deals and is what comparable
systems do. A uniqueness guarantee is not visible in a value, so 3 of 5
queries are wrong today and none of them were edited.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
