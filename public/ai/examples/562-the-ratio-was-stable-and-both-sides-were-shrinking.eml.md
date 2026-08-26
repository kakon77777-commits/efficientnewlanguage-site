<!-- canonical: efficientnewlanguage.org/ai/examples/562-the-ratio-was-stable-and-both-sides-were-shrinking | ai_layer_version: 0.1.0 | updated: 2026-08-26 -->

# Example 562 — The ratio was stable and both sides were shrinking

`the_ratio_was_stable_and_both_sides_were_shrinking.eml` - Conversion rate held at 3.0 percent for twelve months. What held it there is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Conversion rate
# held at 3.0 percent for twelve months. What held it there is computed below.
#
# Conversion rate is the right primary metric for the team that owns the funnel,
# and it was chosen for good reasons. It is scale-free, so it is comparable
# across a quiet January and a busy November without anyone arguing about
# seasonality. It isolates the funnel from acquisition, which the funnel team
# does not control and should not be judged on. And it cannot be improved by
# buying traffic, which is exactly the gaming a raw purchase count invites.
#
# A ratio holds when its two terms move together. It holds when both grow, and
# it holds when both shrink, and it reports the same number in both cases. What
# it cannot report is which of those happened.
#
# The funnel team's metric was flat and correct for twelve months. Acquisition
# was a different team's metric, on a different dashboard, and it is not that
# either team was negligent - it is that no one owned the product of the two.

50 => revenue_per_purchase

# [month, visits, purchases]
[[1, 200000, 6000], [4, 173000, 5190], [8, 143000, 4290], [12, 120000, 3600]] => months

"month    visits    purchases   conversion   revenue" ^0
0 => first_revenue
0 => last_revenue
0 => first_visits
0 => last_visits
for m in months:
    int(m[2] * 1000 / m[1]) => conv_per_mille
    m[2] * revenue_per_purchase => revenue
    if m[0] == 1:
        revenue => first_revenue
        m[1] => first_visits
    revenue => last_revenue
    m[1] => last_visits
    "  " + str(m[0]) + "       " + str(m[1]) + "    " + str(m[2]) + "        " + str(conv_per_mille) + " per mille   " + str(revenue) ^0
"" ^0

"  conversion in month 1  : 30 per mille" ^0
"  conversion in month 12 : 30 per mille" ^0
"  change                 : 0 per mille, across twelve consecutive months" ^0
"" ^0

# ---- the two terms ----

first_visits - last_visits => visits_lost
first_revenue - last_revenue => revenue_lost

"visits  : " + str(first_visits) + " -> " + str(last_visits) + ", down " + str(int(visits_lost * 100 / first_visits)) + " percent" ^0
"revenue : " + str(first_revenue) + " -> " + str(last_revenue) + ", down " + str(int(revenue_lost * 100 / first_revenue)) + " percent" ^0
"ratio   : unchanged" ^0
"" ^0
"the ratio was not lagging or noisy or slow to react" ^0
"it was reporting, correctly, that the funnel converted as well as it ever did" ^0
"" ^0

# ---- what a stable ratio is consistent with ----
#
# Four different worlds produce the same 30 per mille. Only one of them is the
# one everybody pictures.

"worlds consistent with a flat conversion rate" ^0
"  visits up, purchases up      growth" ^0
"  visits flat, purchases flat  steady state" ^0
"  visits down, purchases down  this one" ^0
"  visits halved, purchases halved  the same reading again" ^0
"  the dashboard cannot separate these, and it was never able to" ^0
"" ^0

# ---- the fix is not a better ratio ----

"  a ratio needs one of its terms shown beside it" ^0
"  either term will do; the pair determines the third" ^0
"  the funnel dashboard showed the ratio and the funnel stages" ^0
"  every stage was also a ratio" ^0
"" ^0

# ---- the control ----
#
# The absolute counts. They are on a different dashboard, owned by a different
# team, and they moved every month. Nothing was hidden; the two halves were
# never put on one page.

"control - the absolute counts, which no ratio can hold flat" ^0
0 => months_with_decline
0 => prev_visits
for m in months:
    if prev_visits > 0:
        if m[1] < prev_visits:
            months_with_decline + 1 => months_with_decline
    m[1] => prev_visits
"  measurement points      : 4" ^0
"  points where visits fell: " + str(months_with_decline) + " of 3 transitions" ^0
"  visits lost             : " + str(visits_lost) ^0
"  revenue lost            : " + str(revenue_lost) ^0
"  the decline is visible in every single reading of the raw count" ^0
"" ^0

# ---- the null control ----
#
# The same ratio, over a period where the numerator alone moves. The ratio
# catches it immediately. A conversion rate is not a bad metric; it is blind to
# exactly one direction of failure, and that direction is the one that happened.

"null control - the same metric when only the numerator moves" ^0
200000 => nc_visits
6000 => nc_purchases_before
4200 => nc_purchases_after
"  visits              : " + str(nc_visits) + ", unchanged" ^0
"  purchases           : " + str(nc_purchases_before) + " -> " + str(nc_purchases_after) ^0
"  conversion          : " + str(int(nc_purchases_before * 1000 / nc_visits)) + " -> " + str(int(nc_purchases_after * 1000 / nc_visits)) + " per mille" ^0
"  the ratio moved " + str(int(nc_purchases_before * 1000 / nc_visits) - int(nc_purchases_after * 1000 / nc_visits)) + " per mille and would have paged" ^0
"  so the metric works; it is blind only when both terms move together" ^0
"" ^0

# ---- the rule ----

"what a scale-free metric gives up in exchange for being scale-free" ^0
"  comparable across seasons        gained" ^0
"  cannot be gamed by buying traffic gained" ^0
"  isolates the team from acquisition gained" ^0
"  detects a change in scale         given up, by construction" ^0
"  the property that makes it fair is the property that makes it blind" ^0
"" ^0

"Conversion rate is scale-free on purpose: it is comparable across seasons, it" ^0
"cannot be improved by buying traffic, and it does not judge the funnel team on" ^0
"acquisition. Being scale-free means a halving of both terms reads identically" ^0
"to no change at all. Visits fell " + str(int(visits_lost * 100 / first_visits)) + " percent, revenue fell " + str(int(revenue_lost * 100 / first_revenue)) + " percent, and" ^0
"the number the funnel team was accountable for did not move once." ^0
```

## Python (deterministic transpilation)

```python
revenue_per_purchase = 50
months = [[1, 200000, 6000], [4, 173000, 5190], [8, 143000, 4290], [12, 120000, 3600]]
print("month    visits    purchases   conversion   revenue")
first_revenue = 0
last_revenue = 0
first_visits = 0
last_visits = 0
for m in months:
    conv_per_mille = int(m[2] * 1000 / m[1])
    revenue = m[2] * revenue_per_purchase
    if m[0] == 1:
        first_revenue = revenue
        first_visits = m[1]
    last_revenue = revenue
    last_visits = m[1]
    print("  " + str(m[0]) + "       " + str(m[1]) + "    " + str(m[2]) + "        " + str(conv_per_mille) + " per mille   " + str(revenue))
print("")
print("  conversion in month 1  : 30 per mille")
print("  conversion in month 12 : 30 per mille")
print("  change                 : 0 per mille, across twelve consecutive months")
print("")
visits_lost = first_visits - last_visits
revenue_lost = first_revenue - last_revenue
print("visits  : " + str(first_visits) + " -> " + str(last_visits) + ", down " + str(int(visits_lost * 100 / first_visits)) + " percent")
print("revenue : " + str(first_revenue) + " -> " + str(last_revenue) + ", down " + str(int(revenue_lost * 100 / first_revenue)) + " percent")
print("ratio   : unchanged")
print("")
print("the ratio was not lagging or noisy or slow to react")
print("it was reporting, correctly, that the funnel converted as well as it ever did")
print("")
print("worlds consistent with a flat conversion rate")
print("  visits up, purchases up      growth")
print("  visits flat, purchases flat  steady state")
print("  visits down, purchases down  this one")
print("  visits halved, purchases halved  the same reading again")
print("  the dashboard cannot separate these, and it was never able to")
print("")
print("  a ratio needs one of its terms shown beside it")
print("  either term will do; the pair determines the third")
print("  the funnel dashboard showed the ratio and the funnel stages")
print("  every stage was also a ratio")
print("")
print("control - the absolute counts, which no ratio can hold flat")
months_with_decline = 0
prev_visits = 0
for m in months:
    if prev_visits > 0:
        if m[1] < prev_visits:
            months_with_decline = months_with_decline + 1
    prev_visits = m[1]
print("  measurement points      : 4")
print("  points where visits fell: " + str(months_with_decline) + " of 3 transitions")
print("  visits lost             : " + str(visits_lost))
print("  revenue lost            : " + str(revenue_lost))
print("  the decline is visible in every single reading of the raw count")
print("")
print("null control - the same metric when only the numerator moves")
nc_visits = 200000
nc_purchases_before = 6000
nc_purchases_after = 4200
print("  visits              : " + str(nc_visits) + ", unchanged")
print("  purchases           : " + str(nc_purchases_before) + " -> " + str(nc_purchases_after))
print("  conversion          : " + str(int(nc_purchases_before * 1000 / nc_visits)) + " -> " + str(int(nc_purchases_after * 1000 / nc_visits)) + " per mille")
print("  the ratio moved " + str(int(nc_purchases_before * 1000 / nc_visits) - int(nc_purchases_after * 1000 / nc_visits)) + " per mille and would have paged")
print("  so the metric works; it is blind only when both terms move together")
print("")
print("what a scale-free metric gives up in exchange for being scale-free")
print("  comparable across seasons        gained")
print("  cannot be gamed by buying traffic gained")
print("  isolates the team from acquisition gained")
print("  detects a change in scale         given up, by construction")
print("  the property that makes it fair is the property that makes it blind")
print("")
print("Conversion rate is scale-free on purpose: it is comparable across seasons, it")
print("cannot be improved by buying traffic, and it does not judge the funnel team on")
print("acquisition. Being scale-free means a halving of both terms reads identically")
print("to no change at all. Visits fell " + str(int(visits_lost * 100 / first_visits)) + " percent, revenue fell " + str(int(revenue_lost * 100 / first_revenue)) + " percent, and")
print("the number the funnel team was accountable for did not move once.")
```

## stdout (executed)

```text
month    visits    purchases   conversion   revenue
  1       200000    6000        30 per mille   300000
  4       173000    5190        30 per mille   259500
  8       143000    4290        30 per mille   214500
  12       120000    3600        30 per mille   180000

  conversion in month 1  : 30 per mille
  conversion in month 12 : 30 per mille
  change                 : 0 per mille, across twelve consecutive months

visits  : 200000 -> 120000, down 40 percent
revenue : 300000 -> 180000, down 40 percent
ratio   : unchanged

the ratio was not lagging or noisy or slow to react
it was reporting, correctly, that the funnel converted as well as it ever did

worlds consistent with a flat conversion rate
  visits up, purchases up      growth
  visits flat, purchases flat  steady state
  visits down, purchases down  this one
  visits halved, purchases halved  the same reading again
  the dashboard cannot separate these, and it was never able to

  a ratio needs one of its terms shown beside it
  either term will do; the pair determines the third
  the funnel dashboard showed the ratio and the funnel stages
  every stage was also a ratio

control - the absolute counts, which no ratio can hold flat
  measurement points      : 4
  points where visits fell: 3 of 3 transitions
  visits lost             : 80000
  revenue lost            : 120000
  the decline is visible in every single reading of the raw count

null control - the same metric when only the numerator moves
  visits              : 200000, unchanged
  purchases           : 6000 -> 4200
  conversion          : 30 -> 21 per mille
  the ratio moved 9 per mille and would have paged
  so the metric works; it is blind only when both terms move together

what a scale-free metric gives up in exchange for being scale-free
  comparable across seasons        gained
  cannot be gamed by buying traffic gained
  isolates the team from acquisition gained
  detects a change in scale         given up, by construction
  the property that makes it fair is the property that makes it blind

Conversion rate is scale-free on purpose: it is comparable across seasons, it
cannot be improved by buying traffic, and it does not judge the funnel team on
acquisition. Being scale-free means a halving of both terms reads identically
to no change at all. Visits fell 40 percent, revenue fell 40 percent, and
the number the funnel team was accountable for did not move once.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
