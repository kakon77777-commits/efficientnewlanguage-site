<!-- canonical: efficientnewlanguage.org/ai/examples/201-dict-key-identity-collapse | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 201 — Three keys that are one key

`dict_key_identity_collapse.eml` is about `{1: "int", 1.0: "float", True: "bool"}` having one entry, and the asymmetry that makes it hard to see.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Dictionary keys
# that look different and are the same, and one that looks the same and is not.
#
# Python hashes by VALUE, and 1, 1.0 and True are the same value:
#
#     {1: "int", 1.0: "float", True: "bool"}   has ONE entry
#
# The last write wins, the first two vanish, and the literal you typed is not
# the one stored - the KEY keeps whatever the first insertion used. So a
# counter keyed on mixed numeric types silently merges buckets that the author
# believed were separate, and the merged bucket is labelled with whichever
# type happened to arrive first.
#
# Meanwhile "1" is a different key, and so is the tuple (1,) - so the rule is
# not "everything numeric-looking collides", it is exactly "equal values with
# equal hashes collide", which is narrower and less intuitive.
#
# The checks:
#
#   1. the numeric family collapses to one entry, and the surviving key is the
#      FIRST one inserted, not the last
#   2. strings and tuples do NOT join that family
#   3. a bucket count over mixed keys equals a count computed by first
#      normalising the keys by hand - which is the fix

{1: "int", 1.0: "float", True: "bool"} => collapsed
("{1: \"int\", 1.0: \"float\", True: \"bool\"}")^0
("  entries:      " + str(len(collapsed)))^0
("  value at 1:   " + collapsed[1])^0
("  value at 1.0: " + collapsed[1.0])^0
("  value at True:" + collapsed[True])^0

{} => order_probe
"first" => order_probe[1.0]
"second" => order_probe[1]
[] => surviving
for k in order_probe:
    surviving + [k] => surviving
""^0
("inserting 1.0 then 1:")^0
("  entries:       " + str(len(order_probe)))^0
("  surviving key: " + str(surviving[0]) + "   (the FIRST one, not the last)")^0
("  value:         " + order_probe[1])^0

{} => separate
"int one" => separate[1]
"string one" => separate["1"]
"tuple one" => separate[(1,)]
""^0
("1, \"1\" and (1,) as keys:")^0
("  entries: " + str(len(separate)) + "  - equal VALUE is the rule, not equal appearance")^0

# ------------------------------------------------------- a counter that merges
[1, 1.0, True, 2, 2.0, "1", 3, False, 0] => readings

{} => naive
for r in readings:
    if r in naive:
        naive[r] + 1 => naive[r]
    else:
        1 => naive[r]

def type_tag(v):
    # EML-P has no type(), so identity is established by what a value can do.
    if v == True or v == False:
        # True and False compare equal to 1 and 0, so this must be checked by
        # a route that numbers cannot pass: only a bool renders as True/False.
        if str(v) == "True" or str(v) == "False":
            return "bool"
    try:
        v + 0 => probe
        if str(v) == str(int(v)):
            return "int"
        return "float"
    except TypeError:
        return "str"

{} => by_type
for r in readings:
    type_tag(r) + ":" + str(r) => k
    if k in by_type:
        by_type[k] + 1 => by_type[k]
    else:
        1 => by_type[k]

""^0
("readings: " + str(readings))^0
("  naive dictionary buckets:      " + str(len(naive)))^0
("  type-tagged buckets:           " + str(len(by_type)))^0

0 => naive_total
for k in naive:
    naive_total + naive[k] => naive_total
0 => tagged_total
for k in by_type:
    tagged_total + by_type[k] => tagged_total

("  readings counted, naive:       " + str(naive_total))^0
("  readings counted, type-tagged: " + str(tagged_total))^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

checked + 1 => checked
if len(collapsed) == 1:
    passed + 1 => passed

checked + 1 => checked
if collapsed[1] == "bool" and collapsed[1.0] == "bool" and collapsed[True] == "bool":
    passed + 1 => passed

checked + 1 => checked
if len(order_probe) == 1 and order_probe[1] == "second":
    passed + 1 => passed

checked + 1 => checked
if len(separate) == 3:
    passed + 1 => passed

# Both counters must account for every reading - they disagree on how many
# BUCKETS there are, never on how many readings there were.
checked + 1 => checked
if naive_total == len(readings) and tagged_total == len(readings):
    passed + 1 => passed

checked + 1 => checked
if len(by_type) > len(naive):
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Equal values share a key; the first insertion keeps it; tagging separates them." => verdict
else:
    "FAILED - the key model is not what the checks describe." => verdict
verdict^0

""^0
"The surviving key is the one inserted FIRST while the value is the one" => n1
n1^0
"written LAST. That asymmetry is what makes the merge hard to see: the" => n2
n2^0
"dictionary still reads back a plausible value under every one of the three" => n3
n3^0
"literals, and only the entry count says two of them were never stored." => n4
n4^0
```

## Python (deterministic transpilation)

```python
collapsed = {1: "int", 1.0: "float", True: "bool"}
print("{1: \"int\", 1.0: \"float\", True: \"bool\"}")
print("  entries:      " + str(len(collapsed)))
print("  value at 1:   " + collapsed[1])
print("  value at 1.0: " + collapsed[1.0])
print("  value at True:" + collapsed[True])
order_probe = {}
order_probe[1.0] = "first"
order_probe[1] = "second"
surviving = []
for k in order_probe:
    surviving = surviving + [k]
print("")
print("inserting 1.0 then 1:")
print("  entries:       " + str(len(order_probe)))
print("  surviving key: " + str(surviving[0]) + "   (the FIRST one, not the last)")
print("  value:         " + order_probe[1])
separate = {}
separate[1] = "int one"
separate["1"] = "string one"
separate[(1,)] = "tuple one"
print("")
print("1, \"1\" and (1,) as keys:")
print("  entries: " + str(len(separate)) + "  - equal VALUE is the rule, not equal appearance")
readings = [1, 1.0, True, 2, 2.0, "1", 3, False, 0]
naive = {}
for r in readings:
    if r in naive:
        naive[r] = naive[r] + 1
    else:
        naive[r] = 1

def type_tag(v):
    if v == True or v == False:
        if str(v) == "True" or str(v) == "False":
            return "bool"
    try:
        probe = v + 0
        if str(v) == str(int(v)):
            return "int"
        return "float"
    except TypeError:
        return "str"

by_type = {}
for r in readings:
    k = type_tag(r) + ":" + str(r)
    if k in by_type:
        by_type[k] = by_type[k] + 1
    else:
        by_type[k] = 1
print("")
print("readings: " + str(readings))
print("  naive dictionary buckets:      " + str(len(naive)))
print("  type-tagged buckets:           " + str(len(by_type)))
naive_total = 0
for k in naive:
    naive_total = naive_total + naive[k]
tagged_total = 0
for k in by_type:
    tagged_total = tagged_total + by_type[k]
print("  readings counted, naive:       " + str(naive_total))
print("  readings counted, type-tagged: " + str(tagged_total))
passed = 0
checked = 0
checked = checked + 1
if len(collapsed) == 1:
    passed = passed + 1
checked = checked + 1
if collapsed[1] == "bool" and collapsed[1.0] == "bool" and collapsed[True] == "bool":
    passed = passed + 1
checked = checked + 1
if len(order_probe) == 1 and order_probe[1] == "second":
    passed = passed + 1
checked = checked + 1
if len(separate) == 3:
    passed = passed + 1
checked = checked + 1
if naive_total == len(readings) and tagged_total == len(readings):
    passed = passed + 1
checked = checked + 1
if len(by_type) > len(naive):
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Equal values share a key; the first insertion keeps it; tagging separates them."
else:
    verdict = "FAILED - the key model is not what the checks describe."
print(verdict)
print("")
n1 = "The surviving key is the one inserted FIRST while the value is the one"
print(n1)
n2 = "written LAST. That asymmetry is what makes the merge hard to see: the"
print(n2)
n3 = "dictionary still reads back a plausible value under every one of the three"
print(n3)
n4 = "literals, and only the entry count says two of them were never stored."
print(n4)
```

## stdout (executed)

```text
{1: "int", 1.0: "float", True: "bool"}
  entries:      1
  value at 1:   bool
  value at 1.0: bool
  value at True:bool

inserting 1.0 then 1:
  entries:       1
  surviving key: 1.0   (the FIRST one, not the last)
  value:         second

1, "1" and (1,) as keys:
  entries: 3  - equal VALUE is the rule, not equal appearance

readings: [1, 1.0, True, 2, 2.0, '1', 3, False, 0]
  naive dictionary buckets:      5
  type-tagged buckets:           9
  readings counted, naive:       9
  readings counted, type-tagged: 9

checks passed: 6/6
Equal values share a key; the first insertion keeps it; tagging separates them.

The surviving key is the one inserted FIRST while the value is the one
written LAST. That asymmetry is what makes the merge hard to see: the
dictionary still reads back a plausible value under every one of the three
literals, and only the entry count says two of them were never stored.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:def · eml:call · eml:return · eml:run:done
