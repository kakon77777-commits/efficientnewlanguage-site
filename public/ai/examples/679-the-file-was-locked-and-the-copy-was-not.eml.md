<!-- canonical: efficientnewlanguage.org/ai/examples/679-the-file-was-locked-and-the-copy-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 679 — The file was locked and the copy was not

`the_file_was_locked_and_the_copy_was_not.eml` - Two writers can never interleave, the lock has held for three years, and no torn write has ever been observed. How many backups are torn is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two writers can
# never interleave, the lock has held for three years, and no torn write has
# ever been observed. How many backups are torn is computed below.
#
# The write lock is correct. It is taken before the first byte and released
# after the last, every writer takes it, a stress test with sixteen concurrent
# writers produced no interleaving in an hour, and the one incident it was
# written for has not recurred. Zero torn writes is a measured zero.
#
# The lock is advisory and it binds the WRITERS. A reader that does not ask for
# it is not stopped, is not queued, and is not told that a write is in progress
# — and the backup is a plain read of the path.
#
# The backup runs once a night. There are forty-one thousand writes a day.

41000 => writes_per_day
40 => mean_write_duration_ms
1 => backup_reads_per_day
86400000 => milliseconds_in_a_day
0 => torn_writes_observed
16 => writers_in_the_stress_test

writes_per_day * mean_write_duration_ms => milliseconds_a_day_mid_write
int(milliseconds_a_day_mid_write * 10000 / milliseconds_in_a_day) => mid_write_per_myriad
int(365 * mid_write_per_myriad / 10000) => torn_backups_per_year

"writes per day             : " + str(writes_per_day) ^0
"mean write duration, ms    : " + str(mean_write_duration_ms) ^0
"ms a day mid-write         : " + str(milliseconds_a_day_mid_write) ^0
"share of the day mid-write : " + str(mid_write_per_myriad) + " per ten thousand" ^0
"" ^0
"backup reads per day       : " + str(backup_reads_per_day) ^0
"torn backups per year      : " + str(torn_backups_per_year) ^0
"torn writes observed       : " + str(torn_writes_observed) ^0
"" ^0

# ---- what the lock verified ----

"the write lock" ^0
"  taken before the first byte : yes" ^0
"  released after the last     : yes" ^0
"  every writer takes it       : yes" ^0
"  stress test, " + str(writers_in_the_stress_test) + " concurrent writers : no interleaving" ^0
"  torn writes observed        : " + str(torn_writes_observed) ^0
"  verdict                     : EXCLUSIVE" ^0
"" ^0
"  the incident it was written for has not recurred, and" ^0
"  the lock is why" ^0
"" ^0

# ---- who is not in the protocol ----

"the reader" ^0
"  asks for the lock  : no" ^0
"  is queued          : no" ^0
"  is told a write is in progress : no" ^0
"  what it gets mid-write : whatever bytes are on disk" ^0
"" ^0
"  an advisory lock is a convention among participants, and" ^0
"  the backup is not a participant because reading was" ^0
"  never the thing anyone was worried about" ^0
"" ^0

# ---- what a torn backup looks like ----

# It is a valid file. The format is line-oriented, so a truncated last record
# is dropped by the reader, and a half-updated record parses. The restore does
# not fail; it produces a state that never existed.
"restoring from one" ^0
"  the file parses     : yes" ^0
"  the restore fails   : no" ^0
"  the state it produces : a mixture of before and after" ^0
"    one write, which no writer ever wrote" ^0
"  a checksum would catch it : only if computed under the" ^0
"    lock, which is the same fix" ^0
"" ^0

# ---- null control ----

# The same lock, with the backup taking it in shared mode.
0 => nc_torn_backups_per_year
mean_write_duration_ms => nc_backup_wait_ms

"null control - the backup takes the lock in shared mode" ^0
"  torn writes observed  : " + str(torn_writes_observed) + ", unchanged" ^0
"  torn backups per year : " + str(nc_torn_backups_per_year) ^0
"  the backup waits, ms  : at most " + str(nc_backup_wait_ms) ^0
"  the lock did not become stronger; the reader joined the" ^0
"  protocol, at a cost of one write's duration a night" ^0
"" ^0

# ---- the rule ----

"what an exclusive write lock guarantees" ^0
"  two writes never interleave : exactly" ^0
"  a read sees a whole write   : not addressed; the lock" ^0
"    binds whoever asks for it, and a reader that does not" ^0
"    ask is outside the mutual exclusion by construction" ^0
"" ^0
"advisory locking is a protocol between the parties that join" ^0
"it; the question is not whether the lock works but who is in" ^0
"the room, and the backup is usually written by someone else" ^0
"" ^0

"The write lock is exclusive and its zero is measured: taken before the first" ^0
"byte, released after the last, " + str(writers_in_the_stress_test) + " concurrent writers with no interleaving," ^0
str(torn_writes_observed) + " torn writes in three years. It is advisory, and the nightly backup reads" ^0
"without taking it, so with the path mid-write " + str(mid_write_per_myriad) + " per ten thousand of the day" ^0
"about " + str(torn_backups_per_year) + " backups a year restore a state no writer ever wrote." ^0
```

## Python (deterministic transpilation)

```python
writes_per_day = 41000
mean_write_duration_ms = 40
backup_reads_per_day = 1
milliseconds_in_a_day = 86400000
torn_writes_observed = 0
writers_in_the_stress_test = 16
milliseconds_a_day_mid_write = writes_per_day * mean_write_duration_ms
mid_write_per_myriad = int(milliseconds_a_day_mid_write * 10000 / milliseconds_in_a_day)
torn_backups_per_year = int(365 * mid_write_per_myriad / 10000)
print("writes per day             : " + str(writes_per_day))
print("mean write duration, ms    : " + str(mean_write_duration_ms))
print("ms a day mid-write         : " + str(milliseconds_a_day_mid_write))
print("share of the day mid-write : " + str(mid_write_per_myriad) + " per ten thousand")
print("")
print("backup reads per day       : " + str(backup_reads_per_day))
print("torn backups per year      : " + str(torn_backups_per_year))
print("torn writes observed       : " + str(torn_writes_observed))
print("")
print("the write lock")
print("  taken before the first byte : yes")
print("  released after the last     : yes")
print("  every writer takes it       : yes")
print("  stress test, " + str(writers_in_the_stress_test) + " concurrent writers : no interleaving")
print("  torn writes observed        : " + str(torn_writes_observed))
print("  verdict                     : EXCLUSIVE")
print("")
print("  the incident it was written for has not recurred, and")
print("  the lock is why")
print("")
print("the reader")
print("  asks for the lock  : no")
print("  is queued          : no")
print("  is told a write is in progress : no")
print("  what it gets mid-write : whatever bytes are on disk")
print("")
print("  an advisory lock is a convention among participants, and")
print("  the backup is not a participant because reading was")
print("  never the thing anyone was worried about")
print("")
print("restoring from one")
print("  the file parses     : yes")
print("  the restore fails   : no")
print("  the state it produces : a mixture of before and after")
print("    one write, which no writer ever wrote")
print("  a checksum would catch it : only if computed under the")
print("    lock, which is the same fix")
print("")
nc_torn_backups_per_year = 0
nc_backup_wait_ms = mean_write_duration_ms
print("null control - the backup takes the lock in shared mode")
print("  torn writes observed  : " + str(torn_writes_observed) + ", unchanged")
print("  torn backups per year : " + str(nc_torn_backups_per_year))
print("  the backup waits, ms  : at most " + str(nc_backup_wait_ms))
print("  the lock did not become stronger; the reader joined the")
print("  protocol, at a cost of one write's duration a night")
print("")
print("what an exclusive write lock guarantees")
print("  two writes never interleave : exactly")
print("  a read sees a whole write   : not addressed; the lock")
print("    binds whoever asks for it, and a reader that does not")
print("    ask is outside the mutual exclusion by construction")
print("")
print("advisory locking is a protocol between the parties that join")
print("it; the question is not whether the lock works but who is in")
print("the room, and the backup is usually written by someone else")
print("")
print("The write lock is exclusive and its zero is measured: taken before the first")
print("byte, released after the last, " + str(writers_in_the_stress_test) + " concurrent writers with no interleaving,")
print(str(torn_writes_observed) + " torn writes in three years. It is advisory, and the nightly backup reads")
print("without taking it, so with the path mid-write " + str(mid_write_per_myriad) + " per ten thousand of the day")
print("about " + str(torn_backups_per_year) + " backups a year restore a state no writer ever wrote.")
```

## stdout (executed)

```text
writes per day             : 41000
mean write duration, ms    : 40
ms a day mid-write         : 1640000
share of the day mid-write : 189 per ten thousand

backup reads per day       : 1
torn backups per year      : 6
torn writes observed       : 0

the write lock
  taken before the first byte : yes
  released after the last     : yes
  every writer takes it       : yes
  stress test, 16 concurrent writers : no interleaving
  torn writes observed        : 0
  verdict                     : EXCLUSIVE

  the incident it was written for has not recurred, and
  the lock is why

the reader
  asks for the lock  : no
  is queued          : no
  is told a write is in progress : no
  what it gets mid-write : whatever bytes are on disk

  an advisory lock is a convention among participants, and
  the backup is not a participant because reading was
  never the thing anyone was worried about

restoring from one
  the file parses     : yes
  the restore fails   : no
  the state it produces : a mixture of before and after
    one write, which no writer ever wrote
  a checksum would catch it : only if computed under the
    lock, which is the same fix

null control - the backup takes the lock in shared mode
  torn writes observed  : 0, unchanged
  torn backups per year : 0
  the backup waits, ms  : at most 40
  the lock did not become stronger; the reader joined the
  protocol, at a cost of one write's duration a night

what an exclusive write lock guarantees
  two writes never interleave : exactly
  a read sees a whole write   : not addressed; the lock
    binds whoever asks for it, and a reader that does not
    ask is outside the mutual exclusion by construction

advisory locking is a protocol between the parties that join
it; the question is not whether the lock works but who is in
the room, and the backup is usually written by someone else

The write lock is exclusive and its zero is measured: taken before the first
byte, released after the last, 16 concurrent writers with no interleaving,
0 torn writes in three years. It is advisory, and the nightly backup reads
without taking it, so with the path mid-write 189 per ten thousand of the day
about 6 backups a year restore a state no writer ever wrote.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
