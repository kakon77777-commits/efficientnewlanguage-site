<!-- canonical: efficientnewlanguage.org/ai/examples/847-the-outer-join-became-inner | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 847 — The outer join became inner

`the_outer_join_became_inner.eml` - The orders report joins every order to its shipment and the LEFT JOIN is written correctly. What a WHERE on the shipment column does to it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The orders report
# joins every order to its shipment and the LEFT JOIN is written correctly. What
# a WHERE on the shipment column does to it is computed below.
#
# The join is careful. It is a LEFT JOIN, chosen on purpose so an order with no
# shipment still appears; it joins on the real foreign key; it runs over every
# order; and the report is meant to list all orders with their delivery region.
#
# A later WHERE clause filters on shipment.region, and shipment.region IS NULL
# for an order that has no shipment.

50000 => orders
47000 => orders_with_a_shipment
3000 => orders_never_shipped

orders_with_a_shipment => orders_the_where_kept
orders - orders_the_where_kept => orders_dropped_by_the_where
int(orders_dropped_by_the_where * 10000 / orders) => dropped_share_per_myriad

"orders                          : " + str(orders) ^0
"  with a shipment               : " + str(orders_with_a_shipment) ^0
"  never shipped                 : " + str(orders_never_shipped) ^0
"" ^0
"orders the LEFT JOIN keeps      : " + str(orders) ^0
"orders the WHERE then kept      : " + str(orders_the_where_kept) ^0
"  dropped by the WHERE          : " + str(orders_dropped_by_the_where) ^0
"dropped share                   : " + str(dropped_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the join verified ----

"the LEFT JOIN" ^0
"  kind : LEFT, chosen so an unshipped order still appears" ^0
"  joins on : the real foreign key" ^0
"  over : every order" ^0
"  intent : all orders, with their delivery region" ^0
"  orders it keeps before the WHERE : " + str(orders) ^0
"  verdict : all orders present" ^0
"" ^0

# ---- what the WHERE does ----

"WHERE shipment.region = 'domestic'" ^0
"  what an unshipped order's shipment.region is : NULL" ^0
"  what NULL = 'domestic' yields : UNKNOWN" ^0
"  what WHERE keeps : rows where the predicate is TRUE" ^0
"  so the unshipped orders : are dropped by the WHERE" ^0
"  the LEFT JOIN, effectively : becomes an INNER JOIN" ^0
"" ^0

# ---- what the report lost ----

"the orders that never shipped" ^0
"  count : " + str(orders_never_shipped) ^0
"  present after the LEFT JOIN : yes, as NULL-shipment rows" ^0
"  present after the WHERE : no" ^0
"  is the join wrong : no; the LEFT JOIN is correct" ^0
"  is a WHERE on the right table's column safe on a LEFT" ^0
"    JOIN : no; it filters out the very rows the LEFT JOIN" ^0
"    exists to keep" ^0
"" ^0

# ---- null control ----

# The same query, with the region predicate moved into the JOIN's ON clause (or
# written region = 'domestic' OR region IS NULL) so unmatched rows survive.
47000 => nc_kept_with_where_on_right
50000 => nc_kept_with_predicate_in_on
3000 => nc_orders_it_recovers

"null control - predicate in ON, not WHERE" ^0
"  kept, predicate in WHERE : " + str(nc_kept_with_where_on_right) ^0
"  kept, predicate in ON : " + str(nc_kept_with_predicate_in_on) ^0
"  orders it recovers : " + str(nc_orders_it_recovers) ^0
"  no order and no shipment changed; the predicate stopped" ^0
"  running after the join and started running inside it" ^0
"" ^0

# ---- the rule ----

"what a LEFT JOIN guarantees" ^0
"  every left row appears, matched or not : exactly, on" ^0
"    the real key, over every order" ^0
"  every order appears in the report : not addressed; the" ^0
"    LEFT JOIN keeps unshipped orders as NULL rows, and a" ^0
"    WHERE on the shipment's column is UNKNOWN for NULL," ^0
"    turning the outer join into an inner one - " + str(orders_never_shipped) ^0
"    unshipped orders vanish" ^0
"" ^0

"a LEFT JOIN promises the unmatched rows with NULLs on the right, and a WHERE on" ^0
"a right-side column tests those NULLs and drops them; the outer join survives" ^0
"only until a later clause asks the missing side a question" ^0
"" ^0

"The LEFT JOIN keeps all " + str(orders) + " orders on the real key. A WHERE on shipment.region is" ^0
"UNKNOWN for the " + str(orders_never_shipped) + " unshipped orders, so it drops them and the outer join" ^0
"becomes inner - the report shows " + str(orders_the_where_kept) + " of " + str(orders) + ", " + str(dropped_share_per_myriad) + " per ten thousand lost." ^0
```

## Python (deterministic transpilation)

```python
orders = 50000
orders_with_a_shipment = 47000
orders_never_shipped = 3000
orders_the_where_kept = orders_with_a_shipment
orders_dropped_by_the_where = orders - orders_the_where_kept
dropped_share_per_myriad = int(orders_dropped_by_the_where * 10000 / orders)
print("orders                          : " + str(orders))
print("  with a shipment               : " + str(orders_with_a_shipment))
print("  never shipped                 : " + str(orders_never_shipped))
print("")
print("orders the LEFT JOIN keeps      : " + str(orders))
print("orders the WHERE then kept      : " + str(orders_the_where_kept))
print("  dropped by the WHERE          : " + str(orders_dropped_by_the_where))
print("dropped share                   : " + str(dropped_share_per_myriad) + " per ten thousand")
print("")
print("the LEFT JOIN")
print("  kind : LEFT, chosen so an unshipped order still appears")
print("  joins on : the real foreign key")
print("  over : every order")
print("  intent : all orders, with their delivery region")
print("  orders it keeps before the WHERE : " + str(orders))
print("  verdict : all orders present")
print("")
print("WHERE shipment.region = 'domestic'")
print("  what an unshipped order's shipment.region is : NULL")
print("  what NULL = 'domestic' yields : UNKNOWN")
print("  what WHERE keeps : rows where the predicate is TRUE")
print("  so the unshipped orders : are dropped by the WHERE")
print("  the LEFT JOIN, effectively : becomes an INNER JOIN")
print("")
print("the orders that never shipped")
print("  count : " + str(orders_never_shipped))
print("  present after the LEFT JOIN : yes, as NULL-shipment rows")
print("  present after the WHERE : no")
print("  is the join wrong : no; the LEFT JOIN is correct")
print("  is a WHERE on the right table's column safe on a LEFT")
print("    JOIN : no; it filters out the very rows the LEFT JOIN")
print("    exists to keep")
print("")
nc_kept_with_where_on_right = 47000
nc_kept_with_predicate_in_on = 50000
nc_orders_it_recovers = 3000
print("null control - predicate in ON, not WHERE")
print("  kept, predicate in WHERE : " + str(nc_kept_with_where_on_right))
print("  kept, predicate in ON : " + str(nc_kept_with_predicate_in_on))
print("  orders it recovers : " + str(nc_orders_it_recovers))
print("  no order and no shipment changed; the predicate stopped")
print("  running after the join and started running inside it")
print("")
print("what a LEFT JOIN guarantees")
print("  every left row appears, matched or not : exactly, on")
print("    the real key, over every order")
print("  every order appears in the report : not addressed; the")
print("    LEFT JOIN keeps unshipped orders as NULL rows, and a")
print("    WHERE on the shipment's column is UNKNOWN for NULL,")
print("    turning the outer join into an inner one - " + str(orders_never_shipped))
print("    unshipped orders vanish")
print("")
print("a LEFT JOIN promises the unmatched rows with NULLs on the right, and a WHERE on")
print("a right-side column tests those NULLs and drops them; the outer join survives")
print("only until a later clause asks the missing side a question")
print("")
print("The LEFT JOIN keeps all " + str(orders) + " orders on the real key. A WHERE on shipment.region is")
print("UNKNOWN for the " + str(orders_never_shipped) + " unshipped orders, so it drops them and the outer join")
print("becomes inner - the report shows " + str(orders_the_where_kept) + " of " + str(orders) + ", " + str(dropped_share_per_myriad) + " per ten thousand lost.")
```

## stdout (executed)

```text
orders                          : 50000
  with a shipment               : 47000
  never shipped                 : 3000

orders the LEFT JOIN keeps      : 50000
orders the WHERE then kept      : 47000
  dropped by the WHERE          : 3000
dropped share                   : 600 per ten thousand

the LEFT JOIN
  kind : LEFT, chosen so an unshipped order still appears
  joins on : the real foreign key
  over : every order
  intent : all orders, with their delivery region
  orders it keeps before the WHERE : 50000
  verdict : all orders present

WHERE shipment.region = 'domestic'
  what an unshipped order's shipment.region is : NULL
  what NULL = 'domestic' yields : UNKNOWN
  what WHERE keeps : rows where the predicate is TRUE
  so the unshipped orders : are dropped by the WHERE
  the LEFT JOIN, effectively : becomes an INNER JOIN

the orders that never shipped
  count : 3000
  present after the LEFT JOIN : yes, as NULL-shipment rows
  present after the WHERE : no
  is the join wrong : no; the LEFT JOIN is correct
  is a WHERE on the right table's column safe on a LEFT
    JOIN : no; it filters out the very rows the LEFT JOIN
    exists to keep

null control - predicate in ON, not WHERE
  kept, predicate in WHERE : 47000
  kept, predicate in ON : 50000
  orders it recovers : 3000
  no order and no shipment changed; the predicate stopped
  running after the join and started running inside it

what a LEFT JOIN guarantees
  every left row appears, matched or not : exactly, on
    the real key, over every order
  every order appears in the report : not addressed; the
    LEFT JOIN keeps unshipped orders as NULL rows, and a
    WHERE on the shipment's column is UNKNOWN for NULL,
    turning the outer join into an inner one - 3000
    unshipped orders vanish

a LEFT JOIN promises the unmatched rows with NULLs on the right, and a WHERE on
a right-side column tests those NULLs and drops them; the outer join survives
only until a later clause asks the missing side a question

The LEFT JOIN keeps all 50000 orders on the real key. A WHERE on shipment.region is
UNKNOWN for the 3000 unshipped orders, so it drops them and the outer join
becomes inner - the report shows 47000 of 50000, 600 per ten thousand lost.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
