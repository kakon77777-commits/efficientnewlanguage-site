<!-- canonical: efficientnewlanguage.org/ai/examples/454-the-cache-decided-what-was-popular | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 454 — The cache decided what was popular

`the_cache_decided_what_was_popular.eml` - The cache holds the most requested items, and being held is part of why they are requested. Which items it settles on is simulated rather than assumed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The cache holds
# the most requested items, and being held is part of why they are requested.
# Which items it settles on is simulated rather than assumed.
#
# Keeping the popular items is the right rule and the request counts it reads
# are real: those requests happened, they were served, and the count is not an
# estimate. Ranking by observed demand is what every cache does and it is
# correct as far as it goes.
#
# A cached item answers quickly, and a quick answer gets used more - retried
# less, clicked through more, polled harder. So the count the cache ranks on is
# a count of demand plus a term the cache itself contributed. The ranking is
# over a quantity the ranking is an input to.
#
# The fixed point is computed by running it.

# true demand per interval, independent of what is cached
[100, 90, 80, 70, 60, 50, 40, 30] => demand
["a", "b", "c", "d", "e", "f", "g", "h"] => names
len(demand) => n
4 => slots
2 => boost

# the cache was warmed in the wrong order by a bulk import
[0, 0, 0, 0, 1, 1, 1, 1] => cached

def observed(i, c):
    if c[i] == 1:
        return demand[i] * boost
    return demand[i]

def top_slots(c):
    [] => chosen
    0 => picked
    while picked < slots:
        0 - 1 => best
        0 => best_i
        for i in [0:n - 1]:
            if not (i in chosen):
                if observed(i, c) > best:
                    observed(i, c) => best
                    i => best_i
        chosen + [best_i] => chosen
        picked + 1 => picked
    [] => flags
    for i in [0:n - 1]:
        0 => f
        if i in chosen:
            1 => f
        flags + [f] => flags
    return flags

def show(c):
    "" => s
    for i in [0:n - 1]:
        if c[i] == 1:
            s + names[i] + " " => s
    return s

"items : " + str(n) + ", cache slots : " + str(slots) ^0
"a cached item is requested " + str(boost) + "x as often as the same item uncached" ^0
"" ^0
"item   true demand" ^0
for i in [0:n - 1]:
    "  " + names[i] + "      " + str(demand[i]) ^0
"" ^0

"the true top " + str(slots) + " by demand alone : " ^0
[0, 0, 0, 0, 0, 0, 0, 0] => nobody
top_slots(nobody) => truth
"  " + show(truth) ^0
"" ^0

# ---- what the loop settles on ----

cached => c
"round   cache contents" ^0
"  0     " + show(c) ^0
0 => r
0 => settled
while r < 6:
    top_slots(c) => nxt
    r + 1 => r
    "  " + str(r) + "     " + show(nxt) ^0
    0 => same
    for i in [0:n - 1]:
        if nxt[i] == c[i]:
            same + 1 => same
    if same == n:
        if settled == 0:
            r => settled
    nxt => c
if settled > 0:
    "  settled after round " + str(settled) + " and does not move again" ^0
"" ^0

# ---- how wrong the fixed point is ----

0 => agree
for i in [0:n - 1]:
    if c[i] == 1:
        if truth[i] == 1:
            agree + 1 => agree
"the cache it settles on against the true top " + str(slots) ^0
"  items in both      : " + str(agree) + " of " + str(slots) ^0
"  held but not top   : " ^0
for i in [0:n - 1]:
    if c[i] == 1:
        if truth[i] == 0:
            "    " + names[i] + ", true demand " + str(demand[i]) ^0
"  top but locked out : " ^0
for i in [0:n - 1]:
    if truth[i] == 1:
        if c[i] == 0:
            "    " + names[i] + ", true demand " + str(demand[i]) ^0
"" ^0

# ---- why the locked-out ones cannot get back in ----

for i in [0:n - 1]:
    if truth[i] == 1:
        if c[i] == 0:
            for j in [0:n - 1]:
                if c[j] == 1:
                    if truth[j] == 0:
                        if observed(i, c) < observed(j, c):
                            "  " + names[i] + " is observed at " + str(observed(i, c)) + " against " + names[j] + " at " + str(observed(j, c)) ^0
"  the same pairs ranked on true demand alone" ^0
for i in [0:n - 1]:
    if truth[i] == 1:
        if c[i] == 0:
            for j in [0:n - 1]:
                if c[j] == 1:
                    if truth[j] == 0:
                        if demand[i] > demand[j]:
                            "    " + names[i] + " " + str(demand[i]) + " beats " + names[j] + " " + str(demand[j]) ^0
"  every pair inverts once the boost is removed, so the boost is not a" ^0
"  tiebreaker between close rivals - it is the whole of the ordering here" ^0
"" ^0

# ---- what one admission changes ----
#
# Nothing about the ranking rule needs to change. One slot given to the best
# uncached item for one round is enough for the true demand to speak.

c => e
0 => rounds_to_truth
0 => k
while k < 4:
    0 => best
    0 => best_i
    for i in [0:n - 1]:
        if e[i] == 0:
            if demand[i] > best:
                demand[i] => best
                i => best_i
    [] => probe
    for i in [0:n - 1]:
        if i == best_i:
            probe + [1] => probe
        else:
            probe + [e[i]] => probe
    top_slots(probe) => e
    k + 1 => k
    0 => match
    for i in [0:n - 1]:
        if e[i] == truth[i]:
            match + 1 => match
    if match == n:
        if rounds_to_truth == 0:
            k => rounds_to_truth
"admitting the best uncached item for one round, repeatedly" ^0
"  cache after " + str(k) + " such rounds : " + show(e) ^0
if rounds_to_truth > 0:
    "  reaches the true top " + str(slots) + " after " + str(rounds_to_truth) + " admissions" ^0
else:
    "  does not reach the true top " + str(slots) + " within " + str(k) + " admissions" ^0
"" ^0

# ---- the control: a cache that does not change demand ----
#
# Where being cached does not make an item more requested, the observed counts
# are the true ones and the rule lands on the right items immediately.

0 => picked2
[] => chosen2
while picked2 < slots:
    0 => best2
    0 => bi2
    for i in [0:n - 1]:
        if not (i in chosen2):
            if demand[i] > best2:
                demand[i] => best2
                i => bi2
    chosen2 + [bi2] => chosen2
    picked2 + 1 => picked2
0 => flat_agree
for i in [0:n - 1]:
    if i in chosen2:
        if truth[i] == 1:
            flat_agree + 1 => flat_agree
"control - the same rule where caching does not change demand" ^0
"  items in both : " + str(flat_agree) + " of " + str(slots) ^0
if flat_agree == slots:
    "  the ranking lands on the true top immediately, from any starting cache" ^0
"" ^0

"A ranking whose input it partly produces has fixed points, and this one has" ^0
"a wrong one two rounds away from any start. Two admissions leave it; nothing" ^0
"in the rule can reach it from inside." ^0
```

## Python (deterministic transpilation)

```python
demand = [100, 90, 80, 70, 60, 50, 40, 30]
names = ["a", "b", "c", "d", "e", "f", "g", "h"]
n = len(demand)
slots = 4
boost = 2
cached = [0, 0, 0, 0, 1, 1, 1, 1]

def observed(i, c):
    if c[i] == 1:
        return demand[i] * boost
    return demand[i]

def top_slots(c):
    chosen = []
    picked = 0
    while picked < slots:
        best = 0 - 1
        best_i = 0
        for i in range(0, n):
            if not i in chosen:
                if observed(i, c) > best:
                    best = observed(i, c)
                    best_i = i
        chosen = chosen + [best_i]
        picked = picked + 1
    flags = []
    for i in range(0, n):
        f = 0
        if i in chosen:
            f = 1
        flags = flags + [f]
    return flags

def show(c):
    s = ""
    for i in range(0, n):
        if c[i] == 1:
            s = s + names[i] + " "
    return s

print("items : " + str(n) + ", cache slots : " + str(slots))
print("a cached item is requested " + str(boost) + "x as often as the same item uncached")
print("")
print("item   true demand")
for i in range(0, n):
    print("  " + names[i] + "      " + str(demand[i]))
print("")
print("the true top " + str(slots) + " by demand alone : ")
nobody = [0, 0, 0, 0, 0, 0, 0, 0]
truth = top_slots(nobody)
print("  " + show(truth))
print("")
c = cached
print("round   cache contents")
print("  0     " + show(c))
r = 0
settled = 0
while r < 6:
    nxt = top_slots(c)
    r = r + 1
    print("  " + str(r) + "     " + show(nxt))
    same = 0
    for i in range(0, n):
        if nxt[i] == c[i]:
            same = same + 1
    if same == n:
        if settled == 0:
            settled = r
    c = nxt
if settled > 0:
    print("  settled after round " + str(settled) + " and does not move again")
print("")
agree = 0
for i in range(0, n):
    if c[i] == 1:
        if truth[i] == 1:
            agree = agree + 1
print("the cache it settles on against the true top " + str(slots))
print("  items in both      : " + str(agree) + " of " + str(slots))
print("  held but not top   : ")
for i in range(0, n):
    if c[i] == 1:
        if truth[i] == 0:
            print("    " + names[i] + ", true demand " + str(demand[i]))
print("  top but locked out : ")
for i in range(0, n):
    if truth[i] == 1:
        if c[i] == 0:
            print("    " + names[i] + ", true demand " + str(demand[i]))
print("")
for i in range(0, n):
    if truth[i] == 1:
        if c[i] == 0:
            for j in range(0, n):
                if c[j] == 1:
                    if truth[j] == 0:
                        if observed(i, c) < observed(j, c):
                            print("  " + names[i] + " is observed at " + str(observed(i, c)) + " against " + names[j] + " at " + str(observed(j, c)))
print("  the same pairs ranked on true demand alone")
for i in range(0, n):
    if truth[i] == 1:
        if c[i] == 0:
            for j in range(0, n):
                if c[j] == 1:
                    if truth[j] == 0:
                        if demand[i] > demand[j]:
                            print("    " + names[i] + " " + str(demand[i]) + " beats " + names[j] + " " + str(demand[j]))
print("  every pair inverts once the boost is removed, so the boost is not a")
print("  tiebreaker between close rivals - it is the whole of the ordering here")
print("")
e = c
rounds_to_truth = 0
k = 0
while k < 4:
    best = 0
    best_i = 0
    for i in range(0, n):
        if e[i] == 0:
            if demand[i] > best:
                best = demand[i]
                best_i = i
    probe = []
    for i in range(0, n):
        if i == best_i:
            probe = probe + [1]
        else:
            probe = probe + [e[i]]
    e = top_slots(probe)
    k = k + 1
    match = 0
    for i in range(0, n):
        if e[i] == truth[i]:
            match = match + 1
    if match == n:
        if rounds_to_truth == 0:
            rounds_to_truth = k
print("admitting the best uncached item for one round, repeatedly")
print("  cache after " + str(k) + " such rounds : " + show(e))
if rounds_to_truth > 0:
    print("  reaches the true top " + str(slots) + " after " + str(rounds_to_truth) + " admissions")
else:
    print("  does not reach the true top " + str(slots) + " within " + str(k) + " admissions")
print("")
picked2 = 0
chosen2 = []
while picked2 < slots:
    best2 = 0
    bi2 = 0
    for i in range(0, n):
        if not i in chosen2:
            if demand[i] > best2:
                best2 = demand[i]
                bi2 = i
    chosen2 = chosen2 + [bi2]
    picked2 = picked2 + 1
flat_agree = 0
for i in range(0, n):
    if i in chosen2:
        if truth[i] == 1:
            flat_agree = flat_agree + 1
print("control - the same rule where caching does not change demand")
print("  items in both : " + str(flat_agree) + " of " + str(slots))
if flat_agree == slots:
    print("  the ranking lands on the true top immediately, from any starting cache")
print("")
print("A ranking whose input it partly produces has fixed points, and this one has")
print("a wrong one two rounds away from any start. Two admissions leave it; nothing")
print("in the rule can reach it from inside.")
```

## stdout (executed)

```text
items : 8, cache slots : 4
a cached item is requested 2x as often as the same item uncached

item   true demand
  a      100
  b      90
  c      80
  d      70
  e      60
  f      50
  g      40
  h      30

the true top 4 by demand alone : 
  a b c d 

round   cache contents
  0     e f g h 
  1     a b e f 
  2     a b e f 
  3     a b e f 
  4     a b e f 
  5     a b e f 
  6     a b e f 
  settled after round 2 and does not move again

the cache it settles on against the true top 4
  items in both      : 2 of 4
  held but not top   : 
    e, true demand 60
    f, true demand 50
  top but locked out : 
    c, true demand 80
    d, true demand 70

  c is observed at 80 against e at 120
  c is observed at 80 against f at 100
  d is observed at 70 against e at 120
  d is observed at 70 against f at 100
  the same pairs ranked on true demand alone
    c 80 beats e 60
    c 80 beats f 50
    d 70 beats e 60
    d 70 beats f 50
  every pair inverts once the boost is removed, so the boost is not a
  tiebreaker between close rivals - it is the whole of the ordering here

admitting the best uncached item for one round, repeatedly
  cache after 4 such rounds : a b c d 
  reaches the true top 4 after 2 admissions

control - the same rule where caching does not change demand
  items in both : 4 of 4
  the ranking lands on the true top immediately, from any starting cache

A ranking whose input it partly produces has fixed points, and this one has
a wrong one two rounds away from any start. Two admissions leave it; nothing
in the rule can reach it from inside.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
