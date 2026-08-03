<!-- canonical: efficientnewlanguage.org/ai/examples/223-lost-update-schedule | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 223 — Every interleaving, written down

`lost_update_schedule.eml` enumerates all 20 interleavings of two read-modify-write transactions and runs three strategies over every one.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two updates, one
# counter, and every order they can happen in.
#
# Read-modify-write is three steps:
#
#     read v      modify v+1      write v
#
# and if two of them interleave, one increment disappears. This is normally
# discussed as a concurrency problem, which makes it sound like it needs
# threads to study. It does not. The set of interleavings is finite and can be
# written down, and writing it down is the only way to state what a fix
# actually guarantees.
#
# So there are no threads here. A SCHEDULE is a list of steps, each naming
# which transaction acts, and the program enumerates every legal schedule of
# two transactions and reports what each strategy produces over all of them.
#
#     read-modify-write   loses an update on some schedules
#     compare-and-set     never wrong, but sometimes REFUSES
#     atomic increment    always right, and needs no retry
#
# The middle one is the interesting result. Compare-and-set does not produce a
# wrong answer on any schedule, which is why it is the standard advice - but on
# the schedules where the naive version loses an update, CAS does not silently
# succeed either. It fails, and the caller has to retry. A design that treats
# a CAS failure as an error rather than as a retry has converted a lost update
# into an outage, which is better and is not the same as correct.
#
# The measurement is over every interleaving, not a sampled one, and the
# expected value is computed from the schedule rather than typed in: two
# increments must always leave the counter at start + 2.

def interleavings(a, b):
    # Every way to merge two ordered sequences while preserving each one's
    # internal order. For two 3-step transactions that is 20 schedules.
    if len(a) == 0:
        return [b]
    if len(b) == 0:
        return [a]
    [] => out
    for rest in interleavings(a[1:], b):
        out + [[a[0]] + rest] => out
    for rest in interleavings(a, b[1:]):
        out + [[b[0]] + rest] => out
    return out

[["A", "read"], ["A", "modify"], ["A", "write"]] => txn_a
[["B", "read"], ["B", "modify"], ["B", "write"]] => txn_b
interleavings(txn_a, txn_b) => schedules

def render(sched):
    "" => s
    for step in sched:
        if len(s) > 0:
            s + " " => s
        s + step[0] + ":" + step[1][0] => s
    return s

# --------------------------------------------------------- read-modify-write
def run_naive(sched, start):
    # Each transaction holds its own register between read and write; the
    # shared counter is a one-element list because EML-P has no `global`.
    [start] => shared
    {} => reg
    for step in sched:
        step[0] => who
        step[1] => what
        if what == "read":
            shared[0] => reg[who]
        elif what == "modify":
            reg[who] + 1 => reg[who]
        else:
            reg[who] => shared[0]
    return shared[0]

# ------------------------------------------------------------ compare-and-set
def run_cas(sched, start):
    # The write only lands if the counter still holds what was read. Returns
    # [final, failures].
    [start] => shared
    {} => reg
    {} => witness
    0 => failed
    for step in sched:
        step[0] => who
        step[1] => what
        if what == "read":
            shared[0] => reg[who]
            shared[0] => witness[who]
        elif what == "modify":
            reg[who] + 1 => reg[who]
        else:
            if shared[0] == witness[who]:
                reg[who] => shared[0]
            else:
                failed + 1 => failed
    return [shared[0], failed]

# --------------------------------------------------------- atomic increment
def run_atomic(sched, start):
    # The whole read-modify-write is one indivisible step, so the "read" and
    # "modify" steps of a schedule do nothing observable.
    [start] => shared
    for step in sched:
        if step[1] == "write":
            shared[0] + 1 => shared[0]
    return shared[0]


100 => start
start + 2 => expected

"schedule                 naive  cas(final/fails)  atomic"^0
0 => naive_right
0 => cas_right
0 => cas_refused
0 => atomic_right
[] => losing
for s in schedules:
    run_naive(s, start) => n
    run_cas(s, start) => c
    run_atomic(s, start) => a
    if n == expected:
        naive_right + 1 => naive_right
    else:
        if len(losing) < 4:
            losing + [render(s) + " -> " + str(n)] => losing
    if c[0] == expected:
        cas_right + 1 => cas_right
    if c[1] > 0:
        cas_refused + 1 => cas_refused
    if a == expected:
        atomic_right + 1 => atomic_right

for s in schedules:
    run_naive(s, start) => n
    run_cas(s, start) => c
    run_atomic(s, start) => a
    ("%-24s %-6d %-17s %d" % (render(s), n, str(c[0]) + "/" + str(c[1]), a))^0

""^0
("schedules enumerated:      " + str(len(schedules)))^0
("expected final value:      " + str(expected))^0
("  naive correct:           " + str(naive_right) + "/" + str(len(schedules)))^0
("  CAS reached " + str(expected) + ":        " + str(cas_right) + "/" + str(len(schedules)))^0
("  CAS refused a write:     " + str(cas_refused) + "/" + str(len(schedules)))^0
("  atomic correct:          " + str(atomic_right) + "/" + str(len(schedules)))^0

""^0
"Schedules where an increment disappears:"^0
for l in losing:
    ("  " + l)^0

# ------------------------------------------------- CAS never gives a wrong answer
# The distinction that matters: CAS's failures are REFUSALS, never wrong
# values. Counted separately, because "not correct" and "wrong" are different.
0 => cas_wrong
0 => cas_short
for s in schedules:
    run_cas(s, start) => c
    if c[0] > expected:
        cas_wrong + 1 => cas_wrong
    elif c[0] < expected:
        cas_short + 1 => cas_short

""^0
("CAS results above the expected value (would be corruption): " + str(cas_wrong))^0
("CAS results below it (a refused write, needing a retry):    " + str(cas_short))^0

# ------------------------------------------ does a retry actually converge?
# A CAS loop retries the failed transaction serially afterwards. That is the
# complete strategy, and it must reach the expected value on every schedule.
0 => retried_ok
for s in schedules:
    run_cas(s, start) => c
    c[0] => v
    c[1] => f
    for k in [1:f]:
        v + 1 => v
    if v == expected:
        retried_ok + 1 => retried_ok

("CAS plus a serial retry of each refusal: " + str(retried_ok) + "/" + str(len(schedules)))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

checked + 1 => checked
if atomic_right == len(schedules):
    passed + 1 => passed

# The naive version must lose an update on some schedules and not on others -
# if it were wrong everywhere it would have been caught long ago.
checked + 1 => checked
if naive_right > 0 and naive_right < len(schedules):
    passed + 1 => passed

# CAS must never produce a value ABOVE the expectation. That is the whole
# guarantee it offers.
checked + 1 => checked
if cas_wrong == 0:
    passed + 1 => passed

# CAS must refuse on some schedules - it is not free.
checked + 1 => checked
if cas_refused > 0:
    passed + 1 => passed

# And the retry must close the gap on every schedule, or CAS is not a strategy.
checked + 1 => checked
if retried_ok == len(schedules):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "CAS is never wrong and is not always enough; the retry is part of the fix." => verdict
else:
    "FAILED - a strategy did not behave as the checks describe." => verdict
verdict^0

""^0
"The naive version is correct on most schedules, which is exactly why it" => n1
n1^0
"ships. A test that runs two increments and checks the total passes unless" => n2
n2^0
"the interleaving happens to be one of the bad ones, and under low load it" => n3
n3^0
"never is. Enumerating the schedules turns a probability into a list." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def interleavings(a, b):
    if len(a) == 0:
        return [b]
    if len(b) == 0:
        return [a]
    out = []
    for rest in interleavings(a[1:], b):
        out = out + [[a[0]] + rest]
    for rest in interleavings(a, b[1:]):
        out = out + [[b[0]] + rest]
    return out

txn_a = [["A", "read"], ["A", "modify"], ["A", "write"]]
txn_b = [["B", "read"], ["B", "modify"], ["B", "write"]]
schedules = interleavings(txn_a, txn_b)

def render(sched):
    s = ""
    for step in sched:
        if len(s) > 0:
            s = s + " "
        s = s + step[0] + ":" + step[1][0]
    return s

def run_naive(sched, start):
    shared = [start]
    reg = {}
    for step in sched:
        who = step[0]
        what = step[1]
        if what == "read":
            reg[who] = shared[0]
        elif what == "modify":
            reg[who] = reg[who] + 1
        else:
            shared[0] = reg[who]
    return shared[0]

def run_cas(sched, start):
    shared = [start]
    reg = {}
    witness = {}
    failed = 0
    for step in sched:
        who = step[0]
        what = step[1]
        if what == "read":
            reg[who] = shared[0]
            witness[who] = shared[0]
        elif what == "modify":
            reg[who] = reg[who] + 1
        elif shared[0] == witness[who]:
            shared[0] = reg[who]
        else:
            failed = failed + 1
    return [shared[0], failed]

def run_atomic(sched, start):
    shared = [start]
    for step in sched:
        if step[1] == "write":
            shared[0] = shared[0] + 1
    return shared[0]

start = 100
expected = start + 2
print("schedule                 naive  cas(final/fails)  atomic")
naive_right = 0
cas_right = 0
cas_refused = 0
atomic_right = 0
losing = []
for s in schedules:
    n = run_naive(s, start)
    c = run_cas(s, start)
    a = run_atomic(s, start)
    if n == expected:
        naive_right = naive_right + 1
    elif len(losing) < 4:
        losing = losing + [render(s) + " -> " + str(n)]
    if c[0] == expected:
        cas_right = cas_right + 1
    if c[1] > 0:
        cas_refused = cas_refused + 1
    if a == expected:
        atomic_right = atomic_right + 1
for s in schedules:
    n = run_naive(s, start)
    c = run_cas(s, start)
    a = run_atomic(s, start)
    print("%-24s %-6d %-17s %d" % (render(s), n, str(c[0]) + "/" + str(c[1]), a))
print("")
print("schedules enumerated:      " + str(len(schedules)))
print("expected final value:      " + str(expected))
print("  naive correct:           " + str(naive_right) + "/" + str(len(schedules)))
print("  CAS reached " + str(expected) + ":        " + str(cas_right) + "/" + str(len(schedules)))
print("  CAS refused a write:     " + str(cas_refused) + "/" + str(len(schedules)))
print("  atomic correct:          " + str(atomic_right) + "/" + str(len(schedules)))
print("")
print("Schedules where an increment disappears:")
for l in losing:
    print("  " + l)
cas_wrong = 0
cas_short = 0
for s in schedules:
    c = run_cas(s, start)
    if c[0] > expected:
        cas_wrong = cas_wrong + 1
    elif c[0] < expected:
        cas_short = cas_short + 1
print("")
print("CAS results above the expected value (would be corruption): " + str(cas_wrong))
print("CAS results below it (a refused write, needing a retry):    " + str(cas_short))
retried_ok = 0
for s in schedules:
    c = run_cas(s, start)
    v = c[0]
    f = c[1]
    for k in range(1, f+1):
        v = v + 1
    if v == expected:
        retried_ok = retried_ok + 1
print("CAS plus a serial retry of each refusal: " + str(retried_ok) + "/" + str(len(schedules)))
passed = 0
checked = 0
checked = checked + 1
if atomic_right == len(schedules):
    passed = passed + 1
checked = checked + 1
if naive_right > 0 and naive_right < len(schedules):
    passed = passed + 1
checked = checked + 1
if cas_wrong == 0:
    passed = passed + 1
checked = checked + 1
if cas_refused > 0:
    passed = passed + 1
checked = checked + 1
if retried_ok == len(schedules):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "CAS is never wrong and is not always enough; the retry is part of the fix."
else:
    verdict = "FAILED - a strategy did not behave as the checks describe."
print(verdict)
print("")
n1 = "The naive version is correct on most schedules, which is exactly why it"
print(n1)
n2 = "ships. A test that runs two increments and checks the total passes unless"
print(n2)
n3 = "the interleaving happens to be one of the bad ones, and under low load it"
print(n3)
n4 = "never is. Enumerating the schedules turns a probability into a list."
print(n4)
```

## stdout (executed)

```text
schedule                 naive  cas(final/fails)  atomic
A:r A:m A:w B:r B:m B:w  102    102/0             102
A:r A:m B:r A:w B:m B:w  101    101/1             102
A:r A:m B:r B:m A:w B:w  101    101/1             102
A:r A:m B:r B:m B:w A:w  101    101/1             102
A:r B:r A:m A:w B:m B:w  101    101/1             102
A:r B:r A:m B:m A:w B:w  101    101/1             102
A:r B:r A:m B:m B:w A:w  101    101/1             102
A:r B:r B:m A:m A:w B:w  101    101/1             102
A:r B:r B:m A:m B:w A:w  101    101/1             102
A:r B:r B:m B:w A:m A:w  101    101/1             102
B:r A:r A:m A:w B:m B:w  101    101/1             102
B:r A:r A:m B:m A:w B:w  101    101/1             102
B:r A:r A:m B:m B:w A:w  101    101/1             102
B:r A:r B:m A:m A:w B:w  101    101/1             102
B:r A:r B:m A:m B:w A:w  101    101/1             102
B:r A:r B:m B:w A:m A:w  101    101/1             102
B:r B:m A:r A:m A:w B:w  101    101/1             102
B:r B:m A:r A:m B:w A:w  101    101/1             102
B:r B:m A:r B:w A:m A:w  101    101/1             102
B:r B:m B:w A:r A:m A:w  102    102/0             102

schedules enumerated:      20
expected final value:      102
  naive correct:           2/20
  CAS reached 102:        2/20
  CAS refused a write:     18/20
  atomic correct:          20/20

Schedules where an increment disappears:
  A:r A:m B:r A:w B:m B:w -> 101
  A:r A:m B:r B:m A:w B:w -> 101
  A:r A:m B:r B:m B:w A:w -> 101
  A:r B:r A:m A:w B:m B:w -> 101

CAS results above the expected value (would be corruption): 0
CAS results below it (a refused write, needing a retry):    18
CAS plus a serial retry of each refusal: 20/20

checks passed: 5/5
CAS is never wrong and is not always enough; the retry is part of the fix.

The naive version is correct on most schedules, which is exactly why it
ships. A test that runs two increments and checks the total passes unless
the interleaving happens to be one of the bad ones, and under low load it
never is. Enumerating the schedules turns a probability into a list.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
