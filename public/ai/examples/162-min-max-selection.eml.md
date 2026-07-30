<!-- canonical: efficientnewlanguage.org/ai/examples/162-min-max-selection | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 162 — `min()` and `max()` have two call shapes

`min_max_selection.eml` demonstrates the rule that decides which one you are using, and the sharp edge it creates.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). min() and max()
# have TWO call shapes, and confusing them is a classic quiet bug:
#
#   max(a, b, c)   compare the arguments
#   max(iterable)  compare the ITEMS of the one argument
#
# One argument means "look inside this", always. That rule has a sharp edge:
# `max("hello")` is not "hello", it is 'o' - the largest CHARACTER - because a
# string is iterable. And `max(5)` is not 5, it is a TypeError, because an int
# is not.
#
# Both of those were wrong here until this case was written. The interpreter
# special-cased list and treated any other single argument as a one-element
# sequence, so `max("hello")` returned the whole string and `max(5)` returned 5.
# Neither raised; both just answered something plausible. The corpus never
# noticed because min() was called by ZERO of 149 programs and max() by one.

def spread(values):
    return max(values) - min(values)

[[42, 17, 93, 8, 61], [5, 5, 5], [0 - 3, 0 - 9, 0 - 1]] => datasets

"Per-dataset extremes" => h1
h1^0
for ds in datasets:
    ("  " + str(ds) + "  min=" + str(min(ds)) + "  max=" + str(max(ds)) + "  spread=" + str(spread(ds)))^0

""^0
"Argument form vs iterable form" => h2
h2^0
# Three arguments: compare the arguments themselves.
("  max(3, 7, 5)      -> " + str(max(3, 7, 5)))^0
("  min(3, 7, 5)      -> " + str(min(3, 7, 5)))^0
# One argument: compare what is INSIDE it.
("  max([3, 7, 5])    -> " + str(max([3, 7, 5])))^0
("  max((3, 7, 5))    -> " + str(max((3, 7, 5))))^0
# A string is iterable, so one string argument compares its characters.
("  max(\"hello\")      -> " + repr(max("hello")))^0
# Two strings are two arguments, so these compare as whole strings.
("  max(\"pear\", \"fig\") -> " + repr(max("pear", "fig")))^0

""^0
"Ties keep the FIRST one seen" => h3
h3^0
# 2 and 2.0 are equal, so neither is strictly greater and the first survives.
# You can tell which one won by its repr: 2 is an int, 2.0 is a float.
("  max(2, 2.0) -> " + repr(max(2, 2.0)) + "   (int, the first argument)")^0
("  max(2.0, 2) -> " + repr(max(2.0, 2)) + " (float, the first argument)")^0

""^0
"A lone non-iterable is an error, not a one-item sequence" => h4
h4^0
try:
    max(5) => oops
    ("  max(5) returned " + str(oops) + " - this line should be unreachable")^0
except TypeError as e:
    ("  max(5) raised TypeError: " + str(e))^0

try:
    min([]) => empty
    ("  min([]) returned " + str(empty))^0
except ValueError as e:
    ("  min([]) raised ValueError: " + str(e))^0
```

## Python (deterministic transpilation)

```python
def spread(values):
    return max(values) - min(values)

datasets = [[42, 17, 93, 8, 61], [5, 5, 5], [0 - 3, 0 - 9, 0 - 1]]
h1 = "Per-dataset extremes"
print(h1)
for ds in datasets:
    print("  " + str(ds) + "  min=" + str(min(ds)) + "  max=" + str(max(ds)) + "  spread=" + str(spread(ds)))
print("")
h2 = "Argument form vs iterable form"
print(h2)
print("  max(3, 7, 5)      -> " + str(max(3, 7, 5)))
print("  min(3, 7, 5)      -> " + str(min(3, 7, 5)))
print("  max([3, 7, 5])    -> " + str(max([3, 7, 5])))
print("  max((3, 7, 5))    -> " + str(max((3, 7, 5))))
print("  max(\"hello\")      -> " + repr(max("hello")))
print("  max(\"pear\", \"fig\") -> " + repr(max("pear", "fig")))
print("")
h3 = "Ties keep the FIRST one seen"
print(h3)
print("  max(2, 2.0) -> " + repr(max(2, 2.0)) + "   (int, the first argument)")
print("  max(2.0, 2) -> " + repr(max(2.0, 2)) + " (float, the first argument)")
print("")
h4 = "A lone non-iterable is an error, not a one-item sequence"
print(h4)
try:
    oops = max(5)
    print("  max(5) returned " + str(oops) + " - this line should be unreachable")
except TypeError as e:
    print("  max(5) raised TypeError: " + str(e))
try:
    empty = min([])
    print("  min([]) returned " + str(empty))
except ValueError as e:
    print("  min([]) raised ValueError: " + str(e))
```

## stdout (executed)

```text
Per-dataset extremes
  [42, 17, 93, 8, 61]  min=8  max=93  spread=85
  [5, 5, 5]  min=5  max=5  spread=0
  [-3, -9, -1]  min=-9  max=-1  spread=8

Argument form vs iterable form
  max(3, 7, 5)      -> 7
  min(3, 7, 5)      -> 3
  max([3, 7, 5])    -> 7
  max((3, 7, 5))    -> 7
  max("hello")      -> 'o'
  max("pear", "fig") -> 'pear'

Ties keep the FIRST one seen
  max(2, 2.0) -> 2   (int, the first argument)
  max(2.0, 2) -> 2.0 (float, the first argument)

A lone non-iterable is an error, not a one-item sequence
  max(5) raised TypeError: 'int' object is not iterable
  min([]) raised ValueError: min() iterable argument is empty
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
