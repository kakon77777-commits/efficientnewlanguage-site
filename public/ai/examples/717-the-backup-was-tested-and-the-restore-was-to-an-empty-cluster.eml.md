<!-- canonical: efficientnewlanguage.org/ai/examples/717-the-backup-was-tested-and-the-restore-was-to-an-empty-cluster | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 717 — The backup was tested and the restore was to an empty cluster

`the_backup_was_tested_and_the_restore_was_to_an_empty_cluster.eml` - Backups are not merely taken, they are restored weekly and the restored copy is checksummed, counted and smoke-tested. Which recovery that rehearses is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Backups are not
# merely taken, they are restored weekly and the restored copy is checksummed,
# counted and smoke-tested. Which recovery that rehearses is computed below.
#
# The drill is far past what most teams do. A backup that has never been
# restored is a file, and this one is restored every week by an automated job:
# checksums verified against the source, row counts compared table by table,
# and the application booted against the restored copy and driven through a
# smoke suite. Fifty-two drills this year, fifty-two passed, and the published
# recovery time objective is the time the drill actually takes.
#
# The drill restores the whole snapshot into a freshly provisioned empty
# cluster. Every recovery anyone has needed this year was partial - one table,
# or one time range, into a cluster that is up and serving.
#
# The backup is a physical snapshot, so a partial restore goes the long way.

52 => drills_this_year
52 => drills_that_passed
40 => published_rto_minutes
6 => data_recovery_incidents_this_year
0 => incidents_needing_a_full_cluster_restore
0 => drills_that_restore_into_a_cluster_holding_data
0 => drills_that_extract_a_single_table
390 => measured_partial_restore_minutes

data_recovery_incidents_this_year - incidents_needing_a_full_cluster_restore => incidents_needing_a_partial_restore
measured_partial_restore_minutes - published_rto_minutes => minutes_beyond_the_published_rto
int(measured_partial_restore_minutes * 100 / published_rto_minutes) => partial_as_percent_of_the_published_figure
int(drills_that_extract_a_single_table * 10000 / drills_this_year) => drills_rehearsing_the_used_path_per_myriad

"drills this year                : " + str(drills_this_year) ^0
"  passed                        : " + str(drills_that_passed) ^0
"  restoring into a cluster holding data : " + str(drills_that_restore_into_a_cluster_holding_data) ^0
"  extracting a single table     : " + str(drills_that_extract_a_single_table) ^0
"  rehearsing the path used      : " + str(drills_rehearsing_the_used_path_per_myriad) + " per ten thousand" ^0
"" ^0
"data recovery incidents         : " + str(data_recovery_incidents_this_year) ^0
"  needing a full cluster restore: " + str(incidents_needing_a_full_cluster_restore) ^0
"  needing a partial restore     : " + str(incidents_needing_a_partial_restore) ^0
"" ^0
"published RTO, minutes          : " + str(published_rto_minutes) ^0
"measured partial restore, minutes : " + str(measured_partial_restore_minutes) ^0
"  beyond the published figure   : " + str(minutes_beyond_the_published_rto) ^0
"  as a percent of it            : " + str(partial_as_percent_of_the_published_figure) ^0
"" ^0

# ---- what the drill verified ----

"the restore drill" ^0
"  frequency : weekly, automated" ^0
"  checksums verified against the source : yes" ^0
"  row counts compared table by table    : yes" ^0
"  application booted against the copy   : yes, plus a" ^0
"    smoke suite" ^0
"  drills this year : " + str(drills_this_year) + ", passed " + str(drills_that_passed) ^0
"  verdict : RESTORABLE" ^0
"" ^0
"  restoring rather than trusting the backup job is the" ^0
"  whole difference, and this one boots the application" ^0
"" ^0

# ---- what the drill is a statement about ----

"the rehearsed operation" ^0
"  target        : a freshly provisioned empty cluster" ^0
"  scope         : the whole snapshot" ^0
"  concurrent load during it : none" ^0
"  what it proves : the snapshot is complete, readable, and" ^0
"    sufficient to stand the application up" ^0
"  what a reader takes from the RTO : how long a recovery" ^0
"    takes" ^0
"" ^0
"  the drill answers the question completely and the" ^0
"  question is total loss, which has not happened" ^0
"" ^0
# ---- what the six incidents actually needed ----

# None of them was a lost cluster. A bad migration wrote nulls over one column;
# a job double-applied a day of events; a customer asked for their own rows
# back. Each needed some rows as of some time, into a database that is up.
"the six" ^0
"  clusters lost this year : " + str(incidents_needing_a_full_cluster_restore) ^0
"  incidents needing rows as of a time : " + str(incidents_needing_a_partial_restore) ^0
"  target in each case : a cluster that is up and serving" ^0
"  what the snapshot format allows : restore all of it" ^0
"  so the procedure is : stand up a side cluster, restore" ^0
"    everything, extract, copy across, reconcile" ^0
"  minutes that took, measured once : " + str(measured_partial_restore_minutes) ^0
"" ^0

# ---- why the drill cannot surface this ----

# Restoring into an empty cluster is strictly easier than restoring into a full
# one, and the drill is not wrong about the thing it measures. It never
# encounters an object that already exists, a sequence already past the
# restored value, or a foreign key held by a row the snapshot does not contain.
"what an empty target never presents" ^0
"  an object that already exists : never" ^0
"  a sequence already ahead of the restored rows : never" ^0
"  a constraint held by a row not in the snapshot : never" ^0
"  a decision about which copy of a row wins   : never" ^0
"  drills that meet any of these : " + str(drills_that_restore_into_a_cluster_holding_data) ^0
"" ^0

# ---- what the published number is ----

"the RTO" ^0
"  where it came from : the drill, measured not estimated" ^0
"  what it is the duration of : a full restore into an" ^0
"    empty cluster" ^0
"  what a reader plans with it : the recovery they will" ^0
"    actually run" ^0
"  measured duration of the one they ran : " + str(measured_partial_restore_minutes) + " minutes" ^0
"  as a percent of the published figure : " + str(partial_as_percent_of_the_published_figure) ^0
"" ^0

# ---- null control ----

# The same weekly job, alternating: half the drills extract one table as of one
# timestamp into a cluster that is up and holding data.
26 => nc_drills_that_extract_a_single_table
26 => nc_drills_that_restore_into_a_cluster_holding_data

"null control - half the drills rehearse a partial restore" ^0
"  drills this year : " + str(drills_this_year) + ", unchanged" ^0
"  extracting a single table : " + str(nc_drills_that_extract_a_single_table) ^0
"  into a cluster holding data : " + str(nc_drills_that_restore_into_a_cluster_holding_data) ^0
"  the backup did not become more restorable; the drill" ^0
"  started rehearsing the recovery that gets requested" ^0
"" ^0

# ---- the rule ----

"what a passing restore drill guarantees" ^0
"  the snapshot is complete and readable : exactly, and" ^0
"    verified by booting the application against it" ^0
"  a recovery will go the way the drill went : not" ^0
"    addressed; the drill fixes an initial state and a" ^0
"    scope, and the recovery you get chooses both" ^0
"" ^0
"a rehearsal is only as representative as its starting" ^0
"conditions; an empty target removes every conflict a" ^0
"restore can have, so the drill that proves the data is good" ^0
"is the one least able to tell you how the day will go" ^0
"" ^0

"The drill is real: weekly and automated, checksums against the source, row" ^0
"counts table by table, the application booted and smoke-tested - " + str(drills_this_year) + " drills," ^0
str(drills_that_passed) + " passed. It restores everything into an empty cluster, while all " + str(incidents_needing_a_partial_restore) ^0
"recoveries needed this year were partial into a live one, rehearsed by" ^0
str(drills_rehearsing_the_used_path_per_myriad) + " per ten thousand of the drills, and the one measured took " + str(measured_partial_restore_minutes) ^0
"minutes against a published RTO of " + str(published_rto_minutes) + " - " + str(partial_as_percent_of_the_published_figure) + " percent of it." ^0
```

## Python (deterministic transpilation)

```python
drills_this_year = 52
drills_that_passed = 52
published_rto_minutes = 40
data_recovery_incidents_this_year = 6
incidents_needing_a_full_cluster_restore = 0
drills_that_restore_into_a_cluster_holding_data = 0
drills_that_extract_a_single_table = 0
measured_partial_restore_minutes = 390
incidents_needing_a_partial_restore = data_recovery_incidents_this_year - incidents_needing_a_full_cluster_restore
minutes_beyond_the_published_rto = measured_partial_restore_minutes - published_rto_minutes
partial_as_percent_of_the_published_figure = int(measured_partial_restore_minutes * 100 / published_rto_minutes)
drills_rehearsing_the_used_path_per_myriad = int(drills_that_extract_a_single_table * 10000 / drills_this_year)
print("drills this year                : " + str(drills_this_year))
print("  passed                        : " + str(drills_that_passed))
print("  restoring into a cluster holding data : " + str(drills_that_restore_into_a_cluster_holding_data))
print("  extracting a single table     : " + str(drills_that_extract_a_single_table))
print("  rehearsing the path used      : " + str(drills_rehearsing_the_used_path_per_myriad) + " per ten thousand")
print("")
print("data recovery incidents         : " + str(data_recovery_incidents_this_year))
print("  needing a full cluster restore: " + str(incidents_needing_a_full_cluster_restore))
print("  needing a partial restore     : " + str(incidents_needing_a_partial_restore))
print("")
print("published RTO, minutes          : " + str(published_rto_minutes))
print("measured partial restore, minutes : " + str(measured_partial_restore_minutes))
print("  beyond the published figure   : " + str(minutes_beyond_the_published_rto))
print("  as a percent of it            : " + str(partial_as_percent_of_the_published_figure))
print("")
print("the restore drill")
print("  frequency : weekly, automated")
print("  checksums verified against the source : yes")
print("  row counts compared table by table    : yes")
print("  application booted against the copy   : yes, plus a")
print("    smoke suite")
print("  drills this year : " + str(drills_this_year) + ", passed " + str(drills_that_passed))
print("  verdict : RESTORABLE")
print("")
print("  restoring rather than trusting the backup job is the")
print("  whole difference, and this one boots the application")
print("")
print("the rehearsed operation")
print("  target        : a freshly provisioned empty cluster")
print("  scope         : the whole snapshot")
print("  concurrent load during it : none")
print("  what it proves : the snapshot is complete, readable, and")
print("    sufficient to stand the application up")
print("  what a reader takes from the RTO : how long a recovery")
print("    takes")
print("")
print("  the drill answers the question completely and the")
print("  question is total loss, which has not happened")
print("")
print("the six")
print("  clusters lost this year : " + str(incidents_needing_a_full_cluster_restore))
print("  incidents needing rows as of a time : " + str(incidents_needing_a_partial_restore))
print("  target in each case : a cluster that is up and serving")
print("  what the snapshot format allows : restore all of it")
print("  so the procedure is : stand up a side cluster, restore")
print("    everything, extract, copy across, reconcile")
print("  minutes that took, measured once : " + str(measured_partial_restore_minutes))
print("")
print("what an empty target never presents")
print("  an object that already exists : never")
print("  a sequence already ahead of the restored rows : never")
print("  a constraint held by a row not in the snapshot : never")
print("  a decision about which copy of a row wins   : never")
print("  drills that meet any of these : " + str(drills_that_restore_into_a_cluster_holding_data))
print("")
print("the RTO")
print("  where it came from : the drill, measured not estimated")
print("  what it is the duration of : a full restore into an")
print("    empty cluster")
print("  what a reader plans with it : the recovery they will")
print("    actually run")
print("  measured duration of the one they ran : " + str(measured_partial_restore_minutes) + " minutes")
print("  as a percent of the published figure : " + str(partial_as_percent_of_the_published_figure))
print("")
nc_drills_that_extract_a_single_table = 26
nc_drills_that_restore_into_a_cluster_holding_data = 26
print("null control - half the drills rehearse a partial restore")
print("  drills this year : " + str(drills_this_year) + ", unchanged")
print("  extracting a single table : " + str(nc_drills_that_extract_a_single_table))
print("  into a cluster holding data : " + str(nc_drills_that_restore_into_a_cluster_holding_data))
print("  the backup did not become more restorable; the drill")
print("  started rehearsing the recovery that gets requested")
print("")
print("what a passing restore drill guarantees")
print("  the snapshot is complete and readable : exactly, and")
print("    verified by booting the application against it")
print("  a recovery will go the way the drill went : not")
print("    addressed; the drill fixes an initial state and a")
print("    scope, and the recovery you get chooses both")
print("")
print("a rehearsal is only as representative as its starting")
print("conditions; an empty target removes every conflict a")
print("restore can have, so the drill that proves the data is good")
print("is the one least able to tell you how the day will go")
print("")
print("The drill is real: weekly and automated, checksums against the source, row")
print("counts table by table, the application booted and smoke-tested - " + str(drills_this_year) + " drills,")
print(str(drills_that_passed) + " passed. It restores everything into an empty cluster, while all " + str(incidents_needing_a_partial_restore))
print("recoveries needed this year were partial into a live one, rehearsed by")
print(str(drills_rehearsing_the_used_path_per_myriad) + " per ten thousand of the drills, and the one measured took " + str(measured_partial_restore_minutes))
print("minutes against a published RTO of " + str(published_rto_minutes) + " - " + str(partial_as_percent_of_the_published_figure) + " percent of it.")
```

## stdout (executed)

```text
drills this year                : 52
  passed                        : 52
  restoring into a cluster holding data : 0
  extracting a single table     : 0
  rehearsing the path used      : 0 per ten thousand

data recovery incidents         : 6
  needing a full cluster restore: 0
  needing a partial restore     : 6

published RTO, minutes          : 40
measured partial restore, minutes : 390
  beyond the published figure   : 350
  as a percent of it            : 975

the restore drill
  frequency : weekly, automated
  checksums verified against the source : yes
  row counts compared table by table    : yes
  application booted against the copy   : yes, plus a
    smoke suite
  drills this year : 52, passed 52
  verdict : RESTORABLE

  restoring rather than trusting the backup job is the
  whole difference, and this one boots the application

the rehearsed operation
  target        : a freshly provisioned empty cluster
  scope         : the whole snapshot
  concurrent load during it : none
  what it proves : the snapshot is complete, readable, and
    sufficient to stand the application up
  what a reader takes from the RTO : how long a recovery
    takes

  the drill answers the question completely and the
  question is total loss, which has not happened

the six
  clusters lost this year : 0
  incidents needing rows as of a time : 6
  target in each case : a cluster that is up and serving
  what the snapshot format allows : restore all of it
  so the procedure is : stand up a side cluster, restore
    everything, extract, copy across, reconcile
  minutes that took, measured once : 390

what an empty target never presents
  an object that already exists : never
  a sequence already ahead of the restored rows : never
  a constraint held by a row not in the snapshot : never
  a decision about which copy of a row wins   : never
  drills that meet any of these : 0

the RTO
  where it came from : the drill, measured not estimated
  what it is the duration of : a full restore into an
    empty cluster
  what a reader plans with it : the recovery they will
    actually run
  measured duration of the one they ran : 390 minutes
  as a percent of the published figure : 975

null control - half the drills rehearse a partial restore
  drills this year : 52, unchanged
  extracting a single table : 26
  into a cluster holding data : 26
  the backup did not become more restorable; the drill
  started rehearsing the recovery that gets requested

what a passing restore drill guarantees
  the snapshot is complete and readable : exactly, and
    verified by booting the application against it
  a recovery will go the way the drill went : not
    addressed; the drill fixes an initial state and a
    scope, and the recovery you get chooses both

a rehearsal is only as representative as its starting
conditions; an empty target removes every conflict a
restore can have, so the drill that proves the data is good
is the one least able to tell you how the day will go

The drill is real: weekly and automated, checksums against the source, row
counts table by table, the application booted and smoke-tested - 52 drills,
52 passed. It restores everything into an empty cluster, while all 6
recoveries needed this year were partial into a live one, rehearsed by
0 per ten thousand of the drills, and the one measured took 390
minutes against a published RTO of 40 - 975 percent of it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
