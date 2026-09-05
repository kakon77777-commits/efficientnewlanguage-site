<!-- canonical: efficientnewlanguage.org/ai/examples/705-the-endpoint-was-versioned-and-the-error-shape-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 705 — The endpoint was versioned and the error shape was not

`the_endpoint_was_versioned_and_the_error_shape_was_not.eml` - The API is versioned with discipline and no success schema has broken outside a major bump in three years. What is outside the version is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The API is
# versioned with discipline and no success schema has broken outside a major
# bump in three years. What is outside the version is computed below.
#
# The versioning is done properly. Two majors are served side by side, every
# documented response schema has a contract test that runs on every commit, a
# breaking change requires a new major rather than a note in a changelog, and
# the eighteen-month deprecation policy has been honoured to the point that v1
# is still served three years after v2 shipped.
#
# The contract tests assert the schemas the endpoints document, which are the
# success bodies. An error body is not produced by an endpoint; it is produced
# by one shared middleware, and that middleware is not versioned.
#
# A framework upgrade changed the error envelope in both majors at once.

214 => endpoints
2 => majors_served_side_by_side
214 => success_schemas_documented
214 => success_schemas_with_a_contract_test
0 => breaking_success_changes_outside_a_major_in_three_years
1 => middlewares_producing_error_bodies
0 => error_schemas_documented
0 => error_schemas_with_a_contract_test
96 => integrations
84 => integrations_reading_a_field_out_of_the_error_body
62000000 => responses_per_day
2480000 => responses_that_are_errors

integrations - integrations_reading_a_field_out_of_the_error_body => integrations_that_only_read_success_bodies
int(integrations_reading_a_field_out_of_the_error_body * 10000 / integrations) => exposed_per_myriad
int(responses_that_are_errors * 10000 / responses_per_day) => error_share_per_myriad

"endpoints                        : " + str(endpoints) ^0
"majors served side by side       : " + str(majors_served_side_by_side) ^0
"success schemas documented       : " + str(success_schemas_documented) ^0
"  with a contract test           : " + str(success_schemas_with_a_contract_test) ^0
"breaking success changes in three years : " + str(breaking_success_changes_outside_a_major_in_three_years) ^0
"" ^0
"error schemas documented         : " + str(error_schemas_documented) ^0
"  with a contract test           : " + str(error_schemas_with_a_contract_test) ^0
"middlewares producing them       : " + str(middlewares_producing_error_bodies) ^0
"" ^0
"integrations                     : " + str(integrations) ^0
"  reading a field from an error  : " + str(integrations_reading_a_field_out_of_the_error_body) ^0
"  reading only success bodies    : " + str(integrations_that_only_read_success_bodies) ^0
"  exposed share                  : " + str(exposed_per_myriad) + " per ten thousand" ^0
"responses a day                  : " + str(responses_per_day) ^0
"  that are errors                : " + str(responses_that_are_errors) + ", " + str(error_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the versioning verified ----

"the version discipline" ^0
"  majors coexist rather than replace : yes" ^0
"  documented schemas with a contract test : " + str(success_schemas_with_a_contract_test) + " of " + str(success_schemas_documented) ^0
"  a breaking change requires a new major : enforced, not" ^0
"    written down" ^0
"  deprecation policy honoured : v1 still served three" ^0
"    years after v2" ^0
"  verdict : VERSIONED" ^0
"" ^0
"  serving two majors for three years costs real money and" ^0
"  is the reason clients trust the guarantee" ^0
"" ^0

# ---- what a version is a property of ----

"the versioned unit" ^0
"  what carries a version : the endpoint" ^0
"  what an endpoint produces on success : a body it" ^0
"    documents, tested against its schema" ^0
"  what produces the body on failure : " + str(middlewares_producing_error_bodies) + " shared middleware" ^0
"  which major that middleware belongs to : neither; it" ^0
"    sits in front of both" ^0
"" ^0
"  the contract is complete over the responses an endpoint" ^0
"  authors, and an endpoint does not author its errors" ^0
"" ^0

# ---- what a client actually parses ----

# A client that only ever reads success bodies is fully protected. A client with
# retry logic, or error mapping, or a user-facing message, reads the error body,
# and there is no version in which that shape is promised.
"one integration" ^0
"  reads the success body : covered by the contract" ^0
"  reads the error body   : to decide whether to retry, and" ^0
"    to show a message" ^0
"  the field it reads     : shown in an example in the" ^0
"    guide, not in a schema" ^0
"  integrations doing this : " + str(integrations_reading_a_field_out_of_the_error_body) + " of " + str(integrations) ^0
"" ^0

# ---- what the upgrade changed ----

# The framework upgrade was reviewed, tested, and green. The full contract suite
# passed, because the contract suite is about success schemas, and it changed
# the error envelope for v1 and v2 in the same deploy.
"the framework upgrade" ^0
"  contract tests run     : " + str(success_schemas_with_a_contract_test) ^0
"  contract tests failing : " + str(breaking_success_changes_outside_a_major_in_three_years) ^0
"  majors affected        : " + str(majors_served_side_by_side) + ", in one deploy" ^0
"  what a v1 client was promised : that v1 would not change" ^0
"  what changed for a v1 client  : the body it parses on" ^0
"    " + str(responses_that_are_errors) + " responses a day" ^0
"" ^0

# ---- null control ----

# The same versioning, with the error envelope documented per major and covered
# by the same contract suite.
endpoints => nc_error_schemas_with_a_contract_test
0 => nc_majors_changed_by_a_framework_upgrade

"null control - the error envelope is part of the contract" ^0
"  success schemas tested : " + str(success_schemas_with_a_contract_test) + ", unchanged" ^0
"  error schemas tested   : " + str(nc_error_schemas_with_a_contract_test) ^0
"  majors a framework upgrade can change silently : " + str(nc_majors_changed_by_a_framework_upgrade) ^0
"  the versioning did not get stricter; the set of responses" ^0
"  it ranges over stopped being the ones written by hand" ^0
"" ^0

# ---- the rule ----

"what a versioned endpoint guarantees" ^0
"  its documented responses will not change under a client :" ^0
"    exactly, and for three years it has held" ^0
"  a client of that version will not break : not addressed;" ^0
"    a client parses everything it receives, and the version" ^0
"    covers what the endpoint authored" ^0
"" ^0
"a compatibility promise is scoped to the artifact it is" ^0
"attached to; responses assembled by shared machinery below" ^0
"that artifact are outside every version at once" ^0
"" ^0

"Versioning is real: " + str(majors_served_side_by_side) + " majors coexist, all " + str(success_schemas_documented) + " documented schemas have a" ^0
"contract test, and " + str(breaking_success_changes_outside_a_major_in_three_years) + " success schemas have broken outside a major in three" ^0
"years. Error bodies come from " + str(middlewares_producing_error_bodies) + " shared middleware with " + str(error_schemas_documented) + " documented schemas, so" ^0
"a framework upgrade changed the shape parsed by " + str(integrations_reading_a_field_out_of_the_error_body) + " of " + str(integrations) + " integrations -" ^0
str(exposed_per_myriad) + " per ten thousand - across both majors, on " + str(responses_that_are_errors) + " responses a day." ^0
```

## Python (deterministic transpilation)

```python
endpoints = 214
majors_served_side_by_side = 2
success_schemas_documented = 214
success_schemas_with_a_contract_test = 214
breaking_success_changes_outside_a_major_in_three_years = 0
middlewares_producing_error_bodies = 1
error_schemas_documented = 0
error_schemas_with_a_contract_test = 0
integrations = 96
integrations_reading_a_field_out_of_the_error_body = 84
responses_per_day = 62000000
responses_that_are_errors = 2480000
integrations_that_only_read_success_bodies = integrations - integrations_reading_a_field_out_of_the_error_body
exposed_per_myriad = int(integrations_reading_a_field_out_of_the_error_body * 10000 / integrations)
error_share_per_myriad = int(responses_that_are_errors * 10000 / responses_per_day)
print("endpoints                        : " + str(endpoints))
print("majors served side by side       : " + str(majors_served_side_by_side))
print("success schemas documented       : " + str(success_schemas_documented))
print("  with a contract test           : " + str(success_schemas_with_a_contract_test))
print("breaking success changes in three years : " + str(breaking_success_changes_outside_a_major_in_three_years))
print("")
print("error schemas documented         : " + str(error_schemas_documented))
print("  with a contract test           : " + str(error_schemas_with_a_contract_test))
print("middlewares producing them       : " + str(middlewares_producing_error_bodies))
print("")
print("integrations                     : " + str(integrations))
print("  reading a field from an error  : " + str(integrations_reading_a_field_out_of_the_error_body))
print("  reading only success bodies    : " + str(integrations_that_only_read_success_bodies))
print("  exposed share                  : " + str(exposed_per_myriad) + " per ten thousand")
print("responses a day                  : " + str(responses_per_day))
print("  that are errors                : " + str(responses_that_are_errors) + ", " + str(error_share_per_myriad) + " per ten thousand")
print("")
print("the version discipline")
print("  majors coexist rather than replace : yes")
print("  documented schemas with a contract test : " + str(success_schemas_with_a_contract_test) + " of " + str(success_schemas_documented))
print("  a breaking change requires a new major : enforced, not")
print("    written down")
print("  deprecation policy honoured : v1 still served three")
print("    years after v2")
print("  verdict : VERSIONED")
print("")
print("  serving two majors for three years costs real money and")
print("  is the reason clients trust the guarantee")
print("")
print("the versioned unit")
print("  what carries a version : the endpoint")
print("  what an endpoint produces on success : a body it")
print("    documents, tested against its schema")
print("  what produces the body on failure : " + str(middlewares_producing_error_bodies) + " shared middleware")
print("  which major that middleware belongs to : neither; it")
print("    sits in front of both")
print("")
print("  the contract is complete over the responses an endpoint")
print("  authors, and an endpoint does not author its errors")
print("")
print("one integration")
print("  reads the success body : covered by the contract")
print("  reads the error body   : to decide whether to retry, and")
print("    to show a message")
print("  the field it reads     : shown in an example in the")
print("    guide, not in a schema")
print("  integrations doing this : " + str(integrations_reading_a_field_out_of_the_error_body) + " of " + str(integrations))
print("")
print("the framework upgrade")
print("  contract tests run     : " + str(success_schemas_with_a_contract_test))
print("  contract tests failing : " + str(breaking_success_changes_outside_a_major_in_three_years))
print("  majors affected        : " + str(majors_served_side_by_side) + ", in one deploy")
print("  what a v1 client was promised : that v1 would not change")
print("  what changed for a v1 client  : the body it parses on")
print("    " + str(responses_that_are_errors) + " responses a day")
print("")
nc_error_schemas_with_a_contract_test = endpoints
nc_majors_changed_by_a_framework_upgrade = 0
print("null control - the error envelope is part of the contract")
print("  success schemas tested : " + str(success_schemas_with_a_contract_test) + ", unchanged")
print("  error schemas tested   : " + str(nc_error_schemas_with_a_contract_test))
print("  majors a framework upgrade can change silently : " + str(nc_majors_changed_by_a_framework_upgrade))
print("  the versioning did not get stricter; the set of responses")
print("  it ranges over stopped being the ones written by hand")
print("")
print("what a versioned endpoint guarantees")
print("  its documented responses will not change under a client :")
print("    exactly, and for three years it has held")
print("  a client of that version will not break : not addressed;")
print("    a client parses everything it receives, and the version")
print("    covers what the endpoint authored")
print("")
print("a compatibility promise is scoped to the artifact it is")
print("attached to; responses assembled by shared machinery below")
print("that artifact are outside every version at once")
print("")
print("Versioning is real: " + str(majors_served_side_by_side) + " majors coexist, all " + str(success_schemas_documented) + " documented schemas have a")
print("contract test, and " + str(breaking_success_changes_outside_a_major_in_three_years) + " success schemas have broken outside a major in three")
print("years. Error bodies come from " + str(middlewares_producing_error_bodies) + " shared middleware with " + str(error_schemas_documented) + " documented schemas, so")
print("a framework upgrade changed the shape parsed by " + str(integrations_reading_a_field_out_of_the_error_body) + " of " + str(integrations) + " integrations -")
print(str(exposed_per_myriad) + " per ten thousand - across both majors, on " + str(responses_that_are_errors) + " responses a day.")
```

## stdout (executed)

```text
endpoints                        : 214
majors served side by side       : 2
success schemas documented       : 214
  with a contract test           : 214
breaking success changes in three years : 0

error schemas documented         : 0
  with a contract test           : 0
middlewares producing them       : 1

integrations                     : 96
  reading a field from an error  : 84
  reading only success bodies    : 12
  exposed share                  : 8750 per ten thousand
responses a day                  : 62000000
  that are errors                : 2480000, 400 per ten thousand

the version discipline
  majors coexist rather than replace : yes
  documented schemas with a contract test : 214 of 214
  a breaking change requires a new major : enforced, not
    written down
  deprecation policy honoured : v1 still served three
    years after v2
  verdict : VERSIONED

  serving two majors for three years costs real money and
  is the reason clients trust the guarantee

the versioned unit
  what carries a version : the endpoint
  what an endpoint produces on success : a body it
    documents, tested against its schema
  what produces the body on failure : 1 shared middleware
  which major that middleware belongs to : neither; it
    sits in front of both

  the contract is complete over the responses an endpoint
  authors, and an endpoint does not author its errors

one integration
  reads the success body : covered by the contract
  reads the error body   : to decide whether to retry, and
    to show a message
  the field it reads     : shown in an example in the
    guide, not in a schema
  integrations doing this : 84 of 96

the framework upgrade
  contract tests run     : 214
  contract tests failing : 0
  majors affected        : 2, in one deploy
  what a v1 client was promised : that v1 would not change
  what changed for a v1 client  : the body it parses on
    2480000 responses a day

null control - the error envelope is part of the contract
  success schemas tested : 214, unchanged
  error schemas tested   : 214
  majors a framework upgrade can change silently : 0
  the versioning did not get stricter; the set of responses
  it ranges over stopped being the ones written by hand

what a versioned endpoint guarantees
  its documented responses will not change under a client :
    exactly, and for three years it has held
  a client of that version will not break : not addressed;
    a client parses everything it receives, and the version
    covers what the endpoint authored

a compatibility promise is scoped to the artifact it is
attached to; responses assembled by shared machinery below
that artifact are outside every version at once

Versioning is real: 2 majors coexist, all 214 documented schemas have a
contract test, and 0 success schemas have broken outside a major in three
years. Error bodies come from 1 shared middleware with 0 documented schemas, so
a framework upgrade changed the shape parsed by 84 of 96 integrations -
8750 per ten thousand - across both majors, on 2480000 responses a day.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
