<!-- canonical: efficientnewlanguage.org/ai/examples/776-the-upgrade-was-rehearsed-from-the-version-nobody-is-on | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 776 — The upgrade was rehearsed from the version nobody is on

`the_upgrade_was_rehearsed_from_the_version_nobody_is_on.eml` - The database upgrade was rehearsed twelve times on restored copies of production, timed to the minute, with the rollback rehearsed alongside it. Which upgrade was rehearsed is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The database
# upgrade was rehearsed twelve times on restored copies of production, timed to
# the minute, with the rollback rehearsed alongside it. Which upgrade was
# rehearsed is computed below.
#
# The rehearsal is serious. It runs against a copy restored from a real backup
# rather than a seeded fixture, so the data volume and the index bloat are the
# real ones; the clock is wall clock and the maintenance window was sized from
# it; the rollback is rehearsed in the same session rather than assumed; and
# nothing is signed off until a rehearsal has completed twice in a row.
#
# The rehearsal cluster runs the previous version. The fleet does not all run
# the previous version.

380 => clusters_in_the_fleet
134 => clusters_on_the_previous_version
118 => clusters_two_versions_behind
92 => clusters_three_versions_behind
36 => clusters_four_versions_behind
12 => rehearsals_run
84 => hours_of_rehearsal
12 => rollbacks_rehearsed
4 => upgrade_steps_present_in_the_fleet
1 => upgrade_steps_the_rehearsal_covered
1 => format_changes_between_three_versions_back_and_two
0 => format_changes_between_the_previous_version_and_this_one

clusters_in_the_fleet - clusters_on_the_previous_version => clusters_starting_somewhere_else
clusters_two_versions_behind + clusters_three_versions_behind => clusters_at_least_two_behind
clusters_at_least_two_behind + clusters_four_versions_behind => clusters_the_rehearsal_did_not_represent
upgrade_steps_present_in_the_fleet - upgrade_steps_the_rehearsal_covered => upgrade_steps_never_rehearsed
int(hours_of_rehearsal / rehearsals_run) => hours_per_rehearsal
int(clusters_on_the_previous_version * 10000 / clusters_in_the_fleet) => represented_per_myriad
int(upgrade_steps_the_rehearsal_covered * 10000 / upgrade_steps_present_in_the_fleet) => steps_covered_per_myriad

"clusters in the fleet           : " + str(clusters_in_the_fleet) ^0
"  on the previous version       : " + str(clusters_on_the_previous_version) ^0
"  two versions behind           : " + str(clusters_two_versions_behind) ^0
"  three versions behind         : " + str(clusters_three_versions_behind) ^0
"  four versions behind          : " + str(clusters_four_versions_behind) ^0
"  starting somewhere else       : " + str(clusters_starting_somewhere_else) ^0
"  represented by the rehearsal  : " + str(represented_per_myriad) + " per ten thousand" ^0
"" ^0
"rehearsals run                  : " + str(rehearsals_run) ^0
"  hours of rehearsal            : " + str(hours_of_rehearsal) ^0
"  hours per rehearsal           : " + str(hours_per_rehearsal) ^0
"  rollbacks rehearsed           : " + str(rollbacks_rehearsed) ^0
"" ^0
"upgrade steps in the fleet      : " + str(upgrade_steps_present_in_the_fleet) ^0
"  the rehearsal covered         : " + str(upgrade_steps_the_rehearsal_covered) ^0
"  never rehearsed               : " + str(upgrade_steps_never_rehearsed) ^0
"  steps covered                 : " + str(steps_covered_per_myriad) + " per ten thousand" ^0
"format changes, previous to this: " + str(format_changes_between_the_previous_version_and_this_one) ^0
"format changes, three back to two : " + str(format_changes_between_three_versions_back_and_two) ^0
"" ^0

# ---- what the rehearsal verified ----

"the upgrade rehearsal" ^0
"  the copy : restored from a real backup, so the data" ^0
"    volume and the index bloat are the real ones" ^0
"  the clock : wall clock, and the maintenance window was" ^0
"    sized from it, not estimated" ^0
"  the rollback : rehearsed in the same session, not" ^0
"    assumed" ^0
"  sign-off : only after two consecutive clean runs" ^0
"  runs : " + str(rehearsals_run) + ", " + str(hours_per_rehearsal) + " hours each" ^0
"  verdict : REHEARSED" ^0
"" ^0
"  restoring a real backup rather than seeding a fixture" ^0
"  is the part almost nobody does, and it is why the" ^0
"  window is a measurement" ^0
"" ^0

# ---- which upgrade was rehearsed ----

"the starting point" ^0
"  what the rehearsal cluster runs : the previous version" ^0
"  what the fleet runs : " + str(upgrade_steps_present_in_the_fleet) + " different starting versions" ^0
"  clusters the rehearsal stands for : " + str(clusters_on_the_previous_version) ^0
"  clusters it does not : " + str(clusters_the_rehearsal_did_not_represent) ^0
"  format changes on the rehearsed step : " ^0
"    " + str(format_changes_between_the_previous_version_and_this_one) ^0
"  format changes on a step further back : " ^0
"    " + str(format_changes_between_three_versions_back_and_two) ^0
"" ^0
"  twelve clean runs of one path are twelve pieces of" ^0
"  evidence about that path" ^0
"" ^0

# ---- what an older cluster meets ----

"a cluster three versions behind" ^0
"  is the target version the same : yes" ^0
"  is the procedure the same : yes, the runbook does not" ^0
"    branch on the starting version" ^0
"  does it cross a format change : yes, " ^0
"    " + str(format_changes_between_three_versions_back_and_two) + " of them" ^0
"  was that crossing rehearsed : no" ^0
"  clusters in that position or older : " ^0
"    " + str(clusters_three_versions_behind) + " plus " + str(clusters_four_versions_behind) ^0
"" ^0

# ---- null control ----

# The same rehearsal, run once from every starting version present in the fleet.
4 => nc_upgrade_steps_the_rehearsal_covered
48 => nc_rehearsals_run
380 => nc_clusters_represented

"null control - rehearse from every version in the fleet" ^0
"  hours per rehearsal : " + str(hours_per_rehearsal) + ", unchanged" ^0
"  rehearsals run : " + str(nc_rehearsals_run) ^0
"  upgrade steps covered : " + str(nc_upgrade_steps_the_rehearsal_covered) ^0
"  clusters represented : " + str(nc_clusters_represented) ^0
"  the rehearsal did not become more realistic; it was" ^0
"  started from the places the fleet is actually in" ^0
"" ^0

# ---- the rule ----

"what twelve clean rehearsals guarantee" ^0
"  the upgrade from the previous version works : exactly," ^0
"    on real restored data, timed, with a rollback, twice" ^0
"    consecutively" ^0
"  the upgrade works : not addressed; " + str(clusters_starting_somewhere_else) + " of " + str(clusters_in_the_fleet) ^0
"    clusters begin from a version no rehearsal began" ^0
"    from" ^0
"" ^0
"a rehearsal is evidence about the run it rehearsed; a" ^0
"fleet at four different versions is four upgrades, and" ^0
"repeating one of them twelve times says nothing about the" ^0
"other three" ^0
"" ^0

"The rehearsal restores a real backup, times the window on a wall clock, and" ^0
"rehearses the rollback in the same session - " + str(rehearsals_run) + " runs, " + str(hours_of_rehearsal) + " hours. It starts from" ^0
"the previous version, which " + str(clusters_on_the_previous_version) + " of " + str(clusters_in_the_fleet) + " clusters are on - " + str(represented_per_myriad) + " per ten" ^0
"thousand - so " + str(upgrade_steps_the_rehearsal_covered) + " of " + str(upgrade_steps_present_in_the_fleet) + " upgrade paths was exercised and the format change" ^0
"further back was met " + str(upgrade_steps_never_rehearsed) + " times short of a rehearsal." ^0
```

## Python (deterministic transpilation)

```python
clusters_in_the_fleet = 380
clusters_on_the_previous_version = 134
clusters_two_versions_behind = 118
clusters_three_versions_behind = 92
clusters_four_versions_behind = 36
rehearsals_run = 12
hours_of_rehearsal = 84
rollbacks_rehearsed = 12
upgrade_steps_present_in_the_fleet = 4
upgrade_steps_the_rehearsal_covered = 1
format_changes_between_three_versions_back_and_two = 1
format_changes_between_the_previous_version_and_this_one = 0
clusters_starting_somewhere_else = clusters_in_the_fleet - clusters_on_the_previous_version
clusters_at_least_two_behind = clusters_two_versions_behind + clusters_three_versions_behind
clusters_the_rehearsal_did_not_represent = clusters_at_least_two_behind + clusters_four_versions_behind
upgrade_steps_never_rehearsed = upgrade_steps_present_in_the_fleet - upgrade_steps_the_rehearsal_covered
hours_per_rehearsal = int(hours_of_rehearsal / rehearsals_run)
represented_per_myriad = int(clusters_on_the_previous_version * 10000 / clusters_in_the_fleet)
steps_covered_per_myriad = int(upgrade_steps_the_rehearsal_covered * 10000 / upgrade_steps_present_in_the_fleet)
print("clusters in the fleet           : " + str(clusters_in_the_fleet))
print("  on the previous version       : " + str(clusters_on_the_previous_version))
print("  two versions behind           : " + str(clusters_two_versions_behind))
print("  three versions behind         : " + str(clusters_three_versions_behind))
print("  four versions behind          : " + str(clusters_four_versions_behind))
print("  starting somewhere else       : " + str(clusters_starting_somewhere_else))
print("  represented by the rehearsal  : " + str(represented_per_myriad) + " per ten thousand")
print("")
print("rehearsals run                  : " + str(rehearsals_run))
print("  hours of rehearsal            : " + str(hours_of_rehearsal))
print("  hours per rehearsal           : " + str(hours_per_rehearsal))
print("  rollbacks rehearsed           : " + str(rollbacks_rehearsed))
print("")
print("upgrade steps in the fleet      : " + str(upgrade_steps_present_in_the_fleet))
print("  the rehearsal covered         : " + str(upgrade_steps_the_rehearsal_covered))
print("  never rehearsed               : " + str(upgrade_steps_never_rehearsed))
print("  steps covered                 : " + str(steps_covered_per_myriad) + " per ten thousand")
print("format changes, previous to this: " + str(format_changes_between_the_previous_version_and_this_one))
print("format changes, three back to two : " + str(format_changes_between_three_versions_back_and_two))
print("")
print("the upgrade rehearsal")
print("  the copy : restored from a real backup, so the data")
print("    volume and the index bloat are the real ones")
print("  the clock : wall clock, and the maintenance window was")
print("    sized from it, not estimated")
print("  the rollback : rehearsed in the same session, not")
print("    assumed")
print("  sign-off : only after two consecutive clean runs")
print("  runs : " + str(rehearsals_run) + ", " + str(hours_per_rehearsal) + " hours each")
print("  verdict : REHEARSED")
print("")
print("  restoring a real backup rather than seeding a fixture")
print("  is the part almost nobody does, and it is why the")
print("  window is a measurement")
print("")
print("the starting point")
print("  what the rehearsal cluster runs : the previous version")
print("  what the fleet runs : " + str(upgrade_steps_present_in_the_fleet) + " different starting versions")
print("  clusters the rehearsal stands for : " + str(clusters_on_the_previous_version))
print("  clusters it does not : " + str(clusters_the_rehearsal_did_not_represent))
print("  format changes on the rehearsed step : ")
print("    " + str(format_changes_between_the_previous_version_and_this_one))
print("  format changes on a step further back : ")
print("    " + str(format_changes_between_three_versions_back_and_two))
print("")
print("  twelve clean runs of one path are twelve pieces of")
print("  evidence about that path")
print("")
print("a cluster three versions behind")
print("  is the target version the same : yes")
print("  is the procedure the same : yes, the runbook does not")
print("    branch on the starting version")
print("  does it cross a format change : yes, ")
print("    " + str(format_changes_between_three_versions_back_and_two) + " of them")
print("  was that crossing rehearsed : no")
print("  clusters in that position or older : ")
print("    " + str(clusters_three_versions_behind) + " plus " + str(clusters_four_versions_behind))
print("")
nc_upgrade_steps_the_rehearsal_covered = 4
nc_rehearsals_run = 48
nc_clusters_represented = 380
print("null control - rehearse from every version in the fleet")
print("  hours per rehearsal : " + str(hours_per_rehearsal) + ", unchanged")
print("  rehearsals run : " + str(nc_rehearsals_run))
print("  upgrade steps covered : " + str(nc_upgrade_steps_the_rehearsal_covered))
print("  clusters represented : " + str(nc_clusters_represented))
print("  the rehearsal did not become more realistic; it was")
print("  started from the places the fleet is actually in")
print("")
print("what twelve clean rehearsals guarantee")
print("  the upgrade from the previous version works : exactly,")
print("    on real restored data, timed, with a rollback, twice")
print("    consecutively")
print("  the upgrade works : not addressed; " + str(clusters_starting_somewhere_else) + " of " + str(clusters_in_the_fleet))
print("    clusters begin from a version no rehearsal began")
print("    from")
print("")
print("a rehearsal is evidence about the run it rehearsed; a")
print("fleet at four different versions is four upgrades, and")
print("repeating one of them twelve times says nothing about the")
print("other three")
print("")
print("The rehearsal restores a real backup, times the window on a wall clock, and")
print("rehearses the rollback in the same session - " + str(rehearsals_run) + " runs, " + str(hours_of_rehearsal) + " hours. It starts from")
print("the previous version, which " + str(clusters_on_the_previous_version) + " of " + str(clusters_in_the_fleet) + " clusters are on - " + str(represented_per_myriad) + " per ten")
print("thousand - so " + str(upgrade_steps_the_rehearsal_covered) + " of " + str(upgrade_steps_present_in_the_fleet) + " upgrade paths was exercised and the format change")
print("further back was met " + str(upgrade_steps_never_rehearsed) + " times short of a rehearsal.")
```

## stdout (executed)

```text
clusters in the fleet           : 380
  on the previous version       : 134
  two versions behind           : 118
  three versions behind         : 92
  four versions behind          : 36
  starting somewhere else       : 246
  represented by the rehearsal  : 3526 per ten thousand

rehearsals run                  : 12
  hours of rehearsal            : 84
  hours per rehearsal           : 7
  rollbacks rehearsed           : 12

upgrade steps in the fleet      : 4
  the rehearsal covered         : 1
  never rehearsed               : 3
  steps covered                 : 2500 per ten thousand
format changes, previous to this: 0
format changes, three back to two : 1

the upgrade rehearsal
  the copy : restored from a real backup, so the data
    volume and the index bloat are the real ones
  the clock : wall clock, and the maintenance window was
    sized from it, not estimated
  the rollback : rehearsed in the same session, not
    assumed
  sign-off : only after two consecutive clean runs
  runs : 12, 7 hours each
  verdict : REHEARSED

  restoring a real backup rather than seeding a fixture
  is the part almost nobody does, and it is why the
  window is a measurement

the starting point
  what the rehearsal cluster runs : the previous version
  what the fleet runs : 4 different starting versions
  clusters the rehearsal stands for : 134
  clusters it does not : 246
  format changes on the rehearsed step : 
    0
  format changes on a step further back : 
    1

  twelve clean runs of one path are twelve pieces of
  evidence about that path

a cluster three versions behind
  is the target version the same : yes
  is the procedure the same : yes, the runbook does not
    branch on the starting version
  does it cross a format change : yes, 
    1 of them
  was that crossing rehearsed : no
  clusters in that position or older : 
    92 plus 36

null control - rehearse from every version in the fleet
  hours per rehearsal : 7, unchanged
  rehearsals run : 48
  upgrade steps covered : 4
  clusters represented : 380
  the rehearsal did not become more realistic; it was
  started from the places the fleet is actually in

what twelve clean rehearsals guarantee
  the upgrade from the previous version works : exactly,
    on real restored data, timed, with a rollback, twice
    consecutively
  the upgrade works : not addressed; 246 of 380
    clusters begin from a version no rehearsal began
    from

a rehearsal is evidence about the run it rehearsed; a
fleet at four different versions is four upgrades, and
repeating one of them twelve times says nothing about the
other three

The rehearsal restores a real backup, times the window on a wall clock, and
rehearses the rollback in the same session - 12 runs, 84 hours. It starts from
the previous version, which 134 of 380 clusters are on - 3526 per ten
thousand - so 1 of 4 upgrade paths was exercised and the format change
further back was met 3 times short of a rehearsal.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
