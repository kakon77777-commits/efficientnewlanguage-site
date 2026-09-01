<!-- canonical: efficientnewlanguage.org/ai/examples/654-the-timezone-was-stored-and-the-rule-changed | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 654 — The timezone was stored and the rule changed

`the_timezone_was_stored_and_the_rule_changed.eml` - Every event stores a UTC instant and its IANA zone name, which is the correct pair. How many future events are now an hour wrong is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every event stores
# a UTC instant and its IANA zone name, which is the correct pair. How many
# future events are now an hour wrong is computed below.
#
# The storage is right and it is the advice everyone gives. Local time alone is
# ambiguous twice a year and unresolvable across a rule change; storing the UTC
# instant plus the zone name keeps both the moment and the human intent, and a
# validator rejects any row missing either. Two million one hundred and forty
# thousand rows, no violations.
#
# For a PAST event that pair is complete. For a FUTURE recurring event it is
# not: "every Tuesday at 09:00 in Europe/Lisbon" was materialised into UTC
# instants when the series was created, and the instant is a conclusion drawn
# from a rule that had not been announced yet.
#
# Three zones changed their rules this year. The instants are still valid.

2140000 => rows_stored
486000 => future_recurring_instances
3 => zone_rule_changes_this_year
61400 => instances_after_a_changed_transition
0 => validation_failures

rows_stored - future_recurring_instances => rows_describing_the_past

"rows stored                     : " + str(rows_stored) ^0
"  describing a past moment      : " + str(rows_describing_the_past) ^0
"  future recurring instances    : " + str(future_recurring_instances) ^0
"zone rule changes this year     : " + str(zone_rule_changes_this_year) ^0
"instances after a changed transition : " + str(instances_after_a_changed_transition) ^0
"" ^0

# ---- what the validator verified ----

"the row validator" ^0
"  utc instant present  : required" ^0
"  iana zone name present : required" ^0
"  zone name in the database : required" ^0
"  instant parses as utc : required" ^0
"  violations           : " + str(validation_failures) ^0
"  verdict              : VALID" ^0
"" ^0
"  every affected row passes all four, before and after the" ^0
"  rule change, because none of the four is about the rule" ^0
"" ^0

# ---- what materialising decided ----

"creating a weekly series" ^0
"  what the user said   : every Tuesday at 09:00, Lisbon" ^0
"  what was stored      : one utc instant per occurrence," ^0
"    plus the zone name" ^0
"  when the offset was applied : at creation" ^0
"  what the offset depended on : the rule as published then" ^0
"" ^0
"  the zone name is stored and was not consulted again;" ^0
"  keeping it made the row look like it could be recomputed" ^0
"" ^0

int(instances_after_a_changed_transition * 10000 / future_recurring_instances) => wrong_per_myriad
"share of future instances now an hour out : " + str(wrong_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what a reader sees ----

# The row says 08:00 UTC and Europe/Lisbon. Rendering it now gives 09:00 local
# before the changed transition and 08:00 local after it. Both renderings are
# correct conversions of a stored instant; one of them is not what was asked for.
"rendering one affected instance" ^0
"  stored instant       : 08:00 utc" ^0
"  stored zone          : Europe/Lisbon" ^0
"  rendered under the old rule : 09:00 local, as intended" ^0
"  rendered under the new rule : 08:00 local" ^0
"  conversion correct   : both times" ^0
"  meeting starts       : an hour early" ^0
"" ^0

# ---- null control ----

# The same rows, storing the local time and the zone for future recurrences and
# resolving to an instant at read time.
0 => nc_instances_wrong
future_recurring_instances => nc_instances_resolved_at_read_time

"null control - future recurrences stored as local time plus zone" ^0
"  validation failures    : " + str(validation_failures) + ", unchanged" ^0
"  resolved at read time  : " + str(nc_instances_resolved_at_read_time) ^0
"  instances now an hour out : " + str(nc_instances_wrong) ^0
"  the storage did not become more correct; the offset" ^0
"  stopped being applied before the rule was known" ^0
"" ^0

# ---- the rule ----

"what storing utc plus a zone guarantees" ^0
"  a past moment is unambiguous : exactly" ^0
"  a future intention survives  : not addressed; converting" ^0
"    at write time consumes a rule that has not happened" ^0
"    yet, and keeping the zone name beside the answer does" ^0
"    not make the answer a question again" ^0
"" ^0
"an instant is a fact and a future appointment is a promise" ^0
"about a rule; store the one you were given, and resolve the" ^0
"other as late as you can" ^0
"" ^0

"Every row stores a UTC instant and an IANA zone, the pair everyone recommends," ^0
"and the validator passes all " + str(rows_stored) + " with " + str(validation_failures) + " violations before and after." ^0
str(zone_rule_changes_this_year) + " zones changed their rules this year, so " + str(instances_after_a_changed_transition) + " of " + str(future_recurring_instances) + " future" ^0
"instances - " + str(wrong_per_myriad) + " per ten thousand - convert correctly to a local time that is an" ^0
"hour from the one somebody asked for, and no check can see it because the" ^0
"instant was a conclusion, not an observation." ^0
```

## Python (deterministic transpilation)

```python
rows_stored = 2140000
future_recurring_instances = 486000
zone_rule_changes_this_year = 3
instances_after_a_changed_transition = 61400
validation_failures = 0
rows_describing_the_past = rows_stored - future_recurring_instances
print("rows stored                     : " + str(rows_stored))
print("  describing a past moment      : " + str(rows_describing_the_past))
print("  future recurring instances    : " + str(future_recurring_instances))
print("zone rule changes this year     : " + str(zone_rule_changes_this_year))
print("instances after a changed transition : " + str(instances_after_a_changed_transition))
print("")
print("the row validator")
print("  utc instant present  : required")
print("  iana zone name present : required")
print("  zone name in the database : required")
print("  instant parses as utc : required")
print("  violations           : " + str(validation_failures))
print("  verdict              : VALID")
print("")
print("  every affected row passes all four, before and after the")
print("  rule change, because none of the four is about the rule")
print("")
print("creating a weekly series")
print("  what the user said   : every Tuesday at 09:00, Lisbon")
print("  what was stored      : one utc instant per occurrence,")
print("    plus the zone name")
print("  when the offset was applied : at creation")
print("  what the offset depended on : the rule as published then")
print("")
print("  the zone name is stored and was not consulted again;")
print("  keeping it made the row look like it could be recomputed")
print("")
wrong_per_myriad = int(instances_after_a_changed_transition * 10000 / future_recurring_instances)
print("share of future instances now an hour out : " + str(wrong_per_myriad) + " per ten thousand")
print("")
print("rendering one affected instance")
print("  stored instant       : 08:00 utc")
print("  stored zone          : Europe/Lisbon")
print("  rendered under the old rule : 09:00 local, as intended")
print("  rendered under the new rule : 08:00 local")
print("  conversion correct   : both times")
print("  meeting starts       : an hour early")
print("")
nc_instances_wrong = 0
nc_instances_resolved_at_read_time = future_recurring_instances
print("null control - future recurrences stored as local time plus zone")
print("  validation failures    : " + str(validation_failures) + ", unchanged")
print("  resolved at read time  : " + str(nc_instances_resolved_at_read_time))
print("  instances now an hour out : " + str(nc_instances_wrong))
print("  the storage did not become more correct; the offset")
print("  stopped being applied before the rule was known")
print("")
print("what storing utc plus a zone guarantees")
print("  a past moment is unambiguous : exactly")
print("  a future intention survives  : not addressed; converting")
print("    at write time consumes a rule that has not happened")
print("    yet, and keeping the zone name beside the answer does")
print("    not make the answer a question again")
print("")
print("an instant is a fact and a future appointment is a promise")
print("about a rule; store the one you were given, and resolve the")
print("other as late as you can")
print("")
print("Every row stores a UTC instant and an IANA zone, the pair everyone recommends,")
print("and the validator passes all " + str(rows_stored) + " with " + str(validation_failures) + " violations before and after.")
print(str(zone_rule_changes_this_year) + " zones changed their rules this year, so " + str(instances_after_a_changed_transition) + " of " + str(future_recurring_instances) + " future")
print("instances - " + str(wrong_per_myriad) + " per ten thousand - convert correctly to a local time that is an")
print("hour from the one somebody asked for, and no check can see it because the")
print("instant was a conclusion, not an observation.")
```

## stdout (executed)

```text
rows stored                     : 2140000
  describing a past moment      : 1654000
  future recurring instances    : 486000
zone rule changes this year     : 3
instances after a changed transition : 61400

the row validator
  utc instant present  : required
  iana zone name present : required
  zone name in the database : required
  instant parses as utc : required
  violations           : 0
  verdict              : VALID

  every affected row passes all four, before and after the
  rule change, because none of the four is about the rule

creating a weekly series
  what the user said   : every Tuesday at 09:00, Lisbon
  what was stored      : one utc instant per occurrence,
    plus the zone name
  when the offset was applied : at creation
  what the offset depended on : the rule as published then

  the zone name is stored and was not consulted again;
  keeping it made the row look like it could be recomputed

share of future instances now an hour out : 1263 per ten thousand

rendering one affected instance
  stored instant       : 08:00 utc
  stored zone          : Europe/Lisbon
  rendered under the old rule : 09:00 local, as intended
  rendered under the new rule : 08:00 local
  conversion correct   : both times
  meeting starts       : an hour early

null control - future recurrences stored as local time plus zone
  validation failures    : 0, unchanged
  resolved at read time  : 486000
  instances now an hour out : 0
  the storage did not become more correct; the offset
  stopped being applied before the rule was known

what storing utc plus a zone guarantees
  a past moment is unambiguous : exactly
  a future intention survives  : not addressed; converting
    at write time consumes a rule that has not happened
    yet, and keeping the zone name beside the answer does
    not make the answer a question again

an instant is a fact and a future appointment is a promise
about a rule; store the one you were given, and resolve the
other as late as you can

Every row stores a UTC instant and an IANA zone, the pair everyone recommends,
and the validator passes all 2140000 with 0 violations before and after.
3 zones changed their rules this year, so 61400 of 486000 future
instances - 1263 per ten thousand - convert correctly to a local time that is an
hour from the one somebody asked for, and no check can see it because the
instant was a conclusion, not an observation.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
