<!-- canonical: efficientnewlanguage.org/ai/examples/667-the-schema-allowed-the-field-and-the-parser-ignored-it | ai_layer_version: 0.1.0 | updated: 2026-09-02 -->

# Example 667 — The schema allowed the field and the parser ignored it

`the_schema_allowed_the_field_and_the_parser_ignored_it.eml` - The new field is in the schema, validates on every message, and is documented. How many consumers act on it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The new field is
# in the schema, validates on every message, and is documented. How many
# consumers act on it is computed below.
#
# The change was made the careful way. The field is optional, so no existing
# producer breaks; the schema version was bumped; validation runs on both sides
# and has never rejected a message; the field is in the reference documentation
# with an example. Six million two hundred thousand messages a day carry it.
#
# Forward compatibility is the property that an old consumer IGNORES what it
# does not recognise. It is why the additive change is safe, and it is
# indistinguishable, from the producer's side, from a consumer that recognises
# the field and does nothing with it.
#
# Twenty-nine of thirty-four consumers ignore it. The producer's dashboard shows
# a hundred percent delivery.

6200000 => messages_per_day
34 => consumers
5 => consumers_reading_the_field
0 => schema_validation_failures
0 => messages_rejected

consumers - consumers_reading_the_field => consumers_ignoring_the_field

"messages per day carrying the field : " + str(messages_per_day) ^0
"consumers                           : " + str(consumers) ^0
"  reading the field                 : " + str(consumers_reading_the_field) ^0
"  ignoring it                       : " + str(consumers_ignoring_the_field) ^0
"schema validation failures          : " + str(schema_validation_failures) ^0
"messages rejected                   : " + str(messages_rejected) ^0
"" ^0

# ---- what the rollout verified ----

"the additive change" ^0
"  field optional          : yes" ^0
"  schema version bumped   : yes" ^0
"  validation on both sides: yes" ^0
"  validation failures     : " + str(schema_validation_failures) ^0
"  messages rejected       : " + str(messages_rejected) ^0
"  documented with an example : yes" ^0
"  verdict                 : COMPATIBLE, DELIVERED" ^0
"" ^0
"  this is the correct way to add a field and every step of" ^0
"  it was followed" ^0
"" ^0

# ---- what forward compatibility is ----

"why nothing broke" ^0
"  old consumers ignore unknown fields : by design" ^0
"  that is the property that makes this safe : yes" ^0
"  from the producer, a consumer that ignores it looks like :" ^0
"    a consumer that received it" ^0
"  a signal distinguishing the two : none exists in the" ^0
"    protocol, and adding one would break the property" ^0
"" ^0

int(consumers_ignoring_the_field * 10000 / consumers) => ignoring_per_myriad
"share of consumers ignoring it : " + str(ignoring_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the producer's dashboard says ----

messages_per_day => messages_delivered
"delivery" ^0
"  messages sent      : " + str(messages_per_day) ^0
"  messages delivered : " + str(messages_delivered) ^0
"  delivery rate      : complete" ^0
"  consumers acting on the field : " + str(consumers_reading_the_field) ^0
"  a metric for the last line : none" ^0
"" ^0
"  the rollout was declared done on the first four numbers," ^0
"  which are the ones a message bus can produce" ^0
"" ^0

# ---- what the twenty-nine compute instead ----

# They keep using the previous rule, which was correct before the field existed
# and is now an approximation. Their outputs are plausible and internally
# consistent, so nothing downstream complains.
"a consumer that ignores it" ^0
"  rule applied     : the one from before the field existed" ^0
"  output           : plausible, internally consistent" ^0
"  errors raised    : 0" ^0
"  difference from the intended result : present, and not" ^0
"    computed anywhere" ^0
"" ^0

# ---- null control ----

# The same additive change, with the producer requiring an explicit
# acknowledgement of the schema version each consumer implements.
consumers => nc_consumers_declaring_a_version
consumers_ignoring_the_field => nc_consumers_known_to_be_behind

"null control - consumers declare the schema version they implement" ^0
"  validation failures : " + str(schema_validation_failures) + ", unchanged" ^0
"  consumers declaring a version : " + str(nc_consumers_declaring_a_version) ^0
"  consumers known to be behind  : " + str(nc_consumers_known_to_be_behind) ^0
"  compatibility did not change; the producer stopped" ^0
"  having to infer uptake from delivery" ^0
"" ^0

# ---- the rule ----

"what an additive schema change guarantees" ^0
"  nothing breaks         : exactly, and that is the point" ^0
"  the new information is used : not addressed; the" ^0
"    mechanism that guarantees the first is silence, and" ^0
"    silence is what the second would have to be measured by" ^0
"" ^0
"forward compatibility buys safety with unobservability; a" ^0
"rollout that measures delivery has measured the half the" ^0
"protocol reports and not the half anyone wanted" ^0
"" ^0

"The field is optional, versioned, validated on both sides with " + str(schema_validation_failures) + " failures," ^0
"documented with an example, and delivered on all " + str(messages_per_day) + " messages a day. " + str(consumers_ignoring_the_field) ^0
"of " + str(consumers) + " consumers ignore it - " + str(ignoring_per_myriad) + " per ten thousand - which is the same" ^0
"forward-compatibility rule that made the change safe, and the producer's" ^0
"dashboard cannot distinguish them from the " + str(consumers_reading_the_field) + " that read it." ^0
```

## Python (deterministic transpilation)

```python
messages_per_day = 6200000
consumers = 34
consumers_reading_the_field = 5
schema_validation_failures = 0
messages_rejected = 0
consumers_ignoring_the_field = consumers - consumers_reading_the_field
print("messages per day carrying the field : " + str(messages_per_day))
print("consumers                           : " + str(consumers))
print("  reading the field                 : " + str(consumers_reading_the_field))
print("  ignoring it                       : " + str(consumers_ignoring_the_field))
print("schema validation failures          : " + str(schema_validation_failures))
print("messages rejected                   : " + str(messages_rejected))
print("")
print("the additive change")
print("  field optional          : yes")
print("  schema version bumped   : yes")
print("  validation on both sides: yes")
print("  validation failures     : " + str(schema_validation_failures))
print("  messages rejected       : " + str(messages_rejected))
print("  documented with an example : yes")
print("  verdict                 : COMPATIBLE, DELIVERED")
print("")
print("  this is the correct way to add a field and every step of")
print("  it was followed")
print("")
print("why nothing broke")
print("  old consumers ignore unknown fields : by design")
print("  that is the property that makes this safe : yes")
print("  from the producer, a consumer that ignores it looks like :")
print("    a consumer that received it")
print("  a signal distinguishing the two : none exists in the")
print("    protocol, and adding one would break the property")
print("")
ignoring_per_myriad = int(consumers_ignoring_the_field * 10000 / consumers)
print("share of consumers ignoring it : " + str(ignoring_per_myriad) + " per ten thousand")
print("")
messages_delivered = messages_per_day
print("delivery")
print("  messages sent      : " + str(messages_per_day))
print("  messages delivered : " + str(messages_delivered))
print("  delivery rate      : complete")
print("  consumers acting on the field : " + str(consumers_reading_the_field))
print("  a metric for the last line : none")
print("")
print("  the rollout was declared done on the first four numbers,")
print("  which are the ones a message bus can produce")
print("")
print("a consumer that ignores it")
print("  rule applied     : the one from before the field existed")
print("  output           : plausible, internally consistent")
print("  errors raised    : 0")
print("  difference from the intended result : present, and not")
print("    computed anywhere")
print("")
nc_consumers_declaring_a_version = consumers
nc_consumers_known_to_be_behind = consumers_ignoring_the_field
print("null control - consumers declare the schema version they implement")
print("  validation failures : " + str(schema_validation_failures) + ", unchanged")
print("  consumers declaring a version : " + str(nc_consumers_declaring_a_version))
print("  consumers known to be behind  : " + str(nc_consumers_known_to_be_behind))
print("  compatibility did not change; the producer stopped")
print("  having to infer uptake from delivery")
print("")
print("what an additive schema change guarantees")
print("  nothing breaks         : exactly, and that is the point")
print("  the new information is used : not addressed; the")
print("    mechanism that guarantees the first is silence, and")
print("    silence is what the second would have to be measured by")
print("")
print("forward compatibility buys safety with unobservability; a")
print("rollout that measures delivery has measured the half the")
print("protocol reports and not the half anyone wanted")
print("")
print("The field is optional, versioned, validated on both sides with " + str(schema_validation_failures) + " failures,")
print("documented with an example, and delivered on all " + str(messages_per_day) + " messages a day. " + str(consumers_ignoring_the_field))
print("of " + str(consumers) + " consumers ignore it - " + str(ignoring_per_myriad) + " per ten thousand - which is the same")
print("forward-compatibility rule that made the change safe, and the producer's")
print("dashboard cannot distinguish them from the " + str(consumers_reading_the_field) + " that read it.")
```

## stdout (executed)

```text
messages per day carrying the field : 6200000
consumers                           : 34
  reading the field                 : 5
  ignoring it                       : 29
schema validation failures          : 0
messages rejected                   : 0

the additive change
  field optional          : yes
  schema version bumped   : yes
  validation on both sides: yes
  validation failures     : 0
  messages rejected       : 0
  documented with an example : yes
  verdict                 : COMPATIBLE, DELIVERED

  this is the correct way to add a field and every step of
  it was followed

why nothing broke
  old consumers ignore unknown fields : by design
  that is the property that makes this safe : yes
  from the producer, a consumer that ignores it looks like :
    a consumer that received it
  a signal distinguishing the two : none exists in the
    protocol, and adding one would break the property

share of consumers ignoring it : 8529 per ten thousand

delivery
  messages sent      : 6200000
  messages delivered : 6200000
  delivery rate      : complete
  consumers acting on the field : 5
  a metric for the last line : none

  the rollout was declared done on the first four numbers,
  which are the ones a message bus can produce

a consumer that ignores it
  rule applied     : the one from before the field existed
  output           : plausible, internally consistent
  errors raised    : 0
  difference from the intended result : present, and not
    computed anywhere

null control - consumers declare the schema version they implement
  validation failures : 0, unchanged
  consumers declaring a version : 34
  consumers known to be behind  : 29
  compatibility did not change; the producer stopped
  having to infer uptake from delivery

what an additive schema change guarantees
  nothing breaks         : exactly, and that is the point
  the new information is used : not addressed; the
    mechanism that guarantees the first is silence, and
    silence is what the second would have to be measured by

forward compatibility buys safety with unobservability; a
rollout that measures delivery has measured the half the
protocol reports and not the half anyone wanted

The field is optional, versioned, validated on both sides with 0 failures,
documented with an example, and delivered on all 6200000 messages a day. 29
of 34 consumers ignore it - 8529 per ten thousand - which is the same
forward-compatibility rule that made the change safe, and the producer's
dashboard cannot distinguish them from the 5 that read it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
