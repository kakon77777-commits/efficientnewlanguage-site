<!-- canonical: efficientnewlanguage.org/ai/examples/499-the-fix-made-the-next-bottleneck-the-unknown-one | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 499 — The fix made the next bottleneck the unknown one

`the_fix_made_the_next_bottleneck_the_unknown_one.eml` - The slowest stage was made four times faster. What that did to the pipeline, which stage is the constraint now, and how well that one is understood are all computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The slowest stage
# was made four times faster. What that did to the pipeline, which stage is the
# constraint now, and how well that one is understood are all computed below.
#
# Optimising the slowest stage is correct and is where the gain was. It was
# measured, it was the largest single cost, the speedup is real and it did not
# break anything. Anybody would have picked that stage.
#
# A pipeline's throughput is set by its slowest stage, so a big speedup there
# moves the constraint somewhere else. Where it moves is decided by the
# remaining stages, and how well the new constraint is understood is decided by
# how long it has been ignored - which is exactly as long as it was not the
# bottleneck.
#
# Both the timings and the operational knowledge are computed per stage.

# [stage, ms before, ms after, people who have debugged it, runbook pages, last touched in months]
[["parse", 400, 100, 6, 4, 1], ["enrich", 120, 120, 2, 0, 19], ["validate", 90, 90, 5, 3, 2], ["persist", 110, 110, 1, 0, 31], ["publish", 60, 60, 4, 2, 4]] => stages

len(stages) => n
0 => before_total
0 => after_total
for s in stages:
    before_total + s[1] => before_total
    after_total + s[2] => after_total

"stage      before   after   people who know it   runbook pages   months since touched" ^0
for s in stages:
    "  " + s[0] + "   " + str(s[1]) + "ms    " + str(s[2]) + "ms    " + str(s[3]) + "                    " + str(s[4]) + "               " + str(s[5]) ^0
"" ^0
"pipeline total : " + str(before_total) + "ms -> " + str(after_total) + "ms" ^0
"  improvement : " + str(int((before_total - after_total) * 100 / before_total)) + "%" ^0
"" ^0

# ---- which stage is the constraint, before and after ----

0 => was
"" => was_name
0 => now
"" => now_name
for s in stages:
    if s[1] > was:
        s[1] => was
        s[0] => was_name
    if s[2] > now:
        s[2] => now
        s[0] => now_name
"the slowest stage" ^0
"  before : " + was_name + " at " + str(was) + "ms" ^0
"  after  : " + now_name + " at " + str(now) + "ms" ^0
if not (was_name == now_name):
    "  the constraint moved" ^0
"" ^0

# ---- what is known about each ----

for s in stages:
    if s[0] == was_name:
        "the old constraint, " + s[0] ^0
        "  people who have debugged it : " + str(s[3]) ^0
        "  runbook pages               : " + str(s[4]) ^0
        "  months since anyone touched it : " + str(s[5]) ^0
for s in stages:
    if s[0] == now_name:
        "the new constraint, " + s[0] ^0
        "  people who have debugged it : " + str(s[3]) ^0
        "  runbook pages               : " + str(s[4]) ^0
        "  months since anyone touched it : " + str(s[5]) ^0
"" ^0

0 => old_know
0 => new_know
for s in stages:
    if s[0] == was_name:
        s[3] => old_know
    if s[0] == now_name:
        s[3] => new_know
if old_know > new_know:
    "  the pipeline's constraint is now a stage " + str(old_know - new_know) + " fewer people have opened" ^0
"" ^0

# ---- the correlation is not a coincidence ----

"attention against being the bottleneck" ^0
for s in stages:
    "" => role
    if s[1] >= 120:
        "was slow" => role
    else:
        "was fast" => role
    "  " + s[0] + " : " + role + ", " + str(s[3]) + " people, touched " + str(s[5]) + " months ago" ^0
"  a stage gets looked at when it is slow, so the stages nobody has looked" ^0
"  at are exactly the ones that were never the constraint" ^0
"" ^0

# ---- what the next speedup would cost ----

"optimising the new constraint" ^0
for s in stages:
    if s[0] == now_name:
        "  the same 4x on " + s[0] + " : " + str(s[2]) + "ms -> " + str(int(s[2] / 4)) + "ms" ^0
        after_total - s[2] + int(s[2] / 4) => next_total
        "  pipeline : " + str(after_total) + "ms -> " + str(next_total) + "ms, " + str(int((after_total - next_total) * 100 / after_total)) + "%" ^0
        "  people available to do it : " + str(s[3]) ^0
        "  runbook to start from     : " + str(s[4]) + " pages" ^0
"" ^0

# ---- what a flat pipeline means for the next win ----

0 => spread
0 => smallest
for s in stages:
    if smallest == 0:
        s[2] => smallest
    if s[2] < smallest:
        s[2] => smallest
now - smallest => spread
0 => smallest_before
for s in stages:
    if smallest_before == 0:
        s[1] => smallest_before
    if s[1] < smallest_before:
        s[1] => smallest_before
was - smallest_before => spread_before
"after the fix the stages span " + str(smallest) + "ms to " + str(now) + "ms, a spread of " + str(spread) + "ms" ^0
"  before, the spread was " + str(spread_before) + "ms" ^0
if spread < spread_before:
    "  the pipeline is flatter, so the next single-stage win is smaller, and" ^0
    "  a flat pipeline is a success rather than a problem" ^0
"" ^0

# ---- the control: a pipeline with one dominant stage ----
#
# Where one stage is most of the time by a wide margin, speeding it up leaves
# it the constraint and nothing moves.

[["a", 900, 700], ["b", 40, 40], ["c", 30, 30]] => lopsided
0 => l_was
0 => l_now
for s in lopsided:
    if s[1] > l_was:
        s[1] => l_was
    if s[2] > l_now:
        s[2] => l_now
"control - a pipeline where one stage is 90% of the time" ^0
"  slowest before : " + str(l_was) + "ms, after a 22% cut : " + str(l_now) + "ms" ^0
"  the constraint stays where it was, so the team keeps working on the stage" ^0
"  it already understands" ^0
"" ^0

"Optimising the measured slowest stage is where the gain was and the speedup" ^0
"is real. Throughput is set by whichever stage is slowest now, and how well" ^0
"that one is understood is a record of how long it was not." ^0
```

## Python (deterministic transpilation)

```python
stages = [["parse", 400, 100, 6, 4, 1], ["enrich", 120, 120, 2, 0, 19], ["validate", 90, 90, 5, 3, 2], ["persist", 110, 110, 1, 0, 31], ["publish", 60, 60, 4, 2, 4]]
n = len(stages)
before_total = 0
after_total = 0
for s in stages:
    before_total = before_total + s[1]
    after_total = after_total + s[2]
print("stage      before   after   people who know it   runbook pages   months since touched")
for s in stages:
    print("  " + s[0] + "   " + str(s[1]) + "ms    " + str(s[2]) + "ms    " + str(s[3]) + "                    " + str(s[4]) + "               " + str(s[5]))
print("")
print("pipeline total : " + str(before_total) + "ms -> " + str(after_total) + "ms")
print("  improvement : " + str(int((before_total - after_total) * 100 / before_total)) + "%")
print("")
was = 0
was_name = ""
now = 0
now_name = ""
for s in stages:
    if s[1] > was:
        was = s[1]
        was_name = s[0]
    if s[2] > now:
        now = s[2]
        now_name = s[0]
print("the slowest stage")
print("  before : " + was_name + " at " + str(was) + "ms")
print("  after  : " + now_name + " at " + str(now) + "ms")
if not was_name == now_name:
    print("  the constraint moved")
print("")
for s in stages:
    if s[0] == was_name:
        print("the old constraint, " + s[0])
        print("  people who have debugged it : " + str(s[3]))
        print("  runbook pages               : " + str(s[4]))
        print("  months since anyone touched it : " + str(s[5]))
for s in stages:
    if s[0] == now_name:
        print("the new constraint, " + s[0])
        print("  people who have debugged it : " + str(s[3]))
        print("  runbook pages               : " + str(s[4]))
        print("  months since anyone touched it : " + str(s[5]))
print("")
old_know = 0
new_know = 0
for s in stages:
    if s[0] == was_name:
        old_know = s[3]
    if s[0] == now_name:
        new_know = s[3]
if old_know > new_know:
    print("  the pipeline's constraint is now a stage " + str(old_know - new_know) + " fewer people have opened")
print("")
print("attention against being the bottleneck")
for s in stages:
    role = ""
    if s[1] >= 120:
        role = "was slow"
    else:
        role = "was fast"
    print("  " + s[0] + " : " + role + ", " + str(s[3]) + " people, touched " + str(s[5]) + " months ago")
print("  a stage gets looked at when it is slow, so the stages nobody has looked")
print("  at are exactly the ones that were never the constraint")
print("")
print("optimising the new constraint")
for s in stages:
    if s[0] == now_name:
        print("  the same 4x on " + s[0] + " : " + str(s[2]) + "ms -> " + str(int(s[2] / 4)) + "ms")
        next_total = after_total - s[2] + int(s[2] / 4)
        print("  pipeline : " + str(after_total) + "ms -> " + str(next_total) + "ms, " + str(int((after_total - next_total) * 100 / after_total)) + "%")
        print("  people available to do it : " + str(s[3]))
        print("  runbook to start from     : " + str(s[4]) + " pages")
print("")
spread = 0
smallest = 0
for s in stages:
    if smallest == 0:
        smallest = s[2]
    if s[2] < smallest:
        smallest = s[2]
spread = now - smallest
smallest_before = 0
for s in stages:
    if smallest_before == 0:
        smallest_before = s[1]
    if s[1] < smallest_before:
        smallest_before = s[1]
spread_before = was - smallest_before
print("after the fix the stages span " + str(smallest) + "ms to " + str(now) + "ms, a spread of " + str(spread) + "ms")
print("  before, the spread was " + str(spread_before) + "ms")
if spread < spread_before:
    print("  the pipeline is flatter, so the next single-stage win is smaller, and")
    print("  a flat pipeline is a success rather than a problem")
print("")
lopsided = [["a", 900, 700], ["b", 40, 40], ["c", 30, 30]]
l_was = 0
l_now = 0
for s in lopsided:
    if s[1] > l_was:
        l_was = s[1]
    if s[2] > l_now:
        l_now = s[2]
print("control - a pipeline where one stage is 90% of the time")
print("  slowest before : " + str(l_was) + "ms, after a 22% cut : " + str(l_now) + "ms")
print("  the constraint stays where it was, so the team keeps working on the stage")
print("  it already understands")
print("")
print("Optimising the measured slowest stage is where the gain was and the speedup")
print("is real. Throughput is set by whichever stage is slowest now, and how well")
print("that one is understood is a record of how long it was not.")
```

## stdout (executed)

```text
stage      before   after   people who know it   runbook pages   months since touched
  parse   400ms    100ms    6                    4               1
  enrich   120ms    120ms    2                    0               19
  validate   90ms    90ms    5                    3               2
  persist   110ms    110ms    1                    0               31
  publish   60ms    60ms    4                    2               4

pipeline total : 780ms -> 480ms
  improvement : 38%

the slowest stage
  before : parse at 400ms
  after  : enrich at 120ms
  the constraint moved

the old constraint, parse
  people who have debugged it : 6
  runbook pages               : 4
  months since anyone touched it : 1
the new constraint, enrich
  people who have debugged it : 2
  runbook pages               : 0
  months since anyone touched it : 19

  the pipeline's constraint is now a stage 4 fewer people have opened

attention against being the bottleneck
  parse : was slow, 6 people, touched 1 months ago
  enrich : was slow, 2 people, touched 19 months ago
  validate : was fast, 5 people, touched 2 months ago
  persist : was fast, 1 people, touched 31 months ago
  publish : was fast, 4 people, touched 4 months ago
  a stage gets looked at when it is slow, so the stages nobody has looked
  at are exactly the ones that were never the constraint

optimising the new constraint
  the same 4x on enrich : 120ms -> 30ms
  pipeline : 480ms -> 390ms, 18%
  people available to do it : 2
  runbook to start from     : 0 pages

after the fix the stages span 60ms to 120ms, a spread of 60ms
  before, the spread was 340ms
  the pipeline is flatter, so the next single-stage win is smaller, and
  a flat pipeline is a success rather than a problem

control - a pipeline where one stage is 90% of the time
  slowest before : 900ms, after a 22% cut : 700ms
  the constraint stays where it was, so the team keeps working on the stage
  it already understands

Optimising the measured slowest stage is where the gain was and the speedup
is real. Throughput is set by whichever stage is slowest now, and how well
that one is understood is a record of how long it was not.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
