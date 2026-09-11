<!-- canonical: efficientnewlanguage.org/ai/examples/794-the-cursor-was-saved-after-the-effect | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 794 — The cursor was saved after the effect

`the_cursor_was_saved_after_the_effect.eml` - The poller has processed every record in order without skipping one, and the ordering is correct. What the saved cursor and the effect straddle is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The poller has
# processed every record in order without skipping one, and the ordering is
# correct. What the saved cursor and the effect straddle is computed below.
#
# The poller is careful. It reads a batch in order; it never advances the cursor
# past a record it has not handled; it resumes from the saved cursor on restart;
# and it never skips, so no record is lost.
#
# The cursor is saved after the batch's effects, and the two are not atomic.

800000 => records_processed
500 => batch_size
12 => crashes_between_the_effect_and_the_save

crashes_between_the_effect_and_the_save * batch_size => records_replayed
records_processed + records_replayed => effects_applied
effects_applied - records_processed => duplicate_effects
int(duplicate_effects * 10000 / records_processed) => duplicate_effect_per_myriad
0 => records_skipped

"records processed               : " + str(records_processed) ^0
"  skipped                       : " + str(records_skipped) ^0
"batch size                      : " + str(batch_size) ^0
"crashes between effect and save : " + str(crashes_between_the_effect_and_the_save) ^0
"records replayed                : " + str(records_replayed) ^0
"" ^0
"effects applied                 : " + str(effects_applied) ^0
"  duplicate effects             : " + str(duplicate_effects) ^0
"duplicate effect rate           : " + str(duplicate_effect_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the poller verified ----

"the poller" ^0
"  reads : a batch, in order" ^0
"  the cursor : never advances past an unhandled record" ^0
"  on restart : resumes from the saved cursor" ^0
"  skips : none, so no record is lost" ^0
"  records missed : " + str(records_skipped) ^0
"  verdict : NONE LOST, IN ORDER" ^0
"" ^0
"  never advancing past an unhandled record is the part" ^0
"  done right here, and it is why nothing is skipped" ^0
"" ^0

# ---- where the crash lands ----

"the order of the two writes" ^0
"  first : the batch's effects are applied" ^0
"  then : the cursor is saved past the batch" ^0
"  between them : a window with no atomicity" ^0
"  a crash in that window : loses the cursor save, keeps" ^0
"    the effects" ^0
"  on resume : the batch is read again and its effects" ^0
"    reapplied" ^0
"  records replayed per crash : " + str(batch_size) + ", the whole batch" ^0
"" ^0

# ---- what a downstream count sees ----

"the downstream of the effect" ^0
"  records the poller believes it processed : " ^0
"    " + str(records_processed) ^0
"  effects that actually landed : " + str(effects_applied) ^0
"  duplicates : " + str(duplicate_effects) ^0
"  was a record skipped : no; not-lost is the property" ^0
"    the poller guarantees" ^0
"  was a record applied twice : yes, a batch per crash," ^0
"    " + str(duplicate_effect_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same crashes, with the effect and the cursor advance written in one
# transaction so they commit or roll back together.
12 => nc_crashes
0 => nc_duplicate_effects
0 => nc_records_skipped

"null control - effect and cursor in one transaction" ^0
"  crashes : " + str(nc_crashes) + ", unchanged" ^0
"  duplicate effects : " + str(nc_duplicate_effects) ^0
"  records skipped : " + str(nc_records_skipped) ^0
"  no crash and no ordering changed; the effect and the" ^0
"  cursor stopped being two writes with a gap between them" ^0
"" ^0

# ---- the rule ----

"what a never-skipping poller guarantees" ^0
"  no record is lost : exactly, the cursor never passes an" ^0
"    unhandled record and resume reads from it" ^0
"  each record is processed once : not addressed; the" ^0
"    cursor is advanced after the effect and not atomically" ^0
"    with it, so a crash in the gap replays the batch - " ^0
"    " + str(crashes_between_the_effect_and_the_save) + " crashes reapplied " + str(duplicate_effects) + " effects" ^0
"" ^0

"at-least-once and at-most-once are two guarantees, and a cursor saved after the" ^0
"effect buys the first by giving up the second; exactly-once needs the effect" ^0
"and the checkpoint to be the same commit, not two in an order" ^0
"" ^0

"The poller never skips: the cursor trails the handled record and resume reads" ^0
"from it - nothing is lost. The cursor saves after the effects, not atomically," ^0
"so " + str(crashes_between_the_effect_and_the_save) + " crashes replayed a batch each, " + str(duplicate_effects) + " duplicate effects, " ^0
"" + str(duplicate_effect_per_myriad) + " per ten thousand, against " + str(records_skipped) + " skipped." ^0
```

## Python (deterministic transpilation)

```python
records_processed = 800000
batch_size = 500
crashes_between_the_effect_and_the_save = 12
records_replayed = crashes_between_the_effect_and_the_save * batch_size
effects_applied = records_processed + records_replayed
duplicate_effects = effects_applied - records_processed
duplicate_effect_per_myriad = int(duplicate_effects * 10000 / records_processed)
records_skipped = 0
print("records processed               : " + str(records_processed))
print("  skipped                       : " + str(records_skipped))
print("batch size                      : " + str(batch_size))
print("crashes between effect and save : " + str(crashes_between_the_effect_and_the_save))
print("records replayed                : " + str(records_replayed))
print("")
print("effects applied                 : " + str(effects_applied))
print("  duplicate effects             : " + str(duplicate_effects))
print("duplicate effect rate           : " + str(duplicate_effect_per_myriad) + " per ten thousand")
print("")
print("the poller")
print("  reads : a batch, in order")
print("  the cursor : never advances past an unhandled record")
print("  on restart : resumes from the saved cursor")
print("  skips : none, so no record is lost")
print("  records missed : " + str(records_skipped))
print("  verdict : NONE LOST, IN ORDER")
print("")
print("  never advancing past an unhandled record is the part")
print("  done right here, and it is why nothing is skipped")
print("")
print("the order of the two writes")
print("  first : the batch's effects are applied")
print("  then : the cursor is saved past the batch")
print("  between them : a window with no atomicity")
print("  a crash in that window : loses the cursor save, keeps")
print("    the effects")
print("  on resume : the batch is read again and its effects")
print("    reapplied")
print("  records replayed per crash : " + str(batch_size) + ", the whole batch")
print("")
print("the downstream of the effect")
print("  records the poller believes it processed : ")
print("    " + str(records_processed))
print("  effects that actually landed : " + str(effects_applied))
print("  duplicates : " + str(duplicate_effects))
print("  was a record skipped : no; not-lost is the property")
print("    the poller guarantees")
print("  was a record applied twice : yes, a batch per crash,")
print("    " + str(duplicate_effect_per_myriad) + " per ten thousand")
print("")
nc_crashes = 12
nc_duplicate_effects = 0
nc_records_skipped = 0
print("null control - effect and cursor in one transaction")
print("  crashes : " + str(nc_crashes) + ", unchanged")
print("  duplicate effects : " + str(nc_duplicate_effects))
print("  records skipped : " + str(nc_records_skipped))
print("  no crash and no ordering changed; the effect and the")
print("  cursor stopped being two writes with a gap between them")
print("")
print("what a never-skipping poller guarantees")
print("  no record is lost : exactly, the cursor never passes an")
print("    unhandled record and resume reads from it")
print("  each record is processed once : not addressed; the")
print("    cursor is advanced after the effect and not atomically")
print("    with it, so a crash in the gap replays the batch - ")
print("    " + str(crashes_between_the_effect_and_the_save) + " crashes reapplied " + str(duplicate_effects) + " effects")
print("")
print("at-least-once and at-most-once are two guarantees, and a cursor saved after the")
print("effect buys the first by giving up the second; exactly-once needs the effect")
print("and the checkpoint to be the same commit, not two in an order")
print("")
print("The poller never skips: the cursor trails the handled record and resume reads")
print("from it - nothing is lost. The cursor saves after the effects, not atomically,")
print("so " + str(crashes_between_the_effect_and_the_save) + " crashes replayed a batch each, " + str(duplicate_effects) + " duplicate effects, ")
print("" + str(duplicate_effect_per_myriad) + " per ten thousand, against " + str(records_skipped) + " skipped.")
```

## stdout (executed)

```text
records processed               : 800000
  skipped                       : 0
batch size                      : 500
crashes between effect and save : 12
records replayed                : 6000

effects applied                 : 806000
  duplicate effects             : 6000
duplicate effect rate           : 75 per ten thousand

the poller
  reads : a batch, in order
  the cursor : never advances past an unhandled record
  on restart : resumes from the saved cursor
  skips : none, so no record is lost
  records missed : 0
  verdict : NONE LOST, IN ORDER

  never advancing past an unhandled record is the part
  done right here, and it is why nothing is skipped

the order of the two writes
  first : the batch's effects are applied
  then : the cursor is saved past the batch
  between them : a window with no atomicity
  a crash in that window : loses the cursor save, keeps
    the effects
  on resume : the batch is read again and its effects
    reapplied
  records replayed per crash : 500, the whole batch

the downstream of the effect
  records the poller believes it processed : 
    800000
  effects that actually landed : 806000
  duplicates : 6000
  was a record skipped : no; not-lost is the property
    the poller guarantees
  was a record applied twice : yes, a batch per crash,
    75 per ten thousand

null control - effect and cursor in one transaction
  crashes : 12, unchanged
  duplicate effects : 0
  records skipped : 0
  no crash and no ordering changed; the effect and the
  cursor stopped being two writes with a gap between them

what a never-skipping poller guarantees
  no record is lost : exactly, the cursor never passes an
    unhandled record and resume reads from it
  each record is processed once : not addressed; the
    cursor is advanced after the effect and not atomically
    with it, so a crash in the gap replays the batch - 
    12 crashes reapplied 6000 effects

at-least-once and at-most-once are two guarantees, and a cursor saved after the
effect buys the first by giving up the second; exactly-once needs the effect
and the checkpoint to be the same commit, not two in an order

The poller never skips: the cursor trails the handled record and resume reads
from it - nothing is lost. The cursor saves after the effects, not atomically,
so 12 crashes replayed a batch each, 6000 duplicate effects, 
75 per ten thousand, against 0 skipped.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
