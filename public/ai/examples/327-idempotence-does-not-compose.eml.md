<!-- canonical: efficientnewlanguage.org/ai/examples/327-idempotence-does-not-compose | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 327 — Idempotence does not compose — three retry-safe routines, two retry-unsafe pairs

`idempotence_does_not_compose.eml` measures `f(f(x)) == f(x)` for three cleanup routines, then measures the same property for every ordered pair built from them.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three cleanup
# routines, each measured idempotent on every input, and the pairs built from
# them are not all idempotent.
#
# `idempotence-witness` in this corpus checks `f(f(x)) == f(x)` for individual
# routines, which is the property every retry depends on. This file asks the
# next question, and the answer is not the comforting one: idempotence is a
# property of a FUNCTION, and composing two functions that have it does not
# give you a function that has it.
#
# That matters because production does not retry a step, it retries a pipeline.
# A queue redelivers the message. A job runner reruns the task. Whatever ran
# before runs again from the top, and the thing being replayed is the
# composition - which nobody tested for the property, because each part was
# tested and each part passed.
#
# Nothing here declares which pairs survive. Every routine's idempotence and
# every pair's idempotence is measured by applying it twice and comparing.
# The structural reason the survivors survive is measured too, by asking
# whether the second routine's output is already a fixed point of the first.

def collapse_adjacent(xs):
    [] => out
    for x in xs:
        if len(out) == 0:
            out + [x] => out
        else:
            if out[len(out) - 1] == x:
                pass
            else:
                out + [x] => out
    return out

def drop_zeros(xs):
    [] => out
    for x in xs:
        if x == 0:
            pass
        else:
            out + [x] => out
    return out

def cap_at_five(xs):
    [] => out
    for x in xs:
        if x > 5:
            out + [5] => out
        else:
            out + [x] => out
    return out

def apply_one(name, xs):
    if name == "collapse":
        return collapse_adjacent(xs)
    if name == "dropzero":
        return drop_zeros(xs)
    return cap_at_five(xs)

def apply_pair(first, second, xs):
    return apply_one(second, apply_one(first, xs))

def same(a, b):
    if len(a) != len(b):
        return 0
    for i in [0:len(a) - 1]:
        if a[i] != b[i]:
            return 0
    return 1

["collapse", "dropzero", "cap"] => names
[[1, 0, 1], [6, 6, 7], [0, 0, 3], [2, 2, 2], [7, 0, 7, 0], [1, 2, 3], [], [5, 6, 5], [0, 9, 9, 0]] => inputs

# ---- each routine on its own ----

"each routine applied twice, over every input" ^0
for n in names:
    0 => bad
    for xs in inputs:
        apply_one(n, xs) => once
        apply_one(n, once) => twice
        if same(once, twice) == 0:
            bad + 1 => bad
    "  " + n + ": inputs where f(f(x)) != f(x) = " + str(bad) ^0
"" ^0

# ---- every ordered pair ----

"ordered pairs, applied twice, over every input" ^0
[] => broken_pairs
for p in names:
    for q in names:
        if p == q:
            pass
        else:
            0 => bad
            [] => witness
            for xs in inputs:
                apply_pair(p, q, xs) => once
                apply_pair(p, q, once) => twice
                if same(once, twice) == 0:
                    bad + 1 => bad
                    if len(witness) == 0:
                        [xs, once, twice] => witness
            if bad == 0:
                "  first " + p + " then " + q + ": idempotent" ^0
            else:
                "  first " + p + " then " + q + ": NOT idempotent on " + str(bad) + " of " + str(len(inputs)) ^0
                broken_pairs + [[p, q, witness]] => broken_pairs
"" ^0

"pairs built from idempotent parts that lost the property: " + str(len(broken_pairs)) ^0
"" ^0

# ---- the witnesses ----

for b in broken_pairs:
    b[2] => w
    "witness for first " + b[0] + " then " + b[1] ^0
    "  x        = " + repr(w[0]) ^0
    "  h(x)     = " + repr(w[1]) ^0
    "  h(h(x))  = " + repr(w[2]) ^0
"" ^0

# ---- why the survivors survive, measured rather than asserted ----

"is the second routine's output already a fixed point of the first?" ^0
0 => pairs_seen
0 => agreed
for p in names:
    for q in names:
        if p == q:
            pass
        else:
            0 => escapes
            0 => nonidem
            for xs in inputs:
                apply_pair(p, q, xs) => h
                apply_one(p, h) => reapplied
                if same(h, reapplied) == 0:
                    escapes + 1 => escapes
                apply_pair(p, q, h) => twice
                if same(h, twice) == 0:
                    nonidem + 1 => nonidem
            pairs_seen + 1 => pairs_seen
            if escapes == 0:
                if nonidem == 0:
                    agreed + 1 => agreed
            else:
                if nonidem > 0:
                    agreed + 1 => agreed
            "  first " + p + " then " + q + ": outputs that " + p + " would still change = " + str(escapes) ^0
"" ^0

"pairs where 'first routine has work left' and 'pair is not idempotent'" ^0
"agree: " + str(agreed) + " of " + str(pairs_seen) ^0
"" ^0
"That is an agreement measured on this input set, not a proof. It is the" ^0
"mechanism worth carrying: a pair keeps the property only while the second" ^0
"routine never hands back something the first one still has work to do on." ^0
```

## Python (deterministic transpilation)

```python
def collapse_adjacent(xs):
    out = []
    for x in xs:
        if len(out) == 0:
            out = out + [x]
        elif out[len(out) - 1] == x:
            pass
        else:
            out = out + [x]
    return out

def drop_zeros(xs):
    out = []
    for x in xs:
        if x == 0:
            pass
        else:
            out = out + [x]
    return out

def cap_at_five(xs):
    out = []
    for x in xs:
        if x > 5:
            out = out + [5]
        else:
            out = out + [x]
    return out

def apply_one(name, xs):
    if name == "collapse":
        return collapse_adjacent(xs)
    if name == "dropzero":
        return drop_zeros(xs)
    return cap_at_five(xs)

def apply_pair(first, second, xs):
    return apply_one(second, apply_one(first, xs))

def same(a, b):
    if len(a) != len(b):
        return 0
    for i in range(0, len(a)):
        if a[i] != b[i]:
            return 0
    return 1

names = ["collapse", "dropzero", "cap"]
inputs = [[1, 0, 1], [6, 6, 7], [0, 0, 3], [2, 2, 2], [7, 0, 7, 0], [1, 2, 3], [], [5, 6, 5], [0, 9, 9, 0]]
print("each routine applied twice, over every input")
for n in names:
    bad = 0
    for xs in inputs:
        once = apply_one(n, xs)
        twice = apply_one(n, once)
        if same(once, twice) == 0:
            bad = bad + 1
    print("  " + n + ": inputs where f(f(x)) != f(x) = " + str(bad))
print("")
print("ordered pairs, applied twice, over every input")
broken_pairs = []
for p in names:
    for q in names:
        if p == q:
            pass
        else:
            bad = 0
            witness = []
            for xs in inputs:
                once = apply_pair(p, q, xs)
                twice = apply_pair(p, q, once)
                if same(once, twice) == 0:
                    bad = bad + 1
                    if len(witness) == 0:
                        witness = [xs, once, twice]
            if bad == 0:
                print("  first " + p + " then " + q + ": idempotent")
            else:
                print("  first " + p + " then " + q + ": NOT idempotent on " + str(bad) + " of " + str(len(inputs)))
                broken_pairs = broken_pairs + [[p, q, witness]]
print("")
print("pairs built from idempotent parts that lost the property: " + str(len(broken_pairs)))
print("")
for b in broken_pairs:
    w = b[2]
    print("witness for first " + b[0] + " then " + b[1])
    print("  x        = " + repr(w[0]))
    print("  h(x)     = " + repr(w[1]))
    print("  h(h(x))  = " + repr(w[2]))
print("")
print("is the second routine's output already a fixed point of the first?")
pairs_seen = 0
agreed = 0
for p in names:
    for q in names:
        if p == q:
            pass
        else:
            escapes = 0
            nonidem = 0
            for xs in inputs:
                h = apply_pair(p, q, xs)
                reapplied = apply_one(p, h)
                if same(h, reapplied) == 0:
                    escapes = escapes + 1
                twice = apply_pair(p, q, h)
                if same(h, twice) == 0:
                    nonidem = nonidem + 1
            pairs_seen = pairs_seen + 1
            if escapes == 0:
                if nonidem == 0:
                    agreed = agreed + 1
            elif nonidem > 0:
                agreed = agreed + 1
            print("  first " + p + " then " + q + ": outputs that " + p + " would still change = " + str(escapes))
print("")
print("pairs where 'first routine has work left' and 'pair is not idempotent'")
print("agree: " + str(agreed) + " of " + str(pairs_seen))
print("")
print("That is an agreement measured on this input set, not a proof. It is the")
print("mechanism worth carrying: a pair keeps the property only while the second")
print("routine never hands back something the first one still has work to do on.")
```

## stdout (executed)

```text
each routine applied twice, over every input
  collapse: inputs where f(f(x)) != f(x) = 0
  dropzero: inputs where f(f(x)) != f(x) = 0
  cap: inputs where f(f(x)) != f(x) = 0

ordered pairs, applied twice, over every input
  first collapse then dropzero: NOT idempotent on 2 of 9
  first collapse then cap: NOT idempotent on 2 of 9
  first dropzero then collapse: idempotent
  first dropzero then cap: idempotent
  first cap then collapse: idempotent
  first cap then dropzero: idempotent

pairs built from idempotent parts that lost the property: 2

witness for first collapse then dropzero
  x        = [1, 0, 1]
  h(x)     = [1, 1]
  h(h(x))  = [1]
witness for first collapse then cap
  x        = [6, 6, 7]
  h(x)     = [5, 5]
  h(h(x))  = [5]

is the second routine's output already a fixed point of the first?
  first collapse then dropzero: outputs that collapse would still change = 2
  first collapse then cap: outputs that collapse would still change = 2
  first dropzero then collapse: outputs that dropzero would still change = 0
  first dropzero then cap: outputs that dropzero would still change = 0
  first cap then collapse: outputs that cap would still change = 0
  first cap then dropzero: outputs that cap would still change = 0

pairs where 'first routine has work left' and 'pair is not idempotent'
agree: 6 of 6

That is an agreement measured on this input set, not a proof. It is the
mechanism worth carrying: a pair keeps the property only while the second
routine never hands back something the first one still has work to do on.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
