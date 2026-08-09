<!-- canonical: efficientnewlanguage.org/ai/examples/312-cancelled-work-still-holds-its-slot | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 312 — Cancelled work still holds its slot — the pool ran out on a request that was fine

`cancelled_work_still_holds_its_slot.eml` replays a twelve-request stream through a three-slot pool under two release placements, and reports the pool over time plus which request first gets refused.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The cancelled
# request let go of the caller and not of the connection.
#
# A request takes a slot from a pool, does its work, and gives the slot back on
# the way out. "On the way out" is a specific line, and it sits on the success
# path, because that is the path that was written first and the only one that
# existed for a while.
#
# Cancelling returns early. Early is before that line. The slot stays taken by
# a request that no longer exists, and the pool has no way to notice: from its
# side, a slot is either handed out or handed back, and this one was handed
# out.
#
# The consequence arrives somewhere else. Nothing goes wrong on the cancelled
# requests - they were cancelled, they were supposed to end. What breaks is the
# NEXT request that needs a slot and finds none, and that request is healthy,
# is not cancelled, and has nothing to do with the leak.
#
# The measurement replays a request stream through both release placements and
# reports the pool over time, the request that first fails, and whether it was
# one of the cancelled ones.

def run_stream(stream, mode, pool_size):
    # stream is a list of "ok" / "cancel". Returns
    # [held, served, refused, first_refused_index, first_refused_kind].
    0 => held
    0 => served
    0 => refused
    0 - 1 => first_idx
    "" => first_kind
    0 => i
    while i < len(stream):
        stream[i] => kind
        if held >= pool_size:
            refused + 1 => refused
            if first_idx < 0:
                i => first_idx
                kind => first_kind
        else:
            held + 1 => held
            if kind == "cancel":
                if mode == "finally":
                    held - 1 => held
                # in "success-path" mode the early return skips the release
            else:
                held - 1 => held
                served + 1 => served
        i + 1 => i
    return [held, served, refused, first_idx, first_kind]

3 => POOL

# A stream where cancellations are a minority, as they are in practice.
["ok", "cancel", "ok", "ok", "cancel", "ok", "cancel", "ok", "ok", "ok", "cancel", "ok"] => STREAM
["success-path", "finally"] => MODES

0 => n_cancel
for k in STREAM:
    if k == "cancel":
        n_cancel + 1 => n_cancel
("pool size: " + str(POOL) + ", requests: " + str(len(STREAM)) + ", of which cancelled: " + str(n_cancel))^0

""^0
"release placed  slots still held  served  refused  first refusal at  that request was"^0
"--------------  ----------------  ------  -------  ----------------  ----------------"^0
{} => results
for m in MODES:
    run_stream(STREAM, m, POOL) => r
    r => results[m]
    if r[3] < 0:
        "never" => at
        "-" => kind
    else:
        str(r[3]) => at
        r[4] => kind
    ((m + "                ")[0:16] + (str(r[0]) + "                  ")[0:18] + (str(r[1]) + "        ")[0:8] + (str(r[2]) + "         ")[0:9] + (at + "                  ")[0:18] + kind)^0

""^0
"the pool, request by request, under the success-path release"^0
0 => held
0 => i
while i < len(STREAM):
    STREAM[i] => kind
    if held >= POOL:
        "REFUSED" => what
    else:
        held + 1 => held
        if kind == "cancel":
            "held (never released)" => what
        else:
            held - 1 => held
            "served and released" => what
    (("  " + str(i) + "   ")[0:6] + (kind + "        ")[0:8] + " slots held after: " + (str(held) + "   ")[0:4] + " " + what)^0
    i + 1 => i

""^0
"how many cancellations the pool survives"^0
0 => leaked_before_failure
0 => i
while i < len(STREAM):
    if results["success-path"][3] >= 0:
        if i < results["success-path"][3]:
            if STREAM[i] == "cancel":
                leaked_before_failure + 1 => leaked_before_failure
    i + 1 => i
("cancellations before the first refusal: " + str(leaked_before_failure) + ", pool size: " + str(POOL))^0

""^0
0 => checked
0 => passed

# The success-path release must leak slots.
checked + 1 => checked
if results["success-path"][0] > 0:
    passed + 1 => passed

# The finally release must leak none.
checked + 1 => checked
if results["finally"][0] == 0:
    passed + 1 => passed

# The success-path release must refuse requests; the finally release must
# refuse none.
checked + 1 => checked
if results["success-path"][2] > 0:
    if results["finally"][2] == 0:
        passed + 1 => passed

# The first refusal must land on a request that was NOT cancelled - the
# symptom appears on a healthy request, which is why the cause is looked for
# in the wrong place.
checked + 1 => checked
if results["success-path"][4] == "ok":
    passed + 1 => passed

# The number of cancellations the pool survives must equal its size - the
# leak is one slot per cancellation, measured rather than assumed.
checked + 1 => checked
if leaked_before_failure == POOL:
    passed + 1 => passed

# Every non-cancelled request must succeed under the finally release, so the
# stream itself is not the problem.
checked + 1 => checked
0 => expected_ok
for k in STREAM:
    if k == "ok":
        expected_ok + 1 => expected_ok
if results["finally"][1] == expected_ok:
    passed + 1 => passed

# And the success-path release must serve strictly fewer of them.
checked + 1 => checked
if results["success-path"][1] < expected_ok:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The pool ran out three cancellations later, on a request that was fine." => verdict
else:
    "FAILED - the pool did not behave as the checks describe." => verdict
verdict^0

""^0
"Releasing on the way out means releasing on ONE way out. Cancellation is a"^0
"second exit, added later, and it leaves through a door the resource"^0
"accounting does not watch. Nothing fails at the leak - the cancelled"^0
"requests were meant to end. The failure surfaces on the next healthy"^0
"request, which is where the investigation starts and where the cause is"^0
"not."^0
```

## Python (deterministic transpilation)

```python
def run_stream(stream, mode, pool_size):
    held = 0
    served = 0
    refused = 0
    first_idx = 0 - 1
    first_kind = ""
    i = 0
    while i < len(stream):
        kind = stream[i]
        if held >= pool_size:
            refused = refused + 1
            if first_idx < 0:
                first_idx = i
                first_kind = kind
        else:
            held = held + 1
            if kind == "cancel":
                if mode == "finally":
                    held = held - 1
            else:
                held = held - 1
                served = served + 1
        i = i + 1
    return [held, served, refused, first_idx, first_kind]

POOL = 3
STREAM = ["ok", "cancel", "ok", "ok", "cancel", "ok", "cancel", "ok", "ok", "ok", "cancel", "ok"]
MODES = ["success-path", "finally"]
n_cancel = 0
for k in STREAM:
    if k == "cancel":
        n_cancel = n_cancel + 1
print("pool size: " + str(POOL) + ", requests: " + str(len(STREAM)) + ", of which cancelled: " + str(n_cancel))
print("")
print("release placed  slots still held  served  refused  first refusal at  that request was")
print("--------------  ----------------  ------  -------  ----------------  ----------------")
results = {}
for m in MODES:
    r = run_stream(STREAM, m, POOL)
    results[m] = r
    if r[3] < 0:
        at = "never"
        kind = "-"
    else:
        at = str(r[3])
        kind = r[4]
    print((m + "                ")[0:16] + (str(r[0]) + "                  ")[0:18] + (str(r[1]) + "        ")[0:8] + (str(r[2]) + "         ")[0:9] + (at + "                  ")[0:18] + kind)
print("")
print("the pool, request by request, under the success-path release")
held = 0
i = 0
while i < len(STREAM):
    kind = STREAM[i]
    if held >= POOL:
        what = "REFUSED"
    else:
        held = held + 1
        if kind == "cancel":
            what = "held (never released)"
        else:
            held = held - 1
            what = "served and released"
    print(("  " + str(i) + "   ")[0:6] + (kind + "        ")[0:8] + " slots held after: " + (str(held) + "   ")[0:4] + " " + what)
    i = i + 1
print("")
print("how many cancellations the pool survives")
leaked_before_failure = 0
i = 0
while i < len(STREAM):
    if results["success-path"][3] >= 0:
        if i < results["success-path"][3]:
            if STREAM[i] == "cancel":
                leaked_before_failure = leaked_before_failure + 1
    i = i + 1
print("cancellations before the first refusal: " + str(leaked_before_failure) + ", pool size: " + str(POOL))
print("")
checked = 0
passed = 0
checked = checked + 1
if results["success-path"][0] > 0:
    passed = passed + 1
checked = checked + 1
if results["finally"][0] == 0:
    passed = passed + 1
checked = checked + 1
if results["success-path"][2] > 0:
    if results["finally"][2] == 0:
        passed = passed + 1
checked = checked + 1
if results["success-path"][4] == "ok":
    passed = passed + 1
checked = checked + 1
if leaked_before_failure == POOL:
    passed = passed + 1
checked = checked + 1
expected_ok = 0
for k in STREAM:
    if k == "ok":
        expected_ok = expected_ok + 1
if results["finally"][1] == expected_ok:
    passed = passed + 1
checked = checked + 1
if results["success-path"][1] < expected_ok:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The pool ran out three cancellations later, on a request that was fine."
else:
    verdict = "FAILED - the pool did not behave as the checks describe."
print(verdict)
print("")
print("Releasing on the way out means releasing on ONE way out. Cancellation is a")
print("second exit, added later, and it leaves through a door the resource")
print("accounting does not watch. Nothing fails at the leak - the cancelled")
print("requests were meant to end. The failure surfaces on the next healthy")
print("request, which is where the investigation starts and where the cause is")
print("not.")
```

## stdout (executed)

```text
pool size: 3, requests: 12, of which cancelled: 4

release placed  slots still held  served  refused  first refusal at  that request was
--------------  ----------------  ------  -------  ----------------  ----------------
success-path    3                 4       5        7                 ok
finally         0                 8       0        never             -

the pool, request by request, under the success-path release
  0   ok       slots held after: 0    served and released
  1   cancel   slots held after: 1    held (never released)
  2   ok       slots held after: 1    served and released
  3   ok       slots held after: 1    served and released
  4   cancel   slots held after: 2    held (never released)
  5   ok       slots held after: 2    served and released
  6   cancel   slots held after: 3    held (never released)
  7   ok       slots held after: 3    REFUSED
  8   ok       slots held after: 3    REFUSED
  9   ok       slots held after: 3    REFUSED
  10  cancel   slots held after: 3    REFUSED
  11  ok       slots held after: 3    REFUSED

how many cancellations the pool survives
cancellations before the first refusal: 3, pool size: 3

checks passed: 7/7
The pool ran out three cancellations later, on a request that was fine.

Releasing on the way out means releasing on ONE way out. Cancellation is a
second exit, added later, and it leaves through a door the resource
accounting does not watch. Nothing fails at the leak - the cancelled
requests were meant to end. The failure surfaces on the next healthy
request, which is where the investigation starts and where the cause is
not.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
