<!-- canonical: efficientnewlanguage.org/ai/examples/455-the-experiment-ran-inside-the-loop | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 455 — The experiment ran inside the loop

`the_experiment_ran_inside_the_loop.eml` - The A/B test was clean: random assignment, one change, a large sample, a clear result. How much of the measured lift is the treatment is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The A/B test was
# clean: random assignment, one change, a large sample, a clear result. How
# much of the measured lift is the treatment is computed below.
#
# The experiment was run properly. Assignment was random, the groups were
# balanced, the metric was pre-registered and the difference was far outside
# the noise. Everything an experiment is supposed to control for was
# controlled for.
#
# Randomisation makes the two groups alike. It does not make them independent:
# both draw on one cache, one pool and one database, so a treatment that uses
# more of a shared thing leaves less of it for the control. The comparison then
# contains the treatment's gain and the control's loss.
#
# Both terms are computed from the same run.

100 => baseline
1000 => users
500 => in_treatment

12 => treatment_gain
9 => control_loss

baseline - treatment_gain => treated_latency
baseline + control_loss => control_latency
control_latency - treated_latency => measured_lift

"baseline latency, before the experiment : " + str(baseline) ^0
"users : " + str(users) + ", in treatment : " + str(in_treatment) ^0
"" ^0
"during the experiment" ^0
"  treatment group : " + str(treated_latency) ^0
"  control group   : " + str(control_latency) ^0
"  measured lift   : " + str(measured_lift) ^0
"" ^0

"what the lift is made of" ^0
"  the treatment got faster by : " + str(treatment_gain) ^0
"  the control got slower by   : " + str(control_loss) ^0
if measured_lift == treatment_gain + control_loss:
    "  and those two account for the whole of the " + str(measured_lift) ^0
"  the share of the lift that is the control moving : " + str(int(control_loss * 100 / measured_lift)) + "%" ^0
"" ^0

# ---- what the rollout gets ----
#
# At full rollout there is no control group to take capacity from, and the
# shared resource is contended by the treatment itself.

2 => contention_at_full
treatment_gain - contention_at_full => full_gain
baseline - full_gain => rolled_out
"rolling the treatment out to everybody" ^0
"  predicted from the lift : " + str(baseline - measured_lift) ^0
"  actual                  : " + str(rolled_out) ^0
if rolled_out > baseline - measured_lift:
    "  short of the prediction by " + str(rolled_out - baseline + measured_lift) ^0
if rolled_out < baseline:
    "  still an improvement of " + str(baseline - rolled_out) + " on the baseline, which is real" ^0
    "  and is " + str(int((baseline - rolled_out) * 100 / measured_lift)) + "% of what the experiment reported" ^0
"" ^0

# ---- the measurement that would have caught it ----
#
# Not a bigger sample. The control group's own before-and-after, which the
# comparison does not need and therefore nobody looks at.

"the control group against its own history" ^0
"  before the experiment : " + str(baseline) ^0
"  during                : " + str(control_latency) ^0
if control_latency > baseline:
    "  the control moved by " + str(control_latency - baseline) + ", and a control that moves is not a baseline" ^0
"  this comparison needs no extra instrumentation, only the question" ^0
"" ^0

# ---- how big the sample would have to be to fix it ----
#
# It cannot. The bias does not shrink with n, because every extra user is
# assigned to one of two groups that share the same pool.

"the same experiment at ten times the sample" ^0
"  measured lift : " + str(measured_lift) + ", unchanged" ^0
"  the share that is control degradation : " + str(int(control_loss * 100 / measured_lift)) + "%, unchanged" ^0
"  a larger sample narrows the interval around a number that is not the" ^0
"  treatment effect" ^0
"" ^0

# ---- the control: an experiment with nothing shared ----
#
# Where the treatment consumes nothing the control needs, the control does not
# move and the lift is the effect.

0 => iso_loss
baseline + iso_loss => iso_control
baseline - treatment_gain => iso_treated
iso_control - iso_treated => iso_lift
"control - the same treatment with a per-group cache" ^0
"  control group : " + str(iso_control) + ", treatment : " + str(iso_treated) + ", lift : " + str(iso_lift) ^0
if iso_lift == treatment_gain:
    "  the lift equals the gain exactly, and the rollout gets what was measured" ^0
"" ^0

"Randomisation balanced the groups and the difference between them is real." ^0
"It is a difference between two groups drawing on one pool, and only one of" ^0
"the two survives the rollout." ^0
```

## Python (deterministic transpilation)

```python
baseline = 100
users = 1000
in_treatment = 500
treatment_gain = 12
control_loss = 9
treated_latency = baseline - treatment_gain
control_latency = baseline + control_loss
measured_lift = control_latency - treated_latency
print("baseline latency, before the experiment : " + str(baseline))
print("users : " + str(users) + ", in treatment : " + str(in_treatment))
print("")
print("during the experiment")
print("  treatment group : " + str(treated_latency))
print("  control group   : " + str(control_latency))
print("  measured lift   : " + str(measured_lift))
print("")
print("what the lift is made of")
print("  the treatment got faster by : " + str(treatment_gain))
print("  the control got slower by   : " + str(control_loss))
if measured_lift == treatment_gain + control_loss:
    print("  and those two account for the whole of the " + str(measured_lift))
print("  the share of the lift that is the control moving : " + str(int(control_loss * 100 / measured_lift)) + "%")
print("")
contention_at_full = 2
full_gain = treatment_gain - contention_at_full
rolled_out = baseline - full_gain
print("rolling the treatment out to everybody")
print("  predicted from the lift : " + str(baseline - measured_lift))
print("  actual                  : " + str(rolled_out))
if rolled_out > baseline - measured_lift:
    print("  short of the prediction by " + str(rolled_out - baseline + measured_lift))
if rolled_out < baseline:
    print("  still an improvement of " + str(baseline - rolled_out) + " on the baseline, which is real")
    print("  and is " + str(int((baseline - rolled_out) * 100 / measured_lift)) + "% of what the experiment reported")
print("")
print("the control group against its own history")
print("  before the experiment : " + str(baseline))
print("  during                : " + str(control_latency))
if control_latency > baseline:
    print("  the control moved by " + str(control_latency - baseline) + ", and a control that moves is not a baseline")
print("  this comparison needs no extra instrumentation, only the question")
print("")
print("the same experiment at ten times the sample")
print("  measured lift : " + str(measured_lift) + ", unchanged")
print("  the share that is control degradation : " + str(int(control_loss * 100 / measured_lift)) + "%, unchanged")
print("  a larger sample narrows the interval around a number that is not the")
print("  treatment effect")
print("")
iso_loss = 0
iso_control = baseline + iso_loss
iso_treated = baseline - treatment_gain
iso_lift = iso_control - iso_treated
print("control - the same treatment with a per-group cache")
print("  control group : " + str(iso_control) + ", treatment : " + str(iso_treated) + ", lift : " + str(iso_lift))
if iso_lift == treatment_gain:
    print("  the lift equals the gain exactly, and the rollout gets what was measured")
print("")
print("Randomisation balanced the groups and the difference between them is real.")
print("It is a difference between two groups drawing on one pool, and only one of")
print("the two survives the rollout.")
```

## stdout (executed)

```text
baseline latency, before the experiment : 100
users : 1000, in treatment : 500

during the experiment
  treatment group : 88
  control group   : 109
  measured lift   : 21

what the lift is made of
  the treatment got faster by : 12
  the control got slower by   : 9
  and those two account for the whole of the 21
  the share of the lift that is the control moving : 42%

rolling the treatment out to everybody
  predicted from the lift : 79
  actual                  : 90
  short of the prediction by 11
  still an improvement of 10 on the baseline, which is real
  and is 47% of what the experiment reported

the control group against its own history
  before the experiment : 100
  during                : 109
  the control moved by 9, and a control that moves is not a baseline
  this comparison needs no extra instrumentation, only the question

the same experiment at ten times the sample
  measured lift : 21, unchanged
  the share that is control degradation : 42%, unchanged
  a larger sample narrows the interval around a number that is not the
  treatment effect

control - the same treatment with a per-group cache
  control group : 100, treatment : 88, lift : 12
  the lift equals the gain exactly, and the rollout gets what was measured

Randomisation balanced the groups and the difference between them is real.
It is a difference between two groups drawing on one pool, and only one of
the two survives the rollout.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
