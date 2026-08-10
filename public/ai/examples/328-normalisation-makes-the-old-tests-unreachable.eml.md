<!-- canonical: efficientnewlanguage.org/ai/examples/328-normalisation-makes-the-old-tests-unreachable | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 328 — Normalisation makes the old tests unreachable — 8 cases, 3 doing work, coverage down

`normalisation_makes_the_old_tests_unreachable.eml` puts a normaliser in front of a router and measures what happened to the existing test suite.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A normaliser is
# added at the front of a pipeline. Every existing test still passes, and most
# of them have stopped testing anything.
#
# The tests were written against raw input, when raw input was what arrived.
# Normalisation now runs first, so the values that reach the code under test
# are canonical - and several test cases that were distinct as raw inputs are
# the same input once normalised. They still pass. They pass together, on the
# same value, having become copies of each other without anyone editing them.
#
# Worse than redundant: some of them exercise a branch that can no longer be
# reached at all in the composed system. That branch's test is green and its
# code is unreachable, which are the two facts that between them guarantee
# nobody will look at it.
#
# The measurement counts distinct raw inputs, distinct normalised inputs, and
# which downstream branches are reachable before and after the normaliser.

def normalise(tag):
    if tag == "OPEN":
        return "open"
    if tag == "Open":
        return "open"
    if tag == " open":
        return "open"
    if tag == "CLOSED":
        return "closed"
    if tag == "Closed":
        return "closed"
    return tag

def route(tag, hits):
    if tag == "open":
        hits[0] + 1 => hits[0]
        return "queue"
    if tag == "closed":
        hits[1] + 1 => hits[1]
        return "archive"
    if tag == "OPEN":
        hits[2] + 1 => hits[2]
        return "queue-legacy"
    hits[3] + 1 => hits[3]
    return "unknown"

def distinct(xs):
    [] => out
    for x in xs:
        if x in out:
            pass
        else:
            out + [x] => out
    return out

["OPEN", "Open", " open", "open", "CLOSED", "Closed", "closed", "pending"] => test_inputs
["queue       ", "archive     ", "queue-legacy", "unknown     "] => branch_names

"the existing test inputs, written before the normaliser" ^0
"  cases          : " + str(len(test_inputs)) ^0
"  distinct raw   : " + str(len(distinct(test_inputs))) ^0
[] => normalised
for t in test_inputs:
    normalised + [normalise(t)] => normalised
"  distinct after normalisation : " + str(len(distinct(normalised))) ^0
"  cases that became copies of another case : " + str(len(distinct(test_inputs)) - len(distinct(normalised))) ^0
"" ^0

# ---- reachability of the router's branches, before and after ----

[0, 0, 0, 0] => hits_raw
for t in test_inputs:
    route(t, hits_raw)

[0, 0, 0, 0] => hits_norm
for t in test_inputs:
    route(normalise(t), hits_norm)

"router branches reached" ^0
"  branch          raw   normalised" ^0
for i in [0:3]:
    "  " + branch_names[i] + "     " + str(hits_raw[i]) + "     " + str(hits_norm[i]) ^0
"" ^0

0 => dead_after
for i in [0:3]:
    if hits_raw[i] > 0:
        if hits_norm[i] == 0:
            dead_after + 1 => dead_after
"branches reachable before the normaliser and not after: " + str(dead_after) ^0
"" ^0

# ---- every test still passes ----

def expected_for(raw):
    if raw == "OPEN":
        return "queue"
    if raw == "Open":
        return "queue"
    if raw == " open":
        return "queue"
    if raw == "open":
        return "queue"
    if raw == "pending":
        return "unknown"
    return "archive"

0 => failing
for t in test_inputs:
    if route(normalise(t), [0, 0, 0, 0]) != expected_for(t):
        failing + 1 => failing
"the suite, run through the composed pipeline" ^0
"  cases failing: " + str(failing) + " of " + str(len(test_inputs)) ^0
"" ^0

# ---- how much of the suite is now duplicate work ----

[] => seen
0 => duplicates
for t in test_inputs:
    normalise(t) => n
    if n in seen:
        duplicates + 1 => duplicates
    else:
        seen + [n] => seen
"cases that assert about a value an earlier case already asserted about: " + str(duplicates) ^0
"cases doing new work: " + str(len(test_inputs) - duplicates) ^0
"" ^0
"The suite is green, its size is unchanged, and its coverage of the router" ^0
"went down. Nothing edited a test. Composition changed which inputs exist," ^0
"and a test is only as good as the reachability of the value it feeds in." ^0
```

## Python (deterministic transpilation)

```python
def normalise(tag):
    if tag == "OPEN":
        return "open"
    if tag == "Open":
        return "open"
    if tag == " open":
        return "open"
    if tag == "CLOSED":
        return "closed"
    if tag == "Closed":
        return "closed"
    return tag

def route(tag, hits):
    if tag == "open":
        hits[0] = hits[0] + 1
        return "queue"
    if tag == "closed":
        hits[1] = hits[1] + 1
        return "archive"
    if tag == "OPEN":
        hits[2] = hits[2] + 1
        return "queue-legacy"
    hits[3] = hits[3] + 1
    return "unknown"

def distinct(xs):
    out = []
    for x in xs:
        if x in out:
            pass
        else:
            out = out + [x]
    return out

test_inputs = ["OPEN", "Open", " open", "open", "CLOSED", "Closed", "closed", "pending"]
branch_names = ["queue       ", "archive     ", "queue-legacy", "unknown     "]
print("the existing test inputs, written before the normaliser")
print("  cases          : " + str(len(test_inputs)))
print("  distinct raw   : " + str(len(distinct(test_inputs))))
normalised = []
for t in test_inputs:
    normalised = normalised + [normalise(t)]
print("  distinct after normalisation : " + str(len(distinct(normalised))))
print("  cases that became copies of another case : " + str(len(distinct(test_inputs)) - len(distinct(normalised))))
print("")
hits_raw = [0, 0, 0, 0]
for t in test_inputs:
    route(t, hits_raw)
hits_norm = [0, 0, 0, 0]
for t in test_inputs:
    route(normalise(t), hits_norm)
print("router branches reached")
print("  branch          raw   normalised")
for i in range(0, 4):
    print("  " + branch_names[i] + "     " + str(hits_raw[i]) + "     " + str(hits_norm[i]))
print("")
dead_after = 0
for i in range(0, 4):
    if hits_raw[i] > 0:
        if hits_norm[i] == 0:
            dead_after = dead_after + 1
print("branches reachable before the normaliser and not after: " + str(dead_after))
print("")

def expected_for(raw):
    if raw == "OPEN":
        return "queue"
    if raw == "Open":
        return "queue"
    if raw == " open":
        return "queue"
    if raw == "open":
        return "queue"
    if raw == "pending":
        return "unknown"
    return "archive"

failing = 0
for t in test_inputs:
    if route(normalise(t), [0, 0, 0, 0]) != expected_for(t):
        failing = failing + 1
print("the suite, run through the composed pipeline")
print("  cases failing: " + str(failing) + " of " + str(len(test_inputs)))
print("")
seen = []
duplicates = 0
for t in test_inputs:
    n = normalise(t)
    if n in seen:
        duplicates = duplicates + 1
    else:
        seen = seen + [n]
print("cases that assert about a value an earlier case already asserted about: " + str(duplicates))
print("cases doing new work: " + str(len(test_inputs) - duplicates))
print("")
print("The suite is green, its size is unchanged, and its coverage of the router")
print("went down. Nothing edited a test. Composition changed which inputs exist,")
print("and a test is only as good as the reachability of the value it feeds in.")
```

## stdout (executed)

```text
the existing test inputs, written before the normaliser
  cases          : 8
  distinct raw   : 8
  distinct after normalisation : 3
  cases that became copies of another case : 5

router branches reached
  branch          raw   normalised
  queue            1     4
  archive          1     3
  queue-legacy     1     0
  unknown          5     1

branches reachable before the normaliser and not after: 1

the suite, run through the composed pipeline
  cases failing: 0 of 8

cases that assert about a value an earlier case already asserted about: 5
cases doing new work: 3

The suite is green, its size is unchanged, and its coverage of the router
went down. Nothing edited a test. Composition changed which inputs exist,
and a test is only as good as the reachability of the value it feeds in.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
