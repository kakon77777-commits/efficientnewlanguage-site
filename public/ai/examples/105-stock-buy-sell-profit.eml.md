<!-- canonical: efficientnewlanguage.org/ai/examples/105-stock-buy-sell-profit | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 105 — Best single buy/sell profit

`stock_buy_sell_profit.eml` finds the best profit obtainable from buying once and selling once later, across five price series — e.g. `[7, 1, 5, 3, 6, 4] -> best profit 5` (buy at 1, sell at 6).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Given a
# series of daily prices, the best profit obtainable from buying once and
# selling once later. A single pass carrying two running values — the
# cheapest price seen so far, and the best profit so far.
#
# This is examples/max-subarray-kadane/ wearing different clothes: the
# best profit equals the largest sum of any contiguous run of the DAILY
# DIFFERENCES, so the two problems are the same problem. Both also refuse
# to look backwards, and both hinge on what happens when no positive
# answer exists — Kadane must return the least-bad element, while this
# must return 0, because declining to trade is always allowed. The two
# all-declining samples below pin that difference down.

def max_profit(prices):
    len(prices) => n
    if n < 2:
        return 0
    prices[0] => cheapest
    0 => best
    1 => i
    while i < n:
        prices[i] => price
        price - cheapest => profit
        if profit > best:
            profit => best
        if price < cheapest:
            price => cheapest
        i + 1 => i
    return best

series^+[[7, 1, 5, 3, 6, 4], [7, 6, 4, 3, 1], [1, 2, 3, 4, 5], [3, 3, 3], [5]]

for prices in series:
    max_profit(prices) => profit
    str(prices) + " -> best profit " + str(profit) => line
    line^0
```

## Python (deterministic transpilation)

```python
def max_profit(prices):
    n = len(prices)
    if n < 2:
        return 0
    cheapest = prices[0]
    best = 0
    i = 1
    while i < n:
        price = prices[i]
        profit = price - cheapest
        if profit > best:
            best = profit
        if price < cheapest:
            cheapest = price
        i = i + 1
    return best

series = [[7, 1, 5, 3, 6, 4], [7, 6, 4, 3, 1], [1, 2, 3, 4, 5], [3, 3, 3], [5]]
for prices in series:
    profit = max_profit(prices)
    line = str(prices) + " -> best profit " + str(profit)
    print(line)
```

## stdout (executed)

```text
[7, 1, 5, 3, 6, 4] -> best profit 5
[7, 6, 4, 3, 1] -> best profit 0
[1, 2, 3, 4, 5] -> best profit 4
[3, 3, 3] -> best profit 0
[5] -> best profit 0
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
