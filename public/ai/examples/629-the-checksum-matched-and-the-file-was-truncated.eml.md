<!-- canonical: efficientnewlanguage.org/ai/examples/629-the-checksum-matched-and-the-file-was-truncated | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 629 — The checksum matched and the file was truncated

`the_checksum_matched_and_the_file_was_truncated.eml` - The stored object passes its integrity check on every pass, and has done for months. How much of the file is there is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The stored object
# passes its integrity check on every pass, and has done for months. How much of
# the file is there is computed below.
#
# The upload is checksummed end to end. The client streams the object, the store
# computes a digest over the bytes it receives, and every later verification
# recomputes that digest and compares. It has never disagreed. This is not a
# weak check: it catches a single flipped bit anywhere in six gigabytes, and it
# caught two of them last quarter on failing disks.
#
# A checksum answers "are these the bytes I already had". It is computed over
# what ARRIVED, and it is stored beside what arrived. Nothing in that loop knows
# what was sent.
#
# The connection dropped at seventy-two percent. The store had a complete,
# self-consistent object at that moment, and it wrote the digest of it.

36 => record_bytes
240000000 => records_at_source
172600000 => records_stored
412 => verification_passes_since_upload
2 => bit_flips_caught_last_quarter

records_at_source * record_bytes => bytes_at_source
records_stored * record_bytes => bytes_stored
# Named from the records, not as `bytes_at_source - bytes_stored`. Writing the
# subtraction makes the missing bytes true by construction, which is the one
# thing this case is trying not to assume.
records_at_source - records_stored => records_missing
records_missing * record_bytes => bytes_missing

"records at the source     : " + str(records_at_source) ^0
"records in the object     : " + str(records_stored) ^0
"records not there         : " + str(records_missing) ^0
"" ^0
"bytes at the source       : " + str(bytes_at_source) ^0
"bytes in the object       : " + str(bytes_stored) ^0
"bytes not there           : " + str(bytes_missing) ^0
"" ^0

# ---- what the integrity check verified ----

"the integrity check, run nightly" ^0
"  stored digest    : matches the recomputed digest" ^0
"  passes so far    : " + str(verification_passes_since_upload) ^0
"  failures         : 0" ^0
"  bit flips caught last quarter : " + str(bit_flips_caught_last_quarter) ^0
"  verdict          : INTACT" ^0
"" ^0
"  the check is real; it found two corrupted blocks on" ^0
"  failing disks and it would find a third" ^0
"" ^0

# ---- what it compared ----

"the two values the check reads" ^0
"  digest recomputed over : the stored bytes" ^0
"  digest on record       : computed over the same stored bytes" ^0
"  bytes the client sent  : not recorded anywhere" ^0
"  length the client meant: never declared" ^0
"" ^0
"  both operands come from the same side of the transfer," ^0
"  so agreement is a fact about storage, not about arrival" ^0
"" ^0

int(records_missing * 10000 / records_at_source) => missing_per_myriad
"share of the file absent : " + str(missing_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what reads it ----

# The reader stops at end of object. There is no sentinel record, so a short
# file and a complete file are the same shape to it.
"the nightly aggregate over this object" ^0
"  rows read      : " + str(records_stored) ^0
"  rows expected  : the reader has no expectation" ^0
"  errors raised  : 0" ^0
"  the total it reports is a true total of what it read" ^0
"" ^0

# ---- null control ----

# The same dropped connection, with the client declaring the length up front
# and the store refusing a short object.
0 => nc_records_stored
records_at_source => nc_records_after_retry

"null control - the same drop, with a declared length" ^0
"  object committed on the short write : no" ^0
"  records stored at that moment       : " + str(nc_records_stored) ^0
"  records after the retry             : " + str(nc_records_after_retry) ^0
"  the digest did not get better; a second value" ^0
"  arrived for it to disagree with" ^0
"" ^0

# ---- the rule ----

"what a matching checksum guarantees" ^0
"  these bytes are unchanged since they were stored : exactly" ^0
"  these bytes are all the bytes there were         : not" ^0
"    addressed, and cannot be, because the quantity that" ^0
"    would settle it was never transmitted" ^0
"" ^0
"integrity and completeness are different questions; a digest" ^0
"answers the first, and only a length or a terminator the" ^0
"sender chose can answer the second" ^0
"" ^0

"The object is intact and the nightly check is right to say so: " + str(verification_passes_since_upload) + " passes," ^0
"0 failures, and " + str(bit_flips_caught_last_quarter) + " real corruptions caught last quarter. It holds " + str(records_stored) ^0
"of " + str(records_at_source) + " records - " + str(missing_per_myriad) + " per ten thousand of the file is absent -" ^0
"and every aggregate built on it reports a true total of what is there, because" ^0
"the digest was computed after the connection dropped and agrees with itself." ^0
```

## Python (deterministic transpilation)

```python
record_bytes = 36
records_at_source = 240000000
records_stored = 172600000
verification_passes_since_upload = 412
bit_flips_caught_last_quarter = 2
bytes_at_source = records_at_source * record_bytes
bytes_stored = records_stored * record_bytes
records_missing = records_at_source - records_stored
bytes_missing = records_missing * record_bytes
print("records at the source     : " + str(records_at_source))
print("records in the object     : " + str(records_stored))
print("records not there         : " + str(records_missing))
print("")
print("bytes at the source       : " + str(bytes_at_source))
print("bytes in the object       : " + str(bytes_stored))
print("bytes not there           : " + str(bytes_missing))
print("")
print("the integrity check, run nightly")
print("  stored digest    : matches the recomputed digest")
print("  passes so far    : " + str(verification_passes_since_upload))
print("  failures         : 0")
print("  bit flips caught last quarter : " + str(bit_flips_caught_last_quarter))
print("  verdict          : INTACT")
print("")
print("  the check is real; it found two corrupted blocks on")
print("  failing disks and it would find a third")
print("")
print("the two values the check reads")
print("  digest recomputed over : the stored bytes")
print("  digest on record       : computed over the same stored bytes")
print("  bytes the client sent  : not recorded anywhere")
print("  length the client meant: never declared")
print("")
print("  both operands come from the same side of the transfer,")
print("  so agreement is a fact about storage, not about arrival")
print("")
missing_per_myriad = int(records_missing * 10000 / records_at_source)
print("share of the file absent : " + str(missing_per_myriad) + " per ten thousand")
print("")
print("the nightly aggregate over this object")
print("  rows read      : " + str(records_stored))
print("  rows expected  : the reader has no expectation")
print("  errors raised  : 0")
print("  the total it reports is a true total of what it read")
print("")
nc_records_stored = 0
nc_records_after_retry = records_at_source
print("null control - the same drop, with a declared length")
print("  object committed on the short write : no")
print("  records stored at that moment       : " + str(nc_records_stored))
print("  records after the retry             : " + str(nc_records_after_retry))
print("  the digest did not get better; a second value")
print("  arrived for it to disagree with")
print("")
print("what a matching checksum guarantees")
print("  these bytes are unchanged since they were stored : exactly")
print("  these bytes are all the bytes there were         : not")
print("    addressed, and cannot be, because the quantity that")
print("    would settle it was never transmitted")
print("")
print("integrity and completeness are different questions; a digest")
print("answers the first, and only a length or a terminator the")
print("sender chose can answer the second")
print("")
print("The object is intact and the nightly check is right to say so: " + str(verification_passes_since_upload) + " passes,")
print("0 failures, and " + str(bit_flips_caught_last_quarter) + " real corruptions caught last quarter. It holds " + str(records_stored))
print("of " + str(records_at_source) + " records - " + str(missing_per_myriad) + " per ten thousand of the file is absent -")
print("and every aggregate built on it reports a true total of what is there, because")
print("the digest was computed after the connection dropped and agrees with itself.")
```

## stdout (executed)

```text
records at the source     : 240000000
records in the object     : 172600000
records not there         : 67400000

bytes at the source       : 8640000000
bytes in the object       : 6213600000
bytes not there           : 2426400000

the integrity check, run nightly
  stored digest    : matches the recomputed digest
  passes so far    : 412
  failures         : 0
  bit flips caught last quarter : 2
  verdict          : INTACT

  the check is real; it found two corrupted blocks on
  failing disks and it would find a third

the two values the check reads
  digest recomputed over : the stored bytes
  digest on record       : computed over the same stored bytes
  bytes the client sent  : not recorded anywhere
  length the client meant: never declared

  both operands come from the same side of the transfer,
  so agreement is a fact about storage, not about arrival

share of the file absent : 2808 per ten thousand

the nightly aggregate over this object
  rows read      : 172600000
  rows expected  : the reader has no expectation
  errors raised  : 0
  the total it reports is a true total of what it read

null control - the same drop, with a declared length
  object committed on the short write : no
  records stored at that moment       : 0
  records after the retry             : 240000000
  the digest did not get better; a second value
  arrived for it to disagree with

what a matching checksum guarantees
  these bytes are unchanged since they were stored : exactly
  these bytes are all the bytes there were         : not
    addressed, and cannot be, because the quantity that
    would settle it was never transmitted

integrity and completeness are different questions; a digest
answers the first, and only a length or a terminator the
sender chose can answer the second

The object is intact and the nightly check is right to say so: 412 passes,
0 failures, and 2 real corruptions caught last quarter. It holds 172600000
of 240000000 records - 2808 per ten thousand of the file is absent -
and every aggregate built on it reports a true total of what is there, because
the digest was computed after the connection dropped and agrees with itself.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
