<!-- canonical: efficientnewlanguage.org/ai/examples/262-leading-zero-identifiers | ai_layer_version: 0.1.0 | updated: 2026-08-06 -->

# Example 262 — Leading-zero identifiers — two customers, one key

`leading_zero_identifiers.eml` runs real-shaped identifiers through an integer round trip and counts three separate failures: identifiers that do not come back as themselves, distinct identifiers that **collide**, and identifiers that lose digits to float precision.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). An identifier
# stored as a number, and the two customers who became one.
#
# Account numbers, ZIP codes, part numbers, phone numbers and order references
# are written with digits and are not quantities. Nothing is ever added to
# them. The only operations they support are equality and display. Stored as an
# integer they lose leading zeros, which means:
#
#     "007" and "7" become the same key       - two records merge silently
#     "0123" prints as "123"                  - the display is wrong
#     a 19-digit reference loses its last digits to float precision
#
# None of these raise. The insert succeeds, the lookup succeeds, and the
# customer whose account begins with a zero is served someone else's data.
#
# The measurement runs a set of real-shaped identifiers through an integer
# round trip and counts three separate failures: identifiers that do not come
# back as themselves, distinct identifiers that COLLIDE, and identifiers that
# lose digits entirely.

def digits_only(s):
    # An identifier is a string of digits; anything else is not this problem.
    if len(s) == 0:
        return False
    for i in [0:len(s) - 1]:
        s[i] => c
        if not (c == "0" or c == "1" or c == "2" or c == "3" or c == "4" or c == "5" or c == "6" or c == "7" or c == "8" or c == "9"):
            return False
    return True

def through_int(s):
    # Store as an integer, read back as a string. The obvious implementation.
    return str(int(s))

def through_float(s):
    # What a JSON parser without a big-integer path does.
    return str(int(float(s)))


[
    "007",
    "7",
    "0123",
    "123",
    "00000",
    "0",
    "90210",
    "02134",
    "4007000000000000",
    "9007199254740993"
] => ids

"identifier          via int             via float           survives"^0
0 => n
0 => broken
{} => back
for s in ids:
    n + 1 => n
    through_int(s) => a
    through_float(s) => b
    s == a => ok
    if not ok:
        broken + 1 => broken
    a => back[s]
    ("%-19s %-19s %-19s %s" % (s, a, b, str(ok)))^0

""^0
("identifiers tested: " + str(n))^0
("  do not survive an integer round trip: " + str(broken))^0

# ------------------------------------------------ the silent merge
""^0
"distinct identifiers that map to the SAME integer key:"^0
0 => collisions
for i in [0:len(ids) - 1]:
    for j in [i + 1:len(ids) - 1]:
        ids[i] => a
        ids[j] => b
        if not (a == b) and back[a] == back[b]:
            collisions + 1 => collisions
            ("  " + a + " and " + b + " both become " + back[a])^0
("distinct pairs that collide: " + str(collisions))^0

# ------------------------------------------- the digits that disappear
""^0
"identifiers where the float path loses a digit:"^0
0 => float_lost
for s in ids:
    through_float(s) => b
    if not (b == through_int(s)):
        float_lost + 1 => float_lost
        ("  " + s + " -> " + b)^0
("identifiers damaged by the float path but not the integer path: " + str(float_lost))^0

# ------------------------------- every one of them is a valid identifier
""^0
0 => all_digits
for s in ids:
    if digits_only(s):
        all_digits + 1 => all_digits
("identifiers that are entirely digits: " + str(all_digits) + "/" + str(n))^0
"...so no validation rule based on 'is it numeric' rejects any of them."^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

# Some identifiers must survive and some must not. If none survived the bug
# would be obvious; if all survived there would be nothing to show.
checked + 1 => checked
if broken > 0 and broken < n:
    passed + 1 => passed

# At least one pair of DISTINCT identifiers must collide. That is the failure
# that costs data rather than appearance.
checked + 1 => checked
if collisions > 0:
    passed + 1 => passed

# The float path must be strictly worse than the integer path somewhere.
checked + 1 => checked
if float_lost > 0:
    passed + 1 => passed

# Storing them as strings must be lossless for every one - the fix has to
# actually work, or this case is only complaining.
checked + 1 => checked
0 => str_ok
for s in ids:
    if str(s) == s:
        str_ok + 1 => str_ok
if str_ok == n:
    passed + 1 => passed

# And every identifier must pass a digits-only validator, so that no schema
# check phrased as 'must be numeric' can catch any of this.
checked + 1 => checked
if all_digits == n:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Two different customers, one key, and no error anywhere." => verdict
else:
    "FAILED - an identifier did not behave as the checks describe." => verdict
verdict^0

""^0
"The test for whether something is a number is not whether it is spelled" => n1
n1^0
"with digits - it is whether adding one to it means anything. Nothing is" => n2
n2^0
"ever added to an account number, so the leading zero is not padding: it" => n3
n3^0
"is part of the name. A schema that says 'integer' has thrown away part of" => n4
n4^0
"the name and recorded the loss nowhere." => n5
n5^0
```

## Python (deterministic transpilation)

```python
def digits_only(s):
    if len(s) == 0:
        return False
    for i in range(0, len(s)):
        c = s[i]
        if not (c == "0" or c == "1" or c == "2" or c == "3" or c == "4" or c == "5" or c == "6" or c == "7" or c == "8" or c == "9"):
            return False
    return True

def through_int(s):
    return str(int(s))

def through_float(s):
    return str(int(float(s)))

ids = ["007", "7", "0123", "123", "00000", "0", "90210", "02134", "4007000000000000", "9007199254740993"]
print("identifier          via int             via float           survives")
n = 0
broken = 0
back = {}
for s in ids:
    n = n + 1
    a = through_int(s)
    b = through_float(s)
    ok = s == a
    if not ok:
        broken = broken + 1
    back[s] = a
    print("%-19s %-19s %-19s %s" % (s, a, b, str(ok)))
print("")
print("identifiers tested: " + str(n))
print("  do not survive an integer round trip: " + str(broken))
print("")
print("distinct identifiers that map to the SAME integer key:")
collisions = 0
for i in range(0, len(ids)):
    for j in range(i + 1, len(ids)):
        a = ids[i]
        b = ids[j]
        if not a == b and back[a] == back[b]:
            collisions = collisions + 1
            print("  " + a + " and " + b + " both become " + back[a])
print("distinct pairs that collide: " + str(collisions))
print("")
print("identifiers where the float path loses a digit:")
float_lost = 0
for s in ids:
    b = through_float(s)
    if not b == through_int(s):
        float_lost = float_lost + 1
        print("  " + s + " -> " + b)
print("identifiers damaged by the float path but not the integer path: " + str(float_lost))
print("")
all_digits = 0
for s in ids:
    if digits_only(s):
        all_digits = all_digits + 1
print("identifiers that are entirely digits: " + str(all_digits) + "/" + str(n))
print("...so no validation rule based on 'is it numeric' rejects any of them.")
passed = 0
checked = 0
checked = checked + 1
if broken > 0 and broken < n:
    passed = passed + 1
checked = checked + 1
if collisions > 0:
    passed = passed + 1
checked = checked + 1
if float_lost > 0:
    passed = passed + 1
checked = checked + 1
str_ok = 0
for s in ids:
    if str(s) == s:
        str_ok = str_ok + 1
if str_ok == n:
    passed = passed + 1
checked = checked + 1
if all_digits == n:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Two different customers, one key, and no error anywhere."
else:
    verdict = "FAILED - an identifier did not behave as the checks describe."
print(verdict)
print("")
n1 = "The test for whether something is a number is not whether it is spelled"
print(n1)
n2 = "with digits - it is whether adding one to it means anything. Nothing is"
print(n2)
n3 = "ever added to an account number, so the leading zero is not padding: it"
print(n3)
n4 = "is part of the name. A schema that says 'integer' has thrown away part of"
print(n4)
n5 = "the name and recorded the loss nowhere."
print(n5)
```

## stdout (executed)

```text
identifier          via int             via float           survives
007                 7                   7                   False
7                   7                   7                   True
0123                123                 123                 False
123                 123                 123                 True
00000               0                   0                   False
0                   0                   0                   True
90210               90210               90210               True
02134               2134                2134                False
4007000000000000    4007000000000000    4007000000000000    True
9007199254740993    9007199254740993    9007199254740992    True

identifiers tested: 10
  do not survive an integer round trip: 4

distinct identifiers that map to the SAME integer key:
  007 and 7 both become 7
  0123 and 123 both become 123
  00000 and 0 both become 0
distinct pairs that collide: 3

identifiers where the float path loses a digit:
  9007199254740993 -> 9007199254740992
identifiers damaged by the float path but not the integer path: 1

identifiers that are entirely digits: 10/10
...so no validation rule based on 'is it numeric' rejects any of them.

checks passed: 5/5
Two different customers, one key, and no error anywhere.

The test for whether something is a number is not whether it is spelled
with digits - it is whether adding one to it means anything. Nothing is
ever added to an account number, so the leading zero is not padding: it
is part of the name. A schema that says 'integer' has thrown away part of
the name and recorded the loss nowhere.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
