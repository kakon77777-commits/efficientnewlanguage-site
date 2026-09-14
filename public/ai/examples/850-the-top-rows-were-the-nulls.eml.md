<!-- canonical: efficientnewlanguage.org/ai/examples/850-the-top-rows-were-the-nulls | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 850 — The top rows were the nulls

`the_top_rows_were_the_nulls.eml` - The leaderboard shows the top ten by score, ordered descending, and the ORDER BY is correct. Where a NULL score sorts is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The leaderboard
# shows the top ten by score, ordered descending, and the ORDER BY is correct.
# Where a NULL score sorts is computed below.
#
# The query is careful. It orders by the real score column; it uses the
# database's own sort, not a hand-rolled comparator; the descending direction is
# right for a leaderboard; and LIMIT 10 takes the first ten of that order.
#
# NULL sorts before every value under DESC in this database, and 400 items have
# no score.

8000 => items
7600 => items_with_a_score
400 => items_with_a_null_score
990 => the_highest_real_score
10 => leaderboard_size

leaderboard_size => top_slots_taken_by_null_scores
leaderboard_size - top_slots_taken_by_null_scores => top_slots_showing_a_real_top_score
items_with_a_null_score => rows_before_the_highest_real_score

"items                           : " + str(items) ^0
"  with a score                  : " + str(items_with_a_score) ^0
"  with a null score             : " + str(items_with_a_null_score) ^0
"highest real score              : " + str(the_highest_real_score) ^0
"leaderboard size                : " + str(leaderboard_size) ^0
"" ^0
"top slots taken by null scores  : " + str(top_slots_taken_by_null_scores) ^0
"  showing a real top score      : " + str(top_slots_showing_a_real_top_score) ^0
"rows before the highest real one: " + str(rows_before_the_highest_real_score) ^0
"" ^0

# ---- what the query verified ----

"the leaderboard query" ^0
"  orders by : the real score column" ^0
"  sort : the database's own, not a hand-rolled comparator" ^0
"  direction : descending, right for a leaderboard" ^0
"  limit : the first ten of that order" ^0
"  hand-rolled comparators that could differ : 0" ^0
"  verdict : TOP TEN BY SCORE" ^0
"" ^0
"  using the engine's sort rather than a hand comparator is" ^0
"  the part done right here, and it is why the ordering" ^0
"  among real scores is exact" ^0
"" ^0

# ---- where a NULL sorts ----

"NULL under ORDER BY score DESC" ^0
"  what NULL compares as : not greater, not less, unknown" ^0
"  where this database puts it under DESC : first" ^0
"  items with no score : " + str(items_with_a_null_score) ^0
"  so the first rows of the order : the unscored ones" ^0
"  the highest real score : below all " + str(items_with_a_null_score) + " of them" ^0
"" ^0

# ---- what the leaderboard shows ----

"the top ten as rendered" ^0
"  slots filled by null-score items : " + str(top_slots_taken_by_null_scores) ^0
"  slots filled by the actual highest : " ^0
"    " + str(top_slots_showing_a_real_top_score) ^0
"  the " + str(the_highest_real_score) + "-point leader appears : below the nulls" ^0
"  is the ORDER BY wrong : no; DESC is correct" ^0
"  is the sort position of NULL the one the leaderboard" ^0
"    assumes : no" ^0
"" ^0

# ---- null control ----

# The same query, with NULLS LAST added (or a WHERE score IS NOT NULL before the
# order) so unscored items do not occupy the top.
10 => nc_top_slots_null_when_nulls_first
0 => nc_top_slots_null_when_nulls_last
10 => nc_real_top_scores_it_restores

"null control - NULLS LAST (or exclude null scores)" ^0
"  top slots that are null, NULLS FIRST : " ^0
"    " + str(nc_top_slots_null_when_nulls_first) ^0
"  top slots that are null, NULLS LAST : " ^0
"    " + str(nc_top_slots_null_when_nulls_last) ^0
"  real top scores it restores : " + str(nc_real_top_scores_it_restores) ^0
"  no score changed; the sort stopped placing 'unknown' at" ^0
"  the top of 'highest'" ^0
"" ^0

# ---- the rule ----

"what ORDER BY score DESC LIMIT 10 guarantees" ^0
"  the ten rows are the first ten of the sort : exactly," ^0
"    the engine's own descending order" ^0
"  the top ten are the highest scored : not addressed;" ^0
"    NULL sorts before any value under DESC here, and " ^0
"    " + str(items_with_a_null_score) + " items have no score - the top 10 are unscored" ^0
"    NULLs, and the highest real score is below all of them" ^0
"" ^0

"an ordering places NULL somewhere, and 'somewhere' under a descending sort is" ^0
"often the top; 'highest' and 'unknown' are different, and a LIMIT taken off the" ^0
"front hands back whichever the sort put there" ^0
"" ^0

"It orders by the real column with the engine's sort, descending, limit ten -" ^0
"correct. NULL sorts first under DESC here and " + str(items_with_a_null_score) + " items are unscored, so all" ^0
"" + str(top_slots_taken_by_null_scores) + " top slots are NULLs and the " + str(the_highest_real_score) + "-point leader sits below them." ^0
```

## Python (deterministic transpilation)

```python
items = 8000
items_with_a_score = 7600
items_with_a_null_score = 400
the_highest_real_score = 990
leaderboard_size = 10
top_slots_taken_by_null_scores = leaderboard_size
top_slots_showing_a_real_top_score = leaderboard_size - top_slots_taken_by_null_scores
rows_before_the_highest_real_score = items_with_a_null_score
print("items                           : " + str(items))
print("  with a score                  : " + str(items_with_a_score))
print("  with a null score             : " + str(items_with_a_null_score))
print("highest real score              : " + str(the_highest_real_score))
print("leaderboard size                : " + str(leaderboard_size))
print("")
print("top slots taken by null scores  : " + str(top_slots_taken_by_null_scores))
print("  showing a real top score      : " + str(top_slots_showing_a_real_top_score))
print("rows before the highest real one: " + str(rows_before_the_highest_real_score))
print("")
print("the leaderboard query")
print("  orders by : the real score column")
print("  sort : the database's own, not a hand-rolled comparator")
print("  direction : descending, right for a leaderboard")
print("  limit : the first ten of that order")
print("  hand-rolled comparators that could differ : 0")
print("  verdict : TOP TEN BY SCORE")
print("")
print("  using the engine's sort rather than a hand comparator is")
print("  the part done right here, and it is why the ordering")
print("  among real scores is exact")
print("")
print("NULL under ORDER BY score DESC")
print("  what NULL compares as : not greater, not less, unknown")
print("  where this database puts it under DESC : first")
print("  items with no score : " + str(items_with_a_null_score))
print("  so the first rows of the order : the unscored ones")
print("  the highest real score : below all " + str(items_with_a_null_score) + " of them")
print("")
print("the top ten as rendered")
print("  slots filled by null-score items : " + str(top_slots_taken_by_null_scores))
print("  slots filled by the actual highest : ")
print("    " + str(top_slots_showing_a_real_top_score))
print("  the " + str(the_highest_real_score) + "-point leader appears : below the nulls")
print("  is the ORDER BY wrong : no; DESC is correct")
print("  is the sort position of NULL the one the leaderboard")
print("    assumes : no")
print("")
nc_top_slots_null_when_nulls_first = 10
nc_top_slots_null_when_nulls_last = 0
nc_real_top_scores_it_restores = 10
print("null control - NULLS LAST (or exclude null scores)")
print("  top slots that are null, NULLS FIRST : ")
print("    " + str(nc_top_slots_null_when_nulls_first))
print("  top slots that are null, NULLS LAST : ")
print("    " + str(nc_top_slots_null_when_nulls_last))
print("  real top scores it restores : " + str(nc_real_top_scores_it_restores))
print("  no score changed; the sort stopped placing 'unknown' at")
print("  the top of 'highest'")
print("")
print("what ORDER BY score DESC LIMIT 10 guarantees")
print("  the ten rows are the first ten of the sort : exactly,")
print("    the engine's own descending order")
print("  the top ten are the highest scored : not addressed;")
print("    NULL sorts before any value under DESC here, and ")
print("    " + str(items_with_a_null_score) + " items have no score - the top 10 are unscored")
print("    NULLs, and the highest real score is below all of them")
print("")
print("an ordering places NULL somewhere, and 'somewhere' under a descending sort is")
print("often the top; 'highest' and 'unknown' are different, and a LIMIT taken off the")
print("front hands back whichever the sort put there")
print("")
print("It orders by the real column with the engine's sort, descending, limit ten -")
print("correct. NULL sorts first under DESC here and " + str(items_with_a_null_score) + " items are unscored, so all")
print("" + str(top_slots_taken_by_null_scores) + " top slots are NULLs and the " + str(the_highest_real_score) + "-point leader sits below them.")
```

## stdout (executed)

```text
items                           : 8000
  with a score                  : 7600
  with a null score             : 400
highest real score              : 990
leaderboard size                : 10

top slots taken by null scores  : 10
  showing a real top score      : 0
rows before the highest real one: 400

the leaderboard query
  orders by : the real score column
  sort : the database's own, not a hand-rolled comparator
  direction : descending, right for a leaderboard
  limit : the first ten of that order
  hand-rolled comparators that could differ : 0
  verdict : TOP TEN BY SCORE

  using the engine's sort rather than a hand comparator is
  the part done right here, and it is why the ordering
  among real scores is exact

NULL under ORDER BY score DESC
  what NULL compares as : not greater, not less, unknown
  where this database puts it under DESC : first
  items with no score : 400
  so the first rows of the order : the unscored ones
  the highest real score : below all 400 of them

the top ten as rendered
  slots filled by null-score items : 10
  slots filled by the actual highest : 
    0
  the 990-point leader appears : below the nulls
  is the ORDER BY wrong : no; DESC is correct
  is the sort position of NULL the one the leaderboard
    assumes : no

null control - NULLS LAST (or exclude null scores)
  top slots that are null, NULLS FIRST : 
    10
  top slots that are null, NULLS LAST : 
    0
  real top scores it restores : 10
  no score changed; the sort stopped placing 'unknown' at
  the top of 'highest'

what ORDER BY score DESC LIMIT 10 guarantees
  the ten rows are the first ten of the sort : exactly,
    the engine's own descending order
  the top ten are the highest scored : not addressed;
    NULL sorts before any value under DESC here, and 
    400 items have no score - the top 10 are unscored
    NULLs, and the highest real score is below all of them

an ordering places NULL somewhere, and 'somewhere' under a descending sort is
often the top; 'highest' and 'unknown' are different, and a LIMIT taken off the
front hands back whichever the sort put there

It orders by the real column with the engine's sort, descending, limit ten -
correct. NULL sorts first under DESC here and 400 items are unscored, so all
10 top slots are NULLs and the 990-point leader sits below them.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
