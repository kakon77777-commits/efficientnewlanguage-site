<!-- canonical: efficientnewlanguage.org/ai/examples/380-the-qualifier-changes-the-number | ai_layer_version: 0.1.0 | updated: 2026-08-28 -->

# Example 380 — The qualifier changes the number — a 40-point drop and zero change in the service

`the_qualifier_changes_the_number.eml` computes the same uptime figure from one log under a loose rule and a stated one.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Stating the basis
# precisely moves the value, so the correction arrives looking like a regression.
#
# The loose number was never a lie. "Uptime 99.4%" was computed by a real rule
# over real data; it just did not say which requests were in the denominator.
# Writing the basis down is the fix recommended everywhere, and it has a cost
# that is rarely stated: the precise rule and the loose rule do not agree, so
# publishing the definition also publishes a drop.
#
# Both numbers are computed here from one log. Neither is an estimate and
# nothing about the service changed between them.

# [request, succeeded, was_health_check, timed_out_client_side]
[[1, 1, 0, 0], [2, 1, 1, 0], [3, 1, 1, 0], [4, 0, 0, 0], [5, 1, 0, 0], [6, 1, 1, 0], [7, 1, 0, 1], [8, 1, 1, 0], [9, 1, 0, 0], [10, 0, 0, 0], [11, 1, 1, 0], [12, 1, 0, 1], [13, 1, 1, 0], [14, 1, 0, 0], [15, 1, 1, 0], [16, 1, 0, 0], [17, 1, 1, 0], [18, 1, 0, 1], [19, 1, 1, 0], [20, 1, 1, 0]] => log

def rate(include_health, count_client_timeouts_as_failure):
    0 => total
    0 => ok
    for r in log:
        if include_health == 0:
            if r[2] == 1:
                continue
        total + 1 => total
        r[1] => good
        if count_client_timeouts_as_failure == 1:
            if r[3] == 1:
                0 => good
        ok + good => ok
    if total == 0:
        return 0
    return int(ok * 1000 / total)

def show(x):
    return str(int(x / 10)) + "." + str(x % 10) + "%"

"requests logged : " + str(len(log)) ^0
0 => hc
0 => ct
for r in log:
    hc + r[2] => hc
    ct + r[3] => ct
"  health checks           : " + str(hc) ^0
"  client-side timeouts    : " + str(ct) ^0
"" ^0

rate(1, 0) => loose
rate(0, 0) => no_health
rate(0, 1) => precise

"the number as published, with no basis stated" ^0
"  " + show(loose) ^0
"" ^0
"the same log, with the basis written down" ^0
"  excluding health checks                       : " + show(no_health) ^0
"  and counting client-side timeouts as failures : " + show(precise) ^0
"" ^0

"  the drop from stating the basis : " + show(loose - precise) ^0
"  requests that behaved differently between the two : 0" ^0
if precise < loose:
    "  the service did not get worse; the denominator got honest" ^0
"" ^0

# ---- which of the two decisions moves it more ----

"each clarification, applied alone" ^0
"  exclude health checks only : " + show(loose - no_health) ^0
"  count timeouts only        : " + show(loose - rate(1, 1)) ^0
"  both                       : " + show(loose - precise) ^0
if (loose - no_health) + (loose - rate(1, 1)) == loose - precise:
    "  the two effects add exactly" ^0
else:
    "  the two effects do not add - they overlap on the same requests" ^0
"" ^0

# ---- what the reader of a time series sees ----
#
# The correction lands on one day. Everything before it was computed the loose
# way and everything after the precise way, and nothing in the series says so.

[1, 2, 3, 4, 5, 6] => days
"a series where the definition changes at day 4" ^0
for d in days:
    if d < 4:
        "  day " + str(d) + " : " + show(loose) ^0
    else:
        "  day " + str(d) + " : " + show(precise) ^0
"  the step at day 4 : " + show(loose - precise) ^0
"  real changes in the service : 0" ^0
"" ^0

# ---- the control: a log with no health checks and no timeouts ----
#
# There the two rules agree exactly, so the gap is a property of what the log
# contains, not of the act of writing a definition down.

[[1, 1, 0, 0], [2, 1, 0, 0], [3, 0, 0, 0], [4, 1, 0, 0]] => clean_log
def rate_clean(include_health, count_timeouts):
    0 => total
    0 => ok
    for r in clean_log:
        if include_health == 0:
            if r[2] == 1:
                continue
        total + 1 => total
        r[1] => good
        if count_timeouts == 1:
            if r[3] == 1:
                0 => good
        ok + good => ok
    return int(ok * 1000 / total)

"control - a log containing neither kind of request" ^0
"  loose   : " + show(rate_clean(1, 0)) ^0
"  precise : " + show(rate_clean(0, 1)) ^0
if rate_clean(1, 0) == rate_clean(0, 1):
    "  identical, so stating the basis costs nothing here" ^0
"" ^0

"Writing the definition down is the right fix and it is not free. The number" ^0
"moves, the move looks like news, and the log is the only place that says it" ^0
"is not." ^0
```

## Python (deterministic transpilation)

```python
log = [[1, 1, 0, 0], [2, 1, 1, 0], [3, 1, 1, 0], [4, 0, 0, 0], [5, 1, 0, 0], [6, 1, 1, 0], [7, 1, 0, 1], [8, 1, 1, 0], [9, 1, 0, 0], [10, 0, 0, 0], [11, 1, 1, 0], [12, 1, 0, 1], [13, 1, 1, 0], [14, 1, 0, 0], [15, 1, 1, 0], [16, 1, 0, 0], [17, 1, 1, 0], [18, 1, 0, 1], [19, 1, 1, 0], [20, 1, 1, 0]]

def rate(include_health, count_client_timeouts_as_failure):
    total = 0
    ok = 0
    for r in log:
        if include_health == 0:
            if r[2] == 1:
                continue
        total = total + 1
        good = r[1]
        if count_client_timeouts_as_failure == 1:
            if r[3] == 1:
                good = 0
        ok = ok + good
    if total == 0:
        return 0
    return int(ok * 1000 / total)

def show(x):
    return str(int(x / 10)) + "." + str(x % 10) + "%"

print("requests logged : " + str(len(log)))
hc = 0
ct = 0
for r in log:
    hc = hc + r[2]
    ct = ct + r[3]
print("  health checks           : " + str(hc))
print("  client-side timeouts    : " + str(ct))
print("")
loose = rate(1, 0)
no_health = rate(0, 0)
precise = rate(0, 1)
print("the number as published, with no basis stated")
print("  " + show(loose))
print("")
print("the same log, with the basis written down")
print("  excluding health checks                       : " + show(no_health))
print("  and counting client-side timeouts as failures : " + show(precise))
print("")
print("  the drop from stating the basis : " + show(loose - precise))
print("  requests that behaved differently between the two : 0")
if precise < loose:
    print("  the service did not get worse; the denominator got honest")
print("")
print("each clarification, applied alone")
print("  exclude health checks only : " + show(loose - no_health))
print("  count timeouts only        : " + show(loose - rate(1, 1)))
print("  both                       : " + show(loose - precise))
if loose - no_health + (loose - rate(1, 1)) == loose - precise:
    print("  the two effects add exactly")
else:
    print("  the two effects do not add - they overlap on the same requests")
print("")
days = [1, 2, 3, 4, 5, 6]
print("a series where the definition changes at day 4")
for d in days:
    if d < 4:
        print("  day " + str(d) + " : " + show(loose))
    else:
        print("  day " + str(d) + " : " + show(precise))
print("  the step at day 4 : " + show(loose - precise))
print("  real changes in the service : 0")
print("")
clean_log = [[1, 1, 0, 0], [2, 1, 0, 0], [3, 0, 0, 0], [4, 1, 0, 0]]

def rate_clean(include_health, count_timeouts):
    total = 0
    ok = 0
    for r in clean_log:
        if include_health == 0:
            if r[2] == 1:
                continue
        total = total + 1
        good = r[1]
        if count_timeouts == 1:
            if r[3] == 1:
                good = 0
        ok = ok + good
    return int(ok * 1000 / total)

print("control - a log containing neither kind of request")
print("  loose   : " + show(rate_clean(1, 0)))
print("  precise : " + show(rate_clean(0, 1)))
if rate_clean(1, 0) == rate_clean(0, 1):
    print("  identical, so stating the basis costs nothing here")
print("")
print("Writing the definition down is the right fix and it is not free. The number")
print("moves, the move looks like news, and the log is the only place that says it")
print("is not.")
```

## stdout (executed)

```text
requests logged : 20
  health checks           : 10
  client-side timeouts    : 3

the number as published, with no basis stated
  90.0%

the same log, with the basis written down
  excluding health checks                       : 80.0%
  and counting client-side timeouts as failures : 50.0%

  the drop from stating the basis : 40.0%
  requests that behaved differently between the two : 0
  the service did not get worse; the denominator got honest

each clarification, applied alone
  exclude health checks only : 10.0%
  count timeouts only        : 15.0%
  both                       : 40.0%
  the two effects do not add - they overlap on the same requests

a series where the definition changes at day 4
  day 1 : 90.0%
  day 2 : 90.0%
  day 3 : 90.0%
  day 4 : 50.0%
  day 5 : 50.0%
  day 6 : 50.0%
  the step at day 4 : 40.0%
  real changes in the service : 0

control - a log containing neither kind of request
  loose   : 75.0%
  precise : 75.0%
  identical, so stating the basis costs nothing here

Writing the definition down is the right fix and it is not free. The number
moves, the move looks like news, and the log is the only place that says it
is not.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
