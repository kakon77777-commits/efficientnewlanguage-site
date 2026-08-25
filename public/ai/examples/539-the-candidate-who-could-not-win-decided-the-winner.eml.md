<!-- canonical: efficientnewlanguage.org/ai/examples/539-the-candidate-who-could-not-win-decided-the-winner | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 539 — The candidate who could not win decided the winner

`the_candidate_who_could_not_win_decided_the_winner.eml` - Seventeen people rank three proposals. One proposal wins under none of the three counting rules. What happens to the result when it is taken off the ballot is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Seventeen people
# rank three proposals. One proposal wins under none of the three counting
# rules. What happens to the result when it is taken off the ballot is computed
# below.
#
# Putting the third proposal on the ballot was right. Four people rank it
# first, it is a real option that a real constituency wants, and removing an
# option because of what its presence does to the arithmetic is choosing the
# outcome and calling it a procedure. The whole argument for asking people to
# rank rather than to pick is that their actual preferences should be recorded.
#
# Counting the first choices is also right, or at least defensible. It is the
# rule everyone already understands, it can be audited by hand in a room, and
# it needs no explanation to the losing side.
#
# The two together produce a result that neither of them contains. A tally is a
# function of the SET of options as well as of the preferences, so an option
# that cannot win can still decide who does. Nobody has to be strategic,
# nobody has to be confused, and nobody has to change their mind.
#
# Whether any voter changed their mind is not assumed here. It is the control
# at the end, and it is a tally rather than a claim.

# [voters, first, second, third]
[[8, "A", "B", "C"], [5, "B", "C", "A"], [4, "C", "B", "A"]] => groups
["A", "B", "C"] => options

0 => electorate
for g in groups:
    electorate + g[0] => electorate

"the ballots" ^0
for g in groups:
    "  " + str(g[0]) + " voters : " + g[1] + " > " + g[2] + " > " + g[3] ^0
"  electorate : " + str(electorate) ^0
"" ^0

def rank_of(g, name):
    if g[1] == name:
        return 1
    if g[2] == name:
        return 2
    return 3

def prefers(g, x, y):
    if rank_of(g, x) < rank_of(g, y):
        return 1
    return 0

def pairwise(x, y):
    0 => total
    for g in groups:
        total + g[0] * prefers(g, x, y) => total
    return total

def first_place(name):
    0 => total
    for g in groups:
        if g[1] == name:
            total + g[0] => total
    return total

def borda(name):
    0 => total
    for g in groups:
        total + g[0] * (3 - rank_of(g, name)) => total
    return total

# ---- the three rules, all three options on the ballot ----

"rule 1 - count first choices" ^0
"" => plurality_all
0 => best
for o in options:
    first_place(o) => votes
    if votes > best:
        votes => best
        o => plurality_all
    "  " + o + " : " + str(votes) ^0
"  winner : " + plurality_all ^0
"" ^0

"rule 2 - eliminate the fewest first choices, then recount" ^0
"" => weakest
electorate + 1 => fewest
for o in options:
    if first_place(o) < fewest:
        first_place(o) => fewest
        o => weakest
"  eliminated first : " + weakest + " with " + str(fewest) + " first choices" ^0

# with one option gone, every ballot moves to whichever of the two survivors
# it ranked higher, which is the head-to-head tally between them
[o for o in options if o != weakest] => survivors
survivors[0] => s0
survivors[1] => s1
pairwise(s0, s1) => s0_after
pairwise(s1, s0) => s1_after
"  " + s0 + " after the transfer : " + str(s0_after) ^0
"  " + s1 + " after the transfer : " + str(s1_after) ^0
"" => irv_winner
if s0_after > s1_after:
    s0 => irv_winner
if s1_after > s0_after:
    s1 => irv_winner
"  winner : " + irv_winner ^0
"" ^0

"rule 3 - points by rank, 2 for first, 1 for second, 0 for third" ^0
"" => borda_winner
0 => borda_best
for o in options:
    borda(o) => pts
    if pts > borda_best:
        pts => borda_best
        o => borda_winner
    "  " + o + " : " + str(pts) ^0
"  winner : " + borda_winner ^0
"" ^0

"C wins under rule 1 : " + str(first_place("C") == best) ^0
"C wins under rule 2 : " + str(weakest != "C") ^0
"C wins under rule 3 : " + str(borda("C") == borda_best) ^0
"  C is the option that cannot win, under every rule on the table" ^0
"" ^0

# ---- every head-to-head contest ----
#
# C is not a universal loser. It beats one of the two, which is exactly why it
# is on the ballot at all and why removing it is not obviously harmless.

"every head-to-head contest" ^0
for x in options:
    for y in options:
        if x < y:
            pairwise(x, y) => xy
            pairwise(y, x) => yx
            if xy > yx:
                "  " + x + " beats " + y + ", " + str(xy) + " to " + str(yx) ^0
            if yx > xy:
                "  " + y + " beats " + x + ", " + str(yx) + " to " + str(xy) ^0
"" ^0

# ---- rule 1 again, with C removed ----
#
# With two options left, a voter's first choice is whichever of the two they
# ranked higher, which is the head-to-head tally.

"rule 1 - count first choices, C removed from the ballot" ^0
pairwise("A", "B") => a_two
pairwise("B", "A") => b_two
"  A : " + str(a_two) ^0
"  B : " + str(b_two) ^0
"" => plurality_two
if a_two > b_two:
    "A" => plurality_two
if b_two > a_two:
    "B" => plurality_two
"  winner : " + plurality_two ^0
"" ^0

"  this is the same arithmetic as rule 2's final round, which is why rule 2" ^0
"  already elected " + irv_winner + " without anybody removing anything" ^0
"" ^0

"the same rule, the same voters, the same ballots" ^0
"  winner with C on the ballot  : " + plurality_all ^0
"  winner with C off the ballot : " + plurality_two ^0
"" ^0

# ---- the control ----
#
# If removing C had changed anybody's opinion of A against B, the flip would be
# a fact about the voters rather than about the count. This is the tally that
# decides which it is, and it is computed twice from the same ballots.

"control - the A against B tally, with C present and with C removed" ^0
"  with C    : A " + str(pairwise("A", "B")) + ", B " + str(pairwise("B", "A")) ^0
"  without C : A " + str(a_two) + ", B " + str(b_two) ^0
"  identical : " + str(pairwise("A", "B") == a_two) ^0
"  voters who changed their A-against-B preference : " + str(pairwise("A", "B") - a_two) ^0
"  so the flip is not in anyone's opinion, it is in the aggregation" ^0
"" ^0

# ---- where the majority went ----

"what the first-choice rule did with the " + str(b_two) + " voters who prefer B to A" ^0
"  B is preferred to A by " + str(b_two) + " of " + str(electorate) + ", a majority" ^0
"  under rule 1 with C present, B is credited with " + str(first_place("B")) ^0
"  the missing " + str(b_two - first_place("B")) + " ranked C first and B second" ^0
"  rule 1 reads a ranking's first entry and discards the rest, and the" ^0
"  discarded part is where the majority was written down" ^0
"" ^0

str(first_place("C")) + " people rank C first, so C belongs on the ballot, and counting first" ^0
"choices is the rule everyone can audit. C wins under none of the three rules" ^0
"and still decides the outcome: " + plurality_all + " wins with C present and " + plurality_two + " without, while" ^0
str(b_two) + " of " + str(electorate) + " voters prefer B to A in both counts." ^0
```

## Python (deterministic transpilation)

```python
groups = [[8, "A", "B", "C"], [5, "B", "C", "A"], [4, "C", "B", "A"]]
options = ["A", "B", "C"]
electorate = 0
for g in groups:
    electorate = electorate + g[0]
print("the ballots")
for g in groups:
    print("  " + str(g[0]) + " voters : " + g[1] + " > " + g[2] + " > " + g[3])
print("  electorate : " + str(electorate))
print("")

def rank_of(g, name):
    if g[1] == name:
        return 1
    if g[2] == name:
        return 2
    return 3

def prefers(g, x, y):
    if rank_of(g, x) < rank_of(g, y):
        return 1
    return 0

def pairwise(x, y):
    total = 0
    for g in groups:
        total = total + g[0] * prefers(g, x, y)
    return total

def first_place(name):
    total = 0
    for g in groups:
        if g[1] == name:
            total = total + g[0]
    return total

def borda(name):
    total = 0
    for g in groups:
        total = total + g[0] * (3 - rank_of(g, name))
    return total

print("rule 1 - count first choices")
plurality_all = ""
best = 0
for o in options:
    votes = first_place(o)
    if votes > best:
        best = votes
        plurality_all = o
    print("  " + o + " : " + str(votes))
print("  winner : " + plurality_all)
print("")
print("rule 2 - eliminate the fewest first choices, then recount")
weakest = ""
fewest = electorate + 1
for o in options:
    if first_place(o) < fewest:
        fewest = first_place(o)
        weakest = o
print("  eliminated first : " + weakest + " with " + str(fewest) + " first choices")
survivors = [o for o in options if o != weakest]
s0 = survivors[0]
s1 = survivors[1]
s0_after = pairwise(s0, s1)
s1_after = pairwise(s1, s0)
print("  " + s0 + " after the transfer : " + str(s0_after))
print("  " + s1 + " after the transfer : " + str(s1_after))
irv_winner = ""
if s0_after > s1_after:
    irv_winner = s0
if s1_after > s0_after:
    irv_winner = s1
print("  winner : " + irv_winner)
print("")
print("rule 3 - points by rank, 2 for first, 1 for second, 0 for third")
borda_winner = ""
borda_best = 0
for o in options:
    pts = borda(o)
    if pts > borda_best:
        borda_best = pts
        borda_winner = o
    print("  " + o + " : " + str(pts))
print("  winner : " + borda_winner)
print("")
print("C wins under rule 1 : " + str(first_place("C") == best))
print("C wins under rule 2 : " + str(weakest != "C"))
print("C wins under rule 3 : " + str(borda("C") == borda_best))
print("  C is the option that cannot win, under every rule on the table")
print("")
print("every head-to-head contest")
for x in options:
    for y in options:
        if x < y:
            xy = pairwise(x, y)
            yx = pairwise(y, x)
            if xy > yx:
                print("  " + x + " beats " + y + ", " + str(xy) + " to " + str(yx))
            if yx > xy:
                print("  " + y + " beats " + x + ", " + str(yx) + " to " + str(xy))
print("")
print("rule 1 - count first choices, C removed from the ballot")
a_two = pairwise("A", "B")
b_two = pairwise("B", "A")
print("  A : " + str(a_two))
print("  B : " + str(b_two))
plurality_two = ""
if a_two > b_two:
    plurality_two = "A"
if b_two > a_two:
    plurality_two = "B"
print("  winner : " + plurality_two)
print("")
print("  this is the same arithmetic as rule 2's final round, which is why rule 2")
print("  already elected " + irv_winner + " without anybody removing anything")
print("")
print("the same rule, the same voters, the same ballots")
print("  winner with C on the ballot  : " + plurality_all)
print("  winner with C off the ballot : " + plurality_two)
print("")
print("control - the A against B tally, with C present and with C removed")
print("  with C    : A " + str(pairwise("A", "B")) + ", B " + str(pairwise("B", "A")))
print("  without C : A " + str(a_two) + ", B " + str(b_two))
print("  identical : " + str(pairwise("A", "B") == a_two))
print("  voters who changed their A-against-B preference : " + str(pairwise("A", "B") - a_two))
print("  so the flip is not in anyone's opinion, it is in the aggregation")
print("")
print("what the first-choice rule did with the " + str(b_two) + " voters who prefer B to A")
print("  B is preferred to A by " + str(b_two) + " of " + str(electorate) + ", a majority")
print("  under rule 1 with C present, B is credited with " + str(first_place("B")))
print("  the missing " + str(b_two - first_place("B")) + " ranked C first and B second")
print("  rule 1 reads a ranking's first entry and discards the rest, and the")
print("  discarded part is where the majority was written down")
print("")
print(str(first_place("C")) + " people rank C first, so C belongs on the ballot, and counting first")
print("choices is the rule everyone can audit. C wins under none of the three rules")
print("and still decides the outcome: " + plurality_all + " wins with C present and " + plurality_two + " without, while")
print(str(b_two) + " of " + str(electorate) + " voters prefer B to A in both counts.")
```

## stdout (executed)

```text
the ballots
  8 voters : A > B > C
  5 voters : B > C > A
  4 voters : C > B > A
  electorate : 17

rule 1 - count first choices
  A : 8
  B : 5
  C : 4
  winner : A

rule 2 - eliminate the fewest first choices, then recount
  eliminated first : C with 4 first choices
  A after the transfer : 8
  B after the transfer : 9
  winner : B

rule 3 - points by rank, 2 for first, 1 for second, 0 for third
  A : 16
  B : 22
  C : 13
  winner : B

C wins under rule 1 : False
C wins under rule 2 : False
C wins under rule 3 : False
  C is the option that cannot win, under every rule on the table

every head-to-head contest
  B beats A, 9 to 8
  C beats A, 9 to 8
  B beats C, 13 to 4

rule 1 - count first choices, C removed from the ballot
  A : 8
  B : 9
  winner : B

  this is the same arithmetic as rule 2's final round, which is why rule 2
  already elected B without anybody removing anything

the same rule, the same voters, the same ballots
  winner with C on the ballot  : A
  winner with C off the ballot : B

control - the A against B tally, with C present and with C removed
  with C    : A 8, B 9
  without C : A 8, B 9
  identical : True
  voters who changed their A-against-B preference : 0
  so the flip is not in anyone's opinion, it is in the aggregation

what the first-choice rule did with the 9 voters who prefer B to A
  B is preferred to A by 9 of 17, a majority
  under rule 1 with C present, B is credited with 5
  the missing 4 ranked C first and B second
  rule 1 reads a ranking's first entry and discards the rest, and the
  discarded part is where the majority was written down

4 people rank C first, so C belongs on the ballot, and counting first
choices is the rule everyone can audit. C wins under none of the three rules
and still decides the outcome: A wins with C present and B without, while
9 of 17 voters prefer B to A in both counts.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
