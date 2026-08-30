<!-- canonical: efficientnewlanguage.org/ai/examples/625-the-tests-passed-in-the-order-they-were-written | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 625 — The tests passed in the order they were written

`the_tests_passed_in_the_order_they_were_written.eml` - A suite of one thousand four hundred tests passes on every run. It has passed on every run for eleven months. What it passes in is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A suite of one
# thousand four hundred tests passes on every run. It has passed on every run
# for eleven months. What it passes in is computed below.
#
# Running tests in a stable order is correct and it was chosen deliberately.
# A deterministic order makes a failure reproducible from the report alone,
# makes bisecting meaningful, and keeps the run time predictable because the
# expensive fixtures are built once in a known sequence. A randomised order
# trades all three away, and the team gave up randomisation after it produced
# a failure nobody could reproduce for two days.
#
# A stable order is also a stable set of preconditions. A test that reads state
# some earlier test left behind passes for that reason, and it will keep
# passing for exactly as long as the earlier test keeps running before it.
#
# Every test in the suite passes. Some of them are not tests of what they name.

1400 => tests
11 => months_green
64 => tests_touching_shared_fixtures
9 => tests_that_depend_on_a_predecessor

"tests in the suite            : " + str(tests) ^0
"consecutive green months      : " + str(months_green) ^0
"tests touching shared fixtures: " + str(tests_touching_shared_fixtures) ^0
"" ^0

# ---- what the suite reports ----

"the suite" ^0
"  tests passing        : " + str(tests) + " of " + str(tests) ^0
"  flaky failures       : 0" ^0
"  order                : fixed, by file then by line" ^0
"  reproducible failures: yes, every one so far" ^0
"" ^0
"  the last row is what the fixed order was chosen to buy" ^0
"" ^0

# ---- what a passing test establishes ----

tests - tests_that_depend_on_a_predecessor => tests_that_stand_alone

"tests, by what makes them pass" ^0
"  pass because the code is correct      : " + str(tests_that_stand_alone) ^0
"  pass because a predecessor ran first  : " + str(tests_that_depend_on_a_predecessor) ^0
"  report the difference                 : 0" ^0
"" ^0
int(tests_that_depend_on_a_predecessor * 10000 / tests) => dependent_per_myriad
"  share depending on order : " + str(dependent_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what those nine actually assert ----

"one of the nine, in detail" ^0
"  name                : rejects an expired token" ^0
"  what it does        : calls the validator and expects a rejection" ^0
"  why it passes       : the clock fixture is still advanced from" ^0
"                        the test above it, so every token is expired" ^0
"  passes if the code stops checking expiry : yes" ^0
"  passes if run alone : no" ^0
"" ^0
"  it is green, it has always been green, and it does not" ^0
"  test expiry" ^0
"" ^0

# ---- the two ways to find out ----

"what would separate them" ^0
"  running the suite again        : no, same order" ^0
"  running it on another machine  : no, same order" ^0
"  running one test alone         : yes, for that one test" ^0
"  running the suite shuffled     : yes, for all of them at once" ^0
"" ^0
"  the first two are what continuous integration does " + str(months_green * 30) + " times" ^0
"  a month, and neither can reach it" ^0
"" ^0

# ---- what a shuffle would report ----

tests_that_depend_on_a_predecessor => would_fail_shuffled

"the same suite in a random order" ^0
"  tests failing      : " + str(would_fail_shuffled) ^0
"  defects in the code they name : unknown until each is read" ^0
"  defects in the tests          : " + str(would_fail_shuffled) + ", at minimum" ^0
"" ^0
"  a red run is the first information this suite has produced" ^0
"  about those nine in " + str(months_green) + " months" ^0
"" ^0

# ---- the run history ----

"month   runs   failures   tests that would fail shuffled" ^0
for m in [1:4]:
    m * 3 => mo
    "  " + str(mo) + "       " + str(mo * 30) + "    0          " + str(would_fail_shuffled) ^0
"" ^0
"  the third column is constant and the second is what gets read" ^0
"" ^0

# ---- the control ----
#
# The fixed order, against what it was chosen for. It was chosen so a failure
# could be reproduced from the report, and every failure in eleven months has
# been reproduced on the first attempt.

"control - is the fixed order earning its place" ^0
"  failures reproduced from the report alone : all of them" ^0
"  unreproducible failures                   : 0" ^0
"  fixture rebuilds avoided by the ordering  : " + str(tests_touching_shared_fixtures) ^0
"  defects in the ordering decision          : 0" ^0
"" ^0
"  randomising everything costs all three and the team has" ^0
"  already paid that once" ^0
"" ^0

# ---- the null control ----
#
# The same suite, same order, where each test builds its own fixture. The order
# is unchanged and so is the reproducibility; there is simply nothing left for
# a predecessor to leave behind.

0 => nc_order_dependent

"null control - the same fixed order over isolated fixtures" ^0
"  order                       : fixed, unchanged" ^0
"  failures reproducible       : yes, unchanged" ^0
"  tests depending on a predecessor : " + str(nc_order_dependent) ^0
"  tests that would fail shuffled   : " + str(nc_order_dependent) ^0
"  the order was never the defect; the shared state was" ^0
"" ^0

# ---- the rule ----

"what a green suite in a fixed order is evidence of" ^0
"  every test passes in THAT order : exactly" ^0
"  every test passes on its own    : not asked" ^0
"  each test asserts what it names : not asked" ^0
"  and a suite that has only ever run one order has one" ^0
"  observation, repeated" ^0
"" ^0
"the cheap check is not randomising the suite, which gives up" ^0
"what the order was for; it is running each test alone, once," ^0
"and keeping the list of the ones that stop passing" ^0
"" ^0

"The suite passes " + str(tests) + " of " + str(tests) + " on every run and has for " + str(months_green) + " months, and the" ^0
"fixed order it runs in is why every failure so far was reproducible from the" ^0
"report alone, with 0 unreproducible failures. " + str(tests_that_depend_on_a_predecessor) + " of them - " + str(dependent_per_myriad) + " per ten" ^0
"thousand - pass because an earlier test left state behind, so they would fail" ^0
"shuffled and pass if the code they name stopped working, and " + str(months_green * 30) + " runs a month" ^0
"in the same order cannot distinguish that from correctness." ^0
```

## Python (deterministic transpilation)

```python
tests = 1400
months_green = 11
tests_touching_shared_fixtures = 64
tests_that_depend_on_a_predecessor = 9
print("tests in the suite            : " + str(tests))
print("consecutive green months      : " + str(months_green))
print("tests touching shared fixtures: " + str(tests_touching_shared_fixtures))
print("")
print("the suite")
print("  tests passing        : " + str(tests) + " of " + str(tests))
print("  flaky failures       : 0")
print("  order                : fixed, by file then by line")
print("  reproducible failures: yes, every one so far")
print("")
print("  the last row is what the fixed order was chosen to buy")
print("")
tests_that_stand_alone = tests - tests_that_depend_on_a_predecessor
print("tests, by what makes them pass")
print("  pass because the code is correct      : " + str(tests_that_stand_alone))
print("  pass because a predecessor ran first  : " + str(tests_that_depend_on_a_predecessor))
print("  report the difference                 : 0")
print("")
dependent_per_myriad = int(tests_that_depend_on_a_predecessor * 10000 / tests)
print("  share depending on order : " + str(dependent_per_myriad) + " per ten thousand")
print("")
print("one of the nine, in detail")
print("  name                : rejects an expired token")
print("  what it does        : calls the validator and expects a rejection")
print("  why it passes       : the clock fixture is still advanced from")
print("                        the test above it, so every token is expired")
print("  passes if the code stops checking expiry : yes")
print("  passes if run alone : no")
print("")
print("  it is green, it has always been green, and it does not")
print("  test expiry")
print("")
print("what would separate them")
print("  running the suite again        : no, same order")
print("  running it on another machine  : no, same order")
print("  running one test alone         : yes, for that one test")
print("  running the suite shuffled     : yes, for all of them at once")
print("")
print("  the first two are what continuous integration does " + str(months_green * 30) + " times")
print("  a month, and neither can reach it")
print("")
would_fail_shuffled = tests_that_depend_on_a_predecessor
print("the same suite in a random order")
print("  tests failing      : " + str(would_fail_shuffled))
print("  defects in the code they name : unknown until each is read")
print("  defects in the tests          : " + str(would_fail_shuffled) + ", at minimum")
print("")
print("  a red run is the first information this suite has produced")
print("  about those nine in " + str(months_green) + " months")
print("")
print("month   runs   failures   tests that would fail shuffled")
for m in range(1, 5):
    mo = m * 3
    print("  " + str(mo) + "       " + str(mo * 30) + "    0          " + str(would_fail_shuffled))
print("")
print("  the third column is constant and the second is what gets read")
print("")
print("control - is the fixed order earning its place")
print("  failures reproduced from the report alone : all of them")
print("  unreproducible failures                   : 0")
print("  fixture rebuilds avoided by the ordering  : " + str(tests_touching_shared_fixtures))
print("  defects in the ordering decision          : 0")
print("")
print("  randomising everything costs all three and the team has")
print("  already paid that once")
print("")
nc_order_dependent = 0
print("null control - the same fixed order over isolated fixtures")
print("  order                       : fixed, unchanged")
print("  failures reproducible       : yes, unchanged")
print("  tests depending on a predecessor : " + str(nc_order_dependent))
print("  tests that would fail shuffled   : " + str(nc_order_dependent))
print("  the order was never the defect; the shared state was")
print("")
print("what a green suite in a fixed order is evidence of")
print("  every test passes in THAT order : exactly")
print("  every test passes on its own    : not asked")
print("  each test asserts what it names : not asked")
print("  and a suite that has only ever run one order has one")
print("  observation, repeated")
print("")
print("the cheap check is not randomising the suite, which gives up")
print("what the order was for; it is running each test alone, once,")
print("and keeping the list of the ones that stop passing")
print("")
print("The suite passes " + str(tests) + " of " + str(tests) + " on every run and has for " + str(months_green) + " months, and the")
print("fixed order it runs in is why every failure so far was reproducible from the")
print("report alone, with 0 unreproducible failures. " + str(tests_that_depend_on_a_predecessor) + " of them - " + str(dependent_per_myriad) + " per ten")
print("thousand - pass because an earlier test left state behind, so they would fail")
print("shuffled and pass if the code they name stopped working, and " + str(months_green * 30) + " runs a month")
print("in the same order cannot distinguish that from correctness.")
```

## stdout (executed)

```text
tests in the suite            : 1400
consecutive green months      : 11
tests touching shared fixtures: 64

the suite
  tests passing        : 1400 of 1400
  flaky failures       : 0
  order                : fixed, by file then by line
  reproducible failures: yes, every one so far

  the last row is what the fixed order was chosen to buy

tests, by what makes them pass
  pass because the code is correct      : 1391
  pass because a predecessor ran first  : 9
  report the difference                 : 0

  share depending on order : 64 per ten thousand

one of the nine, in detail
  name                : rejects an expired token
  what it does        : calls the validator and expects a rejection
  why it passes       : the clock fixture is still advanced from
                        the test above it, so every token is expired
  passes if the code stops checking expiry : yes
  passes if run alone : no

  it is green, it has always been green, and it does not
  test expiry

what would separate them
  running the suite again        : no, same order
  running it on another machine  : no, same order
  running one test alone         : yes, for that one test
  running the suite shuffled     : yes, for all of them at once

  the first two are what continuous integration does 330 times
  a month, and neither can reach it

the same suite in a random order
  tests failing      : 9
  defects in the code they name : unknown until each is read
  defects in the tests          : 9, at minimum

  a red run is the first information this suite has produced
  about those nine in 11 months

month   runs   failures   tests that would fail shuffled
  3       90    0          9
  6       180    0          9
  9       270    0          9
  12       360    0          9

  the third column is constant and the second is what gets read

control - is the fixed order earning its place
  failures reproduced from the report alone : all of them
  unreproducible failures                   : 0
  fixture rebuilds avoided by the ordering  : 64
  defects in the ordering decision          : 0

  randomising everything costs all three and the team has
  already paid that once

null control - the same fixed order over isolated fixtures
  order                       : fixed, unchanged
  failures reproducible       : yes, unchanged
  tests depending on a predecessor : 0
  tests that would fail shuffled   : 0
  the order was never the defect; the shared state was

what a green suite in a fixed order is evidence of
  every test passes in THAT order : exactly
  every test passes on its own    : not asked
  each test asserts what it names : not asked
  and a suite that has only ever run one order has one
  observation, repeated

the cheap check is not randomising the suite, which gives up
what the order was for; it is running each test alone, once,
and keeping the list of the ones that stop passing

The suite passes 1400 of 1400 on every run and has for 11 months, and the
fixed order it runs in is why every failure so far was reproducible from the
report alone, with 0 unreproducible failures. 9 of them - 64 per ten
thousand - pass because an earlier test left state behind, so they would fail
shuffled and pass if the code they name stopped working, and 330 runs a month
in the same order cannot distinguish that from correctness.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
