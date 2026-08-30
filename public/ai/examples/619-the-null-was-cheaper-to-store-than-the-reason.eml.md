<!-- canonical: efficientnewlanguage.org/ai/examples/619-the-null-was-cheaper-to-store-than-the-reason | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 619 — The null was cheaper to store than the reason

`the_null_was_cheaper_to_store_than_the_reason.eml` - A column is null on nineteen percent of rows. Three different things produced those nulls. What can be recovered from them is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A column is null
# on nineteen percent of rows. Three different things produced those nulls.
# What can be recovered from them is computed below.
#
# Storing null was correct and it is what the column is for. The alternative
# was a sentinel value, and a sentinel in a numeric column is a number that
# enters averages, comparisons and sums as though it were data — which is the
# defect a nullable column exists to prevent. The schema is right, and it was
# argued about before it was chosen.
#
# Null is one symbol. The situations that produce it are not one situation, and
# the difference between them is what a reader of the column needs.
#
# The reason was known at write time by whichever code path wrote the row. It
# was not written down, because there was no column to write it in.

420000 => rows
1900 => null_per_myriad

int(rows * null_per_myriad / 10000) => null_rows
rows - null_rows => valued_rows

"rows                : " + str(rows) ^0
"rows with a null    : " + str(null_rows) ^0
"rows with a value   : " + str(valued_rows) ^0
"" ^0

# ---- the three writers ----

45 => not_asked_per_hundred
35 => declined_per_hundred
20 => failed_per_hundred

int(null_rows * not_asked_per_hundred / 100) => not_asked
int(null_rows * declined_per_hundred / 100) => declined
int(null_rows * failed_per_hundred / 100) => lookup_failed

"what wrote the null" ^0
"  the question was not asked      : " + str(not_asked) ^0
"  the person declined to answer   : " + str(declined) ^0
"  the lookup failed at write time : " + str(lookup_failed) ^0
"  total                           : " + str(not_asked + declined + lookup_failed) ^0
"" ^0
"  three different facts, one symbol, and the symbol is" ^0
"  identical in all three cases" ^0
"" ^0

# ---- what each consumer needs ----

"consumer                   needs to distinguish" ^0
"  the completeness report    not-asked from declined" ^0
"  the retry job              failed from the other two" ^0
"  the consent audit          declined from everything else" ^0
"  the average                all three, they are all excluded" ^0
"" ^0
"  three of the four cannot be answered from the column," ^0
"  and the fourth is the only one that ever gets computed" ^0
"" ^0

# ---- the retry job ----
#
# The lookups that failed can be retried and would probably succeed. Nothing
# can tell them from the ones that were never asked.

"the retry job, as it must be written" ^0
"  rows it can identify as retryable : 0" ^0
"  rows it would have to retry       : " + str(null_rows) ^0
"  rows that would succeed           : " + str(lookup_failed) ^0
"  rows retried pointlessly          : " + str(not_asked + declined) ^0
"" ^0
int((not_asked + declined) * 10000 / null_rows) => wasted_per_myriad
"  wasted work : " + str(wasted_per_myriad) + " per ten thousand of the retries" ^0
"" ^0
"  and " + str(declined) + " of them re-ask a person who already said no" ^0
"" ^0

# ---- what the completeness report says ----

int(valued_rows * 10000 / rows) => complete_per_myriad

"the completeness report" ^0
"  rows complete        : " + str(complete_per_myriad) + " per ten thousand" ^0
"  rows incomplete      : " + str(null_per_myriad) + " per ten thousand" ^0
"  of the incomplete, how many are answerable : not computable" ^0
"" ^0
"  the report is exactly right and the follow-up question is" ^0
"  the one anybody actually has" ^0
"" ^0

# ---- what recovering it would take now ----

"recovering the reason after the fact" ^0
"  from the column          : impossible, one symbol" ^0
"  from the write path      : the code no longer exists in that form" ^0
"  from the application log : retained 30 days, these rows are older" ^0
"  by re-asking             : possible, and re-asks the " + str(declined) + " who declined" ^0
"" ^0
"  the information existed at write time, cost one small column" ^0
"  to keep, and is now only obtainable by contacting people" ^0
"" ^0

# ---- the control ----
#
# The choice of null over a sentinel, on its own terms. A sentinel would have
# entered every aggregate as a number, and that is not a hypothetical failure.

"control - was null the right symbol" ^0
"  sentinel values in the average : 0" ^0
"  comparisons against a magic number : 0" ^0
"  rows where absent is treated as a value : 0" ^0
"  defects in the schema choice : 0" ^0
"" ^0
"  the column is correct; what is missing was never in it" ^0
"" ^0

# ---- the null control ----
#
# The same nullable column beside a reason column. The null stays null, the
# aggregates behave identically, nothing about the schema decision is revisited.

0 => nc_unattributable

"null control - the same null with a reason column beside it" ^0
"  nulls in the column      : " + str(null_rows) + ", unchanged" ^0
"  sentinel values          : 0, unchanged" ^0
"  nulls whose cause is unknown : " + str(nc_unattributable) ^0
"  retries that are pointless   : " + str(nc_unattributable) ^0
"  the symbol did not change; a second field records what the" ^0
"  first one was never able to say" ^0
"" ^0

# ---- the rule ----

"what a null records" ^0
"  there is no value here : exactly, and unambiguously" ^0
"  why there is no value  : nothing" ^0
"  and 'why' is the part every consumer downstream needs," ^0
"  because it is what decides whether to retry, to re-ask," ^0
"  to exclude, or to leave alone" ^0
"" ^0
"absence is not one state; it is at least three, and they are" ^0
"distinguishable only at the moment of writing, by the code" ^0
"that already knows which one it is" ^0
"" ^0

"The column is nullable rather than sentinel-valued, which is the right choice:" ^0
"0 magic numbers enter the averages and 0 rows treat absent as a value. Of the" ^0
str(null_rows) + " nulls, " + str(not_asked) + " were never asked, " + str(declined) + " were declined and " + str(lookup_failed) + " failed a" ^0
"lookup, and nothing distinguishes them, so a retry job must attempt all " + str(null_rows) ^0
"to reach " + str(lookup_failed) + " - " + str(wasted_per_myriad) + " per ten thousand wasted - while re-asking " + str(declined) + " people" ^0
"who already answered." ^0
```

## Python (deterministic transpilation)

```python
rows = 420000
null_per_myriad = 1900
null_rows = int(rows * null_per_myriad / 10000)
valued_rows = rows - null_rows
print("rows                : " + str(rows))
print("rows with a null    : " + str(null_rows))
print("rows with a value   : " + str(valued_rows))
print("")
not_asked_per_hundred = 45
declined_per_hundred = 35
failed_per_hundred = 20
not_asked = int(null_rows * not_asked_per_hundred / 100)
declined = int(null_rows * declined_per_hundred / 100)
lookup_failed = int(null_rows * failed_per_hundred / 100)
print("what wrote the null")
print("  the question was not asked      : " + str(not_asked))
print("  the person declined to answer   : " + str(declined))
print("  the lookup failed at write time : " + str(lookup_failed))
print("  total                           : " + str(not_asked + declined + lookup_failed))
print("")
print("  three different facts, one symbol, and the symbol is")
print("  identical in all three cases")
print("")
print("consumer                   needs to distinguish")
print("  the completeness report    not-asked from declined")
print("  the retry job              failed from the other two")
print("  the consent audit          declined from everything else")
print("  the average                all three, they are all excluded")
print("")
print("  three of the four cannot be answered from the column,")
print("  and the fourth is the only one that ever gets computed")
print("")
print("the retry job, as it must be written")
print("  rows it can identify as retryable : 0")
print("  rows it would have to retry       : " + str(null_rows))
print("  rows that would succeed           : " + str(lookup_failed))
print("  rows retried pointlessly          : " + str(not_asked + declined))
print("")
wasted_per_myriad = int((not_asked + declined) * 10000 / null_rows)
print("  wasted work : " + str(wasted_per_myriad) + " per ten thousand of the retries")
print("")
print("  and " + str(declined) + " of them re-ask a person who already said no")
print("")
complete_per_myriad = int(valued_rows * 10000 / rows)
print("the completeness report")
print("  rows complete        : " + str(complete_per_myriad) + " per ten thousand")
print("  rows incomplete      : " + str(null_per_myriad) + " per ten thousand")
print("  of the incomplete, how many are answerable : not computable")
print("")
print("  the report is exactly right and the follow-up question is")
print("  the one anybody actually has")
print("")
print("recovering the reason after the fact")
print("  from the column          : impossible, one symbol")
print("  from the write path      : the code no longer exists in that form")
print("  from the application log : retained 30 days, these rows are older")
print("  by re-asking             : possible, and re-asks the " + str(declined) + " who declined")
print("")
print("  the information existed at write time, cost one small column")
print("  to keep, and is now only obtainable by contacting people")
print("")
print("control - was null the right symbol")
print("  sentinel values in the average : 0")
print("  comparisons against a magic number : 0")
print("  rows where absent is treated as a value : 0")
print("  defects in the schema choice : 0")
print("")
print("  the column is correct; what is missing was never in it")
print("")
nc_unattributable = 0
print("null control - the same null with a reason column beside it")
print("  nulls in the column      : " + str(null_rows) + ", unchanged")
print("  sentinel values          : 0, unchanged")
print("  nulls whose cause is unknown : " + str(nc_unattributable))
print("  retries that are pointless   : " + str(nc_unattributable))
print("  the symbol did not change; a second field records what the")
print("  first one was never able to say")
print("")
print("what a null records")
print("  there is no value here : exactly, and unambiguously")
print("  why there is no value  : nothing")
print("  and 'why' is the part every consumer downstream needs,")
print("  because it is what decides whether to retry, to re-ask,")
print("  to exclude, or to leave alone")
print("")
print("absence is not one state; it is at least three, and they are")
print("distinguishable only at the moment of writing, by the code")
print("that already knows which one it is")
print("")
print("The column is nullable rather than sentinel-valued, which is the right choice:")
print("0 magic numbers enter the averages and 0 rows treat absent as a value. Of the")
print(str(null_rows) + " nulls, " + str(not_asked) + " were never asked, " + str(declined) + " were declined and " + str(lookup_failed) + " failed a")
print("lookup, and nothing distinguishes them, so a retry job must attempt all " + str(null_rows))
print("to reach " + str(lookup_failed) + " - " + str(wasted_per_myriad) + " per ten thousand wasted - while re-asking " + str(declined) + " people")
print("who already answered.")
```

## stdout (executed)

```text
rows                : 420000
rows with a null    : 79800
rows with a value   : 340200

what wrote the null
  the question was not asked      : 35910
  the person declined to answer   : 27930
  the lookup failed at write time : 15960
  total                           : 79800

  three different facts, one symbol, and the symbol is
  identical in all three cases

consumer                   needs to distinguish
  the completeness report    not-asked from declined
  the retry job              failed from the other two
  the consent audit          declined from everything else
  the average                all three, they are all excluded

  three of the four cannot be answered from the column,
  and the fourth is the only one that ever gets computed

the retry job, as it must be written
  rows it can identify as retryable : 0
  rows it would have to retry       : 79800
  rows that would succeed           : 15960
  rows retried pointlessly          : 63840

  wasted work : 8000 per ten thousand of the retries

  and 27930 of them re-ask a person who already said no

the completeness report
  rows complete        : 8100 per ten thousand
  rows incomplete      : 1900 per ten thousand
  of the incomplete, how many are answerable : not computable

  the report is exactly right and the follow-up question is
  the one anybody actually has

recovering the reason after the fact
  from the column          : impossible, one symbol
  from the write path      : the code no longer exists in that form
  from the application log : retained 30 days, these rows are older
  by re-asking             : possible, and re-asks the 27930 who declined

  the information existed at write time, cost one small column
  to keep, and is now only obtainable by contacting people

control - was null the right symbol
  sentinel values in the average : 0
  comparisons against a magic number : 0
  rows where absent is treated as a value : 0
  defects in the schema choice : 0

  the column is correct; what is missing was never in it

null control - the same null with a reason column beside it
  nulls in the column      : 79800, unchanged
  sentinel values          : 0, unchanged
  nulls whose cause is unknown : 0
  retries that are pointless   : 0
  the symbol did not change; a second field records what the
  first one was never able to say

what a null records
  there is no value here : exactly, and unambiguously
  why there is no value  : nothing
  and 'why' is the part every consumer downstream needs,
  because it is what decides whether to retry, to re-ask,
  to exclude, or to leave alone

absence is not one state; it is at least three, and they are
distinguishable only at the moment of writing, by the code
that already knows which one it is

The column is nullable rather than sentinel-valued, which is the right choice:
0 magic numbers enter the averages and 0 rows treat absent as a value. Of the
79800 nulls, 35910 were never asked, 27930 were declined and 15960 failed a
lookup, and nothing distinguishes them, so a retry job must attempt all 79800
to reach 15960 - 8000 per ten thousand wasted - while re-asking 27930 people
who already answered.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
