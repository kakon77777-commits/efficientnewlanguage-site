<!-- canonical: efficientnewlanguage.org/ai/examples/739-the-policy-applied-at-admission-and-the-old-resources-stayed | ai_layer_version: 0.1.0 | updated: 2026-09-07 -->

# Example 739 — The policy applied at admission and the old resources stayed

`the_policy_applied_at_admission_and_the_old_resources_stayed.eml` - A policy engine sits in the admission path, refuses non-compliant resources rather than reporting them, has no exemption mechanism, and has blocked nineteen hundred creations. Which resources it has seen is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A policy engine
# sits in the admission path, refuses non-compliant resources rather than
# reporting them, has no exemption mechanism, and has blocked nineteen hundred
# creations. Which resources it has seen is computed below.
#
# The enforcement is genuine. It is in the admission path rather than a report
# somebody reads on Friday, so a non-compliant resource is not created at all;
# there is no annotation that opts a workload out, so there is no quiet path
# around it; the rules are the ones the security review asked for rather than
# whatever the default bundle contained; and it has refused nineteen hundred
# creations, each of which someone then fixed.
#
# The engine runs on create and update. A resource that predates the policy, and
# has not been touched since, has never been evaluated.
#
# Twenty thousand six hundred of them have not.

1900 => creations_blocked_by_the_policy
0 => exemption_annotations_available
0 => bypasses_of_the_admission_path
24000 => resources_total
3400 => resources_created_or_updated_since_the_policy
0 => scheduled_audits_of_existing_resources
1 => policy_engines_in_the_admission_path

resources_total - resources_created_or_updated_since_the_policy => resources_never_evaluated
int(resources_created_or_updated_since_the_policy * 10000 / resources_total) => evaluated_per_myriad
int(resources_never_evaluated * 10000 / resources_total) => never_evaluated_per_myriad

"policy engines in the admission path : " + str(policy_engines_in_the_admission_path) ^0
"creations blocked               : " + str(creations_blocked_by_the_policy) ^0
"exemption annotations available : " + str(exemption_annotations_available) ^0
"bypasses of the admission path  : " + str(bypasses_of_the_admission_path) ^0
"" ^0
"resources                       : " + str(resources_total) ^0
"  created or updated since      : " + str(resources_created_or_updated_since_the_policy) ^0
"  never evaluated               : " + str(resources_never_evaluated) ^0
"  share evaluated               : " + str(evaluated_per_myriad) + " per ten thousand" ^0
"  share never evaluated         : " + str(never_evaluated_per_myriad) + " per ten thousand" ^0
"scheduled audits of existing resources : " + str(scheduled_audits_of_existing_resources) ^0
"" ^0

# ---- what the engine verified ----

"the policy engine" ^0
"  where it runs : the admission path" ^0
"  on non-compliance : refuses; the resource is not" ^0
"    created" ^0
"  exemption annotation : " + str(exemption_annotations_available) + ", so there is no quiet path" ^0
"    around it" ^0
"  the rules : the ones the security review asked for, not" ^0
"    a default bundle" ^0
"  creations refused : " + str(creations_blocked_by_the_policy) + ", each then fixed" ^0
"  verdict : ENFORCED AT THE DOOR" ^0
"" ^0
"  refusing rather than reporting, with no exemption, is" ^0
"  what makes this enforcement instead of advice" ^0
"" ^0

# ---- when it runs ----

"the trigger" ^0
"  evaluated on : create and update" ^0
"  a resource created after the policy : evaluated" ^0
"  a resource updated after the policy : evaluated" ^0
"  a resource older than the policy, untouched : never" ^0
"  is that a gap in the rules : no; the rules are correct" ^0
"    and nothing has asked them about these" ^0
"  resources in that state : " + str(resources_never_evaluated) ^0
"" ^0
"  the engine is complete over the events it hooks and the" ^0
"  fleet is a state rather than a stream of events" ^0
"" ^0
# ---- the compliance number ----

"what gets reported" ^0
"  policy violations in production : none" ^0
"  is that figure correct : yes, over what was evaluated" ^0
"  what was evaluated : " + str(resources_created_or_updated_since_the_policy) + " of " + str(resources_total) ^0
"  what a reader hears : the fleet is compliant" ^0
"  what is claimed : nothing non-compliant was admitted" ^0
"  the difference : " + str(resources_never_evaluated) + " resources" ^0
"" ^0

# ---- the untouched ones are the old ones ----

# The resources that have not been created or updated since the policy are, by
# construction, the oldest and least maintained. They are the population most
# likely to violate the rules and the one the mechanism cannot reach.
"which resources are in the gap" ^0
"  selected by : not having changed" ^0
"  therefore : the oldest, and the least maintained" ^0
"  likelihood of violating the rules : higher than the" ^0
"    evaluated set, not lower" ^0
"  what would bring one in : any edit at all" ^0
"  what discourages editing them : they work, and nobody" ^0
"    owns them" ^0
"" ^0

# ---- what a migration would reveal ----

"the day one of them is edited" ^0
"  the edit : something small and unrelated" ^0
"  what admission does : evaluates the whole resource" ^0
"  likely outcome : refused" ^0
"  what the engineer sees : a policy failure on a change" ^0
"    that did not cause it" ^0
"  when the violation began : before the policy existed" ^0
"  when it is discovered : now, by accident" ^0
"" ^0

# ---- null control ----

# The same rules, evaluated on a schedule against every existing resource as
# well as at admission, reporting rather than deleting.
resources_total => nc_resources_evaluated
0 => nc_resources_never_evaluated
1 => nc_scheduled_audits_of_existing_resources

"null control - the same rules run on a schedule too" ^0
"  admission enforcement : unchanged, still refusing" ^0
"  scheduled audits : " + str(nc_scheduled_audits_of_existing_resources) ^0
"  resources evaluated : " + str(nc_resources_evaluated) ^0
"  never evaluated : " + str(nc_resources_never_evaluated) ^0
"  the policy did not change; it stopped being asked only" ^0
"  about things that were changing anyway" ^0
"" ^0

# ---- the rule ----

"what admission-time enforcement guarantees" ^0
"  nothing non-compliant is admitted : exactly, with no" ^0
"    exemption and no bypass, " + str(creations_blocked_by_the_policy) + " times over" ^0
"  nothing non-compliant exists : not addressed; the" ^0
"    engine is bound to an event and existence is not one" ^0
"" ^0
"a control on a transition evaluates whatever crosses it, so" ^0
"its coverage is the change rate rather than the population;" ^0
"the resources it never sees are selected for not changing," ^0
"which is the same thing as being old" ^0
"" ^0

"The engine sits in the admission path, refuses rather than reports, offers" ^0
str(exemption_annotations_available) + " exemption annotations, has " + str(bypasses_of_the_admission_path) + " bypasses, and blocked " + str(creations_blocked_by_the_policy) + " creations that" ^0
"were then fixed. It evaluates on create and update, so " + str(resources_created_or_updated_since_the_policy) + " of " + str(resources_total) + " resources" ^0
"have been seen - " + str(evaluated_per_myriad) + " per ten thousand - and the " + str(resources_never_evaluated) + " that have not," ^0
str(never_evaluated_per_myriad) + " per ten thousand, are the ones nobody has touched, audited by " + str(scheduled_audits_of_existing_resources) + " jobs." ^0
```

## Python (deterministic transpilation)

```python
creations_blocked_by_the_policy = 1900
exemption_annotations_available = 0
bypasses_of_the_admission_path = 0
resources_total = 24000
resources_created_or_updated_since_the_policy = 3400
scheduled_audits_of_existing_resources = 0
policy_engines_in_the_admission_path = 1
resources_never_evaluated = resources_total - resources_created_or_updated_since_the_policy
evaluated_per_myriad = int(resources_created_or_updated_since_the_policy * 10000 / resources_total)
never_evaluated_per_myriad = int(resources_never_evaluated * 10000 / resources_total)
print("policy engines in the admission path : " + str(policy_engines_in_the_admission_path))
print("creations blocked               : " + str(creations_blocked_by_the_policy))
print("exemption annotations available : " + str(exemption_annotations_available))
print("bypasses of the admission path  : " + str(bypasses_of_the_admission_path))
print("")
print("resources                       : " + str(resources_total))
print("  created or updated since      : " + str(resources_created_or_updated_since_the_policy))
print("  never evaluated               : " + str(resources_never_evaluated))
print("  share evaluated               : " + str(evaluated_per_myriad) + " per ten thousand")
print("  share never evaluated         : " + str(never_evaluated_per_myriad) + " per ten thousand")
print("scheduled audits of existing resources : " + str(scheduled_audits_of_existing_resources))
print("")
print("the policy engine")
print("  where it runs : the admission path")
print("  on non-compliance : refuses; the resource is not")
print("    created")
print("  exemption annotation : " + str(exemption_annotations_available) + ", so there is no quiet path")
print("    around it")
print("  the rules : the ones the security review asked for, not")
print("    a default bundle")
print("  creations refused : " + str(creations_blocked_by_the_policy) + ", each then fixed")
print("  verdict : ENFORCED AT THE DOOR")
print("")
print("  refusing rather than reporting, with no exemption, is")
print("  what makes this enforcement instead of advice")
print("")
print("the trigger")
print("  evaluated on : create and update")
print("  a resource created after the policy : evaluated")
print("  a resource updated after the policy : evaluated")
print("  a resource older than the policy, untouched : never")
print("  is that a gap in the rules : no; the rules are correct")
print("    and nothing has asked them about these")
print("  resources in that state : " + str(resources_never_evaluated))
print("")
print("  the engine is complete over the events it hooks and the")
print("  fleet is a state rather than a stream of events")
print("")
print("what gets reported")
print("  policy violations in production : none")
print("  is that figure correct : yes, over what was evaluated")
print("  what was evaluated : " + str(resources_created_or_updated_since_the_policy) + " of " + str(resources_total))
print("  what a reader hears : the fleet is compliant")
print("  what is claimed : nothing non-compliant was admitted")
print("  the difference : " + str(resources_never_evaluated) + " resources")
print("")
print("which resources are in the gap")
print("  selected by : not having changed")
print("  therefore : the oldest, and the least maintained")
print("  likelihood of violating the rules : higher than the")
print("    evaluated set, not lower")
print("  what would bring one in : any edit at all")
print("  what discourages editing them : they work, and nobody")
print("    owns them")
print("")
print("the day one of them is edited")
print("  the edit : something small and unrelated")
print("  what admission does : evaluates the whole resource")
print("  likely outcome : refused")
print("  what the engineer sees : a policy failure on a change")
print("    that did not cause it")
print("  when the violation began : before the policy existed")
print("  when it is discovered : now, by accident")
print("")
nc_resources_evaluated = resources_total
nc_resources_never_evaluated = 0
nc_scheduled_audits_of_existing_resources = 1
print("null control - the same rules run on a schedule too")
print("  admission enforcement : unchanged, still refusing")
print("  scheduled audits : " + str(nc_scheduled_audits_of_existing_resources))
print("  resources evaluated : " + str(nc_resources_evaluated))
print("  never evaluated : " + str(nc_resources_never_evaluated))
print("  the policy did not change; it stopped being asked only")
print("  about things that were changing anyway")
print("")
print("what admission-time enforcement guarantees")
print("  nothing non-compliant is admitted : exactly, with no")
print("    exemption and no bypass, " + str(creations_blocked_by_the_policy) + " times over")
print("  nothing non-compliant exists : not addressed; the")
print("    engine is bound to an event and existence is not one")
print("")
print("a control on a transition evaluates whatever crosses it, so")
print("its coverage is the change rate rather than the population;")
print("the resources it never sees are selected for not changing,")
print("which is the same thing as being old")
print("")
print("The engine sits in the admission path, refuses rather than reports, offers")
print(str(exemption_annotations_available) + " exemption annotations, has " + str(bypasses_of_the_admission_path) + " bypasses, and blocked " + str(creations_blocked_by_the_policy) + " creations that")
print("were then fixed. It evaluates on create and update, so " + str(resources_created_or_updated_since_the_policy) + " of " + str(resources_total) + " resources")
print("have been seen - " + str(evaluated_per_myriad) + " per ten thousand - and the " + str(resources_never_evaluated) + " that have not,")
print(str(never_evaluated_per_myriad) + " per ten thousand, are the ones nobody has touched, audited by " + str(scheduled_audits_of_existing_resources) + " jobs.")
```

## stdout (executed)

```text
policy engines in the admission path : 1
creations blocked               : 1900
exemption annotations available : 0
bypasses of the admission path  : 0

resources                       : 24000
  created or updated since      : 3400
  never evaluated               : 20600
  share evaluated               : 1416 per ten thousand
  share never evaluated         : 8583 per ten thousand
scheduled audits of existing resources : 0

the policy engine
  where it runs : the admission path
  on non-compliance : refuses; the resource is not
    created
  exemption annotation : 0, so there is no quiet path
    around it
  the rules : the ones the security review asked for, not
    a default bundle
  creations refused : 1900, each then fixed
  verdict : ENFORCED AT THE DOOR

  refusing rather than reporting, with no exemption, is
  what makes this enforcement instead of advice

the trigger
  evaluated on : create and update
  a resource created after the policy : evaluated
  a resource updated after the policy : evaluated
  a resource older than the policy, untouched : never
  is that a gap in the rules : no; the rules are correct
    and nothing has asked them about these
  resources in that state : 20600

  the engine is complete over the events it hooks and the
  fleet is a state rather than a stream of events

what gets reported
  policy violations in production : none
  is that figure correct : yes, over what was evaluated
  what was evaluated : 3400 of 24000
  what a reader hears : the fleet is compliant
  what is claimed : nothing non-compliant was admitted
  the difference : 20600 resources

which resources are in the gap
  selected by : not having changed
  therefore : the oldest, and the least maintained
  likelihood of violating the rules : higher than the
    evaluated set, not lower
  what would bring one in : any edit at all
  what discourages editing them : they work, and nobody
    owns them

the day one of them is edited
  the edit : something small and unrelated
  what admission does : evaluates the whole resource
  likely outcome : refused
  what the engineer sees : a policy failure on a change
    that did not cause it
  when the violation began : before the policy existed
  when it is discovered : now, by accident

null control - the same rules run on a schedule too
  admission enforcement : unchanged, still refusing
  scheduled audits : 1
  resources evaluated : 24000
  never evaluated : 0
  the policy did not change; it stopped being asked only
  about things that were changing anyway

what admission-time enforcement guarantees
  nothing non-compliant is admitted : exactly, with no
    exemption and no bypass, 1900 times over
  nothing non-compliant exists : not addressed; the
    engine is bound to an event and existence is not one

a control on a transition evaluates whatever crosses it, so
its coverage is the change rate rather than the population;
the resources it never sees are selected for not changing,
which is the same thing as being old

The engine sits in the admission path, refuses rather than reports, offers
0 exemption annotations, has 0 bypasses, and blocked 1900 creations that
were then fixed. It evaluates on create and update, so 3400 of 24000 resources
have been seen - 1416 per ten thousand - and the 20600 that have not,
8583 per ten thousand, are the ones nobody has touched, audited by 0 jobs.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
