<!-- canonical: efficientnewlanguage.org/ai/examples/684-the-schema-was-strict-and-the-defaults-filled-it-in | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 684 — The schema was strict and the defaults filled it in

`the_schema_was_strict_and_the_defaults_filled_it_in.eml` - The configuration is validated against a strict schema and has never failed validation. How much of it anybody chose is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The configuration
# is validated against a strict schema and has never failed validation. How much
# of it anybody chose is computed below.
#
# The schema is strict in the ways that matter. Unknown keys are rejected rather
# than ignored, so a typo does not silently do nothing; types are enforced;
# ranges are bounded; and it has caught seven real mistakes this year, including
# a timeout written in milliseconds where the field is seconds. Refusing to
# start on an invalid config is the right behaviour.
#
# A schema validates what is PRESENT. Forty of the fifty-two keys have defaults
# and are absent from the file, so they are not validated against anything a
# person wrote — they are validated against the value the schema itself supplies.
#
# Three of those defaults changed in a library upgrade, with no diff to review.

52 => keys_in_the_schema
12 => keys_set_in_the_file
0 => validation_failures
7 => real_mistakes_caught_this_year
3 => defaults_that_changed_in_the_upgrade

keys_in_the_schema - keys_set_in_the_file => keys_from_defaults
int(keys_from_defaults * 10000 / keys_in_the_schema) => defaulted_per_myriad

"keys in the schema        : " + str(keys_in_the_schema) ^0
"set in the file           : " + str(keys_set_in_the_file) ^0
"supplied by a default     : " + str(keys_from_defaults) ^0
"share from defaults       : " + str(defaulted_per_myriad) + " per ten thousand" ^0
"validation failures       : " + str(validation_failures) ^0
"" ^0

# ---- what the schema verified ----

"the config validator" ^0
"  unknown keys      : rejected, so a typo cannot be a no-op" ^0
"  types             : enforced" ^0
"  ranges            : bounded" ^0
"  refuses to start on invalid : yes" ^0
"  real mistakes caught this year : " + str(real_mistakes_caught_this_year) ^0
"  verdict           : VALID" ^0
"" ^0
"  one of the seven was a timeout written in milliseconds" ^0
"  for a field measured in seconds; this validator earns" ^0
"  its place" ^0
"" ^0

# ---- what it validated ----

"the two kinds of value" ^0
"  written by a person : " + str(keys_set_in_the_file) + ", validated against the schema" ^0
"  supplied by the schema : " + str(keys_from_defaults) + ", validated against" ^0
"    themselves" ^0
"  the second is always valid : necessarily" ^0
"" ^0
"  'the config is valid' and 'the config was chosen' are" ^0
"  different sentences, and the file is the evidence for" ^0
"  the second" ^0
"" ^0

# ---- what changed without a diff ----

# A library upgrade moved three defaults. The config file is unchanged, the
# validation still passes, and the running system behaves differently.
"the upgrade" ^0
"  lines changed in the config file : 0" ^0
"  defaults that moved              : " + str(defaults_that_changed_in_the_upgrade) ^0
"  effective values that changed    : " + str(defaults_that_changed_in_the_upgrade) ^0
"  validation after the upgrade     : passes" ^0
"  a review that would have shown it : none, there was no" ^0
"    diff to review" ^0
"" ^0

int(defaults_that_changed_in_the_upgrade * 10000 / keys_in_the_schema) => changed_per_myriad
"share of the config that changed silently : " + str(changed_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same schema, with the effective configuration - defaults included -
# written out at startup and committed as a snapshot.
keys_in_the_schema => nc_keys_visible_in_review
0 => nc_values_that_can_change_without_a_diff

"null control - the effective config snapshotted at startup" ^0
"  validation failures : " + str(validation_failures) + ", unchanged" ^0
"  keys visible to a reviewer : " + str(nc_keys_visible_in_review) ^0
"  values that can move without a diff : " + str(nc_values_that_can_change_without_a_diff) ^0
"  the schema did not get stricter; the values it supplies" ^0
"  became as reviewable as the values a person supplies" ^0
"" ^0

# ---- the rule ----

"what a strict schema guarantees" ^0
"  every value present is well formed : exactly" ^0
"  every value in force was decided   : not addressed; a" ^0
"    default is the schema agreeing with itself, and it is" ^0
"    indistinguishable in the result from a choice" ^0
"" ^0
"validation is about a document and configuration is about a" ^0
"running system; the gap between them is every key nobody" ^0
"wrote down, and it is usually most of them" ^0
"" ^0

"The schema is strict and has never failed: unknown keys rejected, types" ^0
"enforced, ranges bounded, " + str(real_mistakes_caught_this_year) + " real mistakes caught this year including a" ^0
"timeout in the wrong unit. " + str(keys_from_defaults) + " of " + str(keys_in_the_schema) + " keys are absent from the file and" ^0
"supplied by the schema - " + str(defaulted_per_myriad) + " per ten thousand - so a library upgrade moved" ^0
str(defaults_that_changed_in_the_upgrade) + " effective values with 0 lines of config diff, and validation still passed." ^0
```

## Python (deterministic transpilation)

```python
keys_in_the_schema = 52
keys_set_in_the_file = 12
validation_failures = 0
real_mistakes_caught_this_year = 7
defaults_that_changed_in_the_upgrade = 3
keys_from_defaults = keys_in_the_schema - keys_set_in_the_file
defaulted_per_myriad = int(keys_from_defaults * 10000 / keys_in_the_schema)
print("keys in the schema        : " + str(keys_in_the_schema))
print("set in the file           : " + str(keys_set_in_the_file))
print("supplied by a default     : " + str(keys_from_defaults))
print("share from defaults       : " + str(defaulted_per_myriad) + " per ten thousand")
print("validation failures       : " + str(validation_failures))
print("")
print("the config validator")
print("  unknown keys      : rejected, so a typo cannot be a no-op")
print("  types             : enforced")
print("  ranges            : bounded")
print("  refuses to start on invalid : yes")
print("  real mistakes caught this year : " + str(real_mistakes_caught_this_year))
print("  verdict           : VALID")
print("")
print("  one of the seven was a timeout written in milliseconds")
print("  for a field measured in seconds; this validator earns")
print("  its place")
print("")
print("the two kinds of value")
print("  written by a person : " + str(keys_set_in_the_file) + ", validated against the schema")
print("  supplied by the schema : " + str(keys_from_defaults) + ", validated against")
print("    themselves")
print("  the second is always valid : necessarily")
print("")
print("  'the config is valid' and 'the config was chosen' are")
print("  different sentences, and the file is the evidence for")
print("  the second")
print("")
print("the upgrade")
print("  lines changed in the config file : 0")
print("  defaults that moved              : " + str(defaults_that_changed_in_the_upgrade))
print("  effective values that changed    : " + str(defaults_that_changed_in_the_upgrade))
print("  validation after the upgrade     : passes")
print("  a review that would have shown it : none, there was no")
print("    diff to review")
print("")
changed_per_myriad = int(defaults_that_changed_in_the_upgrade * 10000 / keys_in_the_schema)
print("share of the config that changed silently : " + str(changed_per_myriad) + " per ten thousand")
print("")
nc_keys_visible_in_review = keys_in_the_schema
nc_values_that_can_change_without_a_diff = 0
print("null control - the effective config snapshotted at startup")
print("  validation failures : " + str(validation_failures) + ", unchanged")
print("  keys visible to a reviewer : " + str(nc_keys_visible_in_review))
print("  values that can move without a diff : " + str(nc_values_that_can_change_without_a_diff))
print("  the schema did not get stricter; the values it supplies")
print("  became as reviewable as the values a person supplies")
print("")
print("what a strict schema guarantees")
print("  every value present is well formed : exactly")
print("  every value in force was decided   : not addressed; a")
print("    default is the schema agreeing with itself, and it is")
print("    indistinguishable in the result from a choice")
print("")
print("validation is about a document and configuration is about a")
print("running system; the gap between them is every key nobody")
print("wrote down, and it is usually most of them")
print("")
print("The schema is strict and has never failed: unknown keys rejected, types")
print("enforced, ranges bounded, " + str(real_mistakes_caught_this_year) + " real mistakes caught this year including a")
print("timeout in the wrong unit. " + str(keys_from_defaults) + " of " + str(keys_in_the_schema) + " keys are absent from the file and")
print("supplied by the schema - " + str(defaulted_per_myriad) + " per ten thousand - so a library upgrade moved")
print(str(defaults_that_changed_in_the_upgrade) + " effective values with 0 lines of config diff, and validation still passed.")
```

## stdout (executed)

```text
keys in the schema        : 52
set in the file           : 12
supplied by a default     : 40
share from defaults       : 7692 per ten thousand
validation failures       : 0

the config validator
  unknown keys      : rejected, so a typo cannot be a no-op
  types             : enforced
  ranges            : bounded
  refuses to start on invalid : yes
  real mistakes caught this year : 7
  verdict           : VALID

  one of the seven was a timeout written in milliseconds
  for a field measured in seconds; this validator earns
  its place

the two kinds of value
  written by a person : 12, validated against the schema
  supplied by the schema : 40, validated against
    themselves
  the second is always valid : necessarily

  'the config is valid' and 'the config was chosen' are
  different sentences, and the file is the evidence for
  the second

the upgrade
  lines changed in the config file : 0
  defaults that moved              : 3
  effective values that changed    : 3
  validation after the upgrade     : passes
  a review that would have shown it : none, there was no
    diff to review

share of the config that changed silently : 576 per ten thousand

null control - the effective config snapshotted at startup
  validation failures : 0, unchanged
  keys visible to a reviewer : 52
  values that can move without a diff : 0
  the schema did not get stricter; the values it supplies
  became as reviewable as the values a person supplies

what a strict schema guarantees
  every value present is well formed : exactly
  every value in force was decided   : not addressed; a
    default is the schema agreeing with itself, and it is
    indistinguishable in the result from a choice

validation is about a document and configuration is about a
running system; the gap between them is every key nobody
wrote down, and it is usually most of them

The schema is strict and has never failed: unknown keys rejected, types
enforced, ranges bounded, 7 real mistakes caught this year including a
timeout in the wrong unit. 40 of 52 keys are absent from the file and
supplied by the schema - 7692 per ten thousand - so a library upgrade moved
3 effective values with 0 lines of config diff, and validation still passed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
