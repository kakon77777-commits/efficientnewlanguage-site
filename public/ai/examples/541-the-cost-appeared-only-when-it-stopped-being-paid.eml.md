<!-- canonical: efficientnewlanguage.org/ai/examples/541-the-cost-appeared-only-when-it-stopped-being-paid | ai_layer_version: 0.1.0 | updated: 2026-08-25 -->

# Example 541 — The cost appeared only when it stopped being paid

`the_cost_appeared_only_when_it_stopped_being_paid.eml` - A weekly maintenance job was cancelled after 140 runs that each reported nothing found. When the bill arrived, and who was blamed for it, are computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A weekly
# maintenance job was cancelled after 140 runs that each reported nothing
# found. When the bill arrived, and who was blamed for it, are computed below.
#
# Cancelling it was the correct reading of the evidence. It had run every week
# for nearly three years, it cost six engineer-hours each time, and its own log
# line said "0 problems found" on all 140 occasions. Every measure available to
# the person deciding said the job produced nothing. Keeping work that has
# never once produced an output is how a team ends up with no time for the work
# that does.
#
# The difficulty is that "0 problems found" is what a job prints when it is
# working, and also what it prints when it is pointless. The two worlds emit
# the same log, so the log cannot tell them apart, and the log was the whole
# case for cancellation.
#
# What separates them is what happens afterwards, and afterwards is far away.
# The consequence accumulates a little each week and crosses the threshold long
# after the change that caused it has left everyone's memory and, more
# importantly, left the window the team searches when something breaks.

120 => base_ms
250 => sla_ms
12 => frag_points_per_week
7 => attribution_window_days

140 => runs
6 => hours_per_run

"the job as the ledger recorded it" ^0
"  runs            : " + str(runs) ^0
"  hours per run   : " + str(hours_per_run) ^0
"  hours spent     : " + str(runs * hours_per_run) ^0
"  problems found  : 0" ^0
"  problems found per run : 0" ^0
"  on this evidence the job returns nothing for " + str(runs * hours_per_run) + " hours" ^0
"" ^0

# ---- what the two worlds print ----

"world A - the job was unnecessary" ^0
"  weekly log line : 0 problems found" ^0
"world B - the job was preventing the problem" ^0
"  weekly log line : 0 problems found" ^0
"  the observation does not distinguish them, and it is the only one taken" ^0
"" ^0

# ---- after it stopped ----

0 => week
0 => frag
0 => breach_week
0 => breach_ms
"week   fragmentation   query ms   sla" ^0
for w in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]:
    w * frag_points_per_week => frag
    int(base_ms * (100 + frag) / 100) => q
    if breach_week == 0:
        if q > sla_ms:
            w => breach_week
            q => breach_ms
    "  w" + str(w) + "     " + str(frag) + "              " + str(q) + "        " + str(sla_ms) ^0
"" ^0

breach_week * 7 => lag_days
"  breach at week  : " + str(breach_week) + ", query time " + str(breach_ms) + " ms against a " + str(sla_ms) + " ms limit" ^0
"  days since the cancellation : " + str(lag_days) ^0
"  attribution window          : " + str(attribution_window_days) + " days" ^0
"  the cause is outside the window by a factor of " + str(int(lag_days / attribution_window_days)) ^0
"" ^0

# ---- what was inside the window ----

# [change, days before the incident, related to the cause]
[["checkout copy edit", 1, "no"], ["dependency bump", 2, "no"], ["new dashboard panel", 4, "no"], ["log format change", 6, "no"]] => candidates

"changes inside the " + str(attribution_window_days) + "-day window" ^0
0 => related
for c in candidates:
    if c[2] == "yes":
        related + 1 => related
    "  " + c[0] + ", " + str(c[1]) + " days before, related: " + c[2] ^0
"  candidates examined : " + str(len(candidates)) ^0
"  candidates related to the cause : " + str(related) ^0
"  the window was searched correctly and completely, and contained nothing" ^0
"" ^0

# ---- the control ----
#
# A second job was cancelled in the same week. Its effect is immediate rather
# than cumulative, and the same team using the same process diagnosed it in a
# day. The process is not the weakness.

1 => control_lag_days
"control - the other job cancelled that week" ^0
"  job              : cache warmer, also cancelled, also 0 problems found" ^0
"  effect appears after : " + str(control_lag_days) + " day" ^0
"  inside the " + str(attribution_window_days) + "-day window : yes" ^0
"  correctly diagnosed  : yes, next morning, restored the same day" ^0
"  the difference between the two cases is not the team and not the" ^0
"  reasoning, it is " + str(lag_days) + " days against " + str(control_lag_days) ^0
"" ^0

# ---- the two bills ----

40 => incident_hours
"what each choice cost" ^0
"  keeping the job    : " + str(runs * hours_per_run) + " hours, visible, on a line item, every week" ^0
"  cancelling the job : " + str(incident_hours) + " hours of incident plus " + str(lag_days) + " days of degradation" ^0
"  cancelling looks cheaper on any report that covers " + str(attribution_window_days) + " days" ^0
"  and on any report that covers less than " + str(lag_days) ^0
"" ^0

"Cancelling was the right reading of the evidence: " + str(runs) + " runs, 0 findings," ^0
str(runs * hours_per_run) + " hours. A preventive job prints the same line whether it is working" ^0
"or useless, and the bill arrived " + str(lag_days) + " days later, " + str(int(lag_days / attribution_window_days)) + " windows outside the" ^0
"search. The " + str(len(candidates)) + " changes that were examined were all innocent." ^0
```

## Python (deterministic transpilation)

```python
base_ms = 120
sla_ms = 250
frag_points_per_week = 12
attribution_window_days = 7
runs = 140
hours_per_run = 6
print("the job as the ledger recorded it")
print("  runs            : " + str(runs))
print("  hours per run   : " + str(hours_per_run))
print("  hours spent     : " + str(runs * hours_per_run))
print("  problems found  : 0")
print("  problems found per run : 0")
print("  on this evidence the job returns nothing for " + str(runs * hours_per_run) + " hours")
print("")
print("world A - the job was unnecessary")
print("  weekly log line : 0 problems found")
print("world B - the job was preventing the problem")
print("  weekly log line : 0 problems found")
print("  the observation does not distinguish them, and it is the only one taken")
print("")
week = 0
frag = 0
breach_week = 0
breach_ms = 0
print("week   fragmentation   query ms   sla")
for w in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]:
    frag = w * frag_points_per_week
    q = int(base_ms * (100 + frag) / 100)
    if breach_week == 0:
        if q > sla_ms:
            breach_week = w
            breach_ms = q
    print("  w" + str(w) + "     " + str(frag) + "              " + str(q) + "        " + str(sla_ms))
print("")
lag_days = breach_week * 7
print("  breach at week  : " + str(breach_week) + ", query time " + str(breach_ms) + " ms against a " + str(sla_ms) + " ms limit")
print("  days since the cancellation : " + str(lag_days))
print("  attribution window          : " + str(attribution_window_days) + " days")
print("  the cause is outside the window by a factor of " + str(int(lag_days / attribution_window_days)))
print("")
candidates = [["checkout copy edit", 1, "no"], ["dependency bump", 2, "no"], ["new dashboard panel", 4, "no"], ["log format change", 6, "no"]]
print("changes inside the " + str(attribution_window_days) + "-day window")
related = 0
for c in candidates:
    if c[2] == "yes":
        related = related + 1
    print("  " + c[0] + ", " + str(c[1]) + " days before, related: " + c[2])
print("  candidates examined : " + str(len(candidates)))
print("  candidates related to the cause : " + str(related))
print("  the window was searched correctly and completely, and contained nothing")
print("")
control_lag_days = 1
print("control - the other job cancelled that week")
print("  job              : cache warmer, also cancelled, also 0 problems found")
print("  effect appears after : " + str(control_lag_days) + " day")
print("  inside the " + str(attribution_window_days) + "-day window : yes")
print("  correctly diagnosed  : yes, next morning, restored the same day")
print("  the difference between the two cases is not the team and not the")
print("  reasoning, it is " + str(lag_days) + " days against " + str(control_lag_days))
print("")
incident_hours = 40
print("what each choice cost")
print("  keeping the job    : " + str(runs * hours_per_run) + " hours, visible, on a line item, every week")
print("  cancelling the job : " + str(incident_hours) + " hours of incident plus " + str(lag_days) + " days of degradation")
print("  cancelling looks cheaper on any report that covers " + str(attribution_window_days) + " days")
print("  and on any report that covers less than " + str(lag_days))
print("")
print("Cancelling was the right reading of the evidence: " + str(runs) + " runs, 0 findings,")
print(str(runs * hours_per_run) + " hours. A preventive job prints the same line whether it is working")
print("or useless, and the bill arrived " + str(lag_days) + " days later, " + str(int(lag_days / attribution_window_days)) + " windows outside the")
print("search. The " + str(len(candidates)) + " changes that were examined were all innocent.")
```

## stdout (executed)

```text
the job as the ledger recorded it
  runs            : 140
  hours per run   : 6
  hours spent     : 840
  problems found  : 0
  problems found per run : 0
  on this evidence the job returns nothing for 840 hours

world A - the job was unnecessary
  weekly log line : 0 problems found
world B - the job was preventing the problem
  weekly log line : 0 problems found
  the observation does not distinguish them, and it is the only one taken

week   fragmentation   query ms   sla
  w1     12              134        250
  w2     24              148        250
  w3     36              163        250
  w4     48              177        250
  w5     60              192        250
  w6     72              206        250
  w7     84              220        250
  w8     96              235        250
  w9     108              249        250
  w10     120              264        250
  w11     132              278        250

  breach at week  : 10, query time 264 ms against a 250 ms limit
  days since the cancellation : 70
  attribution window          : 7 days
  the cause is outside the window by a factor of 10

changes inside the 7-day window
  checkout copy edit, 1 days before, related: no
  dependency bump, 2 days before, related: no
  new dashboard panel, 4 days before, related: no
  log format change, 6 days before, related: no
  candidates examined : 4
  candidates related to the cause : 0
  the window was searched correctly and completely, and contained nothing

control - the other job cancelled that week
  job              : cache warmer, also cancelled, also 0 problems found
  effect appears after : 1 day
  inside the 7-day window : yes
  correctly diagnosed  : yes, next morning, restored the same day
  the difference between the two cases is not the team and not the
  reasoning, it is 70 days against 1

what each choice cost
  keeping the job    : 840 hours, visible, on a line item, every week
  cancelling the job : 40 hours of incident plus 70 days of degradation
  cancelling looks cheaper on any report that covers 7 days
  and on any report that covers less than 70

Cancelling was the right reading of the evidence: 140 runs, 0 findings,
840 hours. A preventive job prints the same line whether it is working
or useless, and the bill arrived 70 days later, 10 windows outside the
search. The 4 changes that were examined were all innocent.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
