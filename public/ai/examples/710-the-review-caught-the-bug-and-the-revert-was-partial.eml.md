<!-- canonical: efficientnewlanguage.org/ai/examples/710-the-review-caught-the-bug-and-the-revert-was-partial | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 710 — The review caught the bug and the revert was partial

`the_review_caught_the_bug_and_the_revert_was_partial.eml` - A reviewer found the defect, the author agreed, and the commit was reverted cleanly before release. What the revert removed is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A reviewer found
# the defect, the author agreed, and the commit was reverted cleanly before
# release. What the revert removed is computed below.
#
# The review worked exactly as it is supposed to. A human reading a diff
# noticed that a comparison was wrong, said so, and was right; the author
# agreed within the hour; the offending commit was reverted; the revert applied
# with no conflict; a second reviewer confirmed the reverting diff was the
# exact inverse of the original; and the full suite was green afterwards. Three
# hundred forty defects were caught this way this year.
#
# A revert is the inverse of a DIFF. It restores the lines that commit changed,
# and in the twenty-six days between the commit and the review the function had
# been extracted and called from two more places.
#
# The revert removed one of the three call sites.

340 => defects_caught_in_review_this_year
0 => conflicts_when_the_revert_applied
1 => second_reviewers_confirming_the_inverse
0 => failing_tests_after_the_revert
26 => days_between_the_commit_and_the_review
14 => commits_touching_the_file_in_between
1 => call_sites_when_the_defect_was_introduced
3 => call_sites_when_the_revert_was_written
1 => call_sites_the_revert_removed
0 => tests_asserting_the_defective_behaviour_is_gone

call_sites_when_the_revert_was_written - call_sites_the_revert_removed => call_sites_remaining
int(call_sites_remaining * 10000 / call_sites_when_the_revert_was_written) => remaining_per_myriad

"defects caught in review this year : " + str(defects_caught_in_review_this_year) ^0
"conflicts when the revert applied  : " + str(conflicts_when_the_revert_applied) ^0
"second reviewers confirming the inverse : " + str(second_reviewers_confirming_the_inverse) ^0
"failing tests after the revert     : " + str(failing_tests_after_the_revert) ^0
"" ^0
"days between the commit and the review : " + str(days_between_the_commit_and_the_review) ^0
"commits touching the file in between   : " + str(commits_touching_the_file_in_between) ^0
"" ^0
"call sites when the defect was introduced : " + str(call_sites_when_the_defect_was_introduced) ^0
"call sites when the revert was written    : " + str(call_sites_when_the_revert_was_written) ^0
"  removed by the revert                   : " + str(call_sites_the_revert_removed) ^0
"  remaining                               : " + str(call_sites_remaining) ^0
"  share remaining                         : " + str(remaining_per_myriad) + " per ten thousand" ^0
"tests asserting the behaviour is gone     : " + str(tests_asserting_the_defective_behaviour_is_gone) ^0
"" ^0

# ---- what the review verified ----

"the review" ^0
"  found by : a person reading the diff" ^0
"  the finding : a comparison that was wrong" ^0
"  was it right : yes, and the author agreed within the hour" ^0
"  defects caught this way this year : " + str(defects_caught_in_review_this_year) ^0
"  verdict : CAUGHT" ^0
"" ^0
"  a reviewer who reads carefully enough to find a wrong" ^0
"  comparison is the most valuable thing in this list" ^0
"" ^0

# ---- what the revert verified ----

"the revert" ^0
"  applied with conflicts : " + str(conflicts_when_the_revert_applied) ^0
"  confirmed as the exact inverse of the original diff : by" ^0
"    " + str(second_reviewers_confirming_the_inverse) + " second reviewer" ^0
"  suite after it : " + str(failing_tests_after_the_revert) + " failing" ^0
"  what it restored : the lines that commit changed" ^0
"  verdict : INVERTED" ^0
"" ^0
"  every one of those checks passed, and each of them is a" ^0
"  statement about the diff" ^0
"" ^0
# ---- what happened in twenty-six days ----

# The function was extracted during a refactor and called from two more places.
# Both later commits are good commits. Neither knew it was copying a defect,
# because the defect had not been found yet.
"the file between the commit and the review" ^0
"  commits touching it : " + str(commits_touching_the_file_in_between) ^0
"  the logic was       : extracted into a function" ^0
"  callers added       : two, in ordinary feature work" ^0
"  did either author know : no; nobody knew yet" ^0
"  call sites at review time : " + str(call_sites_when_the_revert_was_written) ^0
"" ^0

# ---- why the revert applied cleanly ----

# A clean apply means the lines the commit touched are still recognisable. It
# does not mean they are the only lines with that behaviour. The two copies are
# in files the original commit never touched, so there is nothing to conflict
# with.
"the clean apply" ^0
"  what a conflict would indicate : the original lines moved" ^0
"  what a clean apply indicates   : they did not" ^0
"  what either indicates about copies elsewhere : nothing" ^0
"  files the original commit touched : the one it touched" ^0
"  files the copies live in : two others" ^0
"" ^0

# ---- why the suite stayed green ----

# The suite was green before the defective commit and green after it, which is
# why review caught it rather than a test. Reverting one of three call sites
# changes nothing a test asserts.
"the suite" ^0
"  green before the defect : yes" ^0
"  green after the defect  : yes, which is why a human" ^0
"    found it and not a test" ^0
"  green after the revert  : yes" ^0
"  tests asserting the behaviour is gone : " + str(tests_asserting_the_defective_behaviour_is_gone) ^0
"  so the suite is measuring : that nothing else broke" ^0
"" ^0

# ---- null control ----

# The same finding, written down as a failing test first: a test that asserts
# the correct comparison, added before any code changes, and the fix is
# whatever makes it pass.
call_sites_when_the_revert_was_written => nc_call_sites_the_fix_removed
0 => nc_call_sites_remaining
1 => nc_tests_asserting_the_defective_behaviour_is_gone

"null control - the finding is written as a failing test" ^0
"  defect found by review : the same reviewer, unchanged" ^0
"  tests asserting the behaviour is gone : " + str(nc_tests_asserting_the_defective_behaviour_is_gone) ^0
"  call sites the fix must reach : " + str(nc_call_sites_the_fix_removed) ^0
"  call sites remaining : " + str(nc_call_sites_remaining) ^0
"  the review did not get better; the finding stopped being" ^0
"  addressed to a commit and started being addressed to a" ^0
"  behaviour" ^0
"" ^0

# ---- the rule ----

"what a clean revert guarantees" ^0
"  the tree no longer contains that commit's changes :" ^0
"    exactly, and it was confirmed line by line" ^0
"  the defect is gone                                : not" ^0
"    addressed; a commit is a location in a history and a" ^0
"    defect is a behaviour that can be copied" ^0
"" ^0
"a fix aimed at a commit is aimed at the place the defect was" ^0
"introduced; between introduction and discovery the code" ^0
"moves, and only a test names the behaviour rather than the" ^0
"place" ^0
"" ^0

"The review did the hard part: a person read the diff, found a wrong comparison," ^0
"was right, and " + str(defects_caught_in_review_this_year) + " defects were caught this way this year. The revert" ^0
"applied with " + str(conflicts_when_the_revert_applied) + " conflicts, was confirmed as the exact inverse of the original," ^0
"and left " + str(failing_tests_after_the_revert) + " tests failing - and in the " + str(days_between_the_commit_and_the_review) + " days and " + str(commits_touching_the_file_in_between) + " commits since, the logic" ^0
"had been extracted, so " + str(call_sites_remaining) + " of " + str(call_sites_when_the_revert_was_written) + " call sites - " + str(remaining_per_myriad) + " per ten thousand -" ^0
"survived, with " + str(tests_asserting_the_defective_behaviour_is_gone) + " tests naming the behaviour." ^0
```

## Python (deterministic transpilation)

```python
defects_caught_in_review_this_year = 340
conflicts_when_the_revert_applied = 0
second_reviewers_confirming_the_inverse = 1
failing_tests_after_the_revert = 0
days_between_the_commit_and_the_review = 26
commits_touching_the_file_in_between = 14
call_sites_when_the_defect_was_introduced = 1
call_sites_when_the_revert_was_written = 3
call_sites_the_revert_removed = 1
tests_asserting_the_defective_behaviour_is_gone = 0
call_sites_remaining = call_sites_when_the_revert_was_written - call_sites_the_revert_removed
remaining_per_myriad = int(call_sites_remaining * 10000 / call_sites_when_the_revert_was_written)
print("defects caught in review this year : " + str(defects_caught_in_review_this_year))
print("conflicts when the revert applied  : " + str(conflicts_when_the_revert_applied))
print("second reviewers confirming the inverse : " + str(second_reviewers_confirming_the_inverse))
print("failing tests after the revert     : " + str(failing_tests_after_the_revert))
print("")
print("days between the commit and the review : " + str(days_between_the_commit_and_the_review))
print("commits touching the file in between   : " + str(commits_touching_the_file_in_between))
print("")
print("call sites when the defect was introduced : " + str(call_sites_when_the_defect_was_introduced))
print("call sites when the revert was written    : " + str(call_sites_when_the_revert_was_written))
print("  removed by the revert                   : " + str(call_sites_the_revert_removed))
print("  remaining                               : " + str(call_sites_remaining))
print("  share remaining                         : " + str(remaining_per_myriad) + " per ten thousand")
print("tests asserting the behaviour is gone     : " + str(tests_asserting_the_defective_behaviour_is_gone))
print("")
print("the review")
print("  found by : a person reading the diff")
print("  the finding : a comparison that was wrong")
print("  was it right : yes, and the author agreed within the hour")
print("  defects caught this way this year : " + str(defects_caught_in_review_this_year))
print("  verdict : CAUGHT")
print("")
print("  a reviewer who reads carefully enough to find a wrong")
print("  comparison is the most valuable thing in this list")
print("")
print("the revert")
print("  applied with conflicts : " + str(conflicts_when_the_revert_applied))
print("  confirmed as the exact inverse of the original diff : by")
print("    " + str(second_reviewers_confirming_the_inverse) + " second reviewer")
print("  suite after it : " + str(failing_tests_after_the_revert) + " failing")
print("  what it restored : the lines that commit changed")
print("  verdict : INVERTED")
print("")
print("  every one of those checks passed, and each of them is a")
print("  statement about the diff")
print("")
print("the file between the commit and the review")
print("  commits touching it : " + str(commits_touching_the_file_in_between))
print("  the logic was       : extracted into a function")
print("  callers added       : two, in ordinary feature work")
print("  did either author know : no; nobody knew yet")
print("  call sites at review time : " + str(call_sites_when_the_revert_was_written))
print("")
print("the clean apply")
print("  what a conflict would indicate : the original lines moved")
print("  what a clean apply indicates   : they did not")
print("  what either indicates about copies elsewhere : nothing")
print("  files the original commit touched : the one it touched")
print("  files the copies live in : two others")
print("")
print("the suite")
print("  green before the defect : yes")
print("  green after the defect  : yes, which is why a human")
print("    found it and not a test")
print("  green after the revert  : yes")
print("  tests asserting the behaviour is gone : " + str(tests_asserting_the_defective_behaviour_is_gone))
print("  so the suite is measuring : that nothing else broke")
print("")
nc_call_sites_the_fix_removed = call_sites_when_the_revert_was_written
nc_call_sites_remaining = 0
nc_tests_asserting_the_defective_behaviour_is_gone = 1
print("null control - the finding is written as a failing test")
print("  defect found by review : the same reviewer, unchanged")
print("  tests asserting the behaviour is gone : " + str(nc_tests_asserting_the_defective_behaviour_is_gone))
print("  call sites the fix must reach : " + str(nc_call_sites_the_fix_removed))
print("  call sites remaining : " + str(nc_call_sites_remaining))
print("  the review did not get better; the finding stopped being")
print("  addressed to a commit and started being addressed to a")
print("  behaviour")
print("")
print("what a clean revert guarantees")
print("  the tree no longer contains that commit's changes :")
print("    exactly, and it was confirmed line by line")
print("  the defect is gone                                : not")
print("    addressed; a commit is a location in a history and a")
print("    defect is a behaviour that can be copied")
print("")
print("a fix aimed at a commit is aimed at the place the defect was")
print("introduced; between introduction and discovery the code")
print("moves, and only a test names the behaviour rather than the")
print("place")
print("")
print("The review did the hard part: a person read the diff, found a wrong comparison,")
print("was right, and " + str(defects_caught_in_review_this_year) + " defects were caught this way this year. The revert")
print("applied with " + str(conflicts_when_the_revert_applied) + " conflicts, was confirmed as the exact inverse of the original,")
print("and left " + str(failing_tests_after_the_revert) + " tests failing - and in the " + str(days_between_the_commit_and_the_review) + " days and " + str(commits_touching_the_file_in_between) + " commits since, the logic")
print("had been extracted, so " + str(call_sites_remaining) + " of " + str(call_sites_when_the_revert_was_written) + " call sites - " + str(remaining_per_myriad) + " per ten thousand -")
print("survived, with " + str(tests_asserting_the_defective_behaviour_is_gone) + " tests naming the behaviour.")
```

## stdout (executed)

```text
defects caught in review this year : 340
conflicts when the revert applied  : 0
second reviewers confirming the inverse : 1
failing tests after the revert     : 0

days between the commit and the review : 26
commits touching the file in between   : 14

call sites when the defect was introduced : 1
call sites when the revert was written    : 3
  removed by the revert                   : 1
  remaining                               : 2
  share remaining                         : 6666 per ten thousand
tests asserting the behaviour is gone     : 0

the review
  found by : a person reading the diff
  the finding : a comparison that was wrong
  was it right : yes, and the author agreed within the hour
  defects caught this way this year : 340
  verdict : CAUGHT

  a reviewer who reads carefully enough to find a wrong
  comparison is the most valuable thing in this list

the revert
  applied with conflicts : 0
  confirmed as the exact inverse of the original diff : by
    1 second reviewer
  suite after it : 0 failing
  what it restored : the lines that commit changed
  verdict : INVERTED

  every one of those checks passed, and each of them is a
  statement about the diff

the file between the commit and the review
  commits touching it : 14
  the logic was       : extracted into a function
  callers added       : two, in ordinary feature work
  did either author know : no; nobody knew yet
  call sites at review time : 3

the clean apply
  what a conflict would indicate : the original lines moved
  what a clean apply indicates   : they did not
  what either indicates about copies elsewhere : nothing
  files the original commit touched : the one it touched
  files the copies live in : two others

the suite
  green before the defect : yes
  green after the defect  : yes, which is why a human
    found it and not a test
  green after the revert  : yes
  tests asserting the behaviour is gone : 0
  so the suite is measuring : that nothing else broke

null control - the finding is written as a failing test
  defect found by review : the same reviewer, unchanged
  tests asserting the behaviour is gone : 1
  call sites the fix must reach : 3
  call sites remaining : 0
  the review did not get better; the finding stopped being
  addressed to a commit and started being addressed to a
  behaviour

what a clean revert guarantees
  the tree no longer contains that commit's changes :
    exactly, and it was confirmed line by line
  the defect is gone                                : not
    addressed; a commit is a location in a history and a
    defect is a behaviour that can be copied

a fix aimed at a commit is aimed at the place the defect was
introduced; between introduction and discovery the code
moves, and only a test names the behaviour rather than the
place

The review did the hard part: a person read the diff, found a wrong comparison,
was right, and 340 defects were caught this way this year. The revert
applied with 0 conflicts, was confirmed as the exact inverse of the original,
and left 0 tests failing - and in the 26 days and 14 commits since, the logic
had been extracted, so 2 of 3 call sites - 6666 per ten thousand -
survived, with 0 tests naming the behaviour.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
