<!-- canonical: efficientnewlanguage.org/ai/examples/853-the-anchor-bound-to-one-alternative | ai_layer_version: 0.1.0 | updated: 2026-09-15 -->

# Example 853 — The anchor bound to one alternative

`the_anchor_bound_to_one_alternative.eml` - A whitelist accepts a value only if it is exactly "cat" or "dog", and it uses the regex engine correctly on every value. What the anchors bind to is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A whitelist accepts
# a value only if it is exactly "cat" or "dog", and it uses the regex engine
# correctly on every value. What the anchors bind to is computed below.
#
# The check is careful. It applies the pattern to the real value, not a substring;
# it uses the engine's own regex; it runs on every value; and the intent is
# exactly 'the whole value is one of the two allowed words'.
#
# The pattern is ^cat|dog$, and alternation has the lowest precedence, so it reads
# as (^cat) or (dog$) - each anchor binds to one branch, not to both words.

100000 => values_tested
40000 => exactly_cat_or_dog
500 => starts_with_cat_or_ends_with_dog_not_exact

exactly_cat_or_dog + starts_with_cat_or_ends_with_dog_not_exact => accepted_by_ungrouped
exactly_cat_or_dog => accepted_by_grouped
accepted_by_ungrouped - accepted_by_grouped => wrongly_accepted
int(wrongly_accepted * 10000 / accepted_by_ungrouped) => wrongly_accepted_share_per_myriad

"values tested                   : " + str(values_tested) ^0
"  exactly cat or dog            : " + str(exactly_cat_or_dog) ^0
"  start-cat or end-dog, not exact : " + str(starts_with_cat_or_ends_with_dog_not_exact) ^0
"" ^0
"accepted by ^cat|dog$           : " + str(accepted_by_ungrouped) ^0
"accepted by ^(cat|dog)$         : " + str(accepted_by_grouped) ^0
"wrongly accepted                : " + str(wrongly_accepted) ^0
"share of accepted that is neither word : " + str(wrongly_accepted_share_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the check verified ----

"the whitelist" ^0
"  applies to : the real value, not a substring" ^0
"  uses : the engine's own regex" ^0
"  runs on : every value" ^0
"  intent : the whole value is exactly cat or dog" ^0
"  values skipped : 0" ^0
"  verdict : EVERY ACCEPTED VALUE MATCHES THE PATTERN" ^0
"" ^0
"  using the engine's regex over every value is the part" ^0
"  done right here, and it is why a real cat or dog is" ^0
"  always accepted" ^0
"" ^0

# ---- what the anchors bind to ----

"^cat|dog$" ^0
"  precedence of alternation : the lowest of all" ^0
"  so the pattern groups as : (^cat) or (dog$)" ^0
"  what the left branch requires : starts with cat, end free" ^0
"  what the right branch requires : ends with dog, start free" ^0
"  so catfish and hotdog : both match, one per branch" ^0
"" ^0

# ---- what the caller got ----

"the result of the whitelist" ^0
"  values it should accept : the " + str(exactly_cat_or_dog) + " exact words" ^0
"  values it accepted : " + str(accepted_by_ungrouped) + ", prefixes and suffixes too" ^0
"  neither-word values wrongly accepted : " + str(wrongly_accepted) ^0
"  is the pattern malformed : no; it compiles and runs" ^0
"  did the anchors cover both words : no; each bound to one" ^0
"    branch, and the fixtures only used the exact words" ^0
"" ^0

# ---- null control ----

# The same alternation, grouped so the anchors apply to the whole choice:
# ^(cat|dog)$ instead of ^cat|dog$.
500 => nc_neither_word_accepted_ungrouped
0 => nc_neither_word_accepted_grouped
500 => nc_values_the_grouping_rejects

"null control - group the alternation, ^(cat|dog)$" ^0
"  neither-word accepted, ungrouped : " + str(nc_neither_word_accepted_ungrouped) ^0
"  neither-word accepted, grouped : " + str(nc_neither_word_accepted_grouped) ^0
"  values the grouping now rejects : " + str(nc_values_the_grouping_rejects) ^0
"  no value and no alternative changed; the anchors stopped" ^0
"  binding to one branch and started binding to the choice" ^0
"" ^0

# ---- the rule ----

"what a ^cat|dog$ whitelist guarantees" ^0
"  the value matches one of the branches : exactly, the" ^0
"    engine's own match over every value" ^0
"  the value is exactly cat or dog : not addressed;" ^0
"    alternation binds looser than the anchors, so the" ^0
"    pattern is (^cat) or (dog$) and accepts catfish and" ^0
"    hotdog - " + str(wrongly_accepted) + " values that are neither word" ^0
"" ^0

"an anchor attaches to the branch beside it, not to the alternation as a whole;" ^0
"without a group the choice reaches past the anchors, and a whitelist meant to" ^0
"name two exact words instead names two open-ended halves" ^0
"" ^0

"It runs the engine's regex over every value - a real cat or dog always matches." ^0
"But ^cat|dog$ parses as (^cat) or (dog$), so catfish and hotdog pass; " + str(wrongly_accepted) ^0
"neither-word values were accepted, " + str(wrongly_accepted_share_per_myriad) + " per ten thousand of the accepted set," ^0
"until the alternation was grouped." ^0
```

## Python (deterministic transpilation)

```python
values_tested = 100000
exactly_cat_or_dog = 40000
starts_with_cat_or_ends_with_dog_not_exact = 500
accepted_by_ungrouped = exactly_cat_or_dog + starts_with_cat_or_ends_with_dog_not_exact
accepted_by_grouped = exactly_cat_or_dog
wrongly_accepted = accepted_by_ungrouped - accepted_by_grouped
wrongly_accepted_share_per_myriad = int(wrongly_accepted * 10000 / accepted_by_ungrouped)
print("values tested                   : " + str(values_tested))
print("  exactly cat or dog            : " + str(exactly_cat_or_dog))
print("  start-cat or end-dog, not exact : " + str(starts_with_cat_or_ends_with_dog_not_exact))
print("")
print("accepted by ^cat|dog$           : " + str(accepted_by_ungrouped))
print("accepted by ^(cat|dog)$         : " + str(accepted_by_grouped))
print("wrongly accepted                : " + str(wrongly_accepted))
print("share of accepted that is neither word : " + str(wrongly_accepted_share_per_myriad) + " per ten thousand")
print("")
print("the whitelist")
print("  applies to : the real value, not a substring")
print("  uses : the engine's own regex")
print("  runs on : every value")
print("  intent : the whole value is exactly cat or dog")
print("  values skipped : 0")
print("  verdict : EVERY ACCEPTED VALUE MATCHES THE PATTERN")
print("")
print("  using the engine's regex over every value is the part")
print("  done right here, and it is why a real cat or dog is")
print("  always accepted")
print("")
print("^cat|dog$")
print("  precedence of alternation : the lowest of all")
print("  so the pattern groups as : (^cat) or (dog$)")
print("  what the left branch requires : starts with cat, end free")
print("  what the right branch requires : ends with dog, start free")
print("  so catfish and hotdog : both match, one per branch")
print("")
print("the result of the whitelist")
print("  values it should accept : the " + str(exactly_cat_or_dog) + " exact words")
print("  values it accepted : " + str(accepted_by_ungrouped) + ", prefixes and suffixes too")
print("  neither-word values wrongly accepted : " + str(wrongly_accepted))
print("  is the pattern malformed : no; it compiles and runs")
print("  did the anchors cover both words : no; each bound to one")
print("    branch, and the fixtures only used the exact words")
print("")
nc_neither_word_accepted_ungrouped = 500
nc_neither_word_accepted_grouped = 0
nc_values_the_grouping_rejects = 500
print("null control - group the alternation, ^(cat|dog)$")
print("  neither-word accepted, ungrouped : " + str(nc_neither_word_accepted_ungrouped))
print("  neither-word accepted, grouped : " + str(nc_neither_word_accepted_grouped))
print("  values the grouping now rejects : " + str(nc_values_the_grouping_rejects))
print("  no value and no alternative changed; the anchors stopped")
print("  binding to one branch and started binding to the choice")
print("")
print("what a ^cat|dog$ whitelist guarantees")
print("  the value matches one of the branches : exactly, the")
print("    engine's own match over every value")
print("  the value is exactly cat or dog : not addressed;")
print("    alternation binds looser than the anchors, so the")
print("    pattern is (^cat) or (dog$) and accepts catfish and")
print("    hotdog - " + str(wrongly_accepted) + " values that are neither word")
print("")
print("an anchor attaches to the branch beside it, not to the alternation as a whole;")
print("without a group the choice reaches past the anchors, and a whitelist meant to")
print("name two exact words instead names two open-ended halves")
print("")
print("It runs the engine's regex over every value - a real cat or dog always matches.")
print("But ^cat|dog$ parses as (^cat) or (dog$), so catfish and hotdog pass; " + str(wrongly_accepted))
print("neither-word values were accepted, " + str(wrongly_accepted_share_per_myriad) + " per ten thousand of the accepted set,")
print("until the alternation was grouped.")
```

## stdout (executed)

```text
values tested                   : 100000
  exactly cat or dog            : 40000
  start-cat or end-dog, not exact : 500

accepted by ^cat|dog$           : 40500
accepted by ^(cat|dog)$         : 40000
wrongly accepted                : 500
share of accepted that is neither word : 123 per ten thousand

the whitelist
  applies to : the real value, not a substring
  uses : the engine's own regex
  runs on : every value
  intent : the whole value is exactly cat or dog
  values skipped : 0
  verdict : EVERY ACCEPTED VALUE MATCHES THE PATTERN

  using the engine's regex over every value is the part
  done right here, and it is why a real cat or dog is
  always accepted

^cat|dog$
  precedence of alternation : the lowest of all
  so the pattern groups as : (^cat) or (dog$)
  what the left branch requires : starts with cat, end free
  what the right branch requires : ends with dog, start free
  so catfish and hotdog : both match, one per branch

the result of the whitelist
  values it should accept : the 40000 exact words
  values it accepted : 40500, prefixes and suffixes too
  neither-word values wrongly accepted : 500
  is the pattern malformed : no; it compiles and runs
  did the anchors cover both words : no; each bound to one
    branch, and the fixtures only used the exact words

null control - group the alternation, ^(cat|dog)$
  neither-word accepted, ungrouped : 500
  neither-word accepted, grouped : 0
  values the grouping now rejects : 500
  no value and no alternative changed; the anchors stopped
  binding to one branch and started binding to the choice

what a ^cat|dog$ whitelist guarantees
  the value matches one of the branches : exactly, the
    engine's own match over every value
  the value is exactly cat or dog : not addressed;
    alternation binds looser than the anchors, so the
    pattern is (^cat) or (dog$) and accepts catfish and
    hotdog - 500 values that are neither word

an anchor attaches to the branch beside it, not to the alternation as a whole;
without a group the choice reaches past the anchors, and a whitelist meant to
name two exact words instead names two open-ended halves

It runs the engine's regex over every value - a real cat or dog always matches.
But ^cat|dog$ parses as (^cat) or (dog$), so catfish and hotdog pass; 500
neither-word values were accepted, 123 per ten thousand of the accepted set,
until the alternation was grouped.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
