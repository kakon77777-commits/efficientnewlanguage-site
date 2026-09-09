<!-- canonical: efficientnewlanguage.org/ai/examples/772-the-review-approved-the-diff-and-the-merge-used-a-different-base | ai_layer_version: 0.1.0 | updated: 2026-09-09 -->

# Example 772 — The review approved the diff and the merge used a different base

`the_review_approved_the_diff_and_the_merge_used_a_different_base.eml` - Nothing reaches the payments service without two approvals, a green build and somebody other than the author pressing merge, and the policy has held for forty months. What the approval was given against is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Nothing reaches
# the payments service without two approvals, a green build and somebody other
# than the author pressing merge, and the policy has held for forty months.
# What the approval was given against is computed below.
#
# The policy is enforced rather than published. The branch is protected, so the
# two approvals and the green build are conditions the server checks and not a
# convention; self-merge is refused; and ninety-one changes a month are held at
# that gate rather than waved through.
#
# The reviewers read a diff against the base as it stood when they opened it.
# The merge builds a tree from the base as it stands when the button is pressed.

214 => merges_a_month
2 => approvals_required
0 => self_merges
40 => months_the_policy_has_run
91 => changes_held_at_the_gate_a_month
137 => merges_whose_base_moved_after_the_last_approval
9 => commits_the_base_moved_by_on_average
0 => merges_re_reviewed_after_the_base_moved
0 => builds_run_on_the_merge_result
4 => incidents_from_a_pair_that_never_met_in_review

merges_a_month - merges_whose_base_moved_after_the_last_approval => merges_whose_base_stood_still
merges_whose_base_moved_after_the_last_approval * commits_the_base_moved_by_on_average => commits_that_joined_unreviewed
merges_a_month * months_the_policy_has_run => merges_under_the_policy
int(merges_whose_base_moved_after_the_last_approval * 10000 / merges_a_month) => base_moved_per_myriad
int(incidents_from_a_pair_that_never_met_in_review * 10000 / merges_under_the_policy) => incidents_per_myriad

"merges a month                  : " + str(merges_a_month) ^0
"approvals required              : " + str(approvals_required) ^0
"self-merges                     : " + str(self_merges) ^0
"changes held at the gate a month: " + str(changes_held_at_the_gate_a_month) ^0
"months the policy has run       : " + str(months_the_policy_has_run) ^0
"merges under the policy         : " + str(merges_under_the_policy) ^0
"" ^0
"base moved after last approval  : " + str(merges_whose_base_moved_after_the_last_approval) ^0
"  base stood still              : " + str(merges_whose_base_stood_still) ^0
"  moved share                   : " + str(base_moved_per_myriad) + " per ten thousand" ^0
"  commits it moved by, mean     : " + str(commits_the_base_moved_by_on_average) ^0
"  commits joining unreviewed    : " + str(commits_that_joined_unreviewed) ^0
"" ^0
"re-reviewed after the base moved: " + str(merges_re_reviewed_after_the_base_moved) ^0
"builds run on the merge result  : " + str(builds_run_on_the_merge_result) ^0
"incidents from an unseen pair   : " + str(incidents_from_a_pair_that_never_met_in_review) ^0
"  per merge                     : " + str(incidents_per_myriad) + " per ten thousand" ^0
"" ^0

# ---- what the policy verified ----

"the merge policy" ^0
"  where it lives : in branch protection, so the" ^0
"    approvals and the build are server-side conditions" ^0
"    rather than a convention" ^0
"  approvals : " + str(approvals_required) + ", and the author may not be one" ^0
"  self-merges in " + str(months_the_policy_has_run) + " months : " + str(self_merges) ^0
"  changes held at the gate a month : " + str(changes_held_at_the_gate_a_month) ^0
"  verdict : REVIEWED" ^0
"" ^0
"  putting the rule in branch protection rather than in a" ^0
"  document is the part almost nobody does, and it is why" ^0
"  the " + str(self_merges) + " is a fact and not a claim" ^0
"" ^0

# ---- which object carries the answer ----

"two objects" ^0
"  what the reviewer read : the change against the base" ^0
"    as it stood when they opened it" ^0
"  what the merge produced : the change against the base" ^0
"    as it stands when the button is pressed" ^0
"  when those are the same tree : when nothing landed in" ^0
"    between" ^0
"  merges where that held : " + str(merges_whose_base_stood_still) ^0
"  merges where it did not : " + str(merges_whose_base_moved_after_the_last_approval) ^0
"" ^0
"  both approvals are about a tree; the tree that shipped" ^0
"  is a third one nobody opened" ^0
"" ^0

# ---- what lands with the change ----

"the commits that arrive alongside" ^0
"  base moved by, on average : " + str(commits_the_base_moved_by_on_average) + " commits" ^0
"  so commits joining a change unreviewed with it : " + str(commits_that_joined_unreviewed) ^0
"    a month" ^0
"  were those commits reviewed : yes, each on its own" ^0
"    base, by " + str(approvals_required) + " people" ^0
"  was any pair of them read together : no" ^0
"  re-reviews triggered by the base moving : " + str(merges_re_reviewed_after_the_base_moved) ^0
"" ^0
"  every commit is reviewed and no combination is; the" ^0
"  gate is per change and the tree is a combination" ^0
"" ^0

# ---- null control ----

# The same policy, with a merge queue: the merge result is built and tested
# before it becomes the branch.
26 => nc_merges_a_month_failing_on_the_merge_result
214 => nc_builds_run_on_the_merge_result
0 => nc_self_merges

"null control - build the merge result, not the branch head" ^0
"  self-merges : " + str(nc_self_merges) + ", unchanged" ^0
"  builds run on the merge result : " + str(nc_builds_run_on_the_merge_result) ^0
"  that fail while the change passed alone : " + str(nc_merges_a_month_failing_on_the_merge_result) ^0
"  the review did not become stricter; something finally" ^0
"  looked at the tree that was going to exist" ^0
"" ^0

# ---- the rule ----

"what a fully reviewed branch guarantees" ^0
"  every change was read by " + str(approvals_required) + " people against the tree it" ^0
"    was written on : exactly, " + str(months_the_policy_has_run) + " months, " + str(self_merges) + " exceptions" ^0
"  every tree that reached production was read by anyone" ^0
"    : not addressed; that tree is first assembled by the" ^0
"    merge, after the last approval" ^0
"" ^0
"approving a change is not approving a result; the result" ^0
"is formed from the change and everything that arrived" ^0
"while it waited, and nothing here reads it" ^0
"" ^0

"Branch protection enforces " + str(approvals_required) + " approvals and a green build server-side, " + str(self_merges) ^0
"self-merges in " + str(months_the_policy_has_run) + " months, " + str(changes_held_at_the_gate_a_month) + " changes held at the gate a month. The base" ^0
"moved after the last approval on " + str(merges_whose_base_moved_after_the_last_approval) + " of " + str(merges_a_month) + " merges - " + str(base_moved_per_myriad) + " per ten thousand -" ^0
"bringing " + str(commits_that_joined_unreviewed) + " commits a month into trees that " + str(builds_run_on_the_merge_result) + " builds and " + str(merges_re_reviewed_after_the_base_moved) + " re-reviews" ^0
"ever saw." ^0
```

## Python (deterministic transpilation)

```python
merges_a_month = 214
approvals_required = 2
self_merges = 0
months_the_policy_has_run = 40
changes_held_at_the_gate_a_month = 91
merges_whose_base_moved_after_the_last_approval = 137
commits_the_base_moved_by_on_average = 9
merges_re_reviewed_after_the_base_moved = 0
builds_run_on_the_merge_result = 0
incidents_from_a_pair_that_never_met_in_review = 4
merges_whose_base_stood_still = merges_a_month - merges_whose_base_moved_after_the_last_approval
commits_that_joined_unreviewed = merges_whose_base_moved_after_the_last_approval * commits_the_base_moved_by_on_average
merges_under_the_policy = merges_a_month * months_the_policy_has_run
base_moved_per_myriad = int(merges_whose_base_moved_after_the_last_approval * 10000 / merges_a_month)
incidents_per_myriad = int(incidents_from_a_pair_that_never_met_in_review * 10000 / merges_under_the_policy)
print("merges a month                  : " + str(merges_a_month))
print("approvals required              : " + str(approvals_required))
print("self-merges                     : " + str(self_merges))
print("changes held at the gate a month: " + str(changes_held_at_the_gate_a_month))
print("months the policy has run       : " + str(months_the_policy_has_run))
print("merges under the policy         : " + str(merges_under_the_policy))
print("")
print("base moved after last approval  : " + str(merges_whose_base_moved_after_the_last_approval))
print("  base stood still              : " + str(merges_whose_base_stood_still))
print("  moved share                   : " + str(base_moved_per_myriad) + " per ten thousand")
print("  commits it moved by, mean     : " + str(commits_the_base_moved_by_on_average))
print("  commits joining unreviewed    : " + str(commits_that_joined_unreviewed))
print("")
print("re-reviewed after the base moved: " + str(merges_re_reviewed_after_the_base_moved))
print("builds run on the merge result  : " + str(builds_run_on_the_merge_result))
print("incidents from an unseen pair   : " + str(incidents_from_a_pair_that_never_met_in_review))
print("  per merge                     : " + str(incidents_per_myriad) + " per ten thousand")
print("")
print("the merge policy")
print("  where it lives : in branch protection, so the")
print("    approvals and the build are server-side conditions")
print("    rather than a convention")
print("  approvals : " + str(approvals_required) + ", and the author may not be one")
print("  self-merges in " + str(months_the_policy_has_run) + " months : " + str(self_merges))
print("  changes held at the gate a month : " + str(changes_held_at_the_gate_a_month))
print("  verdict : REVIEWED")
print("")
print("  putting the rule in branch protection rather than in a")
print("  document is the part almost nobody does, and it is why")
print("  the " + str(self_merges) + " is a fact and not a claim")
print("")
print("two objects")
print("  what the reviewer read : the change against the base")
print("    as it stood when they opened it")
print("  what the merge produced : the change against the base")
print("    as it stands when the button is pressed")
print("  when those are the same tree : when nothing landed in")
print("    between")
print("  merges where that held : " + str(merges_whose_base_stood_still))
print("  merges where it did not : " + str(merges_whose_base_moved_after_the_last_approval))
print("")
print("  both approvals are about a tree; the tree that shipped")
print("  is a third one nobody opened")
print("")
print("the commits that arrive alongside")
print("  base moved by, on average : " + str(commits_the_base_moved_by_on_average) + " commits")
print("  so commits joining a change unreviewed with it : " + str(commits_that_joined_unreviewed))
print("    a month")
print("  were those commits reviewed : yes, each on its own")
print("    base, by " + str(approvals_required) + " people")
print("  was any pair of them read together : no")
print("  re-reviews triggered by the base moving : " + str(merges_re_reviewed_after_the_base_moved))
print("")
print("  every commit is reviewed and no combination is; the")
print("  gate is per change and the tree is a combination")
print("")
nc_merges_a_month_failing_on_the_merge_result = 26
nc_builds_run_on_the_merge_result = 214
nc_self_merges = 0
print("null control - build the merge result, not the branch head")
print("  self-merges : " + str(nc_self_merges) + ", unchanged")
print("  builds run on the merge result : " + str(nc_builds_run_on_the_merge_result))
print("  that fail while the change passed alone : " + str(nc_merges_a_month_failing_on_the_merge_result))
print("  the review did not become stricter; something finally")
print("  looked at the tree that was going to exist")
print("")
print("what a fully reviewed branch guarantees")
print("  every change was read by " + str(approvals_required) + " people against the tree it")
print("    was written on : exactly, " + str(months_the_policy_has_run) + " months, " + str(self_merges) + " exceptions")
print("  every tree that reached production was read by anyone")
print("    : not addressed; that tree is first assembled by the")
print("    merge, after the last approval")
print("")
print("approving a change is not approving a result; the result")
print("is formed from the change and everything that arrived")
print("while it waited, and nothing here reads it")
print("")
print("Branch protection enforces " + str(approvals_required) + " approvals and a green build server-side, " + str(self_merges))
print("self-merges in " + str(months_the_policy_has_run) + " months, " + str(changes_held_at_the_gate_a_month) + " changes held at the gate a month. The base")
print("moved after the last approval on " + str(merges_whose_base_moved_after_the_last_approval) + " of " + str(merges_a_month) + " merges - " + str(base_moved_per_myriad) + " per ten thousand -")
print("bringing " + str(commits_that_joined_unreviewed) + " commits a month into trees that " + str(builds_run_on_the_merge_result) + " builds and " + str(merges_re_reviewed_after_the_base_moved) + " re-reviews")
print("ever saw.")
```

## stdout (executed)

```text
merges a month                  : 214
approvals required              : 2
self-merges                     : 0
changes held at the gate a month: 91
months the policy has run       : 40
merges under the policy         : 8560

base moved after last approval  : 137
  base stood still              : 77
  moved share                   : 6401 per ten thousand
  commits it moved by, mean     : 9
  commits joining unreviewed    : 1233

re-reviewed after the base moved: 0
builds run on the merge result  : 0
incidents from an unseen pair   : 4
  per merge                     : 4 per ten thousand

the merge policy
  where it lives : in branch protection, so the
    approvals and the build are server-side conditions
    rather than a convention
  approvals : 2, and the author may not be one
  self-merges in 40 months : 0
  changes held at the gate a month : 91
  verdict : REVIEWED

  putting the rule in branch protection rather than in a
  document is the part almost nobody does, and it is why
  the 0 is a fact and not a claim

two objects
  what the reviewer read : the change against the base
    as it stood when they opened it
  what the merge produced : the change against the base
    as it stands when the button is pressed
  when those are the same tree : when nothing landed in
    between
  merges where that held : 77
  merges where it did not : 137

  both approvals are about a tree; the tree that shipped
  is a third one nobody opened

the commits that arrive alongside
  base moved by, on average : 9 commits
  so commits joining a change unreviewed with it : 1233
    a month
  were those commits reviewed : yes, each on its own
    base, by 2 people
  was any pair of them read together : no
  re-reviews triggered by the base moving : 0

  every commit is reviewed and no combination is; the
  gate is per change and the tree is a combination

null control - build the merge result, not the branch head
  self-merges : 0, unchanged
  builds run on the merge result : 214
  that fail while the change passed alone : 26
  the review did not become stricter; something finally
  looked at the tree that was going to exist

what a fully reviewed branch guarantees
  every change was read by 2 people against the tree it
    was written on : exactly, 40 months, 0 exceptions
  every tree that reached production was read by anyone
    : not addressed; that tree is first assembled by the
    merge, after the last approval

approving a change is not approving a result; the result
is formed from the change and everything that arrived
while it waited, and nothing here reads it

Branch protection enforces 2 approvals and a green build server-side, 0
self-merges in 40 months, 91 changes held at the gate a month. The base
moved after the last approval on 137 of 214 merges - 6401 per ten thousand -
bringing 1233 commits a month into trees that 0 builds and 0 re-reviews
ever saw.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
