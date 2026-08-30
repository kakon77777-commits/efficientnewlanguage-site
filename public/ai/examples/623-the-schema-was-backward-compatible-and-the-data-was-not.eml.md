<!-- canonical: efficientnewlanguage.org/ai/examples/623-the-schema-was-backward-compatible-and-the-data-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 623 — The schema was backward compatible and the data was not

`the_schema_was_backward_compatible_and_the_data_was_not.eml` - A field is added with a default. Every old reader keeps working and the compatibility checker passes. What the old rows now say is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A field is added
# with a default. Every old reader keeps working and the compatibility checker
# passes. What the old rows now say is computed below.
#
# Adding an optional field with a default is the textbook compatible change and
# it is genuinely compatible. A reader written before the change ignores the
# field; a reader written after it gets the default where the writer said
# nothing. No deserialiser throws, no consumer needs redeploying, and the
# checker that enforces this is not a formality — it has blocked six
# incompatible changes this year.
#
# Compatibility is a property of the SCHEMAS. It says a reader of version N can
# parse data written at version N plus one, and it says nothing about whether
# the value it reads is true of that record.
#
# The default is applied to rows written before the field existed, and for
# those rows the default is an assertion nobody made.

2400000 => rows_total
1850000 => rows_before_the_change
6 => incompatible_changes_blocked

rows_total - rows_before_the_change => rows_after_the_change
# Named rather than folded into the count line: writing that line as
# `rows_total - rows_after` computes exactly the defaulted rows and then
# the prose added the genuinely-false ones on top of a number that did
# not contain them.
31000 => genuinely_false

"rows in the table           : " + str(rows_total) ^0
"written before the change   : " + str(rows_before_the_change) ^0
"written after               : " + str(rows_after_the_change) ^0
"" ^0

# ---- what the checker verified ----

"the compatibility checker" ^0
"  old readers parse new data : yes" ^0
"  new readers parse old data : yes" ^0
"  deserialisation failures   : 0" ^0
"  consumers needing redeploy : 0" ^0
"  incompatible changes blocked this year : " + str(incompatible_changes_blocked) ^0
"" ^0
"  every one of those is true and the checker is not a" ^0
"  formality" ^0
"" ^0

# ---- what a new reader sees ----

"the new field: verified, a boolean, default false" ^0
"  rows where a writer set it : " + str(rows_after_the_change) ^0
"  rows where the default applies : " + str(rows_before_the_change) ^0
"  rows where false means 'not verified' : " + str(rows_after_the_change) ^0
"  rows where false means 'nobody said'  : " + str(rows_before_the_change) ^0
"" ^0
int(rows_before_the_change * 10000 / rows_total) => defaulted_per_myriad
"  share carrying an unstated value : " + str(defaulted_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- the query that reads it ----

"a report counting unverified accounts" ^0
"  written after the change : yes" ^0
"  reads the field          : yes, correctly" ^0
"  rows genuinely false, checked by somebody : " + str(genuinely_false) ^0
"  rows false by default                    : " + str(rows_before_the_change) ^0
"  rows it counts                           : " + str(genuinely_false + rows_before_the_change) ^0
"  rows that are unverified because somebody checked : some" ^0
"  rows that are unverified because the field did not exist : " + str(rows_before_the_change) ^0
"" ^0
"  the query is correct, the field is correct, and the count" ^0
"  is dominated by rows the question was not about" ^0
"" ^0

# ---- what the default would have to be to avoid this ----

"choosing the default" ^0
"  false : old rows claim unverified, which is untrue of most" ^0
"  true  : old rows claim verified, which is worse" ^0
"  null  : old rows say nothing, and every reader must handle it" ^0
"" ^0
"  the third is the only one that is true, and it is the one" ^0
"  the compatibility rule discourages, because a nullable field" ^0
"  pushes work onto readers" ^0
"" ^0

# ---- the migration that was not run ----
#
# Backfilling the field for old rows is the step that makes the default true.
# It is not required for compatibility, so it is not part of the change.

0 => rows_backfilled

"the backfill" ^0
"  rows needing one   : " + str(rows_before_the_change) ^0
"  rows backfilled    : " + str(rows_backfilled) ^0
"  required by the compatibility checker : no" ^0
"  required for the data to be true      : yes" ^0
"" ^0
"  the checker and the backfill are answering two questions and" ^0
"  only one of them has a gate" ^0
"" ^0

# ---- the divergence by cohort ----

"cohort            rows        field means" ^0
for c in [1:3]:
    c * 600000 => n
    "  before change    " + str(n) + "      nothing was said" ^0
"  after change     " + str(rows_after_the_change) + "       a writer decided" ^0
"" ^0

# ---- the control ----
#
# The compatibility checker, against what it is for. It stops changes that
# break readers, and it has stopped six.

"control - is the checker earning its place" ^0
"  incompatible changes blocked : " + str(incompatible_changes_blocked) ^0
"  reader outages from schema changes : 0" ^0
"  false blocks                 : 0" ^0
"  defects in the checker       : 0" ^0
"" ^0
"  removing it returns the outages it prevents and does not" ^0
"  make one old row more true" ^0
"" ^0

# ---- the null control ----
#
# The same change, same default, same checker, with a backfill run before the
# field is read. The schema, the readers and the compatibility verdict are
# identical.

rows_before_the_change => nc_backfilled
0 => nc_unstated

"null control - the same change with the backfill run" ^0
"  compatibility verdict : compatible, unchanged" ^0
"  rows backfilled       : " + str(nc_backfilled) ^0
"  rows carrying an unstated value : " + str(nc_unstated) ^0
"  the report's count    : only rows somebody checked" ^0
"  the schema did not change; the data caught up to it" ^0
"" ^0

# ---- the rule ----

"what backward compatible guarantees" ^0
"  old code will not break on new data : exactly" ^0
"  new code will not break on old data : exactly" ^0
"  the values new code reads are true  : not addressed, and a" ^0
"    default is the mechanism that makes the guarantee hold" ^0
"    while making the values untrue" ^0
"" ^0
"a compatible schema change has two halves: the schema, which a" ^0
"checker can gate, and the data, which nothing does; the second" ^0
"half is where the default becomes a claim" ^0
"" ^0

"The change is compatible and the checker is right to pass it: 0 deserialisation" ^0
"failures, 0 consumers redeployed, and " + str(incompatible_changes_blocked) + " genuinely incompatible changes blocked" ^0
"this year. The default lands on " + str(rows_before_the_change) + " rows written before the field existed -" ^0
str(defaulted_per_myriad) + " per ten thousand of the table - where false means nobody said rather" ^0
"than somebody checked, " + str(rows_backfilled) + " have been backfilled, and no gate asks for it." ^0
```

## Python (deterministic transpilation)

```python
rows_total = 2400000
rows_before_the_change = 1850000
incompatible_changes_blocked = 6
rows_after_the_change = rows_total - rows_before_the_change
genuinely_false = 31000
print("rows in the table           : " + str(rows_total))
print("written before the change   : " + str(rows_before_the_change))
print("written after               : " + str(rows_after_the_change))
print("")
print("the compatibility checker")
print("  old readers parse new data : yes")
print("  new readers parse old data : yes")
print("  deserialisation failures   : 0")
print("  consumers needing redeploy : 0")
print("  incompatible changes blocked this year : " + str(incompatible_changes_blocked))
print("")
print("  every one of those is true and the checker is not a")
print("  formality")
print("")
print("the new field: verified, a boolean, default false")
print("  rows where a writer set it : " + str(rows_after_the_change))
print("  rows where the default applies : " + str(rows_before_the_change))
print("  rows where false means 'not verified' : " + str(rows_after_the_change))
print("  rows where false means 'nobody said'  : " + str(rows_before_the_change))
print("")
defaulted_per_myriad = int(rows_before_the_change * 10000 / rows_total)
print("  share carrying an unstated value : " + str(defaulted_per_myriad) + " per ten thousand")
print("")
print("a report counting unverified accounts")
print("  written after the change : yes")
print("  reads the field          : yes, correctly")
print("  rows genuinely false, checked by somebody : " + str(genuinely_false))
print("  rows false by default                    : " + str(rows_before_the_change))
print("  rows it counts                           : " + str(genuinely_false + rows_before_the_change))
print("  rows that are unverified because somebody checked : some")
print("  rows that are unverified because the field did not exist : " + str(rows_before_the_change))
print("")
print("  the query is correct, the field is correct, and the count")
print("  is dominated by rows the question was not about")
print("")
print("choosing the default")
print("  false : old rows claim unverified, which is untrue of most")
print("  true  : old rows claim verified, which is worse")
print("  null  : old rows say nothing, and every reader must handle it")
print("")
print("  the third is the only one that is true, and it is the one")
print("  the compatibility rule discourages, because a nullable field")
print("  pushes work onto readers")
print("")
rows_backfilled = 0
print("the backfill")
print("  rows needing one   : " + str(rows_before_the_change))
print("  rows backfilled    : " + str(rows_backfilled))
print("  required by the compatibility checker : no")
print("  required for the data to be true      : yes")
print("")
print("  the checker and the backfill are answering two questions and")
print("  only one of them has a gate")
print("")
print("cohort            rows        field means")
for c in range(1, 4):
    n = c * 600000
    print("  before change    " + str(n) + "      nothing was said")
print("  after change     " + str(rows_after_the_change) + "       a writer decided")
print("")
print("control - is the checker earning its place")
print("  incompatible changes blocked : " + str(incompatible_changes_blocked))
print("  reader outages from schema changes : 0")
print("  false blocks                 : 0")
print("  defects in the checker       : 0")
print("")
print("  removing it returns the outages it prevents and does not")
print("  make one old row more true")
print("")
nc_backfilled = rows_before_the_change
nc_unstated = 0
print("null control - the same change with the backfill run")
print("  compatibility verdict : compatible, unchanged")
print("  rows backfilled       : " + str(nc_backfilled))
print("  rows carrying an unstated value : " + str(nc_unstated))
print("  the report's count    : only rows somebody checked")
print("  the schema did not change; the data caught up to it")
print("")
print("what backward compatible guarantees")
print("  old code will not break on new data : exactly")
print("  new code will not break on old data : exactly")
print("  the values new code reads are true  : not addressed, and a")
print("    default is the mechanism that makes the guarantee hold")
print("    while making the values untrue")
print("")
print("a compatible schema change has two halves: the schema, which a")
print("checker can gate, and the data, which nothing does; the second")
print("half is where the default becomes a claim")
print("")
print("The change is compatible and the checker is right to pass it: 0 deserialisation")
print("failures, 0 consumers redeployed, and " + str(incompatible_changes_blocked) + " genuinely incompatible changes blocked")
print("this year. The default lands on " + str(rows_before_the_change) + " rows written before the field existed -")
print(str(defaulted_per_myriad) + " per ten thousand of the table - where false means nobody said rather")
print("than somebody checked, " + str(rows_backfilled) + " have been backfilled, and no gate asks for it.")
```

## stdout (executed)

```text
rows in the table           : 2400000
written before the change   : 1850000
written after               : 550000

the compatibility checker
  old readers parse new data : yes
  new readers parse old data : yes
  deserialisation failures   : 0
  consumers needing redeploy : 0
  incompatible changes blocked this year : 6

  every one of those is true and the checker is not a
  formality

the new field: verified, a boolean, default false
  rows where a writer set it : 550000
  rows where the default applies : 1850000
  rows where false means 'not verified' : 550000
  rows where false means 'nobody said'  : 1850000

  share carrying an unstated value : 7708 per ten thousand

a report counting unverified accounts
  written after the change : yes
  reads the field          : yes, correctly
  rows genuinely false, checked by somebody : 31000
  rows false by default                    : 1850000
  rows it counts                           : 1881000
  rows that are unverified because somebody checked : some
  rows that are unverified because the field did not exist : 1850000

  the query is correct, the field is correct, and the count
  is dominated by rows the question was not about

choosing the default
  false : old rows claim unverified, which is untrue of most
  true  : old rows claim verified, which is worse
  null  : old rows say nothing, and every reader must handle it

  the third is the only one that is true, and it is the one
  the compatibility rule discourages, because a nullable field
  pushes work onto readers

the backfill
  rows needing one   : 1850000
  rows backfilled    : 0
  required by the compatibility checker : no
  required for the data to be true      : yes

  the checker and the backfill are answering two questions and
  only one of them has a gate

cohort            rows        field means
  before change    600000      nothing was said
  before change    1200000      nothing was said
  before change    1800000      nothing was said
  after change     550000       a writer decided

control - is the checker earning its place
  incompatible changes blocked : 6
  reader outages from schema changes : 0
  false blocks                 : 0
  defects in the checker       : 0

  removing it returns the outages it prevents and does not
  make one old row more true

null control - the same change with the backfill run
  compatibility verdict : compatible, unchanged
  rows backfilled       : 1850000
  rows carrying an unstated value : 0
  the report's count    : only rows somebody checked
  the schema did not change; the data caught up to it

what backward compatible guarantees
  old code will not break on new data : exactly
  new code will not break on old data : exactly
  the values new code reads are true  : not addressed, and a
    default is the mechanism that makes the guarantee hold
    while making the values untrue

a compatible schema change has two halves: the schema, which a
checker can gate, and the data, which nothing does; the second
half is where the default becomes a claim

The change is compatible and the checker is right to pass it: 0 deserialisation
failures, 0 consumers redeployed, and 6 genuinely incompatible changes blocked
this year. The default lands on 1850000 rows written before the field existed -
7708 per ten thousand of the table - where false means nobody said rather
than somebody checked, 0 have been backfilled, and no gate asks for it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
