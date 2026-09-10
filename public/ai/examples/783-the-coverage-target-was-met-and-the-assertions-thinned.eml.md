<!-- canonical: efficientnewlanguage.org/ai/examples/783-the-coverage-target-was-met-and-the-assertions-thinned | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 783 — The coverage target was met and the assertions thinned

`the_coverage_target_was_met_and_the_assertions_thinned.eml` - Line coverage on the semantics packages has been above its eighty-five percent target for nine quarters, and the gate that enforces it is real. What rose with it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Line coverage on
# the semantics packages has been above its eighty-five percent target for nine
# quarters, and the gate that enforces it is real. What rose with it is computed
# below.
#
# The gate is properly built. Coverage is measured on the semantics packages
# rather than diluted across the whole repository; a pull request that lowers it
# fails rather than warns; generated files are excluded by an explicit list
# somebody maintains rather than by a pattern that quietly grows; and the number
# comes from the same run that executes the tests.
#
# It counts lines a test caused to run. A line runs whether or not anything
# looked at what it did.

84000 => lines_of_semantics
8500 => coverage_target_per_myriad
8620 => coverage_now_per_myriad
9 => quarters_the_target_has_been_met
6400 => tests
610 => tests_with_no_assertion_at_all
290 => assertions_per_hundred_tests_when_the_target_arrived
142 => assertions_per_hundred_tests_now
4100 => mutants_killed_per_myriad
0 => mutation_runs_that_gate_a_merge

tests - tests_with_no_assertion_at_all => tests_that_assert_something
assertions_per_hundred_tests_when_the_target_arrived - assertions_per_hundred_tests_now => assertions_per_hundred_tests_lost
# NOT a subtraction. Coverage is per ten thousand LINES; the mutation score is
# per ten thousand MUTANTS. Different denominators over different populations,
# so their difference is not a quantity in any unit - and the fact that both are
# written 'per ten thousand' is exactly what makes subtracting them feel
# available. They are reported side by side instead.
coverage_now_per_myriad - coverage_target_per_myriad => coverage_above_the_target
int(tests_with_no_assertion_at_all * 10000 / tests) => tests_asserting_nothing_per_myriad

"lines of semantics              : " + str(lines_of_semantics) ^0
"coverage target                 : " + str(coverage_target_per_myriad) + " per ten thousand" ^0
"  coverage now                  : " + str(coverage_now_per_myriad) + " per ten thousand" ^0
"  above the target by           : " + str(coverage_above_the_target) ^0
"quarters the target has been met: " + str(quarters_the_target_has_been_met) ^0
"" ^0
"tests                           : " + str(tests) ^0
"  with no assertion at all      : " + str(tests_with_no_assertion_at_all) ^0
"  that assert something         : " + str(tests_that_assert_something) ^0
"  asserting nothing             : " + str(tests_asserting_nothing_per_myriad) + " per ten thousand" ^0
"assertions per hundred tests" ^0
"  when the target arrived       : " + str(assertions_per_hundred_tests_when_the_target_arrived) ^0
"  now                           : " + str(assertions_per_hundred_tests_now) ^0
"  lost                          : " + str(assertions_per_hundred_tests_lost) ^0
"" ^0
"mutants killed                  : " + str(mutants_killed_per_myriad) + " per ten thousand" ^0
"  coverage, per ten thousand lines : " + str(coverage_now_per_myriad) ^0
"  mutants killed, per ten thousand mutants : " + str(mutants_killed_per_myriad) ^0
"mutation runs that gate a merge : " + str(mutation_runs_that_gate_a_merge) ^0
"" ^0

# ---- what the gate verified ----

"the coverage gate" ^0
"  scope : the semantics packages, not diluted across the" ^0
"    whole repository" ^0
"  a pull request that lowers it : fails, not warns" ^0
"  exclusions : an explicit list somebody maintains, not" ^0
"    a pattern that quietly grows" ^0
"  the number : from the same run that executes the tests" ^0
"  quarters met : " + str(quarters_the_target_has_been_met) ^0
"  verdict : COVERED" ^0
"" ^0
"  keeping the exclusion list explicit is the part almost" ^0
"  nobody does, and it is why " + str(coverage_now_per_myriad) + " per ten thousand" ^0
"  is about the code it claims to be about" ^0
"" ^0

# ---- what the number counts ----

"what raises coverage" ^0
"  a line counts when : a test caused it to run" ^0
"  what a test must do to make a line run : call it" ^0
"  what a test must do to make a line CHECKED : assert" ^0
"    something about what it did" ^0
"  tests that do the first and not the second : " ^0
"    " + str(tests_with_no_assertion_at_all) ^0
"  assertions per hundred tests, then and now : " ^0
"    " + str(assertions_per_hundred_tests_when_the_target_arrived) + " and " + str(assertions_per_hundred_tests_now) ^0
"" ^0
"  the cheapest way to raise the number is to run more" ^0
"  lines, and running is the half it counts" ^0
"" ^0

# ---- a second instrument, not gating anything ----

"mutation score, measured but not enforced" ^0
"  what it asks : if the code is changed, does a test" ^0
"    notice" ^0
"  mutants killed : " + str(mutants_killed_per_myriad) + " per ten thousand" ^0
"  coverage : " + str(coverage_now_per_myriad) + " per ten thousand" ^0
"  the distance between them : not a quantity;" ^0
"    one is a fraction of lines and the other a" ^0
"    fraction of mutants; they share a suffix and" ^0
"    not a denominator" ^0
"  merges gated on it : " + str(mutation_runs_that_gate_a_merge) ^0
"  which of the two a pull request must satisfy : the" ^0
"    one that counts running" ^0
"" ^0

# ---- null control ----

# The same repository, with the merge gated on mutation score instead and
# coverage merely reported.
4100 => nc_mutants_killed_per_myriad_at_the_moment_of_the_switch
8620 => nc_coverage_per_myriad_at_the_same_moment
1 => nc_mutation_runs_that_gate_a_merge

"null control - gate on the second instrument instead" ^0
"  coverage at the switch : " ^0
"    " + str(nc_coverage_per_myriad_at_the_same_moment) + ", unchanged" ^0
"  mutants killed at the switch : " ^0
"    " + str(nc_mutants_killed_per_myriad_at_the_moment_of_the_switch) + ", unchanged" ^0
"  merges gated on it : " + str(nc_mutation_runs_that_gate_a_merge) ^0
"  no test changed on the day of the switch; the quantity" ^0
"  a pull request has to move stopped being the one that" ^0
"  counts execution" ^0
"" ^0

# ---- the rule ----

"what a met coverage target guarantees" ^0
"  " + str(coverage_now_per_myriad) + " per ten thousand of semantics lines are executed by" ^0
"    the suite : exactly, measured in the run itself," ^0
"    enforced on every pull request, " + str(quarters_the_target_has_been_met) + " quarters" ^0
"  the suite would notice if they were wrong : not" ^0
"    addressed; " + str(tests_with_no_assertion_at_all) + " tests assert nothing, and the second" ^0
"    instrument reads " + str(mutants_killed_per_myriad) + " over a" ^0
"    different population" ^0
"" ^0
"a number under a gate is a number under pressure; when two" ^0
"actions raise it and only one of them is the point, the" ^0
"cheaper one is what a population does" ^0
"" ^0

"Coverage is scoped to the semantics packages, exclusions are an explicit list," ^0
"a pull request that lowers it fails, and the target has held " + str(quarters_the_target_has_been_met) + " quarters at " ^0
"" + str(coverage_now_per_myriad) + " per ten thousand. It counts lines run, so assertions per hundred tests went " ^0
"" + str(assertions_per_hundred_tests_when_the_target_arrived) + " to " + str(assertions_per_hundred_tests_now) + ", " + str(tests_with_no_assertion_at_all) + " of " + str(tests) + " tests assert nothing, and the mutation score" ^0
"reads " + str(mutants_killed_per_myriad) + " per ten thousand mutants, which is not " + str(coverage_now_per_myriad) + " minus" ^0
"anything, across " + str(mutation_runs_that_gate_a_merge) + " gated runs." ^0
```

## Python (deterministic transpilation)

```python
lines_of_semantics = 84000
coverage_target_per_myriad = 8500
coverage_now_per_myriad = 8620
quarters_the_target_has_been_met = 9
tests = 6400
tests_with_no_assertion_at_all = 610
assertions_per_hundred_tests_when_the_target_arrived = 290
assertions_per_hundred_tests_now = 142
mutants_killed_per_myriad = 4100
mutation_runs_that_gate_a_merge = 0
tests_that_assert_something = tests - tests_with_no_assertion_at_all
assertions_per_hundred_tests_lost = assertions_per_hundred_tests_when_the_target_arrived - assertions_per_hundred_tests_now
coverage_above_the_target = coverage_now_per_myriad - coverage_target_per_myriad
tests_asserting_nothing_per_myriad = int(tests_with_no_assertion_at_all * 10000 / tests)
print("lines of semantics              : " + str(lines_of_semantics))
print("coverage target                 : " + str(coverage_target_per_myriad) + " per ten thousand")
print("  coverage now                  : " + str(coverage_now_per_myriad) + " per ten thousand")
print("  above the target by           : " + str(coverage_above_the_target))
print("quarters the target has been met: " + str(quarters_the_target_has_been_met))
print("")
print("tests                           : " + str(tests))
print("  with no assertion at all      : " + str(tests_with_no_assertion_at_all))
print("  that assert something         : " + str(tests_that_assert_something))
print("  asserting nothing             : " + str(tests_asserting_nothing_per_myriad) + " per ten thousand")
print("assertions per hundred tests")
print("  when the target arrived       : " + str(assertions_per_hundred_tests_when_the_target_arrived))
print("  now                           : " + str(assertions_per_hundred_tests_now))
print("  lost                          : " + str(assertions_per_hundred_tests_lost))
print("")
print("mutants killed                  : " + str(mutants_killed_per_myriad) + " per ten thousand")
print("  coverage, per ten thousand lines : " + str(coverage_now_per_myriad))
print("  mutants killed, per ten thousand mutants : " + str(mutants_killed_per_myriad))
print("mutation runs that gate a merge : " + str(mutation_runs_that_gate_a_merge))
print("")
print("the coverage gate")
print("  scope : the semantics packages, not diluted across the")
print("    whole repository")
print("  a pull request that lowers it : fails, not warns")
print("  exclusions : an explicit list somebody maintains, not")
print("    a pattern that quietly grows")
print("  the number : from the same run that executes the tests")
print("  quarters met : " + str(quarters_the_target_has_been_met))
print("  verdict : COVERED")
print("")
print("  keeping the exclusion list explicit is the part almost")
print("  nobody does, and it is why " + str(coverage_now_per_myriad) + " per ten thousand")
print("  is about the code it claims to be about")
print("")
print("what raises coverage")
print("  a line counts when : a test caused it to run")
print("  what a test must do to make a line run : call it")
print("  what a test must do to make a line CHECKED : assert")
print("    something about what it did")
print("  tests that do the first and not the second : ")
print("    " + str(tests_with_no_assertion_at_all))
print("  assertions per hundred tests, then and now : ")
print("    " + str(assertions_per_hundred_tests_when_the_target_arrived) + " and " + str(assertions_per_hundred_tests_now))
print("")
print("  the cheapest way to raise the number is to run more")
print("  lines, and running is the half it counts")
print("")
print("mutation score, measured but not enforced")
print("  what it asks : if the code is changed, does a test")
print("    notice")
print("  mutants killed : " + str(mutants_killed_per_myriad) + " per ten thousand")
print("  coverage : " + str(coverage_now_per_myriad) + " per ten thousand")
print("  the distance between them : not a quantity;")
print("    one is a fraction of lines and the other a")
print("    fraction of mutants; they share a suffix and")
print("    not a denominator")
print("  merges gated on it : " + str(mutation_runs_that_gate_a_merge))
print("  which of the two a pull request must satisfy : the")
print("    one that counts running")
print("")
nc_mutants_killed_per_myriad_at_the_moment_of_the_switch = 4100
nc_coverage_per_myriad_at_the_same_moment = 8620
nc_mutation_runs_that_gate_a_merge = 1
print("null control - gate on the second instrument instead")
print("  coverage at the switch : ")
print("    " + str(nc_coverage_per_myriad_at_the_same_moment) + ", unchanged")
print("  mutants killed at the switch : ")
print("    " + str(nc_mutants_killed_per_myriad_at_the_moment_of_the_switch) + ", unchanged")
print("  merges gated on it : " + str(nc_mutation_runs_that_gate_a_merge))
print("  no test changed on the day of the switch; the quantity")
print("  a pull request has to move stopped being the one that")
print("  counts execution")
print("")
print("what a met coverage target guarantees")
print("  " + str(coverage_now_per_myriad) + " per ten thousand of semantics lines are executed by")
print("    the suite : exactly, measured in the run itself,")
print("    enforced on every pull request, " + str(quarters_the_target_has_been_met) + " quarters")
print("  the suite would notice if they were wrong : not")
print("    addressed; " + str(tests_with_no_assertion_at_all) + " tests assert nothing, and the second")
print("    instrument reads " + str(mutants_killed_per_myriad) + " over a")
print("    different population")
print("")
print("a number under a gate is a number under pressure; when two")
print("actions raise it and only one of them is the point, the")
print("cheaper one is what a population does")
print("")
print("Coverage is scoped to the semantics packages, exclusions are an explicit list,")
print("a pull request that lowers it fails, and the target has held " + str(quarters_the_target_has_been_met) + " quarters at ")
print("" + str(coverage_now_per_myriad) + " per ten thousand. It counts lines run, so assertions per hundred tests went ")
print("" + str(assertions_per_hundred_tests_when_the_target_arrived) + " to " + str(assertions_per_hundred_tests_now) + ", " + str(tests_with_no_assertion_at_all) + " of " + str(tests) + " tests assert nothing, and the mutation score")
print("reads " + str(mutants_killed_per_myriad) + " per ten thousand mutants, which is not " + str(coverage_now_per_myriad) + " minus")
print("anything, across " + str(mutation_runs_that_gate_a_merge) + " gated runs.")
```

## stdout (executed)

```text
lines of semantics              : 84000
coverage target                 : 8500 per ten thousand
  coverage now                  : 8620 per ten thousand
  above the target by           : 120
quarters the target has been met: 9

tests                           : 6400
  with no assertion at all      : 610
  that assert something         : 5790
  asserting nothing             : 953 per ten thousand
assertions per hundred tests
  when the target arrived       : 290
  now                           : 142
  lost                          : 148

mutants killed                  : 4100 per ten thousand
  coverage, per ten thousand lines : 8620
  mutants killed, per ten thousand mutants : 4100
mutation runs that gate a merge : 0

the coverage gate
  scope : the semantics packages, not diluted across the
    whole repository
  a pull request that lowers it : fails, not warns
  exclusions : an explicit list somebody maintains, not
    a pattern that quietly grows
  the number : from the same run that executes the tests
  quarters met : 9
  verdict : COVERED

  keeping the exclusion list explicit is the part almost
  nobody does, and it is why 8620 per ten thousand
  is about the code it claims to be about

what raises coverage
  a line counts when : a test caused it to run
  what a test must do to make a line run : call it
  what a test must do to make a line CHECKED : assert
    something about what it did
  tests that do the first and not the second : 
    610
  assertions per hundred tests, then and now : 
    290 and 142

  the cheapest way to raise the number is to run more
  lines, and running is the half it counts

mutation score, measured but not enforced
  what it asks : if the code is changed, does a test
    notice
  mutants killed : 4100 per ten thousand
  coverage : 8620 per ten thousand
  the distance between them : not a quantity;
    one is a fraction of lines and the other a
    fraction of mutants; they share a suffix and
    not a denominator
  merges gated on it : 0
  which of the two a pull request must satisfy : the
    one that counts running

null control - gate on the second instrument instead
  coverage at the switch : 
    8620, unchanged
  mutants killed at the switch : 
    4100, unchanged
  merges gated on it : 1
  no test changed on the day of the switch; the quantity
  a pull request has to move stopped being the one that
  counts execution

what a met coverage target guarantees
  8620 per ten thousand of semantics lines are executed by
    the suite : exactly, measured in the run itself,
    enforced on every pull request, 9 quarters
  the suite would notice if they were wrong : not
    addressed; 610 tests assert nothing, and the second
    instrument reads 4100 over a
    different population

a number under a gate is a number under pressure; when two
actions raise it and only one of them is the point, the
cheaper one is what a population does

Coverage is scoped to the semantics packages, exclusions are an explicit list,
a pull request that lowers it fails, and the target has held 9 quarters at 
8620 per ten thousand. It counts lines run, so assertions per hundred tests went 
290 to 142, 610 of 6400 tests assert nothing, and the mutation score
reads 4100 per ten thousand mutants, which is not 8620 minus
anything, across 0 gated runs.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
