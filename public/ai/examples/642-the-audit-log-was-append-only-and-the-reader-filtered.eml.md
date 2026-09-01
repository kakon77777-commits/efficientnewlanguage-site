<!-- canonical: efficientnewlanguage.org/ai/examples/642-the-audit-log-was-append-only-and-the-reader-filtered | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 642 — The audit log was append only and the reader filtered

`the_audit_log_was_append_only_and_the_reader_filtered.eml` - The audit log is append-only, hash-chained, and nothing has ever been removed from it. How much of it anybody has read is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The audit log is
# append-only, hash-chained, and nothing has ever been removed from it. How much
# of it anybody has read is computed below.
#
# The integrity is genuine. Every entry carries the hash of the one before it,
# the chain is verified nightly over all forty-one million eight hundred
# thousand links, and a deliberate tamper drill last quarter was detected in
# under a second. There is no delete path in the code and no operator has one.
#
# Tamper-evidence is a property of the STORE. What anyone sees is a query, and
# the query has a default, and the default was chosen to make the page load.
#
# The console filters to human actors. The service accounts do ninety-two
# percent of the writing, and every event in last week's incident was one.

41800000 => entries_total
3200000 => entries_by_human_actors
0 => entries_removed
0 => chain_breaks_found
14 => incident_events

entries_total - entries_by_human_actors => entries_by_service_actors

"entries in the log          : " + str(entries_total) ^0
"  by human actors           : " + str(entries_by_human_actors) ^0
"  by service accounts       : " + str(entries_by_service_actors) ^0
"entries removed             : " + str(entries_removed) ^0
"" ^0

# ---- what the integrity check verified ----

"the nightly chain verification" ^0
"  links checked        : " + str(entries_total) ^0
"  chain breaks found   : " + str(chain_breaks_found) ^0
"  delete path in code  : none" ^0
"  operator delete permission : none" ^0
"  tamper drill last quarter  : detected in under a second" ^0
"  verdict              : APPEND-ONLY, INTACT" ^0
"" ^0
"  the drill is why anyone trusts this, and it worked" ^0
"" ^0

# ---- what the console shows ----

int(entries_by_human_actors * 10000 / entries_total) => shown_per_myriad
"the default view" ^0
"  filter        : actor type is human" ^0
"  chosen because: the unfiltered page timed out" ^0
"  entries shown : " + str(entries_by_human_actors) ^0
"  share shown   : " + str(shown_per_myriad) + " per ten thousand" ^0
"  entries hidden: " + str(entries_by_service_actors) ^0
"" ^0
"  hidden is not deleted, and for a reader the difference" ^0
"  only exists if somebody changes the filter" ^0
"" ^0

# ---- last week's incident ----

# The reviewer opened the console, filtered by time, found nothing, and wrote
# "no audit trail for this action". Every one of the fourteen events was there.
0 => incident_events_in_the_default_view

"the review" ^0
"  events that exist for the incident : " + str(incident_events) ^0
"  events visible in the default view : " + str(incident_events_in_the_default_view) ^0
"  the reviewer's conclusion : no audit trail" ^0
"  the log's own answer      : all " + str(incident_events) + " present, chain intact" ^0
"" ^0
"  both are honest reports of different questions" ^0
"" ^0

# ---- null control ----

# The same log, with the default filter removed and the page paginated instead.
entries_total => nc_entries_reachable
incident_events => nc_incident_events_visible

"null control - paginate instead of filter" ^0
"  chain breaks found     : " + str(chain_breaks_found) + ", unchanged" ^0
"  entries reachable      : " + str(nc_entries_reachable) ^0
"  incident events visible: " + str(nc_incident_events_visible) ^0
"  the log did not become more complete; the default" ^0
"  stopped removing most of it" ^0
"" ^0

# ---- the rule ----

"what an append-only log guarantees" ^0
"  nothing that was written is gone : exactly" ^0
"  what happened can be found       : not addressed;" ^0
"    findability is a property of the query, and the query" ^0
"    has a default that no integrity check inspects" ^0
"" ^0
"tamper-evidence answers 'was this changed'; it is used to" ^0
"answer 'what happened', and between those two sits a filter" ^0
"somebody set for a page-load time" ^0
"" ^0

"The log is append-only and the nightly verification is right: " + str(entries_total) + " links," ^0
str(chain_breaks_found) + " breaks, " + str(entries_removed) + " entries removed, no delete path, a tamper drill caught in" ^0
"under a second. The console defaults to human actors, which is " + str(shown_per_myriad) + " per ten" ^0
"thousand of it, so " + str(entries_by_service_actors) + " entries are present and unseen - including all " + str(incident_events) ^0
"events of last week's incident, reviewed as having no audit trail." ^0
```

## Python (deterministic transpilation)

```python
entries_total = 41800000
entries_by_human_actors = 3200000
entries_removed = 0
chain_breaks_found = 0
incident_events = 14
entries_by_service_actors = entries_total - entries_by_human_actors
print("entries in the log          : " + str(entries_total))
print("  by human actors           : " + str(entries_by_human_actors))
print("  by service accounts       : " + str(entries_by_service_actors))
print("entries removed             : " + str(entries_removed))
print("")
print("the nightly chain verification")
print("  links checked        : " + str(entries_total))
print("  chain breaks found   : " + str(chain_breaks_found))
print("  delete path in code  : none")
print("  operator delete permission : none")
print("  tamper drill last quarter  : detected in under a second")
print("  verdict              : APPEND-ONLY, INTACT")
print("")
print("  the drill is why anyone trusts this, and it worked")
print("")
shown_per_myriad = int(entries_by_human_actors * 10000 / entries_total)
print("the default view")
print("  filter        : actor type is human")
print("  chosen because: the unfiltered page timed out")
print("  entries shown : " + str(entries_by_human_actors))
print("  share shown   : " + str(shown_per_myriad) + " per ten thousand")
print("  entries hidden: " + str(entries_by_service_actors))
print("")
print("  hidden is not deleted, and for a reader the difference")
print("  only exists if somebody changes the filter")
print("")
incident_events_in_the_default_view = 0
print("the review")
print("  events that exist for the incident : " + str(incident_events))
print("  events visible in the default view : " + str(incident_events_in_the_default_view))
print("  the reviewer's conclusion : no audit trail")
print("  the log's own answer      : all " + str(incident_events) + " present, chain intact")
print("")
print("  both are honest reports of different questions")
print("")
nc_entries_reachable = entries_total
nc_incident_events_visible = incident_events
print("null control - paginate instead of filter")
print("  chain breaks found     : " + str(chain_breaks_found) + ", unchanged")
print("  entries reachable      : " + str(nc_entries_reachable))
print("  incident events visible: " + str(nc_incident_events_visible))
print("  the log did not become more complete; the default")
print("  stopped removing most of it")
print("")
print("what an append-only log guarantees")
print("  nothing that was written is gone : exactly")
print("  what happened can be found       : not addressed;")
print("    findability is a property of the query, and the query")
print("    has a default that no integrity check inspects")
print("")
print("tamper-evidence answers 'was this changed'; it is used to")
print("answer 'what happened', and between those two sits a filter")
print("somebody set for a page-load time")
print("")
print("The log is append-only and the nightly verification is right: " + str(entries_total) + " links,")
print(str(chain_breaks_found) + " breaks, " + str(entries_removed) + " entries removed, no delete path, a tamper drill caught in")
print("under a second. The console defaults to human actors, which is " + str(shown_per_myriad) + " per ten")
print("thousand of it, so " + str(entries_by_service_actors) + " entries are present and unseen - including all " + str(incident_events))
print("events of last week's incident, reviewed as having no audit trail.")
```

## stdout (executed)

```text
entries in the log          : 41800000
  by human actors           : 3200000
  by service accounts       : 38600000
entries removed             : 0

the nightly chain verification
  links checked        : 41800000
  chain breaks found   : 0
  delete path in code  : none
  operator delete permission : none
  tamper drill last quarter  : detected in under a second
  verdict              : APPEND-ONLY, INTACT

  the drill is why anyone trusts this, and it worked

the default view
  filter        : actor type is human
  chosen because: the unfiltered page timed out
  entries shown : 3200000
  share shown   : 765 per ten thousand
  entries hidden: 38600000

  hidden is not deleted, and for a reader the difference
  only exists if somebody changes the filter

the review
  events that exist for the incident : 14
  events visible in the default view : 0
  the reviewer's conclusion : no audit trail
  the log's own answer      : all 14 present, chain intact

  both are honest reports of different questions

null control - paginate instead of filter
  chain breaks found     : 0, unchanged
  entries reachable      : 41800000
  incident events visible: 14
  the log did not become more complete; the default
  stopped removing most of it

what an append-only log guarantees
  nothing that was written is gone : exactly
  what happened can be found       : not addressed;
    findability is a property of the query, and the query
    has a default that no integrity check inspects

tamper-evidence answers 'was this changed'; it is used to
answer 'what happened', and between those two sits a filter
somebody set for a page-load time

The log is append-only and the nightly verification is right: 41800000 links,
0 breaks, 0 entries removed, no delete path, a tamper drill caught in
under a second. The console defaults to human actors, which is 765 per ten
thousand of it, so 38600000 entries are present and unseen - including all 14
events of last week's incident, reviewed as having no audit trail.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
