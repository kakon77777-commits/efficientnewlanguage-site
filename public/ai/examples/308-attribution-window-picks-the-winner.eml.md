<!-- canonical: efficientnewlanguage.org/ai/examples/308-attribution-window-picks-the-winner | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 308 — Attribution window picks the winner — same model, same data, decided by a number in a config file

`attribution_window_picks_the_winner.eml` holds last-touch attribution fixed and sweeps only the lookback window, reporting per-channel credit, the winner, and how many conversions end up attributed to nobody.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The attribution
# model is fixed, and the lookback window - a number in a config file - decides
# which channel wins.
#
# Last-touch attribution over a 7-day window and last-touch attribution over a
# 30-day window are the same model. Nobody records a decision when the window
# changes, because the window is an implementation detail: how far back the
# join goes, how much history the warehouse keeps, what the vendor's default
# happens to be.
#
# It is not an implementation detail. Shortening the window drops the EARLY
# touches, and early touches belong to the channels that create demand rather
# than harvest it. So the window has a direction: every reduction moves credit
# toward whatever ran last, and the channels that lose are the ones whose whole
# job is to act early.
#
# The measurement holds the model fixed, sweeps the window, and reports the
# per-channel credit and the ranking - plus the structural property that makes
# this a one-way ratchet rather than noise.

def last_within(journey, window, day):
    # journey is [[channel, day], ...] in order. Returns the last touch not
    # older than `window` days before the conversion, or "" if none qualifies.
    "" => winner
    for t in journey:
        if day - t[1] <= window:
            t[0] => winner
    return winner

def score(window):
    {} => totals
    for ch in CHANNELS:
        0 => totals[ch]
    0 => dropped
    for c in CONVERSIONS:
        last_within(c[0], window, c[1]) => who
        if len(who) == 0:
            dropped + 1 => dropped
        else:
            totals[who] + 1 => totals[who]
    return [totals, dropped]

def winner_of(totals):
    "" => best
    0 => best_v
    for ch in CHANNELS:
        if len(best) == 0:
            ch => best
            totals[ch] => best_v
        elif totals[ch] > best_v:
            ch => best
            totals[ch] => best_v
    return best

["brand", "social", "email", "search"] => CHANNELS
[1, 3, 7, 14, 30] => WINDOWS

# [[channel, day], ...], conversion day. Brand acts at discovery, social early,
# email mid-funnel, search on or near the day. Four of the eight journeys END
# at email, eight to twelve days out - the ordinary shape of a considered
# purchase, and exactly the shape a short window erases.
[[[["brand", 0], ["social", 4], ["email", 8]], 20],
 [[["brand", 1], ["social", 5], ["email", 9]], 20],
 [[["social", 2], ["email", 10]], 20],
 [[["brand", 0], ["email", 12]], 20],
 [[["email", 18], ["search", 20]], 20],
 [[["brand", 2], ["social", 6], ["search", 20]], 20],
 [[["social", 5], ["email", 13], ["search", 19]], 20],
 [[["brand", 0]], 20]] => CONVERSIONS

("conversions: " + str(len(CONVERSIONS)) + ", model: last-touch (fixed)")^0
""^0
"window  brand  social  email  search  attributed  dropped  winner"^0
"------  -----  ------  -----  ------  ----------  -------  ------"^0

{} => runs
for w in WINDOWS:
    score(w) => r
    r[0] => t
    0 => attributed
    for ch in CHANNELS:
        attributed + t[ch] => attributed
    winner_of(t) => won
    [t, r[1], won, attributed] => runs[str(w)]
    ((str(w) + "       ")[0:8] + (str(t["brand"]) + "       ")[0:7] + (str(t["social"]) + "        ")[0:8] + (str(t["email"]) + "       ")[0:7] + (str(t["search"]) + "        ")[0:8] + (str(attributed) + "            ")[0:12] + (str(r[1]) + "         ")[0:9] + won)^0

""^0
"distinct winners across the windows"^0
[] => winners
for w in WINDOWS:
    runs[str(w)][2] => x
    if not (x in winners):
        winners + [x] => winners
"" => line
for x in winners:
    line + x + " " => line
("winners seen: " + str(len(winners)) + "  (" + line + ")")^0

""^0
"the direction the window pushes credit"^0

# Structural, not incidental: shortening the window can only remove EARLY
# touches, so a channel's credit under a shorter window is never higher than
# under a longer one unless it acts late. Measure the direction per channel.
for ch in CHANNELS:
    runs["1"][0][ch] => short_c
    runs["30"][0][ch] => long_c
    if short_c > long_c:
        "gains from a SHORT window" => dir
    elif short_c < long_c:
        "loses from a short window" => dir
    else:
        "unaffected" => dir
    ((ch + "        ")[0:8] + " 1-day: " + (str(short_c) + "   ")[0:4] + " 30-day: " + (str(long_c) + "   ")[0:4] + " -> " + dir)^0

""^0
"when each channel typically acts"^0
for ch in CHANNELS:
    0 => total_age
    0 => n
    for c in CONVERSIONS:
        for t in c[0]:
            if t[0] == ch:
                total_age + c[1] - t[1] => total_age
                n + 1 => n
    if n > 0:
        int(total_age * 10 / n) / 10 => avg_age
    else:
        0 => avg_age
    ((ch + "        ")[0:8] + " appears " + str(n) + " times, on average " + str(avg_age) + " days before the conversion")^0

""^0
"conversions nobody gets credit for"^0
for w in WINDOWS:
    runs[str(w)] => r
    int(r[1] * 1000 / len(CONVERSIONS)) / 10 => pct
    ("window " + (str(w) + "   ")[0:4] + " unattributed: " + str(r[1]) + " of " + str(len(CONVERSIONS)) + " (" + str(pct) + "%)")^0

""^0
0 => checked
0 => passed

# The window must change the winner.
checked + 1 => checked
if len(winners) > 1:
    passed + 1 => passed

# Every window must attribute at most the conversion count - no window
# invents credit.
checked + 1 => checked
0 => over
for w in WINDOWS:
    if runs[str(w)][3] + runs[str(w)][1] > len(CONVERSIONS):
        over + 1 => over
if over == 0:
    passed + 1 => passed

# Attributed plus dropped must equal the conversion count at every window -
# nothing goes missing without being counted as missing.
checked + 1 => checked
0 => unbalanced
for w in WINDOWS:
    if not (runs[str(w)][3] + runs[str(w)][1] == len(CONVERSIONS)):
        unbalanced + 1 => unbalanced
if unbalanced == 0:
    passed + 1 => passed

# The parameter must have a direction, and the direction lives in the SHARE
# rather than in the count.
#
# The first version of this check asserted that the late channel GAINS from a
# short window in absolute terms, and measured 4 against 5 - it loses. That was
# wrong for a reason worth keeping: shortening a window drops touches from
# every channel, late ones included, so absolute credit is non-increasing for
# everybody. What a short window redistributes is the share of whatever is
# still attributable, and that is the number a dashboard shows.
checked + 1 => checked
runs["1"][3] => short_total
runs["30"][3] => long_total
0 => share_ok
if short_total > 0:
    if long_total > 0:
        if runs["1"][0]["search"] * long_total > runs["30"][0]["search"] * short_total:
            if runs["1"][0]["brand"] * long_total < runs["30"][0]["brand"] * short_total:
                1 => share_ok
if share_ok == 1:
    passed + 1 => passed

# Shortening the window must never REDUCE the unattributed count - dropping
# touches can only make conversions harder to attribute, never easier.
checked + 1 => checked
0 => backwards
0 => i
while i + 1 < len(WINDOWS):
    if runs[str(WINDOWS[i])][1] < runs[str(WINDOWS[i + 1])][1]:
        backwards + 1 => backwards
    i + 1 => i
if backwards == 0:
    passed + 1 => passed

# The early channels must genuinely act early - the direction comes from the
# data's timing, not from the channel names.
checked + 1 => checked
0 => brand_age
0 => brand_n
0 => search_age
0 => search_n
for c in CONVERSIONS:
    for t in c[0]:
        if t[0] == "brand":
            brand_age + c[1] - t[1] => brand_age
            brand_n + 1 => brand_n
        if t[0] == "search":
            search_age + c[1] - t[1] => search_age
            search_n + 1 => search_n
if brand_age * search_n > search_age * brand_n:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Same model, same data, different winner - decided by a number in a config file." => verdict
else:
    "FAILED - the windows did not behave as the checks describe." => verdict
verdict^0

""^0
"A lookback window is chosen for reasons that have nothing to do with"^0
"causality: how much history the warehouse keeps, what the vendor defaults"^0
"to, what the query can afford. It then decides which channel gets the"^0
"credit, in one direction, forever - because the only thing shortening a"^0
"window can do is delete the evidence that something happened early."^0
```

## Python (deterministic transpilation)

```python
def last_within(journey, window, day):
    winner = ""
    for t in journey:
        if day - t[1] <= window:
            winner = t[0]
    return winner

def score(window):
    totals = {}
    for ch in CHANNELS:
        totals[ch] = 0
    dropped = 0
    for c in CONVERSIONS:
        who = last_within(c[0], window, c[1])
        if len(who) == 0:
            dropped = dropped + 1
        else:
            totals[who] = totals[who] + 1
    return [totals, dropped]

def winner_of(totals):
    best = ""
    best_v = 0
    for ch in CHANNELS:
        if len(best) == 0:
            best = ch
            best_v = totals[ch]
        elif totals[ch] > best_v:
            best = ch
            best_v = totals[ch]
    return best

CHANNELS = ["brand", "social", "email", "search"]
WINDOWS = [1, 3, 7, 14, 30]
CONVERSIONS = [[[["brand", 0], ["social", 4], ["email", 8]], 20], [[["brand", 1], ["social", 5], ["email", 9]], 20], [[["social", 2], ["email", 10]], 20], [[["brand", 0], ["email", 12]], 20], [[["email", 18], ["search", 20]], 20], [[["brand", 2], ["social", 6], ["search", 20]], 20], [[["social", 5], ["email", 13], ["search", 19]], 20], [[["brand", 0]], 20]]
print("conversions: " + str(len(CONVERSIONS)) + ", model: last-touch (fixed)")
print("")
print("window  brand  social  email  search  attributed  dropped  winner")
print("------  -----  ------  -----  ------  ----------  -------  ------")
runs = {}
for w in WINDOWS:
    r = score(w)
    t = r[0]
    attributed = 0
    for ch in CHANNELS:
        attributed = attributed + t[ch]
    won = winner_of(t)
    runs[str(w)] = [t, r[1], won, attributed]
    print((str(w) + "       ")[0:8] + (str(t["brand"]) + "       ")[0:7] + (str(t["social"]) + "        ")[0:8] + (str(t["email"]) + "       ")[0:7] + (str(t["search"]) + "        ")[0:8] + (str(attributed) + "            ")[0:12] + (str(r[1]) + "         ")[0:9] + won)
print("")
print("distinct winners across the windows")
winners = []
for w in WINDOWS:
    x = runs[str(w)][2]
    if not x in winners:
        winners = winners + [x]
line = ""
for x in winners:
    line = line + x + " "
print("winners seen: " + str(len(winners)) + "  (" + line + ")")
print("")
print("the direction the window pushes credit")
for ch in CHANNELS:
    short_c = runs["1"][0][ch]
    long_c = runs["30"][0][ch]
    if short_c > long_c:
        dir = "gains from a SHORT window"
    elif short_c < long_c:
        dir = "loses from a short window"
    else:
        dir = "unaffected"
    print((ch + "        ")[0:8] + " 1-day: " + (str(short_c) + "   ")[0:4] + " 30-day: " + (str(long_c) + "   ")[0:4] + " -> " + dir)
print("")
print("when each channel typically acts")
for ch in CHANNELS:
    total_age = 0
    n = 0
    for c in CONVERSIONS:
        for t in c[0]:
            if t[0] == ch:
                total_age = total_age + c[1] - t[1]
                n = n + 1
    if n > 0:
        avg_age = int(total_age * 10 / n) / 10
    else:
        avg_age = 0
    print((ch + "        ")[0:8] + " appears " + str(n) + " times, on average " + str(avg_age) + " days before the conversion")
print("")
print("conversions nobody gets credit for")
for w in WINDOWS:
    r = runs[str(w)]
    pct = int(r[1] * 1000 / len(CONVERSIONS)) / 10
    print("window " + (str(w) + "   ")[0:4] + " unattributed: " + str(r[1]) + " of " + str(len(CONVERSIONS)) + " (" + str(pct) + "%)")
print("")
checked = 0
passed = 0
checked = checked + 1
if len(winners) > 1:
    passed = passed + 1
checked = checked + 1
over = 0
for w in WINDOWS:
    if runs[str(w)][3] + runs[str(w)][1] > len(CONVERSIONS):
        over = over + 1
if over == 0:
    passed = passed + 1
checked = checked + 1
unbalanced = 0
for w in WINDOWS:
    if not runs[str(w)][3] + runs[str(w)][1] == len(CONVERSIONS):
        unbalanced = unbalanced + 1
if unbalanced == 0:
    passed = passed + 1
checked = checked + 1
short_total = runs["1"][3]
long_total = runs["30"][3]
share_ok = 0
if short_total > 0:
    if long_total > 0:
        if runs["1"][0]["search"] * long_total > runs["30"][0]["search"] * short_total:
            if runs["1"][0]["brand"] * long_total < runs["30"][0]["brand"] * short_total:
                share_ok = 1
if share_ok == 1:
    passed = passed + 1
checked = checked + 1
backwards = 0
i = 0
while i + 1 < len(WINDOWS):
    if runs[str(WINDOWS[i])][1] < runs[str(WINDOWS[i + 1])][1]:
        backwards = backwards + 1
    i = i + 1
if backwards == 0:
    passed = passed + 1
checked = checked + 1
brand_age = 0
brand_n = 0
search_age = 0
search_n = 0
for c in CONVERSIONS:
    for t in c[0]:
        if t[0] == "brand":
            brand_age = brand_age + c[1] - t[1]
            brand_n = brand_n + 1
        if t[0] == "search":
            search_age = search_age + c[1] - t[1]
            search_n = search_n + 1
if brand_age * search_n > search_age * brand_n:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Same model, same data, different winner - decided by a number in a config file."
else:
    verdict = "FAILED - the windows did not behave as the checks describe."
print(verdict)
print("")
print("A lookback window is chosen for reasons that have nothing to do with")
print("causality: how much history the warehouse keeps, what the vendor defaults")
print("to, what the query can afford. It then decides which channel gets the")
print("credit, in one direction, forever - because the only thing shortening a")
print("window can do is delete the evidence that something happened early.")
```

## stdout (executed)

```text
conversions: 8, model: last-touch (fixed)

window  brand  social  email  search  attributed  dropped  winner
------  -----  ------  -----  ------  ----------  -------  ------
1       0      0       0      3       3           5        search
3       0      0       0      3       3           5        search
7       0      0       0      3       3           5        search
14      0      0       4      3       7           1        email
30      1      0       4      3       8           0        email

distinct winners across the windows
winners seen: 2  (search email )

the direction the window pushes credit
brand    1-day: 0    30-day: 1    -> loses from a short window
social   1-day: 0    30-day: 0    -> unaffected
email    1-day: 0    30-day: 4    -> loses from a short window
search   1-day: 3    30-day: 3    -> unaffected

when each channel typically acts
brand    appears 5 times, on average 19.4 days before the conversion
social   appears 5 times, on average 15.6 days before the conversion
email    appears 6 times, on average 8.3 days before the conversion
search   appears 3 times, on average 0.3 days before the conversion

conversions nobody gets credit for
window 1    unattributed: 5 of 8 (62.5%)
window 3    unattributed: 5 of 8 (62.5%)
window 7    unattributed: 5 of 8 (62.5%)
window 14   unattributed: 1 of 8 (12.5%)
window 30   unattributed: 0 of 8 (0.0%)

checks passed: 6/6
Same model, same data, different winner - decided by a number in a config file.

A lookback window is chosen for reasons that have nothing to do with
causality: how much history the warehouse keeps, what the vendor defaults
to, what the query can afford. It then decides which channel gets the
credit, in one direction, forever - because the only thing shortening a
window can do is delete the evidence that something happened early.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
