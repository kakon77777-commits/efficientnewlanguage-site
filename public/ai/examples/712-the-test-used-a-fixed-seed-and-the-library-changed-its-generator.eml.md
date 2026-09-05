<!-- canonical: efficientnewlanguage.org/ai/examples/712-the-test-used-a-fixed-seed-and-the-library-changed-its-generator | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 712 — The test used a fixed seed and the library changed its generator

`the_test_used_a_fixed_seed_and_the_library_changed_its_generator.eml` - Every test seeds the generator, so every failure reproduces and the flaky-test problem is gone. What the suite has actually explored is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every test seeds
# the generator, so every failure reproduces and the flaky-test problem is gone.
# What the suite has actually explored is computed below.
#
# The determinism work was real and it paid. Before it, forty-one failures a
# week could not be reproduced and were reruns; every one of those was traced to
# an unseeded generator or an unordered iteration. Now the seed is a constant,
# a failing case reproduces byte for byte on a developer machine, and the flake
# count has been zero for a year.
#
# A seed fixes the STREAM a generator produces. The property tests draw their
# inputs from that stream, so they draw the same inputs on every run, and the
# suite has explored those inputs and no others.
#
# A minor version of the library replaced the algorithm behind the same seed.

6 => property_tests
500 => cases_drawn_per_property_test
2600 => suite_runs_in_the_year
41 => unreproducible_failures_per_week_before
0 => unreproducible_failures_per_week_now
0 => defects_the_property_suite_found_in_the_year

property_tests * cases_drawn_per_property_test => draws_per_run
draws_per_run => distinct_inputs_explored_in_the_year
draws_per_run * suite_runs_in_the_year => draws_performed_in_the_year
draws_performed_in_the_year - distinct_inputs_explored_in_the_year => draws_that_repeated_an_earlier_draw
3 => defects_found_by_the_first_run_after_the_upgrade

"property tests                  : " + str(property_tests) ^0
"cases drawn per property test   : " + str(cases_drawn_per_property_test) ^0
"draws per run                   : " + str(draws_per_run) ^0
"suite runs in the year          : " + str(suite_runs_in_the_year) ^0
"" ^0
"unreproducible failures a week, before : " + str(unreproducible_failures_per_week_before) ^0
"unreproducible failures a week, now    : " + str(unreproducible_failures_per_week_now) ^0
"" ^0
"draws performed in the year     : " + str(draws_performed_in_the_year) ^0
"  distinct inputs among them    : " + str(distinct_inputs_explored_in_the_year) ^0
"  repeats of an earlier draw    : " + str(draws_that_repeated_an_earlier_draw) ^0
"new inputs after the first run  : 0" ^0
"" ^0
"defects the property suite found in the year : " + str(defects_the_property_suite_found_in_the_year) ^0
"defects the first run after the upgrade found : " + str(defects_found_by_the_first_run_after_the_upgrade) ^0
"" ^0

# ---- what the seed fixed ----

"the determinism work" ^0
"  unreproducible failures a week, before : " + str(unreproducible_failures_per_week_before) ^0
"  unreproducible failures a week, after  : " + str(unreproducible_failures_per_week_now) ^0
"  a failing case on a developer machine  : reproduces byte" ^0
"    for byte" ^0
"  cause of every flake traced : an unseeded generator or an" ^0
"    unordered iteration" ^0
"  verdict : REPRODUCIBLE" ^0
"" ^0
"  a suite whose failures reproduce is worth more than one" ^0
"  with more assertions, and this is how you get there" ^0
"" ^0

# ---- what a fixed seed also fixes ----

"the stream" ^0
"  what the seed determines : the sequence the generator" ^0
"    produces" ^0
"  where the property tests get their inputs : that sequence" ^0
"  inputs on run one    : " + str(draws_per_run) ^0
"  inputs on run " + str(suite_runs_in_the_year) + " : the same " + str(draws_per_run) ^0
"  inputs the year added : 0" ^0
"" ^0
"  reproducibility and exploration are both properties of" ^0
"  the stream and the constant buys one by spending the other" ^0
"" ^0

# ---- what the run count looks like ----

# The dashboard counts executed cases, which is draws, and that number grows
# every day. It is a count of work done, not of ground covered.
"the number on the dashboard" ^0
"  property cases executed this year : " + str(draws_performed_in_the_year) ^0
"  of those, inputs not seen before  : " + str(distinct_inputs_explored_in_the_year) ^0
"  of those, repeats                 : " + str(draws_that_repeated_an_earlier_draw) ^0
"  what the number measures : executions" ^0
"  what a reader takes it for : coverage" ^0
"" ^0

# ---- what the upgrade did ----

# The library's minor release replaced the algorithm behind the seed. The seed
# is unchanged, the suite is still deterministic, and it now draws a different
# set of inputs - which is the first new input it has seen in a year.
"the library upgrade" ^0
"  the seed        : unchanged" ^0
"  the suite       : still deterministic, still reproducible" ^0
"  the sequence    : different" ^0
"  inputs never previously drawn : " + str(draws_per_run) ^0
"  defects surfaced by that first run : " + str(defects_found_by_the_first_run_after_the_upgrade) ^0
"  defects the same suite found in the preceding year : " + str(defects_the_property_suite_found_in_the_year) ^0
"  none of the three were introduced by the upgrade" ^0
"" ^0

# ---- null control ----

# The same suite, with a per-run seed that is printed and recorded. A failure
# still reproduces - replay the recorded seed - and the explored set grows.
suite_runs_in_the_year * draws_per_run => nc_distinct_inputs_explored_in_the_year
0 => nc_unreproducible_failures_per_week

"null control - a recorded per-run seed" ^0
"  a failing case reproduces : yes, from the recorded seed" ^0
"  unreproducible failures a week : " + str(nc_unreproducible_failures_per_week) ^0
"  distinct inputs in the year    : up to " + str(nc_distinct_inputs_explored_in_the_year) ^0
"  the suite did not get less deterministic; the seed" ^0
"  stopped being the same seed" ^0
"" ^0

# ---- the rule ----

"what a fixed seed guarantees" ^0
"  a failure can be reproduced exactly : yes, and it is the" ^0
"    single most useful property a suite can have" ^0
"  the random inputs are random         : not addressed; a" ^0
"    seed selects one stream, and a property test that" ^0
"    draws from it draws the same inputs forever" ^0
"" ^0
"a generated input is only a sample if something varies" ^0
"between samples; pinning the generator turns a property test" ^0
"into a fixed table that nobody wrote down and nobody reviews" ^0
"" ^0

"The determinism work is real: flakes went from " + str(unreproducible_failures_per_week_before) + " a week to " + str(unreproducible_failures_per_week_now) + " and every" ^0
"failure reproduces byte for byte. The seed is a constant, so the " + str(draws_performed_in_the_year) ^0
"property cases run this year were " + str(distinct_inputs_explored_in_the_year) + " distinct inputs and " + str(draws_that_repeated_an_earlier_draw) + " repeats, and a" ^0
"library upgrade that changed the algorithm behind the same seed found " + str(defects_found_by_the_first_run_after_the_upgrade) ^0
"defects on its first run, against " + str(defects_the_property_suite_found_in_the_year) + " from the suite in the preceding year." ^0
```

## Python (deterministic transpilation)

```python
property_tests = 6
cases_drawn_per_property_test = 500
suite_runs_in_the_year = 2600
unreproducible_failures_per_week_before = 41
unreproducible_failures_per_week_now = 0
defects_the_property_suite_found_in_the_year = 0
draws_per_run = property_tests * cases_drawn_per_property_test
distinct_inputs_explored_in_the_year = draws_per_run
draws_performed_in_the_year = draws_per_run * suite_runs_in_the_year
draws_that_repeated_an_earlier_draw = draws_performed_in_the_year - distinct_inputs_explored_in_the_year
defects_found_by_the_first_run_after_the_upgrade = 3
print("property tests                  : " + str(property_tests))
print("cases drawn per property test   : " + str(cases_drawn_per_property_test))
print("draws per run                   : " + str(draws_per_run))
print("suite runs in the year          : " + str(suite_runs_in_the_year))
print("")
print("unreproducible failures a week, before : " + str(unreproducible_failures_per_week_before))
print("unreproducible failures a week, now    : " + str(unreproducible_failures_per_week_now))
print("")
print("draws performed in the year     : " + str(draws_performed_in_the_year))
print("  distinct inputs among them    : " + str(distinct_inputs_explored_in_the_year))
print("  repeats of an earlier draw    : " + str(draws_that_repeated_an_earlier_draw))
print("new inputs after the first run  : 0")
print("")
print("defects the property suite found in the year : " + str(defects_the_property_suite_found_in_the_year))
print("defects the first run after the upgrade found : " + str(defects_found_by_the_first_run_after_the_upgrade))
print("")
print("the determinism work")
print("  unreproducible failures a week, before : " + str(unreproducible_failures_per_week_before))
print("  unreproducible failures a week, after  : " + str(unreproducible_failures_per_week_now))
print("  a failing case on a developer machine  : reproduces byte")
print("    for byte")
print("  cause of every flake traced : an unseeded generator or an")
print("    unordered iteration")
print("  verdict : REPRODUCIBLE")
print("")
print("  a suite whose failures reproduce is worth more than one")
print("  with more assertions, and this is how you get there")
print("")
print("the stream")
print("  what the seed determines : the sequence the generator")
print("    produces")
print("  where the property tests get their inputs : that sequence")
print("  inputs on run one    : " + str(draws_per_run))
print("  inputs on run " + str(suite_runs_in_the_year) + " : the same " + str(draws_per_run))
print("  inputs the year added : 0")
print("")
print("  reproducibility and exploration are both properties of")
print("  the stream and the constant buys one by spending the other")
print("")
print("the number on the dashboard")
print("  property cases executed this year : " + str(draws_performed_in_the_year))
print("  of those, inputs not seen before  : " + str(distinct_inputs_explored_in_the_year))
print("  of those, repeats                 : " + str(draws_that_repeated_an_earlier_draw))
print("  what the number measures : executions")
print("  what a reader takes it for : coverage")
print("")
print("the library upgrade")
print("  the seed        : unchanged")
print("  the suite       : still deterministic, still reproducible")
print("  the sequence    : different")
print("  inputs never previously drawn : " + str(draws_per_run))
print("  defects surfaced by that first run : " + str(defects_found_by_the_first_run_after_the_upgrade))
print("  defects the same suite found in the preceding year : " + str(defects_the_property_suite_found_in_the_year))
print("  none of the three were introduced by the upgrade")
print("")
nc_distinct_inputs_explored_in_the_year = suite_runs_in_the_year * draws_per_run
nc_unreproducible_failures_per_week = 0
print("null control - a recorded per-run seed")
print("  a failing case reproduces : yes, from the recorded seed")
print("  unreproducible failures a week : " + str(nc_unreproducible_failures_per_week))
print("  distinct inputs in the year    : up to " + str(nc_distinct_inputs_explored_in_the_year))
print("  the suite did not get less deterministic; the seed")
print("  stopped being the same seed")
print("")
print("what a fixed seed guarantees")
print("  a failure can be reproduced exactly : yes, and it is the")
print("    single most useful property a suite can have")
print("  the random inputs are random         : not addressed; a")
print("    seed selects one stream, and a property test that")
print("    draws from it draws the same inputs forever")
print("")
print("a generated input is only a sample if something varies")
print("between samples; pinning the generator turns a property test")
print("into a fixed table that nobody wrote down and nobody reviews")
print("")
print("The determinism work is real: flakes went from " + str(unreproducible_failures_per_week_before) + " a week to " + str(unreproducible_failures_per_week_now) + " and every")
print("failure reproduces byte for byte. The seed is a constant, so the " + str(draws_performed_in_the_year))
print("property cases run this year were " + str(distinct_inputs_explored_in_the_year) + " distinct inputs and " + str(draws_that_repeated_an_earlier_draw) + " repeats, and a")
print("library upgrade that changed the algorithm behind the same seed found " + str(defects_found_by_the_first_run_after_the_upgrade))
print("defects on its first run, against " + str(defects_the_property_suite_found_in_the_year) + " from the suite in the preceding year.")
```

## stdout (executed)

```text
property tests                  : 6
cases drawn per property test   : 500
draws per run                   : 3000
suite runs in the year          : 2600

unreproducible failures a week, before : 41
unreproducible failures a week, now    : 0

draws performed in the year     : 7800000
  distinct inputs among them    : 3000
  repeats of an earlier draw    : 7797000
new inputs after the first run  : 0

defects the property suite found in the year : 0
defects the first run after the upgrade found : 3

the determinism work
  unreproducible failures a week, before : 41
  unreproducible failures a week, after  : 0
  a failing case on a developer machine  : reproduces byte
    for byte
  cause of every flake traced : an unseeded generator or an
    unordered iteration
  verdict : REPRODUCIBLE

  a suite whose failures reproduce is worth more than one
  with more assertions, and this is how you get there

the stream
  what the seed determines : the sequence the generator
    produces
  where the property tests get their inputs : that sequence
  inputs on run one    : 3000
  inputs on run 2600 : the same 3000
  inputs the year added : 0

  reproducibility and exploration are both properties of
  the stream and the constant buys one by spending the other

the number on the dashboard
  property cases executed this year : 7800000
  of those, inputs not seen before  : 3000
  of those, repeats                 : 7797000
  what the number measures : executions
  what a reader takes it for : coverage

the library upgrade
  the seed        : unchanged
  the suite       : still deterministic, still reproducible
  the sequence    : different
  inputs never previously drawn : 3000
  defects surfaced by that first run : 3
  defects the same suite found in the preceding year : 0
  none of the three were introduced by the upgrade

null control - a recorded per-run seed
  a failing case reproduces : yes, from the recorded seed
  unreproducible failures a week : 0
  distinct inputs in the year    : up to 7800000
  the suite did not get less deterministic; the seed
  stopped being the same seed

what a fixed seed guarantees
  a failure can be reproduced exactly : yes, and it is the
    single most useful property a suite can have
  the random inputs are random         : not addressed; a
    seed selects one stream, and a property test that
    draws from it draws the same inputs forever

a generated input is only a sample if something varies
between samples; pinning the generator turns a property test
into a fixed table that nobody wrote down and nobody reviews

The determinism work is real: flakes went from 41 a week to 0 and every
failure reproduces byte for byte. The seed is a constant, so the 7800000
property cases run this year were 3000 distinct inputs and 7797000 repeats, and a
library upgrade that changed the algorithm behind the same seed found 3
defects on its first run, against 0 from the suite in the preceding year.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
