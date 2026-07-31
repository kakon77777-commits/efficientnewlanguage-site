<!-- canonical: efficientnewlanguage.org/ai/examples/182-route-path-builder | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 182 — Extending a path without mutating it

`route_path_builder.eml` — builds a route by concatenating tuples.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Building a route
# by concatenating tuples. `(a, b) + (c,)` is how you extend an immutable path
# without mutating the one you were given - each step produces a NEW path, so
# a caller holding the old one still has it intact.
#
# That is the property this case is really about: tuple concatenation returns a
# fresh tuple, which is what makes it safe to hand a path to a function that
# might extend it. A list would be extended in place by `.append` and the
# caller's copy would change under them.
#
# `tuple + tuple` raised TypeError here until this round. The concatenation
# branch handled str+str and list+list and simply had no tuple case - the fifth
# separate place a hand-written "which types are sequences" list had left tuple
# off.

def extend(path, stop):
    return path + (stop,)

def describe(path):
    "" => out
    for stop in path:
        if out == "":
            stop => out
        else:
            out + " -> " + stop => out
    return out

("depot",) => start
("Start: " + describe(start) + "  (length " + str(len(start)) + ")")^0
""^0

start => route
["north yard", "river crossing", "hilltop", "depot"] => stops
"Building the route one stop at a time:" => h
h^0
for stop in stops:
    extend(route, stop) => route
    ("  + " + stop + "  ->  " + str(len(route)) + " stops")^0

""^0
("Full route: " + describe(route))^0
("Stops: " + str(len(route)))^0
""^0

# The original is untouched: extend() never mutated what it was handed.
("The original start is still " + str(start) + " - concatenation returned a NEW tuple")^0
("Is the route a different object from the start? " + str(len(route) != len(start)))^0
""^0

# Concatenation composes, and the result is always a tuple.
("depot",) + ("via A",) + ("depot",) => loop
("A round trip: " + str(loop))^0
("Its type stays tuple, so it can key a dict: " + str(len({loop: "logged"})))^0
```

## Python (deterministic transpilation)

```python
def extend(path, stop):
    return path + (stop,)

def describe(path):
    out = ""
    for stop in path:
        if out == "":
            out = stop
        else:
            out = out + " -> " + stop
    return out

start = ("depot",)
print("Start: " + describe(start) + "  (length " + str(len(start)) + ")")
print("")
route = start
stops = ["north yard", "river crossing", "hilltop", "depot"]
h = "Building the route one stop at a time:"
print(h)
for stop in stops:
    route = extend(route, stop)
    print("  + " + stop + "  ->  " + str(len(route)) + " stops")
print("")
print("Full route: " + describe(route))
print("Stops: " + str(len(route)))
print("")
print("The original start is still " + str(start) + " - concatenation returned a NEW tuple")
print("Is the route a different object from the start? " + str(len(route) != len(start)))
print("")
loop = ("depot",) + ("via A",) + ("depot",)
print("A round trip: " + str(loop))
print("Its type stays tuple, so it can key a dict: " + str(len({loop: "logged"})))
```

## stdout (executed)

```text
Start: depot  (length 1)

Building the route one stop at a time:
  + north yard  ->  2 stops
  + river crossing  ->  3 stops
  + hilltop  ->  4 stops
  + depot  ->  5 stops

Full route: depot -> north yard -> river crossing -> hilltop -> depot
Stops: 5

The original start is still ('depot',) - concatenation returned a NEW tuple
Is the route a different object from the start? True

A round trip: ('depot', 'via A', 'depot')
Its type stays tuple, so it can key a dict: 1
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
