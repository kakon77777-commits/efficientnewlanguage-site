<!-- canonical: efficientnewlanguage.org/ai/examples/351-validated-on-records-that-already-passed | ai_layer_version: 0.1.0 | updated: 2026-08-12 -->

# Example 351 — Validated on records that already passed — a clean run over real production data

`validated_on_records_that_already_passed.eml` runs a validator over the store it produced, and over the submissions that store came from.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A validator
# tested against ten thousand real records, with zero failures, because the
# only records in the database are the ones it accepted.
#
# "We ran it over production data" is the strongest-sounding sentence in a
# review, and when the data reached production THROUGH the thing being tested,
# it is close to the weakest. The sample is not a sample of the world. It is a
# picture of the filter.
#
# The program builds a store the ordinary way - submissions arrive, the
# validator admits some - and then runs the validator over the store and over
# the submissions it came from. Nothing is declared: both populations are
# measured, and the records the store can never contain are counted directly.

def validator(rec, strict):
    rec[1] => code
    if len(code) != 4:
        return 0
    if strict == 1:
        if code[0] == "Z":
            return 0
    return 1

def rule(rec):
    # what the specification actually requires
    rec[1] => code
    if len(code) != 4:
        return 0
    if code[0] == "Z":
        return 0
    return 1

[["s1", "AB12"], ["s2", "Z999"], ["s3", "QQ"], ["s4", "BC77"], ["s5", "Z100"], ["s6", "DDDD"], ["s7", "E1"], ["s8", "Z000"], ["s9", "FF34"], ["s10", "GG5"]] => submissions

# ---- the store, built by the lenient validator that is in production ----

[] => store
for s in submissions:
    if validator(s, 0) == 1:
        store + [s] => store

"submissions received : " + str(len(submissions)) ^0
"admitted to the store : " + str(len(store)) ^0
"" ^0

# ---- the reassuring run ----

"the lenient validator, re-run over the store it produced" ^0
0 => rejected_in_store
for r in store:
    if validator(r, 0) == 0:
        rejected_in_store + 1 => rejected_in_store
"  records rejected : " + str(rejected_in_store) + " of " + str(len(store)) ^0
if rejected_in_store == 0:
    "  a clean run over real production data" ^0
"" ^0

# ---- the same validator over what actually arrives ----

"the same validator, over the submissions" ^0
0 => rejected_in_subs
for s in submissions:
    if validator(s, 0) == 0:
        rejected_in_subs + 1 => rejected_in_subs
"  records rejected : " + str(rejected_in_subs) + " of " + str(len(submissions)) ^0
"" ^0

# ---- the validator is wrong, and neither run above can say so ----

"records the specification rejects and the validator admits" ^0
0 => wrong_in_store
for r in store:
    if rule(r) == 0:
        wrong_in_store + 1 => wrong_in_store
        "  in the store : " + r[0] + " code " + r[1] ^0
"  total in the store : " + str(wrong_in_store) ^0
"" ^0

# ---- what the store cannot contain ----

"outcomes reachable when the validator is run over the store" ^0
0 => accepts
0 => rejects
for r in store:
    if validator(r, 0) == 1:
        accepts + 1 => accepts
    else:
        rejects + 1 => rejects
"  accept branch : " + str(accepts) ^0
"  reject branch : " + str(rejects) ^0
"" ^0

"outcomes reachable when it is run over the submissions" ^0
0 => accepts2
0 => rejects2
for s in submissions:
    if validator(s, 0) == 1:
        accepts2 + 1 => accepts2
    else:
        rejects2 + 1 => rejects2
"  accept branch : " + str(accepts2) ^0
"  reject branch : " + str(rejects2) ^0
"" ^0

# ---- the corrected validator, judged by each population ----

"the strict validator, which implements the specification" ^0
0 => strict_rejects_store
for r in store:
    if validator(r, 1) == 0:
        strict_rejects_store + 1 => strict_rejects_store
0 => strict_rejects_subs
for s in submissions:
    if validator(s, 1) == 0:
        strict_rejects_subs + 1 => strict_rejects_subs
"  rejects, over the store       : " + str(strict_rejects_store) + " of " + str(len(store)) ^0
"  rejects, over the submissions : " + str(strict_rejects_subs) + " of " + str(len(submissions)) ^0
"" ^0

# ---- agreement between the two validators, on each population ----

0 => disagree_store
for r in store:
    if validator(r, 0) != validator(r, 1):
        disagree_store + 1 => disagree_store
0 => disagree_subs
for s in submissions:
    if validator(s, 0) != validator(s, 1):
        disagree_subs + 1 => disagree_subs
"the lenient and strict validators disagree about" ^0
"  records in the store       : " + str(disagree_store) + " of " + str(len(store)) ^0
"  incoming submissions       : " + str(disagree_subs) + " of " + str(len(submissions)) ^0
"" ^0

"Both populations are real. Only one of them contains anything the validator" ^0
"has not already had an opinion about, and it is not the one in the database." ^0
```

## Python (deterministic transpilation)

```python
def validator(rec, strict):
    code = rec[1]
    if len(code) != 4:
        return 0
    if strict == 1:
        if code[0] == "Z":
            return 0
    return 1

def rule(rec):
    code = rec[1]
    if len(code) != 4:
        return 0
    if code[0] == "Z":
        return 0
    return 1

submissions = [["s1", "AB12"], ["s2", "Z999"], ["s3", "QQ"], ["s4", "BC77"], ["s5", "Z100"], ["s6", "DDDD"], ["s7", "E1"], ["s8", "Z000"], ["s9", "FF34"], ["s10", "GG5"]]
store = []
for s in submissions:
    if validator(s, 0) == 1:
        store = store + [s]
print("submissions received : " + str(len(submissions)))
print("admitted to the store : " + str(len(store)))
print("")
print("the lenient validator, re-run over the store it produced")
rejected_in_store = 0
for r in store:
    if validator(r, 0) == 0:
        rejected_in_store = rejected_in_store + 1
print("  records rejected : " + str(rejected_in_store) + " of " + str(len(store)))
if rejected_in_store == 0:
    print("  a clean run over real production data")
print("")
print("the same validator, over the submissions")
rejected_in_subs = 0
for s in submissions:
    if validator(s, 0) == 0:
        rejected_in_subs = rejected_in_subs + 1
print("  records rejected : " + str(rejected_in_subs) + " of " + str(len(submissions)))
print("")
print("records the specification rejects and the validator admits")
wrong_in_store = 0
for r in store:
    if rule(r) == 0:
        wrong_in_store = wrong_in_store + 1
        print("  in the store : " + r[0] + " code " + r[1])
print("  total in the store : " + str(wrong_in_store))
print("")
print("outcomes reachable when the validator is run over the store")
accepts = 0
rejects = 0
for r in store:
    if validator(r, 0) == 1:
        accepts = accepts + 1
    else:
        rejects = rejects + 1
print("  accept branch : " + str(accepts))
print("  reject branch : " + str(rejects))
print("")
print("outcomes reachable when it is run over the submissions")
accepts2 = 0
rejects2 = 0
for s in submissions:
    if validator(s, 0) == 1:
        accepts2 = accepts2 + 1
    else:
        rejects2 = rejects2 + 1
print("  accept branch : " + str(accepts2))
print("  reject branch : " + str(rejects2))
print("")
print("the strict validator, which implements the specification")
strict_rejects_store = 0
for r in store:
    if validator(r, 1) == 0:
        strict_rejects_store = strict_rejects_store + 1
strict_rejects_subs = 0
for s in submissions:
    if validator(s, 1) == 0:
        strict_rejects_subs = strict_rejects_subs + 1
print("  rejects, over the store       : " + str(strict_rejects_store) + " of " + str(len(store)))
print("  rejects, over the submissions : " + str(strict_rejects_subs) + " of " + str(len(submissions)))
print("")
disagree_store = 0
for r in store:
    if validator(r, 0) != validator(r, 1):
        disagree_store = disagree_store + 1
disagree_subs = 0
for s in submissions:
    if validator(s, 0) != validator(s, 1):
        disagree_subs = disagree_subs + 1
print("the lenient and strict validators disagree about")
print("  records in the store       : " + str(disagree_store) + " of " + str(len(store)))
print("  incoming submissions       : " + str(disagree_subs) + " of " + str(len(submissions)))
print("")
print("Both populations are real. Only one of them contains anything the validator")
print("has not already had an opinion about, and it is not the one in the database.")
```

## stdout (executed)

```text
submissions received : 10
admitted to the store : 7

the lenient validator, re-run over the store it produced
  records rejected : 0 of 7
  a clean run over real production data

the same validator, over the submissions
  records rejected : 3 of 10

records the specification rejects and the validator admits
  in the store : s2 code Z999
  in the store : s5 code Z100
  in the store : s8 code Z000
  total in the store : 3

outcomes reachable when the validator is run over the store
  accept branch : 7
  reject branch : 0

outcomes reachable when it is run over the submissions
  accept branch : 7
  reject branch : 3

the strict validator, which implements the specification
  rejects, over the store       : 3 of 7
  rejects, over the submissions : 6 of 10

the lenient and strict validators disagree about
  records in the store       : 3 of 7
  incoming submissions       : 3 of 10

Both populations are real. Only one of them contains anything the validator
has not already had an opinion about, and it is not the one in the database.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
