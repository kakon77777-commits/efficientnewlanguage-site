<!-- canonical: efficientnewlanguage.org/ai/examples/703-the-consent-was-recorded-and-the-purpose-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 703 — The consent was recorded and the purpose was not

`the_consent_was_recorded_and_the_purpose_was_not.eml` - Consent is recorded for every subject, versioned, timestamped and revocable, and an audit sample reconciled completely. How much processing it covers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Consent is recorded
# for every subject, versioned, timestamped and revocable, and an audit sample
# reconciled completely. How much processing it covers is computed below.
#
# The consent record is well built. Each one stores the exact text that was
# shown, the version of that text, the timestamp, and the interface it was given
# through; revocation is a first-class operation that propagates to the store in
# a median of nine seconds; and an external auditor sampled two hundred records
# and reconciled all two hundred against the subject's own account history.
#
# What the record establishes is that the subject AGREED. Whether a particular
# read of that data is something they agreed to is a different proposition, and
# it needs the purpose of the read, which no read carries.
#
# Thirty-one systems read this data and four purposes were declared.

1840000 => consent_records
200 => records_the_auditor_sampled
200 => records_that_reconciled
7 => versions_of_the_consent_text
9 => median_seconds_to_propagate_a_revocation
31 => systems_reading_this_data
4 => purposes_declared_at_collection
19 => systems_whose_purpose_is_among_the_declared
0 => reads_carrying_a_purpose

systems_reading_this_data - systems_whose_purpose_is_among_the_declared => systems_outside_the_declared_purposes
int(systems_outside_the_declared_purposes * 10000 / systems_reading_this_data) => outside_per_myriad

"consent records                 : " + str(consent_records) ^0
"versions of the consent text    : " + str(versions_of_the_consent_text) ^0
"records sampled by the auditor  : " + str(records_the_auditor_sampled) ^0
"  of those, reconciled          : " + str(records_that_reconciled) ^0
"revocation propagates in, seconds : " + str(median_seconds_to_propagate_a_revocation) ^0
"" ^0
"purposes declared at collection : " + str(purposes_declared_at_collection) ^0
"systems reading this data       : " + str(systems_reading_this_data) ^0
"  purpose among the declared    : " + str(systems_whose_purpose_is_among_the_declared) ^0
"  outside them                  : " + str(systems_outside_the_declared_purposes) ^0
"reads carrying a purpose        : " + str(reads_carrying_a_purpose) ^0
"share of readers outside        : " + str(outside_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the consent record verified ----

"the consent capture" ^0
"  stores the exact text shown : yes, with its version" ^0
"  stores when and through what interface : yes" ^0
"  revocation : a first-class operation, propagating in" ^0
"    about " + str(median_seconds_to_propagate_a_revocation) + " seconds" ^0
"  external audit sample : " + str(records_the_auditor_sampled) ^0
"  of those reconciled against the subject's own history : " + str(records_that_reconciled) ^0
"  verdict : RECORDED" ^0
"" ^0
"  storing the shown text and its version, rather than a" ^0
"  boolean, is the expensive choice and the right one" ^0
"" ^0

# ---- what the record is a statement about ----

"one consent record" ^0
"  the proposition it proves : this subject agreed to this" ^0
"    text on this date" ^0
"  the proposition an access needs : this read is for a" ^0
"    purpose that text covers" ^0
"  what joins the two : the purpose of the read" ^0
"  where the purpose of a read is stored : nowhere; a read" ^0
"    is a query for rows" ^0
"" ^0
"  the record is complete about the act of agreeing and" ^0
"  silent about what the data is then used for" ^0
"" ^0

# ---- what a lawful-basis check can see ----

# The gate in front of the store asks whether a valid consent record exists for
# the subject. That question is answerable and the answer is right. The question
# it stands in for is whether this use is one of the four.
"the check performed at read time" ^0
"  asks     : does this subject have live consent" ^0
"  answers  : correctly, from the record" ^0
"  does not ask : what this caller is about to do" ^0
"  callers that could answer it : all of them" ^0
"  callers that are asked       : " + str(reads_carrying_a_purpose) ^0
"" ^0

# ---- how the four became thirty-one ----

# No system was added dishonestly. Each was a reasonable use of data the company
# already held, approved by someone who checked that consent existed.
"how a reader ends up outside the four" ^0
"  a new system needs the data : it asks for access" ^0
"  the approver checks         : that consent exists" ^0
"  that check passes           : because it does exist" ^0
"  the declared purposes       : " + str(purposes_declared_at_collection) + ", written at collection" ^0
"  systems now reading         : " + str(systems_reading_this_data) ^0
"  approvals that compared the two : none required one" ^0
"" ^0

# ---- null control ----

# The same consent record, with a purpose passed on every read and checked
# against the version of the text that subject actually saw.
systems_reading_this_data => nc_reads_carrying_a_purpose
systems_outside_the_declared_purposes => nc_reads_refused_or_sent_for_re_consent

"null control - every read carries its purpose" ^0
"  records sampled and reconciled : " + str(records_that_reconciled) + ", unchanged" ^0
"  readers declaring a purpose    : " + str(nc_reads_carrying_a_purpose) ^0
"  readers refused or sent for re-consent : " + str(nc_reads_refused_or_sent_for_re_consent) ^0
"  the consent record did not improve; the second operand" ^0
"  of the comparison started existing" ^0
"" ^0

# ---- the rule ----

"what a complete consent record guarantees" ^0
"  the subject agreed, to this text, on this date : exactly," ^0
"    and better than a boolean ever could" ^0
"  this processing is covered by that agreement   : not" ^0
"    addressed; that is a claim about two things, and the" ^0
"    system stores one of them" ^0
"" ^0
"consent is a relation between a subject and a purpose; a" ^0
"record that stores only the subject makes the lawful-basis" ^0
"question look answered by a lookup that cannot fail" ^0
"" ^0

"Consent is captured properly: the exact text and its version, the timestamp," ^0
"the interface, revocation propagating in " + str(median_seconds_to_propagate_a_revocation) + " seconds, and " + str(records_that_reconciled) + " of " + str(records_the_auditor_sampled) ^0
"audited records reconciling against the subject's own history. It records that" ^0
"the subject agreed and not what the data is used for, so of the " + str(systems_reading_this_data) + " systems" ^0
"reading it, " + str(systems_outside_the_declared_purposes) + " - " + str(outside_per_myriad) + " per ten thousand - are outside the " + str(purposes_declared_at_collection) + " declared" ^0
"purposes, and " + str(reads_carrying_a_purpose) + " reads carry a purpose for the check to compare against." ^0
```

## Python (deterministic transpilation)

```python
consent_records = 1840000
records_the_auditor_sampled = 200
records_that_reconciled = 200
versions_of_the_consent_text = 7
median_seconds_to_propagate_a_revocation = 9
systems_reading_this_data = 31
purposes_declared_at_collection = 4
systems_whose_purpose_is_among_the_declared = 19
reads_carrying_a_purpose = 0
systems_outside_the_declared_purposes = systems_reading_this_data - systems_whose_purpose_is_among_the_declared
outside_per_myriad = int(systems_outside_the_declared_purposes * 10000 / systems_reading_this_data)
print("consent records                 : " + str(consent_records))
print("versions of the consent text    : " + str(versions_of_the_consent_text))
print("records sampled by the auditor  : " + str(records_the_auditor_sampled))
print("  of those, reconciled          : " + str(records_that_reconciled))
print("revocation propagates in, seconds : " + str(median_seconds_to_propagate_a_revocation))
print("")
print("purposes declared at collection : " + str(purposes_declared_at_collection))
print("systems reading this data       : " + str(systems_reading_this_data))
print("  purpose among the declared    : " + str(systems_whose_purpose_is_among_the_declared))
print("  outside them                  : " + str(systems_outside_the_declared_purposes))
print("reads carrying a purpose        : " + str(reads_carrying_a_purpose))
print("share of readers outside        : " + str(outside_per_myriad) + " per ten thousand")
print("")
print("the consent capture")
print("  stores the exact text shown : yes, with its version")
print("  stores when and through what interface : yes")
print("  revocation : a first-class operation, propagating in")
print("    about " + str(median_seconds_to_propagate_a_revocation) + " seconds")
print("  external audit sample : " + str(records_the_auditor_sampled))
print("  of those reconciled against the subject's own history : " + str(records_that_reconciled))
print("  verdict : RECORDED")
print("")
print("  storing the shown text and its version, rather than a")
print("  boolean, is the expensive choice and the right one")
print("")
print("one consent record")
print("  the proposition it proves : this subject agreed to this")
print("    text on this date")
print("  the proposition an access needs : this read is for a")
print("    purpose that text covers")
print("  what joins the two : the purpose of the read")
print("  where the purpose of a read is stored : nowhere; a read")
print("    is a query for rows")
print("")
print("  the record is complete about the act of agreeing and")
print("  silent about what the data is then used for")
print("")
print("the check performed at read time")
print("  asks     : does this subject have live consent")
print("  answers  : correctly, from the record")
print("  does not ask : what this caller is about to do")
print("  callers that could answer it : all of them")
print("  callers that are asked       : " + str(reads_carrying_a_purpose))
print("")
print("how a reader ends up outside the four")
print("  a new system needs the data : it asks for access")
print("  the approver checks         : that consent exists")
print("  that check passes           : because it does exist")
print("  the declared purposes       : " + str(purposes_declared_at_collection) + ", written at collection")
print("  systems now reading         : " + str(systems_reading_this_data))
print("  approvals that compared the two : none required one")
print("")
nc_reads_carrying_a_purpose = systems_reading_this_data
nc_reads_refused_or_sent_for_re_consent = systems_outside_the_declared_purposes
print("null control - every read carries its purpose")
print("  records sampled and reconciled : " + str(records_that_reconciled) + ", unchanged")
print("  readers declaring a purpose    : " + str(nc_reads_carrying_a_purpose))
print("  readers refused or sent for re-consent : " + str(nc_reads_refused_or_sent_for_re_consent))
print("  the consent record did not improve; the second operand")
print("  of the comparison started existing")
print("")
print("what a complete consent record guarantees")
print("  the subject agreed, to this text, on this date : exactly,")
print("    and better than a boolean ever could")
print("  this processing is covered by that agreement   : not")
print("    addressed; that is a claim about two things, and the")
print("    system stores one of them")
print("")
print("consent is a relation between a subject and a purpose; a")
print("record that stores only the subject makes the lawful-basis")
print("question look answered by a lookup that cannot fail")
print("")
print("Consent is captured properly: the exact text and its version, the timestamp,")
print("the interface, revocation propagating in " + str(median_seconds_to_propagate_a_revocation) + " seconds, and " + str(records_that_reconciled) + " of " + str(records_the_auditor_sampled))
print("audited records reconciling against the subject's own history. It records that")
print("the subject agreed and not what the data is used for, so of the " + str(systems_reading_this_data) + " systems")
print("reading it, " + str(systems_outside_the_declared_purposes) + " - " + str(outside_per_myriad) + " per ten thousand - are outside the " + str(purposes_declared_at_collection) + " declared")
print("purposes, and " + str(reads_carrying_a_purpose) + " reads carry a purpose for the check to compare against.")
```

## stdout (executed)

```text
consent records                 : 1840000
versions of the consent text    : 7
records sampled by the auditor  : 200
  of those, reconciled          : 200
revocation propagates in, seconds : 9

purposes declared at collection : 4
systems reading this data       : 31
  purpose among the declared    : 19
  outside them                  : 12
reads carrying a purpose        : 0
share of readers outside        : 3870 per ten thousand

the consent capture
  stores the exact text shown : yes, with its version
  stores when and through what interface : yes
  revocation : a first-class operation, propagating in
    about 9 seconds
  external audit sample : 200
  of those reconciled against the subject's own history : 200
  verdict : RECORDED

  storing the shown text and its version, rather than a
  boolean, is the expensive choice and the right one

one consent record
  the proposition it proves : this subject agreed to this
    text on this date
  the proposition an access needs : this read is for a
    purpose that text covers
  what joins the two : the purpose of the read
  where the purpose of a read is stored : nowhere; a read
    is a query for rows

  the record is complete about the act of agreeing and
  silent about what the data is then used for

the check performed at read time
  asks     : does this subject have live consent
  answers  : correctly, from the record
  does not ask : what this caller is about to do
  callers that could answer it : all of them
  callers that are asked       : 0

how a reader ends up outside the four
  a new system needs the data : it asks for access
  the approver checks         : that consent exists
  that check passes           : because it does exist
  the declared purposes       : 4, written at collection
  systems now reading         : 31
  approvals that compared the two : none required one

null control - every read carries its purpose
  records sampled and reconciled : 200, unchanged
  readers declaring a purpose    : 31
  readers refused or sent for re-consent : 12
  the consent record did not improve; the second operand
  of the comparison started existing

what a complete consent record guarantees
  the subject agreed, to this text, on this date : exactly,
    and better than a boolean ever could
  this processing is covered by that agreement   : not
    addressed; that is a claim about two things, and the
    system stores one of them

consent is a relation between a subject and a purpose; a
record that stores only the subject makes the lawful-basis
question look answered by a lookup that cannot fail

Consent is captured properly: the exact text and its version, the timestamp,
the interface, revocation propagating in 9 seconds, and 200 of 200
audited records reconciling against the subject's own history. It records that
the subject agreed and not what the data is used for, so of the 31 systems
reading it, 12 - 3870 per ten thousand - are outside the 4 declared
purposes, and 0 reads carry a purpose for the check to compare against.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
