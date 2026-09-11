<!-- canonical: efficientnewlanguage.org/ai/examples/806-the-uptime-was-measured-from-inside-the-service | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 806 — The uptime was measured from inside the service

`the_uptime_was_measured_from_inside_the_service.eml` - The uptime monitor recorded no failed checks all month, and every check it recorded is true. What it could not record is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The uptime monitor
# recorded no failed checks all month, and every check it recorded is true. What
# it could not record is computed below.
#
# The monitoring is set up carefully. It checks once a minute; a failed check
# pages on-call; the threshold for "down" is a single miss, not a streak; and
# the history is kept for a year so trends are visible.
#
# The monitor process runs on the same rack as the service it watches.

43200 => checks_in_the_month
43055 => checks_that_ran
0 => checks_that_recorded_a_failure
10000 => reported_uptime_per_myriad
145 => minutes_the_rack_lost_power
0 => independent_off_rack_monitors

checks_in_the_month - checks_that_ran => checks_that_never_ran
int(checks_that_ran * 10000 / checks_in_the_month) => fraction_of_minutes_observed_per_myriad
checks_in_the_month - minutes_the_rack_lost_power => minutes_the_service_was_up
int(minutes_the_service_was_up * 10000 / checks_in_the_month) => real_uptime_per_myriad

"checks in the month             : " + str(checks_in_the_month) ^0
"  that ran                      : " + str(checks_that_ran) ^0
"  that never ran                : " + str(checks_that_never_ran) ^0
"  that recorded a failure       : " + str(checks_that_recorded_a_failure) ^0
"reported uptime                 : " + str(reported_uptime_per_myriad) + " per ten thousand" ^0
"" ^0
"minutes the rack lost power     : " + str(minutes_the_rack_lost_power) ^0
"minutes the service was up      : " + str(minutes_the_service_was_up) ^0
"real uptime                     : " + str(real_uptime_per_myriad) + " per ten thousand" ^0
"off-rack monitors               : " + str(independent_off_rack_monitors) ^0
"" ^0

# ---- what the monitor verified ----

"the uptime monitor" ^0
"  how often : once a minute" ^0
"  on a failed check : it pages on-call" ^0
"  threshold for down : one miss, not a streak" ^0
"  history kept : a year" ^0
"  checks that recorded a failure : " + str(checks_that_recorded_a_failure) ^0
"  verdict : UP" ^0
"" ^0
"  paging on a single miss is the part almost nobody dares" ^0
"  to configure, and it is why a gap here is trusted" ^0
"" ^0

# ---- what a gap in the record was read as ----

"the missing checks" ^0
"  minutes with no check recorded : " ^0
"    " + str(checks_that_never_ran) ^0
"  why they are missing : the monitor lost power with the" ^0
"    service, on the same rack" ^0
"  how the dashboard reads a gap : as up, not as unknown" ^0
"  fraction of minutes actually observed : " ^0
"    " + str(fraction_of_minutes_observed_per_myriad) + " per ten thousand" ^0
"  monitors that would have survived the outage : " ^0
"    " + str(independent_off_rack_monitors) ^0
"" ^0

# ---- what happened in the gap ----

"the outage the monitor slept through" ^0
"  minutes the rack was dark : " + str(minutes_the_rack_lost_power) ^0
"  checks that fired during it : 0" ^0
"  pages sent : 0" ^0
"  what the year of history shows there : nothing, which" ^0
"    renders as up" ^0
"  real uptime once the gap is counted down : " ^0
"    " + str(real_uptime_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same monitor, run from a second region, with a gap in the record treated
# as unknown rather than as up.
10000 => nc_same_rack_uptime_per_myriad
9966 => nc_off_rack_uptime_per_myriad
145 => nc_minutes_the_off_rack_monitor_would_have_flagged

"null control - a monitor off the rack, gaps as unknown" ^0
"  same-rack uptime : " + str(nc_same_rack_uptime_per_myriad) + ", unchanged" ^0
"  off-rack uptime : " ^0
"    " + str(nc_off_rack_uptime_per_myriad) + " per ten thousand" ^0
"  minutes it would have flagged : " ^0
"    " + str(nc_minutes_the_off_rack_monitor_would_have_flagged) ^0
"  nothing about the outage changed; the recorder stopped" ^0
"  sharing the failure it was there to catch" ^0
"" ^0

# ---- the rule ----

"what a month of clean checks guarantees" ^0
"  every check that ran returned healthy : exactly, all " ^0
"    " + str(checks_that_ran) + " of them, paging armed on a single miss" ^0
"  the service was up : not addressed; the monitor shares" ^0
"    the rack, so the one event that takes the service down" ^0
"    takes the recorder with it, and " + str(checks_that_never_ran) + " missing" ^0
"    checks read as up rather than as unknown" ^0
"" ^0
"a recorder inside the failure domain cannot report the" ^0
"failure that stops it; the absence of a bad record is not a" ^0
"good record, unless something survived to write it" ^0
"" ^0

"It checks every minute, pages on a single miss, and keeps a year of history -" ^0
"" + str(reported_uptime_per_myriad) + " per ten thousand, no failure recorded. The monitor is on the same rack," ^0
"so " + str(minutes_the_rack_lost_power) + " minutes of lost power left " + str(checks_that_never_ran) + " checks unrun and unpaged, read as up," ^0
"putting real uptime at " + str(real_uptime_per_myriad) + " per ten thousand under " + str(independent_off_rack_monitors) + " off-rack monitors." ^0
```

## Python (deterministic transpilation)

```python
checks_in_the_month = 43200
checks_that_ran = 43055
checks_that_recorded_a_failure = 0
reported_uptime_per_myriad = 10000
minutes_the_rack_lost_power = 145
independent_off_rack_monitors = 0
checks_that_never_ran = checks_in_the_month - checks_that_ran
fraction_of_minutes_observed_per_myriad = int(checks_that_ran * 10000 / checks_in_the_month)
minutes_the_service_was_up = checks_in_the_month - minutes_the_rack_lost_power
real_uptime_per_myriad = int(minutes_the_service_was_up * 10000 / checks_in_the_month)
print("checks in the month             : " + str(checks_in_the_month))
print("  that ran                      : " + str(checks_that_ran))
print("  that never ran                : " + str(checks_that_never_ran))
print("  that recorded a failure       : " + str(checks_that_recorded_a_failure))
print("reported uptime                 : " + str(reported_uptime_per_myriad) + " per ten thousand")
print("")
print("minutes the rack lost power     : " + str(minutes_the_rack_lost_power))
print("minutes the service was up      : " + str(minutes_the_service_was_up))
print("real uptime                     : " + str(real_uptime_per_myriad) + " per ten thousand")
print("off-rack monitors               : " + str(independent_off_rack_monitors))
print("")
print("the uptime monitor")
print("  how often : once a minute")
print("  on a failed check : it pages on-call")
print("  threshold for down : one miss, not a streak")
print("  history kept : a year")
print("  checks that recorded a failure : " + str(checks_that_recorded_a_failure))
print("  verdict : UP")
print("")
print("  paging on a single miss is the part almost nobody dares")
print("  to configure, and it is why a gap here is trusted")
print("")
print("the missing checks")
print("  minutes with no check recorded : ")
print("    " + str(checks_that_never_ran))
print("  why they are missing : the monitor lost power with the")
print("    service, on the same rack")
print("  how the dashboard reads a gap : as up, not as unknown")
print("  fraction of minutes actually observed : ")
print("    " + str(fraction_of_minutes_observed_per_myriad) + " per ten thousand")
print("  monitors that would have survived the outage : ")
print("    " + str(independent_off_rack_monitors))
print("")
print("the outage the monitor slept through")
print("  minutes the rack was dark : " + str(minutes_the_rack_lost_power))
print("  checks that fired during it : 0")
print("  pages sent : 0")
print("  what the year of history shows there : nothing, which")
print("    renders as up")
print("  real uptime once the gap is counted down : ")
print("    " + str(real_uptime_per_myriad) + " per ten thousand")
print("")
nc_same_rack_uptime_per_myriad = 10000
nc_off_rack_uptime_per_myriad = 9966
nc_minutes_the_off_rack_monitor_would_have_flagged = 145
print("null control - a monitor off the rack, gaps as unknown")
print("  same-rack uptime : " + str(nc_same_rack_uptime_per_myriad) + ", unchanged")
print("  off-rack uptime : ")
print("    " + str(nc_off_rack_uptime_per_myriad) + " per ten thousand")
print("  minutes it would have flagged : ")
print("    " + str(nc_minutes_the_off_rack_monitor_would_have_flagged))
print("  nothing about the outage changed; the recorder stopped")
print("  sharing the failure it was there to catch")
print("")
print("what a month of clean checks guarantees")
print("  every check that ran returned healthy : exactly, all ")
print("    " + str(checks_that_ran) + " of them, paging armed on a single miss")
print("  the service was up : not addressed; the monitor shares")
print("    the rack, so the one event that takes the service down")
print("    takes the recorder with it, and " + str(checks_that_never_ran) + " missing")
print("    checks read as up rather than as unknown")
print("")
print("a recorder inside the failure domain cannot report the")
print("failure that stops it; the absence of a bad record is not a")
print("good record, unless something survived to write it")
print("")
print("It checks every minute, pages on a single miss, and keeps a year of history -")
print("" + str(reported_uptime_per_myriad) + " per ten thousand, no failure recorded. The monitor is on the same rack,")
print("so " + str(minutes_the_rack_lost_power) + " minutes of lost power left " + str(checks_that_never_ran) + " checks unrun and unpaged, read as up,")
print("putting real uptime at " + str(real_uptime_per_myriad) + " per ten thousand under " + str(independent_off_rack_monitors) + " off-rack monitors.")
```

## stdout (executed)

```text
checks in the month             : 43200
  that ran                      : 43055
  that never ran                : 145
  that recorded a failure       : 0
reported uptime                 : 10000 per ten thousand

minutes the rack lost power     : 145
minutes the service was up      : 43055
real uptime                     : 9966 per ten thousand
off-rack monitors               : 0

the uptime monitor
  how often : once a minute
  on a failed check : it pages on-call
  threshold for down : one miss, not a streak
  history kept : a year
  checks that recorded a failure : 0
  verdict : UP

  paging on a single miss is the part almost nobody dares
  to configure, and it is why a gap here is trusted

the missing checks
  minutes with no check recorded : 
    145
  why they are missing : the monitor lost power with the
    service, on the same rack
  how the dashboard reads a gap : as up, not as unknown
  fraction of minutes actually observed : 
    9966 per ten thousand
  monitors that would have survived the outage : 
    0

the outage the monitor slept through
  minutes the rack was dark : 145
  checks that fired during it : 0
  pages sent : 0
  what the year of history shows there : nothing, which
    renders as up
  real uptime once the gap is counted down : 
    9966 per ten thousand

null control - a monitor off the rack, gaps as unknown
  same-rack uptime : 10000, unchanged
  off-rack uptime : 
    9966 per ten thousand
  minutes it would have flagged : 
    145
  nothing about the outage changed; the recorder stopped
  sharing the failure it was there to catch

what a month of clean checks guarantees
  every check that ran returned healthy : exactly, all 
    43055 of them, paging armed on a single miss
  the service was up : not addressed; the monitor shares
    the rack, so the one event that takes the service down
    takes the recorder with it, and 145 missing
    checks read as up rather than as unknown

a recorder inside the failure domain cannot report the
failure that stops it; the absence of a bad record is not a
good record, unless something survived to write it

It checks every minute, pages on a single miss, and keeps a year of history -
10000 per ten thousand, no failure recorded. The monitor is on the same rack,
so 145 minutes of lost power left 145 checks unrun and unpaged, read as up,
putting real uptime at 9966 per ten thousand under 0 off-rack monitors.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
