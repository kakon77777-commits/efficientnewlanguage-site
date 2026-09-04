<!-- canonical: efficientnewlanguage.org/ai/examples/688-the-audit-covered-every-table-and-the-view-was-not-a-table | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 688 — The audit covered every table and the view was not a table

`the_audit_covered_every_table_and_the_view_was_not_a_table.eml` - Every table in the database is covered by the access audit and the coverage is enumerated rather than asserted. What is not covered is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every table in the
# database is covered by the access audit and the coverage is enumerated rather
# than asserted. What is not covered is computed below.
#
# The audit is built the right way round. It does not take a list of tables from
# a document; it queries the catalog for every table that exists, joins that
# against the tables it has a policy for, and fails if the difference is
# non-empty. A table added without a policy fails the nightly job, and that has
# happened four times and been fixed each time.
#
# The catalog query asks for tables. A view is a different kind of object, it is
# queryable by the same clients with the same syntax, and it is not in the
# answer.
#
# Nine of the eleven views select from a table the policy calls restricted.

412 => tables
412 => tables_with_a_policy
11 => views
9 => views_selecting_from_a_restricted_table
4 => tables_caught_without_a_policy_this_year
0 => tables_uncovered

views - views_selecting_from_a_restricted_table => views_over_unrestricted_data
tables + views => queryable_objects
int(views * 10000 / queryable_objects) => uncovered_per_myriad

"tables                          : " + str(tables) ^0
"tables with a policy            : " + str(tables_with_a_policy) ^0
"tables uncovered                : " + str(tables_uncovered) ^0
"tables caught without a policy this year : " + str(tables_caught_without_a_policy_this_year) ^0
"" ^0
"views                           : " + str(views) ^0
"  selecting restricted data     : " + str(views_selecting_from_a_restricted_table) ^0
"  over unrestricted data        : " + str(views_over_unrestricted_data) ^0
"queryable objects               : " + str(queryable_objects) ^0
"share not covered               : " + str(uncovered_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the audit verified ----

"the coverage check" ^0
"  source of the object list : the catalog, not a document" ^0
"  method                    : every table that exists," ^0
"    joined against the tables with a policy" ^0
"  fails when the difference is non-empty : yes" ^0
"  tables caught this year   : " + str(tables_caught_without_a_policy_this_year) + ", each fixed" ^0
"  tables uncovered now      : " + str(tables_uncovered) ^0
"  verdict                   : COMPLETE" ^0
"" ^0
"  enumerating from the catalog rather than from a list is" ^0
"  the whole difference between this and a checklist, and" ^0
"  it is why the four were caught" ^0
"" ^0

# ---- what the catalog query asked for ----

"the enumeration" ^0
"  asks for        : tables" ^0
"  a view is       : a different object kind" ^0
"  a client querying a view uses : the same syntax, the" ^0
"    same connection, the same permissions model" ^0
"  is a view in the answer : no" ^0
"  is that a bug in the query : no, it asked what it asked" ^0
"" ^0
"  the audit is complete over its population and the" ^0
"  population is narrower than the word `every` suggests" ^0
"" ^0

# ---- what a view is for ----

# Views exist precisely to expose a shaped subset to a caller who should not
# have the table. Most of them were created BY a data-access review, which is
# why they select from restricted tables.
"why the views select restricted data" ^0
"  a view exists to : expose a shaped subset to a caller" ^0
"    who should not have the table" ^0
"  who created most of them : a data-access review" ^0
"  so selecting from a restricted table is : their purpose" ^0
"  and it is also why they are the objects most worth" ^0
"    auditing" ^0
"" ^0

int(views_selecting_from_a_restricted_table * 10000 / views) => restricted_view_share_per_myriad
"share of views over restricted data : " + str(restricted_view_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same audit, enumerating every queryable object rather than every table.
queryable_objects => nc_objects_enumerated
0 => nc_objects_uncovered

"null control - enumerate queryable objects, not tables" ^0
"  source of the list  : the catalog, unchanged" ^0
"  objects enumerated  : " + str(nc_objects_enumerated) ^0
"  objects uncovered   : " + str(nc_objects_uncovered) ^0
"  the audit did not become more thorough; the noun in its" ^0
"  query stopped being narrower than the noun in its name" ^0
"" ^0

# ---- the rule ----

"what an enumerated audit guarantees" ^0
"  every member of the enumerated set is covered : exactly," ^0
"    and better than any checklist" ^0
"  everything reachable is covered               : not" ^0
"    addressed; the set comes from a query, and the query" ^0
"    names a kind" ^0
"" ^0
"enumerating from the system beats enumerating from a document" ^0
"and inherits the system's taxonomy; the gap is not a" ^0
"forgotten item but a category the query did not ask for, and" ^0
"the audit's own completeness proof cannot see it" ^0
"" ^0

"The audit enumerates from the catalog rather than from a document, joins every" ^0
"existing table against the tables with a policy, fails on any difference, and" ^0
"caught " + str(tables_caught_without_a_policy_this_year) + " tables this year - " + str(tables_uncovered) + " are uncovered out of " + str(tables) + ". Its query asks" ^0
"for tables, so " + str(views) + " views are outside it - " + str(uncovered_per_myriad) + " per ten thousand of the queryable" ^0
"objects - and " + str(views_selecting_from_a_restricted_table) + " of them, " + str(restricted_view_share_per_myriad) + " per ten thousand, exist to expose restricted data." ^0
```

## Python (deterministic transpilation)

```python
tables = 412
tables_with_a_policy = 412
views = 11
views_selecting_from_a_restricted_table = 9
tables_caught_without_a_policy_this_year = 4
tables_uncovered = 0
views_over_unrestricted_data = views - views_selecting_from_a_restricted_table
queryable_objects = tables + views
uncovered_per_myriad = int(views * 10000 / queryable_objects)
print("tables                          : " + str(tables))
print("tables with a policy            : " + str(tables_with_a_policy))
print("tables uncovered                : " + str(tables_uncovered))
print("tables caught without a policy this year : " + str(tables_caught_without_a_policy_this_year))
print("")
print("views                           : " + str(views))
print("  selecting restricted data     : " + str(views_selecting_from_a_restricted_table))
print("  over unrestricted data        : " + str(views_over_unrestricted_data))
print("queryable objects               : " + str(queryable_objects))
print("share not covered               : " + str(uncovered_per_myriad) + " per ten thousand")
print("")
print("the coverage check")
print("  source of the object list : the catalog, not a document")
print("  method                    : every table that exists,")
print("    joined against the tables with a policy")
print("  fails when the difference is non-empty : yes")
print("  tables caught this year   : " + str(tables_caught_without_a_policy_this_year) + ", each fixed")
print("  tables uncovered now      : " + str(tables_uncovered))
print("  verdict                   : COMPLETE")
print("")
print("  enumerating from the catalog rather than from a list is")
print("  the whole difference between this and a checklist, and")
print("  it is why the four were caught")
print("")
print("the enumeration")
print("  asks for        : tables")
print("  a view is       : a different object kind")
print("  a client querying a view uses : the same syntax, the")
print("    same connection, the same permissions model")
print("  is a view in the answer : no")
print("  is that a bug in the query : no, it asked what it asked")
print("")
print("  the audit is complete over its population and the")
print("  population is narrower than the word `every` suggests")
print("")
print("why the views select restricted data")
print("  a view exists to : expose a shaped subset to a caller")
print("    who should not have the table")
print("  who created most of them : a data-access review")
print("  so selecting from a restricted table is : their purpose")
print("  and it is also why they are the objects most worth")
print("    auditing")
print("")
restricted_view_share_per_myriad = int(views_selecting_from_a_restricted_table * 10000 / views)
print("share of views over restricted data : " + str(restricted_view_share_per_myriad) + " per ten thousand")
print("")
nc_objects_enumerated = queryable_objects
nc_objects_uncovered = 0
print("null control - enumerate queryable objects, not tables")
print("  source of the list  : the catalog, unchanged")
print("  objects enumerated  : " + str(nc_objects_enumerated))
print("  objects uncovered   : " + str(nc_objects_uncovered))
print("  the audit did not become more thorough; the noun in its")
print("  query stopped being narrower than the noun in its name")
print("")
print("what an enumerated audit guarantees")
print("  every member of the enumerated set is covered : exactly,")
print("    and better than any checklist")
print("  everything reachable is covered               : not")
print("    addressed; the set comes from a query, and the query")
print("    names a kind")
print("")
print("enumerating from the system beats enumerating from a document")
print("and inherits the system's taxonomy; the gap is not a")
print("forgotten item but a category the query did not ask for, and")
print("the audit's own completeness proof cannot see it")
print("")
print("The audit enumerates from the catalog rather than from a document, joins every")
print("existing table against the tables with a policy, fails on any difference, and")
print("caught " + str(tables_caught_without_a_policy_this_year) + " tables this year - " + str(tables_uncovered) + " are uncovered out of " + str(tables) + ". Its query asks")
print("for tables, so " + str(views) + " views are outside it - " + str(uncovered_per_myriad) + " per ten thousand of the queryable")
print("objects - and " + str(views_selecting_from_a_restricted_table) + " of them, " + str(restricted_view_share_per_myriad) + " per ten thousand, exist to expose restricted data.")
```

## stdout (executed)

```text
tables                          : 412
tables with a policy            : 412
tables uncovered                : 0
tables caught without a policy this year : 4

views                           : 11
  selecting restricted data     : 9
  over unrestricted data        : 2
queryable objects               : 423
share not covered               : 260 per ten thousand

the coverage check
  source of the object list : the catalog, not a document
  method                    : every table that exists,
    joined against the tables with a policy
  fails when the difference is non-empty : yes
  tables caught this year   : 4, each fixed
  tables uncovered now      : 0
  verdict                   : COMPLETE

  enumerating from the catalog rather than from a list is
  the whole difference between this and a checklist, and
  it is why the four were caught

the enumeration
  asks for        : tables
  a view is       : a different object kind
  a client querying a view uses : the same syntax, the
    same connection, the same permissions model
  is a view in the answer : no
  is that a bug in the query : no, it asked what it asked

  the audit is complete over its population and the
  population is narrower than the word `every` suggests

why the views select restricted data
  a view exists to : expose a shaped subset to a caller
    who should not have the table
  who created most of them : a data-access review
  so selecting from a restricted table is : their purpose
  and it is also why they are the objects most worth
    auditing

share of views over restricted data : 8181 per ten thousand

null control - enumerate queryable objects, not tables
  source of the list  : the catalog, unchanged
  objects enumerated  : 423
  objects uncovered   : 0
  the audit did not become more thorough; the noun in its
  query stopped being narrower than the noun in its name

what an enumerated audit guarantees
  every member of the enumerated set is covered : exactly,
    and better than any checklist
  everything reachable is covered               : not
    addressed; the set comes from a query, and the query
    names a kind

enumerating from the system beats enumerating from a document
and inherits the system's taxonomy; the gap is not a
forgotten item but a category the query did not ask for, and
the audit's own completeness proof cannot see it

The audit enumerates from the catalog rather than from a document, joins every
existing table against the tables with a policy, fails on any difference, and
caught 4 tables this year - 0 are uncovered out of 412. Its query asks
for tables, so 11 views are outside it - 260 per ten thousand of the queryable
objects - and 9 of them, 8181 per ten thousand, exist to expose restricted data.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
