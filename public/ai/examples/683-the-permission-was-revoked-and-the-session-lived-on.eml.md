<!-- canonical: efficientnewlanguage.org/ai/examples/683-the-permission-was-revoked-and-the-session-lived-on | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 683 — The permission was revoked and the session lived on

`the_permission_was_revoked_and_the_session_lived_on.eml` - A revocation propagates in forty milliseconds and the offboarding target is fifteen minutes. How long the access lasts is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A revocation
# propagates in forty milliseconds and the offboarding target is fifteen
# minutes. How long the access lasts is computed below.
#
# The authorization service is fast and correct. A role removal is written to
# the store, invalidates its own read caches, and every subsequent authorization
# decision reflects it within forty milliseconds. It is audited, the audit is
# complete, and the fifteen-minute offboarding target is met by a factor of
# twenty thousand.
#
# The subsequent authorization decisions are the ones that ASK. A session token
# carries its claims signed at issue, and a service that trusts the token does
# not ask — that is what the token is for, and it is why the system scales.
#
# Tokens last eight hours.

214 => revocations_per_month
8 => token_lifetime_hours
40 => propagation_milliseconds
900 => offboarding_target_seconds
0 => propagation_failures

int(token_lifetime_hours / 2) => mean_remaining_hours
revocations_per_month * mean_remaining_hours => person_hours_of_access_after_revocation
int(offboarding_target_seconds * 1000 / propagation_milliseconds) => target_over_propagation
mean_remaining_hours * 3600 => mean_remaining_seconds
int(mean_remaining_seconds / offboarding_target_seconds) => access_over_target

"revocations per month        : " + str(revocations_per_month) ^0
"propagation, ms              : " + str(propagation_milliseconds) ^0
"offboarding target, seconds  : " + str(offboarding_target_seconds) ^0
"target over propagation      : " + str(target_over_propagation) + " times" ^0
"" ^0
"token lifetime, hours        : " + str(token_lifetime_hours) ^0
"mean remaining at revocation : " + str(mean_remaining_hours) + " hours" ^0
"access after revocation, over the target : " + str(access_over_target) + " times" ^0
"person-hours of access after revocation, monthly : " + str(person_hours_of_access_after_revocation) ^0
"" ^0

# ---- what the revocation verified ----

"the authorization service" ^0
"  role removal written to the store : immediately" ^0
"  its own read caches invalidated   : yes" ^0
"  subsequent decisions reflect it   : within " + str(propagation_milliseconds) + " ms" ^0
"  audited                           : yes, completely" ^0
"  propagation failures              : " + str(propagation_failures) ^0
"  offboarding target met by         : " + str(target_over_propagation) + " times" ^0
"  verdict                           : REVOKED" ^0
"" ^0
"  the number is real and the service is not the problem" ^0
"" ^0

# ---- who asks ----

"the two kinds of decision" ^0
"  a service that calls the authorization service : sees" ^0
"    the revocation in " + str(propagation_milliseconds) + " ms" ^0
"  a service that validates the token's signature : sees" ^0
"    the claims as they were at issue" ^0
"  which is more common : the second, deliberately" ^0
"  why : it is what makes the system scale" ^0
"" ^0
"  the design is not an oversight; the token exists so that" ^0
"  most decisions do not need a call" ^0
"" ^0

# ---- what the offboarding checklist records ----

# The checklist has one line for access removal and it is ticked when the
# revocation returns. The measurement it records is the one the service
# reports, which is correct and is about the service.
"the checklist" ^0
"  line               : access removed" ^0
"  ticked when        : the revocation returns" ^0
"  time recorded      : " + str(propagation_milliseconds) + " ms" ^0
"  time until the person cannot act : up to " + str(token_lifetime_hours) + " hours" ^0
"  a line for the second : none" ^0
"" ^0

# ---- null control ----

# The same service, with tokens carrying a short lifetime and a refresh that
# re-asks, so a revocation is felt within one refresh interval.
5 => nc_token_lifetime_minutes
int(nc_token_lifetime_minutes * 60 / 2) => nc_mean_remaining_seconds
0 => nc_access_beyond_the_target

"null control - short tokens with a refresh that re-asks" ^0
"  propagation, ms      : " + str(propagation_milliseconds) + ", unchanged" ^0
"  mean remaining access, seconds : " + str(nc_mean_remaining_seconds) ^0
"  access beyond the offboarding target : " + str(nc_access_beyond_the_target) ^0
"  the revocation did not get faster; the population of" ^0
"  decisions that ask it grew" ^0
"" ^0

# ---- the rule ----

"what an instant revocation guarantees" ^0
"  every decision that asks gets the new answer : exactly" ^0
"  every decision gets the new answer           : not" ^0
"    addressed; a signed claim is a decision cached in the" ^0
"    holder's pocket, and the point of it is not to ask" ^0
"" ^0
"revocation latency is the propagation time plus the lifetime" ^0
"of whatever was issued before it; the first is measured on a" ^0
"dashboard and the second is a configuration value nobody" ^0
"reads as a security parameter" ^0
"" ^0

"Revocation propagates in " + str(propagation_milliseconds) + " ms with " + str(propagation_failures) + " failures, audited, meeting a " + str(offboarding_target_seconds) ^0
"second offboarding target by " + str(target_over_propagation) + " times. Most decisions validate a signed token" ^0
"instead of asking, which is the design and is why it scales, so a revoked" ^0
"person keeps acting for a mean of " + str(mean_remaining_hours) + " hours - " + str(access_over_target) + " times the target - and" ^0
str(revocations_per_month) + " revocations a month leave " + str(person_hours_of_access_after_revocation) + " person-hours of access behind them." ^0
```

## Python (deterministic transpilation)

```python
revocations_per_month = 214
token_lifetime_hours = 8
propagation_milliseconds = 40
offboarding_target_seconds = 900
propagation_failures = 0
mean_remaining_hours = int(token_lifetime_hours / 2)
person_hours_of_access_after_revocation = revocations_per_month * mean_remaining_hours
target_over_propagation = int(offboarding_target_seconds * 1000 / propagation_milliseconds)
mean_remaining_seconds = mean_remaining_hours * 3600
access_over_target = int(mean_remaining_seconds / offboarding_target_seconds)
print("revocations per month        : " + str(revocations_per_month))
print("propagation, ms              : " + str(propagation_milliseconds))
print("offboarding target, seconds  : " + str(offboarding_target_seconds))
print("target over propagation      : " + str(target_over_propagation) + " times")
print("")
print("token lifetime, hours        : " + str(token_lifetime_hours))
print("mean remaining at revocation : " + str(mean_remaining_hours) + " hours")
print("access after revocation, over the target : " + str(access_over_target) + " times")
print("person-hours of access after revocation, monthly : " + str(person_hours_of_access_after_revocation))
print("")
print("the authorization service")
print("  role removal written to the store : immediately")
print("  its own read caches invalidated   : yes")
print("  subsequent decisions reflect it   : within " + str(propagation_milliseconds) + " ms")
print("  audited                           : yes, completely")
print("  propagation failures              : " + str(propagation_failures))
print("  offboarding target met by         : " + str(target_over_propagation) + " times")
print("  verdict                           : REVOKED")
print("")
print("  the number is real and the service is not the problem")
print("")
print("the two kinds of decision")
print("  a service that calls the authorization service : sees")
print("    the revocation in " + str(propagation_milliseconds) + " ms")
print("  a service that validates the token's signature : sees")
print("    the claims as they were at issue")
print("  which is more common : the second, deliberately")
print("  why : it is what makes the system scale")
print("")
print("  the design is not an oversight; the token exists so that")
print("  most decisions do not need a call")
print("")
print("the checklist")
print("  line               : access removed")
print("  ticked when        : the revocation returns")
print("  time recorded      : " + str(propagation_milliseconds) + " ms")
print("  time until the person cannot act : up to " + str(token_lifetime_hours) + " hours")
print("  a line for the second : none")
print("")
nc_token_lifetime_minutes = 5
nc_mean_remaining_seconds = int(nc_token_lifetime_minutes * 60 / 2)
nc_access_beyond_the_target = 0
print("null control - short tokens with a refresh that re-asks")
print("  propagation, ms      : " + str(propagation_milliseconds) + ", unchanged")
print("  mean remaining access, seconds : " + str(nc_mean_remaining_seconds))
print("  access beyond the offboarding target : " + str(nc_access_beyond_the_target))
print("  the revocation did not get faster; the population of")
print("  decisions that ask it grew")
print("")
print("what an instant revocation guarantees")
print("  every decision that asks gets the new answer : exactly")
print("  every decision gets the new answer           : not")
print("    addressed; a signed claim is a decision cached in the")
print("    holder's pocket, and the point of it is not to ask")
print("")
print("revocation latency is the propagation time plus the lifetime")
print("of whatever was issued before it; the first is measured on a")
print("dashboard and the second is a configuration value nobody")
print("reads as a security parameter")
print("")
print("Revocation propagates in " + str(propagation_milliseconds) + " ms with " + str(propagation_failures) + " failures, audited, meeting a " + str(offboarding_target_seconds))
print("second offboarding target by " + str(target_over_propagation) + " times. Most decisions validate a signed token")
print("instead of asking, which is the design and is why it scales, so a revoked")
print("person keeps acting for a mean of " + str(mean_remaining_hours) + " hours - " + str(access_over_target) + " times the target - and")
print(str(revocations_per_month) + " revocations a month leave " + str(person_hours_of_access_after_revocation) + " person-hours of access behind them.")
```

## stdout (executed)

```text
revocations per month        : 214
propagation, ms              : 40
offboarding target, seconds  : 900
target over propagation      : 22500 times

token lifetime, hours        : 8
mean remaining at revocation : 4 hours
access after revocation, over the target : 16 times
person-hours of access after revocation, monthly : 856

the authorization service
  role removal written to the store : immediately
  its own read caches invalidated   : yes
  subsequent decisions reflect it   : within 40 ms
  audited                           : yes, completely
  propagation failures              : 0
  offboarding target met by         : 22500 times
  verdict                           : REVOKED

  the number is real and the service is not the problem

the two kinds of decision
  a service that calls the authorization service : sees
    the revocation in 40 ms
  a service that validates the token's signature : sees
    the claims as they were at issue
  which is more common : the second, deliberately
  why : it is what makes the system scale

  the design is not an oversight; the token exists so that
  most decisions do not need a call

the checklist
  line               : access removed
  ticked when        : the revocation returns
  time recorded      : 40 ms
  time until the person cannot act : up to 8 hours
  a line for the second : none

null control - short tokens with a refresh that re-asks
  propagation, ms      : 40, unchanged
  mean remaining access, seconds : 150
  access beyond the offboarding target : 0
  the revocation did not get faster; the population of
  decisions that ask it grew

what an instant revocation guarantees
  every decision that asks gets the new answer : exactly
  every decision gets the new answer           : not
    addressed; a signed claim is a decision cached in the
    holder's pocket, and the point of it is not to ask

revocation latency is the propagation time plus the lifetime
of whatever was issued before it; the first is measured on a
dashboard and the second is a configuration value nobody
reads as a security parameter

Revocation propagates in 40 ms with 0 failures, audited, meeting a 900
second offboarding target by 22500 times. Most decisions validate a signed token
instead of asking, which is the design and is why it scales, so a revoked
person keeps acting for a mean of 4 hours - 16 times the target - and
214 revocations a month leave 856 person-hours of access behind them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
