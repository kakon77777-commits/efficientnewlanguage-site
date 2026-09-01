<!-- canonical: efficientnewlanguage.org/ai/examples/653-the-request-was-authenticated-and-the-callback-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 653 — The request was authenticated and the callback was not

`the_request_was_authenticated_and_the_callback_was_not.eml` - Every inbound request is authenticated and none has ever got through unsigned. What the outbound half proves is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every inbound
# request is authenticated and none has ever got through unsigned. What the
# outbound half proves is computed below.
#
# The inbound authentication is thorough. Requests carry a signature over the
# body and a timestamp, replays inside the window are rejected by a nonce cache,
# the signing keys are per-tenant and rotated, and four million two hundred
# thousand requests this month produced zero unsigned acceptances. A penetration
# test last quarter did not get past it.
#
# The API is asynchronous. It accepts work, returns immediately, and later POSTs
# the result to a URL the customer gave us — and that direction was designed as
# a notification rather than as a message anyone would act on.
#
# The callback carries no signature. A customer receiving one cannot distinguish
# it from a POST anybody made to the same URL.

4200000 => inbound_requests
0 => unsigned_accepted
4200000 => callbacks_sent
0 => callbacks_signed
1840 => customers
712 => customers_checking_the_source_address

customers - customers_checking_the_source_address => customers_with_no_check

"inbound requests            : " + str(inbound_requests) ^0
"accepted without a signature: " + str(unsigned_accepted) ^0
"" ^0
"callbacks sent              : " + str(callbacks_sent) ^0
"callbacks signed            : " + str(callbacks_signed) ^0
"customers                   : " + str(customers) ^0
"  checking the source address : " + str(customers_checking_the_source_address) ^0
"  checking nothing            : " + str(customers_with_no_check) ^0
"" ^0

# ---- what the inbound check verified ----

"the request authentication" ^0
"  signature over the body : required" ^0
"  timestamp window        : enforced" ^0
"  replay inside the window: rejected by a nonce cache" ^0
"  keys                    : per tenant, rotated" ^0
"  unsigned acceptances    : " + str(unsigned_accepted) ^0
"  penetration test        : did not get past it" ^0
"  verdict                 : AUTHENTICATED" ^0
"" ^0
"  this is not a token in a header; it is a real signing" ^0
"  scheme and it holds" ^0
"" ^0

# ---- what the outbound half carries ----

"the callback" ^0
"  signature      : none" ^0
"  shared secret  : none" ^0
"  mutual tls     : no" ^0
"  what a receiver can verify : that something POSTed" ^0
"    valid json to a url" ^0
"" ^0
"  the url is not secret either: it is submitted in the" ^0
"  request, logged by both sides, and often a path under a" ^0
"  documented prefix" ^0
"" ^0

int(customers_with_no_check * 10000 / customers) => unprotected_per_myriad
"customers acting on an unverifiable message : " + str(unprotected_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why the source address check is not the answer ----

# The 712 who check the source address are checking a list we publish and
# change. It is better than nothing and it is not authentication: it says the
# packet came from a range, not that the payload is ours or unmodified.
"what checking the source address establishes" ^0
"  the packet came from a published range : yes" ^0
"  the payload is the one we sent         : no" ^0
"  the payload has not been replayed      : no" ^0
"  customers relying on it                : " + str(customers_checking_the_source_address) ^0
"" ^0

# ---- null control ----

# The same API, signing the callback with the same per-tenant key the inbound
# direction already uses.
callbacks_sent => nc_callbacks_signed
0 => nc_customers_with_no_check

"null control - sign the callback with the same key" ^0
"  unsigned acceptances : " + str(unsigned_accepted) + ", unchanged" ^0
"  callbacks signed     : " + str(nc_callbacks_signed) ^0
"  customers with no check : " + str(nc_customers_with_no_check) ^0
"  the inbound side did not get stronger; the key it" ^0
"  already holds started being used in both directions" ^0
"" ^0

# ---- the rule ----

"what request authentication guarantees" ^0
"  we know who is asking : exactly" ^0
"  they know it is us    : not addressed, and the two are" ^0
"    different keys pointed in different directions even" ^0
"    when they are the same key" ^0
"" ^0
"authentication is directional; a scheme that answers 'is this" ^0
"caller real' says nothing about 'is this result real', and an" ^0
"asynchronous API asks the second question of its customers" ^0
"" ^0

"Every one of " + str(inbound_requests) + " inbound requests was authenticated and " + str(unsigned_accepted) + " unsigned ones" ^0
"were accepted: signature over the body, enforced timestamp, nonce cache,"  ^0
"per-tenant rotated keys, a penetration test that did not get past it. All" ^0
str(callbacks_sent) + " callbacks went out unsigned, so " + str(customers_with_no_check) + " of " + str(customers) + " customers - " + str(unprotected_per_myriad) ^0
"per ten thousand - act on a result they have no way to attribute to us." ^0
```

## Python (deterministic transpilation)

```python
inbound_requests = 4200000
unsigned_accepted = 0
callbacks_sent = 4200000
callbacks_signed = 0
customers = 1840
customers_checking_the_source_address = 712
customers_with_no_check = customers - customers_checking_the_source_address
print("inbound requests            : " + str(inbound_requests))
print("accepted without a signature: " + str(unsigned_accepted))
print("")
print("callbacks sent              : " + str(callbacks_sent))
print("callbacks signed            : " + str(callbacks_signed))
print("customers                   : " + str(customers))
print("  checking the source address : " + str(customers_checking_the_source_address))
print("  checking nothing            : " + str(customers_with_no_check))
print("")
print("the request authentication")
print("  signature over the body : required")
print("  timestamp window        : enforced")
print("  replay inside the window: rejected by a nonce cache")
print("  keys                    : per tenant, rotated")
print("  unsigned acceptances    : " + str(unsigned_accepted))
print("  penetration test        : did not get past it")
print("  verdict                 : AUTHENTICATED")
print("")
print("  this is not a token in a header; it is a real signing")
print("  scheme and it holds")
print("")
print("the callback")
print("  signature      : none")
print("  shared secret  : none")
print("  mutual tls     : no")
print("  what a receiver can verify : that something POSTed")
print("    valid json to a url")
print("")
print("  the url is not secret either: it is submitted in the")
print("  request, logged by both sides, and often a path under a")
print("  documented prefix")
print("")
unprotected_per_myriad = int(customers_with_no_check * 10000 / customers)
print("customers acting on an unverifiable message : " + str(unprotected_per_myriad) + " per ten thousand")
print("")
print("what checking the source address establishes")
print("  the packet came from a published range : yes")
print("  the payload is the one we sent         : no")
print("  the payload has not been replayed      : no")
print("  customers relying on it                : " + str(customers_checking_the_source_address))
print("")
nc_callbacks_signed = callbacks_sent
nc_customers_with_no_check = 0
print("null control - sign the callback with the same key")
print("  unsigned acceptances : " + str(unsigned_accepted) + ", unchanged")
print("  callbacks signed     : " + str(nc_callbacks_signed))
print("  customers with no check : " + str(nc_customers_with_no_check))
print("  the inbound side did not get stronger; the key it")
print("  already holds started being used in both directions")
print("")
print("what request authentication guarantees")
print("  we know who is asking : exactly")
print("  they know it is us    : not addressed, and the two are")
print("    different keys pointed in different directions even")
print("    when they are the same key")
print("")
print("authentication is directional; a scheme that answers 'is this")
print("caller real' says nothing about 'is this result real', and an")
print("asynchronous API asks the second question of its customers")
print("")
print("Every one of " + str(inbound_requests) + " inbound requests was authenticated and " + str(unsigned_accepted) + " unsigned ones")
print("were accepted: signature over the body, enforced timestamp, nonce cache,")
print("per-tenant rotated keys, a penetration test that did not get past it. All")
print(str(callbacks_sent) + " callbacks went out unsigned, so " + str(customers_with_no_check) + " of " + str(customers) + " customers - " + str(unprotected_per_myriad))
print("per ten thousand - act on a result they have no way to attribute to us.")
```

## stdout (executed)

```text
inbound requests            : 4200000
accepted without a signature: 0

callbacks sent              : 4200000
callbacks signed            : 0
customers                   : 1840
  checking the source address : 712
  checking nothing            : 1128

the request authentication
  signature over the body : required
  timestamp window        : enforced
  replay inside the window: rejected by a nonce cache
  keys                    : per tenant, rotated
  unsigned acceptances    : 0
  penetration test        : did not get past it
  verdict                 : AUTHENTICATED

  this is not a token in a header; it is a real signing
  scheme and it holds

the callback
  signature      : none
  shared secret  : none
  mutual tls     : no
  what a receiver can verify : that something POSTed
    valid json to a url

  the url is not secret either: it is submitted in the
  request, logged by both sides, and often a path under a
  documented prefix

customers acting on an unverifiable message : 6130 per ten thousand

what checking the source address establishes
  the packet came from a published range : yes
  the payload is the one we sent         : no
  the payload has not been replayed      : no
  customers relying on it                : 712

null control - sign the callback with the same key
  unsigned acceptances : 0, unchanged
  callbacks signed     : 4200000
  customers with no check : 0
  the inbound side did not get stronger; the key it
  already holds started being used in both directions

what request authentication guarantees
  we know who is asking : exactly
  they know it is us    : not addressed, and the two are
    different keys pointed in different directions even
    when they are the same key

authentication is directional; a scheme that answers 'is this
caller real' says nothing about 'is this result real', and an
asynchronous API asks the second question of its customers

Every one of 4200000 inbound requests was authenticated and 0 unsigned ones
were accepted: signature over the body, enforced timestamp, nonce cache,
per-tenant rotated keys, a penetration test that did not get past it. All
4200000 callbacks went out unsigned, so 1128 of 1840 customers - 6130
per ten thousand - act on a result they have no way to attribute to us.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
