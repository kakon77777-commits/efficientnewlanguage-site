<!-- canonical: efficientnewlanguage.org/ai/examples/678-the-diff-was-reviewed-and-the-generated-file-was-not | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 678 — The diff was reviewed and the generated file was not

`the_diff_was_reviewed_and_the_generated_file_was_not.eml` - Two people reviewed every line of the change and approved it. How many lines were in the change is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two people
# reviewed every line of the change and approved it. How many lines were in the
# change is computed below.
#
# The review is real. Two approvals are required, from people who did not write
# the code; the reviewers read the eighty-four lines, asked two questions and
# had one of them answered with an edit. Nobody rubber-stamped anything and the
# process has caught defects that tests did not.
#
# What a reviewer reads is what the diff view SHOWS. Generated files are marked
# in the repository's attributes so they collapse — a rule added because a
# lockfile update used to bury a one-line change under nine thousand lines of
# churn, which is a real problem and this is the standard fix.
#
# The change also updated a lockfile. Inside it, one package's resolved URL
# points somewhere else.

84 => lines_a_reviewer_saw
12400 => lines_in_collapsed_generated_files
2 => reviewers
2 => approvals
1 => substituted_packages
0 => rubber_stamps

lines_a_reviewer_saw + lines_in_collapsed_generated_files => lines_in_the_change
int(lines_in_collapsed_generated_files * 10000 / lines_in_the_change) => collapsed_per_myriad

"lines a reviewer saw           : " + str(lines_a_reviewer_saw) ^0
"lines in collapsed files       : " + str(lines_in_collapsed_generated_files) ^0
"lines in the change            : " + str(lines_in_the_change) ^0
"share collapsed                : " + str(collapsed_per_myriad) + " per ten thousand" ^0
"" ^0
"reviewers                      : " + str(reviewers) ^0
"approvals                      : " + str(approvals) ^0
"substituted packages           : " + str(substituted_packages) ^0
"" ^0

# ---- what the review verified ----

"the review" ^0
"  approvals required : " + str(approvals) + ", from people who did not write it" ^0
"  lines read         : " + str(lines_a_reviewer_saw) ^0
"  questions asked    : 2" ^0
"  answered with an edit : 1" ^0
"  rubber stamps      : " + str(rubber_stamps) ^0
"  verdict            : REVIEWED" ^0
"" ^0
"  this process has caught defects the tests did not, and" ^0
"  the reviewers were reading rather than clicking" ^0
"" ^0

# ---- why the rest is collapsed ----

"the generated-file rule" ^0
"  added because      : a lockfile update buried a one-line" ^0
"    change under nine thousand lines of churn" ^0
"  is that a real problem : yes, and reviewers stopped" ^0
"    reading everything when it happened" ^0
"  the rule            : mark them generated, collapse them" ^0
"  what it assumes     : generated content is a function of" ^0
"    reviewed content" ^0
"" ^0
"  that assumption holds for a stub regenerated from a" ^0
"  schema in the same change; a lockfile also records where" ^0
"  each package came from" ^0
"" ^0

# ---- what a lockfile carries ----

"one line inside the collapsed region" ^0
"  package         : unchanged name, unchanged version" ^0
"  resolved url    : a different host" ^0
"  integrity hash  : present, and matching the thing at" ^0
"    that host" ^0
"  what a checker would compare it to : nothing; the hash" ^0
"    attests the download, not the origin" ^0
"" ^0

# ---- why the tooling did not object ----

# The install succeeds, the hash matches, the tests pass. Every automated check
# in the pipeline is a check on the artifact rather than on where it came from.
"the pipeline" ^0
"  install         : succeeds" ^0
"  integrity hash  : matches" ^0
"  tests           : pass" ^0
"  a check on the origin : none" ^0
"  approvals       : " + str(approvals) ^0
"" ^0

# ---- null control ----

# The same rule, with generated files collapsed by default and the resolved
# hosts extracted into a small file that is not collapsed.
1 => nc_lines_shown_from_the_lockfile
0 => nc_substitutions_reaching_main

"null control - resolved hosts summarised into an uncollapsed file" ^0
"  lines a reviewer reads : " + str(lines_a_reviewer_saw) + " plus " + str(nc_lines_shown_from_the_lockfile) ^0
"  churn still collapsed  : yes, the rule still holds" ^0
"  substitutions reaching main : " + str(nc_substitutions_reaching_main) ^0
"  the review did not get longer; the part of a generated" ^0
"  file that is not derivable from the source came out of" ^0
"  the collapsed region" ^0
"" ^0

# ---- the rule ----

"what two approvals guarantee" ^0
"  two people read the change : exactly, and read it" ^0
"    carefully" ^0
"  two people read what shipped : not addressed; the diff" ^0
"    view decides what a reviewer is shown, and it was" ^0
"    configured to hide the part nobody could usefully read" ^0
"" ^0
"collapsing generated files assumes they are a function of" ^0
"what was reviewed; a lockfile is mostly that and partly a" ^0
"record of provenance, and the second part is the part worth" ^0
"reading" ^0
"" ^0

"Two reviewers read all " + str(lines_a_reviewer_saw) + " lines the diff showed, asked two questions, had one" ^0
"answered with an edit, and " + str(rubber_stamps) + " approvals were rubber stamps. The change contains" ^0
str(lines_in_the_change) + " lines, of which " + str(lines_in_collapsed_generated_files) + " are collapsed as generated - " + str(collapsed_per_myriad) + " per ten" ^0
"thousand - and " + str(substituted_packages) + " package inside that region now resolves from a different host" ^0
"with an integrity hash that matches what is there." ^0
```

## Python (deterministic transpilation)

```python
lines_a_reviewer_saw = 84
lines_in_collapsed_generated_files = 12400
reviewers = 2
approvals = 2
substituted_packages = 1
rubber_stamps = 0
lines_in_the_change = lines_a_reviewer_saw + lines_in_collapsed_generated_files
collapsed_per_myriad = int(lines_in_collapsed_generated_files * 10000 / lines_in_the_change)
print("lines a reviewer saw           : " + str(lines_a_reviewer_saw))
print("lines in collapsed files       : " + str(lines_in_collapsed_generated_files))
print("lines in the change            : " + str(lines_in_the_change))
print("share collapsed                : " + str(collapsed_per_myriad) + " per ten thousand")
print("")
print("reviewers                      : " + str(reviewers))
print("approvals                      : " + str(approvals))
print("substituted packages           : " + str(substituted_packages))
print("")
print("the review")
print("  approvals required : " + str(approvals) + ", from people who did not write it")
print("  lines read         : " + str(lines_a_reviewer_saw))
print("  questions asked    : 2")
print("  answered with an edit : 1")
print("  rubber stamps      : " + str(rubber_stamps))
print("  verdict            : REVIEWED")
print("")
print("  this process has caught defects the tests did not, and")
print("  the reviewers were reading rather than clicking")
print("")
print("the generated-file rule")
print("  added because      : a lockfile update buried a one-line")
print("    change under nine thousand lines of churn")
print("  is that a real problem : yes, and reviewers stopped")
print("    reading everything when it happened")
print("  the rule            : mark them generated, collapse them")
print("  what it assumes     : generated content is a function of")
print("    reviewed content")
print("")
print("  that assumption holds for a stub regenerated from a")
print("  schema in the same change; a lockfile also records where")
print("  each package came from")
print("")
print("one line inside the collapsed region")
print("  package         : unchanged name, unchanged version")
print("  resolved url    : a different host")
print("  integrity hash  : present, and matching the thing at")
print("    that host")
print("  what a checker would compare it to : nothing; the hash")
print("    attests the download, not the origin")
print("")
print("the pipeline")
print("  install         : succeeds")
print("  integrity hash  : matches")
print("  tests           : pass")
print("  a check on the origin : none")
print("  approvals       : " + str(approvals))
print("")
nc_lines_shown_from_the_lockfile = 1
nc_substitutions_reaching_main = 0
print("null control - resolved hosts summarised into an uncollapsed file")
print("  lines a reviewer reads : " + str(lines_a_reviewer_saw) + " plus " + str(nc_lines_shown_from_the_lockfile))
print("  churn still collapsed  : yes, the rule still holds")
print("  substitutions reaching main : " + str(nc_substitutions_reaching_main))
print("  the review did not get longer; the part of a generated")
print("  file that is not derivable from the source came out of")
print("  the collapsed region")
print("")
print("what two approvals guarantee")
print("  two people read the change : exactly, and read it")
print("    carefully")
print("  two people read what shipped : not addressed; the diff")
print("    view decides what a reviewer is shown, and it was")
print("    configured to hide the part nobody could usefully read")
print("")
print("collapsing generated files assumes they are a function of")
print("what was reviewed; a lockfile is mostly that and partly a")
print("record of provenance, and the second part is the part worth")
print("reading")
print("")
print("Two reviewers read all " + str(lines_a_reviewer_saw) + " lines the diff showed, asked two questions, had one")
print("answered with an edit, and " + str(rubber_stamps) + " approvals were rubber stamps. The change contains")
print(str(lines_in_the_change) + " lines, of which " + str(lines_in_collapsed_generated_files) + " are collapsed as generated - " + str(collapsed_per_myriad) + " per ten")
print("thousand - and " + str(substituted_packages) + " package inside that region now resolves from a different host")
print("with an integrity hash that matches what is there.")
```

## stdout (executed)

```text
lines a reviewer saw           : 84
lines in collapsed files       : 12400
lines in the change            : 12484
share collapsed                : 9932 per ten thousand

reviewers                      : 2
approvals                      : 2
substituted packages           : 1

the review
  approvals required : 2, from people who did not write it
  lines read         : 84
  questions asked    : 2
  answered with an edit : 1
  rubber stamps      : 0
  verdict            : REVIEWED

  this process has caught defects the tests did not, and
  the reviewers were reading rather than clicking

the generated-file rule
  added because      : a lockfile update buried a one-line
    change under nine thousand lines of churn
  is that a real problem : yes, and reviewers stopped
    reading everything when it happened
  the rule            : mark them generated, collapse them
  what it assumes     : generated content is a function of
    reviewed content

  that assumption holds for a stub regenerated from a
  schema in the same change; a lockfile also records where
  each package came from

one line inside the collapsed region
  package         : unchanged name, unchanged version
  resolved url    : a different host
  integrity hash  : present, and matching the thing at
    that host
  what a checker would compare it to : nothing; the hash
    attests the download, not the origin

the pipeline
  install         : succeeds
  integrity hash  : matches
  tests           : pass
  a check on the origin : none
  approvals       : 2

null control - resolved hosts summarised into an uncollapsed file
  lines a reviewer reads : 84 plus 1
  churn still collapsed  : yes, the rule still holds
  substitutions reaching main : 0
  the review did not get longer; the part of a generated
  file that is not derivable from the source came out of
  the collapsed region

what two approvals guarantee
  two people read the change : exactly, and read it
    carefully
  two people read what shipped : not addressed; the diff
    view decides what a reviewer is shown, and it was
    configured to hide the part nobody could usefully read

collapsing generated files assumes they are a function of
what was reviewed; a lockfile is mostly that and partly a
record of provenance, and the second part is the part worth
reading

Two reviewers read all 84 lines the diff showed, asked two questions, had one
answered with an edit, and 0 approvals were rubber stamps. The change contains
12484 lines, of which 12400 are collapsed as generated - 9932 per ten
thousand - and 1 package inside that region now resolves from a different host
with an integrity hash that matches what is there.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
