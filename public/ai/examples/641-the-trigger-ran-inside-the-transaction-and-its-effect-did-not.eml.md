<!-- canonical: efficientnewlanguage.org/ai/examples/641-the-trigger-ran-inside-the-transaction-and-its-effect-did-not | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 641 — The trigger ran inside the transaction and its effect did not

`the_trigger_ran_inside_the_transaction_and_its_effect_did_not.eml` - The trigger runs inside the transaction, so it is rolled back with everything else. What was rolled back is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The trigger runs
# inside the transaction, so it is rolled back with everything else. What was
# rolled back is computed below.
#
# Putting the side effect in a trigger is the careful choice. It fires in the
# same transaction as the row it reacts to, it sees the same snapshot, and if
# the transaction aborts the trigger's own writes vanish with the row. There is
# no window where the table says one thing and the trigger's bookkeeping says
# another. That is exactly what a trigger is for.
#
# Rollback is a property of the DATABASE's writes. It restores what the database
# controls, and the trigger's outbound call is not one of those things: the
# request left the process, the remote system answered, and the remote system
# has never heard of this transaction.
#
# Nine percent of these transactions abort on a constraint the trigger runs
# before. Their rows are gone. Their calls are not.

184000 => transactions_per_day
16560 => aborted_after_the_trigger_fired
# The trigger fires on the row insert; the constraint that aborts is checked at
# commit, later.
3 => remote_systems_called

transactions_per_day - aborted_after_the_trigger_fired => committed

"transactions per day        : " + str(transactions_per_day) ^0
"committed                   : " + str(committed) ^0
"aborted after the trigger   : " + str(aborted_after_the_trigger_fired) ^0
"" ^0

# ---- what rollback restored ----

"the database after an abort" ^0
"  the inserted row        : gone" ^0
"  the trigger's audit row : gone" ^0
"  the counter it bumped   : restored" ^0
"  orphaned records        : 0" ^0
"  verdict                 : consistent" ^0
"" ^0
"  every line is true, and this is why the logic was put in" ^0
"  a trigger rather than in the application" ^0
"" ^0

# ---- what it did not restore ----

aborted_after_the_trigger_fired * remote_systems_called => calls_with_no_row_behind_them

"what left the process before the abort" ^0
"  remote systems notified per transaction : " + str(remote_systems_called) ^0
"  notifications sent on aborted work      : " + str(calls_with_no_row_behind_them) ^0
"  notifications retracted                 : 0" ^0
"" ^0
"  the database rolled back its own writes; the request had" ^0
"  already been answered by a system that does not share" ^0
"  the transaction" ^0
"" ^0

int(aborted_after_the_trigger_fired * 10000 / transactions_per_day) => aborted_per_myriad
"aborted share : " + str(aborted_per_myriad) + " per ten thousand of the day" ^0
"" ^0

# ---- what the downstream believes ----

# Each remote system now holds a record whose primary key does not exist. They
# do not agree with each other either, because each one was called at a
# different point and only some of the three are idempotent on replay.
"downstream state after one aborted transaction" ^0
"  search index    : holds a document for a missing row" ^0
"  billing         : holds a line item for work not done" ^0
"  email           : delivered; not recallable in any sense" ^0
"" ^0
"  the row that would let anyone find these was rolled back," ^0
"  so the reconciliation job has no key to look them up by" ^0
"" ^0

# ---- null control ----

# The same trigger, writing to an outbox table inside the transaction, with a
# separate worker that reads committed rows and makes the calls.
0 => nc_calls_with_no_row_behind_them
committed * remote_systems_called => nc_calls_made

"null control - the trigger writes an outbox row instead" ^0
"  notifications on aborted work : " + str(nc_calls_with_no_row_behind_them) ^0
"  notifications on committed work : " + str(nc_calls_made) ^0
"  the trigger did not become more transactional; the" ^0
"  effect moved inside the thing that already was" ^0
"" ^0

# ---- the rule ----

"what running inside the transaction guarantees" ^0
"  the trigger's DATABASE writes abort with it : exactly" ^0
"  the trigger's other effects abort with it   : not" ^0
"    addressed; rollback is implemented by the database" ^0
"    over storage it owns, and an outbound call is not" ^0
"    storage it owns" ^0
"" ^0
"a transaction can only undo what it can see; the useful" ^0
"question is not where the code runs but whether the effect" ^0
"is a write to something the transaction controls" ^0
"" ^0

"The trigger is inside the transaction and the rollback is complete: the row is" ^0
"gone, the audit row is gone, the counter is restored, 0 orphans. On the " + str(aborted_after_the_trigger_fired) ^0
"transactions a day that abort - " + str(aborted_per_myriad) + " per ten thousand - it had already made" ^0
str(calls_with_no_row_behind_them) + " calls to " + str(remote_systems_called) + " systems that never heard of the transaction, and the key" ^0
"that would let anyone reconcile them was the first thing rolled back." ^0
```

## Python (deterministic transpilation)

```python
transactions_per_day = 184000
aborted_after_the_trigger_fired = 16560
remote_systems_called = 3
committed = transactions_per_day - aborted_after_the_trigger_fired
print("transactions per day        : " + str(transactions_per_day))
print("committed                   : " + str(committed))
print("aborted after the trigger   : " + str(aborted_after_the_trigger_fired))
print("")
print("the database after an abort")
print("  the inserted row        : gone")
print("  the trigger's audit row : gone")
print("  the counter it bumped   : restored")
print("  orphaned records        : 0")
print("  verdict                 : consistent")
print("")
print("  every line is true, and this is why the logic was put in")
print("  a trigger rather than in the application")
print("")
calls_with_no_row_behind_them = aborted_after_the_trigger_fired * remote_systems_called
print("what left the process before the abort")
print("  remote systems notified per transaction : " + str(remote_systems_called))
print("  notifications sent on aborted work      : " + str(calls_with_no_row_behind_them))
print("  notifications retracted                 : 0")
print("")
print("  the database rolled back its own writes; the request had")
print("  already been answered by a system that does not share")
print("  the transaction")
print("")
aborted_per_myriad = int(aborted_after_the_trigger_fired * 10000 / transactions_per_day)
print("aborted share : " + str(aborted_per_myriad) + " per ten thousand of the day")
print("")
print("downstream state after one aborted transaction")
print("  search index    : holds a document for a missing row")
print("  billing         : holds a line item for work not done")
print("  email           : delivered; not recallable in any sense")
print("")
print("  the row that would let anyone find these was rolled back,")
print("  so the reconciliation job has no key to look them up by")
print("")
nc_calls_with_no_row_behind_them = 0
nc_calls_made = committed * remote_systems_called
print("null control - the trigger writes an outbox row instead")
print("  notifications on aborted work : " + str(nc_calls_with_no_row_behind_them))
print("  notifications on committed work : " + str(nc_calls_made))
print("  the trigger did not become more transactional; the")
print("  effect moved inside the thing that already was")
print("")
print("what running inside the transaction guarantees")
print("  the trigger's DATABASE writes abort with it : exactly")
print("  the trigger's other effects abort with it   : not")
print("    addressed; rollback is implemented by the database")
print("    over storage it owns, and an outbound call is not")
print("    storage it owns")
print("")
print("a transaction can only undo what it can see; the useful")
print("question is not where the code runs but whether the effect")
print("is a write to something the transaction controls")
print("")
print("The trigger is inside the transaction and the rollback is complete: the row is")
print("gone, the audit row is gone, the counter is restored, 0 orphans. On the " + str(aborted_after_the_trigger_fired))
print("transactions a day that abort - " + str(aborted_per_myriad) + " per ten thousand - it had already made")
print(str(calls_with_no_row_behind_them) + " calls to " + str(remote_systems_called) + " systems that never heard of the transaction, and the key")
print("that would let anyone reconcile them was the first thing rolled back.")
```

## stdout (executed)

```text
transactions per day        : 184000
committed                   : 167440
aborted after the trigger   : 16560

the database after an abort
  the inserted row        : gone
  the trigger's audit row : gone
  the counter it bumped   : restored
  orphaned records        : 0
  verdict                 : consistent

  every line is true, and this is why the logic was put in
  a trigger rather than in the application

what left the process before the abort
  remote systems notified per transaction : 3
  notifications sent on aborted work      : 49680
  notifications retracted                 : 0

  the database rolled back its own writes; the request had
  already been answered by a system that does not share
  the transaction

aborted share : 900 per ten thousand of the day

downstream state after one aborted transaction
  search index    : holds a document for a missing row
  billing         : holds a line item for work not done
  email           : delivered; not recallable in any sense

  the row that would let anyone find these was rolled back,
  so the reconciliation job has no key to look them up by

null control - the trigger writes an outbox row instead
  notifications on aborted work : 0
  notifications on committed work : 502320
  the trigger did not become more transactional; the
  effect moved inside the thing that already was

what running inside the transaction guarantees
  the trigger's DATABASE writes abort with it : exactly
  the trigger's other effects abort with it   : not
    addressed; rollback is implemented by the database
    over storage it owns, and an outbound call is not
    storage it owns

a transaction can only undo what it can see; the useful
question is not where the code runs but whether the effect
is a write to something the transaction controls

The trigger is inside the transaction and the rollback is complete: the row is
gone, the audit row is gone, the counter is restored, 0 orphans. On the 16560
transactions a day that abort - 900 per ten thousand - it had already made
49680 calls to 3 systems that never heard of the transaction, and the key
that would let anyone reconcile them was the first thing rolled back.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
