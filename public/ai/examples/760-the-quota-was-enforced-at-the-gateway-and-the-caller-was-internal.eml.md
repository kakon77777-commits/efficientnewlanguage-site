<!-- canonical: efficientnewlanguage.org/ai/examples/760-the-quota-was-enforced-at-the-gateway-and-the-caller-was-internal | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 760 — The quota was enforced at the gateway and the caller was internal

`the_quota_was_enforced_at_the_gateway_and_the_caller_was_internal.eml` - Per-tenant quotas are enforced at the gateway with no bypass header and no exempt caller, and they refuse nine thousand four hundred requests a day. Which requests reach the gateway is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Per-tenant quotas
# are enforced at the gateway with no bypass header and no exempt caller, and
# they refuse nine thousand four hundred requests a day. Which requests reach
# the gateway is computed below.
#
# The enforcement is genuine. There is no header a caller can set to skip it,
# no allowlist of exempt clients, and no "internal" flag in the request that
# the gateway trusts; the counter is in a shared store so it is not per
# instance; the refusal is a documented status with the tenant's remaining
# budget in it; and a load test confirms the limit holds under concurrency.
#
# The gateway is a place. Service-to-service calls inside the mesh address each
# other directly, and the nightly aggregation job calls the same API on a
# tenant's behalf without leaving the mesh.
#
# Eighteen point four million requests a day take that path.

214 => endpoints_behind_the_gateway
0 => bypass_headers_the_gateway_trusts
0 => exempt_callers
9400 => requests_refused_per_day
62000000 => requests_through_the_gateway_per_day
18400000 => internal_requests_per_day
31 => internal_services_calling_directly
0 => quota_counted_on_the_internal_path

requests_through_the_gateway_per_day + internal_requests_per_day => requests_per_day
int(internal_requests_per_day * 10000 / requests_per_day) => unmetered_per_myriad
int(requests_through_the_gateway_per_day * 10000 / requests_per_day) => metered_per_myriad

"endpoints behind the gateway    : " + str(endpoints_behind_the_gateway) ^0
"bypass headers it trusts        : " + str(bypass_headers_the_gateway_trusts) ^0
"exempt callers                  : " + str(exempt_callers) ^0
"requests refused per day        : " + str(requests_refused_per_day) ^0
"" ^0
"requests per day                : " + str(requests_per_day) ^0
"  through the gateway           : " + str(requests_through_the_gateway_per_day) ^0
"  metered                       : " + str(metered_per_myriad) + " per ten thousand" ^0
"  internal, direct              : " + str(internal_requests_per_day) ^0
"  unmetered                     : " + str(unmetered_per_myriad) + " per ten thousand" ^0
"internal services calling directly : " + str(internal_services_calling_directly) ^0
"quota counted on the internal path : " + str(quota_counted_on_the_internal_path) ^0
"" ^0

# ---- what the gateway verified ----

"the quota enforcement" ^0
"  a header that skips it : " + str(bypass_headers_the_gateway_trusts) ^0
"  exempt callers         : " + str(exempt_callers) ^0
"  an internal flag the gateway trusts : none" ^0
"  where the counter lives : a shared store, not per" ^0
"    instance" ^0
"  what a refusal returns : a documented status with the" ^0
"    remaining budget in it" ^0
"  holds under concurrency : confirmed by load test" ^0
"  requests refused per day : " + str(requests_refused_per_day) ^0
"  verdict : ENFORCED" ^0
"" ^0
"  no bypass, no exemption, and a shared counter is the" ^0
"  strong form; most quota systems fail on the third" ^0
"" ^0

# ---- what the gateway is ----

"the enforcement point" ^0
"  what it is : a place requests pass through" ^0
"  which requests pass through it : the ones addressed to" ^0
"    it" ^0
"  how services inside the mesh address each other : " ^0
"    directly, by service name" ^0
"  services doing that : " + str(internal_services_calling_directly) ^0
"  requests on that path per day : " + str(internal_requests_per_day) ^0
"  quota counted there : " + str(quota_counted_on_the_internal_path) ^0
"" ^0
"  the rule has no exceptions and the population it rules" ^0
"  over is defined by an address" ^0
"" ^0

# ---- the work is still the tenant's ----

# The nightly aggregation runs on a tenant's data, at the tenant's request, and
# consumes the resource the quota exists to protect. It is internal only in the
# sense of which network path it takes.
"the aggregation job" ^0
"  whose data it processes : a tenant's" ^0
"  why it runs : because that tenant asked for the report" ^0
"  what it consumes : the resource the quota protects" ^0
"  which quota it counts against : none" ^0
"  is it doing anything wrong : no; it calls the API the" ^0
"    way services in this mesh call each other" ^0
"  is the gateway wrong : no; it never saw the request" ^0
"" ^0

# ---- what the refusals prove ----

"the nine thousand four hundred" ^0
"  refused per day : " + str(requests_refused_per_day) ^0
"  correctly : every one" ^0
"  what they establish : the limit is real and exercised" ^0
"  what they do not establish : that a tenant's consumption" ^0
"    is bounded" ^0
"  share of requests the limit can see : " + str(metered_per_myriad) ^0
"    per ten thousand" ^0
"" ^0

# ---- null control ----

# The same quota, counted in the service rather than at the gateway, so the
# count happens where the work does regardless of which path the call took.
requests_per_day => nc_requests_metered_per_day
0 => nc_unmetered_per_myriad

"null control - the count moves to where the work happens" ^0
"  bypass headers trusted : " + str(bypass_headers_the_gateway_trusts) + ", unchanged" ^0
"  requests metered per day : " + str(nc_requests_metered_per_day) ^0
"  unmetered share : " + str(nc_unmetered_per_myriad) + " per ten thousand" ^0
"  the quota did not get stricter; it stopped being" ^0
"  attached to a doorway and started being attached to the" ^0
"  resource it protects" ^0
"" ^0

# ---- the rule ----

"what gateway enforcement guarantees" ^0
"  no request through the gateway exceeds a tenant's" ^0
"    quota : exactly, with no bypass and no exemption" ^0
"  no tenant exceeds their quota : not addressed; the" ^0
"    guarantee is scoped to a path, and consumption is a" ^0
"    property of the work" ^0
"" ^0
"a control placed at an entrance governs what enters there;" ^0
"the absence of exceptions makes it airtight over its" ^0
"population and does nothing about the size of that" ^0
"population, which is decided by routing" ^0
"" ^0

"The quota has " + str(bypass_headers_the_gateway_trusts) + " bypass headers, " + str(exempt_callers) + " exempt callers, a shared counter rather" ^0
"than a per-instance one, and it refuses " + str(requests_refused_per_day) + " requests a day correctly. It is" ^0
"enforced at the gateway, and " + str(internal_services_calling_directly) + " services call the same API directly inside" ^0
"the mesh, so " + str(internal_requests_per_day) + " of " + str(requests_per_day) + " requests a day - " + str(unmetered_per_myriad) + " per ten thousand -" ^0
"consume a tenant's resource against " + str(quota_counted_on_the_internal_path) + " counters." ^0
```

## Python (deterministic transpilation)

```python
endpoints_behind_the_gateway = 214
bypass_headers_the_gateway_trusts = 0
exempt_callers = 0
requests_refused_per_day = 9400
requests_through_the_gateway_per_day = 62000000
internal_requests_per_day = 18400000
internal_services_calling_directly = 31
quota_counted_on_the_internal_path = 0
requests_per_day = requests_through_the_gateway_per_day + internal_requests_per_day
unmetered_per_myriad = int(internal_requests_per_day * 10000 / requests_per_day)
metered_per_myriad = int(requests_through_the_gateway_per_day * 10000 / requests_per_day)
print("endpoints behind the gateway    : " + str(endpoints_behind_the_gateway))
print("bypass headers it trusts        : " + str(bypass_headers_the_gateway_trusts))
print("exempt callers                  : " + str(exempt_callers))
print("requests refused per day        : " + str(requests_refused_per_day))
print("")
print("requests per day                : " + str(requests_per_day))
print("  through the gateway           : " + str(requests_through_the_gateway_per_day))
print("  metered                       : " + str(metered_per_myriad) + " per ten thousand")
print("  internal, direct              : " + str(internal_requests_per_day))
print("  unmetered                     : " + str(unmetered_per_myriad) + " per ten thousand")
print("internal services calling directly : " + str(internal_services_calling_directly))
print("quota counted on the internal path : " + str(quota_counted_on_the_internal_path))
print("")
print("the quota enforcement")
print("  a header that skips it : " + str(bypass_headers_the_gateway_trusts))
print("  exempt callers         : " + str(exempt_callers))
print("  an internal flag the gateway trusts : none")
print("  where the counter lives : a shared store, not per")
print("    instance")
print("  what a refusal returns : a documented status with the")
print("    remaining budget in it")
print("  holds under concurrency : confirmed by load test")
print("  requests refused per day : " + str(requests_refused_per_day))
print("  verdict : ENFORCED")
print("")
print("  no bypass, no exemption, and a shared counter is the")
print("  strong form; most quota systems fail on the third")
print("")
print("the enforcement point")
print("  what it is : a place requests pass through")
print("  which requests pass through it : the ones addressed to")
print("    it")
print("  how services inside the mesh address each other : ")
print("    directly, by service name")
print("  services doing that : " + str(internal_services_calling_directly))
print("  requests on that path per day : " + str(internal_requests_per_day))
print("  quota counted there : " + str(quota_counted_on_the_internal_path))
print("")
print("  the rule has no exceptions and the population it rules")
print("  over is defined by an address")
print("")
print("the aggregation job")
print("  whose data it processes : a tenant's")
print("  why it runs : because that tenant asked for the report")
print("  what it consumes : the resource the quota protects")
print("  which quota it counts against : none")
print("  is it doing anything wrong : no; it calls the API the")
print("    way services in this mesh call each other")
print("  is the gateway wrong : no; it never saw the request")
print("")
print("the nine thousand four hundred")
print("  refused per day : " + str(requests_refused_per_day))
print("  correctly : every one")
print("  what they establish : the limit is real and exercised")
print("  what they do not establish : that a tenant's consumption")
print("    is bounded")
print("  share of requests the limit can see : " + str(metered_per_myriad))
print("    per ten thousand")
print("")
nc_requests_metered_per_day = requests_per_day
nc_unmetered_per_myriad = 0
print("null control - the count moves to where the work happens")
print("  bypass headers trusted : " + str(bypass_headers_the_gateway_trusts) + ", unchanged")
print("  requests metered per day : " + str(nc_requests_metered_per_day))
print("  unmetered share : " + str(nc_unmetered_per_myriad) + " per ten thousand")
print("  the quota did not get stricter; it stopped being")
print("  attached to a doorway and started being attached to the")
print("  resource it protects")
print("")
print("what gateway enforcement guarantees")
print("  no request through the gateway exceeds a tenant's")
print("    quota : exactly, with no bypass and no exemption")
print("  no tenant exceeds their quota : not addressed; the")
print("    guarantee is scoped to a path, and consumption is a")
print("    property of the work")
print("")
print("a control placed at an entrance governs what enters there;")
print("the absence of exceptions makes it airtight over its")
print("population and does nothing about the size of that")
print("population, which is decided by routing")
print("")
print("The quota has " + str(bypass_headers_the_gateway_trusts) + " bypass headers, " + str(exempt_callers) + " exempt callers, a shared counter rather")
print("than a per-instance one, and it refuses " + str(requests_refused_per_day) + " requests a day correctly. It is")
print("enforced at the gateway, and " + str(internal_services_calling_directly) + " services call the same API directly inside")
print("the mesh, so " + str(internal_requests_per_day) + " of " + str(requests_per_day) + " requests a day - " + str(unmetered_per_myriad) + " per ten thousand -")
print("consume a tenant's resource against " + str(quota_counted_on_the_internal_path) + " counters.")
```

## stdout (executed)

```text
endpoints behind the gateway    : 214
bypass headers it trusts        : 0
exempt callers                  : 0
requests refused per day        : 9400

requests per day                : 80400000
  through the gateway           : 62000000
  metered                       : 7711 per ten thousand
  internal, direct              : 18400000
  unmetered                     : 2288 per ten thousand
internal services calling directly : 31
quota counted on the internal path : 0

the quota enforcement
  a header that skips it : 0
  exempt callers         : 0
  an internal flag the gateway trusts : none
  where the counter lives : a shared store, not per
    instance
  what a refusal returns : a documented status with the
    remaining budget in it
  holds under concurrency : confirmed by load test
  requests refused per day : 9400
  verdict : ENFORCED

  no bypass, no exemption, and a shared counter is the
  strong form; most quota systems fail on the third

the enforcement point
  what it is : a place requests pass through
  which requests pass through it : the ones addressed to
    it
  how services inside the mesh address each other : 
    directly, by service name
  services doing that : 31
  requests on that path per day : 18400000
  quota counted there : 0

  the rule has no exceptions and the population it rules
  over is defined by an address

the aggregation job
  whose data it processes : a tenant's
  why it runs : because that tenant asked for the report
  what it consumes : the resource the quota protects
  which quota it counts against : none
  is it doing anything wrong : no; it calls the API the
    way services in this mesh call each other
  is the gateway wrong : no; it never saw the request

the nine thousand four hundred
  refused per day : 9400
  correctly : every one
  what they establish : the limit is real and exercised
  what they do not establish : that a tenant's consumption
    is bounded
  share of requests the limit can see : 7711
    per ten thousand

null control - the count moves to where the work happens
  bypass headers trusted : 0, unchanged
  requests metered per day : 80400000
  unmetered share : 0 per ten thousand
  the quota did not get stricter; it stopped being
  attached to a doorway and started being attached to the
  resource it protects

what gateway enforcement guarantees
  no request through the gateway exceeds a tenant's
    quota : exactly, with no bypass and no exemption
  no tenant exceeds their quota : not addressed; the
    guarantee is scoped to a path, and consumption is a
    property of the work

a control placed at an entrance governs what enters there;
the absence of exceptions makes it airtight over its
population and does nothing about the size of that
population, which is decided by routing

The quota has 0 bypass headers, 0 exempt callers, a shared counter rather
than a per-instance one, and it refuses 9400 requests a day correctly. It is
enforced at the gateway, and 31 services call the same API directly inside
the mesh, so 18400000 of 80400000 requests a day - 2288 per ten thousand -
consume a tenant's resource against 0 counters.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
