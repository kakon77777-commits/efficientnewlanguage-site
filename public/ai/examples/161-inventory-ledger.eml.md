<!-- canonical: efficientnewlanguage.org/ai/examples/161-inventory-ledger | ai_layer_version: 0.1.0 | updated: 2026-07-30 -->

# Example 161 — A dict iterates in insertion order

`inventory_ledger.eml` compares stock levels against reorder floors and prints a report by walking the dict.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A small stock
# ledger, written to lean on the one guarantee that makes dicts pleasant to
# report from: since Python 3.7, a dict iterates in INSERTION order.
#
# That is a language promise, not an implementation accident, which is why a
# report built by walking a dict comes out in the order the entries were
# added rather than in some hash order that changes between runs. (Sets make
# the opposite choice - see examples/unique-tag-collector.)
#
# `for key in <dict>` did not work here until this case was written. The
# interpreter's for-loop accepted only list, tuple and str and raised
# TypeError on a dict, where Python iterates the keys. It went unnoticed
# because every corpus program that used a dict subscripted it rather than
# iterating it.

def restock_needed(level, floor):
    if level < floor:
        return floor - level
    return 0

{"bolts": 120, "washers": 8, "nuts": 64, "screws": 3} => stock
{"bolts": 50, "washers": 25, "nuts": 40, "screws": 30} => floors

("Line items: " + str(len(stock)))^0
""^0

"item      level  floor  action" => header
header^0
"--------- -----  -----  ------------------" => rule
rule^0

0 => short_count
0 => total_to_order
# Walking the dict gives the keys in the order they were written above.
for item in stock:
    stock[item] => level
    floors[item] => floor
    restock_needed(level, floor) => need
    if need > 0:
        "ORDER " + str(need) => action
        short_count + 1 => short_count
        total_to_order + need => total_to_order
    else:
        "ok" => action
    10 - len(item) => pad
    if pad < 1:
        1 => pad
    (item + " " * pad + str(level) + "      " + str(floor) + "     " + action)^0

""^0
("Below floor: " + str(short_count) + " of " + str(len(stock)))^0
("Units to order: " + str(total_to_order))^0
""^0

# Order-free questions do not care how the dict is walked.
[120, 8, 64, 3] => levels
("Total units held: " + str(sum(levels)))^0
("Largest line: " + str(max(levels)) + ", smallest: " + str(min(levels)))^0
""^0

# Insertion order is observable, and it is the order above - not alphabetical,
# and not sorted by level.
"Report order is insertion order:" => n1
n1^0
"" => joined
for item in stock:
    joined + item + " " => joined
("  " + joined)^0
```

## Python (deterministic transpilation)

```python
def restock_needed(level, floor):
    if level < floor:
        return floor - level
    return 0

stock = {"bolts": 120, "washers": 8, "nuts": 64, "screws": 3}
floors = {"bolts": 50, "washers": 25, "nuts": 40, "screws": 30}
print("Line items: " + str(len(stock)))
print("")
header = "item      level  floor  action"
print(header)
rule = "--------- -----  -----  ------------------"
print(rule)
short_count = 0
total_to_order = 0
for item in stock:
    level = stock[item]
    floor = floors[item]
    need = restock_needed(level, floor)
    if need > 0:
        action = "ORDER " + str(need)
        short_count = short_count + 1
        total_to_order = total_to_order + need
    else:
        action = "ok"
    pad = 10 - len(item)
    if pad < 1:
        pad = 1
    print(item + " " * pad + str(level) + "      " + str(floor) + "     " + action)
print("")
print("Below floor: " + str(short_count) + " of " + str(len(stock)))
print("Units to order: " + str(total_to_order))
print("")
levels = [120, 8, 64, 3]
print("Total units held: " + str(sum(levels)))
print("Largest line: " + str(max(levels)) + ", smallest: " + str(min(levels)))
print("")
n1 = "Report order is insertion order:"
print(n1)
joined = ""
for item in stock:
    joined = joined + item + " "
print("  " + joined)
```

## stdout (executed)

```text
Line items: 4

item      level  floor  action
--------- -----  -----  ------------------
bolts     120      50     ok
washers   8      25     ORDER 17
nuts      64      40     ok
screws    3      30     ORDER 27

Below floor: 2 of 4
Units to order: 44

Total units held: 195
Largest line: 120, smallest: 3

Report order is insertion order:
  bolts washers nuts screws
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:output · eml:call · eml:return · eml:run:done
