<!-- canonical: efficientnewlanguage.org/ai/examples/787-the-model-reported-its-own-confidence | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 787 — The model reported its own confidence

`the_model_reported_its_own_confidence.eml` - The classifier decides a document only when it is confident, and everything below the threshold goes to a person. Where the confidence comes from is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The classifier
# decides a document only when it is confident, and everything below the
# threshold goes to a person. Where the confidence comes from is computed below.
#
# The gate is well built. The threshold was chosen on a held-out set rather than
# picked; the abstention rate is on a dashboard, so a model that quietly stops
# abstaining is visible; abstentions go to a real queue with a real service
# level rather than to a folder; and a sample of the automatic decisions is
# adjudicated by hand every day, so the error rate is measured and not assumed.
#
# The confidence is the model's own, and it was calibrated on the distribution
# the model was trained on.

52000 => documents_a_day
85 => abstention_threshold_times_one_hundred
4160 => documents_sent_to_a_human
400 => automatic_decisions_audited_a_day
6 => errors_found_in_that_audit
26 => months_the_gate_has_run
3100 => documents_a_day_from_a_source_added_after_calibration
210 => those_that_abstained
300 => of_those_audited
74 => errors_found_among_them
93 => mean_confidence_on_that_source_times_one_hundred
0 => calibration_sets_drawn_after_the_new_source_arrived

documents_a_day - documents_sent_to_a_human => documents_decided_automatically
int(documents_sent_to_a_human * 10000 / documents_a_day) => abstained_per_myriad
int(errors_found_in_that_audit * 10000 / automatic_decisions_audited_a_day) => error_rate_overall_per_myriad
int(errors_found_among_them * 10000 / of_those_audited) => error_rate_new_source_per_myriad
int(those_that_abstained * 10000 / documents_a_day_from_a_source_added_after_calibration) => abstained_new_source_per_myriad
error_rate_new_source_per_myriad - error_rate_overall_per_myriad => rate_difference_per_myriad
abstained_per_myriad - abstained_new_source_per_myriad => abstention_difference_per_myriad

"documents a day                 : " + str(documents_a_day) ^0
"  sent to a human               : " + str(documents_sent_to_a_human) ^0
"  decided automatically         : " + str(documents_decided_automatically) ^0
"  abstained                     : " + str(abstained_per_myriad) + " per ten thousand" ^0
"threshold, times one hundred    : " + str(abstention_threshold_times_one_hundred) ^0
"months the gate has run         : " + str(months_the_gate_has_run) ^0
"" ^0
"automatic decisions audited     : " + str(automatic_decisions_audited_a_day) ^0
"  errors found                  : " + str(errors_found_in_that_audit) ^0
"  error rate                    : " + str(error_rate_overall_per_myriad) + " per ten thousand" ^0
"" ^0
"documents from the new source   : " + str(documents_a_day_from_a_source_added_after_calibration) ^0
"  audited                       : " + str(of_those_audited) ^0
"  errors found                  : " + str(errors_found_among_them) ^0
"  error rate                    : " + str(error_rate_new_source_per_myriad) + " per ten thousand" ^0
"  mean confidence, times hundred: " + str(mean_confidence_on_that_source_times_one_hundred) ^0
"  abstained                     : " + str(abstained_new_source_per_myriad) + " per ten thousand" ^0
"calibration sets drawn since    : " + str(calibration_sets_drawn_after_the_new_source_arrived) ^0
"" ^0
"the two rates, as a difference" ^0
"  error, new source less overall: " + str(rate_difference_per_myriad) + " per ten thousand" ^0
"  abstention, overall less new  : " + str(abstention_difference_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the gate verified ----

"the abstention gate" ^0
"  the threshold : chosen on a held-out set, not picked" ^0
"  the abstention rate : on a dashboard, so a model that" ^0
"    quietly stops abstaining is visible" ^0
"  where abstentions go : a real queue with a real" ^0
"    service level, not a folder" ^0
"  the automatic decisions : " + str(automatic_decisions_audited_a_day) + " adjudicated by hand" ^0
"    every day, so the error rate is measured" ^0
"  verdict : GATED" ^0
"" ^0
"  adjudicating a daily sample of the AUTOMATIC decisions" ^0
"  is the part almost nobody does, and it is why the " ^0
"  " + str(error_rate_overall_per_myriad) + " per ten thousand is a measurement" ^0
"" ^0

# ---- whose word the confidence is ----

"what the number in the gate is" ^0
"  who produces it : the model" ^0
"  what it is : how well the input matched what the model" ^0
"    learned, expressed as certainty" ^0
"  what it was calibrated against : the distribution the" ^0
"    model was trained on" ^0
"  calibration sets drawn since the new source arrived : " ^0
"    " + str(calibration_sets_drawn_after_the_new_source_arrived) ^0
"  so on an input unlike that distribution : the number" ^0
"    is produced by the same machinery that is wrong" ^0
"" ^0
"  the gate asks the model whether to trust the model" ^0
"" ^0

# ---- the source that arrived after ----

"documents from a form layout nobody calibrated on" ^0
"  error rate there : " + str(error_rate_new_source_per_myriad) + " per ten thousand" ^0
"  error rate overall : " + str(error_rate_overall_per_myriad) + " per ten thousand" ^0
"  so the difference : " + str(rate_difference_per_myriad) + " per ten thousand" ^0
"  mean confidence there : " + str(mean_confidence_on_that_source_times_one_hundred) + ", against a" ^0
"    threshold of " + str(abstention_threshold_times_one_hundred) ^0
"  abstention there : " + str(abstained_new_source_per_myriad) + " per ten thousand" ^0
"  abstention overall : " + str(abstained_per_myriad) + " per ten thousand" ^0
"" ^0
"  it abstains LESS on the source it is wronger about," ^0
"  by " + str(abstention_difference_per_myriad) + " per ten thousand, and that is not a" ^0
"  malfunction - it is what a confidence calibrated" ^0
"  elsewhere says here" ^0
"" ^0

# ---- null control ----

# The same gate, recalibrated on a sample that includes the new source.
2900 => nc_new_source_documents_that_abstain
4160 => nc_documents_sent_to_a_human_from_the_old_sources
1 => nc_calibration_sets_drawn_since

"null control - recalibrate on a sample that includes it" ^0
"  abstentions from the old sources : " ^0
"    " + str(nc_documents_sent_to_a_human_from_the_old_sources) + ", unchanged" ^0
"  calibration sets drawn since : " + str(nc_calibration_sets_drawn_since) ^0
"  new-source documents that now abstain : " ^0
"    " + str(nc_new_source_documents_that_abstain) + " of " + str(documents_a_day_from_a_source_added_after_calibration) ^0
"  the model did not get better; the number the gate reads" ^0
"  was made to be about the documents it is reading" ^0
"" ^0

# ---- the rule ----

"what a confidence gate guarantees" ^0
"  a document the model is unsure about goes to a person" ^0
"    : exactly, threshold " + str(abstention_threshold_times_one_hundred) + ", " + str(months_the_gate_has_run) + " months, rate on a" ^0
"    dashboard, queue with a service level" ^0
"  a document the model is wrong about goes to a person :" ^0
"    not addressed; the gate reads the model's own" ^0
"    certainty, and being wrong without doubt is the" ^0
"    failure it cannot see" ^0
"" ^0
"a self-reported certainty is a measurement of fit to what" ^0
"was seen before; where that fit is worst the report is" ^0
"least able to say so, and nothing here asks anyone else" ^0
"" ^0

"The threshold came from a held-out set, abstentions go to a queue with a" ^0
"service level, and " + str(automatic_decisions_audited_a_day) + " automatic decisions are adjudicated by hand daily at " ^0
"" + str(error_rate_overall_per_myriad) + " per ten thousand error. The confidence is the model's own, calibrated before" ^0
"a source that now sends " + str(documents_a_day_from_a_source_added_after_calibration) + " documents a day: there it errs at " + str(error_rate_new_source_per_myriad) + " per ten" ^0
"thousand while abstaining " + str(abstention_difference_per_myriad) + " per ten thousand LESS than it does elsewhere." ^0
```

## Python (deterministic transpilation)

```python
documents_a_day = 52000
abstention_threshold_times_one_hundred = 85
documents_sent_to_a_human = 4160
automatic_decisions_audited_a_day = 400
errors_found_in_that_audit = 6
months_the_gate_has_run = 26
documents_a_day_from_a_source_added_after_calibration = 3100
those_that_abstained = 210
of_those_audited = 300
errors_found_among_them = 74
mean_confidence_on_that_source_times_one_hundred = 93
calibration_sets_drawn_after_the_new_source_arrived = 0
documents_decided_automatically = documents_a_day - documents_sent_to_a_human
abstained_per_myriad = int(documents_sent_to_a_human * 10000 / documents_a_day)
error_rate_overall_per_myriad = int(errors_found_in_that_audit * 10000 / automatic_decisions_audited_a_day)
error_rate_new_source_per_myriad = int(errors_found_among_them * 10000 / of_those_audited)
abstained_new_source_per_myriad = int(those_that_abstained * 10000 / documents_a_day_from_a_source_added_after_calibration)
rate_difference_per_myriad = error_rate_new_source_per_myriad - error_rate_overall_per_myriad
abstention_difference_per_myriad = abstained_per_myriad - abstained_new_source_per_myriad
print("documents a day                 : " + str(documents_a_day))
print("  sent to a human               : " + str(documents_sent_to_a_human))
print("  decided automatically         : " + str(documents_decided_automatically))
print("  abstained                     : " + str(abstained_per_myriad) + " per ten thousand")
print("threshold, times one hundred    : " + str(abstention_threshold_times_one_hundred))
print("months the gate has run         : " + str(months_the_gate_has_run))
print("")
print("automatic decisions audited     : " + str(automatic_decisions_audited_a_day))
print("  errors found                  : " + str(errors_found_in_that_audit))
print("  error rate                    : " + str(error_rate_overall_per_myriad) + " per ten thousand")
print("")
print("documents from the new source   : " + str(documents_a_day_from_a_source_added_after_calibration))
print("  audited                       : " + str(of_those_audited))
print("  errors found                  : " + str(errors_found_among_them))
print("  error rate                    : " + str(error_rate_new_source_per_myriad) + " per ten thousand")
print("  mean confidence, times hundred: " + str(mean_confidence_on_that_source_times_one_hundred))
print("  abstained                     : " + str(abstained_new_source_per_myriad) + " per ten thousand")
print("calibration sets drawn since    : " + str(calibration_sets_drawn_after_the_new_source_arrived))
print("")
print("the two rates, as a difference")
print("  error, new source less overall: " + str(rate_difference_per_myriad) + " per ten thousand")
print("  abstention, overall less new  : " + str(abstention_difference_per_myriad) + " per ten thousand")
print("")
print("the abstention gate")
print("  the threshold : chosen on a held-out set, not picked")
print("  the abstention rate : on a dashboard, so a model that")
print("    quietly stops abstaining is visible")
print("  where abstentions go : a real queue with a real")
print("    service level, not a folder")
print("  the automatic decisions : " + str(automatic_decisions_audited_a_day) + " adjudicated by hand")
print("    every day, so the error rate is measured")
print("  verdict : GATED")
print("")
print("  adjudicating a daily sample of the AUTOMATIC decisions")
print("  is the part almost nobody does, and it is why the ")
print("  " + str(error_rate_overall_per_myriad) + " per ten thousand is a measurement")
print("")
print("what the number in the gate is")
print("  who produces it : the model")
print("  what it is : how well the input matched what the model")
print("    learned, expressed as certainty")
print("  what it was calibrated against : the distribution the")
print("    model was trained on")
print("  calibration sets drawn since the new source arrived : ")
print("    " + str(calibration_sets_drawn_after_the_new_source_arrived))
print("  so on an input unlike that distribution : the number")
print("    is produced by the same machinery that is wrong")
print("")
print("  the gate asks the model whether to trust the model")
print("")
print("documents from a form layout nobody calibrated on")
print("  error rate there : " + str(error_rate_new_source_per_myriad) + " per ten thousand")
print("  error rate overall : " + str(error_rate_overall_per_myriad) + " per ten thousand")
print("  so the difference : " + str(rate_difference_per_myriad) + " per ten thousand")
print("  mean confidence there : " + str(mean_confidence_on_that_source_times_one_hundred) + ", against a")
print("    threshold of " + str(abstention_threshold_times_one_hundred))
print("  abstention there : " + str(abstained_new_source_per_myriad) + " per ten thousand")
print("  abstention overall : " + str(abstained_per_myriad) + " per ten thousand")
print("")
print("  it abstains LESS on the source it is wronger about,")
print("  by " + str(abstention_difference_per_myriad) + " per ten thousand, and that is not a")
print("  malfunction - it is what a confidence calibrated")
print("  elsewhere says here")
print("")
nc_new_source_documents_that_abstain = 2900
nc_documents_sent_to_a_human_from_the_old_sources = 4160
nc_calibration_sets_drawn_since = 1
print("null control - recalibrate on a sample that includes it")
print("  abstentions from the old sources : ")
print("    " + str(nc_documents_sent_to_a_human_from_the_old_sources) + ", unchanged")
print("  calibration sets drawn since : " + str(nc_calibration_sets_drawn_since))
print("  new-source documents that now abstain : ")
print("    " + str(nc_new_source_documents_that_abstain) + " of " + str(documents_a_day_from_a_source_added_after_calibration))
print("  the model did not get better; the number the gate reads")
print("  was made to be about the documents it is reading")
print("")
print("what a confidence gate guarantees")
print("  a document the model is unsure about goes to a person")
print("    : exactly, threshold " + str(abstention_threshold_times_one_hundred) + ", " + str(months_the_gate_has_run) + " months, rate on a")
print("    dashboard, queue with a service level")
print("  a document the model is wrong about goes to a person :")
print("    not addressed; the gate reads the model's own")
print("    certainty, and being wrong without doubt is the")
print("    failure it cannot see")
print("")
print("a self-reported certainty is a measurement of fit to what")
print("was seen before; where that fit is worst the report is")
print("least able to say so, and nothing here asks anyone else")
print("")
print("The threshold came from a held-out set, abstentions go to a queue with a")
print("service level, and " + str(automatic_decisions_audited_a_day) + " automatic decisions are adjudicated by hand daily at ")
print("" + str(error_rate_overall_per_myriad) + " per ten thousand error. The confidence is the model's own, calibrated before")
print("a source that now sends " + str(documents_a_day_from_a_source_added_after_calibration) + " documents a day: there it errs at " + str(error_rate_new_source_per_myriad) + " per ten")
print("thousand while abstaining " + str(abstention_difference_per_myriad) + " per ten thousand LESS than it does elsewhere.")
```

## stdout (executed)

```text
documents a day                 : 52000
  sent to a human               : 4160
  decided automatically         : 47840
  abstained                     : 800 per ten thousand
threshold, times one hundred    : 85
months the gate has run         : 26

automatic decisions audited     : 400
  errors found                  : 6
  error rate                    : 150 per ten thousand

documents from the new source   : 3100
  audited                       : 300
  errors found                  : 74
  error rate                    : 2466 per ten thousand
  mean confidence, times hundred: 93
  abstained                     : 677 per ten thousand
calibration sets drawn since    : 0

the two rates, as a difference
  error, new source less overall: 2316 per ten thousand
  abstention, overall less new  : 123 per ten thousand

the abstention gate
  the threshold : chosen on a held-out set, not picked
  the abstention rate : on a dashboard, so a model that
    quietly stops abstaining is visible
  where abstentions go : a real queue with a real
    service level, not a folder
  the automatic decisions : 400 adjudicated by hand
    every day, so the error rate is measured
  verdict : GATED

  adjudicating a daily sample of the AUTOMATIC decisions
  is the part almost nobody does, and it is why the 
  150 per ten thousand is a measurement

what the number in the gate is
  who produces it : the model
  what it is : how well the input matched what the model
    learned, expressed as certainty
  what it was calibrated against : the distribution the
    model was trained on
  calibration sets drawn since the new source arrived : 
    0
  so on an input unlike that distribution : the number
    is produced by the same machinery that is wrong

  the gate asks the model whether to trust the model

documents from a form layout nobody calibrated on
  error rate there : 2466 per ten thousand
  error rate overall : 150 per ten thousand
  so the difference : 2316 per ten thousand
  mean confidence there : 93, against a
    threshold of 85
  abstention there : 677 per ten thousand
  abstention overall : 800 per ten thousand

  it abstains LESS on the source it is wronger about,
  by 123 per ten thousand, and that is not a
  malfunction - it is what a confidence calibrated
  elsewhere says here

null control - recalibrate on a sample that includes it
  abstentions from the old sources : 
    4160, unchanged
  calibration sets drawn since : 1
  new-source documents that now abstain : 
    2900 of 3100
  the model did not get better; the number the gate reads
  was made to be about the documents it is reading

what a confidence gate guarantees
  a document the model is unsure about goes to a person
    : exactly, threshold 85, 26 months, rate on a
    dashboard, queue with a service level
  a document the model is wrong about goes to a person :
    not addressed; the gate reads the model's own
    certainty, and being wrong without doubt is the
    failure it cannot see

a self-reported certainty is a measurement of fit to what
was seen before; where that fit is worst the report is
least able to say so, and nothing here asks anyone else

The threshold came from a held-out set, abstentions go to a queue with a
service level, and 400 automatic decisions are adjudicated by hand daily at 
150 per ten thousand error. The confidence is the model's own, calibrated before
a source that now sends 3100 documents a day: there it errs at 2466 per ten
thousand while abstaining 123 per ten thousand LESS than it does elsewhere.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
