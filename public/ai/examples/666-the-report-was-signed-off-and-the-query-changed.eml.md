<!-- canonical: efficientnewlanguage.org/ai/examples/666-the-report-was-signed-off-and-the-query-changed | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 666 — The report was signed off and the query changed

`the_report_was_signed_off_and_the_query_changed.eml` - Three people reviewed the quarterly report and signed it. What re-running it gives today is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three people
# reviewed the quarterly report and signed it. What re-running it gives today is
# computed below.
#
# The sign-off is real. Three named reviewers each opened the report, checked
# the totals against two independent sources, questioned one line and had it
# corrected, and signed. The signature is cryptographic, covers the exact bytes
# of the PDF, and verifies today.
#
# The signature covers the DOCUMENT. The document is an output; the thing that
# produced it is a saved query in the reporting tool, referenced by name, and
# names are rebound.
#
# Two weeks after the signature the query gained a filter — a correct filter,
# excluding test accounts, added by someone fixing a different report.

3 => reviewers
41800 => rows_in_the_signed_report
38240 => rows_when_rerun_today
14 => days_between_signature_and_edit
1 => query_edits_since
0 => query_versions_stored
0 => signature_verification_failures

rows_in_the_signed_report - rows_when_rerun_today => rows_the_filter_removes

"reviewers                       : " + str(reviewers) ^0
"rows in the signed report       : " + str(rows_in_the_signed_report) ^0
"rows when rerun today           : " + str(rows_when_rerun_today) ^0
"rows the new filter removes     : " + str(rows_the_filter_removes) ^0
"days between signature and edit : " + str(days_between_signature_and_edit) ^0
"" ^0

# ---- what the signature verified ----

"the signature" ^0
"  covers            : the exact bytes of the pdf" ^0
"  algorithm         : verifies today" ^0
"  verification failures : " + str(signature_verification_failures) ^0
"  reviewers         : " + str(reviewers) + ", each named" ^0
"  totals checked against two independent sources : yes" ^0
"  lines questioned and corrected during review : 1" ^0
"  verdict           : SIGNED, VALID" ^0
"" ^0
"  the review was not a formality; it found and fixed" ^0
"  something" ^0
"" ^0

# ---- what it does not cover ----

"what produced those bytes" ^0
"  the query          : saved in the reporting tool, by name" ^0
"  versions stored    : " + str(query_versions_stored) ^0
"  edits since the signature : " + str(query_edits_since) ^0
"  the edit itself    : correct, excluding test accounts" ^0
"  attached to the signature : nothing about the query" ^0
"" ^0
"  the signed artifact is downstream of a mutable" ^0
"  definition, and the signature names neither" ^0
"" ^0

int(rows_the_filter_removes * 10000 / rows_in_the_signed_report) => difference_per_myriad
"difference on re-running : " + str(difference_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- which number is right ----

# Both. The signed figure is the correct answer to the question as it was asked
# in the quarter; today's is the correct answer to the question as it is asked
# now. Nothing records that they are different questions.
"the two figures" ^0
"  signed        : " + str(rows_in_the_signed_report) + ", correct for the question then" ^0
"  today         : " + str(rows_when_rerun_today) + ", correct for the question now" ^0
"  which is the report's figure : both, at different times" ^0
"  a record that the question changed : none" ^0
"" ^0
"  a reader who reruns it to check the signed number will" ^0
"  conclude the signed number was wrong" ^0
"" ^0

# ---- null control ----

# The same review, with the query text hashed into the signed document.
rows_in_the_signed_report => nc_rows_when_rerun
1 => nc_query_versions_stored

"null control - the query text hashed into the document" ^0
"  signature verification failures : " + str(signature_verification_failures) + ", unchanged" ^0
"  query versions stored : " + str(nc_query_versions_stored) ^0
"  rows when rerun       : " + str(nc_rows_when_rerun) ^0
"  the signature did not get stronger; what it covers" ^0
"  became the whole of what produced the number" ^0
"" ^0

# ---- the rule ----

"what a signature guarantees" ^0
"  these bytes are the bytes that were reviewed : exactly" ^0
"  this number can be reproduced                : not" ^0
"    addressed; reproduction runs a definition, and the" ^0
"    signature covers an output" ^0
"" ^0
"signing an artifact and being able to derive it again are" ^0
"different properties; the second needs the inputs inside the" ^0
"envelope, and a saved query referenced by name is not one" ^0
"" ^0

"Three reviewers signed the report, the signature covers the exact bytes and" ^0
"verifies today with " + str(signature_verification_failures) + " failures, and the review corrected a line. " + str(days_between_signature_and_edit) + " days" ^0
"later the query behind it gained a correct filter, so re-running gives " + str(rows_when_rerun_today) ^0
"against the signed " + str(rows_in_the_signed_report) + " - a difference of " + str(rows_the_filter_removes) + ", " + str(difference_per_myriad) + " per ten thousand -" ^0
"with " + str(query_versions_stored) + " versions of the definition stored anywhere." ^0
```

## Python (deterministic transpilation)

```python
reviewers = 3
rows_in_the_signed_report = 41800
rows_when_rerun_today = 38240
days_between_signature_and_edit = 14
query_edits_since = 1
query_versions_stored = 0
signature_verification_failures = 0
rows_the_filter_removes = rows_in_the_signed_report - rows_when_rerun_today
print("reviewers                       : " + str(reviewers))
print("rows in the signed report       : " + str(rows_in_the_signed_report))
print("rows when rerun today           : " + str(rows_when_rerun_today))
print("rows the new filter removes     : " + str(rows_the_filter_removes))
print("days between signature and edit : " + str(days_between_signature_and_edit))
print("")
print("the signature")
print("  covers            : the exact bytes of the pdf")
print("  algorithm         : verifies today")
print("  verification failures : " + str(signature_verification_failures))
print("  reviewers         : " + str(reviewers) + ", each named")
print("  totals checked against two independent sources : yes")
print("  lines questioned and corrected during review : 1")
print("  verdict           : SIGNED, VALID")
print("")
print("  the review was not a formality; it found and fixed")
print("  something")
print("")
print("what produced those bytes")
print("  the query          : saved in the reporting tool, by name")
print("  versions stored    : " + str(query_versions_stored))
print("  edits since the signature : " + str(query_edits_since))
print("  the edit itself    : correct, excluding test accounts")
print("  attached to the signature : nothing about the query")
print("")
print("  the signed artifact is downstream of a mutable")
print("  definition, and the signature names neither")
print("")
difference_per_myriad = int(rows_the_filter_removes * 10000 / rows_in_the_signed_report)
print("difference on re-running : " + str(difference_per_myriad) + " per ten thousand")
print("")
print("the two figures")
print("  signed        : " + str(rows_in_the_signed_report) + ", correct for the question then")
print("  today         : " + str(rows_when_rerun_today) + ", correct for the question now")
print("  which is the report's figure : both, at different times")
print("  a record that the question changed : none")
print("")
print("  a reader who reruns it to check the signed number will")
print("  conclude the signed number was wrong")
print("")
nc_rows_when_rerun = rows_in_the_signed_report
nc_query_versions_stored = 1
print("null control - the query text hashed into the document")
print("  signature verification failures : " + str(signature_verification_failures) + ", unchanged")
print("  query versions stored : " + str(nc_query_versions_stored))
print("  rows when rerun       : " + str(nc_rows_when_rerun))
print("  the signature did not get stronger; what it covers")
print("  became the whole of what produced the number")
print("")
print("what a signature guarantees")
print("  these bytes are the bytes that were reviewed : exactly")
print("  this number can be reproduced                : not")
print("    addressed; reproduction runs a definition, and the")
print("    signature covers an output")
print("")
print("signing an artifact and being able to derive it again are")
print("different properties; the second needs the inputs inside the")
print("envelope, and a saved query referenced by name is not one")
print("")
print("Three reviewers signed the report, the signature covers the exact bytes and")
print("verifies today with " + str(signature_verification_failures) + " failures, and the review corrected a line. " + str(days_between_signature_and_edit) + " days")
print("later the query behind it gained a correct filter, so re-running gives " + str(rows_when_rerun_today))
print("against the signed " + str(rows_in_the_signed_report) + " - a difference of " + str(rows_the_filter_removes) + ", " + str(difference_per_myriad) + " per ten thousand -")
print("with " + str(query_versions_stored) + " versions of the definition stored anywhere.")
```

## stdout (executed)

```text
reviewers                       : 3
rows in the signed report       : 41800
rows when rerun today           : 38240
rows the new filter removes     : 3560
days between signature and edit : 14

the signature
  covers            : the exact bytes of the pdf
  algorithm         : verifies today
  verification failures : 0
  reviewers         : 3, each named
  totals checked against two independent sources : yes
  lines questioned and corrected during review : 1
  verdict           : SIGNED, VALID

  the review was not a formality; it found and fixed
  something

what produced those bytes
  the query          : saved in the reporting tool, by name
  versions stored    : 0
  edits since the signature : 1
  the edit itself    : correct, excluding test accounts
  attached to the signature : nothing about the query

  the signed artifact is downstream of a mutable
  definition, and the signature names neither

difference on re-running : 851 per ten thousand

the two figures
  signed        : 41800, correct for the question then
  today         : 38240, correct for the question now
  which is the report's figure : both, at different times
  a record that the question changed : none

  a reader who reruns it to check the signed number will
  conclude the signed number was wrong

null control - the query text hashed into the document
  signature verification failures : 0, unchanged
  query versions stored : 1
  rows when rerun       : 41800
  the signature did not get stronger; what it covers
  became the whole of what produced the number

what a signature guarantees
  these bytes are the bytes that were reviewed : exactly
  this number can be reproduced                : not
    addressed; reproduction runs a definition, and the
    signature covers an output

signing an artifact and being able to derive it again are
different properties; the second needs the inputs inside the
envelope, and a saved query referenced by name is not one

Three reviewers signed the report, the signature covers the exact bytes and
verifies today with 0 failures, and the review corrected a line. 14 days
later the query behind it gained a correct filter, so re-running gives 38240
against the signed 41800 - a difference of 3560, 851 per ten thousand -
with 0 versions of the definition stored anywhere.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
