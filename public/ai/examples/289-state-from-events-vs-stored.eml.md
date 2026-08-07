<!-- canonical: efficientnewlanguage.org/ai/examples/289-state-from-events-vs-stored | ai_layer_version: 0.1.0 | updated: 2026-08-07 -->

# Example 289 — State from events vs stored — replay is correct only for some orders

`state_from_events_vs_stored.eml` applies every ordering of one event set and counts distinct final states, then does the same for a stored status column written by whichever handler finished last.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two systems that
# agree on every event and disagree about what happened.
#
# There are two ways to know an order's state. Fold the events, or keep a
# status column that each handler writes. They are supposed to be the same
# answer computed twice, and they are not the same answer at all:
#
#     the fold depends on the ORDER events are applied in
#     the column depends on the ORDER handlers ran in
#
# Those are different orders. Events are ordered by whatever the log says;
# handlers are ordered by whatever the scheduler did. When they agree the two
# models agree, which is most of the time, which is why the difference is
# discovered during an incident rather than in a test.
#
# The deeper property is that a fold is only order-independent when the
# operations COMMUTE, and most state transitions do not. `pay` then `refund` is
# not `refund` then `pay`. So "replay the events to rebuild state" is a correct
# procedure only for the orders the log actually preserves - and a log that
# preserves order per-entity but not globally preserves exactly the orders the
# fold needs, which is a property of the log, not of the fold.
#
# The measurement applies every ORDERING of a fixed event set and counts how
# many distinct final states result, then reports which pairs commute. A
# commuting set would give one state for every ordering.

def apply_event(state, e):
    # state is [paid, shipped, refunded] as 0/1 flags plus a rejection count.
    state[0] => paid
    state[1] => shipped
    state[2] => refunded
    state[3] => rejected
    if e == "pay":
        if paid == 1 or refunded == 1:
            rejected + 1 => rejected
        else:
            1 => paid
    elif e == "ship":
        if paid == 0 or shipped == 1:
            rejected + 1 => rejected
        else:
            1 => shipped
    else:
        if paid == 0 or refunded == 1:
            rejected + 1 => rejected
        else:
            1 => refunded
            0 => paid
    return [paid, shipped, refunded, rejected]

def fold(events):
    [0, 0, 0, 0] => s
    for e in events:
        apply_event(s, e) => s
    return s

def render(s):
    "" => out
    for nm in ["paid", "shipped", "refunded"]:
        0 => v
        if nm == "paid":
            s[0] => v
        elif nm == "shipped":
            s[1] => v
        else:
            s[2] => v
        if v == 1:
            if len(out) > 0:
                out + "+" => out
            out + nm => out
    if len(out) == 0:
        "new" => out
    return out + " (rejected " + str(s[3]) + ")"

def perms3(items):
    [] => out
    for a in [0:2]:
        for b in [0:2]:
            for c in [0:2]:
                if not (a == b) and not (b == c) and not (a == c):
                    out + [[items[a], items[b], items[c]]] => out
    return out


["pay", "ship", "refund"] => events
perms3(events) => orderings

"ordering               final state"^0
{} => seen
for o in orderings:
    fold(o) => s
    render(s) => r
    1 => seen[r]
    ("%-22s %s" % (o[0] + "," + o[1] + "," + o[2], r))^0

""^0
("orderings of the same three events: " + str(len(orderings)))^0
("distinct final states: " + str(len(seen)))^0
"...a fold is a function of the order, and there are six of those."^0

# ------------------------------------------- which pairs commute
""^0
"pairs of events, applied both ways from a paid order:"^0
0 => commuting
0 => pairs
for i in [0:len(events) - 1]:
    for j in [i + 1:len(events) - 1]:
        pairs + 1 => pairs
        events[i] => a
        events[j] => b
        fold(["pay", a, b]) => ab
        fold(["pay", b, a]) => ba
        "differ" => verdict_pair
        if render(ab) == render(ba):
            commuting + 1 => commuting
            "commute" => verdict_pair
        ("  %-6s then %-6s vs the reverse: %s" % (a, b, verdict_pair))^0
("commuting pairs: " + str(commuting) + "/" + str(pairs))^0

# ------------------------- the stored column, written by whichever ran last
""^0
"a status column, where the handler that finished LAST wins:"^0
def last_writer(order):
    "new" => status
    for e in order:
        if e == "pay":
            "paid" => status
        elif e == "ship":
            "shipped" => status
        else:
            "refunded" => status
    return status
{} => col_seen
for o in orderings:
    1 => col_seen[last_writer(o)]
("  distinct column values across the same six orderings: " + str(len(col_seen)))^0
0 => agree
for o in orderings:
    fold(o) => s
    last_writer(o) => col
    if s[2] == 1 and col == "refunded":
        agree + 1 => agree
    elif s[1] == 1 and s[2] == 0 and col == "shipped":
        agree + 1 => agree
    elif s[0] == 1 and s[1] == 0 and s[2] == 0 and col == "paid":
        agree + 1 => agree
("  orderings where the column matches the fold: " + str(agree) + "/" + str(len(orderings)))^0

# ------------------------------- the one ordering everybody tests
""^0
fold(["pay", "ship", "refund"]) => happy
("the order events are supposed to arrive in: pay,ship,refund -> " + render(happy))^0
("  the column would say: " + last_writer(["pay", "ship", "refund"]))^0
"...both models agree here, and this is the fixture."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# More than one distinct final state must appear across the orderings, or
# the events commute and replay is safe.
checked + 1 => checked
if len(seen) > 1:
    passed + 1 => passed

# At least one pair must fail to commute - that is why order matters at all.
checked + 1 => checked
if commuting < pairs:
    passed + 1 => passed

# The stored column must lose information the fold keeps: fewer distinct
# values than distinct states.
checked + 1 => checked
if len(col_seen) < len(seen):
    passed + 1 => passed

# The two models must agree on the canonical ordering. If they disagreed
# there, the defect would be found immediately.
checked + 1 => checked
if happy[2] == 1 and last_writer(["pay", "ship", "refund"]) == "refunded":
    passed + 1 => passed

# And they must disagree somewhere, or there would be nothing to choose
# between the two models.
checked + 1 => checked
if agree < len(orderings):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Replay is correct only for the orders the log happens to preserve." => verdict
else:
    "FAILED - a state model did not behave as the checks describe." => verdict
verdict^0

""^0
"Rebuilding state from events is described as deriving the truth rather" => n1
n1^0
"than storing it, and that is true only if the fold does not depend on the" => n2
n2^0
"order - which is to say, only if the operations commute. Most do not, so" => n3
n3^0
"the derivation carries a hidden precondition about the log, and the log is" => n4
n4^0
"a different system with its own ordering guarantees." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def apply_event(state, e):
    paid = state[0]
    shipped = state[1]
    refunded = state[2]
    rejected = state[3]
    if e == "pay":
        if paid == 1 or refunded == 1:
            rejected = rejected + 1
        else:
            paid = 1
    elif e == "ship":
        if paid == 0 or shipped == 1:
            rejected = rejected + 1
        else:
            shipped = 1
    elif paid == 0 or refunded == 1:
        rejected = rejected + 1
    else:
        refunded = 1
        paid = 0
    return [paid, shipped, refunded, rejected]

def fold(events):
    s = [0, 0, 0, 0]
    for e in events:
        s = apply_event(s, e)
    return s

def render(s):
    out = ""
    for nm in ["paid", "shipped", "refunded"]:
        v = 0
        if nm == "paid":
            v = s[0]
        elif nm == "shipped":
            v = s[1]
        else:
            v = s[2]
        if v == 1:
            if len(out) > 0:
                out = out + "+"
            out = out + nm
    if len(out) == 0:
        out = "new"
    return out + " (rejected " + str(s[3]) + ")"

def perms3(items):
    out = []
    for a in range(0, 3):
        for b in range(0, 3):
            for c in range(0, 3):
                if not a == b and not b == c and not a == c:
                    out = out + [[items[a], items[b], items[c]]]
    return out

events = ["pay", "ship", "refund"]
orderings = perms3(events)
print("ordering               final state")
seen = {}
for o in orderings:
    s = fold(o)
    r = render(s)
    seen[r] = 1
    print("%-22s %s" % (o[0] + "," + o[1] + "," + o[2], r))
print("")
print("orderings of the same three events: " + str(len(orderings)))
print("distinct final states: " + str(len(seen)))
print("...a fold is a function of the order, and there are six of those.")
print("")
print("pairs of events, applied both ways from a paid order:")
commuting = 0
pairs = 0
for i in range(0, len(events)):
    for j in range(i + 1, len(events)):
        pairs = pairs + 1
        a = events[i]
        b = events[j]
        ab = fold(["pay", a, b])
        ba = fold(["pay", b, a])
        verdict_pair = "differ"
        if render(ab) == render(ba):
            commuting = commuting + 1
            verdict_pair = "commute"
        print("  %-6s then %-6s vs the reverse: %s" % (a, b, verdict_pair))
print("commuting pairs: " + str(commuting) + "/" + str(pairs))
print("")
print("a status column, where the handler that finished LAST wins:")

def last_writer(order):
    status = "new"
    for e in order:
        if e == "pay":
            status = "paid"
        elif e == "ship":
            status = "shipped"
        else:
            status = "refunded"
    return status

col_seen = {}
for o in orderings:
    col_seen[last_writer(o)] = 1
print("  distinct column values across the same six orderings: " + str(len(col_seen)))
agree = 0
for o in orderings:
    s = fold(o)
    col = last_writer(o)
    if s[2] == 1 and col == "refunded":
        agree = agree + 1
    elif s[1] == 1 and s[2] == 0 and col == "shipped":
        agree = agree + 1
    elif s[0] == 1 and s[1] == 0 and s[2] == 0 and col == "paid":
        agree = agree + 1
print("  orderings where the column matches the fold: " + str(agree) + "/" + str(len(orderings)))
print("")
happy = fold(["pay", "ship", "refund"])
print("the order events are supposed to arrive in: pay,ship,refund -> " + render(happy))
print("  the column would say: " + last_writer(["pay", "ship", "refund"]))
print("...both models agree here, and this is the fixture.")
passed = 0
checked = 0
checked = checked + 1
if len(seen) > 1:
    passed = passed + 1
checked = checked + 1
if commuting < pairs:
    passed = passed + 1
checked = checked + 1
if len(col_seen) < len(seen):
    passed = passed + 1
checked = checked + 1
if happy[2] == 1 and last_writer(["pay", "ship", "refund"]) == "refunded":
    passed = passed + 1
checked = checked + 1
if agree < len(orderings):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Replay is correct only for the orders the log happens to preserve."
else:
    verdict = "FAILED - a state model did not behave as the checks describe."
print(verdict)
print("")
n1 = "Rebuilding state from events is described as deriving the truth rather"
print(n1)
n2 = "than storing it, and that is true only if the fold does not depend on the"
print(n2)
n3 = "order - which is to say, only if the operations commute. Most do not, so"
print(n3)
n4 = "the derivation carries a hidden precondition about the log, and the log is"
print(n4)
n5 = "a different system with its own ordering guarantees."
print(n5)
```

## stdout (executed)

```text
ordering               final state
pay,ship,refund        shipped+refunded (rejected 0)
pay,refund,ship        refunded (rejected 1)
ship,pay,refund        refunded (rejected 1)
ship,refund,pay        paid (rejected 2)
refund,pay,ship        paid+shipped (rejected 1)
refund,ship,pay        paid (rejected 2)

orderings of the same three events: 6
distinct final states: 4
...a fold is a function of the order, and there are six of those.

pairs of events, applied both ways from a paid order:
  pay    then ship   vs the reverse: commute
  pay    then refund vs the reverse: commute
  ship   then refund vs the reverse: differ
commuting pairs: 2/3

a status column, where the handler that finished LAST wins:
  distinct column values across the same six orderings: 3
  orderings where the column matches the fold: 5/6

the order events are supposed to arrive in: pay,ship,refund -> shipped+refunded (rejected 0)
  the column would say: refunded
...both models agree here, and this is the fixture.

checks passed: 5/5
Replay is correct only for the orders the log happens to preserve.

Rebuilding state from events is described as deriving the truth rather
than storing it, and that is true only if the fold does not depend on the
order - which is to say, only if the operations commute. Most do not, so
the derivation carries a hidden precondition about the log, and the log is
a different system with its own ordering guarantees.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
