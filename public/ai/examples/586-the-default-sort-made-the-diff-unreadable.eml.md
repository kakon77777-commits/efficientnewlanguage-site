<!-- canonical: efficientnewlanguage.org/ai/examples/586-the-default-sort-made-the-diff-unreadable | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 586 — The default sort made the diff unreadable

`the_default_sort_made_the_diff_unreadable.eml` - A generated configuration file is regenerated on every build and committed. How much of each diff is a real change is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A generated
# configuration file is regenerated on every build and committed. How much of
# each diff is a real change is computed below.
#
# Not sorting the output is the right default for the serializer and it was
# chosen deliberately. Sorting costs time on files that can be large, iteration
# order is not part of the format's contract so relying on it would be a bug,
# and for a file that is READ by a program the order carries no meaning at all.
# The serializer is used in many places where the output is never seen by a
# person, and for those it is exactly right.
#
# This file is committed, so it is also read by people, and by a diff. A diff
# does not know that order is meaningless. It reports every line whose position
# changed, because for most files a moved line is a fact worth showing.
#
# The generator is deterministic given its input, which is the property the team
# checked. It is not deterministic given a rebuild on a different process, which
# is where the hash seed lives.

240 => keys
3 => keys_changed_by_a_real_edit

# The expected number of fixed points of a random permutation is exactly 1,
# whatever n is. So of `keys` lines, one stays put on average and the rest move.
1 => expected_lines_in_place

keys - expected_lines_in_place => lines_moved
lines_moved * 2 => diff_lines_from_noise
keys_changed_by_a_real_edit * 2 => diff_lines_from_the_change

"keys in the file           : " + str(keys) ^0
"keys a real edit touches   : " + str(keys_changed_by_a_real_edit) ^0
"" ^0

"  lines expected to keep their position : " + str(expected_lines_in_place) ^0
"  lines expected to move                : " + str(lines_moved) ^0
"  diff lines from reordering            : " + str(diff_lines_from_noise) ^0
"  diff lines from the actual change     : " + str(diff_lines_from_the_change) ^0
"  signal to noise                       : 1 to " + str(int(diff_lines_from_noise / diff_lines_from_the_change)) ^0
"" ^0

# ---- what a reviewer does with that ----

"a review of this diff" ^0
"  lines to read            : " + str(diff_lines_from_noise + diff_lines_from_the_change) ^0
"  lines that matter        : " + str(diff_lines_from_the_change) ^0
"  time to find them by eye : longer than reading the source change itself" ^0
"  what reviewers do instead: approve the file unread" ^0
"" ^0
"  and once it is approved unread, the file is outside review entirely," ^0
"  including on the day the real change is three lines nobody wanted" ^0
"" ^0

# ---- the same file, sorted ----

"with the keys sorted before writing" ^0
"  lines that move from reordering : 0" ^0
"  diff lines from reordering      : 0" ^0
"  diff lines from the change      : " + str(diff_lines_from_the_change) ^0
"  signal to noise                 : 1 to 0" ^0
"  cost : one sort of " + str(keys) + " keys, once per build" ^0
"" ^0

# ---- what determinism was checked against ----
#
# The team did verify the generator is deterministic. They ran it twice in one
# process and compared. That comparison holds; the hash seed is per-process.

"the determinism check that was run" ^0
"  generate twice in one process, compare : identical" ^0
"  generate on two machines, compare      : not run" ^0
"  generate in two processes, compare     : not run" ^0
"  the property that was verified : same process, same output" ^0
"  the property that matters      : same input, same output" ^0
"" ^0
"  a second run in the same process shares the seed, so it cannot" ^0
"  distinguish the two" ^0
"" ^0

# ---- what the noise hides ----
#
# A real change of three lines inside 478 lines of movement is not visible.
# Neither is a change nobody made deliberately.

"changes this diff would hide equally well" ^0
"  the intended three-line edit          hidden" ^0
"  a value edited by a bad merge         hidden" ^0
"  a key removed by a generator bug      hidden" ^0
"  a credential accidentally interpolated hidden" ^0
"  the noise does not discriminate between what it hides" ^0
"" ^0

# ---- the control ----
#
# The generator. Same input, same process, same output, every time. It has no
# bug and its output is correct in every line. The file is right; the DIFF is
# unreadable.

"control - is the generated file correct" ^0
"  keys present            : " + str(keys) ^0
"  keys with correct values: " + str(keys) ^0
"  wrong or missing entries: 0" ^0
"  the file is correct on every line, in every build" ^0
"" ^0
"  correctness of the file and readability of the diff are different" ^0
"  properties, and only one of them was ever a requirement" ^0
"" ^0

# ---- the null control ----
#
# The same unsorted serializer on a file that is generated and consumed by a
# program without being committed. No diff, no reviewer, no cost. The default
# is right for that file and it is the same default.

0 => nc_reviewers

"null control - the same serializer for a file nobody commits" ^0
"  reviewers            : " + str(nc_reviewers) ^0
"  diffs produced       : " + str(nc_reviewers) ^0
"  cost of the ordering : 0" ^0
"  time saved by not sorting : real, on every build" ^0
"  same serializer, same default, and here it is simply better" ^0
"  the cost appears only when the output crosses into a place where" ^0
"  position carries meaning, and a git repository is such a place" ^0
"" ^0

# ---- the rule ----

"unspecified order, in an output that will be diffed" ^0
"  is the order part of the format's contract   no" ^0
"  is relying on it a bug                       yes" ^0
"  does a diff rely on it                       yes, unavoidably" ^0
"  a diff is a tool for a format whose order means something," ^0
"  pointed at a format whose order means nothing" ^0
"" ^0
"the fix is not to make the diff smarter" ^0
"it is one sort, in the writer, so the file has an order to be stable in" ^0
"" ^0

"Not sorting is right for a serializer whose output is read by programs, and" ^0
"relying on iteration order would be a genuine bug. This file is committed, so" ^0
"a diff reads it, and a diff reports position. A random permutation leaves " + str(expected_lines_in_place) ^0
"line in place on average, so " + str(lines_moved) + " of " + str(keys) + " move and produce " + str(diff_lines_from_noise) + " diff lines" ^0
"around the " + str(diff_lines_from_the_change) + " that anyone meant to make." ^0
```

## Python (deterministic transpilation)

```python
keys = 240
keys_changed_by_a_real_edit = 3
expected_lines_in_place = 1
lines_moved = keys - expected_lines_in_place
diff_lines_from_noise = lines_moved * 2
diff_lines_from_the_change = keys_changed_by_a_real_edit * 2
print("keys in the file           : " + str(keys))
print("keys a real edit touches   : " + str(keys_changed_by_a_real_edit))
print("")
print("  lines expected to keep their position : " + str(expected_lines_in_place))
print("  lines expected to move                : " + str(lines_moved))
print("  diff lines from reordering            : " + str(diff_lines_from_noise))
print("  diff lines from the actual change     : " + str(diff_lines_from_the_change))
print("  signal to noise                       : 1 to " + str(int(diff_lines_from_noise / diff_lines_from_the_change)))
print("")
print("a review of this diff")
print("  lines to read            : " + str(diff_lines_from_noise + diff_lines_from_the_change))
print("  lines that matter        : " + str(diff_lines_from_the_change))
print("  time to find them by eye : longer than reading the source change itself")
print("  what reviewers do instead: approve the file unread")
print("")
print("  and once it is approved unread, the file is outside review entirely,")
print("  including on the day the real change is three lines nobody wanted")
print("")
print("with the keys sorted before writing")
print("  lines that move from reordering : 0")
print("  diff lines from reordering      : 0")
print("  diff lines from the change      : " + str(diff_lines_from_the_change))
print("  signal to noise                 : 1 to 0")
print("  cost : one sort of " + str(keys) + " keys, once per build")
print("")
print("the determinism check that was run")
print("  generate twice in one process, compare : identical")
print("  generate on two machines, compare      : not run")
print("  generate in two processes, compare     : not run")
print("  the property that was verified : same process, same output")
print("  the property that matters      : same input, same output")
print("")
print("  a second run in the same process shares the seed, so it cannot")
print("  distinguish the two")
print("")
print("changes this diff would hide equally well")
print("  the intended three-line edit          hidden")
print("  a value edited by a bad merge         hidden")
print("  a key removed by a generator bug      hidden")
print("  a credential accidentally interpolated hidden")
print("  the noise does not discriminate between what it hides")
print("")
print("control - is the generated file correct")
print("  keys present            : " + str(keys))
print("  keys with correct values: " + str(keys))
print("  wrong or missing entries: 0")
print("  the file is correct on every line, in every build")
print("")
print("  correctness of the file and readability of the diff are different")
print("  properties, and only one of them was ever a requirement")
print("")
nc_reviewers = 0
print("null control - the same serializer for a file nobody commits")
print("  reviewers            : " + str(nc_reviewers))
print("  diffs produced       : " + str(nc_reviewers))
print("  cost of the ordering : 0")
print("  time saved by not sorting : real, on every build")
print("  same serializer, same default, and here it is simply better")
print("  the cost appears only when the output crosses into a place where")
print("  position carries meaning, and a git repository is such a place")
print("")
print("unspecified order, in an output that will be diffed")
print("  is the order part of the format's contract   no")
print("  is relying on it a bug                       yes")
print("  does a diff rely on it                       yes, unavoidably")
print("  a diff is a tool for a format whose order means something,")
print("  pointed at a format whose order means nothing")
print("")
print("the fix is not to make the diff smarter")
print("it is one sort, in the writer, so the file has an order to be stable in")
print("")
print("Not sorting is right for a serializer whose output is read by programs, and")
print("relying on iteration order would be a genuine bug. This file is committed, so")
print("a diff reads it, and a diff reports position. A random permutation leaves " + str(expected_lines_in_place))
print("line in place on average, so " + str(lines_moved) + " of " + str(keys) + " move and produce " + str(diff_lines_from_noise) + " diff lines")
print("around the " + str(diff_lines_from_the_change) + " that anyone meant to make.")
```

## stdout (executed)

```text
keys in the file           : 240
keys a real edit touches   : 3

  lines expected to keep their position : 1
  lines expected to move                : 239
  diff lines from reordering            : 478
  diff lines from the actual change     : 6
  signal to noise                       : 1 to 79

a review of this diff
  lines to read            : 484
  lines that matter        : 6
  time to find them by eye : longer than reading the source change itself
  what reviewers do instead: approve the file unread

  and once it is approved unread, the file is outside review entirely,
  including on the day the real change is three lines nobody wanted

with the keys sorted before writing
  lines that move from reordering : 0
  diff lines from reordering      : 0
  diff lines from the change      : 6
  signal to noise                 : 1 to 0
  cost : one sort of 240 keys, once per build

the determinism check that was run
  generate twice in one process, compare : identical
  generate on two machines, compare      : not run
  generate in two processes, compare     : not run
  the property that was verified : same process, same output
  the property that matters      : same input, same output

  a second run in the same process shares the seed, so it cannot
  distinguish the two

changes this diff would hide equally well
  the intended three-line edit          hidden
  a value edited by a bad merge         hidden
  a key removed by a generator bug      hidden
  a credential accidentally interpolated hidden
  the noise does not discriminate between what it hides

control - is the generated file correct
  keys present            : 240
  keys with correct values: 240
  wrong or missing entries: 0
  the file is correct on every line, in every build

  correctness of the file and readability of the diff are different
  properties, and only one of them was ever a requirement

null control - the same serializer for a file nobody commits
  reviewers            : 0
  diffs produced       : 0
  cost of the ordering : 0
  time saved by not sorting : real, on every build
  same serializer, same default, and here it is simply better
  the cost appears only when the output crosses into a place where
  position carries meaning, and a git repository is such a place

unspecified order, in an output that will be diffed
  is the order part of the format's contract   no
  is relying on it a bug                       yes
  does a diff rely on it                       yes, unavoidably
  a diff is a tool for a format whose order means something,
  pointed at a format whose order means nothing

the fix is not to make the diff smarter
it is one sort, in the writer, so the file has an order to be stable in

Not sorting is right for a serializer whose output is read by programs, and
relying on iteration order would be a genuine bug. This file is committed, so
a diff reads it, and a diff reports position. A random permutation leaves 1
line in place on average, so 239 of 240 move and produce 478 diff lines
around the 6 that anyone meant to make.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
