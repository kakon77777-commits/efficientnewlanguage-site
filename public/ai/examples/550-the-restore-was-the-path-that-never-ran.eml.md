<!-- canonical: efficientnewlanguage.org/ai/examples/550-the-restore-was-the-path-that-never-ran | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 550 — The restore was the path that never ran

`the_restore_was_the_path_that_never_ran.eml` - The backup has succeeded 412 nights in a row. How much of the restore path that number covers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The backup has
# succeeded 412 nights in a row. How much of the restore path that number
# covers is computed below.
#
# The backup is genuinely well built. It has a verification step rather than
# trusting the exit code, it alerts on failure, it has caught three real
# defects in its own life and each was fixed, and 412 consecutive successes is
# not a lucky streak, it is a mature piece of code. Nothing below is a
# criticism of it.
#
# Backup and restore are two programs. They share a file format and nothing
# else: different code, different libraries, different failure modes, different
# authors in two of the three cases. A backup that succeeds says the writer
# worked. It says nothing about the reader, which has run once.
#
# The reason is not carelessness. Code gets tested in proportion to how often
# it runs, and the paths that only run in an emergency are by construction the
# paths that have run least. The backup is well tested because it executes
# every night, which is the same fact from the other side.

412 => backup_runs
3 => backup_defects_found
31 => backup_commits
1 => restore_runs
23 => restore_commits
14 => months_since_drill

"executions and change, per path" ^0
("  backup  : %s runs, %s commits, %s runs per commit" % (str(backup_runs), str(backup_commits), str(int(backup_runs / backup_commits))))^0
("  restore : %s run, %s commits, %s runs per commit" % (str(restore_runs), str(restore_commits), str(int(restore_runs / restore_commits))))^0
("  restore commits never executed even once : %s of %s" % (str(restore_commits - restore_runs), str(restore_commits)))^0
"" ^0

("  defects found in the backup path  : %s in %s runs" % (str(backup_defects_found), str(backup_runs)))^0
("  defects found in the restore path : 0 in %s run" % str(restore_runs))^0
"  the second zero is not a measurement, it is the absence of one" ^0
"" ^0

# ---- what the nightly verification checks ----

# [failure mode, caught by the backup's own verification]
[["output file is empty", "yes"], ["write truncated by a full disk", "no"], ["encrypted with a key since rotated", "no"], ["schema is newer than the dump", "no"], ["referenced blobs expired by a lifecycle rule", "no"], ["compression codec changed version", "no"]] => modes

"restore failure modes and what the nightly check sees" ^0
0 => caught
for m in modes:
    if m[1] == "yes":
        caught + 1 => caught
    ("  %-46s %s" % (m[0], m[1]))^0
("  modes the verification can detect : %s of %s" % (str(caught), str(len(modes))))^0
"  the check confirms a file was written, which is the question the backup" ^0
"  is able to ask about itself" ^0
"" ^0

# ---- the evidence that does exist ----

23 => commits_since_drill
"the one restore that was run" ^0
("  when                          : %s months ago, in a drill" % str(months_since_drill))^0
"  result                        : passed" ^0
("  commits to the restore path since : %s" % str(commits_since_drill))^0
("  that evidence covers          : the restore path as it was %s months ago" % str(months_since_drill))^0
"  a passing drill is real evidence and it has an age, and nothing in the" ^0
"  dashboard shows the age" ^0
"" ^0

# ---- the control ----
#
# The backup path, under exactly the same review standards, by the same team.

"control - the path that runs every night" ^0
("  executions          : %s" % str(backup_runs))^0
("  defects found       : %s, all in production, all fixed" % str(backup_defects_found))^0
("  defects per 1000 runs : %s" % str(int(backup_defects_found * 1000 / backup_runs)))^0
"  reviewed no more carefully than the restore path, and written by the" ^0
"  same people, so review is not what separates them" ^0
"  exposure is what separates them" ^0
"" ^0

# ---- the same asymmetry elsewhere ----

# [path, executions per year, how it is discovered to be broken]
[["backup writer", 365, "the nightly alert"], ["restore reader", 1, "an outage"], ["failover to standby", 0, "an outage"], ["certificate renewal", 4, "an outage"], ["request handler", 400000000, "immediately"]] => paths

"paths ranked by how often they run" ^0
for p in paths:
    ("  %-22s %-14s found broken by: %s" % (p[0], str(p[1]), p[2]))^0
"  the column on the right is a function of the column on its left" ^0
"" ^0

# ---- what would make the restore path ordinary ----

"how to give a path exposure it does not have naturally" ^0
"  restore into a scratch database nightly and diff the row counts" ^0
("    executions per year would become %s instead of %s" % (str(365), str(restore_runs)))^0
"  the cost is one scratch database and the time of one restore" ^0
"  the current cost is that the first execution in production is also" ^0
"  the first one that matters" ^0
"" ^0

"The backup is mature: 412 consecutive successes and three defects found and" ^0
("fixed in its own life. It is the writer. The reader has run %s time, %s" % (str(restore_runs), str(months_since_drill)))^0
("months and %s commits ago, and the nightly verification covers %s of %s" % (str(restore_commits), str(caught), str(len(modes))))^0
"restore failure modes." ^0
```

## Python (deterministic transpilation)

```python
backup_runs = 412
backup_defects_found = 3
backup_commits = 31
restore_runs = 1
restore_commits = 23
months_since_drill = 14
print("executions and change, per path")
print("  backup  : %s runs, %s commits, %s runs per commit" % (str(backup_runs), str(backup_commits), str(int(backup_runs / backup_commits))))
print("  restore : %s run, %s commits, %s runs per commit" % (str(restore_runs), str(restore_commits), str(int(restore_runs / restore_commits))))
print("  restore commits never executed even once : %s of %s" % (str(restore_commits - restore_runs), str(restore_commits)))
print("")
print("  defects found in the backup path  : %s in %s runs" % (str(backup_defects_found), str(backup_runs)))
print("  defects found in the restore path : 0 in %s run" % str(restore_runs))
print("  the second zero is not a measurement, it is the absence of one")
print("")
modes = [["output file is empty", "yes"], ["write truncated by a full disk", "no"], ["encrypted with a key since rotated", "no"], ["schema is newer than the dump", "no"], ["referenced blobs expired by a lifecycle rule", "no"], ["compression codec changed version", "no"]]
print("restore failure modes and what the nightly check sees")
caught = 0
for m in modes:
    if m[1] == "yes":
        caught = caught + 1
    print("  %-46s %s" % (m[0], m[1]))
print("  modes the verification can detect : %s of %s" % (str(caught), str(len(modes))))
print("  the check confirms a file was written, which is the question the backup")
print("  is able to ask about itself")
print("")
commits_since_drill = 23
print("the one restore that was run")
print("  when                          : %s months ago, in a drill" % str(months_since_drill))
print("  result                        : passed")
print("  commits to the restore path since : %s" % str(commits_since_drill))
print("  that evidence covers          : the restore path as it was %s months ago" % str(months_since_drill))
print("  a passing drill is real evidence and it has an age, and nothing in the")
print("  dashboard shows the age")
print("")
print("control - the path that runs every night")
print("  executions          : %s" % str(backup_runs))
print("  defects found       : %s, all in production, all fixed" % str(backup_defects_found))
print("  defects per 1000 runs : %s" % str(int(backup_defects_found * 1000 / backup_runs)))
print("  reviewed no more carefully than the restore path, and written by the")
print("  same people, so review is not what separates them")
print("  exposure is what separates them")
print("")
paths = [["backup writer", 365, "the nightly alert"], ["restore reader", 1, "an outage"], ["failover to standby", 0, "an outage"], ["certificate renewal", 4, "an outage"], ["request handler", 400000000, "immediately"]]
print("paths ranked by how often they run")
for p in paths:
    print("  %-22s %-14s found broken by: %s" % (p[0], str(p[1]), p[2]))
print("  the column on the right is a function of the column on its left")
print("")
print("how to give a path exposure it does not have naturally")
print("  restore into a scratch database nightly and diff the row counts")
print("    executions per year would become %s instead of %s" % (str(365), str(restore_runs)))
print("  the cost is one scratch database and the time of one restore")
print("  the current cost is that the first execution in production is also")
print("  the first one that matters")
print("")
print("The backup is mature: 412 consecutive successes and three defects found and")
print("fixed in its own life. It is the writer. The reader has run %s time, %s" % (str(restore_runs), str(months_since_drill)))
print("months and %s commits ago, and the nightly verification covers %s of %s" % (str(restore_commits), str(caught), str(len(modes))))
print("restore failure modes.")
```

## stdout (executed)

```text
executions and change, per path
  backup  : 412 runs, 31 commits, 13 runs per commit
  restore : 1 run, 23 commits, 0 runs per commit
  restore commits never executed even once : 22 of 23

  defects found in the backup path  : 3 in 412 runs
  defects found in the restore path : 0 in 1 run
  the second zero is not a measurement, it is the absence of one

restore failure modes and what the nightly check sees
  output file is empty                           yes
  write truncated by a full disk                 no
  encrypted with a key since rotated             no
  schema is newer than the dump                  no
  referenced blobs expired by a lifecycle rule   no
  compression codec changed version              no
  modes the verification can detect : 1 of 6
  the check confirms a file was written, which is the question the backup
  is able to ask about itself

the one restore that was run
  when                          : 14 months ago, in a drill
  result                        : passed
  commits to the restore path since : 23
  that evidence covers          : the restore path as it was 14 months ago
  a passing drill is real evidence and it has an age, and nothing in the
  dashboard shows the age

control - the path that runs every night
  executions          : 412
  defects found       : 3, all in production, all fixed
  defects per 1000 runs : 7
  reviewed no more carefully than the restore path, and written by the
  same people, so review is not what separates them
  exposure is what separates them

paths ranked by how often they run
  backup writer          365            found broken by: the nightly alert
  restore reader         1              found broken by: an outage
  failover to standby    0              found broken by: an outage
  certificate renewal    4              found broken by: an outage
  request handler        400000000      found broken by: immediately
  the column on the right is a function of the column on its left

how to give a path exposure it does not have naturally
  restore into a scratch database nightly and diff the row counts
    executions per year would become 365 instead of 1
  the cost is one scratch database and the time of one restore
  the current cost is that the first execution in production is also
  the first one that matters

The backup is mature: 412 consecutive successes and three defects found and
fixed in its own life. It is the writer. The reader has run 1 time, 14
months and 23 commits ago, and the nightly verification covers 1 of 6
restore failure modes.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
