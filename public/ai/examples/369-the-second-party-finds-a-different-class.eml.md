<!-- canonical: efficientnewlanguage.org/ai/examples/369-the-second-party-finds-a-different-class | ai_layer_version: 0.1.0 | updated: 2026-08-13 -->

# Example 369 — The second party finds a different class — 5 found against 7, and 1 that mattered

`the_second_party_finds_a_different_class.eml` runs two searchers over one defect population and computes every region of the overlap.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A second checker
# is added, and the useful question is not how many more they find.
#
# The builder searches from the inside: they know which code is subtle, which
# invariant is load-bearing, which shortcut they took on a Friday. That search
# is strong exactly where the code is complicated and blind where the code is
# simple and wrong in a way that only shows from outside.
#
# The outside checker searches from behaviour. That search is strong where the
# system renders something and blind where a defect never reaches an output.
#
# Both are competent. The number worth measuring is not |B| but |B minus A| -
# and, more usefully, |neither|.
#
# Nothing is declared. Each searcher is a rule over defect properties, and
# every set is computed by running both searchers over the same population.

# [id, observable from outside, needs internal knowledge, in the builder's area]
[["d1", 1, 0, 1], ["d2", 1, 0, 0], ["d3", 0, 1, 1], ["d4", 0, 1, 0], ["d5", 1, 1, 1], ["d6", 1, 1, 0], ["d7", 0, 0, 1], ["d8", 0, 0, 0], ["d9", 1, 0, 1], ["d10", 0, 1, 0]] => defects

def builder_finds(d):
    # the builder finds what needs internal knowledge, and what is observable
    # inside the part they own
    if d[2] == 1:
        return 1
    if d[1] == 1:
        if d[3] == 1:
            return 1
    return 0

def checker_finds(d):
    # the outside checker finds what the system renders
    if d[1] == 1:
        return 1
    return 0

def found_by(rule_id):
    [] => s
    for d in defects:
        0 => hit
        if rule_id == 1:
            builder_finds(d) => hit
        else:
            checker_finds(d) => hit
        if hit == 1:
            s + [d[0]] => s
    return s

found_by(1) => by_builder
found_by(2) => by_checker

def in_list(x, xs):
    for y in xs:
        if y == x:
            return 1
    return 0

# ---- the two searches ----

"defects in the population : " + str(len(defects)) ^0
"  found by the builder : " + str(len(by_builder)) + "  " + repr(by_builder) ^0
"  found by the checker : " + str(len(by_checker)) + "  " + repr(by_checker) ^0
"" ^0

# ---- overlap ----

[] => both
[] => builder_only
[] => checker_only
[] => neither
for d in defects:
    builder_finds(d) => b
    checker_finds(d) => c
    if b == 1:
        if c == 1:
            both + [d[0]] => both
        else:
            builder_only + [d[0]] => builder_only
    else:
        if c == 1:
            checker_only + [d[0]] => checker_only
        else:
            neither + [d[0]] => neither

"  found by both       : " + str(len(both)) + "  " + repr(both) ^0
"  builder only        : " + str(len(builder_only)) + "  " + repr(builder_only) ^0
"  checker only        : " + str(len(checker_only)) + "  " + repr(checker_only) ^0
"  found by NEITHER    : " + str(len(neither)) + "  " + repr(neither) ^0
"" ^0

len(both) + len(builder_only) + len(checker_only) => union
"union of the two searches : " + str(union) + " of " + str(len(defects)) ^0
"" ^0

# ---- what adding the checker actually bought ----

"adding the second checker" ^0
"  defects the builder already had : " + str(len(by_builder)) ^0
"  new defects the checker adds    : " + str(len(checker_only)) ^0
if len(by_checker) <= len(by_builder):
    "  the checker found FEWER in total than the builder" ^0
else:
    "  the checker found more in total than the builder" ^0
"  and they still overlap on : " + str(len(both)) ^0
"" ^0

# ---- a second checker of the same kind ----
#
# Two outside checkers search the same way. Whatever the second one adds is
# measured, not assumed.

def checker2_finds(d):
    return checker_finds(d)

0 => second_checker_new
for d in defects:
    if checker2_finds(d) == 1:
        if checker_finds(d) == 0:
            second_checker_new + 1 => second_checker_new
"a second checker searching the same way adds : " + str(second_checker_new) ^0
"a checker searching the other way added      : " + str(len(checker_only)) ^0
"" ^0

# ---- what would reach the ones neither found ----
#
# The unfound set has a property. Compute it rather than guess it.

"the defects neither party found" ^0
0 => unfound_observable
0 => unfound_internal
for d in defects:
    if builder_finds(d) == 0:
        if checker_finds(d) == 0:
            if d[1] == 1:
                unfound_observable + 1 => unfound_observable
            if d[2] == 1:
                unfound_internal + 1 => unfound_internal
"  of the " + str(len(neither)) + " unfound, observable from outside : " + str(unfound_observable) ^0
"  of the " + str(len(neither)) + " unfound, needing internal knowledge : " + str(unfound_internal) ^0
if unfound_observable == 0:
    if unfound_internal == 0:
        "  they are neither observable nor internally obvious - which is why" ^0
        "  neither search reaches them, and why a third searcher of either" ^0
        "  existing kind would not either" ^0
"" ^0

"Adding a checker does not raise the ceiling by their headcount. It raises it" ^0
"by the part of their search that does not overlap, and that part is decided" ^0
"by where they stand, not by how hard they look." ^0
```

## Python (deterministic transpilation)

```python
defects = [["d1", 1, 0, 1], ["d2", 1, 0, 0], ["d3", 0, 1, 1], ["d4", 0, 1, 0], ["d5", 1, 1, 1], ["d6", 1, 1, 0], ["d7", 0, 0, 1], ["d8", 0, 0, 0], ["d9", 1, 0, 1], ["d10", 0, 1, 0]]

def builder_finds(d):
    if d[2] == 1:
        return 1
    if d[1] == 1:
        if d[3] == 1:
            return 1
    return 0

def checker_finds(d):
    if d[1] == 1:
        return 1
    return 0

def found_by(rule_id):
    s = []
    for d in defects:
        hit = 0
        if rule_id == 1:
            hit = builder_finds(d)
        else:
            hit = checker_finds(d)
        if hit == 1:
            s = s + [d[0]]
    return s

by_builder = found_by(1)
by_checker = found_by(2)

def in_list(x, xs):
    for y in xs:
        if y == x:
            return 1
    return 0

print("defects in the population : " + str(len(defects)))
print("  found by the builder : " + str(len(by_builder)) + "  " + repr(by_builder))
print("  found by the checker : " + str(len(by_checker)) + "  " + repr(by_checker))
print("")
both = []
builder_only = []
checker_only = []
neither = []
for d in defects:
    b = builder_finds(d)
    c = checker_finds(d)
    if b == 1:
        if c == 1:
            both = both + [d[0]]
        else:
            builder_only = builder_only + [d[0]]
    elif c == 1:
        checker_only = checker_only + [d[0]]
    else:
        neither = neither + [d[0]]
print("  found by both       : " + str(len(both)) + "  " + repr(both))
print("  builder only        : " + str(len(builder_only)) + "  " + repr(builder_only))
print("  checker only        : " + str(len(checker_only)) + "  " + repr(checker_only))
print("  found by NEITHER    : " + str(len(neither)) + "  " + repr(neither))
print("")
union = len(both) + len(builder_only) + len(checker_only)
print("union of the two searches : " + str(union) + " of " + str(len(defects)))
print("")
print("adding the second checker")
print("  defects the builder already had : " + str(len(by_builder)))
print("  new defects the checker adds    : " + str(len(checker_only)))
if len(by_checker) <= len(by_builder):
    print("  the checker found FEWER in total than the builder")
else:
    print("  the checker found more in total than the builder")
print("  and they still overlap on : " + str(len(both)))
print("")

def checker2_finds(d):
    return checker_finds(d)

second_checker_new = 0
for d in defects:
    if checker2_finds(d) == 1:
        if checker_finds(d) == 0:
            second_checker_new = second_checker_new + 1
print("a second checker searching the same way adds : " + str(second_checker_new))
print("a checker searching the other way added      : " + str(len(checker_only)))
print("")
print("the defects neither party found")
unfound_observable = 0
unfound_internal = 0
for d in defects:
    if builder_finds(d) == 0:
        if checker_finds(d) == 0:
            if d[1] == 1:
                unfound_observable = unfound_observable + 1
            if d[2] == 1:
                unfound_internal = unfound_internal + 1
print("  of the " + str(len(neither)) + " unfound, observable from outside : " + str(unfound_observable))
print("  of the " + str(len(neither)) + " unfound, needing internal knowledge : " + str(unfound_internal))
if unfound_observable == 0:
    if unfound_internal == 0:
        print("  they are neither observable nor internally obvious - which is why")
        print("  neither search reaches them, and why a third searcher of either")
        print("  existing kind would not either")
print("")
print("Adding a checker does not raise the ceiling by their headcount. It raises it")
print("by the part of their search that does not overlap, and that part is decided")
print("by where they stand, not by how hard they look.")
```

## stdout (executed)

```text
defects in the population : 10
  found by the builder : 7  ['d1', 'd3', 'd4', 'd5', 'd6', 'd9', 'd10']
  found by the checker : 5  ['d1', 'd2', 'd5', 'd6', 'd9']

  found by both       : 4  ['d1', 'd5', 'd6', 'd9']
  builder only        : 3  ['d3', 'd4', 'd10']
  checker only        : 1  ['d2']
  found by NEITHER    : 2  ['d7', 'd8']

union of the two searches : 8 of 10

adding the second checker
  defects the builder already had : 7
  new defects the checker adds    : 1
  the checker found FEWER in total than the builder
  and they still overlap on : 4

a second checker searching the same way adds : 0
a checker searching the other way added      : 1

the defects neither party found
  of the 2 unfound, observable from outside : 0
  of the 2 unfound, needing internal knowledge : 0
  they are neither observable nor internally obvious - which is why
  neither search reaches them, and why a third searcher of either
  existing kind would not either

Adding a checker does not raise the ceiling by their headcount. It raises it
by the part of their search that does not overlap, and that part is decided
by where they stand, not by how hard they look.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
