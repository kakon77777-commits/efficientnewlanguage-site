<!-- canonical: efficientnewlanguage.org/ai/examples/138-ternary-decision-table | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 138 — Ternary chains

`ternary_decision_table.eml` exercises EML's `cond ? a : b`, which the corpus had almost no coverage of before this.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). EML's ternary,
# `cond ? a : b`, which the corpus had almost no coverage of before this.
#
# Three properties, each checked rather than asserted:
#
# 1. A nested ternary chain and the equivalent if/elif chain agree on every
#    input. They are compared across the whole range below, not spot-checked.
#
# 2. The chain is RIGHT-associative: `a ? b : c ? d : e` groups as
#    `a ? b : (c ? d : e)`. That is the only grouping that makes a chain useful,
#    and the alternative reading `(a ? b : c) ? d : e` would produce different
#    answers here - so the agreement in (1) is itself the evidence.
#
# 3. ORDER decides the answer when conditions overlap. The bands below are
#    deliberately not mutually exclusive: 95 satisfies `>= 90`, `>= 80` and
#    `>= 70` all at once. First match wins, so reordering the chain changes the
#    output even though every individual condition is unchanged. The second
#    table shows a chain written worst-first, which collapses every score to a
#    single grade - a real bug, printed rather than described.

def grade_ternary(score):
    return score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : score >= 60 ? "D" : "F"

def grade_if(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    return "F"

def grade_misordered(score):
    return score >= 60 ? "D" : score >= 70 ? "C" : score >= 80 ? "B" : score >= 90 ? "A" : "F"

"score  ternary  if/elif  worst-first" => header
header^0
samples^+[100, 95, 90, 89, 80, 75, 70, 65, 60, 59, 0]
for s in samples:
    grade_ternary(s) => t
    grade_if(s) => i
    grade_misordered(s) => m
    ("  " + str(s) + "\t  " + t + "\t   " + i + "\t    " + m)^0

""^0
0 => agree
0 => checked
for s in [0:100]:
    checked + 1 => checked
    if grade_ternary(s) == grade_if(s):
        agree + 1 => agree
("Ternary chain vs if/elif chain: " + str(agree) + " of " + str(checked) + " scores agree.")^0

0 => misordered_wrong
for s in [0:100]:
    if grade_ternary(s) != grade_misordered(s):
        misordered_wrong + 1 => misordered_wrong
("Worst-first chain differs on " + str(misordered_wrong) + " of " + str(checked) + " scores.")^0
"Same conditions, same operator, different order - and it is wrong for every" => n1
n1^0
"score above 69, because `>= 60` swallows them all before the others are seen." => n2
n2^0

""^0
"Right-associativity, shown directly:" => h2
h2^0
False => a
True => c
(a ? "b" : c ? "d" : "e") => right_assoc
("  a=False, c=True:  a ? \"b\" : c ? \"d\" : \"e\"  ->  " + right_assoc)^0
"  Grouped as a ? \"b\" : (c ? \"d\" : \"e\"), so the result is \"d\"." => n3
n3^0
"  The other grouping, (a ? \"b\" : c) ? \"d\" : \"e\", would give \"e\" instead." => n4
n4^0
```

## Python (deterministic transpilation)

```python
def grade_ternary(score):
    return "A" if score >= 90 else "B" if score >= 80 else "C" if score >= 70 else "D" if score >= 60 else "F"

def grade_if(score):
    if score >= 90:
        return "A"
    if score >= 80:
        return "B"
    if score >= 70:
        return "C"
    if score >= 60:
        return "D"
    return "F"

def grade_misordered(score):
    return "D" if score >= 60 else "C" if score >= 70 else "B" if score >= 80 else "A" if score >= 90 else "F"

header = "score  ternary  if/elif  worst-first"
print(header)
samples = [100, 95, 90, 89, 80, 75, 70, 65, 60, 59, 0]
for s in samples:
    t = grade_ternary(s)
    i = grade_if(s)
    m = grade_misordered(s)
    print("  " + str(s) + "\t  " + t + "\t   " + i + "\t    " + m)
print("")
agree = 0
checked = 0
for s in range(0, 101):
    checked = checked + 1
    if grade_ternary(s) == grade_if(s):
        agree = agree + 1
print("Ternary chain vs if/elif chain: " + str(agree) + " of " + str(checked) + " scores agree.")
misordered_wrong = 0
for s in range(0, 101):
    if grade_ternary(s) != grade_misordered(s):
        misordered_wrong = misordered_wrong + 1
print("Worst-first chain differs on " + str(misordered_wrong) + " of " + str(checked) + " scores.")
n1 = "Same conditions, same operator, different order - and it is wrong for every"
print(n1)
n2 = "score above 69, because `>= 60` swallows them all before the others are seen."
print(n2)
print("")
h2 = "Right-associativity, shown directly:"
print(h2)
a = False
c = True
right_assoc = "b" if a else "d" if c else "e"
print("  a=False, c=True:  a ? \"b\" : c ? \"d\" : \"e\"  ->  " + right_assoc)
n3 = "  Grouped as a ? \"b\" : (c ? \"d\" : \"e\"), so the result is \"d\"."
print(n3)
n4 = "  The other grouping, (a ? \"b\" : c) ? \"d\" : \"e\", would give \"e\" instead."
print(n4)
```

## stdout (executed)

```text
score  ternary  if/elif  worst-first
  100	  A	   A	    D
  95	  A	   A	    D
  90	  A	   A	    D
  89	  B	   B	    D
  80	  B	   B	    D
  75	  C	   C	    D
  70	  C	   C	    D
  65	  D	   D	    D
  60	  D	   D	    D
  59	  F	   F	    F
  0	  F	   F	    F

Ternary chain vs if/elif chain: 101 of 101 scores agree.
Worst-first chain differs on 31 of 101 scores.
Same conditions, same operator, different order - and it is wrong for every
score above 69, because `>= 60` swallows them all before the others are seen.

Right-associativity, shown directly:
  a=False, c=True:  a ? "b" : c ? "d" : "e"  ->  d
  Grouped as a ? "b" : (c ? "d" : "e"), so the result is "d".
  The other grouping, (a ? "b" : c) ? "d" : "e", would give "e" instead.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
