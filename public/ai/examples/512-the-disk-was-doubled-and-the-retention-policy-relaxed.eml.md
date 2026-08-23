<!-- canonical: efficientnewlanguage.org/ai/examples/512-the-disk-was-doubled-and-the-retention-policy-relaxed | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 512 — The disk was doubled and the retention policy relaxed

`the_disk_was_doubled_and_the_retention_policy_relaxed.eml` - Storage was doubled and was full again in four months. Whether the data rate grew is computed below, separately from whether the policy did.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Storage was
# doubled and was full again in four months. Whether the data rate grew is
# computed below, separately from whether the policy did.
#
# Doubling the disk was the right call. The array was at 94%, deletion was
# being done by hand under time pressure, and two people had spent a weekend
# choosing what to drop. Buying capacity to stop that happening is exactly
# what capacity is for.
#
# Retention was set to 30 days when 30 days was what fitted. It was not a
# finding about how long anybody needs data - it was a finding about how much
# disk there was. When the disk grew, the constraint that had produced the
# number went away, and the number moved without anybody deciding to change a
# policy.
#
# The bytes arriving and the bytes kept are computed separately below.

# [month, TB capacity, retention days, GB arriving per day, TB used]
[["Jan", 40, 30, 1200, 36], ["Feb", 40, 30, 1240, 37], ["Mar", 80, 30, 1250, 37], ["Apr", 80, 60, 1260, 74], ["May", 80, 60, 1280, 75], ["Jun", 80, 90, 1290, 79]] => months

len(months) => n
months[0] => first
months[n - 1] => last

"month   capacity TB   retention   GB/day arriving   TB used   percent full" ^0
for m in months:
    "  " + m[0] + "     " + str(m[1]) + "            " + str(m[2]) + "          " + str(m[3]) + "              " + str(m[4]) + "        " + str(int(m[4] * 100 / m[1])) + "%" ^0
"" ^0

"capacity  : " + str(first[1]) + " -> " + str(last[1]) + " TB, multiplied by " + str(int(last[1] / first[1])) ^0
"used      : " + str(first[4]) + " -> " + str(last[4]) + " TB" ^0
"percent full : " + str(int(first[4] * 100 / first[1])) + "% -> " + str(int(last[4] * 100 / last[1])) + "%" ^0
"" ^0

# ---- the rate against the policy ----

"how much data arrives" ^0
"  " + first[0] + " : " + str(first[3]) + " GB a day" ^0
"  " + last[0] + " : " + str(last[3]) + " GB a day" ^0
"  growth : " + str(int((last[3] - first[3]) * 100 / first[3])) + "%" ^0
"" ^0
"how long it is kept" ^0
"  " + first[0] + " : " + str(first[2]) + " days" ^0
"  " + last[0] + " : " + str(last[2]) + " days" ^0
"  growth : " + str(int((last[2] - first[2]) * 100 / first[2])) + "%" ^0
"" ^0

# ---- which of the two filled the disk ----

first[3] * last[2] => rate_held
last[3] * first[2] => policy_held
"the same six months under each variable held fixed" ^0
"  arrival rate held at " + str(first[3]) + " GB/day, retention as it moved : " + str(int(rate_held / 1000)) + " TB" ^0
"  retention held at " + str(first[2]) + " days, arrival as it moved     : " + str(int(policy_held / 1000)) + " TB" ^0
"  actual : " + str(last[4]) + " TB" ^0
"  capacity : " + str(last[1]) + " TB" ^0
if int(policy_held / 1000) < last[1]:
    "  with the policy held, the doubled disk is still under half full" ^0
if int(rate_held / 1000) > first[1]:
    "  with the rate held, the policy alone overruns the original array" ^0
"" ^0

# ---- when each retention change happened ----

"every change to the retention setting" ^0
0 => prev
"" => prev_name
0 => prev_used
0 => prev_cap
for m in months:
    if prev > 0:
        if not (m[2] == prev):
            "  " + m[0] + " : " + str(prev) + " -> " + str(m[2]) + " days" ^0
            "    the month before (" + prev_name + ") the array was " + str(prev_cap) + " TB and " + str(int(prev_used * 100 / prev_cap)) + "% full" ^0
    m[2] => prev
    m[0] => prev_name
    m[4] => prev_used
    m[1] => prev_cap
0 => roomy
0 => tight
0 => prev2
0 => used2
0 => cap2
for m in months:
    if prev2 > 0:
        if not (m[2] == prev2):
            if used2 * 2 < cap2:
                roomy + 1 => roomy
            else:
                tight + 1 => tight
    m[2] => prev2
    m[4] => used2
    m[1] => cap2
"  changes made with the array under half full : " + str(roomy) ^0
"  changes made with it already over half full : " + str(tight) ^0
if tight > 0:
    "  so they are not the same decision twice: the first was taken because" ^0
    "  the space was there, and the second because it was running out, which" ^0
    "  is the first one's consequence arriving" ^0
"  neither was a review of how long the data is needed for" ^0
"" ^0

# ---- what the 30 days was ----

"where the original number came from" ^0
first[3] * first[2] => needed
"  30 days at " + str(first[3]) + " GB/day : " + str(int(needed / 1000)) + " TB" ^0
"  array at the time              : " + str(first[1]) + " TB" ^0
"  headroom                       : " + str(first[1] - int(needed / 1000)) + " TB" ^0
"  the policy was the largest window that fitted, so it recorded the disk" ^0
"  size rather than a requirement" ^0
"" ^0

# ---- what anyone actually reads ----

# [age of data in days, queries per month against it]
[[1, 41000], [7, 9000], [30, 700], [60, 40], [90, 3]] => reads
"queries per month, by how old the data is" ^0
0 => total_reads
for r in reads:
    total_reads + r[1] => total_reads
for r in reads:
    "  " + str(r[0]) + " days old : " + str(r[1]) + " queries, " + str(int(r[1] * 1000 / total_reads)) + " per 1000" ^0
0 => beyond30
for r in reads:
    if r[0] > 30:
        beyond30 + r[1] => beyond30
"  queries against data older than 30 days : " + str(beyond30) + ", " + str(int(beyond30 * 1000 / total_reads)) + " per 1000" ^0
"  the two retention extensions cover " + str(int(beyond30 * 1000 / total_reads)) + " queries in a thousand and" ^0
"  " + str(last[4] - int(policy_held / 1000)) + " TB of the array" ^0
"" ^0

# ---- the control: a store whose retention is set by law ----
#
# Where the window is fixed outside the team, adding disk adds headroom and
# the headroom stays.

[["Jan", 10, 2555, 9], ["Jun", 20, 2555, 9]] => legal
"control - an archive with a seven-year statutory window" ^0
for l in legal:
    "  " + l[0] + " : " + str(l[1]) + " TB capacity, " + str(l[2]) + " days retention, " + str(l[3]) + " TB used, " + str(int(l[3] * 100 / l[1])) + "% full" ^0
if legal[0][2] == legal[1][2]:
    "  retention did not move, because it is not the team's to move" ^0
    "  doubling the disk took it from " + str(int(legal[0][3] * 100 / legal[0][1])) + "% to " + str(int(legal[1][3] * 100 / legal[1][1])) + "% full and left it there" ^0
"" ^0

"Buying disk to stop weekend deletions was correct and it stopped them." ^0
"The 30 days was a measurement of the old array, so doubling the array" ^0
"moved the policy, and the arrival rate grew " + str(int((last[3] - first[3]) * 100 / first[3])) + "% across the same period." ^0
```

## Python (deterministic transpilation)

```python
months = [["Jan", 40, 30, 1200, 36], ["Feb", 40, 30, 1240, 37], ["Mar", 80, 30, 1250, 37], ["Apr", 80, 60, 1260, 74], ["May", 80, 60, 1280, 75], ["Jun", 80, 90, 1290, 79]]
n = len(months)
first = months[0]
last = months[n - 1]
print("month   capacity TB   retention   GB/day arriving   TB used   percent full")
for m in months:
    print("  " + m[0] + "     " + str(m[1]) + "            " + str(m[2]) + "          " + str(m[3]) + "              " + str(m[4]) + "        " + str(int(m[4] * 100 / m[1])) + "%")
print("")
print("capacity  : " + str(first[1]) + " -> " + str(last[1]) + " TB, multiplied by " + str(int(last[1] / first[1])))
print("used      : " + str(first[4]) + " -> " + str(last[4]) + " TB")
print("percent full : " + str(int(first[4] * 100 / first[1])) + "% -> " + str(int(last[4] * 100 / last[1])) + "%")
print("")
print("how much data arrives")
print("  " + first[0] + " : " + str(first[3]) + " GB a day")
print("  " + last[0] + " : " + str(last[3]) + " GB a day")
print("  growth : " + str(int((last[3] - first[3]) * 100 / first[3])) + "%")
print("")
print("how long it is kept")
print("  " + first[0] + " : " + str(first[2]) + " days")
print("  " + last[0] + " : " + str(last[2]) + " days")
print("  growth : " + str(int((last[2] - first[2]) * 100 / first[2])) + "%")
print("")
rate_held = first[3] * last[2]
policy_held = last[3] * first[2]
print("the same six months under each variable held fixed")
print("  arrival rate held at " + str(first[3]) + " GB/day, retention as it moved : " + str(int(rate_held / 1000)) + " TB")
print("  retention held at " + str(first[2]) + " days, arrival as it moved     : " + str(int(policy_held / 1000)) + " TB")
print("  actual : " + str(last[4]) + " TB")
print("  capacity : " + str(last[1]) + " TB")
if int(policy_held / 1000) < last[1]:
    print("  with the policy held, the doubled disk is still under half full")
if int(rate_held / 1000) > first[1]:
    print("  with the rate held, the policy alone overruns the original array")
print("")
print("every change to the retention setting")
prev = 0
prev_name = ""
prev_used = 0
prev_cap = 0
for m in months:
    if prev > 0:
        if not m[2] == prev:
            print("  " + m[0] + " : " + str(prev) + " -> " + str(m[2]) + " days")
            print("    the month before (" + prev_name + ") the array was " + str(prev_cap) + " TB and " + str(int(prev_used * 100 / prev_cap)) + "% full")
    prev = m[2]
    prev_name = m[0]
    prev_used = m[4]
    prev_cap = m[1]
roomy = 0
tight = 0
prev2 = 0
used2 = 0
cap2 = 0
for m in months:
    if prev2 > 0:
        if not m[2] == prev2:
            if used2 * 2 < cap2:
                roomy = roomy + 1
            else:
                tight = tight + 1
    prev2 = m[2]
    used2 = m[4]
    cap2 = m[1]
print("  changes made with the array under half full : " + str(roomy))
print("  changes made with it already over half full : " + str(tight))
if tight > 0:
    print("  so they are not the same decision twice: the first was taken because")
    print("  the space was there, and the second because it was running out, which")
    print("  is the first one's consequence arriving")
print("  neither was a review of how long the data is needed for")
print("")
print("where the original number came from")
needed = first[3] * first[2]
print("  30 days at " + str(first[3]) + " GB/day : " + str(int(needed / 1000)) + " TB")
print("  array at the time              : " + str(first[1]) + " TB")
print("  headroom                       : " + str(first[1] - int(needed / 1000)) + " TB")
print("  the policy was the largest window that fitted, so it recorded the disk")
print("  size rather than a requirement")
print("")
reads = [[1, 41000], [7, 9000], [30, 700], [60, 40], [90, 3]]
print("queries per month, by how old the data is")
total_reads = 0
for r in reads:
    total_reads = total_reads + r[1]
for r in reads:
    print("  " + str(r[0]) + " days old : " + str(r[1]) + " queries, " + str(int(r[1] * 1000 / total_reads)) + " per 1000")
beyond30 = 0
for r in reads:
    if r[0] > 30:
        beyond30 = beyond30 + r[1]
print("  queries against data older than 30 days : " + str(beyond30) + ", " + str(int(beyond30 * 1000 / total_reads)) + " per 1000")
print("  the two retention extensions cover " + str(int(beyond30 * 1000 / total_reads)) + " queries in a thousand and")
print("  " + str(last[4] - int(policy_held / 1000)) + " TB of the array")
print("")
legal = [["Jan", 10, 2555, 9], ["Jun", 20, 2555, 9]]
print("control - an archive with a seven-year statutory window")
for l in legal:
    print("  " + l[0] + " : " + str(l[1]) + " TB capacity, " + str(l[2]) + " days retention, " + str(l[3]) + " TB used, " + str(int(l[3] * 100 / l[1])) + "% full")
if legal[0][2] == legal[1][2]:
    print("  retention did not move, because it is not the team's to move")
    print("  doubling the disk took it from " + str(int(legal[0][3] * 100 / legal[0][1])) + "% to " + str(int(legal[1][3] * 100 / legal[1][1])) + "% full and left it there")
print("")
print("Buying disk to stop weekend deletions was correct and it stopped them.")
print("The 30 days was a measurement of the old array, so doubling the array")
print("moved the policy, and the arrival rate grew " + str(int((last[3] - first[3]) * 100 / first[3])) + "% across the same period.")
```

## stdout (executed)

```text
month   capacity TB   retention   GB/day arriving   TB used   percent full
  Jan     40            30          1200              36        90%
  Feb     40            30          1240              37        92%
  Mar     80            30          1250              37        46%
  Apr     80            60          1260              74        92%
  May     80            60          1280              75        93%
  Jun     80            90          1290              79        98%

capacity  : 40 -> 80 TB, multiplied by 2
used      : 36 -> 79 TB
percent full : 90% -> 98%

how much data arrives
  Jan : 1200 GB a day
  Jun : 1290 GB a day
  growth : 7%

how long it is kept
  Jan : 30 days
  Jun : 90 days
  growth : 200%

the same six months under each variable held fixed
  arrival rate held at 1200 GB/day, retention as it moved : 108 TB
  retention held at 30 days, arrival as it moved     : 38 TB
  actual : 79 TB
  capacity : 80 TB
  with the policy held, the doubled disk is still under half full
  with the rate held, the policy alone overruns the original array

every change to the retention setting
  Apr : 30 -> 60 days
    the month before (Mar) the array was 80 TB and 46% full
  Jun : 60 -> 90 days
    the month before (May) the array was 80 TB and 93% full
  changes made with the array under half full : 1
  changes made with it already over half full : 1
  so they are not the same decision twice: the first was taken because
  the space was there, and the second because it was running out, which
  is the first one's consequence arriving
  neither was a review of how long the data is needed for

where the original number came from
  30 days at 1200 GB/day : 36 TB
  array at the time              : 40 TB
  headroom                       : 4 TB
  the policy was the largest window that fitted, so it recorded the disk
  size rather than a requirement

queries per month, by how old the data is
  1 days old : 41000 queries, 807 per 1000
  7 days old : 9000 queries, 177 per 1000
  30 days old : 700 queries, 13 per 1000
  60 days old : 40 queries, 0 per 1000
  90 days old : 3 queries, 0 per 1000
  queries against data older than 30 days : 43, 0 per 1000
  the two retention extensions cover 0 queries in a thousand and
  41 TB of the array

control - an archive with a seven-year statutory window
  Jan : 10 TB capacity, 2555 days retention, 9 TB used, 90% full
  Jun : 20 TB capacity, 2555 days retention, 9 TB used, 45% full
  retention did not move, because it is not the team's to move
  doubling the disk took it from 90% to 45% full and left it there

Buying disk to stop weekend deletions was correct and it stopped them.
The 30 days was a measurement of the old array, so doubling the array
moved the policy, and the arrival rate grew 7% across the same period.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
