<!-- canonical: efficientnewlanguage.org/ai/examples/651-the-model-was-retrained-and-the-labels-came-from-the-old-one | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 651 — The model was retrained and the labels came from the old one

`the_model_was_retrained_and_the_labels_came_from_the_old_one.eml` - The model is retrained monthly on fresh data and its holdout accuracy is up again. What it got better at is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The model is
# retrained monthly on fresh data and its holdout accuracy is up again. What it
# got better at is computed below.
#
# The pipeline is sound. The holdout is split before any feature is computed, no
# row appears in both halves, the split is by customer rather than by row so
# nothing leaks across, and the metric is computed once at the end by a job
# nobody can rerun until the next month. The number it produces is honest.
#
# Accuracy is measured AGAINST LABELS. Two percent of them are human decisions.
# The other ninety-eight are last month's model's predictions, written back
# because reviewing eight million rows by hand is not possible.
#
# So the metric asks how well this model agrees with the previous one, and the
# answer to that has been going up for five months.

8600000 => training_rows
172000 => human_reviewed_rows
9210 => holdout_accuracy_before_per_myriad
9640 => holdout_accuracy_after_per_myriad
9180 => human_subset_accuracy_before_per_myriad
9120 => human_subset_accuracy_after_per_myriad
5 => months_of_this

training_rows - human_reviewed_rows => model_labelled_rows
holdout_accuracy_after_per_myriad - holdout_accuracy_before_per_myriad => headline_gain
human_subset_accuracy_after_per_myriad - human_subset_accuracy_before_per_myriad => ground_truth_change

"training rows           : " + str(training_rows) ^0
"  labelled by a human   : " + str(human_reviewed_rows) ^0
"  labelled by last month's model : " + str(model_labelled_rows) ^0
"" ^0
"holdout accuracy before : " + str(holdout_accuracy_before_per_myriad) + " per ten thousand" ^0
"holdout accuracy after  : " + str(holdout_accuracy_after_per_myriad) + " per ten thousand" ^0
"headline gain           : " + str(headline_gain) + " per ten thousand" ^0
"" ^0

# ---- what the pipeline verified ----

"the evaluation" ^0
"  split before feature computation : yes" ^0
"  rows in both halves              : 0" ^0
"  split by customer, not by row    : yes" ^0
"  metric computed once, by a job nobody can rerun : yes" ^0
"  verdict                          : NO LEAKAGE" ^0
"" ^0
"  every one of those is a real precaution and each of them" ^0
"  prevents a real failure; none of them is theatre" ^0
"" ^0

# ---- what the labels are ----

int(model_labelled_rows * 10000 / training_rows) => model_labelled_per_myriad
"where the answer key comes from" ^0
"  human decisions       : " + str(human_reviewed_rows) ^0
"  previous model output : " + str(model_labelled_rows) ^0
"  share from the model  : " + str(model_labelled_per_myriad) + " per ten thousand" ^0
"" ^0
"  the holdout is split from the same pool, so both halves" ^0
"  are labelled the same way; the leakage check is looking" ^0
"  for rows crossing the split and the problem is upstream" ^0
"  of it" ^0
"" ^0

# ---- the one measurement against people ----

"accuracy on the human-reviewed subset" ^0
"  before : " + str(human_subset_accuracy_before_per_myriad) + " per ten thousand" ^0
"  after  : " + str(human_subset_accuracy_after_per_myriad) + " per ten thousand" ^0
"  change : " + str(ground_truth_change) + " per ten thousand" ^0
"" ^0
"  the headline moved " + str(headline_gain) + " the other way; the two numbers" ^0
"  are measuring agreement with two different things" ^0
"" ^0

# ---- what five months of this looks like ----

months_of_this * headline_gain => headline_gain_if_it_repeated
"over " + str(months_of_this) + " months at this rate" ^0
"  headline improvement, per ten thousand : " + str(headline_gain_if_it_repeated) ^0
"  measured against people                : falling" ^0
"  reviewers asked to check more rows     : no, the metric" ^0
"    is going up" ^0
"" ^0

# ---- null control ----

# The same pipeline with the holdout labelled entirely by review, and the
# training pool left as it is.
0 => nc_holdout_rows_labelled_by_the_model
human_subset_accuracy_after_per_myriad => nc_holdout_accuracy_after_per_myriad

"null control - a human-labelled holdout, same training pool" ^0
"  leakage verdict          : unchanged, still none" ^0
"  holdout rows from the model : " + str(nc_holdout_rows_labelled_by_the_model) ^0
"  holdout accuracy after   : " + str(nc_holdout_accuracy_after_per_myriad) + " per ten thousand" ^0
"  the model did not get worse; the metric started" ^0
"  answering the question it was being read as answering" ^0
"" ^0

# ---- the rule ----

"what a clean holdout guarantees" ^0
"  the metric is not inflated by seen rows : exactly" ^0
"  the metric measures being right         : not addressed;" ^0
"    it measures agreement with the labels, and where the" ^0
"    labels come from is upstream of every split" ^0
"" ^0
"a leakage check compares the two halves of a pool and cannot" ^0
"see a property both halves share; when the model wrote the" ^0
"answer key, the loop closes above the line the check draws" ^0
"" ^0

"The pipeline is clean and the evaluation is honest: split before features, 0" ^0
"rows in both halves, split by customer, computed once. " + str(model_labelled_per_myriad) + " per ten thousand of" ^0
"the labels are the previous model's own output, so the headline rose " + str(headline_gain) ^0
"per ten thousand while accuracy on the " + str(human_reviewed_rows) + " rows a person actually decided" ^0
"moved " + str(ground_truth_change) + " - and this is the fifth month of it." ^0
```

## Python (deterministic transpilation)

```python
training_rows = 8600000
human_reviewed_rows = 172000
holdout_accuracy_before_per_myriad = 9210
holdout_accuracy_after_per_myriad = 9640
human_subset_accuracy_before_per_myriad = 9180
human_subset_accuracy_after_per_myriad = 9120
months_of_this = 5
model_labelled_rows = training_rows - human_reviewed_rows
headline_gain = holdout_accuracy_after_per_myriad - holdout_accuracy_before_per_myriad
ground_truth_change = human_subset_accuracy_after_per_myriad - human_subset_accuracy_before_per_myriad
print("training rows           : " + str(training_rows))
print("  labelled by a human   : " + str(human_reviewed_rows))
print("  labelled by last month's model : " + str(model_labelled_rows))
print("")
print("holdout accuracy before : " + str(holdout_accuracy_before_per_myriad) + " per ten thousand")
print("holdout accuracy after  : " + str(holdout_accuracy_after_per_myriad) + " per ten thousand")
print("headline gain           : " + str(headline_gain) + " per ten thousand")
print("")
print("the evaluation")
print("  split before feature computation : yes")
print("  rows in both halves              : 0")
print("  split by customer, not by row    : yes")
print("  metric computed once, by a job nobody can rerun : yes")
print("  verdict                          : NO LEAKAGE")
print("")
print("  every one of those is a real precaution and each of them")
print("  prevents a real failure; none of them is theatre")
print("")
model_labelled_per_myriad = int(model_labelled_rows * 10000 / training_rows)
print("where the answer key comes from")
print("  human decisions       : " + str(human_reviewed_rows))
print("  previous model output : " + str(model_labelled_rows))
print("  share from the model  : " + str(model_labelled_per_myriad) + " per ten thousand")
print("")
print("  the holdout is split from the same pool, so both halves")
print("  are labelled the same way; the leakage check is looking")
print("  for rows crossing the split and the problem is upstream")
print("  of it")
print("")
print("accuracy on the human-reviewed subset")
print("  before : " + str(human_subset_accuracy_before_per_myriad) + " per ten thousand")
print("  after  : " + str(human_subset_accuracy_after_per_myriad) + " per ten thousand")
print("  change : " + str(ground_truth_change) + " per ten thousand")
print("")
print("  the headline moved " + str(headline_gain) + " the other way; the two numbers")
print("  are measuring agreement with two different things")
print("")
headline_gain_if_it_repeated = months_of_this * headline_gain
print("over " + str(months_of_this) + " months at this rate")
print("  headline improvement, per ten thousand : " + str(headline_gain_if_it_repeated))
print("  measured against people                : falling")
print("  reviewers asked to check more rows     : no, the metric")
print("    is going up")
print("")
nc_holdout_rows_labelled_by_the_model = 0
nc_holdout_accuracy_after_per_myriad = human_subset_accuracy_after_per_myriad
print("null control - a human-labelled holdout, same training pool")
print("  leakage verdict          : unchanged, still none")
print("  holdout rows from the model : " + str(nc_holdout_rows_labelled_by_the_model))
print("  holdout accuracy after   : " + str(nc_holdout_accuracy_after_per_myriad) + " per ten thousand")
print("  the model did not get worse; the metric started")
print("  answering the question it was being read as answering")
print("")
print("what a clean holdout guarantees")
print("  the metric is not inflated by seen rows : exactly")
print("  the metric measures being right         : not addressed;")
print("    it measures agreement with the labels, and where the")
print("    labels come from is upstream of every split")
print("")
print("a leakage check compares the two halves of a pool and cannot")
print("see a property both halves share; when the model wrote the")
print("answer key, the loop closes above the line the check draws")
print("")
print("The pipeline is clean and the evaluation is honest: split before features, 0")
print("rows in both halves, split by customer, computed once. " + str(model_labelled_per_myriad) + " per ten thousand of")
print("the labels are the previous model's own output, so the headline rose " + str(headline_gain))
print("per ten thousand while accuracy on the " + str(human_reviewed_rows) + " rows a person actually decided")
print("moved " + str(ground_truth_change) + " - and this is the fifth month of it.")
```

## stdout (executed)

```text
training rows           : 8600000
  labelled by a human   : 172000
  labelled by last month's model : 8428000

holdout accuracy before : 9210 per ten thousand
holdout accuracy after  : 9640 per ten thousand
headline gain           : 430 per ten thousand

the evaluation
  split before feature computation : yes
  rows in both halves              : 0
  split by customer, not by row    : yes
  metric computed once, by a job nobody can rerun : yes
  verdict                          : NO LEAKAGE

  every one of those is a real precaution and each of them
  prevents a real failure; none of them is theatre

where the answer key comes from
  human decisions       : 172000
  previous model output : 8428000
  share from the model  : 9800 per ten thousand

  the holdout is split from the same pool, so both halves
  are labelled the same way; the leakage check is looking
  for rows crossing the split and the problem is upstream
  of it

accuracy on the human-reviewed subset
  before : 9180 per ten thousand
  after  : 9120 per ten thousand
  change : -60 per ten thousand

  the headline moved 430 the other way; the two numbers
  are measuring agreement with two different things

over 5 months at this rate
  headline improvement, per ten thousand : 2150
  measured against people                : falling
  reviewers asked to check more rows     : no, the metric
    is going up

null control - a human-labelled holdout, same training pool
  leakage verdict          : unchanged, still none
  holdout rows from the model : 0
  holdout accuracy after   : 9120 per ten thousand
  the model did not get worse; the metric started
  answering the question it was being read as answering

what a clean holdout guarantees
  the metric is not inflated by seen rows : exactly
  the metric measures being right         : not addressed;
    it measures agreement with the labels, and where the
    labels come from is upstream of every split

a leakage check compares the two halves of a pool and cannot
see a property both halves share; when the model wrote the
answer key, the loop closes above the line the check draws

The pipeline is clean and the evaluation is honest: split before features, 0
rows in both halves, split by customer, computed once. 9800 per ten thousand of
the labels are the previous model's own output, so the headline rose 430
per ten thousand while accuracy on the 172000 rows a person actually decided
moved -60 - and this is the fifth month of it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
