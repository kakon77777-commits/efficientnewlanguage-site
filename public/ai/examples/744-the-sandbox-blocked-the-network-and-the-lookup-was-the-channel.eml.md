<!-- canonical: efficientnewlanguage.org/ai/examples/744-the-sandbox-blocked-the-network-and-the-lookup-was-the-channel | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 744 — The sandbox blocked the network and the lookup was the channel

`the_sandbox_blocked_the_network_and_the_lookup_was_the_channel.eml` - The build sandbox denies outbound network by default, the denial is asserted by a test rather than assumed, and it caught two dependencies calling home. What remains reachable is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The build sandbox
# denies outbound network by default, the denial is asserted by a test rather
# than assumed, and it caught two dependencies calling home. What remains
# reachable is computed below.
#
# The sandbox is real isolation. Egress is denied by default rather than by a
# blocklist, so a destination nobody thought of is denied too; the denial is
# asserted by a test in the build that fails if a connection succeeds, so a
# misconfiguration is loud; it applies to every build rather than to release
# builds; and it caught two dependencies that were quietly contacting their own
# servers during installation.
#
# Name resolution is not denied, because the build has to resolve the internal
# package registry. A resolver query carries a name, and a name is bytes the
# caller chooses.
#
# A build makes forty-one thousand of them.

0 => allowed_outbound_destinations
1 => allowed_resolvers
1 => egress_tests_asserting_a_connection_fails
2 => dependencies_caught_calling_home
253 => bytes_a_resolver_query_can_carry
41000 => resolver_queries_a_build_makes
0 => monitoring_on_the_names_queried
0 => bytes_of_payload_the_egress_test_measures

resolver_queries_a_build_makes * bytes_a_resolver_query_can_carry => bytes_a_build_can_emit_through_the_resolver
allowed_outbound_destinations + allowed_resolvers => destinations_reachable_from_the_sandbox
int(allowed_outbound_destinations * 10000 / destinations_reachable_from_the_sandbox) => denied_share_of_reachable_per_myriad

"allowed outbound destinations   : " + str(allowed_outbound_destinations) ^0
"allowed resolvers               : " + str(allowed_resolvers) ^0
"destinations reachable          : " + str(destinations_reachable_from_the_sandbox) ^0
"egress tests asserting a failure: " + str(egress_tests_asserting_a_connection_fails) ^0
"dependencies caught calling home: " + str(dependencies_caught_calling_home) ^0
"" ^0
"bytes a resolver query can carry: " + str(bytes_a_resolver_query_can_carry) ^0
"resolver queries a build makes  : " + str(resolver_queries_a_build_makes) ^0
"  bytes that path can emit      : " + str(bytes_a_build_can_emit_through_the_resolver) ^0
"monitoring on the names queried : " + str(monitoring_on_the_names_queried) ^0
"payload bytes the egress test measures : " + str(bytes_of_payload_the_egress_test_measures) ^0
"" ^0

# ---- what the sandbox verified ----

"the egress policy" ^0
"  default : deny, not a blocklist" ^0
"  so a destination nobody thought of : denied" ^0
"  asserted by : a test that fails if a connection" ^0
"    succeeds" ^0
"  applies to : every build, not release builds" ^0
"  dependencies it caught calling home : " + str(dependencies_caught_calling_home) ^0
"  verdict : NO CONNECTIONS LEAVE" ^0
"" ^0
"  deny by default plus an asserting test is the strong" ^0
"  form of this control and both halves are present" ^0
"" ^0

# ---- what a resolver is ----

"name resolution" ^0
"  denied : no, and it cannot be; the build resolves the" ^0
"    internal registry" ^0
"  what a query contains : a name the caller chose" ^0
"  who receives it : the resolver, and then whatever" ^0
"    authority owns the suffix" ^0
"  is that a connection the egress test sees : no; it is a" ^0
"    lookup, on a different path" ^0
"  bytes per query : " + str(bytes_a_resolver_query_can_carry) ^0
"" ^0
"  the policy is about connections and a lookup carries" ^0
"  bytes without being one" ^0
"" ^0
# ---- the resolver exception is necessary ----

# It is not an oversight and it cannot simply be removed. The build resolves the
# internal registry by name, and pinning an address instead would break on every
# registry failover, which is a real event with a real recovery procedure.
"the exception" ^0
"  why it exists : the build resolves the internal" ^0
"    registry" ^0
"  could it be an address instead : it would break on" ^0
"    every failover" ^0
"  is failover a real event : yes, with a procedure" ^0
"  so removing the exception : is not the fix" ^0
"  resolvers allowed : " + str(allowed_resolvers) ^0
"  destinations allowed : " + str(allowed_outbound_destinations) ^0
"" ^0

# ---- what the test asserts ----

"the egress test" ^0
"  what it does : opens a connection to a public address" ^0
"  what it asserts : that the connection fails" ^0
"  does it pass : yes, every build" ^0
"  what it measures about the resolver : " ^0
"    " + str(bytes_of_payload_the_egress_test_measures) + " bytes" ^0
"  would it notice a query for an unusual name : no; it" ^0
"    tests connections" ^0
"  names queried per build : " + str(resolver_queries_a_build_makes) ^0
"" ^0

# ---- what the two caught dependencies show ----

"the two that were caught" ^0
"  what they did : opened a connection during install" ^0
"  were they caught : yes, immediately, by the deny" ^0
"  what that establishes : the control works against the" ^0
"    thing it controls" ^0
"  what it does not establish : that nothing left, only" ^0
"    that no connection did" ^0
"  monitoring that would separate those : " ^0
"    " + str(monitoring_on_the_names_queried) ^0
"" ^0

# ---- null control ----

# The same sandbox, with the resolver restricted to the internal suffix and
# every queried name logged and reviewable.
1 => nc_monitoring_on_the_names_queried
0 => nc_bytes_a_build_can_emit_through_the_resolver

"null control - the resolver answers one suffix, and logs" ^0
"  outbound destinations allowed : " + str(allowed_outbound_destinations) + ", unchanged" ^0
"  monitoring on names queried : " + str(nc_monitoring_on_the_names_queried) ^0
"  bytes emittable through the resolver : " ^0
"    " + str(nc_bytes_a_build_can_emit_through_the_resolver) ^0
"  the egress policy did not get stricter; the exception it" ^0
"  had to make stopped being unbounded" ^0
"" ^0

# ---- the rule ----

"what a default-deny egress policy guarantees" ^0
"  no connection leaves the sandbox : exactly, asserted by" ^0
"    a failing test, and it caught " + str(dependencies_caught_calling_home) + " real cases" ^0
"  no data leaves the sandbox : not addressed; the policy" ^0
"    is stated over connections and the exception it must" ^0
"    make carries bytes of its own" ^0
"" ^0
"a boundary is defined by the operation it names; every" ^0
"exception a working boundary is forced to make is a channel" ^0
"whose capacity is a property of the exception rather than of" ^0
"the policy, and it is not smaller for being unintended" ^0
"" ^0

"Egress is deny by default rather than a blocklist, asserted by a test that" ^0
"fails if a connection succeeds, on every build, and it caught " + str(dependencies_caught_calling_home) + " dependencies" ^0
"calling home. Name resolution stays open because the registry is resolved by" ^0
"name, so of " + str(destinations_reachable_from_the_sandbox) + " reachable destinations " + str(allowed_outbound_destinations) + " are connections, and " + str(resolver_queries_a_build_makes) ^0
"lookups a build can carry " + str(bytes_a_build_can_emit_through_the_resolver) + " bytes past " + str(monitoring_on_the_names_queried) + " monitoring." ^0
```

## Python (deterministic transpilation)

```python
allowed_outbound_destinations = 0
allowed_resolvers = 1
egress_tests_asserting_a_connection_fails = 1
dependencies_caught_calling_home = 2
bytes_a_resolver_query_can_carry = 253
resolver_queries_a_build_makes = 41000
monitoring_on_the_names_queried = 0
bytes_of_payload_the_egress_test_measures = 0
bytes_a_build_can_emit_through_the_resolver = resolver_queries_a_build_makes * bytes_a_resolver_query_can_carry
destinations_reachable_from_the_sandbox = allowed_outbound_destinations + allowed_resolvers
denied_share_of_reachable_per_myriad = int(allowed_outbound_destinations * 10000 / destinations_reachable_from_the_sandbox)
print("allowed outbound destinations   : " + str(allowed_outbound_destinations))
print("allowed resolvers               : " + str(allowed_resolvers))
print("destinations reachable          : " + str(destinations_reachable_from_the_sandbox))
print("egress tests asserting a failure: " + str(egress_tests_asserting_a_connection_fails))
print("dependencies caught calling home: " + str(dependencies_caught_calling_home))
print("")
print("bytes a resolver query can carry: " + str(bytes_a_resolver_query_can_carry))
print("resolver queries a build makes  : " + str(resolver_queries_a_build_makes))
print("  bytes that path can emit      : " + str(bytes_a_build_can_emit_through_the_resolver))
print("monitoring on the names queried : " + str(monitoring_on_the_names_queried))
print("payload bytes the egress test measures : " + str(bytes_of_payload_the_egress_test_measures))
print("")
print("the egress policy")
print("  default : deny, not a blocklist")
print("  so a destination nobody thought of : denied")
print("  asserted by : a test that fails if a connection")
print("    succeeds")
print("  applies to : every build, not release builds")
print("  dependencies it caught calling home : " + str(dependencies_caught_calling_home))
print("  verdict : NO CONNECTIONS LEAVE")
print("")
print("  deny by default plus an asserting test is the strong")
print("  form of this control and both halves are present")
print("")
print("name resolution")
print("  denied : no, and it cannot be; the build resolves the")
print("    internal registry")
print("  what a query contains : a name the caller chose")
print("  who receives it : the resolver, and then whatever")
print("    authority owns the suffix")
print("  is that a connection the egress test sees : no; it is a")
print("    lookup, on a different path")
print("  bytes per query : " + str(bytes_a_resolver_query_can_carry))
print("")
print("  the policy is about connections and a lookup carries")
print("  bytes without being one")
print("")
print("the exception")
print("  why it exists : the build resolves the internal")
print("    registry")
print("  could it be an address instead : it would break on")
print("    every failover")
print("  is failover a real event : yes, with a procedure")
print("  so removing the exception : is not the fix")
print("  resolvers allowed : " + str(allowed_resolvers))
print("  destinations allowed : " + str(allowed_outbound_destinations))
print("")
print("the egress test")
print("  what it does : opens a connection to a public address")
print("  what it asserts : that the connection fails")
print("  does it pass : yes, every build")
print("  what it measures about the resolver : ")
print("    " + str(bytes_of_payload_the_egress_test_measures) + " bytes")
print("  would it notice a query for an unusual name : no; it")
print("    tests connections")
print("  names queried per build : " + str(resolver_queries_a_build_makes))
print("")
print("the two that were caught")
print("  what they did : opened a connection during install")
print("  were they caught : yes, immediately, by the deny")
print("  what that establishes : the control works against the")
print("    thing it controls")
print("  what it does not establish : that nothing left, only")
print("    that no connection did")
print("  monitoring that would separate those : ")
print("    " + str(monitoring_on_the_names_queried))
print("")
nc_monitoring_on_the_names_queried = 1
nc_bytes_a_build_can_emit_through_the_resolver = 0
print("null control - the resolver answers one suffix, and logs")
print("  outbound destinations allowed : " + str(allowed_outbound_destinations) + ", unchanged")
print("  monitoring on names queried : " + str(nc_monitoring_on_the_names_queried))
print("  bytes emittable through the resolver : ")
print("    " + str(nc_bytes_a_build_can_emit_through_the_resolver))
print("  the egress policy did not get stricter; the exception it")
print("  had to make stopped being unbounded")
print("")
print("what a default-deny egress policy guarantees")
print("  no connection leaves the sandbox : exactly, asserted by")
print("    a failing test, and it caught " + str(dependencies_caught_calling_home) + " real cases")
print("  no data leaves the sandbox : not addressed; the policy")
print("    is stated over connections and the exception it must")
print("    make carries bytes of its own")
print("")
print("a boundary is defined by the operation it names; every")
print("exception a working boundary is forced to make is a channel")
print("whose capacity is a property of the exception rather than of")
print("the policy, and it is not smaller for being unintended")
print("")
print("Egress is deny by default rather than a blocklist, asserted by a test that")
print("fails if a connection succeeds, on every build, and it caught " + str(dependencies_caught_calling_home) + " dependencies")
print("calling home. Name resolution stays open because the registry is resolved by")
print("name, so of " + str(destinations_reachable_from_the_sandbox) + " reachable destinations " + str(allowed_outbound_destinations) + " are connections, and " + str(resolver_queries_a_build_makes))
print("lookups a build can carry " + str(bytes_a_build_can_emit_through_the_resolver) + " bytes past " + str(monitoring_on_the_names_queried) + " monitoring.")
```

## stdout (executed)

```text
allowed outbound destinations   : 0
allowed resolvers               : 1
destinations reachable          : 1
egress tests asserting a failure: 1
dependencies caught calling home: 2

bytes a resolver query can carry: 253
resolver queries a build makes  : 41000
  bytes that path can emit      : 10373000
monitoring on the names queried : 0
payload bytes the egress test measures : 0

the egress policy
  default : deny, not a blocklist
  so a destination nobody thought of : denied
  asserted by : a test that fails if a connection
    succeeds
  applies to : every build, not release builds
  dependencies it caught calling home : 2
  verdict : NO CONNECTIONS LEAVE

  deny by default plus an asserting test is the strong
  form of this control and both halves are present

name resolution
  denied : no, and it cannot be; the build resolves the
    internal registry
  what a query contains : a name the caller chose
  who receives it : the resolver, and then whatever
    authority owns the suffix
  is that a connection the egress test sees : no; it is a
    lookup, on a different path
  bytes per query : 253

  the policy is about connections and a lookup carries
  bytes without being one

the exception
  why it exists : the build resolves the internal
    registry
  could it be an address instead : it would break on
    every failover
  is failover a real event : yes, with a procedure
  so removing the exception : is not the fix
  resolvers allowed : 1
  destinations allowed : 0

the egress test
  what it does : opens a connection to a public address
  what it asserts : that the connection fails
  does it pass : yes, every build
  what it measures about the resolver : 
    0 bytes
  would it notice a query for an unusual name : no; it
    tests connections
  names queried per build : 41000

the two that were caught
  what they did : opened a connection during install
  were they caught : yes, immediately, by the deny
  what that establishes : the control works against the
    thing it controls
  what it does not establish : that nothing left, only
    that no connection did
  monitoring that would separate those : 
    0

null control - the resolver answers one suffix, and logs
  outbound destinations allowed : 0, unchanged
  monitoring on names queried : 1
  bytes emittable through the resolver : 
    0
  the egress policy did not get stricter; the exception it
  had to make stopped being unbounded

what a default-deny egress policy guarantees
  no connection leaves the sandbox : exactly, asserted by
    a failing test, and it caught 2 real cases
  no data leaves the sandbox : not addressed; the policy
    is stated over connections and the exception it must
    make carries bytes of its own

a boundary is defined by the operation it names; every
exception a working boundary is forced to make is a channel
whose capacity is a property of the exception rather than of
the policy, and it is not smaller for being unintended

Egress is deny by default rather than a blocklist, asserted by a test that
fails if a connection succeeds, on every build, and it caught 2 dependencies
calling home. Name resolution stays open because the registry is resolved by
name, so of 1 reachable destinations 0 are connections, and 41000
lookups a build can carry 10373000 bytes past 0 monitoring.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
