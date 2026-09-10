<!-- canonical: efficientnewlanguage.org/ai/examples/778-the-alert-count-fell-and-the-thresholds-were-raised | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 778 — The alert count fell and the thresholds were raised

`the_alert_count_fell_and_the_thresholds_were_raised.eml` - The noise programme cut alerts from four thousand one hundred a week to six hundred and twenty, and every change was reviewed. Which changes they were is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The noise
# programme cut alerts from four thousand one hundred a week to six hundred and
# twenty, and every change was reviewed. Which changes they were is computed
# below.
#
# The programme was run properly. Every rule was looked at by the team that owns
# the service rather than deleted centrally; each change carries a written
# reason; nothing was silenced, only changed, so there is no hidden mute list;
# and the count comes from the alerting system rather than from the pager,
# so alerts nobody was paged for are still in it.
#
# A team asked to reduce its alert count owns the thresholds.

4100 => alerts_a_week_before
620 => alerts_a_week_now
640 => rules_in_total
210 => rules_whose_threshold_was_raised
90 => rules_deleted
34 => rules_whose_logic_was_fixed
15 => months_of_the_programme
47 => incidents_a_quarter_first_seen_by_an_alert_before
22 => incidents_a_quarter_first_seen_by_an_alert_now
12 => incidents_a_quarter_first_seen_by_a_customer_before
31 => incidents_a_quarter_first_seen_by_a_customer_now

alerts_a_week_before - alerts_a_week_now => alerts_a_week_removed
rules_whose_threshold_was_raised + rules_deleted => rules_changed_by_making_them_quieter
rules_changed_by_making_them_quieter + rules_whose_logic_was_fixed => rules_touched
rules_in_total - rules_touched => rules_left_alone
incidents_a_quarter_first_seen_by_an_alert_before - incidents_a_quarter_first_seen_by_an_alert_now => incidents_an_alert_stopped_catching
incidents_a_quarter_first_seen_by_a_customer_now - incidents_a_quarter_first_seen_by_a_customer_before => incidents_a_customer_started_catching
int(rules_whose_threshold_was_raised * 10000 / rules_touched) => quieter_by_threshold_per_myriad
int(rules_whose_logic_was_fixed * 10000 / rules_touched) => fixed_by_logic_per_myriad
int(alerts_a_week_now * 10000 / alerts_a_week_before) => alerts_remaining_per_myriad

"alerts a week, before           : " + str(alerts_a_week_before) ^0
"alerts a week, now              : " + str(alerts_a_week_now) ^0
"  removed                       : " + str(alerts_a_week_removed) ^0
"  remaining                     : " + str(alerts_remaining_per_myriad) + " per ten thousand" ^0
"months of the programme         : " + str(months_of_the_programme) ^0
"" ^0
"rules in total                  : " + str(rules_in_total) ^0
"  threshold raised              : " + str(rules_whose_threshold_was_raised) ^0
"  deleted                       : " + str(rules_deleted) ^0
"  logic fixed                   : " + str(rules_whose_logic_was_fixed) ^0
"  touched                       : " + str(rules_touched) ^0
"  left alone                    : " + str(rules_left_alone) ^0
"  made quieter, of those touched: " + str(quieter_by_threshold_per_myriad) + " per ten thousand" ^0
"  fixed, of those touched       : " + str(fixed_by_logic_per_myriad) + " per ten thousand" ^0
"" ^0
"incidents a quarter first seen by an alert" ^0
"  before                        : " + str(incidents_a_quarter_first_seen_by_an_alert_before) ^0
"  now                           : " + str(incidents_a_quarter_first_seen_by_an_alert_now) ^0
"  no longer caught by one       : " + str(incidents_an_alert_stopped_catching) ^0
"incidents a quarter first seen by a customer" ^0
"  before                        : " + str(incidents_a_quarter_first_seen_by_a_customer_before) ^0
"  now                           : " + str(incidents_a_quarter_first_seen_by_a_customer_now) ^0
"  newly caught that way         : " + str(incidents_a_customer_started_catching) ^0
"" ^0

# ---- what the programme verified ----

"the noise programme" ^0
"  who reviewed each rule : the team that owns the" ^0
"    service, not a central sweep" ^0
"  every change : carries a written reason" ^0
"  silencing : not used, so there is no hidden mute list" ^0
"  the count : from the alerting system, so alerts nobody" ^0
"    was paged for are still in it" ^0
"  removed a week : " + str(alerts_a_week_removed) ^0
"  verdict : QUIETER" ^0
"" ^0
"  refusing to silence, so that every reduction is a" ^0
"  visible change to a rule, is the part almost nobody" ^0
"  does" ^0
"" ^0

# ---- which lever the population had ----

"the three ways to reduce a count" ^0
"  fix the rule so it fires on the right thing : " ^0
"    " + str(rules_whose_logic_was_fixed) + " rules, " + str(fixed_by_logic_per_myriad) + " per ten thousand of those" ^0
"    touched" ^0
"  raise its threshold : " + str(rules_whose_threshold_was_raised) + " rules" ^0
"  delete it : " + str(rules_deleted) + " rules" ^0
"  so quieter rather than better : " ^0
"    " + str(quieter_by_threshold_per_myriad) + " per ten thousand of what was touched" ^0
"  which of the three is cheapest : the two that need no" ^0
"    understanding of the failure" ^0
"" ^0

# ---- what the detector caught afterwards ----

"who notices an incident first" ^0
"  an alert, before : " + str(incidents_a_quarter_first_seen_by_an_alert_before) + " a quarter" ^0
"  an alert, now : " + str(incidents_a_quarter_first_seen_by_an_alert_now) ^0
"  a customer, before : " + str(incidents_a_quarter_first_seen_by_a_customer_before) ^0
"  a customer, now : " + str(incidents_a_quarter_first_seen_by_a_customer_now) ^0
"  incidents an alert stopped catching : " ^0
"    " + str(incidents_an_alert_stopped_catching) ^0
"  incidents a customer started catching : " ^0
"    " + str(incidents_a_customer_started_catching) ^0
"" ^0

# ---- null control ----

# The same programme, measured on false-positive rate per rule instead of on
# total volume, so raising a threshold does not by itself count as progress.
34 => nc_rules_whose_logic_was_fixed_before_the_switch
196 => nc_rules_whose_logic_was_fixed_after
620 => nc_alerts_a_week_at_the_switch

"null control - measure false positives per rule, not volume" ^0
"  alerts a week at the switch : " ^0
"    " + str(nc_alerts_a_week_at_the_switch) + ", unchanged" ^0
"  rules whose logic was fixed, before : " ^0
"    " + str(nc_rules_whose_logic_was_fixed_before_the_switch) ^0
"  rules whose logic was fixed, after : " ^0
"    " + str(nc_rules_whose_logic_was_fixed_after) ^0
"  no team worked harder; raising a threshold stopped" ^0
"  counting as an answer" ^0
"" ^0

# ---- the rule ----

"what a reduced alert count guarantees" ^0
"  fewer alerts are produced : exactly, " + str(alerts_a_week_removed) + " a week," ^0
"    every change reviewed by the owning team with a" ^0
"    written reason, nothing silenced, " + str(months_of_the_programme) + " months" ^0
"  fewer things go wrong unnoticed : not addressed; the" ^0
"    quantity asked for was the count, and " ^0
"    " + str(quieter_by_threshold_per_myriad) + " per ten thousand of the touched rules were" ^0
"    made quieter rather than righter" ^0
"" ^0
"asking a population to reduce a number it controls gets" ^0
"the number reduced; whether the thing the number stood for" ^0
"moved is a different measurement, and it is the one that" ^0
"was not taken" ^0
"" ^0

"Every rule was reviewed by its owning team with a written reason, nothing was" ^0
"silenced, and the count comes from the alerting system - " + str(alerts_a_week_removed) + " alerts a week gone" ^0
"in " + str(months_of_the_programme) + " months. Of " + str(rules_touched) + " rules touched, " + str(rules_whose_logic_was_fixed) + " had their logic fixed and " ^0
"" + str(rules_changed_by_making_them_quieter) + " were raised or deleted, while incidents first seen by an alert fell " ^0
"" + str(incidents_an_alert_stopped_catching) + " a quarter and those first seen by a customer rose " + str(incidents_a_customer_started_catching) + "." ^0
```

## Python (deterministic transpilation)

```python
alerts_a_week_before = 4100
alerts_a_week_now = 620
rules_in_total = 640
rules_whose_threshold_was_raised = 210
rules_deleted = 90
rules_whose_logic_was_fixed = 34
months_of_the_programme = 15
incidents_a_quarter_first_seen_by_an_alert_before = 47
incidents_a_quarter_first_seen_by_an_alert_now = 22
incidents_a_quarter_first_seen_by_a_customer_before = 12
incidents_a_quarter_first_seen_by_a_customer_now = 31
alerts_a_week_removed = alerts_a_week_before - alerts_a_week_now
rules_changed_by_making_them_quieter = rules_whose_threshold_was_raised + rules_deleted
rules_touched = rules_changed_by_making_them_quieter + rules_whose_logic_was_fixed
rules_left_alone = rules_in_total - rules_touched
incidents_an_alert_stopped_catching = incidents_a_quarter_first_seen_by_an_alert_before - incidents_a_quarter_first_seen_by_an_alert_now
incidents_a_customer_started_catching = incidents_a_quarter_first_seen_by_a_customer_now - incidents_a_quarter_first_seen_by_a_customer_before
quieter_by_threshold_per_myriad = int(rules_whose_threshold_was_raised * 10000 / rules_touched)
fixed_by_logic_per_myriad = int(rules_whose_logic_was_fixed * 10000 / rules_touched)
alerts_remaining_per_myriad = int(alerts_a_week_now * 10000 / alerts_a_week_before)
print("alerts a week, before           : " + str(alerts_a_week_before))
print("alerts a week, now              : " + str(alerts_a_week_now))
print("  removed                       : " + str(alerts_a_week_removed))
print("  remaining                     : " + str(alerts_remaining_per_myriad) + " per ten thousand")
print("months of the programme         : " + str(months_of_the_programme))
print("")
print("rules in total                  : " + str(rules_in_total))
print("  threshold raised              : " + str(rules_whose_threshold_was_raised))
print("  deleted                       : " + str(rules_deleted))
print("  logic fixed                   : " + str(rules_whose_logic_was_fixed))
print("  touched                       : " + str(rules_touched))
print("  left alone                    : " + str(rules_left_alone))
print("  made quieter, of those touched: " + str(quieter_by_threshold_per_myriad) + " per ten thousand")
print("  fixed, of those touched       : " + str(fixed_by_logic_per_myriad) + " per ten thousand")
print("")
print("incidents a quarter first seen by an alert")
print("  before                        : " + str(incidents_a_quarter_first_seen_by_an_alert_before))
print("  now                           : " + str(incidents_a_quarter_first_seen_by_an_alert_now))
print("  no longer caught by one       : " + str(incidents_an_alert_stopped_catching))
print("incidents a quarter first seen by a customer")
print("  before                        : " + str(incidents_a_quarter_first_seen_by_a_customer_before))
print("  now                           : " + str(incidents_a_quarter_first_seen_by_a_customer_now))
print("  newly caught that way         : " + str(incidents_a_customer_started_catching))
print("")
print("the noise programme")
print("  who reviewed each rule : the team that owns the")
print("    service, not a central sweep")
print("  every change : carries a written reason")
print("  silencing : not used, so there is no hidden mute list")
print("  the count : from the alerting system, so alerts nobody")
print("    was paged for are still in it")
print("  removed a week : " + str(alerts_a_week_removed))
print("  verdict : QUIETER")
print("")
print("  refusing to silence, so that every reduction is a")
print("  visible change to a rule, is the part almost nobody")
print("  does")
print("")
print("the three ways to reduce a count")
print("  fix the rule so it fires on the right thing : ")
print("    " + str(rules_whose_logic_was_fixed) + " rules, " + str(fixed_by_logic_per_myriad) + " per ten thousand of those")
print("    touched")
print("  raise its threshold : " + str(rules_whose_threshold_was_raised) + " rules")
print("  delete it : " + str(rules_deleted) + " rules")
print("  so quieter rather than better : ")
print("    " + str(quieter_by_threshold_per_myriad) + " per ten thousand of what was touched")
print("  which of the three is cheapest : the two that need no")
print("    understanding of the failure")
print("")
print("who notices an incident first")
print("  an alert, before : " + str(incidents_a_quarter_first_seen_by_an_alert_before) + " a quarter")
print("  an alert, now : " + str(incidents_a_quarter_first_seen_by_an_alert_now))
print("  a customer, before : " + str(incidents_a_quarter_first_seen_by_a_customer_before))
print("  a customer, now : " + str(incidents_a_quarter_first_seen_by_a_customer_now))
print("  incidents an alert stopped catching : ")
print("    " + str(incidents_an_alert_stopped_catching))
print("  incidents a customer started catching : ")
print("    " + str(incidents_a_customer_started_catching))
print("")
nc_rules_whose_logic_was_fixed_before_the_switch = 34
nc_rules_whose_logic_was_fixed_after = 196
nc_alerts_a_week_at_the_switch = 620
print("null control - measure false positives per rule, not volume")
print("  alerts a week at the switch : ")
print("    " + str(nc_alerts_a_week_at_the_switch) + ", unchanged")
print("  rules whose logic was fixed, before : ")
print("    " + str(nc_rules_whose_logic_was_fixed_before_the_switch))
print("  rules whose logic was fixed, after : ")
print("    " + str(nc_rules_whose_logic_was_fixed_after))
print("  no team worked harder; raising a threshold stopped")
print("  counting as an answer")
print("")
print("what a reduced alert count guarantees")
print("  fewer alerts are produced : exactly, " + str(alerts_a_week_removed) + " a week,")
print("    every change reviewed by the owning team with a")
print("    written reason, nothing silenced, " + str(months_of_the_programme) + " months")
print("  fewer things go wrong unnoticed : not addressed; the")
print("    quantity asked for was the count, and ")
print("    " + str(quieter_by_threshold_per_myriad) + " per ten thousand of the touched rules were")
print("    made quieter rather than righter")
print("")
print("asking a population to reduce a number it controls gets")
print("the number reduced; whether the thing the number stood for")
print("moved is a different measurement, and it is the one that")
print("was not taken")
print("")
print("Every rule was reviewed by its owning team with a written reason, nothing was")
print("silenced, and the count comes from the alerting system - " + str(alerts_a_week_removed) + " alerts a week gone")
print("in " + str(months_of_the_programme) + " months. Of " + str(rules_touched) + " rules touched, " + str(rules_whose_logic_was_fixed) + " had their logic fixed and ")
print("" + str(rules_changed_by_making_them_quieter) + " were raised or deleted, while incidents first seen by an alert fell ")
print("" + str(incidents_an_alert_stopped_catching) + " a quarter and those first seen by a customer rose " + str(incidents_a_customer_started_catching) + ".")
```

## stdout (executed)

```text
alerts a week, before           : 4100
alerts a week, now              : 620
  removed                       : 3480
  remaining                     : 1512 per ten thousand
months of the programme         : 15

rules in total                  : 640
  threshold raised              : 210
  deleted                       : 90
  logic fixed                   : 34
  touched                       : 334
  left alone                    : 306
  made quieter, of those touched: 6287 per ten thousand
  fixed, of those touched       : 1017 per ten thousand

incidents a quarter first seen by an alert
  before                        : 47
  now                           : 22
  no longer caught by one       : 25
incidents a quarter first seen by a customer
  before                        : 12
  now                           : 31
  newly caught that way         : 19

the noise programme
  who reviewed each rule : the team that owns the
    service, not a central sweep
  every change : carries a written reason
  silencing : not used, so there is no hidden mute list
  the count : from the alerting system, so alerts nobody
    was paged for are still in it
  removed a week : 3480
  verdict : QUIETER

  refusing to silence, so that every reduction is a
  visible change to a rule, is the part almost nobody
  does

the three ways to reduce a count
  fix the rule so it fires on the right thing : 
    34 rules, 1017 per ten thousand of those
    touched
  raise its threshold : 210 rules
  delete it : 90 rules
  so quieter rather than better : 
    6287 per ten thousand of what was touched
  which of the three is cheapest : the two that need no
    understanding of the failure

who notices an incident first
  an alert, before : 47 a quarter
  an alert, now : 22
  a customer, before : 12
  a customer, now : 31
  incidents an alert stopped catching : 
    25
  incidents a customer started catching : 
    19

null control - measure false positives per rule, not volume
  alerts a week at the switch : 
    620, unchanged
  rules whose logic was fixed, before : 
    34
  rules whose logic was fixed, after : 
    196
  no team worked harder; raising a threshold stopped
  counting as an answer

what a reduced alert count guarantees
  fewer alerts are produced : exactly, 3480 a week,
    every change reviewed by the owning team with a
    written reason, nothing silenced, 15 months
  fewer things go wrong unnoticed : not addressed; the
    quantity asked for was the count, and 
    6287 per ten thousand of the touched rules were
    made quieter rather than righter

asking a population to reduce a number it controls gets
the number reduced; whether the thing the number stood for
moved is a different measurement, and it is the one that
was not taken

Every rule was reviewed by its owning team with a written reason, nothing was
silenced, and the count comes from the alerting system - 3480 alerts a week gone
in 15 months. Of 334 rules touched, 34 had their logic fixed and 
300 were raised or deleted, while incidents first seen by an alert fell 
25 a quarter and those first seen by a customer rose 19.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
