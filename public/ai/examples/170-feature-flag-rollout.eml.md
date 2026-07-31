<!-- canonical: efficientnewlanguage.org/ai/examples/170-feature-flag-rollout | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 170 — Promotion as a subset question

`feature_flag_rollout.eml` — compares feature flags across environments.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Feature flags per
# environment, answered with set algebra instead of nested conditionals.
#
# "Is this environment ready to be promoted" is a subset test; "what would
# promoting change" is a difference. Both are one line, and the empty cases
# fall out correctly for free - set() <= anything is True, which is the right
# answer for a release with no flags.
#
# Counts and membership are printed rather than the sets themselves: rendering
# a multi-element set exposes an iteration order this interpreter cannot
# reproduce (CPython uses hash order), so it defers instead of guessing.

def ready_to_promote(source, target):
    return source <= target

def would_enable(source, target):
    return source - target

def would_disable(source, target):
    return target - source

def flags_in(known, env):
    "" => shown
    for f in known:
        if f in env:
            if shown == "":
                f => shown
            else:
                shown + ", " + f => shown
    if shown == "":
        "(none)" => shown
    return shown

["dark_mode", "legacy_export", "new_search"] => known

{"dark_mode", "new_search"} => dev
{"dark_mode"} => staging
{"dark_mode", "legacy_export"} => prod

"env      count  flags" => header
header^0
"-------  -----  -------------------------" => rule
rule^0
[["dev", dev], ["staging", staging], ["prod", prod]] => envs
for entry in envs:
    entry[0] => name
    entry[1] => env
    9 - len(name) => pad
    if pad < 1:
        1 => pad
    (name + " " * pad + str(len(env)) + "      " + flags_in(known, env))^0

""^0
"Promoting dev -> prod" => h
h^0
("  would enable : " + flags_in(known, would_enable(dev, prod)))^0
("  would disable: " + flags_in(known, would_disable(dev, prod)))^0
("  is prod already a superset of dev? " + str(ready_to_promote(dev, prod)))^0
""^0

"Promoting staging -> dev (staging is a subset, so nothing is lost)" => h2
h2^0
("  would enable : " + flags_in(known, would_enable(staging, dev)))^0
("  would disable: " + flags_in(known, would_disable(staging, dev)))^0
("  is dev already a superset of staging? " + str(ready_to_promote(staging, dev)))^0
""^0

"dev and prod are NOT comparable" => h3
h3^0
("  dev <= prod: " + str(dev <= prod) + "   prod <= dev: " + str(prod <= dev))^0
("  Each has a flag the other lacks, so neither contains the other.")^0
("  There is no 'more advanced' environment here - only a diff.")^0
""^0

# Intersection, spelled with difference because EML-P has no `&` token.
dev - would_enable(dev, staging) => dev_and_staging
dev_and_staging - would_enable(dev_and_staging, prod) => everywhere
("Enabled in all three environments: " + flags_in(known, everywhere))^0
("An empty flag set promotes into anything: " + str(set() <= prod))^0
```

## Python (deterministic transpilation)

```python
def ready_to_promote(source, target):
    return source <= target

def would_enable(source, target):
    return source - target

def would_disable(source, target):
    return target - source

def flags_in(known, env):
    shown = ""
    for f in known:
        if f in env:
            if shown == "":
                shown = f
            else:
                shown = shown + ", " + f
    if shown == "":
        shown = "(none)"
    return shown

known = ["dark_mode", "legacy_export", "new_search"]
dev = {"dark_mode", "new_search"}
staging = {"dark_mode"}
prod = {"dark_mode", "legacy_export"}
header = "env      count  flags"
print(header)
rule = "-------  -----  -------------------------"
print(rule)
envs = [["dev", dev], ["staging", staging], ["prod", prod]]
for entry in envs:
    name = entry[0]
    env = entry[1]
    pad = 9 - len(name)
    if pad < 1:
        pad = 1
    print(name + " " * pad + str(len(env)) + "      " + flags_in(known, env))
print("")
h = "Promoting dev -> prod"
print(h)
print("  would enable : " + flags_in(known, would_enable(dev, prod)))
print("  would disable: " + flags_in(known, would_disable(dev, prod)))
print("  is prod already a superset of dev? " + str(ready_to_promote(dev, prod)))
print("")
h2 = "Promoting staging -> dev (staging is a subset, so nothing is lost)"
print(h2)
print("  would enable : " + flags_in(known, would_enable(staging, dev)))
print("  would disable: " + flags_in(known, would_disable(staging, dev)))
print("  is dev already a superset of staging? " + str(ready_to_promote(staging, dev)))
print("")
h3 = "dev and prod are NOT comparable"
print(h3)
print("  dev <= prod: " + str(dev <= prod) + "   prod <= dev: " + str(prod <= dev))
print("  Each has a flag the other lacks, so neither contains the other.")
print("  There is no 'more advanced' environment here - only a diff.")
print("")
dev_and_staging = dev - would_enable(dev, staging)
everywhere = dev_and_staging - would_enable(dev_and_staging, prod)
print("Enabled in all three environments: " + flags_in(known, everywhere))
print("An empty flag set promotes into anything: " + str(set() <= prod))
```

## stdout (executed)

```text
env      count  flags
-------  -----  -------------------------
dev      2      dark_mode, new_search
staging  1      dark_mode
prod     2      dark_mode, legacy_export

Promoting dev -> prod
  would enable : new_search
  would disable: legacy_export
  is prod already a superset of dev? False

Promoting staging -> dev (staging is a subset, so nothing is lost)
  would enable : (none)
  would disable: new_search
  is dev already a superset of staging? True

dev and prod are NOT comparable
  dev <= prod: False   prod <= dev: False
  Each has a flag the other lacks, so neither contains the other.
  There is no 'more advanced' environment here - only a diff.

Enabled in all three environments: dark_mode
An empty flag set promotes into anything: True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
