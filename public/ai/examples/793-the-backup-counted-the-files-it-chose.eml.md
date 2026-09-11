<!-- canonical: efficientnewlanguage.org/ai/examples/793-the-backup-counted-the-files-it-chose | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 793 — The backup counted the files it chose

`the_backup_counted_the_files_it_chose.eml` - The nightly backup has reported success with zero errors for the whole quarter, and every count it reports is true. What it never enumerated is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The nightly backup
# has reported success with zero errors for the whole quarter, and every count
# it reports is true. What it never enumerated is computed below.
#
# The job is careful. It checksums each file after writing it; it fails loudly
# on a single write error; it stores three copies in two regions; and it emails
# a per-run report with the file count and the byte total.
#
# It backs up the paths on an include list, and reports over those paths.

12 => directories_on_the_include_list
480000 => files_enumerated
480000 => files_written
0 => write_errors
15 => directories_on_disk
61000 => files_in_the_unlisted_directories

directories_on_disk - directories_on_the_include_list => directories_never_enumerated
files_enumerated + files_in_the_unlisted_directories => files_on_disk
int(files_written * 10000 / files_on_disk) => fraction_of_disk_backed_up_per_myriad
int(files_in_the_unlisted_directories * 10000 / files_on_disk) => fraction_never_a_candidate_per_myriad

"directories on the include list : " + str(directories_on_the_include_list) ^0
"directories on disk             : " + str(directories_on_disk) ^0
"  never enumerated              : " + str(directories_never_enumerated) ^0
"files enumerated                : " + str(files_enumerated) ^0
"  written                       : " + str(files_written) ^0
"  write errors                  : " + str(write_errors) ^0
"files in the unlisted dirs      : " + str(files_in_the_unlisted_directories) ^0
"files on disk                   : " + str(files_on_disk) ^0
"fraction of disk backed up      : " + str(fraction_of_disk_backed_up_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the backup verified ----

"the backup job" ^0
"  after each write : it checksums the file" ^0
"  on a write error : it fails the whole run" ^0
"  copies kept : three, in two regions" ^0
"  report : file count and byte total, emailed" ^0
"  write errors this quarter : " + str(write_errors) ^0
"  verdict : SUCCESS" ^0
"" ^0
"  checksumming every written file is the part almost" ^0
"  nobody does, and it is why the byte total is trusted" ^0
"" ^0

# ---- what the count was over ----

"the files the job saw" ^0
"  files it enumerated : " + str(files_enumerated) ^0
"  files it wrote : " + str(files_written) + ", all verified" ^0
"  where the list comes from : twelve configured paths" ^0
"  directories on disk not on the list : " ^0
"    " + str(directories_never_enumerated) ^0
"  files in those directories : " + str(files_in_the_unlisted_directories) ^0
"  their chance to succeed or fail : none; they were" ^0
"    never candidates" ^0
"" ^0

# ---- what is not in any copy ----

"the three unlisted directories" ^0
"  added : last quarter, after the include list was set" ^0
"  files they hold : " + str(files_in_the_unlisted_directories) ^0
"  copies of them in the backup : 0" ^0
"  errors the job raised about them : 0; an unenumerated" ^0
"    file cannot error" ^0
"  fraction of the disk that was never a candidate : " ^0
"    " + str(fraction_never_a_candidate_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same job, enumerating from the filesystem root and reporting the
# directories it found but was not configured to copy.
0 => nc_write_errors
3 => nc_directories_found_but_not_configured
61000 => nc_files_it_would_flag_as_uncovered

"null control - enumerate from the root, report the gap" ^0
"  write errors : " + str(nc_write_errors) + ", unchanged" ^0
"  directories found but not configured : " ^0
"    " + str(nc_directories_found_but_not_configured) ^0
"  files it would flag as uncovered : " ^0
"    " + str(nc_files_it_would_flag_as_uncovered) ^0
"  no file changed and no copy was made; the job stopped" ^0
"  taking its own include list as the definition of all" ^0
"" ^0

# ---- the rule ----

"what a successful backup guarantees" ^0
"  every file it enumerated is written and checksummed :" ^0
"    exactly, " + str(files_written) + " of them, zero errors" ^0
"  every file is backed up : not addressed; the job reports" ^0
"    on the files it enumerated, and three directories were" ^0
"    never on the include list, so their " + str(files_in_the_unlisted_directories) + " files" ^0
"    were never candidates to succeed or to fail" ^0
"" ^0
"a job's success is a statement about the work it took on, and" ^0
"the work it took on was chosen by a list; the files outside" ^0
"the list are not failures, they are absences, and a report of" ^0
"errors cannot show an absence" ^0
"" ^0

"It checksums every written file, fails on one error, and keeps three copies -" ^0
"" + str(files_written) + " files, zero errors, SUCCESS. It enumerates an include list of twelve" ^0
"paths, so three directories added later were never seen: " + str(files_in_the_unlisted_directories) + " files, " ^0
"" + str(fraction_never_a_candidate_per_myriad) + " per ten thousand of the disk, in " + str(directories_never_enumerated) + " directories no copy holds." ^0
```

## Python (deterministic transpilation)

```python
directories_on_the_include_list = 12
files_enumerated = 480000
files_written = 480000
write_errors = 0
directories_on_disk = 15
files_in_the_unlisted_directories = 61000
directories_never_enumerated = directories_on_disk - directories_on_the_include_list
files_on_disk = files_enumerated + files_in_the_unlisted_directories
fraction_of_disk_backed_up_per_myriad = int(files_written * 10000 / files_on_disk)
fraction_never_a_candidate_per_myriad = int(files_in_the_unlisted_directories * 10000 / files_on_disk)
print("directories on the include list : " + str(directories_on_the_include_list))
print("directories on disk             : " + str(directories_on_disk))
print("  never enumerated              : " + str(directories_never_enumerated))
print("files enumerated                : " + str(files_enumerated))
print("  written                       : " + str(files_written))
print("  write errors                  : " + str(write_errors))
print("files in the unlisted dirs      : " + str(files_in_the_unlisted_directories))
print("files on disk                   : " + str(files_on_disk))
print("fraction of disk backed up      : " + str(fraction_of_disk_backed_up_per_myriad) + " per ten thousand")
print("")
print("the backup job")
print("  after each write : it checksums the file")
print("  on a write error : it fails the whole run")
print("  copies kept : three, in two regions")
print("  report : file count and byte total, emailed")
print("  write errors this quarter : " + str(write_errors))
print("  verdict : SUCCESS")
print("")
print("  checksumming every written file is the part almost")
print("  nobody does, and it is why the byte total is trusted")
print("")
print("the files the job saw")
print("  files it enumerated : " + str(files_enumerated))
print("  files it wrote : " + str(files_written) + ", all verified")
print("  where the list comes from : twelve configured paths")
print("  directories on disk not on the list : ")
print("    " + str(directories_never_enumerated))
print("  files in those directories : " + str(files_in_the_unlisted_directories))
print("  their chance to succeed or fail : none; they were")
print("    never candidates")
print("")
print("the three unlisted directories")
print("  added : last quarter, after the include list was set")
print("  files they hold : " + str(files_in_the_unlisted_directories))
print("  copies of them in the backup : 0")
print("  errors the job raised about them : 0; an unenumerated")
print("    file cannot error")
print("  fraction of the disk that was never a candidate : ")
print("    " + str(fraction_never_a_candidate_per_myriad) + " per ten thousand")
print("")
nc_write_errors = 0
nc_directories_found_but_not_configured = 3
nc_files_it_would_flag_as_uncovered = 61000
print("null control - enumerate from the root, report the gap")
print("  write errors : " + str(nc_write_errors) + ", unchanged")
print("  directories found but not configured : ")
print("    " + str(nc_directories_found_but_not_configured))
print("  files it would flag as uncovered : ")
print("    " + str(nc_files_it_would_flag_as_uncovered))
print("  no file changed and no copy was made; the job stopped")
print("  taking its own include list as the definition of all")
print("")
print("what a successful backup guarantees")
print("  every file it enumerated is written and checksummed :")
print("    exactly, " + str(files_written) + " of them, zero errors")
print("  every file is backed up : not addressed; the job reports")
print("    on the files it enumerated, and three directories were")
print("    never on the include list, so their " + str(files_in_the_unlisted_directories) + " files")
print("    were never candidates to succeed or to fail")
print("")
print("a job's success is a statement about the work it took on, and")
print("the work it took on was chosen by a list; the files outside")
print("the list are not failures, they are absences, and a report of")
print("errors cannot show an absence")
print("")
print("It checksums every written file, fails on one error, and keeps three copies -")
print("" + str(files_written) + " files, zero errors, SUCCESS. It enumerates an include list of twelve")
print("paths, so three directories added later were never seen: " + str(files_in_the_unlisted_directories) + " files, ")
print("" + str(fraction_never_a_candidate_per_myriad) + " per ten thousand of the disk, in " + str(directories_never_enumerated) + " directories no copy holds.")
```

## stdout (executed)

```text
directories on the include list : 12
directories on disk             : 15
  never enumerated              : 3
files enumerated                : 480000
  written                       : 480000
  write errors                  : 0
files in the unlisted dirs      : 61000
files on disk                   : 541000
fraction of disk backed up      : 8872 per ten thousand

the backup job
  after each write : it checksums the file
  on a write error : it fails the whole run
  copies kept : three, in two regions
  report : file count and byte total, emailed
  write errors this quarter : 0
  verdict : SUCCESS

  checksumming every written file is the part almost
  nobody does, and it is why the byte total is trusted

the files the job saw
  files it enumerated : 480000
  files it wrote : 480000, all verified
  where the list comes from : twelve configured paths
  directories on disk not on the list : 
    3
  files in those directories : 61000
  their chance to succeed or fail : none; they were
    never candidates

the three unlisted directories
  added : last quarter, after the include list was set
  files they hold : 61000
  copies of them in the backup : 0
  errors the job raised about them : 0; an unenumerated
    file cannot error
  fraction of the disk that was never a candidate : 
    1127 per ten thousand

null control - enumerate from the root, report the gap
  write errors : 0, unchanged
  directories found but not configured : 
    3
  files it would flag as uncovered : 
    61000
  no file changed and no copy was made; the job stopped
  taking its own include list as the definition of all

what a successful backup guarantees
  every file it enumerated is written and checksummed :
    exactly, 480000 of them, zero errors
  every file is backed up : not addressed; the job reports
    on the files it enumerated, and three directories were
    never on the include list, so their 61000 files
    were never candidates to succeed or to fail

a job's success is a statement about the work it took on, and
the work it took on was chosen by a list; the files outside
the list are not failures, they are absences, and a report of
errors cannot show an absence

It checksums every written file, fails on one error, and keeps three copies -
480000 files, zero errors, SUCCESS. It enumerates an include list of twelve
paths, so three directories added later were never seen: 61000 files, 
1127 per ten thousand of the disk, in 3 directories no copy holds.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
