<!-- canonical: efficientnewlanguage.org/ai/examples/459-the-reviewer-got-stricter-and-the-author-leaned-on-it | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 459 — The reviewer got stricter and the author leaned on it

`the_reviewer_got_stricter_and_the_author_leaned_on_it.eml` - Review got stricter because defects were escaping, and self-checking got lighter because review was catching things. Where the pair settles is simulated.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Review got
# stricter because defects were escaping, and self-checking got lighter because
# review was catching things. Where the pair settles is simulated.
#
# Both adjustments are correct responses to correct evidence. The reviewer saw
# defects reach production and looked harder, which found more. The author saw
# review catching things reliably and spent the pre-submit hour on the next
# change instead, which is what a working review process is for.
#
# Effort spent by one party is evidence for the other party about how much to
# spend. Neither is optimising the pair, and neither can see the other's
# number, so the total lands wherever the two adjustments meet.
#
# Ten rounds are run and every quantity is computed from the pair.

20 => base_defects
12 => rounds
2 => escape_tolerance
5 => reliance_threshold

"a change carries " + str(base_defects) + " latent defects before any effort" ^0
"author effort removes 1 each; review effort catches 2 each" ^0
"" ^0

6 => author
2 => reviewer
0 => total_author
0 => total_reviewer
0 => total_escaped
0 => t
"round   author   reviewer   caught   escaped   review days" ^0
while t < rounds:
    base_defects - author => written
    if written < 0:
        0 => written
    reviewer * 2 => caught
    if written < caught:
        written => caught
    written - caught => escaped
    total_author + author => total_author
    total_reviewer + reviewer => total_reviewer
    total_escaped + escaped => total_escaped
    t + 1 => t
    if t <= 6:
        "  " + str(t) + "       " + str(author) + "        " + str(reviewer) + "          " + str(caught) + "        " + str(escaped) + "         " + str(reviewer) ^0
    author => next_author
    reviewer => next_reviewer
    if escaped > escape_tolerance:
        reviewer + 1 => next_reviewer
    if caught >= reliance_threshold:
        author - 1 => next_author
    if next_author < 0:
        0 => next_author
    if next_reviewer > 10:
        10 => next_reviewer
    next_author => author
    next_reviewer => reviewer
"" ^0

"where it settles" ^0
"  author effort   : 6 at the start, " + str(author) + " at the end" ^0
"  reviewer effort : 2 at the start, " + str(reviewer) + " at the end" ^0
"  effort per change, start : " + str(6 + 2) ^0
"  effort per change, end   : " + str(author + reviewer) ^0
if author + reviewer > 8:
    "  the pair spends " + str(author + reviewer - 8) + " more than it started with" ^0
elif author + reviewer == 8:
    "  the pair spends exactly what it started with, in a different place" ^0
else:
    "  the pair spends " + str(8 - author - reviewer) + " less than it started with" ^0
"" ^0

"escaped defects, over " + str(rounds) + " rounds : " + str(total_escaped) ^0
"  author effort spent   : " + str(total_author) ^0
"  reviewer effort spent : " + str(total_reviewer) ^0
"" ^0

# ---- what the same total effort buys if it is placed rather than negotiated ----
#
# The two efforts are not interchangeable: one removes a defect, the other
# catches two. A pair that could see both numbers would not split it this way.

author + reviewer => budget
0 => best_escaped
0 => best_a
0 => first
for a in [0:budget]:
    budget - a => r
    base_defects - a => w
    if w < 0:
        0 => w
    r * 2 => c
    if w < c:
        w => c
    w - c => e
    if first == 0:
        e => best_escaped
        a => best_a
        1 => first
    if e < best_escaped:
        e => best_escaped
        a => best_a
"the same budget of " + str(budget) + ", split every possible way" ^0
"  best split : author " + str(best_a) + ", reviewer " + str(budget - best_a) + ", escaping " + str(best_escaped) ^0
base_defects - author => w_now
if w_now < 0:
    0 => w_now
reviewer * 2 => c_now
if w_now < c_now:
    w_now => c_now
w_now - c_now => e_now
"  where it settled : author " + str(author) + ", reviewer " + str(reviewer) + ", escaping " + str(e_now) ^0
if e_now > best_escaped:
    "  the negotiated split lets " + str(e_now - best_escaped) + " more through for the same effort" ^0
elif e_now == best_escaped:
    "  the two coincide: mutual adjustment landed on the efficient split," ^0
    "  which it should, because review effort here is twice as productive" ^0
    "  as author effort and the pair kept moving until that showed" ^0
"" ^0

# ---- what the journey cost ----
#
# The destination is right. It was reached one increment per round, and every
# round before it ran at the split it had reached so far.

best_escaped * rounds => ideal_total
"escapes if the efficient split had been chosen on the first day" ^0
"  " + str(best_escaped) + " per round over " + str(rounds) + " rounds : " + str(ideal_total) ^0
"escapes actually incurred : " + str(total_escaped) ^0
if total_escaped > ideal_total:
    "  the difference is " + str(total_escaped - ideal_total) + ", which is what discovering the split by" ^0
    "  mutual adjustment cost, at " + str(int((total_escaped - ideal_total) * 100 / ideal_total)) + "% on top" ^0
"  neither party could have named the split earlier: it depends on both" ^0
"  productivities, and each of them knows only its own" ^0
"" ^0

# ---- what each party sees ----

"each party reading only its own instrument" ^0
"  the reviewer sees : defects it catches, which rose" ^0
"  the author sees   : defects it is told about, which rose" ^0
"  both read a rising number as evidence their own adjustment was right" ^0
"  neither reads " + str(total_escaped) + ", the count that reached production" ^0
"" ^0

# ---- the control: a party that cannot observe the other ----
#
# Where the author never learns what review caught, there is no signal to lean
# on, and the effort stays where it was put.

6 => c_author
2 => c_reviewer
0 => ct
while ct < rounds:
    base_defects - c_author => w
    c_reviewer * 2 => c
    if w < c:
        w => c
    w - c => e
    if e > escape_tolerance:
        c_reviewer + 1 => c_reviewer
    if c_reviewer > 10:
        10 => c_reviewer
    ct + 1 => ct
"control - the author is never told what review caught" ^0
"  author effort at the end   : " + str(c_author) ^0
"  reviewer effort at the end : " + str(c_reviewer) ^0
if c_author == 6:
    "  unchanged, because the signal it was responding to was the other party" ^0
"" ^0

"Two parties each adjusting on their own signal reached the split neither" ^0
"could compute, one increment at a time. What the search cost is the defects" ^0
"that escaped while it was still searching." ^0
```

## Python (deterministic transpilation)

```python
base_defects = 20
rounds = 12
escape_tolerance = 2
reliance_threshold = 5
print("a change carries " + str(base_defects) + " latent defects before any effort")
print("author effort removes 1 each; review effort catches 2 each")
print("")
author = 6
reviewer = 2
total_author = 0
total_reviewer = 0
total_escaped = 0
t = 0
print("round   author   reviewer   caught   escaped   review days")
while t < rounds:
    written = base_defects - author
    if written < 0:
        written = 0
    caught = reviewer * 2
    if written < caught:
        caught = written
    escaped = written - caught
    total_author = total_author + author
    total_reviewer = total_reviewer + reviewer
    total_escaped = total_escaped + escaped
    t = t + 1
    if t <= 6:
        print("  " + str(t) + "       " + str(author) + "        " + str(reviewer) + "          " + str(caught) + "        " + str(escaped) + "         " + str(reviewer))
    next_author = author
    next_reviewer = reviewer
    if escaped > escape_tolerance:
        next_reviewer = reviewer + 1
    if caught >= reliance_threshold:
        next_author = author - 1
    if next_author < 0:
        next_author = 0
    if next_reviewer > 10:
        next_reviewer = 10
    author = next_author
    reviewer = next_reviewer
print("")
print("where it settles")
print("  author effort   : 6 at the start, " + str(author) + " at the end")
print("  reviewer effort : 2 at the start, " + str(reviewer) + " at the end")
print("  effort per change, start : " + str(6 + 2))
print("  effort per change, end   : " + str(author + reviewer))
if author + reviewer > 8:
    print("  the pair spends " + str(author + reviewer - 8) + " more than it started with")
elif author + reviewer == 8:
    print("  the pair spends exactly what it started with, in a different place")
else:
    print("  the pair spends " + str(8 - author - reviewer) + " less than it started with")
print("")
print("escaped defects, over " + str(rounds) + " rounds : " + str(total_escaped))
print("  author effort spent   : " + str(total_author))
print("  reviewer effort spent : " + str(total_reviewer))
print("")
budget = author + reviewer
best_escaped = 0
best_a = 0
first = 0
for a in range(0, budget+1):
    r = budget - a
    w = base_defects - a
    if w < 0:
        w = 0
    c = r * 2
    if w < c:
        c = w
    e = w - c
    if first == 0:
        best_escaped = e
        best_a = a
        first = 1
    if e < best_escaped:
        best_escaped = e
        best_a = a
print("the same budget of " + str(budget) + ", split every possible way")
print("  best split : author " + str(best_a) + ", reviewer " + str(budget - best_a) + ", escaping " + str(best_escaped))
w_now = base_defects - author
if w_now < 0:
    w_now = 0
c_now = reviewer * 2
if w_now < c_now:
    c_now = w_now
e_now = w_now - c_now
print("  where it settled : author " + str(author) + ", reviewer " + str(reviewer) + ", escaping " + str(e_now))
if e_now > best_escaped:
    print("  the negotiated split lets " + str(e_now - best_escaped) + " more through for the same effort")
elif e_now == best_escaped:
    print("  the two coincide: mutual adjustment landed on the efficient split,")
    print("  which it should, because review effort here is twice as productive")
    print("  as author effort and the pair kept moving until that showed")
print("")
ideal_total = best_escaped * rounds
print("escapes if the efficient split had been chosen on the first day")
print("  " + str(best_escaped) + " per round over " + str(rounds) + " rounds : " + str(ideal_total))
print("escapes actually incurred : " + str(total_escaped))
if total_escaped > ideal_total:
    print("  the difference is " + str(total_escaped - ideal_total) + ", which is what discovering the split by")
    print("  mutual adjustment cost, at " + str(int((total_escaped - ideal_total) * 100 / ideal_total)) + "% on top")
print("  neither party could have named the split earlier: it depends on both")
print("  productivities, and each of them knows only its own")
print("")
print("each party reading only its own instrument")
print("  the reviewer sees : defects it catches, which rose")
print("  the author sees   : defects it is told about, which rose")
print("  both read a rising number as evidence their own adjustment was right")
print("  neither reads " + str(total_escaped) + ", the count that reached production")
print("")
c_author = 6
c_reviewer = 2
ct = 0
while ct < rounds:
    w = base_defects - c_author
    c = c_reviewer * 2
    if w < c:
        c = w
    e = w - c
    if e > escape_tolerance:
        c_reviewer = c_reviewer + 1
    if c_reviewer > 10:
        c_reviewer = 10
    ct = ct + 1
print("control - the author is never told what review caught")
print("  author effort at the end   : " + str(c_author))
print("  reviewer effort at the end : " + str(c_reviewer))
if c_author == 6:
    print("  unchanged, because the signal it was responding to was the other party")
print("")
print("Two parties each adjusting on their own signal reached the split neither")
print("could compute, one increment at a time. What the search cost is the defects")
print("that escaped while it was still searching.")
```

## stdout (executed)

```text
a change carries 20 latent defects before any effort
author effort removes 1 each; review effort catches 2 each

round   author   reviewer   caught   escaped   review days
  1       6        2          4        10         2
  2       6        3          6        8         3
  3       5        4          8        7         4
  4       4        5          10        6         5
  5       3        6          12        5         6
  6       2        7          14        4         7

where it settles
  author effort   : 6 at the start, 0 at the end
  reviewer effort : 2 at the start, 9 at the end
  effort per change, start : 8
  effort per change, end   : 9
  the pair spends 1 more than it started with

escaped defects, over 12 rounds : 53
  author effort spent   : 27
  reviewer effort spent : 80

the same budget of 9, split every possible way
  best split : author 0, reviewer 9, escaping 2
  where it settled : author 0, reviewer 9, escaping 2
  the two coincide: mutual adjustment landed on the efficient split,
  which it should, because review effort here is twice as productive
  as author effort and the pair kept moving until that showed

escapes if the efficient split had been chosen on the first day
  2 per round over 12 rounds : 24
escapes actually incurred : 53
  the difference is 29, which is what discovering the split by
  mutual adjustment cost, at 120% on top
  neither party could have named the split earlier: it depends on both
  productivities, and each of them knows only its own

each party reading only its own instrument
  the reviewer sees : defects it catches, which rose
  the author sees   : defects it is told about, which rose
  both read a rising number as evidence their own adjustment was right
  neither reads 53, the count that reached production

control - the author is never told what review caught
  author effort at the end   : 6
  reviewer effort at the end : 6
  unchanged, because the signal it was responding to was the other party

Two parties each adjusting on their own signal reached the split neither
could compute, one increment at a time. What the search cost is the defects
that escaped while it was still searching.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
