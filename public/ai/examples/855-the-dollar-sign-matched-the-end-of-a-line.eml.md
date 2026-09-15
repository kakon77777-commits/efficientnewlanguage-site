<!-- canonical: efficientnewlanguage.org/ai/examples/855-the-dollar-sign-matched-the-end-of-a-line | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 855 — The dollar sign matched the end of a line

`the_dollar_sign_matched_the_end_of_a_line.eml` - A validator checks that a field is digits and nothing else, and it uses the regex engine correctly on every submission. What the end-anchor matches is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A validator checks
# that a field is digits and nothing else, and it uses the regex engine correctly
# on every submission. What the end-anchor matches is computed below.
#
# The check is careful. It applies the pattern to the real submitted bytes, not a
# stripped copy; it uses the engine's own regex; it runs on every submission; and
# the intent is exactly 'the value is digits, nothing else'.
#
# The pattern is ^\d+$, and in default mode $ matches at the end of the string OR
# just before a trailing newline, so a value of digits followed by a line feed
# still matches.

2000000 => submissions
1999000 => digits_only
1000 => digits_then_a_trailing_newline

digits_only + digits_then_a_trailing_newline => accepted_by_dollar
digits_only => accepted_by_end_of_string_anchor
accepted_by_dollar - accepted_by_end_of_string_anchor => wrongly_accepted
int(digits_then_a_trailing_newline * 10000 / digits_then_a_trailing_newline) => trailing_newline_accepted_per_myriad

"submissions                     : " + str(submissions) ^0
"  digits only                   : " + str(digits_only) ^0
"  digits then a trailing newline : " + str(digits_then_a_trailing_newline) ^0
"" ^0
"accepted by ^\d+$               : " + str(accepted_by_dollar) ^0
"accepted by \A\d+\Z             : " + str(accepted_by_end_of_string_anchor) ^0
"wrongly accepted                : " + str(wrongly_accepted) ^0
"of the newline-bearing, accepted : " + str(trailing_newline_accepted_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the check verified ----

"the digits-only validator" ^0
"  applies to : the real submitted bytes, not a stripped copy" ^0
"  uses : the engine's own regex" ^0
"  runs on : every submission" ^0
"  intent : the value is digits, nothing else" ^0
"  submissions skipped : 0" ^0
"  verdict : EVERY VALUE IS DIGITS FROM START TO $" ^0
"" ^0
"  using the engine's regex over the real bytes of every" ^0
"  submission is the part done right here, and it is why a" ^0
"  genuinely digits-only value always matches" ^0
"" ^0

# ---- what the end-anchor matches ----

"the anchor $ in default mode" ^0
"  where $ matches : the end of the string, OR just before" ^0
"    a newline at the end of it" ^0
"  so ^\d+$ against 123456 then a line feed : matches, the $" ^0
"    lands before the newline" ^0
"  what the value actually is : digits plus a line feed" ^0
"  did the pattern fail : no; it matched, leniently" ^0
"  what rides through : a newline certified as digits-only" ^0
"" ^0

# ---- what the caller got ----

"the result of the digits check" ^0
"  values that should pass : the " + str(digits_only) + " digits-only values" ^0
"  values that passed : all " + str(accepted_by_dollar) + ", newline-bearing included" ^0
"  newline-bearing values wrongly accepted : " + str(wrongly_accepted) ^0
"  is the pattern wrong : no; $ behaves as specified" ^0
"  is a trailing newline 'nothing else' : no; and the" ^0
"    fixtures had no trailing newline, so it never showed" ^0
"" ^0

# ---- null control ----

# The same pattern, anchored to the very end of the string with \Z (\A\d+\Z, or
# a fullmatch that does not treat a trailing newline as the end).
1000 => nc_newline_bearing_accepted_by_dollar
0 => nc_newline_bearing_accepted_by_Z
1000 => nc_values_the_end_of_string_anchor_rejects

"null control - anchor to the very end with \Z" ^0
"  newline-bearing accepted, $ : " + str(nc_newline_bearing_accepted_by_dollar) ^0
"  newline-bearing accepted, \Z : " + str(nc_newline_bearing_accepted_by_Z) ^0
"  values the end-of-string anchor rejects : " + str(nc_values_the_end_of_string_anchor_rejects) ^0
"  no submission and no pattern body changed; the anchor" ^0
"  stopped matching before a trailing newline and started" ^0
"  matching only the true end" ^0
"" ^0

# ---- the rule ----

"what a ^\d+$ check guarantees" ^0
"  the value is digits up to a line boundary : exactly, the" ^0
"    engine's own match over every submission" ^0
"  the value is digits and nothing else : not addressed; $" ^0
"    also matches before a trailing newline, so a digits-" ^0
"    then-newline value passes - all " + str(wrongly_accepted) + " of them did" ^0
"" ^0

"the end of a line is not the end of a string; an anchor that stops before a final" ^0
"newline certifies everything up to the break and says nothing about the break" ^0
"itself, so the one character that turns a value into two lines rides through" ^0
"" ^0

"It runs the engine's regex over the real bytes of every submission - a digits-" ^0
"only value always matches. But $ also matches before a trailing newline, so a" ^0
"digits-then-newline value passes ^\d+$; all " + str(wrongly_accepted) + " were accepted, " + str(trailing_newline_accepted_per_myriad) ^0
"per ten thousand of the newline-bearing values, until the anchor was \Z." ^0
```

## Python (deterministic transpilation)

```python
submissions = 2000000
digits_only = 1999000
digits_then_a_trailing_newline = 1000
accepted_by_dollar = digits_only + digits_then_a_trailing_newline
accepted_by_end_of_string_anchor = digits_only
wrongly_accepted = accepted_by_dollar - accepted_by_end_of_string_anchor
trailing_newline_accepted_per_myriad = int(digits_then_a_trailing_newline * 10000 / digits_then_a_trailing_newline)
print("submissions                     : " + str(submissions))
print("  digits only                   : " + str(digits_only))
print("  digits then a trailing newline : " + str(digits_then_a_trailing_newline))
print("")
print("accepted by ^\\d+$               : " + str(accepted_by_dollar))
print("accepted by \\A\\d+\\Z             : " + str(accepted_by_end_of_string_anchor))
print("wrongly accepted                : " + str(wrongly_accepted))
print("of the newline-bearing, accepted : " + str(trailing_newline_accepted_per_myriad) + " per ten thousand")
print("")
print("the digits-only validator")
print("  applies to : the real submitted bytes, not a stripped copy")
print("  uses : the engine's own regex")
print("  runs on : every submission")
print("  intent : the value is digits, nothing else")
print("  submissions skipped : 0")
print("  verdict : EVERY VALUE IS DIGITS FROM START TO $")
print("")
print("  using the engine's regex over the real bytes of every")
print("  submission is the part done right here, and it is why a")
print("  genuinely digits-only value always matches")
print("")
print("the anchor $ in default mode")
print("  where $ matches : the end of the string, OR just before")
print("    a newline at the end of it")
print("  so ^\\d+$ against 123456 then a line feed : matches, the $")
print("    lands before the newline")
print("  what the value actually is : digits plus a line feed")
print("  did the pattern fail : no; it matched, leniently")
print("  what rides through : a newline certified as digits-only")
print("")
print("the result of the digits check")
print("  values that should pass : the " + str(digits_only) + " digits-only values")
print("  values that passed : all " + str(accepted_by_dollar) + ", newline-bearing included")
print("  newline-bearing values wrongly accepted : " + str(wrongly_accepted))
print("  is the pattern wrong : no; $ behaves as specified")
print("  is a trailing newline 'nothing else' : no; and the")
print("    fixtures had no trailing newline, so it never showed")
print("")
nc_newline_bearing_accepted_by_dollar = 1000
nc_newline_bearing_accepted_by_Z = 0
nc_values_the_end_of_string_anchor_rejects = 1000
print("null control - anchor to the very end with \\Z")
print("  newline-bearing accepted, $ : " + str(nc_newline_bearing_accepted_by_dollar))
print("  newline-bearing accepted, \\Z : " + str(nc_newline_bearing_accepted_by_Z))
print("  values the end-of-string anchor rejects : " + str(nc_values_the_end_of_string_anchor_rejects))
print("  no submission and no pattern body changed; the anchor")
print("  stopped matching before a trailing newline and started")
print("  matching only the true end")
print("")
print("what a ^\\d+$ check guarantees")
print("  the value is digits up to a line boundary : exactly, the")
print("    engine's own match over every submission")
print("  the value is digits and nothing else : not addressed; $")
print("    also matches before a trailing newline, so a digits-")
print("    then-newline value passes - all " + str(wrongly_accepted) + " of them did")
print("")
print("the end of a line is not the end of a string; an anchor that stops before a final")
print("newline certifies everything up to the break and says nothing about the break")
print("itself, so the one character that turns a value into two lines rides through")
print("")
print("It runs the engine's regex over the real bytes of every submission - a digits-")
print("only value always matches. But $ also matches before a trailing newline, so a")
print("digits-then-newline value passes ^\\d+$; all " + str(wrongly_accepted) + " were accepted, " + str(trailing_newline_accepted_per_myriad))
print("per ten thousand of the newline-bearing values, until the anchor was \\Z.")
```

## stdout (executed)

```text
submissions                     : 2000000
  digits only                   : 1999000
  digits then a trailing newline : 1000

accepted by ^\d+$               : 2000000
accepted by \A\d+\Z             : 1999000
wrongly accepted                : 1000
of the newline-bearing, accepted : 10000 per ten thousand

the digits-only validator
  applies to : the real submitted bytes, not a stripped copy
  uses : the engine's own regex
  runs on : every submission
  intent : the value is digits, nothing else
  submissions skipped : 0
  verdict : EVERY VALUE IS DIGITS FROM START TO $

  using the engine's regex over the real bytes of every
  submission is the part done right here, and it is why a
  genuinely digits-only value always matches

the anchor $ in default mode
  where $ matches : the end of the string, OR just before
    a newline at the end of it
  so ^\d+$ against 123456 then a line feed : matches, the $
    lands before the newline
  what the value actually is : digits plus a line feed
  did the pattern fail : no; it matched, leniently
  what rides through : a newline certified as digits-only

the result of the digits check
  values that should pass : the 1999000 digits-only values
  values that passed : all 2000000, newline-bearing included
  newline-bearing values wrongly accepted : 1000
  is the pattern wrong : no; $ behaves as specified
  is a trailing newline 'nothing else' : no; and the
    fixtures had no trailing newline, so it never showed

null control - anchor to the very end with \Z
  newline-bearing accepted, $ : 1000
  newline-bearing accepted, \Z : 0
  values the end-of-string anchor rejects : 1000
  no submission and no pattern body changed; the anchor
  stopped matching before a trailing newline and started
  matching only the true end

what a ^\d+$ check guarantees
  the value is digits up to a line boundary : exactly, the
    engine's own match over every submission
  the value is digits and nothing else : not addressed; $
    also matches before a trailing newline, so a digits-
    then-newline value passes - all 1000 of them did

the end of a line is not the end of a string; an anchor that stops before a final
newline certifies everything up to the break and says nothing about the break
itself, so the one character that turns a value into two lines rides through

It runs the engine's regex over the real bytes of every submission - a digits-
only value always matches. But $ also matches before a trailing newline, so a
digits-then-newline value passes ^\d+$; all 1000 were accepted, 10000
per ten thousand of the newline-bearing values, until the anchor was \Z.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
