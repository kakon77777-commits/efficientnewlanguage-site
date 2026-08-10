<!-- canonical: efficientnewlanguage.org/ai/examples/322-coverage-through-one-caller-is-not-coverage | ai_layer_version: 0.1.0 | updated: 2026-08-10 -->

# Example 322 — Coverage through one caller is not coverage — half the helper has never run

`coverage_through_one_caller_is_not_coverage.eml` instruments a four-branch helper with a hit counter and runs it from two callers.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A helper with no
# tests of its own, fully exercised by the only caller that existed, and half
# of it has never run.
#
# The helper is covered - genuinely, not nominally. Every test of caller A
# passes through it, and caller A's own coverage is complete: every line of
# caller A runs. What that does not establish is that every line of the HELPER
# runs, because coverage flows through the caller's input space and the caller
# does not produce every input the helper accepts.
#
# One of the unreached branches is wrong. It has been wrong since it was
# written. No test failed, because no test reached it, because the only caller
# could not produce a value that would.
#
# The branch counter is a list handed to the helper, and the helper mutates it.
# That is not a trick: `=>` binds a name to a value, and for a list the callee
# and the caller hold the same object, so a count incremented inside is visible
# outside. Axis 15 of this project measures exactly that property.

def classify(x, hits):
    if x < 0:
        hits[0] + 1 => hits[0]
        return "refund"
    if x == 0:
        hits[1] + 1 => hits[1]
        return "refund"
    if x < 100:
        hits[2] + 1 => hits[2]
        return "small"
    hits[3] + 1 => hits[3]
    return "large"

def run_caller(values, hits):
    [] => labels
    for v in values:
        labels + [classify(v, hits)] => labels
    return labels

def zero_hits():
    return [0, 0, 0, 0]

["negative", "zero    ", "small   ", "large   "] => branch_names

# caller A: line totals from a catalogue. Prices are positive, so are quantities.
[12, 250, 40, 999, 5, 130] => caller_a_values

# caller B: ledger adjustments, added later. Credits are negative; a zeroed
# line is a cancellation.
[12, 0 - 40, 0, 250, 0 - 5, 0] => caller_b_values

zero_hits() => hits_a
run_caller(caller_a_values, hits_a) => labels_a
zero_hits() => hits_b
run_caller(caller_b_values, hits_b) => labels_b

"branch hits, per caller" ^0
"  branch      caller A   caller B" ^0
for i in [0:3]:
    "  " + branch_names[i] + "    " + str(hits_a[i]) + "          " + str(hits_b[i]) ^0
"" ^0

0 => unreached_by_a
for i in [0:3]:
    if hits_a[i] == 0:
        unreached_by_a + 1 => unreached_by_a
"branches never reached through caller A: " + str(unreached_by_a) + " of " + str(len(branch_names)) ^0
"(caller A's own lines all run - that is the premise of the scenario, not" ^0
"a number this program measures)" ^0
"" ^0

# ---- the defect that lived in the unreached half ----

"labels produced" ^0
"  caller A : " + repr(labels_a) ^0
"  caller B : " + repr(labels_b) ^0
"" ^0

"a zero line is a cancellation, not a refund" ^0
0 => mislabelled
for i in [0:len(caller_b_values) - 1]:
    if caller_b_values[i] == 0:
        if labels_b[i] == "refund":
            mislabelled + 1 => mislabelled
"  zero lines labelled 'refund': " + str(mislabelled) ^0
0 => a_zero_lines
for v in caller_a_values:
    if v == 0:
        a_zero_lines + 1 => a_zero_lines
"  zero lines caller A can produce: " + str(a_zero_lines) ^0
"" ^0

# ---- what a test suite built from caller A would report ----

"a suite built from caller A's inputs" ^0
"  helper branches it exercises : " + str(len(branch_names) - unreached_by_a) + " of " + str(len(branch_names)) ^0
"  defects in the branches it exercises : 0" ^0
"  defects in the branches it does not  : 1" ^0
"" ^0
"Coverage is a property of a PATH from a caller's inputs to a line. Reporting" ^0
"it against the caller answers 'did we run all of caller A', and the helper is" ^0
"only covered to the extent caller A's inputs happen to reach it. A second" ^0
"caller does not add lines - it adds reachability." ^0
```

## Python (deterministic transpilation)

```python
def classify(x, hits):
    if x < 0:
        hits[0] = hits[0] + 1
        return "refund"
    if x == 0:
        hits[1] = hits[1] + 1
        return "refund"
    if x < 100:
        hits[2] = hits[2] + 1
        return "small"
    hits[3] = hits[3] + 1
    return "large"

def run_caller(values, hits):
    labels = []
    for v in values:
        labels = labels + [classify(v, hits)]
    return labels

def zero_hits():
    return [0, 0, 0, 0]

branch_names = ["negative", "zero    ", "small   ", "large   "]
caller_a_values = [12, 250, 40, 999, 5, 130]
caller_b_values = [12, 0 - 40, 0, 250, 0 - 5, 0]
hits_a = zero_hits()
labels_a = run_caller(caller_a_values, hits_a)
hits_b = zero_hits()
labels_b = run_caller(caller_b_values, hits_b)
print("branch hits, per caller")
print("  branch      caller A   caller B")
for i in range(0, 4):
    print("  " + branch_names[i] + "    " + str(hits_a[i]) + "          " + str(hits_b[i]))
print("")
unreached_by_a = 0
for i in range(0, 4):
    if hits_a[i] == 0:
        unreached_by_a = unreached_by_a + 1
print("branches never reached through caller A: " + str(unreached_by_a) + " of " + str(len(branch_names)))
print("(caller A's own lines all run - that is the premise of the scenario, not")
print("a number this program measures)")
print("")
print("labels produced")
print("  caller A : " + repr(labels_a))
print("  caller B : " + repr(labels_b))
print("")
print("a zero line is a cancellation, not a refund")
mislabelled = 0
for i in range(0, len(caller_b_values)):
    if caller_b_values[i] == 0:
        if labels_b[i] == "refund":
            mislabelled = mislabelled + 1
print("  zero lines labelled 'refund': " + str(mislabelled))
a_zero_lines = 0
for v in caller_a_values:
    if v == 0:
        a_zero_lines = a_zero_lines + 1
print("  zero lines caller A can produce: " + str(a_zero_lines))
print("")
print("a suite built from caller A's inputs")
print("  helper branches it exercises : " + str(len(branch_names) - unreached_by_a) + " of " + str(len(branch_names)))
print("  defects in the branches it exercises : 0")
print("  defects in the branches it does not  : 1")
print("")
print("Coverage is a property of a PATH from a caller's inputs to a line. Reporting")
print("it against the caller answers 'did we run all of caller A', and the helper is")
print("only covered to the extent caller A's inputs happen to reach it. A second")
print("caller does not add lines - it adds reachability.")
```

## stdout (executed)

```text
branch hits, per caller
  branch      caller A   caller B
  negative    0          2
  zero        0          2
  small       3          1
  large       3          1

branches never reached through caller A: 2 of 4
(caller A's own lines all run - that is the premise of the scenario, not
a number this program measures)

labels produced
  caller A : ['small', 'large', 'small', 'large', 'small', 'large']
  caller B : ['small', 'refund', 'refund', 'large', 'refund', 'refund']

a zero line is a cancellation, not a refund
  zero lines labelled 'refund': 2
  zero lines caller A can produce: 0

a suite built from caller A's inputs
  helper branches it exercises : 2 of 4
  defects in the branches it exercises : 0
  defects in the branches it does not  : 1

Coverage is a property of a PATH from a caller's inputs to a line. Reporting
it against the caller answers 'did we run all of caller A', and the helper is
only covered to the extent caller A's inputs happen to reach it. A second
caller does not add lines - it adds reachability.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
