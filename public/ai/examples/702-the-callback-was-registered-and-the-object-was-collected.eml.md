<!-- canonical: efficientnewlanguage.org/ai/examples/702-the-callback-was-registered-and-the-object-was-collected | ai_layer_version: 0.1.0 | updated: 2026-09-05 -->

# Example 702 — The callback was registered and the object was collected

`the_callback_was_registered_and_the_object_was_collected.eml` - The event registry is typed, tested, and delivers every event it dispatches with no recorded failures. What the delivery rate is a rate over is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The event registry
# is typed, tested, and delivers every event it dispatches with no recorded
# failures. What the delivery rate is a rate over is computed below.
#
# The registry is well built and the weak reference in it is not an oversight.
# An earlier version held subscribers strongly and leaked four point two
# gigabytes over a weekend, because a registration outlives the thing that made
# it more often than anyone expects. The weak reference was a deliberate fix,
# reviewed, and it ended the leak.
#
# A weak reference lets the subscriber be collected. When the registry is the
# only thing pointing at a subscriber, the subscriber is unreachable by
# definition, so it goes, and its callback stops being called.
#
# The delivery rate counts events delivered to live subscribers.

40000000 => events_dispatched
0 => delivery_failures_recorded
2400 => registrations
190 => registrations_reachable_only_from_the_registry
190 => of_those_collected_within_one_cycle
26000 => events_a_day_those_registrations_would_have_received
0 => events_counted_as_undelivered
4200 => megabytes_leaked_by_the_strong_reference_version

registrations - registrations_reachable_only_from_the_registry => registrations_held_by_something_else
int(registrations_reachable_only_from_the_registry * 10000 / registrations) => silently_gone_per_myriad

"events dispatched               : " + str(events_dispatched) ^0
"delivery failures recorded      : " + str(delivery_failures_recorded) ^0
"events counted as undelivered   : " + str(events_counted_as_undelivered) ^0
"" ^0
"registrations                   : " + str(registrations) ^0
"  held by something else        : " + str(registrations_held_by_something_else) ^0
"  reachable only from the registry : " + str(registrations_reachable_only_from_the_registry) ^0
"  of those, collected           : " + str(of_those_collected_within_one_cycle) ^0
"  share                         : " + str(silently_gone_per_myriad) + " per ten thousand" ^0
"events a day they would have received : " + str(events_a_day_those_registrations_would_have_received) ^0
"" ^0
"megabytes leaked by the earlier version : " + str(megabytes_leaked_by_the_strong_reference_version) ^0
"" ^0

# ---- what the registry verified ----

"the event registry" ^0
"  registration : typed, so a handler cannot mismatch its" ^0
"    event" ^0
"  delivery     : at least once to every live subscriber" ^0
"  events dispatched : " + str(events_dispatched) ^0
"  delivery failures : " + str(delivery_failures_recorded) ^0
"  the weak reference : a reviewed fix for a real leak of" ^0
"    " + str(megabytes_leaked_by_the_strong_reference_version) + " megabytes" ^0
"  verdict : DELIVERED" ^0
"" ^0
"  the weak reference solved the problem it was chosen for" ^0
"  and it was the right problem to solve" ^0
"" ^0

# ---- what the delivery rate ranges over ----

"the measurement" ^0
"  numerator   : events delivered" ^0
"  denominator : events dispatched to live subscribers" ^0
"  what happens when a subscriber is collected : it leaves" ^0
"    the denominator" ^0
"  so a lost subscriber moves : both terms, together" ^0
"  the rate after losing one : unchanged" ^0
"" ^0
"  the failure and the count of opportunities are the same" ^0
"  event, so no ratio built from them can move" ^0
"" ^0
# ---- which registrations disappear ----

# Not a random sample. A subscriber held by a long-lived component survives; a
# subscriber constructed inside a function, registered, and returned from is
# exactly the one nothing else points at, and that is the common shape in the
# call sites that read as correct.
"which subscribers are collected" ^0
"  held by a long-lived component : survives" ^0
"  stored in a field by its owner : survives" ^0
"  constructed, registered, and not otherwise kept : gone" ^0
"  is that shape a mistake at the call site : it reads as" ^0
"    correct, and it compiles" ^0
"  registrations of that shape : " + str(registrations_reachable_only_from_the_registry) ^0
"" ^0

# ---- what a subscriber observes ----

"from inside the subscribing code" ^0
"  registration returned successfully : yes" ^0
"  an error at any point              : none" ^0
"  events arriving                    : some, then none" ^0
"  a log line at the moment it stops  : none, because" ^0
"    nothing happened; an object became unreachable" ^0
"  how it is usually found : someone notices a feature" ^0
"    stopped working, weeks later" ^0
"" ^0

# ---- null control ----

# The same registry, holding the subscriber strongly and returning a handle
# whose disposal is the only way to unregister. Lifetime becomes a thing the
# caller states rather than a thing the collector infers.
0 => nc_registrations_collected_while_registered
0 => nc_megabytes_leaked

"null control - a strong reference and an explicit handle" ^0
"  delivery failures : " + str(delivery_failures_recorded) + ", unchanged" ^0
"  registrations collected while registered : " + str(nc_registrations_collected_while_registered) ^0
"  megabytes leaked : " + str(nc_megabytes_leaked) + ", because unregistering is now a step" ^0
"    a caller takes rather than a consequence it earns" ^0
"  the registry did not get more reliable; the lifetime of a" ^0
"  subscription stopped being inferred from reachability" ^0
"" ^0

# ---- the rule ----

"what a perfect delivery rate guarantees" ^0
"  every event reached every live subscriber : exactly, and" ^0
"    over " + str(events_dispatched) + " events" ^0
"  every subscriber received its events       : not" ^0
"    addressed; a subscriber that is gone is not counted" ^0
"    as a subscriber that was missed" ^0
"" ^0
"a rate cannot see a failure that removes its own denominator;" ^0
"the number to watch is not the ratio but the count of" ^0
"registrations that stopped receiving, which requires" ^0
"remembering that they existed" ^0
"" ^0

"The registry is typed and delivers everything it dispatches - " + str(events_dispatched) + " events," ^0
str(delivery_failures_recorded) + " failures - and its weak reference was a reviewed fix for a real " + str(megabytes_leaked_by_the_strong_reference_version) ^0
"megabyte leak. A collected subscriber leaves the denominator with the event it" ^0
"missed, so " + str(registrations_reachable_only_from_the_registry) + " of " + str(registrations) + " registrations - " + str(silently_gone_per_myriad) + " per ten thousand - stopped" ^0
"receiving " + str(events_a_day_those_registrations_would_have_received) + " events a day, counted as " + str(events_counted_as_undelivered) + " undelivered." ^0
```

## Python (deterministic transpilation)

```python
events_dispatched = 40000000
delivery_failures_recorded = 0
registrations = 2400
registrations_reachable_only_from_the_registry = 190
of_those_collected_within_one_cycle = 190
events_a_day_those_registrations_would_have_received = 26000
events_counted_as_undelivered = 0
megabytes_leaked_by_the_strong_reference_version = 4200
registrations_held_by_something_else = registrations - registrations_reachable_only_from_the_registry
silently_gone_per_myriad = int(registrations_reachable_only_from_the_registry * 10000 / registrations)
print("events dispatched               : " + str(events_dispatched))
print("delivery failures recorded      : " + str(delivery_failures_recorded))
print("events counted as undelivered   : " + str(events_counted_as_undelivered))
print("")
print("registrations                   : " + str(registrations))
print("  held by something else        : " + str(registrations_held_by_something_else))
print("  reachable only from the registry : " + str(registrations_reachable_only_from_the_registry))
print("  of those, collected           : " + str(of_those_collected_within_one_cycle))
print("  share                         : " + str(silently_gone_per_myriad) + " per ten thousand")
print("events a day they would have received : " + str(events_a_day_those_registrations_would_have_received))
print("")
print("megabytes leaked by the earlier version : " + str(megabytes_leaked_by_the_strong_reference_version))
print("")
print("the event registry")
print("  registration : typed, so a handler cannot mismatch its")
print("    event")
print("  delivery     : at least once to every live subscriber")
print("  events dispatched : " + str(events_dispatched))
print("  delivery failures : " + str(delivery_failures_recorded))
print("  the weak reference : a reviewed fix for a real leak of")
print("    " + str(megabytes_leaked_by_the_strong_reference_version) + " megabytes")
print("  verdict : DELIVERED")
print("")
print("  the weak reference solved the problem it was chosen for")
print("  and it was the right problem to solve")
print("")
print("the measurement")
print("  numerator   : events delivered")
print("  denominator : events dispatched to live subscribers")
print("  what happens when a subscriber is collected : it leaves")
print("    the denominator")
print("  so a lost subscriber moves : both terms, together")
print("  the rate after losing one : unchanged")
print("")
print("  the failure and the count of opportunities are the same")
print("  event, so no ratio built from them can move")
print("")
print("which subscribers are collected")
print("  held by a long-lived component : survives")
print("  stored in a field by its owner : survives")
print("  constructed, registered, and not otherwise kept : gone")
print("  is that shape a mistake at the call site : it reads as")
print("    correct, and it compiles")
print("  registrations of that shape : " + str(registrations_reachable_only_from_the_registry))
print("")
print("from inside the subscribing code")
print("  registration returned successfully : yes")
print("  an error at any point              : none")
print("  events arriving                    : some, then none")
print("  a log line at the moment it stops  : none, because")
print("    nothing happened; an object became unreachable")
print("  how it is usually found : someone notices a feature")
print("    stopped working, weeks later")
print("")
nc_registrations_collected_while_registered = 0
nc_megabytes_leaked = 0
print("null control - a strong reference and an explicit handle")
print("  delivery failures : " + str(delivery_failures_recorded) + ", unchanged")
print("  registrations collected while registered : " + str(nc_registrations_collected_while_registered))
print("  megabytes leaked : " + str(nc_megabytes_leaked) + ", because unregistering is now a step")
print("    a caller takes rather than a consequence it earns")
print("  the registry did not get more reliable; the lifetime of a")
print("  subscription stopped being inferred from reachability")
print("")
print("what a perfect delivery rate guarantees")
print("  every event reached every live subscriber : exactly, and")
print("    over " + str(events_dispatched) + " events")
print("  every subscriber received its events       : not")
print("    addressed; a subscriber that is gone is not counted")
print("    as a subscriber that was missed")
print("")
print("a rate cannot see a failure that removes its own denominator;")
print("the number to watch is not the ratio but the count of")
print("registrations that stopped receiving, which requires")
print("remembering that they existed")
print("")
print("The registry is typed and delivers everything it dispatches - " + str(events_dispatched) + " events,")
print(str(delivery_failures_recorded) + " failures - and its weak reference was a reviewed fix for a real " + str(megabytes_leaked_by_the_strong_reference_version))
print("megabyte leak. A collected subscriber leaves the denominator with the event it")
print("missed, so " + str(registrations_reachable_only_from_the_registry) + " of " + str(registrations) + " registrations - " + str(silently_gone_per_myriad) + " per ten thousand - stopped")
print("receiving " + str(events_a_day_those_registrations_would_have_received) + " events a day, counted as " + str(events_counted_as_undelivered) + " undelivered.")
```

## stdout (executed)

```text
events dispatched               : 40000000
delivery failures recorded      : 0
events counted as undelivered   : 0

registrations                   : 2400
  held by something else        : 2210
  reachable only from the registry : 190
  of those, collected           : 190
  share                         : 791 per ten thousand
events a day they would have received : 26000

megabytes leaked by the earlier version : 4200

the event registry
  registration : typed, so a handler cannot mismatch its
    event
  delivery     : at least once to every live subscriber
  events dispatched : 40000000
  delivery failures : 0
  the weak reference : a reviewed fix for a real leak of
    4200 megabytes
  verdict : DELIVERED

  the weak reference solved the problem it was chosen for
  and it was the right problem to solve

the measurement
  numerator   : events delivered
  denominator : events dispatched to live subscribers
  what happens when a subscriber is collected : it leaves
    the denominator
  so a lost subscriber moves : both terms, together
  the rate after losing one : unchanged

  the failure and the count of opportunities are the same
  event, so no ratio built from them can move

which subscribers are collected
  held by a long-lived component : survives
  stored in a field by its owner : survives
  constructed, registered, and not otherwise kept : gone
  is that shape a mistake at the call site : it reads as
    correct, and it compiles
  registrations of that shape : 190

from inside the subscribing code
  registration returned successfully : yes
  an error at any point              : none
  events arriving                    : some, then none
  a log line at the moment it stops  : none, because
    nothing happened; an object became unreachable
  how it is usually found : someone notices a feature
    stopped working, weeks later

null control - a strong reference and an explicit handle
  delivery failures : 0, unchanged
  registrations collected while registered : 0
  megabytes leaked : 0, because unregistering is now a step
    a caller takes rather than a consequence it earns
  the registry did not get more reliable; the lifetime of a
  subscription stopped being inferred from reachability

what a perfect delivery rate guarantees
  every event reached every live subscriber : exactly, and
    over 40000000 events
  every subscriber received its events       : not
    addressed; a subscriber that is gone is not counted
    as a subscriber that was missed

a rate cannot see a failure that removes its own denominator;
the number to watch is not the ratio but the count of
registrations that stopped receiving, which requires
remembering that they existed

The registry is typed and delivers everything it dispatches - 40000000 events,
0 failures - and its weak reference was a reviewed fix for a real 4200
megabyte leak. A collected subscriber leaves the denominator with the event it
missed, so 190 of 2400 registrations - 791 per ten thousand - stopped
receiving 26000 events a day, counted as 0 undelivered.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
