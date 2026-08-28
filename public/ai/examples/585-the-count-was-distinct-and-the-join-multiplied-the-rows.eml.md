<!-- canonical: efficientnewlanguage.org/ai/examples/585-the-count-was-distinct-and-the-join-multiplied-the-rows | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 585 — The count was distinct and the join multiplied the rows

`the_count_was_distinct_and_the_join_multiplied_the_rows.eml` - A report joins orders to their line items so it can break revenue down by product category. Three numbers on the same report are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A report joins
# orders to their line items so it can break revenue down by product category.
# Three numbers on the same report are computed below.
#
# The join is necessary and correct. Category lives on the line item, revenue
# lives on the order, and a report that shows revenue by category has to bring
# them together - there is no other way to write it. The join condition is
# right, the foreign key is enforced, and no row is invented or lost: every
# output row corresponds to exactly one real line item on one real order.
#
# A join to a one-to-many side multiplies the parent rows. That is not a defect;
# it is what the join is for. Every aggregate computed afterwards is computed
# over the multiplied set, and an aggregate over the multiplied set answers a
# different question from the same SQL keyword.
#
# COUNT(DISTINCT order_id) survives it. COUNT(*) and SUM(order_total) do not,
# and all three sit on one report under headings that read the same.

8400 => orders
35 => items_per_order_tenths
2100000 => true_revenue

int(orders * items_per_order_tenths / 10) => joined_rows

"orders                 : " + str(orders) ^0
"line items per order   : " + str(items_per_order_tenths) + " tenths" ^0
"rows after the join    : " + str(joined_rows) ^0
"true revenue           : " + str(true_revenue) ^0
"" ^0

# ---- the three numbers ----

int(true_revenue * items_per_order_tenths / 10) => summed_after_join

"metric                     value        correct" ^0
"  COUNT(DISTINCT order_id)   " + str(orders) + "         yes" ^0
"  COUNT(*)                   " + str(joined_rows) + "        no, that is line items" ^0
"  SUM(order_total)           " + str(summed_after_join) + "      no, each order counted " + str(items_per_order_tenths) + " tenths of a time" ^0
"" ^0

"  revenue overstated by : " + str(summed_after_join - true_revenue) ^0
"  which is " + str(int(summed_after_join * 100 / true_revenue)) + " percent of the true figure" ^0
"" ^0

# ---- why every row is real ----
#
# Nothing is fabricated. The multiplication is the join doing its job, and each
# repeated order_total belongs to a genuine line item.

"where the extra revenue comes from" ^0
"  rows invented by the join     : 0" ^0
"  orders that do not exist      : 0" ^0
"  line items that do not exist  : 0" ^0
"  order_total values that are wrong : 0" ^0
"  every row is real, and " + str(joined_rows - orders) + " of them repeat a total already counted" ^0
"" ^0
"  a data-quality check on this table finds nothing, because there is" ^0
"  nothing wrong with the data" ^0
"" ^0

# ---- which aggregates survive a fan-out ----

"aggregate                  survives a one-to-many join" ^0
"  COUNT(DISTINCT parent)     yes, DISTINCT undoes the multiplication" ^0
"  MIN / MAX of a parent col  yes, repetition does not move an extremum" ^0
"  COUNT(*)                   no, it counts the multiplied set" ^0
"  SUM of a parent column     no, each value appears once per child" ^0
"  AVG of a parent column     yes, numerator and denominator scale together" ^0
"  SUM of a CHILD column      yes, that is what the fan-out is for" ^0
"" ^0
"  the report used three of these and only checked the first" ^0
"" ^0

# ---- how the error scales ----
#
# The overstatement is exactly the average fan-out. A report over a category
# with few items per order is nearly right; one with many is wildly wrong, and
# both appear on the same page.

"category   items per order   revenue reported vs true" ^0
[["books", 12], ["grocery", 84], ["single", 10], ["mixed", 35]] => categories
for c in categories:
    "  " + c[0] + "     " + str(c[1]) + " tenths          " + str(int(c[1] * 100 / 10)) + " percent" ^0
"" ^0
"  the single-item category is exactly right" ^0
"  and its correctness is what makes the page look checked" ^0
"" ^0

# ---- the control ----
#
# The join itself, and the row count it produces. Both are exactly what the
# schema implies, and a reviewer verifying the join finds it correct.

"control - is the join correct" ^0
"  expected rows from the schema : " + str(joined_rows) ^0
"  actual rows                   : " + str(joined_rows) ^0
"  orphan line items             : 0, the foreign key is enforced" ^0
"  orders lost by the join       : 0, it is an inner join over a mandatory key" ^0
"  defects in the join           : 0" ^0
"" ^0
"  the join is right and the aggregate above it is asking the wrong set" ^0
"" ^0

# ---- the null control ----
#
# The same query against orders that have exactly one line item each. No
# fan-out, so SUM and COUNT(*) are both correct and the report is right in
# every cell. The defect is the multiplicity, not the SQL.

10 => nc_items_per_order_tenths
int(orders * nc_items_per_order_tenths / 10) => nc_rows

"null control - the same report where every order has one line item" ^0
"  rows after the join : " + str(nc_rows) ^0
"  COUNT(*)            : " + str(nc_rows) + ", and it equals the order count" ^0
"  SUM(order_total)    : " + str(int(true_revenue * nc_items_per_order_tenths / 10)) ^0
"  true revenue        : " + str(true_revenue) ^0
"  difference          : " + str(int(true_revenue * nc_items_per_order_tenths / 10) - true_revenue) ^0
"  same query, same joins, same aggregates, and every number correct" ^0
"  the test fixture had one item per order" ^0
"" ^0

# ---- the rule ----

"an aggregate after a join" ^0
"  is the join correct              usually yes, and it is what gets reviewed" ^0
"  is the aggregate correct         only for aggregates that ignore repetition" ^0
"  which side does the column live on   this decides it, and it is not in" ^0
"                                       the aggregate's own text" ^0
"  SUM(a.total) and SUM(b.amount) look identical and differ completely" ^0
"" ^0
"the check is one query: compare the aggregate against the same aggregate" ^0
"computed before the join, and a difference is the fan-out, exactly" ^0
"" ^0

"Category lives on the line item and revenue lives on the order, so the report" ^0
"has to join them; the join is correct, the key is enforced, and not one row is" ^0
"invented or lost. " + str(joined_rows - orders) + " of the " + str(joined_rows) + " output rows repeat an order total that was" ^0
"already counted, so revenue reads " + str(summed_after_join) + " against a true " + str(true_revenue) + ", while" ^0
"COUNT(DISTINCT order_id) on the same page reads " + str(orders) + " and is exactly right." ^0
```

## Python (deterministic transpilation)

```python
orders = 8400
items_per_order_tenths = 35
true_revenue = 2100000
joined_rows = int(orders * items_per_order_tenths / 10)
print("orders                 : " + str(orders))
print("line items per order   : " + str(items_per_order_tenths) + " tenths")
print("rows after the join    : " + str(joined_rows))
print("true revenue           : " + str(true_revenue))
print("")
summed_after_join = int(true_revenue * items_per_order_tenths / 10)
print("metric                     value        correct")
print("  COUNT(DISTINCT order_id)   " + str(orders) + "         yes")
print("  COUNT(*)                   " + str(joined_rows) + "        no, that is line items")
print("  SUM(order_total)           " + str(summed_after_join) + "      no, each order counted " + str(items_per_order_tenths) + " tenths of a time")
print("")
print("  revenue overstated by : " + str(summed_after_join - true_revenue))
print("  which is " + str(int(summed_after_join * 100 / true_revenue)) + " percent of the true figure")
print("")
print("where the extra revenue comes from")
print("  rows invented by the join     : 0")
print("  orders that do not exist      : 0")
print("  line items that do not exist  : 0")
print("  order_total values that are wrong : 0")
print("  every row is real, and " + str(joined_rows - orders) + " of them repeat a total already counted")
print("")
print("  a data-quality check on this table finds nothing, because there is")
print("  nothing wrong with the data")
print("")
print("aggregate                  survives a one-to-many join")
print("  COUNT(DISTINCT parent)     yes, DISTINCT undoes the multiplication")
print("  MIN / MAX of a parent col  yes, repetition does not move an extremum")
print("  COUNT(*)                   no, it counts the multiplied set")
print("  SUM of a parent column     no, each value appears once per child")
print("  AVG of a parent column     yes, numerator and denominator scale together")
print("  SUM of a CHILD column      yes, that is what the fan-out is for")
print("")
print("  the report used three of these and only checked the first")
print("")
print("category   items per order   revenue reported vs true")
categories = [["books", 12], ["grocery", 84], ["single", 10], ["mixed", 35]]
for c in categories:
    print("  " + c[0] + "     " + str(c[1]) + " tenths          " + str(int(c[1] * 100 / 10)) + " percent")
print("")
print("  the single-item category is exactly right")
print("  and its correctness is what makes the page look checked")
print("")
print("control - is the join correct")
print("  expected rows from the schema : " + str(joined_rows))
print("  actual rows                   : " + str(joined_rows))
print("  orphan line items             : 0, the foreign key is enforced")
print("  orders lost by the join       : 0, it is an inner join over a mandatory key")
print("  defects in the join           : 0")
print("")
print("  the join is right and the aggregate above it is asking the wrong set")
print("")
nc_items_per_order_tenths = 10
nc_rows = int(orders * nc_items_per_order_tenths / 10)
print("null control - the same report where every order has one line item")
print("  rows after the join : " + str(nc_rows))
print("  COUNT(*)            : " + str(nc_rows) + ", and it equals the order count")
print("  SUM(order_total)    : " + str(int(true_revenue * nc_items_per_order_tenths / 10)))
print("  true revenue        : " + str(true_revenue))
print("  difference          : " + str(int(true_revenue * nc_items_per_order_tenths / 10) - true_revenue))
print("  same query, same joins, same aggregates, and every number correct")
print("  the test fixture had one item per order")
print("")
print("an aggregate after a join")
print("  is the join correct              usually yes, and it is what gets reviewed")
print("  is the aggregate correct         only for aggregates that ignore repetition")
print("  which side does the column live on   this decides it, and it is not in")
print("                                       the aggregate's own text")
print("  SUM(a.total) and SUM(b.amount) look identical and differ completely")
print("")
print("the check is one query: compare the aggregate against the same aggregate")
print("computed before the join, and a difference is the fan-out, exactly")
print("")
print("Category lives on the line item and revenue lives on the order, so the report")
print("has to join them; the join is correct, the key is enforced, and not one row is")
print("invented or lost. " + str(joined_rows - orders) + " of the " + str(joined_rows) + " output rows repeat an order total that was")
print("already counted, so revenue reads " + str(summed_after_join) + " against a true " + str(true_revenue) + ", while")
print("COUNT(DISTINCT order_id) on the same page reads " + str(orders) + " and is exactly right.")
```

## stdout (executed)

```text
orders                 : 8400
line items per order   : 35 tenths
rows after the join    : 29400
true revenue           : 2100000

metric                     value        correct
  COUNT(DISTINCT order_id)   8400         yes
  COUNT(*)                   29400        no, that is line items
  SUM(order_total)           7350000      no, each order counted 35 tenths of a time

  revenue overstated by : 5250000
  which is 350 percent of the true figure

where the extra revenue comes from
  rows invented by the join     : 0
  orders that do not exist      : 0
  line items that do not exist  : 0
  order_total values that are wrong : 0
  every row is real, and 21000 of them repeat a total already counted

  a data-quality check on this table finds nothing, because there is
  nothing wrong with the data

aggregate                  survives a one-to-many join
  COUNT(DISTINCT parent)     yes, DISTINCT undoes the multiplication
  MIN / MAX of a parent col  yes, repetition does not move an extremum
  COUNT(*)                   no, it counts the multiplied set
  SUM of a parent column     no, each value appears once per child
  AVG of a parent column     yes, numerator and denominator scale together
  SUM of a CHILD column      yes, that is what the fan-out is for

  the report used three of these and only checked the first

category   items per order   revenue reported vs true
  books     12 tenths          120 percent
  grocery     84 tenths          840 percent
  single     10 tenths          100 percent
  mixed     35 tenths          350 percent

  the single-item category is exactly right
  and its correctness is what makes the page look checked

control - is the join correct
  expected rows from the schema : 29400
  actual rows                   : 29400
  orphan line items             : 0, the foreign key is enforced
  orders lost by the join       : 0, it is an inner join over a mandatory key
  defects in the join           : 0

  the join is right and the aggregate above it is asking the wrong set

null control - the same report where every order has one line item
  rows after the join : 8400
  COUNT(*)            : 8400, and it equals the order count
  SUM(order_total)    : 2100000
  true revenue        : 2100000
  difference          : 0
  same query, same joins, same aggregates, and every number correct
  the test fixture had one item per order

an aggregate after a join
  is the join correct              usually yes, and it is what gets reviewed
  is the aggregate correct         only for aggregates that ignore repetition
  which side does the column live on   this decides it, and it is not in
                                       the aggregate's own text
  SUM(a.total) and SUM(b.amount) look identical and differ completely

the check is one query: compare the aggregate against the same aggregate
computed before the join, and a difference is the fan-out, exactly

Category lives on the line item and revenue lives on the order, so the report
has to join them; the join is correct, the key is enforced, and not one row is
invented or lost. 21000 of the 29400 output rows repeat an order total that was
already counted, so revenue reads 7350000 against a true 2100000, while
COUNT(DISTINCT order_id) on the same page reads 8400 and is exactly right.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
