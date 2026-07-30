<!-- canonical: efficientnewlanguage.org/ai/examples/158-config-defaults-merge | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 158 — Presence is not truthiness

`config_defaults_merge.eml` layers user settings over defaults, and shows the mistake that makes this harder than it looks.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Layering user
# settings over defaults is a dictionary problem with one subtlety that bites
# people: a key that is PRESENT but set to a falsy value is not the same as a
# key that is ABSENT, and `if config[key]:` cannot tell them apart.
#
# The program below reports both, so the difference is visible:
#
#   "retries" is absent          -> the default applies
#   "verbose" is present, False  -> the user's False must WIN over a True default
#
# Getting that wrong is how a program ends up ignoring someone who explicitly
# turned a feature off. The fix is to ask about PRESENCE with `in`, and only
# then look at the value.

def resolve(defaults, overrides, key):
    if key in overrides:
        return overrides[key]
    return defaults[key]

def source_of(overrides, key):
    if key in overrides:
        return "user"
    return "default"

{"verbose": True, "retries": 3, "timeout": 30, "colour": True} => defaults
{"verbose": False, "timeout": 5} => overrides

("Defaults: " + str(len(defaults)) + " keys, overrides: " + str(len(overrides)) + " keys")^0
""^0

"key       value   from" => header
header^0
"--------- ------- --------" => rule
rule^0
0 => overridden
for key in defaults:
    resolve(defaults, overrides, key) => value
    source_of(overrides, key) => src
    if src == "user":
        overridden + 1 => overridden
    10 - len(key) => pad1
    if pad1 < 1:
        1 => pad1
    str(value) => shown
    8 - len(shown) => pad2
    if pad2 < 1:
        1 => pad2
    (key + " " * pad1 + shown + " " * pad2 + src)^0

""^0
("Overridden: " + str(overridden) + " of " + str(len(defaults)))^0
""^0

# The subtlety, stated directly.
"Presence is not truthiness" => h
h^0
("  \"verbose\" in overrides -> " + str("verbose" in overrides) + ", and its value is " + str(overrides["verbose"]))^0
("  \"retries\" in overrides -> " + str("retries" in overrides))^0
""^0
"A falsy override is still an override. Asking `if overrides[key]:`" => n1
n1^0
"would silently fall back to the default here and re-enable verbose," => n2
n2^0
"which is the opposite of what the user asked for." => n3
n3^0
```

## Python (deterministic transpilation)

```python
def resolve(defaults, overrides, key):
    if key in overrides:
        return overrides[key]
    return defaults[key]

def source_of(overrides, key):
    if key in overrides:
        return "user"
    return "default"

defaults = {"verbose": True, "retries": 3, "timeout": 30, "colour": True}
overrides = {"verbose": False, "timeout": 5}
print("Defaults: " + str(len(defaults)) + " keys, overrides: " + str(len(overrides)) + " keys")
print("")
header = "key       value   from"
print(header)
rule = "--------- ------- --------"
print(rule)
overridden = 0
for key in defaults:
    value = resolve(defaults, overrides, key)
    src = source_of(overrides, key)
    if src == "user":
        overridden = overridden + 1
    pad1 = 10 - len(key)
    if pad1 < 1:
        pad1 = 1
    shown = str(value)
    pad2 = 8 - len(shown)
    if pad2 < 1:
        pad2 = 1
    print(key + " " * pad1 + shown + " " * pad2 + src)
print("")
print("Overridden: " + str(overridden) + " of " + str(len(defaults)))
print("")
h = "Presence is not truthiness"
print(h)
print("  \"verbose\" in overrides -> " + str("verbose" in overrides) + ", and its value is " + str(overrides["verbose"]))
print("  \"retries\" in overrides -> " + str("retries" in overrides))
print("")
n1 = "A falsy override is still an override. Asking `if overrides[key]:`"
print(n1)
n2 = "would silently fall back to the default here and re-enable verbose,"
print(n2)
n3 = "which is the opposite of what the user asked for."
print(n3)
```

## stdout (executed)

```text
Defaults: 4 keys, overrides: 2 keys

key       value   from
--------- ------- --------
verbose   False   user
retries   3       default
timeout   5       user
colour    True    default

Overridden: 2 of 4

Presence is not truthiness
  "verbose" in overrides -> True, and its value is False
  "retries" in overrides -> False

A falsy override is still an override. Asking `if overrides[key]:`
would silently fall back to the default here and re-enable verbose,
which is the opposite of what the user asked for.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
