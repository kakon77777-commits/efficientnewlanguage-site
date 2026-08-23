<!-- canonical: efficientnewlanguage.org/ai/examples/515-the-log-level-was-set-by-the-writer | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 515 — The log level was set by the writer

`the_log_level_was_set_by_the_writer.eml` - Each service team sets its own log level. The bill arrives at a team that cannot change any of them. Both quantities are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Each service
# team sets its own log level. The bill arrives at a team that cannot change
# any of them. Both quantities are computed below.
#
# Every one of these levels was set for a reason. DEBUG went on during an
# incident and stayed on because the incident class is not closed. The team
# that turned it on can point at three bugs they found with it, and they are
# right that turning it off would have cost them those three bugs.
#
# Log volume is decided in a service's own configuration and paid out of a
# shared retention budget. The team choosing the level sees the diagnosis it
# buys. The team paying sees a total, with no line item that any single
# decision would move by much.
#
# Both ends are counted below.

# [service, level, lines per day, bytes per line, requests per day, team]
[["payments", "DEBUG", 240000000, 380, 900000, "payments"], ["catalog", "INFO", 9000000, 240, 4000000, "catalog"], ["notifier", "DEBUG", 88000000, 410, 120000, "growth"], ["auth", "WARN", 400000, 260, 6000000, "identity"], ["reporting", "INFO", 2000000, 300, 40000, "data"]] => services

len(services) => n
30 => retention_days

def gb_stored(lines, width, days):
    return int(lines * width * days / 1073741824)

0 => total_gb
for s in services:
    total_gb + gb_stored(s[2], s[3], retention_days) => total_gb

"services            : " + str(n) ^0
"retention           : " + str(retention_days) + " days" ^0
"stored right now    : " + str(total_gb) + " GB" ^0
"" ^0

"service      level   lines/day     bytes/line   GB stored   requests/day" ^0
for s in services:
    "  " + s[0] + "   " + s[1] + "   " + str(s[2]) + "   " + str(s[3]) + "        " + str(gb_stored(s[2], s[3], retention_days)) + "      " + str(s[4]) ^0
"" ^0

# ---- volume against size ----

"lines written per 1000 requests, a unit fine enough that the quietest" ^0
"service does not floor to zero" ^0
for s in services:
    "  " + s[0] + " : " + str(int(s[2] * 1000 / s[4])) + " lines per 1000 requests" ^0
0 => loudest
"" => loud_name
for s in services:
    int(s[2] * 1000 / s[4]) => per_req
    if per_req > loudest:
        per_req => loudest
        s[0] => loud_name
"  loudest : " + loud_name + " at " + str(loudest) + " lines per 1000 requests" ^0
for s in services:
    if s[0] == loud_name:
        "  its traffic : " + str(s[4]) + " requests a day" ^0
0 => busiest
"" => busy_name
for s in services:
    if s[4] > busiest:
        s[4] => busiest
        s[0] => busy_name
"  busiest service : " + busy_name + " at " + str(busiest) + " requests a day" ^0
if not (loud_name == busy_name):
    "  the loudest service is not the busiest one, so volume here is a" ^0
    "  configuration choice rather than a consequence of traffic" ^0
"" ^0

# ---- who spends and who is billed ----

"share of the stored bytes, by the team that set the level" ^0
for s in services:
    gb_stored(s[2], s[3], retention_days) => g
    "  " + s[5] + " : " + str(g) + " GB, " + str(int(g * 100 / total_gb)) + "%" ^0
"  the retention bill is paid by : platform" ^0
0 => platform_share
for s in services:
    if s[5] == "platform":
        platform_share + gb_stored(s[2], s[3], retention_days) => platform_share
"  bytes platform itself wrote : " + str(platform_share) + " GB" ^0
"  levels platform can change  : 0" ^0
"" ^0

# ---- what the debug lines were for ----

# [service, level, bugs found with it, times anyone queried these logs per month]
[["payments", "DEBUG", 3, 6], ["notifier", "DEBUG", 1, 0]] => debuggers
"what the DEBUG output bought" ^0
for d in debuggers:
    "  " + d[0] + " : " + str(d[2]) + " bugs found, logs queried " + str(d[3]) + " times a month" ^0
0 => never_read
for d in debuggers:
    if d[3] == 0:
        never_read + 1 => never_read
        for s in services:
            if s[0] == d[0]:
                "  " + d[0] + " stores " + str(gb_stored(s[2], s[3], retention_days)) + " GB that nobody has queried" ^0
"  services at DEBUG whose logs are never read : " + str(never_read) + " of " + str(len(debuggers)) ^0
"  finding three bugs is a real return, and it is not the same fact as" ^0
"  whether the volume is still being used" ^0
"" ^0

# ---- what a shorter window would do ----

7 => shorter
0 => shorter_gb
for s in services:
    shorter_gb + gb_stored(s[2], s[3], shorter) => shorter_gb
"the same levels at " + str(shorter) + " days of retention" ^0
"  stored : " + str(total_gb) + " GB -> " + str(shorter_gb) + " GB" ^0
"  reduction : " + str(int((total_gb - shorter_gb) * 100 / total_gb)) + "%" ^0
"  levels changed : 0" ^0
"  this is the only lever the paying team actually holds, and it is the one" ^0
"  that does not distinguish between the useful lines and the rest" ^0
"" ^0

# ---- what a per-team budget would do ----

"the same bill, split to the team that set the level" ^0
for s in services:
    gb_stored(s[2], s[3], retention_days) => g
    "  " + s[5] + " : " + str(g) + " GB" ^0
"  under a shared budget every team's incentive is to log more, because the" ^0
"  diagnosis is theirs and the storage is everyone's" ^0
"  under a split budget the same DEBUG decision is still available, and it" ^0
"  is made by someone who can see what it costs" ^0
"" ^0

# ---- the control: a service whose team owns its own retention ----
#
# Where the team that sets the level also pays for the storage, the level and
# the bill are two views of one decision.

# [service, level, lines/day, bytes/line, requests/day, sets the level, pays the bill]
[["auth", "WARN", 400000, 260, 6000000, "identity", "identity"]] => owned
for o in owned:
    "control - " + o[0] + " at " + o[1] + ", level set by " + o[5] + ", billed to " + o[6] ^0
    "  stored : " + str(gb_stored(o[2], o[3], retention_days)) + " GB" ^0
    0 => busier
    for s in services:
        if s[4] > o[4]:
            busier + 1 => busier
    "  services here busier than it : " + str(busier) + " of " + str(n) ^0
    int(o[2] * 1000 / o[4]) => own_rate
    0 => quieter
    for s in services:
        if int(s[2] * 1000 / s[4]) < own_rate:
            quieter + 1 => quieter
    "  lines per 1000 requests : " + str(own_rate) + ", with " + str(quieter) + " services below it" ^0
    if quieter == 0:
        "  so it is the busiest service here and the quietest writer" ^0
    "  nothing stops it going to DEBUG, and the team that would do it is the" ^0
    "  team that would see the number move" ^0
"" ^0

"Every level here was set for a reason and DEBUG really did find those bugs." ^0
"A log level is chosen in one team's configuration and paid out of another" ^0
"team's budget, and only one of those two can see both numbers." ^0
```

## Python (deterministic transpilation)

```python
services = [["payments", "DEBUG", 240000000, 380, 900000, "payments"], ["catalog", "INFO", 9000000, 240, 4000000, "catalog"], ["notifier", "DEBUG", 88000000, 410, 120000, "growth"], ["auth", "WARN", 400000, 260, 6000000, "identity"], ["reporting", "INFO", 2000000, 300, 40000, "data"]]
n = len(services)
retention_days = 30

def gb_stored(lines, width, days):
    return int(lines * width * days / 1073741824)

total_gb = 0
for s in services:
    total_gb = total_gb + gb_stored(s[2], s[3], retention_days)
print("services            : " + str(n))
print("retention           : " + str(retention_days) + " days")
print("stored right now    : " + str(total_gb) + " GB")
print("")
print("service      level   lines/day     bytes/line   GB stored   requests/day")
for s in services:
    print("  " + s[0] + "   " + s[1] + "   " + str(s[2]) + "   " + str(s[3]) + "        " + str(gb_stored(s[2], s[3], retention_days)) + "      " + str(s[4]))
print("")
print("lines written per 1000 requests, a unit fine enough that the quietest")
print("service does not floor to zero")
for s in services:
    print("  " + s[0] + " : " + str(int(s[2] * 1000 / s[4])) + " lines per 1000 requests")
loudest = 0
loud_name = ""
for s in services:
    per_req = int(s[2] * 1000 / s[4])
    if per_req > loudest:
        loudest = per_req
        loud_name = s[0]
print("  loudest : " + loud_name + " at " + str(loudest) + " lines per 1000 requests")
for s in services:
    if s[0] == loud_name:
        print("  its traffic : " + str(s[4]) + " requests a day")
busiest = 0
busy_name = ""
for s in services:
    if s[4] > busiest:
        busiest = s[4]
        busy_name = s[0]
print("  busiest service : " + busy_name + " at " + str(busiest) + " requests a day")
if not loud_name == busy_name:
    print("  the loudest service is not the busiest one, so volume here is a")
    print("  configuration choice rather than a consequence of traffic")
print("")
print("share of the stored bytes, by the team that set the level")
for s in services:
    g = gb_stored(s[2], s[3], retention_days)
    print("  " + s[5] + " : " + str(g) + " GB, " + str(int(g * 100 / total_gb)) + "%")
print("  the retention bill is paid by : platform")
platform_share = 0
for s in services:
    if s[5] == "platform":
        platform_share = platform_share + gb_stored(s[2], s[3], retention_days)
print("  bytes platform itself wrote : " + str(platform_share) + " GB")
print("  levels platform can change  : 0")
print("")
debuggers = [["payments", "DEBUG", 3, 6], ["notifier", "DEBUG", 1, 0]]
print("what the DEBUG output bought")
for d in debuggers:
    print("  " + d[0] + " : " + str(d[2]) + " bugs found, logs queried " + str(d[3]) + " times a month")
never_read = 0
for d in debuggers:
    if d[3] == 0:
        never_read = never_read + 1
        for s in services:
            if s[0] == d[0]:
                print("  " + d[0] + " stores " + str(gb_stored(s[2], s[3], retention_days)) + " GB that nobody has queried")
print("  services at DEBUG whose logs are never read : " + str(never_read) + " of " + str(len(debuggers)))
print("  finding three bugs is a real return, and it is not the same fact as")
print("  whether the volume is still being used")
print("")
shorter = 7
shorter_gb = 0
for s in services:
    shorter_gb = shorter_gb + gb_stored(s[2], s[3], shorter)
print("the same levels at " + str(shorter) + " days of retention")
print("  stored : " + str(total_gb) + " GB -> " + str(shorter_gb) + " GB")
print("  reduction : " + str(int((total_gb - shorter_gb) * 100 / total_gb)) + "%")
print("  levels changed : 0")
print("  this is the only lever the paying team actually holds, and it is the one")
print("  that does not distinguish between the useful lines and the rest")
print("")
print("the same bill, split to the team that set the level")
for s in services:
    g = gb_stored(s[2], s[3], retention_days)
    print("  " + s[5] + " : " + str(g) + " GB")
print("  under a shared budget every team's incentive is to log more, because the")
print("  diagnosis is theirs and the storage is everyone's")
print("  under a split budget the same DEBUG decision is still available, and it")
print("  is made by someone who can see what it costs")
print("")
owned = [["auth", "WARN", 400000, 260, 6000000, "identity", "identity"]]
for o in owned:
    print("control - " + o[0] + " at " + o[1] + ", level set by " + o[5] + ", billed to " + o[6])
    print("  stored : " + str(gb_stored(o[2], o[3], retention_days)) + " GB")
    busier = 0
    for s in services:
        if s[4] > o[4]:
            busier = busier + 1
    print("  services here busier than it : " + str(busier) + " of " + str(n))
    own_rate = int(o[2] * 1000 / o[4])
    quieter = 0
    for s in services:
        if int(s[2] * 1000 / s[4]) < own_rate:
            quieter = quieter + 1
    print("  lines per 1000 requests : " + str(own_rate) + ", with " + str(quieter) + " services below it")
    if quieter == 0:
        print("  so it is the busiest service here and the quietest writer")
    print("  nothing stops it going to DEBUG, and the team that would do it is the")
    print("  team that would see the number move")
print("")
print("Every level here was set for a reason and DEBUG really did find those bugs.")
print("A log level is chosen in one team's configuration and paid out of another")
print("team's budget, and only one of those two can see both numbers.")
```

## stdout (executed)

```text
services            : 5
retention           : 30 days
stored right now    : 3634 GB

service      level   lines/day     bytes/line   GB stored   requests/day
  payments   DEBUG   240000000   380        2548      900000
  catalog   INFO   9000000   240        60      4000000
  notifier   DEBUG   88000000   410        1008      120000
  auth   WARN   400000   260        2      6000000
  reporting   INFO   2000000   300        16      40000

lines written per 1000 requests, a unit fine enough that the quietest
service does not floor to zero
  payments : 266666 lines per 1000 requests
  catalog : 2250 lines per 1000 requests
  notifier : 733333 lines per 1000 requests
  auth : 66 lines per 1000 requests
  reporting : 50000 lines per 1000 requests
  loudest : notifier at 733333 lines per 1000 requests
  its traffic : 120000 requests a day
  busiest service : auth at 6000000 requests a day
  the loudest service is not the busiest one, so volume here is a
  configuration choice rather than a consequence of traffic

share of the stored bytes, by the team that set the level
  payments : 2548 GB, 70%
  catalog : 60 GB, 1%
  growth : 1008 GB, 27%
  identity : 2 GB, 0%
  data : 16 GB, 0%
  the retention bill is paid by : platform
  bytes platform itself wrote : 0 GB
  levels platform can change  : 0

what the DEBUG output bought
  payments : 3 bugs found, logs queried 6 times a month
  notifier : 1 bugs found, logs queried 0 times a month
  notifier stores 1008 GB that nobody has queried
  services at DEBUG whose logs are never read : 1 of 2
  finding three bugs is a real return, and it is not the same fact as
  whether the volume is still being used

the same levels at 7 days of retention
  stored : 3634 GB -> 846 GB
  reduction : 76%
  levels changed : 0
  this is the only lever the paying team actually holds, and it is the one
  that does not distinguish between the useful lines and the rest

the same bill, split to the team that set the level
  payments : 2548 GB
  catalog : 60 GB
  growth : 1008 GB
  identity : 2 GB
  data : 16 GB
  under a shared budget every team's incentive is to log more, because the
  diagnosis is theirs and the storage is everyone's
  under a split budget the same DEBUG decision is still available, and it
  is made by someone who can see what it costs

control - auth at WARN, level set by identity, billed to identity
  stored : 2 GB
  services here busier than it : 0 of 5
  lines per 1000 requests : 66, with 0 services below it
  so it is the busiest service here and the quietest writer
  nothing stops it going to DEBUG, and the team that would do it is the
  team that would see the number move

Every level here was set for a reason and DEBUG really did find those bugs.
A log level is chosen in one team's configuration and paid out of another
team's budget, and only one of those two can see both numbers.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
