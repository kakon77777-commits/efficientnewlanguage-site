<!-- canonical: efficientnewlanguage.org/ai/examples/691-the-crontab-was-utc-and-the-report-was-local | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 691 — The crontab was utc and the report was local

`the_crontab_was_utc_and_the_report_was_local.eml` - The scheduler runs in UTC, which is the right choice and was made deliberately. What the daily report covers is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The scheduler runs
# in UTC, which is the right choice and was made deliberately. What the daily
# report covers is computed below.
#
# Running the scheduler in UTC is correct and it was a decision, not a default.
# A scheduler on local time skips an hour once a year and runs an hour twice on
# another day; on UTC every job runs exactly once, the interval between two runs
# is always the same, and the incident that produced this policy was a
# double-billed hour.
#
# The report the job produces is read by people, and it says "yesterday". The
# query behind it takes a local day, because a business day is local.
#
# The job runs at 02:00 UTC. The office is UTC+8.

8 => office_offset_hours
2 => job_hour_utc
365 => days_per_year
1 => runs_per_job_per_day
0 => skipped_or_doubled_runs

# 02:00 UTC is 10:00 local, so a report of "the local day before now" at that
# instant covers a day that is still in progress for ten hours of it.
job_hour_utc + office_offset_hours => job_hour_local
job_hour_local => hours_of_the_local_day_already_elapsed
24 - hours_of_the_local_day_already_elapsed => hours_of_the_local_day_not_yet_happened
int(hours_of_the_local_day_already_elapsed * 10000 / 24) => elapsed_per_myriad

"office offset, hours       : " + str(office_offset_hours) ^0
"job runs at, UTC           : " + str(job_hour_utc) ^0
"which is local            : " + str(job_hour_local) ^0
"" ^0
"hours of today already elapsed when it runs : " + str(hours_of_the_local_day_already_elapsed) ^0
"hours of today not yet happened             : " + str(hours_of_the_local_day_not_yet_happened) ^0
"share of today the report can see           : " + str(elapsed_per_myriad) + " per ten thousand" ^0
"" ^0
"runs per job per day       : " + str(runs_per_job_per_day) ^0
"skipped or doubled runs    : " + str(skipped_or_doubled_runs) ^0
"" ^0

# ---- what UTC scheduling verified ----

"the scheduler" ^0
"  timezone            : UTC, chosen rather than defaulted" ^0
"  jobs skipped in a spring transition : " + str(skipped_or_doubled_runs) ^0
"  jobs run twice in an autumn one     : " + str(skipped_or_doubled_runs) ^0
"  interval between two runs : always the same" ^0
"  policy written after      : a double-billed hour" ^0
"  verdict             : CORRECT" ^0
"" ^0
"  a local-time scheduler has both failure modes and this" ^0
"  one has neither" ^0
"" ^0

# ---- what the report means ----

"the two days" ^0
"  the scheduler's day : a UTC day, uniform, 24 hours" ^0
"  the report's day    : a local day, because a business" ^0
"    day is local" ^0
"  the word on the page: yesterday" ^0
"  which yesterday     : the local one, computed from the" ^0
"    instant the job happens to run" ^0
"" ^0
"  each system's choice is right for what it does, and the" ^0
"  report is where they meet" ^0
"" ^0

# ---- what a reader gets ----

# At 10:00 local the previous local day is complete, so the report is right.
# The problem is the day it is read ON: people open it during the morning and
# read it as covering the day it was generated.
"the report generated at " + str(job_hour_local) + ":00 local" ^0
"  covers          : the previous local day, completely" ^0
"  is correct      : yes" ^0
"  is stamped with : the date it ran" ^0
"  read as covering: that date, by everyone who opens it" ^0
"  the day it actually covers : the one before" ^0
"" ^0

# ---- the case that is not off by one ----

# Move the office and it stops being a naming problem. At UTC-6 the job runs at
# 20:00 the previous local day, so "yesterday" is two local days back.
6 => a_western_office_offset_hours
job_hour_utc - a_western_office_offset_hours => western_job_hour_local

"the same job for an office at UTC minus " + str(a_western_office_offset_hours) ^0
"  job runs at, local : " + str(western_job_hour_local) + ", which is the previous day" ^0
"  the report's yesterday : two local days back" ^0
"  the same code, the same schedule, a different answer" ^0
"" ^0

# ---- null control ----

# The same UTC scheduler, with the report's window computed from a stated local
# date rather than from the instant the job runs.
runs_per_job_per_day => nc_runs_per_day
0 => nc_reports_covering_the_wrong_day

"null control - the window from a stated date, not from now" ^0
"  runs per day        : " + str(nc_runs_per_day) + ", unchanged" ^0
"  skipped or doubled  : " + str(skipped_or_doubled_runs) + ", unchanged" ^0
"  reports covering the wrong day : " + str(nc_reports_covering_the_wrong_day) ^0
"  the scheduler stayed on UTC, which is right; the report" ^0
"  stopped deriving its window from when it happened to run" ^0
"" ^0

# ---- the rule ----

"what a UTC scheduler guarantees" ^0
"  every job runs once, at a fixed interval : exactly, and" ^0
"    a local-time scheduler cannot" ^0
"  the output covers the period a reader means : not" ^0
"    addressed; a period a person names is local, and the" ^0
"    job knows only the instant it started" ^0
"" ^0
"UTC is right for scheduling and wrong for reporting, and the" ^0
"boundary between them is a job that computes its window from" ^0
"its own start time" ^0
"" ^0

"The scheduler is on UTC deliberately, after a double-billed hour, and it has" ^0
str(skipped_or_doubled_runs) + " skipped and " + str(skipped_or_doubled_runs) + " doubled runs where a local-time scheduler has both." ^0
"It fires at " + str(job_hour_utc) + ":00 UTC, which is " + str(job_hour_local) + ":00 in the office, " + str(elapsed_per_myriad) + " per ten thousand" ^0
"of the way through the local day, so the report is stamped with the date it ran" ^0
"and covers the one before - and for an office at UTC minus " + str(a_western_office_offset_hours) + " it covers two." ^0
```

## Python (deterministic transpilation)

```python
office_offset_hours = 8
job_hour_utc = 2
days_per_year = 365
runs_per_job_per_day = 1
skipped_or_doubled_runs = 0
job_hour_local = job_hour_utc + office_offset_hours
hours_of_the_local_day_already_elapsed = job_hour_local
hours_of_the_local_day_not_yet_happened = 24 - hours_of_the_local_day_already_elapsed
elapsed_per_myriad = int(hours_of_the_local_day_already_elapsed * 10000 / 24)
print("office offset, hours       : " + str(office_offset_hours))
print("job runs at, UTC           : " + str(job_hour_utc))
print("which is local            : " + str(job_hour_local))
print("")
print("hours of today already elapsed when it runs : " + str(hours_of_the_local_day_already_elapsed))
print("hours of today not yet happened             : " + str(hours_of_the_local_day_not_yet_happened))
print("share of today the report can see           : " + str(elapsed_per_myriad) + " per ten thousand")
print("")
print("runs per job per day       : " + str(runs_per_job_per_day))
print("skipped or doubled runs    : " + str(skipped_or_doubled_runs))
print("")
print("the scheduler")
print("  timezone            : UTC, chosen rather than defaulted")
print("  jobs skipped in a spring transition : " + str(skipped_or_doubled_runs))
print("  jobs run twice in an autumn one     : " + str(skipped_or_doubled_runs))
print("  interval between two runs : always the same")
print("  policy written after      : a double-billed hour")
print("  verdict             : CORRECT")
print("")
print("  a local-time scheduler has both failure modes and this")
print("  one has neither")
print("")
print("the two days")
print("  the scheduler's day : a UTC day, uniform, 24 hours")
print("  the report's day    : a local day, because a business")
print("    day is local")
print("  the word on the page: yesterday")
print("  which yesterday     : the local one, computed from the")
print("    instant the job happens to run")
print("")
print("  each system's choice is right for what it does, and the")
print("  report is where they meet")
print("")
print("the report generated at " + str(job_hour_local) + ":00 local")
print("  covers          : the previous local day, completely")
print("  is correct      : yes")
print("  is stamped with : the date it ran")
print("  read as covering: that date, by everyone who opens it")
print("  the day it actually covers : the one before")
print("")
a_western_office_offset_hours = 6
western_job_hour_local = job_hour_utc - a_western_office_offset_hours
print("the same job for an office at UTC minus " + str(a_western_office_offset_hours))
print("  job runs at, local : " + str(western_job_hour_local) + ", which is the previous day")
print("  the report's yesterday : two local days back")
print("  the same code, the same schedule, a different answer")
print("")
nc_runs_per_day = runs_per_job_per_day
nc_reports_covering_the_wrong_day = 0
print("null control - the window from a stated date, not from now")
print("  runs per day        : " + str(nc_runs_per_day) + ", unchanged")
print("  skipped or doubled  : " + str(skipped_or_doubled_runs) + ", unchanged")
print("  reports covering the wrong day : " + str(nc_reports_covering_the_wrong_day))
print("  the scheduler stayed on UTC, which is right; the report")
print("  stopped deriving its window from when it happened to run")
print("")
print("what a UTC scheduler guarantees")
print("  every job runs once, at a fixed interval : exactly, and")
print("    a local-time scheduler cannot")
print("  the output covers the period a reader means : not")
print("    addressed; a period a person names is local, and the")
print("    job knows only the instant it started")
print("")
print("UTC is right for scheduling and wrong for reporting, and the")
print("boundary between them is a job that computes its window from")
print("its own start time")
print("")
print("The scheduler is on UTC deliberately, after a double-billed hour, and it has")
print(str(skipped_or_doubled_runs) + " skipped and " + str(skipped_or_doubled_runs) + " doubled runs where a local-time scheduler has both.")
print("It fires at " + str(job_hour_utc) + ":00 UTC, which is " + str(job_hour_local) + ":00 in the office, " + str(elapsed_per_myriad) + " per ten thousand")
print("of the way through the local day, so the report is stamped with the date it ran")
print("and covers the one before - and for an office at UTC minus " + str(a_western_office_offset_hours) + " it covers two.")
```

## stdout (executed)

```text
office offset, hours       : 8
job runs at, UTC           : 2
which is local            : 10

hours of today already elapsed when it runs : 10
hours of today not yet happened             : 14
share of today the report can see           : 4166 per ten thousand

runs per job per day       : 1
skipped or doubled runs    : 0

the scheduler
  timezone            : UTC, chosen rather than defaulted
  jobs skipped in a spring transition : 0
  jobs run twice in an autumn one     : 0
  interval between two runs : always the same
  policy written after      : a double-billed hour
  verdict             : CORRECT

  a local-time scheduler has both failure modes and this
  one has neither

the two days
  the scheduler's day : a UTC day, uniform, 24 hours
  the report's day    : a local day, because a business
    day is local
  the word on the page: yesterday
  which yesterday     : the local one, computed from the
    instant the job happens to run

  each system's choice is right for what it does, and the
  report is where they meet

the report generated at 10:00 local
  covers          : the previous local day, completely
  is correct      : yes
  is stamped with : the date it ran
  read as covering: that date, by everyone who opens it
  the day it actually covers : the one before

the same job for an office at UTC minus 6
  job runs at, local : -4, which is the previous day
  the report's yesterday : two local days back
  the same code, the same schedule, a different answer

null control - the window from a stated date, not from now
  runs per day        : 1, unchanged
  skipped or doubled  : 0, unchanged
  reports covering the wrong day : 0
  the scheduler stayed on UTC, which is right; the report
  stopped deriving its window from when it happened to run

what a UTC scheduler guarantees
  every job runs once, at a fixed interval : exactly, and
    a local-time scheduler cannot
  the output covers the period a reader means : not
    addressed; a period a person names is local, and the
    job knows only the instant it started

UTC is right for scheduling and wrong for reporting, and the
boundary between them is a job that computes its window from
its own start time

The scheduler is on UTC deliberately, after a double-billed hour, and it has
0 skipped and 0 doubled runs where a local-time scheduler has both.
It fires at 2:00 UTC, which is 10:00 in the office, 4166 per ten thousand
of the way through the local day, so the report is stamped with the date it ran
and covers the one before - and for an office at UTC minus 6 it covers two.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
