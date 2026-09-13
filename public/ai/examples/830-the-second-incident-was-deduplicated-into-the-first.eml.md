<!-- canonical: efficientnewlanguage.org/ai/examples/830-the-second-incident-was-deduplicated-into-the-first | ai_layer_version: 0.1.0 | updated: 2026-09-13 -->

# Example 830 — The second incident was deduplicated into the first

`the_second_incident_was_deduplicated_into_the_first.eml` - Every distinct alert fingerprint paged on-call this shift, and the dedup that suppressed the rest removed only exact repeats. What a fingerprint groups together is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every distinct
# alert fingerprint paged on-call this shift, and the dedup that suppressed the
# rest removed only exact repeats. What a fingerprint groups together is
# computed below.
#
# The deduplication is sensible. It groups alerts by a fingerprint so a flapping
# check does not page a hundred times; it holds the group open only while the
# condition persists; it pages once per new fingerprint; and it is why on-call
# is not drowned in noise.
#
# The fingerprint is the service plus the error class, and two different
# incidents shared one.

4 => dedup_window_hours
2 => distinct_incidents_in_the_window
1 => alerts_paged
1 => incidents_suppressed_as_duplicates
140 => minutes_the_second_incident_went_unpaged

distinct_incidents_in_the_window - alerts_paged => incidents_that_reached_nobody
int(incidents_that_reached_nobody * 10000 / distinct_incidents_in_the_window) => incidents_lost_per_myriad

"dedup window                    : " + str(dedup_window_hours) + " hours" ^0
"distinct incidents              : " + str(distinct_incidents_in_the_window) ^0
"  alerts paged                  : " + str(alerts_paged) ^0
"  suppressed as duplicates      : " + str(incidents_suppressed_as_duplicates) ^0
"  reached nobody                : " + str(incidents_that_reached_nobody) ^0
"second incident went unpaged for: " + str(minutes_the_second_incident_went_unpaged) + " minutes" ^0
"incidents lost                  : " + str(incidents_lost_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the dedup verified ----

"the alert dedup" ^0
"  groups by : a fingerprint" ^0
"  holds a group open : while the condition persists" ^0
"  pages : once per new fingerprint" ^0
"  purpose : a flapping check does not page a hundred times" ^0
"  exact repeats suppressed : as designed" ^0
"  verdict : NOISE CONTROLLED" ^0
"" ^0
"  holding one page for a persisting condition is the part" ^0
"  done right here, and it is why on-call is not drowned" ^0
"" ^0

# ---- what the fingerprint groups ----

"the fingerprint" ^0
"  what it is : the service plus the error class" ^0
"  what it assumes : the same fingerprint is the same" ^0
"    incident, recurring" ^0
"  what happened : two incidents, different root causes," ^0
"    same service and error class" ^0
"  so the second : matched the first's open group" ^0
"  and was treated as : a repeat of an incident already" ^0
"    being handled" ^0
"" ^0

# ---- what on-call never saw ----

"the second incident" ^0
"  its own root cause : different from the first" ^0
"  the page it generated : suppressed as a duplicate" ^0
"  minutes it ran unattended : " + str(minutes_the_second_incident_went_unpaged) ^0
"  is the dedup rule wrong : no; the fingerprints did" ^0
"    match" ^0
"  is a matching fingerprint the same incident : not" ^0
"    always, and here it was not" ^0
"" ^0

# ---- null control ----

# The same two incidents, with the dedup keyed on the fingerprint plus a
# correlation id that differs when the underlying cause differs.
1 => nc_alerts_when_keyed_on_fingerprint_alone
2 => nc_alerts_when_keyed_with_correlation
0 => nc_incidents_lost

"null control - fingerprint plus a correlation id" ^0
"  alerts, fingerprint alone : " ^0
"    " + str(nc_alerts_when_keyed_on_fingerprint_alone) ^0
"  alerts, with a correlation id : " ^0
"    " + str(nc_alerts_when_keyed_with_correlation) ^0
"  incidents lost : " + str(nc_incidents_lost) ^0
"  no alert changed its content; the key stopped collapsing" ^0
"  two causes that share a surface" ^0
"" ^0

# ---- the rule ----

"what per-fingerprint dedup guarantees" ^0
"  every distinct fingerprint pages once : exactly, held" ^0
"    open while the condition persists" ^0
"  every incident pages someone : not addressed; alerts" ^0
"    dedup by fingerprint, and two distinct incidents shared" ^0
"    one - the second was suppressed as a duplicate and went" ^0
"    " + str(minutes_the_second_incident_went_unpaged) + " minutes unpaged" ^0
"" ^0

"a fingerprint is a guess that sameness of surface is sameness of cause, and" ^0
"dedup acts on the guess; when two causes wear one face, silencing the repeat" ^0
"silences the second incident" ^0
"" ^0

"It pages once per fingerprint and holds the group while the condition persists" ^0
"- noise controlled. The fingerprint is service plus error class, and two" ^0
"distinct incidents shared it, so the second was suppressed as a duplicate: " ^0
"" + str(minutes_the_second_incident_went_unpaged) + " minutes unpaged, " + str(incidents_lost_per_myriad) + " per ten thousand of incidents reaching nobody." ^0
```

## Python (deterministic transpilation)

```python
dedup_window_hours = 4
distinct_incidents_in_the_window = 2
alerts_paged = 1
incidents_suppressed_as_duplicates = 1
minutes_the_second_incident_went_unpaged = 140
incidents_that_reached_nobody = distinct_incidents_in_the_window - alerts_paged
incidents_lost_per_myriad = int(incidents_that_reached_nobody * 10000 / distinct_incidents_in_the_window)
print("dedup window                    : " + str(dedup_window_hours) + " hours")
print("distinct incidents              : " + str(distinct_incidents_in_the_window))
print("  alerts paged                  : " + str(alerts_paged))
print("  suppressed as duplicates      : " + str(incidents_suppressed_as_duplicates))
print("  reached nobody                : " + str(incidents_that_reached_nobody))
print("second incident went unpaged for: " + str(minutes_the_second_incident_went_unpaged) + " minutes")
print("incidents lost                  : " + str(incidents_lost_per_myriad) + " per ten thousand")
print("")
print("the alert dedup")
print("  groups by : a fingerprint")
print("  holds a group open : while the condition persists")
print("  pages : once per new fingerprint")
print("  purpose : a flapping check does not page a hundred times")
print("  exact repeats suppressed : as designed")
print("  verdict : NOISE CONTROLLED")
print("")
print("  holding one page for a persisting condition is the part")
print("  done right here, and it is why on-call is not drowned")
print("")
print("the fingerprint")
print("  what it is : the service plus the error class")
print("  what it assumes : the same fingerprint is the same")
print("    incident, recurring")
print("  what happened : two incidents, different root causes,")
print("    same service and error class")
print("  so the second : matched the first's open group")
print("  and was treated as : a repeat of an incident already")
print("    being handled")
print("")
print("the second incident")
print("  its own root cause : different from the first")
print("  the page it generated : suppressed as a duplicate")
print("  minutes it ran unattended : " + str(minutes_the_second_incident_went_unpaged))
print("  is the dedup rule wrong : no; the fingerprints did")
print("    match")
print("  is a matching fingerprint the same incident : not")
print("    always, and here it was not")
print("")
nc_alerts_when_keyed_on_fingerprint_alone = 1
nc_alerts_when_keyed_with_correlation = 2
nc_incidents_lost = 0
print("null control - fingerprint plus a correlation id")
print("  alerts, fingerprint alone : ")
print("    " + str(nc_alerts_when_keyed_on_fingerprint_alone))
print("  alerts, with a correlation id : ")
print("    " + str(nc_alerts_when_keyed_with_correlation))
print("  incidents lost : " + str(nc_incidents_lost))
print("  no alert changed its content; the key stopped collapsing")
print("  two causes that share a surface")
print("")
print("what per-fingerprint dedup guarantees")
print("  every distinct fingerprint pages once : exactly, held")
print("    open while the condition persists")
print("  every incident pages someone : not addressed; alerts")
print("    dedup by fingerprint, and two distinct incidents shared")
print("    one - the second was suppressed as a duplicate and went")
print("    " + str(minutes_the_second_incident_went_unpaged) + " minutes unpaged")
print("")
print("a fingerprint is a guess that sameness of surface is sameness of cause, and")
print("dedup acts on the guess; when two causes wear one face, silencing the repeat")
print("silences the second incident")
print("")
print("It pages once per fingerprint and holds the group while the condition persists")
print("- noise controlled. The fingerprint is service plus error class, and two")
print("distinct incidents shared it, so the second was suppressed as a duplicate: ")
print("" + str(minutes_the_second_incident_went_unpaged) + " minutes unpaged, " + str(incidents_lost_per_myriad) + " per ten thousand of incidents reaching nobody.")
```

## stdout (executed)

```text
dedup window                    : 4 hours
distinct incidents              : 2
  alerts paged                  : 1
  suppressed as duplicates      : 1
  reached nobody                : 1
second incident went unpaged for: 140 minutes
incidents lost                  : 5000 per ten thousand

the alert dedup
  groups by : a fingerprint
  holds a group open : while the condition persists
  pages : once per new fingerprint
  purpose : a flapping check does not page a hundred times
  exact repeats suppressed : as designed
  verdict : NOISE CONTROLLED

  holding one page for a persisting condition is the part
  done right here, and it is why on-call is not drowned

the fingerprint
  what it is : the service plus the error class
  what it assumes : the same fingerprint is the same
    incident, recurring
  what happened : two incidents, different root causes,
    same service and error class
  so the second : matched the first's open group
  and was treated as : a repeat of an incident already
    being handled

the second incident
  its own root cause : different from the first
  the page it generated : suppressed as a duplicate
  minutes it ran unattended : 140
  is the dedup rule wrong : no; the fingerprints did
    match
  is a matching fingerprint the same incident : not
    always, and here it was not

null control - fingerprint plus a correlation id
  alerts, fingerprint alone : 
    1
  alerts, with a correlation id : 
    2
  incidents lost : 0
  no alert changed its content; the key stopped collapsing
  two causes that share a surface

what per-fingerprint dedup guarantees
  every distinct fingerprint pages once : exactly, held
    open while the condition persists
  every incident pages someone : not addressed; alerts
    dedup by fingerprint, and two distinct incidents shared
    one - the second was suppressed as a duplicate and went
    140 minutes unpaged

a fingerprint is a guess that sameness of surface is sameness of cause, and
dedup acts on the guess; when two causes wear one face, silencing the repeat
silences the second incident

It pages once per fingerprint and holds the group while the condition persists
- noise controlled. The fingerprint is service plus error class, and two
distinct incidents shared it, so the second was suppressed as a duplicate: 
140 minutes unpaged, 5000 per ten thousand of incidents reaching nobody.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
