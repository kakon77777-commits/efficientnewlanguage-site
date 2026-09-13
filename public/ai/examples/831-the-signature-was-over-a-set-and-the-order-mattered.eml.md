<!-- canonical: efficientnewlanguage.org/ai/examples/831-the-signature-was-over-a-set-and-the-order-mattered | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 831 — The signature was over a set and the order mattered

`the_signature_was_over_a_set_and_the_order_mattered.eml` - The change detector reported the routing ruleset unchanged across a deploy, and its signature was computed correctly. What the signature is over is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The change detector
# reported the routing ruleset unchanged across a deploy, and its signature was
# computed correctly. What the signature is over is computed below.
#
# The signature scheme is sound. It hashes the actual rules, not a label; the
# hash is strong; it is recomputed on every deploy; and a differing signature
# blocks the deploy for review. An identical signature means the rules are the
# same rules.
#
# The signature is over the SET of rules, and the rules are evaluated
# first-match-wins, so their order decides the outcome.

12 => rules
1 => distinct_rulesets_by_signature
2 => distinct_orderings_deployed
8100 => requests_routed_differently_between_the_orderings
0 => deploys_the_detector_flagged_for_review

int(requests_routed_differently_between_the_orderings * 10000 / 90000) => rerouted_share_per_myriad
distinct_orderings_deployed - distinct_rulesets_by_signature => orderings_the_signature_could_not_tell_apart

"rules                           : " + str(rules) ^0
"distinct rulesets by signature  : " + str(distinct_rulesets_by_signature) ^0
"distinct orderings deployed     : " + str(distinct_orderings_deployed) ^0
"  the signature told apart      : " + str(distinct_rulesets_by_signature) ^0
"  it could not tell apart       : " + str(orderings_the_signature_could_not_tell_apart) ^0
"requests routed differently     : " + str(requests_routed_differently_between_the_orderings) ^0
"deploys flagged for review      : " + str(deploys_the_detector_flagged_for_review) ^0
"rerouted share (of 90000)       : " + str(rerouted_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the detector verified ----

"the change detector" ^0
"  hashes : the actual rules, not a label" ^0
"  hash strength : strong" ^0
"  recomputed : every deploy" ^0
"  on a differing signature : blocks for review" ^0
"  signatures that differed : " + str(orderings_the_signature_could_not_tell_apart) ^0
"  verdict : RULESET UNCHANGED" ^0
"" ^0
"  hashing the rules themselves rather than a version label" ^0
"  is the part done right here, and it is why a real edit" ^0
"  to a rule would be caught" ^0
"" ^0

# ---- what the signature is over ----

"the bytes the signature covers" ^0
"  what is hashed : the set of rules, canonicalized by" ^0
"    sorting" ^0
"  why sorted : so a reordering in the file is not a false" ^0
"    change" ^0
"  how the rules are evaluated : first-match-wins, in" ^0
"    order" ^0
"  so order : is meaning, not formatting" ^0
"  what sorting the set discards : exactly that meaning" ^0
"" ^0

# ---- what the two orderings did ----

"the same twelve rules, two orders" ^0
"  signature of each : identical" ^0
"  what the detector said : no change" ^0
"  requests the two orders route differently : " ^0
"    " + str(requests_routed_differently_between_the_orderings) ^0
"  is the signature wrong : no; the set of rules is the" ^0
"    same set" ^0
"  is the set the thing that decides routing : no; the" ^0
"    order is" ^0
"" ^0

# ---- null control ----

# The same rules, with the signature computed over the ordered list rather than
# the sorted set.
1 => nc_signatures_when_hashing_the_set
2 => nc_signatures_when_hashing_the_order
1 => nc_deploys_it_would_flag

"null control - hash the ordered list, not the set" ^0
"  signatures, hashing the set : " ^0
"    " + str(nc_signatures_when_hashing_the_set) ^0
"  signatures, hashing the order : " ^0
"    " + str(nc_signatures_when_hashing_the_order) ^0
"  deploys it would flag : " + str(nc_deploys_it_would_flag) ^0
"  no rule changed; the signature stopped discarding the" ^0
"  order that decides the outcome" ^0
"" ^0

# ---- the rule ----

"what an unchanged signature guarantees" ^0
"  the set of rules is identical : exactly, strong hash," ^0
"    recomputed every deploy" ^0
"  the routing is unchanged : not addressed; the signature" ^0
"    is over the set of rules and evaluation is" ^0
"    first-match-wins - reordering the same " + str(rules) + " rules kept the" ^0
"    signature identical and routed " + str(requests_routed_differently_between_the_orderings) + " requests differently" ^0
"" ^0

"a signature proves identity of what it hashes, and hashing a set proves" ^0
"identity of the set; when order carries meaning, canonicalizing it away makes" ^0
"the signature blind to the very change it is watching for" ^0
"" ^0

"It hashes the real rules with a strong hash every deploy and blocks on a diff -" ^0
"a correct signature over the set. Evaluation is first-match-wins, so the same " ^0
"" + str(rules) + " rules in two orders share one signature and route " + str(requests_routed_differently_between_the_orderings) + " requests apart," ^0
"under " + str(deploys_the_detector_flagged_for_review) + " deploys flagged." ^0
```

## Python (deterministic transpilation)

```python
rules = 12
distinct_rulesets_by_signature = 1
distinct_orderings_deployed = 2
requests_routed_differently_between_the_orderings = 8100
deploys_the_detector_flagged_for_review = 0
rerouted_share_per_myriad = int(requests_routed_differently_between_the_orderings * 10000 / 90000)
orderings_the_signature_could_not_tell_apart = distinct_orderings_deployed - distinct_rulesets_by_signature
print("rules                           : " + str(rules))
print("distinct rulesets by signature  : " + str(distinct_rulesets_by_signature))
print("distinct orderings deployed     : " + str(distinct_orderings_deployed))
print("  the signature told apart      : " + str(distinct_rulesets_by_signature))
print("  it could not tell apart       : " + str(orderings_the_signature_could_not_tell_apart))
print("requests routed differently     : " + str(requests_routed_differently_between_the_orderings))
print("deploys flagged for review      : " + str(deploys_the_detector_flagged_for_review))
print("rerouted share (of 90000)       : " + str(rerouted_share_per_myriad) + " per ten thousand")
print("")
print("the change detector")
print("  hashes : the actual rules, not a label")
print("  hash strength : strong")
print("  recomputed : every deploy")
print("  on a differing signature : blocks for review")
print("  signatures that differed : " + str(orderings_the_signature_could_not_tell_apart))
print("  verdict : RULESET UNCHANGED")
print("")
print("  hashing the rules themselves rather than a version label")
print("  is the part done right here, and it is why a real edit")
print("  to a rule would be caught")
print("")
print("the bytes the signature covers")
print("  what is hashed : the set of rules, canonicalized by")
print("    sorting")
print("  why sorted : so a reordering in the file is not a false")
print("    change")
print("  how the rules are evaluated : first-match-wins, in")
print("    order")
print("  so order : is meaning, not formatting")
print("  what sorting the set discards : exactly that meaning")
print("")
print("the same twelve rules, two orders")
print("  signature of each : identical")
print("  what the detector said : no change")
print("  requests the two orders route differently : ")
print("    " + str(requests_routed_differently_between_the_orderings))
print("  is the signature wrong : no; the set of rules is the")
print("    same set")
print("  is the set the thing that decides routing : no; the")
print("    order is")
print("")
nc_signatures_when_hashing_the_set = 1
nc_signatures_when_hashing_the_order = 2
nc_deploys_it_would_flag = 1
print("null control - hash the ordered list, not the set")
print("  signatures, hashing the set : ")
print("    " + str(nc_signatures_when_hashing_the_set))
print("  signatures, hashing the order : ")
print("    " + str(nc_signatures_when_hashing_the_order))
print("  deploys it would flag : " + str(nc_deploys_it_would_flag))
print("  no rule changed; the signature stopped discarding the")
print("  order that decides the outcome")
print("")
print("what an unchanged signature guarantees")
print("  the set of rules is identical : exactly, strong hash,")
print("    recomputed every deploy")
print("  the routing is unchanged : not addressed; the signature")
print("    is over the set of rules and evaluation is")
print("    first-match-wins - reordering the same " + str(rules) + " rules kept the")
print("    signature identical and routed " + str(requests_routed_differently_between_the_orderings) + " requests differently")
print("")
print("a signature proves identity of what it hashes, and hashing a set proves")
print("identity of the set; when order carries meaning, canonicalizing it away makes")
print("the signature blind to the very change it is watching for")
print("")
print("It hashes the real rules with a strong hash every deploy and blocks on a diff -")
print("a correct signature over the set. Evaluation is first-match-wins, so the same ")
print("" + str(rules) + " rules in two orders share one signature and route " + str(requests_routed_differently_between_the_orderings) + " requests apart,")
print("under " + str(deploys_the_detector_flagged_for_review) + " deploys flagged.")
```

## stdout (executed)

```text
rules                           : 12
distinct rulesets by signature  : 1
distinct orderings deployed     : 2
  the signature told apart      : 1
  it could not tell apart       : 1
requests routed differently     : 8100
deploys flagged for review      : 0
rerouted share (of 90000)       : 900 per ten thousand

the change detector
  hashes : the actual rules, not a label
  hash strength : strong
  recomputed : every deploy
  on a differing signature : blocks for review
  signatures that differed : 1
  verdict : RULESET UNCHANGED

  hashing the rules themselves rather than a version label
  is the part done right here, and it is why a real edit
  to a rule would be caught

the bytes the signature covers
  what is hashed : the set of rules, canonicalized by
    sorting
  why sorted : so a reordering in the file is not a false
    change
  how the rules are evaluated : first-match-wins, in
    order
  so order : is meaning, not formatting
  what sorting the set discards : exactly that meaning

the same twelve rules, two orders
  signature of each : identical
  what the detector said : no change
  requests the two orders route differently : 
    8100
  is the signature wrong : no; the set of rules is the
    same set
  is the set the thing that decides routing : no; the
    order is

null control - hash the ordered list, not the set
  signatures, hashing the set : 
    1
  signatures, hashing the order : 
    2
  deploys it would flag : 1
  no rule changed; the signature stopped discarding the
  order that decides the outcome

what an unchanged signature guarantees
  the set of rules is identical : exactly, strong hash,
    recomputed every deploy
  the routing is unchanged : not addressed; the signature
    is over the set of rules and evaluation is
    first-match-wins - reordering the same 12 rules kept the
    signature identical and routed 8100 requests differently

a signature proves identity of what it hashes, and hashing a set proves
identity of the set; when order carries meaning, canonicalizing it away makes
the signature blind to the very change it is watching for

It hashes the real rules with a strong hash every deploy and blocks on a diff -
a correct signature over the set. Evaluation is first-match-wins, so the same 
12 rules in two orders share one signature and route 8100 requests apart,
under 0 deploys flagged.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
