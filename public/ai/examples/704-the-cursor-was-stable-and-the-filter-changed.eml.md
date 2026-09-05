<!-- canonical: efficientnewlanguage.org/ai/examples/704-the-cursor-was-stable-and-the-filter-changed | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 704 — The cursor was stable and the filter changed

`the_cursor_was_stable_and_the_filter_changed.eml` - Keyset pagination returns no duplicates and skips no row, which offset pagination did both of. How many rows a full scan misses is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Keyset pagination
# returns no duplicates and skips no row, which offset pagination did both of.
# How many rows a full scan misses is computed below.
#
# The change to keyset was correct and it fixed a measured bug. Offset
# pagination re-counts from the start on every page, so a row inserted behind
# the reader shifts everything down and the next page repeats one and skips
# another; the support queue had examples. Keyset carries the last row's sort
# key, so the reader resumes exactly where it stopped, and a differential test
# over a live table found no duplicate and no skip.
#
# The cursor encodes the ORDER. It says where the reader is in the sort, and it
# says nothing about which rows are in the result set, because membership is
# decided by the filter each page re-evaluates.
#
# A row whose status changes to matching, behind the cursor, is never returned.

2400000 => rows
100 => page_size
41000 => rows_whose_status_changes_during_a_scan
18400 => rows_that_enter_the_filter_behind_the_cursor
0 => duplicates_from_keyset
0 => skips_from_ordering

int(rows / page_size) => pages
rows_whose_status_changes_during_a_scan - rows_that_enter_the_filter_behind_the_cursor => rows_that_leave_the_filter
int(rows_that_enter_the_filter_behind_the_cursor * 10000 / rows) => missed_per_myriad

"rows                          : " + str(rows) ^0
"page size                     : " + str(page_size) ^0
"pages in a full scan          : " + str(pages) ^0
"" ^0
"duplicates from keyset        : " + str(duplicates_from_keyset) ^0
"skips from ordering           : " + str(skips_from_ordering) ^0
"" ^0
"rows changing status mid-scan : " + str(rows_whose_status_changes_during_a_scan) ^0
"  leaving the filter          : " + str(rows_that_leave_the_filter) ^0
"  entering behind the cursor  : " + str(rows_that_enter_the_filter_behind_the_cursor) ^0
"never returned                : " + str(missed_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what keyset fixed ----

"the pagination change" ^0
"  offset : re-counts from the start, so an insert behind" ^0
"    the reader shifts every later page" ^0
"  keyset : resumes at the last row's sort key" ^0
"  duplicates in a differential test over a live table : " + str(duplicates_from_keyset) ^0
"  skips from ordering                                 : " + str(skips_from_ordering) ^0
"  verdict : STABLE" ^0
"" ^0
"  the support queue had examples of the old behaviour and" ^0
"  it has none of this one" ^0
"" ^0

# ---- what the cursor carries ----

"one cursor" ^0
"  encodes        : the last row's position in the sort" ^0
"  answers        : where am I in the order" ^0
"  does not encode: which rows are in the result" ^0
"  who decides that : the filter, re-evaluated on every page" ^0
"" ^0
"  the two questions are different and only one of them is" ^0
"  what stability was about" ^0
"" ^0

# ---- the two directions ----

# A row that stops matching after the reader has passed it was already
# returned; nothing is lost. A row that starts matching behind the reader is
# below the cursor and will never be visited again.
"a row that changes status mid-scan" ^0
"  stops matching, ahead of the cursor : correctly absent" ^0
"  stops matching, behind the cursor   : already returned," ^0
"    and that is arguably right" ^0
"  starts matching, ahead of the cursor: returned, fine" ^0
"  starts matching, behind the cursor  : never returned," ^0
"    and no page will revisit it" ^0
"" ^0

# ---- why the scan looks complete ----

# The reader counts pages and rows and both are self-consistent. The number
# that would show it is a count taken at the end and compared to the set the
# filter now selects, and the two are taken at different times by design.
"what the reader can check" ^0
"  pages read      : " + str(pages) ^0
"  rows returned   : consistent with the pages" ^0
"  duplicates      : " + str(duplicates_from_keyset) ^0
"  a count of the filter's set, taken at the end : would" ^0
"    differ, and would differ for legitimate reasons too" ^0
"" ^0

# ---- null control ----

# The same keyset cursor, over a snapshot: the scan reads at one transaction
# timestamp so the filter's set is fixed for its duration.
0 => nc_rows_never_returned
rows_whose_status_changes_during_a_scan => nc_rows_changing_after_the_snapshot

"null control - the scan reads at one snapshot" ^0
"  duplicates       : " + str(duplicates_from_keyset) + ", unchanged" ^0
"  rows never returned : " + str(nc_rows_never_returned) ^0
"  rows changing after the snapshot : " + str(nc_rows_changing_after_the_snapshot) + ", and they" ^0
"    belong to the next scan, which is a statement anyone" ^0
"    can act on" ^0
"  the cursor did not improve; the set stopped moving" ^0
"" ^0

# ---- the rule ----

"what a stable cursor guarantees" ^0
"  the reader resumes where it stopped : exactly" ^0
"  the reader sees every matching row  : not addressed;" ^0
"    the cursor is a position in an order, and membership" ^0
"    is a predicate evaluated fresh on every page" ^0
"" ^0
"pagination stability is about the sequence, completeness is" ^0
"about the set, and a filter that can change makes the second" ^0
"a question about isolation rather than about paging" ^0
"" ^0

"Keyset pagination is stable and it fixed a real bug: no duplicates and " + str(skips_from_ordering) ^0
"ordering skips in a differential test over a live table, where offset had both." ^0
"The cursor carries a position in the sort, not a membership rule, so of the" ^0
str(rows_whose_status_changes_during_a_scan) + " rows changing status during a " + str(pages) + "-page scan, the " + str(rows_that_enter_the_filter_behind_the_cursor) + " that begin" ^0
"matching behind the cursor - " + str(missed_per_myriad) + " per ten thousand - are never returned." ^0
```

## Python (deterministic transpilation)

```python
rows = 2400000
page_size = 100
rows_whose_status_changes_during_a_scan = 41000
rows_that_enter_the_filter_behind_the_cursor = 18400
duplicates_from_keyset = 0
skips_from_ordering = 0
pages = int(rows / page_size)
rows_that_leave_the_filter = rows_whose_status_changes_during_a_scan - rows_that_enter_the_filter_behind_the_cursor
missed_per_myriad = int(rows_that_enter_the_filter_behind_the_cursor * 10000 / rows)
print("rows                          : " + str(rows))
print("page size                     : " + str(page_size))
print("pages in a full scan          : " + str(pages))
print("")
print("duplicates from keyset        : " + str(duplicates_from_keyset))
print("skips from ordering           : " + str(skips_from_ordering))
print("")
print("rows changing status mid-scan : " + str(rows_whose_status_changes_during_a_scan))
print("  leaving the filter          : " + str(rows_that_leave_the_filter))
print("  entering behind the cursor  : " + str(rows_that_enter_the_filter_behind_the_cursor))
print("never returned                : " + str(missed_per_myriad) + " per ten thousand")
print("")
print("the pagination change")
print("  offset : re-counts from the start, so an insert behind")
print("    the reader shifts every later page")
print("  keyset : resumes at the last row's sort key")
print("  duplicates in a differential test over a live table : " + str(duplicates_from_keyset))
print("  skips from ordering                                 : " + str(skips_from_ordering))
print("  verdict : STABLE")
print("")
print("  the support queue had examples of the old behaviour and")
print("  it has none of this one")
print("")
print("one cursor")
print("  encodes        : the last row's position in the sort")
print("  answers        : where am I in the order")
print("  does not encode: which rows are in the result")
print("  who decides that : the filter, re-evaluated on every page")
print("")
print("  the two questions are different and only one of them is")
print("  what stability was about")
print("")
print("a row that changes status mid-scan")
print("  stops matching, ahead of the cursor : correctly absent")
print("  stops matching, behind the cursor   : already returned,")
print("    and that is arguably right")
print("  starts matching, ahead of the cursor: returned, fine")
print("  starts matching, behind the cursor  : never returned,")
print("    and no page will revisit it")
print("")
print("what the reader can check")
print("  pages read      : " + str(pages))
print("  rows returned   : consistent with the pages")
print("  duplicates      : " + str(duplicates_from_keyset))
print("  a count of the filter's set, taken at the end : would")
print("    differ, and would differ for legitimate reasons too")
print("")
nc_rows_never_returned = 0
nc_rows_changing_after_the_snapshot = rows_whose_status_changes_during_a_scan
print("null control - the scan reads at one snapshot")
print("  duplicates       : " + str(duplicates_from_keyset) + ", unchanged")
print("  rows never returned : " + str(nc_rows_never_returned))
print("  rows changing after the snapshot : " + str(nc_rows_changing_after_the_snapshot) + ", and they")
print("    belong to the next scan, which is a statement anyone")
print("    can act on")
print("  the cursor did not improve; the set stopped moving")
print("")
print("what a stable cursor guarantees")
print("  the reader resumes where it stopped : exactly")
print("  the reader sees every matching row  : not addressed;")
print("    the cursor is a position in an order, and membership")
print("    is a predicate evaluated fresh on every page")
print("")
print("pagination stability is about the sequence, completeness is")
print("about the set, and a filter that can change makes the second")
print("a question about isolation rather than about paging")
print("")
print("Keyset pagination is stable and it fixed a real bug: no duplicates and " + str(skips_from_ordering))
print("ordering skips in a differential test over a live table, where offset had both.")
print("The cursor carries a position in the sort, not a membership rule, so of the")
print(str(rows_whose_status_changes_during_a_scan) + " rows changing status during a " + str(pages) + "-page scan, the " + str(rows_that_enter_the_filter_behind_the_cursor) + " that begin")
print("matching behind the cursor - " + str(missed_per_myriad) + " per ten thousand - are never returned.")
```

## stdout (executed)

```text
rows                          : 2400000
page size                     : 100
pages in a full scan          : 24000

duplicates from keyset        : 0
skips from ordering           : 0

rows changing status mid-scan : 41000
  leaving the filter          : 22600
  entering behind the cursor  : 18400
never returned                : 76 per ten thousand

the pagination change
  offset : re-counts from the start, so an insert behind
    the reader shifts every later page
  keyset : resumes at the last row's sort key
  duplicates in a differential test over a live table : 0
  skips from ordering                                 : 0
  verdict : STABLE

  the support queue had examples of the old behaviour and
  it has none of this one

one cursor
  encodes        : the last row's position in the sort
  answers        : where am I in the order
  does not encode: which rows are in the result
  who decides that : the filter, re-evaluated on every page

  the two questions are different and only one of them is
  what stability was about

a row that changes status mid-scan
  stops matching, ahead of the cursor : correctly absent
  stops matching, behind the cursor   : already returned,
    and that is arguably right
  starts matching, ahead of the cursor: returned, fine
  starts matching, behind the cursor  : never returned,
    and no page will revisit it

what the reader can check
  pages read      : 24000
  rows returned   : consistent with the pages
  duplicates      : 0
  a count of the filter's set, taken at the end : would
    differ, and would differ for legitimate reasons too

null control - the scan reads at one snapshot
  duplicates       : 0, unchanged
  rows never returned : 0
  rows changing after the snapshot : 41000, and they
    belong to the next scan, which is a statement anyone
    can act on
  the cursor did not improve; the set stopped moving

what a stable cursor guarantees
  the reader resumes where it stopped : exactly
  the reader sees every matching row  : not addressed;
    the cursor is a position in an order, and membership
    is a predicate evaluated fresh on every page

pagination stability is about the sequence, completeness is
about the set, and a filter that can change makes the second
a question about isolation rather than about paging

Keyset pagination is stable and it fixed a real bug: no duplicates and 0
ordering skips in a differential test over a live table, where offset had both.
The cursor carries a position in the sort, not a membership rule, so of the
41000 rows changing status during a 24000-page scan, the 18400 that begin
matching behind the cursor - 76 per ten thousand - are never returned.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
