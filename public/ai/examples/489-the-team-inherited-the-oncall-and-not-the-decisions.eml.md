<!-- canonical: efficientnewlanguage.org/ai/examples/489-the-team-inherited-the-oncall-and-not-the-decisions | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 489 — The team inherited the oncall and not the decisions

`the_team_inherited_the_oncall_and_not_the_decisions.eml` - The current team has owned this service for eleven months. Which decisions the last year of pages trace back to is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The current team
# has owned this service for eleven months. Which decisions the last year of
# pages trace back to is computed below.
#
# Handing a service to a new team is right and normal. Someone has to own it,
# the previous team moved on for good reasons, and a service without an owner
# is worse than a service owned by people who did not build it.
#
# What transfers cleanly is the pager. What does not transfer is the set of
# decisions the service is made of - the ones that were argued about, the ones
# that were obvious at the time, and the ones nobody remembers making. The team
# is accountable for the outcomes of all of them.
#
# Each page is attributed to the decision that produced it.

# [incident, decision it traces to, made by, months before handover, was it written down]
[["i1", "sync writes to the audit log", "previous team", 26, 1], ["i2", "no backpressure on the queue", "previous team", 31, 0], ["i3", "a config default", "the library author", 0, 0], ["i4", "sync writes to the audit log", "previous team", 26, 1], ["i5", "the retry count", "current team", 0 - 4, 1], ["i6", "no backpressure on the queue", "previous team", 31, 0], ["i7", "the shared connection pool", "previous team", 18, 1], ["i8", "no backpressure on the queue", "previous team", 31, 0], ["i9", "the retry count", "current team", 0 - 4, 1]] => pages

len(pages) => n

0 => theirs
0 => ours
0 => nobody
for p in pages:
    if p[2] == "current team":
        ours + 1 => ours
    elif p[2] == "previous team":
        theirs + 1 => theirs
    else:
        nobody + 1 => nobody

"pages in the last year : " + str(n) ^0
"  tracing to a decision the current team made  : " + str(ours) ^0
"  tracing to a decision the previous team made : " + str(theirs) ^0
"  tracing to a decision nobody here made       : " + str(nobody) ^0
"" ^0

[] => decisions
for p in pages:
    if not (p[1] in decisions):
        decisions + [p[1]] => decisions
"distinct decisions behind " + str(n) + " pages : " + str(len(decisions)) ^0
for d in decisions:
    0 => c
    0 => written
    0 => age
    "" => who
    for p in pages:
        if p[1] == d:
            c + 1 => c
            written + p[4] => written
            p[3] => age
            p[2] => who
    "" => rec
    if written > 0:
        rec + "written down" => rec
    else:
        rec + "not written down" => rec
    "  " + d + " : " + str(c) + " page(s), by " + who + ", " + rec ^0
"" ^0

# ---- the ones with no record ----

0 => unrecorded_pages
for p in pages:
    if p[4] == 0:
        unrecorded_pages + 1 => unrecorded_pages
"pages from decisions with no written record : " + str(unrecorded_pages) + " of " + str(n) ^0
if unrecorded_pages > 0:
    "  for these the team can see the consequence and not the reasoning, so" ^0
    "  changing them means re-deriving an argument that was already had once" ^0
"" ^0

# ---- the largest single source ----

"" => worst
0 => worst_count
for d in decisions:
    0 => c
    for p in pages:
        if p[1] == d:
            c + 1 => c
    if c > worst_count:
        c => worst_count
        d => worst
"the single decision behind the most pages : " + worst + ", " + str(worst_count) ^0
0 => worst_age
"" => worst_who
0 => worst_written
for p in pages:
    if p[1] == worst:
        p[3] => worst_age
        p[2] => worst_who
        worst_written + p[4] => worst_written
"  made " + str(worst_age) + " months before the handover, by the " + worst_who ^0
if worst_written == 0:
    "  and it is one of the ones with no written record" ^0
"" ^0

# ---- what the team can and cannot act on ----

"what is actionable, by category" ^0
"  own decisions, written down     : " + str(ours) + " pages, changeable this week" ^0
"  inherited, written down         : the reasoning is available to argue with" ^0
"  inherited, not written down     : " + str(unrecorded_pages) + " pages, and the argument has to be rebuilt" ^0
"  the third category is the expensive one, and it is the largest" ^0
"" ^0

# ---- how the accountability reads from outside ----

"the service's page count, as it appears in a review" ^0
"  pages : " + str(n) + ", owner : the current team" ^0
"  what the number is a property of : eleven months of this team plus" ^0
"  several years of decisions made before them" ^0
if ours < theirs:
    "  " + str(theirs) + " of " + str(n) + " are the second kind, and the review has one column" ^0
"" ^0

# ---- the control: a service the team built ----
#
# Where the owning team made the decisions, the page count and the decisions
# are properties of the same group and the attribution is trivial.

"control - a service this team wrote from scratch" ^0
"  pages tracing to their own decisions : all of them" ^0
"  decisions with no written record     : still possible, but the people who" ^0
"  made them are in the room" ^0
"  the record matters less when the memory is present, which is exactly why" ^0
"  it does not get written" ^0
"" ^0

"Somebody has to own the service and this team owning it is better than" ^0
"nobody. The pager transferred and the reasoning did not, and the page count" ^0
"is attributed to whoever is holding it now." ^0
```

## Python (deterministic transpilation)

```python
pages = [["i1", "sync writes to the audit log", "previous team", 26, 1], ["i2", "no backpressure on the queue", "previous team", 31, 0], ["i3", "a config default", "the library author", 0, 0], ["i4", "sync writes to the audit log", "previous team", 26, 1], ["i5", "the retry count", "current team", 0 - 4, 1], ["i6", "no backpressure on the queue", "previous team", 31, 0], ["i7", "the shared connection pool", "previous team", 18, 1], ["i8", "no backpressure on the queue", "previous team", 31, 0], ["i9", "the retry count", "current team", 0 - 4, 1]]
n = len(pages)
theirs = 0
ours = 0
nobody = 0
for p in pages:
    if p[2] == "current team":
        ours = ours + 1
    elif p[2] == "previous team":
        theirs = theirs + 1
    else:
        nobody = nobody + 1
print("pages in the last year : " + str(n))
print("  tracing to a decision the current team made  : " + str(ours))
print("  tracing to a decision the previous team made : " + str(theirs))
print("  tracing to a decision nobody here made       : " + str(nobody))
print("")
decisions = []
for p in pages:
    if not p[1] in decisions:
        decisions = decisions + [p[1]]
print("distinct decisions behind " + str(n) + " pages : " + str(len(decisions)))
for d in decisions:
    c = 0
    written = 0
    age = 0
    who = ""
    for p in pages:
        if p[1] == d:
            c = c + 1
            written = written + p[4]
            age = p[3]
            who = p[2]
    rec = ""
    if written > 0:
        rec = rec + "written down"
    else:
        rec = rec + "not written down"
    print("  " + d + " : " + str(c) + " page(s), by " + who + ", " + rec)
print("")
unrecorded_pages = 0
for p in pages:
    if p[4] == 0:
        unrecorded_pages = unrecorded_pages + 1
print("pages from decisions with no written record : " + str(unrecorded_pages) + " of " + str(n))
if unrecorded_pages > 0:
    print("  for these the team can see the consequence and not the reasoning, so")
    print("  changing them means re-deriving an argument that was already had once")
print("")
worst = ""
worst_count = 0
for d in decisions:
    c = 0
    for p in pages:
        if p[1] == d:
            c = c + 1
    if c > worst_count:
        worst_count = c
        worst = d
print("the single decision behind the most pages : " + worst + ", " + str(worst_count))
worst_age = 0
worst_who = ""
worst_written = 0
for p in pages:
    if p[1] == worst:
        worst_age = p[3]
        worst_who = p[2]
        worst_written = worst_written + p[4]
print("  made " + str(worst_age) + " months before the handover, by the " + worst_who)
if worst_written == 0:
    print("  and it is one of the ones with no written record")
print("")
print("what is actionable, by category")
print("  own decisions, written down     : " + str(ours) + " pages, changeable this week")
print("  inherited, written down         : the reasoning is available to argue with")
print("  inherited, not written down     : " + str(unrecorded_pages) + " pages, and the argument has to be rebuilt")
print("  the third category is the expensive one, and it is the largest")
print("")
print("the service's page count, as it appears in a review")
print("  pages : " + str(n) + ", owner : the current team")
print("  what the number is a property of : eleven months of this team plus")
print("  several years of decisions made before them")
if ours < theirs:
    print("  " + str(theirs) + " of " + str(n) + " are the second kind, and the review has one column")
print("")
print("control - a service this team wrote from scratch")
print("  pages tracing to their own decisions : all of them")
print("  decisions with no written record     : still possible, but the people who")
print("  made them are in the room")
print("  the record matters less when the memory is present, which is exactly why")
print("  it does not get written")
print("")
print("Somebody has to own the service and this team owning it is better than")
print("nobody. The pager transferred and the reasoning did not, and the page count")
print("is attributed to whoever is holding it now.")
```

## stdout (executed)

```text
pages in the last year : 9
  tracing to a decision the current team made  : 2
  tracing to a decision the previous team made : 6
  tracing to a decision nobody here made       : 1

distinct decisions behind 9 pages : 5
  sync writes to the audit log : 2 page(s), by previous team, written down
  no backpressure on the queue : 3 page(s), by previous team, not written down
  a config default : 1 page(s), by the library author, not written down
  the retry count : 2 page(s), by current team, written down
  the shared connection pool : 1 page(s), by previous team, written down

pages from decisions with no written record : 4 of 9
  for these the team can see the consequence and not the reasoning, so
  changing them means re-deriving an argument that was already had once

the single decision behind the most pages : no backpressure on the queue, 3
  made 31 months before the handover, by the previous team
  and it is one of the ones with no written record

what is actionable, by category
  own decisions, written down     : 2 pages, changeable this week
  inherited, written down         : the reasoning is available to argue with
  inherited, not written down     : 4 pages, and the argument has to be rebuilt
  the third category is the expensive one, and it is the largest

the service's page count, as it appears in a review
  pages : 9, owner : the current team
  what the number is a property of : eleven months of this team plus
  several years of decisions made before them
  6 of 9 are the second kind, and the review has one column

control - a service this team wrote from scratch
  pages tracing to their own decisions : all of them
  decisions with no written record     : still possible, but the people who
  made them are in the room
  the record matters less when the memory is present, which is exactly why
  it does not get written

Somebody has to own the service and this team owning it is better than
nobody. The pager transferred and the reasoning did not, and the page count
is attributed to whoever is holding it now.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
