<!-- canonical: efficientnewlanguage.org/ai/examples/561-the-migration-finished-and-both-writers-kept-writing | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 561 — The migration finished and both writers kept writing

`the_migration_finished_and_both_writers_kept_writing.eml` - The migration from the old store to the new one completed twelve months ago and was signed off. Both stores are still being written to. What is in each of them is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The migration
# from the old store to the new one completed twelve months ago and was signed
# off. Both stores are still being written to. What is in each of them is
# computed below.
#
# Dual-writing during a migration is correct and the cutover plan was a good one.
# Writing to both stores means the old one stays a live fallback rather than a
# frozen snapshot, so a rollback loses nothing. Reads were moved to the new
# store first and watched for a week before anything else changed. The
# verification at cutover compared every write path in both stores and found
# them identical. All of that is textbook.
#
# The dual-write was behind a flag that defaults to on, and the cleanup ticket
# to remove it was closed as part of a general backlog sweep. That is the whole
# defect and it costs nothing on the day it happens: both stores still agree.
#
# Divergence does not start when the flag is left on. It starts the first time
# somebody adds a write path, because a new path is written against the current
# architecture, which has one store in it. The old store stops receiving what it
# never knew to expect.

12 => months
1000 => writes_per_path_per_month

# write paths that existed at cutover, dual-written
6 => original_paths

# [month added, writes per month] - added after cutover, new store only
[[2, 800], [4, 800], [6, 800], [8, 800], [10, 800]] => added_paths

original_paths * writes_per_path_per_month * months => old_store

"paths at cutover, dual-written : " + str(original_paths) ^0
"paths added since, new store only: 5" ^0
"" ^0

"month added   writes/month   months active   records in new store only" ^0
0 => new_only
for p in added_paths:
    months - p[0] + 1 => active_months
    p[1] * active_months => contributed
    new_only + contributed => new_only
    "  " + str(p[0]) + "             " + str(p[1]) + "            " + str(active_months) + "              " + str(contributed) ^0
"" ^0

old_store + new_only => new_store

"old store : " + str(old_store) + " records" ^0
"new store : " + str(new_store) + " records" ^0
"divergence: " + str(new_store - old_store) + ", which is " + str(int((new_store - old_store) * 100 / new_store)) + " percent of the new store" ^0
"" ^0

# ---- what reads the old store ----
#
# Nothing in the request path. The quarterly compliance extract does, because
# it was written before the migration and pointed at the store that existed
# then. Repointing it was not on the cutover checklist, because the cutover
# checklist listed write paths.

"the quarterly compliance extract reads the old store" ^0
"  records it reports : " + str(old_store) ^0
"  records that exist : " + str(new_store) ^0
"  it reports " + str(int(old_store * 100 / new_store)) + " percent of the population and returns no error" ^0
"  every record it returns is a real record with correct fields" ^0
"" ^0

# ---- the cost of the flag that was left on ----

"the dual write itself" ^0
"  writes sent to the old store  : " + str(old_store) ^0
"  reads served from it in the request path : 0" ^0
"  so " + str(old_store) + " writes were paid for and " + str(old_store) + " were not read" ^0
"  the flag costs write latency on every request for twelve months" ^0
"" ^0

# ---- the control ----
#
# Compare the two stores across the paths that existed at cutover. This is what
# the cutover verification checked, and it is what any spot check of "did the
# migration work" would check. Those paths still dual-write, so they agree
# exactly.

original_paths * writes_per_path_per_month * months => old_original
original_paths * writes_per_path_per_month * months => new_original

"control - compare the stores across the paths the migration covered" ^0
"  old store, original paths : " + str(old_original) ^0
"  new store, original paths : " + str(new_original) ^0
"  difference                : " + str(new_original - old_original) ^0
"  the migration is verifiably correct, and it is still correct today" ^0
"  a check aimed at the migration examines exactly the paths that still work" ^0
"" ^0

# ---- the null control ----
#
# The same flag, left on for the same twelve months, with no new write paths
# added. The stores stay identical. The un-flipped flag costs wasted writes and
# nothing else. So "the flag was left on" is not the divergence; it is what
# makes a later, unrelated, correct change produce one.

"null control - the same flag left on, no new write paths added" ^0
"  old store : " + str(old_store) ^0
"  new store : " + str(old_store) ^0
"  divergence: 0" ^0
"  cost      : " + str(old_store) + " wasted writes, and no wrong answers" ^0
"  the divergence needs a second event, and that event is ordinary work" ^0
"" ^0

# ---- what the two halves each got right ----

"the person who added path 7 in month 2" ^0
"  wrote against the current architecture      correct" ^0
"  wrote to the store that reads are served from  correct" ^0
"  did not write to a store the docs call retired correct" ^0
"  had no way to know a consumer still read it    the docs said the migration was done" ^0
"" ^0
"the cutover checklist" ^0
"  listed every write path                     complete on the day" ^0
"  listed every read path                      complete on the day" ^0
"  named the store that must stop being written    yes, in the cleanup ticket" ^0
"  survived the closing of that ticket             no" ^0
"" ^0

"Dual-writing keeps the old store a live fallback instead of a frozen snapshot," ^0
"which is why rollback was safe, and the cutover verification compared every" ^0
"path in both stores and found them identical. It still would: across the " + str(original_paths) ^0
"paths that existed then, the stores differ by " + str(new_original - old_original) + ". Five paths have been added" ^0
"since, the stores differ by " + str(new_store - old_store) + " records, and the quarterly extract has been" ^0
"reporting " + str(int(old_store * 100 / new_store)) + " percent of the population without ever failing." ^0
```

## Python (deterministic transpilation)

```python
months = 12
writes_per_path_per_month = 1000
original_paths = 6
added_paths = [[2, 800], [4, 800], [6, 800], [8, 800], [10, 800]]
old_store = original_paths * writes_per_path_per_month * months
print("paths at cutover, dual-written : " + str(original_paths))
print("paths added since, new store only: 5")
print("")
print("month added   writes/month   months active   records in new store only")
new_only = 0
for p in added_paths:
    active_months = months - p[0] + 1
    contributed = p[1] * active_months
    new_only = new_only + contributed
    print("  " + str(p[0]) + "             " + str(p[1]) + "            " + str(active_months) + "              " + str(contributed))
print("")
new_store = old_store + new_only
print("old store : " + str(old_store) + " records")
print("new store : " + str(new_store) + " records")
print("divergence: " + str(new_store - old_store) + ", which is " + str(int((new_store - old_store) * 100 / new_store)) + " percent of the new store")
print("")
print("the quarterly compliance extract reads the old store")
print("  records it reports : " + str(old_store))
print("  records that exist : " + str(new_store))
print("  it reports " + str(int(old_store * 100 / new_store)) + " percent of the population and returns no error")
print("  every record it returns is a real record with correct fields")
print("")
print("the dual write itself")
print("  writes sent to the old store  : " + str(old_store))
print("  reads served from it in the request path : 0")
print("  so " + str(old_store) + " writes were paid for and " + str(old_store) + " were not read")
print("  the flag costs write latency on every request for twelve months")
print("")
old_original = original_paths * writes_per_path_per_month * months
new_original = original_paths * writes_per_path_per_month * months
print("control - compare the stores across the paths the migration covered")
print("  old store, original paths : " + str(old_original))
print("  new store, original paths : " + str(new_original))
print("  difference                : " + str(new_original - old_original))
print("  the migration is verifiably correct, and it is still correct today")
print("  a check aimed at the migration examines exactly the paths that still work")
print("")
print("null control - the same flag left on, no new write paths added")
print("  old store : " + str(old_store))
print("  new store : " + str(old_store))
print("  divergence: 0")
print("  cost      : " + str(old_store) + " wasted writes, and no wrong answers")
print("  the divergence needs a second event, and that event is ordinary work")
print("")
print("the person who added path 7 in month 2")
print("  wrote against the current architecture      correct")
print("  wrote to the store that reads are served from  correct")
print("  did not write to a store the docs call retired correct")
print("  had no way to know a consumer still read it    the docs said the migration was done")
print("")
print("the cutover checklist")
print("  listed every write path                     complete on the day")
print("  listed every read path                      complete on the day")
print("  named the store that must stop being written    yes, in the cleanup ticket")
print("  survived the closing of that ticket             no")
print("")
print("Dual-writing keeps the old store a live fallback instead of a frozen snapshot,")
print("which is why rollback was safe, and the cutover verification compared every")
print("path in both stores and found them identical. It still would: across the " + str(original_paths))
print("paths that existed then, the stores differ by " + str(new_original - old_original) + ". Five paths have been added")
print("since, the stores differ by " + str(new_store - old_store) + " records, and the quarterly extract has been")
print("reporting " + str(int(old_store * 100 / new_store)) + " percent of the population without ever failing.")
```

## stdout (executed)

```text
paths at cutover, dual-written : 6
paths added since, new store only: 5

month added   writes/month   months active   records in new store only
  2             800            11              8800
  4             800            9              7200
  6             800            7              5600
  8             800            5              4000
  10             800            3              2400

old store : 72000 records
new store : 100000 records
divergence: 28000, which is 28 percent of the new store

the quarterly compliance extract reads the old store
  records it reports : 72000
  records that exist : 100000
  it reports 72 percent of the population and returns no error
  every record it returns is a real record with correct fields

the dual write itself
  writes sent to the old store  : 72000
  reads served from it in the request path : 0
  so 72000 writes were paid for and 72000 were not read
  the flag costs write latency on every request for twelve months

control - compare the stores across the paths the migration covered
  old store, original paths : 72000
  new store, original paths : 72000
  difference                : 0
  the migration is verifiably correct, and it is still correct today
  a check aimed at the migration examines exactly the paths that still work

null control - the same flag left on, no new write paths added
  old store : 72000
  new store : 72000
  divergence: 0
  cost      : 72000 wasted writes, and no wrong answers
  the divergence needs a second event, and that event is ordinary work

the person who added path 7 in month 2
  wrote against the current architecture      correct
  wrote to the store that reads are served from  correct
  did not write to a store the docs call retired correct
  had no way to know a consumer still read it    the docs said the migration was done

the cutover checklist
  listed every write path                     complete on the day
  listed every read path                      complete on the day
  named the store that must stop being written    yes, in the cleanup ticket
  survived the closing of that ticket             no

Dual-writing keeps the old store a live fallback instead of a frozen snapshot,
which is why rollback was safe, and the cutover verification compared every
path in both stores and found them identical. It still would: across the 6
paths that existed then, the stores differ by 0. Five paths have been added
since, the stores differ by 28000 records, and the quarterly extract has been
reporting 72 percent of the population without ever failing.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
