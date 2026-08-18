<!-- canonical: efficientnewlanguage.org/ai/examples/445-the-timeout-was-raised-because-it-was-the-adjustable-number | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 445 — The timeout was raised because it was the adjustable number

`the_timeout_was_raised_because_it_was_the_adjustable_number.eml` - The dependency got slower. The timeout was raised. How many calls that changed is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The dependency got
# slower. The timeout was raised. How many calls that changed is computed below.
#
# Raising the timeout was the right move available. The dependency belongs to
# another team, the latency was real and not a defect, and the calls that were
# timing out were calls that would have succeeded given another two seconds.
# Failing them was worse than waiting for them.
#
# The timeout is also the only number in the whole chain that the calling team
# can edit, so it is the number that gets edited whatever the problem turns out
# to be. What a raise does is move calls from one column to another; what it
# cannot do is make a call faster.
#
# Each bucket of calls is counted under both settings.

# latency buckets: [upper bound in ms, calls per minute]
[[500, 820], [1000, 240], [2000, 95], [3000, 60], [5000, 40], [9000, 25]] => buckets

1000 => old_timeout
5000 => new_timeout

def calls_total():
    0 => t
    for b in buckets:
        t + b[1] => t
    return t

def timed_out(limit):
    0 => t
    for b in buckets:
        if b[0] > limit:
            t + b[1] => t
    return t

def held_ms(limit):
    0 => t
    for b in buckets:
        if b[0] > limit:
            t + b[1] * limit => t
        else:
            t + b[1] * b[0] => t
    return t

"calls per minute : " + str(calls_total()) ^0
"" ^0
"                        timeout " + str(old_timeout) + "ms   timeout " + str(new_timeout) + "ms" ^0
"  calls that fail       " + str(timed_out(old_timeout)) + "              " + str(timed_out(new_timeout)) ^0
"  calls that succeed    " + str(calls_total() - timed_out(old_timeout)) + "              " + str(calls_total() - timed_out(new_timeout)) ^0
"" ^0

if timed_out(new_timeout) < timed_out(old_timeout):
    "the raise turns " + str(timed_out(old_timeout) - timed_out(new_timeout)) + " failures per minute into successes" ^0
    "and those calls were always going to succeed; they were being cut off" ^0
"" ^0

# ---- what did not change ----

0 => slow_calls
for b in buckets:
    if b[0] > old_timeout:
        slow_calls + b[1] => slow_calls
"calls taking longer than " + str(old_timeout) + "ms" ^0
"  before the raise : " + str(slow_calls) ^0
"  after the raise  : " + str(slow_calls) ^0
"  the dependency was not touched, so this number cannot move" ^0
"" ^0

# ---- what the waiting costs ----
#
# A call that waits is a call holding a connection. The same raise that removes
# the errors multiplies the time the caller spends holding them.

"connection-time held, in call-milliseconds per minute" ^0
"  at " + str(old_timeout) + "ms : " + str(held_ms(old_timeout)) ^0
"  at " + str(new_timeout) + "ms : " + str(held_ms(new_timeout)) ^0
if held_ms(new_timeout) > held_ms(old_timeout):
    "  up by " + str(held_ms(new_timeout) - held_ms(old_timeout)) + ", which is " + str(int(held_ms(new_timeout) * 100 / held_ms(old_timeout)) - 100) + "%" ^0
"" ^0

200 => pool
"a pool of " + str(pool) + " connections" ^0
int(held_ms(old_timeout) / 60000) => need_old
int(held_ms(new_timeout) / 60000) => need_new
"  connections busy on average, before : " + str(need_old) ^0
"  connections busy on average, after  : " + str(need_new) ^0
if need_new > pool:
    "  over the pool by " + str(need_new - pool) + ", so the queue is the new failure" ^0
else:
    "  still inside the pool, with " + str(pool - need_new) + " to spare" ^0
"" ^0

# ---- the calls the raise still does not save ----

0 => slowest
for b in buckets:
    if b[0] > slowest:
        b[0] => slowest
"calls still failing at " + str(new_timeout) + "ms" ^0
for b in buckets:
    if b[0] > new_timeout:
        "  the " + str(b[1]) + " calls in the up-to-" + str(b[0]) + "ms bucket" ^0
"  raising again would take them, at the cost of holding for " + str(slowest) + "ms" ^0
"" ^0

# ---- the knobs, and who owns each ----

"what could have been changed, and by whom" ^0
"  the timeout            : the calling team" ^0
"  the dependency latency : the owning team" ^0
"  the call volume        : the calling team, but it is user traffic" ^0
"  the pool size          : the calling team, and it moves the same cost" ^0
"  one of those four is both owned here and free, and it is the one that moved" ^0
"" ^0

# ---- the control: a raise on a dependency that is not slow ----
#
# Where nothing is near the limit, raising the timeout changes no call at all,
# so a deployment of the same change proves nothing about whether it helps.

[[100, 500], [200, 300], [400, 100]] => fast
0 => f_total
for b in fast:
    f_total + b[1] => f_total
0 => f_old
0 => f_new
for b in fast:
    if b[0] > old_timeout:
        f_old + b[1] => f_old
    if b[0] > new_timeout:
        f_new + b[1] => f_new
"control - the same raise against a fast dependency" ^0
"  calls : " + str(f_total) + ", failing before : " + str(f_old) + ", failing after : " + str(f_new) ^0
if f_old == f_new:
    "  identical, so this service cannot show whether raising the timeout helps" ^0
"" ^0

"The raise was correct and it recovered calls that deserved to succeed. It" ^0
"moved every one of them from the error column into the waiting column, and" ^0
"which column a call sits in is the part the calling team owns." ^0
```

## Python (deterministic transpilation)

```python
buckets = [[500, 820], [1000, 240], [2000, 95], [3000, 60], [5000, 40], [9000, 25]]
old_timeout = 1000
new_timeout = 5000

def calls_total():
    t = 0
    for b in buckets:
        t = t + b[1]
    return t

def timed_out(limit):
    t = 0
    for b in buckets:
        if b[0] > limit:
            t = t + b[1]
    return t

def held_ms(limit):
    t = 0
    for b in buckets:
        if b[0] > limit:
            t = t + b[1] * limit
        else:
            t = t + b[1] * b[0]
    return t

print("calls per minute : " + str(calls_total()))
print("")
print("                        timeout " + str(old_timeout) + "ms   timeout " + str(new_timeout) + "ms")
print("  calls that fail       " + str(timed_out(old_timeout)) + "              " + str(timed_out(new_timeout)))
print("  calls that succeed    " + str(calls_total() - timed_out(old_timeout)) + "              " + str(calls_total() - timed_out(new_timeout)))
print("")
if timed_out(new_timeout) < timed_out(old_timeout):
    print("the raise turns " + str(timed_out(old_timeout) - timed_out(new_timeout)) + " failures per minute into successes")
    print("and those calls were always going to succeed; they were being cut off")
print("")
slow_calls = 0
for b in buckets:
    if b[0] > old_timeout:
        slow_calls = slow_calls + b[1]
print("calls taking longer than " + str(old_timeout) + "ms")
print("  before the raise : " + str(slow_calls))
print("  after the raise  : " + str(slow_calls))
print("  the dependency was not touched, so this number cannot move")
print("")
print("connection-time held, in call-milliseconds per minute")
print("  at " + str(old_timeout) + "ms : " + str(held_ms(old_timeout)))
print("  at " + str(new_timeout) + "ms : " + str(held_ms(new_timeout)))
if held_ms(new_timeout) > held_ms(old_timeout):
    print("  up by " + str(held_ms(new_timeout) - held_ms(old_timeout)) + ", which is " + str(int(held_ms(new_timeout) * 100 / held_ms(old_timeout)) - 100) + "%")
print("")
pool = 200
print("a pool of " + str(pool) + " connections")
need_old = int(held_ms(old_timeout) / 60000)
need_new = int(held_ms(new_timeout) / 60000)
print("  connections busy on average, before : " + str(need_old))
print("  connections busy on average, after  : " + str(need_new))
if need_new > pool:
    print("  over the pool by " + str(need_new - pool) + ", so the queue is the new failure")
else:
    print("  still inside the pool, with " + str(pool - need_new) + " to spare")
print("")
slowest = 0
for b in buckets:
    if b[0] > slowest:
        slowest = b[0]
print("calls still failing at " + str(new_timeout) + "ms")
for b in buckets:
    if b[0] > new_timeout:
        print("  the " + str(b[1]) + " calls in the up-to-" + str(b[0]) + "ms bucket")
print("  raising again would take them, at the cost of holding for " + str(slowest) + "ms")
print("")
print("what could have been changed, and by whom")
print("  the timeout            : the calling team")
print("  the dependency latency : the owning team")
print("  the call volume        : the calling team, but it is user traffic")
print("  the pool size          : the calling team, and it moves the same cost")
print("  one of those four is both owned here and free, and it is the one that moved")
print("")
fast = [[100, 500], [200, 300], [400, 100]]
f_total = 0
for b in fast:
    f_total = f_total + b[1]
f_old = 0
f_new = 0
for b in fast:
    if b[0] > old_timeout:
        f_old = f_old + b[1]
    if b[0] > new_timeout:
        f_new = f_new + b[1]
print("control - the same raise against a fast dependency")
print("  calls : " + str(f_total) + ", failing before : " + str(f_old) + ", failing after : " + str(f_new))
if f_old == f_new:
    print("  identical, so this service cannot show whether raising the timeout helps")
print("")
print("The raise was correct and it recovered calls that deserved to succeed. It")
print("moved every one of them from the error column into the waiting column, and")
print("which column a call sits in is the part the calling team owns.")
```

## stdout (executed)

```text
calls per minute : 1280

                        timeout 1000ms   timeout 5000ms
  calls that fail       220              25
  calls that succeed    1060              1255

the raise turns 195 failures per minute into successes
and those calls were always going to succeed; they were being cut off

calls taking longer than 1000ms
  before the raise : 220
  after the raise  : 220
  the dependency was not touched, so this number cannot move

connection-time held, in call-milliseconds per minute
  at 1000ms : 870000
  at 5000ms : 1345000
  up by 475000, which is 54%

a pool of 200 connections
  connections busy on average, before : 14
  connections busy on average, after  : 22
  still inside the pool, with 178 to spare

calls still failing at 5000ms
  the 25 calls in the up-to-9000ms bucket
  raising again would take them, at the cost of holding for 9000ms

what could have been changed, and by whom
  the timeout            : the calling team
  the dependency latency : the owning team
  the call volume        : the calling team, but it is user traffic
  the pool size          : the calling team, and it moves the same cost
  one of those four is both owned here and free, and it is the one that moved

control - the same raise against a fast dependency
  calls : 900, failing before : 0, failing after : 0
  identical, so this service cannot show whether raising the timeout helps

The raise was correct and it recovered calls that deserved to succeed. It
moved every one of them from the error column into the waiting column, and
which column a call sits in is the part the calling team owns.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
