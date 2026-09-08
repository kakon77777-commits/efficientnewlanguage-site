<!-- canonical: efficientnewlanguage.org/ai/examples/755-the-integrity-check-read-the-backups-own-manifest | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 755 — The integrity check read the backups own manifest

`the_integrity_check_read_the_backups_own_manifest.eml` - Every backup is verified rather than assumed: each file's checksum is recomputed after upload and the count is compared against the manifest, which caught three truncated uploads. What the manifest is a list of is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every backup is
# verified rather than assumed: each file's checksum is recomputed after upload
# and the count is compared against the manifest, which caught three truncated
# uploads. What the manifest is a list of is computed below.
#
# The verification is the kind most teams skip. A backup job that reports
# success has reported that it did not crash; this one recomputes every
# uploaded file's checksum from the object store and compares it to the value
# computed at read time, so a silent truncation or a corrupted transfer is
# caught rather than discovered during a restore. It found three.
#
# The count it compares against comes from the MANIFEST, and the manifest is
# written by the same job from the list of things it decided to include. A
# database the job never enumerated is not a missing file; it is not a file.
#
# The server has eighteen databases and the include list names fifteen.

41200 => files_in_the_manifest
41200 => files_whose_checksum_was_recomputed
3 => truncated_uploads_caught
18 => databases_on_the_server
15 => databases_in_the_include_list
0 => jobs_that_enumerate_the_server
0 => alerts_when_a_database_is_absent_from_the_include_list
1 => processes_that_write_the_manifest_and_check_against_it

databases_on_the_server - databases_in_the_include_list => databases_never_backed_up
int(databases_in_the_include_list * 10000 / databases_on_the_server) => covered_per_myriad
int(files_whose_checksum_was_recomputed * 10000 / files_in_the_manifest) => manifest_verified_per_myriad

"files in the manifest           : " + str(files_in_the_manifest) ^0
"  checksum recomputed           : " + str(files_whose_checksum_was_recomputed) ^0
"  share verified                : " + str(manifest_verified_per_myriad) + " per ten thousand" ^0
"truncated uploads caught        : " + str(truncated_uploads_caught) ^0
"" ^0
"databases on the server         : " + str(databases_on_the_server) ^0
"  in the include list           : " + str(databases_in_the_include_list) ^0
"  never backed up               : " + str(databases_never_backed_up) ^0
"  share covered                 : " + str(covered_per_myriad) + " per ten thousand" ^0
"" ^0
"processes writing the manifest and checking it : " + str(processes_that_write_the_manifest_and_check_against_it) ^0
"jobs that enumerate the server                 : " + str(jobs_that_enumerate_the_server) ^0
"alerts when a database is absent from the list : " + str(alerts_when_a_database_is_absent_from_the_include_list) ^0
"" ^0

# ---- what the check verified ----

"the integrity check" ^0
"  what a plain success report means : the job did not" ^0
"    crash" ^0
"  what this does instead : recomputes every uploaded" ^0
"    file's checksum from the object store" ^0
"  compared against : the value computed at read time" ^0
"  so a silent truncation is : caught, not discovered" ^0
"    during a restore" ^0
"  truncated uploads it found : " + str(truncated_uploads_caught) ^0
"  verdict : WHAT WAS UPLOADED IS INTACT" ^0
"" ^0
"  recomputing from the object store rather than trusting" ^0
"  the upload's own return code is the expensive half, and" ^0
"  it is the half that found the three" ^0
"" ^0

# ---- where the expected count comes from ----

"the two sides of the comparison" ^0
"  one  : the files present in the object store" ^0
"  other: the count in the manifest" ^0
"  who writes the manifest : this job, from its include" ^0
"    list" ^0
"  processes doing both : " + str(processes_that_write_the_manifest_and_check_against_it) ^0
"  what a database outside the include list looks like : " ^0
"    absent from both sides" ^0
"  databases in that state : " + str(databases_never_backed_up) ^0
"" ^0
"  the check can prove the job finished what it started" ^0
"  and cannot ask what it should have started" ^0
"" ^0

# ---- the include list is not wrong ----

# It was correct when it was written. Two of the three missing databases were
# created afterwards by a team that had no reason to know a list existed, and
# the third was renamed.
"how three fell outside" ^0
"  created after the list was written : two" ^0
"  renamed since : one" ^0
"  was the list wrong when written : no" ^0
"  did anyone edit it incorrectly : no" ^0
"  what would have to happen for the list to notice : it" ^0
"    would have to be derived rather than maintained" ^0
"  alerts on that : " + str(alerts_when_a_database_is_absent_from_the_include_list) ^0
"" ^0

# ---- what the report says ----

"the nightly report" ^0
"  files verified : " + str(files_whose_checksum_was_recomputed) + " of " + str(files_in_the_manifest) ^0
"  integrity failures : none since the three" ^0
"  what a reader concludes : the backup is complete" ^0
"  what is claimed : everything the job set out to copy" ^0
"    arrived intact" ^0
"  the difference : " + str(databases_never_backed_up) + " databases" ^0
"" ^0

# ---- null control ----

# The same check, with the expected set enumerated from the server's own
# catalog rather than from the job's include list.
databases_on_the_server => nc_databases_in_the_expected_set
0 => nc_databases_never_backed_up
1 => nc_jobs_that_enumerate_the_server

"null control - the expected set comes from the server" ^0
"  files verified : " + str(files_whose_checksum_was_recomputed) + ", unchanged" ^0
"  jobs that enumerate the server : " + str(nc_jobs_that_enumerate_the_server) ^0
"  databases in the expected set : " + str(nc_databases_in_the_expected_set) ^0
"  databases never backed up : " + str(nc_databases_never_backed_up) ^0
"  the checksum work did not change; the list it is checked" ^0
"  against stopped being written by the thing it checks" ^0
"" ^0

# ---- the rule ----

"what a verified backup guarantees" ^0
"  everything the job copied arrived intact : exactly," ^0
"    recomputed from the store, and it caught " + str(truncated_uploads_caught) ^0
"  everything is backed up : not addressed; the expected" ^0
"    set is written by the job, so a thing it never" ^0
"    enumerated cannot be found missing" ^0
"" ^0
"a completeness check needs an expectation from outside the" ^0
"process it checks; taking the expectation from the process's" ^0
"own record turns every omission into an absence, and an" ^0
"absence is what a passing check looks like" ^0
"" ^0

"The check recomputes every uploaded file's checksum from the object store" ^0
"rather than trusting a return code, and it caught " + str(truncated_uploads_caught) + " truncated uploads -" ^0
str(files_whose_checksum_was_recomputed) + " of " + str(files_in_the_manifest) + " files verified. It compares against a manifest the same job" ^0
"writes from its include list, which names " + str(databases_in_the_include_list) + " of " + str(databases_on_the_server) + " databases - " + str(covered_per_myriad) ^0
"per ten thousand - leaving " + str(databases_never_backed_up) + " that are absent from both sides of the comparison." ^0
```

## Python (deterministic transpilation)

```python
files_in_the_manifest = 41200
files_whose_checksum_was_recomputed = 41200
truncated_uploads_caught = 3
databases_on_the_server = 18
databases_in_the_include_list = 15
jobs_that_enumerate_the_server = 0
alerts_when_a_database_is_absent_from_the_include_list = 0
processes_that_write_the_manifest_and_check_against_it = 1
databases_never_backed_up = databases_on_the_server - databases_in_the_include_list
covered_per_myriad = int(databases_in_the_include_list * 10000 / databases_on_the_server)
manifest_verified_per_myriad = int(files_whose_checksum_was_recomputed * 10000 / files_in_the_manifest)
print("files in the manifest           : " + str(files_in_the_manifest))
print("  checksum recomputed           : " + str(files_whose_checksum_was_recomputed))
print("  share verified                : " + str(manifest_verified_per_myriad) + " per ten thousand")
print("truncated uploads caught        : " + str(truncated_uploads_caught))
print("")
print("databases on the server         : " + str(databases_on_the_server))
print("  in the include list           : " + str(databases_in_the_include_list))
print("  never backed up               : " + str(databases_never_backed_up))
print("  share covered                 : " + str(covered_per_myriad) + " per ten thousand")
print("")
print("processes writing the manifest and checking it : " + str(processes_that_write_the_manifest_and_check_against_it))
print("jobs that enumerate the server                 : " + str(jobs_that_enumerate_the_server))
print("alerts when a database is absent from the list : " + str(alerts_when_a_database_is_absent_from_the_include_list))
print("")
print("the integrity check")
print("  what a plain success report means : the job did not")
print("    crash")
print("  what this does instead : recomputes every uploaded")
print("    file's checksum from the object store")
print("  compared against : the value computed at read time")
print("  so a silent truncation is : caught, not discovered")
print("    during a restore")
print("  truncated uploads it found : " + str(truncated_uploads_caught))
print("  verdict : WHAT WAS UPLOADED IS INTACT")
print("")
print("  recomputing from the object store rather than trusting")
print("  the upload's own return code is the expensive half, and")
print("  it is the half that found the three")
print("")
print("the two sides of the comparison")
print("  one  : the files present in the object store")
print("  other: the count in the manifest")
print("  who writes the manifest : this job, from its include")
print("    list")
print("  processes doing both : " + str(processes_that_write_the_manifest_and_check_against_it))
print("  what a database outside the include list looks like : ")
print("    absent from both sides")
print("  databases in that state : " + str(databases_never_backed_up))
print("")
print("  the check can prove the job finished what it started")
print("  and cannot ask what it should have started")
print("")
print("how three fell outside")
print("  created after the list was written : two")
print("  renamed since : one")
print("  was the list wrong when written : no")
print("  did anyone edit it incorrectly : no")
print("  what would have to happen for the list to notice : it")
print("    would have to be derived rather than maintained")
print("  alerts on that : " + str(alerts_when_a_database_is_absent_from_the_include_list))
print("")
print("the nightly report")
print("  files verified : " + str(files_whose_checksum_was_recomputed) + " of " + str(files_in_the_manifest))
print("  integrity failures : none since the three")
print("  what a reader concludes : the backup is complete")
print("  what is claimed : everything the job set out to copy")
print("    arrived intact")
print("  the difference : " + str(databases_never_backed_up) + " databases")
print("")
nc_databases_in_the_expected_set = databases_on_the_server
nc_databases_never_backed_up = 0
nc_jobs_that_enumerate_the_server = 1
print("null control - the expected set comes from the server")
print("  files verified : " + str(files_whose_checksum_was_recomputed) + ", unchanged")
print("  jobs that enumerate the server : " + str(nc_jobs_that_enumerate_the_server))
print("  databases in the expected set : " + str(nc_databases_in_the_expected_set))
print("  databases never backed up : " + str(nc_databases_never_backed_up))
print("  the checksum work did not change; the list it is checked")
print("  against stopped being written by the thing it checks")
print("")
print("what a verified backup guarantees")
print("  everything the job copied arrived intact : exactly,")
print("    recomputed from the store, and it caught " + str(truncated_uploads_caught))
print("  everything is backed up : not addressed; the expected")
print("    set is written by the job, so a thing it never")
print("    enumerated cannot be found missing")
print("")
print("a completeness check needs an expectation from outside the")
print("process it checks; taking the expectation from the process's")
print("own record turns every omission into an absence, and an")
print("absence is what a passing check looks like")
print("")
print("The check recomputes every uploaded file's checksum from the object store")
print("rather than trusting a return code, and it caught " + str(truncated_uploads_caught) + " truncated uploads -")
print(str(files_whose_checksum_was_recomputed) + " of " + str(files_in_the_manifest) + " files verified. It compares against a manifest the same job")
print("writes from its include list, which names " + str(databases_in_the_include_list) + " of " + str(databases_on_the_server) + " databases - " + str(covered_per_myriad))
print("per ten thousand - leaving " + str(databases_never_backed_up) + " that are absent from both sides of the comparison.")
```

## stdout (executed)

```text
files in the manifest           : 41200
  checksum recomputed           : 41200
  share verified                : 10000 per ten thousand
truncated uploads caught        : 3

databases on the server         : 18
  in the include list           : 15
  never backed up               : 3
  share covered                 : 8333 per ten thousand

processes writing the manifest and checking it : 1
jobs that enumerate the server                 : 0
alerts when a database is absent from the list : 0

the integrity check
  what a plain success report means : the job did not
    crash
  what this does instead : recomputes every uploaded
    file's checksum from the object store
  compared against : the value computed at read time
  so a silent truncation is : caught, not discovered
    during a restore
  truncated uploads it found : 3
  verdict : WHAT WAS UPLOADED IS INTACT

  recomputing from the object store rather than trusting
  the upload's own return code is the expensive half, and
  it is the half that found the three

the two sides of the comparison
  one  : the files present in the object store
  other: the count in the manifest
  who writes the manifest : this job, from its include
    list
  processes doing both : 1
  what a database outside the include list looks like : 
    absent from both sides
  databases in that state : 3

  the check can prove the job finished what it started
  and cannot ask what it should have started

how three fell outside
  created after the list was written : two
  renamed since : one
  was the list wrong when written : no
  did anyone edit it incorrectly : no
  what would have to happen for the list to notice : it
    would have to be derived rather than maintained
  alerts on that : 0

the nightly report
  files verified : 41200 of 41200
  integrity failures : none since the three
  what a reader concludes : the backup is complete
  what is claimed : everything the job set out to copy
    arrived intact
  the difference : 3 databases

null control - the expected set comes from the server
  files verified : 41200, unchanged
  jobs that enumerate the server : 1
  databases in the expected set : 18
  databases never backed up : 0
  the checksum work did not change; the list it is checked
  against stopped being written by the thing it checks

what a verified backup guarantees
  everything the job copied arrived intact : exactly,
    recomputed from the store, and it caught 3
  everything is backed up : not addressed; the expected
    set is written by the job, so a thing it never
    enumerated cannot be found missing

a completeness check needs an expectation from outside the
process it checks; taking the expectation from the process's
own record turns every omission into an absence, and an
absence is what a passing check looks like

The check recomputes every uploaded file's checksum from the object store
rather than trusting a return code, and it caught 3 truncated uploads -
41200 of 41200 files verified. It compares against a manifest the same job
writes from its include list, which names 15 of 18 databases - 8333
per ten thousand - leaving 3 that are absent from both sides of the comparison.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
