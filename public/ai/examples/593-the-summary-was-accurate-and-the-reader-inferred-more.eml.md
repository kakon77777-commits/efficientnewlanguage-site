<!-- canonical: efficientnewlanguage.org/ai/examples/593-the-summary-was-accurate-and-the-reader-inferred-more | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 593 — The summary was accurate and the reader inferred more

`the_summary_was_accurate_and_the_reader_inferred_more.eml` - A security review is summarised in one line: reviewed the authentication flow, found three issues, all fixed. Every word of that is true. What a reader takes from it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A security review
# is summarised in one line: reviewed the authentication flow, found three
# issues, all fixed. Every word of that is true. What a reader takes from it is
# computed below.
#
# The summary is honest and it was written carefully. Three issues were found,
# they were real, all three were fixed and the fixes were verified. The reviewer
# did not overstate the depth, did not claim completeness, and did not pad the
# finding count. Compared with most such summaries it is unusually plain.
#
# A summary is a compression, and compression works by dropping what a reader
# can reconstruct. What was NOT examined has no natural place in it: a finding
# has a sentence and a non-finding has nothing, so the space that was not
# looked at leaves no trace of its own size.
#
# The reader's inference is not careless either. Given "reviewed X, found three
# issues", the ordinary reading is that X was reviewed. That inference is what
# makes summaries useful, and it is wrong here only because a number the summary
# does not contain is much larger than the one it does.

52000 => endpoints_total
400 => endpoints_sampled
3 => issues_found

"endpoints in the service : " + str(endpoints_total) ^0
"endpoints examined       : " + str(endpoints_sampled) ^0
"issues found             : " + str(issues_found) ^0
"issues fixed             : " + str(issues_found) ^0
"" ^0

int(endpoints_sampled * 1000 / endpoints_total) => coverage_per_mille
endpoints_total - endpoints_sampled => not_examined

"  coverage        : " + str(coverage_per_mille) + " per mille" ^0
"  not examined    : " + str(not_examined) ^0
"" ^0

# ---- every claim, checked ----

"claim in the summary                    true" ^0
"  the authentication flow was reviewed    yes" ^0
"  three issues were found                 yes" ^0
"  all three were fixed                    yes" ^0
"  the fixes were verified                 yes" ^0
"  false claims : 0 of 4" ^0
"" ^0

"what a reader takes from it" ^0
"  the authentication flow has been reviewed   inferred" ^0
"  the flow now has three fewer issues         inferred, and true" ^0
"  the flow has been checked for this class    inferred, and not established" ^0
"  remaining issues of this class              inferred as low; not measured" ^0
"" ^0

# ---- what the same finding rate implies about the rest ----
#
# Three issues in 400 endpoints is a rate. Applied to the endpoints nobody
# looked at, it is an estimate the summary neither makes nor refutes.

int(not_examined * issues_found / endpoints_sampled) => expected_remaining

"  issue rate in the sample : " + str(issues_found) + " in " + str(endpoints_sampled) ^0
"  endpoints not examined   : " + str(not_examined) ^0
"  issues expected there    : " + str(expected_remaining) ^0
"  issues reported          : " + str(issues_found) ^0
"  issues fixed             : " + str(issues_found) ^0
"" ^0
"  the summary is a complete account of " + str(issues_found) + " and silent about " + str(expected_remaining) ^0
"  and the silence is not evasion; it is what a summary IS" ^0
"" ^0

# ---- the sentence that would have carried it ----
#
# One clause. It costs nothing, it makes no additional claim, and it removes
# the inference entirely.

"the same summary with its denominator" ^0
"  reviewed " + str(endpoints_sampled) + " of " + str(endpoints_total) + " endpoints in the authentication flow," ^0
"  found " + str(issues_found) + " issues, all fixed" ^0
"" ^0
"  words added        : six" ^0
"  claims added       : none" ^0
"  inferences removed : the one that mattered" ^0
"" ^0

# ---- what makes this hard to notice ----

"why nobody asked for the denominator" ^0
"  the finding count is specific        : " + str(issues_found) + ", not 'several'" ^0
"  each finding has a fix and a verifier: yes" ^0
"  the summary avoids the word complete : yes" ^0
"  precision on the findings reads as precision about the review" ^0
"  and the more careful the finding list, the stronger that reading" ^0
"" ^0
"  a vaguer summary would have been questioned" ^0
"" ^0

# ---- the control ----
#
# The review itself. It sampled properly, examined each endpoint carefully,
# found real issues and fixed them. There is no defect in the work and none in
# the report of it.

"control - was the review done well" ^0
"  endpoints examined thoroughly : yes, all " + str(endpoints_sampled) ^0
"  false findings                : 0" ^0
"  findings missed within the sample : none known" ^0
"  fixes verified                : " + str(issues_found) + " of " + str(issues_found) ^0
"  defects in the review or the summary : 0" ^0
"" ^0
"  the review is correct, the summary is correct, and the sentence a" ^0
"  reader forms from the summary is not" ^0
"" ^0

# ---- the null control ----
#
# The same summary after a review that covered everything. Identical wording,
# and now the reader's inference is exactly right. The words did not change;
# the number they omit did.

52000 => nc_sampled

"null control - the same sentence after a complete review" ^0
"  endpoints examined : " + str(nc_sampled) + " of " + str(endpoints_total) ^0
"  coverage           : " + str(int(nc_sampled * 1000 / endpoints_total)) + " per mille" ^0
"  summary wording    : identical" ^0
"  reader's inference : identical, and now correct" ^0
"  the summary cannot distinguish the two cases, and neither can the reader" ^0
"" ^0

# ---- the rule ----

"what a summary drops, and what that costs" ^0
"  findings        kept, they are what a summary is for" ^0
"  the population  dropped, an absence has no sentence" ^0
"  a reader supplies the missing population from context" ^0
"  and context suggests 'all of it', because that is the usual case" ^0
"" ^0
"the fix is not more caution in the wording" ^0
"it is one number: what was examined, out of what" ^0
"a finding count with no denominator is not an incomplete summary," ^0
"it is a summary of a different quantity" ^0
"" ^0

"The reviewer found " + str(issues_found) + " real issues, fixed all " + str(issues_found) + ", verified the fixes, and" ^0
"claimed nothing beyond that - which is more restraint than most such summaries" ^0
"show. " + str(endpoints_sampled) + " of " + str(endpoints_total) + " endpoints were examined, " + str(coverage_per_mille) + " per mille, and the same" ^0
"finding rate over the " + str(not_examined) + " nobody opened is about " + str(expected_remaining) + " more. Six words would" ^0
"have carried that, and they would have added no claim at all." ^0
```

## Python (deterministic transpilation)

```python
endpoints_total = 52000
endpoints_sampled = 400
issues_found = 3
print("endpoints in the service : " + str(endpoints_total))
print("endpoints examined       : " + str(endpoints_sampled))
print("issues found             : " + str(issues_found))
print("issues fixed             : " + str(issues_found))
print("")
coverage_per_mille = int(endpoints_sampled * 1000 / endpoints_total)
not_examined = endpoints_total - endpoints_sampled
print("  coverage        : " + str(coverage_per_mille) + " per mille")
print("  not examined    : " + str(not_examined))
print("")
print("claim in the summary                    true")
print("  the authentication flow was reviewed    yes")
print("  three issues were found                 yes")
print("  all three were fixed                    yes")
print("  the fixes were verified                 yes")
print("  false claims : 0 of 4")
print("")
print("what a reader takes from it")
print("  the authentication flow has been reviewed   inferred")
print("  the flow now has three fewer issues         inferred, and true")
print("  the flow has been checked for this class    inferred, and not established")
print("  remaining issues of this class              inferred as low; not measured")
print("")
expected_remaining = int(not_examined * issues_found / endpoints_sampled)
print("  issue rate in the sample : " + str(issues_found) + " in " + str(endpoints_sampled))
print("  endpoints not examined   : " + str(not_examined))
print("  issues expected there    : " + str(expected_remaining))
print("  issues reported          : " + str(issues_found))
print("  issues fixed             : " + str(issues_found))
print("")
print("  the summary is a complete account of " + str(issues_found) + " and silent about " + str(expected_remaining))
print("  and the silence is not evasion; it is what a summary IS")
print("")
print("the same summary with its denominator")
print("  reviewed " + str(endpoints_sampled) + " of " + str(endpoints_total) + " endpoints in the authentication flow,")
print("  found " + str(issues_found) + " issues, all fixed")
print("")
print("  words added        : six")
print("  claims added       : none")
print("  inferences removed : the one that mattered")
print("")
print("why nobody asked for the denominator")
print("  the finding count is specific        : " + str(issues_found) + ", not 'several'")
print("  each finding has a fix and a verifier: yes")
print("  the summary avoids the word complete : yes")
print("  precision on the findings reads as precision about the review")
print("  and the more careful the finding list, the stronger that reading")
print("")
print("  a vaguer summary would have been questioned")
print("")
print("control - was the review done well")
print("  endpoints examined thoroughly : yes, all " + str(endpoints_sampled))
print("  false findings                : 0")
print("  findings missed within the sample : none known")
print("  fixes verified                : " + str(issues_found) + " of " + str(issues_found))
print("  defects in the review or the summary : 0")
print("")
print("  the review is correct, the summary is correct, and the sentence a")
print("  reader forms from the summary is not")
print("")
nc_sampled = 52000
print("null control - the same sentence after a complete review")
print("  endpoints examined : " + str(nc_sampled) + " of " + str(endpoints_total))
print("  coverage           : " + str(int(nc_sampled * 1000 / endpoints_total)) + " per mille")
print("  summary wording    : identical")
print("  reader's inference : identical, and now correct")
print("  the summary cannot distinguish the two cases, and neither can the reader")
print("")
print("what a summary drops, and what that costs")
print("  findings        kept, they are what a summary is for")
print("  the population  dropped, an absence has no sentence")
print("  a reader supplies the missing population from context")
print("  and context suggests 'all of it', because that is the usual case")
print("")
print("the fix is not more caution in the wording")
print("it is one number: what was examined, out of what")
print("a finding count with no denominator is not an incomplete summary,")
print("it is a summary of a different quantity")
print("")
print("The reviewer found " + str(issues_found) + " real issues, fixed all " + str(issues_found) + ", verified the fixes, and")
print("claimed nothing beyond that - which is more restraint than most such summaries")
print("show. " + str(endpoints_sampled) + " of " + str(endpoints_total) + " endpoints were examined, " + str(coverage_per_mille) + " per mille, and the same")
print("finding rate over the " + str(not_examined) + " nobody opened is about " + str(expected_remaining) + " more. Six words would")
print("have carried that, and they would have added no claim at all.")
```

## stdout (executed)

```text
endpoints in the service : 52000
endpoints examined       : 400
issues found             : 3
issues fixed             : 3

  coverage        : 7 per mille
  not examined    : 51600

claim in the summary                    true
  the authentication flow was reviewed    yes
  three issues were found                 yes
  all three were fixed                    yes
  the fixes were verified                 yes
  false claims : 0 of 4

what a reader takes from it
  the authentication flow has been reviewed   inferred
  the flow now has three fewer issues         inferred, and true
  the flow has been checked for this class    inferred, and not established
  remaining issues of this class              inferred as low; not measured

  issue rate in the sample : 3 in 400
  endpoints not examined   : 51600
  issues expected there    : 387
  issues reported          : 3
  issues fixed             : 3

  the summary is a complete account of 3 and silent about 387
  and the silence is not evasion; it is what a summary IS

the same summary with its denominator
  reviewed 400 of 52000 endpoints in the authentication flow,
  found 3 issues, all fixed

  words added        : six
  claims added       : none
  inferences removed : the one that mattered

why nobody asked for the denominator
  the finding count is specific        : 3, not 'several'
  each finding has a fix and a verifier: yes
  the summary avoids the word complete : yes
  precision on the findings reads as precision about the review
  and the more careful the finding list, the stronger that reading

  a vaguer summary would have been questioned

control - was the review done well
  endpoints examined thoroughly : yes, all 400
  false findings                : 0
  findings missed within the sample : none known
  fixes verified                : 3 of 3
  defects in the review or the summary : 0

  the review is correct, the summary is correct, and the sentence a
  reader forms from the summary is not

null control - the same sentence after a complete review
  endpoints examined : 52000 of 52000
  coverage           : 1000 per mille
  summary wording    : identical
  reader's inference : identical, and now correct
  the summary cannot distinguish the two cases, and neither can the reader

what a summary drops, and what that costs
  findings        kept, they are what a summary is for
  the population  dropped, an absence has no sentence
  a reader supplies the missing population from context
  and context suggests 'all of it', because that is the usual case

the fix is not more caution in the wording
it is one number: what was examined, out of what
a finding count with no denominator is not an incomplete summary,
it is a summary of a different quantity

The reviewer found 3 real issues, fixed all 3, verified the fixes, and
claimed nothing beyond that - which is more restraint than most such summaries
show. 400 of 52000 endpoints were examined, 7 per mille, and the same
finding rate over the 51600 nobody opened is about 387 more. Six words would
have carried that, and they would have added no claim at all.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
