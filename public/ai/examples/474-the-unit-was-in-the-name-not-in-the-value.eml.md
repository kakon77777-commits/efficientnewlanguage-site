<!-- canonical: efficientnewlanguage.org/ai/examples/474-the-unit-was-in-the-name-not-in-the-value | ai_layer_version: 0.1.0 | updated: 2026-08-20 -->

# Example 474 — The unit was in the name not in the value

`the_unit_was_in_the_name_not_in_the_value.eml` - Every field carries its unit in its name. How many of the arithmetic sites check that name is computed below.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Every field
# carries its unit in its name. How many of the arithmetic sites check that
# name is computed below.
#
# Putting the unit in the name is a real discipline and it works. A reader of
# `timeout_ms` knows what the number is, review catches a mismatch on sight,
# and it costs nothing at runtime because it is not a runtime thing at all.
#
# That last part is the whole of it. The name is checked by people, and the
# value is used by arithmetic, which sees a number with no unit attached. Where
# two correctly-named fields meet in one expression, nothing but the reader
# stands between them.
#
# Every pairing is enumerated and the ones that are dimensionally wrong are
# counted.

# [field, unit, value in that unit, value in milliseconds]
[["timeout_ms", "ms", 500, 500], ["retry_delay_s", "s", 2, 2000], ["budget_ms", "ms", 1500, 1500], ["poll_interval_s", "s", 30, 30000], ["deadline_ms", "ms", 900, 900]] => fields

len(fields) => n

"fields : " + str(n) ^0
"field              unit   value   in ms" ^0
for f in fields:
    "  " + f[0] + "   " + f[1] + "     " + str(f[2]) + "     " + str(f[3]) ^0
"" ^0

# ---- the expression: is the timeout inside the budget ----

"the check: timeout must be under the budget" ^0
fields[0] => timeout
fields[2] => budget
"  " + timeout[0] + " " + str(timeout[2]) + " against " + budget[0] + " " + str(budget[2]) ^0
if timeout[2] < budget[2]:
    "  passes, and both are in ms, so the comparison means what it says" ^0
"" ^0

fields[1] => delay
"the same check against " + delay[0] ^0
"  raw values : " + str(delay[2]) + " against " + str(budget[2]) ^0
if delay[2] < budget[2]:
    "  passes on the raw numbers" ^0
"  in one unit: " + str(delay[3]) + " ms against " + str(budget[3]) + " ms" ^0
if delay[3] > budget[3]:
    "  the delay is actually " + str(delay[3] - budget[3]) + " ms over the budget" ^0
    "  the raw comparison passed because 2 is smaller than 1500, and 2 was" ^0
    "  seconds" ^0
"" ^0

# ---- every pairing ----

"pairings of two fields in one expression" ^0
0 => pairs
0 => mismatched
0 => wrong_answer
for i in [0:n - 1]:
    for j in [0:n - 1]:
        if i < j:
            pairs + 1 => pairs
            if not (fields[i][1] == fields[j][1]):
                mismatched + 1 => mismatched
                0 => raw_lt
                if fields[i][2] < fields[j][2]:
                    1 => raw_lt
                0 => true_lt
                if fields[i][3] < fields[j][3]:
                    1 => true_lt
                if not (raw_lt == true_lt):
                    wrong_answer + 1 => wrong_answer
"  pairs                       : " + str(pairs) ^0
"  pairs with different units  : " + str(mismatched) ^0
"  of those, where comparing the raw values gives the opposite answer : " + str(wrong_answer) ^0
if wrong_answer < mismatched:
    "  the other " + str(mismatched - wrong_answer) + " mismatched pairs happen to compare the same way in" ^0
    "  both units, so they are wrong and produce the right answer" ^0
"" ^0

# ---- what the name is checked by ----

"what checks the unit" ^0
"  the reader        : every time, and correctly" ^0
"  review            : every time it is looked at" ^0
"  the compiler      : never, both are integers" ^0
"  the test suite    : only where a fixture crosses units" ^0
"" ^0

# ---- what carrying the unit in the value costs ----
#
# One canonical unit at the boundary removes every pairing question, because
# there are no longer two units to pair.

0 => canonical_mismatch
for i in [0:n - 1]:
    for j in [0:n - 1]:
        if i < j:
            0 => raw_lt
            if fields[i][3] < fields[j][3]:
                1 => raw_lt
            0 => true_lt
            if fields[i][3] < fields[j][3]:
                1 => true_lt
            if not (raw_lt == true_lt):
                canonical_mismatch + 1 => canonical_mismatch
"storing every duration in milliseconds at the boundary" ^0
"  pairs that can be compared wrongly : " + str(canonical_mismatch) ^0
"  the names keep their suffixes for the reader and the arithmetic has one" ^0
"  unit, so the two audiences stop needing the same field to do both jobs" ^0
"" ^0

# ---- the control: a codebase with one unit already ----
#
# Where every duration is already in the same unit, the naming discipline is
# decoration and no pairing can be wrong.

[["a_ms", "ms", 100, 100], ["b_ms", "ms", 250, 250], ["c_ms", "ms", 900, 900]] => same_unit
0 => su_mismatch
for i in [0:len(same_unit) - 1]:
    for j in [0:len(same_unit) - 1]:
        if i < j:
            if not (same_unit[i][1] == same_unit[j][1]):
                su_mismatch + 1 => su_mismatch
"control - three fields that are all in milliseconds" ^0
"  mismatched pairs : " + str(su_mismatch) ^0
if su_mismatch == 0:
    "  none, so this codebase cannot show whether the discipline is holding" ^0
"" ^0

"The naming discipline is real and every field here obeys it. The name is" ^0
"read by people and the value is read by arithmetic, and only one of those" ^0
"two ever sees the unit." ^0
```

## Python (deterministic transpilation)

```python
fields = [["timeout_ms", "ms", 500, 500], ["retry_delay_s", "s", 2, 2000], ["budget_ms", "ms", 1500, 1500], ["poll_interval_s", "s", 30, 30000], ["deadline_ms", "ms", 900, 900]]
n = len(fields)
print("fields : " + str(n))
print("field              unit   value   in ms")
for f in fields:
    print("  " + f[0] + "   " + f[1] + "     " + str(f[2]) + "     " + str(f[3]))
print("")
print("the check: timeout must be under the budget")
timeout = fields[0]
budget = fields[2]
print("  " + timeout[0] + " " + str(timeout[2]) + " against " + budget[0] + " " + str(budget[2]))
if timeout[2] < budget[2]:
    print("  passes, and both are in ms, so the comparison means what it says")
print("")
delay = fields[1]
print("the same check against " + delay[0])
print("  raw values : " + str(delay[2]) + " against " + str(budget[2]))
if delay[2] < budget[2]:
    print("  passes on the raw numbers")
print("  in one unit: " + str(delay[3]) + " ms against " + str(budget[3]) + " ms")
if delay[3] > budget[3]:
    print("  the delay is actually " + str(delay[3] - budget[3]) + " ms over the budget")
    print("  the raw comparison passed because 2 is smaller than 1500, and 2 was")
    print("  seconds")
print("")
print("pairings of two fields in one expression")
pairs = 0
mismatched = 0
wrong_answer = 0
for i in range(0, n):
    for j in range(0, n):
        if i < j:
            pairs = pairs + 1
            if not fields[i][1] == fields[j][1]:
                mismatched = mismatched + 1
                raw_lt = 0
                if fields[i][2] < fields[j][2]:
                    raw_lt = 1
                true_lt = 0
                if fields[i][3] < fields[j][3]:
                    true_lt = 1
                if not raw_lt == true_lt:
                    wrong_answer = wrong_answer + 1
print("  pairs                       : " + str(pairs))
print("  pairs with different units  : " + str(mismatched))
print("  of those, where comparing the raw values gives the opposite answer : " + str(wrong_answer))
if wrong_answer < mismatched:
    print("  the other " + str(mismatched - wrong_answer) + " mismatched pairs happen to compare the same way in")
    print("  both units, so they are wrong and produce the right answer")
print("")
print("what checks the unit")
print("  the reader        : every time, and correctly")
print("  review            : every time it is looked at")
print("  the compiler      : never, both are integers")
print("  the test suite    : only where a fixture crosses units")
print("")
canonical_mismatch = 0
for i in range(0, n):
    for j in range(0, n):
        if i < j:
            raw_lt = 0
            if fields[i][3] < fields[j][3]:
                raw_lt = 1
            true_lt = 0
            if fields[i][3] < fields[j][3]:
                true_lt = 1
            if not raw_lt == true_lt:
                canonical_mismatch = canonical_mismatch + 1
print("storing every duration in milliseconds at the boundary")
print("  pairs that can be compared wrongly : " + str(canonical_mismatch))
print("  the names keep their suffixes for the reader and the arithmetic has one")
print("  unit, so the two audiences stop needing the same field to do both jobs")
print("")
same_unit = [["a_ms", "ms", 100, 100], ["b_ms", "ms", 250, 250], ["c_ms", "ms", 900, 900]]
su_mismatch = 0
for i in range(0, len(same_unit)):
    for j in range(0, len(same_unit)):
        if i < j:
            if not same_unit[i][1] == same_unit[j][1]:
                su_mismatch = su_mismatch + 1
print("control - three fields that are all in milliseconds")
print("  mismatched pairs : " + str(su_mismatch))
if su_mismatch == 0:
    print("  none, so this codebase cannot show whether the discipline is holding")
print("")
print("The naming discipline is real and every field here obeys it. The name is")
print("read by people and the value is read by arithmetic, and only one of those")
print("two ever sees the unit.")
```

## stdout (executed)

```text
fields : 5
field              unit   value   in ms
  timeout_ms   ms     500     500
  retry_delay_s   s     2     2000
  budget_ms   ms     1500     1500
  poll_interval_s   s     30     30000
  deadline_ms   ms     900     900

the check: timeout must be under the budget
  timeout_ms 500 against budget_ms 1500
  passes, and both are in ms, so the comparison means what it says

the same check against retry_delay_s
  raw values : 2 against 1500
  passes on the raw numbers
  in one unit: 2000 ms against 1500 ms
  the delay is actually 500 ms over the budget
  the raw comparison passed because 2 is smaller than 1500, and 2 was
  seconds

pairings of two fields in one expression
  pairs                       : 10
  pairs with different units  : 6
  of those, where comparing the raw values gives the opposite answer : 6

what checks the unit
  the reader        : every time, and correctly
  review            : every time it is looked at
  the compiler      : never, both are integers
  the test suite    : only where a fixture crosses units

storing every duration in milliseconds at the boundary
  pairs that can be compared wrongly : 0
  the names keep their suffixes for the reader and the arithmetic has one
  unit, so the two audiences stop needing the same field to do both jobs

control - three fields that are all in milliseconds
  mismatched pairs : 0
  none, so this codebase cannot show whether the discipline is holding

The naming discipline is real and every field here obeys it. The name is
read by people and the value is read by arithmetic, and only one of those
two ever sees the unit.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
