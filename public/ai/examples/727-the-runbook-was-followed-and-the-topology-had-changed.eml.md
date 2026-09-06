<!-- canonical: efficientnewlanguage.org/ai/examples/727-the-runbook-was-followed-and-the-topology-had-changed | ai_layer_version: 0.1.0 | updated: 2026-09-06 -->

# Example 727 — The runbook was followed and the topology had changed

`the_runbook_was_followed_and_the_topology_had_changed.eml` - The runbook was written after a real incident, drilled, and used successfully twenty-three times. How much of it still describes the system is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The runbook was
# written after a real incident, drilled, and used successfully twenty-three
# times. How much of it still describes the system is computed below.
#
# It is a good runbook. It was written the week after an outage by the people
# who were on the call, every step names the exact command rather than the
# intent, every step states the output to expect, it is drilled on game days
# instead of being filed, and mean time to recovery went from ninety-four
# minutes to eleven. Twenty-three real uses, all successful.
#
# A runbook is a description of a system. The system was re-architected eight
# months ago; the commands in the runbook are still valid commands, so the
# steps that no longer describe anything still run and still report success.
#
# Nothing has re-read the runbook against the current topology.

14 => runbook_steps
14 => steps_whose_commands_still_execute
9 => steps_that_still_describe_the_system
23 => successful_uses
94 => mttr_before_minutes
11 => mttr_after_minutes
8 => months_since_the_topology_changed
0 => reviews_of_the_runbook_since
2 => game_days_since_the_change
0 => game_days_run_against_the_current_topology

runbook_steps - steps_that_still_describe_the_system => steps_that_describe_the_old_system
mttr_before_minutes - mttr_after_minutes => minutes_the_runbook_saves
int(steps_that_describe_the_old_system * 10000 / runbook_steps) => stale_per_myriad

"runbook steps                   : " + str(runbook_steps) ^0
"  commands that still execute   : " + str(steps_whose_commands_still_execute) ^0
"  that still describe the system: " + str(steps_that_still_describe_the_system) ^0
"  that describe the old one     : " + str(steps_that_describe_the_old_system) ^0
"  share stale                   : " + str(stale_per_myriad) + " per ten thousand" ^0
"" ^0
"successful uses                 : " + str(successful_uses) ^0
"mean time to recovery, before   : " + str(mttr_before_minutes) + " minutes" ^0
"mean time to recovery, after    : " + str(mttr_after_minutes) + " minutes" ^0
"  minutes the runbook saves     : " + str(minutes_the_runbook_saves) ^0
"" ^0
"months since the topology changed : " + str(months_since_the_topology_changed) ^0
"reviews of the runbook since      : " + str(reviews_of_the_runbook_since) ^0
"game days since                   : " + str(game_days_since_the_change) ^0
"  against the current topology    : " + str(game_days_run_against_the_current_topology) ^0
"" ^0

# ---- what the runbook did ----

"the runbook" ^0
"  written by     : the people who were on the call" ^0
"  each step names: the exact command, not the intent" ^0
"  each step states: the output to expect" ^0
"  drilled or filed: drilled" ^0
"  real uses      : " + str(successful_uses) + ", all successful" ^0
"  minutes saved per incident : " + str(minutes_the_runbook_saves) ^0
"  verdict : EFFECTIVE" ^0
"" ^0
"  naming the command instead of the intent is what makes it" ^0
"  usable at three in the morning, and it is the right call" ^0
"" ^0

# ---- what a step is a statement about ----

"one step" ^0
"  what it is  : a command plus an expected output" ^0
"  what it assumes : the thing the command acts on exists" ^0
"    and is the thing that matters" ^0
"  what checks that assumption : the operator, from memory" ^0
"  what happens if it is false : the command runs anyway," ^0
"    because it is a valid command against a real system" ^0
"" ^0
"  naming the exact command is what makes it executable and" ^0
"  is also what lets it execute after it stopped being true" ^0
"" ^0
# ---- what a failing step would look like ----

# A step against something that no longer exists would error, and an error is
# information. These steps address things that do exist: a replica that is
# still there but is no longer the one promoted, a failover that is now
# automatic, a queue that is now one of four.
"the five stale steps" ^0
"  address objects that no longer exist : none of them" ^0
"  address objects that exist and no longer matter : all" ^0
"  therefore they return : success" ^0
"  and the operator reads that as : the step worked" ^0
"  a step that errored would be : better, and none do" ^0
"" ^0

# ---- why the game days pass ----

# Game days run against staging, and staging was cloned before the change and
# has not been re-cloned. The drill is a faithful rehearsal of the runbook
# against the system the runbook was written for.
"the drills" ^0
"  game days since the change : " + str(game_days_since_the_change) ^0
"  run against staging        : both" ^0
"  when staging was cloned    : before the change" ^0
"  run against the current topology : " + str(game_days_run_against_the_current_topology) ^0
"  so the drill result is     : correct, about a system" ^0
"    that is no longer the one on call" ^0
"" ^0

# ---- why the twenty-three uses do not settle it ----

# Nine of fourteen steps are still right, and they are the ones that do the
# work. The incident ends, the operator writes it up as a success, and the five
# steps that did nothing are not distinguishable from the ones that did.
"one successful use" ^0
"  steps run     : " + str(runbook_steps) ^0
"  steps that acted on the right thing : " + str(steps_that_still_describe_the_system) ^0
"  steps that acted on the wrong thing : " + str(steps_that_describe_the_old_system) ^0
"  incident resolved : yes" ^0
"  what the write-up records : the runbook worked" ^0
"  what would separate the two groups : an assertion per" ^0
"    step about the state it expects, which none have" ^0
"" ^0

# ---- null control ----

# The same runbook, with each step asserting its precondition against the live
# system and refusing rather than proceeding when it does not hold.
0 => nc_steps_that_execute_against_the_wrong_thing
steps_that_describe_the_old_system => nc_steps_that_refuse_and_say_why

"null control - every step asserts its own precondition" ^0
"  minutes the runbook saves : " + str(minutes_the_runbook_saves) + ", unchanged" ^0
"  steps executing against the wrong thing : " + str(nc_steps_that_execute_against_the_wrong_thing) ^0
"  steps refusing and naming the mismatch  : " + str(nc_steps_that_refuse_and_say_why) ^0
"  the runbook did not get more accurate; it started" ^0
"  checking the description it depends on" ^0
"" ^0

# ---- the rule ----

"what a drilled runbook guarantees" ^0
"  the steps are executable and were rehearsed : exactly," ^0
"    which is more than most procedures manage" ^0
"  the steps do what they say                  : not" ^0
"    addressed; a command is executable against any system" ^0
"    that has the objects it names" ^0
"" ^0
"a procedure is a description with no reader that can" ^0
"disagree with it; the system it describes changes without" ^0
"consulting it, and the steps that stopped applying are" ^0
"exactly the ones that report success and do nothing" ^0
"" ^0

"The runbook is the good kind: written by the people on the call, naming exact" ^0
"commands and expected outputs, drilled rather than filed, and used " + str(successful_uses) + " times" ^0
"to cut recovery from " + str(mttr_before_minutes) + " minutes to " + str(mttr_after_minutes) + ". It describes a topology that changed" ^0
str(months_since_the_topology_changed) + " months ago and has been reviewed " + str(reviews_of_the_runbook_since) + " times since, so " + str(steps_that_describe_the_old_system) + " of its " + str(runbook_steps) + " steps -" ^0
str(stale_per_myriad) + " per ten thousand - still execute, still succeed, and act on nothing." ^0
```

## Python (deterministic transpilation)

```python
runbook_steps = 14
steps_whose_commands_still_execute = 14
steps_that_still_describe_the_system = 9
successful_uses = 23
mttr_before_minutes = 94
mttr_after_minutes = 11
months_since_the_topology_changed = 8
reviews_of_the_runbook_since = 0
game_days_since_the_change = 2
game_days_run_against_the_current_topology = 0
steps_that_describe_the_old_system = runbook_steps - steps_that_still_describe_the_system
minutes_the_runbook_saves = mttr_before_minutes - mttr_after_minutes
stale_per_myriad = int(steps_that_describe_the_old_system * 10000 / runbook_steps)
print("runbook steps                   : " + str(runbook_steps))
print("  commands that still execute   : " + str(steps_whose_commands_still_execute))
print("  that still describe the system: " + str(steps_that_still_describe_the_system))
print("  that describe the old one     : " + str(steps_that_describe_the_old_system))
print("  share stale                   : " + str(stale_per_myriad) + " per ten thousand")
print("")
print("successful uses                 : " + str(successful_uses))
print("mean time to recovery, before   : " + str(mttr_before_minutes) + " minutes")
print("mean time to recovery, after    : " + str(mttr_after_minutes) + " minutes")
print("  minutes the runbook saves     : " + str(minutes_the_runbook_saves))
print("")
print("months since the topology changed : " + str(months_since_the_topology_changed))
print("reviews of the runbook since      : " + str(reviews_of_the_runbook_since))
print("game days since                   : " + str(game_days_since_the_change))
print("  against the current topology    : " + str(game_days_run_against_the_current_topology))
print("")
print("the runbook")
print("  written by     : the people who were on the call")
print("  each step names: the exact command, not the intent")
print("  each step states: the output to expect")
print("  drilled or filed: drilled")
print("  real uses      : " + str(successful_uses) + ", all successful")
print("  minutes saved per incident : " + str(minutes_the_runbook_saves))
print("  verdict : EFFECTIVE")
print("")
print("  naming the command instead of the intent is what makes it")
print("  usable at three in the morning, and it is the right call")
print("")
print("one step")
print("  what it is  : a command plus an expected output")
print("  what it assumes : the thing the command acts on exists")
print("    and is the thing that matters")
print("  what checks that assumption : the operator, from memory")
print("  what happens if it is false : the command runs anyway,")
print("    because it is a valid command against a real system")
print("")
print("  naming the exact command is what makes it executable and")
print("  is also what lets it execute after it stopped being true")
print("")
print("the five stale steps")
print("  address objects that no longer exist : none of them")
print("  address objects that exist and no longer matter : all")
print("  therefore they return : success")
print("  and the operator reads that as : the step worked")
print("  a step that errored would be : better, and none do")
print("")
print("the drills")
print("  game days since the change : " + str(game_days_since_the_change))
print("  run against staging        : both")
print("  when staging was cloned    : before the change")
print("  run against the current topology : " + str(game_days_run_against_the_current_topology))
print("  so the drill result is     : correct, about a system")
print("    that is no longer the one on call")
print("")
print("one successful use")
print("  steps run     : " + str(runbook_steps))
print("  steps that acted on the right thing : " + str(steps_that_still_describe_the_system))
print("  steps that acted on the wrong thing : " + str(steps_that_describe_the_old_system))
print("  incident resolved : yes")
print("  what the write-up records : the runbook worked")
print("  what would separate the two groups : an assertion per")
print("    step about the state it expects, which none have")
print("")
nc_steps_that_execute_against_the_wrong_thing = 0
nc_steps_that_refuse_and_say_why = steps_that_describe_the_old_system
print("null control - every step asserts its own precondition")
print("  minutes the runbook saves : " + str(minutes_the_runbook_saves) + ", unchanged")
print("  steps executing against the wrong thing : " + str(nc_steps_that_execute_against_the_wrong_thing))
print("  steps refusing and naming the mismatch  : " + str(nc_steps_that_refuse_and_say_why))
print("  the runbook did not get more accurate; it started")
print("  checking the description it depends on")
print("")
print("what a drilled runbook guarantees")
print("  the steps are executable and were rehearsed : exactly,")
print("    which is more than most procedures manage")
print("  the steps do what they say                  : not")
print("    addressed; a command is executable against any system")
print("    that has the objects it names")
print("")
print("a procedure is a description with no reader that can")
print("disagree with it; the system it describes changes without")
print("consulting it, and the steps that stopped applying are")
print("exactly the ones that report success and do nothing")
print("")
print("The runbook is the good kind: written by the people on the call, naming exact")
print("commands and expected outputs, drilled rather than filed, and used " + str(successful_uses) + " times")
print("to cut recovery from " + str(mttr_before_minutes) + " minutes to " + str(mttr_after_minutes) + ". It describes a topology that changed")
print(str(months_since_the_topology_changed) + " months ago and has been reviewed " + str(reviews_of_the_runbook_since) + " times since, so " + str(steps_that_describe_the_old_system) + " of its " + str(runbook_steps) + " steps -")
print(str(stale_per_myriad) + " per ten thousand - still execute, still succeed, and act on nothing.")
```

## stdout (executed)

```text
runbook steps                   : 14
  commands that still execute   : 14
  that still describe the system: 9
  that describe the old one     : 5
  share stale                   : 3571 per ten thousand

successful uses                 : 23
mean time to recovery, before   : 94 minutes
mean time to recovery, after    : 11 minutes
  minutes the runbook saves     : 83

months since the topology changed : 8
reviews of the runbook since      : 0
game days since                   : 2
  against the current topology    : 0

the runbook
  written by     : the people who were on the call
  each step names: the exact command, not the intent
  each step states: the output to expect
  drilled or filed: drilled
  real uses      : 23, all successful
  minutes saved per incident : 83
  verdict : EFFECTIVE

  naming the command instead of the intent is what makes it
  usable at three in the morning, and it is the right call

one step
  what it is  : a command plus an expected output
  what it assumes : the thing the command acts on exists
    and is the thing that matters
  what checks that assumption : the operator, from memory
  what happens if it is false : the command runs anyway,
    because it is a valid command against a real system

  naming the exact command is what makes it executable and
  is also what lets it execute after it stopped being true

the five stale steps
  address objects that no longer exist : none of them
  address objects that exist and no longer matter : all
  therefore they return : success
  and the operator reads that as : the step worked
  a step that errored would be : better, and none do

the drills
  game days since the change : 2
  run against staging        : both
  when staging was cloned    : before the change
  run against the current topology : 0
  so the drill result is     : correct, about a system
    that is no longer the one on call

one successful use
  steps run     : 14
  steps that acted on the right thing : 9
  steps that acted on the wrong thing : 5
  incident resolved : yes
  what the write-up records : the runbook worked
  what would separate the two groups : an assertion per
    step about the state it expects, which none have

null control - every step asserts its own precondition
  minutes the runbook saves : 83, unchanged
  steps executing against the wrong thing : 0
  steps refusing and naming the mismatch  : 5
  the runbook did not get more accurate; it started
  checking the description it depends on

what a drilled runbook guarantees
  the steps are executable and were rehearsed : exactly,
    which is more than most procedures manage
  the steps do what they say                  : not
    addressed; a command is executable against any system
    that has the objects it names

a procedure is a description with no reader that can
disagree with it; the system it describes changes without
consulting it, and the steps that stopped applying are
exactly the ones that report success and do nothing

The runbook is the good kind: written by the people on the call, naming exact
commands and expected outputs, drilled rather than filed, and used 23 times
to cut recovery from 94 minutes to 11. It describes a topology that changed
8 months ago and has been reviewed 0 times since, so 5 of its 14 steps -
3571 per ten thousand - still execute, still succeed, and act on nothing.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
