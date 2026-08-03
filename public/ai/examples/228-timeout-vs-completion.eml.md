<!-- canonical: efficientnewlanguage.org/ai/examples/228-timeout-vs-completion | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 228 — A timeout is a fact about the client

`timeout_vs_completion.eml` sweeps a matrix of when the server finishes against how long the client waits, under three client policies.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A timeout says
# you stopped waiting. It does not say the work stopped.
#
# The client gives up after N ticks. The server, not knowing this, finishes at
# tick N+1 and commits. Both are behaving correctly and they now disagree
# about reality:
#
#     client:  the request failed
#     server:  the request succeeded
#
# There is no error to catch, because there is no error. The timeout is a
# CLIENT-side decision about waiting, and treating it as information about the
# server is the mistake. What follows from it is the expensive part: the
# client retries, the server does the work a second time, and if the operation
# is not idempotent the disagreement becomes a duplicate.
#
# Three client policies over the same set of server behaviours:
#
#     fail-and-retry     assume the timeout means failure; retry
#     fail-and-stop      assume failure; do not retry, report an error
#     reconcile          ask the server what actually happened, then act
#
# The measurement is over a matrix: every combination of when the server
# finishes and how long the client waits. For each, three numbers are counted -
# work actually performed, what the client believed, and whether the two agree.
#
# The result worth stating up front: fail-and-stop is never WRONG about the
# server and is wrong about the outcome, because it reports a failure for work
# that completed. Only reconciliation gets both right, and it costs a second
# round trip that only exists because the first one was ambiguous.

def run(finish_at, wait_until, policy):
    # Returns [work_done, client_believes_success, retried].
    # `finish_at` is the tick the server commits on; `wait_until` is the last
    # tick the client waits for.
    0 => work
    0 => retried
    finish_at <= wait_until => observed

    if observed:
        1 => work
        return [work, True, 0]

    # The client timed out. The server still finishes.
    1 => work

    if policy == "retry":
        # Retry blindly. The server does it again.
        1 => retried
        work + 1 => work
        return [work, True, retried]
    if policy == "stop":
        return [work, False, 0]
    # reconcile: ask, discover it completed, do not repeat it
    return [work, True, 0]


"finish wait  retry(work/believes)  stop(work/believes)  reconcile(work/believes)"^0
[1, 2, 3, 4, 5] => finishes
[1, 2, 3, 4, 5] => waits

0 => cells
{} => dup
{} => wrong
{} => extra_calls
for p in ["retry", "stop", "reconcile"]:
    0 => dup[p]
    0 => wrong[p]
    0 => extra_calls[p]

for f in finishes:
    for w in waits:
        cells + 1 => cells
        run(f, w, "retry") => r1
        run(f, w, "stop") => r2
        run(f, w, "reconcile") => r3
        # The work ALWAYS happens exactly once unless a retry duplicates it.
        if r1[0] > 1:
            dup["retry"] + 1 => dup["retry"]
        if r2[0] > 1:
            dup["stop"] + 1 => dup["stop"]
        if r3[0] > 1:
            dup["reconcile"] + 1 => dup["reconcile"]
        # The client's belief is wrong when it says failure and work happened.
        if not (r1[1] == True):
            wrong["retry"] + 1 => wrong["retry"]
        if not (r2[1] == True):
            wrong["stop"] + 1 => wrong["stop"]
        if not (r3[1] == True):
            wrong["reconcile"] + 1 => wrong["reconcile"]
        if f > w:
            extra_calls["reconcile"] + 1 => extra_calls["reconcile"]
            extra_calls["retry"] + 1 => extra_calls["retry"]

for f in [3]:
    for w in [1, 2, 3, 4, 5]:
        run(f, w, "retry") => r1
        run(f, w, "stop") => r2
        run(f, w, "reconcile") => r3
        ("%-6d %-5d %-21s %-20s %s" % (f, w, str(r1[0]) + "/" + str(r1[1]), str(r2[0]) + "/" + str(r2[1]), str(r3[0]) + "/" + str(r3[1])))^0

""^0
("matrix cells (finish x wait): " + str(cells))^0
"policy       duplicated work  believed failure  extra round trips"^0
for p in ["retry", "stop", "reconcile"]:
    ("%-12s %-16d %-17d %d" % (p, dup[p], wrong[p], extra_calls[p]))^0

# ------------------------------------------------- the ambiguous region
0 => ambiguous
for f in finishes:
    for w in waits:
        if f > w:
            ambiguous + 1 => ambiguous

""^0
("cells where the client timed out: " + str(ambiguous) + "/" + str(cells))^0
("in every one of them the work HAPPENED - the timeout carried no information")^0
("about the server at all, only about how long the client was willing to wait.")^0

# ------------------------------------- what a shorter timeout actually buys
# Tightening the timeout does not reduce duplicates; it increases them, because
# it enlarges the region where the client gives up on work that completes.
0 => tight
0 => loose
for f in finishes:
    if f > 1:
        tight + 1 => tight
    if f > 4:
        loose + 1 => loose

""^0
("with wait=1, finishes that time out: " + str(tight) + "/" + str(len(finishes)))^0
("with wait=4, finishes that time out: " + str(loose) + "/" + str(len(finishes)))^0
"A shorter timeout makes the ambiguous region LARGER, not smaller."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Reconciliation never duplicates and never reports a false failure.
checked + 1 => checked
if dup["reconcile"] == 0 and wrong["reconcile"] == 0:
    passed + 1 => passed

# Blind retry must duplicate exactly on the ambiguous cells.
checked + 1 => checked
if dup["retry"] == ambiguous and ambiguous > 0:
    passed + 1 => passed

# Fail-and-stop must never duplicate and must report failure on exactly the
# ambiguous cells - correct about itself, wrong about the outcome.
checked + 1 => checked
if dup["stop"] == 0 and wrong["stop"] == ambiguous:
    passed + 1 => passed

# The two broken policies must fail in DIFFERENT ways, or there is only one
# lesson here.
checked + 1 => checked
if dup["retry"] > 0 and dup["stop"] == 0:
    if wrong["stop"] > 0 and wrong["retry"] == 0:
        passed + 1 => passed

# And a shorter timeout must widen the ambiguous region, which is the
# counterintuitive part.
checked + 1 => checked
if tight > loose:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Retry duplicates, stop lies, and only asking the server gets both right." => verdict
else:
    "FAILED - a policy did not behave as the checks describe." => verdict
verdict^0

""^0
"The two wrong policies are wrong in opposite directions and a system usually" => n1
n1^0
"picks one by temperament rather than by analysis. Retrying trades a false" => n2
n2^0
"failure for a duplicate; stopping trades a duplicate for a false failure." => n3
n3^0
"Neither can be repaired by tuning the timeout, because the timeout is not" => n4
n4^0
"measuring the thing the decision needs to know." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def run(finish_at, wait_until, policy):
    work = 0
    retried = 0
    observed = finish_at <= wait_until
    if observed:
        work = 1
        return [work, True, 0]
    work = 1
    if policy == "retry":
        retried = 1
        work = work + 1
        return [work, True, retried]
    if policy == "stop":
        return [work, False, 0]
    return [work, True, 0]

print("finish wait  retry(work/believes)  stop(work/believes)  reconcile(work/believes)")
finishes = [1, 2, 3, 4, 5]
waits = [1, 2, 3, 4, 5]
cells = 0
dup = {}
wrong = {}
extra_calls = {}
for p in ["retry", "stop", "reconcile"]:
    dup[p] = 0
    wrong[p] = 0
    extra_calls[p] = 0
for f in finishes:
    for w in waits:
        cells = cells + 1
        r1 = run(f, w, "retry")
        r2 = run(f, w, "stop")
        r3 = run(f, w, "reconcile")
        if r1[0] > 1:
            dup["retry"] = dup["retry"] + 1
        if r2[0] > 1:
            dup["stop"] = dup["stop"] + 1
        if r3[0] > 1:
            dup["reconcile"] = dup["reconcile"] + 1
        if not r1[1] == True:
            wrong["retry"] = wrong["retry"] + 1
        if not r2[1] == True:
            wrong["stop"] = wrong["stop"] + 1
        if not r3[1] == True:
            wrong["reconcile"] = wrong["reconcile"] + 1
        if f > w:
            extra_calls["reconcile"] = extra_calls["reconcile"] + 1
            extra_calls["retry"] = extra_calls["retry"] + 1
for f in [3]:
    for w in [1, 2, 3, 4, 5]:
        r1 = run(f, w, "retry")
        r2 = run(f, w, "stop")
        r3 = run(f, w, "reconcile")
        print("%-6d %-5d %-21s %-20s %s" % (f, w, str(r1[0]) + "/" + str(r1[1]), str(r2[0]) + "/" + str(r2[1]), str(r3[0]) + "/" + str(r3[1])))
print("")
print("matrix cells (finish x wait): " + str(cells))
print("policy       duplicated work  believed failure  extra round trips")
for p in ["retry", "stop", "reconcile"]:
    print("%-12s %-16d %-17d %d" % (p, dup[p], wrong[p], extra_calls[p]))
ambiguous = 0
for f in finishes:
    for w in waits:
        if f > w:
            ambiguous = ambiguous + 1
print("")
print("cells where the client timed out: " + str(ambiguous) + "/" + str(cells))
print("in every one of them the work HAPPENED - the timeout carried no information")
print("about the server at all, only about how long the client was willing to wait.")
tight = 0
loose = 0
for f in finishes:
    if f > 1:
        tight = tight + 1
    if f > 4:
        loose = loose + 1
print("")
print("with wait=1, finishes that time out: " + str(tight) + "/" + str(len(finishes)))
print("with wait=4, finishes that time out: " + str(loose) + "/" + str(len(finishes)))
print("A shorter timeout makes the ambiguous region LARGER, not smaller.")
passed = 0
checked = 0
checked = checked + 1
if dup["reconcile"] == 0 and wrong["reconcile"] == 0:
    passed = passed + 1
checked = checked + 1
if dup["retry"] == ambiguous and ambiguous > 0:
    passed = passed + 1
checked = checked + 1
if dup["stop"] == 0 and wrong["stop"] == ambiguous:
    passed = passed + 1
checked = checked + 1
if dup["retry"] > 0 and dup["stop"] == 0:
    if wrong["stop"] > 0 and wrong["retry"] == 0:
        passed = passed + 1
checked = checked + 1
if tight > loose:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Retry duplicates, stop lies, and only asking the server gets both right."
else:
    verdict = "FAILED - a policy did not behave as the checks describe."
print(verdict)
print("")
n1 = "The two wrong policies are wrong in opposite directions and a system usually"
print(n1)
n2 = "picks one by temperament rather than by analysis. Retrying trades a false"
print(n2)
n3 = "failure for a duplicate; stopping trades a duplicate for a false failure."
print(n3)
n4 = "Neither can be repaired by tuning the timeout, because the timeout is not"
print(n4)
n5 = "measuring the thing the decision needs to know."
print(n5)
```

## stdout (executed)

```text
finish wait  retry(work/believes)  stop(work/believes)  reconcile(work/believes)
3      1     2/True                1/False              1/True
3      2     2/True                1/False              1/True
3      3     1/True                1/True               1/True
3      4     1/True                1/True               1/True
3      5     1/True                1/True               1/True

matrix cells (finish x wait): 25
policy       duplicated work  believed failure  extra round trips
retry        10               0                 10
stop         0                10                0
reconcile    0                0                 10

cells where the client timed out: 10/25
in every one of them the work HAPPENED - the timeout carried no information
about the server at all, only about how long the client was willing to wait.

with wait=1, finishes that time out: 4/5
with wait=4, finishes that time out: 1/5
A shorter timeout makes the ambiguous region LARGER, not smaller.

checks passed: 5/5
Retry duplicates, stop lies, and only asking the server gets both right.

The two wrong policies are wrong in opposite directions and a system usually
picks one by temperament rather than by analysis. Retrying trades a false
failure for a duplicate; stopping trades a duplicate for a false failure.
Neither can be repaired by tuning the timeout, because the timeout is not
measuring the thing the decision needs to know.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:output · eml:assign · eml:call · eml:return · eml:run:done
