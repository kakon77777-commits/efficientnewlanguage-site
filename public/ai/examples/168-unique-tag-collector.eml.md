<!-- canonical: efficientnewlanguage.org/ai/examples/168-unique-tag-collector | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 168 — Sets answer questions; lists produce sequences

`unique_tag_collector.eml` counts distinct tags and demonstrates the one thing EML-P deliberately **refuses** to do with a set.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A set answers
# "which distinct things did we see?" - and this program is as much about what
# EML-P deliberately REFUSES to do with one as about what it does.
#
# The refusal is the interesting part. CPython iterates a set in HASH order:
#
#     list({3, 1, 2})  ->  [1, 2, 3]        not insertion order
#
# This interpreter stores a set in insertion order, so iterating one here would
# yield 3, 1, 2 - a different sequence from the Python projection of the same
# program. Rather than emit our own order and be quietly wrong, `for x in <set>`
# declines and defers to real Python. The set still works for every question
# whose answer does NOT depend on order: membership, length, union by
# construction, and totals.
#
# That is the rule this case demonstrates: use a set to ANSWER, use a list to
# ITERATE. It is good advice in Python too, for the same reason - relying on
# set order is relying on something the language never promised.

def count_distinct(items):
    # Building a set from a list one element at a time is not available in
    # EML-P (`set(iterable)` is not modelled), so distinctness is counted the
    # explicit way: keep a list of firsts.
    [] => seen
    for item in items:
        # `not in` is not a single operator in EML-P - it is `not` applied to
        # the result of `in`, written with the grouping made explicit.
        if not (item in seen):
            # Lists grow by concatenation here, not `.append()` - `seen ^+ item`
            # would be `seen + item`, which is list + str and a TypeError.
            seen + [item] => seen
    return len(seen)

["blue", "green", "blue", "red", "green", "blue"] => tags

("Tags logged: " + str(len(tags)))^0
("Distinct tags: " + str(count_distinct(tags)))^0
""^0

# A set literal is fine to BUILD and to ask order-free questions of.
{"blue", "green", "red"} => palette
("Palette size: " + str(len(palette)))^0
("Is \"green\" in the palette? " + str("green" in palette))^0
("Is \"cyan\" in the palette?  " + str("cyan" in palette))^0
("An empty set() has length " + str(len(set())))^0
""^0

# Order-free numeric questions are safe too: a total cannot depend on the order
# of exact integers, so summing a set is allowed.
{10, 20, 30} => scores
("sum of {10, 20, 30} = " + str(sum(scores)) + "  (a total cannot depend on order)")^0
("max of {10, 20, 30} = " + str(max(scores)))^0
""^0

# When the ORDER of the output matters, use a list. This is the same content as
# `palette`, written as a sequence, and it prints in a defined order on every
# runtime.
["blue", "green", "red"] => ordered
"Iterating in a defined order:" => h
h^0
for colour in ordered:
    ("  " + colour)^0

""^0
"Rule of thumb: a set answers questions, a list produces sequences." => rule
rule^0
```

## Python (deterministic transpilation)

```python
def count_distinct(items):
    seen = []
    for item in items:
        if not item in seen:
            seen = seen + [item]
    return len(seen)

tags = ["blue", "green", "blue", "red", "green", "blue"]
print("Tags logged: " + str(len(tags)))
print("Distinct tags: " + str(count_distinct(tags)))
print("")
palette = {"blue", "green", "red"}
print("Palette size: " + str(len(palette)))
print("Is \"green\" in the palette? " + str("green" in palette))
print("Is \"cyan\" in the palette?  " + str("cyan" in palette))
print("An empty set() has length " + str(len(set())))
print("")
scores = {10, 20, 30}
print("sum of {10, 20, 30} = " + str(sum(scores)) + "  (a total cannot depend on order)")
print("max of {10, 20, 30} = " + str(max(scores)))
print("")
ordered = ["blue", "green", "red"]
h = "Iterating in a defined order:"
print(h)
for colour in ordered:
    print("  " + colour)
print("")
rule = "Rule of thumb: a set answers questions, a list produces sequences."
print(rule)
```

## stdout (executed)

```text
Tags logged: 6
Distinct tags: 3

Palette size: 3
Is "green" in the palette? True
Is "cyan" in the palette?  False
An empty set() has length 0

sum of {10, 20, 30} = 60  (a total cannot depend on order)
max of {10, 20, 30} = 30

Iterating in a defined order:
  blue
  green
  red

Rule of thumb: a set answers questions, a list produces sequences.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
