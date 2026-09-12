<!-- canonical: efficientnewlanguage.org/ai/examples/819-the-three-checks-agreed-and-read-one-feed | ai_layer_version: 0.1.0 | updated: 2026-09-12 -->

# Example 819 — The three checks agreed and read one feed

`the_three_checks_agreed_and_read_one_feed.eml` - Three independent checks confirm the reference price before a trade, and they have agreed on every trade this quarter. What they read is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three independent
# checks confirm the reference price before a trade, and they have agreed on
# every trade this quarter. What they read is computed below.
#
# The control is designed for independence. There are three checks, not one;
# they are owned by three teams; a trade blocks unless all three agree; and each
# logs its own value.
#
# All three read the same upstream price feed.

3 => checks
3 => checks_that_agreed
1 => distinct_upstream_feeds
4 => days_the_feed_published_a_wrong_price
0 => days_any_check_disagreed
890000 => trades_in_the_quarter

checks - distinct_upstream_feeds => checks_beyond_the_first_that_add_no_independence
days_the_feed_published_a_wrong_price - days_any_check_disagreed => days_all_three_agreed_on_a_wrong_price
int(days_all_three_agreed_on_a_wrong_price * 10000 / 90) => wrong_price_days_per_myriad_of_the_quarter

"checks                          : " + str(checks) ^0
"  that agreed                   : " + str(checks_that_agreed) ^0
"distinct upstream feeds         : " + str(distinct_upstream_feeds) ^0
"  redundant checks beyond one   : " + str(checks_beyond_the_first_that_add_no_independence) ^0
"" ^0
"days the feed published a wrong price : " + str(days_the_feed_published_a_wrong_price) ^0
"  days any check disagreed      : " + str(days_any_check_disagreed) ^0
"  days all three agreed wrongly : " + str(days_all_three_agreed_on_a_wrong_price) ^0
"trades in the quarter           : " + str(trades_in_the_quarter) ^0
"" ^0

# ---- what the three checks verified ----

"the three-way check" ^0
"  checks : three, not one" ^0
"  owners : three teams" ^0
"  a trade blocks unless : all three agree" ^0
"  logging : each its own value" ^0
"  days all three agreed : every day" ^0
"  verdict : PRICE CONFIRMED" ^0
"" ^0
"  three separate owners is the part done right here, and" ^0
"  it is why no single team can wave a price through" ^0
"" ^0

# ---- what the three read ----

"the source behind the checks" ^0
"  feeds they read : one, shared" ^0
"  what that makes three checks : one check run three" ^0
"    times" ^0
"  when the feed is right : all three agree, correctly" ^0
"  when the feed is wrong : all three agree, wrongly, and" ^0
"    the trade proceeds" ^0
"  independence three owners add over the feed : none" ^0
"" ^0

# ---- what happened on the wrong-price days ----

"the four days the feed was wrong" ^0
"  checks that caught it : 0" ^0
"  why : each read the same wrong number and matched it" ^0
"  trades blocked those days : 0" ^0
"  what three-way agreement proved : that they share a" ^0
"    feed, not that the price was right" ^0
"  wrong-price days as a share of the quarter : " ^0
"    " + str(wrong_price_days_per_myriad_of_the_quarter) + " per ten thousand" ^0
"" ^0

# ---- null control ----

# The same three checks, with two pointed at independent feeds so a wrong value
# on one is contradicted by the others.
0 => nc_disagreements_when_the_feed_is_shared
4 => nc_disagreements_when_feeds_are_independent
4 => nc_wrong_price_days_it_would_catch

"null control - two checks on independent feeds" ^0
"  disagreements with a shared feed : " ^0
"    " + str(nc_disagreements_when_the_feed_is_shared) ^0
"  disagreements with independent feeds : " ^0
"    " + str(nc_disagreements_when_feeds_are_independent) ^0
"  wrong-price days it would catch : " ^0
"    " + str(nc_wrong_price_days_it_would_catch) ^0
"  no check changed; two stopped reading the same source" ^0
"  the third does" ^0
"" ^0

# ---- the rule ----

"what three agreeing checks guarantee" ^0
"  three checks read the same value : exactly, three" ^0
"    owners, a trade blocked unless all agree" ^0
"  the value is corroborated : not addressed; the three" ^0
"    checks read one feed, so they are one check run three" ^0
"    times, and on " + str(days_all_three_agreed_on_a_wrong_price) + " days they agreed on a wrong number" ^0
"" ^0

"corroboration counts the independent sources, not the readers; three readers of" ^0
"one source are one source, and unanimity among them is what a single wrong" ^0
"upstream value produces" ^0
"" ^0

"Three checks, three teams, a trade blocked unless all agree - unanimous every" ^0
"trade. All three read one feed, so they are one check thrice: on " + str(days_all_three_agreed_on_a_wrong_price) + " days the" ^0
"feed was wrong they agreed wrongly and blocked nothing, " + str(wrong_price_days_per_myriad_of_the_quarter) + " per ten thousand" ^0
"of the quarter, under " + str(distinct_upstream_feeds) + " independent feed." ^0
```

## Python (deterministic transpilation)

```python
checks = 3
checks_that_agreed = 3
distinct_upstream_feeds = 1
days_the_feed_published_a_wrong_price = 4
days_any_check_disagreed = 0
trades_in_the_quarter = 890000
checks_beyond_the_first_that_add_no_independence = checks - distinct_upstream_feeds
days_all_three_agreed_on_a_wrong_price = days_the_feed_published_a_wrong_price - days_any_check_disagreed
wrong_price_days_per_myriad_of_the_quarter = int(days_all_three_agreed_on_a_wrong_price * 10000 / 90)
print("checks                          : " + str(checks))
print("  that agreed                   : " + str(checks_that_agreed))
print("distinct upstream feeds         : " + str(distinct_upstream_feeds))
print("  redundant checks beyond one   : " + str(checks_beyond_the_first_that_add_no_independence))
print("")
print("days the feed published a wrong price : " + str(days_the_feed_published_a_wrong_price))
print("  days any check disagreed      : " + str(days_any_check_disagreed))
print("  days all three agreed wrongly : " + str(days_all_three_agreed_on_a_wrong_price))
print("trades in the quarter           : " + str(trades_in_the_quarter))
print("")
print("the three-way check")
print("  checks : three, not one")
print("  owners : three teams")
print("  a trade blocks unless : all three agree")
print("  logging : each its own value")
print("  days all three agreed : every day")
print("  verdict : PRICE CONFIRMED")
print("")
print("  three separate owners is the part done right here, and")
print("  it is why no single team can wave a price through")
print("")
print("the source behind the checks")
print("  feeds they read : one, shared")
print("  what that makes three checks : one check run three")
print("    times")
print("  when the feed is right : all three agree, correctly")
print("  when the feed is wrong : all three agree, wrongly, and")
print("    the trade proceeds")
print("  independence three owners add over the feed : none")
print("")
print("the four days the feed was wrong")
print("  checks that caught it : 0")
print("  why : each read the same wrong number and matched it")
print("  trades blocked those days : 0")
print("  what three-way agreement proved : that they share a")
print("    feed, not that the price was right")
print("  wrong-price days as a share of the quarter : ")
print("    " + str(wrong_price_days_per_myriad_of_the_quarter) + " per ten thousand")
print("")
nc_disagreements_when_the_feed_is_shared = 0
nc_disagreements_when_feeds_are_independent = 4
nc_wrong_price_days_it_would_catch = 4
print("null control - two checks on independent feeds")
print("  disagreements with a shared feed : ")
print("    " + str(nc_disagreements_when_the_feed_is_shared))
print("  disagreements with independent feeds : ")
print("    " + str(nc_disagreements_when_feeds_are_independent))
print("  wrong-price days it would catch : ")
print("    " + str(nc_wrong_price_days_it_would_catch))
print("  no check changed; two stopped reading the same source")
print("  the third does")
print("")
print("what three agreeing checks guarantee")
print("  three checks read the same value : exactly, three")
print("    owners, a trade blocked unless all agree")
print("  the value is corroborated : not addressed; the three")
print("    checks read one feed, so they are one check run three")
print("    times, and on " + str(days_all_three_agreed_on_a_wrong_price) + " days they agreed on a wrong number")
print("")
print("corroboration counts the independent sources, not the readers; three readers of")
print("one source are one source, and unanimity among them is what a single wrong")
print("upstream value produces")
print("")
print("Three checks, three teams, a trade blocked unless all agree - unanimous every")
print("trade. All three read one feed, so they are one check thrice: on " + str(days_all_three_agreed_on_a_wrong_price) + " days the")
print("feed was wrong they agreed wrongly and blocked nothing, " + str(wrong_price_days_per_myriad_of_the_quarter) + " per ten thousand")
print("of the quarter, under " + str(distinct_upstream_feeds) + " independent feed.")
```

## stdout (executed)

```text
checks                          : 3
  that agreed                   : 3
distinct upstream feeds         : 1
  redundant checks beyond one   : 2

days the feed published a wrong price : 4
  days any check disagreed      : 0
  days all three agreed wrongly : 4
trades in the quarter           : 890000

the three-way check
  checks : three, not one
  owners : three teams
  a trade blocks unless : all three agree
  logging : each its own value
  days all three agreed : every day
  verdict : PRICE CONFIRMED

  three separate owners is the part done right here, and
  it is why no single team can wave a price through

the source behind the checks
  feeds they read : one, shared
  what that makes three checks : one check run three
    times
  when the feed is right : all three agree, correctly
  when the feed is wrong : all three agree, wrongly, and
    the trade proceeds
  independence three owners add over the feed : none

the four days the feed was wrong
  checks that caught it : 0
  why : each read the same wrong number and matched it
  trades blocked those days : 0
  what three-way agreement proved : that they share a
    feed, not that the price was right
  wrong-price days as a share of the quarter : 
    444 per ten thousand

null control - two checks on independent feeds
  disagreements with a shared feed : 
    0
  disagreements with independent feeds : 
    4
  wrong-price days it would catch : 
    4
  no check changed; two stopped reading the same source
  the third does

what three agreeing checks guarantee
  three checks read the same value : exactly, three
    owners, a trade blocked unless all agree
  the value is corroborated : not addressed; the three
    checks read one feed, so they are one check run three
    times, and on 4 days they agreed on a wrong number

corroboration counts the independent sources, not the readers; three readers of
one source are one source, and unanimity among them is what a single wrong
upstream value produces

Three checks, three teams, a trade blocked unless all agree - unanimous every
trade. All three read one feed, so they are one check thrice: on 4 days the
feed was wrong they agreed wrongly and blocked nothing, 444 per ten thousand
of the quarter, under 1 independent feed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
