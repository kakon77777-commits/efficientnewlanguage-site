<!-- canonical: efficientnewlanguage.org/ai/examples/485-the-quiet-hours-are-somebody-elses-peak | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 485 — The quiet hours are somebody elses peak

`the_quiet_hours_are_somebody_elses_peak.eml` - Deploys go out at two in the morning, when traffic is lowest. Whose traffic is lowest is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Deploys go out at
# two in the morning, when traffic is lowest. Whose traffic is lowest is
# computed below.
#
# Deploying at the trough is right and the reasoning is sound: fewer users are
# exposed to a bad release, the rollback window is quieter, and the on-call
# engineer is not also handling peak load. Every part of that holds.
#
# The trough is a property of the aggregate, and the aggregate is a sum over
# regions whose days do not line up. A single global minimum can sit inside
# another region's working morning, and the people there are not fewer - they
# are simply outnumbered in the total.
#
# Traffic is broken out by region across the day.

# requests per hour, in hundreds, at the deploy hour and at each region's own peak
# [region, share of total traffic, requests at 02:00 team time, that region's own peak]
[["team region", 55, 20, 900], ["region B", 25, 300, 420], ["region C", 14, 260, 300], ["region D", 6, 90, 110]] => regions

len(regions) => n
0 => at_deploy
0 => peak_total
for r in regions:
    at_deploy + r[2] => at_deploy
    peak_total + r[3] => peak_total

"regions : " + str(n) ^0
"total traffic at the deploy hour : " + str(at_deploy) ^0
"" ^0
"region         share   at 02:00   own peak   at deploy as share of own peak" ^0
for r in regions:
    int(r[2] * 100 / r[3]) => pct
    "  " + r[0] + "   " + str(r[1]) + "%     " + str(r[2]) + "        " + str(r[3]) + "        " + str(pct) + "%" ^0
"" ^0

# ---- who is at their trough and who is not ----

0 => at_trough
0 => near_peak
for r in regions:
    int(r[2] * 100 / r[3]) => pct
    if pct < 20:
        at_trough + 1 => at_trough
    if pct >= 60:
        near_peak + 1 => near_peak
"regions genuinely at a trough (under 20% of own peak) : " + str(at_trough) + " of " + str(n) ^0
"regions at 60% of their own peak or above             : " + str(near_peak) ^0
for r in regions:
    int(r[2] * 100 / r[3]) => pct
    if pct >= 60:
        "  " + r[0] + " is at " + str(pct) + "% of its own peak when the deploy goes out" ^0
"" ^0

# ---- what makes the aggregate look quiet ----

"why the total is at its minimum" ^0
for r in regions:
    if r[1] >= 50:
        "  " + r[0] + " is " + str(r[1]) + "% of traffic and is at " + str(int(r[2] * 100 / r[3])) + "% of its peak" ^0
"  the aggregate minimum is that one region's night, and it is a minimum" ^0
"  because that region is the majority, not because everyone is asleep" ^0
"" ^0

0 => non_team
for r in regions:
    if r[1] < 50:
        non_team + r[2] => non_team
"requests during the deploy from regions other than the majority : " + str(non_team) ^0
if at_deploy > 0:
    "  which is " + str(int(non_team * 100 / at_deploy)) + "% of the traffic in that hour" ^0
"" ^0

# ---- who is exposed to a bad release ----

"exposure to a bad release, by region" ^0
0 => worst_exposed
"" => worst_name
for r in regions:
    if r[2] > worst_exposed:
        r[2] => worst_exposed
        r[0] => worst_name
"  most exposed at the deploy hour : " + worst_name + ", " + str(worst_exposed) + " requests" ^0
for r in regions:
    if r[1] >= 50:
        if r[2] < worst_exposed:
            "  the majority region, which the schedule protects, is at " + str(r[2]) ^0
"  the schedule protects the region the schedule was chosen from" ^0
"" ^0

# ---- and who is awake to notice ----

"who is on call at the deploy hour" ^0
"  in the team region : the middle of the night" ^0
"  in the exposed regions : working hours, and they are not on this rota" ^0
"  so the people best placed to see a bad release are the ones with no way" ^0
"  to report it into the deploy process" ^0
"" ^0

# ---- what a per-region window would cost ----

"deploying per region at each region's own trough" ^0
"  deploys per release : " + str(n) + " instead of 1" ^0
"  exposure per deploy : each region at its own minimum" ^0
0 => best_case
for r in regions:
    int(r[3] * 10 / 100) => est
    best_case + est => best_case
"  total exposure : about " + str(best_case) + " against " + str(at_deploy) + " today" ^0
if best_case < at_deploy:
    "  lower, at the cost of " + str(n - 1) + " extra deploy windows and a version skew" ^0
    "  between regions that has to be designed for" ^0
"" ^0

# ---- the control: a single-region service ----
#
# Where all the traffic is in one timezone, the aggregate trough IS everyone's
# trough and the schedule is simply correct.

"control - a service with one region" ^0
"  regions : 1, so the aggregate minimum and the only region's minimum are" ^0
"  the same hour by construction" ^0
"  the reasoning that produced the problem above is exactly right here" ^0
"" ^0

"Deploying at the trough exposes fewest users and that reasoning holds. The" ^0
"trough is a fact about the sum, and the sum is dominated by the region the" ^0
"schedule was written in." ^0
```

## Python (deterministic transpilation)

```python
regions = [["team region", 55, 20, 900], ["region B", 25, 300, 420], ["region C", 14, 260, 300], ["region D", 6, 90, 110]]
n = len(regions)
at_deploy = 0
peak_total = 0
for r in regions:
    at_deploy = at_deploy + r[2]
    peak_total = peak_total + r[3]
print("regions : " + str(n))
print("total traffic at the deploy hour : " + str(at_deploy))
print("")
print("region         share   at 02:00   own peak   at deploy as share of own peak")
for r in regions:
    pct = int(r[2] * 100 / r[3])
    print("  " + r[0] + "   " + str(r[1]) + "%     " + str(r[2]) + "        " + str(r[3]) + "        " + str(pct) + "%")
print("")
at_trough = 0
near_peak = 0
for r in regions:
    pct = int(r[2] * 100 / r[3])
    if pct < 20:
        at_trough = at_trough + 1
    if pct >= 60:
        near_peak = near_peak + 1
print("regions genuinely at a trough (under 20% of own peak) : " + str(at_trough) + " of " + str(n))
print("regions at 60% of their own peak or above             : " + str(near_peak))
for r in regions:
    pct = int(r[2] * 100 / r[3])
    if pct >= 60:
        print("  " + r[0] + " is at " + str(pct) + "% of its own peak when the deploy goes out")
print("")
print("why the total is at its minimum")
for r in regions:
    if r[1] >= 50:
        print("  " + r[0] + " is " + str(r[1]) + "% of traffic and is at " + str(int(r[2] * 100 / r[3])) + "% of its peak")
print("  the aggregate minimum is that one region's night, and it is a minimum")
print("  because that region is the majority, not because everyone is asleep")
print("")
non_team = 0
for r in regions:
    if r[1] < 50:
        non_team = non_team + r[2]
print("requests during the deploy from regions other than the majority : " + str(non_team))
if at_deploy > 0:
    print("  which is " + str(int(non_team * 100 / at_deploy)) + "% of the traffic in that hour")
print("")
print("exposure to a bad release, by region")
worst_exposed = 0
worst_name = ""
for r in regions:
    if r[2] > worst_exposed:
        worst_exposed = r[2]
        worst_name = r[0]
print("  most exposed at the deploy hour : " + worst_name + ", " + str(worst_exposed) + " requests")
for r in regions:
    if r[1] >= 50:
        if r[2] < worst_exposed:
            print("  the majority region, which the schedule protects, is at " + str(r[2]))
print("  the schedule protects the region the schedule was chosen from")
print("")
print("who is on call at the deploy hour")
print("  in the team region : the middle of the night")
print("  in the exposed regions : working hours, and they are not on this rota")
print("  so the people best placed to see a bad release are the ones with no way")
print("  to report it into the deploy process")
print("")
print("deploying per region at each region's own trough")
print("  deploys per release : " + str(n) + " instead of 1")
print("  exposure per deploy : each region at its own minimum")
best_case = 0
for r in regions:
    est = int(r[3] * 10 / 100)
    best_case = best_case + est
print("  total exposure : about " + str(best_case) + " against " + str(at_deploy) + " today")
if best_case < at_deploy:
    print("  lower, at the cost of " + str(n - 1) + " extra deploy windows and a version skew")
    print("  between regions that has to be designed for")
print("")
print("control - a service with one region")
print("  regions : 1, so the aggregate minimum and the only region's minimum are")
print("  the same hour by construction")
print("  the reasoning that produced the problem above is exactly right here")
print("")
print("Deploying at the trough exposes fewest users and that reasoning holds. The")
print("trough is a fact about the sum, and the sum is dominated by the region the")
print("schedule was written in.")
```

## stdout (executed)

```text
regions : 4
total traffic at the deploy hour : 670

region         share   at 02:00   own peak   at deploy as share of own peak
  team region   55%     20        900        2%
  region B   25%     300        420        71%
  region C   14%     260        300        86%
  region D   6%     90        110        81%

regions genuinely at a trough (under 20% of own peak) : 1 of 4
regions at 60% of their own peak or above             : 3
  region B is at 71% of its own peak when the deploy goes out
  region C is at 86% of its own peak when the deploy goes out
  region D is at 81% of its own peak when the deploy goes out

why the total is at its minimum
  team region is 55% of traffic and is at 2% of its peak
  the aggregate minimum is that one region's night, and it is a minimum
  because that region is the majority, not because everyone is asleep

requests during the deploy from regions other than the majority : 650
  which is 97% of the traffic in that hour

exposure to a bad release, by region
  most exposed at the deploy hour : region B, 300 requests
  the majority region, which the schedule protects, is at 20
  the schedule protects the region the schedule was chosen from

who is on call at the deploy hour
  in the team region : the middle of the night
  in the exposed regions : working hours, and they are not on this rota
  so the people best placed to see a bad release are the ones with no way
  to report it into the deploy process

deploying per region at each region's own trough
  deploys per release : 4 instead of 1
  exposure per deploy : each region at its own minimum
  total exposure : about 173 against 670 today
  lower, at the cost of 3 extra deploy windows and a version skew
  between regions that has to be designed for

control - a service with one region
  regions : 1, so the aggregate minimum and the only region's minimum are
  the same hour by construction
  the reasoning that produced the problem above is exactly right here

Deploying at the trough exposes fewest users and that reasoning holds. The
trough is a fact about the sum, and the sum is dominated by the region the
schedule was written in.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
