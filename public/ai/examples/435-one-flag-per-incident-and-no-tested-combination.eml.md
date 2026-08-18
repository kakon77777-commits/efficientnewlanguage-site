<!-- canonical: efficientnewlanguage.org/ai/examples/435-one-flag-per-incident-and-no-tested-combination | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 435 — One flag per incident and no tested combination

`one_flag_per_incident_and_no_tested_combination.eml` - Twelve flags, one per incident, each added by someone who was right. How many live combinations were ever tested is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Twelve flags, one
# per incident, each added by someone who was right. How many live combinations
# were ever tested is computed below.
#
# Every one of these flags is defensible on its own. Each was added during a
# real incident, by a person who needed exactly that switch, and each shipped
# with a test proving it does what it says when it is the only thing turned on.
# Nobody added a flag for fun.
#
# A flag is not a feature, it is a dimension. Twelve of them describe a space,
# and what runs in production is a set of points in that space chosen by
# customers and operators rather than by anyone who tests. The number of points
# is not the number of flags and it is not the size of the space either.
#
# Both are computed here.

# [flag, the incident that produced it, still switched off somewhere]
[["legacy_date_parse", "INC-102", 1], ["skip_dedupe", "INC-118", 1], ["double_write", "INC-131", 1], ["strict_totals", "INC-140", 0], ["retry_on_409", "INC-155", 1], ["shadow_reads", "INC-161", 1], ["old_rounding", "INC-166", 1], ["defer_webhooks", "INC-172", 0], ["wide_timeout", "INC-180", 1], ["bypass_cache", "INC-188", 1], ["v1_error_shape", "INC-195", 1], ["batch_of_one", "INC-203", 0]] => flags

len(flags) => n

# combinations the space allows, computed rather than written
1 => space
for i in [1:n]:
    space * 2 => space

"flags               : " + str(n) ^0
"combinations the flags allow : " + str(space) ^0
"" ^0

# ---- what is actually running ----
#
# The space is a bound and nobody deploys a bound. What matters is the set of
# settings that exist in production today.

# [tenant, how many of the flags it has off]
[["acme", 3], ["borealis", 1], ["cendrex", 4], ["dovetail", 0], ["eastgate", 2], ["finch", 1], ["gable", 5], ["hollis", 2], ["ironwood", 0], ["juniper", 3], ["kestrel", 1], ["lumen", 2], ["mabry", 6], ["norbeck", 1], ["orchard", 0], ["pellham", 2], ["quill", 3], ["ridgeway", 1], ["sable", 4], ["thistle", 2], ["umber", 1], ["vance", 3], ["wexford", 2]] => tenants

len(tenants) => live_settings
7 => tested_combinations

"settings live in production : " + str(live_settings) ^0
"combinations covered by tests : " + str(tested_combinations) ^0
if live_settings > tested_combinations:
    "  live and never tested : " + str(live_settings - tested_combinations) ^0
"  that is the number to act on; " + str(space) + " is a bound nobody deploys" ^0
"" ^0

# ---- what each test actually proves ----

"what the per-flag tests establish" ^0
"  each flag alone, against defaults : " + str(n) + " of " + str(n) ^0
"  any two flags together            : 0" ^0
"  the combination a given tenant runs: only if it is one of the " + str(tested_combinations) ^0
"  a flag proven correct alone is proven correct alone" ^0
"" ^0

# ---- how far from the default the live settings sit ----

0 => furthest
"" => furthest_name
0 => total_off
for t in tenants:
    total_off + t[1] => total_off
    if t[1] > furthest:
        t[1] => furthest
        t[0] => furthest_name
"distance from the default configuration" ^0
"  average flags switched off : " + str(int(total_off * 10 / live_settings)) + " tenths of a flag" ^0
"  the furthest tenant        : " + furthest_name + ", " + str(furthest) + " flags off" ^0
0 => at_default
for t in tenants:
    if t[1] == 0:
        at_default + 1 => at_default
"  tenants running the default: " + str(at_default) + " of " + str(live_settings) ^0
if at_default < live_settings:
    "  so " + str(live_settings - at_default) + " tenants run something the default test path never executes" ^0
"" ^0

# ---- flags whose incident cannot happen any more ----

0 => still_off_somewhere
for f in flags:
    if f[2] == 1:
        still_off_somewhere + 1 => still_off_somewhere
"flags still switched off by at least one tenant : " + str(still_off_somewhere) + " of " + str(n) ^0
"flags nobody has switched off in a year         : " + str(n - still_off_somewhere) ^0
if n - still_off_somewhere > 0:
    "  those " + str(n - still_off_somewhere) + " are removable on the evidence available" ^0
"" ^0

1 => reduced
for i in [1:still_off_somewhere]:
    reduced * 2 => reduced
"space after removing the unused flags : " + str(reduced) ^0
if reduced < space:
    "  down from " + str(space) + ", a factor of " + str(int(space / reduced)) ^0
    "  and the live settings are unchanged at " + str(live_settings) ^0
    "  because removing a flag nobody switched off changes nobody's behaviour" ^0
"" ^0

# ---- the control: a service with one flag ----
#
# With a single dimension the space and the live settings coincide, and testing
# the flag is testing the deployment.

2 => small_space
2 => small_live
"control - a service with one flag" ^0
"  combinations allowed : " + str(small_space) + ", live : " + str(small_live) ^0
if small_space == small_live:
    "  identical, so testing both settings is testing everything that runs" ^0
"" ^0

"Each flag was added by someone who was right, and each is tested alone. What" ^0
"runs is a combination, and no incident ever produced one of those." ^0
```

## Python (deterministic transpilation)

```python
flags = [["legacy_date_parse", "INC-102", 1], ["skip_dedupe", "INC-118", 1], ["double_write", "INC-131", 1], ["strict_totals", "INC-140", 0], ["retry_on_409", "INC-155", 1], ["shadow_reads", "INC-161", 1], ["old_rounding", "INC-166", 1], ["defer_webhooks", "INC-172", 0], ["wide_timeout", "INC-180", 1], ["bypass_cache", "INC-188", 1], ["v1_error_shape", "INC-195", 1], ["batch_of_one", "INC-203", 0]]
n = len(flags)
space = 1
for i in range(1, n+1):
    space = space * 2
print("flags               : " + str(n))
print("combinations the flags allow : " + str(space))
print("")
tenants = [["acme", 3], ["borealis", 1], ["cendrex", 4], ["dovetail", 0], ["eastgate", 2], ["finch", 1], ["gable", 5], ["hollis", 2], ["ironwood", 0], ["juniper", 3], ["kestrel", 1], ["lumen", 2], ["mabry", 6], ["norbeck", 1], ["orchard", 0], ["pellham", 2], ["quill", 3], ["ridgeway", 1], ["sable", 4], ["thistle", 2], ["umber", 1], ["vance", 3], ["wexford", 2]]
live_settings = len(tenants)
tested_combinations = 7
print("settings live in production : " + str(live_settings))
print("combinations covered by tests : " + str(tested_combinations))
if live_settings > tested_combinations:
    print("  live and never tested : " + str(live_settings - tested_combinations))
print("  that is the number to act on; " + str(space) + " is a bound nobody deploys")
print("")
print("what the per-flag tests establish")
print("  each flag alone, against defaults : " + str(n) + " of " + str(n))
print("  any two flags together            : 0")
print("  the combination a given tenant runs: only if it is one of the " + str(tested_combinations))
print("  a flag proven correct alone is proven correct alone")
print("")
furthest = 0
furthest_name = ""
total_off = 0
for t in tenants:
    total_off = total_off + t[1]
    if t[1] > furthest:
        furthest = t[1]
        furthest_name = t[0]
print("distance from the default configuration")
print("  average flags switched off : " + str(int(total_off * 10 / live_settings)) + " tenths of a flag")
print("  the furthest tenant        : " + furthest_name + ", " + str(furthest) + " flags off")
at_default = 0
for t in tenants:
    if t[1] == 0:
        at_default = at_default + 1
print("  tenants running the default: " + str(at_default) + " of " + str(live_settings))
if at_default < live_settings:
    print("  so " + str(live_settings - at_default) + " tenants run something the default test path never executes")
print("")
still_off_somewhere = 0
for f in flags:
    if f[2] == 1:
        still_off_somewhere = still_off_somewhere + 1
print("flags still switched off by at least one tenant : " + str(still_off_somewhere) + " of " + str(n))
print("flags nobody has switched off in a year         : " + str(n - still_off_somewhere))
if n - still_off_somewhere > 0:
    print("  those " + str(n - still_off_somewhere) + " are removable on the evidence available")
print("")
reduced = 1
for i in range(1, still_off_somewhere+1):
    reduced = reduced * 2
print("space after removing the unused flags : " + str(reduced))
if reduced < space:
    print("  down from " + str(space) + ", a factor of " + str(int(space / reduced)))
    print("  and the live settings are unchanged at " + str(live_settings))
    print("  because removing a flag nobody switched off changes nobody's behaviour")
print("")
small_space = 2
small_live = 2
print("control - a service with one flag")
print("  combinations allowed : " + str(small_space) + ", live : " + str(small_live))
if small_space == small_live:
    print("  identical, so testing both settings is testing everything that runs")
print("")
print("Each flag was added by someone who was right, and each is tested alone. What")
print("runs is a combination, and no incident ever produced one of those.")
```

## stdout (executed)

```text
flags               : 12
combinations the flags allow : 4096

settings live in production : 23
combinations covered by tests : 7
  live and never tested : 16
  that is the number to act on; 4096 is a bound nobody deploys

what the per-flag tests establish
  each flag alone, against defaults : 12 of 12
  any two flags together            : 0
  the combination a given tenant runs: only if it is one of the 7
  a flag proven correct alone is proven correct alone

distance from the default configuration
  average flags switched off : 21 tenths of a flag
  the furthest tenant        : mabry, 6 flags off
  tenants running the default: 3 of 23
  so 20 tenants run something the default test path never executes

flags still switched off by at least one tenant : 9 of 12
flags nobody has switched off in a year         : 3
  those 3 are removable on the evidence available

space after removing the unused flags : 512
  down from 4096, a factor of 8
  and the live settings are unchanged at 23
  because removing a flag nobody switched off changes nobody's behaviour

control - a service with one flag
  combinations allowed : 2, live : 2
  identical, so testing both settings is testing everything that runs

Each flag was added by someone who was right, and each is tested alone. What
runs is a combination, and no incident ever produced one of those.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
