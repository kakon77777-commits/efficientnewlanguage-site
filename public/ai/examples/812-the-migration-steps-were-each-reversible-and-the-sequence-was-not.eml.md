<!-- canonical: efficientnewlanguage.org/ai/examples/812-the-migration-steps-were-each-reversible-and-the-sequence-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 812 — The migration steps were each reversible and the sequence was not

`the_migration_steps_were_each_reversible_and_the_sequence_was_not.eml` - Every step of the migration ships with a down-migration, and each reverse is correct on its own. What happens when the sequence is rolled back is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every step of the
# migration ships with a down-migration, and each reverse is correct on its own.
# What happens when the sequence is rolled back is computed below.
#
# The migration is disciplined per step. Each of the five steps has a reverse;
# each reverse was tested by applying the step and undoing it in isolation; the
# reverses run in the opposite order; and no step is marked irreversible.
#
# Step three drops a column that step five's reverse needs to restore data.

5 => steps
5 => steps_with_a_tested_reverse
3 => the_step_that_drops_the_column
5 => the_step_whose_reverse_needs_it
74000 => rows_whose_data_lived_in_that_column

steps - steps_with_a_tested_reverse => steps_marked_irreversible
the_step_whose_reverse_needs_it - the_step_that_drops_the_column => steps_between_the_drop_and_the_need
int(rows_whose_data_lived_in_that_column * 10000 / 74000) => rows_unrecoverable_per_myriad_of_themselves
0 => sequences_with_a_reverse

"steps                           : " + str(steps) ^0
"  each with a tested reverse    : " + str(steps_with_a_tested_reverse) ^0
"  marked irreversible           : " + str(steps_marked_irreversible) ^0
"the step that drops the column  : " + str(the_step_that_drops_the_column) ^0
"the step whose reverse needs it : " + str(the_step_whose_reverse_needs_it) ^0
"  steps between them            : " + str(steps_between_the_drop_and_the_need) ^0
"" ^0
"rows whose data lived there     : " + str(rows_whose_data_lived_in_that_column) ^0
"reverses for the whole sequence : " + str(sequences_with_a_reverse) ^0
"" ^0

# ---- what each step verified ----

"the per-step reversibility" ^0
"  each step : ships with a down-migration" ^0
"  each reverse : tested by apply-then-undo in isolation" ^0
"  reverses run : in the opposite order" ^0
"  steps marked irreversible : " + str(steps_marked_irreversible) ^0
"  steps with a working reverse : " + str(steps_with_a_tested_reverse) ^0
"  verdict : EVERY STEP REVERSIBLE" ^0
"" ^0
"  testing each reverse in isolation is the part done" ^0
"  right here, and it is why no single step is a trap" ^0
"" ^0

# ---- what the isolation misses ----

"the reverse tested alone" ^0
"  what step three's reverse restores : the column, empty" ^0
"  what filled that column before : data step three" ^0
"    dropped" ^0
"  what step five's reverse then needs : that data, to" ^0
"    rebuild its own table" ^0
"  in isolation : step five's reverse was tested with the" ^0
"    column still present, so it passed" ^0
"  in sequence : the column is gone by the time it runs" ^0
"" ^0

# ---- what a full rollback loses ----

"rolling the whole sequence back" ^0
"  steps five then four then three : run in reverse" ^0
"  what step three's reverse cannot bring back : the" ^0
"    dropped data, only the empty column" ^0
"  rows step five's reverse cannot rebuild : " ^0
"    " + str(rows_whose_data_lived_in_that_column) ^0
"  did any single reverse fail its own test : no" ^0
"  what failed : the composition, which no step tested" ^0
"" ^0

# ---- null control ----

# The same five steps, with step three archiving the column's data before
# dropping it so a later reverse can read it back.
0 => nc_rows_lost_with_the_archive
74000 => nc_rows_lost_without_it
1 => nc_reverses_that_gain_a_dependency

"null control - step three archives before it drops" ^0
"  rows lost with the archive : " + str(nc_rows_lost_with_the_archive) ^0
"  rows lost without it : " + str(nc_rows_lost_without_it) ^0
"  reverses that gain a dependency : " ^0
"    " + str(nc_reverses_that_gain_a_dependency) ^0
"  no step and no order changed; the dropped data stopped" ^0
"  being unrecoverable when a later reverse asks for it" ^0
"" ^0

# ---- the rule ----

"what per-step reversibility guarantees" ^0
"  each step can be undone in isolation : exactly, five of" ^0
"    five, tested apply-then-undo, none irreversible" ^0
"  the migration can be rolled back : not addressed; each" ^0
"    step has a reverse, and reversibility does not compose" ^0
"    - step three drops a column step five needs, so rolling" ^0
"    back the whole sequence cannot restore " + str(rows_whose_data_lived_in_that_column) + " rows" ^0
"" ^0

"reversibility is a property of a step against the state it was tested in, and a" ^0
"sequence puts each step in a state its test never saw; an earlier step can" ^0
"destroy what a later step's reverse depends on" ^0
"" ^0

"Every step ships a reverse, each tested apply-then-undo in isolation - none" ^0
"irreversible. Step three drops a column step five's reverse needs, and" ^0
"reversibility does not compose, so a full rollback restores an empty column and" ^0
"loses " + str(rows_whose_data_lived_in_that_column) + " rows, under " + str(sequences_with_a_reverse) + " reverse for the sequence as a whole." ^0
```

## Python (deterministic transpilation)

```python
steps = 5
steps_with_a_tested_reverse = 5
the_step_that_drops_the_column = 3
the_step_whose_reverse_needs_it = 5
rows_whose_data_lived_in_that_column = 74000
steps_marked_irreversible = steps - steps_with_a_tested_reverse
steps_between_the_drop_and_the_need = the_step_whose_reverse_needs_it - the_step_that_drops_the_column
rows_unrecoverable_per_myriad_of_themselves = int(rows_whose_data_lived_in_that_column * 10000 / 74000)
sequences_with_a_reverse = 0
print("steps                           : " + str(steps))
print("  each with a tested reverse    : " + str(steps_with_a_tested_reverse))
print("  marked irreversible           : " + str(steps_marked_irreversible))
print("the step that drops the column  : " + str(the_step_that_drops_the_column))
print("the step whose reverse needs it : " + str(the_step_whose_reverse_needs_it))
print("  steps between them            : " + str(steps_between_the_drop_and_the_need))
print("")
print("rows whose data lived there     : " + str(rows_whose_data_lived_in_that_column))
print("reverses for the whole sequence : " + str(sequences_with_a_reverse))
print("")
print("the per-step reversibility")
print("  each step : ships with a down-migration")
print("  each reverse : tested by apply-then-undo in isolation")
print("  reverses run : in the opposite order")
print("  steps marked irreversible : " + str(steps_marked_irreversible))
print("  steps with a working reverse : " + str(steps_with_a_tested_reverse))
print("  verdict : EVERY STEP REVERSIBLE")
print("")
print("  testing each reverse in isolation is the part done")
print("  right here, and it is why no single step is a trap")
print("")
print("the reverse tested alone")
print("  what step three's reverse restores : the column, empty")
print("  what filled that column before : data step three")
print("    dropped")
print("  what step five's reverse then needs : that data, to")
print("    rebuild its own table")
print("  in isolation : step five's reverse was tested with the")
print("    column still present, so it passed")
print("  in sequence : the column is gone by the time it runs")
print("")
print("rolling the whole sequence back")
print("  steps five then four then three : run in reverse")
print("  what step three's reverse cannot bring back : the")
print("    dropped data, only the empty column")
print("  rows step five's reverse cannot rebuild : ")
print("    " + str(rows_whose_data_lived_in_that_column))
print("  did any single reverse fail its own test : no")
print("  what failed : the composition, which no step tested")
print("")
nc_rows_lost_with_the_archive = 0
nc_rows_lost_without_it = 74000
nc_reverses_that_gain_a_dependency = 1
print("null control - step three archives before it drops")
print("  rows lost with the archive : " + str(nc_rows_lost_with_the_archive))
print("  rows lost without it : " + str(nc_rows_lost_without_it))
print("  reverses that gain a dependency : ")
print("    " + str(nc_reverses_that_gain_a_dependency))
print("  no step and no order changed; the dropped data stopped")
print("  being unrecoverable when a later reverse asks for it")
print("")
print("what per-step reversibility guarantees")
print("  each step can be undone in isolation : exactly, five of")
print("    five, tested apply-then-undo, none irreversible")
print("  the migration can be rolled back : not addressed; each")
print("    step has a reverse, and reversibility does not compose")
print("    - step three drops a column step five needs, so rolling")
print("    back the whole sequence cannot restore " + str(rows_whose_data_lived_in_that_column) + " rows")
print("")
print("reversibility is a property of a step against the state it was tested in, and a")
print("sequence puts each step in a state its test never saw; an earlier step can")
print("destroy what a later step's reverse depends on")
print("")
print("Every step ships a reverse, each tested apply-then-undo in isolation - none")
print("irreversible. Step three drops a column step five's reverse needs, and")
print("reversibility does not compose, so a full rollback restores an empty column and")
print("loses " + str(rows_whose_data_lived_in_that_column) + " rows, under " + str(sequences_with_a_reverse) + " reverse for the sequence as a whole.")
```

## stdout (executed)

```text
steps                           : 5
  each with a tested reverse    : 5
  marked irreversible           : 0
the step that drops the column  : 3
the step whose reverse needs it : 5
  steps between them            : 2

rows whose data lived there     : 74000
reverses for the whole sequence : 0

the per-step reversibility
  each step : ships with a down-migration
  each reverse : tested by apply-then-undo in isolation
  reverses run : in the opposite order
  steps marked irreversible : 0
  steps with a working reverse : 5
  verdict : EVERY STEP REVERSIBLE

  testing each reverse in isolation is the part done
  right here, and it is why no single step is a trap

the reverse tested alone
  what step three's reverse restores : the column, empty
  what filled that column before : data step three
    dropped
  what step five's reverse then needs : that data, to
    rebuild its own table
  in isolation : step five's reverse was tested with the
    column still present, so it passed
  in sequence : the column is gone by the time it runs

rolling the whole sequence back
  steps five then four then three : run in reverse
  what step three's reverse cannot bring back : the
    dropped data, only the empty column
  rows step five's reverse cannot rebuild : 
    74000
  did any single reverse fail its own test : no
  what failed : the composition, which no step tested

null control - step three archives before it drops
  rows lost with the archive : 0
  rows lost without it : 74000
  reverses that gain a dependency : 
    1
  no step and no order changed; the dropped data stopped
  being unrecoverable when a later reverse asks for it

what per-step reversibility guarantees
  each step can be undone in isolation : exactly, five of
    five, tested apply-then-undo, none irreversible
  the migration can be rolled back : not addressed; each
    step has a reverse, and reversibility does not compose
    - step three drops a column step five needs, so rolling
    back the whole sequence cannot restore 74000 rows

reversibility is a property of a step against the state it was tested in, and a
sequence puts each step in a state its test never saw; an earlier step can
destroy what a later step's reverse depends on

Every step ships a reverse, each tested apply-then-undo in isolation - none
irreversible. Step three drops a column step five's reverse needs, and
reversibility does not compose, so a full rollback restores an empty column and
loses 74000 rows, under 0 reverse for the sequence as a whole.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
