<!-- canonical: efficientnewlanguage.org/ai/examples/674-the-benchmark-was-isolated-and-the-machine-was-shared | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 674 — The benchmark was isolated and the machine was shared

`the_benchmark_was_isolated_and_the_machine_was_shared.eml` - The benchmark pins a core, disables frequency scaling, warms the caches and reports a confidence interval of four parts in a thousand. What it measures is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The benchmark
# pins a core, disables frequency scaling, warms the caches and reports a
# confidence interval of four parts in a thousand. What it measures is computed
# below.
#
# The methodology is careful. The process is pinned to one core, the governor is
# set to performance so no clock changes under it, a thousand iterations run
# after a warm-up that is discarded, outliers are reported rather than dropped,
# and the interval is computed properly rather than as a range. This is better
# than most benchmarks in most repositories.
#
# All of that isolates the measurement WITHIN the process. It runs on a shared
# runner, so the other tenants of that machine are outside every one of those
# controls — the pinned core shares a memory controller and a last-level cache
# with cores this benchmark does not own.
#
# The interval is tight and the same commit measures differently on Tuesday.

1000 => iterations
40 => reported_interval_per_myriad
12400 => nanoseconds_on_a_quiet_runner
19800 => nanoseconds_on_a_busy_runner
0 => methodology_faults_found_in_review

nanoseconds_on_a_busy_runner - nanoseconds_on_a_quiet_runner => spread_ns
int(spread_ns * 10000 / nanoseconds_on_a_quiet_runner) => between_run_spread_per_myriad
int(between_run_spread_per_myriad / reported_interval_per_myriad) => spread_over_interval

"iterations                   : " + str(iterations) ^0
"reported interval            : " + str(reported_interval_per_myriad) + " per ten thousand" ^0
"" ^0
"same commit, quiet runner, ns: " + str(nanoseconds_on_a_quiet_runner) ^0
"same commit, busy runner, ns : " + str(nanoseconds_on_a_busy_runner) ^0
"between-run spread           : " + str(between_run_spread_per_myriad) + " per ten thousand" ^0
"the spread is the interval times : " + str(spread_over_interval) ^0
"" ^0

# ---- what the methodology verified ----

"the benchmark's controls" ^0
"  core pinned          : yes" ^0
"  frequency scaling    : disabled" ^0
"  warm-up              : run and discarded" ^0
"  iterations           : " + str(iterations) ^0
"  outliers             : reported, not dropped" ^0
"  interval computed properly : yes" ^0
"  faults found in review : " + str(methodology_faults_found_in_review) ^0
"  verdict              : ISOLATED" ^0
"" ^0
"  every one of those is a real control and each removes a" ^0
"  real source of variance" ^0
"" ^0

# ---- what the interval is an interval of ----

"the reported " + str(reported_interval_per_myriad) + " per ten thousand" ^0
"  computed over        : " + str(iterations) + " iterations in one process" ^0
"  what it bounds       : how much this run's own samples" ^0
"    disagree with each other" ^0
"  what it does not bound : how much this run disagrees" ^0
"    with the next one" ^0
"" ^0
"  a tight interval over one population is not a claim" ^0
"  about a second population it never sampled" ^0
"" ^0

# ---- what is outside the pin ----

"the shared runner" ^0
"  cores this process owns : 1" ^0
"  cores the machine has   : shared with other jobs" ^0
"  last-level cache        : shared" ^0
"  memory bandwidth        : shared" ^0
"  a control for any of those : none, and pinning is what" ^0
"    makes it look as though there is" ^0
"" ^0

# ---- what the regression gate does with it ----

# The gate fails a change whose measurement moves more than the interval. The
# interval is 40 per ten thousand and the machine moves 5967, so the gate is
# deciding on which runner it landed.
int(between_run_spread_per_myriad / 2) => noise_in_either_direction

"the regression gate" ^0
"  fails a change moving more than : " + str(reported_interval_per_myriad) + " per ten thousand" ^0
"  machine noise, either direction : up to " + str(noise_in_either_direction) ^0
"  so the gate decides on           : which runner it got" ^0
"  a real regression it would catch : one larger than the" ^0
"    noise, which is a regression nobody needs a benchmark" ^0
"    to notice" ^0
"" ^0

# ---- null control ----

# The same benchmark, reported as the median of five runs on different runners
# with the between-run spread as the interval.
between_run_spread_per_myriad => nc_reported_interval_per_myriad
5 => nc_runs_across_runners

"null control - the interval computed across runners" ^0
"  methodology faults  : " + str(methodology_faults_found_in_review) + ", unchanged" ^0
"  runs across runners : " + str(nc_runs_across_runners) ^0
"  reported interval   : " + str(nc_reported_interval_per_myriad) + " per ten thousand" ^0
"  the benchmark did not get noisier; the interval started" ^0
"  covering the variance that decides the gate" ^0
"" ^0

# ---- the rule ----

"what a careful benchmark guarantees" ^0
"  this measurement is repeatable within itself : exactly" ^0
"  this measurement is comparable to the last one : not" ^0
"    addressed; every control it applies is inside the" ^0
"    process, and the variance that matters is outside" ^0
"" ^0
"an interval describes the population it was computed over;" ^0
"comparing two runs is a question about a population of runs," ^0
"and one run cannot sample it" ^0
"" ^0

"The methodology is careful and review found " + str(methodology_faults_found_in_review) + " faults: pinned core, no frequency" ^0
"scaling, discarded warm-up, " + str(iterations) + " iterations, outliers reported. Its interval of" ^0
str(reported_interval_per_myriad) + " per ten thousand covers disagreement among its own samples, while the same" ^0
"commit measures " + str(nanoseconds_on_a_quiet_runner) + " ns and " + str(nanoseconds_on_a_busy_runner) + " ns on two runners - a spread of" ^0
str(between_run_spread_per_myriad) + " per ten thousand, " + str(spread_over_interval) + " times the interval the gate compares against." ^0
```

## Python (deterministic transpilation)

```python
iterations = 1000
reported_interval_per_myriad = 40
nanoseconds_on_a_quiet_runner = 12400
nanoseconds_on_a_busy_runner = 19800
methodology_faults_found_in_review = 0
spread_ns = nanoseconds_on_a_busy_runner - nanoseconds_on_a_quiet_runner
between_run_spread_per_myriad = int(spread_ns * 10000 / nanoseconds_on_a_quiet_runner)
spread_over_interval = int(between_run_spread_per_myriad / reported_interval_per_myriad)
print("iterations                   : " + str(iterations))
print("reported interval            : " + str(reported_interval_per_myriad) + " per ten thousand")
print("")
print("same commit, quiet runner, ns: " + str(nanoseconds_on_a_quiet_runner))
print("same commit, busy runner, ns : " + str(nanoseconds_on_a_busy_runner))
print("between-run spread           : " + str(between_run_spread_per_myriad) + " per ten thousand")
print("the spread is the interval times : " + str(spread_over_interval))
print("")
print("the benchmark's controls")
print("  core pinned          : yes")
print("  frequency scaling    : disabled")
print("  warm-up              : run and discarded")
print("  iterations           : " + str(iterations))
print("  outliers             : reported, not dropped")
print("  interval computed properly : yes")
print("  faults found in review : " + str(methodology_faults_found_in_review))
print("  verdict              : ISOLATED")
print("")
print("  every one of those is a real control and each removes a")
print("  real source of variance")
print("")
print("the reported " + str(reported_interval_per_myriad) + " per ten thousand")
print("  computed over        : " + str(iterations) + " iterations in one process")
print("  what it bounds       : how much this run's own samples")
print("    disagree with each other")
print("  what it does not bound : how much this run disagrees")
print("    with the next one")
print("")
print("  a tight interval over one population is not a claim")
print("  about a second population it never sampled")
print("")
print("the shared runner")
print("  cores this process owns : 1")
print("  cores the machine has   : shared with other jobs")
print("  last-level cache        : shared")
print("  memory bandwidth        : shared")
print("  a control for any of those : none, and pinning is what")
print("    makes it look as though there is")
print("")
noise_in_either_direction = int(between_run_spread_per_myriad / 2)
print("the regression gate")
print("  fails a change moving more than : " + str(reported_interval_per_myriad) + " per ten thousand")
print("  machine noise, either direction : up to " + str(noise_in_either_direction))
print("  so the gate decides on           : which runner it got")
print("  a real regression it would catch : one larger than the")
print("    noise, which is a regression nobody needs a benchmark")
print("    to notice")
print("")
nc_reported_interval_per_myriad = between_run_spread_per_myriad
nc_runs_across_runners = 5
print("null control - the interval computed across runners")
print("  methodology faults  : " + str(methodology_faults_found_in_review) + ", unchanged")
print("  runs across runners : " + str(nc_runs_across_runners))
print("  reported interval   : " + str(nc_reported_interval_per_myriad) + " per ten thousand")
print("  the benchmark did not get noisier; the interval started")
print("  covering the variance that decides the gate")
print("")
print("what a careful benchmark guarantees")
print("  this measurement is repeatable within itself : exactly")
print("  this measurement is comparable to the last one : not")
print("    addressed; every control it applies is inside the")
print("    process, and the variance that matters is outside")
print("")
print("an interval describes the population it was computed over;")
print("comparing two runs is a question about a population of runs,")
print("and one run cannot sample it")
print("")
print("The methodology is careful and review found " + str(methodology_faults_found_in_review) + " faults: pinned core, no frequency")
print("scaling, discarded warm-up, " + str(iterations) + " iterations, outliers reported. Its interval of")
print(str(reported_interval_per_myriad) + " per ten thousand covers disagreement among its own samples, while the same")
print("commit measures " + str(nanoseconds_on_a_quiet_runner) + " ns and " + str(nanoseconds_on_a_busy_runner) + " ns on two runners - a spread of")
print(str(between_run_spread_per_myriad) + " per ten thousand, " + str(spread_over_interval) + " times the interval the gate compares against.")
```

## stdout (executed)

```text
iterations                   : 1000
reported interval            : 40 per ten thousand

same commit, quiet runner, ns: 12400
same commit, busy runner, ns : 19800
between-run spread           : 5967 per ten thousand
the spread is the interval times : 149

the benchmark's controls
  core pinned          : yes
  frequency scaling    : disabled
  warm-up              : run and discarded
  iterations           : 1000
  outliers             : reported, not dropped
  interval computed properly : yes
  faults found in review : 0
  verdict              : ISOLATED

  every one of those is a real control and each removes a
  real source of variance

the reported 40 per ten thousand
  computed over        : 1000 iterations in one process
  what it bounds       : how much this run's own samples
    disagree with each other
  what it does not bound : how much this run disagrees
    with the next one

  a tight interval over one population is not a claim
  about a second population it never sampled

the shared runner
  cores this process owns : 1
  cores the machine has   : shared with other jobs
  last-level cache        : shared
  memory bandwidth        : shared
  a control for any of those : none, and pinning is what
    makes it look as though there is

the regression gate
  fails a change moving more than : 40 per ten thousand
  machine noise, either direction : up to 2983
  so the gate decides on           : which runner it got
  a real regression it would catch : one larger than the
    noise, which is a regression nobody needs a benchmark
    to notice

null control - the interval computed across runners
  methodology faults  : 0, unchanged
  runs across runners : 5
  reported interval   : 5967 per ten thousand
  the benchmark did not get noisier; the interval started
  covering the variance that decides the gate

what a careful benchmark guarantees
  this measurement is repeatable within itself : exactly
  this measurement is comparable to the last one : not
    addressed; every control it applies is inside the
    process, and the variance that matters is outside

an interval describes the population it was computed over;
comparing two runs is a question about a population of runs,
and one run cannot sample it

The methodology is careful and review found 0 faults: pinned core, no frequency
scaling, discarded warm-up, 1000 iterations, outliers reported. Its interval of
40 per ten thousand covers disagreement among its own samples, while the same
commit measures 12400 ns and 19800 ns on two runners - a spread of
5967 per ten thousand, 149 times the interval the gate compares against.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
