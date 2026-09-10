<!-- canonical: efficientnewlanguage.org/ai/examples/777-the-access-review-asked-the-person-who-granted-it | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 777 — The access review asked the person who granted it

`the_access_review_asked_the_person_who_granted_it.eml` - Every entitlement is re-approved by its owner every quarter, eleven quarters running, and an entitlement nobody answers for is revoked automatically. Who the owner is is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every entitlement
# is re-approved by its owner every quarter, eleven quarters running, and an
# entitlement nobody answers for is revoked automatically. Who the owner is is
# computed below.
#
# The process is enforced rather than requested. It runs in the identity tool,
# not in a spreadsheet; a reviewer who does not respond does not stall the
# quarter, because silence revokes; the definitions of each entitlement are
# shown next to it rather than assumed known; and one thousand two hundred and
# forty entitlements were actually removed last quarter.
#
# The reviewer for an entitlement is the manager who asked for it.

46000 => entitlements
380 => reviewers
11 => quarters_completed
0 => entitlements_not_reviewed
1240 => entitlements_revoked_last_quarter
90 => revoked_by_a_reviewer_saying_no
340 => reviewers_who_are_the_original_requester
41000 => entitlements_approved_in_a_single_bulk_action
2 => median_seconds_per_decision
7 => access_incidents_involving_a_recertified_entitlement

entitlements_revoked_last_quarter - revoked_by_a_reviewer_saying_no => revoked_by_silence
entitlements - entitlements_approved_in_a_single_bulk_action => entitlements_decided_one_at_a_time
reviewers - reviewers_who_are_the_original_requester => reviewers_reviewing_somebody_elses_request
entitlements * median_seconds_per_decision => seconds_of_deciding_in_a_quarter
int(seconds_of_deciding_in_a_quarter / 3600) => hours_of_deciding_in_a_quarter
int(entitlements_approved_in_a_single_bulk_action * 10000 / entitlements) => bulk_approved_per_myriad
int(reviewers_who_are_the_original_requester * 10000 / reviewers) => self_reviewing_per_myriad
int(revoked_by_a_reviewer_saying_no * 10000 / entitlements) => revoked_by_decision_per_myriad

"entitlements                    : " + str(entitlements) ^0
"  not reviewed                  : " + str(entitlements_not_reviewed) ^0
"  approved in one bulk action   : " + str(entitlements_approved_in_a_single_bulk_action) ^0
"  decided one at a time         : " + str(entitlements_decided_one_at_a_time) ^0
"  bulk-approved                 : " + str(bulk_approved_per_myriad) + " per ten thousand" ^0
"quarters completed              : " + str(quarters_completed) ^0
"" ^0
"reviewers                       : " + str(reviewers) ^0
"  who requested it themselves   : " + str(reviewers_who_are_the_original_requester) ^0
"  reviewing somebody else's     : " + str(reviewers_reviewing_somebody_elses_request) ^0
"  self-reviewing                : " + str(self_reviewing_per_myriad) + " per ten thousand" ^0
"median seconds per decision     : " + str(median_seconds_per_decision) ^0
"  hours of deciding a quarter   : " + str(hours_of_deciding_in_a_quarter) ^0
"" ^0
"revoked last quarter            : " + str(entitlements_revoked_last_quarter) ^0
"  by a reviewer saying no       : " + str(revoked_by_a_reviewer_saying_no) ^0
"  by silence                    : " + str(revoked_by_silence) ^0
"  revoked by a decision         : " + str(revoked_by_decision_per_myriad) + " per ten thousand" ^0
"incidents on a recertified one  : " + str(access_incidents_involving_a_recertified_entitlement) ^0
"" ^0

# ---- what the process verified ----

"the quarterly recertification" ^0
"  where it runs : the identity tool, not a spreadsheet" ^0
"  silence : revokes, so a reviewer who does not answer" ^0
"    cannot stall the quarter" ^0
"  what a reviewer sees : the entitlement's definition" ^0
"    beside it, not a code" ^0
"  removed last quarter : " + str(entitlements_revoked_last_quarter) ^0
"  quarters completed : " + str(quarters_completed) ^0
"  verdict : RECERTIFIED" ^0
"" ^0
"  making silence revoke rather than stall is the part" ^0
"  almost nobody does, and it is why the " + str(revoked_by_silence) ^0
"  came off without anyone chasing them" ^0
"" ^0

# ---- whose judgement is being reviewed ----

"who is asked about each entitlement" ^0
"  the reviewer : the manager who requested it" ^0
"  what the question is : should this person still have" ^0
"    what you asked for them to have" ^0
"  so the judgement under review and the judgement doing" ^0
"    the reviewing : the same person's" ^0
"  reviewers reviewing somebody else's request : " ^0
"    " + str(reviewers_reviewing_somebody_elses_request) + " of " + str(reviewers) ^0
"  median time to decide : " + str(median_seconds_per_decision) + " seconds" ^0
"" ^0
"  the control asks the requester to disagree with" ^0
"  themselves, once a quarter, in bulk" ^0
"" ^0

# ---- what the revocations were ----

"the " + str(entitlements_revoked_last_quarter) + " that came off" ^0
"  because a reviewer looked and said no : " ^0
"    " + str(revoked_by_a_reviewer_saying_no) ^0
"  because nobody answered : " + str(revoked_by_silence) ^0
"  so the mechanism that removed most of them : the" ^0
"    absence of a reviewer, not the presence of one" ^0
"  entitlements a reviewer looked at and kept : the rest" ^0
"  incidents involving one of those : " ^0
"    " + str(access_incidents_involving_a_recertified_entitlement) ^0
"" ^0

# ---- null control ----

# The same process, with each entitlement assigned to a reviewer in a different
# reporting line from the one that requested it.
830 => nc_revoked_by_a_reviewer_saying_no
46000 => nc_entitlements_reviewed
380 => nc_reviewers

"null control - review somebody else's request" ^0
"  entitlements reviewed : " + str(nc_entitlements_reviewed) + ", unchanged" ^0
"  reviewers : " + str(nc_reviewers) + ", unchanged" ^0
"  revoked by a reviewer saying no : " ^0
"    " + str(nc_revoked_by_a_reviewer_saying_no) ^0
"  nothing about the entitlements changed; the person" ^0
"  answering stopped being the person answered about" ^0
"" ^0

# ---- the rule ----

"what a completed recertification guarantees" ^0
"  every entitlement was re-approved by its owner :" ^0
"    exactly, " + str(entitlements) + " of them, " + str(quarters_completed) + " quarters, " + str(entitlements_not_reviewed) + " skipped" ^0
"  every entitlement is still needed : not addressed; the" ^0
"    owner is the person who asked for it, and " ^0
"    " + str(bulk_approved_per_myriad) + " per ten thousand were approved in one action" ^0
"" ^0
"a review whose reviewer is the requester measures whether" ^0
"the requester has changed their mind; the number that can" ^0
"vary is what somebody else would have said, and nothing" ^0
"here asks them" ^0
"" ^0

"It runs in the identity tool, silence revokes rather than stalls, definitions" ^0
"are shown beside each entitlement, and " + str(entitlements_revoked_last_quarter) + " came off last quarter. The reviewer" ^0
"is the manager who requested it - " + str(self_reviewing_per_myriad) + " per ten thousand of reviewers - so " ^0
"" + str(revoked_by_silence) + " of the " + str(entitlements_revoked_last_quarter) + " went by nobody answering, " + str(revoked_by_a_reviewer_saying_no) + " by somebody saying no, and " ^0
"" + str(entitlements_approved_in_a_single_bulk_action) + " were approved in a single click at " + str(median_seconds_per_decision) + " seconds a decision." ^0
```

## Python (deterministic transpilation)

```python
entitlements = 46000
reviewers = 380
quarters_completed = 11
entitlements_not_reviewed = 0
entitlements_revoked_last_quarter = 1240
revoked_by_a_reviewer_saying_no = 90
reviewers_who_are_the_original_requester = 340
entitlements_approved_in_a_single_bulk_action = 41000
median_seconds_per_decision = 2
access_incidents_involving_a_recertified_entitlement = 7
revoked_by_silence = entitlements_revoked_last_quarter - revoked_by_a_reviewer_saying_no
entitlements_decided_one_at_a_time = entitlements - entitlements_approved_in_a_single_bulk_action
reviewers_reviewing_somebody_elses_request = reviewers - reviewers_who_are_the_original_requester
seconds_of_deciding_in_a_quarter = entitlements * median_seconds_per_decision
hours_of_deciding_in_a_quarter = int(seconds_of_deciding_in_a_quarter / 3600)
bulk_approved_per_myriad = int(entitlements_approved_in_a_single_bulk_action * 10000 / entitlements)
self_reviewing_per_myriad = int(reviewers_who_are_the_original_requester * 10000 / reviewers)
revoked_by_decision_per_myriad = int(revoked_by_a_reviewer_saying_no * 10000 / entitlements)
print("entitlements                    : " + str(entitlements))
print("  not reviewed                  : " + str(entitlements_not_reviewed))
print("  approved in one bulk action   : " + str(entitlements_approved_in_a_single_bulk_action))
print("  decided one at a time         : " + str(entitlements_decided_one_at_a_time))
print("  bulk-approved                 : " + str(bulk_approved_per_myriad) + " per ten thousand")
print("quarters completed              : " + str(quarters_completed))
print("")
print("reviewers                       : " + str(reviewers))
print("  who requested it themselves   : " + str(reviewers_who_are_the_original_requester))
print("  reviewing somebody else's     : " + str(reviewers_reviewing_somebody_elses_request))
print("  self-reviewing                : " + str(self_reviewing_per_myriad) + " per ten thousand")
print("median seconds per decision     : " + str(median_seconds_per_decision))
print("  hours of deciding a quarter   : " + str(hours_of_deciding_in_a_quarter))
print("")
print("revoked last quarter            : " + str(entitlements_revoked_last_quarter))
print("  by a reviewer saying no       : " + str(revoked_by_a_reviewer_saying_no))
print("  by silence                    : " + str(revoked_by_silence))
print("  revoked by a decision         : " + str(revoked_by_decision_per_myriad) + " per ten thousand")
print("incidents on a recertified one  : " + str(access_incidents_involving_a_recertified_entitlement))
print("")
print("the quarterly recertification")
print("  where it runs : the identity tool, not a spreadsheet")
print("  silence : revokes, so a reviewer who does not answer")
print("    cannot stall the quarter")
print("  what a reviewer sees : the entitlement's definition")
print("    beside it, not a code")
print("  removed last quarter : " + str(entitlements_revoked_last_quarter))
print("  quarters completed : " + str(quarters_completed))
print("  verdict : RECERTIFIED")
print("")
print("  making silence revoke rather than stall is the part")
print("  almost nobody does, and it is why the " + str(revoked_by_silence))
print("  came off without anyone chasing them")
print("")
print("who is asked about each entitlement")
print("  the reviewer : the manager who requested it")
print("  what the question is : should this person still have")
print("    what you asked for them to have")
print("  so the judgement under review and the judgement doing")
print("    the reviewing : the same person's")
print("  reviewers reviewing somebody else's request : ")
print("    " + str(reviewers_reviewing_somebody_elses_request) + " of " + str(reviewers))
print("  median time to decide : " + str(median_seconds_per_decision) + " seconds")
print("")
print("  the control asks the requester to disagree with")
print("  themselves, once a quarter, in bulk")
print("")
print("the " + str(entitlements_revoked_last_quarter) + " that came off")
print("  because a reviewer looked and said no : ")
print("    " + str(revoked_by_a_reviewer_saying_no))
print("  because nobody answered : " + str(revoked_by_silence))
print("  so the mechanism that removed most of them : the")
print("    absence of a reviewer, not the presence of one")
print("  entitlements a reviewer looked at and kept : the rest")
print("  incidents involving one of those : ")
print("    " + str(access_incidents_involving_a_recertified_entitlement))
print("")
nc_revoked_by_a_reviewer_saying_no = 830
nc_entitlements_reviewed = 46000
nc_reviewers = 380
print("null control - review somebody else's request")
print("  entitlements reviewed : " + str(nc_entitlements_reviewed) + ", unchanged")
print("  reviewers : " + str(nc_reviewers) + ", unchanged")
print("  revoked by a reviewer saying no : ")
print("    " + str(nc_revoked_by_a_reviewer_saying_no))
print("  nothing about the entitlements changed; the person")
print("  answering stopped being the person answered about")
print("")
print("what a completed recertification guarantees")
print("  every entitlement was re-approved by its owner :")
print("    exactly, " + str(entitlements) + " of them, " + str(quarters_completed) + " quarters, " + str(entitlements_not_reviewed) + " skipped")
print("  every entitlement is still needed : not addressed; the")
print("    owner is the person who asked for it, and ")
print("    " + str(bulk_approved_per_myriad) + " per ten thousand were approved in one action")
print("")
print("a review whose reviewer is the requester measures whether")
print("the requester has changed their mind; the number that can")
print("vary is what somebody else would have said, and nothing")
print("here asks them")
print("")
print("It runs in the identity tool, silence revokes rather than stalls, definitions")
print("are shown beside each entitlement, and " + str(entitlements_revoked_last_quarter) + " came off last quarter. The reviewer")
print("is the manager who requested it - " + str(self_reviewing_per_myriad) + " per ten thousand of reviewers - so ")
print("" + str(revoked_by_silence) + " of the " + str(entitlements_revoked_last_quarter) + " went by nobody answering, " + str(revoked_by_a_reviewer_saying_no) + " by somebody saying no, and ")
print("" + str(entitlements_approved_in_a_single_bulk_action) + " were approved in a single click at " + str(median_seconds_per_decision) + " seconds a decision.")
```

## stdout (executed)

```text
entitlements                    : 46000
  not reviewed                  : 0
  approved in one bulk action   : 41000
  decided one at a time         : 5000
  bulk-approved                 : 8913 per ten thousand
quarters completed              : 11

reviewers                       : 380
  who requested it themselves   : 340
  reviewing somebody else's     : 40
  self-reviewing                : 8947 per ten thousand
median seconds per decision     : 2
  hours of deciding a quarter   : 25

revoked last quarter            : 1240
  by a reviewer saying no       : 90
  by silence                    : 1150
  revoked by a decision         : 19 per ten thousand
incidents on a recertified one  : 7

the quarterly recertification
  where it runs : the identity tool, not a spreadsheet
  silence : revokes, so a reviewer who does not answer
    cannot stall the quarter
  what a reviewer sees : the entitlement's definition
    beside it, not a code
  removed last quarter : 1240
  quarters completed : 11
  verdict : RECERTIFIED

  making silence revoke rather than stall is the part
  almost nobody does, and it is why the 1150
  came off without anyone chasing them

who is asked about each entitlement
  the reviewer : the manager who requested it
  what the question is : should this person still have
    what you asked for them to have
  so the judgement under review and the judgement doing
    the reviewing : the same person's
  reviewers reviewing somebody else's request : 
    40 of 380
  median time to decide : 2 seconds

  the control asks the requester to disagree with
  themselves, once a quarter, in bulk

the 1240 that came off
  because a reviewer looked and said no : 
    90
  because nobody answered : 1150
  so the mechanism that removed most of them : the
    absence of a reviewer, not the presence of one
  entitlements a reviewer looked at and kept : the rest
  incidents involving one of those : 
    7

null control - review somebody else's request
  entitlements reviewed : 46000, unchanged
  reviewers : 380, unchanged
  revoked by a reviewer saying no : 
    830
  nothing about the entitlements changed; the person
  answering stopped being the person answered about

what a completed recertification guarantees
  every entitlement was re-approved by its owner :
    exactly, 46000 of them, 11 quarters, 0 skipped
  every entitlement is still needed : not addressed; the
    owner is the person who asked for it, and 
    8913 per ten thousand were approved in one action

a review whose reviewer is the requester measures whether
the requester has changed their mind; the number that can
vary is what somebody else would have said, and nothing
here asks them

It runs in the identity tool, silence revokes rather than stalls, definitions
are shown beside each entitlement, and 1240 came off last quarter. The reviewer
is the manager who requested it - 8947 per ten thousand of reviewers - so 
1150 of the 1240 went by nobody answering, 90 by somebody saying no, and 
41000 were approved in a single click at 2 seconds a decision.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
