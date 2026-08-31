<!-- canonical: efficientnewlanguage.org/ai/examples/632-the-config-reloaded-and-the-worker-kept-the-old-one | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 632 — The config reloaded and the worker kept the old one

`the_config_reloaded_and_the_worker_kept_the_old_one.eml` - The reload succeeded and the log line saying so is true. When the change reaches the last worker is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The reload
# succeeded and the log line saying so is true. When the change reaches the last
# worker is computed below.
#
# The reload works. The parent re-reads the file, validates it, applies it to
# its own state and logs the version it moved to. It is not a stub, it is not
# swallowing an error, and if the file were invalid it would refuse and say so.
# The line "config reloaded, version 41" means the parent is on version 41.
#
# Requests are not served by the parent. They are served by pre-forked workers
# holding the copy they inherited at fork, and a worker's copy changes when the
# worker is replaced, not when the parent reloads.
#
# Workers recycle after a fixed number of requests. Nobody chose that number as
# a propagation delay, and it is the propagation delay.

48 => workers
250000 => requests_before_a_worker_recycles
3100 => requests_per_second_total
0 => reload_failures

int(requests_per_second_total / workers) => requests_per_second_per_worker
int(requests_before_a_worker_recycles / requests_per_second_per_worker) => seconds_for_a_worker_to_recycle
int(seconds_for_a_worker_to_recycle / 60) => minutes_for_a_worker_to_recycle
# The parent applies it immediately; that is one process and it serves nothing.
1 => processes_on_the_new_config_at_once

"workers                        : " + str(workers) ^0
"requests before a worker recycles : " + str(requests_before_a_worker_recycles) ^0
"requests per second, total     : " + str(requests_per_second_total) ^0
"per worker                     : " + str(requests_per_second_per_worker) ^0
"seconds for a worker to recycle: " + str(seconds_for_a_worker_to_recycle) ^0
"minutes for a worker to recycle: " + str(minutes_for_a_worker_to_recycle) ^0
"" ^0

# ---- what the reload verified ----

"the reload" ^0
"  file re-read        : yes" ^0
"  validated           : yes" ^0
"  applied to          : the parent" ^0
"  failures            : " + str(reload_failures) ^0
"  logged              : config reloaded, version 41" ^0
"  verdict             : RELOADED" ^0
"" ^0
"  the line is true of the process that wrote it" ^0
"" ^0

# ---- who serves the requests ----

"immediately after the reload" ^0
"  processes on the new config : " + str(processes_on_the_new_config_at_once) + ", the parent" ^0
"  processes serving requests  : " + str(workers) ^0
"  workers on the new config   : 0" ^0
"  requests served with it     : 0" ^0
"" ^0
"  the reload is complete and no request has seen it" ^0
"" ^0

# ---- during an incident ----

# The change was a timeout reduction pushed as a mitigation at 14:02. The
# incident timeline records the mitigation at the reload, because that is when
# something happened that could be timestamped.
requests_per_second_total * seconds_for_a_worker_to_recycle => requests_served_on_the_old_config

"the mitigation" ^0
"  logged as applied at   : the reload" ^0
"  reaches the last worker: " + str(minutes_for_a_worker_to_recycle) + " minutes later" ^0
"  requests served on the old config in between : " ^0
"    " + str(requests_served_on_the_old_config) ^0
"  the graph recovers gradually and reads like the fix" ^0
"    taking hold, which is what a staged rollout looks like" ^0
"    and what this is not" ^0
"" ^0

84 => incident_minutes
int(minutes_for_a_worker_to_recycle * 10000 / incident_minutes) => propagation_per_myriad
"incident length, minutes : " + str(incident_minutes) ^0
"the mitigation was still propagating for : " + str(propagation_per_myriad) + " per ten thousand of it" ^0
"" ^0

# ---- null control ----

# The same reload, with the parent signalling workers to re-read after finishing
# the request in flight.
0 => nc_requests_served_on_the_old_config
1 => nc_seconds_to_full_propagation

"null control - workers re-read on the parent's signal" ^0
"  reload failures : " + str(reload_failures) + ", unchanged" ^0
"  seconds to full propagation : " + str(nc_seconds_to_full_propagation) ^0
"  requests on the old config  : " + str(nc_requests_served_on_the_old_config) ^0
"  the reload did not get better; the processes that serve" ^0
"  requests were included in it" ^0
"" ^0

# ---- the rule ----

"what a successful reload guarantees" ^0
"  the process that reloaded holds the new config : exactly" ^0
"  requests are served with it                    : not" ^0
"    addressed, wherever the serving happens somewhere the" ^0
"    reload did not reach" ^0
"" ^0
"the recycle count is a resource-hygiene number that became a" ^0
"deployment latency; nobody reviews it in that role because" ^0
"nothing in the system writes it down as one" ^0
"" ^0

"The reload succeeded and the log line is true: the file was re-read, validated," ^0
"applied, " + str(reload_failures) + " failures. The parent serves no requests, so " + str(workers) + " workers keep the" ^0
"copy they forked with until they recycle after " + str(requests_before_a_worker_recycles) + " requests - " + str(minutes_for_a_worker_to_recycle) + " minutes -" ^0
"and " + str(requests_served_on_the_old_config) + " requests are served on the old config first - still" ^0
"propagating for " + str(propagation_per_myriad) + " per ten thousand of the " + str(incident_minutes) + "-minute incident, on a curve" ^0
"that reads like the mitigation taking hold." ^0
```

## Python (deterministic transpilation)

```python
workers = 48
requests_before_a_worker_recycles = 250000
requests_per_second_total = 3100
reload_failures = 0
requests_per_second_per_worker = int(requests_per_second_total / workers)
seconds_for_a_worker_to_recycle = int(requests_before_a_worker_recycles / requests_per_second_per_worker)
minutes_for_a_worker_to_recycle = int(seconds_for_a_worker_to_recycle / 60)
processes_on_the_new_config_at_once = 1
print("workers                        : " + str(workers))
print("requests before a worker recycles : " + str(requests_before_a_worker_recycles))
print("requests per second, total     : " + str(requests_per_second_total))
print("per worker                     : " + str(requests_per_second_per_worker))
print("seconds for a worker to recycle: " + str(seconds_for_a_worker_to_recycle))
print("minutes for a worker to recycle: " + str(minutes_for_a_worker_to_recycle))
print("")
print("the reload")
print("  file re-read        : yes")
print("  validated           : yes")
print("  applied to          : the parent")
print("  failures            : " + str(reload_failures))
print("  logged              : config reloaded, version 41")
print("  verdict             : RELOADED")
print("")
print("  the line is true of the process that wrote it")
print("")
print("immediately after the reload")
print("  processes on the new config : " + str(processes_on_the_new_config_at_once) + ", the parent")
print("  processes serving requests  : " + str(workers))
print("  workers on the new config   : 0")
print("  requests served with it     : 0")
print("")
print("  the reload is complete and no request has seen it")
print("")
requests_served_on_the_old_config = requests_per_second_total * seconds_for_a_worker_to_recycle
print("the mitigation")
print("  logged as applied at   : the reload")
print("  reaches the last worker: " + str(minutes_for_a_worker_to_recycle) + " minutes later")
print("  requests served on the old config in between : ")
print("    " + str(requests_served_on_the_old_config))
print("  the graph recovers gradually and reads like the fix")
print("    taking hold, which is what a staged rollout looks like")
print("    and what this is not")
print("")
incident_minutes = 84
propagation_per_myriad = int(minutes_for_a_worker_to_recycle * 10000 / incident_minutes)
print("incident length, minutes : " + str(incident_minutes))
print("the mitigation was still propagating for : " + str(propagation_per_myriad) + " per ten thousand of it")
print("")
nc_requests_served_on_the_old_config = 0
nc_seconds_to_full_propagation = 1
print("null control - workers re-read on the parent's signal")
print("  reload failures : " + str(reload_failures) + ", unchanged")
print("  seconds to full propagation : " + str(nc_seconds_to_full_propagation))
print("  requests on the old config  : " + str(nc_requests_served_on_the_old_config))
print("  the reload did not get better; the processes that serve")
print("  requests were included in it")
print("")
print("what a successful reload guarantees")
print("  the process that reloaded holds the new config : exactly")
print("  requests are served with it                    : not")
print("    addressed, wherever the serving happens somewhere the")
print("    reload did not reach")
print("")
print("the recycle count is a resource-hygiene number that became a")
print("deployment latency; nobody reviews it in that role because")
print("nothing in the system writes it down as one")
print("")
print("The reload succeeded and the log line is true: the file was re-read, validated,")
print("applied, " + str(reload_failures) + " failures. The parent serves no requests, so " + str(workers) + " workers keep the")
print("copy they forked with until they recycle after " + str(requests_before_a_worker_recycles) + " requests - " + str(minutes_for_a_worker_to_recycle) + " minutes -")
print("and " + str(requests_served_on_the_old_config) + " requests are served on the old config first - still")
print("propagating for " + str(propagation_per_myriad) + " per ten thousand of the " + str(incident_minutes) + "-minute incident, on a curve")
print("that reads like the mitigation taking hold.")
```

## stdout (executed)

```text
workers                        : 48
requests before a worker recycles : 250000
requests per second, total     : 3100
per worker                     : 64
seconds for a worker to recycle: 3906
minutes for a worker to recycle: 65

the reload
  file re-read        : yes
  validated           : yes
  applied to          : the parent
  failures            : 0
  logged              : config reloaded, version 41
  verdict             : RELOADED

  the line is true of the process that wrote it

immediately after the reload
  processes on the new config : 1, the parent
  processes serving requests  : 48
  workers on the new config   : 0
  requests served with it     : 0

  the reload is complete and no request has seen it

the mitigation
  logged as applied at   : the reload
  reaches the last worker: 65 minutes later
  requests served on the old config in between : 
    12108600
  the graph recovers gradually and reads like the fix
    taking hold, which is what a staged rollout looks like
    and what this is not

incident length, minutes : 84
the mitigation was still propagating for : 7738 per ten thousand of it

null control - workers re-read on the parent's signal
  reload failures : 0, unchanged
  seconds to full propagation : 1
  requests on the old config  : 0
  the reload did not get better; the processes that serve
  requests were included in it

what a successful reload guarantees
  the process that reloaded holds the new config : exactly
  requests are served with it                    : not
    addressed, wherever the serving happens somewhere the
    reload did not reach

the recycle count is a resource-hygiene number that became a
deployment latency; nobody reviews it in that role because
nothing in the system writes it down as one

The reload succeeded and the log line is true: the file was re-read, validated,
applied, 0 failures. The parent serves no requests, so 48 workers keep the
copy they forked with until they recycle after 250000 requests - 65 minutes -
and 12108600 requests are served on the old config first - still
propagating for 7738 per ten thousand of the 84-minute incident, on a curve
that reads like the mitigation taking hold.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
