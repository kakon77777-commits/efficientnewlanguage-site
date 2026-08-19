<!-- canonical: efficientnewlanguage.org/ai/examples/461-the-target-was-set-by-what-was-asked-for | ai_layer_version: 0.1.0 | updated: 2026-08-19 -->

# Example 461 — The target was set by what was asked for

`the_target_was_set_by_what_was_asked_for.eml` - The availability target was set to what consumers asked for, and consumers asked for what was published. What any of them needs is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The availability
# target was set to what consumers asked for, and consumers asked for what was
# published. What any of them needs is computed below.
#
# Setting the target from consumer requirements is the correct method and it is
# what every guide says: do not pick a number, ask the people who depend on you.
# The team did ask, wrote the answers down, and set the target to the strictest
# one. Nothing about the process was skipped.
#
# A consumer asked what to ask for looks at what is on offer. So the answers
# come back as the published figure, the strictest of them is the published
# figure, and the requirement and the target are the same number arrived at
# twice. The one thing not in the loop is what breaks if it is missed.
#
# Each consumer's real tolerance is computed from its own retry budget.

# [consumer, nines it asked for, seconds it can wait, its own published target in nines]
[["checkout", 3, 30, 3], ["search", 3, 120, 2], ["reporting", 3, 3600, 1], ["mobile app", 3, 60, 2], ["partner feed", 3, 900, 1], ["fraud check", 3, 5, 4]] => consumers

len(consumers) => n
3 => published

# a consumer needs the provider to be at least as available as its own promise
def needs(c):
    return c[3]

0 => asked_same
0 => below
0 => above
0 => strictest
for c in consumers:
    if c[1] == published:
        asked_same + 1 => asked_same
    if needs(c) < published:
        below + 1 => below
    if needs(c) > published:
        above + 1 => above
    if needs(c) > strictest:
        needs(c) => strictest

"consumers : " + str(n) + ", published target : " + str(published) + " nines" ^0
"" ^0
"consumer        asked for   can wait   own promise   really needs" ^0
for c in consumers:
    "  " + c[0] + "   " + str(c[1]) + " nines     " + str(c[2]) + "s      " + str(c[3]) + " nines      " + str(needs(c)) + " nines" ^0
"" ^0

"consumers whose answer equals the published figure : " + str(asked_same) + " of " + str(n) ^0
if asked_same == n:
    "  every answer came back as the number that was already on the page" ^0
"" ^0

"against what each one's own promise implies" ^0
"  need less than " + str(published) + " nines : " + str(below) ^0
"  need exactly " + str(published) + "        : " + str(n - below - above) ^0
"  need more than " + str(published) + "      : " + str(above) ^0
"  strictest real requirement : " + str(strictest) + " nines" ^0
if strictest > published:
    "  which is above the target the survey produced, by " + str(strictest - published) ^0
"" ^0

for c in consumers:
    if needs(c) == strictest:
        "  the consumer that needs it : " + c[0] + ", which can wait " + str(c[2]) + " seconds" ^0
        "  it asked for " + str(c[1]) + " nines, the same as everyone, and it is the one" ^0
        "  the target does not cover" ^0
"" ^0

# ---- what the target costs ----

[0, 40, 120, 300, 900] => cost_by_nines
"cost of running at each level" ^0
for k in [1:4]:
    "  " + str(k) + " nines : " + str(cost_by_nines[k]) ^0
"" ^0
"at the published target of " + str(published) + " : " + str(cost_by_nines[published]) ^0
0 => max_below
for c in consumers:
    if needs(c) < published:
        if needs(c) > max_below:
            needs(c) => max_below
"the strictest requirement among consumers that need less than the target : " + str(max_below) ^0
if below > 0:
    "  " + str(below) + " consumers would be inside their own promise at " + str(max_below) + " nines" ^0
    "  which costs " + str(cost_by_nines[max_below]) + " against " + str(cost_by_nines[published]) ^0
"" ^0

"serving the one strict consumer separately" ^0
"  the other " + str(n - 1) + " at " + str(max_below) + " nines : " + str(cost_by_nines[max_below]) ^0
"  one path at " + str(strictest) + " nines      : " + str(cost_by_nines[strictest]) ^0
"  total                       : " + str(cost_by_nines[max_below] + cost_by_nines[strictest]) ^0
"  one uniform target at " + str(strictest) + "     : " + str(cost_by_nines[strictest]) ^0
if cost_by_nines[max_below] + cost_by_nines[strictest] > cost_by_nines[strictest]:
    "  splitting costs " + str(cost_by_nines[max_below]) + " more here, so the uniform strict target wins" ^0
    "  on cost - and it is a different number from the one the survey found" ^0
"" ^0

# ---- what would have broken the circle ----
#
# Not a better survey. A question whose answer is not a number the provider
# has already published.

"the question that was asked : what availability do you require" ^0
"the question that is answerable : how long can you wait, and what do you" ^0
"  promise your own users" ^0
"  the second one was answered above, in seconds and in nines, and it" ^0
"  produced " + str(strictest) + " where the first produced " + str(published) ^0
"" ^0

# ---- the control: a consumer with no published target of its own ----
#
# Where a consumer has nothing of its own to derive from, the circular answer
# is the only answer it has, and asking harder does not help.

"control - a consumer that publishes nothing and has no retry budget" ^0
"  what it can derive a requirement from : nothing" ^0
"  what it will answer                   : the published figure" ^0
"  for this consumer the survey is not circular by accident, it is circular" ^0
"  because there is no second source to reach" ^0
"" ^0

"Asking the consumers is the right method and the answers were recorded" ^0
"faithfully. A requirement gathered from people reading your own page is your" ^0
"own page, and the one consumer it fails is the one that answered like the" ^0
"others." ^0
```

## Python (deterministic transpilation)

```python
consumers = [["checkout", 3, 30, 3], ["search", 3, 120, 2], ["reporting", 3, 3600, 1], ["mobile app", 3, 60, 2], ["partner feed", 3, 900, 1], ["fraud check", 3, 5, 4]]
n = len(consumers)
published = 3

def needs(c):
    return c[3]

asked_same = 0
below = 0
above = 0
strictest = 0
for c in consumers:
    if c[1] == published:
        asked_same = asked_same + 1
    if needs(c) < published:
        below = below + 1
    if needs(c) > published:
        above = above + 1
    if needs(c) > strictest:
        strictest = needs(c)
print("consumers : " + str(n) + ", published target : " + str(published) + " nines")
print("")
print("consumer        asked for   can wait   own promise   really needs")
for c in consumers:
    print("  " + c[0] + "   " + str(c[1]) + " nines     " + str(c[2]) + "s      " + str(c[3]) + " nines      " + str(needs(c)) + " nines")
print("")
print("consumers whose answer equals the published figure : " + str(asked_same) + " of " + str(n))
if asked_same == n:
    print("  every answer came back as the number that was already on the page")
print("")
print("against what each one's own promise implies")
print("  need less than " + str(published) + " nines : " + str(below))
print("  need exactly " + str(published) + "        : " + str(n - below - above))
print("  need more than " + str(published) + "      : " + str(above))
print("  strictest real requirement : " + str(strictest) + " nines")
if strictest > published:
    print("  which is above the target the survey produced, by " + str(strictest - published))
print("")
for c in consumers:
    if needs(c) == strictest:
        print("  the consumer that needs it : " + c[0] + ", which can wait " + str(c[2]) + " seconds")
        print("  it asked for " + str(c[1]) + " nines, the same as everyone, and it is the one")
        print("  the target does not cover")
print("")
cost_by_nines = [0, 40, 120, 300, 900]
print("cost of running at each level")
for k in range(1, 5):
    print("  " + str(k) + " nines : " + str(cost_by_nines[k]))
print("")
print("at the published target of " + str(published) + " : " + str(cost_by_nines[published]))
max_below = 0
for c in consumers:
    if needs(c) < published:
        if needs(c) > max_below:
            max_below = needs(c)
print("the strictest requirement among consumers that need less than the target : " + str(max_below))
if below > 0:
    print("  " + str(below) + " consumers would be inside their own promise at " + str(max_below) + " nines")
    print("  which costs " + str(cost_by_nines[max_below]) + " against " + str(cost_by_nines[published]))
print("")
print("serving the one strict consumer separately")
print("  the other " + str(n - 1) + " at " + str(max_below) + " nines : " + str(cost_by_nines[max_below]))
print("  one path at " + str(strictest) + " nines      : " + str(cost_by_nines[strictest]))
print("  total                       : " + str(cost_by_nines[max_below] + cost_by_nines[strictest]))
print("  one uniform target at " + str(strictest) + "     : " + str(cost_by_nines[strictest]))
if cost_by_nines[max_below] + cost_by_nines[strictest] > cost_by_nines[strictest]:
    print("  splitting costs " + str(cost_by_nines[max_below]) + " more here, so the uniform strict target wins")
    print("  on cost - and it is a different number from the one the survey found")
print("")
print("the question that was asked : what availability do you require")
print("the question that is answerable : how long can you wait, and what do you")
print("  promise your own users")
print("  the second one was answered above, in seconds and in nines, and it")
print("  produced " + str(strictest) + " where the first produced " + str(published))
print("")
print("control - a consumer that publishes nothing and has no retry budget")
print("  what it can derive a requirement from : nothing")
print("  what it will answer                   : the published figure")
print("  for this consumer the survey is not circular by accident, it is circular")
print("  because there is no second source to reach")
print("")
print("Asking the consumers is the right method and the answers were recorded")
print("faithfully. A requirement gathered from people reading your own page is your")
print("own page, and the one consumer it fails is the one that answered like the")
print("others.")
```

## stdout (executed)

```text
consumers : 6, published target : 3 nines

consumer        asked for   can wait   own promise   really needs
  checkout   3 nines     30s      3 nines      3 nines
  search   3 nines     120s      2 nines      2 nines
  reporting   3 nines     3600s      1 nines      1 nines
  mobile app   3 nines     60s      2 nines      2 nines
  partner feed   3 nines     900s      1 nines      1 nines
  fraud check   3 nines     5s      4 nines      4 nines

consumers whose answer equals the published figure : 6 of 6
  every answer came back as the number that was already on the page

against what each one's own promise implies
  need less than 3 nines : 4
  need exactly 3        : 1
  need more than 3      : 1
  strictest real requirement : 4 nines
  which is above the target the survey produced, by 1

  the consumer that needs it : fraud check, which can wait 5 seconds
  it asked for 3 nines, the same as everyone, and it is the one
  the target does not cover

cost of running at each level
  1 nines : 40
  2 nines : 120
  3 nines : 300
  4 nines : 900

at the published target of 3 : 300
the strictest requirement among consumers that need less than the target : 2
  4 consumers would be inside their own promise at 2 nines
  which costs 120 against 300

serving the one strict consumer separately
  the other 5 at 2 nines : 120
  one path at 4 nines      : 900
  total                       : 1020
  one uniform target at 4     : 900
  splitting costs 120 more here, so the uniform strict target wins
  on cost - and it is a different number from the one the survey found

the question that was asked : what availability do you require
the question that is answerable : how long can you wait, and what do you
  promise your own users
  the second one was answered above, in seconds and in nines, and it
  produced 4 where the first produced 3

control - a consumer that publishes nothing and has no retry budget
  what it can derive a requirement from : nothing
  what it will answer                   : the published figure
  for this consumer the survey is not circular by accident, it is circular
  because there is no second source to reach

Asking the consumers is the right method and the answers were recorded
faithfully. A requirement gathered from people reading your own page is your
own page, and the one consumer it fails is the one that answered like the
others.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
