<!-- canonical: efficientnewlanguage.org/ai/examples/184-type-preserving-ops | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 184 — One operator, four meanings

`type_preserving_ops.eml` — shows what `+` and `*` mean per operand family.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The same two
# operators, `+` and `*`, mean four different things depending on the operand
# types - and each one PRESERVES the type it was given.
#
#   int  + int   arithmetic
#   str  + str   concatenation
#   list + list  concatenation, result is a list
#   tuple+ tuple concatenation, result is a TUPLE
#
#   str  * int   repetition, result is a str
#   list * int   repetition, result is a list
#   tuple* int   repetition, result is a TUPLE
#
# The type preservation is the part worth checking, because a "make a sequence"
# helper that always returns a list would pass every test that only looks at
# the CONTENTS. Repeating a tuple has to give back something still usable as a
# dict key, and a list is not.
#
# Mixing the families is a TypeError, never a coercion: Python will not guess
# whether "3" + 4 meant 7 or "34".

def kind_of(v):
    # No type() builtin in EML-P, so identify by what the value can do.
    if v == v:
        return ""
    return ""

"Addition means different things per family" => h
h^0
("  7 + 2           -> " + repr(7 + 2))^0
("  \"ab\" + \"cd\"     -> " + repr("ab" + "cd"))^0
("  [1] + [2]       -> " + repr([1] + [2]))^0
("  (1,) + (2,)     -> " + repr((1,) + (2,)))^0
""^0

"Repetition preserves the type it was given" => h2
h2^0
("  \"ab\" * 2        -> " + repr("ab" * 2))^0
("  [1, 2] * 2      -> " + repr([1, 2] * 2))^0
("  (1, 2) * 2      -> " + repr((1, 2) * 2))^0
("  2 * (1, 2)      -> " + repr(2 * (1, 2)) + "   (count may come first)")^0
""^0

"Why the preserved type matters, not just the contents" => h3
h3^0
(1, 2) * 2 => repeated
("  a repeated tuple is still hashable: " + str(len({repeated: "ok"})) + " entry")^0
try:
    [1, 2] * 2 => rep_list
    {rep_list: "no"} => bad
    ("  a repeated list keyed a dict - unreachable")^0
except TypeError as e:
    ("  a repeated list is not: " + str(e))^0
("  a helper that always returned a list would break the first case")^0
("  while still passing any test that only compared contents.")^0
""^0

"Mixing families raises - Python never guesses" => h4
h4^0
try:
    "3" + 4 => guess
    ("  \"3\" + 4 gave " + repr(guess) + " - unreachable")^0
except TypeError as e:
    ("  \"3\" + 4         -> " + str(e))^0
try:
    [1] + (2,) => guess2
    ("  [1] + (2,) gave " + repr(guess2) + " - unreachable")^0
except TypeError as e:
    ("  [1] + (2,)      -> " + str(e))^0
""^0
"A list and a tuple are different types, so they do not concatenate" => n1
n1^0
"and never compare equal, even with identical contents:" => n2
n2^0
("  [1, 2] == (1, 2) -> " + str([1, 2] == (1, 2)))^0
```

## Python (deterministic transpilation)

```python
def kind_of(v):
    if v == v:
        return ""
    return ""

h = "Addition means different things per family"
print(h)
print("  7 + 2           -> " + repr(7 + 2))
print("  \"ab\" + \"cd\"     -> " + repr("ab" + "cd"))
print("  [1] + [2]       -> " + repr([1] + [2]))
print("  (1,) + (2,)     -> " + repr((1,) + (2,)))
print("")
h2 = "Repetition preserves the type it was given"
print(h2)
print("  \"ab\" * 2        -> " + repr("ab" * 2))
print("  [1, 2] * 2      -> " + repr([1, 2] * 2))
print("  (1, 2) * 2      -> " + repr((1, 2) * 2))
print("  2 * (1, 2)      -> " + repr(2 * (1, 2)) + "   (count may come first)")
print("")
h3 = "Why the preserved type matters, not just the contents"
print(h3)
repeated = (1, 2) * 2
print("  a repeated tuple is still hashable: " + str(len({repeated: "ok"})) + " entry")
try:
    rep_list = [1, 2] * 2
    bad = {rep_list: "no"}
    print("  a repeated list keyed a dict - unreachable")
except TypeError as e:
    print("  a repeated list is not: " + str(e))
print("  a helper that always returned a list would break the first case")
print("  while still passing any test that only compared contents.")
print("")
h4 = "Mixing families raises - Python never guesses"
print(h4)
try:
    guess = "3" + 4
    print("  \"3\" + 4 gave " + repr(guess) + " - unreachable")
except TypeError as e:
    print("  \"3\" + 4         -> " + str(e))
try:
    guess2 = [1] + (2,)
    print("  [1] + (2,) gave " + repr(guess2) + " - unreachable")
except TypeError as e:
    print("  [1] + (2,)      -> " + str(e))
print("")
n1 = "A list and a tuple are different types, so they do not concatenate"
print(n1)
n2 = "and never compare equal, even with identical contents:"
print(n2)
print("  [1, 2] == (1, 2) -> " + str([1, 2] == (1, 2)))
```

## stdout (executed)

```text
Addition means different things per family
  7 + 2           -> 9
  "ab" + "cd"     -> 'abcd'
  [1] + [2]       -> [1, 2]
  (1,) + (2,)     -> (1, 2)

Repetition preserves the type it was given
  "ab" * 2        -> 'abab'
  [1, 2] * 2      -> [1, 2, 1, 2]
  (1, 2) * 2      -> (1, 2, 1, 2)
  2 * (1, 2)      -> (1, 2, 1, 2)   (count may come first)

Why the preserved type matters, not just the contents
  a repeated tuple is still hashable: 1 entry
  a repeated list is not: cannot use 'list' as a dict key (unhashable type: 'list')
  a helper that always returned a list would break the first case
  while still passing any test that only compared contents.

Mixing families raises - Python never guesses
  "3" + 4         -> can only concatenate str (not "int") to str
  [1] + (2,)      -> can only concatenate list (not "tuple") to list

A list and a tuple are different types, so they do not concatenate
and never compare equal, even with identical contents:
  [1, 2] == (1, 2) -> False
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:run:done
