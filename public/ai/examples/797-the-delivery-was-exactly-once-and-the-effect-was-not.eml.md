<!-- canonical: efficientnewlanguage.org/ai/examples/797-the-delivery-was-exactly-once-and-the-effect-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 797 — The delivery was exactly once and the effect was not

`the_delivery_was_exactly_once_and_the_effect_was_not.eml` - The queue delivers each message to the handler exactly once, and that property holds. Where the handler's effect lands relative to it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The queue delivers
# each message to the handler exactly once, and that property holds. Where the
# handler's effect lands relative to it is computed below.
#
# The delivery guarantee is real. The broker assigns each message an offset;
# the handler commits the offset only after it returns; a redelivery on restart
# is deduplicated by offset; so the handler's function runs once per message.
#
# The handler's effect is an email, sent to a third party before the offset
# commits.

1200000 => messages
1200000 => broker_deliveries_to_the_handler
450 => crashes_after_the_email_before_the_commit

crashes_after_the_email_before_the_commit => redeliveries_on_restart
messages + redeliveries_on_restart => emails_sent
emails_sent - messages => duplicate_emails
int(duplicate_emails * 10000 / messages) => duplicate_effect_per_myriad
0 => duplicate_handler_returns

"messages                        : " + str(messages) ^0
"broker deliveries to handler    : " + str(broker_deliveries_to_the_handler) ^0
"  duplicate handler returns     : " + str(duplicate_handler_returns) ^0
"crashes after email, pre-commit : " + str(crashes_after_the_email_before_the_commit) ^0
"redeliveries on restart         : " + str(redeliveries_on_restart) ^0
"" ^0
"emails sent                     : " + str(emails_sent) ^0
"  duplicates                    : " + str(duplicate_emails) ^0
"duplicate effect rate           : " + str(duplicate_effect_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what exactly-once verified ----

"the exactly-once delivery" ^0
"  each message : gets a broker offset" ^0
"  the offset commits : only after the handler returns" ^0
"  a redelivery on restart : deduplicated by offset" ^0
"  so the handler runs : once per message" ^0
"  duplicate handler invocations that completed : " ^0
"    " + str(duplicate_handler_returns) ^0
"  verdict : DELIVERED EXACTLY ONCE" ^0
"" ^0
"  committing the offset only after the return is the part" ^0
"  done right here, and it is why no message is processed" ^0
"  to completion twice" ^0
"" ^0

# ---- where the effect sits ----

"the handler's effect" ^0
"  what it is : an email to a third party" ^0
"  when it is sent : inside the handler, before the return" ^0
"  what commits after it : the offset" ^0
"  a crash between the send and the commit : leaves the" ^0
"    offset uncommitted and the email already gone" ^0
"  what the broker does then : redeliver, correctly, by" ^0
"    its own guarantee" ^0
"  what the redelivery does : send the email again" ^0
"" ^0

# ---- what the recipient gets ----

"the recipient of the emails" ^0
"  messages that concerned them : counted once by the" ^0
"    broker" ^0
"  emails they received : " + str(emails_sent) ^0
"  duplicates : " + str(duplicate_emails) ^0
"  did the broker break its promise : no; delivery to the" ^0
"    handler was exactly once" ^0
"  what was not once : the effect, which lives outside the" ^0
"    offset the promise is about" ^0
"" ^0

# ---- null control ----

# The same crashes, with the email replaced by an outbox row written in the same
# transaction as the offset commit and sent by a separate relay.
450 => nc_crashes
0 => nc_duplicate_emails
450 => nc_outbox_rows_rolled_back_with_the_offset

"null control - an outbox committed with the offset" ^0
"  crashes : " + str(nc_crashes) + ", unchanged" ^0
"  duplicate emails : " + str(nc_duplicate_emails) ^0
"  outbox rows rolled back with the offset : " ^0
"    " + str(nc_outbox_rows_rolled_back_with_the_offset) ^0
"  no crash and no delivery guarantee changed; the effect" ^0
"  moved inside the transaction the offset commits in" ^0
"" ^0

# ---- the rule ----

"what exactly-once delivery guarantees" ^0
"  the handler runs once per message : exactly, offsets" ^0
"    committed after the return, redeliveries deduplicated" ^0
"  each message causes its effect once : not addressed;" ^0
"    exactly-once is a property of delivery to the handler," ^0
"    and the effect is an email sent before the commit - " ^0
"    " + str(crashes_after_the_email_before_the_commit) + " crashes between the send and the commit sent " ^0
"    " + str(duplicate_emails) + " duplicate emails" ^0
"" ^0

"exactly-once names the boundary the broker controls - delivery to the handler;" ^0
"an effect outside that boundary is at-least-once no matter what the broker" ^0
"promises, because the promise ends where the handler's side effects begin" ^0
"" ^0

"Delivery is exactly-once: offsets commit after the return and redeliveries" ^0
"dedupe - the handler runs once. The email is sent before the commit, outside" ^0
"that boundary, so " + str(crashes_after_the_email_before_the_commit) + " crashes in the gap sent " + str(duplicate_emails) + " duplicate emails, " ^0
"" + str(duplicate_effect_per_myriad) + " per ten thousand of the messages." ^0
```

## Python (deterministic transpilation)

```python
messages = 1200000
broker_deliveries_to_the_handler = 1200000
crashes_after_the_email_before_the_commit = 450
redeliveries_on_restart = crashes_after_the_email_before_the_commit
emails_sent = messages + redeliveries_on_restart
duplicate_emails = emails_sent - messages
duplicate_effect_per_myriad = int(duplicate_emails * 10000 / messages)
duplicate_handler_returns = 0
print("messages                        : " + str(messages))
print("broker deliveries to handler    : " + str(broker_deliveries_to_the_handler))
print("  duplicate handler returns     : " + str(duplicate_handler_returns))
print("crashes after email, pre-commit : " + str(crashes_after_the_email_before_the_commit))
print("redeliveries on restart         : " + str(redeliveries_on_restart))
print("")
print("emails sent                     : " + str(emails_sent))
print("  duplicates                    : " + str(duplicate_emails))
print("duplicate effect rate           : " + str(duplicate_effect_per_myriad) + " per ten thousand")
print("")
print("the exactly-once delivery")
print("  each message : gets a broker offset")
print("  the offset commits : only after the handler returns")
print("  a redelivery on restart : deduplicated by offset")
print("  so the handler runs : once per message")
print("  duplicate handler invocations that completed : ")
print("    " + str(duplicate_handler_returns))
print("  verdict : DELIVERED EXACTLY ONCE")
print("")
print("  committing the offset only after the return is the part")
print("  done right here, and it is why no message is processed")
print("  to completion twice")
print("")
print("the handler's effect")
print("  what it is : an email to a third party")
print("  when it is sent : inside the handler, before the return")
print("  what commits after it : the offset")
print("  a crash between the send and the commit : leaves the")
print("    offset uncommitted and the email already gone")
print("  what the broker does then : redeliver, correctly, by")
print("    its own guarantee")
print("  what the redelivery does : send the email again")
print("")
print("the recipient of the emails")
print("  messages that concerned them : counted once by the")
print("    broker")
print("  emails they received : " + str(emails_sent))
print("  duplicates : " + str(duplicate_emails))
print("  did the broker break its promise : no; delivery to the")
print("    handler was exactly once")
print("  what was not once : the effect, which lives outside the")
print("    offset the promise is about")
print("")
nc_crashes = 450
nc_duplicate_emails = 0
nc_outbox_rows_rolled_back_with_the_offset = 450
print("null control - an outbox committed with the offset")
print("  crashes : " + str(nc_crashes) + ", unchanged")
print("  duplicate emails : " + str(nc_duplicate_emails))
print("  outbox rows rolled back with the offset : ")
print("    " + str(nc_outbox_rows_rolled_back_with_the_offset))
print("  no crash and no delivery guarantee changed; the effect")
print("  moved inside the transaction the offset commits in")
print("")
print("what exactly-once delivery guarantees")
print("  the handler runs once per message : exactly, offsets")
print("    committed after the return, redeliveries deduplicated")
print("  each message causes its effect once : not addressed;")
print("    exactly-once is a property of delivery to the handler,")
print("    and the effect is an email sent before the commit - ")
print("    " + str(crashes_after_the_email_before_the_commit) + " crashes between the send and the commit sent ")
print("    " + str(duplicate_emails) + " duplicate emails")
print("")
print("exactly-once names the boundary the broker controls - delivery to the handler;")
print("an effect outside that boundary is at-least-once no matter what the broker")
print("promises, because the promise ends where the handler's side effects begin")
print("")
print("Delivery is exactly-once: offsets commit after the return and redeliveries")
print("dedupe - the handler runs once. The email is sent before the commit, outside")
print("that boundary, so " + str(crashes_after_the_email_before_the_commit) + " crashes in the gap sent " + str(duplicate_emails) + " duplicate emails, ")
print("" + str(duplicate_effect_per_myriad) + " per ten thousand of the messages.")
```

## stdout (executed)

```text
messages                        : 1200000
broker deliveries to handler    : 1200000
  duplicate handler returns     : 0
crashes after email, pre-commit : 450
redeliveries on restart         : 450

emails sent                     : 1200450
  duplicates                    : 450
duplicate effect rate           : 3 per ten thousand

the exactly-once delivery
  each message : gets a broker offset
  the offset commits : only after the handler returns
  a redelivery on restart : deduplicated by offset
  so the handler runs : once per message
  duplicate handler invocations that completed : 
    0
  verdict : DELIVERED EXACTLY ONCE

  committing the offset only after the return is the part
  done right here, and it is why no message is processed
  to completion twice

the handler's effect
  what it is : an email to a third party
  when it is sent : inside the handler, before the return
  what commits after it : the offset
  a crash between the send and the commit : leaves the
    offset uncommitted and the email already gone
  what the broker does then : redeliver, correctly, by
    its own guarantee
  what the redelivery does : send the email again

the recipient of the emails
  messages that concerned them : counted once by the
    broker
  emails they received : 1200450
  duplicates : 450
  did the broker break its promise : no; delivery to the
    handler was exactly once
  what was not once : the effect, which lives outside the
    offset the promise is about

null control - an outbox committed with the offset
  crashes : 450, unchanged
  duplicate emails : 0
  outbox rows rolled back with the offset : 
    450
  no crash and no delivery guarantee changed; the effect
  moved inside the transaction the offset commits in

what exactly-once delivery guarantees
  the handler runs once per message : exactly, offsets
    committed after the return, redeliveries deduplicated
  each message causes its effect once : not addressed;
    exactly-once is a property of delivery to the handler,
    and the effect is an email sent before the commit - 
    450 crashes between the send and the commit sent 
    450 duplicate emails

exactly-once names the boundary the broker controls - delivery to the handler;
an effect outside that boundary is at-least-once no matter what the broker
promises, because the promise ends where the handler's side effects begin

Delivery is exactly-once: offsets commit after the return and redeliveries
dedupe - the handler runs once. The email is sent before the commit, outside
that boundary, so 450 crashes in the gap sent 450 duplicate emails, 
3 per ten thousand of the messages.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
