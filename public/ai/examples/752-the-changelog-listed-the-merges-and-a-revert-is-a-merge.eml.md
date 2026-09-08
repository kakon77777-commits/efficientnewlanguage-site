<!-- canonical: efficientnewlanguage.org/ai/examples/752-the-changelog-listed-the-merges-and-a-revert-is-a-merge | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 752 — The changelog listed the merges and a revert is a merge

`the_changelog_listed_the_merges_and_a_revert_is_a_merge.eml` - The changelog is generated from merged pull requests rather than written by hand, so nothing that shipped is missing from it. What "shipped" means to the generator is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The changelog is
# generated from merged pull requests rather than written by hand, so nothing
# that shipped is missing from it. What "shipped" means to the generator is
# computed below.
#
# Generating it was the right call. A hand-written changelog omits whatever the
# author forgot, which is reliably the small fix that mattered to one customer;
# this one is built from the merge commits themselves, groups by the label on
# the pull request, links each entry to its diff, and it has not missed an entry
# since it replaced the hand-written file two years ago.
#
# The generator's population is MERGES. A revert is a merge, so a change that
# shipped and was taken back appears as two entries, and a change that was
# reverted and re-landed appears as three.
#
# Forty-one of last year's entries describe work that is not in the product.

1240 => entries_last_year
41 => entries_describing_reverted_work
2 => years_since_the_handwritten_file
0 => entries_missed_since_then
0 => entries_marked_as_reverted
0 => generator_steps_that_read_the_revert_relation
1 => populations_the_generator_ranges_over

entries_last_year - entries_describing_reverted_work => entries_describing_shipped_work
int(entries_describing_reverted_work * 10000 / entries_last_year) => stale_entries_per_myriad

"entries last year               : " + str(entries_last_year) ^0
"  describing work in the product: " + str(entries_describing_shipped_work) ^0
"  describing reverted work      : " + str(entries_describing_reverted_work) ^0
"  share                         : " + str(stale_entries_per_myriad) + " per ten thousand" ^0
"  marked as reverted            : " + str(entries_marked_as_reverted) ^0
"" ^0
"years since the hand-written file : " + str(years_since_the_handwritten_file) ^0
"entries missed since then         : " + str(entries_missed_since_then) ^0
"populations the generator ranges over : " + str(populations_the_generator_ranges_over) ^0
"generator steps reading the revert relation : " ^0
"  " + str(generator_steps_that_read_the_revert_relation) ^0
"" ^0

# ---- what generating it verified ----

"the generated changelog" ^0
"  what a hand-written one omits : whatever the author" ^0
"    forgot, reliably the small fix one customer needed" ^0
"  what this is built from : the merge commits themselves" ^0
"  grouping : by the label on the pull request" ^0
"  each entry links to : its diff" ^0
"  entries missed in " + str(years_since_the_handwritten_file) + " years : " + str(entries_missed_since_then) ^0
"  verdict : NOTHING THAT MERGED IS MISSING" ^0
"" ^0
"  building it from the merges rather than from memory is" ^0
"  the whole improvement, and the zero is real" ^0
"" ^0

# ---- what the population is ----

"the generator's input" ^0
"  what it enumerates : merges" ^0
"  what a revert is : a merge" ^0
"  what a re-land after a revert is : a third merge" ^0
"  does the generator know which is which : it reads the" ^0
"    title and the label, not the relation" ^0
"  steps that read the revert relation : " ^0
"    " + str(generator_steps_that_read_the_revert_relation) ^0
"  entries describing work that is not there : " ^0
"    " + str(entries_describing_reverted_work) ^0
"" ^0
"  the completeness claim is exact and it is a claim about" ^0
"  merges, which is not the noun in the document's title" ^0
"" ^0

# ---- who reads it ----

# A customer reading the release notes for a version takes each line as a
# statement about what the product does. A support engineer searching it for a
# fix finds the entry, quotes the version, and the fix is not there.
"one stale entry" ^0
"  what it says : this was fixed in this version" ^0
"  was it merged in that version : yes" ^0
"  was it reverted before the release : yes" ^0
"  is there a second entry saying so : yes, worded as a" ^0
"    change of its own" ^0
"  do the two link to each other : " ^0
"    " + str(entries_marked_as_reverted) + " entries carry the relation" ^0
"  what a reader does with two unrelated lines : reads two" ^0
"    changes" ^0
"" ^0

# ---- the revert is honest ----

# Nobody hid anything. The revert was merged openly, with a title saying what
# it reverted, and it appears in the changelog exactly as the generator was
# built to make things appear.
"the revert itself" ^0
"  merged openly : yes" ^0
"  titled as a revert : yes" ^0
"  present in the changelog : yes, as an entry" ^0
"  is the generator misreporting it : no" ^0
"  is either entry false : no" ^0
"  is their conjunction what a reader takes away : no" ^0
"" ^0

# ---- null control ----

# The same generator, resolving the revert relation: a reverted change and its
# revert cancel, and a re-land restores one entry rather than adding a third.
0 => nc_entries_describing_reverted_work
1 => nc_generator_steps_that_read_the_revert_relation
entries_describing_shipped_work => nc_entries_last_year

"null control - the generator resolves reverts" ^0
"  entries missed : " + str(entries_missed_since_then) + ", unchanged" ^0
"  steps reading the revert relation : " ^0
"    " + str(nc_generator_steps_that_read_the_revert_relation) ^0
"  entries describing reverted work : " ^0
"    " + str(nc_entries_describing_reverted_work) ^0
"  entries last year : " + str(nc_entries_last_year) + ", down from " + str(entries_last_year) ^0
"  the changelog did not lose anything; the count fell" ^0
"  because it had been reporting a change and its undoing" ^0
"  as two changes" ^0
"" ^0

# ---- the rule ----

"what a generated changelog guarantees" ^0
"  everything that merged appears : exactly, for " ^0
"    " + str(years_since_the_handwritten_file) + " years, which a hand-written file never managed" ^0
"  everything that appears is in the product : not" ^0
"    addressed; the generator enumerates merges and the" ^0
"    product is a state" ^0
"" ^0
"generating a document from an event log makes it complete" ^0
"over events and silent about their composition; a change and" ^0
"its reversal are two events and no change at all, and" ^0
"nothing in the log says which pairs cancel" ^0
"" ^0

"Generating it from the merges rather than by hand is the right call and it has" ^0
"missed " + str(entries_missed_since_then) + " entries in " + str(years_since_the_handwritten_file) + " years, grouped by label with a link to every diff." ^0
"Its population is merges and a revert is a merge, so " + str(entries_describing_reverted_work) + " of " + str(entries_last_year) + " entries -" ^0
str(stale_entries_per_myriad) + " per ten thousand - describe work that is not in the product, " + str(entries_marked_as_reverted) ^0
"of them marked as such." ^0
```

## Python (deterministic transpilation)

```python
entries_last_year = 1240
entries_describing_reverted_work = 41
years_since_the_handwritten_file = 2
entries_missed_since_then = 0
entries_marked_as_reverted = 0
generator_steps_that_read_the_revert_relation = 0
populations_the_generator_ranges_over = 1
entries_describing_shipped_work = entries_last_year - entries_describing_reverted_work
stale_entries_per_myriad = int(entries_describing_reverted_work * 10000 / entries_last_year)
print("entries last year               : " + str(entries_last_year))
print("  describing work in the product: " + str(entries_describing_shipped_work))
print("  describing reverted work      : " + str(entries_describing_reverted_work))
print("  share                         : " + str(stale_entries_per_myriad) + " per ten thousand")
print("  marked as reverted            : " + str(entries_marked_as_reverted))
print("")
print("years since the hand-written file : " + str(years_since_the_handwritten_file))
print("entries missed since then         : " + str(entries_missed_since_then))
print("populations the generator ranges over : " + str(populations_the_generator_ranges_over))
print("generator steps reading the revert relation : ")
print("  " + str(generator_steps_that_read_the_revert_relation))
print("")
print("the generated changelog")
print("  what a hand-written one omits : whatever the author")
print("    forgot, reliably the small fix one customer needed")
print("  what this is built from : the merge commits themselves")
print("  grouping : by the label on the pull request")
print("  each entry links to : its diff")
print("  entries missed in " + str(years_since_the_handwritten_file) + " years : " + str(entries_missed_since_then))
print("  verdict : NOTHING THAT MERGED IS MISSING")
print("")
print("  building it from the merges rather than from memory is")
print("  the whole improvement, and the zero is real")
print("")
print("the generator's input")
print("  what it enumerates : merges")
print("  what a revert is : a merge")
print("  what a re-land after a revert is : a third merge")
print("  does the generator know which is which : it reads the")
print("    title and the label, not the relation")
print("  steps that read the revert relation : ")
print("    " + str(generator_steps_that_read_the_revert_relation))
print("  entries describing work that is not there : ")
print("    " + str(entries_describing_reverted_work))
print("")
print("  the completeness claim is exact and it is a claim about")
print("  merges, which is not the noun in the document's title")
print("")
print("one stale entry")
print("  what it says : this was fixed in this version")
print("  was it merged in that version : yes")
print("  was it reverted before the release : yes")
print("  is there a second entry saying so : yes, worded as a")
print("    change of its own")
print("  do the two link to each other : ")
print("    " + str(entries_marked_as_reverted) + " entries carry the relation")
print("  what a reader does with two unrelated lines : reads two")
print("    changes")
print("")
print("the revert itself")
print("  merged openly : yes")
print("  titled as a revert : yes")
print("  present in the changelog : yes, as an entry")
print("  is the generator misreporting it : no")
print("  is either entry false : no")
print("  is their conjunction what a reader takes away : no")
print("")
nc_entries_describing_reverted_work = 0
nc_generator_steps_that_read_the_revert_relation = 1
nc_entries_last_year = entries_describing_shipped_work
print("null control - the generator resolves reverts")
print("  entries missed : " + str(entries_missed_since_then) + ", unchanged")
print("  steps reading the revert relation : ")
print("    " + str(nc_generator_steps_that_read_the_revert_relation))
print("  entries describing reverted work : ")
print("    " + str(nc_entries_describing_reverted_work))
print("  entries last year : " + str(nc_entries_last_year) + ", down from " + str(entries_last_year))
print("  the changelog did not lose anything; the count fell")
print("  because it had been reporting a change and its undoing")
print("  as two changes")
print("")
print("what a generated changelog guarantees")
print("  everything that merged appears : exactly, for ")
print("    " + str(years_since_the_handwritten_file) + " years, which a hand-written file never managed")
print("  everything that appears is in the product : not")
print("    addressed; the generator enumerates merges and the")
print("    product is a state")
print("")
print("generating a document from an event log makes it complete")
print("over events and silent about their composition; a change and")
print("its reversal are two events and no change at all, and")
print("nothing in the log says which pairs cancel")
print("")
print("Generating it from the merges rather than by hand is the right call and it has")
print("missed " + str(entries_missed_since_then) + " entries in " + str(years_since_the_handwritten_file) + " years, grouped by label with a link to every diff.")
print("Its population is merges and a revert is a merge, so " + str(entries_describing_reverted_work) + " of " + str(entries_last_year) + " entries -")
print(str(stale_entries_per_myriad) + " per ten thousand - describe work that is not in the product, " + str(entries_marked_as_reverted))
print("of them marked as such.")
```

## stdout (executed)

```text
entries last year               : 1240
  describing work in the product: 1199
  describing reverted work      : 41
  share                         : 330 per ten thousand
  marked as reverted            : 0

years since the hand-written file : 2
entries missed since then         : 0
populations the generator ranges over : 1
generator steps reading the revert relation : 
  0

the generated changelog
  what a hand-written one omits : whatever the author
    forgot, reliably the small fix one customer needed
  what this is built from : the merge commits themselves
  grouping : by the label on the pull request
  each entry links to : its diff
  entries missed in 2 years : 0
  verdict : NOTHING THAT MERGED IS MISSING

  building it from the merges rather than from memory is
  the whole improvement, and the zero is real

the generator's input
  what it enumerates : merges
  what a revert is : a merge
  what a re-land after a revert is : a third merge
  does the generator know which is which : it reads the
    title and the label, not the relation
  steps that read the revert relation : 
    0
  entries describing work that is not there : 
    41

  the completeness claim is exact and it is a claim about
  merges, which is not the noun in the document's title

one stale entry
  what it says : this was fixed in this version
  was it merged in that version : yes
  was it reverted before the release : yes
  is there a second entry saying so : yes, worded as a
    change of its own
  do the two link to each other : 
    0 entries carry the relation
  what a reader does with two unrelated lines : reads two
    changes

the revert itself
  merged openly : yes
  titled as a revert : yes
  present in the changelog : yes, as an entry
  is the generator misreporting it : no
  is either entry false : no
  is their conjunction what a reader takes away : no

null control - the generator resolves reverts
  entries missed : 0, unchanged
  steps reading the revert relation : 
    1
  entries describing reverted work : 
    0
  entries last year : 1199, down from 1240
  the changelog did not lose anything; the count fell
  because it had been reporting a change and its undoing
  as two changes

what a generated changelog guarantees
  everything that merged appears : exactly, for 
    2 years, which a hand-written file never managed
  everything that appears is in the product : not
    addressed; the generator enumerates merges and the
    product is a state

generating a document from an event log makes it complete
over events and silent about their composition; a change and
its reversal are two events and no change at all, and
nothing in the log says which pairs cancel

Generating it from the merges rather than by hand is the right call and it has
missed 0 entries in 2 years, grouped by label with a link to every diff.
Its population is merges and a revert is a merge, so 41 of 1240 entries -
330 per ten thousand - describe work that is not in the product, 0
of them marked as such.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
