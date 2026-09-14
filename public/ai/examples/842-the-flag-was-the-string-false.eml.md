<!-- canonical: efficientnewlanguage.org/ai/examples/842-the-flag-was-the-string-false | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 842 — The flag was the string false

`the_flag_was_the_string_false.eml` - The feature is gated behind a config flag and the gate reads the flag on every request. What the flag's value is is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The feature is
# gated behind a config flag and the gate reads the flag on every request. What
# the flag's value is is computed below.
#
# The gate is careful. It reads the real config value, not a default baked into
# the binary; it reads it fresh each request, not once at boot; the flag is
# present in config, not missing; and the gate is a plain if on that value.
#
# The value arrived from JSON/env as the string "false", and a non-empty string
# is truthy.

2000000 => requests_in_the_window
2000000 => requests_that_saw_the_feature_on
0 => requests_that_saw_the_feature_off
0 => config_reads_that_failed

requests_in_the_window - requests_that_saw_the_feature_on => requests_the_flag_meant_to_gate_off
int(requests_that_saw_the_feature_on * 10000 / requests_in_the_window) => feature_on_share_per_myriad

"requests in the window          : " + str(requests_in_the_window) ^0
"  saw the feature ON            : " + str(requests_that_saw_the_feature_on) ^0
"  saw the feature OFF           : " + str(requests_that_saw_the_feature_off) ^0
"config reads that failed        : " + str(config_reads_that_failed) ^0
"the flag was meant to gate OFF  : " + str(requests_the_flag_meant_to_gate_off) ^0
"feature-on share                : " + str(feature_on_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the gate verified ----

"the feature gate" ^0
"  reads : the real config value, not a baked default" ^0
"  when : fresh on every request, not once at boot" ^0
"  flag present in config : yes, set to false" ^0
"  the gate : a plain if on the value" ^0
"  requests that read stale config : 0" ^0
"  verdict : GATE EVALUATED EVERY REQUEST" ^0
"" ^0
"  reading fresh each request rather than caching at boot" ^0
"  is the part done right here, and it is why a real toggle" ^0
"  would take effect at once" ^0
"" ^0

# ---- what the value is ----

"the flag's value as loaded" ^0
"  what config says : false" ^0
"  how it arrived : as the JSON/env string \"false\"" ^0
"  what the gate tests : if (flag)" ^0
"  what a non-empty string is : truthy" ^0
"  so if (\"false\") : is taken, the feature is ON" ^0
"" ^0

# ---- what the operator intended ----

"the operator who set false" ^0
"  what they meant : the feature is off" ^0
"  what the gate did : turned it on for everyone" ^0
"  requests affected : " + str(requests_that_saw_the_feature_on) ^0
"  is the gate reading the wrong key : no; it reads the" ^0
"    right flag" ^0
"  is the string \"false\" a false value : no; only an empty" ^0
"    string is falsy, and \"false\" is five characters" ^0
"" ^0

# ---- null control ----

# The same config, with the value parsed to a boolean (or compared to the string
# "true") before the gate tests it.
10000 => nc_feature_on_when_string_is_truthy
0 => nc_feature_on_when_parsed_to_boolean
2000000 => nc_requests_correctly_gated_off

"null control - parse the flag to a boolean" ^0
"  feature on, string truthiness : " ^0
"    " + str(nc_feature_on_when_string_is_truthy) + " per ten thousand" ^0
"  feature on, parsed boolean : " + str(nc_feature_on_when_parsed_to_boolean) ^0
"  requests correctly gated off : " + str(nc_requests_correctly_gated_off) ^0
"  no config and no gate location changed; the value" ^0
"  stopped being judged by its length instead of its" ^0
"  meaning" ^0
"" ^0

# ---- the rule ----

"what a fresh-read config gate guarantees" ^0
"  the gate evaluates the current config value each" ^0
"    request : exactly, no stale boot-time cache" ^0
"  the feature is off when the flag is false : not" ^0
"    addressed; the value is the string \"false\" and a" ^0
"    non-empty string is truthy, so if (flag) is taken and" ^0
"    the feature ran ON for all " + str(requests_that_saw_the_feature_on) + " requests" ^0
"" ^0

"a boolean gate needs a boolean, and a string that spells a boolean is not one;" ^0
"'false' as text is truthy because it is non-empty, so the flag reads as its own" ^0
"opposite the moment it is not parsed" ^0
"" ^0

"It reads the real flag fresh on every request with a plain if - the gate ran" ^0
"every time. The value is the string \"false\", which is truthy, so if (flag) was" ^0
"taken and the feature was ON for all " + str(requests_that_saw_the_feature_on) + " requests the flag meant to gate" ^0
"off, " + str(feature_on_share_per_myriad) + " per ten thousand." ^0
```

## Python (deterministic transpilation)

```python
requests_in_the_window = 2000000
requests_that_saw_the_feature_on = 2000000
requests_that_saw_the_feature_off = 0
config_reads_that_failed = 0
requests_the_flag_meant_to_gate_off = requests_in_the_window - requests_that_saw_the_feature_on
feature_on_share_per_myriad = int(requests_that_saw_the_feature_on * 10000 / requests_in_the_window)
print("requests in the window          : " + str(requests_in_the_window))
print("  saw the feature ON            : " + str(requests_that_saw_the_feature_on))
print("  saw the feature OFF           : " + str(requests_that_saw_the_feature_off))
print("config reads that failed        : " + str(config_reads_that_failed))
print("the flag was meant to gate OFF  : " + str(requests_the_flag_meant_to_gate_off))
print("feature-on share                : " + str(feature_on_share_per_myriad) + " per ten thousand")
print("")
print("the feature gate")
print("  reads : the real config value, not a baked default")
print("  when : fresh on every request, not once at boot")
print("  flag present in config : yes, set to false")
print("  the gate : a plain if on the value")
print("  requests that read stale config : 0")
print("  verdict : GATE EVALUATED EVERY REQUEST")
print("")
print("  reading fresh each request rather than caching at boot")
print("  is the part done right here, and it is why a real toggle")
print("  would take effect at once")
print("")
print("the flag's value as loaded")
print("  what config says : false")
print("  how it arrived : as the JSON/env string \"false\"")
print("  what the gate tests : if (flag)")
print("  what a non-empty string is : truthy")
print("  so if (\"false\") : is taken, the feature is ON")
print("")
print("the operator who set false")
print("  what they meant : the feature is off")
print("  what the gate did : turned it on for everyone")
print("  requests affected : " + str(requests_that_saw_the_feature_on))
print("  is the gate reading the wrong key : no; it reads the")
print("    right flag")
print("  is the string \"false\" a false value : no; only an empty")
print("    string is falsy, and \"false\" is five characters")
print("")
nc_feature_on_when_string_is_truthy = 10000
nc_feature_on_when_parsed_to_boolean = 0
nc_requests_correctly_gated_off = 2000000
print("null control - parse the flag to a boolean")
print("  feature on, string truthiness : ")
print("    " + str(nc_feature_on_when_string_is_truthy) + " per ten thousand")
print("  feature on, parsed boolean : " + str(nc_feature_on_when_parsed_to_boolean))
print("  requests correctly gated off : " + str(nc_requests_correctly_gated_off))
print("  no config and no gate location changed; the value")
print("  stopped being judged by its length instead of its")
print("  meaning")
print("")
print("what a fresh-read config gate guarantees")
print("  the gate evaluates the current config value each")
print("    request : exactly, no stale boot-time cache")
print("  the feature is off when the flag is false : not")
print("    addressed; the value is the string \"false\" and a")
print("    non-empty string is truthy, so if (flag) is taken and")
print("    the feature ran ON for all " + str(requests_that_saw_the_feature_on) + " requests")
print("")
print("a boolean gate needs a boolean, and a string that spells a boolean is not one;")
print("'false' as text is truthy because it is non-empty, so the flag reads as its own")
print("opposite the moment it is not parsed")
print("")
print("It reads the real flag fresh on every request with a plain if - the gate ran")
print("every time. The value is the string \"false\", which is truthy, so if (flag) was")
print("taken and the feature was ON for all " + str(requests_that_saw_the_feature_on) + " requests the flag meant to gate")
print("off, " + str(feature_on_share_per_myriad) + " per ten thousand.")
```

## stdout (executed)

```text
requests in the window          : 2000000
  saw the feature ON            : 2000000
  saw the feature OFF           : 0
config reads that failed        : 0
the flag was meant to gate OFF  : 0
feature-on share                : 10000 per ten thousand

the feature gate
  reads : the real config value, not a baked default
  when : fresh on every request, not once at boot
  flag present in config : yes, set to false
  the gate : a plain if on the value
  requests that read stale config : 0
  verdict : GATE EVALUATED EVERY REQUEST

  reading fresh each request rather than caching at boot
  is the part done right here, and it is why a real toggle
  would take effect at once

the flag's value as loaded
  what config says : false
  how it arrived : as the JSON/env string "false"
  what the gate tests : if (flag)
  what a non-empty string is : truthy
  so if ("false") : is taken, the feature is ON

the operator who set false
  what they meant : the feature is off
  what the gate did : turned it on for everyone
  requests affected : 2000000
  is the gate reading the wrong key : no; it reads the
    right flag
  is the string "false" a false value : no; only an empty
    string is falsy, and "false" is five characters

null control - parse the flag to a boolean
  feature on, string truthiness : 
    10000 per ten thousand
  feature on, parsed boolean : 0
  requests correctly gated off : 2000000
  no config and no gate location changed; the value
  stopped being judged by its length instead of its
  meaning

what a fresh-read config gate guarantees
  the gate evaluates the current config value each
    request : exactly, no stale boot-time cache
  the feature is off when the flag is false : not
    addressed; the value is the string "false" and a
    non-empty string is truthy, so if (flag) is taken and
    the feature ran ON for all 2000000 requests

a boolean gate needs a boolean, and a string that spells a boolean is not one;
'false' as text is truthy because it is non-empty, so the flag reads as its own
opposite the moment it is not parsed

It reads the real flag fresh on every request with a plain if - the gate ran
every time. The value is the string "false", which is truthy, so if (flag) was
taken and the feature was ON for all 2000000 requests the flag meant to gate
off, 10000 per ten thousand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
