<!-- canonical: efficientnewlanguage.org/ai/examples/612-the-batch-committed-and-the-notification-did-not | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 612 — The batch committed and the notification did not

`the_batch_committed_and_the_notification_did_not.eml` - A batch writes rows inside a transaction and then tells the downstream service. The transaction is atomic. What "and then" costs is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A batch writes
# rows inside a transaction and then tells the downstream service. The
# transaction is atomic. What "and then" costs is computed below.
#
# The transaction is correct and it is doing real work. Either every row of a
# batch lands or none does; a crash mid-write leaves no half-applied batch to
# reconcile by hand, and the constraint that would have been violated in the
# middle is never observable. That guarantee has held on every batch.
#
# The notification is a network call to another service. It cannot join the
# transaction, so it happens after the commit returns — which is the only place
# it CAN happen, because before the commit there is nothing true to announce.
#
# So there is a moment when the rows exist and nobody has been told, and the
# transaction's guarantee does not reach into it because it has already ended.

4200 => batches_per_day
250 => rows_per_batch
2400 => batch_ms
180 => gap_ms

batches_per_day * rows_per_batch => rows_per_day

"batches per day        : " + str(batches_per_day) ^0
"rows per batch         : " + str(rows_per_batch) ^0
"rows per day           : " + str(rows_per_day) ^0
"commit to notify, gap  : " + str(gap_ms) + " ms" ^0
"" ^0

# ---- what the transaction guarantees, checked ----

"the transaction, against what it promises" ^0
"  batches partially applied  : 0" ^0
"  constraint violations seen : 0" ^0
"  rows written twice         : 0" ^0
"  manual reconciliations     : 0" ^0
"  defects in the transaction : 0" ^0
"" ^0
"  atomicity holds on all " + str(batches_per_day) + " batches a day" ^0
"" ^0

# ---- the gap ----

int(gap_ms * 10000 / batch_ms) => gap_per_myriad
int(batches_per_day * gap_per_myriad / 10000) => lost_per_day
lost_per_day * rows_per_batch => rows_unannounced_per_day

"the window between commit and notify" ^0
"  batch duration        : " + str(batch_ms) + " ms" ^0
"  gap                   : " + str(gap_ms) + " ms" ^0
"  share of the batch    : " + str(gap_per_myriad) + " per ten thousand" ^0
"" ^0
"  a crash in that window leaves the rows and loses the message" ^0
"  batches affected per day : " + str(lost_per_day) ^0
"  rows nobody is told about: " + str(rows_unannounced_per_day) + " per day" ^0
"" ^0

# ---- what each side believes ----

rows_per_day - rows_unannounced_per_day => rows_downstream_knows

"at the end of one day" ^0
"  rows in the database      : " + str(rows_per_day) ^0
"  rows downstream knows of  : " + str(rows_downstream_knows) ^0
"  divergence                : " + str(rows_unannounced_per_day) ^0
"" ^0
"  the database is internally consistent" ^0
"  the downstream service is internally consistent" ^0
"  neither is wrong about anything it can check alone" ^0
"" ^0

# ---- the divergence over a week ----

"day   rows written   downstream knows   cumulative gap" ^0
0 => running
for d in [1:5]:
    running + rows_unannounced_per_day => running
    "  " + str(d) + "     " + str(rows_per_day) + "        " + str(rows_downstream_knows) + "            " + str(running) ^0
"" ^0
"  nothing in that table is an error state on either side" ^0
"" ^0

# ---- what a retry of the notification does ----
#
# The obvious repair is to retry the notify. It cannot run, because the process
# that would have retried it is the one that died; the retry lives in the same
# memory as the message.

"retrying the notification" ^0
"  where the pending message lives : in the crashed process" ^0
"  messages recoverable after a crash : 0" ^0
"  a retry helps when the CALL fails : yes" ^0
"  a retry helps when the CALLER dies : no" ^0
"" ^0
"  the two failure modes look identical from the callee" ^0
"" ^0

# ---- the control ----
#
# The transaction, on the thing it was placed to prevent. Without it a crash
# mid-batch leaves part of a batch behind, and that is the failure this design
# was built to remove.

int(batches_per_day * gap_per_myriad / 10000) => partial_without_txn

"control - is the transaction earning its place" ^0
"  partially applied batches without it : " + str(partial_without_txn) + " a day" ^0
"  partially applied batches with it    : 0" ^0
"  rows needing manual repair with it   : 0" ^0
"  defects in the transaction           : 0" ^0
"" ^0
"  the transaction removes the failure inside the batch" ^0
"  and cannot reach the one immediately after it" ^0
"" ^0

# ---- the null control ----
#
# The same batch, same crash rate, where the message is written to a table in
# the SAME transaction and a separate reader ships it. The transaction did not
# get stronger; the notification moved inside its edge.

0 => nc_rows_unannounced

"null control - the message written inside the transaction" ^0
"  batches per day            : " + str(batches_per_day) ^0
"  crash window               : " + str(gap_ms) + " ms, unchanged" ^0
"  rows nobody is told about  : " + str(nc_rows_unannounced) ^0
"  the crash still happens at the same rate" ^0
"  what changed is which side of the commit the message is on" ^0
"" ^0

# ---- the rule ----

"what a transaction's atomicity covers" ^0
"  every write inside it          : completely" ^0
"  the first statement after it   : not at all" ^0
"  and 'after the commit' is the only place a call to another" ^0
"  system can go, so the gap is not an oversight - it is where" ^0
"  the design put the one step that cannot join" ^0
"" ^0
"the repair is not a wider transaction, which cannot span two" ^0
"systems; it is to make the message a row, so that announcing" ^0
"and writing are the same commit" ^0
"" ^0

"The transaction is atomic on all " + str(batches_per_day) + " batches a day: 0 partial applications, 0" ^0
"constraint violations, 0 manual reconciliations. The notification sits " + str(gap_ms) + " ms" ^0
"after it - " + str(gap_per_myriad) + " per ten thousand of the batch - so " + str(lost_per_day) + " batches a day commit" ^0
str(rows_unannounced_per_day) + " rows that nobody downstream is told about, and neither system can" ^0
"detect it, because each one is entirely consistent with itself." ^0
```

## Python (deterministic transpilation)

```python
batches_per_day = 4200
rows_per_batch = 250
batch_ms = 2400
gap_ms = 180
rows_per_day = batches_per_day * rows_per_batch
print("batches per day        : " + str(batches_per_day))
print("rows per batch         : " + str(rows_per_batch))
print("rows per day           : " + str(rows_per_day))
print("commit to notify, gap  : " + str(gap_ms) + " ms")
print("")
print("the transaction, against what it promises")
print("  batches partially applied  : 0")
print("  constraint violations seen : 0")
print("  rows written twice         : 0")
print("  manual reconciliations     : 0")
print("  defects in the transaction : 0")
print("")
print("  atomicity holds on all " + str(batches_per_day) + " batches a day")
print("")
gap_per_myriad = int(gap_ms * 10000 / batch_ms)
lost_per_day = int(batches_per_day * gap_per_myriad / 10000)
rows_unannounced_per_day = lost_per_day * rows_per_batch
print("the window between commit and notify")
print("  batch duration        : " + str(batch_ms) + " ms")
print("  gap                   : " + str(gap_ms) + " ms")
print("  share of the batch    : " + str(gap_per_myriad) + " per ten thousand")
print("")
print("  a crash in that window leaves the rows and loses the message")
print("  batches affected per day : " + str(lost_per_day))
print("  rows nobody is told about: " + str(rows_unannounced_per_day) + " per day")
print("")
rows_downstream_knows = rows_per_day - rows_unannounced_per_day
print("at the end of one day")
print("  rows in the database      : " + str(rows_per_day))
print("  rows downstream knows of  : " + str(rows_downstream_knows))
print("  divergence                : " + str(rows_unannounced_per_day))
print("")
print("  the database is internally consistent")
print("  the downstream service is internally consistent")
print("  neither is wrong about anything it can check alone")
print("")
print("day   rows written   downstream knows   cumulative gap")
running = 0
for d in range(1, 6):
    running = running + rows_unannounced_per_day
    print("  " + str(d) + "     " + str(rows_per_day) + "        " + str(rows_downstream_knows) + "            " + str(running))
print("")
print("  nothing in that table is an error state on either side")
print("")
print("retrying the notification")
print("  where the pending message lives : in the crashed process")
print("  messages recoverable after a crash : 0")
print("  a retry helps when the CALL fails : yes")
print("  a retry helps when the CALLER dies : no")
print("")
print("  the two failure modes look identical from the callee")
print("")
partial_without_txn = int(batches_per_day * gap_per_myriad / 10000)
print("control - is the transaction earning its place")
print("  partially applied batches without it : " + str(partial_without_txn) + " a day")
print("  partially applied batches with it    : 0")
print("  rows needing manual repair with it   : 0")
print("  defects in the transaction           : 0")
print("")
print("  the transaction removes the failure inside the batch")
print("  and cannot reach the one immediately after it")
print("")
nc_rows_unannounced = 0
print("null control - the message written inside the transaction")
print("  batches per day            : " + str(batches_per_day))
print("  crash window               : " + str(gap_ms) + " ms, unchanged")
print("  rows nobody is told about  : " + str(nc_rows_unannounced))
print("  the crash still happens at the same rate")
print("  what changed is which side of the commit the message is on")
print("")
print("what a transaction's atomicity covers")
print("  every write inside it          : completely")
print("  the first statement after it   : not at all")
print("  and 'after the commit' is the only place a call to another")
print("  system can go, so the gap is not an oversight - it is where")
print("  the design put the one step that cannot join")
print("")
print("the repair is not a wider transaction, which cannot span two")
print("systems; it is to make the message a row, so that announcing")
print("and writing are the same commit")
print("")
print("The transaction is atomic on all " + str(batches_per_day) + " batches a day: 0 partial applications, 0")
print("constraint violations, 0 manual reconciliations. The notification sits " + str(gap_ms) + " ms")
print("after it - " + str(gap_per_myriad) + " per ten thousand of the batch - so " + str(lost_per_day) + " batches a day commit")
print(str(rows_unannounced_per_day) + " rows that nobody downstream is told about, and neither system can")
print("detect it, because each one is entirely consistent with itself.")
```

## stdout (executed)

```text
batches per day        : 4200
rows per batch         : 250
rows per day           : 1050000
commit to notify, gap  : 180 ms

the transaction, against what it promises
  batches partially applied  : 0
  constraint violations seen : 0
  rows written twice         : 0
  manual reconciliations     : 0
  defects in the transaction : 0

  atomicity holds on all 4200 batches a day

the window between commit and notify
  batch duration        : 2400 ms
  gap                   : 180 ms
  share of the batch    : 750 per ten thousand

  a crash in that window leaves the rows and loses the message
  batches affected per day : 315
  rows nobody is told about: 78750 per day

at the end of one day
  rows in the database      : 1050000
  rows downstream knows of  : 971250
  divergence                : 78750

  the database is internally consistent
  the downstream service is internally consistent
  neither is wrong about anything it can check alone

day   rows written   downstream knows   cumulative gap
  1     1050000        971250            78750
  2     1050000        971250            157500
  3     1050000        971250            236250
  4     1050000        971250            315000
  5     1050000        971250            393750

  nothing in that table is an error state on either side

retrying the notification
  where the pending message lives : in the crashed process
  messages recoverable after a crash : 0
  a retry helps when the CALL fails : yes
  a retry helps when the CALLER dies : no

  the two failure modes look identical from the callee

control - is the transaction earning its place
  partially applied batches without it : 315 a day
  partially applied batches with it    : 0
  rows needing manual repair with it   : 0
  defects in the transaction           : 0

  the transaction removes the failure inside the batch
  and cannot reach the one immediately after it

null control - the message written inside the transaction
  batches per day            : 4200
  crash window               : 180 ms, unchanged
  rows nobody is told about  : 0
  the crash still happens at the same rate
  what changed is which side of the commit the message is on

what a transaction's atomicity covers
  every write inside it          : completely
  the first statement after it   : not at all
  and 'after the commit' is the only place a call to another
  system can go, so the gap is not an oversight - it is where
  the design put the one step that cannot join

the repair is not a wider transaction, which cannot span two
systems; it is to make the message a row, so that announcing
and writing are the same commit

The transaction is atomic on all 4200 batches a day: 0 partial applications, 0
constraint violations, 0 manual reconciliations. The notification sits 180 ms
after it - 750 per ten thousand of the batch - so 315 batches a day commit
78750 rows that nobody downstream is told about, and neither system can
detect it, because each one is entirely consistent with itself.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
