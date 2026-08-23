<!-- canonical: efficientnewlanguage.org/ai/examples/514-the-limit-was-raised-and-the-polling-followed-it | ai_layer_version: 0.1.0 | updated: 2026-08-23 -->

# Example 514 — The limit was raised and the polling followed it

`the_limit_was_raised_and_the_polling_followed_it.eml` - A rate limit was raised from 60 to 300 requests a minute. What the callers did with the extra allowance is computed below, alongside how often the answer had changed.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A rate limit was
# raised from 60 to 300 requests a minute. What the callers did with the extra
# allowance is computed below, alongside how often the answer had changed.
#
# Raising the limit was correct. Four integrators were being throttled during
# their morning sync, the throttles were producing retries, the retries were
# producing support tickets, and the service had headroom it was not using.
# Removing a limit that is generating work for everybody is a good change.
#
# A polling client has no natural interval. It has a limit, and it polls at
# whatever the limit permits, because a client author who leaves allowance
# unused gets stale data for no reason. The limit was not restraining an
# independent demand - it was setting one.
#
# The polls and the changes are counted separately below.

# [caller, polls per minute before, polls per minute after, seconds between real changes]
[["alpha", 60, 300, 900], ["bravo", 58, 300, 900], ["charlie", 60, 290, 900], ["delta", 12, 12, 900], ["echo", 60, 300, 60]] => callers

len(callers) => n
60 => limit_before
300 => limit_after

"caller    polls/min before   after   seconds between real changes" ^0
for c in callers:
    "  " + c[0] + "     " + str(c[1]) + "                 " + str(c[2]) + "     " + str(c[3]) ^0
"" ^0

0 => before_total
0 => after_total
for c in callers:
    before_total + c[1] => before_total
    after_total + c[2] => after_total
"limit  : " + str(limit_before) + " -> " + str(limit_after) + " requests a minute" ^0
"polls  : " + str(before_total) + " -> " + str(after_total) + " a minute, " + str(int(after_total * 100 / before_total)) + " per 100" ^0
"" ^0

# ---- who was pinned to the limit ----

0 => pinned_before
0 => pinned_after
for c in callers:
    if c[1] * 100 >= limit_before * 95:
        pinned_before + 1 => pinned_before
    if c[2] * 100 >= limit_after * 95:
        pinned_after + 1 => pinned_after
"callers polling within 5% of the limit" ^0
"  before : " + str(pinned_before) + " of " + str(n) ^0
"  after  : " + str(pinned_after) + " of " + str(n) ^0
"  the same callers sit against the limit at either value, which is what a" ^0
"  limit-shaped demand looks like" ^0
"" ^0

# ---- how much of the polling can return anything new ----

def useful(polls, change_secs):
    # polls a minute that can possibly see a change the previous poll missed
    if change_secs <= 60:
        return polls
    return int(60 / change_secs) + 1

"polls a minute that can return something new" ^0
0 => new_before
0 => new_after
for c in callers:
    useful(c[1], c[3]) => u
    new_before + u => new_before
    new_after + useful(c[2], c[3]) => new_after
    "  " + c[0] + " : " + str(c[2]) + " polls, at most " + str(useful(c[2], c[3])) + " can differ from the one before" ^0
"  informative polls a minute : " + str(new_before) + " -> " + str(new_after) ^0
"  total polls a minute       : " + str(before_total) + " -> " + str(after_total) ^0
"  the informative count is a property of how often the data changes, so" ^0
"  raising the limit did not move it" ^0
"" ^0

# ---- what the extra requests carry ----

after_total - new_after => repeats_after
before_total - new_before => repeats_before
"identical responses per minute" ^0
"  before : " + str(repeats_before) + " of " + str(before_total) + ", " + str(int(repeats_before * 100 / before_total)) + "%" ^0
"  after  : " + str(repeats_after) + " of " + str(after_total) + ", " + str(int(repeats_after * 100 / after_total)) + "%" ^0
"  added by the change : " + str(repeats_after - repeats_before) + " identical responses a minute" ^0
"  which is " + str((repeats_after - repeats_before) * 60 * 24) + " a day" ^0
"" ^0

# ---- what the change bought ----

"the problem the change was made to fix" ^0
"  callers being throttled before : " + str(pinned_before) ^0
"  throttles now                  : 0" ^0
"  retries caused by throttling   : 0" ^0
"  support tickets from throttling: 0" ^0
"  every one of those is a real improvement and none of them came back" ^0
"" ^0

"the freshness it was supposed to buy" ^0
for c in callers:
    if c[3] > 60:
        "  " + c[0] + " : data changes every " + str(c[3]) + "s, polled every " + str(int(60000 / c[2])) + "ms" ^0
"  a client polling faster than the data changes learns nothing on the" ^0
"  extra polls, and the interval is set by the limit rather than by the" ^0
"  change rate, which nobody on the caller side can see" ^0
"" ^0

# ---- the caller that did not move ----

for c in callers:
    if c[1] == c[2]:
        "the one caller whose rate did not change" ^0
        "  " + c[0] + " : " + str(c[1]) + " polls a minute before and after" ^0
        "  it polls on a schedule of its own rather than against the limit" ^0
        "  its share of the traffic : " + str(int(c[1] * 100 / before_total)) + "% before, " + str(int(c[2] * 100 / after_total)) + "% after" ^0
"" ^0

# ---- the control: a caller whose data really does change fast ----
#
# Where the data changes faster than the old limit allowed polling, the extra
# allowance buys freshness that was genuinely unavailable before.

for c in callers:
    if c[3] <= 60:
        "control - " + c[0] + ", data changes every " + str(c[3]) + "s" ^0
        "  polls that can differ from the previous one : " + str(useful(c[2], c[3])) + " of " + str(c[2]) ^0
        "  before the change : " + str(useful(c[1], c[3])) + " of " + str(c[1]) ^0
        "  here every extra poll can return something new, so the raise bought" ^0
        "  exactly what it looked like it was buying" ^0
"" ^0

"Raising the limit removed real throttling, real retries and real tickets," ^0
"and none of those came back. A polling client polls at its limit, so the" ^0
"limit set the demand, and " + str(int(repeats_after * 100 / after_total)) + "% of the responses are now identical." ^0
```

## Python (deterministic transpilation)

```python
callers = [["alpha", 60, 300, 900], ["bravo", 58, 300, 900], ["charlie", 60, 290, 900], ["delta", 12, 12, 900], ["echo", 60, 300, 60]]
n = len(callers)
limit_before = 60
limit_after = 300
print("caller    polls/min before   after   seconds between real changes")
for c in callers:
    print("  " + c[0] + "     " + str(c[1]) + "                 " + str(c[2]) + "     " + str(c[3]))
print("")
before_total = 0
after_total = 0
for c in callers:
    before_total = before_total + c[1]
    after_total = after_total + c[2]
print("limit  : " + str(limit_before) + " -> " + str(limit_after) + " requests a minute")
print("polls  : " + str(before_total) + " -> " + str(after_total) + " a minute, " + str(int(after_total * 100 / before_total)) + " per 100")
print("")
pinned_before = 0
pinned_after = 0
for c in callers:
    if c[1] * 100 >= limit_before * 95:
        pinned_before = pinned_before + 1
    if c[2] * 100 >= limit_after * 95:
        pinned_after = pinned_after + 1
print("callers polling within 5% of the limit")
print("  before : " + str(pinned_before) + " of " + str(n))
print("  after  : " + str(pinned_after) + " of " + str(n))
print("  the same callers sit against the limit at either value, which is what a")
print("  limit-shaped demand looks like")
print("")

def useful(polls, change_secs):
    if change_secs <= 60:
        return polls
    return int(60 / change_secs) + 1

print("polls a minute that can return something new")
new_before = 0
new_after = 0
for c in callers:
    u = useful(c[1], c[3])
    new_before = new_before + u
    new_after = new_after + useful(c[2], c[3])
    print("  " + c[0] + " : " + str(c[2]) + " polls, at most " + str(useful(c[2], c[3])) + " can differ from the one before")
print("  informative polls a minute : " + str(new_before) + " -> " + str(new_after))
print("  total polls a minute       : " + str(before_total) + " -> " + str(after_total))
print("  the informative count is a property of how often the data changes, so")
print("  raising the limit did not move it")
print("")
repeats_after = after_total - new_after
repeats_before = before_total - new_before
print("identical responses per minute")
print("  before : " + str(repeats_before) + " of " + str(before_total) + ", " + str(int(repeats_before * 100 / before_total)) + "%")
print("  after  : " + str(repeats_after) + " of " + str(after_total) + ", " + str(int(repeats_after * 100 / after_total)) + "%")
print("  added by the change : " + str(repeats_after - repeats_before) + " identical responses a minute")
print("  which is " + str((repeats_after - repeats_before) * 60 * 24) + " a day")
print("")
print("the problem the change was made to fix")
print("  callers being throttled before : " + str(pinned_before))
print("  throttles now                  : 0")
print("  retries caused by throttling   : 0")
print("  support tickets from throttling: 0")
print("  every one of those is a real improvement and none of them came back")
print("")
print("the freshness it was supposed to buy")
for c in callers:
    if c[3] > 60:
        print("  " + c[0] + " : data changes every " + str(c[3]) + "s, polled every " + str(int(60000 / c[2])) + "ms")
print("  a client polling faster than the data changes learns nothing on the")
print("  extra polls, and the interval is set by the limit rather than by the")
print("  change rate, which nobody on the caller side can see")
print("")
for c in callers:
    if c[1] == c[2]:
        print("the one caller whose rate did not change")
        print("  " + c[0] + " : " + str(c[1]) + " polls a minute before and after")
        print("  it polls on a schedule of its own rather than against the limit")
        print("  its share of the traffic : " + str(int(c[1] * 100 / before_total)) + "% before, " + str(int(c[2] * 100 / after_total)) + "% after")
print("")
for c in callers:
    if c[3] <= 60:
        print("control - " + c[0] + ", data changes every " + str(c[3]) + "s")
        print("  polls that can differ from the previous one : " + str(useful(c[2], c[3])) + " of " + str(c[2]))
        print("  before the change : " + str(useful(c[1], c[3])) + " of " + str(c[1]))
        print("  here every extra poll can return something new, so the raise bought")
        print("  exactly what it looked like it was buying")
print("")
print("Raising the limit removed real throttling, real retries and real tickets,")
print("and none of those came back. A polling client polls at its limit, so the")
print("limit set the demand, and " + str(int(repeats_after * 100 / after_total)) + "% of the responses are now identical.")
```

## stdout (executed)

```text
caller    polls/min before   after   seconds between real changes
  alpha     60                 300     900
  bravo     58                 300     900
  charlie     60                 290     900
  delta     12                 12     900
  echo     60                 300     60

limit  : 60 -> 300 requests a minute
polls  : 250 -> 1202 a minute, 480 per 100

callers polling within 5% of the limit
  before : 4 of 5
  after  : 4 of 5
  the same callers sit against the limit at either value, which is what a
  limit-shaped demand looks like

polls a minute that can return something new
  alpha : 300 polls, at most 1 can differ from the one before
  bravo : 300 polls, at most 1 can differ from the one before
  charlie : 290 polls, at most 1 can differ from the one before
  delta : 12 polls, at most 1 can differ from the one before
  echo : 300 polls, at most 300 can differ from the one before
  informative polls a minute : 64 -> 304
  total polls a minute       : 250 -> 1202
  the informative count is a property of how often the data changes, so
  raising the limit did not move it

identical responses per minute
  before : 186 of 250, 74%
  after  : 898 of 1202, 74%
  added by the change : 712 identical responses a minute
  which is 1025280 a day

the problem the change was made to fix
  callers being throttled before : 4
  throttles now                  : 0
  retries caused by throttling   : 0
  support tickets from throttling: 0
  every one of those is a real improvement and none of them came back

the freshness it was supposed to buy
  alpha : data changes every 900s, polled every 200ms
  bravo : data changes every 900s, polled every 200ms
  charlie : data changes every 900s, polled every 206ms
  delta : data changes every 900s, polled every 5000ms
  a client polling faster than the data changes learns nothing on the
  extra polls, and the interval is set by the limit rather than by the
  change rate, which nobody on the caller side can see

the one caller whose rate did not change
  delta : 12 polls a minute before and after
  it polls on a schedule of its own rather than against the limit
  its share of the traffic : 4% before, 0% after

control - echo, data changes every 60s
  polls that can differ from the previous one : 300 of 300
  before the change : 60 of 60
  here every extra poll can return something new, so the raise bought
  exactly what it looked like it was buying

Raising the limit removed real throttling, real retries and real tickets,
and none of those came back. A polling client polls at its limit, so the
limit set the demand, and 74% of the responses are now identical.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
