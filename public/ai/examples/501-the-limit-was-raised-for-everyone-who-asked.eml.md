<!-- canonical: efficientnewlanguage.org/ai/examples/501-the-limit-was-raised-for-everyone-who-asked | ai_layer_version: 0.1.0 | updated: 2026-08-22 -->

# Example 501 — The limit was raised for everyone who asked

`the_limit_was_raised_for_everyone_who_asked.eml` - The default rate limit has not moved in three years. Which callers are still on it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The default rate
# limit has not moved in three years. Which callers are still on it is computed
# below.
#
# Raising it on request is the right process. Each raise was justified with real
# traffic, approved by someone who checked, and none of them has caused a
# problem. Handing everybody a higher limit by default would have cost capacity
# for callers who do not need it.
#
# The default is what a caller gets by not asking, and it was set for the
# traffic of three years ago. Every raise is a caller stepping off it, so the
# set left on the default is the set that never asked - and the default has been
# drifting away from all of them the whole time.
#
# Each caller's limit is compared with its own traffic.

# [caller, current limit, peak requests per minute, asked for a raise, years on the platform]
[["checkout", 6000, 4100, 1, 3], ["search", 6000, 5200, 1, 3], ["mobile bff", 6000, 5800, 1, 2], ["reporting", 600, 540, 0, 3], ["partner etl", 600, 720, 0, 2], ["webhooks", 600, 610, 0, 3], ["admin tools", 600, 90, 0, 3], ["batch import", 600, 950, 0, 1]] => callers

len(callers) => n
600 => default_limit
0 => raised
0 => on_default
0 => over
for c in callers:
    if c[3] == 1:
        raised + 1 => raised
    else:
        on_default + 1 => on_default
        if c[2] > c[1]:
            over + 1 => over

"callers : " + str(n) ^0
"  raised on request : " + str(raised) ^0
"  still on the default of " + str(default_limit) + " : " + str(on_default) ^0
"" ^0

"caller          limit   peak   headroom   asked" ^0
for c in callers:
    "" => a
    if c[3] == 1:
        a + "yes" => a
    else:
        a + "no " => a
    c[1] - c[2] => head
    "  " + c[0] + "   " + str(c[1]) + "    " + str(c[2]) + "   " + str(head) + "       " + a ^0
"" ^0

"callers on the default whose peak exceeds it : " + str(over) + " of " + str(on_default) ^0
for c in callers:
    if c[3] == 0:
        if c[2] > c[1]:
            "  " + c[0] + " : peak " + str(c[2]) + " against a limit of " + str(c[1]) + ", over by " + str(c[2] - c[1]) ^0
"  each of those is being throttled, and none of them has asked" ^0
"" ^0

# ---- headroom, by whether they asked ----

0 => asked_head
0 => asked_cnt
0 => quiet_head
0 => quiet_cnt
for c in callers:
    if c[3] == 1:
        asked_cnt + 1 => asked_cnt
        asked_head + c[1] - c[2] => asked_head
    else:
        quiet_cnt + 1 => quiet_cnt
        quiet_head + c[1] - c[2] => quiet_head
"mean headroom" ^0
"  callers who asked : " + str(int(asked_head / asked_cnt)) ^0
"  callers who did not : " + str(int(quiet_head / quiet_cnt)) ^0
if asked_head * quiet_cnt > quiet_head * asked_cnt:
    "  the callers who asked have more room, which is what asking bought" ^0
"" ^0

# ---- the default has not moved ----

3 => years
"the default limit" ^0
"  set : " + str(years) + " years ago, at " + str(default_limit) ^0
"  raised since : never, because no single caller's request is a request to" ^0
"  change the default" ^0
0 => grew
for c in callers:
    if c[3] == 0:
        if c[2] > default_limit:
            grew + 1 => grew
"  callers whose traffic has outgrown it : " + str(grew) ^0
"" ^0

# ---- what throttling looks like from each side ----

"how a throttled caller appears" ^0
"  to the platform : within policy, no action needed" ^0
"  to the caller   : intermittent 429s they may read as their own bug" ^0
"  to the process  : nothing, because no request was made" ^0
"  the process is complete and correct about every request it received" ^0
"" ^0

# ---- what recomputing the default would do ----

0 => p90ish
for c in callers:
    if c[2] > p90ish:
        c[2] => p90ish
int(p90ish * 12 / 10) => suggested
"setting the default from current traffic instead" ^0
"  highest peak among all callers : " + str(p90ish) ^0
"  a default at 1.2x that         : " + str(suggested) ^0
"  callers who would still need a raise : " ^0
0 => still_need
for c in callers:
    if c[2] > suggested:
        still_need + 1 => still_need
"    " + str(still_need) ^0
"  requests the process would then receive : the ones that are genuinely" ^0
"  exceptional, which is what an exception process is for" ^0
"" ^0

# ---- the control: a default that is recomputed each quarter ----
#
# Where the default tracks measured traffic, not asking costs nothing, and the
# request process handles only the genuine outliers.

"control - a default recomputed from traffic every quarter" ^0
"  callers silently over their limit : 0, by construction of the recompute" ^0
"  requests still needed : only from callers above the recomputed level" ^0
"  the difference is not the fairness of the process; it is whether the" ^0
"  starting point is a measurement or a memory" ^0
"" ^0

"Every raise was justified with real traffic and approved by someone who" ^0
"checked. The default is what a caller gets for not asking, and it was set" ^0
"for traffic that no longer exists." ^0
```

## Python (deterministic transpilation)

```python
callers = [["checkout", 6000, 4100, 1, 3], ["search", 6000, 5200, 1, 3], ["mobile bff", 6000, 5800, 1, 2], ["reporting", 600, 540, 0, 3], ["partner etl", 600, 720, 0, 2], ["webhooks", 600, 610, 0, 3], ["admin tools", 600, 90, 0, 3], ["batch import", 600, 950, 0, 1]]
n = len(callers)
default_limit = 600
raised = 0
on_default = 0
over = 0
for c in callers:
    if c[3] == 1:
        raised = raised + 1
    else:
        on_default = on_default + 1
        if c[2] > c[1]:
            over = over + 1
print("callers : " + str(n))
print("  raised on request : " + str(raised))
print("  still on the default of " + str(default_limit) + " : " + str(on_default))
print("")
print("caller          limit   peak   headroom   asked")
for c in callers:
    a = ""
    if c[3] == 1:
        a = a + "yes"
    else:
        a = a + "no "
    head = c[1] - c[2]
    print("  " + c[0] + "   " + str(c[1]) + "    " + str(c[2]) + "   " + str(head) + "       " + a)
print("")
print("callers on the default whose peak exceeds it : " + str(over) + " of " + str(on_default))
for c in callers:
    if c[3] == 0:
        if c[2] > c[1]:
            print("  " + c[0] + " : peak " + str(c[2]) + " against a limit of " + str(c[1]) + ", over by " + str(c[2] - c[1]))
print("  each of those is being throttled, and none of them has asked")
print("")
asked_head = 0
asked_cnt = 0
quiet_head = 0
quiet_cnt = 0
for c in callers:
    if c[3] == 1:
        asked_cnt = asked_cnt + 1
        asked_head = asked_head + c[1] - c[2]
    else:
        quiet_cnt = quiet_cnt + 1
        quiet_head = quiet_head + c[1] - c[2]
print("mean headroom")
print("  callers who asked : " + str(int(asked_head / asked_cnt)))
print("  callers who did not : " + str(int(quiet_head / quiet_cnt)))
if asked_head * quiet_cnt > quiet_head * asked_cnt:
    print("  the callers who asked have more room, which is what asking bought")
print("")
years = 3
print("the default limit")
print("  set : " + str(years) + " years ago, at " + str(default_limit))
print("  raised since : never, because no single caller's request is a request to")
print("  change the default")
grew = 0
for c in callers:
    if c[3] == 0:
        if c[2] > default_limit:
            grew = grew + 1
print("  callers whose traffic has outgrown it : " + str(grew))
print("")
print("how a throttled caller appears")
print("  to the platform : within policy, no action needed")
print("  to the caller   : intermittent 429s they may read as their own bug")
print("  to the process  : nothing, because no request was made")
print("  the process is complete and correct about every request it received")
print("")
p90ish = 0
for c in callers:
    if c[2] > p90ish:
        p90ish = c[2]
suggested = int(p90ish * 12 / 10)
print("setting the default from current traffic instead")
print("  highest peak among all callers : " + str(p90ish))
print("  a default at 1.2x that         : " + str(suggested))
print("  callers who would still need a raise : ")
still_need = 0
for c in callers:
    if c[2] > suggested:
        still_need = still_need + 1
print("    " + str(still_need))
print("  requests the process would then receive : the ones that are genuinely")
print("  exceptional, which is what an exception process is for")
print("")
print("control - a default recomputed from traffic every quarter")
print("  callers silently over their limit : 0, by construction of the recompute")
print("  requests still needed : only from callers above the recomputed level")
print("  the difference is not the fairness of the process; it is whether the")
print("  starting point is a measurement or a memory")
print("")
print("Every raise was justified with real traffic and approved by someone who")
print("checked. The default is what a caller gets for not asking, and it was set")
print("for traffic that no longer exists.")
```

## stdout (executed)

```text
callers : 8
  raised on request : 3
  still on the default of 600 : 5

caller          limit   peak   headroom   asked
  checkout   6000    4100   1900       yes
  search   6000    5200   800       yes
  mobile bff   6000    5800   200       yes
  reporting   600    540   60       no 
  partner etl   600    720   -120       no 
  webhooks   600    610   -10       no 
  admin tools   600    90   510       no 
  batch import   600    950   -350       no 

callers on the default whose peak exceeds it : 3 of 5
  partner etl : peak 720 against a limit of 600, over by 120
  webhooks : peak 610 against a limit of 600, over by 10
  batch import : peak 950 against a limit of 600, over by 350
  each of those is being throttled, and none of them has asked

mean headroom
  callers who asked : 966
  callers who did not : 18
  the callers who asked have more room, which is what asking bought

the default limit
  set : 3 years ago, at 600
  raised since : never, because no single caller's request is a request to
  change the default
  callers whose traffic has outgrown it : 3

how a throttled caller appears
  to the platform : within policy, no action needed
  to the caller   : intermittent 429s they may read as their own bug
  to the process  : nothing, because no request was made
  the process is complete and correct about every request it received

setting the default from current traffic instead
  highest peak among all callers : 5800
  a default at 1.2x that         : 6960
  callers who would still need a raise : 
    0
  requests the process would then receive : the ones that are genuinely
  exceptional, which is what an exception process is for

control - a default recomputed from traffic every quarter
  callers silently over their limit : 0, by construction of the recompute
  requests still needed : only from callers above the recomputed level
  the difference is not the fairness of the process; it is whether the
  starting point is a measurement or a memory

Every raise was justified with real traffic and approved by someone who
checked. The default is what a caller gets for not asking, and it was set
for traffic that no longer exists.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
