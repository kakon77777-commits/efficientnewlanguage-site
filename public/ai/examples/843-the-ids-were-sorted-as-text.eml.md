<!-- canonical: efficientnewlanguage.org/ai/examples/843-the-ids-were-sorted-as-text | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 843 — The ids were sorted as text

`the_ids_were_sorted_as_text.eml` - The export lists records in ascending id order and the sort is correct. What kind of order it is is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The export lists
# records in ascending id order and the sort is correct. What kind of order it is
# is computed below.
#
# The export is careful. It sorts on the real id, not a display label; it uses
# the database's own ORDER BY; it includes every record; and ascending id is
# exactly what the downstream reconciler expects so it can merge by a moving
# cursor.
#
# The id column is stored as text, so the order is lexicographic, not numeric.

12000 => records_exported
2 => id_two
10 => id_ten
100 => id_hundred
9 => id_nine

id_ten - id_two => places_id_ten_should_be_after_id_two
0 => records_the_reconciler_saw_out_of_numeric_order_reported

"records exported                : " + str(records_exported) ^0
"a few ids, numeric order        : 2, 9, 10, 100" ^0
"the same ids, text order        : 10, 100, 2, 9" ^0
"" ^0
"id 10 vs id 2, numeric          : 10 comes after 2" ^0
"id 10 vs id 2, as text          : '10' comes before '2'" ^0
"reconciler mis-orderings it flagged : " + str(records_the_reconciler_saw_out_of_numeric_order_reported) ^0
"" ^0

# ---- what the export verified ----

"the ordered export" ^0
"  sorts on : the real id, not a display label" ^0
"  operator : the database's own ORDER BY" ^0
"  includes : every record" ^0
"  intent : ascending id for a cursor-based merge" ^0
"  records omitted : 0" ^0
"  verdict : ORDERED BY ID ASCENDING" ^0
"" ^0
"  sorting on the real id rather than a display label is" ^0
"  the part done right here, and it is why the order is" ^0
"  over the true key" ^0
"" ^0

# ---- what kind of order ----

"ORDER BY over a text id" ^0
"  what it compares : characters, left to right" ^0
"  '10' against '2' : '1' < '2', so '10' sorts first" ^0
"  '100' against '9' : '1' < '9', so '100' sorts before 9" ^0
"  so the order : 10, 100, 2, 9 - not 2, 9, 10, 100" ^0
"  numeric and text order agree only : while ids have the" ^0
"    same number of digits" ^0
"" ^0

# ---- what the reconciler does with it ----

"the cursor-based reconciler" ^0
"  what it assumes : ids arrive in increasing numeric" ^0
"    order" ^0
"  what it does when an id looks smaller than the cursor :" ^0
"    treats it as already processed and skips it" ^0
"  so records after a digit-count change : are skipped as" ^0
"    'behind the cursor'" ^0
"  is the ORDER BY wrong : no; it is the correct text order" ^0
"  is text order the numeric order the reconciler needs :" ^0
"    no" ^0
"" ^0

# ---- null control ----

# The same ids, sorted as integers (or zero-padded to a fixed width so text
# order matches numeric order).
0 => nc_text_order_matches_numeric
1 => nc_numeric_order_is_correct
1 => nc_reconciler_merges_cleanly

"null control - sort as integers (or zero-pad)" ^0
"  text order matches numeric : " + str(nc_text_order_matches_numeric) ^0
"  numeric order is correct : " + str(nc_numeric_order_is_correct) ^0
"  reconciler merges cleanly : " + str(nc_reconciler_merges_cleanly) ^0
"  no id changed; the comparison stopped ranking the ids by" ^0
"  their spelling" ^0
"" ^0

# ---- the rule ----

"what ORDER BY id guarantees" ^0
"  the rows are in ascending order of the column : exactly," ^0
"    the engine's own ORDER BY over every record" ^0
"  the rows are in ascending numeric id order : not" ^0
"    addressed; the id is text, so the order is" ^0
"    lexicographic - '10' precedes '2', and a reconciler" ^0
"    that expects numeric order skips the rows that look" ^0
"    behind its cursor" ^0
"" ^0

"an order is over a type, and the id's type is text; the sort is a correct" ^0
"ordering of strings, and strings rank by their first differing character, not" ^0
"by the quantity they denote" ^0
"" ^0

"It sorts the real id with the engine's ORDER BY over every record - a correct" ^0
"text order. The id is stored as text, so it runs 10, 100, 2, 9, and a" ^0
"cursor-based reconciler that assumes numeric order skips whatever falls behind" ^0
"its cursor, under " + str(records_the_reconciler_saw_out_of_numeric_order_reported) + " mis-orderings it flagged." ^0
```

## Python (deterministic transpilation)

```python
records_exported = 12000
id_two = 2
id_ten = 10
id_hundred = 100
id_nine = 9
places_id_ten_should_be_after_id_two = id_ten - id_two
records_the_reconciler_saw_out_of_numeric_order_reported = 0
print("records exported                : " + str(records_exported))
print("a few ids, numeric order        : 2, 9, 10, 100")
print("the same ids, text order        : 10, 100, 2, 9")
print("")
print("id 10 vs id 2, numeric          : 10 comes after 2")
print("id 10 vs id 2, as text          : '10' comes before '2'")
print("reconciler mis-orderings it flagged : " + str(records_the_reconciler_saw_out_of_numeric_order_reported))
print("")
print("the ordered export")
print("  sorts on : the real id, not a display label")
print("  operator : the database's own ORDER BY")
print("  includes : every record")
print("  intent : ascending id for a cursor-based merge")
print("  records omitted : 0")
print("  verdict : ORDERED BY ID ASCENDING")
print("")
print("  sorting on the real id rather than a display label is")
print("  the part done right here, and it is why the order is")
print("  over the true key")
print("")
print("ORDER BY over a text id")
print("  what it compares : characters, left to right")
print("  '10' against '2' : '1' < '2', so '10' sorts first")
print("  '100' against '9' : '1' < '9', so '100' sorts before 9")
print("  so the order : 10, 100, 2, 9 - not 2, 9, 10, 100")
print("  numeric and text order agree only : while ids have the")
print("    same number of digits")
print("")
print("the cursor-based reconciler")
print("  what it assumes : ids arrive in increasing numeric")
print("    order")
print("  what it does when an id looks smaller than the cursor :")
print("    treats it as already processed and skips it")
print("  so records after a digit-count change : are skipped as")
print("    'behind the cursor'")
print("  is the ORDER BY wrong : no; it is the correct text order")
print("  is text order the numeric order the reconciler needs :")
print("    no")
print("")
nc_text_order_matches_numeric = 0
nc_numeric_order_is_correct = 1
nc_reconciler_merges_cleanly = 1
print("null control - sort as integers (or zero-pad)")
print("  text order matches numeric : " + str(nc_text_order_matches_numeric))
print("  numeric order is correct : " + str(nc_numeric_order_is_correct))
print("  reconciler merges cleanly : " + str(nc_reconciler_merges_cleanly))
print("  no id changed; the comparison stopped ranking the ids by")
print("  their spelling")
print("")
print("what ORDER BY id guarantees")
print("  the rows are in ascending order of the column : exactly,")
print("    the engine's own ORDER BY over every record")
print("  the rows are in ascending numeric id order : not")
print("    addressed; the id is text, so the order is")
print("    lexicographic - '10' precedes '2', and a reconciler")
print("    that expects numeric order skips the rows that look")
print("    behind its cursor")
print("")
print("an order is over a type, and the id's type is text; the sort is a correct")
print("ordering of strings, and strings rank by their first differing character, not")
print("by the quantity they denote")
print("")
print("It sorts the real id with the engine's ORDER BY over every record - a correct")
print("text order. The id is stored as text, so it runs 10, 100, 2, 9, and a")
print("cursor-based reconciler that assumes numeric order skips whatever falls behind")
print("its cursor, under " + str(records_the_reconciler_saw_out_of_numeric_order_reported) + " mis-orderings it flagged.")
```

## stdout (executed)

```text
records exported                : 12000
a few ids, numeric order        : 2, 9, 10, 100
the same ids, text order        : 10, 100, 2, 9

id 10 vs id 2, numeric          : 10 comes after 2
id 10 vs id 2, as text          : '10' comes before '2'
reconciler mis-orderings it flagged : 0

the ordered export
  sorts on : the real id, not a display label
  operator : the database's own ORDER BY
  includes : every record
  intent : ascending id for a cursor-based merge
  records omitted : 0
  verdict : ORDERED BY ID ASCENDING

  sorting on the real id rather than a display label is
  the part done right here, and it is why the order is
  over the true key

ORDER BY over a text id
  what it compares : characters, left to right
  '10' against '2' : '1' < '2', so '10' sorts first
  '100' against '9' : '1' < '9', so '100' sorts before 9
  so the order : 10, 100, 2, 9 - not 2, 9, 10, 100
  numeric and text order agree only : while ids have the
    same number of digits

the cursor-based reconciler
  what it assumes : ids arrive in increasing numeric
    order
  what it does when an id looks smaller than the cursor :
    treats it as already processed and skips it
  so records after a digit-count change : are skipped as
    'behind the cursor'
  is the ORDER BY wrong : no; it is the correct text order
  is text order the numeric order the reconciler needs :
    no

null control - sort as integers (or zero-pad)
  text order matches numeric : 0
  numeric order is correct : 1
  reconciler merges cleanly : 1
  no id changed; the comparison stopped ranking the ids by
  their spelling

what ORDER BY id guarantees
  the rows are in ascending order of the column : exactly,
    the engine's own ORDER BY over every record
  the rows are in ascending numeric id order : not
    addressed; the id is text, so the order is
    lexicographic - '10' precedes '2', and a reconciler
    that expects numeric order skips the rows that look
    behind its cursor

an order is over a type, and the id's type is text; the sort is a correct
ordering of strings, and strings rank by their first differing character, not
by the quantity they denote

It sorts the real id with the engine's ORDER BY over every record - a correct
text order. The id is stored as text, so it runs 10, 100, 2, 9, and a
cursor-based reconciler that assumes numeric order skips whatever falls behind
its cursor, under 0 mis-orderings it flagged.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
