<!-- canonical: efficientnewlanguage.org/ai/examples/638-the-log-said-success-and-the-exit-code-was-never-read | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 638 — The log said success and the exit code was never read

`the_log_said_success_and_the_exit_code_was_never_read.eml` - Every nightly run in the quarter reported success, and the line it reported is true. How many rows those runs exported is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every nightly run
# in the quarter reported success, and the line it reported is true. How many
# rows those runs exported is computed below.
#
# The job is a shell pipeline: read, transform, write. The wrapper decides
# success by checking that the last stage printed its completion line, and the
# last stage does print it, every night, honestly. It writes what it was handed
# and says how much.
#
# A pipeline's exit status is the LAST stage's. Without pipefail an earlier
# stage can die and the shell still reports zero, and the last stage cannot tell
# a stream that ended from a stream that finished.
#
# The middle stage was killed for memory on thirty-one nights. Each of those
# nights the writer received a short stream, wrote all of it, and said so.

214 => nightly_runs_in_the_quarter
31 => runs_where_a_stage_was_killed
1240000 => rows_on_a_clean_run
486000 => mean_rows_on_a_killed_run
0 => alerts_fired

nightly_runs_in_the_quarter - runs_where_a_stage_was_killed => clean_runs
rows_on_a_clean_run - mean_rows_on_a_killed_run => rows_lost_per_killed_run
runs_where_a_stage_was_killed * rows_lost_per_killed_run => rows_never_exported

"nightly runs in the quarter : " + str(nightly_runs_in_the_quarter) ^0
"reported success            : " + str(nightly_runs_in_the_quarter) ^0
"a stage was killed on       : " + str(runs_where_a_stage_was_killed) ^0
"rows on a clean run         : " + str(rows_on_a_clean_run) ^0
"mean rows on a killed run   : " + str(mean_rows_on_a_killed_run) ^0
"rows never exported         : " + str(rows_never_exported) ^0
"" ^0

# ---- what the wrapper verified ----

"the success condition" ^0
"  last line matches 'export complete' : yes, all " + str(nightly_runs_in_the_quarter) ^0
"  the writer printed it                : truthfully" ^0
"  the count in that line               : correct for what" ^0
"    the writer received" ^0
"  alerts fired                         : " + str(alerts_fired) ^0
"" ^0
"  no line in the log is false; the writer reported exactly" ^0
"  what it wrote" ^0
"" ^0

# ---- what the shell reported ----

"the pipeline's status" ^0
"  stage 1 read      : exit 0" ^0
"  stage 2 transform : killed, exit 137, on " + str(runs_where_a_stage_was_killed) + " nights" ^0
"  stage 3 write     : exit 0, every night" ^0
"  the shell's status : stage 3's" ^0
"  pipefail set       : no" ^0
"" ^0
"  the status the wrapper would have read is the one the" ^0
"  wrapper does not read, and it was zero anyway" ^0
"" ^0

int(runs_where_a_stage_was_killed * 10000 / nightly_runs_in_the_quarter) => killed_per_myriad
"share of nights with a killed stage : " + str(killed_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why the count did not give it away ----

# The exported row count varies legitimately with volume, so a short night sits
# inside the range a quiet Sunday produces. Nobody set a floor because the
# number that would set it is the input count, which no stage reports.
"the number that would have shown it" ^0
"  rows the writer reported : " + str(mean_rows_on_a_killed_run) + " on a short night" ^0
"  rows the reader read     : not reported by any stage" ^0
"  a floor on the output    : would fire on quiet Sundays too" ^0
"  a comparison of the two  : nothing computes it" ^0
"" ^0

# ---- null control ----

# The same pipeline with pipefail set and the reader's count compared to the
# writer's.
0 => nc_runs_reported_success_wrongly
runs_where_a_stage_was_killed => nc_runs_that_failed_loudly

"null control - pipefail set, counts compared" ^0
"  runs reporting success wrongly : " + str(nc_runs_reported_success_wrongly) ^0
"  runs failing loudly            : " + str(nc_runs_that_failed_loudly) ^0
"  the writer's line did not become less true; a second" ^0
"  number arrived for it to disagree with" ^0
"" ^0

# ---- the rule ----

"what a success line in a log guarantees" ^0
"  the stage that printed it finished : exactly" ^0
"  the work finished                  : not addressed; a" ^0
"    stage reports on its own input, and a truncated input" ^0
"    is a complete input as far as it can tell" ^0
"" ^0
"the last stage is the one most likely to succeed and the one" ^0
"whose success means least; a status that is not read is not a" ^0
"weaker check than one that is, it is not a check" ^0
"" ^0

"Every one of " + str(nightly_runs_in_the_quarter) + " runs reported success and every success line is true: the" ^0
"writer finished and counted what it received. On " + str(runs_where_a_stage_was_killed) + " nights - " + str(killed_per_myriad) + " per ten" ^0
"thousand - the transform was killed at exit 137 and the shell reported the" ^0
"writer's zero instead, so " + str(rows_never_exported) + " rows were never exported, " + str(alerts_fired) + " alerts fired," ^0
"and the only number that would have shown it is one no stage prints." ^0
```

## Python (deterministic transpilation)

```python
nightly_runs_in_the_quarter = 214
runs_where_a_stage_was_killed = 31
rows_on_a_clean_run = 1240000
mean_rows_on_a_killed_run = 486000
alerts_fired = 0
clean_runs = nightly_runs_in_the_quarter - runs_where_a_stage_was_killed
rows_lost_per_killed_run = rows_on_a_clean_run - mean_rows_on_a_killed_run
rows_never_exported = runs_where_a_stage_was_killed * rows_lost_per_killed_run
print("nightly runs in the quarter : " + str(nightly_runs_in_the_quarter))
print("reported success            : " + str(nightly_runs_in_the_quarter))
print("a stage was killed on       : " + str(runs_where_a_stage_was_killed))
print("rows on a clean run         : " + str(rows_on_a_clean_run))
print("mean rows on a killed run   : " + str(mean_rows_on_a_killed_run))
print("rows never exported         : " + str(rows_never_exported))
print("")
print("the success condition")
print("  last line matches 'export complete' : yes, all " + str(nightly_runs_in_the_quarter))
print("  the writer printed it                : truthfully")
print("  the count in that line               : correct for what")
print("    the writer received")
print("  alerts fired                         : " + str(alerts_fired))
print("")
print("  no line in the log is false; the writer reported exactly")
print("  what it wrote")
print("")
print("the pipeline's status")
print("  stage 1 read      : exit 0")
print("  stage 2 transform : killed, exit 137, on " + str(runs_where_a_stage_was_killed) + " nights")
print("  stage 3 write     : exit 0, every night")
print("  the shell's status : stage 3's")
print("  pipefail set       : no")
print("")
print("  the status the wrapper would have read is the one the")
print("  wrapper does not read, and it was zero anyway")
print("")
killed_per_myriad = int(runs_where_a_stage_was_killed * 10000 / nightly_runs_in_the_quarter)
print("share of nights with a killed stage : " + str(killed_per_myriad) + " per ten thousand")
print("")
print("the number that would have shown it")
print("  rows the writer reported : " + str(mean_rows_on_a_killed_run) + " on a short night")
print("  rows the reader read     : not reported by any stage")
print("  a floor on the output    : would fire on quiet Sundays too")
print("  a comparison of the two  : nothing computes it")
print("")
nc_runs_reported_success_wrongly = 0
nc_runs_that_failed_loudly = runs_where_a_stage_was_killed
print("null control - pipefail set, counts compared")
print("  runs reporting success wrongly : " + str(nc_runs_reported_success_wrongly))
print("  runs failing loudly            : " + str(nc_runs_that_failed_loudly))
print("  the writer's line did not become less true; a second")
print("  number arrived for it to disagree with")
print("")
print("what a success line in a log guarantees")
print("  the stage that printed it finished : exactly")
print("  the work finished                  : not addressed; a")
print("    stage reports on its own input, and a truncated input")
print("    is a complete input as far as it can tell")
print("")
print("the last stage is the one most likely to succeed and the one")
print("whose success means least; a status that is not read is not a")
print("weaker check than one that is, it is not a check")
print("")
print("Every one of " + str(nightly_runs_in_the_quarter) + " runs reported success and every success line is true: the")
print("writer finished and counted what it received. On " + str(runs_where_a_stage_was_killed) + " nights - " + str(killed_per_myriad) + " per ten")
print("thousand - the transform was killed at exit 137 and the shell reported the")
print("writer's zero instead, so " + str(rows_never_exported) + " rows were never exported, " + str(alerts_fired) + " alerts fired,")
print("and the only number that would have shown it is one no stage prints.")
```

## stdout (executed)

```text
nightly runs in the quarter : 214
reported success            : 214
a stage was killed on       : 31
rows on a clean run         : 1240000
mean rows on a killed run   : 486000
rows never exported         : 23374000

the success condition
  last line matches 'export complete' : yes, all 214
  the writer printed it                : truthfully
  the count in that line               : correct for what
    the writer received
  alerts fired                         : 0

  no line in the log is false; the writer reported exactly
  what it wrote

the pipeline's status
  stage 1 read      : exit 0
  stage 2 transform : killed, exit 137, on 31 nights
  stage 3 write     : exit 0, every night
  the shell's status : stage 3's
  pipefail set       : no

  the status the wrapper would have read is the one the
  wrapper does not read, and it was zero anyway

share of nights with a killed stage : 1448 per ten thousand

the number that would have shown it
  rows the writer reported : 486000 on a short night
  rows the reader read     : not reported by any stage
  a floor on the output    : would fire on quiet Sundays too
  a comparison of the two  : nothing computes it

null control - pipefail set, counts compared
  runs reporting success wrongly : 0
  runs failing loudly            : 31
  the writer's line did not become less true; a second
  number arrived for it to disagree with

what a success line in a log guarantees
  the stage that printed it finished : exactly
  the work finished                  : not addressed; a
    stage reports on its own input, and a truncated input
    is a complete input as far as it can tell

the last stage is the one most likely to succeed and the one
whose success means least; a status that is not read is not a
weaker check than one that is, it is not a check

Every one of 214 runs reported success and every success line is true: the
writer finished and counted what it received. On 31 nights - 1448 per ten
thousand - the transform was killed at exit 137 and the shell reported the
writer's zero instead, so 23374000 rows were never exported, 0 alerts fired,
and the only number that would have shown it is one no stage prints.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
