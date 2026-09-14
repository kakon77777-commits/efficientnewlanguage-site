<!-- canonical: efficientnewlanguage.org/ai/examples/851-the-versions-were-compared-as-strings | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 851 — The versions were compared as strings

`the_versions_were_compared_as_strings.eml` - The deploy picks the latest version by taking the maximum of the version column, and the maximum is computed correctly. What kind of maximum it is is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The deploy picks
# the latest version by taking the maximum of the version column, and the
# maximum is computed correctly. What kind of maximum it is is computed below.
#
# The selection is careful. It reads the real version column, not a mutable
# 'latest' pointer; it uses the database's own MAX; it runs over every published
# version; and picking the greatest is exactly what 'deploy the latest' means.
#
# The version column is text, so MAX is the lexicographically greatest string,
# not the highest version.

47 => published_versions
910 => lexical_max_encodes_version_1_9
9100 => intended_max_encodes_version_1_10
1 => versions_deployed
0 => releases_between_1_9_and_1_10_that_are_live

intended_max_encodes_version_1_10 - lexical_max_encodes_version_1_9 => versions_the_wrong_pick_is_behind_by_tenths
1 => deploys_that_shipped_the_older_release

"published versions              : " + str(published_versions) ^0
"lexical max (as text)           : selects 1.9" ^0
"intended max (as version)       : 1.10" ^0
"  1.10 is newer than 1.9 by     : one minor release" ^0
"deploys that shipped the older  : " + str(deploys_that_shipped_the_older_release) ^0
"live releases newer than picked : " + str(releases_between_1_9_and_1_10_that_are_live) ^0
"" ^0

# ---- what the selection verified ----

"the latest-version selection" ^0
"  reads : the real version column, not a 'latest' pointer" ^0
"  operator : the database's own MAX" ^0
"  over : every published version" ^0
"  intent : deploy the greatest version" ^0
"  mutable pointers that could be stale : 0" ^0
"  verdict : DEPLOY THE MAX" ^0
"" ^0
"  reading the column rather than a mutable 'latest'" ^0
"  pointer is the part done right here, and it is why the" ^0
"  pick is not a stale tag" ^0
"" ^0

# ---- what kind of maximum ----

"MAX over a text column" ^0
"  what it compares : strings, character by character" ^0
"  '1.10' against '1.9' : '1' = '1', '.' = '.', then '1' <" ^0
"    '9', so '1.10' < '1.9'" ^0
"  so the text maximum : '1.9'" ^0
"  the version maximum : 1.10, which is newer" ^0
"  the two disagree exactly when : a later component has" ^0
"    more digits" ^0
"" ^0

# ---- what shipped ----

"the deploy" ^0
"  version the query picked : 1.9" ^0
"  newest published version : 1.10" ^0
"  what shipped : the older release, as 'latest'" ^0
"  is MAX wrong : no; '1.9' is the greatest string" ^0
"  is the greatest string the newest version : no, once a" ^0
"    component crosses ten" ^0
"" ^0

# ---- null control ----

# The same versions, compared by their numeric components (or as a semantic
# version type) rather than as text.
910 => nc_text_pick_encodes_1_9
9100 => nc_numeric_pick_encodes_1_10
1 => nc_deploys_that_would_flip

"null control - compare by numeric components" ^0
"  text comparison picks : 1.9" ^0
"  component comparison picks : 1.10" ^0
"  deploys that would flip to the newer : " ^0
"    " + str(nc_deploys_that_would_flip) ^0
"  no version and no MAX changed; the comparison stopped" ^0
"  ranking the digits as characters" ^0
"" ^0

# ---- the rule ----

"what MAX(version) guarantees" ^0
"  the selected value is the greatest in the column :" ^0
"    exactly, the engine's own MAX over every row" ^0
"  the selected version is the newest : not addressed; the" ^0
"    column is text, so MAX is the lexicographically" ^0
"    greatest string - '1.9' beats '1.10', and the deploy" ^0
"    shipped the older release as latest" ^0
"" ^0

"a maximum is only as meaningful as the order it maximizes over, and text order" ^0
"ranks '1.10' below '1.9' because it reads the second digit before the length;" ^0
"the greatest string is not the greatest number it spells" ^0
"" ^0

"It reads the real column with the engine's MAX over every version - a correct" ^0
"string maximum. The column is text, so '1.9' outranks '1.10' character by" ^0
"character, and the deploy shipped 1.9 as the latest while 1.10 sat newer and" ^0
"unpicked, under " + str(deploys_that_shipped_the_older_release) + " deploy of the older release." ^0
```

## Python (deterministic transpilation)

```python
published_versions = 47
lexical_max_encodes_version_1_9 = 910
intended_max_encodes_version_1_10 = 9100
versions_deployed = 1
releases_between_1_9_and_1_10_that_are_live = 0
versions_the_wrong_pick_is_behind_by_tenths = intended_max_encodes_version_1_10 - lexical_max_encodes_version_1_9
deploys_that_shipped_the_older_release = 1
print("published versions              : " + str(published_versions))
print("lexical max (as text)           : selects 1.9")
print("intended max (as version)       : 1.10")
print("  1.10 is newer than 1.9 by     : one minor release")
print("deploys that shipped the older  : " + str(deploys_that_shipped_the_older_release))
print("live releases newer than picked : " + str(releases_between_1_9_and_1_10_that_are_live))
print("")
print("the latest-version selection")
print("  reads : the real version column, not a 'latest' pointer")
print("  operator : the database's own MAX")
print("  over : every published version")
print("  intent : deploy the greatest version")
print("  mutable pointers that could be stale : 0")
print("  verdict : DEPLOY THE MAX")
print("")
print("  reading the column rather than a mutable 'latest'")
print("  pointer is the part done right here, and it is why the")
print("  pick is not a stale tag")
print("")
print("MAX over a text column")
print("  what it compares : strings, character by character")
print("  '1.10' against '1.9' : '1' = '1', '.' = '.', then '1' <")
print("    '9', so '1.10' < '1.9'")
print("  so the text maximum : '1.9'")
print("  the version maximum : 1.10, which is newer")
print("  the two disagree exactly when : a later component has")
print("    more digits")
print("")
print("the deploy")
print("  version the query picked : 1.9")
print("  newest published version : 1.10")
print("  what shipped : the older release, as 'latest'")
print("  is MAX wrong : no; '1.9' is the greatest string")
print("  is the greatest string the newest version : no, once a")
print("    component crosses ten")
print("")
nc_text_pick_encodes_1_9 = 910
nc_numeric_pick_encodes_1_10 = 9100
nc_deploys_that_would_flip = 1
print("null control - compare by numeric components")
print("  text comparison picks : 1.9")
print("  component comparison picks : 1.10")
print("  deploys that would flip to the newer : ")
print("    " + str(nc_deploys_that_would_flip))
print("  no version and no MAX changed; the comparison stopped")
print("  ranking the digits as characters")
print("")
print("what MAX(version) guarantees")
print("  the selected value is the greatest in the column :")
print("    exactly, the engine's own MAX over every row")
print("  the selected version is the newest : not addressed; the")
print("    column is text, so MAX is the lexicographically")
print("    greatest string - '1.9' beats '1.10', and the deploy")
print("    shipped the older release as latest")
print("")
print("a maximum is only as meaningful as the order it maximizes over, and text order")
print("ranks '1.10' below '1.9' because it reads the second digit before the length;")
print("the greatest string is not the greatest number it spells")
print("")
print("It reads the real column with the engine's MAX over every version - a correct")
print("string maximum. The column is text, so '1.9' outranks '1.10' character by")
print("character, and the deploy shipped 1.9 as the latest while 1.10 sat newer and")
print("unpicked, under " + str(deploys_that_shipped_the_older_release) + " deploy of the older release.")
```

## stdout (executed)

```text
published versions              : 47
lexical max (as text)           : selects 1.9
intended max (as version)       : 1.10
  1.10 is newer than 1.9 by     : one minor release
deploys that shipped the older  : 1
live releases newer than picked : 0

the latest-version selection
  reads : the real version column, not a 'latest' pointer
  operator : the database's own MAX
  over : every published version
  intent : deploy the greatest version
  mutable pointers that could be stale : 0
  verdict : DEPLOY THE MAX

  reading the column rather than a mutable 'latest'
  pointer is the part done right here, and it is why the
  pick is not a stale tag

MAX over a text column
  what it compares : strings, character by character
  '1.10' against '1.9' : '1' = '1', '.' = '.', then '1' <
    '9', so '1.10' < '1.9'
  so the text maximum : '1.9'
  the version maximum : 1.10, which is newer
  the two disagree exactly when : a later component has
    more digits

the deploy
  version the query picked : 1.9
  newest published version : 1.10
  what shipped : the older release, as 'latest'
  is MAX wrong : no; '1.9' is the greatest string
  is the greatest string the newest version : no, once a
    component crosses ten

null control - compare by numeric components
  text comparison picks : 1.9
  component comparison picks : 1.10
  deploys that would flip to the newer : 
    1
  no version and no MAX changed; the comparison stopped
  ranking the digits as characters

what MAX(version) guarantees
  the selected value is the greatest in the column :
    exactly, the engine's own MAX over every row
  the selected version is the newest : not addressed; the
    column is text, so MAX is the lexicographically
    greatest string - '1.9' beats '1.10', and the deploy
    shipped the older release as latest

a maximum is only as meaningful as the order it maximizes over, and text order
ranks '1.10' below '1.9' because it reads the second digit before the length;
the greatest string is not the greatest number it spells

It reads the real column with the engine's MAX over every version - a correct
string maximum. The column is text, so '1.9' outranks '1.10' character by
character, and the deploy shipped 1.9 as the latest while 1.10 sat newer and
unpicked, under 1 deploy of the older release.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
