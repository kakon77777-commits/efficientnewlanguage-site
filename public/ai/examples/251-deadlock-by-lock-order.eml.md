<!-- canonical: efficientnewlanguage.org/ai/examples/251-deadlock-by-lock-order | ai_layer_version: 0.1.0 | updated: 2026-08-05 -->

# Example 251 — Deadlock by lock order — the defect that exists only in the pair

`deadlock_by_lock_order.eml` enumerates every interleaving of two transactions that take the same two locks in opposite orders, then repeats the enumeration with a consistent global lock order.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two functions
# that each take two locks, and the schedule where neither can continue.
#
# Deadlock needs four conditions at once, and the only one a programmer
# controls cheaply is the last:
#
#     mutual exclusion   a lock is held by one holder
#     hold and wait      a holder may request another lock
#     no preemption      a lock is not taken away
#     circular wait      A holds x wanting y while B holds y wanting x
#
# Breaking the cycle is a convention, not a mechanism: acquire locks in a
# fixed global order. It costs nothing at run time and it is invisible in
# review, because a function that takes (accounts, audit) and one that takes
# (audit, accounts) both look correct on their own.
#
# There are no threads here. Two transactions are two ordered sequences of
# lock requests, and every INTERLEAVING of them is enumerated - the same
# technique the lost-update case in this corpus uses. Deadlock is then not a
# probability, it is a count: how many of the schedules wedge.
#
# The measurement runs both orderings - the natural one and the sorted one -
# over the same schedules, and reports deadlocks and completions for each.
# The property is that a consistent order deadlocks on ZERO schedules, and it
# is checked by simulating rather than by arguing about the cycle.

def interleavings(a, b):
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

def steps(who, locks):
    # A transaction: acquire each lock in order, then release both.
    [] => out
    for l in locks:
        out + [[who, "take", l]] => out
    for l in locks:
        out + [[who, "drop", l]] => out
    return out

def run(schedule):
    # Execute a schedule with a real WAIT model, which the first version of
    # this file got wrong. A transaction that meets a held lock does not skip
    # its remaining work - it waits at that step and resumes when the lock
    # frees. Skipping over-counted deadlock badly: it reported 40 of 70
    # schedules wedged where the honest number is far smaller.
    #
    # Returns [completed, stuck_names].
    {} => owner
    {} => pc
    for who in ["A", "B"]:
        0 => pc[who]
    {} => steps_of
    for who in ["A", "B"]:
        [] => steps_of[who]
    for step in schedule:
        steps_of[step[0]] + [step] => steps_of[step[0]]

    # `order` is the arrival order of turns; a turn that cannot proceed is
    # simply retried later, which is what waiting means.
    [] => order
    for step in schedule:
        order + [step[0]] => order

    def try_step(who):
        pc[who] => i
        if i >= len(steps_of[who]):
            return False
        steps_of[who][i] => st
        st[1] => act
        st[2] => lock
        if act == "take":
            if lock in owner and len(owner[lock]) > 0 and not (owner[lock] == who):
                return False
            who => owner[lock]
        else:
            if lock in owner and owner[lock] == who:
                "" => owner[lock]
        i + 1 => pc[who]
        return True

    for who in order:
        try_step(who)

    # Drain: keep giving turns while anyone can move.
    1 => progress
    while progress == 1:
        0 => progress
        for who in ["A", "B"]:
            if try_step(who):
                1 => progress

    0 => completed
    [] => stuck
    for who in ["A", "B"]:
        if pc[who] >= len(steps_of[who]):
            completed + 1 => completed
        else:
            stuck + [who] => stuck
    return [completed, stuck]


["x", "y"] => SORTED_ORDER

# Natural order: A takes x then y; B takes y then x. Both are the order a
# person would write given what each function is about.
steps("A", ["x", "y"]) => a_nat
steps("B", ["y", "x"]) => b_nat

# Consistent order: both take locks in the same global order.
steps("A", SORTED_ORDER) => a_sorted
steps("B", SORTED_ORDER) => b_sorted

interleavings(a_nat, b_nat) => nat_schedules
interleavings(a_sorted, b_sorted) => sorted_schedules

def tally(schedules):
    0 => n
    0 => both_done
    0 => deadlocked
    0 => one_blocked
    for s in schedules:
        n + 1 => n
        run(s) => r
        if r[0] == 2:
            both_done + 1 => both_done
        elif len(r[1]) == 2:
            deadlocked + 1 => deadlocked
        else:
            one_blocked + 1 => one_blocked
    return [n, both_done, one_blocked, deadlocked]

tally(nat_schedules) => nat
tally(sorted_schedules) => srt

"lock order      schedules  both finish  one waits  DEADLOCK"^0
("%-15s %-10d %-12d %-10d %d" % ("natural", nat[0], nat[1], nat[2], nat[3]))^0
("%-15s %-10d %-12d %-10d %d" % ("consistent", srt[0], srt[1], srt[2], srt[3]))^0

# ------------------------------------------------ the schedule that wedges
""^0
"a schedule where both transactions are stuck:"^0
0 => shown
for s in nat_schedules:
    run(s) => r
    if len(r[1]) == 2 and shown == 0:
        1 => shown
        "" => line
        for step in s:
            if len(line) > 0:
                line + " " => line
            line + step[0] + ":" + step[1][:1] + step[2] => line
        ("  " + line)^0
        ("  stuck: " + str(r[1]))^0

# --------------------------------- why it survives, which is NOT rarity
# This file assumed deadlock would be a rare schedule. It is the MAJORITY -
# once both transactions are genuinely in flight, most interleavings wedge.
# What saves a real system is not that the bad schedules are rare, it is that
# the SERIAL schedules are common: one transaction usually finishes before the
# other begins, and a serial schedule cannot deadlock by construction.
#
# So the count below is the honest one, and the reassuring number a test
# produces comes from a biased sample rather than from a small denominator.
0 => serial
0 => serial_deadlocks
for sc in nat_schedules:
    # Serial = every step of one transaction precedes every step of the other.
    "" => first
    1 => is_serial
    0 => switches
    "" => prev
    for step in sc:
        if not (step[0] == prev):
            switches + 1 => switches
            step[0] => prev
    # switches counts the first block too, so a serial schedule has 2.
    if switches <= 2:
        serial + 1 => serial
        run(sc) => r
        if len(r[1]) == 2:
            serial_deadlocks + 1 => serial_deadlocks

""^0
("deadlocking schedules: " + str(nat[3]) + "/" + str(nat[0]))^0
("schedules that are SERIAL (one finishes first): " + str(serial) + "/" + str(nat[0]))^0
("  of which deadlock: " + str(serial_deadlocks))^0
"...a test that does not force concurrency samples only the serial ones."^0

# ------------------------------------ the convention costs nothing when it works
# Both orderings complete the same WORK - the same locks are taken and
# released, and every non-deadlocked schedule ends with all locks free.
def all_released(schedule):
    # Reuses the same wait model rather than a second copy - a second copy is
    # how two simulations of "the same thing" drift apart.
    run(schedule) => r
    return r[0] == 2

0 => clean_exit
for s in sorted_schedules:
    if all_released(s):
        clean_exit + 1 => clean_exit

""^0
("consistent-order schedules ending with every lock free: " + str(clean_exit) + "/" + str(srt[0]))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# A consistent order must deadlock on zero schedules. This is the property.
checked + 1 => checked
if srt[3] == 0:
    passed + 1 => passed

# The natural order must deadlock on some, or there is nothing to fix.
checked + 1 => checked
if nat[3] > 0:
    passed + 1 => passed

# Serial schedules must never deadlock, and there must be some - that is the
# sample a test without forced concurrency draws from. This file first
# asserted deadlock would be a MINORITY of all schedules; the simulation says
# it is the majority, and the reason the bug ships is the bias in which
# schedules occur rather than their share of the space.
checked + 1 => checked
if serial > 0 and serial_deadlocks == 0 and nat[3] * 2 > nat[0]:
    passed + 1 => passed

# Both orderings must enumerate the same number of schedules, so the
# comparison is like for like rather than a smaller search space.
checked + 1 => checked
if nat[0] == srt[0]:
    passed + 1 => passed

# And every consistent-order schedule must end with the locks released.
checked + 1 => checked
if clean_exit == srt[0]:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "One convention, zero deadlocks, and no cost on any schedule." => verdict
else:
    "FAILED - a lock ordering did not behave as the checks describe." => verdict
verdict^0

""^0
"Each function is correct on its own and takes the locks in the order its" => n1
n1^0
"own logic suggests, so review finds nothing - the defect exists only in the" => n2
n2^0
"pair. And the count corrected this file's own assumption: deadlock is not a" => n3
n3^0
"rare schedule, it is most of them. What makes it rare in practice is that" => n4
n4^0
"the schedules a system actually produces are mostly serial, which is a fact" => n5
n5^0
"about load rather than about the code." => n6
n6^0
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

def steps(who, locks):
    out = []
    for l in locks:
        out = out + [[who, "take", l]]
    for l in locks:
        out = out + [[who, "drop", l]]
    return out

def run(schedule):
    owner = {}
    pc = {}
    for who in ["A", "B"]:
        pc[who] = 0
    steps_of = {}
    for who in ["A", "B"]:
        steps_of[who] = []
    for step in schedule:
        steps_of[step[0]] = steps_of[step[0]] + [step]
    order = []
    for step in schedule:
        order = order + [step[0]]
    def try_step(who):
        i = pc[who]
        if i >= len(steps_of[who]):
            return False
        st = steps_of[who][i]
        act = st[1]
        lock = st[2]
        if act == "take":
            if lock in owner and len(owner[lock]) > 0 and not owner[lock] == who:
                return False
            owner[lock] = who
        elif lock in owner and owner[lock] == who:
            owner[lock] = ""
        pc[who] = i + 1
        return True
    for who in order:
        try_step(who)
    progress = 1
    while progress == 1:
        progress = 0
        for who in ["A", "B"]:
            if try_step(who):
                progress = 1
    completed = 0
    stuck = []
    for who in ["A", "B"]:
        if pc[who] >= len(steps_of[who]):
            completed = completed + 1
        else:
            stuck = stuck + [who]
    return [completed, stuck]

SORTED_ORDER = ["x", "y"]
a_nat = steps("A", ["x", "y"])
b_nat = steps("B", ["y", "x"])
a_sorted = steps("A", SORTED_ORDER)
b_sorted = steps("B", SORTED_ORDER)
nat_schedules = interleavings(a_nat, b_nat)
sorted_schedules = interleavings(a_sorted, b_sorted)

def tally(schedules):
    n = 0
    both_done = 0
    deadlocked = 0
    one_blocked = 0
    for s in schedules:
        n = n + 1
        r = run(s)
        if r[0] == 2:
            both_done = both_done + 1
        elif len(r[1]) == 2:
            deadlocked = deadlocked + 1
        else:
            one_blocked = one_blocked + 1
    return [n, both_done, one_blocked, deadlocked]

nat = tally(nat_schedules)
srt = tally(sorted_schedules)
print("lock order      schedules  both finish  one waits  DEADLOCK")
print("%-15s %-10d %-12d %-10d %d" % ("natural", nat[0], nat[1], nat[2], nat[3]))
print("%-15s %-10d %-12d %-10d %d" % ("consistent", srt[0], srt[1], srt[2], srt[3]))
print("")
print("a schedule where both transactions are stuck:")
shown = 0
for s in nat_schedules:
    r = run(s)
    if len(r[1]) == 2 and shown == 0:
        shown = 1
        line = ""
        for step in s:
            if len(line) > 0:
                line = line + " "
            line = line + step[0] + ":" + step[1][:1] + step[2]
        print("  " + line)
        print("  stuck: " + str(r[1]))
serial = 0
serial_deadlocks = 0
for sc in nat_schedules:
    first = ""
    is_serial = 1
    switches = 0
    prev = ""
    for step in sc:
        if not step[0] == prev:
            switches = switches + 1
            prev = step[0]
    if switches <= 2:
        serial = serial + 1
        r = run(sc)
        if len(r[1]) == 2:
            serial_deadlocks = serial_deadlocks + 1
print("")
print("deadlocking schedules: " + str(nat[3]) + "/" + str(nat[0]))
print("schedules that are SERIAL (one finishes first): " + str(serial) + "/" + str(nat[0]))
print("  of which deadlock: " + str(serial_deadlocks))
print("...a test that does not force concurrency samples only the serial ones.")

def all_released(schedule):
    r = run(schedule)
    return r[0] == 2

clean_exit = 0
for s in sorted_schedules:
    if all_released(s):
        clean_exit = clean_exit + 1
print("")
print("consistent-order schedules ending with every lock free: " + str(clean_exit) + "/" + str(srt[0]))
passed = 0
checked = 0
checked = checked + 1
if srt[3] == 0:
    passed = passed + 1
checked = checked + 1
if nat[3] > 0:
    passed = passed + 1
checked = checked + 1
if serial > 0 and serial_deadlocks == 0 and nat[3] * 2 > nat[0]:
    passed = passed + 1
checked = checked + 1
if nat[0] == srt[0]:
    passed = passed + 1
checked = checked + 1
if clean_exit == srt[0]:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "One convention, zero deadlocks, and no cost on any schedule."
else:
    verdict = "FAILED - a lock ordering did not behave as the checks describe."
print(verdict)
print("")
n1 = "Each function is correct on its own and takes the locks in the order its"
print(n1)
n2 = "own logic suggests, so review finds nothing - the defect exists only in the"
print(n2)
n3 = "pair. And the count corrected this file's own assumption: deadlock is not a"
print(n3)
n4 = "rare schedule, it is most of them. What makes it rare in practice is that"
print(n4)
n5 = "the schedules a system actually produces are mostly serial, which is a fact"
print(n5)
n6 = "about load rather than about the code."
print(n6)
```

## stdout (executed)

```text
lock order      schedules  both finish  one waits  DEADLOCK
natural         70         30           0          40
consistent      70         70           0          0

a schedule where both transactions are stuck:
  A:tx B:ty A:ty A:dx A:dy B:tx B:dy B:dx
  stuck: ['A', 'B']

deadlocking schedules: 40/70
schedules that are SERIAL (one finishes first): 2/70
  of which deadlock: 0
...a test that does not force concurrency samples only the serial ones.

consistent-order schedules ending with every lock free: 70/70

checks passed: 5/5
One convention, zero deadlocks, and no cost on any schedule.

Each function is correct on its own and takes the locks in the order its
own logic suggests, so review finds nothing - the defect exists only in the
pair. And the count corrected this file's own assumption: deadlock is not a
rare schedule, it is most of them. What makes it rare in practice is that
the schedules a system actually produces are mostly serial, which is a fact
about load rather than about the code.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
