<!-- canonical: efficientnewlanguage.org/ai/examples/316-partial-batch-failure-retries-everything | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 316 — Partial batch failure retries everything — one record that can never succeed rewrote every record that already had

`partial_batch_failure_retries_everything.eml` sends six records — one of them permanently bad — through three writers, and counts what the store holds afterwards plus how many records were delivered more than once.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The batch is the
# unit of sending and it was quietly made the unit of failure and the unit of
# retry, and those are three different questions.
#
# A writer sends records in batches. The endpoint accepts each record
# individually and reports per-record results, because that is what a sane
# endpoint does. The caller looks at the response, sees that the CALL failed,
# and retries - the whole batch, because the batch is what it has a handle on.
#
# The records that already succeeded are sent again. Whether that is harmless
# depends entirely on whether the endpoint is idempotent, and the batching code
# is nowhere near the code that decides that. So the batch size, chosen for
# throughput, becomes the blast radius of every retry.
#
# The measurement runs the same records through three writers - retry the
# batch, retry the failures, and retry the batch against an idempotent
# endpoint - and counts what the store actually contains afterwards, plus how
# many records were delivered more than once.

def fails(rec, attempt):
    # rec is [id, kind]. "flaky" fails on its first attempt only; "poison"
    # always fails. Everything else succeeds.
    if rec[1] == "poison":
        return 1
    if rec[1] == "flaky":
        if attempt == 1:
            return 1
    return 0

def send(store, deliveries, rec, attempt, idempotent):
    # Returns [store, deliveries, ok]. The endpoint records every delivery it
    # accepted, so double-writes are visible afterwards rather than assumed.
    if fails(rec, attempt) == 1:
        return [store, deliveries, 0]
    deliveries + [rec[0]] => deliveries
    if idempotent == 1:
        0 => present
        for x in store:
            if x == rec[0]:
                1 => present
        if present == 0:
            store + [rec[0]] => store
    else:
        store + [rec[0]] => store
    return [store, deliveries, 1]

def write_batch(records, mode, idempotent, max_attempts):
    # mode "whole": on any failure, retry the entire batch.
    # mode "failed": retry only the records that failed.
    [] => store
    [] => deliveries
    [] => pending
    for r in records:
        pending + [r] => pending
    1 => attempt
    0 => calls
    while attempt <= max_attempts:
        if len(pending) > 0:
            calls + 1 => calls
            [] => failed
            if mode == "whole":
                # The whole batch goes again, including what already landed.
                [] => to_send
                for r in records:
                    to_send + [r] => to_send
            else:
                [] => to_send
                for r in pending:
                    to_send + [r] => to_send
            for r in to_send:
                send(store, deliveries, r, attempt, idempotent) => res
                res[0] => store
                res[1] => deliveries
                if res[2] == 0:
                    failed + [r] => failed
            failed => pending
        attempt + 1 => attempt
    return [store, deliveries, len(pending), calls]

def duplicates(deliveries):
    0 => n
    [] => seen
    for d in deliveries:
        0 => hit
        for s in seen:
            if s == d:
                1 => hit
        if hit == 1:
            n + 1 => n
        else:
            seen + [d] => seen
    return n

# id, kind
[["r1", "ok"], ["r2", "ok"], ["r3", "flaky"], ["r4", "ok"], ["r5", "poison"], ["r6", "ok"]] => RECORDS

"writer                       stored  deliveries  duplicates  stuck  calls"^0
"---------------------------  ------  ----------  ----------  -----  -----"^0

{} => runs
for spec in [["retry whole batch", "whole", 0],
             ["retry failed only", "failed", 0],
             ["retry whole, idempotent", "whole", 1]]:
    write_batch(RECORDS, spec[1], spec[2], 3) => r
    r => runs[spec[0]]
    duplicates(r[1]) => dup
    ((spec[0] + "                             ")[0:29] + (str(len(r[0])) + "        ")[0:8] + (str(len(r[1])) + "            ")[0:12] + (str(dup) + "            ")[0:12] + (str(r[2]) + "       ")[0:7] + str(r[3]))^0

""^0
("records: " + str(len(RECORDS)) + ", of which one is permanently bad")^0

""^0
"what the store holds, per writer"^0
for name in ["retry whole batch", "retry failed only", "retry whole, idempotent"]:
    runs[name] => r
    "" => shown
    for x in r[0]:
        shown + x + " " => shown
    ((name + "                             ")[0:29] + shown)^0

""^0
"the one poison record decides how many times everything else is written"^0

# The mechanism: the batch keeps retrying because ONE record can never
# succeed, and every retry re-sends the records that already did. Vary the
# batch's contents and read the duplicate count back out.
for n_ok in [1, 3, 5]:
    [] => probe
    0 => i
    while i < n_ok:
        probe + [["p" + str(i), "ok"]] => probe
        i + 1 => i
    probe + [["bad", "poison"]] => probe
    write_batch(probe, "whole", 0, 3) => r
    (str(n_ok) + " good + 1 poison -> duplicate deliveries: " + str(duplicates(r[1])))^0

""^0
0 => checked
0 => passed

# Retrying the whole batch must produce duplicate deliveries.
checked + 1 => checked
if duplicates(runs["retry whole batch"][1]) > 0:
    passed + 1 => passed

# Retrying only the failures must produce none.
checked + 1 => checked
if duplicates(runs["retry failed only"][1]) == 0:
    passed + 1 => passed

# Both must deliver every deliverable record - the safe writer is not safe by
# doing less.
checked + 1 => checked
0 => deliverable
for r in RECORDS:
    if not (r[1] == "poison"):
        deliverable + 1 => deliverable
if len(runs["retry failed only"][0]) == deliverable:
    if len(runs["retry whole batch"][0]) >= deliverable:
        passed + 1 => passed

# The poison record must remain stuck under every writer, so the difference is
# not about eventually succeeding.
checked + 1 => checked
0 => all_stuck
for name in ["retry whole batch", "retry failed only", "retry whole, idempotent"]:
    if runs[name][2] > 0:
        all_stuck + 1 => all_stuck
if all_stuck == 3:
    passed + 1 => passed

# An idempotent endpoint must still RECEIVE the duplicates - idempotence hides
# the damage in the store, it does not stop the traffic.
checked + 1 => checked
if duplicates(runs["retry whole, idempotent"][1]) > 0:
    if len(runs["retry whole, idempotent"][0]) == deliverable:
        passed + 1 => passed

# And the duplicate count must grow with the number of innocent records in the
# batch - the blast radius is the batch size, measured rather than asserted.
checked + 1 => checked
0 => grew
0 => prev
for n_ok in [1, 3, 5]:
    [] => probe
    0 => i
    while i < n_ok:
        probe + [["p" + str(i), "ok"]] => probe
        i + 1 => i
    probe + [["bad", "poison"]] => probe
    duplicates(write_batch(probe, "whole", 0, 3)[1]) => d
    if d > prev:
        grew + 1 => grew
    d => prev
if grew == 3:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "One record that can never succeed rewrote every record that already had." => verdict
else:
    "FAILED - the writers did not behave as the checks describe." => verdict
verdict^0

""^0
"The endpoint reports per record and the caller retries per batch, so the"^0
"unit of failure and the unit of recovery disagree by exactly the batch"^0
"size. Idempotence is the usual answer and it only fixes the store - the"^0
"duplicate calls still leave, still cost, still rate-limit, and are still"^0
"counted by whatever is downstream of the endpoint rather than inside it."^0
```

## Python (deterministic transpilation)

```python
def fails(rec, attempt):
    if rec[1] == "poison":
        return 1
    if rec[1] == "flaky":
        if attempt == 1:
            return 1
    return 0

def send(store, deliveries, rec, attempt, idempotent):
    if fails(rec, attempt) == 1:
        return [store, deliveries, 0]
    deliveries = deliveries + [rec[0]]
    if idempotent == 1:
        present = 0
        for x in store:
            if x == rec[0]:
                present = 1
        if present == 0:
            store = store + [rec[0]]
    else:
        store = store + [rec[0]]
    return [store, deliveries, 1]

def write_batch(records, mode, idempotent, max_attempts):
    store = []
    deliveries = []
    pending = []
    for r in records:
        pending = pending + [r]
    attempt = 1
    calls = 0
    while attempt <= max_attempts:
        if len(pending) > 0:
            calls = calls + 1
            failed = []
            if mode == "whole":
                to_send = []
                for r in records:
                    to_send = to_send + [r]
            else:
                to_send = []
                for r in pending:
                    to_send = to_send + [r]
            for r in to_send:
                res = send(store, deliveries, r, attempt, idempotent)
                store = res[0]
                deliveries = res[1]
                if res[2] == 0:
                    failed = failed + [r]
            pending = failed
        attempt = attempt + 1
    return [store, deliveries, len(pending), calls]

def duplicates(deliveries):
    n = 0
    seen = []
    for d in deliveries:
        hit = 0
        for s in seen:
            if s == d:
                hit = 1
        if hit == 1:
            n = n + 1
        else:
            seen = seen + [d]
    return n

RECORDS = [["r1", "ok"], ["r2", "ok"], ["r3", "flaky"], ["r4", "ok"], ["r5", "poison"], ["r6", "ok"]]
print("writer                       stored  deliveries  duplicates  stuck  calls")
print("---------------------------  ------  ----------  ----------  -----  -----")
runs = {}
for spec in [["retry whole batch", "whole", 0], ["retry failed only", "failed", 0], ["retry whole, idempotent", "whole", 1]]:
    r = write_batch(RECORDS, spec[1], spec[2], 3)
    runs[spec[0]] = r
    dup = duplicates(r[1])
    print((spec[0] + "                             ")[0:29] + (str(len(r[0])) + "        ")[0:8] + (str(len(r[1])) + "            ")[0:12] + (str(dup) + "            ")[0:12] + (str(r[2]) + "       ")[0:7] + str(r[3]))
print("")
print("records: " + str(len(RECORDS)) + ", of which one is permanently bad")
print("")
print("what the store holds, per writer")
for name in ["retry whole batch", "retry failed only", "retry whole, idempotent"]:
    r = runs[name]
    shown = ""
    for x in r[0]:
        shown = shown + x + " "
    print((name + "                             ")[0:29] + shown)
print("")
print("the one poison record decides how many times everything else is written")
for n_ok in [1, 3, 5]:
    probe = []
    i = 0
    while i < n_ok:
        probe = probe + [["p" + str(i), "ok"]]
        i = i + 1
    probe = probe + [["bad", "poison"]]
    r = write_batch(probe, "whole", 0, 3)
    print(str(n_ok) + " good + 1 poison -> duplicate deliveries: " + str(duplicates(r[1])))
print("")
checked = 0
passed = 0
checked = checked + 1
if duplicates(runs["retry whole batch"][1]) > 0:
    passed = passed + 1
checked = checked + 1
if duplicates(runs["retry failed only"][1]) == 0:
    passed = passed + 1
checked = checked + 1
deliverable = 0
for r in RECORDS:
    if not r[1] == "poison":
        deliverable = deliverable + 1
if len(runs["retry failed only"][0]) == deliverable:
    if len(runs["retry whole batch"][0]) >= deliverable:
        passed = passed + 1
checked = checked + 1
all_stuck = 0
for name in ["retry whole batch", "retry failed only", "retry whole, idempotent"]:
    if runs[name][2] > 0:
        all_stuck = all_stuck + 1
if all_stuck == 3:
    passed = passed + 1
checked = checked + 1
if duplicates(runs["retry whole, idempotent"][1]) > 0:
    if len(runs["retry whole, idempotent"][0]) == deliverable:
        passed = passed + 1
checked = checked + 1
grew = 0
prev = 0
for n_ok in [1, 3, 5]:
    probe = []
    i = 0
    while i < n_ok:
        probe = probe + [["p" + str(i), "ok"]]
        i = i + 1
    probe = probe + [["bad", "poison"]]
    d = duplicates(write_batch(probe, "whole", 0, 3)[1])
    if d > prev:
        grew = grew + 1
    prev = d
if grew == 3:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "One record that can never succeed rewrote every record that already had."
else:
    verdict = "FAILED - the writers did not behave as the checks describe."
print(verdict)
print("")
print("The endpoint reports per record and the caller retries per batch, so the")
print("unit of failure and the unit of recovery disagree by exactly the batch")
print("size. Idempotence is the usual answer and it only fixes the store - the")
print("duplicate calls still leave, still cost, still rate-limit, and are still")
print("counted by whatever is downstream of the endpoint rather than inside it.")
```

## stdout (executed)

```text
writer                       stored  deliveries  duplicates  stuck  calls
---------------------------  ------  ----------  ----------  -----  -----
retry whole batch            14      14          9           1      3
retry failed only            5       5           0           1      3
retry whole, idempotent      5       14          9           1      3

records: 6, of which one is permanently bad

what the store holds, per writer
retry whole batch            r1 r2 r4 r6 r1 r2 r3 r4 r6 r1 r2 r3 r4 r6 
retry failed only            r1 r2 r4 r6 r3 
retry whole, idempotent      r1 r2 r4 r6 r3 

the one poison record decides how many times everything else is written
1 good + 1 poison -> duplicate deliveries: 2
3 good + 1 poison -> duplicate deliveries: 6
5 good + 1 poison -> duplicate deliveries: 10

checks passed: 6/6
One record that can never succeed rewrote every record that already had.

The endpoint reports per record and the caller retries per batch, so the
unit of failure and the unit of recovery disagree by exactly the batch
size. Idempotence is the usual answer and it only fixes the store - the
duplicate calls still leave, still cost, still rate-limit, and are still
counted by whatever is downstream of the endpoint rather than inside it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
