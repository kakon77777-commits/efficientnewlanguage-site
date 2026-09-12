<!-- canonical: efficientnewlanguage.org/ai/examples/820-the-translation-was-checked-by-translating-it-back | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 820 — The translation was checked by translating it back

`the_translation_was_checked_by_translating_it_back.eml` - The translation passed its round-trip check on 97 of every 100 sentences, and the check is real. What does the translating back is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The translation
# passed its round-trip check on 97 of every 100 sentences, and the check is
# real. What does the translating back is computed below.
#
# The check is run on everything. Every sentence is translated back to the
# source and compared; the comparison is not fuzzy-graded into a pass; a
# mismatch is queued for human review; and the pass rate is tracked per release.
#
# The back-translation uses the same model as the forward translation.

5000 => sentences
4850 => back_translation_matched
620 => mistranslations_a_human_found
40 => of_those_the_back_translation_caught

int(back_translation_matched * 10000 / sentences) => round_trip_match_per_myriad
sentences - mistranslations_a_human_found => sentences_actually_faithful
int(sentences_actually_faithful * 10000 / sentences) => true_fidelity_per_myriad
mistranslations_a_human_found - of_those_the_back_translation_caught => mistranslations_that_round_tripped_cleanly

"sentences                       : " + str(sentences) ^0
"  back-translation matched      : " + str(back_translation_matched) ^0
"round-trip match rate           : " + str(round_trip_match_per_myriad) + " per ten thousand" ^0
"" ^0
"mistranslations a human found   : " + str(mistranslations_a_human_found) ^0
"  the back-translation caught   : " + str(of_those_the_back_translation_caught) ^0
"  that round-tripped cleanly    : " + str(mistranslations_that_round_tripped_cleanly) ^0
"true fidelity                   : " + str(true_fidelity_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the round-trip verified ----

"the round-trip check" ^0
"  coverage : every sentence" ^0
"  comparison : exact, not fuzzy-graded into a pass" ^0
"  on a mismatch : queued for human review" ^0
"  tracked : per release" ^0
"  sentences that matched on return : " + str(back_translation_matched) ^0
"  verdict : FAITHFUL" ^0
"" ^0
"  refusing to fuzzy-grade the comparison is the part" ^0
"  almost nobody holds to, and it is why a match is not" ^0
"  quietly inflated" ^0
"" ^0

# ---- what does the translating back ----

"the back-translation" ^0
"  model forward : the translation model" ^0
"  model back : the same one" ^0
"  a systematic error it makes : it makes in reverse too" ^0
"  so a wrong rendering : is translated back to the" ^0
"    original wrongly-but-consistently, and matches" ^0
"  mistranslations that survived the round trip : " ^0
"    " + str(mistranslations_that_round_tripped_cleanly) ^0
"" ^0

# ---- what a reader of the target gets ----

"the reader in the target language" ^0
"  sentences a human judged wrong : " ^0
"    " + str(mistranslations_a_human_found) ^0
"  of those the check flagged : " ^0
"    " + str(of_those_the_back_translation_caught) ^0
"  is the round-trip metric wrong : no; the strings do" ^0
"    match on return" ^0
"  what a match means here : the model agrees with itself," ^0
"    not that the meaning survived" ^0
"  true fidelity to a human : " + str(true_fidelity_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same sentences, back-translated by a different model so the reverse pass
# does not repeat the forward pass's errors.
9700 => nc_round_trip_same_model_per_myriad
8804 => nc_round_trip_different_model_per_myriad
580 => nc_mistranslations_it_would_flag

"null control - back-translate with a different model" ^0
"  round-trip, same model : " + str(nc_round_trip_same_model_per_myriad) + ", unchanged" ^0
"  round-trip, a different model : " ^0
"    " + str(nc_round_trip_different_model_per_myriad) + " per ten thousand" ^0
"  mistranslations it would flag : " ^0
"    " + str(nc_mistranslations_it_would_flag) ^0
"  no sentence changed; the reverse pass stopped sharing" ^0
"  the forward pass's blind spots" ^0
"" ^0

# ---- the rule ----

"what a passing round-trip check guarantees" ^0
"  the sentence returns to its original : exactly, on " ^0
"    " + str(back_translation_matched) + " of " + str(sentences) + ", exact comparison, humans on the rest" ^0
"  the translation is faithful : not addressed; the check" ^0
"    translates back with the same model, which repeats its" ^0
"    own errors in reverse, so " + str(mistranslations_that_round_tripped_cleanly) + " of them round-trip" ^0
"    cleanly" ^0
"" ^0

"a round trip through one model tests the model against itself, and a systematic" ^0
"error is exactly what a system does the same way every time; the return journey" ^0
"undoes the mistake it also makes" ^0
"" ^0

"Every sentence is back-translated and compared exactly, mismatches sent to" ^0
"humans - " + str(round_trip_match_per_myriad) + " per ten thousand match. The back-translation is the same model," ^0
"so it repeats its own errors in reverse: " + str(mistranslations_that_round_tripped_cleanly) + " mistranslations round-tripped" ^0
"cleanly, leaving true fidelity at " + str(true_fidelity_per_myriad) + " per ten thousand." ^0
```

## Python (deterministic transpilation)

```python
sentences = 5000
back_translation_matched = 4850
mistranslations_a_human_found = 620
of_those_the_back_translation_caught = 40
round_trip_match_per_myriad = int(back_translation_matched * 10000 / sentences)
sentences_actually_faithful = sentences - mistranslations_a_human_found
true_fidelity_per_myriad = int(sentences_actually_faithful * 10000 / sentences)
mistranslations_that_round_tripped_cleanly = mistranslations_a_human_found - of_those_the_back_translation_caught
print("sentences                       : " + str(sentences))
print("  back-translation matched      : " + str(back_translation_matched))
print("round-trip match rate           : " + str(round_trip_match_per_myriad) + " per ten thousand")
print("")
print("mistranslations a human found   : " + str(mistranslations_a_human_found))
print("  the back-translation caught   : " + str(of_those_the_back_translation_caught))
print("  that round-tripped cleanly    : " + str(mistranslations_that_round_tripped_cleanly))
print("true fidelity                   : " + str(true_fidelity_per_myriad) + " per ten thousand")
print("")
print("the round-trip check")
print("  coverage : every sentence")
print("  comparison : exact, not fuzzy-graded into a pass")
print("  on a mismatch : queued for human review")
print("  tracked : per release")
print("  sentences that matched on return : " + str(back_translation_matched))
print("  verdict : FAITHFUL")
print("")
print("  refusing to fuzzy-grade the comparison is the part")
print("  almost nobody holds to, and it is why a match is not")
print("  quietly inflated")
print("")
print("the back-translation")
print("  model forward : the translation model")
print("  model back : the same one")
print("  a systematic error it makes : it makes in reverse too")
print("  so a wrong rendering : is translated back to the")
print("    original wrongly-but-consistently, and matches")
print("  mistranslations that survived the round trip : ")
print("    " + str(mistranslations_that_round_tripped_cleanly))
print("")
print("the reader in the target language")
print("  sentences a human judged wrong : ")
print("    " + str(mistranslations_a_human_found))
print("  of those the check flagged : ")
print("    " + str(of_those_the_back_translation_caught))
print("  is the round-trip metric wrong : no; the strings do")
print("    match on return")
print("  what a match means here : the model agrees with itself,")
print("    not that the meaning survived")
print("  true fidelity to a human : " + str(true_fidelity_per_myriad) + " per ten thousand")
print("")
nc_round_trip_same_model_per_myriad = 9700
nc_round_trip_different_model_per_myriad = 8804
nc_mistranslations_it_would_flag = 580
print("null control - back-translate with a different model")
print("  round-trip, same model : " + str(nc_round_trip_same_model_per_myriad) + ", unchanged")
print("  round-trip, a different model : ")
print("    " + str(nc_round_trip_different_model_per_myriad) + " per ten thousand")
print("  mistranslations it would flag : ")
print("    " + str(nc_mistranslations_it_would_flag))
print("  no sentence changed; the reverse pass stopped sharing")
print("  the forward pass's blind spots")
print("")
print("what a passing round-trip check guarantees")
print("  the sentence returns to its original : exactly, on ")
print("    " + str(back_translation_matched) + " of " + str(sentences) + ", exact comparison, humans on the rest")
print("  the translation is faithful : not addressed; the check")
print("    translates back with the same model, which repeats its")
print("    own errors in reverse, so " + str(mistranslations_that_round_tripped_cleanly) + " of them round-trip")
print("    cleanly")
print("")
print("a round trip through one model tests the model against itself, and a systematic")
print("error is exactly what a system does the same way every time; the return journey")
print("undoes the mistake it also makes")
print("")
print("Every sentence is back-translated and compared exactly, mismatches sent to")
print("humans - " + str(round_trip_match_per_myriad) + " per ten thousand match. The back-translation is the same model,")
print("so it repeats its own errors in reverse: " + str(mistranslations_that_round_tripped_cleanly) + " mistranslations round-tripped")
print("cleanly, leaving true fidelity at " + str(true_fidelity_per_myriad) + " per ten thousand.")
```

## stdout (executed)

```text
sentences                       : 5000
  back-translation matched      : 4850
round-trip match rate           : 9700 per ten thousand

mistranslations a human found   : 620
  the back-translation caught   : 40
  that round-tripped cleanly    : 580
true fidelity                   : 8760 per ten thousand

the round-trip check
  coverage : every sentence
  comparison : exact, not fuzzy-graded into a pass
  on a mismatch : queued for human review
  tracked : per release
  sentences that matched on return : 4850
  verdict : FAITHFUL

  refusing to fuzzy-grade the comparison is the part
  almost nobody holds to, and it is why a match is not
  quietly inflated

the back-translation
  model forward : the translation model
  model back : the same one
  a systematic error it makes : it makes in reverse too
  so a wrong rendering : is translated back to the
    original wrongly-but-consistently, and matches
  mistranslations that survived the round trip : 
    580

the reader in the target language
  sentences a human judged wrong : 
    620
  of those the check flagged : 
    40
  is the round-trip metric wrong : no; the strings do
    match on return
  what a match means here : the model agrees with itself,
    not that the meaning survived
  true fidelity to a human : 8760 per ten thousand

null control - back-translate with a different model
  round-trip, same model : 9700, unchanged
  round-trip, a different model : 
    8804 per ten thousand
  mistranslations it would flag : 
    580
  no sentence changed; the reverse pass stopped sharing
  the forward pass's blind spots

what a passing round-trip check guarantees
  the sentence returns to its original : exactly, on 
    4850 of 5000, exact comparison, humans on the rest
  the translation is faithful : not addressed; the check
    translates back with the same model, which repeats its
    own errors in reverse, so 580 of them round-trip
    cleanly

a round trip through one model tests the model against itself, and a systematic
error is exactly what a system does the same way every time; the return journey
undoes the mistake it also makes

Every sentence is back-translated and compared exactly, mismatches sent to
humans - 9700 per ten thousand match. The back-translation is the same model,
so it repeats its own errors in reverse: 580 mistranslations round-tripped
cleanly, leaving true fidelity at 8760 per ten thousand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
