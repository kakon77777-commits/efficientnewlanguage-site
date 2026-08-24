<!-- canonical: efficientnewlanguage.org/ai/examples/528-the-field-stopped-being-null-and-killed-the-branch | ai_layer_version: 0.1.0 | updated: 2026-08-24 -->

# Example 528 — The field stopped being null and killed the branch

`the_field_stopped_being_null_and_killed_the_branch.eml` - A nullable field was backfilled and now always has a value. What that did to the code written for the null case is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A nullable field
# was backfilled and now always has a value. What that did to the code written
# for the null case is computed below.
#
# Backfilling was right. A third of records had no assigned region, every
# report had to explain a bucket called unknown, and the backfill used the
# billing address, which is the same source the field was always supposed to
# come from. The data is better and the reports are simpler.
#
# The null was carrying information: it meant nobody had determined a region
# yet. Consumers written against that meaning have a branch for it, and after
# the backfill that branch stops executing. The branch is still there, still
# compiles, still has its test, and never runs again - so a case that used to
# be handled is now handled by code that is unreachable.
#
# Records are counted before and after, with what each branch did.

# [quarter, records, with a region, null region]
[["before", 900000, 604000, 296000], ["after", 900000, 900000, 0]] => states

states[0] => before
states[1] => after
"state    records   with region   null region" ^0
for s in states:
    "  " + s[0] + "   " + str(s[1]) + "     " + str(s[2]) + "       " + str(s[3]) ^0
"" ^0
"nulls removed : " + str(before[3]) + ", " + str(int(before[3] * 100 / before[1])) + "% of all records" ^0
"" ^0

# ---- the branches written for null ----

# [consumer, what its null branch did, was that correct, runs after the backfill]
[["tax calculator", "applies the default rate and flags for review", "yes", "no"], ["shipping quote", "asks the user to confirm their region", "yes", "no"], ["regional report", "counts it in unknown", "yes", "no"], ["fraud score", "adds risk points for missing data", "yes", "no"], ["export", "writes an empty string", "yes", "no"]] => branches

"consumer           null branch                              still runs" ^0
0 => dead
for b in branches:
    if b[3] == "no":
        dead + 1 => dead
    "  " + b[0] + "   " + b[1] + "   " + b[3] ^0
"  branches that no longer execute : " + str(dead) + " of " + str(len(branches)) ^0
"  branches deleted : 0" ^0
"  branches whose tests still pass : " + str(len(branches)) ^0
"" ^0

# ---- the tests ----

"the test suite after the backfill" ^0
"  tests covering the null branch : " + str(len(branches)) ^0
"  those tests construct a record with a null region themselves" ^0
"  so they pass, and they are the only place a null region now exists" ^0
"  a test that builds its own input cannot notice that production stopped" ^0
"  producing that input" ^0
"" ^0

# ---- what the two states meant ----

"what a region value meant, before and after" ^0
"  before, a value : somebody or something determined the region" ^0
"  before, a null  : nobody had determined it yet" ^0
"  after, a value  : either of the above" ^0
"  the field lost the ability to say the second thing, and no field gained" ^0
"  it" ^0
"" ^0

# ---- the consumer that needed the distinction ----

for b in branches:
    if b[0] == "fraud score":
        "the fraud score in detail" ^0
        "  its null branch : " + b[1] ^0
        "  records that used to take it : " + str(before[3]) ^0
        "  records that take it now     : 0" ^0
        "  a missing region was a weak fraud signal and it was a real one" ^0
        "  the signal is not wrong now, it is absent, and the score does not" ^0
        "  distinguish an absent signal from a negative one" ^0
"" ^0

# ---- how good the backfilled values are ----

# [source used by the backfill, records, accuracy percent]
[["billing address present", 240000, 99], ["billing address missing, guessed from IP", 44000, 71], ["neither, defaulted to the largest region", 12000, 34]] => filled
0 => filled_total
0 => weighted
for f in filled:
    filled_total + f[1] => filled_total
    weighted + f[1] * f[2] => weighted
"where the backfilled values came from" ^0
for f in filled:
    "  " + f[0] + " : " + str(f[1]) + " records, " + str(f[2]) + "% accurate" ^0
"  backfilled records : " + str(filled_total) ^0
"  weighted accuracy  : " + str(int(weighted / filled_total)) + "%" ^0
"  wrong values introduced : " + str(filled_total - int(weighted / 100)) ^0
"  before the backfill those records said nothing; now some of them say" ^0
"  something incorrect, and nothing marks which" ^0
"" ^0

# ---- what would have preserved the distinction ----

"keeping both facts" ^0
"  region        : the value, backfilled" ^0
"  region_source : determined, inferred, or defaulted" ^0
"  cost : one column" ^0
"  consumers that could then behave as before : " + str(len(branches)) ^0
"  the fraud score would key on the source rather than on the null, and" ^0
"  the tax calculator would still flag the defaulted ones for review" ^0
"" ^0

# ---- the control: a field that was never nullable ----
#
# Where the field always had a value, no consumer has a branch for its absence
# and a backfill of other rows changes nothing about how it is read.

[["currency", 900000, 900000, 0, 0]] => never_null
for u in never_null:
    "control - " + u[0] + ", non-null since the first release" ^0
    "  records : " + str(u[1]) + ", with a value : " + str(u[2]) + ", null : " + str(u[3]) ^0
    "  consumer branches written for its absence : " + str(u[4]) ^0
    "  there is nothing here to make unreachable, because nobody ever had to" ^0
    "  decide what its absence meant" ^0
"" ^0

"The backfill used the right source and the reports are simpler for it." ^0
"A null meant nobody had determined the region, " + str(dead) + " consumers had a branch" ^0
"for that, and all " + str(dead) + " of them still compile and never run." ^0
```

## Python (deterministic transpilation)

```python
states = [["before", 900000, 604000, 296000], ["after", 900000, 900000, 0]]
before = states[0]
after = states[1]
print("state    records   with region   null region")
for s in states:
    print("  " + s[0] + "   " + str(s[1]) + "     " + str(s[2]) + "       " + str(s[3]))
print("")
print("nulls removed : " + str(before[3]) + ", " + str(int(before[3] * 100 / before[1])) + "% of all records")
print("")
branches = [["tax calculator", "applies the default rate and flags for review", "yes", "no"], ["shipping quote", "asks the user to confirm their region", "yes", "no"], ["regional report", "counts it in unknown", "yes", "no"], ["fraud score", "adds risk points for missing data", "yes", "no"], ["export", "writes an empty string", "yes", "no"]]
print("consumer           null branch                              still runs")
dead = 0
for b in branches:
    if b[3] == "no":
        dead = dead + 1
    print("  " + b[0] + "   " + b[1] + "   " + b[3])
print("  branches that no longer execute : " + str(dead) + " of " + str(len(branches)))
print("  branches deleted : 0")
print("  branches whose tests still pass : " + str(len(branches)))
print("")
print("the test suite after the backfill")
print("  tests covering the null branch : " + str(len(branches)))
print("  those tests construct a record with a null region themselves")
print("  so they pass, and they are the only place a null region now exists")
print("  a test that builds its own input cannot notice that production stopped")
print("  producing that input")
print("")
print("what a region value meant, before and after")
print("  before, a value : somebody or something determined the region")
print("  before, a null  : nobody had determined it yet")
print("  after, a value  : either of the above")
print("  the field lost the ability to say the second thing, and no field gained")
print("  it")
print("")
for b in branches:
    if b[0] == "fraud score":
        print("the fraud score in detail")
        print("  its null branch : " + b[1])
        print("  records that used to take it : " + str(before[3]))
        print("  records that take it now     : 0")
        print("  a missing region was a weak fraud signal and it was a real one")
        print("  the signal is not wrong now, it is absent, and the score does not")
        print("  distinguish an absent signal from a negative one")
print("")
filled = [["billing address present", 240000, 99], ["billing address missing, guessed from IP", 44000, 71], ["neither, defaulted to the largest region", 12000, 34]]
filled_total = 0
weighted = 0
for f in filled:
    filled_total = filled_total + f[1]
    weighted = weighted + f[1] * f[2]
print("where the backfilled values came from")
for f in filled:
    print("  " + f[0] + " : " + str(f[1]) + " records, " + str(f[2]) + "% accurate")
print("  backfilled records : " + str(filled_total))
print("  weighted accuracy  : " + str(int(weighted / filled_total)) + "%")
print("  wrong values introduced : " + str(filled_total - int(weighted / 100)))
print("  before the backfill those records said nothing; now some of them say")
print("  something incorrect, and nothing marks which")
print("")
print("keeping both facts")
print("  region        : the value, backfilled")
print("  region_source : determined, inferred, or defaulted")
print("  cost : one column")
print("  consumers that could then behave as before : " + str(len(branches)))
print("  the fraud score would key on the source rather than on the null, and")
print("  the tax calculator would still flag the defaulted ones for review")
print("")
never_null = [["currency", 900000, 900000, 0, 0]]
for u in never_null:
    print("control - " + u[0] + ", non-null since the first release")
    print("  records : " + str(u[1]) + ", with a value : " + str(u[2]) + ", null : " + str(u[3]))
    print("  consumer branches written for its absence : " + str(u[4]))
    print("  there is nothing here to make unreachable, because nobody ever had to")
    print("  decide what its absence meant")
print("")
print("The backfill used the right source and the reports are simpler for it.")
print("A null meant nobody had determined the region, " + str(dead) + " consumers had a branch")
print("for that, and all " + str(dead) + " of them still compile and never run.")
```

## stdout (executed)

```text
state    records   with region   null region
  before   900000     604000       296000
  after   900000     900000       0

nulls removed : 296000, 32% of all records

consumer           null branch                              still runs
  tax calculator   applies the default rate and flags for review   no
  shipping quote   asks the user to confirm their region   no
  regional report   counts it in unknown   no
  fraud score   adds risk points for missing data   no
  export   writes an empty string   no
  branches that no longer execute : 5 of 5
  branches deleted : 0
  branches whose tests still pass : 5

the test suite after the backfill
  tests covering the null branch : 5
  those tests construct a record with a null region themselves
  so they pass, and they are the only place a null region now exists
  a test that builds its own input cannot notice that production stopped
  producing that input

what a region value meant, before and after
  before, a value : somebody or something determined the region
  before, a null  : nobody had determined it yet
  after, a value  : either of the above
  the field lost the ability to say the second thing, and no field gained
  it

the fraud score in detail
  its null branch : adds risk points for missing data
  records that used to take it : 296000
  records that take it now     : 0
  a missing region was a weak fraud signal and it was a real one
  the signal is not wrong now, it is absent, and the score does not
  distinguish an absent signal from a negative one

where the backfilled values came from
  billing address present : 240000 records, 99% accurate
  billing address missing, guessed from IP : 44000 records, 71% accurate
  neither, defaulted to the largest region : 12000 records, 34% accurate
  backfilled records : 296000
  weighted accuracy  : 92%
  wrong values introduced : 23080
  before the backfill those records said nothing; now some of them say
  something incorrect, and nothing marks which

keeping both facts
  region        : the value, backfilled
  region_source : determined, inferred, or defaulted
  cost : one column
  consumers that could then behave as before : 5
  the fraud score would key on the source rather than on the null, and
  the tax calculator would still flag the defaulted ones for review

control - currency, non-null since the first release
  records : 900000, with a value : 900000, null : 0
  consumer branches written for its absence : 0
  there is nothing here to make unreachable, because nobody ever had to
  decide what its absence meant

The backfill used the right source and the reports are simpler for it.
A null meant nobody had determined the region, 5 consumers had a branch
for that, and all 5 of them still compile and never run.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
