<!-- canonical: efficientnewlanguage.org/ai/examples/584-the-config-was-validated-at-startup-and-edited-at-runtime | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 584 — The config was validated at startup and edited at runtime

`the_config_was_validated_at_startup_and_edited_at_runtime.eml` - The configuration is validated on load: every field is type-checked, every range is bounded, every reference is resolved. How many of the month's config changes go through that validation is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The configuration
# is validated on load: every field is type-checked, every range is bounded,
# every reference is resolved. How many of the month's config changes go through
# that validation is computed below.
#
# The validator is thorough and it was written for the right reason. A bad
# config used to take the fleet down on deploy, so the team wrote a validator
# that refuses to start rather than start wrong. It checks types, ranges,
# enum membership, cross-field consistency and every reference into the service
# registry. Refusing to boot is the correct response and it has caught real
# mistakes.
#
# Hot reload was added later, for a different and also good reason: a config
# change should not require a restart, because a restart drops connections and
# a rolling restart takes eleven minutes. The reload path re-reads the file and
# swaps the values in.
#
# The validator runs in the startup path. The reload path is a different
# function, written by different people, for a case the validator's author was
# not thinking about.

47 => changes_per_month
44 => changes_via_hot_reload

changes_per_month - changes_via_hot_reload => changes_via_restart

"config changes per month     : " + str(changes_per_month) ^0
"applied by hot reload        : " + str(changes_via_hot_reload) ^0
"applied by restart           : " + str(changes_via_restart) ^0
"" ^0

int(changes_via_restart * 100 / changes_per_month) => validated_pct
int(changes_via_hot_reload * 100 / changes_per_month) => unvalidated_pct

"  changes that pass through the validator : " + str(changes_via_restart) + " (" + str(validated_pct) + " percent)" ^0
"  changes that do not                     : " + str(changes_via_hot_reload) + " (" + str(unvalidated_pct) + " percent)" ^0
"" ^0
"  the validator is correct, complete, and on the path taken " + str(validated_pct) + " percent" ^0
"  of the time" ^0
"" ^0

# ---- why hot reload became the default ----
#
# It is faster and it does not drop connections, so it is the path anyone
# would choose. The validation gap is invisible from the operator's side: both
# paths end with the new value in effect.

11 => restart_minutes

"cost of each path, from the operator's side" ^0
"  restart     : " + str(restart_minutes) + " minutes, connections dropped, validated" ^0
"  hot reload  : under a minute, no disruption, not validated" ^0
"  visible difference in the outcome : none, both end with the value applied" ^0
"  so the faster path wins every time, which is the correct choice given" ^0
"  what the operator can see" ^0
"" ^0

# ---- what the validator would have caught ----

# [field, bad value, what the validator checks, what happens without it]
[["max_connections", "0", "range 1..4096", "pool refuses every checkout"], ["timeout_ms", "-1", "positive integer", "every call times out immediately"], ["region", "eu-wets", "enum membership", "no endpoint resolves"], ["retry_limit", "9999", "range 0..10", "one failure becomes 9999 calls"]] => bad_values

"values the validator rejects, and what they do if applied without it" ^0
0 => catchable
for b in bad_values:
    catchable + 1 => catchable
    "  " + b[0] + " = " + b[1] ^0
    "      validator : " + b[2] ^0
    "      unvalidated: " + b[3] ^0
"  values in this list : " + str(catchable) + ", every one caught at startup and none on reload" ^0
"" ^0

# ---- the window ----
#
# A bad value applied by reload takes effect immediately, on every instance,
# with no canary and no rollback step. A bad value applied by restart takes
# effect on zero instances, because the first one refuses to boot.

48 => instances

"a bad value, by the path it arrives on" ^0
"  via restart    : instance 1 refuses to boot, rollout halts" ^0
"                   instances affected : 1 of " + str(instances) ^0
"  via hot reload : every instance swaps the value on its next poll" ^0
"                   instances affected : " + str(instances) + " of " + str(instances) ^0
"" ^0
"  the safe path fails on one instance and stops" ^0
"  the fast path succeeds on all of them" ^0
"" ^0

# ---- the control ----
#
# The validator, judged against what it validates. It is complete, it has never
# passed a bad value, and it has genuinely prevented outages. Reviewing it finds
# nothing, because there is nothing in it to find.

"control - is the validator missing any check" ^0
"  fields in the config      : 31" ^0
"  fields the validator checks: 31" ^0
"  checks that are wrong     : 0" ^0
"  bad values it has caught  : real, and it was written after one got through" ^0
"  the validator is not the defect" ^0
"" ^0
"  it is on one of two paths, and the other one carries " + str(unvalidated_pct) + " percent" ^0
"  of the traffic" ^0
"" ^0

# ---- the null control ----
#
# The same validator on a service with no hot reload. Every change goes through
# startup, coverage is complete, and the design is exactly right. The defect
# arrived with a second path, not with the validator.

0 => nc_hot_reload
changes_per_month - nc_hot_reload => nc_validated

"null control - the same validator with no reload path" ^0
"  changes per month            : " + str(changes_per_month) ^0
"  applied by hot reload        : " + str(nc_hot_reload) ^0
"  passing through the validator: " + str(nc_validated) + " (" + str(int(nc_validated * 100 / changes_per_month)) + " percent)" ^0
"  same validator, same checks, same code" ^0
"  adding a second entry point moved coverage from 100 to " + str(validated_pct) + " percent" ^0
"  without editing the validator by one character" ^0
"" ^0

# ---- the rule ----

"a check placed on a path, when a second path appears" ^0
"  is the check correct           yes, and it stays correct" ^0
"  is the check complete          yes, for its own path" ^0
"  what fraction of changes take that path   this is the question" ^0
"  and it is answered by usage data, not by reading the check" ^0
"" ^0
"nothing about adding a reload path looks like weakening validation" ^0
"the person who added it was removing a restart, and they did" ^0
"" ^0

"The validator refuses to boot on a bad value, checks all 31 fields, and was" ^0
"written after a bad config took the fleet down. Hot reload was added to avoid" ^0
"an " + str(restart_minutes) + "-minute rolling restart, which is also right. " + str(changes_via_hot_reload) + " of this month's " + str(changes_per_month) ^0
"changes took the reload path, so " + str(unvalidated_pct) + " percent of configuration reached production" ^0
"without meeting a validator that has never once been wrong." ^0
```

## Python (deterministic transpilation)

```python
changes_per_month = 47
changes_via_hot_reload = 44
changes_via_restart = changes_per_month - changes_via_hot_reload
print("config changes per month     : " + str(changes_per_month))
print("applied by hot reload        : " + str(changes_via_hot_reload))
print("applied by restart           : " + str(changes_via_restart))
print("")
validated_pct = int(changes_via_restart * 100 / changes_per_month)
unvalidated_pct = int(changes_via_hot_reload * 100 / changes_per_month)
print("  changes that pass through the validator : " + str(changes_via_restart) + " (" + str(validated_pct) + " percent)")
print("  changes that do not                     : " + str(changes_via_hot_reload) + " (" + str(unvalidated_pct) + " percent)")
print("")
print("  the validator is correct, complete, and on the path taken " + str(validated_pct) + " percent")
print("  of the time")
print("")
restart_minutes = 11
print("cost of each path, from the operator's side")
print("  restart     : " + str(restart_minutes) + " minutes, connections dropped, validated")
print("  hot reload  : under a minute, no disruption, not validated")
print("  visible difference in the outcome : none, both end with the value applied")
print("  so the faster path wins every time, which is the correct choice given")
print("  what the operator can see")
print("")
bad_values = [["max_connections", "0", "range 1..4096", "pool refuses every checkout"], ["timeout_ms", "-1", "positive integer", "every call times out immediately"], ["region", "eu-wets", "enum membership", "no endpoint resolves"], ["retry_limit", "9999", "range 0..10", "one failure becomes 9999 calls"]]
print("values the validator rejects, and what they do if applied without it")
catchable = 0
for b in bad_values:
    catchable = catchable + 1
    print("  " + b[0] + " = " + b[1])
    print("      validator : " + b[2])
    print("      unvalidated: " + b[3])
print("  values in this list : " + str(catchable) + ", every one caught at startup and none on reload")
print("")
instances = 48
print("a bad value, by the path it arrives on")
print("  via restart    : instance 1 refuses to boot, rollout halts")
print("                   instances affected : 1 of " + str(instances))
print("  via hot reload : every instance swaps the value on its next poll")
print("                   instances affected : " + str(instances) + " of " + str(instances))
print("")
print("  the safe path fails on one instance and stops")
print("  the fast path succeeds on all of them")
print("")
print("control - is the validator missing any check")
print("  fields in the config      : 31")
print("  fields the validator checks: 31")
print("  checks that are wrong     : 0")
print("  bad values it has caught  : real, and it was written after one got through")
print("  the validator is not the defect")
print("")
print("  it is on one of two paths, and the other one carries " + str(unvalidated_pct) + " percent")
print("  of the traffic")
print("")
nc_hot_reload = 0
nc_validated = changes_per_month - nc_hot_reload
print("null control - the same validator with no reload path")
print("  changes per month            : " + str(changes_per_month))
print("  applied by hot reload        : " + str(nc_hot_reload))
print("  passing through the validator: " + str(nc_validated) + " (" + str(int(nc_validated * 100 / changes_per_month)) + " percent)")
print("  same validator, same checks, same code")
print("  adding a second entry point moved coverage from 100 to " + str(validated_pct) + " percent")
print("  without editing the validator by one character")
print("")
print("a check placed on a path, when a second path appears")
print("  is the check correct           yes, and it stays correct")
print("  is the check complete          yes, for its own path")
print("  what fraction of changes take that path   this is the question")
print("  and it is answered by usage data, not by reading the check")
print("")
print("nothing about adding a reload path looks like weakening validation")
print("the person who added it was removing a restart, and they did")
print("")
print("The validator refuses to boot on a bad value, checks all 31 fields, and was")
print("written after a bad config took the fleet down. Hot reload was added to avoid")
print("an " + str(restart_minutes) + "-minute rolling restart, which is also right. " + str(changes_via_hot_reload) + " of this month's " + str(changes_per_month))
print("changes took the reload path, so " + str(unvalidated_pct) + " percent of configuration reached production")
print("without meeting a validator that has never once been wrong.")
```

## stdout (executed)

```text
config changes per month     : 47
applied by hot reload        : 44
applied by restart           : 3

  changes that pass through the validator : 3 (6 percent)
  changes that do not                     : 44 (93 percent)

  the validator is correct, complete, and on the path taken 6 percent
  of the time

cost of each path, from the operator's side
  restart     : 11 minutes, connections dropped, validated
  hot reload  : under a minute, no disruption, not validated
  visible difference in the outcome : none, both end with the value applied
  so the faster path wins every time, which is the correct choice given
  what the operator can see

values the validator rejects, and what they do if applied without it
  max_connections = 0
      validator : range 1..4096
      unvalidated: pool refuses every checkout
  timeout_ms = -1
      validator : positive integer
      unvalidated: every call times out immediately
  region = eu-wets
      validator : enum membership
      unvalidated: no endpoint resolves
  retry_limit = 9999
      validator : range 0..10
      unvalidated: one failure becomes 9999 calls
  values in this list : 4, every one caught at startup and none on reload

a bad value, by the path it arrives on
  via restart    : instance 1 refuses to boot, rollout halts
                   instances affected : 1 of 48
  via hot reload : every instance swaps the value on its next poll
                   instances affected : 48 of 48

  the safe path fails on one instance and stops
  the fast path succeeds on all of them

control - is the validator missing any check
  fields in the config      : 31
  fields the validator checks: 31
  checks that are wrong     : 0
  bad values it has caught  : real, and it was written after one got through
  the validator is not the defect

  it is on one of two paths, and the other one carries 93 percent
  of the traffic

null control - the same validator with no reload path
  changes per month            : 47
  applied by hot reload        : 0
  passing through the validator: 47 (100 percent)
  same validator, same checks, same code
  adding a second entry point moved coverage from 100 to 6 percent
  without editing the validator by one character

a check placed on a path, when a second path appears
  is the check correct           yes, and it stays correct
  is the check complete          yes, for its own path
  what fraction of changes take that path   this is the question
  and it is answered by usage data, not by reading the check

nothing about adding a reload path looks like weakening validation
the person who added it was removing a restart, and they did

The validator refuses to boot on a bad value, checks all 31 fields, and was
written after a bad config took the fleet down. Hot reload was added to avoid
an 11-minute rolling restart, which is also right. 44 of this month's 47
changes took the reload path, so 93 percent of configuration reached production
without meeting a validator that has never once been wrong.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
