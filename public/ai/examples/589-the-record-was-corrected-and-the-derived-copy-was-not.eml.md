<!-- canonical: efficientnewlanguage.org/ai/examples/589-the-record-was-corrected-and-the-derived-copy-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 589 — The record was corrected and the derived copy was not

`the_record_was_corrected_and_the_derived_copy_was_not.eml` - Three hundred and forty records were corrected this quarter, each one verified against the source document. How many of the five places that hold a copy received the correction is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three hundred and
# forty records were corrected this quarter, each one verified against the
# source document. How many of the five places that hold a copy received the
# correction is computed below.
#
# The correction process is careful and it works. Each change is reviewed
# against the original document, applied in a single transaction, recorded in an
# audit trail with the reviewer's name, and reflected immediately in the system
# of record. Anyone querying the source gets the corrected value from the moment
# it is applied. That part has never failed.
#
# The copies were all built while this data was append-only. A search index that
# rebuilds nightly, a warehouse that reloads nightly, a feature set computed at
# training time, a document generated once and sent, and a partner feed that
# subscribes to creation events. Every one of those designs is reasonable for
# data that only ever grows.
#
# A correction is not an append. It is the first operation these pipelines were
# not built for, and each of them handles it in the way its own design implies -
# which for three of the five is not at all.

340 => corrections_this_quarter

# [copy, how it refreshes, does a correction reach it]
[["search index", "nightly full rebuild", 1], ["reporting warehouse", "nightly full ETL", 1], ["model features", "recomputed at training, quarterly", 0], ["sent documents", "generated once, delivered", 0], ["partner feed", "subscribes to created events", 0]] => copies

"corrections this quarter : " + str(corrections_this_quarter) ^0
"" ^0

"copy                  refresh mechanism                  receives corrections" ^0
0 => reached
0 => not_reached
for c in copies:
    if c[2] == 1:
        reached + 1 => reached
        "  " + c[0] + "       " + c[1] + "        yes" ^0
    else:
        not_reached + 1 => not_reached
        "  " + c[0] + "      " + c[1] + "   no" ^0
"" ^0

"  copies that receive corrections : " + str(reached) + " of " + str(reached + not_reached) ^0
"  copies that do not              : " + str(not_reached) ^0
"  wrong records in each of those  : " + str(corrections_this_quarter) ^0
"  wrong records across them       : " + str(not_reached * corrections_this_quarter) ^0
"" ^0

# ---- why the two that work, work ----
#
# Neither of them was designed to carry corrections. They carry them because a
# full rebuild reads the current state, and the current state is corrected.
# The property is accidental and it is not written down anywhere.

"why the search index and the warehouse are correct" ^0
"  designed to propagate corrections : no" ^0
"  mechanism                         : both discard and re-read everything" ^0
"  so a correction arrives the same way an insert does" ^0
"  the property is a side effect of full reload, not a feature" ^0
"  moving either one to incremental refresh would silently join the other" ^0
"  three, and incremental refresh is the standard optimisation" ^0
"" ^0

# ---- the partner feed ----
#
# It subscribes to created events. A correction emits updated. Nothing is
# dropped, nothing errors: the subscription simply does not match.

"the partner feed" ^0
"  events it subscribes to : created" ^0
"  event a correction emits: updated" ^0
"  events dropped          : 0" ^0
"  errors logged           : 0" ^0
"  deliveries              : exactly the ones it asked for" ^0
"  the subscription is working perfectly and does not include this" ^0
"" ^0

# ---- how long each copy stays wrong ----

"copy                  time until a correction reaches it" ^0
"  search index          under 24 hours" ^0
"  reporting warehouse   under 24 hours" ^0
"  model features        until the next quarterly retrain" ^0
"  sent documents        never, they are already delivered" ^0
"  partner feed          never, no event matches" ^0
"" ^0
"  two of the five have no path at all, so 'eventually' does not apply" ^0
"" ^0

# ---- what the audit trail shows ----
#
# It records that the correction was applied. It is right, and it is a record
# about the source, which is the one place that was never in doubt.

"the audit trail" ^0
"  corrections recorded  : " + str(corrections_this_quarter) ^0
"  corrections applied   : " + str(corrections_this_quarter) ^0
"  discrepancies         : 0" ^0
"  copies it mentions    : 0" ^0
"  it is a complete record of what happened to the source" ^0
"" ^0

# ---- the control ----
#
# The system of record. Query it and every corrected value is correct, every
# time. The correction process has never lost or misapplied a change.

"control - is the correction applied to the source" ^0
"  records corrected          : " + str(corrections_this_quarter) ^0
"  records showing the new value on query : " + str(corrections_this_quarter) ^0
"  failed applications        : 0" ^0
"  the process is correct, reviewed, and audited" ^0
"" ^0
"  and 'corrected' is a claim about one store out of six" ^0
"" ^0

# ---- the null control ----
#
# The same five copies over data that is genuinely append-only. Nothing is ever
# corrected, so nothing is ever missed, and all five designs are exactly right.
# The defect arrived with the first operation that was not an append.

0 => nc_corrections

"null control - the same five copies over append-only data" ^0
"  corrections            : " + str(nc_corrections) ^0
"  copies out of date     : " + str(nc_corrections) ^0
"  designs that are wrong : 0 of 5" ^0
"  same pipelines, same subscriptions, same refresh schedules" ^0
"  every one of them is correct until an update exists" ^0
"" ^0

# ---- the rule ----

"a derived copy, and the operation it was built for" ^0
"  insert    every copy handles it, that is what they were built for" ^0
"  correct   handled only by copies that discard and re-read" ^0
"  delete    the same, and usually worse" ^0
"  the copies that work do so accidentally, through full reload" ^0
"  and full reload is the thing an optimisation removes" ^0
"" ^0
"the question is not 'is the correction applied'" ^0
"it is 'list every place this value is held, and name the path a correction" ^0
"takes to each one'; three of the five paths here do not exist" ^0
"" ^0

"Every correction is reviewed against the source document, applied in one" ^0
"transaction, and recorded with the reviewer's name - and the system of record" ^0
"is right from that moment. " + str(reached) + " of the " + str(reached + not_reached) + " copies pick it up, both by discarding" ^0
"and re-reading everything rather than by carrying a correction. The other" ^0
"three hold " + str(not_reached * corrections_this_quarter) + " values that the audit trail records as corrected." ^0
```

## Python (deterministic transpilation)

```python
corrections_this_quarter = 340
copies = [["search index", "nightly full rebuild", 1], ["reporting warehouse", "nightly full ETL", 1], ["model features", "recomputed at training, quarterly", 0], ["sent documents", "generated once, delivered", 0], ["partner feed", "subscribes to created events", 0]]
print("corrections this quarter : " + str(corrections_this_quarter))
print("")
print("copy                  refresh mechanism                  receives corrections")
reached = 0
not_reached = 0
for c in copies:
    if c[2] == 1:
        reached = reached + 1
        print("  " + c[0] + "       " + c[1] + "        yes")
    else:
        not_reached = not_reached + 1
        print("  " + c[0] + "      " + c[1] + "   no")
print("")
print("  copies that receive corrections : " + str(reached) + " of " + str(reached + not_reached))
print("  copies that do not              : " + str(not_reached))
print("  wrong records in each of those  : " + str(corrections_this_quarter))
print("  wrong records across them       : " + str(not_reached * corrections_this_quarter))
print("")
print("why the search index and the warehouse are correct")
print("  designed to propagate corrections : no")
print("  mechanism                         : both discard and re-read everything")
print("  so a correction arrives the same way an insert does")
print("  the property is a side effect of full reload, not a feature")
print("  moving either one to incremental refresh would silently join the other")
print("  three, and incremental refresh is the standard optimisation")
print("")
print("the partner feed")
print("  events it subscribes to : created")
print("  event a correction emits: updated")
print("  events dropped          : 0")
print("  errors logged           : 0")
print("  deliveries              : exactly the ones it asked for")
print("  the subscription is working perfectly and does not include this")
print("")
print("copy                  time until a correction reaches it")
print("  search index          under 24 hours")
print("  reporting warehouse   under 24 hours")
print("  model features        until the next quarterly retrain")
print("  sent documents        never, they are already delivered")
print("  partner feed          never, no event matches")
print("")
print("  two of the five have no path at all, so 'eventually' does not apply")
print("")
print("the audit trail")
print("  corrections recorded  : " + str(corrections_this_quarter))
print("  corrections applied   : " + str(corrections_this_quarter))
print("  discrepancies         : 0")
print("  copies it mentions    : 0")
print("  it is a complete record of what happened to the source")
print("")
print("control - is the correction applied to the source")
print("  records corrected          : " + str(corrections_this_quarter))
print("  records showing the new value on query : " + str(corrections_this_quarter))
print("  failed applications        : 0")
print("  the process is correct, reviewed, and audited")
print("")
print("  and 'corrected' is a claim about one store out of six")
print("")
nc_corrections = 0
print("null control - the same five copies over append-only data")
print("  corrections            : " + str(nc_corrections))
print("  copies out of date     : " + str(nc_corrections))
print("  designs that are wrong : 0 of 5")
print("  same pipelines, same subscriptions, same refresh schedules")
print("  every one of them is correct until an update exists")
print("")
print("a derived copy, and the operation it was built for")
print("  insert    every copy handles it, that is what they were built for")
print("  correct   handled only by copies that discard and re-read")
print("  delete    the same, and usually worse")
print("  the copies that work do so accidentally, through full reload")
print("  and full reload is the thing an optimisation removes")
print("")
print("the question is not 'is the correction applied'")
print("it is 'list every place this value is held, and name the path a correction")
print("takes to each one'; three of the five paths here do not exist")
print("")
print("Every correction is reviewed against the source document, applied in one")
print("transaction, and recorded with the reviewer's name - and the system of record")
print("is right from that moment. " + str(reached) + " of the " + str(reached + not_reached) + " copies pick it up, both by discarding")
print("and re-reading everything rather than by carrying a correction. The other")
print("three hold " + str(not_reached * corrections_this_quarter) + " values that the audit trail records as corrected.")
```

## stdout (executed)

```text
corrections this quarter : 340

copy                  refresh mechanism                  receives corrections
  search index       nightly full rebuild        yes
  reporting warehouse       nightly full ETL        yes
  model features      recomputed at training, quarterly   no
  sent documents      generated once, delivered   no
  partner feed      subscribes to created events   no

  copies that receive corrections : 2 of 5
  copies that do not              : 3
  wrong records in each of those  : 340
  wrong records across them       : 1020

why the search index and the warehouse are correct
  designed to propagate corrections : no
  mechanism                         : both discard and re-read everything
  so a correction arrives the same way an insert does
  the property is a side effect of full reload, not a feature
  moving either one to incremental refresh would silently join the other
  three, and incremental refresh is the standard optimisation

the partner feed
  events it subscribes to : created
  event a correction emits: updated
  events dropped          : 0
  errors logged           : 0
  deliveries              : exactly the ones it asked for
  the subscription is working perfectly and does not include this

copy                  time until a correction reaches it
  search index          under 24 hours
  reporting warehouse   under 24 hours
  model features        until the next quarterly retrain
  sent documents        never, they are already delivered
  partner feed          never, no event matches

  two of the five have no path at all, so 'eventually' does not apply

the audit trail
  corrections recorded  : 340
  corrections applied   : 340
  discrepancies         : 0
  copies it mentions    : 0
  it is a complete record of what happened to the source

control - is the correction applied to the source
  records corrected          : 340
  records showing the new value on query : 340
  failed applications        : 0
  the process is correct, reviewed, and audited

  and 'corrected' is a claim about one store out of six

null control - the same five copies over append-only data
  corrections            : 0
  copies out of date     : 0
  designs that are wrong : 0 of 5
  same pipelines, same subscriptions, same refresh schedules
  every one of them is correct until an update exists

a derived copy, and the operation it was built for
  insert    every copy handles it, that is what they were built for
  correct   handled only by copies that discard and re-read
  delete    the same, and usually worse
  the copies that work do so accidentally, through full reload
  and full reload is the thing an optimisation removes

the question is not 'is the correction applied'
it is 'list every place this value is held, and name the path a correction
takes to each one'; three of the five paths here do not exist

Every correction is reviewed against the source document, applied in one
transaction, and recorded with the reviewer's name - and the system of record
is right from that moment. 2 of the 5 copies pick it up, both by discarding
and re-reading everything rather than by carrying a correction. The other
three hold 1020 values that the audit trail records as corrected.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
