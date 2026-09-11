<!-- canonical: efficientnewlanguage.org/ai/examples/802-the-payload-was-valid-against-the-schema-it-carried | ai_layer_version: 0.1.0 | updated: 2026-09-11 -->

# Example 802 — The payload was valid against the schema it carried

`the_payload_was_valid_against_the_schema_it_carried.eml` - Every message this month validated, and each validation is a true statement. What it was true against is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every message this
# month validated, and each validation is a true statement. What it was true
# against is computed below.
#
# The validation is not skipped. Every message is checked before it is accepted;
# a validation failure is rejected at the edge, not logged and passed on; the
# validator is a real JSON-schema engine; and the pass rate is on a dashboard.
#
# The schema is read from a field inside the message.

2000000 => messages_received
2000000 => messages_that_validated
10000 => validation_pass_per_myriad
2000000 => messages_whose_schema_came_from_the_message
0 => messages_checked_against_the_registered_schema
47000 => messages_that_disagree_with_the_registered_schema

messages_received - messages_that_disagree_with_the_registered_schema => messages_that_match_the_registered_schema
int(messages_that_match_the_registered_schema * 10000 / messages_received) => real_conformance_per_myriad
int(messages_that_disagree_with_the_registered_schema * 10000 / messages_received) => nonconforming_per_myriad

"messages received               : " + str(messages_received) ^0
"  that validated                : " + str(messages_that_validated) ^0
"validation pass rate            : " + str(validation_pass_per_myriad) + " per ten thousand" ^0
"" ^0
"schema taken from the message   : " + str(messages_whose_schema_came_from_the_message) ^0
"checked against the registry    : " + str(messages_checked_against_the_registered_schema) ^0
"disagree with the registry      : " + str(messages_that_disagree_with_the_registered_schema) ^0
"match the registry              : " + str(messages_that_match_the_registered_schema) ^0
"real conformance                : " + str(real_conformance_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what validation verified ----

"the schema validation" ^0
"  when : before the message is accepted" ^0
"  on failure : rejected at the edge, not passed on" ^0
"  engine : a real JSON-schema validator" ^0
"  pass rate : on a dashboard" ^0
"  messages that validated : " + str(messages_that_validated) ^0
"  verdict : VALID" ^0
"" ^0
"  rejecting at the edge rather than logging and continuing" ^0
"  is the part almost nobody does, and it is why VALID here" ^0
"  is believed to mean conforming" ^0
"" ^0

# ---- what the message was checked against ----

"the schema each message used" ^0
"  where it came from : a field in the message itself" ^0
"  what that makes the check : the sender against the" ^0
"    sender" ^0
"  messages checked against the registered contract : " ^0
"    " + str(messages_checked_against_the_registered_schema) ^0
"  a self-describing payload : is internally consistent" ^0
"    exactly when it says it is" ^0
"  messages that disagree with the registry : " ^0
"    " + str(messages_that_disagree_with_the_registered_schema) ^0
"" ^0

# ---- what a consumer of the registry sees ----

"the downstream reader" ^0
"  the contract it holds : the registered schema" ^0
"  messages that break against it : " ^0
"    " + str(messages_that_disagree_with_the_registered_schema) ^0
"  what the edge reported for those : VALID" ^0
"  real conformance to the contract : " ^0
"    " + str(real_conformance_per_myriad) + " per ten thousand" ^0
"  who noticed at ingest : nobody; the check agreed with" ^0
"    the sender" ^0
"" ^0

# ---- null control ----

# The same validation, pinned to the registered schema for the message type and
# ignoring any schema the message carries.
10000 => nc_self_schema_pass_per_myriad
9765 => nc_registry_schema_pass_per_myriad
47000 => nc_messages_it_would_reject

"null control - validate against the registered schema" ^0
"  self-schema pass rate : " + str(nc_self_schema_pass_per_myriad) + ", unchanged" ^0
"  registry-schema pass rate : " ^0
"    " + str(nc_registry_schema_pass_per_myriad) + " per ten thousand" ^0
"  messages it would reject : " + str(nc_messages_it_would_reject) ^0
"  no message changed; the validator stopped reading the" ^0
"  standard from the thing being measured against it" ^0
"" ^0

# ---- the rule ----

"what a passing validation guarantees" ^0
"  the message is consistent with a schema : exactly, all " ^0
"    " + str(messages_that_validated) + " of them, rejected at the edge otherwise" ^0
"  the message conforms to the contract : not addressed;" ^0
"    the schema was read from a field in the message, so the" ^0
"    check compared the sender to the sender, and " ^0
"    " + str(messages_that_disagree_with_the_registered_schema) + " disagree with the registered schema" ^0
"" ^0
"a validator proves consistency with the schema it is given," ^0
"and a schema supplied by the sender proves only that the" ^0
"sender agrees with itself; the contract is the one both sides" ^0
"did not write" ^0
"" ^0

"Every message is checked at the edge by a real validator and rejected on" ^0
"failure - " + str(validation_pass_per_myriad) + " per ten thousand valid. The schema is a field in the message," ^0
"so the check is the sender against the sender: " + str(messages_that_disagree_with_the_registered_schema) + " messages break the" ^0
"registered contract, leaving real conformance at " + str(real_conformance_per_myriad) + " per ten thousand." ^0
```

## Python (deterministic transpilation)

```python
messages_received = 2000000
messages_that_validated = 2000000
validation_pass_per_myriad = 10000
messages_whose_schema_came_from_the_message = 2000000
messages_checked_against_the_registered_schema = 0
messages_that_disagree_with_the_registered_schema = 47000
messages_that_match_the_registered_schema = messages_received - messages_that_disagree_with_the_registered_schema
real_conformance_per_myriad = int(messages_that_match_the_registered_schema * 10000 / messages_received)
nonconforming_per_myriad = int(messages_that_disagree_with_the_registered_schema * 10000 / messages_received)
print("messages received               : " + str(messages_received))
print("  that validated                : " + str(messages_that_validated))
print("validation pass rate            : " + str(validation_pass_per_myriad) + " per ten thousand")
print("")
print("schema taken from the message   : " + str(messages_whose_schema_came_from_the_message))
print("checked against the registry    : " + str(messages_checked_against_the_registered_schema))
print("disagree with the registry      : " + str(messages_that_disagree_with_the_registered_schema))
print("match the registry              : " + str(messages_that_match_the_registered_schema))
print("real conformance                : " + str(real_conformance_per_myriad) + " per ten thousand")
print("")
print("the schema validation")
print("  when : before the message is accepted")
print("  on failure : rejected at the edge, not passed on")
print("  engine : a real JSON-schema validator")
print("  pass rate : on a dashboard")
print("  messages that validated : " + str(messages_that_validated))
print("  verdict : VALID")
print("")
print("  rejecting at the edge rather than logging and continuing")
print("  is the part almost nobody does, and it is why VALID here")
print("  is believed to mean conforming")
print("")
print("the schema each message used")
print("  where it came from : a field in the message itself")
print("  what that makes the check : the sender against the")
print("    sender")
print("  messages checked against the registered contract : ")
print("    " + str(messages_checked_against_the_registered_schema))
print("  a self-describing payload : is internally consistent")
print("    exactly when it says it is")
print("  messages that disagree with the registry : ")
print("    " + str(messages_that_disagree_with_the_registered_schema))
print("")
print("the downstream reader")
print("  the contract it holds : the registered schema")
print("  messages that break against it : ")
print("    " + str(messages_that_disagree_with_the_registered_schema))
print("  what the edge reported for those : VALID")
print("  real conformance to the contract : ")
print("    " + str(real_conformance_per_myriad) + " per ten thousand")
print("  who noticed at ingest : nobody; the check agreed with")
print("    the sender")
print("")
nc_self_schema_pass_per_myriad = 10000
nc_registry_schema_pass_per_myriad = 9765
nc_messages_it_would_reject = 47000
print("null control - validate against the registered schema")
print("  self-schema pass rate : " + str(nc_self_schema_pass_per_myriad) + ", unchanged")
print("  registry-schema pass rate : ")
print("    " + str(nc_registry_schema_pass_per_myriad) + " per ten thousand")
print("  messages it would reject : " + str(nc_messages_it_would_reject))
print("  no message changed; the validator stopped reading the")
print("  standard from the thing being measured against it")
print("")
print("what a passing validation guarantees")
print("  the message is consistent with a schema : exactly, all ")
print("    " + str(messages_that_validated) + " of them, rejected at the edge otherwise")
print("  the message conforms to the contract : not addressed;")
print("    the schema was read from a field in the message, so the")
print("    check compared the sender to the sender, and ")
print("    " + str(messages_that_disagree_with_the_registered_schema) + " disagree with the registered schema")
print("")
print("a validator proves consistency with the schema it is given,")
print("and a schema supplied by the sender proves only that the")
print("sender agrees with itself; the contract is the one both sides")
print("did not write")
print("")
print("Every message is checked at the edge by a real validator and rejected on")
print("failure - " + str(validation_pass_per_myriad) + " per ten thousand valid. The schema is a field in the message,")
print("so the check is the sender against the sender: " + str(messages_that_disagree_with_the_registered_schema) + " messages break the")
print("registered contract, leaving real conformance at " + str(real_conformance_per_myriad) + " per ten thousand.")
```

## stdout (executed)

```text
messages received               : 2000000
  that validated                : 2000000
validation pass rate            : 10000 per ten thousand

schema taken from the message   : 2000000
checked against the registry    : 0
disagree with the registry      : 47000
match the registry              : 1953000
real conformance                : 9765 per ten thousand

the schema validation
  when : before the message is accepted
  on failure : rejected at the edge, not passed on
  engine : a real JSON-schema validator
  pass rate : on a dashboard
  messages that validated : 2000000
  verdict : VALID

  rejecting at the edge rather than logging and continuing
  is the part almost nobody does, and it is why VALID here
  is believed to mean conforming

the schema each message used
  where it came from : a field in the message itself
  what that makes the check : the sender against the
    sender
  messages checked against the registered contract : 
    0
  a self-describing payload : is internally consistent
    exactly when it says it is
  messages that disagree with the registry : 
    47000

the downstream reader
  the contract it holds : the registered schema
  messages that break against it : 
    47000
  what the edge reported for those : VALID
  real conformance to the contract : 
    9765 per ten thousand
  who noticed at ingest : nobody; the check agreed with
    the sender

null control - validate against the registered schema
  self-schema pass rate : 10000, unchanged
  registry-schema pass rate : 
    9765 per ten thousand
  messages it would reject : 47000
  no message changed; the validator stopped reading the
  standard from the thing being measured against it

what a passing validation guarantees
  the message is consistent with a schema : exactly, all 
    2000000 of them, rejected at the edge otherwise
  the message conforms to the contract : not addressed;
    the schema was read from a field in the message, so the
    check compared the sender to the sender, and 
    47000 disagree with the registered schema

a validator proves consistency with the schema it is given,
and a schema supplied by the sender proves only that the
sender agrees with itself; the contract is the one both sides
did not write

Every message is checked at the edge by a real validator and rejected on
failure - 10000 per ten thousand valid. The schema is a field in the message,
so the check is the sender against the sender: 47000 messages break the
registered contract, leaving real conformance at 9765 per ten thousand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
