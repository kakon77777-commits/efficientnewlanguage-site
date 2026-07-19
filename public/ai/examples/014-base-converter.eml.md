<!-- canonical: efficientnewlanguage.org/ai/examples/014-base-converter | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 014 — Base converter (decimal to binary/octal)

`base_converter.eml` converts three sample decimal integers (156, 2024, 45) to their binary and octal string representations by manual repeated-division-and-remainder — no `bin()`/`oct()`/`hex()` call is used; the digit string is built by hand.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Converts
# decimal integers to their binary and octal string representations by
# manual repeated division-and-remainder (no `bin()`/`oct()`/`hex()` — the
# digit string is built by hand via `%`, integer division, and string
# concatenation).

def to_base(n, base):
    if n == 0:
        return "0"
    n => value
    "" => digits
    while value > 0:
        value % base => remainder
        str(remainder) + digits => digits
        int(value / base) => value
    return digits

numbers^+[156, 2024, 45]

for number in numbers:
    to_base(number, 2) => binary_form
    to_base(number, 8) => octal_form
    "Decimal " + str(number) + " -> binary " + binary_form + ", octal " + octal_form => line
    line^0
```

## Python (deterministic transpilation)

```python
def to_base(n, base):
    if n == 0:
        return "0"
    value = n
    digits = ""
    while value > 0:
        remainder = value % base
        digits = str(remainder) + digits
        value = int(value / base)
    return digits

numbers = [156, 2024, 45]
for number in numbers:
    binary_form = to_base(number, 2)
    octal_form = to_base(number, 8)
    line = "Decimal " + str(number) + " -> binary " + binary_form + ", octal " + octal_form
    print(line)
```

## stdout (executed)

```text
Decimal 156 -> binary 10011100, octal 234
Decimal 2024 -> binary 11111101000, octal 3750
Decimal 45 -> binary 101101, octal 55
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
