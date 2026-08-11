<!-- canonical: efficientnewlanguage.org/ai/examples/336-no-observable-distinguishes-the-two | ai_layer_version: 0.1.0 | updated: 2026-08-11 -->

# Example 336 — No observable distinguishes the two — 1800 observations, zero disagreements

`no_observable_distinguishes_the_two.eml` runs an aliasing store and a copying store side by side and counts how many observations tell them apart.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two stores that
# are not the same store, and an operation set under which nothing can tell.
#
# One keeps the list it was handed. The other keeps a copy. That is a real
# difference with real consequences, and under the six questions this program
# knows how to ask - size, total, largest, membership, an element, a rendering -
# every answer agrees, on every input, forever.
#
# This is not a weak test suite. Adding a thousand more assertions over those
# six questions kills nothing, because the difference does not reach any of
# their answers. The corpus of OBSERVATIONS is the limit, not the corpus of
# tests, and those are not the same thing.
#
# What changes it is not a better assertion. It is one more kind of question:
# change the caller's list AFTER handing it over, then ask again. That single
# addition to the observable surface separates them immediately.
#
# Nothing here declares which observations distinguish. Every answer is computed
# from both stores and compared.

def store_alias(xs):
    return xs

def store_copy(xs):
    [] => out
    for x in xs:
        out + [x] => out
    return out

def ask(store, q):
    if q == "size":
        return str(len(store))
    if q == "total":
        return str(sum(store))
    if q == "largest":
        if len(store) == 0:
            return "none"
        return str(max(store))
    if q == "has7":
        if 7 in store:
            return "yes"
        return "no"
    if q == "first":
        if len(store) == 0:
            return "none"
        return str(store[0])
    return repr(store)

["size", "total", "largest", "has7", "first", "render"] => questions
[[1, 2, 3], [7], [], [4, 7, 2, 9], [5, 5], [0 - 3, 8]] => inputs

# ---- the questions this program knows how to ask ----

"observations that distinguish an aliasing store from a copying store" ^0
0 => asked
0 => distinguishing
for xs in inputs:
    [] => held
    for x in xs:
        held + [x] => held
    store_alias(held) => a
    store_copy(held) => b
    for q in questions:
        asked + 1 => asked
        if ask(a, q) != ask(b, q):
            distinguishing + 1 => distinguishing
"  inputs " + str(len(inputs)) + " x questions " + str(len(questions)) + " = " + str(asked) + " observations" ^0
"  observations where the two disagree: " + str(distinguishing) ^0
"" ^0

# ---- one more kind of question ----

"the same two stores, after the caller changes its own list" ^0
0 => asked2
0 => distinguishing2
[] => witness
for xs in inputs:
    if len(xs) > 0:
        [] => held
        for x in xs:
            held + [x] => held
        store_alias(held) => a
        store_copy(held) => b
        99 => held[0]
        for q in questions:
            asked2 + 1 => asked2
            ask(a, q) => ra
            ask(b, q) => rb
            if ra != rb:
                distinguishing2 + 1 => distinguishing2
                if len(witness) == 0:
                    [repr(xs), q, ra, rb] => witness
"  observations: " + str(asked2) ^0
"  observations where the two disagree: " + str(distinguishing2) ^0
"" ^0

if len(witness) > 0:
    "first witness" ^0
    "  input    : " + witness[0] ^0
    "  question : " + witness[1] ^0
    "  aliasing : " + witness[2] ^0
    "  copying  : " + witness[3] ^0
    "" ^0

# ---- what more testing of the first surface would have bought ----

"repeating the original questions many times over the same surface" ^0
0 => repeats
0 => extra
for round_no in [1:50]:
    for xs in inputs:
        [] => held
        for x in xs:
            held + [x] => held
        store_alias(held) => a
        store_copy(held) => b
        for q in questions:
            repeats + 1 => repeats
            if ask(a, q) != ask(b, q):
                extra + 1 => extra
"  observations made: " + str(repeats) ^0
"  disagreements found: " + str(extra) ^0
"" ^0
"Fifty times the effort on the same six questions buys nothing, because the" ^0
"difference is not in their answers. One new KIND of question separates the" ^0
"two on the first try." ^0
"" ^0
"A suite is bounded by what the system renders, not by how hard it looks." ^0
```

## Python (deterministic transpilation)

```python
def store_alias(xs):
    return xs

def store_copy(xs):
    out = []
    for x in xs:
        out = out + [x]
    return out

def ask(store, q):
    if q == "size":
        return str(len(store))
    if q == "total":
        return str(sum(store))
    if q == "largest":
        if len(store) == 0:
            return "none"
        return str(max(store))
    if q == "has7":
        if 7 in store:
            return "yes"
        return "no"
    if q == "first":
        if len(store) == 0:
            return "none"
        return str(store[0])
    return repr(store)

questions = ["size", "total", "largest", "has7", "first", "render"]
inputs = [[1, 2, 3], [7], [], [4, 7, 2, 9], [5, 5], [0 - 3, 8]]
print("observations that distinguish an aliasing store from a copying store")
asked = 0
distinguishing = 0
for xs in inputs:
    held = []
    for x in xs:
        held = held + [x]
    a = store_alias(held)
    b = store_copy(held)
    for q in questions:
        asked = asked + 1
        if ask(a, q) != ask(b, q):
            distinguishing = distinguishing + 1
print("  inputs " + str(len(inputs)) + " x questions " + str(len(questions)) + " = " + str(asked) + " observations")
print("  observations where the two disagree: " + str(distinguishing))
print("")
print("the same two stores, after the caller changes its own list")
asked2 = 0
distinguishing2 = 0
witness = []
for xs in inputs:
    if len(xs) > 0:
        held = []
        for x in xs:
            held = held + [x]
        a = store_alias(held)
        b = store_copy(held)
        held[0] = 99
        for q in questions:
            asked2 = asked2 + 1
            ra = ask(a, q)
            rb = ask(b, q)
            if ra != rb:
                distinguishing2 = distinguishing2 + 1
                if len(witness) == 0:
                    witness = [repr(xs), q, ra, rb]
print("  observations: " + str(asked2))
print("  observations where the two disagree: " + str(distinguishing2))
print("")
if len(witness) > 0:
    print("first witness")
    print("  input    : " + witness[0])
    print("  question : " + witness[1])
    print("  aliasing : " + witness[2])
    print("  copying  : " + witness[3])
    print("")
print("repeating the original questions many times over the same surface")
repeats = 0
extra = 0
for round_no in range(1, 51):
    for xs in inputs:
        held = []
        for x in xs:
            held = held + [x]
        a = store_alias(held)
        b = store_copy(held)
        for q in questions:
            repeats = repeats + 1
            if ask(a, q) != ask(b, q):
                extra = extra + 1
print("  observations made: " + str(repeats))
print("  disagreements found: " + str(extra))
print("")
print("Fifty times the effort on the same six questions buys nothing, because the")
print("difference is not in their answers. One new KIND of question separates the")
print("two on the first try.")
print("")
print("A suite is bounded by what the system renders, not by how hard it looks.")
```

## stdout (executed)

```text
observations that distinguish an aliasing store from a copying store
  inputs 6 x questions 6 = 36 observations
  observations where the two disagree: 0

the same two stores, after the caller changes its own list
  observations: 30
  observations where the two disagree: 21

first witness
  input    : [1, 2, 3]
  question : total
  aliasing : 104
  copying  : 6

repeating the original questions many times over the same surface
  observations made: 1800
  disagreements found: 0

Fifty times the effort on the same six questions buys nothing, because the
difference is not in their answers. One new KIND of question separates the
two on the first try.

A suite is bounded by what the system renders, not by how hard it looks.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
