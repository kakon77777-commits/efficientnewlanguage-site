<!-- canonical: efficientnewlanguage.org/ai/examples/643-the-build-was-reproducible-and-the-inputs-were-not-pinned | ai_layer_version: 0.1.0 | updated: 2026-09-01 -->

# Example 643 — The build was reproducible and the inputs were not pinned

`the_build_was_reproducible_and_the_inputs_were_not_pinned.eml` - Two independent builders produce byte-identical artifacts, every time. Whether two builds nine days apart agree is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two independent
# builders produce byte-identical artifacts, every time. Whether two builds nine
# days apart agree is computed below.
#
# The reproducibility is real and it took work. Timestamps are zeroed, the file
# order is sorted, the build path is normalised, no absolute paths leak into the
# binary, and a nightly job builds the same commit on two machines with
# different kernels and compares hashes. It has never disagreed.
#
# Reproducible means: same inputs, same output. It is a property of the
# FUNCTION. It says nothing about whether the input set is the same thing on
# Tuesday that it was the Monday before.
#
# Every direct dependency is pinned to an exact version. Of the transitive
# closure, seven hundred and six resolve through a range, and thirty-one of
# those published a new patch release in the last nine days.

84 => direct_dependencies
84 => direct_pinned_exactly
1247 => transitive_dependencies
706 => transitive_resolved_through_a_range
31 => moved_in_the_last_nine_days
0 => builder_disagreements

direct_dependencies - direct_pinned_exactly => direct_unpinned
transitive_dependencies - transitive_resolved_through_a_range => transitive_pinned

"direct dependencies         : " + str(direct_dependencies) ^0
"  pinned exactly            : " + str(direct_pinned_exactly) ^0
"  unpinned                  : " + str(direct_unpinned) ^0
"transitive dependencies     : " + str(transitive_dependencies) ^0
"  pinned                    : " + str(transitive_pinned) ^0
"  resolved through a range  : " + str(transitive_resolved_through_a_range) ^0
"  moved in the last 9 days  : " + str(moved_in_the_last_nine_days) ^0
"" ^0

# ---- what the nightly comparison verified ----

"two builders, same commit" ^0
"  timestamps zeroed      : yes" ^0
"  file order sorted      : yes" ^0
"  build path normalised  : yes" ^0
"  absolute paths in the binary : 0" ^0
"  hash disagreements     : " + str(builder_disagreements) ^0
"  verdict                : REPRODUCIBLE" ^0
"" ^0
"  the two machines run different kernels and it still" ^0
"  holds; this is not a weak test" ^0
"" ^0

# ---- what it holds fixed ----

"what the two builders share" ^0
"  the commit           : the same" ^0
"  the resolution step  : run once, on one machine, and" ^0
"    its result handed to both" ^0
"" ^0
"  so the comparison holds the input set fixed by" ^0
"  construction, which is the one thing it is being used" ^0
"  as evidence about" ^0
"" ^0

int(transitive_resolved_through_a_range * 10000 / transitive_dependencies) => ranged_per_myriad
"share of the closure behind a range : " + str(ranged_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- the same commit, nine days apart ----

"building the same commit twice" ^0
"  on one day, on two machines : identical" ^0
"  on two days, on one machine : " + str(moved_in_the_last_nine_days) + " packages differ" ^0
"  artifacts identical         : no" ^0
"  either build reproducible   : yes, both" ^0
"" ^0
"  reproducible and different is not a contradiction; the" ^0
"  function is deterministic and it was called twice with" ^0
"  different arguments" ^0
"" ^0

# ---- what the release note claims ----

# The note says "reproducible build, verified", which is true, and readers take
# it to mean the artifact can be recreated from the tag. It can, for as long as
# nothing in the range publishes.
"what a reader takes from it" ^0
"  claim in the release note : reproducible, verified" ^0
"  what a reader wants       : rebuild this tag next year" ^0
"    and get this artifact" ^0
"  packages that would have to not publish : " + str(transitive_resolved_through_a_range) ^0
"" ^0

# ---- null control ----

# The same builders, with the resolved closure committed as a lockfile.
0 => nc_packages_that_can_move
transitive_dependencies => nc_pinned

"null control - the resolved closure committed" ^0
"  builder disagreements   : " + str(builder_disagreements) + ", unchanged" ^0
"  dependencies pinned     : " + str(nc_pinned) ^0
"  packages that can move  : " + str(nc_packages_that_can_move) ^0
"  the build did not become more deterministic; the input" ^0
"  set stopped being a query" ^0
"" ^0

# ---- the rule ----

"what a reproducible build guarantees" ^0
"  same inputs give the same bytes : exactly" ^0
"  the same tag gives the same bytes : not addressed, and" ^0
"    the nightly comparison cannot address it because it" ^0
"    resolves once and hands the result to both machines" ^0
"" ^0
"determinism is about the function; recoverability is about" ^0
"the arguments, and a test that fixes the arguments to compare" ^0
"the function has no opinion on the second" ^0
"" ^0

"The build is reproducible and the nightly comparison is right: " + str(builder_disagreements) + " disagreements" ^0
"across two kernels, 0 absolute paths, timestamps zeroed. All " + str(direct_pinned_exactly) + " direct" ^0
"dependencies are pinned exactly, and " + str(transitive_resolved_through_a_range) + " of the " + str(transitive_dependencies) + " in the closure resolve" ^0
"through a range - " + str(ranged_per_myriad) + " per ten thousand - of which " + str(moved_in_the_last_nine_days) + " published in nine days, so the" ^0
"same commit built twice nine days apart is two different artifacts, both reproducible." ^0
```

## Python (deterministic transpilation)

```python
direct_dependencies = 84
direct_pinned_exactly = 84
transitive_dependencies = 1247
transitive_resolved_through_a_range = 706
moved_in_the_last_nine_days = 31
builder_disagreements = 0
direct_unpinned = direct_dependencies - direct_pinned_exactly
transitive_pinned = transitive_dependencies - transitive_resolved_through_a_range
print("direct dependencies         : " + str(direct_dependencies))
print("  pinned exactly            : " + str(direct_pinned_exactly))
print("  unpinned                  : " + str(direct_unpinned))
print("transitive dependencies     : " + str(transitive_dependencies))
print("  pinned                    : " + str(transitive_pinned))
print("  resolved through a range  : " + str(transitive_resolved_through_a_range))
print("  moved in the last 9 days  : " + str(moved_in_the_last_nine_days))
print("")
print("two builders, same commit")
print("  timestamps zeroed      : yes")
print("  file order sorted      : yes")
print("  build path normalised  : yes")
print("  absolute paths in the binary : 0")
print("  hash disagreements     : " + str(builder_disagreements))
print("  verdict                : REPRODUCIBLE")
print("")
print("  the two machines run different kernels and it still")
print("  holds; this is not a weak test")
print("")
print("what the two builders share")
print("  the commit           : the same")
print("  the resolution step  : run once, on one machine, and")
print("    its result handed to both")
print("")
print("  so the comparison holds the input set fixed by")
print("  construction, which is the one thing it is being used")
print("  as evidence about")
print("")
ranged_per_myriad = int(transitive_resolved_through_a_range * 10000 / transitive_dependencies)
print("share of the closure behind a range : " + str(ranged_per_myriad) + " per ten thousand")
print("")
print("building the same commit twice")
print("  on one day, on two machines : identical")
print("  on two days, on one machine : " + str(moved_in_the_last_nine_days) + " packages differ")
print("  artifacts identical         : no")
print("  either build reproducible   : yes, both")
print("")
print("  reproducible and different is not a contradiction; the")
print("  function is deterministic and it was called twice with")
print("  different arguments")
print("")
print("what a reader takes from it")
print("  claim in the release note : reproducible, verified")
print("  what a reader wants       : rebuild this tag next year")
print("    and get this artifact")
print("  packages that would have to not publish : " + str(transitive_resolved_through_a_range))
print("")
nc_packages_that_can_move = 0
nc_pinned = transitive_dependencies
print("null control - the resolved closure committed")
print("  builder disagreements   : " + str(builder_disagreements) + ", unchanged")
print("  dependencies pinned     : " + str(nc_pinned))
print("  packages that can move  : " + str(nc_packages_that_can_move))
print("  the build did not become more deterministic; the input")
print("  set stopped being a query")
print("")
print("what a reproducible build guarantees")
print("  same inputs give the same bytes : exactly")
print("  the same tag gives the same bytes : not addressed, and")
print("    the nightly comparison cannot address it because it")
print("    resolves once and hands the result to both machines")
print("")
print("determinism is about the function; recoverability is about")
print("the arguments, and a test that fixes the arguments to compare")
print("the function has no opinion on the second")
print("")
print("The build is reproducible and the nightly comparison is right: " + str(builder_disagreements) + " disagreements")
print("across two kernels, 0 absolute paths, timestamps zeroed. All " + str(direct_pinned_exactly) + " direct")
print("dependencies are pinned exactly, and " + str(transitive_resolved_through_a_range) + " of the " + str(transitive_dependencies) + " in the closure resolve")
print("through a range - " + str(ranged_per_myriad) + " per ten thousand - of which " + str(moved_in_the_last_nine_days) + " published in nine days, so the")
print("same commit built twice nine days apart is two different artifacts, both reproducible.")
```

## stdout (executed)

```text
direct dependencies         : 84
  pinned exactly            : 84
  unpinned                  : 0
transitive dependencies     : 1247
  pinned                    : 541
  resolved through a range  : 706
  moved in the last 9 days  : 31

two builders, same commit
  timestamps zeroed      : yes
  file order sorted      : yes
  build path normalised  : yes
  absolute paths in the binary : 0
  hash disagreements     : 0
  verdict                : REPRODUCIBLE

  the two machines run different kernels and it still
  holds; this is not a weak test

what the two builders share
  the commit           : the same
  the resolution step  : run once, on one machine, and
    its result handed to both

  so the comparison holds the input set fixed by
  construction, which is the one thing it is being used
  as evidence about

share of the closure behind a range : 5661 per ten thousand

building the same commit twice
  on one day, on two machines : identical
  on two days, on one machine : 31 packages differ
  artifacts identical         : no
  either build reproducible   : yes, both

  reproducible and different is not a contradiction; the
  function is deterministic and it was called twice with
  different arguments

what a reader takes from it
  claim in the release note : reproducible, verified
  what a reader wants       : rebuild this tag next year
    and get this artifact
  packages that would have to not publish : 706

null control - the resolved closure committed
  builder disagreements   : 0, unchanged
  dependencies pinned     : 1247
  packages that can move  : 0
  the build did not become more deterministic; the input
  set stopped being a query

what a reproducible build guarantees
  same inputs give the same bytes : exactly
  the same tag gives the same bytes : not addressed, and
    the nightly comparison cannot address it because it
    resolves once and hands the result to both machines

determinism is about the function; recoverability is about
the arguments, and a test that fixes the arguments to compare
the function has no opinion on the second

The build is reproducible and the nightly comparison is right: 0 disagreements
across two kernels, 0 absolute paths, timestamps zeroed. All 84 direct
dependencies are pinned exactly, and 706 of the 1247 in the closure resolve
through a range - 5661 per ten thousand - of which 31 published in nine days, so the
same commit built twice nine days apart is two different artifacts, both reproducible.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
