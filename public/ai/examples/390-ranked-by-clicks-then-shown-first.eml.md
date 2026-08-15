<!-- canonical: efficientnewlanguage.org/ai/examples/390-ranked-by-clicks-then-shown-first | ai_layer_version: 0.1.0 | updated: 2026-08-15 -->

# Example 390 — Ranked by clicks, then shown first - locks in at 66% and never reaches 100%

`ranked_by_clicks_then_shown_first.eml` runs the ranker for five days over items whose quality is fixed, known to the program, and never read by the ranker.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The list is
# ordered by clicks. Position determines clicks. The list orders itself.
#
# Ranking by clicks is the honest choice available. Nobody has to guess what is
# good, no editor imposes taste, and the signal comes from the people the list
# is for. On the first day it works exactly as intended.
#
# From the second day the clicks it reads are clicks it caused, because the top
# of a list is seen more than the bottom regardless of what is there. The rule
# is still measuring something real; what it measures is no longer only quality.
#
# Quality is fixed and known to this program and never read by the ranker. The
# question asked here is how much of that order the visible list recovers.

# [name, quality]
[["a", 3], ["b", 9], ["c", 5], ["d", 7], ["e", 4], ["f", 8]] => items

# How much each slot is seen. The top is seen ten times as much as the bottom.
[10, 6, 4, 3, 2, 1] => attention
[1, 1, 1, 1, 1, 1] => flat

def quality_of(idx):
    return items[idx][1]

def order_by(scores):
    [] => out
    [] => used
    for k in [1:len(items)]:
        -1 => best
        0 => at
        0 => i
        for s in scores:
            0 => taken
            for u in used:
                if u == i:
                    1 => taken
            if taken == 0:
                if s > best:
                    s => best
                    i => at
            i + 1 => i
        used + [at] => used
        out + [at] => out
    return out

# One day: each item earns clicks at the slot it currently occupies, and the
# next day's order is those click counts.
def next_order(order, weights):
    [] => scored
    for it in items:
        scored + [-1] => scored
    0 => pos
    for idx in order:
        [] => nb
        0 => q
        for v in scored:
            if q == idx:
                nb + [quality_of(idx) * weights[pos]] => nb
            else:
                nb + [v] => nb
            q + 1 => q
        nb => scored
        pos + 1 => pos
    return order_by(scored)

def concordance(order):
    0 => agree
    0 => pairs
    0 => i
    for x in order:
        0 => j
        for y in order:
            if j > i:
                if not (quality_of(x) == quality_of(y)):
                    pairs + 1 => pairs
                    if quality_of(x) > quality_of(y):
                        agree + 1 => agree
            j + 1 => j
        i + 1 => i
    return int(agree * 100 / pairs)

def names(order):
    "" => s
    for idx in order:
        s + items[idx][0] => s
    return s

[] => truth_scores
for it in items:
    truth_scores + [it[1]] => truth_scores
order_by(truth_scores) => true_order

"items and their quality, which the ranker never reads" ^0
for it in items:
    "  " + it[0] + " : " + str(it[1]) ^0
"  best possible order : " + names(true_order) + "  (" + str(concordance(true_order)) + "%)" ^0
"" ^0

# ---- the list, day by day ----
#
# The launch order is alphabetical because on day 0 nothing better exists.

[0, 1, 2, 3, 4, 5] => order
5 => days
"day 0 - launch order : " + names(order) + "  (" + str(concordance(order)) + "%)" ^0
for d in [1:days]:
    next_order(order, attention) => order
    "day " + str(d) + " - " + names(order) + "  (" + str(concordance(order)) + "%)" ^0
"" ^0
"  best possible : " + str(concordance(true_order)) + "%" ^0
"  reached       : " + str(concordance(order)) + "%" ^0
"" ^0

# ---- how much of a click count is the slot ----

"the same item at each slot" ^0
for p in [0:5]:
    "  quality 5 at slot " + str(p + 1) + " : " + str(5 * attention[p]) + " clicks" ^0
"" ^0
"the worst item at the top against the best at the bottom" ^0
"  quality 3 at slot 1 : " + str(3 * attention[0]) ^0
"  quality 9 at slot 6 : " + str(9 * attention[5]) ^0
if 3 * attention[0] > 9 * attention[5]:
    "  position outweighs a three-fold quality gap" ^0
"" ^0

# ---- the control: the same ranker where every slot is seen equally ----
#
# Without this the case reads as "click ranking cannot work". It works when the
# clicks are not also a record of where the ranker put things.

[0, 1, 2, 3, 4, 5] => order2
for d in [1:days]:
    next_order(order2, flat) => order2
"control - every slot seen equally" ^0
"  order : " + names(order2) + "  (" + str(concordance(order2)) + "%)" ^0
if concordance(order2) == concordance(true_order):
    "  with position removed, clicks recover the quality order exactly" ^0
"" ^0

"The ranker reads a real signal. After the first day that signal contains the" ^0
"ranker's own previous output, and nothing in a click count says which part is" ^0
"which." ^0
```

## Python (deterministic transpilation)

```python
items = [["a", 3], ["b", 9], ["c", 5], ["d", 7], ["e", 4], ["f", 8]]
attention = [10, 6, 4, 3, 2, 1]
flat = [1, 1, 1, 1, 1, 1]

def quality_of(idx):
    return items[idx][1]

def order_by(scores):
    out = []
    used = []
    for k in range(1, len(items)+1):
        best = -1
        at = 0
        i = 0
        for s in scores:
            taken = 0
            for u in used:
                if u == i:
                    taken = 1
            if taken == 0:
                if s > best:
                    best = s
                    at = i
            i = i + 1
        used = used + [at]
        out = out + [at]
    return out

def next_order(order, weights):
    scored = []
    for it in items:
        scored = scored + [-1]
    pos = 0
    for idx in order:
        nb = []
        q = 0
        for v in scored:
            if q == idx:
                nb = nb + [quality_of(idx) * weights[pos]]
            else:
                nb = nb + [v]
            q = q + 1
        scored = nb
        pos = pos + 1
    return order_by(scored)

def concordance(order):
    agree = 0
    pairs = 0
    i = 0
    for x in order:
        j = 0
        for y in order:
            if j > i:
                if not quality_of(x) == quality_of(y):
                    pairs = pairs + 1
                    if quality_of(x) > quality_of(y):
                        agree = agree + 1
            j = j + 1
        i = i + 1
    return int(agree * 100 / pairs)

def names(order):
    s = ""
    for idx in order:
        s = s + items[idx][0]
    return s

truth_scores = []
for it in items:
    truth_scores = truth_scores + [it[1]]
true_order = order_by(truth_scores)
print("items and their quality, which the ranker never reads")
for it in items:
    print("  " + it[0] + " : " + str(it[1]))
print("  best possible order : " + names(true_order) + "  (" + str(concordance(true_order)) + "%)")
print("")
order = [0, 1, 2, 3, 4, 5]
days = 5
print("day 0 - launch order : " + names(order) + "  (" + str(concordance(order)) + "%)")
for d in range(1, days+1):
    order = next_order(order, attention)
    print("day " + str(d) + " - " + names(order) + "  (" + str(concordance(order)) + "%)")
print("")
print("  best possible : " + str(concordance(true_order)) + "%")
print("  reached       : " + str(concordance(order)) + "%")
print("")
print("the same item at each slot")
for p in range(0, 6):
    print("  quality 5 at slot " + str(p + 1) + " : " + str(5 * attention[p]) + " clicks")
print("")
print("the worst item at the top against the best at the bottom")
print("  quality 3 at slot 1 : " + str(3 * attention[0]))
print("  quality 9 at slot 6 : " + str(9 * attention[5]))
if 3 * attention[0] > 9 * attention[5]:
    print("  position outweighs a three-fold quality gap")
print("")
order2 = [0, 1, 2, 3, 4, 5]
for d in range(1, days+1):
    order2 = next_order(order2, flat)
print("control - every slot seen equally")
print("  order : " + names(order2) + "  (" + str(concordance(order2)) + "%)")
if concordance(order2) == concordance(true_order):
    print("  with position removed, clicks recover the quality order exactly")
print("")
print("The ranker reads a real signal. After the first day that signal contains the")
print("ranker's own previous output, and nothing in a click count says which part is")
print("which.")
```

## stdout (executed)

```text
items and their quality, which the ranker never reads
  a : 3
  b : 9
  c : 5
  d : 7
  e : 4
  f : 8
  best possible order : bfdcea  (100%)

day 0 - launch order : abcdef  (40%)
day 1 - badcef  (53%)
day 2 - bdacef  (60%)
day 3 - bdcaef  (66%)
day 4 - bdcaef  (66%)
day 5 - bdcaef  (66%)

  best possible : 100%
  reached       : 66%

the same item at each slot
  quality 5 at slot 1 : 50 clicks
  quality 5 at slot 2 : 30 clicks
  quality 5 at slot 3 : 20 clicks
  quality 5 at slot 4 : 15 clicks
  quality 5 at slot 5 : 10 clicks
  quality 5 at slot 6 : 5 clicks

the worst item at the top against the best at the bottom
  quality 3 at slot 1 : 30
  quality 9 at slot 6 : 9
  position outweighs a three-fold quality gap

control - every slot seen equally
  order : bfdcea  (100%)
  with position removed, clicks recover the quality order exactly

The ranker reads a real signal. After the first day that signal contains the
ranker's own previous output, and nothing in a click count says which part is
which.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
