<!-- canonical: efficientnewlanguage.org/ai/examples/732-each-job-fit-in-memory-and-eight-ran-at-once | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 732 — Each job fit in memory and eight ran at once

`each_job_fit_in_memory_and_eight_ran_at_once.eml` - Every report job has a measured memory cap asserted in CI against a real run, and none has ever exceeded it. What the host is asked for is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every report job
# has a measured memory cap asserted in CI against a real run, and none has ever
# exceeded it. What the host is asked for is computed below.
#
# The per-job discipline is real. The cap is not a guess: each job is run in CI
# against a production-sized fixture with the resident set actually measured,
# and the build fails if it goes over. The measurement is of real memory rather
# than of an allocator counter, the fixture is representative rather than a toy,
# and forty-one jobs each carry their own asserted number.
#
# The cap is per JOB. The scheduler runs eight of them on one host, and no
# assertion anywhere is about the sum.
#
# Eight caps plus the runtime is more than the host has.

41 => jobs
41 => jobs_with_a_measured_cap
0 => jobs_that_exceeded_their_cap_in_ci
1536 => job_memory_cap_mb
8 => scheduler_concurrency
12288 => host_memory_mb
900 => runtime_overhead_mb
0 => assertions_about_the_sum
14 => host_out_of_memory_kills_last_month

job_memory_cap_mb * scheduler_concurrency => concurrent_job_demand_mb
concurrent_job_demand_mb + runtime_overhead_mb => peak_demand_mb
peak_demand_mb - host_memory_mb => mb_demanded_beyond_the_host
int(host_memory_mb * 10000 / peak_demand_mb) => host_per_myriad_of_the_demand

"jobs                            : " + str(jobs) ^0
"  with a measured cap           : " + str(jobs_with_a_measured_cap) ^0
"  that exceeded it in CI        : " + str(jobs_that_exceeded_their_cap_in_ci) ^0
"job memory cap, MB              : " + str(job_memory_cap_mb) ^0
"" ^0
"scheduler concurrency           : " + str(scheduler_concurrency) ^0
"concurrent job demand, MB       : " + str(concurrent_job_demand_mb) ^0
"runtime overhead, MB            : " + str(runtime_overhead_mb) ^0
"peak demand, MB                 : " + str(peak_demand_mb) ^0
"" ^0
"host memory, MB                 : " + str(host_memory_mb) ^0
"  demanded beyond it            : " + str(mb_demanded_beyond_the_host) ^0
"  host as a share of the demand : " + str(host_per_myriad_of_the_demand) + " per ten thousand" ^0
"assertions about the sum        : " + str(assertions_about_the_sum) ^0
"out-of-memory kills last month  : " + str(host_out_of_memory_kills_last_month) ^0
"" ^0

# ---- what the cap verified ----

"the per-job cap" ^0
"  where the number came from : a measured run, not a" ^0
"    guess" ^0
"  what is measured : resident memory, not an allocator" ^0
"    counter" ^0
"  the fixture : production-sized" ^0
"  on exceeding it : the build fails" ^0
"  jobs carrying one : " + str(jobs_with_a_measured_cap) + " of " + str(jobs) ^0
"  breaches in CI : " + str(jobs_that_exceeded_their_cap_in_ci) ^0
"  verdict : BOUNDED, EACH" ^0
"" ^0
"  measuring resident memory against a real fixture is the" ^0
"  expensive way to get this number and it is the only way" ^0
"  the number means anything" ^0
"" ^0

# ---- what nothing asserts ----

"the sum" ^0
"  jobs that may run together : " + str(scheduler_concurrency) ^0
"  their caps added : " + str(concurrent_job_demand_mb) + " MB" ^0
"  plus the runtime : " + str(peak_demand_mb) + " MB" ^0
"  the host : " + str(host_memory_mb) + " MB" ^0
"  assertions comparing the two : " + str(assertions_about_the_sum) ^0
"  where such an assertion would live : neither in the job" ^0
"    nor in the scheduler; between them" ^0
"" ^0
"  every job is within its bound and the bounds were never" ^0
"  added up against anything" ^0
"" ^0
# ---- why it usually works ----

# Most jobs do not reach their cap; the cap is a ceiling and the typical run
# sits well under it. Eight jobs at their typical size fit comfortably. The host
# dies on the days when several large tenants report at once, which is a
# property of the schedule and not of any job.
"why it is not always red" ^0
"  typical run against the cap : well under" ^0
"  eight typical runs : fit comfortably" ^0
"  when it fails : when several large tenants land in one" ^0
"    window" ^0
"  is that a defect in a job : no; each is inside its cap" ^0
"  is it a defect in the schedule : the schedule was never" ^0
"    given the numbers" ^0
"  kills last month : " + str(host_out_of_memory_kills_last_month) ^0
"" ^0

# ---- what the kill looks like ----

"one out-of-memory kill" ^0
"  which job is killed : whichever the kernel picks" ^0
"  is that the job that was over : not necessarily; none" ^0
"    of them was over" ^0
"  what the job's own metrics show : a run that was inside" ^0
"    its cap and then stopped" ^0
"  what the retry does : reruns it, often successfully," ^0
"    in a quieter window" ^0
"  what the postmortem records : an infrastructure issue" ^0
"" ^0

# ---- the concurrency was chosen too ----

# Eight was picked from throughput measurements and it is the right answer to
# the question that was asked. The question was how many jobs the host can keep
# busy, which was answered against typical jobs.
"the concurrency" ^0
"  chosen from : throughput measurement" ^0
"  the question it answers : how many keep the host busy" ^0
"  measured against : typical jobs" ^0
"  what it was not compared to : the caps" ^0
"  " + str(scheduler_concurrency) + " times the cap : " + str(concurrent_job_demand_mb) + " MB" ^0
"  the host : " + str(host_memory_mb) + " MB, " + str(host_per_myriad_of_the_demand) + " per ten thousand of" ^0
"    the worst case" ^0
"" ^0

# ---- null control ----

# The same caps, with the scheduler admitting jobs against a memory budget: a
# job runs when its cap fits in what is left.
1 => nc_assertions_about_the_sum
host_memory_mb => nc_peak_demand_mb
0 => nc_host_out_of_memory_kills

"null control - the scheduler admits against a budget" ^0
"  per-job caps : " + str(jobs_with_a_measured_cap) + ", unchanged" ^0
"  assertions about the sum : " + str(nc_assertions_about_the_sum) ^0
"  peak demand, MB : " + str(nc_peak_demand_mb) ^0
"  out-of-memory kills : " + str(nc_host_out_of_memory_kills) ^0
"  no job got smaller; the scheduler started reading the" ^0
"  numbers the jobs already carry" ^0
"" ^0

# ---- the rule ----

"what a per-job memory cap guarantees" ^0
"  no job uses more than its cap : exactly, measured" ^0
"    against a production-sized fixture, enforced in CI" ^0
"  the host does not run out of memory : not addressed;" ^0
"    the cap is a bound on one job and the host holds" ^0
"    " + str(scheduler_concurrency) + " of them" ^0
"" ^0
"per-item bounds compose by addition and nothing adds them" ^0
"unless somebody writes that down; the two facts live in two" ^0
"repositories, and the number that would relate them is a" ^0
"multiplication neither of them performs" ^0
"" ^0

"Every one of " + str(jobs) + " jobs carries a cap measured from a real run against a" ^0
"production-sized fixture, enforced by a failing build, with " + str(jobs_that_exceeded_their_cap_in_ci) + " breaches. The" ^0
"scheduler runs " + str(scheduler_concurrency) + " at once, so " + str(concurrent_job_demand_mb) + " MB of caps plus " + str(runtime_overhead_mb) + " of runtime ask a" ^0
str(host_memory_mb) + " MB host for " + str(peak_demand_mb) + " - " + str(mb_demanded_beyond_the_host) + " MB beyond it, " + str(host_per_myriad_of_the_demand) + " per ten thousand" ^0
"covered - against " + str(assertions_about_the_sum) + " assertions about the sum and " + str(host_out_of_memory_kills_last_month) + " kills last month." ^0
```

## Python (deterministic transpilation)

```python
jobs = 41
jobs_with_a_measured_cap = 41
jobs_that_exceeded_their_cap_in_ci = 0
job_memory_cap_mb = 1536
scheduler_concurrency = 8
host_memory_mb = 12288
runtime_overhead_mb = 900
assertions_about_the_sum = 0
host_out_of_memory_kills_last_month = 14
concurrent_job_demand_mb = job_memory_cap_mb * scheduler_concurrency
peak_demand_mb = concurrent_job_demand_mb + runtime_overhead_mb
mb_demanded_beyond_the_host = peak_demand_mb - host_memory_mb
host_per_myriad_of_the_demand = int(host_memory_mb * 10000 / peak_demand_mb)
print("jobs                            : " + str(jobs))
print("  with a measured cap           : " + str(jobs_with_a_measured_cap))
print("  that exceeded it in CI        : " + str(jobs_that_exceeded_their_cap_in_ci))
print("job memory cap, MB              : " + str(job_memory_cap_mb))
print("")
print("scheduler concurrency           : " + str(scheduler_concurrency))
print("concurrent job demand, MB       : " + str(concurrent_job_demand_mb))
print("runtime overhead, MB            : " + str(runtime_overhead_mb))
print("peak demand, MB                 : " + str(peak_demand_mb))
print("")
print("host memory, MB                 : " + str(host_memory_mb))
print("  demanded beyond it            : " + str(mb_demanded_beyond_the_host))
print("  host as a share of the demand : " + str(host_per_myriad_of_the_demand) + " per ten thousand")
print("assertions about the sum        : " + str(assertions_about_the_sum))
print("out-of-memory kills last month  : " + str(host_out_of_memory_kills_last_month))
print("")
print("the per-job cap")
print("  where the number came from : a measured run, not a")
print("    guess")
print("  what is measured : resident memory, not an allocator")
print("    counter")
print("  the fixture : production-sized")
print("  on exceeding it : the build fails")
print("  jobs carrying one : " + str(jobs_with_a_measured_cap) + " of " + str(jobs))
print("  breaches in CI : " + str(jobs_that_exceeded_their_cap_in_ci))
print("  verdict : BOUNDED, EACH")
print("")
print("  measuring resident memory against a real fixture is the")
print("  expensive way to get this number and it is the only way")
print("  the number means anything")
print("")
print("the sum")
print("  jobs that may run together : " + str(scheduler_concurrency))
print("  their caps added : " + str(concurrent_job_demand_mb) + " MB")
print("  plus the runtime : " + str(peak_demand_mb) + " MB")
print("  the host : " + str(host_memory_mb) + " MB")
print("  assertions comparing the two : " + str(assertions_about_the_sum))
print("  where such an assertion would live : neither in the job")
print("    nor in the scheduler; between them")
print("")
print("  every job is within its bound and the bounds were never")
print("  added up against anything")
print("")
print("why it is not always red")
print("  typical run against the cap : well under")
print("  eight typical runs : fit comfortably")
print("  when it fails : when several large tenants land in one")
print("    window")
print("  is that a defect in a job : no; each is inside its cap")
print("  is it a defect in the schedule : the schedule was never")
print("    given the numbers")
print("  kills last month : " + str(host_out_of_memory_kills_last_month))
print("")
print("one out-of-memory kill")
print("  which job is killed : whichever the kernel picks")
print("  is that the job that was over : not necessarily; none")
print("    of them was over")
print("  what the job's own metrics show : a run that was inside")
print("    its cap and then stopped")
print("  what the retry does : reruns it, often successfully,")
print("    in a quieter window")
print("  what the postmortem records : an infrastructure issue")
print("")
print("the concurrency")
print("  chosen from : throughput measurement")
print("  the question it answers : how many keep the host busy")
print("  measured against : typical jobs")
print("  what it was not compared to : the caps")
print("  " + str(scheduler_concurrency) + " times the cap : " + str(concurrent_job_demand_mb) + " MB")
print("  the host : " + str(host_memory_mb) + " MB, " + str(host_per_myriad_of_the_demand) + " per ten thousand of")
print("    the worst case")
print("")
nc_assertions_about_the_sum = 1
nc_peak_demand_mb = host_memory_mb
nc_host_out_of_memory_kills = 0
print("null control - the scheduler admits against a budget")
print("  per-job caps : " + str(jobs_with_a_measured_cap) + ", unchanged")
print("  assertions about the sum : " + str(nc_assertions_about_the_sum))
print("  peak demand, MB : " + str(nc_peak_demand_mb))
print("  out-of-memory kills : " + str(nc_host_out_of_memory_kills))
print("  no job got smaller; the scheduler started reading the")
print("  numbers the jobs already carry")
print("")
print("what a per-job memory cap guarantees")
print("  no job uses more than its cap : exactly, measured")
print("    against a production-sized fixture, enforced in CI")
print("  the host does not run out of memory : not addressed;")
print("    the cap is a bound on one job and the host holds")
print("    " + str(scheduler_concurrency) + " of them")
print("")
print("per-item bounds compose by addition and nothing adds them")
print("unless somebody writes that down; the two facts live in two")
print("repositories, and the number that would relate them is a")
print("multiplication neither of them performs")
print("")
print("Every one of " + str(jobs) + " jobs carries a cap measured from a real run against a")
print("production-sized fixture, enforced by a failing build, with " + str(jobs_that_exceeded_their_cap_in_ci) + " breaches. The")
print("scheduler runs " + str(scheduler_concurrency) + " at once, so " + str(concurrent_job_demand_mb) + " MB of caps plus " + str(runtime_overhead_mb) + " of runtime ask a")
print(str(host_memory_mb) + " MB host for " + str(peak_demand_mb) + " - " + str(mb_demanded_beyond_the_host) + " MB beyond it, " + str(host_per_myriad_of_the_demand) + " per ten thousand")
print("covered - against " + str(assertions_about_the_sum) + " assertions about the sum and " + str(host_out_of_memory_kills_last_month) + " kills last month.")
```

## stdout (executed)

```text
jobs                            : 41
  with a measured cap           : 41
  that exceeded it in CI        : 0
job memory cap, MB              : 1536

scheduler concurrency           : 8
concurrent job demand, MB       : 12288
runtime overhead, MB            : 900
peak demand, MB                 : 13188

host memory, MB                 : 12288
  demanded beyond it            : 900
  host as a share of the demand : 9317 per ten thousand
assertions about the sum        : 0
out-of-memory kills last month  : 14

the per-job cap
  where the number came from : a measured run, not a
    guess
  what is measured : resident memory, not an allocator
    counter
  the fixture : production-sized
  on exceeding it : the build fails
  jobs carrying one : 41 of 41
  breaches in CI : 0
  verdict : BOUNDED, EACH

  measuring resident memory against a real fixture is the
  expensive way to get this number and it is the only way
  the number means anything

the sum
  jobs that may run together : 8
  their caps added : 12288 MB
  plus the runtime : 13188 MB
  the host : 12288 MB
  assertions comparing the two : 0
  where such an assertion would live : neither in the job
    nor in the scheduler; between them

  every job is within its bound and the bounds were never
  added up against anything

why it is not always red
  typical run against the cap : well under
  eight typical runs : fit comfortably
  when it fails : when several large tenants land in one
    window
  is that a defect in a job : no; each is inside its cap
  is it a defect in the schedule : the schedule was never
    given the numbers
  kills last month : 14

one out-of-memory kill
  which job is killed : whichever the kernel picks
  is that the job that was over : not necessarily; none
    of them was over
  what the job's own metrics show : a run that was inside
    its cap and then stopped
  what the retry does : reruns it, often successfully,
    in a quieter window
  what the postmortem records : an infrastructure issue

the concurrency
  chosen from : throughput measurement
  the question it answers : how many keep the host busy
  measured against : typical jobs
  what it was not compared to : the caps
  8 times the cap : 12288 MB
  the host : 12288 MB, 9317 per ten thousand of
    the worst case

null control - the scheduler admits against a budget
  per-job caps : 41, unchanged
  assertions about the sum : 1
  peak demand, MB : 12288
  out-of-memory kills : 0
  no job got smaller; the scheduler started reading the
  numbers the jobs already carry

what a per-job memory cap guarantees
  no job uses more than its cap : exactly, measured
    against a production-sized fixture, enforced in CI
  the host does not run out of memory : not addressed;
    the cap is a bound on one job and the host holds
    8 of them

per-item bounds compose by addition and nothing adds them
unless somebody writes that down; the two facts live in two
repositories, and the number that would relate them is a
multiplication neither of them performs

Every one of 41 jobs carries a cap measured from a real run against a
production-sized fixture, enforced by a failing build, with 0 breaches. The
scheduler runs 8 at once, so 12288 MB of caps plus 900 of runtime ask a
12288 MB host for 13188 - 900 MB beyond it, 9317 per ten thousand
covered - against 0 assertions about the sum and 14 kills last month.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
