<!-- canonical: efficientnewlanguage.org/ai/examples/731-the-vendor-was-audited-and-the-subprocessor-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 731 — The vendor was audited and the subprocessor was not

`the_vendor_was_audited_and_the_subprocessor_was_not.eml` - Every vendor is audited annually, the reports are read rather than filed, and two vendors were rejected on the strength of it. How far the audit reaches is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every vendor is
# audited annually, the reports are read rather than filed, and two vendors
# were rejected on the strength of it. How far the audit reaches is computed
# below.
#
# The vendor review is not a checkbox. The audit report is read by someone who
# understands what its scope section excludes; the security questionnaire is
# answered by the vendor's engineers rather than returned by their sales team;
# the penetration test summary is requested and read; the data processing
# agreement names specific terms instead of incorporating a policy by
# reference; it is redone annually; and two vendors were turned down because of
# what it found.
#
# The audit covers the party the contract is with. That party has its own
# subprocessors, listed in an appendix the agreement lets it change on thirty
# days' notice.
#
# The notice goes to a shared mailbox.

84 => vendors
84 => vendors_audited_this_year
2 => vendors_rejected_on_the_audit
310 => subprocessors_named_in_the_appendices
0 => subprocessors_audited
1 => contractual_hops_the_audit_covers
2 => hops_the_data_travels
30 => notice_days_for_a_subprocessor_change
41 => subprocessor_changes_notified_last_year
0 => objections_raised
0 => mailbox_rules_routing_the_notice_to_a_person

subprocessors_named_in_the_appendices - subprocessors_audited => subprocessors_not_audited
hops_the_data_travels - contractual_hops_the_audit_covers => hops_beyond_the_audit
int(subprocessors_audited * 10000 / subprocessors_named_in_the_appendices) => audited_per_myriad
int(subprocessor_changes_notified_last_year * 10000 / subprocessors_named_in_the_appendices) => annual_churn_per_myriad

"vendors                         : " + str(vendors) ^0
"  audited this year             : " + str(vendors_audited_this_year) ^0
"  rejected on the audit         : " + str(vendors_rejected_on_the_audit) ^0
"" ^0
"subprocessors named in appendices : " + str(subprocessors_named_in_the_appendices) ^0
"  audited                       : " + str(subprocessors_audited) ^0
"  not audited                   : " + str(subprocessors_not_audited) ^0
"  share audited                 : " + str(audited_per_myriad) + " per ten thousand" ^0
"" ^0
"contractual hops the audit covers : " + str(contractual_hops_the_audit_covers) ^0
"hops the data travels             : " + str(hops_the_data_travels) ^0
"  beyond the audit                : " + str(hops_beyond_the_audit) ^0
"" ^0
"notice days for a change        : " + str(notice_days_for_a_subprocessor_change) ^0
"changes notified last year      : " + str(subprocessor_changes_notified_last_year) ^0
"  annual churn                  : " + str(annual_churn_per_myriad) + " per ten thousand" ^0
"objections raised               : " + str(objections_raised) ^0
"mailbox rules routing it to a person : " + str(mailbox_rules_routing_the_notice_to_a_person) ^0
"" ^0

# ---- what the audit verified ----

"the vendor review" ^0
"  the report : read, including what its scope excludes" ^0
"  the questionnaire : answered by their engineers" ^0
"  the penetration test summary : requested and read" ^0
"  the agreement : specific terms, not a policy by" ^0
"    reference" ^0
"  cadence : annual" ^0
"  vendors rejected because of it : " + str(vendors_rejected_on_the_audit) ^0
"  verdict : AUDITED" ^0
"" ^0
"  reading the scope section is the part that separates" ^0
"  this from collecting certificates, and it is done" ^0
"" ^0
# ---- what a contract can reach ----

"the scope of the review" ^0
"  who it examines : the party the contract is with" ^0
"  who processes the data : that party, and whoever it" ^0
"    engages" ^0
"  where those are listed : an appendix to the agreement" ^0
"  what the agreement says about changing it : notice," ^0
"    " + str(notice_days_for_a_subprocessor_change) + " days, not approval" ^0
"  so the review reaches : " + str(contractual_hops_the_audit_covers) + " hop of " + str(hops_the_data_travels) ^0
"" ^0
"  the audit is complete over its population and the" ^0
"  population is defined by who signed, not by who holds" ^0
"" ^0

# ---- the appendix is not nothing ----

# The list exists, it is accurate, and the vendor maintains it honestly. Being
# named on it is a real disclosure; it is the transparency the agreement was
# written to produce.
"the appendix" ^0
"  exists and is accurate : yes" ^0
"  maintained honestly by the vendor : yes" ^0
"  names " + str(subprocessors_named_in_the_appendices) + " parties : yes" ^0
"  what it is : a disclosure" ^0
"  what it is not : a review" ^0
"  parties on it that were reviewed : " + str(subprocessors_audited) ^0
"" ^0

# ---- what notice does ----

# Notice creates a window in which an objection is possible, and the window is
# real. An objection has to be raised by someone who read the notice.
"one notice" ^0
"  sent by the vendor : yes, within the agreed window" ^0
"  arrives where : a shared mailbox" ^0
"  rules routing it to a person : " + str(mailbox_rules_routing_the_notice_to_a_person) ^0
"  changes notified last year : " + str(subprocessor_changes_notified_last_year) ^0
"  objections raised          : " + str(objections_raised) ^0
"  what a zero objection rate could mean : every change" ^0
"    was acceptable, or none was read" ^0
"  what distinguishes those : a record of a decision," ^0
"    which does not exist" ^0
"" ^0

# ---- what the annual cadence measures against ----

"the annual re-review" ^0
"  vendors re-reviewed : " + str(vendors_audited_this_year) ^0
"  what it re-examines : the same party" ^0
"  subprocessor changes in the year : " + str(subprocessor_changes_notified_last_year) ^0
"  churn against the named set : " + str(annual_churn_per_myriad) + " per ten thousand" ^0
"  does the re-review diff the appendix against last year :" ^0
"    it is not a step in the review" ^0
"" ^0

# ---- null control ----

# The same review, with the agreement requiring the terms to flow down, a
# sample of subprocessors examined, and changes gated on approval rather than
# notice.
subprocessors_named_in_the_appendices => nc_subprocessors_covered_by_flowed_down_terms
hops_the_data_travels => nc_hops_the_review_covers

"null control - terms flow down and changes need approval" ^0
"  vendors rejected on the audit : " + str(vendors_rejected_on_the_audit) + ", unchanged" ^0
"  subprocessors covered by the terms : " + str(nc_subprocessors_covered_by_flowed_down_terms) ^0
"  hops the review covers : " + str(nc_hops_the_review_covers) ^0
"  the audit did not get more rigorous; the obligation" ^0
"  started travelling as far as the data" ^0
"" ^0

# ---- the rule ----

"what a thorough vendor audit guarantees" ^0
"  this vendor meets the standard : exactly, examined" ^0
"    rather than certified, and " + str(vendors_rejected_on_the_audit) + " failed it" ^0
"  the data is handled to that standard : not addressed;" ^0
"    the audit follows the contract and the data follows" ^0
"    the processing" ^0
"" ^0
"diligence is bounded by privity; each hop is a party who" ^0
"chose the next one, and an obligation that is not written to" ^0
"flow down stops at the first signature while the data does" ^0
"not" ^0
"" ^0

"The review is the real kind: scope sections read, questionnaires answered by" ^0
"engineers, penetration summaries requested, specific terms rather than a policy" ^0
"by reference, annually, with " + str(vendors_rejected_on_the_audit) + " vendors rejected. It reaches " + str(contractual_hops_the_audit_covers) + " of " + str(hops_the_data_travels) + " hops," ^0
"so " + str(subprocessors_not_audited) + " of " + str(subprocessors_named_in_the_appendices) + " named subprocessors are unexamined - " + str(audited_per_myriad) + " per ten thousand" ^0
"audited - and " + str(subprocessor_changes_notified_last_year) + " changes arrived last year on notice, drawing " + str(objections_raised) + " objections." ^0
```

## Python (deterministic transpilation)

```python
vendors = 84
vendors_audited_this_year = 84
vendors_rejected_on_the_audit = 2
subprocessors_named_in_the_appendices = 310
subprocessors_audited = 0
contractual_hops_the_audit_covers = 1
hops_the_data_travels = 2
notice_days_for_a_subprocessor_change = 30
subprocessor_changes_notified_last_year = 41
objections_raised = 0
mailbox_rules_routing_the_notice_to_a_person = 0
subprocessors_not_audited = subprocessors_named_in_the_appendices - subprocessors_audited
hops_beyond_the_audit = hops_the_data_travels - contractual_hops_the_audit_covers
audited_per_myriad = int(subprocessors_audited * 10000 / subprocessors_named_in_the_appendices)
annual_churn_per_myriad = int(subprocessor_changes_notified_last_year * 10000 / subprocessors_named_in_the_appendices)
print("vendors                         : " + str(vendors))
print("  audited this year             : " + str(vendors_audited_this_year))
print("  rejected on the audit         : " + str(vendors_rejected_on_the_audit))
print("")
print("subprocessors named in appendices : " + str(subprocessors_named_in_the_appendices))
print("  audited                       : " + str(subprocessors_audited))
print("  not audited                   : " + str(subprocessors_not_audited))
print("  share audited                 : " + str(audited_per_myriad) + " per ten thousand")
print("")
print("contractual hops the audit covers : " + str(contractual_hops_the_audit_covers))
print("hops the data travels             : " + str(hops_the_data_travels))
print("  beyond the audit                : " + str(hops_beyond_the_audit))
print("")
print("notice days for a change        : " + str(notice_days_for_a_subprocessor_change))
print("changes notified last year      : " + str(subprocessor_changes_notified_last_year))
print("  annual churn                  : " + str(annual_churn_per_myriad) + " per ten thousand")
print("objections raised               : " + str(objections_raised))
print("mailbox rules routing it to a person : " + str(mailbox_rules_routing_the_notice_to_a_person))
print("")
print("the vendor review")
print("  the report : read, including what its scope excludes")
print("  the questionnaire : answered by their engineers")
print("  the penetration test summary : requested and read")
print("  the agreement : specific terms, not a policy by")
print("    reference")
print("  cadence : annual")
print("  vendors rejected because of it : " + str(vendors_rejected_on_the_audit))
print("  verdict : AUDITED")
print("")
print("  reading the scope section is the part that separates")
print("  this from collecting certificates, and it is done")
print("")
print("the scope of the review")
print("  who it examines : the party the contract is with")
print("  who processes the data : that party, and whoever it")
print("    engages")
print("  where those are listed : an appendix to the agreement")
print("  what the agreement says about changing it : notice,")
print("    " + str(notice_days_for_a_subprocessor_change) + " days, not approval")
print("  so the review reaches : " + str(contractual_hops_the_audit_covers) + " hop of " + str(hops_the_data_travels))
print("")
print("  the audit is complete over its population and the")
print("  population is defined by who signed, not by who holds")
print("")
print("the appendix")
print("  exists and is accurate : yes")
print("  maintained honestly by the vendor : yes")
print("  names " + str(subprocessors_named_in_the_appendices) + " parties : yes")
print("  what it is : a disclosure")
print("  what it is not : a review")
print("  parties on it that were reviewed : " + str(subprocessors_audited))
print("")
print("one notice")
print("  sent by the vendor : yes, within the agreed window")
print("  arrives where : a shared mailbox")
print("  rules routing it to a person : " + str(mailbox_rules_routing_the_notice_to_a_person))
print("  changes notified last year : " + str(subprocessor_changes_notified_last_year))
print("  objections raised          : " + str(objections_raised))
print("  what a zero objection rate could mean : every change")
print("    was acceptable, or none was read")
print("  what distinguishes those : a record of a decision,")
print("    which does not exist")
print("")
print("the annual re-review")
print("  vendors re-reviewed : " + str(vendors_audited_this_year))
print("  what it re-examines : the same party")
print("  subprocessor changes in the year : " + str(subprocessor_changes_notified_last_year))
print("  churn against the named set : " + str(annual_churn_per_myriad) + " per ten thousand")
print("  does the re-review diff the appendix against last year :")
print("    it is not a step in the review")
print("")
nc_subprocessors_covered_by_flowed_down_terms = subprocessors_named_in_the_appendices
nc_hops_the_review_covers = hops_the_data_travels
print("null control - terms flow down and changes need approval")
print("  vendors rejected on the audit : " + str(vendors_rejected_on_the_audit) + ", unchanged")
print("  subprocessors covered by the terms : " + str(nc_subprocessors_covered_by_flowed_down_terms))
print("  hops the review covers : " + str(nc_hops_the_review_covers))
print("  the audit did not get more rigorous; the obligation")
print("  started travelling as far as the data")
print("")
print("what a thorough vendor audit guarantees")
print("  this vendor meets the standard : exactly, examined")
print("    rather than certified, and " + str(vendors_rejected_on_the_audit) + " failed it")
print("  the data is handled to that standard : not addressed;")
print("    the audit follows the contract and the data follows")
print("    the processing")
print("")
print("diligence is bounded by privity; each hop is a party who")
print("chose the next one, and an obligation that is not written to")
print("flow down stops at the first signature while the data does")
print("not")
print("")
print("The review is the real kind: scope sections read, questionnaires answered by")
print("engineers, penetration summaries requested, specific terms rather than a policy")
print("by reference, annually, with " + str(vendors_rejected_on_the_audit) + " vendors rejected. It reaches " + str(contractual_hops_the_audit_covers) + " of " + str(hops_the_data_travels) + " hops,")
print("so " + str(subprocessors_not_audited) + " of " + str(subprocessors_named_in_the_appendices) + " named subprocessors are unexamined - " + str(audited_per_myriad) + " per ten thousand")
print("audited - and " + str(subprocessor_changes_notified_last_year) + " changes arrived last year on notice, drawing " + str(objections_raised) + " objections.")
```

## stdout (executed)

```text
vendors                         : 84
  audited this year             : 84
  rejected on the audit         : 2

subprocessors named in appendices : 310
  audited                       : 0
  not audited                   : 310
  share audited                 : 0 per ten thousand

contractual hops the audit covers : 1
hops the data travels             : 2
  beyond the audit                : 1

notice days for a change        : 30
changes notified last year      : 41
  annual churn                  : 1322 per ten thousand
objections raised               : 0
mailbox rules routing it to a person : 0

the vendor review
  the report : read, including what its scope excludes
  the questionnaire : answered by their engineers
  the penetration test summary : requested and read
  the agreement : specific terms, not a policy by
    reference
  cadence : annual
  vendors rejected because of it : 2
  verdict : AUDITED

  reading the scope section is the part that separates
  this from collecting certificates, and it is done

the scope of the review
  who it examines : the party the contract is with
  who processes the data : that party, and whoever it
    engages
  where those are listed : an appendix to the agreement
  what the agreement says about changing it : notice,
    30 days, not approval
  so the review reaches : 1 hop of 2

  the audit is complete over its population and the
  population is defined by who signed, not by who holds

the appendix
  exists and is accurate : yes
  maintained honestly by the vendor : yes
  names 310 parties : yes
  what it is : a disclosure
  what it is not : a review
  parties on it that were reviewed : 0

one notice
  sent by the vendor : yes, within the agreed window
  arrives where : a shared mailbox
  rules routing it to a person : 0
  changes notified last year : 41
  objections raised          : 0
  what a zero objection rate could mean : every change
    was acceptable, or none was read
  what distinguishes those : a record of a decision,
    which does not exist

the annual re-review
  vendors re-reviewed : 84
  what it re-examines : the same party
  subprocessor changes in the year : 41
  churn against the named set : 1322 per ten thousand
  does the re-review diff the appendix against last year :
    it is not a step in the review

null control - terms flow down and changes need approval
  vendors rejected on the audit : 2, unchanged
  subprocessors covered by the terms : 310
  hops the review covers : 2
  the audit did not get more rigorous; the obligation
  started travelling as far as the data

what a thorough vendor audit guarantees
  this vendor meets the standard : exactly, examined
    rather than certified, and 2 failed it
  the data is handled to that standard : not addressed;
    the audit follows the contract and the data follows
    the processing

diligence is bounded by privity; each hop is a party who
chose the next one, and an obligation that is not written to
flow down stops at the first signature while the data does
not

The review is the real kind: scope sections read, questionnaires answered by
engineers, penetration summaries requested, specific terms rather than a policy
by reference, annually, with 2 vendors rejected. It reaches 1 of 2 hops,
so 310 of 310 named subprocessors are unexamined - 0 per ten thousand
audited - and 41 changes arrived last year on notice, drawing 0 objections.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
