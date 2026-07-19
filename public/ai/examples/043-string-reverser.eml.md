<!-- canonical: efficientnewlanguage.org/ai/examples/043-string-reverser | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 043 — String reverser

`string_reverser.eml` reverses four sample strings — `"Hello World"`, `"EML Transpiler"`, `"Neo.K"`, `"EveMissLab 2026"`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Reverses a
# handful of sample strings manually, character by character, since native
# EML has no `[::-1]` step-slice.

samples^+["Hello World", "EML Transpiler", "Neo.K", "EveMissLab 2026"]

length^+0
reversed_str^+""

for text in samples:
    len(text) => length
    "" => reversed_str
    for i in [0:length-1]:
        text[length - 1 - i] => ch
        reversed_str + ch => reversed_str

    "Original: " + text => line1
    line1^0
    "Reversed: " + reversed_str => line2
    line2^0
```

## Python (deterministic transpilation)

```python
samples = ["Hello World", "EML Transpiler", "Neo.K", "EveMissLab 2026"]
length = 0
reversed_str = ""
for text in samples:
    length = len(text)
    reversed_str = ""
    for i in range(0, length):
        ch = text[length - 1 - i]
        reversed_str = reversed_str + ch
    line1 = "Original: " + text
    print(line1)
    line2 = "Reversed: " + reversed_str
    print(line2)
```

## stdout (executed)

```text
Original: Hello World
Reversed: dlroW olleH
Original: EML Transpiler
Reversed: relipsnarT LME
Original: Neo.K
Reversed: K.oeN
Original: EveMissLab 2026
Reversed: 6202 baLssiMevE
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:output · eml:run:done
