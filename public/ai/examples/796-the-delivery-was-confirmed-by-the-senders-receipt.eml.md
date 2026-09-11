<!-- canonical: efficientnewlanguage.org/ai/examples/796-the-delivery-was-confirmed-by-the-senders-receipt | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 796 — The delivery was confirmed by the senders receipt

`the_delivery_was_confirmed_by_the_senders_receipt.eml` - The delivery rate has been at 100 per hundred for the whole quarter, and every delivery it counts is real. What a delivery is counted at is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The delivery rate
# has been at 100 per hundred for the whole quarter, and every delivery it
# counts is real. What a delivery is counted at is computed below.
#
# The pipeline is instrumented well. Every send emits a structured event; the
# events are collected without sampling; a send that throws is caught and
# counted as failed; and the rate is reconciled against the send log nightly.
#
# The delivery event is emitted by the sender, when it hands off to the carrier.

900000 => messages_sent
900000 => receipts_emitted
900000 => deliveries_reported
10000 => reported_delivery_per_myriad
861000 => recipient_acknowledgements
39000 => bounced_after_the_handoff

int(recipient_acknowledgements * 10000 / messages_sent) => real_delivery_per_myriad
int(bounced_after_the_handoff * 10000 / messages_sent) => lost_after_handoff_per_myriad
messages_sent - recipient_acknowledgements => messages_never_acknowledged

"messages sent                   : " + str(messages_sent) ^0
"  receipts emitted              : " + str(receipts_emitted) ^0
"  deliveries reported           : " + str(deliveries_reported) ^0
"reported delivery rate          : " + str(reported_delivery_per_myriad) + " per ten thousand" ^0
"" ^0
"recipient acknowledgements      : " + str(recipient_acknowledgements) ^0
"  never acknowledged            : " + str(messages_never_acknowledged) ^0
"bounced after the handoff       : " + str(bounced_after_the_handoff) ^0
"real delivery rate              : " + str(real_delivery_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the metric verified ----

"the delivery metric" ^0
"  every send : emits a structured event" ^0
"  collection : no sampling" ^0
"  a send that throws : caught and counted as failed" ^0
"  reconciliation : against the send log, nightly" ^0
"  deliveries reported : " + str(deliveries_reported) ^0
"  verdict : DELIVERED" ^0
"" ^0
"  counting a thrown send as failed is the part almost" ^0
"  nobody does, and it is why the rate is trusted not to" ^0
"  quietly drop errors" ^0
"" ^0

# ---- what the receipt is emitted at ----

"the delivery event" ^0
"  who writes it : the sender" ^0
"  when : at handoff to the carrier" ^0
"  what it proves : the carrier accepted the message" ^0
"  what it does not observe : anything the carrier does" ^0
"    after accepting it" ^0
"  messages that bounced past that point : " ^0
"    " + str(bounced_after_the_handoff) ^0
"  acknowledgements from the recipient : counted here? no" ^0
"" ^0

# ---- what the recipient got ----

"the recipient side" ^0
"  messages that acknowledged arrival : " ^0
"    " + str(recipient_acknowledgements) ^0
"  messages with no acknowledgement : " ^0
"    " + str(messages_never_acknowledged) ^0
"  what the dashboard shows for those : DELIVERED" ^0
"  bounces the sender's receipt recorded : 0; the receipt" ^0
"    was already written" ^0
"  real delivery once acks are counted : " ^0
"    " + str(real_delivery_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same rate, counted from recipient acknowledgements rather than from the
# sender's handoff receipt.
10000 => nc_handoff_delivery_per_myriad
9566 => nc_ack_delivery_per_myriad
39000 => nc_messages_the_ack_view_calls_undelivered

"null control - count acknowledgements, not handoffs" ^0
"  handoff-based delivery : " + str(nc_handoff_delivery_per_myriad) + ", unchanged" ^0
"  ack-based delivery : " ^0
"    " + str(nc_ack_delivery_per_myriad) + " per ten thousand" ^0
"  messages the ack view calls undelivered : " ^0
"    " + str(nc_messages_the_ack_view_calls_undelivered) ^0
"  no message moved; the count stopped being taken at the" ^0
"  moment the sender let go and started at the moment the" ^0
"  recipient caught" ^0
"" ^0

# ---- the rule ----

"what a 100 per hundred delivery rate guarantees" ^0
"  every message was handed to the carrier : exactly, all " ^0
"    " + str(messages_sent) + ", each with a receipt, thrown sends counted" ^0
"    as failed" ^0
"  every message reached the recipient : not addressed;" ^0
"    the receipt is written by the sender at handoff, and " ^0
"    " + str(bounced_after_the_handoff) + " messages bounced after the point the receipt" ^0
"    records" ^0
"" ^0
"a receipt is written by whoever holds the thing when it is" ^0
"written, and a sender writes its receipt when it lets go; the" ^0
"event proves the release, not the arrival, and the two are" ^0
"separated by everyone downstream" ^0
"" ^0

"Every send emits an unsampled event and a throw counts as failed - " + str(reported_delivery_per_myriad) + " per" ^0
"ten thousand delivered. The receipt is written by the sender at handoff, so " ^0
"" + str(bounced_after_the_handoff) + " messages bounced past it uncounted, leaving real delivery at " ^0
"" + str(real_delivery_per_myriad) + " per ten thousand against " + str(messages_never_acknowledged) + " never acknowledged." ^0
```

## Python (deterministic transpilation)

```python
messages_sent = 900000
receipts_emitted = 900000
deliveries_reported = 900000
reported_delivery_per_myriad = 10000
recipient_acknowledgements = 861000
bounced_after_the_handoff = 39000
real_delivery_per_myriad = int(recipient_acknowledgements * 10000 / messages_sent)
lost_after_handoff_per_myriad = int(bounced_after_the_handoff * 10000 / messages_sent)
messages_never_acknowledged = messages_sent - recipient_acknowledgements
print("messages sent                   : " + str(messages_sent))
print("  receipts emitted              : " + str(receipts_emitted))
print("  deliveries reported           : " + str(deliveries_reported))
print("reported delivery rate          : " + str(reported_delivery_per_myriad) + " per ten thousand")
print("")
print("recipient acknowledgements      : " + str(recipient_acknowledgements))
print("  never acknowledged            : " + str(messages_never_acknowledged))
print("bounced after the handoff       : " + str(bounced_after_the_handoff))
print("real delivery rate              : " + str(real_delivery_per_myriad) + " per ten thousand")
print("")
print("the delivery metric")
print("  every send : emits a structured event")
print("  collection : no sampling")
print("  a send that throws : caught and counted as failed")
print("  reconciliation : against the send log, nightly")
print("  deliveries reported : " + str(deliveries_reported))
print("  verdict : DELIVERED")
print("")
print("  counting a thrown send as failed is the part almost")
print("  nobody does, and it is why the rate is trusted not to")
print("  quietly drop errors")
print("")
print("the delivery event")
print("  who writes it : the sender")
print("  when : at handoff to the carrier")
print("  what it proves : the carrier accepted the message")
print("  what it does not observe : anything the carrier does")
print("    after accepting it")
print("  messages that bounced past that point : ")
print("    " + str(bounced_after_the_handoff))
print("  acknowledgements from the recipient : counted here? no")
print("")
print("the recipient side")
print("  messages that acknowledged arrival : ")
print("    " + str(recipient_acknowledgements))
print("  messages with no acknowledgement : ")
print("    " + str(messages_never_acknowledged))
print("  what the dashboard shows for those : DELIVERED")
print("  bounces the sender's receipt recorded : 0; the receipt")
print("    was already written")
print("  real delivery once acks are counted : ")
print("    " + str(real_delivery_per_myriad) + " per ten thousand")
print("")
nc_handoff_delivery_per_myriad = 10000
nc_ack_delivery_per_myriad = 9566
nc_messages_the_ack_view_calls_undelivered = 39000
print("null control - count acknowledgements, not handoffs")
print("  handoff-based delivery : " + str(nc_handoff_delivery_per_myriad) + ", unchanged")
print("  ack-based delivery : ")
print("    " + str(nc_ack_delivery_per_myriad) + " per ten thousand")
print("  messages the ack view calls undelivered : ")
print("    " + str(nc_messages_the_ack_view_calls_undelivered))
print("  no message moved; the count stopped being taken at the")
print("  moment the sender let go and started at the moment the")
print("  recipient caught")
print("")
print("what a 100 per hundred delivery rate guarantees")
print("  every message was handed to the carrier : exactly, all ")
print("    " + str(messages_sent) + ", each with a receipt, thrown sends counted")
print("    as failed")
print("  every message reached the recipient : not addressed;")
print("    the receipt is written by the sender at handoff, and ")
print("    " + str(bounced_after_the_handoff) + " messages bounced after the point the receipt")
print("    records")
print("")
print("a receipt is written by whoever holds the thing when it is")
print("written, and a sender writes its receipt when it lets go; the")
print("event proves the release, not the arrival, and the two are")
print("separated by everyone downstream")
print("")
print("Every send emits an unsampled event and a throw counts as failed - " + str(reported_delivery_per_myriad) + " per")
print("ten thousand delivered. The receipt is written by the sender at handoff, so ")
print("" + str(bounced_after_the_handoff) + " messages bounced past it uncounted, leaving real delivery at ")
print("" + str(real_delivery_per_myriad) + " per ten thousand against " + str(messages_never_acknowledged) + " never acknowledged.")
```

## stdout (executed)

```text
messages sent                   : 900000
  receipts emitted              : 900000
  deliveries reported           : 900000
reported delivery rate          : 10000 per ten thousand

recipient acknowledgements      : 861000
  never acknowledged            : 39000
bounced after the handoff       : 39000
real delivery rate              : 9566 per ten thousand

the delivery metric
  every send : emits a structured event
  collection : no sampling
  a send that throws : caught and counted as failed
  reconciliation : against the send log, nightly
  deliveries reported : 900000
  verdict : DELIVERED

  counting a thrown send as failed is the part almost
  nobody does, and it is why the rate is trusted not to
  quietly drop errors

the delivery event
  who writes it : the sender
  when : at handoff to the carrier
  what it proves : the carrier accepted the message
  what it does not observe : anything the carrier does
    after accepting it
  messages that bounced past that point : 
    39000
  acknowledgements from the recipient : counted here? no

the recipient side
  messages that acknowledged arrival : 
    861000
  messages with no acknowledgement : 
    39000
  what the dashboard shows for those : DELIVERED
  bounces the sender's receipt recorded : 0; the receipt
    was already written
  real delivery once acks are counted : 
    9566 per ten thousand

null control - count acknowledgements, not handoffs
  handoff-based delivery : 10000, unchanged
  ack-based delivery : 
    9566 per ten thousand
  messages the ack view calls undelivered : 
    39000
  no message moved; the count stopped being taken at the
  moment the sender let go and started at the moment the
  recipient caught

what a 100 per hundred delivery rate guarantees
  every message was handed to the carrier : exactly, all 
    900000, each with a receipt, thrown sends counted
    as failed
  every message reached the recipient : not addressed;
    the receipt is written by the sender at handoff, and 
    39000 messages bounced after the point the receipt
    records

a receipt is written by whoever holds the thing when it is
written, and a sender writes its receipt when it lets go; the
event proves the release, not the arrival, and the two are
separated by everyone downstream

Every send emits an unsampled event and a throw counts as failed - 10000 per
ten thousand delivered. The receipt is written by the sender at handoff, so 
39000 messages bounced past it uncounted, leaving real delivery at 
9566 per ten thousand against 39000 never acknowledged.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
