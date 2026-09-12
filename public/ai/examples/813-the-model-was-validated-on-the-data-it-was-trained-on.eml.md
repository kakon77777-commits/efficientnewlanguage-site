<!-- canonical: efficientnewlanguage.org/ai/examples/813-the-model-was-validated-on-the-data-it-was-trained-on | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 813 — The model was validated on the data it was trained on

`the_model_was_validated_on_the_data_it_was_trained_on.eml` - The classifier scored 98 per hundred at validation, and the score is real. What set it was scored on is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The classifier
# scored 98 per hundred at validation, and the score is real. What set it was
# scored on is computed below.
#
# The evaluation is done carefully. Accuracy is computed on real labels, not the
# model's own guesses; the metric is checked against a confusion matrix; the
# threshold was fixed before scoring; and the number is signed off before
# release.
#
# The rows it was scored on are the rows it was trained on.

40000 => rows_scored
40000 => rows_trained_on
0 => holdout_rows_held_back
9820 => in_sample_accuracy_per_myriad
12000 => unseen_rows_from_a_later_batch
8730 => out_of_sample_accuracy_per_myriad

in_sample_accuracy_per_myriad - out_of_sample_accuracy_per_myriad => generalization_gap_per_myriad
int(in_sample_accuracy_per_myriad * rows_scored / 10000) => rows_called_right_in_sample
int(out_of_sample_accuracy_per_myriad * unseen_rows_from_a_later_batch / 10000) => unseen_rows_called_right

"rows scored                     : " + str(rows_scored) ^0
"rows trained on                 : " + str(rows_trained_on) ^0
"  held back for validation      : " + str(holdout_rows_held_back) ^0
"in-sample accuracy              : " + str(in_sample_accuracy_per_myriad) + " per ten thousand" ^0
"" ^0
"unseen rows from a later batch  : " + str(unseen_rows_from_a_later_batch) ^0
"out-of-sample accuracy          : " + str(out_of_sample_accuracy_per_myriad) + " per ten thousand" ^0
"  generalization gap            : " + str(generalization_gap_per_myriad) + " per ten thousand" ^0
"unseen rows called right        : " + str(unseen_rows_called_right) ^0
"" ^0

# ---- what the evaluation verified ----

"the validation" ^0
"  accuracy on : real labels, not the model's guesses" ^0
"  checked against : a confusion matrix" ^0
"  threshold : fixed before scoring" ^0
"  sign-off : before release" ^0
"  rows called right : " + str(rows_called_right_in_sample) ^0
"  verdict : ACCURATE" ^0
"" ^0
"  fixing the threshold before scoring is the part almost" ^0
"  nobody resists moving, and it is why the number was not" ^0
"  tuned to itself" ^0
"" ^0

# ---- what set it was scored on ----

"the scoring set" ^0
"  which rows : the training rows" ^0
"  rows held back for a fair test : " ^0
"    " + str(holdout_rows_held_back) ^0
"  what a model can do to those rows : memorize them" ^0
"  so a high score on them : measures recall of the" ^0
"    training set, not skill on new data" ^0
"  what it does not measure : generalization" ^0
"" ^0

# ---- what a later batch shows ----

"the rows the model never saw" ^0
"  count : " + str(unseen_rows_from_a_later_batch) ^0
"  accuracy on them : " + str(out_of_sample_accuracy_per_myriad) + " per ten thousand" ^0
"  the validation figure : " + str(in_sample_accuracy_per_myriad) + " per ten thousand" ^0
"  the drop : " + str(generalization_gap_per_myriad) + " per ten thousand" ^0
"  is the validation number wrong : no; it is a correct" ^0
"    in-sample accuracy" ^0
"  is it the number a buyer thinks they are getting : no" ^0
"" ^0

# ---- null control ----

# The same model, scored on a holdout split withheld from training before the
# metric is computed.
9820 => nc_in_sample_per_myriad
8730 => nc_holdout_per_myriad
1 => nc_number_that_changes_meaning

"null control - score on a withheld holdout" ^0
"  in-sample accuracy : " + str(nc_in_sample_per_myriad) + ", unchanged" ^0
"  holdout accuracy : " + str(nc_holdout_per_myriad) + " per ten thousand" ^0
"  numbers that change meaning : " + str(nc_number_that_changes_meaning) ^0
"  no row and no label changed; the scoring set stopped" ^0
"  being the set the model had already seen" ^0
"" ^0

# ---- the rule ----

"what a high validation accuracy guarantees" ^0
"  the model reproduces the labels it was scored on :" ^0
"    exactly, real labels, fixed threshold, signed off" ^0
"  the model generalizes : not addressed; the accuracy was" ^0
"    measured on the rows it was fit to, and a model can" ^0
"    memorize those - on " + str(unseen_rows_from_a_later_batch) + " unseen rows it scores " ^0
"    " + str(out_of_sample_accuracy_per_myriad) ^0
"" ^0

"a score on the training set measures memory, and a score on held-out data" ^0
"measures skill; the two coincide only for a model that did not overfit, which" ^0
"is the very thing the in-sample number cannot tell you" ^0
"" ^0

"Accuracy is on real labels against a confusion matrix, threshold fixed, signed" ^0
"off - " + str(in_sample_accuracy_per_myriad) + " per ten thousand. It was scored on its own training rows, which a" ^0
"model can memorize, so " + str(unseen_rows_from_a_later_batch) + " unseen rows score " + str(out_of_sample_accuracy_per_myriad) + ", a gap of " ^0
"" + str(generalization_gap_per_myriad) + " per ten thousand under " + str(holdout_rows_held_back) + " rows held back." ^0
```

## Python (deterministic transpilation)

```python
rows_scored = 40000
rows_trained_on = 40000
holdout_rows_held_back = 0
in_sample_accuracy_per_myriad = 9820
unseen_rows_from_a_later_batch = 12000
out_of_sample_accuracy_per_myriad = 8730
generalization_gap_per_myriad = in_sample_accuracy_per_myriad - out_of_sample_accuracy_per_myriad
rows_called_right_in_sample = int(in_sample_accuracy_per_myriad * rows_scored / 10000)
unseen_rows_called_right = int(out_of_sample_accuracy_per_myriad * unseen_rows_from_a_later_batch / 10000)
print("rows scored                     : " + str(rows_scored))
print("rows trained on                 : " + str(rows_trained_on))
print("  held back for validation      : " + str(holdout_rows_held_back))
print("in-sample accuracy              : " + str(in_sample_accuracy_per_myriad) + " per ten thousand")
print("")
print("unseen rows from a later batch  : " + str(unseen_rows_from_a_later_batch))
print("out-of-sample accuracy          : " + str(out_of_sample_accuracy_per_myriad) + " per ten thousand")
print("  generalization gap            : " + str(generalization_gap_per_myriad) + " per ten thousand")
print("unseen rows called right        : " + str(unseen_rows_called_right))
print("")
print("the validation")
print("  accuracy on : real labels, not the model's guesses")
print("  checked against : a confusion matrix")
print("  threshold : fixed before scoring")
print("  sign-off : before release")
print("  rows called right : " + str(rows_called_right_in_sample))
print("  verdict : ACCURATE")
print("")
print("  fixing the threshold before scoring is the part almost")
print("  nobody resists moving, and it is why the number was not")
print("  tuned to itself")
print("")
print("the scoring set")
print("  which rows : the training rows")
print("  rows held back for a fair test : ")
print("    " + str(holdout_rows_held_back))
print("  what a model can do to those rows : memorize them")
print("  so a high score on them : measures recall of the")
print("    training set, not skill on new data")
print("  what it does not measure : generalization")
print("")
print("the rows the model never saw")
print("  count : " + str(unseen_rows_from_a_later_batch))
print("  accuracy on them : " + str(out_of_sample_accuracy_per_myriad) + " per ten thousand")
print("  the validation figure : " + str(in_sample_accuracy_per_myriad) + " per ten thousand")
print("  the drop : " + str(generalization_gap_per_myriad) + " per ten thousand")
print("  is the validation number wrong : no; it is a correct")
print("    in-sample accuracy")
print("  is it the number a buyer thinks they are getting : no")
print("")
nc_in_sample_per_myriad = 9820
nc_holdout_per_myriad = 8730
nc_number_that_changes_meaning = 1
print("null control - score on a withheld holdout")
print("  in-sample accuracy : " + str(nc_in_sample_per_myriad) + ", unchanged")
print("  holdout accuracy : " + str(nc_holdout_per_myriad) + " per ten thousand")
print("  numbers that change meaning : " + str(nc_number_that_changes_meaning))
print("  no row and no label changed; the scoring set stopped")
print("  being the set the model had already seen")
print("")
print("what a high validation accuracy guarantees")
print("  the model reproduces the labels it was scored on :")
print("    exactly, real labels, fixed threshold, signed off")
print("  the model generalizes : not addressed; the accuracy was")
print("    measured on the rows it was fit to, and a model can")
print("    memorize those - on " + str(unseen_rows_from_a_later_batch) + " unseen rows it scores ")
print("    " + str(out_of_sample_accuracy_per_myriad))
print("")
print("a score on the training set measures memory, and a score on held-out data")
print("measures skill; the two coincide only for a model that did not overfit, which")
print("is the very thing the in-sample number cannot tell you")
print("")
print("Accuracy is on real labels against a confusion matrix, threshold fixed, signed")
print("off - " + str(in_sample_accuracy_per_myriad) + " per ten thousand. It was scored on its own training rows, which a")
print("model can memorize, so " + str(unseen_rows_from_a_later_batch) + " unseen rows score " + str(out_of_sample_accuracy_per_myriad) + ", a gap of ")
print("" + str(generalization_gap_per_myriad) + " per ten thousand under " + str(holdout_rows_held_back) + " rows held back.")
```

## stdout (executed)

```text
rows scored                     : 40000
rows trained on                 : 40000
  held back for validation      : 0
in-sample accuracy              : 9820 per ten thousand

unseen rows from a later batch  : 12000
out-of-sample accuracy          : 8730 per ten thousand
  generalization gap            : 1090 per ten thousand
unseen rows called right        : 10476

the validation
  accuracy on : real labels, not the model's guesses
  checked against : a confusion matrix
  threshold : fixed before scoring
  sign-off : before release
  rows called right : 39280
  verdict : ACCURATE

  fixing the threshold before scoring is the part almost
  nobody resists moving, and it is why the number was not
  tuned to itself

the scoring set
  which rows : the training rows
  rows held back for a fair test : 
    0
  what a model can do to those rows : memorize them
  so a high score on them : measures recall of the
    training set, not skill on new data
  what it does not measure : generalization

the rows the model never saw
  count : 12000
  accuracy on them : 8730 per ten thousand
  the validation figure : 9820 per ten thousand
  the drop : 1090 per ten thousand
  is the validation number wrong : no; it is a correct
    in-sample accuracy
  is it the number a buyer thinks they are getting : no

null control - score on a withheld holdout
  in-sample accuracy : 9820, unchanged
  holdout accuracy : 8730 per ten thousand
  numbers that change meaning : 1
  no row and no label changed; the scoring set stopped
  being the set the model had already seen

what a high validation accuracy guarantees
  the model reproduces the labels it was scored on :
    exactly, real labels, fixed threshold, signed off
  the model generalizes : not addressed; the accuracy was
    measured on the rows it was fit to, and a model can
    memorize those - on 12000 unseen rows it scores 
    8730

a score on the training set measures memory, and a score on held-out data
measures skill; the two coincide only for a model that did not overfit, which
is the very thing the in-sample number cannot tell you

Accuracy is on real labels against a confusion matrix, threshold fixed, signed
off - 9820 per ten thousand. It was scored on its own training rows, which a
model can memorize, so 12000 unseen rows score 8730, a gap of 
1090 per ten thousand under 0 rows held back.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
