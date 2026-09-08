<!-- canonical: efficientnewlanguage.org/ai/examples/761-the-rotation-covered-the-services-in-the-registry | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 761 — The rotation covered the services in the registry

`the_rotation_covered_the_services_in_the_registry.eml` - Every service in the registry has a named on-call rotation with a tested escalation path, and no page has gone unanswered in fourteen months. Which services are in the registry is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every service in
# the registry has a named on-call rotation with a tested escalation path, and
# no page has gone unanswered in fourteen months. Which services are in the
# registry is computed below.
#
# The rotation is properly run. Every entry names a person rather than a team
# alias that resolves to nobody at three in the morning; the escalation path is
# tested monthly by paging it for real; the handover is a scheduled event with
# a checklist rather than a calendar colour; and in fourteen months no page has
# gone unanswered and no escalation has run out of levels.
#
# A service is in the rotation because it is in the registry, and it is in the
# registry because somebody added it. A service nobody registered does not have
# a gap in its coverage; it has no row.
#
# The deployment platform is running one hundred and forty services.

96 => services_in_the_registry
96 => services_with_a_named_rotation
140 => services_running_on_the_platform
14 => months_without_an_unanswered_page
12 => escalation_tests_last_year
0 => alerts_when_a_running_service_is_absent_from_the_registry
0 => jobs_that_enumerate_the_platform
1 => registrations_that_are_a_manual_step

services_running_on_the_platform - services_in_the_registry => services_running_without_a_rotation
int(services_in_the_registry * 10000 / services_running_on_the_platform) => covered_per_myriad
int(services_with_a_named_rotation * 10000 / services_in_the_registry) => registry_coverage_per_myriad

"services in the registry        : " + str(services_in_the_registry) ^0
"  with a named rotation         : " + str(services_with_a_named_rotation) ^0
"  registry coverage             : " + str(registry_coverage_per_myriad) + " per ten thousand" ^0
"months without an unanswered page : " + str(months_without_an_unanswered_page) ^0
"escalation tests last year        : " + str(escalation_tests_last_year) ^0
"" ^0
"services running on the platform: " + str(services_running_on_the_platform) ^0
"  covered by a rotation         : " + str(services_in_the_registry) ^0
"  running without one           : " + str(services_running_without_a_rotation) ^0
"  share covered                 : " + str(covered_per_myriad) + " per ten thousand" ^0
"" ^0
"registration is a manual step   : " + str(registrations_that_are_a_manual_step) ^0
"jobs that enumerate the platform: " + str(jobs_that_enumerate_the_platform) ^0
"alerts when a running service is unregistered : " ^0
"  " + str(alerts_when_a_running_service_is_absent_from_the_registry) ^0
"" ^0

# ---- what the rotation verified ----

"the on-call rotation" ^0
"  each entry names : a person, not a team alias that" ^0
"    resolves to nobody at three in the morning" ^0
"  escalation path : tested by paging it for real," ^0
"    " + str(escalation_tests_last_year) + " times last year" ^0
"  handover : a scheduled event with a checklist" ^0
"  months without an unanswered page : " + str(months_without_an_unanswered_page) ^0
"  escalations that ran out of levels : none" ^0
"  verdict : ANSWERED" ^0
"" ^0
"  paging the escalation path for real, monthly, is the" ^0
"  part almost nobody does, and it is why the fourteen" ^0
"  months mean something" ^0
"" ^0

# ---- how a service gets a rotation ----

"membership" ^0
"  a service has a rotation because : it is in the" ^0
"    registry" ^0
"  it is in the registry because : somebody added it," ^0
"    " + str(registrations_that_are_a_manual_step) + " manual step" ^0
"  a registered service with a broken rotation : visible," ^0
"    and the monthly test finds it" ^0
"  an unregistered service : has no row to be broken" ^0
"  services in that state : " + str(services_running_without_a_rotation) ^0
"" ^0
"  the coverage figure is complete over the registry and" ^0
"  the registry is complete over what people remembered" ^0
"" ^0

# ---- the coverage number is a tautology ----

"the reported coverage" ^0
"  numerator   : services with a named rotation" ^0
"  denominator : services in the registry" ^0
"  what adding a service to the registry requires : giving" ^0
"    it a rotation" ^0
"  so the ratio : " + str(registry_coverage_per_myriad) + " per ten thousand, necessarily" ^0
"  could it ever be lower : only if a registered service" ^0
"    were left without one, which the form prevents" ^0
"  what it therefore measures : nothing that can vary" ^0
"" ^0

# ---- what a page from the forty-four looks like ----

"an alert from an unregistered service" ^0
"  does the service emit alerts : yes, the platform" ^0
"    scrapes it like any other" ^0
"  where does the alert route : the default receiver" ^0
"  who reads the default receiver : it is a channel, not a" ^0
"    person" ^0
"  does it page : no" ^0
"  does it count against the unanswered-page record : no;" ^0
"    it was never a page" ^0
"" ^0

# ---- null control ----

# The same rotation, with a job that enumerates the platform's own service list
# and raises anything running without a registry entry.
services_running_on_the_platform => nc_services_the_check_can_see
0 => nc_services_running_without_a_rotation
1 => nc_jobs_that_enumerate_the_platform

"null control - enumerate the platform, diff the registry" ^0
"  escalation tests : " + str(escalation_tests_last_year) + ", unchanged" ^0
"  jobs that enumerate the platform : " + str(nc_jobs_that_enumerate_the_platform) ^0
"  services the check can see : " + str(nc_services_the_check_can_see) ^0
"  running without a rotation : " + str(nc_services_running_without_a_rotation) ^0
"  the rotation did not improve; the population it is" ^0
"  measured against stopped being the list it is drawn" ^0
"  from" ^0
"" ^0

# ---- the rule ----

"what a fully covered rotation guarantees" ^0
"  every registered service has someone who answers :" ^0
"    exactly, tested monthly, " + str(months_without_an_unanswered_page) + " months clean" ^0
"  every service has someone who answers : not addressed;" ^0
"    the roster is built from a list people maintain, and" ^0
"    a service that is not on it is not uncovered" ^0
"" ^0
"a coverage ratio whose denominator is the same list as its" ^0
"numerator cannot fall; the number that can is a comparison" ^0
"against something the registry did not write, and nothing" ^0
"here forms it" ^0
"" ^0

"Every entry names a person rather than an alias, the escalation path is paged" ^0
"for real " + str(escalation_tests_last_year) + " times a year, handover has a checklist, and " + str(months_without_an_unanswered_page) + " months have passed" ^0
"with no unanswered page. A service is on the roster because it is in a registry" ^0
"somebody maintains by hand, so coverage reads " + str(registry_coverage_per_myriad) + " per ten thousand of " + str(services_in_the_registry) ^0
"services while " + str(services_running_on_the_platform) + " run - " + str(services_running_without_a_rotation) + " of them under " + str(alerts_when_a_running_service_is_absent_from_the_registry) + " alerts." ^0
```

## Python (deterministic transpilation)

```python
services_in_the_registry = 96
services_with_a_named_rotation = 96
services_running_on_the_platform = 140
months_without_an_unanswered_page = 14
escalation_tests_last_year = 12
alerts_when_a_running_service_is_absent_from_the_registry = 0
jobs_that_enumerate_the_platform = 0
registrations_that_are_a_manual_step = 1
services_running_without_a_rotation = services_running_on_the_platform - services_in_the_registry
covered_per_myriad = int(services_in_the_registry * 10000 / services_running_on_the_platform)
registry_coverage_per_myriad = int(services_with_a_named_rotation * 10000 / services_in_the_registry)
print("services in the registry        : " + str(services_in_the_registry))
print("  with a named rotation         : " + str(services_with_a_named_rotation))
print("  registry coverage             : " + str(registry_coverage_per_myriad) + " per ten thousand")
print("months without an unanswered page : " + str(months_without_an_unanswered_page))
print("escalation tests last year        : " + str(escalation_tests_last_year))
print("")
print("services running on the platform: " + str(services_running_on_the_platform))
print("  covered by a rotation         : " + str(services_in_the_registry))
print("  running without one           : " + str(services_running_without_a_rotation))
print("  share covered                 : " + str(covered_per_myriad) + " per ten thousand")
print("")
print("registration is a manual step   : " + str(registrations_that_are_a_manual_step))
print("jobs that enumerate the platform: " + str(jobs_that_enumerate_the_platform))
print("alerts when a running service is unregistered : ")
print("  " + str(alerts_when_a_running_service_is_absent_from_the_registry))
print("")
print("the on-call rotation")
print("  each entry names : a person, not a team alias that")
print("    resolves to nobody at three in the morning")
print("  escalation path : tested by paging it for real,")
print("    " + str(escalation_tests_last_year) + " times last year")
print("  handover : a scheduled event with a checklist")
print("  months without an unanswered page : " + str(months_without_an_unanswered_page))
print("  escalations that ran out of levels : none")
print("  verdict : ANSWERED")
print("")
print("  paging the escalation path for real, monthly, is the")
print("  part almost nobody does, and it is why the fourteen")
print("  months mean something")
print("")
print("membership")
print("  a service has a rotation because : it is in the")
print("    registry")
print("  it is in the registry because : somebody added it,")
print("    " + str(registrations_that_are_a_manual_step) + " manual step")
print("  a registered service with a broken rotation : visible,")
print("    and the monthly test finds it")
print("  an unregistered service : has no row to be broken")
print("  services in that state : " + str(services_running_without_a_rotation))
print("")
print("  the coverage figure is complete over the registry and")
print("  the registry is complete over what people remembered")
print("")
print("the reported coverage")
print("  numerator   : services with a named rotation")
print("  denominator : services in the registry")
print("  what adding a service to the registry requires : giving")
print("    it a rotation")
print("  so the ratio : " + str(registry_coverage_per_myriad) + " per ten thousand, necessarily")
print("  could it ever be lower : only if a registered service")
print("    were left without one, which the form prevents")
print("  what it therefore measures : nothing that can vary")
print("")
print("an alert from an unregistered service")
print("  does the service emit alerts : yes, the platform")
print("    scrapes it like any other")
print("  where does the alert route : the default receiver")
print("  who reads the default receiver : it is a channel, not a")
print("    person")
print("  does it page : no")
print("  does it count against the unanswered-page record : no;")
print("    it was never a page")
print("")
nc_services_the_check_can_see = services_running_on_the_platform
nc_services_running_without_a_rotation = 0
nc_jobs_that_enumerate_the_platform = 1
print("null control - enumerate the platform, diff the registry")
print("  escalation tests : " + str(escalation_tests_last_year) + ", unchanged")
print("  jobs that enumerate the platform : " + str(nc_jobs_that_enumerate_the_platform))
print("  services the check can see : " + str(nc_services_the_check_can_see))
print("  running without a rotation : " + str(nc_services_running_without_a_rotation))
print("  the rotation did not improve; the population it is")
print("  measured against stopped being the list it is drawn")
print("  from")
print("")
print("what a fully covered rotation guarantees")
print("  every registered service has someone who answers :")
print("    exactly, tested monthly, " + str(months_without_an_unanswered_page) + " months clean")
print("  every service has someone who answers : not addressed;")
print("    the roster is built from a list people maintain, and")
print("    a service that is not on it is not uncovered")
print("")
print("a coverage ratio whose denominator is the same list as its")
print("numerator cannot fall; the number that can is a comparison")
print("against something the registry did not write, and nothing")
print("here forms it")
print("")
print("Every entry names a person rather than an alias, the escalation path is paged")
print("for real " + str(escalation_tests_last_year) + " times a year, handover has a checklist, and " + str(months_without_an_unanswered_page) + " months have passed")
print("with no unanswered page. A service is on the roster because it is in a registry")
print("somebody maintains by hand, so coverage reads " + str(registry_coverage_per_myriad) + " per ten thousand of " + str(services_in_the_registry))
print("services while " + str(services_running_on_the_platform) + " run - " + str(services_running_without_a_rotation) + " of them under " + str(alerts_when_a_running_service_is_absent_from_the_registry) + " alerts.")
```

## stdout (executed)

```text
services in the registry        : 96
  with a named rotation         : 96
  registry coverage             : 10000 per ten thousand
months without an unanswered page : 14
escalation tests last year        : 12

services running on the platform: 140
  covered by a rotation         : 96
  running without one           : 44
  share covered                 : 6857 per ten thousand

registration is a manual step   : 1
jobs that enumerate the platform: 0
alerts when a running service is unregistered : 
  0

the on-call rotation
  each entry names : a person, not a team alias that
    resolves to nobody at three in the morning
  escalation path : tested by paging it for real,
    12 times last year
  handover : a scheduled event with a checklist
  months without an unanswered page : 14
  escalations that ran out of levels : none
  verdict : ANSWERED

  paging the escalation path for real, monthly, is the
  part almost nobody does, and it is why the fourteen
  months mean something

membership
  a service has a rotation because : it is in the
    registry
  it is in the registry because : somebody added it,
    1 manual step
  a registered service with a broken rotation : visible,
    and the monthly test finds it
  an unregistered service : has no row to be broken
  services in that state : 44

  the coverage figure is complete over the registry and
  the registry is complete over what people remembered

the reported coverage
  numerator   : services with a named rotation
  denominator : services in the registry
  what adding a service to the registry requires : giving
    it a rotation
  so the ratio : 10000 per ten thousand, necessarily
  could it ever be lower : only if a registered service
    were left without one, which the form prevents
  what it therefore measures : nothing that can vary

an alert from an unregistered service
  does the service emit alerts : yes, the platform
    scrapes it like any other
  where does the alert route : the default receiver
  who reads the default receiver : it is a channel, not a
    person
  does it page : no
  does it count against the unanswered-page record : no;
    it was never a page

null control - enumerate the platform, diff the registry
  escalation tests : 12, unchanged
  jobs that enumerate the platform : 1
  services the check can see : 140
  running without a rotation : 0
  the rotation did not improve; the population it is
  measured against stopped being the list it is drawn
  from

what a fully covered rotation guarantees
  every registered service has someone who answers :
    exactly, tested monthly, 14 months clean
  every service has someone who answers : not addressed;
    the roster is built from a list people maintain, and
    a service that is not on it is not uncovered

a coverage ratio whose denominator is the same list as its
numerator cannot fall; the number that can is a comparison
against something the registry did not write, and nothing
here forms it

Every entry names a person rather than an alias, the escalation path is paged
for real 12 times a year, handover has a checklist, and 14 months have passed
with no unanswered page. A service is on the roster because it is in a registry
somebody maintains by hand, so coverage reads 10000 per ten thousand of 96
services while 140 run - 44 of them under 0 alerts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
