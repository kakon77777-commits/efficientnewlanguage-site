<!-- canonical: efficientnewlanguage.org/ai/examples/801-the-liveness-probe-was-answered-from-cache | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 801 — The liveness probe was answered from cache

`the_liveness_probe_was_answered_from_cache.eml` - The liveness probe has returned 200 on every check for the whole day, and each 200 is true. What the probe actually exercised is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The liveness probe
# has returned 200 on every check for the whole day, and each 200 is true. What
# the probe actually exercised is computed below.
#
# The probe is wired the way the runbook says. It hits an HTTP endpoint on the
# service itself rather than pinging the host; it runs every ten seconds from an
# external checker; a non-200 restarts the process; and the endpoint is cheap on
# purpose so the check never adds load.
#
# The endpoint answers by reading a flag a heartbeat thread refreshes. The
# heartbeat is not the request-processing loop.

8640 => probes_in_the_day
8640 => probes_that_got_200
10000 => reported_uptime_per_myriad
1440 => minutes_in_the_day
220 => minutes_the_request_loop_was_wedged
500 => requests_arriving_each_minute
0 => requests_served_while_wedged
0 => probes_that_exercised_the_request_path

minutes_in_the_day - minutes_the_request_loop_was_wedged => minutes_the_loop_ran
requests_arriving_each_minute * minutes_in_the_day => requests_in_the_day
requests_arriving_each_minute * minutes_the_request_loop_was_wedged => requests_lost
requests_in_the_day - requests_lost => requests_served
int(requests_served * 10000 / requests_in_the_day) => real_availability_per_myriad
minutes_the_request_loop_was_wedged * 60 => seconds_the_probe_answered_from_a_stale_flag

"probes in the day               : " + str(probes_in_the_day) ^0
"  that got 200                  : " + str(probes_that_got_200) ^0
"  that exercised the work path  : " + str(probes_that_exercised_the_request_path) ^0
"reported uptime                 : " + str(reported_uptime_per_myriad) + " per ten thousand" ^0
"" ^0
"minutes in the day              : " + str(minutes_in_the_day) ^0
"  the request loop ran          : " + str(minutes_the_loop_ran) ^0
"  the request loop was wedged   : " + str(minutes_the_request_loop_was_wedged) ^0
"requests in the day             : " + str(requests_in_the_day) ^0
"  lost while wedged             : " + str(requests_lost) ^0
"  served                        : " + str(requests_served) ^0
"real availability               : " + str(real_availability_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the probe verified ----

"the liveness probe" ^0
"  what it hits : an endpoint on the service, not a host" ^0
"    ping" ^0
"  how often : every ten seconds, externally" ^0
"  on a non-200 : the process is restarted" ^0
"  cost : cheap on purpose, so it adds no load" ^0
"  checks that got 200 : " + str(probes_that_got_200) ^0
"  verdict : ALIVE" ^0
"" ^0
"  restarting on a non-200 is the part almost nobody wires" ^0
"  up, and it is why a red probe here is believed" ^0
"" ^0

# ---- what the 200 was read from ----

"the endpoint's answer" ^0
"  what it returns : a flag refreshed by a heartbeat" ^0
"    thread" ^0
"  what refreshes the flag : a timer, not an arriving" ^0
"    request" ^0
"  seconds it kept answering from a stale flag : " ^0
"    " + str(seconds_the_probe_answered_from_a_stale_flag) ^0
"  probes that ran a real request : " ^0
"    " + str(probes_that_exercised_the_request_path) ^0
"  a cheap endpoint and the work path : share only the" ^0
"    process, not the code that was stuck" ^0
"" ^0

# ---- what the callers got ----

"the callers during the wedge" ^0
"  minutes their requests hung : " + str(minutes_the_request_loop_was_wedged) ^0
"  requests lost in those minutes : " + str(requests_lost) ^0
"  what the status page showed : ALIVE, uninterrupted" ^0
"  restarts triggered on their behalf : 0" ^0
"  real availability they saw : " ^0
"    " + str(real_availability_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same probe, pointed at an endpoint that enqueues a real request and waits
# for it to be served before answering.
10000 => nc_reported_uptime_per_myriad
8472 => nc_uptime_the_deep_probe_would_report_per_myriad
1320 => nc_probes_that_would_have_failed

"null control - a probe that waits for a served request" ^0
"  shallow probe uptime : " + str(nc_reported_uptime_per_myriad) + ", unchanged" ^0
"  deep probe uptime : " ^0
"    " + str(nc_uptime_the_deep_probe_would_report_per_myriad) + " per ten thousand" ^0
"  probes that would have failed : " ^0
"    " + str(nc_probes_that_would_have_failed) ^0
"  nothing about the outage changed; the check stopped" ^0
"  reading a flag and started doing the work" ^0
"" ^0

# ---- the rule ----

"what a passing liveness probe guarantees" ^0
"  the endpoint it hits returned 200 : exactly, every" ^0
"    ten seconds, all " + str(probes_in_the_day) + " of them" ^0
"  the service is doing its work : not addressed; the 200" ^0
"    is a flag a heartbeat writes, and the heartbeat kept" ^0
"    running while the request loop was wedged for " ^0
"    " + str(minutes_the_request_loop_was_wedged) + " minutes" ^0
"" ^0
"a probe measures the path it takes, and a path chosen to be" ^0
"cheap is chosen to avoid the work; a check that must not add" ^0
"load is a check that does not exercise the load" ^0
"" ^0

"It hits the service not the host, runs every ten seconds, and restarts on a" ^0
"non-200 - " + str(reported_uptime_per_myriad) + " per ten thousand, every probe green. The 200 is a heartbeat's" ^0
"flag, so the request loop was wedged for " + str(minutes_the_request_loop_was_wedged) + " minutes, lost " + str(requests_lost) + " requests," ^0
"and left real availability at " + str(real_availability_per_myriad) + " per ten thousand under " + str(probes_that_exercised_the_request_path) + " probes that ran the work." ^0
```

## Python (deterministic transpilation)

```python
probes_in_the_day = 8640
probes_that_got_200 = 8640
reported_uptime_per_myriad = 10000
minutes_in_the_day = 1440
minutes_the_request_loop_was_wedged = 220
requests_arriving_each_minute = 500
requests_served_while_wedged = 0
probes_that_exercised_the_request_path = 0
minutes_the_loop_ran = minutes_in_the_day - minutes_the_request_loop_was_wedged
requests_in_the_day = requests_arriving_each_minute * minutes_in_the_day
requests_lost = requests_arriving_each_minute * minutes_the_request_loop_was_wedged
requests_served = requests_in_the_day - requests_lost
real_availability_per_myriad = int(requests_served * 10000 / requests_in_the_day)
seconds_the_probe_answered_from_a_stale_flag = minutes_the_request_loop_was_wedged * 60
print("probes in the day               : " + str(probes_in_the_day))
print("  that got 200                  : " + str(probes_that_got_200))
print("  that exercised the work path  : " + str(probes_that_exercised_the_request_path))
print("reported uptime                 : " + str(reported_uptime_per_myriad) + " per ten thousand")
print("")
print("minutes in the day              : " + str(minutes_in_the_day))
print("  the request loop ran          : " + str(minutes_the_loop_ran))
print("  the request loop was wedged   : " + str(minutes_the_request_loop_was_wedged))
print("requests in the day             : " + str(requests_in_the_day))
print("  lost while wedged             : " + str(requests_lost))
print("  served                        : " + str(requests_served))
print("real availability               : " + str(real_availability_per_myriad) + " per ten thousand")
print("")
print("the liveness probe")
print("  what it hits : an endpoint on the service, not a host")
print("    ping")
print("  how often : every ten seconds, externally")
print("  on a non-200 : the process is restarted")
print("  cost : cheap on purpose, so it adds no load")
print("  checks that got 200 : " + str(probes_that_got_200))
print("  verdict : ALIVE")
print("")
print("  restarting on a non-200 is the part almost nobody wires")
print("  up, and it is why a red probe here is believed")
print("")
print("the endpoint's answer")
print("  what it returns : a flag refreshed by a heartbeat")
print("    thread")
print("  what refreshes the flag : a timer, not an arriving")
print("    request")
print("  seconds it kept answering from a stale flag : ")
print("    " + str(seconds_the_probe_answered_from_a_stale_flag))
print("  probes that ran a real request : ")
print("    " + str(probes_that_exercised_the_request_path))
print("  a cheap endpoint and the work path : share only the")
print("    process, not the code that was stuck")
print("")
print("the callers during the wedge")
print("  minutes their requests hung : " + str(minutes_the_request_loop_was_wedged))
print("  requests lost in those minutes : " + str(requests_lost))
print("  what the status page showed : ALIVE, uninterrupted")
print("  restarts triggered on their behalf : 0")
print("  real availability they saw : ")
print("    " + str(real_availability_per_myriad) + " per ten thousand")
print("")
nc_reported_uptime_per_myriad = 10000
nc_uptime_the_deep_probe_would_report_per_myriad = 8472
nc_probes_that_would_have_failed = 1320
print("null control - a probe that waits for a served request")
print("  shallow probe uptime : " + str(nc_reported_uptime_per_myriad) + ", unchanged")
print("  deep probe uptime : ")
print("    " + str(nc_uptime_the_deep_probe_would_report_per_myriad) + " per ten thousand")
print("  probes that would have failed : ")
print("    " + str(nc_probes_that_would_have_failed))
print("  nothing about the outage changed; the check stopped")
print("  reading a flag and started doing the work")
print("")
print("what a passing liveness probe guarantees")
print("  the endpoint it hits returned 200 : exactly, every")
print("    ten seconds, all " + str(probes_in_the_day) + " of them")
print("  the service is doing its work : not addressed; the 200")
print("    is a flag a heartbeat writes, and the heartbeat kept")
print("    running while the request loop was wedged for ")
print("    " + str(minutes_the_request_loop_was_wedged) + " minutes")
print("")
print("a probe measures the path it takes, and a path chosen to be")
print("cheap is chosen to avoid the work; a check that must not add")
print("load is a check that does not exercise the load")
print("")
print("It hits the service not the host, runs every ten seconds, and restarts on a")
print("non-200 - " + str(reported_uptime_per_myriad) + " per ten thousand, every probe green. The 200 is a heartbeat's")
print("flag, so the request loop was wedged for " + str(minutes_the_request_loop_was_wedged) + " minutes, lost " + str(requests_lost) + " requests,")
print("and left real availability at " + str(real_availability_per_myriad) + " per ten thousand under " + str(probes_that_exercised_the_request_path) + " probes that ran the work.")
```

## stdout (executed)

```text
probes in the day               : 8640
  that got 200                  : 8640
  that exercised the work path  : 0
reported uptime                 : 10000 per ten thousand

minutes in the day              : 1440
  the request loop ran          : 1220
  the request loop was wedged   : 220
requests in the day             : 720000
  lost while wedged             : 110000
  served                        : 610000
real availability               : 8472 per ten thousand

the liveness probe
  what it hits : an endpoint on the service, not a host
    ping
  how often : every ten seconds, externally
  on a non-200 : the process is restarted
  cost : cheap on purpose, so it adds no load
  checks that got 200 : 8640
  verdict : ALIVE

  restarting on a non-200 is the part almost nobody wires
  up, and it is why a red probe here is believed

the endpoint's answer
  what it returns : a flag refreshed by a heartbeat
    thread
  what refreshes the flag : a timer, not an arriving
    request
  seconds it kept answering from a stale flag : 
    13200
  probes that ran a real request : 
    0
  a cheap endpoint and the work path : share only the
    process, not the code that was stuck

the callers during the wedge
  minutes their requests hung : 220
  requests lost in those minutes : 110000
  what the status page showed : ALIVE, uninterrupted
  restarts triggered on their behalf : 0
  real availability they saw : 
    8472 per ten thousand

null control - a probe that waits for a served request
  shallow probe uptime : 10000, unchanged
  deep probe uptime : 
    8472 per ten thousand
  probes that would have failed : 
    1320
  nothing about the outage changed; the check stopped
  reading a flag and started doing the work

what a passing liveness probe guarantees
  the endpoint it hits returned 200 : exactly, every
    ten seconds, all 8640 of them
  the service is doing its work : not addressed; the 200
    is a flag a heartbeat writes, and the heartbeat kept
    running while the request loop was wedged for 
    220 minutes

a probe measures the path it takes, and a path chosen to be
cheap is chosen to avoid the work; a check that must not add
load is a check that does not exercise the load

It hits the service not the host, runs every ten seconds, and restarts on a
non-200 - 10000 per ten thousand, every probe green. The 200 is a heartbeat's
flag, so the request loop was wedged for 220 minutes, lost 110000 requests,
and left real availability at 8472 per ten thousand under 0 probes that ran the work.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
