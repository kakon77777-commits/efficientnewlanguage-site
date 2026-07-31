<!-- canonical: efficientnewlanguage.org/ai/examples/173-hashable-key-rules | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 173 — What can be a key

`hashable_key_rules.eml` — shows which values can key a dict or join a set, and what the failure says.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). What can be a
# dict key or a set element, and what the failure says when it cannot.
#
# The rule is one sentence with a recursive tail: a value is hashable if it is
# immutable all the way down. int, float, bool, str, None and None-containing
# tuples qualify; list, dict and set never do; a TUPLE qualifies exactly when
# every element does.
#
# The error message is worth reading because it names two types, not one:
#
#   cannot use 'tuple' as a dict key (unhashable type: 'list')
#                 ^ what you tried            ^ what made it impossible
#
# and the wording changes with the use site - "as a set element" for a set.
# This interpreter used to report only the inner half, which pointed at a type
# the programmer never wrote.

def try_as_key(label, build):
    return label

{} => registry
"origin" => registry[(0, 0)]
"unit" => registry[(1, 1)]
"named" => registry["home"]
"numeric" => registry[7]
"nothing" => registry[None]

("Keys accepted: " + str(len(registry)))^0
""^0
"key           kind" => header
header^0
"------------  -----------" => rule
rule^0
for k in registry:
    repr(k) => shown
    14 - len(shown) => pad
    if pad < 1:
        1 => pad
    (shown + " " * pad + registry[k])^0

""^0
"Numeric keys unify: 1, 1.0 and True are the SAME key" => h
h^0
{} => nums
"int" => nums[1]
"float" => nums[1.0]
"bool" => nums[True]
("  after three assignments the dict holds " + str(len(nums)) + " entry")^0
("  the surviving value is " + repr(nums[1]) + " - the last write won")^0
""^0

"A tuple is hashable exactly when its elements are" => h2
h2^0
("  (1, 2) as a key      -> ok, " + str(len({(1, 2): "yes"})) + " entry")^0
("  ((1, 2), 3) nested   -> ok, " + str(len({((1, 2), 3): "yes"})) + " entry")^0
try:
    {(1, [2]): "no"} => bad
    ("  (1, [2]) as a key    -> accepted, unreachable")^0
except TypeError as e:
    ("  (1, [2]) as a key    -> " + str(e))^0
""^0

"The message names the use site" => h3
h3^0
try:
    {[1]: "no"} => bad2
    ("  unreachable")^0
except TypeError as e:
    ("  as a dict key   : " + str(e))^0
try:
    {[1]} => bad3
    ("  unreachable")^0
except TypeError as e:
    ("  as a set element: " + str(e))^0
""^0
"Both halves matter: the first names what you wrote," => n1
n1^0
"the second names the part that made it impossible." => n2
n2^0
```

## Python (deterministic transpilation)

```python
def try_as_key(label, build):
    return label

registry = {}
registry[(0, 0)] = "origin"
registry[(1, 1)] = "unit"
registry["home"] = "named"
registry[7] = "numeric"
registry[None] = "nothing"
print("Keys accepted: " + str(len(registry)))
print("")
header = "key           kind"
print(header)
rule = "------------  -----------"
print(rule)
for k in registry:
    shown = repr(k)
    pad = 14 - len(shown)
    if pad < 1:
        pad = 1
    print(shown + " " * pad + registry[k])
print("")
h = "Numeric keys unify: 1, 1.0 and True are the SAME key"
print(h)
nums = {}
nums[1] = "int"
nums[1.0] = "float"
nums[True] = "bool"
print("  after three assignments the dict holds " + str(len(nums)) + " entry")
print("  the surviving value is " + repr(nums[1]) + " - the last write won")
print("")
h2 = "A tuple is hashable exactly when its elements are"
print(h2)
print("  (1, 2) as a key      -> ok, " + str(len({(1, 2): "yes"})) + " entry")
print("  ((1, 2), 3) nested   -> ok, " + str(len({((1, 2), 3): "yes"})) + " entry")
try:
    bad = {(1, [2]): "no"}
    print("  (1, [2]) as a key    -> accepted, unreachable")
except TypeError as e:
    print("  (1, [2]) as a key    -> " + str(e))
print("")
h3 = "The message names the use site"
print(h3)
try:
    bad2 = {[1]: "no"}
    print("  unreachable")
except TypeError as e:
    print("  as a dict key   : " + str(e))
try:
    bad3 = {[1]}
    print("  unreachable")
except TypeError as e:
    print("  as a set element: " + str(e))
print("")
n1 = "Both halves matter: the first names what you wrote,"
print(n1)
n2 = "the second names the part that made it impossible."
print(n2)
```

## stdout (executed)

```text
Keys accepted: 5

key           kind
------------  -----------
(0, 0)        origin
(1, 1)        unit
'home'        named
7             numeric
None          nothing

Numeric keys unify: 1, 1.0 and True are the SAME key
  after three assignments the dict holds 1 entry
  the surviving value is 'bool' - the last write won

A tuple is hashable exactly when its elements are
  (1, 2) as a key      -> ok, 1 entry
  ((1, 2), 3) nested   -> ok, 1 entry
  (1, [2]) as a key    -> cannot use 'tuple' as a dict key (unhashable type: 'list')

The message names the use site
  as a dict key   : cannot use 'list' as a dict key (unhashable type: 'list')
  as a set element: cannot use 'list' as a set element (unhashable type: 'list')

Both halves matter: the first names what you wrote,
the second names the part that made it impossible.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:run:done
