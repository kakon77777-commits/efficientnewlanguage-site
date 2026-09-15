<!-- canonical: efficientnewlanguage.org/ai/examples/860-the-pattern-matched-a-prefix-and-passed-the-whole | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 860 — The pattern matched a prefix and passed the whole

`the_pattern_matched_a_prefix_and_passed_the_whole.eml` - A validator checks that a submitted code is a six-digit number, and it uses the regex engine correctly on every submission. What the pattern is anchored to is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A validator checks
# that a submitted code is a six-digit number, and it uses the regex engine
# correctly on every submission. What the pattern is anchored to is computed
# below.
#
# The check is careful. It applies the pattern to the real submitted string, not
# a trimmed copy; it uses the engine's own regex, not a hand-rolled scan; it runs
# on every submission; and the intent is exactly 'the whole value is a six-digit
# code'.
#
# The pattern is re.match(r"\d{6}"), which anchors the start but not the end, so
# it confirms a six-digit prefix and ignores whatever follows.

2000000 => submissions
1999000 => well_formed_codes
1000 => valid_prefix_then_junk

well_formed_codes + valid_prefix_then_junk => accepted_by_prefix_match
well_formed_codes => accepted_by_fullmatch
accepted_by_prefix_match - accepted_by_fullmatch => wrongly_accepted
int(valid_prefix_then_junk * 10000 / valid_prefix_then_junk) => invalid_accepted_share_per_myriad

"submissions                     : " + str(submissions) ^0
"  well-formed six-digit codes   : " + str(well_formed_codes) ^0
"  six-digit prefix then junk    : " + str(valid_prefix_then_junk) ^0
"" ^0
"accepted by re.match(\d{6})      : " + str(accepted_by_prefix_match) ^0
"accepted by re.fullmatch(\d{6})  : " + str(accepted_by_fullmatch) ^0
"wrongly accepted                : " + str(wrongly_accepted) ^0
"of the junk-suffixed, accepted  : " + str(invalid_accepted_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the check verified ----

"the code validator" ^0
"  applies to : the real submitted string, not a trimmed copy" ^0
"  uses : the engine's own regex, not a hand-rolled scan" ^0
"  runs on : every submission" ^0
"  intent : the whole value is a six-digit code" ^0
"  submissions skipped : 0" ^0
"  verdict : EVERY VALUE HAS A SIX-DIGIT PREFIX" ^0
"" ^0
"  using the engine's regex over every real submission is" ^0
"  the part done right here, and it is why a genuine six-" ^0
"  digit prefix is reliably found" ^0
"" ^0

# ---- what the pattern is anchored to ----

"re.match(r\"\d{6}\")" ^0
"  what re.match anchors : the start of the string" ^0
"  what it does not anchor : the end" ^0
"  what \d{6} then matches : the first six digits, and stops" ^0
"  what happens to the rest : it is never looked at" ^0
"  so a value like 482913-then-anything : matches, because" ^0
"    its prefix is six digits" ^0
"" ^0

# ---- what the caller got ----

"the result of the code check" ^0
"  values that should pass : the " + str(well_formed_codes) + " exact codes" ^0
"  values that passed : all " + str(accepted_by_prefix_match) + ", junk included" ^0
"  junk-suffixed values wrongly accepted : " + str(wrongly_accepted) ^0
"  is the pattern wrong : no; \d{6} does match six digits" ^0
"  did the tail get validated : no; the fixtures were all" ^0
"    clean, so the missing end-anchor never showed" ^0
"" ^0

# ---- null control ----

# The same pattern, applied with re.fullmatch (or with an end-anchor added), so
# the match must cover the whole string, not a prefix.
1000 => nc_junk_suffixed_accepted_by_prefix_match
0 => nc_junk_suffixed_accepted_by_fullmatch
1000 => nc_values_the_end_anchor_rejects

"null control - anchor the end (re.fullmatch)" ^0
"  junk-suffixed accepted, prefix match : " + str(nc_junk_suffixed_accepted_by_prefix_match) ^0
"  junk-suffixed accepted, fullmatch : " + str(nc_junk_suffixed_accepted_by_fullmatch) ^0
"  values the end-anchor now rejects : " + str(nc_values_the_end_anchor_rejects) ^0
"  no submission and no pattern body changed; the match" ^0
"  stopped covering a prefix and started covering the whole" ^0
"  string" ^0
"" ^0

# ---- the rule ----

"what a re.match(\d{6}) check guarantees" ^0
"  the value begins with six digits : exactly, the engine's" ^0
"    own match over every submission" ^0
"  the value is a six-digit code : not addressed; re.match" ^0
"    anchors only the start, so \d{6} matches a prefix and" ^0
"    ignores the tail - all " + str(wrongly_accepted) + " junk-suffixed values passed" ^0
"" ^0

"an anchor is half a fence; a start-anchored pattern says where a match begins and" ^0
"nothing about where the string ends, so it certifies a prefix and lets the" ^0
"remainder through, and the remainder is exactly where an unexpected value hides" ^0
"" ^0

"It applies the engine's own regex to every real submission - a genuine six-digit" ^0
"prefix is always found. But re.match anchors only the start, so \d{6} passes any" ^0
"value whose first six characters are digits; all " + str(wrongly_accepted) + " junk-suffixed values were" ^0
"accepted, " + str(invalid_accepted_share_per_myriad) + " per ten thousand of them, until the end was anchored." ^0
```

## Python (deterministic transpilation)

```python
submissions = 2000000
well_formed_codes = 1999000
valid_prefix_then_junk = 1000
accepted_by_prefix_match = well_formed_codes + valid_prefix_then_junk
accepted_by_fullmatch = well_formed_codes
wrongly_accepted = accepted_by_prefix_match - accepted_by_fullmatch
invalid_accepted_share_per_myriad = int(valid_prefix_then_junk * 10000 / valid_prefix_then_junk)
print("submissions                     : " + str(submissions))
print("  well-formed six-digit codes   : " + str(well_formed_codes))
print("  six-digit prefix then junk    : " + str(valid_prefix_then_junk))
print("")
print("accepted by re.match(\\d{6})      : " + str(accepted_by_prefix_match))
print("accepted by re.fullmatch(\\d{6})  : " + str(accepted_by_fullmatch))
print("wrongly accepted                : " + str(wrongly_accepted))
print("of the junk-suffixed, accepted  : " + str(invalid_accepted_share_per_myriad) + " per ten thousand")
print("")
print("the code validator")
print("  applies to : the real submitted string, not a trimmed copy")
print("  uses : the engine's own regex, not a hand-rolled scan")
print("  runs on : every submission")
print("  intent : the whole value is a six-digit code")
print("  submissions skipped : 0")
print("  verdict : EVERY VALUE HAS A SIX-DIGIT PREFIX")
print("")
print("  using the engine's regex over every real submission is")
print("  the part done right here, and it is why a genuine six-")
print("  digit prefix is reliably found")
print("")
print("re.match(r\"\\d{6}\")")
print("  what re.match anchors : the start of the string")
print("  what it does not anchor : the end")
print("  what \\d{6} then matches : the first six digits, and stops")
print("  what happens to the rest : it is never looked at")
print("  so a value like 482913-then-anything : matches, because")
print("    its prefix is six digits")
print("")
print("the result of the code check")
print("  values that should pass : the " + str(well_formed_codes) + " exact codes")
print("  values that passed : all " + str(accepted_by_prefix_match) + ", junk included")
print("  junk-suffixed values wrongly accepted : " + str(wrongly_accepted))
print("  is the pattern wrong : no; \\d{6} does match six digits")
print("  did the tail get validated : no; the fixtures were all")
print("    clean, so the missing end-anchor never showed")
print("")
nc_junk_suffixed_accepted_by_prefix_match = 1000
nc_junk_suffixed_accepted_by_fullmatch = 0
nc_values_the_end_anchor_rejects = 1000
print("null control - anchor the end (re.fullmatch)")
print("  junk-suffixed accepted, prefix match : " + str(nc_junk_suffixed_accepted_by_prefix_match))
print("  junk-suffixed accepted, fullmatch : " + str(nc_junk_suffixed_accepted_by_fullmatch))
print("  values the end-anchor now rejects : " + str(nc_values_the_end_anchor_rejects))
print("  no submission and no pattern body changed; the match")
print("  stopped covering a prefix and started covering the whole")
print("  string")
print("")
print("what a re.match(\\d{6}) check guarantees")
print("  the value begins with six digits : exactly, the engine's")
print("    own match over every submission")
print("  the value is a six-digit code : not addressed; re.match")
print("    anchors only the start, so \\d{6} matches a prefix and")
print("    ignores the tail - all " + str(wrongly_accepted) + " junk-suffixed values passed")
print("")
print("an anchor is half a fence; a start-anchored pattern says where a match begins and")
print("nothing about where the string ends, so it certifies a prefix and lets the")
print("remainder through, and the remainder is exactly where an unexpected value hides")
print("")
print("It applies the engine's own regex to every real submission - a genuine six-digit")
print("prefix is always found. But re.match anchors only the start, so \\d{6} passes any")
print("value whose first six characters are digits; all " + str(wrongly_accepted) + " junk-suffixed values were")
print("accepted, " + str(invalid_accepted_share_per_myriad) + " per ten thousand of them, until the end was anchored.")
```

## stdout (executed)

```text
submissions                     : 2000000
  well-formed six-digit codes   : 1999000
  six-digit prefix then junk    : 1000

accepted by re.match(\d{6})      : 2000000
accepted by re.fullmatch(\d{6})  : 1999000
wrongly accepted                : 1000
of the junk-suffixed, accepted  : 10000 per ten thousand

the code validator
  applies to : the real submitted string, not a trimmed copy
  uses : the engine's own regex, not a hand-rolled scan
  runs on : every submission
  intent : the whole value is a six-digit code
  submissions skipped : 0
  verdict : EVERY VALUE HAS A SIX-DIGIT PREFIX

  using the engine's regex over every real submission is
  the part done right here, and it is why a genuine six-
  digit prefix is reliably found

re.match(r"\d{6}")
  what re.match anchors : the start of the string
  what it does not anchor : the end
  what \d{6} then matches : the first six digits, and stops
  what happens to the rest : it is never looked at
  so a value like 482913-then-anything : matches, because
    its prefix is six digits

the result of the code check
  values that should pass : the 1999000 exact codes
  values that passed : all 2000000, junk included
  junk-suffixed values wrongly accepted : 1000
  is the pattern wrong : no; \d{6} does match six digits
  did the tail get validated : no; the fixtures were all
    clean, so the missing end-anchor never showed

null control - anchor the end (re.fullmatch)
  junk-suffixed accepted, prefix match : 1000
  junk-suffixed accepted, fullmatch : 0
  values the end-anchor now rejects : 1000
  no submission and no pattern body changed; the match
  stopped covering a prefix and started covering the whole
  string

what a re.match(\d{6}) check guarantees
  the value begins with six digits : exactly, the engine's
    own match over every submission
  the value is a six-digit code : not addressed; re.match
    anchors only the start, so \d{6} matches a prefix and
    ignores the tail - all 1000 junk-suffixed values passed

an anchor is half a fence; a start-anchored pattern says where a match begins and
nothing about where the string ends, so it certifies a prefix and lets the
remainder through, and the remainder is exactly where an unexpected value hides

It applies the engine's own regex to every real submission - a genuine six-digit
prefix is always found. But re.match anchors only the start, so \d{6} passes any
value whose first six characters are digits; all 1000 junk-suffixed values were
accepted, 10000 per ten thousand of them, until the end was anchored.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
