<!-- canonical: efficientnewlanguage.org/ai/examples/758-the-probe-ran-inside-the-container-and-the-sidecar-was-the-dependency | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 758 — The probe ran inside the container and the sidecar was the dependency

`the_probe_ran_inside_the_container_and_the_sidecar_was_the_dependency.eml` - The liveness probe executes inside the container, exercises a real code path rather than a static handler, and has restarted forty-one genuinely wedged processes. What it can observe is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The liveness probe
# executes inside the container, exercises a real code path rather than a static
# handler, and has restarted forty-one genuinely wedged processes. What it can
# observe is computed below.
#
# The probe is the good kind. It is not a handler that returns 200 unless the
# process is dead, which restarts nothing that was ever going to fail; it runs a
# small real query through the same connection pool the request path uses, so a
# wedged pool is visible; it has a timeout of its own; and it has restarted
# forty-one processes that were genuinely stuck, each confirmed from the logs.
#
# The probe runs INSIDE the application container. Every outbound call the
# application makes goes through a sidecar proxy in the same pod, and the probe
# reaches its database through the sidecar too.
#
# When the sidecar is the thing that is wedged, the probe fails with it.

41 => processes_restarted_while_genuinely_wedged
1 => containers_the_probe_runs_inside
1 => sidecars_in_the_pod
2 => containers_in_the_pod
0 => probes_that_run_outside_the_application_container
0 => probes_targeting_the_sidecar_directly
9 => sidecar_wedges_last_year
9 => sidecar_wedges_where_the_probe_also_failed
0 => sidecar_wedges_the_probe_distinguished

containers_in_the_pod - containers_the_probe_runs_inside => containers_the_probe_does_not_observe
int(containers_the_probe_runs_inside * 10000 / containers_in_the_pod) => observed_per_myriad
sidecar_wedges_last_year - sidecar_wedges_the_probe_distinguished => wedges_reported_as_an_application_failure

"processes restarted while wedged: " + str(processes_restarted_while_genuinely_wedged) ^0
"containers in the pod           : " + str(containers_in_the_pod) ^0
"  the probe runs inside         : " + str(containers_the_probe_runs_inside) ^0
"  it does not observe           : " + str(containers_the_probe_does_not_observe) ^0
"  share observed                : " + str(observed_per_myriad) + " per ten thousand" ^0
"probes running outside the app container : " + str(probes_that_run_outside_the_application_container) ^0
"probes targeting the sidecar directly    : " + str(probes_targeting_the_sidecar_directly) ^0
"" ^0
"sidecar wedges last year        : " + str(sidecar_wedges_last_year) ^0
"  where the probe also failed   : " + str(sidecar_wedges_where_the_probe_also_failed) ^0
"  the probe distinguished       : " + str(sidecar_wedges_the_probe_distinguished) ^0
"  reported as an app failure    : " + str(wedges_reported_as_an_application_failure) ^0
"" ^0

# ---- what the probe verified ----

"the liveness probe" ^0
"  what it is not : a handler returning 200 unless the" ^0
"    process is dead" ^0
"  what it runs   : a small real query, through the same" ^0
"    connection pool the request path uses" ^0
"  so a wedged pool is : visible" ^0
"  does it have its own timeout : yes" ^0
"  processes it restarted while genuinely stuck : " ^0
"    " + str(processes_restarted_while_genuinely_wedged) + ", each confirmed from the logs" ^0
"  verdict : EXERCISES A REAL PATH" ^0
"" ^0
"  sharing the request path's pool rather than answering" ^0
"  from a static handler is what makes this probe useful" ^0
"" ^0

# ---- what it shares with the thing it is testing ----

"the probe's own path" ^0
"  where it executes : the application container" ^0
"  how its query leaves the pod : through the sidecar" ^0
"  which the application also uses : the same one" ^0
"  so a wedged sidecar affects : both" ^0
"  containers the probe can report on : " + str(containers_the_probe_runs_inside) + " of " + str(containers_in_the_pod) ^0
"  probes targeting the sidecar : " + str(probes_targeting_the_sidecar_directly) ^0
"" ^0
"  the probe is inside the failure domain it reports on," ^0
"  which is why it can see a wedged pool and cannot say" ^0
"  which of two containers is wedged" ^0
"" ^0

# ---- what the restart does ----

# A failing probe restarts the application container. When the sidecar is the
# problem the restart is real, fast, and aimed at the wrong container - and the
# new process fails its first probe for the same reason.
"the remediation" ^0
"  what a failed probe restarts : the application" ^0
"    container" ^0
"  what was wedged in those " + str(sidecar_wedges_last_year) + " cases : the sidecar" ^0
"  does the restart clear it : no" ^0
"  what the new process does : fails its first probe, for" ^0
"    the same reason" ^0
"  what that produces : a restart loop attributed to the" ^0
"    application" ^0
"  cases the probe distinguished : " + str(sidecar_wedges_the_probe_distinguished) ^0
"" ^0

# ---- why the incident record says the application ----

"the evidence a responder sees" ^0
"  probe failures : yes, on the application container" ^0
"  restarts       : yes, of the application container" ^0
"  sidecar metrics: exported, on a different dashboard" ^0
"  a signal that separates them : " + str(probes_that_run_outside_the_application_container) ^0
"  so the first hypothesis is : the application" ^0
"  wedges recorded that way : " + str(wedges_reported_as_an_application_failure) + " of " + str(sidecar_wedges_last_year) ^0
"" ^0

# ---- null control ----

# The same probe, plus one that runs outside the pod and one that targets the
# sidecar's own admin port, so the two containers can disagree.
1 => nc_probes_that_run_outside_the_application_container
1 => nc_probes_targeting_the_sidecar_directly
sidecar_wedges_last_year => nc_sidecar_wedges_distinguished

"null control - a probe that is not inside the failure" ^0
"  processes restarted while wedged : " + str(processes_restarted_while_genuinely_wedged) + ", unchanged" ^0
"  probes outside the application container : " ^0
"    " + str(nc_probes_that_run_outside_the_application_container) ^0
"  probes targeting the sidecar : " + str(nc_probes_targeting_the_sidecar_directly) ^0
"  sidecar wedges distinguished : " + str(nc_sidecar_wedges_distinguished) ^0
"  the probe did not get better; a second observer appeared" ^0
"  that does not share the failure" ^0
"" ^0

# ---- the rule ----

"what a real-path liveness probe guarantees" ^0
"  this process can still do work : exactly, through the" ^0
"    same pool the request path uses" ^0
"  this process is the one that is broken : not addressed;" ^0
"    the probe travels the application's path and reports" ^0
"    a failure anywhere along it as the application's" ^0
"" ^0
"a probe that shares a dependency with the thing it tests" ^0
"cannot attribute; making it exercise a real path is what" ^0
"gives it power and is exactly what puts it inside the" ^0
"failure domain, and the remediation is aimed by the label" ^0
"" ^0

"The probe runs a real query through the request path's own pool rather than" ^0
"answering from a static handler, and it has restarted " + str(processes_restarted_while_genuinely_wedged) + " genuinely wedged" ^0
"processes. It executes in " + str(containers_the_probe_runs_inside) + " of " + str(containers_in_the_pod) + " containers and leaves through the sidecar," ^0
"so all " + str(sidecar_wedges_last_year) + " sidecar wedges last year failed the probe too - " + str(sidecar_wedges_the_probe_distinguished) + " were" ^0
"distinguished, and " + str(wedges_reported_as_an_application_failure) + " were recorded as application failures." ^0
```

## Python (deterministic transpilation)

```python
processes_restarted_while_genuinely_wedged = 41
containers_the_probe_runs_inside = 1
sidecars_in_the_pod = 1
containers_in_the_pod = 2
probes_that_run_outside_the_application_container = 0
probes_targeting_the_sidecar_directly = 0
sidecar_wedges_last_year = 9
sidecar_wedges_where_the_probe_also_failed = 9
sidecar_wedges_the_probe_distinguished = 0
containers_the_probe_does_not_observe = containers_in_the_pod - containers_the_probe_runs_inside
observed_per_myriad = int(containers_the_probe_runs_inside * 10000 / containers_in_the_pod)
wedges_reported_as_an_application_failure = sidecar_wedges_last_year - sidecar_wedges_the_probe_distinguished
print("processes restarted while wedged: " + str(processes_restarted_while_genuinely_wedged))
print("containers in the pod           : " + str(containers_in_the_pod))
print("  the probe runs inside         : " + str(containers_the_probe_runs_inside))
print("  it does not observe           : " + str(containers_the_probe_does_not_observe))
print("  share observed                : " + str(observed_per_myriad) + " per ten thousand")
print("probes running outside the app container : " + str(probes_that_run_outside_the_application_container))
print("probes targeting the sidecar directly    : " + str(probes_targeting_the_sidecar_directly))
print("")
print("sidecar wedges last year        : " + str(sidecar_wedges_last_year))
print("  where the probe also failed   : " + str(sidecar_wedges_where_the_probe_also_failed))
print("  the probe distinguished       : " + str(sidecar_wedges_the_probe_distinguished))
print("  reported as an app failure    : " + str(wedges_reported_as_an_application_failure))
print("")
print("the liveness probe")
print("  what it is not : a handler returning 200 unless the")
print("    process is dead")
print("  what it runs   : a small real query, through the same")
print("    connection pool the request path uses")
print("  so a wedged pool is : visible")
print("  does it have its own timeout : yes")
print("  processes it restarted while genuinely stuck : ")
print("    " + str(processes_restarted_while_genuinely_wedged) + ", each confirmed from the logs")
print("  verdict : EXERCISES A REAL PATH")
print("")
print("  sharing the request path's pool rather than answering")
print("  from a static handler is what makes this probe useful")
print("")
print("the probe's own path")
print("  where it executes : the application container")
print("  how its query leaves the pod : through the sidecar")
print("  which the application also uses : the same one")
print("  so a wedged sidecar affects : both")
print("  containers the probe can report on : " + str(containers_the_probe_runs_inside) + " of " + str(containers_in_the_pod))
print("  probes targeting the sidecar : " + str(probes_targeting_the_sidecar_directly))
print("")
print("  the probe is inside the failure domain it reports on,")
print("  which is why it can see a wedged pool and cannot say")
print("  which of two containers is wedged")
print("")
print("the remediation")
print("  what a failed probe restarts : the application")
print("    container")
print("  what was wedged in those " + str(sidecar_wedges_last_year) + " cases : the sidecar")
print("  does the restart clear it : no")
print("  what the new process does : fails its first probe, for")
print("    the same reason")
print("  what that produces : a restart loop attributed to the")
print("    application")
print("  cases the probe distinguished : " + str(sidecar_wedges_the_probe_distinguished))
print("")
print("the evidence a responder sees")
print("  probe failures : yes, on the application container")
print("  restarts       : yes, of the application container")
print("  sidecar metrics: exported, on a different dashboard")
print("  a signal that separates them : " + str(probes_that_run_outside_the_application_container))
print("  so the first hypothesis is : the application")
print("  wedges recorded that way : " + str(wedges_reported_as_an_application_failure) + " of " + str(sidecar_wedges_last_year))
print("")
nc_probes_that_run_outside_the_application_container = 1
nc_probes_targeting_the_sidecar_directly = 1
nc_sidecar_wedges_distinguished = sidecar_wedges_last_year
print("null control - a probe that is not inside the failure")
print("  processes restarted while wedged : " + str(processes_restarted_while_genuinely_wedged) + ", unchanged")
print("  probes outside the application container : ")
print("    " + str(nc_probes_that_run_outside_the_application_container))
print("  probes targeting the sidecar : " + str(nc_probes_targeting_the_sidecar_directly))
print("  sidecar wedges distinguished : " + str(nc_sidecar_wedges_distinguished))
print("  the probe did not get better; a second observer appeared")
print("  that does not share the failure")
print("")
print("what a real-path liveness probe guarantees")
print("  this process can still do work : exactly, through the")
print("    same pool the request path uses")
print("  this process is the one that is broken : not addressed;")
print("    the probe travels the application's path and reports")
print("    a failure anywhere along it as the application's")
print("")
print("a probe that shares a dependency with the thing it tests")
print("cannot attribute; making it exercise a real path is what")
print("gives it power and is exactly what puts it inside the")
print("failure domain, and the remediation is aimed by the label")
print("")
print("The probe runs a real query through the request path's own pool rather than")
print("answering from a static handler, and it has restarted " + str(processes_restarted_while_genuinely_wedged) + " genuinely wedged")
print("processes. It executes in " + str(containers_the_probe_runs_inside) + " of " + str(containers_in_the_pod) + " containers and leaves through the sidecar,")
print("so all " + str(sidecar_wedges_last_year) + " sidecar wedges last year failed the probe too - " + str(sidecar_wedges_the_probe_distinguished) + " were")
print("distinguished, and " + str(wedges_reported_as_an_application_failure) + " were recorded as application failures.")
```

## stdout (executed)

```text
processes restarted while wedged: 41
containers in the pod           : 2
  the probe runs inside         : 1
  it does not observe           : 1
  share observed                : 5000 per ten thousand
probes running outside the app container : 0
probes targeting the sidecar directly    : 0

sidecar wedges last year        : 9
  where the probe also failed   : 9
  the probe distinguished       : 0
  reported as an app failure    : 9

the liveness probe
  what it is not : a handler returning 200 unless the
    process is dead
  what it runs   : a small real query, through the same
    connection pool the request path uses
  so a wedged pool is : visible
  does it have its own timeout : yes
  processes it restarted while genuinely stuck : 
    41, each confirmed from the logs
  verdict : EXERCISES A REAL PATH

  sharing the request path's pool rather than answering
  from a static handler is what makes this probe useful

the probe's own path
  where it executes : the application container
  how its query leaves the pod : through the sidecar
  which the application also uses : the same one
  so a wedged sidecar affects : both
  containers the probe can report on : 1 of 2
  probes targeting the sidecar : 0

  the probe is inside the failure domain it reports on,
  which is why it can see a wedged pool and cannot say
  which of two containers is wedged

the remediation
  what a failed probe restarts : the application
    container
  what was wedged in those 9 cases : the sidecar
  does the restart clear it : no
  what the new process does : fails its first probe, for
    the same reason
  what that produces : a restart loop attributed to the
    application
  cases the probe distinguished : 0

the evidence a responder sees
  probe failures : yes, on the application container
  restarts       : yes, of the application container
  sidecar metrics: exported, on a different dashboard
  a signal that separates them : 0
  so the first hypothesis is : the application
  wedges recorded that way : 9 of 9

null control - a probe that is not inside the failure
  processes restarted while wedged : 41, unchanged
  probes outside the application container : 
    1
  probes targeting the sidecar : 1
  sidecar wedges distinguished : 9
  the probe did not get better; a second observer appeared
  that does not share the failure

what a real-path liveness probe guarantees
  this process can still do work : exactly, through the
    same pool the request path uses
  this process is the one that is broken : not addressed;
    the probe travels the application's path and reports
    a failure anywhere along it as the application's

a probe that shares a dependency with the thing it tests
cannot attribute; making it exercise a real path is what
gives it power and is exactly what puts it inside the
failure domain, and the remediation is aimed by the label

The probe runs a real query through the request path's own pool rather than
answering from a static handler, and it has restarted 41 genuinely wedged
processes. It executes in 1 of 2 containers and leaves through the sidecar,
so all 9 sidecar wedges last year failed the probe too - 0 were
distinguished, and 9 were recorded as application failures.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
