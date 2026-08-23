<!-- canonical: efficientnewlanguage.org/ai/examples/517-the-objections-stopped-and-so-did-the-objectors | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 517 — The objections stopped and so did the objectors

`the_objections_stopped_and_so_did_the_objectors.eml` - A design review series records fewer objections every quarter. Where the objections went and where the objectors went are computed separately below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A design review
# series records fewer objections every quarter. Where the objections went and
# where the objectors went are computed separately below.
#
# The review process improved and the improvements were real. Templates were
# added, proposals arrive with a written problem statement, and the authors
# have got much better at pre-socialising a design before the meeting. Any of
# those would reduce objections on its own, and all three happened.
#
# An objection is raised by a person who is present, and the set of people
# present is not constant. A falling objection rate is consistent with better
# designs and it is equally consistent with a smaller set of people willing to
# object, and the two are distinguished by counting attendance rather than by
# counting objections.
#
# Both are counted below.

# [quarter, proposals, objections raised, invited, attended, distinct people who objected]
[["Q1", 18, 41, 22, 19, 11], ["Q2", 20, 33, 22, 17, 9], ["Q3", 19, 22, 23, 14, 6], ["Q4", 21, 14, 24, 12, 4], ["Q5", 22, 9, 25, 11, 3], ["Q6", 20, 5, 26, 9, 2]] => quarters

len(quarters) => n

"quarter   proposals   objections   invited   attended   distinct objectors" ^0
for q in quarters:
    "  " + q[0] + "        " + str(q[1]) + "          " + str(q[2]) + "           " + str(q[3]) + "        " + str(q[4]) + "         " + str(q[5]) ^0
"" ^0

quarters[0] => first
quarters[n - 1] => last
"objections per proposal" ^0
for q in quarters:
    "  " + q[0] + " : " + str(int(q[2] * 100 / q[1])) + " per 100 proposals" ^0
"  " + first[0] + " to " + last[0] + " : " + str(int(first[2] * 100 / first[1])) + " -> " + str(int(last[2] * 100 / last[1])) ^0
"  a fall of " + str(int((first[2] * 100 / first[1] - last[2] * 100 / last[1]) * 100 / (first[2] * 100 / first[1]))) + "%" ^0
"" ^0

# ---- who was in the room ----

"attendance against invitation" ^0
for q in quarters:
    "  " + q[0] + " : " + str(q[4]) + " of " + str(q[3]) + " invited, " + str(int(q[4] * 100 / q[3])) + "%" ^0
"  " + first[0] + " : " + str(int(first[4] * 100 / first[3])) + "%, " + last[0] + " : " + str(int(last[4] * 100 / last[3])) + "%" ^0
if last[4] < first[4]:
    "  the invitation list grew by " + str(last[3] - first[3]) + " and the room shrank by " + str(first[4] - last[4]) ^0
"" ^0

# ---- objections per person who was actually there ----

"objections per attendee, which holds the room size constant" ^0
for q in quarters:
    "  " + q[0] + " : " + str(int(q[2] * 100 / q[4])) + " per 100 attendees" ^0
int(first[2] * 100 / first[4]) => rate_first
int(last[2] * 100 / last[4]) => rate_last
"  " + first[0] + " : " + str(rate_first) + ", " + last[0] + " : " + str(rate_last) ^0
"  fall : " + str(int((rate_first - rate_last) * 100 / rate_first)) + "%" ^0
"  the per-proposal fall was " + str(int((first[2] * 100 / first[1] - last[2] * 100 / last[1]) * 100 / (first[2] * 100 / first[1]))) + "%, so most of it survives the correction" ^0
"  and some of it does not" ^0
"" ^0

# ---- the objectors themselves ----

"how many different people raised anything" ^0
for q in quarters:
    "  " + q[0] + " : " + str(q[5]) + " people, " + str(int(q[5] * 100 / q[4])) + "% of the room" ^0
"  " + first[0] + " : " + str(first[5]) + " of " + str(first[4]) + " attendees" ^0
"  " + last[0] + " : " + str(last[5]) + " of " + str(last[4]) + " attendees" ^0
"  the number of people who object at all has fallen by " + str(int((first[5] - last[5]) * 100 / first[5])) + "%" ^0
"" ^0

# ---- where the objectors went ----

# [person, quarters they objected in, still attending at Q6, where they are now]
[["a", 6, "yes", "still here"], ["b", 5, "no", "moved to another team"], ["c", 4, "no", "left the company"], ["d", 4, "no", "stopped attending"], ["e", 3, "no", "stopped attending"], ["f", 3, "no", "moved to another team"], ["g", 2, "yes", "still here"], ["h", 2, "no", "left the company"], ["i", 1, "no", "stopped attending"], ["j", 1, "no", "stopped attending"], ["k", 1, "no", "stopped attending"]] => objectors

len(objectors) => m
0 => remaining
0 => quiet
0 => gone
for p in objectors:
    if p[2] == "yes":
        remaining + 1 => remaining
    if p[3] == "stopped attending":
        quiet + 1 => quiet
    if p[3] == "left the company":
        gone + 1 => gone
"the " + str(m) + " people who ever raised an objection in this series" ^0
"  still attending at " + last[0] + " : " + str(remaining) ^0
"  stopped attending, still at the company : " + str(quiet) ^0
"  left the company : " + str(gone) ^0
"  moved to another team : " + str(m - remaining - quiet - gone) ^0
"  so " + str(m - remaining) + " of " + str(m) + " are not in the room any more" ^0
"" ^0

# ---- the two explanations, and what separates them ----

"what a falling objection count is consistent with" ^0
"  the designs got better       : consistent" ^0
"  the room got smaller         : consistent" ^0
"  the people who object left   : consistent" ^0
"  all three are happening here, and the objection count alone cannot" ^0
"  apportion them" ^0
"" ^0

"what would separate them" ^0
"  ask a departed objector to review a current proposal" ^0
"  proposals reviewed that way : 0" ^0
"  so the measurement that would distinguish the explanations has not been" ^0
"  taken, and the one that has been taken cannot" ^0
"" ^0

# ---- the control: a review series with stable attendance ----
#
# Where the same people keep attending, a falling objection rate is a fact
# about the proposals rather than about the roster.

[["Q1", 12, 20, 12, 12, 7], ["Q6", 13, 8, 12, 12, 6]] => stable
"control - a second series where attendance did not move" ^0
for s in stable:
    "  " + s[0] + " : " + str(s[2]) + " objections, " + str(s[4]) + " of " + str(s[3]) + " attending, " + str(s[5]) + " objectors" ^0
stable[0] => s_first
stable[1] => s_last
if s_first[4] == s_last[4]:
    "  the room is the same size and " + str(s_last[5]) + " of the " + str(s_first[5]) + " objectors are still in it" ^0
    "  objections fell " + str(int((s_first[2] - s_last[2]) * 100 / s_first[2])) + "% with the roster held constant, which is the version of" ^0
    "  this number that means what it appears to mean" ^0
"" ^0

"The templates and the pre-socialising are real improvements and objections" ^0
"really are lower. An objection needs somebody present who will raise it, so" ^0
"the count also measures the roster, and here the roster changed." ^0
```

## Python (deterministic transpilation)

```python
quarters = [["Q1", 18, 41, 22, 19, 11], ["Q2", 20, 33, 22, 17, 9], ["Q3", 19, 22, 23, 14, 6], ["Q4", 21, 14, 24, 12, 4], ["Q5", 22, 9, 25, 11, 3], ["Q6", 20, 5, 26, 9, 2]]
n = len(quarters)
print("quarter   proposals   objections   invited   attended   distinct objectors")
for q in quarters:
    print("  " + q[0] + "        " + str(q[1]) + "          " + str(q[2]) + "           " + str(q[3]) + "        " + str(q[4]) + "         " + str(q[5]))
print("")
first = quarters[0]
last = quarters[n - 1]
print("objections per proposal")
for q in quarters:
    print("  " + q[0] + " : " + str(int(q[2] * 100 / q[1])) + " per 100 proposals")
print("  " + first[0] + " to " + last[0] + " : " + str(int(first[2] * 100 / first[1])) + " -> " + str(int(last[2] * 100 / last[1])))
print("  a fall of " + str(int((first[2] * 100 / first[1] - last[2] * 100 / last[1]) * 100 / (first[2] * 100 / first[1]))) + "%")
print("")
print("attendance against invitation")
for q in quarters:
    print("  " + q[0] + " : " + str(q[4]) + " of " + str(q[3]) + " invited, " + str(int(q[4] * 100 / q[3])) + "%")
print("  " + first[0] + " : " + str(int(first[4] * 100 / first[3])) + "%, " + last[0] + " : " + str(int(last[4] * 100 / last[3])) + "%")
if last[4] < first[4]:
    print("  the invitation list grew by " + str(last[3] - first[3]) + " and the room shrank by " + str(first[4] - last[4]))
print("")
print("objections per attendee, which holds the room size constant")
for q in quarters:
    print("  " + q[0] + " : " + str(int(q[2] * 100 / q[4])) + " per 100 attendees")
rate_first = int(first[2] * 100 / first[4])
rate_last = int(last[2] * 100 / last[4])
print("  " + first[0] + " : " + str(rate_first) + ", " + last[0] + " : " + str(rate_last))
print("  fall : " + str(int((rate_first - rate_last) * 100 / rate_first)) + "%")
print("  the per-proposal fall was " + str(int((first[2] * 100 / first[1] - last[2] * 100 / last[1]) * 100 / (first[2] * 100 / first[1]))) + "%, so most of it survives the correction")
print("  and some of it does not")
print("")
print("how many different people raised anything")
for q in quarters:
    print("  " + q[0] + " : " + str(q[5]) + " people, " + str(int(q[5] * 100 / q[4])) + "% of the room")
print("  " + first[0] + " : " + str(first[5]) + " of " + str(first[4]) + " attendees")
print("  " + last[0] + " : " + str(last[5]) + " of " + str(last[4]) + " attendees")
print("  the number of people who object at all has fallen by " + str(int((first[5] - last[5]) * 100 / first[5])) + "%")
print("")
objectors = [["a", 6, "yes", "still here"], ["b", 5, "no", "moved to another team"], ["c", 4, "no", "left the company"], ["d", 4, "no", "stopped attending"], ["e", 3, "no", "stopped attending"], ["f", 3, "no", "moved to another team"], ["g", 2, "yes", "still here"], ["h", 2, "no", "left the company"], ["i", 1, "no", "stopped attending"], ["j", 1, "no", "stopped attending"], ["k", 1, "no", "stopped attending"]]
m = len(objectors)
remaining = 0
quiet = 0
gone = 0
for p in objectors:
    if p[2] == "yes":
        remaining = remaining + 1
    if p[3] == "stopped attending":
        quiet = quiet + 1
    if p[3] == "left the company":
        gone = gone + 1
print("the " + str(m) + " people who ever raised an objection in this series")
print("  still attending at " + last[0] + " : " + str(remaining))
print("  stopped attending, still at the company : " + str(quiet))
print("  left the company : " + str(gone))
print("  moved to another team : " + str(m - remaining - quiet - gone))
print("  so " + str(m - remaining) + " of " + str(m) + " are not in the room any more")
print("")
print("what a falling objection count is consistent with")
print("  the designs got better       : consistent")
print("  the room got smaller         : consistent")
print("  the people who object left   : consistent")
print("  all three are happening here, and the objection count alone cannot")
print("  apportion them")
print("")
print("what would separate them")
print("  ask a departed objector to review a current proposal")
print("  proposals reviewed that way : 0")
print("  so the measurement that would distinguish the explanations has not been")
print("  taken, and the one that has been taken cannot")
print("")
stable = [["Q1", 12, 20, 12, 12, 7], ["Q6", 13, 8, 12, 12, 6]]
print("control - a second series where attendance did not move")
for s in stable:
    print("  " + s[0] + " : " + str(s[2]) + " objections, " + str(s[4]) + " of " + str(s[3]) + " attending, " + str(s[5]) + " objectors")
s_first = stable[0]
s_last = stable[1]
if s_first[4] == s_last[4]:
    print("  the room is the same size and " + str(s_last[5]) + " of the " + str(s_first[5]) + " objectors are still in it")
    print("  objections fell " + str(int((s_first[2] - s_last[2]) * 100 / s_first[2])) + "% with the roster held constant, which is the version of")
    print("  this number that means what it appears to mean")
print("")
print("The templates and the pre-socialising are real improvements and objections")
print("really are lower. An objection needs somebody present who will raise it, so")
print("the count also measures the roster, and here the roster changed.")
```

## stdout (executed)

```text
quarter   proposals   objections   invited   attended   distinct objectors
  Q1        18          41           22        19         11
  Q2        20          33           22        17         9
  Q3        19          22           23        14         6
  Q4        21          14           24        12         4
  Q5        22          9           25        11         3
  Q6        20          5           26        9         2

objections per proposal
  Q1 : 227 per 100 proposals
  Q2 : 165 per 100 proposals
  Q3 : 115 per 100 proposals
  Q4 : 66 per 100 proposals
  Q5 : 40 per 100 proposals
  Q6 : 25 per 100 proposals
  Q1 to Q6 : 227 -> 25
  a fall of 89%

attendance against invitation
  Q1 : 19 of 22 invited, 86%
  Q2 : 17 of 22 invited, 77%
  Q3 : 14 of 23 invited, 60%
  Q4 : 12 of 24 invited, 50%
  Q5 : 11 of 25 invited, 44%
  Q6 : 9 of 26 invited, 34%
  Q1 : 86%, Q6 : 34%
  the invitation list grew by 4 and the room shrank by 10

objections per attendee, which holds the room size constant
  Q1 : 215 per 100 attendees
  Q2 : 194 per 100 attendees
  Q3 : 157 per 100 attendees
  Q4 : 116 per 100 attendees
  Q5 : 81 per 100 attendees
  Q6 : 55 per 100 attendees
  Q1 : 215, Q6 : 55
  fall : 74%
  the per-proposal fall was 89%, so most of it survives the correction
  and some of it does not

how many different people raised anything
  Q1 : 11 people, 57% of the room
  Q2 : 9 people, 52% of the room
  Q3 : 6 people, 42% of the room
  Q4 : 4 people, 33% of the room
  Q5 : 3 people, 27% of the room
  Q6 : 2 people, 22% of the room
  Q1 : 11 of 19 attendees
  Q6 : 2 of 9 attendees
  the number of people who object at all has fallen by 81%

the 11 people who ever raised an objection in this series
  still attending at Q6 : 2
  stopped attending, still at the company : 5
  left the company : 2
  moved to another team : 2
  so 9 of 11 are not in the room any more

what a falling objection count is consistent with
  the designs got better       : consistent
  the room got smaller         : consistent
  the people who object left   : consistent
  all three are happening here, and the objection count alone cannot
  apportion them

what would separate them
  ask a departed objector to review a current proposal
  proposals reviewed that way : 0
  so the measurement that would distinguish the explanations has not been
  taken, and the one that has been taken cannot

control - a second series where attendance did not move
  Q1 : 20 objections, 12 of 12 attending, 7 objectors
  Q6 : 8 objections, 12 of 12 attending, 6 objectors
  the room is the same size and 6 of the 7 objectors are still in it
  objections fell 60% with the roster held constant, which is the version of
  this number that means what it appears to mean

The templates and the pre-socialising are real improvements and objections
really are lower. An objection needs somebody present who will raise it, so
the count also measures the roster, and here the roster changed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
