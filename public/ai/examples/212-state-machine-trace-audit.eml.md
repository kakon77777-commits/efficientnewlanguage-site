<!-- canonical: efficientnewlanguage.org/ai/examples/212-state-machine-trace-audit | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 212 — Two different ways for a log to be illegal

`state_machine_trace_audit.eml` replays an event log against a state machine and reports what the machine did with each event - rather than whether the log as a whole is valid.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Replaying a log
# of events against a state machine, and reporting every illegal transition
# with the state it was attempted from - not just that the log is bad.
#
# Validating a trace is the same shape as validating a form, and it fails the
# same way. A checker that stops at the first illegal transition tells you
# where the log first goes wrong, which is useful. It does not tell you
# whether the log goes wrong once or forty times, and those two demand
# completely different responses: one is a bug, the other is a corrupt feed.
#
# There is a second question that only a complete replay can answer, and it is
# the one that actually matters operationally: WHAT STATE ARE WE IN NOW? A
# checker that aborts leaves the machine parked wherever it stopped. A replay
# that continues has to decide what an illegal event does - and the honest
# answer is "nothing": an event the machine cannot accept does not move it.
# Recording that decision explicitly is the difference between a replay and a
# guess.
#
# So the audit reports four things, and the checks tie them together:
#
#   1. every event is classified - applied, or rejected with the reason
#   2. applied + rejected == the number of events, always
#   3. the final state is reachable from the initial one by the applied
#      events alone, re-derived in a second pass
#   4. no event is BOTH applied and rejected

# state -> {event: next state}
{
    "idle": {"submit": "pending"},
    "pending": {"approve": "approved", "reject": "rejected", "amend": "idle"},
    "approved": {"ship": "shipped", "cancel": "cancelled"},
    "rejected": {"amend": "idle"},
    "shipped": {},
    "cancelled": {},
} => machine

def allowed_from(state):
    [] => out
    for e in machine[state]:
        out + [e] => out
    return out

def can_apply(state, event):
    return event in machine[state]

def step(state, event):
    if can_apply(state, event):
        return machine[state][event]
    return state


"idle" => start
[
    "submit",
    "approve",
    "approve",
    "ship",
    "amend",
    "submit",
    "ship",
] => log

"machine:"^0
for s in machine:
    allowed_from(s) => events
    if len(events) == 0:
        ("  %-10s (terminal)" % s)^0
    else:
        "" => rendered
        for e in events:
            if len(rendered) > 0:
                rendered + ", " => rendered
            rendered + e + " -> " + machine[s][e] => rendered
        ("  %-10s %s" % (s, rendered))^0

# --------------------------------------------------------------- the replay
""^0
("replaying " + str(len(log)) + " events from \"" + start + "\":")^0
start => state
0 => applied
[] => applied_events
[] => rejections
for event in log:
    if can_apply(state, event):
        step(state, event) => next_state
        applied + 1 => applied
        applied_events + [event] => applied_events
        ("  %-8s %-10s -> %s" % (event, state, next_state))^0
        next_state => state
    else:
        rejections + [[event, state]] => rejections
        # An event the machine cannot accept does not move it. Saying so
        # explicitly is what makes this a replay rather than a guess.
        ("  %-8s %-10s -- rejected, stays put" % (event, state))^0

state => final_state

""^0
"rejections, with the state each was attempted from:"^0
if len(rejections) == 0:
    "  (none)"^0
for r in rejections:
    allowed_from(r[1]) => legal
    "" => legal_text
    for e in legal:
        if len(legal_text) > 0:
            legal_text + ", " => legal_text
        legal_text + e => legal_text
    if len(legal_text) == 0:
        "nothing - terminal state" => legal_text
    ("  \"" + r[0] + "\" is not valid in \"" + r[1] + "\"; allowed there: " + legal_text)^0

# ------------------------------------------------------------------ checks
# 3. re-derive the final state from the APPLIED events alone, second pass.
start => rederived
True => rederive_clean
for event in applied_events:
    if can_apply(rederived, event):
        step(rederived, event) => rederived
    else:
        False => rederive_clean

# 4. nothing is both applied and rejected: the counts must partition the log.
len(rejections) => rejected_count

# Every applied event must have been legal at the moment it was applied -
# already guaranteed by construction above, but re-checked from the record.
0 => still_legal
start => walk
for event in applied_events:
    if can_apply(walk, event):
        still_legal + 1 => still_legal
        step(walk, event) => walk

""^0
("events in log:          " + str(len(log)))^0
("applied:                " + str(applied))^0
("rejected:               " + str(rejected_count))^0
("applied + rejected:     " + str(applied + rejected_count))^0
("final state:            " + final_state)^0
("re-derived final state: " + rederived)^0
("applied events legal on replay: " + str(still_legal) + "/" + str(applied))^0

""^0
if applied + rejected_count == len(log) and rederived == final_state and rederive_clean and still_legal == applied and rejected_count > 0:
    "Every event accounted for, and the final state re-derives from the applied ones." => verdict
else:
    "FAILED - the audit lost an event or the final state does not follow." => verdict
verdict^0

""^0
"The first rejection is `approve` from \"approved\" - a wrong-order event." => n1
n1^0
"The next three are all from \"shipped\", a terminal state, which is a" => n2
n2^0
"different kind of problem entirely: the log kept going after the machine" => n3
n3^0
"had stopped. A checker that reports only 'invalid log' collapses those two" => n4
n4^0
"into one word, and a checker that stops at the first one never learns that" => n5
n5^0
"the trace ran three events past the end." => n6
n6^0
```

## Python (deterministic transpilation)

```python
machine = {"idle": {"submit": "pending"}, "pending": {"approve": "approved", "reject": "rejected", "amend": "idle"}, "approved": {"ship": "shipped", "cancel": "cancelled"}, "rejected": {"amend": "idle"}, "shipped": {}, "cancelled": {}}

def allowed_from(state):
    out = []
    for e in machine[state]:
        out = out + [e]
    return out

def can_apply(state, event):
    return event in machine[state]

def step(state, event):
    if can_apply(state, event):
        return machine[state][event]
    return state

start = "idle"
log = ["submit", "approve", "approve", "ship", "amend", "submit", "ship"]
print("machine:")
for s in machine:
    events = allowed_from(s)
    if len(events) == 0:
        print("  %-10s (terminal)" % s)
    else:
        rendered = ""
        for e in events:
            if len(rendered) > 0:
                rendered = rendered + ", "
            rendered = rendered + e + " -> " + machine[s][e]
        print("  %-10s %s" % (s, rendered))
print("")
print("replaying " + str(len(log)) + " events from \"" + start + "\":")
state = start
applied = 0
applied_events = []
rejections = []
for event in log:
    if can_apply(state, event):
        next_state = step(state, event)
        applied = applied + 1
        applied_events = applied_events + [event]
        print("  %-8s %-10s -> %s" % (event, state, next_state))
        state = next_state
    else:
        rejections = rejections + [[event, state]]
        print("  %-8s %-10s -- rejected, stays put" % (event, state))
final_state = state
print("")
print("rejections, with the state each was attempted from:")
if len(rejections) == 0:
    print("  (none)")
for r in rejections:
    legal = allowed_from(r[1])
    legal_text = ""
    for e in legal:
        if len(legal_text) > 0:
            legal_text = legal_text + ", "
        legal_text = legal_text + e
    if len(legal_text) == 0:
        legal_text = "nothing - terminal state"
    print("  \"" + r[0] + "\" is not valid in \"" + r[1] + "\"; allowed there: " + legal_text)
rederived = start
rederive_clean = True
for event in applied_events:
    if can_apply(rederived, event):
        rederived = step(rederived, event)
    else:
        rederive_clean = False
rejected_count = len(rejections)
still_legal = 0
walk = start
for event in applied_events:
    if can_apply(walk, event):
        still_legal = still_legal + 1
        walk = step(walk, event)
print("")
print("events in log:          " + str(len(log)))
print("applied:                " + str(applied))
print("rejected:               " + str(rejected_count))
print("applied + rejected:     " + str(applied + rejected_count))
print("final state:            " + final_state)
print("re-derived final state: " + rederived)
print("applied events legal on replay: " + str(still_legal) + "/" + str(applied))
print("")
if applied + rejected_count == len(log) and rederived == final_state and rederive_clean and still_legal == applied and rejected_count > 0:
    verdict = "Every event accounted for, and the final state re-derives from the applied ones."
else:
    verdict = "FAILED - the audit lost an event or the final state does not follow."
print(verdict)
print("")
n1 = "The first rejection is `approve` from \"approved\" - a wrong-order event."
print(n1)
n2 = "The next three are all from \"shipped\", a terminal state, which is a"
print(n2)
n3 = "different kind of problem entirely: the log kept going after the machine"
print(n3)
n4 = "had stopped. A checker that reports only 'invalid log' collapses those two"
print(n4)
n5 = "into one word, and a checker that stops at the first one never learns that"
print(n5)
n6 = "the trace ran three events past the end."
print(n6)
```

## stdout (executed)

```text
machine:
  idle       submit -> pending
  pending    approve -> approved, reject -> rejected, amend -> idle
  approved   ship -> shipped, cancel -> cancelled
  rejected   amend -> idle
  shipped    (terminal)
  cancelled  (terminal)

replaying 7 events from "idle":
  submit   idle       -> pending
  approve  pending    -> approved
  approve  approved   -- rejected, stays put
  ship     approved   -> shipped
  amend    shipped    -- rejected, stays put
  submit   shipped    -- rejected, stays put
  ship     shipped    -- rejected, stays put

rejections, with the state each was attempted from:
  "approve" is not valid in "approved"; allowed there: ship, cancel
  "amend" is not valid in "shipped"; allowed there: nothing - terminal state
  "submit" is not valid in "shipped"; allowed there: nothing - terminal state
  "ship" is not valid in "shipped"; allowed there: nothing - terminal state

events in log:          7
applied:                3
rejected:               4
applied + rejected:     7
final state:            shipped
re-derived final state: shipped
applied events legal on replay: 3/3

Every event accounted for, and the final state re-derives from the applied ones.

The first rejection is `approve` from "approved" - a wrong-order event.
The next three are all from "shipped", a terminal state, which is a
different kind of problem entirely: the log kept going after the machine
had stopped. A checker that reports only 'invalid log' collapses those two
into one word, and a checker that stops at the first one never learns that
the trace ran three events past the end.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
