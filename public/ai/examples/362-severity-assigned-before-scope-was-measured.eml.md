<!-- canonical: efficientnewlanguage.org/ai/examples/362-severity-assigned-before-scope-was-measured | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 362 — Severity assigned before scope was measured — 0 inversions, then 1

`severity_assigned_before_scope_was_measured.eml` runs the same three findings over two populations and counts how often triage-by-witness ranks them wrongly.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Three findings,
# triaged by how bad their witness looked.
#
# Triage happens when the report arrives and the population has not been run
# yet. The only quantity available at that moment is the size of the error in
# the one example the reporter attached. So that is what gets used, and it is
# used as if it were the size of the problem.
#
# This program was written expecting the two orderings to disagree. On the
# first population they agree exactly - triage by witness gets all three in the
# right order. That result is kept, because it is the more useful finding: the
# same three mechanisms and the same three witnesses are then run over a second
# population, and there the ordering inverts.
#
# So the claim is not "witness size is a bad proxy". It is narrower and worse:
# whether it is a good proxy is a property of the POPULATION, and the
# population is precisely what nobody has when severity is assigned.
#
# The severity labels are the only stated values here; they are what the triage
# actually said, which is data. Every number is measured.

def loss(kind, amount, m):
    if m == 1:
        return 2
    if m == 2:
        if kind == "legacy":
            return 500
        return 0
    if m == 3:
        if amount > 100:
            return 40
        return 0
    return 0

def witness_in(pop, m):
    for r in pop:
        loss(r[0], r[1], m) => l
        if l > 0:
            return l
    return 0

def impact_in(pop, m):
    0 => t
    for r in pop:
        t + loss(r[0], r[1], m) => t
    return t

def affected_in(pop, m):
    0 => n
    for r in pop:
        if loss(r[0], r[1], m) > 0:
            n + 1 => n
    return n

def inversions_in(pop, ms):
    0 => inv
    0 => a
    for x in ms:
        0 => b
        for y in ms:
            if b > a:
                0 => wo
                0 => io
                if witness_in(pop, ms[a]) > witness_in(pop, ms[b]):
                    1 => wo
                if impact_in(pop, ms[a]) > impact_in(pop, ms[b]):
                    1 => io
                if wo != io:
                    inv + 1 => inv
            b + 1 => b
        a + 1 => a
    return inv

[["legacy", 900], ["std", 40], ["std", 130], ["std", 80], ["std", 210], ["std", 55], ["std", 160], ["std", 20], ["std", 340], ["std", 95], ["std", 120], ["std", 70], ["std", 180], ["std", 45], ["std", 260], ["std", 30], ["std", 110], ["std", 65], ["std", 150], ["std", 25]] => pop_a

# a second population: one legacy order as before, and a customer base whose
# orders are mostly large
[] => pop_b
pop_b + [["legacy", 900]] => pop_b
for _n in [1:14]:
    pop_b + [["std", 150]] => pop_b
pop_b + [["std", 30]] => pop_b
pop_b + [["std", 45]] => pop_b

[1, 2, 3] => mechanisms
["M1 rounding    ", "M2 legacy path ", "M3 large orders"] => names
["MINOR   ", "CRITICAL", "MAJOR   "] => triaged

def report(pop, label):
    label + "  (" + str(len(pop)) + " records)" ^0
    "  finding           triaged    witness   affected   total loss" ^0
    0 => i
    for m in mechanisms:
        "    " + names[i] + "  " + triaged[i] + "   " + str(witness_in(pop, m)) + "   " + str(affected_in(pop, m)) + " of " + str(len(pop)) + "   " + str(impact_in(pop, m)) ^0
        i + 1 => i
    "  pairs where the witness ordering and the impact ordering disagree : " + str(inversions_in(pop, mechanisms)) ^0
    "" ^0
    return 0

report(pop_a, "population A") => _a
report(pop_b, "population B") => _b

# ---- the witnesses did not change between the two populations ----

"the witness of each finding, in both populations" ^0
0 => k
0 => moved
for m in mechanisms:
    witness_in(pop_a, m) => wa
    witness_in(pop_b, m) => wb
    if wa != wb:
        moved + 1 => moved
    "  " + names[k] + " : " + str(wa) + " -> " + str(wb) ^0
    k + 1 => k
"  witnesses that changed between populations : " + str(moved) ^0
"" ^0

"the impact of each finding, in both populations" ^0
0 => k2
0 => moved2
for m in mechanisms:
    impact_in(pop_a, m) => ia
    impact_in(pop_b, m) => ib
    if ia != ib:
        moved2 + 1 => moved2
    "  " + names[k2] + " : " + str(ia) + " -> " + str(ib) ^0
    k2 + 1 => k2
"  impacts that changed between populations : " + str(moved2) ^0
"" ^0

# ---- which finding the triage would have to re-rank ----

"pairs that disagree, population B" ^0
0 => a2
for x in mechanisms:
    0 => b2
    for y in mechanisms:
        if b2 > a2:
            0 => wo
            0 => io
            if witness_in(pop_b, mechanisms[a2]) > witness_in(pop_b, mechanisms[b2]):
                1 => wo
            if impact_in(pop_b, mechanisms[a2]) > impact_in(pop_b, mechanisms[b2]):
                1 => io
            if wo != io:
                "  " + names[a2] + " vs " + names[b2] ^0
                "    witness : " + str(witness_in(pop_b, mechanisms[a2])) + " vs " + str(witness_in(pop_b, mechanisms[b2])) ^0
                "    impact  : " + str(impact_in(pop_b, mechanisms[a2])) + " vs " + str(impact_in(pop_b, mechanisms[b2])) ^0
        b2 + 1 => b2
    a2 + 1 => a2
"" ^0

"Severity is a claim about a population. The number available when severity is" ^0
"assigned is a property of one record, and it is stable - it will read the same" ^0
"on the day the population has changed underneath it." ^0
```

## Python (deterministic transpilation)

```python
def loss(kind, amount, m):
    if m == 1:
        return 2
    if m == 2:
        if kind == "legacy":
            return 500
        return 0
    if m == 3:
        if amount > 100:
            return 40
        return 0
    return 0

def witness_in(pop, m):
    for r in pop:
        l = loss(r[0], r[1], m)
        if l > 0:
            return l
    return 0

def impact_in(pop, m):
    t = 0
    for r in pop:
        t = t + loss(r[0], r[1], m)
    return t

def affected_in(pop, m):
    n = 0
    for r in pop:
        if loss(r[0], r[1], m) > 0:
            n = n + 1
    return n

def inversions_in(pop, ms):
    inv = 0
    a = 0
    for x in ms:
        b = 0
        for y in ms:
            if b > a:
                wo = 0
                io = 0
                if witness_in(pop, ms[a]) > witness_in(pop, ms[b]):
                    wo = 1
                if impact_in(pop, ms[a]) > impact_in(pop, ms[b]):
                    io = 1
                if wo != io:
                    inv = inv + 1
            b = b + 1
        a = a + 1
    return inv

pop_a = [["legacy", 900], ["std", 40], ["std", 130], ["std", 80], ["std", 210], ["std", 55], ["std", 160], ["std", 20], ["std", 340], ["std", 95], ["std", 120], ["std", 70], ["std", 180], ["std", 45], ["std", 260], ["std", 30], ["std", 110], ["std", 65], ["std", 150], ["std", 25]]
pop_b = []
pop_b = pop_b + [["legacy", 900]]
for _n in range(1, 15):
    pop_b = pop_b + [["std", 150]]
pop_b = pop_b + [["std", 30]]
pop_b = pop_b + [["std", 45]]
mechanisms = [1, 2, 3]
names = ["M1 rounding    ", "M2 legacy path ", "M3 large orders"]
triaged = ["MINOR   ", "CRITICAL", "MAJOR   "]

def report(pop, label):
    print(label + "  (" + str(len(pop)) + " records)")
    print("  finding           triaged    witness   affected   total loss")
    i = 0
    for m in mechanisms:
        print("    " + names[i] + "  " + triaged[i] + "   " + str(witness_in(pop, m)) + "   " + str(affected_in(pop, m)) + " of " + str(len(pop)) + "   " + str(impact_in(pop, m)))
        i = i + 1
    print("  pairs where the witness ordering and the impact ordering disagree : " + str(inversions_in(pop, mechanisms)))
    print("")
    return 0

_a = report(pop_a, "population A")
_b = report(pop_b, "population B")
print("the witness of each finding, in both populations")
k = 0
moved = 0
for m in mechanisms:
    wa = witness_in(pop_a, m)
    wb = witness_in(pop_b, m)
    if wa != wb:
        moved = moved + 1
    print("  " + names[k] + " : " + str(wa) + " -> " + str(wb))
    k = k + 1
print("  witnesses that changed between populations : " + str(moved))
print("")
print("the impact of each finding, in both populations")
k2 = 0
moved2 = 0
for m in mechanisms:
    ia = impact_in(pop_a, m)
    ib = impact_in(pop_b, m)
    if ia != ib:
        moved2 = moved2 + 1
    print("  " + names[k2] + " : " + str(ia) + " -> " + str(ib))
    k2 = k2 + 1
print("  impacts that changed between populations : " + str(moved2))
print("")
print("pairs that disagree, population B")
a2 = 0
for x in mechanisms:
    b2 = 0
    for y in mechanisms:
        if b2 > a2:
            wo = 0
            io = 0
            if witness_in(pop_b, mechanisms[a2]) > witness_in(pop_b, mechanisms[b2]):
                wo = 1
            if impact_in(pop_b, mechanisms[a2]) > impact_in(pop_b, mechanisms[b2]):
                io = 1
            if wo != io:
                print("  " + names[a2] + " vs " + names[b2])
                print("    witness : " + str(witness_in(pop_b, mechanisms[a2])) + " vs " + str(witness_in(pop_b, mechanisms[b2])))
                print("    impact  : " + str(impact_in(pop_b, mechanisms[a2])) + " vs " + str(impact_in(pop_b, mechanisms[b2])))
        b2 = b2 + 1
    a2 = a2 + 1
print("")
print("Severity is a claim about a population. The number available when severity is")
print("assigned is a property of one record, and it is stable - it will read the same")
print("on the day the population has changed underneath it.")
```

## stdout (executed)

```text
population A  (20 records)
  finding           triaged    witness   affected   total loss
    M1 rounding      MINOR      2   20 of 20   40
    M2 legacy path   CRITICAL   500   1 of 20   500
    M3 large orders  MAJOR      40   10 of 20   400
  pairs where the witness ordering and the impact ordering disagree : 0

population B  (17 records)
  finding           triaged    witness   affected   total loss
    M1 rounding      MINOR      2   17 of 17   34
    M2 legacy path   CRITICAL   500   1 of 17   500
    M3 large orders  MAJOR      40   15 of 17   600
  pairs where the witness ordering and the impact ordering disagree : 1

the witness of each finding, in both populations
  M1 rounding     : 2 -> 2
  M2 legacy path  : 500 -> 500
  M3 large orders : 40 -> 40
  witnesses that changed between populations : 0

the impact of each finding, in both populations
  M1 rounding     : 40 -> 34
  M2 legacy path  : 500 -> 500
  M3 large orders : 400 -> 600
  impacts that changed between populations : 2

pairs that disagree, population B
  M2 legacy path  vs M3 large orders
    witness : 500 vs 40
    impact  : 500 vs 600

Severity is a claim about a population. The number available when severity is
assigned is a property of one record, and it is stable - it will read the same
on the day the population has changed underneath it.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:output · eml:return · eml:run:done
