<!-- canonical: efficientnewlanguage.org/ai/examples/103-roman-to-integer | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 103 — Roman numeral to integer

`roman_to_integer.eml` converts Roman numerals back to integers, and reports `10 of 10 round-tripped back to the original integer`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The reverse
# direction of examples/roman-numeral-converter/: Roman numerals back to
# integers. Scan left to right and add each symbol's value, EXCEPT when a
# symbol is smaller than the one after it — then it is a subtractive
# prefix (the I in IV, the C in CM) and gets subtracted instead. That one
# rule replaces the whole subtractive-forms table the forward direction
# needs.
#
# The inputs below are not arbitrary: they are exactly the ten numerals
# the forward case prints, paired with the ten integers that produced
# them. So this case doubles as a round-trip check across two files —
# every line must report a match, and a mismatch would mean the two
# directions have drifted apart.

def from_roman(roman):
    values^+{"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    len(roman) => n
    0 => total
    0 => i
    while i < n:
        values[roman[i]] => current
        i + 1 => next_index
        if next_index < n and current < values[roman[next_index]]:
            total - current => total
        else:
            total + current => total
        i + 1 => i
    return total

numerals^+["I", "IV", "IX", "XIV", "XL", "XC", "CD", "MCMXCIV", "MMXXVI", "MMMCMXCIX"]
originals^+[1, 4, 9, 14, 40, 90, 400, 1994, 2026, 3999]

0 => matches
for i in [0:9]:
    numerals[i] => numeral
    originals[i] => expected
    from_roman(numeral) => decoded
    if decoded == expected:
        matches + 1 => matches
        numeral + " -> " + str(decoded) + " (matches)" => line
    else:
        numeral + " -> " + str(decoded) + " (EXPECTED " + str(expected) + ")" => line
    line^0

str(matches) + " of " + str(len(numerals)) + " round-tripped back to the original integer" => summary
summary^0
```

## Python (deterministic transpilation)

```python
def from_roman(roman):
    values = {"I": 1, "V": 5, "X": 10, "L": 50, "C": 100, "D": 500, "M": 1000}
    n = len(roman)
    total = 0
    i = 0
    while i < n:
        current = values[roman[i]]
        next_index = i + 1
        if next_index < n and current < values[roman[next_index]]:
            total = total - current
        else:
            total = total + current
        i = i + 1
    return total

numerals = ["I", "IV", "IX", "XIV", "XL", "XC", "CD", "MCMXCIV", "MMXXVI", "MMMCMXCIX"]
originals = [1, 4, 9, 14, 40, 90, 400, 1994, 2026, 3999]
matches = 0
for i in range(0, 10):
    numeral = numerals[i]
    expected = originals[i]
    decoded = from_roman(numeral)
    if decoded == expected:
        matches = matches + 1
        line = numeral + " -> " + str(decoded) + " (matches)"
    else:
        line = numeral + " -> " + str(decoded) + " (EXPECTED " + str(expected) + ")"
    print(line)
summary = str(matches) + " of " + str(len(numerals)) + " round-tripped back to the original integer"
print(summary)
```

## stdout (executed)

```text
I -> 1 (matches)
IV -> 4 (matches)
IX -> 9 (matches)
XIV -> 14 (matches)
XL -> 40 (matches)
XC -> 90 (matches)
CD -> 400 (matches)
MCMXCIV -> 1994 (matches)
MMXXVI -> 2026 (matches)
MMMCMXCIX -> 3999 (matches)
10 of 10 round-tripped back to the original integer
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:def · eml:assign · eml:call · eml:return · eml:output · eml:run:done
