<!-- canonical: efficientnewlanguage.org/ai/examples/660-the-compression-was-lossless-and-the-schema-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 660 — The compression was lossless and the schema was not

`the_compression_was_lossless_and_the_schema_was_not.eml` - Every archived byte comes back identical and ninety restores prove it. What cannot be recovered is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every archived
# byte comes back identical and ninety restores prove it. What cannot be
# recovered is computed below.
#
# The compression is lossless in the exact sense. The decompressor returns the
# input bit for bit, a checksum over the original is stored beside the archive
# and compared on every restore, and ninety restores across three years have
# produced zero mismatches. There is no approximation anywhere in the codec.
#
# Lossless is a property of the CODEC, over the bytes it was given. Producing
# those bytes was a separate step, and that step used an encoding where an
# omitted field and a field set to its default are the same on the wire.
#
# So the archive restores exactly what was serialised, and what was serialised
# already could not tell "nobody said" from "somebody said zero".

71000000 => records_archived
90 => restores_performed
0 => byte_mismatches
22400000 => records_where_the_field_was_omitted
5900000 => records_where_the_field_was_explicitly_default

records_where_the_field_was_omitted + records_where_the_field_was_explicitly_default => records_that_read_as_zero
records_archived - records_that_read_as_zero => records_with_a_nonzero_value

"records archived              : " + str(records_archived) ^0
"restores performed            : " + str(restores_performed) ^0
"byte mismatches               : " + str(byte_mismatches) ^0
"" ^0
"field omitted                 : " + str(records_where_the_field_was_omitted) ^0
"field explicitly the default  : " + str(records_where_the_field_was_explicitly_default) ^0
"records that read as zero     : " + str(records_that_read_as_zero) ^0
"records with a nonzero value  : " + str(records_with_a_nonzero_value) ^0
"" ^0

# ---- what lossless verified ----

"the codec" ^0
"  decompressed output equals input : bit for bit" ^0
"  checksum stored beside the archive : yes" ^0
"  restores performed  : " + str(restores_performed) ^0
"  byte mismatches     : " + str(byte_mismatches) ^0
"  approximation anywhere in the codec : none" ^0
"  verdict             : LOSSLESS" ^0
"" ^0
"  the guarantee is exact and the evidence for it is three" ^0
"  years of restores" ^0
"" ^0

# ---- what it was given ----

"serialising one record" ^0
"  field absent from the object : written as nothing" ^0
"  field present and equal to the default : also written" ^0
"    as nothing, because the encoding omits defaults" ^0
"  bytes produced by the two cases : identical" ^0
"  the codec receives            : one of them" ^0
"" ^0
"  the loss happened before the compressor was called, in a" ^0
"  step nobody describes as lossy because it is a schema" ^0
"" ^0

int(records_that_read_as_zero * 10000 / records_archived) => ambiguous_per_myriad
"share of records that read as zero : " + str(ambiguous_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what a reader can and cannot answer ----

"questions about the restored data" ^0
"  what did record 4,180,002 hold : answerable, exactly" ^0
"  is the archive intact          : answerable, " + str(byte_mismatches) + " mismatches" ^0
"  how many customers declined    : not answerable" ^0
"  how many were never asked      : not answerable" ^0
"  their sum                      : " + str(records_that_read_as_zero) + ", answerable" ^0
"" ^0
"  the pair is gone and the total is intact, which is the" ^0
"  signature of a lossy encoding rather than a lossy codec" ^0
"" ^0

# ---- null control ----

# The same codec and the same archive, with the schema making the field
# explicitly nullable so absence has its own representation.
0 => nc_records_that_read_as_zero_ambiguously
records_where_the_field_was_omitted => nc_records_recorded_as_absent
records_where_the_field_was_explicitly_default => nc_records_recorded_as_zero

"null control - absence given its own representation" ^0
"  byte mismatches       : " + str(byte_mismatches) + ", unchanged" ^0
"  recorded as absent    : " + str(nc_records_recorded_as_absent) ^0
"  recorded as zero      : " + str(nc_records_recorded_as_zero) ^0
"  ambiguous records     : " + str(nc_records_that_read_as_zero_ambiguously) ^0
"  the compression did not improve; the bytes handed to it" ^0
"  started carrying the distinction" ^0
"" ^0

# ---- the rule ----

"what lossless compression guarantees" ^0
"  the bytes are recovered exactly : exactly" ^0
"  the meaning is recovered        : not addressed; the" ^0
"    codec's input is already the output of an encoding," ^0
"    and no property of the codec reaches upstream of it" ^0
"" ^0
"'lossless' names the last hop; when a pipeline has a lossy" ^0
"step and a lossless one, the honest claim is about the" ^0
"composition, and only the second hop has a word for it" ^0
"" ^0

"The codec is lossless in the exact sense: bit-for-bit output, a checksum on" ^0
"every restore, " + str(restores_performed) + " restores and " + str(byte_mismatches) + " mismatches in three years. The encoding" ^0
"omits defaults, so " + str(records_where_the_field_was_omitted) + " records that never stated the field and " + str(records_where_the_field_was_explicitly_default) ^0
"that stated it as zero produce identical bytes - " + str(records_that_read_as_zero) + " records, " + str(ambiguous_per_myriad) + " per" ^0
"ten thousand - and the archive restores that ambiguity perfectly." ^0
```

## Python (deterministic transpilation)

```python
records_archived = 71000000
restores_performed = 90
byte_mismatches = 0
records_where_the_field_was_omitted = 22400000
records_where_the_field_was_explicitly_default = 5900000
records_that_read_as_zero = records_where_the_field_was_omitted + records_where_the_field_was_explicitly_default
records_with_a_nonzero_value = records_archived - records_that_read_as_zero
print("records archived              : " + str(records_archived))
print("restores performed            : " + str(restores_performed))
print("byte mismatches               : " + str(byte_mismatches))
print("")
print("field omitted                 : " + str(records_where_the_field_was_omitted))
print("field explicitly the default  : " + str(records_where_the_field_was_explicitly_default))
print("records that read as zero     : " + str(records_that_read_as_zero))
print("records with a nonzero value  : " + str(records_with_a_nonzero_value))
print("")
print("the codec")
print("  decompressed output equals input : bit for bit")
print("  checksum stored beside the archive : yes")
print("  restores performed  : " + str(restores_performed))
print("  byte mismatches     : " + str(byte_mismatches))
print("  approximation anywhere in the codec : none")
print("  verdict             : LOSSLESS")
print("")
print("  the guarantee is exact and the evidence for it is three")
print("  years of restores")
print("")
print("serialising one record")
print("  field absent from the object : written as nothing")
print("  field present and equal to the default : also written")
print("    as nothing, because the encoding omits defaults")
print("  bytes produced by the two cases : identical")
print("  the codec receives            : one of them")
print("")
print("  the loss happened before the compressor was called, in a")
print("  step nobody describes as lossy because it is a schema")
print("")
ambiguous_per_myriad = int(records_that_read_as_zero * 10000 / records_archived)
print("share of records that read as zero : " + str(ambiguous_per_myriad) + " per ten thousand")
print("")
print("questions about the restored data")
print("  what did record 4,180,002 hold : answerable, exactly")
print("  is the archive intact          : answerable, " + str(byte_mismatches) + " mismatches")
print("  how many customers declined    : not answerable")
print("  how many were never asked      : not answerable")
print("  their sum                      : " + str(records_that_read_as_zero) + ", answerable")
print("")
print("  the pair is gone and the total is intact, which is the")
print("  signature of a lossy encoding rather than a lossy codec")
print("")
nc_records_that_read_as_zero_ambiguously = 0
nc_records_recorded_as_absent = records_where_the_field_was_omitted
nc_records_recorded_as_zero = records_where_the_field_was_explicitly_default
print("null control - absence given its own representation")
print("  byte mismatches       : " + str(byte_mismatches) + ", unchanged")
print("  recorded as absent    : " + str(nc_records_recorded_as_absent))
print("  recorded as zero      : " + str(nc_records_recorded_as_zero))
print("  ambiguous records     : " + str(nc_records_that_read_as_zero_ambiguously))
print("  the compression did not improve; the bytes handed to it")
print("  started carrying the distinction")
print("")
print("what lossless compression guarantees")
print("  the bytes are recovered exactly : exactly")
print("  the meaning is recovered        : not addressed; the")
print("    codec's input is already the output of an encoding,")
print("    and no property of the codec reaches upstream of it")
print("")
print("'lossless' names the last hop; when a pipeline has a lossy")
print("step and a lossless one, the honest claim is about the")
print("composition, and only the second hop has a word for it")
print("")
print("The codec is lossless in the exact sense: bit-for-bit output, a checksum on")
print("every restore, " + str(restores_performed) + " restores and " + str(byte_mismatches) + " mismatches in three years. The encoding")
print("omits defaults, so " + str(records_where_the_field_was_omitted) + " records that never stated the field and " + str(records_where_the_field_was_explicitly_default))
print("that stated it as zero produce identical bytes - " + str(records_that_read_as_zero) + " records, " + str(ambiguous_per_myriad) + " per")
print("ten thousand - and the archive restores that ambiguity perfectly.")
```

## stdout (executed)

```text
records archived              : 71000000
restores performed            : 90
byte mismatches               : 0

field omitted                 : 22400000
field explicitly the default  : 5900000
records that read as zero     : 28300000
records with a nonzero value  : 42700000

the codec
  decompressed output equals input : bit for bit
  checksum stored beside the archive : yes
  restores performed  : 90
  byte mismatches     : 0
  approximation anywhere in the codec : none
  verdict             : LOSSLESS

  the guarantee is exact and the evidence for it is three
  years of restores

serialising one record
  field absent from the object : written as nothing
  field present and equal to the default : also written
    as nothing, because the encoding omits defaults
  bytes produced by the two cases : identical
  the codec receives            : one of them

  the loss happened before the compressor was called, in a
  step nobody describes as lossy because it is a schema

share of records that read as zero : 3985 per ten thousand

questions about the restored data
  what did record 4,180,002 hold : answerable, exactly
  is the archive intact          : answerable, 0 mismatches
  how many customers declined    : not answerable
  how many were never asked      : not answerable
  their sum                      : 28300000, answerable

  the pair is gone and the total is intact, which is the
  signature of a lossy encoding rather than a lossy codec

null control - absence given its own representation
  byte mismatches       : 0, unchanged
  recorded as absent    : 22400000
  recorded as zero      : 5900000
  ambiguous records     : 0
  the compression did not improve; the bytes handed to it
  started carrying the distinction

what lossless compression guarantees
  the bytes are recovered exactly : exactly
  the meaning is recovered        : not addressed; the
    codec's input is already the output of an encoding,
    and no property of the codec reaches upstream of it

'lossless' names the last hop; when a pipeline has a lossy
step and a lossless one, the honest claim is about the
composition, and only the second hop has a word for it

The codec is lossless in the exact sense: bit-for-bit output, a checksum on
every restore, 90 restores and 0 mismatches in three years. The encoding
omits defaults, so 22400000 records that never stated the field and 5900000
that stated it as zero produce identical bytes - 28300000 records, 3985 per
ten thousand - and the archive restores that ambiguity perfectly.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
