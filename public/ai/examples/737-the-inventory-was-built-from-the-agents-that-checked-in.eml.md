<!-- canonical: efficientnewlanguage.org/ai/examples/737-the-inventory-was-built-from-the-agents-that-checked-in | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 737 — The inventory was built from the agents that checked in

`the_inventory_was_built_from_the_agents_that_checked_in.eml` - The asset inventory refreshes hourly from a reporting agent, shows full agent coverage, and found forty-one unpatched hosts. Where its host list comes from is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The asset
# inventory refreshes hourly from a reporting agent, shows full agent coverage,
# and found forty-one unpatched hosts. Where its host list comes from is
# computed below.
#
# The inventory is a working one. It refreshes hourly rather than quarterly, so
# it is not a spreadsheet; the data is what the host reports about itself rather
# than what a purchase order said; it is complete per host, carrying package
# versions rather than a name and an owner; and it earns its place by finding
# things, including forty-one hosts missing a patch that was believed fully
# rolled out.
#
# A host appears in the inventory when its agent reports. A host the agent
# never reached is not an entry with a gap; it is not an entry.
#
# The provider's own instance list has five hundred and ten more.

4100 => hosts_in_the_inventory
4100 => hosts_with_the_agent_reporting
10000 => agent_coverage_reported_per_myriad
4610 => instances_in_the_providers_own_list
41 => unpatched_hosts_the_inventory_found
1 => refresh_interval_hours
0 => jobs_that_diff_the_inventory_against_the_provider

instances_in_the_providers_own_list - hosts_in_the_inventory => instances_absent_from_the_inventory
int(instances_absent_from_the_inventory * 10000 / instances_in_the_providers_own_list) => absent_per_myriad

"hosts in the inventory          : " + str(hosts_in_the_inventory) ^0
"  with the agent reporting      : " + str(hosts_with_the_agent_reporting) ^0
"agent coverage reported         : " + str(agent_coverage_reported_per_myriad) + " per ten thousand" ^0
"refresh interval, hours         : " + str(refresh_interval_hours) ^0
"unpatched hosts it found        : " + str(unpatched_hosts_the_inventory_found) ^0
"" ^0
"instances in the provider list  : " + str(instances_in_the_providers_own_list) ^0
"  absent from the inventory     : " + str(instances_absent_from_the_inventory) ^0
"  share absent                  : " + str(absent_per_myriad) + " per ten thousand" ^0
"jobs that diff the two lists    : " + str(jobs_that_diff_the_inventory_against_the_provider) ^0
"" ^0
# ---- what the inventory verified ----

"the asset inventory" ^0
"  refresh : hourly, not quarterly" ^0
"  source of the data : what the host reports about" ^0
"    itself, not a purchase order" ^0
"  detail per host : package versions, not a name and an" ^0
"    owner" ^0
"  what it found : " + str(unpatched_hosts_the_inventory_found) + " hosts missing a patch believed" ^0
"    fully rolled out" ^0
"  verdict : ACCURATE PER HOST" ^0
"" ^0
"  hourly self-reported package versions is a real" ^0
"  inventory and it is why the " + str(unpatched_hosts_the_inventory_found) + " were found" ^0
"" ^0

# ---- how a host gets in ----

"membership" ^0
"  a host appears when : its agent reports" ^0
"  a host with a failing agent : appears, stale, and that" ^0
"    is visible" ^0
"  a host that never had the agent : does not appear" ^0
"  what it looks like : nothing; there is no row to be" ^0
"    stale" ^0
"  instances like that : " + str(instances_absent_from_the_inventory) ^0
"" ^0
"  the list is complete over the hosts that report and" ^0
"  reporting is the condition for being on it" ^0
"" ^0

# ---- why the coverage figure is a hundred percent ----

"the coverage metric" ^0
"  numerator : hosts with the agent reporting" ^0
"  denominator : hosts in the inventory" ^0
"  where the inventory came from : hosts with the agent" ^0
"    reporting" ^0
"  so the ratio : " + str(agent_coverage_reported_per_myriad) + " per ten thousand, necessarily" ^0
"  could it ever be lower : only if a reporting agent were" ^0
"    excluded from the list it defines" ^0
"  what it therefore measures : nothing that can vary" ^0
"" ^0

# ---- where the five hundred and ten came from ----

# Not from carelessness. Instances launched from an image built before the
# agent was added, instances in an account the deployment role cannot reach,
# and short-lived workers that come and go between two hourly refreshes.
"the absent instances" ^0
"  launched from an older image : some" ^0
"  in an account the deploy role cannot reach : some" ^0
"  living less than the " + str(refresh_interval_hours) + "-hour refresh : some" ^0
"  is any of that misconduct : no" ^0
"  which of them would a patch report mention : none" ^0
"  jobs comparing the two lists : " + str(jobs_that_diff_the_inventory_against_the_provider) ^0
"" ^0

# ---- null control ----

# The same inventory, with an hourly job enumerating the provider's instance
# list and raising anything present there and absent here.
instances_in_the_providers_own_list => nc_hosts_the_inventory_can_see
0 => nc_instances_absent_from_the_inventory
1 => nc_jobs_that_diff_the_two_lists

"null control - enumerate from the provider, diff against here" ^0
"  detail per host : unchanged" ^0
"  jobs diffing the two lists : " + str(nc_jobs_that_diff_the_two_lists) ^0
"  hosts the inventory can see : " + str(nc_hosts_the_inventory_can_see) ^0
"  instances absent : " + str(nc_instances_absent_from_the_inventory) ^0
"  the agent did not improve; the population stopped being" ^0
"  defined by the instrument that measures it" ^0
"" ^0

# ---- the rule ----

"what an agent-reported inventory guarantees" ^0
"  every reporting host is described accurately and" ^0
"    recently : exactly, hourly, in detail" ^0
"  every host is described : not addressed; the list is" ^0
"    assembled from arrivals, and a host that never" ^0
"    arrives is not late" ^0
"" ^0
"an enumeration built from self-reports has a population" ^0
"defined by its own instrument, so its coverage metric is a" ^0
"tautology and the only number that can contradict it has to" ^0
"come from somewhere else entirely" ^0
"" ^0

"The inventory refreshes hourly from what each host reports about itself, down" ^0
"to package versions, and found " + str(unpatched_hosts_the_inventory_found) + " hosts missing a patch believed rolled out." ^0
"A host is on it because its agent reported, so coverage reads " + str(agent_coverage_reported_per_myriad) + " per ten" ^0
"thousand of a list that agents define, while the provider's own console lists" ^0
str(instances_in_the_providers_own_list) + " instances - " + str(instances_absent_from_the_inventory) + " absent, " + str(absent_per_myriad) + " per ten thousand - and " + str(jobs_that_diff_the_inventory_against_the_provider) + " jobs compare them." ^0
```

## Python (deterministic transpilation)

```python
hosts_in_the_inventory = 4100
hosts_with_the_agent_reporting = 4100
agent_coverage_reported_per_myriad = 10000
instances_in_the_providers_own_list = 4610
unpatched_hosts_the_inventory_found = 41
refresh_interval_hours = 1
jobs_that_diff_the_inventory_against_the_provider = 0
instances_absent_from_the_inventory = instances_in_the_providers_own_list - hosts_in_the_inventory
absent_per_myriad = int(instances_absent_from_the_inventory * 10000 / instances_in_the_providers_own_list)
print("hosts in the inventory          : " + str(hosts_in_the_inventory))
print("  with the agent reporting      : " + str(hosts_with_the_agent_reporting))
print("agent coverage reported         : " + str(agent_coverage_reported_per_myriad) + " per ten thousand")
print("refresh interval, hours         : " + str(refresh_interval_hours))
print("unpatched hosts it found        : " + str(unpatched_hosts_the_inventory_found))
print("")
print("instances in the provider list  : " + str(instances_in_the_providers_own_list))
print("  absent from the inventory     : " + str(instances_absent_from_the_inventory))
print("  share absent                  : " + str(absent_per_myriad) + " per ten thousand")
print("jobs that diff the two lists    : " + str(jobs_that_diff_the_inventory_against_the_provider))
print("")
print("the asset inventory")
print("  refresh : hourly, not quarterly")
print("  source of the data : what the host reports about")
print("    itself, not a purchase order")
print("  detail per host : package versions, not a name and an")
print("    owner")
print("  what it found : " + str(unpatched_hosts_the_inventory_found) + " hosts missing a patch believed")
print("    fully rolled out")
print("  verdict : ACCURATE PER HOST")
print("")
print("  hourly self-reported package versions is a real")
print("  inventory and it is why the " + str(unpatched_hosts_the_inventory_found) + " were found")
print("")
print("membership")
print("  a host appears when : its agent reports")
print("  a host with a failing agent : appears, stale, and that")
print("    is visible")
print("  a host that never had the agent : does not appear")
print("  what it looks like : nothing; there is no row to be")
print("    stale")
print("  instances like that : " + str(instances_absent_from_the_inventory))
print("")
print("  the list is complete over the hosts that report and")
print("  reporting is the condition for being on it")
print("")
print("the coverage metric")
print("  numerator : hosts with the agent reporting")
print("  denominator : hosts in the inventory")
print("  where the inventory came from : hosts with the agent")
print("    reporting")
print("  so the ratio : " + str(agent_coverage_reported_per_myriad) + " per ten thousand, necessarily")
print("  could it ever be lower : only if a reporting agent were")
print("    excluded from the list it defines")
print("  what it therefore measures : nothing that can vary")
print("")
print("the absent instances")
print("  launched from an older image : some")
print("  in an account the deploy role cannot reach : some")
print("  living less than the " + str(refresh_interval_hours) + "-hour refresh : some")
print("  is any of that misconduct : no")
print("  which of them would a patch report mention : none")
print("  jobs comparing the two lists : " + str(jobs_that_diff_the_inventory_against_the_provider))
print("")
nc_hosts_the_inventory_can_see = instances_in_the_providers_own_list
nc_instances_absent_from_the_inventory = 0
nc_jobs_that_diff_the_two_lists = 1
print("null control - enumerate from the provider, diff against here")
print("  detail per host : unchanged")
print("  jobs diffing the two lists : " + str(nc_jobs_that_diff_the_two_lists))
print("  hosts the inventory can see : " + str(nc_hosts_the_inventory_can_see))
print("  instances absent : " + str(nc_instances_absent_from_the_inventory))
print("  the agent did not improve; the population stopped being")
print("  defined by the instrument that measures it")
print("")
print("what an agent-reported inventory guarantees")
print("  every reporting host is described accurately and")
print("    recently : exactly, hourly, in detail")
print("  every host is described : not addressed; the list is")
print("    assembled from arrivals, and a host that never")
print("    arrives is not late")
print("")
print("an enumeration built from self-reports has a population")
print("defined by its own instrument, so its coverage metric is a")
print("tautology and the only number that can contradict it has to")
print("come from somewhere else entirely")
print("")
print("The inventory refreshes hourly from what each host reports about itself, down")
print("to package versions, and found " + str(unpatched_hosts_the_inventory_found) + " hosts missing a patch believed rolled out.")
print("A host is on it because its agent reported, so coverage reads " + str(agent_coverage_reported_per_myriad) + " per ten")
print("thousand of a list that agents define, while the provider's own console lists")
print(str(instances_in_the_providers_own_list) + " instances - " + str(instances_absent_from_the_inventory) + " absent, " + str(absent_per_myriad) + " per ten thousand - and " + str(jobs_that_diff_the_inventory_against_the_provider) + " jobs compare them.")
```

## stdout (executed)

```text
hosts in the inventory          : 4100
  with the agent reporting      : 4100
agent coverage reported         : 10000 per ten thousand
refresh interval, hours         : 1
unpatched hosts it found        : 41

instances in the provider list  : 4610
  absent from the inventory     : 510
  share absent                  : 1106 per ten thousand
jobs that diff the two lists    : 0

the asset inventory
  refresh : hourly, not quarterly
  source of the data : what the host reports about
    itself, not a purchase order
  detail per host : package versions, not a name and an
    owner
  what it found : 41 hosts missing a patch believed
    fully rolled out
  verdict : ACCURATE PER HOST

  hourly self-reported package versions is a real
  inventory and it is why the 41 were found

membership
  a host appears when : its agent reports
  a host with a failing agent : appears, stale, and that
    is visible
  a host that never had the agent : does not appear
  what it looks like : nothing; there is no row to be
    stale
  instances like that : 510

  the list is complete over the hosts that report and
  reporting is the condition for being on it

the coverage metric
  numerator : hosts with the agent reporting
  denominator : hosts in the inventory
  where the inventory came from : hosts with the agent
    reporting
  so the ratio : 10000 per ten thousand, necessarily
  could it ever be lower : only if a reporting agent were
    excluded from the list it defines
  what it therefore measures : nothing that can vary

the absent instances
  launched from an older image : some
  in an account the deploy role cannot reach : some
  living less than the 1-hour refresh : some
  is any of that misconduct : no
  which of them would a patch report mention : none
  jobs comparing the two lists : 0

null control - enumerate from the provider, diff against here
  detail per host : unchanged
  jobs diffing the two lists : 1
  hosts the inventory can see : 4610
  instances absent : 0
  the agent did not improve; the population stopped being
  defined by the instrument that measures it

what an agent-reported inventory guarantees
  every reporting host is described accurately and
    recently : exactly, hourly, in detail
  every host is described : not addressed; the list is
    assembled from arrivals, and a host that never
    arrives is not late

an enumeration built from self-reports has a population
defined by its own instrument, so its coverage metric is a
tautology and the only number that can contradict it has to
come from somewhere else entirely

The inventory refreshes hourly from what each host reports about itself, down
to package versions, and found 41 hosts missing a patch believed rolled out.
A host is on it because its agent reported, so coverage reads 10000 per ten
thousand of a list that agents define, while the provider's own console lists
4610 instances - 510 absent, 1106 per ten thousand - and 0 jobs compare them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
