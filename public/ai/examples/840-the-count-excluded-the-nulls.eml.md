<!-- canonical: efficientnewlanguage.org/ai/examples/840-the-count-excluded-the-nulls | ai_layer_version: 0.1.0 | updated: 2026-09-14 -->

# Example 840 — The count excluded the nulls

`the_count_excluded_the_nulls.eml` - The average rating is 8.00 and the query that produced it is correct SQL. What the denominator counts is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The average rating
# is 8.00 and the query that produced it is correct SQL. What the denominator
# counts is computed below.
#
# The query is written carefully. It reads the real ratings column, not a cached
# rollup; it runs over every user row, not a sample; it uses the database's own
# AVG so the arithmetic is not hand-rolled; and the number is refreshed nightly.
#
# AVG(score) and COUNT(score) skip the rows where score IS NULL, and 1200 users
# left it null.

5000 => users
3800 => users_who_rated
1200 => users_whose_score_is_null
30400 => total_rating_points

int(total_rating_points * 100 / users_who_rated) => reported_average_per_hundred
int(users_who_rated * 10000 / users) => participation_per_myriad
users - users_who_rated => users_outside_the_denominator
int(total_rating_points * 100 / users) => average_if_every_user_counted_per_hundred

"users                           : " + str(users) ^0
"  who rated                     : " + str(users_who_rated) ^0
"  whose score is null           : " + str(users_whose_score_is_null) ^0
"total rating points             : " + str(total_rating_points) ^0
"" ^0
"reported average                : " + str(reported_average_per_hundred) + " per hundred" ^0
"participation                   : " + str(participation_per_myriad) + " per ten thousand" ^0
"users outside the denominator   : " + str(users_outside_the_denominator) ^0
"average if every user counted   : " + str(average_if_every_user_counted_per_hundred) + " per hundred" ^0
"" ^0

# ---- what the query verified ----

"the average query" ^0
"  reads : the real ratings column, not a rollup" ^0
"  over : every user row, not a sample" ^0
"  arithmetic : the database's own AVG" ^0
"  refreshed : nightly" ^0
"  rows it averaged : " + str(users_who_rated) ^0
"  verdict : AVERAGE 8.00" ^0
"" ^0
"  using the engine's AVG rather than a hand-rolled sum is" ^0
"  the part done right here, and it is why the 8.00 over" ^0
"  those rows is exact" ^0
"" ^0

# ---- what the denominator is ----

"COUNT(score), the denominator" ^0
"  what it counts : rows where score is not null" ^0
"  what it skips : rows where score IS NULL" ^0
"  users who left it null : " + str(users_whose_score_is_null) ^0
"  so the denominator : " + str(users_who_rated) + ", not " + str(users) ^0
"  what AVG is over : the raters, not the users" ^0
"" ^0

# ---- what the reader hears ----

"the sentence 'our users rate us 8.00'" ^0
"  the users it is actually about : the " + str(users_who_rated) + " who rated" ^0
"  the users it seems to be about : all " + str(users) ^0
"  participation behind the number : " ^0
"    " + str(participation_per_myriad) + " per ten thousand" ^0
"  is the average wrong : no; it is exact over its rows" ^0
"  is its denominator the population the reader assumes :" ^0
"    no" ^0
"" ^0

# ---- null control ----

# The same data, with COUNT(*) as the denominator and a null score treated as a
# non-response the report states rather than drops.
800 => nc_average_over_raters_per_hundred
7600 => nc_participation_per_myriad
1200 => nc_non_responses_now_stated

"null control - COUNT(*) denominator, non-response stated" ^0
"  average over raters : " + str(nc_average_over_raters_per_hundred) + " per hundred, unchanged" ^0
"  participation : " + str(nc_participation_per_myriad) + " per ten thousand" ^0
"  non-responses now stated : " + str(nc_non_responses_now_stated) ^0
"  no rating changed; the null stopped being dropped from" ^0
"  the count and started being reported as a non-response" ^0
"" ^0

# ---- the rule ----

"what an AVG(score) of 8.00 guarantees" ^0
"  the users who rated average 8.00 : exactly, the" ^0
"    engine's own AVG over the non-null scores" ^0
"  the average is over the users : not addressed; COUNT and" ^0
"    AVG skip the NULLs, so the denominator is the " + str(users_who_rated) ^0
"    who rated, not the " + str(users) + " users - the " + str(users_whose_score_is_null) + " who did not" ^0
"    rate are silently outside it" ^0
"" ^0

"a NULL is not a zero and not a row; the engine's aggregates drop it from the" ^0
"denominator, so an average over a column is an average over the rows that filled" ^0
"it, and the ones that did not are counted nowhere" ^0
"" ^0

"It uses the engine's AVG over the real column, nightly, over every row - 8.00" ^0
"exactly, over the " + str(users_who_rated) + " who rated. COUNT(score) skips the " + str(users_whose_score_is_null) + " NULLs, so the" ^0
"denominator is not the " + str(users) + " users the sentence implies - participation behind" ^0
"the 8.00 is " + str(participation_per_myriad) + " per ten thousand." ^0
```

## Python (deterministic transpilation)

```python
users = 5000
users_who_rated = 3800
users_whose_score_is_null = 1200
total_rating_points = 30400
reported_average_per_hundred = int(total_rating_points * 100 / users_who_rated)
participation_per_myriad = int(users_who_rated * 10000 / users)
users_outside_the_denominator = users - users_who_rated
average_if_every_user_counted_per_hundred = int(total_rating_points * 100 / users)
print("users                           : " + str(users))
print("  who rated                     : " + str(users_who_rated))
print("  whose score is null           : " + str(users_whose_score_is_null))
print("total rating points             : " + str(total_rating_points))
print("")
print("reported average                : " + str(reported_average_per_hundred) + " per hundred")
print("participation                   : " + str(participation_per_myriad) + " per ten thousand")
print("users outside the denominator   : " + str(users_outside_the_denominator))
print("average if every user counted   : " + str(average_if_every_user_counted_per_hundred) + " per hundred")
print("")
print("the average query")
print("  reads : the real ratings column, not a rollup")
print("  over : every user row, not a sample")
print("  arithmetic : the database's own AVG")
print("  refreshed : nightly")
print("  rows it averaged : " + str(users_who_rated))
print("  verdict : AVERAGE 8.00")
print("")
print("  using the engine's AVG rather than a hand-rolled sum is")
print("  the part done right here, and it is why the 8.00 over")
print("  those rows is exact")
print("")
print("COUNT(score), the denominator")
print("  what it counts : rows where score is not null")
print("  what it skips : rows where score IS NULL")
print("  users who left it null : " + str(users_whose_score_is_null))
print("  so the denominator : " + str(users_who_rated) + ", not " + str(users))
print("  what AVG is over : the raters, not the users")
print("")
print("the sentence 'our users rate us 8.00'")
print("  the users it is actually about : the " + str(users_who_rated) + " who rated")
print("  the users it seems to be about : all " + str(users))
print("  participation behind the number : ")
print("    " + str(participation_per_myriad) + " per ten thousand")
print("  is the average wrong : no; it is exact over its rows")
print("  is its denominator the population the reader assumes :")
print("    no")
print("")
nc_average_over_raters_per_hundred = 800
nc_participation_per_myriad = 7600
nc_non_responses_now_stated = 1200
print("null control - COUNT(*) denominator, non-response stated")
print("  average over raters : " + str(nc_average_over_raters_per_hundred) + " per hundred, unchanged")
print("  participation : " + str(nc_participation_per_myriad) + " per ten thousand")
print("  non-responses now stated : " + str(nc_non_responses_now_stated))
print("  no rating changed; the null stopped being dropped from")
print("  the count and started being reported as a non-response")
print("")
print("what an AVG(score) of 8.00 guarantees")
print("  the users who rated average 8.00 : exactly, the")
print("    engine's own AVG over the non-null scores")
print("  the average is over the users : not addressed; COUNT and")
print("    AVG skip the NULLs, so the denominator is the " + str(users_who_rated))
print("    who rated, not the " + str(users) + " users - the " + str(users_whose_score_is_null) + " who did not")
print("    rate are silently outside it")
print("")
print("a NULL is not a zero and not a row; the engine's aggregates drop it from the")
print("denominator, so an average over a column is an average over the rows that filled")
print("it, and the ones that did not are counted nowhere")
print("")
print("It uses the engine's AVG over the real column, nightly, over every row - 8.00")
print("exactly, over the " + str(users_who_rated) + " who rated. COUNT(score) skips the " + str(users_whose_score_is_null) + " NULLs, so the")
print("denominator is not the " + str(users) + " users the sentence implies - participation behind")
print("the 8.00 is " + str(participation_per_myriad) + " per ten thousand.")
```

## stdout (executed)

```text
users                           : 5000
  who rated                     : 3800
  whose score is null           : 1200
total rating points             : 30400

reported average                : 800 per hundred
participation                   : 7600 per ten thousand
users outside the denominator   : 1200
average if every user counted   : 608 per hundred

the average query
  reads : the real ratings column, not a rollup
  over : every user row, not a sample
  arithmetic : the database's own AVG
  refreshed : nightly
  rows it averaged : 3800
  verdict : AVERAGE 8.00

  using the engine's AVG rather than a hand-rolled sum is
  the part done right here, and it is why the 8.00 over
  those rows is exact

COUNT(score), the denominator
  what it counts : rows where score is not null
  what it skips : rows where score IS NULL
  users who left it null : 1200
  so the denominator : 3800, not 5000
  what AVG is over : the raters, not the users

the sentence 'our users rate us 8.00'
  the users it is actually about : the 3800 who rated
  the users it seems to be about : all 5000
  participation behind the number : 
    7600 per ten thousand
  is the average wrong : no; it is exact over its rows
  is its denominator the population the reader assumes :
    no

null control - COUNT(*) denominator, non-response stated
  average over raters : 800 per hundred, unchanged
  participation : 7600 per ten thousand
  non-responses now stated : 1200
  no rating changed; the null stopped being dropped from
  the count and started being reported as a non-response

what an AVG(score) of 8.00 guarantees
  the users who rated average 8.00 : exactly, the
    engine's own AVG over the non-null scores
  the average is over the users : not addressed; COUNT and
    AVG skip the NULLs, so the denominator is the 3800
    who rated, not the 5000 users - the 1200 who did not
    rate are silently outside it

a NULL is not a zero and not a row; the engine's aggregates drop it from the
denominator, so an average over a column is an average over the rows that filled
it, and the ones that did not are counted nowhere

It uses the engine's AVG over the real column, nightly, over every row - 8.00
exactly, over the 3800 who rated. COUNT(score) skips the 1200 NULLs, so the
denominator is not the 5000 users the sentence implies - participation behind
the 8.00 is 7600 per ten thousand.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
