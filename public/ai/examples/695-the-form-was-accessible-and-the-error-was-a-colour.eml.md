<!-- canonical: efficientnewlanguage.org/ai/examples/695-the-form-was-accessible-and-the-error-was-a-colour | ai_layer_version: 0.1.0 | updated: 2026-09-04 -->

# Example 695 — The form was accessible and the error was a colour

`the_form_was_accessible_and_the_error_was_a_colour.eml` - The form passes every automated accessibility check, a hundred and forty-eight of them. How a user is told a field is wrong is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The form passes
# every automated accessibility check, a hundred and forty-eight of them. How a
# user is told a field is wrong is computed below.
#
# The accessibility work was done and it was not box-ticking. Every input has a
# programmatically associated label, the tab order follows the visual order, the
# landmarks are right, focus is visible and never trapped, the contrast ratios
# exceed the requirement rather than meeting it, and the checker runs in the
# pipeline so a regression fails the build.
#
# What the checker verifies is what a machine can decide from the document. That
# an error is CONVEYED is a semantic question: the rule says do not use colour
# as the only means of conveying information, and deciding whether something is
# the only means requires knowing what the something means.
#
# A failed field gets a red border. There is no text, no icon, and no
# announcement.

148 => automated_checks
148 => automated_checks_passed
15 => fields
15 => fields_whose_error_is_colour_only
41000 => sessions_per_day
450 => colour_vision_deficiency_per_myriad
0 => contrast_failures

int(sessions_per_day * colour_vision_deficiency_per_myriad / 10000) => sessions_that_cannot_see_the_signal
automated_checks - automated_checks_passed => automated_failures

"automated checks             : " + str(automated_checks) ^0
"passed                       : " + str(automated_checks_passed) ^0
"failed                       : " + str(automated_failures) ^0
"contrast failures            : " + str(contrast_failures) ^0
"" ^0
"fields                       : " + str(fields) ^0
"errors signalled by colour only : " + str(fields_whose_error_is_colour_only) ^0
"sessions per day             : " + str(sessions_per_day) ^0
"sessions that cannot see it  : " + str(sessions_that_cannot_see_the_signal) ^0
"" ^0

# ---- what the checker verified ----

"the automated suite" ^0
"  labels programmatically associated : all " + str(fields) ^0
"  tab order follows visual order     : yes" ^0
"  landmarks                          : correct" ^0
"  focus visible, never trapped       : yes" ^0
"  contrast                           : exceeds, not merely meets" ^0
"  runs in the pipeline               : yes, a regression fails the build" ^0
"  verdict                            : ACCESSIBLE" ^0
"" ^0
"  this is a real implementation and the pipeline gate" ^0
"  keeps it real" ^0
"" ^0

# ---- what a checker can decide ----

"the two kinds of rule" ^0
"  is this contrast ratio above 4.5 : a machine can measure" ^0
"  is this label associated          : a machine can read" ^0
"  is colour the ONLY means of conveying this : requires" ^0
"    knowing what is being conveyed" ^0
"  so the third is                   : not in the suite," ^0
"    and correctly not in it" ^0
"" ^0
"  the checker is not failing to test it; a checker cannot" ^0
"  hold the premise the rule is about" ^0
"" ^0

int(fields_whose_error_is_colour_only * 10000 / fields) => colour_only_per_myriad
"share of fields whose error is colour only : " + str(colour_only_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the user experiences ----

# The submit button does nothing, because the form will not submit while a
# field is invalid, and nothing says which field or why.
"a failed submission" ^0
"  what changes visually : one border becomes red" ^0
"  text explaining it    : none" ^0
"  icon                  : none" ^0
"  announcement to assistive technology : none" ^0
"  what a user who cannot see the change experiences :" ^0
"    a button that does nothing" ^0
"" ^0

# ---- null control ----

# The same form, with the error also written as text beside the field and
# announced.
0 => nc_fields_whose_error_is_colour_only
automated_checks_passed => nc_automated_checks_passed

"null control - the error also written and announced" ^0
"  automated checks passed : " + str(nc_automated_checks_passed) + ", unchanged" ^0
"  errors signalled by colour only : " + str(nc_fields_whose_error_is_colour_only) ^0
"  the suite did not get stricter; the signal stopped" ^0
"  having exactly one channel" ^0
"" ^0

# ---- the rule ----

"what a passing accessibility suite guarantees" ^0
"  every machine-decidable rule holds : exactly" ^0
"  the interface can be used          : not addressed; the" ^0
"    rules that need a reader to know what something means" ^0
"    are the ones a checker cannot hold, and they are not" ^0
"    the easy ones" ^0
"" ^0
"an automated suite partitions the guidelines into the ones it" ^0
"can decide and the ones it cannot, and reports only on the" ^0
"first; a green build is a statement about that partition" ^0
"" ^0

"The form passes all " + str(automated_checks) + " automated checks with " + str(automated_failures) + " failures and " + str(contrast_failures) + " contrast" ^0
"problems, on labels, tab order, landmarks, focus and ratios that exceed rather" ^0
"than meet. All " + str(fields) + " fields signal a validation error with a red border alone -" ^0
str(colour_only_per_myriad) + " per ten thousand - which no checker can decide is the only means, and" ^0
"about " + str(sessions_that_cannot_see_the_signal) + " sessions a day meet a button that appears to do nothing." ^0
```

## Python (deterministic transpilation)

```python
automated_checks = 148
automated_checks_passed = 148
fields = 15
fields_whose_error_is_colour_only = 15
sessions_per_day = 41000
colour_vision_deficiency_per_myriad = 450
contrast_failures = 0
sessions_that_cannot_see_the_signal = int(sessions_per_day * colour_vision_deficiency_per_myriad / 10000)
automated_failures = automated_checks - automated_checks_passed
print("automated checks             : " + str(automated_checks))
print("passed                       : " + str(automated_checks_passed))
print("failed                       : " + str(automated_failures))
print("contrast failures            : " + str(contrast_failures))
print("")
print("fields                       : " + str(fields))
print("errors signalled by colour only : " + str(fields_whose_error_is_colour_only))
print("sessions per day             : " + str(sessions_per_day))
print("sessions that cannot see it  : " + str(sessions_that_cannot_see_the_signal))
print("")
print("the automated suite")
print("  labels programmatically associated : all " + str(fields))
print("  tab order follows visual order     : yes")
print("  landmarks                          : correct")
print("  focus visible, never trapped       : yes")
print("  contrast                           : exceeds, not merely meets")
print("  runs in the pipeline               : yes, a regression fails the build")
print("  verdict                            : ACCESSIBLE")
print("")
print("  this is a real implementation and the pipeline gate")
print("  keeps it real")
print("")
print("the two kinds of rule")
print("  is this contrast ratio above 4.5 : a machine can measure")
print("  is this label associated          : a machine can read")
print("  is colour the ONLY means of conveying this : requires")
print("    knowing what is being conveyed")
print("  so the third is                   : not in the suite,")
print("    and correctly not in it")
print("")
print("  the checker is not failing to test it; a checker cannot")
print("  hold the premise the rule is about")
print("")
colour_only_per_myriad = int(fields_whose_error_is_colour_only * 10000 / fields)
print("share of fields whose error is colour only : " + str(colour_only_per_myriad) + " per ten thousand")
print("")
print("a failed submission")
print("  what changes visually : one border becomes red")
print("  text explaining it    : none")
print("  icon                  : none")
print("  announcement to assistive technology : none")
print("  what a user who cannot see the change experiences :")
print("    a button that does nothing")
print("")
nc_fields_whose_error_is_colour_only = 0
nc_automated_checks_passed = automated_checks_passed
print("null control - the error also written and announced")
print("  automated checks passed : " + str(nc_automated_checks_passed) + ", unchanged")
print("  errors signalled by colour only : " + str(nc_fields_whose_error_is_colour_only))
print("  the suite did not get stricter; the signal stopped")
print("  having exactly one channel")
print("")
print("what a passing accessibility suite guarantees")
print("  every machine-decidable rule holds : exactly")
print("  the interface can be used          : not addressed; the")
print("    rules that need a reader to know what something means")
print("    are the ones a checker cannot hold, and they are not")
print("    the easy ones")
print("")
print("an automated suite partitions the guidelines into the ones it")
print("can decide and the ones it cannot, and reports only on the")
print("first; a green build is a statement about that partition")
print("")
print("The form passes all " + str(automated_checks) + " automated checks with " + str(automated_failures) + " failures and " + str(contrast_failures) + " contrast")
print("problems, on labels, tab order, landmarks, focus and ratios that exceed rather")
print("than meet. All " + str(fields) + " fields signal a validation error with a red border alone -")
print(str(colour_only_per_myriad) + " per ten thousand - which no checker can decide is the only means, and")
print("about " + str(sessions_that_cannot_see_the_signal) + " sessions a day meet a button that appears to do nothing.")
```

## stdout (executed)

```text
automated checks             : 148
passed                       : 148
failed                       : 0
contrast failures            : 0

fields                       : 15
errors signalled by colour only : 15
sessions per day             : 41000
sessions that cannot see it  : 1845

the automated suite
  labels programmatically associated : all 15
  tab order follows visual order     : yes
  landmarks                          : correct
  focus visible, never trapped       : yes
  contrast                           : exceeds, not merely meets
  runs in the pipeline               : yes, a regression fails the build
  verdict                            : ACCESSIBLE

  this is a real implementation and the pipeline gate
  keeps it real

the two kinds of rule
  is this contrast ratio above 4.5 : a machine can measure
  is this label associated          : a machine can read
  is colour the ONLY means of conveying this : requires
    knowing what is being conveyed
  so the third is                   : not in the suite,
    and correctly not in it

  the checker is not failing to test it; a checker cannot
  hold the premise the rule is about

share of fields whose error is colour only : 10000 per ten thousand

a failed submission
  what changes visually : one border becomes red
  text explaining it    : none
  icon                  : none
  announcement to assistive technology : none
  what a user who cannot see the change experiences :
    a button that does nothing

null control - the error also written and announced
  automated checks passed : 148, unchanged
  errors signalled by colour only : 0
  the suite did not get stricter; the signal stopped
  having exactly one channel

what a passing accessibility suite guarantees
  every machine-decidable rule holds : exactly
  the interface can be used          : not addressed; the
    rules that need a reader to know what something means
    are the ones a checker cannot hold, and they are not
    the easy ones

an automated suite partitions the guidelines into the ones it
can decide and the ones it cannot, and reports only on the
first; a green build is a statement about that partition

The form passes all 148 automated checks with 0 failures and 0 contrast
problems, on labels, tab order, landmarks, focus and ratios that exceed rather
than meet. All 15 fields signal a validation error with a red border alone -
10000 per ten thousand - which no checker can decide is the only means, and
about 1845 sessions a day meet a button that appears to do nothing.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
