<!-- canonical: efficientnewlanguage.org/ai/examples/789-the-questionnaire-was-answered-by-the-vendor | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 789 — The questionnaire was answered by the vendor

`the_questionnaire_was_answered_by_the_vendor.eml` - Every vendor that touches customer data completes a one-hundred-and-eighty-question security review before a contract is signed, and forty-one have been rejected or made to remediate. Who writes the answers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every vendor that
# touches customer data completes a one-hundred-and-eighty-question security
# review before a contract is signed, and forty-one have been rejected or made
# to remediate. Who writes the answers is computed below.
#
# The programme is real. A review takes six hours of a reviewer's time rather
# than a checkbox; the questions were written by the security team and not
# bought as a template; a vendor cannot be onboarded while a review is open, and
# that block is in the procurement system rather than in a policy; and forty-one
# vendors in thirty-three months were stopped or made to change something.
#
# The answers are the vendor's. So is every document attached to them.

340 => vendors_reviewed
180 => questions_in_the_questionnaire
22 => questions_that_ask_for_a_document
0 => answers_checkable_without_the_vendor
6 => reviewer_hours_per_review
33 => months_the_programme_has_run
41 => vendors_rejected_or_made_to_remediate
0 => vendors_rejected_for_an_answer_shown_to_be_false
3 => breaches_at_a_reviewed_vendor
3 => those_breaches_in_an_area_the_questionnaire_covers

questions_in_the_questionnaire - questions_that_ask_for_a_document => questions_answered_by_assertion_alone
vendors_reviewed * questions_in_the_questionnaire => questions_asked_in_total
vendors_reviewed * reviewer_hours_per_review => reviewer_hours_spent
vendors_rejected_or_made_to_remediate - vendors_rejected_for_an_answer_shown_to_be_false => vendors_rejected_for_what_they_said
int(questions_that_ask_for_a_document * 10000 / questions_in_the_questionnaire) => document_backed_per_myriad
int(vendors_rejected_or_made_to_remediate * 10000 / vendors_reviewed) => rejected_per_myriad

"vendors reviewed                : " + str(vendors_reviewed) ^0
"questions per review            : " + str(questions_in_the_questionnaire) ^0
"  that ask for a document       : " + str(questions_that_ask_for_a_document) ^0
"  answered by assertion alone   : " + str(questions_answered_by_assertion_alone) ^0
"  document-backed               : " + str(document_backed_per_myriad) + " per ten thousand" ^0
"questions asked in total        : " + str(questions_asked_in_total) ^0
"answers checkable without them  : " + str(answers_checkable_without_the_vendor) ^0
"" ^0
"reviewer hours per review       : " + str(reviewer_hours_per_review) ^0
"reviewer hours spent            : " + str(reviewer_hours_spent) ^0
"months the programme has run    : " + str(months_the_programme_has_run) ^0
"" ^0
"vendors rejected or remediated  : " + str(vendors_rejected_or_made_to_remediate) ^0
"  rejected share                : " + str(rejected_per_myriad) + " per ten thousand" ^0
"  for what the vendor said      : " + str(vendors_rejected_for_what_they_said) ^0
"  for an answer shown to be false : " + str(vendors_rejected_for_an_answer_shown_to_be_false) ^0
"" ^0
"breaches at a reviewed vendor   : " + str(breaches_at_a_reviewed_vendor) ^0
"  in an area the questions cover: " + str(those_breaches_in_an_area_the_questionnaire_covers) ^0
"" ^0

# ---- what the programme verified ----

"the vendor security review" ^0
"  effort : " + str(reviewer_hours_per_review) + " reviewer hours each, not a checkbox" ^0
"  the questions : written by the security team, not a" ^0
"    bought template" ^0
"  the block : a vendor cannot be onboarded while a review" ^0
"    is open, and that is enforced in procurement rather" ^0
"    than written in a policy" ^0
"  stopped or changed in " + str(months_the_programme_has_run) + " months : " + str(vendors_rejected_or_made_to_remediate) ^0
"  verdict : REVIEWED" ^0
"" ^0
"  putting the block in the procurement system rather than" ^0
"  in a policy is the part almost nobody does, and it is" ^0
"  why the " + str(vendors_rejected_or_made_to_remediate) + " were actually stopped" ^0
"" ^0

# ---- whose word the evidence is ----

"where each answer comes from" ^0
"  who writes it : the vendor" ^0
"  who writes the attached document : the vendor" ^0
"  questions answered by assertion alone : " ^0
"    " + str(questions_answered_by_assertion_alone) + " of " + str(questions_in_the_questionnaire) ^0
"  answers checkable against something the vendor does" ^0
"    not control : " + str(answers_checkable_without_the_vendor) ^0
"  so what a completed review establishes : what they" ^0
"    said, in writing, on the record" ^0
"" ^0
"  the subject of the question and the author of the" ^0
"  answer are the same party" ^0
"" ^0

# ---- what the forty-one were rejected for ----

"the rejections" ^0
"  for answering no, or refusing to answer : " ^0
"    " + str(vendors_rejected_for_what_they_said) ^0
"  for an answer that was checked and found false : " ^0
"    " + str(vendors_rejected_for_an_answer_shown_to_be_false) ^0
"  what that pair means : the programme discriminates" ^0
"    between vendors who admit a gap and vendors who do" ^0
"    not, which is a real distinction and not the one the" ^0
"    questionnaire is about" ^0
"  a vendor with the same gap who answers yes : passes" ^0
"" ^0

# ---- what happened anyway ----

"breaches at vendors that passed" ^0
"  breaches : " + str(breaches_at_a_reviewed_vendor) ^0
"  in areas the questionnaire asks about : " ^0
"    " + str(those_breaches_in_an_area_the_questionnaire_covers) ^0
"  what those vendors had answered : yes" ^0
"  was the answer wrong when given : unknown; nothing" ^0
"    recorded the state at the time" ^0
"  did the review fail : no. It asked, and it recorded" ^0
"    the answer, and the answer is what it recorded" ^0
"" ^0

# ---- null control ----

# The same programme, plus a sample: twenty vendors, five answers each, checked
# against something the vendor does not control - their own public DNS and TLS
# configuration, published breach notifications, and a test we commission.
100 => nc_answers_checked_independently
9 => nc_answers_that_did_not_match
340 => nc_reviews_completed

"null control - check a sample against outside sources" ^0
"  reviews completed : " + str(nc_reviews_completed) + ", unchanged" ^0
"  answers checked independently : " + str(nc_answers_checked_independently) ^0
"  answers that did not match : " + str(nc_answers_that_did_not_match) ^0
"  the questionnaire did not get better; a second author" ^0
"  was found for a hundred of its answers" ^0
"" ^0

# ---- the rule ----

"what a completed vendor review guarantees" ^0
"  the vendor stated that they do these things : exactly," ^0
"    " + str(questions_in_the_questionnaire) + " questions, " + str(reviewer_hours_per_review) + " hours, on the record, and " ^0
"    " + str(vendors_rejected_or_made_to_remediate) + " were stopped over what they stated" ^0
"  the vendor does these things : not addressed; the" ^0
"    answer and the thing it is about have the same" ^0
"    author, and " + str(answers_checkable_without_the_vendor) + " answers are checkable without them" ^0
"" ^0
"asking carefully is not the same as finding out; a review" ^0
"whose every input is written by its subject measures what" ^0
"the subject is willing to write down" ^0
"" ^0

"The questions were written in-house, a review costs " + str(reviewer_hours_per_review) + " reviewer hours, onboarding is" ^0
"blocked in procurement while one is open, and " + str(vendors_rejected_or_made_to_remediate) + " vendors were stopped in " + str(months_the_programme_has_run) ^0
"months. Every answer and every attached document is the vendor's own - " ^0
"" + str(questions_answered_by_assertion_alone) + " of " + str(questions_in_the_questionnaire) + " questions carry no document at all, " + str(answers_checkable_without_the_vendor) + " answers are checkable" ^0
"without them, and " + str(vendors_rejected_for_an_answer_shown_to_be_false) + " of the " + str(vendors_rejected_or_made_to_remediate) + " were rejected for saying something untrue." ^0
```

## Python (deterministic transpilation)

```python
vendors_reviewed = 340
questions_in_the_questionnaire = 180
questions_that_ask_for_a_document = 22
answers_checkable_without_the_vendor = 0
reviewer_hours_per_review = 6
months_the_programme_has_run = 33
vendors_rejected_or_made_to_remediate = 41
vendors_rejected_for_an_answer_shown_to_be_false = 0
breaches_at_a_reviewed_vendor = 3
those_breaches_in_an_area_the_questionnaire_covers = 3
questions_answered_by_assertion_alone = questions_in_the_questionnaire - questions_that_ask_for_a_document
questions_asked_in_total = vendors_reviewed * questions_in_the_questionnaire
reviewer_hours_spent = vendors_reviewed * reviewer_hours_per_review
vendors_rejected_for_what_they_said = vendors_rejected_or_made_to_remediate - vendors_rejected_for_an_answer_shown_to_be_false
document_backed_per_myriad = int(questions_that_ask_for_a_document * 10000 / questions_in_the_questionnaire)
rejected_per_myriad = int(vendors_rejected_or_made_to_remediate * 10000 / vendors_reviewed)
print("vendors reviewed                : " + str(vendors_reviewed))
print("questions per review            : " + str(questions_in_the_questionnaire))
print("  that ask for a document       : " + str(questions_that_ask_for_a_document))
print("  answered by assertion alone   : " + str(questions_answered_by_assertion_alone))
print("  document-backed               : " + str(document_backed_per_myriad) + " per ten thousand")
print("questions asked in total        : " + str(questions_asked_in_total))
print("answers checkable without them  : " + str(answers_checkable_without_the_vendor))
print("")
print("reviewer hours per review       : " + str(reviewer_hours_per_review))
print("reviewer hours spent            : " + str(reviewer_hours_spent))
print("months the programme has run    : " + str(months_the_programme_has_run))
print("")
print("vendors rejected or remediated  : " + str(vendors_rejected_or_made_to_remediate))
print("  rejected share                : " + str(rejected_per_myriad) + " per ten thousand")
print("  for what the vendor said      : " + str(vendors_rejected_for_what_they_said))
print("  for an answer shown to be false : " + str(vendors_rejected_for_an_answer_shown_to_be_false))
print("")
print("breaches at a reviewed vendor   : " + str(breaches_at_a_reviewed_vendor))
print("  in an area the questions cover: " + str(those_breaches_in_an_area_the_questionnaire_covers))
print("")
print("the vendor security review")
print("  effort : " + str(reviewer_hours_per_review) + " reviewer hours each, not a checkbox")
print("  the questions : written by the security team, not a")
print("    bought template")
print("  the block : a vendor cannot be onboarded while a review")
print("    is open, and that is enforced in procurement rather")
print("    than written in a policy")
print("  stopped or changed in " + str(months_the_programme_has_run) + " months : " + str(vendors_rejected_or_made_to_remediate))
print("  verdict : REVIEWED")
print("")
print("  putting the block in the procurement system rather than")
print("  in a policy is the part almost nobody does, and it is")
print("  why the " + str(vendors_rejected_or_made_to_remediate) + " were actually stopped")
print("")
print("where each answer comes from")
print("  who writes it : the vendor")
print("  who writes the attached document : the vendor")
print("  questions answered by assertion alone : ")
print("    " + str(questions_answered_by_assertion_alone) + " of " + str(questions_in_the_questionnaire))
print("  answers checkable against something the vendor does")
print("    not control : " + str(answers_checkable_without_the_vendor))
print("  so what a completed review establishes : what they")
print("    said, in writing, on the record")
print("")
print("  the subject of the question and the author of the")
print("  answer are the same party")
print("")
print("the rejections")
print("  for answering no, or refusing to answer : ")
print("    " + str(vendors_rejected_for_what_they_said))
print("  for an answer that was checked and found false : ")
print("    " + str(vendors_rejected_for_an_answer_shown_to_be_false))
print("  what that pair means : the programme discriminates")
print("    between vendors who admit a gap and vendors who do")
print("    not, which is a real distinction and not the one the")
print("    questionnaire is about")
print("  a vendor with the same gap who answers yes : passes")
print("")
print("breaches at vendors that passed")
print("  breaches : " + str(breaches_at_a_reviewed_vendor))
print("  in areas the questionnaire asks about : ")
print("    " + str(those_breaches_in_an_area_the_questionnaire_covers))
print("  what those vendors had answered : yes")
print("  was the answer wrong when given : unknown; nothing")
print("    recorded the state at the time")
print("  did the review fail : no. It asked, and it recorded")
print("    the answer, and the answer is what it recorded")
print("")
nc_answers_checked_independently = 100
nc_answers_that_did_not_match = 9
nc_reviews_completed = 340
print("null control - check a sample against outside sources")
print("  reviews completed : " + str(nc_reviews_completed) + ", unchanged")
print("  answers checked independently : " + str(nc_answers_checked_independently))
print("  answers that did not match : " + str(nc_answers_that_did_not_match))
print("  the questionnaire did not get better; a second author")
print("  was found for a hundred of its answers")
print("")
print("what a completed vendor review guarantees")
print("  the vendor stated that they do these things : exactly,")
print("    " + str(questions_in_the_questionnaire) + " questions, " + str(reviewer_hours_per_review) + " hours, on the record, and ")
print("    " + str(vendors_rejected_or_made_to_remediate) + " were stopped over what they stated")
print("  the vendor does these things : not addressed; the")
print("    answer and the thing it is about have the same")
print("    author, and " + str(answers_checkable_without_the_vendor) + " answers are checkable without them")
print("")
print("asking carefully is not the same as finding out; a review")
print("whose every input is written by its subject measures what")
print("the subject is willing to write down")
print("")
print("The questions were written in-house, a review costs " + str(reviewer_hours_per_review) + " reviewer hours, onboarding is")
print("blocked in procurement while one is open, and " + str(vendors_rejected_or_made_to_remediate) + " vendors were stopped in " + str(months_the_programme_has_run))
print("months. Every answer and every attached document is the vendor's own - ")
print("" + str(questions_answered_by_assertion_alone) + " of " + str(questions_in_the_questionnaire) + " questions carry no document at all, " + str(answers_checkable_without_the_vendor) + " answers are checkable")
print("without them, and " + str(vendors_rejected_for_an_answer_shown_to_be_false) + " of the " + str(vendors_rejected_or_made_to_remediate) + " were rejected for saying something untrue.")
```

## stdout (executed)

```text
vendors reviewed                : 340
questions per review            : 180
  that ask for a document       : 22
  answered by assertion alone   : 158
  document-backed               : 1222 per ten thousand
questions asked in total        : 61200
answers checkable without them  : 0

reviewer hours per review       : 6
reviewer hours spent            : 2040
months the programme has run    : 33

vendors rejected or remediated  : 41
  rejected share                : 1205 per ten thousand
  for what the vendor said      : 41
  for an answer shown to be false : 0

breaches at a reviewed vendor   : 3
  in an area the questions cover: 3

the vendor security review
  effort : 6 reviewer hours each, not a checkbox
  the questions : written by the security team, not a
    bought template
  the block : a vendor cannot be onboarded while a review
    is open, and that is enforced in procurement rather
    than written in a policy
  stopped or changed in 33 months : 41
  verdict : REVIEWED

  putting the block in the procurement system rather than
  in a policy is the part almost nobody does, and it is
  why the 41 were actually stopped

where each answer comes from
  who writes it : the vendor
  who writes the attached document : the vendor
  questions answered by assertion alone : 
    158 of 180
  answers checkable against something the vendor does
    not control : 0
  so what a completed review establishes : what they
    said, in writing, on the record

  the subject of the question and the author of the
  answer are the same party

the rejections
  for answering no, or refusing to answer : 
    41
  for an answer that was checked and found false : 
    0
  what that pair means : the programme discriminates
    between vendors who admit a gap and vendors who do
    not, which is a real distinction and not the one the
    questionnaire is about
  a vendor with the same gap who answers yes : passes

breaches at vendors that passed
  breaches : 3
  in areas the questionnaire asks about : 
    3
  what those vendors had answered : yes
  was the answer wrong when given : unknown; nothing
    recorded the state at the time
  did the review fail : no. It asked, and it recorded
    the answer, and the answer is what it recorded

null control - check a sample against outside sources
  reviews completed : 340, unchanged
  answers checked independently : 100
  answers that did not match : 9
  the questionnaire did not get better; a second author
  was found for a hundred of its answers

what a completed vendor review guarantees
  the vendor stated that they do these things : exactly,
    180 questions, 6 hours, on the record, and 
    41 were stopped over what they stated
  the vendor does these things : not addressed; the
    answer and the thing it is about have the same
    author, and 0 answers are checkable without them

asking carefully is not the same as finding out; a review
whose every input is written by its subject measures what
the subject is willing to write down

The questions were written in-house, a review costs 6 reviewer hours, onboarding is
blocked in procurement while one is open, and 41 vendors were stopped in 33
months. Every answer and every attached document is the vendor's own - 
158 of 180 questions carry no document at all, 0 answers are checkable
without them, and 0 of the 41 were rejected for saying something untrue.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
