<!-- canonical: efficientnewlanguage.org/ai/examples/620-the-permission-was-granted-to-the-service-not-the-request | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 620 — The permission was granted to the service not the request

`the_permission_was_granted_to_the_service_not_the_request.eml` - The reporting service holds one role. Every request it serves is authorised against that role. What the role has to be able to do is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The reporting
# service holds one role. Every request it serves is authorised against that
# role. What the role has to be able to do is computed below.
#
# Giving the service its own identity is correct and it is better than the two
# alternatives. Sharing a human's credentials makes every action untraceable
# and breaks when that person leaves; passing the end user's token through
# means the service cannot do the background work it exists for. A service
# account is scoped, rotatable, auditable, and it belongs to the team that runs
# the service.
#
# A service account is one identity for many requests. Its permissions must be
# the UNION of what any request might legitimately need, because the check runs
# against the account and the account does not vary.
#
# So the smallest role that lets every request succeed is one that lets every
# request reach everything.

640 => tenants
84000 => requests_per_day
1 => service_roles

"tenants served         : " + str(tenants) ^0
"requests per day       : " + str(requests_per_day) ^0
"identities the service has : " + str(service_roles) ^0
"" ^0

# ---- what the service account is checked for ----

"the authorisation check" ^0
"  runs on every request        : yes" ^0
"  denies unauthorised access   : yes" ^0
"  identity checked             : the service account" ^0
"  requests denied              : 0" ^0
"  failures of the check itself : 0" ^0
"" ^0
"  the check is correct and its answer is the same every time," ^0
"  because its subject is the same every time" ^0
"" ^0

# ---- what the role must contain ----

"the role's scope, derived" ^0
"  tenants any single request may need : 1" ^0
"  tenants the account must reach      : " + str(tenants) ^0
"  reason                              : the check cannot see" ^0
"    which tenant the request is for" ^0
"" ^0
"  a request needs 1 tenant and is permitted " + str(tenants) ^0
"" ^0

# ---- what a defect in the service costs ----
#
# The service does filter by tenant. That filter is application code, and it is
# the only thing standing between a request and the other 639.

1 => filter_locations
639 => tenants_beyond_the_request

"the tenant filter" ^0
"  places it is applied      : " + str(filter_locations) ^0
"  enforced by the platform  : no" ^0
"  enforced by a review      : yes, when the code changes" ^0
"  tenants exposed if it is wrong once : " + str(tenants_beyond_the_request) ^0
"" ^0
"  the authorisation layer would permit every one of those" ^0
"  reads, correctly, because it was asked about the account" ^0
"" ^0

# ---- the audit log ----

"what the audit log records for a cross-tenant read" ^0
"  actor      : the reporting service" ^0
"  action     : read" ^0
"  resource   : tenant 512's rows" ^0
"  authorised : yes" ^0
"  on whose behalf : not recorded" ^0
"" ^0
"  the entry is complete by its own schema, and cannot" ^0
"  distinguish a legitimate report from a leak, because the" ^0
"  field that would is the one the design does not carry" ^0
"" ^0

# ---- how the scope grows ----

"tenants   role must reach   a request needs   ratio" ^0
for t in [1:4]:
    t * 160 => n
    "  " + str(n) + "       " + str(n) + "                1                 " + str(n) + " to 1" ^0
"" ^0
"  the ratio is the tenant count, so the scope grows with" ^0
"  success and never with anything a reviewer would notice" ^0
"" ^0

# ---- the control ----
#
# The service account, against the two alternatives it was chosen over. Both of
# those fail in ways this does not.

"control - is the service account the right shape" ^0
"  actions attributable to a person who left : 0" ^0
"  credentials shared between humans          : 0" ^0
"  background jobs that cannot run            : 0" ^0
"  rotations blocked by a human's password    : 0" ^0
"  defects in the service account             : 0" ^0
"" ^0
"  a per-user token would break the background work this" ^0
"  service exists for; the account is not the mistake" ^0
"" ^0

# ---- the null control ----
#
# The same service account, where the request carries the tenant as a scoped
# credential the platform checks. Same account, same rotation, same audit
# ownership.

1 => nc_tenants_reachable

"null control - the request carrying its own scope" ^0
"  identities the service has : " + str(service_roles) + ", unchanged" ^0
"  tenants the request may reach : " + str(nc_tenants_reachable) ^0
"  tenants exposed by a filter bug : " + str(nc_tenants_reachable - 1) ^0
"  audit entry names the tenant : yes, it was in the credential" ^0
"  the account did not lose any permission it needs" ^0
"  the permission stopped being ambient" ^0
"" ^0

# ---- the rule ----

"what an authorised request establishes" ^0
"  the caller was allowed to do this : yes, exactly" ^0
"  this particular request was       : only if the request's" ^0
"    own scope is part of what was checked" ^0
"  and a service identity is by construction the union of" ^0
"  every request it will ever serve" ^0
"" ^0
"the number that describes the exposure is not the number of" ^0
"roles, it is how many things one request is permitted to" ^0
"touch divided by how many it needs, which here is " + str(tenants) + " to 1" ^0
"" ^0

"The service account is the right shape and beats both alternatives: 0 shared" ^0
"human credentials, 0 actions attributable to someone who left, 0 background" ^0
"jobs blocked. Because the check runs against the account, its role must reach" ^0
"all " + str(tenants) + " tenants while any single request needs 1, the tenant filter exists in" ^0
str(filter_locations) + " place in application code, and an audit entry for a cross-tenant read is" ^0
"complete, authorised, and silent about whose request it was." ^0
```

## Python (deterministic transpilation)

```python
tenants = 640
requests_per_day = 84000
service_roles = 1
print("tenants served         : " + str(tenants))
print("requests per day       : " + str(requests_per_day))
print("identities the service has : " + str(service_roles))
print("")
print("the authorisation check")
print("  runs on every request        : yes")
print("  denies unauthorised access   : yes")
print("  identity checked             : the service account")
print("  requests denied              : 0")
print("  failures of the check itself : 0")
print("")
print("  the check is correct and its answer is the same every time,")
print("  because its subject is the same every time")
print("")
print("the role's scope, derived")
print("  tenants any single request may need : 1")
print("  tenants the account must reach      : " + str(tenants))
print("  reason                              : the check cannot see")
print("    which tenant the request is for")
print("")
print("  a request needs 1 tenant and is permitted " + str(tenants))
print("")
filter_locations = 1
tenants_beyond_the_request = 639
print("the tenant filter")
print("  places it is applied      : " + str(filter_locations))
print("  enforced by the platform  : no")
print("  enforced by a review      : yes, when the code changes")
print("  tenants exposed if it is wrong once : " + str(tenants_beyond_the_request))
print("")
print("  the authorisation layer would permit every one of those")
print("  reads, correctly, because it was asked about the account")
print("")
print("what the audit log records for a cross-tenant read")
print("  actor      : the reporting service")
print("  action     : read")
print("  resource   : tenant 512's rows")
print("  authorised : yes")
print("  on whose behalf : not recorded")
print("")
print("  the entry is complete by its own schema, and cannot")
print("  distinguish a legitimate report from a leak, because the")
print("  field that would is the one the design does not carry")
print("")
print("tenants   role must reach   a request needs   ratio")
for t in range(1, 5):
    n = t * 160
    print("  " + str(n) + "       " + str(n) + "                1                 " + str(n) + " to 1")
print("")
print("  the ratio is the tenant count, so the scope grows with")
print("  success and never with anything a reviewer would notice")
print("")
print("control - is the service account the right shape")
print("  actions attributable to a person who left : 0")
print("  credentials shared between humans          : 0")
print("  background jobs that cannot run            : 0")
print("  rotations blocked by a human's password    : 0")
print("  defects in the service account             : 0")
print("")
print("  a per-user token would break the background work this")
print("  service exists for; the account is not the mistake")
print("")
nc_tenants_reachable = 1
print("null control - the request carrying its own scope")
print("  identities the service has : " + str(service_roles) + ", unchanged")
print("  tenants the request may reach : " + str(nc_tenants_reachable))
print("  tenants exposed by a filter bug : " + str(nc_tenants_reachable - 1))
print("  audit entry names the tenant : yes, it was in the credential")
print("  the account did not lose any permission it needs")
print("  the permission stopped being ambient")
print("")
print("what an authorised request establishes")
print("  the caller was allowed to do this : yes, exactly")
print("  this particular request was       : only if the request's")
print("    own scope is part of what was checked")
print("  and a service identity is by construction the union of")
print("  every request it will ever serve")
print("")
print("the number that describes the exposure is not the number of")
print("roles, it is how many things one request is permitted to")
print("touch divided by how many it needs, which here is " + str(tenants) + " to 1")
print("")
print("The service account is the right shape and beats both alternatives: 0 shared")
print("human credentials, 0 actions attributable to someone who left, 0 background")
print("jobs blocked. Because the check runs against the account, its role must reach")
print("all " + str(tenants) + " tenants while any single request needs 1, the tenant filter exists in")
print(str(filter_locations) + " place in application code, and an audit entry for a cross-tenant read is")
print("complete, authorised, and silent about whose request it was.")
```

## stdout (executed)

```text
tenants served         : 640
requests per day       : 84000
identities the service has : 1

the authorisation check
  runs on every request        : yes
  denies unauthorised access   : yes
  identity checked             : the service account
  requests denied              : 0
  failures of the check itself : 0

  the check is correct and its answer is the same every time,
  because its subject is the same every time

the role's scope, derived
  tenants any single request may need : 1
  tenants the account must reach      : 640
  reason                              : the check cannot see
    which tenant the request is for

  a request needs 1 tenant and is permitted 640

the tenant filter
  places it is applied      : 1
  enforced by the platform  : no
  enforced by a review      : yes, when the code changes
  tenants exposed if it is wrong once : 639

  the authorisation layer would permit every one of those
  reads, correctly, because it was asked about the account

what the audit log records for a cross-tenant read
  actor      : the reporting service
  action     : read
  resource   : tenant 512's rows
  authorised : yes
  on whose behalf : not recorded

  the entry is complete by its own schema, and cannot
  distinguish a legitimate report from a leak, because the
  field that would is the one the design does not carry

tenants   role must reach   a request needs   ratio
  160       160                1                 160 to 1
  320       320                1                 320 to 1
  480       480                1                 480 to 1
  640       640                1                 640 to 1

  the ratio is the tenant count, so the scope grows with
  success and never with anything a reviewer would notice

control - is the service account the right shape
  actions attributable to a person who left : 0
  credentials shared between humans          : 0
  background jobs that cannot run            : 0
  rotations blocked by a human's password    : 0
  defects in the service account             : 0

  a per-user token would break the background work this
  service exists for; the account is not the mistake

null control - the request carrying its own scope
  identities the service has : 1, unchanged
  tenants the request may reach : 1
  tenants exposed by a filter bug : 0
  audit entry names the tenant : yes, it was in the credential
  the account did not lose any permission it needs
  the permission stopped being ambient

what an authorised request establishes
  the caller was allowed to do this : yes, exactly
  this particular request was       : only if the request's
    own scope is part of what was checked
  and a service identity is by construction the union of
  every request it will ever serve

the number that describes the exposure is not the number of
roles, it is how many things one request is permitted to
touch divided by how many it needs, which here is 640 to 1

The service account is the right shape and beats both alternatives: 0 shared
human credentials, 0 actions attributable to someone who left, 0 background
jobs blocked. Because the check runs against the account, its role must reach
all 640 tenants while any single request needs 1, the tenant filter exists in
1 place in application code, and an audit entry for a cross-tenant read is
complete, authorised, and silent about whose request it was.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
