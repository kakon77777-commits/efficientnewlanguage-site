<!-- canonical: efficientnewlanguage.org/ai/examples/490-the-team-is-on-the-fast-network | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 490 — The team is on the fast network

`the_team_is_on_the_fast_network.eml` - Every latency measurement the team takes is honest. What population it describes is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every latency
# measurement the team takes is honest. What population it describes is
# computed below.
#
# Measuring locally is right and it is what makes iteration possible. The
# numbers are real, the profiler is not lying, and a change that makes the local
# number better usually makes the remote one better too. Nobody is fooling
# themselves about the measurement.
#
# The team and the users are two populations that never share a device or a
# network. Every developer measurement is taken from one of them, and the
# distribution of the other is not smaller or noisier - it is somewhere else.
#
# Both distributions are computed over the same page.

# [segment, share of users in percent, network round trip ms, device render ms]
[["the team", 0, 4, 40], ["office broadband", 22, 30, 60], ["home broadband", 34, 60, 90], ["good mobile", 28, 140, 180], ["poor mobile", 16, 420, 340]] => segments

len(segments) => n
1200 => payload_kb
0 => user_share
for s in segments:
    user_share + s[1] => user_share

def total_ms(s):
    return s[2] + s[3]

"segments : " + str(n) + " (one of them is the team, with " + str(segments[0][1]) + "% of users)" ^0
"" ^0
"segment            users   network   render   total" ^0
for s in segments:
    "  " + s[0] + "   " + str(s[1]) + "%     " + str(s[2]) + "        " + str(s[3]) + "      " + str(total_ms(s)) ^0
"" ^0

total_ms(segments[0]) => team_ms
"the team's measurement : " + str(team_ms) + " ms, and it is correct" ^0
"" ^0

# ---- the user-weighted figure ----

0 => weighted
for s in segments:
    weighted + total_ms(s) * s[1] => weighted
int(weighted / user_share) => user_mean
"the same page, weighted by where users actually are" ^0
"  user-weighted mean : " + str(user_mean) + " ms" ^0
if user_mean > team_ms:
    "  which is " + str(int(user_mean * 10 / team_ms)) + " tenths of the team's figure" ^0
"" ^0

0 => worst
"" => worst_name
for s in segments:
    if total_ms(s) > worst:
        total_ms(s) => worst
        s[0] => worst_name
"  the slowest segment : " + worst_name + " at " + str(worst) + " ms" ^0
"" ^0

# ---- who is above a threshold ----

1000 => budget
0 => over
for s in segments:
    if total_ms(s) > budget:
        over + s[1] => over
"users over a " + str(budget) + " ms budget : " + str(over) + "%" ^0
if over == 0:
    "  nobody, on this page" ^0
"" ^0

500 => tight
0 => over_tight
for s in segments:
    if total_ms(s) > tight:
        over_tight + s[1] => over_tight
"users over a " + str(tight) + " ms budget : " + str(over_tight) + "%" ^0
if over_tight > 0:
    "  and the team is " + str(int(tight / team_ms)) + " times inside it, so this threshold never fires locally" ^0
"" ^0

# ---- what a change looks like from each side ----
#
# A change that removes fixed work helps everyone equally. A change that
# removes bytes helps in proportion to the network, which is the axis the team
# is at the far end of.

200 => bytes_saved_ms_on_slow
20 => bytes_saved_ms_on_team
"a change that removes " + str(int(payload_kb / 4)) + " KB of payload" ^0
"  measured by the team : " + str(bytes_saved_ms_on_team) + " ms faster, on " + str(team_ms) ^0
"  on poor mobile       : " + str(bytes_saved_ms_on_slow) + " ms faster" ^0
if bytes_saved_ms_on_slow > bytes_saved_ms_on_team:
    "  the local measurement understates it by " + str(int(bytes_saved_ms_on_slow / bytes_saved_ms_on_team)) + " times, so the change" ^0
    "  looks marginal to the person deciding whether to ship it" ^0
"" ^0

# ---- and the reverse ----

"a change that adds a synchronous call before render" ^0
"  measured by the team : " + str(4) + " ms, a rounding error" ^0
"  on poor mobile       : " + str(420) + " ms, one more round trip" ^0
"  the same code, and the two populations disagree about whether it is free" ^0
"" ^0

# ---- what would connect them ----

"what makes the other population visible" ^0
"  field measurement from real sessions : the distribution, not a number" ^0
"  a throttled profile locally          : one point on it, chosen by hand" ^0
"  the second is cheap and is a guess about which segment matters; the first" ^0
"  is the segments themselves" ^0
"" ^0

# ---- the control: a population the team is inside ----
#
# Where the team is a member of the user population, local measurement is
# sampling from it, and the two are not separate at all.

"control - an internal tool the team itself uses daily" ^0
"  the team's share of the user population : large" ^0
"  local measurement : a sample of the real distribution" ^0
"  here the instinct that produced the problem above is simply correct" ^0
"" ^0

"Every local measurement is accurate and the profiler is not lying. It is a" ^0
"measurement of a population the team is the only member of, and the users" ^0
"are in a different one." ^0
```

## Python (deterministic transpilation)

```python
segments = [["the team", 0, 4, 40], ["office broadband", 22, 30, 60], ["home broadband", 34, 60, 90], ["good mobile", 28, 140, 180], ["poor mobile", 16, 420, 340]]
n = len(segments)
payload_kb = 1200
user_share = 0
for s in segments:
    user_share = user_share + s[1]

def total_ms(s):
    return s[2] + s[3]

print("segments : " + str(n) + " (one of them is the team, with " + str(segments[0][1]) + "% of users)")
print("")
print("segment            users   network   render   total")
for s in segments:
    print("  " + s[0] + "   " + str(s[1]) + "%     " + str(s[2]) + "        " + str(s[3]) + "      " + str(total_ms(s)))
print("")
team_ms = total_ms(segments[0])
print("the team's measurement : " + str(team_ms) + " ms, and it is correct")
print("")
weighted = 0
for s in segments:
    weighted = weighted + total_ms(s) * s[1]
user_mean = int(weighted / user_share)
print("the same page, weighted by where users actually are")
print("  user-weighted mean : " + str(user_mean) + " ms")
if user_mean > team_ms:
    print("  which is " + str(int(user_mean * 10 / team_ms)) + " tenths of the team's figure")
print("")
worst = 0
worst_name = ""
for s in segments:
    if total_ms(s) > worst:
        worst = total_ms(s)
        worst_name = s[0]
print("  the slowest segment : " + worst_name + " at " + str(worst) + " ms")
print("")
budget = 1000
over = 0
for s in segments:
    if total_ms(s) > budget:
        over = over + s[1]
print("users over a " + str(budget) + " ms budget : " + str(over) + "%")
if over == 0:
    print("  nobody, on this page")
print("")
tight = 500
over_tight = 0
for s in segments:
    if total_ms(s) > tight:
        over_tight = over_tight + s[1]
print("users over a " + str(tight) + " ms budget : " + str(over_tight) + "%")
if over_tight > 0:
    print("  and the team is " + str(int(tight / team_ms)) + " times inside it, so this threshold never fires locally")
print("")
bytes_saved_ms_on_slow = 200
bytes_saved_ms_on_team = 20
print("a change that removes " + str(int(payload_kb / 4)) + " KB of payload")
print("  measured by the team : " + str(bytes_saved_ms_on_team) + " ms faster, on " + str(team_ms))
print("  on poor mobile       : " + str(bytes_saved_ms_on_slow) + " ms faster")
if bytes_saved_ms_on_slow > bytes_saved_ms_on_team:
    print("  the local measurement understates it by " + str(int(bytes_saved_ms_on_slow / bytes_saved_ms_on_team)) + " times, so the change")
    print("  looks marginal to the person deciding whether to ship it")
print("")
print("a change that adds a synchronous call before render")
print("  measured by the team : " + str(4) + " ms, a rounding error")
print("  on poor mobile       : " + str(420) + " ms, one more round trip")
print("  the same code, and the two populations disagree about whether it is free")
print("")
print("what makes the other population visible")
print("  field measurement from real sessions : the distribution, not a number")
print("  a throttled profile locally          : one point on it, chosen by hand")
print("  the second is cheap and is a guess about which segment matters; the first")
print("  is the segments themselves")
print("")
print("control - an internal tool the team itself uses daily")
print("  the team's share of the user population : large")
print("  local measurement : a sample of the real distribution")
print("  here the instinct that produced the problem above is simply correct")
print("")
print("Every local measurement is accurate and the profiler is not lying. It is a")
print("measurement of a population the team is the only member of, and the users")
print("are in a different one.")
```

## stdout (executed)

```text
segments : 5 (one of them is the team, with 0% of users)

segment            users   network   render   total
  the team   0%     4        40      44
  office broadband   22%     30        60      90
  home broadband   34%     60        90      150
  good mobile   28%     140        180      320
  poor mobile   16%     420        340      760

the team's measurement : 44 ms, and it is correct

the same page, weighted by where users actually are
  user-weighted mean : 282 ms
  which is 64 tenths of the team's figure

  the slowest segment : poor mobile at 760 ms

users over a 1000 ms budget : 0%
  nobody, on this page

users over a 500 ms budget : 16%
  and the team is 11 times inside it, so this threshold never fires locally

a change that removes 300 KB of payload
  measured by the team : 20 ms faster, on 44
  on poor mobile       : 200 ms faster
  the local measurement understates it by 10 times, so the change
  looks marginal to the person deciding whether to ship it

a change that adds a synchronous call before render
  measured by the team : 4 ms, a rounding error
  on poor mobile       : 420 ms, one more round trip
  the same code, and the two populations disagree about whether it is free

what makes the other population visible
  field measurement from real sessions : the distribution, not a number
  a throttled profile locally          : one point on it, chosen by hand
  the second is cheap and is a guess about which segment matters; the first
  is the segments themselves

control - an internal tool the team itself uses daily
  the team's share of the user population : large
  local measurement : a sample of the real distribution
  here the instinct that produced the problem above is simply correct

Every local measurement is accurate and the profiler is not lying. It is a
measurement of a population the team is the only member of, and the users
are in a different one.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
