<!-- canonical: efficientnewlanguage.org/ai/examples/171-frozen-membership-quirk | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 171 — A set you can ask about but never store

`frozen_membership_quirk.eml` — isolates one genuine CPython quirk.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). One genuine
# CPython quirk, isolated.
#
# A set is unhashable, so it can never be STORED in another set:
#
#   {{1, 2}}          TypeError: unhashable type: 'set'
#
# But asking whether one is PRESENT does not raise:
#
#   {1, 2} in {1, 2}  ->  False
#
# CPython's set.__contains__ catches the TypeError from an unhashable set
# argument and retries the lookup as a frozenset. So a set can be asked about
# even though it can never be an element - and the answer is False unless the
# set literally contains a frozenset with those members.
#
# Nothing else gets this rescue. A list still raises.
#
# This interpreter raised TypeError for the membership test, which is the
# defensible-looking answer and the wrong one. The rule was found by sweeping
# every (operator, left type, right type) cell against real CPython, not by
# reading documentation - it is the kind of behaviour that only shows up when
# you actually run the combination.

def ask(label, probe, collection):
    return label

{1, 2} => pair
{1, 2, 3} => triple

"Membership of a SET inside a set: answered, not refused" => h
h^0
("  {1, 2} in {1, 2}    -> " + str(pair in pair))^0
("  {1, 2} in {1, 2, 3} -> " + str(pair in triple))^0
("  Both False: neither set contains a frozenset as an element.")^0
""^0

"But storing one is still impossible" => h2
h2^0
try:
    {pair} => nested
    ("  built a set containing a set - unreachable")^0
except TypeError as e:
    ("  {a_set} -> " + str(e))^0
""^0

"The rescue is specific to sets - a list still raises" => h3
h3^0
try:
    [1] in triple => answer
    ("  [1] in a set gave " + str(answer) + " - unreachable")^0
except TypeError as e:
    ("  [1] in a set -> " + str(e))^0
""^0

"A tuple needs no rescue: it is genuinely hashable" => h4
h4^0
{(1, 2)} => tuple_holder
("  (1, 2) in {(1, 2)} -> " + str((1, 2) in tuple_holder))^0
("  and it can be STORED: the set has " + str(len(tuple_holder)) + " element")^0
""^0

"Worth knowing because the two questions look identical" => n1
n1^0
"in source, and only one of them is answerable." => n2
n2^0
```

## Python (deterministic transpilation)

```python
def ask(label, probe, collection):
    return label

pair = {1, 2}
triple = {1, 2, 3}
h = "Membership of a SET inside a set: answered, not refused"
print(h)
print("  {1, 2} in {1, 2}    -> " + str(pair in pair))
print("  {1, 2} in {1, 2, 3} -> " + str(pair in triple))
print("  Both False: neither set contains a frozenset as an element.")
print("")
h2 = "But storing one is still impossible"
print(h2)
try:
    nested = {pair}
    print("  built a set containing a set - unreachable")
except TypeError as e:
    print("  {a_set} -> " + str(e))
print("")
h3 = "The rescue is specific to sets - a list still raises"
print(h3)
try:
    answer = [1] in triple
    print("  [1] in a set gave " + str(answer) + " - unreachable")
except TypeError as e:
    print("  [1] in a set -> " + str(e))
print("")
h4 = "A tuple needs no rescue: it is genuinely hashable"
print(h4)
tuple_holder = {(1, 2)}
print("  (1, 2) in {(1, 2)} -> " + str((1, 2) in tuple_holder))
print("  and it can be STORED: the set has " + str(len(tuple_holder)) + " element")
print("")
n1 = "Worth knowing because the two questions look identical"
print(n1)
n2 = "in source, and only one of them is answerable."
print(n2)
```

## stdout (executed)

```text
Membership of a SET inside a set: answered, not refused
  {1, 2} in {1, 2}    -> False
  {1, 2} in {1, 2, 3} -> False
  Both False: neither set contains a frozenset as an element.

But storing one is still impossible
  {a_set} -> cannot use 'set' as a set element (unhashable type: 'set')

The rescue is specific to sets - a list still raises
  [1] in a set -> cannot use 'list' as a set element (unhashable type: 'list')

A tuple needs no rescue: it is genuinely hashable
  (1, 2) in {(1, 2)} -> True
  and it can be STORED: the set has 1 element

Worth knowing because the two questions look identical
in source, and only one of them is answerable.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:run:done
