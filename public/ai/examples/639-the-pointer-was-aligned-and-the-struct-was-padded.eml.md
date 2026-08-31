<!-- canonical: efficientnewlanguage.org/ai/examples/639-the-pointer-was-aligned-and-the-struct-was-padded | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 639 — The pointer was aligned and the struct was padded

`the_pointer_was_aligned_and_the_struct_was_padded.eml` - Every field in the record is correctly aligned and the compiler guarantees it. What the record costs is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every field in the
# record is correctly aligned and the compiler guarantees it. What the record
# costs is computed below.
#
# Alignment is a correctness property and it holds here exactly. Each field
# begins at an offset divisible by its own size, no load straddles a cache line
# in a way the hardware would trap on, and the compiler inserted whatever gaps
# were needed to make that true without being asked.
#
# The gaps are the cost. Alignment says WHERE each field starts; it says nothing
# about how much of the record is field and how much is the compiler making the
# next offset divide. Reordering the same fields changes nothing about
# correctness and changes the size.
#
# The record is declared in the order a person would read it. Held that way it
# is forty bytes; sorted widest-first it is twenty-four.

# field sizes in declaration order: flag, id, kind, timestamp, count
1 => size_flag
8 => size_id
1 => size_kind
8 => size_timestamp
4 => size_count
8 => widest_field
42000000 => records_resident

size_flag + size_id + size_kind + size_timestamp + size_count => bytes_of_actual_field

# Declaration order: a 1-byte flag, then an 8-byte id needs offset 8, so 7 pad.
# kind at 17, timestamp needs offset 24, so 7 pad. count at 28, then the record
# is padded to a multiple of the widest field.
7 => pad_after_flag
7 => pad_after_kind
bytes_of_actual_field + pad_after_flag + pad_after_kind => size_before_tail_pad
# Tail padding rounds up to a multiple of the alignment, so an array of these
# keeps every element aligned.
int(size_before_tail_pad / widest_field) => whole_units
size_before_tail_pad - whole_units * widest_field => remainder
if remainder > 0:
    widest_field - remainder => tail_pad
else:
    0 => tail_pad
size_before_tail_pad + tail_pad => size_as_declared

# Widest first: id, timestamp, count, flag, kind — nothing needs an interior gap.
size_id + size_timestamp + size_count + size_flag + size_kind => reordered_before_tail
int(reordered_before_tail / widest_field) => r_units
reordered_before_tail - r_units * widest_field => r_remainder
if r_remainder > 0:
    widest_field - r_remainder => reordered_tail_pad
else:
    0 => reordered_tail_pad
reordered_before_tail + reordered_tail_pad => size_reordered

"bytes that are field       : " + str(bytes_of_actual_field) ^0
"size as declared           : " + str(size_as_declared) ^0
"size reordered widest first: " + str(size_reordered) ^0
"" ^0

# ---- what alignment guarantees ----

"the alignment the compiler enforced" ^0
"  flag      at offset 0" ^0
"  id        at offset 8   divisible by 8" ^0
"  kind      at offset 16" ^0
"  timestamp at offset 24  divisible by 8" ^0
"  count     at offset 32  divisible by 4" ^0
"  misaligned loads : 0" ^0
"  verdict          : correctly aligned" ^0
"" ^0
"  true in both layouts, and true for every field; the" ^0
"  compiler will not emit a misaligned one" ^0
"" ^0

# ---- what it cost ----

size_as_declared - bytes_of_actual_field => padding_as_declared
size_reordered - bytes_of_actual_field => padding_reordered
size_as_declared - size_reordered => bytes_per_record_saved

"padding in the declared layout  : " + str(padding_as_declared) ^0
"padding when reordered          : " + str(padding_reordered) ^0
"difference per record           : " + str(bytes_per_record_saved) ^0
"" ^0

int(padding_as_declared * 10000 / size_as_declared) => padding_per_myriad
"share of the declared record that is gap : " + str(padding_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- at scale ----

records_resident * size_as_declared => resident_as_declared
records_resident * size_reordered => resident_reordered
resident_as_declared - resident_reordered => resident_saved

"records held in memory     : " + str(records_resident) ^0
"bytes as declared          : " + str(resident_as_declared) ^0
"bytes reordered            : " + str(resident_reordered) ^0
"bytes the field order cost : " + str(resident_saved) ^0
"" ^0

# ---- null control ----

# Same five fields, same alignment rule, declared widest first from the start.
0 => nc_bytes_saved_by_reordering

"null control - the same fields declared widest first" ^0
"  alignment verdict           : correctly aligned, unchanged" ^0
"  padding                     : " + str(padding_reordered) ^0
"  further saving from reorder : " + str(nc_bytes_saved_by_reordering) ^0
"  the rule did not change; the declaration order stopped" ^0
"  forcing gaps to satisfy it" ^0
"" ^0

# ---- the rule ----

"what correct alignment guarantees" ^0
"  every field starts where the hardware wants it : exactly" ^0
"  the record is no larger than its fields        : not" ^0
"    addressed, and the padding is the mechanism that" ^0
"    makes the first hold" ^0
"" ^0
"alignment is satisfied by inserting gaps; declaration order" ^0
"decides how many gaps satisfying it takes, and no diagnostic" ^0
"fires because nothing is wrong" ^0
"" ^0

"Every field is correctly aligned in both layouts and 0 loads are misaligned." ^0
"The declared order needs " + str(padding_as_declared) + " bytes of gap around " + str(bytes_of_actual_field) + " bytes of field -" ^0
str(padding_per_myriad) + " per ten thousand of the record is padding - so the same five values" ^0
"occupy " + str(size_as_declared) + " bytes instead of " + str(size_reordered) + ", and across " + str(records_resident) + " resident records" ^0
"that is " + str(resident_saved) + " bytes bought by the order somebody wrote the fields in." ^0
```

## Python (deterministic transpilation)

```python
size_flag = 1
size_id = 8
size_kind = 1
size_timestamp = 8
size_count = 4
widest_field = 8
records_resident = 42000000
bytes_of_actual_field = size_flag + size_id + size_kind + size_timestamp + size_count
pad_after_flag = 7
pad_after_kind = 7
size_before_tail_pad = bytes_of_actual_field + pad_after_flag + pad_after_kind
whole_units = int(size_before_tail_pad / widest_field)
remainder = size_before_tail_pad - whole_units * widest_field
if remainder > 0:
    tail_pad = widest_field - remainder
else:
    tail_pad = 0
size_as_declared = size_before_tail_pad + tail_pad
reordered_before_tail = size_id + size_timestamp + size_count + size_flag + size_kind
r_units = int(reordered_before_tail / widest_field)
r_remainder = reordered_before_tail - r_units * widest_field
if r_remainder > 0:
    reordered_tail_pad = widest_field - r_remainder
else:
    reordered_tail_pad = 0
size_reordered = reordered_before_tail + reordered_tail_pad
print("bytes that are field       : " + str(bytes_of_actual_field))
print("size as declared           : " + str(size_as_declared))
print("size reordered widest first: " + str(size_reordered))
print("")
print("the alignment the compiler enforced")
print("  flag      at offset 0")
print("  id        at offset 8   divisible by 8")
print("  kind      at offset 16")
print("  timestamp at offset 24  divisible by 8")
print("  count     at offset 32  divisible by 4")
print("  misaligned loads : 0")
print("  verdict          : correctly aligned")
print("")
print("  true in both layouts, and true for every field; the")
print("  compiler will not emit a misaligned one")
print("")
padding_as_declared = size_as_declared - bytes_of_actual_field
padding_reordered = size_reordered - bytes_of_actual_field
bytes_per_record_saved = size_as_declared - size_reordered
print("padding in the declared layout  : " + str(padding_as_declared))
print("padding when reordered          : " + str(padding_reordered))
print("difference per record           : " + str(bytes_per_record_saved))
print("")
padding_per_myriad = int(padding_as_declared * 10000 / size_as_declared)
print("share of the declared record that is gap : " + str(padding_per_myriad) + " per ten thousand")
print("")
resident_as_declared = records_resident * size_as_declared
resident_reordered = records_resident * size_reordered
resident_saved = resident_as_declared - resident_reordered
print("records held in memory     : " + str(records_resident))
print("bytes as declared          : " + str(resident_as_declared))
print("bytes reordered            : " + str(resident_reordered))
print("bytes the field order cost : " + str(resident_saved))
print("")
nc_bytes_saved_by_reordering = 0
print("null control - the same fields declared widest first")
print("  alignment verdict           : correctly aligned, unchanged")
print("  padding                     : " + str(padding_reordered))
print("  further saving from reorder : " + str(nc_bytes_saved_by_reordering))
print("  the rule did not change; the declaration order stopped")
print("  forcing gaps to satisfy it")
print("")
print("what correct alignment guarantees")
print("  every field starts where the hardware wants it : exactly")
print("  the record is no larger than its fields        : not")
print("    addressed, and the padding is the mechanism that")
print("    makes the first hold")
print("")
print("alignment is satisfied by inserting gaps; declaration order")
print("decides how many gaps satisfying it takes, and no diagnostic")
print("fires because nothing is wrong")
print("")
print("Every field is correctly aligned in both layouts and 0 loads are misaligned.")
print("The declared order needs " + str(padding_as_declared) + " bytes of gap around " + str(bytes_of_actual_field) + " bytes of field -")
print(str(padding_per_myriad) + " per ten thousand of the record is padding - so the same five values")
print("occupy " + str(size_as_declared) + " bytes instead of " + str(size_reordered) + ", and across " + str(records_resident) + " resident records")
print("that is " + str(resident_saved) + " bytes bought by the order somebody wrote the fields in.")
```

## stdout (executed)

```text
bytes that are field       : 22
size as declared           : 40
size reordered widest first: 24

the alignment the compiler enforced
  flag      at offset 0
  id        at offset 8   divisible by 8
  kind      at offset 16
  timestamp at offset 24  divisible by 8
  count     at offset 32  divisible by 4
  misaligned loads : 0
  verdict          : correctly aligned

  true in both layouts, and true for every field; the
  compiler will not emit a misaligned one

padding in the declared layout  : 18
padding when reordered          : 2
difference per record           : 16

share of the declared record that is gap : 4500 per ten thousand

records held in memory     : 42000000
bytes as declared          : 1680000000
bytes reordered            : 1008000000
bytes the field order cost : 672000000

null control - the same fields declared widest first
  alignment verdict           : correctly aligned, unchanged
  padding                     : 2
  further saving from reorder : 0
  the rule did not change; the declaration order stopped
  forcing gaps to satisfy it

what correct alignment guarantees
  every field starts where the hardware wants it : exactly
  the record is no larger than its fields        : not
    addressed, and the padding is the mechanism that
    makes the first hold

alignment is satisfied by inserting gaps; declaration order
decides how many gaps satisfying it takes, and no diagnostic
fires because nothing is wrong

Every field is correctly aligned in both layouts and 0 loads are misaligned.
The declared order needs 18 bytes of gap around 22 bytes of field -
4500 per ten thousand of the record is padding - so the same five values
occupy 40 bytes instead of 24, and across 42000000 resident records
that is 672000000 bytes bought by the order somebody wrote the fields in.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
