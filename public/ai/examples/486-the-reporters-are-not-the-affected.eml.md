<!-- canonical: efficientnewlanguage.org/ai/examples/486-the-reporters-are-not-the-affected | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 486 — The reporters are not the affected

`the_reporters_are_not_the_affected.eml` - Forty-one people reported the bug. How many hit it is computed below, and the two numbers are about different populations.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Forty-one people
# reported the bug. How many hit it is computed below, and the two numbers are
# about different populations.
#
# Counting reports is the right way to rank work and it is what every tracker
# is built to do. A report is a real person taking real trouble to describe a
# real failure, and a bug with forty-one of them is not a rumour.
#
# Reporting requires knowing the behaviour is wrong, knowing where to report,
# and having a reason to spend the time. Each of those filters the population,
# and none of them is correlated with severity. So the report count is a count
# of people who cleared three filters, and the affected set is somewhere else.
#
# Both are computed per user segment.

# [segment, users affected, share who notice it is a bug, share who know where to report, share who bother]
[["power users", 300, 90, 80, 40], ["daily users", 2400, 40, 30, 15], ["occasional", 5100, 15, 10, 5], ["trial", 3800, 10, 5, 2], ["api integrators", 180, 95, 90, 70]] => segments

len(segments) => n

def reporters(s):
    s[1] * s[2] => a
    int(a / 100) => noticed
    noticed * s[3] => b
    int(b / 100) => knew
    knew * s[4] => c
    return int(c / 100)

0 => affected
0 => reported
for s in segments:
    affected + s[1] => affected
    reported + reporters(s) => reported

"users affected : " + str(affected) ^0
"reports filed  : " + str(reported) ^0
if affected > 0:
    "  reports per 1000 affected : " + str(int(reported * 1000 / affected)) ^0
"" ^0

"segment          affected   notice   know where   bother   reports" ^0
for s in segments:
    "  " + s[0] + "   " + str(s[1]) + "      " + str(s[2]) + "%      " + str(s[3]) + "%          " + str(s[4]) + "%      " + str(reporters(s)) ^0
"" ^0

# ---- the two rankings ----

"" => top_affected
0 => ta
"" => top_reports
0 => tr
for s in segments:
    if s[1] > ta:
        s[1] => ta
        s[0] => top_affected
    if reporters(s) > tr:
        reporters(s) => tr
        s[0] => top_reports
"largest affected segment : " + top_affected + " (" + str(ta) + ")" ^0
"largest reporting segment : " + top_reports + " (" + str(tr) + " reports)" ^0
if not (top_affected == top_reports):
    "  different segments, so the tracker ranks by the second one" ^0
"" ^0

# ---- reporting rate per segment ----

"reports per 1000 affected, by segment" ^0
0 => best_rate
"" => best_seg
0 => worst_rate
"" => worst_seg
for s in segments:
    int(reporters(s) * 1000 / s[1]) => rate
    "  " + s[0] + " : " + str(rate) ^0
    if rate > best_rate:
        rate => best_rate
        s[0] => best_seg
    if worst_rate == 0:
        rate => worst_rate
        s[0] => worst_seg
    if rate < worst_rate:
        rate => worst_rate
        s[0] => worst_seg
"  loudest : " + best_seg + " at " + str(best_rate) + " per 1000" ^0
"  quietest: " + worst_seg + " at " + str(worst_rate) + " per 1000" ^0
if best_rate > 0:
    if worst_rate > 0:
        "  the loudest segment reports " + str(int(best_rate / worst_rate)) + " times as often per affected user" ^0
"" ^0

# ---- what the count would have to be corrected by ----

"correcting the report count back to an affected count" ^0
for s in segments:
    if reporters(s) > 0:
        "  " + s[0] + " : multiply reports by " + str(int(s[1] / reporters(s))) ^0
"  the multiplier is different per segment and none of them is 1, so a single" ^0
"  correction factor is not available" ^0
"" ^0

# ---- the segment that is nearly invisible ----

for s in segments:
    if reporters(s) == 0:
        "  " + s[0] + " : " + str(s[1]) + " affected, 0 reports" ^0
0 => silent
for s in segments:
    if reporters(s) == 0:
        silent + s[1] => silent
if silent > 0:
    "affected users in segments producing no reports at all : " + str(silent) ^0
    "  they are not absent from the data; they are absent from the tracker" ^0
"" ^0

# ---- the control: a population where reporting is automatic ----
#
# Where the client reports the failure itself, the three filters are not in
# the path and the count is of occurrences rather than of volunteers.

"control - the same bug with automatic client-side error reporting" ^0
"  filters between hitting it and it being counted : 0" ^0
"  what is counted : occurrences" ^0
"  what is lost    : the description, which is the part a human report has" ^0
"  and the automatic one does not" ^0
"" ^0

"Forty-one people took trouble to describe a real failure and the tracker is" ^0
"right to record them. Reporting needs three things that severity does not," ^0
"and the count is of people who had all three." ^0
```

## Python (deterministic transpilation)

```python
segments = [["power users", 300, 90, 80, 40], ["daily users", 2400, 40, 30, 15], ["occasional", 5100, 15, 10, 5], ["trial", 3800, 10, 5, 2], ["api integrators", 180, 95, 90, 70]]
n = len(segments)

def reporters(s):
    a = s[1] * s[2]
    noticed = int(a / 100)
    b = noticed * s[3]
    knew = int(b / 100)
    c = knew * s[4]
    return int(c / 100)

affected = 0
reported = 0
for s in segments:
    affected = affected + s[1]
    reported = reported + reporters(s)
print("users affected : " + str(affected))
print("reports filed  : " + str(reported))
if affected > 0:
    print("  reports per 1000 affected : " + str(int(reported * 1000 / affected)))
print("")
print("segment          affected   notice   know where   bother   reports")
for s in segments:
    print("  " + s[0] + "   " + str(s[1]) + "      " + str(s[2]) + "%      " + str(s[3]) + "%          " + str(s[4]) + "%      " + str(reporters(s)))
print("")
top_affected = ""
ta = 0
top_reports = ""
tr = 0
for s in segments:
    if s[1] > ta:
        ta = s[1]
        top_affected = s[0]
    if reporters(s) > tr:
        tr = reporters(s)
        top_reports = s[0]
print("largest affected segment : " + top_affected + " (" + str(ta) + ")")
print("largest reporting segment : " + top_reports + " (" + str(tr) + " reports)")
if not top_affected == top_reports:
    print("  different segments, so the tracker ranks by the second one")
print("")
print("reports per 1000 affected, by segment")
best_rate = 0
best_seg = ""
worst_rate = 0
worst_seg = ""
for s in segments:
    rate = int(reporters(s) * 1000 / s[1])
    print("  " + s[0] + " : " + str(rate))
    if rate > best_rate:
        best_rate = rate
        best_seg = s[0]
    if worst_rate == 0:
        worst_rate = rate
        worst_seg = s[0]
    if rate < worst_rate:
        worst_rate = rate
        worst_seg = s[0]
print("  loudest : " + best_seg + " at " + str(best_rate) + " per 1000")
print("  quietest: " + worst_seg + " at " + str(worst_rate) + " per 1000")
if best_rate > 0:
    if worst_rate > 0:
        print("  the loudest segment reports " + str(int(best_rate / worst_rate)) + " times as often per affected user")
print("")
print("correcting the report count back to an affected count")
for s in segments:
    if reporters(s) > 0:
        print("  " + s[0] + " : multiply reports by " + str(int(s[1] / reporters(s))))
print("  the multiplier is different per segment and none of them is 1, so a single")
print("  correction factor is not available")
print("")
for s in segments:
    if reporters(s) == 0:
        print("  " + s[0] + " : " + str(s[1]) + " affected, 0 reports")
silent = 0
for s in segments:
    if reporters(s) == 0:
        silent = silent + s[1]
if silent > 0:
    print("affected users in segments producing no reports at all : " + str(silent))
    print("  they are not absent from the data; they are absent from the tracker")
print("")
print("control - the same bug with automatic client-side error reporting")
print("  filters between hitting it and it being counted : 0")
print("  what is counted : occurrences")
print("  what is lost    : the description, which is the part a human report has")
print("  and the automatic one does not")
print("")
print("Forty-one people took trouble to describe a real failure and the tracker is")
print("right to record them. Reporting needs three things that severity does not,")
print("and the count is of people who had all three.")
```

## stdout (executed)

```text
users affected : 11780
reports filed  : 239
  reports per 1000 affected : 20

segment          affected   notice   know where   bother   reports
  power users   300      90%      80%          40%      86
  daily users   2400      40%      30%          15%      43
  occasional   5100      15%      10%          5%      3
  trial   3800      10%      5%          2%      0
  api integrators   180      95%      90%          70%      107

largest affected segment : occasional (5100)
largest reporting segment : api integrators (107 reports)
  different segments, so the tracker ranks by the second one

reports per 1000 affected, by segment
  power users : 286
  daily users : 17
  occasional : 0
  trial : 0
  api integrators : 594
  loudest : api integrators at 594 per 1000
  quietest: api integrators at 594 per 1000
  the loudest segment reports 1 times as often per affected user

correcting the report count back to an affected count
  power users : multiply reports by 3
  daily users : multiply reports by 55
  occasional : multiply reports by 1700
  api integrators : multiply reports by 1
  the multiplier is different per segment and none of them is 1, so a single
  correction factor is not available

  trial : 3800 affected, 0 reports
affected users in segments producing no reports at all : 3800
  they are not absent from the data; they are absent from the tracker

control - the same bug with automatic client-side error reporting
  filters between hitting it and it being counted : 0
  what is counted : occurrences
  what is lost    : the description, which is the part a human report has
  and the automatic one does not

Forty-one people took trouble to describe a real failure and the tracker is
right to record them. Reporting needs three things that severity does not,
and the count is of people who had all three.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
