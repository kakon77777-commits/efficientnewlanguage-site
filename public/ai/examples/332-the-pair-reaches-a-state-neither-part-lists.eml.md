<!-- canonical: efficientnewlanguage.org/ai/examples/332-the-pair-reaches-a-state-neither-part-lists | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 332 — The pair reaches a state neither part lists — 3 of 3, 3 of 3, and an illegal pair

`the_pair_reaches_a_state_neither_part_lists.eml` drives two state machines from one event stream, exhaustively over every sequence of length three, and collects the combined states that actually occur.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two state
# machines, each complete and each correct, driven by one event stream. The
# combined state they reach together is not on either component's list, because
# neither component has a list with two columns.
#
# The connection tracks idle / open / closing. The transaction tracks none /
# active / committed. Both are exhaustively enumerated, both reach every state
# they declare, and no transition in either is wrong. A reviewer of either file
# would find nothing.
#
# The rule that fails is about the PAIR: a transaction must not be active while
# the connection is not open. It is a true rule and an important one, and it
# cannot be written inside either component, because neither can see the other
# half of its own subject.
#
# The sweep is exhaustive over every event sequence of length three, and the
# reachable set is collected rather than predicted.

def conn_step(s, ev):
    if ev == "connect":
        if s == "idle":
            return "open"
        return s
    if ev == "close":
        if s == "open":
            return "closing"
        return s
    if ev == "done":
        if s == "closing":
            return "idle"
        return s
    return s

def txn_step(s, ev):
    if ev == "begin":
        if s == "none":
            return "active"
        return s
    if ev == "commit":
        if s == "active":
            return "committed"
        return s
    if ev == "reset":
        return "none"
    return s

def pair_is_legal(c, t):
    if t == "active":
        if c == "open":
            return 1
        return 0
    return 1

["connect", "begin", "close", "commit", "reset", "done"] => events
["idle", "open", "closing"] => conn_states
["none", "active", "committed"] => txn_states

[] => conn_seen
[] => txn_seen
[] => pairs_seen
[] => illegal_seen

for e1 in events:
    for e2 in events:
        for e3 in events:
            "idle" => c
            "none" => t
            for ev in [e1, e2, e3]:
                conn_step(c, ev) => c
                txn_step(t, ev) => t
                if c in conn_seen:
                    pass
                else:
                    conn_seen + [c] => conn_seen
                if t in txn_seen:
                    pass
                else:
                    txn_seen + [t] => txn_seen
                c + "/" + t => key
                if key in pairs_seen:
                    pass
                else:
                    pairs_seen + [key] => pairs_seen
                    if pair_is_legal(c, t) == 0:
                        illegal_seen + [key] => illegal_seen

"exhaustive sweep: every event sequence of length 3 over " + str(len(events)) + " events" ^0
"  sequences run: " + str(len(events) * len(events) * len(events)) ^0
"" ^0

"each component on its own" ^0
"  connection states reached  : " + str(len(conn_seen)) + " of " + str(len(conn_states)) + "  " + repr(conn_seen) ^0
"  transaction states reached : " + str(len(txn_seen)) + " of " + str(len(txn_states)) + "  " + repr(txn_seen) ^0
0 => undeclared
for s in conn_seen:
    if s in conn_states:
        pass
    else:
        undeclared + 1 => undeclared
for s in txn_seen:
    if s in txn_states:
        pass
    else:
        undeclared + 1 => undeclared
"  states either component reaches that it does not declare: " + str(undeclared) ^0
"" ^0

"the pair" ^0
"  combined states reached : " + str(len(pairs_seen)) + " of " + str(len(conn_states) * len(txn_states)) ^0
"  " + repr(pairs_seen) ^0
"" ^0
"  combined states that break the pair rule: " + str(len(illegal_seen)) ^0
"  " + repr(illegal_seen) ^0
"" ^0

# ---- a shortest witness for each illegal pair ----

"shortest event sequence reaching each illegal pair" ^0
for bad in illegal_seen:
    [] => found
    for e1 in events:
        for e2 in events:
            for e3 in events:
                if len(found) == 0:
                    "idle" => c
                    "none" => t
                    [] => used
                    for ev in [e1, e2, e3]:
                        if len(found) == 0:
                            conn_step(c, ev) => c
                            txn_step(t, ev) => t
                            used + [ev] => used
                            if c + "/" + t == bad:
                                used => found
    "  " + bad + " <- " + repr(found) ^0
"" ^0

"Neither component is wrong and neither list is incomplete. The rule that" ^0
"fails ranges over both columns, and there is no file in which both columns" ^0
"are in scope." ^0
```

## Python (deterministic transpilation)

```python
def conn_step(s, ev):
    if ev == "connect":
        if s == "idle":
            return "open"
        return s
    if ev == "close":
        if s == "open":
            return "closing"
        return s
    if ev == "done":
        if s == "closing":
            return "idle"
        return s
    return s

def txn_step(s, ev):
    if ev == "begin":
        if s == "none":
            return "active"
        return s
    if ev == "commit":
        if s == "active":
            return "committed"
        return s
    if ev == "reset":
        return "none"
    return s

def pair_is_legal(c, t):
    if t == "active":
        if c == "open":
            return 1
        return 0
    return 1

events = ["connect", "begin", "close", "commit", "reset", "done"]
conn_states = ["idle", "open", "closing"]
txn_states = ["none", "active", "committed"]
conn_seen = []
txn_seen = []
pairs_seen = []
illegal_seen = []
for e1 in events:
    for e2 in events:
        for e3 in events:
            c = "idle"
            t = "none"
            for ev in [e1, e2, e3]:
                c = conn_step(c, ev)
                t = txn_step(t, ev)
                if c in conn_seen:
                    pass
                else:
                    conn_seen = conn_seen + [c]
                if t in txn_seen:
                    pass
                else:
                    txn_seen = txn_seen + [t]
                key = c + "/" + t
                if key in pairs_seen:
                    pass
                else:
                    pairs_seen = pairs_seen + [key]
                    if pair_is_legal(c, t) == 0:
                        illegal_seen = illegal_seen + [key]
print("exhaustive sweep: every event sequence of length 3 over " + str(len(events)) + " events")
print("  sequences run: " + str(len(events) * len(events) * len(events)))
print("")
print("each component on its own")
print("  connection states reached  : " + str(len(conn_seen)) + " of " + str(len(conn_states)) + "  " + repr(conn_seen))
print("  transaction states reached : " + str(len(txn_seen)) + " of " + str(len(txn_states)) + "  " + repr(txn_seen))
undeclared = 0
for s in conn_seen:
    if s in conn_states:
        pass
    else:
        undeclared = undeclared + 1
for s in txn_seen:
    if s in txn_states:
        pass
    else:
        undeclared = undeclared + 1
print("  states either component reaches that it does not declare: " + str(undeclared))
print("")
print("the pair")
print("  combined states reached : " + str(len(pairs_seen)) + " of " + str(len(conn_states) * len(txn_states)))
print("  " + repr(pairs_seen))
print("")
print("  combined states that break the pair rule: " + str(len(illegal_seen)))
print("  " + repr(illegal_seen))
print("")
print("shortest event sequence reaching each illegal pair")
for bad in illegal_seen:
    found = []
    for e1 in events:
        for e2 in events:
            for e3 in events:
                if len(found) == 0:
                    c = "idle"
                    t = "none"
                    used = []
                    for ev in [e1, e2, e3]:
                        if len(found) == 0:
                            c = conn_step(c, ev)
                            t = txn_step(t, ev)
                            used = used + [ev]
                            if c + "/" + t == bad:
                                found = used
    print("  " + bad + " <- " + repr(found))
print("")
print("Neither component is wrong and neither list is incomplete. The rule that")
print("fails ranges over both columns, and there is no file in which both columns")
print("are in scope.")
```

## stdout (executed)

```text
exhaustive sweep: every event sequence of length 3 over 6 events
  sequences run: 216

each component on its own
  connection states reached  : 3 of 3  ['open', 'closing', 'idle']
  transaction states reached : 3 of 3  ['none', 'active', 'committed']
  states either component reaches that it does not declare: 0

the pair
  combined states reached : 8 of 9
  ['open/none', 'open/active', 'closing/none', 'closing/active', 'open/committed', 'idle/none', 'idle/active', 'idle/committed']

  combined states that break the pair rule: 2
  ['closing/active', 'idle/active']

shortest event sequence reaching each illegal pair
  closing/active <- ['connect', 'begin', 'close']
  idle/active <- ['begin']

Neither component is wrong and neither list is incomplete. The rule that
fails ranges over both columns, and there is no file in which both columns
are in scope.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
