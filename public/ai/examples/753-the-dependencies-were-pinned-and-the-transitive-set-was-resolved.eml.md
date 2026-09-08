<!-- canonical: efficientnewlanguage.org/ai/examples/753-the-dependencies-were-pinned-and-the-transitive-set-was-resolved | ai_layer_version: 0.1.0 | updated: 2026-09-08 -->

# Example 753 — The dependencies were pinned and the transitive set was resolved

`the_dependencies_were_pinned_and_the_transitive_set_was_resolved.eml` - Every direct dependency is pinned to an exact version, reviewed on change, and the build fails on a range. How much of the tree that fixes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every direct
# dependency is pinned to an exact version, reviewed on change, and the build
# fails on a range. How much of the tree that fixes is computed below.
#
# The pinning discipline is real. Nothing is specified as a range or a caret;
# every direct dependency names an exact version; a change to any of them is a
# reviewed diff with a named approver; a lint rule fails the build if a range
# reappears; and this replaced a period where two incidents were traced to a
# minor release nobody chose.
#
# A direct dependency is pinned. Its own dependencies are resolved by the
# package manager at install time from whatever satisfies their ranges, and
# those ranges were written by somebody else.
#
# Forty-one direct dependencies bring in nine hundred and six others.

41 => direct_dependencies
41 => direct_dependencies_pinned_exactly
906 => transitive_dependencies
0 => direct_ranges_allowed_by_the_lint_rule
2 => incidents_before_pinning_traced_to_an_unchosen_release
0 => transitive_versions_recorded_in_the_reviewed_diff
1 => lockfiles_committed
0 => reviews_that_read_the_lockfile_diff

direct_dependencies + transitive_dependencies => packages_in_the_build
int(direct_dependencies_pinned_exactly * 10000 / packages_in_the_build) => pinned_by_review_per_myriad
packages_in_the_build - direct_dependencies_pinned_exactly => packages_chosen_by_the_resolver

"direct dependencies             : " + str(direct_dependencies) ^0
"  pinned to an exact version    : " + str(direct_dependencies_pinned_exactly) ^0
"  ranges the lint rule allows   : " + str(direct_ranges_allowed_by_the_lint_rule) ^0
"incidents before pinning        : " + str(incidents_before_pinning_traced_to_an_unchosen_release) ^0
"" ^0
"transitive dependencies         : " + str(transitive_dependencies) ^0
"packages in the build           : " + str(packages_in_the_build) ^0
"  chosen by a reviewed diff     : " + str(direct_dependencies_pinned_exactly) ^0
"  chosen by the resolver        : " + str(packages_chosen_by_the_resolver) ^0
"  share chosen by review        : " + str(pinned_by_review_per_myriad) + " per ten thousand" ^0
"" ^0
"lockfiles committed             : " + str(lockfiles_committed) ^0
"reviews that read the lockfile diff : " + str(reviews_that_read_the_lockfile_diff) ^0
"transitive versions in the reviewed diff : " + str(transitive_versions_recorded_in_the_reviewed_diff) ^0
"" ^0

# ---- what pinning verified ----

"the pinning rule" ^0
"  ranges or carets anywhere direct : " + str(direct_ranges_allowed_by_the_lint_rule) ^0
"  every direct dependency names : an exact version" ^0
"  a change to one is : a reviewed diff with a named" ^0
"    approver" ^0
"  enforced by : a lint rule that fails the build" ^0
"  what it replaced : a period with " + str(incidents_before_pinning_traced_to_an_unchosen_release) + " incidents traced" ^0
"    to a minor release nobody chose" ^0
"  verdict : PINNED" ^0
"" ^0
"  machine-enforced exact versions on every direct edge is" ^0
"  the strong form of this, and the two incidents stopped" ^0
"" ^0

# ---- what a pin fixes ----

"the scope of one pin" ^0
"  what it fixes : the version of that package" ^0
"  what that package's own manifest contains : ranges" ^0
"  who wrote those ranges : its author, for their reasons" ^0
"  when they are resolved : at install, against whatever" ^0
"    the registry holds then" ^0
"  packages resolved that way : " + str(packages_chosen_by_the_resolver) ^0
"  share of the build a reviewed diff chose : " ^0
"    " + str(pinned_by_review_per_myriad) + " per ten thousand" ^0
"" ^0
"  the discipline is complete over the edges this project" ^0
"  declares, and a build is a closure over all of them" ^0
"" ^0

# ---- the lockfile is not the review ----

# A lockfile exists and is committed, so the resolved set is reproducible. It
# is a generated file of nine hundred lines that changes wholesale, and no
# review has ever read its diff.
"the lockfile" ^0
"  committed : " + str(lockfiles_committed) ^0
"  does it make the build reproducible : yes" ^0
"  does it make the set chosen : no; it records what the" ^0
"    resolver picked" ^0
"  reviews that read its diff : " + str(reviews_that_read_the_lockfile_diff) ^0
"  what a reviewer sees on a routine update : nine hundred" ^0
"    changed lines and an approval to give" ^0
"" ^0

# ---- what the two incidents would look like now ----

"the same failure today" ^0
"  a minor release nobody chose : still possible, one hop" ^0
"    down" ^0
"  would the lint rule fire : no; it checks direct edges" ^0
"  would the reviewed diff show it : the lockfile would" ^0
"    change; " + str(reviews_that_read_the_lockfile_diff) + " reviews read it" ^0
"  would the build fail : no" ^0
"  incidents this class produced before pinning : " ^0
"    " + str(incidents_before_pinning_traced_to_an_unchosen_release) ^0
"" ^0

# ---- null control ----

# The same pinning, with the lockfile's version changes surfaced in the review
# as a list of packages rather than a diff, and an approver named for it.
packages_in_the_build => nc_packages_a_review_can_see
transitive_dependencies => nc_transitive_versions_in_the_reviewed_diff

"null control - the resolved set is reviewed as a list" ^0
"  direct pins : " + str(direct_dependencies_pinned_exactly) + ", unchanged" ^0
"  packages a review can see : " + str(nc_packages_a_review_can_see) ^0
"  transitive versions in the reviewed diff : " ^0
"    " + str(nc_transitive_versions_in_the_reviewed_diff) ^0
"  nothing became more pinned; the set the resolver chose" ^0
"  became something a person is asked about" ^0
"" ^0

# ---- the rule ----

"what exact pinning guarantees" ^0
"  the versions this project names will not change :" ^0
"    exactly, enforced by a failing build" ^0
"  the versions this build contains will not change : not" ^0
"    addressed; the project names " + str(direct_dependencies) + " of " + str(packages_in_the_build) + " and the" ^0
"    rest are a closure computed at install" ^0
"" ^0
"a constraint applied to the edges you declare is complete" ^0
"over those edges; a dependency tree is transitive and the" ^0
"discipline is not, so the guarantee covers the first hop and" ^0
"the risk lives in the other nine hundred" ^0
"" ^0

"Every one of " + str(direct_dependencies) + " direct dependencies is pinned exactly, changed only by a" ^0
"reviewed diff, with " + str(direct_ranges_allowed_by_the_lint_rule) + " ranges allowed by a lint rule that fails the build - and" ^0
"the " + str(incidents_before_pinning_traced_to_an_unchosen_release) + " incidents it was written for stopped. A pin fixes one package, so of" ^0
str(packages_in_the_build) + " packages in the build " + str(packages_chosen_by_the_resolver) + " are chosen by the resolver - review" ^0
"covers " + str(pinned_by_review_per_myriad) + " per ten thousand - under " + str(reviews_that_read_the_lockfile_diff) + " reviews that read the lockfile." ^0
```

## Python (deterministic transpilation)

```python
direct_dependencies = 41
direct_dependencies_pinned_exactly = 41
transitive_dependencies = 906
direct_ranges_allowed_by_the_lint_rule = 0
incidents_before_pinning_traced_to_an_unchosen_release = 2
transitive_versions_recorded_in_the_reviewed_diff = 0
lockfiles_committed = 1
reviews_that_read_the_lockfile_diff = 0
packages_in_the_build = direct_dependencies + transitive_dependencies
pinned_by_review_per_myriad = int(direct_dependencies_pinned_exactly * 10000 / packages_in_the_build)
packages_chosen_by_the_resolver = packages_in_the_build - direct_dependencies_pinned_exactly
print("direct dependencies             : " + str(direct_dependencies))
print("  pinned to an exact version    : " + str(direct_dependencies_pinned_exactly))
print("  ranges the lint rule allows   : " + str(direct_ranges_allowed_by_the_lint_rule))
print("incidents before pinning        : " + str(incidents_before_pinning_traced_to_an_unchosen_release))
print("")
print("transitive dependencies         : " + str(transitive_dependencies))
print("packages in the build           : " + str(packages_in_the_build))
print("  chosen by a reviewed diff     : " + str(direct_dependencies_pinned_exactly))
print("  chosen by the resolver        : " + str(packages_chosen_by_the_resolver))
print("  share chosen by review        : " + str(pinned_by_review_per_myriad) + " per ten thousand")
print("")
print("lockfiles committed             : " + str(lockfiles_committed))
print("reviews that read the lockfile diff : " + str(reviews_that_read_the_lockfile_diff))
print("transitive versions in the reviewed diff : " + str(transitive_versions_recorded_in_the_reviewed_diff))
print("")
print("the pinning rule")
print("  ranges or carets anywhere direct : " + str(direct_ranges_allowed_by_the_lint_rule))
print("  every direct dependency names : an exact version")
print("  a change to one is : a reviewed diff with a named")
print("    approver")
print("  enforced by : a lint rule that fails the build")
print("  what it replaced : a period with " + str(incidents_before_pinning_traced_to_an_unchosen_release) + " incidents traced")
print("    to a minor release nobody chose")
print("  verdict : PINNED")
print("")
print("  machine-enforced exact versions on every direct edge is")
print("  the strong form of this, and the two incidents stopped")
print("")
print("the scope of one pin")
print("  what it fixes : the version of that package")
print("  what that package's own manifest contains : ranges")
print("  who wrote those ranges : its author, for their reasons")
print("  when they are resolved : at install, against whatever")
print("    the registry holds then")
print("  packages resolved that way : " + str(packages_chosen_by_the_resolver))
print("  share of the build a reviewed diff chose : ")
print("    " + str(pinned_by_review_per_myriad) + " per ten thousand")
print("")
print("  the discipline is complete over the edges this project")
print("  declares, and a build is a closure over all of them")
print("")
print("the lockfile")
print("  committed : " + str(lockfiles_committed))
print("  does it make the build reproducible : yes")
print("  does it make the set chosen : no; it records what the")
print("    resolver picked")
print("  reviews that read its diff : " + str(reviews_that_read_the_lockfile_diff))
print("  what a reviewer sees on a routine update : nine hundred")
print("    changed lines and an approval to give")
print("")
print("the same failure today")
print("  a minor release nobody chose : still possible, one hop")
print("    down")
print("  would the lint rule fire : no; it checks direct edges")
print("  would the reviewed diff show it : the lockfile would")
print("    change; " + str(reviews_that_read_the_lockfile_diff) + " reviews read it")
print("  would the build fail : no")
print("  incidents this class produced before pinning : ")
print("    " + str(incidents_before_pinning_traced_to_an_unchosen_release))
print("")
nc_packages_a_review_can_see = packages_in_the_build
nc_transitive_versions_in_the_reviewed_diff = transitive_dependencies
print("null control - the resolved set is reviewed as a list")
print("  direct pins : " + str(direct_dependencies_pinned_exactly) + ", unchanged")
print("  packages a review can see : " + str(nc_packages_a_review_can_see))
print("  transitive versions in the reviewed diff : ")
print("    " + str(nc_transitive_versions_in_the_reviewed_diff))
print("  nothing became more pinned; the set the resolver chose")
print("  became something a person is asked about")
print("")
print("what exact pinning guarantees")
print("  the versions this project names will not change :")
print("    exactly, enforced by a failing build")
print("  the versions this build contains will not change : not")
print("    addressed; the project names " + str(direct_dependencies) + " of " + str(packages_in_the_build) + " and the")
print("    rest are a closure computed at install")
print("")
print("a constraint applied to the edges you declare is complete")
print("over those edges; a dependency tree is transitive and the")
print("discipline is not, so the guarantee covers the first hop and")
print("the risk lives in the other nine hundred")
print("")
print("Every one of " + str(direct_dependencies) + " direct dependencies is pinned exactly, changed only by a")
print("reviewed diff, with " + str(direct_ranges_allowed_by_the_lint_rule) + " ranges allowed by a lint rule that fails the build - and")
print("the " + str(incidents_before_pinning_traced_to_an_unchosen_release) + " incidents it was written for stopped. A pin fixes one package, so of")
print(str(packages_in_the_build) + " packages in the build " + str(packages_chosen_by_the_resolver) + " are chosen by the resolver - review")
print("covers " + str(pinned_by_review_per_myriad) + " per ten thousand - under " + str(reviews_that_read_the_lockfile_diff) + " reviews that read the lockfile.")
```

## stdout (executed)

```text
direct dependencies             : 41
  pinned to an exact version    : 41
  ranges the lint rule allows   : 0
incidents before pinning        : 2

transitive dependencies         : 906
packages in the build           : 947
  chosen by a reviewed diff     : 41
  chosen by the resolver        : 906
  share chosen by review        : 432 per ten thousand

lockfiles committed             : 1
reviews that read the lockfile diff : 0
transitive versions in the reviewed diff : 0

the pinning rule
  ranges or carets anywhere direct : 0
  every direct dependency names : an exact version
  a change to one is : a reviewed diff with a named
    approver
  enforced by : a lint rule that fails the build
  what it replaced : a period with 2 incidents traced
    to a minor release nobody chose
  verdict : PINNED

  machine-enforced exact versions on every direct edge is
  the strong form of this, and the two incidents stopped

the scope of one pin
  what it fixes : the version of that package
  what that package's own manifest contains : ranges
  who wrote those ranges : its author, for their reasons
  when they are resolved : at install, against whatever
    the registry holds then
  packages resolved that way : 906
  share of the build a reviewed diff chose : 
    432 per ten thousand

  the discipline is complete over the edges this project
  declares, and a build is a closure over all of them

the lockfile
  committed : 1
  does it make the build reproducible : yes
  does it make the set chosen : no; it records what the
    resolver picked
  reviews that read its diff : 0
  what a reviewer sees on a routine update : nine hundred
    changed lines and an approval to give

the same failure today
  a minor release nobody chose : still possible, one hop
    down
  would the lint rule fire : no; it checks direct edges
  would the reviewed diff show it : the lockfile would
    change; 0 reviews read it
  would the build fail : no
  incidents this class produced before pinning : 
    2

null control - the resolved set is reviewed as a list
  direct pins : 41, unchanged
  packages a review can see : 947
  transitive versions in the reviewed diff : 
    906
  nothing became more pinned; the set the resolver chose
  became something a person is asked about

what exact pinning guarantees
  the versions this project names will not change :
    exactly, enforced by a failing build
  the versions this build contains will not change : not
    addressed; the project names 41 of 947 and the
    rest are a closure computed at install

a constraint applied to the edges you declare is complete
over those edges; a dependency tree is transitive and the
discipline is not, so the guarantee covers the first hop and
the risk lives in the other nine hundred

Every one of 41 direct dependencies is pinned exactly, changed only by a
reviewed diff, with 0 ranges allowed by a lint rule that fails the build - and
the 2 incidents it was written for stopped. A pin fixes one package, so of
947 packages in the build 906 are chosen by the resolver - review
covers 432 per ten thousand - under 0 reviews that read the lockfile.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
