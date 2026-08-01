<!-- canonical: efficientnewlanguage.org/ai/examples/187-event-router-ignored-branches | ai_layer_version: 0.1.0 | updated: 2026-08-01 -->

# Example 187 — Event router: branches that do nothing, on purpose

`event_router_ignored_branches.eml` routes four kinds of event and **deliberately ignores two of them**.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An event router
# that must handle four event kinds and DELIBERATELY ignore two of them.
#
# Ignoring an event is a decision, and it needs somewhere to live. Written
# without a no-op statement, the choice is between two bad options:
#
#   - leave the branch out, so the event falls through to a catch-all and gets
#     handled by accident
#   - put a dummy statement in it, so a reader cannot tell the difference
#     between "ignored on purpose" and "someone forgot to finish this"
#
# `pass` is the third option, and until 2026-08-01 this language did not have
# it. `pass` parsed as an ordinary identifier: the Python emitter printed the
# identifier and it happened to be exactly the right Python, so the transpiled
# program ran correctly, while the interpreter - which resolves names for real
# - raised `NameError: name 'pass' is not defined`. Nine phases of work went by
# with the forward pipeline able to accept it and unable to run it, because no
# corpus program had ever written the word.
#
# What the program checks: every event is accounted for exactly once, in one
# of three buckets - routed, ignored, or rejected - and the buckets sum to the
# input. A router that silently drops an event still looks fine event by
# event; only the total gives it away.

[
    ["heartbeat", 1],
    ["order", 17],
    ["debug", 4],
    ["order", 23],
    ["metrics", 9],
    ["heartbeat", 2],
    ["order", 8],
    ["shutdown", 0],
    ["debug", 5],
    ["order", 41],
] => events

"Events in:"^0
for event in events:
    ("  " + event[0] + " " + str(event[1]))^0

[] => routed
0 => ignored_heartbeat
0 => ignored_debug
[] => rejected
0 => total_value

for event in events:
    event[0] => kind
    event[1] => value

    if kind == "order":
        routed + [value] => routed
        total_value + value => total_value
    elif kind == "heartbeat":
        # Ignored on purpose: heartbeats keep the connection warm and carry no
        # payload. The `pass` is the whole point of this branch - it says the
        # case was considered, which an absent branch cannot say.
        ignored_heartbeat + 1 => ignored_heartbeat
        pass
    elif kind == "debug":
        # Also ignored on purpose - debug events are noise in production.
        ignored_debug + 1 => ignored_debug
        pass
    else:
        rejected + [kind] => rejected

""^0
"Routed orders:"^0
for value in routed:
    ("  order " + str(value))^0
("  order total: " + str(total_value))^0

""^0
("Ignored heartbeats: " + str(ignored_heartbeat))^0
("Ignored debug:      " + str(ignored_debug))^0
"Rejected (unknown kind):"^0
for kind in rejected:
    ("  " + kind)^0

# The accounting check: nothing may vanish and nothing may be counted twice.
len(routed) + ignored_heartbeat + ignored_debug + len(rejected) => accounted

""^0
("events in:  " + str(len(events)))^0
("accounted:  " + str(accounted))^0

# Recompute the order total independently, so a bug in the running sum is not
# hidden by using that same sum to check itself.
0 => recheck
for event in events:
    if event[0] == "order":
        recheck + event[1] => recheck

if accounted == len(events) and recheck == total_value:
    "Every event landed in exactly one bucket, and the totals agree." => verdict
else:
    "FAILED - an event was dropped, double-counted, or mis-totalled." => verdict
""^0
verdict^0

"An ignored branch that is empty and an ignored branch that is missing look" => n1
n1^0
"identical in the output and completely different in the source. That is the" => n2
n2^0
"whole argument for having a statement that does nothing." => n3
n3^0
```

## Python (deterministic transpilation)

```python
events = [["heartbeat", 1], ["order", 17], ["debug", 4], ["order", 23], ["metrics", 9], ["heartbeat", 2], ["order", 8], ["shutdown", 0], ["debug", 5], ["order", 41]]
print("Events in:")
for event in events:
    print("  " + event[0] + " " + str(event[1]))
routed = []
ignored_heartbeat = 0
ignored_debug = 0
rejected = []
total_value = 0
for event in events:
    kind = event[0]
    value = event[1]
    if kind == "order":
        routed = routed + [value]
        total_value = total_value + value
    elif kind == "heartbeat":
        ignored_heartbeat = ignored_heartbeat + 1
        pass
    elif kind == "debug":
        ignored_debug = ignored_debug + 1
        pass
    else:
        rejected = rejected + [kind]
print("")
print("Routed orders:")
for value in routed:
    print("  order " + str(value))
print("  order total: " + str(total_value))
print("")
print("Ignored heartbeats: " + str(ignored_heartbeat))
print("Ignored debug:      " + str(ignored_debug))
print("Rejected (unknown kind):")
for kind in rejected:
    print("  " + kind)
accounted = len(routed) + ignored_heartbeat + ignored_debug + len(rejected)
print("")
print("events in:  " + str(len(events)))
print("accounted:  " + str(accounted))
recheck = 0
for event in events:
    if event[0] == "order":
        recheck = recheck + event[1]
if accounted == len(events) and recheck == total_value:
    verdict = "Every event landed in exactly one bucket, and the totals agree."
else:
    verdict = "FAILED - an event was dropped, double-counted, or mis-totalled."
print("")
print(verdict)
n1 = "An ignored branch that is empty and an ignored branch that is missing look"
print(n1)
n2 = "identical in the output and completely different in the source. That is the"
print(n2)
n3 = "whole argument for having a statement that does nothing."
print(n3)
```

## stdout (executed)

```text
Events in:
  heartbeat 1
  order 17
  debug 4
  order 23
  metrics 9
  heartbeat 2
  order 8
  shutdown 0
  debug 5
  order 41

Routed orders:
  order 17
  order 23
  order 8
  order 41
  order total: 89

Ignored heartbeats: 2
Ignored debug:      2
Rejected (unknown kind):
  metrics
  shutdown

events in:  10
accounted:  10

Every event landed in exactly one bucket, and the totals agree.
An ignored branch that is empty and an ignored branch that is missing look
identical in the output and completely different in the source. That is the
whole argument for having a statement that does nothing.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
