<!-- canonical: efficientnewlanguage.org/ai/examples/572-the-limit-was-on-the-response-and-the-cost-was-in-the-query | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 572 — The limit was on the response and the cost was in the query

`the_limit_was_on_the_response_and_the_cost_was_in_the_query.eml` - The API returns at most 20 rows per call and the rate limiter counts calls. What one call costs the database is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The API returns
# at most 20 rows per call and the rate limiter counts calls. What one call
# costs the database is computed below.
#
# Both limits are sensible and each was set against a real constraint. Twenty
# rows keeps the response small enough to render and small enough to send over
# a slow connection, which is why the page size exists. Counting calls is the
# only unit the gateway can see: it sits in front of the service, it does not
# parse the query, and metering what it can observe is the correct thing for a
# gateway to do.
#
# LIMIT bounds the rows that come back. OFFSET does not bound anything - the
# database must produce and discard every row before the window in order to
# know where the window starts. So the response size is constant and the work
# is proportional to how far in the caller has walked.
#
# One number is what the caller pays. The other is what the database does.

400000 => rows_in_table
20 => page_size

int(rows_in_table / page_size) => total_pages

"rows in the table : " + str(rows_in_table) ^0
"page size         : " + str(page_size) ^0
"pages to walk it  : " + str(total_pages) ^0
"" ^0

# ---- one page, at four depths ----

"page    offset    rows produced   rows returned   produced per returned" ^0
[1, 100, 1000, 5000, 20000] => sample_pages
for pg in sample_pages:
    (pg - 1) * page_size => offset
    offset + page_size => produced
    "  " + str(pg) + "      " + str(offset) + "      " + str(produced) + "        " + str(page_size) + "              " + str(int(produced / page_size)) ^0
"" ^0

"  the response column never changes" ^0
"  the rate limiter meters the response column" ^0
"" ^0

# ---- walking the whole table ----
#
# The cost of a full walk is the sum of the offsets plus the rows returned. For
# P pages of L rows that is L times P times P plus one, over two.

total_pages * (total_pages + 1) => pages_term
int(page_size * pages_term / 2) => rows_produced_full_walk

"reading every row, " + str(page_size) + " at a time, by offset" ^0
"  rows returned  : " + str(rows_in_table) ^0
"  rows produced  : " + str(rows_produced_full_walk) ^0
"  ratio          : " + str(int(rows_produced_full_walk / rows_in_table)) + " to 1" ^0
"  api calls made : " + str(total_pages) ^0
"  quota consumed : " + str(total_pages) + ", the same as any other " + str(total_pages) + " calls" ^0
"" ^0

# ---- two callers, identical bills ----
#
# One reads the first page twenty thousand times. The other walks the table.
# The gateway cannot tell them apart and neither can the bill.

total_pages * page_size => shallow_produced

"caller A: page 1, " + str(total_pages) + " times" ^0
"  rows produced : " + str(shallow_produced) ^0
"  api calls     : " + str(total_pages) ^0
"caller B: pages 1 to " + str(total_pages) + ", once each" ^0
"  rows produced : " + str(rows_produced_full_walk) ^0
"  api calls     : " + str(total_pages) ^0
"" ^0
"  ratio of database work : " + str(int(rows_produced_full_walk / shallow_produced)) + " to 1" ^0
"  ratio of quota consumed : 1 to 1" ^0
"  ratio of bytes returned : 1 to 1" ^0
"" ^0

# ---- what the gateway can and cannot see ----

"what the gateway observes" ^0
"  number of calls          yes, it counts them" ^0
"  size of each response    yes, it forwards the bytes" ^0
"  offset in the query      no, it does not parse the query" ^0
"  rows the database read   no, that is on the other side of the service" ^0
"  metering what it can see is right; it just does not correlate with cost" ^0
"" ^0

# ---- the same page, read by key ----
#
# Passing the last key seen instead of an offset makes the database seek rather
# than count. The response is identical and the produced column becomes flat.

"keyset pagination: pass the last key instead of an offset" ^0
"page    rows produced   rows returned" ^0
for pg in sample_pages:
    "  " + str(pg) + "      " + str(page_size) + "              " + str(page_size) ^0
"" ^0
"  full walk, rows produced : " + str(rows_in_table) ^0
"  against " + str(rows_produced_full_walk) + " by offset" ^0
"  saving                   : " + str(int(rows_produced_full_walk / rows_in_table)) + " times" ^0
"  the response is byte-identical and the page size is unchanged" ^0
"" ^0

# ---- the control ----
#
# Both limits, judged against what each was set for. Neither is wrong and
# neither would be set differently.

"control - is either limit wrong for its own purpose" ^0
"  page size 20: response small enough to render and to send : yes" ^0
"  rate limit per call: meters what the gateway can observe   : yes" ^0
"  incorrect limits : 0 of 2" ^0
"  the response really is bounded, on every call, at every depth" ^0
"" ^0
"  the unbounded quantity is on neither side of either limit" ^0
"" ^0

# ---- the null control ----
#
# The same API, same page size, same rate limit, used only for the first page -
# which is what a user interface does. Cost and quota track each other exactly
# and the design is sound.

1 => nc_pages
nc_pages * page_size => nc_produced

"null control - the same API used only for page 1" ^0
"  pages requested : " + str(nc_pages) ^0
"  rows produced   : " + str(nc_produced) ^0
"  rows returned   : " + str(page_size) ^0
"  produced per returned : " + str(int(nc_produced / page_size)) ^0
"  same limits, same gateway, and cost tracks quota exactly" ^0
"  the divergence is the offset, and a user interface never sends a large one" ^0
"" ^0

# ---- the rule ----

"a limit bounds what it names" ^0
"  LIMIT bounds rows returned         yes" ^0
"  LIMIT bounds rows examined         no" ^0
"  OFFSET bounds nothing              it is work, spelled like a coordinate" ^0
"  a meter on the response is a meter on the bounded quantity" ^0
"  the unbounded one has no meter, because nothing in the path can see it" ^0
"" ^0

"Twenty rows keeps a response renderable and metering calls is the only unit a" ^0
"gateway can observe without parsing the query - both correct. OFFSET is not a" ^0
"coordinate the database can jump to; it is rows it must produce and throw" ^0
"away. Walking " + str(rows_in_table) + " rows " + str(page_size) + " at a time produces " + str(rows_produced_full_walk) + " rows, which is" ^0
str(int(rows_produced_full_walk / rows_in_table)) + " times the table, for exactly the same " + str(total_pages) + " calls of quota as reading the" ^0
"first page " + str(total_pages) + " times." ^0
```

## Python (deterministic transpilation)

```python
rows_in_table = 400000
page_size = 20
total_pages = int(rows_in_table / page_size)
print("rows in the table : " + str(rows_in_table))
print("page size         : " + str(page_size))
print("pages to walk it  : " + str(total_pages))
print("")
print("page    offset    rows produced   rows returned   produced per returned")
sample_pages = [1, 100, 1000, 5000, 20000]
for pg in sample_pages:
    offset = (pg - 1) * page_size
    produced = offset + page_size
    print("  " + str(pg) + "      " + str(offset) + "      " + str(produced) + "        " + str(page_size) + "              " + str(int(produced / page_size)))
print("")
print("  the response column never changes")
print("  the rate limiter meters the response column")
print("")
pages_term = total_pages * (total_pages + 1)
rows_produced_full_walk = int(page_size * pages_term / 2)
print("reading every row, " + str(page_size) + " at a time, by offset")
print("  rows returned  : " + str(rows_in_table))
print("  rows produced  : " + str(rows_produced_full_walk))
print("  ratio          : " + str(int(rows_produced_full_walk / rows_in_table)) + " to 1")
print("  api calls made : " + str(total_pages))
print("  quota consumed : " + str(total_pages) + ", the same as any other " + str(total_pages) + " calls")
print("")
shallow_produced = total_pages * page_size
print("caller A: page 1, " + str(total_pages) + " times")
print("  rows produced : " + str(shallow_produced))
print("  api calls     : " + str(total_pages))
print("caller B: pages 1 to " + str(total_pages) + ", once each")
print("  rows produced : " + str(rows_produced_full_walk))
print("  api calls     : " + str(total_pages))
print("")
print("  ratio of database work : " + str(int(rows_produced_full_walk / shallow_produced)) + " to 1")
print("  ratio of quota consumed : 1 to 1")
print("  ratio of bytes returned : 1 to 1")
print("")
print("what the gateway observes")
print("  number of calls          yes, it counts them")
print("  size of each response    yes, it forwards the bytes")
print("  offset in the query      no, it does not parse the query")
print("  rows the database read   no, that is on the other side of the service")
print("  metering what it can see is right; it just does not correlate with cost")
print("")
print("keyset pagination: pass the last key instead of an offset")
print("page    rows produced   rows returned")
for pg in sample_pages:
    print("  " + str(pg) + "      " + str(page_size) + "              " + str(page_size))
print("")
print("  full walk, rows produced : " + str(rows_in_table))
print("  against " + str(rows_produced_full_walk) + " by offset")
print("  saving                   : " + str(int(rows_produced_full_walk / rows_in_table)) + " times")
print("  the response is byte-identical and the page size is unchanged")
print("")
print("control - is either limit wrong for its own purpose")
print("  page size 20: response small enough to render and to send : yes")
print("  rate limit per call: meters what the gateway can observe   : yes")
print("  incorrect limits : 0 of 2")
print("  the response really is bounded, on every call, at every depth")
print("")
print("  the unbounded quantity is on neither side of either limit")
print("")
nc_pages = 1
nc_produced = nc_pages * page_size
print("null control - the same API used only for page 1")
print("  pages requested : " + str(nc_pages))
print("  rows produced   : " + str(nc_produced))
print("  rows returned   : " + str(page_size))
print("  produced per returned : " + str(int(nc_produced / page_size)))
print("  same limits, same gateway, and cost tracks quota exactly")
print("  the divergence is the offset, and a user interface never sends a large one")
print("")
print("a limit bounds what it names")
print("  LIMIT bounds rows returned         yes")
print("  LIMIT bounds rows examined         no")
print("  OFFSET bounds nothing              it is work, spelled like a coordinate")
print("  a meter on the response is a meter on the bounded quantity")
print("  the unbounded one has no meter, because nothing in the path can see it")
print("")
print("Twenty rows keeps a response renderable and metering calls is the only unit a")
print("gateway can observe without parsing the query - both correct. OFFSET is not a")
print("coordinate the database can jump to; it is rows it must produce and throw")
print("away. Walking " + str(rows_in_table) + " rows " + str(page_size) + " at a time produces " + str(rows_produced_full_walk) + " rows, which is")
print(str(int(rows_produced_full_walk / rows_in_table)) + " times the table, for exactly the same " + str(total_pages) + " calls of quota as reading the")
print("first page " + str(total_pages) + " times.")
```

## stdout (executed)

```text
rows in the table : 400000
page size         : 20
pages to walk it  : 20000

page    offset    rows produced   rows returned   produced per returned
  1      0      20        20              1
  100      1980      2000        20              100
  1000      19980      20000        20              1000
  5000      99980      100000        20              5000
  20000      399980      400000        20              20000

  the response column never changes
  the rate limiter meters the response column

reading every row, 20 at a time, by offset
  rows returned  : 400000
  rows produced  : 4000200000
  ratio          : 10000 to 1
  api calls made : 20000
  quota consumed : 20000, the same as any other 20000 calls

caller A: page 1, 20000 times
  rows produced : 400000
  api calls     : 20000
caller B: pages 1 to 20000, once each
  rows produced : 4000200000
  api calls     : 20000

  ratio of database work : 10000 to 1
  ratio of quota consumed : 1 to 1
  ratio of bytes returned : 1 to 1

what the gateway observes
  number of calls          yes, it counts them
  size of each response    yes, it forwards the bytes
  offset in the query      no, it does not parse the query
  rows the database read   no, that is on the other side of the service
  metering what it can see is right; it just does not correlate with cost

keyset pagination: pass the last key instead of an offset
page    rows produced   rows returned
  1      20              20
  100      20              20
  1000      20              20
  5000      20              20
  20000      20              20

  full walk, rows produced : 400000
  against 4000200000 by offset
  saving                   : 10000 times
  the response is byte-identical and the page size is unchanged

control - is either limit wrong for its own purpose
  page size 20: response small enough to render and to send : yes
  rate limit per call: meters what the gateway can observe   : yes
  incorrect limits : 0 of 2
  the response really is bounded, on every call, at every depth

  the unbounded quantity is on neither side of either limit

null control - the same API used only for page 1
  pages requested : 1
  rows produced   : 20
  rows returned   : 20
  produced per returned : 1
  same limits, same gateway, and cost tracks quota exactly
  the divergence is the offset, and a user interface never sends a large one

a limit bounds what it names
  LIMIT bounds rows returned         yes
  LIMIT bounds rows examined         no
  OFFSET bounds nothing              it is work, spelled like a coordinate
  a meter on the response is a meter on the bounded quantity
  the unbounded one has no meter, because nothing in the path can see it

Twenty rows keeps a response renderable and metering calls is the only unit a
gateway can observe without parsing the query - both correct. OFFSET is not a
coordinate the database can jump to; it is rows it must produce and throw
away. Walking 400000 rows 20 at a time produces 4000200000 rows, which is
10000 times the table, for exactly the same 20000 calls of quota as reading the
first page 20000 times.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
