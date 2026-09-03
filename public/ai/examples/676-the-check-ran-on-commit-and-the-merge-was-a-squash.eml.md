<!-- canonical: efficientnewlanguage.org/ai/examples/676-the-check-ran-on-commit-and-the-merge-was-a-squash | ai_layer_version: 0.1.0 | updated: 2026-09-03 -->

# Example 676 — The check ran on commit and the merge was a squash

`the_check_ran_on_commit_and_the_merge_was_a_squash.eml` - Every commit on the branch was checked and every check passed. What was never checked is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every commit on
# the branch was checked and every check passed. What was never checked is
# computed below.
#
# The checking is thorough. It runs on every commit rather than only on the tip,
# so a bad intermediate state cannot hide inside a branch; it is the full suite,
# not a subset; and it has failed on real defects rather than sitting green as
# decoration. Forty-one commits, forty-one green runs.
#
# What it checks is the branch's content against the base the branch STARTED
# from. Main has moved a hundred and twenty-eight commits since, and the state
# that will exist after the merge is the pair.
#
# Git reports no conflict, because the two sides touch different files.

41 => commits_on_the_branch
41 => commits_checked_green
128 => main_commits_since_the_branch_started
0 => textual_conflicts_reported
0 => checks_run_on_the_merged_state
3 => semantic_conflicts_found_after_the_merge

commits_on_the_branch + main_commits_since_the_branch_started => commits_in_the_merged_history

"commits on the branch          : " + str(commits_on_the_branch) ^0
"checked, green                 : " + str(commits_checked_green) ^0
"main commits since it started  : " + str(main_commits_since_the_branch_started) ^0
"commits in the merged history  : " + str(commits_in_the_merged_history) ^0
"textual conflicts reported     : " + str(textual_conflicts_reported) ^0
"checks run on the merged state : " + str(checks_run_on_the_merged_state) ^0
"" ^0

# ---- what the per-commit check verified ----

"the branch checks" ^0
"  runs on            : every commit, not only the tip" ^0
"  scope              : the full suite" ^0
"  green              : " + str(commits_checked_green) + " of " + str(commits_on_the_branch) ^0
"  has failed on real defects : yes" ^0
"  verdict            : BRANCH IS GREEN" ^0
"" ^0
"  checking every commit is stricter than checking the tip" ^0
"  and it costs more; this is the careful configuration" ^0
"" ^0

# ---- what each run was given ----

"the state under test" ^0
"  branch content     : as authored" ^0
"  base               : where the branch started" ^0
"  main's " + str(main_commits_since_the_branch_started) + " later commits : not present in any run" ^0
"" ^0
"  every run measured a state that existed; none of them" ^0
"  measured the state that will exist" ^0
"" ^0

# ---- why the merge was clean ----

# A textual conflict needs two edits to the same lines. The branch renamed a
# helper; main added three new callers of the old name. Different files.
"the merge" ^0
"  files the branch touched : 9" ^0
"  files main touched       : 61" ^0
"  files in both            : 0" ^0
"  conflicts git can see    : " + str(textual_conflicts_reported) ^0
"  squashed to              : one commit, whose content is a" ^0
"    state nothing has run against" ^0
"" ^0

int(main_commits_since_the_branch_started * 10000 / commits_in_the_merged_history) => unchecked_side_per_myriad
"share of the merged history the branch never saw : " + str(unchecked_side_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the three were ----

"found after the merge, on main" ^0
"  a renamed helper with three new callers of the old name" ^0
"  a config key both sides added, with different defaults" ^0
"  a migration ordering that is fine either way alone" ^0
"  each side, checked alone : green" ^0
"  the pair, checked        : never, until main was red" ^0
"" ^0

# ---- null control ----

# The same branch, with the check run once more on the merge result before it
# lands rather than only on the branch.
1 => nc_checks_run_on_the_merged_state
0 => nc_semantic_conflicts_reaching_main

"null control - one run on the merge result" ^0
"  branch checks       : " + str(commits_checked_green) + ", unchanged" ^0
"  runs on the merged state : " + str(nc_checks_run_on_the_merged_state) ^0
"  conflicts reaching main : " + str(nc_semantic_conflicts_reaching_main) ^0
"  the branch did not become better tested; the state that" ^0
"  ships stopped being the one state nothing had run" ^0
"" ^0

# ---- the rule ----

"what a green branch guarantees" ^0
"  every commit on it is good : exactly, and more than most" ^0
"    projects check" ^0
"  the merge is good          : not addressed; the merge is" ^0
"    a state neither side ever built, and a conflict" ^0
"    detector that compares text cannot see it" ^0
"" ^0
"checking harder along one line does not reach the point where" ^0
"two lines meet; the only run that can is one on the result," ^0
"and it is the run a squash makes look redundant" ^0
"" ^0

"Every one of " + str(commits_on_the_branch) + " commits was checked with the full suite and " + str(commits_checked_green) + " were green," ^0
"which is stricter than checking the tip. Main moved " + str(main_commits_since_the_branch_started) + " commits meanwhile - " ^0
str(unchecked_side_per_myriad) + " per ten thousand of the merged history - and git reported " + str(textual_conflicts_reported) ^0
"conflicts because the two sides touch no common file, so " + str(checks_run_on_the_merged_state) + " runs ever saw the" ^0
"state that shipped and " + str(semantic_conflicts_found_after_the_merge) + " defects were found on main instead." ^0
```

## Python (deterministic transpilation)

```python
commits_on_the_branch = 41
commits_checked_green = 41
main_commits_since_the_branch_started = 128
textual_conflicts_reported = 0
checks_run_on_the_merged_state = 0
semantic_conflicts_found_after_the_merge = 3
commits_in_the_merged_history = commits_on_the_branch + main_commits_since_the_branch_started
print("commits on the branch          : " + str(commits_on_the_branch))
print("checked, green                 : " + str(commits_checked_green))
print("main commits since it started  : " + str(main_commits_since_the_branch_started))
print("commits in the merged history  : " + str(commits_in_the_merged_history))
print("textual conflicts reported     : " + str(textual_conflicts_reported))
print("checks run on the merged state : " + str(checks_run_on_the_merged_state))
print("")
print("the branch checks")
print("  runs on            : every commit, not only the tip")
print("  scope              : the full suite")
print("  green              : " + str(commits_checked_green) + " of " + str(commits_on_the_branch))
print("  has failed on real defects : yes")
print("  verdict            : BRANCH IS GREEN")
print("")
print("  checking every commit is stricter than checking the tip")
print("  and it costs more; this is the careful configuration")
print("")
print("the state under test")
print("  branch content     : as authored")
print("  base               : where the branch started")
print("  main's " + str(main_commits_since_the_branch_started) + " later commits : not present in any run")
print("")
print("  every run measured a state that existed; none of them")
print("  measured the state that will exist")
print("")
print("the merge")
print("  files the branch touched : 9")
print("  files main touched       : 61")
print("  files in both            : 0")
print("  conflicts git can see    : " + str(textual_conflicts_reported))
print("  squashed to              : one commit, whose content is a")
print("    state nothing has run against")
print("")
unchecked_side_per_myriad = int(main_commits_since_the_branch_started * 10000 / commits_in_the_merged_history)
print("share of the merged history the branch never saw : " + str(unchecked_side_per_myriad) + " per ten thousand")
print("")
print("found after the merge, on main")
print("  a renamed helper with three new callers of the old name")
print("  a config key both sides added, with different defaults")
print("  a migration ordering that is fine either way alone")
print("  each side, checked alone : green")
print("  the pair, checked        : never, until main was red")
print("")
nc_checks_run_on_the_merged_state = 1
nc_semantic_conflicts_reaching_main = 0
print("null control - one run on the merge result")
print("  branch checks       : " + str(commits_checked_green) + ", unchanged")
print("  runs on the merged state : " + str(nc_checks_run_on_the_merged_state))
print("  conflicts reaching main : " + str(nc_semantic_conflicts_reaching_main))
print("  the branch did not become better tested; the state that")
print("  ships stopped being the one state nothing had run")
print("")
print("what a green branch guarantees")
print("  every commit on it is good : exactly, and more than most")
print("    projects check")
print("  the merge is good          : not addressed; the merge is")
print("    a state neither side ever built, and a conflict")
print("    detector that compares text cannot see it")
print("")
print("checking harder along one line does not reach the point where")
print("two lines meet; the only run that can is one on the result,")
print("and it is the run a squash makes look redundant")
print("")
print("Every one of " + str(commits_on_the_branch) + " commits was checked with the full suite and " + str(commits_checked_green) + " were green,")
print("which is stricter than checking the tip. Main moved " + str(main_commits_since_the_branch_started) + " commits meanwhile - ")
print(str(unchecked_side_per_myriad) + " per ten thousand of the merged history - and git reported " + str(textual_conflicts_reported))
print("conflicts because the two sides touch no common file, so " + str(checks_run_on_the_merged_state) + " runs ever saw the")
print("state that shipped and " + str(semantic_conflicts_found_after_the_merge) + " defects were found on main instead.")
```

## stdout (executed)

```text
commits on the branch          : 41
checked, green                 : 41
main commits since it started  : 128
commits in the merged history  : 169
textual conflicts reported     : 0
checks run on the merged state : 0

the branch checks
  runs on            : every commit, not only the tip
  scope              : the full suite
  green              : 41 of 41
  has failed on real defects : yes
  verdict            : BRANCH IS GREEN

  checking every commit is stricter than checking the tip
  and it costs more; this is the careful configuration

the state under test
  branch content     : as authored
  base               : where the branch started
  main's 128 later commits : not present in any run

  every run measured a state that existed; none of them
  measured the state that will exist

the merge
  files the branch touched : 9
  files main touched       : 61
  files in both            : 0
  conflicts git can see    : 0
  squashed to              : one commit, whose content is a
    state nothing has run against

share of the merged history the branch never saw : 7573 per ten thousand

found after the merge, on main
  a renamed helper with three new callers of the old name
  a config key both sides added, with different defaults
  a migration ordering that is fine either way alone
  each side, checked alone : green
  the pair, checked        : never, until main was red

null control - one run on the merge result
  branch checks       : 41, unchanged
  runs on the merged state : 1
  conflicts reaching main : 0
  the branch did not become better tested; the state that
  ships stopped being the one state nothing had run

what a green branch guarantees
  every commit on it is good : exactly, and more than most
    projects check
  the merge is good          : not addressed; the merge is
    a state neither side ever built, and a conflict
    detector that compares text cannot see it

checking harder along one line does not reach the point where
two lines meet; the only run that can is one on the result,
and it is the run a squash makes look redundant

Every one of 41 commits was checked with the full suite and 41 were green,
which is stricter than checking the tip. Main moved 128 commits meanwhile - 
7573 per ten thousand of the merged history - and git reported 0
conflicts because the two sides touch no common file, so 0 runs ever saw the
state that shipped and 3 defects were found on main instead.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
