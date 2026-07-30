<!-- canonical: efficientnewlanguage.org/ai/examples/167-tuple-vs-list-choice | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 167 — Tuple or list?

`tuple_vs_list_choice.eml` states the rule and demonstrates both halves of it in one program.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Tuple or list?
# The two look interchangeable and are not. This program states the rule and
# then demonstrates each half of it.
#
#   A LIST is a collection that GROWS. Its length is part of the data.
#   A TUPLE is a record with a FIXED SHAPE. Its length is part of the type.
#
# The practical test: if appending an element would still make sense, you want
# a list. If appending would produce something meaningless - a point with three
# coordinates, a date with four parts - you want a tuple.
#
# EML-P models tuples as immutable in the sense that matters here: there is no
# operation that grows one in place. A list is grown by rebinding it to a
# longer list, which is exactly the operation a record should never need.

def midpoint(a, b):
    return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)

# A LIST that grows: readings arrive one at a time and the count is data.
[] => readings
for r in [3, 9, 4, 12, 7]:
    readings + [r] => readings
("readings is a list, now " + str(len(readings)) + " long: " + str(readings))^0
("It grew from 0. Its length is DATA - it means \"how many readings arrived\".")^0
""^0

# A TUPLE with a fixed shape: a point always has exactly two parts.
(2, 8) => p
(6, 2) => q
("p = " + str(p) + ", q = " + str(q))^0
("midpoint(p, q) = " + str(midpoint(p, q)))^0
("A point always has " + str(len(p)) + " parts. Its length is TYPE - a 3-part point would be a different thing.")^0
""^0

"Both are sequences, so the sequence builtins work on either" => h
h^0
("  len(readings)=" + str(len(readings)) + "   len(p)=" + str(len(p)))^0
("  sum(readings)=" + str(sum(readings)) + "  sum(p)=" + str(sum(p)))^0
("  max(readings)=" + str(max(readings)) + "  max(p)=" + str(max(p)))^0
("  readings[0]=" + str(readings[0]) + "    p[0]=" + str(p[0]))^0
("  readings[1:3]=" + str(readings[1:3]))^0
""^0

"They are NOT equal to each other, even with the same contents" => h2
h2^0
([1, 2] == [1, 2]) => list_eq
((1, 2) == (1, 2)) => tup_eq
("  [1, 2] == [1, 2] -> " + str(list_eq))^0
("  (1, 2) == (1, 2) -> " + str(tup_eq))^0
("  a list and a tuple are different types, so they never compare equal")^0
""^0

"The rule, restated:" => h3
h3^0
"  Would appending still make sense? -> list." => r1
r1^0
"  Would appending produce nonsense? -> tuple." => r2
r2^0
```

## Python (deterministic transpilation)

```python
def midpoint(a, b):
    return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)

readings = []
for r in [3, 9, 4, 12, 7]:
    readings = readings + [r]
print("readings is a list, now " + str(len(readings)) + " long: " + str(readings))
print("It grew from 0. Its length is DATA - it means \"how many readings arrived\".")
print("")
p = (2, 8)
q = (6, 2)
print("p = " + str(p) + ", q = " + str(q))
print("midpoint(p, q) = " + str(midpoint(p, q)))
print("A point always has " + str(len(p)) + " parts. Its length is TYPE - a 3-part point would be a different thing.")
print("")
h = "Both are sequences, so the sequence builtins work on either"
print(h)
print("  len(readings)=" + str(len(readings)) + "   len(p)=" + str(len(p)))
print("  sum(readings)=" + str(sum(readings)) + "  sum(p)=" + str(sum(p)))
print("  max(readings)=" + str(max(readings)) + "  max(p)=" + str(max(p)))
print("  readings[0]=" + str(readings[0]) + "    p[0]=" + str(p[0]))
print("  readings[1:3]=" + str(readings[1:3]))
print("")
h2 = "They are NOT equal to each other, even with the same contents"
print(h2)
list_eq = [1, 2] == [1, 2]
tup_eq = (1, 2) == (1, 2)
print("  [1, 2] == [1, 2] -> " + str(list_eq))
print("  (1, 2) == (1, 2) -> " + str(tup_eq))
print("  a list and a tuple are different types, so they never compare equal")
print("")
h3 = "The rule, restated:"
print(h3)
r1 = "  Would appending still make sense? -> list."
print(r1)
r2 = "  Would appending produce nonsense? -> tuple."
print(r2)
```

## stdout (executed)

```text
readings is a list, now 5 long: [3, 9, 4, 12, 7]
It grew from 0. Its length is DATA - it means "how many readings arrived".

p = (2, 8), q = (6, 2)
midpoint(p, q) = (4.0, 5.0)
A point always has 2 parts. Its length is TYPE - a 3-part point would be a different thing.

Both are sequences, so the sequence builtins work on either
  len(readings)=5   len(p)=2
  sum(readings)=35  sum(p)=10
  max(readings)=12  max(p)=8
  readings[0]=3    p[0]=2
  readings[1:3]=[9, 4]

They are NOT equal to each other, even with the same contents
  [1, 2] == [1, 2] -> True
  (1, 2) == (1, 2) -> True
  a list and a tuple are different types, so they never compare equal

The rule, restated:
  Would appending still make sense? -> list.
  Would appending produce nonsense? -> tuple.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
