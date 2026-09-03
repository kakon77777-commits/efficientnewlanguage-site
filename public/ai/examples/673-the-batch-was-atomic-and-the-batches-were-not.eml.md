<!-- canonical: efficientnewlanguage.org/ai/examples/673-the-batch-was-atomic-and-the-batches-were-not | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 673 — The batch was atomic and the batches were not

`the_batch_was_atomic_and_the_batches_were_not.eml` - Each batch is a transaction and no batch has ever half-applied. What one interrupted run leaves behind is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each batch is a
# transaction and no batch has ever half-applied. What one interrupted run
# leaves behind is computed below.
#
# The batching is done correctly. Five hundred rows per transaction, chosen
# after measuring that a single transaction over seventeen thousand rows held
# locks long enough to time out other work; each batch commits or rolls back
# whole; and a kill -9 during a batch leaves that batch entirely absent. Three
# years, no half-applied batch.
#
# Atomicity is a property of the TRANSACTION. The operation a person asked for
# spans thirty-four of them, and nothing in the database knows those thirty-four
# belong together.
#
# The run failed at batch nineteen. Eighteen batches are committed.

17000 => rows_in_the_operation
500 => batch_size
19 => batch_that_failed
0 => half_applied_batches
3 => interrupted_runs_per_month

int(rows_in_the_operation / batch_size) => batches
batch_that_failed - 1 => batches_committed
batches_committed * batch_size => rows_written
rows_in_the_operation - rows_written => rows_not_written

"rows in the operation   : " + str(rows_in_the_operation) ^0
"batch size              : " + str(batch_size) ^0
"batches                 : " + str(batches) ^0
"failed at batch         : " + str(batch_that_failed) ^0
"" ^0
"batches committed       : " + str(batches_committed) ^0
"rows written            : " + str(rows_written) ^0
"rows not written        : " + str(rows_not_written) ^0
"half-applied batches    : " + str(half_applied_batches) ^0
"" ^0

# ---- what the batching verified ----

"the batch transaction" ^0
"  rows per transaction : " + str(batch_size) ^0
"  chosen after measuring : a single transaction over " + str(rows_in_the_operation) ^0
"    rows held locks long enough to time out other work" ^0
"  commits or rolls back whole : yes" ^0
"  kill during a batch  : that batch is entirely absent" ^0
"  half-applied batches in three years : " + str(half_applied_batches) ^0
"  verdict              : ATOMIC" ^0
"" ^0
"  the batch size is not arbitrary and the alternative was" ^0
"  measured to be worse" ^0
"" ^0

# ---- what nothing holds ----

"the operation" ^0
"  batches it spans     : " + str(batches) ^0
"  a transaction covering all " + str(batches) + " : none, deliberately" ^0
"  a record that they belong together : none in the database" ^0
"  what a reader sees mid-run : " + str(rows_written) + " of " + str(rows_in_the_operation) + " rows," ^0
"    every one of them whole" ^0
"" ^0
"  each row is correct, each batch is correct, and the set" ^0
"  is a state the operation was never supposed to produce" ^0
"" ^0

int(rows_written * 10000 / rows_in_the_operation) => applied_per_myriad
"share of the operation applied : " + str(applied_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why a retry does not fix it ----

# Re-running from the start re-applies the first eighteen batches. Whether that
# is safe depends on whether the write is idempotent, which was never a
# requirement because the operation was thought of as atomic.
"the retry" ^0
"  starts from     : the beginning" ^0
"  re-applies      : " + str(batches_committed) + " batches" ^0
"  is that safe    : only if the write is idempotent" ^0
"  was idempotence a requirement : no, the operation was" ^0
"    thought of as all-or-nothing" ^0
"  interrupted runs per month : " + str(interrupted_runs_per_month) ^0
"" ^0

# ---- null control ----

# The same batch size, with a run identifier written in the first batch and
# cleared in the last, so an interrupted run is visible and resumable.
0 => nc_invisible_partial_states
batches_committed => nc_batches_resumable_from

"null control - a run marker written first and cleared last" ^0
"  half-applied batches : " + str(half_applied_batches) + ", unchanged" ^0
"  partial states a reader cannot detect : " + str(nc_invisible_partial_states) ^0
"  batch a retry resumes from : " + str(nc_batches_resumable_from) ^0
"  the transactions did not get bigger; the operation got" ^0
"  a beginning and an end that outlive one of them" ^0
"" ^0

# ---- the rule ----

"what an atomic batch guarantees" ^0
"  this transaction is all or nothing : exactly" ^0
"  the operation is all or nothing    : not addressed, and" ^0
"    the batching was adopted precisely because covering" ^0
"    the whole operation was too expensive" ^0
"" ^0
"splitting a transaction for a good reason splits the" ^0
"guarantee with it; the atomicity that is lost has to be" ^0
"rebuilt above the batches, and nothing warns that it was" ^0
"there" ^0
"" ^0

"Every batch is atomic and " + str(half_applied_batches) + " have half-applied in three years: " + str(batch_size) + " rows a" ^0
"transaction, a size chosen because one transaction over " + str(rows_in_the_operation) + " rows timed out" ^0
"other work. The operation spans " + str(batches) + " of them, so failing at batch " + str(batch_that_failed) + " leaves" ^0
str(rows_written) + " rows written and " + str(rows_not_written) + " not - " + str(applied_per_myriad) + " per ten thousand applied - with every" ^0
"row whole, and a retry re-applies " + str(batches_committed) + " batches nobody promised were idempotent." ^0
```

## Python (deterministic transpilation)

```python
rows_in_the_operation = 17000
batch_size = 500
batch_that_failed = 19
half_applied_batches = 0
interrupted_runs_per_month = 3
batches = int(rows_in_the_operation / batch_size)
batches_committed = batch_that_failed - 1
rows_written = batches_committed * batch_size
rows_not_written = rows_in_the_operation - rows_written
print("rows in the operation   : " + str(rows_in_the_operation))
print("batch size              : " + str(batch_size))
print("batches                 : " + str(batches))
print("failed at batch         : " + str(batch_that_failed))
print("")
print("batches committed       : " + str(batches_committed))
print("rows written            : " + str(rows_written))
print("rows not written        : " + str(rows_not_written))
print("half-applied batches    : " + str(half_applied_batches))
print("")
print("the batch transaction")
print("  rows per transaction : " + str(batch_size))
print("  chosen after measuring : a single transaction over " + str(rows_in_the_operation))
print("    rows held locks long enough to time out other work")
print("  commits or rolls back whole : yes")
print("  kill during a batch  : that batch is entirely absent")
print("  half-applied batches in three years : " + str(half_applied_batches))
print("  verdict              : ATOMIC")
print("")
print("  the batch size is not arbitrary and the alternative was")
print("  measured to be worse")
print("")
print("the operation")
print("  batches it spans     : " + str(batches))
print("  a transaction covering all " + str(batches) + " : none, deliberately")
print("  a record that they belong together : none in the database")
print("  what a reader sees mid-run : " + str(rows_written) + " of " + str(rows_in_the_operation) + " rows,")
print("    every one of them whole")
print("")
print("  each row is correct, each batch is correct, and the set")
print("  is a state the operation was never supposed to produce")
print("")
applied_per_myriad = int(rows_written * 10000 / rows_in_the_operation)
print("share of the operation applied : " + str(applied_per_myriad) + " per ten thousand")
print("")
print("the retry")
print("  starts from     : the beginning")
print("  re-applies      : " + str(batches_committed) + " batches")
print("  is that safe    : only if the write is idempotent")
print("  was idempotence a requirement : no, the operation was")
print("    thought of as all-or-nothing")
print("  interrupted runs per month : " + str(interrupted_runs_per_month))
print("")
nc_invisible_partial_states = 0
nc_batches_resumable_from = batches_committed
print("null control - a run marker written first and cleared last")
print("  half-applied batches : " + str(half_applied_batches) + ", unchanged")
print("  partial states a reader cannot detect : " + str(nc_invisible_partial_states))
print("  batch a retry resumes from : " + str(nc_batches_resumable_from))
print("  the transactions did not get bigger; the operation got")
print("  a beginning and an end that outlive one of them")
print("")
print("what an atomic batch guarantees")
print("  this transaction is all or nothing : exactly")
print("  the operation is all or nothing    : not addressed, and")
print("    the batching was adopted precisely because covering")
print("    the whole operation was too expensive")
print("")
print("splitting a transaction for a good reason splits the")
print("guarantee with it; the atomicity that is lost has to be")
print("rebuilt above the batches, and nothing warns that it was")
print("there")
print("")
print("Every batch is atomic and " + str(half_applied_batches) + " have half-applied in three years: " + str(batch_size) + " rows a")
print("transaction, a size chosen because one transaction over " + str(rows_in_the_operation) + " rows timed out")
print("other work. The operation spans " + str(batches) + " of them, so failing at batch " + str(batch_that_failed) + " leaves")
print(str(rows_written) + " rows written and " + str(rows_not_written) + " not - " + str(applied_per_myriad) + " per ten thousand applied - with every")
print("row whole, and a retry re-applies " + str(batches_committed) + " batches nobody promised were idempotent.")
```

## stdout (executed)

```text
rows in the operation   : 17000
batch size              : 500
batches                 : 34
failed at batch         : 19

batches committed       : 18
rows written            : 9000
rows not written        : 8000
half-applied batches    : 0

the batch transaction
  rows per transaction : 500
  chosen after measuring : a single transaction over 17000
    rows held locks long enough to time out other work
  commits or rolls back whole : yes
  kill during a batch  : that batch is entirely absent
  half-applied batches in three years : 0
  verdict              : ATOMIC

  the batch size is not arbitrary and the alternative was
  measured to be worse

the operation
  batches it spans     : 34
  a transaction covering all 34 : none, deliberately
  a record that they belong together : none in the database
  what a reader sees mid-run : 9000 of 17000 rows,
    every one of them whole

  each row is correct, each batch is correct, and the set
  is a state the operation was never supposed to produce

share of the operation applied : 5294 per ten thousand

the retry
  starts from     : the beginning
  re-applies      : 18 batches
  is that safe    : only if the write is idempotent
  was idempotence a requirement : no, the operation was
    thought of as all-or-nothing
  interrupted runs per month : 3

null control - a run marker written first and cleared last
  half-applied batches : 0, unchanged
  partial states a reader cannot detect : 0
  batch a retry resumes from : 18
  the transactions did not get bigger; the operation got
  a beginning and an end that outlive one of them

what an atomic batch guarantees
  this transaction is all or nothing : exactly
  the operation is all or nothing    : not addressed, and
    the batching was adopted precisely because covering
    the whole operation was too expensive

splitting a transaction for a good reason splits the
guarantee with it; the atomicity that is lost has to be
rebuilt above the batches, and nothing warns that it was
there

Every batch is atomic and 0 have half-applied in three years: 500 rows a
transaction, a size chosen because one transaction over 17000 rows timed out
other work. The operation spans 34 of them, so failing at batch 19 leaves
9000 rows written and 8000 not - 5294 per ten thousand applied - with every
row whole, and a retry re-applies 18 batches nobody promised were idempotent.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
