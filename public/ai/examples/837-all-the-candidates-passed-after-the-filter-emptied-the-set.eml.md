<!-- canonical: efficientnewlanguage.org/ai/examples/837-all-the-candidates-passed-after-the-filter-emptied-the-set | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 837 — All the candidates passed after the filter emptied the set

`all_the_candidates_passed_after_the_filter_emptied_the_set.eml` - Every candidate release passed the safety gate this quarter, and each gate check is real. How many candidates reached the gate is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every candidate
# release passed the safety gate this quarter, and each gate check is real. How
# many candidates reached the gate is computed below.
#
# The gate is careful. It runs the full safety suite, not a subset; a single
# failing candidate blocks the release; it runs on every candidate that reaches
# it; and the pass rate is on a dashboard the release team reads.
#
# An upstream filter, added to skip candidates without a signed manifest, matched
# the manifest field by a name that changed, so it forwarded no candidates.

90 => candidates_built_this_quarter
0 => candidates_that_reached_the_gate
0 => candidates_the_gate_failed
100 => reported_gate_pass_per_hundred
90 => candidates_that_shipped_ungated

candidates_built_this_quarter - candidates_that_reached_the_gate => candidates_the_filter_dropped
int(candidates_that_shipped_ungated * 10000 / candidates_built_this_quarter) => ungated_share_per_myriad

"candidates built                : " + str(candidates_built_this_quarter) ^0
"  reached the gate              : " + str(candidates_that_reached_the_gate) ^0
"  dropped by the filter         : " + str(candidates_the_filter_dropped) ^0
"gate failures                   : " + str(candidates_the_gate_failed) ^0
"reported gate pass              : " + str(reported_gate_pass_per_hundred) + " per hundred" ^0
"candidates that shipped ungated : " + str(candidates_that_shipped_ungated) ^0
"ungated share                   : " + str(ungated_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the gate verified ----

"the safety gate" ^0
"  runs : the full safety suite, not a subset" ^0
"  a failing candidate : blocks the release" ^0
"  over : every candidate that reaches it" ^0
"  pass rate : on the release dashboard" ^0
"  candidates it failed : " + str(candidates_the_gate_failed) ^0
"  verdict : 100 PER HUNDRED PASSED" ^0
"" ^0
"  running the full suite and blocking on one failure is" ^0
"  the part done right here, and it is why a real unsafe" ^0
"  candidate at the gate would be stopped" ^0
"" ^0

# ---- what reached the gate ----

"the candidates the gate saw" ^0
"  forwarded by the upstream filter : " ^0
"    " + str(candidates_that_reached_the_gate) ^0
"  a pass rate over zero candidates : 100 per hundred," ^0
"    trivially" ^0
"  what 'all passed' means here : the gate ran on nothing" ^0
"  what it does not mean : that the releases were checked" ^0
"  candidates that shipped without a gate : " ^0
"    " + str(candidates_that_shipped_ungated) ^0
"" ^0

# ---- why the set was empty ----

"the upstream filter" ^0
"  intent : forward candidates with a signed manifest" ^0
"  what it matched : the manifest field by a name that an" ^0
"    earlier change renamed" ^0
"  so candidates forwarded : " + str(candidates_that_reached_the_gate) ^0
"  did the gate notice its input dried up : no; a pass" ^0
"    rate does not watch its own denominator" ^0
"  is the 100 per hundred false : no; it is vacuously true" ^0
"" ^0

# ---- null control ----

# The same quarter, with the gate asserting that its input count matches the
# build count and refusing to report a pass rate over an empty input.
100 => nc_pass_rate_over_empty
0 => nc_pass_rate_when_empty_is_an_error
90 => nc_candidates_a_count_check_would_flag

"null control - assert input count equals build count" ^0
"  pass rate over empty input : " + str(nc_pass_rate_over_empty) ^0
"  pass rate when empty is an error : " ^0
"    " + str(nc_pass_rate_when_empty_is_an_error) ^0
"  candidates a count check would flag as ungated : " ^0
"    " + str(nc_candidates_a_count_check_would_flag) ^0
"  no candidate and no check changed; an empty input" ^0
"  stopped reading as a quarter of clean passes" ^0
"" ^0

# ---- the rule ----

"what a 100 per hundred gate pass guarantees" ^0
"  every candidate that reached the gate passed : exactly," ^0
"    full suite, blocking on a failure" ^0
"  the releases were checked : not addressed; an upstream" ^0
"    filter forwarded no candidates, and 'all of none" ^0
"    passed' is vacuously true - " + str(candidates_that_shipped_ungated) + " candidates shipped" ^0
"    without ever reaching the gate" ^0
"" ^0

"a gate reports on what arrives at it, and 'all passed' is loudest when nothing" ^0
"arrives; a filter that quietly empties the input turns a safety gate into a" ^0
"green light that guarded nothing" ^0
"" ^0

"It runs the full suite and blocks on any failure over every candidate it sees -" ^0
"a true 100 per hundred. The upstream filter forwarded " + str(candidates_that_reached_the_gate) + ", so the pass rate is" ^0
"vacuous and " + str(candidates_that_shipped_ungated) + " candidates shipped ungated, " + str(ungated_share_per_myriad) + " per ten thousand of the build." ^0
```

## Python (deterministic transpilation)

```python
candidates_built_this_quarter = 90
candidates_that_reached_the_gate = 0
candidates_the_gate_failed = 0
reported_gate_pass_per_hundred = 100
candidates_that_shipped_ungated = 90
candidates_the_filter_dropped = candidates_built_this_quarter - candidates_that_reached_the_gate
ungated_share_per_myriad = int(candidates_that_shipped_ungated * 10000 / candidates_built_this_quarter)
print("candidates built                : " + str(candidates_built_this_quarter))
print("  reached the gate              : " + str(candidates_that_reached_the_gate))
print("  dropped by the filter         : " + str(candidates_the_filter_dropped))
print("gate failures                   : " + str(candidates_the_gate_failed))
print("reported gate pass              : " + str(reported_gate_pass_per_hundred) + " per hundred")
print("candidates that shipped ungated : " + str(candidates_that_shipped_ungated))
print("ungated share                   : " + str(ungated_share_per_myriad) + " per ten thousand")
print("")
print("the safety gate")
print("  runs : the full safety suite, not a subset")
print("  a failing candidate : blocks the release")
print("  over : every candidate that reaches it")
print("  pass rate : on the release dashboard")
print("  candidates it failed : " + str(candidates_the_gate_failed))
print("  verdict : 100 PER HUNDRED PASSED")
print("")
print("  running the full suite and blocking on one failure is")
print("  the part done right here, and it is why a real unsafe")
print("  candidate at the gate would be stopped")
print("")
print("the candidates the gate saw")
print("  forwarded by the upstream filter : ")
print("    " + str(candidates_that_reached_the_gate))
print("  a pass rate over zero candidates : 100 per hundred,")
print("    trivially")
print("  what 'all passed' means here : the gate ran on nothing")
print("  what it does not mean : that the releases were checked")
print("  candidates that shipped without a gate : ")
print("    " + str(candidates_that_shipped_ungated))
print("")
print("the upstream filter")
print("  intent : forward candidates with a signed manifest")
print("  what it matched : the manifest field by a name that an")
print("    earlier change renamed")
print("  so candidates forwarded : " + str(candidates_that_reached_the_gate))
print("  did the gate notice its input dried up : no; a pass")
print("    rate does not watch its own denominator")
print("  is the 100 per hundred false : no; it is vacuously true")
print("")
nc_pass_rate_over_empty = 100
nc_pass_rate_when_empty_is_an_error = 0
nc_candidates_a_count_check_would_flag = 90
print("null control - assert input count equals build count")
print("  pass rate over empty input : " + str(nc_pass_rate_over_empty))
print("  pass rate when empty is an error : ")
print("    " + str(nc_pass_rate_when_empty_is_an_error))
print("  candidates a count check would flag as ungated : ")
print("    " + str(nc_candidates_a_count_check_would_flag))
print("  no candidate and no check changed; an empty input")
print("  stopped reading as a quarter of clean passes")
print("")
print("what a 100 per hundred gate pass guarantees")
print("  every candidate that reached the gate passed : exactly,")
print("    full suite, blocking on a failure")
print("  the releases were checked : not addressed; an upstream")
print("    filter forwarded no candidates, and 'all of none")
print("    passed' is vacuously true - " + str(candidates_that_shipped_ungated) + " candidates shipped")
print("    without ever reaching the gate")
print("")
print("a gate reports on what arrives at it, and 'all passed' is loudest when nothing")
print("arrives; a filter that quietly empties the input turns a safety gate into a")
print("green light that guarded nothing")
print("")
print("It runs the full suite and blocks on any failure over every candidate it sees -")
print("a true 100 per hundred. The upstream filter forwarded " + str(candidates_that_reached_the_gate) + ", so the pass rate is")
print("vacuous and " + str(candidates_that_shipped_ungated) + " candidates shipped ungated, " + str(ungated_share_per_myriad) + " per ten thousand of the build.")
```

## stdout (executed)

```text
candidates built                : 90
  reached the gate              : 0
  dropped by the filter         : 90
gate failures                   : 0
reported gate pass              : 100 per hundred
candidates that shipped ungated : 90
ungated share                   : 10000 per ten thousand

the safety gate
  runs : the full safety suite, not a subset
  a failing candidate : blocks the release
  over : every candidate that reaches it
  pass rate : on the release dashboard
  candidates it failed : 0
  verdict : 100 PER HUNDRED PASSED

  running the full suite and blocking on one failure is
  the part done right here, and it is why a real unsafe
  candidate at the gate would be stopped

the candidates the gate saw
  forwarded by the upstream filter : 
    0
  a pass rate over zero candidates : 100 per hundred,
    trivially
  what 'all passed' means here : the gate ran on nothing
  what it does not mean : that the releases were checked
  candidates that shipped without a gate : 
    90

the upstream filter
  intent : forward candidates with a signed manifest
  what it matched : the manifest field by a name that an
    earlier change renamed
  so candidates forwarded : 0
  did the gate notice its input dried up : no; a pass
    rate does not watch its own denominator
  is the 100 per hundred false : no; it is vacuously true

null control - assert input count equals build count
  pass rate over empty input : 100
  pass rate when empty is an error : 
    0
  candidates a count check would flag as ungated : 
    90
  no candidate and no check changed; an empty input
  stopped reading as a quarter of clean passes

what a 100 per hundred gate pass guarantees
  every candidate that reached the gate passed : exactly,
    full suite, blocking on a failure
  the releases were checked : not addressed; an upstream
    filter forwarded no candidates, and 'all of none
    passed' is vacuously true - 90 candidates shipped
    without ever reaching the gate

a gate reports on what arrives at it, and 'all passed' is loudest when nothing
arrives; a filter that quietly empties the input turns a safety gate into a
green light that guarded nothing

It runs the full suite and blocks on any failure over every candidate it sees -
a true 100 per hundred. The upstream filter forwarded 0, so the pass rate is
vacuous and 90 candidates shipped ungated, 10000 per ten thousand of the build.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
