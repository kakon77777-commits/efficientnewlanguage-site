<!-- canonical: efficientnewlanguage.org/ai/examples/757-the-migration-ran-on-the-primary-and-the-replica-had-its-own-queue | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 757 — The migration ran on the primary and the replica had its own queue

`the_migration_ran_on_the_primary_and_the_replica_had_its_own_queue.eml` - Schema changes use an online tool that never takes a table lock, and three hundred and forty have run with no downtime. Where "no downtime" was measured is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Schema changes use
# an online tool that never takes a table lock, and three hundred and forty have
# run with no downtime. Where "no downtime" was measured is computed below.
#
# The online migration tool is the right answer and it works. It builds a shadow
# table, backfills in chunks sized against replication lag, swaps atomically,
# and never holds a lock long enough to block a write. Every migration is
# rehearsed against a restored copy of production first. Three hundred and forty
# changes, no downtime, and the longest ran forty-seven minutes without a single
# blocked query on the primary.
#
# The tool runs on the PRIMARY. Its work reaches the replicas as replication,
# which is applied serially, so a forty-seven minute change is forty-seven
# minutes during which nothing after it can be applied.
#
# Three quarters of reads are served by replicas.

340 => migrations_run
0 => blocked_queries_on_the_primary
47 => longest_migration_minutes
210000 => reads_per_minute
74 => replica_share_of_reads_percent
100 => a_whole_percent
0 => checks_on_replica_lag_during_a_migration
0 => migrations_rehearsed_against_a_replica

int(reads_per_minute * replica_share_of_reads_percent / a_whole_percent) => replica_reads_per_minute
replica_reads_per_minute * longest_migration_minutes => replica_reads_during_the_longest_migration
a_whole_percent - replica_share_of_reads_percent => primary_share_of_reads_percent
int(replica_share_of_reads_percent * 10000 / a_whole_percent) => replica_share_per_myriad

"migrations run                  : " + str(migrations_run) ^0
"blocked queries on the primary  : " + str(blocked_queries_on_the_primary) ^0
"longest migration, minutes      : " + str(longest_migration_minutes) ^0
"migrations rehearsed against a replica : " + str(migrations_rehearsed_against_a_replica) ^0
"" ^0
"reads per minute                : " + str(reads_per_minute) ^0
"  served by the primary, percent: " + str(primary_share_of_reads_percent) ^0
"  served by replicas, percent   : " + str(replica_share_of_reads_percent) ^0
"  replica share                 : " + str(replica_share_per_myriad) + " per ten thousand" ^0
"  replica reads per minute      : " + str(replica_reads_per_minute) ^0
"" ^0
"replica reads during the longest migration : " + str(replica_reads_during_the_longest_migration) ^0
"checks on replica lag during a migration   : " + str(checks_on_replica_lag_during_a_migration) ^0
"" ^0

# ---- what the tool verified ----

"the online migration" ^0
"  method : a shadow table, backfilled in chunks sized" ^0
"    against replication lag, swapped atomically" ^0
"  locks held long enough to block a write : none" ^0
"  rehearsed against : a restored copy of production" ^0
"  migrations run : " + str(migrations_run) ^0
"  blocked queries on the primary : " + str(blocked_queries_on_the_primary) ^0
"  verdict : NO DOWNTIME ON THE PRIMARY" ^0
"" ^0
"  chunk sizes tuned against replication lag show the" ^0
"  authors were thinking about replicas, and the backfill" ^0
"  genuinely does not fall behind" ^0
"" ^0

# ---- where the swap arrives ----

"the replicas" ^0
"  how the change reaches them : the replication stream" ^0
"  how the stream is applied : serially" ^0
"  what a long statement does to everything behind it : it" ^0
"    waits" ^0
"  so a " + str(longest_migration_minutes) + " minute change costs the replicas : " ^0
"    " + str(longest_migration_minutes) + " minutes of lag" ^0
"  what the backfill's chunking bounded : the backfill" ^0
"  what it did not bound : the swap" ^0
"" ^0
"  the tool measures the primary, correctly, and the" ^0
"  quantity a reader experiences is on the other side" ^0
"" ^0

# ---- what a reader sees ----

"a read during that window" ^0
"  which server answers : a replica, " + str(replica_share_per_myriad) + " per ten" ^0
"    thousand of the time" ^0
"  how far behind it is : up to " + str(longest_migration_minutes) + " minutes" ^0
"  does the query fail : no" ^0
"  does it return an error : no" ^0
"  what it returns : an answer from before the change" ^0
"  reads in that state, that window : " ^0
"    " + str(replica_reads_during_the_longest_migration) ^0
"" ^0

# ---- why the rehearsal did not show it ----

"the rehearsal" ^0
"  runs against : a restored copy of production" ^0
"  what that copy has : the data" ^0
"  what it does not have : replicas, or read traffic" ^0
"  migrations rehearsed against a replica : " ^0
"    " + str(migrations_rehearsed_against_a_replica) ^0
"  so the rehearsal measures : the primary, faithfully" ^0
"  checks on replica lag during a migration : " ^0
"    " + str(checks_on_replica_lag_during_a_migration) ^0
"" ^0

# ---- null control ----

# The same tool, with the migration gated on replica lag: the swap waits, and
# the deploy fails if a replica would fall further behind than the read path
# tolerates.
1 => nc_checks_on_replica_lag_during_a_migration
0 => nc_replica_reads_served_stale

"null control - the swap is gated on replica lag" ^0
"  blocked queries on the primary : " + str(blocked_queries_on_the_primary) + ", unchanged" ^0
"  checks on replica lag during a migration : " ^0
"    " + str(nc_checks_on_replica_lag_during_a_migration) ^0
"  replica reads served from before the change : " ^0
"    " + str(nc_replica_reads_served_stale) ^0
"  the tool did not get better; the definition of done" ^0
"  moved from one server to the ones serving reads" ^0
"" ^0

# ---- the rule ----

"what an online migration guarantees" ^0
"  no query on the primary is blocked : exactly, over" ^0
"    " + str(migrations_run) + " migrations, and the chunking is real engineering" ^0
"  no query is affected : not addressed; the guarantee is" ^0
"    stated about the server the tool runs on, and the" ^0
"    change reaches the others as a serial stream" ^0
"" ^0
"downtime is a property of a reader, not of a server; a tool" ^0
"that eliminates it where it executes has moved the cost to" ^0
"wherever its output is applied, and that place has its own" ^0
"queue and no instrument pointed at it" ^0
"" ^0

"The tool builds a shadow table, chunks the backfill against replication lag," ^0
"swaps atomically and rehearses against restored production - " + str(migrations_run) + " migrations," ^0
str(blocked_queries_on_the_primary) + " blocked queries. It runs on the primary and replicas apply serially, so a" ^0
str(longest_migration_minutes) + " minute change costs " + str(longest_migration_minutes) + " minutes of lag on the servers answering" ^0
str(replica_share_per_myriad) + " per ten thousand of reads - " + str(replica_reads_during_the_longest_migration) + " of them - under " + str(checks_on_replica_lag_during_a_migration) + " checks." ^0
```

## Python (deterministic transpilation)

```python
migrations_run = 340
blocked_queries_on_the_primary = 0
longest_migration_minutes = 47
reads_per_minute = 210000
replica_share_of_reads_percent = 74
a_whole_percent = 100
checks_on_replica_lag_during_a_migration = 0
migrations_rehearsed_against_a_replica = 0
replica_reads_per_minute = int(reads_per_minute * replica_share_of_reads_percent / a_whole_percent)
replica_reads_during_the_longest_migration = replica_reads_per_minute * longest_migration_minutes
primary_share_of_reads_percent = a_whole_percent - replica_share_of_reads_percent
replica_share_per_myriad = int(replica_share_of_reads_percent * 10000 / a_whole_percent)
print("migrations run                  : " + str(migrations_run))
print("blocked queries on the primary  : " + str(blocked_queries_on_the_primary))
print("longest migration, minutes      : " + str(longest_migration_minutes))
print("migrations rehearsed against a replica : " + str(migrations_rehearsed_against_a_replica))
print("")
print("reads per minute                : " + str(reads_per_minute))
print("  served by the primary, percent: " + str(primary_share_of_reads_percent))
print("  served by replicas, percent   : " + str(replica_share_of_reads_percent))
print("  replica share                 : " + str(replica_share_per_myriad) + " per ten thousand")
print("  replica reads per minute      : " + str(replica_reads_per_minute))
print("")
print("replica reads during the longest migration : " + str(replica_reads_during_the_longest_migration))
print("checks on replica lag during a migration   : " + str(checks_on_replica_lag_during_a_migration))
print("")
print("the online migration")
print("  method : a shadow table, backfilled in chunks sized")
print("    against replication lag, swapped atomically")
print("  locks held long enough to block a write : none")
print("  rehearsed against : a restored copy of production")
print("  migrations run : " + str(migrations_run))
print("  blocked queries on the primary : " + str(blocked_queries_on_the_primary))
print("  verdict : NO DOWNTIME ON THE PRIMARY")
print("")
print("  chunk sizes tuned against replication lag show the")
print("  authors were thinking about replicas, and the backfill")
print("  genuinely does not fall behind")
print("")
print("the replicas")
print("  how the change reaches them : the replication stream")
print("  how the stream is applied : serially")
print("  what a long statement does to everything behind it : it")
print("    waits")
print("  so a " + str(longest_migration_minutes) + " minute change costs the replicas : ")
print("    " + str(longest_migration_minutes) + " minutes of lag")
print("  what the backfill's chunking bounded : the backfill")
print("  what it did not bound : the swap")
print("")
print("  the tool measures the primary, correctly, and the")
print("  quantity a reader experiences is on the other side")
print("")
print("a read during that window")
print("  which server answers : a replica, " + str(replica_share_per_myriad) + " per ten")
print("    thousand of the time")
print("  how far behind it is : up to " + str(longest_migration_minutes) + " minutes")
print("  does the query fail : no")
print("  does it return an error : no")
print("  what it returns : an answer from before the change")
print("  reads in that state, that window : ")
print("    " + str(replica_reads_during_the_longest_migration))
print("")
print("the rehearsal")
print("  runs against : a restored copy of production")
print("  what that copy has : the data")
print("  what it does not have : replicas, or read traffic")
print("  migrations rehearsed against a replica : ")
print("    " + str(migrations_rehearsed_against_a_replica))
print("  so the rehearsal measures : the primary, faithfully")
print("  checks on replica lag during a migration : ")
print("    " + str(checks_on_replica_lag_during_a_migration))
print("")
nc_checks_on_replica_lag_during_a_migration = 1
nc_replica_reads_served_stale = 0
print("null control - the swap is gated on replica lag")
print("  blocked queries on the primary : " + str(blocked_queries_on_the_primary) + ", unchanged")
print("  checks on replica lag during a migration : ")
print("    " + str(nc_checks_on_replica_lag_during_a_migration))
print("  replica reads served from before the change : ")
print("    " + str(nc_replica_reads_served_stale))
print("  the tool did not get better; the definition of done")
print("  moved from one server to the ones serving reads")
print("")
print("what an online migration guarantees")
print("  no query on the primary is blocked : exactly, over")
print("    " + str(migrations_run) + " migrations, and the chunking is real engineering")
print("  no query is affected : not addressed; the guarantee is")
print("    stated about the server the tool runs on, and the")
print("    change reaches the others as a serial stream")
print("")
print("downtime is a property of a reader, not of a server; a tool")
print("that eliminates it where it executes has moved the cost to")
print("wherever its output is applied, and that place has its own")
print("queue and no instrument pointed at it")
print("")
print("The tool builds a shadow table, chunks the backfill against replication lag,")
print("swaps atomically and rehearses against restored production - " + str(migrations_run) + " migrations,")
print(str(blocked_queries_on_the_primary) + " blocked queries. It runs on the primary and replicas apply serially, so a")
print(str(longest_migration_minutes) + " minute change costs " + str(longest_migration_minutes) + " minutes of lag on the servers answering")
print(str(replica_share_per_myriad) + " per ten thousand of reads - " + str(replica_reads_during_the_longest_migration) + " of them - under " + str(checks_on_replica_lag_during_a_migration) + " checks.")
```

## stdout (executed)

```text
migrations run                  : 340
blocked queries on the primary  : 0
longest migration, minutes      : 47
migrations rehearsed against a replica : 0

reads per minute                : 210000
  served by the primary, percent: 26
  served by replicas, percent   : 74
  replica share                 : 7400 per ten thousand
  replica reads per minute      : 155400

replica reads during the longest migration : 7303800
checks on replica lag during a migration   : 0

the online migration
  method : a shadow table, backfilled in chunks sized
    against replication lag, swapped atomically
  locks held long enough to block a write : none
  rehearsed against : a restored copy of production
  migrations run : 340
  blocked queries on the primary : 0
  verdict : NO DOWNTIME ON THE PRIMARY

  chunk sizes tuned against replication lag show the
  authors were thinking about replicas, and the backfill
  genuinely does not fall behind

the replicas
  how the change reaches them : the replication stream
  how the stream is applied : serially
  what a long statement does to everything behind it : it
    waits
  so a 47 minute change costs the replicas : 
    47 minutes of lag
  what the backfill's chunking bounded : the backfill
  what it did not bound : the swap

  the tool measures the primary, correctly, and the
  quantity a reader experiences is on the other side

a read during that window
  which server answers : a replica, 7400 per ten
    thousand of the time
  how far behind it is : up to 47 minutes
  does the query fail : no
  does it return an error : no
  what it returns : an answer from before the change
  reads in that state, that window : 
    7303800

the rehearsal
  runs against : a restored copy of production
  what that copy has : the data
  what it does not have : replicas, or read traffic
  migrations rehearsed against a replica : 
    0
  so the rehearsal measures : the primary, faithfully
  checks on replica lag during a migration : 
    0

null control - the swap is gated on replica lag
  blocked queries on the primary : 0, unchanged
  checks on replica lag during a migration : 
    1
  replica reads served from before the change : 
    0
  the tool did not get better; the definition of done
  moved from one server to the ones serving reads

what an online migration guarantees
  no query on the primary is blocked : exactly, over
    340 migrations, and the chunking is real engineering
  no query is affected : not addressed; the guarantee is
    stated about the server the tool runs on, and the
    change reaches the others as a serial stream

downtime is a property of a reader, not of a server; a tool
that eliminates it where it executes has moved the cost to
wherever its output is applied, and that place has its own
queue and no instrument pointed at it

The tool builds a shadow table, chunks the backfill against replication lag,
swaps atomically and rehearses against restored production - 340 migrations,
0 blocked queries. It runs on the primary and replicas apply serially, so a
47 minute change costs 47 minutes of lag on the servers answering
7400 per ten thousand of reads - 7303800 of them - under 0 checks.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
