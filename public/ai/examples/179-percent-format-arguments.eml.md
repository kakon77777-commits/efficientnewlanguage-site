<!-- canonical: efficientnewlanguage.org/ai/examples/179-percent-format-arguments | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 179 — What `%` does with its right operand

`percent_format_arguments.eml` — walks the argument rules of %-formatting.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). What `%` does
# with its RIGHT operand, which is stranger than the format specifiers are.
#
#   "%s %s" % (a, b)   a TUPLE supplies one value per specifier
#   "%s"    % a        anything else is ONE value
#
# The rule that looks arbitrary until you know why:
#
#   "ab" % 5        TypeError: not all arguments converted
#   "ab" % [1, 2]   "ab"          <- no error
#   "ab" % {"a":1}  "ab"          <- no error
#
# CPython skips the leftover-argument check whenever the right operand is
# MAPPING-LIKE, and its `PyMapping_Check` counts a LIST as mapping-like because
# a list has __getitem__. So the distinction is about the type's protocol, not
# about the role you had in mind for it. Verified against 3.14 rather than
# reasoned out - this interpreter raised TypeError for the list and dict rows.

def describe(label, produce):
    return label

"A tuple supplies one value per specifier" => h
h^0
("  \"%s scored %s\" % (\"ana\", 88) -> " + ("%s scored %s" % ("ana", 88)))^0
("  \"%d%%\" % 75                  -> " + ("%d%%" % 75))^0
""^0

"Anything that is not a tuple is a SINGLE value" => h2
h2^0
("  \"%s\" % 5          -> " + ("%s" % 5))^0
("  \"%s\" % [1, 2]     -> " + ("%s" % [1, 2]) + "   <- the whole list, not two values")^0
""^0

"Leftover arguments: an error only for non-mapping-like operands" => h3
h3^0
("  \"ab\" % [1, 2]     -> " + repr("ab" % [1, 2]) + "      (list is mapping-like)")^0
("  \"ab\" % {\"a\": 1}   -> " + repr("ab" % {"a": 1}) + "      (dict is mapping-like)")^0
try:
    "ab" % 5 => oops
    ("  \"ab\" % 5 gave " + repr(oops) + " - unreachable")^0
except TypeError as e:
    ("  \"ab\" % 5          -> TypeError: " + str(e))^0
try:
    "ab" % (1, 2) => oops2
    ("  \"ab\" % (1, 2) gave " + repr(oops2) + " - unreachable")^0
except TypeError as e:
    ("  \"ab\" % (1, 2)     -> TypeError: " + str(e))^0
""^0

"Too FEW arguments is always an error" => h4
h4^0
try:
    "%s and %s" % ("only one",) => bad
    ("  gave " + repr(bad) + " - unreachable")^0
except TypeError as e:
    ("  \"%s and %s\" % (\"only one\",) -> " + str(e))^0
""^0

"Practical reading: pass a tuple when you mean several values." => n1
n1^0
"Passing a bare list looks like several and behaves like one." => n2
n2^0
```

## Python (deterministic transpilation)

```python
def describe(label, produce):
    return label

h = "A tuple supplies one value per specifier"
print(h)
print("  \"%s scored %s\" % (\"ana\", 88) -> " + "%s scored %s" % ("ana", 88))
print("  \"%d%%\" % 75                  -> " + "%d%%" % 75)
print("")
h2 = "Anything that is not a tuple is a SINGLE value"
print(h2)
print("  \"%s\" % 5          -> " + "%s" % 5)
print("  \"%s\" % [1, 2]     -> " + "%s" % [1, 2] + "   <- the whole list, not two values")
print("")
h3 = "Leftover arguments: an error only for non-mapping-like operands"
print(h3)
print("  \"ab\" % [1, 2]     -> " + repr("ab" % [1, 2]) + "      (list is mapping-like)")
print("  \"ab\" % {\"a\": 1}   -> " + repr("ab" % {"a": 1}) + "      (dict is mapping-like)")
try:
    oops = "ab" % 5
    print("  \"ab\" % 5 gave " + repr(oops) + " - unreachable")
except TypeError as e:
    print("  \"ab\" % 5          -> TypeError: " + str(e))
try:
    oops2 = "ab" % (1, 2)
    print("  \"ab\" % (1, 2) gave " + repr(oops2) + " - unreachable")
except TypeError as e:
    print("  \"ab\" % (1, 2)     -> TypeError: " + str(e))
print("")
h4 = "Too FEW arguments is always an error"
print(h4)
try:
    bad = "%s and %s" % ("only one",)
    print("  gave " + repr(bad) + " - unreachable")
except TypeError as e:
    print("  \"%s and %s\" % (\"only one\",) -> " + str(e))
print("")
n1 = "Practical reading: pass a tuple when you mean several values."
print(n1)
n2 = "Passing a bare list looks like several and behaves like one."
print(n2)
```

## stdout (executed)

```text
A tuple supplies one value per specifier
  "%s scored %s" % ("ana", 88) -> ana scored 88
  "%d%%" % 75                  -> 75%

Anything that is not a tuple is a SINGLE value
  "%s" % 5          -> 5
  "%s" % [1, 2]     -> [1, 2]   <- the whole list, not two values

Leftover arguments: an error only for non-mapping-like operands
  "ab" % [1, 2]     -> 'ab'      (list is mapping-like)
  "ab" % {"a": 1}   -> 'ab'      (dict is mapping-like)
  "ab" % 5          -> TypeError: not all arguments converted during string formatting
  "ab" % (1, 2)     -> TypeError: not all arguments converted during string formatting

Too FEW arguments is always an error
  "%s and %s" % ("only one",) -> not enough arguments for format string

Practical reading: pass a tuple when you mean several values.
Passing a bare list looks like several and behaves like one.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:run:done
