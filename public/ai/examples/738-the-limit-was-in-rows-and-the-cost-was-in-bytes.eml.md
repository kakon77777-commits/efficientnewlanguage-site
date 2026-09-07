<!-- canonical: efficientnewlanguage.org/ai/examples/738-the-limit-was-in-rows-and-the-cost-was-in-bytes | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 738 — The limit was in rows and the cost was in bytes

`the_limit_was_in_rows_and_the_cost_was_in_bytes.eml` - The export endpoint caps a result at ten thousand rows, enforced in the query rather than after it, and there is no way to ask for more. What ten thousand rows weigh is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The export
# endpoint caps a result at ten thousand rows, enforced in the query rather than
# after it, and there is no way to ask for more. What ten thousand rows weigh is
# computed below.
#
# The cap is enforced where it should be. It is applied as a limit in the SQL
# rather than by truncating a result the database already materialised, so the
# database does not do the work either; there is no page-size parameter a caller
# can raise; the response says it was truncated instead of silently returning
# less; and a test asserts the count.
#
# The cap counts ROWS. Each row carries a document column whose size spans four
# orders of magnitude, so the same ten thousand rows are twenty megabytes or
# ninety-five gigabytes depending on which tenant asked.
#
# Nothing bounds the response in bytes.

10000 => row_limit
2 => median_row_kb
9500 => p99_row_kb
512000 => response_budget_kb
0 => limits_on_response_bytes
0 => callers_who_can_raise_the_row_limit
12000 => exports_per_day
41 => exports_that_exceeded_the_budget_last_month

row_limit * median_row_kb => median_response_kb
row_limit * p99_row_kb => worst_case_response_kb
int(response_budget_kb * 10000 / worst_case_response_kb) => budget_per_myriad_of_the_worst_case
int(worst_case_response_kb / median_response_kb) => worst_case_in_multiples_of_the_median

"row limit                       : " + str(row_limit) ^0
"callers who can raise it        : " + str(callers_who_can_raise_the_row_limit) ^0
"limits on response bytes        : " + str(limits_on_response_bytes) ^0
"" ^0
"median row, KB                  : " + str(median_row_kb) ^0
"  median response, KB           : " + str(median_response_kb) ^0
"p99 row, KB                     : " + str(p99_row_kb) ^0
"  worst case response, KB       : " + str(worst_case_response_kb) ^0
"  as multiples of the median    : " + str(worst_case_in_multiples_of_the_median) ^0
"" ^0
"response budget, KB             : " + str(response_budget_kb) ^0
"  as a share of the worst case  : " + str(budget_per_myriad_of_the_worst_case) + " per ten thousand" ^0
"exports per day                 : " + str(exports_per_day) ^0
"  that exceeded the budget      : " + str(exports_that_exceeded_the_budget_last_month) ^0
"" ^0

# ---- what the cap verified ----

"the row cap" ^0
"  applied as : a limit in the query" ^0
"  so the database materialises : only what is returned" ^0
"  a page-size parameter a caller can raise : " + str(callers_who_can_raise_the_row_limit) ^0
"  silent truncation : no; the response says it truncated" ^0
"  asserted by a test : yes" ^0
"  verdict : CAPPED" ^0
"" ^0
"  pushing the limit into the query rather than truncating" ^0
"  afterwards is the difference between a cap and a" ^0
"  politeness, and it is done" ^0
"" ^0

# ---- what a row costs ----

"the unit counted" ^0
"  what the cap counts : rows" ^0
"  what a response costs : bytes, to serialise, to buffer," ^0
"    to transfer" ^0
"  what relates them : a document column chosen by the" ^0
"    tenant" ^0
"  median row : " + str(median_row_kb) + " KB" ^0
"  p99 row    : " + str(p99_row_kb) + " KB" ^0
"  bounds on the second quantity : " + str(limits_on_response_bytes) ^0
"" ^0
"  the counted quantity is uniform and the spent one spans" ^0
"  four orders of magnitude" ^0
"" ^0
# ---- why the median tells you nothing ----

# Every load test, every staging run, and every developer's own export lands
# near the median, because most tenants store small documents. The distribution
# has a tail and the tail is a tenant, not a request.
"where the testing lands" ^0
"  a developer's own export : near the median" ^0
"  the load test's fixture  : near the median" ^0
"  staging data             : near the median" ^0
"  median response, KB      : " + str(median_response_kb) ^0
"  what selects the tail : which tenant asked, not which" ^0
"    request" ^0
"  worst case in multiples of the median : " + str(worst_case_in_multiples_of_the_median) ^0
"" ^0

# ---- the cap is doing something ----

# Without it a tenant with four million rows would export four million rows, and
# that is the failure the cap was written for. It works. The failure it was not
# written for is a tenant with ten thousand large ones.
"what the cap prevents" ^0
"  a four million row export : prevented" ^0
"  was that the observed failure : yes, and it stopped" ^0
"  a ten thousand row export of large documents : allowed" ^0
"  is that within the cap : exactly within it" ^0
"  exports over the budget last month : " + str(exports_that_exceeded_the_budget_last_month) ^0
"  of " + str(exports_per_day) + " a day" ^0
"" ^0

# ---- what the error looks like ----

"when it goes wrong" ^0
"  the query : returns, inside its own timeout" ^0
"  the row count : exactly " + str(row_limit) + ", as promised" ^0
"  the serialiser : allocates until the process is killed" ^0
"  the caller sees : a connection that closed" ^0
"  the export log records : a request that started" ^0
"  the row cap metric shows : compliance" ^0
"" ^0

# ---- null control ----

# The same cap, with the serialiser stopping at a byte budget and the response
# truncating on whichever bound is reached first.
1 => nc_limits_on_response_bytes
response_budget_kb => nc_worst_case_response_kb
0 => nc_exports_that_exceeded_the_budget

"null control - a byte budget beside the row cap" ^0
"  row limit : " + str(row_limit) + ", unchanged" ^0
"  limits on response bytes : " + str(nc_limits_on_response_bytes) ^0
"  worst case response, KB : " + str(nc_worst_case_response_kb) ^0
"  exports over the budget : " + str(nc_exports_that_exceeded_the_budget) ^0
"  the cap did not get lower; a second bound appeared on" ^0
"  the quantity the response is made of" ^0
"" ^0

# ---- the rule ----

"what a row cap guarantees" ^0
"  no response contains more than " + str(row_limit) + " rows : exactly," ^0
"    enforced in the query, with no parameter to raise it" ^0
"  no response is too large : not addressed; the cap is" ^0
"    denominated in rows and the resource is denominated" ^0
"    in bytes" ^0
"" ^0
"a bound on a count bounds the count; where each item has a" ^0
"size the caller controls, the count and the cost are related" ^0
"by a factor nobody bounded, and the bound that exists is" ^0
"tightest exactly where it was never needed" ^0
"" ^0

"The cap is enforced in the query rather than after it, with " + str(callers_who_can_raise_the_row_limit) + " ways for a caller" ^0
"to raise it and an explicit truncation flag in the response. It counts rows," ^0
"and a row is " + str(median_row_kb) + " KB at the median and " + str(p99_row_kb) + " at p99, so " + str(row_limit) + " rows are " + str(median_response_kb) ^0
"KB or " + str(worst_case_response_kb) + " - " + str(worst_case_in_multiples_of_the_median) + " times as much - against a " + str(response_budget_kb) + " KB budget the cap" ^0
"covers " + str(budget_per_myriad_of_the_worst_case) + " per ten thousand of, with " + str(limits_on_response_bytes) + " bounds on bytes anywhere." ^0
```

## Python (deterministic transpilation)

```python
row_limit = 10000
median_row_kb = 2
p99_row_kb = 9500
response_budget_kb = 512000
limits_on_response_bytes = 0
callers_who_can_raise_the_row_limit = 0
exports_per_day = 12000
exports_that_exceeded_the_budget_last_month = 41
median_response_kb = row_limit * median_row_kb
worst_case_response_kb = row_limit * p99_row_kb
budget_per_myriad_of_the_worst_case = int(response_budget_kb * 10000 / worst_case_response_kb)
worst_case_in_multiples_of_the_median = int(worst_case_response_kb / median_response_kb)
print("row limit                       : " + str(row_limit))
print("callers who can raise it        : " + str(callers_who_can_raise_the_row_limit))
print("limits on response bytes        : " + str(limits_on_response_bytes))
print("")
print("median row, KB                  : " + str(median_row_kb))
print("  median response, KB           : " + str(median_response_kb))
print("p99 row, KB                     : " + str(p99_row_kb))
print("  worst case response, KB       : " + str(worst_case_response_kb))
print("  as multiples of the median    : " + str(worst_case_in_multiples_of_the_median))
print("")
print("response budget, KB             : " + str(response_budget_kb))
print("  as a share of the worst case  : " + str(budget_per_myriad_of_the_worst_case) + " per ten thousand")
print("exports per day                 : " + str(exports_per_day))
print("  that exceeded the budget      : " + str(exports_that_exceeded_the_budget_last_month))
print("")
print("the row cap")
print("  applied as : a limit in the query")
print("  so the database materialises : only what is returned")
print("  a page-size parameter a caller can raise : " + str(callers_who_can_raise_the_row_limit))
print("  silent truncation : no; the response says it truncated")
print("  asserted by a test : yes")
print("  verdict : CAPPED")
print("")
print("  pushing the limit into the query rather than truncating")
print("  afterwards is the difference between a cap and a")
print("  politeness, and it is done")
print("")
print("the unit counted")
print("  what the cap counts : rows")
print("  what a response costs : bytes, to serialise, to buffer,")
print("    to transfer")
print("  what relates them : a document column chosen by the")
print("    tenant")
print("  median row : " + str(median_row_kb) + " KB")
print("  p99 row    : " + str(p99_row_kb) + " KB")
print("  bounds on the second quantity : " + str(limits_on_response_bytes))
print("")
print("  the counted quantity is uniform and the spent one spans")
print("  four orders of magnitude")
print("")
print("where the testing lands")
print("  a developer's own export : near the median")
print("  the load test's fixture  : near the median")
print("  staging data             : near the median")
print("  median response, KB      : " + str(median_response_kb))
print("  what selects the tail : which tenant asked, not which")
print("    request")
print("  worst case in multiples of the median : " + str(worst_case_in_multiples_of_the_median))
print("")
print("what the cap prevents")
print("  a four million row export : prevented")
print("  was that the observed failure : yes, and it stopped")
print("  a ten thousand row export of large documents : allowed")
print("  is that within the cap : exactly within it")
print("  exports over the budget last month : " + str(exports_that_exceeded_the_budget_last_month))
print("  of " + str(exports_per_day) + " a day")
print("")
print("when it goes wrong")
print("  the query : returns, inside its own timeout")
print("  the row count : exactly " + str(row_limit) + ", as promised")
print("  the serialiser : allocates until the process is killed")
print("  the caller sees : a connection that closed")
print("  the export log records : a request that started")
print("  the row cap metric shows : compliance")
print("")
nc_limits_on_response_bytes = 1
nc_worst_case_response_kb = response_budget_kb
nc_exports_that_exceeded_the_budget = 0
print("null control - a byte budget beside the row cap")
print("  row limit : " + str(row_limit) + ", unchanged")
print("  limits on response bytes : " + str(nc_limits_on_response_bytes))
print("  worst case response, KB : " + str(nc_worst_case_response_kb))
print("  exports over the budget : " + str(nc_exports_that_exceeded_the_budget))
print("  the cap did not get lower; a second bound appeared on")
print("  the quantity the response is made of")
print("")
print("what a row cap guarantees")
print("  no response contains more than " + str(row_limit) + " rows : exactly,")
print("    enforced in the query, with no parameter to raise it")
print("  no response is too large : not addressed; the cap is")
print("    denominated in rows and the resource is denominated")
print("    in bytes")
print("")
print("a bound on a count bounds the count; where each item has a")
print("size the caller controls, the count and the cost are related")
print("by a factor nobody bounded, and the bound that exists is")
print("tightest exactly where it was never needed")
print("")
print("The cap is enforced in the query rather than after it, with " + str(callers_who_can_raise_the_row_limit) + " ways for a caller")
print("to raise it and an explicit truncation flag in the response. It counts rows,")
print("and a row is " + str(median_row_kb) + " KB at the median and " + str(p99_row_kb) + " at p99, so " + str(row_limit) + " rows are " + str(median_response_kb))
print("KB or " + str(worst_case_response_kb) + " - " + str(worst_case_in_multiples_of_the_median) + " times as much - against a " + str(response_budget_kb) + " KB budget the cap")
print("covers " + str(budget_per_myriad_of_the_worst_case) + " per ten thousand of, with " + str(limits_on_response_bytes) + " bounds on bytes anywhere.")
```

## stdout (executed)

```text
row limit                       : 10000
callers who can raise it        : 0
limits on response bytes        : 0

median row, KB                  : 2
  median response, KB           : 20000
p99 row, KB                     : 9500
  worst case response, KB       : 95000000
  as multiples of the median    : 4750

response budget, KB             : 512000
  as a share of the worst case  : 53 per ten thousand
exports per day                 : 12000
  that exceeded the budget      : 41

the row cap
  applied as : a limit in the query
  so the database materialises : only what is returned
  a page-size parameter a caller can raise : 0
  silent truncation : no; the response says it truncated
  asserted by a test : yes
  verdict : CAPPED

  pushing the limit into the query rather than truncating
  afterwards is the difference between a cap and a
  politeness, and it is done

the unit counted
  what the cap counts : rows
  what a response costs : bytes, to serialise, to buffer,
    to transfer
  what relates them : a document column chosen by the
    tenant
  median row : 2 KB
  p99 row    : 9500 KB
  bounds on the second quantity : 0

  the counted quantity is uniform and the spent one spans
  four orders of magnitude

where the testing lands
  a developer's own export : near the median
  the load test's fixture  : near the median
  staging data             : near the median
  median response, KB      : 20000
  what selects the tail : which tenant asked, not which
    request
  worst case in multiples of the median : 4750

what the cap prevents
  a four million row export : prevented
  was that the observed failure : yes, and it stopped
  a ten thousand row export of large documents : allowed
  is that within the cap : exactly within it
  exports over the budget last month : 41
  of 12000 a day

when it goes wrong
  the query : returns, inside its own timeout
  the row count : exactly 10000, as promised
  the serialiser : allocates until the process is killed
  the caller sees : a connection that closed
  the export log records : a request that started
  the row cap metric shows : compliance

null control - a byte budget beside the row cap
  row limit : 10000, unchanged
  limits on response bytes : 1
  worst case response, KB : 512000
  exports over the budget : 0
  the cap did not get lower; a second bound appeared on
  the quantity the response is made of

what a row cap guarantees
  no response contains more than 10000 rows : exactly,
    enforced in the query, with no parameter to raise it
  no response is too large : not addressed; the cap is
    denominated in rows and the resource is denominated
    in bytes

a bound on a count bounds the count; where each item has a
size the caller controls, the count and the cost are related
by a factor nobody bounded, and the bound that exists is
tightest exactly where it was never needed

The cap is enforced in the query rather than after it, with 0 ways for a caller
to raise it and an explicit truncation flag in the response. It counts rows,
and a row is 2 KB at the median and 9500 at p99, so 10000 rows are 20000
KB or 95000000 - 4750 times as much - against a 512000 KB budget the cap
covers 53 per ten thousand of, with 0 bounds on bytes anywhere.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
