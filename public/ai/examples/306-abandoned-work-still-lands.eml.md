<!-- canonical: efficientnewlanguage.org/ai/examples/306-abandoned-work-still-lands | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 306 — Abandoned work still lands — the caller stopped waiting and the work did not stop working

`abandoned_work_still_lands.eml` runs six requests through three handlers — deadline only, deadline plus a cancel signal, and deadline plus an idempotency key — and compares what the user was **told** against what the store ends up holding.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The timeout ended
# the caller's wait. It did not end the work.
#
# A handler calls a downstream operation with a deadline. The deadline expires,
# the handler returns an error, the user sees "something went wrong". None of
# that reaches the operation, which is still running, and which finishes and
# writes its effect a moment later.
#
# Everything about this is locally correct. A timeout is a bound on how long
# the CALLER waits - that is its definition, and it is the right definition,
# because the caller has a user in front of it. Turning it into a bound on the
# work needs a second mechanism: a cancellation signal the work checks, and a
# point before the write where checking it still means something.
#
# Then the user retries, because they were told it failed. Now two effects
# land for one intent.
#
# The measurement runs a batch of requests under three handlers - deadline
# only, deadline plus a cancel signal, and deadline plus cancel plus an
# idempotency key - and compares what the user was TOLD against what the store
# ends up holding.

def run_request(req, mode, store, told):
    # req is [id, duration]. Returns [store, told].
    req[0] => rid
    req[1] => dur
    DEADLINE => d

    if dur <= d:
        # completes in time - the ordinary path, identical under all modes
        return [apply_effect(store, rid, mode), told + ["ok"]]

    # the deadline expires first
    told + ["failed"] => told
    if mode == "deadline-only":
        # nothing tells the work to stop; it finishes and writes
        return [apply_effect(store, rid, mode), told]
    # the cancel signal is checked before the write
    return [store, told]

def apply_effect(store, rid, mode):
    if mode == "idempotent":
        for x in store:
            if x == rid:
                return store
    return store + [rid]

def retry_of(req):
    # The user retries what they were told failed. The retry is faster because
    # the caches are warm - which is the ordinary reason a retry succeeds.
    return [req[0], 1]

def run_all(requests, mode):
    [] => store
    [] => told
    for r in requests:
        run_request(r, mode, store, told) => res
        res[0] => store
        res[1] => told
    # the user retries everything they were told failed
    0 => i
    while i < len(requests):
        if told[i] == "failed":
            run_request(retry_of(requests[i]), mode, store, told) => res2
            res2[0] => store
            res2[1] => told
        i + 1 => i
    return [store, told]

def count_told(told, what):
    0 => n
    for t in told:
        if t == what:
            n + 1 => n
    return n

def effects_for(store, rid):
    0 => n
    for x in store:
        if x == rid:
            n + 1 => n
    return n

5 => DEADLINE

# id, duration in ticks. Three of the six exceed the deadline.
[["r1", 2], ["r2", 9], ["r3", 3], ["r4", 12], ["r5", 4], ["r6", 7]] => REQUESTS
["deadline-only", "cancel-signal", "idempotent"] => MODES

("requests: " + str(len(REQUESTS)) + ", deadline: " + str(DEADLINE) + " ticks")^0
""^0
"handler         told ok  told failed  effects in store  intents  duplicated"^0
"--------------  -------  -----------  ----------------  -------  ----------"^0

{} => runs
for m in MODES:
    run_all(REQUESTS, m) => r
    r => runs[m]
    count_told(r[1], "ok") => n_ok
    count_told(r[1], "failed") => n_failed
    0 => dup
    for req in REQUESTS:
        if effects_for(r[0], req[0]) > 1:
            dup + 1 => dup
    ((m + "                ")[0:16] + (str(n_ok) + "         ")[0:9] + (str(n_failed) + "             ")[0:13] + (str(len(r[0])) + "                  ")[0:18] + (str(len(REQUESTS)) + "         ")[0:9] + str(dup))^0

""^0
"per request, under the deadline-only handler"^0
runs["deadline-only"] => d
for req in REQUESTS:
    effects_for(d[0], req[0]) => n
    if req[1] > DEADLINE:
        "over deadline" => note
    else:
        "in time" => note
    ((req[0] + "    ")[0:5] + " duration " + (str(req[1]) + "   ")[0:4] + " " + (note + "               ")[0:15] + " effects landed: " + str(n))^0

""^0
"what the user was told, against what happened"^0
for m in MODES:
    runs[m] => r
    count_told(r[1], "ok") => n_ok
    (( m + "                ")[0:16] + " told ok " + str(n_ok) + " times, store holds " + str(len(r[0])) + " effects for " + str(len(REQUESTS)) + " intents")^0

""^0
"the requests that were told failed and succeeded anyway"^0
0 => lied_to
for req in REQUESTS:
    if req[1] > DEADLINE:
        if effects_for(runs["deadline-only"][0], req[0]) > 0:
            lied_to + 1 => lied_to
("requests reported as failed whose effect landed: " + str(lied_to))^0

""^0
0 => checked
0 => passed

# The deadline-only handler must produce more effects than intents.
checked + 1 => checked
if len(runs["deadline-only"][0]) > len(REQUESTS):
    passed + 1 => passed

# The cancel signal must bring the effect count back to at most the intent
# count.
checked + 1 => checked
if len(runs["cancel-signal"][0]) <= len(REQUESTS):
    passed + 1 => passed

# Every request that finished within the deadline must be unaffected by the
# mode - the difference is confined to the ones that ran long.
checked + 1 => checked
0 => fast_differs
for req in REQUESTS:
    if req[1] <= DEADLINE:
        if not (effects_for(runs["deadline-only"][0], req[0]) == effects_for(runs["cancel-signal"][0], req[0])):
            fast_differs + 1 => fast_differs
if fast_differs == 0:
    passed + 1 => passed

# Some request must be told "failed" and land its effect anyway - the report
# and the reality disagreeing is the whole case.
checked + 1 => checked
if lied_to > 0:
    passed + 1 => passed

# The idempotency key must also hold the count down, by a different mechanism -
# it does not stop the work, it makes the second write a no-op.
checked + 1 => checked
if len(runs["idempotent"][0]) <= len(REQUESTS):
    passed + 1 => passed

# But it must NOT reduce the number of times the user is told the request
# failed. Idempotence fixes the store; the user still sees an error for
# something that happened.
checked + 1 => checked
if count_told(runs["idempotent"][1], "failed") == count_told(runs["deadline-only"][1], "failed"):
    passed + 1 => passed

# And no handler may lose a request that finished in time.
checked + 1 => checked
0 => lost
for m in MODES:
    for req in REQUESTS:
        if req[1] <= DEADLINE:
            if effects_for(runs[m][0], req[0]) == 0:
                lost + 1 => lost
if lost == 0:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The caller stopped waiting and the work did not stop working." => verdict
else:
    "FAILED - the handlers did not behave as the checks describe." => verdict
verdict^0

""^0
"A deadline bounds a WAIT. Making it bound the work needs a signal the work"^0
"reads and a point before the write where reading it still helps - two"^0
"things that do not come with the timeout and are not implied by it. Until"^0
"they exist, 'timed out' is a statement about the caller's patience that"^0
"the user reads as a statement about the outcome, and acts on."^0
```

## Python (deterministic transpilation)

```python
def run_request(req, mode, store, told):
    rid = req[0]
    dur = req[1]
    d = DEADLINE
    if dur <= d:
        return [apply_effect(store, rid, mode), told + ["ok"]]
    told = told + ["failed"]
    if mode == "deadline-only":
        return [apply_effect(store, rid, mode), told]
    return [store, told]

def apply_effect(store, rid, mode):
    if mode == "idempotent":
        for x in store:
            if x == rid:
                return store
    return store + [rid]

def retry_of(req):
    return [req[0], 1]

def run_all(requests, mode):
    store = []
    told = []
    for r in requests:
        res = run_request(r, mode, store, told)
        store = res[0]
        told = res[1]
    i = 0
    while i < len(requests):
        if told[i] == "failed":
            res2 = run_request(retry_of(requests[i]), mode, store, told)
            store = res2[0]
            told = res2[1]
        i = i + 1
    return [store, told]

def count_told(told, what):
    n = 0
    for t in told:
        if t == what:
            n = n + 1
    return n

def effects_for(store, rid):
    n = 0
    for x in store:
        if x == rid:
            n = n + 1
    return n

DEADLINE = 5
REQUESTS = [["r1", 2], ["r2", 9], ["r3", 3], ["r4", 12], ["r5", 4], ["r6", 7]]
MODES = ["deadline-only", "cancel-signal", "idempotent"]
print("requests: " + str(len(REQUESTS)) + ", deadline: " + str(DEADLINE) + " ticks")
print("")
print("handler         told ok  told failed  effects in store  intents  duplicated")
print("--------------  -------  -----------  ----------------  -------  ----------")
runs = {}
for m in MODES:
    r = run_all(REQUESTS, m)
    runs[m] = r
    n_ok = count_told(r[1], "ok")
    n_failed = count_told(r[1], "failed")
    dup = 0
    for req in REQUESTS:
        if effects_for(r[0], req[0]) > 1:
            dup = dup + 1
    print((m + "                ")[0:16] + (str(n_ok) + "         ")[0:9] + (str(n_failed) + "             ")[0:13] + (str(len(r[0])) + "                  ")[0:18] + (str(len(REQUESTS)) + "         ")[0:9] + str(dup))
print("")
print("per request, under the deadline-only handler")
d = runs["deadline-only"]
for req in REQUESTS:
    n = effects_for(d[0], req[0])
    if req[1] > DEADLINE:
        note = "over deadline"
    else:
        note = "in time"
    print((req[0] + "    ")[0:5] + " duration " + (str(req[1]) + "   ")[0:4] + " " + (note + "               ")[0:15] + " effects landed: " + str(n))
print("")
print("what the user was told, against what happened")
for m in MODES:
    r = runs[m]
    n_ok = count_told(r[1], "ok")
    print((m + "                ")[0:16] + " told ok " + str(n_ok) + " times, store holds " + str(len(r[0])) + " effects for " + str(len(REQUESTS)) + " intents")
print("")
print("the requests that were told failed and succeeded anyway")
lied_to = 0
for req in REQUESTS:
    if req[1] > DEADLINE:
        if effects_for(runs["deadline-only"][0], req[0]) > 0:
            lied_to = lied_to + 1
print("requests reported as failed whose effect landed: " + str(lied_to))
print("")
checked = 0
passed = 0
checked = checked + 1
if len(runs["deadline-only"][0]) > len(REQUESTS):
    passed = passed + 1
checked = checked + 1
if len(runs["cancel-signal"][0]) <= len(REQUESTS):
    passed = passed + 1
checked = checked + 1
fast_differs = 0
for req in REQUESTS:
    if req[1] <= DEADLINE:
        if not effects_for(runs["deadline-only"][0], req[0]) == effects_for(runs["cancel-signal"][0], req[0]):
            fast_differs = fast_differs + 1
if fast_differs == 0:
    passed = passed + 1
checked = checked + 1
if lied_to > 0:
    passed = passed + 1
checked = checked + 1
if len(runs["idempotent"][0]) <= len(REQUESTS):
    passed = passed + 1
checked = checked + 1
if count_told(runs["idempotent"][1], "failed") == count_told(runs["deadline-only"][1], "failed"):
    passed = passed + 1
checked = checked + 1
lost = 0
for m in MODES:
    for req in REQUESTS:
        if req[1] <= DEADLINE:
            if effects_for(runs[m][0], req[0]) == 0:
                lost = lost + 1
if lost == 0:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The caller stopped waiting and the work did not stop working."
else:
    verdict = "FAILED - the handlers did not behave as the checks describe."
print(verdict)
print("")
print("A deadline bounds a WAIT. Making it bound the work needs a signal the work")
print("reads and a point before the write where reading it still helps - two")
print("things that do not come with the timeout and are not implied by it. Until")
print("they exist, 'timed out' is a statement about the caller's patience that")
print("the user reads as a statement about the outcome, and acts on.")
```

## stdout (executed)

```text
requests: 6, deadline: 5 ticks

handler         told ok  told failed  effects in store  intents  duplicated
--------------  -------  -----------  ----------------  -------  ----------
deadline-only   6        3            9                 6        3
cancel-signal   6        3            6                 6        0
idempotent      6        3            6                 6        0

per request, under the deadline-only handler
r1    duration 2    in time         effects landed: 1
r2    duration 9    over deadline   effects landed: 2
r3    duration 3    in time         effects landed: 1
r4    duration 12   over deadline   effects landed: 2
r5    duration 4    in time         effects landed: 1
r6    duration 7    over deadline   effects landed: 2

what the user was told, against what happened
deadline-only    told ok 6 times, store holds 9 effects for 6 intents
cancel-signal    told ok 6 times, store holds 6 effects for 6 intents
idempotent       told ok 6 times, store holds 6 effects for 6 intents

the requests that were told failed and succeeded anyway
requests reported as failed whose effect landed: 3

checks passed: 7/7
The caller stopped waiting and the work did not stop working.

A deadline bounds a WAIT. Making it bound the work needs a signal the work
reads and a point before the write where reading it still helps - two
things that do not come with the timeout and are not implied by it. Until
they exist, 'timed out' is a statement about the caller's patience that
the user reads as a statement about the outcome, and acts on.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
