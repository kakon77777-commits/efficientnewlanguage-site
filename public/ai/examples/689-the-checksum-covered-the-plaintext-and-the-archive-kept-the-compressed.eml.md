<!-- canonical: efficientnewlanguage.org/ai/examples/689-the-checksum-covered-the-plaintext-and-the-archive-kept-the-compressed | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 689 — The checksum covered the plaintext and the archive kept the compressed

`the_checksum_covered_the_plaintext_and_the_archive_kept_the_compressed.eml` - The digest is computed over the plaintext before compression and verified after decompression, end to end. What the storage migration verified is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The digest is
# computed over the plaintext before compression and verified after
# decompression, end to end. What the storage migration verified is computed
# below.
#
# The end-to-end check is the right one. Computing the digest over the
# compressed bytes would verify the transport and say nothing about the content;
# computing it over the plaintext and checking it after decompression covers the
# compressor, the transport and the decompressor in one comparison. It has
# caught a truncated transfer and a bad decompressor build.
#
# What the archive holds is the compressed bytes and that digest. Verifying it
# means decompressing, which for four point two terabytes is eighteen hundred
# CPU hours, so the migration that re-encoded everything to a newer format
# verified what it could afford: sizes and record counts.
#
# Twelve archives came out of the migration short.

41000 => archives
4200000000000 => bytes_stored
71000000 => records
1840 => cpu_hours_for_a_full_verification
12 => archives_that_lost_records
310000 => records_lost
0 => size_or_count_mismatches_reported

int(records_lost * 10000 / records) => lost_per_myriad
archives - archives_that_lost_records => archives_intact

"archives                     : " + str(archives) ^0
"bytes stored                 : " + str(bytes_stored) ^0
"records                      : " + str(records) ^0
"" ^0
"archives that lost records   : " + str(archives_that_lost_records) ^0
"archives intact              : " + str(archives_intact) ^0
"records lost                 : " + str(records_lost) ^0
"share lost                   : " + str(lost_per_myriad) + " per ten thousand" ^0
"size or count mismatches reported : " + str(size_or_count_mismatches_reported) ^0
"" ^0

# ---- what the end-to-end digest verifies ----

"the transfer check" ^0
"  digest computed over : the plaintext, before compression" ^0
"  verified             : after decompression, by the receiver" ^0
"  what that covers     : compressor, transport, decompressor" ^0
"  what it has caught   : a truncated transfer, a bad" ^0
"    decompressor build" ^0
"  verdict              : END TO END" ^0
"" ^0
"  choosing the plaintext over the compressed bytes is the" ^0
"  stronger of the two and somebody argued for it" ^0
"" ^0

# ---- what verifying the archive costs ----

"checking one archive at rest" ^0
"  requires        : decompressing it" ^0
"  for the estate  : " + str(cpu_hours_for_a_full_verification) + " CPU hours" ^0
"  what the migration checked instead : compressed size and" ^0
"    record count, per archive" ^0
"  mismatches those found : " + str(size_or_count_mismatches_reported) ^0
"" ^0
"  a count is a real check and it catches a whole class;" ^0
"  it is not the class the digest was chosen to catch" ^0
"" ^0

# ---- why a count did not see it ----

# The migration re-encoded record by record and wrote a count as it went. The
# records it dropped were dropped before the counter, so the count it wrote is
# a true count of what it wrote.
"the count" ^0
"  written by      : the migration, as it wrote" ^0
"  counts          : the records it emitted" ^0
"  records dropped before the counter : " + str(records_lost) ^0
"  so the count is : a true count of the output" ^0
"  what would have differed : a count taken from the input" ^0
"" ^0

int(archives_that_lost_records * 10000 / archives) => affected_archives_per_myriad
"share of archives affected : " + str(affected_archives_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same migration, verifying a sample of archives by decompressing and
# re-checking the stored digest rather than every one.
100 => nc_archives_sampled
int(nc_archives_sampled * cpu_hours_for_a_full_verification / archives) => nc_cpu_hours
archives_that_lost_records => nc_archives_the_sample_would_reach

"null control - a sample decompressed and digest-checked" ^0
"  archives sampled   : " + str(nc_archives_sampled) ^0
"  CPU hours          : " + str(nc_cpu_hours) ^0
"  the class of defect it can see : the one the digest was" ^0
"    chosen for, on " + str(nc_archives_the_sample_would_reach) + " affected archives it would have to" ^0
"    be lucky to hit - so the sample is a detector, not a" ^0
"    proof, and it is stated as one" ^0
"" ^0

# ---- the rule ----

"what an end-to-end digest guarantees" ^0
"  what arrived is what was sent : exactly, on every transfer" ^0
"  what is stored is what was sent : addressed only when" ^0
"    somebody pays to check it, and the price is the" ^0
"    decompression the digest's own choice of operand" ^0
"    implies" ^0
"" ^0
"choosing the stronger operand makes the check better and" ^0
"makes it cost more to run; the cheap substitute a later job" ^0
"reaches for is a different check, and it is the one that" ^0
"actually runs" ^0
"" ^0

"The digest covers the plaintext and is verified after decompression, which is" ^0
"the stronger of the two choices and has caught a truncated transfer and a bad" ^0
"decompressor. Re-checking it at rest costs " + str(cpu_hours_for_a_full_verification) + " CPU hours, so the migration" ^0
"compared sizes and counts and reported " + str(size_or_count_mismatches_reported) + " mismatches, while " + str(archives_that_lost_records) + " archives" ^0
"lost " + str(records_lost) + " records - " + str(lost_per_myriad) + " per ten thousand - counted correctly on the way out." ^0
```

## Python (deterministic transpilation)

```python
archives = 41000
bytes_stored = 4200000000000
records = 71000000
cpu_hours_for_a_full_verification = 1840
archives_that_lost_records = 12
records_lost = 310000
size_or_count_mismatches_reported = 0
lost_per_myriad = int(records_lost * 10000 / records)
archives_intact = archives - archives_that_lost_records
print("archives                     : " + str(archives))
print("bytes stored                 : " + str(bytes_stored))
print("records                      : " + str(records))
print("")
print("archives that lost records   : " + str(archives_that_lost_records))
print("archives intact              : " + str(archives_intact))
print("records lost                 : " + str(records_lost))
print("share lost                   : " + str(lost_per_myriad) + " per ten thousand")
print("size or count mismatches reported : " + str(size_or_count_mismatches_reported))
print("")
print("the transfer check")
print("  digest computed over : the plaintext, before compression")
print("  verified             : after decompression, by the receiver")
print("  what that covers     : compressor, transport, decompressor")
print("  what it has caught   : a truncated transfer, a bad")
print("    decompressor build")
print("  verdict              : END TO END")
print("")
print("  choosing the plaintext over the compressed bytes is the")
print("  stronger of the two and somebody argued for it")
print("")
print("checking one archive at rest")
print("  requires        : decompressing it")
print("  for the estate  : " + str(cpu_hours_for_a_full_verification) + " CPU hours")
print("  what the migration checked instead : compressed size and")
print("    record count, per archive")
print("  mismatches those found : " + str(size_or_count_mismatches_reported))
print("")
print("  a count is a real check and it catches a whole class;")
print("  it is not the class the digest was chosen to catch")
print("")
print("the count")
print("  written by      : the migration, as it wrote")
print("  counts          : the records it emitted")
print("  records dropped before the counter : " + str(records_lost))
print("  so the count is : a true count of the output")
print("  what would have differed : a count taken from the input")
print("")
affected_archives_per_myriad = int(archives_that_lost_records * 10000 / archives)
print("share of archives affected : " + str(affected_archives_per_myriad) + " per ten thousand")
print("")
nc_archives_sampled = 100
nc_cpu_hours = int(nc_archives_sampled * cpu_hours_for_a_full_verification / archives)
nc_archives_the_sample_would_reach = archives_that_lost_records
print("null control - a sample decompressed and digest-checked")
print("  archives sampled   : " + str(nc_archives_sampled))
print("  CPU hours          : " + str(nc_cpu_hours))
print("  the class of defect it can see : the one the digest was")
print("    chosen for, on " + str(nc_archives_the_sample_would_reach) + " affected archives it would have to")
print("    be lucky to hit - so the sample is a detector, not a")
print("    proof, and it is stated as one")
print("")
print("what an end-to-end digest guarantees")
print("  what arrived is what was sent : exactly, on every transfer")
print("  what is stored is what was sent : addressed only when")
print("    somebody pays to check it, and the price is the")
print("    decompression the digest's own choice of operand")
print("    implies")
print("")
print("choosing the stronger operand makes the check better and")
print("makes it cost more to run; the cheap substitute a later job")
print("reaches for is a different check, and it is the one that")
print("actually runs")
print("")
print("The digest covers the plaintext and is verified after decompression, which is")
print("the stronger of the two choices and has caught a truncated transfer and a bad")
print("decompressor. Re-checking it at rest costs " + str(cpu_hours_for_a_full_verification) + " CPU hours, so the migration")
print("compared sizes and counts and reported " + str(size_or_count_mismatches_reported) + " mismatches, while " + str(archives_that_lost_records) + " archives")
print("lost " + str(records_lost) + " records - " + str(lost_per_myriad) + " per ten thousand - counted correctly on the way out.")
```

## stdout (executed)

```text
archives                     : 41000
bytes stored                 : 4200000000000
records                      : 71000000

archives that lost records   : 12
archives intact              : 40988
records lost                 : 310000
share lost                   : 43 per ten thousand
size or count mismatches reported : 0

the transfer check
  digest computed over : the plaintext, before compression
  verified             : after decompression, by the receiver
  what that covers     : compressor, transport, decompressor
  what it has caught   : a truncated transfer, a bad
    decompressor build
  verdict              : END TO END

  choosing the plaintext over the compressed bytes is the
  stronger of the two and somebody argued for it

checking one archive at rest
  requires        : decompressing it
  for the estate  : 1840 CPU hours
  what the migration checked instead : compressed size and
    record count, per archive
  mismatches those found : 0

  a count is a real check and it catches a whole class;
  it is not the class the digest was chosen to catch

the count
  written by      : the migration, as it wrote
  counts          : the records it emitted
  records dropped before the counter : 310000
  so the count is : a true count of the output
  what would have differed : a count taken from the input

share of archives affected : 2 per ten thousand

null control - a sample decompressed and digest-checked
  archives sampled   : 100
  CPU hours          : 4
  the class of defect it can see : the one the digest was
    chosen for, on 12 affected archives it would have to
    be lucky to hit - so the sample is a detector, not a
    proof, and it is stated as one

what an end-to-end digest guarantees
  what arrived is what was sent : exactly, on every transfer
  what is stored is what was sent : addressed only when
    somebody pays to check it, and the price is the
    decompression the digest's own choice of operand
    implies

choosing the stronger operand makes the check better and
makes it cost more to run; the cheap substitute a later job
reaches for is a different check, and it is the one that
actually runs

The digest covers the plaintext and is verified after decompression, which is
the stronger of the two choices and has caught a truncated transfer and a bad
decompressor. Re-checking it at rest costs 1840 CPU hours, so the migration
compared sizes and counts and reported 0 mismatches, while 12 archives
lost 310000 records - 43 per ten thousand - counted correctly on the way out.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
