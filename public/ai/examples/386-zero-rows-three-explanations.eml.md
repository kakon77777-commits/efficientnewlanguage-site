<!-- canonical: efficientnewlanguage.org/ai/examples/386-zero-rows-three-explanations | ai_layer_version: 0.1.0 | updated: 2026-08-14 -->

# Example 386 — Zero rows, three explanations — 1 of 3 worlds separable, and two probes fix it

`zero_rows_three_explanations.eml` runs three worlds through the same query and counts how many of them each set of observations can still tell apart.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One query, three
# worlds, one answer.
#
# The query is right. It asks the question it was asked to ask - how many
# refunds are in this window - and it returns zero, and zero is a true count of
# the rows matching it. Nothing is broken anywhere in this program.
#
# What the reader does next is decide something about the world, and there are
# three worlds that produce this answer: no refund happened; refunds happened
# and no row was written; refunds happened and were written under another name.
# Those three call for three different actions.
#
# So the three worlds are run through the same query, and then through probes
# chosen to split them. Which worlds a probe separates is measured by comparing
# signatures, not asserted.

# [type, amount]
# A and C are given the SAME number of rows on purpose. If they differ, the row
# count separates them for a reason that has nothing to do with refunds, and
# the second probe appears to buy nothing.
[["sale", 100], ["sale", 250], ["sale", 80]] => world_a
[] => world_b
[["reversal", -40], ["sale", 250], ["reversal", -15]] => world_c

[world_a, world_b, world_c] => worlds
["A refunds never happened", "B refunds happened, nothing was written", "C refunds happened, written as reversals"] => names

# what is true of each world, known to the program and not to the query
[0, 2, 2] => truth_refunds

def q_refund_rows(rows):
    0 => c
    for r in rows:
        if r[0] == "refund":
            c + 1 => c
    return c

def p_any_rows(rows):
    return len(rows)

def p_negative_amounts(rows):
    0 => c
    for r in rows:
        if r[1] < 0:
            c + 1 => c
    return c

# ---- the query, on all three ----

"the query: rows of type refund in this window" ^0
for i in [0:2]:
    "  " + names[i] + " -> " + str(q_refund_rows(worlds[i])) ^0
"" ^0
"what is actually true" ^0
for i in [0:2]:
    "  " + names[i] + " -> " + str(truth_refunds[i]) + " refunds occurred" ^0
"" ^0

# ---- how many worlds each set of observations can tell apart ----
#
# A signature is what an observer can see. Counting distinct signatures counts
# how many of the three worlds are still separable after looking.

def distinct(sigs):
    0 => c
    0 => idx
    for s in sigs:
        1 => is_new
        0 => j
        for t in sigs:
            if j < idx:
                if t == s:
                    0 => is_new
            j + 1 => j
        c + is_new => c
        idx + 1 => idx
    return c

[] => sig1
[] => sig2
[] => sig3
for i in [0:2]:
    sig1 + [str(q_refund_rows(worlds[i]))] => sig1
    sig2 + [str(q_refund_rows(worlds[i])) + "/" + str(p_any_rows(worlds[i]))] => sig2
    sig3 + [str(q_refund_rows(worlds[i])) + "/" + str(p_any_rows(worlds[i])) + "/" + str(p_negative_amounts(worlds[i]))] => sig3

"worlds still separable" ^0
"  query alone                          : " + str(distinct(sig1)) + " of " + str(len(worlds)) ^0
"  query + row count                    : " + str(distinct(sig2)) + " of " + str(len(worlds)) ^0
"  query + row count + negative amounts : " + str(distinct(sig3)) + " of " + str(len(worlds)) ^0
"" ^0

# ---- what each probe bought ----

"each probe, and the worlds it splits off" ^0
"  row count      : " + str(distinct(sig2) - distinct(sig1)) + " more separated" ^0
"  negative amounts : " + str(distinct(sig3) - distinct(sig2)) + " more separated" ^0
"" ^0

"the observations, side by side" ^0
for i in [0:2]:
    "  " + names[i] ^0
    "    refund rows : " + str(q_refund_rows(worlds[i])) ^0
    "    rows at all : " + str(p_any_rows(worlds[i])) ^0
    "    negative amounts : " + str(p_negative_amounts(worlds[i])) ^0
"" ^0

# ---- the control: a world where the query's zero means what it sounds like ----
#
# Without this the case would only show that the query is weak. It is not weak
# everywhere: where rows exist, are complete, and use the expected vocabulary,
# zero refund rows is zero refunds.

[["sale", 100], ["refund", -30], ["sale", 250]] => world_d
"control - a fourth world with a refund actually written as one" ^0
"  refund rows : " + str(q_refund_rows(world_d)) ^0
if q_refund_rows(world_d) > 0:
    "  the query can return non-zero, so its zero is an observation" ^0
"" ^0

if distinct(sig1) == 1:
    "Three worlds, one number. The query answered its own question correctly" ^0
    "and the reader asked a different one." ^0
```

## Python (deterministic transpilation)

```python
world_a = [["sale", 100], ["sale", 250], ["sale", 80]]
world_b = []
world_c = [["reversal", -40], ["sale", 250], ["reversal", -15]]
worlds = [world_a, world_b, world_c]
names = ["A refunds never happened", "B refunds happened, nothing was written", "C refunds happened, written as reversals"]
truth_refunds = [0, 2, 2]

def q_refund_rows(rows):
    c = 0
    for r in rows:
        if r[0] == "refund":
            c = c + 1
    return c

def p_any_rows(rows):
    return len(rows)

def p_negative_amounts(rows):
    c = 0
    for r in rows:
        if r[1] < 0:
            c = c + 1
    return c

print("the query: rows of type refund in this window")
for i in range(0, 3):
    print("  " + names[i] + " -> " + str(q_refund_rows(worlds[i])))
print("")
print("what is actually true")
for i in range(0, 3):
    print("  " + names[i] + " -> " + str(truth_refunds[i]) + " refunds occurred")
print("")

def distinct(sigs):
    c = 0
    idx = 0
    for s in sigs:
        is_new = 1
        j = 0
        for t in sigs:
            if j < idx:
                if t == s:
                    is_new = 0
            j = j + 1
        c = c + is_new
        idx = idx + 1
    return c

sig1 = []
sig2 = []
sig3 = []
for i in range(0, 3):
    sig1 = sig1 + [str(q_refund_rows(worlds[i]))]
    sig2 = sig2 + [str(q_refund_rows(worlds[i])) + "/" + str(p_any_rows(worlds[i]))]
    sig3 = sig3 + [str(q_refund_rows(worlds[i])) + "/" + str(p_any_rows(worlds[i])) + "/" + str(p_negative_amounts(worlds[i]))]
print("worlds still separable")
print("  query alone                          : " + str(distinct(sig1)) + " of " + str(len(worlds)))
print("  query + row count                    : " + str(distinct(sig2)) + " of " + str(len(worlds)))
print("  query + row count + negative amounts : " + str(distinct(sig3)) + " of " + str(len(worlds)))
print("")
print("each probe, and the worlds it splits off")
print("  row count      : " + str(distinct(sig2) - distinct(sig1)) + " more separated")
print("  negative amounts : " + str(distinct(sig3) - distinct(sig2)) + " more separated")
print("")
print("the observations, side by side")
for i in range(0, 3):
    print("  " + names[i])
    print("    refund rows : " + str(q_refund_rows(worlds[i])))
    print("    rows at all : " + str(p_any_rows(worlds[i])))
    print("    negative amounts : " + str(p_negative_amounts(worlds[i])))
print("")
world_d = [["sale", 100], ["refund", -30], ["sale", 250]]
print("control - a fourth world with a refund actually written as one")
print("  refund rows : " + str(q_refund_rows(world_d)))
if q_refund_rows(world_d) > 0:
    print("  the query can return non-zero, so its zero is an observation")
print("")
if distinct(sig1) == 1:
    print("Three worlds, one number. The query answered its own question correctly")
    print("and the reader asked a different one.")
```

## stdout (executed)

```text
the query: rows of type refund in this window
  A refunds never happened -> 0
  B refunds happened, nothing was written -> 0
  C refunds happened, written as reversals -> 0

what is actually true
  A refunds never happened -> 0 refunds occurred
  B refunds happened, nothing was written -> 2 refunds occurred
  C refunds happened, written as reversals -> 2 refunds occurred

worlds still separable
  query alone                          : 1 of 3
  query + row count                    : 2 of 3
  query + row count + negative amounts : 3 of 3

each probe, and the worlds it splits off
  row count      : 1 more separated
  negative amounts : 1 more separated

the observations, side by side
  A refunds never happened
    refund rows : 0
    rows at all : 3
    negative amounts : 0
  B refunds happened, nothing was written
    refund rows : 0
    rows at all : 0
    negative amounts : 0
  C refunds happened, written as reversals
    refund rows : 0
    rows at all : 3
    negative amounts : 2

control - a fourth world with a refund actually written as one
  refund rows : 1
  the query can return non-zero, so its zero is an observation

Three worlds, one number. The query answered its own question correctly
and the reader asked a different one.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
