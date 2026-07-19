<!-- canonical: efficientnewlanguage.org/ai/examples/012-armstrong-number-checker | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 012 — Armstrong number checker

`armstrong_number_checker.eml` checks whether each of four sample numbers (153, 370, 9474 — all genuine Armstrong numbers — and 123, which is not) is an Armstrong number: the sum of its digits, each raised to the power of the digit count, equals the number itself.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Checks whether
# numbers are Armstrong numbers (sum of each digit raised to the power of the
# digit count equals the number itself), using digit extraction via `%` and
# integer division, and a manual power loop (the `^` power operator only
# accepts a literal exponent, not a variable one, so a variable exponent uses
# plain repeated multiplication instead).

def power(base, exponent):
    1 => result
    0 => count
    while count < exponent:
        result * base => result
        count + 1 => count
    return result

def is_armstrong(n):
    len(str(n)) => num_digits
    n => remaining
    0 => total
    while remaining > 0:
        remaining % 10 => digit
        total + power(digit, num_digits) => total
        int(remaining / 10) => remaining
    return total == n

samples^+[153, 370, 9474, 123]

for sample in samples:
    is_armstrong(sample) => result
    sample^0(": ")
    result^0("\n")
```

## Python (deterministic transpilation)

```python
def power(base, exponent):
    result = 1
    count = 0
    while count < exponent:
        result = result * base
        count = count + 1
    return result

def is_armstrong(n):
    num_digits = len(str(n))
    remaining = n
    total = 0
    while remaining > 0:
        digit = remaining % 10
        total = total + power(digit, num_digits)
        remaining = int(remaining / 10)
    return total == n

samples = [153, 370, 9474, 123]
for sample in samples:
    result = is_armstrong(sample)
    print(sample, end=": ")
    print(result, end="\n")
```

## stdout (executed)

```text
153: True
370: True
9474: True
123: False
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
