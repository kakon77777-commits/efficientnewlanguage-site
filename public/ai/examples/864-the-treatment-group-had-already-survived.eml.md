<!-- canonical: efficientnewlanguage.org/ai/examples/864-the-treatment-group-had-already-survived | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 864 — The treatment group had already survived

`the_treatment_group_had_already_survived.eml` - Patients in a follow-up program lived longer than patients not in it, and the survival times are real and correctly averaged. What defines who is 'in the program' is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Patients in a
# follow-up program lived longer than patients not in it, and the survival times
# are real and correctly averaged. What defines who is 'in the program' is
# computed below.
#
# The measurement is careful. It uses the real recorded death dates, not
# estimates; it covers every patient; the mean survival is the honest average of
# the months lived; and the intent is exactly 'does the program extend life'.
#
# To be counted as a program patient you had to reach the six-month enrollment
# visit, so every early death is filed as not-in-program by definition - the
# program group is guaranteed to have already survived six months.

1000 => patients_total
800 => program_patients
200 => died_before_enrollment
30 => avg_months_program
12 => avg_months_no_program
6 => months_you_had_to_survive_to_enroll
4 => advantage_by_landmark_analysis

avg_months_program - avg_months_no_program => advantage_claimed
advantage_claimed - advantage_by_landmark_analysis => advantage_from_immortal_time
int(advantage_from_immortal_time * 10000 / advantage_claimed) => immortal_time_share_per_myriad

"patients total                  : " + str(patients_total) ^0
"  in the program (survived to enroll) : " + str(program_patients) ^0
"  died before the enrollment visit    : " + str(died_before_enrollment) ^0
"" ^0
"mean months, program            : " + str(avg_months_program) ^0
"mean months, no program         : " + str(avg_months_no_program) ^0
"claimed advantage               : " + str(advantage_claimed) + " months" ^0
"advantage by landmark analysis  : " + str(advantage_by_landmark_analysis) + " months" ^0
"from immortal time              : " + str(immortal_time_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the measurement verified ----

"the survival measurement" ^0
"  uses : real recorded death dates, not estimates" ^0
"  covers : every patient, all " + str(patients_total) ^0
"  mean survival : the honest average of months lived" ^0
"  intent : does the program extend life" ^0
"  patients omitted : 0" ^0
"  verdict : PROGRAM PATIENTS LIVED 18 MONTHS LONGER" ^0
"" ^0
"  using the real death dates over every patient is the" ^0
"  part done right here, and it is why the 18-month gap is a" ^0
"  true difference between the two recorded groups" ^0
"" ^0

# ---- what defines the group ----

"membership in the program group" ^0
"  the rule : attended the six-month enrollment visit" ^0
"  what that visit requires : surviving to month six" ^0
"  where an early death is filed : not-in-program, always" ^0
"  so the program group cannot contain : anyone who died" ^0
"    before month six" ^0
"  the six months it is guaranteed : are counted as program" ^0
"    survival, though no one was treated during them" ^0
"" ^0

# ---- what the caller concluded ----

"the conclusion drawn" ^0
"  program adds : " + str(advantage_claimed) + " months of life" ^0
"  months guaranteed by the entry rule alone : the immortal" ^0
"    time before enrollment" ^0
"  advantage once the clock starts at enrollment : " + str(advantage_by_landmark_analysis) + " months" ^0
"  are the death dates wrong : no; they are exact" ^0
"  is 18 the program's effect : no; " + str(immortal_time_share_per_myriad) + " per ten" ^0
"    thousand of it is time the group had already survived" ^0
"" ^0

# ---- null control ----

# The same patients, with the clock started at enrollment (a landmark analysis),
# or the pre-enrollment months counted as untreated person-time.
18 => nc_advantage_before_the_clock_starts_at_enrollment
4 => nc_advantage_after
200 => nc_early_deaths_no_longer_hidden_in_the_other_arm

"null control - start the clock at enrollment" ^0
"  advantage, clock at diagnosis : " + str(nc_advantage_before_the_clock_starts_at_enrollment) + " months" ^0
"  advantage, clock at enrollment : " + str(nc_advantage_after) + " months" ^0
"  early deaths no longer credited against no-program : " + str(nc_early_deaths_no_longer_hidden_in_the_other_arm) ^0
"  no patient and no date changed; the guaranteed survival" ^0
"  stopped being counted as a result of the program" ^0
"" ^0

# ---- the rule ----

"what a group-vs-group survival comparison guarantees" ^0
"  each group's mean survival is correct : exactly, real" ^0
"    dates, every patient, honest average" ^0
"  the program caused the difference : not addressed; entry" ^0
"    requires surviving to month six, so the program group" ^0
"    holds no early death and carries six guaranteed months -" ^0
"    a landmark analysis cuts the " + str(advantage_claimed) + " to " + str(advantage_by_landmark_analysis) ^0
"" ^0

"a group defined by having received a treatment is also defined by having lived" ^0
"long enough to receive it; the waiting time cannot contain a death, so it is" ^0
"immortal, and crediting it to the treatment measures survival that was required" ^0
"to enter, not survival that was caused" ^0
"" ^0

"It averages real death dates over every patient - the 18-month gap is true. But" ^0
"program membership requires reaching the six-month visit, so the group has" ^0
"already survived six months and holds no early death; starting the clock at" ^0
"enrollment leaves " + str(advantage_by_landmark_analysis) + " months, " + str(immortal_time_share_per_myriad) + " per ten thousand of the claim being immortal time." ^0
```

## Python (deterministic transpilation)

```python
patients_total = 1000
program_patients = 800
died_before_enrollment = 200
avg_months_program = 30
avg_months_no_program = 12
months_you_had_to_survive_to_enroll = 6
advantage_by_landmark_analysis = 4
advantage_claimed = avg_months_program - avg_months_no_program
advantage_from_immortal_time = advantage_claimed - advantage_by_landmark_analysis
immortal_time_share_per_myriad = int(advantage_from_immortal_time * 10000 / advantage_claimed)
print("patients total                  : " + str(patients_total))
print("  in the program (survived to enroll) : " + str(program_patients))
print("  died before the enrollment visit    : " + str(died_before_enrollment))
print("")
print("mean months, program            : " + str(avg_months_program))
print("mean months, no program         : " + str(avg_months_no_program))
print("claimed advantage               : " + str(advantage_claimed) + " months")
print("advantage by landmark analysis  : " + str(advantage_by_landmark_analysis) + " months")
print("from immortal time              : " + str(immortal_time_share_per_myriad) + " per ten thousand")
print("")
print("the survival measurement")
print("  uses : real recorded death dates, not estimates")
print("  covers : every patient, all " + str(patients_total))
print("  mean survival : the honest average of months lived")
print("  intent : does the program extend life")
print("  patients omitted : 0")
print("  verdict : PROGRAM PATIENTS LIVED 18 MONTHS LONGER")
print("")
print("  using the real death dates over every patient is the")
print("  part done right here, and it is why the 18-month gap is a")
print("  true difference between the two recorded groups")
print("")
print("membership in the program group")
print("  the rule : attended the six-month enrollment visit")
print("  what that visit requires : surviving to month six")
print("  where an early death is filed : not-in-program, always")
print("  so the program group cannot contain : anyone who died")
print("    before month six")
print("  the six months it is guaranteed : are counted as program")
print("    survival, though no one was treated during them")
print("")
print("the conclusion drawn")
print("  program adds : " + str(advantage_claimed) + " months of life")
print("  months guaranteed by the entry rule alone : the immortal")
print("    time before enrollment")
print("  advantage once the clock starts at enrollment : " + str(advantage_by_landmark_analysis) + " months")
print("  are the death dates wrong : no; they are exact")
print("  is 18 the program's effect : no; " + str(immortal_time_share_per_myriad) + " per ten")
print("    thousand of it is time the group had already survived")
print("")
nc_advantage_before_the_clock_starts_at_enrollment = 18
nc_advantage_after = 4
nc_early_deaths_no_longer_hidden_in_the_other_arm = 200
print("null control - start the clock at enrollment")
print("  advantage, clock at diagnosis : " + str(nc_advantage_before_the_clock_starts_at_enrollment) + " months")
print("  advantage, clock at enrollment : " + str(nc_advantage_after) + " months")
print("  early deaths no longer credited against no-program : " + str(nc_early_deaths_no_longer_hidden_in_the_other_arm))
print("  no patient and no date changed; the guaranteed survival")
print("  stopped being counted as a result of the program")
print("")
print("what a group-vs-group survival comparison guarantees")
print("  each group's mean survival is correct : exactly, real")
print("    dates, every patient, honest average")
print("  the program caused the difference : not addressed; entry")
print("    requires surviving to month six, so the program group")
print("    holds no early death and carries six guaranteed months -")
print("    a landmark analysis cuts the " + str(advantage_claimed) + " to " + str(advantage_by_landmark_analysis))
print("")
print("a group defined by having received a treatment is also defined by having lived")
print("long enough to receive it; the waiting time cannot contain a death, so it is")
print("immortal, and crediting it to the treatment measures survival that was required")
print("to enter, not survival that was caused")
print("")
print("It averages real death dates over every patient - the 18-month gap is true. But")
print("program membership requires reaching the six-month visit, so the group has")
print("already survived six months and holds no early death; starting the clock at")
print("enrollment leaves " + str(advantage_by_landmark_analysis) + " months, " + str(immortal_time_share_per_myriad) + " per ten thousand of the claim being immortal time.")
```

## stdout (executed)

```text
patients total                  : 1000
  in the program (survived to enroll) : 800
  died before the enrollment visit    : 200

mean months, program            : 30
mean months, no program         : 12
claimed advantage               : 18 months
advantage by landmark analysis  : 4 months
from immortal time              : 7777 per ten thousand

the survival measurement
  uses : real recorded death dates, not estimates
  covers : every patient, all 1000
  mean survival : the honest average of months lived
  intent : does the program extend life
  patients omitted : 0
  verdict : PROGRAM PATIENTS LIVED 18 MONTHS LONGER

  using the real death dates over every patient is the
  part done right here, and it is why the 18-month gap is a
  true difference between the two recorded groups

membership in the program group
  the rule : attended the six-month enrollment visit
  what that visit requires : surviving to month six
  where an early death is filed : not-in-program, always
  so the program group cannot contain : anyone who died
    before month six
  the six months it is guaranteed : are counted as program
    survival, though no one was treated during them

the conclusion drawn
  program adds : 18 months of life
  months guaranteed by the entry rule alone : the immortal
    time before enrollment
  advantage once the clock starts at enrollment : 4 months
  are the death dates wrong : no; they are exact
  is 18 the program's effect : no; 7777 per ten
    thousand of it is time the group had already survived

null control - start the clock at enrollment
  advantage, clock at diagnosis : 18 months
  advantage, clock at enrollment : 4 months
  early deaths no longer credited against no-program : 200
  no patient and no date changed; the guaranteed survival
  stopped being counted as a result of the program

what a group-vs-group survival comparison guarantees
  each group's mean survival is correct : exactly, real
    dates, every patient, honest average
  the program caused the difference : not addressed; entry
    requires surviving to month six, so the program group
    holds no early death and carries six guaranteed months -
    a landmark analysis cuts the 18 to 4

a group defined by having received a treatment is also defined by having lived
long enough to receive it; the waiting time cannot contain a death, so it is
immortal, and crediting it to the treatment measures survival that was required
to enter, not survival that was caused

It averages real death dates over every patient - the 18-month gap is true. But
program membership requires reaching the six-month visit, so the group has
already survived six months and holds no early death; starting the clock at
enrollment leaves 4 months, 7777 per ten thousand of the claim being immortal time.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
