<!-- canonical: efficientnewlanguage.org/ai/examples/854-the-character-class-was-a-range-not-a-number | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 854 — The character class was a range not a number

`the_character_class_was_a_range_not_a_number.eml` - A validator checks that a day-of-month value is in 1 to 31, and it uses the regex engine correctly on every value. What the character class actually denotes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A validator checks
# that a day-of-month value is in 1 to 31, and it uses the regex engine correctly
# on every value. What the character class actually denotes is computed below.
#
# The check is careful. It applies the pattern to the real day value, not a
# rounded one; it uses the engine's own regex; it runs on every value; and the
# intent is exactly 'the day is between 1 and 31'.
#
# The pattern is ^[1-31]$, and inside a class 1-3 is a character range and the
# trailing 1 is a redundant member, so the class is the three characters 1, 2, 3
# and matches exactly one of them.

31000 => day_values_tested
3000 => single_char_days_one_two_three
28000 => days_four_through_thirtyone

single_char_days_one_two_three => accepted_by_class
day_values_tested => accepted_by_numeric_range
accepted_by_numeric_range - accepted_by_class => valid_days_wrongly_rejected
int(accepted_by_class * 10000 / day_values_tested) => class_accept_share_per_myriad

"day values tested (1..31)       : " + str(day_values_tested) ^0
"  the characters 1, 2, 3        : " + str(single_char_days_one_two_three) ^0
"  the days 4 through 31         : " + str(days_four_through_thirtyone) ^0
"" ^0
"accepted by ^[1-31]$            : " + str(accepted_by_class) ^0
"accepted by a numeric 1..31 check : " + str(accepted_by_numeric_range) ^0
"valid days wrongly rejected     : " + str(valid_days_wrongly_rejected) ^0
"share ^[1-31]$ accepts          : " + str(class_accept_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the check verified ----

"the day validator" ^0
"  applies to : the real day value, not a rounded one" ^0
"  uses : the engine's own regex" ^0
"  runs on : every value" ^0
"  intent : the day is between 1 and 31" ^0
"  values skipped : 0" ^0
"  verdict : EVERY VALUE WAS TESTED AGAINST THE CLASS" ^0
"" ^0
"  using the engine's regex over every value is the part" ^0
"  done right here, and it is why the class is applied" ^0
"  uniformly and predictably" ^0
"" ^0

# ---- what the class denotes ----

"the class [1-31]" ^0
"  what 1-3 is inside a class : the character range 1 to 3" ^0
"  what the trailing 1 adds : nothing; it is already in 1-3" ^0
"  so the class is the set : the characters 1, 2, 3" ^0
"  how many characters it matches : exactly one" ^0
"  so 27 and 31 and 4 : all rejected, being outside {1,2,3}" ^0
"    or longer than one character" ^0
"" ^0

# ---- what the caller got ----

"the result of the day check" ^0
"  values that should pass : all " + str(day_values_tested) + " days 1..31" ^0
"  values that passed : " + str(accepted_by_class) + ", only 1, 2, 3" ^0
"  valid days wrongly rejected : " + str(valid_days_wrongly_rejected) ^0
"  is the pattern malformed : no; it compiles and matches" ^0
"  is a range the same as a number : no; [1-31] reads 1-3 as" ^0
"    characters, and the fixtures happened to use 1, 2, 3" ^0
"" ^0

# ---- null control ----

# The same intent, written as a numeric range rather than a character class:
# ^([1-9]|[12][0-9]|3[01])$, which matches the days and not the digits.
3000 => nc_accepted_by_class
31000 => nc_accepted_by_numeric_range
28000 => nc_valid_days_the_range_recovers

"null control - write the numeric range, not a class" ^0
"  accepted by ^[1-31]$ : " + str(nc_accepted_by_class) ^0
"  accepted by the numeric range : " + str(nc_accepted_by_numeric_range) ^0
"  valid days the range recovers : " + str(nc_valid_days_the_range_recovers) ^0
"  no value and no intent changed; the pattern stopped" ^0
"  reading 1-31 as three characters and started reading it" ^0
"  as a span of numbers" ^0
"" ^0

# ---- the rule ----

"what a ^[1-31]$ check guarantees" ^0
"  the value is one character from {1,2,3} : exactly, the" ^0
"    engine's own class match over every value" ^0
"  the value is a day from 1 to 31 : not addressed; inside a" ^0
"    class 1-3 is a range and the 1 is redundant, so [1-31]" ^0
"    is {1,2,3} and rejects the " + str(valid_days_wrongly_rejected) + " days from 4 to 31" ^0
"" ^0

"a character class is a set of characters, not an arithmetic interval; the dash" ^0
"spans code points and the digits after it are members, so a class written to look" ^0
"like a number range means something with no numbers in it at all" ^0
"" ^0

"It runs the engine's regex over every value - the class is applied uniformly." ^0
"But [1-31] denotes the characters 1, 2, 3, not the numbers 1 through 31, so it" ^0
"accepts " + str(accepted_by_class) + " values and rejects the other " + str(valid_days_wrongly_rejected) + "; only " + str(class_accept_share_per_myriad) + " per ten" ^0
"thousand pass, until the intent is written as a numeric range." ^0
```

## Python (deterministic transpilation)

```python
day_values_tested = 31000
single_char_days_one_two_three = 3000
days_four_through_thirtyone = 28000
accepted_by_class = single_char_days_one_two_three
accepted_by_numeric_range = day_values_tested
valid_days_wrongly_rejected = accepted_by_numeric_range - accepted_by_class
class_accept_share_per_myriad = int(accepted_by_class * 10000 / day_values_tested)
print("day values tested (1..31)       : " + str(day_values_tested))
print("  the characters 1, 2, 3        : " + str(single_char_days_one_two_three))
print("  the days 4 through 31         : " + str(days_four_through_thirtyone))
print("")
print("accepted by ^[1-31]$            : " + str(accepted_by_class))
print("accepted by a numeric 1..31 check : " + str(accepted_by_numeric_range))
print("valid days wrongly rejected     : " + str(valid_days_wrongly_rejected))
print("share ^[1-31]$ accepts          : " + str(class_accept_share_per_myriad) + " per ten thousand")
print("")
print("the day validator")
print("  applies to : the real day value, not a rounded one")
print("  uses : the engine's own regex")
print("  runs on : every value")
print("  intent : the day is between 1 and 31")
print("  values skipped : 0")
print("  verdict : EVERY VALUE WAS TESTED AGAINST THE CLASS")
print("")
print("  using the engine's regex over every value is the part")
print("  done right here, and it is why the class is applied")
print("  uniformly and predictably")
print("")
print("the class [1-31]")
print("  what 1-3 is inside a class : the character range 1 to 3")
print("  what the trailing 1 adds : nothing; it is already in 1-3")
print("  so the class is the set : the characters 1, 2, 3")
print("  how many characters it matches : exactly one")
print("  so 27 and 31 and 4 : all rejected, being outside {1,2,3}")
print("    or longer than one character")
print("")
print("the result of the day check")
print("  values that should pass : all " + str(day_values_tested) + " days 1..31")
print("  values that passed : " + str(accepted_by_class) + ", only 1, 2, 3")
print("  valid days wrongly rejected : " + str(valid_days_wrongly_rejected))
print("  is the pattern malformed : no; it compiles and matches")
print("  is a range the same as a number : no; [1-31] reads 1-3 as")
print("    characters, and the fixtures happened to use 1, 2, 3")
print("")
nc_accepted_by_class = 3000
nc_accepted_by_numeric_range = 31000
nc_valid_days_the_range_recovers = 28000
print("null control - write the numeric range, not a class")
print("  accepted by ^[1-31]$ : " + str(nc_accepted_by_class))
print("  accepted by the numeric range : " + str(nc_accepted_by_numeric_range))
print("  valid days the range recovers : " + str(nc_valid_days_the_range_recovers))
print("  no value and no intent changed; the pattern stopped")
print("  reading 1-31 as three characters and started reading it")
print("  as a span of numbers")
print("")
print("what a ^[1-31]$ check guarantees")
print("  the value is one character from {1,2,3} : exactly, the")
print("    engine's own class match over every value")
print("  the value is a day from 1 to 31 : not addressed; inside a")
print("    class 1-3 is a range and the 1 is redundant, so [1-31]")
print("    is {1,2,3} and rejects the " + str(valid_days_wrongly_rejected) + " days from 4 to 31")
print("")
print("a character class is a set of characters, not an arithmetic interval; the dash")
print("spans code points and the digits after it are members, so a class written to look")
print("like a number range means something with no numbers in it at all")
print("")
print("It runs the engine's regex over every value - the class is applied uniformly.")
print("But [1-31] denotes the characters 1, 2, 3, not the numbers 1 through 31, so it")
print("accepts " + str(accepted_by_class) + " values and rejects the other " + str(valid_days_wrongly_rejected) + "; only " + str(class_accept_share_per_myriad) + " per ten")
print("thousand pass, until the intent is written as a numeric range.")
```

## stdout (executed)

```text
day values tested (1..31)       : 31000
  the characters 1, 2, 3        : 3000
  the days 4 through 31         : 28000

accepted by ^[1-31]$            : 3000
accepted by a numeric 1..31 check : 31000
valid days wrongly rejected     : 28000
share ^[1-31]$ accepts          : 967 per ten thousand

the day validator
  applies to : the real day value, not a rounded one
  uses : the engine's own regex
  runs on : every value
  intent : the day is between 1 and 31
  values skipped : 0
  verdict : EVERY VALUE WAS TESTED AGAINST THE CLASS

  using the engine's regex over every value is the part
  done right here, and it is why the class is applied
  uniformly and predictably

the class [1-31]
  what 1-3 is inside a class : the character range 1 to 3
  what the trailing 1 adds : nothing; it is already in 1-3
  so the class is the set : the characters 1, 2, 3
  how many characters it matches : exactly one
  so 27 and 31 and 4 : all rejected, being outside {1,2,3}
    or longer than one character

the result of the day check
  values that should pass : all 31000 days 1..31
  values that passed : 3000, only 1, 2, 3
  valid days wrongly rejected : 28000
  is the pattern malformed : no; it compiles and matches
  is a range the same as a number : no; [1-31] reads 1-3 as
    characters, and the fixtures happened to use 1, 2, 3

null control - write the numeric range, not a class
  accepted by ^[1-31]$ : 3000
  accepted by the numeric range : 31000
  valid days the range recovers : 28000
  no value and no intent changed; the pattern stopped
  reading 1-31 as three characters and started reading it
  as a span of numbers

what a ^[1-31]$ check guarantees
  the value is one character from {1,2,3} : exactly, the
    engine's own class match over every value
  the value is a day from 1 to 31 : not addressed; inside a
    class 1-3 is a range and the 1 is redundant, so [1-31]
    is {1,2,3} and rejects the 28000 days from 4 to 31

a character class is a set of characters, not an arithmetic interval; the dash
spans code points and the digits after it are members, so a class written to look
like a number range means something with no numbers in it at all

It runs the engine's regex over every value - the class is applied uniformly.
But [1-31] denotes the characters 1, 2, 3, not the numbers 1 through 31, so it
accepts 3000 values and rejects the other 28000; only 967 per ten
thousand pass, until the intent is written as a numeric range.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
