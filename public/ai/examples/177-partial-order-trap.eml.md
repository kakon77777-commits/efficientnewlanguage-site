<!-- canonical: efficientnewlanguage.org/ai/examples/177-partial-order-trap | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 177 — Sorting by a partial order

`partial_order_trap.eml` — runs the same sort over the same sets in two input orders.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Sorting by a
# comparison that is only a PARTIAL order - and what the result actually means.
#
# Numbers are totally ordered: for any a and b, exactly one of a < b, a == b,
# a > b holds. Sets are not. For {1,2} and {2,3}, ALL of <, <=, >, >= are
# False, and neither is "smaller".
#
# A sort routine does not know that. Written against a partial order it still
# terminates and still returns something, and the something is an ARBITRARY
# arrangement of the incomparable elements - it depends only on the order they
# happened to arrive in. Nothing raises. The program below runs the SAME sort
# over the SAME sets in two different input orders and prints both results, so
# the arbitrariness is visible rather than argued.

def insertion_sort_sets(items):
    [] => out
    for x in items:
        [] => merged
        0 => placed
        for y in out:
            if placed == 0:
                if x < y:
                    merged + [x] => merged
                    1 => placed
            merged + [y] => merged
        if placed == 0:
            merged + [x] => merged
        merged => out
    return out

def render(sets, names):
    "" => shown
    for s in sets:
        "?" => label
        for entry in names:
            if entry[1] == s:
                entry[0] => label
        if shown == "":
            label => shown
        else:
            shown + " " + label => shown
    return shown

{1} => a
{1, 2} => b
{2, 3} => c
[["a", a], ["b", b], ["c", c]] => names

"The three sets" => h
h^0
("  a = {1}     b = {1,2}   c = {2,3}")^0
""^0
"Which pairs are comparable?" => h2
h2^0
("  a < b : " + str(a < b) + "     (a is a proper subset of b)")^0
("  b < c : " + str(b < c) + "    b > c : " + str(b > c) + "   <- neither! incomparable")^0
("  a < c : " + str(a < c) + "    a > c : " + str(a > c) + "   <- also incomparable")^0
""^0

"Sorting the same three sets, in two input orders" => h3
h3^0
insertion_sort_sets([a, b, c]) => order1
insertion_sort_sets([c, b, a]) => order2
("  input a b c  ->  " + render(order1, names))^0
("  input c b a  ->  " + render(order2, names))^0
("  same sort, same values, different answers: " + str(render(order1, names) != render(order2, names)))^0
""^0

"Why this is worse than an error" => h4
h4^0
"  Nothing raised. Both runs produced a plausible-looking list." => n1
n1^0
"  A partial order gives a sort no reason to prefer either arrangement," => n2
n2^0
"  so the output records arrival order dressed up as a ranking." => n3
n3^0
""^0
"  If you need a stable ranking, sort by something TOTAL - the size," => n4
n4^0
("  for instance: a=" + str(len(a)) + " b=" + str(len(b)) + " c=" + str(len(c)) + ", which never leaves two items tied-and-unordered.")^0
```

## Python (deterministic transpilation)

```python
def insertion_sort_sets(items):
    out = []
    for x in items:
        merged = []
        placed = 0
        for y in out:
            if placed == 0:
                if x < y:
                    merged = merged + [x]
                    placed = 1
            merged = merged + [y]
        if placed == 0:
            merged = merged + [x]
        out = merged
    return out

def render(sets, names):
    shown = ""
    for s in sets:
        label = "?"
        for entry in names:
            if entry[1] == s:
                label = entry[0]
        if shown == "":
            shown = label
        else:
            shown = shown + " " + label
    return shown

a = {1}
b = {1, 2}
c = {2, 3}
names = [["a", a], ["b", b], ["c", c]]
h = "The three sets"
print(h)
print("  a = {1}     b = {1,2}   c = {2,3}")
print("")
h2 = "Which pairs are comparable?"
print(h2)
print("  a < b : " + str(a < b) + "     (a is a proper subset of b)")
print("  b < c : " + str(b < c) + "    b > c : " + str(b > c) + "   <- neither! incomparable")
print("  a < c : " + str(a < c) + "    a > c : " + str(a > c) + "   <- also incomparable")
print("")
h3 = "Sorting the same three sets, in two input orders"
print(h3)
order1 = insertion_sort_sets([a, b, c])
order2 = insertion_sort_sets([c, b, a])
print("  input a b c  ->  " + render(order1, names))
print("  input c b a  ->  " + render(order2, names))
print("  same sort, same values, different answers: " + str(render(order1, names) != render(order2, names)))
print("")
h4 = "Why this is worse than an error"
print(h4)
n1 = "  Nothing raised. Both runs produced a plausible-looking list."
print(n1)
n2 = "  A partial order gives a sort no reason to prefer either arrangement,"
print(n2)
n3 = "  so the output records arrival order dressed up as a ranking."
print(n3)
print("")
n4 = "  If you need a stable ranking, sort by something TOTAL - the size,"
print(n4)
print("  for instance: a=" + str(len(a)) + " b=" + str(len(b)) + " c=" + str(len(c)) + ", which never leaves two items tied-and-unordered.")
```

## stdout (executed)

```text
The three sets
  a = {1}     b = {1,2}   c = {2,3}

Which pairs are comparable?
  a < b : True     (a is a proper subset of b)
  b < c : False    b > c : False   <- neither! incomparable
  a < c : False    a > c : False   <- also incomparable

Sorting the same three sets, in two input orders
  input a b c  ->  a b c
  input c b a  ->  c a b
  same sort, same values, different answers: True

Why this is worse than an error
  Nothing raised. Both runs produced a plausible-looking list.
  A partial order gives a sort no reason to prefer either arrangement,
  so the output records arrival order dressed up as a ranking.

  If you need a stable ranking, sort by something TOTAL - the size,
  for instance: a=1 b=2 c=2, which never leaves two items tied-and-unordered.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
