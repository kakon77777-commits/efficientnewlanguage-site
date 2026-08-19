<!-- canonical: efficientnewlanguage.org/ai/examples/458-the-return-term-arrives-after-the-review | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 458 — The return term arrives after the review

`the_return_term_arrives_after_the_review.eml` - Each change was reviewed two weeks after it shipped. What each one is worth at two weeks and at six months is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each change was
# reviewed two weeks after it shipped. What each one is worth at two weeks and
# at six months is computed below.
#
# Reviewing at two weeks is the right cadence for most of what a team ships.
# The signal is there, the context is fresh, the people who made the decision
# are still on it, and a review held six months out is a review nobody attends
# and nothing acts on.
#
# Some changes have a term that arrives later than the review: an index that
# has to be rebuilt, a queue that fills slowly, a dependency that is pinned
# now and unpinnable in a year. A cadence chosen for the common case reads
# those at the point where only their first term has landed.
#
# Both horizons are computed for the same five changes.

# [change, benefit per week, week the cost lands, size of that cost]
[["drop the extra index", 8, 0, 0], ["cache the join", 12, 10, 260], ["pin the dependency", 5, 40, 300], ["batch the writes", 6, 3, 40], ["denormalise the table", 15, 14, 520]] => changes

len(changes) => n
2 => review_week
26 => horizon

def value_at(c, week):
    c[1] * week => gained
    0 => paid
    if week >= c[2]:
        c[3] => paid
    return gained - paid

"changes : " + str(n) + ", reviewed at week " + str(review_week) + ", horizon week " + str(horizon) ^0
"" ^0
"change                  at week " + str(review_week) + "   at week " + str(horizon) + "   cost lands" ^0
for c in changes:
    "" => when
    if c[2] == 0:
        "never" => when
    else:
        "week " + str(c[2]) => when
    "  " + c[0] + "   " + str(value_at(c, review_week)) + "        " + str(value_at(c, horizon)) + "        " + when ^0
"" ^0

# ---- the two rankings ----

"" => best_early
0 - 9999 => be
"" => best_late
0 - 9999 => bl
for c in changes:
    if value_at(c, review_week) > be:
        value_at(c, review_week) => be
        c[0] => best_early
    if value_at(c, horizon) > bl:
        value_at(c, horizon) => bl
        c[0] => best_late
"best change by the review-week number : " + best_early + " (" + str(be) + ")" ^0
"best change by the horizon number     : " + best_late + " (" + str(bl) + ")" ^0
if not (best_early == best_late):
    "  different changes, and the review is what the next quarter copies" ^0
"" ^0

0 => positive_early
0 => negative_late
for c in changes:
    if value_at(c, review_week) > 0:
        positive_early + 1 => positive_early
        if value_at(c, horizon) < 0:
            negative_late + 1 => negative_late
"changes that look good at week " + str(review_week) + " : " + str(positive_early) + " of " + str(n) ^0
if negative_late > 0:
    "  of those, negative by week " + str(horizon) + " : " + str(negative_late) ^0
    for c in changes:
        if value_at(c, review_week) > 0:
            if value_at(c, horizon) < 0:
                "    " + c[0] + " : " + str(value_at(c, review_week)) + " then " + str(value_at(c, horizon)) ^0
"" ^0

# ---- how far out the review would have to sit ----

0 => latest
for c in changes:
    if c[2] > latest:
        c[2] => latest
"the last cost to land does so at week " + str(latest) ^0
if latest > review_week:
    "  a review that saw every term would sit " + str(latest - review_week) + " weeks later than this one" ^0
    "  and would be held after the next " + str(int((latest - review_week) / review_week)) + " reviews had already happened" ^0
"" ^0

# ---- what the review can do without moving ----
#
# Not wait. Record, at review time, the week each change's remaining term is
# due, which is knowable then and is what the review is missing.

0 => with_pending
for c in changes:
    if c[2] > review_week:
        with_pending + 1 => with_pending
"changes with a term still outstanding at the review : " + str(with_pending) + " of " + str(n) ^0
if with_pending > 0:
    "  each of those is knowable at review time, because the cost is scheduled" ^0
    "  and not discovered; the review reads a number, not a forecast" ^0
"" ^0

# ---- the control: changes whose whole effect is immediate ----
#
# Where nothing is outstanding, the review-week ranking and the horizon
# ranking are the same ranking.

[["a", 8, 0, 0], ["b", 12, 0, 0], ["c", 5, 0, 0]] => immediate
"" => ie
0 => iev
"" => il
0 => ilv
for c in immediate:
    if value_at(c, review_week) > iev:
        value_at(c, review_week) => iev
        c[0] => ie
    if value_at(c, horizon) > ilv:
        value_at(c, horizon) => ilv
        c[0] => il
"control - three changes with no later term" ^0
"  best at week " + str(review_week) + " : " + ie + ", best at week " + str(horizon) + " : " + il ^0
if ie == il:
    "  the same change under both, so the cadence decides nothing here" ^0
"" ^0

"Two weeks is the right cadence for the changes whose whole effect has" ^0
"landed by then, which is most of them. For the rest the review reads the" ^0
"first term of a sum, and the date it is held on is what selects which." ^0
```

## Python (deterministic transpilation)

```python
changes = [["drop the extra index", 8, 0, 0], ["cache the join", 12, 10, 260], ["pin the dependency", 5, 40, 300], ["batch the writes", 6, 3, 40], ["denormalise the table", 15, 14, 520]]
n = len(changes)
review_week = 2
horizon = 26

def value_at(c, week):
    gained = c[1] * week
    paid = 0
    if week >= c[2]:
        paid = c[3]
    return gained - paid

print("changes : " + str(n) + ", reviewed at week " + str(review_week) + ", horizon week " + str(horizon))
print("")
print("change                  at week " + str(review_week) + "   at week " + str(horizon) + "   cost lands")
for c in changes:
    when = ""
    if c[2] == 0:
        when = "never"
    else:
        when = "week " + str(c[2])
    print("  " + c[0] + "   " + str(value_at(c, review_week)) + "        " + str(value_at(c, horizon)) + "        " + when)
print("")
best_early = ""
be = 0 - 9999
best_late = ""
bl = 0 - 9999
for c in changes:
    if value_at(c, review_week) > be:
        be = value_at(c, review_week)
        best_early = c[0]
    if value_at(c, horizon) > bl:
        bl = value_at(c, horizon)
        best_late = c[0]
print("best change by the review-week number : " + best_early + " (" + str(be) + ")")
print("best change by the horizon number     : " + best_late + " (" + str(bl) + ")")
if not best_early == best_late:
    print("  different changes, and the review is what the next quarter copies")
print("")
positive_early = 0
negative_late = 0
for c in changes:
    if value_at(c, review_week) > 0:
        positive_early = positive_early + 1
        if value_at(c, horizon) < 0:
            negative_late = negative_late + 1
print("changes that look good at week " + str(review_week) + " : " + str(positive_early) + " of " + str(n))
if negative_late > 0:
    print("  of those, negative by week " + str(horizon) + " : " + str(negative_late))
    for c in changes:
        if value_at(c, review_week) > 0:
            if value_at(c, horizon) < 0:
                print("    " + c[0] + " : " + str(value_at(c, review_week)) + " then " + str(value_at(c, horizon)))
print("")
latest = 0
for c in changes:
    if c[2] > latest:
        latest = c[2]
print("the last cost to land does so at week " + str(latest))
if latest > review_week:
    print("  a review that saw every term would sit " + str(latest - review_week) + " weeks later than this one")
    print("  and would be held after the next " + str(int((latest - review_week) / review_week)) + " reviews had already happened")
print("")
with_pending = 0
for c in changes:
    if c[2] > review_week:
        with_pending = with_pending + 1
print("changes with a term still outstanding at the review : " + str(with_pending) + " of " + str(n))
if with_pending > 0:
    print("  each of those is knowable at review time, because the cost is scheduled")
    print("  and not discovered; the review reads a number, not a forecast")
print("")
immediate = [["a", 8, 0, 0], ["b", 12, 0, 0], ["c", 5, 0, 0]]
ie = ""
iev = 0
il = ""
ilv = 0
for c in immediate:
    if value_at(c, review_week) > iev:
        iev = value_at(c, review_week)
        ie = c[0]
    if value_at(c, horizon) > ilv:
        ilv = value_at(c, horizon)
        il = c[0]
print("control - three changes with no later term")
print("  best at week " + str(review_week) + " : " + ie + ", best at week " + str(horizon) + " : " + il)
if ie == il:
    print("  the same change under both, so the cadence decides nothing here")
print("")
print("Two weeks is the right cadence for the changes whose whole effect has")
print("landed by then, which is most of them. For the rest the review reads the")
print("first term of a sum, and the date it is held on is what selects which.")
```

## stdout (executed)

```text
changes : 5, reviewed at week 2, horizon week 26

change                  at week 2   at week 26   cost lands
  drop the extra index   16        208        never
  cache the join   24        52        week 10
  pin the dependency   10        130        week 40
  batch the writes   12        116        week 3
  denormalise the table   30        -130        week 14

best change by the review-week number : denormalise the table (30)
best change by the horizon number     : drop the extra index (208)
  different changes, and the review is what the next quarter copies

changes that look good at week 2 : 5 of 5
  of those, negative by week 26 : 1
    denormalise the table : 30 then -130

the last cost to land does so at week 40
  a review that saw every term would sit 38 weeks later than this one
  and would be held after the next 19 reviews had already happened

changes with a term still outstanding at the review : 4 of 5
  each of those is knowable at review time, because the cost is scheduled
  and not discovered; the review reads a number, not a forecast

control - three changes with no later term
  best at week 2 : b, best at week 26 : b
  the same change under both, so the cadence decides nothing here

Two weeks is the right cadence for the changes whose whole effect has
landed by then, which is most of them. For the rest the review reads the
first term of a sum, and the date it is held on is what selects which.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
