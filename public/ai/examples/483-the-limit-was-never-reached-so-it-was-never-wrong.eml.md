<!-- canonical: efficientnewlanguage.org/ai/examples/483-the-limit-was-never-reached-so-it-was-never-wrong | ai_layer_version: 0.1.0 | updated: 2026-08-21 -->

# Example 483 — The limit was never reached so it was never wrong

`the_limit_was_never_reached_so_it_was_never_wrong.eml` - The limit has been in the config for four years and has never been hit. What is known about the code behind it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The limit has been
# in the config for four years and has never been hit. What is known about the
# code behind it is computed below.
#
# Setting a limit is right and this one is well chosen: it is above every
# legitimate request anybody has made, it protects a downstream that really can
# be overwhelmed, and it has never rejected a good request. On every metric a
# limit is judged by, it is doing its job.
#
# A limit that never binds is also a branch that never runs. Whether the code
# behind it works is a separate question from whether the number is right, and
# four years of never reaching it is four years of not asking.
#
# Both the margin and the exercise count are computed from the same traffic.

# requests per minute, by month, over the last year
[410, 455, 402, 498, 512, 530, 561, 604, 588, 631, 677, 712] => peaks
2000 => configured_limit
len(peaks) => months

0 => highest
for p in peaks:
    if p > highest:
        p => highest

"configured limit : " + str(configured_limit) + " requests per minute" ^0
"highest peak seen: " + str(highest) ^0
"margin           : " + str(configured_limit - highest) + ", which is " + str(int((configured_limit - highest) * 100 / configured_limit)) + "% of the limit" ^0
"" ^0

0 => times_reached
for p in peaks:
    if p >= configured_limit:
        times_reached + 1 => times_reached
"months in which the limit bound : " + str(times_reached) + " of " + str(months) ^0
if times_reached == 0:
    "  so the rejection path has run 0 times in this window" ^0
"" ^0

# ---- what the limit is judged on, and what that judgement covers ----

"how a limit is usually judged" ^0
"  did it reject a legitimate request : no, " + str(times_reached) + " rejections" ^0
"  is the number above real traffic   : yes, by " + str(configured_limit - highest) ^0
"  does the downstream survive        : yes, it has never been asked to" ^0
"  every one of those is about the NUMBER, and none is about the code" ^0
"" ^0

# ---- what the branch behind it does ----
#
# The rejection path was written four years ago against an API that has since
# changed twice. Each of its steps is checked against what exists now.

# [step, still refers to something that exists]
[["build the 429 response", 1], ["read Retry-After from the config key", 0], ["emit the rate_limited metric", 0], ["log with the request id", 1], ["release the connection", 1]] => steps

0 => total_steps
0 => still_valid
for s in steps:
    total_steps + 1 => total_steps
    still_valid + s[1] => still_valid
"the rejection path, step by step" ^0
for s in steps:
    "" => mark
    if s[1] == 1:
        mark + "ok" => mark
    else:
        mark + "REFERS TO SOMETHING GONE" => mark
    "  " + s[0] + " : " + mark ^0
"  steps that still resolve : " + str(still_valid) + " of " + str(total_steps) ^0
if still_valid < total_steps:
    "  " + str(total_steps - still_valid) + " would fail the first time the branch runs, and the first time" ^0
    "  it runs is the minute the downstream is already in trouble" ^0
"" ^0

# ---- growth against the margin ----

peaks[months - 1] - peaks[0] => growth
int(growth * 100 / peaks[0]) => growth_pct
"traffic over the window" ^0
"  first month : " + str(peaks[0]) + ", last month : " + str(peaks[months - 1]) ^0
"  growth : " + str(growth) + ", which is " + str(growth_pct) + "%" ^0
int(growth / (months - 1)) => per_month
if per_month > 0:
    int((configured_limit - highest) / per_month) => months_left
    "  at " + str(per_month) + " a month, the limit binds in about " + str(months_left) + " months" ^0
    "  which is when the " + str(total_steps - still_valid) + " broken steps run for the first time" ^0
"" ^0

# ---- what exercising it costs ----
#
# Not a load test against production. One request with the limit temporarily
# set below current traffic, in a staging environment, runs every step.

"exercising the branch deliberately" ^0
"  requests needed : 1" ^0
"  what it establishes : whether the " + str(total_steps) + " steps resolve" ^0
"  what it does not establish : whether the number is right, which is the" ^0
"  question everybody has been answering for four years" ^0
"" ^0

# ---- the control: a limit that binds regularly ----
#
# Where the limit is reached often, the branch is exercised by the traffic
# itself and its steps cannot rot unnoticed.

[880, 910, 1020, 995, 1100, 1080] => busy_peaks
1000 => busy_limit
0 => busy_reached
for p in busy_peaks:
    if p >= busy_limit:
        busy_reached + 1 => busy_reached
"control - a service whose limit binds most months" ^0
"  months it bound : " + str(busy_reached) + " of " + str(len(busy_peaks)) ^0
if busy_reached > 0:
    "  the rejection path runs in production every month, so a step that stops" ^0
    "  resolving is noticed in that month rather than in four years" ^0
"" ^0

"The number is well chosen and has never turned away a good request. What" ^0
"has never been asked is whether the code behind it still works, and a limit" ^0
"that never binds is a branch that never runs." ^0
```

## Python (deterministic transpilation)

```python
peaks = [410, 455, 402, 498, 512, 530, 561, 604, 588, 631, 677, 712]
configured_limit = 2000
months = len(peaks)
highest = 0
for p in peaks:
    if p > highest:
        highest = p
print("configured limit : " + str(configured_limit) + " requests per minute")
print("highest peak seen: " + str(highest))
print("margin           : " + str(configured_limit - highest) + ", which is " + str(int((configured_limit - highest) * 100 / configured_limit)) + "% of the limit")
print("")
times_reached = 0
for p in peaks:
    if p >= configured_limit:
        times_reached = times_reached + 1
print("months in which the limit bound : " + str(times_reached) + " of " + str(months))
if times_reached == 0:
    print("  so the rejection path has run 0 times in this window")
print("")
print("how a limit is usually judged")
print("  did it reject a legitimate request : no, " + str(times_reached) + " rejections")
print("  is the number above real traffic   : yes, by " + str(configured_limit - highest))
print("  does the downstream survive        : yes, it has never been asked to")
print("  every one of those is about the NUMBER, and none is about the code")
print("")
steps = [["build the 429 response", 1], ["read Retry-After from the config key", 0], ["emit the rate_limited metric", 0], ["log with the request id", 1], ["release the connection", 1]]
total_steps = 0
still_valid = 0
for s in steps:
    total_steps = total_steps + 1
    still_valid = still_valid + s[1]
print("the rejection path, step by step")
for s in steps:
    mark = ""
    if s[1] == 1:
        mark = mark + "ok"
    else:
        mark = mark + "REFERS TO SOMETHING GONE"
    print("  " + s[0] + " : " + mark)
print("  steps that still resolve : " + str(still_valid) + " of " + str(total_steps))
if still_valid < total_steps:
    print("  " + str(total_steps - still_valid) + " would fail the first time the branch runs, and the first time")
    print("  it runs is the minute the downstream is already in trouble")
print("")
growth = peaks[months - 1] - peaks[0]
growth_pct = int(growth * 100 / peaks[0])
print("traffic over the window")
print("  first month : " + str(peaks[0]) + ", last month : " + str(peaks[months - 1]))
print("  growth : " + str(growth) + ", which is " + str(growth_pct) + "%")
per_month = int(growth / (months - 1))
if per_month > 0:
    months_left = int((configured_limit - highest) / per_month)
    print("  at " + str(per_month) + " a month, the limit binds in about " + str(months_left) + " months")
    print("  which is when the " + str(total_steps - still_valid) + " broken steps run for the first time")
print("")
print("exercising the branch deliberately")
print("  requests needed : 1")
print("  what it establishes : whether the " + str(total_steps) + " steps resolve")
print("  what it does not establish : whether the number is right, which is the")
print("  question everybody has been answering for four years")
print("")
busy_peaks = [880, 910, 1020, 995, 1100, 1080]
busy_limit = 1000
busy_reached = 0
for p in busy_peaks:
    if p >= busy_limit:
        busy_reached = busy_reached + 1
print("control - a service whose limit binds most months")
print("  months it bound : " + str(busy_reached) + " of " + str(len(busy_peaks)))
if busy_reached > 0:
    print("  the rejection path runs in production every month, so a step that stops")
    print("  resolving is noticed in that month rather than in four years")
print("")
print("The number is well chosen and has never turned away a good request. What")
print("has never been asked is whether the code behind it still works, and a limit")
print("that never binds is a branch that never runs.")
```

## stdout (executed)

```text
configured limit : 2000 requests per minute
highest peak seen: 712
margin           : 1288, which is 64% of the limit

months in which the limit bound : 0 of 12
  so the rejection path has run 0 times in this window

how a limit is usually judged
  did it reject a legitimate request : no, 0 rejections
  is the number above real traffic   : yes, by 1288
  does the downstream survive        : yes, it has never been asked to
  every one of those is about the NUMBER, and none is about the code

the rejection path, step by step
  build the 429 response : ok
  read Retry-After from the config key : REFERS TO SOMETHING GONE
  emit the rate_limited metric : REFERS TO SOMETHING GONE
  log with the request id : ok
  release the connection : ok
  steps that still resolve : 3 of 5
  2 would fail the first time the branch runs, and the first time
  it runs is the minute the downstream is already in trouble

traffic over the window
  first month : 410, last month : 712
  growth : 302, which is 73%
  at 27 a month, the limit binds in about 47 months
  which is when the 2 broken steps run for the first time

exercising the branch deliberately
  requests needed : 1
  what it establishes : whether the 5 steps resolve
  what it does not establish : whether the number is right, which is the
  question everybody has been answering for four years

control - a service whose limit binds most months
  months it bound : 3 of 6
  the rejection path runs in production every month, so a step that stops
  resolving is noticed in that month rather than in four years

The number is well chosen and has never turned away a good request. What
has never been asked is whether the code behind it still works, and a limit
that never binds is a branch that never runs.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
