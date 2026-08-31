<!-- canonical: efficientnewlanguage.org/ai/examples/628-the-certificate-was-valid-and-the-chain-was-not | ai_layer_version: 0.1.0 | updated: 2026-08-31 -->

# Example 628 — The certificate was valid and the chain was not

`the_certificate_was_valid_and_the_chain_was_not.eml` - The leaf certificate is valid by every property a certificate has. Which clients can actually authenticate the server is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The leaf
# certificate is valid by every property a certificate has. Which clients can
# actually authenticate the server is computed below.
#
# "Is the certificate valid" is a question about one object: not expired, the
# hostname matches, the signature verifies against the issuer named in it. All
# three hold here, the monitoring check that asks them is green, and the
# operator who renewed the leaf did the renewal correctly.
#
# Authentication is not a property of the leaf. It is a property of a PATH from
# the leaf to a root the client already trusts, and every link in that path is
# a separate certificate with its own validity window.
#
# The intermediate expired eleven days ago. Clients that already hold it cached
# from an earlier handshake build the path anyway. Clients that do not, and
# whose stack does not chase the issuer URL in the leaf, have a valid
# certificate they cannot chain.

1840000 => handshakes_per_day
# The server sends leaf + intermediate. Clients that got a complete chain
# succeed regardless of what they cached.
1490000 => sent_complete_chain
11 => days_since_intermediate_expired

handshakes_per_day - sent_complete_chain => needed_to_supply_the_link
# Of those, the ones holding a cached intermediate from an earlier visit.
203000 => had_it_cached
# Of the rest, the ones whose stack fetches the issuer URL from the leaf.
81000 => fetched_the_issuer_url

needed_to_supply_the_link - had_it_cached - fetched_the_issuer_url => failed

"handshakes per day             : " + str(handshakes_per_day) ^0
"served a complete chain        : " + str(sent_complete_chain) ^0
"had to supply the link         : " + str(needed_to_supply_the_link) ^0
"  held it cached               : " + str(had_it_cached) ^0
"  fetched the issuer url       : " + str(fetched_the_issuer_url) ^0
"  could not build a path       : " + str(failed) ^0
"" ^0

# ---- what the check verified ----

"the certificate check, run every five minutes" ^0
"  not before   : passed" ^0
"  not after    : passed, 47 days remaining" ^0
"  hostname     : passed, exact match" ^0
"  signature    : passed, verifies against the named issuer" ^0
"  key size     : passed" ^0
"  verdict      : VALID" ^0
"" ^0
"  every line is true of the leaf, and the leaf is the only" ^0
"  object the check was given" ^0
"" ^0

# ---- what the client needs ----

"the path a client must build" ^0
"  leaf         : valid, 47 days remaining" ^0
"  intermediate : EXPIRED " + str(days_since_intermediate_expired) + " days ago" ^0
"  root         : valid, in the trust store" ^0
"" ^0
"  the leaf's own validity window says nothing about the" ^0
"  window of the certificate that signed it" ^0
"" ^0

int(failed * 10000 / handshakes_per_day) => failed_per_myriad
"clients that cannot authenticate : " + str(failed) ^0
"  as a share of handshakes       : " + str(failed_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- why it looks intermittent ----

# A cached intermediate is why the same client succeeds on Tuesday and fails
# from a fresh machine on Wednesday. The cache is not a fallback anybody
# configured; it is a side effect of having visited before.
had_it_cached + fetched_the_issuer_url => rescued_by_something_incidental

"reports say 'works for me'" ^0
"  succeeded on an incidental mechanism : " + str(rescued_by_something_incidental) ^0
"    a cached copy from an earlier visit, or a fetch the" ^0
"    stack does and the specification calls optional" ^0
"  neither is configuration; neither is guaranteed" ^0
"" ^0

# ---- null control ----

# The same expiry, with the intermediate renewed and shipped by the server.
0 => nc_failed
handshakes_per_day => nc_complete_chain

"null control - the same leaf, intermediate renewed" ^0
"  leaf verdict            : VALID, unchanged" ^0
"  served a complete chain : " + str(nc_complete_chain) ^0
"  could not build a path  : " + str(nc_failed) ^0
"  the leaf did not change; the path became buildable" ^0
"" ^0

# ---- the rule ----

"what a valid certificate guarantees" ^0
"  this object is well formed and unexpired : exactly" ^0
"  a client can build a trusted path to it  : not addressed," ^0
"    and the check cannot address it, because the rest of" ^0
"    the path is not in the object it was handed" ^0
"" ^0
"a certificate is one link; trust is the whole chain, and the" ^0
"only monitor that can see the difference is one that builds" ^0
"the path from a machine holding nothing" ^0
"" ^0

"The leaf is valid and the five-minute check is right to say so: " + str(days_since_intermediate_expired) + " days" ^0
"after the intermediate expired, not before, not after, hostname and signature" ^0
"all still pass. " + str(failed) + " handshakes a day - " + str(failed_per_myriad) + " per ten thousand - reach a" ^0
"server whose certificate is valid and cannot chain it, while " + str(rescued_by_something_incidental) ^0
"more succeed on a cached copy nobody configured and nothing renews." ^0
```

## Python (deterministic transpilation)

```python
handshakes_per_day = 1840000
sent_complete_chain = 1490000
days_since_intermediate_expired = 11
needed_to_supply_the_link = handshakes_per_day - sent_complete_chain
had_it_cached = 203000
fetched_the_issuer_url = 81000
failed = needed_to_supply_the_link - had_it_cached - fetched_the_issuer_url
print("handshakes per day             : " + str(handshakes_per_day))
print("served a complete chain        : " + str(sent_complete_chain))
print("had to supply the link         : " + str(needed_to_supply_the_link))
print("  held it cached               : " + str(had_it_cached))
print("  fetched the issuer url       : " + str(fetched_the_issuer_url))
print("  could not build a path       : " + str(failed))
print("")
print("the certificate check, run every five minutes")
print("  not before   : passed")
print("  not after    : passed, 47 days remaining")
print("  hostname     : passed, exact match")
print("  signature    : passed, verifies against the named issuer")
print("  key size     : passed")
print("  verdict      : VALID")
print("")
print("  every line is true of the leaf, and the leaf is the only")
print("  object the check was given")
print("")
print("the path a client must build")
print("  leaf         : valid, 47 days remaining")
print("  intermediate : EXPIRED " + str(days_since_intermediate_expired) + " days ago")
print("  root         : valid, in the trust store")
print("")
print("  the leaf's own validity window says nothing about the")
print("  window of the certificate that signed it")
print("")
failed_per_myriad = int(failed * 10000 / handshakes_per_day)
print("clients that cannot authenticate : " + str(failed))
print("  as a share of handshakes       : " + str(failed_per_myriad) + " per ten thousand")
print("")
rescued_by_something_incidental = had_it_cached + fetched_the_issuer_url
print("reports say 'works for me'")
print("  succeeded on an incidental mechanism : " + str(rescued_by_something_incidental))
print("    a cached copy from an earlier visit, or a fetch the")
print("    stack does and the specification calls optional")
print("  neither is configuration; neither is guaranteed")
print("")
nc_failed = 0
nc_complete_chain = handshakes_per_day
print("null control - the same leaf, intermediate renewed")
print("  leaf verdict            : VALID, unchanged")
print("  served a complete chain : " + str(nc_complete_chain))
print("  could not build a path  : " + str(nc_failed))
print("  the leaf did not change; the path became buildable")
print("")
print("what a valid certificate guarantees")
print("  this object is well formed and unexpired : exactly")
print("  a client can build a trusted path to it  : not addressed,")
print("    and the check cannot address it, because the rest of")
print("    the path is not in the object it was handed")
print("")
print("a certificate is one link; trust is the whole chain, and the")
print("only monitor that can see the difference is one that builds")
print("the path from a machine holding nothing")
print("")
print("The leaf is valid and the five-minute check is right to say so: " + str(days_since_intermediate_expired) + " days")
print("after the intermediate expired, not before, not after, hostname and signature")
print("all still pass. " + str(failed) + " handshakes a day - " + str(failed_per_myriad) + " per ten thousand - reach a")
print("server whose certificate is valid and cannot chain it, while " + str(rescued_by_something_incidental))
print("more succeed on a cached copy nobody configured and nothing renews.")
```

## stdout (executed)

```text
handshakes per day             : 1840000
served a complete chain        : 1490000
had to supply the link         : 350000
  held it cached               : 203000
  fetched the issuer url       : 81000
  could not build a path       : 66000

the certificate check, run every five minutes
  not before   : passed
  not after    : passed, 47 days remaining
  hostname     : passed, exact match
  signature    : passed, verifies against the named issuer
  key size     : passed
  verdict      : VALID

  every line is true of the leaf, and the leaf is the only
  object the check was given

the path a client must build
  leaf         : valid, 47 days remaining
  intermediate : EXPIRED 11 days ago
  root         : valid, in the trust store

  the leaf's own validity window says nothing about the
  window of the certificate that signed it

clients that cannot authenticate : 66000
  as a share of handshakes       : 358 per ten thousand

reports say 'works for me'
  succeeded on an incidental mechanism : 284000
    a cached copy from an earlier visit, or a fetch the
    stack does and the specification calls optional
  neither is configuration; neither is guaranteed

null control - the same leaf, intermediate renewed
  leaf verdict            : VALID, unchanged
  served a complete chain : 1840000
  could not build a path  : 0
  the leaf did not change; the path became buildable

what a valid certificate guarantees
  this object is well formed and unexpired : exactly
  a client can build a trusted path to it  : not addressed,
    and the check cannot address it, because the rest of
    the path is not in the object it was handed

a certificate is one link; trust is the whole chain, and the
only monitor that can see the difference is one that builds
the path from a machine holding nothing

The leaf is valid and the five-minute check is right to say so: 11 days
after the intermediate expired, not before, not after, hostname and signature
all still pass. 66000 handshakes a day - 358 per ten thousand - reach a
server whose certificate is valid and cannot chain it, while 284000
more succeed on a cached copy nobody configured and nothing renews.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
