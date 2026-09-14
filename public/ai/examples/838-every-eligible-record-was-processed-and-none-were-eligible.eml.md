<!-- canonical: efficientnewlanguage.org/ai/examples/838-every-eligible-record-was-processed-and-none-were-eligible | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 838 — Every eligible record was processed and none were eligible

`every_eligible_record_was_processed_and_none_were_eligible.eml` - The nightly job reports 100 per hundred of eligible records processed, and the count is honest. How many records were eligible is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The nightly job
# reports 100 per hundred of eligible records processed, and the count is honest.
# How many records were eligible is computed below.
#
# The job is careful. It computes eligibility from the real rule, not a stale
# flag; it processes every eligible record it finds; it reports the ratio of
# processed to eligible; and a ratio below 100 pages on-call.
#
# The eligibility filter matched zero records this run, and a ratio of zero over
# zero is reported as complete.

500000 => records_scanned
0 => records_eligible
0 => records_processed
100 => reported_completion_per_hundred
0 => alerts_that_fired

records_scanned - records_eligible => records_the_filter_excluded
1200 => records_that_were_truly_eligible_but_the_filter_missed

"records scanned                 : " + str(records_scanned) ^0
"records eligible (by the filter): " + str(records_eligible) ^0
"records processed               : " + str(records_processed) ^0
"reported completion             : " + str(reported_completion_per_hundred) + " per hundred" ^0
"alerts that fired               : " + str(alerts_that_fired) ^0
"" ^0
"records the filter excluded     : " + str(records_the_filter_excluded) ^0
"records truly eligible, missed  : " + str(records_that_were_truly_eligible_but_the_filter_missed) ^0
"" ^0

# ---- what the job verified ----

"the completion metric" ^0
"  eligibility : from the real rule, not a stale flag" ^0
"  processes : every eligible record it finds" ^0
"  reports : processed over eligible" ^0
"  pages when : the ratio is below 100" ^0
"  eligible records left unprocessed : 0" ^0
"  verdict : 100 PER HUNDRED COMPLETE" ^0
"" ^0
"  paging on a ratio below 100 is the part done right" ^0
"  here, and it is why a real shortfall would alert" ^0
"" ^0

# ---- what the ratio is over ----

"processed over eligible" ^0
"  eligible this run : " + str(records_eligible) ^0
"  processed this run : " + str(records_processed) ^0
"  the ratio : zero over zero, reported as complete" ^0
"  what 100 per hundred of nothing means : every one of" ^0
"    no records, which is trivially all of them" ^0
"  what it does not mean : that the work was done" ^0
"" ^0

# ---- why the set was empty ----

"the eligibility filter" ^0
"  what it matched this run : " + str(records_eligible) ^0
"  why : a predicate that excludes everything after an" ^0
"    upstream schema change renamed the field it reads" ^0
"  records that were truly eligible : " ^0
"    " + str(records_that_were_truly_eligible_but_the_filter_missed) ^0
"  did the ratio notice they were skipped : no; they were" ^0
"    never in the denominator" ^0
"  is the completion figure false : no; it is vacuously" ^0
"    true" ^0
"" ^0

# ---- null control ----

# The same run, with the metric refusing to report completion when the eligible
# set is empty, and alerting on an eligible count that drops to zero.
100 => nc_completion_when_empty_is_100
0 => nc_completion_when_empty_is_undefined
1 => nc_alerts_on_zero_eligible

"null control - an empty eligible set is not 100 percent" ^0
"  completion when empty reads as 100 : " ^0
"    " + str(nc_completion_when_empty_is_100) ^0
"  completion when empty is undefined : " ^0
"    " + str(nc_completion_when_empty_is_undefined) ^0
"  alerts on zero eligible : " + str(nc_alerts_on_zero_eligible) ^0
"  no record changed; an empty denominator stopped being" ^0
"  reported as a finished job" ^0
"" ^0

# ---- the rule ----

"what 100 per hundred processed guarantees" ^0
"  every eligible record was processed : exactly, none was" ^0
"    left unprocessed" ^0
"  the work was done : not addressed; the eligible set was" ^0
"    empty, and 'all of an empty set' is vacuously true - " ^0
"    " + str(records_that_were_truly_eligible_but_the_filter_missed) + " records that should have been eligible were" ^0
"    never counted, and 100 per hundred of zero fired no" ^0
"    alert" ^0
"" ^0

"a universal claim over an empty set is true and says nothing; 'all eligible" ^0
"records processed' is satisfied most completely when nothing is eligible, which" ^0
"is exactly when the least work was done" ^0
"" ^0

"It computes eligibility from the real rule, processes every eligible record, and" ^0
"pages below 100 - a true 100 per hundred. The filter matched zero, so the ratio" ^0
"is zero over zero, reported complete: " + str(records_that_were_truly_eligible_but_the_filter_missed) + " truly-eligible records went" ^0
"unprocessed under " + str(alerts_that_fired) + " alerts, because none were in the denominator." ^0
```

## Python (deterministic transpilation)

```python
records_scanned = 500000
records_eligible = 0
records_processed = 0
reported_completion_per_hundred = 100
alerts_that_fired = 0
records_the_filter_excluded = records_scanned - records_eligible
records_that_were_truly_eligible_but_the_filter_missed = 1200
print("records scanned                 : " + str(records_scanned))
print("records eligible (by the filter): " + str(records_eligible))
print("records processed               : " + str(records_processed))
print("reported completion             : " + str(reported_completion_per_hundred) + " per hundred")
print("alerts that fired               : " + str(alerts_that_fired))
print("")
print("records the filter excluded     : " + str(records_the_filter_excluded))
print("records truly eligible, missed  : " + str(records_that_were_truly_eligible_but_the_filter_missed))
print("")
print("the completion metric")
print("  eligibility : from the real rule, not a stale flag")
print("  processes : every eligible record it finds")
print("  reports : processed over eligible")
print("  pages when : the ratio is below 100")
print("  eligible records left unprocessed : 0")
print("  verdict : 100 PER HUNDRED COMPLETE")
print("")
print("  paging on a ratio below 100 is the part done right")
print("  here, and it is why a real shortfall would alert")
print("")
print("processed over eligible")
print("  eligible this run : " + str(records_eligible))
print("  processed this run : " + str(records_processed))
print("  the ratio : zero over zero, reported as complete")
print("  what 100 per hundred of nothing means : every one of")
print("    no records, which is trivially all of them")
print("  what it does not mean : that the work was done")
print("")
print("the eligibility filter")
print("  what it matched this run : " + str(records_eligible))
print("  why : a predicate that excludes everything after an")
print("    upstream schema change renamed the field it reads")
print("  records that were truly eligible : ")
print("    " + str(records_that_were_truly_eligible_but_the_filter_missed))
print("  did the ratio notice they were skipped : no; they were")
print("    never in the denominator")
print("  is the completion figure false : no; it is vacuously")
print("    true")
print("")
nc_completion_when_empty_is_100 = 100
nc_completion_when_empty_is_undefined = 0
nc_alerts_on_zero_eligible = 1
print("null control - an empty eligible set is not 100 percent")
print("  completion when empty reads as 100 : ")
print("    " + str(nc_completion_when_empty_is_100))
print("  completion when empty is undefined : ")
print("    " + str(nc_completion_when_empty_is_undefined))
print("  alerts on zero eligible : " + str(nc_alerts_on_zero_eligible))
print("  no record changed; an empty denominator stopped being")
print("  reported as a finished job")
print("")
print("what 100 per hundred processed guarantees")
print("  every eligible record was processed : exactly, none was")
print("    left unprocessed")
print("  the work was done : not addressed; the eligible set was")
print("    empty, and 'all of an empty set' is vacuously true - ")
print("    " + str(records_that_were_truly_eligible_but_the_filter_missed) + " records that should have been eligible were")
print("    never counted, and 100 per hundred of zero fired no")
print("    alert")
print("")
print("a universal claim over an empty set is true and says nothing; 'all eligible")
print("records processed' is satisfied most completely when nothing is eligible, which")
print("is exactly when the least work was done")
print("")
print("It computes eligibility from the real rule, processes every eligible record, and")
print("pages below 100 - a true 100 per hundred. The filter matched zero, so the ratio")
print("is zero over zero, reported complete: " + str(records_that_were_truly_eligible_but_the_filter_missed) + " truly-eligible records went")
print("unprocessed under " + str(alerts_that_fired) + " alerts, because none were in the denominator.")
```

## stdout (executed)

```text
records scanned                 : 500000
records eligible (by the filter): 0
records processed               : 0
reported completion             : 100 per hundred
alerts that fired               : 0

records the filter excluded     : 500000
records truly eligible, missed  : 1200

the completion metric
  eligibility : from the real rule, not a stale flag
  processes : every eligible record it finds
  reports : processed over eligible
  pages when : the ratio is below 100
  eligible records left unprocessed : 0
  verdict : 100 PER HUNDRED COMPLETE

  paging on a ratio below 100 is the part done right
  here, and it is why a real shortfall would alert

processed over eligible
  eligible this run : 0
  processed this run : 0
  the ratio : zero over zero, reported as complete
  what 100 per hundred of nothing means : every one of
    no records, which is trivially all of them
  what it does not mean : that the work was done

the eligibility filter
  what it matched this run : 0
  why : a predicate that excludes everything after an
    upstream schema change renamed the field it reads
  records that were truly eligible : 
    1200
  did the ratio notice they were skipped : no; they were
    never in the denominator
  is the completion figure false : no; it is vacuously
    true

null control - an empty eligible set is not 100 percent
  completion when empty reads as 100 : 
    100
  completion when empty is undefined : 
    0
  alerts on zero eligible : 1
  no record changed; an empty denominator stopped being
  reported as a finished job

what 100 per hundred processed guarantees
  every eligible record was processed : exactly, none was
    left unprocessed
  the work was done : not addressed; the eligible set was
    empty, and 'all of an empty set' is vacuously true - 
    1200 records that should have been eligible were
    never counted, and 100 per hundred of zero fired no
    alert

a universal claim over an empty set is true and says nothing; 'all eligible
records processed' is satisfied most completely when nothing is eligible, which
is exactly when the least work was done

It computes eligibility from the real rule, processes every eligible record, and
pages below 100 - a true 100 per hundred. The filter matched zero, so the ratio
is zero over zero, reported complete: 1200 truly-eligible records went
unprocessed under 0 alerts, because none were in the denominator.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
