<!-- canonical: efficientnewlanguage.org/ai/examples/283-mutation-survival | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 283 — Mutation survival — the test that runs the most lines checks the least

`mutation_survival.eml` runs one suite against three mutants of one function and reports which tests kill which, alongside the coverage each test achieves.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A test suite with
# full line coverage that cannot tell a correct function from a broken one.
#
# Coverage measures which lines RAN. A test that runs every line and asserts
# nothing has 100% coverage. So does a test that asserts something true of both
# the correct implementation and a broken one. Coverage is a lower bound on
# what was executed and says nothing about what was checked.
#
# The measurement that does say something is mutation: take the implementation,
# introduce a small change, and ask whether any test notices. A mutant that
# survives is a statement about the suite, not about the mutant - it names a
# behaviour nothing is watching.
#
# Here one function, one suite, and a set of mutants. Every test runs every
# line, so coverage is 100% for the whole suite and for several individual
# tests. The mutation score is not.

def classify(n, mutant):
    # Bands: <0 invalid, 0..9 low, 10..99 mid, >=100 high.
    # `mutant` selects a small change; "none" is the correct version.
    #
    # The boundary mutant moves ONE threshold by one. The first version of it
    # returned "mid" for everything at or above 9, which is not an off-by-one
    # - it is a rewrite, and the existing tests killed it immediately. A mutant
    # that any test catches measures nothing about the suite.
    if n < 0:
        if mutant == "sign":
            return "low"
        return "invalid"
    10 => low_top
    if mutant == "boundary":
        9 => low_top
    if n < low_top:
        return "low"
    if n < 100:
        if mutant == "band":
            return "high"
        return "mid"
    return "high"

def run_test(name, mutant):
    # 1 if the test passes on this mutant, 0 if it fails.
    if name == "happy-low":
        if classify(5, mutant) == "low":
            return 1
        return 0
    if name == "happy-mid":
        if classify(50, mutant) == "mid":
            return 1
        return 0
    if name == "happy-high":
        if classify(500, mutant) == "high":
            return 1
        return 0
    if name == "negative":
        if classify(0 - 1, mutant) == "invalid":
            return 1
        return 0
    if name == "smoke":
        # Runs everything and asserts only that a string came back.
        0 => seen
        for v in [0 - 1, 5, 50, 500]:
            if len(classify(v, mutant)) > 0:
                seen + 1 => seen
        if seen == 4:
            return 1
        return 0
    if name == "boundary-9":
        if classify(9, mutant) == "low":
            return 1
        return 0
    return 1

def lines_touched(name):
    # Which of the four bands a test's inputs reach - a stand-in for line
    # coverage, and deliberately generous: reaching a band means running its
    # branch.
    {} => hit
    [] => inputs
    if name == "happy-low":
        [5] => inputs
    elif name == "happy-mid":
        [50] => inputs
    elif name == "happy-high":
        [500] => inputs
    elif name == "negative":
        [0 - 1] => inputs
    elif name == "boundary-9":
        [9] => inputs
    else:
        [0 - 1, 5, 50, 500] => inputs
    for v in inputs:
        1 => hit[classify(v, "none")]
    return len(hit)


["happy-low", "happy-mid", "happy-high", "negative", "smoke"] => SUITE
["boundary", "sign", "band"] => MUTANTS

"mutant     killed by"^0
{} => killed_by
0 => survivors
for m in MUTANTS:
    "" => killers
    for t in SUITE:
        if run_test(t, m) == 0:
            if len(killers) > 0:
                killers + "," => killers
            killers + t => killers
    if len(killers) == 0:
        "-- SURVIVED --" => killers
        survivors + 1 => survivors
    killers => killed_by[m]
    ("%-10s %s" % (m, killers))^0

""^0
("mutants: " + str(len(MUTANTS)) + ", survivors: " + str(survivors))^0
len(MUTANTS) - survivors => killed
("mutation score: " + str(int(killed * 100 / len(MUTANTS))) + "%")^0

# ---------------------------------------- coverage says something else
""^0
"bands reached, per test (the coverage view):"^0
{} => covered
for t in SUITE:
    lines_touched(t) => c
    1 => covered[str(c)]
    ("  %-12s %d/4 bands" % (t, c))^0
0 => union
{} => all_bands
for t in SUITE:
    for v in [0 - 1, 5, 50, 500]:
        1 => all_bands[classify(v, "none")]
("the suite as a whole reaches: " + str(len(all_bands)) + "/4 bands - full coverage")^0

# -------------------------- the test that covers everything and checks nothing
""^0
0 => smoke_kills
for m in MUTANTS:
    if run_test("smoke", m) == 0:
        smoke_kills + 1 => smoke_kills
("the `smoke` test reaches " + str(lines_touched("smoke")) + "/4 bands and kills " + str(smoke_kills) + " mutants")^0
"...it is the highest-coverage test in the suite and the weakest one."^0

# --------------------------------- what killing the survivor requires
""^0
"the surviving mutant moves the low/mid boundary from 10 to 9."^0
("  classify(9) correct:  " + classify(9, "none"))^0
("  classify(9) mutated:  " + classify(9, "boundary"))^0
("  classify(5), both:    " + classify(5, "none") + " / " + classify(5, "boundary"))^0
0 => with_boundary
["boundary", "sign", "band"] => MS
for m in MS:
    0 => any_kill
    for t in SUITE:
        if run_test(t, m) == 0:
            1 => any_kill
    if run_test("boundary-9", m) == 0:
        1 => any_kill
    if any_kill == 1:
        with_boundary + 1 => with_boundary
("adding ONE test at the boundary raises the score to: " + str(int(with_boundary * 100 / len(MS))) + "%")^0
("  and it adds " + str(0) + " bands of coverage, because 9 is in a band already reached.")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# The suite must reach every band - full coverage by the generous definition.
checked + 1 => checked
if len(all_bands) == 4:
    passed + 1 => passed

# And at least one mutant must survive it anyway.
checked + 1 => checked
if survivors > 0:
    passed + 1 => passed

# The highest-coverage test must kill nothing. Coverage and discrimination are
# not merely different, they can point opposite ways.
checked + 1 => checked
if lines_touched("smoke") == 4 and smoke_kills == 0:
    passed + 1 => passed

# The boundary test must kill the survivor.
checked + 1 => checked
if run_test("boundary-9", "boundary") == 0:
    passed + 1 => passed

# And it must add no coverage at all - 9 is in a band the suite already
# reached, so a coverage report cannot ask for this test.
checked + 1 => checked
if with_boundary == len(MS) and lines_touched("boundary-9") == 1:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The test that runs the most lines is the one that checks the least." => verdict
else:
    "FAILED - the suite did not behave as the checks describe." => verdict
verdict^0

""^0
"Coverage answers a question about the suite's REACH and gets used as an" => n1
n1^0
"answer about its POWER. The two come apart in both directions: a test can" => n2
n2^0
"run everything and check nothing, and the test that closes a real gap can" => n3
n3^0
"add no coverage at all, because a boundary lives inside a band that was" => n4
n4^0
"already visited." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def classify(n, mutant):
    if n < 0:
        if mutant == "sign":
            return "low"
        return "invalid"
    low_top = 10
    if mutant == "boundary":
        low_top = 9
    if n < low_top:
        return "low"
    if n < 100:
        if mutant == "band":
            return "high"
        return "mid"
    return "high"

def run_test(name, mutant):
    if name == "happy-low":
        if classify(5, mutant) == "low":
            return 1
        return 0
    if name == "happy-mid":
        if classify(50, mutant) == "mid":
            return 1
        return 0
    if name == "happy-high":
        if classify(500, mutant) == "high":
            return 1
        return 0
    if name == "negative":
        if classify(0 - 1, mutant) == "invalid":
            return 1
        return 0
    if name == "smoke":
        seen = 0
        for v in [0 - 1, 5, 50, 500]:
            if len(classify(v, mutant)) > 0:
                seen = seen + 1
        if seen == 4:
            return 1
        return 0
    if name == "boundary-9":
        if classify(9, mutant) == "low":
            return 1
        return 0
    return 1

def lines_touched(name):
    hit = {}
    inputs = []
    if name == "happy-low":
        inputs = [5]
    elif name == "happy-mid":
        inputs = [50]
    elif name == "happy-high":
        inputs = [500]
    elif name == "negative":
        inputs = [0 - 1]
    elif name == "boundary-9":
        inputs = [9]
    else:
        inputs = [0 - 1, 5, 50, 500]
    for v in inputs:
        hit[classify(v, "none")] = 1
    return len(hit)

SUITE = ["happy-low", "happy-mid", "happy-high", "negative", "smoke"]
MUTANTS = ["boundary", "sign", "band"]
print("mutant     killed by")
killed_by = {}
survivors = 0
for m in MUTANTS:
    killers = ""
    for t in SUITE:
        if run_test(t, m) == 0:
            if len(killers) > 0:
                killers = killers + ","
            killers = killers + t
    if len(killers) == 0:
        killers = "-- SURVIVED --"
        survivors = survivors + 1
    killed_by[m] = killers
    print("%-10s %s" % (m, killers))
print("")
print("mutants: " + str(len(MUTANTS)) + ", survivors: " + str(survivors))
killed = len(MUTANTS) - survivors
print("mutation score: " + str(int(killed * 100 / len(MUTANTS))) + "%")
print("")
print("bands reached, per test (the coverage view):")
covered = {}
for t in SUITE:
    c = lines_touched(t)
    covered[str(c)] = 1
    print("  %-12s %d/4 bands" % (t, c))
union = 0
all_bands = {}
for t in SUITE:
    for v in [0 - 1, 5, 50, 500]:
        all_bands[classify(v, "none")] = 1
print("the suite as a whole reaches: " + str(len(all_bands)) + "/4 bands - full coverage")
print("")
smoke_kills = 0
for m in MUTANTS:
    if run_test("smoke", m) == 0:
        smoke_kills = smoke_kills + 1
print("the `smoke` test reaches " + str(lines_touched("smoke")) + "/4 bands and kills " + str(smoke_kills) + " mutants")
print("...it is the highest-coverage test in the suite and the weakest one.")
print("")
print("the surviving mutant moves the low/mid boundary from 10 to 9.")
print("  classify(9) correct:  " + classify(9, "none"))
print("  classify(9) mutated:  " + classify(9, "boundary"))
print("  classify(5), both:    " + classify(5, "none") + " / " + classify(5, "boundary"))
with_boundary = 0
MS = ["boundary", "sign", "band"]
for m in MS:
    any_kill = 0
    for t in SUITE:
        if run_test(t, m) == 0:
            any_kill = 1
    if run_test("boundary-9", m) == 0:
        any_kill = 1
    if any_kill == 1:
        with_boundary = with_boundary + 1
print("adding ONE test at the boundary raises the score to: " + str(int(with_boundary * 100 / len(MS))) + "%")
print("  and it adds " + str(0) + " bands of coverage, because 9 is in a band already reached.")
passed = 0
checked = 0
checked = checked + 1
if len(all_bands) == 4:
    passed = passed + 1
checked = checked + 1
if survivors > 0:
    passed = passed + 1
checked = checked + 1
if lines_touched("smoke") == 4 and smoke_kills == 0:
    passed = passed + 1
checked = checked + 1
if run_test("boundary-9", "boundary") == 0:
    passed = passed + 1
checked = checked + 1
if with_boundary == len(MS) and lines_touched("boundary-9") == 1:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The test that runs the most lines is the one that checks the least."
else:
    verdict = "FAILED - the suite did not behave as the checks describe."
print(verdict)
print("")
n1 = "Coverage answers a question about the suite's REACH and gets used as an"
print(n1)
n2 = "answer about its POWER. The two come apart in both directions: a test can"
print(n2)
n3 = "run everything and check nothing, and the test that closes a real gap can"
print(n3)
n4 = "add no coverage at all, because a boundary lives inside a band that was"
print(n4)
n5 = "already visited."
print(n5)
```

## stdout (executed)

```text
mutant     killed by
boundary   -- SURVIVED --
sign       negative
band       happy-mid

mutants: 3, survivors: 1
mutation score: 66%

bands reached, per test (the coverage view):
  happy-low    1/4 bands
  happy-mid    1/4 bands
  happy-high   1/4 bands
  negative     1/4 bands
  smoke        4/4 bands
the suite as a whole reaches: 4/4 bands - full coverage

the `smoke` test reaches 4/4 bands and kills 0 mutants
...it is the highest-coverage test in the suite and the weakest one.

the surviving mutant moves the low/mid boundary from 10 to 9.
  classify(9) correct:  low
  classify(9) mutated:  mid
  classify(5), both:    low / low
adding ONE test at the boundary raises the score to: 100%
  and it adds 0 bands of coverage, because 9 is in a band already reached.

checks passed: 5/5
The test that runs the most lines is the one that checks the least.

Coverage answers a question about the suite's REACH and gets used as an
answer about its POWER. The two come apart in both directions: a test can
run everything and check nothing, and the test that closes a real gap can
add no coverage at all, because a boundary lives inside a band that was
already visited.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
