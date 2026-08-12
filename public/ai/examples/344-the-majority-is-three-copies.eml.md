<!-- canonical: efficientnewlanguage.org/ai/examples/344-the-majority-is-three-copies | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 344 — The majority is three copies — 4 members, 2 opinions

`the_majority_is_three_copies.eml` puts four implementations to a vote and measures how much evidence the vote actually contains.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Four
# implementations vote. Three of them are one implementation.
#
# A is the original. B and C are ports of A into two other services - real
# code, written by real people, in different languages, months apart, and each
# one written by reading A. D was written from the specification.
#
# On the disputed input the vote is three to one. Nobody involved is being
# careless: a majority of independent implementations IS good evidence. The
# question is how many independent implementations there are, and counting the
# files is not how you find out.
#
# The program measures the ensemble's SIZE and its RANK: how many members it
# has, and how many distinct behaviours those members produce. Nothing is
# declared - the lineage is inferred from the answers, not from the comments.

def tier_a(amount):
    if amount > 500:
        return 3
    if amount > 100:
        return 2
    return 1

def tier_b(amount):
    3 => t
    if amount <= 500:
        2 => t
    if amount <= 100:
        1 => t
    return t

def tier_c(amount):
    [100, 500] => bounds
    1 => t
    for b in bounds:
        if amount > b:
            t + 1 => t
    return t

def tier_d(amount):
    if amount >= 500:
        return 3
    if amount >= 100:
        return 2
    return 1

def vote(amount):
    [tier_a(amount), tier_b(amount), tier_c(amount), tier_d(amount)] => answers
    [] => seen
    [] => counts
    for a in answers:
        0 => hit
        0 => i
        for s in seen:
            if s == a:
                counts[i] + 1 => counts[i]
                1 => hit
            i + 1 => i
        if hit == 0:
            seen + [a] => seen
            counts + [1] => counts
    max(counts) => best
    0 => i
    for c in counts:
        if c == best:
            return seen[i]
        i + 1 => i
    return 0 - 1

[40, 99, 100, 101, 250, 499, 500, 501, 900] => amounts
["A original", "B port", "C port", "D from the spec"] => names

# ---- the ensemble, input by input ----

"amount   A  B  C  D   majority   spec" ^0
0 => majority_wrong
for m in amounts:
    tier_a(m) => a
    tier_b(m) => b
    tier_c(m) => c
    tier_d(m) => d
    vote(m) => v
    if v != d:
        majority_wrong + 1 => majority_wrong
    "  " + str(m) + "     " + str(a) + "  " + str(b) + "  " + str(c) + "  " + str(d) + "     " + str(v) + "         " + str(d) ^0
"  inputs where the majority differs from the specification: " + str(majority_wrong) ^0
"" ^0

# ---- how many distinct behaviours are in the ensemble ----

"agreement between every pair of members" ^0
[0, 1, 2, 3] => idx
0 => identical_pairs
for i in idx:
    for j in idx:
        if j > i:
            0 => same
            for m in amounts:
                [tier_a(m), tier_b(m), tier_c(m), tier_d(m)] => row
                if row[i] == row[j]:
                    same + 1 => same
            if same == len(amounts):
                identical_pairs + 1 => identical_pairs
                "  " + names[i] + " and " + names[j] + " : identical on all " + str(len(amounts)) + " inputs" ^0
            else:
                "  " + names[i] + " and " + names[j] + " : differ on " + str(len(amounts) - same) ^0
"  pairs that never differ : " + str(identical_pairs) ^0
"" ^0

# ---- size against rank ----

[] => behaviours
for i in idx:
    "" => sig
    for m in amounts:
        [tier_a(m), tier_b(m), tier_c(m), tier_d(m)] => row
        sig + str(row[i]) => sig
    0 => known
    for b in behaviours:
        if b == sig:
            1 => known
    if known == 0:
        behaviours + [sig] => behaviours
"the ensemble" ^0
"  members            : " + str(len(idx)) ^0
"  distinct behaviours : " + str(len(behaviours)) ^0
"  a vote among " + str(len(idx)) + " members carries " + str(len(behaviours)) + " opinions" ^0
"" ^0

# ---- the same vote, one voice per distinct behaviour ----

"one vote per distinct behaviour, on the disputed inputs" ^0
0 => resolved
0 => tied
for m in amounts:
    tier_a(m) => a
    tier_d(m) => d
    if a != d:
        tied + 1 => tied
        "  amount " + str(m) + " : behaviour 1 says " + str(a) + ", behaviour 2 says " + str(d) + " - tied" ^0
    else:
        resolved + 1 => resolved
"  inputs where the two behaviours agree    : " + str(resolved) ^0
"  inputs where they tie, with no majority  : " + str(tied) ^0
"" ^0

"Counting implementations counts files. The evidence in an ensemble is the" ^0
"number of times somebody read the specification, and that number is not" ^0
"written down anywhere in the code." ^0
```

## Python (deterministic transpilation)

```python
def tier_a(amount):
    if amount > 500:
        return 3
    if amount > 100:
        return 2
    return 1

def tier_b(amount):
    t = 3
    if amount <= 500:
        t = 2
    if amount <= 100:
        t = 1
    return t

def tier_c(amount):
    bounds = [100, 500]
    t = 1
    for b in bounds:
        if amount > b:
            t = t + 1
    return t

def tier_d(amount):
    if amount >= 500:
        return 3
    if amount >= 100:
        return 2
    return 1

def vote(amount):
    answers = [tier_a(amount), tier_b(amount), tier_c(amount), tier_d(amount)]
    seen = []
    counts = []
    for a in answers:
        hit = 0
        i = 0
        for s in seen:
            if s == a:
                counts[i] = counts[i] + 1
                hit = 1
            i = i + 1
        if hit == 0:
            seen = seen + [a]
            counts = counts + [1]
    best = max(counts)
    i = 0
    for c in counts:
        if c == best:
            return seen[i]
        i = i + 1
    return 0 - 1

amounts = [40, 99, 100, 101, 250, 499, 500, 501, 900]
names = ["A original", "B port", "C port", "D from the spec"]
print("amount   A  B  C  D   majority   spec")
majority_wrong = 0
for m in amounts:
    a = tier_a(m)
    b = tier_b(m)
    c = tier_c(m)
    d = tier_d(m)
    v = vote(m)
    if v != d:
        majority_wrong = majority_wrong + 1
    print("  " + str(m) + "     " + str(a) + "  " + str(b) + "  " + str(c) + "  " + str(d) + "     " + str(v) + "         " + str(d))
print("  inputs where the majority differs from the specification: " + str(majority_wrong))
print("")
print("agreement between every pair of members")
idx = [0, 1, 2, 3]
identical_pairs = 0
for i in idx:
    for j in idx:
        if j > i:
            same = 0
            for m in amounts:
                row = [tier_a(m), tier_b(m), tier_c(m), tier_d(m)]
                if row[i] == row[j]:
                    same = same + 1
            if same == len(amounts):
                identical_pairs = identical_pairs + 1
                print("  " + names[i] + " and " + names[j] + " : identical on all " + str(len(amounts)) + " inputs")
            else:
                print("  " + names[i] + " and " + names[j] + " : differ on " + str(len(amounts) - same))
print("  pairs that never differ : " + str(identical_pairs))
print("")
behaviours = []
for i in idx:
    sig = ""
    for m in amounts:
        row = [tier_a(m), tier_b(m), tier_c(m), tier_d(m)]
        sig = sig + str(row[i])
    known = 0
    for b in behaviours:
        if b == sig:
            known = 1
    if known == 0:
        behaviours = behaviours + [sig]
print("the ensemble")
print("  members            : " + str(len(idx)))
print("  distinct behaviours : " + str(len(behaviours)))
print("  a vote among " + str(len(idx)) + " members carries " + str(len(behaviours)) + " opinions")
print("")
print("one vote per distinct behaviour, on the disputed inputs")
resolved = 0
tied = 0
for m in amounts:
    a = tier_a(m)
    d = tier_d(m)
    if a != d:
        tied = tied + 1
        print("  amount " + str(m) + " : behaviour 1 says " + str(a) + ", behaviour 2 says " + str(d) + " - tied")
    else:
        resolved = resolved + 1
print("  inputs where the two behaviours agree    : " + str(resolved))
print("  inputs where they tie, with no majority  : " + str(tied))
print("")
print("Counting implementations counts files. The evidence in an ensemble is the")
print("number of times somebody read the specification, and that number is not")
print("written down anywhere in the code.")
```

## stdout (executed)

```text
amount   A  B  C  D   majority   spec
  40     1  1  1  1     1         1
  99     1  1  1  1     1         1
  100     1  1  1  2     1         2
  101     2  2  2  2     2         2
  250     2  2  2  2     2         2
  499     2  2  2  2     2         2
  500     2  2  2  3     2         3
  501     3  3  3  3     3         3
  900     3  3  3  3     3         3
  inputs where the majority differs from the specification: 2

agreement between every pair of members
  A original and B port : identical on all 9 inputs
  A original and C port : identical on all 9 inputs
  A original and D from the spec : differ on 2
  B port and C port : identical on all 9 inputs
  B port and D from the spec : differ on 2
  C port and D from the spec : differ on 2
  pairs that never differ : 3

the ensemble
  members            : 4
  distinct behaviours : 2
  a vote among 4 members carries 2 opinions

one vote per distinct behaviour, on the disputed inputs
  amount 100 : behaviour 1 says 1, behaviour 2 says 2 - tied
  amount 500 : behaviour 1 says 2, behaviour 2 says 3 - tied
  inputs where the two behaviours agree    : 7
  inputs where they tie, with no majority  : 2

Counting implementations counts files. The evidence in an ensemble is the
number of times somebody read the specification, and that number is not
written down anywhere in the code.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
