<!-- canonical: efficientnewlanguage.org/ai/examples/613-the-diff-was-empty-and-the-behaviour-changed | ai_layer_version: 0.1.0 | updated: 2026-08-30 -->

# Example 613 — The diff was empty and the behaviour changed

`the_diff_was_empty_and_the_behaviour_changed.eml` - Two builds of the same commit behave differently. The diff between them is empty. What was not in the diff is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two builds of the
# same commit behave differently. The diff between them is empty. What was not
# in the diff is computed below.
#
# The version control is correct and the check that was run is the right one.
# Comparing the two deploys by commit is exactly how you rule out a code change,
# it takes seconds, and it answered truthfully: the tree hashes match, so
# nothing anybody wrote is responsible. That conclusion was reached properly.
#
# A commit fixes the source this repository holds. It does not fix what the
# source RESOLVES TO, and every dependency specified as a range is resolved at
# build time from a registry that changes without asking.
#
# So the build is reproducible with respect to everything it records, and the
# thing that moved is the thing it does not record.

214 => dependencies_total
6 => unpinned_direct
41 => unpinned_transitive
2 => released_between_builds

unpinned_direct + unpinned_transitive => unpinned_total

"dependencies resolved at build : " + str(dependencies_total) ^0
"specified as a range, direct   : " + str(unpinned_direct) ^0
"specified as a range, indirect : " + str(unpinned_transitive) ^0
"" ^0

# ---- what the comparison established ----

"the check that was run" ^0
"  commit, build A          : identical" ^0
"  commit, build B          : identical" ^0
"  tree hash                : identical" ^0
"  lines changed            : 0" ^0
"  files changed            : 0" ^0
"  conclusion               : no code change" ^0
"" ^0
"  every one of those is true, and the conclusion follows" ^0
"  from them correctly" ^0
"" ^0

# ---- what the comparison could not reach ----

int(unpinned_total * 10000 / dependencies_total) => unpinned_per_myriad

"what the two builds do not share" ^0
"  dependencies free to differ  : " + str(unpinned_total) ^0
"  share of the tree            : " + str(unpinned_per_myriad) + " per ten thousand" ^0
"  that actually differ         : " + str(released_between_builds) ^0
"  recorded anywhere in the repo: 0" ^0
"" ^0
"  the diff is empty because the diff is over the repository," ^0
"  and " + str(unpinned_total) + " of the inputs are not in the repository" ^0
"" ^0

# ---- the two builds, listed by what each fixes ----

dependencies_total - unpinned_total => pinned_total

"input                          fixed by the commit" ^0
"  source files                 yes" ^0
"  " + str(pinned_total) + " pinned dependencies        yes" ^0
"  " + str(unpinned_total) + " ranged dependencies         no" ^0
"  compiler version             no" ^0
"  base image                   no" ^0
"  build-time environment       no" ^0
"" ^0
"  a commit is a statement about the first two rows" ^0
"" ^0

# ---- how long the answer stays true ----
#
# The check said the code is the same, and it will keep saying so. The two
# builds continue to diverge as more ranged dependencies publish.

"month   ranged deps that published   builds still identical" ^0
0 => drifted
for m in [1:4]:
    drifted + released_between_builds => drifted
    "  " + str(m) + "       " + str(drifted) + "                            no" ^0
"" ^0
"  the diff is empty at every row" ^0
"" ^0

# ---- what would have found it ----

"what each available check can distinguish" ^0
"  git diff between the deploys      : source only" ^0
"  comparing the built artefacts     : yes, byte for byte" ^0
"  a lockfile covering transitives   : yes, before the build" ^0
"  rerunning the tests               : only if a test reaches it" ^0
"" ^0
"  the first is the fastest and the only one that was run," ^0
"  which is a reasonable order to try them in and not a" ^0
"  reasonable place to stop" ^0
"" ^0

# ---- the control ----
#
# Version control, on the question it was asked. It was asked whether anybody
# changed the code, and it answered no, correctly and in seconds.

"control - was the check wrong" ^0
"  commits compared correctly     : yes" ^0
"  false 'no change' verdicts      : 0" ^0
"  source changes missed           : 0" ^0
"  defects in version control      : 0" ^0
"" ^0
"  the tool answered its question exactly; the question was" ^0
"  narrower than the one being investigated" ^0
"" ^0

# ---- the null control ----
#
# The same repository with a lockfile covering every transitive dependency.
# Same commit, same builds, same comparison.

0 => nc_free_to_differ

"null control - the same commit with a full lockfile" ^0
"  dependencies free to differ : " + str(nc_free_to_differ) ^0
"  builds identical            : yes, byte for byte" ^0
"  git diff                    : empty, as before" ^0
"  the diff did not become more informative" ^0
"  it became true of everything that matters" ^0
"" ^0

# ---- the rule ----

"what an empty diff rules out" ^0
"  a change to the tracked source : completely" ^0
"  a change to the build's inputs : only the tracked ones" ^0
"  and the untracked inputs are untracked precisely because" ^0
"  somebody decided they were not worth recording" ^0
"" ^0
"the comparison that answers 'why did this change' is between" ^0
"the artefacts, not between the commits; the commits are what" ^0
"you compare to find out WHO changed it" ^0
"" ^0

"The commits are identical, the tree hashes match, 0 files and 0 lines differ," ^0
"and version control answered that correctly in seconds. Of " + str(dependencies_total) + " dependencies" ^0
str(unpinned_total) + " are specified as ranges - " + str(unpinned_per_myriad) + " per ten thousand of the tree - and " + str(released_between_builds) ^0
"published new versions between the two builds, none of it recorded in the" ^0
"repository, so the diff stays empty for as long as anyone keeps asking it." ^0
```

## Python (deterministic transpilation)

```python
dependencies_total = 214
unpinned_direct = 6
unpinned_transitive = 41
released_between_builds = 2
unpinned_total = unpinned_direct + unpinned_transitive
print("dependencies resolved at build : " + str(dependencies_total))
print("specified as a range, direct   : " + str(unpinned_direct))
print("specified as a range, indirect : " + str(unpinned_transitive))
print("")
print("the check that was run")
print("  commit, build A          : identical")
print("  commit, build B          : identical")
print("  tree hash                : identical")
print("  lines changed            : 0")
print("  files changed            : 0")
print("  conclusion               : no code change")
print("")
print("  every one of those is true, and the conclusion follows")
print("  from them correctly")
print("")
unpinned_per_myriad = int(unpinned_total * 10000 / dependencies_total)
print("what the two builds do not share")
print("  dependencies free to differ  : " + str(unpinned_total))
print("  share of the tree            : " + str(unpinned_per_myriad) + " per ten thousand")
print("  that actually differ         : " + str(released_between_builds))
print("  recorded anywhere in the repo: 0")
print("")
print("  the diff is empty because the diff is over the repository,")
print("  and " + str(unpinned_total) + " of the inputs are not in the repository")
print("")
pinned_total = dependencies_total - unpinned_total
print("input                          fixed by the commit")
print("  source files                 yes")
print("  " + str(pinned_total) + " pinned dependencies        yes")
print("  " + str(unpinned_total) + " ranged dependencies         no")
print("  compiler version             no")
print("  base image                   no")
print("  build-time environment       no")
print("")
print("  a commit is a statement about the first two rows")
print("")
print("month   ranged deps that published   builds still identical")
drifted = 0
for m in range(1, 5):
    drifted = drifted + released_between_builds
    print("  " + str(m) + "       " + str(drifted) + "                            no")
print("")
print("  the diff is empty at every row")
print("")
print("what each available check can distinguish")
print("  git diff between the deploys      : source only")
print("  comparing the built artefacts     : yes, byte for byte")
print("  a lockfile covering transitives   : yes, before the build")
print("  rerunning the tests               : only if a test reaches it")
print("")
print("  the first is the fastest and the only one that was run,")
print("  which is a reasonable order to try them in and not a")
print("  reasonable place to stop")
print("")
print("control - was the check wrong")
print("  commits compared correctly     : yes")
print("  false 'no change' verdicts      : 0")
print("  source changes missed           : 0")
print("  defects in version control      : 0")
print("")
print("  the tool answered its question exactly; the question was")
print("  narrower than the one being investigated")
print("")
nc_free_to_differ = 0
print("null control - the same commit with a full lockfile")
print("  dependencies free to differ : " + str(nc_free_to_differ))
print("  builds identical            : yes, byte for byte")
print("  git diff                    : empty, as before")
print("  the diff did not become more informative")
print("  it became true of everything that matters")
print("")
print("what an empty diff rules out")
print("  a change to the tracked source : completely")
print("  a change to the build's inputs : only the tracked ones")
print("  and the untracked inputs are untracked precisely because")
print("  somebody decided they were not worth recording")
print("")
print("the comparison that answers 'why did this change' is between")
print("the artefacts, not between the commits; the commits are what")
print("you compare to find out WHO changed it")
print("")
print("The commits are identical, the tree hashes match, 0 files and 0 lines differ,")
print("and version control answered that correctly in seconds. Of " + str(dependencies_total) + " dependencies")
print(str(unpinned_total) + " are specified as ranges - " + str(unpinned_per_myriad) + " per ten thousand of the tree - and " + str(released_between_builds))
print("published new versions between the two builds, none of it recorded in the")
print("repository, so the diff stays empty for as long as anyone keeps asking it.")
```

## stdout (executed)

```text
dependencies resolved at build : 214
specified as a range, direct   : 6
specified as a range, indirect : 41

the check that was run
  commit, build A          : identical
  commit, build B          : identical
  tree hash                : identical
  lines changed            : 0
  files changed            : 0
  conclusion               : no code change

  every one of those is true, and the conclusion follows
  from them correctly

what the two builds do not share
  dependencies free to differ  : 47
  share of the tree            : 2196 per ten thousand
  that actually differ         : 2
  recorded anywhere in the repo: 0

  the diff is empty because the diff is over the repository,
  and 47 of the inputs are not in the repository

input                          fixed by the commit
  source files                 yes
  167 pinned dependencies        yes
  47 ranged dependencies         no
  compiler version             no
  base image                   no
  build-time environment       no

  a commit is a statement about the first two rows

month   ranged deps that published   builds still identical
  1       2                            no
  2       4                            no
  3       6                            no
  4       8                            no

  the diff is empty at every row

what each available check can distinguish
  git diff between the deploys      : source only
  comparing the built artefacts     : yes, byte for byte
  a lockfile covering transitives   : yes, before the build
  rerunning the tests               : only if a test reaches it

  the first is the fastest and the only one that was run,
  which is a reasonable order to try them in and not a
  reasonable place to stop

control - was the check wrong
  commits compared correctly     : yes
  false 'no change' verdicts      : 0
  source changes missed           : 0
  defects in version control      : 0

  the tool answered its question exactly; the question was
  narrower than the one being investigated

null control - the same commit with a full lockfile
  dependencies free to differ : 0
  builds identical            : yes, byte for byte
  git diff                    : empty, as before
  the diff did not become more informative
  it became true of everything that matters

what an empty diff rules out
  a change to the tracked source : completely
  a change to the build's inputs : only the tracked ones
  and the untracked inputs are untracked precisely because
  somebody decided they were not worth recording

the comparison that answers 'why did this change' is between
the artefacts, not between the commits; the commits are what
you compare to find out WHO changed it

The commits are identical, the tree hashes match, 0 files and 0 lines differ,
and version control answered that correctly in seconds. Of 214 dependencies
47 are specified as ranges - 2196 per ten thousand of the tree - and 2
published new versions between the two builds, none of it recorded in the
repository, so the diff stays empty for as long as anyone keeps asking it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
