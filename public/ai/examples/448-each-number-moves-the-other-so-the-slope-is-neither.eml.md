<!-- canonical: efficientnewlanguage.org/ai/examples/448-each-number-moves-the-other-so-the-slope-is-neither | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 448 — Each number moves the other so the slope is neither

`each_number_moves_the_other_so_the_slope_is_neither.eml` - Test count and build time move together across twelve weeks. What the slope between them measures is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Test count and
# build time move together across twelve weeks. What the slope between them
# measures is computed below.
#
# Reading the relationship off the data is the right instinct and the data is
# good: twelve clean weeks, both quantities measured by the build system
# itself, no missing points. The two move together tightly, and that is a real
# fact about the weeks observed.
#
# Tests make the build slower, and a slower build makes people write fewer
# tests. Both effects are present in every week, so the observed pairing is
# produced by the two together and the slope through it is neither of them.
#
# The two effects are set separately here and the observed slope is computed.

# per test added, the build gets this many seconds slower
3 => seconds_per_test
# one test fewer is written for each this-many seconds the build sits above base
200 => seconds_per_lost_test

400 => base_build
120 => base_tests
12 => weeks
# tests somebody adds regardless, per week, from unrelated feature work
[6, 2, 9, 3, 8, 1, 7, 4, 6, 2, 8, 3] => new_tests_each_week

[] => tests_series
[] => build_series
base_tests => tests
base_build + base_tests * seconds_per_test => build
0 => w
while w < weeks:
    tests_series + [tests] => tests_series
    build_series + [build] => build_series
    base_build + tests * seconds_per_test => build
    new_tests_each_week[w] => added
    int((build - base_build) / seconds_per_lost_test) => discouraged
    tests + added - discouraged => next_tests
    if next_tests < 0:
        0 => next_tests
    next_tests => tests
    w + 1 => w

"weeks : " + str(weeks) ^0
"true effects, set independently:" ^0
"  each test adds " + str(seconds_per_test) + " seconds to the build" ^0
"  one test fewer is written per " + str(seconds_per_lost_test) + " seconds the build sits above base" ^0
"" ^0
"week   tests   build seconds" ^0
for i in [0:weeks - 1]:
    "  " + str(i + 1) + "      " + str(tests_series[i]) + "     " + str(build_series[i]) ^0
"" ^0

# ---- the slope somebody would read off these points ----

tests_series[weeks - 1] - tests_series[0] => d_tests
build_series[weeks - 1] - build_series[0] => d_build
"from the first week to the last" ^0
"  tests moved by : " + str(d_tests) ^0
"  build moved by : " + str(d_build) ^0
if not (d_tests == 0):
    int(d_build / d_tests) => slope
    "  seconds per test, read off the pair : " + str(slope) ^0
    if not (slope == seconds_per_test):
        "  against a true cost of " + str(seconds_per_test) + " seconds per test" ^0
        "  the reading is out by " + str(slope - seconds_per_test) ^0
else:
    "  tests did not move, so no slope can be read" ^0
"" ^0

# ---- why the reading is not the effect ----

"what the observed pair contains" ^0
"  tests pushing the build up   : yes, at " + str(seconds_per_test) + " seconds each" ^0
"  build pushing the tests down : yes, one per " + str(seconds_per_lost_test) + " seconds above base" ^0
"  a slope through the points is one number for two effects that point in" ^0
"  opposite directions, so its size depends on which one moved first" ^0
"" ^0

# ---- what an exogenous push measures ----
#
# Change one of them for a reason unrelated to the other, and the response of
# the second is the effect of the first, with nothing else in it.

base_tests => t0
base_build + t0 * seconds_per_test => b0
t0 + 30 => t1
base_build + t1 * seconds_per_test => b1
"adding 30 tests for a reason unrelated to build time" ^0
"  tests : " + str(t0) + " to " + str(t1) ^0
"  build : " + str(b0) + " to " + str(b1) ^0
int((b1 - b0) / (t1 - t0)) => measured
"  seconds per test, measured this way : " + str(measured) ^0
if measured == seconds_per_test:
    "  which is the true value, because nothing else moved" ^0
"" ^0

# ---- what each reading supports ----

"the question : should we delete 40 slow tests" ^0
"  answered with the observed slope : the build changes by " + str(0 - 40 * slope) + " if the" ^0
"    slope is read as causal, and the pair drifts back afterwards" ^0
"  answered with the exogenous figure : " + str(40 * seconds_per_test) + " seconds faster, and then the" ^0
"    second effect adds tests back, one per " + str(seconds_per_lost_test) + " seconds recovered" ^0
"  the second answer has both terms and the first has one number standing" ^0
"  in for both" ^0
"" ^0

# ---- the control: one direction only ----
#
# Where build time does not affect how many tests get written, the pairing
# contains one effect and the slope through it is that effect.

[] => one_way
base_tests => t
0 => k
0 => ow_tests
while k < weeks:
    one_way + [base_build + t * seconds_per_test] => one_way
    if k < weeks - 1:
        ow_tests + new_tests_each_week[k] => ow_tests
        t + new_tests_each_week[k] => t
    k + 1 => k
one_way[weeks - 1] - one_way[0] => ow_build
"control - the same weeks with no discouragement effect" ^0
"  tests moved by " + str(ow_tests) + ", build by " + str(ow_build) ^0
int(ow_build / ow_tests) => ow_slope
"  slope : " + str(ow_slope) ^0
if ow_slope == seconds_per_test:
    "  equal to the true cost, so with one direction the slope is the effect" ^0
"" ^0

"Twelve clean weeks, two quantities measured by the same system, and they" ^0
"move together. Each is moving the other, so the line through them is a" ^0
"number belonging to neither." ^0
```

## Python (deterministic transpilation)

```python
seconds_per_test = 3
seconds_per_lost_test = 200
base_build = 400
base_tests = 120
weeks = 12
new_tests_each_week = [6, 2, 9, 3, 8, 1, 7, 4, 6, 2, 8, 3]
tests_series = []
build_series = []
tests = base_tests
build = base_build + base_tests * seconds_per_test
w = 0
while w < weeks:
    tests_series = tests_series + [tests]
    build_series = build_series + [build]
    build = base_build + tests * seconds_per_test
    added = new_tests_each_week[w]
    discouraged = int((build - base_build) / seconds_per_lost_test)
    next_tests = tests + added - discouraged
    if next_tests < 0:
        next_tests = 0
    tests = next_tests
    w = w + 1
print("weeks : " + str(weeks))
print("true effects, set independently:")
print("  each test adds " + str(seconds_per_test) + " seconds to the build")
print("  one test fewer is written per " + str(seconds_per_lost_test) + " seconds the build sits above base")
print("")
print("week   tests   build seconds")
for i in range(0, weeks):
    print("  " + str(i + 1) + "      " + str(tests_series[i]) + "     " + str(build_series[i]))
print("")
d_tests = tests_series[weeks - 1] - tests_series[0]
d_build = build_series[weeks - 1] - build_series[0]
print("from the first week to the last")
print("  tests moved by : " + str(d_tests))
print("  build moved by : " + str(d_build))
if not d_tests == 0:
    slope = int(d_build / d_tests)
    print("  seconds per test, read off the pair : " + str(slope))
    if not slope == seconds_per_test:
        print("  against a true cost of " + str(seconds_per_test) + " seconds per test")
        print("  the reading is out by " + str(slope - seconds_per_test))
else:
    print("  tests did not move, so no slope can be read")
print("")
print("what the observed pair contains")
print("  tests pushing the build up   : yes, at " + str(seconds_per_test) + " seconds each")
print("  build pushing the tests down : yes, one per " + str(seconds_per_lost_test) + " seconds above base")
print("  a slope through the points is one number for two effects that point in")
print("  opposite directions, so its size depends on which one moved first")
print("")
t0 = base_tests
b0 = base_build + t0 * seconds_per_test
t1 = t0 + 30
b1 = base_build + t1 * seconds_per_test
print("adding 30 tests for a reason unrelated to build time")
print("  tests : " + str(t0) + " to " + str(t1))
print("  build : " + str(b0) + " to " + str(b1))
measured = int((b1 - b0) / (t1 - t0))
print("  seconds per test, measured this way : " + str(measured))
if measured == seconds_per_test:
    print("  which is the true value, because nothing else moved")
print("")
print("the question : should we delete 40 slow tests")
print("  answered with the observed slope : the build changes by " + str(0 - 40 * slope) + " if the")
print("    slope is read as causal, and the pair drifts back afterwards")
print("  answered with the exogenous figure : " + str(40 * seconds_per_test) + " seconds faster, and then the")
print("    second effect adds tests back, one per " + str(seconds_per_lost_test) + " seconds recovered")
print("  the second answer has both terms and the first has one number standing")
print("  in for both")
print("")
one_way = []
t = base_tests
k = 0
ow_tests = 0
while k < weeks:
    one_way = one_way + [base_build + t * seconds_per_test]
    if k < weeks - 1:
        ow_tests = ow_tests + new_tests_each_week[k]
        t = t + new_tests_each_week[k]
    k = k + 1
ow_build = one_way[weeks - 1] - one_way[0]
print("control - the same weeks with no discouragement effect")
print("  tests moved by " + str(ow_tests) + ", build by " + str(ow_build))
ow_slope = int(ow_build / ow_tests)
print("  slope : " + str(ow_slope))
if ow_slope == seconds_per_test:
    print("  equal to the true cost, so with one direction the slope is the effect")
print("")
print("Twelve clean weeks, two quantities measured by the same system, and they")
print("move together. Each is moving the other, so the line through them is a")
print("number belonging to neither.")
```

## stdout (executed)

```text
weeks : 12
true effects, set independently:
  each test adds 3 seconds to the build
  one test fewer is written per 200 seconds the build sits above base

week   tests   build seconds
  1      120     760
  2      125     760
  3      126     775
  4      134     778
  5      135     802
  6      141     805
  7      140     823
  8      145     820
  9      147     835
  10      151     841
  11      151     853
  12      157     853

from the first week to the last
  tests moved by : 37
  build moved by : 93
  seconds per test, read off the pair : 2
  against a true cost of 3 seconds per test
  the reading is out by -1

what the observed pair contains
  tests pushing the build up   : yes, at 3 seconds each
  build pushing the tests down : yes, one per 200 seconds above base
  a slope through the points is one number for two effects that point in
  opposite directions, so its size depends on which one moved first

adding 30 tests for a reason unrelated to build time
  tests : 120 to 150
  build : 760 to 850
  seconds per test, measured this way : 3
  which is the true value, because nothing else moved

the question : should we delete 40 slow tests
  answered with the observed slope : the build changes by -80 if the
    slope is read as causal, and the pair drifts back afterwards
  answered with the exogenous figure : 120 seconds faster, and then the
    second effect adds tests back, one per 200 seconds recovered
  the second answer has both terms and the first has one number standing
  in for both

control - the same weeks with no discouragement effect
  tests moved by 56, build by 168
  slope : 3
  equal to the true cost, so with one direction the slope is the effect

Twelve clean weeks, two quantities measured by the same system, and they
move together. Each is moving the other, so the line through them is a
number belonging to neither.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
