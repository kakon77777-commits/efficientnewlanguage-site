<!-- canonical: efficientnewlanguage.org/ai/examples/019-digit-sum-calculator | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 019 — Digit sum + digital root calculator

`digit_sum_calculator.eml` takes a small list of sample integers and, for each one, computes its digit sum (the sum of its base-10 digits) and its "digital root" — the single digit left after repeatedly re-summing digits until only one remains.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). For each
# sample number, extracts digits via `%` (floor-mod) and `int(n / 10)`
# (EML has no `//` floor-division token, so truncating a true-division
# result via `int()` stands in for it on these non-negative inputs) inside
# a `while` loop to build the digit sum, then repeats that same reduction
# (a second, nested `while`) until a single digit remains — the "digital
# root". `^+` seeds each accumulator once per outer iteration (reset) and
# augments it on every inner-loop pass (add), the same declare-vs-augment
# idiom as word-frequency-counter's `counts[word]`.

numbers^+[4527, 918273, 60, 999999]

for number in numbers:
    number => n
    digit_sum^+0
    while n > 0:
        n % 10 => digit
        digit_sum^+digit
        int(n / 10) => n

    digit_sum => root
    while root > 9:
        root => m
        new_root^+0
        while m > 0:
            m % 10 => d
            new_root^+d
            int(m / 10) => m
        new_root => root

    "Number " + str(number) + ": digit sum = " + str(digit_sum) + ", digital root = " + str(root) => line
    line^0
```

## Python (deterministic transpilation)

```python
numbers = [4527, 918273, 60, 999999]
for number in numbers:
    n = number
    digit_sum = 0
    while n > 0:
        digit = n % 10
        digit_sum += digit
        n = int(n / 10)
    root = digit_sum
    while root > 9:
        m = root
        new_root = 0
        while m > 0:
            d = m % 10
            new_root += d
            m = int(m / 10)
        root = new_root
    line = "Number " + str(number) + ": digit sum = " + str(digit_sum) + ", digital root = " + str(root)
    print(line)
```

## stdout (executed)

```text
Number 4527: digit sum = 18, digital root = 9
Number 918273: digit sum = 30, digital root = 3
Number 60: digit sum = 6, digital root = 6
Number 999999: digit sum = 54, digital root = 9
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
