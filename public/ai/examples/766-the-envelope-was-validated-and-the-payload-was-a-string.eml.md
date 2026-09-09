<!-- canonical: efficientnewlanguage.org/ai/examples/766-the-envelope-was-validated-and-the-payload-was-a-string | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 766 — The envelope was validated and the payload was a string

`the_envelope_was_validated_and_the_payload_was_a_string.eml` - Every message on the event bus is validated against a registered schema before the broker will accept it, and the broker rejects what fails. What the schema describes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every message on
# the event bus is validated against a registered schema before the broker will
# accept it, and the broker rejects what fails. What the schema describes is
# computed below.
#
# The registry is real. A schema is versioned, a publish is refused unless the
# new version is compatible with the one consumers hold, fourteen breaking
# changes have been stopped at that check, and the validation runs in the broker
# rather than in a library each producer may or may not have upgraded.
#
# The envelope schema types the payload as a string. So the eight envelope
# fields are checked and the object inside is carried as text.

118 => schemas_registered
4100000 => messages_a_day
1830 => messages_rejected_a_day
31 => months_the_registry_has_run
14 => breaking_changes_blocked
8 => envelope_fields_validated
103 => schemas_whose_payload_is_typed_string
260 => consumers_on_the_bus
12 => consumers_that_validate_after_parsing
0 => payload_fields_the_broker_checks

schemas_registered - schemas_whose_payload_is_typed_string => schemas_that_describe_the_payload
consumers_on_the_bus - consumers_that_validate_after_parsing => consumers_that_do_not
messages_a_day - messages_rejected_a_day => messages_accepted_a_day
int(messages_rejected_a_day * 10000 / messages_a_day) => rejected_per_myriad
int(schemas_whose_payload_is_typed_string * 10000 / schemas_registered) => opaque_payload_per_myriad
int(consumers_that_validate_after_parsing * 10000 / consumers_on_the_bus) => validating_consumers_per_myriad

"schemas registered              : " + str(schemas_registered) ^0
"months the registry has run     : " + str(months_the_registry_has_run) ^0
"breaking changes blocked        : " + str(breaking_changes_blocked) ^0
"envelope fields validated       : " + str(envelope_fields_validated) ^0
"payload fields the broker checks: " + str(payload_fields_the_broker_checks) ^0
"" ^0
"messages a day                  : " + str(messages_a_day) ^0
"  rejected                      : " + str(messages_rejected_a_day) ^0
"  accepted                      : " + str(messages_accepted_a_day) ^0
"  rejection rate                : " + str(rejected_per_myriad) + " per ten thousand" ^0
"" ^0
"schemas typing payload a string : " + str(schemas_whose_payload_is_typed_string) ^0
"  that describe the payload     : " + str(schemas_that_describe_the_payload) ^0
"  opaque share                  : " + str(opaque_payload_per_myriad) + " per ten thousand" ^0
"consumers on the bus            : " + str(consumers_on_the_bus) ^0
"  that validate after parsing   : " + str(consumers_that_validate_after_parsing) ^0
"  that do not                   : " + str(consumers_that_do_not) ^0
"  validating share              : " + str(validating_consumers_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the registry verified ----

"the schema registry" ^0
"  versions : every schema, and a publish is refused" ^0
"    unless it is compatible with what consumers hold" ^0
"  breaking changes stopped at that check : " + str(breaking_changes_blocked) ^0
"  where validation runs : in the broker, not in a" ^0
"    library each producer may not have upgraded" ^0
"  messages refused a day : " + str(messages_rejected_a_day) ^0
"  months in place : " + str(months_the_registry_has_run) ^0
"  verdict : VALIDATED" ^0
"" ^0
"  running the check in the broker is the part almost" ^0
"  nobody does, and it is why the " + str(rejected_per_myriad) + " per ten thousand" ^0
"  are refused rather than logged" ^0
"" ^0

# ---- which object carries the answer ----

"two objects" ^0
"  what the schema describes : the envelope, " + str(envelope_fields_validated) + " fields" ^0
"  what the consumer acts on : the object inside" ^0
"  how the schema types that object : as a string" ^0
"  schemas in that shape : " + str(schemas_whose_payload_is_typed_string) + " of " + str(schemas_registered) ^0
"  what the broker checks inside it : " + str(payload_fields_the_broker_checks) + " fields" ^0
"" ^0
"  a validator that is told a field is text will confirm" ^0
"  it is text, and it is" ^0
"" ^0

# ---- what a well-formed message can carry ----

"an amount sent as text" ^0
"  is the envelope valid : yes, all " + str(envelope_fields_validated) + " fields" ^0
"  does the broker accept it : yes" ^0
"  does it count against the rejection rate : no; it was" ^0
"    never a rejection" ^0
"  who decides what it means : each consumer, " + str(consumers_on_the_bus) + " of them" ^0
"  how many check after parsing : " + str(consumers_that_validate_after_parsing) ^0
"  how many do not : " + str(consumers_that_do_not) ^0
"" ^0

# ---- null control ----

# The same registry, with the payload described in the schema and validated by
# the same broker.
19400 => nc_messages_rejected_a_day
1830 => nc_envelope_failures_a_day
118 => nc_schemas_describing_the_payload

"null control - describe the payload, validate it too" ^0
"  envelope failures a day : " + str(nc_envelope_failures_a_day) + ", unchanged" ^0
"  schemas describing the payload : " + str(nc_schemas_describing_the_payload) ^0
"  messages rejected a day : " + str(nc_messages_rejected_a_day) ^0
"  the envelope validator did not get stricter; a" ^0
"  description was written for the object that was being" ^0
"  carried past it" ^0
"" ^0

# ---- the rule ----

"what a fully validated bus guarantees" ^0
"  every message has a well-formed envelope : exactly," ^0
"    " + str(envelope_fields_validated) + " fields, in the broker, " + str(months_the_registry_has_run) + " months" ^0
"  every message has a well-formed body : not addressed;" ^0
"    the schema types the body as text and text is what" ^0
"    it is" ^0
"" ^0
"a schema is a description of an object, and a message that" ^0
"satisfies it has satisfied the description that was" ^0
"written; nothing here describes the part that was left" ^0
"opaque" ^0
"" ^0

"The broker refuses " + str(messages_rejected_a_day) + " of " + str(messages_a_day) + " messages a day against versioned schemas" ^0
"whose compatibility check has blocked " + str(breaking_changes_blocked) + " breaking changes in " + str(months_the_registry_has_run) + " months." ^0
"The payload is typed as a string in " + str(schemas_whose_payload_is_typed_string) + " of " + str(schemas_registered) + " schemas - " + str(opaque_payload_per_myriad) + " per ten" ^0
"thousand - so the broker checks " + str(payload_fields_the_broker_checks) + " fields inside it and " + str(consumers_that_do_not) + " of " + str(consumers_on_the_bus) + " consumers" ^0
"parse it without validating." ^0
```

## Python (deterministic transpilation)

```python
schemas_registered = 118
messages_a_day = 4100000
messages_rejected_a_day = 1830
months_the_registry_has_run = 31
breaking_changes_blocked = 14
envelope_fields_validated = 8
schemas_whose_payload_is_typed_string = 103
consumers_on_the_bus = 260
consumers_that_validate_after_parsing = 12
payload_fields_the_broker_checks = 0
schemas_that_describe_the_payload = schemas_registered - schemas_whose_payload_is_typed_string
consumers_that_do_not = consumers_on_the_bus - consumers_that_validate_after_parsing
messages_accepted_a_day = messages_a_day - messages_rejected_a_day
rejected_per_myriad = int(messages_rejected_a_day * 10000 / messages_a_day)
opaque_payload_per_myriad = int(schemas_whose_payload_is_typed_string * 10000 / schemas_registered)
validating_consumers_per_myriad = int(consumers_that_validate_after_parsing * 10000 / consumers_on_the_bus)
print("schemas registered              : " + str(schemas_registered))
print("months the registry has run     : " + str(months_the_registry_has_run))
print("breaking changes blocked        : " + str(breaking_changes_blocked))
print("envelope fields validated       : " + str(envelope_fields_validated))
print("payload fields the broker checks: " + str(payload_fields_the_broker_checks))
print("")
print("messages a day                  : " + str(messages_a_day))
print("  rejected                      : " + str(messages_rejected_a_day))
print("  accepted                      : " + str(messages_accepted_a_day))
print("  rejection rate                : " + str(rejected_per_myriad) + " per ten thousand")
print("")
print("schemas typing payload a string : " + str(schemas_whose_payload_is_typed_string))
print("  that describe the payload     : " + str(schemas_that_describe_the_payload))
print("  opaque share                  : " + str(opaque_payload_per_myriad) + " per ten thousand")
print("consumers on the bus            : " + str(consumers_on_the_bus))
print("  that validate after parsing   : " + str(consumers_that_validate_after_parsing))
print("  that do not                   : " + str(consumers_that_do_not))
print("  validating share              : " + str(validating_consumers_per_myriad) + " per ten thousand")
print("")
print("the schema registry")
print("  versions : every schema, and a publish is refused")
print("    unless it is compatible with what consumers hold")
print("  breaking changes stopped at that check : " + str(breaking_changes_blocked))
print("  where validation runs : in the broker, not in a")
print("    library each producer may not have upgraded")
print("  messages refused a day : " + str(messages_rejected_a_day))
print("  months in place : " + str(months_the_registry_has_run))
print("  verdict : VALIDATED")
print("")
print("  running the check in the broker is the part almost")
print("  nobody does, and it is why the " + str(rejected_per_myriad) + " per ten thousand")
print("  are refused rather than logged")
print("")
print("two objects")
print("  what the schema describes : the envelope, " + str(envelope_fields_validated) + " fields")
print("  what the consumer acts on : the object inside")
print("  how the schema types that object : as a string")
print("  schemas in that shape : " + str(schemas_whose_payload_is_typed_string) + " of " + str(schemas_registered))
print("  what the broker checks inside it : " + str(payload_fields_the_broker_checks) + " fields")
print("")
print("  a validator that is told a field is text will confirm")
print("  it is text, and it is")
print("")
print("an amount sent as text")
print("  is the envelope valid : yes, all " + str(envelope_fields_validated) + " fields")
print("  does the broker accept it : yes")
print("  does it count against the rejection rate : no; it was")
print("    never a rejection")
print("  who decides what it means : each consumer, " + str(consumers_on_the_bus) + " of them")
print("  how many check after parsing : " + str(consumers_that_validate_after_parsing))
print("  how many do not : " + str(consumers_that_do_not))
print("")
nc_messages_rejected_a_day = 19400
nc_envelope_failures_a_day = 1830
nc_schemas_describing_the_payload = 118
print("null control - describe the payload, validate it too")
print("  envelope failures a day : " + str(nc_envelope_failures_a_day) + ", unchanged")
print("  schemas describing the payload : " + str(nc_schemas_describing_the_payload))
print("  messages rejected a day : " + str(nc_messages_rejected_a_day))
print("  the envelope validator did not get stricter; a")
print("  description was written for the object that was being")
print("  carried past it")
print("")
print("what a fully validated bus guarantees")
print("  every message has a well-formed envelope : exactly,")
print("    " + str(envelope_fields_validated) + " fields, in the broker, " + str(months_the_registry_has_run) + " months")
print("  every message has a well-formed body : not addressed;")
print("    the schema types the body as text and text is what")
print("    it is")
print("")
print("a schema is a description of an object, and a message that")
print("satisfies it has satisfied the description that was")
print("written; nothing here describes the part that was left")
print("opaque")
print("")
print("The broker refuses " + str(messages_rejected_a_day) + " of " + str(messages_a_day) + " messages a day against versioned schemas")
print("whose compatibility check has blocked " + str(breaking_changes_blocked) + " breaking changes in " + str(months_the_registry_has_run) + " months.")
print("The payload is typed as a string in " + str(schemas_whose_payload_is_typed_string) + " of " + str(schemas_registered) + " schemas - " + str(opaque_payload_per_myriad) + " per ten")
print("thousand - so the broker checks " + str(payload_fields_the_broker_checks) + " fields inside it and " + str(consumers_that_do_not) + " of " + str(consumers_on_the_bus) + " consumers")
print("parse it without validating.")
```

## stdout (executed)

```text
schemas registered              : 118
months the registry has run     : 31
breaking changes blocked        : 14
envelope fields validated       : 8
payload fields the broker checks: 0

messages a day                  : 4100000
  rejected                      : 1830
  accepted                      : 4098170
  rejection rate                : 4 per ten thousand

schemas typing payload a string : 103
  that describe the payload     : 15
  opaque share                  : 8728 per ten thousand
consumers on the bus            : 260
  that validate after parsing   : 12
  that do not                   : 248
  validating share              : 461 per ten thousand

the schema registry
  versions : every schema, and a publish is refused
    unless it is compatible with what consumers hold
  breaking changes stopped at that check : 14
  where validation runs : in the broker, not in a
    library each producer may not have upgraded
  messages refused a day : 1830
  months in place : 31
  verdict : VALIDATED

  running the check in the broker is the part almost
  nobody does, and it is why the 4 per ten thousand
  are refused rather than logged

two objects
  what the schema describes : the envelope, 8 fields
  what the consumer acts on : the object inside
  how the schema types that object : as a string
  schemas in that shape : 103 of 118
  what the broker checks inside it : 0 fields

  a validator that is told a field is text will confirm
  it is text, and it is

an amount sent as text
  is the envelope valid : yes, all 8 fields
  does the broker accept it : yes
  does it count against the rejection rate : no; it was
    never a rejection
  who decides what it means : each consumer, 260 of them
  how many check after parsing : 12
  how many do not : 248

null control - describe the payload, validate it too
  envelope failures a day : 1830, unchanged
  schemas describing the payload : 118
  messages rejected a day : 19400
  the envelope validator did not get stricter; a
  description was written for the object that was being
  carried past it

what a fully validated bus guarantees
  every message has a well-formed envelope : exactly,
    8 fields, in the broker, 31 months
  every message has a well-formed body : not addressed;
    the schema types the body as text and text is what
    it is

a schema is a description of an object, and a message that
satisfies it has satisfied the description that was
written; nothing here describes the part that was left
opaque

The broker refuses 1830 of 4100000 messages a day against versioned schemas
whose compatibility check has blocked 14 breaking changes in 31 months.
The payload is typed as a string in 103 of 118 schemas - 8728 per ten
thousand - so the broker checks 0 fields inside it and 248 of 260 consumers
parse it without validating.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
