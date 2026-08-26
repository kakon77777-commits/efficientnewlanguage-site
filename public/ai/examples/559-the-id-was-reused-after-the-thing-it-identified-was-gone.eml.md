<!-- canonical: efficientnewlanguage.org/ai/examples/559-the-id-was-reused-after-the-thing-it-identified-was-gone | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 559 — The id was reused after the thing it identified was gone

`the_id_was_reused_after_the_thing_it_identified_was_gone.eml` - The audit log holds 20000 references, each one an entity id captured at the time an action was taken. How many of them still name the entity they were written about is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The audit log
# holds 20000 references, each one an entity id captured at the time an action
# was taken. How many of them still name the entity they were written about is
# computed below.
#
# Recycling ids is deliberate and was the right call at the time. The id column
# is a 32-bit integer in a schema that a dozen external systems parse, so
# widening it is a coordinated release across teams that do not share a
# calendar. At the observed creation rate a monotonic sequence exhausts the
# range, and exhaustion is not a graceful failure. A compact id space also keeps
# the index small enough to stay in memory, which is worth more than it sounds.
# The free list was reviewed, and the review was right.
#
# A reference is a promise that a name will still mean what it meant. Deleting
# an entity breaks that promise loudly: the lookup fails, something logs an
# error, someone investigates. Recycling the id repairs the lookup and keeps the
# promise broken.
#
# The audit log is not wrong in the sense of containing bad data. Every id in it
# was correct when written, and every id in it resolves today. It resolves to a
# different entity than the one the entry is about.

20000 => references
12 => months
500 => deleted_per_month
520 => created_per_month

deleted_per_month * months => deleted
created_per_month * months => created

# creations take an id from the free list first, and a fresh one only when the
# free list is empty
deleted => recycled
created - recycled => fresh_ids

"references in the audit log : " + str(references) ^0
"entities deleted in " + str(months) + " months : " + str(deleted) ^0
"entities created in " + str(months) + " months : " + str(created) ^0
"  of those, taking a recycled id: " + str(recycled) ^0
"  of those, taking a fresh id   : " + str(fresh_ids) ^0
"" ^0

references - recycled => still_correct

"reference resolves   points at the right entity   count" ^0
"  yes                  yes                        " + str(still_correct) ^0
"  yes                  no                         " + str(recycled) ^0
"  no                   -                          0" ^0
"" ^0
"  references that silently name someone else : " + str(recycled) + ", " + str(int(recycled * 100 / references)) + " percent" ^0
"  references that fail to resolve            : 0" ^0
"" ^0

# ---- the check that was run ----
#
# Integrity was verified by resolving every reference. It passed completely,
# and it would pass completely if every single reference were wrong, because
# resolving is the one property recycling preserves.

"integrity check: does every reference resolve" ^0
"  references checked : " + str(references) ^0
"  resolved           : " + str(references) ^0
"  failed             : 0" ^0
"  pass rate          : 100 percent" ^0
"" ^0
"  the same check against a store with NO id reuse" ^0
"    references checked : " + str(references) ^0
"    resolved           : " + str(references - recycled) ^0
"    failed             : " + str(recycled) + ", and every failure is a real finding" ^0
"" ^0
"  reuse turned " + str(recycled) + " loud failures into " + str(recycled) + " silent wrong answers" ^0
"  and it raised the pass rate of the integrity check from " + str(int((references - recycled) * 100 / references)) + " to 100" ^0
"" ^0

# ---- what a spot check finds ----

100 => sample
int(sample * recycled / references) => expected_wrong

"a reviewer spot-checks " + str(sample) + " references by opening each one" ^0
"  entries that open successfully : " + str(sample) ^0
"  entries that are about a different entity than the id names : " + str(expected_wrong) ^0
"  entries that LOOK wrong when opened : 0" ^0
"  a recycled id names a real, current, well-formed entity" ^0
"  telling the two apart needs the entity's creation time, which the audit" ^0
"  entry does not record, because when it was written it did not need to" ^0
"" ^0

# ---- what would have made it detectable ----

"what a reference would need to carry to be checkable" ^0
"  the id                      present" ^0
"  the entity generation count not present" ^0
"  the entity creation time    not present" ^0
"  the time the reference was taken   present" ^0
"  the last two together are enough: a reference is stale if the entity was" ^0
"  created after the reference was taken" ^0
"  one of the two is already there" ^0
"" ^0

# ---- the control ----
#
# References to entities that were never deleted. These are unaffected, they
# are the majority, and they are what any sample is mostly made of. The data is
# not corrupt; it is correct in the ordinary case and wrong in a case that
# leaves no mark.

"control - references to entities that were never deleted" ^0
"  count            : " + str(still_correct) ^0
"  resolve          : " + str(still_correct) ^0
"  name the right entity : " + str(still_correct) ^0
"  errors           : 0" ^0
"  " + str(int(still_correct * 100 / references)) + " percent of the log is exactly right, which is why it reads as healthy" ^0
"" ^0

# ---- the null control ----
#
# The same recycling policy, in a system where nothing holds a reference beyond
# the lifetime of the entity. Reuse is then free: there is no one left to be
# misled. The policy is not a defect on its own - it is a defect exactly as far
# as something outside the entity's lifetime remembers its name.

"null control - the same recycling policy, no long-lived references" ^0
"  references held past deletion : 0" ^0
"  references that silently name someone else : 0" ^0
"  ids saved by recycling        : " + str(recycled) ^0
"  index kept small, 32-bit column kept, no coordinated release needed" ^0
"  identical policy, and here it is purely a win" ^0
"" ^0

# ---- the rule ----

"what deletion and reuse each do to an outstanding reference" ^0
"  delete only        the lookup fails, loudly, and gets fixed" ^0
"  delete and reuse   the lookup succeeds and returns a different thing" ^0
"  the second is cheaper to run and more expensive to be wrong about" ^0
"  a reference is only as good as the guarantee that the name is not reissued" ^0
"" ^0

"A 32-bit id column parsed by a dozen external systems cannot be widened" ^0
"without a coordinated release, a monotonic sequence exhausts that range, and a" ^0
"compact id space keeps the index in memory. Recycling was the correct" ^0
"decision. " + str(recycled) + " of the " + str(references) + " references in the audit log now resolve to an" ^0
"entity that is not the one the entry is about, none of them fail to resolve," ^0
"and the integrity check that reads every one of them reports 100 percent." ^0
```

## Python (deterministic transpilation)

```python
references = 20000
months = 12
deleted_per_month = 500
created_per_month = 520
deleted = deleted_per_month * months
created = created_per_month * months
recycled = deleted
fresh_ids = created - recycled
print("references in the audit log : " + str(references))
print("entities deleted in " + str(months) + " months : " + str(deleted))
print("entities created in " + str(months) + " months : " + str(created))
print("  of those, taking a recycled id: " + str(recycled))
print("  of those, taking a fresh id   : " + str(fresh_ids))
print("")
still_correct = references - recycled
print("reference resolves   points at the right entity   count")
print("  yes                  yes                        " + str(still_correct))
print("  yes                  no                         " + str(recycled))
print("  no                   -                          0")
print("")
print("  references that silently name someone else : " + str(recycled) + ", " + str(int(recycled * 100 / references)) + " percent")
print("  references that fail to resolve            : 0")
print("")
print("integrity check: does every reference resolve")
print("  references checked : " + str(references))
print("  resolved           : " + str(references))
print("  failed             : 0")
print("  pass rate          : 100 percent")
print("")
print("  the same check against a store with NO id reuse")
print("    references checked : " + str(references))
print("    resolved           : " + str(references - recycled))
print("    failed             : " + str(recycled) + ", and every failure is a real finding")
print("")
print("  reuse turned " + str(recycled) + " loud failures into " + str(recycled) + " silent wrong answers")
print("  and it raised the pass rate of the integrity check from " + str(int((references - recycled) * 100 / references)) + " to 100")
print("")
sample = 100
expected_wrong = int(sample * recycled / references)
print("a reviewer spot-checks " + str(sample) + " references by opening each one")
print("  entries that open successfully : " + str(sample))
print("  entries that are about a different entity than the id names : " + str(expected_wrong))
print("  entries that LOOK wrong when opened : 0")
print("  a recycled id names a real, current, well-formed entity")
print("  telling the two apart needs the entity's creation time, which the audit")
print("  entry does not record, because when it was written it did not need to")
print("")
print("what a reference would need to carry to be checkable")
print("  the id                      present")
print("  the entity generation count not present")
print("  the entity creation time    not present")
print("  the time the reference was taken   present")
print("  the last two together are enough: a reference is stale if the entity was")
print("  created after the reference was taken")
print("  one of the two is already there")
print("")
print("control - references to entities that were never deleted")
print("  count            : " + str(still_correct))
print("  resolve          : " + str(still_correct))
print("  name the right entity : " + str(still_correct))
print("  errors           : 0")
print("  " + str(int(still_correct * 100 / references)) + " percent of the log is exactly right, which is why it reads as healthy")
print("")
print("null control - the same recycling policy, no long-lived references")
print("  references held past deletion : 0")
print("  references that silently name someone else : 0")
print("  ids saved by recycling        : " + str(recycled))
print("  index kept small, 32-bit column kept, no coordinated release needed")
print("  identical policy, and here it is purely a win")
print("")
print("what deletion and reuse each do to an outstanding reference")
print("  delete only        the lookup fails, loudly, and gets fixed")
print("  delete and reuse   the lookup succeeds and returns a different thing")
print("  the second is cheaper to run and more expensive to be wrong about")
print("  a reference is only as good as the guarantee that the name is not reissued")
print("")
print("A 32-bit id column parsed by a dozen external systems cannot be widened")
print("without a coordinated release, a monotonic sequence exhausts that range, and a")
print("compact id space keeps the index in memory. Recycling was the correct")
print("decision. " + str(recycled) + " of the " + str(references) + " references in the audit log now resolve to an")
print("entity that is not the one the entry is about, none of them fail to resolve,")
print("and the integrity check that reads every one of them reports 100 percent.")
```

## stdout (executed)

```text
references in the audit log : 20000
entities deleted in 12 months : 6000
entities created in 12 months : 6240
  of those, taking a recycled id: 6000
  of those, taking a fresh id   : 240

reference resolves   points at the right entity   count
  yes                  yes                        14000
  yes                  no                         6000
  no                   -                          0

  references that silently name someone else : 6000, 30 percent
  references that fail to resolve            : 0

integrity check: does every reference resolve
  references checked : 20000
  resolved           : 20000
  failed             : 0
  pass rate          : 100 percent

  the same check against a store with NO id reuse
    references checked : 20000
    resolved           : 14000
    failed             : 6000, and every failure is a real finding

  reuse turned 6000 loud failures into 6000 silent wrong answers
  and it raised the pass rate of the integrity check from 70 to 100

a reviewer spot-checks 100 references by opening each one
  entries that open successfully : 100
  entries that are about a different entity than the id names : 30
  entries that LOOK wrong when opened : 0
  a recycled id names a real, current, well-formed entity
  telling the two apart needs the entity's creation time, which the audit
  entry does not record, because when it was written it did not need to

what a reference would need to carry to be checkable
  the id                      present
  the entity generation count not present
  the entity creation time    not present
  the time the reference was taken   present
  the last two together are enough: a reference is stale if the entity was
  created after the reference was taken
  one of the two is already there

control - references to entities that were never deleted
  count            : 14000
  resolve          : 14000
  name the right entity : 14000
  errors           : 0
  70 percent of the log is exactly right, which is why it reads as healthy

null control - the same recycling policy, no long-lived references
  references held past deletion : 0
  references that silently name someone else : 0
  ids saved by recycling        : 6000
  index kept small, 32-bit column kept, no coordinated release needed
  identical policy, and here it is purely a win

what deletion and reuse each do to an outstanding reference
  delete only        the lookup fails, loudly, and gets fixed
  delete and reuse   the lookup succeeds and returns a different thing
  the second is cheaper to run and more expensive to be wrong about
  a reference is only as good as the guarantee that the name is not reissued

A 32-bit id column parsed by a dozen external systems cannot be widened
without a coordinated release, a monotonic sequence exhausts that range, and a
compact id space keeps the index in memory. Recycling was the correct
decision. 6000 of the 20000 references in the audit log now resolve to an
entity that is not the one the entry is about, none of them fail to resolve,
and the integrity check that reads every one of them reports 100 percent.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
