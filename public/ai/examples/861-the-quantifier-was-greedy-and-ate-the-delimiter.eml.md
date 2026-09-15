<!-- canonical: efficientnewlanguage.org/ai/examples/861-the-quantifier-was-greedy-and-ate-the-delimiter | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 861 — The quantifier was greedy and ate the delimiter

`the_quantifier_was_greedy_and_ate_the_delimiter.eml` - A parser extracts the first quoted field from each record, and it uses the regex engine correctly on every record. What the quantifier does at the delimiter is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A parser extracts
# the first quoted field from each record, and it uses the regex engine correctly
# on every record. What the quantifier does at the delimiter is computed below.
#
# The parse is careful. It reads the real record line, not a preview; it uses the
# engine's own regex, not a hand-split; it runs on every record; and the intent is
# exactly 'capture the first quoted field'.
#
# The pattern is "(.*)", and .* is greedy, so it matches as much as it can and
# runs to the last quote on the line, swallowing every delimiter in between.

500000 => records
100000 => records_with_one_quoted_field
400000 => records_with_several_quoted_fields

records_with_one_quoted_field => first_field_correct_greedy
records => first_field_correct_lazy
first_field_correct_lazy - first_field_correct_greedy => wrongly_captured
int(wrongly_captured * 10000 / records) => wrongly_captured_share_per_myriad

"records                         : " + str(records) ^0
"  with one quoted field         : " + str(records_with_one_quoted_field) ^0
"  with several quoted fields    : " + str(records_with_several_quoted_fields) ^0
"" ^0
"first field correct, greedy .*  : " + str(first_field_correct_greedy) ^0
"first field correct, lazy .*?   : " + str(first_field_correct_lazy) ^0
"wrongly captured                : " + str(wrongly_captured) ^0
"wrongly captured                : " + str(wrongly_captured_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the parse verified ----

"the field extractor" ^0
"  reads : the real record line, not a preview" ^0
"  uses : the engine's own regex, not a hand-split" ^0
"  runs on : every record" ^0
"  intent : capture the first quoted field" ^0
"  records skipped : 0" ^0
"  verdict : EVERY RECORD PRODUCED A CAPTURE" ^0
"" ^0
"  using the engine's regex over every real record is the" ^0
"  part done right here, and it is why a single-field record" ^0
"  is captured exactly" ^0
"" ^0

# ---- what the quantifier does ----

"the capture \"(.*)\"" ^0
"  what .* is : greedy, matches as much as possible" ^0
"  where it stops : at the last quote on the line, not the" ^0
"    first closing one" ^0
"  a line like \"alice\",\"bob\" : the capture is alice\",\"bob" ^0
"  so on one field : correct; on several : spans them all" ^0
"  did it fail to match : no; it matched too much" ^0
"" ^0

# ---- what the caller got ----

"the result of the extraction" ^0
"  records where greedy equals intended : " + str(first_field_correct_greedy) + ", the single-" ^0
"    field ones" ^0
"  records where it over-captured : " + str(wrongly_captured) ^0
"  is the pattern wrong : no; .* legitimately matches quotes" ^0
"    and commas too" ^0
"  did any record error : no; every one produced a capture," ^0
"    which is why the over-capture was silent" ^0
"" ^0

# ---- null control ----

# The same pattern, made lazy ("(.*?)") or given a negated class ("([^"]*)"), so
# the capture stops at the first closing quote.
400000 => nc_over_captured_greedy
0 => nc_over_captured_lazy
400000 => nc_records_the_lazy_form_fixes

"null control - make the quantifier lazy, \"(.*?)\"" ^0
"  over-captured, greedy : " + str(nc_over_captured_greedy) ^0
"  over-captured, lazy : " + str(nc_over_captured_lazy) ^0
"  records the lazy form fixes : " + str(nc_records_the_lazy_form_fixes) ^0
"  no record and no pattern anchor changed; the match" ^0
"  stopped running to the last quote and stopped at the" ^0
"  first closing one" ^0
"" ^0

# ---- the rule ----

"what a \"(.*)\" capture guarantees" ^0
"  it captures text between a quote and a later quote :" ^0
"    exactly, the engine's own match over every record" ^0
"  it captures the first quoted field : not addressed; .* is" ^0
"    greedy and runs to the last quote, so on the " + str(records_with_several_quoted_fields) ^0
"    multi-field records the capture spans every field" ^0
"" ^0

"a greedy quantifier takes the longest match its pattern still allows, and a" ^0
"delimiter it is not told to avoid is just more that it can take; the field" ^0
"boundary is invisible to a match that was never asked to stop at it" ^0
"" ^0

"It runs the engine's regex over every record - a single-field line is captured" ^0
"exactly. But .* is greedy and runs to the last quote, so on " + str(records_with_several_quoted_fields) ^0
"multi-field records the first capture spans them all; " + str(wrongly_captured) + " were over-captured," ^0
"" + str(wrongly_captured_share_per_myriad) + " per ten thousand, until the quantifier was made lazy." ^0
```

## Python (deterministic transpilation)

```python
records = 500000
records_with_one_quoted_field = 100000
records_with_several_quoted_fields = 400000
first_field_correct_greedy = records_with_one_quoted_field
first_field_correct_lazy = records
wrongly_captured = first_field_correct_lazy - first_field_correct_greedy
wrongly_captured_share_per_myriad = int(wrongly_captured * 10000 / records)
print("records                         : " + str(records))
print("  with one quoted field         : " + str(records_with_one_quoted_field))
print("  with several quoted fields    : " + str(records_with_several_quoted_fields))
print("")
print("first field correct, greedy .*  : " + str(first_field_correct_greedy))
print("first field correct, lazy .*?   : " + str(first_field_correct_lazy))
print("wrongly captured                : " + str(wrongly_captured))
print("wrongly captured                : " + str(wrongly_captured_share_per_myriad) + " per ten thousand")
print("")
print("the field extractor")
print("  reads : the real record line, not a preview")
print("  uses : the engine's own regex, not a hand-split")
print("  runs on : every record")
print("  intent : capture the first quoted field")
print("  records skipped : 0")
print("  verdict : EVERY RECORD PRODUCED A CAPTURE")
print("")
print("  using the engine's regex over every real record is the")
print("  part done right here, and it is why a single-field record")
print("  is captured exactly")
print("")
print("the capture \"(.*)\"")
print("  what .* is : greedy, matches as much as possible")
print("  where it stops : at the last quote on the line, not the")
print("    first closing one")
print("  a line like \"alice\",\"bob\" : the capture is alice\",\"bob")
print("  so on one field : correct; on several : spans them all")
print("  did it fail to match : no; it matched too much")
print("")
print("the result of the extraction")
print("  records where greedy equals intended : " + str(first_field_correct_greedy) + ", the single-")
print("    field ones")
print("  records where it over-captured : " + str(wrongly_captured))
print("  is the pattern wrong : no; .* legitimately matches quotes")
print("    and commas too")
print("  did any record error : no; every one produced a capture,")
print("    which is why the over-capture was silent")
print("")
nc_over_captured_greedy = 400000
nc_over_captured_lazy = 0
nc_records_the_lazy_form_fixes = 400000
print("null control - make the quantifier lazy, \"(.*?)\"")
print("  over-captured, greedy : " + str(nc_over_captured_greedy))
print("  over-captured, lazy : " + str(nc_over_captured_lazy))
print("  records the lazy form fixes : " + str(nc_records_the_lazy_form_fixes))
print("  no record and no pattern anchor changed; the match")
print("  stopped running to the last quote and stopped at the")
print("  first closing one")
print("")
print("what a \"(.*)\" capture guarantees")
print("  it captures text between a quote and a later quote :")
print("    exactly, the engine's own match over every record")
print("  it captures the first quoted field : not addressed; .* is")
print("    greedy and runs to the last quote, so on the " + str(records_with_several_quoted_fields))
print("    multi-field records the capture spans every field")
print("")
print("a greedy quantifier takes the longest match its pattern still allows, and a")
print("delimiter it is not told to avoid is just more that it can take; the field")
print("boundary is invisible to a match that was never asked to stop at it")
print("")
print("It runs the engine's regex over every record - a single-field line is captured")
print("exactly. But .* is greedy and runs to the last quote, so on " + str(records_with_several_quoted_fields))
print("multi-field records the first capture spans them all; " + str(wrongly_captured) + " were over-captured,")
print("" + str(wrongly_captured_share_per_myriad) + " per ten thousand, until the quantifier was made lazy.")
```

## stdout (executed)

```text
records                         : 500000
  with one quoted field         : 100000
  with several quoted fields    : 400000

first field correct, greedy .*  : 100000
first field correct, lazy .*?   : 500000
wrongly captured                : 400000
wrongly captured                : 8000 per ten thousand

the field extractor
  reads : the real record line, not a preview
  uses : the engine's own regex, not a hand-split
  runs on : every record
  intent : capture the first quoted field
  records skipped : 0
  verdict : EVERY RECORD PRODUCED A CAPTURE

  using the engine's regex over every real record is the
  part done right here, and it is why a single-field record
  is captured exactly

the capture "(.*)"
  what .* is : greedy, matches as much as possible
  where it stops : at the last quote on the line, not the
    first closing one
  a line like "alice","bob" : the capture is alice","bob
  so on one field : correct; on several : spans them all
  did it fail to match : no; it matched too much

the result of the extraction
  records where greedy equals intended : 100000, the single-
    field ones
  records where it over-captured : 400000
  is the pattern wrong : no; .* legitimately matches quotes
    and commas too
  did any record error : no; every one produced a capture,
    which is why the over-capture was silent

null control - make the quantifier lazy, "(.*?)"
  over-captured, greedy : 400000
  over-captured, lazy : 0
  records the lazy form fixes : 400000
  no record and no pattern anchor changed; the match
  stopped running to the last quote and stopped at the
  first closing one

what a "(.*)" capture guarantees
  it captures text between a quote and a later quote :
    exactly, the engine's own match over every record
  it captures the first quoted field : not addressed; .* is
    greedy and runs to the last quote, so on the 400000
    multi-field records the capture spans every field

a greedy quantifier takes the longest match its pattern still allows, and a
delimiter it is not told to avoid is just more that it can take; the field
boundary is invisible to a match that was never asked to stop at it

It runs the engine's regex over every record - a single-field line is captured
exactly. But .* is greedy and runs to the last quote, so on 400000
multi-field records the first capture spans them all; 400000 were over-captured,
8000 per ten thousand, until the quantifier was made lazy.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
