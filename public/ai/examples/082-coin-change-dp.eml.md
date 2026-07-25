<!-- canonical: efficientnewlanguage.org/ai/examples/082-coin-change-dp | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 082 — Coin change (dynamic programming)

`coin_change_dp.eml` finds the fewest coins that make a given amount, using a 1D DP table filled from 1 up to the target.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Finds the
# fewest coins that make a given amount, via a 1D dynamic-programming table
# filled from 1 up to the target. Unlike a greedy "always take the biggest
# coin" approach (which the corpus's examples/vending-machine-simulator/
# effectively uses and which happens to be correct for ordinary currency),
# this is correct for ANY coin set — including the [1, 3, 4] set below,
# where greedy gets 6 wrong (4+1+1 = 3 coins) and DP gets it right
# (3+3 = 2 coins).
#
# A sentinel "unreachable" value stands in for infinity, since amounts that
# no combination can make must be reported rather than silently returning
# a wrong count.

def min_coins(coins, amount):
    999999 => unreachable
    table^+[]
    0 => i
    while i <= amount:
        table + [unreachable] => table
        i + 1 => i
    0 => table[0]
    1 => value
    while value <= amount:
        for coin in coins:
            if coin <= value:
                table[value - coin] => sub
                if sub < unreachable and sub + 1 < table[value]:
                    sub + 1 => table[value]
        value + 1 => value
    if table[amount] == unreachable:
        return -1
    return table[amount]

standard^+[1, 5, 10, 25]
tricky^+[1, 3, 4]
limited^+[5, 10]

amounts^+[63, 11, 30, 0]

for amount in amounts:
    min_coins(standard, amount) => count
    "US coins, " + str(amount) + " cents -> " + str(count) + " coins" => line
    line^0

min_coins(tricky, 6) => tricky_count
"Coins [1,3,4], amount 6 -> " + str(tricky_count) + " coins (greedy would say 3)" => tricky_line
tricky_line^0

min_coins(limited, 3) => impossible
"Coins [5,10], amount 3 -> " + str(impossible) + " (impossible)" => impossible_line
impossible_line^0
```

## Python (deterministic transpilation)

```python
def min_coins(coins, amount):
    unreachable = 999999
    table = []
    i = 0
    while i <= amount:
        table = table + [unreachable]
        i = i + 1
    table[0] = 0
    value = 1
    while value <= amount:
        for coin in coins:
            if coin <= value:
                sub = table[value - coin]
                if sub < unreachable and sub + 1 < table[value]:
                    table[value] = sub + 1
        value = value + 1
    if table[amount] == unreachable:
        return -1
    return table[amount]

standard = [1, 5, 10, 25]
tricky = [1, 3, 4]
limited = [5, 10]
amounts = [63, 11, 30, 0]
for amount in amounts:
    count = min_coins(standard, amount)
    line = "US coins, " + str(amount) + " cents -> " + str(count) + " coins"
    print(line)
tricky_count = min_coins(tricky, 6)
tricky_line = "Coins [1,3,4], amount 6 -> " + str(tricky_count) + " coins (greedy would say 3)"
print(tricky_line)
impossible = min_coins(limited, 3)
impossible_line = "Coins [5,10], amount 3 -> " + str(impossible) + " (impossible)"
print(impossible_line)
```

## stdout (executed)

```text
US coins, 63 cents -> 6 coins
US coins, 11 cents -> 2 coins
US coins, 30 cents -> 2 coins
US coins, 0 cents -> 0 coins
Coins [1,3,4], amount 6 -> 2 coins (greedy would say 3)
Coins [5,10], amount 3 -> -1 (impossible)
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
