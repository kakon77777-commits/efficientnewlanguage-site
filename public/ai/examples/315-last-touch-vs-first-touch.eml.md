<!-- canonical: efficientnewlanguage.org/ai/examples/315-last-touch-vs-first-touch | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 315 — Last touch vs first touch — four models, different winners, identical totals

`last_touch_vs_first_touch.eml` scores four channels under four attribution models over eight conversions, computes each model's ranking, and reports how far channels move.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Four attribution
# models, four different winners, and every one of them reconciles perfectly.
#
# Credit for a conversion has to be assigned to something, and the journey that
# produced it touched several things. First-touch, last-touch, linear and
# position-based are all defensible, all in common use, and they disagree about
# which channel is worth the most - which is the number the budget is set from.
#
# The model is a MODELLING DECISION and it arrives in the codebase as a
# default. Nobody is asked to approve it; somebody picks the one their previous
# job used, or the one the vendor's dashboard defaults to, and from then on it
# is "the numbers".
#
# What hides it is conservation. Every model distributes exactly the same total
# credit, so the only check anyone runs - does attributed credit equal total
# conversions - passes identically for all four. The disagreement lives
# entirely in the split, and nothing sums the split.
#
# The measurement scores every channel under every model, computes each model's
# ranking, and reports how many channels change position - plus the totals,
# which do not move.

60 => UNITS

def credit(journey, model):
    # journey is a list of channel names, in order. Returns a list of
    # [channel, units] pairs summing to UNITS.
    len(journey) => n
    [] => out
    if n == 0:
        return out
    if model == "first":
        return [[journey[0], UNITS]]
    if model == "last":
        return [[journey[n - 1], UNITS]]
    if model == "linear":
        int(UNITS / n) => each
        0 => i
        while i < n:
            out + [[journey[i], each]] => out
            i + 1 => i
        return out
    # position-based: 40/40 to the ends, 20 shared by the middle
    if n == 1:
        return [[journey[0], UNITS]]
    if n == 2:
        int(UNITS / 2) => half
        return [[journey[0], half], [journey[1], half]]
    int(UNITS * 4 / 10) => end
    UNITS - end - end => middle_total
    int(middle_total / (n - 2)) => each_mid
    out + [[journey[0], end]] => out
    1 => i
    while i < n - 1:
        out + [[journey[i], each_mid]] => out
        i + 1 => i
    out + [[journey[n - 1], end]] => out
    return out

def score(model):
    {} => totals
    for ch in CHANNELS:
        0 => totals[ch]
    for j in JOURNEYS:
        for pair in credit(j, model):
            totals[pair[0]] + pair[1] => totals[pair[0]]
    return totals

def ranking(totals):
    # Channels ordered by credit, highest first; ties broken by channel order
    # in CHANNELS so the ranking is a function of the numbers alone.
    [] => order
    [] => used
    0 => k
    while k < len(CHANNELS):
        "" => best
        0 => best_v
        0 => idx
        while idx < len(CHANNELS):
            CHANNELS[idx] => ch
            if not (ch in used):
                if len(best) == 0:
                    ch => best
                    totals[ch] => best_v
                elif totals[ch] > best_v:
                    ch => best
                    totals[ch] => best_v
            idx + 1 => idx
        order + [best] => order
        used + [best] => used
        k + 1 => k
    return order

["search", "social", "email", "affiliate"] => CHANNELS
["first", "last", "linear", "position"] => MODELS

# Ordered touchpoints per conversion. The shapes are ordinary: discovery on
# social, a nudge by email, the final click from search.
[["social", "email", "search"],
 ["social", "search"],
 ["affiliate", "email", "search"],
 ["social", "email", "email", "search"],
 ["search"],
 ["social", "affiliate", "email", "search"],
 ["email", "search"],
 ["social", "email", "affiliate"]] => JOURNEYS

("conversions: " + str(len(JOURNEYS)) + ", credit units each: " + str(UNITS))^0
""^0
"model     search  social  email  affiliate  total  winner"^0
"--------  ------  ------  -----  ---------  -----  --------"^0

{} => tables
{} => ranks
for m in MODELS:
    score(m) => t
    t => tables[m]
    ranking(t) => r
    r => ranks[m]
    0 => tot
    for ch in CHANNELS:
        tot + t[ch] => tot
    ((m + "        ")[0:10] + (str(t["search"]) + "        ")[0:8] + (str(t["social"]) + "        ")[0:8] + (str(t["email"]) + "       ")[0:7] + (str(t["affiliate"]) + "           ")[0:11] + (str(tot) + "       ")[0:7] + r[0])^0

""^0
("every model must distribute " + str(len(JOURNEYS) * UNITS) + " units in total")^0

""^0
"rankings"^0
for m in MODELS:
    "" => line
    for ch in ranks[m]:
        line + ch + " > " => line
    ((m + "        ")[0:10] + line[0:len(line) - 3])^0

""^0
"how much the ranking moves"^0
0 => distinct_winners
[] => winners
for m in MODELS:
    ranks[m][0] => w
    if not (w in winners):
        winners + [w] => winners
        distinct_winners + 1 => distinct_winners
("distinct winners across the four models: " + str(distinct_winners))^0

0 => max_move
for ch in CHANNELS:
    0 => best_pos
    0 => worst_pos
    1 => first
    for m in MODELS:
        0 => pos
        0 => i
        while i < len(ranks[m]):
            if ranks[m][i] == ch:
                i => pos
            i + 1 => i
        if first == 1:
            pos => best_pos
            pos => worst_pos
            0 => first
        else:
            if pos < best_pos:
                pos => best_pos
            if pos > worst_pos:
                pos => worst_pos
    worst_pos - best_pos => move
    if move > max_move:
        move => max_move
    ((ch + "           ")[0:11] + " best rank " + str(best_pos + 1) + ", worst rank " + str(worst_pos + 1) + ", moves " + str(move))^0

""^0
"the check that passes for all four"^0
0 => reconciling
for m in MODELS:
    0 => tot
    for ch in CHANNELS:
        tot + tables[m][ch] => tot
    if tot == len(JOURNEYS) * UNITS:
        reconciling + 1 => reconciling
("models whose attributed credit reconciles with the conversion total: " + str(reconciling) + "/" + str(len(MODELS)))^0

""^0
"the spread on one channel"^0
for ch in CHANNELS:
    tables["first"][ch] => a
    tables["last"][ch] => b
    tables["linear"][ch] => c
    tables["position"][ch] => d
    min([a, b, c, d]) => lo
    max([a, b, c, d]) => hi
    # A ratio needs a non-zero denominator. The first version printed
    # `hi / max(lo, 1)` and reported "a factor of 300" for a channel that goes
    # from ZERO to 300 - which is not a factor of anything, it is the
    # difference between existing and not existing. Say which one it is.
    if lo == 0:
        (" nothing to " + str(hi) + " units - one model gives it no credit at all") => shape
    else:
        (" between " + str(lo) + " and " + str(hi) + " units, a factor of " + str(int(hi * 10 / lo) / 10)) => shape
    ((ch + "           ")[0:11] + shape)^0

""^0
0 => checked
0 => passed

# Every model must conserve the total. This is the reconciliation everybody
# runs, and it cannot separate them.
checked + 1 => checked
if reconciling == len(MODELS):
    passed + 1 => passed

# The models must disagree about the winner.
checked + 1 => checked
if distinct_winners > 1:
    passed + 1 => passed

# Some channel must change rank by more than one position - the disagreement
# is not a tie being broken differently.
checked + 1 => checked
if max_move >= 2:
    passed + 1 => passed

# Every model must give every channel a non-negative share, so none of them is
# simply broken.
checked + 1 => checked
0 => negatives
for m in MODELS:
    for ch in CHANNELS:
        if tables[m][ch] < 0:
            negatives + 1 => negatives
if negatives == 0:
    passed + 1 => passed

# At least one channel's credit must vary by a factor of two or more across
# the models - the size of the decision, measured.
checked + 1 => checked
0 => big_spread
for ch in CHANNELS:
    min([tables["first"][ch], tables["last"][ch], tables["linear"][ch], tables["position"][ch]]) => lo
    max([tables["first"][ch], tables["last"][ch], tables["linear"][ch], tables["position"][ch]]) => hi
    if hi >= lo * 2:
        big_spread + 1 => big_spread
if big_spread > 0:
    passed + 1 => passed

# And the journeys must be ordinary - more than one touch on most of them, or
# the models would trivially agree.
checked + 1 => checked
0 => multi
for j in JOURNEYS:
    if len(j) > 1:
        multi + 1 => multi
if multi * 2 > len(JOURNEYS):
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Four models, different winners, identical totals." => verdict
else:
    "FAILED - the models did not behave as the checks describe." => verdict
verdict^0

""^0
"Attribution is a modelling decision that arrives as a default. Every model"^0
"conserves the total, so the reconciliation that exists cannot tell them"^0
"apart, and the number that changes - which channel is worth the most - is"^0
"the one the budget is set from. The question 'which model' is never asked"^0
"because the output does not look like an answer to a question."^0
```

## Python (deterministic transpilation)

```python
UNITS = 60

def credit(journey, model):
    n = len(journey)
    out = []
    if n == 0:
        return out
    if model == "first":
        return [[journey[0], UNITS]]
    if model == "last":
        return [[journey[n - 1], UNITS]]
    if model == "linear":
        each = int(UNITS / n)
        i = 0
        while i < n:
            out = out + [[journey[i], each]]
            i = i + 1
        return out
    if n == 1:
        return [[journey[0], UNITS]]
    if n == 2:
        half = int(UNITS / 2)
        return [[journey[0], half], [journey[1], half]]
    end = int(UNITS * 4 / 10)
    middle_total = UNITS - end - end
    each_mid = int(middle_total / (n - 2))
    out = out + [[journey[0], end]]
    i = 1
    while i < n - 1:
        out = out + [[journey[i], each_mid]]
        i = i + 1
    out = out + [[journey[n - 1], end]]
    return out

def score(model):
    totals = {}
    for ch in CHANNELS:
        totals[ch] = 0
    for j in JOURNEYS:
        for pair in credit(j, model):
            totals[pair[0]] = totals[pair[0]] + pair[1]
    return totals

def ranking(totals):
    order = []
    used = []
    k = 0
    while k < len(CHANNELS):
        best = ""
        best_v = 0
        idx = 0
        while idx < len(CHANNELS):
            ch = CHANNELS[idx]
            if not ch in used:
                if len(best) == 0:
                    best = ch
                    best_v = totals[ch]
                elif totals[ch] > best_v:
                    best = ch
                    best_v = totals[ch]
            idx = idx + 1
        order = order + [best]
        used = used + [best]
        k = k + 1
    return order

CHANNELS = ["search", "social", "email", "affiliate"]
MODELS = ["first", "last", "linear", "position"]
JOURNEYS = [["social", "email", "search"], ["social", "search"], ["affiliate", "email", "search"], ["social", "email", "email", "search"], ["search"], ["social", "affiliate", "email", "search"], ["email", "search"], ["social", "email", "affiliate"]]
print("conversions: " + str(len(JOURNEYS)) + ", credit units each: " + str(UNITS))
print("")
print("model     search  social  email  affiliate  total  winner")
print("--------  ------  ------  -----  ---------  -----  --------")
tables = {}
ranks = {}
for m in MODELS:
    t = score(m)
    tables[m] = t
    r = ranking(t)
    ranks[m] = r
    tot = 0
    for ch in CHANNELS:
        tot = tot + t[ch]
    print((m + "        ")[0:10] + (str(t["search"]) + "        ")[0:8] + (str(t["social"]) + "        ")[0:8] + (str(t["email"]) + "       ")[0:7] + (str(t["affiliate"]) + "           ")[0:11] + (str(tot) + "       ")[0:7] + r[0])
print("")
print("every model must distribute " + str(len(JOURNEYS) * UNITS) + " units in total")
print("")
print("rankings")
for m in MODELS:
    line = ""
    for ch in ranks[m]:
        line = line + ch + " > "
    print((m + "        ")[0:10] + line[0:len(line) - 3])
print("")
print("how much the ranking moves")
distinct_winners = 0
winners = []
for m in MODELS:
    w = ranks[m][0]
    if not w in winners:
        winners = winners + [w]
        distinct_winners = distinct_winners + 1
print("distinct winners across the four models: " + str(distinct_winners))
max_move = 0
for ch in CHANNELS:
    best_pos = 0
    worst_pos = 0
    first = 1
    for m in MODELS:
        pos = 0
        i = 0
        while i < len(ranks[m]):
            if ranks[m][i] == ch:
                pos = i
            i = i + 1
        if first == 1:
            best_pos = pos
            worst_pos = pos
            first = 0
        else:
            if pos < best_pos:
                best_pos = pos
            if pos > worst_pos:
                worst_pos = pos
    move = worst_pos - best_pos
    if move > max_move:
        max_move = move
    print((ch + "           ")[0:11] + " best rank " + str(best_pos + 1) + ", worst rank " + str(worst_pos + 1) + ", moves " + str(move))
print("")
print("the check that passes for all four")
reconciling = 0
for m in MODELS:
    tot = 0
    for ch in CHANNELS:
        tot = tot + tables[m][ch]
    if tot == len(JOURNEYS) * UNITS:
        reconciling = reconciling + 1
print("models whose attributed credit reconciles with the conversion total: " + str(reconciling) + "/" + str(len(MODELS)))
print("")
print("the spread on one channel")
for ch in CHANNELS:
    a = tables["first"][ch]
    b = tables["last"][ch]
    c = tables["linear"][ch]
    d = tables["position"][ch]
    lo = min([a, b, c, d])
    hi = max([a, b, c, d])
    if lo == 0:
        shape = " nothing to " + str(hi) + " units - one model gives it no credit at all"
    else:
        shape = " between " + str(lo) + " and " + str(hi) + " units, a factor of " + str(int(hi * 10 / lo) / 10)
    print((ch + "           ")[0:11] + shape)
print("")
checked = 0
passed = 0
checked = checked + 1
if reconciling == len(MODELS):
    passed = passed + 1
checked = checked + 1
if distinct_winners > 1:
    passed = passed + 1
checked = checked + 1
if max_move >= 2:
    passed = passed + 1
checked = checked + 1
negatives = 0
for m in MODELS:
    for ch in CHANNELS:
        if tables[m][ch] < 0:
            negatives = negatives + 1
if negatives == 0:
    passed = passed + 1
checked = checked + 1
big_spread = 0
for ch in CHANNELS:
    lo = min([tables["first"][ch], tables["last"][ch], tables["linear"][ch], tables["position"][ch]])
    hi = max([tables["first"][ch], tables["last"][ch], tables["linear"][ch], tables["position"][ch]])
    if hi >= lo * 2:
        big_spread = big_spread + 1
if big_spread > 0:
    passed = passed + 1
checked = checked + 1
multi = 0
for j in JOURNEYS:
    if len(j) > 1:
        multi = multi + 1
if multi * 2 > len(JOURNEYS):
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Four models, different winners, identical totals."
else:
    verdict = "FAILED - the models did not behave as the checks describe."
print(verdict)
print("")
print("Attribution is a modelling decision that arrives as a default. Every model")
print("conserves the total, so the reconciliation that exists cannot tell them")
print("apart, and the number that changes - which channel is worth the most - is")
print("the one the budget is set from. The question 'which model' is never asked")
print("because the output does not look like an answer to a question.")
```

## stdout (executed)

```text
conversions: 8, credit units each: 60

model     search  social  email  affiliate  total  winner
--------  ------  ------  -----  ---------  -----  --------
first     60      300     60     60         480    social
last      420     0       0      60         480    search
linear    190     100     135    55         480    search
position  216     126     84     54         480    search

every model must distribute 480 units in total

rankings
first     social > search > email > affiliate
last      search > affiliate > social > email
linear    search > email > social > affiliate
position  search > social > email > affiliate

how much the ranking moves
distinct winners across the four models: 2
search      best rank 1, worst rank 2, moves 1
social      best rank 1, worst rank 3, moves 2
email       best rank 2, worst rank 4, moves 2
affiliate   best rank 2, worst rank 4, moves 2

the check that passes for all four
models whose attributed credit reconciles with the conversion total: 4/4

the spread on one channel
search      between 60 and 420 units, a factor of 7.0
social      nothing to 300 units - one model gives it no credit at all
email       nothing to 135 units - one model gives it no credit at all
affiliate   between 54 and 60 units, a factor of 1.1

checks passed: 6/6
Four models, different winners, identical totals.

Attribution is a modelling decision that arrives as a default. Every model
conserves the total, so the reconciliation that exists cannot tell them
apart, and the number that changes - which channel is worth the most - is
the one the budget is set from. The question 'which model' is never asked
because the output does not look like an answer to a question.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
