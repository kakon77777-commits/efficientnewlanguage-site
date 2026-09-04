<!-- canonical: efficientnewlanguage.org/ai/examples/690-the-config-was-per-environment-and-the-secret-was-shared | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 690 — The config was per environment and the secret was shared

`the_config_was_per_environment_and_the_secret_was_shared.eml` - Three environments have three configuration files and forty-nine of fifty-two keys differ between them. What the three identical keys are is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three environments
# have three configuration files and forty-nine of fifty-two keys differ between
# them. What the three identical keys are is computed below.
#
# The separation is real and it was built deliberately. Each environment has its
# own file rather than one file with conditionals; a test asserts that no file
# references another; the deploy refuses if the environment name in the file
# does not match the target; and a review after a staging job wrote to a
# production queue is why all of that exists.
#
# Separation is a property of the FILES. What a key points at is a different
# question, and a key that names a shared location is identical in all three
# files by construction.
#
# One of the three identical keys is a vault path.

3 => environments
52 => keys_per_environment
49 => keys_that_differ
1 => identical_keys_that_are_a_vault_path
0 => cross_file_references
0 => deploys_with_a_mismatched_environment_name

keys_per_environment - keys_that_differ => identical_keys
identical_keys - identical_keys_that_are_a_vault_path => identical_keys_that_are_harmless
int(keys_that_differ * 10000 / keys_per_environment) => differing_per_myriad

"environments                 : " + str(environments) ^0
"keys per environment         : " + str(keys_per_environment) ^0
"keys that differ             : " + str(keys_that_differ) ^0
"share differing              : " + str(differing_per_myriad) + " per ten thousand" ^0
"" ^0
"keys identical in all three  : " + str(identical_keys) ^0
"  harmless                   : " + str(identical_keys_that_are_harmless) ^0
"  a vault path               : " + str(identical_keys_that_are_a_vault_path) ^0
"" ^0

# ---- what the separation verified ----

"the environment discipline" ^0
"  one file per environment, not conditionals : yes" ^0
"  a test asserts no file references another  : yes" ^0
"  cross-file references found                : " + str(cross_file_references) ^0
"  deploy refuses on a name mismatch          : yes" ^0
"  deploys with a mismatched name             : " + str(deploys_with_a_mismatched_environment_name) ^0
"  written after                              : a staging job" ^0
"    that wrote to a production queue" ^0
"  verdict                                    : SEPARATED" ^0
"" ^0
"  the incident that produced this was real and the" ^0
"  discipline has held since" ^0
"" ^0

# ---- what a key can be ----

"the two ways a key can be identical" ^0
"  because it is the same everywhere and harmless : a log" ^0
"    format, a retry count" ^0
"  because it names a shared thing                : a vault" ^0
"    path, a bucket, a queue" ^0
"  what a diff of the files shows : that they are identical" ^0
"  what it does not show          : which kind" ^0
"" ^0
"  a review that reads the diff sees three identical lines" ^0
"  and no reason to read them as three different findings" ^0
"" ^0

# ---- what that one key means ----

# Staging fetches the same credential as production. Every staging deploy, every
# developer with staging access and every staging log that echoes the
# environment holds a production secret.
"the shared credential" ^0
"  environments that fetch it     : " + str(environments) ^0
"  environments that should       : 1" ^0
"  staging access is granted more widely : yes, by design" ^0
"  the vault audit log shows      : three services fetching" ^0
"    one secret, each authorised to" ^0
"  anything anomalous in that log : nothing" ^0
"" ^0

# ---- null control ----

# The same discipline, with the test extended from "no file references another"
# to "no VALUE in two files names the same external resource".
0 => nc_shared_external_resources
identical_keys_that_are_harmless => nc_identical_keys_remaining

"null control - the test compares values, not just references" ^0
"  cross-file references : " + str(cross_file_references) + ", unchanged" ^0
"  identical keys remaining : " + str(nc_identical_keys_remaining) ^0
"  shared external resources : " + str(nc_shared_external_resources) ^0
"  the separation did not get stricter; the test started" ^0
"  reading what a key points at rather than where it lives" ^0
"" ^0

# ---- the rule ----

"what per-environment configuration guarantees" ^0
"  each environment is configured independently : exactly" ^0
"  each environment is isolated                 : not" ^0
"    addressed; isolation is a property of the resources" ^0
"    the values name, and two files can differ everywhere" ^0
"    and still point at one thing" ^0
"" ^0
"separating configuration separates the decisions; whether it" ^0
"separates the systems depends on the values, and a test that" ^0
"checks for references between files cannot see a value they" ^0
"happen to share" ^0
"" ^0

"The separation is genuine: one file per environment rather than conditionals," ^0
str(cross_file_references) + " cross-file references, a deploy that refuses on a name mismatch and " + str(deploys_with_a_mismatched_environment_name) ^0
"that have slipped through, all written after a staging job reached a production" ^0
"queue. " + str(keys_that_differ) + " of " + str(keys_per_environment) + " keys differ - " + str(differing_per_myriad) + " per ten thousand - and " + str(identical_keys_that_are_a_vault_path) + " of the " + str(identical_keys) ^0
"identical ones is a vault path, so all " + str(environments) + " environments hold one credential." ^0
```

## Python (deterministic transpilation)

```python
environments = 3
keys_per_environment = 52
keys_that_differ = 49
identical_keys_that_are_a_vault_path = 1
cross_file_references = 0
deploys_with_a_mismatched_environment_name = 0
identical_keys = keys_per_environment - keys_that_differ
identical_keys_that_are_harmless = identical_keys - identical_keys_that_are_a_vault_path
differing_per_myriad = int(keys_that_differ * 10000 / keys_per_environment)
print("environments                 : " + str(environments))
print("keys per environment         : " + str(keys_per_environment))
print("keys that differ             : " + str(keys_that_differ))
print("share differing              : " + str(differing_per_myriad) + " per ten thousand")
print("")
print("keys identical in all three  : " + str(identical_keys))
print("  harmless                   : " + str(identical_keys_that_are_harmless))
print("  a vault path               : " + str(identical_keys_that_are_a_vault_path))
print("")
print("the environment discipline")
print("  one file per environment, not conditionals : yes")
print("  a test asserts no file references another  : yes")
print("  cross-file references found                : " + str(cross_file_references))
print("  deploy refuses on a name mismatch          : yes")
print("  deploys with a mismatched name             : " + str(deploys_with_a_mismatched_environment_name))
print("  written after                              : a staging job")
print("    that wrote to a production queue")
print("  verdict                                    : SEPARATED")
print("")
print("  the incident that produced this was real and the")
print("  discipline has held since")
print("")
print("the two ways a key can be identical")
print("  because it is the same everywhere and harmless : a log")
print("    format, a retry count")
print("  because it names a shared thing                : a vault")
print("    path, a bucket, a queue")
print("  what a diff of the files shows : that they are identical")
print("  what it does not show          : which kind")
print("")
print("  a review that reads the diff sees three identical lines")
print("  and no reason to read them as three different findings")
print("")
print("the shared credential")
print("  environments that fetch it     : " + str(environments))
print("  environments that should       : 1")
print("  staging access is granted more widely : yes, by design")
print("  the vault audit log shows      : three services fetching")
print("    one secret, each authorised to")
print("  anything anomalous in that log : nothing")
print("")
nc_shared_external_resources = 0
nc_identical_keys_remaining = identical_keys_that_are_harmless
print("null control - the test compares values, not just references")
print("  cross-file references : " + str(cross_file_references) + ", unchanged")
print("  identical keys remaining : " + str(nc_identical_keys_remaining))
print("  shared external resources : " + str(nc_shared_external_resources))
print("  the separation did not get stricter; the test started")
print("  reading what a key points at rather than where it lives")
print("")
print("what per-environment configuration guarantees")
print("  each environment is configured independently : exactly")
print("  each environment is isolated                 : not")
print("    addressed; isolation is a property of the resources")
print("    the values name, and two files can differ everywhere")
print("    and still point at one thing")
print("")
print("separating configuration separates the decisions; whether it")
print("separates the systems depends on the values, and a test that")
print("checks for references between files cannot see a value they")
print("happen to share")
print("")
print("The separation is genuine: one file per environment rather than conditionals,")
print(str(cross_file_references) + " cross-file references, a deploy that refuses on a name mismatch and " + str(deploys_with_a_mismatched_environment_name))
print("that have slipped through, all written after a staging job reached a production")
print("queue. " + str(keys_that_differ) + " of " + str(keys_per_environment) + " keys differ - " + str(differing_per_myriad) + " per ten thousand - and " + str(identical_keys_that_are_a_vault_path) + " of the " + str(identical_keys))
print("identical ones is a vault path, so all " + str(environments) + " environments hold one credential.")
```

## stdout (executed)

```text
environments                 : 3
keys per environment         : 52
keys that differ             : 49
share differing              : 9423 per ten thousand

keys identical in all three  : 3
  harmless                   : 2
  a vault path               : 1

the environment discipline
  one file per environment, not conditionals : yes
  a test asserts no file references another  : yes
  cross-file references found                : 0
  deploy refuses on a name mismatch          : yes
  deploys with a mismatched name             : 0
  written after                              : a staging job
    that wrote to a production queue
  verdict                                    : SEPARATED

  the incident that produced this was real and the
  discipline has held since

the two ways a key can be identical
  because it is the same everywhere and harmless : a log
    format, a retry count
  because it names a shared thing                : a vault
    path, a bucket, a queue
  what a diff of the files shows : that they are identical
  what it does not show          : which kind

  a review that reads the diff sees three identical lines
  and no reason to read them as three different findings

the shared credential
  environments that fetch it     : 3
  environments that should       : 1
  staging access is granted more widely : yes, by design
  the vault audit log shows      : three services fetching
    one secret, each authorised to
  anything anomalous in that log : nothing

null control - the test compares values, not just references
  cross-file references : 0, unchanged
  identical keys remaining : 2
  shared external resources : 0
  the separation did not get stricter; the test started
  reading what a key points at rather than where it lives

what per-environment configuration guarantees
  each environment is configured independently : exactly
  each environment is isolated                 : not
    addressed; isolation is a property of the resources
    the values name, and two files can differ everywhere
    and still point at one thing

separating configuration separates the decisions; whether it
separates the systems depends on the values, and a test that
checks for references between files cannot see a value they
happen to share

The separation is genuine: one file per environment rather than conditionals,
0 cross-file references, a deploy that refuses on a name mismatch and 0
that have slipped through, all written after a staging job reached a production
queue. 49 of 52 keys differ - 9423 per ten thousand - and 1 of the 3
identical ones is a vault path, so all 3 environments hold one credential.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
