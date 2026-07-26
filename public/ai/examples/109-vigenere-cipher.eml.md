<!-- canonical: efficientnewlanguage.org/ai/examples/109-vigenere-cipher | ai_layer_version: 0.1.0 | updated: 2026-07-26 -->

# Example 109 — Vigenère cipher

`vigenere_cipher.eml` encodes `"attack at dawn"` with the key `"lemon"` to `"lxfopv ef rnhr"`, then decodes it back — the textbook example, letter for letter.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). The Vigenere
# cipher: instead of one fixed shift for the whole message, a repeating
# keyword supplies a different shift per letter. A polyalphabetic
# counterpart to examples/caesar-cipher/, and it borrows that case's
# lookup-table idiom for the same reason — `ord`/`chr` crash with a raw
# NameError in the browser interpreter rather than gracefully deferring,
# so character positions come from a 26-letter table and a linear scan.
#
# The interesting property is visible in the output: 'a' occurs four times
# in the plaintext and encodes to four DIFFERENT letters, because each one
# meets a different position of the key. That is exactly what a
# single-shift Caesar cipher cannot do, and why frequency analysis alone
# does not break this.
#
# The key advances only on letters, so spaces do not consume key
# positions — a space would otherwise desynchronise the key and make
# decoding produce garbage.

ALPHABET^+"abcdefghijklmnopqrstuvwxyz"

def index_of(ch, alphabet):
    for idx in [0:25]:
        if alphabet[idx] == ch:
            return idx
    return 0 - 1

def vigenere(text, key, direction):
    "" => result
    0 => key_pos
    len(key) => key_len
    for ch in text:
        if ch in ALPHABET:
            index_of(ch, ALPHABET) => text_idx
            key[key_pos % key_len] => key_ch
            index_of(key_ch, ALPHABET) => key_idx
            (text_idx + direction * key_idx) % 26 => shifted
            result + ALPHABET[shifted] => result
            key_pos + 1 => key_pos
        else:
            result + ch => result
    return result

message^+"attack at dawn"
key^+"lemon"

vigenere(message, key, 1) => encoded
vigenere(encoded, key, 0 - 1) => decoded

"Key:      " + key => line1
line1^0
"Original: " + message => line2
line2^0
"Encoded:  " + encoded => line3
line3^0
"Decoded:  " + decoded => line4
line4^0

if decoded == message:
    "Round-trip: decoded matches the original" => line5
else:
    "Round-trip: MISMATCH" => line5
line5^0
```

## Python (deterministic transpilation)

```python
ALPHABET = "abcdefghijklmnopqrstuvwxyz"

def index_of(ch, alphabet):
    for idx in range(0, 26):
        if alphabet[idx] == ch:
            return idx
    return 0 - 1

def vigenere(text, key, direction):
    result = ""
    key_pos = 0
    key_len = len(key)
    for ch in text:
        if ch in ALPHABET:
            text_idx = index_of(ch, ALPHABET)
            key_ch = key[key_pos % key_len]
            key_idx = index_of(key_ch, ALPHABET)
            shifted = (text_idx + direction * key_idx) % 26
            result = result + ALPHABET[shifted]
            key_pos = key_pos + 1
        else:
            result = result + ch
    return result

message = "attack at dawn"
key = "lemon"
encoded = vigenere(message, key, 1)
decoded = vigenere(encoded, key, 0 - 1)
line1 = "Key:      " + key
print(line1)
line2 = "Original: " + message
print(line2)
line3 = "Encoded:  " + encoded
print(line3)
line4 = "Decoded:  " + decoded
print(line4)
if decoded == message:
    line5 = "Round-trip: decoded matches the original"
else:
    line5 = "Round-trip: MISMATCH"
print(line5)
```

## stdout (executed)

```text
Key:      lemon
Original: attack at dawn
Encoded:  lxfopv ef rnhr
Decoded:  attack at dawn
Round-trip: decoded matches the original
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:call · eml:return · eml:output · eml:run:done
