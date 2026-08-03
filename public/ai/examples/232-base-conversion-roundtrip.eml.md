<!-- canonical: efficientnewlanguage.org/ai/examples/232-base-conversion-roundtrip | ai_layer_version: 0.1.0 | updated: 2026-08-03 -->

# Example 232 — Round-tripping and canonicality are different claims

`base_conversion_roundtrip.eml` encodes and decodes integers in every base from 2 to 16 and checks two separate properties.

## EML

```eml
# Self-authored for the EML case corpus (no external origin). Writing a number
# in another base and reading it back.
#
# Encoding an integer in base b is a loop of divisions; decoding is a loop of
# multiplications. Both are five lines, both look obviously correct, and the
# property that decides whether they are a codec is:
#
#     decode(encode(n, b), b) == n     for every n and every b
#
# There are exactly three places this goes wrong, and all three produce a
# well-formed answer rather than an error:
#
#     zero        the division loop never runs, so encode(0) is the EMPTY
#                 string, which decodes to 0 by accident under most decoders
#                 and to a crash under some
#     leading     "007" and "7" decode to the same number, so encoding is not
#     zeros       injective as a string function even when it is as a number
#     negatives   the sign is not a digit, and a loop that divides toward zero
#                 produces the digits of |n| with no record of the sign
#
# The zero case is the one worth the trouble. `encode(0)` returning `""` is
# not detected by a round-trip test that starts at 1, and an empty string is
# accepted downstream by anything that treats missing as zero.
#
# The sweep is every integer in a range crossed with every base from 2 to 16,
# checking the round trip and separately checking that the encoding is
# CANONICAL - that decode then re-encode gives back the same string, which is
# the property that catches leading zeros.

"0123456789abcdef" => DIGITS

def encode(n, base):
    if base < 2 or base > 16:
        raise ValueError("base must be between 2 and 16")
    if n == 0:
        # Written out because the loop below cannot produce it. The first
        # version of this file returned "" here - correct-looking, and it
        # round-trips through a decoder that starts its accumulator at 0.
        return "0"
    "" => sign
    n => m
    if m < 0:
        "-" => sign
        0 - m => m
    "" => out
    while m > 0:
        DIGITS[m % base] + out => out
        int(m / base) => m
    return sign + out

def digit_value(ch):
    for i in [0:15]:
        if DIGITS[i] == ch:
            return i
    return 0 - 1

def decode(s, base):
    if base < 2 or base > 16:
        raise ValueError("base must be between 2 and 16")
    if len(s) == 0:
        raise ValueError("empty string is not a number")
    1 => sign
    s => body
    if s[0] == "-":
        0 - 1 => sign
        s[1:] => body
    if len(body) == 0:
        raise ValueError("sign with no digits")
    0 => acc
    for ch in body:
        digit_value(ch) => d
        if d < 0 or d >= base:
            raise ValueError("digit '" + ch + "' is not valid in base " + str(base))
        acc * base + d => acc
    return sign * acc


"n      b=2          b=8      b=10   b=16   round-trips"^0
for n in [0, 1, 7, 10, 255, 0 - 1, 0 - 255]:
    "yes" => ok
    for b in [2, 8, 10, 16]:
        if not (decode(encode(n, b), b) == n):
            "NO" => ok
    ("%-6d %-12s %-8s %-6s %-6s %s" % (n, encode(n, 2), encode(n, 8), encode(n, 10), encode(n, 16), ok))^0

# ------------------------------------------------------------- the full sweep
0 => pairs
0 => trips
0 => canonical
[] => trip_fail
[] => canon_fail
for n in [0 - 20:60]:
    for b in [2:16]:
        pairs + 1 => pairs
        encode(n, b) => s
        decode(s, b) => back
        if back == n:
            trips + 1 => trips
        else:
            if len(trip_fail) < 3:
                trip_fail + [str(n) + " base " + str(b) + " -> '" + s + "' -> " + str(back)] => trip_fail
        # Canonical: re-encoding the decoded value gives the same string.
        if encode(back, b) == s:
            canonical + 1 => canonical
        else:
            if len(canon_fail) < 3:
                canon_fail + [str(n) + " base " + str(b) + ": '" + s + "' -> '" + encode(back, b) + "'"] => canon_fail

""^0
("(n, base) pairs swept:     " + str(pairs))^0
("  round-tripped:           " + str(trips) + "/" + str(pairs))^0
("  encoding was canonical:  " + str(canonical) + "/" + str(pairs))^0
for t in trip_fail:
    ("  trip fail: " + t)^0
for c in canon_fail:
    ("  canon fail: " + c)^0

# --------------------------------------------- where the string is not unique
# Decoding is many-to-one on strings even when it is one-to-one on numbers.
# That is not a bug in the decoder; it is the reason a decoded value cannot be
# compared by re-serialising unless the encoder is canonical.
"" => noncanon
0 => aliases
for s in ["7", "07", "007", "0007"]:
    decode(s, 10) => v
    if not (encode(v, 10) == s):
        aliases + 1 => aliases
    noncanon + s + "->" + str(v) + " "  => noncanon

""^0
("strings that decode to 7: " + noncanon)^0
("of those, non-canonical:  " + str(aliases) + "/4")^0

# ----------------------------------------------- what the empty string means
""^0
"the empty string:"^0
("  encode(0, 10) = '" + encode(0, 10) + "'")^0
0 => empty_refused
try:
    decode("", 10) => v
    ("  decode('', 10) = " + str(v) + "   <- ACCEPTED, which is the bug")^0
except ValueError as e:
    1 => empty_refused
    ("  decode('', 10) raises: " + str(e))^0

# ---------------------------------------------------- malformed input refused
0 => refused
[] => bad_cases
for pair in [["2", 2], ["z", 16], ["-", 10], ["1g", 16], ["", 10]]:
    try:
        decode(pair[0], pair[1]) => v
        bad_cases + ["'" + pair[0] + "' base " + str(pair[1]) + " -> " + str(v)] => bad_cases
    except ValueError as e:
        refused + 1 => refused

0 => base_refused
for b in [0, 1, 17]:
    try:
        encode(5, b) => v
    except ValueError as e:
        base_refused + 1 => base_refused

""^0
("malformed strings refused: " + str(refused) + "/5")^0
("illegal bases refused:     " + str(base_refused) + "/3")^0

# ------------------------------------------------------------------ checks
0 => passed
0 => checked

checked + 1 => checked
if trips == pairs:
    passed + 1 => passed

# The encoder must be canonical everywhere - that is a stronger claim than
# round-tripping and it is what makes string comparison safe.
checked + 1 => checked
if canonical == pairs:
    passed + 1 => passed

# Zero must encode to "0" and not to the empty string.
checked + 1 => checked
if encode(0, 10) == "0" and encode(0, 2) == "0" and encode(0, 16) == "0":
    passed + 1 => passed

# The empty string must be REFUSED, not silently read as zero.
checked + 1 => checked
if empty_refused == 1:
    passed + 1 => passed

# Leading zeros must decode correctly and must NOT be canonical - both halves,
# because the point is that these are different questions.
checked + 1 => checked
if decode("007", 10) == 7 and aliases == 3:
    passed + 1 => passed

""^0
("checks passed: " + str(passed) + "/" + str(checked))^0
if passed == checked:
    "Every pair round-trips, and the encoding is canonical - two separate claims." => verdict
else:
    "FAILED - the codec did not behave as the checks describe." => verdict
verdict^0

""^0
"Round-tripping and canonicality are different properties and the second is" => n1
n1^0
"the one systems actually rely on: an id compared as a string, a cache key, a" => n2
n2^0
"signature over a serialised number. `007` and `7` are the same number and" => n3
n3^0
"not the same key, and only the encoder can decide which of those a system" => n4
n4^0
"is allowed to see." => n5
n5^0
```

## Python (deterministic transpilation)

```python
DIGITS = "0123456789abcdef"

def encode(n, base):
    if base < 2 or base > 16:
        raise ValueError("base must be between 2 and 16")
    if n == 0:
        return "0"
    sign = ""
    m = n
    if m < 0:
        sign = "-"
        m = 0 - m
    out = ""
    while m > 0:
        out = DIGITS[m % base] + out
        m = int(m / base)
    return sign + out

def digit_value(ch):
    for i in range(0, 16):
        if DIGITS[i] == ch:
            return i
    return 0 - 1

def decode(s, base):
    if base < 2 or base > 16:
        raise ValueError("base must be between 2 and 16")
    if len(s) == 0:
        raise ValueError("empty string is not a number")
    sign = 1
    body = s
    if s[0] == "-":
        sign = 0 - 1
        body = s[1:]
    if len(body) == 0:
        raise ValueError("sign with no digits")
    acc = 0
    for ch in body:
        d = digit_value(ch)
        if d < 0 or d >= base:
            raise ValueError("digit '" + ch + "' is not valid in base " + str(base))
        acc = acc * base + d
    return sign * acc

print("n      b=2          b=8      b=10   b=16   round-trips")
for n in [0, 1, 7, 10, 255, 0 - 1, 0 - 255]:
    ok = "yes"
    for b in [2, 8, 10, 16]:
        if not decode(encode(n, b), b) == n:
            ok = "NO"
    print("%-6d %-12s %-8s %-6s %-6s %s" % (n, encode(n, 2), encode(n, 8), encode(n, 10), encode(n, 16), ok))
pairs = 0
trips = 0
canonical = 0
trip_fail = []
canon_fail = []
for n in range(0 - 20, 61):
    for b in range(2, 17):
        pairs = pairs + 1
        s = encode(n, b)
        back = decode(s, b)
        if back == n:
            trips = trips + 1
        elif len(trip_fail) < 3:
            trip_fail = trip_fail + [str(n) + " base " + str(b) + " -> '" + s + "' -> " + str(back)]
        if encode(back, b) == s:
            canonical = canonical + 1
        elif len(canon_fail) < 3:
            canon_fail = canon_fail + [str(n) + " base " + str(b) + ": '" + s + "' -> '" + encode(back, b) + "'"]
print("")
print("(n, base) pairs swept:     " + str(pairs))
print("  round-tripped:           " + str(trips) + "/" + str(pairs))
print("  encoding was canonical:  " + str(canonical) + "/" + str(pairs))
for t in trip_fail:
    print("  trip fail: " + t)
for c in canon_fail:
    print("  canon fail: " + c)
noncanon = ""
aliases = 0
for s in ["7", "07", "007", "0007"]:
    v = decode(s, 10)
    if not encode(v, 10) == s:
        aliases = aliases + 1
    noncanon = noncanon + s + "->" + str(v) + " "
print("")
print("strings that decode to 7: " + noncanon)
print("of those, non-canonical:  " + str(aliases) + "/4")
print("")
print("the empty string:")
print("  encode(0, 10) = '" + encode(0, 10) + "'")
empty_refused = 0
try:
    v = decode("", 10)
    print("  decode('', 10) = " + str(v) + "   <- ACCEPTED, which is the bug")
except ValueError as e:
    empty_refused = 1
    print("  decode('', 10) raises: " + str(e))
refused = 0
bad_cases = []
for pair in [["2", 2], ["z", 16], ["-", 10], ["1g", 16], ["", 10]]:
    try:
        v = decode(pair[0], pair[1])
        bad_cases = bad_cases + ["'" + pair[0] + "' base " + str(pair[1]) + " -> " + str(v)]
    except ValueError as e:
        refused = refused + 1
base_refused = 0
for b in [0, 1, 17]:
    try:
        v = encode(5, b)
    except ValueError as e:
        base_refused = base_refused + 1
print("")
print("malformed strings refused: " + str(refused) + "/5")
print("illegal bases refused:     " + str(base_refused) + "/3")
passed = 0
checked = 0
checked = checked + 1
if trips == pairs:
    passed = passed + 1
checked = checked + 1
if canonical == pairs:
    passed = passed + 1
checked = checked + 1
if encode(0, 10) == "0" and encode(0, 2) == "0" and encode(0, 16) == "0":
    passed = passed + 1
checked = checked + 1
if empty_refused == 1:
    passed = passed + 1
checked = checked + 1
if decode("007", 10) == 7 and aliases == 3:
    passed = passed + 1
print("")
print("checks passed: " + str(passed) + "/" + str(checked))
if passed == checked:
    verdict = "Every pair round-trips, and the encoding is canonical - two separate claims."
else:
    verdict = "FAILED - the codec did not behave as the checks describe."
print(verdict)
print("")
n1 = "Round-tripping and canonicality are different properties and the second is"
print(n1)
n2 = "the one systems actually rely on: an id compared as a string, a cache key, a"
print(n2)
n3 = "signature over a serialised number. `007` and `7` are the same number and"
print(n3)
n4 = "not the same key, and only the encoder can decide which of those a system"
print(n4)
n5 = "is allowed to see."
print(n5)
```

## stdout (executed)

```text
n      b=2          b=8      b=10   b=16   round-trips
0      0            0        0      0      yes
1      1            1        1      1      yes
7      111          7        7      7      yes
10     1010         12       10     a      yes
255    11111111     377      255    ff     yes
-1     -1           -1       -1     -1     yes
-255   -11111111    -377     -255   -ff    yes

(n, base) pairs swept:     1215
  round-tripped:           1215/1215
  encoding was canonical:  1215/1215

strings that decode to 7: 7->7 07->7 007->7 0007->7 
of those, non-canonical:  3/4

the empty string:
  encode(0, 10) = '0'
  decode('', 10) raises: empty string is not a number

malformed strings refused: 5/5
illegal bases refused:     3/3

checks passed: 5/5
Every pair round-trips, and the encoding is canonical - two separate claims.

Round-tripping and canonicality are different properties and the second is
the one systems actually rely on: an id compared as a string, a cache key, a
signature over a serialised number. `007` and `7` are the same number and
not the same key, and only the encoder can decide which of those a system
is allowed to see.
```

## Round-trip

`ok: true` — round-trip fixpoint reached (python1 == python2)

## Trace event types

eml:run:start · eml:assign · eml:def · eml:output · eml:call · eml:return · eml:run:done
