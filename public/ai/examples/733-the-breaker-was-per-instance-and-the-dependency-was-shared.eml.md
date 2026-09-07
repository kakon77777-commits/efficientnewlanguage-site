<!-- canonical: efficientnewlanguage.org/ai/examples/733-the-breaker-was-per-instance-and-the-dependency-was-shared | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 733 — The breaker was per instance and the dependency was shared

`the_breaker_was_per_instance_and_the_dependency_was_shared.eml` - The circuit breaker is per dependency, trips on consecutive failures, probes with a single half-open call, and it demonstrably shed load during a real outage. Where it lives is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The circuit
# breaker is per dependency, trips on consecutive failures, probes with a single
# half-open call, and it demonstrably shed load during a real outage. Where it
# lives is computed below.
#
# The breaker is properly implemented. It is per dependency rather than global,
# so one sick backend does not open the path to a healthy one; it trips on
# consecutive failures rather than a rate, so a single blip does not open it;
# recovery is a single half-open probe rather than a flood; and during the
# March outage it cut the error path from a full timeout to an immediate
# rejection, which is what kept the front end responsive.
#
# The breaker is an object in a process. Two hundred forty processes hold two
# hundred forty of them, and the dependency they protect is one.
#
# Nothing is shared between them.

240 => instances
1 => breakers_per_instance_per_dependency
20 => consecutive_failures_to_trip
1 => half_open_probes_per_instance_per_interval
30 => probe_interval_seconds
0 => breaker_state_shared_between_instances
1 => dependencies_being_protected
60 => seconds_in_a_minute

instances * breakers_per_instance_per_dependency => breakers_protecting_this_dependency
instances * consecutive_failures_to_trip => failed_calls_before_the_whole_fleet_is_open
instances * half_open_probes_per_instance_per_interval => probes_per_interval_against_a_dead_dependency
int(seconds_in_a_minute / probe_interval_seconds) => probe_intervals_per_minute
probes_per_interval_against_a_dead_dependency * probe_intervals_per_minute => probes_per_minute_against_a_dead_dependency

"instances                       : " + str(instances) ^0
"dependencies being protected    : " + str(dependencies_being_protected) ^0
"breakers protecting it          : " + str(breakers_protecting_this_dependency) ^0
"breaker state shared            : " + str(breaker_state_shared_between_instances) ^0
"" ^0
"consecutive failures to trip one: " + str(consecutive_failures_to_trip) ^0
"failed calls before the fleet is open : " + str(failed_calls_before_the_whole_fleet_is_open) ^0
"" ^0
"half-open probes per instance   : " + str(half_open_probes_per_instance_per_interval) ^0
"probe interval, seconds         : " + str(probe_interval_seconds) ^0
"probes per interval, fleet-wide : " + str(probes_per_interval_against_a_dead_dependency) ^0
"probes per minute against a dead dependency : " + str(probes_per_minute_against_a_dead_dependency) ^0
"" ^0

# ---- what the breaker verified ----

"the circuit breaker" ^0
"  scope of one breaker : per dependency, not global" ^0
"  trips on : consecutive failures, not a rate, so a blip" ^0
"    does not open it" ^0
"  recovery : a single half-open probe, not a flood" ^0
"  measured in the March outage : the error path went from" ^0
"    a full timeout to an immediate rejection" ^0
"  verdict : PROTECTS THE CALLER" ^0
"" ^0
"  per dependency rather than global is the design decision" ^0
"  that makes a breaker useful instead of dangerous" ^0
"" ^0

# ---- which side it protects ----

"the two things a breaker can do" ^0
"  stop this process waiting on a dead dependency : yes," ^0
"    completely, and that is what it is for" ^0
"  stop the dependency being called while it is dead : that" ^0
"    is a property of the fleet, not of a process" ^0
"  processes holding one : " + str(instances) ^0
"  state shared between them : " + str(breaker_state_shared_between_instances) ^0
"  so each one learns the outage : independently" ^0
"" ^0
"  the guarantee is local and correct, and the quantity the" ^0
"  dependency experiences is a sum over all of them" ^0
"" ^0
# ---- what the dependency experiences ----

# From the failing service's side, the fleet does not have a breaker. It has two
# hundred and forty independent learners, each of which must be taught the same
# lesson at its own cost, and each of which then knocks once every interval to
# ask whether the lesson is over.
"from the dependency's side" ^0
"  calls it must fail to open one breaker : " + str(consecutive_failures_to_trip) ^0
"  calls it must fail to open all of them : " + str(failed_calls_before_the_whole_fleet_is_open) ^0
"  probes it receives per minute while dead : " + str(probes_per_minute_against_a_dead_dependency) ^0
"  what those probes are : correct, minimal, one per" ^0
"    instance per interval" ^0
"  what they are in aggregate : steady traffic to" ^0
"    something that is trying to restart" ^0
"" ^0

# ---- the recovery is the part that compounds ----

# A single half-open probe per instance is the gentlest possible recovery
# policy, chosen exactly to avoid a thundering herd. Multiplied by the fleet it
# is a herd, and it arrives at the moment the dependency first answers.
"the moment it comes back" ^0
"  probes in flight when it first answers : " + str(probes_per_interval_against_a_dead_dependency) ^0
"  each of them succeeding : yes" ^0
"  what each instance does then : closes its breaker and" ^0
"    resumes full traffic" ^0
"  how many do that : all of them, at once" ^0
"  what the policy was designed to prevent : exactly this" ^0
"  is the policy wrong : no; it is per instance" ^0
"" ^0

# ---- what the outage graph showed ----

"why March looked like a success" ^0
"  front end responsive : yes, measured" ^0
"  error path latency   : cut, measured" ^0
"  the metric watched   : this service's own latency" ^0
"  the dependency's inbound rate during its outage : not on" ^0
"    that graph, and it is on the dependency's" ^0
"  who read both together : nobody" ^0
"" ^0

# ---- null control ----

# The same breaker, with its state in a shared store: the fleet opens once and
# one instance holds the probe token.
1 => nc_breakers_protecting_this_dependency
consecutive_failures_to_trip => nc_failed_calls_before_the_fleet_is_open
half_open_probes_per_instance_per_interval => nc_probes_per_interval

"null control - one breaker for the fleet" ^0
"  scope per dependency : unchanged" ^0
"  breakers protecting it : " + str(nc_breakers_protecting_this_dependency) ^0
"  failed calls before the fleet is open : " + str(nc_failed_calls_before_the_fleet_is_open) ^0
"  probes per interval : " + str(nc_probes_per_interval) ^0
"  the policy did not change; the object holding it stopped" ^0
"  being one per process" ^0
"" ^0

# ---- the rule ----

"what a per-instance breaker guarantees" ^0
"  this process stops waiting on a dead dependency :" ^0
"    exactly, and it is what kept the front end up" ^0
"  the dead dependency stops being called : not addressed;" ^0
"    that is a claim about " + str(instances) + " processes and the breaker" ^0
"    is a claim about one" ^0
"" ^0
"a protection installed per instance is multiplied by the" ^0
"instance count wherever it touches something shared; the" ^0
"gentlest per-process policy is still a fleet-sized policy" ^0
"when the thing it is gentle towards is singular" ^0
"" ^0

"The breaker is per dependency rather than global, trips on " + str(consecutive_failures_to_trip) + " consecutive" ^0
"failures rather than a rate, recovers with " + str(half_open_probes_per_instance_per_interval) + " half-open probe, and in March it" ^0
"cut the error path from a full timeout to an immediate rejection. It is an" ^0
"object in a process and there are " + str(instances) + " of them with " + str(breaker_state_shared_between_instances) + " shared state, so the" ^0
"dependency must fail " + str(failed_calls_before_the_whole_fleet_is_open) + " calls to be shut out and receives " + str(probes_per_minute_against_a_dead_dependency) + " probes a minute" ^0
"while it is down." ^0
```

## Python (deterministic transpilation)

```python
instances = 240
breakers_per_instance_per_dependency = 1
consecutive_failures_to_trip = 20
half_open_probes_per_instance_per_interval = 1
probe_interval_seconds = 30
breaker_state_shared_between_instances = 0
dependencies_being_protected = 1
seconds_in_a_minute = 60
breakers_protecting_this_dependency = instances * breakers_per_instance_per_dependency
failed_calls_before_the_whole_fleet_is_open = instances * consecutive_failures_to_trip
probes_per_interval_against_a_dead_dependency = instances * half_open_probes_per_instance_per_interval
probe_intervals_per_minute = int(seconds_in_a_minute / probe_interval_seconds)
probes_per_minute_against_a_dead_dependency = probes_per_interval_against_a_dead_dependency * probe_intervals_per_minute
print("instances                       : " + str(instances))
print("dependencies being protected    : " + str(dependencies_being_protected))
print("breakers protecting it          : " + str(breakers_protecting_this_dependency))
print("breaker state shared            : " + str(breaker_state_shared_between_instances))
print("")
print("consecutive failures to trip one: " + str(consecutive_failures_to_trip))
print("failed calls before the fleet is open : " + str(failed_calls_before_the_whole_fleet_is_open))
print("")
print("half-open probes per instance   : " + str(half_open_probes_per_instance_per_interval))
print("probe interval, seconds         : " + str(probe_interval_seconds))
print("probes per interval, fleet-wide : " + str(probes_per_interval_against_a_dead_dependency))
print("probes per minute against a dead dependency : " + str(probes_per_minute_against_a_dead_dependency))
print("")
print("the circuit breaker")
print("  scope of one breaker : per dependency, not global")
print("  trips on : consecutive failures, not a rate, so a blip")
print("    does not open it")
print("  recovery : a single half-open probe, not a flood")
print("  measured in the March outage : the error path went from")
print("    a full timeout to an immediate rejection")
print("  verdict : PROTECTS THE CALLER")
print("")
print("  per dependency rather than global is the design decision")
print("  that makes a breaker useful instead of dangerous")
print("")
print("the two things a breaker can do")
print("  stop this process waiting on a dead dependency : yes,")
print("    completely, and that is what it is for")
print("  stop the dependency being called while it is dead : that")
print("    is a property of the fleet, not of a process")
print("  processes holding one : " + str(instances))
print("  state shared between them : " + str(breaker_state_shared_between_instances))
print("  so each one learns the outage : independently")
print("")
print("  the guarantee is local and correct, and the quantity the")
print("  dependency experiences is a sum over all of them")
print("")
print("from the dependency's side")
print("  calls it must fail to open one breaker : " + str(consecutive_failures_to_trip))
print("  calls it must fail to open all of them : " + str(failed_calls_before_the_whole_fleet_is_open))
print("  probes it receives per minute while dead : " + str(probes_per_minute_against_a_dead_dependency))
print("  what those probes are : correct, minimal, one per")
print("    instance per interval")
print("  what they are in aggregate : steady traffic to")
print("    something that is trying to restart")
print("")
print("the moment it comes back")
print("  probes in flight when it first answers : " + str(probes_per_interval_against_a_dead_dependency))
print("  each of them succeeding : yes")
print("  what each instance does then : closes its breaker and")
print("    resumes full traffic")
print("  how many do that : all of them, at once")
print("  what the policy was designed to prevent : exactly this")
print("  is the policy wrong : no; it is per instance")
print("")
print("why March looked like a success")
print("  front end responsive : yes, measured")
print("  error path latency   : cut, measured")
print("  the metric watched   : this service's own latency")
print("  the dependency's inbound rate during its outage : not on")
print("    that graph, and it is on the dependency's")
print("  who read both together : nobody")
print("")
nc_breakers_protecting_this_dependency = 1
nc_failed_calls_before_the_fleet_is_open = consecutive_failures_to_trip
nc_probes_per_interval = half_open_probes_per_instance_per_interval
print("null control - one breaker for the fleet")
print("  scope per dependency : unchanged")
print("  breakers protecting it : " + str(nc_breakers_protecting_this_dependency))
print("  failed calls before the fleet is open : " + str(nc_failed_calls_before_the_fleet_is_open))
print("  probes per interval : " + str(nc_probes_per_interval))
print("  the policy did not change; the object holding it stopped")
print("  being one per process")
print("")
print("what a per-instance breaker guarantees")
print("  this process stops waiting on a dead dependency :")
print("    exactly, and it is what kept the front end up")
print("  the dead dependency stops being called : not addressed;")
print("    that is a claim about " + str(instances) + " processes and the breaker")
print("    is a claim about one")
print("")
print("a protection installed per instance is multiplied by the")
print("instance count wherever it touches something shared; the")
print("gentlest per-process policy is still a fleet-sized policy")
print("when the thing it is gentle towards is singular")
print("")
print("The breaker is per dependency rather than global, trips on " + str(consecutive_failures_to_trip) + " consecutive")
print("failures rather than a rate, recovers with " + str(half_open_probes_per_instance_per_interval) + " half-open probe, and in March it")
print("cut the error path from a full timeout to an immediate rejection. It is an")
print("object in a process and there are " + str(instances) + " of them with " + str(breaker_state_shared_between_instances) + " shared state, so the")
print("dependency must fail " + str(failed_calls_before_the_whole_fleet_is_open) + " calls to be shut out and receives " + str(probes_per_minute_against_a_dead_dependency) + " probes a minute")
print("while it is down.")
```

## stdout (executed)

```text
instances                       : 240
dependencies being protected    : 1
breakers protecting it          : 240
breaker state shared            : 0

consecutive failures to trip one: 20
failed calls before the fleet is open : 4800

half-open probes per instance   : 1
probe interval, seconds         : 30
probes per interval, fleet-wide : 240
probes per minute against a dead dependency : 480

the circuit breaker
  scope of one breaker : per dependency, not global
  trips on : consecutive failures, not a rate, so a blip
    does not open it
  recovery : a single half-open probe, not a flood
  measured in the March outage : the error path went from
    a full timeout to an immediate rejection
  verdict : PROTECTS THE CALLER

  per dependency rather than global is the design decision
  that makes a breaker useful instead of dangerous

the two things a breaker can do
  stop this process waiting on a dead dependency : yes,
    completely, and that is what it is for
  stop the dependency being called while it is dead : that
    is a property of the fleet, not of a process
  processes holding one : 240
  state shared between them : 0
  so each one learns the outage : independently

  the guarantee is local and correct, and the quantity the
  dependency experiences is a sum over all of them

from the dependency's side
  calls it must fail to open one breaker : 20
  calls it must fail to open all of them : 4800
  probes it receives per minute while dead : 480
  what those probes are : correct, minimal, one per
    instance per interval
  what they are in aggregate : steady traffic to
    something that is trying to restart

the moment it comes back
  probes in flight when it first answers : 240
  each of them succeeding : yes
  what each instance does then : closes its breaker and
    resumes full traffic
  how many do that : all of them, at once
  what the policy was designed to prevent : exactly this
  is the policy wrong : no; it is per instance

why March looked like a success
  front end responsive : yes, measured
  error path latency   : cut, measured
  the metric watched   : this service's own latency
  the dependency's inbound rate during its outage : not on
    that graph, and it is on the dependency's
  who read both together : nobody

null control - one breaker for the fleet
  scope per dependency : unchanged
  breakers protecting it : 1
  failed calls before the fleet is open : 20
  probes per interval : 1
  the policy did not change; the object holding it stopped
  being one per process

what a per-instance breaker guarantees
  this process stops waiting on a dead dependency :
    exactly, and it is what kept the front end up
  the dead dependency stops being called : not addressed;
    that is a claim about 240 processes and the breaker
    is a claim about one

a protection installed per instance is multiplied by the
instance count wherever it touches something shared; the
gentlest per-process policy is still a fleet-sized policy
when the thing it is gentle towards is singular

The breaker is per dependency rather than global, trips on 20 consecutive
failures rather than a rate, recovers with 1 half-open probe, and in March it
cut the error path from a full timeout to an immediate rejection. It is an
object in a process and there are 240 of them with 0 shared state, so the
dependency must fail 4800 calls to be shut out and receives 480 probes a minute
while it is down.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
