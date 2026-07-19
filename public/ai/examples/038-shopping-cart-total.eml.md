<!-- canonical: efficientnewlanguage.org/ai/examples/038-shopping-cart-total | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 038 — Shopping cart total

`shopping_cart_total.eml` models a shopping cart as a list of `(item_name, unit_price, quantity)` tuples and prints an itemized receipt with a grand total — one of a seven-case self-authored batch of list/collection utilities for the EML case corpus (see [`examples/list-statistics/`](../list-statistics/), [`examples/duplicate-remover/`](../duplicate-remover/), [`examples/list-rotator/`](../list-rotator/), [`examples/matrix-transpose-manual/`](../matrix-transpose-manual/), [`examples/intersection-union-finder/`](../intersection-union-finder/), and [`examples/second-largest-finder/`](../second-largest-finder/) for the other six).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A shopping
# cart as a list of `(item_name, unit_price, quantity)` tuples; computes
# each line-item subtotal and the grand total via a loop with tuple
# subscript access, then prints an itemized receipt using `%`-string
# formatting. `"%.2f" % (x,)` was tried first and works under real Python,
# but the interpreter's own `%`-formatter throws `ValueError: unsupported
# format character '.'` (precision specs aren't modeled) — so amounts are
# rounded to the nearest cent by hand (`int(x * 100 + 0.5)`) and rendered as
# a zero-padded "dollars.cents" string via `%s`/`%d`, wrapped in a small
# `format_money` helper to avoid repeating that logic per line.

cart^+[("Coffee Beans (12oz)", 8.99, 2), ("Almond Milk", 3.49, 3),
       ("Granola Bars (6-pack)", 4.25, 1), ("Bananas (lb)", 0.50, 6)]

def format_money(amount):
    int(amount * 100 + 0.5) => cents_total
    int(cents_total / 100) => dollars
    (cents_total % 100) => cents_rem
    if cents_rem < 10:
        "0" + str(cents_rem) => cents_str
    else:
        str(cents_rem) => cents_str
    return str(dollars) + "." + cents_str

grand_total^+0
"Receipt:"^0
for entry in cart:
    entry[0] => name
    entry[1] => unit_price
    entry[2] => qty
    (unit_price * qty) => subtotal
    grand_total^+subtotal
    format_money(subtotal) => price_str
    ("%s x%d = $%s" % (name, qty, price_str)) => line
    line^0

format_money(grand_total) => total_str
("Grand total: $" + total_str) => grand_line
grand_line^0
```

## Python (deterministic transpilation)

```python
cart = [("Coffee Beans (12oz)", 8.99, 2), ("Almond Milk", 3.49, 3), ("Granola Bars (6-pack)", 4.25, 1), ("Bananas (lb)", 0.50, 6)]

def format_money(amount):
    cents_total = int(amount * 100 + 0.5)
    dollars = int(cents_total / 100)
    cents_rem = cents_total % 100
    if cents_rem < 10:
        cents_str = "0" + str(cents_rem)
    else:
        cents_str = str(cents_rem)
    return str(dollars) + "." + cents_str

grand_total = 0
print("Receipt:")
for entry in cart:
    name = entry[0]
    unit_price = entry[1]
    qty = entry[2]
    subtotal = unit_price * qty
    grand_total += subtotal
    price_str = format_money(subtotal)
    line = "%s x%d = $%s" % (name, qty, price_str)
    print(line)
total_str = format_money(grand_total)
grand_line = "Grand total: $" + total_str
print(grand_line)
```

## stdout (executed)

```text
Receipt:
Coffee Beans (12oz) x2 = $17.98
Almond Milk x3 = $10.47
Granola Bars (6-pack) x1 = $4.25
Bananas (lb) x6 = $3.00
Grand total: $35.70
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:augment · eml:call · eml:return · eml:run:done
