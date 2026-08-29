<!-- canonical: efficientnewlanguage.org/ai/examples/601-the-check-ran-on-a-copy-and-the-original-was-used | ai_layer_version: 0.1.0 | updated: 2026-08-29 -->

# Example 601 — The check ran on a copy and the original was used

`the_check_ran_on_a_copy_and_the_original_was_used.eml` - Every request is normalised, then validated, and the validator has never passed a bad value. Which value the handler then uses is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every request is
# normalised, then validated, and the validator has never passed a bad value.
# Which value the handler then uses is computed below.
#
# Normalising before validating is correct and it is the order the rules were
# written for. Validating raw input means every rule carries its own trimming,
# case folding and unicode handling, the rules drift apart, and the one that
# forgets is the hole. Normalise once, validate the normal form, and each rule
# states one thing. The normaliser is well tested and the validator is strict.
#
# The normaliser returns a new value rather than editing in place, which is
# also correct: a pure function is testable and cannot corrupt its input on a
# rejection path.
#
# So there are two values. The validator was handed one of them.

240000 => requests_per_day
37 => normalised_differs_per_thousand

int(requests_per_day * normalised_differs_per_thousand / 1000) => requests_where_they_differ
requests_per_day - requests_where_they_differ => requests_where_identical

"requests per day                      : " + str(requests_per_day) ^0
"normal form differs from the input    : " + str(normalised_differs_per_thousand) + " per thousand" ^0
"requests where they differ            : " + str(requests_where_they_differ) ^0
"requests where they are identical     : " + str(requests_where_identical) ^0
"" ^0

# ---- the two values ----

"the pipeline" ^0
"  1  read the request body       -> original" ^0
"  2  normalise(original)         -> normal" ^0
"  3  validate(normal)            -> pass or reject" ^0
"  4  handle(original)" ^0
"" ^0
"  step 3 and step 4 name different variables" ^0
"  and both names are correct for their own line" ^0
"" ^0

# ---- what the validator reports ----

"the validator's record" ^0
"  values validated  : " + str(requests_per_day) ^0
"  values rejected   : 0" ^0
"  pass rate         : 100 percent" ^0
"  false accepts     : 0" ^0
"" ^0
"  every one of those is true about the value it was given" ^0
"  values it was given that reached the handler : " + str(requests_where_identical) ^0
"" ^0

# ---- the requests where the two differ ----

"what normalisation changes, and what the handler then sees" ^0
"  trailing whitespace stripped     handler sees it back" ^0
"  email address lower-cased        handler sees the original case" ^0
"  unicode direction marks removed  handler sees the marks" ^0
"  repeated slashes in a path collapsed  handler sees them repeated" ^0
"" ^0
"  requests affected : " + str(requests_where_they_differ) + " per day" ^0
"  requests where the validator's verdict was about a value" ^0
"  nothing downstream ever reads : " + str(requests_where_they_differ) ^0
"" ^0

# ---- one request ----

"one request, both values" ^0
"  original : a path with two slashes and a trailing space" ^0
"  normal   : the same path, collapsed and trimmed" ^0
"  validate(normal)  : passes, the path is inside the allowed root" ^0
"  handle(original)  : resolves a different path" ^0
"" ^0
"  the validator is correct, the normaliser is correct," ^0
"  and the conclusion does not travel with the value" ^0
"" ^0

# ---- how long this can hold ----
#
# Nothing here degrades. The tests pass because the tests call validate() and
# check its verdict, which is right. An end-to-end test would catch it, if one
# of its inputs were a value whose normal form differs.

12 => end_to_end_tests
0 => e2e_inputs_needing_normalisation

"the test suite" ^0
"  unit tests on the normaliser : pass" ^0
"  unit tests on the validator  : pass" ^0
"  end-to-end tests             : " + str(end_to_end_tests) + ", all passing" ^0
"  of those, inputs whose normal form differs : " + str(e2e_inputs_needing_normalisation) ^0
"" ^0
"  fixtures are written in normal form, because a person writing" ^0
"  one types the tidy version, so the two values coincide in" ^0
"  every test and the bug has no input that can express it" ^0
"" ^0

# ---- the control ----
#
# Both components, against their own contracts. The normaliser produces a
# correct normal form and does not mutate its argument. The validator accepts
# exactly the values it should.

"control - are the two components correct" ^0
"  normaliser output correct  : yes, on all " + str(requests_per_day) ^0
"  normaliser mutates input   : no, by design" ^0
"  validator false accepts    : 0" ^0
"  validator false rejects    : 0" ^0
"  defects in either component : 0" ^0
"" ^0
"  the purity that makes the normaliser safe is what creates" ^0
"  the second value" ^0
"" ^0

# ---- the null control ----
#
# The same normaliser, same validator, same order, where step 4 is handed the
# normal form. Nothing about either component changes and no rule is rewritten.

"null control - the same pipeline handing step 4 the normal form" ^0
"  requests where the values differ : " + str(requests_where_they_differ) ^0
"  requests validated               : " + str(requests_per_day) ^0
"  requests where the verdict applies to what ran : " + str(requests_per_day) ^0
"  one identifier changed on one line" ^0
"" ^0

# ---- the rule ----

"what a passing validation is a statement about" ^0
"  the value passed to it       : yes, completely" ^0
"  the value used afterwards    : only if they are the same object" ^0
"  and a pure normaliser guarantees they are not" ^0
"" ^0
"the check is not too weak and the normaliser is not wrong;" ^0
"the verdict simply does not name the value it will be quoted" ^0
"about, and nothing in either signature says so" ^0
"" ^0

"The normaliser is pure and correct, the validator has 0 false accepts and 0" ^0
"false rejects across " + str(requests_per_day) + " requests a day, and the order they run in is the" ^0
"order that keeps the rules from drifting. On the " + str(requests_where_they_differ) + " requests a day whose" ^0
"normal form differs from their input, the verdict describes a value the" ^0
"handler never sees, and the " + str(end_to_end_tests) + " end-to-end tests cannot show it because " + str(e2e_inputs_needing_normalisation) ^0
"of their inputs are written in a form that needs normalising." ^0
```

## Python (deterministic transpilation)

```python
requests_per_day = 240000
normalised_differs_per_thousand = 37
requests_where_they_differ = int(requests_per_day * normalised_differs_per_thousand / 1000)
requests_where_identical = requests_per_day - requests_where_they_differ
print("requests per day                      : " + str(requests_per_day))
print("normal form differs from the input    : " + str(normalised_differs_per_thousand) + " per thousand")
print("requests where they differ            : " + str(requests_where_they_differ))
print("requests where they are identical     : " + str(requests_where_identical))
print("")
print("the pipeline")
print("  1  read the request body       -> original")
print("  2  normalise(original)         -> normal")
print("  3  validate(normal)            -> pass or reject")
print("  4  handle(original)")
print("")
print("  step 3 and step 4 name different variables")
print("  and both names are correct for their own line")
print("")
print("the validator's record")
print("  values validated  : " + str(requests_per_day))
print("  values rejected   : 0")
print("  pass rate         : 100 percent")
print("  false accepts     : 0")
print("")
print("  every one of those is true about the value it was given")
print("  values it was given that reached the handler : " + str(requests_where_identical))
print("")
print("what normalisation changes, and what the handler then sees")
print("  trailing whitespace stripped     handler sees it back")
print("  email address lower-cased        handler sees the original case")
print("  unicode direction marks removed  handler sees the marks")
print("  repeated slashes in a path collapsed  handler sees them repeated")
print("")
print("  requests affected : " + str(requests_where_they_differ) + " per day")
print("  requests where the validator's verdict was about a value")
print("  nothing downstream ever reads : " + str(requests_where_they_differ))
print("")
print("one request, both values")
print("  original : a path with two slashes and a trailing space")
print("  normal   : the same path, collapsed and trimmed")
print("  validate(normal)  : passes, the path is inside the allowed root")
print("  handle(original)  : resolves a different path")
print("")
print("  the validator is correct, the normaliser is correct,")
print("  and the conclusion does not travel with the value")
print("")
end_to_end_tests = 12
e2e_inputs_needing_normalisation = 0
print("the test suite")
print("  unit tests on the normaliser : pass")
print("  unit tests on the validator  : pass")
print("  end-to-end tests             : " + str(end_to_end_tests) + ", all passing")
print("  of those, inputs whose normal form differs : " + str(e2e_inputs_needing_normalisation))
print("")
print("  fixtures are written in normal form, because a person writing")
print("  one types the tidy version, so the two values coincide in")
print("  every test and the bug has no input that can express it")
print("")
print("control - are the two components correct")
print("  normaliser output correct  : yes, on all " + str(requests_per_day))
print("  normaliser mutates input   : no, by design")
print("  validator false accepts    : 0")
print("  validator false rejects    : 0")
print("  defects in either component : 0")
print("")
print("  the purity that makes the normaliser safe is what creates")
print("  the second value")
print("")
print("null control - the same pipeline handing step 4 the normal form")
print("  requests where the values differ : " + str(requests_where_they_differ))
print("  requests validated               : " + str(requests_per_day))
print("  requests where the verdict applies to what ran : " + str(requests_per_day))
print("  one identifier changed on one line")
print("")
print("what a passing validation is a statement about")
print("  the value passed to it       : yes, completely")
print("  the value used afterwards    : only if they are the same object")
print("  and a pure normaliser guarantees they are not")
print("")
print("the check is not too weak and the normaliser is not wrong;")
print("the verdict simply does not name the value it will be quoted")
print("about, and nothing in either signature says so")
print("")
print("The normaliser is pure and correct, the validator has 0 false accepts and 0")
print("false rejects across " + str(requests_per_day) + " requests a day, and the order they run in is the")
print("order that keeps the rules from drifting. On the " + str(requests_where_they_differ) + " requests a day whose")
print("normal form differs from their input, the verdict describes a value the")
print("handler never sees, and the " + str(end_to_end_tests) + " end-to-end tests cannot show it because " + str(e2e_inputs_needing_normalisation))
print("of their inputs are written in a form that needs normalising.")
```

## stdout (executed)

```text
requests per day                      : 240000
normal form differs from the input    : 37 per thousand
requests where they differ            : 8880
requests where they are identical     : 231120

the pipeline
  1  read the request body       -> original
  2  normalise(original)         -> normal
  3  validate(normal)            -> pass or reject
  4  handle(original)

  step 3 and step 4 name different variables
  and both names are correct for their own line

the validator's record
  values validated  : 240000
  values rejected   : 0
  pass rate         : 100 percent
  false accepts     : 0

  every one of those is true about the value it was given
  values it was given that reached the handler : 231120

what normalisation changes, and what the handler then sees
  trailing whitespace stripped     handler sees it back
  email address lower-cased        handler sees the original case
  unicode direction marks removed  handler sees the marks
  repeated slashes in a path collapsed  handler sees them repeated

  requests affected : 8880 per day
  requests where the validator's verdict was about a value
  nothing downstream ever reads : 8880

one request, both values
  original : a path with two slashes and a trailing space
  normal   : the same path, collapsed and trimmed
  validate(normal)  : passes, the path is inside the allowed root
  handle(original)  : resolves a different path

  the validator is correct, the normaliser is correct,
  and the conclusion does not travel with the value

the test suite
  unit tests on the normaliser : pass
  unit tests on the validator  : pass
  end-to-end tests             : 12, all passing
  of those, inputs whose normal form differs : 0

  fixtures are written in normal form, because a person writing
  one types the tidy version, so the two values coincide in
  every test and the bug has no input that can express it

control - are the two components correct
  normaliser output correct  : yes, on all 240000
  normaliser mutates input   : no, by design
  validator false accepts    : 0
  validator false rejects    : 0
  defects in either component : 0

  the purity that makes the normaliser safe is what creates
  the second value

null control - the same pipeline handing step 4 the normal form
  requests where the values differ : 8880
  requests validated               : 240000
  requests where the verdict applies to what ran : 240000
  one identifier changed on one line

what a passing validation is a statement about
  the value passed to it       : yes, completely
  the value used afterwards    : only if they are the same object
  and a pure normaliser guarantees they are not

the check is not too weak and the normaliser is not wrong;
the verdict simply does not name the value it will be quoted
about, and nothing in either signature says so

The normaliser is pure and correct, the validator has 0 false accepts and 0
false rejects across 240000 requests a day, and the order they run in is the
order that keeps the rules from drifting. On the 8880 requests a day whose
normal form differs from their input, the verdict describes a value the
handler never sees, and the 12 end-to-end tests cannot show it because 0
of their inputs are written in a form that needs normalising.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
