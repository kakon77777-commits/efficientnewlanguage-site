<!-- canonical: efficientnewlanguage.org/ai/examples/367-the-regression-test-locks-in-the-workaround | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 367 — The regression test locks in the workaround — green in the 2 states where the system is wrong

`the_regression_test_locks_in_the_workaround.eml` classifies every assertion in a suite against the rule it was supposed to protect.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A regression test
# written against the workaround, which now defends the defect.
#
# The cause was in a component another team owned, so the team that got the
# report shipped a workaround: strip the bad suffix after the fact. Correct
# procedure followed - a regression test was added so the symptom could not
# come back.
#
# The test asserts the workaround's output. That output is right for the
# reported input and wrong for a class of others, so the assertion is now a
# written record of the wrong answer, held in the file whose job is to stop
# wrong answers.
#
# The day the real cause is fixed, the suite goes red. Nothing about that red
# distinguishes "the fix is broken" from "the test is defending the bug", and
# the person reading it has one afternoon.
#
# Nothing is declared. Every test's assertion is compared against the rule that
# was supposed to hold, so which tests defend the rule and which defend the
# workaround is measured rather than remembered.

def upstream(name, fixed):
    if fixed == 1:
        return name
    return name + "#"

def display(name, fixed_upstream, workaround):
    upstream(name, fixed_upstream) => s
    if workaround == 1:
        "" => t
        for ch in s:
            if ch == "#":
                pass
            else:
                t + ch => t
        return t
    return s

def rule(name):
    return name

# each test is [input, asserted output]
[["ana", "ana"], ["bo", "bo"], ["c#dev", "cdev"], ["di", "di"], ["e#f", "ef"]] => tests

def run(tests, fixed_upstream, workaround):
    0 => passed
    for t in tests:
        if display(t[0], fixed_upstream, workaround) == t[1]:
            passed + 1 => passed
    return passed

# ---- the suite in each state ----

"tests in the suite : " + str(len(tests)) ^0
"" ^0
"  before the workaround (upstream broken)      : " + str(run(tests, 0, 0)) + " pass" ^0
"  with the workaround (upstream still broken)  : " + str(run(tests, 0, 1)) + " pass" ^0
"  upstream fixed, workaround removed           : " + str(run(tests, 1, 0)) + " pass" ^0
"  upstream fixed, workaround left in place     : " + str(run(tests, 1, 1)) + " pass" ^0
"" ^0

# ---- which tests fail when the real cause is fixed ----

"tests that fail once the upstream cause is fixed and the workaround removed" ^0
0 => failing
0 => defend_rule
0 => defend_workaround
for t in tests:
    display(t[0], 1, 0) => got
    if got != t[1]:
        failing + 1 => failing
        if t[1] == rule(t[0]):
            defend_rule + 1 => defend_rule
            "  " + t[0] + " : asserts " + t[1] + ", got " + got + "  - this test is right" ^0
        else:
            defend_workaround + 1 => defend_workaround
            "  " + t[0] + " : asserts " + t[1] + ", got " + got + "  - this assertion is the workaround" ^0
"  failing : " + str(failing) ^0
"  of those, defending the rule      : " + str(defend_rule) ^0
"  of those, defending the workaround : " + str(defend_workaround) ^0
"" ^0

# ---- the same classification over the whole suite ----

"every assertion in the suite, checked against the rule" ^0
0 => correct_assertions
0 => wrong_assertions
for t in tests:
    if t[1] == rule(t[0]):
        correct_assertions + 1 => correct_assertions
    else:
        wrong_assertions + 1 => wrong_assertions
        "  " + t[0] + " : the suite asserts " + t[1] + ", the rule says " + rule(t[0]) ^0
"  assertions matching the rule     : " + str(correct_assertions) ^0
"  assertions matching the workaround : " + str(wrong_assertions) ^0
"" ^0

# ---- what the suite is green about, in each state ----
#
# A green suite is compatible with two different systems here. That is the
# whole problem: greenness stopped being a claim about correctness.

"states in which the suite is fully green" ^0
0 => green_states
[] => green_names
["upstream broken + workaround", "upstream fixed + workaround", "upstream fixed, no workaround", "upstream broken, no workaround"] => state_names
[run(tests, 0, 1), run(tests, 1, 1), run(tests, 1, 0), run(tests, 0, 0)] => results
0 => gi
for r in results:
    if r == len(tests):
        green_states + 1 => green_states
        green_names + [state_names[gi]] => green_names
    gi + 1 => gi
"  green in " + str(green_states) + " of " + str(len(results)) + " states" ^0
for g in green_names:
    "    " + g ^0
"" ^0

# ---- how many inputs each state actually serves correctly ----

["ana", "bo", "c#dev", "di", "e#f", "g#h#i", "j"] => real_inputs
"correct outputs over a wider input set" ^0
0 => ri
for r in results:
    0 => ok
    for n in real_inputs:
        0 => fu
        0 => wa
        if ri == 0:
            0 => fu
            1 => wa
        if ri == 1:
            1 => fu
            1 => wa
        if ri == 2:
            1 => fu
            0 => wa
        if display(n, fu, wa) == rule(n):
            ok + 1 => ok
    "  " + state_names[ri] + " : " + str(ok) + " of " + str(len(real_inputs)) ^0
    ri + 1 => ri
"" ^0

"A regression test records what the output was when somebody decided it was" ^0
"acceptable. If that moment was during a workaround, the record is of the" ^0
"workaround, and the file that is supposed to stop the bug returning is now" ^0
"the reason it cannot leave." ^0
```

## Python (deterministic transpilation)

```python
def upstream(name, fixed):
    if fixed == 1:
        return name
    return name + "#"

def display(name, fixed_upstream, workaround):
    s = upstream(name, fixed_upstream)
    if workaround == 1:
        t = ""
        for ch in s:
            if ch == "#":
                pass
            else:
                t = t + ch
        return t
    return s

def rule(name):
    return name

tests = [["ana", "ana"], ["bo", "bo"], ["c#dev", "cdev"], ["di", "di"], ["e#f", "ef"]]

def run(tests, fixed_upstream, workaround):
    passed = 0
    for t in tests:
        if display(t[0], fixed_upstream, workaround) == t[1]:
            passed = passed + 1
    return passed

print("tests in the suite : " + str(len(tests)))
print("")
print("  before the workaround (upstream broken)      : " + str(run(tests, 0, 0)) + " pass")
print("  with the workaround (upstream still broken)  : " + str(run(tests, 0, 1)) + " pass")
print("  upstream fixed, workaround removed           : " + str(run(tests, 1, 0)) + " pass")
print("  upstream fixed, workaround left in place     : " + str(run(tests, 1, 1)) + " pass")
print("")
print("tests that fail once the upstream cause is fixed and the workaround removed")
failing = 0
defend_rule = 0
defend_workaround = 0
for t in tests:
    got = display(t[0], 1, 0)
    if got != t[1]:
        failing = failing + 1
        if t[1] == rule(t[0]):
            defend_rule = defend_rule + 1
            print("  " + t[0] + " : asserts " + t[1] + ", got " + got + "  - this test is right")
        else:
            defend_workaround = defend_workaround + 1
            print("  " + t[0] + " : asserts " + t[1] + ", got " + got + "  - this assertion is the workaround")
print("  failing : " + str(failing))
print("  of those, defending the rule      : " + str(defend_rule))
print("  of those, defending the workaround : " + str(defend_workaround))
print("")
print("every assertion in the suite, checked against the rule")
correct_assertions = 0
wrong_assertions = 0
for t in tests:
    if t[1] == rule(t[0]):
        correct_assertions = correct_assertions + 1
    else:
        wrong_assertions = wrong_assertions + 1
        print("  " + t[0] + " : the suite asserts " + t[1] + ", the rule says " + rule(t[0]))
print("  assertions matching the rule     : " + str(correct_assertions))
print("  assertions matching the workaround : " + str(wrong_assertions))
print("")
print("states in which the suite is fully green")
green_states = 0
green_names = []
state_names = ["upstream broken + workaround", "upstream fixed + workaround", "upstream fixed, no workaround", "upstream broken, no workaround"]
results = [run(tests, 0, 1), run(tests, 1, 1), run(tests, 1, 0), run(tests, 0, 0)]
gi = 0
for r in results:
    if r == len(tests):
        green_states = green_states + 1
        green_names = green_names + [state_names[gi]]
    gi = gi + 1
print("  green in " + str(green_states) + " of " + str(len(results)) + " states")
for g in green_names:
    print("    " + g)
print("")
real_inputs = ["ana", "bo", "c#dev", "di", "e#f", "g#h#i", "j"]
print("correct outputs over a wider input set")
ri = 0
for r in results:
    ok = 0
    for n in real_inputs:
        fu = 0
        wa = 0
        if ri == 0:
            fu = 0
            wa = 1
        if ri == 1:
            fu = 1
            wa = 1
        if ri == 2:
            fu = 1
            wa = 0
        if display(n, fu, wa) == rule(n):
            ok = ok + 1
    print("  " + state_names[ri] + " : " + str(ok) + " of " + str(len(real_inputs)))
    ri = ri + 1
print("")
print("A regression test records what the output was when somebody decided it was")
print("acceptable. If that moment was during a workaround, the record is of the")
print("workaround, and the file that is supposed to stop the bug returning is now")
print("the reason it cannot leave.")
```

## stdout (executed)

```text
tests in the suite : 5

  before the workaround (upstream broken)      : 0 pass
  with the workaround (upstream still broken)  : 5 pass
  upstream fixed, workaround removed           : 3 pass
  upstream fixed, workaround left in place     : 5 pass

tests that fail once the upstream cause is fixed and the workaround removed
  c#dev : asserts cdev, got c#dev  - this assertion is the workaround
  e#f : asserts ef, got e#f  - this assertion is the workaround
  failing : 2
  of those, defending the rule      : 0
  of those, defending the workaround : 2

every assertion in the suite, checked against the rule
  c#dev : the suite asserts cdev, the rule says c#dev
  e#f : the suite asserts ef, the rule says e#f
  assertions matching the rule     : 3
  assertions matching the workaround : 2

states in which the suite is fully green
  green in 2 of 4 states
    upstream broken + workaround
    upstream fixed + workaround

correct outputs over a wider input set
  upstream broken + workaround : 4 of 7
  upstream fixed + workaround : 4 of 7
  upstream fixed, no workaround : 7 of 7
  upstream broken, no workaround : 0 of 7

A regression test records what the output was when somebody decided it was
acceptable. If that moment was during a workaround, the record is of the
workaround, and the file that is supposed to stop the bug returning is now
the reason it cannot leave.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
