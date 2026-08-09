<!-- canonical: efficientnewlanguage.org/ai/examples/310-cancel-is-not-idempotent | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 310 — Cancel is not idempotent — both designs cancel correctly once

`cancel_is_not_idempotent.eml` applies cancel one, two and three times to the same booking under two designs — cancel-as-delta and cancel-as-target-state — and reads the resulting seats and refunds back out.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Cancelling twice
# is not the same as cancelling once, and the second cancel is the one the
# retry sends.
#
# Cancel releases a seat, refunds a charge, returns a licence to the pool -
# it UNDOES something, and undoing is a delta, not a state. Applied twice it
# applies twice.
#
# It is called twice for ordinary reasons. The user clicks cancel and the
# response is slow, so they click again. A client retries a request whose
# response was lost. A cleanup job cancels anything stale, and a human already
# cancelled it. None of those are unusual, and none of them are the caller
# being careless.
#
# The fix is not to make cancel careful. It is to make cancel a statement
# about the desired STATE ("this booking is cancelled") rather than a delta
# ("give back a seat"), so that applying it to an already-cancelled booking is
# a no-op by construction.
#
# The measurement applies cancel one, two and three times to the same booking
# under both designs, and reads the resulting seats and refunds back out.

def fresh():
    # [status, seats_held, refunds_issued]
    return ["confirmed", 1, 0]

def cancel_delta(b):
    # The natural implementation: undo the effects.
    b[0] => status
    b[1] => seats
    b[2] => refunds
    seats - 1 => seats
    refunds + 1 => refunds
    return ["cancelled", seats, refunds]

def cancel_state(b):
    # The same policy stated as a target state. Reaching a state you are
    # already in costs nothing.
    if b[0] == "cancelled":
        return b
    return ["cancelled", b[1] - 1, b[2] + 1]

def apply_n(mode, n):
    fresh() => b
    0 => i
    while i < n:
        if mode == "delta":
            cancel_delta(b) => b
        else:
            cancel_state(b) => b
        i + 1 => i
    return b

["delta", "state"] => MODES
[1, 2, 3] => TIMES

"design  cancels  status     seats held  refunds issued"^0
"------  -------  ---------  ----------  --------------"^0
{} => results
for m in MODES:
    for n in TIMES:
        apply_n(m, n) => b
        b => results[m + "/" + str(n)]
        ((m + "        ")[0:8] + (str(n) + "         ")[0:9] + (b[0] + "           ")[0:11] + (str(b[1]) + "            ")[0:12] + str(b[2]))^0

""^0
"what a second cancel costs"^0
for m in MODES:
    results[m + "/1"] => one
    results[m + "/2"] => two
    ((m + "        ")[0:8] + " seats " + str(one[1]) + " -> " + str(two[1]) + ", refunds " + str(one[2]) + " -> " + str(two[2]))^0

""^0
"the status is identical under both, at every count"^0
0 => status_differs
for m in MODES:
    for n in TIMES:
        if not (results[m + "/" + str(n)][0] == "cancelled"):
            status_differs + 1 => status_differs
("rows whose status is not 'cancelled': " + str(status_differs))^0
"So a check that asks 'is it cancelled?' passes for every row in the table."^0

""^0
"seats held, as a number that should never go negative"^0
for m in MODES:
    for n in TIMES:
        results[m + "/" + str(n)] => b
        if b[1] < 0:
            "IMPOSSIBLE" => note
        else:
            "in range" => note
        ((m + "        ")[0:8] + " after " + str(n) + " cancels: seats " + (str(b[1]) + "   ")[0:4] + note)^0

""^0
0 => checked
0 => passed

# One cancel must behave identically under both designs - the difference only
# appears on repetition, which is why it survives review.
checked + 1 => checked
results["delta/1"] => d1
results["state/1"] => s1
if d1[0] == s1[0]:
    if d1[1] == s1[1]:
        if d1[2] == s1[2]:
            passed + 1 => passed

# The delta design must issue more refunds than there were bookings.
checked + 1 => checked
if results["delta/3"][2] > 1:
    passed + 1 => passed

# The state design must issue exactly one, however many times it is called.
checked + 1 => checked
0 => state_refunds_wrong
for n in TIMES:
    if not (results["state/" + str(n)][2] == 1):
        state_refunds_wrong + 1 => state_refunds_wrong
if state_refunds_wrong == 0:
    passed + 1 => passed

# The delta design must drive seats negative - an impossible value, reached by
# a sequence of individually valid operations.
checked + 1 => checked
if results["delta/3"][1] < 0:
    passed + 1 => passed

# The state design must not.
checked + 1 => checked
0 => state_negative
for n in TIMES:
    if results["state/" + str(n)][1] < 0:
        state_negative + 1 => state_negative
if state_negative == 0:
    passed + 1 => passed

# And the status must be "cancelled" in every row of the table - the check
# anybody would write cannot tell the two designs apart.
checked + 1 => checked
if status_differs == 0:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Both designs cancel correctly once, and only one of them survives being asked twice." => verdict
else:
    "FAILED - the designs did not behave as the checks describe." => verdict
verdict^0

""^0
"An undo is a delta and a delta composes. Stating the same policy as a"^0
"target state - 'this booking is cancelled' - makes the second call a"^0
"no-op by construction rather than by a guard somebody has to remember to"^0
"write. The two are indistinguishable on the happy path, and the happy path"^0
"is where cancellation is tested, because testing a double cancel requires"^0
"believing it can happen."^0
```

## Python (deterministic transpilation)

```python
def fresh():
    return ["confirmed", 1, 0]

def cancel_delta(b):
    status = b[0]
    seats = b[1]
    refunds = b[2]
    seats = seats - 1
    refunds = refunds + 1
    return ["cancelled", seats, refunds]

def cancel_state(b):
    if b[0] == "cancelled":
        return b
    return ["cancelled", b[1] - 1, b[2] + 1]

def apply_n(mode, n):
    b = fresh()
    i = 0
    while i < n:
        if mode == "delta":
            b = cancel_delta(b)
        else:
            b = cancel_state(b)
        i = i + 1
    return b

MODES = ["delta", "state"]
TIMES = [1, 2, 3]
print("design  cancels  status     seats held  refunds issued")
print("------  -------  ---------  ----------  --------------")
results = {}
for m in MODES:
    for n in TIMES:
        b = apply_n(m, n)
        results[m + "/" + str(n)] = b
        print((m + "        ")[0:8] + (str(n) + "         ")[0:9] + (b[0] + "           ")[0:11] + (str(b[1]) + "            ")[0:12] + str(b[2]))
print("")
print("what a second cancel costs")
for m in MODES:
    one = results[m + "/1"]
    two = results[m + "/2"]
    print((m + "        ")[0:8] + " seats " + str(one[1]) + " -> " + str(two[1]) + ", refunds " + str(one[2]) + " -> " + str(two[2]))
print("")
print("the status is identical under both, at every count")
status_differs = 0
for m in MODES:
    for n in TIMES:
        if not results[m + "/" + str(n)][0] == "cancelled":
            status_differs = status_differs + 1
print("rows whose status is not 'cancelled': " + str(status_differs))
print("So a check that asks 'is it cancelled?' passes for every row in the table.")
print("")
print("seats held, as a number that should never go negative")
for m in MODES:
    for n in TIMES:
        b = results[m + "/" + str(n)]
        if b[1] < 0:
            note = "IMPOSSIBLE"
        else:
            note = "in range"
        print((m + "        ")[0:8] + " after " + str(n) + " cancels: seats " + (str(b[1]) + "   ")[0:4] + note)
print("")
checked = 0
passed = 0
checked = checked + 1
d1 = results["delta/1"]
s1 = results["state/1"]
if d1[0] == s1[0]:
    if d1[1] == s1[1]:
        if d1[2] == s1[2]:
            passed = passed + 1
checked = checked + 1
if results["delta/3"][2] > 1:
    passed = passed + 1
checked = checked + 1
state_refunds_wrong = 0
for n in TIMES:
    if not results["state/" + str(n)][2] == 1:
        state_refunds_wrong = state_refunds_wrong + 1
if state_refunds_wrong == 0:
    passed = passed + 1
checked = checked + 1
if results["delta/3"][1] < 0:
    passed = passed + 1
checked = checked + 1
state_negative = 0
for n in TIMES:
    if results["state/" + str(n)][1] < 0:
        state_negative = state_negative + 1
if state_negative == 0:
    passed = passed + 1
checked = checked + 1
if status_differs == 0:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Both designs cancel correctly once, and only one of them survives being asked twice."
else:
    verdict = "FAILED - the designs did not behave as the checks describe."
print(verdict)
print("")
print("An undo is a delta and a delta composes. Stating the same policy as a")
print("target state - 'this booking is cancelled' - makes the second call a")
print("no-op by construction rather than by a guard somebody has to remember to")
print("write. The two are indistinguishable on the happy path, and the happy path")
print("is where cancellation is tested, because testing a double cancel requires")
print("believing it can happen.")
```

## stdout (executed)

```text
design  cancels  status     seats held  refunds issued
------  -------  ---------  ----------  --------------
delta   1        cancelled  0           1
delta   2        cancelled  -1          2
delta   3        cancelled  -2          3
state   1        cancelled  0           1
state   2        cancelled  0           1
state   3        cancelled  0           1

what a second cancel costs
delta    seats 0 -> -1, refunds 1 -> 2
state    seats 0 -> 0, refunds 1 -> 1

the status is identical under both, at every count
rows whose status is not 'cancelled': 0
So a check that asks 'is it cancelled?' passes for every row in the table.

seats held, as a number that should never go negative
delta    after 1 cancels: seats 0   in range
delta    after 2 cancels: seats -1  IMPOSSIBLE
delta    after 3 cancels: seats -2  IMPOSSIBLE
state    after 1 cancels: seats 0   in range
state    after 2 cancels: seats 0   in range
state    after 3 cancels: seats 0   in range

checks passed: 6/6
Both designs cancel correctly once, and only one of them survives being asked twice.

An undo is a delta and a delta composes. Stating the same policy as a
target state - 'this booking is cancelled' - makes the second call a
no-op by construction rather than by a guard somebody has to remember to
write. The two are indistinguishable on the happy path, and the happy path
is where cancellation is tested, because testing a double cancel requires
believing it can happen.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
