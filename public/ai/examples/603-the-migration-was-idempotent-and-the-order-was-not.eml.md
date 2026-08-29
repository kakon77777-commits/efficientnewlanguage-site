<!-- canonical: efficientnewlanguage.org/ai/examples/603-the-migration-was-idempotent-and-the-order-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 603 — The migration was idempotent and the order was not

`the_migration_was_idempotent_and_the_order_was_not.eml` - A schema migration is twelve steps and every step is idempotent. It was replayed onto three shards and two of them ended up different. What idempotence covers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A schema
# migration is twelve steps and every step is idempotent. It was replayed onto
# three shards and two of them ended up different. What idempotence covers is
# computed below.
#
# Making each step idempotent is correct and it is the property that makes a
# migration operable. A step that can be rerun turns a partial failure into a
# retry instead of a restore, lets an operator resume from the middle without
# working out where the middle was, and makes the whole thing safe under an
# at-least-once runner. Every step here was tested for it, repeatedly.
#
# Idempotence is a property of one step against itself. A migration is a
# sequence, and a sequence has a second property that no individual step can
# carry: whether the steps commute.
#
# Both facts are true at once. Each step run twice leaves the same state, and
# two steps run in the other order do not.

12 => steps
50 => reruns_per_step
4 => order_sensitive_pairs
3 => shards

steps * reruns_per_step => idempotence_checks

"steps in the migration     : " + str(steps) ^0
"reruns tested per step     : " + str(reruns_per_step) ^0
"idempotence checks run     : " + str(idempotence_checks) ^0
"idempotence checks passed  : " + str(idempotence_checks) ^0
"idempotence failures       : 0" ^0
"" ^0

# ---- the property that was tested, and the one that was not ----

int(steps * (steps - 1) / 2) => ordered_pairs

"what was measured" ^0
"  step applied twice equals step applied once : " + str(steps) + " of " + str(steps) ^0
"  pairs of steps checked for commuting        : 0 of " + str(ordered_pairs) ^0
"" ^0
"  pairs that do not commute : " + str(order_sensitive_pairs) ^0
"  and none of the " + str(idempotence_checks) + " checks can observe one, because" ^0
"  every check runs a single step against itself" ^0
"" ^0

# ---- one non-commuting pair, both steps idempotent ----

"step 7  add column state, default null            rerun safe : yes" ^0
"step 9  set state to active where state is null   rerun safe : yes" ^0
"" ^0
"order    result" ^0
"  7 then 9   every existing row gets state active" ^0
"  9 then 7   the update finds no such column yet, is skipped by" ^0
"             the runner as already-applied, and every existing" ^0
"             row keeps state null" ^0
"" ^0
"  both orders complete, both report success, neither retries" ^0
"" ^0

# ---- why the shards disagreed ----
#
# The runner replays the migration log. It sorts the log by step id so a resume
# is deterministic, which is a reasonable thing to want. Two shards were
# resumed; one ran straight through.

2 => shards_resumed
shards - shards_resumed => shards_straight_through

"shard   path              order applied      final state" ^0
"  1     straight through  recorded order     state active" ^0
"  2     resumed           sorted by step id  state null" ^0
"  3     resumed           sorted by step id  state null" ^0
"" ^0
"  shards agreeing with shard 1 : " + str(shards_straight_through) ^0
"  shards differing             : " + str(shards_resumed) ^0
"  migration steps that failed  : 0" ^0
"  migration steps that retried : 0" ^0
"" ^0

# ---- the rows ----

4200000 => rows_per_shard
shards_resumed * rows_per_shard => rows_with_null_state
shards * rows_per_shard => rows_total

"rows per shard          : " + str(rows_per_shard) ^0
"rows in total           : " + str(rows_total) ^0
"rows left with state null : " + str(rows_with_null_state) ^0
"share of the table      : " + str(int(rows_with_null_state * 100 / rows_total)) + " percent" ^0
"" ^0
"  the migration is marked complete on all " + str(shards) + " shards" ^0
"" ^0

# ---- what a rerun does now ----
#
# The operator's instinct is right: the steps are idempotent, so run it again.
# Running it again on shard 2 changes nothing, because every step is already
# applied and each one is a no-op against its own result. Idempotence is
# working, and it is what makes the wrong state stable.

"rerunning the whole migration on shard 2" ^0
"  steps re-executed : " + str(steps) ^0
"  steps that changed anything : 0" ^0
"  rows repaired : 0" ^0
"" ^0
"  the property that makes a retry safe is the same property" ^0
"  that makes this retry useless" ^0
"" ^0

# ---- the control ----
#
# Idempotence, against what it was put there for. It was put there so a failed
# run could be resumed rather than restored, and it delivered that on every
# step, every time, including the two resumes that produced this.

"control - is idempotence holding" ^0
"  steps proven rerun-safe : " + str(steps) + " of " + str(steps) ^0
"  checks run              : " + str(idempotence_checks) ^0
"  check failures          : 0" ^0
"  restores required       : 0" ^0
"  defects in any step     : 0" ^0
"" ^0
"  without it the two resumes would have needed a restore each" ^0
"" ^0

# ---- the null control ----
#
# The same twelve steps, same idempotence, same two resumes, on a migration
# whose steps all commute. Sorting the log then reorders nothing that matters
# and all three shards land identically.

0 => nc_order_sensitive_pairs
0 => nc_shards_differing

"null control - the same runner where every pair commutes" ^0
"  order-sensitive pairs : " + str(nc_order_sensitive_pairs) ^0
"  shards resumed        : " + str(shards_resumed) ^0
"  shards differing      : " + str(nc_shards_differing) ^0
"  same sort, same resume, same idempotence" ^0
"  the runner did not become correct; the steps stopped caring" ^0
"" ^0

# ---- the rule ----

"what idempotence certifies" ^0
"  this step, applied again, changes nothing : yes, measured" ^0
"  this step, applied later, does the same   : not measured" ^0
"  the set of steps commutes                 : not measured, not implied" ^0
"  and a per-step property has no place to record a pair" ^0
"" ^0
"the missing test is not a longer rerun; it is two steps in the" ^0
"other order, and the number of those to check is " + str(ordered_pairs) ^0
"" ^0

"Every one of the " + str(steps) + " steps is idempotent and " + str(idempotence_checks) + " rerun checks confirm it" ^0
"with 0 failures, which is why two shards could be resumed without a restore." ^0
"The runner sorts the log by step id, " + str(order_sensitive_pairs) + " of the " + str(ordered_pairs) + " step pairs do not commute," ^0
"and " + str(rows_with_null_state) + " of " + str(rows_total) + " rows - " + str(int(rows_with_null_state * 100 / rows_total)) + " percent - now hold a value the" ^0
"migration was written to remove, on shards it reports as complete." ^0
```

## Python (deterministic transpilation)

```python
steps = 12
reruns_per_step = 50
order_sensitive_pairs = 4
shards = 3
idempotence_checks = steps * reruns_per_step
print("steps in the migration     : " + str(steps))
print("reruns tested per step     : " + str(reruns_per_step))
print("idempotence checks run     : " + str(idempotence_checks))
print("idempotence checks passed  : " + str(idempotence_checks))
print("idempotence failures       : 0")
print("")
ordered_pairs = int(steps * (steps - 1) / 2)
print("what was measured")
print("  step applied twice equals step applied once : " + str(steps) + " of " + str(steps))
print("  pairs of steps checked for commuting        : 0 of " + str(ordered_pairs))
print("")
print("  pairs that do not commute : " + str(order_sensitive_pairs))
print("  and none of the " + str(idempotence_checks) + " checks can observe one, because")
print("  every check runs a single step against itself")
print("")
print("step 7  add column state, default null            rerun safe : yes")
print("step 9  set state to active where state is null   rerun safe : yes")
print("")
print("order    result")
print("  7 then 9   every existing row gets state active")
print("  9 then 7   the update finds no such column yet, is skipped by")
print("             the runner as already-applied, and every existing")
print("             row keeps state null")
print("")
print("  both orders complete, both report success, neither retries")
print("")
shards_resumed = 2
shards_straight_through = shards - shards_resumed
print("shard   path              order applied      final state")
print("  1     straight through  recorded order     state active")
print("  2     resumed           sorted by step id  state null")
print("  3     resumed           sorted by step id  state null")
print("")
print("  shards agreeing with shard 1 : " + str(shards_straight_through))
print("  shards differing             : " + str(shards_resumed))
print("  migration steps that failed  : 0")
print("  migration steps that retried : 0")
print("")
rows_per_shard = 4200000
rows_with_null_state = shards_resumed * rows_per_shard
rows_total = shards * rows_per_shard
print("rows per shard          : " + str(rows_per_shard))
print("rows in total           : " + str(rows_total))
print("rows left with state null : " + str(rows_with_null_state))
print("share of the table      : " + str(int(rows_with_null_state * 100 / rows_total)) + " percent")
print("")
print("  the migration is marked complete on all " + str(shards) + " shards")
print("")
print("rerunning the whole migration on shard 2")
print("  steps re-executed : " + str(steps))
print("  steps that changed anything : 0")
print("  rows repaired : 0")
print("")
print("  the property that makes a retry safe is the same property")
print("  that makes this retry useless")
print("")
print("control - is idempotence holding")
print("  steps proven rerun-safe : " + str(steps) + " of " + str(steps))
print("  checks run              : " + str(idempotence_checks))
print("  check failures          : 0")
print("  restores required       : 0")
print("  defects in any step     : 0")
print("")
print("  without it the two resumes would have needed a restore each")
print("")
nc_order_sensitive_pairs = 0
nc_shards_differing = 0
print("null control - the same runner where every pair commutes")
print("  order-sensitive pairs : " + str(nc_order_sensitive_pairs))
print("  shards resumed        : " + str(shards_resumed))
print("  shards differing      : " + str(nc_shards_differing))
print("  same sort, same resume, same idempotence")
print("  the runner did not become correct; the steps stopped caring")
print("")
print("what idempotence certifies")
print("  this step, applied again, changes nothing : yes, measured")
print("  this step, applied later, does the same   : not measured")
print("  the set of steps commutes                 : not measured, not implied")
print("  and a per-step property has no place to record a pair")
print("")
print("the missing test is not a longer rerun; it is two steps in the")
print("other order, and the number of those to check is " + str(ordered_pairs))
print("")
print("Every one of the " + str(steps) + " steps is idempotent and " + str(idempotence_checks) + " rerun checks confirm it")
print("with 0 failures, which is why two shards could be resumed without a restore.")
print("The runner sorts the log by step id, " + str(order_sensitive_pairs) + " of the " + str(ordered_pairs) + " step pairs do not commute,")
print("and " + str(rows_with_null_state) + " of " + str(rows_total) + " rows - " + str(int(rows_with_null_state * 100 / rows_total)) + " percent - now hold a value the")
print("migration was written to remove, on shards it reports as complete.")
```

## stdout (executed)

```text
steps in the migration     : 12
reruns tested per step     : 50
idempotence checks run     : 600
idempotence checks passed  : 600
idempotence failures       : 0

what was measured
  step applied twice equals step applied once : 12 of 12
  pairs of steps checked for commuting        : 0 of 66

  pairs that do not commute : 4
  and none of the 600 checks can observe one, because
  every check runs a single step against itself

step 7  add column state, default null            rerun safe : yes
step 9  set state to active where state is null   rerun safe : yes

order    result
  7 then 9   every existing row gets state active
  9 then 7   the update finds no such column yet, is skipped by
             the runner as already-applied, and every existing
             row keeps state null

  both orders complete, both report success, neither retries

shard   path              order applied      final state
  1     straight through  recorded order     state active
  2     resumed           sorted by step id  state null
  3     resumed           sorted by step id  state null

  shards agreeing with shard 1 : 1
  shards differing             : 2
  migration steps that failed  : 0
  migration steps that retried : 0

rows per shard          : 4200000
rows in total           : 12600000
rows left with state null : 8400000
share of the table      : 66 percent

  the migration is marked complete on all 3 shards

rerunning the whole migration on shard 2
  steps re-executed : 12
  steps that changed anything : 0
  rows repaired : 0

  the property that makes a retry safe is the same property
  that makes this retry useless

control - is idempotence holding
  steps proven rerun-safe : 12 of 12
  checks run              : 600
  check failures          : 0
  restores required       : 0
  defects in any step     : 0

  without it the two resumes would have needed a restore each

null control - the same runner where every pair commutes
  order-sensitive pairs : 0
  shards resumed        : 2
  shards differing      : 0
  same sort, same resume, same idempotence
  the runner did not become correct; the steps stopped caring

what idempotence certifies
  this step, applied again, changes nothing : yes, measured
  this step, applied later, does the same   : not measured
  the set of steps commutes                 : not measured, not implied
  and a per-step property has no place to record a pair

the missing test is not a longer rerun; it is two steps in the
other order, and the number of those to check is 66

Every one of the 12 steps is idempotent and 600 rerun checks confirm it
with 0 failures, which is why two shards could be resumed without a restore.
The runner sorts the log by step id, 4 of the 66 step pairs do not commute,
and 8400000 of 12600000 rows - 66 percent - now hold a value the
migration was written to remove, on shards it reports as complete.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
