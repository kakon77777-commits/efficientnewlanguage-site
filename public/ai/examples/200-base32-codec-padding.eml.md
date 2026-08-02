<!-- canonical: efficientnewlanguage.org/ai/examples/200-base32-codec-padding | ai_layer_version: 0.1.0 | updated: 2026-08-02 -->

# Example 200 — The padding table is the whole specification

`base32_codec_padding.eml` is a hand-written Base32 codec, and the only hard part is how many `=` characters go on the end.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). A Base32 codec
# written by hand, and the padding rule that is the only hard part.
#
# Base32 packs 5 bits per output character, so it consumes input 5 BYTES at a
# time and emits 8 characters. When the input length is not a multiple of 5,
# the final group is short and has to be padded - and RFC 4648 specifies
# exactly how many '=' characters that is, per remainder:
#
#     bytes left   1    2    3    4
#     characters   2    4    5    7
#     padding      6    4    3    1
#
# Those numbers are not derivable by intuition and are wrong in most
# hand-written implementations. The usual bug is padding to a multiple of 8
# without computing how many DATA characters the leftover bits produce, which
# yields a string of the right length carrying the wrong number of real
# characters. A decoder that ignores padding then returns a value that is one
# byte too long or too short - silently, because nothing about it is malformed.
#
# The property, checked over every length from 0 to 40:
#
#     decode(encode(bytes)) == bytes
#     len(encode(bytes)) is a multiple of 8, always
#     the padding count matches the table above

"ABCDEFGHIJKLMNOPQRSTUVWXYZ234567" => ALPHABET

def index_of(ch):
    0 => i
    while i < len(ALPHABET):
        if ALPHABET[i] == ch:
            return i
        i + 1 => i
    return 0 - 1

def encode(data):
    # `data` is a list of byte values 0..255.
    "" => out
    0 => i
    while i < len(data):
        # take up to five bytes
        [] => group
        0 => k
        while k < 5 and i + k < len(data):
            group + [data[i + k]] => group
            k + 1 => k
        len(group) => n

        # pack them into one integer, left-aligned in 40 bits
        0 => bits
        for b in group:
            bits * 256 + b => bits
        for pad in [n:4]:
            bits * 256 => bits

        # 8 characters of 5 bits each. Peel from the least significant end,
        # then emit reversed - the direction that avoids computing a shift.
        [] => five
        bits => rest
        for c in [0:7]:
            five + [rest % 32] => five
            int(rest / 32) => rest
        # `five` is least-significant-first; emit reversed
        "" => piece
        7 => idx
        while idx >= 0:
            piece + ALPHABET[five[idx]] => piece
            idx - 1 => idx

        # Characters produced per number of real bytes. Index 5 is a FULL
        # group and needs an entry too - leaving it off made the encoder crash
        # on the first complete 5-byte block.
        [0, 2, 4, 5, 7, 8] => keep_for
        keep_for[n] => keep
        out + piece[:keep] => out
        for p in [keep:7]:
            out + "=" => out
        i + 5 => i
    return out

def decode(text):
    if not (len(text) % 8 == 0):
        raise ValueError("length " + str(len(text)) + " is not a multiple of 8")
    [] => out
    0 => i
    while i < len(text):
        text[i:i + 8] => block
        0 => real
        for ch in block:
            if not (ch == "="):
                real + 1 => real
        # invert the keep table
        [0, 0, 1, 0, 2, 3, 0, 4] => bytes_for
        if real == 8:
            5 => nbytes
        else:
            bytes_for[real] => nbytes
        if nbytes == 0 and real > 0:
            raise ValueError("block has " + str(real) + " data characters, which is not a legal count")

        0 => bits
        for c in [0:7]:
            block[c] => ch
            0 => v
            if not (ch == "="):
                index_of(ch) => v
                if v < 0:
                    raise ValueError("character not in the alphabet: " + ch)
            bits * 32 + v => bits

        # 40 bits -> five bytes, most significant first
        [] => five
        bits => rest
        for c in [0:4]:
            five + [rest % 256] => five
            int(rest / 256) => rest
        4 => idx
        0 => taken
        while idx >= 0:
            if taken < nbytes:
                out + [five[idx]] => out
                taken + 1 => taken
            idx - 1 => idx
        i + 8 => i
    return out


def bytes_of(n):
    # A deterministic pseudo-byte sequence of length n.
    [] => out
    for i in [0:n - 1]:
        out + [(i * 37 + 11) % 256] => out
    return out


"length  encoded                                   pad  round-trips"^0
0 => trips
0 => multiples
0 => pad_right
0 => checked
[0, 2, 4, 5, 7] => keep_for
for n in [0:12]:
    checked + 1 => checked
    bytes_of(n) => data
    encode(data) => enc
    decode(enc) => back

    if back == data:
        trips + 1 => trips
    if len(enc) % 8 == 0:
        multiples + 1 => multiples

    0 => pads
    for ch in enc:
        if ch == "=":
            pads + 1 => pads
    n % 5 => rem
    0 => want_pad
    if not (rem == 0):
        8 - keep_for[rem] => want_pad
    if pads == want_pad:
        pad_right + 1 => pad_right

    ("%-7d %-41s %-4d %s" % (n, enc, pads, str(back == data)))^0

# ---------------------------------------------------- the padding table
""^0
"RFC 4648 padding, re-derived from the encoder:"^0
"  bytes left   1    2    3    4"^0
"  characters   2    4    5    7"^0
"  padding      6    4    3    1"^0

# ------------------------------------------------------------ wider sweep
0 => wide_ok
0 => wide_checked
for n in [0:40]:
    wide_checked + 1 => wide_checked
    bytes_of(n) => data
    if decode(encode(data)) == data:
        wide_ok + 1 => wide_ok

# malformed input must be refused
0 => refused
for bad in ["A", "ABCDEFG", "ABCDEF1="]:
    try:
        decode(bad) => v
    except ValueError as e:
        refused + 1 => refused

""^0
("demo lengths:            " + str(checked))^0
("  round-tripped:         " + str(trips) + "/" + str(checked))^0
("  length a multiple of 8:" + str(multiples) + "/" + str(checked))^0
("  padding count correct: " + str(pad_right) + "/" + str(checked))^0
("lengths 0..40 swept:     " + str(wide_checked))^0
("  round-tripped:         " + str(wide_ok) + "/" + str(wide_checked))^0
("malformed inputs refused:" + str(refused) + "/3")^0

""^0
if trips == checked and multiples == checked and pad_right == checked and wide_ok == wide_checked and refused == 3:
    "Every length round-trips, and the padding matches RFC 4648 exactly." => verdict
else:
    "FAILED - a length lost bytes or the padding is wrong." => verdict
verdict^0

""^0
"The keep table [0, 2, 4, 5, 7] is the whole specification. Padding to a" => n1
n1^0
"multiple of 8 without it produces output of the right LENGTH carrying the" => n2
n2^0
"wrong number of real characters, and a decoder that trusts the length is" => n3
n3^0
"off by a byte with nothing malformed to notice." => n4
n4^0
```

## Python (deterministic transpilation)

```python
ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"

def index_of(ch):
    i = 0
    while i < len(ALPHABET):
        if ALPHABET[i] == ch:
            return i
        i = i + 1
    return 0 - 1

def encode(data):
    out = ""
    i = 0
    while i < len(data):
        group = []
        k = 0
        while k < 5 and i + k < len(data):
            group = group + [data[i + k]]
            k = k + 1
        n = len(group)
        bits = 0
        for b in group:
            bits = bits * 256 + b
        for pad in range(n, 5):
            bits = bits * 256
        five = []
        rest = bits
        for c in range(0, 8):
            five = five + [rest % 32]
            rest = int(rest / 32)
        piece = ""
        idx = 7
        while idx >= 0:
            piece = piece + ALPHABET[five[idx]]
            idx = idx - 1
        keep_for = [0, 2, 4, 5, 7, 8]
        keep = keep_for[n]
        out = out + piece[:keep]
        for p in range(keep, 8):
            out = out + "="
        i = i + 5
    return out

def decode(text):
    if not len(text) % 8 == 0:
        raise ValueError("length " + str(len(text)) + " is not a multiple of 8")
    out = []
    i = 0
    while i < len(text):
        block = text[i:i + 8]
        real = 0
        for ch in block:
            if not ch == "=":
                real = real + 1
        bytes_for = [0, 0, 1, 0, 2, 3, 0, 4]
        if real == 8:
            nbytes = 5
        else:
            nbytes = bytes_for[real]
        if nbytes == 0 and real > 0:
            raise ValueError("block has " + str(real) + " data characters, which is not a legal count")
        bits = 0
        for c in range(0, 8):
            ch = block[c]
            v = 0
            if not ch == "=":
                v = index_of(ch)
                if v < 0:
                    raise ValueError("character not in the alphabet: " + ch)
            bits = bits * 32 + v
        five = []
        rest = bits
        for c in range(0, 5):
            five = five + [rest % 256]
            rest = int(rest / 256)
        idx = 4
        taken = 0
        while idx >= 0:
            if taken < nbytes:
                out = out + [five[idx]]
                taken = taken + 1
            idx = idx - 1
        i = i + 8
    return out

def bytes_of(n):
    out = []
    for i in range(0, n):
        out = out + [(i * 37 + 11) % 256]
    return out

print("length  encoded                                   pad  round-trips")
trips = 0
multiples = 0
pad_right = 0
checked = 0
keep_for = [0, 2, 4, 5, 7]
for n in range(0, 13):
    checked = checked + 1
    data = bytes_of(n)
    enc = encode(data)
    back = decode(enc)
    if back == data:
        trips = trips + 1
    if len(enc) % 8 == 0:
        multiples = multiples + 1
    pads = 0
    for ch in enc:
        if ch == "=":
            pads = pads + 1
    rem = n % 5
    want_pad = 0
    if not rem == 0:
        want_pad = 8 - keep_for[rem]
    if pads == want_pad:
        pad_right = pad_right + 1
    print("%-7d %-41s %-4d %s" % (n, enc, pads, str(back == data)))
print("")
print("RFC 4648 padding, re-derived from the encoder:")
print("  bytes left   1    2    3    4")
print("  characters   2    4    5    7")
print("  padding      6    4    3    1")
wide_ok = 0
wide_checked = 0
for n in range(0, 41):
    wide_checked = wide_checked + 1
    data = bytes_of(n)
    if decode(encode(data)) == data:
        wide_ok = wide_ok + 1
refused = 0
for bad in ["A", "ABCDEFG", "ABCDEF1="]:
    try:
        v = decode(bad)
    except ValueError as e:
        refused = refused + 1
print("")
print("demo lengths:            " + str(checked))
print("  round-tripped:         " + str(trips) + "/" + str(checked))
print("  length a multiple of 8:" + str(multiples) + "/" + str(checked))
print("  padding count correct: " + str(pad_right) + "/" + str(checked))
print("lengths 0..40 swept:     " + str(wide_checked))
print("  round-tripped:         " + str(wide_ok) + "/" + str(wide_checked))
print("malformed inputs refused:" + str(refused) + "/3")
print("")
if trips == checked and multiples == checked and pad_right == checked and wide_ok == wide_checked and refused == 3:
    verdict = "Every length round-trips, and the padding matches RFC 4648 exactly."
else:
    verdict = "FAILED - a length lost bytes or the padding is wrong."
print(verdict)
print("")
n1 = "The keep table [0, 2, 4, 5, 7] is the whole specification. Padding to a"
print(n1)
n2 = "multiple of 8 without it produces output of the right LENGTH carrying the"
print(n2)
n3 = "wrong number of real characters, and a decoder that trusts the length is"
print(n3)
n4 = "off by a byte with nothing malformed to notice."
print(n4)
```

## stdout (executed)

```text
length  encoded                                   pad  round-trips
0                                                 0    True
1       BM======                                  6    True
2       BMYA====                                  4    True
3       BMYFK===                                  3    True
4       BMYFK6Q=                                  1    True
5       BMYFK6U7                                  0    True
6       BMYFK6U7YQ======                          6    True
7       BMYFK6U7YTUQ====                          4    True
8       BMYFK6U7YTUQ4===                          3    True
9       BMYFK6U7YTUQ4MY=                          1    True
10      BMYFK6U7YTUQ4M2Y                          0    True
11      BMYFK6U7YTUQ4M2YPU======                  6    True
12      BMYFK6U7YTUQ4M2YPWRA====                  4    True

RFC 4648 padding, re-derived from the encoder:
  bytes left   1    2    3    4
  characters   2    4    5    7
  padding      6    4    3    1

demo lengths:            13
  round-tripped:         13/13
  length a multiple of 8:13/13
  padding count correct: 13/13
lengths 0..40 swept:     41
  round-tripped:         41/41
malformed inputs refused:3/3

Every length round-trips, and the padding matches RFC 4648 exactly.

The keep table [0, 2, 4, 5, 7] is the whole specification. Padding to a
multiple of 8 without it produces output of the right LENGTH carrying the
wrong number of real characters, and a decoder that trusts the length is
off by a byte with nothing malformed to notice.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
