<!-- canonical: efficientnewlanguage.org/ai/examples/370-the-verifier-reran-the-fixers-script | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 370 — The verifier reran the fixer's script — 0 escapes, and 9 inputs never seen

`the_verifier_reran_the_fixers_script.eml` runs three input sets against the same repair and counts what each can find.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An independent
# re-verification that runs on the fixer's inputs.
#
# The process is right: the person who wrote the fix does not get to say it is
# fixed. Somebody else re-runs it and confirms. What the process does not say
# is where the second person gets their INPUTS, and the convenient answer is
# the script that came attached to the fix.
#
# At that point the verification is independent in every respect except the one
# that matters. The fixer chose those inputs while looking at the fix, so they
# are exactly the inputs the fix handles.
#
# Nothing is declared. Three input sets are run against the same repair and the
# escapes are counted; the overlap between the sets is computed rather than
# assumed.

def rule(code):
    # a valid code is four characters and does not start with Z, in either case
    if len(code) != 4:
        return 0
    if code[0] == "Z":
        return 0
    if code[0] == "z":
        return 0
    return 1

def validator(code, repaired):
    # the repair rejects the uppercase form only - which is every example the
    # fixer had in front of them while writing it
    if len(code) != 4:
        return 0
    if repaired == 1:
        if code[0] == "Z":
            return 0
    return 1

# the inputs the fixer attached to the fix
["AB12", "Z999", "QQ", "Z100"] => fixers_inputs

# the verifier adds a couple of their own, drawn from the same place
["AB12", "Z999", "QQ", "Z100", "CD34", "Z777"] => verifier_extended

# inputs generated without looking at the fix: every shape the rule mentions
["AB12", "Z999", "QQ", "Z100", "CD34", "Z777", "zz99", "AB1", "ABCDE", "", "0000", "Zabc", "aZ12"] => independent

def escapes(inputs, repaired):
    0 => n
    for c in inputs:
        if validator(c, repaired) != rule(c):
            n + 1 => n
    return n

# ---- the three verifications ----

"escapes found, against the repaired validator" ^0
"  the fixer's own inputs      : " + str(escapes(fixers_inputs, 1)) + " of " + str(len(fixers_inputs)) ^0
"  the fixer's inputs plus two : " + str(escapes(verifier_extended, 1)) + " of " + str(len(verifier_extended)) ^0
"  independently generated     : " + str(escapes(independent, 1)) + " of " + str(len(independent)) ^0
"" ^0

"the same three sets against the UNrepaired validator" ^0
"  the fixer's own inputs      : " + str(escapes(fixers_inputs, 0)) + " of " + str(len(fixers_inputs)) ^0
"  the fixer's inputs plus two : " + str(escapes(verifier_extended, 0)) + " of " + str(len(verifier_extended)) ^0
"  independently generated     : " + str(escapes(independent, 0)) + " of " + str(len(independent)) ^0
"" ^0

# ---- what escapes, and where it came from ----

"inputs the repaired validator still gets wrong" ^0
for c in independent:
    if validator(c, 1) != rule(c):
        0 => in_fixers
        for f in fixers_inputs:
            if f == c:
                1 => in_fixers
        if in_fixers == 1:
            "  " + repr(c) + " : escaped, and it WAS in the fixer's set" ^0
        else:
            "  " + repr(c) + " : escaped, and it was not in the fixer's set" ^0
"" ^0

# ---- how much of the independent set the fixer's set covers ----

0 => shared
for c in independent:
    for f in fixers_inputs:
        if f == c:
            shared + 1 => shared
"input coverage" ^0
"  independently generated inputs : " + str(len(independent)) ^0
"  of those, present in the fixer's set : " + str(shared) ^0
"  inputs the verifier would never see if reusing the script : " + str(len(independent) - shared) ^0
"" ^0

# ---- adding more inputs from the same source does not help ----
#
# The two the verifier added are the same SHAPE as the fixer's. Measure how
# many new escapes they buy.

escapes(fixers_inputs, 1) => base
escapes(verifier_extended, 1) => extended
"new escapes bought by adding two inputs of the same shape : " + str(extended - base) ^0
escapes(independent, 1) => indep
"new escapes bought by generating inputs from the rule     : " + str(indep - base) ^0
"" ^0

# ---- and the control: a set that should find nothing ----
#
# Run the independent set against a validator that implements the rule exactly.
# If that reports escapes, the harness is inventing them.

def validator_correct(code):
    return rule(code)

0 => control
for c in independent:
    if validator_correct(c) != rule(c):
        control + 1 => control
"control: the independent set against a correct validator : " + str(control) ^0
if control == 0:
    "  the set reports nothing when there is nothing, so its other counts mean something" ^0
"" ^0

"Re-running somebody else's script is an independent execution of a dependent" ^0
"choice. The execution was never the part at risk." ^0
```

## Python (deterministic transpilation)

```python
def rule(code):
    if len(code) != 4:
        return 0
    if code[0] == "Z":
        return 0
    if code[0] == "z":
        return 0
    return 1

def validator(code, repaired):
    if len(code) != 4:
        return 0
    if repaired == 1:
        if code[0] == "Z":
            return 0
    return 1

fixers_inputs = ["AB12", "Z999", "QQ", "Z100"]
verifier_extended = ["AB12", "Z999", "QQ", "Z100", "CD34", "Z777"]
independent = ["AB12", "Z999", "QQ", "Z100", "CD34", "Z777", "zz99", "AB1", "ABCDE", "", "0000", "Zabc", "aZ12"]

def escapes(inputs, repaired):
    n = 0
    for c in inputs:
        if validator(c, repaired) != rule(c):
            n = n + 1
    return n

print("escapes found, against the repaired validator")
print("  the fixer's own inputs      : " + str(escapes(fixers_inputs, 1)) + " of " + str(len(fixers_inputs)))
print("  the fixer's inputs plus two : " + str(escapes(verifier_extended, 1)) + " of " + str(len(verifier_extended)))
print("  independently generated     : " + str(escapes(independent, 1)) + " of " + str(len(independent)))
print("")
print("the same three sets against the UNrepaired validator")
print("  the fixer's own inputs      : " + str(escapes(fixers_inputs, 0)) + " of " + str(len(fixers_inputs)))
print("  the fixer's inputs plus two : " + str(escapes(verifier_extended, 0)) + " of " + str(len(verifier_extended)))
print("  independently generated     : " + str(escapes(independent, 0)) + " of " + str(len(independent)))
print("")
print("inputs the repaired validator still gets wrong")
for c in independent:
    if validator(c, 1) != rule(c):
        in_fixers = 0
        for f in fixers_inputs:
            if f == c:
                in_fixers = 1
        if in_fixers == 1:
            print("  " + repr(c) + " : escaped, and it WAS in the fixer's set")
        else:
            print("  " + repr(c) + " : escaped, and it was not in the fixer's set")
print("")
shared = 0
for c in independent:
    for f in fixers_inputs:
        if f == c:
            shared = shared + 1
print("input coverage")
print("  independently generated inputs : " + str(len(independent)))
print("  of those, present in the fixer's set : " + str(shared))
print("  inputs the verifier would never see if reusing the script : " + str(len(independent) - shared))
print("")
base = escapes(fixers_inputs, 1)
extended = escapes(verifier_extended, 1)
print("new escapes bought by adding two inputs of the same shape : " + str(extended - base))
indep = escapes(independent, 1)
print("new escapes bought by generating inputs from the rule     : " + str(indep - base))
print("")

def validator_correct(code):
    return rule(code)

control = 0
for c in independent:
    if validator_correct(c) != rule(c):
        control = control + 1
print("control: the independent set against a correct validator : " + str(control))
if control == 0:
    print("  the set reports nothing when there is nothing, so its other counts mean something")
print("")
print("Re-running somebody else's script is an independent execution of a dependent")
print("choice. The execution was never the part at risk.")
```

## stdout (executed)

```text
escapes found, against the repaired validator
  the fixer's own inputs      : 0 of 4
  the fixer's inputs plus two : 0 of 6
  independently generated     : 1 of 13

the same three sets against the UNrepaired validator
  the fixer's own inputs      : 2 of 4
  the fixer's inputs plus two : 3 of 6
  independently generated     : 5 of 13

inputs the repaired validator still gets wrong
  'zz99' : escaped, and it was not in the fixer's set

input coverage
  independently generated inputs : 13
  of those, present in the fixer's set : 4
  inputs the verifier would never see if reusing the script : 9

new escapes bought by adding two inputs of the same shape : 0
new escapes bought by generating inputs from the rule     : 1

control: the independent set against a correct validator : 0
  the set reports nothing when there is nothing, so its other counts mean something

Re-running somebody else's script is an independent execution of a dependent
choice. The execution was never the part at risk.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
