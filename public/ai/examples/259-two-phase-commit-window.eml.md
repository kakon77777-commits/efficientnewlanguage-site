<!-- canonical: efficientnewlanguage.org/ai/examples/259-two-phase-commit-window | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 259 — Two-Phase Commit — the in-doubt window

`two_phase_commit_window.eml` runs 2PC through a coordinator crash at every point in the protocol, under three participant strategies for what to do while in doubt: wait, presume-abort, presume-commit.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The state a
# participant is in when nobody can tell it what to do.
#
# Two-phase commit has a window that is not a bug and cannot be removed. A
# participant that has voted YES has promised it can commit, so it may not
# abort unilaterally - and if the coordinator dies before sending the
# decision, the participant is IN DOUBT. It holds its locks and waits.
#
#     PREPARED and no decision  ->  blocked, indefinitely
#
# The interesting part is what each recovery strategy does with that window,
# because all three are implementable and only one preserves the guarantee:
#
#     presume-abort     a participant with no decision aborts
#     presume-commit    a participant with no decision commits
#     wait              a participant with no decision does nothing
#
# The first two are attempts to remove the blocking, and both break atomicity
# on some crash point: some participants decide one way and some the other,
# which is precisely the thing 2PC exists to prevent.
#
# The measurement is over every point at which the coordinator can crash,
# crossed with every strategy. The property is ATOMICITY - all participants
# reach the same outcome - checked by counting, and reported alongside how
# many participants are left blocked, so the trade is visible rather than
# asserted.

# Participants vote in order. The coordinator writes its decision, then
# notifies each participant in turn; a crash at step k means participants
# after k never heard.
3 => N

def run(votes, crash_at, strategy):
    # crash_at: -1 = no crash; 0 = before the decision is durable;
    # k in 1..N = after notifying k participants.
    # Returns [outcomes, blocked] where outcomes is a list per participant.
    "commit" => decision
    for v in votes:
        if not v:
            "abort" => decision

    # A crash before the decision is durable means there IS no decision.
    "" => durable
    if not (crash_at == 0):
        decision => durable

    [] => outcomes
    0 => blocked
    for i in [0:N - 1]:
        "" => told
        if crash_at < 0:
            durable => told
        elif i < crash_at:
            durable => told

        if len(told) > 0:
            outcomes + [told] => outcomes
        else:
            # In doubt. What happens now is the strategy.
            if not votes[i]:
                # A participant that voted NO may always abort - it never
                # promised anything.
                outcomes + ["abort"] => outcomes
            elif strategy == "presume-abort":
                outcomes + ["abort"] => outcomes
            elif strategy == "presume-commit":
                outcomes + ["commit"] => outcomes
            else:
                outcomes + ["blocked"] => outcomes
                blocked + 1 => blocked
    return [outcomes, blocked]

def atomic(outcomes):
    # Every participant that reached a decision reached the SAME one.
    "" => seen
    for o in outcomes:
        if not (o == "blocked"):
            if len(seen) == 0:
                o => seen
            elif not (seen == o):
                return False
    return True

def render(outcomes):
    "" => s
    for o in outcomes:
        if len(s) > 0:
            s + "," => s
        s + o[:1] => s
    return s


[[True, True, True], [True, True, False], [False, True, True]] => vote_sets
["presume-abort", "presume-commit", "wait"] => strategies

"votes      crash  presume-abort  presume-commit  wait"^0
0 => cells
{} => atomic_ok
{} => blocked_total
for st in strategies:
    0 => atomic_ok[st]
    0 => blocked_total[st]

for votes in vote_sets:
    for crash_at in [0 - 1:N]:
        cells + 1 => cells
        [] => cols
        for st in strategies:
            run(votes, crash_at, st) => r
            if atomic(r[0]):
                atomic_ok[st] + 1 => atomic_ok[st]
            blocked_total[st] + r[1] => blocked_total[st]
            cols + [render(r[0])] => cols
        "" => vs
        for v in votes:
            if v:
                vs + "Y" => vs
            else:
                vs + "N" => vs
        ("%-10s %-6d %-14s %-15s %s" % (vs, crash_at, cols[0], cols[1], cols[2]))^0

""^0
("(votes, crash point) cells: " + str(cells))^0
"strategy         atomic  participants left blocked"^0
for st in strategies:
    ("%-16s %-7s %d" % (st, str(atomic_ok[st]) + "/" + str(cells), blocked_total[st]))^0

# ------------------------------------------------- where each one breaks
""^0
"the crash point that splits the participants:"^0
for st in ["presume-abort", "presume-commit"]:
    for votes in vote_sets:
        for crash_at in [0 - 1:N]:
            run(votes, crash_at, st) => r
            if not atomic(r[0]):
                "" => vs
                for v in votes:
                    if v:
                        vs + "Y" => vs
                    else:
                        vs + "N" => vs
                ("  " + st + ": votes " + vs + ", crash after " + str(crash_at) + " -> " + render(r[0]))^0

# ------------------------------------------- the guarantee that survives
# Waiting never produces a split. That is the whole of what 2PC promises, and
# the price is written in the blocked column above rather than hidden.
""^0
0 => wait_splits
for votes in vote_sets:
    for crash_at in [0 - 1:N]:
        run(votes, crash_at, "wait") => r
        if not atomic(r[0]):
            wait_splits + 1 => wait_splits
("wait strategy, split outcomes: " + str(wait_splits))^0
("wait strategy, blocked participant-cells: " + str(blocked_total["wait"]))^0
"...blocking is the cost of atomicity, not a defect in the implementation."^0

# ----------------------------------- with no crash, all three agree
0 => nocrash_same
0 => nocrash_n
for votes in vote_sets:
    nocrash_n + 1 => nocrash_n
    run(votes, 0 - 1, "presume-abort") => a
    run(votes, 0 - 1, "presume-commit") => b
    run(votes, 0 - 1, "wait") => c
    if render(a[0]) == render(b[0]) and render(b[0]) == render(c[0]):
        nocrash_same + 1 => nocrash_same

""^0
("with no crash, strategies agreeing: " + str(nocrash_same) + "/" + str(nocrash_n))^0
"...which is the entire happy path, and the only path most tests exercise."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Waiting must be atomic on every cell. This is the property.
checked + 1 => checked
if atomic_ok["wait"] == cells:
    passed + 1 => passed

# Both presumption strategies must break atomicity somewhere, or they would
# be free improvements.
checked + 1 => checked
if atomic_ok["presume-abort"] < cells and atomic_ok["presume-commit"] < cells:
    passed + 1 => passed

# Waiting must actually block - a strategy that never blocks and never splits
# would mean the window does not exist.
checked + 1 => checked
if blocked_total["wait"] > 0:
    passed + 1 => passed

# The presumption strategies must NOT block. That is what they bought.
checked + 1 => checked
if blocked_total["presume-abort"] == 0 and blocked_total["presume-commit"] == 0:
    passed + 1 => passed

# And with no crash all three must agree, which is why the difference is
# invisible until something fails.
checked + 1 => checked
if nocrash_same == nocrash_n:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Blocking is what atomicity costs. Both ways of not blocking split the outcome." => verdict
else:
    "FAILED - a strategy did not behave as the checks describe." => verdict
verdict^0

""^0
"The in-doubt window is not an implementation gap that a better protocol" => n1
n1^0
"closes - it is what a participant knows, which is nothing. Presuming an" => n2
n2^0
"answer converts an availability problem into a correctness one, and the" => n3
n3^0
"conversion is invisible on every run where nothing crashed." => n4
n4^0
```

## Python (deterministic transpilation)

```python
N = 3

def run(votes, crash_at, strategy):
    decision = "commit"
    for v in votes:
        if not v:
            decision = "abort"
    durable = ""
    if not crash_at == 0:
        durable = decision
    outcomes = []
    blocked = 0
    for i in range(0, N):
        told = ""
        if crash_at < 0:
            told = durable
        elif i < crash_at:
            told = durable
        if len(told) > 0:
            outcomes = outcomes + [told]
        elif not votes[i]:
            outcomes = outcomes + ["abort"]
        elif strategy == "presume-abort":
            outcomes = outcomes + ["abort"]
        elif strategy == "presume-commit":
            outcomes = outcomes + ["commit"]
        else:
            outcomes = outcomes + ["blocked"]
            blocked = blocked + 1
    return [outcomes, blocked]

def atomic(outcomes):
    seen = ""
    for o in outcomes:
        if not o == "blocked":
            if len(seen) == 0:
                seen = o
            elif not seen == o:
                return False
    return True

def render(outcomes):
    s = ""
    for o in outcomes:
        if len(s) > 0:
            s = s + ","
        s = s + o[:1]
    return s

vote_sets = [[True, True, True], [True, True, False], [False, True, True]]
strategies = ["presume-abort", "presume-commit", "wait"]
print("votes      crash  presume-abort  presume-commit  wait")
cells = 0
atomic_ok = {}
blocked_total = {}
for st in strategies:
    atomic_ok[st] = 0
    blocked_total[st] = 0
for votes in vote_sets:
    for crash_at in range(0 - 1, N+1):
        cells = cells + 1
        cols = []
        for st in strategies:
            r = run(votes, crash_at, st)
            if atomic(r[0]):
                atomic_ok[st] = atomic_ok[st] + 1
            blocked_total[st] = blocked_total[st] + r[1]
            cols = cols + [render(r[0])]
        vs = ""
        for v in votes:
            if v:
                vs = vs + "Y"
            else:
                vs = vs + "N"
        print("%-10s %-6d %-14s %-15s %s" % (vs, crash_at, cols[0], cols[1], cols[2]))
print("")
print("(votes, crash point) cells: " + str(cells))
print("strategy         atomic  participants left blocked")
for st in strategies:
    print("%-16s %-7s %d" % (st, str(atomic_ok[st]) + "/" + str(cells), blocked_total[st]))
print("")
print("the crash point that splits the participants:")
for st in ["presume-abort", "presume-commit"]:
    for votes in vote_sets:
        for crash_at in range(0 - 1, N+1):
            r = run(votes, crash_at, st)
            if not atomic(r[0]):
                vs = ""
                for v in votes:
                    if v:
                        vs = vs + "Y"
                    else:
                        vs = vs + "N"
                print("  " + st + ": votes " + vs + ", crash after " + str(crash_at) + " -> " + render(r[0]))
print("")
wait_splits = 0
for votes in vote_sets:
    for crash_at in range(0 - 1, N+1):
        r = run(votes, crash_at, "wait")
        if not atomic(r[0]):
            wait_splits = wait_splits + 1
print("wait strategy, split outcomes: " + str(wait_splits))
print("wait strategy, blocked participant-cells: " + str(blocked_total["wait"]))
print("...blocking is the cost of atomicity, not a defect in the implementation.")
nocrash_same = 0
nocrash_n = 0
for votes in vote_sets:
    nocrash_n = nocrash_n + 1
    a = run(votes, 0 - 1, "presume-abort")
    b = run(votes, 0 - 1, "presume-commit")
    c = run(votes, 0 - 1, "wait")
    if render(a[0]) == render(b[0]) and render(b[0]) == render(c[0]):
        nocrash_same = nocrash_same + 1
print("")
print("with no crash, strategies agreeing: " + str(nocrash_same) + "/" + str(nocrash_n))
print("...which is the entire happy path, and the only path most tests exercise.")
passed = 0
checked = 0
checked = checked + 1
if atomic_ok["wait"] == cells:
    passed = passed + 1
checked = checked + 1
if atomic_ok["presume-abort"] < cells and atomic_ok["presume-commit"] < cells:
    passed = passed + 1
checked = checked + 1
if blocked_total["wait"] > 0:
    passed = passed + 1
checked = checked + 1
if blocked_total["presume-abort"] == 0 and blocked_total["presume-commit"] == 0:
    passed = passed + 1
checked = checked + 1
if nocrash_same == nocrash_n:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Blocking is what atomicity costs. Both ways of not blocking split the outcome."
else:
    verdict = "FAILED - a strategy did not behave as the checks describe."
print(verdict)
print("")
n1 = "The in-doubt window is not an implementation gap that a better protocol"
print(n1)
n2 = "closes - it is what a participant knows, which is nothing. Presuming an"
print(n2)
n3 = "answer converts an availability problem into a correctness one, and the"
print(n3)
n4 = "conversion is invisible on every run where nothing crashed."
print(n4)
```

## stdout (executed)

```text
votes      crash  presume-abort  presume-commit  wait
YYY        -1     c,c,c          c,c,c           c,c,c
YYY        0      a,a,a          c,c,c           b,b,b
YYY        1      c,a,a          c,c,c           c,b,b
YYY        2      c,c,a          c,c,c           c,c,b
YYY        3      c,c,c          c,c,c           c,c,c
YYN        -1     a,a,a          a,a,a           a,a,a
YYN        0      a,a,a          c,c,a           b,b,a
YYN        1      a,a,a          a,c,a           a,b,a
YYN        2      a,a,a          a,a,a           a,a,a
YYN        3      a,a,a          a,a,a           a,a,a
NYY        -1     a,a,a          a,a,a           a,a,a
NYY        0      a,a,a          a,c,c           a,b,b
NYY        1      a,a,a          a,c,c           a,b,b
NYY        2      a,a,a          a,a,c           a,a,b
NYY        3      a,a,a          a,a,a           a,a,a

(votes, crash point) cells: 15
strategy         atomic  participants left blocked
presume-abort    13/15   0
presume-commit   10/15   0
wait             15/15   14

the crash point that splits the participants:
  presume-abort: votes YYY, crash after 1 -> c,a,a
  presume-abort: votes YYY, crash after 2 -> c,c,a
  presume-commit: votes YYN, crash after 0 -> c,c,a
  presume-commit: votes YYN, crash after 1 -> a,c,a
  presume-commit: votes NYY, crash after 0 -> a,c,c
  presume-commit: votes NYY, crash after 1 -> a,c,c
  presume-commit: votes NYY, crash after 2 -> a,a,c

wait strategy, split outcomes: 0
wait strategy, blocked participant-cells: 14
...blocking is the cost of atomicity, not a defect in the implementation.

with no crash, strategies agreeing: 3/3
...which is the entire happy path, and the only path most tests exercise.

checks passed: 5/5
Blocking is what atomicity costs. Both ways of not blocking split the outcome.

The in-doubt window is not an implementation gap that a better protocol
closes - it is what a participant knows, which is nothing. Presuming an
answer converts an availability problem into a correctness one, and the
conversion is invisible on every run where nothing crashed.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
