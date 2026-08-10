<!-- canonical: efficientnewlanguage.org/ai/examples/321-commuting-until-a-third-step-arrives | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 321 — Commuting until a third step arrives — the pair was interchangeable, the pipeline stopped it being a pair

`commuting_until_a_third_step_arrives.eml` measures whether two steps commute, then measures the same two steps with one more placed between them.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Two steps that
# commute, measured on every input, and stop commuting the moment a third step
# is placed between them.
#
# "These two are independent, the order does not matter" is a real conclusion
# people reach honestly, by trying both orders and getting the same answer. It
# is true of the pair. It is not a property the pair keeps.
#
# Commutativity is a statement about two functions applied ADJACENTLY. Nothing
# in it survives interposition, and interposition is what a pipeline does for a
# living: someone adds a step, puts it "in the middle where it belongs", and
# the two neighbours that were interchangeable yesterday are now ordered - with
# no diff on either of them, and no test that names the pair.
#
# Nothing here declares which orders agree. The pair's commutativity and its
# loss are both read off exhaustive runs over the same inputs.

def cap_at_100(x):
    if x > 100:
        return 100
    return x

def floor_at_0(x):
    if x < 0:
        return 0
    return x

def double(x):
    return x * 2

def step(name, x):
    if name == "cap":
        return cap_at_100(x)
    if name == "floor":
        return floor_at_0(x)
    return double(x)

def run_seq(seq, x):
    x => v
    for s in seq:
        step(s, v) => v
    return v

[0 - 30, 0 - 1, 0, 7, 60, 99, 100, 140, 400] => inputs

# ---- the pair, adjacent ----

"the pair, applied adjacently, over every input" ^0
0 => pair_diffs
[] => pair_witness
for x in inputs:
    run_seq(["cap", "floor"], x) => ab
    run_seq(["floor", "cap"], x) => ba
    if ab != ba:
        pair_diffs + 1 => pair_diffs
        if len(pair_witness) == 0:
            [x, ab, ba] => pair_witness
"  inputs where cap;floor != floor;cap : " + str(pair_diffs) + " of " + str(len(inputs)) ^0
if pair_diffs == 0:
    "  the two steps commute" ^0
else:
    "  the two steps do NOT commute" ^0
"" ^0

# ---- a third step, placed between them ----

"the same pair with double() interposed" ^0
0 => interposed_diffs
[] => witness
for x in inputs:
    run_seq(["cap", "double", "floor"], x) => acb
    run_seq(["floor", "double", "cap"], x) => bca
    if acb != bca:
        interposed_diffs + 1 => interposed_diffs
        if len(witness) == 0:
            [x, acb, bca] => witness
"  inputs where cap;double;floor != floor;double;cap : " + str(interposed_diffs) + " of " + str(len(inputs)) ^0
"" ^0

if len(witness) > 0:
    "witness" ^0
    "  x                    = " + str(witness[0]) ^0
    "  cap; double; floor   = " + str(witness[1]) ^0
    "  floor; double; cap   = " + str(witness[2]) ^0
    "" ^0

# ---- every arrangement of the three ----

[["cap", "floor", "double"], ["cap", "double", "floor"], ["floor", "cap", "double"], ["floor", "double", "cap"], ["double", "cap", "floor"], ["double", "floor", "cap"]] => orders

"every arrangement of the three steps, per input" ^0
0 => inputs_that_split
for x in inputs:
    [] => answers
    for o in orders:
        run_seq(o, x) => v
        if v in answers:
            pass
        else:
            answers + [v] => answers
    if len(answers) > 1:
        inputs_that_split + 1 => inputs_that_split
        "  x = " + str(x) + " -> distinct answers " + repr(answers) ^0
"" ^0
"inputs where arrangement changes the answer: " + str(inputs_that_split) + " of " + str(len(inputs)) ^0
"" ^0

# ---- the pair is still adjacent in two of the six ----

"the two arrangements where cap and floor are still ADJACENT" ^0
0 => adjacent_diffs
for x in inputs:
    run_seq(["cap", "floor", "double"], x) => a
    run_seq(["floor", "cap", "double"], x) => b
    if a != b:
        adjacent_diffs + 1 => adjacent_diffs
"  inputs where cap;floor;double != floor;cap;double : " + str(adjacent_diffs) ^0
"" ^0
"Adjacent, the pair still commutes. Separated by one step, it does not." ^0
"The property belonged to the pair, not to either function, and a pipeline" ^0
"is free to stop the pair being a pair." ^0
```

## Python (deterministic transpilation)

```python
def cap_at_100(x):
    if x > 100:
        return 100
    return x

def floor_at_0(x):
    if x < 0:
        return 0
    return x

def double(x):
    return x * 2

def step(name, x):
    if name == "cap":
        return cap_at_100(x)
    if name == "floor":
        return floor_at_0(x)
    return double(x)

def run_seq(seq, x):
    v = x
    for s in seq:
        v = step(s, v)
    return v

inputs = [0 - 30, 0 - 1, 0, 7, 60, 99, 100, 140, 400]
print("the pair, applied adjacently, over every input")
pair_diffs = 0
pair_witness = []
for x in inputs:
    ab = run_seq(["cap", "floor"], x)
    ba = run_seq(["floor", "cap"], x)
    if ab != ba:
        pair_diffs = pair_diffs + 1
        if len(pair_witness) == 0:
            pair_witness = [x, ab, ba]
print("  inputs where cap;floor != floor;cap : " + str(pair_diffs) + " of " + str(len(inputs)))
if pair_diffs == 0:
    print("  the two steps commute")
else:
    print("  the two steps do NOT commute")
print("")
print("the same pair with double() interposed")
interposed_diffs = 0
witness = []
for x in inputs:
    acb = run_seq(["cap", "double", "floor"], x)
    bca = run_seq(["floor", "double", "cap"], x)
    if acb != bca:
        interposed_diffs = interposed_diffs + 1
        if len(witness) == 0:
            witness = [x, acb, bca]
print("  inputs where cap;double;floor != floor;double;cap : " + str(interposed_diffs) + " of " + str(len(inputs)))
print("")
if len(witness) > 0:
    print("witness")
    print("  x                    = " + str(witness[0]))
    print("  cap; double; floor   = " + str(witness[1]))
    print("  floor; double; cap   = " + str(witness[2]))
    print("")
orders = [["cap", "floor", "double"], ["cap", "double", "floor"], ["floor", "cap", "double"], ["floor", "double", "cap"], ["double", "cap", "floor"], ["double", "floor", "cap"]]
print("every arrangement of the three steps, per input")
inputs_that_split = 0
for x in inputs:
    answers = []
    for o in orders:
        v = run_seq(o, x)
        if v in answers:
            pass
        else:
            answers = answers + [v]
    if len(answers) > 1:
        inputs_that_split = inputs_that_split + 1
        print("  x = " + str(x) + " -> distinct answers " + repr(answers))
print("")
print("inputs where arrangement changes the answer: " + str(inputs_that_split) + " of " + str(len(inputs)))
print("")
print("the two arrangements where cap and floor are still ADJACENT")
adjacent_diffs = 0
for x in inputs:
    a = run_seq(["cap", "floor", "double"], x)
    b = run_seq(["floor", "cap", "double"], x)
    if a != b:
        adjacent_diffs = adjacent_diffs + 1
print("  inputs where cap;floor;double != floor;cap;double : " + str(adjacent_diffs))
print("")
print("Adjacent, the pair still commutes. Separated by one step, it does not.")
print("The property belonged to the pair, not to either function, and a pipeline")
print("is free to stop the pair being a pair.")
```

## stdout (executed)

```text
the pair, applied adjacently, over every input
  inputs where cap;floor != floor;cap : 0 of 9
  the two steps commute

the same pair with double() interposed
  inputs where cap;double;floor != floor;double;cap : 5 of 9

witness
  x                    = 60
  cap; double; floor   = 120
  floor; double; cap   = 100

every arrangement of the three steps, per input
  x = 60 -> distinct answers [120, 100]
  x = 99 -> distinct answers [198, 100]
  x = 100 -> distinct answers [200, 100]
  x = 140 -> distinct answers [200, 100]
  x = 400 -> distinct answers [200, 100]

inputs where arrangement changes the answer: 5 of 9

the two arrangements where cap and floor are still ADJACENT
  inputs where cap;floor;double != floor;cap;double : 0

Adjacent, the pair still commutes. Separated by one step, it does not.
The property belonged to the pair, not to either function, and a pipeline
is free to stop the pair being a pair.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
