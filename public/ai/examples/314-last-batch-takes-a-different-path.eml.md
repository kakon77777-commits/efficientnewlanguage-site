<!-- canonical: efficientnewlanguage.org/ai/examples/314-last-batch-takes-a-different-path | ai_layer_version: 0.1.0 | updated: 2026-08-09 -->

# Example 314 — Last batch takes a different path — the remainder is zero in every fixture

`last_batch_takes_a_different_path.eml` runs every input length from 0 to 12 through a buffered writer with batch size 4, and checks whether the records that left through the drain path got the same treatment as the rest.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The full batches
# leave through the loop and the remainder leaves through the shutdown path,
# and the two paths are not the same code.
#
# The main loop flushes when the buffer fills. Whatever is left when the input
# ends has to leave some other way, so a finalize/close/drain function is
# written - later, by whoever noticed records going missing on shutdown. It
# does the flush. It does not necessarily do everything ELSE the main path
# accumulated over the following year: a checksum, a sequence stamp, a
# validation pass, a metric increment.
#
# The number of records that take the second path is `n mod batch`, which is
# ZERO whenever the input divides evenly - and fixtures are written with round
# numbers. So the path that gets the least review is also the path the tests
# are least likely to enter.
#
# The measurement runs every input length against a fixed batch size, checks an
# invariant on the records that came out, and reports exactly which ones fail
# and how that count relates to n mod batch.

def stamped(rec, seq):
    # The main path stamps a sequence number onto every record. rec is a list
    # [id, seq]; seq 0 means unstamped.
    return [rec[0], seq]

def run(records, batch, finalize_stamps):
    # Returns [out, main_path_count, tail_path_count].
    [] => out
    [] => buffer
    0 => seq
    0 => via_main
    0 => via_tail
    for r in records:
        buffer + [r] => buffer
        if len(buffer) == batch:
            for b in buffer:
                seq + 1 => seq
                out + [stamped(b, seq)] => out
                via_main + 1 => via_main
            [] => buffer
    # the drain path
    if len(buffer) > 0:
        for b in buffer:
            via_tail + 1 => via_tail
            if finalize_stamps == 1:
                seq + 1 => seq
                out + [stamped(b, seq)] => out
            else:
                out + [b] => out
        [] => buffer
    return [out, via_main, via_tail]

def unstamped(out):
    0 => n
    for r in out:
        if r[1] == 0:
            n + 1 => n
    return n

def make(n):
    [] => out
    0 => i
    while i < n:
        out + [["r" + str(i + 1), 0]] => out
        i + 1 => i
    return out

4 => BATCH

"n    n mod b  via loop  via drain  unstamped (buggy drain)  unstamped (fixed)"^0
"---  -------  --------  ---------  -----------------------  -----------------"^0

0 => lengths
0 => buggy_bad
0 => fixed_bad
{} => rows
0 => n
while n <= 12:
    make(n) => recs
    run(recs, BATCH, 0) => bad
    run(recs, BATCH, 1) => good
    unstamped(bad[0]) => u_bad
    unstamped(good[0]) => u_good
    lengths + 1 => lengths
    if u_bad > 0:
        buggy_bad + 1 => buggy_bad
    if u_good > 0:
        fixed_bad + 1 => fixed_bad
    [n % BATCH, u_bad, u_good, bad[1], bad[2]] => rows[str(n)]
    ((str(n) + "     ")[0:5] + (str(n % BATCH) + "         ")[0:9] + (str(bad[1]) + "          ")[0:10] + (str(bad[2]) + "           ")[0:11] + (str(u_bad) + "                         ")[0:25] + str(u_good))^0
    n + 1 => n

""^0
("batch size: " + str(BATCH) + ", input lengths tried: " + str(lengths))^0
("lengths where the drain path loses the stamp: " + str(buggy_bad))^0
("lengths where the fixed drain loses it:        " + str(fixed_bad))^0

""^0
"the unstamped count IS n mod batch"^0

# Not a coincidence and not an assertion - both sides are computed and
# compared for every length.
0 => mismatches
0 => n
while n <= 12:
    rows[str(n)] => row
    if not (row[1] == row[0]):
        mismatches + 1 => mismatches
    n + 1 => n
("lengths where unstamped != n mod batch: " + str(mismatches))^0

""^0
"which input lengths a fixture would use"^0
0 => n
while n <= 12:
    rows[str(n)] => row
    if row[0] == 0:
        (("n = " + str(n))[0:8] + "  divides evenly -> drain path never runs -> defect invisible")^0
    n + 1 => n

""^0
"every record still comes out, and the count is right"^0
0 => n
0 => lost
while n <= 12:
    make(n) => recs
    run(recs, BATCH, 0) => bad
    if not (len(bad[0]) == n):
        lost + 1 => lost
    n + 1 => n
("input lengths where a record went missing: " + str(lost))^0
"So no count, no length check and no 'did everything arrive' test can see it."^0

""^0
0 => checked
0 => passed

# The buggy drain must lose the stamp for some lengths.
checked + 1 => checked
if buggy_bad > 0:
    passed + 1 => passed

# And never for a length that divides evenly - the configuration a fixture
# reaches for.
checked + 1 => checked
0 => even_bad
0 => n
while n <= 12:
    rows[str(n)] => row
    if row[0] == 0:
        if row[1] > 0:
            even_bad + 1 => even_bad
    n + 1 => n
if even_bad == 0:
    passed + 1 => passed

# The fixed drain must be clean at every length.
checked + 1 => checked
if fixed_bad == 0:
    passed + 1 => passed

# The number of affected records must equal n mod batch at every length - the
# mechanism, computed on both sides.
checked + 1 => checked
if mismatches == 0:
    passed + 1 => passed

# No record may be lost, at any length, under either drain. The defect is
# invisible to every count.
checked + 1 => checked
if lost == 0:
    passed + 1 => passed

# And the two paths must both be exercised somewhere, or the case is about a
# path nothing reaches.
checked + 1 => checked
0 => both
0 => n
while n <= 12:
    rows[str(n)] => row
    if row[3] > 0:
        if row[4] > 0:
            both + 1 => both
    n + 1 => n
if both > 0:
    passed + 1 => passed

("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "The remainder left by a different door, and the remainder is zero in every fixture." => verdict
else:
    "FAILED - the drain did not behave as the checks describe." => verdict
verdict^0

""^0
"A buffered loop has two exits and only one of them is in the loop. The"^0
"second is written later, under time pressure, to fix a symptom - records"^0
"lost on shutdown - and it fixes exactly that symptom. Everything the main"^0
"path accumulates afterwards has to be remembered twice by whoever adds it,"^0
"and the reminder that it exists is `n mod batch`, which is zero on every"^0
"round number anybody chooses for a test."^0
```

## Python (deterministic transpilation)

```python
def stamped(rec, seq):
    return [rec[0], seq]

def run(records, batch, finalize_stamps):
    out = []
    buffer = []
    seq = 0
    via_main = 0
    via_tail = 0
    for r in records:
        buffer = buffer + [r]
        if len(buffer) == batch:
            for b in buffer:
                seq = seq + 1
                out = out + [stamped(b, seq)]
                via_main = via_main + 1
            buffer = []
    if len(buffer) > 0:
        for b in buffer:
            via_tail = via_tail + 1
            if finalize_stamps == 1:
                seq = seq + 1
                out = out + [stamped(b, seq)]
            else:
                out = out + [b]
        buffer = []
    return [out, via_main, via_tail]

def unstamped(out):
    n = 0
    for r in out:
        if r[1] == 0:
            n = n + 1
    return n

def make(n):
    out = []
    i = 0
    while i < n:
        out = out + [["r" + str(i + 1), 0]]
        i = i + 1
    return out

BATCH = 4
print("n    n mod b  via loop  via drain  unstamped (buggy drain)  unstamped (fixed)")
print("---  -------  --------  ---------  -----------------------  -----------------")
lengths = 0
buggy_bad = 0
fixed_bad = 0
rows = {}
n = 0
while n <= 12:
    recs = make(n)
    bad = run(recs, BATCH, 0)
    good = run(recs, BATCH, 1)
    u_bad = unstamped(bad[0])
    u_good = unstamped(good[0])
    lengths = lengths + 1
    if u_bad > 0:
        buggy_bad = buggy_bad + 1
    if u_good > 0:
        fixed_bad = fixed_bad + 1
    rows[str(n)] = [n % BATCH, u_bad, u_good, bad[1], bad[2]]
    print((str(n) + "     ")[0:5] + (str(n % BATCH) + "         ")[0:9] + (str(bad[1]) + "          ")[0:10] + (str(bad[2]) + "           ")[0:11] + (str(u_bad) + "                         ")[0:25] + str(u_good))
    n = n + 1
print("")
print("batch size: " + str(BATCH) + ", input lengths tried: " + str(lengths))
print("lengths where the drain path loses the stamp: " + str(buggy_bad))
print("lengths where the fixed drain loses it:        " + str(fixed_bad))
print("")
print("the unstamped count IS n mod batch")
mismatches = 0
n = 0
while n <= 12:
    row = rows[str(n)]
    if not row[1] == row[0]:
        mismatches = mismatches + 1
    n = n + 1
print("lengths where unstamped != n mod batch: " + str(mismatches))
print("")
print("which input lengths a fixture would use")
n = 0
while n <= 12:
    row = rows[str(n)]
    if row[0] == 0:
        print(("n = " + str(n))[0:8] + "  divides evenly -> drain path never runs -> defect invisible")
    n = n + 1
print("")
print("every record still comes out, and the count is right")
n = 0
lost = 0
while n <= 12:
    recs = make(n)
    bad = run(recs, BATCH, 0)
    if not len(bad[0]) == n:
        lost = lost + 1
    n = n + 1
print("input lengths where a record went missing: " + str(lost))
print("So no count, no length check and no 'did everything arrive' test can see it.")
print("")
checked = 0
passed = 0
checked = checked + 1
if buggy_bad > 0:
    passed = passed + 1
checked = checked + 1
even_bad = 0
n = 0
while n <= 12:
    row = rows[str(n)]
    if row[0] == 0:
        if row[1] > 0:
            even_bad = even_bad + 1
    n = n + 1
if even_bad == 0:
    passed = passed + 1
checked = checked + 1
if fixed_bad == 0:
    passed = passed + 1
checked = checked + 1
if mismatches == 0:
    passed = passed + 1
checked = checked + 1
if lost == 0:
    passed = passed + 1
checked = checked + 1
both = 0
n = 0
while n <= 12:
    row = rows[str(n)]
    if row[3] > 0:
        if row[4] > 0:
            both = both + 1
    n = n + 1
if both > 0:
    passed = passed + 1
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "The remainder left by a different door, and the remainder is zero in every fixture."
else:
    verdict = "FAILED - the drain did not behave as the checks describe."
print(verdict)
print("")
print("A buffered loop has two exits and only one of them is in the loop. The")
print("second is written later, under time pressure, to fix a symptom - records")
print("lost on shutdown - and it fixes exactly that symptom. Everything the main")
print("path accumulates afterwards has to be remembered twice by whoever adds it,")
print("and the reminder that it exists is `n mod batch`, which is zero on every")
print("round number anybody chooses for a test.")
```

## stdout (executed)

```text
n    n mod b  via loop  via drain  unstamped (buggy drain)  unstamped (fixed)
---  -------  --------  ---------  -----------------------  -----------------
0    0        0         0          0                        0
1    1        0         1          1                        0
2    2        0         2          2                        0
3    3        0         3          3                        0
4    0        4         0          0                        0
5    1        4         1          1                        0
6    2        4         2          2                        0
7    3        4         3          3                        0
8    0        8         0          0                        0
9    1        8         1          1                        0
10   2        8         2          2                        0
11   3        8         3          3                        0
12   0        12        0          0                        0

batch size: 4, input lengths tried: 13
lengths where the drain path loses the stamp: 9
lengths where the fixed drain loses it:        0

the unstamped count IS n mod batch
lengths where unstamped != n mod batch: 0

which input lengths a fixture would use
n = 0  divides evenly -> drain path never runs -> defect invisible
n = 4  divides evenly -> drain path never runs -> defect invisible
n = 8  divides evenly -> drain path never runs -> defect invisible
n = 12  divides evenly -> drain path never runs -> defect invisible

every record still comes out, and the count is right
input lengths where a record went missing: 0
So no count, no length check and no 'did everything arrive' test can see it.

checks passed: 6/6
The remainder left by a different door, and the remainder is zero in every fixture.

A buffered loop has two exits and only one of them is in the loop. The
second is written later, under time pressure, to fix a symptom - records
lost on shutdown - and it fixes exactly that symptom. Everything the main
path accumulates afterwards has to be remembered twice by whoever adds it,
and the reminder that it exists is `n mod batch`, which is zero on every
round number anybody chooses for a test.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
