<!-- canonical: efficientnewlanguage.org/ai/examples/782-the-checklist-was-published-and-the-failures-moved-off-it | ai_layer_version: 0.1.0 | updated: 2026-09-10 -->

# Example 782 — The checklist was published and the failures moved off it

`the_checklist_was_published_and_the_failures_moved_off_it.eml` - The internal audit checklist was published so teams could prepare, and findings per audit fell by three quarters in the two years since. What moved is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The internal audit
# checklist was published so teams could prepare, and findings per audit fell by
# three quarters in the two years since. What moved is computed below.
#
# Publishing it was the right call and the audit is well run. An audit that
# surprises people measures preparation, not practice; the checklist is
# evidence-based, each item traceable to a real past incident; auditors rotate
# so no team is read by the same person twice; and a finding must cite the
# artifact it was found in rather than an opinion.
#
# The checklist names sixty things. The audit looks for those sixty things.

64 => audits_a_year
60 => items_on_the_published_checklist
2 => years_since_publication
1240 => findings_in_the_year_before_publication
310 => findings_last_year
0 => items_added_to_the_checklist_since_publication
19 => incidents_last_year_whose_cause_was_on_the_checklist
27 => incidents_last_year_whose_cause_was_not
54 => incidents_in_the_year_before_publication
41 => that_years_incidents_whose_cause_was_on_the_checklist

findings_in_the_year_before_publication - findings_last_year => findings_that_stopped_being_found
incidents_last_year_whose_cause_was_on_the_checklist + incidents_last_year_whose_cause_was_not => incidents_last_year
incidents_in_the_year_before_publication - that_years_incidents_whose_cause_was_on_the_checklist => that_years_incidents_off_the_checklist
incidents_last_year - incidents_in_the_year_before_publication => change_in_incidents
int(findings_last_year * 10000 / findings_in_the_year_before_publication) => findings_remaining_per_myriad
int(incidents_last_year_whose_cause_was_on_the_checklist * 10000 / incidents_last_year) => on_checklist_causes_now_per_myriad
int(that_years_incidents_whose_cause_was_on_the_checklist * 10000 / incidents_in_the_year_before_publication) => on_checklist_causes_before_per_myriad

"audits a year                   : " + str(audits_a_year) ^0
"items on the published checklist: " + str(items_on_the_published_checklist) ^0
"years since publication         : " + str(years_since_publication) ^0
"items added since               : " + str(items_added_to_the_checklist_since_publication) ^0
"" ^0
"findings, year before           : " + str(findings_in_the_year_before_publication) ^0
"findings, last year             : " + str(findings_last_year) ^0
"  that stopped being found      : " + str(findings_that_stopped_being_found) ^0
"  remaining                     : " + str(findings_remaining_per_myriad) + " per ten thousand" ^0
"" ^0
"incidents, year before          : " + str(incidents_in_the_year_before_publication) ^0
"  cause on the checklist        : " + str(that_years_incidents_whose_cause_was_on_the_checklist) ^0
"  cause off it                  : " + str(that_years_incidents_off_the_checklist) ^0
"  on-checklist share            : " + str(on_checklist_causes_before_per_myriad) + " per ten thousand" ^0
"incidents, last year            : " + str(incidents_last_year) ^0
"  cause on the checklist        : " + str(incidents_last_year_whose_cause_was_on_the_checklist) ^0
"  cause off it                  : " + str(incidents_last_year_whose_cause_was_not) ^0
"  on-checklist share            : " + str(on_checklist_causes_now_per_myriad) + " per ten thousand" ^0
"change in incidents             : " + str(change_in_incidents) ^0
"" ^0

# ---- what the audit verified ----

"the internal audit" ^0
"  the checklist : published, so an audit measures" ^0
"    practice rather than surprise" ^0
"  each item : traceable to a real past incident, not to" ^0
"    an opinion" ^0
"  the auditors : rotated, so no team is read twice by" ^0
"    the same person" ^0
"  a finding : must cite the artifact it was found in" ^0
"  audits a year : " + str(audits_a_year) ^0
"  verdict : AUDITED" ^0
"" ^0
"  publishing the checklist is the right call, and" ^0
"  requiring a finding to cite an artifact is the part" ^0
"  almost nobody does" ^0
"" ^0

# ---- what the population did with it ----

"the sixty items, once they were known" ^0
"  what a team can now do : fix exactly those sixty" ^0
"    things before the auditor arrives" ^0
"  findings that stopped being found : " ^0
"    " + str(findings_that_stopped_being_found) ^0
"  items added since publication : " ^0
"    " + str(items_added_to_the_checklist_since_publication) ^0
"  so the list a team prepares against : the same sixty," ^0
"    for two years" ^0
"" ^0
"  the criteria became the target, and a target is met" ^0
"  rather than exceeded" ^0
"" ^0

# ---- what the incidents say ----

"causes, before and after" ^0
"  incidents whose cause was on the list, before : " ^0
"    " + str(that_years_incidents_whose_cause_was_on_the_checklist) + " of " + str(incidents_in_the_year_before_publication) + ", " + str(on_checklist_causes_before_per_myriad) + " per ten thousand" ^0
"  incidents whose cause was on the list, last year : " ^0
"    " + str(incidents_last_year_whose_cause_was_on_the_checklist) + " of " + str(incidents_last_year) + ", " + str(on_checklist_causes_now_per_myriad) + " per ten thousand" ^0
"  so the checklist's own items : are genuinely being" ^0
"    fixed, and that is a real result" ^0
"  incidents whose cause was off the list : " ^0
"    " + str(that_years_incidents_off_the_checklist) + " before, " + str(incidents_last_year_whose_cause_was_not) + " last year" ^0
"  total incidents : " + str(change_in_incidents) ^0
"" ^0

# ---- null control ----

# The same audit, with a quarter of each visit spent on whatever the auditor
# judges worth looking at, off the list and unannounced.
310 => nc_findings_from_the_published_items
118 => nc_findings_from_the_unannounced_quarter
0 => nc_items_added_to_the_published_list

"null control - spend a quarter of each audit off the list" ^0
"  items added to the published list : " ^0
"    " + str(nc_items_added_to_the_published_list) + ", unchanged" ^0
"  findings from the published items : " ^0
"    " + str(nc_findings_from_the_published_items) + ", unchanged" ^0
"  findings from the unannounced quarter : " ^0
"    " + str(nc_findings_from_the_unannounced_quarter) ^0
"  no team got worse; the auditor stopped only looking" ^0
"  where the teams had been told to expect them" ^0
"" ^0

# ---- the rule ----

"what a falling finding count guarantees" ^0
"  the sixty published items are being done : exactly," ^0
"    " + str(audits_a_year) + " audits a year, findings down to " ^0
"    " + str(findings_remaining_per_myriad) + " per ten thousand, and the incidents caused" ^0
"    by those items fell with them" ^0
"  the estate is safer : not addressed; the list has not" ^0
"    moved in " + str(years_since_publication) + " years and incidents whose cause is off it" ^0
"    went from " + str(that_years_incidents_off_the_checklist) + " to " + str(incidents_last_year_whose_cause_was_not) ^0
"" ^0
"published criteria are a promise about where you will" ^0
"look; a population that can read them improves exactly" ^0
"there, and the measurement cannot distinguish that from" ^0
"improving" ^0
"" ^0

"The checklist is evidence-based, auditors rotate, findings must cite an" ^0
"artifact, and " + str(findings_that_stopped_being_found) + " findings stopped being found across " + str(audits_a_year) + " audits a year. The" ^0
"sixty items have not changed in " + str(years_since_publication) + " years: incidents caused by them fell from " ^0
"" + str(that_years_incidents_whose_cause_was_on_the_checklist) + " to " + str(incidents_last_year_whose_cause_was_on_the_checklist) + ", incidents caused by anything else went " + str(that_years_incidents_off_the_checklist) + " to " ^0
"" + str(incidents_last_year_whose_cause_was_not) + ", and the total moved by " + str(change_in_incidents) + "." ^0
```

## Python (deterministic transpilation)

```python
audits_a_year = 64
items_on_the_published_checklist = 60
years_since_publication = 2
findings_in_the_year_before_publication = 1240
findings_last_year = 310
items_added_to_the_checklist_since_publication = 0
incidents_last_year_whose_cause_was_on_the_checklist = 19
incidents_last_year_whose_cause_was_not = 27
incidents_in_the_year_before_publication = 54
that_years_incidents_whose_cause_was_on_the_checklist = 41
findings_that_stopped_being_found = findings_in_the_year_before_publication - findings_last_year
incidents_last_year = incidents_last_year_whose_cause_was_on_the_checklist + incidents_last_year_whose_cause_was_not
that_years_incidents_off_the_checklist = incidents_in_the_year_before_publication - that_years_incidents_whose_cause_was_on_the_checklist
change_in_incidents = incidents_last_year - incidents_in_the_year_before_publication
findings_remaining_per_myriad = int(findings_last_year * 10000 / findings_in_the_year_before_publication)
on_checklist_causes_now_per_myriad = int(incidents_last_year_whose_cause_was_on_the_checklist * 10000 / incidents_last_year)
on_checklist_causes_before_per_myriad = int(that_years_incidents_whose_cause_was_on_the_checklist * 10000 / incidents_in_the_year_before_publication)
print("audits a year                   : " + str(audits_a_year))
print("items on the published checklist: " + str(items_on_the_published_checklist))
print("years since publication         : " + str(years_since_publication))
print("items added since               : " + str(items_added_to_the_checklist_since_publication))
print("")
print("findings, year before           : " + str(findings_in_the_year_before_publication))
print("findings, last year             : " + str(findings_last_year))
print("  that stopped being found      : " + str(findings_that_stopped_being_found))
print("  remaining                     : " + str(findings_remaining_per_myriad) + " per ten thousand")
print("")
print("incidents, year before          : " + str(incidents_in_the_year_before_publication))
print("  cause on the checklist        : " + str(that_years_incidents_whose_cause_was_on_the_checklist))
print("  cause off it                  : " + str(that_years_incidents_off_the_checklist))
print("  on-checklist share            : " + str(on_checklist_causes_before_per_myriad) + " per ten thousand")
print("incidents, last year            : " + str(incidents_last_year))
print("  cause on the checklist        : " + str(incidents_last_year_whose_cause_was_on_the_checklist))
print("  cause off it                  : " + str(incidents_last_year_whose_cause_was_not))
print("  on-checklist share            : " + str(on_checklist_causes_now_per_myriad) + " per ten thousand")
print("change in incidents             : " + str(change_in_incidents))
print("")
print("the internal audit")
print("  the checklist : published, so an audit measures")
print("    practice rather than surprise")
print("  each item : traceable to a real past incident, not to")
print("    an opinion")
print("  the auditors : rotated, so no team is read twice by")
print("    the same person")
print("  a finding : must cite the artifact it was found in")
print("  audits a year : " + str(audits_a_year))
print("  verdict : AUDITED")
print("")
print("  publishing the checklist is the right call, and")
print("  requiring a finding to cite an artifact is the part")
print("  almost nobody does")
print("")
print("the sixty items, once they were known")
print("  what a team can now do : fix exactly those sixty")
print("    things before the auditor arrives")
print("  findings that stopped being found : ")
print("    " + str(findings_that_stopped_being_found))
print("  items added since publication : ")
print("    " + str(items_added_to_the_checklist_since_publication))
print("  so the list a team prepares against : the same sixty,")
print("    for two years")
print("")
print("  the criteria became the target, and a target is met")
print("  rather than exceeded")
print("")
print("causes, before and after")
print("  incidents whose cause was on the list, before : ")
print("    " + str(that_years_incidents_whose_cause_was_on_the_checklist) + " of " + str(incidents_in_the_year_before_publication) + ", " + str(on_checklist_causes_before_per_myriad) + " per ten thousand")
print("  incidents whose cause was on the list, last year : ")
print("    " + str(incidents_last_year_whose_cause_was_on_the_checklist) + " of " + str(incidents_last_year) + ", " + str(on_checklist_causes_now_per_myriad) + " per ten thousand")
print("  so the checklist's own items : are genuinely being")
print("    fixed, and that is a real result")
print("  incidents whose cause was off the list : ")
print("    " + str(that_years_incidents_off_the_checklist) + " before, " + str(incidents_last_year_whose_cause_was_not) + " last year")
print("  total incidents : " + str(change_in_incidents))
print("")
nc_findings_from_the_published_items = 310
nc_findings_from_the_unannounced_quarter = 118
nc_items_added_to_the_published_list = 0
print("null control - spend a quarter of each audit off the list")
print("  items added to the published list : ")
print("    " + str(nc_items_added_to_the_published_list) + ", unchanged")
print("  findings from the published items : ")
print("    " + str(nc_findings_from_the_published_items) + ", unchanged")
print("  findings from the unannounced quarter : ")
print("    " + str(nc_findings_from_the_unannounced_quarter))
print("  no team got worse; the auditor stopped only looking")
print("  where the teams had been told to expect them")
print("")
print("what a falling finding count guarantees")
print("  the sixty published items are being done : exactly,")
print("    " + str(audits_a_year) + " audits a year, findings down to ")
print("    " + str(findings_remaining_per_myriad) + " per ten thousand, and the incidents caused")
print("    by those items fell with them")
print("  the estate is safer : not addressed; the list has not")
print("    moved in " + str(years_since_publication) + " years and incidents whose cause is off it")
print("    went from " + str(that_years_incidents_off_the_checklist) + " to " + str(incidents_last_year_whose_cause_was_not))
print("")
print("published criteria are a promise about where you will")
print("look; a population that can read them improves exactly")
print("there, and the measurement cannot distinguish that from")
print("improving")
print("")
print("The checklist is evidence-based, auditors rotate, findings must cite an")
print("artifact, and " + str(findings_that_stopped_being_found) + " findings stopped being found across " + str(audits_a_year) + " audits a year. The")
print("sixty items have not changed in " + str(years_since_publication) + " years: incidents caused by them fell from ")
print("" + str(that_years_incidents_whose_cause_was_on_the_checklist) + " to " + str(incidents_last_year_whose_cause_was_on_the_checklist) + ", incidents caused by anything else went " + str(that_years_incidents_off_the_checklist) + " to ")
print("" + str(incidents_last_year_whose_cause_was_not) + ", and the total moved by " + str(change_in_incidents) + ".")
```

## stdout (executed)

```text
audits a year                   : 64
items on the published checklist: 60
years since publication         : 2
items added since               : 0

findings, year before           : 1240
findings, last year             : 310
  that stopped being found      : 930
  remaining                     : 2500 per ten thousand

incidents, year before          : 54
  cause on the checklist        : 41
  cause off it                  : 13
  on-checklist share            : 7592 per ten thousand
incidents, last year            : 46
  cause on the checklist        : 19
  cause off it                  : 27
  on-checklist share            : 4130 per ten thousand
change in incidents             : -8

the internal audit
  the checklist : published, so an audit measures
    practice rather than surprise
  each item : traceable to a real past incident, not to
    an opinion
  the auditors : rotated, so no team is read twice by
    the same person
  a finding : must cite the artifact it was found in
  audits a year : 64
  verdict : AUDITED

  publishing the checklist is the right call, and
  requiring a finding to cite an artifact is the part
  almost nobody does

the sixty items, once they were known
  what a team can now do : fix exactly those sixty
    things before the auditor arrives
  findings that stopped being found : 
    930
  items added since publication : 
    0
  so the list a team prepares against : the same sixty,
    for two years

  the criteria became the target, and a target is met
  rather than exceeded

causes, before and after
  incidents whose cause was on the list, before : 
    41 of 54, 7592 per ten thousand
  incidents whose cause was on the list, last year : 
    19 of 46, 4130 per ten thousand
  so the checklist's own items : are genuinely being
    fixed, and that is a real result
  incidents whose cause was off the list : 
    13 before, 27 last year
  total incidents : -8

null control - spend a quarter of each audit off the list
  items added to the published list : 
    0, unchanged
  findings from the published items : 
    310, unchanged
  findings from the unannounced quarter : 
    118
  no team got worse; the auditor stopped only looking
  where the teams had been told to expect them

what a falling finding count guarantees
  the sixty published items are being done : exactly,
    64 audits a year, findings down to 
    2500 per ten thousand, and the incidents caused
    by those items fell with them
  the estate is safer : not addressed; the list has not
    moved in 2 years and incidents whose cause is off it
    went from 13 to 27

published criteria are a promise about where you will
look; a population that can read them improves exactly
there, and the measurement cannot distinguish that from
improving

The checklist is evidence-based, auditors rotate, findings must cite an
artifact, and 930 findings stopped being found across 64 audits a year. The
sixty items have not changed in 2 years: incidents caused by them fell from 
41 to 19, incidents caused by anything else went 13 to 
27, and the total moved by -8.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
