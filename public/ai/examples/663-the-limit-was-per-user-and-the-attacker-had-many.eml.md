<!-- canonical: efficientnewlanguage.org/ai/examples/663-the-limit-was-per-user-and-the-attacker-had-many | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 663 — The limit was per user and the attacker had many

`the_limit_was_per_user_and_the_attacker_had_many.eml` - The rate limit is a hundred requests a minute per authenticated user and it has never been exceeded. What one actor can send is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The rate limit is
# a hundred requests a minute per authenticated user and it has never been
# exceeded. What one actor can send is computed below.
#
# The limit works. It is applied after authentication so it cannot be evaded by
# rotating addresses, the counter is in shared storage so it holds across
# instances, it returns a correct retry-after, and it stopped a real incident in
# March when a customer's integration went into a loop. Zero violations is a
# true number.
#
# A per-user limit is a budget denominated in ACCOUNTS. Its total is the limit
# times the number of accounts an actor can hold, and that second factor is set
# by the sign-up flow rather than by the limiter.
#
# Sign-up needs an email address and no verification. Four thousand accounts is
# an afternoon.

100 => limit_per_user_per_minute
4000 => accounts_held_by_one_actor
26000 => legitimate_peak_per_minute
0 => limit_violations
0 => cost_to_create_an_account

limit_per_user_per_minute * accounts_held_by_one_actor => one_actor_per_minute
int(one_actor_per_minute / legitimate_peak_per_minute) => times_the_legitimate_peak

"limit per user per minute   : " + str(limit_per_user_per_minute) ^0
"accounts held by one actor  : " + str(accounts_held_by_one_actor) ^0
"what that actor may send    : " + str(one_actor_per_minute) + " per minute" ^0
"" ^0
"legitimate peak per minute  : " + str(legitimate_peak_per_minute) ^0
"the actor's budget is       : " + str(times_the_legitimate_peak) + " times the peak" ^0
"limit violations by the actor : " + str(limit_violations) ^0
"" ^0

# ---- what the limiter verified ----

"the rate limiter" ^0
"  applied after authentication : yes, so address rotation" ^0
"    does not evade it" ^0
"  counter storage    : shared, holds across instances" ^0
"  retry-after        : correct" ^0
"  incident stopped in March : a customer integration loop" ^0
"  violations         : " + str(limit_violations) ^0
"  verdict            : ENFORCED" ^0
"" ^0
"  it is not a token bucket in a local variable; it is the" ^0
"  careful version and it does its job" ^0
"" ^0

# ---- what sets the other factor ----

"the budget, in two factors" ^0
"  requests per account : " + str(limit_per_user_per_minute) + ", set by the limiter" ^0
"  accounts per actor   : unbounded, set by the sign-up flow" ^0
"  cost of an account   : " + str(cost_to_create_an_account) ^0
"  verification         : none" ^0
"" ^0
"  the limiter owns one factor and is read as bounding the" ^0
"  product" ^0
"" ^0

int(one_actor_per_minute * 10000 / (one_actor_per_minute + legitimate_peak_per_minute)) => actor_share_per_myriad
"the actor's share of total traffic : " + str(actor_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why nothing looks wrong ----

# Every account is compliant. There is no account to suspend for abuse, because
# no account is abusive; the abuse is a property of the set, and nothing
# computes a property of a set.
"what an investigator finds" ^0
"  accounts over the limit    : " + str(limit_violations) ^0
"  accounts sending unusual volume : " + str(limit_violations) ^0
"  the pattern is visible in : the union, which no report" ^0
"    groups by, because there is no column to group by" ^0
"" ^0

# ---- null control ----

# The same limit, with a second limit on a property the actor cannot mint: the
# payment instrument, the verified phone, the source network.
1 => nc_verified_identities_held
limit_per_user_per_minute * nc_verified_identities_held => nc_one_actor_per_minute

"null control - a second limit on a verified identity" ^0
"  per-user limit         : " + str(limit_per_user_per_minute) + ", unchanged" ^0
"  verified identities the actor holds : " + str(nc_verified_identities_held) ^0
"  what the actor may send : " + str(nc_one_actor_per_minute) + " per minute" ^0
"  the limiter did not get stricter; the second factor" ^0
"  stopped being free" ^0
"" ^0

# ---- the rule ----

"what a per-user limit guarantees" ^0
"  no account exceeds this rate : exactly" ^0
"  no actor exceeds this rate   : not addressed; the" ^0
"    limiter's unit is the account, and an actor's account" ^0
"    count is decided by whatever it costs to make one" ^0
"" ^0
"a limit is only as strong as its unit is expensive; putting" ^0
"one on a free identifier bounds a number that was never the" ^0
"one at issue" ^0
"" ^0

"The limit is enforced correctly and " + str(limit_violations) + " accounts have exceeded it: applied after" ^0
"authentication, shared counter, correct retry-after, and it stopped a real" ^0
"incident in March. An actor holding " + str(accounts_held_by_one_actor) + " free unverified accounts may send" ^0
str(one_actor_per_minute) + " requests a minute - " + str(times_the_legitimate_peak) + " times the legitimate peak and " + str(actor_share_per_myriad) + " per ten" ^0
"thousand of all traffic - while every one of those accounts is compliant." ^0
```

## Python (deterministic transpilation)

```python
limit_per_user_per_minute = 100
accounts_held_by_one_actor = 4000
legitimate_peak_per_minute = 26000
limit_violations = 0
cost_to_create_an_account = 0
one_actor_per_minute = limit_per_user_per_minute * accounts_held_by_one_actor
times_the_legitimate_peak = int(one_actor_per_minute / legitimate_peak_per_minute)
print("limit per user per minute   : " + str(limit_per_user_per_minute))
print("accounts held by one actor  : " + str(accounts_held_by_one_actor))
print("what that actor may send    : " + str(one_actor_per_minute) + " per minute")
print("")
print("legitimate peak per minute  : " + str(legitimate_peak_per_minute))
print("the actor's budget is       : " + str(times_the_legitimate_peak) + " times the peak")
print("limit violations by the actor : " + str(limit_violations))
print("")
print("the rate limiter")
print("  applied after authentication : yes, so address rotation")
print("    does not evade it")
print("  counter storage    : shared, holds across instances")
print("  retry-after        : correct")
print("  incident stopped in March : a customer integration loop")
print("  violations         : " + str(limit_violations))
print("  verdict            : ENFORCED")
print("")
print("  it is not a token bucket in a local variable; it is the")
print("  careful version and it does its job")
print("")
print("the budget, in two factors")
print("  requests per account : " + str(limit_per_user_per_minute) + ", set by the limiter")
print("  accounts per actor   : unbounded, set by the sign-up flow")
print("  cost of an account   : " + str(cost_to_create_an_account))
print("  verification         : none")
print("")
print("  the limiter owns one factor and is read as bounding the")
print("  product")
print("")
actor_share_per_myriad = int(one_actor_per_minute * 10000 / (one_actor_per_minute + legitimate_peak_per_minute))
print("the actor's share of total traffic : " + str(actor_share_per_myriad) + " per ten thousand")
print("")
print("what an investigator finds")
print("  accounts over the limit    : " + str(limit_violations))
print("  accounts sending unusual volume : " + str(limit_violations))
print("  the pattern is visible in : the union, which no report")
print("    groups by, because there is no column to group by")
print("")
nc_verified_identities_held = 1
nc_one_actor_per_minute = limit_per_user_per_minute * nc_verified_identities_held
print("null control - a second limit on a verified identity")
print("  per-user limit         : " + str(limit_per_user_per_minute) + ", unchanged")
print("  verified identities the actor holds : " + str(nc_verified_identities_held))
print("  what the actor may send : " + str(nc_one_actor_per_minute) + " per minute")
print("  the limiter did not get stricter; the second factor")
print("  stopped being free")
print("")
print("what a per-user limit guarantees")
print("  no account exceeds this rate : exactly")
print("  no actor exceeds this rate   : not addressed; the")
print("    limiter's unit is the account, and an actor's account")
print("    count is decided by whatever it costs to make one")
print("")
print("a limit is only as strong as its unit is expensive; putting")
print("one on a free identifier bounds a number that was never the")
print("one at issue")
print("")
print("The limit is enforced correctly and " + str(limit_violations) + " accounts have exceeded it: applied after")
print("authentication, shared counter, correct retry-after, and it stopped a real")
print("incident in March. An actor holding " + str(accounts_held_by_one_actor) + " free unverified accounts may send")
print(str(one_actor_per_minute) + " requests a minute - " + str(times_the_legitimate_peak) + " times the legitimate peak and " + str(actor_share_per_myriad) + " per ten")
print("thousand of all traffic - while every one of those accounts is compliant.")
```

## stdout (executed)

```text
limit per user per minute   : 100
accounts held by one actor  : 4000
what that actor may send    : 400000 per minute

legitimate peak per minute  : 26000
the actor's budget is       : 15 times the peak
limit violations by the actor : 0

the rate limiter
  applied after authentication : yes, so address rotation
    does not evade it
  counter storage    : shared, holds across instances
  retry-after        : correct
  incident stopped in March : a customer integration loop
  violations         : 0
  verdict            : ENFORCED

  it is not a token bucket in a local variable; it is the
  careful version and it does its job

the budget, in two factors
  requests per account : 100, set by the limiter
  accounts per actor   : unbounded, set by the sign-up flow
  cost of an account   : 0
  verification         : none

  the limiter owns one factor and is read as bounding the
  product

the actor's share of total traffic : 9389 per ten thousand

what an investigator finds
  accounts over the limit    : 0
  accounts sending unusual volume : 0
  the pattern is visible in : the union, which no report
    groups by, because there is no column to group by

null control - a second limit on a verified identity
  per-user limit         : 100, unchanged
  verified identities the actor holds : 1
  what the actor may send : 100 per minute
  the limiter did not get stricter; the second factor
  stopped being free

what a per-user limit guarantees
  no account exceeds this rate : exactly
  no actor exceeds this rate   : not addressed; the
    limiter's unit is the account, and an actor's account
    count is decided by whatever it costs to make one

a limit is only as strong as its unit is expensive; putting
one on a free identifier bounds a number that was never the
one at issue

The limit is enforced correctly and 0 accounts have exceeded it: applied after
authentication, shared counter, correct retry-after, and it stopped a real
incident in March. An actor holding 4000 free unverified accounts may send
400000 requests a minute - 15 times the legitimate peak and 9389 per ten
thousand of all traffic - while every one of those accounts is compliant.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
