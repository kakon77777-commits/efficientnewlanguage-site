<!-- canonical: efficientnewlanguage.org/ai/examples/183-set-order-discipline | ai_layer_version: 0.1.0 | updated: 2026-07-31 -->

# Example 183 — What you may and may not ask a set

`set_order_discipline.eml` — states the line between order-free and order-dependent set operations.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). What you may and
# may not ask a set, and why the line falls where it does.
#
# A set has no defined order. CPython still PRINTS one - its internal hash
# order - and that order is neither insertion order nor sorted order:
#
#   list({"washers", "rivets"})  ->  ['rivets', 'washers']
#   list({3, 1, 2})              ->  [1, 2, 3]
#
# This interpreter stores insertion order. It cannot reproduce CPython's hash
# order without reimplementing CPython's hash table, so anything that would
# EXPOSE an order defers to real Python instead of inventing one:
#
#   iterating a set          defers
#   printing a set of 2+     defers
#   summing a set of floats  defers   (addition is not associative)
#
# Everything whose answer cannot depend on the order still works, and that is
# most of what a set is actually for.

def has_all(required, held):
    return required <= held

{"tea", "coffee", "cocoa"} => stock
["cocoa", "coffee", "tea", "water"] => menu

"Order-free questions: all fine" => h
h^0
("  len(stock)          -> " + str(len(stock)))^0
("  \"tea\" in stock      -> " + str("tea" in stock))^0
("  \"water\" in stock    -> " + str("water" in stock))^0
("  {\"tea\"} <= stock    -> " + str({"tea"} <= stock))^0
("  len(stock - {\"tea\"}) -> " + str(len(stock - {"tea"})))^0
""^0

"Reporting the contents, in an order the PROGRAM picks" => h2
h2^0
"" => listed
for item in menu:
    if item in stock:
        if listed == "":
            item => listed
        else:
            listed + ", " + item => listed
("  walking the menu: " + listed)^0
("  the menu is a LIST, so this line is identical on every runtime")^0
""^0

# A 0- or 1-element set has only one possible rendering, so it prints normally.
"Sets small enough to have one rendering print fine" => h3
h3^0
("  empty      -> " + str(set()))^0
("  one member -> " + str({"tea"}))^0
("  larger sets defer instead of guessing an order")^0
""^0

"The rule, stated once" => h4
h4^0
"  Use a set to ANSWER a question. Use a list to PRODUCE a sequence." => r1
r1^0
"  Relying on set order means relying on something Python never promised," => r2
r2^0
"  so a runtime that refuses is telling you the truth about your program." => r3
r3^0
""^0
("Ordered check via the menu: does stock cover the first three? " + str(has_all({"cocoa", "coffee", "tea"}, stock)))^0
```

## Python (deterministic transpilation)

```python
def has_all(required, held):
    return required <= held

stock = {"tea", "coffee", "cocoa"}
menu = ["cocoa", "coffee", "tea", "water"]
h = "Order-free questions: all fine"
print(h)
print("  len(stock)          -> " + str(len(stock)))
print("  \"tea\" in stock      -> " + str("tea" in stock))
print("  \"water\" in stock    -> " + str("water" in stock))
print("  {\"tea\"} <= stock    -> " + str({"tea"} <= stock))
print("  len(stock - {\"tea\"}) -> " + str(len(stock - {"tea"})))
print("")
h2 = "Reporting the contents, in an order the PROGRAM picks"
print(h2)
listed = ""
for item in menu:
    if item in stock:
        if listed == "":
            listed = item
        else:
            listed = listed + ", " + item
print("  walking the menu: " + listed)
print("  the menu is a LIST, so this line is identical on every runtime")
print("")
h3 = "Sets small enough to have one rendering print fine"
print(h3)
print("  empty      -> " + str(set()))
print("  one member -> " + str({"tea"}))
print("  larger sets defer instead of guessing an order")
print("")
h4 = "The rule, stated once"
print(h4)
r1 = "  Use a set to ANSWER a question. Use a list to PRODUCE a sequence."
print(r1)
r2 = "  Relying on set order means relying on something Python never promised,"
print(r2)
r3 = "  so a runtime that refuses is telling you the truth about your program."
print(r3)
print("")
print("Ordered check via the menu: does stock cover the first three? " + str(has_all({"cocoa", "coffee", "tea"}, stock)))
```

## stdout (executed)

```text
Order-free questions: all fine
  len(stock)          -> 3
  "tea" in stock      -> True
  "water" in stock    -> False
  {"tea"} <= stock    -> True
  len(stock - {"tea"}) -> 2

Reporting the contents, in an order the PROGRAM picks
  walking the menu: cocoa, coffee, tea
  the menu is a LIST, so this line is identical on every runtime

Sets small enough to have one rendering print fine
  empty      -> set()
  one member -> {'tea'}
  larger sets defer instead of guessing an order

The rule, stated once
  Use a set to ANSWER a question. Use a list to PRODUCE a sequence.
  Relying on set order means relying on something Python never promised,
  so a runtime that refuses is telling you the truth about your program.

Ordered check via the menu: does stock cover the first three? True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
