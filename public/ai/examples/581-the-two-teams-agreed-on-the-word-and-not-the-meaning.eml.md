<!-- canonical: efficientnewlanguage.org/ai/examples/581-the-two-teams-agreed-on-the-word-and-not-the-meaning | ai_layer_version: 0.1.0 | updated: 2026-08-27 -->

# Example 581 — The two teams agreed on the word and not the meaning

`the_two_teams_agreed_on_the_word_and_not_the_meaning.eml` - Two teams report active users. The growth team says 42000, the platform team says 18000. Both queries are correct and the numbers they produce are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two teams report
# active users. The growth team says 42000, the platform team says 18000. Both
# queries are correct and the numbers they produce are computed below.
#
# Each definition was chosen with care and each is right for its own purpose.
# The growth team counts a login inside 30 days, because a login is what a
# marketing campaign can move and it is the number that tells them whether a
# campaign worked. The platform team counts a write action inside 30 days,
# because a write is what consumes storage and generates load, and it is the
# number that tells them what to provision. Neither team could use the other's
# definition without the metric ceasing to answer their question.
#
# The two definitions were both written down. What was never written down is
# that there are two, so both appear in tables headed "active users", and every
# reader who joins them is joining columns that do not share a population.
#
# A ratio between two definitions of one word is arithmetic on two different
# sets, and it produces a number that looks exactly like the metric it is not.

100000 => registered
42000 => logged_in_30d
18000 => wrote_something_30d
840000 => revenue
9000 => conversions_among_logged_in
7200 => conversions_among_writers

"registered users                    : " + str(registered) ^0
"growth team, logged in within 30d   : " + str(logged_in_30d) + " (" + str(int(logged_in_30d * 100 / registered)) + " percent)" ^0
"platform team, wrote within 30d     : " + str(wrote_something_30d) + " (" + str(int(wrote_something_30d * 100 / registered)) + " percent)" ^0
"both tables are headed 'active users'" ^0
"" ^0

"  ratio between the two             : " + str(int(logged_in_30d * 100 / wrote_something_30d)) + " hundredths" ^0
"  writers are a subset of logins, so neither number is wrong" ^0
"" ^0

# ---- one denominator, two answers ----

int(revenue / logged_in_30d) => arpu_growth
int(revenue / wrote_something_30d) => arpu_platform

"revenue per active user, from the same revenue figure" ^0
"  using the growth definition   : " + str(arpu_growth) ^0
"  using the platform definition : " + str(arpu_platform) ^0
"  difference                    : " + str(arpu_platform - arpu_growth) + ", a factor of " + str(int(arpu_platform * 100 / arpu_growth)) + " hundredths" ^0
"" ^0
"  the pricing model used one" ^0
"  the board deck used the other" ^0
"  both cite the same revenue and the same word" ^0
"" ^0

# ---- three conversion rates, all correct ----
#
# The worst case is not two numbers side by side. It is one number built from
# a numerator taken in one definition and a denominator taken in the other.

int(conversions_among_logged_in * 100 / logged_in_30d) => rate_growth
int(conversions_among_writers * 100 / wrote_something_30d) => rate_platform
int(conversions_among_writers * 100 / logged_in_30d) => rate_mixed

"conversion rate among active users" ^0
"  numerator and denominator both growth   : " + str(conversions_among_logged_in) + " / " + str(logged_in_30d) + " = " + str(rate_growth) + " percent" ^0
"  numerator and denominator both platform : " + str(conversions_among_writers) + " / " + str(wrote_something_30d) + " = " + str(rate_platform) + " percent" ^0
"  numerator platform, denominator growth  : " + str(conversions_among_writers) + " / " + str(logged_in_30d) + " = " + str(rate_mixed) + " percent" ^0
"" ^0
"  three numbers, all labelled 'active conversion rate'" ^0
"  the widest pair differ by " + str(rate_platform - rate_mixed) + " points" ^0
"  the mixed one is the only one that is wrong, and it is the one a" ^0
"  spreadsheet produces when two teams paste into adjacent columns" ^0
"" ^0

# ---- why the disagreement does not surface ----

"what each team sees when it checks its own number" ^0
"  growth team re-runs its query   : " + str(logged_in_30d) + ", matches its own report" ^0
"  platform team re-runs its query : " + str(wrote_something_30d) + ", matches its own report" ^0
"  each team's number is reproducible, stable and documented" ^0
"  a disagreement needs someone holding BOTH definitions at once" ^0
"  and the definitions live in two repositories" ^0
"" ^0

# ---- the control ----
#
# Are either of the queries wrong. Run each against its own stated definition
# and both are exact. There is no bug to find in either place.

"control - each query against its own written definition" ^0
"  growth: count users with a login event in the last 30 days" ^0
"    stated definition matched : yes" ^0
"    off-by-one on the window  : no" ^0
"  platform: count users with a write event in the last 30 days" ^0
"    stated definition matched : yes" ^0
"    off-by-one on the window  : no" ^0
"  incorrect queries found : 0 of 2" ^0
"" ^0
"  a review of either query approves it" ^0
"  the defect is the word, and a word is not in either repository" ^0
"" ^0

# ---- the null control ----
#
# The same two teams, same two queries, on a product where every login is
# followed by a write. The two definitions then select the same set and the
# ambiguity costs nothing. It is not the two definitions that hurt; it is the
# gap between the populations they select.

logged_in_30d => nc_logged_in
logged_in_30d => nc_writers

"null control - the same two definitions where every login writes" ^0
"  growth definition selects   : " + str(nc_logged_in) ^0
"  platform definition selects : " + str(nc_writers) ^0
"  difference                  : " + str(nc_logged_in - nc_writers) ^0
"  revenue per active user, either way : " + str(int(revenue / nc_logged_in)) ^0
"  same ambiguity, same two repositories, and no consequence" ^0
"  the cost is exactly the size of the gap between the two populations" ^0
"" ^0

# ---- the rule ----

"a word used as a metric name" ^0
"  is each definition correct       yes, for its own question" ^0
"  is each query correct            yes, against its own definition" ^0
"  do the two select the same set   this is the question nobody owns" ^0
"  a shared name is a shared claim, and nobody made it deliberately" ^0
"" ^0
"the fix is not to pick a winner" ^0
"both questions are real, so both metrics should exist under DIFFERENT names" ^0
"" ^0

"A login is what a campaign can move and a write is what consumes storage, so" ^0
"neither team can adopt the other's definition without losing the answer they" ^0
"need. Both wrote their definition down. Neither wrote down that there are two." ^0
"Revenue per active user is " + str(arpu_growth) + " or " + str(arpu_platform) + " depending on which table you read," ^0
"and the conversion rate is " + str(rate_mixed) + ", " + str(rate_growth) + " or " + str(rate_platform) + " percent depending on which" ^0
"halves you join." ^0
```

## Python (deterministic transpilation)

```python
registered = 100000
logged_in_30d = 42000
wrote_something_30d = 18000
revenue = 840000
conversions_among_logged_in = 9000
conversions_among_writers = 7200
print("registered users                    : " + str(registered))
print("growth team, logged in within 30d   : " + str(logged_in_30d) + " (" + str(int(logged_in_30d * 100 / registered)) + " percent)")
print("platform team, wrote within 30d     : " + str(wrote_something_30d) + " (" + str(int(wrote_something_30d * 100 / registered)) + " percent)")
print("both tables are headed 'active users'")
print("")
print("  ratio between the two             : " + str(int(logged_in_30d * 100 / wrote_something_30d)) + " hundredths")
print("  writers are a subset of logins, so neither number is wrong")
print("")
arpu_growth = int(revenue / logged_in_30d)
arpu_platform = int(revenue / wrote_something_30d)
print("revenue per active user, from the same revenue figure")
print("  using the growth definition   : " + str(arpu_growth))
print("  using the platform definition : " + str(arpu_platform))
print("  difference                    : " + str(arpu_platform - arpu_growth) + ", a factor of " + str(int(arpu_platform * 100 / arpu_growth)) + " hundredths")
print("")
print("  the pricing model used one")
print("  the board deck used the other")
print("  both cite the same revenue and the same word")
print("")
rate_growth = int(conversions_among_logged_in * 100 / logged_in_30d)
rate_platform = int(conversions_among_writers * 100 / wrote_something_30d)
rate_mixed = int(conversions_among_writers * 100 / logged_in_30d)
print("conversion rate among active users")
print("  numerator and denominator both growth   : " + str(conversions_among_logged_in) + " / " + str(logged_in_30d) + " = " + str(rate_growth) + " percent")
print("  numerator and denominator both platform : " + str(conversions_among_writers) + " / " + str(wrote_something_30d) + " = " + str(rate_platform) + " percent")
print("  numerator platform, denominator growth  : " + str(conversions_among_writers) + " / " + str(logged_in_30d) + " = " + str(rate_mixed) + " percent")
print("")
print("  three numbers, all labelled 'active conversion rate'")
print("  the widest pair differ by " + str(rate_platform - rate_mixed) + " points")
print("  the mixed one is the only one that is wrong, and it is the one a")
print("  spreadsheet produces when two teams paste into adjacent columns")
print("")
print("what each team sees when it checks its own number")
print("  growth team re-runs its query   : " + str(logged_in_30d) + ", matches its own report")
print("  platform team re-runs its query : " + str(wrote_something_30d) + ", matches its own report")
print("  each team's number is reproducible, stable and documented")
print("  a disagreement needs someone holding BOTH definitions at once")
print("  and the definitions live in two repositories")
print("")
print("control - each query against its own written definition")
print("  growth: count users with a login event in the last 30 days")
print("    stated definition matched : yes")
print("    off-by-one on the window  : no")
print("  platform: count users with a write event in the last 30 days")
print("    stated definition matched : yes")
print("    off-by-one on the window  : no")
print("  incorrect queries found : 0 of 2")
print("")
print("  a review of either query approves it")
print("  the defect is the word, and a word is not in either repository")
print("")
nc_logged_in = logged_in_30d
nc_writers = logged_in_30d
print("null control - the same two definitions where every login writes")
print("  growth definition selects   : " + str(nc_logged_in))
print("  platform definition selects : " + str(nc_writers))
print("  difference                  : " + str(nc_logged_in - nc_writers))
print("  revenue per active user, either way : " + str(int(revenue / nc_logged_in)))
print("  same ambiguity, same two repositories, and no consequence")
print("  the cost is exactly the size of the gap between the two populations")
print("")
print("a word used as a metric name")
print("  is each definition correct       yes, for its own question")
print("  is each query correct            yes, against its own definition")
print("  do the two select the same set   this is the question nobody owns")
print("  a shared name is a shared claim, and nobody made it deliberately")
print("")
print("the fix is not to pick a winner")
print("both questions are real, so both metrics should exist under DIFFERENT names")
print("")
print("A login is what a campaign can move and a write is what consumes storage, so")
print("neither team can adopt the other's definition without losing the answer they")
print("need. Both wrote their definition down. Neither wrote down that there are two.")
print("Revenue per active user is " + str(arpu_growth) + " or " + str(arpu_platform) + " depending on which table you read,")
print("and the conversion rate is " + str(rate_mixed) + ", " + str(rate_growth) + " or " + str(rate_platform) + " percent depending on which")
print("halves you join.")
```

## stdout (executed)

```text
registered users                    : 100000
growth team, logged in within 30d   : 42000 (42 percent)
platform team, wrote within 30d     : 18000 (18 percent)
both tables are headed 'active users'

  ratio between the two             : 233 hundredths
  writers are a subset of logins, so neither number is wrong

revenue per active user, from the same revenue figure
  using the growth definition   : 20
  using the platform definition : 46
  difference                    : 26, a factor of 230 hundredths

  the pricing model used one
  the board deck used the other
  both cite the same revenue and the same word

conversion rate among active users
  numerator and denominator both growth   : 9000 / 42000 = 21 percent
  numerator and denominator both platform : 7200 / 18000 = 40 percent
  numerator platform, denominator growth  : 7200 / 42000 = 17 percent

  three numbers, all labelled 'active conversion rate'
  the widest pair differ by 23 points
  the mixed one is the only one that is wrong, and it is the one a
  spreadsheet produces when two teams paste into adjacent columns

what each team sees when it checks its own number
  growth team re-runs its query   : 42000, matches its own report
  platform team re-runs its query : 18000, matches its own report
  each team's number is reproducible, stable and documented
  a disagreement needs someone holding BOTH definitions at once
  and the definitions live in two repositories

control - each query against its own written definition
  growth: count users with a login event in the last 30 days
    stated definition matched : yes
    off-by-one on the window  : no
  platform: count users with a write event in the last 30 days
    stated definition matched : yes
    off-by-one on the window  : no
  incorrect queries found : 0 of 2

  a review of either query approves it
  the defect is the word, and a word is not in either repository

null control - the same two definitions where every login writes
  growth definition selects   : 42000
  platform definition selects : 42000
  difference                  : 0
  revenue per active user, either way : 20
  same ambiguity, same two repositories, and no consequence
  the cost is exactly the size of the gap between the two populations

a word used as a metric name
  is each definition correct       yes, for its own question
  is each query correct            yes, against its own definition
  do the two select the same set   this is the question nobody owns
  a shared name is a shared claim, and nobody made it deliberately

the fix is not to pick a winner
both questions are real, so both metrics should exist under DIFFERENT names

A login is what a campaign can move and a write is what consumes storage, so
neither team can adopt the other's definition without losing the answer they
need. Both wrote their definition down. Neither wrote down that there are two.
Revenue per active user is 20 or 46 depending on which table you read,
and the conversion rate is 17, 21 or 40 percent depending on which
halves you join.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
