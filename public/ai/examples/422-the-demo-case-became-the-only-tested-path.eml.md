<!-- canonical: efficientnewlanguage.org/ai/examples/422-the-demo-case-became-the-only-tested-path | ai_layer_version: 0.1.0 | updated: 2026-08-17 -->

# Example 422 — The demo case became the only tested path

`the_demo_case_became_the_only_tested_path.eml` - The example in the README is one shape of input. It is the shape 14 of 18 tests exercise.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The example in the
# README is one shape of input. It is the shape 14 of 18 tests exercise.
#
# The example was chosen well: it is short, it demonstrates the feature, and it
# is the first thing anyone runs. It became the shape everybody copies - into
# tests, into fixtures, into the mental model of what the input looks like -
# because it is the only concrete input the documentation contains.
#
# Nothing about that is negligent. Writing tests from the example is faster and
# safer than inventing inputs, and the example is known to be valid.
#
# Test coverage and real traffic are both counted per shape here, so the gap is
# measured against what the system actually receives.

# [shape, share of real traffic, tests exercising it, defects found in production]
[["flat, all fields present", 22, 14, 1], ["nested one level", 31, 2, 5], ["optional fields missing", 25, 1, 6], ["unicode in every field", 14, 1, 4], ["empty collections", 8, 0, 3]] => shapes

def total(col):
    0 => t
    for s in shapes:
        t + s[col] => t
    return t

"input shapes : " + str(len(shapes)) ^0
"  tests    : " + str(total(2)) ^0
"  production defects : " + str(total(3)) ^0
"" ^0

"shape                        traffic   tests   defects" ^0
for s in shapes:
    "  " + s[0] + "   " + str(s[1]) + "%      " + str(s[2]) + "       " + str(s[3]) ^0
"" ^0

# ---- the demo shape ----

0 => demo_at
"the shape the README example uses : " + shapes[demo_at][0] ^0
"  its share of traffic : " + str(shapes[demo_at][1]) + "%" ^0
"  its share of tests   : " + str(int(shapes[demo_at][2] * 100 / total(2))) + "%" ^0
"  its share of defects : " + str(int(shapes[demo_at][3] * 100 / total(3))) + "%" ^0
"" ^0

# ---- everything else ----

0 => other_traffic
0 => other_tests
0 => other_defects
0 => i
for s in shapes:
    if not (i == demo_at):
        other_traffic + s[1] => other_traffic
        other_tests + s[2] => other_tests
        other_defects + s[3] => other_defects
    i + 1 => i
"every other shape, together" ^0
"  traffic : " + str(other_traffic) + "%" ^0
"  tests   : " + str(other_tests) + "  (" + str(int(other_tests * 100 / total(2))) + "%)" ^0
"  defects : " + str(other_defects) + "  (" + str(int(other_defects * 100 / total(3))) + "%)" ^0
"" ^0

# ---- tests per unit of traffic ----

"tests per point of traffic share" ^0
for s in shapes:
    "  " + s[0] + " : " + str(int(s[2] * 100 / s[1])) ^0
"" ^0

# ---- defects per test ----
#
# The shape with the most tests has the fewest defects, which is what tests are
# for. The question is whether the tests went where the traffic is.

0 => best_covered
0 => best_at
0 => j
for s in shapes:
    if s[2] > best_covered:
        s[2] => best_covered
        j => best_at
    j + 1 => j
0 => worst_defects
0 => worst_at
0 => k
for s in shapes:
    if s[3] > worst_defects:
        s[3] => worst_defects
        k => worst_at
    k + 1 => k
"  most tested   : " + shapes[best_at][0] + " (" + str(shapes[best_at][2]) + " tests, " + str(shapes[best_at][3]) + " defects)" ^0
"  most defects  : " + shapes[worst_at][0] + " (" + str(shapes[worst_at][2]) + " tests, " + str(shapes[worst_at][3]) + " defects)" ^0
if not (best_at == worst_at):
    "  the tests worked where they were pointed, and they were pointed at the" ^0
    "  example rather than at the traffic" ^0
"" ^0

# ---- what a second example in the docs would change ----

0 => second_at
99 => least_tested
0 => m
for s in shapes:
    if s[2] < least_tested:
        s[2] => least_tested
        m => second_at
    m + 1 => m
"the shape with the fewest tests : " + shapes[second_at][0] ^0
"  its traffic share : " + str(shapes[second_at][1]) + "%" ^0
"  its defects       : " + str(shapes[second_at][3]) ^0
"  documenting it costs one more example" ^0
"" ^0

# ---- the control: a system whose example IS the common case ----
#
# Copying the example is only a problem when the example is unrepresentative.

[["the documented shape", 80, 12, 1], ["everything else", 20, 4, 1]] => aligned
"control - a system whose example matches the traffic" ^0
"  documented shape : " + str(aligned[0][1]) + "% of traffic, " + str(aligned[0][2]) + " tests" ^0
"  everything else  : " + str(aligned[1][1]) + "% of traffic, " + str(aligned[1][2]) + " tests" ^0
if aligned[0][1] > 50:
    "  here copying the example points the tests at the traffic" ^0
"" ^0

"The example is correct, valid and well chosen for teaching. It is also the" ^0
"only input anyone was handed, and a test suite is built from the inputs" ^0
"people have." ^0
```

## Python (deterministic transpilation)

```python
shapes = [["flat, all fields present", 22, 14, 1], ["nested one level", 31, 2, 5], ["optional fields missing", 25, 1, 6], ["unicode in every field", 14, 1, 4], ["empty collections", 8, 0, 3]]

def total(col):
    t = 0
    for s in shapes:
        t = t + s[col]
    return t

print("input shapes : " + str(len(shapes)))
print("  tests    : " + str(total(2)))
print("  production defects : " + str(total(3)))
print("")
print("shape                        traffic   tests   defects")
for s in shapes:
    print("  " + s[0] + "   " + str(s[1]) + "%      " + str(s[2]) + "       " + str(s[3]))
print("")
demo_at = 0
print("the shape the README example uses : " + shapes[demo_at][0])
print("  its share of traffic : " + str(shapes[demo_at][1]) + "%")
print("  its share of tests   : " + str(int(shapes[demo_at][2] * 100 / total(2))) + "%")
print("  its share of defects : " + str(int(shapes[demo_at][3] * 100 / total(3))) + "%")
print("")
other_traffic = 0
other_tests = 0
other_defects = 0
i = 0
for s in shapes:
    if not i == demo_at:
        other_traffic = other_traffic + s[1]
        other_tests = other_tests + s[2]
        other_defects = other_defects + s[3]
    i = i + 1
print("every other shape, together")
print("  traffic : " + str(other_traffic) + "%")
print("  tests   : " + str(other_tests) + "  (" + str(int(other_tests * 100 / total(2))) + "%)")
print("  defects : " + str(other_defects) + "  (" + str(int(other_defects * 100 / total(3))) + "%)")
print("")
print("tests per point of traffic share")
for s in shapes:
    print("  " + s[0] + " : " + str(int(s[2] * 100 / s[1])))
print("")
best_covered = 0
best_at = 0
j = 0
for s in shapes:
    if s[2] > best_covered:
        best_covered = s[2]
        best_at = j
    j = j + 1
worst_defects = 0
worst_at = 0
k = 0
for s in shapes:
    if s[3] > worst_defects:
        worst_defects = s[3]
        worst_at = k
    k = k + 1
print("  most tested   : " + shapes[best_at][0] + " (" + str(shapes[best_at][2]) + " tests, " + str(shapes[best_at][3]) + " defects)")
print("  most defects  : " + shapes[worst_at][0] + " (" + str(shapes[worst_at][2]) + " tests, " + str(shapes[worst_at][3]) + " defects)")
if not best_at == worst_at:
    print("  the tests worked where they were pointed, and they were pointed at the")
    print("  example rather than at the traffic")
print("")
second_at = 0
least_tested = 99
m = 0
for s in shapes:
    if s[2] < least_tested:
        least_tested = s[2]
        second_at = m
    m = m + 1
print("the shape with the fewest tests : " + shapes[second_at][0])
print("  its traffic share : " + str(shapes[second_at][1]) + "%")
print("  its defects       : " + str(shapes[second_at][3]))
print("  documenting it costs one more example")
print("")
aligned = [["the documented shape", 80, 12, 1], ["everything else", 20, 4, 1]]
print("control - a system whose example matches the traffic")
print("  documented shape : " + str(aligned[0][1]) + "% of traffic, " + str(aligned[0][2]) + " tests")
print("  everything else  : " + str(aligned[1][1]) + "% of traffic, " + str(aligned[1][2]) + " tests")
if aligned[0][1] > 50:
    print("  here copying the example points the tests at the traffic")
print("")
print("The example is correct, valid and well chosen for teaching. It is also the")
print("only input anyone was handed, and a test suite is built from the inputs")
print("people have.")
```

## stdout (executed)

```text
input shapes : 5
  tests    : 18
  production defects : 19

shape                        traffic   tests   defects
  flat, all fields present   22%      14       1
  nested one level   31%      2       5
  optional fields missing   25%      1       6
  unicode in every field   14%      1       4
  empty collections   8%      0       3

the shape the README example uses : flat, all fields present
  its share of traffic : 22%
  its share of tests   : 77%
  its share of defects : 5%

every other shape, together
  traffic : 78%
  tests   : 4  (22%)
  defects : 18  (94%)

tests per point of traffic share
  flat, all fields present : 63
  nested one level : 6
  optional fields missing : 4
  unicode in every field : 7
  empty collections : 0

  most tested   : flat, all fields present (14 tests, 1 defects)
  most defects  : optional fields missing (1 tests, 6 defects)
  the tests worked where they were pointed, and they were pointed at the
  example rather than at the traffic

the shape with the fewest tests : empty collections
  its traffic share : 8%
  its defects       : 3
  documenting it costs one more example

control - a system whose example matches the traffic
  documented shape : 80% of traffic, 12 tests
  everything else  : 20% of traffic, 4 tests
  here copying the example points the tests at the traffic

The example is correct, valid and well chosen for teaching. It is also the
only input anyone was handed, and a test suite is built from the inputs
people have.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
