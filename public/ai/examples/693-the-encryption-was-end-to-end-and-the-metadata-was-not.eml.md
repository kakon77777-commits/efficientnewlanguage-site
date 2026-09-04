<!-- canonical: efficientnewlanguage.org/ai/examples/693-the-encryption-was-end-to-end-and-the-metadata-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 693 — The encryption was end to end and the metadata was not

`the_encryption_was_end_to_end_and_the_metadata_was_not.eml` - The server cannot read a single message body and the cryptography is not the weak part. What the server does hold is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The server cannot
# read a single message body and the cryptography is not the weak part. What the
# server does hold is computed below.
#
# The end-to-end encryption is real. Keys are generated on the device and never
# leave it, the server stores ciphertext it has no key for, forward secrecy is
# implemented and exercised, and an independent review found no way for the
# operator to recover a body. Eighty-four million messages a day and zero
# readable ones.
#
# A message is a body and an envelope. Delivery needs the envelope in clear —
# who to, from whom, when, how big — and none of that is what the cryptography
# was asked to hide.
#
# Two years of envelopes is a graph.

84000000 => messages_per_day
0 => bodies_readable_by_the_server
6 => envelope_fields_in_plaintext
730 => retention_days
11400000 => distinct_pairs_per_day
2 => independent_reviews_finding_no_body_recovery

messages_per_day * retention_days => envelopes_retained
int(distinct_pairs_per_day * 10000 / messages_per_day) => pairs_per_myriad

"messages per day             : " + str(messages_per_day) ^0
"bodies readable by the server: " + str(bodies_readable_by_the_server) ^0
"envelope fields in plaintext : " + str(envelope_fields_in_plaintext) ^0
"retention, days              : " + str(retention_days) ^0
"envelopes retained           : " + str(envelopes_retained) ^0
"distinct sender-recipient pairs per day : " + str(distinct_pairs_per_day) ^0
"" ^0

# ---- what the encryption verified ----

"the cryptography" ^0
"  keys generated on the device : yes" ^0
"  keys leaving the device      : never" ^0
"  what the server stores       : ciphertext it has no key for" ^0
"  forward secrecy              : implemented and exercised" ^0
"  independent reviews finding a body-recovery path : " ^0
"    " + str(2 - independent_reviews_finding_no_body_recovery) + " of " + str(independent_reviews_finding_no_body_recovery) ^0
"  bodies readable              : " + str(bodies_readable_by_the_server) ^0
"  verdict                      : END TO END" ^0
"" ^0
"  the claim is true and the implementation deserves it" ^0
"" ^0

# ---- what delivery needs in clear ----

"the envelope" ^0
"  recipient      : required to route" ^0
"  sender         : required to reply and to rate limit" ^0
"  timestamp      : required to order" ^0
"  size           : required to bill and to allocate" ^0
"  device         : required to fan out" ^0
"  read receipt   : required by the product" ^0
"  fields the cryptography was asked to cover : the body" ^0
"" ^0
"  none of the six is an oversight; each is load-bearing" ^0
"  for something the service must do" ^0
"" ^0

"pairs as a share of messages : " + str(pairs_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the envelopes are ----

# Who talks to whom, how often, at what hour, and how long the messages are.
# The content of a conversation between a person and a clinic is protected; the
# fact of it is a row.
"what a graph over " + str(envelopes_retained) + " envelopes answers" ^0
"  who talks to whom       : directly" ^0
"  how often, at what hour : directly" ^0
"  who stopped talking to whom, and when : directly" ^0
"  the words exchanged     : not at all" ^0
"" ^0
"  the protected question and the answerable one are" ^0
"  different questions, and only one of them was asked of" ^0
"  the cryptography" ^0
"" ^0

# ---- null control ----

# The same encryption, with sealed sender and padded sizes, so the envelope
# carries less than delivery previously demanded.
1 => nc_envelope_fields_in_plaintext
bodies_readable_by_the_server => nc_bodies_readable

"null control - sealed sender and padded sizes" ^0
"  bodies readable        : " + str(nc_bodies_readable) + ", unchanged" ^0
"  envelope fields in plaintext : " + str(nc_envelope_fields_in_plaintext) ^0
"  the cryptography did not get stronger; the routing" ^0
"  stopped requiring the fields the graph is built from" ^0
"" ^0

# ---- the rule ----

"what end-to-end encryption guarantees" ^0
"  the operator cannot read the content : exactly" ^0
"  the operator learns nothing           : not addressed;" ^0
"    the envelope is what delivery runs on, and it was" ^0
"    never in the scope of the guarantee" ^0
"" ^0
"encryption protects what it is applied to; a system's" ^0
"metadata is the part that must stay legible for the system to" ^0
"work, which is exactly why it is the part that accumulates" ^0
"" ^0

"The encryption is genuine: device-generated keys that never leave, forward" ^0
"secrecy, " + str(independent_reviews_finding_no_body_recovery) + " independent reviews finding no recovery path, and " + str(bodies_readable_by_the_server) + " readable" ^0
"bodies out of " + str(messages_per_day) + " a day. Delivery needs " + str(envelope_fields_in_plaintext) + " envelope fields in clear, so" ^0
str(envelopes_retained) + " envelopes are retained over " + str(retention_days) + " days - " + str(distinct_pairs_per_day) + " distinct pairs a day," ^0
str(pairs_per_myriad) + " per ten thousand of the traffic - and none of them is ciphertext." ^0
```

## Python (deterministic transpilation)

```python
messages_per_day = 84000000
bodies_readable_by_the_server = 0
envelope_fields_in_plaintext = 6
retention_days = 730
distinct_pairs_per_day = 11400000
independent_reviews_finding_no_body_recovery = 2
envelopes_retained = messages_per_day * retention_days
pairs_per_myriad = int(distinct_pairs_per_day * 10000 / messages_per_day)
print("messages per day             : " + str(messages_per_day))
print("bodies readable by the server: " + str(bodies_readable_by_the_server))
print("envelope fields in plaintext : " + str(envelope_fields_in_plaintext))
print("retention, days              : " + str(retention_days))
print("envelopes retained           : " + str(envelopes_retained))
print("distinct sender-recipient pairs per day : " + str(distinct_pairs_per_day))
print("")
print("the cryptography")
print("  keys generated on the device : yes")
print("  keys leaving the device      : never")
print("  what the server stores       : ciphertext it has no key for")
print("  forward secrecy              : implemented and exercised")
print("  independent reviews finding a body-recovery path : ")
print("    " + str(2 - independent_reviews_finding_no_body_recovery) + " of " + str(independent_reviews_finding_no_body_recovery))
print("  bodies readable              : " + str(bodies_readable_by_the_server))
print("  verdict                      : END TO END")
print("")
print("  the claim is true and the implementation deserves it")
print("")
print("the envelope")
print("  recipient      : required to route")
print("  sender         : required to reply and to rate limit")
print("  timestamp      : required to order")
print("  size           : required to bill and to allocate")
print("  device         : required to fan out")
print("  read receipt   : required by the product")
print("  fields the cryptography was asked to cover : the body")
print("")
print("  none of the six is an oversight; each is load-bearing")
print("  for something the service must do")
print("")
print("pairs as a share of messages : " + str(pairs_per_myriad) + " per ten thousand")
print("")
print("what a graph over " + str(envelopes_retained) + " envelopes answers")
print("  who talks to whom       : directly")
print("  how often, at what hour : directly")
print("  who stopped talking to whom, and when : directly")
print("  the words exchanged     : not at all")
print("")
print("  the protected question and the answerable one are")
print("  different questions, and only one of them was asked of")
print("  the cryptography")
print("")
nc_envelope_fields_in_plaintext = 1
nc_bodies_readable = bodies_readable_by_the_server
print("null control - sealed sender and padded sizes")
print("  bodies readable        : " + str(nc_bodies_readable) + ", unchanged")
print("  envelope fields in plaintext : " + str(nc_envelope_fields_in_plaintext))
print("  the cryptography did not get stronger; the routing")
print("  stopped requiring the fields the graph is built from")
print("")
print("what end-to-end encryption guarantees")
print("  the operator cannot read the content : exactly")
print("  the operator learns nothing           : not addressed;")
print("    the envelope is what delivery runs on, and it was")
print("    never in the scope of the guarantee")
print("")
print("encryption protects what it is applied to; a system's")
print("metadata is the part that must stay legible for the system to")
print("work, which is exactly why it is the part that accumulates")
print("")
print("The encryption is genuine: device-generated keys that never leave, forward")
print("secrecy, " + str(independent_reviews_finding_no_body_recovery) + " independent reviews finding no recovery path, and " + str(bodies_readable_by_the_server) + " readable")
print("bodies out of " + str(messages_per_day) + " a day. Delivery needs " + str(envelope_fields_in_plaintext) + " envelope fields in clear, so")
print(str(envelopes_retained) + " envelopes are retained over " + str(retention_days) + " days - " + str(distinct_pairs_per_day) + " distinct pairs a day,")
print(str(pairs_per_myriad) + " per ten thousand of the traffic - and none of them is ciphertext.")
```

## stdout (executed)

```text
messages per day             : 84000000
bodies readable by the server: 0
envelope fields in plaintext : 6
retention, days              : 730
envelopes retained           : 61320000000
distinct sender-recipient pairs per day : 11400000

the cryptography
  keys generated on the device : yes
  keys leaving the device      : never
  what the server stores       : ciphertext it has no key for
  forward secrecy              : implemented and exercised
  independent reviews finding a body-recovery path : 
    0 of 2
  bodies readable              : 0
  verdict                      : END TO END

  the claim is true and the implementation deserves it

the envelope
  recipient      : required to route
  sender         : required to reply and to rate limit
  timestamp      : required to order
  size           : required to bill and to allocate
  device         : required to fan out
  read receipt   : required by the product
  fields the cryptography was asked to cover : the body

  none of the six is an oversight; each is load-bearing
  for something the service must do

pairs as a share of messages : 1357 per ten thousand

what a graph over 61320000000 envelopes answers
  who talks to whom       : directly
  how often, at what hour : directly
  who stopped talking to whom, and when : directly
  the words exchanged     : not at all

  the protected question and the answerable one are
  different questions, and only one of them was asked of
  the cryptography

null control - sealed sender and padded sizes
  bodies readable        : 0, unchanged
  envelope fields in plaintext : 1
  the cryptography did not get stronger; the routing
  stopped requiring the fields the graph is built from

what end-to-end encryption guarantees
  the operator cannot read the content : exactly
  the operator learns nothing           : not addressed;
    the envelope is what delivery runs on, and it was
    never in the scope of the guarantee

encryption protects what it is applied to; a system's
metadata is the part that must stay legible for the system to
work, which is exactly why it is the part that accumulates

The encryption is genuine: device-generated keys that never leave, forward
secrecy, 2 independent reviews finding no recovery path, and 0 readable
bodies out of 84000000 a day. Delivery needs 6 envelope fields in clear, so
61320000000 envelopes are retained over 730 days - 11400000 distinct pairs a day,
1357 per ten thousand of the traffic - and none of them is ciphertext.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
