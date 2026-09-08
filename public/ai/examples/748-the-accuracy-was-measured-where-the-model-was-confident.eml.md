<!-- canonical: efficientnewlanguage.org/ai/examples/748-the-accuracy-was-measured-where-the-model-was-confident | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 748 — The accuracy was measured where the model was confident

`the_accuracy_was_measured_where_the_model_was_confident.eml` - The classifier abstains below a confidence threshold rather than guessing, and on what it does answer it is right 99.4 percent of the time. What that rate is over is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The classifier
# abstains below a confidence threshold rather than guessing, and on what it
# does answer it is right 99.4 percent of the time. What that rate is over is
# computed below.
#
# The abstain option is the honest design and it was argued for. A classifier
# forced to answer every case produces its worst output exactly where it knows
# least, and here those cases go to a person instead. The threshold was chosen
# from a calibration curve rather than picked, the abstention is logged, and
# the measured accuracy on answered cases is genuinely 99.4 percent.
#
# Accuracy is computed over ANSWERED cases. Abstaining removes a case from the
# denominator, and the cases it removes are selected for being the ones the
# model finds hard.
#
# Thirty-one percent of cases are abstained.

10000 => a_whole_per_myriad
9940 => accuracy_on_answered_per_myriad
100 => a_whole_percent
31 => abstain_rate_percent
240000 => cases_per_month
1 => reviewers_the_abstained_cases_go_to
0 => metrics_on_accuracy_over_all_cases
0 => alerts_when_the_abstain_rate_rises

a_whole_percent - abstain_rate_percent => answered_percent
int(cases_per_month * abstain_rate_percent / a_whole_percent) => cases_abstained_per_month
cases_per_month - cases_abstained_per_month => cases_answered_per_month
a_whole_per_myriad - accuracy_on_answered_per_myriad => error_rate_on_answered_per_myriad
int(cases_answered_per_month * error_rate_on_answered_per_myriad / a_whole_per_myriad) => wrong_answers_per_month

"accuracy on answered cases      : " + str(accuracy_on_answered_per_myriad) + " per ten thousand" ^0
"  error rate on those           : " + str(error_rate_on_answered_per_myriad) + " per ten thousand" ^0
"" ^0
"cases per month                 : " + str(cases_per_month) ^0
"  answered, percent             : " + str(answered_percent) ^0
"  answered                      : " + str(cases_answered_per_month) ^0
"  abstained, percent            : " + str(abstain_rate_percent) ^0
"  abstained                     : " + str(cases_abstained_per_month) ^0
"" ^0
"wrong answers per month         : " + str(wrong_answers_per_month) ^0
"reviewers the abstained go to   : " + str(reviewers_the_abstained_cases_go_to) ^0
"metrics on accuracy over ALL cases : " + str(metrics_on_accuracy_over_all_cases) ^0
"alerts when the abstain rate rises : " + str(alerts_when_the_abstain_rate_rises) ^0
"" ^0

# ---- what the abstain option verified ----

"the design" ^0
"  a classifier forced to answer everything : produces its" ^0
"    worst output where it knows least" ^0
"  what this one does instead : declines" ^0
"  where the threshold came from : a calibration curve," ^0
"    not a round number" ^0
"  is the abstention logged : yes" ^0
"  measured accuracy on what it answers : " + str(accuracy_on_answered_per_myriad) ^0
"    per ten thousand" ^0
"  verdict : HONEST WHERE IT ANSWERS" ^0
"" ^0
"  declining rather than guessing is the right call and the" ^0
"  measured rate on the answered cases is real" ^0
"" ^0

# ---- what the rate is over ----

"the denominator" ^0
"  what accuracy is computed over : answered cases" ^0
"  what abstaining does to a case : removes it from that" ^0
"    set" ^0
"  which cases are abstained : the ones the model finds" ^0
"    hard, by construction" ^0
"  so the removed cases are : selected against the metric," ^0
"    not sampled from it" ^0
"  cases removed per month : " + str(cases_abstained_per_month) ^0
"" ^0
"  the rate is correct about the set it ranges over, and" ^0
"  the set is chosen by the thing being measured" ^0
"" ^0

# ---- raising the threshold improves it ----

# The number goes up when the model answers less. That is the wrong direction
# for a metric to be improvable in, and nothing in the report distinguishes a
# better model from a more cautious one.
"how to make the number better" ^0
"  train a better model : works, slowly" ^0
"  raise the abstain threshold : works, immediately" ^0
"  what the second does to the answered set : removes the" ^0
"    hardest remaining cases" ^0
"  what it does to the reported accuracy : raises it" ^0
"  what it does to the work : moves it to the reviewer" ^0
"  metrics that separate the two : " + str(metrics_on_accuracy_over_all_cases) ^0
"" ^0

# ---- what the reviewer absorbs ----

"the other side of the threshold" ^0
"  cases arriving at a person : " + str(cases_abstained_per_month) + " a month" ^0
"  reviewers : " + str(reviewers_the_abstained_cases_go_to) ^0
"  is the reviewer's accuracy measured : it is not in this" ^0
"    report" ^0
"  what happens if the abstain rate doubles : the reported" ^0
"    accuracy improves" ^0
"  alerts on that : " + str(alerts_when_the_abstain_rate_rises) ^0
"" ^0

# ---- null control ----

# The same classifier, with accuracy reported over ALL cases - an abstention
# counted as neither right nor wrong but present in the denominator - and the
# abstain rate reported beside it.
1 => nc_metrics_on_accuracy_over_all_cases
1 => nc_alerts_when_the_abstain_rate_rises
cases_per_month => nc_denominator_of_the_reported_rate

"null control - the denominator is every case" ^0
"  accuracy on answered cases : " + str(accuracy_on_answered_per_myriad) + ", unchanged" ^0
"  metrics over all cases : " + str(nc_metrics_on_accuracy_over_all_cases) ^0
"  denominator of the headline rate : " + str(nc_denominator_of_the_reported_rate) ^0
"  alerts when the abstain rate rises : " + str(nc_alerts_when_the_abstain_rate_rises) ^0
"  the model did not change; the rate stopped being" ^0
"  improvable by answering fewer questions" ^0
"" ^0

# ---- the rule ----

"what a measured accuracy guarantees" ^0
"  the answers it gave were right this often : exactly," ^0
"    and the abstain option is the honest design" ^0
"  the system is right this often : not addressed; the" ^0
"    denominator is chosen by the model, and it chooses" ^0
"    against the cases that would lower it" ^0
"" ^0
"a rate whose denominator the subject controls is a rate the" ^0
"subject can improve without improving; declining to answer" ^0
"is the right behaviour and it is also the cheapest way to" ^0
"raise the number" ^0
"" ^0

"The abstain option is the honest design - the threshold from a calibration" ^0
"curve, the abstention logged, and " + str(accuracy_on_answered_per_myriad) + " per ten thousand accuracy on what it" ^0
"answers, which is real. Accuracy is computed over answered cases and " + str(abstain_rate_percent) ^0
"percent are abstained, so " + str(cases_abstained_per_month) + " of " + str(cases_per_month) + " cases a month leave the denominator" ^0
"selected for being hard, watched by " + str(metrics_on_accuracy_over_all_cases) + " metrics over the whole population." ^0
```

## Python (deterministic transpilation)

```python
a_whole_per_myriad = 10000
accuracy_on_answered_per_myriad = 9940
a_whole_percent = 100
abstain_rate_percent = 31
cases_per_month = 240000
reviewers_the_abstained_cases_go_to = 1
metrics_on_accuracy_over_all_cases = 0
alerts_when_the_abstain_rate_rises = 0
answered_percent = a_whole_percent - abstain_rate_percent
cases_abstained_per_month = int(cases_per_month * abstain_rate_percent / a_whole_percent)
cases_answered_per_month = cases_per_month - cases_abstained_per_month
error_rate_on_answered_per_myriad = a_whole_per_myriad - accuracy_on_answered_per_myriad
wrong_answers_per_month = int(cases_answered_per_month * error_rate_on_answered_per_myriad / a_whole_per_myriad)
print("accuracy on answered cases      : " + str(accuracy_on_answered_per_myriad) + " per ten thousand")
print("  error rate on those           : " + str(error_rate_on_answered_per_myriad) + " per ten thousand")
print("")
print("cases per month                 : " + str(cases_per_month))
print("  answered, percent             : " + str(answered_percent))
print("  answered                      : " + str(cases_answered_per_month))
print("  abstained, percent            : " + str(abstain_rate_percent))
print("  abstained                     : " + str(cases_abstained_per_month))
print("")
print("wrong answers per month         : " + str(wrong_answers_per_month))
print("reviewers the abstained go to   : " + str(reviewers_the_abstained_cases_go_to))
print("metrics on accuracy over ALL cases : " + str(metrics_on_accuracy_over_all_cases))
print("alerts when the abstain rate rises : " + str(alerts_when_the_abstain_rate_rises))
print("")
print("the design")
print("  a classifier forced to answer everything : produces its")
print("    worst output where it knows least")
print("  what this one does instead : declines")
print("  where the threshold came from : a calibration curve,")
print("    not a round number")
print("  is the abstention logged : yes")
print("  measured accuracy on what it answers : " + str(accuracy_on_answered_per_myriad))
print("    per ten thousand")
print("  verdict : HONEST WHERE IT ANSWERS")
print("")
print("  declining rather than guessing is the right call and the")
print("  measured rate on the answered cases is real")
print("")
print("the denominator")
print("  what accuracy is computed over : answered cases")
print("  what abstaining does to a case : removes it from that")
print("    set")
print("  which cases are abstained : the ones the model finds")
print("    hard, by construction")
print("  so the removed cases are : selected against the metric,")
print("    not sampled from it")
print("  cases removed per month : " + str(cases_abstained_per_month))
print("")
print("  the rate is correct about the set it ranges over, and")
print("  the set is chosen by the thing being measured")
print("")
print("how to make the number better")
print("  train a better model : works, slowly")
print("  raise the abstain threshold : works, immediately")
print("  what the second does to the answered set : removes the")
print("    hardest remaining cases")
print("  what it does to the reported accuracy : raises it")
print("  what it does to the work : moves it to the reviewer")
print("  metrics that separate the two : " + str(metrics_on_accuracy_over_all_cases))
print("")
print("the other side of the threshold")
print("  cases arriving at a person : " + str(cases_abstained_per_month) + " a month")
print("  reviewers : " + str(reviewers_the_abstained_cases_go_to))
print("  is the reviewer's accuracy measured : it is not in this")
print("    report")
print("  what happens if the abstain rate doubles : the reported")
print("    accuracy improves")
print("  alerts on that : " + str(alerts_when_the_abstain_rate_rises))
print("")
nc_metrics_on_accuracy_over_all_cases = 1
nc_alerts_when_the_abstain_rate_rises = 1
nc_denominator_of_the_reported_rate = cases_per_month
print("null control - the denominator is every case")
print("  accuracy on answered cases : " + str(accuracy_on_answered_per_myriad) + ", unchanged")
print("  metrics over all cases : " + str(nc_metrics_on_accuracy_over_all_cases))
print("  denominator of the headline rate : " + str(nc_denominator_of_the_reported_rate))
print("  alerts when the abstain rate rises : " + str(nc_alerts_when_the_abstain_rate_rises))
print("  the model did not change; the rate stopped being")
print("  improvable by answering fewer questions")
print("")
print("what a measured accuracy guarantees")
print("  the answers it gave were right this often : exactly,")
print("    and the abstain option is the honest design")
print("  the system is right this often : not addressed; the")
print("    denominator is chosen by the model, and it chooses")
print("    against the cases that would lower it")
print("")
print("a rate whose denominator the subject controls is a rate the")
print("subject can improve without improving; declining to answer")
print("is the right behaviour and it is also the cheapest way to")
print("raise the number")
print("")
print("The abstain option is the honest design - the threshold from a calibration")
print("curve, the abstention logged, and " + str(accuracy_on_answered_per_myriad) + " per ten thousand accuracy on what it")
print("answers, which is real. Accuracy is computed over answered cases and " + str(abstain_rate_percent))
print("percent are abstained, so " + str(cases_abstained_per_month) + " of " + str(cases_per_month) + " cases a month leave the denominator")
print("selected for being hard, watched by " + str(metrics_on_accuracy_over_all_cases) + " metrics over the whole population.")
```

## stdout (executed)

```text
accuracy on answered cases      : 9940 per ten thousand
  error rate on those           : 60 per ten thousand

cases per month                 : 240000
  answered, percent             : 69
  answered                      : 165600
  abstained, percent            : 31
  abstained                     : 74400

wrong answers per month         : 993
reviewers the abstained go to   : 1
metrics on accuracy over ALL cases : 0
alerts when the abstain rate rises : 0

the design
  a classifier forced to answer everything : produces its
    worst output where it knows least
  what this one does instead : declines
  where the threshold came from : a calibration curve,
    not a round number
  is the abstention logged : yes
  measured accuracy on what it answers : 9940
    per ten thousand
  verdict : HONEST WHERE IT ANSWERS

  declining rather than guessing is the right call and the
  measured rate on the answered cases is real

the denominator
  what accuracy is computed over : answered cases
  what abstaining does to a case : removes it from that
    set
  which cases are abstained : the ones the model finds
    hard, by construction
  so the removed cases are : selected against the metric,
    not sampled from it
  cases removed per month : 74400

  the rate is correct about the set it ranges over, and
  the set is chosen by the thing being measured

how to make the number better
  train a better model : works, slowly
  raise the abstain threshold : works, immediately
  what the second does to the answered set : removes the
    hardest remaining cases
  what it does to the reported accuracy : raises it
  what it does to the work : moves it to the reviewer
  metrics that separate the two : 0

the other side of the threshold
  cases arriving at a person : 74400 a month
  reviewers : 1
  is the reviewer's accuracy measured : it is not in this
    report
  what happens if the abstain rate doubles : the reported
    accuracy improves
  alerts on that : 0

null control - the denominator is every case
  accuracy on answered cases : 9940, unchanged
  metrics over all cases : 1
  denominator of the headline rate : 240000
  alerts when the abstain rate rises : 1
  the model did not change; the rate stopped being
  improvable by answering fewer questions

what a measured accuracy guarantees
  the answers it gave were right this often : exactly,
    and the abstain option is the honest design
  the system is right this often : not addressed; the
    denominator is chosen by the model, and it chooses
    against the cases that would lower it

a rate whose denominator the subject controls is a rate the
subject can improve without improving; declining to answer
is the right behaviour and it is also the cheapest way to
raise the number

The abstain option is the honest design - the threshold from a calibration
curve, the abstention logged, and 9940 per ten thousand accuracy on what it
answers, which is real. Accuracy is computed over answered cases and 31
percent are abstained, so 74400 of 240000 cases a month leave the denominator
selected for being hard, watched by 0 metrics over the whole population.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
