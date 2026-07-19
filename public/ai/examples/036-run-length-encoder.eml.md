<!-- canonical: efficientnewlanguage.org/ai/examples/036-run-length-encoder | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 036 — Run-length encoder

`run_length_encoder.eml` run-length-encodes the DNA-style base sequence `"AAAAGGGGCCCCTTTTAAAAGGA"` (a genuine RLE use case — simple compression of repeated-symbol sequences, e.g. in bioinformatics or fax-style bitmap rows), producing `4A4G4C4T4A2G1A`.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Run-length
# encodes a sample DNA-style base sequence (a genuine RLE use case in
# bioinformatics) by tracking the current character and its run count in a
# loop, then formatting each run with a tuple + `%`-string-format.

sequence^+"AAAAGGGGCCCCTTTTAAAAGGA"
len(sequence) => length

sequence[0] => current
count^+1
encoded^+""

for i in [1:length-1]:
    sequence[i] => ch
    if ch == current:
        count^+1
    else:
        "%d%s" % (count, current) => piece
        encoded + piece => encoded
        ch => current
        1 => count

"%d%s" % (count, current) => piece
encoded + piece => encoded

"Original: " + sequence => line1
line1^0
"Encoded:  " + encoded => line2
line2^0
```

## Python (deterministic transpilation)

```python
sequence = "AAAAGGGGCCCCTTTTAAAAGGA"
length = len(sequence)
current = sequence[0]
count = 1
encoded = ""
for i in range(1, length):
    ch = sequence[i]
    if ch == current:
        count += 1
    else:
        piece = "%d%s" % (count, current)
        encoded = encoded + piece
        current = ch
        count = 1
piece = "%d%s" % (count, current)
encoded = encoded + piece
line1 = "Original: " + sequence
print(line1)
line2 = "Encoded:  " + encoded
print(line2)
```

## stdout (executed)

```text
Original: AAAAGGGGCCCCTTTTAAAAGGA
Encoded:  4A4G4C4T4A2G1A
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:augment · eml:output · eml:run:done
