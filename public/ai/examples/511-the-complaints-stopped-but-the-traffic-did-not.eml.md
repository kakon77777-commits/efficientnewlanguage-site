<!-- canonical: efficientnewlanguage.org/ai/examples/511-the-complaints-stopped-but-the-traffic-did-not | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 511 — The complaints stopped but the traffic did not

`the_complaints_stopped_but_the_traffic_did_not.eml` - A deprecated API stopped generating complaints and was scheduled for removal on that basis. Complaints and calls are counted separately below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A deprecated API
# stopped generating complaints and was scheduled for removal on that basis.
# Complaints and calls are counted separately below.
#
# The deprecation was handled properly. Eighteen months of notice, a banner in
# the docs, a deprecation header on every response, two emails to registered
# integrators and a migration guide with worked examples. The team did more
# than most teams do, and the complaint rate really did fall to nothing.
#
# A complaint requires a caller who notices, knows where to complain, and
# expects it to help. Traffic requires only a caller. The two curves answer
# different questions, and only one of them was consulted before scheduling
# the removal.
#
# Both are counted, per quarter, below.

# [quarter, calls per day, complaints, registered integrators who replied, tickets closed as wontfix]
[["Q1", 41000, 34, 12, 2], ["Q2", 38000, 21, 9, 6], ["Q3", 36000, 11, 5, 8], ["Q4", 34000, 4, 2, 4], ["Q5", 33000, 1, 1, 1], ["Q6", 32000, 0, 0, 0]] => quarters

len(quarters) => n
quarters[0] => first
quarters[n - 1] => last

"quarter   calls/day   complaints   integrators replying   closed wontfix" ^0
for q in quarters:
    "  " + q[0] + "        " + str(q[1]) + "        " + str(q[2]) + "            " + str(q[3]) + "                     " + str(q[4]) ^0
"" ^0

"complaints : " + str(first[2]) + " -> " + str(last[2]) ^0
if last[2] == 0:
    "  a fall of 100%, and the removal was scheduled on this line" ^0
"calls per day : " + str(first[1]) + " -> " + str(last[1]) ^0
"  a fall of " + str(int((first[1] - last[1]) * 100 / first[1])) + "%" ^0
"" ^0

# ---- the two curves side by side ----

"the two lines, indexed to " + first[0] + " = 100" ^0
for q in quarters:
    "" => cs
    if first[2] > 0:
        str(int(q[2] * 100 / first[2])) => cs
    "  " + q[0] + " : calls " + str(int(q[1] * 100 / first[1])) + ", complaints " + cs ^0
"  one of these fell by " + str(100 - int(last[1] * 100 / first[1])) + " points and the other by 100" ^0
"" ^0

# ---- complaints per call ----

"complaints per million calls" ^0
for q in quarters:
    "  " + q[0] + " : " + str(int(q[2] * 1000000 / q[1])) + " per million" ^0
"  the rate falls as well as the count, so this is not only a traffic effect" ^0
"" ^0

# ---- what happened to the people who complained ----

# [integrator, complained in, migrated?, still calling the old API?, calls per day now]
[["alpha", 3, "yes", "no", 0], ["bravo", 2, "yes", "no", 0], ["charlie", 4, "no", "yes", 9000], ["delta", 1, "no", "yes", 7000], ["echo", 2, "no", "yes", 6000], ["foxtrot", 1, "no", "yes", 4000], ["golf", 1, "yes", "no", 0], ["hotel", 2, "no", "yes", 3000]] => integrators

len(integrators) => m
0 => migrated
0 => still_calling
0 => still_volume
for i in integrators:
    if i[2] == "yes":
        migrated + 1 => migrated
    if i[3] == "yes":
        still_calling + 1 => still_calling
        still_volume + i[4] => still_volume
"the " + str(m) + " integrators who ever complained" ^0
"  migrated               : " + str(migrated) ^0
"  still calling the old API : " + str(still_calling) ^0
"  their combined traffic : " + str(still_volume) + " calls a day" ^0
"  which is " + str(int(still_volume * 100 / last[1])) + "% of what the old API still serves" ^0
"  every one of them stopped complaining, and " + str(still_calling) + " of them stopped only" ^0
"  complaining" ^0
"" ^0

# ---- what closing a ticket wontfix teaches a caller ----

0 => wontfix_total
for q in quarters:
    wontfix_total + q[4] => wontfix_total
0 => complaints_total
for q in quarters:
    complaints_total + q[2] => complaints_total
"tickets closed as wontfix : " + str(wontfix_total) ^0
"  against " + str(complaints_total) + " complaints in total, so " + str(int(wontfix_total * 100 / complaints_total)) + "% were closed that way" ^0
"  a caller who complains twice and is told twice that the deprecation" ^0
"  stands has learned what complaining does, and the third time is not" ^0
"  recorded anywhere" ^0
"" ^0

# ---- what the removal would break ----

"the removal, scored on each line" ^0
"  on the complaint line : " + str(last[2]) + " parties affected" ^0
"  on the traffic line   : " + str(last[1]) + " calls a day" ^0
"  integrators still calling : " + str(still_calling) ^0
"  the two answers differ by everything, and they are answers to different" ^0
"  questions" ^0
"" ^0

# ---- the measurement that was available ----

"what could have been measured instead" ^0
"  distinct callers on the old API in " + last[0] + " : available from the access log" ^0
"  calls per caller                      : available from the access log" ^0
"  whether a caller has a migrated twin  : available from both logs" ^0
"  cost of taking those measurements     : one query" ^0
"  the complaint count was used because it was the number already on the" ^0
"  dashboard, not because it was the one that answers the question" ^0
"" ^0

# ---- the control: an API whose traffic really did go to zero ----
#
# Where the calls stop as well as the complaints, the two lines agree and
# either one supports the removal.

[["old thumbnails", 12000, 9], ["old thumbnails", 0, 0]] => gone
"control - a second deprecation" ^0
"  before : " + str(gone[0][1]) + " calls a day, " + str(gone[0][2]) + " complaints" ^0
"  after  : " + str(gone[1][1]) + " calls a day, " + str(gone[1][2]) + " complaints" ^0
if gone[1][1] == 0:
    "  here the traffic went to zero too, so the silence is the same fact as" ^0
    "  the absence, and removing it breaks nobody" ^0
"" ^0

"The deprecation was run properly and the complaints really did stop." ^0
"Complaining takes a caller who expects it to work, and calling takes only a" ^0
"caller, so " + str(last[1]) + " calls a day are still arriving from people who gave up." ^0
```

## Python (deterministic transpilation)

```python
quarters = [["Q1", 41000, 34, 12, 2], ["Q2", 38000, 21, 9, 6], ["Q3", 36000, 11, 5, 8], ["Q4", 34000, 4, 2, 4], ["Q5", 33000, 1, 1, 1], ["Q6", 32000, 0, 0, 0]]
n = len(quarters)
first = quarters[0]
last = quarters[n - 1]
print("quarter   calls/day   complaints   integrators replying   closed wontfix")
for q in quarters:
    print("  " + q[0] + "        " + str(q[1]) + "        " + str(q[2]) + "            " + str(q[3]) + "                     " + str(q[4]))
print("")
print("complaints : " + str(first[2]) + " -> " + str(last[2]))
if last[2] == 0:
    print("  a fall of 100%, and the removal was scheduled on this line")
print("calls per day : " + str(first[1]) + " -> " + str(last[1]))
print("  a fall of " + str(int((first[1] - last[1]) * 100 / first[1])) + "%")
print("")
print("the two lines, indexed to " + first[0] + " = 100")
for q in quarters:
    cs = ""
    if first[2] > 0:
        cs = str(int(q[2] * 100 / first[2]))
    print("  " + q[0] + " : calls " + str(int(q[1] * 100 / first[1])) + ", complaints " + cs)
print("  one of these fell by " + str(100 - int(last[1] * 100 / first[1])) + " points and the other by 100")
print("")
print("complaints per million calls")
for q in quarters:
    print("  " + q[0] + " : " + str(int(q[2] * 1000000 / q[1])) + " per million")
print("  the rate falls as well as the count, so this is not only a traffic effect")
print("")
integrators = [["alpha", 3, "yes", "no", 0], ["bravo", 2, "yes", "no", 0], ["charlie", 4, "no", "yes", 9000], ["delta", 1, "no", "yes", 7000], ["echo", 2, "no", "yes", 6000], ["foxtrot", 1, "no", "yes", 4000], ["golf", 1, "yes", "no", 0], ["hotel", 2, "no", "yes", 3000]]
m = len(integrators)
migrated = 0
still_calling = 0
still_volume = 0
for i in integrators:
    if i[2] == "yes":
        migrated = migrated + 1
    if i[3] == "yes":
        still_calling = still_calling + 1
        still_volume = still_volume + i[4]
print("the " + str(m) + " integrators who ever complained")
print("  migrated               : " + str(migrated))
print("  still calling the old API : " + str(still_calling))
print("  their combined traffic : " + str(still_volume) + " calls a day")
print("  which is " + str(int(still_volume * 100 / last[1])) + "% of what the old API still serves")
print("  every one of them stopped complaining, and " + str(still_calling) + " of them stopped only")
print("  complaining")
print("")
wontfix_total = 0
for q in quarters:
    wontfix_total = wontfix_total + q[4]
complaints_total = 0
for q in quarters:
    complaints_total = complaints_total + q[2]
print("tickets closed as wontfix : " + str(wontfix_total))
print("  against " + str(complaints_total) + " complaints in total, so " + str(int(wontfix_total * 100 / complaints_total)) + "% were closed that way")
print("  a caller who complains twice and is told twice that the deprecation")
print("  stands has learned what complaining does, and the third time is not")
print("  recorded anywhere")
print("")
print("the removal, scored on each line")
print("  on the complaint line : " + str(last[2]) + " parties affected")
print("  on the traffic line   : " + str(last[1]) + " calls a day")
print("  integrators still calling : " + str(still_calling))
print("  the two answers differ by everything, and they are answers to different")
print("  questions")
print("")
print("what could have been measured instead")
print("  distinct callers on the old API in " + last[0] + " : available from the access log")
print("  calls per caller                      : available from the access log")
print("  whether a caller has a migrated twin  : available from both logs")
print("  cost of taking those measurements     : one query")
print("  the complaint count was used because it was the number already on the")
print("  dashboard, not because it was the one that answers the question")
print("")
gone = [["old thumbnails", 12000, 9], ["old thumbnails", 0, 0]]
print("control - a second deprecation")
print("  before : " + str(gone[0][1]) + " calls a day, " + str(gone[0][2]) + " complaints")
print("  after  : " + str(gone[1][1]) + " calls a day, " + str(gone[1][2]) + " complaints")
if gone[1][1] == 0:
    print("  here the traffic went to zero too, so the silence is the same fact as")
    print("  the absence, and removing it breaks nobody")
print("")
print("The deprecation was run properly and the complaints really did stop.")
print("Complaining takes a caller who expects it to work, and calling takes only a")
print("caller, so " + str(last[1]) + " calls a day are still arriving from people who gave up.")
```

## stdout (executed)

```text
quarter   calls/day   complaints   integrators replying   closed wontfix
  Q1        41000        34            12                     2
  Q2        38000        21            9                     6
  Q3        36000        11            5                     8
  Q4        34000        4            2                     4
  Q5        33000        1            1                     1
  Q6        32000        0            0                     0

complaints : 34 -> 0
  a fall of 100%, and the removal was scheduled on this line
calls per day : 41000 -> 32000
  a fall of 21%

the two lines, indexed to Q1 = 100
  Q1 : calls 100, complaints 100
  Q2 : calls 92, complaints 61
  Q3 : calls 87, complaints 32
  Q4 : calls 82, complaints 11
  Q5 : calls 80, complaints 2
  Q6 : calls 78, complaints 0
  one of these fell by 22 points and the other by 100

complaints per million calls
  Q1 : 829 per million
  Q2 : 552 per million
  Q3 : 305 per million
  Q4 : 117 per million
  Q5 : 30 per million
  Q6 : 0 per million
  the rate falls as well as the count, so this is not only a traffic effect

the 8 integrators who ever complained
  migrated               : 3
  still calling the old API : 5
  their combined traffic : 29000 calls a day
  which is 90% of what the old API still serves
  every one of them stopped complaining, and 5 of them stopped only
  complaining

tickets closed as wontfix : 21
  against 71 complaints in total, so 29% were closed that way
  a caller who complains twice and is told twice that the deprecation
  stands has learned what complaining does, and the third time is not
  recorded anywhere

the removal, scored on each line
  on the complaint line : 0 parties affected
  on the traffic line   : 32000 calls a day
  integrators still calling : 5
  the two answers differ by everything, and they are answers to different
  questions

what could have been measured instead
  distinct callers on the old API in Q6 : available from the access log
  calls per caller                      : available from the access log
  whether a caller has a migrated twin  : available from both logs
  cost of taking those measurements     : one query
  the complaint count was used because it was the number already on the
  dashboard, not because it was the one that answers the question

control - a second deprecation
  before : 12000 calls a day, 9 complaints
  after  : 0 calls a day, 0 complaints
  here the traffic went to zero too, so the silence is the same fact as
  the absence, and removing it breaks nobody

The deprecation was run properly and the complaints really did stop.
Complaining takes a caller who expects it to work, and calling takes only a
caller, so 32000 calls a day are still arriving from people who gave up.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
