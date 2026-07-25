<!-- canonical: efficientnewlanguage.org/ai/examples/089-luhn-algorithm | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 089 — Luhn algorithm

`luhn_algorithm.eml` validates five numbers with the Luhn check-digit algorithm — the checksum behind credit-card and IMEI numbers.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Validates
# numbers with the Luhn check-digit algorithm: walking right to left,
# double every second digit (subtracting 9 if the result exceeds 9), sum
# everything, and the number is valid when the total is divisible by 10.
# The corpus's first check-digit/validation algorithm — a real-world
# integrity check rather than a computation.
#
# Digits arrive pre-split into lists: splitting a string into characters
# and converting each to an int is interpreter-deferred, and any deferred
# construct makes a case SKIP the eml:equiv gate instead of passing it.

def luhn_is_valid(digits):
    len(digits) => n
    0 => total
    0 => i
    while i < n:
        digits[n - 1 - i] => d
        if i % 2 == 1:
            d * 2 => d
            if d > 9:
                d - 9 => d
        total + d => total
        i + 1 => i
    return total % 10 == 0

numbers^+[[7, 9, 9, 2, 7, 3, 9, 8, 7, 1, 3],
          [7, 9, 9, 2, 7, 3, 9, 8, 7, 1, 4],
          [4, 5, 3, 9, 1, 4, 8, 8, 0, 3, 4, 3, 6, 4, 6, 7],
          [1, 2, 3, 4],
          [0, 0]]

for digits in numbers:
    luhn_is_valid(digits) => valid
    "" => rendered
    for d in digits:
        rendered + str(d) => rendered
    rendered + " -> " + str(valid) => line
    line^0
```

## Python (deterministic transpilation)

```python
def luhn_is_valid(digits):
    n = len(digits)
    total = 0
    i = 0
    while i < n:
        d = digits[n - 1 - i]
        if i % 2 == 1:
            d = d * 2
            if d > 9:
                d = d - 9
        total = total + d
        i = i + 1
    return total % 10 == 0

numbers = [[7, 9, 9, 2, 7, 3, 9, 8, 7, 1, 3], [7, 9, 9, 2, 7, 3, 9, 8, 7, 1, 4], [4, 5, 3, 9, 1, 4, 8, 8, 0, 3, 4, 3, 6, 4, 6, 7], [1, 2, 3, 4], [0, 0]]
for digits in numbers:
    valid = luhn_is_valid(digits)
    rendered = ""
    for d in digits:
        rendered = rendered + str(d)
    line = rendered + " -> " + str(valid)
    print(line)
```

## stdout (executed)

```text
79927398713 -> True
79927398714 -> False
4539148803436467 -> True
1234 -> False
00 -> True
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
