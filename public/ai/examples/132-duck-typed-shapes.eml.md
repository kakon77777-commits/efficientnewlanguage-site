<!-- canonical: efficientnewlanguage.org/ai/examples/132-duck-typed-shapes | ai_layer_version: 0.1.0 | updated: 2026-07-28 -->

# Example 132 — Polymorphism without inheritance

`duck_typed_shapes.eml` dispatches `area()` across five unrelated classes.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Polymorphic
# dispatch over several classes - WITHOUT inheritance, because EML-P does not
# have it.
#
# `class Square(Shape):` is a parse error today: the class grammar accepts a
# name and a colon, nothing else. That is worth stating plainly in the corpus
# rather than leaving a reader to discover it, and it is worth showing what you
# do instead, because the answer is not "wait for inheritance".
#
# The answer is duck typing. Every class below defines `area()` and `name()`;
# the loop calls them without knowing or asking which class it holds. Python
# resolves the method on the object, so the loop is polymorphic even though the
# classes share no ancestor and no declared interface.
#
# What you give up is the thing a base class would enforce: nothing here
# guarantees a shape HAS an `area()`. So the program checks it the way a
# language without inheritance has to - by calling it and seeing. The last
# entry is a class that is deliberately missing `area()`, and the loop reports
# it as a failure instead of crashing. That check is the point of the case: it
# is what a base class would have given for free, written out by hand.

class Square:
    def __init__(self, side):
        side => self.side
    def name(self):
        return "square(" + str(self.side) + ")"
    def area(self):
        return self.side * self.side

class Rectangle:
    def __init__(self, w, h):
        w => self.w
        h => self.h
    def name(self):
        return "rect(" + str(self.w) + "x" + str(self.h) + ")"
    def area(self):
        return self.w * self.h

class RightTriangle:
    def __init__(self, base, height):
        base => self.base
        height => self.height
    def name(self):
        return "triangle(" + str(self.base) + "," + str(self.height) + ")"
    def area(self):
        return self.base * self.height / 2

class Point:
    def __init__(self, x, y):
        x => self.x
        y => self.y
    def name(self):
        return "point(" + str(self.x) + "," + str(self.y) + ")"

shapes^+[Square(4), Rectangle(3, 5), RightTriangle(6, 4), Square(1), Point(2, 2)]

"Dispatching area() across five unrelated classes:" => header
header^0

0 => total
0 => measured
0 => skipped
for s in shapes:
    try:
        s.area() => a
        total + a => total
        measured + 1 => measured
        ("  " + s.name() + "\tarea " + str(a))^0
    except AttributeError:
        skipped + 1 => skipped
        ("  " + s.name() + "\tno area() - not a shape at all")^0

""^0
("Measured " + str(measured) + " shapes, skipped " + str(skipped) + ", total area " + str(total))^0

""^0
"Every class here is independent: no base class, no shared interface, no" => n1
n1^0
"registration. The loop works because each object answers area() and name()" => n2
n2^0
"when asked - and the one that cannot is caught, not assumed away." => n3
n3^0
"Expected total: 16 + 15 + 12 + 1 = 44, printed as 44.0 because the" => n4
n4^0
"triangle's area came from a division and float spreads through the sum." => n5
n5^0
```

## Python (deterministic transpilation)

```python
class Square:
    def __init__(self, side):
        self.side = side
    def name(self):
        return "square(" + str(self.side) + ")"
    def area(self):
        return self.side * self.side

class Rectangle:
    def __init__(self, w, h):
        self.w = w
        self.h = h
    def name(self):
        return "rect(" + str(self.w) + "x" + str(self.h) + ")"
    def area(self):
        return self.w * self.h

class RightTriangle:
    def __init__(self, base, height):
        self.base = base
        self.height = height
    def name(self):
        return "triangle(" + str(self.base) + "," + str(self.height) + ")"
    def area(self):
        return self.base * self.height / 2

class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y
    def name(self):
        return "point(" + str(self.x) + "," + str(self.y) + ")"

shapes = [Square(4), Rectangle(3, 5), RightTriangle(6, 4), Square(1), Point(2, 2)]
header = "Dispatching area() across five unrelated classes:"
print(header)
total = 0
measured = 0
skipped = 0
for s in shapes:
    try:
        a = s.area()
        total = total + a
        measured = measured + 1
        print("  " + s.name() + "\tarea " + str(a))
    except AttributeError:
        skipped = skipped + 1
        print("  " + s.name() + "\tno area() - not a shape at all")
print("")
print("Measured " + str(measured) + " shapes, skipped " + str(skipped) + ", total area " + str(total))
print("")
n1 = "Every class here is independent: no base class, no shared interface, no"
print(n1)
n2 = "registration. The loop works because each object answers area() and name()"
print(n2)
n3 = "when asked - and the one that cannot is caught, not assumed away."
print(n3)
n4 = "Expected total: 16 + 15 + 12 + 1 = 44, printed as 44.0 because the"
print(n4)
n5 = "triangle's area came from a division and float spreads through the sum."
print(n5)
```

## stdout (executed)

```text
Dispatching area() across five unrelated classes:
  square(4)	area 16
  rect(3x5)	area 15
  triangle(6,4)	area 12.0
  square(1)	area 1
  point(2,2)	no area() - not a shape at all

Measured 4 shapes, skipped 1, total area 44.0

Every class here is independent: no base class, no shared interface, no
registration. The loop works because each object answers area() and name()
when asked - and the one that cannot is caught, not assumed away.
Expected total: 16 + 15 + 12 + 1 = 44, printed as 44.0 because the
triangle's area came from a division and float spreads through the sum.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
