<!-- canonical: efficientnewlanguage.org/ai/examples/788-the-provenance-was-signed-by-the-builder | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 788 — The provenance was signed by the builder

`the_provenance_was_signed_by_the_builder.eml` - Nothing deploys without a signed provenance statement naming its source commit, its builder image and every step that ran, and the admission controller refuses anything that does not verify. Who writes the statement is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Nothing deploys
# without a signed provenance statement naming its source commit, its builder
# image and every step that ran, and the admission controller refuses anything
# that does not verify. Who writes the statement is computed below.
#
# The control is real. Verification happens in the admission controller, so a
# deploy that skips it does not reach the cluster; the signing identity is
# short-lived and lives in an HSM rather than in a variable; every signature is
# written to a transparency log; and thirty-seven deploys a month are actually
# refused rather than warned about.
#
# The statement is produced by the build, and signed with the build's own key.

4600 => artifacts_attested_a_month
1900 => deploys_a_month
37 => deploys_refused_for_a_bad_attestation
19 => months_the_control_has_run
11 => fields_in_the_statement
0 => fields_any_other_party_can_contradict
4600 => transparency_log_entries_a_month
0 => log_entries_anyone_has_read_back
0 => independent_rebuilds_a_month
6 => minutes_an_independent_rebuild_would_cost

fields_in_the_statement - fields_any_other_party_can_contradict => fields_only_the_build_can_speak_to
transparency_log_entries_a_month - log_entries_anyone_has_read_back => log_entries_nobody_has_read
artifacts_attested_a_month * minutes_an_independent_rebuild_would_cost => minutes_to_rebuild_a_months_output
int(minutes_to_rebuild_a_months_output / 60) => hours_to_rebuild_a_months_output
int(deploys_refused_for_a_bad_attestation * 10000 / deploys_a_month) => refused_per_myriad

"artifacts attested a month      : " + str(artifacts_attested_a_month) ^0
"deploys a month                 : " + str(deploys_a_month) ^0
"  refused for a bad attestation : " + str(deploys_refused_for_a_bad_attestation) ^0
"  refused share                 : " + str(refused_per_myriad) + " per ten thousand" ^0
"months the control has run      : " + str(months_the_control_has_run) ^0
"" ^0
"fields in the statement         : " + str(fields_in_the_statement) ^0
"  any other party can contradict: " + str(fields_any_other_party_can_contradict) ^0
"  only the build can speak to   : " + str(fields_only_the_build_can_speak_to) ^0
"" ^0
"transparency log entries a month: " + str(transparency_log_entries_a_month) ^0
"  anyone has read back          : " + str(log_entries_anyone_has_read_back) ^0
"  nobody has read               : " + str(log_entries_nobody_has_read) ^0
"" ^0
"independent rebuilds a month    : " + str(independent_rebuilds_a_month) ^0
"  minutes one would cost        : " + str(minutes_an_independent_rebuild_would_cost) ^0
"  hours for a month's output    : " + str(hours_to_rebuild_a_months_output) ^0
"" ^0

# ---- what the control verified ----

"the provenance control" ^0
"  where it runs : the admission controller, so a deploy" ^0
"    that skips it does not reach the cluster" ^0
"  the key : short-lived, in an HSM, not in a variable" ^0
"  every signature : written to a transparency log" ^0
"  deploys refused a month : " + str(deploys_refused_for_a_bad_attestation) + ", refused and not warned" ^0
"  months in place : " + str(months_the_control_has_run) ^0
"  verdict : ATTESTED" ^0
"" ^0
"  refusing in the admission controller rather than in the" ^0
"  pipeline is the part almost nobody does, and it is why" ^0
"  the " + str(deploys_refused_for_a_bad_attestation) + " a month are refusals" ^0
"" ^0

# ---- whose word the statement is ----

"what the signature establishes" ^0
"  who wrote the statement : the build" ^0
"  what it says : this is the commit I read and these are" ^0
"    the steps I ran" ^0
"  who signed it : the same build, with its own identity" ^0
"  fields another party could contradict : " ^0
"    " + str(fields_any_other_party_can_contradict) ^0
"  so a build that is wrong about itself : signs that" ^0
"" ^0
"  the signature proves who is speaking; it cannot make" ^0
"  the speaker a witness to itself" ^0
"" ^0

# ---- what the transparency log adds ----

"the log" ^0
"  entries a month : " + str(transparency_log_entries_a_month) ^0
"  what an entry proves : that this statement existed at" ^0
"    this time and has not been altered since" ^0
"  what it does not prove : that the statement was true" ^0
"    when it was written" ^0
"  entries anyone has read back : " + str(log_entries_anyone_has_read_back) ^0
"  so entries nobody has read : " + str(log_entries_nobody_has_read) ^0
"" ^0
"  an append-only record of unchecked claims is an" ^0
"  append-only record of unchecked claims" ^0
"" ^0

# ---- null control ----

# The same control, plus a second builder that rebuilds each artifact from the
# same commit and compares digests.
4600 => nc_independent_rebuilds_a_month
2 => nc_artifacts_whose_rebuild_did_not_match
37 => nc_deploys_refused_for_a_bad_attestation

"null control - rebuild independently, compare digests" ^0
"  deploys refused for a bad attestation : " ^0
"    " + str(nc_deploys_refused_for_a_bad_attestation) + ", unchanged" ^0
"  independent rebuilds a month : " + str(nc_independent_rebuilds_a_month) ^0
"  artifacts whose rebuild did not match : " ^0
"    " + str(nc_artifacts_whose_rebuild_did_not_match) ^0
"  the signature check did not get stricter; a second" ^0
"  party was given something to say" ^0
"" ^0

# ---- the rule ----

"what a verified attestation guarantees" ^0
"  the artifact carries a statement its builder signed," ^0
"    unaltered since : exactly, in the admission" ^0
"    controller, logged, " + str(months_the_control_has_run) + " months" ^0
"  the artifact is what the statement says : not" ^0
"    addressed; the statement's author is the thing it" ^0
"    describes, and " + str(independent_rebuilds_a_month) + " rebuilds a month contradict it" ^0
"" ^0
"a signature answers who said it and whether it changed;" ^0
"neither question is whether it was true, and nothing here" ^0
"asks a second party" ^0
"" ^0

"Verification runs in the admission controller, the key is short-lived and in an" ^0
"HSM, every signature is logged, and " + str(deploys_refused_for_a_bad_attestation) + " deploys a month are refused - " + str(refused_per_myriad) + " per" ^0
"ten thousand. The build writes the statement and signs it, so " + str(fields_only_the_build_can_speak_to) + " of " + str(fields_in_the_statement) ^0
"fields have no other party who could contradict them, " + str(log_entries_nobody_has_read) + " log entries have never" ^0
"been read back, and a rebuild that would settle it costs " + str(minutes_an_independent_rebuild_would_cost) + " minutes." ^0
```

## Python (deterministic transpilation)

```python
artifacts_attested_a_month = 4600
deploys_a_month = 1900
deploys_refused_for_a_bad_attestation = 37
months_the_control_has_run = 19
fields_in_the_statement = 11
fields_any_other_party_can_contradict = 0
transparency_log_entries_a_month = 4600
log_entries_anyone_has_read_back = 0
independent_rebuilds_a_month = 0
minutes_an_independent_rebuild_would_cost = 6
fields_only_the_build_can_speak_to = fields_in_the_statement - fields_any_other_party_can_contradict
log_entries_nobody_has_read = transparency_log_entries_a_month - log_entries_anyone_has_read_back
minutes_to_rebuild_a_months_output = artifacts_attested_a_month * minutes_an_independent_rebuild_would_cost
hours_to_rebuild_a_months_output = int(minutes_to_rebuild_a_months_output / 60)
refused_per_myriad = int(deploys_refused_for_a_bad_attestation * 10000 / deploys_a_month)
print("artifacts attested a month      : " + str(artifacts_attested_a_month))
print("deploys a month                 : " + str(deploys_a_month))
print("  refused for a bad attestation : " + str(deploys_refused_for_a_bad_attestation))
print("  refused share                 : " + str(refused_per_myriad) + " per ten thousand")
print("months the control has run      : " + str(months_the_control_has_run))
print("")
print("fields in the statement         : " + str(fields_in_the_statement))
print("  any other party can contradict: " + str(fields_any_other_party_can_contradict))
print("  only the build can speak to   : " + str(fields_only_the_build_can_speak_to))
print("")
print("transparency log entries a month: " + str(transparency_log_entries_a_month))
print("  anyone has read back          : " + str(log_entries_anyone_has_read_back))
print("  nobody has read               : " + str(log_entries_nobody_has_read))
print("")
print("independent rebuilds a month    : " + str(independent_rebuilds_a_month))
print("  minutes one would cost        : " + str(minutes_an_independent_rebuild_would_cost))
print("  hours for a month's output    : " + str(hours_to_rebuild_a_months_output))
print("")
print("the provenance control")
print("  where it runs : the admission controller, so a deploy")
print("    that skips it does not reach the cluster")
print("  the key : short-lived, in an HSM, not in a variable")
print("  every signature : written to a transparency log")
print("  deploys refused a month : " + str(deploys_refused_for_a_bad_attestation) + ", refused and not warned")
print("  months in place : " + str(months_the_control_has_run))
print("  verdict : ATTESTED")
print("")
print("  refusing in the admission controller rather than in the")
print("  pipeline is the part almost nobody does, and it is why")
print("  the " + str(deploys_refused_for_a_bad_attestation) + " a month are refusals")
print("")
print("what the signature establishes")
print("  who wrote the statement : the build")
print("  what it says : this is the commit I read and these are")
print("    the steps I ran")
print("  who signed it : the same build, with its own identity")
print("  fields another party could contradict : ")
print("    " + str(fields_any_other_party_can_contradict))
print("  so a build that is wrong about itself : signs that")
print("")
print("  the signature proves who is speaking; it cannot make")
print("  the speaker a witness to itself")
print("")
print("the log")
print("  entries a month : " + str(transparency_log_entries_a_month))
print("  what an entry proves : that this statement existed at")
print("    this time and has not been altered since")
print("  what it does not prove : that the statement was true")
print("    when it was written")
print("  entries anyone has read back : " + str(log_entries_anyone_has_read_back))
print("  so entries nobody has read : " + str(log_entries_nobody_has_read))
print("")
print("  an append-only record of unchecked claims is an")
print("  append-only record of unchecked claims")
print("")
nc_independent_rebuilds_a_month = 4600
nc_artifacts_whose_rebuild_did_not_match = 2
nc_deploys_refused_for_a_bad_attestation = 37
print("null control - rebuild independently, compare digests")
print("  deploys refused for a bad attestation : ")
print("    " + str(nc_deploys_refused_for_a_bad_attestation) + ", unchanged")
print("  independent rebuilds a month : " + str(nc_independent_rebuilds_a_month))
print("  artifacts whose rebuild did not match : ")
print("    " + str(nc_artifacts_whose_rebuild_did_not_match))
print("  the signature check did not get stricter; a second")
print("  party was given something to say")
print("")
print("what a verified attestation guarantees")
print("  the artifact carries a statement its builder signed,")
print("    unaltered since : exactly, in the admission")
print("    controller, logged, " + str(months_the_control_has_run) + " months")
print("  the artifact is what the statement says : not")
print("    addressed; the statement's author is the thing it")
print("    describes, and " + str(independent_rebuilds_a_month) + " rebuilds a month contradict it")
print("")
print("a signature answers who said it and whether it changed;")
print("neither question is whether it was true, and nothing here")
print("asks a second party")
print("")
print("Verification runs in the admission controller, the key is short-lived and in an")
print("HSM, every signature is logged, and " + str(deploys_refused_for_a_bad_attestation) + " deploys a month are refused - " + str(refused_per_myriad) + " per")
print("ten thousand. The build writes the statement and signs it, so " + str(fields_only_the_build_can_speak_to) + " of " + str(fields_in_the_statement))
print("fields have no other party who could contradict them, " + str(log_entries_nobody_has_read) + " log entries have never")
print("been read back, and a rebuild that would settle it costs " + str(minutes_an_independent_rebuild_would_cost) + " minutes.")
```

## stdout (executed)

```text
artifacts attested a month      : 4600
deploys a month                 : 1900
  refused for a bad attestation : 37
  refused share                 : 194 per ten thousand
months the control has run      : 19

fields in the statement         : 11
  any other party can contradict: 0
  only the build can speak to   : 11

transparency log entries a month: 4600
  anyone has read back          : 0
  nobody has read               : 4600

independent rebuilds a month    : 0
  minutes one would cost        : 6
  hours for a month's output    : 460

the provenance control
  where it runs : the admission controller, so a deploy
    that skips it does not reach the cluster
  the key : short-lived, in an HSM, not in a variable
  every signature : written to a transparency log
  deploys refused a month : 37, refused and not warned
  months in place : 19
  verdict : ATTESTED

  refusing in the admission controller rather than in the
  pipeline is the part almost nobody does, and it is why
  the 37 a month are refusals

what the signature establishes
  who wrote the statement : the build
  what it says : this is the commit I read and these are
    the steps I ran
  who signed it : the same build, with its own identity
  fields another party could contradict : 
    0
  so a build that is wrong about itself : signs that

  the signature proves who is speaking; it cannot make
  the speaker a witness to itself

the log
  entries a month : 4600
  what an entry proves : that this statement existed at
    this time and has not been altered since
  what it does not prove : that the statement was true
    when it was written
  entries anyone has read back : 0
  so entries nobody has read : 4600

  an append-only record of unchecked claims is an
  append-only record of unchecked claims

null control - rebuild independently, compare digests
  deploys refused for a bad attestation : 
    37, unchanged
  independent rebuilds a month : 4600
  artifacts whose rebuild did not match : 
    2
  the signature check did not get stricter; a second
  party was given something to say

what a verified attestation guarantees
  the artifact carries a statement its builder signed,
    unaltered since : exactly, in the admission
    controller, logged, 19 months
  the artifact is what the statement says : not
    addressed; the statement's author is the thing it
    describes, and 0 rebuilds a month contradict it

a signature answers who said it and whether it changed;
neither question is whether it was true, and nothing here
asks a second party

Verification runs in the admission controller, the key is short-lived and in an
HSM, every signature is logged, and 37 deploys a month are refused - 194 per
ten thousand. The build writes the statement and signs it, so 11 of 11
fields have no other party who could contradict them, 4600 log entries have never
been read back, and a rebuild that would settle it costs 6 minutes.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
