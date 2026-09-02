<!-- canonical: efficientnewlanguage.org/ai/examples/664-the-migration-was-online-and-the-reads-took-a-lock | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 664 — The migration was online and the reads took a lock

`the_migration_was_online_and_the_reads_took_a_lock.eml` - The migration is online, took forty milliseconds, and rewrote nothing. How long the table was unavailable is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The migration is
# online, took forty milliseconds, and rewrote nothing. How long the table was
# unavailable is computed below.
#
# The migration is genuinely online. Adding a nullable column with no default
# does not rewrite the table, does not scan it, and does not hold a lock while
# any data is touched. The documentation says so, the staging run took forty
# milliseconds against a copy of production, and the operator who chose this
# form of the change chose it for exactly this reason.
#
# It still needs the catalog for an instant, and taking that lock means QUEUEING
# for it. The queue is ordered, so everything that arrives after the waiting
# migration waits behind the migration, not behind the operation the migration
# is waiting for.
#
# A reporting query had been running for five and a half minutes.

40 => alter_milliseconds
340 => long_running_read_seconds
3100 => requests_per_second
0 => rows_rewritten
0 => rows_scanned

# The alter waits for the reader; everything after it waits for the alter.
long_running_read_seconds => outage_seconds
outage_seconds * requests_per_second => requests_queued
int(outage_seconds * 1000 / alter_milliseconds) => wait_over_work

"alter duration, ms         : " + str(alter_milliseconds) ^0
"rows rewritten             : " + str(rows_rewritten) ^0
"rows scanned               : " + str(rows_scanned) ^0
"" ^0
"the reader it queued behind, seconds : " + str(long_running_read_seconds) ^0
"outage, seconds            : " + str(outage_seconds) ^0
"requests queued            : " + str(requests_queued) ^0
"the wait is the work times : " + str(wait_over_work) ^0
"" ^0

# ---- what online means ----

"the migration's own properties" ^0
"  table rewritten     : no" ^0
"  table scanned       : no" ^0
"  lock held while touching data : none, there is no data step" ^0
"  duration, ms        : " + str(alter_milliseconds) ^0
"  staging run against a production copy : " + str(alter_milliseconds) + " ms" ^0
"  verdict             : ONLINE" ^0
"" ^0
"  every line is true and the operator was right to prefer" ^0
"  this form over the one that rewrites" ^0
"" ^0

# ---- what it does not describe ----

"acquiring the catalog lock" ^0
"  lock needed for, ms   : " + str(alter_milliseconds) ^0
"  granted immediately   : only if nothing holds a" ^0
"    conflicting lock" ^0
"  what held one         : a reporting query, " + str(long_running_read_seconds) + " s in" ^0
"  the queue is ordered  : yes" ^0
"  who waits behind the waiting migration : everyone" ^0
"" ^0
"  the duration of an operation and the duration of getting" ^0
"  to run it are unrelated quantities" ^0
"" ^0

# ---- the shape of the blockage ----

# Nothing here is a deadlock and nothing is slow. Three participants, each
# behaving correctly: a long read that is allowed to be long, a lock queue that
# is fair, and a migration that is fast.
"the three participants" ^0
"  the reporting query : allowed to run long, and does" ^0
"  the lock queue      : fair, first in first out" ^0
"  the migration       : " + str(alter_milliseconds) + " ms of work" ^0
"  the defect          : none of the three" ^0
"" ^0

int(requests_queued * 10000 / (requests_queued + requests_per_second * 60)) => queued_share_per_myriad
"share of the following hour spent queued : " + str(queued_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same migration, with a lock timeout so it gives up rather than queues.
3 => nc_lock_timeout_seconds
nc_lock_timeout_seconds * requests_per_second => nc_requests_queued

"null control - the migration takes a 3 second lock timeout" ^0
"  rows rewritten     : " + str(rows_rewritten) + ", unchanged" ^0
"  outage, seconds    : " + str(nc_lock_timeout_seconds) ^0
"  requests queued    : " + str(nc_requests_queued) ^0
"  the migration did not get faster; it stopped being able" ^0
"  to hold the door open for everyone behind it" ^0
"" ^0

# ---- the rule ----

"what an online migration guarantees" ^0
"  no rewrite, no scan, no long data lock : exactly" ^0
"  the table stays available              : not addressed;" ^0
"    availability depends on what is already holding a" ^0
"    lock, which is a property of the traffic and not of" ^0
"    the migration" ^0
"" ^0
"a fast operation in a fair queue is a slow operation for" ^0
"everyone behind it; the number to check before running one" ^0
"is not its duration but the oldest transaction open" ^0
"" ^0

"The migration is online and took " + str(alter_milliseconds) + " ms with " + str(rows_rewritten) + " rows rewritten and " + str(rows_scanned) ^0
"scanned, which is what it promises and why it was chosen. It queued behind a" ^0
"reporting query " + str(long_running_read_seconds) + " seconds in, and the lock queue is fair, so " + str(requests_queued) ^0
"requests waited behind it - " + str(queued_share_per_myriad) + " per ten thousand of the following hour - for a" ^0
"wait " + str(wait_over_work) + " times the length of the work." ^0
```

## Python (deterministic transpilation)

```python
alter_milliseconds = 40
long_running_read_seconds = 340
requests_per_second = 3100
rows_rewritten = 0
rows_scanned = 0
outage_seconds = long_running_read_seconds
requests_queued = outage_seconds * requests_per_second
wait_over_work = int(outage_seconds * 1000 / alter_milliseconds)
print("alter duration, ms         : " + str(alter_milliseconds))
print("rows rewritten             : " + str(rows_rewritten))
print("rows scanned               : " + str(rows_scanned))
print("")
print("the reader it queued behind, seconds : " + str(long_running_read_seconds))
print("outage, seconds            : " + str(outage_seconds))
print("requests queued            : " + str(requests_queued))
print("the wait is the work times : " + str(wait_over_work))
print("")
print("the migration's own properties")
print("  table rewritten     : no")
print("  table scanned       : no")
print("  lock held while touching data : none, there is no data step")
print("  duration, ms        : " + str(alter_milliseconds))
print("  staging run against a production copy : " + str(alter_milliseconds) + " ms")
print("  verdict             : ONLINE")
print("")
print("  every line is true and the operator was right to prefer")
print("  this form over the one that rewrites")
print("")
print("acquiring the catalog lock")
print("  lock needed for, ms   : " + str(alter_milliseconds))
print("  granted immediately   : only if nothing holds a")
print("    conflicting lock")
print("  what held one         : a reporting query, " + str(long_running_read_seconds) + " s in")
print("  the queue is ordered  : yes")
print("  who waits behind the waiting migration : everyone")
print("")
print("  the duration of an operation and the duration of getting")
print("  to run it are unrelated quantities")
print("")
print("the three participants")
print("  the reporting query : allowed to run long, and does")
print("  the lock queue      : fair, first in first out")
print("  the migration       : " + str(alter_milliseconds) + " ms of work")
print("  the defect          : none of the three")
print("")
queued_share_per_myriad = int(requests_queued * 10000 / (requests_queued + requests_per_second * 60))
print("share of the following hour spent queued : " + str(queued_share_per_myriad) + " per ten thousand")
print("")
nc_lock_timeout_seconds = 3
nc_requests_queued = nc_lock_timeout_seconds * requests_per_second
print("null control - the migration takes a 3 second lock timeout")
print("  rows rewritten     : " + str(rows_rewritten) + ", unchanged")
print("  outage, seconds    : " + str(nc_lock_timeout_seconds))
print("  requests queued    : " + str(nc_requests_queued))
print("  the migration did not get faster; it stopped being able")
print("  to hold the door open for everyone behind it")
print("")
print("what an online migration guarantees")
print("  no rewrite, no scan, no long data lock : exactly")
print("  the table stays available              : not addressed;")
print("    availability depends on what is already holding a")
print("    lock, which is a property of the traffic and not of")
print("    the migration")
print("")
print("a fast operation in a fair queue is a slow operation for")
print("everyone behind it; the number to check before running one")
print("is not its duration but the oldest transaction open")
print("")
print("The migration is online and took " + str(alter_milliseconds) + " ms with " + str(rows_rewritten) + " rows rewritten and " + str(rows_scanned))
print("scanned, which is what it promises and why it was chosen. It queued behind a")
print("reporting query " + str(long_running_read_seconds) + " seconds in, and the lock queue is fair, so " + str(requests_queued))
print("requests waited behind it - " + str(queued_share_per_myriad) + " per ten thousand of the following hour - for a")
print("wait " + str(wait_over_work) + " times the length of the work.")
```

## stdout (executed)

```text
alter duration, ms         : 40
rows rewritten             : 0
rows scanned               : 0

the reader it queued behind, seconds : 340
outage, seconds            : 340
requests queued            : 1054000
the wait is the work times : 8500

the migration's own properties
  table rewritten     : no
  table scanned       : no
  lock held while touching data : none, there is no data step
  duration, ms        : 40
  staging run against a production copy : 40 ms
  verdict             : ONLINE

  every line is true and the operator was right to prefer
  this form over the one that rewrites

acquiring the catalog lock
  lock needed for, ms   : 40
  granted immediately   : only if nothing holds a
    conflicting lock
  what held one         : a reporting query, 340 s in
  the queue is ordered  : yes
  who waits behind the waiting migration : everyone

  the duration of an operation and the duration of getting
  to run it are unrelated quantities

the three participants
  the reporting query : allowed to run long, and does
  the lock queue      : fair, first in first out
  the migration       : 40 ms of work
  the defect          : none of the three

share of the following hour spent queued : 8500 per ten thousand

null control - the migration takes a 3 second lock timeout
  rows rewritten     : 0, unchanged
  outage, seconds    : 3
  requests queued    : 9300
  the migration did not get faster; it stopped being able
  to hold the door open for everyone behind it

what an online migration guarantees
  no rewrite, no scan, no long data lock : exactly
  the table stays available              : not addressed;
    availability depends on what is already holding a
    lock, which is a property of the traffic and not of
    the migration

a fast operation in a fair queue is a slow operation for
everyone behind it; the number to check before running one
is not its duration but the oldest transaction open

The migration is online and took 40 ms with 0 rows rewritten and 0
scanned, which is what it promises and why it was chosen. It queued behind a
reporting query 340 seconds in, and the lock queue is fair, so 1054000
requests waited behind it - 8500 per ten thousand of the following hour - for a
wait 8500 times the length of the work.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
