<!-- canonical: efficientnewlanguage.org/ai/examples/692-the-dependency-was-optional-and-the-import-was-at-the-top | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 692 — The dependency was optional and the import was at the top

`the_dependency_was_optional_and_the_import_was_at_the_top.eml` - The feature checks whether its optional dependency is available before using it, in seven places, and every check is correct. How many of those checks run is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The feature checks
# whether its optional dependency is available before using it, in seven places,
# and every check is correct. How many of those checks run is computed below.
#
# The capability checks are careful. Each one asks whether the library is
# present rather than assuming, each has a fallback that produces a usable
# result without it, the fallback is tested, and the feature's documentation
# says the dependency is optional and what is lost without it. Somebody thought
# about deployments that would not have it.
#
# The import is at the top of the module. A missing optional dependency fails
# there, before any function in the module has been entered, so the check that
# would have handled its absence is downstream of the failure it exists for.
#
# Sixty-two of three hundred and forty deployments do not have it.

340 => deployments
62 => deployments_without_the_package
7 => capability_checks_in_the_code
7 => capability_checks_that_are_correct
0 => capability_checks_reached_on_those_deployments

deployments - deployments_without_the_package => deployments_with_the_package
deployments_without_the_package => startup_failures
int(deployments_without_the_package * 10000 / deployments) => affected_per_myriad

"deployments                     : " + str(deployments) ^0
"  with the package              : " + str(deployments_with_the_package) ^0
"  without it                    : " + str(deployments_without_the_package) ^0
"  share without                 : " + str(affected_per_myriad) + " per ten thousand" ^0
"" ^0
"capability checks in the code   : " + str(capability_checks_in_the_code) ^0
"  correct                       : " + str(capability_checks_that_are_correct) ^0
"  reached where the package is absent : " + str(capability_checks_reached_on_those_deployments) ^0
"startup failures                : " + str(startup_failures) ^0
"" ^0

# ---- what the checks verified ----

"the capability handling" ^0
"  asks whether the library is present : rather than assuming" ^0
"  fallback producing a usable result  : yes, for each" ^0
"  fallback tested                     : yes" ^0
"  documentation says it is optional   : yes, and what is lost" ^0
"  checks that are correct             : " + str(capability_checks_that_are_correct) + " of " + str(capability_checks_in_the_code) ^0
"  verdict                             : HANDLED" ^0
"" ^0
"  somebody thought about the deployments that would not" ^0
"  have it, and wrote for them" ^0
"" ^0

# ---- where the import is ----

"module load order" ^0
"  the import          : at the top of the module" ^0
"  when it runs        : before any function in the module" ^0
"  what happens if the package is absent : the module fails" ^0
"    to load" ^0
"  when the first capability check runs  : inside a function" ^0
"    in that module" ^0
"" ^0
"  the handler is downstream of the failure it handles, and" ^0
"  nothing in the module can see that from inside" ^0
"" ^0

# ---- what the operator is told ----

# The process exits with the interpreter's own error, which names the missing
# package and not the optional feature. There is nothing to suggest the feature
# could have been skipped.
"the failure" ^0
"  the process        : exits at start-up" ^0
"  the message names  : the missing package" ^0
"  the message names the feature : no" ^0
"  the message says it is optional : no" ^0
"  what an operator concludes : a missing requirement" ^0
"  what they do next  : install it, or file a bug about the" ^0
"    dependency list" ^0
"" ^0

# ---- why the tests pass ----

# The test environment installs everything, including the optional package,
# because the fallback tests need to compare against the real implementation.
"the test environment" ^0
"  packages installed  : all of them, including the optional" ^0
"  why                 : the fallback tests compare against" ^0
"    the real implementation" ^0
"  so the top-level import : always succeeds under test" ^0
"  a test that omits the package : none" ^0
"" ^0

# ---- null control ----

# The same checks, with the import moved inside the function that uses it, or
# guarded by a try at module level with the name bound to None.
deployments => nc_deployments_that_start
capability_checks_in_the_code => nc_checks_reached_where_absent
0 => nc_startup_failures

"null control - the import moved behind the check" ^0
"  capability checks   : " + str(capability_checks_in_the_code) + ", unchanged, still correct" ^0
"  deployments that start : " + str(nc_deployments_that_start) ^0
"  checks reached where the package is absent : " + str(nc_checks_reached_where_absent) ^0
"  startup failures    : " + str(nc_startup_failures) ^0
"  the handling did not improve; it became reachable" ^0
"" ^0

# ---- the rule ----

"what a correct capability check guarantees" ^0
"  the absent case is handled where the check runs : exactly" ^0
"  the absent case is handled                      : not" ^0
"    addressed; a check is code, code is in a module, and a" ^0
"    module has to load before any of it runs" ^0
"" ^0
"optionality is a property of the loading, not of the calling;" ^0
"every guard in a file is downstream of that file's imports," ^0
"and a test environment that installs everything cannot" ^0
"distinguish the two" ^0
"" ^0

"All " + str(capability_checks_that_are_correct) + " capability checks are correct, each with a tested fallback and" ^0
"documentation saying what is lost. The import sits at the top of the module, so" ^0
"on the " + str(deployments_without_the_package) + " deployments without the package - " + str(affected_per_myriad) + " per ten thousand - the" ^0
"module never loads, " + str(capability_checks_reached_on_those_deployments) + " of the checks run, and the operator is shown a missing" ^0
"requirement rather than an optional feature that could have been skipped." ^0
```

## Python (deterministic transpilation)

```python
deployments = 340
deployments_without_the_package = 62
capability_checks_in_the_code = 7
capability_checks_that_are_correct = 7
capability_checks_reached_on_those_deployments = 0
deployments_with_the_package = deployments - deployments_without_the_package
startup_failures = deployments_without_the_package
affected_per_myriad = int(deployments_without_the_package * 10000 / deployments)
print("deployments                     : " + str(deployments))
print("  with the package              : " + str(deployments_with_the_package))
print("  without it                    : " + str(deployments_without_the_package))
print("  share without                 : " + str(affected_per_myriad) + " per ten thousand")
print("")
print("capability checks in the code   : " + str(capability_checks_in_the_code))
print("  correct                       : " + str(capability_checks_that_are_correct))
print("  reached where the package is absent : " + str(capability_checks_reached_on_those_deployments))
print("startup failures                : " + str(startup_failures))
print("")
print("the capability handling")
print("  asks whether the library is present : rather than assuming")
print("  fallback producing a usable result  : yes, for each")
print("  fallback tested                     : yes")
print("  documentation says it is optional   : yes, and what is lost")
print("  checks that are correct             : " + str(capability_checks_that_are_correct) + " of " + str(capability_checks_in_the_code))
print("  verdict                             : HANDLED")
print("")
print("  somebody thought about the deployments that would not")
print("  have it, and wrote for them")
print("")
print("module load order")
print("  the import          : at the top of the module")
print("  when it runs        : before any function in the module")
print("  what happens if the package is absent : the module fails")
print("    to load")
print("  when the first capability check runs  : inside a function")
print("    in that module")
print("")
print("  the handler is downstream of the failure it handles, and")
print("  nothing in the module can see that from inside")
print("")
print("the failure")
print("  the process        : exits at start-up")
print("  the message names  : the missing package")
print("  the message names the feature : no")
print("  the message says it is optional : no")
print("  what an operator concludes : a missing requirement")
print("  what they do next  : install it, or file a bug about the")
print("    dependency list")
print("")
print("the test environment")
print("  packages installed  : all of them, including the optional")
print("  why                 : the fallback tests compare against")
print("    the real implementation")
print("  so the top-level import : always succeeds under test")
print("  a test that omits the package : none")
print("")
nc_deployments_that_start = deployments
nc_checks_reached_where_absent = capability_checks_in_the_code
nc_startup_failures = 0
print("null control - the import moved behind the check")
print("  capability checks   : " + str(capability_checks_in_the_code) + ", unchanged, still correct")
print("  deployments that start : " + str(nc_deployments_that_start))
print("  checks reached where the package is absent : " + str(nc_checks_reached_where_absent))
print("  startup failures    : " + str(nc_startup_failures))
print("  the handling did not improve; it became reachable")
print("")
print("what a correct capability check guarantees")
print("  the absent case is handled where the check runs : exactly")
print("  the absent case is handled                      : not")
print("    addressed; a check is code, code is in a module, and a")
print("    module has to load before any of it runs")
print("")
print("optionality is a property of the loading, not of the calling;")
print("every guard in a file is downstream of that file's imports,")
print("and a test environment that installs everything cannot")
print("distinguish the two")
print("")
print("All " + str(capability_checks_that_are_correct) + " capability checks are correct, each with a tested fallback and")
print("documentation saying what is lost. The import sits at the top of the module, so")
print("on the " + str(deployments_without_the_package) + " deployments without the package - " + str(affected_per_myriad) + " per ten thousand - the")
print("module never loads, " + str(capability_checks_reached_on_those_deployments) + " of the checks run, and the operator is shown a missing")
print("requirement rather than an optional feature that could have been skipped.")
```

## stdout (executed)

```text
deployments                     : 340
  with the package              : 278
  without it                    : 62
  share without                 : 1823 per ten thousand

capability checks in the code   : 7
  correct                       : 7
  reached where the package is absent : 0
startup failures                : 62

the capability handling
  asks whether the library is present : rather than assuming
  fallback producing a usable result  : yes, for each
  fallback tested                     : yes
  documentation says it is optional   : yes, and what is lost
  checks that are correct             : 7 of 7
  verdict                             : HANDLED

  somebody thought about the deployments that would not
  have it, and wrote for them

module load order
  the import          : at the top of the module
  when it runs        : before any function in the module
  what happens if the package is absent : the module fails
    to load
  when the first capability check runs  : inside a function
    in that module

  the handler is downstream of the failure it handles, and
  nothing in the module can see that from inside

the failure
  the process        : exits at start-up
  the message names  : the missing package
  the message names the feature : no
  the message says it is optional : no
  what an operator concludes : a missing requirement
  what they do next  : install it, or file a bug about the
    dependency list

the test environment
  packages installed  : all of them, including the optional
  why                 : the fallback tests compare against
    the real implementation
  so the top-level import : always succeeds under test
  a test that omits the package : none

null control - the import moved behind the check
  capability checks   : 7, unchanged, still correct
  deployments that start : 340
  checks reached where the package is absent : 7
  startup failures    : 0
  the handling did not improve; it became reachable

what a correct capability check guarantees
  the absent case is handled where the check runs : exactly
  the absent case is handled                      : not
    addressed; a check is code, code is in a module, and a
    module has to load before any of it runs

optionality is a property of the loading, not of the calling;
every guard in a file is downstream of that file's imports,
and a test environment that installs everything cannot
distinguish the two

All 7 capability checks are correct, each with a tested fallback and
documentation saying what is lost. The import sits at the top of the module, so
on the 62 deployments without the package - 1823 per ten thousand - the
module never loads, 0 of the checks run, and the operator is shown a missing
requirement rather than an optional feature that could have been skipped.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
