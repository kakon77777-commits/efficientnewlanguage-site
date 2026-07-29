<!-- canonical: efficientnewlanguage.org/ai/examples/142-dict-inventory-report | ai_layer_version: 0.1.0 | updated: 2026-07-29 -->

# Example 142 — Dictionaries as the primary structure

`dict_inventory_report.eml` builds an inventory around a dict — seven corpus programs used a dict literal, none of them centrally.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Dictionaries as
# the primary data structure rather than an incidental one - seven corpus
# programs used a dict literal, none of them centrally.
#
# EML has dict literals, subscript read and write, `in` membership, and `len`.
# It does NOT have `.keys()`, `.values()`, `.items()`, `.get()` or iteration
# over a dict, so a program that needs an ordered walk keeps its own key list
# alongside. That is a real constraint and the case is built around it rather
# than pretending otherwise.
#
# The check at the end is the reason this is a case and not a demo: after all
# the restocking and selling, the recorded total is compared against a total
# recomputed from scratch. A dict write that landed on the wrong key would
# leave both numbers self-consistent-looking but different from each other.

{"widget": 12, "gasket": 3, "flange": 40} => stock
prices^+{"widget": 2.5, "gasket": 0.75, "flange": 11.0}
order^+["widget", "gasket", "flange"]

def line(name, qty, price):
    return "  %-8s %4d x %6.2f = %8.2f" % (name, qty, price, qty * price)

"Opening inventory:" => h1
h1^0
for name in order:
    (line(name, stock[name], prices[name]))^0

0.0 => opening_value
for name in order:
    opening_value + stock[name] * prices[name] => opening_value
("  opening value: %.2f" % (opening_value,))^0

""^0
"Transactions:" => h2
h2^0
moves^+[["widget", 8], ["gasket", 0 - 2], ["flange", 0 - 15], ["widget", 0 - 30], ["sprocket", 5]]

0.0 => delta
0 => rejected
for m in moves:
    m[0] => name
    m[1] => qty
    if not name in stock:
        rejected + 1 => rejected
        ("  %-8s rejected: unknown item" % (name,))^0
    else:
        if stock[name] + qty < 0:
            rejected + 1 => rejected
            ("  %-8s rejected: only %d in stock, asked for %d" % (name, stock[name], 0 - qty))^0
        else:
            stock[name] + qty => stock[name]
            delta + qty * prices[name] => delta
            ("  %-8s %+4d -> %4d" % (name, qty, stock[name]))^0

""^0
"Closing inventory:" => h3
h3^0
for name in order:
    (line(name, stock[name], prices[name]))^0

0.0 => closing_value
for name in order:
    closing_value + stock[name] * prices[name] => closing_value

("  recorded:   %.2f + %.2f = %.2f" % (opening_value, delta, opening_value + delta))^0
("  recomputed: %.2f" % (closing_value,))^0

opening_value + delta - closing_value => gap
if gap < 0.000001 and gap > 0 - 0.000001:
    "  The running total and the recomputed total agree." => v
else:
    "  MISMATCH - a write landed on the wrong key." => v
v^0

""^0
("Items tracked: " + str(len(stock)) + ".  Rejected moves: " + str(rejected) + ".")^0
("\"sprocket\" in stock -> " + str("sprocket" in stock) + " (rejected, never added)")^0
("\"widget\" in stock   -> " + str("widget" in stock))^0
```

## Python (deterministic transpilation)

```python
stock = {"widget": 12, "gasket": 3, "flange": 40}
prices = {"widget": 2.5, "gasket": 0.75, "flange": 11.0}
order = ["widget", "gasket", "flange"]

def line(name, qty, price):
    return "  %-8s %4d x %6.2f = %8.2f" % (name, qty, price, qty * price)

h1 = "Opening inventory:"
print(h1)
for name in order:
    print(line(name, stock[name], prices[name]))
opening_value = 0.0
for name in order:
    opening_value = opening_value + stock[name] * prices[name]
print("  opening value: %.2f" % (opening_value,))
print("")
h2 = "Transactions:"
print(h2)
moves = [["widget", 8], ["gasket", 0 - 2], ["flange", 0 - 15], ["widget", 0 - 30], ["sprocket", 5]]
delta = 0.0
rejected = 0
for m in moves:
    name = m[0]
    qty = m[1]
    if not name in stock:
        rejected = rejected + 1
        print("  %-8s rejected: unknown item" % (name,))
    elif stock[name] + qty < 0:
        rejected = rejected + 1
        print("  %-8s rejected: only %d in stock, asked for %d" % (name, stock[name], 0 - qty))
    else:
        stock[name] = stock[name] + qty
        delta = delta + qty * prices[name]
        print("  %-8s %+4d -> %4d" % (name, qty, stock[name]))
print("")
h3 = "Closing inventory:"
print(h3)
for name in order:
    print(line(name, stock[name], prices[name]))
closing_value = 0.0
for name in order:
    closing_value = closing_value + stock[name] * prices[name]
print("  recorded:   %.2f + %.2f = %.2f" % (opening_value, delta, opening_value + delta))
print("  recomputed: %.2f" % (closing_value,))
gap = opening_value + delta - closing_value
if gap < 0.000001 and gap > 0 - 0.000001:
    v = "  The running total and the recomputed total agree."
else:
    v = "  MISMATCH - a write landed on the wrong key."
print(v)
print("")
print("Items tracked: " + str(len(stock)) + ".  Rejected moves: " + str(rejected) + ".")
print("\"sprocket\" in stock -> " + str("sprocket" in stock) + " (rejected, never added)")
print("\"widget\" in stock   -> " + str("widget" in stock))
```

## stdout (executed)

```text
Opening inventory:
  widget     12 x   2.50 =    30.00
  gasket      3 x   0.75 =     2.25
  flange     40 x  11.00 =   440.00
  opening value: 472.25

Transactions:
  widget     +8 ->   20
  gasket     -2 ->    1
  flange    -15 ->   25
  widget   rejected: only 20 in stock, asked for 30
  sprocket rejected: unknown item

Closing inventory:
  widget     20 x   2.50 =    50.00
  gasket      1 x   0.75 =     0.75
  flange     25 x  11.00 =   275.00
  recorded:   472.25 + -146.50 = 325.75
  recomputed: 325.75
  The running total and the recomputed total agree.

Items tracked: 3.  Rejected moves: 2.
"sprocket" in stock -> False (rejected, never added)
"widget" in stock   -> True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
