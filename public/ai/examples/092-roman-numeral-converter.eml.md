<!-- canonical: efficientnewlanguage.org/ai/examples/092-roman-numeral-converter | ai_layer_version: 0.1.0 | updated: 2026-07-25 -->

# Example 092 — Roman numeral converter

`roman_numeral_converter.eml` converts ten sample integers to Roman numerals, spanning every subtractive form (`1994 -> MCMXCIV`, `3999 -> MMMCMXCIX`).

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Converts
# integers to Roman numerals greedily: walk a value/symbol table from
# largest to smallest, subtracting and appending while the value still
# fits. The subtractive forms (CM, CD, XC, XL, IX, IV) are table entries
# rather than special cases, which is what keeps the loop this short.
# Distinct from the corpus's examples/base-converter/, which is positional
# (repeated division by a radix) rather than table-driven.

def to_roman(number):
    values^+[1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    symbols^+["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    number => remaining
    "" => result
    0 => i
    len(values) => n
    while i < n:
        while remaining >= values[i]:
            result + symbols[i] => result
            remaining - values[i] => remaining
        i + 1 => i
    return result

numbers^+[1, 4, 9, 14, 40, 90, 400, 1994, 2026, 3999]

for number in numbers:
    to_roman(number) => roman
    str(number) + " -> " + roman => line
    line^0
```

## Python (deterministic transpilation)

```python
def to_roman(number):
    values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"]
    remaining = number
    result = ""
    i = 0
    n = len(values)
    while i < n:
        while remaining >= values[i]:
            result = result + symbols[i]
            remaining = remaining - values[i]
        i = i + 1
    return result

numbers = [1, 4, 9, 14, 40, 90, 400, 1994, 2026, 3999]
for number in numbers:
    roman = to_roman(number)
    line = str(number) + " -> " + roman
    print(line)
```

## stdout (executed)

```text
1 -> I
4 -> IV
9 -> IX
14 -> XIV
40 -> XL
90 -> XC
400 -> CD
1994 -> MCMXCIV
2026 -> MMXXVI
3999 -> MMMCMXCIX
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
