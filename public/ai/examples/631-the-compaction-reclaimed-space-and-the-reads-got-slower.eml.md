<!-- canonical: efficientnewlanguage.org/ai/examples/631-the-compaction-reclaimed-space-and-the-reads-got-slower | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 631 — The compaction reclaimed space and the reads got slower

`the_compaction_reclaimed_space_and_the_reads_got_slower.eml` - Compaction reclaimed thirty-eight percent of the store and the space metric is right. What reads cost afterwards is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Compaction
# reclaimed thirty-eight percent of the store and the space metric is right.
# What reads cost afterwards is computed below.
#
# The compaction did what it is for. Overwritten versions and tombstones are
# merged away, the file count drops, the space is genuinely returned to the
# filesystem and stays returned. The job is not wasteful, it is not a no-op, and
# deferring it is how the store fills up.
#
# Reclaiming space means REWRITING the files. Every byte that survives is
# written to a new file at a new offset, and the page cache holding the old
# files is now holding files nobody will read again.
#
# The working set was ninety-three percent cached. It is rewritten in twenty
# minutes and the cache has to be paid for a second time.

4120000000000 => bytes_before
2554000000000 => bytes_after
210000000000 => page_cache_bytes
84000 => reads_per_second
3 => p99_before_ms
41 => p99_after_ms
26 => minutes_to_rewarm

bytes_before - bytes_after => bytes_reclaimed
int(bytes_reclaimed * 10000 / bytes_before) => reclaimed_per_myriad
# Every surviving byte is written to a new location, so the cache is displaced
# by the whole post-compaction store, not by the part that changed.
int(bytes_after / page_cache_bytes) => times_the_cache_is_overwritten

"bytes before                : " + str(bytes_before) ^0
"bytes after                 : " + str(bytes_after) ^0
"bytes reclaimed             : " + str(bytes_reclaimed) ^0
"share reclaimed             : " + str(reclaimed_per_myriad) + " per ten thousand" ^0
"" ^0
"page cache, bytes           : " + str(page_cache_bytes) ^0
"times it is overwritten     : " + str(times_the_cache_is_overwritten) ^0
"" ^0

# ---- what the compaction verified ----

"the compaction job's report" ^0
"  bytes reclaimed   : " + str(bytes_reclaimed) ^0
"  tombstones merged : all" ^0
"  files after       : fewer" ^0
"  data lost         : 0" ^0
"  verdict           : SUCCESS" ^0
"" ^0
"  the space is really back and it stays back; skipping" ^0
"  this job is how the volume fills" ^0
"" ^0

# ---- what it cost ----

p99_after_ms - p99_before_ms => p99_added_ms
reads_per_second * 60 * minutes_to_rewarm => reads_during_the_rewarm

"reads while the cache refills" ^0
"  p99 before, ms        : " + str(p99_before_ms) ^0
"  p99 after, ms         : " + str(p99_after_ms) ^0
"  added per read, ms    : " + str(p99_added_ms) ^0
"  minutes to rewarm     : " + str(minutes_to_rewarm) ^0
"  reads in that window  : " + str(reads_during_the_rewarm) ^0
"" ^0

int(p99_after_ms * 10 / p99_before_ms) => tenths_of_the_old_p99
"p99 is now " + str(tenths_of_the_old_p99) + " tenths of what it was" ^0
"" ^0

# ---- why the metric did not show it ----

# Space is a level and latency is a rate. The space chart is watched because it
# is the one that pages someone at three in the morning; the latency chart
# recovers before anyone opens it.
"the two charts" ^0
"  space used   : falls, stays down, alerts on a threshold" ^0
"  read p99     : rises, recovers in " + str(minutes_to_rewarm) + " minutes, alerts on a" ^0
"    five minute average that never clears the threshold" ^0
"" ^0
"  the job is scheduled on the first and evaluated on it" ^0
"" ^0

# ---- null control ----

# The same compaction, rate-limited so the rewrite stays under the cache's
# refill rate. The space comes back more slowly and the cache is never fully
# displaced.
bytes_reclaimed => nc_bytes_reclaimed
6 => nc_p99_after_ms

"null control - the same compaction, rate limited" ^0
"  bytes reclaimed : " + str(nc_bytes_reclaimed) + ", unchanged" ^0
"  p99 after, ms   : " + str(nc_p99_after_ms) ^0
"  the compaction did not reclaim less; it stopped" ^0
"  displacing the cache faster than it refills" ^0
"" ^0

# ---- the rule ----

"what reclaimed space guarantees" ^0
"  these bytes are available again : exactly" ^0
"  nothing else got worse          : not addressed; the" ^0
"    mechanism that returns the bytes is a rewrite, and a" ^0
"    rewrite is what invalidates every cache above it" ^0
"" ^0
"a maintenance job is evaluated on the resource it frees and" ^0
"paid for in the one it disturbs; the second is usually a rate" ^0
"and the first is usually a level, which is why only one of" ^0
"them has an alert" ^0
"" ^0

"The compaction reclaimed " + str(bytes_reclaimed) + " bytes - " + str(reclaimed_per_myriad) + " per ten thousand of the" ^0
"store - with 0 data lost, and the space stays back. Rewriting what survives" ^0
"displaces the page cache " + str(times_the_cache_is_overwritten) + " times over, so read p99 goes from " + str(p99_before_ms) + " ms to " + str(p99_after_ms) + " ms" ^0
"across " + str(reads_during_the_rewarm) + " reads while it refills, on a chart nobody alerts on because the" ^0
"job is scheduled against the one that falls." ^0
```

## Python (deterministic transpilation)

```python
bytes_before = 4120000000000
bytes_after = 2554000000000
page_cache_bytes = 210000000000
reads_per_second = 84000
p99_before_ms = 3
p99_after_ms = 41
minutes_to_rewarm = 26
bytes_reclaimed = bytes_before - bytes_after
reclaimed_per_myriad = int(bytes_reclaimed * 10000 / bytes_before)
times_the_cache_is_overwritten = int(bytes_after / page_cache_bytes)
print("bytes before                : " + str(bytes_before))
print("bytes after                 : " + str(bytes_after))
print("bytes reclaimed             : " + str(bytes_reclaimed))
print("share reclaimed             : " + str(reclaimed_per_myriad) + " per ten thousand")
print("")
print("page cache, bytes           : " + str(page_cache_bytes))
print("times it is overwritten     : " + str(times_the_cache_is_overwritten))
print("")
print("the compaction job's report")
print("  bytes reclaimed   : " + str(bytes_reclaimed))
print("  tombstones merged : all")
print("  files after       : fewer")
print("  data lost         : 0")
print("  verdict           : SUCCESS")
print("")
print("  the space is really back and it stays back; skipping")
print("  this job is how the volume fills")
print("")
p99_added_ms = p99_after_ms - p99_before_ms
reads_during_the_rewarm = reads_per_second * 60 * minutes_to_rewarm
print("reads while the cache refills")
print("  p99 before, ms        : " + str(p99_before_ms))
print("  p99 after, ms         : " + str(p99_after_ms))
print("  added per read, ms    : " + str(p99_added_ms))
print("  minutes to rewarm     : " + str(minutes_to_rewarm))
print("  reads in that window  : " + str(reads_during_the_rewarm))
print("")
tenths_of_the_old_p99 = int(p99_after_ms * 10 / p99_before_ms)
print("p99 is now " + str(tenths_of_the_old_p99) + " tenths of what it was")
print("")
print("the two charts")
print("  space used   : falls, stays down, alerts on a threshold")
print("  read p99     : rises, recovers in " + str(minutes_to_rewarm) + " minutes, alerts on a")
print("    five minute average that never clears the threshold")
print("")
print("  the job is scheduled on the first and evaluated on it")
print("")
nc_bytes_reclaimed = bytes_reclaimed
nc_p99_after_ms = 6
print("null control - the same compaction, rate limited")
print("  bytes reclaimed : " + str(nc_bytes_reclaimed) + ", unchanged")
print("  p99 after, ms   : " + str(nc_p99_after_ms))
print("  the compaction did not reclaim less; it stopped")
print("  displacing the cache faster than it refills")
print("")
print("what reclaimed space guarantees")
print("  these bytes are available again : exactly")
print("  nothing else got worse          : not addressed; the")
print("    mechanism that returns the bytes is a rewrite, and a")
print("    rewrite is what invalidates every cache above it")
print("")
print("a maintenance job is evaluated on the resource it frees and")
print("paid for in the one it disturbs; the second is usually a rate")
print("and the first is usually a level, which is why only one of")
print("them has an alert")
print("")
print("The compaction reclaimed " + str(bytes_reclaimed) + " bytes - " + str(reclaimed_per_myriad) + " per ten thousand of the")
print("store - with 0 data lost, and the space stays back. Rewriting what survives")
print("displaces the page cache " + str(times_the_cache_is_overwritten) + " times over, so read p99 goes from " + str(p99_before_ms) + " ms to " + str(p99_after_ms) + " ms")
print("across " + str(reads_during_the_rewarm) + " reads while it refills, on a chart nobody alerts on because the")
print("job is scheduled against the one that falls.")
```

## stdout (executed)

```text
bytes before                : 4120000000000
bytes after                 : 2554000000000
bytes reclaimed             : 1566000000000
share reclaimed             : 3800 per ten thousand

page cache, bytes           : 210000000000
times it is overwritten     : 12

the compaction job's report
  bytes reclaimed   : 1566000000000
  tombstones merged : all
  files after       : fewer
  data lost         : 0
  verdict           : SUCCESS

  the space is really back and it stays back; skipping
  this job is how the volume fills

reads while the cache refills
  p99 before, ms        : 3
  p99 after, ms         : 41
  added per read, ms    : 38
  minutes to rewarm     : 26
  reads in that window  : 131040000

p99 is now 136 tenths of what it was

the two charts
  space used   : falls, stays down, alerts on a threshold
  read p99     : rises, recovers in 26 minutes, alerts on a
    five minute average that never clears the threshold

  the job is scheduled on the first and evaluated on it

null control - the same compaction, rate limited
  bytes reclaimed : 1566000000000, unchanged
  p99 after, ms   : 6
  the compaction did not reclaim less; it stopped
  displacing the cache faster than it refills

what reclaimed space guarantees
  these bytes are available again : exactly
  nothing else got worse          : not addressed; the
    mechanism that returns the bytes is a rewrite, and a
    rewrite is what invalidates every cache above it

a maintenance job is evaluated on the resource it frees and
paid for in the one it disturbs; the second is usually a rate
and the first is usually a level, which is why only one of
them has an alert

The compaction reclaimed 1566000000000 bytes - 3800 per ten thousand of the
store - with 0 data lost, and the space stays back. Rewriting what survives
displaces the page cache 12 times over, so read p99 goes from 3 ms to 41 ms
across 131040000 reads while it refills, on a chart nobody alerts on because the
job is scheduled against the one that falls.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
