<!-- canonical: efficientnewlanguage.org/ai/examples/630-the-column-was-encrypted-and-the-index-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 630 — The column was encrypted and the index was not

`the_column_was_encrypted_and_the_index_was_not.eml` - The column is encrypted and nobody with the disk has the key. How many rows a reader with the index alone can label is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The column is
# encrypted and nobody with the disk has the key. How many rows a reader with
# the index alone can label is computed below.
#
# The encryption is done properly. The key lives in a separate service, it is
# rotated, the ciphertext is authenticated, and a copy of the volume is
# genuinely opaque. An auditor who takes the disk home learns nothing from the
# column, and that was the requirement.
#
# The column also has to be searchable by equality, so a second value is stored
# beside it: a deterministic index, where equal plaintexts produce equal
# entries. That is what makes the lookup work, and it is the whole property.
#
# The column has six distinct values with a published population distribution.
# Sorting six ciphertexts by frequency and lining them up against six known
# frequencies takes no key at all.

18400000 => rows
6 => distinct_values
11040000 => class_1
3680000 => class_2
2208000 => class_3
920000 => class_4
460000 => class_5
92000 => class_6
0 => plaintexts_recoverable_from_the_ciphertext

class_1 + class_2 + class_3 + class_4 + class_5 + class_6 => rows_accounted_for

"rows                    : " + str(rows) ^0
"distinct values         : " + str(distinct_values) ^0
"rows accounted for      : " + str(rows_accounted_for) ^0
"" ^0
"index entries by frequency" ^0
"  1 : " + str(class_1) ^0
"  2 : " + str(class_2) ^0
"  3 : " + str(class_3) ^0
"  4 : " + str(class_4) ^0
"  5 : " + str(class_5) ^0
"  6 : " + str(class_6) ^0
"" ^0

# ---- what the encryption verified ----

"the column at rest" ^0
"  algorithm            : authenticated, key held elsewhere" ^0
"  key on this volume   : no" ^0
"  rotation             : quarterly, performed" ^0
"  plaintexts recoverable from the ciphertext : " + str(plaintexts_recoverable_from_the_ciphertext) ^0
"  verdict              : ENCRYPTED" ^0
"" ^0
"  a stolen volume yields nothing from this column, and" ^0
"  that is the property that was asked for" ^0
"" ^0

# ---- what the index is ----

"the equality index beside it" ^0
"  equal plaintexts        : produce equal entries" ^0
"  that is the requirement : a lookup needs it" ^0
"  entries are encrypted   : yes" ^0
"  entries are distinguishable : also yes, and that is" ^0
"    the same fact" ^0
"" ^0
"  determinism is not a weakness of this index; it is what" ^0
"  the index is for, and it publishes the partition" ^0
"" ^0

int(class_1 * 10000 / rows) => largest_class_per_myriad
"the largest class : " + str(largest_class_per_myriad) + " per ten thousand of the table" ^0
"" ^0

# ---- what a reader with the volume can do ----

# The population distribution for this field is published by the regulator.
# Ranking six numbers against six numbers is the whole attack; there is no
# cryptanalysis in it and the key is never involved.
"labelling the rows without the key" ^0
"  distinct entries observed : " + str(distinct_values) ^0
"  published frequencies to match against : " + str(distinct_values) ^0
"  rows labelled by rank      : " + str(rows) ^0
"  key material used          : none" ^0
"" ^0
"  the ciphertext of each row is still unread; what was" ^0
"  recovered is which rows share a value, and then which" ^0
"  value that is" ^0
"" ^0

# ---- null control ----

# The same column with a randomised index and equality handled by re-encrypting
# the search term inside the key service.
1 => nc_distinct_entries_observed
0 => nc_rows_labelled_by_rank

"null control - randomised index, equality done in the key service" ^0
"  column verdict            : ENCRYPTED, unchanged" ^0
"  distinct entries observed : " + str(nc_distinct_entries_observed) + " per row, all different" ^0
"  rows labelled by rank     : " + str(nc_rows_labelled_by_rank) ^0
"  the encryption did not get stronger; the equality moved" ^0
"  to the side that holds the key" ^0
"" ^0

# ---- the rule ----

"what an encrypted column guarantees" ^0
"  the value cannot be read from the bytes : exactly" ^0
"  the value cannot be inferred            : not addressed;" ^0
"    an equality index publishes which rows agree, and on a" ^0
"    low-cardinality column agreeing is nearly the value" ^0
"" ^0
"encryption hides content and a deterministic index exposes" ^0
"equality; the second is the feature and the leak, and the" ^0
"cardinality decides which one it mostly is" ^0
"" ^0

"The column is encrypted correctly and a stolen volume yields " + str(plaintexts_recoverable_from_the_ciphertext) + " plaintexts" ^0
"from it: authenticated, key held elsewhere, rotated quarterly. Beside it sits a" ^0
"deterministic index over " + str(distinct_values) + " values whose largest class is " + str(largest_class_per_myriad) + " per ten" ^0
"thousand of the table, so ranking " + str(distinct_values) + " frequencies against a published" ^0
"distribution labels all " + str(rows) + " rows without touching the key." ^0
```

## Python (deterministic transpilation)

```python
rows = 18400000
distinct_values = 6
class_1 = 11040000
class_2 = 3680000
class_3 = 2208000
class_4 = 920000
class_5 = 460000
class_6 = 92000
plaintexts_recoverable_from_the_ciphertext = 0
rows_accounted_for = class_1 + class_2 + class_3 + class_4 + class_5 + class_6
print("rows                    : " + str(rows))
print("distinct values         : " + str(distinct_values))
print("rows accounted for      : " + str(rows_accounted_for))
print("")
print("index entries by frequency")
print("  1 : " + str(class_1))
print("  2 : " + str(class_2))
print("  3 : " + str(class_3))
print("  4 : " + str(class_4))
print("  5 : " + str(class_5))
print("  6 : " + str(class_6))
print("")
print("the column at rest")
print("  algorithm            : authenticated, key held elsewhere")
print("  key on this volume   : no")
print("  rotation             : quarterly, performed")
print("  plaintexts recoverable from the ciphertext : " + str(plaintexts_recoverable_from_the_ciphertext))
print("  verdict              : ENCRYPTED")
print("")
print("  a stolen volume yields nothing from this column, and")
print("  that is the property that was asked for")
print("")
print("the equality index beside it")
print("  equal plaintexts        : produce equal entries")
print("  that is the requirement : a lookup needs it")
print("  entries are encrypted   : yes")
print("  entries are distinguishable : also yes, and that is")
print("    the same fact")
print("")
print("  determinism is not a weakness of this index; it is what")
print("  the index is for, and it publishes the partition")
print("")
largest_class_per_myriad = int(class_1 * 10000 / rows)
print("the largest class : " + str(largest_class_per_myriad) + " per ten thousand of the table")
print("")
print("labelling the rows without the key")
print("  distinct entries observed : " + str(distinct_values))
print("  published frequencies to match against : " + str(distinct_values))
print("  rows labelled by rank      : " + str(rows))
print("  key material used          : none")
print("")
print("  the ciphertext of each row is still unread; what was")
print("  recovered is which rows share a value, and then which")
print("  value that is")
print("")
nc_distinct_entries_observed = 1
nc_rows_labelled_by_rank = 0
print("null control - randomised index, equality done in the key service")
print("  column verdict            : ENCRYPTED, unchanged")
print("  distinct entries observed : " + str(nc_distinct_entries_observed) + " per row, all different")
print("  rows labelled by rank     : " + str(nc_rows_labelled_by_rank))
print("  the encryption did not get stronger; the equality moved")
print("  to the side that holds the key")
print("")
print("what an encrypted column guarantees")
print("  the value cannot be read from the bytes : exactly")
print("  the value cannot be inferred            : not addressed;")
print("    an equality index publishes which rows agree, and on a")
print("    low-cardinality column agreeing is nearly the value")
print("")
print("encryption hides content and a deterministic index exposes")
print("equality; the second is the feature and the leak, and the")
print("cardinality decides which one it mostly is")
print("")
print("The column is encrypted correctly and a stolen volume yields " + str(plaintexts_recoverable_from_the_ciphertext) + " plaintexts")
print("from it: authenticated, key held elsewhere, rotated quarterly. Beside it sits a")
print("deterministic index over " + str(distinct_values) + " values whose largest class is " + str(largest_class_per_myriad) + " per ten")
print("thousand of the table, so ranking " + str(distinct_values) + " frequencies against a published")
print("distribution labels all " + str(rows) + " rows without touching the key.")
```

## stdout (executed)

```text
rows                    : 18400000
distinct values         : 6
rows accounted for      : 18400000

index entries by frequency
  1 : 11040000
  2 : 3680000
  3 : 2208000
  4 : 920000
  5 : 460000
  6 : 92000

the column at rest
  algorithm            : authenticated, key held elsewhere
  key on this volume   : no
  rotation             : quarterly, performed
  plaintexts recoverable from the ciphertext : 0
  verdict              : ENCRYPTED

  a stolen volume yields nothing from this column, and
  that is the property that was asked for

the equality index beside it
  equal plaintexts        : produce equal entries
  that is the requirement : a lookup needs it
  entries are encrypted   : yes
  entries are distinguishable : also yes, and that is
    the same fact

  determinism is not a weakness of this index; it is what
  the index is for, and it publishes the partition

the largest class : 6000 per ten thousand of the table

labelling the rows without the key
  distinct entries observed : 6
  published frequencies to match against : 6
  rows labelled by rank      : 18400000
  key material used          : none

  the ciphertext of each row is still unread; what was
  recovered is which rows share a value, and then which
  value that is

null control - randomised index, equality done in the key service
  column verdict            : ENCRYPTED, unchanged
  distinct entries observed : 1 per row, all different
  rows labelled by rank     : 0
  the encryption did not get stronger; the equality moved
  to the side that holds the key

what an encrypted column guarantees
  the value cannot be read from the bytes : exactly
  the value cannot be inferred            : not addressed;
    an equality index publishes which rows agree, and on a
    low-cardinality column agreeing is nearly the value

encryption hides content and a deterministic index exposes
equality; the second is the feature and the leak, and the
cardinality decides which one it mostly is

The column is encrypted correctly and a stolen volume yields 0 plaintexts
from it: authenticated, key held elsewhere, rotated quarterly. Beside it sits a
deterministic index over 6 values whose largest class is 6000 per ten
thousand of the table, so ranking 6 frequencies against a published
distribution labels all 18400000 rows without touching the key.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
