<!-- canonical: efficientnewlanguage.org/ai/examples/406-the-action-items-were-closed-not-done | ai_layer_version: 0.1.0 | updated: 2026-08-16 -->

# Example 406 — The action items were closed, not done - 6 of 6 closed, 1 of them blocks anything

`the_action_items_were_closed_not_done.eml` replays the incident step by step against the post-fix system, because "was the work done" and "would this happen again" are answered by different evidence.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Six action items,
# all closed, and five of them change nothing the incident does. How far it
# still gets is computed below rather than claimed here.
#
# Closing them was not dishonest. Each ticket says something true - the doc was
# written, the alert was added, the training happened - and a reviewer checking
# whether the stated work was done would tick every box correctly.
#
# The postmortem's question was not "was the work done". It was "would this
# happen again", and those two are answered by different evidence. Here the
# incident is replayed against the post-fix system, step by step, so the second
# question gets its own answer.

# [action item, closed, does it block a step of the incident, which step]
[["write a runbook for this failure", 1, 0, 0], ["add an alert on queue depth", 1, 0, 0], ["train the on-call rotation", 1, 0, 0], ["add a guard rejecting empty payloads", 1, 1, 2], ["file a ticket with the vendor", 1, 0, 0], ["document the escalation path", 1, 0, 0]] => items

# The incident, as a sequence of steps that each have to succeed for it to run.
["a malformed payload is accepted", "it is written to the queue", "the consumer parses it", "the consumer crashes", "the queue backs up"] => steps

def closed_count():
    0 => c
    for a in items:
        c + a[1] => c
    return c

def blocking_count():
    0 => c
    for a in items:
        c + a[2] => c
    return c

def step_blocked(i):
    for a in items:
        if a[2] == 1:
            if a[3] == i:
                return 1
    return 0

"action items : " + str(len(items)) ^0
"  closed                       : " + str(closed_count()) ^0
"  that block a step            : " + str(blocking_count()) ^0
"  that change nothing the incident does : " + str(len(items) - blocking_count()) ^0
"" ^0

"the items, one by one" ^0
for a in items:
    if a[2] == 1:
        "  [closed] " + a[0] + "   <- blocks step " + str(a[3] + 1) ^0
    else:
        "  [closed] " + a[0] ^0
"" ^0

# ---- replaying the incident ----

"replaying the incident against the post-fix system" ^0
0 => reached
0 => i
1 => running
for s in steps:
    if running == 1:
        if step_blocked(i) == 1:
            "  step " + str(i + 1) + " : " + s + "   BLOCKED" ^0
            0 => running
        else:
            "  step " + str(i + 1) + " : " + s ^0
            reached + 1 => reached
    i + 1 => i
"  steps reached : " + str(reached) + " of " + str(len(steps)) ^0
if reached == len(steps):
    "  the incident runs to completion" ^0
else:
    "  the incident stops at step " + str(reached + 1) ^0
"" ^0

# ---- what the items that block nothing are for ----
#
# They are not waste. Every one of them shortens the incident or makes it
# easier to handle - which is why they pass review, and why they are counted
# as if they had prevented it.

"what the non-blocking items do instead" ^0
"  runbook, training, escalation doc : make the response faster" ^0
"  alert on queue depth              : makes the detection earlier" ^0
"  vendor ticket                     : moves the fix somewhere else" ^0
"  none of them changes whether step 1 happens" ^0
"" ^0

# ---- the two questions, answered separately ----

"the two questions" ^0
"  were the action items done : " + str(closed_count()) + " of " + str(len(items)) + " - yes" ^0
"  would it happen again      : " + str(reached) + " of " + str(len(steps)) + " steps still run" ^0
if closed_count() == len(items):
    if reached > 0:
        "  both answers are correct and they are not the same answer" ^0
"" ^0

# ---- the control: the same list with the guard placed at step 1 ----
#
# One item moved. Nothing else about the postmortem changes - same count, same
# closure rate, same review.

[["write a runbook for this failure", 1, 0, 0], ["add an alert on queue depth", 1, 0, 0], ["train the on-call rotation", 1, 0, 0], ["reject malformed payloads at the edge", 1, 1, 0], ["file a ticket with the vendor", 1, 0, 0], ["document the escalation path", 1, 0, 0]] => items2

def step_blocked2(i):
    for a in items2:
        if a[2] == 1:
            if a[3] == i:
                return 1
    return 0

0 => reached2
0 => j
1 => running2
for s in steps:
    if running2 == 1:
        if step_blocked2(j) == 1:
            0 => running2
        else:
            reached2 + 1 => reached2
    j + 1 => j

"control - the same six items, one of them placed at step 1" ^0
"  closed : " + str(len(items2)) + " of " + str(len(items2)) ^0
"  steps still reached : " + str(reached2) + " of " + str(len(steps)) ^0
if reached2 < reached:
    "  same closure rate, " + str(reached - reached2) + " fewer steps of the incident" ^0
"" ^0

"A closed action item is a true statement about work. Whether the incident can" ^0
"still run is a different statement, and the postmortem is filed against the" ^0
"first one." ^0
```

## Python (deterministic transpilation)

```python
items = [["write a runbook for this failure", 1, 0, 0], ["add an alert on queue depth", 1, 0, 0], ["train the on-call rotation", 1, 0, 0], ["add a guard rejecting empty payloads", 1, 1, 2], ["file a ticket with the vendor", 1, 0, 0], ["document the escalation path", 1, 0, 0]]
steps = ["a malformed payload is accepted", "it is written to the queue", "the consumer parses it", "the consumer crashes", "the queue backs up"]

def closed_count():
    c = 0
    for a in items:
        c = c + a[1]
    return c

def blocking_count():
    c = 0
    for a in items:
        c = c + a[2]
    return c

def step_blocked(i):
    for a in items:
        if a[2] == 1:
            if a[3] == i:
                return 1
    return 0

print("action items : " + str(len(items)))
print("  closed                       : " + str(closed_count()))
print("  that block a step            : " + str(blocking_count()))
print("  that change nothing the incident does : " + str(len(items) - blocking_count()))
print("")
print("the items, one by one")
for a in items:
    if a[2] == 1:
        print("  [closed] " + a[0] + "   <- blocks step " + str(a[3] + 1))
    else:
        print("  [closed] " + a[0])
print("")
print("replaying the incident against the post-fix system")
reached = 0
i = 0
running = 1
for s in steps:
    if running == 1:
        if step_blocked(i) == 1:
            print("  step " + str(i + 1) + " : " + s + "   BLOCKED")
            running = 0
        else:
            print("  step " + str(i + 1) + " : " + s)
            reached = reached + 1
    i = i + 1
print("  steps reached : " + str(reached) + " of " + str(len(steps)))
if reached == len(steps):
    print("  the incident runs to completion")
else:
    print("  the incident stops at step " + str(reached + 1))
print("")
print("what the non-blocking items do instead")
print("  runbook, training, escalation doc : make the response faster")
print("  alert on queue depth              : makes the detection earlier")
print("  vendor ticket                     : moves the fix somewhere else")
print("  none of them changes whether step 1 happens")
print("")
print("the two questions")
print("  were the action items done : " + str(closed_count()) + " of " + str(len(items)) + " - yes")
print("  would it happen again      : " + str(reached) + " of " + str(len(steps)) + " steps still run")
if closed_count() == len(items):
    if reached > 0:
        print("  both answers are correct and they are not the same answer")
print("")
items2 = [["write a runbook for this failure", 1, 0, 0], ["add an alert on queue depth", 1, 0, 0], ["train the on-call rotation", 1, 0, 0], ["reject malformed payloads at the edge", 1, 1, 0], ["file a ticket with the vendor", 1, 0, 0], ["document the escalation path", 1, 0, 0]]

def step_blocked2(i):
    for a in items2:
        if a[2] == 1:
            if a[3] == i:
                return 1
    return 0

reached2 = 0
j = 0
running2 = 1
for s in steps:
    if running2 == 1:
        if step_blocked2(j) == 1:
            running2 = 0
        else:
            reached2 = reached2 + 1
    j = j + 1
print("control - the same six items, one of them placed at step 1")
print("  closed : " + str(len(items2)) + " of " + str(len(items2)))
print("  steps still reached : " + str(reached2) + " of " + str(len(steps)))
if reached2 < reached:
    print("  same closure rate, " + str(reached - reached2) + " fewer steps of the incident")
print("")
print("A closed action item is a true statement about work. Whether the incident can")
print("still run is a different statement, and the postmortem is filed against the")
print("first one.")
```

## stdout (executed)

```text
action items : 6
  closed                       : 6
  that block a step            : 1
  that change nothing the incident does : 5

the items, one by one
  [closed] write a runbook for this failure
  [closed] add an alert on queue depth
  [closed] train the on-call rotation
  [closed] add a guard rejecting empty payloads   <- blocks step 3
  [closed] file a ticket with the vendor
  [closed] document the escalation path

replaying the incident against the post-fix system
  step 1 : a malformed payload is accepted
  step 2 : it is written to the queue
  step 3 : the consumer parses it   BLOCKED
  steps reached : 2 of 5
  the incident stops at step 3

what the non-blocking items do instead
  runbook, training, escalation doc : make the response faster
  alert on queue depth              : makes the detection earlier
  vendor ticket                     : moves the fix somewhere else
  none of them changes whether step 1 happens

the two questions
  were the action items done : 6 of 6 - yes
  would it happen again      : 2 of 5 steps still run
  both answers are correct and they are not the same answer

control - the same six items, one of them placed at step 1
  closed : 6 of 6
  steps still reached : 0 of 5
  same closure rate, 2 fewer steps of the incident

A closed action item is a true statement about work. Whether the incident can
still run is a different statement, and the postmortem is filed against the
first one.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
