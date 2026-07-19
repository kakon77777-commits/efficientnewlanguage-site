<!-- canonical: efficientnewlanguage.org/ai/examples/025-inventory-tracker | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 025 — Case corpus: a self-authored stock inventory tracker

`inventory_tracker.eml` is a class-based case in a self-authored batch of six OOP utilities (alongside `examples/bank-account-simulator/`, `examples/simple-stack/`, `examples/simple-queue/`, `examples/library-catalog/`, and `examples/parking-lot-tracker/`) — part of growing the EML case corpus toward AI-native training scale, not a port of an existing project.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A class-based
# stock inventory tracker exercising a dict literal + subscript get/set
# through a `self` attribute (`self.stock`), `in` membership on a dict
# (Phase 7b), a parallel list of keys grown via `existing + [item] =>
# existing` for ordered reporting (the same dict + key-list idiom as
# word-frequency-counter's `counts` + `unique_words`), and `try`/`except`/
# `raise ValueError` for an insufficient-stock removal.

class Inventory:
    def __init__(self):
        {} => self.stock
        [] => self.products

    def add_stock(self, product, quantity):
        if product in self.stock:
            self.stock[product] + quantity => self.stock[product]
        else:
            quantity => self.stock[product]
            self.products + [product] => self.products

    def remove_stock(self, product, quantity):
        if not (product in self.stock):
            raise ValueError("no such product: " + product)
        if self.stock[product] < quantity:
            raise ValueError("insufficient stock for " + product)
        self.stock[product] - quantity => self.stock[product]

    def report(self):
        for product in self.products:
            product + ": " + str(self.stock[product]) + " units" => line
            line^0

Inventory() => warehouse
warehouse.add_stock("USB-C Cable", 50)
warehouse.add_stock("Wireless Mouse", 20)
warehouse.add_stock("USB-C Cable", 30)
warehouse.remove_stock("Wireless Mouse", 5)

try:
    warehouse.remove_stock("Wireless Mouse", 100)
except ValueError:
    "Could not remove 100 Wireless Mouse units: insufficient stock" => msg
    msg^0

"Current inventory:" => header
header^0
warehouse.report()
```

## Python (deterministic transpilation)

```python
class Inventory:
    def __init__(self):
        self.stock = {}
        self.products = []
    def add_stock(self, product, quantity):
        if product in self.stock:
            self.stock[product] = self.stock[product] + quantity
        else:
            self.stock[product] = quantity
            self.products = self.products + [product]
    def remove_stock(self, product, quantity):
        if not product in self.stock:
            raise ValueError("no such product: " + product)
        if self.stock[product] < quantity:
            raise ValueError("insufficient stock for " + product)
        self.stock[product] = self.stock[product] - quantity
    def report(self):
        for product in self.products:
            line = product + ": " + str(self.stock[product]) + " units"
            print(line)

warehouse = Inventory()
warehouse.add_stock("USB-C Cable", 50)
warehouse.add_stock("Wireless Mouse", 20)
warehouse.add_stock("USB-C Cable", 30)
warehouse.remove_stock("Wireless Mouse", 5)
try:
    warehouse.remove_stock("Wireless Mouse", 100)
except ValueError:
    msg = "Could not remove 100 Wireless Mouse units: insufficient stock"
    print(msg)
header = "Current inventory:"
print(header)
warehouse.report()
```

## stdout (executed)

```text
Could not remove 100 Wireless Mouse units: insufficient stock
Current inventory:
USB-C Cable: 80 units
Wireless Mouse: 15 units
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:classdef · eml:call · eml:assign · eml:return · eml:output · eml:run:done
