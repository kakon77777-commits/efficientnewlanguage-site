<!-- canonical: efficientnewlanguage.org/ai/examples/064-vending-machine-simulator | ai_layer_version: 0.1.0 | updated: 2026-07-23 -->

# Example 064 — Vending machine simulator

`vending_machine_simulator.eml` simulates a vending machine processing four fixed purchases against a small product catalog (Soda 150, Chips 200, Candy 100, Water 125, in arbitrary currency units) — each purchase inserts a list of coins, accumulates a balance, and either dispenses the item with change or reports the shortfall.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Simulates a
# vending machine processing a fixed sequence of purchases — each purchase
# inserts a list of coins, accumulates a balance, and either dispenses the
# item (with change) or reports the shortfall — using parallel lists for the
# product catalog (name/price) rather than a dict-of-dict or class.

product_names^+["Soda", "Chips", "Candy", "Water"]
product_prices^+[150, 200, 100, 125]

def find_price(name):
    -1 => price
    for i in [0 : len(product_names) - 1]:
        if product_names[i] == name:
            product_prices[i] => price
    return price

def vend(name, coins):
    find_price(name) => price
    0 => balance
    for coin in coins:
        balance + coin => balance
    if balance >= price:
        balance - price => change
        "Dispensed " + name + " (price " + str(price) + "); change: " + str(change) => msg
    else:
        price - balance => shortfall
        "Insufficient funds for " + name + "; need " + str(shortfall) + " more" => msg
    msg^0

vend("Soda", [100, 25, 25])
vend("Chips", [100, 50])
vend("Candy", [25, 25, 25, 25])
vend("Water", [100])
```

## Python (deterministic transpilation)

```python
product_names = ["Soda", "Chips", "Candy", "Water"]
product_prices = [150, 200, 100, 125]

def find_price(name):
    price = -1
    for i in range(0, len(product_names)):
        if product_names[i] == name:
            price = product_prices[i]
    return price

def vend(name, coins):
    price = find_price(name)
    balance = 0
    for coin in coins:
        balance = balance + coin
    if balance >= price:
        change = balance - price
        msg = "Dispensed " + name + " (price " + str(price) + "); change: " + str(change)
    else:
        shortfall = price - balance
        msg = "Insufficient funds for " + name + "; need " + str(shortfall) + " more"
    print(msg)

vend("Soda", [100, 25, 25])
vend("Chips", [100, 50])
vend("Candy", [25, 25, 25, 25])
vend("Water", [100])
```

## stdout (executed)

```text
Dispensed Soda (price 150); change: 0
Insufficient funds for Chips; need 50 more
Dispensed Candy (price 100); change: 0
Insufficient funds for Water; need 25 more
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
