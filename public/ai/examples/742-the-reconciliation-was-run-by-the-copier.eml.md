<!-- canonical: efficientnewlanguage.org/ai/examples/742-the-reconciliation-was-run-by-the-copier | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 742 — The reconciliation was run by the copier

`the_reconciliation_was_run_by_the_copier.eml` - A nightly reconciliation compares the operational database to the warehouse and has reported no discrepancy in two years. Which two things it compares is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A nightly
# reconciliation compares the operational database to the warehouse and has
# reported no discrepancy in two years. Which two things it compares is computed
# below.
#
# The reconciliation is not a formality. It runs every night without exception,
# it compares row counts and a per-column checksum rather than a count alone, it
# fails loudly rather than logging, it is paged on, and when the extract once
# died halfway it caught that within the hour.
#
# It runs as the last step of the pipeline that does the copy. Its two operands
# are the batch that was read and the batch that was written, both held by the
# same process, so a row the extract never selected is in neither.
#
# Forty-one thousand rows a night are excluded by the extract's filter.

730 => nightly_reconciliations
0 => discrepancies_reported_in_two_years
1 => processes_that_both_copy_and_compare
2 => systems_the_reconciliation_names
1 => systems_it_reads_independently
41000 => rows_the_extract_filter_excludes_per_night
0 => queries_that_read_the_warehouse_back
1 => half_finished_extracts_it_caught

systems_the_reconciliation_names - systems_it_reads_independently => systems_it_takes_on_trust
int(systems_it_reads_independently * 10000 / systems_the_reconciliation_names) => independently_read_per_myriad

"nightly reconciliations         : " + str(nightly_reconciliations) ^0
"discrepancies reported          : " + str(discrepancies_reported_in_two_years) ^0
"half-finished extracts it caught: " + str(half_finished_extracts_it_caught) ^0
"" ^0
"systems it names                : " + str(systems_the_reconciliation_names) ^0
"  read independently            : " + str(systems_it_reads_independently) ^0
"  taken on trust                : " + str(systems_it_takes_on_trust) ^0
"  share read independently      : " + str(independently_read_per_myriad) + " per ten thousand" ^0
"" ^0
"processes that both copy and compare : " + str(processes_that_both_copy_and_compare) ^0
"queries that read the warehouse back : " + str(queries_that_read_the_warehouse_back) ^0
"rows the extract filter excludes nightly : " + str(rows_the_extract_filter_excludes_per_night) ^0
"" ^0

# ---- what the reconciliation verified ----

"the nightly check" ^0
"  runs : every night, no exceptions" ^0
"  compares : row counts and a per-column checksum, not a" ^0
"    count alone" ^0
"  on mismatch : fails loudly and pages" ^0
"  caught, once : an extract that died halfway" ^0
"  discrepancies since : " + str(discrepancies_reported_in_two_years) ^0
"  verdict : CONSISTENT" ^0
"" ^0
"  a per-column checksum rather than a row count is the" ^0
"  expensive choice and it is the one that caught the" ^0
"  half-finished extract" ^0
"" ^0

# ---- what its two operands are ----

"the comparison" ^0
"  named as : the operational database against the" ^0
"    warehouse" ^0
"  actually held : the batch that was read and the batch" ^0
"    that was written, in one process" ^0
"  where both came from : the same extract query" ^0
"  what a row outside that query is : absent from both" ^0
"  reads of the warehouse after the write : " + str(queries_that_read_the_warehouse_back) ^0
"" ^0
"  the check compares the pipeline to itself, which is why" ^0
"  it caught a pipeline that stopped and cannot see one" ^0
"  that never started on a row" ^0
"" ^0
# ---- what it can and cannot disagree about ----

"the two kinds of failure" ^0
"  the write failed after the read : both operands differ," ^0
"    the check is red, and this happened once" ^0
"  the read never selected the row : both operands agree," ^0
"    because neither contains it" ^0
"  the check's population : the extract's result set" ^0
"  the question asked of it : whether the warehouse holds" ^0
"    what the database holds" ^0
"  rows outside the result set nightly : " + str(rows_the_extract_filter_excludes_per_night) ^0
"" ^0

# ---- why the filter exists ----

# The extract filter is not a bug. It excludes soft-deleted rows, test tenants,
# and rows whose partition has already been archived, and each exclusion was
# deliberate and correct when it was added.
"the excluded rows" ^0
"  soft-deleted        : excluded on purpose" ^0
"  test tenants        : excluded on purpose" ^0
"  already archived    : excluded on purpose" ^0
"  was each exclusion right when added : yes" ^0
"  is the set of them reviewed : it is a WHERE clause" ^0
"  does any report say the warehouse is a subset : no; the" ^0
"    reconciliation says the two agree" ^0
"" ^0

# ---- what a reader takes from two years ----

"the record" ^0
"  nights run       : " + str(nightly_reconciliations) ^0
"  discrepancies    : " + str(discrepancies_reported_in_two_years) ^0
"  what an analyst concludes : the warehouse is the" ^0
"    database, and can be queried instead of it" ^0
"  what is true : the warehouse is the extract, and the" ^0
"    extract is the reconciliation's definition of the" ^0
"    database" ^0
"" ^0

# ---- null control ----

# The same check, with the second operand read back out of the warehouse by a
# separate job that takes its row set from the source table rather than from
# the extract query.
systems_the_reconciliation_names => nc_systems_it_reads_independently
rows_the_extract_filter_excludes_per_night => nc_rows_it_would_now_see

"null control - the second side is read back independently" ^0
"  per-column checksum : unchanged" ^0
"  systems read independently : " + str(nc_systems_it_reads_independently) ^0
"  rows now inside the comparison : " + str(nc_rows_it_would_now_see) + " more" ^0
"  the check did not get stricter; its second operand" ^0
"  stopped being a variable the first operand wrote" ^0
"" ^0

# ---- the rule ----

"what a green reconciliation guarantees" ^0
"  the copy matched what was read : exactly, by checksum," ^0
"    every night, and it caught a truncated run" ^0
"  the two systems agree          : not addressed; both" ^0
"    sides came from one query, and a comparison cannot" ^0
"    disagree about a row neither side was given" ^0
"" ^0
"a consistency check is only as strong as the independence of" ^0
"how its two sides were obtained; a check that runs inside" ^0
"the pipeline it checks can detect the pipeline stopping and" ^0
"never what the pipeline was told to ignore" ^0
"" ^0

"The reconciliation runs every night, compares a per-column checksum rather than" ^0
"a row count, pages on failure, and caught an extract that died halfway - " + str(discrepancies_reported_in_two_years) ^0
"discrepancies in " + str(nightly_reconciliations) + " nights. It is the last step of the copy, so of the" ^0
str(systems_the_reconciliation_names) + " systems it names it reads " + str(systems_it_reads_independently) + " independently - " + str(independently_read_per_myriad) + " per ten thousand -" ^0
"and the " + str(rows_the_extract_filter_excludes_per_night) + " rows a night its own filter excludes are in neither operand." ^0
```

## Python (deterministic transpilation)

```python
nightly_reconciliations = 730
discrepancies_reported_in_two_years = 0
processes_that_both_copy_and_compare = 1
systems_the_reconciliation_names = 2
systems_it_reads_independently = 1
rows_the_extract_filter_excludes_per_night = 41000
queries_that_read_the_warehouse_back = 0
half_finished_extracts_it_caught = 1
systems_it_takes_on_trust = systems_the_reconciliation_names - systems_it_reads_independently
independently_read_per_myriad = int(systems_it_reads_independently * 10000 / systems_the_reconciliation_names)
print("nightly reconciliations         : " + str(nightly_reconciliations))
print("discrepancies reported          : " + str(discrepancies_reported_in_two_years))
print("half-finished extracts it caught: " + str(half_finished_extracts_it_caught))
print("")
print("systems it names                : " + str(systems_the_reconciliation_names))
print("  read independently            : " + str(systems_it_reads_independently))
print("  taken on trust                : " + str(systems_it_takes_on_trust))
print("  share read independently      : " + str(independently_read_per_myriad) + " per ten thousand")
print("")
print("processes that both copy and compare : " + str(processes_that_both_copy_and_compare))
print("queries that read the warehouse back : " + str(queries_that_read_the_warehouse_back))
print("rows the extract filter excludes nightly : " + str(rows_the_extract_filter_excludes_per_night))
print("")
print("the nightly check")
print("  runs : every night, no exceptions")
print("  compares : row counts and a per-column checksum, not a")
print("    count alone")
print("  on mismatch : fails loudly and pages")
print("  caught, once : an extract that died halfway")
print("  discrepancies since : " + str(discrepancies_reported_in_two_years))
print("  verdict : CONSISTENT")
print("")
print("  a per-column checksum rather than a row count is the")
print("  expensive choice and it is the one that caught the")
print("  half-finished extract")
print("")
print("the comparison")
print("  named as : the operational database against the")
print("    warehouse")
print("  actually held : the batch that was read and the batch")
print("    that was written, in one process")
print("  where both came from : the same extract query")
print("  what a row outside that query is : absent from both")
print("  reads of the warehouse after the write : " + str(queries_that_read_the_warehouse_back))
print("")
print("  the check compares the pipeline to itself, which is why")
print("  it caught a pipeline that stopped and cannot see one")
print("  that never started on a row")
print("")
print("the two kinds of failure")
print("  the write failed after the read : both operands differ,")
print("    the check is red, and this happened once")
print("  the read never selected the row : both operands agree,")
print("    because neither contains it")
print("  the check's population : the extract's result set")
print("  the question asked of it : whether the warehouse holds")
print("    what the database holds")
print("  rows outside the result set nightly : " + str(rows_the_extract_filter_excludes_per_night))
print("")
print("the excluded rows")
print("  soft-deleted        : excluded on purpose")
print("  test tenants        : excluded on purpose")
print("  already archived    : excluded on purpose")
print("  was each exclusion right when added : yes")
print("  is the set of them reviewed : it is a WHERE clause")
print("  does any report say the warehouse is a subset : no; the")
print("    reconciliation says the two agree")
print("")
print("the record")
print("  nights run       : " + str(nightly_reconciliations))
print("  discrepancies    : " + str(discrepancies_reported_in_two_years))
print("  what an analyst concludes : the warehouse is the")
print("    database, and can be queried instead of it")
print("  what is true : the warehouse is the extract, and the")
print("    extract is the reconciliation's definition of the")
print("    database")
print("")
nc_systems_it_reads_independently = systems_the_reconciliation_names
nc_rows_it_would_now_see = rows_the_extract_filter_excludes_per_night
print("null control - the second side is read back independently")
print("  per-column checksum : unchanged")
print("  systems read independently : " + str(nc_systems_it_reads_independently))
print("  rows now inside the comparison : " + str(nc_rows_it_would_now_see) + " more")
print("  the check did not get stricter; its second operand")
print("  stopped being a variable the first operand wrote")
print("")
print("what a green reconciliation guarantees")
print("  the copy matched what was read : exactly, by checksum,")
print("    every night, and it caught a truncated run")
print("  the two systems agree          : not addressed; both")
print("    sides came from one query, and a comparison cannot")
print("    disagree about a row neither side was given")
print("")
print("a consistency check is only as strong as the independence of")
print("how its two sides were obtained; a check that runs inside")
print("the pipeline it checks can detect the pipeline stopping and")
print("never what the pipeline was told to ignore")
print("")
print("The reconciliation runs every night, compares a per-column checksum rather than")
print("a row count, pages on failure, and caught an extract that died halfway - " + str(discrepancies_reported_in_two_years))
print("discrepancies in " + str(nightly_reconciliations) + " nights. It is the last step of the copy, so of the")
print(str(systems_the_reconciliation_names) + " systems it names it reads " + str(systems_it_reads_independently) + " independently - " + str(independently_read_per_myriad) + " per ten thousand -")
print("and the " + str(rows_the_extract_filter_excludes_per_night) + " rows a night its own filter excludes are in neither operand.")
```

## stdout (executed)

```text
nightly reconciliations         : 730
discrepancies reported          : 0
half-finished extracts it caught: 1

systems it names                : 2
  read independently            : 1
  taken on trust                : 1
  share read independently      : 5000 per ten thousand

processes that both copy and compare : 1
queries that read the warehouse back : 0
rows the extract filter excludes nightly : 41000

the nightly check
  runs : every night, no exceptions
  compares : row counts and a per-column checksum, not a
    count alone
  on mismatch : fails loudly and pages
  caught, once : an extract that died halfway
  discrepancies since : 0
  verdict : CONSISTENT

  a per-column checksum rather than a row count is the
  expensive choice and it is the one that caught the
  half-finished extract

the comparison
  named as : the operational database against the
    warehouse
  actually held : the batch that was read and the batch
    that was written, in one process
  where both came from : the same extract query
  what a row outside that query is : absent from both
  reads of the warehouse after the write : 0

  the check compares the pipeline to itself, which is why
  it caught a pipeline that stopped and cannot see one
  that never started on a row

the two kinds of failure
  the write failed after the read : both operands differ,
    the check is red, and this happened once
  the read never selected the row : both operands agree,
    because neither contains it
  the check's population : the extract's result set
  the question asked of it : whether the warehouse holds
    what the database holds
  rows outside the result set nightly : 41000

the excluded rows
  soft-deleted        : excluded on purpose
  test tenants        : excluded on purpose
  already archived    : excluded on purpose
  was each exclusion right when added : yes
  is the set of them reviewed : it is a WHERE clause
  does any report say the warehouse is a subset : no; the
    reconciliation says the two agree

the record
  nights run       : 730
  discrepancies    : 0
  what an analyst concludes : the warehouse is the
    database, and can be queried instead of it
  what is true : the warehouse is the extract, and the
    extract is the reconciliation's definition of the
    database

null control - the second side is read back independently
  per-column checksum : unchanged
  systems read independently : 2
  rows now inside the comparison : 41000 more
  the check did not get stricter; its second operand
  stopped being a variable the first operand wrote

what a green reconciliation guarantees
  the copy matched what was read : exactly, by checksum,
    every night, and it caught a truncated run
  the two systems agree          : not addressed; both
    sides came from one query, and a comparison cannot
    disagree about a row neither side was given

a consistency check is only as strong as the independence of
how its two sides were obtained; a check that runs inside
the pipeline it checks can detect the pipeline stopping and
never what the pipeline was told to ignore

The reconciliation runs every night, compares a per-column checksum rather than
a row count, pages on failure, and caught an extract that died halfway - 0
discrepancies in 730 nights. It is the last step of the copy, so of the
2 systems it names it reads 1 independently - 5000 per ten thousand -
and the 41000 rows a night its own filter excludes are in neither operand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
