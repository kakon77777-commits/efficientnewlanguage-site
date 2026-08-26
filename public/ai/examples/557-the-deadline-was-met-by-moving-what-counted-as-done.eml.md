<!-- canonical: efficientnewlanguage.org/ai/examples/557-the-deadline-was-met-by-moving-what-counted-as-done | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 557 — The deadline was met by moving what counted as done

`the_deadline_was_met_by_moving_what_counted_as_done.eml` - 120 features were committed for the quarter. The quarter closed at 79 percent complete. What 79 percent counted is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). 120 features were
# committed for the quarter. The quarter closed at 79 percent complete. What
# 79 percent counted is computed below.
#
# The definition of done was narrowed on purpose, in a meeting, with the reason
# minuted, and the reason was a good one. Documentation was being written for
# features that later changed, so it was written twice. Deployment was gated on
# a release train that ran fortnightly, so a feature finished on a Monday sat
# unfinished for eleven days through no fault of the team. Counting those as
# incomplete made the burndown measure the release train instead of the work.
# Narrowing "done" to "merged" made the chart measure what the team controlled.
#
# Every number the burndown reported was correct on the day it was drawn. The
# early numbers counted four stages and the later ones counted one. Nothing was
# restated, because each was accurate under the definition in force.
#
# A percentage is a ratio of two counts. Changing what the numerator counts,
# while the denominator and the label stay put, moves the percentage without
# moving anything it describes.

120 => committed

# [stage, features that reached it]
[["merged", 95], ["tested", 68], ["documented", 51], ["deployed", 47]] => stages

"committed for the quarter: " + str(committed) + " features" ^0
"" ^0

"stage         reached   percent of commitment" ^0
0 => narrowest
for s in stages:
    int(s[1] * 100 / committed) => pct
    "  " + s[0] + "        " + str(s[1]) + "        " + str(pct) + " pct" ^0
    s[1] => narrowest
"" ^0

95 => done_new
narrowest => done_old

"done under the definition in force at close  : " + str(done_new) + " of " + str(committed) + " = " + str(int(done_new * 100 / committed)) + " pct" ^0
"done under the definition in force at start  : " + str(done_old) + " of " + str(committed) + " = " + str(int(done_old * 100 / committed)) + " pct" ^0
"the same quarter, the same work, two true numbers" ^0
"" ^0

# ---- what moved between the two numbers ----

done_new - done_old => carried

"features counted done that still owe work: " + str(carried) ^0
"" ^0
"stage still owed by those " + str(carried) + " features" ^0
for s in stages:
    if s[1] < done_new:
        "  " + s[0] + ": " + str(done_new - s[1]) + " features have not reached it" ^0
"" ^0
"  the work did not disappear; it left the denominator of this quarter" ^0
"  and entered the next quarter without appearing in its commitment" ^0
"" ^0

# ---- next quarter's arithmetic ----
#
# The next quarter commits 120 more, and starts with the carried work already
# owed. Its own burndown will use the narrowed definition too.

120 => next_committed
next_committed + carried => next_real_load

"next quarter" ^0
"  new features committed     : " + str(next_committed) ^0
"  carried, not in the commitment: " + str(carried) ^0
"  actual work in the quarter : " + str(next_real_load) ^0
"  the commitment is " + str(int(next_committed * 100 / next_real_load)) + " pct of the work" ^0
"  a team hitting 100 pct of that commitment finishes " + str(int(next_committed * 100 / next_real_load)) + " pct of the quarter" ^0
"" ^0

# ---- the control ----
#
# Stage counts are raw tallies that no definition can touch, so they are the
# one place the redefinition cannot reach. They say something the reported
# percentage cannot: merged went up and every stage behind it went down. That
# is a pipeline filling faster than it drains, which is a real condition and
# the opposite of the one the chart implied.

[["merged", 88], ["tested", 71], ["documented", 55], ["deployed", 52]] => previous_quarter

"control - raw stage counts, which no definition can move" ^0
"stage         previous   this quarter   change" ^0
0 => stages_down
for s in stages:
    for p in previous_quarter:
        if p[0] == s[0]:
            "  " + s[0] + "        " + str(p[1]) + "         " + str(s[1]) + "          " + str(s[1] - p[1]) ^0
            if s[1] < p[1]:
                stages_down + 1 => stages_down
"  stages that went down: " + str(stages_down) + " of 4" ^0
"  merged rose; the three stages behind it all fell" ^0
"  that is the signature of a pipeline filling faster than it drains" ^0
"" ^0

# ---- the null control ----
#
# Apply each definition to BOTH quarters. Held constant, either definition
# gives an honest comparison - and the two honest comparisons point in opposite
# directions, because they measure opposite ends of the same pipeline. Neither
# is the number that was reported. The narrowing is not wrong; comparing across
# it is.

"null control - both quarters under the same narrowed definition" ^0
0 => prev_merged
for p in previous_quarter:
    if p[0] == "merged":
        p[1] => prev_merged
"  previous quarter, narrow definition : " + str(prev_merged) + " of " + str(committed) + " = " + str(int(prev_merged * 100 / committed)) + " pct" ^0
"  this quarter, narrow definition     : " + str(done_new) + " of " + str(committed) + " = " + str(int(done_new * 100 / committed)) + " pct" ^0
"  difference                          : " + str(int(done_new * 100 / committed) - int(prev_merged * 100 / committed)) + " points" ^0
"" ^0
0 => prev_deployed
for p in previous_quarter:
    if p[0] == "deployed":
        p[1] => prev_deployed
"  previous quarter, wide definition   : " + str(prev_deployed) + " of " + str(committed) + " = " + str(int(prev_deployed * 100 / committed)) + " pct" ^0
"  this quarter, wide definition       : " + str(done_old) + " of " + str(committed) + " = " + str(int(done_old * 100 / committed)) + " pct" ^0
"  difference                          : " + str(int(done_old * 100 / committed) - int(prev_deployed * 100 / committed)) + " points" ^0
"" ^0
"  held to the narrow definition the quarter improved, and that is real:" ^0
"  the team merged more than it merged last quarter" ^0
"  held to the wide definition the quarter declined, and that is real too" ^0
"  the front of the pipeline sped up while the back of it fell behind" ^0
"  the narrowed definition reports the front and is silent on the back" ^0
"  the reported jump was neither of these: it compared a wide 43 to a narrow 79" ^0
"" ^0

# ---- the rule ----

"what a redefinition does to a time series" ^0
"  the new points are correct" ^0
"  the old points are correct" ^0
"  every comparison that spans the change is not" ^0
"  and nothing in the chart marks where the change is" ^0
"" ^0
"a restatement is the expensive, visible, honest option" ^0
"the cheap option is to leave both halves standing and let the reader join them" ^0
"" ^0

"Narrowing done to merged made the burndown measure the team instead of the" ^0
"release train, which is what a burndown is for, and the reason was minuted." ^0
"The quarter closed at " + str(int(done_new * 100 / committed)) + " pct. Under the definition it opened with it closed at" ^0
str(int(done_old * 100 / committed)) + " pct, three of four stage counts fell against the previous quarter, and" ^0
str(carried) + " features entered the next quarter owing work that no commitment counts." ^0
```

## Python (deterministic transpilation)

```python
committed = 120
stages = [["merged", 95], ["tested", 68], ["documented", 51], ["deployed", 47]]
print("committed for the quarter: " + str(committed) + " features")
print("")
print("stage         reached   percent of commitment")
narrowest = 0
for s in stages:
    pct = int(s[1] * 100 / committed)
    print("  " + s[0] + "        " + str(s[1]) + "        " + str(pct) + " pct")
    narrowest = s[1]
print("")
done_new = 95
done_old = narrowest
print("done under the definition in force at close  : " + str(done_new) + " of " + str(committed) + " = " + str(int(done_new * 100 / committed)) + " pct")
print("done under the definition in force at start  : " + str(done_old) + " of " + str(committed) + " = " + str(int(done_old * 100 / committed)) + " pct")
print("the same quarter, the same work, two true numbers")
print("")
carried = done_new - done_old
print("features counted done that still owe work: " + str(carried))
print("")
print("stage still owed by those " + str(carried) + " features")
for s in stages:
    if s[1] < done_new:
        print("  " + s[0] + ": " + str(done_new - s[1]) + " features have not reached it")
print("")
print("  the work did not disappear; it left the denominator of this quarter")
print("  and entered the next quarter without appearing in its commitment")
print("")
next_committed = 120
next_real_load = next_committed + carried
print("next quarter")
print("  new features committed     : " + str(next_committed))
print("  carried, not in the commitment: " + str(carried))
print("  actual work in the quarter : " + str(next_real_load))
print("  the commitment is " + str(int(next_committed * 100 / next_real_load)) + " pct of the work")
print("  a team hitting 100 pct of that commitment finishes " + str(int(next_committed * 100 / next_real_load)) + " pct of the quarter")
print("")
previous_quarter = [["merged", 88], ["tested", 71], ["documented", 55], ["deployed", 52]]
print("control - raw stage counts, which no definition can move")
print("stage         previous   this quarter   change")
stages_down = 0
for s in stages:
    for p in previous_quarter:
        if p[0] == s[0]:
            print("  " + s[0] + "        " + str(p[1]) + "         " + str(s[1]) + "          " + str(s[1] - p[1]))
            if s[1] < p[1]:
                stages_down = stages_down + 1
print("  stages that went down: " + str(stages_down) + " of 4")
print("  merged rose; the three stages behind it all fell")
print("  that is the signature of a pipeline filling faster than it drains")
print("")
print("null control - both quarters under the same narrowed definition")
prev_merged = 0
for p in previous_quarter:
    if p[0] == "merged":
        prev_merged = p[1]
print("  previous quarter, narrow definition : " + str(prev_merged) + " of " + str(committed) + " = " + str(int(prev_merged * 100 / committed)) + " pct")
print("  this quarter, narrow definition     : " + str(done_new) + " of " + str(committed) + " = " + str(int(done_new * 100 / committed)) + " pct")
print("  difference                          : " + str(int(done_new * 100 / committed) - int(prev_merged * 100 / committed)) + " points")
print("")
prev_deployed = 0
for p in previous_quarter:
    if p[0] == "deployed":
        prev_deployed = p[1]
print("  previous quarter, wide definition   : " + str(prev_deployed) + " of " + str(committed) + " = " + str(int(prev_deployed * 100 / committed)) + " pct")
print("  this quarter, wide definition       : " + str(done_old) + " of " + str(committed) + " = " + str(int(done_old * 100 / committed)) + " pct")
print("  difference                          : " + str(int(done_old * 100 / committed) - int(prev_deployed * 100 / committed)) + " points")
print("")
print("  held to the narrow definition the quarter improved, and that is real:")
print("  the team merged more than it merged last quarter")
print("  held to the wide definition the quarter declined, and that is real too")
print("  the front of the pipeline sped up while the back of it fell behind")
print("  the narrowed definition reports the front and is silent on the back")
print("  the reported jump was neither of these: it compared a wide 43 to a narrow 79")
print("")
print("what a redefinition does to a time series")
print("  the new points are correct")
print("  the old points are correct")
print("  every comparison that spans the change is not")
print("  and nothing in the chart marks where the change is")
print("")
print("a restatement is the expensive, visible, honest option")
print("the cheap option is to leave both halves standing and let the reader join them")
print("")
print("Narrowing done to merged made the burndown measure the team instead of the")
print("release train, which is what a burndown is for, and the reason was minuted.")
print("The quarter closed at " + str(int(done_new * 100 / committed)) + " pct. Under the definition it opened with it closed at")
print(str(int(done_old * 100 / committed)) + " pct, three of four stage counts fell against the previous quarter, and")
print(str(carried) + " features entered the next quarter owing work that no commitment counts.")
```

## stdout (executed)

```text
committed for the quarter: 120 features

stage         reached   percent of commitment
  merged        95        79 pct
  tested        68        56 pct
  documented        51        42 pct
  deployed        47        39 pct

done under the definition in force at close  : 95 of 120 = 79 pct
done under the definition in force at start  : 47 of 120 = 39 pct
the same quarter, the same work, two true numbers

features counted done that still owe work: 48

stage still owed by those 48 features
  tested: 27 features have not reached it
  documented: 44 features have not reached it
  deployed: 48 features have not reached it

  the work did not disappear; it left the denominator of this quarter
  and entered the next quarter without appearing in its commitment

next quarter
  new features committed     : 120
  carried, not in the commitment: 48
  actual work in the quarter : 168
  the commitment is 71 pct of the work
  a team hitting 100 pct of that commitment finishes 71 pct of the quarter

control - raw stage counts, which no definition can move
stage         previous   this quarter   change
  merged        88         95          7
  tested        71         68          -3
  documented        55         51          -4
  deployed        52         47          -5
  stages that went down: 3 of 4
  merged rose; the three stages behind it all fell
  that is the signature of a pipeline filling faster than it drains

null control - both quarters under the same narrowed definition
  previous quarter, narrow definition : 88 of 120 = 73 pct
  this quarter, narrow definition     : 95 of 120 = 79 pct
  difference                          : 6 points

  previous quarter, wide definition   : 52 of 120 = 43 pct
  this quarter, wide definition       : 47 of 120 = 39 pct
  difference                          : -4 points

  held to the narrow definition the quarter improved, and that is real:
  the team merged more than it merged last quarter
  held to the wide definition the quarter declined, and that is real too
  the front of the pipeline sped up while the back of it fell behind
  the narrowed definition reports the front and is silent on the back
  the reported jump was neither of these: it compared a wide 43 to a narrow 79

what a redefinition does to a time series
  the new points are correct
  the old points are correct
  every comparison that spans the change is not
  and nothing in the chart marks where the change is

a restatement is the expensive, visible, honest option
the cheap option is to leave both halves standing and let the reader join them

Narrowing done to merged made the burndown measure the team instead of the
release train, which is what a burndown is for, and the reason was minuted.
The quarter closed at 79 pct. Under the definition it opened with it closed at
39 pct, three of four stage counts fell against the previous quarter, and
48 features entered the next quarter owing work that no commitment counts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
