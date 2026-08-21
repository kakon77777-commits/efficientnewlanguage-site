<!-- canonical: efficientnewlanguage.org/ai/examples/480-the-fallback-runs-only-when-everything-is-worst | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 480 — The fallback runs only when everything is worst

`the_fallback_runs_only_when_everything_is_worst.eml` - The fallback path has run four times in three years. What conditions it ran under is computed below, and it is not a coincidence.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The fallback path
# has run four times in three years. What conditions it ran under is computed
# below, and it is not a coincidence.
#
# Having a fallback is right and this one is well designed: it degrades rather
# than fails, it needs no operator, and the four times it ran it did what it was
# written to do. Nobody regrets having it.
#
# It runs when the primary is unavailable, which is when the system is already
# degraded. So the fallback's inputs are never the ordinary ones - they are the
# inputs present during an incident, and those are the inputs it has been
# exercised on least, because incidents are rare.
#
# The conditions are recorded per activation.

# [activation, primary down, cache cold, load multiple of normal, dependencies also degraded, succeeded]
[["a1", 1, 1, 3, 1, 1], ["a2", 1, 0, 2, 0, 1], ["a3", 1, 1, 6, 1, 0], ["a4", 1, 1, 4, 2, 0]] => runs

len(runs) => n
36 => months

"fallback activations in " + str(months) + " months : " + str(n) ^0
"" ^0
"run   primary   cache   load   degraded deps   outcome" ^0
0 => succeeded
0 => cold_cache
0 => total_load
0 => worst_load
for r in runs:
    "" => out
    if r[5] == 1:
        out + "worked" => out
        succeeded + 1 => succeeded
    else:
        out + "FAILED" => out
    cold_cache + r[2] => cold_cache
    total_load + r[3] => total_load
    if r[3] > worst_load:
        r[3] => worst_load
    "  " + r[0] + "    down      " + str(r[2]) + "       " + str(r[3]) + "x     " + str(r[4]) + "              " + out ^0
"" ^0
"activations that worked : " + str(succeeded) + " of " + str(n) ^0
"" ^0

# ---- the conditions are not the ordinary ones ----

"conditions during the " + str(n) + " activations" ^0
"  primary unavailable : " + str(n) + " of " + str(n) + ", by definition of the trigger" ^0
"  cache cold          : " + str(cold_cache) + " of " + str(n) ^0
"  average load        : " + str(int(total_load * 10 / n)) + " tenths of normal" ^0
"  worst load          : " + str(worst_load) + "x normal" ^0
"  none of those is the condition anybody tests the fallback under, because" ^0
"  the fallback is tested when things are fine" ^0
"" ^0

# ---- the correlation, stated as a count ----

0 => hard_runs
0 => hard_failures
0 => easy_runs
0 => easy_failures
for r in runs:
    r[2] + r[4] => severity
    if r[3] >= 3:
        severity + 1 => severity
    if severity >= 2:
        hard_runs + 1 => hard_runs
        if r[5] == 0:
            hard_failures + 1 => hard_failures
    else:
        easy_runs + 1 => easy_runs
        if r[5] == 0:
            easy_failures + 1 => easy_failures
"activations split by how bad the conditions were" ^0
"  milder conditions : " + str(easy_runs) + " runs, " + str(easy_failures) + " failed" ^0
"  worse conditions  : " + str(hard_runs) + " runs, " + str(hard_failures) + " failed" ^0
if hard_failures > easy_failures:
    "  every failure is in the worse group, and the worse group is what the" ^0
    "  trigger selects for" ^0
"" ^0

# ---- how often it is exercised, and under what ----

"exercise, by kind" ^0
"  production activations : " + str(n) + " in " + str(months) + " months" ^0
"  test-suite runs        : every build, with the primary mocked as down" ^0
"  what the suite holds constant : warm cache, normal load, healthy deps" ^0
"  so the suite covers the trigger and none of the conditions that come" ^0
"  with it" ^0
"" ^0

# ---- what a drill would add ----
#
# Not "turn the primary off". Turn it off with the cache cold and the load
# raised, which is the combination every real activation has had.

0 => full_combo
for r in runs:
    if r[2] == 1:
        if r[3] >= 3:
            full_combo + 1 => full_combo
"activations with a cold cache AND raised load : " + str(full_combo) + " of " + str(n) ^0
if full_combo > 0:
    "  a drill that reproduces that combination exercises what " + str(full_combo) + " of the " + str(n) ^0
    "  real activations actually met, and the suite has never held it" ^0
"" ^0

# ---- the control: a fallback that runs constantly ----
#
# Where the fallback is on the normal path for some fraction of traffic, it is
# exercised under ordinary conditions and its failures are ordinary bugs.

"control - a read replica used for 30% of reads at all times" ^0
"  activations : continuous" ^0
"  conditions  : the ordinary ones, because it is on the ordinary path" ^0
"  a defect in it is found on a Tuesday rather than during an incident" ^0
"" ^0

"The fallback is well designed and it has done its job. What triggers it also" ^0
"selects the conditions it runs under, so the runs it gets are drawn from the" ^0
"part of the input space it has been exercised on least." ^0
```

## Python (deterministic transpilation)

```python
runs = [["a1", 1, 1, 3, 1, 1], ["a2", 1, 0, 2, 0, 1], ["a3", 1, 1, 6, 1, 0], ["a4", 1, 1, 4, 2, 0]]
n = len(runs)
months = 36
print("fallback activations in " + str(months) + " months : " + str(n))
print("")
print("run   primary   cache   load   degraded deps   outcome")
succeeded = 0
cold_cache = 0
total_load = 0
worst_load = 0
for r in runs:
    out = ""
    if r[5] == 1:
        out = out + "worked"
        succeeded = succeeded + 1
    else:
        out = out + "FAILED"
    cold_cache = cold_cache + r[2]
    total_load = total_load + r[3]
    if r[3] > worst_load:
        worst_load = r[3]
    print("  " + r[0] + "    down      " + str(r[2]) + "       " + str(r[3]) + "x     " + str(r[4]) + "              " + out)
print("")
print("activations that worked : " + str(succeeded) + " of " + str(n))
print("")
print("conditions during the " + str(n) + " activations")
print("  primary unavailable : " + str(n) + " of " + str(n) + ", by definition of the trigger")
print("  cache cold          : " + str(cold_cache) + " of " + str(n))
print("  average load        : " + str(int(total_load * 10 / n)) + " tenths of normal")
print("  worst load          : " + str(worst_load) + "x normal")
print("  none of those is the condition anybody tests the fallback under, because")
print("  the fallback is tested when things are fine")
print("")
hard_runs = 0
hard_failures = 0
easy_runs = 0
easy_failures = 0
for r in runs:
    severity = r[2] + r[4]
    if r[3] >= 3:
        severity = severity + 1
    if severity >= 2:
        hard_runs = hard_runs + 1
        if r[5] == 0:
            hard_failures = hard_failures + 1
    else:
        easy_runs = easy_runs + 1
        if r[5] == 0:
            easy_failures = easy_failures + 1
print("activations split by how bad the conditions were")
print("  milder conditions : " + str(easy_runs) + " runs, " + str(easy_failures) + " failed")
print("  worse conditions  : " + str(hard_runs) + " runs, " + str(hard_failures) + " failed")
if hard_failures > easy_failures:
    print("  every failure is in the worse group, and the worse group is what the")
    print("  trigger selects for")
print("")
print("exercise, by kind")
print("  production activations : " + str(n) + " in " + str(months) + " months")
print("  test-suite runs        : every build, with the primary mocked as down")
print("  what the suite holds constant : warm cache, normal load, healthy deps")
print("  so the suite covers the trigger and none of the conditions that come")
print("  with it")
print("")
full_combo = 0
for r in runs:
    if r[2] == 1:
        if r[3] >= 3:
            full_combo = full_combo + 1
print("activations with a cold cache AND raised load : " + str(full_combo) + " of " + str(n))
if full_combo > 0:
    print("  a drill that reproduces that combination exercises what " + str(full_combo) + " of the " + str(n))
    print("  real activations actually met, and the suite has never held it")
print("")
print("control - a read replica used for 30% of reads at all times")
print("  activations : continuous")
print("  conditions  : the ordinary ones, because it is on the ordinary path")
print("  a defect in it is found on a Tuesday rather than during an incident")
print("")
print("The fallback is well designed and it has done its job. What triggers it also")
print("selects the conditions it runs under, so the runs it gets are drawn from the")
print("part of the input space it has been exercised on least.")
```

## stdout (executed)

```text
fallback activations in 36 months : 4

run   primary   cache   load   degraded deps   outcome
  a1    down      1       3x     1              worked
  a2    down      0       2x     0              worked
  a3    down      1       6x     1              FAILED
  a4    down      1       4x     2              FAILED

activations that worked : 2 of 4

conditions during the 4 activations
  primary unavailable : 4 of 4, by definition of the trigger
  cache cold          : 3 of 4
  average load        : 37 tenths of normal
  worst load          : 6x normal
  none of those is the condition anybody tests the fallback under, because
  the fallback is tested when things are fine

activations split by how bad the conditions were
  milder conditions : 1 runs, 0 failed
  worse conditions  : 3 runs, 2 failed
  every failure is in the worse group, and the worse group is what the
  trigger selects for

exercise, by kind
  production activations : 4 in 36 months
  test-suite runs        : every build, with the primary mocked as down
  what the suite holds constant : warm cache, normal load, healthy deps
  so the suite covers the trigger and none of the conditions that come
  with it

activations with a cold cache AND raised load : 3 of 4
  a drill that reproduces that combination exercises what 3 of the 4
  real activations actually met, and the suite has never held it

control - a read replica used for 30% of reads at all times
  activations : continuous
  conditions  : the ordinary ones, because it is on the ordinary path
  a defect in it is found on a Tuesday rather than during an incident

The fallback is well designed and it has done its job. What triggers it also
selects the conditions it runs under, so the runs it gets are drawn from the
part of the input space it has been exercised on least.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
