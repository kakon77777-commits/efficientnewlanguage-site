<!-- canonical: efficientnewlanguage.org/ai/examples/749-the-approval-was-required-above-a-diff-size | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 749 — The approval was required above a diff size

`the_approval_was_required_above_a_diff_size.eml` - A change above two hundred lines needs a second approver from another team, enforced in the pipeline, and that review has found twelve real problems. Which changes it sees is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A change above two
# hundred lines needs a second approver from another team, enforced in the
# pipeline, and that review has found twelve real problems. Which changes it
# sees is computed below.
#
# The gate is real change management. It is not a form somebody signs after the
# fact: the pipeline refuses to deploy without the second approval, the second
# approver must be outside the authoring team so it is not a colleague nodding,
# the requirement cannot be waived by the author, and the reviews have found
# twelve genuine problems in a hundred and forty escalated changes.
#
# The threshold is LINES CHANGED. A one-line change to a constant can change
# behaviour for every user, and a nine-hundred-line rename cannot.
#
# Fourteen of last year's seventeen change-caused incidents came from below it.

200 => line_threshold
8400 => changes_per_year
1100 => changes_above_the_threshold
140 => changes_escalated_for_review
12 => real_problems_the_review_found
0 => waivers_available_to_the_author
14 => incidents_from_changes_below_the_threshold
3 => incidents_from_changes_above_the_threshold

changes_per_year - changes_above_the_threshold => changes_below_the_threshold
incidents_from_changes_below_the_threshold + incidents_from_changes_above_the_threshold => change_caused_incidents
int(incidents_from_changes_below_the_threshold * 10000 / change_caused_incidents) => incidents_from_below_per_myriad
int(changes_above_the_threshold * 10000 / changes_per_year) => reviewed_share_per_myriad

"line threshold                  : " + str(line_threshold) ^0
"waivers available to the author : " + str(waivers_available_to_the_author) ^0
"changes escalated for review    : " + str(changes_escalated_for_review) ^0
"  real problems it found        : " + str(real_problems_the_review_found) ^0
"" ^0
"changes per year                : " + str(changes_per_year) ^0
"  above the threshold           : " + str(changes_above_the_threshold) ^0
"  below it                      : " + str(changes_below_the_threshold) ^0
"  share the gate sees           : " + str(reviewed_share_per_myriad) + " per ten thousand" ^0
"" ^0
"change-caused incidents         : " + str(change_caused_incidents) ^0
"  from changes above the threshold : " + str(incidents_from_changes_above_the_threshold) ^0
"  from changes below it            : " + str(incidents_from_changes_below_the_threshold) ^0
"  share from below                 : " + str(incidents_from_below_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the gate verified ----

"the approval gate" ^0
"  signed after the fact : no; the pipeline refuses to" ^0
"    deploy without it" ^0
"  who the second approver must be : outside the authoring" ^0
"    team" ^0
"  waivable by the author : " + str(waivers_available_to_the_author) ^0
"  changes escalated : " + str(changes_escalated_for_review) ^0
"  real problems found : " + str(real_problems_the_review_found) ^0
"  verdict : ENFORCED, AND IT FINDS THINGS" ^0
"" ^0
"  requiring an approver from another team is what stops" ^0
"  this being a colleague nodding, and it is why the twelve" ^0
"  are real" ^0
"" ^0

# ---- what the threshold selects on ----

"the selection rule" ^0
"  what it measures : lines changed" ^0
"  what it is used as : a proxy for how much behaviour" ^0
"    could change" ^0
"  a one-line change to a constant : below the line, and" ^0
"    can change behaviour for everyone" ^0
"  a nine-hundred-line rename : above the line, and cannot" ^0
"  is the proxy wrong in one direction : it is wrong in" ^0
"    both" ^0
"" ^0
"  the gate is complete over the changes it selects and the" ^0
"  selection is on a quantity that is easy to count" ^0
"" ^0

# ---- the fourteen ----

# Every one of them passed review, because none of them needed one. Each was a
# small edit by someone competent, and small is the property the gate reads.
"the incidents from below the line" ^0
"  count : " + str(incidents_from_changes_below_the_threshold) + " of " + str(change_caused_incidents) ^0
"  did any of them skip a required approval : none" ^0
"  did any author act carelessly : the reviews after the" ^0
"    fact say no" ^0
"  what they had in common : fewer than " + str(line_threshold) + " lines" ^0
"  what the gate would have to read to see them : what the" ^0
"    lines do" ^0
"" ^0

# ---- why a lower threshold is not the fix ----

"lowering the line" ^0
"  to catch a one-line constant change : the threshold" ^0
"    must be one line" ^0
"  changes that would then escalate : " + str(changes_per_year) ^0
"  approvers available : the same people" ^0
"  what happens to review quality at that volume : it" ^0
"    becomes the rubber stamp the rule was written against" ^0
"  so the threshold is not too high : it is the wrong axis" ^0
"" ^0

# ---- null control ----

# The same gate, selecting on what the change touches rather than how big it
# is: a change to a file on the risk register escalates at any size.
17 => nc_incidents_the_gate_could_have_seen
1 => nc_axes_the_gate_selects_on

"null control - selection by blast radius, not by size" ^0
"  second approver from another team : unchanged" ^0
"  axes the gate selects on : " + str(nc_axes_the_gate_selects_on) + ", and it is not line count" ^0
"  change-caused incidents the gate could see : " ^0
"    " + str(nc_incidents_the_gate_could_have_seen) + " of " + str(change_caused_incidents) ^0
"  the review did not get better; the rule that decides" ^0
"  which changes reach it stopped counting characters" ^0
"" ^0

# ---- the rule ----

"what a size-triggered approval guarantees" ^0
"  every large change was reviewed by an outsider :" ^0
"    exactly, unwaivable, and it found " + str(real_problems_the_review_found) + " real problems" ^0
"  every risky change was reviewed : not addressed; the" ^0
"    trigger is a count of lines and risk is a property of" ^0
"    what they say" ^0
"" ^0
"a gate is only as good as the predicate that routes to it," ^0
"and a predicate chosen for being cheap to evaluate selects" ^0
"on a proxy; the proxy's errors are not random but sit" ^0
"exactly where a small edit does something large" ^0
"" ^0

"The gate is real: the pipeline refuses to deploy without a second approver from" ^0
"another team, " + str(waivers_available_to_the_author) + " waivers exist, and " + str(changes_escalated_for_review) + " escalations found " + str(real_problems_the_review_found) + " genuine" ^0
"problems. It triggers on " + str(line_threshold) + " lines changed, so it sees " + str(reviewed_share_per_myriad) + " per ten thousand" ^0
"of " + str(changes_per_year) + " changes a year, and " + str(incidents_from_changes_below_the_threshold) + " of " + str(change_caused_incidents) + " change-caused incidents -" ^0
str(incidents_from_below_per_myriad) + " per ten thousand - came from changes too small to reach it." ^0
```

## Python (deterministic transpilation)

```python
line_threshold = 200
changes_per_year = 8400
changes_above_the_threshold = 1100
changes_escalated_for_review = 140
real_problems_the_review_found = 12
waivers_available_to_the_author = 0
incidents_from_changes_below_the_threshold = 14
incidents_from_changes_above_the_threshold = 3
changes_below_the_threshold = changes_per_year - changes_above_the_threshold
change_caused_incidents = incidents_from_changes_below_the_threshold + incidents_from_changes_above_the_threshold
incidents_from_below_per_myriad = int(incidents_from_changes_below_the_threshold * 10000 / change_caused_incidents)
reviewed_share_per_myriad = int(changes_above_the_threshold * 10000 / changes_per_year)
print("line threshold                  : " + str(line_threshold))
print("waivers available to the author : " + str(waivers_available_to_the_author))
print("changes escalated for review    : " + str(changes_escalated_for_review))
print("  real problems it found        : " + str(real_problems_the_review_found))
print("")
print("changes per year                : " + str(changes_per_year))
print("  above the threshold           : " + str(changes_above_the_threshold))
print("  below it                      : " + str(changes_below_the_threshold))
print("  share the gate sees           : " + str(reviewed_share_per_myriad) + " per ten thousand")
print("")
print("change-caused incidents         : " + str(change_caused_incidents))
print("  from changes above the threshold : " + str(incidents_from_changes_above_the_threshold))
print("  from changes below it            : " + str(incidents_from_changes_below_the_threshold))
print("  share from below                 : " + str(incidents_from_below_per_myriad) + " per ten thousand")
print("")
print("the approval gate")
print("  signed after the fact : no; the pipeline refuses to")
print("    deploy without it")
print("  who the second approver must be : outside the authoring")
print("    team")
print("  waivable by the author : " + str(waivers_available_to_the_author))
print("  changes escalated : " + str(changes_escalated_for_review))
print("  real problems found : " + str(real_problems_the_review_found))
print("  verdict : ENFORCED, AND IT FINDS THINGS")
print("")
print("  requiring an approver from another team is what stops")
print("  this being a colleague nodding, and it is why the twelve")
print("  are real")
print("")
print("the selection rule")
print("  what it measures : lines changed")
print("  what it is used as : a proxy for how much behaviour")
print("    could change")
print("  a one-line change to a constant : below the line, and")
print("    can change behaviour for everyone")
print("  a nine-hundred-line rename : above the line, and cannot")
print("  is the proxy wrong in one direction : it is wrong in")
print("    both")
print("")
print("  the gate is complete over the changes it selects and the")
print("  selection is on a quantity that is easy to count")
print("")
print("the incidents from below the line")
print("  count : " + str(incidents_from_changes_below_the_threshold) + " of " + str(change_caused_incidents))
print("  did any of them skip a required approval : none")
print("  did any author act carelessly : the reviews after the")
print("    fact say no")
print("  what they had in common : fewer than " + str(line_threshold) + " lines")
print("  what the gate would have to read to see them : what the")
print("    lines do")
print("")
print("lowering the line")
print("  to catch a one-line constant change : the threshold")
print("    must be one line")
print("  changes that would then escalate : " + str(changes_per_year))
print("  approvers available : the same people")
print("  what happens to review quality at that volume : it")
print("    becomes the rubber stamp the rule was written against")
print("  so the threshold is not too high : it is the wrong axis")
print("")
nc_incidents_the_gate_could_have_seen = 17
nc_axes_the_gate_selects_on = 1
print("null control - selection by blast radius, not by size")
print("  second approver from another team : unchanged")
print("  axes the gate selects on : " + str(nc_axes_the_gate_selects_on) + ", and it is not line count")
print("  change-caused incidents the gate could see : ")
print("    " + str(nc_incidents_the_gate_could_have_seen) + " of " + str(change_caused_incidents))
print("  the review did not get better; the rule that decides")
print("  which changes reach it stopped counting characters")
print("")
print("what a size-triggered approval guarantees")
print("  every large change was reviewed by an outsider :")
print("    exactly, unwaivable, and it found " + str(real_problems_the_review_found) + " real problems")
print("  every risky change was reviewed : not addressed; the")
print("    trigger is a count of lines and risk is a property of")
print("    what they say")
print("")
print("a gate is only as good as the predicate that routes to it,")
print("and a predicate chosen for being cheap to evaluate selects")
print("on a proxy; the proxy's errors are not random but sit")
print("exactly where a small edit does something large")
print("")
print("The gate is real: the pipeline refuses to deploy without a second approver from")
print("another team, " + str(waivers_available_to_the_author) + " waivers exist, and " + str(changes_escalated_for_review) + " escalations found " + str(real_problems_the_review_found) + " genuine")
print("problems. It triggers on " + str(line_threshold) + " lines changed, so it sees " + str(reviewed_share_per_myriad) + " per ten thousand")
print("of " + str(changes_per_year) + " changes a year, and " + str(incidents_from_changes_below_the_threshold) + " of " + str(change_caused_incidents) + " change-caused incidents -")
print(str(incidents_from_below_per_myriad) + " per ten thousand - came from changes too small to reach it.")
```

## stdout (executed)

```text
line threshold                  : 200
waivers available to the author : 0
changes escalated for review    : 140
  real problems it found        : 12

changes per year                : 8400
  above the threshold           : 1100
  below it                      : 7300
  share the gate sees           : 1309 per ten thousand

change-caused incidents         : 17
  from changes above the threshold : 3
  from changes below it            : 14
  share from below                 : 8235 per ten thousand

the approval gate
  signed after the fact : no; the pipeline refuses to
    deploy without it
  who the second approver must be : outside the authoring
    team
  waivable by the author : 0
  changes escalated : 140
  real problems found : 12
  verdict : ENFORCED, AND IT FINDS THINGS

  requiring an approver from another team is what stops
  this being a colleague nodding, and it is why the twelve
  are real

the selection rule
  what it measures : lines changed
  what it is used as : a proxy for how much behaviour
    could change
  a one-line change to a constant : below the line, and
    can change behaviour for everyone
  a nine-hundred-line rename : above the line, and cannot
  is the proxy wrong in one direction : it is wrong in
    both

  the gate is complete over the changes it selects and the
  selection is on a quantity that is easy to count

the incidents from below the line
  count : 14 of 17
  did any of them skip a required approval : none
  did any author act carelessly : the reviews after the
    fact say no
  what they had in common : fewer than 200 lines
  what the gate would have to read to see them : what the
    lines do

lowering the line
  to catch a one-line constant change : the threshold
    must be one line
  changes that would then escalate : 8400
  approvers available : the same people
  what happens to review quality at that volume : it
    becomes the rubber stamp the rule was written against
  so the threshold is not too high : it is the wrong axis

null control - selection by blast radius, not by size
  second approver from another team : unchanged
  axes the gate selects on : 1, and it is not line count
  change-caused incidents the gate could see : 
    17 of 17
  the review did not get better; the rule that decides
  which changes reach it stopped counting characters

what a size-triggered approval guarantees
  every large change was reviewed by an outsider :
    exactly, unwaivable, and it found 12 real problems
  every risky change was reviewed : not addressed; the
    trigger is a count of lines and risk is a property of
    what they say

a gate is only as good as the predicate that routes to it,
and a predicate chosen for being cheap to evaluate selects
on a proxy; the proxy's errors are not random but sit
exactly where a small edit does something large

The gate is real: the pipeline refuses to deploy without a second approver from
another team, 0 waivers exist, and 140 escalations found 12 genuine
problems. It triggers on 200 lines changed, so it sees 1309 per ten thousand
of 8400 changes a year, and 14 of 17 change-caused incidents -
8235 per ten thousand - came from changes too small to reach it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
