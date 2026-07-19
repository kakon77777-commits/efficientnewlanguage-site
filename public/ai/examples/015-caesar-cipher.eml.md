<!-- canonical: efficientnewlanguage.org/ai/examples/015-caesar-cipher | ai_layer_version: 0.1.0 | updated: 2026-07-19 -->

# Example 015 — Caesar cipher

`caesar_cipher.eml` encodes the sample message `"Meet me at the old bridge at midnight"` with a fixed shift-7 Caesar cipher, then decodes the result back to the original, printing all three lines (original / encoded / decoded) to demonstrate the round trip.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Encodes a
# sample message with a fixed-shift Caesar cipher, then decodes it back.
# Character shifting is done via a 26-letter lookup table + a linear scan
# for the source index, not `ord`/`chr` — those genuinely crash with a raw
# NameError in the browser interpreter rather than gracefully deferring
# (see this case's README), so this design keeps the whole program
# interpreter-computable end to end.

LOWER^+"abcdefghijklmnopqrstuvwxyz"
UPPER^+"ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def index_of(ch, alphabet):
    for idx in [0:25]:
        if alphabet[idx] == ch:
            return idx
    return 0 - 1

def shift_char(ch, alphabet, amount):
    index_of(ch, alphabet) => idx
    (idx + amount) % 26 => shifted_idx
    return alphabet[shifted_idx]

message^+"Meet me at the old bridge at midnight"
shift^+7

encoded^+""
for ch in message:
    if ch == " ":
        encoded + " " => encoded
    elif ch in LOWER:
        shift_char(ch, LOWER, shift) => shifted
        encoded + shifted => encoded
    elif ch in UPPER:
        shift_char(ch, UPPER, shift) => shifted
        encoded + shifted => encoded
    else:
        encoded + ch => encoded

decoded^+""
for ch in encoded:
    if ch == " ":
        decoded + " " => decoded
    elif ch in LOWER:
        shift_char(ch, LOWER, 0 - shift) => shifted
        decoded + shifted => decoded
    elif ch in UPPER:
        shift_char(ch, UPPER, 0 - shift) => shifted
        decoded + shifted => decoded
    else:
        decoded + ch => decoded

"Original: " + message => line1
line1^0
"Encoded:  " + encoded => line2
line2^0
"Decoded:  " + decoded => line3
line3^0
```

## Python (deterministic transpilation)

```python
LOWER = "abcdefghijklmnopqrstuvwxyz"
UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

def index_of(ch, alphabet):
    for idx in range(0, 26):
        if alphabet[idx] == ch:
            return idx
    return 0 - 1

def shift_char(ch, alphabet, amount):
    idx = index_of(ch, alphabet)
    shifted_idx = (idx + amount) % 26
    return alphabet[shifted_idx]

message = "Meet me at the old bridge at midnight"
shift = 7
encoded = ""
for ch in message:
    if ch == " ":
        encoded = encoded + " "
    elif ch in LOWER:
        shifted = shift_char(ch, LOWER, shift)
        encoded = encoded + shifted
    elif ch in UPPER:
        shifted = shift_char(ch, UPPER, shift)
        encoded = encoded + shifted
    else:
        encoded = encoded + ch
decoded = ""
for ch in encoded:
    if ch == " ":
        decoded = decoded + " "
    elif ch in LOWER:
        shifted = shift_char(ch, LOWER, 0 - shift)
        decoded = decoded + shifted
    elif ch in UPPER:
        shifted = shift_char(ch, UPPER, 0 - shift)
        decoded = decoded + shifted
    else:
        decoded = decoded + ch
line1 = "Original: " + message
print(line1)
line2 = "Encoded:  " + encoded
print(line2)
line3 = "Decoded:  " + decoded
print(line3)
```

## stdout (executed)

```text
Original: Meet me at the old bridge at midnight
Encoded:  Tlla tl ha aol vsk iypknl ha tpkupnoa
Decoded:  Meet me at the old bridge at midnight
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
