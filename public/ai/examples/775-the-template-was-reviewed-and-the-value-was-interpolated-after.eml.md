<!-- canonical: efficientnewlanguage.org/ai/examples/775-the-template-was-reviewed-and-the-value-was-interpolated-after | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 775 — The template was reviewed and the value was interpolated after

`the_template_was_reviewed_and_the_value_was_interpolated_after.eml` - No notification template reaches production without a security review, the review has run for twenty-six months, and it has caught and fixed seven injections. What the review reads is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). No notification
# template reaches production without a security review, the review has run for
# twenty-six months, and it has caught and fixed seven injections. What the
# review reads is computed below.
#
# The review is real. Two reviewers sign every template against a written
# checklist; a template cannot be referenced by any service until both have
# signed; nineteen were sent back and rewritten rather than waved through; and
# seven templates whose own text would have executed something were caught.
#
# What the reviewer opens is the template. What the recipient receives is the
# template with values substituted into it, and the substitution happens after
# every signature has been collected.

340 => templates_in_the_catalogue
2 => reviewers_per_template
19 => templates_sent_back_and_rewritten
26 => months_the_review_has_run
7 => injections_found_in_template_text
2180 => placeholders_across_all_templates
96 => placeholders_rendered_without_escaping
23 => templates_holding_at_least_one
41 => unescaped_placeholders_a_stranger_can_fill
0 => checklist_items_about_placeholder_escaping
0 => reviews_that_rendered_the_template

int(placeholders_across_all_templates / templates_in_the_catalogue) => placeholders_per_template
placeholders_across_all_templates - placeholders_rendered_without_escaping => placeholders_that_escape
templates_in_the_catalogue - templates_holding_at_least_one => templates_with_none
int(placeholders_rendered_without_escaping * 10000 / placeholders_across_all_templates) => unescaped_per_myriad
int(templates_holding_at_least_one * 10000 / templates_in_the_catalogue) => templates_affected_per_myriad

"templates in the catalogue      : " + str(templates_in_the_catalogue) ^0
"reviewers per template          : " + str(reviewers_per_template) ^0
"sent back and rewritten         : " + str(templates_sent_back_and_rewritten) ^0
"months the review has run       : " + str(months_the_review_has_run) ^0
"injections found in the text    : " + str(injections_found_in_template_text) ^0
"" ^0
"placeholders across the catalogue : " + str(placeholders_across_all_templates) ^0
"  per template, mean             : " + str(placeholders_per_template) ^0
"  that escape                    : " + str(placeholders_that_escape) ^0
"  rendered without escaping      : " + str(placeholders_rendered_without_escaping) ^0
"  that a stranger can fill       : " + str(unescaped_placeholders_a_stranger_can_fill) ^0
"  unescaped share                : " + str(unescaped_per_myriad) + " per ten thousand" ^0
"" ^0
"templates holding at least one  : " + str(templates_holding_at_least_one) ^0
"  holding none                  : " + str(templates_with_none) ^0
"  share affected                : " + str(templates_affected_per_myriad) + " per ten thousand" ^0
"checklist items about escaping  : " + str(checklist_items_about_placeholder_escaping) ^0
"reviews that rendered the file  : " + str(reviews_that_rendered_the_template) ^0
"" ^0

# ---- what the review verified ----

"the template review" ^0
"  signatures : " + str(reviewers_per_template) + " per template, and no service may" ^0
"    reference a template until both are collected" ^0
"  checklist : written, and applied to the text of the" ^0
"    template as the reviewer reads it" ^0
"  sent back rather than waved through : " + str(templates_sent_back_and_rewritten) ^0
"  injections found in template text : " + str(injections_found_in_template_text) + ", all fixed" ^0
"  months in place : " + str(months_the_review_has_run) ^0
"  verdict : REVIEWED" ^0
"" ^0
"  blocking the reference until both signatures exist is" ^0
"  the part almost nobody does, and it is why the " + str(injections_found_in_template_text) ^0
"  were found before anything shipped" ^0
"" ^0

# ---- which object carries the answer ----

"two objects" ^0
"  what the reviewer opens : the template" ^0
"  what the recipient receives : the template with " + str(placeholders_per_template) ^0
"    values substituted into it" ^0
"  when the substitution happens : after every signature" ^0
"    has been collected" ^0
"  what the checklist says about the substitution : " + str(checklist_items_about_placeholder_escaping) ^0
"    items" ^0
"  reviews that rendered the template to look : " + str(reviews_that_rendered_the_template) ^0
"" ^0
"  the reviewed object and the sent object differ by" ^0
"  exactly the part a stranger writes" ^0
"" ^0

# ---- what an unescaped placeholder looks like ----

"a placeholder that does not escape" ^0
"  is the template text clean : yes, and both reviewers" ^0
"    were right to sign it" ^0
"  where does the value come from : a field the" ^0
"    counterparty fills in" ^0
"  is the field validated : for length, at the form" ^0
"  is it escaped at render : no; escaping is chosen per" ^0
"    placeholder and this one selects raw" ^0
"  placeholders in that state : " + str(placeholders_rendered_without_escaping) ^0
"  of those, fillable by a stranger : " + str(unescaped_placeholders_a_stranger_can_fill) ^0
"" ^0

# ---- null control ----

# The same review, plus a render step: every template is filled with a probe
# value and the output is diffed against the probe.
placeholders_across_all_templates => nc_placeholders_rendered_and_diffed
96 => nc_placeholders_that_emitted_the_probe_raw
7 => nc_injections_found_in_template_text

"null control - render every template with a probe value" ^0
"  injections found in the text : " + str(nc_injections_found_in_template_text) + ", unchanged" ^0
"  placeholders rendered and diffed : " + str(nc_placeholders_rendered_and_diffed) ^0
"  that emitted the probe raw : " + str(nc_placeholders_that_emitted_the_probe_raw) ^0
"  the review did not get better at reading templates; the" ^0
"  object it reads stopped being the only one anybody" ^0
"  looked at" ^0
"" ^0

# ---- the rule ----

"what a fully reviewed catalogue guarantees" ^0
"  every template's own text is free of injection :" ^0
"    exactly, " + str(reviewers_per_template) + " signatures each, " + str(months_the_review_has_run) + " months, " + str(injections_found_in_template_text) + " found" ^0
"  every message sent is free of injection : not" ^0
"    addressed; the message is the template after" ^0
"    substitution and nothing here renders one" ^0
"" ^0
"reviewing the form and shipping the filled-in form are" ^0
"two readings of two objects; the signature is about the" ^0
"one that was read" ^0
"" ^0

"Two reviewers sign every template against a written checklist, " + str(templates_sent_back_and_rewritten) + " were sent" ^0
"back, and " + str(injections_found_in_template_text) + " injections in template text were caught in " + str(months_the_review_has_run) + " months. The values" ^0
"are substituted after the last signature, so of " + str(placeholders_across_all_templates) + " placeholders " + str(placeholders_rendered_without_escaping) ^0
"render unescaped - " + str(unescaped_per_myriad) + " per ten thousand, across " + str(templates_holding_at_least_one) + " templates - and " + str(unescaped_placeholders_a_stranger_can_fill) + " of them" ^0
"take a value a stranger writes." ^0
```

## Python (deterministic transpilation)

```python
templates_in_the_catalogue = 340
reviewers_per_template = 2
templates_sent_back_and_rewritten = 19
months_the_review_has_run = 26
injections_found_in_template_text = 7
placeholders_across_all_templates = 2180
placeholders_rendered_without_escaping = 96
templates_holding_at_least_one = 23
unescaped_placeholders_a_stranger_can_fill = 41
checklist_items_about_placeholder_escaping = 0
reviews_that_rendered_the_template = 0
placeholders_per_template = int(placeholders_across_all_templates / templates_in_the_catalogue)
placeholders_that_escape = placeholders_across_all_templates - placeholders_rendered_without_escaping
templates_with_none = templates_in_the_catalogue - templates_holding_at_least_one
unescaped_per_myriad = int(placeholders_rendered_without_escaping * 10000 / placeholders_across_all_templates)
templates_affected_per_myriad = int(templates_holding_at_least_one * 10000 / templates_in_the_catalogue)
print("templates in the catalogue      : " + str(templates_in_the_catalogue))
print("reviewers per template          : " + str(reviewers_per_template))
print("sent back and rewritten         : " + str(templates_sent_back_and_rewritten))
print("months the review has run       : " + str(months_the_review_has_run))
print("injections found in the text    : " + str(injections_found_in_template_text))
print("")
print("placeholders across the catalogue : " + str(placeholders_across_all_templates))
print("  per template, mean             : " + str(placeholders_per_template))
print("  that escape                    : " + str(placeholders_that_escape))
print("  rendered without escaping      : " + str(placeholders_rendered_without_escaping))
print("  that a stranger can fill       : " + str(unescaped_placeholders_a_stranger_can_fill))
print("  unescaped share                : " + str(unescaped_per_myriad) + " per ten thousand")
print("")
print("templates holding at least one  : " + str(templates_holding_at_least_one))
print("  holding none                  : " + str(templates_with_none))
print("  share affected                : " + str(templates_affected_per_myriad) + " per ten thousand")
print("checklist items about escaping  : " + str(checklist_items_about_placeholder_escaping))
print("reviews that rendered the file  : " + str(reviews_that_rendered_the_template))
print("")
print("the template review")
print("  signatures : " + str(reviewers_per_template) + " per template, and no service may")
print("    reference a template until both are collected")
print("  checklist : written, and applied to the text of the")
print("    template as the reviewer reads it")
print("  sent back rather than waved through : " + str(templates_sent_back_and_rewritten))
print("  injections found in template text : " + str(injections_found_in_template_text) + ", all fixed")
print("  months in place : " + str(months_the_review_has_run))
print("  verdict : REVIEWED")
print("")
print("  blocking the reference until both signatures exist is")
print("  the part almost nobody does, and it is why the " + str(injections_found_in_template_text))
print("  were found before anything shipped")
print("")
print("two objects")
print("  what the reviewer opens : the template")
print("  what the recipient receives : the template with " + str(placeholders_per_template))
print("    values substituted into it")
print("  when the substitution happens : after every signature")
print("    has been collected")
print("  what the checklist says about the substitution : " + str(checklist_items_about_placeholder_escaping))
print("    items")
print("  reviews that rendered the template to look : " + str(reviews_that_rendered_the_template))
print("")
print("  the reviewed object and the sent object differ by")
print("  exactly the part a stranger writes")
print("")
print("a placeholder that does not escape")
print("  is the template text clean : yes, and both reviewers")
print("    were right to sign it")
print("  where does the value come from : a field the")
print("    counterparty fills in")
print("  is the field validated : for length, at the form")
print("  is it escaped at render : no; escaping is chosen per")
print("    placeholder and this one selects raw")
print("  placeholders in that state : " + str(placeholders_rendered_without_escaping))
print("  of those, fillable by a stranger : " + str(unescaped_placeholders_a_stranger_can_fill))
print("")
nc_placeholders_rendered_and_diffed = placeholders_across_all_templates
nc_placeholders_that_emitted_the_probe_raw = 96
nc_injections_found_in_template_text = 7
print("null control - render every template with a probe value")
print("  injections found in the text : " + str(nc_injections_found_in_template_text) + ", unchanged")
print("  placeholders rendered and diffed : " + str(nc_placeholders_rendered_and_diffed))
print("  that emitted the probe raw : " + str(nc_placeholders_that_emitted_the_probe_raw))
print("  the review did not get better at reading templates; the")
print("  object it reads stopped being the only one anybody")
print("  looked at")
print("")
print("what a fully reviewed catalogue guarantees")
print("  every template's own text is free of injection :")
print("    exactly, " + str(reviewers_per_template) + " signatures each, " + str(months_the_review_has_run) + " months, " + str(injections_found_in_template_text) + " found")
print("  every message sent is free of injection : not")
print("    addressed; the message is the template after")
print("    substitution and nothing here renders one")
print("")
print("reviewing the form and shipping the filled-in form are")
print("two readings of two objects; the signature is about the")
print("one that was read")
print("")
print("Two reviewers sign every template against a written checklist, " + str(templates_sent_back_and_rewritten) + " were sent")
print("back, and " + str(injections_found_in_template_text) + " injections in template text were caught in " + str(months_the_review_has_run) + " months. The values")
print("are substituted after the last signature, so of " + str(placeholders_across_all_templates) + " placeholders " + str(placeholders_rendered_without_escaping))
print("render unescaped - " + str(unescaped_per_myriad) + " per ten thousand, across " + str(templates_holding_at_least_one) + " templates - and " + str(unescaped_placeholders_a_stranger_can_fill) + " of them")
print("take a value a stranger writes.")
```

## stdout (executed)

```text
templates in the catalogue      : 340
reviewers per template          : 2
sent back and rewritten         : 19
months the review has run       : 26
injections found in the text    : 7

placeholders across the catalogue : 2180
  per template, mean             : 6
  that escape                    : 2084
  rendered without escaping      : 96
  that a stranger can fill       : 41
  unescaped share                : 440 per ten thousand

templates holding at least one  : 23
  holding none                  : 317
  share affected                : 676 per ten thousand
checklist items about escaping  : 0
reviews that rendered the file  : 0

the template review
  signatures : 2 per template, and no service may
    reference a template until both are collected
  checklist : written, and applied to the text of the
    template as the reviewer reads it
  sent back rather than waved through : 19
  injections found in template text : 7, all fixed
  months in place : 26
  verdict : REVIEWED

  blocking the reference until both signatures exist is
  the part almost nobody does, and it is why the 7
  were found before anything shipped

two objects
  what the reviewer opens : the template
  what the recipient receives : the template with 6
    values substituted into it
  when the substitution happens : after every signature
    has been collected
  what the checklist says about the substitution : 0
    items
  reviews that rendered the template to look : 0

  the reviewed object and the sent object differ by
  exactly the part a stranger writes

a placeholder that does not escape
  is the template text clean : yes, and both reviewers
    were right to sign it
  where does the value come from : a field the
    counterparty fills in
  is the field validated : for length, at the form
  is it escaped at render : no; escaping is chosen per
    placeholder and this one selects raw
  placeholders in that state : 96
  of those, fillable by a stranger : 41

null control - render every template with a probe value
  injections found in the text : 7, unchanged
  placeholders rendered and diffed : 2180
  that emitted the probe raw : 96
  the review did not get better at reading templates; the
  object it reads stopped being the only one anybody
  looked at

what a fully reviewed catalogue guarantees
  every template's own text is free of injection :
    exactly, 2 signatures each, 26 months, 7 found
  every message sent is free of injection : not
    addressed; the message is the template after
    substitution and nothing here renders one

reviewing the form and shipping the filled-in form are
two readings of two objects; the signature is about the
one that was read

Two reviewers sign every template against a written checklist, 19 were sent
back, and 7 injections in template text were caught in 26 months. The values
are substituted after the last signature, so of 2180 placeholders 96
render unescaped - 440 per ten thousand, across 23 templates - and 41 of them
take a value a stranger writes.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
