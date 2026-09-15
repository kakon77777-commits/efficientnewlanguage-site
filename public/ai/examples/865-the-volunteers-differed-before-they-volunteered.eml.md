<!-- canonical: efficientnewlanguage.org/ai/examples/865-the-volunteers-differed-before-they-volunteered | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 865 — The volunteers differed before they volunteered

`the_volunteers_differed_before_they_volunteered.eml` - Employees who joined the wellness program are 20 points healthier than those who did not. The scores are real and the comparison is honest. What made someone a participant is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Employees who
# joined the wellness program are 20 points healthier than those who did not. The
# scores are real and the comparison is honest. What made someone a participant is
# computed below.
#
# The measurement is careful. It reads the real recorded health scores, not
# self-reports; it covers every employee; the group comparison is the honest
# difference of means; and the intent is exactly 'does the program improve
# health'.
#
# Joining was voluntary, and the already health-conscious are the ones who joined,
# so the participants were healthier before the program began - the after-gap
# includes a gap that was there at the start.

500 => participants
500 => non_participants
75 => participant_before
80 => participant_after
62 => non_participant_before
60 => non_participant_after

participant_after - non_participant_after => gap_after
participant_before - non_participant_before => gap_before_the_program
participant_after - participant_before => participant_change
non_participant_after - non_participant_before => non_participant_change
participant_change - non_participant_change => effect_by_change_from_baseline
int(gap_before_the_program * 10000 / gap_after) => self_selection_share_per_myriad

"participants                    : " + str(participants) ^0
"non-participants                : " + str(non_participants) ^0
"" ^0
"participant health   before / after : " + str(participant_before) + " / " + str(participant_after) ^0
"non-participant       before / after : " + str(non_participant_before) + " / " + str(non_participant_after) ^0
"" ^0
"gap after the program           : " + str(gap_after) ^0
"gap before the program          : " + str(gap_before_the_program) ^0
"effect by change-from-baseline  : " + str(effect_by_change_from_baseline) ^0
"pre-existing share of the gap   : " + str(self_selection_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the health comparison" ^0
"  reads : real recorded health scores, not self-reports" ^0
"  covers : every employee" ^0
"  comparison : the honest difference of group means" ^0
"  intent : does the program improve health" ^0
"  employees omitted : 0" ^0
"  verdict : PARTICIPANTS ARE 20 POINTS HEALTHIER" ^0
"" ^0
"  reading real scores over every employee is the part done" ^0
"  right here, and it is why the 20-point after-gap is a" ^0
"  true difference between the two groups" ^0
"" ^0

# ---- what made someone a participant ----

"how the groups were formed" ^0
"  the rule : each employee chose whether to join" ^0
"  who chooses to join : the already health-conscious" ^0
"  so at baseline the joiners were : 13 points healthier" ^0
"    already, before any program" ^0
"  what the after-gap contains : that pre-existing 13 plus" ^0
"    whatever the program did" ^0
"  what a cross-section cannot separate : the effect from" ^0
"    who selected in" ^0
"" ^0

# ---- what the caller concluded ----

"the conclusion drawn" ^0
"  program makes people : 20 points healthier" ^0
"  gap that predated the program : " + str(gap_before_the_program) ^0
"  effect once each group is measured against itself : " + str(effect_by_change_from_baseline) ^0
"  are the scores wrong : no; they are exact" ^0
"  is 20 the program's effect : no; " + str(self_selection_share_per_myriad) + " per ten" ^0
"    thousand of it was there before the program" ^0
"" ^0

# ---- null control ----

# The same employees, compared as change-from-baseline (difference-in-differences),
# or matched on their pre-program score, instead of a raw after-cross-section.
20 => nc_gap_by_raw_cross_section
7 => nc_effect_by_change_from_baseline
13 => nc_baseline_gap_the_matching_removes

"null control - compare change-from-baseline, not the after-cross-section" ^0
"  gap by raw after-cross-section : " + str(nc_gap_by_raw_cross_section) ^0
"  effect by change-from-baseline : " + str(nc_effect_by_change_from_baseline) ^0
"  baseline gap the matching removes : " + str(nc_baseline_gap_the_matching_removes) ^0
"  no employee and no score changed; the 20 stopped being" ^0
"  read as an effect and started being read against where" ^0
"  each group began" ^0
"" ^0

# ---- the rule ----

"what a participant-vs-non-participant comparison guarantees" ^0
"  the two groups differ by the measured amount now : exactly," ^0
"    real scores, every employee, honest difference" ^0
"  the program caused the difference : not addressed;" ^0
"    joining was voluntary and the health-conscious joined," ^0
"    so the groups differed by " + str(gap_before_the_program) + " at baseline - change-from-" ^0
"    baseline leaves the program only " + str(effect_by_change_from_baseline) + " of the " + str(gap_after) ^0
"" ^0

"when the treated choose themselves, the groups differ before the treatment does" ^0
"anything, and a comparison taken only afterward measures who opted in as much as" ^0
"what they opted into; the baseline gap is charged to the program that did not" ^0
"open it" ^0
"" ^0

"It reads real scores over every employee with an honest group difference - the" ^0
"20-point gap is true. But joining was voluntary and the health-conscious joined," ^0
"so the groups differed by " + str(gap_before_the_program) + " at baseline; change-from-baseline leaves " + str(effect_by_change_from_baseline) + " for" ^0
"the program, " + str(self_selection_share_per_myriad) + " per ten thousand of the gap predating it." ^0
```

## Python (deterministic transpilation)

```python
participants = 500
non_participants = 500
participant_before = 75
participant_after = 80
non_participant_before = 62
non_participant_after = 60
gap_after = participant_after - non_participant_after
gap_before_the_program = participant_before - non_participant_before
participant_change = participant_after - participant_before
non_participant_change = non_participant_after - non_participant_before
effect_by_change_from_baseline = participant_change - non_participant_change
self_selection_share_per_myriad = int(gap_before_the_program * 10000 / gap_after)
print("participants                    : " + str(participants))
print("non-participants                : " + str(non_participants))
print("")
print("participant health   before / after : " + str(participant_before) + " / " + str(participant_after))
print("non-participant       before / after : " + str(non_participant_before) + " / " + str(non_participant_after))
print("")
print("gap after the program           : " + str(gap_after))
print("gap before the program          : " + str(gap_before_the_program))
print("effect by change-from-baseline  : " + str(effect_by_change_from_baseline))
print("pre-existing share of the gap   : " + str(self_selection_share_per_myriad) + " per ten thousand")
print("")
print("the health comparison")
print("  reads : real recorded health scores, not self-reports")
print("  covers : every employee")
print("  comparison : the honest difference of group means")
print("  intent : does the program improve health")
print("  employees omitted : 0")
print("  verdict : PARTICIPANTS ARE 20 POINTS HEALTHIER")
print("")
print("  reading real scores over every employee is the part done")
print("  right here, and it is why the 20-point after-gap is a")
print("  true difference between the two groups")
print("")
print("how the groups were formed")
print("  the rule : each employee chose whether to join")
print("  who chooses to join : the already health-conscious")
print("  so at baseline the joiners were : 13 points healthier")
print("    already, before any program")
print("  what the after-gap contains : that pre-existing 13 plus")
print("    whatever the program did")
print("  what a cross-section cannot separate : the effect from")
print("    who selected in")
print("")
print("the conclusion drawn")
print("  program makes people : 20 points healthier")
print("  gap that predated the program : " + str(gap_before_the_program))
print("  effect once each group is measured against itself : " + str(effect_by_change_from_baseline))
print("  are the scores wrong : no; they are exact")
print("  is 20 the program's effect : no; " + str(self_selection_share_per_myriad) + " per ten")
print("    thousand of it was there before the program")
print("")
nc_gap_by_raw_cross_section = 20
nc_effect_by_change_from_baseline = 7
nc_baseline_gap_the_matching_removes = 13
print("null control - compare change-from-baseline, not the after-cross-section")
print("  gap by raw after-cross-section : " + str(nc_gap_by_raw_cross_section))
print("  effect by change-from-baseline : " + str(nc_effect_by_change_from_baseline))
print("  baseline gap the matching removes : " + str(nc_baseline_gap_the_matching_removes))
print("  no employee and no score changed; the 20 stopped being")
print("  read as an effect and started being read against where")
print("  each group began")
print("")
print("what a participant-vs-non-participant comparison guarantees")
print("  the two groups differ by the measured amount now : exactly,")
print("    real scores, every employee, honest difference")
print("  the program caused the difference : not addressed;")
print("    joining was voluntary and the health-conscious joined,")
print("    so the groups differed by " + str(gap_before_the_program) + " at baseline - change-from-")
print("    baseline leaves the program only " + str(effect_by_change_from_baseline) + " of the " + str(gap_after))
print("")
print("when the treated choose themselves, the groups differ before the treatment does")
print("anything, and a comparison taken only afterward measures who opted in as much as")
print("what they opted into; the baseline gap is charged to the program that did not")
print("open it")
print("")
print("It reads real scores over every employee with an honest group difference - the")
print("20-point gap is true. But joining was voluntary and the health-conscious joined,")
print("so the groups differed by " + str(gap_before_the_program) + " at baseline; change-from-baseline leaves " + str(effect_by_change_from_baseline) + " for")
print("the program, " + str(self_selection_share_per_myriad) + " per ten thousand of the gap predating it.")
```

## stdout (executed)

```text
participants                    : 500
non-participants                : 500

participant health   before / after : 75 / 80
non-participant       before / after : 62 / 60

gap after the program           : 20
gap before the program          : 13
effect by change-from-baseline  : 7
pre-existing share of the gap   : 6500 per ten thousand

the health comparison
  reads : real recorded health scores, not self-reports
  covers : every employee
  comparison : the honest difference of group means
  intent : does the program improve health
  employees omitted : 0
  verdict : PARTICIPANTS ARE 20 POINTS HEALTHIER

  reading real scores over every employee is the part done
  right here, and it is why the 20-point after-gap is a
  true difference between the two groups

how the groups were formed
  the rule : each employee chose whether to join
  who chooses to join : the already health-conscious
  so at baseline the joiners were : 13 points healthier
    already, before any program
  what the after-gap contains : that pre-existing 13 plus
    whatever the program did
  what a cross-section cannot separate : the effect from
    who selected in

the conclusion drawn
  program makes people : 20 points healthier
  gap that predated the program : 13
  effect once each group is measured against itself : 7
  are the scores wrong : no; they are exact
  is 20 the program's effect : no; 6500 per ten
    thousand of it was there before the program

null control - compare change-from-baseline, not the after-cross-section
  gap by raw after-cross-section : 20
  effect by change-from-baseline : 7
  baseline gap the matching removes : 13
  no employee and no score changed; the 20 stopped being
  read as an effect and started being read against where
  each group began

what a participant-vs-non-participant comparison guarantees
  the two groups differ by the measured amount now : exactly,
    real scores, every employee, honest difference
  the program caused the difference : not addressed;
    joining was voluntary and the health-conscious joined,
    so the groups differed by 13 at baseline - change-from-
    baseline leaves the program only 7 of the 20

when the treated choose themselves, the groups differ before the treatment does
anything, and a comparison taken only afterward measures who opted in as much as
what they opted into; the baseline gap is charged to the program that did not
open it

It reads real scores over every employee with an honest group difference - the
20-point gap is true. But joining was voluntary and the health-conscious joined,
so the groups differed by 13 at baseline; change-from-baseline leaves 7 for
the program, 6500 per ten thousand of the gap predating it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
