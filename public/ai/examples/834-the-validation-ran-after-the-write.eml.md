<!-- canonical: efficientnewlanguage.org/ai/examples/834-the-validation-ran-after-the-write | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 834 — The validation ran after the write

`the_validation_ran_after_the_write.eml` - The validation job flagged every invalid record it was given, and its rules are correct. When it runs relative to the write is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The validation job
# flagged every invalid record it was given, and its rules are correct. When it
# runs relative to the write is computed below.
#
# The validation itself is sound. It checks the real schema and business rules,
# not a subset; it flags every violation without exception; it runs on every
# record, not a sample; and its findings are logged and actioned.
#
# It runs asynchronously, after the record is already written.

500000 => records_written
1300 => records_that_failed_validation
15 => validation_lag_minutes
1300 => records_the_validation_correctly_flagged
1300 => invalid_records_acted_on_before_the_flag

int(records_that_failed_validation * 10000 / records_written) => invalid_share_per_myriad
records_that_failed_validation - records_the_validation_correctly_flagged => invalid_records_it_missed

"records written                 : " + str(records_written) ^0
"records that failed validation  : " + str(records_that_failed_validation) ^0
"  the validation flagged        : " + str(records_the_validation_correctly_flagged) ^0
"  it missed                     : " + str(invalid_records_it_missed) ^0
"validation lag                  : " + str(validation_lag_minutes) + " minutes" ^0
"invalid records acted on first  : " + str(invalid_records_acted_on_before_the_flag) ^0
"invalid share                   : " + str(invalid_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the validation verified ----

"the validation job" ^0
"  checks : the real schema and business rules, not a" ^0
"    subset" ^0
"  flags : every violation, no exception" ^0
"  runs on : every record, not a sample" ^0
"  findings : logged and actioned" ^0
"  invalid records it failed to flag : " + str(invalid_records_it_missed) ^0
"  verdict : ALL VIOLATIONS FOUND" ^0
"" ^0
"  checking the full ruleset rather than a cheap subset is" ^0
"  the part done right here, and it is why its flags are" ^0
"  trusted to be complete" ^0
"" ^0

# ---- when it runs ----

"the timing of the check" ^0
"  when the record is written : immediately, on request" ^0
"  when the validation runs : asynchronously, up to " ^0
"    " + str(validation_lag_minutes) + " minutes later" ^0
"  what the record does in between : it is live, readable," ^0
"    and acted on" ^0
"  so a flag arrives : after the harm, not before it" ^0
"  what the check can do : report, not prevent" ^0
"" ^0

# ---- what the lag let through ----

"the window before the flag" ^0
"  invalid records written : " + str(records_that_failed_validation) ^0
"  acted on downstream before validation : " ^0
"    " + str(invalid_records_acted_on_before_the_flag) ^0
"  eventually flagged : all of them, correctly" ^0
"  eventually undone : whatever downstream already did," ^0
"    only if it can be" ^0
"  is the validation wrong : no; it is late" ^0
"" ^0

# ---- null control ----

# The same rules, run synchronously in the write path so a violation is rejected
# before the record is persisted.
1300 => nc_records_that_fail_the_rules
0 => nc_invalid_records_persisted
0 => nc_invalid_records_acted_on

"null control - validate in the write path" ^0
"  records that fail the rules : " + str(nc_records_that_fail_the_rules) + ", unchanged" ^0
"  invalid records persisted : " + str(nc_invalid_records_persisted) ^0
"  invalid records acted on : " + str(nc_invalid_records_acted_on) ^0
"  no rule changed; the check moved from after the write to" ^0
"  in front of it" ^0
"" ^0

# ---- the rule ----

"what a passing validation job guarantees" ^0
"  every invalid record is eventually flagged : exactly," ^0
"    full ruleset, every record, no exception" ^0
"  invalid records are rejected : not addressed; the" ^0
"    validation runs after the write, so it detects but" ^0
"    cannot prevent - " + str(invalid_records_acted_on_before_the_flag) + " invalid records were persisted and" ^0
"    acted on in the " + str(validation_lag_minutes) + "-minute window before the flag" ^0
"" ^0

"detection and prevention are different guarantees, and a correct check placed" ^0
"after the effect delivers only the first; the record is already doing whatever" ^0
"it does by the time the flag catches up with it" ^0
"" ^0

"It checks the full ruleset on every record and flags every violation - all " ^0
"" + str(records_that_failed_validation) + " found. It runs " + str(validation_lag_minutes) + " minutes after the write, so those " + str(records_that_failed_validation) + " invalid" ^0
"records were persisted and acted on before the flag arrived - detected, not" ^0
"prevented, " + str(invalid_share_per_myriad) + " per ten thousand of the writes." ^0
```

## Python (deterministic transpilation)

```python
records_written = 500000
records_that_failed_validation = 1300
validation_lag_minutes = 15
records_the_validation_correctly_flagged = 1300
invalid_records_acted_on_before_the_flag = 1300
invalid_share_per_myriad = int(records_that_failed_validation * 10000 / records_written)
invalid_records_it_missed = records_that_failed_validation - records_the_validation_correctly_flagged
print("records written                 : " + str(records_written))
print("records that failed validation  : " + str(records_that_failed_validation))
print("  the validation flagged        : " + str(records_the_validation_correctly_flagged))
print("  it missed                     : " + str(invalid_records_it_missed))
print("validation lag                  : " + str(validation_lag_minutes) + " minutes")
print("invalid records acted on first  : " + str(invalid_records_acted_on_before_the_flag))
print("invalid share                   : " + str(invalid_share_per_myriad) + " per ten thousand")
print("")
print("the validation job")
print("  checks : the real schema and business rules, not a")
print("    subset")
print("  flags : every violation, no exception")
print("  runs on : every record, not a sample")
print("  findings : logged and actioned")
print("  invalid records it failed to flag : " + str(invalid_records_it_missed))
print("  verdict : ALL VIOLATIONS FOUND")
print("")
print("  checking the full ruleset rather than a cheap subset is")
print("  the part done right here, and it is why its flags are")
print("  trusted to be complete")
print("")
print("the timing of the check")
print("  when the record is written : immediately, on request")
print("  when the validation runs : asynchronously, up to ")
print("    " + str(validation_lag_minutes) + " minutes later")
print("  what the record does in between : it is live, readable,")
print("    and acted on")
print("  so a flag arrives : after the harm, not before it")
print("  what the check can do : report, not prevent")
print("")
print("the window before the flag")
print("  invalid records written : " + str(records_that_failed_validation))
print("  acted on downstream before validation : ")
print("    " + str(invalid_records_acted_on_before_the_flag))
print("  eventually flagged : all of them, correctly")
print("  eventually undone : whatever downstream already did,")
print("    only if it can be")
print("  is the validation wrong : no; it is late")
print("")
nc_records_that_fail_the_rules = 1300
nc_invalid_records_persisted = 0
nc_invalid_records_acted_on = 0
print("null control - validate in the write path")
print("  records that fail the rules : " + str(nc_records_that_fail_the_rules) + ", unchanged")
print("  invalid records persisted : " + str(nc_invalid_records_persisted))
print("  invalid records acted on : " + str(nc_invalid_records_acted_on))
print("  no rule changed; the check moved from after the write to")
print("  in front of it")
print("")
print("what a passing validation job guarantees")
print("  every invalid record is eventually flagged : exactly,")
print("    full ruleset, every record, no exception")
print("  invalid records are rejected : not addressed; the")
print("    validation runs after the write, so it detects but")
print("    cannot prevent - " + str(invalid_records_acted_on_before_the_flag) + " invalid records were persisted and")
print("    acted on in the " + str(validation_lag_minutes) + "-minute window before the flag")
print("")
print("detection and prevention are different guarantees, and a correct check placed")
print("after the effect delivers only the first; the record is already doing whatever")
print("it does by the time the flag catches up with it")
print("")
print("It checks the full ruleset on every record and flags every violation - all ")
print("" + str(records_that_failed_validation) + " found. It runs " + str(validation_lag_minutes) + " minutes after the write, so those " + str(records_that_failed_validation) + " invalid")
print("records were persisted and acted on before the flag arrived - detected, not")
print("prevented, " + str(invalid_share_per_myriad) + " per ten thousand of the writes.")
```

## stdout (executed)

```text
records written                 : 500000
records that failed validation  : 1300
  the validation flagged        : 1300
  it missed                     : 0
validation lag                  : 15 minutes
invalid records acted on first  : 1300
invalid share                   : 26 per ten thousand

the validation job
  checks : the real schema and business rules, not a
    subset
  flags : every violation, no exception
  runs on : every record, not a sample
  findings : logged and actioned
  invalid records it failed to flag : 0
  verdict : ALL VIOLATIONS FOUND

  checking the full ruleset rather than a cheap subset is
  the part done right here, and it is why its flags are
  trusted to be complete

the timing of the check
  when the record is written : immediately, on request
  when the validation runs : asynchronously, up to 
    15 minutes later
  what the record does in between : it is live, readable,
    and acted on
  so a flag arrives : after the harm, not before it
  what the check can do : report, not prevent

the window before the flag
  invalid records written : 1300
  acted on downstream before validation : 
    1300
  eventually flagged : all of them, correctly
  eventually undone : whatever downstream already did,
    only if it can be
  is the validation wrong : no; it is late

null control - validate in the write path
  records that fail the rules : 1300, unchanged
  invalid records persisted : 0
  invalid records acted on : 0
  no rule changed; the check moved from after the write to
  in front of it

what a passing validation job guarantees
  every invalid record is eventually flagged : exactly,
    full ruleset, every record, no exception
  invalid records are rejected : not addressed; the
    validation runs after the write, so it detects but
    cannot prevent - 1300 invalid records were persisted and
    acted on in the 15-minute window before the flag

detection and prevention are different guarantees, and a correct check placed
after the effect delivers only the first; the record is already doing whatever
it does by the time the flag catches up with it

It checks the full ruleset on every record and flags every violation - all 
1300 found. It runs 15 minutes after the write, so those 1300 invalid
records were persisted and acted on before the flag arrived - detected, not
prevented, 26 per ten thousand of the writes.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
