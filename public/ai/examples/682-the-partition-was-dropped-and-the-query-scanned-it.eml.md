<!-- canonical: efficientnewlanguage.org/ai/examples/682-the-partition-was-dropped-and-the-query-scanned-it | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 682 — The partition was dropped and the query scanned it

`the_partition_was_dropped_and_the_query_scanned_it.eml` - Retention dropped three hundred and ten partitions and the query got four times faster. What it still scans is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Retention dropped
# three hundred and ten partitions and the query got four times faster. What it
# still scans is computed below.
#
# The retention job is right. Dropping a partition is a catalog operation rather
# than a delete, so it is instant and reclaims the storage whole; the policy is
# ninety days and it is the policy the data is licensed under; and the query
# time fell from thirteen and a half seconds to three. Nobody should stop doing
# this.
#
# Partitioning speeds a query by letting the planner skip partitions. Skipping
# requires a predicate the planner can map onto the partition key, and this
# query wraps that key in a function, so no partition is skipped and every one
# that exists is read.
#
# The query needs one partition. It reads ninety.

400 => partitions_before_retention
90 => partitions_after_retention
1 => partitions_the_query_needs
34 => scan_ms_per_partition

partitions_before_retention - partitions_after_retention => partitions_dropped
partitions_before_retention * scan_ms_per_partition => scan_ms_before
partitions_after_retention * scan_ms_per_partition => scan_ms_after
partitions_the_query_needs * scan_ms_per_partition => scan_ms_if_pruned
scan_ms_before - scan_ms_after => retention_saved_ms
scan_ms_after - scan_ms_if_pruned => pruning_would_save_ms
int(partitions_after_retention / partitions_the_query_needs) => partitions_read_over_needed

"partitions before retention : " + str(partitions_before_retention) ^0
"partitions dropped          : " + str(partitions_dropped) ^0
"partitions after            : " + str(partitions_after_retention) ^0
"partitions the query needs  : " + str(partitions_the_query_needs) ^0
"read over needed            : " + str(partitions_read_over_needed) + " times" ^0
"" ^0
"scan before, ms             : " + str(scan_ms_before) ^0
"scan after, ms              : " + str(scan_ms_after) ^0
"scan if pruned, ms          : " + str(scan_ms_if_pruned) ^0
"retention saved, ms         : " + str(retention_saved_ms) ^0
"pruning would save, ms      : " + str(pruning_would_save_ms) ^0
"" ^0

# ---- what retention did ----

"the retention job" ^0
"  drop is a catalog operation : instant, not a delete" ^0
"  storage reclaimed whole     : yes" ^0
"  policy                      : 90 days, matching the licence" ^0
"  partitions dropped          : " + str(partitions_dropped) ^0
"  query time, before and after: " + str(scan_ms_before) + " ms to " + str(scan_ms_after) + " ms" ^0
"  verdict                     : WORKING" ^0
"" ^0
"  the improvement is real and stopping this job would" ^0
"  undo it" ^0
"" ^0

# ---- what makes a partition skippable ----

"pruning" ^0
"  requires  : a predicate the planner can map onto the" ^0
"    partition key" ^0
"  the query : wraps that key in a function" ^0
"  partitions skipped : 0" ^0
"  partitions read    : " + str(partitions_after_retention) + ", all of them" ^0
"" ^0
"  the partitioning is not broken and the planner is not" ^0
"  wrong; a function of the key is not the key" ^0
"" ^0

int(pruning_would_save_ms * 10000 / scan_ms_after) => remaining_waste_per_myriad
"share of the remaining time that is unneeded : " + str(remaining_waste_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why the improvement pointed the wrong way ----

# Retention made the query faster by shrinking the thing it scans in full. That
# is a real improvement and it is also the shape that hides the cause: the
# metric responded, so the investigation stopped.
"what the four-times improvement showed" ^0
"  the query got faster       : yes, by " + str(retention_saved_ms) + " ms" ^0
"  because pruning started working : no" ^0
"  because there is less to scan in full : yes" ^0
"  next time the table grows  : the time comes back" ^0
"  the investigation after the win : closed" ^0
"" ^0

# ---- null control ----

# The same retention, with the predicate rewritten so the planner can use it.
scan_ms_if_pruned => nc_scan_ms
partitions_the_query_needs => nc_partitions_read

"null control - the predicate written against the key itself" ^0
"  partitions dropped : " + str(partitions_dropped) + ", unchanged" ^0
"  partitions read    : " + str(nc_partitions_read) ^0
"  scan, ms           : " + str(nc_scan_ms) ^0
"  retention did not do less; the query stopped reading" ^0
"  everything retention had left" ^0
"" ^0

# ---- the rule ----

"what dropping a partition guarantees" ^0
"  that data is gone and its storage is back : exactly" ^0
"  the query reads only what it needs         : not" ^0
"    addressed; how many partitions are read is decided by" ^0
"    the predicate, and retention changes how many exist" ^0
"" ^0
"shrinking a full scan improves it proportionally and leaves" ^0
"it a full scan; when a maintenance job and a missing" ^0
"optimisation move the same number, the job gets the credit" ^0
"" ^0

"Retention dropped " + str(partitions_dropped) + " partitions instantly, reclaimed the storage whole, and took" ^0
"the query from " + str(scan_ms_before) + " ms to " + str(scan_ms_after) + " ms. The predicate wraps the partition key in a" ^0
"function, so nothing is pruned and all " + str(partitions_after_retention) + " remaining partitions are read for a" ^0
"query needing " + str(partitions_the_query_needs) + " - " + str(partitions_read_over_needed) + " times too many, " + str(remaining_waste_per_myriad) + " per ten thousand of what is" ^0
"left - and the improvement closed the investigation." ^0
```

## Python (deterministic transpilation)

```python
partitions_before_retention = 400
partitions_after_retention = 90
partitions_the_query_needs = 1
scan_ms_per_partition = 34
partitions_dropped = partitions_before_retention - partitions_after_retention
scan_ms_before = partitions_before_retention * scan_ms_per_partition
scan_ms_after = partitions_after_retention * scan_ms_per_partition
scan_ms_if_pruned = partitions_the_query_needs * scan_ms_per_partition
retention_saved_ms = scan_ms_before - scan_ms_after
pruning_would_save_ms = scan_ms_after - scan_ms_if_pruned
partitions_read_over_needed = int(partitions_after_retention / partitions_the_query_needs)
print("partitions before retention : " + str(partitions_before_retention))
print("partitions dropped          : " + str(partitions_dropped))
print("partitions after            : " + str(partitions_after_retention))
print("partitions the query needs  : " + str(partitions_the_query_needs))
print("read over needed            : " + str(partitions_read_over_needed) + " times")
print("")
print("scan before, ms             : " + str(scan_ms_before))
print("scan after, ms              : " + str(scan_ms_after))
print("scan if pruned, ms          : " + str(scan_ms_if_pruned))
print("retention saved, ms         : " + str(retention_saved_ms))
print("pruning would save, ms      : " + str(pruning_would_save_ms))
print("")
print("the retention job")
print("  drop is a catalog operation : instant, not a delete")
print("  storage reclaimed whole     : yes")
print("  policy                      : 90 days, matching the licence")
print("  partitions dropped          : " + str(partitions_dropped))
print("  query time, before and after: " + str(scan_ms_before) + " ms to " + str(scan_ms_after) + " ms")
print("  verdict                     : WORKING")
print("")
print("  the improvement is real and stopping this job would")
print("  undo it")
print("")
print("pruning")
print("  requires  : a predicate the planner can map onto the")
print("    partition key")
print("  the query : wraps that key in a function")
print("  partitions skipped : 0")
print("  partitions read    : " + str(partitions_after_retention) + ", all of them")
print("")
print("  the partitioning is not broken and the planner is not")
print("  wrong; a function of the key is not the key")
print("")
remaining_waste_per_myriad = int(pruning_would_save_ms * 10000 / scan_ms_after)
print("share of the remaining time that is unneeded : " + str(remaining_waste_per_myriad) + " per ten thousand")
print("")
print("what the four-times improvement showed")
print("  the query got faster       : yes, by " + str(retention_saved_ms) + " ms")
print("  because pruning started working : no")
print("  because there is less to scan in full : yes")
print("  next time the table grows  : the time comes back")
print("  the investigation after the win : closed")
print("")
nc_scan_ms = scan_ms_if_pruned
nc_partitions_read = partitions_the_query_needs
print("null control - the predicate written against the key itself")
print("  partitions dropped : " + str(partitions_dropped) + ", unchanged")
print("  partitions read    : " + str(nc_partitions_read))
print("  scan, ms           : " + str(nc_scan_ms))
print("  retention did not do less; the query stopped reading")
print("  everything retention had left")
print("")
print("what dropping a partition guarantees")
print("  that data is gone and its storage is back : exactly")
print("  the query reads only what it needs         : not")
print("    addressed; how many partitions are read is decided by")
print("    the predicate, and retention changes how many exist")
print("")
print("shrinking a full scan improves it proportionally and leaves")
print("it a full scan; when a maintenance job and a missing")
print("optimisation move the same number, the job gets the credit")
print("")
print("Retention dropped " + str(partitions_dropped) + " partitions instantly, reclaimed the storage whole, and took")
print("the query from " + str(scan_ms_before) + " ms to " + str(scan_ms_after) + " ms. The predicate wraps the partition key in a")
print("function, so nothing is pruned and all " + str(partitions_after_retention) + " remaining partitions are read for a")
print("query needing " + str(partitions_the_query_needs) + " - " + str(partitions_read_over_needed) + " times too many, " + str(remaining_waste_per_myriad) + " per ten thousand of what is")
print("left - and the improvement closed the investigation.")
```

## stdout (executed)

```text
partitions before retention : 400
partitions dropped          : 310
partitions after            : 90
partitions the query needs  : 1
read over needed            : 90 times

scan before, ms             : 13600
scan after, ms              : 3060
scan if pruned, ms          : 34
retention saved, ms         : 10540
pruning would save, ms      : 3026

the retention job
  drop is a catalog operation : instant, not a delete
  storage reclaimed whole     : yes
  policy                      : 90 days, matching the licence
  partitions dropped          : 310
  query time, before and after: 13600 ms to 3060 ms
  verdict                     : WORKING

  the improvement is real and stopping this job would
  undo it

pruning
  requires  : a predicate the planner can map onto the
    partition key
  the query : wraps that key in a function
  partitions skipped : 0
  partitions read    : 90, all of them

  the partitioning is not broken and the planner is not
  wrong; a function of the key is not the key

share of the remaining time that is unneeded : 9888 per ten thousand

what the four-times improvement showed
  the query got faster       : yes, by 10540 ms
  because pruning started working : no
  because there is less to scan in full : yes
  next time the table grows  : the time comes back
  the investigation after the win : closed

null control - the predicate written against the key itself
  partitions dropped : 310, unchanged
  partitions read    : 1
  scan, ms           : 34
  retention did not do less; the query stopped reading
  everything retention had left

what dropping a partition guarantees
  that data is gone and its storage is back : exactly
  the query reads only what it needs         : not
    addressed; how many partitions are read is decided by
    the predicate, and retention changes how many exist

shrinking a full scan improves it proportionally and leaves
it a full scan; when a maintenance job and a missing
optimisation move the same number, the job gets the credit

Retention dropped 310 partitions instantly, reclaimed the storage whole, and took
the query from 13600 ms to 3060 ms. The predicate wraps the partition key in a
function, so nothing is pruned and all 90 remaining partitions are read for a
query needing 1 - 90 times too many, 9888 per ten thousand of what is
left - and the improvement closed the investigation.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
