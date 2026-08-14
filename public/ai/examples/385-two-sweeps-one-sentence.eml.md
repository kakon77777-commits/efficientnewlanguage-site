<!-- canonical: efficientnewlanguage.org/ai/examples/385-two-sweeps-one-sentence | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 385 — Two sweeps, one sentence — 132 of 144 worlds hide behind the same zero

`two_sweeps_one_sentence.eml` runs every one-defect world through both sweeps and counts which worlds each one can separate from the clean world.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two sweeps report
# the same sentence, and the sentence is backed by different amounts of evidence.
#
# Both sweeps are honest. Neither hides anything, neither has a bug, and both
# print exactly what they observed: zero divergences. The reports are the same
# string. What differs is the domain each one walked, and the report does not
# carry the domain.
#
# The world is a parameter, not a constant: world 0 has nothing wrong in it,
# world k has exactly one wrong cell, cell number k. Every world is run through
# both sweeps, so "which worlds can this sweep tell apart" is measured by
# enumeration rather than argued.
#
# The point is not that the narrow sweep is bad. Over its own domain it is
# exhaustive, and there its negative result is a proof. The point is that the
# sentence it prints does not say which domain that is.

12 => side

def cell_index(i, j):
    return (i - 1) * side + j

def defective(i, j, world):
    if world == 0:
        return 0
    if cell_index(i, j) == world:
        return 1
    return 0

# Sweep A walks the diagonal. Sweep B walks every cell.

def sweep_a(world):
    0 => found
    for i in [1:side]:
        if defective(i, i, world) == 1:
            found + 1 => found
    return found

def sweep_b(world):
    0 => found
    for i in [1:side]:
        for j in [1:side]:
            if defective(i, j, world) == 1:
                found + 1 => found
    return found

def cells_a():
    0 => n
    for i in [1:side]:
        n + 1 => n
    return n

def cells_b():
    0 => n
    for i in [1:side]:
        for j in [1:side]:
            n + 1 => n
    return n

cells_a() => ca
cells_b() => cb

"grid" ^0
"  cells        : " + str(cb) ^0
"  sweep A walks : " + str(ca) ^0
"  sweep B walks : " + str(cb) ^0
"" ^0

# ---- the clean world, where both are right ----

sweep_a(0) => a_clean
sweep_b(0) => b_clean
"world 0 - nothing is wrong" ^0
"  sweep A : " + str(a_clean) + " divergences found" ^0
"  sweep B : " + str(b_clean) + " divergences found" ^0
if a_clean == b_clean:
    "  the two reports agree, and both are correct" ^0
"" ^0

# ---- one world where they still agree, one where they do not ----
#
# Which cell is picked is not chosen by hand: the first world A can see and the
# first world A cannot see are both found by asking A.

0 => seen_world
0 => unseen_world
for w in [1:cb]:
    if sweep_a(w) == 1:
        if seen_world == 0:
            w => seen_world
    else:
        if unseen_world == 0:
            w => unseen_world

"world " + str(seen_world) + " - a wrong cell that A walks over" ^0
"  sweep A : " + str(sweep_a(seen_world)) ^0
"  sweep B : " + str(sweep_b(seen_world)) ^0
"" ^0
"world " + str(unseen_world) + " - a wrong cell that A does not walk over" ^0
"  sweep A : " + str(sweep_a(unseen_world)) ^0
"  sweep B : " + str(sweep_b(unseen_world)) ^0
"" ^0

if sweep_a(unseen_world) == a_clean:
    "A prints the same number in world 0 and world " + str(unseen_world) + "." ^0
    "Those two worlds are not the same world." ^0
"" ^0

# ---- how many worlds hide behind A's zero ----

0 => a_detects
0 => a_misses
for w in [1:cb]:
    if sweep_a(w) > 0:
        a_detects + 1 => a_detects
    else:
        a_misses + 1 => a_misses

0 => b_detects
for w in [1:cb]:
    if sweep_b(w) > 0:
        b_detects + 1 => b_detects

"one-defect worlds : " + str(cb) ^0
"  A separates from world 0 : " + str(a_detects) ^0
"  A cannot separate        : " + str(a_misses) ^0
"  B separates from world 0 : " + str(b_detects) ^0
"" ^0

# ---- and where A's zero IS a proof ----
#
# Restricted to the cells A actually walks, A finds every planted defect. Its
# negative result is exhaustive there. The claim it supports is real; it is
# just narrower than the sentence it printed.

0 => on_domain
0 => on_domain_found
for i in [1:side]:
    cell_index(i, i) => w
    on_domain + 1 => on_domain
    if sweep_a(w) > 0:
        on_domain_found + 1 => on_domain_found

"restricted to the cells A walks" ^0
"  worlds in that subdomain : " + str(on_domain) ^0
"  A finds                  : " + str(on_domain_found) ^0
if on_domain_found == on_domain:
    "  over its own domain A is exhaustive - there, zero IS absence" ^0
"" ^0

"Both sweeps printed a true sentence. One of them proves what it sounds like" ^0
"it proves. The report has no field for which cells were walked, so the two" ^0
"sentences are indistinguishable at the point where they are read." ^0
```

## Python (deterministic transpilation)

```python
side = 12

def cell_index(i, j):
    return (i - 1) * side + j

def defective(i, j, world):
    if world == 0:
        return 0
    if cell_index(i, j) == world:
        return 1
    return 0

def sweep_a(world):
    found = 0
    for i in range(1, side+1):
        if defective(i, i, world) == 1:
            found = found + 1
    return found

def sweep_b(world):
    found = 0
    for i in range(1, side+1):
        for j in range(1, side+1):
            if defective(i, j, world) == 1:
                found = found + 1
    return found

def cells_a():
    n = 0
    for i in range(1, side+1):
        n = n + 1
    return n

def cells_b():
    n = 0
    for i in range(1, side+1):
        for j in range(1, side+1):
            n = n + 1
    return n

ca = cells_a()
cb = cells_b()
print("grid")
print("  cells        : " + str(cb))
print("  sweep A walks : " + str(ca))
print("  sweep B walks : " + str(cb))
print("")
a_clean = sweep_a(0)
b_clean = sweep_b(0)
print("world 0 - nothing is wrong")
print("  sweep A : " + str(a_clean) + " divergences found")
print("  sweep B : " + str(b_clean) + " divergences found")
if a_clean == b_clean:
    print("  the two reports agree, and both are correct")
print("")
seen_world = 0
unseen_world = 0
for w in range(1, cb+1):
    if sweep_a(w) == 1:
        if seen_world == 0:
            seen_world = w
    elif unseen_world == 0:
        unseen_world = w
print("world " + str(seen_world) + " - a wrong cell that A walks over")
print("  sweep A : " + str(sweep_a(seen_world)))
print("  sweep B : " + str(sweep_b(seen_world)))
print("")
print("world " + str(unseen_world) + " - a wrong cell that A does not walk over")
print("  sweep A : " + str(sweep_a(unseen_world)))
print("  sweep B : " + str(sweep_b(unseen_world)))
print("")
if sweep_a(unseen_world) == a_clean:
    print("A prints the same number in world 0 and world " + str(unseen_world) + ".")
    print("Those two worlds are not the same world.")
print("")
a_detects = 0
a_misses = 0
for w in range(1, cb+1):
    if sweep_a(w) > 0:
        a_detects = a_detects + 1
    else:
        a_misses = a_misses + 1
b_detects = 0
for w in range(1, cb+1):
    if sweep_b(w) > 0:
        b_detects = b_detects + 1
print("one-defect worlds : " + str(cb))
print("  A separates from world 0 : " + str(a_detects))
print("  A cannot separate        : " + str(a_misses))
print("  B separates from world 0 : " + str(b_detects))
print("")
on_domain = 0
on_domain_found = 0
for i in range(1, side+1):
    w = cell_index(i, i)
    on_domain = on_domain + 1
    if sweep_a(w) > 0:
        on_domain_found = on_domain_found + 1
print("restricted to the cells A walks")
print("  worlds in that subdomain : " + str(on_domain))
print("  A finds                  : " + str(on_domain_found))
if on_domain_found == on_domain:
    print("  over its own domain A is exhaustive - there, zero IS absence")
print("")
print("Both sweeps printed a true sentence. One of them proves what it sounds like")
print("it proves. The report has no field for which cells were walked, so the two")
print("sentences are indistinguishable at the point where they are read.")
```

## stdout (executed)

```text
grid
  cells        : 144
  sweep A walks : 12
  sweep B walks : 144

world 0 - nothing is wrong
  sweep A : 0 divergences found
  sweep B : 0 divergences found
  the two reports agree, and both are correct

world 1 - a wrong cell that A walks over
  sweep A : 1
  sweep B : 1

world 2 - a wrong cell that A does not walk over
  sweep A : 0
  sweep B : 1

A prints the same number in world 0 and world 2.
Those two worlds are not the same world.

one-defect worlds : 144
  A separates from world 0 : 12
  A cannot separate        : 132
  B separates from world 0 : 144

restricted to the cells A walks
  worlds in that subdomain : 12
  A finds                  : 12
  over its own domain A is exhaustive - there, zero IS absence

Both sweeps printed a true sentence. One of them proves what it sounds like
it proves. The report has no field for which cells were walked, so the two
sentences are indistinguishable at the point where they are read.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
