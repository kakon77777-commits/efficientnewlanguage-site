<!-- canonical: efficientnewlanguage.org/ai/examples/446-the-warning-fires-where-the-caller-cannot-hear-it | ai_layer_version: 0.1.0 | updated: 2026-08-18 -->

# Example 446 — The warning fires where the caller cannot hear it

`the_warning_fires_where_the_caller_cannot_hear_it.eml` - The deprecation warning was moved into the call itself, which is the right place for it. How many callers can act on it is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The deprecation
# warning was moved into the call itself, which is the right place for it. How
# many callers can act on it is computed below.
#
# Putting the warning where the call happens fixes the audience problem: the
# people who trigger it are exactly the people who use the thing. That is the
# correct instinct, and it is why a runtime warning beats a blog post.
#
# Between the warning firing and somebody changing a line of code there are
# three more steps, and each one is a place the signal can stop: the log level
# has to keep it, somebody on the calling team has to read that stream, and the
# call site has to be one they can edit. A caller who fails any of the three
# gets a warning that is emitted, correct, and inert.
#
# The funnel is measured per caller rather than assumed.

# [caller, calls/day, log level keeps it, team reads that stream, owns the call site]
[["order intake", 4000, 1, 1, 1], ["billing sync", 1200, 0, 1, 1], ["mobile bff", 9000, 1, 0, 1], ["partner etl", 300, 1, 1, 0], ["reporting", 800, 0, 0, 1], ["search index", 2500, 1, 1, 1], ["legacy cron", 150, 0, 1, 0], ["vendor sdk", 3300, 1, 1, 0]] => callers

len(callers) => n

def total_calls():
    0 => t
    for c in callers:
        t + c[1] => t
    return t

"callers : " + str(n) ^0
"warnings emitted per day : " + str(total_calls()) ^0
"  every one of them is correct, and names the deprecated call" ^0
"" ^0

# ---- the funnel ----

0 => kept
0 => read_it
0 => can_edit
for c in callers:
    if c[2] == 1:
        kept + 1 => kept
        if c[3] == 1:
            read_it + 1 => read_it
            if c[4] == 1:
                can_edit + 1 => can_edit

"callers the warning reaches, step by step" ^0
"  warning fires for              : " + str(n) ^0
"  survives the log level         : " + str(kept) ^0
"  lands in a stream they read    : " + str(read_it) ^0
"  and they can edit the call     : " + str(can_edit) ^0
"" ^0

if can_edit < n:
    "  " + str(n - can_edit) + " of " + str(n) + " callers get a warning nothing can come of" ^0
"" ^0

# ---- where the funnel is narrowest ----
#
# Each step is a separate fix with a separate owner, so which one to work on is
# a question about sizes rather than about which is easiest to describe.

"how many are lost at each step" ^0
0 => lost_level
0 => lost_stream
0 => lost_edit
for c in callers:
    if c[2] == 0:
        lost_level + 1 => lost_level
    else:
        if c[3] == 0:
            lost_stream + 1 => lost_stream
        else:
            if c[4] == 0:
                lost_edit + 1 => lost_edit
"  log level drops it   : " + str(lost_level) ^0
"  nobody reads it      : " + str(lost_stream) ^0
"  cannot edit the call : " + str(lost_edit) ^0

lost_level => worst
"the log level" => worst_name
if lost_stream > worst:
    lost_stream => worst
    "the stream nobody reads" => worst_name
if lost_edit > worst:
    lost_edit => worst
    "call sites they do not own" => worst_name
"  largest single loss : " + worst_name + ", " + str(worst) + " callers" ^0
"" ^0

# ---- weighted by traffic, which is a different ranking ----

0 => reached_calls
0 => unreached_calls
for c in callers:
    0 => ok
    if c[2] == 1:
        if c[3] == 1:
            if c[4] == 1:
                1 => ok
    if ok == 1:
        reached_calls + c[1] => reached_calls
    else:
        unreached_calls + c[1] => unreached_calls

"the same funnel counted in calls rather than callers" ^0
"  calls from callers who can act    : " + str(reached_calls) ^0
"  calls from callers who cannot     : " + str(unreached_calls) ^0
if unreached_calls > reached_calls:
    "  most of the traffic comes from callers the warning cannot reach" ^0
else:
    "  most of the traffic comes from callers who can act on it" ^0
"" ^0

# ---- the caller who hears it and still cannot act ----
#
# Owning the call site is not a property of the warning. It is a property of
# who wrote the line, and a vendor SDK moves that line outside the building.

"callers who read the warning and cannot change the call" ^0
for c in callers:
    if c[2] == 1:
        if c[3] == 1:
            if c[4] == 0:
                "  " + c[0] + " : " + str(c[1]) + " calls/day" ^0
"  for these the actionable step is an upgrade or a ticket, not an edit" ^0
"" ^0

# ---- the control: a warning that cannot be missed ----
#
# A compile-time deprecation reaches everyone who builds, because building is
# the act that surfaces it. It costs the ability to ignore it, which is the
# same property read two ways.

0 => build_reach
for c in callers:
    build_reach + 1 => build_reach
"control - a deprecation that fails the build" ^0
"  callers it reaches : " + str(build_reach) + " of " + str(n) ^0
if build_reach > can_edit:
    "  " + str(build_reach - can_edit) + " more than the runtime warning, and none of them can defer it" ^0
"  the ones who do not own the call site now cannot build until someone else moves" ^0
"" ^0

"The warning is in the right place and every one it emits is true. Whether it" ^0
"changes a line depends on three things after the emit, and none of them is" ^0
"decided by the code that emits it." ^0
```

## Python (deterministic transpilation)

```python
callers = [["order intake", 4000, 1, 1, 1], ["billing sync", 1200, 0, 1, 1], ["mobile bff", 9000, 1, 0, 1], ["partner etl", 300, 1, 1, 0], ["reporting", 800, 0, 0, 1], ["search index", 2500, 1, 1, 1], ["legacy cron", 150, 0, 1, 0], ["vendor sdk", 3300, 1, 1, 0]]
n = len(callers)

def total_calls():
    t = 0
    for c in callers:
        t = t + c[1]
    return t

print("callers : " + str(n))
print("warnings emitted per day : " + str(total_calls()))
print("  every one of them is correct, and names the deprecated call")
print("")
kept = 0
read_it = 0
can_edit = 0
for c in callers:
    if c[2] == 1:
        kept = kept + 1
        if c[3] == 1:
            read_it = read_it + 1
            if c[4] == 1:
                can_edit = can_edit + 1
print("callers the warning reaches, step by step")
print("  warning fires for              : " + str(n))
print("  survives the log level         : " + str(kept))
print("  lands in a stream they read    : " + str(read_it))
print("  and they can edit the call     : " + str(can_edit))
print("")
if can_edit < n:
    print("  " + str(n - can_edit) + " of " + str(n) + " callers get a warning nothing can come of")
print("")
print("how many are lost at each step")
lost_level = 0
lost_stream = 0
lost_edit = 0
for c in callers:
    if c[2] == 0:
        lost_level = lost_level + 1
    elif c[3] == 0:
        lost_stream = lost_stream + 1
    elif c[4] == 0:
        lost_edit = lost_edit + 1
print("  log level drops it   : " + str(lost_level))
print("  nobody reads it      : " + str(lost_stream))
print("  cannot edit the call : " + str(lost_edit))
worst = lost_level
worst_name = "the log level"
if lost_stream > worst:
    worst = lost_stream
    worst_name = "the stream nobody reads"
if lost_edit > worst:
    worst = lost_edit
    worst_name = "call sites they do not own"
print("  largest single loss : " + worst_name + ", " + str(worst) + " callers")
print("")
reached_calls = 0
unreached_calls = 0
for c in callers:
    ok = 0
    if c[2] == 1:
        if c[3] == 1:
            if c[4] == 1:
                ok = 1
    if ok == 1:
        reached_calls = reached_calls + c[1]
    else:
        unreached_calls = unreached_calls + c[1]
print("the same funnel counted in calls rather than callers")
print("  calls from callers who can act    : " + str(reached_calls))
print("  calls from callers who cannot     : " + str(unreached_calls))
if unreached_calls > reached_calls:
    print("  most of the traffic comes from callers the warning cannot reach")
else:
    print("  most of the traffic comes from callers who can act on it")
print("")
print("callers who read the warning and cannot change the call")
for c in callers:
    if c[2] == 1:
        if c[3] == 1:
            if c[4] == 0:
                print("  " + c[0] + " : " + str(c[1]) + " calls/day")
print("  for these the actionable step is an upgrade or a ticket, not an edit")
print("")
build_reach = 0
for c in callers:
    build_reach = build_reach + 1
print("control - a deprecation that fails the build")
print("  callers it reaches : " + str(build_reach) + " of " + str(n))
if build_reach > can_edit:
    print("  " + str(build_reach - can_edit) + " more than the runtime warning, and none of them can defer it")
print("  the ones who do not own the call site now cannot build until someone else moves")
print("")
print("The warning is in the right place and every one it emits is true. Whether it")
print("changes a line depends on three things after the emit, and none of them is")
print("decided by the code that emits it.")
```

## stdout (executed)

```text
callers : 8
warnings emitted per day : 21250
  every one of them is correct, and names the deprecated call

callers the warning reaches, step by step
  warning fires for              : 8
  survives the log level         : 5
  lands in a stream they read    : 4
  and they can edit the call     : 2

  6 of 8 callers get a warning nothing can come of

how many are lost at each step
  log level drops it   : 3
  nobody reads it      : 1
  cannot edit the call : 2
  largest single loss : the log level, 3 callers

the same funnel counted in calls rather than callers
  calls from callers who can act    : 6500
  calls from callers who cannot     : 14750
  most of the traffic comes from callers the warning cannot reach

callers who read the warning and cannot change the call
  partner etl : 300 calls/day
  vendor sdk : 3300 calls/day
  for these the actionable step is an upgrade or a ticket, not an edit

control - a deprecation that fails the build
  callers it reaches : 8 of 8
  6 more than the runtime warning, and none of them can defer it
  the ones who do not own the call site now cannot build until someone else moves

The warning is in the right place and every one it emits is true. Whether it
changes a line depends on three things after the emit, and none of them is
decided by the code that emits it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
